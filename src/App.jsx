import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   THANH XUÂN RỰC RỠ
   Deluxe Career & Assets Edition
   React/Vite version
   ========================================================= */

const SAVE_KEY = "thanh_xuan_jrpg_save_v2";

const TIME_PERIODS = [
  { text: "07:30", name: "Buổi sáng • Tiết 1-2" },
  { text: "09:15", name: "Giờ ra chơi" },
  { text: "11:30", name: "Tan trường trưa" },
  { text: "14:00", name: "Buổi chiều • Hoạt động" },
  { text: "17:00", name: "Chiều muộn • Đi làm" },
  { text: "20:30", name: "Buổi tối • Góc cá nhân" },
];

const DAYS_OF_WEEK = [
  "THỨ HAI",
  "THỨ BA",
  "THỨ TƯ",
  "THỨ NĂM",
  "THỨ SÁU",
  "THỨ BẢY",
  "CHỦ NHẬT",
];

const LOCATIONS = [
  { id: "class", icon: "🏫", name: "Lớp Học" },
  { id: "canteen", icon: "🍜", name: "Căn Tin" },
  { id: "job", icon: "💼", name: "Làm Thêm" },
  { id: "cert", icon: "📜", name: "Chứng Chỉ" },
  { id: "prop", icon: "🏎️", name: "Nhà & Xe" },
  { id: "home", icon: "🏠", name: "Về Nhà" },
];

const CERTIFICATES = [
  {
    id: "cert_driver",
    name: "GPLX Ô Tô Hạng B2",
    icon: "🚗",
    fee: 120000,
    reqSkill: 20,
    desc: "Mở khóa việc lái xe VIP và mua ô tô.",
    questions: [
      {
        q: "Khi gặp đèn vàng, người điều khiển ô tô phải làm gì?",
        opts: [
          "Dừng trước vạch dừng, trừ khi đã đi quá vạch",
          "Tăng tốc vượt giao lộ",
          "Bấm còi rồi rẽ phải",
          "Tắt máy dắt bộ",
        ],
        c: 0,
      },
      {
        q: "Khi lái ô tô, sử dụng rượu bia rồi điều khiển phương tiện là hành vi:",
        opts: [
          "Bị nghiêm cấm",
          "Được phép nếu uống ít",
          "Chỉ bị phạt khi gây tai nạn",
          "Chỉ bị nhắc nhở",
        ],
        c: 0,
      },
      {
        q: "Bộ phận nào giúp người lái kiểm soát hướng chuyển động của ô tô?",
        opts: ["Vô lăng", "Còi", "Gương chiếu hậu", "Đèn hậu"],
        c: 0,
      },
    ],
  },
  {
    id: "cert_toeic",
    name: "TOEIC 650+",
    icon: "🇬🇧",
    fee: 150000,
    reqSkill: 35,
    desc: "Chứng chỉ tiếng Anh mở khóa nghề song ngữ.",
    questions: [
      {
        q: 'Complete: "The director suggested that we _____ the meeting."',
        opts: ["postpone", "postpones", "postponing", "postponed"],
        c: 0,
      },
      {
        q: 'Closest meaning to "SUBSTANTIAL":',
        opts: ["Significant", "Minor", "Tiny", "Doubtful"],
        c: 0,
      },
      {
        q: "The report must be submitted _____ Friday.",
        opts: ["by", "with", "during", "from"],
        c: 0,
      },
    ],
  },
  {
    id: "cert_mos",
    name: "MOS Excel",
    icon: "📊",
    fee: 80000,
    reqSkill: 15,
    desc: "Mở khóa công việc Excel và nhập liệu doanh nghiệp.",
    questions: [
      {
        q: "Hàm nào thường dùng để tìm kiếm dữ liệu theo cột?",
        opts: ["VLOOKUP / XLOOKUP", "COUNTIF", "AVERAGE", "SUM"],
        c: 0,
      },
      {
        q: "Cách cố định tuyệt đối ô B5 trong Excel là:",
        opts: ["$B$5", "B5", "#B#5", "&B&5"],
        c: 0,
      },
      {
        q: "Công cụ nào dùng để tổng hợp dữ liệu nhiều chiều?",
        opts: ["PivotTable", "WordArt", "Data Validation", "Format Painter"],
        c: 0,
      },
    ],
  },
  {
    id: "cert_finance",
    name: "Chứng Chỉ Tài Chính & Chứng Khoán",
    icon: "📈",
    fee: 250000,
    reqSkill: 40,
    desc: "Mở khóa nghề môi giới và phân tích tài chính trong game.",
    questions: [
      {
        q: "P/E phản ánh điều gì?",
        opts: [
          "Mức giá thị trường nhà đầu tư trả cho một đồng lợi nhuận",
          "Tổng số nợ ngân hàng",
          "Khối lượng giao dịch",
          "Tỷ lệ cổ tức",
        ],
        c: 0,
      },
      {
        q: "Margin Call thường xảy ra khi:",
        opts: [
          "Tỷ lệ ký quỹ giảm dưới ngưỡng an toàn",
          "Cổ phiếu tăng trần",
          "Doanh nghiệp chia cổ tức",
          "Nhà đầu tư nộp thêm tiền",
        ],
        c: 0,
      },
      {
        q: "MA 50 thường được sử dụng để quan sát:",
        opts: ["Xu hướng trung hạn", "Thanh khoản", "EPS", "Cổ tức"],
        c: 0,
      },
    ],
  },
];

const PROPERTIES = [
  {
    id: "asset_bike",
    name: "Xe Tay Ga Air Blade 160cc",
    type: "vehicle",
    price: 450000,
    icon: "🛵",
    desc: "Đi học chủ động hơn.",
    buff: "+10 Năng lượng khi về nhà.",
    license: null,
  },
  {
    id: "asset_car_sedan",
    name: "Ô Tô Sedan Mazda 3",
    type: "vehicle",
    price: 1800000,
    icon: "🚗",
    desc: "Xe che mưa che nắng.",
    buff: "+25 Tình cảm & +10 Danh tiếng.",
    license: "cert_driver",
  },
  {
    id: "asset_car_super",
    name: "Porsche 911 Targa",
    type: "vehicle",
    price: 6500000,
    icon: "🏎️",
    desc: "Siêu xe thể thao.",
    buff: "+50 Danh tiếng & +30 Tâm trạng.",
    license: "cert_driver",
  },
  {
    id: "asset_condo",
    name: "Căn Hộ Studio View Thành Phố",
    type: "house",
    price: 3200000,
    icon: "🏙️",
    desc: "Không gian học tập riêng.",
    buff: "+15 Học tập & hồi năng lượng.",
    license: null,
  },
  {
    id: "asset_villa",
    name: "Biệt Thự Vườn Thảo Điền",
    type: "house",
    price: 12000000,
    icon: "🏰",
    desc: "Biệt thự sang trọng.",
    buff: "Danh hiệu tài phú cuối game.",
    license: null,
  },
];

const JOBS = [
  {
    id: "job_canteen",
    name: "Phụ việc Căn tin Cô Năm",
    icon: "🍜",
    salary: 25000,
    energy: 25,
    hp: 5,
    skill: 4,
    condition: () => true,
    requirement: "Dành cho mọi học sinh",
    diary: "Phụ cô Năm bán bánh tráng và dọn bàn. Mệt nhưng vui vì có thêm tiền.",
  },
  {
    id: "job_flyer",
    name: "Phát tờ rơi & Pha chế trà sữa",
    icon: "🧋",
    salary: 35000,
    energy: 30,
    hp: 6,
    skill: 5,
    condition: (s) => s.stats.energy >= 30,
    requirement: "Cần đủ năng lượng",
    diary: "Làm việc tại quán trà sữa, tay chân thoăn thoắt nhận tiền công.",
  },
  {
    id: "job_office_excel",
    name: "Xử lý bảng tính & nhập liệu",
    icon: "📊",
    salary: 95000,
    energy: 20,
    hp: 0,
    skill: 8,
    condition: (s) => s.certificates.includes("cert_mos"),
    requirement: "Cần chứng chỉ MOS",
    diary: "Ứng dụng Excel và PivotTable xử lý dữ liệu doanh nghiệp.",
  },
  {
    id: "job_driver_vip",
    name: "Tài xế Công nghệ & VIP",
    icon: "🚘",
    salary: 180000,
    energy: 25,
    hp: 2,
    skill: 10,
    condition: (s) =>
      s.certificates.includes("cert_driver") &&
      (s.assets.includes("asset_car_sedan") ||
        s.assets.includes("asset_car_super")),
    requirement: "Cần B2 + ô tô",
    diary: "Lái xe VIP và tranh thủ đưa Mẫn đi dạo.",
  },
  {
    id: "job_interpreter",
    name: "Trợ lý Song ngữ",
    icon: "🎙️",
    salary: 220000,
    energy: 22,
    hp: 0,
    skill: 12,
    condition: (s) => s.certificates.includes("cert_toeic"),
    requirement: "Cần TOEIC 650+",
    diary: "Tự tin giao tiếp tại một hội thảo quốc tế.",
  },
  {
    id: "job_broker",
    name: "Môi giới & Phân tích Chứng khoán",
    icon: "📈",
    salary: 450000,
    energy: 28,
    hp: 3,
    skill: 16,
    condition: (s) => s.certificates.includes("cert_finance"),
    requirement: "Cần chứng chỉ tài chính",
    diary: "Phân tích thị trường và hoàn thành một ngày làm việc hiệu quả.",
  },
];

