import React, { useEffect, useMemo, useRef, useState } from "react";

const SAVE_KEY = "thanh_xuan_ruc_ro_deluxe_v3";

const TIMES = ["07:30", "09:15", "11:30", "14:00", "17:00", "20:30"];

const LOCATION_META = {
  class: { name: "Lớp học", icon: "🏫" },
  canteen: { name: "Căn tin", icon: "🍜" },
  job: { name: "Việc làm", icon: "💼" },
  cert: { name: "Phòng chứng chỉ", icon: "🎓" },
  prop: { name: "Cửa hàng tài sản", icon: "🏠" },
  home: { name: "Nhà", icon: "🏡" }
};

const NPCS = {
  lan: {
    id: "lan",
    name: "Lan",
    avatar: "👧",
    color: "#ff7aa2",
    description: "Bạn thân, chăm chỉ và khá cạnh tranh.",
  },
  trieu_man: {
    id: "trieu_man",
    name: "Triệu Mẫn",
    avatar: "👩",
    color: "#9b7cff",
    description: "Học sinh nổi bật, thông minh và tự tin.",
  },
  tuan: {
    id: "tuan",
    name: "Tuấn",
    avatar: "👦",
    color: "#4ca9ff",
    description: "Bạn cùng lớp, năng động và thích thử thách.",
  }
};

const JOBS = [
  {
    id: "canteen",
    name: "Phụ căn tin",
    icon: "🍜",
    income: 25000,
    energy: -12,
    mood: 3,
    skill: 1,
    description: "Phụ giúp căn tin sau giờ học."
  },
  {
    id: "flyer",
    name: "Phát tờ rơi",
    icon: "📄",
    income: 30000,
    energy: -18,
    mood: -2,
    skill: 2,
    description: "Công việc đơn giản, nhận tiền nhanh."
  },
  {
    id: "excel",
    name: "Nhập dữ liệu Excel",
    icon: "💻",
    income: 70000,
    energy: -18,
    mood: 1,
    skill: 4,
    requirement: 35,
    requirementText: "Kỹ năng ≥ 35",
    description: "Công việc văn phòng bán thời gian."
  },
  {
    id: "driver",
    name: "Lái xe VIP",
    icon: "🚗",
    income: 120000,
    energy: -25,
    mood: 3,
    skill: 3,
    requirementCert: "cert_driver",
    requirementText: "Có bằng lái",
    description: "Công việc có thu nhập cao nhưng yêu cầu chứng chỉ."
  },
  {
    id: "interpreter",
    name: "Trợ lý phiên dịch",
    icon: "🌐",
    income: 200000,
    energy: -25,
    mood: 4,
    skill: 5,
    requirementCert: "cert_toeic",
    requirementText: "Có TOEIC",
    description: "Hỗ trợ phiên dịch cho sự kiện."
  },
  {
    id: "broker",
    name: "Cộng tác viên tài chính",
    icon: "📈",
    income: 300000,
    energy: -28,
    mood: 5,
    skill: 7,
    requirementCert: "cert_finance",
    requirementText: "Có chứng chỉ tài chính",
    description: "Công việc phân tích và hỗ trợ tài chính."
  }
];

const PROPERTIES = [
  {
    id: "asset_bike",
    name: "Xe đạp",
    icon: "🚲",
    price: 1000000,
    effect: "Di chuyển nhanh hơn.",
    reputation: 2
  },
  {
    id: "asset_car_sedan",
    name: "Ô tô Sedan",
    icon: "🚘",
    price: 1650000,
    effect: "Tăng hình ảnh cá nhân.",
    reputation: 6,
    skill: 2
  },
  {
    id: "asset_car_super",
    name: "Siêu xe",
    icon: "🏎️",
    price: 5500000,
    effect: "Tài sản đáng mơ ước.",
    reputation: 12,
    mood: 8
  },
  {
    id: "asset_condo",
    name: "Căn hộ",
    icon: "🏢",
    price: 50000000,
    effect: "Có nơi ở riêng.",
    reputation: 15,
    mood: 10
  },
  {
    id: "asset_villa",
    name: "Biệt thự",
    icon: "🏡",
    price: 120000000,
    effect: "Đẳng cấp tài sản cao nhất.",
    reputation: 25,
    mood: 15
  }
];

const CERTS = {
  cert_driver: {
    id: "cert_driver",
    name: "Bằng lái xe",
    icon: "🚘",
    fee: 100000,
    skill: 140,
    questions: [
      {
        q: "Khi gặp đèn đỏ, người điều khiển xe phải làm gì?",
        options: ["Tăng tốc", "Dừng trước vạch", "Bấm còi", "Đi tiếp"],
        answer: 1
      },
      {
        q: "Biển báo hình tròn viền đỏ thường biểu thị?",
        options: ["Cấm", "Chỉ dẫn", "Nguy hiểm", "Thông tin"],
        answer: 0
      },
      {
        q: "Khi lái xe cần ưu tiên điều gì?",
        options: ["Tốc độ", "An toàn", "Âm nhạc", "Hình thức"],
        answer: 1
      }
    ]
  },

  cert_toeic: {
    id: "cert_toeic",
    name: "TOEIC",
    icon: "🌐",
    fee: 150000,
    skill: 500,
    questions: [
      {
        q: "Choose: She ___ to school every day.",
        options: ["go", "goes", "going", "gone"],
        answer: 1
      },
      {
        q: "Opposite of 'expensive' is:",
        options: ["cheap", "large", "fast", "strong"],
        answer: 0
      },
      {
        q: "I have lived here ___ 2020.",
        options: ["for", "since", "at", "on"],
        answer: 1
      }
    ]
  },

  cert_mos: {
    id: "cert_mos",
    name: "MOS Office",
    icon: "💻",
    fee: 120000,
    skill: 800,
    questions: [
      {
        q: "Phím tắt sao chép trong Windows?",
        options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"],
        answer: 0
      },
      {
        q: "Excel dùng để làm gì?",
        options: ["Tính toán dữ liệu", "Chụp ảnh", "Nghe nhạc", "Vẽ tranh"],
        answer: 0
      },
      {
        q: "Hàm SUM trong Excel dùng để?",
        options: ["Đếm", "Tính tổng", "Tìm chữ", "Đổi màu"],
        answer: 1
      }
    ]
  },

  cert_finance: {
    id: "cert_finance",
    name: "Tài chính cơ bản",
    icon: "📈",
    fee: 200000,
    skill: 1000,
    questions: [
      {
        q: "Lợi nhuận được hiểu đơn giản là?",
        options: [
          "Doanh thu + chi phí",
          "Doanh thu - chi phí",
          "Chi phí - doanh thu",
          "Tài sản + nợ"
        ],
        answer: 1
      },
      {
        q: "Đa dạng hóa danh mục nhằm mục đích gì?",
        options: [
          "Tăng mọi rủi ro",
          "Giảm rủi ro tập trung",
          "Không cần theo dõi",
          "Đảm bảo lợi nhuận"
        ],
        answer: 1
      },
      {
        q: "ROI thường liên quan đến?",
        options: ["Hiệu quả đầu tư", "Thời tiết", "Dân số", "Điểm danh"],
        answer: 0
      }
    ]
  }
};

const CANTEEN_ITEMS = [
  {
    id: "snack",
    name: "Bánh mì",
    icon: "🥪",
    price: 15000,
    energy: 10,
    mood: 2
  },
  {
    id: "meal",
    name: "Cơm phần",
    icon: "🍱",
    price: 30000,
    energy: 22,
    hp: 5,
    mood: 3
  },
  {
    id: "milk",
    name: "Sữa",
    icon: "🥛",
    price: 12000,
    energy: 8,
    hp: 3
  },
  {
    id: "coffee",
    name: "Cà phê",
    icon: "☕",
    price: 18000,
    energy: 18,
    mood: -1
  },
  {
    id: "fruit",
    name: "Trái cây",
    icon: "🍎",
    price: 20000,
    energy: 12,
    hp: 8,
    mood: 4
  }
];

