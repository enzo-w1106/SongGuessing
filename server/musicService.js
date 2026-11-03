/**
 * 露營猜歌遊戲 - 音樂服務與題庫引擎 (Music Service & Quiz Generator)
 */

// 預設熱門主題題庫關鍵字清單（露營現場免準備、一鍵盲抽）
export const THEMES = [
  {
    id: 'mandopop_classic',
    name: '🔥 90-00 華語金曲 / KTV必點',
    description: '張學友、陳奕迅、周杰倫、孫燕姿、梁靜茹、王力宏等回憶殺金曲',
    keywords: [
      '張學友 吻別', '陳奕迅 十年', '孫燕姿 遇見', '梁靜茹 勇氣', '五月天 溫柔',
      '王心凌 愛你', '林俊傑 江南', '蔡依林 倒帶', '光良 童話', '張惠妹 聽海',
      '陶喆 愛很簡單', 'SHE 熱帶雨林', '莫文蔚 陰天', '信樂團 死了都要愛', '范瑋琪 最初的夢想'
    ]
  },
  {
    id: 'jay_chou',
    name: '👑 周杰倫經典專場',
    description: '無與倫比的周董旋律，老樂迷必備挑戰',
    keywords: [
      '周杰倫 晴天', '周杰倫 稻香', '周杰倫 七里香', '周杰倫 簡單愛', '周杰倫 安靜',
      '周杰倫 告白氣球', '周杰倫 不能說的秘密', '周杰倫 夜曲', '周杰倫 青花瓷', '周杰倫 菊花台',
      '周杰倫 聽媽媽的話', '周杰倫 開不了口', '周杰倫 愛在西元前', '周杰倫 雙截棍', '周杰倫 珊瑚海'
    ]
  },
  {
    id: 'mayday_party',
    name: '🎸 五月天派對大合唱',
    description: '從第一張創作專輯到人生無限公司，營火晚會必備',
    keywords: [
      '五月天 溫柔', '五月天 志明與春嬌', '五月天 戀愛ing', '五月天 倔強', '五月天 突然好想你',
      '五月天 離開地球表面', '五月天 傷心的人別聽慢歌', '五月天 派對動物', '五月天 乾杯', '五月天 憨人',
      '五月天 擁抱', '五月天 瘋狂世界', '五月天 知足', '五月天 叫我第一名', '五月天 步步'
    ]
  },
  {
    id: 'taiwan_indie',
    name: '🏕️ 台灣獨立樂團露營夜',
    description: '告五人、草東、滅火器、落日飛車、美秀集團微醺之夜',
    keywords: [
      '告五人 披星戴月的想你', '草東沒有派對 大風吹', '美秀集團 捲菸', '滅火器 島嶼天光', '落日飛車 My Jinji',
      '告五人 愛人錯過', '茄子蛋 浪子回頭', '老王樂隊 我還年輕', '拍謝少年 暗流', '康士坦的變化球 美好的事可不可以發生在我身上',
      '血肉果汁機 關閉太陽', 'Deca Joins 浴室', '芒果醬 小紫', '傻子與白痴 象牙舟', '甜約翰 降雨機率'
    ]
  },
  {
    id: 'anime_classic',
    name: '✨ 經典動漫與童年神曲',
    description: '灌籃高手、數碼寶貝、新時代航海王與幽遊白書',
    keywords: [
      '和田光司 Butter-Fly', 'BAAD 好想大聲說喜歡你', 'WANDS 直到世界的盡頭', '高橋洋子 殘酷天使的行動綱領',
      'LiSA 紅蓮華', 'Yoasobi 偶像', '米津玄師 Kick Back', 'Eve 迴迴奇譚', 'Aimer 殘響散歌',
      'KANA-BOON Silhouette', 'FLOW GO!!!', 'UNISON SQUARE GARDEN Sugar Song', 'RADWIMPS 前前前世'
    ]
  },
  {
    id: 'western_hits',
    name: '🕺 歐美派對與告示牌排行',
    description: 'Ed Sheeran, Maroon 5, Taylor Swift, Bruno Mars 派對熱曲',
    keywords: [
      'Bruno Mars Uptown Funk', 'Ed Sheeran Shape of You', 'Maroon 5 Sugar', 'Taylor Swift Shake It Off',
      'Adele Rolling in the Deep', 'Coldplay Viva La Vida', 'Justin Bieber Baby', 'The Weeknd Blinding Lights',
      'Dua Lipa Levitating', 'Avicii Wake Me Up', 'Queen Bohemian Rhapsody', 'Michael Jackson Beat It'
    ]
  },
  {
    id: 'tiktok_viral',
    name: '📱 抖音與社群洗腦神曲',
    description: '烏梅子醬、愛如火、大眠、可不可以、孤勇者等全網刷屏神曲',
    keywords: [
      '李榮浩 烏梅子醬', '陳雪凝 綠色', '王心凌 大眠', '張遠 嘉賓', '陳奕迅 孤勇者',
      '井朧 丟了你', '張碧晨 光的方向', '告白氣球', '等什麼君 踏山河', '阿冗 與我無關',
      '任然 飛鳥和蟬', '夢然 少年', '程響 四季予你', '王赫野 大風吹', '白月光與硃砂痣'
    ]
  },
  {
    id: 'taiwanese_classics',
    name: '🍻 經典台語熱炒與KTV',
    description: '伍佰、江蕙、滅火器、蕭煌奇、茄子蛋微醺大合唱',
    keywords: [
      '伍佰 挪威的森林', '江蕙 家後', '滅火器 島嶼天光', '茄子蛋 浪子回頭', '蕭煌奇 你是我的眼',
      '茄子蛋 愛情你比我想的閣較偉大', '伍佰 愛情限時批', '黃乙玲 愛到才知痛', '滅火器 長途夜車', '五月天 志明與春嬌',
      '謝金燕 練舞功', '陳雷 歡喜就好', '葉啟田 愛拚才會贏', '林強 向前走', '董事長樂團 眾神護臺灣'
    ]
  },
  {
    id: 'kpop_fever',
    name: '💃 K-POP 韓流潮流神曲',
    description: 'BLACKPINK、NewJeans、BTS、TWICE、IVE 刀群舞熱門曲',
    keywords: [
      'BLACKPINK DDU-DU DDU-DU', 'NewJeans Hype Boy', 'BTS Dynamite', 'TWICE TT', 'IVE LOVE DIVE',
      'LE SSERAFIM ANTIFRAGILE', 'BLACKPINK Pink Venom', 'NewJeans Super Shy', 'Super Junior Sorry Sorry', 'BIGBANG BANG BANG BANG',
      'EXO Growl', 'aespa Next Level', 'Girls Generation Gee', 'PSY Gangnam Style', 'BTS Butter'
    ]
  },
  {
    id: 'ost_classics',
    name: '🎬 經典影視原聲帶 OST',
    description: '海角七號、想見你、那些年、當男人戀愛時等催淚名曲',
    keywords: [
      '八三夭 想見你想見你想見你', '胡夏 那些年', '田馥甄 小幸運', '范逸臣 國境之南', '韋禮安 如果可以',
      '郁可唯 指望', '周杰倫 不能說的秘密', '告五人 在這座城市失去你', '盧廣仲 刻在我心底的名字', '張惠妹 人質',
      '林宥嘉 兜圈', '楊宗緯 洋蔥', '動力火車 當', '庾澄慶 情非得已'
    ]
  },
  {
    id: 'hiphop_rap',
    name: '🎤 華語嘻哈與潮流饒舌',
    description: '頑童MJ116、MC HotDog、高爾宣、瘦子、蛋堡炸翻營地',
    keywords: [
      '頑童MJ116 幹大事', 'MC HotDog 差不多先生', '高爾宣 Without You', '瘦子 CHANGE', '蛋堡 關於小熊',
      '熊仔 買榜', '頑童MJ116 辣台妹', '玖壹壹 9453', '高爾宣 So Good', 'MC HotDog 我愛台妹',
      '頑童MJ116 生童', '潮州土狗 50元的檳榔', '夜貓組 20:29', '熱狗 髒藝術家'
    ]
  }
];

