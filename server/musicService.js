/**
 * 露營猜歌遊戲 - 音樂服務與題庫引擎 (Music Service & Quiz Generator)
 */

// 預設熱門主題題庫關鍵字清單（露營現場免準備、一鍵盲抽）
export const THEMES = [
  {
    id: 'mandopop_classic',
    name: '🔥 90-00 華語金曲 / KTV必點',
    description: '張學友、陳奕迅、周杰倫、孫燕姿、梁靜茹、王力宏、蔡依林、林俊傑等回憶殺金曲',
    keywords: [
      '張學友 吻別', '陳奕迅 十年', '孫燕姿 遇見', '梁靜茹 勇氣', '五月天 溫柔',
      '王心凌 愛你', '林俊傑 江南', '蔡依林 倒帶', '光良 童話', '張惠妹 聽海',
      '陶喆 愛很簡單', 'S.H.E 熱帶雨林', '莫文蔚 陰天', '信樂團 死了都要愛', '范瑋琪 最初的夢想',
      '周杰倫 晴天', '孫燕姿 天黑黑', '梁靜茹 分手快樂', '陳奕迅 K歌之王', '蔡依林 日不落',
      '林俊傑 小酒窩', '王力宏 唯一', '張惠妹 原來你什麼都不要', '潘瑋柏 不得不愛', '羅志祥 愛轉角',
      'F.I.R. Lydia', '游鴻明 下沙', '張宇 雨一直下', '周華健 朋友', '任賢齊 心太軟',
      '伍佰 浪人情歌', '動力火車 忠孝東路走九遍', '蘇打綠 小情歌', '蕭敬騰 王妃', '林宥嘉 說謊',
      '張韶涵 隱形的翅膀', '楊丞琳 曖昧', '郭靜 下一個天亮', '戴佩妮 你要的愛', '李聖傑 痴心絕對',
      '曹格 背叛', '阿杜 他一定很愛你', '庾澄慶 情非得已', '徐若瑄 愛笑的眼睛', '蕭亞軒 最熟悉的陌生人',
      '周杰倫 七里香', '蔡依林 說愛你', '陳奕迅 愛情轉移', '孫燕姿 我懷念的', '梁靜茹 會呼吸的痛',
      '王心凌 睫毛彎彎', 'S.H.E Super Star', '五月天 突然好想你', '張棟樑 當你孤單你會想起誰', '品冠 門沒鎖',
      '陶喆 小鎮姑娘', '王力宏 Kiss Goodbye', '林俊傑 背對背擁抱', '張惠妹 三天三夜', '許茹芸 淚海'
    ]
  },
  {
    id: 'jay_chou',
    name: '👑 周杰倫經典專場',
    description: '無與倫比的周董旋律，老樂迷必備挑戰',
    keywords: [
      '周杰倫 晴天', '周杰倫 稻香', '周杰倫 七里香', '周杰倫 簡單愛', '周杰倫 安靜',
      '周杰倫 告白氣球', '周杰倫 不能說的秘密', '周杰倫 夜曲', '周杰倫 青花瓷', '周杰倫 菊花台',
      '周杰倫 聽媽媽的話', '周杰倫 開不了口', '周杰倫 愛在西元前', '周杰倫 雙截棍', '周杰倫 珊瑚海',
      '周杰倫 髮如雪', '周杰倫 千里之外', '周杰倫 擱淺', '周杰倫 軌跡', '周杰倫 黑色幽默',
      '周杰倫 龍捲風', '周杰倫 星晴', '周杰倫 回到過去', '周杰倫 半島鐵盒', '周杰倫 暗號',
      '周杰倫 東風破', '周杰倫 以父之名', '周杰倫 藉口', '周杰倫 園遊會', '周杰倫 楓',
      '周杰倫 一路向北', '周杰倫 退後', '周杰倫 彩虹', '周杰倫 最長的電影', '周杰倫 牛仔很忙',
      '周杰倫 說好的幸福呢', '周杰倫 蘭亭序', '周杰倫 算什麼男人', '周杰倫 等你下課', '周杰倫 說好不哭',
      '周杰倫 Mojito', '周杰倫 最偉大的作品', '周杰倫 紅塵客棧', '周杰倫 明明就', '周杰倫 蒲公英的約定'
    ]
  },
  {
    id: 'mayday_party',
    name: '🎸 五月天派對大合唱',
    description: '從第一張創作專輯到人生無限公司，營火晚會必備',
    keywords: [
      '五月天 溫柔', '五月天 志明與春嬌', '五月天 戀愛ing', '五月天 倔強', '五月天 突然好想你',
      '五月天 離開地球表面', '五月天 傷心的人別聽慢歌', '五月天 派對動物', '五月天 乾杯', '五月天 憨人',
      '五月天 擁抱', '五月天 瘋狂世界', '五月天 知足', '五月天 叫我第一名', '五月天 步步',
      '五月天 我不願讓你一個人', '五月天 星空', '五月天 諾亞方舟', '五月天 後來的我們', '五月天 頑固',
      '五月天 人生海海', '五月天 終結孤單', '五月天 軋車', '五月天 孫悟空', '五月天 天使',
      '五月天 私奔到月球', '五月天 你不是真正的快樂', '五月天 如煙', '五月天 笑忘歌', '五月天 入陣曲',
      '五月天 為愛而生', '五月天 雌雄同體', '五月天 心中無別人', '五月天 垃圾車', '五月天 乾杯',
      '五月天 轉眼', '五月天 任意門', '五月天 玫瑰少年', '五月天 因為你所以我', '五月天 為你寫下這首情歌'
    ]
  },
  {
    id: 'taiwan_indie',
    name: '🏕️ 台灣獨立樂團露營夜',
    description: '告五人、草東、滅火器、落日飛車、美秀集團微醺之夜',
    keywords: [
      '告五人 披星戴月的想你', '草東沒有派對 大風吹', '美秀集團 捲菸', '滅火器 島嶼天光', '落日飛車 My Jinji',
      '告五人 愛人錯過', '茄子蛋 浪子回頭', '老王樂隊 我還年輕', '拍謝少年 暗流', '康士坦的變化球 美好的事可不可以發生在我身上',
      '血肉果汁機 關閉太陽', 'Deca Joins 浴室', '芒果醬 小紫', '傻子與白痴 象牙舟', '甜約翰 降雨機率',
      '告五人 在這座城市失去你', '告五人 好不容易', '告五人 唯一', '草東沒有派對 山海', '草東沒有派對 爛泥',
      '茄子蛋 浪流連', '茄子蛋 親愛的無情孫小美', '美秀集團 心悶', '美秀集團 我要你愛', '滅火器 長途夜車',
      '滅火器 海上的人', '理想混蛋 不是因為天氣晴朗才愛你', '理想混蛋 愚者', '好樂團 他們說我是沒有用的年輕人', '老王樂隊 安九',
      '脆樂團 編織星空的人', '南西肯恩 練習一個人生活', '溫蒂漫步 讓我住進你心裡', '荷爾蒙少年 4:00A.M.', '宇宙人 藍色的你',
      '麋先生 嗜愛動物', '怕胖團 魚', '怕胖團 當你在最需要的時候', 'イルカポリス 海豚刑警 安平之光', '庸俗救星 窗簾'
    ]
  },
  {
    id: 'anime_classic',
    name: '✨ 經典動漫與童年神曲',
    description: '灌籃高手、數碼寶貝、新時代航海王與鬼滅咒術',
    keywords: [
      '和田光司 Butter-Fly', 'BAAD 好想大聲說喜歡你', 'WANDS 直到世界的盡頭', '高橋洋子 殘酷天使的行動綱領',
      'LiSA 紅蓮華', 'YOASOBI Idol', '米津玄師 KICK BACK', 'Eve 廻廻奇譚', 'Aimer 殘響散歌',
      'KANA-BOON Silhouette', 'FLOW GO!!!', 'UNISON SQUARE GARDEN Sugar Song', 'RADWIMPS 前前前世',
      'LiSA 炎', 'Official髭男dism Mixed Nuts', 'YOASOBI 勇者', 'Creepy Nuts Bling-Bang-Bang-Born', 'King Gnu SPECIALZ',
      '大黑摩季 只凝視著你', 'ZARD 轉動命運之輪', '生物股長 Blue Bird', 'Linked Horizon 紅蓮的弓矢', 'TK from 凛として時雨 unravel',
      '米津玄師 Peace Sign', '羊文學 more than words', 'キタニタツヤ 青のすみか', 'Mrs. GREEN APPLE Inferno', 'Ado 新時代',
      'MAN WITH A MISSION 絆ノ奇跡', 'SPYAIR サムライハート', '星野源 Comedy', 'Vaundy 裸の勇者', '绿黄色社会 花になって'
    ]
  },
  {
    id: 'western_hits',
    name: '🕺 歐美派對與告示牌排行',
    description: 'Ed Sheeran, Maroon 5, Taylor Swift, Bruno Mars 派對熱曲',
    keywords: [
      'Bruno Mars Uptown Funk', 'Ed Sheeran Shape of You', 'Maroon 5 Sugar', 'Taylor Swift Shake It Off',
      'Adele Rolling in the Deep', 'Coldplay Viva La Vida', 'Justin Bieber Baby', 'The Weeknd Blinding Lights',
      'Dua Lipa Levitating', 'Avicii Wake Me Up', 'Queen Bohemian Rhapsody', 'Michael Jackson Beat It',
      'Lady Gaga Bad Romance', 'Katy Perry Roar', 'Taylor Swift Love Story', 'Taylor Swift Cruel Summer',
      'Bruno Mars Just the Way You Are', 'Bruno Mars 24K Magic', 'Maroon 5 Moves Like Jagger', 'Maroon 5 Payphone',
      'Ed Sheeran Thinking Out Loud', 'Ed Sheeran Perfect', 'The Chainsmokers Closer', 'Alan Walker Faded',
      'Billie Eilish bad guy', 'Olivia Rodrigo good 4 u', 'Sabrina Carpenter Espresso', 'Harry Styles As It Was',
      'Justin Bieber Peaches', 'Post Malone Sunflower', 'OneRepublic Counting Stars', 'Imagine Dragons Believer',
      'Rihanna Diamonds', 'Sia Chandelier', 'Shawn Mendes Senorita', 'Charlie Puth Attention', 'LMFAO Party Rock Anthem'
    ]
  },
  {
    id: 'tiktok_viral',
    name: '📱 抖音與社群洗腦神曲',
    description: '烏梅子醬、愛如火、大眠、可不可以、孤勇者等全網刷屏神曲',
    keywords: [
      '李榮浩 烏梅子醬', '陳雪凝 綠色', '王心凌 大眠', '張遠 嘉賓', '陳奕迅 孤勇者',
      '井朧 丟了你', '張碧晨 光的方向', '周杰倫 告白氣球', '等什麼君 踏山河', '阿冗 與我無關',
      '任然 飛鳥和蟬', '夢然 少年', '程響 四季予你', '王赫野 大風吹', '大籽 白月光與硃砂痣',
      '那藝娜 愛如火', '張紫豪 可不可以', '于文文 體面', '岑寧兒 追光者', '買辣椒也用券 起風了',
      '鄧紫棋 光年之外', '鄧紫棋 泡沫', '薛之謙 演員', '李榮浩 年少有為', '李榮浩 模特',
      '陳粒 奇妙能力歌', '告五人 愛人錯過', '韋禮安 如果可以', '周興哲 你好不好', '周興哲 以後別做朋友',
      '陳勢安 天后', '汪蘇瀧 有點甜', '隔壁老樊 我曾', '海來阿木 點歌的人', 'G.E.M.鄧紫棋 來自天堂的魔鬼'
    ]
  },
  {
    id: 'taiwanese_classics',
    name: '🍻 經典台語熱炒與KTV',
    description: '伍佰、江蕙、滅火器、蕭煌奇、茄子蛋微醺大合唱',
    keywords: [
      '伍佰 挪威的森林', '江蕙 家後', '滅火器 島嶼天光', '茄子蛋 浪子回頭', '蕭煌奇 你是我的眼',
      '茄子蛋 愛情你比我想的閣較偉大', '伍佰 愛情限時批', '黃乙玲 愛到才知痛', '滅火器 長途夜車', '五月天 志明與春嬌',
      '謝金燕 練舞功', '陳雷 歡喜就好', '葉啟田 愛拚才會贏', '林強 向前走', '董事長樂團 眾神護臺灣',
      '伍佰 樹枝孤鳥', '伍佰 世界第一等', '伍佰 心愛的再會啦', '江蕙 酒後的心聲', '江蕙 甲你攬牢牢',
      '江蕙 落雨聲', '蕭煌奇 阿嬤的話', '蕭煌奇 上水的花', '翁立友 堅持', '翁立友 我問天',
      '羅時豐 茫茫到深更', '王識賢 勝者為王', '王識賢 雲中月圓', '荒山亮 趁我還會記', '五月天 心中無別人',
      '茄子蛋 浪流連', '草屯囝仔 愛我你會死', '玖壹壹 癡情男子漢', '玖壹壹 來個蹦蹦', '黃妃 追追追'
    ]
  },
  {
    id: 'kpop_fever',
    name: '💃 K-POP 韓流潮流神曲',
    description: 'BLACKPINK、NewJeans、BTS、TWICE、IVE 刀群舞熱門曲',
    keywords: [
      'BLACKPINK DDU-DU DDU-DU', 'NewJeans Hype Boy', 'BTS Dynamite', 'TWICE TT', 'IVE LOVE DIVE',
      'LE SSERAFIM ANTIFRAGILE', 'BLACKPINK Pink Venom', 'NewJeans Super Shy', 'Super Junior Sorry Sorry', 'BIGBANG BANG BANG BANG',
      'EXO Growl', 'aespa Next Level', 'Girls Generation Gee', 'PSY Gangnam Style', 'BTS Butter',
      'BLACKPINK How You Like That', 'BLACKPINK Kill This Love', 'NewJeans OMG', 'NewJeans Ditto', 'IVE I AM',
      'IVE After LIKE', 'TWICE Cheer Up', 'TWICE Fancy', 'TWICE What is Love', 'aespa Supernova',
      'aespa Drama', 'aespa Spicy', '(G)I-DLE Queencard', '(G)I-DLE TOMBOY', 'ILLIT Magnetic',
      'SEVENTEEN Super', 'Red Velvet Psycho', 'ITZY Wannabe', 'Wonder Girls Nobody', '2NE1 I Am The Best'
    ]
  },
  {
    id: 'ost_classics',
    name: '🎬 經典影視原聲帶 OST',
    description: '海角七號、想見你、那些年、當男人戀愛時等催淚名曲',
    keywords: [
      '八三夭 想見你想見你想見你', '胡夏 那些年', '田馥甄 小幸運', '范逸臣 國境之南', '韋禮安 如果可以',
      '郁可唯 指望', '周杰倫 不能說的秘密', '告五人 在這座城市失去你', '盧廣仲 刻在我心底的名字', '張惠妹 人質',
      '林宥嘉 兜圈', '楊宗緯 洋蔥', '動力火車 當', '庾澄慶 情非得已',
      '盧廣仲 魚仔', '周興哲 你好不好', 'A-Lin 有一種悲傷', '蘇打綠 小情歌', '伍佰 Last Dance',
      '孫盛希 眼淚記得你', '陳奕迅 讓我留在你身邊', '王菲 匆匆那年', '朴樹 平凡之路', '家家 家家酒',
      '五月天 後來的我們', 'F.I.R. 我們的愛', '張韶涵 遺失的美好', '陳芳語 愛你', '徐佳瑩 失落沙洲',
      '梁靜茹 會呼吸的痛', '范瑋琪 到不了', '林俊傑 修煉愛情', '茄子蛋 愛情你比我想的閣較偉大', '鄧紫棋 光年之外'
    ]
  },
  {
    id: 'hiphop_rap',
    name: '🎤 華語嘻哈與潮流饒舌',
    description: '頑童MJ116、MC HotDog、高爾宣、瘦子、蛋堡炸翻營地',
    keywords: [
      '頑童MJ116 幹大事', 'MC HotDog 差不多先生', '高爾宣 Without You', '瘦子 CHANGE', '蛋堡 關於小熊',
      '熊仔 買榜', '頑童MJ116 辣台妹', '玖壹壹 9453', '高爾宣 So Good', 'MC HotDog 我愛台妹',
      '頑童MJ116 生煎包', '潮州土狗 50元的檳榔', '夜貓組 20:29', 'MC HotDog 髒藝術家',
      '頑童MJ116 Fly Out', '頑童MJ116 走跳', '頑童MJ116 South Side', '瘦子 伯父', '瘦子 妹妹',
      '瘦子 Way Up', '高爾宣 最後一次', '高爾宣 Good Evening', '蛋堡 過程', '蛋堡 少年維持著煩惱',
      '國蛋 嘻哈仔', 'Leo王 快樂的甘蔗人', '春艷 魔法男孩', '鶴 The Crane 不介意', 'ØZI B.O.',
      '周湯豪 帥到分手', '周湯豪 i GO', '葛仲珊 打破他', '兄弟本色 迷途羔羊', '婁峻碩 Colorful'
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
 * 判斷是否為非原版錄音室歌曲（過濾 Live 現場版、演唱會、Remix 混音、翻唱 Cover、伴奏 Karaoke、純音樂等）
 */
export function isNonOriginalTrack(item) {
  const title = String(item.trackName || item.title || '');
  const album = String(item.collectionName || item.album || '');
  const artist = String(item.artistName || item.artist || '');
  const combined = `${title} ${album} ${artist}`;

  const nonOriginalRegex = /\b(live|remix|mix|remixed|cover|karaoke|instrumental|tribute|acoustic|demo|dj|bootleg|sped\s*up|slowed|reverb|medley|concert|tour|session|unplugged|version|ver\.)\b|現場|演唱會|音樂會|巡迴|巡演|實況|翻唱|伴奏|純音樂|演奏|鋼琴版|吉他版|小提琴|水晶音樂|胎教|卡拉|混音|電音版|加快|慢搖|抖音|說唱版|串燒|組曲|合唱版|致敬/i;

  return nonOriginalRegex.test(combined);
}

/**
 * 清理顯示用歌名（去除括號內的 Live/Remastered/電影主題曲等雜訊，保留純淨歌名）
 */
export function cleanDisplaySongTitle(rawTitle) {
  if (!rawTitle) return '';
  let t = String(rawTitle)
    .replace(/\s*\([^)]*(remaster|live|version|ver\.|edit|mix|feat|ft\.|ost|主題曲|片尾曲|插曲|電影|電視劇|劇集|動畫|國語|台語|粵語)[^)]*\)/gi, '')
    .replace(/\s*（[^）]*(remaster|live|version|ver\.|edit|mix|feat|ft\.|ost|主題曲|片尾曲|插曲|電影|電視劇|劇集|動畫|國語|台語|粵語)[^）]*）/gi, '')
    .replace(/\s*\[[^\]]*(remaster|live|version|ver\.|edit|mix|feat|ft\.|ost|主題曲|片尾曲|插曲|電影|電視劇|劇集|動畫|國語|台語|粵語)[^\]]*\]/gi, '')
    .replace(/\s*【[^】]*】/g, '')
    .replace(/\s*-\s*(remastered|live|single|version|ost).*$/gi, '')
    .trim();
  return t || String(rawTitle).trim();
}