const CANTEEN = [
  {
    id: "f1",
    name: "Bánh tráng trộn bò khô",
    price: 15000,
    energy: 25,
    mood: 15,
    love: 0,
    icon: "🥣",
  },
  {
    id: "f2",
    name: "Milo dầm trân châu",
    price: 20000,
    energy: 30,
    mood: 20,
    love: 0,
    icon: "🍫",
  },
  {
    id: "f3",
    name: "Trà sữa Full Topping cho Mẫn",
    price: 45000,
    energy: 20,
    mood: 30,
    love: 12,
    icon: "💖",
  },
];

const TEACHERS = {
  toan: { name: "Thầy Minh", avatar: "👨‍🏫", subject: "TOÁN HỌC" },
  anh: { name: "Cô Jennifer", avatar: "👱‍♀️", subject: "TIẾNG ANH" },
  ly: { name: "Thầy Tuấn", avatar: "👨‍🔬", subject: "VẬT LÝ" },
  hoa: { name: "Cô Hương", avatar: "👩‍🔬", subject: "HÓA HỌC" },
  sinh: { name: "Cô Mai", avatar: "👩‍🔬", subject: "SINH HỌC" },
  su: { name: "Thầy Sơn", avatar: "👨‍🏫", subject: "LỊCH SỬ" },
  dia: { name: "Cô Lan", avatar: "👩‍🏫", subject: "ĐỊA LÝ" },
  gdcd: { name: "Thầy Nam", avatar: "👨‍🏫", subject: "GDCD" },
};

const QUIZ_BANK = [
  {
    id: "m1",
    sub: "toan",
    q: "Đạo hàm của y = e^(2x) là gì?",
    opts: ["2e^(2x)", "e^(2x)", "2xe^(2x)", "e^(2x)/2"],
    c: 0,
  },
  {
    id: "m2",
    sub: "toan",
    q: "Cấp số cộng có u₁ = 3, d = 4. u₅ bằng?",
    opts: ["19", "15", "23", "20"],
    c: 0,
  },
  {
    id: "ta1",
    sub: "anh",
    q: "If she _____ harder, she would pass the exam.",
    opts: ["studied", "studies", "study", "had studied"],
    c: 0,
  },
  {
    id: "l1",
    sub: "ly",
    q: "Đơn vị đo công suất trong hệ SI là?",
    opts: ["Watt", "Joule", "Volt", "Ampe"],
    c: 0,
  },
  {
    id: "h1",
    sub: "hoa",
    q: "Chất nào sau đây là axit mạnh?",
    opts: ["HCl", "CH₃COOH", "H₂CO₃", "H₂O"],
    c: 0,
  },
  {
    id: "h2",
    sub: "hoa",
    q: "Công thức của glucose là:",
    opts: ["C₆H₁₂O₆", "C₂H₅OH", "CH₄", "C₁₂H₂₂O₁₁"],
    c: 0,
  },
  {
    id: "s1",
    sub: "sinh",
    q: "Đơn vị cơ bản của sự sống là:",
    opts: ["Tế bào", "Mô", "Cơ quan", "DNA"],
    c: 0,
  },
  {
    id: "s2",
    sub: "sinh",
    q: "Quá trình quang hợp chủ yếu diễn ra ở:",
    opts: ["Lục lạp", "Ti thể", "Ribosome", "Nhân"],
    c: 0,
  },
  {
    id: "su1",
    sub: "su",
    q: "Ngày Quốc khánh Việt Nam là:",
    opts: ["2/9", "30/4", "19/8", "7/5"],
    c: 0,
  },
  {
    id: "su2",
    sub: "su",
    q: "Chiến thắng Điện Biên Phủ diễn ra năm:",
    opts: ["1954", "1945", "1968", "1975"],
    c: 0,
  },
  {
    id: "dia1",
    sub: "dia",
    q: "Việt Nam nằm trong khu vực khí hậu:",
    opts: ["Nhiệt đới gió mùa", "Ôn đới", "Hàn đới", "Hoang mạc"],
    c: 0,
  },
  {
    id: "dia2",
    sub: "dia",
    q: "Đồng bằng lớn nhất Việt Nam là:",
    opts: [
      "Đồng bằng sông Cửu Long",
      "Đồng bằng sông Hồng",
      "Đồng bằng Thanh Hóa",
      "Đồng bằng Nghệ An",
    ],
    c: 0,
  },
  {
    id: "gdcd1",
    sub: "gdcd",
    q: "Pháp luật có đặc điểm cơ bản nào?",
    opts: [
      "Tính bắt buộc chung",
      "Chỉ áp dụng cho học sinh",
      "Không có chế tài",
      "Chỉ mang tính khuyên nhủ",
    ],
    c: 0,
  },
  {
    id: "gdcd2",
    sub: "gdcd",
    q: "Công dân bình đẳng trước pháp luật nghĩa là:",
    opts: [
      "Mọi người đều được đối xử theo quy định pháp luật",
      "Mọi người có cùng thu nhập",
      "Mọi người có cùng nghề",
      "Mọi người có cùng tài sản",
    ],
    c: 0,
  },
];

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
        desc: "+8 Điểm học tập",
      },
      {
        id: "gift_strawberry",
        name: "Kẹo Dâu Tây",
        icon: "🍬",
        count: 2,
        desc: "+8% Tình cảm",
      },
    ],
    todayEvents: [],
    diaryEntries: [],
  };
}

