/**
 * 露營猜歌遊戲 - 前端音訊引擎與合成音效 (Audio Engine & Web Audio SFX)
 */

export class AudioEngine {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';
    this.audioElement.playsInline = true;
    this.audioElement.setAttribute('playsinline', '');
    this.audioElement.setAttribute('webkit-playsinline', '');
    this.audioCache = new Map(); // url -> ObjectURL
    this.audioContext = null;
    this.fadeInterval = null;
    this.playTimer = null;
    this.htmlAudioUnlocked = false;
    this.onAutoplayBlocked = null;

    // 綁定全域首次點擊/觸控自動解鎖手機瀏覽器音訊限制 (iOS Safari / Android Chrome)
    const unlockHandler = () => {
      this.initContext();
    };
    window.addEventListener('touchstart', unlockHandler, { passive: true, once: true });
    window.addEventListener('click', unlockHandler, { passive: true, once: true });
  }

  /**
   * 初始化 Web Audio API 與解鎖手機 HTML5 Audio (需使用者手勢觸發)
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
    } catch (e) {}

    // 同步解鎖手機端 HTMLAudioElement (解決手機在 WebSocket 事件中無法自動出聲的問題)
    if (!this.htmlAudioUnlocked && this.audioElement) {
      this.htmlAudioUnlocked = true;
      try {
        const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        this.audioElement.src = silentWav;
        this.audioElement.volume = 0.01;
        const p = this.audioElement.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.audioElement.volume = 1.0;
          }).catch(() => {
            this.htmlAudioUnlocked = false;
          });
        }
      } catch (e) {
        this.htmlAudioUnlocked = false;
      }
    }
  }

  /**
   * 預載快取音訊 (抗露營區網路不穩)
   */
  async preloadTrack(url) {
    if (!url || this.audioCache.has(url)) return this.audioCache.get(url);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      this.audioCache.set(url, blobUrl);
      return blobUrl;
    } catch (e) {
      console.warn('音訊快取失敗，將使用直接串流:', e);
      return url;
    }
  }

  /**
   * 停止目前播放並清除計時器
   */
  stop() {
    if (this.playTimer) {
      clearTimeout(this.playTimer);
      this.playTimer = null;
    }
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.audioElement.volume = 1.0;
  }

  /**
   * 精準秒數切片播放 (如 1.2 秒或 3.5 秒)
   */
  async playSnippet(url, durationSec, onEnd) {
    this.stop();
    this.htmlAudioUnlocked = true;
    const sourceUrl = this.audioCache.get(url) || url;
    this.audioElement.loop = false;
    this.audioElement.src = sourceUrl;
    this.audioElement.volume = 1.0;

    try {
      await this.audioElement.play();

      // 在播放時間結束前 200ms 開始淡出
      const fadeDuration = 200;
      const playDurationMs = durationSec * 1000;

      this.playTimer = setTimeout(() => {
        // 淡出並暫停
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
    this.htmlAudioUnlocked = true;
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

      // 手機觸覺震動 (若裝置支援)
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