/**
 * 根據房間設定取得顯示用的主題名稱
 */
export function getThemeDisplayName(settings = {}) {
  if (settings.mode === 'SUBMISSION') {
    return '🤫 好友私下投稿大亂鬥';
  }
  if (settings.themeId === 'custom') {
    const kw = (settings.customKeyword || '').trim();
    return kw ? `✨ 自訂主題：${kw}` : '✨ 自訂主題盲抽';
  }
  const found = THEMES.find(t => t.id === settings.themeId);
  return found ? found.name : THEMES[0].name;
}

/**
 * 透過 Apple iTunes 搜尋 API 取得歌曲與 30 秒試聽音訊 (公開、免金鑰、高音質 AAC)
 * 自動過濾 Live、Remix、Cover 翻唱與伴奏版本，優先保留原唱錄音室版本
 * @param {string} term 搜尋關鍵字 (歌名或歌手)
 * @param {number} limit 搜尋回傳筆數
 * @returns {Promise<Array>} 格式化後的歌曲物件陣列
 */
export async function searchSongs(term, limit = 15) {
  try {
    const encodedTerm = encodeURIComponent(term);
    const fetchLimit = Math.min(50, Math.max(limit * 3, 25));
    const url = `https://itunes.apple.com/search?term=${encodedTerm}&entity=song&limit=${fetchLimit}&country=TW`;
    const res = await fetch(url, { headers: { 'User-Agent': 'CampfireSongQuiz/1.0' } });
    if (!res.ok) {
      throw new Error(`iTunes search error: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      const validItems = data.results.filter(item => item.previewUrl && item.trackName);

      // 嚴格過濾掉 Live、Remix、翻唱、伴奏等非原唱錄音室版本
      const studioItems = validItems.filter(item => !isNonOriginalTrack(item));
      const finalItems = studioItems.length > 0 ? studioItems : validItems;

      const mapped = [];
      const seenNormKey = new Set();

      for (const item of finalItems) {
        const cleanTitle = cleanDisplaySongTitle(item.trackName);
        const normKey = `${normalizeSongTitle(cleanTitle)}__${(item.artistName || '').toLowerCase().trim()}`;
        if (seenNormKey.has(normKey)) continue;
        seenNormKey.add(normKey);

        mapped.push({
          id: `itunes_${item.trackId}`,
          title: cleanTitle,
          artist: item.artistName,
          album: item.collectionName || '',
          artworkUrl: (item.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
          audioUrl: item.previewUrl,
          durationMs: item.trackTimeMillis || 30000,
          source: 'itunes'
        });

        if (mapped.length >= limit) break;
      }

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
 * Fisher-Yates 真隨機均勻洗牌演算法（解決 Array.sort(Math.random) 容易偏向陣列前半段歌曲的問題）
 */
export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 根據主題 ID 盲抽隨機題目（支援自訂關鍵字輸入、跨場次防重複記憶、以及優先命中原唱歌手）
 * @param {string} themeId 主題識別碼 ('custom' 代表自訂主題)
 * @param {number} count 抽取的題數
 * @param {string} customKeyword 自訂主題或歌手關鍵字
 * @param {Set<string>} excludedNormTitles 該房間今晚已玩過的標準化歌名集合（避免連玩多場一直重複）
 * @returns {Promise<Array>} 隨機打亂的題目陣列
 */
export async function fetchThemeTracks(themeId, count = 10, customKeyword = '', excludedNormTitles = new Set()) {
  if (themeId === 'custom' && customKeyword && customKeyword.trim()) {
    const customResults = await searchSongs(customKeyword.trim(), Math.max(count + 15, 35));
    if (customResults && customResults.length > 0) {
      const unplayed = customResults.filter(s => !excludedNormTitles.has(normalizeSongTitle(s.title)));
      const pool = unplayed.length >= count ? unplayed : customResults;
      return shuffleArray(pool).slice(0, count);
    }
  }

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  // 優先挑選本房間還沒出現過的歌曲關鍵字
  const unplayedKeywords = theme.keywords.filter(kw => {
    const parts = kw.trim().split(/\s+/);
    const kwTitle = parts.length >= 2 ? normalizeSongTitle(parts.slice(1).join('')) : normalizeSongTitle(kw);
    return !excludedNormTitles.has(kwTitle);
  });

  // 若未玩過的歌還夠，完全從未玩過的池子抽；若整包 50 幾首都玩過一輪了，才重新洗牌補滿
  const candidatePool = unplayedKeywords.length >= count
    ? shuffleArray(unplayedKeywords)
    : [...shuffleArray(unplayedKeywords), ...shuffleArray(theme.keywords)];

  const selectedKeywords = candidatePool.slice(0, Math.min(count + 6, candidatePool.length));

  const allTracks = [];
  const seenIds = new Set();
  const seenNormTitles = new Set();

  for (const kw of selectedKeywords) {
    const parts = kw.trim().split(/\s+/);
    const expectedArtist = parts.length >= 2 ? parts[0].toLowerCase() : '';
    const expectedTitle = parts.length >= 2 ? normalizeSongTitle(parts.slice(1).join('')) : '';

    const results = await searchSongs(kw, 8);
    if (!results || results.length === 0) continue;

    // 優先選擇「歌手名稱吻合原唱」且「歌名吻合」的錄音室原曲，杜絕路人翻唱版
    const sortedCandidates = [...results].sort((a, b) => {
      const aArtistMatch = expectedArtist && (a.artist || '').toLowerCase().includes(expectedArtist) ? 2 : 0;
      const bArtistMatch = expectedArtist && (b.artist || '').toLowerCase().includes(expectedArtist) ? 2 : 0;
      const aTitleMatch = expectedTitle && normalizeSongTitle(a.title) === expectedTitle ? 1 : 0;
      const bTitleMatch = expectedTitle && normalizeSongTitle(b.title) === expectedTitle ? 1 : 0;
      return (bArtistMatch + bTitleMatch) - (aArtistMatch + aTitleMatch);
    });

    for (const song of sortedCandidates) {
      const normT = normalizeSongTitle(song.title);
      if (!seenIds.has(song.id) && !seenNormTitles.has(normT)) {
        seenIds.add(song.id);
        seenNormTitles.add(normT);
        allTracks.push(song);
        break;
      }
    }
    if (allTracks.length >= count) break;
  }

  // 如果網路不通抓到的歌不足，自動以備援歌庫補足
  if (allTracks.length < count) {
    for (const fb of shuffleArray(FALLBACK_TRACKS)) {
      const normT = normalizeSongTitle(fb.title);
      if (!seenIds.has(fb.id) && !seenNormTitles.has(normT)) {
        seenIds.add(fb.id);
        seenNormTitles.add(normT);
        allTracks.push(fb);
      }
      if (allTracks.length >= count) break;
    }
  }

  // 真隨機打亂並回傳指定題數
  return shuffleArray(allTracks).slice(0, count);
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
 * 產生高難度防刪去法選項（優先挑選「同歌手其他代表作」＋「排除本局已播過題目」）
 * @param {object} correctTrack 正確歌曲
 * @param {Array} poolOfTracks 候選歌曲池 (通常為本局 tracks 或題庫)
 * @param {number} totalChoices 產生的選項總數 (預設 4)
 * @param {Array} playedTracks 本局已揭曉過的題目 (避免玩家用「這首剛剛播過了」刪去)
 * @returns {Array} 打亂的選項陣列 [{ id, title, artist, displayText }]
 */
export function generateChoices(correctTrack, poolOfTracks = [], totalChoices = 4, playedTracks = []) {
  const needed = totalChoices - 1;
  const correctNormTitle = normalizeSongTitle(correctTrack.title);
  const correctArtist = (correctTrack.artist || '').toLowerCase().trim();

  // 記錄不可出現的歌名（正解本身 ＋ 本局所有題目，避免劇透或用「剛剛播過」刪去法）
  const forbiddenTitles = new Set([correctNormTitle]);
  for (const pt of playedTracks) {
    if (pt && pt.title) forbiddenTitles.add(normalizeSongTitle(pt.title));
  }
  for (const rt of poolOfTracks) {
    if (rt && rt.title && rt.id !== correctTrack.id) {
      forbiddenTitles.add(normalizeSongTitle(rt.title));
    }
  }

  const distractors = [];
  const usedNormTitles = new Set([correctNormTitle]);

  const tryAddDistractor = (song, idxSuffix) => {
    if (!song || !song.title) return false;
    const normT = normalizeSongTitle(song.title);
    if (!normT || usedNormTitles.has(normT)) return false;
    usedNormTitles.add(normT);
    distractors.push({
      id: song.id || `dist_${idxSuffix}_${Math.random().toString(36).slice(2, 7)}`,
      title: song.title,
      artist: song.artist || correctTrack.artist || '',
      displayText: `${song.title} - ${song.artist || correctTrack.artist || ''}`
    });
    return true;
  };

  // 1. 第一優先：從全域曲庫尋找「同一位歌手」的其他歌曲（讓玩家無法靠聽出歌手聲音或男女聲刪去！）
  if (correctArtist && SUGGESTION_CATALOG.size > 0) {
    const sameArtistSongs = [];
    for (const song of SUGGESTION_CATALOG.values()) {
      const a = (song.artist || '').toLowerCase().trim();
      const normT = normalizeSongTitle(song.title);
      if (
        !forbiddenTitles.has(normT) &&
        !usedNormTitles.has(normT) &&
        (a === correctArtist || a.includes(correctArtist) || correctArtist.includes(a))
      ) {
        sameArtistSongs.push(song);
      }
    }
    sameArtistSongs.sort(() => Math.random() - 0.5);
    for (const s of sameArtistSongs) {
      if (distractors.length >= needed) break;
      tryAddDistractor(s, 'same_artist');
    }
  }

  // 2. 第二優先：從全域曲庫挑選未曾在本局出現過的同語系歌曲（絕不優先拿本局已播過的歌）
  if (distractors.length < needed && SUGGESTION_CATALOG.size > 0) {
    const isAsciiTitle = /^[a-z0-9\s.,!?'-]+$/i.test(correctTrack.title || '');
    const catalogCandidates = [];
    for (const song of SUGGESTION_CATALOG.values()) {
      const normT = normalizeSongTitle(song.title);
      if (forbiddenTitles.has(normT) || usedNormTitles.has(normT)) continue;
      const songIsAscii = /^[a-z0-9\s.,!?'-]+$/i.test(song.title || '');
      if (songIsAscii === isAsciiTitle) {
        catalogCandidates.push(song);
      }
    }
    catalogCandidates.sort(() => Math.random() - 0.5);
    for (const s of catalogCandidates) {
      if (distractors.length >= needed) break;
      tryAddDistractor(s, 'cat');
    }
  }

  // 3. 最後保底：若傳入的 poolOfTracks 還有剩餘（例如單純單元測試時）
  if (distractors.length < needed) {
    const shuffledPool = [...poolOfTracks].filter(t => t.id !== correctTrack.id).sort(() => Math.random() - 0.5);
    for (const s of shuffledPool) {
      if (distractors.length >= needed) break;
      tryAddDistractor(s, 'pool');
    }
  }

  // 合併正解並打亂順序
  const choices = [
    {
      id: correctTrack.id,
      title: correctTrack.title,
      artist: correctTrack.artist,
      displayText: `${correctTrack.title} - ${correctTrack.artist}`
    },
    ...distractors
  ].sort(() => Math.random() - 0.5);

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
