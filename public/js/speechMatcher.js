/**
 * 露營猜歌遊戲 - 語音辨識與比對模組 (Web Speech API)
 */

export class SpeechMatcher {
  constructor(onResultCallback, onErrorCallback) {
    this.onResult = onResultCallback;
    this.onError = onErrorCallback;
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.isSupported = true;
      this.recognition = new SpeechRec();
      this.recognition.lang = 'zh-TW';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (this.onResult) {
          const isFinal = event.results[event.results.length - 1].isFinal;
          this.onResult(transcript.trim(), isFinal);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('語音辨識事件:', event.error);
        this.isListening = false;
        if (this.onError) this.onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  /**
   * 開始聆聽玩家說出歌名
   */
  start() {
    if (!this.isSupported || !this.recognition) return false;
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      console.warn('語音辨識啟動例外:', e);
      return false;
    }
  }

  /**
   * 停止聆聽
   */
  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
}
