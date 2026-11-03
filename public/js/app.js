/**
 * 露營猜歌遊戲 - 前端主應用控制器 (App Main Controller)
 */

import { AudioEngine } from './audioEngine.js';
import { SpeechMatcher } from './speechMatcher.js';

class CampfireSongApp {
  constructor() {
    this.socket = null;
    this.audio = new AudioEngine();
    this.speechMatcher = null;
    
    // 玩家與房間狀態
    this.myPlayerId = null;
    this.myPlayerName = localStorage.getItem('campfire_player_name') || '';
    this.currentRoomCode = null;
    this.isHost = false;
    this.roomState = null;
    this.mySubmissionsCount = 0;
    this.selectedChoiceId = null;
    this.timerInterval = null;

    this.initElements();
    this.initSpeechMatcher();
    this.initSocket();
    this.bindEvents();
    this.loadThemes();
    this.checkUrlRoomInvite();
    this.loadNetworkInfo();
  }

  initElements() {
    // 頁面 View 區塊
    this.views = {
      home: document.getElementById('view-home'),
      lobby: document.getElementById('view-lobby'),
      game: document.getElementById('view-game'),
      gameover: document.getElementById('view-gameover'),
      modalSubmission: document.getElementById('modal-submission')
    };

    // Header 元素
    this.badgeRoomCode = document.getElementById('badge-room-code');
    this.headerRoomBadge = document.getElementById('header-room-badge');

    // 首頁輸入與 QR 邀請元素
    this.qrInviteBanner = document.getElementById('qr-invite-banner');
    this.qrInviteRoomCode = document.getElementById('qr-invite-room-code');
    this.btnQuickJoinRoom = document.getElementById('btn-quick-join-room');
    this.normalHomeActions = document.getElementById('normal-home-actions');
    this.inputPlayerName = document.getElementById('input-player-name');
    this.inputJoinCode = document.getElementById('input-join-code');
    this.btnCreateRoom = document.getElementById('btn-create-room');
    this.btnJoinRoom = document.getElementById('btn-join-room');
    this.btnSoloMode = document.getElementById('btn-solo-mode');

    if (this.myPlayerName) {
      this.inputPlayerName.value = this.myPlayerName;
    }

    // 大廳元素
    this.lobbyQrImg = document.getElementById('lobby-qr-img');
    this.lobbyJoinUrl = document.getElementById('lobby-join-url');
    this.lobbyPlayerCount = document.getElementById('lobby-player-count');
    this.lobbyPlayersList = document.getElementById('lobby-players-list');
    this.hostSettingsPanel = document.getElementById('host-settings-panel');
    this.modeOptTheme = document.getElementById('mode-opt-theme');
    this.modeOptSubmission = document.getElementById('mode-opt-submission');
    this.themeSelectorGroup = document.getElementById('theme-selector-group');
    this.selectTheme = document.getElementById('select-theme');
    this.selectRounds = document.getElementById('select-rounds');
    this.selectSpeakerMode = document.getElementById('select-speaker-mode');
    this.submissionTriggerPanel = document.getElementById('submission-trigger-panel');
    this.btnOpenSubmissionModal = document.getElementById('btn-open-submission-modal');
    this.mySubmissionCountSpan = document.getElementById('my-submission-count');
    this.btnStartGame = document.getElementById('btn-start-game');
    this.waitingHostNotice = document.getElementById('waiting-host-notice');
    this.customThemeInputGroup = document.getElementById('custom-theme-input-group');
    this.inputCustomKeyword = document.getElementById('input-custom-keyword');

    // 即時戰況英雄榜與手機膠囊
    this.sidebarLiveScoreboardList = document.getElementById('sidebar-live-scoreboard-list');
    this.modalLiveScoreboard = document.getElementById('modal-live-scoreboard');
    this.modalLiveScoreboardList = document.getElementById('modal-live-scoreboard-list');
    this.mobileLeaderText = document.getElementById('mobile-leader-text');
    this.mobileMyRankText = document.getElementById('mobile-my-rank-text');
    this.btnToggleScoreboardDrawer = document.getElementById('btn-toggle-scoreboard-drawer');
    this.btnCloseScoreboardDrawer = document.getElementById('btn-close-scoreboard-drawer');

    // 遊戲畫面元素
    this.gameRoundIndicator = document.getElementById('game-round-indicator');
    this.gameMyScore = document.getElementById('game-my-score');
    this.vinylDisc = document.getElementById('vinyl-disc');
    this.vinylMysteryIcon = document.getElementById('vinyl-mystery-icon');
    this.vinylRevealedImg = document.getElementById('vinyl-revealed-img');
    this.trackTitle = document.getElementById('track-title');
    this.trackArtist = document.getElementById('track-artist');
    this.trackSubmitterTag = document.getElementById('track-submitter-tag');
    this.stageStatusTitle = document.getElementById('stage-status-title');
    this.stageTimerText = document.getElementById('stage-timer-text');
    this.timerBarFill = document.getElementById('timer-bar-fill');

    // 互動面板元素
    this.panelBuzzer = document.getElementById('panel-buzzer');
    this.btnBuzzer = document.getElementById('btn-buzzer');
    this.buzzerStatusMsg = document.getElementById('buzzer-status-msg');
    this.panelVerification = document.getElementById('panel-verification');
    this.inputBuzzerAnswer = document.getElementById('input-buzzer-answer');
    this.btnSubmitBuzzerText = document.getElementById('btn-submit-buzzer-text');
    this.btnMicRecord = document.getElementById('btn-mic-record');
    this.voiceTranscript = document.getElementById('voice-transcript');
    this.fastChoicesContainer = document.getElementById('fast-choices-container');
    this.panelSomeoneAnswering = document.getElementById('panel-someone-answering');
    this.answeringPlayerName = document.getElementById('answering-player-name');
    this.panelStage3Choices = document.getElementById('panel-stage3-choices');
    this.choices4Container = document.getElementById('choices-4-container');
    this.panelRevealControls = document.getElementById('panel-reveal-controls');
    this.revealToastMsg = document.getElementById('reveal-toast-msg');
    this.guestRevealHint = document.getElementById('guest-reveal-hint');
    this.btnReplayChorus = document.getElementById('btn-replay-chorus');
    this.btnNextRound = document.getElementById('btn-next-round');
    this.roundScoreboardCard = document.getElementById('round-scoreboard-card');
    this.roundScoreboardList = document.getElementById('round-scoreboard-list');

    // 頒獎台元素
    this.finalPodiumList = document.getElementById('final-podium-list');
    this.btnPlayAgain = document.getElementById('btn-play-again');

    // 投稿彈窗元素
    this.btnCloseSubmission = document.getElementById('btn-close-submission');
    this.btnDoneSubmission = document.getElementById('btn-done-submission');
    this.inputSongSearch = document.getElementById('input-song-search');
    this.btnSearchSong = document.getElementById('btn-search-song');
    this.searchResultsContainer = document.getElementById('search-results-container');
    this.modalSubmittedCount = document.getElementById('modal-submitted-count');
  }

