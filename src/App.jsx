import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   THANH XUÂN RỰC RỠ
   Deluxe Career & Assets Edition
   SINGLE FILE REACT APP
========================================================= */

const SAVE_KEY = "thanh_xuan_ruc_ro_save_v3";

const TIMES = [
  { label: "07:30", name: "Buổi sáng" },
  { label: "09:15", name: "Tiết 2" },
  { label: "11:30", name: "Giờ trưa" },
  { label: "14:00", name: "Buổi chiều" },
  { label: "17:00", name: "Tan học" },
  { label: "20:30", name: "Buổi tối" },
];

const LOCATIONS = {
  class: { name: "Lớp học", icon: "🏫" },
  canteen: { name: "Căn-tin", icon: "🍜" },
  job: { name: "Việc làm", icon: "💼" },
  cert: { name: "Phòng thi", icon: "📜" },
  prop: { name: "Tài sản", icon: "🏠" },
  home: { name: "Nhà", icon: "🏡" },
};

const NPCS = [
  {
    id: "lan",
    name: "Lan",
    avatar: "👧",
    color: "#ff7eb6",
    role: "Bạn thân",
  },
  {
    id: "trieu_man",
    name: "Triệu Mẫn",
    avatar: "🌸",
    color: "#a78bfa",
    role: "Crush",
  },
  {
    id: "tuan",
    name: "Tuấn",
    avatar: "🧑‍🎓",
    color: "#38bdf8",
    role: "Bạn cùng lớp",
  },
];

const JOBS = [
  {
    id: "canteen",
    name: "Phụ căn-tin",
    icon: "🍜",
    pay: 25000,
    desc: "Phụ bán đồ ăn sau giờ học.",
    req: () => true,
  },
  {
    id: "flyer",
    name: "Phát tờ rơi",
    icon: "📄",
    pay: 30000,
    desc: "Công việc đơn giản, mất ít thời gian.",
    req: () => true,
  },
  {
    id: "excel",
    name: "Nhập liệu Excel",
    icon: "💻",
    pay: 70000,
    desc: "Cần kỹ năng máy tính.",
    req: (s) => s.stats.skill >= 100,
  },
  {
    id: "driver",
    name: "Tài xế VIP",
    icon: "🚗",
    pay: 100000,
    desc: "Cần bằng lái và xe riêng.",
    req: (s) =>
      s.certificates.includes("cert_driver") &&
      s.assets.some((x) => x === "asset_car_sedan" || x === "asset_car_super"),
  },
  {
    id: "interpreter",
    name: "Trợ lý phiên dịch",
    icon: "🌎",
    pay: 150000,
    desc: "Cần TOEIC và kỹ năng tốt.",
    req: (s) =>
      s.certificates.includes("cert_toeic") && s.stats.skill >= 300,
  },
  {
    id: "broker",
    name: "Cộng tác viên chứng khoán",
    icon: "📈",
    pay: 250000,
    desc: "Cần chứng chỉ tài chính và kỹ năng.",
    req: (s) =>
      s.certificates.includes("cert_finance") && s.stats.skill >= 500,
  },
];

const PROPERTIES = [
  {
    id: "asset_bike",
    name: "Xe đạp",
    icon: "🚲",
    price: 500000,
    desc: "+5 kỹ năng di chuyển",
    effect: { skill: 5 },
  },
  {
    id: "asset_car_sedan",
    name: "Ô tô Sedan",
    icon: "🚘",
    price: 350000000,
    desc: "+10 uy tín",
    effect: { reputation: 10 },
  },
  {
    id: "asset_car_super",
    name: "Siêu xe",
    icon: "🏎️",
    price: 1200000000,
    desc: "+20 uy tín, +10 tâm trạng",
    effect: { reputation: 20, mood: 10 },
  },
  {
    id: "asset_condo",
    name: "Căn hộ",
    icon: "🏢",
    price: 2500000000,
    desc: "+15 tâm trạng, +10 uy tín",
    effect: { mood: 15, reputation: 10 },
  },
  {
    id: "asset_villa",
    name: "Biệt thự",
    icon: "🏰",
    price: 8000000000,
    desc: "+25 tâm trạng, +20 uy tín",
    effect: { mood: 25, reputation: 20 },
  },
];

const CERTS = {
  cert_driver: {
    id: "cert_driver",
    name: "Bằng lái xe",
    icon: "🚗",
    fee: 500000,
    skill: 100,
    questions: [
      {
        q: "Đèn đỏ có được phép đi tiếp không?",
        choices: ["Có", "Không", "Tùy đường", "Nếu vắng xe"],
        answer: 1,
      },
      {
        q: "Khi lái xe cần thắt dây an toàn?",
        choices: ["Có", "Không", "Chỉ đường dài", "Chỉ ban đêm"],
        answer: 0,
      },
      {
        q: "Biển báo hình tam giác thường có ý nghĩa gì?",
        choices: ["Cấm", "Chỉ dẫn", "Cảnh báo", "Bắt buộc"],
        answer: 2,
      },
    ],
  },
  cert_toeic: {
    id: "cert_toeic",
    name: "TOEIC",
    icon: "🇬🇧",
    fee: 700000,
    skill: 300,
    questions: [
      {
        q: "She ___ to school every day.",
        choices: ["go", "goes", "going", "gone"],
        answer: 1,
      },
      {
        q: "Choose the opposite of 'cheap'.",
        choices: ["small", "expensive", "easy", "short"],
        answer: 1,
      },
      {
        q: "I have lived here ___ 2022.",
        choices: ["for", "since", "at", "on"],
        answer: 1,
      },
    ],
  },
  cert_mos: {
    id: "cert_mos",
    name: "MOS Office",
    icon: "💻",
    fee: 600000,
    skill: 100,
    questions: [
      {
        q: "Ctrl + C dùng để làm gì?",
        choices: ["Dán", "Sao chép", "Cắt", "Lưu"],
        answer: 1,
      },
      {
        q: "Excel thường dùng để?",
        choices: ["Tính toán dữ liệu", "Chụp ảnh", "Nghe nhạc", "Vẽ 3D"],
        answer: 0,
      },
      {
        q: "Ctrl + S thường dùng để?",
        choices: ["Lưu", "Xóa", "In", "Đóng"],
        answer: 0,
      },
    ],
  },
  cert_finance: {
    id: "cert_finance",
    name: "Tài chính cơ bản",
    icon: "📈",
    fee: 1000000,
    skill: 500,
    questions: [
      {
        q: "ROI là chỉ số liên quan đến?",
        choices: ["Lợi nhuận đầu tư", "Dân số", "Thời tiết", "Tốc độ mạng"],
        answer: 0,
      },
      {
        q: "Đa dạng hóa danh mục giúp?",
        choices: [
          "Tăng mọi rủi ro",
          "Giảm rủi ro tập trung",
          "Không có tác dụng",
          "Luôn tăng lợi nhuận",
        ],
        answer: 1,
      },
      {
        q: "Cổ phiếu đại diện cho?",
        choices: ["Khoản vay", "Quyền sở hữu doanh nghiệp", "Tiền mặt", "Thuế"],
        answer: 1,
      },
    ],
  },
};

const CANTEEN_ITEMS = [
  {
    id: "snack",
    name: "Bánh mì",
    icon: "🥪",
    price: 15000,
    effect: { energy: 8, mood: 3 },
  },
  {
    id: "meal",
    name: "Cơm phần",
    icon: "🍱",
    price: 30000,
    effect: { energy: 20, hp: 5 },
  },
  {
    id: "milk",
    name: "Sữa",
    icon: "🥛",
    price: 12000,
    effect: { hp: 8, energy: 5 },
  },
  {
    id: "coffee",
    name: "Cà phê",
    icon: "☕",
    price: 20000,
    effect: { energy: 25, mood: -2 },
  },
  {
    id: "fruit",
    name: "Trái cây",
    icon: "🍎",
    price: 25000,
    effect: { hp: 10, mood: 5 },
  },
];

/* =========================================================
   QUIZ BANK
========================================================= */

