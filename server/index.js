/**
 * 露營猜歌遊戲 - 主伺服器入口 (Express + Socket.IO + 區網自動偵測 & QR Code)
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { THEMES, searchSongs } from './musicService.js';
import { GameRoomManager } from './gameRoomManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const roomManager = new GameRoomManager(io);

/**
 * 取得本機區網 IPv4 位址
 */
function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

/**
 * API: 取得網路連線資訊與 QR Code
 */
app.get('/api/network-info', async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const localIp = getLocalNetworkIp();
  
  // 若是以 localhost 造訪，提供區網 IP 作為手機連線網址；若已部署在雲端/公網則使用該 host
  const targetHost = isLocalhost ? `${localIp}:${PORT}` : host;
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const joinUrl = `${protocol}://${targetHost}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(joinUrl, {
      margin: 1,
      width: 280,
      color: {
        dark: '#ff7a18',
        light: '#121629'
      }
    });

    res.json({
      localIp,
      port: PORT,
      joinUrl,
      qrCodeDataUrl
    });
  } catch (err) {
    res.status(500).json({ error: 'QR Code 產生失敗', details: err.message });
  }
});

/**
 * API: 取得預設主題題庫列表
 */
app.get('/api/music/themes', (req, res) => {
  res.json(THEMES);
});

/**
 * API: 音樂搜尋 (iTunes 試聽庫)
 */
app.get('/api/music/search', async (req, res) => {
  const query = req.query.q || '';
  if (!query.trim()) {
    return res.json([]);
  }
  const results = await searchSongs(query, 12);
  res.json(results);
});

/**
 * WebSocket 即時房間事件監聽
 */
io.on('connection', (socket) => {
  // 建立房間 (房主)
  socket.on('create_room', ({ playerName }) => {
    const room = roomManager.createRoom(socket.id, playerName);
    socket.join(room.code);
    socket.emit('room_created', {
      roomCode: room.code,
      playerId: socket.id,
      state: roomManager.getRoomPublicState(room.code)
    });
  });

  // 加入房間
  socket.on('join_room', ({ roomCode, playerName }) => {
    const code = (roomCode || '').trim().toUpperCase();
    const result = roomManager.joinRoom(code, socket.id, playerName);
    if (!result.success) {
      socket.emit('error_message', result.message);
      return;
    }
    socket.join(code);
    socket.emit('room_joined', {
      roomCode: code,
      playerId: socket.id,
      state: roomManager.getRoomPublicState(code)
    });
    roomManager.broadcastRoomState(code);
  });

  // 更新房間設定
  socket.on('update_settings', ({ roomCode, settings }) => {
    roomManager.updateSettings(roomCode, socket.id, settings);
  });

  // 玩家私下投稿歌曲
  socket.on('submit_song', ({ roomCode, track }) => {
    const res = roomManager.submitSong(roomCode, socket.id, track);
    socket.emit('submission_ack', res);
  });

  // 開始遊戲
  socket.on('start_game', async ({ roomCode }) => {
    await roomManager.startGame(roomCode, socket.id);
  });

  // 按鈴搶答 (Stage 1 / Stage 2)
  socket.on('buzz_in', ({ roomCode }) => {
    const result = roomManager.buzzIn(roomCode, socket.id);
    if (!result.success) {
      socket.emit('error_message', result.message);
    }
  });

  // 按鈴玩家提交答案驗證 (文字模糊比對 或 8選1)
  socket.on('submit_buzzer_answer', ({ roomCode, answer }) => {
    roomManager.verifyBuzzerAnswer(roomCode, socket.id, answer);
  });

  // 提交 Stage 3 四選一答案
  socket.on('submit_stage3_answer', ({ roomCode, choiceId }) => {
    roomManager.submitStage3Answer(roomCode, socket.id, choiceId);
  });

  // 下一題 (房主手動觸發)
  socket.on('next_round', ({ roomCode }) => {
    const room = roomManager.rooms.get(roomCode);
    if (room && room.hostId === socket.id) {
      roomManager.nextRound(roomCode);
    }
  });

  // 重新開始新的一局
  socket.on('restart_game', ({ roomCode }) => {
    const room = roomManager.rooms.get(roomCode);
    if (room && room.hostId === socket.id) {
      room.status = 'LOBBY';
      roomManager.broadcastRoomState(roomCode);
    }
  });

  // 斷線處理
  socket.on('disconnect', () => {
    roomManager.removePlayer(socket.id);
  });
});

server.listen(PORT, () => {
  const localIp = getLocalNetworkIp();
  console.log(`\n======================================================`);
  console.log(`🏕️  露營盲盒猜歌派對已啟動！`);
  console.log(`💻 電腦端本機網址: http://localhost:${PORT}`);
  console.log(`📱 手機掃描區網網址: http://${localIp}:${PORT}`);
  console.log(`======================================================\n`);
});