  showView(viewName) {
    Object.keys(this.views).forEach(key => {
      if (this.views[key]) {
        this.views[key].style.display = (key === viewName) ? (key === 'modalSubmission' ? 'flex' : 'block') : 'none';
      }
    });
  }

  initSpeechMatcher() {
    this.speechMatcher = new SpeechMatcher(
      (transcript, isFinal) => {
        if (this.inputBuzzerAnswer && transcript) {
          this.inputBuzzerAnswer.value = transcript;
          this.socket.emit('search_buzzer_suggestions', {
            roomCode: this.currentRoomCode,
            query: transcript
          });
        }
        this.voiceTranscript.innerText = `🎤 辨識到：「${transcript}」`;
        if (isFinal && transcript && this.currentRoomCode) {
          // 語音辨識完成後也可直接送出或點選下方聯想詞
          this.socket.emit('submit_buzzer_answer', {
            roomCode: this.currentRoomCode,
            answer: transcript
          });
        }
      },
      (error) => {
        this.btnMicRecord.classList.remove('listening');
        this.voiceTranscript.innerText = '💡 請直接在上方輸入框打字（輸入 1 個字即跳出相關歌曲）！';
      }
    );
  }

  initSocket() {
    if (typeof io === 'undefined') {
      console.warn('Socket.IO 未連線，可運行單機模式');
      return;
    }
    this.socket = io();

    this.socket.on('connect', () => {
      this.myPlayerId = this.socket.id;
    });

    // 房間建立完成
    this.socket.on('room_created', ({ roomCode, playerId, state }) => {
      this.currentRoomCode = roomCode;
      this.myPlayerId = playerId;
      this.isHost = true;
      this.onRoomEntered(state);
    });

    // 房間加入完成
    this.socket.on('room_joined', ({ roomCode, playerId, state }) => {
      this.currentRoomCode = roomCode;
      this.myPlayerId = playerId;
      this.isHost = false;
      this.onRoomEntered(state);
    });

    // 房間公開狀態更新廣播
    this.socket.on('room_state_update', (state) => {
      this.onRoomStateUpdate(state);
    });

    // 搶鈴成功者作答提示 (開啟打字輸入與即時聯想)
    this.socket.on('buzzer_prompt_answer', ({ timeMs }) => {
      this.audio.playBuzzerSfx();
      this.prepareVerificationInput();
    });

    // 接收打字即時聯想候選清單
    this.socket.on('buzzer_suggestions_result', ({ query, suggestions }) => {
      this.renderAutocompleteSuggestions(suggestions);
    });

    // 主控台統一重播副歌大合唱
    this.socket.on('host_replay_chorus', ({ audioUrl }) => {
      if (audioUrl) {
        this.audio.playFull(audioUrl);
      }
    });

    // 搶答判定結果通知
    this.socket.on('buzzer_result', ({ success, playerName, message, scoreboard }) => {
      if (success) {
        this.audio.playCorrectSfx();
      } else {
        this.audio.playWrongSfx();
      }
      this.revealToastMsg.innerText = message;
      if (scoreboard) {
        this.updateLiveScoreboards(scoreboard);
      }
    });

    // 即時排行榜跳動通知 (Stage 3 或答題變動)
    this.socket.on('live_scoreboard_update', ({ scoreboard }) => {
      if (scoreboard) {
        this.updateLiveScoreboards(scoreboard);
      }
    });

    // 揭曉答案
    this.socket.on('round_revealed', (data) => {
      this.onRoundRevealed(data);
    });

    // 投稿確認
    this.socket.on('submission_ack', (res) => {
      if (res.success) {
        this.mySubmissionsCount = res.count;
        this.mySubmissionCountSpan.innerText = res.count;
        this.modalSubmittedCount.innerText = res.count;
      } else {
        alert(res.message);
      }
    });

    // 錯誤訊息
    this.socket.on('error_message', (msg) => {
      alert(msg);
    });
  }

