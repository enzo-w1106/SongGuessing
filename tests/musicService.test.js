import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSongTitle, fuzzyMatchSongTitle, generateChoices } from '../server/musicService.js';

test('normalizeSongTitle 應能去除標點、括號、後綴並統一小寫', () => {
  assert.equal(normalizeSongTitle('晴天 (Live 現場版)'), '晴天');
  assert.equal(normalizeSongTitle('十年 [2020 Remastered]'), '十年');
  assert.equal(normalizeSongTitle('【電視劇片尾曲】 遇見 - 孫燕姿'), '遇見');
  assert.equal(normalizeSongTitle('Shape of You (feat. Someone)'), 'shapeofyou');
});

test('fuzzyMatchSongTitle 語音比對與模糊容錯判定', () => {
  // 1. 完全吻合
  assert.equal(fuzzyMatchSongTitle('晴天', '晴天'), true);
  // 2. 語音辨識多講詞（如：「周杰倫的晴天」、「是晴天」）
  assert.equal(fuzzyMatchSongTitle('周杰倫的晴天', '晴天'), true);
  assert.equal(fuzzyMatchSongTitle('這首是十年', '十年'), true);
  // 3. 英文大小寫與空格忽視
  assert.equal(fuzzyMatchSongTitle('shape of you', 'Shape of You'), true);
  // 4. 不相關的歌名應判定為 false
  assert.equal(fuzzyMatchSongTitle('夜曲', '晴天'), false);
});

test('generateChoices 正確產生 4 個與 8 個選項且包含正確答案', () => {
  const correctSong = { id: 's1', title: '晴天', artist: '周杰倫' };
  const pool = [
    correctSong,
    { id: 's2', title: '十年', artist: '陳奕迅' },
    { id: 's3', title: '遇見', artist: '孫燕姿' },
    { id: 's4', title: '勇氣', artist: '梁靜茹' },
    { id: 's5', title: '吻別', artist: '張學友' },
    { id: 's6', title: '溫柔', artist: '五月天' },
    { id: 's7', title: '童話', artist: '光良' },
    { id: 's8', title: '聽海', artist: '張惠妹' },
    { id: 's9', title: '江南', artist: '林俊傑' }
  ];

  // 4 選 1 測試
  const choices4 = generateChoices(correctSong, pool, 4);
  assert.equal(choices4.length, 4);
  assert.ok(choices4.some(c => c.id === 's1'));

  // 8 選 1 快篩測試
  const choices8 = generateChoices(correctSong, pool, 8);
  assert.equal(choices8.length, 8);
  assert.ok(choices8.some(c => c.id === 's1'));
});

test('fetchThemeTracks 在任何狀況下皆能產出足額題目且打亂', async () => {
  const { fetchThemeTracks } = await import('../server/musicService.js');
  const tracks = await fetchThemeTracks('mandopop_classic', 5);
  assert.ok(tracks.length >= 5);
  assert.ok(tracks[0].title);
  assert.ok(tracks[0].audioUrl);
});

test('getAutocompleteSuggestions 輸入「蔡」應跳出蔡相關人名與歌曲，並包含符合的當前題目', async () => {
  const { getAutocompleteSuggestions } = await import('../server/musicService.js');
  const currentTrack = { id: 'curr_1', title: '馬德里不思議', artist: '蔡依林' };
  const suggestions = getAutocompleteSuggestions('蔡', [], currentTrack, 8);

  assert.ok(suggestions.length > 1);
  // 每個結果都應該包含「蔡」
  assert.ok(suggestions.every(s => s.displayText.includes('蔡')));
  // 當前正確答案有符合「蔡」，必須被包含在候選清單中
  assert.ok(suggestions.some(s => s.title === '馬德里不思議'));
});

test('generateChoices 四選一應優先挑選同歌手干擾項，且絕不出現已播過的題目', () => {
  const correctSong = { id: 'jay_1', title: '晴天', artist: '周杰倫' };
  const playedTracks = [
    { id: 'jay_old', title: '七里香', artist: '周杰倫' },
    { id: 'old_2', title: '十年', artist: '陳奕迅' }
  ];
  const choices = generateChoices(correctSong, [], 4, playedTracks);
  assert.equal(choices.length, 4);
  // 包含正確答案
  assert.ok(choices.some(c => c.title === '晴天'));
  // 絕不包含已播過的七里香或十年
  assert.ok(!choices.some(c => c.title === '七里香'));
  assert.ok(!choices.some(c => c.title === '十年'));
  // 因為 SUGGESTION_CATALOG 內有多首周杰倫歌曲，4 個選項都應該是周杰倫的歌
  assert.ok(choices.every(c => c.artist === '周杰倫'));
});