const QUIZ_BANK = [
  {
    id: "m1",
    subject: "Toán",
    q: "Đạo hàm của y = x² là gì?",
    options: ["x", "2x", "x²", "2"],
    answer: 1,
    explain: "Theo quy tắc đạo hàm, (x²)' = 2x."
  },
  {
    id: "m2",
    subject: "Toán",
    q: "Cấp số cộng có công sai d = 3, a₁ = 2. a₄ bằng?",
    options: ["8", "9", "11", "12"],
    answer: 2,
    explain: "a₄ = a₁ + 3d = 2 + 9 = 11."
  },
  {
    id: "m3",
    subject: "Toán",
    q: "Tổng ba số tự nhiên liên tiếp 10, 11, 12 bằng?",
    options: ["31", "32", "33", "34"],
    answer: 2,
    explain: "10 + 11 + 12 = 33."
  },
  {
    id: "l1",
    subject: "Vật lý",
    q: "Đơn vị của công suất là gì?",
    options: ["J", "N", "W", "Pa"],
    answer: 2,
    explain: "Công suất có đơn vị Watt (W)."
  },
  {
    id: "l2",
    subject: "Vật lý",
    q: "Vận tốc được tính bằng?",
    options: ["s/t", "t/s", "s × t", "m × s"],
    answer: 0,
    explain: "v = s/t."
  },
  {
    id: "l3",
    subject: "Vật lý",
    q: "Đơn vị của lực là?",
    options: ["J", "N", "W", "V"],
    answer: 1,
    explain: "Lực được đo bằng Newton (N)."
  },
  {
    id: "h1",
    subject: "Hóa",
    q: "Công thức hóa học của nước là?",
    options: ["CO₂", "H₂O", "O₂", "NaCl"],
    answer: 1,
    explain: "Nước gồm hai nguyên tử H và một nguyên tử O."
  },
  {
    id: "h2",
    subject: "Hóa",
    q: "NaCl thường được gọi là?",
    options: ["Đường", "Muối ăn", "Giấm", "Vôi"],
    answer: 1,
    explain: "NaCl là natri clorua, thành phần chính của muối ăn."
  },
  {
    id: "h3",
    subject: "Hóa",
    q: "pH < 7 thường biểu thị môi trường?",
    options: ["Axit", "Bazơ", "Trung tính", "Kim loại"],
    answer: 0,
    explain: "Dung dịch có pH < 7 có tính axit."
  },
  {
    id: "s1",
    subject: "Sinh",
    q: "Đơn vị cơ bản của sự sống là?",
    options: ["Mô", "Cơ quan", "Tế bào", "Hệ cơ quan"],
    answer: 2,
    explain: "Tế bào là đơn vị cấu trúc và chức năng cơ bản của sự sống."
  },
  {
    id: "s2",
    subject: "Sinh",
    q: "DNA có vai trò chính nào?",
    options: ["Lưu trữ thông tin di truyền", "Tiêu hóa", "Hô hấp", "Vận động"],
    answer: 0,
    explain: "DNA mang và lưu trữ thông tin di truyền."
  },
  {
    id: "s3",
    subject: "Sinh",
    q: "Quang hợp ở thực vật chủ yếu diễn ra tại?",
    options: ["Rễ", "Lục lạp", "Không bào", "Nhân"],
    answer: 1,
    explain: "Quang hợp chủ yếu diễn ra ở lục lạp."
  },
  {
    id: "su1",
    subject: "Lịch sử",
    q: "Cách mạng tháng Tám ở Việt Nam diễn ra vào năm nào?",
    options: ["1930", "1945", "1954", "1975"],
    answer: 1,
    explain: "Cách mạng tháng Tám thành công năm 1945."
  },
  {
    id: "su2",
    subject: "Lịch sử",
    q: "Chiến thắng Điện Biên Phủ diễn ra năm?",
    options: ["1945", "1954", "1968", "1975"],
    answer: 1,
    explain: "Chiến thắng Điện Biên Phủ diễn ra năm 1954."
  },
  {
    id: "su3",
    subject: "Lịch sử",
    q: "Ngày Quốc khánh Việt Nam là?",
    options: ["30/4", "2/9", "19/8", "7/5"],
    answer: 1,
    explain: "Ngày 2/9/1945 là ngày Quốc khánh Việt Nam."
  },
  {
    id: "d1",
    subject: "Địa lý",
    q: "Việt Nam thuộc khu vực nào của châu Á?",
    options: ["Đông Á", "Đông Nam Á", "Nam Á", "Tây Á"],
    answer: 1,
    explain: "Việt Nam thuộc khu vực Đông Nam Á."
  },
  {
    id: "d2",
    subject: "Địa lý",
    q: "Đồng bằng lớn nhất Việt Nam là?",
    options: [
      "Đồng bằng sông Hồng",
      "Đồng bằng sông Cửu Long",
      "Đồng bằng ven biển miền Trung",
      "Cao nguyên"
    ],
    answer: 1,
    explain: "Đồng bằng sông Cửu Long là đồng bằng lớn nhất Việt Nam."
  },
  {
    id: "d3",
    subject: "Địa lý",
    q: "Khí hậu Việt Nam nhìn chung mang tính chất?",
    options: ["Nhiệt đới gió mùa", "Ôn đới", "Hàn đới", "Hoang mạc"],
    answer: 0,
    explain: "Việt Nam có khí hậu nhiệt đới gió mùa."
  },
  {
    id: "a1",
    subject: "Tiếng Anh",
    q: "If I were you, I ___ harder.",
    options: ["study", "studied", "would study", "will study"],
    answer: 2,
    explain: "Câu điều kiện loại 2 dùng would + V."
  },
  {
    id: "a2",
    subject: "Tiếng Anh",
    q: "She ___ English for five years.",
    options: ["learns", "has learned", "learned", "learning"],
    answer: 1,
    explain: "For five years phù hợp với hiện tại hoàn thành."
  },
  {
    id: "a3",
    subject: "Tiếng Anh",
    q: "Opposite of 'difficult' is?",
    options: ["easy", "hard", "slow", "late"],
    answer: 0,
    explain: "Difficult trái nghĩa với easy."
  },
  {
    id: "gd1",
    subject: "GDCD",
    q: "Pháp luật có tính chất nào?",
    options: [
      "Bắt buộc chung",
      "Tự nguyện tuyệt đối",
      "Chỉ dành cho học sinh",
      "Không cần tuân thủ"
    ],
    answer: 0,
    explain: "Pháp luật có tính bắt buộc chung."
  },
  {
    id: "gd2",
    subject: "GDCD",
    q: "Công dân bình đẳng trước pháp luật nghĩa là?",
    options: [
      "Mọi người đều có quyền và nghĩa vụ theo quy định pháp luật",
      "Không cần tuân thủ pháp luật",
      "Chỉ người giàu có quyền",
      "Chỉ cán bộ mới chịu pháp luật"
    ],
    answer: 0,
    explain: "Mọi công dân đều bình đẳng về quyền và nghĩa vụ trước pháp luật."
  },
  {
    id: "gd3",
    subject: "GDCD",
    q: "Hành vi nào thể hiện trách nhiệm?",
    options: [
      "Giữ lời hứa",
      "Đổ lỗi",
      "Trốn tránh",
      "Gian dối"
    ],
    answer: 0,
    explain: "Giữ lời hứa là biểu hiện của trách nhiệm."
  },
  {
    id: "r1",
    subject: "Đố mẹo",
    q: "Cái gì càng lấy đi càng lớn?",
    options: ["Cái hố", "Cái túi", "Cái bàn", "Quả bóng"],
    answer: 0,
    explain: "Càng đào/lấy đất đi thì cái hố càng lớn."
  },
  {
    id: "r2",
    subject: "Đố mẹo",
    q: "Con gì không có chân nhưng vẫn đi khắp nơi?",
    options: ["Con rắn", "Đám mây", "Con mèo", "Con chó"],
    answer: 1,
    explain: "Đám mây có thể trôi đi khắp nơi."
  },
  {
    id: "r3",
    subject: "Đố mẹo",
    q: "Cái gì có cổ nhưng không có đầu?",
    options: ["Cái chai", "Cái bàn", "Cái ghế", "Cái quạt"],
    answer: 0,
    explain: "Chai có cổ chai nhưng không có đầu."
  }
];

const TITLES = [
  {
    id: "first_step",
    icon: "🌱",
    name: "Tân Binh Thanh Xuân",
    desc: "Đạt 100 điểm thi đua.",
    condition: s => s.competitionScore >= 100
  },
  {
    id: "hard_worker",
    icon: "📚",
    name: "Học Sinh Chăm Chỉ",
    desc: "Đạt 700 điểm thi đua.",
    condition: s => s.competitionScore >= 300
  },
  {
    id: "all_rounder",
    icon: "⭐",
    name: "Học Sinh Toàn Diện",
    desc: "Học tập, kỹ năng và bạn bè đều từ 70.",
    condition: s =>
      s.stats.study >= 70 &&
      s.stats.skill >= 70 &&
      s.stats.friends >= 70
  },
  {
    id: "top3",
    icon: "🥉",
    name: "Ngôi Sao Top 3",
    desc: "Có ít nhất một lần lọt Top 3.",
    condition: s => s.titleFlags.includes("top3")
  },
  {
    id: "champion",
    icon: "🥇",
    name: "Quán Quân Thi Đua",
    desc: "Có ít nhất một lần đứng đầu bảng.",
    condition: s => s.titleFlags.includes("champion")
  },
  {
    id: "rich_student",
    icon: "💰",
    name: "Đại Gia Học Đường",
    desc: "Sở hữu từ 1.000.000đ.",
    condition: s => s.stats.money >= 1000000
  },
  {
    id: "skill_master",
    icon: "🧠",
    name: "Bậc Thầy Kỹ Năng",
    desc: "Đạt 90 điểm kỹ năng.",
    condition: s => s.stats.skill >= 90
  },
  {
    id: "love_master",
    icon: "💖",
    name: "Người Được Yêu Mến",
    desc: "Đạt 90 điểm tình cảm.",
    condition: s => s.stats.love >= 90
  },
  {
    id: "scholar",
    icon: "🎓",
    name: "Học Bá Thanh Xuân",
    desc: "Đạt 90 điểm học tập.",
    condition: s => s.stats.study >= 90
  },
  {
    id: "asset_master",
    icon: "🏠",
    name: "Ông Trùm Tài Sản",
    desc: "Sở hữu ít nhất 3 tài sản.",
    condition: s => s.assets.length >= 3
  },
  {
    id: "certificate_master",
    icon: "📜",
    name: "Bộ Sưu Tập Chứng Chỉ",
    desc: "Sở hữu đủ 4 chứng chỉ.",
    condition: s => s.certificates.length >= 4
  },
  {
    id: "graduation_star",
    icon: "🎉",
    name: "Ngôi Sao Thanh Xuân",
    desc: "Hoàn thành hành trình 45 ngày.",
    condition: s => s.isGameOver
  }
];

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number(value) || 0));

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
      money: 50000
    },

    certificates: [],
    assets: [],

    bag: [
      {
        id: "math_note",
        name: "Sổ Công Thức",
        icon: "📘",
        count: 1,
        desc: "+8 Điểm học tập"
      },
      {
        id: "gift_strawberry",
        name: "Kẹo Dâu Tây",
        icon: "🍬",
        count: 2,
        desc: "+8% Tình cảm"
      }
    ],

    todayEvents: [],
    diaryEntries: [],

    competitionScore: 0,

    npcScores: {
      lan: 42,
      trieu_man: 48,
      tuan: 45
    },

    competitionHistory: [],
    currentRank: 4,
    bestRank: 4,
    competitionStreak: 0,

    titleFlags: [],
    unlockedTitles: [],

    lastHomeRestKey: null,

    npcRelationships: {
      lan: 40,
      trieu_man: 20,
      tuan: 35
    }
  };
}

function normalizeState(raw) {
  const base = createInitialState();

  if (!raw || typeof raw !== "object") return base;

  const state = {
    ...base,
    ...raw,
    stats: {
      ...base.stats,
      ...(raw.stats || {})
    },
    npcScores: {
      ...base.npcScores,
      ...(raw.npcScores || {})
    },
    npcRelationships: {
      ...base.npcRelationships,
      ...(raw.npcRelationships || {})
    },
    bag: Array.isArray(raw.bag) ? raw.bag : base.bag,
    certificates: Array.isArray(raw.certificates)
      ? raw.certificates
      : [],
    assets: Array.isArray(raw.assets) ? raw.assets : [],
    diaryEntries: Array.isArray(raw.diaryEntries)
      ? raw.diaryEntries
      : [],
    competitionHistory: Array.isArray(raw.competitionHistory)
      ? raw.competitionHistory
      : [],
    titleFlags: Array.isArray(raw.titleFlags)
      ? raw.titleFlags
      : [],
    unlockedTitles: Array.isArray(raw.unlockedTitles)
      ? raw.unlockedTitles
      : []
  };

  Object.keys(state.stats).forEach(key => {
    if (key === "money") {
      state.stats.money = Math.max(
        0,
        Number(state.stats.money) || 0
      );
    } else {
      state.stats[key] = clamp(state.stats[key]);
    }
  });

  state.day = Math.max(1, Number(state.day) || 1);
  state.timeIndex = Math.min(
    TIMES.length - 1,
    Math.max(0, Number(state.timeIndex) || 0)
  );

  state.competitionScore =
    Math.max(0, Number(state.competitionScore) || 0);

  return state;
}

function encodeSaveCode(data) {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);

  let binary = "";
  const chunk = 0x8000;

  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + chunk)
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

  return JSON.parse(
    new TextDecoder().decode(bytes)
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN").format(
    Math.round(value || 0)
  ) + "đ";
}