const QUIZ_BANK = [
  {
    id: "m1",
    subject: "Toán",
    q: "Đạo hàm của y = x² là?",
    choices: ["x", "2x", "x²", "2"],
    answer: 1,
    explain: "Theo quy tắc đạo hàm: (x²)' = 2x.",
  },
  {
    id: "m2",
    subject: "Toán",
    q: "Cấp số cộng có công sai d = 3, số hạng đầu là 2. Số hạng thứ 4 bằng?",
    choices: ["8", "9", "11", "12"],
    answer: 2,
    explain: "a4 = a1 + 3d = 2 + 9 = 11.",
  },
  {
    id: "m3",
    subject: "Ngữ văn",
    q: "Tác phẩm 'Vợ nhặt' của nhà văn nào?",
    choices: ["Nam Cao", "Kim Lân", "Tô Hoài", "Nguyễn Tuân"],
    answer: 1,
    explain: "Vợ nhặt là truyện ngắn nổi tiếng của Kim Lân.",
  },
  {
    id: "m4",
    subject: "Vật lý",
    q: "Đơn vị của công suất là?",
    choices: ["Jun", "Oát", "Niutơn", "Pascal"],
    answer: 1,
    explain: "Công suất có đơn vị SI là Watt (W).",
  },
  {
    id: "m5",
    subject: "Hóa học",
    q: "Công thức hóa học của nước là?",
    choices: ["CO₂", "O₂", "H₂O", "NaCl"],
    answer: 2,
    explain: "Một phân tử nước gồm 2 H và 1 O.",
  },
  {
    id: "m6",
    subject: "Sinh học",
    q: "Đơn vị cơ bản của sự sống là?",
    choices: ["Mô", "Cơ quan", "Tế bào", "Hệ cơ quan"],
    answer: 2,
    explain: "Tế bào là đơn vị cấu trúc và chức năng cơ bản của sự sống.",
  },
  {
    id: "m7",
    subject: "Lịch sử",
    q: "Cách mạng tháng Tám thành công vào năm nào?",
    choices: ["1930", "1945", "1954", "1975"],
    answer: 1,
    explain: "Cách mạng tháng Tám diễn ra và giành chính quyền năm 1945.",
  },
  {
    id: "m8",
    subject: "Địa lý",
    q: "Việt Nam nằm ở khu vực nào của châu Á?",
    choices: [
      "Đông Nam Á",
      "Tây Á",
      "Bắc Á",
      "Trung Á",
    ],
    answer: 0,
    explain: "Việt Nam thuộc khu vực Đông Nam Á.",
  },
  {
    id: "m9",
    subject: "Tiếng Anh",
    q: "If I ___ rich, I would travel around the world.",
    choices: ["am", "was", "were", "be"],
    answer: 2,
    explain: "Câu điều kiện loại 2 dùng 'were' cho giả định.",
  },
  {
    id: "m10",
    subject: "GDCD",
    q: "Pháp luật có tính chất nào sau đây?",
    choices: [
      "Tự nguyện tuyệt đối",
      "Bắt buộc chung",
      "Chỉ áp dụng cho học sinh",
      "Không có chế tài",
    ],
    answer: 1,
    explain: "Pháp luật là hệ thống quy tắc xử sự có tính bắt buộc chung.",
  },
  {
    id: "m11",
    subject: "Đố mẹo",
    q: "Cái gì càng lấy đi thì càng lớn?",
    choices: ["Cái túi", "Cái hố", "Cái bàn", "Cái cây"],
    answer: 1,
    explain: "Càng đào/lấy đất khỏi cái hố thì cái hố càng lớn.",
  },
  {
    id: "m12",
    subject: "Đố mẹo",
    q: "Một năm có bao nhiêu tháng có 28 ngày?",
    choices: ["1", "2", "6", "12"],
    answer: 3,
    explain: "Tất cả 12 tháng đều có ít nhất 28 ngày.",
  },
  {
    id: "m13",
    subject: "Toán",
    q: "5 × 6 + 4 bằng?",
    choices: ["34", "44", "50", "54"],
    answer: 0,
    explain: "5 × 6 = 30, cộng 4 bằng 34.",
  },
  {
    id: "m14",
    subject: "Hóa học",
    q: "Oxi có công thức phân tử là?",
    choices: ["O", "O₂", "O₃", "CO₂"],
    answer: 1,
    explain: "Khí oxi trong điều kiện thường có công thức O₂.",
  },
];

/* =========================================================
   TITLES
========================================================= */

const TITLES = [
  {
    id: "newbie",
    name: "Tân binh Thanh Xuân",
    icon: "🌱",
    desc: "Bắt đầu hành trình cấp 3.",
    condition: (s) => s.day >= 1,
  },
  {
    id: "study",
    name: "Học Bá",
    icon: "📚",
    desc: "Điểm học tập đạt 80.",
    condition: (s) => s.stats.study >= 80,
  },
  {
    id: "social",
    name: "Người Kết Nối",
    icon: "🤝",
    desc: "Điểm bạn bè đạt 80.",
    condition: (s) => s.stats.friends >= 80,
  },
  {
    id: "love",
    name: "Kẻ Si Tình",
    icon: "💖",
    desc: "Tình cảm đạt 80.",
    condition: (s) => s.stats.love >= 80,
  },
  {
    id: "skill",
    name: "Đa Tài",
    icon: "⚡",
    desc: "Kỹ năng đạt 80.",
    condition: (s) => s.stats.skill >= 80,
  },
  {
    id: "rich",
    name: "Đại Gia Học Đường",
    icon: "💰",
    desc: "Tài sản tiền mặt đạt 10 tỷ.",
    condition: (s) => s.stats.money >= 10000000000,
  },
  {
    id: "certificate",
    name: "Thợ Săn Chứng Chỉ",
    icon: "🏅",
    desc: "Có đủ 4 chứng chỉ.",
    condition: (s) => s.certificates.length >= 4,
  },
  {
    id: "asset",
    name: "Ông Trùm Tài Sản",
    icon: "🏠",
    desc: "Sở hữu ít nhất 3 tài sản.",
    condition: (s) => s.assets.length >= 3,
  },
  {
    id: "champion",
    name: "Quán Quân Thi Đua",
    icon: "🏆",
    desc: "Điểm thi đua cá nhân đạt 500.",
    condition: (s) => s.competition.self >= 500,
  },
  {
    id: "perfect",
    name: "Thanh Xuân Rực Rỡ",
    icon: "🌟",
    desc: "Hoàn thành hành trình 45 ngày.",
    condition: (s) => s.day >= 45 || s.isGameOver,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(value) || 0));

const money = (n) =>
  new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.round(n || 0))) + "đ";

const uid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

function createInitialState() {
  return {
    isGameOver: false,
    day: 1,
    totalDays: 45,
    timeIndex: 0,
    location: "class",

    stats: {
      hp: 85,
      energy: 100,
      mood: 75,
      study: 50,
      friends: 40,
      love: 20,
      reputation: 30,
      skill: 25,
      money: 150000,
    },

    certificates: [],
    assets: [],

    bag: [
      {
        id: "math_note",
        name: "Sổ Công Thức",
        icon: "📘",
        count: 1,
        desc: "+8 học tập",
      },
      {
        id: "gift_strawberry",
        name: "Kẹo Dâu Tây",
        icon: "🍬",
        count: 2,
        desc: "+8 tình cảm",
      },
    ],

    npc: {
      lan: {
        friendship: 35,
        competition: 100,
      },
      trieu_man: {
        friendship: 20,
        competition: 120,
      },
      tuan: {
        friendship: 30,
        competition: 110,
      },
    },

    competition: {
      self: 0,
      history: [],
    },

    titles: ["newbie"],

    diaryEntries: [],

    lastHomeRestKey: "",

    createdAt: Date.now(),
  };
}

function normalizeState(raw) {
  const base = createInitialState();

  if (!raw || typeof raw !== "object") return base;

  const merged = {
    ...base,
    ...raw,
    stats: {
      ...base.stats,
      ...(raw.stats || {}),
    },
    npc: {
      ...base.npc,
      ...(raw.npc || {}),
    },
    competition: {
      ...base.competition,
      ...(raw.competition || {}),
    },
  };

  merged.day = Math.max(1, Math.min(45, Number(merged.day) || 1));
  merged.timeIndex = Math.max(
    0,
    Math.min(TIMES.length - 1, Number(merged.timeIndex) || 0)
  );

  Object.keys(merged.stats).forEach((key) => {
    if (key === "money") {
      merged.stats[key] = Math.max(0, Number(merged.stats[key]) || 0);
    } else {
      merged.stats[key] = clamp(merged.stats[key]);
    }
  });

  merged.certificates = Array.isArray(merged.certificates)
    ? merged.certificates
    : [];

  merged.assets = Array.isArray(merged.assets) ? merged.assets : [];

  merged.bag = Array.isArray(merged.bag) ? merged.bag : base.bag;

  merged.diaryEntries = Array.isArray(merged.diaryEntries)
    ? merged.diaryEntries
    : [];

  return merged;
}

