import test from 'node:test';
import assert from 'node:assert/strict';
import { GameRoomManager } from '../server/gameRoomManager.js';

// 建立簡易 Mock Socket.IO 物件
function createMockIO() {
  const emittedEvents = [];
  return {
    to: (target) => ({
      emit: (eventName, data) => {
        emittedEvents.push({ target, eventName, data });
      }
    }),
    emit: (eventName, data) => {
      emittedEvents.push({ target: 'all', eventName, data });
    },
    getEvents: () => emittedEvents
  };
}

test('GameRoomManager 房間建立與玩家加入', () => {
  const io = createMockIO();
  const manager = new GameRoomManager(io);

  const room = manager.createRoom('socket_host_1', '房主阿強');
  assert.equal(room.code.length, 4);
  assert.equal(room.hostName, '房主阿強');
  assert.equal(room.players.size, 1);

  // 朋友加入房間
  const joinResult = manager.joinRoom(room.code, 'socket_friend_2', '朋友小美');
  assert.equal(joinResult.success, true);
  assert.equal(room.players.size, 2);

  // 取得公開房間狀態
  const publicState = manager.getRoomPublicState(room.code);
  assert.equal(publicState.players.length, 2);
  assert.equal(publicState.status, 'LOBBY');
});

test('防劇透測試：在 REVEAL 之前，公開狀態絕對隱藏歌名與封面', () => {
  const io = createMockIO();
  const manager = new GameRoomManager(io);
  const room = manager.createRoom('host_id', '房主');

  // 手動注入測試題庫並設定為 PLAYING 狀態
  room.status = 'PLAYING';
  room.currentStage = 'STAGE_1';
  room.tracks = [
    { id: 'track_1', title: '晴天', artist: '周杰倫', artworkUrl: 'http://art.jpg', audioUrl: 'http://audio.mp3' }
  ];
  room.currentTrack = room.tracks[0];
  room.currentRoundIndex = 0;

  // 檢查 STAGE_1 時的公開狀態
  const stage1PublicState = manager.getRoomPublicState(room.code);
  assert.equal(stage1PublicState.currentRound.title, '？？？');
  assert.equal(stage1PublicState.currentRound.artist, '？？？');
  assert.equal(stage1PublicState.currentRound.artworkUrl, '');
  assert.equal(stage1PublicState.currentRound.audioUrl, 'http://audio.mp3');

  // 進入 REVEAL 狀態
  manager.revealRound(room.code);
  const revealPublicState = manager.getRoomPublicState(room.code);
  assert.equal(revealPublicState.currentRound.title, '晴天');
  assert.equal(revealPublicState.currentRound.artist, '周杰倫');
  assert.equal(revealPublicState.currentRound.artworkUrl, 'http://art.jpg');
});

test('三階段搶答驗證：答對加分且揭曉、答錯扣分且不洩漏正解', () => {
  const io = createMockIO();
  const manager = new GameRoomManager(io);
  const room = manager.createRoom('host_id', '房主');
  manager.joinRoom(room.code, 'player_2', '搶答王');

  room.status = 'PLAYING';
  room.tracks = [
    { id: 'track_1', title: '十年', artist: '陳奕迅', artworkUrl: 'http://art.jpg', audioUrl: 'http://audio.mp3' }
  ];
  room.currentTrack = room.tracks[0];
  room.currentRoundIndex = 0;

  // 啟動 Stage 1
  manager.startStage1(room.code);
  assert.equal(room.currentStage, 'STAGE_1');

  // player_2 按鈴搶答
  const buzzResult = manager.buzzIn(room.code, 'player_2');
  assert.equal(buzzResult.success, true);
  assert.equal(room.currentStage, 'BUZZER_LOCKED');
  assert.equal(room.buzzerWinner.id, 'player_2');

  // 情況 1: 故意答錯（說「吻別」）
  manager.verifyBuzzerAnswer(room.code, 'player_2', '吻別');
  const p2 = room.players.get('player_2');
  assert.equal(p2.score, -150); // Stage 1 答錯倒扣 150 分（可扣至負分）
  assert.ok(room.lockedOutPlayerIds.has('player_2'));
  // 關鍵驗證：答錯不能揭曉，且由 Stage 1 推進至 Stage 2！
  assert.equal(room.currentStage, 'STAGE_2');
  assert.equal(manager.getRoomPublicState(room.code).currentRound.title, '？？？');

  // 情況 2: host_id 在 Stage 2 搶答並答對（說「十年」）
  const buzzResult2 = manager.buzzIn(room.code, 'host_id');
  assert.equal(buzzResult2.success, true);
  manager.verifyBuzzerAnswer(room.code, 'host_id', '十年');

  const hostPlayer = room.players.get('host_id');
  assert.equal(hostPlayer.score, 200); // Stage 2 答對獲得 200 分
  assert.equal(room.currentStage, 'REVEAL'); // 答對即刻進入 REVEAL
});