function getPlayerDailyScore(state) {
  let score = 0;

  score += Math.floor(state.stats.study / 10);
  score += Math.floor(state.stats.skill / 15);
  score += Math.floor(state.stats.friends / 20);
  score += Math.floor(state.stats.love / 25);
  score += Math.floor(state.stats.reputation / 15);

  if (state.stats.mood >= 70) score += 3;
  if (state.stats.energy >= 70) score += 2;

  score += state.certificates.length * 5;
  score += state.assets.length * 3;

  return Math.max(5, score);
}

function calculateCompetition(state, dailyScore) {
  const npcGain = {
    lan: Math.floor(Math.random() * 9) + 5,
    trieu_man: Math.floor(Math.random() * 11) + 6,
    tuan: Math.floor(Math.random() * 10) + 5
  };

  const playerTotal =
    state.competitionScore + dailyScore;

  const npcScores = {
    lan: state.npcScores.lan + npcGain.lan,
    trieu_man:
      state.npcScores.trieu_man +
      npcGain.trieu_man,
    tuan:
      state.npcScores.tuan +
      npcGain.tuan
  };

  const ranking = [
    {
      id: "player",
      name: "Bạn",
      score: playerTotal
    },
    {
      id: "lan",
      name: "Lan",
      score: npcScores.lan
    },
    {
      id: "trieu_man",
      name: "Triệu Mẫn",
      score: npcScores.trieu_man
    },
    {
      id: "tuan",
      name: "Tuấn",
      score: npcScores.tuan
    }
  ].sort((a, b) => b.score - a.score);

  const rank =
    ranking.findIndex(
      item => item.id === "player"
    ) + 1;

  const flags = [
    ...(state.titleFlags || [])
  ];

  if (rank <= 3 && !flags.includes("top3")) {
    flags.push("top3");
  }

  if (rank === 1 && !flags.includes("champion")) {
    flags.push("champion");
  }

  let streak = state.competitionStreak || 0;

  if (rank < (state.currentRank || 4)) {
    streak += 1;
  } else if (rank > (state.currentRank || 4)) {
    streak = 0;
  }

  return {
    npcScores,
    competitionScore: playerTotal,
    currentRank: rank,
    bestRank: Math.min(
      state.bestRank || 99,
      rank
    ),
    competitionStreak: streak,
    titleFlags: flags,
    npcGain,
    dailyScore,
    history: {
      day: state.day,
      playerGain: dailyScore,
      playerTotal,
      lanGain: npcGain.lan,
      lanTotal: npcScores.lan,
      trieuManGain: npcGain.trieu_man,
      trieuManTotal: npcScores.trieu_man,
      tuanGain: npcGain.tuan,
      tuanTotal: npcScores.tuan,
      rank
    }
  };
}