function encodeSaveCode(data) {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";

  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + 0x8000)
    );
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeSaveCode(code) {
  let b64 = String(code || "")
    .trim()
    .replace(/\s/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  while (b64.length % 4) b64 += "=";

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return JSON.parse(new TextDecoder().decode(bytes));
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [game, setGame] = useState(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      return saved ? normalizeState(JSON.parse(saved)) : createInitialState();
    } catch {
      return createInitialState();
    }
  });

  const [overlay, setOverlay] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState("");

  const [quiz, setQuiz] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  const [exam, setExam] = useState(null);
  const [examIndex, setExamIndex] = useState(0);
  const [examScore, setExamScore] = useState(0);

  const [saveCode, setSaveCode] = useState("");
  const [saveInput, setSaveInput] = useState("");

  const [audioEnabled, setAudioEnabled] = useState(true);

  const audioRef = useRef(null);
  const fileRef = useRef(null);

  /* =====================================================
     SAVE
  ===================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    } catch {}
  }, [game]);

  /* =====================================================
     TOAST
  ===================================================== */

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  /* =====================================================
     AUDIO
  ===================================================== */

  const playTone = (
    frequency = 440,
    duration = 0.08,
    type = "square"
  ) => {
    if (!audioEnabled) return;

    try {
      const Ctx =
        window.AudioContext || window.webkitAudioContext;

      if (!Ctx) return;

      const ctx = audioRef.current || new Ctx();
      audioRef.current = ctx;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = frequency;

      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  /* =====================================================
     TITLES
  ===================================================== */

  useEffect(() => {
    const unlocked = TITLES
      .filter((title) => title.condition(game))
      .map((title) => title.id);

    const missing = unlocked.filter(
      (id) => !game.titles.includes(id)
    );

    if (missing.length) {
      setGame((prev) => ({
        ...prev,
        titles: [...new Set([...prev.titles, ...missing])],
      }));

      const names = missing
        .map((id) => TITLES.find((x) => x.id === id))
        .filter(Boolean)
        .map((x) => `${x.icon} ${x.name}`)
        .join(", ");

      notify(`🎖️ Mở khóa danh hiệu: ${names}`);
      playTone(880, 0.15);
    }
  }, [
    game.stats.study,
    game.stats.friends,
    game.stats.love,
    game.stats.skill,
    game.stats.money,
    game.assets.length,
    game.certificates.length,
    game.competition.self,
    game.day,
    game.isGameOver,
  ]);

  /* =====================================================
     NPC AUTOMATIC COMPETITION
  ===================================================== */

  useEffect(() => {
    if (game.day <= 1) return;

    const history = game.competition.history || [];

    if (history.some((x) => x.day === game.day)) return;

    const increments = {
      lan: 12 + Math.floor(Math.random() * 9),
      trieu_man: 10 + Math.floor(Math.random() * 12),
      tuan: 13 + Math.floor(Math.random() * 10),
    };

    setGame((prev) => {
      if (
        (prev.competition.history || []).some(
          (x) => x.day === prev.day
        )
      ) {
        return prev;
      }

      const next = {
        ...prev,
        npc: {
          ...prev.npc,
          lan: {
            ...prev.npc.lan,
            competition:
              prev.npc.lan.competition + increments.lan,
          },
          trieu_man: {
            ...prev.npc.trieu_man,
            competition:
              prev.npc.trieu_man.competition +
              increments.trieu_man,
          },
          tuan: {
            ...prev.npc.tuan,
            competition:
              prev.npc.tuan.competition + increments.tuan,
          },
        },
        competition: {
          ...prev.competition,
          history: [
            ...(prev.competition.history || []),
            {
              day: prev.day,
              self: prev.competition.self,
              lan:
                prev.npc.lan.competition +
                increments.lan,
              trieu_man:
                prev.npc.trieu_man.competition +
                increments.trieu_man,
              tuan:
                prev.npc.tuan.competition +
                increments.tuan,
            },
          ],
        },
      };

      return next;
    });
  }, [game.day]);

  /* =====================================================
     AUTO CLOCK
  ===================================================== */

  useEffect(() => {
    if (game.isGameOver) return;

    const timer = setInterval(() => {
      setGame((prev) => {
        if (prev.isGameOver) return prev;

        if (prev.timeIndex < TIMES.length - 1) {
          return {
            ...prev,
            timeIndex: prev.timeIndex + 1,
          };
        }

        if (prev.day >= prev.totalDays) {
          return {
            ...prev,
            isGameOver: true,
          };
        }

        const nextDay = prev.day + 1;

        const entry = {
          id: uid(),
          day: prev.day,
          text: createDiaryText(prev),
          createdAt: Date.now(),
        };

        return {
          ...prev,
          day: nextDay,
          timeIndex: 0,
          location: "class",
          diaryEntries: [
            ...prev.diaryEntries,
            entry,
          ],
          lastHomeRestKey: "",
        };
      });
    }, 15000);

    return () => clearInterval(timer);
  }, [game.isGameOver]);

  /* =====================================================
     GAME ACTIONS
  ===================================================== */

  const modifyStats = (delta) => {
    setGame((prev) => {
      const stats = { ...prev.stats };

      Object.entries(delta).forEach(([key, value]) => {
        if (!(key in stats)) return;

        if (key === "money") {
          stats[key] = Math.max(
            0,
            Number(stats[key]) + Number(value)
          );
        } else {
          stats[key] = clamp(
            Number(stats[key]) + Number(value)
          );
        }
      });

      return {
        ...prev,
        stats,
      };
    });
  };

  const addCompetition = (amount, reason = "") => {
    setGame((prev) => ({
      ...prev,
      competition: {
        ...prev.competition,
        self: prev.competition.self + amount,
        history: prev.competition.history,
      },
    }));

    if (reason) {
      notify(`🏆 +${amount} điểm thi đua — ${reason}`);
    }
  };

  const advanceTime = (reason = "Hoàn thành hoạt động") => {
    setGame((prev) => {
      if (prev.isGameOver) return prev;

      if (prev.timeIndex < TIMES.length - 1) {
        return {
          ...prev,
          timeIndex: prev.timeIndex + 1,
          location: "class",
        };
      }

      if (prev.day >= prev.totalDays) {
        return {
          ...prev,
          isGameOver: true,
        };
      }

      const entry = {
        id: uid(),
        day: prev.day,
        text: createDiaryText(prev),
        reason,
        createdAt: Date.now(),
      };

      return {
        ...prev,
        day: prev.day + 1,
        timeIndex: 0,
        location: "class",
        diaryEntries: [
          ...prev.diaryEntries,
          entry,
        ],
        lastHomeRestKey: "",
      };
    });

    playTone(620, 0.07);
  };

  const goLocation = (location) => {
    setGame((prev) => ({
      ...prev,
      location,
    }));

    setDrawer(null);
    playTone(520, 0.05);
  };

  /* =====================================================
     STUDY
  ===================================================== */

  const startQuiz = () => {
    const shuffled = [...QUIZ_BANK]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    setQuiz({
      questions: shuffled,
    });

    setQuizIndex(0);
    setQuizScore(0);
    setOverlay("quiz");
    playTone(700, 0.08);
  };

  const answerQuiz = (answer) => {
    if (!quiz) return;

    const current = quiz.questions[quizIndex];
    const correct = answer === current.answer;

    if (correct) {
      setQuizScore((x) => x + 1);

      modifyStats({
        study: 5,
        skill: 1,
        mood: 2,
      });

      addCompetition(10, "Trả lời đúng câu hỏi");
      notify("✅ Chính xác! +5 học tập");
      playTone(880, 0.1);
    } else {
      modifyStats({
        study: 1,
        mood: -3,
        energy: -3,
      });

      notify(`❌ Sai rồi! Đáp án: ${current.choices[current.answer]}`);
      playTone(180, 0.12);
    }

    if (quizIndex >= quiz.questions.length - 1) {
      setTimeout(() => {
        setOverlay(null);
        setQuiz(null);
        advanceTime("Hoàn thành tiết học");
      }, 450);
    } else {
      setQuizIndex((x) => x + 1);
    }
  };

  /* =====================================================
     HOME
  ===================================================== */

  const restAtHome = () => {
    const key = `${game.day}-${game.timeIndex}`;

    if (game.lastHomeRestKey === key) {
      notify("😴 Bạn đã nghỉ ở nhà trong khung giờ này rồi.");
      return;
    }

    setGame((prev) => ({
      ...prev,
      lastHomeRestKey: key,
      location: "home",
    }));

    modifyStats({
      energy: 25,
      hp: 5,
      mood: 5,
    });

    addCompetition(3, "Nghỉ ngơi đúng giờ");
    notify("🏡 Nghỉ ngơi +25 năng lượng");
    playTone(560, 0.08);
  };

  /* =====================================================
     CANTEEN
  ===================================================== */

  const buyFood = (item) => {
    if (game.stats.money < item.price) {
      notify("💸 Không đủ tiền.");
      return;
    }

    setGame((prev) => {
      const stats = {
        ...prev.stats,
        money: prev.stats.money - item.price,
      };

      Object.entries(item.effect).forEach(([key, value]) => {
        stats[key] =
          key === "money"
            ? Math.max(0, stats[key] + value)
            : clamp(stats[key] + value);
      });

      return {
        ...prev,
        stats,
      };
    });

    notify(`${item.icon} Đã mua ${item.name}`);
    playTone(640, 0.06);
  };

  /* =====================================================
     JOBS
  ===================================================== */

  const doJob = (job) => {
    if (!job.req(game)) {
      notify("🔒 Bạn chưa đủ điều kiện cho công việc này.");
      return;
    }

    if (game.stats.energy < 20) {
      notify("😵 Không đủ năng lượng.");
      return;
    }

    modifyStats({
      money: job.pay,
      energy: -20,
      mood: -2,
      skill: 2,
      reputation: 1,
    });

    addCompetition(15, `Hoàn thành: ${job.name}`);
    notify(`💼 +${money(job.pay)} từ ${job.name}`);
    advanceTime(`Làm việc: ${job.name}`);
  };

  /* =====================================================
     PROPERTY
  ===================================================== */

  const buyProperty = (property) => {
    if (game.assets.includes(property.id)) {
      notify("🏠 Bạn đã sở hữu tài sản này.");
      return;
    }

    if (game.stats.money < property.price) {
      notify("💸 Chưa đủ tiền.");
      return;
    }

    setGame((prev) => {
      const stats = {
        ...prev.stats,
        money: prev.stats.money - property.price,
      };

      Object.entries(property.effect || {}).forEach(
        ([key, value]) => {
          stats[key] = clamp(
            Number(stats[key] || 0) + Number(value)
          );
        }
      );

      return {
        ...prev,
        stats,
        assets: [...prev.assets, property.id],
      };
    });

    addCompetition(25, `Mua ${property.name}`);
    notify(`🏠 Đã mua ${property.name}`);
    playTone(900, 0.12);
  };

  /* =====================================================
     CERTIFICATE
  ===================================================== */

  const startExam = (cert) => {
    if (game.certificates.includes(cert.id)) {
      notify("🏅 Bạn đã có chứng chỉ này.");
      return;
    }

    if (game.stats.money < cert.fee) {
      notify("💸 Không đủ lệ phí.");
      return;
    }

    if (game.stats.skill < cert.skill) {
      notify(`🔒 Cần kỹ năng tối thiểu ${cert.skill}.`);
      return;
    }

    modifyStats({
      money: -cert.fee,
    });

    setExam(cert);
    setExamIndex(0);
    setExamScore(0);
    setOverlay("exam");
    playTone(720, 0.08);
  };

  const answerExam = (answer) => {
    if (!exam) return;

    const current = exam.questions[examIndex];
    const correct = answer === current.answer;

    const newScore = examScore + (correct ? 1 : 0);

    if (correct) {
      notify("✅ Đúng!");
      playTone(850, 0.08);
    } else {
      notify("❌ Sai!");
      playTone(180, 0.1);
    }

    if (examIndex >= exam.questions.length - 1) {
      if (newScore >= 2) {
        setGame((prev) => ({
          ...prev,
          certificates: [
            ...new Set([
              ...prev.certificates,
              exam.id,
            ]),
          ],
        }));

        modifyStats({
          skill: 8,
          reputation: 5,
        });

        addCompetition(35, `Đậu ${exam.name}`);
        notify(`🎉 ĐẬU ${exam.name}!`);
      } else {
        notify("😢 Chưa đạt. Hãy ôn luyện thêm.");
      }

      setTimeout(() => {
        setOverlay(null);
        setExam(null);
      }, 600);
    } else {
      setExamScore(newScore);
      setExamIndex((x) => x + 1);
    }
  };

  /* =====================================================
     NPC
  ===================================================== */

  const interactNPC = (npcId) => {
    if (npcId === "lan") {
      setGame((prev) => ({
        ...prev,
        npc: {
          ...prev.npc,
          lan: {
            ...prev.npc.lan,
            friendship: clamp(
              prev.npc.lan.friendship + 6
            ),
          },
        },
      }));

      modifyStats({
        friends: 5,
        mood: 4,
      });

      addCompetition(8, "Giúp đỡ Lan");
      notify("👧 Lan rất vui vì bạn đã giúp đỡ!");
    }

    if (npcId === "trieu_man") {
      setGame((prev) => ({
        ...prev,
        npc: {
          ...prev.npc,
          trieu_man: {
            ...prev.npc.trieu_man,
            friendship: clamp(
              prev.npc.trieu_man.friendship + 5
            ),
          },
        },
      }));

      modifyStats({
        love: 6,
        mood: 5,
      });

      addCompetition(8, "Tương tác tích cực với Triệu Mẫn");
      notify("🌸 Triệu Mẫn mỉm cười với bạn.");
    }

    if (npcId === "tuan") {
      setGame((prev) => ({
        ...prev,
        npc: {
          ...prev.npc,
          tuan: {
            ...prev.npc.tuan,
            friendship: clamp(
              prev.npc.tuan.friendship + 5
            ),
          },
        },
      }));

      modifyStats({
        skill: 4,
        friends: 3,
      });

      addCompetition(8, "Học hỏi từ Tuấn");
      notify("🧑‍🎓 Tuấn chia sẻ một mẹo học hay.");
    }
  };

  /* =====================================================
     BAG
  ===================================================== */

  const useBagItem = (item) => {
    if (!item || item.count <= 0) return;

    let effect = {};

    if (item.id === "math_note") {
      effect = { study: 8 };
    }

    if (item.id === "gift_strawberry") {
      effect = { love: 8 };
    }

    setGame((prev) => ({
      ...prev,
      bag: prev.bag.map((x) =>
        x.id === item.id
          ? { ...x, count: Math.max(0, x.count - 1) }
          : x
      ),
    }));

    modifyStats(effect);
    addCompetition(5, `Sử dụng ${item.name}`);
    notify(`🎒 Đã sử dụng ${item.name}`);
  };

  /* =====================================================
     SAVE CODE
  ===================================================== */

  const generateSaveCode = () => {
    const code = encodeSaveCode(game);
    setSaveCode(code);
    setSaveInput(code);
    setOverlay("save");
    playTone(700, 0.08);
  };

  const importSaveCode = () => {
    try {
      const decoded = decodeSaveCode(saveInput);

      const normalized = normalizeState(decoded);

      setGame(normalized);
      setOverlay(null);

      notify("✅ Đã khôi phục game từ Save Code!");
      playTone(900, 0.1);
    } catch {
      notify("❌ Save Code không hợp lệ.");
    }
  };

  const copySaveCode = async () => {
    try {
      await navigator.clipboard.writeText(
        saveCode || saveInput
      );

      notify("📋 Đã copy Save Code!");
    } catch {
      notify("⚠️ Trình duyệt không cho phép copy tự động.");
    }
  };

  const exportFile = () => {
    const blob = new Blob(
      [JSON.stringify(game, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `thanh-xuan-ngay-${game.day}.json`;
    a.click();

    URL.revokeObjectURL(url);

    notify("💾 Đã xuất file save.");
  };

  const importFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        setGame(normalizeState(data));
        notify("✅ Đã tải file save.");
      } catch {
        notify("❌ File save không hợp lệ.");
      }

      event.target.value = "";
    };

    reader.readAsText(file);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const restart = () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn bắt đầu lại từ đầu không?"
      )
    ) {
      return;
    }

    const fresh = createInitialState();

    setGame(fresh);
    setOverlay(null);
    setDrawer(null);
    notify("🌱 Một thanh xuân mới bắt đầu!");
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const navigation = [
    ["class", "🏫", "Lớp"],
    ["canteen", "🍜", "Căn-tin"],
    ["job", "💼", "Việc"],
    ["cert", "📜", "Thi"],
    ["prop", "🏠", "Tài sản"],
    ["home", "🏡", "Nhà"],
  ];

  /* =====================================================
     COMPUTED
  ===================================================== */

  const currentTime = TIMES[game.timeIndex];

  const ranking = useMemo(() => {
    const rows = [
      {
        id: "self",
        name: "Bạn",
        avatar: "🧑‍🎓",
        score: game.competition.self,
        type: "self",
      },
      {
        id: "lan",
        name: "Lan",
        avatar: "👧",
        score: game.npc.lan.competition,
      },
      {
        id: "trieu_man",
        name: "Triệu Mẫn",
        avatar: "🌸",
        score: game.npc.trieu_man.competition,
      },
      {
        id: "tuan",
        name: "Tuấn",
        avatar: "🧑‍🎓",
        score: game.npc.tuan.competition,
      },
    ];

    return rows.sort((a, b) => b.score - a.score);
  }, [game]);

  const rankPosition =
    ranking.findIndex((x) => x.id === "self") + 1;

  const progressPercent =
    ((game.timeIndex + 1) / TIMES.length) * 100;

  /* =====================================================
     UI HELPERS
  ===================================================== */

  const StatBar = ({
    label,
    value,
    icon,
  }) => (
    <div className="stat">
      <div className="stat-top">
        <span>
          {icon} {label}
        </span>
        <b>{Math.round(value)}</b>
      </div>

      <div className="bar">
        <div
          className="bar-fill"
          style={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );

  const Header = () => (
    <header className="topbar">
      <div>
        <div className="brand">
          🌸 THANH XUÂN RỰC RỠ
        </div>
        <div className="subtitle">
          Nhật ký cấp 3 · Deluxe Edition
        </div>
      </div>

      <div className="top-actions">
        <button
          className="icon-btn"
          onClick={() => setAudioEnabled((x) => !x)}
        >
          {audioEnabled ? "🔊" : "🔇"}
        </button>

        <button
          className="icon-btn"
          onClick={generateSaveCode}
        >
          💾
        </button>

        <button
          className="icon-btn"
          onClick={() => setDrawer("competition")}
        >
          🏆
        </button>
      </div>
    </header>
  );

  const HUD = () => (
    <section className="hud">
      <div className="day-card">
        <div className="day-big">
          NGÀY {game.day}
        </div>

        <div className="time-big">
          {currentTime.label}
        </div>

        <div className="time-name">
          {currentTime.name}
        </div>

        <div className="progress">
          <div
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <small>
          Tự động chuyển thời gian
        </small>
      </div>

      <div className="stats-grid">
        <StatBar
          label="HP"
          value={game.stats.hp}
          icon="❤️"
        />

        <StatBar
          label="Năng lượng"
          value={game.stats.energy}
          icon="⚡"
        />

        <StatBar
          label="Tâm trạng"
          value={game.stats.mood}
          icon="😊"
        />

        <StatBar
          label="Học tập"
          value={game.stats.study}
          icon="📚"
        />

        <StatBar
          label="Bạn bè"
          value={game.stats.friends}
          icon="🤝"
        />

        <StatBar
          label="Tình cảm"
          value={game.stats.love}
          icon="💖"
        />
      </div>

      <div className="money-card">
        <span>💰 Tài sản tiền mặt</span>
        <strong>{money(game.stats.money)}</strong>

        <div className="mini-stats">
          <span>⚡ {Math.round(game.stats.skill)}</span>
          <span>⭐ {Math.round(game.stats.reputation)}</span>
          <span>🏆 {game.competition.self}</span>
        </div>
      </div>
    </section>
  );

  const Scene = () => (
    <section className="scene">
      <div className="scene-background">
        <div className="scene-cloud cloud1" />
        <div className="scene-cloud cloud2" />

        <div className="school">
          🏫
        </div>

        <div className="scene-title">
          {LOCATIONS[game.location]?.icon}{" "}
          {LOCATIONS[game.location]?.name}
        </div>

        <div className="character-main">
          🧑‍🎓
        </div>

        <div className="npc-row">
          {NPCS.map((npc) => (
            <button
              key={npc.id}
              className="npc-card"
              onClick={() => interactNPC(npc.id)}
            >
              <span className="npc-avatar">
                {npc.avatar}
              </span>

              <strong>{npc.name}</strong>

              <small>{npc.role}</small>

              <span className="npc-score">
                🏆{" "}
                {game.npc[npc.id]?.competition || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const Navigation = () => (
    <div className="navigation">
      {navigation.map(([id, icon, label]) => (
        <button
          key={id}
          className={
            game.location === id
              ? "nav-btn active"
              : "nav-btn"
          }
          onClick={() => goLocation(id)}
        >
          <span>{icon}</span>
          <small>{label}</small>
        </button>
      ))}
    </div>
  );

  const BottomControls = () => (
    <div className="controls">
      <div className="dpad">
        <button
          onClick={() =>
            setGame((prev) => ({
              ...prev,
              timeIndex: Math.max(
                0,
                prev.timeIndex - 1
              ),
            }))
          }
        >
          ◀
        </button>

        <button
          onClick={() =>
            setGame((prev) => ({
              ...prev,
              timeIndex: Math.min(
                TIMES.length - 1,
                prev.timeIndex + 1
              ),
            }))
          }
        >
          ▶
        </button>
      </div>

      <div className="control-main">
        <button
          className="rpg-btn"
          onClick={startQuiz}
        >
          📚 HỌC
        </button>

        <button
          className="rpg-btn"
          onClick={() => setDrawer("profile")}
        >
          👤 PROFILE
        </button>

        <button
          className="rpg-btn"
          onClick={() => setDrawer("bag")}
        >
          🎒 TÚI
        </button>

        <button
          className="rpg-btn"
          onClick={() => setDrawer("diary")}
        >
          📖 NHẬT KÝ
        </button>
      </div>

      <div className="ab-buttons">
        <button
          className="btn-a"
          onClick={startQuiz}
        >
          A
        </button>

        <button
          className="btn-b"
          onClick={restAtHome}
        >
          B
        </button>
      </div>
    </div>
  );

  /* =====================================================
     LOCATION PANEL
  ===================================================== */

  const LocationPanel = () => {
    if (game.location === "class") {
      return (
        <div className="panel">
          <div className="panel-title">
            🏫 LỚP HỌC
          </div>

          <p>
            Thời gian tự động chạy. Bạn có thể học để
            tăng điểm học tập và điểm thi đua.
          </p>

          <button
            className="primary"
            onClick={startQuiz}
          >
            📚 Bắt đầu tiết học
          </button>

          <div className="quick-row">
            <button
              onClick={() =>
                interactNPC("lan")
              }
            >
              👧 Nói chuyện Lan
            </button>

            <button
              onClick={() =>
                interactNPC("trieu_man")
              }
            >
              🌸 Nói chuyện Triệu Mẫn
            </button>

            <button
              onClick={() =>
                interactNPC("tuan")
              }
            >
              🧑‍🎓 Học cùng Tuấn
            </button>
          </div>
        </div>
      );
    }

    if (game.location === "canteen") {
      return (
        <div className="panel">
          <div className="panel-title">
            🍜 CĂN-TIN
          </div>

          <div className="shop-grid">
            {CANTEEN_ITEMS.map((item) => (
              <button
                className="shop-item"
                key={item.id}
                onClick={() => buyFood(item)}
              >
                <span className="shop-icon">
                  {item.icon}
                </span>

                <strong>{item.name}</strong>

                <small>
                  {money(item.price)}
                </small>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (game.location === "job") {
      return (
        <div className="panel">
          <div className="panel-title">
            💼 VIỆC LÀM
          </div>

          <div className="job-list">
            {JOBS.map((job) => {
              const available = job.req(game);

              return (
                <button
                  key={job.id}
                  className={
                    available
                      ? "job-item"
                      : "job-item locked"
                  }
                  onClick={() => doJob(job)}
                >
                  <span className="job-icon">
                    {job.icon}
                  </span>

                  <span className="job-info">
                    <strong>{job.name}</strong>
                    <small>{job.desc}</small>
                  </span>

                  <span className="job-pay">
                    +{money(job.pay)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (game.location === "cert") {
      return (
        <div className="panel">
          <div className="panel-title">
            📜 PHÒNG THI CHỨNG CHỈ
          </div>

          <div className="job-list">
            {Object.values(CERTS).map((cert) => {
              const owned =
                game.certificates.includes(cert.id);

              return (
                <button
                  key={cert.id}
                  className={
                    owned
                      ? "job-item owned"
                      : "job-item"
                  }
                  onClick={() =>
                    !owned && startExam(cert)
                  }
                >
                  <span className="job-icon">
                    {cert.icon}
                  </span>

                  <span className="job-info">
                    <strong>{cert.name}</strong>
                    <small>
                      Kỹ năng ≥ {cert.skill} · Phí{" "}
                      {money(cert.fee)}
                    </small>
                  </span>

                  <span>
                    {owned ? "✅" : "📝"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (game.location === "prop") {
      return (
        <div className="panel">
          <div className="panel-title">
            🏠 CỬA HÀNG TÀI SẢN
          </div>

          <div className="property-grid">
            {PROPERTIES.map((property) => {
              const owned =
                game.assets.includes(property.id);

              return (
                <button
                  key={property.id}
                  className={
                    owned
                      ? "property owned"
                      : "property"
                  }
                  onClick={() =>
                    !owned &&
                    buyProperty(property)
                  }
                >
                  <span className="property-icon">
                    {property.icon}
                  </span>

                  <strong>{property.name}</strong>

                  <small>{property.desc}</small>

                  <b>
                    {owned
                      ? "ĐÃ SỞ HỮU"
                      : money(property.price)}
                  </b>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (game.location === "home") {
      return (
        <div className="panel home-panel">
          <div className="panel-title">
            🏡 NHÀ
          </div>

          <div className="home-art">
            🛏️ 🌙 🪟
          </div>

          <p>
            Một chút nghỉ ngơi giúp bạn hồi phục
            năng lượng.
          </p>

          <button
            className="primary"
            onClick={restAtHome}
          >
            😴 Nghỉ ngơi +25 năng lượng
          </button>
        </div>
      );
    }

    return null;
  };

  /* =====================================================
     DRAWERS
  ===================================================== */

  const Drawer = () => {
    if (!drawer) return null;

    return (
      <div
        className="drawer-backdrop"
        onClick={() => setDrawer(null)}
      >
        <div
          className="drawer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-head">
            <strong>
              {drawer === "profile" &&
                "👤 Hồ sơ nhân vật"}

              {drawer === "bag" &&
                "🎒 Túi đồ"}

              {drawer === "diary" &&
                "📖 Nhật ký"}

              {drawer === "competition" &&
                "🏆 Bảng thi đua"}
            </strong>

            <button
              onClick={() => setDrawer(null)}
            >
              ✕
            </button>
          </div>

          {drawer === "profile" && (
            <div className="drawer-content">
              <div className="profile-avatar">
                🧑‍🎓
              </div>

              <h2>Học sinh Thanh Xuân</h2>

              <div className="profile-grid">
                <div>
                  <span>📚 Học tập</span>
                  <b>{Math.round(game.stats.study)}</b>
                </div>

                <div>
                  <span>⚡ Kỹ năng</span>
                  <b>{Math.round(game.stats.skill)}</b>
                </div>

                <div>
                  <span>🤝 Bạn bè</span>
                  <b>{Math.round(game.stats.friends)}</b>
                </div>

                <div>
                  <span>💖 Tình cảm</span>
                  <b>{Math.round(game.stats.love)}</b>
                </div>

                <div>
                  <span>⭐ Uy tín</span>
                  <b>
                    {Math.round(
                      game.stats.reputation
                    )}
                  </b>
                </div>

                <div>
                  <span>🏆 Thi đua</span>
                  <b>
                    {game.competition.self}
                  </b>
                </div>
              </div>

              <h3>🎖️ Danh hiệu</h3>

              <div className="title-list">
                {TITLES.map((title) => {
                  const unlocked =
                    game.titles.includes(title.id);

                  return (
                    <div
                      key={title.id}
                      className={
                        unlocked
                          ? "title-card"
                          : "title-card locked"
                      }
                    >
                      <span>
                        {unlocked
                          ? title.icon
                          : "🔒"}
                      </span>

                      <div>
                        <strong>
                          {title.name}
                        </strong>
                        <small>
                          {title.desc}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {drawer === "bag" && (
            <div className="drawer-content">
              {game.bag.length === 0 && (
                <p>Túi đồ đang trống.</p>
              )}

              {game.bag.map((item) => (
                <div
                  className="bag-item"
                  key={item.id}
                >
                  <span className="bag-icon">
                    {item.icon}
                  </span>

                  <div>
                    <strong>
                      {item.name} × {item.count}
                    </strong>

                    <small>
                      {item.desc}
                    </small>
                  </div>

                  <button
                    disabled={item.count <= 0}
                    onClick={() =>
                      useBagItem(item)
                    }
                  >
                    Dùng
                  </button>
                </div>
              ))}
            </div>
          )}

          {drawer === "diary" && (
            <div className="drawer-content">
              {game.diaryEntries.length === 0 && (
                <p>
                  Chưa có trang nhật ký nào.
                </p>
              )}

              {[...game.diaryEntries]
                .reverse()
                .map((entry) => (
                  <div
                    className="diary-entry"
                    key={entry.id}
                  >
                    <strong>
                      Ngày {entry.day}
                    </strong>

                    <p>{entry.text}</p>
                  </div>
                ))}
            </div>
          )}

          {drawer === "competition" && (
            <div className="drawer-content">
              <div className="competition-header">
                <div>
                  <small>Thứ hạng hiện tại</small>
                  <strong>
                    #{rankPosition}
                  </strong>
                </div>

                <div>
                  <small>Điểm của bạn</small>
                  <strong>
                    {game.competition.self}
                  </strong>
                </div>
              </div>

              <div className="ranking-list">
                {ranking.map((row, index) => (
                  <div
                    key={row.id}
                    className={
                      row.id === "self"
                        ? "rank-row me"
                        : "rank-row"
                    }
                  >
                    <span className="rank-number">
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : `#${index + 1}`}
                    </span>

                    <span className="rank-avatar">
                      {row.avatar}
                    </span>

                    <div className="rank-name">
                      <strong>{row.name}</strong>

                      {row.id === "self" && (
                        <small>Bạn</small>
                      )}
                    </div>

                    <b>
                      {row.score}
                    </b>
                  </div>
                ))}
              </div>

              <div className="npc-note">
                💡 NPC sẽ tự động tăng điểm thi đua
                mỗi ngày. Bạn cần học tập, làm việc,
                tương tác và hoàn thành nhiệm vụ để
                cạnh tranh.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* =====================================================
     OVERLAYS
  ===================================================== */

  const Overlay = () => {
    if (!overlay) return null;

    if (overlay === "quiz" && quiz) {
      const current =
        quiz.questions[quizIndex];

      return (
        <div className="overlay">
          <div className="modal">
            <div className="modal-head">
              <span>
                📚 CÂU HỎI {quizIndex + 1}/
                {quiz.questions.length}
              </span>

              <button
                onClick={() => {
                  setOverlay(null);
                  setQuiz(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="quiz-subject">
              {current.subject}
            </div>

            <h2>{current.q}</h2>

            <div className="choice-list">
              {current.choices.map(
                (choice, index) => (
                  <button
                    key={choice}
                    onClick={() =>
                      answerQuiz(index)
                    }
                  >
                    <span>
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    {choice}
                  </button>
                )
              )}
            </div>

            <div className="quiz-score">
              Điểm hiện tại: {quizScore}
            </div>
          </div>
        </div>
      );
    }

    if (overlay === "exam" && exam) {
      const current =
        exam.questions[examIndex];

      return (
        <div className="overlay">
          <div className="modal">
            <div className="modal-head">
              <span>
                {exam.icon} {exam.name}
              </span>

              <button
                onClick={() => {
                  setOverlay(null);
                  setExam(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="exam-progress">
              Câu {examIndex + 1}/
              {exam.questions.length}
            </div>

            <h2>{current.q}</h2>

            <div className="choice-list">
              {current.choices.map(
                (choice, index) => (
                  <button
                    key={choice}
                    onClick={() =>
                      answerExam(index)
                    }
                  >
                    <span>
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    {choice}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      );
    }

    if (overlay === "save") {
      return (
        <div className="overlay">
          <div className="modal save-modal">
            <div className="modal-head">
              <span>💾 SAVE GAME</span>

              <button
                onClick={() =>
                  setOverlay(null)
                }
              >
                ✕
              </button>
            </div>

            <h3>Tạo / khôi phục Save Code</h3>

            <textarea
              value={saveInput}
              onChange={(e) =>
                setSaveInput(e.target.value)
              }
              placeholder="Dán Save Code vào đây..."
            />

            <div className="save-buttons">
              <button
                className="primary"
                onClick={generateSaveCode}
              >
                🔄 Tạo mã mới
              </button>

              <button
                onClick={copySaveCode}
              >
                📋 Copy
              </button>

              <button
                onClick={importSaveCode}
              >
                📥 Khôi phục
              </button>

              <button
                onClick={exportFile}
              >
                📄 Xuất file
              </button>

              <button
                onClick={() =>
                  fileRef.current?.click()
                }
              >
                📂 Nhập file
              </button>

              <button
                onClick={restart}
              >
                🔄 Chơi lại
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={importFile}
            />

            <p className="save-help">
              💡 Bạn có thể copy Save Code sang máy
              khác rồi dán vào đây để tiếp tục chơi.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  /* =====================================================
     GAME OVER
  ===================================================== */

  if (game.isGameOver) {
    return (
      <>
        <div className="game-shell">
          <div className="ending">
            <div className="ending-icon">
              🎓
            </div>

            <h1>
              THANH XUÂN RỰC RỠ
            </h1>

            <h2>
              Bạn đã hoàn thành 45 ngày cấp 3!
            </h2>

            <p>
              Một hành trình với những bài học,
              người bạn, rung động và kỷ niệm.
            </p>

            <div className="ending-grid">
              <div>
                <b>{game.stats.study}</b>
                <span>Học tập</span>
              </div>

              <div>
                <b>{game.stats.skill}</b>
                <span>Kỹ năng</span>
              </div>

              <div>
                <b>{game.stats.friends}</b>
                <span>Bạn bè</span>
              </div>

              <div>
                <b>{game.stats.love}</b>
                <span>Tình cảm</span>
              </div>

              <div>
                <b>{game.competition.self}</b>
                <span>Thi đua</span>
              </div>

              <div>
                <b>{game.titles.length}</b>
                <span>Danh hiệu</span>
              </div>
            </div>

            <div className="ending-rank">
              🏆 Xếp hạng thi đua:{" "}
              <strong>
                #{rankPosition}
              </strong>
            </div>

            <div className="ending-actions">
              <button
                className="primary"
                onClick={generateSaveCode}
              >
                💾 Lưu kỷ niệm
              </button>

              <button
                onClick={restart}
              >
                🌱 Bắt đầu lại
              </button>
            </div>
          </div>
        </div>

        <Overlay />
        <Drawer />

        <style>{CSS}</style>
      </>
    );
  }

  /* =====================================================
     MAIN RENDER
  ===================================================== */

  return (
    <div className="game-shell">
      <Header />

      <HUD />

      <main className="main-content">
        <Scene />

        <Navigation />

        <LocationPanel />

        <BottomControls />
      </main>

      <footer className="footer">
        <span>
          🌸 Thanh Xuân Rực Rỡ
        </span>

        <span>
          Ngày {game.day}/45 ·{" "}
          {currentTime.label}
        </span>

        <span>
          🏆 #{rankPosition}
        </span>
      </footer>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      <Overlay />
      <Drawer />

      <style>{CSS}</style>
    </div>
  );
}

/* =========================================================
   DIARY
========================================================= */

function createDiaryText(game) {
  const study = game.stats.study;
  const love = game.stats.love;
  const friends = game.stats.friends;
  const moneyValue = game.stats.money;

  if (study >= 80) {
    return "Hôm nay mình đã cố gắng học tập rất nhiều. Có lẽ những nỗ lực nhỏ mỗi ngày rồi sẽ tạo nên một kết quả thật lớn.";
  }

  if (love >= 70) {
    return "Có những khoảnh khắc rất nhỏ nhưng khiến cả ngày trở nên đặc biệt. Thanh xuân hình như đang trở nên thú vị hơn.";
  }

  if (friends >= 70) {
    return "Hôm nay tụi mình lại có thêm một đống chuyện để cười. Có lẽ điều đáng nhớ nhất của cấp 3 chính là những người bạn.";
  }

  if (moneyValue >= 10000000) {
    return "Mình bắt đầu biết cách kiếm tiền và quản lý tài chính. Trưởng thành có lẽ là khi mình biết chịu trách nhiệm với lựa chọn của mình.";
  }

  return "Một ngày nữa của tuổi học trò khép lại. Có lúc vui, có lúc mệt, nhưng chắc chắn sau này mình sẽ nhớ những ngày bình thường như thế này.";
}

/* =========================================================
   CSS
========================================================= */

const CSS = `
* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
  width: 100%;
}

body {
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background:
    radial-gradient(circle at top, #e9d5ff 0%, #f8fafc 38%, #dbeafe 100%);
  color: #172033;
}

button,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.game-shell {
  width: min(1120px, calc(100vw - 24px));
  height: calc(100vh - 24px);
  min-height: 650px;
  max-height: 900px;
  margin: 12px auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255,255,255,.93);
  box-shadow:
    0 25px 80px rgba(15,23,42,.18),
    0 4px 18px rgba(15,23,42,.08);
  border: 1px solid rgba(255,255,255,.9);
}

.topbar {
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 18px;
  color: white;
  background:
    linear-gradient(135deg, #7c3aed, #ec4899);
}

.brand {
  font-size: 17px;
  font-weight: 900;
  letter-spacing: .4px;
}

.subtitle {
  font-size: 11px;
  opacity: .86;
  margin-top: 2px;
}

.top-actions {
  display: flex;
  gap: 7px;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 11px;
  color: white;
  background: rgba(255,255,255,.18);
  transition: .15s;
}

.icon-btn:hover {
  background: rgba(255,255,255,.3);
  transform: translateY(-1px);
}

.hud {
  display: grid;
  grid-template-columns: 145px 1fr 175px;
  gap: 10px;
  padding: 10px 14px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.day-card,
.money-card {
  border-radius: 15px;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(15,23,42,.04);
}

.day-big {
  font-size: 14px;
  font-weight: 900;
  color: #7c3aed;
}

.time-big {
  font-size: 25px;
  line-height: 1;
  margin-top: 4px;
  font-weight: 900;
}

.time-name {
  font-size: 10px;
  color: #64748b;
  margin-top: 3px;
}

.progress {
  height: 5px;
  margin: 9px 0 5px;
  overflow: hidden;
  border-radius: 999px;
  background: #e2e8f0;
}

.progress > div {
  height: 100%;
  background: linear-gradient(90deg,#8b5cf6,#ec4899);
  transition: width .5s ease;
}

.day-card small {
  color: #94a3b8;
  font-size: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.stat {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  padding: 6px 8px;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: #475569;
  margin-bottom: 5px;
}

.stat-top b {
  color: #111827;
}

.bar {
  height: 5px;
  overflow: hidden;
  background: #e2e8f0;
  border-radius: 999px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg,#8b5cf6,#ec4899);
  border-radius: inherit;
  transition: width .3s ease;
}

.money-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.money-card > span {
  font-size: 10px;
  color: #64748b;
}

.money-card > strong {
  font-size: 17px;
  color: #059669;
  margin-top: 4px;
}

.mini-stats {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 7px;
}

.mini-stats span {
  font-size: 9px;
  padding: 3px 6px;
  border-radius: 999px;
  background: #f1f5f9;
}

.main-content {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 290px;
  grid-template-rows: minmax(180px, 1fr) auto;
  gap: 9px;
  padding: 9px;
  overflow: hidden;
}

.scene {
  min-height: 0;
  overflow: hidden;
  border-radius: 17px;
  background:
    linear-gradient(
      180deg,
      #bfdbfe 0%,
      #dbeafe 55%,
      #bbf7d0 55%,
      #86efac 100%
    );
  border: 1px solid #bfdbfe;
}

.scene-background {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.scene-cloud {
  position: absolute;
  width: 90px;
  height: 26px;
  border-radius: 50px;
  background: rgba(255,255,255,.7);
}

.cloud1 {
  top: 25px;
  left: 50px;
}

.cloud2 {
  top: 60px;
  right: 70px;
  width: 110px;
}

.school {
  position: absolute;
  top: 42px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 68px;
  filter: drop-shadow(0 7px 3px rgba(15,23,42,.15));
}

.scene-title {
  position: absolute;
  left: 14px;
  top: 12px;
  padding: 6px 9px;
  border-radius: 9px;
  background: rgba(255,255,255,.8);
  backdrop-filter: blur(5px);
  font-size: 11px;
  font-weight: 900;
}

.character-main {
  position: absolute;
  bottom: 62px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 50px;
  filter: drop-shadow(0 7px 3px rgba(15,23,42,.2));
}

.npc-row {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 7px;
}

.npc-card {
  min-width: 0;
  display: grid;
  grid-template-columns: 30px 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 0 6px;
  text-align: left;
  padding: 6px;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 11px;
  background: rgba(255,255,255,.88);
  color: #172033;
}

.npc-card:hover {
  transform: translateY(-2px);
}

.npc-avatar {
  grid-row: span 2;
  font-size: 25px;
  text-align: center;
}

.npc-card strong {
  font-size: 10px;
}

.npc-card small {
  font-size: 8px;
  color: #64748b;
}

.npc-score {
  position: absolute;
  opacity: 0;
}

.navigation {
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 6px;
}

.nav-btn {
  min-height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: .15s;
}

.nav-btn:hover,
.nav-btn.active {
  background: #f3e8ff;
  border-color: #c084fc;
  color: #7c3aed;
}

.nav-btn span {
  font-size: 16px;
}

.nav-btn small {
  font-size: 10px;
  font-weight: 800;
}

.panel {
  grid-column: 1 / 3;
  min-height: 0;
  max-height: 205px;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: white;
  padding: 9px;
}

.panel-title {
  font-weight: 900;
  font-size: 13px;
  margin-bottom: 5px;
}

.panel p {
  font-size: 10px;
  color: #64748b;
  margin: 4px 0 8px;
}

.primary {
  border: 0;
  border-radius: 9px;
  padding: 8px 12px;
  background: linear-gradient(135deg,#7c3aed,#ec4899);
  color: white;
  font-weight: 800;
  box-shadow: 0 5px 12px rgba(124,58,237,.2);
}

.primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.quick-row {
  display: flex;
  gap: 6px;
  margin-top: 7px;
  flex-wrap: wrap;
}

.quick-row button,
.save-buttons button {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 9px;
  background: #f8fafc;
  font-size: 10px;
  font-weight: 700;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  gap: 6px;
}

.shop-item {
  min-width: 0;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  padding: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.shop-item:hover {
  border-color: #c084fc;
  background: #faf5ff;
}

.shop-icon {
  font-size: 23px;
}

.shop-item strong {
  font-size: 9px;
}

.shop-item small {
  font-size: 8px;
  color: #059669;
}

.job-list {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 6px;
}

.job-item {
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #f8fafc;
  padding: 7px;
  display: flex;
  align-items: center;
  gap: 7px;
  text-align: left;
}

.job-item:hover {
  background: #faf5ff;
  border-color: #c084fc;
}

.job-item.locked {
  opacity: .5;
}

.job-item.owned {
  background: #ecfdf5;
  border-color: #86efac;
}

.job-icon {
  font-size: 24px;
}

.job-info {
  flex: 1;
  min-width: 0;
}

.job-info strong {
  display: block;
  font-size: 10px;
}

.job-info small {
  display: block;
  font-size: 8px;
  color: #64748b;
}

.job-pay {
  font-size: 9px;
  color: #059669;
  font-weight: 900;
  white-space: nowrap;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  gap: 6px;
}

.property {
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #f8fafc;
  padding: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
}

.property:hover {
  background: #faf5ff;
  border-color: #c084fc;
}

.property.owned {
  background: #ecfdf5;
  border-color: #86efac;
}

.property-icon {
  font-size: 25px;
}

.property strong {
  font-size: 9px;
}

.property small {
  font-size: 7px;
  color: #64748b;
}

.property b {
  font-size: 8px;
  color: #059669;
}

.home-panel {
  text-align: center;
}

.home-art {
  font-size: 35px;
  margin: 5px;
}

.controls {
  grid-column: 1 / 3;
  display: grid;
  grid-template-columns: 95px 1fr 95px;
  gap: 8px;
  align-items: center;
}

.dpad {
  display: flex;
  gap: 5px;
}

.dpad button {
  width: 42px;
  height: 34px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: #f8fafc;
  font-weight: 900;
}

.control-main {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.rpg-btn {
  border: 1px solid #ddd6fe;
  background: #f5f3ff;
  color: #6d28d9;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 9px;
  font-weight: 900;
}

.rpg-btn:hover {
  background: #ede9fe;
}

.ab-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.ab-buttons button {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  color: white;
  font-size: 15px;
  font-weight: 900;
  box-shadow: 0 4px 9px rgba(15,23,42,.18);
}

.btn-a {
  background: #ec4899;
}

.btn-b {
  background: #7c3aed;
}

.footer {
  min-height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 13px;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 9px;
  background: #f8fafc;
}

.toast {
  position: fixed;
  z-index: 1000;
  left: 50%;
  bottom: 25px;
  transform: translateX(-50%);
  max-width: min(500px, calc(100vw - 30px));
  padding: 10px 15px;
  border-radius: 12px;
  color: white;
  background: rgba(15,23,42,.94);
  box-shadow: 0 10px 30px rgba(15,23,42,.25);
  font-size: 12px;
  font-weight: 800;
  text-align: center;
}

.overlay,
.drawer-backdrop {
  position: fixed;
  z-index: 900;
  inset: 0;
  background: rgba(15,23,42,.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.modal {
  width: min(500px, 100%);
  max-height: 85vh;
  overflow: auto;
  border-radius: 18px;
  background: white;
  padding: 15px;
  box-shadow: 0 25px 70px rgba(15,23,42,.3);
}

.modal-head,
.drawer-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.modal-head strong,
.modal-head span {
  font-size: 13px;
  font-weight: 900;
}

.modal-head button,
.drawer-head button {
  border: 0;
  background: #f1f5f9;
  width: 30px;
  height: 30px;
  border-radius: 8px;
}

.quiz-subject {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f3e8ff;
  color: #7c3aed;
  font-size: 9px;
  font-weight: 900;
}

.modal h2 {
  font-size: 18px;
  line-height: 1.4;
}

.choice-list {
  display: grid;
  gap: 7px;
}

.choice-list button {
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  background: #f8fafc;
  font-size: 12px;
}

.choice-list button:hover {
  background: #faf5ff;
  border-color: #c084fc;
}

.choice-list button span {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: #ede9fe;
  color: #7c3aed;
  font-weight: 900;
}

.quiz-score,
.exam-progress {
  margin-top: 10px;
  font-size: 10px;
  color: #64748b;
}

.save-modal textarea {
  width: 100%;
  min-height: 130px;
  resize: vertical;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 9px;
  outline: none;
  font-size: 10px;
}

.save-modal textarea:focus {
  border-color: #8b5cf6;
}

.save-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.save-help {
  font-size: 9px;
  color: #64748b;
}

.drawer-backdrop {
  justify-content: flex-end;
  align-items: stretch;
  padding: 0;
}

.drawer {
  width: min(390px, 92vw);
  height: 100%;
  overflow: auto;
  background: white;
  box-shadow: -15px 0 50px rgba(15,23,42,.2);
}

.drawer-head {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 14px;
  margin: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.drawer-content {
  padding: 13px;
}

.profile-avatar {
  font-size: 55px;
  text-align: center;
}

.drawer-content h2 {
  text-align: center;
  font-size: 17px;
}

.drawer-content h3 {
  font-size: 12px;
  margin-top: 18px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 7px;
}

.profile-grid div {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-radius: 9px;
  background: #f8fafc;
  font-size: 10px;
}

.title-list {
  display: grid;
  gap: 6px;
}

.title-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 10px;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.title-card.locked {
  filter: grayscale(1);
  opacity: .45;
  background: #f8fafc;
  border-color: #e2e8f0;
}

.title-card > span {
  font-size: 25px;
}

.title-card strong {
  display: block;
  font-size: 10px;
}

.title-card small {
  display: block;
  font-size: 8px;
  color: #64748b;
}

.bag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px;
  margin-bottom: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.bag-icon {
  font-size: 28px;
}

.bag-item div {
  flex: 1;
}

.bag-item strong,
.bag-item small {
  display: block;
}

.bag-item strong {
  font-size: 10px;
}

.bag-item small {
  font-size: 8px;
  color: #64748b;
}

.bag-item button {
  border: 0;
  border-radius: 7px;
  padding: 6px 8px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 9px;
  font-weight: 800;
}

.bag-item button:disabled {
  opacity: .4;
}

.diary-entry {
  padding: 10px;
  margin-bottom: 7px;
  border-left: 3px solid #a78bfa;
  background: #faf5ff;
  border-radius: 0 9px 9px 0;
}

.diary-entry strong {
  font-size: 10px;
  color: #7c3aed;
}

.diary-entry p {
  font-size: 10px;
  line-height: 1.5;
  color: #475569;
}

.competition-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  margin-bottom: 10px;
}

.competition-header div {
  padding: 10px;
  border-radius: 10px;
  background: #f8fafc;
  text-align: center;
}

.competition-header small,
.competition-header strong {
  display: block;
}

.competition-header small {
  color: #64748b;
  font-size: 8px;
}

.competition-header strong {
  font-size: 22px;
  color: #7c3aed;
}

.ranking-list {
  display: grid;
  gap: 6px;
}

.rank-row {
  display: grid;
  grid-template-columns: 28px 35px 1fr auto;
  align-items: center;
  gap: 6px;
  padding: 9px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.rank-row.me {
  background: #faf5ff;
  border-color: #c084fc;
}

.rank-number {
  text-align: center;
  font-weight: 900;
}

.rank-avatar {
  font-size: 24px;
  text-align: center;
}

.rank-name strong,
.rank-name small {
  display: block;
}

.rank-name strong {
  font-size: 10px;
}

.rank-name small {
  font-size: 8px;
  color: #7c3aed;
}

.rank-row > b {
  font-size: 12px;
}

.npc-note {
  margin-top: 10px;
  padding: 9px;
  border-radius: 9px;
  background: #eff6ff;
  color: #475569;
  font-size: 9px;
  line-height: 1.5;
}

.ending {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  background:
    radial-gradient(circle at top,#f5d0fe,#ffffff 55%);
}

.ending-icon {
  font-size: 70px;
}

.ending h1 {
  margin: 8px 0 4px;
  color: #7c3aed;
  font-size: 28px;
}

.ending h2 {
  margin: 0;
  font-size: 17px;
}

.ending p {
  max-width: 520px;
  color: #64748b;
  font-size: 12px;
}

.ending-grid {
  width: min(600px,100%);
  display: grid;
  grid-template-columns: repeat(6,1fr);
  gap: 7px;
  margin: 15px 0;
}

.ending-grid div {
  padding: 9px 4px;
  border-radius: 10px;
  background: rgba(255,255,255,.9);
  border: 1px solid #e2e8f0;
}

.ending-grid b,
.ending-grid span {
  display: block;
}

.ending-grid b {
  font-size: 15px;
  color: #7c3aed;
}

.ending-grid span {
  margin-top: 3px;
  font-size: 8px;
  color: #64748b;
}

.ending-rank {
  padding: 9px 14px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 11px;
  font-weight: 800;
}

.ending-actions {
  display: flex;
  gap: 7px;
  margin-top: 14px;
}

.ending-actions button:not(.primary) {
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  padding: 8px 12px;
  background: white;
  font-weight: 800;
}

/* TABLET / MOBILE */
@media (max-width: 900px) {
  .game-shell {
    width: 100%;
    height: 100vh;
    min-height: 620px;
    max-height: none;
    margin: 0;
    border-radius: 0;
  }

  .hud {
    grid-template-columns: 125px 1fr;
  }

  .money-card {
    display: none;
  }

  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: 210px auto minmax(120px,1fr) auto;
  }

  .navigation {
    grid-row: 2;
    grid-template-columns: repeat(6,1fr);
  }

  .panel {
    grid-row: 3;
    grid-column: 1;
  }

  .controls {
    grid-row: 4;
    grid-column: 1;
  }
}

@media (max-width: 650px) {
  .game-shell {
    min-height: 100vh;
  }

  .topbar {
    min-height: 54px;
    padding: 8px 10px;
  }

  .brand {
    font-size: 13px;
  }

  .subtitle {
    font-size: 9px;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
  }

  .hud {
    padding: 7px;
    gap: 6px;
  }

  .stats-grid {
    gap: 4px;
  }

  .stat {
    padding: 5px;
  }

  .stat-top {
    font-size: 8px;
  }

  .day-big {
    font-size: 11px;
  }

  .time-big {
    font-size: 20px;
  }

  .main-content {
    padding: 6px;
    gap: 6px;
    grid-template-rows: 180px auto minmax(120px,1fr) auto;
  }

  .navigation {
    gap: 4px;
  }

  .nav-btn {
    min-height: 35px;
    padding: 3px;
  }

  .nav-btn span {
    font-size: 13px;
  }

  .nav-btn small {
    font-size: 8px;
  }

  .npc-card {
    padding: 4px;
  }

  .npc-avatar {
    font-size: 20px;
  }

  .npc-card strong {
    font-size: 8px;
  }

  .npc-card small {
    display: none;
  }

  .panel {
    padding: 7px;
  }

  .shop-grid,
  .property-grid {
    grid-template-columns: repeat(3,1fr);
  }

  .job-list {
    grid-template-columns: 1fr;
  }

  .controls {
    grid-template-columns: 70px 1fr 70px;
  }

  .control-main {
    gap: 3px;
  }

  .rpg-btn {
    padding: 6px;
    font-size: 7px;
  }

  .dpad button {
    width: 30px;
    height: 30px;
  }

  .ab-buttons button {
    width: 34px;
    height: 34px;
  }

  .footer {
    display: none;
  }

  .ending-grid {
    grid-template-columns: repeat(3,1fr);
  }
}
`;