// 離線／無網路時的內建經典題庫備援（防止露營區網路完全斷訊）
export const FALLBACK_TRACKS = [
  { id: 'fb_1', title: '晴天', artist: '周杰倫', album: '葉惠美', artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'fb_2', title: '十年', artist: '陳奕迅', album: '黑白灰', artworkUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'fb_3', title: '遇見', artist: '孫燕姿', album: 'The Moment', artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'fb_4', title: '溫柔', artist: '五月天', album: '愛情萬歲', artworkUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'fb_5', title: '勇氣', artist: '梁靜茹', album: '勇氣', artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'fb_6', title: '童話', artist: '光良', album: '童話', artworkUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'fb_7', title: '江南', artist: '林俊傑', album: '第二天堂', artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 'fb_8', title: '愛你', artist: '王心凌', album: '愛你', artworkUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'fb_9', title: '披星戴月的想你', artist: '告五人', album: '披星戴月的想你', artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 'fb_10', title: '大風吹', artist: '草東沒有派對', album: '醜奴兒', artworkUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'fb_11', title: 'Shape of You', artist: 'Ed Sheeran', album: 'Divide', artworkUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'fb_12', title: 'Uptown Funk', artist: 'Bruno Mars', album: 'Uptown Special', artworkUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

/**
 * 透過 Apple iTunes 搜尋 API 取得歌曲與 30 秒試聽音訊 (公開、免金鑰、高音質 AAC)
 * @param {string} term 搜尋關鍵字 (歌名或歌手)
 * @param {number} limit 搜尋回傳筆數
 * @returns {Promise<Array>} 格式化後的歌曲物件陣列
 */
export async function searchSongs(term, limit = 15) {
  try {
    const encodedTerm = encodeURIComponent(term);
    const url = `https://itunes.apple.com/search?term=${encodedTerm}&entity=song&limit=${limit}&country=TW`;
    const res = await fetch(url, { headers: { 'User-Agent': 'CampfireSongQuiz/1.0' } });
    if (!res.ok) {
      throw new Error(`iTunes search error: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      const mapped = data.results
        .filter(item => item.previewUrl && item.trackName)
        .map(item => ({
          id: `itunes_${item.trackId}`,
          title: item.trackName,
          artist: item.artistName,
          album: item.collectionName || '',
          artworkUrl: (item.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
          audioUrl: item.previewUrl,
          durationMs: item.trackTimeMillis || 30000,
          source: 'itunes'
        }));
      registerSongsToCatalog(mapped);
      return mapped;
    }
  } catch (err) {
    // 網路斷線或離線時啟動備援
  }

  // 離線備援比對
  const cleanTerm = term.toLowerCase();
  return FALLBACK_TRACKS.filter(t => 
    t.title.toLowerCase().includes(cleanTerm) || t.artist.toLowerCase().includes(cleanTerm)
  );
}

/**
 * 根據主題 ID 盲抽隨機題目（支援自訂關鍵字輸入）
 * @param {string} themeId 主題識別碼 ('custom' 代表自訂主題)
 * @param {number} count 抽取的題數
 * @param {string} customKeyword 自訂主題或歌手關鍵字
 * @returns {Promise<Array>} 隨機打亂的題目陣列
 */
export async function fetchThemeTracks(themeId, count = 10, customKeyword = '') {
  if (themeId === 'custom' && customKeyword && customKeyword.trim()) {
    const customResults = await searchSongs(customKeyword.trim(), Math.max(count + 6, 20));
    if (customResults && customResults.length > 0) {
      return customResults.sort(() => Math.random() - 0.5).slice(0, count);
    }
  }

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const shuffledKeywords = [...theme.keywords].sort(() => Math.random() - 0.5);
  const selectedKeywords = shuffledKeywords.slice(0, Math.min(count + 5, theme.keywords.length));

  const allTracks = [];
  const seenIds = new Set();

  for (const kw of selectedKeywords) {
    const results = await searchSongs(kw, 3);
    for (const song of results) {
      if (!seenIds.has(song.id)) {
        seenIds.add(song.id);
        allTracks.push(song);
        break; // 每個關鍵字取首筆最吻合的
      }
    }
    if (allTracks.length >= count + 4) break;
  }

  // 如果網路不通抓到的歌不足，自動以備援歌庫補足
  if (allTracks.length < count) {
    for (const fb of FALLBACK_TRACKS) {
      if (!seenIds.has(fb.id)) {
        seenIds.add(fb.id);
        allTracks.push(fb);
      }
      if (allTracks.length >= count) break;
    }
  }

  // 隨機打亂
  return allTracks.sort(() => Math.random() - 0.5);
}

/**
 * 歌名標準化（用於語音辨識或輸入比對，過濾干擾字元與括號說明）
 * @param {string} title 原歌名
 * @returns {string} 乾淨的歌名
 */
export function normalizeSongTitle(title) {
  if (!title) return '';
  let clean = title.toString();

  // 移除常見的括號備註 (如 "(Live)", "(2020 Remaster)", "【電視劇片尾曲】", "(feat. ...)")
  clean = clean.replace(/\([^)]*\)/g, '');
  clean = clean.replace(/\[[^\]]*\]/g, '');
  clean = clean.replace(/【[^】]*】/g, '');
  clean = clean.replace(/（[^）]*）/g, '');
  clean = clean.replace(/-.*$/g, ''); // 移除 " - Remastered" 等後綴

  // 轉半形、小寫、去除標點符號與空白
  clean = clean
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"！，。？～、：；「」『』]/g, '')
    .replace(/\s+/g, '');

  return clean.trim();
}

/**
 * 計算兩字串的 Levenshtein 距離（用於語音辨識容錯）
 */
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // 刪除
        dp[i][j - 1] + 1,      // 插入
        dp[i - 1][j - 1] + cost // 替換
      );
    }
  }
  return dp[m][n];
}

/**
 * 語音輸入 / 文字比對模糊判定
 * @param {string} input 玩家語音轉文字或輸入的字串
 * @param {string} targetTitle 目標正確歌名
 * @param {string} [targetArtist] 目標歌手（可選，答歌手也可能部分符合）
 * @returns {boolean} 是否判定為答對
 */
export function fuzzyMatchSongTitle(input, targetTitle, targetArtist = '') {
  const cleanInput = normalizeSongTitle(input);
  const cleanTarget = normalizeSongTitle(targetTitle);

  if (!cleanInput || !cleanTarget) return false;

  // 1. 完全吻合
  if (cleanInput === cleanTarget) return true;

  // 2. 包含判定（例如語音說「這是晴天」、「周杰倫的晴天」或歌名較長只要命中核心詞）
  if (cleanInput.includes(cleanTarget)) return true;
  if (cleanTarget.length >= 3 && cleanTarget.includes(cleanInput) && cleanInput.length >= 2) {
    return true;
  }

  // 3. 語音辨識相似度判定 (Levenshtein Distance)
  const maxLen = Math.max(cleanInput.length, cleanTarget.length);
  if (maxLen > 0) {
    const dist = levenshteinDistance(cleanInput, cleanTarget);
    const similarity = 1 - dist / maxLen;
    // 長度大於 2 個字且相似度 >= 70% 視為同音字或小錯字答對
    if (cleanTarget.length >= 2 && similarity >= 0.7) {
      return true;
    }
  }

  return false;
}

/**
 * 產生選項（四選一或八選一快速候選面板）
 * @param {object} correctTrack 正確歌曲
 * @param {Array} poolOfTracks 候選歌曲池
 * @param {number} totalChoices 產生的選項總數 (預設 4，快篩可用 8)
 * @returns {Array} 打亂的選項陣列 [{ id, title, artist, displayText }]
 */
export function generateChoices(correctTrack, poolOfTracks, totalChoices = 4) {
  // 過濾掉與正解相同的歌曲
  const otherTracks = poolOfTracks.filter(t => t.id !== correctTrack.id);
  
  // 隨機選取干擾項
  const shuffledOthers = [...otherTracks].sort(() => Math.random() - 0.5);
  const distractors = shuffledOthers.slice(0, totalChoices - 1);

  // 合併正解並打亂順序
  const choices = [correctTrack, ...distractors]
    .map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      displayText: `${t.title} - ${t.artist}`
    }))
    .sort(() => Math.random() - 0.5);

  return choices;
}

// =========================================================
// 第一、二階段搶答：打字即時聯想詞庫 (Autocomplete Suggestions)
// =========================================================
const SUGGESTION_CATALOG = new Map();

const SEED_SONGS = [
  // 蔡依林 / 蔡健雅 / 蔡旻佑 / 蔡琴 / 蔡秋鳳
  { title: '倒帶', artist: '蔡依林' },
  { title: '日不落', artist: '蔡依林' },
  { title: '說愛你', artist: '蔡依林' },
  { title: '愛情三十六計', artist: '蔡依林' },
  { title: '玫瑰少年', artist: '蔡依林' },
  { title: '舞孃', artist: '蔡依林' },
  { title: 'Play 我呸', artist: '蔡依林' },
  { title: '怪美的', artist: '蔡依林' },
  { title: '布拉格廣場', artist: '蔡依林' },
  { title: '天空', artist: '蔡依林' },
  { title: '檸檬草的味道', artist: '蔡依林' },
  { title: '騎士精神', artist: '蔡依林' },
  { title: '看我72變', artist: '蔡依林' },
  { title: '妥協', artist: '蔡依林' },
  { title: '大藝術家', artist: '蔡依林' },
  { title: '紅色高跟鞋', artist: '蔡健雅' },
  { title: '陌生人', artist: '蔡健雅' },
  { title: '空白格', artist: '蔡健雅' },
  { title: '達爾文', artist: '蔡健雅' },
  { title: '無底洞', artist: '蔡健雅' },
  { title: '拋物線', artist: '蔡健雅' },
  { title: '別找我麻煩', artist: '蔡健雅' },
  { title: 'Letting Go', artist: '蔡健雅' },
  { title: '我可以', artist: '蔡旻佑' },
  { title: '被遺忘的時光', artist: '蔡琴' },
  { title: '讀你', artist: '蔡琴' },
  { title: '恰似你的溫柔', artist: '蔡琴' },
  { title: '金包銀', artist: '蔡秋鳳' },
  // 周杰倫 / 周興哲 / 周華健 / 周深 / 周湯豪
  { title: '晴天', artist: '周杰倫' },
  { title: '稻香', artist: '周杰倫' },
  { title: '七里香', artist: '周杰倫' },
  { title: '簡單愛', artist: '周杰倫' },
  { title: '安靜', artist: '周杰倫' },
  { title: '告白氣球', artist: '周杰倫' },
  { title: '不能說的秘密', artist: '周杰倫' },
  { title: '夜曲', artist: '周杰倫' },
  { title: '青花瓷', artist: '周杰倫' },
  { title: '菊花台', artist: '周杰倫' },
  { title: '聽媽媽的話', artist: '周杰倫' },
  { title: '開不了口', artist: '周杰倫' },
  { title: '愛在西元前', artist: '周杰倫' },
  { title: '雙截棍', artist: '周杰倫' },
  { title: '珊瑚海', artist: '周杰倫' },
  { title: '楓', artist: '周杰倫' },
  { title: '擱淺', artist: '周杰倫' },
  { title: '一路向北', artist: '周杰倫' },
  { title: '最偉大的作品', artist: '周杰倫' },
  { title: '以後別做朋友', artist: '周興哲' },
  { title: '你，好不好？', artist: '周興哲' },
  { title: '怎麼了', artist: '周興哲' },
  { title: '永不失聯的愛', artist: '周興哲' },
  { title: '想知道你在想什麼', artist: '周興哲' },
  { title: '朋友', artist: '周華健' },
  { title: '花心', artist: '周華健' },
  { title: '帥到分手', artist: '周湯豪' },
  { title: '大魚', artist: '周深' },
  // 五月天 / 伍佰 / 告五人
  { title: '溫柔', artist: '五月天' },
  { title: '志明與春嬌', artist: '五月天' },
  { title: '戀愛ing', artist: '五月天' },
  { title: '倔強', artist: '五月天' },
  { title: '突然好想你', artist: '五月天' },
  { title: '離開地球表面', artist: '五月天' },
  { title: '傷心的人別聽慢歌', artist: '五月天' },
  { title: '派對動物', artist: '五月天' },
  { title: '乾杯', artist: '五月天' },
  { title: '憨人', artist: '五月天' },
  { title: '擁抱', artist: '五月天' },
  { title: '知足', artist: '五月天' },
  { title: '我不願讓你一個人', artist: '五月天' },
  { title: '後來的我們', artist: '五月天' },
  { title: '披星戴月的想你', artist: '告五人' },
  { title: '愛人錯過', artist: '告五人' },
  { title: '在這座城市遺失了你', artist: '告五人' },
  { title: '好不容易', artist: '告五人' },
  { title: '唯一', artist: '告五人' },
  { title: '帶我去找夜生活', artist: '告五人' },
  { title: '挪威的森林', artist: '伍佰' },
  { title: '愛你一萬年', artist: '伍佰' },
  { title: '浪人情歌', artist: '伍佰' },
  { title: 'Last Dance', artist: '伍佰' },
  { title: '世界第一等', artist: '伍佰' },
  { title: '愛情限時批', artist: '伍佰 & 萬芳' },
  // 陳奕迅 / 林俊傑 / 張學友 / 張惠妹 / 孫燕姿 / 梁靜茹 / 王心凌 / 鄧紫棋
  { title: '十年', artist: '陳奕迅' },
  { title: '孤勇者', artist: '陳奕迅' },
  { title: 'K歌之王', artist: '陳奕迅' },
  { title: '紅玫瑰', artist: '陳奕迅' },
  { title: '愛情轉移', artist: '陳奕迅' },
  { title: '浮誇', artist: '陳奕迅' },
  { title: '好久不見', artist: '陳奕迅' },
  { title: '淘汰', artist: '陳奕迅' },
  { title: '讓我留在你身邊', artist: '陳奕迅' },
  { title: '江南', artist: '林俊傑' },
  { title: '修煉愛情', artist: '林俊傑' },
  { title: '她說', artist: '林俊傑' },
  { title: '小酒窩', artist: '林俊傑 & 蔡卓妍' },
  { title: '不為誰而作的歌', artist: '林俊傑' },
  { title: '可惜沒如果', artist: '林俊傑' },
  { title: '背對背擁抱', artist: '林俊傑' },
  { title: '吻別', artist: '張學友' },
  { title: '一千個傷心的理由', artist: '張學友' },
  { title: '她來聽我的演唱會', artist: '張學友' },
  { title: '聽海', artist: '張惠妹' },
  { title: '三天三夜', artist: '張惠妹' },
  { title: '連名帶姓', artist: '張惠妹' },
  { title: '人質', artist: '張惠妹' },
  { title: '記得', artist: '張惠妹' },
  { title: '掉了', artist: '張惠妹' },
  { title: '遇見', artist: '孫燕姿' },
  { title: '天黑黑', artist: '孫燕姿' },
  { title: '綠光', artist: '孫燕姿' },
  { title: '我懷念的', artist: '孫燕姿' },
  { title: '開始懂了', artist: '孫燕姿' },
  { title: '逆光', artist: '孫燕姿' },
  { title: '勇氣', artist: '梁靜茹' },
  { title: '分手快樂', artist: '梁靜茹' },
  { title: '會呼吸的痛', artist: '梁靜茹' },
  { title: '慢冷', artist: '梁靜茹' },
  { title: '可惜不是你', artist: '梁靜茹' },
  { title: '愛你', artist: '王心凌' },
  { title: '大眠', artist: '王心凌' },
  { title: '睫毛彎彎', artist: '王心凌' },
  { title: '當你', artist: '王心凌' },
  { title: '光年之外', artist: '鄧紫棋' },
  { title: '泡沫', artist: '鄧紫棋' },
  { title: '來自天堂的魔鬼', artist: '鄧紫棋' },
  // 田馥甄 / S.H.E / 林宥嘉 / 盧廣仲 / 韋禮安 / 李榮浩
  { title: '小幸運', artist: '田馥甄' },
  { title: '寂寞寂寞就好', artist: '田馥甄' },
  { title: '你就不要想起我', artist: '田馥甄' },
  { title: '熱帶雨林', artist: 'S.H.E' },
  { title: 'Super Star', artist: 'S.H.E' },
  { title: '戀人未滿', artist: 'S.H.E' },
  { title: '中國話', artist: 'S.H.E' },
  { title: '說謊', artist: '林宥嘉' },
  { title: '兜圈', artist: '林宥嘉' },
  { title: '成全', artist: '林宥嘉' },
  { title: '浪費', artist: '林宥嘉' },
  { title: '刻在我心底的名字', artist: '盧廣仲' },
  { title: '魚仔', artist: '盧廣仲' },
  { title: '幾分之幾', artist: '盧廣仲' },
  { title: '如果可以', artist: '韋禮安' },
  { title: '還是會', artist: '韋禮安' },
  { title: '女孩', artist: '韋禮安' },
  { title: '烏梅子醬', artist: '李榮浩' },
  { title: '年少有為', artist: '李榮浩' },
  { title: '李白', artist: '李榮浩' },
  { title: '模特', artist: '李榮浩' },
  { title: '不將就', artist: '李榮浩' }
];

export function registerSongsToCatalog(songs) {
  for (const s of songs) {
    if (s && s.title && s.artist) {
      const key = `${normalizeSongTitle(s.title)}|${s.artist.toLowerCase().trim()}`;
      if (!SUGGESTION_CATALOG.has(key)) {
        SUGGESTION_CATALOG.set(key, {
          title: s.title,
          artist: s.artist
        });
      }
    }
  }
}

// 初始化預設種子曲庫與所有主題關鍵字
registerSongsToCatalog(SEED_SONGS);
registerSongsToCatalog(FALLBACK_TRACKS);
for (const theme of THEMES) {
  for (const kw of theme.keywords) {
    const parts = kw.trim().split(/\s+/);
    if (parts.length >= 2) {
      const artist = parts[0];
      const title = parts.slice(1).join(' ');
      registerSongsToCatalog([{ title, artist }]);
    }
  }
}

/**
 * 根據玩家輸入的字詞（如 "蔡"、"周"、"愛"）即時回傳相關「歌名 - 歌手」候選清單
 * @param {string} query 玩家輸入的關鍵字
 * @param {Array} roomTracks 當前房間本局題庫
 * @param {object} currentTrack 當前正在播放的題目
 * @param {number} limit 最多回傳筆數
 * @returns {Array<{ title: string, artist: string, displayText: string }>}
 */
export function getAutocompleteSuggestions(query, roomTracks = [], currentTrack = null, limit = 8) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  // 確保房間題庫也已註冊進索引
  if (roomTracks && roomTracks.length > 0) {
    registerSongsToCatalog(roomTracks);
  }
  if (currentTrack) {
    registerSongsToCatalog([currentTrack]);
  }

  const matched = [];
  const seenKeys = new Set();

  const matchesQuery = (song) => {
    const t = (song.title || '').toLowerCase();
    const a = (song.artist || '').toLowerCase();
    return t.includes(q) || a.includes(q);
  };

  // 1. 若當前正解符合玩家輸入的關鍵字（如輸入歌手「蔡」或歌名其中一字），確保一定納入候選！
  let currentMatched = null;
  if (currentTrack && matchesQuery(currentTrack)) {
    const key = `${normalizeSongTitle(currentTrack.title)}|${(currentTrack.artist || '').toLowerCase().trim()}`;
    seenKeys.add(key);
    currentMatched = {
      title: currentTrack.title,
      artist: currentTrack.artist,
      displayText: `${currentTrack.artist} - ${currentTrack.title}`
    };
  }

  // 2. 從全域曲庫找出其他同樣符合該關鍵字的歌曲（作為同歌手/同字詞混淆與聯想）
  for (const [key, song] of SUGGESTION_CATALOG.entries()) {
    if (seenKeys.has(key)) continue;
    if (matchesQuery(song)) {
      seenKeys.add(key);
      matched.push({
        title: song.title,
        artist: song.artist,
        displayText: `${song.artist} - ${song.title}`
      });
    }
  }

  // 隨機打亂其他符合項目並截取前 limit - 1 筆，再把正解混入其中隨機位置（不固定排第一，防止盲猜第一個）
  const shuffledOthers = matched.sort(() => Math.random() - 0.5).slice(0, currentMatched ? limit - 1 : limit);
  const finalResults = currentMatched ? [currentMatched, ...shuffledOthers] : shuffledOthers;

  return finalResults.sort(() => Math.random() - 0.5);
}
