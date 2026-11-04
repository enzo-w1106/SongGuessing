/**
 * 露營猜歌遊戲 - 前端音訊引擎與合成音效 (Audio Engine & Web Audio SFX)
 * 採用 Web Audio API (AudioContext + AudioBufferSourceNode) 作為主力播放核心，
 * 徹底解決手機瀏覽器 (iOS Safari / Android Chrome) 在 WebSocket 事件中阻擋 <audio> 自動播放的問題！
 */

export class AudioEngine {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.playsInline = true;
    this.audioElement.setAttribute('playsinline', '');
    this.audioElement.setAttribute('webkit-playsinline', '');

    this.audioCache = new Map(); // url -> ObjectURL (fallback)
    this.bufferCache = new Map(); // url -> AudioBuffer (Web Audio API 高速快取)
    this.audioContext = null;
    this.currentSourceNode = null;
    this.currentGainNode = null;
    this.fadeInterval = null;
    this.playTimer = null;
    this.playToken = 0; // 防止非同步載入完成時覆蓋新階段的播放狀態
    this.htmlAudioUnlocked = false;
    this.onAutoplayBlocked = null;

    // 綁定全域點擊與觸控結束事件，確保手機與電腦端 AudioContext 隨時保持 running 狀態
    const unlockHandler = () => {
      this.initContext();
    };
    window.addEventListener('touchend', unlockHandler, { passive: true });
    window.addEventListener('click', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });
  }

  /**
   * 初始化並解鎖 Web Audio API 與 HTML5 Audio (由使用者點擊「加入房間」等手勢觸發)
   */
  initContext() {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      // 播放一個 1-sample 無聲 Buffer 徹底喚醒 iOS / Android Web Audio 硬體管道
      if (this.audioContext && this.audioContext.state === 'running') {
        const silentBuf = this.audioContext.createBuffer(1, 1, 22050);
        const src = this.audioContext.createBufferSource();
        src.buffer = silentBuf;
        src.connect(this.audioContext.destination);
        src.start(0);
      }
    } catch (e) {}

    // 同步解鎖備援用 HTMLAudioElement
    if (!this.htmlAudioUnlocked && this.audioElement) {
      try {
        const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        this.audioElement.src = silentWav;
        this.audioElement.volume = 0.01;
        const p = this.audioElement.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            this.htmlAudioUnlocked = true;
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.audioElement.volume = 1.0;
          }).catch(() => {});
        }
      } catch (e) {}
    }
  }

  /**
   * 下載並解碼音訊為 Web Audio API AudioBuffer（支援快取，同一首歌 Stage 1/2/3/揭曉 零延遲瞬播）
   */
  async loadAudioBuffer(url) {
    if (!url) return null;
    if (this.bufferCache.has(url)) {
      return this.bufferCache.get(url);
    }
    this.initContext();
    if (!this.audioContext) return null;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Audio fetch failed: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();

    // 相容舊版 Safari callback 與新版 Promise decodeAudioData
    const audioBuffer = await new Promise((resolve, reject) => {
      this.audioContext.decodeAudioData(
        arrayBuffer,
        (decoded) => resolve(decoded),
        (err) => reject(err)
      );
    });

    this.bufferCache.set(url, audioBuffer);
    return audioBuffer;
  }

  /**
   * 預載快取音訊
   */
  async preloadTrack(url) {
    if (!url) return url;
    try {
      await this.loadAudioBuffer(url);
    } catch (e) {}
    return url;
  }

  /**
   * 停止目前播放並清除所有計時器與音源節點
   */
  stop() {
    this.playToken++;

    if (this.playTimer) {
      clearTimeout(this.playTimer);
      this.playTimer = null;
    }
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.onended = null;
        this.currentSourceNode.stop(0);
        this.currentSourceNode.disconnect();
      } catch (e) {}
      this.currentSourceNode = null;
    }

    if (this.currentGainNode) {
      try {
        this.currentGainNode.disconnect();
      } catch (e) {}
      this.currentGainNode = null;
    }

    try {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.volume = 1.0;
    } catch (e) {}
  }

  /**
   * 精準秒數切片播放 (如 1.2 秒或 3.5 秒)
   * 優先透過 Web Audio API 播放，確保所有參與者手機與電腦皆能同步自動出聲！
   */
  async playSnippet(url, durationSec, onEnd) {
    this.stop();
    const myToken = this.playToken;

    try {
      const buffer = await this.loadAudioBuffer(url);
      if (myToken !== this.playToken) return; // 已被新階段取消

      if (buffer && this.audioContext) {
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        source.buffer = buffer;
        source.loop = false;

        const now = this.audioContext.currentTime;
        const fadeSec = 0.2;
        const playSec = Math.max(0.3, durationSec);

        gainNode.gain.setValueAtTime(1.0, now);
        gainNode.gain.setValueAtTime(1.0, now + Math.max(0.1, playSec - fadeSec));
        gainNode.gain.linearRampToValueAtTime(0.001, now + playSec);

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        this.currentSourceNode = source;
        this.currentGainNode = gainNode;

        source.start(0, 0, playSec);
        this.playTimer = setTimeout(() => {
          if (myToken === this.playToken && onEnd) onEnd();
        }, playSec * 1000);
        return;
      }
    } catch (webAudioErr) {
      console.warn('Web Audio 播放切換至 HTML5 Audio 備援:', webAudioErr);
    }

    // 備援方案：使用 HTMLAudioElement 播放
    if (myToken !== this.playToken) return;
    const sourceUrl = this.audioCache.get(url) || url;
    this.audioElement.loop = false;
    this.audioElement.src = sourceUrl;
    this.audioElement.volume = 1.0;

    try {
      await this.audioElement.play();
      const fadeDuration = 200;
      const playDurationMs = durationSec * 1000;

      this.playTimer = setTimeout(() => {
        let vol = 1.0;
        this.fadeInterval = setInterval(() => {
          vol -= 0.15;
          if (vol <= 0.05) {
            clearInterval(this.fadeInterval);
            this.audioElement.pause();
            if (onEnd) onEnd();
          } else {
            this.audioElement.volume = Math.max(0, vol);
          }
        }, 30);
      }, Math.max(100, playDurationMs - fadeDuration));
    } catch (err) {
      console.warn('音訊自動播放被瀏覽器阻擋，需點擊畫面放音:', err);
      if (this.onAutoplayBlocked) this.onAutoplayBlocked();
    }
  }

  /**
   * 完整播放或揭曉後的副歌合唱播放
   */
  async playFull(url) {
    this.stop();
    const myToken = this.playToken;

    try {
      const buffer = await this.loadAudioBuffer(url);
      if (myToken !== this.playToken) return;

      if (buffer && this.audioContext) {
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        source.buffer = buffer;
        source.loop = true;
        gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        this.currentSourceNode = source;
        this.currentGainNode = gainNode;

        source.start(0);
        return;
      }
    } catch (webAudioErr) {
      console.warn('Web Audio 全曲播放切換至 HTML5 Audio 備援:', webAudioErr);
    }

    if (myToken !== this.playToken) return;
    const sourceUrl = this.audioCache.get(url) || url;
    this.audioElement.src = sourceUrl;
    this.audioElement.volume = 1.0;
    this.audioElement.loop = true;
    try {
      await this.audioElement.play();
    } catch (err) {
      console.warn('副歌播放受阻:', err);
      if (this.onAutoplayBlocked) this.onAutoplayBlocked();
    }
  }

  // ==========================================
  // Web Audio API 即時合成音效 (無需任何外部音檔)
  // ==========================================

  /**
   * 搶答按鈴鈴聲 (高昂清脆雙音調)
   */
  playBuzzerSfx() {
    try {
      this.initContext();
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);

      if (navigator.vibrate) {
        navigator.vibrate([80, 40, 80]);
      }
    } catch (e) {
      console.log('SFX buzzer error:', e);
    }
  }

  /**
   * 答對音效 (歡慶大三和弦)
   */
  playCorrectSfx() {
    try {
      this.initContext();
      const ctx = this.audioContext;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }

  /**
   * 答錯音效 (低音滑落蜂鳴)
   */
  playWrongSfx() {
    try {
      this.initContext();
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  /**
   * 倒數計時滴答聲
   */
  playTickSfx() {
    try {
      this.initContext();
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }
}