  bindEvents() {
    // 掃描 QR Code 後的一鍵加入房間按鈕
    if (this.btnQuickJoinRoom) {
      this.btnQuickJoinRoom.addEventListener('click', () => {
        this.audio.initContext();
        const name = this.inputPlayerName.value.trim();
        if (!name) {
          this.inputPlayerName.focus();
          return alert('請先輸入你的暱稱喔！');
        }
        const code = this.inputJoinCode.value.trim().toUpperCase();
        this.savePlayerName(name);
        this.socket.emit('join_room', { roomCode: code, playerName: name });
      });
    }

    this.inputPlayerName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.urlRoomCode) {
        this.btnQuickJoinRoom.click();
      }
    });

    // 建立房間
    this.btnCreateRoom.addEventListener('click', () => {
      this.audio.initContext();
      const name = this.inputPlayerName.value.trim() || '營火守護者';
      this.savePlayerName(name);
      this.socket.emit('create_room', { playerName: name });
    });

    // 加入房間
    this.btnJoinRoom.addEventListener('click', () => {
      this.audio.initContext();
      const name = this.inputPlayerName.value.trim() || '露營好友';
      const code = this.inputJoinCode.value.trim().toUpperCase();
      if (!code) return alert('請輸入 4 碼房號！');
      this.savePlayerName(name);
      this.socket.emit('join_room', { roomCode: code, playerName: name });
    });

    // 單機模式
    this.btnSoloMode.addEventListener('click', () => {
      this.audio.initContext();
      this.startSoloMode();
    });

    // 遊戲設定切換 (房主)
    this.modeOptTheme.addEventListener('click', () => {
      this.modeOptTheme.className = 'btn-primary';
      this.modeOptSubmission.className = 'btn-secondary';
      this.themeSelectorGroup.style.display = 'block';
      this.submissionTriggerPanel.style.display = 'none';
      this.updateRoomSettings({ mode: 'THEME' });
    });

    this.modeOptSubmission.addEventListener('click', () => {
      this.modeOptTheme.className = 'btn-secondary';
      this.modeOptSubmission.className = 'btn-primary';
      this.themeSelectorGroup.style.display = 'none';
      this.submissionTriggerPanel.style.display = 'block';
      this.updateRoomSettings({ mode: 'SUBMISSION' });
    });

    this.selectTheme.addEventListener('change', () => {
      const isCustom = (this.selectTheme.value === 'custom');
      this.customThemeInputGroup.style.display = isCustom ? 'block' : 'none';
      this.updateRoomSettings({
        themeId: this.selectTheme.value,
        customKeyword: isCustom ? this.inputCustomKeyword.value.trim() : ''
      });
    });

    this.inputCustomKeyword.addEventListener('input', () => {
      this.updateRoomSettings({
        themeId: 'custom',
        customKeyword: this.inputCustomKeyword.value.trim()
      });
    });

    // 手機版戰況抽屜開關
    if (this.btnToggleScoreboardDrawer) {
      this.btnToggleScoreboardDrawer.addEventListener('click', () => {
        this.modalLiveScoreboard.style.display = 'flex';
      });
    }
    if (this.btnCloseScoreboardDrawer) {
      this.btnCloseScoreboardDrawer.addEventListener('click', () => {
        this.modalLiveScoreboard.style.display = 'none';
      });
    }

    this.selectRounds.addEventListener('change', () => {
      this.updateRoomSettings({ roundCount: parseInt(this.selectRounds.value, 10) });
    });

    this.selectSpeakerMode.addEventListener('change', () => {
      this.updateRoomSettings({ speakerMode: this.selectSpeakerMode.value });
    });

    // 開始遊戲按鈕 (房主)
    this.btnStartGame.addEventListener('click', () => {
      this.audio.initContext();
      this.socket.emit('start_game', { roomCode: this.currentRoomCode });
    });

    // 搶答大按鈕 (Stage 1 / 2)
    this.btnBuzzer.addEventListener('click', () => {
      this.audio.initContext();
      this.socket.emit('buzz_in', { roomCode: this.currentRoomCode });
    });

    // 第一、二階段搶答：打字即時聯想與送出
    if (this.inputBuzzerAnswer) {
      this.inputBuzzerAnswer.addEventListener('input', () => {
        const q = this.inputBuzzerAnswer.value.trim();
        if (!q) {
          this.fastChoicesContainer.innerHTML = '';
          return;
        }
        this.socket.emit('search_buzzer_suggestions', {
          roomCode: this.currentRoomCode,
          query: q
        });
      });

      this.inputBuzzerAnswer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.submitTypedBuzzerAnswer();
        }
      });
    }

    if (this.btnSubmitBuzzerText) {
      this.btnSubmitBuzzerText.addEventListener('click', () => {
        this.submitTypedBuzzerAnswer();
      });
    }

    // 語音辨識錄音按鈕
    this.btnMicRecord.addEventListener('click', () => {
      if (this.speechMatcher.isListening) {
        this.speechMatcher.stop();
        this.btnMicRecord.classList.remove('listening');
      } else {
        const started = this.speechMatcher.start();
        if (started) {
          this.btnMicRecord.classList.add('listening');
          this.voiceTranscript.innerText = '🎤 正在聆聽中... 大聲說出歌名或歌手！';
        }
      }
    });

    // 重新播放副歌 (統一通知主控台播放)
    this.btnReplayChorus.addEventListener('click', () => {
      if (this.currentRoomCode) {
        this.socket.emit('replay_chorus', { roomCode: this.currentRoomCode });
      }
    });

    // 下一題按鈕 (房主)
    this.btnNextRound.addEventListener('click', () => {
      this.socket.emit('next_round', { roomCode: this.currentRoomCode });
    });

    // 再玩一局按鈕
    this.btnPlayAgain.addEventListener('click', () => {
      this.socket.emit('restart_game', { roomCode: this.currentRoomCode });
    });

    // 私下投稿相關
    this.btnOpenSubmissionModal.addEventListener('click', () => {
      this.views.modalSubmission.style.display = 'flex';
    });

    this.btnCloseSubmission.addEventListener('click', () => {
      this.views.modalSubmission.style.display = 'none';
    });

    this.btnDoneSubmission.addEventListener('click', () => {
      this.views.modalSubmission.style.display = 'none';
    });

    this.btnSearchSong.addEventListener('click', () => this.searchSongsForSubmission());
    this.inputSongSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchSongsForSubmission();
    });
  }

  savePlayerName(name) {
    this.myPlayerName = name;
    localStorage.setItem('campfire_player_name', name);
  }

  updateRoomSettings(patch) {
    if (!this.isHost || !this.currentRoomCode) return;
    this.socket.emit('update_settings', {
      roomCode: this.currentRoomCode,
      settings: patch
    });
  }

  async loadThemes() {
    try {
      const res = await fetch('/api/music/themes');
      const themes = await res.json();
      const options = themes.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
      this.selectTheme.innerHTML = options + `<option value="custom">✨ 自訂任意歌手 / 主題關鍵字</option>`;
    } catch (e) {
      console.warn('讀取主題失敗:', e);
    }
  }

  updateLiveScoreboards(scoreboard) {
    if (!scoreboard || !Array.isArray(scoreboard)) return;
    const sorted = [...scoreboard].sort((a, b) => b.score - a.score);

    const html = sorted.map((p, idx) => `
      <div class="score-row ${idx === 0 ? 'rank-1' : ''}" style="margin-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 800; font-size: 15px;">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}</span>
          <span style="font-weight: 600;">${p.name} ${p.id === this.myPlayerId ? '<strong style="color:var(--accent-cyan);">(你)</strong>' : ''}</span>
        </div>
        <span class="score-points">${p.score} 分</span>
      </div>
    `).join('');

    if (this.sidebarLiveScoreboardList) {
      this.sidebarLiveScoreboardList.innerHTML = html;
    }
    if (this.modalLiveScoreboardList) {
      this.modalLiveScoreboardList.innerHTML = html;
    }

    if (sorted.length > 0) {
      const leader = sorted[0];
      if (this.mobileLeaderText) {
        this.mobileLeaderText.innerText = `👑 領先: ${leader.name} (${leader.score}分)`;
      }
      const myRankIdx = sorted.findIndex(p => p.id === this.myPlayerId);
      if (myRankIdx !== -1) {
        if (this.mobileMyRankText) {
          this.mobileMyRankText.innerText = `你第 ${myRankIdx + 1} 名 (${sorted[myRankIdx].score}分)`;
        }
        if (this.gameMyScore) {
          this.gameMyScore.innerText = `我的得分: ${sorted[myRankIdx].score}`;
        }
      }
    }
  }

  checkUrlRoomInvite() {
    const params = new URLSearchParams(window.location.search);
    const roomParam = (params.get('room') || '').trim().toUpperCase();
    if (roomParam && roomParam.length === 4) {
      this.urlRoomCode = roomParam;
      this.inputJoinCode.value = roomParam;
      if (this.qrInviteBanner) this.qrInviteBanner.style.display = 'block';
      if (this.qrInviteRoomCode) this.qrInviteRoomCode.innerText = roomParam;
      if (this.btnQuickJoinRoom) this.btnQuickJoinRoom.style.display = 'flex';
      if (this.normalHomeActions) this.normalHomeActions.style.display = 'none';
      setTimeout(() => this.inputPlayerName?.focus(), 100);
    }
  }

  async loadNetworkInfo(roomCode = '') {
    try {
      const url = roomCode
        ? `/api/network-info?room=${encodeURIComponent(roomCode)}`
        : '/api/network-info';
      const res = await fetch(url);
      const info = await res.json();
      if (info.qrCodeDataUrl) {
        this.lobbyQrImg.src = info.qrCodeDataUrl;
        this.lobbyJoinUrl.innerText = info.joinUrl;
      }
    } catch (e) {}
  }

  onRoomEntered(state) {
    this.roomState = state;
    this.headerRoomBadge.style.display = 'flex';
    this.badgeRoomCode.innerText = state.code;
    this.loadNetworkInfo(state.code);
    this.showView('lobby');
    this.renderLobbyState();
  }

  onRoomStateUpdate(state) {
    this.roomState = state;
    this.isHost = (state.hostId === this.myPlayerId);

    if (state.players) {
      this.updateLiveScoreboards(state.players);
    }

    // 依房間狀態切換主畫面
    if (state.status === 'LOBBY') {
      this.showView('lobby');
      this.renderLobbyState();
    } else if (state.status === 'PLAYING') {
      this.showView('game');
      this.renderGameState();
    } else if (state.status === 'GAME_OVER') {
      this.showView('gameover');
      this.renderGameOverState();
    }
  }

  renderLobbyState() {
    const state = this.roomState;
    this.lobbyPlayerCount.innerText = `${state.players.length} 位玩家已就緒`;

    // 渲染玩家清單
    this.lobbyPlayersList.innerHTML = state.players.map(p => `
      <div class="player-chip ${p.isHost ? 'is-host' : ''}">
        <span>${p.isHost ? '👑' : '🏕️'}</span>
        <span>${p.name}</span>
        ${state.settings.mode === 'SUBMISSION' ? `<span style="font-size: 11px; color: var(--accent-cyan);">(${p.submissionsCount}首)</span>` : ''}
      </div>
    `).join('');

    // 房主控制列
    if (this.isHost) {
      this.hostSettingsPanel.style.display = 'block';
      this.btnStartGame.style.display = 'block';
      this.waitingHostNotice.style.display = 'none';
    } else {
      this.hostSettingsPanel.style.display = 'none';
      this.btnStartGame.style.display = 'none';
      this.waitingHostNotice.style.display = 'block';
    }

    // 私下投稿按鈕顯示與否
    this.submissionTriggerPanel.style.display = (state.settings.mode === 'SUBMISSION') ? 'block' : 'none';
  }

  renderGameState() {
    const round = this.roomState.currentRound;
    if (!round) return;

    // 更新題號與個人分數
    this.gameRoundIndicator.innerText = `第 ${round.roundIndex + 1} / ${round.totalRounds} 題`;
    const me = this.roomState.players.find(p => p.id === this.myPlayerId);
    if (me) {
      this.gameMyScore.innerText = `我的得分: ${me.score}`;
    }

    // 判斷是否需要由本機播放音訊 (房主手機接喇叭 或 全員發聲)
    const shouldPlayAudio = (this.roomState.settings.speakerMode === 'all') || (this.isHost);

    // 處理各個階段
    this.panelBuzzer.style.display = 'none';
    this.panelVerification.style.display = 'none';
    this.panelSomeoneAnswering.style.display = 'none';
    this.panelStage3Choices.style.display = 'none';
    this.panelRevealControls.style.display = 'none';
    this.roundScoreboardCard.style.display = 'none';

    // 唱盤動畫
    if (round.stage === 'REVEAL') {
      this.vinylDisc.classList.remove('spinning');
      this.vinylMysteryIcon.style.display = 'none';
      this.vinylRevealedImg.style.display = 'block';
      this.vinylRevealedImg.src = round.artworkUrl;
      this.trackTitle.innerText = round.title;
      this.trackArtist.innerText = round.artist;
      if (round.submitterName) {
        this.trackSubmitterTag.style.display = 'inline-block';
        this.trackSubmitterTag.innerText = `🤫 這首由 ${round.submitterName} 秘密投稿！`;
      } else {
        this.trackSubmitterTag.style.display = 'none';
      }
    } else {
      // 答題期間：完全遮罩保密！
      this.vinylMysteryIcon.style.display = 'block';
      this.vinylRevealedImg.style.display = 'none';
      this.trackTitle.innerText = '盲盒黑膠播放中...';
      this.trackArtist.innerText = '前奏旋律辨識中，搶快拿高分！';
      this.trackSubmitterTag.style.display = 'none';
    }

    // 啟動倒數計時條
    this.startCountdownTimer(round.deadline);

    if (round.stage === 'STAGE_1') {
      this.stageStatusTitle.innerText = 'STAGE 1：前奏 1.2 秒挑戰 (+300分)';
      this.panelBuzzer.style.display = 'flex';
      this.btnBuzzer.classList.remove('disabled');

      if (shouldPlayAudio && round.audioUrl) {
        this.vinylDisc.classList.add('spinning');
        this.audio.playSnippet(round.audioUrl, 1.2, () => {
          this.vinylDisc.classList.remove('spinning');
        });
      }
    } else if (round.stage === 'STAGE_2') {
      this.stageStatusTitle.innerText = 'STAGE 2：進階 3.5 秒搶答 (+200分)';
      this.panelBuzzer.style.display = 'flex';
      this.btnBuzzer.classList.remove('disabled');

      if (shouldPlayAudio && round.audioUrl) {
        this.vinylDisc.classList.add('spinning');
        this.audio.playSnippet(round.audioUrl, 3.5, () => {
          this.vinylDisc.classList.remove('spinning');
        });
      }
    } else if (round.stage === 'BUZZER_LOCKED') {
      this.stageStatusTitle.innerText = '🚨 搶鈴成功！正在驗證答案...';
      const isMe = round.buzzerWinner?.id === this.myPlayerId;
      if (isMe) {
        this.panelVerification.style.display = 'flex';
      } else {
        this.panelSomeoneAnswering.style.display = 'block';
        this.answeringPlayerName.innerText = `📢 ${round.buzzerWinner?.name || '有人'} 搶答了！`;
      }
    } else if (round.stage === 'STAGE_3') {
      this.stageStatusTitle.innerText = 'STAGE 3：全體四選一競速 (+100~150分)';
      this.panelStage3Choices.style.display = 'block';
      this.renderStage3Choices(round.choices);

      if (shouldPlayAudio && round.audioUrl) {
        this.vinylDisc.classList.add('spinning');
        this.audio.playFull(round.audioUrl);
      }
    } else if (round.stage === 'REVEAL') {
      this.stageStatusTitle.innerText = '🎉 正解揭曉！露營大合唱時間';
      this.panelRevealControls.style.display = 'block';
      this.roundScoreboardCard.style.display = 'block';
      this.btnReplayChorus.style.display = this.isHost ? 'inline-block' : 'none';
      this.btnNextRound.style.display = this.isHost ? 'inline-block' : 'none';
      if (this.guestRevealHint) {
        this.guestRevealHint.style.display = this.isHost ? 'none' : 'block';
      }

      // 揭曉時播放副歌
      if (shouldPlayAudio && round.audioUrl) {
        this.audio.playFull(round.audioUrl);
      }

      this.renderScoreboard(this.roundScoreboardList);
    }
  }

  startCountdownTimer(deadline) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (!deadline) {
      this.stageTimerText.innerText = '--:--';
      this.timerBarFill.style.width = '0%';
      return;
    }

    const totalDuration = Math.max(1000, deadline - Date.now());
    const update = () => {
      const remaining = Math.max(0, deadline - Date.now());
      const sec = (remaining / 1000).toFixed(1);
      this.stageTimerText.innerText = `${sec}s`;
      const pct = Math.min(100, Math.max(0, (remaining / totalDuration) * 100));
      this.timerBarFill.style.width = `${pct}%`;

      if (remaining <= 0) {
        clearInterval(this.timerInterval);
      }
    };
    update();
    this.timerInterval = setInterval(update, 100);
  }

  prepareVerificationInput() {
    if (this.inputBuzzerAnswer) {
      this.inputBuzzerAnswer.value = '';
      setTimeout(() => this.inputBuzzerAnswer.focus(), 80);
    }
    if (this.fastChoicesContainer) {
      this.fastChoicesContainer.innerHTML = '';
    }
    if (this.voiceTranscript) {
      this.voiceTranscript.innerText = '💡 輸入 1 個字（例如「蔡」）下方就會自動跳出相關歌手＋歌名讓你點選！';
    }
  }

  submitTypedBuzzerAnswer() {
    const val = (this.inputBuzzerAnswer?.value || '').trim();
    if (!val) return;
    this.socket.emit('submit_buzzer_answer', {
      roomCode: this.currentRoomCode,
      answer: val
    });
  }

  renderAutocompleteSuggestions(suggestions) {
    if (!this.fastChoicesContainer) return;
    if (!suggestions || suggestions.length === 0) {
      this.fastChoicesContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; font-size: 12px; color: var(--text-dim); padding: 6px;">無相符聯想詞，可直接按「送出」比對你輸入的歌名！</div>';
      return;
    }

    this.fastChoicesContainer.innerHTML = suggestions.map(s => `
      <button class="choice-btn-fast" data-title="${s.title}">
        🎵 ${s.displayText}
      </button>
    `).join('');

    this.fastChoicesContainer.querySelectorAll('.choice-btn-fast').forEach(btn => {
      btn.addEventListener('click', () => {
        const songTitle = btn.getAttribute('data-title');
        this.socket.emit('submit_buzzer_answer', {
          roomCode: this.currentRoomCode,
          answer: songTitle
        });
      });
    });
  }

  renderStage3Choices(choices) {
    this.selectedChoiceId = null;
    const icons = ['▲', '◆', '●', '■'];
    this.choices4Container.innerHTML = choices.map((c, idx) => `
      <button class="choice-card-4 choice-color-${idx % 4}" data-id="${c.id}">
        <span class="choice-shape-icon">${icons[idx % 4]}</span>
        <span>${c.title} - ${c.artist}</span>
      </button>
    `).join('');

    this.choices4Container.querySelectorAll('.choice-card-4').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.selectedChoiceId) return;
        this.selectedChoiceId = btn.getAttribute('data-id');
        btn.style.boxShadow = '0 0 20px #fff';
        btn.style.border = '2px solid #fff';
        this.audio.playTickSfx();

        this.socket.emit('submit_stage3_answer', {
          roomCode: this.currentRoomCode,
          choiceId: this.selectedChoiceId
        });
      });
    });
  }

  onRoundRevealed(data) {
    // 答案揭曉
    this.renderGameState();
  }

  renderScoreboard(container) {
    const sorted = [...this.roomState.players].sort((a, b) => b.score - a.score);
    container.innerHTML = sorted.map((p, idx) => `
      <div class="score-row ${idx === 0 ? 'rank-1' : ''}">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-weight: 800; font-size: 16px;">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}</span>
          <span>${p.name} ${p.id === this.myPlayerId ? '<strong style="color:var(--accent-cyan);">(你)</strong>' : ''}</span>
        </div>
        <span class="score-points">${p.score} 分</span>
      </div>
    `).join('');
  }

  renderGameOverState() {
    this.renderScoreboard(this.finalPodiumList);
  }

  // 歌曲私下投稿搜尋
  async searchSongsForSubmission() {
    const q = this.inputSongSearch.value.trim();
    if (!q) return;
    this.searchResultsContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 12px;">🔍 搜尋中...</div>';

    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(q)}`);
      const tracks = await res.json();
      if (!tracks || tracks.length === 0) {
        this.searchResultsContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 12px;">找不到這首歌，換個關鍵字試試！</div>';
        return;
      }

      this.searchResultsContainer.innerHTML = tracks.map(t => `
        <div class="search-item">
          <div class="search-item-info">
            <img class="search-thumb" src="${t.artworkUrl}" alt="Cover">
            <div>
              <div style="font-weight: 700; font-size: 14px;">${t.title}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${t.artist}</div>
            </div>
          </div>
          <button class="btn-primary btn-submit-song" data-song='${JSON.stringify(t)}' style="padding: 8px 14px; font-size: 13px;">
            投稿
          </button>
        </div>
      `).join('');

      this.searchResultsContainer.querySelectorAll('.btn-submit-song').forEach(btn => {
        btn.addEventListener('click', () => {
          const songData = JSON.parse(btn.getAttribute('data-song'));
          this.socket.emit('submit_song', {
            roomCode: this.currentRoomCode,
            track: songData
          });
          btn.innerText = '已投！';
          btn.style.background = '#10b981';
          btn.disabled = true;
        });
      });
    } catch (e) {
      this.searchResultsContainer.innerHTML = '<div style="text-align: center; color: var(--accent-red); padding: 12px;">搜尋連線異常</div>';
    }
  }

  // 單機模式
  startSoloMode() {
    const name = this.inputPlayerName.value.trim() || '露營歌王';
    this.savePlayerName(name);
    // 直接建立一間房即可一人與現場朋友同機玩
    this.socket.emit('create_room', { playerName: name });
  }
}

// 頁面載入後啟動
window.addEventListener('DOMContentLoaded', () => {
  window.app = new CampfireSongApp();
});