function normalizeState(raw) {
  const base = createInitialState();

  if (!raw || typeof raw !== "object") return base;

  return {
    ...base,
    ...raw,
    stats: {
      ...base.stats,
      ...(raw.stats || {}),
    },
    certificates: Array.isArray(raw.certificates)
      ? raw.certificates
      : base.certificates,
    assets: Array.isArray(raw.assets) ? raw.assets : base.assets,
    bag: Array.isArray(raw.bag) ? raw.bag : base.bag,
    todayEvents: Array.isArray(raw.todayEvents) ? raw.todayEvents : [],
    diaryEntries: Array.isArray(raw.diaryEntries) ? raw.diaryEntries : [],
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

/* =========================================================
   AUDIO
   ========================================================= */

class RetroAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.enabled) return false;

    try {
      if (!this.ctx) {
        const AudioContext =
          window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) return false;

        this.ctx = new AudioContext();
      }

      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      return true;
    } catch {
      return false;
    }
  }

  playTone(freq, type = "square", duration = 0.12, volume = 0.08) {
    if (!this.enabled || !this.init()) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  success() {
    [523, 659, 784].forEach((f, i) => {
      setTimeout(
        () => this.playTone(f, "triangle", 0.16, 0.08),
        i * 70
      );
    });
  }

  wrong() {
    [260, 190].forEach((f, i) => {
      setTimeout(
        () => this.playTone(f, "sawtooth", 0.18, 0.07),
        i * 90
      );
    });
  }

  bell() {
    [440, 554, 659, 880].forEach((f, i) => {
      setTimeout(
        () => this.playTone(f, "sine", 0.25, 0.06),
        i * 110
      );
    });
  }
}

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const loadedRef = useRef(false);
  const previousDayRef = useRef(1);

  const [state, setState] = useState(createInitialState);
  const [view, setView] = useState("class");
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [quiz, setQuiz] = useState(null);

  const [certExam, setCertExam] = useState(null);

  const [saveModal, setSaveModal] = useState(null);
  const [saveCode, setSaveCode] = useState("");

  const [dialogue, setDialogue] = useState(null);

  const [manualDiary, setManualDiary] = useState(false);
  const [showEnding, setShowEnding] = useState(false);

  const [pendingDiary, setPendingDiary] = useState(null);

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */

  useEffect(() => {
    audioRef.current = new RetroAudio();

    try {
      const raw = localStorage.getItem(SAVE_KEY);

      if (raw) {
        const loaded = normalizeState(JSON.parse(raw));

        setState(loaded);
        setView(loaded.location || "class");
        previousDayRef.current = loaded.day;
      }
    } catch {
      // Nếu save hỏng thì bắt đầu game mới.
    }

    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /* -------------------------------------------------------
     AUDIO
     ------------------------------------------------------- */

  function playSuccess() {
    audioRef.current?.success();
  }

  function playWrong() {
    audioRef.current?.wrong();
  }

  function toggleAudio() {
    const next = !audioEnabled;

    setAudioEnabled(next);

    if (audioRef.current) {
      audioRef.current.enabled = next;
    }

    if (next) {
      audioRef.current?.playTone(660);
    }
  }

  /* -------------------------------------------------------
     TOAST
     ------------------------------------------------------- */

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  /* -------------------------------------------------------
     STATE
     ------------------------------------------------------- */

  function updateStats(changes) {
    setState((prev) => {
      const stats = { ...prev.stats };

      Object.entries(changes).forEach(([key, amount]) => {
        const current = Number(stats[key] || 0);
        let next = current + Number(amount);

        if (
          ["hp", "energy", "mood", "friends", "love", "reputation", "skill"].includes(
            key
          )
        ) {
          next = clamp(next, 0, 100);
        }

        if (key === "study") {
          next = Math.max(0, next);
        }

        if (key === "money") {
          next = Math.max(0, next);
        }

        stats[key] = next;
      });

      return {
        ...prev,
        stats,
      };
    });
  }

  function addEvent(text) {
    setState((prev) => ({
      ...prev,
      todayEvents: [...prev.todayEvents, text],
    }));
  }

  /* -------------------------------------------------------
     LOCATION
     ------------------------------------------------------- */

  function changeLocation(location) {
    setView(location);

    setState((prev) => ({
      ...prev,
      location,
    }));

    setDrawer(null);
    setQuiz(null);
    setCertExam(null);
    setDialogue(null);
    setManualDiary(false);

    if (location === "home") {
      const hasCondo = state.assets.includes("asset_condo");

      if (hasCondo) {
        updateStats({
          energy: 25,
          study: 15,
        });

        showToast(
          "🏙️ Về căn hộ: +25⚡ +15📚",
          "info"
        );
      }
    }
  }

  function navigateLocation(direction) {
    const index = LOCATIONS.findIndex((x) => x.id === view);

    const nextIndex =
      (index + direction + LOCATIONS.length) %
      LOCATIONS.length;

    const next = LOCATIONS[nextIndex];

    changeLocation(next.id);
  }

  /* -------------------------------------------------------
     TIME
     ------------------------------------------------------- */

  function advanceTime() {
    setState((prev) => {
      if (prev.isGameOver) return prev;

      if (prev.timeIndex < TIME_PERIODS.length - 1) {
        return {
          ...prev,
          timeIndex: prev.timeIndex + 1,
        };
      }

      const diaryText =
        prev.todayEvents.length > 0
          ? prev.todayEvents.join(" ")
          : "Một ngày học tập và tích lũy trôi qua bình yên.";

      const diaryEntry = {
        day: prev.day,
        text: `Ngày thứ ${prev.day}: ${diaryText}`,
      };

      const isFinalDay = prev.day >= prev.totalDays;

      if (isFinalDay) {
        setTimeout(() => {
          setPendingDiary(diaryEntry);
          setShowEnding(true);
        }, 0);

        return {
          ...prev,
          isGameOver: true,
          diaryEntries: [...prev.diaryEntries, diaryEntry],
          todayEvents: [],
          stats: {
            ...prev.stats,
            energy: 100,
            money: prev.stats.money + 20000,
          },
        };
      }

      setTimeout(() => {
        setPendingDiary(diaryEntry);
      }, 0);

      return {
        ...prev,
        day: prev.day + 1,
        timeIndex: 0,
        diaryEntries: [...prev.diaryEntries, diaryEntry],
        todayEvents: [],
        stats: {
          ...prev.stats,
          energy: 100,
          money: prev.stats.money + 20000,
        },
      };
    });

    playSuccess();
  }

  function quickSleep() {
    if (state.isGameOver) return;

    if (
      window.confirm(
        "Đi ngủ sớm để sang ngày mới?\nBạn sẽ nhận 20.000đ tiền sinh hoạt."
      )
    ) {
      advanceTime();
    }
  }

  /* -------------------------------------------------------
     CLASSROOM
     ------------------------------------------------------- */

  function startClassroomLesson() {
    if (state.isGameOver) return;

    if (state.stats.energy < 15) {
      showToast("⚠️ Không đủ năng lượng để học.", "error");
      playWrong();
      return;
    }

    const q =
      QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)];

    setQuiz(q);
    setDrawer(null);
    playSuccess();
  }

  function answerQuiz(index) {
    if (!quiz) return;

    const teacher = TEACHERS[quiz.sub];

    if (index === quiz.c) {
      updateStats({
        study: 8,
        mood: 5,
        energy: -15,
        reputation: 3,
      });

      showToast(
        `✅ ${teacher.name}: Chính xác! +8📚`,
        "success"
      );

      playSuccess();
    } else {
      updateStats({
        study: 2,
        mood: -5,
        energy: -15,
      });

      showToast(
        `❌ ${teacher.name}: Hãy xem lại kiến thức!`,
        "error"
      );

      playWrong();
    }

    setQuiz(null);
    advanceTime();
  }

  function skipClass() {
    updateStats({
      energy: 10,
      study: -4,
      reputation: -2,
    });

    showToast(
      "😴 Gục đầu ngủ trong lớp: +10⚡ nhưng -4📚",
      "warning"
    );

    playWrong();
    setQuiz(null);
    advanceTime();
  }

  /* -------------------------------------------------------
     CANTEEN
     ------------------------------------------------------- */

  function buyFood(item) {
    if (state.stats.money < item.price) {
      showToast("💸 Không đủ tiền!", "error");
      playWrong();
      return;
    }

    updateStats({
      money: -item.price,
      energy: item.energy,
      mood: item.mood,
      love: item.love,
    });

    showToast(`😋 Đã mua ${item.name}!`, "success");
    playSuccess();
    advanceTime();
  }

  /* -------------------------------------------------------
     JOBS
     ------------------------------------------------------- */

  function doJob(job) {
    if (!job.condition(state)) {
      showToast(`⛔ ${job.requirement}`, "error");
      playWrong();
      return;
    }

    if (state.stats.energy < job.energy) {
      showToast("⚠️ Bạn quá mệt để làm công việc này.", "error");
      playWrong();
      return;
    }

    updateStats({
      money: job.salary,
      energy: -job.energy,
      hp: -job.hp,
      skill: job.skill,
      mood: -2,
    });

    addEvent(job.diary);

    showToast(
      `💰 +${formatMoney(job.salary)} | 🧠 +${job.skill}`,
      "success"
    );

    playSuccess();
    advanceTime();
  }

  /* -------------------------------------------------------
     CERTIFICATES
     ------------------------------------------------------- */

  function startCertificate(cert) {
    if (state.certificates.includes(cert.id)) {
      showToast("Bạn đã có chứng chỉ này rồi.", "info");
      return;
    }

    if (state.stats.money < cert.fee) {
      showToast("💸 Không đủ tiền nộp lệ phí.", "error");
      playWrong();
      return;
    }

    if (state.stats.skill < cert.reqSkill) {
      showToast(
        `⚠️ Cần Kỹ năng ≥ ${cert.reqSkill}.`,
        "warning"
      );
      playWrong();
      return;
    }

    if (state.stats.energy < 25) {
      showToast("⚠️ Cần ít nhất 25 năng lượng.", "warning");
      playWrong();
      return;
    }

    updateStats({
      money: -cert.fee,
      energy: -25,
    });

    setCertExam({
      certId: cert.id,
      index: 0,
      score: 0,
    });

    playSuccess();
  }

  function answerCertificate(index) {
    if (!certExam) return;

    const cert = CERTIFICATES.find(
      (c) => c.id === certExam.certId
    );

    const question = cert.questions[certExam.index];
    const correct = index === question.c;

    const nextScore = correct
      ? certExam.score + 1
      : certExam.score;

    if (correct) {
      playSuccess();
    } else {
      playWrong();
    }

    const nextIndex = certExam.index + 1;

    if (nextIndex < cert.questions.length) {
      setCertExam({
        ...certExam,
        index: nextIndex,
        score: nextScore,
      });

      return;
    }

    finishCertificate(cert, nextScore);
  }

  function finishCertificate(cert, score) {
    const passed = score >= 2;

    if (passed) {
      setState((prev) => ({
        ...prev,
        certificates: prev.certificates.includes(cert.id)
          ? prev.certificates
          : [...prev.certificates, cert.id],
        stats: {
          ...prev.stats,
          reputation: clamp(
            prev.stats.reputation + 20,
            0,
            100
          ),
          mood: clamp(prev.stats.mood + 20, 0, 100),
          skill: clamp(prev.stats.skill + 10, 0, 100),
        },
        todayEvents: [
          ...prev.todayEvents,
          `Đỗ chứng chỉ ${cert.name}.`,
        ],
      }));

      showToast(
        `🎉 ĐỖ ${cert.name}! ${score}/3 câu đúng.`,
        "success"
      );

      playSuccess();
    } else {
      updateStats({ mood: -10 });

      addEvent(`Trượt kỳ thi ${cert.name}.`);

      showToast(
        `😢 Trượt ${cert.name}: ${score}/3. Cố gắng lần sau!`,
        "error"
      );

      playWrong();
    }

    setCertExam(null);
    advanceTime();
  }

  /* -------------------------------------------------------
     PROPERTY
     ------------------------------------------------------- */

  function buyProperty(item) {
    if (state.assets.includes(item.id)) {
      showToast("Bạn đã sở hữu tài sản này.", "info");
      return;
    }

    if (
      item.license &&
      !state.certificates.includes(item.license)
    ) {
      showToast(
        "⛔ Cần có bằng lái ô tô trước.",
        "error"
      );
      playWrong();
      return;
    }

    if (state.stats.money < item.price) {
      showToast("💸 Không đủ tiền mua tài sản.", "error");
      playWrong();
      return;
    }

    let changes = {
      money: -item.price,
      reputation: 30,
      mood: 35,
    };

    if (
      item.id === "asset_car_sedan" ||
      item.id === "asset_car_super"
    ) {
      changes.love = 25;
    }

    setState((prev) => ({
      ...prev,
      assets: [...prev.assets, item.id],
      stats: {
        ...prev.stats,
        ...Object.fromEntries(
          Object.entries(changes).map(([key, value]) => [
            key,
            ["money", "study"].includes(key)
              ? Math.max(
                  0,
                  (prev.stats[key] || 0) + value
                )
              : clamp(
                  (prev.stats[key] || 0) + value,
                  0,
                  100
                ),
          ])
        ),
      },
      todayEvents: [
        ...prev.todayEvents,
        `Mua thành công ${item.name}.`,
      ],
    }));

    showToast(`🏡 Đã mua ${item.name}!`, "success");
    playSuccess();
  }

  /* -------------------------------------------------------
     NPC
     ------------------------------------------------------- */

  function interactNPC(who) {
    if (state.isGameOver) return;

    if (who === "lan") {
      updateStats({
        energy: -10,
        mood: 15,
        friends: 6,
      });

      addEvent("Tám chuyện cùng Lan sau giờ học.");

      showToast(
        "👧 Lan: Có bạn thân thật vui! +6👥",
        "info"
      );

      advanceTime();
      return;
    }

    if (who === "tuan") {
      updateStats({
        energy: -15,
        hp: 6,
        mood: 10,
      });

      addEvent("Ném bóng cùng Tuấn.");

      showToast(
        "🏀 Chơi bóng cùng Tuấn: +6❤️ +10😊",
        "info"
      );

      advanceTime();
      return;
    }

    if (who === "crush") {
      const hasCar =
        state.assets.includes("asset_car_sedan") ||
        state.assets.includes("asset_car_super");

      setDialogue({
        hasCar,
      });
    }
  }

  function chooseDialogue(withCar) {
    if (withCar) {
      updateStats({
        love: 15,
        mood: 25,
        energy: -8,
      });

      addEvent(
        "Lái ô tô chở Triệu Mẫn đi dạo cuối ngày."
      );

      showToast(
        "💕 Mẫn rất vui khi được bạn chở đi chơi!",
        "success"
      );
    } else {
      updateStats({
        love: 8,
        mood: 15,
        energy: -5,
      });

      addEvent(
        "Cùng Triệu Mẫn động viên nhau cố gắng."
      );

      showToast(
        "💕 Tình cảm Triệu Mẫn +8%",
        "success"
      );
    }

    playSuccess();
    setDialogue(null);
    advanceTime();
  }

  /* -------------------------------------------------------
     BAG
     ------------------------------------------------------- */

  function useBagItem(item) {
    if (!item.count || item.count <= 0) {
      showToast("Vật phẩm đã hết.", "error");
      return;
    }

    if (item.id === "math_note") {
      updateStats({ study: 8 });

      setState((prev) => ({
        ...prev,
        bag: prev.bag.map((x) =>
          x.id === item.id
            ? { ...x, count: x.count - 1 }
            : x
        ),
      }));

      showToast("📘 Ôn sổ công thức: +8📚", "success");
      return;
    }

    if (item.id === "gift_strawberry") {
      updateStats({ love: 8 });

      setState((prev) => ({
        ...prev,
        bag: prev.bag.map((x) =>
          x.id === item.id
            ? { ...x, count: x.count - 1 }
            : x
        ),
      }));

      showToast("🍬 Tặng kẹo dâu: +8💕", "success");
    }
  }

  /* -------------------------------------------------------
     SAVE CODE
     ------------------------------------------------------- */

  function encodeSave(data) {
    try {
      const json = JSON.stringify(data);
      const bytes = new TextEncoder().encode(json);

      let binary = "";

      const chunkSize = 0x8000;

      for (
        let i = 0;
        i < bytes.length;
        i += chunkSize
      ) {
        binary += String.fromCharCode(
          ...bytes.subarray(i, i + chunkSize)
        );
      }

      return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
    } catch {
      return "";
    }
  }

  function decodeSave(code) {
    try {
      let base64 = code
        .trim()
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      while (base64.length % 4 !== 0) {
        base64 += "=";
      }

      const binary = atob(base64);

      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const json = new TextDecoder().decode(bytes);

      return normalizeState(JSON.parse(json));
    } catch {
      return null;
    }
  }

  function openSaveCode() {
    const code = encodeSave(state);

    setSaveCode(code);
    setSaveModal("export");
  }

  async function copySaveCode() {
    try {
      await navigator.clipboard.writeText(saveCode);

      showToast("🔑 Đã copy mã lưu game!", "success");
    } catch {
      showToast(
        "Không thể copy tự động. Hãy bôi đen mã rồi copy.",
        "warning"
      );
    }
  }

  function importSaveCode() {
    const loaded = decodeSave(saveCode);

    if (!loaded) {
      showToast("❌ Mã lưu game không hợp lệ.", "error");
      playWrong();
      return;
    }

    setState(loaded);
    setView(loaded.location || "class");
    setSaveModal(null);

    showToast("📂 Đã khôi phục game từ mã lưu!", "success");
    playSuccess();
  }

  /* -------------------------------------------------------
     FILE SAVE / LOAD
     ------------------------------------------------------- */

  function saveGame() {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(state)
      );

      showToast("💾 Đã lưu game!", "success");
      playSuccess();
    } catch {
      showToast("❌ Không thể lưu game.", "error");
    }
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);

      if (!raw) {
        showToast("📂 Chưa có dữ liệu lưu.", "warning");
        return;
      }

      const loaded = normalizeState(JSON.parse(raw));

      setState(loaded);
      setView(loaded.location || "class");

      showToast("📂 Đã tải game!", "success");
      playSuccess();
    } catch {
      showToast("❌ File lưu bị lỗi.", "error");
      playWrong();
    }
  }

  function exportFile() {
    try {
      const blob = new Blob(
        [JSON.stringify(state, null, 2)],
        {
          type: "application/json;charset=utf-8",
        }
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `thanh-xuan-ngay-${state.day}.json`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      showToast("📤 Đã xuất file save!", "success");
    } catch {
      showToast("❌ Không thể xuất file.", "error");
    }
  }

  function importFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const loaded = normalizeState(
          JSON.parse(reader.result)
        );

        setState(loaded);
        setView(loaded.location || "class");

        localStorage.setItem(
          SAVE_KEY,
          JSON.stringify(loaded)
        );

        showToast(
          "📥 Nhập file save thành công!",
          "success"
        );

        playSuccess();
      } catch {
        showToast(
          "❌ File không đúng định dạng save.",
          "error"
        );

        playWrong();
      }

      event.target.value = "";
    };

    reader.readAsText(file);
  }

  /* -------------------------------------------------------
     RESTART
     ------------------------------------------------------- */

  function restartGame() {
    if (
      !window.confirm(
        "Bạn chắc chắn muốn xóa game hiện tại và chơi lại?"
      )
    ) {
      return;
    }

    const fresh = createInitialState();

    setState(fresh);
    setView("class");
    setQuiz(null);
    setCertExam(null);
    setDialogue(null);
    setShowEnding(false);
    setPendingDiary(null);

    localStorage.removeItem(SAVE_KEY);

    showToast("🌸 Đã bắt đầu một thanh xuân mới!", "success");
  }

  /* -------------------------------------------------------
     DIARY
     ------------------------------------------------------- */

  function openDiary() {
    setDrawer(null);
    setManualDiary(true);
  }

  function closeDiary() {
    setManualDiary(false);
  }

  function continueDiary() {
    setPendingDiary(null);
    setManualDiary(false);

    if (showEnding) {
      setShowEnding(false);
      return;
    }

    setView("class");
  }

  /* -------------------------------------------------------
     DRAWER
     ------------------------------------------------------- */

  function toggleDrawer(type) {
    setDrawer((prev) => (prev === type ? null : type));
  }

  /* -------------------------------------------------------
     ENDING
     ------------------------------------------------------- */

  const ending = useMemo(() => {
    const s = state.stats;

    if (
      state.assets.includes("asset_villa") ||
      s.money >= 5000000
    ) {
      return {
        title: "👑 ĐẠI GIA BẤT ĐỘNG SẢN & TÀI CHÍNH",
        sub: "Tuổi trẻ tài cao, sở hữu dinh cơ đáng mơ ước",
        desc:
          "Bạn vừa tốt nghiệp với khối tài sản khổng lồ nhờ chăm chỉ học tập, làm thêm và tích lũy.",
      };
    }

    if (state.certificates.length >= 3) {
      return {
        title: "🌟 CHUYÊN GIA TOÀN NĂNG",
        sub: "Bộ sưu tập chứng chỉ cực kỳ ấn tượng",
        desc:
          "Bạn sở hữu nhiều chứng chỉ và kỹ năng đa dạng, sẵn sàng bước vào hành trình nghề nghiệp.",
      };
    }

    if (
      s.love >= 80 &&
      (state.assets.includes("asset_car_sedan") ||
        state.assets.includes("asset_car_super"))
    ) {
      return {
        title: "💕 CHUYỆN TÌNH XE HOA",
        sub: "Thanh xuân trọn vẹn bên người mình thương",
        desc:
          "Những ngày tháng học tập, làm thêm và cố gắng đã tạo nên một câu chuyện thanh xuân đáng nhớ.",
      };
    }

    return {
      title: "🌸 THANH XUÂN TỰ LẬP & TRƯỞNG THÀNH",
      sub: "Vững bước vào đời bằng chính thực lực",
      desc:
        "Bạn đã trải qua một thời học sinh đầy trải nghiệm: học tập, làm thêm, thi chứng chỉ và xây dựng tương lai.",
    };
  }, [state]);

  /* -------------------------------------------------------
     RENDER HELPERS
     ------------------------------------------------------- */

  const currentPeriod =
    TIME_PERIODS[state.timeIndex] || TIME_PERIODS[0];

  const locationInfo =
    LOCATIONS.find((x) => x.id === view) ||
    LOCATIONS[0];

  const latestDiary =
    state.diaryEntries[state.diaryEntries.length - 1];

  return (
    <>
      <style>{CSS}</style>

      <div className="game-page">
        <div className="console">
          {/* TOP BAR */}
          <div className="topbar">
            <div className="brand">
              <span className="status-dot" />
              <span>THANH XUÂN RỰC RỠ</span>
            </div>

            <div className="top-actions">
              <button
                className="mini-btn green"
                onClick={saveGame}
              >
                💾 LƯU
              </button>

              <button
                className="mini-btn blue"
                onClick={loadGame}
              >
                📂 TẢI
              </button>

              <button
                className="mini-btn"
                onClick={openSaveCode}
              >
                🔑 MÃ
              </button>

              <button
                className="mini-btn"
                onClick={exportFile}
              >
                📤 XUẤT
              </button>

              <button
                className="mini-btn"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                📥 NHẬP
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
                onChange={importFile}
              />

              <button
                className="mini-btn"
                onClick={toggleAudio}
              >
                {audioEnabled ? "🔊" : "🔇"}
              </button>
            </div>
          </div>

          {/* SCREEN */}
          <div className="screen">
            {/* HUD */}
            <div className="hud">
              <div className="day-box">
                <div className="weather">☀️</div>

                <div>
                  <div className="day-title">
                    {DAYS_OF_WEEK[
                      (state.day - 1) % 7
                    ]}

                    <span>•</span>

                    <span className="time">
                      {currentPeriod.text}
                    </span>
                  </div>

                  <div className="period">
                    {currentPeriod.name}
                  </div>
                </div>

                <div className="day-count">
                  NGÀY {state.day}/{state.totalDays}
                </div>
              </div>

              <div className="stats">
                <Stat icon="❤️" value={state.stats.hp} />
                <Stat
                  icon="⚡"
                  value={state.stats.energy}
                />
                <Stat
                  icon="😊"
                  value={state.stats.mood}
                />
                <Stat
                  icon="📚"
                  value={state.stats.study}
                />
                <Stat
                  icon="💕"
                  value={`${state.stats.love}%`}
                />
                <Stat
                  icon="🧠"
                  value={state.stats.skill}
                />
                <Stat
                  icon="💰"
                  value={formatMoney(
                    state.stats.money
                  )}
                />
              </div>
            </div>

            {/* STAGE */}
            <div className="stage">
              <div className="stage-header">
                <div className="location-title">
                  <span>{locationInfo.icon}</span>
                  <span>
                    {view === "class" &&
                      "LỚP 12A3 - KHỐI CHUYÊN"}

                    {view === "canteen" &&
                      "CĂN TIN TRƯỜNG - CÔ NĂM"}

                    {view === "job" &&
                      "TRUNG TÂM VIỆC LÀM"}

                    {view === "cert" &&
                      "TRUNG TÂM KHẢO THÍ"}

                    {view === "prop" &&
                      "SÀN NHÀ CỬA & SIÊU XE"}

                    {view === "home" &&
                      "PHÒNG RIÊNG Ở NHÀ"}
                  </span>
                </div>

                {toast && (
                  <div
                    className={`toast-inline ${toast.type}`}
                  >
                    {toast.message}
                  </div>
                )}
              </div>

              <div className="stage-content">
                {/* CLASS */}
                {view === "class" && !quiz && (
                  <ClassScene
                    onNPC={interactNPC}
                    onStudy={startClassroomLesson}
                  />
                )}

                {/* HOME */}
                {view === "home" && (
                  <HomeScene
                    state={state}
                    onStudy={startClassroomLesson}
                  />
                )}

                {/* CANTEEN */}
                {view === "canteen" && (
                  <CanteenView
                    items={CANTEEN}
                    money={state.stats.money}
                    onBuy={buyFood}
                  />
                )}

                {/* JOB */}
                {view === "job" && (
                  <JobView
                    jobs={JOBS}
                    state={state}
                    onJob={doJob}
                  />
                )}

                {/* CERT */}
                {view === "cert" && !certExam && (
                  <CertificateView
                    certificates={CERTIFICATES}
                    state={state}
                    onStart={startCertificate}
                  />
                )}

                {/* PROPERTY */}
                {view === "prop" && (
                  <PropertyView
                    properties={PROPERTIES}
                    state={state}
                    onBuy={buyProperty}
                  />
                )}

                {/* QUIZ */}
                {quiz && (
                  <QuizCard
                    quiz={quiz}
                    teacher={TEACHERS[quiz.sub]}
                    onAnswer={answerQuiz}
                    onSkip={skipClass}
                  />
                )}

                {/* CERT EXAM */}
                {certExam && (
                  <CertificateExam
                    exam={certExam}
                    cert={CERTIFICATES.find(
                      (x) => x.id === certExam.certId
                    )}
                    onAnswer={answerCertificate}
                  />
                )}
              </div>

              {/* LOCATION NAV */}
              <div className="location-nav">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    className={
                      view === loc.id
                        ? "location-btn active"
                        : "location-btn"
                    }
                    onClick={() =>
                      changeLocation(loc.id)
                    }
                    disabled={state.isGameOver}
                  >
                    <span>{loc.icon}</span>
                    <span>{loc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* BOTTOM ACTION BAR */}
            <div className="action-bar">
              <button
                onClick={() =>
                  toggleDrawer("study")
                }
              >
                📖 <span>Học Tập</span>
              </button>

              <button
                onClick={() =>
                  toggleDrawer("profile")
                }
              >
                🎖️ <span>Bằng Cấp</span>
              </button>

              <button
                onClick={() =>
                  toggleDrawer("assets")
                }
              >
                🏡 <span>Tài Sản</span>
              </button>

              <button
                onClick={() =>
                  toggleDrawer("bag")
                }
              >
                🎒 <span>Túi Đồ</span>
              </button>

              <button
                className="diary-btn"
                onClick={openDiary}
              >
                📓 <span>Nhật Ký</span>
              </button>
            </div>

            {/* DRAWER */}
            {drawer && (
              <Drawer
                type={drawer}
                state={state}
                onClose={() => setDrawer(null)}
                onStudy={startClassroomLesson}
                onCert={() => {
                  setDrawer(null);
                  changeLocation("cert");
                }}
                onBuyBag={useBagItem}
              />
            )}
          </div>

          {/* CONTROLLER */}
          <div className="controller">
            <div className="dpad">
              <button
                onClick={() => navigateLocation(-1)}
              >
                ◀
              </button>

              <button
                onClick={() => navigateLocation(1)}
              >
                ▶
              </button>
            </div>

            <div className="controller-label">
              THANH XUÂN RỰC RỠ • CAREER & ASSETS
            </div>

            <div className="ab-buttons">
              <button
                className="b-button"
                onClick={quickSleep}
              >
                B
              </button>

              <button
                className="a-button"
                onClick={openDiary}
              >
                A
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DIALOGUE */}
      {dialogue && (
        <Modal>
          <div className="dialogue-card">
            <div className="modal-title pink">
              💕 TRIỆU MẪN
            </div>

            <div className="dialogue-text">
              {dialogue.hasCar
                ? "“Wow... Bạn tự đi làm tích góp mua được ô tô luôn hả? Chiều nay chở tớ đi ngắm hoàng hôn được không? 💕”"
                : "“Này cậu! Dạo này thấy cậu chăm chỉ học hành ghê nha. Cố lên nhé, tớ luôn ủng hộ cậu!”"}
            </div>

            <button
              className="choice pink-choice"
              onClick={() =>
                chooseDialogue(dialogue.hasCar)
              }
            >
              {dialogue.hasCar
                ? "🚗 Lên xe nào Mẫn ơi!"
                : "💕 Cảm ơn Mẫn nhé, tớ sẽ cố gắng!"}
            </button>

            <button
              className="close-button"
              onClick={() => setDialogue(null)}
            >
              Đóng
            </button>
          </div>
        </Modal>
      )}

      {/* DIARY */}
      {(manualDiary || pendingDiary) && (
        <Modal>
          <div className="diary-card">
            <div className="diary-heading">
              <span>📓</span>
              <div>
                <h2>
                  NHẬT KÝ — NGÀY{" "}
                  {pendingDiary?.day ||
                    latestDiary?.day ||
                    state.day}
                </h2>
                <small>
                  Những cột mốc trưởng thành
                </small>
              </div>
            </div>

            <div className="diary-content">
              {pendingDiary?.text ||
                latestDiary?.text ||
                "Chưa có trang nhật ký nào."}
            </div>

            <div className="diary-actions">
              <button
                className="primary-button"
                onClick={continueDiary}
              >
                {showEnding
                  ? "Xem lễ tốt nghiệp 🎓"
                  : pendingDiary
                  ? "Thức dậy ngày mới ☀️"
                  : "Đóng nhật ký"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ENDING */}
      {showEnding && (
        <Modal>
          <div className="ending-card">
            <div className="graduation">🎓</div>

            <div className="pixel-small">
              LỄ TỐT NGHIỆP & TỔNG KẾT
            </div>

            <h1>{ending.title}</h1>

            <h3>{ending.sub}</h3>

            <p>{ending.desc}</p>

            <div className="ending-grid">
              <div>
                📚 Học tập
                <b>{state.stats.study}</b>
              </div>

              <div>
                💕 Tình cảm
                <b>{state.stats.love}%</b>
              </div>

              <div>
                📜 Chứng chỉ
                <b>{state.certificates.length}</b>
              </div>

              <div>
                🏡 Tài sản
                <b>{state.assets.length}</b>
              </div>

              <div>
                💰 Tiền
                <b>{formatMoney(state.stats.money)}</b>
              </div>

              <div>
                🧠 Kỹ năng
                <b>{state.stats.skill}</b>
              </div>
            </div>

            <button
              className="restart-button"
              onClick={restartGame}
            >
              CHƠI LẠI VÁN MỚI 🌸
            </button>
          </div>
        </Modal>
      )}

      {/* SAVE CODE MODAL */}
      {saveModal && (
        <Modal>
          <div className="save-card">
            <h2>🔑 MÃ LƯU GAME</h2>

            <p>
              {saveModal === "export"
                ? "Copy mã này để lưu game. Bạn có thể gửi mã cho chính mình hoặc nhập lại trên máy khác."
                : "Dán mã lưu game vào ô bên dưới."}
            </p>

            <textarea
              value={saveCode}
              onChange={(e) =>
                setSaveCode(e.target.value)
              }
              placeholder="Mã lưu game..."
              spellCheck={false}
            />

            <div className="save-actions">
              {saveModal === "export" ? (
                <button
                  className="primary-button"
                  onClick={copySaveCode}
                >
                  📋 COPY MÃ
                </button>
              ) : (
                <button
                  className="primary-button"
                  onClick={importSaveCode}
                >
                  📂 KHÔI PHỤC
                </button>
              )}

              <button
                className="close-button"
                onClick={() => setSaveModal(null)}
              >
                Đóng
              </button>
            </div>

            <button
              className="link-button"
              onClick={() =>
                setSaveModal(
                  saveModal === "export"
                    ? "import"
                    : "export"
                )
              }
            >
              {saveModal === "export"
                ? "→ Nhập mã lưu game"
                : "→ Tạo mã từ game hiện tại"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

/* =========================================================
   COMPONENTS
   ========================================================= */

function Stat({ icon, value }) {
  return (
    <div className="stat">
      <span>{icon}</span>
      <b>{value}</b>
    </div>
  );
}

function ClassScene({ onNPC, onStudy }) {
  return (
    <div className="scene">
      <div className="npc-row">
        <button
          className="npc"
          onClick={() => onNPC("lan")}
        >
          <span>👧</span>
          <small>Lan</small>
          <em>Bạn thân</em>
        </button>

        <button
          className="npc crush"
          onClick={() => onNPC("crush")}
        >
          <span>✨👧</span>
          <small>Triệu Mẫn</small>
          <em>💕 Crush</em>
        </button>

        <button
          className="npc"
          onClick={() => onNPC("tuan")}
        >
          <span>🏀</span>
          <small>Tuấn</small>
          <em>Bóng rổ</em>
        </button>
      </div>

      <div className="class-label">
        LỚP 12A3 — KHỐI CHUYÊN
      </div>

      <p className="narrative">
        “Tự mình học tập, làm thêm, thi chứng chỉ
        và gom góp để xây dựng tương lai!”
      </p>

      <button
        className="big-study-button"
        onClick={onStudy}
      >
        📚 VÀO TIẾT HỌC
      </button>
    </div>
  );
}

function HomeScene({ state, onStudy }) {
  const condo = state.assets.includes("asset_condo");
  const villa = state.assets.includes("asset_villa");

  return (
    <div className="home-scene">
      <div className="home-icon">
        {villa ? "🏰" : condo ? "🏙️" : "🏠"}
      </div>

      <h2>
        {villa
          ? "BIỆT THỰ THẢO ĐIỀN"
          : condo
          ? "CĂN HỘ STUDIO"
          : "PHÒNG RIÊNG"}
      </h2>

      <p>
        {villa
          ? "Không gian sống của một đại gia tương lai."
          : condo
          ? "Không gian yên tĩnh để học tập và nghỉ ngơi."
          : "Góc nhỏ để hồi phục năng lượng sau một ngày dài."}
      </p>

      <button
        className="big-study-button"
        onClick={onStudy}
      >
        📖 NGỒI HỌC
      </button>
    </div>
  );
}

function CanteenView({ items, money, onBuy }) {
  return (
    <div className="list-view">
      <div className="view-heading">
        🍜 CĂN TIN CÔ NĂM
        <span>Ví: {formatMoney(money)}</span>
      </div>

      {items.map((item) => (
        <div className="shop-item" key={item.id}>
          <div className="shop-icon">
            {item.icon}
          </div>

          <div className="shop-info">
            <b>{item.name}</b>

            <small>
              +{item.energy}⚡ | +{item.mood}😊
              {item.love > 0 &&
                ` | +${item.love}💕`}
            </small>

            <strong>
              {formatMoney(item.price)}
            </strong>
          </div>

          <button
            className="buy green-buy"
            onClick={() => onBuy(item)}
          >
            MUA
          </button>
        </div>
      ))}
    </div>
  );
}

function JobView({ jobs, state, onJob }) {
  return (
    <div className="list-view">
      <div className="view-heading">
        💼 VIỆC LÀM
        <span>
          Năng lượng: {state.stats.energy}
        </span>
      </div>

      {jobs.map((job) => {
        const available = job.condition(state);

        return (
          <div
            className={`shop-item ${
              !available ? "disabled" : ""
            }`}
            key={job.id}
          >
            <div className="shop-icon">
              {job.icon}
            </div>

            <div className="shop-info">
              <b>{job.name}</b>

              <small>{job.requirement}</small>

              <strong>
                +{formatMoney(job.salary)} • -
                {job.energy}⚡
              </strong>
            </div>

            <button
              className="buy purple-buy"
              disabled={!available}
              onClick={() => onJob(job)}
            >
              LÀM
            </button>
          </div>
        );
      })}
    </div>
  );
}

function CertificateView({
  certificates,
  state,
  onStart,
}) {
  return (
    <div className="list-view">
      <div className="view-heading">
        📜 TRUNG TÂM CHỨNG CHỈ
        <span>
          Kỹ năng: {state.stats.skill}
        </span>
      </div>

      {certificates.map((cert) => {
        const owned =
          state.certificates.includes(cert.id);

        return (
          <div
            className={`shop-item ${
              owned ? "owned" : ""
            }`}
            key={cert.id}
          >
            <div className="shop-icon">
              {cert.icon}
            </div>

            <div className="shop-info">
              <b>{cert.name}</b>

              <small>{cert.desc}</small>

              <strong>
                Lệ phí: {formatMoney(cert.fee)} |
                Kỹ năng ≥ {cert.reqSkill}
              </strong>
            </div>

            {owned ? (
              <span className="owned-label">
                ĐÃ CÓ ✓
              </span>
            ) : (
              <button
                className="buy cyan-buy"
                onClick={() => onStart(cert)}
              >
                THI
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PropertyView({
  properties,
  state,
  onBuy,
}) {
  return (
    <div className="list-view">
      <div className="view-heading">
        🏙️ NHÀ & XE
        <span>
          Ví: {formatMoney(state.stats.money)}
        </span>
      </div>

      {properties.map((item) => {
        const owned = state.assets.includes(
          item.id
        );

        const locked =
          item.license &&
          !state.certificates.includes(
            item.license
          );

        return (
          <div
            className={`shop-item ${
              owned ? "owned" : ""
            }`}
            key={item.id}
          >
            <div className="shop-icon">
              {item.icon}
            </div>

            <div className="shop-info">
              <b>{item.name}</b>

              <small>{item.desc}</small>

              <strong>
                {formatMoney(item.price)}
              </strong>

              <small className="yellow-text">
                {item.buff}
              </small>

              {locked && (
                <small className="red-text">
                  🔒 Cần bằng lái
                </small>
              )}
            </div>

            {owned ? (
              <span className="owned-label">
                ĐANG SỞ HỮU
              </span>
            ) : (
              <button
                className="buy gold-buy"
                disabled={locked}
                onClick={() => onBuy(item)}
              >
                MUA
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuizCard({
  quiz,
  teacher,
  onAnswer,
  onSkip,
}) {
  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <span>{teacher.subject}</span>
        <b>{teacher.name}</b>
      </div>

      <div className="teacher-row">
        <div className="teacher-avatar">
          {teacher.avatar}
        </div>

        <p>{quiz.q}</p>
      </div>

      <div className="quiz-options">
        {quiz.opts.map((option, index) => (
          <button
            key={option}
            onClick={() => onAnswer(index)}
          >
            {String.fromCharCode(65 + index)}.{" "}
            {option}
          </button>
        ))}
      </div>

      <div className="quiz-bottom">
        <span>⚡ Tốn 15 năng lượng</span>

        <button onClick={onSkip}>
          😴 Gục đầu ngủ
        </button>
      </div>
    </div>
  );
}

function CertificateExam({
  exam,
  cert,
  onAnswer,
}) {
  const question = cert.questions[exam.index];

  return (
    <div className="quiz-card cert-exam">
      <div className="quiz-header cyan">
        <span>
          {cert.icon} {cert.name}
        </span>

        <b>
          Câu {exam.index + 1}/
          {cert.questions.length}
        </b>
      </div>

      <div className="exam-question">
        {question.q}
      </div>

      <div className="quiz-options one-column">
        {question.opts.map((option, index) => (
          <button
            key={option}
            onClick={() => onAnswer(index)}
          >
            {String.fromCharCode(65 + index)}.{" "}
            {option}
          </button>
        ))}
      </div>

      <div className="exam-score">
        Điểm hiện tại: {exam.score}
      </div>
    </div>
  );
}

function Drawer({
  type,
  state,
  onClose,
  onStudy,
  onCert,
  onBuyBag,
}) {
  let title = "";
  let content = null;

  if (type === "study") {
    title = "📖 HỌC TẬP";

    content = (
      <>
        <button
          className="drawer-action"
          onClick={onStudy}
        >
          ✍️ Trả lời câu hỏi giáo viên
        </button>

        <button
          className="drawer-action cyan"
          onClick={onCert}
        >
          📜 Thi chứng chỉ
        </button>
      </>
    );
  }

  if (type === "profile") {
    title = "🎖️ CHỨNG CHỈ";

    content =
      state.certificates.length === 0 ? (
        <p className="empty">
          Chưa có chứng chỉ nào.
        </p>
      ) : (
        state.certificates.map((id) => {
          const cert = CERTIFICATES.find(
            (x) => x.id === id
          );

          return (
            <div className="drawer-card" key={id}>
              {cert?.icon} {cert?.name}
            </div>
          );
        })
      );
  }

  if (type === "assets") {
    title = "🏡 TÀI SẢN";

    content =
      state.assets.length === 0 ? (
        <p className="empty">
          Bạn chưa sở hữu tài sản nào.
        </p>
      ) : (
        state.assets.map((id) => {
          const item = PROPERTIES.find(
            (x) => x.id === id
          );

          return (
            <div className="drawer-card" key={id}>
              <b>
                {item?.icon} {item?.name}
              </b>

              <small>{item?.buff}</small>
            </div>
          );
        })
      );
  }

  if (type === "bag") {
    title = "🎒 TÚI ĐỒ";

    content = state.bag.map((item) => (
      <div className="drawer-card bag-row" key={item.id}>
        <div>
          <b>
            {item.icon} {item.name}
          </b>

          <small>{item.desc}</small>
        </div>

        <button
          className="use-button"
          disabled={item.count <= 0}
          onClick={() => onBuyBag(item)}
        >
          DÙNG x{item.count}
        </button>
      </div>
    ));
  }

  return (
    <div className="drawer">
      <div className="drawer-header">
        <b>{title}</b>

        <button onClick={onClose}>✕</button>
      </div>

      <div className="drawer-content">
        {content}
      </div>
    </div>
  );
}

function Modal({ children }) {
  return (
    <div className="modal-backdrop">
      {children}
    </div>
  );
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
}

body {
  background:
    radial-gradient(circle at top, #18243b 0%, #020617 55%);
  color: #e2e8f0;
  font-family:
    "Be Vietnam Pro",
    Arial,
    sans-serif;
}

button,
textarea {
  font-family: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

.game-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.console {
  width: 100%;
  max-width: 1050px;
  background: #0f172a;
  border: 5px solid #334155;
  border-radius: 30px;
  padding: 12px;
  box-shadow:
    0 0 0 4px #1e293b,
    0 0 0 8px #334155,
    0 25px 60px rgba(0,0,0,.8);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 5px 8px 10px;
  border-bottom: 2px solid #1e293b;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fbbf24;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
}

.top-actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.mini-btn {
  border: 1px solid #475569;
  background: #1e293b;
  color: #cbd5e1;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 9px;
  font-weight: 800;
}

.mini-btn:hover {
  background: #334155;
  color: white;
}

.mini-btn.green {
  background: #047857;
  color: white;
}

.mini-btn.blue {
  background: #0369a1;
  color: white;
}

.screen {
  position: relative;
  margin-top: 12px;
  min-height: 700px;
  padding: 12px;
  border: 5px solid #020617;
  border-radius: 18px;
  background:
    radial-gradient(circle at center, #1e293b 0%, #020617 100%);
  box-shadow: inset 0 0 35px rgba(0,0,0,.9);
}

.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px;
  border: 2px solid #334155;
  border-radius: 13px;
  background: rgba(2,6,23,.9);
  box-shadow: 3px 3px 0 #020617;
}

.day-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather {
  font-size: 25px;
}

.day-title {
  color: #fcd34d;
  font-weight: 900;
  font-size: 12px;
}

.day-title .time {
  color: #34d399;
  font-family: monospace;
}

.day-title span {
  margin: 0 4px;
}

.period {
  color: #94a3b8;
  font-size: 10px;
  margin-top: 2px;
}

.day-count {
  margin-left: 5px;
  padding: 4px 7px;
  border-radius: 6px;
  background: #1e293b;
  color: #94a3b8;
  font-family: monospace;
  font-size: 9px;
}

.stats {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 7px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 7px;
  font-family: monospace;
  font-size: 10px;
}

.stat b {
  color: #f8fafc;
}

.stage {
  position: relative;
  min-height: 485px;
  margin-top: 12px;
  padding: 12px;
  border: 2px solid #334155;
  border-radius: 14px;
  background:
    linear-gradient(
      to bottom,
      rgba(7,89,133,.35),
      rgba(15,23,42,.9) 55%,
      #020617
    );
  overflow: hidden;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.location-title {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  background: rgba(2,6,23,.85);
  border: 1px solid #475569;
  border-radius: 8px;
  color: #fcd34d;
  font-size: 10px;
  font-weight: 900;
}

.toast-inline {
  padding: 6px 9px;
  background: rgba(0,0,0,.85);
  border: 1px solid #475569;
  border-radius: 7px;
  font-family: monospace;
  font-size: 10px;
  max-width: 55%;
}

.toast-inline.success {
  color: #34d399;
}

.toast-inline.error {
  color: #fb7185;
}

.toast-inline.warning {
  color: #fbbf24;
}

.toast-inline.info {
  color: #38bdf8;
}

.stage-content {
  min-height: 370px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
}

.scene {
  width: 100%;
  text-align: center;
}

.npc-row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(18px, 7vw, 70px);
  margin-bottom: 25px;
}

.npc {
  border: 0;
  background: transparent;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform .15s;
}

.npc:hover {
  transform: translateY(-6px);
}

.npc > span {
  font-size: clamp(38px, 7vw, 65px);
  filter: drop-shadow(0 8px 4px rgba(0,0,0,.5));
}

.npc small {
  margin-top: 3px;
  padding: 4px 8px;
  background: rgba(2,6,23,.9);
  border: 1px solid #475569;
  border-radius: 6px;
  color: #e2e8f0;
  font-weight: 900;
  font-size: 10px;
}

.npc em {
  color: #94a3b8;
  font-size: 8px;
  font-style: normal;
}

.npc.crush small {
  color: #f9a8d4;
  border-color: #be185d;
}

.class-label {
  display: inline-block;
  padding: 8px 20px;
  border: 2px solid #fcd34d;
  border-radius: 9px;
  background: linear-gradient(
    90deg,
    #d97706,
    #facc15
  );
  color: #172033;
  font-size: 12px;
  font-weight: 1000;
  letter-spacing: 1px;
}

.narrative {
  max-width: 560px;
  margin: 12px auto;
  color: #cbd5e1;
  font-size: 11px;
  line-height: 1.7;
  font-style: italic;
}

.big-study-button {
  border: 2px solid #fbbf24;
  background: #f59e0b;
  color: #111827;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 11px;
  font-weight: 1000;
  box-shadow: 3px 3px 0 #020617;
}

.big-study-button:hover {
  background: #fcd34d;
}

.home-scene {
  text-align: center;
  max-width: 520px;
}

.home-icon {
  font-size: 75px;
  filter: drop-shadow(0 10px 5px rgba(0,0,0,.5));
}

.home-scene h2 {
  color: #fcd34d;
  font-size: 18px;
  margin: 10px 0 5px;
}

.home-scene p {
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.7;
}

.list-view {
  width: 100%;
  max-width: 720px;
  max-height: 365px;
  overflow-y: auto;
  padding-right: 4px;
}

.view-heading {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #334155;
  color: #67e8f9;
  font-size: 12px;
  font-weight: 1000;
}

.view-heading span {
  color: #94a3b8;
  font-family: monospace;
  font-size: 9px;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 7px;
  padding: 9px;
  border: 1px solid #334155;
  border-radius: 11px;
  background: rgba(2,6,23,.85);
}

.shop-item:hover {
  border-color: #64748b;
}

.shop-item.disabled {
  opacity: .55;
}

.shop-item.owned {
  border-color: #059669;
  background: rgba(6,78,59,.18);
}

.shop-icon {
  width: 42px;
  text-align: center;
  font-size: 29px;
  flex-shrink: 0;
}

.shop-info {
  flex: 1;
  min-width: 0;
}

.shop-info b {
  display: block;
  color: #f1f5f9;
  font-size: 11px;
}

.shop-info small {
  display: block;
  color: #94a3b8;
  font-size: 9px;
  line-height: 1.5;
  margin-top: 2px;
}

.shop-info strong {
  display: block;
  color: #34d399;
  font-family: monospace;
  font-size: 10px;
  margin-top: 2px;
}

.yellow-text {
  color: #fbbf24 !important;
}

.red-text {
  color: #fb7185 !important;
}

.buy {
  flex-shrink: 0;
  border: 0;
  border-radius: 7px;
  padding: 7px 10px;
  color: white;
  font-size: 10px;
  font-weight: 900;
}

.buy:disabled {
  opacity: .35;
}

.green-buy {
  background: #059669;
}

.purple-buy {
  background: #4f46e5;
}

.cyan-buy {
  background: #0891b2;
}

.gold-buy {
  background: #d97706;
  color: #111827;
}

.owned-label {
  color: #34d399;
  font-family: monospace;
  font-size: 9px;
  font-weight: 900;
  white-space: nowrap;
}

.quiz-card {
  width: 100%;
  max-width: 650px;
  padding: 15px;
  border: 2px solid #fbbf24;
  border-radius: 15px;
  background: #0f172a;
  box-shadow: 0 15px 40px rgba(0,0,0,.55);
}

.quiz-card.cert-exam {
  border-color: #22d3ee;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 9px;
  border-bottom: 1px solid #1e293b;
  color: #fbbf24;
  font-size: 10px;
  font-weight: 900;
}

.quiz-header.cyan {
  color: #67e8f9;
}

.teacher-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin: 13px 0;
}

.teacher-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #334155;
  border-radius: 10px;
  background: #1e293b;
  font-size: 25px;
}

.teacher-row p,
.exam-question {
  margin: 0;
  color: #e2e8f0;
  font-size: 12px;
  line-height: 1.7;
  font-weight: 700;
}

.quiz-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 7px;
}

.quiz-options.one-column {
  grid-template-columns: 1fr;
}

.quiz-options button {
  padding: 10px;
  border: 1px solid #475569;
  border-radius: 9px;
  background: #1e293b;
  color: #e2e8f0;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
}

.quiz-options button:hover {
  border-color: #fbbf24;
  background: #334155;
}

.cert-exam .quiz-options button:hover {
  border-color: #22d3ee;
}

.quiz-bottom {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px solid #1e293b;
  color: #94a3b8;
  font-size: 9px;
}

.quiz-bottom button {
  border: 0;
  background: transparent;
  color: #fb7185;
  font-size: 9px;
}

.exam-question {
  margin: 14px 0;
}

.exam-score {
  margin-top: 10px;
  color: #67e8f9;
  font-family: monospace;
  font-size: 10px;
}

.location-nav {
  display: flex;
  gap: 5px;
  padding-top: 9px;
  border-top: 1px solid #1e293b;
  flex-wrap: wrap;
}

.location-btn {
  flex: 1 1 90px;
  min-width: 75px;
  padding: 8px 5px;
  border: 1px solid #334155;
  border-radius: 8px;
  background: #1e293b;
  color: #cbd5e1;
  font-size: 9px;
  font-weight: 900;
}

.location-btn:hover {
  background: #334155;
  color: white;
}

.location-btn.active {
  border-color: #fbbf24;
  background: rgba(245,158,11,.15);
  color: #fcd34d;
}

.action-bar {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  padding: 8px;
  border: 2px solid #334155;
  border-radius: 12px;
  background: #020617;
}

.action-bar button {
  flex: 1;
  padding: 9px 5px;
  border: 1px solid #475569;
  border-radius: 8px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 10px;
  font-weight: 900;
  box-shadow: 2px 2px 0 #020617;
}

.action-bar button:hover {
  background: #334155;
}

.action-bar .diary-btn {
  background: #f59e0b;
  color: #111827;
}

.drawer {
  position: absolute;
  z-index: 50;
  left: 15px;
  right: 15px;
  bottom: 85px;
  max-height: 300px;
  overflow-y: auto;
  border: 2px solid #475569;
  border-radius: 15px;
  background: #0f172a;
  box-shadow: 0 20px 50px rgba(0,0,0,.75);
  padding: 12px;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #1e293b;
  color: #fcd34d;
  font-size: 11px;
}

.drawer-header button {
  border: 0;
  background: transparent;
  color: #94a3b8;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.drawer-action {
  padding: 10px;
  border: 1px solid #334155;
  border-radius: 9px;
  background: #1e293b;
  color: #e2e8f0;
  text-align: left;
  font-size: 10px;
  font-weight: 800;
}

.drawer-action:hover {
  background: #334155;
}

.drawer-action.cyan {
  color: #67e8f9;
}

.drawer-card {
  padding: 9px;
  border: 1px solid #334155;
  border-radius: 9px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 10px;
}

.drawer-card small {
  display: block;
  color: #94a3b8;
  margin-top: 4px;
  font-size: 9px;
}

.bag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.use-button {
  border: 0;
  border-radius: 6px;
  background: #7c3aed;
  color: white;
  padding: 6px 8px;
  font-size: 9px;
  font-weight: 900;
}

.use-button:disabled {
  opacity: .3;
}

.empty {
  color: #64748b;
  font-size: 10px;
}

.controller {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 8px 0;
}

.dpad {
  display: flex;
  gap: 4px;
}

.dpad button {
  width: 30px;
  height: 30px;
  border: 2px solid #475569;
  border-radius: 6px;
  background: #1e293b;
  color: #fbbf24;
  font-weight: 900;
}

.controller-label {
  color: #64748b;
  text-align: center;
  font-family: monospace;
  font-size: 8px;
  letter-spacing: 1px;
}

.ab-buttons {
  display: flex;
  gap: 7px;
}

.ab-buttons button {
  width: 32px;
  height: 32px;
  border: 2px solid;
  border-radius: 50%;
  color: white;
  font-size: 10px;
  font-weight: 900;
}

.a-button {
  background: #047857;
  border-color: #059669;
}

.b-button {
  background: #be123c;
  border-color: #e11d48;
}

.modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: rgba(0,0,0,.78);
  backdrop-filter: blur(3px);
}

.dialogue-card,
.save-card,
.diary-card,
.ending-card {
  width: 100%;
  max-width: 530px;
  padding: 18px;
  border-radius: 17px;
  background: #0f172a;
  border: 2px solid #475569;
  box-shadow: 0 25px 70px rgba(0,0,0,.8);
}

.dialogue-card {
  border-color: #f472b6;
}

.modal-title {
  padding-bottom: 10px;
  border-bottom: 1px solid #334155;
  font-size: 13px;
  font-weight: 1000;
}

.modal-title.pink {
  color: #f9a8d4;
}

.dialogue-text {
  margin: 13px 0;
  padding: 12px;
  border-radius: 10px;
  background: #020617;
  color: #e2e8f0;
  font-size: 11px;
  line-height: 1.8;
  font-style: italic;
}

.choice {
  width: 100%;
  border: 1px solid;
  border-radius: 10px;
  padding: 11px;
  text-align: left;
  font-size: 10px;
  font-weight: 800;
}

.pink-choice {
  border-color: #be185d;
  background: rgba(157,23,77,.2);
  color: #fbcfe8;
}

.close-button {
  width: 100%;
  margin-top: 7px;
  padding: 9px;
  border: 1px solid #475569;
  border-radius: 8px;
  background: #1e293b;
  color: #cbd5e1;
  font-size: 10px;
  font-weight: 800;
}

.diary-card {
  border: 4px solid rgba(120,53,15,.6);
  background: #fffbeb;
  color: #451a03;
}

.diary-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #fcd34d;
}

.diary-heading > span {
  font-size: 28px;
}

.diary-heading h2 {
  margin: 0;
  font-size: 14px;
}

.diary-heading small {
  color: #92400e;
  font-size: 9px;
}

.diary-content {
  min-height: 130px;
  max-height: 270px;
  overflow-y: auto;
  margin: 12px 0;
  padding: 13px;
  border: 1px solid #fde68a;
  border-radius: 10px;
  background: #fef3c7;
  color: #451a03;
  font-family: Georgia, serif;
  font-size: 12px;
  line-height: 1.8;
  font-style: italic;
}

.diary-actions {
  padding-top: 9px;
  border-top: 1px solid #fde68a;
}

.primary-button {
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: 9px;
  background: #92400e;
  color: #fef3c7;
  font-size: 10px;
  font-weight: 1000;
}

.ending-card {
  max-width: 600px;
  border: 4px solid #facc15;
  text-align: center;
}

.graduation {
  font-size: 55px;
  margin-bottom: 5px;
}

.pixel-small {
  color: #fbbf24;
  font-family: monospace;
  font-size: 9px;
  letter-spacing: 1px;
}

.ending-card h1 {
  margin: 12px 0 5px;
  color: #fff;
  font-size: 19px;
}

.ending-card h3 {
  margin: 0 0 12px;
  color: #fde047;
  font-size: 11px;
}

.ending-card p {
  margin: 0 0 13px;
  padding: 12px;
  border-radius: 9px;
  background: #020617;
  color: #cbd5e1;
  font-size: 10px;
  line-height: 1.7;
  text-align: left;
}

.ending-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 8px;
  border-radius: 10px;
  background: #1e293b;
}

.ending-grid div {
  padding: 7px;
  color: #94a3b8;
  font-family: monospace;
  font-size: 8px;
}

.ending-grid b {
  display: block;
  margin-top: 4px;
  color: #f8fafc;
  font-size: 11px;
}

.restart-button {
  width: 100%;
  margin-top: 12px;
  padding: 11px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    #f59e0b,
    #facc15
  );
  color: #111827;
  font-size: 11px;
  font-weight: 1000;
}

.save-card h2 {
  margin-top: 0;
  color: #fbbf24;
  font-size: 15px;
}

.save-card p {
  color: #94a3b8;
  font-size: 10px;
  line-height: 1.6;
}

.save-card textarea {
  width: 100%;
  min-height: 150px;
  resize: vertical;
  padding: 10px;
  border: 1px solid #475569;
  border-radius: 9px;
  outline: none;
  background: #020617;
  color: #67e8f9;
  font-family: monospace;
  font-size: 9px;
}

.save-card textarea:focus {
  border-color: #22d3ee;
}

.save-actions {
  display: flex;
  gap: 7px;
  margin-top: 8px;
}

.save-actions .primary-button,
.save-actions .close-button {
  margin: 0;
}

.link-button {
  width: 100%;
  margin-top: 8px;
  border: 0;
  background: transparent;
  color: #38bdf8;
  font-size: 9px;
}

@media (max-width: 720px) {
  .game-page {
    padding: 5px;
  }

  .console {
    border-radius: 18px;
    padding: 7px;
  }

  .screen {
    padding: 8px;
    min-height: 700px;
  }

  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .top-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .stats {
    justify-content: flex-start;
  }

  .stat {
    font-size: 9px;
  }

  .stage {
    min-height: 490px;
  }

  .quiz-options {
    grid-template-columns: 1fr;
  }

  .controller-label {
    display: none;
  }

  .ending-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-bar button span {
    display: none;
  }

  .location-btn {
    flex: 1 1 30%;
  }
}

@media (max-width: 450px) {
  .stats {
    gap: 3px;
  }

  .stat {
    padding: 4px 5px;
  }

  .npc-row {
    gap: 8px;
  }

  .npc > span {
    font-size: 36px;
  }

  .npc small {
    font-size: 8px;
  }

  .class-label {
    font-size: 9px;
  }

  .location-btn {
    font-size: 8px;
  }

  .shop-info b {
    font-size: 9px;
  }

  .shop-info small,
  .shop-info strong {
    font-size: 8px;
  }
}
`;
