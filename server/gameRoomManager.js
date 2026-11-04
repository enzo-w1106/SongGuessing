/**
 * 露營猜歌遊戲 - 多人房間管理與狀態機核心 (Game Room Manager)
 */

import { fetchThemeTracks, generateChoices, fuzzyMatchSongTitle, normalizeSongTitle, getAutocompleteSuggestions, getThemeDisplayName } from './musicService.js';

export class GameRoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomCode -> Room Object
  }

  /**
   * 產生 4 碼英數字房號
   */
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去除易混淆字元如 0/O, 1/I
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // 避免重複
    if (this.rooms.has(code)) return this.generateRoomCode();
    return code;
  }

  /**
   * 建立新房間 (房主)
   */
  createRoom(hostSocketId, hostName) {
    const roomCode = this.generateRoomCode();
    const room = {
      code: roomCode,
      hostId: hostSocketId,
      hostName: hostName || '營火守護者',
      players: new Map(), // socketId -> Player
      status: 'LOBBY', // LOBBY, SUBMISSION, PLAYING, GAME_OVER
      settings: {
        mode: 'THEME', // 'THEME' (主題盲抽) 或 'SUBMISSION' (私下投稿大亂鬥)
        themeId: 'mandopop_classic',
        roundCount: 8,
        speakerMode: 'all', // 預設 'all' (所有人裝置同步發聲), 可切換為 'host' (僅主控台接喇叭播)
      },
      submissions: new Map(), // socketId -> Array of tracks
      tracks: [], // 本局抽取/混洗後的題庫 (包含正解，僅伺服器可見)
      currentRoundIndex: -1,
      currentTrack: null,
      currentStage: null, // 'STAGE_1', 'STAGE_2', 'BUZZER_LOCKED', 'STAGE_3', 'REVEAL'
      stageTimer: null,
      stageDeadline: null,
      buzzerWinner: null,
      lockedOutPlayerIds: new Set(), // 本題已答錯鎖定之玩家
      stage3Answers: new Map(), // socketId -> { choiceId, timeMs, isCorrect, points }
      createdAt: Date.now()
    };

    // 房主也是玩家之一，享有同等參賽資格
    const hostPlayer = {
      id: hostSocketId,
      name: hostName || '營火守護者',
      score: 0,
      isHost: true,
      submissionsCount: 0,
      buzzedFastestCount: 0
    };
    room.players.set(hostSocketId, hostPlayer);
    this.rooms.set(roomCode, room);

    return room;
  }

  /**
   * 取得房間公開資訊（安全遮罩，絕不洩漏正解與未揭曉題目）
   */
  getRoomPublicState(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) return null;

    const playersList = Array.from(room.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
      isHost: p.isHost,
      submissionsCount: room.submissions.get(p.id)?.length || 0
    }));

    // 若在答題階段，僅對前端提供音訊與選項，嚴格隱藏歌名、歌手與專輯圖
    let currentRoundData = null;
    if (room.currentTrack && room.status === 'PLAYING') {
      const isRevealed = room.currentStage === 'REVEAL';
      currentRoundData = {
        roundIndex: room.currentRoundIndex,
        totalRounds: room.tracks.length,
        audioUrl: room.currentTrack.audioUrl,
        stage: room.currentStage,
        deadline: room.stageDeadline,
        buzzerWinner: room.buzzerWinner ? {
          id: room.buzzerWinner.id,
          name: room.buzzerWinner.name
        } : null,
        // 揭曉時才公開的資訊
        title: isRevealed ? room.currentTrack.title : '？？？',
        artist: isRevealed ? room.currentTrack.artist : '？？？',
        album: isRevealed ? room.currentTrack.album : '',
        artworkUrl: isRevealed ? room.currentTrack.artworkUrl : '',
        submitterName: isRevealed ? room.currentTrack.submitterName : null,
        // Stage 3 四選一選項 (只傳選項，不傳正確與否)
        choices: room.currentChoices || []
      };
    }

    return {
      code: room.code,
      hostId: room.hostId,
      status: room.status,
      settings: {
        ...room.settings,
        themeName: getThemeDisplayName(room.settings)
      },
      players: playersList,
      currentRound: currentRoundData
    };
  }

  /**
   * 廣播房間狀態更新給該房所有玩家
   */
  broadcastRoomState(roomCode) {
    const publicState = this.getRoomPublicState(roomCode);
    if (publicState) {
      this.io.to(roomCode).emit('room_state_update', publicState);
    }
  }

  /**
   * 玩家加入房間
   */
  joinRoom(roomCode, socketId, playerName) {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) {
      return { success: false, message: '找不到此房號，請確認後再試！' };
    }

    if (room.players.has(socketId)) {
      return { success: true, room };
    }

    const player = {
      id: socketId,
      name: playerName || `露營隊友_${room.players.size + 1}`,
      score: 0,
      isHost: false,
      submissionsCount: 0,
      buzzedFastestCount: 0
    };

    room.players.set(socketId, player);
    return { success: true, room };
  }

  /**
   * 玩家離開或斷線
   */
  removePlayer(socketId) {
    for (const [code, room] of this.rooms.entries()) {
      if (room.players.has(socketId)) {
        room.players.delete(socketId);
        room.submissions.delete(socketId);

        // 如果離開的是房主且房間還有其他人，順移房主身分
        if (room.hostId === socketId && room.players.size > 0) {
          const nextHost = room.players.values().next().value;
          nextHost.isHost = true;
          room.hostId = nextHost.id;
          room.hostName = nextHost.name;
        }

        // 若無任何人，刪除房間
        if (room.players.size === 0) {
          if (room.stageTimer) clearTimeout(room.stageTimer);
          this.rooms.delete(code);
        } else {
          this.broadcastRoomState(code);
        }
        return code;
      }
    }
    return null;
  }

  /**
   * 更新房間設定 (房主)
   */
  updateSettings(roomCode, socketId, newSettings) {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== socketId) return false;
    room.settings = { ...room.settings, ...newSettings };
    this.broadcastRoomState(roomCode);
    return true;
  }

  /**
   * 玩家私下投稿歌曲
   */
  submitSong(roomCode, socketId, track) {
    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, message: '房間不存在' };

    if (!room.submissions.has(socketId)) {
      room.submissions.set(socketId, []);
    }
    const playerSubmissions = room.submissions.get(socketId);
    if (playerSubmissions.length >= 5) {
      return { success: false, message: '每人最多私下投稿 5 首歌喔！' };
    }

    const player = room.players.get(socketId);
    const enrichedTrack = {
      ...track,
      submitterId: socketId,
      submitterName: player ? player.name : '神秘隊友'
    };
    playerSubmissions.push(enrichedTrack);

    this.broadcastRoomState(roomCode);
    return { success: true, count: playerSubmissions.length };
  }

  /**
   * 開始遊戲 (房主觸發)
   */
  async startGame(roomCode, socketId, initialSettings = null) {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== socketId) return false;

    if (initialSettings && typeof initialSettings === 'object') {
      room.settings = { ...room.settings, ...initialSettings };
    }

    // 清空上一局累計分數（若重新開始）
    for (const p of room.players.values()) {
      p.score = 0;
    }

    let trackPool = [];
    if (room.settings.mode === 'SUBMISSION') {
      // 從所有玩家投稿中收集歌曲
      for (const list of room.submissions.values()) {
        trackPool.push(...list);
      }
      // 如果投稿數量太少，自動用主題歌曲補足
      if (trackPool.length < 4) {
        const themeFiller = await fetchThemeTracks(room.settings.themeId, 10);
        trackPool.push(...themeFiller);
      }
    } else {
      // 主題隨機盲抽模式
      trackPool = await fetchThemeTracks(room.settings.themeId, room.settings.roundCount || 8, room.settings.customKeyword);
    }

    // 隨機混洗題庫，確保房主完全無法預測曲目順序
    room.tracks = trackPool.sort(() => Math.random() - 0.5);
    room.status = 'PLAYING';
    room.currentRoundIndex = -1;

    // 開始第一題
    this.nextRound(roomCode);
    return true;
  }

  /**
   * 進入下一題
   */
  nextRound(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room || room.status !== 'PLAYING') return;

    if (room.stageTimer) clearTimeout(room.stageTimer);

    room.currentRoundIndex++;
    if (room.currentRoundIndex >= room.tracks.length) {
      // 遊戲結束，進入頒獎台
      room.status = 'GAME_OVER';
      room.currentStage = 'GAME_OVER';
      this.broadcastRoomState(roomCode);
      return;
    }

    room.currentTrack = room.tracks[room.currentRoundIndex];
    room.lockedOutPlayerIds.clear();
    room.stage3Answers.clear();
    room.buzzerWinner = null;

    // 產生高難度防刪去法選項 (優先抽同歌手其他歌曲，並排除本局已播過題目)
    const playedTracks = room.tracks.slice(0, room.currentRoundIndex);
    room.currentChoices = generateChoices(room.currentTrack, room.tracks, 4, playedTracks);

    // 進入 Stage 1: 1.2 秒前奏搶答
    this.startStage1(roomCode);
  }

  /**
   * 重新開始新的一局 (結算畫面時任何房內玩家或房主皆可觸發回到大廳)
   */
  restartGame(roomCode, socketId) {
    const room = this.rooms.get(roomCode);
    if (!room || !room.players.has(socketId)) return false;
    if (room.status !== 'GAME_OVER' && room.hostId !== socketId) return false;

    if (room.stageTimer) {
      clearTimeout(room.stageTimer);
      room.stageTimer = null;
    }

    room.status = 'LOBBY';
    room.currentStage = null;
    room.currentTrack = null;
    room.currentRoundIndex = -1;
    room.buzzerWinner = null;
    room.lockedOutPlayerIds.clear();
    room.stage3Answers.clear();
    room.players.forEach(p => {
      p.score = 0;
      p.streak = 0;
    });

    this.broadcastRoomState(roomCode);
    return true;
  }

  /**
   * 階段 1: 1.2 秒前奏搶答 (300 分)
   */
  startStage1(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    room.currentStage = 'STAGE_1';
    room.buzzerWinner = null;
    const duration = 7000; // 播放 1.2 秒 + 給予 5.8 秒思考搶答時間
    room.stageDeadline = Date.now() + duration;

    this.broadcastRoomState(roomCode);

    room.stageTimer = setTimeout(() => {
      // 時間內無人按鈴搶答，自動進入 Stage 2
      if (room.currentStage === 'STAGE_1') {
        this.startStage2(roomCode);
      }
    }, duration);
  }

  /**
   * 階段 2: 3.5 秒進階搶答 (200 分)
   */
  startStage2(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    if (room.stageTimer) clearTimeout(room.stageTimer);
    room.currentStage = 'STAGE_2';
    room.buzzerWinner = null;
    const duration = 9000; // 播放 3.5 秒 + 給予 5.5 秒思考搶答
    room.stageDeadline = Date.now() + duration;

    this.broadcastRoomState(roomCode);

    room.stageTimer = setTimeout(() => {
      // 時間內無人搶答，進入 Stage 3 全體四選一競速
      if (room.currentStage === 'STAGE_2') {
        this.startStage3(roomCode);
      }
    }, duration);
  }

  /**
   * 玩家按鈴搶答
   */
  buzzIn(roomCode, socketId) {
    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, message: '房間不存在' };

    // 只有在 STAGE_1 或 STAGE_2 且尚未被鎖定時才能搶答
    if (room.currentStage !== 'STAGE_1' && room.currentStage !== 'STAGE_2') {
      return { success: false, message: '目前非搶答時段！' };
    }

    if (room.lockedOutPlayerIds.has(socketId)) {
      return { success: false, message: '您本題已經答錯過囉，保留機會給其他人！' };
    }

    if (room.buzzerWinner) {
      return { success: false, message: '已經有人快了一步按鈴！' };
    }

    // 搶鈴成功！暫停當前階段計時
    if (room.stageTimer) clearTimeout(room.stageTimer);

    const player = room.players.get(socketId);
    room.buzzerWinner = player;
    room.previousStage = room.currentStage; // 記錄是在 Stage 1 還是 Stage 2 搶的
    room.currentStage = 'BUZZER_LOCKED';
    
    // 給予 12 秒打字/語音作答驗證時間
    const answerDuration = 12000;
    room.stageDeadline = Date.now() + answerDuration;

    this.broadcastRoomState(roomCode);

    // 伺服器通知該特定玩家開啟打字輸入與聯想面板
    this.io.to(socketId).emit('buzzer_prompt_answer', {
      timeMs: answerDuration
    });

    room.stageTimer = setTimeout(() => {
      // 12秒逾時未作答，視同答錯
      if (room.currentStage === 'BUZZER_LOCKED' && room.buzzerWinner?.id === socketId) {
        this.verifyBuzzerAnswer(roomCode, socketId, '');
      }
    }, answerDuration);

    return { success: true };
  }

  /**
   * 取得第一、二階段搶答打字時的即時聯想候選歌曲
   */
  getBuzzerSuggestions(roomCode, query) {
    const room = this.rooms.get(roomCode);
    if (!room) return [];
    return getAutocompleteSuggestions(query, room.tracks, room.currentTrack, 8);
  }

  /**
   * 驗證按鈴玩家的答案 (語音文字比對 或 8選1 快選)
   */
  verifyBuzzerAnswer(roomCode, socketId, answerTextOrChoiceId) {
    const room = this.rooms.get(roomCode);
    if (!room || room.currentStage !== 'BUZZER_LOCKED' || !room.buzzerWinner) return;

    if (room.stageTimer) clearTimeout(room.stageTimer);

    const player = room.players.get(socketId);
    const correctTrack = room.currentTrack;

    // 比對判斷：若傳入的是 choiceId 則看是否等於 correctTrack.id；若傳入文字則走 fuzzyMatch
    let isCorrect = false;
    if (answerTextOrChoiceId === correctTrack.id) {
      isCorrect = true;
    } else if (typeof answerTextOrChoiceId === 'string' && answerTextOrChoiceId.length > 0) {
      isCorrect = fuzzyMatchSongTitle(answerTextOrChoiceId, correctTrack.title, correctTrack.artist);
    }

    if (isCorrect) {
      // 答對！給予高額積分
      const points = room.previousStage === 'STAGE_1' ? 300 : 200;
      player.score += points;
      player.buzzedFastestCount = (player.buzzedFastestCount || 0) + 1;

      // 廣播成功事件，直接進入 REVEAL 揭曉大合唱
      this.io.to(roomCode).emit('buzzer_result', {
        success: true,
        playerId: socketId,
        playerName: player.name,
        pointsAwarded: points,
        scoreboard: Array.from(room.players.values()).sort((a, b) => b.score - a.score),
        message: `🎉 ${player.name} 搶答成功！獲得 +${points} 分！`
      });

      this.revealRound(roomCode);
    } else {
      // 答錯！扣小分，嚴格保密正解，將該玩家本題鎖定
      const penalty = 30;
      player.score = Math.max(0, player.score - penalty);
      room.lockedOutPlayerIds.add(socketId);

      this.io.to(roomCode).emit('buzzer_result', {
        success: false,
        playerId: socketId,
        playerName: player.name,
        penalty: penalty,
        scoreboard: Array.from(room.players.values()).sort((a, b) => b.score - a.score),
        message: `❌ ${player.name} 答錯扣 ${penalty} 分！正解繼續保密中...`
      });

      // 依先前階段繼續遊戲，讓其他人有機會搶
      if (room.previousStage === 'STAGE_1') {
        this.startStage2(roomCode); // 前奏 1 秒答錯，進入 3.5 秒
      } else {
        this.startStage3(roomCode); // 3.5 秒也答錯，進入 Stage 3 四選一
      }
    }
  }

  /**
   * 階段 3: 全體四選一競速 (100~150 分)
   */
  startStage3(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    if (room.stageTimer) clearTimeout(room.stageTimer);
    room.currentStage = 'STAGE_3';
    room.buzzerWinner = null;
    const duration = 12000; // 12 秒倒數
    room.stageDeadline = Date.now() + duration;

    this.broadcastRoomState(roomCode);

    room.stageTimer = setTimeout(() => {
      if (room.currentStage === 'STAGE_3') {
        this.revealRound(roomCode);
      }
    }, duration);
  }

  /**
   * 玩家提交 Stage 3 四選一答案
   */
  submitStage3Answer(roomCode, socketId, choiceId) {
    const room = this.rooms.get(roomCode);
    if (!room || room.currentStage !== 'STAGE_3') return;

    if (room.stage3Answers.has(socketId)) return; // 不能重複作答

    const isCorrect = choiceId === room.currentTrack.id;
    const remainingTimeRatio = Math.max(0, (room.stageDeadline - Date.now()) / 12000);
    // 依作答速度給予 100 ~ 150 分
    const points = isCorrect ? Math.floor(100 + remainingTimeRatio * 50) : 0;

    const player = room.players.get(socketId);
    if (player && isCorrect) {
      player.score += points;
    }

    room.stage3Answers.set(socketId, {
      choiceId,
      isCorrect,
      points
    });

    // 即時廣播目前即時排行榜與玩家作答狀態
    this.io.to(roomCode).emit('live_scoreboard_update', {
      scoreboard: Array.from(room.players.values()).sort((a, b) => b.score - a.score),
      lastEvent: {
        playerId: socketId,
        playerName: player ? player.name : '',
        points: isCorrect ? points : 0,
        isCorrect
      }
    });

    // 檢查是否所有未鎖定的玩家都已作答完畢
    const eligiblePlayerCount = Array.from(room.players.keys()).filter(id => !room.lockedOutPlayerIds.has(id)).length;
    if (room.stage3Answers.size >= eligiblePlayerCount) {
      if (room.stageTimer) clearTimeout(room.stageTimer);
      this.revealRound(roomCode);
    }
  }

  /**
   * 揭曉本題答案 (REVEAL) 播放副歌與大合唱
   */
  revealRound(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    if (room.stageTimer) clearTimeout(room.stageTimer);
    room.currentStage = 'REVEAL';
    room.stageDeadline = null;

    // 廣播完整資訊（包含歌名、封面、投稿者）
    this.broadcastRoomState(roomCode);

    this.io.to(roomCode).emit('round_revealed', {
      track: room.currentTrack,
      correctChoiceId: room.currentTrack.id,
      stage3Answers: Object.fromEntries(room.stage3Answers),
      scoreboard: Array.from(room.players.values()).sort((a, b) => b.score - a.score)
    });
  }
}