function App() {
  const [game, setGame] = useState(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);

      if (saved) {
        return normalizeState(
          JSON.parse(saved)
        );
      }
    } catch {}

    return createInitialState();
  });

  const [overlay, setOverlay] = useState(null);
  const [toast, setToast] = useState("");
  const [audioEnabled, setAudioEnabled] =
    useState(true);

  const [quiz, setQuiz] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  const [certExam, setCertExam] = useState(null);
  const [certIndex, setCertIndex] = useState(0);
  const [certScore, setCertScore] = useState(0);

  const [saveCode, setSaveCode] = useState("");
  const [saveCodeInput, setSaveCodeInput] =
    useState("");

  const [drawer, setDrawer] = useState(null);

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
      );
    } catch {}
  }, [game]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(""),
      2500
    );

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setGame(prev => {
      const unlocked = [
        ...(prev.unlockedTitles || [])
      ];

      let changed = false;

      TITLES.forEach(title => {
        let passed = false;

        try {
          passed = title.condition(prev);
        } catch {}

        if (
          passed &&
          !unlocked.includes(title.id)
        ) {
          unlocked.push(title.id);
          changed = true;
        }
      });

      if (!changed) return prev;

      return {
        ...prev,
        unlockedTitles: unlocked
      };
    });
  }, [
    game.competitionScore,
    game.stats.study,
    game.stats.skill,
    game.stats.friends,
    game.stats.love,
    game.stats.money,
    game.stats.reputation,
    game.certificates.length,
    game.assets.length,
    game.isGameOver,
    game.titleFlags
  ]);

  const ranking = useMemo(() => {
    return [
      {
        id: "player",
        name: "Bạn",
        avatar: "🧑‍🎓",
        score: game.competitionScore
      },
      {
        id: "lan",
        name: "Lan",
        avatar: NPCS.lan.avatar,
        score: game.npcScores.lan
      },
      {
        id: "trieu_man",
        name: "Triệu Mẫn",
        avatar: NPCS.trieu_man.avatar,
        score: game.npcScores.trieu_man
      },
      {
        id: "tuan",
        name: "Tuấn",
        avatar: NPCS.tuan.avatar,
        score: game.npcScores.tuan
      }
    ]
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }, [game]);

  const playTone = (
    frequency = 440,
    duration = 0.08,
    type = "square"
  ) => {
    if (!audioEnabled) return;

    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      const ctx =
        audioRef.current ||
        new AudioContext();

      audioRef.current = ctx;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const oscillator =
        ctx.createOscillator();

      const gain =
        ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.value =
        frequency;

      gain.gain.setValueAtTime(
        0.035,
        ctx.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();

      oscillator.stop(
        ctx.currentTime + duration
      );
    } catch {}
  };

  const modifyStats = delta => {
    setGame(prev => {
      const stats = {
        ...prev.stats
      };

      Object.entries(delta).forEach(
        ([key, value]) => {
          if (key === "money") {
            stats.money = Math.max(
              0,
              stats.money + value
            );
          } else {
            stats[key] = clamp(
              stats[key] + value
            );
          }
        }
      );

      return {
        ...prev,
        stats
      };
    });
  };

  const showToast = message => {
    setToast(message);
  };

  const advanceTime = () => {
    playTone(660, 0.06);

    setGame(prev => {
      if (prev.isGameOver) return prev;

      if (
        prev.timeIndex <
        TIMES.length - 1
      ) {
        return {
          ...prev,
          timeIndex:
            prev.timeIndex + 1
        };
      }

      const dailyScore =
        getPlayerDailyScore(prev);

      const competition =
        calculateCompetition(
          prev,
          dailyScore
        );

      const nextHistory = [
        ...(prev.competitionHistory || []),
        competition.history
      ];

      const newDiary = [
        ...(prev.diaryEntries || []),
        {
          day: prev.day,
          text:
            `Ngày ${prev.day}: ` +
            `Bạn nhận +${dailyScore} điểm thi đua. ` +
            `Kết thúc ngày ở hạng #${competition.currentRank}.`
        }
      ];

      const next = {
        ...prev,

        ...competition,

        competitionHistory:
          nextHistory,

        diaryEntries: newDiary,

        lastHomeRestKey: null
      };

      if (
        prev.day >= prev.totalDays
      ) {
        return {
          ...next,
          isGameOver: true
        };
      }

      return {
        ...next,
        day: prev.day + 1,
        timeIndex: 0,
        location: "class",
        todayEvents: []
      };
    });

    setOverlay(null);
  };

  const goLocation = location => {
    playTone(500, 0.05);

    if (location === "class") {
      setGame(prev => ({
        ...prev,
        location: "class"
      }));
    } else {
      setGame(prev => ({
        ...prev,
        location
      }));
    }

    setOverlay(null);
    setDrawer(null);
  };

  const restAtHome = () => {
    const restKey =
      `${game.day}-${game.timeIndex}`;

    if (game.lastHomeRestKey === restKey) {
      showToast(
        "Bạn đã nghỉ ở nhà trong khung giờ này rồi."
      );
      return;
    }

    modifyStats({
      energy: 25,
      mood: 4,
      hp: 4
    });

    setGame(prev => ({
      ...prev,
      lastHomeRestKey: restKey
    }));

    showToast(
      "🏡 Bạn nghỉ ngơi và hồi phục năng lượng."
    );

    advanceTime();
  };

  const studyAction = () => {
    if (game.stats.energy < 8) {
      showToast(
        "⚡ Không đủ năng lượng để học."
      );
      return;
    }

    modifyStats({
      energy: -10,
      study: 5,
      skill: 2,
      mood: 1
    });

    showToast(
      "📚 Học tập hiệu quả! +5 học tập."
    );

    advanceTime();
  };

  const startQuiz = () => {
    const shuffled = [...QUIZ_BANK]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    setQuiz(shuffled);
    setQuizIndex(0);
    setQuizScore(0);
    setOverlay("quiz");
  };

  const answerQuiz = index => {
    if (!quiz) return;

    const current =
      quiz[quizIndex];

    const correct =
      index === current.answer;

    if (correct) {
      setQuizScore(
        score => score + 1
      );

      modifyStats({
        study: 5,
        skill: 1,
        mood: 1
      });

      showToast(
        `✅ Chính xác! ${current.explain}`
      );
    } else {
      modifyStats({
        study: 1,
        mood: -3
      });

      showToast(
        `❌ Chưa đúng. ${current.explain}`
      );
    }

    if (
      quizIndex >= quiz.length - 1
    ) {
      const finalScore =
        quizScore + (correct ? 1 : 0);

      setTimeout(() => {
        setQuiz(null);
        setOverlay(null);

        showToast(
          `📝 Hoàn thành quiz: ${finalScore}/${quiz.length}`
        );

        advanceTime();
      }, 650);

      return;
    }

    setQuizIndex(
      index => index + 1
    );
  };

  const buyFood = item => {
    if (game.stats.money < item.price) {
      showToast("💸 Bạn không đủ tiền.");
      return;
    }

    setGame(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        money:
          prev.stats.money - item.price,
        energy: clamp(
          prev.stats.energy +
            (item.energy || 0)
        ),
        hp: clamp(
          prev.stats.hp +
            (item.hp || 0)
        ),
        mood: clamp(
          prev.stats.mood +
            (item.mood || 0)
        )
      }
    }));

    showToast(
      `${item.icon} Đã mua ${item.name}.`
    );
  };

  const workJob = job => {
    if (
      job.requirement &&
      game.stats.skill < job.requirement
    ) {
      showToast(
        `🔒 Cần kỹ năng ≥ ${job.requirement}.`
      );
      return;
    }

    if (
      job.requirementCert &&
      !game.certificates.includes(
        job.requirementCert
      )
    ) {
      showToast(
        `🔒 ${job.requirementText}.`
      );
      return;
    }

    if (game.stats.energy < Math.abs(job.energy)) {
      showToast(
        "⚡ Không đủ năng lượng."
      );
      return;
    }

    setGame(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        money:
          prev.stats.money + job.income,
        energy: clamp(
          prev.stats.energy + job.energy
        ),
        mood: clamp(
          prev.stats.mood + job.mood
        ),
        skill: clamp(
          prev.stats.skill + job.skill
        ),
        reputation: clamp(
          prev.stats.reputation +
            (job.income >= 180000 ? 2 : 1)
        )
      }
    }));

    showToast(
      `💼 Làm việc xong! +${formatMoney(
        job.income
      )}`
    );

    advanceTime();
  };

  const buyProperty = property => {
    if (
      game.assets.includes(property.id)
    ) {
      showToast(
        "🏠 Bạn đã sở hữu tài sản này."
      );
      return;
    }

    if (
      game.stats.money < property.price
    ) {
      showToast(
        "💸 Không đủ tiền mua tài sản."
      );
      return;
    }

    setGame(prev => ({
      ...prev,
      assets: [
        ...prev.assets,
        property.id
      ],
      stats: {
        ...prev.stats,
        money:
          prev.stats.money -
          property.price,
        reputation: clamp(
          prev.stats.reputation +
            (property.reputation || 0)
        ),
        skill: clamp(
          prev.stats.skill +
            (property.skill || 0)
        ),
        mood: clamp(
          prev.stats.mood +
            (property.mood || 0)
        )
      }
    }));

    showToast(
      `🏠 Đã mua ${property.name}!`
    );
  };

  const startCertificateExam = cert => {
    if (
      game.certificates.includes(cert.id)
    ) {
      showToast(
        "🎓 Bạn đã có chứng chỉ này."
      );
      return;
    }

    if (game.stats.skill < cert.skill) {
      showToast(
        `🔒 Cần kỹ năng ≥ ${cert.skill}.`
      );
      return;
    }

    if (game.stats.money < cert.fee) {
      showToast(
        "💸 Không đủ lệ phí thi."
      );
      return;
    }

    setGame(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        money:
          prev.stats.money - cert.fee
      }
    }));

    setCertExam(cert);
    setCertIndex(0);
    setCertScore(0);
    setOverlay("certExam");
  };

  const answerCertificate = index => {
    if (!certExam) return;

    const question =
      certExam.questions[certIndex];

    const correct =
      index === question.answer;

    const nextScore =
      certScore + (correct ? 1 : 0);

    if (correct) {
      showToast("✅ Đúng!");
      setCertScore(nextScore);
    } else {
      showToast("❌ Chưa đúng!");
    }

    if (
      certIndex >=
      certExam.questions.length - 1
    ) {
      setTimeout(() => {
        const passed =
          nextScore >= 2;

        if (passed) {
          setGame(prev => ({
            ...prev,
            certificates: [
              ...prev.certificates,
              certExam.id
            ],
            stats: {
              ...prev.stats,
              skill: clamp(
                prev.stats.skill + 5
              ),
              reputation: clamp(
                prev.stats.reputation + 5
              )
            }
          }));

          showToast(
            `🎓 Đậu chứng chỉ ${certExam.name}!`
          );
        } else {
          showToast(
            `📄 Chưa đạt. Cần ít nhất 2/3 câu đúng.`
          );
        }

        setCertExam(null);
        setOverlay(null);
        advanceTime();
      }, 500);

      return;
    }

    setCertIndex(
      value => value + 1
    );
  };

  const interactNPC = id => {
    const npc = NPCS[id];

    if (!npc) return;

    if (id === "lan") {
      setGame(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          friends: clamp(
            prev.stats.friends + 6
          ),
          mood: clamp(
            prev.stats.mood + 4
          )
        },
        npcRelationships: {
          ...prev.npcRelationships,
          lan: clamp(
            prev.npcRelationships.lan + 5
          )
        }
      }));

      showToast(
        "👧 Lan vui vẻ nói chuyện với bạn. +6 bạn bè."
      );
    }

    if (id === "trieu_man") {
      setGame(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          love: clamp(
            prev.stats.love + 5
          ),
          friends: clamp(
            prev.stats.friends + 2
          ),
          mood: clamp(
            prev.stats.mood + 5
          )
        },
        npcRelationships: {
          ...prev.npcRelationships,
          trieu_man: clamp(
            prev.npcRelationships.trieu_man + 6
          )
        }
      }));

      showToast(
        "💖 Triệu Mẫn có vẻ rất vui khi gặp bạn."
      );
    }

    if (id === "tuan") {
      setGame(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          skill: clamp(
            prev.stats.skill + 3
          ),
          reputation: clamp(
            prev.stats.reputation + 3
          ),
          friends: clamp(
            prev.stats.friends + 3
          )
        },
        npcRelationships: {
          ...prev.npcRelationships,
          tuan: clamp(
            prev.npcRelationships.tuan + 5
          )
        }
      }));

      showToast(
        "👦 Tuấn rủ bạn cùng luyện kỹ năng."
      );
    }
  };

  const useBagItem = id => {
    const item =
      game.bag.find(
        x => x.id === id
      );

    if (
      !item ||
      item.count <= 0
    ) {
      showToast(
        "🎒 Không còn vật phẩm."
      );
      return;
    }

    setGame(prev => {
      const bag =
        prev.bag.map(item => {
          if (item.id !== id) return item;

          return {
            ...item,
            count: Math.max(
              0,
              item.count - 1
            )
          };
        });

      const stats = {
        ...prev.stats
      };

      if (id === "math_note") {
        stats.study = clamp(
          stats.study + 8
        );
      }

      if (
        id === "gift_strawberry"
      ) {
        stats.love = clamp(
          stats.love + 8
        );
      }

      return {
        ...prev,
        bag,
        stats
      };
    });

    showToast(
      `🎒 Đã sử dụng ${item.name}.`
    );
  };

  const saveNow = () => {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
      );

      showToast(
        "💾 Đã lưu game."
      );

      playTone(880, 0.08);
    } catch {
      showToast(
        "❌ Không thể lưu game."
      );
    }
  };

  const generateSaveCode = () => {
    try {
      const code =
        encodeSaveCode(game);

      setSaveCode(code);
      setSaveCodeInput(code);
      setOverlay("saveCode");

      playTone(880, 0.08);
    } catch {
      showToast(
        "❌ Không tạo được mã lưu."
      );
    }
  };

  const importSaveCode = () => {
    try {
      if (!saveCodeInput.trim()) {
        showToast(
          "⚠️ Hãy nhập mã lưu."
        );
        return;
      }

      const decoded =
        decodeSaveCode(
          saveCodeInput
        );

      const normalized =
        normalizeState(decoded);

      setGame(normalized);

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(normalized)
      );

      setOverlay(null);

      showToast(
        "✅ Đã tải game từ mã lưu."
      );

      playTone(880, 0.1);
    } catch {
      showToast(
        "❌ Mã lưu không hợp lệ hoặc đã bị hỏng."
      );
    }
  };

  const copySaveCode = async () => {
    try {
      await navigator.clipboard.writeText(
        saveCode
      );

      showToast(
        "📋 Đã sao chép mã lưu."
      );
    } catch {
      showToast(
        "Không thể tự sao chép. Hãy bôi đen và copy mã."
      );
    }
  };

  const exportSave = () => {
    try {
      const blob = new Blob(
        [
          JSON.stringify(
            game,
            null,
            2
          )
        ],
        {
          type: "application/json"
        }
      );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;
      a.download =
        "thanh-xuan-ruc-ro-save.json";

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      showToast(
        "📦 Đã xuất file save."
      );
    } catch {
      showToast(
        "❌ Không thể xuất file."
      );
    }
  };

  const importSaveFile = event => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = e => {
      try {
        const parsed =
          JSON.parse(
            e.target.result
          );

        const normalized =
          normalizeState(parsed);

        setGame(normalized);

        localStorage.setItem(
          SAVE_KEY,
          JSON.stringify(normalized)
        );

        showToast(
          "✅ Đã tải file save."
        );
      } catch {
        showToast(
          "❌ File save không hợp lệ."
        );
      }

      event.target.value = "";
    };

    reader.readAsText(file);
  };

  const restartGame = () => {
    const ok =
      window.confirm(
        "Bạn có chắc muốn bắt đầu lại từ đầu?"
      );

    if (!ok) return;

    const fresh =
      createInitialState();

    setGame(fresh);
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(fresh)
    );

    setOverlay(null);
    setDrawer(null);

    showToast(
      "🔄 Đã bắt đầu lại hành trình."
    );
  };

  const handleA = () => {
    playTone(760, 0.06);

    if (game.location === "class") {
      startQuiz();
      return;
    }

    if (game.location === "home") {
      restAtHome();
      return;
    }

    setOverlay("competition");
  };

  const handleB = () => {
    playTone(380, 0.06);
    setDrawer("bag");
  };

  const navLeft = () => {
    const locations =
      Object.keys(
        LOCATION_META
      );

    const current =
      locations.indexOf(
        game.location
      );

    const next =
      current <= 0
        ? locations.length - 1
        : current - 1;

    goLocation(
      locations[next]
    );
  };

  const navRight = () => {
    const locations =
      Object.keys(
        LOCATION_META
      );

    const current =
      locations.indexOf(
        game.location
      );

    const next =
      current >= locations.length - 1
        ? 0
        : current + 1;

    goLocation(
      locations[next]
    );
  };

  const renderLocation = () => {
    if (game.location === "class") {
      return (
        <div className="location-panel">
          <div className="pixel-scene class-scene">
            <div className="scene-cloud">☁️</div>
            <div className="scene-school">🏫</div>
            <div className="scene-student">🧑‍🎓</div>
          </div>

          <div className="location-content">
            <h2>🏫 Lớp học</h2>

            <p>
              Một ngày học mới bắt đầu.
              Hãy học tập, giao lưu và tích
              lũy điểm thi đua.
            </p>

            <div className="action-grid">
              <button
                className="primary-btn"
                onClick={startQuiz}
              >
                📝 Làm quiz
              </button>

              <button
                className="secondary-btn"
                onClick={studyAction}
              >
                📚 Tự học
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  setOverlay("npc")
                }
              >
                👥 Gặp bạn bè
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (game.location === "canteen") {
      return (
        <div className="location-panel">
          <div className="pixel-scene canteen-scene">
            <div className="scene-food">🍜🥪🥛</div>
            <div className="scene-student">🧑‍🎓</div>
          </div>

          <div className="location-content">
            <h2>🍜 Căn tin</h2>

            <p>
              Ăn uống để hồi phục năng lượng.
            </p>

            <div className="shop-grid">
              {CANTEEN_ITEMS.map(item => (
                <div
                  className="shop-card"
                  key={item.id}
                >
                  <div className="shop-icon">
                    {item.icon}
                  </div>

                  <strong>
                    {item.name}
                  </strong>

                  <small>
                    {formatMoney(item.price)}
                  </small>

                  <button
                    onClick={() =>
                      buyFood(item)
                    }
                  >
                    Mua
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (game.location === "job") {
      return (
        <div className="location-panel">
          <div className="location-content">
            <h2>💼 Việc làm</h2>

            <p>
              Kiếm tiền và tăng kỹ năng.
              Mỗi công việc sẽ tiêu hao
              năng lượng.
            </p>

            <div className="job-list">
              {JOBS.map(job => {
                const locked =
                  (
                    job.requirement &&
                    game.stats.skill <
                      job.requirement
                  ) ||
                  (
                    job.requirementCert &&
                    !game.certificates.includes(
                      job.requirementCert
                    )
                  );

                return (
                  <div
                    className="job-card"
                    key={job.id}
                  >
                    <div className="job-icon">
                      {job.icon}
                    </div>

                    <div className="job-main">
                      <strong>
                        {job.name}
                      </strong>

                      <p>
                        {job.description}
                      </p>

                      <span>
                        💰 {formatMoney(job.income)}
                        {" • "}
                        ⚡ {Math.abs(job.energy)}
                      </span>

                      {job.requirementText && (
                        <small>
                          🔒 {job.requirementText}
                        </small>
                      )}
                    </div>

                    <button
                      disabled={locked}
                      onClick={() =>
                        workJob(job)
                      }
                    >
                      {locked
                        ? "🔒"
                        : "Làm"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (game.location === "cert") {
      return (
        <div className="location-panel">
          <div className="location-content">
            <h2>🎓 Phòng chứng chỉ</h2>

            <p>
              Học đủ kỹ năng rồi thi chứng
              chỉ để mở khóa công việc mới.
            </p>

            <div className="cert-grid">
              {Object.values(CERTS).map(cert => {
                const owned =
                  game.certificates.includes(
                    cert.id
                  );

                return (
                  <div
                    className={
                      `cert-card ${
                        owned
                          ? "owned"
                          : ""
                      }`
                    }
                    key={cert.id}
                  >
                    <div className="cert-icon">
                      {cert.icon}
                    </div>

                    <strong>
                      {cert.name}
                    </strong>

                    <p>
                      Kỹ năng: {cert.skill}
                    </p>

                    <p>
                      Lệ phí:{" "}
                      {formatMoney(cert.fee)}
                    </p>

                    <button
                      disabled={owned}
                      onClick={() =>
                        startCertificateExam(
                          cert
                        )
                      }
                    >
                      {owned
                        ? "✓ Đã có"
                        : "Thi ngay"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (game.location === "prop") {
      return (
        <div className="location-panel">
          <div className="location-content">
            <h2>🏠 Cửa hàng tài sản</h2>

            <p>
              Dùng tiền kiếm được để xây dựng
              tài sản cá nhân.
            </p>

            <div className="property-grid">
              {PROPERTIES.map(property => {
                const owned =
                  game.assets.includes(
                    property.id
                  );

                return (
                  <div
                    className={
                      `property-card ${
                        owned
                          ? "owned"
                          : ""
                      }`
                    }
                    key={property.id}
                  >
                    <div className="property-icon">
                      {property.icon}
                    </div>

                    <strong>
                      {property.name}
                    </strong>

                    <p>
                      {property.effect}
                    </p>

                    <b>
                      {formatMoney(
                        property.price
                      )}
                    </b>

                    <button
                      disabled={owned}
                      onClick={() =>
                        buyProperty(
                          property
                        )
                      }
                    >
                      {owned
                        ? "✓ Đã sở hữu"
                        : "Mua"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (game.location === "home") {
      return (
        <div className="location-panel">
          <div className="pixel-scene home-scene">
            <div>🏡</div>
            <div className="scene-bed">
              🛏️
            </div>
          </div>

          <div className="location-content">
            <h2>🏡 Nhà</h2>

            <p>
              Nghỉ ngơi để hồi phục năng lượng.
              Mỗi khung giờ chỉ nhận thưởng
              nghỉ một lần.
            </p>

            <button
              className="primary-btn large"
              onClick={restAtHome}
            >
              😴 Nghỉ ngơi +25 năng lượng
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="app">
        <header className="topbar">
          <div>
            <div className="brand">
              ✨ Thanh Xuân Rực Rỡ
            </div>

            <div className="subtitle">
              Deluxe Career & Assets Edition
            </div>
          </div>

          <div className="top-actions">
            <button
              onClick={() =>
                setAudioEnabled(
                  value => !value
                )
              }
              title="Âm thanh"
            >
              {audioEnabled
                ? "🔊"
                : "🔇"}
            </button>

            <button
              onClick={saveNow}
              title="Lưu"
            >
              💾
            </button>

            <button
              onClick={generateSaveCode}
              title="Mã lưu"
            >
              🔐
            </button>

            <button
              onClick={() =>
                setOverlay("settings")
              }
              title="Cài đặt"
            >
              ⚙️
            </button>
          </div>
        </header>

        <main className="game-shell">
          <section className="hud">
            <div className="day-card">
              <span>NGÀY</span>
              <strong>
                {game.day}/{game.totalDays}
              </strong>
            </div>

            <div className="time-card">
              <span>THỜI GIAN</span>
              <strong>
                {TIMES[game.timeIndex]}
              </strong>
            </div>

            <div className="money-card">
              <span>TIỀN</span>
              <strong>
                💰{" "}
                {formatMoney(
                  game.stats.money
                )}
              </strong>
            </div>

            <div className="rank-card">
              <span>THI ĐUA</span>
              <strong>
                #{game.currentRank}
                {" "}
                •{" "}
                {game.competitionScore}
              </strong>
            </div>
          </section>

          <section className="stats">
            <Stat
              icon="❤️"
              name="HP"
              value={game.stats.hp}
            />

            <Stat
              icon="⚡"
              name="Năng lượng"
              value={game.stats.energy}
            />

            <Stat
              icon="😊"
              name="Tâm trạng"
              value={game.stats.mood}
            />

            <Stat
              icon="📚"
              name="Học tập"
              value={game.stats.study}
            />

            <Stat
              icon="💖"
              name="Tình cảm"
              value={game.stats.love}
            />

            <Stat
              icon="🧠"
              name="Kỹ năng"
              value={game.stats.skill}
            />
          </section>

          <section className="location-tabs">
            {Object.entries(
              LOCATION_META
            ).map(([id, info]) => (
              <button
                key={id}
                className={
                  game.location === id
                    ? "active"
                    : ""
                }
                onClick={() =>
                  goLocation(id)
                }
              >
                <span>
                  {info.icon}
                </span>

                <small>
                  {info.name}
                </small>
              </button>
            ))}
          </section>

          <section className="main-panel">
            {renderLocation()}
          </section>

          <section className="npc-strip">
            {Object.values(NPCS).map(npc => (
              <button
                className="npc-mini"
                key={npc.id}
                onClick={() =>
                  interactNPC(npc.id)
                }
              >
                <span className="npc-avatar">
                  {npc.avatar}
                </span>

                <span>
                  <b>{npc.name}</b>
                  <small>
                    ❤️{" "}
                    {
                      game.npcRelationships[
                        npc.id
                      ]
                    }
                  </small>
                </span>
              </button>
            ))}
          </section>

          <section className="bottom-actions">
            <button
              onClick={() =>
                setDrawer("profile")
              }
            >
              👤
              <span>Hồ sơ</span>
            </button>

            <button
              onClick={() =>
                setOverlay("competition")
              }
            >
              🏆
              <span>Thi đua</span>
            </button>

            <button
              onClick={() =>
                setOverlay("titles")
              }
            >
              🎖️
              <span>Danh hiệu</span>
            </button>

            <button
              onClick={() =>
                setDrawer("assets")
              }
            >
              🏠
              <span>Tài sản</span>
            </button>

            <button
              onClick={() =>
                setDrawer("bag")
              }
            >
              🎒
              <span>Túi đồ</span>
            </button>

            <button
              onClick={() =>
                setDrawer("diary")
              }
            >
              📖
              <span>Nhật ký</span>
            </button>
          </section>

          <section className="controller">
            <div className="dpad">
              <button
                onClick={navLeft}
              >
                ◀
              </button>

              <button
                onClick={navRight}
              >
                ▶
              </button>
            </div>

            <div className="controller-info">
              <span>
                {LOCATION_META[
                  game.location
                ]?.icon}
              </span>

              <b>
                {LOCATION_META[
                  game.location
                ]?.name}
              </b>
            </div>

            <div className="ab-buttons">
              <button
                className="btn-b"
                onClick={handleB}
              >
                B
              </button>

              <button
                className="btn-a"
                onClick={handleA}
              >
                A
              </button>
            </div>
          </section>

          <section className="advance-row">
            <button
              className="next-time"
              onClick={advanceTime}
            >
              ⏩ Kết thúc hoạt động
              <span>
                Sang{" "}
                {game.timeIndex <
                TIMES.length - 1
                  ? TIMES[
                      game.timeIndex + 1
                    ]
                  : "ngày mới"}
              </span>
            </button>
          </section>
        </main>

        {toast && (
          <div className="toast">
            {toast}
          </div>
        )}

        {drawer === "profile" && (
          <Drawer
            title="👤 Hồ sơ nhân vật"
            onClose={() =>
              setDrawer(null)
            }
          >
            <div className="profile-avatar">
              🧑‍🎓
            </div>

            <h3>
              Học sinh Thanh Xuân
            </h3>

            <div className="profile-grid">
              <MiniStat
                name="Học tập"
                value={game.stats.study}
              />
              <MiniStat
                name="Kỹ năng"
                value={game.stats.skill}
              />
              <MiniStat
                name="Bạn bè"
                value={game.stats.friends}
              />
              <MiniStat
                name="Tình cảm"
                value={game.stats.love}
              />
              <MiniStat
                name="Danh tiếng"
                value={game.stats.reputation}
              />
              <MiniStat
                name="Thi đua"
                value={game.competitionScore}
              />
            </div>

            <div className="profile-section">
              <b>🏅 Thành tích tốt nhất</b>
              <p>
                Hạng cao nhất: #
                {game.bestRank}
              </p>
            </div>

            <div className="profile-section">
              <b>🔥 Chuỗi thi đua</b>
              <p>
                {game.competitionStreak} ngày
              </p>
            </div>
          </Drawer>
        )}

        {drawer === "assets" && (
          <Drawer
            title="🏠 Tài sản"
            onClose={() =>
              setDrawer(null)
            }
          >
            {game.assets.length === 0 ? (
              <Empty text="Bạn chưa sở hữu tài sản nào." />
            ) : (
              <div className="drawer-list">
                {game.assets.map(id => {
                  const asset =
                    PROPERTIES.find(
                      x => x.id === id
                    );

                  if (!asset) return null;

                  return (
                    <div
                      className="drawer-item"
                      key={id}
                    >
                      <span>
                        {asset.icon}
                      </span>

                      <div>
                        <b>
                          {asset.name}
                        </b>
                        <small>
                          {asset.effect}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Drawer>
        )}

        {drawer === "bag" && (
          <Drawer
            title="🎒 Túi đồ"
            onClose={() =>
              setDrawer(null)
            }
          >
            <div className="drawer-list">
              {game.bag.map(item => (
                <div
                  className="drawer-item"
                  key={item.id}
                >
                  <span>
                    {item.icon}
                  </span>

                  <div>
                    <b>
                      {item.name}
                      {" "}
                      ×{item.count}
                    </b>

                    <small>
                      {item.desc}
                    </small>
                  </div>

                  <button
                    disabled={
                      item.count <= 0
                    }
                    onClick={() =>
                      useBagItem(item.id)
                    }
                  >
                    Dùng
                  </button>
                </div>
              ))}
            </div>
          </Drawer>
        )}

        {drawer === "diary" && (
          <Drawer
            title="📖 Nhật ký thanh xuân"
            onClose={() =>
              setDrawer(null)
            }
          >
            {game.diaryEntries.length === 0 ? (
              <Empty text="Hành trình của bạn chưa có trang nhật ký nào." />
            ) : (
              <div className="diary-list">
                {[...game.diaryEntries]
                  .reverse()
                  .map((entry, index) => (
                    <div
                      className="diary-entry"
                      key={`${entry.day}-${index}`}
                    >
                      <b>
                        Ngày {entry.day}
                      </b>

                      <p>
                        {entry.text}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </Drawer>
        )}

        {overlay === "npc" && (
          <Modal
            title="👥 Bạn bè"
            onClose={() =>
              setOverlay(null)
            }
          >
            <div className="npc-grid">
              {Object.values(NPCS).map(npc => (
                <div
                  className="npc-card"
                  key={npc.id}
                >
                  <div className="big-avatar">
                    {npc.avatar}
                  </div>

                  <h3>{npc.name}</h3>

                  <p>
                    {npc.description}
                  </p>

                  <div>
                    ❤️ Quan hệ:{" "}
                    {
                      game.npcRelationships[
                        npc.id
                      ]
                    }
                  </div>

                  <button
                    onClick={() =>
                      interactNPC(npc.id)
                    }
                  >
                    💬 Nói chuyện
                  </button>

                  {npc.id ===
                    "trieu_man" && (
                    <button
                      className="secondary-btn"
                      onClick={() =>
                        setOverlay("crush")
                      }
                    >
                      💖 Tâm sự
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Modal>
        )}

        {overlay === "crush" && (
          <Modal
            title="💖 Cuộc trò chuyện"
            onClose={() =>
              setOverlay(null)
            }
          >
            <div className="dialogue">
              <div className="dialogue-avatar">
                👩
              </div>

              <div className="speech">
                <b>
                  Triệu Mẫn
                </b>

                <p>
                  "Nếu sau này chúng ta tốt
                  nghiệp, cậu muốn nhớ nhất
                  điều gì về những năm tháng
                  này?"
                </p>
              </div>
            </div>

            <div className="dialogue-options">
              <button
                onClick={() => {
                  modifyStats({
                    love: 8,
                    mood: 5
                  });

                  setOverlay(null);

                  showToast(
                    "💖 Bạn chọn lưu giữ những kỷ niệm đẹp."
                  );
                }}
              >
                🌸 Những kỷ niệm
              </button>

              <button
                onClick={() => {
                  modifyStats({
                    love: 5,
                    skill: 2
                  });

                  setOverlay(null);

                  showToast(
                    "✨ Bạn chọn cùng nhau trưởng thành."
                  );
                }}
              >
                🚀 Cùng nhau trưởng thành
              </button>

              <button
                onClick={() => {
                  modifyStats({
                    love: -2,
                    mood: 3
                  });

                  setOverlay(null);

                  showToast(
                    "😳 Bạn ngại ngùng chuyển chủ đề."
                  );
                }}
              >
                😳 Chuyển chủ đề
              </button>
            </div>
          </Modal>
        )}

        {overlay === "competition" && (
          <Modal
            title="🏆 Bảng thi đua"
            onClose={() =>
              setOverlay(null)
            }
            wide
          >
            <div className="competition-summary">
              <div className="competition-card">
                <span>📊 Điểm của bạn</span>
                <strong>
                  {game.competitionScore}
                </strong>
              </div>

              <div className="competition-card">
                <span>🏅 Hạng hiện tại</span>
                <strong>
                  #{game.currentRank}
                </strong>
              </div>

              <div className="competition-card">
                <span>🔥 Chuỗi</span>
                <strong>
                  {game.competitionStreak}
                </strong>
              </div>
            </div>

            <div className="ranking-list">
              {ranking.map(row => (
                <div
                  className={
                    `ranking-row ${
                      row.id === "player"
                        ? "ranking-player"
                        : ""
                    }`
                  }
                  key={row.id}
                >
                  <div className="ranking-position">
                    {row.rank === 1
                      ? "🥇"
                      : row.rank === 2
                      ? "🥈"
                      : row.rank === 3
                      ? "🥉"
                      : `#${row.rank}`}
                  </div>

                  <div className="ranking-avatar">
                    {row.avatar}
                  </div>

                  <div className="ranking-name">
                    <strong>
                      {row.name}
                    </strong>

                    <span>
                      {row.id === "player"
                        ? "Nhân vật chính"
                        : "Đối thủ thi đua"}
                    </span>
                  </div>

                  <div className="ranking-score">
                    {row.score}
                    <small>
                      {" "}điểm
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <div className="competition-rule">
              <b>
                📅 Cơ chế thi đua
              </b>

              <p>
                Cuối mỗi ngày, điểm thi đua
                của bạn được tính từ học tập,
                kỹ năng, bạn bè, tình cảm,
                danh tiếng, chứng chỉ và tài sản.
              </p>

              <p>
                Lan, Triệu Mẫn và Tuấn cũng
                tự động nhận điểm mỗi ngày.
                Vì vậy thứ hạng sẽ thay đổi
                liên tục trong 45 ngày.
              </p>
            </div>

            <div className="history-box">
              <b>
                📈 Lịch sử gần đây
              </b>

              {game.competitionHistory
                .slice(-5)
                .reverse()
                .map((entry, index) => (
                  <div
                    className="history-row"
                    key={`${entry.day}-${index}`}
                  >
                    <span>
                      Ngày {entry.day}
                    </span>

                    <span>
                      Bạn +{entry.playerGain}
                    </span>

                    <span>
                      Hạng #{entry.rank}
                    </span>
                  </div>
                ))}
            </div>
          </Modal>
        )}

        {overlay === "titles" && (
          <Modal
            title="🎖️ Danh hiệu"
            onClose={() =>
              setOverlay(null)
            }
            wide
          >
            <div className="title-counter">
              Đã mở khóa{" "}
              <b>
                {game.unlockedTitles.length}
              </b>
              {" / "}
              {TITLES.length}
              {" "}danh hiệu
            </div>

            <div className="title-grid">
              {TITLES.map(title => {
                const unlocked =
                  game.unlockedTitles.includes(
                    title.id
                  );

                return (
                  <div
                    className={
                      `title-item ${
                        unlocked
                          ? "title-unlocked"
                          : "title-locked"
                      }`
                    }
                    key={title.id}
                  >
                    <div className="title-icon">
                      {unlocked
                        ? title.icon
                        : "🔒"}
                    </div>

                    <div>
                      <strong>
                        {title.name}
                      </strong>

                      <p>
                        {title.desc}
                      </p>

                      <span
                        className={
                          unlocked
                            ? "title-status"
                            : "title-status locked"
                        }
                      >
                        {unlocked
                          ? "✓ Đã đạt"
                          : "Chưa đạt"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Modal>
        )}

        {overlay === "quiz" &&
          quiz && (
            <Modal
              title={`📝 Quiz ${
                quizIndex + 1
              }/${quiz.length}`}
              onClose={() => {
                setQuiz(null);
                setOverlay(null);
              }}
              wide
            >
              <div className="quiz-subject">
                {quiz[quizIndex].subject}
              </div>

              <h3 className="quiz-question">
                {quiz[quizIndex].q}
              </h3>

              <div className="quiz-options">
                {quiz[
                  quizIndex
                ].options.map(
                  (option, index) => (
                    <button
                      key={option}
                      onClick={() =>
                        answerQuiz(
                          index
                        )
                      }
                    >
                      <span>
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>
                      {option}
                    </button>
                  )
                )}
              </div>

              <div className="quiz-progress">
                <div
                  style={{
                    width: `${
                      ((quizIndex + 1) /
                        quiz.length) *
                      100
                    }%`
                  }}
                />
              </div>
            </Modal>
          )}

        {overlay === "certExam" &&
          certExam && (
            <Modal
              title={`${certExam.icon} ${
                certExam.name
              }`}
              onClose={() => {
                setCertExam(null);
                setOverlay(null);
              }}
              wide
            >
              <div className="quiz-subject">
                Câu {certIndex + 1}/
                {certExam.questions.length}
              </div>

              <h3 className="quiz-question">
                {
                  certExam.questions[
                    certIndex
                  ].q
                }
              </h3>

              <div className="quiz-options">
                {certExam.questions[
                  certIndex
                ].options.map(
                  (option, index) => (
                    <button
                      key={option}
                      onClick={() =>
                        answerCertificate(
                          index
                        )
                      }
                    >
                      <span>
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      {option}
                    </button>
                  )
                )}
              </div>
            </Modal>
          )}

        {overlay === "saveCode" && (
          <Modal
            title="🔐 Mã lưu game"
            onClose={() =>
              setOverlay(null)
            }
            wide
          >
            <p>
              Mã dưới đây chứa toàn bộ tiến
              trình game hiện tại. Bạn có thể
              copy để lưu lại hoặc dán trên
              thiết bị khác.
            </p>

            <textarea
              className="save-textarea"
              value={saveCode}
              onChange={e =>
                setSaveCode(
                  e.target.value
                )
              }
              placeholder="Mã lưu..."
            />

            <div className="modal-actions">
              <button
                className="primary-btn"
                onClick={copySaveCode}
              >
                📋 Copy mã
              </button>
            </div>

            <hr />

            <h3>
              📥 Nhập mã lưu
            </h3>

            <textarea
              className="save-textarea"
              value={saveCodeInput}
              onChange={e =>
                setSaveCodeInput(
                  e.target.value
                )
              }
              placeholder="Dán mã lưu vào đây..."
            />

            <button
              className="primary-btn"
              onClick={importSaveCode}
            >
              🔄 Tải từ mã
            </button>

            <div className="file-actions">
              <button
                onClick={exportSave}
              >
                📦 Xuất file JSON
              </button>

              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                📥 Nhập file JSON
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                hidden
                onChange={
                  importSaveFile
                }
              />
            </div>
          </Modal>
        )}

        {overlay === "settings" && (
          <Modal
            title="⚙️ Cài đặt"
            onClose={() =>
              setOverlay(null)
            }
          >
            <div className="settings-list">
              <button
                onClick={() =>
                  setAudioEnabled(
                    value => !value
                  )
                }
              >
                {audioEnabled
                  ? "🔊 Tắt âm thanh"
                  : "🔇 Bật âm thanh"}
              </button>

              <button
                onClick={saveNow}
              >
                💾 Lưu game
              </button>

              <button
                onClick={
                  generateSaveCode
                }
              >
                🔐 Tạo mã lưu
              </button>

              <button
                onClick={
                  restartGame
                }
              >
                🔄 Chơi lại từ đầu
              </button>
            </div>
          </Modal>
        )}

        {game.isGameOver && (
          <div className="ending-overlay">
            <div className="ending-card">
              <div className="ending-icon">
                🎓
              </div>

              <div className="ending-kicker">
                HÀNH TRÌNH 45 NGÀY
              </div>

              <h1>
                Thanh Xuân Rực Rỡ
              </h1>

              <p>
                Bạn đã hoàn thành hành trình
                cấp 3 của mình.
              </p>

              <div className="ending-stats">
                <div>
                  <b>
                    #{game.currentRank}
                  </b>
                  <span>
                    Hạng thi đua
                  </span>
                </div>

                <div>
                  <b>
                    {game.competitionScore}
                  </b>
                  <span>
                    Điểm thi đua
                  </span>
                </div>

                <div>
                  <b>
                    {game.stats.study}
                  </b>
                  <span>
                    Học tập
                  </span>
                </div>

                <div>
                  <b>
                    {game.stats.skill}
                  </b>
                  <span>
                    Kỹ năng
                  </span>
                </div>

                <div>
                  <b>
                    {game.stats.love}
                  </b>
                  <span>
                    Tình cảm
                  </span>
                </div>

                <div>
                  <b>
                    {game.unlockedTitles.length}
                  </b>
                  <span>
                    Danh hiệu
                  </span>
                </div>
              </div>

              <div className="ending-message">
                {game.currentRank === 1
                  ? "🏆 Bạn đã trở thành Quán Quân Thi Đua!"
                  : game.stats.study >= 80
                  ? "📚 Một thanh xuân đầy nỗ lực và đáng nhớ!"
                  : game.stats.love >= 80
                  ? "💖 Điều đẹp nhất là những người bạn đã gặp."
                  : "🌱 Quan trọng nhất là bạn đã trưởng thành sau hành trình này."}
              </div>

              <div className="ending-actions">
                <button
                  onClick={() =>
                    setOverlay("competition")
                  }
                >
                  🏆 Xem bảng thi đua
                </button>

                <button
                  onClick={() =>
                    setOverlay("titles")
                  }
                >
                  🎖️ Xem danh hiệu
                </button>

                <button
                  onClick={generateSaveCode}
                >
                  🔐 Lưu thành mã
                </button>

                <button
                  className="danger-btn"
                  onClick={
                    restartGame
                  }
                >
                  🔄 Chơi lại
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ icon, name, value }) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span>
          {icon} {name}
        </span>

        <b>{value}</b>
      </div>

      <div className="bar">
        <div
          style={{
            width: `${Math.min(
              100,
              Math.max(0, value)
            )}%`
          }}
        />
      </div>
    </div>
  );
}

function MiniStat({ name, value }) {
  return (
    <div className="mini-stat">
      <span>{name}</span>
      <b>{value}</b>
    </div>
  );
}

function Drawer({
  title,
  onClose,
  children
}) {
  return (
    <div className="overlay">
      <div className="drawer-panel">
        <div className="drawer-header">
          <h2>{title}</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
  wide = false
}) {
  return (
    <div className="overlay">
      <div
        className={
          `modal ${
            wide ? "modal-wide" : ""
          }`
        }
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="empty">
      <div>📭</div>
      <p>{text}</p>
    </div>
  );
}

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
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background:
    radial-gradient(
      circle at top,
      #eef3ff 0%,
      #dfe6f5 45%,
      #cfd7e7 100%
    );
  color: #202333;
}

button,
textarea,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: .5;
}

.app {
  min-height: 100vh;
  padding-bottom: 30px;
}

.topbar {
  min-height: 76px;
  background: rgba(20, 25, 45, .96);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px max(18px, calc((100vw - 1180px) / 2));
  box-shadow: 0 5px 25px rgba(0,0,0,.18);
}

.brand {
  font-size: 22px;
  font-weight: 950;
  letter-spacing: -.5px;
}

.subtitle {
  margin-top: 3px;
  font-size: 11px;
  opacity: .55;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.top-actions {
  display: flex;
  gap: 7px;
}

.top-actions button {
  border: 0;
  background: rgba(255,255,255,.1);
  color: white;
  border-radius: 11px;
  width: 42px;
  height: 42px;
  font-size: 18px;
}

.top-actions button:hover {
  background: rgba(255,255,255,.2);
}

.game-shell {
  width: min(1180px, calc(100% - 24px));
  margin: 18px auto;
}

.hud {
  display: grid;
  grid-template-columns:
    1fr 1fr 1.4fr 1.4fr;
  gap: 10px;
  margin-bottom: 12px;
}

.day-card,
.time-card,
.money-card,
.rank-card {
  background: rgba(255,255,255,.9);
  border-radius: 16px;
  padding: 12px 15px;
  box-shadow:
    0 5px 18px rgba(30,40,80,.08);
}

.hud span {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  opacity: .55;
}

.hud strong {
  display: block;
  margin-top: 3px;
  font-size: 18px;
}

.rank-card strong {
  color: #7353d6;
}

.stats {
  display: grid;
  grid-template-columns:
    repeat(6, 1fr);
  gap: 9px;
  margin-bottom: 12px;
}

.stat {
  background: white;
  border-radius: 14px;
  padding: 9px 11px;
  box-shadow:
    0 5px 18px rgba(30,40,80,.07);
}

.stat-top {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  font-size: 11px;
}

.stat-top b {
  font-size: 12px;
}

.bar {
  height: 6px;
  background: #edf0f5;
  border-radius: 99px;
  overflow: hidden;
  margin-top: 7px;
}

.bar div {
  height: 100%;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      #7f75e9,
      #4fb4ff
    );
}

.location-tabs {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 9px;
}

.location-tabs button {
  flex: 1;
  min-width: 100px;
  border: 0;
  background: rgba(255,255,255,.65);
  border-radius: 14px;
  padding: 10px;
  color: #30354a;
}

.location-tabs button.active {
  background: #292e4c;
  color: white;
  box-shadow:
    0 5px 15px rgba(30,30,70,.22);
}

.location-tabs span {
  display: block;
  font-size: 20px;
}

.location-tabs small {
  display: block;
  margin-top: 3px;
  font-weight: 800;
}

.main-panel {
  min-height: 440px;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow:
    0 10px 35px rgba(30,40,80,.1);
}

.location-panel {
  min-height: 440px;
}

.pixel-scene {
  min-height: 175px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 80px;
}

.class-scene {
  background:
    linear-gradient(
      #a8ddff 0 60%,
      #d8e5f0 60% 100%
    );
}

.canteen-scene {
  background:
    linear-gradient(
      #ffd7a1 0 60%,
      #f3bd7a 60% 100%
    );
}

.home-scene {
  background:
    linear-gradient(
      #b8e9ff 0 58%,
      #a9d69b 58% 100%
    );
}

.scene-cloud {
  position: absolute;
  left: 12%;
  top: 20px;
  font-size: 40px;
}

.scene-school {
  font-size: 80px;
}

.scene-student {
  position: absolute;
  bottom: 8px;
  font-size: 65px;
}

.scene-food {
  font-size: 45px;
}

.scene-bed {
  position: absolute;
  right: 18%;
  bottom: 5px;
  font-size: 55px;
}

.location-content {
  padding: 22px;
}

.location-content h2 {
  margin: 0;
  font-size: 25px;
}

.location-content > p {
  color: #6d7284;
  line-height: 1.6;
}

.action-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 10px;
  margin-top: 18px;
}

.primary-btn,
.secondary-btn,
.action-grid button,
.location-content button {
  border: 0;
  border-radius: 13px;
  padding: 12px 15px;
  font-weight: 800;
}

.primary-btn {
  color: white;
  background:
    linear-gradient(
      135deg,
      #7167df,
      #4f9ee9
    );
  box-shadow:
    0 7px 18px rgba(91,90,210,.2);
}

.secondary-btn {
  background: #eef0f7;
  color: #34384c;
}

.large {
  padding: 15px 22px;
  font-size: 16px;
}

.shop-grid,
.cert-grid,
.property-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 12px;
  margin-top: 18px;
}

.shop-card,
.cert-card,
.property-card {
  border: 1px solid #e8eaf0;
  border-radius: 18px;
  padding: 15px;
  text-align: center;
  background: #fbfcff;
}

.shop-icon,
.cert-icon,
.property-icon {
  font-size: 42px;
  margin-bottom: 7px;
}

.shop-card strong,
.cert-card strong,
.property-card strong {
  display: block;
}

.shop-card small,
.cert-card p,
.property-card p {
  display: block;
  color: #73788a;
  font-size: 12px;
}

.shop-card button,
.cert-card button,
.property-card button {
  width: 100%;
  margin-top: 8px;
  background: #272c47;
  color: white;
}

.cert-card.owned,
.property-card.owned {
  background: #effcf4;
  border-color: #8bd5a5;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}

.job-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #e8eaf0;
  border-radius: 17px;
  padding: 13px;
}

.job-icon {
  font-size: 35px;
}

.job-main {
  flex: 1;
}

.job-main strong {
  font-size: 16px;
}

.job-main p {
  margin: 4px 0;
  color: #727789;
  font-size: 12px;
}

.job-main span {
  font-size: 12px;
  font-weight: 700;
}

.job-main small {
  display: block;
  color: #a05d3d;
  margin-top: 4px;
}

.job-card > button {
  background: #292e4c;
  color: white;
  min-width: 70px;
}

.npc-strip {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.npc-mini {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: white;
  border-radius: 16px;
  padding: 10px 14px;
  text-align: left;
  box-shadow:
    0 5px 18px rgba(30,40,80,.07);
}

.npc-avatar {
  font-size: 34px;
}

.npc-mini b,
.npc-mini small {
  display: block;
}

.npc-mini small {
  color: #73788a;
  margin-top: 3px;
}

.bottom-actions {
  display: grid;
  grid-template-columns:
    repeat(6, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.bottom-actions button {
  border: 0;
  border-radius: 14px;
  padding: 11px 5px;
  background: white;
  box-shadow:
    0 5px 18px rgba(30,40,80,.07);
  font-size: 19px;
}

.bottom-actions span {
  display: block;
  font-size: 10px;
  margin-top: 4px;
  font-weight: 800;
}

.controller {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  padding: 15px 18px;
  background: #252a45;
  color: white;
  border-radius: 20px;
}

.dpad {
  display: flex;
  gap: 6px;
}

.dpad button,
.ab-buttons button {
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 50%;
  font-weight: 950;
  font-size: 16px;
}

.dpad button {
  background: #3d4364;
  color: white;
}

.controller-info {
  display: flex;
  gap: 7px;
  align-items: center;
}

.controller-info span {
  font-size: 24px;
}

.ab-buttons {
  display: flex;
  gap: 8px;
}

.btn-a {
  background: #ff7192;
  color: white;
}

.btn-b {
  background: #5e9eea;
  color: white;
}

.advance-row {
  margin-top: 10px;
}

.next-time {
  width: 100%;
  border: 0;
  background: #171b31;
  color: white;
  border-radius: 15px;
  padding: 13px;
  font-weight: 850;
}

.next-time span {
  margin-left: 8px;
  opacity: .6;
  font-weight: 500;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(13,17,33,.62);
  backdrop-filter: blur(5px);
}

.modal,
.drawer-panel {
  width: min(620px, 95vw);
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 25px;
  box-shadow:
    0 25px 90px rgba(0,0,0,.35);
}

.modal-wide {
  width: min(850px, 95vw);
}

.modal-header,
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f5;
}

.modal-header h2,
.drawer-header h2 {
  margin: 0;
  font-size: 22px;
}

.modal-body {
  padding: 22px;
}

.close-btn {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 11px;
  background: #f0f2f6;
  font-size: 17px;
}

.drawer-panel {
  width: min(560px, 95vw);
}

.drawer-panel > *:not(.drawer-header) {
  margin-left: 22px;
  margin-right: 22px;
}

.profile-avatar {
  font-size: 80px;
  text-align: center;
  margin-top: 22px;
}

.drawer-panel h3 {
  text-align: center;
}

.profile-grid {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 9px;
  margin-top: 16px;
}

.mini-stat {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #f5f6fa;
  border-radius: 12px;
}

.profile-section {
  margin-top: 12px;
  padding: 14px;
  border-radius: 14px;
  background: #f5f6fa;
}

.profile-section p {
  margin: 6px 0 0;
  color: #717687;
}

.drawer-list {
  padding-top: 10px;
  padding-bottom: 20px;
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #edf0f4;
}

.drawer-item > span {
  font-size: 31px;
}

.drawer-item > div {
  flex: 1;
}

.drawer-item b,
.drawer-item small {
  display: block;
}

.drawer-item small {
  margin-top: 3px;
  color: #74798b;
}

.drawer-item button {
  border: 0;
  background: #292e4c;
  color: white;
  padding: 8px 12px;
  border-radius: 10px;
}

.diary-entry {
  padding: 14px;
  margin-bottom: 10px;
  border-radius: 15px;
  background: #fff9e8;
}

.diary-entry p {
  margin: 6px 0 0;
  line-height: 1.55;
}

.npc-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 12px;
}

.npc-card {
  border: 1px solid #e8eaf0;
  border-radius: 18px;
  padding: 15px;
  text-align: center;
}

.big-avatar {
  font-size: 60px;
}

.npc-card p {
  color: #717687;
  font-size: 12px;
  min-height: 45px;
}

.npc-card button {
  width: 100%;
  margin-top: 7px;
  border: 0;
  background: #292e4c;
  color: white;
  border-radius: 11px;
  padding: 10px;
  font-weight: 800;
}

.dialogue {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.dialogue-avatar {
  font-size: 65px;
}

.speech {
  background: #f4f5fa;
  padding: 14px;
  border-radius: 17px;
  flex: 1;
}

.speech p {
  line-height: 1.6;
}

.dialogue-options {
  display: grid;
  gap: 8px;
  margin-top: 15px;
}

.dialogue-options button {
  border: 0;
  background: #f0f1f6;
  border-radius: 13px;
  padding: 12px;
  text-align: left;
  font-weight: 750;
}

.competition-summary {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.competition-card {
  padding: 15px;
  border-radius: 16px;
  text-align: center;
  background: #f5f6fa;
}

.competition-card span {
  display: block;
  font-size: 11px;
  color: #777c8d;
}

.competition-card strong {
  display: block;
  font-size: 25px;
  margin-top: 4px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.ranking-row {
  display: grid;
  grid-template-columns:
    48px 45px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 13px;
  background: #f5f6fa;
  border-radius: 15px;
}

.ranking-player {
  background: #fff6d5;
  box-shadow:
    inset 0 0 0 2px #efca56;
}

.ranking-position {
  text-align: center;
  font-size: 18px;
  font-weight: 950;
}

.ranking-avatar {
  font-size: 31px;
  text-align: center;
}

.ranking-name strong,
.ranking-name span {
  display: block;
}

.ranking-name span {
  color: #777c8d;
  font-size: 10px;
  margin-top: 3px;
}

.ranking-score {
  font-size: 19px;
  font-weight: 950;
}

.ranking-score small {
  font-size: 10px;
  opacity: .5;
}

.competition-rule,
.history-box {
  margin-top: 15px;
  padding: 14px;
  border-radius: 15px;
  background: #f6f7fa;
  line-height: 1.55;
}

.competition-rule p {
  margin: 7px 0 0;
  color: #73788a;
  font-size: 13px;
}

.history-row {
  display: flex;
  justify-content: space-between;
  padding: 9px 0;
  border-bottom: 1px solid #e5e7ed;
  font-size: 12px;
}

.history-row:last-child {
  border-bottom: 0;
}

.title-counter {
  padding: 12px;
  background: #fff7d9;
  border-radius: 13px;
  margin-bottom: 12px;
}

.title-grid {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 11px;
}

.title-item {
  display: flex;
  gap: 13px;
  align-items: center;
  padding: 14px;
  border-radius: 17px;
  min-height: 100px;
}

.title-unlocked {
  background: #fff7d8;
  border: 1px solid #efd36d;
}

.title-locked {
  background: #f2f3f6;
  opacity: .55;
}

.title-icon {
  min-width: 45px;
  font-size: 34px;
  text-align: center;
}

.title-item strong {
  display: block;
}

.title-item p {
  margin: 5px 0;
  font-size: 11px;
  color: #74798b;
  line-height: 1.4;
}

.title-status {
  color: #26834d;
  font-size: 10px;
  font-weight: 900;
}

.title-status.locked {
  color: #858a98;
}

.quiz-subject {
  display: inline-block;
  background: #eeeafd;
  color: #6855c7;
  border-radius: 99px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 850;
}

.quiz-question {
  font-size: 20px;
  line-height: 1.5;
  margin: 15px 0;
}

.quiz-options {
  display: grid;
  gap: 9px;
}

.quiz-options button {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e4e6ed;
  background: #fafbfe;
  padding: 13px;
  border-radius: 13px;
  text-align: left;
}

.quiz-options button:hover {
  background: #f0f1fa;
  border-color: #9c93e9;
}

.quiz-options button span {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8e9f3;
  border-radius: 8px;
  font-weight: 900;
}

.quiz-progress {
  height: 6px;
  margin-top: 18px;
  border-radius: 99px;
  background: #eceef3;
  overflow: hidden;
}

.quiz-progress div {
  height: 100%;
  background: #7167df;
}

.save-textarea {
  width: 100%;
  min-height: 140px;
  resize: vertical;
  border: 1px solid #dfe2e9;
  border-radius: 13px;
  padding: 12px;
  font-size: 11px;
  line-height: 1.4;
  margin: 8px 0 12px;
  outline: none;
}

.save-textarea:focus {
  border-color: #7568df;
}

.modal-actions {
  display: flex;
  gap: 8px;
}

.file-actions {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.file-actions button,
.settings-list button {
  border: 0;
  padding: 12px;
  border-radius: 12px;
  background: #f0f1f6;
  font-weight: 750;
}

.settings-list {
  display: grid;
  gap: 9px;
}

.empty {
  text-align: center;
  padding: 50px 20px;
  color: #777c8d;
}

.empty div {
  font-size: 50px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 25px;
  transform: translateX(-50%);
  z-index: 2000;
  background: #22263f;
  color: white;
  padding: 12px 18px;
  border-radius: 99px;
  box-shadow:
    0 10px 30px rgba(0,0,0,.25);
  font-size: 13px;
  font-weight: 750;
  max-width: min(90vw, 600px);
  text-align: center;
}

.ending-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background:
    linear-gradient(
      135deg,
      rgba(36,30,76,.94),
      rgba(52,74,120,.94)
    );
  overflow-y: auto;
}

.ending-card {
  width: min(800px, 95vw);
  background: white;
  border-radius: 30px;
  padding: 35px;
  text-align: center;
  box-shadow:
    0 30px 100px rgba(0,0,0,.4);
}

.ending-icon {
  font-size: 70px;
}

.ending-kicker {
  margin-top: 5px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #7465d9;
}

.ending-card h1 {
  font-size: 38px;
  margin: 8px 0;
}

.ending-card > p {
  color: #727789;
}

.ending-stats {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 9px;
  margin: 22px 0;
}

.ending-stats div {
  background: #f5f6fa;
  border-radius: 14px;
  padding: 13px;
}

.ending-stats b,
.ending-stats span {
  display: block;
}

.ending-stats b {
  font-size: 23px;
}

.ending-stats span {
  margin-top: 3px;
  color: #777c8d;
  font-size: 10px;
}

.ending-message {
  background: #fff7d7;
  padding: 15px;
  border-radius: 15px;
  font-weight: 800;
}

.ending-actions {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 9px;
  margin-top: 15px;
}

.ending-actions button {
  border: 0;
  border-radius: 13px;
  padding: 12px;
  background: #292e4c;
  color: white;
  font-weight: 800;
}

.ending-actions .danger-btn {
  background: #d95367;
}

@media (max-width: 850px) {
  .stats {
    grid-template-columns:
      repeat(3, 1fr);
  }

  .shop-grid,
  .cert-grid,
  .property-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .npc-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .topbar {
    padding: 12px;
  }

  .brand {
    font-size: 17px;
  }

  .subtitle {
    font-size: 8px;
  }

  .game-shell {
    width: calc(100% - 12px);
    margin-top: 9px;
  }

  .hud {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .stats {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .npc-strip {
    grid-template-columns: 1fr;
  }

  .bottom-actions {
    grid-template-columns:
      repeat(3, 1fr);
  }

  .controller {
    padding: 12px;
  }

  .controller-info b {
    display: none;
  }

  .shop-grid,
  .cert-grid,
  .property-grid {
    grid-template-columns: 1fr;
  }

  .competition-summary {
    grid-template-columns: 1fr;
  }

  .title-grid {
    grid-template-columns: 1fr;
  }

  .ending-card {
    padding: 23px 15px;
  }

  .ending-card h1 {
    font-size: 28px;
  }

  .ending-stats {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .ending-actions {
    grid-template-columns: 1fr;
  }

  .file-actions {
    grid-template-columns: 1fr;
  }

  .ranking-row {
    grid-template-columns:
      35px 38px 1fr auto;
  }

  .ranking-avatar {
    font-size: 25px;
  }

  .ranking-score {
    font-size: 15px;
  }
}
`;

export default App;