test('結算畫面時，非房主參與者也能點擊「再玩一局」重置房間回大廳', () => {
  const io = createMockIO();
  const manager = new GameRoomManager(io);
  const room = manager.createRoom('host_id', '房主');
  manager.joinRoom(room.code, 'guest_id', '參與者小華');

  room.status = 'GAME_OVER';
  room.players.get('host_id').score = 500;
  room.players.get('guest_id').score = 300;

  // 由參與者小華觸發 restartGame
  const ok = manager.restartGame(room.code, 'guest_id');
  assert.equal(ok, true);
  assert.equal(room.status, 'LOBBY');
  assert.equal(room.players.get('host_id').score, 0);
  assert.equal(room.players.get('guest_id').score, 0);
});

test('搶答答錯後：玩家搶答鈕應被鎖定，且無法參加 Stage 3 四選一', () => {
  const io = createMockIO();
  const manager = new GameRoomManager(io);
  const room = manager.createRoom('host_id', '房主');
  manager.joinRoom(room.code, 'player_2', '亂猜王');

  room.status = 'PLAYING';
  room.tracks = [
    { id: 'track_1', title: '稻香', artist: '周杰倫', artworkUrl: 'http://art.jpg', audioUrl: 'http://audio.mp3' }
  ];
  room.currentTrack = room.tracks[0];
  room.currentRoundIndex = 0;

  // Stage 1: player_2 搶答但答錯
  manager.startStage1(room.code);
  assert.equal(manager.buzzIn(room.code, 'player_2').success, true);
  manager.verifyBuzzerAnswer(room.code, 'player_2', '錯誤歌名');

  // 進入 Stage 2，確認公開狀態包含 lockedOutPlayerIds，且 player_2 不能再按鈴
  assert.equal(room.currentStage, 'STAGE_2');
  const publicStateStage2 = manager.getRoomPublicState(room.code);
  assert.deepEqual(publicStateStage2.currentRound.lockedOutPlayerIds, ['player_2']);
  const retryBuzz = manager.buzzIn(room.code, 'player_2');
  assert.equal(retryBuzz.success, false);

  // 進入 Stage 3 四選一：player_2 嘗試提交正解也應被拒絕且不加分
  manager.startStage3(room.code);
  assert.equal(room.currentStage, 'STAGE_3');
  const stage3Blocked = manager.submitStage3Answer(room.code, 'player_2', 'track_1');
  assert.equal(stage3Blocked.success, false);
  assert.equal(room.stage3Answers.has('player_2'), false);
  assert.equal(room.players.get('player_2').score, -150);

  // 未被鎖定的 host_id 作答後，不需等待已被鎖定的 player_2 即直接揭曉 (REVEAL)
  const stage3Ok = manager.submitStage3Answer(room.code, 'host_id', 'track_1');
  assert.equal(stage3Ok.success, true);
  assert.equal(room.currentStage, 'REVEAL');
  if (room.stageTimer) clearTimeout(room.stageTimer);
});

