import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   THANH XUÂN RỰC RỠ
   Deluxe Career & Fashion Edition
   - 1 file App.jsx
   - 23 mốc thời gian / ngày
   - 100 ngày chơi
   - Mỗi mốc 30 giây
   - Mỗi mốc tối đa 2 hoạt động chính
   - Quick Activities
   - Fashion / Outfit
   - kho câu hỏi ôn tập hiện có + 260 câu mới (100 HSK 4-5 + 160 tiếng Anh B1-B2) + 200 câu hỏi thi học kỳ/THPT
   - NPC
   - Nghề
   - Chứng chỉ
   - Tài sản
   - Nhật ký
   - Thi đua
   - Save code
   - Tên nhân vật + bảng xếp hạng người chơi online real-time
   - Supabase Auth anonymous + Postgres REST polling (không cần SDK)
========================================================= */

const SAVE_KEY = "thanh_xuan_ruc_ro_deluxe_v26";
const SLOT_SECONDS = 30;

/* =========================================================
   MULTIPLAYER ONLINE — SUPABASE
   Set these in .env.local:
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
========================================================= */
const SUPABASE_URL = String(
  import.meta.env?.VITE_SUPABASE_URL || ""
).replace(/\/$/, "");
const SUPABASE_KEY = String(
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  ""
);

const ONLINE_TABLE = "player_scores";
const ONLINE_SESSION_KEY = "thanh_xuan_ruc_ro_supabase_session_v1";
const ONLINE_HEARTBEAT_MS = 10000;
const ONLINE_POLL_MS = 5000;
const hasOnlineConfig = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function onlineRequest(path, options = {}) {
  if (!hasOnlineConfig) {
    throw new Error("Chưa cấu hình Supabase URL / publishable key.");
  }

  const headers = {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      data?.msg ||
      data?.message ||
      data?.error_description ||
      data?.hint ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function readOnlineSession() {
  try {
    return JSON.parse(localStorage.getItem(ONLINE_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function writeOnlineSession(session) {
  try {
    localStorage.setItem(ONLINE_SESSION_KEY, JSON.stringify(session));
  } catch {}
}

function clearOnlineSession() {
  try {
    localStorage.removeItem(ONLINE_SESSION_KEY);
  } catch {}
}

const onlineAuthHeaders = (accessToken) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

async function createAnonymousSession() {
  const data = await onlineRequest("/auth/v1/signup", {
    method: "POST",
    body: JSON.stringify({ data: { app: "thanh-xuan-ruc-ro" } })
  });

  if (!data?.access_token || !data?.user?.id) {
    throw new Error(
      "Không tạo được tài khoản ẩn danh. Hãy bật Anonymous Sign-Ins trong Supabase."
    );
  }

  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || null,
    user: data.user
  };
  writeOnlineSession(session);
  return session;
}

async function refreshAnonymousSession(session) {
  if (!session?.refresh_token) return null;

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: session.refresh_token
      })
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok || !data?.access_token) return null;

    const next = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || session.refresh_token,
      user: session.user
    };
    writeOnlineSession(next);
    return next;
  } catch {
    return null;
  }
}

/* =========================================================
   THỜI GIAN
========================================================= */

const TIME_SLOTS = [
  "06:30","07:15","08:00","08:45","09:30","10:15",
  "11:00","11:45","12:30","13:15","14:00","14:45",
  "15:30","16:15","17:00","17:45","18:30","19:15",
  "20:00","20:45","21:30","22:15","23:00"
];

const PERIOD_NAMES = [
  "Buổi sáng","Buổi sáng","Tiết học","Tiết học","Tiết học","Tiết học",
  "Cuối buổi sáng","Cuối buổi sáng","Nghỉ trưa","Buổi chiều","Buổi chiều",
  "Buổi chiều","Buổi chiều","Tan học","Buổi tối","Buổi tối","Buổi tối",
  "Buổi tối","Buổi tối","Buổi tối","Kết thúc ngày","Kết thúc ngày","Kết thúc ngày"
];

/* =========================================================
   HELPERS
========================================================= */

const clamp = (n, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(n) || 0));

const money = (n) =>
  `${Math.round(Number(n) || 0).toLocaleString("vi-VN")}đ`;

const signed = (n) => {
  const x = Number(n) || 0;
  return x > 0 ? `+${x}` : `${x}`;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const addStat = (g, key, amount) => {
  const max = key === "skill" ? 500 : 100;
  g.stats[key] = Math.max(0, Math.min(max, (Number(g.stats[key]) || 0) + (Number(amount) || 0)));
};

const addAchievement = (g, amount) => {
  g.achievementPoints = Math.max(
    0,
    Math.round((Number(g.achievementPoints) || 0) + (Number(amount) || 0))
  );
};

const addKnowledge = (g, amount) => {
  g.knowledgePoints = Math.max(
    0,
    Math.round((Number(g.knowledgePoints) || 0) + (Number(amount) || 0))
  );
};

const addMoney = (g, amount) => {
  g.stats.money = Math.max(0, g.stats.money + amount);
};

const addCompetition = (g, amount) => {
  const n = Math.max(0, Math.round(amount || 0));
  g.competitionPoints += n;
  g.dailyCompetition.player += n;
};

const addRelationship = (g, id, amount) => {
  g.relationships[id] = clamp((g.relationships[id] || 0) + amount);
};

/* =========================================================
   280 CÂU HỎI ÔN TẬP
   180 CÂU CŨ + TOÁN 10-11 + 150 TOÁN 11 + 50 VẬT LÝ 10-11
========================================================= */

const VAN_QUESTIONS = [
  ["Vợ nhặt", "Tác phẩm Vợ nhặt của ai?", ["Kim Lân", "Nam Cao", "Tô Hoài", "Nguyễn Tuân"], 0, "Vợ nhặt là truyện ngắn nổi tiếng của Kim Lân."],
  ["Vợ nhặt", "Bối cảnh chính của Vợ nhặt gắn với sự kiện nào?", ["Nạn đói 1945", "Cách mạng tháng Tám 1930", "Kháng chiến chống Mỹ", "Đổi mới"], 0, "Tác phẩm lấy bối cảnh nạn đói năm 1945."],
  ["Đoàn thuyền đánh cá", "“Mặt trời xuống biển như hòn lửa” sử dụng biện pháp gì?", ["So sánh", "Hoán dụ", "Nói quá", "Điệp ngữ"], 0, "Hình ảnh mặt trời được so sánh với hòn lửa."],
  ["Truyện Kiều", "Tác giả Truyện Kiều là ai?", ["Nguyễn Du", "Nguyễn Trãi", "Nguyễn Đình Chiểu", "Hồ Xuân Hương"], 0, "Nguyễn Du là tác giả Truyện Kiều."],
  ["Chí Phèo", "Chí Phèo là tác phẩm của ai?", ["Nam Cao", "Kim Lân", "Ngô Tất Tố", "Vũ Trọng Phụng"], 0, "Chí Phèo là truyện ngắn của Nam Cao."],
  ["Tây Tiến", "Tây Tiến được sáng tác bởi nhà thơ nào?", ["Quang Dũng", "Tố Hữu", "Chính Hữu", "Huy Cận"], 0, "Quang Dũng sáng tác Tây Tiến."],
  ["Việt Bắc", "Việt Bắc là tác phẩm của ai?", ["Tố Hữu", "Quang Dũng", "Xuân Quỳnh", "Bằng Việt"], 0, "Việt Bắc là trường ca thơ của Tố Hữu."],
  ["Tuyên ngôn Độc lập", "Tuyên ngôn Độc lập năm 1945 do ai đọc?", ["Hồ Chí Minh", "Võ Nguyên Giáp", "Phạm Văn Đồng", "Trường Chinh"], 0, "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2/9/1945."],
  ["Đất Nước", "Đoạn trích Đất Nước thuộc trường ca nào?", ["Mặt đường khát vọng", "Việt Bắc", "Đất nước", "Những người đi tới biển"], 0, "Đất Nước của Nguyễn Khoa Điềm thuộc trường ca Mặt đường khát vọng."],
  ["Sóng", "Sóng là tác phẩm của ai?", ["Xuân Quỳnh", "Hàn Mặc Tử", "Lưu Trọng Lư", "Chế Lan Viên"], 0, "Sóng là bài thơ nổi tiếng của Xuân Quỳnh."],
  ["Người lái đò sông Đà", "Tác giả Người lái đò sông Đà là ai?", ["Nguyễn Tuân", "Nguyễn Minh Châu", "Tô Hoài", "Thạch Lam"], 0, "Nguyễn Tuân nổi tiếng với phong cách tài hoa, uyên bác."],
  ["Vợ chồng A Phủ", "Vợ chồng A Phủ của tác giả nào?", ["Tô Hoài", "Kim Lân", "Nam Cao", "Nguyễn Tuân"], 0, "Tô Hoài viết Vợ chồng A Phủ."],
  ["Rừng xà nu", "Rừng xà nu là tác phẩm của ai?", ["Nguyễn Trung Thành", "Nguyễn Minh Châu", "Nguyễn Khoa Điềm", "Tô Hoài"], 0, "Nguyễn Trung Thành là tác giả Rừng xà nu."],
  ["Chiếc thuyền ngoài xa", "Chiếc thuyền ngoài xa của ai?", ["Nguyễn Minh Châu", "Nguyễn Tuân", "Nam Cao", "Kim Lân"], 0, "Đây là truyện ngắn của Nguyễn Minh Châu."],
  ["Ai đã đặt tên cho dòng sông?", "Tác giả Ai đã đặt tên cho dòng sông? là ai?", ["Hoàng Phủ Ngọc Tường", "Nguyễn Tuân", "Tố Hữu", "Xuân Diệu"], 0, "Hoàng Phủ Ngọc Tường là tác giả bút ký này."],
  ["Hai đứa trẻ", "Hai đứa trẻ là tác phẩm của ai?", ["Thạch Lam", "Nam Cao", "Vũ Trọng Phụng", "Nguyễn Công Hoan"], 0, "Hai đứa trẻ là truyện ngắn của Thạch Lam."],
  ["Chữ người tử tù", "Chữ người tử tù của ai?", ["Nguyễn Tuân", "Nguyễn Du", "Nam Cao", "Tô Hoài"], 0, "Nguyễn Tuân viết Chữ người tử tù."],
  ["Lão Hạc", "Lão Hạc là tác phẩm của nhà văn nào?", ["Nam Cao", "Kim Lân", "Thạch Lam", "Ngô Tất Tố"], 0, "Lão Hạc là truyện ngắn nổi tiếng của Nam Cao."],
  ["Đồng chí", "Đồng chí là bài thơ của ai?", ["Chính Hữu", "Quang Dũng", "Tố Hữu", "Huy Cận"], 0, "Chính Hữu viết Đồng chí."],
  ["Bếp lửa", "Bếp lửa là tác phẩm của ai?", ["Bằng Việt", "Xuân Quỳnh", "Tố Hữu", "Chế Lan Viên"], 0, "Bằng Việt sáng tác Bếp lửa."],
];

const LY_QUESTIONS = [
  ["Công suất", "Đơn vị SI của công suất là gì?", ["W", "J", "N", "Pa"], 0, "Công suất có đơn vị watt (W)."],
  ["Newton", "Định luật II Newton có công thức nào?", ["F = ma", "F = m/a", "F = a/m", "F = mv"], 0, "Lực bằng khối lượng nhân gia tốc."],
  ["Vận tốc", "Đơn vị thường dùng của vận tốc là gì?", ["m/s", "kg", "N", "J"], 0, "Trong SI, vận tốc có đơn vị m/s."],
  ["Ohm", "Định luật Ohm cho đoạn mạch có công thức?", ["U = IR", "U = I/R", "I = UR", "R = UI"], 0, "U = IR."],
  ["Mạch nối tiếp", "Trong mạch nối tiếp, đại lượng nào giống nhau qua các phần tử?", ["Cường độ dòng điện", "Hiệu điện thế", "Điện trở", "Công suất"], 0, "Dòng điện qua các phần tử nối tiếp có cùng cường độ."],
  ["Mạch song song", "Trong mạch song song, đại lượng nào giống nhau?", ["Hiệu điện thế", "Cường độ dòng điện", "Điện trở", "Công suất"], 0, "Các nhánh song song có cùng hiệu điện thế."],
  ["Động năng", "Động năng của vật được tính bằng?", ["1/2mv²", "mv", "mgh", "Fs"], 0, "Động năng Wđ = 1/2mv²."],
  ["Thế năng", "Thế năng trọng trường gần mặt đất là?", ["mgh", "1/2mv²", "ma", "UI"], 0, "Wt = mgh."],
  ["Công cơ học", "Công của lực không đổi được tính bằng?", ["Fs cosα", "F/s", "Fs sinα", "mgh/t"], 0, "A = Fs cosα."],
  ["Tần số", "Đơn vị của tần số là?", ["Hz", "W", "V", "Ω"], 0, "Hertz (Hz)."],
  ["Ánh sáng", "Tốc độ ánh sáng trong chân không xấp xỉ?", ["3×10⁸ m/s", "3×10⁶ m/s", "3×10⁴ m/s", "3×10² m/s"], 0, "Giá trị gần đúng là 3×10⁸ m/s."],
  ["Thấu kính", "Thấu kính hội tụ có tác dụng chính là?", ["Hội tụ chùm tia", "Phân kỳ chùm tia", "Hấp thụ ánh sáng", "Phản xạ hoàn toàn"], 0, "Thấu kính hội tụ làm các tia tới song song hội tụ."],
  ["Dòng điện", "Đơn vị của cường độ dòng điện là?", ["A", "V", "Ω", "W"], 0, "Ampe (A)."],
  ["Điện trở", "Đơn vị của điện trở là?", ["Ω", "A", "V", "J"], 0, "Ohm (Ω)."],
  ["Máy biến áp", "Máy biến áp thông thường hoạt động với?", ["Dòng điện xoay chiều", "Dòng điện một chiều", "Cả hai như nhau", "Không cần điện"], 0, "Máy biến áp dựa trên hiện tượng cảm ứng điện từ và dùng AC."],
  ["Động lượng", "Động lượng được tính bằng?", ["p = mv", "p = ma", "p = F/s", "p = mgh"], 0, "Động lượng p = mv."],
  ["Gia tốc", "Đơn vị của gia tốc là?", ["m/s²", "m/s", "N", "J"], 0, "Gia tốc có đơn vị m/s²."],
  ["Công suất điện", "Công suất điện được tính bằng?", ["P = UI", "P = U/I", "P = IR", "P = U+I"], 0, "P = UI."],
  ["Sóng", "Quan hệ giữa vận tốc, bước sóng và tần số là?", ["v = λf", "v = λ/f", "v = f/λ", "v = λ+f"], 0, "Công thức sóng v = λf."],
  ["Âm thanh", "Âm thanh không truyền được trong môi trường nào?", ["Chân không", "Không khí", "Nước", "Kim loại"], 0, "Âm thanh cần môi trường vật chất để truyền."],
];

const TOAN_10_11_QUESTIONS = [["Lớp 10 • Tập hợp","Cho A={1,2,3} và B={2,3,4}. A∩B bằng? ",["{1,2}","{2,3}","{1,2,3,4}","{4}"],1,"Giao của hai tập hợp gồm các phần tử chung của A và B."],["Lớp 10 • Mệnh đề","Mệnh đề 'Nếu n là số chẵn thì n² là số chẵn' có dạng nào?",["Mệnh đề phủ định","Mệnh đề kéo theo","Mệnh đề tương đương","Mệnh đề hội"],1,"Đây là mệnh đề có cấu trúc 'Nếu P thì Q', tức mệnh đề kéo theo."],["Lớp 10 • Hàm số","Hàm số y=2x+1 có hệ số góc bằng?",["1","2","-1","3"],1,"Trong y=ax+b, hệ số góc là a=2."],["Lớp 10 • Hàm số","Giá trị của f(3) với f(x)=x²-2x+1 là?",["4","1","2","10"],0,"f(3)=9-6+1=4."],["Lớp 10 • Bậc hai","Phương trình x²-5x+6=0 có nghiệm là?",["x=1 và x=6","x=2 và x=3","x=-2 và x=-3","x=0 và x=6"],1,"x²-5x+6=(x-2)(x-3), nên x=2 hoặc x=3."],["Lớp 10 • Bất phương trình","Nghiệm của 2x-3>5 là?",["x>1","x>4","x<4","x≥4"],1,"2x-3>5 ⇔ 2x>8 ⇔ x>4."],["Lớp 10 • Định lý Viète","Với x²-7x+10=0, tổng hai nghiệm bằng?",["10","7","-7","-10"],1,"Theo Viète, tổng nghiệm bằng -b/a=7."],["Lớp 10 • Định lý Viète","Với x²-4x+3=0, tích hai nghiệm bằng?",["-3","4","3","-4"],2,"Theo Viète, tích nghiệm bằng c/a=3."],["Lớp 10 • Hàm số bậc hai","Đỉnh của parabol y=x²-4x+1 có hoành độ là?",["-2","2","4","1"],1,"Hoành độ đỉnh là x=-b/(2a)=4/2=2."],["Lớp 10 • Tọa độ","Khoảng cách giữa A(1,2) và B(4,6) bằng?",["4","5","6","7"],1,"AB=√[(4-1)²+(6-2)²]=√25=5."],["Lớp 10 • Tọa độ","Trung điểm của đoạn AB với A(2,-1), B(6,3) là?",["(4,1)","(2,1)","(8,2)","(4,-1)"],0,"Trung điểm là ((2+6)/2,(-1+3)/2)=(4,1)."],["Lớp 10 • Đường thẳng","Đường thẳng đi qua A(0,2) và có hệ số góc 3 có phương trình là?",["y=3x","y=3x+2","y=2x+3","y=-3x+2"],1,"Dạng y=ax+b, đi qua (0,2) nên y=3x+2."],["Lớp 10 • Vectơ","Nếu a=(2,3) và b=(1,-1) thì a+b bằng?",["(1,4)","(3,2)","(2,2)","(3,4)"],1,"Cộng theo từng tọa độ: (2+1,3-1)=(3,2)."],["Lớp 10 • Vectơ","Hai vectơ (2,4) và (1,2) là?",["Vuông góc","Bằng nhau","Cùng phương","Đối nhau"],2,"(2,4)=2(1,2), nên hai vectơ cùng phương."],["Lớp 10 • Tích vô hướng","Với a=(1,2), b=(3,4), a·b bằng?",["5","10","11","12"],2,"a·b=1·3+2·4=11."],["Lớp 10 • Tích vô hướng","Hai vectơ a=(1,0), b=(0,2) có vuông góc không?",["Không, vì cùng phương","Có","Chỉ khi cùng độ dài","Không xác định"],1,"Tích vô hướng bằng 1·0+0·2=0 nên hai vectơ vuông góc."],["Lớp 10 • Hệ thức lượng","Trong tam giác, định lý cos cho cạnh a là?",["a²=b²+c²+2bc cos A","a²=b²+c²-2bc cos A","a=b+c-cos A","a²=b²-c²-2bc cos A"],1,"Định lý cos: a²=b²+c²-2bc cos A."],["Lớp 10 • Tam giác","Tam giác có ba cạnh 3,4,5 là tam giác gì?",["Đều","Cân","Vuông","Tù"],2,"3²+4²=5² nên tam giác vuông."],["Lớp 10 • Diện tích","Diện tích tam giác có đáy 8 cm và chiều cao 5 cm bằng?",["20 cm²","40 cm²","13 cm²","30 cm²"],0,"S=1/2·8·5=20 cm²."],["Lớp 10 • Thống kê","Trung bình cộng của 4,6,8,10 là?",["6","7","8","9"],1,"(4+6+8+10)/4=7."],["Lớp 10 • Thống kê","Trung vị của dãy 2,5,7,9,12 là?",["5","7","9","12"],1,"Dãy đã sắp xếp, giá trị ở giữa là 7."],["Lớp 10 • Xác suất","Một đồng xu cân đối được tung một lần. Xác suất xuất hiện mặt ngửa là?",["0","1","1/2","2"],2,"Hai kết quả đồng khả năng nên xác suất là 1/2."],["Lớp 10 • Tổ hợp","Số cách chọn 2 học sinh từ 5 học sinh là?",["5","8","10","20"],2,"C(5,2)=5·4/2=10."],["Lớp 10 • Quy tắc cộng","Có 3 loại bút xanh và 2 loại bút đỏ khác nhau. Chọn một cây bút có bao nhiêu cách?",["5","6","1","4"],0,"Chọn một trong tổng số 3+2=5 loại."],["Lớp 10 • Nhị thức","Hệ số của x trong (x+2)^2 là?",["2","4","6","8"],1,"(x+2)^2=x²+4x+4 nên hệ số x là 4."],["Lớp 11 • Lượng giác","sin²x+cos²x bằng?",["0","1","2","sin x"],1,"Hệ thức lượng giác cơ bản: sin²x+cos²x=1."],["Lớp 11 • Lượng giác","Nghiệm của sin x=0 là?",["x=π/2+kπ","x=kπ","x=2kπ+π/2","x=π/4+kπ"],1,"sin x=0 khi x=kπ, k∈Z."],["Lớp 11 • Lượng giác","Giá trị của cos 0 bằng?",["0","-1","1","1/2"],2,"cos 0=1."],["Lớp 11 • Hàm lượng giác","Hàm số y=sin x là hàm số?",["Tuần hoàn với chu kỳ 2π","Không tuần hoàn","Tuần hoàn với chu kỳ π/2","Đồng biến trên R"],0,"sin x có chu kỳ 2π."],["Lớp 11 • Dãy số","Dãy 2,5,8,11,... là cấp số cộng với công sai?",["2","3","5","8"],1,"Mỗi số sau hơn số trước 3 đơn vị nên d=3."],["Lớp 11 • Cấp số cộng","Số hạng thứ 10 của cấp số cộng u1=4, d=3 là?",["28","30","31","34"],2,"u10=u1+9d=4+27=31."],["Lớp 11 • Cấp số nhân","Dãy 3,6,12,24,... là cấp số nhân với công bội?",["2","3","6","4"],0,"Mỗi số sau gấp đôi số trước nên q=2."],["Lớp 11 • Cấp số nhân","Số hạng thứ 5 của cấp số nhân u1=2, q=3 là?",["18","54","162","81"],2,"u5=2·3^4=162 — ồ, đáp án đúng là C. Đây là câu kiểm tra nội dung."],["Lớp 11 • Giới hạn","lim(x→2) (x+3) bằng?",["2","3","5","6"],2,"Hàm đa thức liên tục nên thay x=2 được 5."],["Lớp 11 • Giới hạn","lim(n→∞) 1/n bằng?",["1","∞","0","-1"],2,"Khi n tăng vô hạn, 1/n tiến về 0."],["Lớp 11 • Đạo hàm","Đạo hàm của f(x)=x² là?",["x","2x","x²","2"],1,"(x²)'=2x."],["Lớp 11 • Đạo hàm","Đạo hàm của f(x)=3x+5 là?",["3","5","3x","8"],0,"Đạo hàm của ax+b là a, nên bằng 3."],["Lớp 11 • Tiếp tuyến","Hệ số góc tiếp tuyến của y=x² tại x=2 là?",["2","4","6","8"],1,"y'=2x, tại x=2 được y'=4."],["Lớp 11 • Đơn điệu","Hàm y=x³ có đạo hàm trên R là?",["3x²","x²","3x","x³"],0,"(x³)'=3x²."],["Lớp 11 • Mũ","2^3 bằng?",["6","8","9","12"],1,"2³=8."],["Lớp 11 • Logarit","log₂8 bằng?",["2","3","4","8"],1,"2³=8 nên log₂8=3."],["Lớp 11 • Lũy thừa","a^m·a^n bằng?",["a^(m-n)","a^(mn)","a^(m+n)","(a+b)^(m+n)"],2,"Cùng cơ số thì cộng số mũ."],["Lớp 11 • Tổ hợp","Số cách sắp xếp 4 học sinh thành một hàng là?",["8","12","16","24"],3,"Có 4!=24 hoán vị."],["Lớp 11 • Xác suất","Gieo một xúc xắc cân đối. Xác suất ra số lớn hơn 4 là?",["1/6","1/3","1/2","2/3"],1,"Các mặt 5,6 thuận lợi: 2/6=1/3."],["Lớp 11 • Xác suất","Hai biến cố A và B độc lập thì P(A∩B) bằng?",["P(A)+P(B)","P(A)-P(B)","P(A)P(B)","P(A)/P(B)"],2,"Với biến cố độc lập, P(A∩B)=P(A)P(B)."],["Lớp 11 • Hình học không gian","Hai đường thẳng trong không gian có thể?",["Chỉ cắt nhau","Chỉ song song","Cắt nhau, song song hoặc chéo nhau","Luôn trùng nhau"],2,"Trong không gian có ba vị trí cơ bản: cắt, song song, chéo nhau."],["Lớp 11 • Hình học không gian","Hai mặt phẳng song song có bao nhiêu điểm chung?",["0 điểm","1 điểm","2 điểm","Vô số điểm"],0,"Hai mặt phẳng phân biệt song song không có điểm chung."],["Lớp 11 • Vector","Nếu a=(2,-1,3) thì |a| bằng?",["√12","√14","√10","6"],1,"|a|=√(2²+(-1)²+3²)=√14."],["Lớp 11 • Phương trình","Phương trình 2x+1=7 có nghiệm?",["x=2","x=3","x=4","x=5"],1,"2x=6 nên x=3."],["Lớp 11 • Hình học","Nếu hai đường thẳng vuông góc trong không gian thì góc giữa chúng bằng?",["30°","45°","90°","180°"],2,"Theo định nghĩa, hai đường thẳng vuông góc tạo góc 90°."]];

const LY_10_11_QUESTIONS = [["Lớp 10 • Chuyển động thẳng","Một xe đi đều với tốc độ 15 m/s trong 20 s. Quãng đường xe đi được là?",["300 m","35 m","75 m","150 m"],0,"s=vt=15·20=300 m."],["Lớp 10 • Vận tốc","Đổi 72 km/h ra m/s bằng?",["10 m/s","20 m/s","25 m/s","30 m/s"],1,"72 km/h = 72/3,6 = 20 m/s."],["Lớp 10 • Gia tốc","Một vật tăng vận tốc từ 5 m/s lên 17 m/s trong 4 s. Gia tốc trung bình là?",["2 m/s²","3 m/s²","4 m/s²","5 m/s²"],1,"a=(17-5)/4=3 m/s²."],["Lớp 10 • Rơi tự do","Bỏ qua lực cản không khí, vật rơi tự do gần mặt đất có gia tốc hướng?",["Ngang","Thẳng đứng xuống dưới","Thẳng đứng lên trên","Theo phương bất kỳ"],1,"Gia tốc trọng trường hướng thẳng đứng xuống dưới."],["Lớp 10 • Newton","Định luật I Newton còn gọi là định luật?",["Hấp dẫn","Quán tính","Bảo toàn năng lượng","Archimedes"],1,"Định luật I là định luật quán tính."],["Lớp 10 • Newton","Một lực 12 N tác dụng lên vật khối lượng 3 kg. Gia tốc của vật là?",["2 m/s²","3 m/s²","4 m/s²","36 m/s²"],2,"Theo F=ma, a=12/3=4 m/s²."],["Lớp 10 • Trọng lực","Trọng lượng của vật khối lượng 2 kg, lấy g=10 m/s², là?",["5 N","10 N","20 N","30 N"],2,"P=mg=2·10=20 N."],["Lớp 10 • Ma sát","Lực ma sát trượt có phương như thế nào so với vận tốc tương đối của hai bề mặt?",["Cùng chiều","Vuông góc","Ngược chiều","Không xác định"],2,"Ma sát trượt có phương tiếp tuyến và ngược chiều chuyển động tương đối."],["Lớp 10 • Công","Một lực 10 N cùng hướng chuyển động làm vật dịch chuyển 5 m. Công của lực là?",["2 J","15 J","50 J","100 J"],2,"A=Fs=10·5=50 J."],["Lớp 10 • Công suất","Một máy thực hiện công 600 J trong 20 s. Công suất là?",["20 W","30 W","40 W","120 W"],1,"P=A/t=600/20=30 W."],["Lớp 10 • Động năng","Vật m=2 kg chuyển động với v=3 m/s. Động năng bằng?",["3 J","6 J","9 J","18 J"],2,"Wđ=1/2·2·3²=9 J."],["Lớp 10 • Thế năng","Vật m=2 kg ở độ cao 5 m, g=10 m/s². Thế năng trọng trường là?",["10 J","50 J","100 J","200 J"],2,"Wt=mgh=2·10·5=100 J."],["Lớp 10 • Cơ năng","Nếu bỏ qua lực cản, cơ năng của vật trong trường trọng lực bảo toàn. Phát biểu này đúng vì?",["Động năng luôn bằng 0","Chỉ có lực thế thực hiện công","Khối lượng thay đổi","Gia tốc bằng 0"],1,"Trong trường hợp chỉ có lực thế như trọng lực, cơ năng được bảo toàn."],["Lớp 10 • Động lượng","Động lượng của vật khối lượng 4 kg chuyển động với 2 m/s là?",["2 kg·m/s","4 kg·m/s","6 kg·m/s","8 kg·m/s"],3,"p=mv=4·2=8 kg·m/s."],["Lớp 10 • Xung lượng","Xung lượng của lực không đổi được tính bằng?",["F/t","Ft","F+s","F/t²"],1,"Xung lượng của lực không đổi có độ lớn I=Ft."],["Lớp 10 • Bảo toàn động lượng","Hai vật va chạm trong hệ kín. Đại lượng nào được bảo toàn?",["Cơ năng trong mọi trường hợp","Động lượng của hệ","Động năng của từng vật","Tốc độ của từng vật"],1,"Trong hệ kín, tổng động lượng của hệ được bảo toàn."],["Lớp 10 • Chuyển động tròn","Trong chuyển động tròn đều, vectơ vận tốc có phương?",["Tiếp tuyến quỹ đạo","Hướng vào tâm","Hướng ra xa tâm","Luôn thẳng đứng"],0,"Vận tốc tức thời có phương tiếp tuyến với quỹ đạo."],["Lớp 10 • Chuyển động tròn","Công thức độ lớn gia tốc hướng tâm là?",["aht=v/r","aht=v²/r","aht=vr","aht=r/v²"],1,"Gia tốc hướng tâm aht=v²/r."],["Lớp 10 • Trọng lực","Gia tốc rơi tự do gần mặt đất có giá trị xấp xỉ?",["0,98 m/s²","9,8 m/s²","98 m/s²","980 m/s²"],1,"Gần mặt đất, g≈9,8 m/s²."],["Lớp 10 • Áp suất","Áp suất được định nghĩa là?",["Lực tác dụng trên một đơn vị diện tích","Khối lượng trên một đơn vị thể tích","Công trong một đơn vị thời gian","Vận tốc trên một đơn vị thời gian"],0,"p=F/S là áp lực trên một đơn vị diện tích."],["Lớp 10 • Khối lượng riêng","Một vật có khối lượng 2 kg và thể tích 0,5 m³. Khối lượng riêng là?",["1 kg/m³","2 kg/m³","4 kg/m³","8 kg/m³"],2,"ρ=m/V=2/0,5=4 kg/m³."],["Lớp 10 • Lực đẩy","Một vật nhúng trong chất lỏng chịu lực đẩy hướng nào?",["Thẳng đứng xuống","Nằm ngang","Thẳng đứng lên","Theo hướng chuyển động"],2,"Lực đẩy Archimedes có phương thẳng đứng, chiều từ dưới lên."],["Lớp 10 • Cân bằng","Một vật chịu hai lực cân bằng khi hai lực?",["Cùng chiều, khác độ lớn","Cùng độ lớn, cùng chiều","Cùng độ lớn, ngược chiều trên cùng đường tác dụng","Vuông góc nhau"],2,"Hai lực cân bằng có cùng độ lớn, ngược chiều và cùng đường tác dụng."],["Lớp 10 • Mômen","Mômen của lực đối với trục quay được tính bởi?",["M=F/d","M=Fd","M=F+d","M=F²d"],1,"Mômen lực có độ lớn M=F·d, với d là cánh tay đòn."],["Lớp 10 • Đòn bẩy","Muốn dùng đòn bẩy nâng vật nặng với lực nhỏ hơn, nên?",["Giảm cánh tay đòn của lực","Tăng cánh tay đòn của lực","Tăng trọng lượng vật","Đặt hai lực cùng chiều"],1,"Tăng cánh tay đòn của lực giúp giảm lực cần thiết khi mômen cân bằng."],["Lớp 11 • Điện tích","Hai điện tích cùng dấu đặt gần nhau sẽ?",["Hút nhau","Đẩy nhau","Không tương tác","Luôn đứng yên"],1,"Hai điện tích cùng dấu đẩy nhau."],["Lớp 11 • Định luật Coulomb","Độ lớn lực Coulomb giữa hai điện tích điểm trong chân không tỉ lệ với?",["Tích độ lớn hai điện tích và nghịch với bình phương khoảng cách","Tổng hai điện tích","Khoảng cách","Khối lượng điện tích"],0,"F=k|q1q2|/r²."],["Lớp 11 • Cường độ điện trường","Đơn vị SI của cường độ điện trường là?",["V","N/C","C/N","J"],1,"Cường độ điện trường có thể đo bằng N/C, tương đương V/m."],["Lớp 11 • Hiệu điện thế","Hiệu điện thế giữa hai điểm được liên hệ với công của lực điện theo công thức?",["U=A/q","U=Aq","U=q/A","U=F/q"],0,"U=A/q với A là công di chuyển điện tích q giữa hai điểm."],["Lớp 11 • Tụ điện","Điện dung của tụ điện được định nghĩa bởi?",["C=q/U","C=U/q","C=qU","C=q+U"],0,"C=q/U."],["Lớp 11 • Dòng điện","Cường độ dòng điện được tính bằng?",["I=qt","I=q/t","I=t/q","I=q+t"],1,"I=q/t, điện lượng qua tiết diện trong một đơn vị thời gian."],["Lớp 11 • Ohm","Định luật Ohm cho đoạn mạch chỉ chứa điện trở R là?",["I=UR","U=IR","R=UI","U=I/R"],1,"U=IR."],["Lớp 11 • Mạch nối tiếp","Trong mạch gồm các điện trở mắc nối tiếp, đại lượng nào giống nhau qua mọi điện trở?",["Hiệu điện thế","Cường độ dòng điện","Công suất","Điện trở"],1,"Mạch nối tiếp có cùng cường độ dòng điện qua các phần tử."],["Lớp 11 • Mạch song song","Trong mạch gồm các nhánh song song, đại lượng nào như nhau ở hai đầu mỗi nhánh?",["Cường độ dòng điện","Điện trở","Hiệu điện thế","Công suất"],2,"Các nhánh song song có cùng hiệu điện thế giữa hai đầu."],["Lớp 11 • Công suất điện","Công suất điện của thiết bị có hiệu điện thế U và dòng điện I là?",["P=U/I","P=UI","P=I/U","P=U+I"],1,"P=UI."],["Lớp 11 • Điện năng","Điện năng tiêu thụ của thiết bị công suất P hoạt động trong thời gian t là?",["A=Pt","A=P/t","A=t/P","A=P+t"],0,"Điện năng A=Pt."],["Lớp 11 • Nguồn điện","Nguồn điện có tác dụng chính là?",["Duy trì hiệu điện thế và cung cấp năng lượng cho mạch","Làm điện tích biến mất","Làm điện trở bằng 0","Chỉ làm dây nóng lên"],0,"Nguồn điện duy trì sự chênh lệch điện thế và cung cấp năng lượng cho mạch."],["Lớp 11 • Suất điện động","Đơn vị của suất điện động là?",["Ampere","Ohm","Volt","Coulomb"],2,"Suất điện động có đơn vị volt (V)."],["Lớp 11 • Từ trường","Từ trường tác dụng lực rõ rệt lên?",["Điện tích đứng yên trong mọi trường hợp","Nam châm và dòng điện","Chỉ vật cách điện","Chỉ chất lỏng"],1,"Từ trường tác dụng lực lên nam châm, dòng điện và điện tích chuyển động."],["Lớp 11 • Lực từ","Lực từ tác dụng lên đoạn dây có dòng điện trong từ trường có hướng thế nào?",["Song song với dây trong mọi trường hợp","Vuông góc với cả dòng điện và từ trường (khi không song song)","Luôn hướng theo dòng điện","Luôn hướng theo B"],1,"Lực từ vuông góc với phương dòng điện và cảm ứng từ trong cấu hình vuông góc."],["Lớp 11 • Cảm ứng điện từ","Hiện tượng xuất hiện dòng điện cảm ứng khi từ thông qua mạch biến thiên gọi là?",["Cảm ứng điện từ","Quang điện","Điện phân","Đối lưu"],0,"Đó là hiện tượng cảm ứng điện từ."],["Lớp 11 • Faraday","Suất điện động cảm ứng có độ lớn tỉ lệ với?",["Tốc độ biến thiên của từ thông qua mạch","Khối lượng vật","Điện trở bằng 0","Nhiệt độ phòng"],0,"Theo định luật Faraday, độ lớn suất điện động cảm ứng tỉ lệ với tốc độ biến thiên từ thông."],["Lớp 11 • Sóng cơ","Bước sóng λ liên hệ với vận tốc v và tần số f bởi?",["λ=vf","λ=v/f","λ=f/v","λ=v+f"],1,"v=λf nên λ=v/f."],["Lớp 11 • Giao thoa","Hai nguồn kết hợp muốn tạo giao thoa ổn định cần có?",["Cùng tần số và độ lệch pha không đổi theo thời gian","Khác tần số rất lớn","Biên độ luôn bằng 0","Không cần liên hệ pha"],0,"Hai nguồn kết hợp có cùng tần số và độ lệch pha không đổi."],["Lớp 11 • Dao động","Trong dao động điều hòa, tại vị trí cân bằng, tốc độ của vật có giá trị?",["Bằng 0","Lớn nhất","Không đổi bằng biên độ","Luôn âm"],1,"Tốc độ đạt giá trị lớn nhất khi vật qua vị trí cân bằng."],["Lớp 11 • Dao động","Chu kỳ dao động là?",["Thời gian thực hiện một dao động toàn phần","Số dao động trong một giây","Quãng đường đi trong một chu kỳ","Biên độ dao động"],0,"Chu kỳ T là thời gian để thực hiện một dao động toàn phần."],["Lớp 11 • Nhiệt học","Nhiệt lượng vật thu vào khi tăng nhiệt độ (không chuyển thể) được tính bởi?",["Q=mcΔt","Q=m/cΔt","Q=c/(mΔt)","Q=mc/t"],0,"Q=mcΔt."],["Lớp 11 • Chất khí","Ở thể tích không đổi, với một lượng khí xác định, áp suất tỉ lệ với?",["Nhiệt độ tuyệt đối","Khối lượng riêng của vật rắn","Diện tích bình","Màu sắc khí"],0,"V không đổi thì p/T là hằng số với lượng khí xác định."],["Lớp 11 • Bài tập điện","Một điện trở 6 Ω mắc vào nguồn 12 V. Cường độ dòng điện qua điện trở là?",["0,5 A","1 A","2 A","72 A"],2,"I=U/R=12/6=2 A."],["Lớp 11 • Bài tập công suất","Một thiết bị 220 V dùng dòng điện 2 A. Công suất điện của thiết bị là?",["110 W","220 W","440 W","880 W"],2,"P=UI=220·2=440 W."]];

const HOA_QUESTIONS = [
  ["pH", "Dung dịch có pH < 7 thường có tính gì?", ["Axit", "Bazơ", "Trung tính", "Muối"], 0, "pH nhỏ hơn 7 thường biểu thị môi trường axit."],
  ["NaCl", "NaCl thuộc loại hợp chất nào?", ["Ion", "Cộng hóa trị không cực", "Kim loại", "Polymer"], 0, "NaCl là hợp chất ion."],
  ["Nguyên tử", "Số hiệu nguyên tử cho biết số lượng?", ["Proton", "Neutron", "Electron lớp ngoài cùng", "Phân tử"], 0, "Số hiệu nguyên tử Z bằng số proton."],
  ["O2", "O2 là công thức của?", ["Khí oxygen", "Khí hydrogen", "Khí nitrogen", "Khí carbon dioxide"], 0, "O2 là phân tử oxygen."],
  ["H2O", "Khối lượng mol của H2O gần bằng?", ["18 g/mol", "16 g/mol", "20 g/mol", "2 g/mol"], 0, "2×1 + 16 = 18 g/mol."],
  ["CO2", "CO2 thuộc loại hợp chất nào?", ["Oxide", "Axit", "Bazơ", "Muối"], 0, "CO2 là oxide của carbon."],
  ["HCl", "HCl trong nước là?", ["Axit", "Bazơ", "Muối", "Kim loại"], 0, "HCl là acid hydrochloric."],
  ["NaOH", "NaOH là?", ["Bazơ", "Axit", "Muối", "Oxide"], 0, "NaOH là một bazơ mạnh."],
  ["Trung hòa", "Axit + bazơ thường tạo ra?", ["Muối và nước", "Kim loại", "Oxygen", "Polymer"], 0, "Phản ứng trung hòa tạo muối và nước."],
  ["Xúc tác", "Chất xúc tác có tác dụng gì?", ["Thay đổi tốc độ phản ứng", "Luôn bị tiêu hao hoàn toàn", "Làm phản ứng dừng", "Tạo nguyên tố mới"], 0, "Xúc tác làm thay đổi tốc độ phản ứng và thường không bị tiêu hao."],
  ["Bảng tuần hoàn", "Nhóm 1 gồm các kim loại nào đặc trưng?", ["Kim loại kiềm", "Halogen", "Khí hiếm", "Kim loại chuyển tiếp"], 0, "Nhóm 1 là nhóm kim loại kiềm, trừ hydrogen."],
  ["Oxi hóa", "Quá trình oxi hóa theo quan niệm electron là?", ["Nhường electron", "Nhận electron", "Nhận proton", "Nhường neutron"], 0, "Oxi hóa là quá trình nhường electron."],
  ["Khử", "Quá trình khử là?", ["Nhận electron", "Nhường electron", "Nhận neutron", "Tạo proton"], 0, "Khử là quá trình nhận electron."],
  ["Avogadro", "Một mol chứa khoảng bao nhiêu hạt?", ["6,02×10²³", "6,02×10²⁰", "9,8×10²³", "3×10⁸"], 0, "Hằng số Avogadro khoảng 6,02×10²³."],
  ["Fe và CuSO4", "Fe + CuSO4 tạo ra?", ["FeSO4 và Cu", "Fe2O3", "CuO và Fe", "H2SO4"], 0, "Sắt đẩy đồng ra khỏi muối: Fe + CuSO4 → FeSO4 + Cu."],
  ["Đá vôi", "Thành phần chính của đá vôi là?", ["CaCO3", "NaCl", "CaO", "CO"], 0, "Đá vôi chủ yếu chứa calcium carbonate CaCO3."],
  ["Methane", "CH4 là?", ["Methane", "Ethanol", "Ethene", "Acetic acid"], 0, "CH4 là methane."],
  ["Ethanol", "C2H5OH là?", ["Ethanol", "Methane", "Glucose", "Acetic acid"], 0, "C2H5OH là ethanol."],
  ["Este hóa", "Axit + alcohol thường tạo?", ["Este và nước", "Muối và oxygen", "Bazơ", "Kim loại"], 0, "Phản ứng ester hóa tạo este và nước."],
  ["Polymer", "Chất nào là polymer?", ["Polyethylene", "NaCl", "H2O", "CO2"], 0, "Polyethylene là polymer tổng hợp."],
];

const SINH_QUESTIONS = [
  ["Tế bào", "Bào quan thường được gọi là 'nhà máy năng lượng'?", ["Ty thể", "Ribosome", "Lục lạp", "Nhân"], 0, "Ty thể là nơi diễn ra phần lớn quá trình hô hấp tế bào."],
  ["DNA", "Các base của DNA gồm?", ["A, T, G, C", "A, U, G, C", "A, B, C, D", "X, Y, Z, T"], 0, "DNA chứa A, T, G, C."],
  ["Quang hợp", "Quang hợp ở thực vật chủ yếu diễn ra tại?", ["Lục lạp", "Ty thể", "Ribosome", "Không bào"], 0, "Lục lạp chứa chlorophyll và là nơi quang hợp."],
  ["Protein", "Bào quan trực tiếp tham gia tổng hợp protein?", ["Ribosome", "Lysosome", "Không bào", "Trung thể"], 0, "Ribosome là nơi diễn ra quá trình dịch mã."],
  ["Nhiễm sắc thể", "Tế bào soma người bình thường có bao nhiêu NST?", ["46", "23", "44", "48"], 0, "Tế bào soma người có 46 NST, gồm 23 cặp."],
  ["Giao tử", "Giao tử người bình thường có bao nhiêu NST?", ["23", "46", "44", "92"], 0, "Giao tử là tế bào đơn bội, có 23 NST."],
  ["Mendel", "Gregor Mendel nổi tiếng với nghiên cứu?", ["Di truyền học", "Tiến hóa", "Sinh thái học", "Vi sinh"], 0, "Mendel đặt nền móng cho di truyền học."],
  ["Kiểu gen", "Kiểu gen là?", ["Tổ hợp gene của cá thể", "Đặc điểm quan sát được", "Môi trường sống", "Quần thể"], 0, "Kiểu gen là toàn bộ tổ hợp gene của cá thể."],
  ["Alen trội", "Alen trội biểu hiện khi?", ["Có mặt trong kiểu gen theo quy luật tương ứng", "Luôn cần hai bản sao", "Chỉ khi không có môi trường", "Không bao giờ biểu hiện"], 0, "Alen trội có thể biểu hiện ở trạng thái đồng hợp hoặc dị hợp theo quy luật Mendel."],
  ["Hệ sinh thái", "Hệ sinh thái gồm?", ["Thành phần hữu sinh và vô sinh", "Chỉ động vật", "Chỉ thực vật", "Chỉ đất"], 0, "Hệ sinh thái gồm quần xã sinh vật và môi trường vô sinh."],
  ["Chuỗi thức ăn", "Chuỗi thức ăn thường bắt đầu bằng?", ["Sinh vật sản xuất", "Động vật ăn thịt", "Sinh vật phân giải", "Con người"], 0, "Sinh vật sản xuất thường là mắt xích đầu tiên."],
  ["Hô hấp", "Hô hấp tế bào có vai trò chính là?", ["Giải phóng năng lượng", "Tạo ánh sáng", "Tạo đất", "Tạo nước biển"], 0, "Hô hấp tế bào giải phóng năng lượng từ chất hữu cơ."],
  ["Máu", "Hồng cầu có chức năng chính?", ["Vận chuyển oxygen", "Tiêu hóa thức ăn", "Tạo insulin", "Lọc nước tiểu"], 0, "Hemoglobin trong hồng cầu giúp vận chuyển oxygen."],
  ["Tim", "Tim người bình thường có bao nhiêu ngăn?", ["4", "2", "3", "5"], 0, "Tim gồm 2 tâm nhĩ và 2 tâm thất."],
  ["Insulin", "Insulin được tiết ra chủ yếu bởi?", ["Tuyến tụy", "Gan", "Thận", "Tim"], 0, "Tế bào beta ở tuyến tụy tiết insulin."],
  ["Thận", "Đơn vị chức năng của thận là?", ["Nephron", "Neuron", "Alveolus", "Ribosome"], 0, "Nephron là đơn vị cấu tạo và chức năng của thận."],
  ["Darwin", "Charles Darwin nổi tiếng với học thuyết?", ["Tiến hóa bằng chọn lọc tự nhiên", "Tế bào", "Di truyền Mendel", "Vi trùng học"], 0, "Darwin phát triển học thuyết chọn lọc tự nhiên."],
  ["Giảm phân", "Giảm phân tạo ra tế bào có bộ NST?", ["Đơn bội", "Lưỡng bội", "Tam bội", "Tứ bội"], 0, "Giảm phân tạo giao tử đơn bội."],
  ["Đột biến", "Đột biến là?", ["Biến đổi vật chất di truyền", "Biến đổi thời tiết", "Thay đổi thức ăn", "Thay đổi môi trường בלבד"], 0, "Đột biến là biến đổi trong vật chất di truyền."],
  ["Vaccine", "Vaccine có tác dụng chủ yếu là?", ["Kích thích đáp ứng miễn dịch", "Làm tăng đường huyết", "Thay thế máu", "Tiêu hóa protein"], 0, "Vaccine giúp hệ miễn dịch hình thành đáp ứng bảo vệ."],
];

const SU_QUESTIONS = [
  ["1945", "Cách mạng tháng Tám thành công vào năm nào?", ["1945", "1944", "1946", "1954"], 0, "Cách mạng tháng Tám diễn ra năm 1945."],
  ["Điện Biên Phủ", "Chiến thắng Điện Biên Phủ diễn ra năm?", ["1954", "1950", "1953", "1956"], 0, "Chiến thắng Điện Biên Phủ năm 1954."],
  ["Geneva", "Hiệp định Genève về Đông Dương được ký năm?", ["1954", "1950", "1968", "1973"], 0, "Hiệp định Genève được ký năm 1954."],
  ["1975", "Ngày 30/4/1975 gắn với sự kiện nào?", ["Giải phóng miền Nam, thống nhất đất nước", "Đổi mới", "Gia nhập ASEAN", "Tổng tuyển cử 1946"], 0, "Ngày 30/4/1975 đánh dấu thắng lợi của chiến dịch Hồ Chí Minh."],
  ["Độc lập", "Tuyên ngôn Độc lập được đọc ngày nào?", ["2/9/1945", "19/8/1945", "30/4/1975", "7/5/1954"], 0, "Ngày Quốc khánh Việt Nam là 2/9/1945."],
  ["Đảng", "Đảng Cộng sản Việt Nam thành lập năm nào?", ["1930", "1925", "1945", "1954"], 0, "Đảng được thành lập năm 1930."],
  ["Ba Đình", "Tuyên ngôn Độc lập được đọc tại đâu?", ["Quảng trường Ba Đình", "Dinh Độc Lập", "Bến Nhà Rồng", "Quảng trường Lam Sơn"], 0, "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn tại Quảng trường Ba Đình."],
  ["ASEAN", "ASEAN được thành lập năm nào?", ["1967", "1954", "1975", "1986"], 0, "ASEAN thành lập năm 1967."],
  ["Liên Hợp Quốc", "Liên Hợp Quốc được thành lập năm nào?", ["1945", "1939", "1954", "1960"], 0, "Liên Hợp Quốc ra đời năm 1945."],
  ["Đổi mới", "Việt Nam bắt đầu công cuộc Đổi mới từ Đại hội nào?", ["Đại hội VI", "Đại hội IV", "Đại hội VIII", "Đại hội X"], 0, "Đại hội VI năm 1986 đề ra đường lối Đổi mới."],
  ["Bạch Đằng", "Năm 938, Ngô Quyền đánh thắng quân nào trên sông Bạch Đằng?", ["Nam Hán", "Tống", "Mông - Nguyên", "Minh"], 0, "Ngô Quyền đánh bại quân Nam Hán năm 938."],
  ["Lam Sơn", "Khởi nghĩa Lam Sơn bắt đầu năm nào?", ["1418", "1428", "1407", "1471"], 0, "Khởi nghĩa Lam Sơn bắt đầu năm 1418."],
  ["Tây Sơn", "Phong trào Tây Sơn bùng nổ vào năm nào?", ["1771", "1789", "1802", "1750"], 0, "Phong trào Tây Sơn bắt đầu năm 1771."],
  ["Quang Trung", "Chiến thắng Ngọc Hồi - Đống Đa gắn với vua nào?", ["Quang Trung", "Gia Long", "Lê Lợi", "Trần Nhân Tông"], 0, "Quang Trung đại phá quân Thanh năm 1789."],
  ["Pháp xâm lược", "Pháp nổ súng xâm lược Việt Nam năm 1858 tại?", ["Đà Nẵng", "Hà Nội", "Huế", "Sài Gòn"], 0, "Quân Pháp nổ súng tại Đà Nẵng năm 1858."],
  ["Hà Nội", "Ngày 19/8/1945 gắn với sự kiện nào?", ["Khởi nghĩa giành chính quyền ở Hà Nội", "Chiến thắng Điện Biên Phủ", "Ký Hiệp định Paris", "Đổi mới"], 0, "Ngày 19/8/1945, Hà Nội giành chính quyền."],
  ["Chiến tranh", "Chiến tranh Việt Nam kết thúc vào năm?", ["1975", "1973", "1976", "1968"], 0, "Năm 1975 đánh dấu kết thúc chiến tranh."],
  ["TP.HCM", "Sài Gòn - Gia Định được mang tên Thành phố Hồ Chí Minh từ năm?", ["1976", "1975", "1986", "1990"], 0, "Tên Thành phố Hồ Chí Minh được Quốc hội quyết định năm 1976."],
  ["Paris", "Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam ký năm?", ["1973", "1972", "1975", "1968"], 0, "Hiệp định Paris được ký năm 1973."],
  ["ASEAN", "Việt Nam gia nhập ASEAN vào năm nào?", ["1995", "1990", "1986", "2000"], 0, "Việt Nam trở thành thành viên ASEAN năm 1995."],
];

const DIA_QUESTIONS = [
  ["Khí hậu", "Việt Nam có kiểu khí hậu chủ yếu nào?", ["Nhiệt đới gió mùa", "Ôn đới", "Hàn đới", "Hoang mạc"], 0, "Việt Nam nằm trong vùng nhiệt đới gió mùa."],
  ["Đồng bằng", "Đồng bằng sông Hồng nằm chủ yếu ở?", ["Miền Bắc", "Miền Trung", "Tây Nguyên", "Nam Bộ"], 0, "Đồng bằng sông Hồng thuộc khu vực Bắc Bộ."],
  ["Đồng bằng", "Đồng bằng sông Cửu Long nằm ở?", ["Nam Bộ", "Bắc Bộ", "Tây Bắc", "Bắc Trung Bộ"], 0, "Đồng bằng sông Cửu Long nằm ở Nam Bộ."],
  ["Fansipan", "Đỉnh núi cao nhất Việt Nam là?", ["Fansipan", "Bạch Mã", "Ngọc Linh", "Langbiang"], 0, "Fansipan cao khoảng 3.143 m."],
  ["Sông", "Sông nào là một trong những hệ thống sông lớn của miền Bắc?", ["Sông Hồng", "Sông Đồng Nai", "Sông Tiền", "Sông Hậu"], 0, "Sông Hồng là hệ thống sông lớn ở miền Bắc."],
  ["Biển", "Bờ biển Việt Nam dài khoảng bao nhiêu?", ["Hơn 3.000 km", "500 km", "1.000 km", "10.000 km"], 0, "Bờ biển Việt Nam dài khoảng 3.260 km."],
  ["Khu vực", "Việt Nam thuộc khu vực nào của châu Á?", ["Đông Nam Á", "Đông Á", "Nam Á", "Tây Á"], 0, "Việt Nam nằm ở Đông Nam Á."],
  ["Biển Đông", "Việt Nam giáp vùng biển nào?", ["Biển Đông", "Địa Trung Hải", "Biển Đỏ", "Biển Baltic"], 0, "Biển Đông nằm ở phía đông và đông nam Việt Nam."],
  ["Gió mùa", "Gió mùa Đông Bắc ảnh hưởng rõ nhất đến?", ["Miền Bắc", "Đồng bằng sông Cửu Long", "Nam Trung Bộ", "Tây Nguyên"], 0, "Gió mùa Đông Bắc ảnh hưởng mạnh tới miền Bắc."],
  ["Gió mùa", "Gió mùa Tây Nam hoạt động mạnh vào?", ["Mùa hạ", "Mùa đông", "Mùa xuân בלבד", "Quanh năm như nhau"], 0, "Gió mùa Tây Nam chủ yếu hoạt động mùa hạ."],
  ["Tây Nguyên", "Tây Nguyên nổi tiếng với loại đất nào?", ["Đất đỏ bazan", "Đất phù sa", "Đất mặn", "Đất cát"], 0, "Đất đỏ bazan thích hợp với cây công nghiệp lâu năm."],
  ["Nông nghiệp", "Đồng bằng sông Cửu Long là vùng sản xuất mạnh về?", ["Lúa gạo", "Than đá", "Bauxite", "Chè"], 0, "Đây là vùng sản xuất lúa lớn nhất cả nước."],
  ["Dân cư", "Đồng bằng sông Hồng có đặc điểm?", ["Mật độ dân số cao", "Dân cư rất thưa", "Không có đô thị", "Chỉ làm lâm nghiệp"], 0, "Đồng bằng sông Hồng có mật độ dân số cao."],
  ["Rừng", "Bảo vệ rừng có ý nghĩa quan trọng đối với?", ["Bảo vệ đất và nguồn nước", "Tăng sa mạc hóa", "Giảm đa dạng sinh học", "Tăng xói mòn"], 0, "Rừng giúp bảo vệ đất, nước và đa dạng sinh học."],
  ["Đô thị hóa", "Đô thị hóa diễn ra mạnh ở?", ["Các thành phố lớn", "Vùng núi xa xôi", "Đảo hoang", "Nơi không có dân cư"], 0, "Các đô thị lớn có tốc độ đô thị hóa cao."],
  ["Than", "Tỉnh nổi tiếng về khai thác than ở Việt Nam?", ["Quảng Ninh", "Đồng Tháp", "An Giang", "Lâm Đồng"], 0, "Quảng Ninh là vùng than lớn của Việt Nam."],
  ["Bauxite", "Bauxite tập trung nhiều ở?", ["Tây Nguyên", "Đồng bằng sông Hồng", "Đồng bằng sông Cửu Long", "Đông Bắc"], 0, "Tây Nguyên có trữ lượng bauxite lớn."],
  ["Dầu khí", "Dầu khí của Việt Nam tập trung đáng kể ở?", ["Thềm lục địa phía Nam", "Tây Bắc", "Đồng bằng sông Hồng", "Tây Nguyên"], 0, "Dầu khí tập trung nhiều ở thềm lục địa phía Nam."],
  ["Thủy sản", "Nuôi trồng thủy sản phát triển mạnh ở?", ["Đồng bằng sông Cửu Long", "Tây Bắc", "Tây Nguyên", "Đông Bắc"], 0, "ĐBSCL có điều kiện thuận lợi cho nuôi trồng thủy sản."],
  ["Du lịch", "Một lợi thế của du lịch Việt Nam là?", ["Đa dạng khí hậu và cảnh quan", "Chỉ có một mùa", "Không có biển", "Không có di sản"], 0, "Việt Nam có biển, núi, đồng bằng và nhiều cảnh quan đa dạng."],
];

const ANH_QUESTIONS = [
  ["Grammar", "If I were you, I ___ harder.", ["would study", "will study", "studied", "study"], 0, "Câu điều kiện loại 2 dùng would + V."],
  ["Grammar", "She ___ here since 2020.", ["has lived", "lived", "lives", "is living"], 0, "Since + mốc thời gian thường dùng hiện tại hoàn thành."],
  ["Past Simple", "Yesterday, I ___ to school.", ["went", "go", "have gone", "going"], 0, "Yesterday là dấu hiệu của quá khứ đơn."],
  ["Present Perfect", "I ___ my homework.", ["have finished", "finish", "finished yesterday", "am finish"], 0, "Have finished là hiện tại hoàn thành."],
  ["Comparison", "This book is ___ than that one.", ["more interesting", "most interesting", "interestingest", "more interest"], 0, "Tính từ dài dùng more + adjective."],
  ["Superlative", "She is ___ student in the class.", ["the tallest", "taller", "tall", "most tall"], 0, "So sánh nhất dùng the + adjective-est với tính từ ngắn."],
  ["Modal", "You ___ wear a helmet when riding a motorbike.", ["must", "might", "couldn't", "would"], 0, "Must diễn tả sự bắt buộc."],
  ["Passive", "The book ___ by Nam.", ["was written", "wrote", "writes", "is write"], 0, "Bị động quá khứ: was/were + V3."],
  ["Reported Speech", "He said that he ___ tired.", ["was", "is", "will", "be"], 0, "Lùi thì: am/is → was trong câu tường thuật quá khứ."],
  ["Conditional", "If it rains, we ___ home.", ["will stay", "stayed", "would stayed", "stay yesterday"], 0, "Điều kiện loại 1: If + hiện tại, will + V."],
  ["Conjunction", "___ it was raining, we went out.", ["Although", "Because", "So", "Therefore"], 0, "Although diễn tả sự tương phản."],
  ["Reason", "I stayed home ___ I was sick.", ["because", "although", "but", "despite"], 0, "Because dùng để nêu nguyên nhân."],
  ["Plural", "The plural of child is?", ["children", "childs", "childes", "childrens"], 0, "Child → children."],
  ["Advice", "You ___ see a doctor.", ["should", "mustn't", "can't", "wouldn't"], 0, "Should thường dùng để đưa lời khuyên."],
  ["Preposition", "She is interested ___ music.", ["in", "on", "at", "for"], 0, "Cụm đúng: be interested in."],
  ["Expression", "I look forward to ___ you.", ["meeting", "meet", "met", "to meet"], 0, "Look forward to + V-ing."],
  ["Used to", "I used to ___ football.", ["play", "playing", "played", "plays"], 0, "Used to + động từ nguyên mẫu."],
  ["Too...to", "The box is too heavy ___.", ["to carry", "carrying", "carry", "carried"], 0, "Too + adjective + to V."],
  ["Neither", "___ Tom nor Mary is here.", ["Neither", "Either", "Both", "All"], 0, "Neither...nor mang nghĩa không... cũng không."],
  ["Vocabulary", "Which word means the natural world around us?", ["environment", "equipment", "employment", "entertainment"], 0, "Environment = môi trường."],
];

const GDCD_QUESTIONS = [
  ["Pháp luật", "Hiến pháp được hiểu là?", ["Luật cơ bản của Nhà nước", "Một nội quy lớp học", "Một hợp đồng", "Một quyển sách giáo khoa"], 0, "Hiến pháp là luật cơ bản của Nhà nước."],
  ["Bình đẳng", "Bình đẳng trước pháp luật có nghĩa là?", ["Mọi người có quyền và nghĩa vụ theo quy định pháp luật", "Không cần tuân thủ luật", "Chỉ người giàu mới có quyền", "Chỉ cán bộ mới chịu trách nhiệm"], 0, "Mọi người đều bình đẳng trước pháp luật trong phạm vi quy định."],
  ["Tự do", "Quyền tự do ngôn luận phải được thực hiện như thế nào?", ["Trong khuôn khổ pháp luật", "Muốn nói gì cũng được", "Không cần tôn trọng người khác", "Có thể xâm phạm bí mật người khác"], 0, "Quyền tự do luôn gắn với giới hạn do pháp luật quy định."],
  ["Thuế", "Thuế là khoản đóng góp như thế nào?", ["Bắt buộc theo quy định pháp luật", "Hoàn toàn tự nguyện", "Chỉ dành cho học sinh", "Chỉ doanh nghiệp mới đóng"], 0, "Thuế là khoản nộp theo quy định của pháp luật."],
  ["Giao thông", "Khi đèn đỏ bật, người tham gia giao thông phải?", ["Dừng lại", "Tăng tốc", "Đi ngược chiều", "Bấm còi liên tục"], 0, "Đèn đỏ báo hiệu phải dừng."],
  ["Hợp đồng", "Hợp đồng là sự thỏa thuận nhằm?", ["Xác lập quyền và nghĩa vụ", "Xóa mọi trách nhiệm", "Không có giá trị", "Thay thế Hiến pháp"], 0, "Hợp đồng tạo lập quyền và nghĩa vụ giữa các bên."],
  ["Nhân phẩm", "Tôn trọng nhân phẩm người khác là?", ["Ứng xử đúng mực và không xúc phạm", "Đăng thông tin riêng tư", "Chế giễu người khác", "Bịa đặt thông tin"], 0, "Mỗi người cần tôn trọng danh dự và nhân phẩm của người khác."],
  ["Đời tư", "Thông tin đời tư của người khác nên được?", ["Tôn trọng và bảo vệ theo pháp luật", "Tự ý đăng lên mạng", "Bán cho người khác", "Công khai mọi lúc"], 0, "Đời tư và dữ liệu cá nhân cần được tôn trọng."],
  ["Môi trường", "Bảo vệ môi trường là trách nhiệm của?", ["Mọi cá nhân và tổ chức", "Chỉ công ty môi trường", "Chỉ học sinh", "Chỉ Nhà nước"], 0, "Bảo vệ môi trường là trách nhiệm chung."],
  ["Trung thực", "Trung thực trong học tập thể hiện qua?", ["Tự làm bài, không gian lận", "Chép bài", "Mua điểm", "Nhờ người thi hộ"], 0, "Trung thực là một phẩm chất đạo đức quan trọng."],
  ["Khoan dung", "Khoan dung là?", ["Tôn trọng và biết tha thứ phù hợp", "Chấp nhận mọi hành vi phạm luật", "Không quan tâm ai", "Luôn đồng ý với mọi người"], 0, "Khoan dung không đồng nghĩa với bỏ qua hành vi trái pháp luật."],
  ["Quyền và nghĩa vụ", "Quyền của công dân thường đi kèm với?", ["Nghĩa vụ và trách nhiệm", "Không có trách nhiệm", "Đặc quyền tuyệt đối", "Miễn tuân thủ pháp luật"], 0, "Quyền và nghĩa vụ của công dân gắn bó với nhau."],
  ["Tự vệ", "Phòng vệ chính đáng cần được thực hiện?", ["Trong giới hạn pháp luật cho phép", "Bằng mọi cách", "Không có giới hạn", "Bất kể hậu quả"], 0, "Phòng vệ phải phù hợp quy định pháp luật."],
  ["Tài sản", "Quyền sở hữu thường gồm?", ["Chiếm hữu, sử dụng, định đoạt", "Chỉ mua bán", "Chỉ sử dụng", "Chỉ cất giữ"], 0, "Ba quyền cơ bản là chiếm hữu, sử dụng và định đoạt."],
  ["Người tiêu dùng", "Khi mua hàng, người tiêu dùng nên?", ["Kiểm tra thông tin và hóa đơn", "Không cần xem sản phẩm", "Đưa mật khẩu ngân hàng", "Bỏ qua nguồn gốc"], 0, "Kiểm tra thông tin giúp bảo vệ quyền lợi người tiêu dùng."],
  ["Bình đẳng giới", "Bình đẳng giới hướng tới?", ["Cơ hội và quyền bình đẳng", "Một giới có mọi quyền", "Phân biệt nghề nghiệp", "Hạn chế cơ hội"], 0, "Bình đẳng giới nhằm bảo đảm quyền và cơ hội bình đẳng."],
  ["Mạng xã hội", "Khi sử dụng mạng xã hội nên?", ["Tôn trọng pháp luật và quyền riêng tư", "Đăng mọi thông tin cá nhân của người khác", "Lan truyền tin chưa kiểm chứng", "Mạo danh người khác"], 0, "Ứng xử trên mạng cũng cần tuân thủ pháp luật."],
  ["Tình nguyện", "Hoạt động tình nguyện thường thể hiện?", ["Tinh thần tự nguyện và trách nhiệm cộng đồng", "Ép buộc", "Vụ lợi bắt buộc", "Trốn tránh trách nhiệm"], 0, "Tình nguyện hướng tới đóng góp cho cộng đồng trên tinh thần tự nguyện."],
  ["Nhà nước pháp quyền", "Trong Nhà nước pháp quyền, ai phải tuân thủ pháp luật?", ["Mọi tổ chức và cá nhân", "Chỉ người dân", "Chỉ doanh nghiệp", "Chỉ học sinh"], 0, "Mọi cá nhân, tổ chức đều phải tuân thủ pháp luật."],
  ["Trách nhiệm", "Khi làm sai, thái độ phù hợp là?", ["Nhận trách nhiệm và khắc phục", "Đổ lỗi cho người khác", "Che giấu", "Xóa bằng chứng"], 0, "Nhận trách nhiệm và khắc phục là cách ứng xử tích cực."],
];

const MEO_QUESTIONS = [
  ["Câu đố", "Thứ gì có rất nhiều phím nhưng không mở được ổ khóa?", ["Bàn phím", "Chìa khóa", "Cửa", "Tủ"], 0, "Bàn phím có nhiều phím nhưng không phải chìa khóa."],
  ["Câu đố", "Thứ gì đi lên đi xuống nhưng không di chuyển?", ["Cầu thang", "Xe máy", "Thang máy", "Con người"], 0, "Cầu thang có hướng lên xuống nhưng đứng yên."],
  ["Câu đố", "Cái gì có kim và mặt nhưng không có tay?", ["Đồng hồ", "Con mèo", "Cái bàn", "Cái kéo"], 0, "Đồng hồ có kim và mặt đồng hồ."],
  ["Câu đố", "Cái gì có cổ nhưng không có đầu?", ["Cái chai", "Con người", "Con ngựa", "Cái bàn"], 0, "Chai có phần cổ chai."],
  ["Câu đố", "Cái gì càng lau càng ướt?", ["Khăn", "Bàn", "Sàn", "Giấy"], 0, "Khăn lau nước sẽ bị ướt."],
  ["Câu đố", "Cái gì có một mắt nhưng không nhìn thấy?", ["Cây kim", "Con mèo", "Con chim", "Cái cốc"], 0, "Kim khâu có mắt kim."],
  ["Câu đố", "Cái gì có răng nhưng không cắn?", ["Cái lược", "Con chó", "Cá mập", "Con ngựa"], 0, "Lược có các răng lược."],
  ["Câu đố", "Cái gì có thành phố, sông nhưng không có người và nước thật?", ["Bản đồ", "Quyển sách", "Điện thoại", "Tivi"], 0, "Bản đồ có ký hiệu thành phố và sông."],
  ["Câu đố", "Cái gì có nhiều chữ nhưng không biết nói?", ["Quyển sách", "Con người", "Điện thoại", "Radio"], 0, "Sách có chữ nhưng không tự nói."],
  ["Câu đố", "Tháng nào cũng có ít nhất 28 ngày?", ["Tất cả các tháng", "Tháng 2 בלבד", "Tháng 1", "Tháng 12"], 0, "Mọi tháng đều có ít nhất 28 ngày."],
  ["Câu đố", "Thứ gì đi vòng quanh thế giới nhưng vẫn nằm ở một góc?", ["Tem thư", "Máy bay", "Xe", "Con tàu"], 0, "Tem nằm ở góc phong bì nhưng có thể đi khắp thế giới."],
  ["Câu đố", "Cái gì có chân nhưng không đi?", ["Cái bàn", "Con chó", "Con mèo", "Con người"], 0, "Bàn có chân bàn."],
  ["Câu đố", "Cái gì có thể bắt nhưng không thể ném?", ["Cảm lạnh", "Quả bóng", "Con cá", "Chiếc túi"], 0, "Ta có thể 'catch a cold'."],
  ["Câu đố", "Thứ gì thuộc về bạn nhưng người khác dùng nhiều hơn?", ["Tên của bạn", "Đôi giày", "Xe của bạn", "Nhà bạn"], 0, "Người khác thường gọi tên bạn nhiều hơn chính bạn."],
  ["Câu đố", "Cái gì có mặt và hai tay nhưng không có chân?", ["Đồng hồ", "Cái ghế", "Con người", "Cái kéo"], 0, "Đồng hồ có mặt và hai kim."],
  ["Câu đố", "Cái gì có rất nhiều lỗ nhưng vẫn giữ được nước?", ["Miếng bọt biển", "Cái rổ", "Cái lưới", "Cái sàng"], 0, "Bọt biển có nhiều lỗ nhỏ nhưng giữ nước."],
  ["Câu đố", "Cái gì có thể bị phá vỡ mà không cần chạm vào?", ["Lời hứa", "Cái ly", "Cánh cửa", "Chiếc bàn"], 0, "Ta có thể phá vỡ một lời hứa."],
  ["Câu đố", "Cái gì rơi xuống nhưng không bao giờ đi lên?", ["Mưa", "Bóng", "Khói", "Bóng bay"], 0, "Mưa rơi xuống mặt đất."],
  ["Câu đố", "Cái gì có đầu và đuôi nhưng không có thân?", ["Đồng xu", "Con cá", "Con rắn", "Cái chai"], 0, "Đồng xu có mặt đầu và mặt đuôi."],
  ["Câu đố", "Càng lấy đi nhiều thì nó càng lớn là gì?", ["Cái hố", "Cái túi", "Cái hộp", "Đống sách"], 0, "Càng đào lấy đất thì cái hố càng lớn."],
];

const varyQuestionChoices = (choices, answer, seed=0) => {
  const list = [...choices];
  const shift = ((seed % list.length) + list.length) % list.length;
  const reordered = list.map((_, idx) => list[(idx - shift + list.length) % list.length]);
  return {
    choices: reordered,
    answer: (answer + shift) % list.length
  };
};

const toQuestions = (subject, key, rows) =>
  rows.map((r, i) => {
    const varied = varyQuestionChoices(r[2], r[3], i + key.length);
    return {
      id: `${key}${String(i + 1).padStart(2, "0")}`,
      subject,
      topic: r[0],
      q: r[1],
      choices: varied.choices,
      answer: varied.answer,
      explanation: r[4],
    };
  });

const MODAL_VERB_QUESTIONS = [
  ["Modal Verbs • can","I ___ swim when I was five.",["can","could","may","must"],1,"Use 'could' to talk about a general ability in the past."],
  ["Modal Verbs • can","___ you help me carry these books?",["Can","Must","Should","Might"],0,"'Can you...?' is a common way to make a request."],
  ["Modal Verbs • can","You ___ use my laptop if you need it.",["can","must","should","would"],0,"'Can' can express permission."],
  ["Modal Verbs • can","It ___ be very cold here in winter.",["can","must","has to","ought"],0,"'Can' can describe a general possibility."],
  ["Modal Verbs • can't","You ___ park here; it is for buses only.",["can't","should","may","would"],0,"'Can't' expresses prohibition."],
  ["Modal Verbs • could","When I was young, I ___ run 10 km without stopping.",["could","can","may","must"],0,"'Could' expresses past ability."],
  ["Modal Verbs • could","___ I borrow your pen, please?",["Could","Must","Need","Shall"],0,"'Could I...?' is a polite request for permission."],
  ["Modal Verbs • could","The problem ___ be solved with a simpler method.",["could","must","has to","ought"],0,"'Could' can express a possible solution."],
  ["Modal Verbs • could","We ___ go to the museum this afternoon if it stops raining.",["could","must","need","shall"],0,"'Could' can express a possible plan."],
  ["Modal Verbs • could have","She ___ have missed the train; she arrived very late.",["could","must","should","shall"],0,"'Could have' can express a past possibility."],
  ["Modal Verbs • may","___ I come in, teacher?",["May","Must","Would","Ought"],0,"'May I...?' is a formal request for permission."],
  ["Modal Verbs • may","Students ___ use calculators in this test.",["may","must","should","would"],0,"'May' can give permission."],
  ["Modal Verbs • may","It ___ rain tonight, so take an umbrella.",["may","must","has to","ought"],0,"'May' expresses possibility."],
  ["Modal Verbs • may","You ___ be right about the answer.",["may","must","need","shall"],0,"'May' can show that something is possible."],
  ["Modal Verbs • might","We ___ be late because of the traffic.",["might","must","can","shall"],0,"'Might' expresses a weaker possibility."],
  ["Modal Verbs • might","He ___ come to the party, but he is not sure.",["might","has to","must","should"],0,"'Might' expresses uncertainty."],
  ["Modal Verbs • might","I thought you ___ know the answer.",["might","must","have to","shall"],0,"'Might' can express a tentative possibility."],
  ["Modal Verbs • might have","They ___ have taken the wrong road.",["might","should","must","can"],0,"'Might have + past participle' expresses a past possibility."],
  ["Modal Verbs • must","You ___ wear a seat belt in a car.",["must","might","could","would"],0,"'Must' expresses strong obligation."],
  ["Modal Verbs • must","I ___ finish this report before 5 p.m.",["must","may","could","would"],0,"'Must' expresses a strong requirement."],
  ["Modal Verbs • must","You ___ not touch that wire; it is dangerous.",["must","could","would","might"],0,"'Must not' expresses a strong prohibition."],
  ["Modal Verbs • must","She ___ be exhausted after working all night.",["must","can","may","would"],0,"'Must' can express a strong deduction."],
  ["Modal Verbs • must have","The lights are on, so they ___ be at home.",["must","could","might","should"],0,"'Must be' expresses a strong present deduction."],
  ["Modal Verbs • must have","He left at 6 a.m., so he ___ have arrived by now.",["must","can","might","would"],0,"'Must have + past participle' expresses a strong deduction about the past."],
  ["Modal Verbs • have to","I ___ go to school tomorrow because we have an exam.",["have to","might","could","would"],0,"'Have to' expresses external obligation."],
  ["Modal Verbs • have to","She ___ wear a uniform at her school.",["has to","may","could","would"],0,"'Has to' expresses an obligation."],
  ["Modal Verbs • have to","Do we ___ bring our own food?",["have to","must to","should to","can to"],0,"After 'do', use 'have to' to express obligation."],
  ["Modal Verbs • don't have to","You ___ bring a towel; the hotel provides one.",["don't have to","mustn't","couldn't","can't"],0,"'Don't have to' means it is not necessary."],
  ["Modal Verbs • doesn't have to","Tom ___ work on Sundays.",["doesn't have to","mustn't","can't","shouldn't to"],0,"'Doesn't have to' means there is no obligation."],
  ["Modal Verbs • had to","We ___ leave early because the last bus was at 9 p.m.",["had to","must","could","may"],0,"'Had to' is the past form of 'have to' for past obligation."],
  ["Modal Verbs • had to","She ___ cancel the trip because she was ill.",["had to","might","would","can"],0,"'Had to' expresses a past necessity."],
  ["Modal Verbs • should","You ___ drink more water every day.",["should","mustn't","can","would"],0,"'Should' is used to give advice."],
  ["Modal Verbs • should","We ___ leave now if we want to catch the train.",["should","may","could","would"],0,"'Should' can give advice or a recommendation."],
  ["Modal Verbs • should","You ___ apologize for being rude.",["should","might","can","shall"],0,"'Should' expresses what is advisable."],
  ["Modal Verbs • should","The package ___ arrive tomorrow.",["should","mustn't","can't","wouldn't"],0,"'Should' can express an expectation."],
  ["Modal Verbs • shouldn't","You ___ eat so much fast food.",["shouldn't","must","may","can"],0,"'Shouldn't' gives negative advice."],
  ["Modal Verbs • shouldn't","We ___ ignore the teacher's instructions.",["shouldn't","could","might","will"],0,"'Shouldn't' means something is not advisable."],
  ["Modal Verbs • should have","You ___ have told me earlier.",["should","can","must","may"],0,"In 'should have + past participle', 'should' expresses past advice or regret."],
  ["Modal Verbs • should have","He ___ have studied more for the test.",["should","might","can","will"],0,"'Should have studied' expresses what was advisable in the past but did not happen."],
  ["Modal Verbs • ought to","You ___ respect your parents.",["ought to","can","might","mustn't"],0,"'Ought to' is used for advice or moral duty."],
  ["Modal Verbs • ought to","We ___ be more careful next time.",["ought to","would","may","can't"],0,"'Ought to' means something is advisable or expected."],
  ["Modal Verbs • ought to","The students ___ arrive before 7:30.",["ought to","could","might","would"],0,"'Ought to' can express expectation."],
  ["Modal Verbs • would","___ you like some tea?",["Would","Must","Need","Could to"],0,"'Would you like...?' is a polite offer."],
  ["Modal Verbs • would","When we were children, we ___ play outside every evening.",["would","must","may","can"],0,"'Would' can describe repeated past habits."],
  ["Modal Verbs • would","I ___ help you if I had more time.",["would","must","may","can"],0,"'Would' is used in the main clause of a second conditional."],
  ["Modal Verbs • would","___ you mind closing the window?",["Would","Must","Shall","Need"],0,"'Would you mind...?' is a polite request."],
  ["Modal Verbs • wouldn't","My old computer ___ start this morning.",["wouldn't","mustn't","shouldn't","can't"],0,"'Wouldn't' can describe refusal or failure to operate in the past."],
  ["Modal Verbs • will","I ___ call you when I arrive.",["will","might","mustn't","could"],0,"'Will' expresses a future decision or promise."],
  ["Modal Verbs • will","Don't worry. I ___ help you with the project.",["will","may","could","shouldn't"],0,"'Will' can express a willingness to help."],
  ["Modal Verbs • will","If it rains, the match ___ be cancelled.",["will","could have","mustn't","would have"],0,"In the first conditional, use 'will' in the result clause."],
  ["Modal Verbs • won't","The door ___ open. It must be locked.",["won't","shouldn't","may not","couldn't"],0,"'Won't' can describe something refusing or failing to operate."],
  ["Modal Verbs • shall","___ we start the meeting now?",["Shall","Must","Could to","May not"],0,"'Shall we...?' is used to make a suggestion."],
  ["Modal Verbs • shall","___ I carry that bag for you?",["Shall","Would","Must","Ought"],0,"'Shall I...?' can offer help or ask for instructions."],
  ["Modal Verbs • need","You ___ bring a pen; there are plenty here.",["needn't","mustn't","can't","couldn't"],0,"'Needn't' means something is not necessary."],
  ["Modal Verbs • needn't","You ___ worry about the results yet.",["needn't","must","should to","can to"],0,"'Needn't' expresses lack of necessity."],
  ["Modal Verbs • needn't have","You ___ have bought more food; we already had enough.",["needn't","mustn't","can't","wouldn't"],0,"'Needn't have + past participle' means the action was unnecessary but happened."],
  ["Modal Verbs • be able to","After months of practice, she ___ play the piano very well.",["is able to","must to","may to","should to"],0,"'Be able to' expresses ability."],
  ["Modal Verbs • be able to","Will you ___ finish the work by Friday?",["be able to","must","can to","should"],0,"After 'will', use 'be able to' for future ability."],
  ["Modal Verbs • be able to","He wasn't ___ attend the meeting yesterday.",["able to","can","could to","must to"],0,"After 'wasn't', use 'able to' to express inability."],
  ["Modal Verbs • permission","Visitors ___ not enter this area without a badge.",["may","could","would","should"],0,"'May not' can express a formal prohibition."],
  ["Modal Verbs • permission","You ___ leave early today if you finish your work.",["may","must","shouldn't","wouldn't"],0,"'May' can give permission."],
  ["Modal Verbs • prohibition","Employees ___ use their phones during the safety briefing.",["mustn't","might","could","would"],0,"'Mustn't' expresses prohibition."],
  ["Modal Verbs • prohibition","You ___ tell anyone this password.",["mustn't","may","should","can"],0,"'Mustn't' means you are not allowed to do it."],
  ["Modal Verbs • possibility","It ___ snow in the mountains tonight.",["might","must","has to","shouldn't"],0,"'Might' expresses possibility."],
  ["Modal Verbs • possibility","Anyone ___ make a mistake sometimes.",["can","must","shall","would"],0,"'Can' can describe a general possibility."],
  ["Modal Verbs • deduction","The ground is wet. It ___ have rained.",["must","can","shouldn't","would"],0,"'Must have + past participle' expresses a strong deduction about the past."],
  ["Modal Verbs • deduction","She isn't answering her phone. She ___ be asleep.",["might","mustn't","can't to","would"],0,"'Might be' expresses a possible explanation."],
  ["Modal Verbs • deduction","That ___ be John's car; he sold his car last week.",["can't","should","may","would"],0,"'Can't be' expresses a strong belief that something is impossible."],
  ["Modal Verbs • can't have","They arrived at 10:00. They ___ have seen the announcement at 9:30.",["couldn't","must","should","may"],0,"'Couldn't have + past participle' expresses an impossible past situation."],
  ["Modal Verbs • advice","If you have a headache, you ___ rest.",["should","mustn't","couldn't","would"],0,"'Should' is commonly used for advice."],
  ["Modal Verbs • advice","You ___ see a doctor if the pain continues.",["should","may","can","would"],0,"'Should' gives advice."],
  ["Modal Verbs • advice","We ___ leave a little earlier to avoid traffic.",["should","might","mustn't","can't"],0,"'Should' suggests a sensible action."],
  ["Modal Verbs • obligation","All passengers ___ show their tickets before boarding.",["must","could","might","would"],0,"'Must' expresses a strong rule or obligation."],
  ["Modal Verbs • obligation","You ___ submit the form by Friday.",["have to","may","could","would"],0,"'Have to' expresses an obligation."],
  ["Modal Verbs • obligation","We ___ wear helmets on this construction site.",["have to","might","can","would"],0,"'Have to' expresses an external safety requirement."],
  ["Modal Verbs • no necessity","You ___ pay now; payment can be made next week.",["don't have to","mustn't","can't","shouldn't"],0,"'Don't have to' means payment is not necessary now."],
  ["Modal Verbs • no necessity","She ___ come with us if she is busy.",["doesn't have to","mustn't","can't","shouldn't to"],0,"'Doesn't have to' expresses lack of obligation."],
  ["Modal Verbs • past ability","Before the accident, he ___ drive for eight hours without a break.",["could","can","may","must"],0,"'Could' expresses ability in the past."],
  ["Modal Verbs • past permission","When I was a child, I ___ stay up late on Saturdays.",["could","must","should","may"],0,"'Could' can describe past permission in context."],
  ["Modal Verbs • polite request","___ you please send me the file again?",["Could","Must","Shall","Need"],0,"'Could you...?' is a polite request."],
  ["Modal Verbs • polite request","___ you mind opening the door?",["Would","Must","May","Shall"],0,"'Would you mind...?' is a polite request."],
  ["Modal Verbs • offer","___ I get you a glass of water?",["Shall","Must","Should to","Might not"],0,"'Shall I...?' can be used to offer help."],
  ["Modal Verbs • suggestion","___ we order pizza tonight?",["Shall","Must","Need","Could to"],0,"'Shall we...?' is a common suggestion."],
  ["Modal Verbs • conditional","If I were you, I ___ study a little every day.",["would","must","can","may"],0,"'Would' is used in the second conditional."],
  ["Modal Verbs • conditional","If she had more time, she ___ learn another language.",["would","must","can","shall"],0,"'Would' is the usual result-clause modal in a second conditional."],
  ["Modal Verbs • conditional","If you ask him, he ___ help you.",["may","mustn't","would have","shouldn't"],0,"'May' expresses a possible result."],
  ["Modal Verbs • conditional","If we leave now, we ___ catch the 7:00 train.",["can","mustn't","would have","might not to"],0,"'Can' can express possibility or opportunity in a conditional sentence."],
  ["Modal Verbs • past regret","I ___ have listened to your advice.",["should","must","can","may"],0,"'Should have + past participle' can express regret."],
  ["Modal Verbs • past possibility","He ___ have left before we arrived.",["may","mustn't","should to","can"],0,"'May have + past participle' expresses a past possibility."],
  ["Modal Verbs • past possibility","She ___ have forgotten the meeting.",["might","mustn't","can to","shall"],0,"'Might have + past participle' expresses a past possibility."],
  ["Modal Verbs • past deduction","The exam was easy, so they ___ have finished early.",["must","can't","shouldn't","wouldn't"],0,"'Must have finished' is a strong deduction about the past."],
  ["Modal Verbs • past impossibility","He was in London that day, so he ___ have attended the meeting in Hanoi.",["couldn't","must","should","may"],0,"'Couldn't have + past participle' expresses an impossible past event."],
  ["Modal Verbs • grammar","Which sentence is correct?",["She can sings.","She can sing.","She cans sing.","She can to sing."],1,"A modal verb is followed by the base form of the verb: 'can sing'."],
  ["Modal Verbs • grammar","Which sentence is correct?",["He must to leave now.","He must leaves now.","He must leave now.","He must leaving now."],2,"After 'must', use the base form: 'must leave'."],
  ["Modal Verbs • grammar","Which sentence is correct?",["You should to study.","You should studying.","You should studied.","You should study."],3,"After 'should', use the base form: 'should study'."],
  ["Modal Verbs • grammar","Which sentence is correct?",["They might come later.","They might comes later.","They might to come later.","They might coming later."],0,"After 'might', use the base form: 'might come'."],
  ["Modal Verbs • grammar","Choose the correct negative form: 'He ___ drive because he is too young.'",["mustn't","mustn't to","doesn't must","must not to"],0,"The correct negative modal form is 'mustn't'."],
  ["Modal Verbs • grammar","Choose the correct question: '___ I open the window?'",["May","May to","Am may","Do may"],0,"Use 'May I + base verb?' to ask for permission."],
  ["Modal Verbs • grammar","Choose the correct sentence.",["Does she can swim?","Can she swim?","Can she swims?","Can does she swim?"],1,"Questions with 'can' use inversion: 'Can she swim?'"],
  ["Modal Verbs • grammar","Choose the correct sentence.",["Do you should go now?","Should you to go now?","Should you go now?","Should do you go now?"],2,"With 'should', form the question as 'Should + subject + base verb?'"]
];


/* =========================================================
   TIẾNG TRUNG HSK 4 + HSK 5
   50 câu mỗi cấp
========================================================= */
const HSK4_QUESTIONS = [
    ["HSK4 • 语法", "他___去过北京两次。", ["已经", "正在", "马上", "如果"], 0, "“已经”表示某个动作已经发生。"],
    ["HSK4 • 词汇", "“提高”的意思最接近：", ["增加、提升", "减少", "停止", "忘记"], 0, "提高表示使水平、数量等上升。"],
    ["HSK4 • 阅读", "因为下雨，比赛___了。", ["取消", "参加", "通过", "准备"], 0, "下雨导致比赛被取消。"],
    ["HSK4 • 词汇", "“准时”最接近：", ["按规定时间到达", "很早到达", "经常迟到", "提前离开"], 0, "准时就是按照规定的时间。"],
    ["HSK4 • 语法", "如果明天下雨，我们___在家学习。", ["就", "才", "又", "越"], 0, "如果……就……表示条件关系。"],
    ["HSK4 • 词汇", "“适合”最接近：", ["合适", "困难", "浪费", "拒绝"], 0, "适合表示合适、相宜。"],
    ["HSK4 • 语法", "我对中国历史___感兴趣。", ["非常", "已经", "马上", "虽然"], 0, "“非常”修饰形容词或心理状态。"],
    ["HSK4 • 阅读", "他每天坚持跑步，所以身体越来越___。", ["健康", "安静", "复杂", "严格"], 0, "坚持运动有助于身体健康。"],
    ["HSK4 • 词汇", "“估计”最接近：", ["推测", "证明", "忘记", "命令"], 0, "估计表示根据情况进行推测。"],
    ["HSK4 • 语法", "她一边听音乐，___做作业。", ["一边", "虽然", "因为", "于是"], 0, "一边……一边……表示两个动作同时进行。"],
    ["HSK4 • 词汇", "“经验”是指：", ["从实践中得到的认识", "一种考试", "一件衣服", "一种天气"], 0, "经验通常来自实践和经历。"],
    ["HSK4 • 阅读", "这家饭店的菜不但便宜，而且___。", ["好吃", "迟到", "安静地", "如果"], 0, "不但……而且……连接两个积极特点。"],
    ["HSK4 • 语法", "他昨天晚上十点___回家。", ["才", "又", "越", "被"], 0, "“才”表示动作发生得晚。"],
    ["HSK4 • 词汇", "“复杂”的反义词是：", ["简单", "热闹", "重要", "认真"], 0, "复杂与简单相对。"],
    ["HSK4 • 阅读", "为了提高汉语水平，她每天都___生词。", ["复习", "关闭", "邀请", "搬"], 0, "复习生词有助于提高语言水平。"],
    ["HSK4 • 语法", "这本书___我借给你的。", ["是", "在", "把", "从"], 0, "“是……的”可用于强调过去动作的相关信息。"],
    ["HSK4 • 词汇", "“及时”最接近：", ["在适当的时候", "很久以后", "从来没有", "完全相反"], 0, "及时表示在需要的时候迅速做出反应。"],
    ["HSK4 • 阅读", "虽然工作很忙，但是他___每天学习汉语。", ["仍然", "已经", "马上", "只要"], 0, "虽然……但是……表示转折，“仍然”表示继续。"],
    ["HSK4 • 语法", "请你把这份文件___我。", ["交给", "经过", "超过", "由于"], 0, "把字句中“交给我”表示递交对象。"],
    ["HSK4 • 词汇", "“熟悉”的反义表达最接近：", ["陌生", "准确", "方便", "热情"], 0, "熟悉与陌生相对。"],
    ["HSK4 • 词汇", "“安排”最接近：", ["计划并确定时间或顺序", "拒绝别人", "忘记事情", "改变天气"], 0, "安排表示计划并确定事情的顺序或时间。"],
    ["HSK4 • 词汇", "“发现”最接近：", ["察觉到", "丢掉", "借给", "等待"], 0, "发现表示察觉或找到原来不知道的事情。"],
    ["HSK4 • 语法", "他已经吃完饭了，___去散步。", ["准备", "如果", "虽然", "因为"], 0, "“准备”表示打算做某事。"],
    ["HSK4 • 词汇", "“压力”最接近：", ["精神或生活上的负担", "假期", "奖励", "天气"], 0, "压力指让人感到负担或紧张的因素。"],
    ["HSK4 • 阅读", "为了身体健康，他决定___早睡早起。", ["养成", "取消", "打扰", "拒绝"], 0, "养成习惯是固定搭配。"],
    ["HSK4 • 语法", "我___没想到他会这么快回来。", ["完全", "正在", "如果", "于是"], 0, "完全可以修饰没想到，表示程度。"],
    ["HSK4 • 词汇", "“邀请”的反义表达最接近：", ["拒绝", "参加", "准备", "联系"], 0, "邀请和拒绝在语境中相对。"],
    ["HSK4 • 阅读", "这件衣服太贵了，我买不起，___看看别的吧。", ["还是", "已经", "如果", "虽然"], 0, "“还是”可用于提出另一选择。"],
    ["HSK4 • 语法", "他___努力，成绩就越好。", ["越", "才", "被", "把"], 0, "越……越……表示程度随条件变化。"],
    ["HSK4 • 词汇", "“丰富”的反义词是：", ["贫乏", "热闹", "准确", "认真"], 0, "丰富与贫乏相对。"],
    ["HSK4 • 阅读", "她把房间打扫得___干净。", ["非常", "从来", "如果", "虽然"], 0, "非常修饰形容词干净。"],
    ["HSK4 • 语法", "我不知道他___什么时候回来。", ["究竟", "已经", "如果", "虽然"], 0, "究竟可用于疑问宾语从句，表示追究答案。"],
    ["HSK4 • 词汇", "“耐心”最接近：", ["不急躁地等待或处理事情", "速度很快", "容易生气", "完全安静"], 0, "耐心指不急躁、有耐性。"],
    ["HSK4 • 阅读", "请你___我介绍一下这座城市。", ["给", "被", "从", "向"], 0, "给某人介绍是常用结构。"],
    ["HSK4 • 语法", "他昨天没有来，___生病了。", ["可能", "必须", "虽然", "只要"], 0, "可能表示推测。"],
    ["HSK4 • 词汇", "“顺利”的反义表达最接近：", ["困难", "准确", "热情", "及时"], 0, "顺利与困难重重的状态相对。"],
    ["HSK4 • 阅读", "这项活动不仅有趣，___能学到很多东西。", ["还", "才", "却", "否则"], 0, "不仅……还……表示递进。"],
    ["HSK4 • 语法", "我建议你___休息一下。", ["先", "被", "把", "越"], 0, "先表示首先做某事。"],
    ["HSK4 • 词汇", "“通知”可以理解为：", ["告诉别人有关事情的信息", "借钱给别人", "改变价格", "离开城市"], 0, "通知表示把消息告诉有关的人。"],
    ["HSK4 • 阅读", "天气越来越冷，大家___穿上了外套。", ["纷纷", "究竟", "仍然", "从来"], 0, "纷纷表示许多人相继做某事。"],
    ["HSK4 • 语法", "他一到家___开始做饭。", ["就", "才", "越", "被"], 0, "一……就……表示两个动作紧接发生。"],
    ["HSK4 • 词汇", "“误会”是指：", ["对事情产生错误理解", "提前完成工作", "认真学习", "正确判断"], 0, "误会是错误的理解或判断。"],
    ["HSK4 • 阅读", "因为堵车，我们___迟到了十分钟。", ["所以", "但是", "虽然", "如果"], 0, "因为……所以……表示因果。"],
    ["HSK4 • 语法", "___你有时间，欢迎来我家。", ["如果", "虽然", "否则", "于是"], 0, "如果引导条件。"],
    ["HSK4 • 词汇", "“尊重”的反义词最接近：", ["轻视", "帮助", "理解", "信任"], 0, "尊重与轻视相对。"],
    ["HSK4 • 阅读", "他每天听中文新闻，___自己的听力。", ["提高", "关闭", "减少", "拒绝"], 0, "提高听力是自然搭配。"],
    ["HSK4 • 语法", "这道题没有我想象的___难。", ["那么", "已经", "马上", "如果"], 0, "没有……那么……表示比较。"],
    ["HSK4 • 词汇", "“普通”的反义词最接近：", ["特殊", "简单", "方便", "及时"], 0, "普通与特殊相对。"],
    ["HSK4 • 阅读", "她对中国文化非常___，经常参加相关活动。", ["感兴趣", "感动", "感谢", "感冒"], 0, "对……感兴趣是固定搭配。"],
    ["HSK4 • 语法", "请把你的意见___大家说一说。", ["跟", "被", "从", "向着"], 0, "跟大家说表示向大家表达。"],

];
const HSK5_QUESTIONS = [
    ["HSK5 • 词汇", "“逐渐”最接近：", ["慢慢地", "突然地", "故意地", "完全地"], 0, "逐渐表示变化慢慢发生。"],
    ["HSK5 • 语法", "他不仅完成了任务，___提出了新的方案。", ["还", "才", "却", "否则"], 0, "不仅……还……表示递进。"],
    ["HSK5 • 阅读", "经过长期训练，她的汉语表达能力有了明显___。", ["提高", "打扰", "拒绝", "浪费"], 0, "能力有了明显提高是自然搭配。"],
    ["HSK5 • 词汇", "“承担责任”的意思是：", ["负责并接受应有的责任", "逃避问题", "拒绝帮助", "改变计划"], 0, "承担责任就是负责并接受责任。"],
    ["HSK5 • 语法", "无论遇到什么困难，他都___放弃。", ["不会", "已经", "正在", "因为"], 0, "无论……都……表示条件不影响结果。"],
    ["HSK5 • 词汇", "“普遍”的反义词最接近：", ["特殊", "普通", "常见", "广泛"], 0, "普遍与特殊在范围上相对。"],
    ["HSK5 • 阅读", "这项措施旨在___交通拥堵问题。", ["缓解", "制造", "扩大", "隐藏"], 0, "缓解问题表示减轻其严重程度。"],
    ["HSK5 • 词汇", "“维护”最接近：", ["保护并使其保持正常", "破坏", "转移", "取消"], 0, "维护有保护、保持正常状态之意。"],
    ["HSK5 • 语法", "与其坐在这里担心，___马上采取行动。", ["不如", "虽然", "即使", "由于"], 0, "与其……不如……表示比较取舍。"],
    ["HSK5 • 阅读", "由于准备充分，他___顺利通过了面试。", ["因此", "否则", "尽管", "而且"], 0, "由于……因此……表示因果。"],
    ["HSK5 • 词汇", "“克服困难”是指：", ["设法战胜困难", "制造困难", "逃避困难", "重复错误"], 0, "克服表示战胜、解决。"],
    ["HSK5 • 语法", "他所提出的建议___得到了大家的认可。", ["得到了", "正在", "因为", "如果"], 0, "“所+动词”构成名词性结构，后面可接谓语。"],
    ["HSK5 • 词汇", "“显著”最接近：", ["明显", "隐蔽", "偶然", "普通"], 0, "显著表示非常明显。"],
    ["HSK5 • 阅读", "调查结果表明，越来越多的人开始___环保生活方式。", ["采用", "阻止", "否认", "拆除"], 0, "采用生活方式表示开始使用、实行。"],
    ["HSK5 • 语法", "只要认真准备，___能够取得好成绩。", ["就", "却", "才", "仍"], 0, "只要……就……表示充分条件。"],
    ["HSK5 • 词汇", "“推迟”的反义词是：", ["提前", "拒绝", "增加", "减少"], 0, "推迟与提前相对。"],
    ["HSK5 • 阅读", "尽管天气恶劣，救援人员___坚持工作。", ["仍然", "否则", "几乎", "终于"], 0, "尽管……仍然……表示让步。"],
    ["HSK5 • 词汇", "“资源丰富”中的“丰富”最接近：", ["充足", "稀少", "危险", "狭窄"], 0, "丰富表示数量或种类很多、充足。"],
    ["HSK5 • 语法", "他把主要精力___了研究工作。", ["放在", "超过", "经过", "由于"], 0, "把精力放在某项工作上是固定搭配。"],
    ["HSK5 • 阅读", "面对失败，他没有灰心，反而从中___了宝贵经验。", ["吸取", "关闭", "浪费", "取消"], 0, "从失败中吸取经验是常用搭配。"],
    ["HSK5 • 词汇", "“促进”最接近：", ["推动其发展", "阻止其发生", "隐藏信息", "减少数量"], 0, "促进表示推动事物向好的方向发展。"],
    ["HSK5 • 词汇", "“避免”最接近：", ["设法不发生", "主动增加", "公开宣布", "立即完成"], 0, "避免表示设法不让某事发生。"],
    ["HSK5 • 语法", "这项政策一旦实施，___会产生影响。", ["就", "虽然", "否则", "而且"], 0, "一旦……就……表示条件一发生结果随即出现。"],
    ["HSK5 • 阅读", "专家认为，这种方法能够有效___能源消耗。", ["降低", "承担", "邀请", "恢复"], 0, "降低能源消耗是常见搭配。"],
    ["HSK5 • 词汇", "“逐步”最接近：", ["一步一步地", "突然地", "完全地", "故意地"], 0, "逐步表示按照步骤慢慢进行。"],
    ["HSK5 • 语法", "即使遇到困难，我们也___坚持下去。", ["要", "已经", "才", "因为"], 0, "即使……也……表示让步条件。"],
    ["HSK5 • 词汇", "“现象”是指：", ["可以观察到的事实或表现", "一条法律", "一个人名", "一种工具"], 0, "现象是客观存在、可以观察的表现。"],
    ["HSK5 • 阅读", "随着城市发展，公共交通的需求不断___。", ["增加", "取消", "拒绝", "隐藏"], 0, "需求不断增加是自然搭配。"],
    ["HSK5 • 语法", "他之所以成功，___他长期坚持。", ["是因为", "即使", "否则", "虽然"], 0, "之所以……是因为……表示原因。"],
    ["HSK5 • 词汇", "“明显”的近义词是：", ["显著", "模糊", "偶然", "秘密"], 0, "明显与显著意思接近。"],
    ["HSK5 • 阅读", "这个问题涉及多个方面，不能___处理。", ["简单地", "已经", "从来", "突然"], 0, "复杂问题不能简单地处理。"],
    ["HSK5 • 语法", "除非你亲自说明，___很难解决这个误会。", ["否则", "因此", "虽然", "而且"], 0, "除非……否则……表示条件。"],
    ["HSK5 • 词汇", "“承担”最接近：", ["负责接受", "主动逃避", "随意改变", "完全拒绝"], 0, "承担表示负责或接受某种任务、责任。"],
    ["HSK5 • 阅读", "公司正在___新的管理制度。", ["实施", "消失", "拒绝", "误会"], 0, "实施制度表示把制度付诸实践。"],
    ["HSK5 • 语法", "他宁可少赚一点，也不愿意___原则。", ["违反", "恢复", "促进", "适应"], 0, "宁可……也不……表示取舍。"],
    ["HSK5 • 词汇", "“适应”最接近：", ["逐渐习惯并能应对", "完全拒绝", "马上离开", "公开批评"], 0, "适应表示逐渐习惯环境或情况。"],
    ["HSK5 • 阅读", "为了保证质量，所有产品都必须经过严格的___。", ["检查", "邀请", "取消", "转移"], 0, "产品需要经过严格检查。"],
    ["HSK5 • 语法", "他虽然经验不足，___学习能力很强。", ["但是", "因此", "否则", "于是"], 0, "虽然……但是……表示转折。"],
    ["HSK5 • 词汇", "“趋势”最接近：", ["事物发展的方向", "一次考试", "个人情绪", "一件家具"], 0, "趋势表示事物发展的方向。"],
    ["HSK5 • 阅读", "数据显示，网上购物已经成为一种越来越普遍的___。", ["现象", "责任", "机会", "压力"], 0, "普遍的社会现象是常见搭配。"],
    ["HSK5 • 语法", "只要条件允许，我们___尽快完成项目。", ["就会", "却", "否则", "虽然"], 0, "只要……就……表示充分条件。"],
    ["HSK5 • 词汇", "“改善”与下列哪项最接近？", ["使情况变得更好", "使情况更复杂", "停止工作", "拒绝帮助"], 0, "改善表示使原来的情况变好。"],
    ["HSK5 • 阅读", "双方经过多次讨论，终于达成了___。", ["共识", "压力", "误会", "冲突"], 0, "达成共识是固定搭配。"],
    ["HSK5 • 语法", "与其不断抱怨，___想办法解决问题。", ["不如", "即使", "除非", "由于"], 0, "与其……不如……表示选择更好的做法。"],
    ["HSK5 • 词汇", "“客观”的反义词最接近：", ["主观", "准确", "实际", "公正"], 0, "客观与主观相对。"],
    ["HSK5 • 阅读", "这项研究为未来的技术发展提供了重要的___。", ["依据", "拒绝", "争论", "障碍"], 0, "提供依据是常用搭配。"],
    ["HSK5 • 语法", "无论结果如何，他___会认真总结经验。", ["都", "才", "却", "如果"], 0, "无论……都……表示无条件结果。"],
    ["HSK5 • 词汇", "“障碍”最接近：", ["阻碍事情发展的因素", "成功的方法", "奖励", "计划"], 0, "障碍是阻碍事情发展的因素。"],
    ["HSK5 • 阅读", "在竞争激烈的环境中，企业必须不断___创新。", ["加强", "取消", "减少", "拒绝"], 0, "加强创新能力是合理搭配。"],
    ["HSK5 • 词汇", "“维持”最接近：", ["保持某种状态", "突然改变", "彻底取消", "公开讨论"], 0, "维持表示使某种状态继续保持。"],

];

const EN_DAO_NGU = [

    ["部分倒装", "Never have I seen such a beautiful view.", ["Never have I seen such a beautiful view.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "倒装结构为 Never + 助动词 + 主语 + 动词。"],
    ["部分倒装", "Hardly had I arrived when the meeting started.", ["Hardly had I arrived when the meeting started.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Hardly...when...使用过去完成时倒装。"],
    ["部分倒装", "So difficult was the exam that many students complained.", ["So difficult was the exam that many students complained.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "So + adjective 置于句首可形成倒装。"],
    ["部分倒装", "Under no circumstances ___ this door.", ["should you open", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Under no circumstances 要求部分倒装。"],
    ["部分倒装", "Little did they know what would happen next.", ["Little did they know what would happen next.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Little 置于句首表示几乎不知道，需倒装。"],
    ["部分倒装", "Only then ___ why she was upset.", ["did I realize", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Only then 置于句首后主句倒装。"],
    ["部分倒装", "No sooner had he left than the phone rang.", ["No sooner had he left than the phone rang.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "No sooner...than...使用倒装和过去完成时。"],
    ["条件倒装", "Had I known earlier, I would have helped.", ["Had I known earlier, I would have helped.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Đảo ngữ điều kiện loại 3 bỏ if: Had + S + V3."],
    ["条件倒装", "Were I you, I would accept the offer.", ["Were I you, I would accept the offer.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Đảo ngữ điều kiện loại 2: Were + S..."],
    ["条件倒装", "Should you need help, call me.", ["Should you need help, call me.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Should + S... thay cho If S should..."],
    ["部分倒装", "Not only did she apologize, but she also offered to help.", ["Not only did she apologize, but she also offered to help.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Not only ở đầu câu yêu cầu đảo trợ động từ."],
    ["部分倒装", "Seldom does he complain about his workload.", ["Seldom does he complain about his workload.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Seldom mang nghĩa hiếm khi và gây đảo ngữ khi đứng đầu."],
    ["部分倒装", "On no account should you reveal the password.", ["On no account should you reveal the password.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "On no account = under no circumstances, dùng đảo ngữ."],
    ["phần đảo ngữ", "Only by working together can we solve the problem.", ["Only by working together can we solve the problem.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Only + cụm trạng ngữ ở đầu câu kéo theo đảo ngữ."],
    ["phần đảo ngữ", "So quickly did she answer that everyone was surprised.", ["So quickly did she answer that everyone was surprised.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "So + adverb ở đầu câu có thể dùng đảo ngữ."],
    ["phần đảo ngữ", "Neither did I know the answer.", ["Neither did I know the answer.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Neither + trợ động từ + chủ ngữ dùng để đồng tình với phủ định."],
    ["phần đảo ngữ", "Nowhere else can you find a view like this.", ["Nowhere else can you find a view like this.", "the word order is unchanged", "use only the past tense", "replace the auxiliary with 'to'"], 0, "Trạng từ phủ định/giới hạn ở đầu câu gây đảo ngữ."],
    ["phần đảo ngữ", "Only after reading the report did we understand the problem.", ["Only after reading the report did we understand the problem.", "the word order is unchanged", "use only the past tense", "add 'to' before the verb"], 0, "Only after + phrase at the beginning triggers inversion."],
    ["phần đảo ngữ", "At no time should employees share confidential data.", ["At no time should employees share confidential data.", "the word order is unchanged", "use only the past tense", "add 'to' before the verb"], 0, "At no time is a negative/restrictive phrase that triggers inversion."],
    ["phần đảo ngữ", "Barely had the show begun when the lights went out.", ["Barely had the show begun when the lights went out.", "the word order is unchanged", "use only the past tense", "add 'to' before the verb"], 0, "Barely...when... uses inversion with past perfect."],

];

const EN_THUC_GIA_DINH = [

    ["subjunctive", "The teacher insisted that he ___ the report again.", ["rewrite", "rewrites", "rewrote", "rewriting"], 0, "Sau insist that, dùng subjunctive: động từ nguyên mẫu."],
    ["subjunctive", "It is essential that every student ___ on time.", ["be", "is", "was", "being"], 0, "Sau It is essential that dùng động từ nguyên mẫu trong subjunctive."],
    ["subjunctive", "The manager recommended that she ___ earlier.", ["leave", "leaves", "left", "leaving"], 0, "Recommend that + bare infinitive."],
    ["subjunctive", "They demanded that the company ___ action immediately.", ["take", "takes", "took", "taking"], 0, "Demand that + bare infinitive."],
    ["subjunctive", "I suggest that he ___ a doctor.", ["see", "sees", "saw", "seeing"], 0, "Suggest that + bare infinitive trong cấu trúc giả định."],
    ["subjunctive", "It is important that he ___ honest.", ["be", "is", "was", "being"], 0, "Be là dạng nguyên mẫu trong subjunctive."],
    ["subjunctive", "The committee proposed that the rule ___ changed.", ["be", "is", "was", "being"], 0, "Propose that + subject + be + V3."],
    ["subjunctive", "She insisted that we ___ immediately.", ["go", "went", "goes", "going"], 0, "Insist that + bare infinitive."],
    ["subjunctive", "The doctor advised that he ___ smoking.", ["stop", "stops", "stopped", "stopping"], 0, "Advise that có thể dùng subjunctive trong văn phong trang trọng."],
    ["subjunctive", "It is vital that every applicant ___ the form.", ["complete", "completes", "completed", "completing"], 0, "It is vital that + bare infinitive."],
    ["subjunctive", "The law requires that each employee ___ identification.", ["carry", "carries", "carried", "carrying"], 0, "Require that + bare infinitive."],
    ["subjunctive", "The coach ordered that the players ___ silent.", ["remain", "remains", "remained", "remaining"], 0, "Order that + bare infinitive."],
    ["subjunctive", "It was recommended that he ___ the course.", ["take", "takes", "took", "taking"], 0, "Recommend that + bare infinitive."],
    ["subjunctive", "The board requested that the proposal ___ revised.", ["be", "is", "was", "being"], 0, "Request that + be + past participle."],
    ["subjunctive", "Her parents insisted that she ___ home early.", ["return", "returns", "returned", "returning"], 0, "Insist that + bare infinitive."],
    ["subjunctive", "It is crucial that the data ___ accurate.", ["be", "is", "was", "being"], 0, "Crucial that + be trong subjunctive."],
    ["subjunctive", "The judge ordered that the witness ___ the question.", ["answer", "answers", "answered", "answering"], 0, "Order that + bare infinitive."],
    ["subjunctive", "They suggested that the meeting ___ postponed.", ["be", "is", "was", "being"], 0, "Suggest that + be + V3."],
    ["subjunctive", "It is necessary that he ___ prepared.", ["be", "is", "was", "being"], 0, "Necessary that + bare infinitive."],
    ["subjunctive", "The director demanded that the work ___ finished today.", ["be", "is", "was", "being"], 0, "Demand that + be + V3."],

];

const EN_TRANG_TU_RUT_GON = [

    ["reduced adverbial clause", "While ___ to work, she met an old friend.", ["walking", "walked", "walks", "to walk"], 0, "Rút gọn while + S + V thành while + V-ing khi chủ ngữ giống nhau."],
    ["reduced adverbial clause", "When ___ the report, check all figures carefully.", ["writing", "written", "writes", "to write"], 0, "When + V-ing là dạng rút gọn của mệnh đề trạng ngữ chủ động."],
    ["reduced adverbial clause", "After ___ the email, he called his manager.", ["sending", "sent", "sends", "to send"], 0, "After + V-ing dùng khi chủ ngữ hai mệnh đề giống nhau."],
    ["reduced adverbial clause", "Although ___ tired, she continued studying.", ["feeling", "felt", "feels", "to feel"], 0, "Although + V-ing là dạng rút gọn chủ động."],
    ["reduced adverbial clause", "If ___ carefully, this machine is safe.", ["used", "using", "use", "to use"], 0, "If + V3 rút gọn mệnh đề bị động: If used carefully."],
    ["reduced adverbial clause", "When ___ properly, the software works well.", ["installed", "installing", "installs", "to install"], 0, "When + V3 là dạng rút gọn bị động."],
    ["reduced adverbial clause", "Before ___ the contract, read every clause.", ["signing", "signed", "signs", "to sign"], 0, "Before + V-ing là dạng rút gọn."],
    ["reduced adverbial clause", "Having ___ the task, she went home.", ["finished", "finish", "finishing", "finishes"], 0, "Having + V3 diễn tả hành động xảy ra trước."],
    ["reduced adverbial clause", "___ by the news, he remained silent.", ["Shocked", "Shocking", "Shock", "To shock"], 0, "V3 đầu câu có thể rút gọn mệnh đề bị động."],
    ["reduced adverbial clause", "___ the instructions, they assembled the device.", ["Following", "Followed", "Follows", "To follow"], 0, "Following = while/after they followed the instructions."],
    ["reduced adverbial clause", "If ___ in advance, the problem can be avoided.", ["planned", "planning", "plans", "to plan"], 0, "If + V3 rút gọn mệnh đề bị động."],
    ["reduced adverbial clause", "While ___ for the bus, I read a book.", ["waiting", "waited", "waits", "to wait"], 0, "While + V-ing diễn tả hai hành động đồng thời."],
    ["reduced adverbial clause", "After ___ the data, the team found an error.", ["analyzing", "analyzed", "analyzes", "to analyze"], 0, "After + V-ing khi chủ ngữ giống nhau."],
    ["reduced adverbial clause", "Although ___ inexperienced, he performed well.", ["being", "been", "be", "to be"], 0, "Although + being + adjective là dạng rút gọn."],
    ["reduced adverbial clause", "Once ___, the decision cannot be changed.", ["made", "making", "makes", "to make"], 0, "Once + V3 rút gọn mệnh đề bị động."],
    ["reduced adverbial clause", "Having ___ the problem, we proposed a solution.", ["identified", "identify", "identifying", "identifies"], 0, "Having + V3 diễn tả hành động hoàn tất trước."],
    ["reduced adverbial clause", "___ carefully, the medicine should be safe.", ["Taken", "Taking", "Take", "To take"], 0, "Taken carefully = if it is taken carefully."],
    ["reduced adverbial clause", "Before ___ the presentation, she checked the slides.", ["giving", "given", "gives", "to give"], 0, "Before + V-ing."],
    ["reduced adverbial clause", "When ___ from the top, the building looks smaller.", ["seen", "seeing", "sees", "to see"], 0, "When + V3 rút gọn mệnh đề bị động."],
    ["reduced adverbial clause", "While ___ dinner, he listened to a podcast.", ["cooking", "cooked", "cooks", "to cook"], 0, "While + V-ing."],

];

const EN_MENH_DE_TRANG_NGU = [

    ["adverbial clause", "___ it was raining, they continued the match.", ["Although", "Because", "Unless", "So that"], 0, "Although introduces a concessive adverbial clause."],
    ["adverbial clause", "Call me ___ you arrive.", ["when", "unless", "although", "because"], 0, "When introduces a time clause."],
    ["adverbial clause", "We stayed home ___ the weather was terrible.", ["because", "although", "unless", "so that"], 0, "Because introduces a reason clause."],
    ["adverbial clause", "Take an umbrella ___ it rains.", ["in case", "although", "because", "whereas"], 0, "In case introduces a precautionary condition."],
    ["adverbial clause", "You cannot enter ___ you have a pass.", ["unless", "although", "because", "while"], 0, "Unless means if not."],
    ["adverbial clause", "She spoke slowly ___ everyone could understand.", ["so that", "although", "because", "unless"], 0, "So that introduces purpose."],
    ["adverbial clause", "___ he was tired, he finished the report.", ["Even though", "Because", "Unless", "Since"], 0, "Even though introduces concession."],
    ["adverbial clause", "I will wait here ___ you come back.", ["until", "because", "although", "unless"], 0, "Until introduces an endpoint in time."],
    ["adverbial clause", "He studies hard ___ he can pass the exam.", ["so that", "although", "unless", "whereas"], 0, "So that expresses purpose."],
    ["adverbial clause", "___ you hurry, you will miss the train.", ["If", "Although", "Because", "While"], 0, "If introduces a condition."],
    ["adverbial clause", "She smiled ___ she was nervous.", ["although", "because", "unless", "so that"], 0, "Although shows contrast."],
    ["adverbial clause", "We left early ___ we could avoid traffic.", ["so that", "because", "although", "unless"], 0, "So that expresses purpose."],
    ["adverbial clause", "I have known him ___ we were children.", ["since", "unless", "although", "whereas"], 0, "Since introduces the starting point of a time period."],
    ["adverbial clause", "___ you finish, you can leave.", ["Once", "Although", "Because", "Unless"], 0, "Once means when something has happened."],
    ["adverbial clause", "She cannot relax ___ the work is finished.", ["until", "because", "although", "if"], 0, "Until marks the time before an event is completed."],
    ["adverbial clause", "___ he apologized, she remained upset.", ["Even though", "Because", "Unless", "So that"], 0, "Even though introduces concession."],
    ["adverbial clause", "Bring some cash ___ the card machine does not work.", ["in case", "although", "because", "whereas"], 0, "In case expresses precaution."],
    ["adverbial clause", "He took notes ___ he would not forget the details.", ["so that", "unless", "although", "while"], 0, "So that expresses purpose."],
    ["adverbial clause", "___ the meeting ended, everyone left.", ["After", "Unless", "Although", "Because"], 0, "After introduces a time clause."],
    ["adverbial clause", "You can borrow my laptop ___ you return it tomorrow.", ["provided that", "although", "because", "while"], 0, "Provided that means on the condition that."],

];

const EN_IDIOM = [

    ["idiom", "“Break the ice” means:", ["start a friendly conversation", "end a relationship", "make someone angry", "work very quickly"], 0, "Break the ice means make people feel more relaxed."],
    ["idiom", "“Hit the nail on the head” means:", ["describe something exactly", "make a mistake", "avoid a problem", "arrive late"], 0, "It means say or do exactly the right thing."],
    ["idiom", "“A piece of cake” means:", ["very easy", "very expensive", "very dangerous", "very boring"], 0, "A piece of cake means easy."],
    ["idiom", "“Under the weather” means:", ["feeling ill", "feeling excited", "being outside", "being late"], 0, "Under the weather means feeling unwell."],
    ["idiom", "“Once in a blue moon” means:", ["very rarely", "every day", "very loudly", "without warning"], 0, "It means something happens rarely."],
    ["idiom", "“Cost an arm and a leg” means:", ["be very expensive", "be free", "be dangerous", "be simple"], 0, "The idiom means cost a lot of money."],
    ["idiom", "“Spill the beans” means:", ["reveal a secret", "cook dinner", "make a plan", "leave quickly"], 0, "Spill the beans means reveal secret information."],
    ["idiom", "“Call it a day” means:", ["stop working for the day", "start a project", "make a phone call", "change jobs"], 0, "It means stop working for the day."],
    ["idiom", "“Get cold feet” means:", ["become nervous about doing something", "feel physically cold", "run fast", "become confident"], 0, "Get cold feet means lose courage."],
    ["idiom", "“In hot water” means:", ["in trouble", "in a bath", "very successful", "very relaxed"], 0, "In hot water means in trouble."],
    ["idiom", "“Keep an eye on” means:", ["watch carefully", "ignore", "repair", "borrow"], 0, "Keep an eye on means watch or monitor."],
    ["idiom", "“Go the extra mile” means:", ["make extra effort", "travel abroad", "stop early", "avoid responsibility"], 0, "It means make more effort than expected."],
    ["idiom", "“Bite the bullet” means:", ["face a difficult situation bravely", "eat quickly", "avoid a decision", "complain loudly"], 0, "Bite the bullet means endure something difficult."],
    ["idiom", "“The ball is in your court” means:", ["it is your turn to act", "you are playing tennis", "you have lost", "the game is over"], 0, "It means the next action is your responsibility."],
    ["idiom", "“On the same page” means:", ["share the same understanding", "read the same book", "disagree strongly", "work alone"], 0, "It means have the same understanding."],
    ["idiom", "“Miss the boat” means:", ["miss an opportunity", "travel by ship", "arrive early", "change direction"], 0, "Miss the boat means lose an opportunity."],
    ["idiom", "“Back to square one” means:", ["return to the beginning", "win easily", "finish a task", "take a shortcut"], 0, "It means start again from the beginning."],
    ["idiom", "“Pull someone’s leg” means:", ["joke with someone", "help someone walk", "criticize someone", "follow someone"], 0, "Pull someone’s leg means tease or joke."],
    ["idiom", "“A blessing in disguise” means:", ["something that seems bad but turns out good", "a hidden gift card", "a religious event", "an obvious success"], 0, "It describes an apparent problem with a positive result."],
    ["idiom", "“Beat around the bush” means:", ["avoid saying something directly", "work in a garden", "speak clearly", "finish quickly"], 0, "It means avoid the main point."],

];

const EN_PHRASAL_VERB = [

    ["phrasal verb", "Please ___ the lights before you leave.", ["turn off", "turn into", "turn over", "turn up"], 0, "Turn off = switch off."],
    ["phrasal verb", "I need to ___ this word in the dictionary.", ["look up", "look after", "look into", "look out"], 0, "Look up = search for information."],
    ["phrasal verb", "She ___ her little brother every afternoon.", ["looks after", "looks up", "looks into", "looks for"], 0, "Look after = take care of."],
    ["phrasal verb", "The meeting was ___ until Friday.", ["put off", "put on", "put out", "put up"], 0, "Put off = postpone."],
    ["phrasal verb", "We have ___ milk, so I will buy some.", ["run out of", "run into", "run over", "run away"], 0, "Run out of = have none left."],
    ["phrasal verb", "He ___ an old friend at the station.", ["ran into", "ran out of", "ran over", "ran away"], 0, "Run into = meet unexpectedly."],
    ["phrasal verb", "Please ___ your shoes before entering.", ["take off", "take after", "take up", "take in"], 0, "Take off = remove."],
    ["phrasal verb", "She decided to ___ yoga.", ["take up", "take off", "take over", "take after"], 0, "Take up = begin a hobby/activity."],
    ["phrasal verb", "Can you ___ this form?", ["fill in", "fill out", "fill up", "fill over"], 0, "Fill in = complete information on a form."],
    ["phrasal verb", "The plane ___ on time.", ["took off", "took after", "took up", "took in"], 0, "Take off = leave the ground."],
    ["phrasal verb", "We need to ___ the problem before deciding.", ["figure out", "figure up", "figure off", "figure into"], 0, "Figure out = understand or solve."],
    ["phrasal verb", "He ___ smoking last year.", ["gave up", "gave in", "gave out", "gave away"], 0, "Give up = stop doing something."],
    ["phrasal verb", "The car ___ on the way home.", ["broke down", "broke into", "broke up", "broke off"], 0, "Break down = stop working."],
    ["phrasal verb", "They ___ the old building.", ["knocked down", "knocked out", "knocked up", "knocked over"], 0, "Knock down = demolish."],
    ["phrasal verb", "I will ___ you ___ at 8 a.m.", ["pick / up", "pick / out", "pick / on", "pick / over"], 0, "Pick someone up = collect someone by car."],
    ["phrasal verb", "She ___ the invitation because she was busy.", ["turned down", "turned off", "turned into", "turned over"], 0, "Turn down = reject."],
    ["phrasal verb", "He ___ the meaning of the word.", ["found out", "found over", "found off", "found up"], 0, "Find out = discover information."],
    ["phrasal verb", "Please ___ the children while I cook.", ["look after", "look up", "look into", "look out"], 0, "Look after = take care of."],
    ["phrasal verb", "The company will ___ a new product next month.", ["bring out", "bring up", "bring in", "bring off"], 0, "Bring out = release or publish."],
    ["phrasal verb", "We need to ___ a solution together.", ["come up with", "come across", "come down", "come over"], 0, "Come up with = think of or create."],

];

const EN_DONG_NGHIA = [

    ["synonym", "“Rapid” is closest in meaning to:", ["fast", "quiet", "weak", "rare"], 0, "Rapid = fast."],
    ["synonym", "“Purchase” is closest in meaning to:", ["buy", "sell", "borrow", "repair"], 0, "Purchase = buy."],
    ["synonym", "“Assist” is closest in meaning to:", ["help", "avoid", "refuse", "delay"], 0, "Assist = help."],
    ["synonym", "“Accurate” is closest in meaning to:", ["correct", "expensive", "simple", "recent"], 0, "Accurate = correct."],
    ["synonym", "“Essential” is closest in meaning to:", ["necessary", "optional", "temporary", "ordinary"], 0, "Essential = necessary."],
    ["synonym", "“Huge” is closest in meaning to:", ["enormous", "tiny", "narrow", "weak"], 0, "Huge = enormous."],
    ["synonym", "“Reliable” is closest in meaning to:", ["dependable", "dangerous", "expensive", "uncertain"], 0, "Reliable = dependable."],
    ["synonym", "“Difficult” is closest in meaning to:", ["challenging", "empty", "polite", "familiar"], 0, "Difficult = challenging."],
    ["synonym", "“Improve” is closest in meaning to:", ["enhance", "damage", "remove", "hide"], 0, "Improve = enhance."],
    ["synonym", "“Objective” is closest in meaning to:", ["goal", "mistake", "method", "argument"], 0, "Objective = goal."],
    ["synonym", "“Purchase” is closest in meaning to:", ["acquire", "lose", "throw", "repair"], 0, "Acquire can mean obtain or purchase."],
    ["synonym", "“Brief” is closest in meaning to:", ["short", "wide", "heavy", "late"], 0, "Brief = short."],
    ["synonym", "“Select” is closest in meaning to:", ["choose", "reject", "copy", "divide"], 0, "Select = choose."],
    ["synonym", "“Modify” is closest in meaning to:", ["change", "destroy", "repeat", "measure"], 0, "Modify = change."],
    ["synonym", "“Maintain” is closest in meaning to:", ["keep", "remove", "forget", "sell"], 0, "Maintain = keep in good condition."],
    ["synonym", "“Complex” is closest in meaning to:", ["complicated", "cheap", "friendly", "empty"], 0, "Complex = complicated."],
    ["synonym", "“Obtain” is closest in meaning to:", ["get", "lose", "hide", "return"], 0, "Obtain = get."],
    ["synonym", "“Require” is closest in meaning to:", ["need", "offer", "avoid", "borrow"], 0, "Require = need."],
    ["synonym", "“Approximately” is closest in meaning to:", ["roughly", "exactly", "never", "immediately"], 0, "Approximately = roughly."],
    ["synonym", "“Previous” is closest in meaning to:", ["earlier", "future", "current", "separate"], 0, "Previous = earlier."],

];

const EN_TRAI_NGHIA = [

    ["antonym", "The opposite of “expand” is:", ["contract", "increase", "develop", "extend"], 0, "Expand ↔ contract."],
    ["antonym", "The opposite of “ancient” is:", ["modern", "old", "historic", "traditional"], 0, "Ancient ↔ modern."],
    ["antonym", "The opposite of “generous” is:", ["selfish", "kind", "helpful", "polite"], 0, "Generous ↔ selfish."],
    ["antonym", "The opposite of “temporary” is:", ["permanent", "brief", "short", "recent"], 0, "Temporary ↔ permanent."],
    ["antonym", "The opposite of “accept” is:", ["reject", "receive", "allow", "agree"], 0, "Accept ↔ reject."],
    ["antonym", "The opposite of “increase” is:", ["decrease", "improve", "grow", "expand"], 0, "Increase ↔ decrease."],
    ["antonym", "The opposite of “visible” is:", ["hidden", "clear", "bright", "obvious"], 0, "Visible ↔ hidden."],
    ["antonym", "The opposite of “flexible” is:", ["rigid", "adaptable", "soft", "useful"], 0, "Flexible ↔ rigid."],
    ["antonym", "The opposite of “optimistic” is:", ["pessimistic", "hopeful", "positive", "confident"], 0, "Optimistic ↔ pessimistic."],
    ["antonym", "The opposite of “include” is:", ["exclude", "contain", "add", "accept"], 0, "Include ↔ exclude."],
    ["antonym", "The opposite of “major” is:", ["minor", "important", "large", "main"], 0, "Major ↔ minor."],
    ["antonym", "The opposite of “accurate” is:", ["incorrect", "precise", "correct", "exact"], 0, "Accurate ↔ incorrect."],
    ["antonym", "The opposite of “frequent” is:", ["rare", "regular", "common", "usual"], 0, "Frequent ↔ rare."],
    ["antonym", "The opposite of “strengthen” is:", ["weaken", "support", "improve", "build"], 0, "Strengthen ↔ weaken."],
    ["antonym", "The opposite of “arrive” is:", ["depart", "reach", "enter", "come"], 0, "Arrive ↔ depart."],
    ["antonym", "The opposite of “complicated” is:", ["simple", "difficult", "detailed", "advanced"], 0, "Complicated ↔ simple."],
    ["antonym", "The opposite of “polite” is:", ["rude", "friendly", "formal", "kind"], 0, "Polite ↔ rude."],
    ["antonym", "The opposite of “profit” is:", ["loss", "income", "salary", "benefit"], 0, "Profit ↔ loss."],
    ["antonym", "The opposite of “maximum” is:", ["minimum", "highest", "largest", "top"], 0, "Maximum ↔ minimum."],
    ["antonym", "The opposite of “permit” is:", ["forbid", "allow", "approve", "accept"], 0, "Permit ↔ forbid."],

];

const TOAN_11_QUESTIONS = [["Lượng giác", "Giá trị của sin(0) bằng?", ["0", "1", "-1", "√2/2"], 0, "sin(0)=0."], ["Lượng giác", "Giá trị của sin(π/6) bằng?", ["1/2", "0", "1", "-1"], 0, "sin(π/6)=1/2."], ["Lượng giác", "Giá trị của sin(π/4) bằng?", ["√2/2", "0", "1", "-1"], 0, "sin(π/4)=√2/2."], ["Lượng giác", "Giá trị của sin(π/3) bằng?", ["√3/2", "0", "1", "-1"], 0, "sin(π/3)=√3/2."], ["Lượng giác", "Giá trị của sin(π/2) bằng?", ["1", "0", "-1", "√2/2"], 0, "sin(π/2)=1."], ["Lượng giác", "Giá trị của cos(0) bằng?", ["1", "0", "-1", "√2/2"], 0, "cos(0)=1."], ["Lượng giác", "Giá trị của cos(π/3) bằng?", ["1/2", "0", "1", "-1"], 0, "cos(π/3)=1/2."], ["Lượng giác", "Giá trị của cos(π/2) bằng?", ["0", "1", "-1", "√2/2"], 0, "cos(π/2)=0."], ["Lượng giác", "Giá trị của cos(π) bằng?", ["-1", "0", "1", "√2/2"], 0, "cos(π)=-1."], ["Lượng giác", "Giá trị của tan(0) bằng?", ["0", "1", "-1", "√2/2"], 0, "tan(0)=0."], ["Lượng giác", "Giá trị của tan(π/4) bằng?", ["1", "0", "-1", "√2/2"], 0, "tan(π/4)=1."], ["Lượng giác", "Giá trị của tan(π/6) bằng?", ["√3/3", "0", "1", "-1"], 0, "tan(π/6)=√3/3."], ["Lượng giác", "Giá trị của cot(π/4) bằng?", ["1", "0", "-1", "√2/2"], 0, "cot(π/4)=1."], ["Lượng giác", "Giá trị của cot(π/3) bằng?", ["√3/3", "0", "1", "-1"], 0, "cot(π/3)=√3/3."], ["Lượng giác", "Giá trị của cot(π/6) bằng?", ["√3", "0", "1", "-1"], 0, "cot(π/6)=√3."], ["Lượng giác", "Công thức đúng của sin²x+cos²x là?", ["1", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: sin²x+cos²x=1."], ["Lượng giác", "Công thức đúng của 1+tan²x là?", ["1/cos²x", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: 1+tan²x=1/cos²x."], ["Lượng giác", "Công thức đúng của sin 2x là?", ["2sin x cos x", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: sin 2x=2sin x cos x."], ["Lượng giác", "Công thức đúng của cos 2x là?", ["1-2sin²x", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: cos 2x=1-2sin²x."], ["Lượng giác", "Công thức đúng của sin(a+b) là?", ["sin a cos b + cos a sin b", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: sin(a+b)=sin a cos b + cos a sin b."], ["Lượng giác", "Công thức đúng của cos(a+b) là?", ["cos a cos b - sin a sin b", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: cos(a+b)=cos a cos b - sin a sin b."], ["Lượng giác", "Công thức đúng của sin(a-b) là?", ["sin a cos b - cos a sin b", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: sin(a-b)=sin a cos b - cos a sin b."], ["Lượng giác", "Công thức đúng của tan(a+b) là?", ["(tan a+tan b)/(1-tan a tan b)", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: tan(a+b)=(tan a+tan b)/(1-tan a tan b)."], ["Lượng giác", "Công thức đúng của sin²x là?", ["(1-cos 2x)/2", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: sin²x=(1-cos 2x)/2."], ["Lượng giác", "Công thức đúng của cos²x là?", ["(1+cos 2x)/2", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: cos²x=(1+cos 2x)/2."], ["Lượng giác", "Công thức đúng của sin x cos x là?", ["sin 2x/2", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: sin x cos x=sin 2x/2."], ["Lượng giác", "Công thức đúng của cot x là?", ["cos x/sin x", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: cot x=cos x/sin x."], ["Lượng giác", "Công thức đúng của tan x là?", ["sin x/cos x", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: tan x=sin x/cos x."], ["Lượng giác", "Công thức đúng của 1+cot²x là?", ["1/sin²x", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: 1+cot²x=1/sin²x."], ["Lượng giác", "Công thức đúng của sin(-x) là?", ["-sin x", "0", "1", "2"], 0, "Công thức lượng giác cơ bản: sin(-x)=-sin x."], ["Cấp số cộng", "Cho cấp số cộng u₁=2, d=3. Giá trị u_5 là?", ["14", "17", "11", "17"], 0, "u_n=u₁+(n-1)d=14."], ["Cấp số cộng", "Cho cấp số cộng u₁=3, d=4. Giá trị u_6 là?", ["23", "27", "19", "27"], 0, "u_n=u₁+(n-1)d=23."], ["Cấp số cộng", "Cho cấp số cộng u₁=4, d=5. Giá trị u_7 là?", ["34", "39", "29", "39"], 0, "u_n=u₁+(n-1)d=34."], ["Cấp số cộng", "Cho cấp số cộng u₁=5, d=6. Giá trị u_8 là?", ["47", "53", "41", "53"], 0, "u_n=u₁+(n-1)d=47."], ["Cấp số cộng", "Cho cấp số cộng u₁=6, d=7. Giá trị u_9 là?", ["62", "69", "55", "69"], 0, "u_n=u₁+(n-1)d=62."], ["Cấp số cộng", "Cho cấp số cộng u₁=7, d=3. Giá trị u_10 là?", ["34", "37", "31", "37"], 0, "u_n=u₁+(n-1)d=34."], ["Cấp số cộng", "Cho cấp số cộng u₁=8, d=4. Giá trị u_5 là?", ["24", "28", "20", "28"], 0, "u_n=u₁+(n-1)d=24."], ["Cấp số cộng", "Cho cấp số cộng u₁=9, d=5. Giá trị u_6 là?", ["34", "39", "29", "39"], 0, "u_n=u₁+(n-1)d=34."], ["Cấp số cộng", "Cho cấp số cộng u₁=10, d=6. Giá trị u_7 là?", ["46", "52", "40", "52"], 0, "u_n=u₁+(n-1)d=46."], ["Cấp số cộng", "Cho cấp số cộng u₁=11, d=7. Giá trị u_8 là?", ["60", "67", "53", "67"], 0, "u_n=u₁+(n-1)d=60."], ["Cấp số cộng", "Cho cấp số cộng u₁=12, d=3. Giá trị u_9 là?", ["36", "39", "33", "39"], 0, "u_n=u₁+(n-1)d=36."], ["Cấp số cộng", "Cho cấp số cộng u₁=13, d=4. Giá trị u_10 là?", ["49", "53", "45", "53"], 0, "u_n=u₁+(n-1)d=49."], ["Cấp số cộng", "Cho cấp số cộng u₁=14, d=5. Giá trị u_5 là?", ["34", "39", "29", "39"], 0, "u_n=u₁+(n-1)d=34."], ["Cấp số cộng", "Cho cấp số cộng u₁=15, d=6. Giá trị u_6 là?", ["45", "51", "39", "51"], 0, "u_n=u₁+(n-1)d=45."], ["Cấp số cộng", "Cho cấp số cộng u₁=16, d=7. Giá trị u_7 là?", ["58", "65", "51", "65"], 0, "u_n=u₁+(n-1)d=58."], ["Cấp số nhân", "Cho cấp số nhân u₁=1, q=2. Giá trị u_4 là?", ["8", "16", "4", "8"], 0, "u_n=8."], ["Cấp số nhân", "Cho cấp số nhân u₁=2, q=3. Tổng 5 số hạng đầu bằng?", ["242", "244", "726", "162"], 0, "S_n=242."], ["Cấp số nhân", "Cho cấp số nhân u₁=3, q=4. Giá trị u_6 là?", ["3072", "12288", "768", "72"], 0, "u_n=3072."], ["Cấp số nhân", "Cho cấp số nhân u₁=4, q=2. Tổng 7 số hạng đầu bằng?", ["508", "512", "1016", "256"], 0, "S_n=508."], ["Cấp số nhân", "Cho cấp số nhân u₁=5, q=3. Giá trị u_8 là?", ["10935", "32805", "3645", "120"], 0, "u_n=10935."], ["Cấp số nhân", "Cho cấp số nhân u₁=1, q=4. Tổng 4 số hạng đầu bằng?", ["85", "86", "340", "64"], 0, "S_n=85."], ["Cấp số nhân", "Cho cấp số nhân u₁=2, q=2. Giá trị u_5 là?", ["32", "64", "16", "20"], 0, "u_n=32."], ["Cấp số nhân", "Cho cấp số nhân u₁=3, q=3. Tổng 6 số hạng đầu bằng?", ["1092", "1095", "3276", "729"], 0, "S_n=1092."], ["Cấp số nhân", "Cho cấp số nhân u₁=4, q=4. Giá trị u_7 là?", ["16384", "65536", "4096", "112"], 0, "u_n=16384."], ["Cấp số nhân", "Cho cấp số nhân u₁=5, q=2. Tổng 8 số hạng đầu bằng?", ["1275", "1280", "2550", "640"], 0, "S_n=1275."], ["Cấp số nhân", "Cho cấp số nhân u₁=1, q=3. Giá trị u_4 là?", ["27", "81", "9", "12"], 0, "u_n=27."], ["Cấp số nhân", "Cho cấp số nhân u₁=2, q=4. Tổng 5 số hạng đầu bằng?", ["682", "684", "2728", "512"], 0, "S_n=682."], ["Cấp số nhân", "Cho cấp số nhân u₁=3, q=2. Giá trị u_6 là?", ["96", "192", "48", "36"], 0, "u_n=96."], ["Cấp số nhân", "Cho cấp số nhân u₁=4, q=3. Tổng 7 số hạng đầu bằng?", ["4372", "4376", "13116", "2916"], 0, "S_n=4372."], ["Cấp số nhân", "Cho cấp số nhân u₁=5, q=4. Giá trị u_8 là?", ["81920", "327680", "20480", "160"], 0, "u_n=81920."], ["Giới hạn dãy số", "lim n→∞ (2n+1)/n bằng?", ["2", "1", "3", "0"], 0, "Giới hạn bằng 2."], ["Giới hạn dãy số", "lim n→∞ (3n+2)/n bằng?", ["3", "2", "5", "0"], 0, "Giới hạn bằng 3."], ["Giới hạn dãy số", "lim n→∞ (4n+3)/n bằng?", ["4", "3", "7", "0"], 0, "Giới hạn bằng 4."], ["Giới hạn dãy số", "lim n→∞ (5n+4)/n bằng?", ["5", "4", "9", "0"], 0, "Giới hạn bằng 5."], ["Giới hạn dãy số", "lim n→∞ (6n+5)/n bằng?", ["6", "5", "11", "0"], 0, "Giới hạn bằng 6."], ["Giới hạn dãy số", "lim n→∞ (7n+1)/n bằng?", ["7", "1", "8", "0"], 0, "Giới hạn bằng 7."], ["Giới hạn dãy số", "lim n→∞ (2n+2)/n bằng?", ["2", "2", "4", "0"], 0, "Giới hạn bằng 2."], ["Giới hạn dãy số", "lim n→∞ (3n+3)/n bằng?", ["3", "3", "6", "0"], 0, "Giới hạn bằng 3."], ["Giới hạn dãy số", "lim n→∞ (4/n+4/n²) bằng?", ["0", "4", "4", "1"], 0, "Các số hạng chứa 1/n đều tiến về 0."], ["Giới hạn dãy số", "lim n→∞ (5/n+5/n²) bằng?", ["0", "5", "5", "1"], 0, "Các số hạng chứa 1/n đều tiến về 0."], ["Giới hạn dãy số", "lim n→∞ (6/n+1/n²) bằng?", ["0", "6", "1", "1"], 0, "Các số hạng chứa 1/n đều tiến về 0."], ["Giới hạn dãy số", "lim n→∞ (7/n+2/n²) bằng?", ["0", "7", "2", "1"], 0, "Các số hạng chứa 1/n đều tiến về 0."], ["Giới hạn dãy số", "lim n→∞ (2/n+3/n²) bằng?", ["0", "2", "3", "1"], 0, "Các số hạng chứa 1/n đều tiến về 0."], ["Giới hạn dãy số", "lim n→∞ (3/n+4/n²) bằng?", ["0", "3", "4", "1"], 0, "Các số hạng chứa 1/n đều tiến về 0."], ["Giới hạn dãy số", "lim n→∞ (4/n+5/n²) bằng?", ["0", "4", "5", "1"], 0, "Các số hạng chứa 1/n đều tiến về 0."], ["Giới hạn hàm số", "lim x→1 (1x+2) bằng?", ["3", "4", "3", "2"], 0, "Hàm đa thức liên tục nên giới hạn bằng 3."], ["Giới hạn hàm số", "lim x→2 (2x+3) bằng?", ["7", "8", "5", "3"], 0, "Hàm đa thức liên tục nên giới hạn bằng 7."], ["Giới hạn hàm số", "lim x→3 (3x+4) bằng?", ["13", "14", "7", "4"], 0, "Hàm đa thức liên tục nên giới hạn bằng 13."], ["Giới hạn hàm số", "lim x→1 (4x+5) bằng?", ["9", "10", "9", "5"], 0, "Hàm đa thức liên tục nên giới hạn bằng 9."], ["Giới hạn hàm số", "lim x→2 (5x+6) bằng?", ["16", "17", "11", "6"], 0, "Hàm đa thức liên tục nên giới hạn bằng 16."], ["Giới hạn hàm số", "lim x→3 (6x+2) bằng?", ["20", "21", "8", "2"], 0, "Hàm đa thức liên tục nên giới hạn bằng 20."], ["Giới hạn hàm số", "lim x→1 (1x+3) bằng?", ["4", "5", "4", "3"], 0, "Hàm đa thức liên tục nên giới hạn bằng 4."], ["Giới hạn hàm số", "lim x→2 (2x+4) bằng?", ["8", "9", "6", "4"], 0, "Hàm đa thức liên tục nên giới hạn bằng 8."], ["Giới hạn hàm số", "lim x→3 (3x+5) bằng?", ["14", "15", "8", "5"], 0, "Hàm đa thức liên tục nên giới hạn bằng 14."], ["Giới hạn hàm số", "lim x→1 (4x+6) bằng?", ["10", "11", "10", "6"], 0, "Hàm đa thức liên tục nên giới hạn bằng 10."], ["Giới hạn hàm số", "lim x→2 (5x+2) bằng?", ["12", "13", "7", "2"], 0, "Hàm đa thức liên tục nên giới hạn bằng 12."], ["Giới hạn hàm số", "lim x→3 (6x+3) bằng?", ["21", "22", "9", "3"], 0, "Hàm đa thức liên tục nên giới hạn bằng 21."], ["Giới hạn hàm số", "lim x→1 (1x+4) bằng?", ["5", "6", "5", "4"], 0, "Hàm đa thức liên tục nên giới hạn bằng 5."], ["Giới hạn hàm số", "lim x→2 (2x+5) bằng?", ["9", "10", "7", "5"], 0, "Hàm đa thức liên tục nên giới hạn bằng 9."], ["Giới hạn hàm số", "lim x→3 (3x+6) bằng?", ["15", "16", "9", "6"], 0, "Hàm đa thức liên tục nên giới hạn bằng 15."], ["Hàm số liên tục", "Với f(x)=x²+3x, giá trị f(0) bằng?", ["0", "1", "-1", "0"], 0, "Thay x=0 được 0."], ["Hàm số liên tục", "Với f(x)=2x-5, giá trị f(3) bằng?", ["1", "2", "0", "0"], 0, "Thay x=3 được 1."], ["Hàm số liên tục", "Với f(x)=x³, giá trị f(-1) bằng?", ["-1", "0", "-2", "0"], 0, "Thay x=-1 được -1."], ["Hàm số liên tục", "Với f(x)=5x+2, giá trị f(2) bằng?", ["12", "13", "11", "0"], 0, "Thay x=2 được 12."], ["Hàm số liên tục", "Với f(x)=x²-4, giá trị f(2) bằng?", ["0", "1", "-1", "0"], 0, "Thay x=2 được 0."], ["Hàm số liên tục", "Với f(x)=3x², giá trị f(1) bằng?", ["3", "4", "2", "0"], 0, "Thay x=1 được 3."], ["Hàm số liên tục", "Với f(x)=x²+x, giá trị f(-2) bằng?", ["2", "3", "1", "0"], 0, "Thay x=-2 được 2."], ["Hàm số liên tục", "Với f(x)=4x-1, giá trị f(0) bằng?", ["-1", "0", "-2", "0"], 0, "Thay x=0 được -1."], ["Hàm số liên tục", "Với f(x)=x³+1, giá trị f(1) bằng?", ["2", "3", "1", "0"], 0, "Thay x=1 được 2."], ["Hàm số liên tục", "Với f(x)=2x²+1, giá trị f(-1) bằng?", ["3", "4", "2", "0"], 0, "Thay x=-1 được 3."], ["Hàm số liên tục", "Với f(x)=x²+2x, giá trị f(0) bằng?", ["0", "1", "-1", "0"], 0, "Thay x=0 được 0."], ["Hàm số liên tục", "Với f(x)=7x, giá trị f(2) bằng?", ["14", "15", "13", "0"], 0, "Thay x=2 được 14."], ["Hàm số liên tục", "Với f(x)=x³-x, giá trị f(1) bằng?", ["0", "1", "-1", "0"], 0, "Thay x=1 được 0."], ["Hàm số liên tục", "Với f(x)=x²-1, giá trị f(-1) bằng?", ["0", "1", "-1", "0"], 0, "Thay x=-1 được 0."], ["Hàm số liên tục", "Với f(x)=3x+4, giá trị f(-2) bằng?", ["-2", "-1", "-3", "0"], 0, "Thay x=-2 được -2."], ["Đạo hàm", "Đạo hàm của f(x)=2x²+1x là?", ["4x+1", "2x+1", "4x", "2x²+1"], 0, "f'(x)=4x+1."], ["Đạo hàm", "Đạo hàm của f(x)=3x²+2x là?", ["6x+2", "3x+2", "6x", "3x²+2"], 0, "f'(x)=6x+2."], ["Đạo hàm", "Đạo hàm của f(x)=4x²+3x là?", ["8x+3", "4x+3", "8x", "4x²+3"], 0, "f'(x)=8x+3."], ["Đạo hàm", "Đạo hàm của f(x)=5x²+4x là?", ["10x+4", "5x+4", "10x", "5x²+4"], 0, "f'(x)=10x+4."], ["Đạo hàm", "Đạo hàm của f(x)=6x²+1x là?", ["12x+1", "6x+1", "12x", "6x²+1"], 0, "f'(x)=12x+1."], ["Đạo hàm", "Đạo hàm của f(x)=7x²+2x là?", ["14x+2", "7x+2", "14x", "7x²+2"], 0, "f'(x)=14x+2."], ["Đạo hàm", "Đạo hàm của f(x)=2x²+3x là?", ["4x+3", "2x+3", "4x", "2x²+3"], 0, "f'(x)=4x+3."], ["Đạo hàm", "Đạo hàm của f(x)=3x²+4x là?", ["6x+4", "3x+4", "6x", "3x²+4"], 0, "f'(x)=6x+4."], ["Đạo hàm", "Đạo hàm của f(x)=4x²+1x là?", ["8x+1", "4x+1", "8x", "4x²+1"], 0, "f'(x)=8x+1."], ["Đạo hàm", "Đạo hàm của f(x)=5x²+2x là?", ["10x+2", "5x+2", "10x", "5x²+2"], 0, "f'(x)=10x+2."], ["Đạo hàm", "Đạo hàm của f(x)=6x²+3x là?", ["12x+3", "6x+3", "12x", "6x²+3"], 0, "f'(x)=12x+3."], ["Đạo hàm", "Đạo hàm của f(x)=7x²+4x là?", ["14x+4", "7x+4", "14x", "7x²+4"], 0, "f'(x)=14x+4."], ["Đạo hàm", "Đạo hàm của f(x)=2x²+1x là?", ["4x+1", "2x+1", "4x", "2x²+1"], 0, "f'(x)=4x+1."], ["Đạo hàm", "Đạo hàm của f(x)=3x²+2x là?", ["6x+2", "3x+2", "6x", "3x²+2"], 0, "f'(x)=6x+2."], ["Đạo hàm", "Đạo hàm của f(x)=4x²+3x là?", ["8x+3", "4x+3", "8x", "4x²+3"], 0, "f'(x)=8x+3."], ["Ứng dụng đạo hàm", "Với f(x)=1x²+2x, f'(1) bằng?", ["4", "5", "2", "3"], 0, "f'(1)=4."], ["Ứng dụng đạo hàm", "Với f(x)=2x²+3x, f'(2) bằng?", ["11", "12", "8", "7"], 0, "f'(2)=11."], ["Ứng dụng đạo hàm", "Với f(x)=3x²+4x, f'(3) bằng?", ["22", "23", "18", "13"], 0, "f'(3)=22."], ["Ứng dụng đạo hàm", "Với f(x)=4x²+5x, f'(1) bằng?", ["13", "14", "8", "9"], 0, "f'(1)=13."], ["Ứng dụng đạo hàm", "Với f(x)=5x²+2x, f'(2) bằng?", ["22", "23", "20", "12"], 0, "f'(2)=22."], ["Ứng dụng đạo hàm", "Với f(x)=1x²+3x, f'(3) bằng?", ["9", "10", "6", "6"], 0, "f'(3)=9."], ["Ứng dụng đạo hàm", "Với f(x)=2x²+4x, f'(1) bằng?", ["8", "9", "4", "6"], 0, "f'(1)=8."], ["Ứng dụng đạo hàm", "Với f(x)=3x²+5x, f'(2) bằng?", ["17", "18", "12", "11"], 0, "f'(2)=17."], ["Ứng dụng đạo hàm", "Với f(x)=4x²+2x, f'(3) bằng?", ["26", "27", "24", "14"], 0, "f'(3)=26."], ["Ứng dụng đạo hàm", "Với f(x)=5x²+3x, f'(1) bằng?", ["13", "14", "10", "8"], 0, "f'(1)=13."], ["Ứng dụng đạo hàm", "Với f(x)=1x²+4x, f'(2) bằng?", ["8", "9", "4", "6"], 0, "f'(2)=8."], ["Ứng dụng đạo hàm", "Với f(x)=2x²+5x, f'(3) bằng?", ["17", "18", "12", "11"], 0, "f'(3)=17."], ["Ứng dụng đạo hàm", "Với f(x)=3x²+2x, f'(1) bằng?", ["8", "9", "6", "5"], 0, "f'(1)=8."], ["Ứng dụng đạo hàm", "Với f(x)=4x²+3x, f'(2) bằng?", ["19", "20", "16", "11"], 0, "f'(2)=19."], ["Ứng dụng đạo hàm", "Với f(x)=5x²+4x, f'(3) bằng?", ["34", "35", "30", "19"], 0, "f'(3)=34."], ["Tổ hợp - xác suất", "Số tổ hợp chập 2 của 5 phần tử là?", ["10", "20", "10", "7"], 0, "C(5,2)=10."], ["Tổ hợp - xác suất", "Số chỉnh hợp chập 3 của 6 phần tử là?", ["120", "20", "18", "216"], 0, "A(6,3)=120."], ["Tổ hợp - xác suất", "Số tổ hợp chập 4 của 7 phần tử là?", ["35", "840", "28", "11"], 0, "C(7,4)=35."], ["Tổ hợp - xác suất", "Số chỉnh hợp chập 2 của 8 phần tử là?", ["56", "28", "16", "64"], 0, "A(8,2)=56."], ["Tổ hợp - xác suất", "Số tổ hợp chập 3 của 9 phần tử là?", ["84", "504", "27", "12"], 0, "C(9,3)=84."], ["Tổ hợp - xác suất", "Số chỉnh hợp chập 4 của 10 phần tử là?", ["5040", "210", "40", "10000"], 0, "A(10,4)=5040."], ["Tổ hợp - xác suất", "Số tổ hợp chập 2 của 5 phần tử là?", ["10", "20", "10", "7"], 0, "C(5,2)=10."], ["Tổ hợp - xác suất", "Số chỉnh hợp chập 3 của 6 phần tử là?", ["120", "20", "18", "216"], 0, "A(6,3)=120."], ["Tổ hợp - xác suất", "Số tổ hợp chập 4 của 7 phần tử là?", ["35", "840", "28", "11"], 0, "C(7,4)=35."], ["Tổ hợp - xác suất", "Số chỉnh hợp chập 2 của 8 phần tử là?", ["56", "28", "16", "64"], 0, "A(8,2)=56."], ["Tổ hợp - xác suất", "Số tổ hợp chập 3 của 9 phần tử là?", ["84", "504", "27", "12"], 0, "C(9,3)=84."], ["Tổ hợp - xác suất", "Số chỉnh hợp chập 4 của 10 phần tử là?", ["5040", "210", "40", "10000"], 0, "A(10,4)=5040."], ["Tổ hợp - xác suất", "Số tổ hợp chập 2 của 5 phần tử là?", ["10", "20", "10", "7"], 0, "C(5,2)=10."], ["Tổ hợp - xác suất", "Số chỉnh hợp chập 3 của 6 phần tử là?", ["120", "20", "18", "216"], 0, "A(6,3)=120."], ["Tổ hợp - xác suất", "Số tổ hợp chập 4 của 7 phần tử là?", ["35", "840", "28", "11"], 0, "C(7,4)=35."]];

const EXTRA_LANGUAGE_QUESTIONS = [
  ...toQuestions("HSK 4", "hsk4", HSK4_QUESTIONS),
  ...toQuestions("HSK 5", "hsk5", HSK5_QUESTIONS),
  ...toQuestions("Tiếng Anh • Đảo ngữ", "english_inversion", EN_DAO_NGU),
  ...toQuestions("Tiếng Anh • Thức giả định", "english_subjunctive", EN_THUC_GIA_DINH),
  ...toQuestions("Tiếng Anh • Trạng từ rút gọn", "english_reduced", EN_TRANG_TU_RUT_GON),
  ...toQuestions("Tiếng Anh • Mệnh đề trạng ngữ", "english_adverbial", EN_MENH_DE_TRANG_NGU),
  ...toQuestions("Tiếng Anh • Idiom", "english_idiom", EN_IDIOM),
  ...toQuestions("Tiếng Anh • Phrasal verb", "english_phrasal", EN_PHRASAL_VERB),
  ...toQuestions("Tiếng Anh • Đồng nghĩa", "english_synonym", EN_DONG_NGHIA),
  ...toQuestions("Tiếng Anh • Trái nghĩa", "english_antonym", EN_TRAI_NGHIA),
];

const QUIZ_BANK = [
  ...toQuestions("Ngữ văn", "van", VAN_QUESTIONS),
  ...toQuestions("Vật lý", "ly", LY_QUESTIONS),
  ...toQuestions("Toán", "toan10_11", TOAN_10_11_QUESTIONS),
  ...toQuestions("Toán 11", "toan11", TOAN_11_QUESTIONS),
  ...toQuestions("Vật lý", "ly10_11", LY_10_11_QUESTIONS),
  ...toQuestions("Hóa học", "hoa", HOA_QUESTIONS),
  ...toQuestions("Sinh học", "sinh", SINH_QUESTIONS),
  ...toQuestions("Lịch sử", "su", SU_QUESTIONS),
  ...toQuestions("Địa lý", "dia", DIA_QUESTIONS),
  ...toQuestions("Tiếng Anh", "anh", ANH_QUESTIONS),
  ...toQuestions("GDCD", "gdcd", GDCD_QUESTIONS),
  ...toQuestions("Đố mẹo", "meo", MEO_QUESTIONS),
  ...toQuestions("Modal Verbs", "modalverb", MODAL_VERB_QUESTIONS),
  ...EXTRA_LANGUAGE_QUESTIONS,
];

/* =========================================================
   CÁC KỲ THI TRONG NĂM HỌC
   5 kỳ thi × 8 môn × 5 câu = 200 câu riêng biệt.
   Bộ đề thi độc lập với kho ôn tập hiện có + 260 câu mới phía trên.
========================================================= */
const EXAM_SUBJECTS = ["Ngữ văn", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Địa lý", "Tiếng Anh", "GDCD"];

const EXAM_SCHEDULE = [
  {id:"mid1", title:"Giữa kỳ 1", icon:"📝", day:8, timeIndex:4},
  {id:"final1", title:"Cuối kỳ 1", icon:"📕", day:17, timeIndex:4},
  {id:"mid2", title:"Giữa kỳ 2", icon:"📝", day:26, timeIndex:4},
  {id:"final2", title:"Cuối kỳ 2", icon:"📕", day:35, timeIndex:4},
  {id:"thpt", title:"Thi THPT", icon:"🎓", day:45, timeIndex:4},
];

const EXAM_BANKS = {
  mid1: {
    "Ngữ văn": [
      {"topic":"Truyện Kiều","q":"Truyện Kiều chủ yếu được viết bằng thể thơ nào?","choices":["Lục bát","Song thất lục bát","Thất ngôn bát cú","Tự do"],"answer":0,"explanation":"Truyện Kiều được viết chủ yếu bằng thể thơ lục bát."},
      {"topic":"Truyện Kiều","q":"Ngôn ngữ Truyện Kiều nổi bật ở đặc điểm nào?","choices":["Giàu tính dân tộc và giàu sức biểu cảm","Chỉ dùng từ Hán Việt","Hoàn toàn khẩu ngữ","Chỉ dùng thuật ngữ khoa học"],"answer":0,"explanation":"Nguyễn Du vận dụng rất linh hoạt ngôn ngữ dân tộc và tiếng Việt giàu sức biểu cảm."},
      {"topic":"Truyện Kiều","q":"Nhân vật nào là người chị của Thúy Vân?","choices":["Thúy Kiều","Đạm Tiên","Hoạn Thư","Giác Duyên"],"answer":0,"explanation":"Thúy Kiều là chị, Thúy Vân là em."},
      {"topic":"Chí Phèo","q":"Sau khi trở về làng, Chí Phèo thường dùng cách nào để gây sự?","choices":["Uống rượu và rạch mặt ăn vạ","Bỏ làng đi nơi khác","Viết thư khiếu nại","Xin việc trong trường học"],"answer":0,"explanation":"Chí Phèo thường uống rượu, chửi bới và rạch mặt ăn vạ để gây sự."},
      {"topic":"Chí Phèo","q":"Ai là người khiến Chí Phèo lần đầu cảm nhận rõ khát vọng làm người lương thiện?","choices":["Thị Nở","Bá Kiến","Lý Cường","Ông giáo"],"answer":0,"explanation":"Sự chăm sóc của Thị Nở đánh thức khát vọng lương thiện ở Chí Phèo."},
    ],
    "Vật lý": [
      {"topic":"Điện lượng","q":"Đơn vị SI của điện lượng là gì?","choices":["Coulomb (C)","Volt (V)","Ampere (A)","Watt (W)"],"answer":0,"explanation":"Điện lượng có đơn vị coulomb (C)."},
      {"topic":"Công suất","q":"Hiệu suất của một máy được tính bằng tỉ số nào?","choices":["Công có ích chia cho công toàn phần","Công toàn phần chia cho công có ích","Lực chia cho thời gian","Khối lượng chia cho thể tích"],"answer":0,"explanation":"Hiệu suất bằng công có ích chia cho công toàn phần."},
      {"topic":"Khối lượng riêng","q":"Công thức tính khối lượng riêng là gì?","choices":["D = m/V","D = V/m","D = mV","D = F/s"],"answer":0,"explanation":"Khối lượng riêng bằng khối lượng chia thể tích."},
      {"topic":"Áp suất","q":"Áp suất của chất rắn lên một mặt được tính bởi công thức nào?","choices":["p = F/S","p = FS","p = S/F","p = m/V"],"answer":0,"explanation":"Áp suất bằng áp lực trên diện tích bị ép."},
      {"topic":"Lực đẩy","q":"Lực đẩy Archimedes có phương như thế nào?","choices":["Thẳng đứng, hướng lên","Nằm ngang","Thẳng đứng, hướng xuống","Luôn nghiêng 45 độ"],"answer":0,"explanation":"Lực đẩy Archimedes có phương thẳng đứng và chiều từ dưới lên."},
    ],
    "Hóa học": [
      {"topic":"Mol","q":"Một mol chất chứa khoảng bao nhiêu hạt vi mô?","choices":["6,02×10²³","6,02×10²⁰","9,81×10⁸","3×10²³"],"answer":0,"explanation":"Số Avogadro xấp xỉ 6,02×10²³ hạt/mol."},
      {"topic":"Oxidation","q":"Quá trình nhường electron được gọi là gì?","choices":["Oxi hóa","Khử","Trung hòa","Điện li"],"answer":0,"explanation":"Nhường electron là quá trình oxi hóa."},
      {"topic":"Reduction","q":"Quá trình nhận electron được gọi là gì?","choices":["Khử","Oxi hóa","Trùng hợp","Thủy phân"],"answer":0,"explanation":"Nhận electron là quá trình khử."},
      {"topic":"Dung dịch","q":"Nồng độ mol cho biết điều gì?","choices":["Số mol chất tan trong 1 lít dung dịch","Khối lượng dung môi trong 1 gam","Thể tích chất rắn trong 1 kg","Số electron trong nguyên tử"],"answer":0,"explanation":"Nồng độ mol là số mol chất tan có trong 1 lít dung dịch."},
      {"topic":"Kết tủa","q":"Khi phản ứng tạo ra chất rắn không tan trong dung dịch, chất rắn đó thường gọi là gì?","choices":["Kết tủa","Dung môi","Chất xúc tác","Điện cực"],"answer":0,"explanation":"Chất rắn không tan sinh ra trong dung dịch gọi là kết tủa."},
    ],
    "Sinh học": [
      {"topic":"Tế bào","q":"Bào quan nào là trung tâm hô hấp tế bào và tạo nhiều ATP?","choices":["Ti thể","Ribosome","Lục lạp","Không bào"],"answer":0,"explanation":"Ti thể là nơi diễn ra phần lớn quá trình hô hấp tế bào và tạo ATP."},
      {"topic":"Tế bào","q":"Ribosome có vai trò chính nào?","choices":["Tổng hợp protein","Quang hợp","Lưu trữ nước","Tạo thành tế bào"],"answer":0,"explanation":"Ribosome là nơi tổng hợp protein."},
      {"topic":"Màng sinh chất","q":"Màng sinh chất có tính chất nào giúp tế bào kiểm soát chất ra vào?","choices":["Tính thấm chọn lọc","Không thấm hoàn toàn","Chỉ cho nước qua","Chỉ cho ion qua"],"answer":0,"explanation":"Màng sinh chất có tính thấm chọn lọc."},
      {"topic":"DNA","q":"Trong DNA, adenine bắt cặp với base nào?","choices":["Thymine","Guanine","Cytosine","Uracil"],"answer":0,"explanation":"Adenine bắt cặp với thymine trong DNA."},
      {"topic":"RNA","q":"Trong RNA, base nào thay thymine?","choices":["Uracil","Cytosine","Guanine","Adenine"],"answer":0,"explanation":"RNA sử dụng uracil thay cho thymine."},
    ],
    "Lịch sử": [
      {"topic":"Việt Nam 1945","q":"Chính phủ Việt Nam Dân chủ Cộng hòa ra mắt quốc dân tại đâu?","choices":["Quảng trường Ba Đình","Căn cứ Pác Bó","Chiến khu Việt Bắc","Huế"],"answer":0,"explanation":"Sau Cách mạng tháng Tám, lễ ra mắt Chính phủ diễn ra tại Hà Nội."},
      {"topic":"Kháng chiến chống Pháp","q":"Chiến dịch Điện Biên Phủ kết thúc vào năm nào?","choices":["1954","1945","1968","1975"],"answer":0,"explanation":"Chiến dịch Điện Biên Phủ kết thúc ngày 7/5/1954."},
      {"topic":"Kháng chiến chống Pháp","q":"Hiệp định Genève năm 1954 liên quan trực tiếp đến việc chấm dứt chiến tranh ở đâu?","choices":["Đông Dương","Triều Tiên","Trung Đông","Tây Âu"],"answer":0,"explanation":"Hiệp định Genève năm 1954 giải quyết vấn đề Đông Dương."},
      {"topic":"Kháng chiến chống Mỹ","q":"Phong trào Đồng khởi bùng nổ mạnh mẽ ở miền Nam vào giai đoạn nào?","choices":["1959-1960","1945-1946","1968-1969","1974-1975"],"answer":0,"explanation":"Phong trào Đồng khởi diễn ra mạnh trong 1959-1960, tiêu biểu ở Bến Tre."},
      {"topic":"Kháng chiến chống Mỹ","q":"Chiến thắng nào năm 1972 góp phần tạo sức ép lớn trên bàn đàm phán Paris?","choices":["Điện Biên Phủ trên không","Biên giới 1950","Việt Bắc 1947","Hòa Bình 1951"],"answer":0,"explanation":"Chiến thắng Hà Nội - Hải Phòng cuối năm 1972 thường gọi là Điện Biên Phủ trên không."},
    ],
    "Địa lý": [
      {"topic":"Nông nghiệp","q":"Vùng nào đứng đầu cả nước về sản lượng lúa?","choices":["Đồng bằng sông Cửu Long","Tây Nguyên","Đông Bắc","Bắc Trung Bộ"],"answer":0,"explanation":"Đồng bằng sông Cửu Long là vùng sản xuất lúa lớn nhất cả nước."},
      {"topic":"Công nghiệp","q":"Trung tâm công nghiệp lớn của Đông Nam Bộ là thành phố nào?","choices":["Thành phố Hồ Chí Minh","Điện Biên Phủ","Huế","Cần Thơ"],"answer":0,"explanation":"Thành phố Hồ Chí Minh là trung tâm công nghiệp lớn của vùng Đông Nam Bộ."},
      {"topic":"Giao thông","q":"Tuyến đường sắt Bắc - Nam còn được gọi là gì?","choices":["Đường sắt Thống Nhất","Đường sắt Tây Bắc","Đường sắt Đông - Tây","Đường sắt ven biển"],"answer":0,"explanation":"Tuyến đường sắt Bắc - Nam thường gọi là đường sắt Thống Nhất."},
      {"topic":"Khí hậu","q":"Tính chất nhiệt đới của khí hậu Việt Nam thể hiện rõ ở yếu tố nào?","choices":["Nhiệt độ trung bình năm cao","Mùa đông kéo dài quanh năm","Lượng mưa luôn dưới 500 mm","Không có bão"],"answer":0,"explanation":"Nền nhiệt trung bình năm tương đối cao là biểu hiện của tính nhiệt đới."},
      {"topic":"Sông ngòi","q":"Sông nào có lưu vực lớn nhất trong hệ thống sông ngòi Việt Nam?","choices":["Sông Hồng","Sông Đồng Nai","Sông Thu Bồn","Sông Ba"],"answer":0,"explanation":"Hệ thống sông Hồng có lưu vực lớn và vai trò nổi bật ở miền Bắc."},
    ],
    "Tiếng Anh": [
      {"topic":"Grammar","q":"Choose the correct sentence.","choices":["She has lived here since 2020.","She live here since 2020.","She has live here since 2020.","She living here since 2020."],"answer":0,"explanation":"The present perfect is used with since for an action continuing to the present."},
      {"topic":"Grammar","q":"If I had more free time, I ___ a new language.","choices":["would learn","will learn","learned","am learning"],"answer":0,"explanation":"Second conditional: If + past simple, would + base verb."},
      {"topic":"Grammar","q":"The book ___ by millions of readers every year.","choices":["is read","reads","is reading","has read"],"answer":0,"explanation":"Use the present simple passive for a regular action."},
      {"topic":"Grammar","q":"By the time we arrived, the movie ___.","choices":["had started","starts","has started","will start"],"answer":0,"explanation":"Past perfect describes an earlier past action."},
      {"topic":"Grammar","q":"I am looking forward to ___ you again.","choices":["seeing","see","saw","to see"],"answer":0,"explanation":"Look forward to is followed by a gerund."},
    ],
    "GDCD": [
      {"topic":"Pháp luật","q":"Pháp luật có đặc trưng nào sau đây?","choices":["Tính bắt buộc chung","Chỉ áp dụng cho trẻ em","Chỉ dựa vào thói quen","Không có chế tài"],"answer":0,"explanation":"Pháp luật có tính bắt buộc chung và được Nhà nước bảo đảm thực hiện."},
      {"topic":"Quyền công dân","q":"Công dân bình đẳng trước pháp luật nghĩa là gì?","choices":["Không ai bị phân biệt trong việc thực hiện quyền và nghĩa vụ theo pháp luật","Mọi người có thu nhập như nhau","Mọi người có cùng nghề nghiệp","Mọi người được miễn nghĩa vụ"],"answer":0,"explanation":"Bình đẳng trước pháp luật là nguyên tắc mọi người được đối xử bình đẳng trong khuôn khổ pháp luật."},
      {"topic":"Trách nhiệm","q":"Hành vi nào thể hiện trách nhiệm với cộng đồng?","choices":["Tuân thủ quy định nơi công cộng","Xả rác tùy ý","Phá hoại tài sản chung","Lan truyền tin giả"],"answer":0,"explanation":"Tuân thủ quy định và giữ gìn tài sản chung là biểu hiện trách nhiệm với cộng đồng."},
      {"topic":"Quyền riêng tư","q":"Tự ý đăng ảnh riêng tư của người khác lên mạng có thể xâm phạm quyền nào?","choices":["Quyền về đời tư và hình ảnh","Quyền sở hữu trí tuệ của Nhà nước","Quyền được nghỉ học","Quyền đăng ký xe"],"answer":0,"explanation":"Đời tư và hình ảnh cá nhân được pháp luật bảo vệ trong những điều kiện nhất định."},
      {"topic":"Hợp đồng","q":"Một hợp đồng hợp pháp thường dựa trên yếu tố nào?","choices":["Sự tự nguyện và phù hợp pháp luật","Ép buộc một bên","Che giấu mọi thông tin","Không cần điều khoản"],"answer":0,"explanation":"Hợp đồng hợp pháp cần dựa trên sự tự nguyện và không trái quy định pháp luật."},
    ],
  },
  final1: {
    "Ngữ văn": [
      {"topic":"Vợ nhặt","q":"Bà cụ Tứ là nhân vật nào trong Vợ nhặt?","choices":["Mẹ của Tràng","Mẹ của Thị","Hàng xóm của Tràng","Chủ nhà trọ"],"answer":0,"explanation":"Bà cụ Tứ là mẹ của Tràng."},
      {"topic":"Vợ nhặt","q":"Chi tiết nồi cháo cám trong Vợ nhặt gợi cảm giác gì?","choices":["Khắc nghiệt của nạn đói nhưng vẫn có tình người","Sự giàu sang của gia đình","Không khí hội hè","Niềm vui chiến thắng"],"answer":0,"explanation":"Nồi cháo cám vừa cho thấy cái đói khắc nghiệt vừa làm nổi bật tình thương và hy vọng."},
      {"topic":"Vợ chồng A Phủ","q":"Mị trong Vợ chồng A Phủ sống ở nhà ai?","choices":["Thống lí Pá Tra","Bá Kiến","Ông Hai","Bà cụ Tứ"],"answer":0,"explanation":"Mị bị bắt về làm con dâu gạt nợ trong nhà thống lí Pá Tra."},
      {"topic":"Vợ chồng A Phủ","q":"Hành động nào thể hiện Mị phản kháng khi cứu A Phủ?","choices":["Cắt dây trói cho A Phủ rồi cùng chạy trốn","Đốt nhà thống lí","Bỏ về nhà bố mẹ ngay lập tức","Báo quan"],"answer":0,"explanation":"Mị cắt dây trói cho A Phủ rồi cùng anh chạy trốn khỏi Hồng Ngài."},
      {"topic":"Tây Tiến","q":"Địa bàn hoạt động của đoàn quân Tây Tiến chủ yếu gắn với vùng nào?","choices":["Tây Bắc","Nam Bộ","Đồng bằng sông Cửu Long","Đông Nam Bộ"],"answer":0,"explanation":"Tây Tiến gắn với vùng núi Tây Bắc và biên giới Việt-Lào."},
    ],
    "Vật lý": [
      {"topic":"Nhiệt học","q":"Nhiệt lượng vật thu vào khi tăng nhiệt độ được tính theo công thức nào?","choices":["Q = mcΔt","Q = m/cΔt","Q = c/(mΔt)","Q = mgh"],"answer":0,"explanation":"Nhiệt lượng khi không có chuyển thể được tính Q = mcΔt."},
      {"topic":"Nhiệt nóng chảy","q":"Trong quá trình nóng chảy của chất rắn kết tinh, nhiệt độ thường như thế nào?","choices":["Không đổi","Tăng liên tục","Giảm liên tục","Bằng 0°C trong mọi trường hợp"],"answer":0,"explanation":"Với chất rắn kết tinh, trong lúc nóng chảy nhiệt độ giữ không đổi ở nhiệt độ nóng chảy."},
      {"topic":"Nhiệt độ","q":"Dụng cụ đo nhiệt độ thông dụng là gì?","choices":["Nhiệt kế","Lực kế","Ampe kế","Vôn kế"],"answer":0,"explanation":"Nhiệt kế dùng để đo nhiệt độ."},
      {"topic":"Ma sát","q":"Lực ma sát trượt có chiều như thế nào so với chuyển động tương đối?","choices":["Ngược chiều chuyển động tương đối","Cùng chiều chuyển động","Vuông góc với chuyển động","Không có phương xác định"],"answer":0,"explanation":"Ma sát trượt cản trở chuyển động tương đối giữa hai bề mặt."},
      {"topic":"Đàn hồi","q":"Theo định luật Hooke trong giới hạn đàn hồi, độ lớn lực đàn hồi tỉ lệ với đại lượng nào?","choices":["Độ biến dạng","Khối lượng vật","Thời gian","Nhiệt độ"],"answer":0,"explanation":"Trong giới hạn đàn hồi, lực đàn hồi tỉ lệ với độ biến dạng."},
    ],
    "Hóa học": [
      {"topic":"Điện phân","q":"Trong điện phân, catot là điện cực xảy ra quá trình nào?","choices":["Khử","Oxi hóa","Trung hòa","Bay hơi"],"answer":0,"explanation":"Catot là nơi xảy ra quá trình khử."},
      {"topic":"Este","q":"Phản ứng giữa axit cacboxylic và ancol tạo este thường gọi là gì?","choices":["Este hóa","Trùng hợp","Cracking","Điện phân"],"answer":0,"explanation":"Axit cacboxylic phản ứng với ancol tạo este và nước là phản ứng este hóa."},
      {"topic":"Ancol","q":"Nhóm chức đặc trưng của ancol là gì?","choices":["-OH","-COOH","-CHO","-COO-"],"answer":0,"explanation":"Ancol chứa nhóm hydroxyl -OH liên kết với carbon no."},
      {"topic":"Axit cacboxylic","q":"Nhóm chức của axit cacboxylic là gì?","choices":["-COOH","-OH","-NH2","-CHO"],"answer":0,"explanation":"Axit cacboxylic chứa nhóm carboxyl -COOH."},
      {"topic":"Amino acid","q":"Nhóm chức đặc trưng của amino acid là gì?","choices":["-NH2 và -COOH","-OH và -CHO","-Cl và -Br","-NO2 và -OH"],"answer":0,"explanation":"Amino acid điển hình chứa đồng thời nhóm amino và carboxyl."},
    ],
    "Sinh học": [
      {"topic":"Phiên mã","q":"Phiên mã là quá trình tổng hợp phân tử nào?","choices":["RNA từ khuôn DNA","DNA từ protein","Protein từ lipid","ATP từ RNA"],"answer":0,"explanation":"Phiên mã tạo RNA dựa trên một mạch DNA khuôn."},
      {"topic":"Dịch mã","q":"Dịch mã diễn ra chủ yếu ở đâu?","choices":["Ribosome","Nhân tế bào","Lục lạp בלבד","Màng tế bào"],"answer":0,"explanation":"Dịch mã tổng hợp protein tại ribosome."},
      {"topic":"Nguyên phân","q":"Kết quả của một lần nguyên phân của tế bào sinh dưỡng thường là gì?","choices":["Hai tế bào con gần như giống nhau về bộ NST","Bốn tế bào con đơn bội","Một tế bào con","Hai giao tử"],"answer":0,"explanation":"Nguyên phân tạo hai tế bào con có bộ nhiễm sắc thể tương đương tế bào mẹ."},
      {"topic":"Giảm phân","q":"Giảm phân có vai trò quan trọng trong việc tạo ra loại tế bào nào?","choices":["Giao tử","Tế bào gan","Tế bào cơ","Tế bào da"],"answer":0,"explanation":"Giảm phân tạo giao tử ở sinh vật sinh sản hữu tính."},
      {"topic":"Di truyền","q":"Kiểu gen là gì?","choices":["Tổ hợp các allele của cá thể","Tập hợp tính trạng quan sát được","Môi trường sống","Tuổi của cá thể"],"answer":0,"explanation":"Kiểu gen là tổ hợp allele mà cá thể mang."},
    ],
    "Lịch sử": [
      {"topic":"Paris","q":"Hiệp định Paris về Việt Nam được ký năm nào?","choices":["1973","1968","1972","1975"],"answer":0,"explanation":"Hiệp định Paris được ký ngày 27/1/1973."},
      {"topic":"1975","q":"Chiến dịch Hồ Chí Minh diễn ra vào năm nào?","choices":["1975","1972","1968","1986"],"answer":0,"explanation":"Chiến dịch Hồ Chí Minh diễn ra tháng 4/1975."},
      {"topic":"Đổi mới","q":"Đường lối Đổi mới được đề ra tại Đại hội nào?","choices":["Đại hội VI (1986)","Đại hội IV (1976)","Đại hội II (1951)","Đại hội X (2006)"],"answer":0,"explanation":"Đại hội VI năm 1986 đề ra đường lối Đổi mới."},
      {"topic":"ASEAN","q":"Trụ sở Ban Thư ký ASEAN đặt tại thành phố nào?","choices":["Jakarta","Bangkok","Manila","Hà Nội"],"answer":0,"explanation":"Ban Thư ký ASEAN đặt tại Jakarta, Indonesia."},
      {"topic":"Liên Hợp Quốc","q":"Tổ chức Liên Hợp Quốc được thành lập vào năm nào?","choices":["1945","1919","1954","1961"],"answer":0,"explanation":"Liên Hợp Quốc chính thức thành lập năm 1945."},
    ],
    "Địa lý": [
      {"topic":"Biển","q":"Hai quần đảo lớn của Việt Nam là gì?","choices":["Hoàng Sa và Trường Sa","Cát Bà và Phú Quốc","Cô Tô và Lý Sơn","Côn Đảo và Phú Quý"],"answer":0,"explanation":"Hoàng Sa và Trường Sa là hai quần đảo lớn của Việt Nam."},
      {"topic":"Dân số","q":"Dân số đông tạo lợi thế nào cho phát triển kinh tế?","choices":["Nguồn lao động và thị trường rộng","Không cần đầu tư cơ sở hạ tầng","Giảm nhu cầu hàng hóa","Loại bỏ đô thị hóa"],"answer":0,"explanation":"Dân số đông tạo nguồn lao động và thị trường tiêu dùng lớn."},
      {"topic":"Đô thị","q":"Đô thị hóa quá nhanh có thể gây sức ép lên yếu tố nào?","choices":["Hạ tầng và môi trường","Chiều dài bờ biển","Trữ lượng than toàn cầu","Độ nghiêng trục Trái Đất"],"answer":0,"explanation":"Đô thị hóa nhanh có thể gây áp lực lên hạ tầng, giao thông và môi trường."},
      {"topic":"Tây Nguyên","q":"Cà phê là cây công nghiệp lâu năm quan trọng nhất của vùng nào?","choices":["Tây Nguyên","Đồng bằng sông Hồng","Đông Bắc","Bắc Trung Bộ"],"answer":0,"explanation":"Tây Nguyên nổi tiếng với sản xuất cà phê quy mô lớn."},
      {"topic":"Đông Nam Bộ","q":"Đông Nam Bộ mạnh về cây công nghiệp lâu năm nào?","choices":["Cao su","Chè","Thuốc lá","Cói"],"answer":0,"explanation":"Đông Nam Bộ là vùng trồng cao su lớn."},
    ],
    "Tiếng Anh": [
      {"topic":"Vocabulary","q":"The word 'generous' is closest in meaning to ___.","choices":["willing to give","very quiet","easily angry","extremely tired"],"answer":0,"explanation":"Generous means willing to give or share."},
      {"topic":"Vocabulary","q":"A person who designs buildings is an ___.","choices":["architect","accountant","athlete","artist"],"answer":0,"explanation":"An architect designs buildings."},
      {"topic":"Vocabulary","q":"If something is 'reliable', it is ___.","choices":["dependable","expensive","dangerous","temporary"],"answer":0,"explanation":"Reliable means dependable and trustworthy."},
      {"topic":"Vocabulary","q":"The opposite of 'ancient' is ___.","choices":["modern","narrow","distant","formal"],"answer":0,"explanation":"Modern is the opposite of ancient."},
      {"topic":"Vocabulary","q":"To 'reduce' something means to ___.","choices":["make it smaller or less","make it disappear completely","copy it exactly","measure it"],"answer":0,"explanation":"Reduce means make smaller or less."},
    ],
    "GDCD": [
      {"topic":"Tiêu dùng","q":"Khi mua hàng trực tuyến, người tiêu dùng nên làm gì?","choices":["Kiểm tra người bán, thông tin sản phẩm và điều kiện giao dịch","Gửi mật khẩu tài khoản","Bỏ qua hóa đơn","Chuyển tiền cho tài khoản không rõ nguồn"],"answer":0,"explanation":"Kiểm tra thông tin giúp giảm rủi ro và bảo vệ quyền lợi người tiêu dùng."},
      {"topic":"Bình đẳng","q":"Bình đẳng giới không đồng nghĩa với việc gì?","choices":["Mọi người phải có nghề nghiệp giống nhau","Mọi người có cơ hội và quyền bình đẳng","Không phân biệt giới tính trái pháp luật","Tôn trọng năng lực từng người"],"answer":0,"explanation":"Bình đẳng giới không có nghĩa mọi người phải làm cùng một nghề."},
      {"topic":"Đạo đức","q":"Trung thực trong học tập góp phần xây dựng điều gì?","choices":["Nhân cách và niềm tin","Thói quen gian lận","Môi trường thiếu công bằng","Sự bất tín"],"answer":0,"explanation":"Trung thực giúp xây dựng nhân cách, uy tín và môi trường học tập công bằng."},
      {"topic":"Kỷ luật","q":"Tự giác chấp hành nội quy trường học thể hiện phẩm chất nào?","choices":["Kỷ luật và trách nhiệm","Vụ lợi","Ích kỷ","Thờ ơ"],"answer":0,"explanation":"Tự giác chấp hành nội quy thể hiện kỷ luật và trách nhiệm."},
      {"topic":"Công dân","q":"Thực hiện nghĩa vụ công dân đúng pháp luật là trách nhiệm của ai?","choices":["Mỗi công dân","Chỉ cán bộ","Chỉ doanh nghiệp","Chỉ người lớn tuổi"],"answer":0,"explanation":"Mỗi công dân đều có nghĩa vụ tôn trọng và thực hiện pháp luật."},
    ],
  },
  mid2: {
    "Ngữ văn": [
      {"topic":"Tây Tiến","q":"Hình tượng người lính Tây Tiến được khắc họa với sự kết hợp nào?","choices":["Bi tráng và lãng mạn","Hài hước và châm biếm","Khoa học và chính luận","Tả thực lạnh lùng"],"answer":0,"explanation":"Quang Dũng kết hợp vẻ đẹp lãng mạn với chất bi tráng."},
      {"topic":"Sóng","q":"Hình tượng sóng trong bài thơ cùng tên của Xuân Quỳnh chủ yếu tượng trưng cho điều gì?","choices":["Tâm trạng và khát vọng tình yêu","Chiến tranh","Tuổi thơ nông thôn","Thiên nhiên mùa đông"],"answer":0,"explanation":"Sóng là hình tượng biểu đạt những cung bậc và khát vọng của tình yêu."},
      {"topic":"Sóng","q":"Bài thơ Sóng chủ yếu được viết theo thể thơ nào?","choices":["Năm chữ","Lục bát","Thất ngôn","Tám chữ"],"answer":0,"explanation":"Sóng được viết chủ yếu bằng thể thơ năm chữ."},
      {"topic":"Đồng chí","q":"Cơ sở hình thành tình đồng chí trong bài thơ Đồng chí là gì?","choices":["Cùng cảnh ngộ và cùng chung nhiệm vụ chiến đấu","Cùng quê giàu có","Cùng học một trường","Cùng làm một nghề trước chiến tranh"],"answer":0,"explanation":"Những người lính từ các miền quê có cùng cảnh ngộ và nhiệm vụ nên gắn bó với nhau."},
      {"topic":"Bếp lửa","q":"Hình ảnh người bà trong Bếp lửa gắn với phẩm chất nào nổi bật?","choices":["Tần tảo và giàu yêu thương","Lạnh lùng và nghiêm khắc","Phiêu lưu và mạo hiểm","Giàu có và quyền lực"],"answer":0,"explanation":"Người bà hiện lên tần tảo, giàu đức hi sinh và yêu thương cháu."},
    ],
    "Vật lý": [
      {"topic":"Điện thế","q":"Hiệu điện thế giữa hai điểm có thể hiểu là công của lực điện trên một đơn vị nào?","choices":["Điện tích","Khối lượng","Thể tích","Thời gian"],"answer":0,"explanation":"Hiệu điện thế liên quan đến công tính trên một đơn vị điện tích."},
      {"topic":"Điện năng","q":"Đơn vị thường dùng của điện năng trong gia đình là gì?","choices":["kWh","N","Pa","Hz"],"answer":0,"explanation":"Điện năng tiêu thụ trong gia đình thường tính bằng kWh."},
      {"topic":"Mạch điện","q":"Cầu chì trong mạch điện gia đình có tác dụng chính gì?","choices":["Bảo vệ mạch khi dòng điện quá lớn","Tăng điện áp","Tăng điện trở mọi lúc","Làm đèn sáng hơn"],"answer":0,"explanation":"Cầu chì nóng chảy để bảo vệ mạch khi có dòng điện quá lớn."},
      {"topic":"Điện xoay chiều","q":"Tần số dòng điện xoay chiều dùng phổ biến trong lưới điện Việt Nam là bao nhiêu?","choices":["50 Hz","25 Hz","60 Hz","100 Hz"],"answer":0,"explanation":"Lưới điện dân dụng Việt Nam sử dụng dòng xoay chiều 50 Hz."},
      {"topic":"Phản xạ","q":"Theo định luật phản xạ ánh sáng, góc phản xạ bằng gì?","choices":["Góc tới","Góc tạo với mặt gương","180 độ trừ góc tới","Một nửa góc tới"],"answer":0,"explanation":"Góc phản xạ bằng góc tới."},
    ],
    "Hóa học": [
      {"topic":"Polymer","q":"Polyethylene được tạo thành chủ yếu từ monomer nào?","choices":["Ethene","Ethanol","Ethanoic acid","Benzene"],"answer":0,"explanation":"Polyethylene được trùng hợp từ ethene."},
      {"topic":"Kim loại","q":"Kim loại kiềm nào có kí hiệu hóa học Na?","choices":["Natri","Nhôm","Niken","Nitơ"],"answer":0,"explanation":"Na là kí hiệu của natri."},
      {"topic":"Phản ứng","q":"Phản ứng đốt cháy methane tạo ra những sản phẩm chính nào?","choices":["CO2 và H2O","CO và H2","C và H2","CH3OH và O2"],"answer":0,"explanation":"Methane cháy hoàn toàn tạo CO2 và H2O."},
      {"topic":"Carbon","q":"Kim cương và than chì là hai dạng thù hình của nguyên tố nào?","choices":["Carbon","Sulfur","Oxygen","Silicon"],"answer":0,"explanation":"Kim cương và than chì đều là dạng thù hình của carbon."},
      {"topic":"Silicate","q":"Thành phần chính của cát thạch anh là gì?","choices":["SiO2","NaCl","CaCO3","Al2O3"],"answer":0,"explanation":"Cát thạch anh chủ yếu chứa silicon dioxide SiO2."},
    ],
    "Sinh học": [
      {"topic":"Di truyền","q":"Kiểu hình của cá thể chịu ảnh hưởng của yếu tố nào?","choices":["Kiểu gen và môi trường","Chỉ kiểu gen","Chỉ môi trường","Chỉ tuổi"],"answer":0,"explanation":"Kiểu hình là kết quả tương tác giữa kiểu gen và môi trường."},
      {"topic":"Mendel","q":"Theo quy luật phân li, mỗi giao tử chỉ nhận bao nhiêu allele của một gen?","choices":["Một allele","Hai allele","Ba allele","Không có allele"],"answer":0,"explanation":"Một giao tử chỉ mang một trong các allele của một gen."},
      {"topic":"Đột biến","q":"Đột biến gen là biến đổi xảy ra ở đâu?","choices":["Trình tự nucleotide của gen","Toàn bộ hệ sinh thái","Khối lượng cơ thể","Môi trường sống"],"answer":0,"explanation":"Đột biến gen là biến đổi trong trình tự nucleotide của gen."},
      {"topic":"Nhiễm sắc thể","q":"Nhiễm sắc thể được cấu tạo chủ yếu từ gì?","choices":["DNA và protein histone","RNA và lipid","Glucose và nước","Tinh bột và cellulose"],"answer":0,"explanation":"Nhiễm sắc thể gồm DNA liên kết với protein, trong đó có histone."},
      {"topic":"Máu","q":"Nhóm máu ABO do hệ thống kháng nguyên nào trên hồng cầu quyết định?","choices":["A và B","C và D","X và Y","M và N בלבד"],"answer":0,"explanation":"Hệ ABO dựa trên sự có mặt của kháng nguyên A và/hoặc B trên hồng cầu."},
    ],
    "Lịch sử": [
      {"topic":"Thế giới sau chiến tranh","q":"Chiến tranh Lạnh là sự đối đầu chủ yếu giữa hai khối do nước nào đứng đầu?","choices":["Mỹ và Liên Xô","Anh và Pháp","Đức và Nhật","Trung Quốc và Ấn Độ"],"answer":0,"explanation":"Hai cực Mỹ và Liên Xô đứng đầu hai hệ thống đối lập trong Chiến tranh Lạnh."},
      {"topic":"Cách mạng tháng Tám","q":"Thắng lợi của Cách mạng tháng Tám năm 1945 dẫn đến sự ra đời của nhà nước nào?","choices":["Việt Nam Dân chủ Cộng hòa","Cộng hòa Xã hội Chủ nghĩa Việt Nam","Đại Nam","Liên bang Đông Dương"],"answer":0,"explanation":"Thắng lợi năm 1945 dẫn tới sự ra đời của Việt Nam Dân chủ Cộng hòa."},
      {"topic":"Việt Minh","q":"Mặt trận Việt Minh được thành lập vào năm nào?","choices":["1941","1930","1945","1954"],"answer":0,"explanation":"Mặt trận Việt Minh được thành lập tháng 5/1941."},
      {"topic":"Đảng Cộng sản","q":"Đảng Cộng sản Việt Nam được thành lập vào năm nào?","choices":["1930","1941","1945","1951"],"answer":0,"explanation":"Đảng Cộng sản Việt Nam thành lập đầu năm 1930."},
      {"topic":"Phong trào yêu nước","q":"Phong trào Xô viết Nghệ - Tĩnh diễn ra trong thời gian nào?","choices":["1930-1931","1925-1926","1940-1941","1945-1946"],"answer":0,"explanation":"Xô viết Nghệ - Tĩnh gắn với cao trào cách mạng 1930-1931."},
    ],
    "Địa lý": [
      {"topic":"Đồng bằng sông Hồng","q":"Thế mạnh nổi bật của Đồng bằng sông Hồng là gì?","choices":["Thâm canh lúa và phát triển đô thị - công nghiệp","Khai thác bauxite lớn nhất","Nuôi trồng cây công nghiệp nhiệt đới là chủ yếu","Chỉ phát triển lâm nghiệp"],"answer":0,"explanation":"Đồng bằng sông Hồng có trình độ thâm canh cao và đô thị hóa mạnh."},
      {"topic":"Bắc Trung Bộ","q":"Bắc Trung Bộ có thế mạnh nào gắn với biển?","choices":["Khai thác và nuôi trồng thủy sản","Trồng cà phê quy mô lớn nhất","Khai thác than lớn nhất","Trồng chè duy nhất"],"answer":0,"explanation":"Kinh tế biển, đặc biệt thủy sản, là thế mạnh của Bắc Trung Bộ."},
      {"topic":"Duyên hải miền Trung","q":"Duyên hải miền Trung thuận lợi phát triển du lịch nhờ yếu tố nào?","choices":["Nhiều bãi biển, cảnh quan và di sản","Có nhiều băng tuyết quanh năm","Không có đô thị","Khí hậu cực lạnh"],"answer":0,"explanation":"Bờ biển dài, cảnh quan và di sản tạo lợi thế lớn cho du lịch."},
      {"topic":"Khoáng sản","q":"Quảng Ninh nổi tiếng với loại khoáng sản nào?","choices":["Than đá","Bauxite","Apatit","Dầu khí"],"answer":0,"explanation":"Quảng Ninh là trung tâm khai thác than lớn của Việt Nam."},
      {"topic":"Đồng bằng","q":"Đất phù sa ở các đồng bằng thuận lợi nhất cho hoạt động nào?","choices":["Trồng cây lương thực","Trồng rừng ngập mặn trên núi","Khai thác dầu khí","Làm thủy điện"],"answer":0,"explanation":"Đất phù sa màu mỡ thích hợp với cây lương thực và nhiều loại cây trồng."},
    ],
    "Tiếng Anh": [
      {"topic":"Grammar","q":"Neither Tom nor his friends ___ ready.","choices":["are","is","was","be"],"answer":0,"explanation":"With neither...nor, the verb commonly agrees with the nearer plural subject here: friends are."},
      {"topic":"Grammar","q":"She asked me where I ___.","choices":["lived","live","am live","have live"],"answer":0,"explanation":"In reported speech, the past reporting verb backshifts live to lived."},
      {"topic":"Grammar","q":"This is the restaurant ___ we met last year.","choices":["where","who","whose","what"],"answer":0,"explanation":"Where refers to a place."},
      {"topic":"Grammar","q":"She ___ already finished her homework.","choices":["has","have","is","was"],"answer":0,"explanation":"With she and already in the present perfect, use has + past participle."},
      {"topic":"Grammar","q":"He is interested in ___ science.","choices":["studying","study","to studying","studied"],"answer":0,"explanation":"Be interested in is followed by a gerund."},
    ],
    "GDCD": [
      {"topic":"Môi trường","q":"Hành vi nào góp phần bảo vệ môi trường?","choices":["Phân loại và giảm rác thải","Đổ hóa chất xuống sông","Đốt rác nhựa tùy tiện","Khai thác tài nguyên không kiểm soát"],"answer":0,"explanation":"Giảm và phân loại rác thải góp phần bảo vệ môi trường."},
      {"topic":"Mạng xã hội","q":"Trước khi chia sẻ tin nóng chưa kiểm chứng, nên làm gì?","choices":["Kiểm tra nguồn và độ tin cậy","Chia sẻ ngay","Đổi tiêu đề cho giật gân","Đăng kèm thông tin cá nhân người khác"],"answer":0,"explanation":"Kiểm chứng nguồn giúp hạn chế lan truyền thông tin sai lệch."},
      {"topic":"Quyền học tập","q":"Quyền học tập của công dân gắn với trách nhiệm nào?","choices":["Tôn trọng nội quy và tích cực học tập","Được bỏ mọi quy định","Không cần tôn trọng người khác","Không cần tham gia học tập"],"answer":0,"explanation":"Quyền luôn đi cùng trách nhiệm thực hiện nghĩa vụ liên quan."},
      {"topic":"An toàn","q":"Khi phát hiện cháy ở nơi công cộng, hành động phù hợp đầu tiên là gì?","choices":["Báo động và tìm đường thoát an toàn","Quay video trước","Che giấu thông tin","Chạy ngược vào khu vực cháy"],"answer":0,"explanation":"Cần báo động và ưu tiên thoát hiểm, đồng thời gọi lực lượng cứu hộ."},
      {"topic":"Quyền sở hữu","q":"Quyền sở hữu tài sản thường bao gồm những quyền nào?","choices":["Chiếm hữu, sử dụng, định đoạt","Chỉ sử dụng","Chỉ cất giữ","Chỉ cho thuê"],"answer":0,"explanation":"Quyền sở hữu thường gồm chiếm hữu, sử dụng và định đoạt."},
    ],
  },
  final2: {
    "Ngữ văn": [
      {"topic":"Chữ người tử tù","q":"Huấn Cao nổi bật với phẩm chất nào?","choices":["Tài hoa, khí phách và thiên lương","Giỏi buôn bán","Ham danh lợi","Sống an phận"],"answer":0,"explanation":"Huấn Cao là hình tượng tài hoa, có khí phách và thiên lương trong sáng."},
      {"topic":"Chữ người tử tù","q":"Cảnh cho chữ diễn ra ở đâu?","choices":["Trong buồng giam tăm tối","Ngoài sân đình","Trong phủ quan","Bên bờ sông"],"answer":0,"explanation":"Cảnh cho chữ diễn ra trong không gian buồng giam tăm tối, đối lập với ánh sáng của cái đẹp."},
      {"topic":"Người lái đò sông Đà","q":"Ông lái đò được Nguyễn Tuân khắc họa chủ yếu như thế nào?","choices":["Người lao động tài hoa, dũng cảm","Một viên quan triều đình","Một nhà thơ","Một thương nhân"],"answer":0,"explanation":"Ông lái đò là hình tượng người lao động có trí nhớ, kinh nghiệm và bản lĩnh tài hoa."},
      {"topic":"Chiếc thuyền ngoài xa","q":"Phát hiện đầu tiên của nghệ sĩ Phùng trước cảnh biển là gì?","choices":["Một cảnh đẹp như bức tranh mực tàu","Một trận bão lớn","Một vụ cháy thuyền","Một lễ hội trên biển"],"answer":0,"explanation":"Phùng bắt gặp một cảnh biển rất đẹp qua màn sương."},
      {"topic":"Chiếc thuyền ngoài xa","q":"Phát hiện thứ hai của Phùng làm thay đổi nhận thức của anh là gì?","choices":["Cảnh bạo lực gia đình phía sau vẻ đẹp","Một con thuyền bị chìm","Một cuộc đua thuyền","Một bức ảnh bị hỏng"],"answer":0,"explanation":"Phía sau cảnh đẹp là cảnh đời đầy nghịch lí và bạo lực gia đình."},
    ],
    "Vật lý": [
      {"topic":"Khúc xạ","q":"Khi tia sáng truyền từ không khí vào nước, tia khúc xạ thường lệch về phía nào?","choices":["Gần pháp tuyến hơn","Xa pháp tuyến hơn","Song song mặt nước","Luôn quay ngược lại"],"answer":0,"explanation":"Từ môi trường chiết quang kém sang mạnh, tia khúc xạ lệch gần pháp tuyến."},
      {"topic":"Thấu kính","q":"Đơn vị SI của tiêu cự thấu kính là gì?","choices":["mét (m)","điện kế (V)","newton (N)","hertz (Hz)"],"answer":0,"explanation":"Tiêu cự là độ dài nên trong SI có đơn vị mét."},
      {"topic":"Điện từ","q":"Nam châm điện hoạt động dựa trên tác dụng nào của dòng điện?","choices":["Tác dụng từ","Tác dụng nhiệt","Tác dụng hóa học","Tác dụng phát sáng"],"answer":0,"explanation":"Dòng điện chạy qua cuộn dây tạo ra từ trường."},
      {"topic":"Công suất","q":"Một thiết bị công suất 100 W hoạt động trong 10 s tiêu thụ năng lượng bao nhiêu?","choices":["1000 J","100 J","10 J","10000 J"],"answer":0,"explanation":"A = Pt = 100 × 10 = 1000 J."},
      {"topic":"Chuyển động","q":"Gia tốc được xác định bằng đại lượng nào?","choices":["Độ biến thiên vận tốc chia thời gian","Quãng đường chia khối lượng","Lực chia quãng đường","Khối lượng chia vận tốc"],"answer":0,"explanation":"Gia tốc là độ biến thiên vận tốc trong một đơn vị thời gian."},
    ],
    "Hóa học": [
      {"topic":"Muối","q":"Na2CO3 có tên thông dụng là gì?","choices":["Sodium carbonate","Sodium chloride","Calcium carbonate","Potassium nitrate"],"answer":0,"explanation":"Na2CO3 là sodium carbonate, còn gọi là soda ash."},
      {"topic":"pH","q":"Dung dịch trung tính ở 25°C có pH gần bằng bao nhiêu?","choices":["7","1","5","14"],"answer":0,"explanation":"Ở 25°C, môi trường trung tính có pH xấp xỉ 7."},
      {"topic":"Dung dịch","q":"Thêm nước vào dung dịch muối, nồng độ chất tan thường thay đổi như thế nào?","choices":["Giảm","Tăng","Không đổi mọi trường hợp","Bằng 0 ngay"],"answer":0,"explanation":"Thêm dung môi làm thể tích tăng nên nồng độ giảm nếu lượng chất tan không đổi."},
      {"topic":"Kim loại","q":"Kim loại nào sau đây thuộc nhóm kim loại kiềm?","choices":["Kali","Sắt","Đồng","Kẽm"],"answer":0,"explanation":"Kali thuộc nhóm kim loại kiềm."},
      {"topic":"Ăn mòn","q":"Sơn phủ bề mặt kim loại giúp hạn chế ăn mòn bằng cách nào?","choices":["Cách li kim loại khỏi môi trường","Tăng tốc phản ứng oxi hóa","Tạo thêm nước","Tăng độ dẫn điện"],"answer":0,"explanation":"Lớp sơn ngăn kim loại tiếp xúc với nước và oxygen."},
    ],
    "Sinh học": [
      {"topic":"Miễn dịch","q":"Vaccine có tác dụng chính gì?","choices":["Kích thích cơ thể hình thành đáp ứng miễn dịch","Tiêu diệt mọi vi khuẩn ngay lập tức","Thay máu","Giảm nhiệt độ cơ thể"],"answer":0,"explanation":"Vaccine giúp cơ thể tạo trí nhớ miễn dịch và đáp ứng tốt hơn khi gặp tác nhân gây bệnh."},
      {"topic":"Quang hợp","q":"Quang hợp ở cây xanh sử dụng nguồn năng lượng nào?","choices":["Ánh sáng","Âm thanh","Điện lưới","Nhiệt từ đất"],"answer":0,"explanation":"Quang hợp sử dụng năng lượng ánh sáng."},
      {"topic":"Hô hấp","q":"Sản phẩm cuối của hô hấp hiếu khí hoàn toàn ở tế bào thường gồm gì?","choices":["CO2, H2O và năng lượng","O2 và glucose","N2 và nước","Protein và DNA"],"answer":0,"explanation":"Hô hấp hiếu khí hoàn toàn giải phóng năng lượng và tạo CO2, H2O."},
      {"topic":"Hormone","q":"Insulin có tác dụng chính nào?","choices":["Giúp hạ đường huyết","Tăng mạnh nhịp tim","Làm đông máu trực tiếp","Tăng nhiệt độ môi trường"],"answer":0,"explanation":"Insulin giúp tế bào sử dụng glucose và làm giảm nồng độ đường huyết."},
      {"topic":"Thần kinh","q":"Neuron là đơn vị cấu trúc và chức năng cơ bản của hệ nào?","choices":["Hệ thần kinh","Hệ tiêu hóa","Hệ bài tiết","Hệ vận động"],"answer":0,"explanation":"Neuron là tế bào thần kinh cơ bản."},
    ],
    "Lịch sử": [
      {"topic":"1946","q":"Tổng tuyển cử đầu tiên của nước Việt Nam Dân chủ Cộng hòa diễn ra vào năm nào?","choices":["1946","1945","1947","1954"],"answer":0,"explanation":"Tổng tuyển cử bầu Quốc hội đầu tiên diễn ra ngày 6/1/1946."},
      {"topic":"Kháng chiến","q":"Lời kêu gọi Toàn quốc kháng chiến được ra vào ngày nào?","choices":["19/12/1946","2/9/1945","7/5/1954","30/4/1975"],"answer":0,"explanation":"Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến ngày 19/12/1946."},
      {"topic":"Biên giới","q":"Chiến dịch Biên giới Thu - Đông diễn ra vào năm nào?","choices":["1950","1947","1954","1960"],"answer":0,"explanation":"Chiến dịch Biên giới Thu - Đông diễn ra năm 1950."},
      {"topic":"Việt Bắc","q":"Cuộc tiến công lên Việt Bắc của Pháp năm 1947 nhằm mục tiêu chủ yếu gì?","choices":["Nhanh chóng tiêu diệt cơ quan đầu não kháng chiến","Mở rộng kinh tế","Tổ chức bầu cử","Ký hiệp định thương mại"],"answer":0,"explanation":"Pháp muốn đánh vào căn cứ địa Việt Bắc và cơ quan đầu não kháng chiến."},
      {"topic":"Phong trào Đồng khởi","q":"Bến Tre là địa phương tiêu biểu của phong trào nào?","choices":["Đồng khởi","Xô viết Nghệ - Tĩnh","Tây Sơn","Cần Vương"],"answer":0,"explanation":"Bến Tre là điểm nổi bật của phong trào Đồng khởi."},
    ],
    "Địa lý": [
      {"topic":"Lâm nghiệp","q":"Rừng ngập mặn có vai trò quan trọng nào?","choices":["Chắn sóng và bảo vệ bờ biển","Tăng xói mòn bờ biển","Làm nước biển ngọt hoàn toàn","Tăng sa mạc hóa"],"answer":0,"explanation":"Rừng ngập mặn giúp chắn sóng, chống xói lở và bảo vệ hệ sinh thái ven biển."},
      {"topic":"Biến đổi khí hậu","q":"Mực nước biển dâng đe dọa mạnh vùng nào của Việt Nam?","choices":["Các đồng bằng ven biển thấp","Chỉ vùng núi cao","Chỉ Tây Nguyên","Chỉ Đông Bắc"],"answer":0,"explanation":"Các đồng bằng ven biển thấp dễ chịu tác động của nước biển dâng."},
      {"topic":"Kinh tế","q":"Ngành nào thuộc khu vực dịch vụ?","choices":["Du lịch","Trồng lúa","Khai thác than","Trồng cà phê"],"answer":0,"explanation":"Du lịch là ngành dịch vụ."},
      {"topic":"Thủy sản","q":"Vùng biển nào có ngư trường trọng điểm phía Nam?","choices":["Kiên Giang - Cà Mau","Quảng Ninh - Hải Phòng","Thanh Hóa - Nghệ An","Đà Nẵng - Quảng Nam"],"answer":0,"explanation":"Kiên Giang - Cà Mau là một ngư trường quan trọng ở phía Nam."},
      {"topic":"Cảng biển","q":"Cảng Hải Phòng có vai trò quan trọng nhất ở khu vực nào?","choices":["Phía Bắc","Tây Nguyên","Tây Nam Bộ","Nam Trung Bộ"],"answer":0,"explanation":"Hải Phòng là cửa ngõ giao thương đường biển quan trọng của miền Bắc."},
    ],
    "Tiếng Anh": [
      {"topic":"Reading","q":"If a notice says 'No entry', what does it mean?","choices":["You must not enter.","You should enter quickly.","Entry is free.","Only students may enter."],"answer":0,"explanation":"No entry means people are not allowed to enter."},
      {"topic":"Communication","q":"A: 'Would you like some tea?' B: '___'","choices":["Yes, please.","Yes, I do yesterday.","No, I am tea.","Tea can."],"answer":0,"explanation":"Yes, please is a natural response to an offer."},
      {"topic":"Communication","q":"A: 'Thank you for your help.' B: '___'","choices":["You're welcome.","Never mind, yesterday.","I don't help.","Yes, I thank."],"answer":0,"explanation":"You're welcome is a polite response to thanks."},
      {"topic":"Vocabulary","q":"A 'deadline' is ___.","choices":["the latest time something must be finished","a holiday","a meeting room","a type of document"],"answer":0,"explanation":"A deadline is the final time by which a task must be completed."},
      {"topic":"Vocabulary","q":"If a plan is 'flexible', it can be ___.","choices":["changed when necessary","completed only once","broken easily","hidden from everyone"],"answer":0,"explanation":"Flexible plans can be adjusted when needed."},
    ],
    "GDCD": [
      {"topic":"Phòng chống tệ nạn","q":"Biện pháp nào giúp phòng tránh tệ nạn xã hội ở học sinh?","choices":["Xây dựng lối sống lành mạnh và biết nói không với hành vi nguy hiểm","Thử mọi thứ cho biết","Giấu vấn đề với người lớn","Bỏ học"],"answer":0,"explanation":"Lối sống lành mạnh và kỹ năng từ chối giúp giảm nguy cơ."},
      {"topic":"Lao động","q":"Người lao động cần tôn trọng điều gì tại nơi làm việc?","choices":["Nội quy và thỏa thuận hợp pháp","Tin đồn","Tài khoản cá nhân của người khác","Mọi mệnh lệnh bất kể pháp luật"],"answer":0,"explanation":"Người lao động và người sử dụng lao động đều cần tuân thủ thỏa thuận hợp pháp và pháp luật."},
      {"topic":"Văn hóa","q":"Giữ gìn di sản văn hóa thể hiện điều gì?","choices":["Trách nhiệm với cộng đồng và lịch sử","Thái độ thờ ơ","Phá bỏ truyền thống","Chỉ quan tâm lợi ích cá nhân"],"answer":0,"explanation":"Bảo vệ di sản là trách nhiệm chung đối với giá trị văn hóa và lịch sử."},
      {"topic":"Quyền trẻ em","q":"Trẻ em cần được bảo vệ khỏi hành vi nào?","choices":["Bạo lực và bóc lột","Giáo dục","Chăm sóc","Khuyến khích học tập"],"answer":0,"explanation":"Trẻ em cần được bảo vệ khỏi bạo lực, bóc lột và xâm hại."},
      {"topic":"Ứng xử","q":"Khi xảy ra mâu thuẫn với bạn, cách ứng xử phù hợp là gì?","choices":["Trao đổi bình tĩnh và tôn trọng","Đăng bài xúc phạm","Đe dọa","Lan truyền tin riêng tư"],"answer":0,"explanation":"Trao đổi bình tĩnh và tôn trọng giúp giải quyết xung đột lành mạnh."},
    ],
  },
  thpt: {
    "Ngữ văn": [
      {"topic":"Ai đã đặt tên cho dòng sông?","q":"Dòng sông trung tâm trong bút ký Ai đã đặt tên cho dòng sông? là sông nào?","choices":["Sông Hương","Sông Hàn","Sông Cửu Long","Sông Đà"],"answer":0,"explanation":"Tác phẩm viết về vẻ đẹp và văn hóa của sông Hương ở Huế."},
      {"topic":"Rừng xà nu","q":"Hình tượng rừng xà nu trong tác phẩm thường được hiểu là biểu tượng cho điều gì?","choices":["Sức sống và sự tiếp nối của cộng đồng","Sự cô độc","Đời sống đô thị","Sự giàu có vật chất"],"answer":0,"explanation":"Rừng xà nu biểu tượng cho sức sống bền bỉ và sự tiếp nối của các thế hệ."},
      {"topic":"Tuyên ngôn Độc lập","q":"Tuyên ngôn Độc lập năm 1945 thuộc kiểu văn bản nào?","choices":["Văn bản chính luận","Truyện ngắn","Bút ký du lịch","Kịch"],"answer":0,"explanation":"Tuyên ngôn Độc lập là một văn bản chính luận có sức lập luận mạnh."},
      {"topic":"Đoàn thuyền đánh cá","q":"Không khí lao động trong Đoàn thuyền đánh cá được khắc họa như thế nào?","choices":["Hào hứng, khỏe khoắn và lãng mạn","Buồn bã và tuyệt vọng","Im lặng tuyệt đối","Lạnh lẽo và bi quan"],"answer":0,"explanation":"Bài thơ thể hiện niềm vui lao động và cảm hứng lãng mạn."},
      {"topic":"Mặt đường khát vọng","q":"Đoạn trích Đất Nước nhấn mạnh đất nước gần gũi với đời sống nào?","choices":["Đời sống nhân dân và văn hóa dân gian","Chỉ đời sống cung đình","Chỉ đời sống đô thị","Chỉ đời sống quân đội"],"answer":0,"explanation":"Nguyễn Khoa Điềm nhìn đất nước từ văn hóa, đời sống nhân dân và lịch sử cộng đồng."},
    ],
    "Vật lý": [
      {"topic":"Cân bằng","q":"Một vật đứng yên cân bằng khi hợp lực tác dụng lên vật bằng bao nhiêu?","choices":["0","1 N","Khối lượng vật","Trọng lực của vật"],"answer":0,"explanation":"Điều kiện cân bằng tịnh tiến là hợp lực bằng 0."},
      {"topic":"Khí","q":"Khi nhiệt độ của một lượng khí tăng trong điều kiện thể tích không đổi, áp suất có xu hướng thế nào?","choices":["Tăng","Giảm","Không đổi","Bằng 0"],"answer":0,"explanation":"Ở thể tích không đổi, áp suất của khí tăng khi nhiệt độ tăng."},
      {"topic":"Dao động","q":"Trong dao động điều hòa, vận tốc của vật bằng 0 tại vị trí nào?","choices":["Biên","Cân bằng","Mọi vị trí","Chỉ khi t = 0"],"answer":0,"explanation":"Vật dừng tức thời tại hai vị trí biên."},
      {"topic":"Sóng cơ","q":"Sóng cơ cần môi trường nào để truyền?","choices":["Môi trường vật chất","Chân không","Chỉ kim loại","Chỉ nước"],"answer":0,"explanation":"Sóng cơ là sự lan truyền dao động trong một môi trường vật chất."},
      {"topic":"An toàn điện","q":"Khi dây điện bị hở, nguy cơ lớn nhất là gì?","choices":["Điện giật","Tăng độ ngọt thức ăn","Giảm trọng lượng vật","Tăng nhiệt độ phòng"],"answer":0,"explanation":"Dây điện hở có thể gây điện giật và chập mạch."},
    ],
    "Hóa học": [
      {"topic":"Phân bón","q":"Đạm urê cung cấp chủ yếu nguyên tố dinh dưỡng nào cho cây?","choices":["Nitrogen","Phosphorus","Potassium","Calcium"],"answer":0,"explanation":"Urê là phân đạm, cung cấp chủ yếu nitrogen."},
      {"topic":"Phản ứng","q":"Chất làm tăng tốc độ phản ứng mà sau phản ứng gần như không đổi là gì?","choices":["Chất xúc tác","Chất phản ứng","Dung môi bắt buộc","Sản phẩm"],"answer":0,"explanation":"Chất xúc tác làm thay đổi tốc độ phản ứng và không bị tiêu hao theo phương trình tổng quát."},
      {"topic":"Hữu cơ","q":"Chất hữu cơ nào là hydrocarbon?","choices":["C2H6","C2H5OH","CH3COOH","NH2CH2COOH"],"answer":0,"explanation":"Hydrocarbon chỉ chứa carbon và hydrogen; C2H6 đáp ứng điều đó."},
      {"topic":"Bảo quản","q":"Bảo quản thực phẩm trong tủ lạnh chủ yếu làm chậm quá trình nào?","choices":["Các phản ứng và hoạt động của vi sinh vật","Sự tạo ra oxygen","Sự tăng khối lượng","Sự phân rã nguyên tử"],"answer":0,"explanation":"Nhiệt độ thấp làm chậm nhiều phản ứng hóa học và hoạt động của vi sinh vật."},
      {"topic":"Hóa hữu cơ","q":"Ethanol còn được gọi thông dụng là gì?","choices":["Rượu etylic","Giấm ăn","Axit fomic","Đường mía"],"answer":0,"explanation":"Ethanol có tên thông dụng là rượu etylic."},
    ],
    "Sinh học": [
      {"topic":"Sinh thái","q":"Quần thể là tập hợp cá thể của cùng loài sống trong đâu?","choices":["Một khu vực nhất định vào một thời điểm nhất định","Mọi nơi trên Trái Đất","Chỉ trong phòng thí nghiệm","Chỉ trong nước"],"answer":0,"explanation":"Quần thể gồm các cá thể cùng loài sống trong một không gian và thời gian xác định."},
      {"topic":"Sinh thái","q":"Bậc dinh dưỡng đầu tiên trong chuỗi thức ăn thường là gì?","choices":["Sinh vật sản xuất","Sinh vật tiêu thụ bậc 1","Động vật ăn thịt","Sinh vật phân giải"],"answer":0,"explanation":"Sinh vật sản xuất là bậc dinh dưỡng đầu tiên."},
      {"topic":"Tiến hóa","q":"Chọn lọc tự nhiên tác động trực tiếp lên đặc điểm nào?","choices":["Kiểu hình và khả năng sống sót, sinh sản","Chỉ DNA trong phòng thí nghiệm","Chỉ tuổi đời","Chỉ số lượng tế bào"],"answer":0,"explanation":"Chọn lọc tự nhiên tác động thông qua khác biệt về kiểu hình, sống sót và sinh sản."},
      {"topic":"Trao đổi chất","q":"Enzyme trong tế bào có vai trò chủ yếu gì?","choices":["Xúc tác các phản ứng sinh hóa","Lưu trữ thông tin di truyền","Tạo bộ nhiễm sắc thể","Thay thế nước"],"answer":0,"explanation":"Enzyme là chất xúc tác sinh học, thường là protein."},
      {"topic":"Sinh thái","q":"Yếu tố nào sau đây là yếu tố vô sinh?","choices":["Ánh sáng","Vi khuẩn","Cây cỏ","Động vật"],"answer":0,"explanation":"Ánh sáng là nhân tố vô sinh của môi trường."},
    ],
    "Lịch sử": [
      {"topic":"Tổ chức quốc tế","q":"Hội nghị Ianta năm 1945 diễn ra giữa nguyên thủ của những cường quốc nào?","choices":["Mỹ, Anh, Liên Xô","Mỹ, Pháp, Đức","Anh, Nhật, Trung Quốc","Liên Xô, Nhật, Ý"],"answer":0,"explanation":"Hội nghị Ianta có sự tham dự của Roosevelt, Churchill và Stalin."},
      {"topic":"Thế giới","q":"Mốc nào thường được xem là sự khởi đầu của Chiến tranh Lạnh?","choices":["1947","1939","1954","1975"],"answer":0,"explanation":"Năm 1947 thường được dùng làm mốc mở đầu Chiến tranh Lạnh."},
      {"topic":"Châu Âu","q":"Kế hoạch Marshall của Mỹ sau Chiến tranh thế giới thứ hai nhằm mục tiêu chủ yếu gì?","choices":["Phục hồi kinh tế Tây Âu và tăng ảnh hưởng của Mỹ","Khôi phục Nhật Bản","Chấm dứt ASEAN","Thành lập Liên Hợp Quốc"],"answer":0,"explanation":"Kế hoạch Marshall hỗ trợ phục hồi kinh tế Tây Âu và củng cố ảnh hưởng của Mỹ."},
      {"topic":"Hội nhập","q":"Việt Nam chính thức gia nhập WTO vào năm nào?","choices":["2007","1995","1986","2015"],"answer":0,"explanation":"Việt Nam trở thành thành viên WTO năm 2007."},
      {"topic":"Hội nhập","q":"Việt Nam trở thành thành viên của APEC vào năm nào?","choices":["1998","1995","2007","1986"],"answer":0,"explanation":"Việt Nam gia nhập Diễn đàn Hợp tác Kinh tế châu Á - Thái Bình Dương (APEC) năm 1998."},
    ],
    "Địa lý": [
      {"topic":"Tài nguyên","q":"Khoáng sản nào tập trung đáng kể ở Tây Nguyên?","choices":["Bauxite","Than đá","Dầu khí biển","Apatit Lào Cai"],"answer":0,"explanation":"Tây Nguyên có trữ lượng bauxite lớn."},
      {"topic":"Năng lượng","q":"Thủy điện phát triển mạnh ở vùng nào nhờ hệ thống sông có độ dốc lớn?","choices":["Trung du và miền núi Bắc Bộ","Đồng bằng sông Hồng","Đồng bằng sông Cửu Long","Ven biển Nam Bộ"],"answer":0,"explanation":"Trung du và miền núi Bắc Bộ có địa hình dốc và sông nhiều tiềm năng thủy điện."},
      {"topic":"Xuất khẩu","q":"Sản phẩm nào là mặt hàng xuất khẩu nông nghiệp nổi bật của Việt Nam?","choices":["Cà phê","Dầu thô của tất cả các vùng","Than đá duy nhất","Muối biển duy nhất"],"answer":0,"explanation":"Cà phê là một trong các mặt hàng nông sản xuất khẩu quan trọng của Việt Nam."},
      {"topic":"Dịch vụ","q":"Trung tâm dịch vụ lớn nhất cả nước là nơi nào?","choices":["Hà Nội và Thành phố Hồ Chí Minh","Điện Biên và Lai Châu","Cao Bằng và Bắc Kạn","Kon Tum và Gia Lai"],"answer":0,"explanation":"Hà Nội và Thành phố Hồ Chí Minh là hai trung tâm dịch vụ lớn nhất."},
      {"topic":"Phân bố dân cư","q":"Dân cư nước ta tập trung đông nhất ở khu vực nào?","choices":["Đồng bằng và đô thị","Núi cao","Các đảo nhỏ","Rừng đặc dụng"],"answer":0,"explanation":"Đồng bằng và đô thị có mật độ dân cư cao hơn miền núi."},
    ],
    "Tiếng Anh": [
      {"topic":"Grammar","q":"I have known Lan ___ five years.","choices":["for","since","from","during"],"answer":0,"explanation":"For is used with a duration such as five years."},
      {"topic":"Grammar","q":"He ___ to school when it started raining.","choices":["was walking","walks","has walked","will walk"],"answer":0,"explanation":"Past continuous describes an action in progress when another past event occurred."},
      {"topic":"Vocabulary","q":"'Environment' refers to ___.","choices":["the natural world around us","a person's salary","a school subject only","a type of machine"],"answer":0,"explanation":"Environment means the natural and surrounding conditions in which we live."},
      {"topic":"Grammar","q":"The students are studying hard ___ they want to pass the exam.","choices":["because","although","unless","while"],"answer":0,"explanation":"Because introduces the reason."},
      {"topic":"Vocabulary","q":"To 'encourage' someone means to ___.","choices":["give support or confidence","make them afraid","ignore them","punish them"],"answer":0,"explanation":"Encourage means give someone support or confidence."},
    ],
    "GDCD": [
      {"topic":"Dân chủ","q":"Dân chủ trong trường học có thể thể hiện qua việc nào?","choices":["Tham gia góp ý và bầu chọn theo quy định","Ép buộc người khác","Không cho ai phát biểu","Phá nội quy"],"answer":0,"explanation":"Tham gia góp ý và bầu chọn theo quy định là biểu hiện của dân chủ."},
      {"topic":"Kinh tế","q":"Tiết kiệm trong chi tiêu cá nhân giúp đạt mục tiêu nào?","choices":["Sử dụng nguồn lực hợp lý và dự phòng cho tương lai","Luôn mua hàng đắt nhất","Không cần lập kế hoạch","Tăng chi tiêu vô hạn"],"answer":0,"explanation":"Tiết kiệm giúp sử dụng nguồn lực hợp lý và tạo khoản dự phòng."},
      {"topic":"Pháp luật","q":"Chế tài pháp luật được đặt ra nhằm mục đích nào?","choices":["Bảo đảm và xử lý việc tuân thủ pháp luật","Khuyến khích vi phạm","Xóa bỏ quyền con người","Thay thế đạo đức hoàn toàn"],"answer":0,"explanation":"Chế tài góp phần bảo đảm việc tuân thủ pháp luật và xử lý hành vi vi phạm."},
      {"topic":"Tự do","q":"Quyền tự do ngôn luận không có nghĩa là gì?","choices":["Muốn nói gì cũng được mà không chịu trách nhiệm","Được trình bày ý kiến theo pháp luật","Được góp ý xây dựng","Được trao đổi quan điểm"],"answer":0,"explanation":"Tự do ngôn luận được thực hiện trong khuôn khổ pháp luật và đi kèm trách nhiệm."},
      {"topic":"Trách nhiệm số","q":"Bảo vệ tài khoản trực tuyến nên ưu tiên việc gì?","choices":["Dùng mật khẩu mạnh và bảo vệ mã xác thực","Chia sẻ mật khẩu với mọi người","Dùng một mật khẩu cho mọi nơi","Công khai mã OTP"],"answer":0,"explanation":"Mật khẩu mạnh và bảo vệ mã xác thực là nguyên tắc an toàn cơ bản."},
    ],
  },
};

const getExamQuestions = (exam) => {
  if(!exam) return [];
  const rows = [];
  EXAM_SUBJECTS.forEach(subject=>{
    (EXAM_BANKS[exam.id]?.[subject] || []).forEach((q,i)=>{
      const id = `${exam.id}-${keysBySubject[subject]}-${String(i+1).padStart(2,"0")}`;
      const varied = varyQuestionChoices(
        q.choices,
        q.answer,
        i + exam.id.length + subject.length
      );
      rows.push({
        ...q,
        subject,
        id,
        choices:varied.choices,
        answer:varied.answer
      });
    });
  });
  return rows;
};

const keysBySubject = {
  "Ngữ văn":"van",
  "Vật lý":"ly",
  "Hóa học":"hoa",
  "Sinh học":"sinh",
  "Lịch sử":"su",
  "Địa lý":"dia",
  "Tiếng Anh":"anh",
  "GDCD":"gdcd",
};

/* =========================================================
   THỜI TRANG
========================================================= */

const FASHION = [
  /* ÁO */
  { id:"shirt_white", category:"Áo", name:"Áo sơ mi trắng", icon:"👔", price:0, desc:"Đồng phục quốc dân", bonus:{reputation:2} },
  { id:"shirt_blue", category:"Áo", name:"Sơ mi xanh biển", icon:"👔", price:25000, desc:"Gọn gàng, trẻ trung", bonus:{mood:2} },
  { id:"shirt_black", category:"Áo", name:"Sơ mi đen basic", icon:"🖤", price:35000, desc:"Tối giản", bonus:{reputation:2} },
  { id:"shirt_pink", category:"Áo", name:"Sơ mi hồng pastel", icon:"🌸", price:45000, desc:"Nhẹ nhàng", bonus:{mood:4} },
  { id:"shirt_green", category:"Áo", name:"Sơ mi xanh mint", icon:"🍃", price:45000, desc:"Fresh", bonus:{mood:4} },
  { id:"tee_white", category:"Áo", name:"T-shirt trắng", icon:"👕", price:20000, desc:"Đơn giản", bonus:{friends:2} },
  { id:"tee_black", category:"Áo", name:"T-shirt đen", icon:"🖤", price:25000, desc:"Cool", bonus:{mood:3} },
  { id:"tee_red", category:"Áo", name:"T-shirt đỏ", icon:"❤️", price:30000, desc:"Nổi bật", bonus:{reputation:3} },
  { id:"tee_yellow", category:"Áo", name:"T-shirt vàng", icon:"💛", price:30000, desc:"Năng lượng", bonus:{mood:5} },
  { id:"tee_cloud", category:"Áo", name:"T-shirt mây xanh", icon:"☁️", price:40000, desc:"Cute", bonus:{mood:5} },
  { id:"hoodie_gray", category:"Áo", name:"Hoodie xám", icon:"🧥", price:70000, desc:"Ấm áp", bonus:{mood:5} },
  { id:"hoodie_black", category:"Áo", name:"Hoodie đen", icon:"🧥", price:80000, desc:"Street style", bonus:{reputation:5} },
  { id:"hoodie_pink", category:"Áo", name:"Hoodie hồng", icon:"🩷", price:85000, desc:"Cute style", bonus:{love:5} },
  { id:"varsity_blue", category:"Áo", name:"Áo varsity xanh", icon:"🏫", price:120000, desc:"Phong cách học đường", bonus:{friends:6} },
  { id:"varsity_red", category:"Áo", name:"Áo varsity đỏ", icon:"🔥", price:130000, desc:"Nổi bật", bonus:{reputation:6} },
  { id:"jacket_denim", category:"Áo", name:"Áo khoác denim", icon:"🧥", price:150000, desc:"Denim classic", bonus:{reputation:5} },
  { id:"jacket_leather", category:"Áo", name:"Áo khoác da", icon:"🧥", price:220000, desc:"Cool ngầu", bonus:{reputation:8} },
  { id:"cardigan_cream", category:"Áo", name:"Cardigan kem", icon:"🤍", price:95000, desc:"Vintage", bonus:{love:5} },
  { id:"sweater_bear", category:"Áo", name:"Sweater gấu", icon:"🐻", price:90000, desc:"Dễ thương", bonus:{mood:7} },
  { id:"jersey", category:"Áo", name:"Áo bóng đá", icon:"⚽", price:65000, desc:"Thể thao", bonus:{friends:5, skill:2} },

  /* QUẦN */
  { id:"pants_black", category:"Quần", name:"Quần tây đen", icon:"👖", price:0, desc:"Đồng phục", bonus:{reputation:2} },
  { id:"pants_blue", category:"Quần", name:"Quần jean xanh", icon:"👖", price:55000, desc:"Classic", bonus:{friends:2} },
  { id:"pants_black_jean", category:"Quần", name:"Jean đen", icon:"👖", price:65000, desc:"Cool", bonus:{reputation:3} },
  { id:"pants_white", category:"Quần", name:"Jean trắng", icon:"👖", price:75000, desc:"Sạch sẽ", bonus:{mood:3} },
  { id:"pants_cargo", category:"Quần", name:"Quần cargo", icon:"👖", price:90000, desc:"Street", bonus:{skill:2} },
  { id:"pants_kaki", category:"Quần", name:"Kaki be", icon:"👖", price:65000, desc:"Smart casual", bonus:{reputation:3} },
  { id:"pants_gray", category:"Quần", name:"Quần jogger xám", icon:"👖", price:70000, desc:"Thoải mái", bonus:{energy:2} },
  { id:"pants_green", category:"Quần", name:"Cargo xanh rêu", icon:"🟢", price:95000, desc:"Outdoor", bonus:{skill:3} },
  { id:"short_black", category:"Quần", name:"Short đen", icon:"🩳", price:40000, desc:"Năng động", bonus:{energy:3} },
  { id:"short_beige", category:"Quần", name:"Short be", icon:"🩳", price:45000, desc:"Mùa hè", bonus:{mood:3} },
  { id:"skirt_black", category:"Quần", name:"Chân váy đen", icon:"🖤", price:55000, desc:"Thanh lịch", bonus:{reputation:3} },
  { id:"skirt_plaid", category:"Quần", name:"Chân váy caro", icon:"🩷", price:70000, desc:"Học đường", bonus:{love:4} },
  { id:"skirt_white", category:"Quần", name:"Chân váy trắng", icon:"🤍", price:75000, desc:"Nữ tính", bonus:{mood:4} },
  { id:"wide_pants", category:"Quần", name:"Quần ống rộng", icon:"👖", price:85000, desc:"Fashion", bonus:{reputation:4} },

  /* GIÀY */
  { id:"shoes_school", category:"Giày", name:"Giày học sinh", icon:"👟", price:0, desc:"Cơ bản", bonus:{reputation:1} },
  { id:"sneaker_white", category:"Giày", name:"Sneaker trắng", icon:"👟", price:85000, desc:"Clean", bonus:{mood:4} },
  { id:"sneaker_black", category:"Giày", name:"Sneaker đen", icon:"👟", price:90000, desc:"Basic", bonus:{reputation:3} },
  { id:"sneaker_red", category:"Giày", name:"Sneaker đỏ", icon:"👟", price:110000, desc:"Nổi bật", bonus:{reputation:5} },
  { id:"high_top", category:"Giày", name:"High-top", icon:"👟", price:130000, desc:"Street", bonus:{friends:5} },
  { id:"running", category:"Giày", name:"Giày chạy bộ", icon:"🏃", price:100000, desc:"Thể thao", bonus:{skill:3, energy:2} },
  { id:"loafer", category:"Giày", name:"Loafer", icon:"👞", price:120000, desc:"Thanh lịch", bonus:{reputation:6} },
  { id:"boots", category:"Giày", name:"Boot cổ ngắn", icon:"🥾", price:180000, desc:"Cool", bonus:{reputation:7} },
  { id:"canvas", category:"Giày", name:"Canvas xanh", icon:"👟", price:70000, desc:"Nhẹ nhàng", bonus:{friends:3} },
  { id:"pink_shoes", category:"Giày", name:"Sneaker hồng", icon:"🩷", price:105000, desc:"Cute", bonus:{love:5} },

  /* BALO */
  { id:"bag_school", category:"Balo", name:"Balo học sinh", icon:"🎒", price:0, desc:"Balo cơ bản", bonus:{study:2} },
  { id:"bag_black", category:"Balo", name:"Balo đen premium", icon:"🎒", price:80000, desc:"Gọn và xịn", bonus:{reputation:4} },
  { id:"bag_pink", category:"Balo", name:"Balo hồng", icon:"🎒", price:90000, desc:"Dễ thương", bonus:{love:5} },
  { id:"bag_blue", category:"Balo", name:"Balo xanh", icon:"🎒", price:85000, desc:"Năng động", bonus:{friends:4} },
  { id:"bag_canvas", category:"Balo", name:"Túi canvas", icon:"👜", price:65000, desc:"Vintage", bonus:{mood:4} },
  { id:"bag_luxury", category:"Balo", name:"Balo luxury", icon:"🎒", price:250000, desc:"Đẳng cấp", bonus:{reputation:10} },

  /* PHỤ KIỆN */
  { id:"cap_black", category:"Phụ kiện", name:"Mũ lưỡi trai đen", icon:"🧢", price:35000, desc:"Street", bonus:{reputation:2} },
  { id:"cap_blue", category:"Phụ kiện", name:"Mũ xanh", icon:"🧢", price:35000, desc:"Năng động", bonus:{friends:2} },
  { id:"cap_pink", category:"Phụ kiện", name:"Mũ hồng", icon:"🧢", price:45000, desc:"Cute", bonus:{love:3} },
  { id:"glasses", category:"Phụ kiện", name:"Kính tri thức", icon:"👓", price:60000, desc:"Học bá", bonus:{study:5} },
  { id:"sunglasses", category:"Phụ kiện", name:"Kính thời trang", icon:"🕶️", price:75000, desc:"Cool", bonus:{reputation:6} },
  { id:"watch", category:"Phụ kiện", name:"Đồng hồ bạc", icon:"⌚", price:150000, desc:"Chín chắn", bonus:{reputation:7} },
  { id:"smartwatch", category:"Phụ kiện", name:"Smartwatch", icon:"⌚", price:280000, desc:"Công nghệ", bonus:{skill:7} },
  { id:"necklace", category:"Phụ kiện", name:"Dây chuyền", icon:"📿", price:180000, desc:"Thanh lịch", bonus:{love:7} },
  { id:"bracelet", category:"Phụ kiện", name:"Vòng tay", icon:"📿", price:80000, desc:"Nhẹ nhàng", bonus:{love:4} },
  { id:"headphone", category:"Phụ kiện", name:"Tai nghe", icon:"🎧", price:180000, desc:"Music", bonus:{mood:7} },
  { id:"hairclip", category:"Phụ kiện", name:"Kẹp tóc hoa", icon:"🌸", price:45000, desc:"Xinh xắn", bonus:{love:4} },
  { id:"backpack_keychain", category:"Phụ kiện", name:"Móc khóa gấu", icon:"🧸", price:30000, desc:"Cute", bonus:{mood:3} },

  /* TÓC */
  { id:"hair_black", category:"Tóc", name:"Tóc đen tự nhiên", icon:"💇", price:0, desc:"Classic", bonus:{reputation:1} },
  { id:"hair_brown", category:"Tóc", name:"Tóc nâu", icon:"💇", price:60000, desc:"Ấm áp", bonus:{mood:4} },
  { id:"hair_short", category:"Tóc", name:"Tóc ngắn năng động", icon:"💇", price:70000, desc:"Năng động", bonus:{friends:4} },
  { id:"hair_long", category:"Tóc", name:"Tóc dài nữ tính", icon:"💇", price:70000, desc:"Dịu dàng", bonus:{love:4} },
  { id:"hair_wavy", category:"Tóc", name:"Tóc xoăn nhẹ", icon:"💇", price:100000, desc:"Fashion", bonus:{reputation:5} },
  { id:"hair_blue", category:"Tóc", name:"Tóc highlight xanh", icon:"💙", price:140000, desc:"Cá tính", bonus:{reputation:8} },
  { id:"hair_pink", category:"Tóc", name:"Tóc highlight hồng", icon:"🩷", price:150000, desc:"Cute", bonus:{love:8} },
];
const EXTRA_FASHION=[
{id:"shirt_lavender",category:"Áo",name:"Sơ mi lavender",icon:"💜",price:60000,desc:"Pastel",bonus:{mood:5,love:2}},{id:"hoodie_blue",category:"Áo",name:"Hoodie xanh trời",icon:"🩵",price:95000,desc:"Dịu mắt",bonus:{mood:6,energy:2}},{id:"tee_green",category:"Áo",name:"T-shirt xanh lá",icon:"💚",price:55000,desc:"Tươi mới",bonus:{friends:4}},{id:"varsity_pink",category:"Áo",name:"Varsity hồng",icon:"🎀",price:150000,desc:"Campus",bonus:{love:6,friends:4}},{id:"pants_brown",category:"Quần",name:"Quần nâu vintage",icon:"👖",price:80000,desc:"Vintage",bonus:{mood:4}},{id:"skirt_blue",category:"Quần",name:"Chân váy xanh",icon:"💙",price:85000,desc:"Fresh",bonus:{friends:4}},{id:"wide_black",category:"Quần",name:"Quần ống rộng đen",icon:"🖤",price:105000,desc:"Minimal",bonus:{reputation:5}},{id:"sneaker_green",category:"Giày",name:"Sneaker xanh mint",icon:"👟",price:125000,desc:"Fresh step",bonus:{mood:5,energy:2}},{id:"sneaker_purple",category:"Giày",name:"Sneaker tím",icon:"👟",price:135000,desc:"Color pop",bonus:{love:5}},{id:"boots_brown",category:"Giày",name:"Boot nâu",icon:"🥾",price:210000,desc:"Vintage cool",bonus:{reputation:8}},{id:"bag_green",category:"Balo",name:"Balo xanh mint",icon:"🎒",price:110000,desc:"Campus",bonus:{friends:5}},{id:"bag_laptop",category:"Balo",name:"Balo laptop",icon:"💼",price:180000,desc:"Học tập",bonus:{skill:5,study:3}},{id:"watch_sport",category:"Phụ kiện",name:"Đồng hồ thể thao",icon:"⌚",price:190000,desc:"Năng động",bonus:{energy:4,skill:3}},{id:"earbuds",category:"Phụ kiện",name:"Tai nghe không dây",icon:"🎧",price:240000,desc:"Gọn nhẹ",bonus:{mood:8,skill:3}},{id:"ring_silver",category:"Phụ kiện",name:"Nhẫn bạc",icon:"💍",price:260000,desc:"Tinh tế",bonus:{love:8,reputation:4}},{id:"cap_white",category:"Phụ kiện",name:"Mũ trắng",icon:"🧢",price:40000,desc:"Clean",bonus:{mood:3}},{id:"hair_ash",category:"Tóc",name:"Tóc nâu khói",icon:"💇",price:120000,desc:"Trendy",bonus:{reputation:5,mood:4}},{id:"hair_pink",category:"Tóc",name:"Tóc hồng pastel",icon:"💇",price:160000,desc:"Nổi bật",bonus:{love:6,reputation:4}}];
FASHION.push(...EXTRA_FASHION);

const FASHION_CATEGORIES = ["Áo", "Quần", "Giày", "Balo", "Phụ kiện", "Tóc"];

/* =========================================================
   NPC
========================================================= */

const NPCS = [
  {
    id:"lan",
    name:"Lan",
    icon:"👧",
    desc:"Bạn học chăm chỉ, thích học nhóm.",
    action:"📚 Học nhóm",
    apply:g=>{
      addStat(g,"study",3);
      addStat(g,"friends",4);
      addRelationship(g,"lan",5);
      addCompetition(g,3);
      g.studyActions++;
    }
  },
  {
    id:"trieuMan",
    name:"Triệu Mẫn",
    icon:"🌸",
    desc:"Vịu ơ.",
    action:"💗 Tâm sự",
    apply:g=>{
      addStat(g,"mood",4);
      addStat(g,"love",4);
      addStat(g,"friends",3);
      addRelationship(g,"trieuMan",5);
      addCompetition(g,2);
    }
  },
  {
    id:"tuan",
    name:"Tuấn",
    icon:"👦",
    desc:"Thích thể thao và kỹ năng.",
    action:"⚡ Luyện kỹ năng",
    apply:g=>{
      addStat(g,"skill",4);
      addStat(g,"reputation",2);
      addRelationship(g,"tuan",5);
      addCompetition(g,3);
    }
  },
  {
    id:"minh",
    name:"Minh",
    icon:"🧑‍🎓",
    desc:"Bạn cùng bàn khá thông minh.",
    action:"📝 Ôn bài",
    apply:g=>{
      addStat(g,"study",4);
      addStat(g,"friends",2);
      addRelationship(g,"minh",4);
      addCompetition(g,3);
      g.studyActions++;
    }
  },
  {
    id:"linh",
    name:"Linh",
    icon:"🎨",
    desc:"Thành viên CLB nghệ thuật.",
    action:"🎨 Vào CLB",
    apply:g=>{
      addStat(g,"mood",5);
      addStat(g,"friends",5);
      addStat(g,"skill",2);
      addRelationship(g,"linh",5);
      addCompetition(g,2);
    }
  },
  {
    id:"phong",
    name:"Phong",
    icon:"🏃",
    desc:"Bạn mê thể thao.",
    action:"🏃 Chạy sân trường",
    apply:g=>{
      addStat(g,"hp",5);
      addStat(g,"energy",-5);
      addStat(g,"friends",3);
      addRelationship(g,"phong",4);
      addCompetition(g,3);
    }
  }
];

/* =========================================================
   SỰ KIỆN NGẪU NHIÊN
========================================================= */

const DAILY_EVENTS = [
  {
    id:"teacher",
    icon:"🧑‍🏫",
    title:"Được giáo viên khen",
    text:"Bạn phát biểu rất tốt trong lớp.",
    result:"Kiến thức +3 • Danh tiếng +5 • Thi đua +4",
    apply:g=>{
      addStat(g,"study",3);
      addStat(g,"reputation",5);
      addCompetition(g,4);
    }
  },
  {
    id:"festival",
    icon:"🎉",
    title:"Trường tổ chức ngày hội",
    text:"Cả trường náo nhiệt với nhiều hoạt động.",
    result:"Tâm trạng +8 • Bạn bè +5 • Thi đua +3",
    apply:g=>{
      addStat(g,"mood",8);
      addStat(g,"friends",5);
      addCompetition(g,3);
    }
  },
  {
    id:"test",
    icon:"📄",
    title:"Kiểm tra bất ngờ",
    text:"Giáo viên bất ngờ phát đề.",
    result:"Kiến thức -4 • Danh tiếng +2 • Thi đua +2",
    apply:g=>{
      addStat(g,"study",-4);
      addStat(g,"reputation",2);
      addCompetition(g,2);
    }
  },
  {
    id:"wallet",
    icon:"💸",
    title:"Làm rơi ví",
    text:"Một khoản tiền nhỏ bị thất lạc.",
    result:"Tiền -30.000đ • Tâm trạng -4",
    apply:g=>{
      addMoney(g,-30000);
      addStat(g,"mood",-4);
    }
  },
  {
    id:"snack",
    icon:"🍪",
    title:"Bạn cho đồ ăn",
    text:"Một người bạn bất ngờ chia đồ ăn cho bạn.",
    result:"Năng lượng +5 • Tâm trạng +5",
    apply:g=>{
      addStat(g,"energy",5);
      addStat(g,"mood",5);
    }
  },
  {
    id:"rain",
    icon:"🌧️",
    title:"Trời mưa",
    text:"Mưa lớn khiến việc di chuyển khó khăn.",
    result:"Năng lượng -5 • Tâm trạng -3",
    apply:g=>{
      addStat(g,"energy",-5);
      addStat(g,"mood",-3);
    }
  },
  {
    id:"club",
    icon:"🎯",
    title:"CLB tuyển thành viên",
    text:"Bạn được mời tham gia một CLB mới.",
    result:"Kỹ năng +4 • Bạn bè +3",
    apply:g=>{
      addStat(g,"skill",4);
      addStat(g,"friends",3);
    }
  },
  {
    id:"lunch",
    icon:"🍱",
    title:"Được mời ăn trưa",
    text:"Một người bạn mời bạn ăn trưa.",
    result:"Tiền +20.000đ • Tâm trạng +4",
    apply:g=>{
      addMoney(g,20000);
      addStat(g,"mood",4);
    }
  },
  {
    id:"library",
    icon:"📚",
    title:"Tìm được tài liệu hay",
    text:"Bạn tình cờ tìm thấy một cuốn sách hữu ích.",
    result:"Kiến thức +5",
    apply:g=>{
      addStat(g,"study",5);
      g.studyActions++;
    }
  },
  {
    id:"sport",
    icon:"🏅",
    title:"Ngày hội thể thao",
    text:"Bạn tham gia một trận đấu vui vẻ.",
    result:"HP +3 • Bạn bè +4 • Năng lượng -5",
    apply:g=>{
      addStat(g,"hp",3);
      addStat(g,"friends",4);
      addStat(g,"energy",-5);
    }
  },
  {
    id:"contest",
    icon:"💻",
    title:"Cuộc thi online",
    text:"Bạn được rủ tham gia một cuộc thi kiến thức.",
    result:"Kỹ năng +3 • Thi đua +5",
    apply:g=>{
      addStat(g,"skill",3);
      addCompetition(g,5);
    }
  },
  {
    id:"bus",
    icon:"🚌",
    title:"Trễ xe buýt",
    text:"Bạn phải chờ xe lâu hơn bình thường.",
    result:"Năng lượng -8 • Tâm trạng -3",
    apply:g=>{
      addStat(g,"energy",-8);
      addStat(g,"mood",-3);
    }
  },
  {
    id:"message",
    icon:"📱",
    title:"Bạn cũ nhắn tin",
    text:"Một người bạn cũ bất ngờ liên lạc.",
    result:"Bạn bè +5 • Tâm trạng +4",
    apply:g=>{
      addStat(g,"friends",5);
      addStat(g,"mood",4);
    }
  },
  {
    id:"coupon",
    icon:"🎟️",
    title:"Nhận voucher",
    text:"Bạn nhận được voucher từ một cửa hàng.",
    result:"Tiền +15.000đ",
    apply:g=>addMoney(g,15000)
  },
  {
    id:"clean",
    icon:"🧹",
    title:"Dọn lớp",
    text:"Bạn ở lại giúp lớp dọn dẹp.",
    result:"Danh tiếng +3 • Bạn bè +2 • Thi đua +2",
    apply:g=>{
      addStat(g,"reputation",3);
      addStat(g,"friends",2);
      addCompetition(g,2);
    }
  }
];

function eventData(ev){
  return {
    id:ev.id,
    icon:ev.icon,
    title:ev.title,
    text:ev.text,
    result:ev.result
  };
}

function pickDailyEvent(lastId){
  const available = DAILY_EVENTS.filter(e=>e.id !== lastId);
  return pick(available.length ? available : DAILY_EVENTS);
}

/* =========================================================
   NGƯỜI CHƠI KHÁC — FALLBACK DEMO
   Dùng khi Supabase chưa được cấu hình.
   Khi online hoạt động, leaderboard lấy dữ liệu thật từ server.
========================================================= */

const OTHER_PLAYER_SEEDS = [
  {id:"p1", name:"Mai Anh", icon:"👩🏻‍🎓", points:44},
  {id:"p2", name:"Gia Hân", icon:"👩🏼‍🎓", points:39},
  {id:"p3", name:"Khánh Linh", icon:"👩🏻‍💻", points:35},
  {id:"p4", name:"Hoàng Nam", icon:"👨🏻‍🎓", points:32},
  {id:"p5", name:"Minh Khang", icon:"👨🏼‍🎓", points:28},
  {id:"p6", name:"Thảo Vy", icon:"👩🏽‍🎓", points:25},
  {id:"p7", name:"Đức Anh", icon:"👨🏻‍💻", points:22},
  {id:"p8", name:"Ngọc Hà", icon:"👩🏻‍🎨", points:19}
];

const createOtherPlayers = () =>
  OTHER_PLAYER_SEEDS.map(p=>({...p, today:0}));

/* =========================================================
   NGHỀ
========================================================= */

const JOBS = [
  {
    id:"canteen",
    name:"Phục vụ căn tin",
    icon:"🍱",
    pay:25000,
    energy:8,
    desc:"Ca nhẹ, phù hợp người mới.",
    can:()=>true,
    apply:g=>{
      addMoney(g,25000);
      addStat(g,"energy",-8);
      addStat(g,"skill",1);
      addCompetition(g,2);
    }
  },
  {
    id:"flyer",
    name:"Phát tờ rơi",
    icon:"📄",
    pay:30000,
    energy:12,
    desc:"Việc đơn giản nhưng khá mệt.",
    can:()=>true,
    apply:g=>{
      addMoney(g,30000);
      addStat(g,"energy",-12);
      addStat(g,"mood",-2);
      addStat(g,"skill",2);
      addCompetition(g,2);
    }
  },
  {
    id:"excel",
    name:"Nhập dữ liệu Excel",
    icon:"💻",
    pay:50000,
    energy:10,
    desc:"Cần kỹ năng từ 100.",
    can:g=>g.stats.skill>=35,
    apply:g=>{
      addMoney(g,50000);
      addStat(g,"energy",-10);
      addStat(g,"skill",2);
      addCompetition(g,4);
    }
  },
  {
    id:"driver",
    name:"Lái xe VIP",
    icon:"🚗",
    pay:100000,
    energy:20,
    desc:"Cần chứng chỉ lái xe.",
    can:g=>g.certificates.includes("cert_driver"),
    apply:g=>{
      addMoney(g,100000);
      addStat(g,"energy",-20);
      addStat(g,"reputation",3);
      addStat(g,"skill",4);
      addCompetition(g,6);
    }
  },
  {
    id:"interpreter",
    name:"Trợ lý tiếng Anh",
    icon:"🌎",
    pay:150000,
    energy:15,
    desc:"Cần TOEIC và kỹ năng ≥ 300.",
    can:g=>g.certificates.includes("cert_toeic") && g.stats.skill>=300,
    apply:g=>{
      addMoney(g,150000);
      addStat(g,"energy",-10);
      addStat(g,"skill",3);
      addCompetition(g,7);
    }
  },
  {
    id:"broker",
    name:"Cộng tác viên chứng khoán",
    icon:"📈",
    pay:200000,
    energy:10,
    desc:"Cần chứng chỉ tài chính và kỹ năng ≥ 500.",
    can:g=>g.certificates.includes("cert_finance") && g.stats.skill>=500,
    apply:g=>{
      addMoney(g,200000);
      addStat(g,"energy",-10);
      addStat(g,"reputation",4);
      addStat(g,"skill",5);
      addCompetition(g,8);
    }
  }
];

/* =========================================================
   NGHỀ MỚI — ĐI LÀM LUÔN TĂNG KỸ NĂNG
========================================================= */
const EXTRA_JOBS = [
  {
    id:"content_writer",
    name:"Cộng tác viên viết nội dung",
    icon:"✍️",
    pay:70000,
    energy:10,
    desc:"Cần kỹ năng ≥ 60. Viết bài giúp tăng kỹ năng ngôn ngữ.",
    can:g=>g.stats.skill>=60,
    apply:g=>{
      addMoney(g,70000);
      addStat(g,"energy",-10);
      addStat(g,"skill",5);
      addStat(g,"reputation",2);
      addCompetition(g,4);
    }
  },
  {
    id:"barista",
    name:"Phụ barista",
    icon:"☕",
    pay:60000,
    energy:12,
    desc:"Cần kỹ năng ≥ 40. Rèn tốc độ và giao tiếp.",
    can:g=>g.stats.skill>=40,
    apply:g=>{
      addMoney(g,60000);
      addStat(g,"energy",-12);
      addStat(g,"skill",3);
      addStat(g,"friends",2);
      addCompetition(g,3);
    }
  },
  {
    id:"social_media",
    name:"Quản lý mạng xã hội",
    icon:"📱",
    pay:90000,
    energy:10,
    desc:"Cần kỹ năng ≥ 120 và chứng chỉ MOS.",
    can:g=>g.stats.skill>=120 && g.certificates.includes("cert_mos"),
    apply:g=>{
      addMoney(g,90000);
      addStat(g,"energy",-10);
      addStat(g,"skill",6);
      addStat(g,"reputation",3);
      addCompetition(g,5);
    }
  },
  {
    id:"chinese_tutor",
    name:"Trợ giảng tiếng Trung",
    icon:"🇨🇳",
    pay:130000,
    energy:12,
    desc:"Cần HSK 4 và kỹ năng ≥ 180.",
    can:g=>g.certificates.includes("cert_hsk4") && g.stats.skill>=180,
    apply:g=>{
      addMoney(g,130000);
      addStat(g,"energy",-12);
      addStat(g,"skill",7);
      addStat(g,"reputation",4);
      addCompetition(g,6);
    }
  },
  {
    id:"chinese_translator",
    name:"Cộng tác viên dịch Trung",
    icon:"🀄",
    pay:220000,
    energy:14,
    desc:"Cần HSK 5 và kỹ năng ≥ 300.",
    can:g=>g.certificates.includes("cert_hsk5") && g.stats.skill>=300,
    apply:g=>{
      addMoney(g,220000);
      addStat(g,"energy",-14);
      addStat(g,"skill",9);
      addStat(g,"reputation",5);
      addCompetition(g,8);
    }
  },
  {
    id:"data_analyst",
    name:"Trợ lý phân tích dữ liệu",
    icon:"📊",
    pay:180000,
    energy:14,
    desc:"Cần MOS và kỹ năng ≥ 250.",
    can:g=>g.certificates.includes("cert_mos") && g.stats.skill>=250,
    apply:g=>{
      addMoney(g,180000);
      addStat(g,"energy",-14);
      addStat(g,"skill",8);
      addStat(g,"reputation",4);
      addCompetition(g,7);
    }
  }
];

JOBS.push(...EXTRA_JOBS);

/* =========================================================
   CHỨNG CHỈ
========================================================= */

const CERTS = [
  {
    id:"cert_driver",
    name:"Chứng chỉ lái xe",
    icon:"🚗",
    fee:80000,
    req:100,
    desc:"Mở khóa công việc lái xe VIP.",
    questions:[
      {
        q:"Khi đèn đỏ, người lái xe phải làm gì?",
        choices:["Dừng lại","Tăng tốc","Đi ngược chiều","Bấm còi"],
        answer:0,
        explanation:"Đèn đỏ yêu cầu phương tiện dừng lại."
      },
      {
        q:"Dây an toàn có tác dụng chính là?",
        choices:["Giảm nguy cơ chấn thương","Tăng tốc xe","Tiết kiệm xăng","Tăng âm thanh"],
        answer:0,
        explanation:"Dây an toàn giúp giảm nguy cơ chấn thương khi va chạm."
      },
      {
        q:"Khi lái xe cần ưu tiên điều gì?",
        choices:["An toàn giao thông","Tốc độ tối đa","Bấm còi","Vượt mọi xe"],
        answer:0,
        explanation:"An toàn là ưu tiên hàng đầu."
      }
    ]
  },
  {
    id:"cert_toeic",
    name:"Chứng chỉ TOEIC",
    icon:"🇬🇧",
    fee:120000,
    req:150,
    desc:"Mở khóa việc trợ lý tiếng Anh.",
    questions:[
      {
        q:"Choose the correct answer: She ___ to school every day.",
        choices:["goes","go","going","gone"],
        answer:0,
        explanation:"She là ngôi thứ ba số ít nên dùng goes."
      },
      {
        q:"What is the opposite of 'cheap'?",
        choices:["expensive","small","easy","short"],
        answer:0,
        explanation:"Cheap = rẻ, opposite = expensive."
      },
      {
        q:"I am interested ___ English.",
        choices:["in","on","at","for"],
        answer:0,
        explanation:"Cấu trúc: be interested in."
      }
    ]
  },
  {
    id:"cert_mos",
    name:"Chứng chỉ MOS",
    icon:"💻",
    fee:100000,
    req:300,
    desc:"Chứng minh kỹ năng văn phòng.",
    questions:[
      {
        q:"Excel dùng chủ yếu để làm gì?",
        choices:["Bảng tính và dữ liệu","Chỉnh ảnh","Dựng phim","Nghe nhạc"],
        answer:0,
        explanation:"Excel là phần mềm bảng tính."
      },
      {
        q:"Trong Excel, SUM dùng để?",
        choices:["Tính tổng","Đếm ký tự","Đổi màu","Xóa file"],
        answer:0,
        explanation:"SUM dùng để tính tổng."
      },
      {
        q:"Ctrl + C thường dùng để?",
        choices:["Copy","Paste","Save","Close"],
        answer:0,
        explanation:"Ctrl + C là sao chép."
      }
    ]
  },
  {
    id:"cert_finance",
    name:"Chứng chỉ tài chính",
    icon:"📈",
    fee:180000,
    req:500,
    desc:"Mở khóa công việc chứng khoán.",
    questions:[
      {
        q:"Đầu tư đa dạng hóa nhằm mục đích gì?",
        choices:["Phân tán rủi ro","Tăng chắc chắn lợi nhuận","Không có rủi ro","Không cần nghiên cứu"],
        answer:0,
        explanation:"Đa dạng hóa giúp phân tán rủi ro."
      },
      {
        q:"Cổ phiếu đại diện cho điều gì?",
        choices:["Quyền sở hữu một phần doanh nghiệp","Khoản vay ngân hàng","Tiền mặt","Hợp đồng lao động"],
        answer:0,
        explanation:"Cổ phiếu đại diện cho quyền sở hữu vốn trong doanh nghiệp."
      },
      {
        q:"Nguyên tắc quan trọng khi đầu tư là?",
        choices:["Quản trị rủi ro","Luôn mua theo tin đồn","Vay tối đa","Không cần kế hoạch"],
        answer:0,
        explanation:"Quản trị rủi ro là nguyên tắc quan trọng trong đầu tư."
      }
    ]
  }
];

/* =========================================================
   TÀI SẢN
========================================================= */

const ASSETS = [
  {id:"bike",name:"Xe đạp",icon:"🚲",price:120000,desc:"Đi học nhanh hơn",bonus:{energy:3}},
  {id:"scooter",name:"Xe máy",icon:"🛵",price:800000,desc:"Di chuyển tiện lợi",bonus:{energy:5,reputation:3}},
  {id:"sedan",name:"Sedan",icon:"🚗",price:1800000,desc:"Tài sản đầu tiên",bonus:{reputation:6,mood:4}},
  {id:"supercar",name:"Siêu xe",icon:"🏎️",price:5000000,desc:"Cực kỳ nổi bật",bonus:{reputation:12,mood:8}},
  {id:"condo",name:"Căn hộ",icon:"🏢",price:20000000,desc:"Không gian riêng",bonus:{mood:12,energy:5}},
  {id:"villa",name:"Biệt thự",icon:"🏡",price:60000000,desc:"Tài sản mơ ước",bonus:{mood:18,reputation:15}},
];
const EXTRA_ASSETS=[{id:"laptop",name:"Laptop học tập",icon:"💻",price:3500000,desc:"Học và làm việc",bonus:{skill:15,study:6}},{id:"tablet",name:"Máy tính bảng",icon:"📱",price:2200000,desc:"Ghi chú",bonus:{study:8,mood:4}},{id:"camera",name:"Máy ảnh",icon:"📷",price:2800000,desc:"Sáng tạo",bonus:{skill:10,reputation:5}},{id:"motorbike_premium",name:"Xe tay ga premium",icon:"🛵",price:1500000,desc:"Di chuyển",bonus:{energy:8,reputation:5}},{id:"studio",name:"Phòng studio",icon:"🎙️",price:12000000,desc:"Không gian sáng tạo",bonus:{skill:20,mood:10}},{id:"mini_library",name:"Tủ sách lớn",icon:"📚",price:1800000,desc:"Kho tri thức",bonus:{study:12,skill:8}},{id:"gaming_pc",name:"PC gaming",icon:"🖥️",price:6500000,desc:"Công nghệ",bonus:{mood:12,skill:12}},{id:"coffee_shop",name:"Góc cà phê riêng",icon:"☕",price:9000000,desc:"Thư giãn",bonus:{mood:15,friends:8}}];
ASSETS.push(...EXTRA_ASSETS);

const MORE_ASSETS = [
  {id:"smartwatch",name:"Smartwatch",icon:"⌚",price:1800000,desc:"Theo dõi lịch học và vận động",bonus:{energy:6,skill:5}},
  {id:"headphones",name:"Tai nghe chống ồn",icon:"🎧",price:2400000,desc:"Tập trung học tập",bonus:{study:10,mood:6}},
  {id:"e_reader",name:"Máy đọc sách",icon:"📖",price:3200000,desc:"Thư viện di động",bonus:{study:14,knowledge:10}},
  {id:"mechanical_keyboard",name:"Bàn phím cơ",icon:"⌨️",price:2800000,desc:"Góc học tập xịn hơn",bonus:{skill:8,mood:5}},
  {id:"desk",name:"Bàn học thông minh",icon:"🪑",price:4500000,desc:"Tối ưu góc học tập",bonus:{study:12,skill:10}},
  {id:"bookshelf",name:"Kệ sách mini",icon:"🗄️",price:2500000,desc:"Mở rộng kho sách",bonus:{study:10,knowledge:8}},
  {id:"bicycle_pro",name:"Xe đạp thể thao",icon:"🚴",price:4200000,desc:"Di chuyển và rèn luyện",bonus:{energy:10,reputation:5}},
  {id:"electric_scooter",name:"Xe máy điện",icon:"🛴",price:12000000,desc:"Di chuyển hiện đại",bonus:{energy:12,reputation:8}},
  {id:"compact_car",name:"Ô tô gia đình",icon:"🚙",price:28000000,desc:"Tiện nghi hằng ngày",bonus:{energy:15,reputation:10,mood:8}},
  {id:"sports_car",name:"Xe thể thao",icon:"🏁",price:85000000,desc:"Tài sản cực hiếm",bonus:{reputation:22,mood:15}},
  {id:"penthouse",name:"Penthouse",icon:"🌆",price:120000000,desc:"Không gian sống cao cấp",bonus:{mood:25,reputation:22,energy:8}},
  {id:"beach_house",name:"Nhà nghỉ ven biển",icon:"🏖️",price:160000000,desc:"Nghỉ dưỡng cuối tuần",bonus:{mood:30,reputation:18}},
  {id:"office_room",name:"Văn phòng riêng",icon:"🏢",price:45000000,desc:"Không gian làm việc chuyên nghiệp",bonus:{skill:22,reputation:12}},
  {id:"co_working",name:"Phòng co-working",icon:"🧑‍💻",price:18000000,desc:"Môi trường học và làm việc",bonus:{skill:15,friends:12}},
  {id:"mini_cafe",name:"Quán cà phê mini",icon:"☕",price:55000000,desc:"Tài sản kinh doanh",bonus:{money:0,reputation:15,friends:15}},
  {id:"online_store",name:"Cửa hàng online",icon:"🛒",price:30000000,desc:"Kinh doanh nhỏ",bonus:{reputation:12,skill:18}},
  {id:"investment_fund",name:"Danh mục đầu tư",icon:"📊",price:75000000,desc:"Tài sản tài chính",bonus:{knowledge:20,reputation:20}},
  {id:"gold_collection",name:"Bộ sưu tập vàng",icon:"🥇",price:95000000,desc:"Tài sản tích lũy",bonus:{reputation:18,mood:10}},
  {id:"art_collection",name:"Bộ sưu tập nghệ thuật",icon:"🖼️",price:68000000,desc:"Đồ sưu tầm giá trị",bonus:{mood:18,reputation:20}},
  {id:"private_library",name:"Thư viện riêng",icon:"🏛️",price:90000000,desc:"Không gian tri thức cá nhân",bonus:{study:20,skill:20,knowledge:25}}
];
ASSETS.push(...MORE_ASSETS);

/* =========================================================
   TITLE
========================================================= */

const TITLES = [
  {id:"starter",name:"Tân Binh Thanh Xuân",icon:"🌱",desc:"Bắt đầu hành trình",condition:()=>true},
  {id:"diligent",name:"Người Chăm Chỉ",icon:"📚",desc:"8 lần học",condition:g=>g.studyActions>=8},
  {id:"scholar",name:"Học Bá",icon:"🏆",desc:"Kiến thức ≥ 85",condition:g=>g.stats.study>=85},
  {id:"social",name:"Tâm Điểm Lớp",icon:"🤝",desc:"Bạn bè ≥ 85",condition:g=>g.stats.friends>=85},
  {id:"skill",name:"Đa Năng",icon:"🛠️",desc:"Kỹ năng ≥ 400",condition:g=>g.stats.skill>=400},
  {id:"love",name:"Thanh Xuân Có Đôi",icon:"💗",desc:"Tình cảm ≥ 80",condition:g=>g.stats.love>=80},
  {id:"certificate",name:"Bộ Sưu Tập Chứng Chỉ",icon:"🎓",desc:"Có ≥ 3 chứng chỉ",condition:g=>g.certificates.length>=3},
  {id:"fashion",name:"Fashionista Học Đường",icon:"👗",desc:"Có ≥ 15 món thời trang",condition:g=>g.wardrobe.length>=15},
  {id:"asset",name:"Tay Chơi Tài Sản",icon:"🏠",desc:"Sở hữu ≥ 2 tài sản",condition:g=>g.assets.length>=2},
  {id:"future",name:"Nhà Đầu Tư Tương Lai",icon:"📈",desc:"Có chứng chỉ tài chính",condition:g=>g.certificates.includes("cert_finance")},
  {id:"competition",name:"Ngôi Sao Thi Đua",icon:"🌟",desc:"≥ 100 điểm thi đua",condition:g=>g.competitionPoints>=100},
  {id:"legend",name:"Thanh Xuân Rực Rỡ",icon:"✨",desc:"Hoàn thành hành trình",condition:g=>g.isGameOver},
];
TITLES.push({id:"asset_tycoon",name:"Ông Trùm Tài Sản",icon:"🏦",desc:"Sở hữu ≥ 15 tài sản",condition:g=>g.assets.length>=15},{id:"property_king",name:"Vua Bất Động Sản",icon:"🏙️",desc:"Sở hữu ≥ 5 tài sản nhà ở",condition:g=>g.assets.filter(id=>["condo","villa","penthouse","beach_house"].includes(id)).length>=5},{id:"tech_collector",name:"Tín Đồ Công Nghệ",icon:"💻",desc:"Sở hữu ≥ 6 tài sản công nghệ",condition:g=>g.assets.filter(id=>["laptop","tablet","camera","gaming_pc","smartwatch","headphones","e_reader","mechanical_keyboard"].includes(id)).length>=6},{id:"luxury_life",name:"Cuộc Sống Xa Hoa",icon:"💎",desc:"Sở hữu ≥ 3 tài sản cao cấp",condition:g=>g.assets.filter(id=>["sports_car","penthouse","beach_house","investment_fund","gold_collection","art_collection","private_library"].includes(id)).length>=3},{id:"business_owner",name:"Chủ Doanh Nghiệp Trẻ",icon:"🏪",desc:"Sở hữu quán cà phê hoặc cửa hàng online",condition:g=>g.assets.includes("mini_cafe")||g.assets.includes("online_store")});
TITLES.push({id:"math_master",name:"Chiến Thần Toán 11",icon:"🧮",desc:"Đã làm ≥ 30 câu Toán 11",condition:g=>g.quizHistory.filter(id=>String(id).startsWith("toan11")).length>=30},{id:"quiz_marathon",name:"Máy Cày Quiz",icon:"🔥",desc:"Đã làm ≥ 100 câu",condition:g=>g.quizHistory.length>=100},{id:"knowledge_hero",name:"Kho Báu Tri Thức",icon:"🧠",desc:"Tri thức ≥ 200",condition:g=>g.knowledgePoints>=200},{id:"achievement_hunter",name:"Thợ Săn Thành Tích",icon:"🏅",desc:"Thành tích ≥ 200",condition:g=>g.achievementPoints>=200},{id:"shopaholic",name:"Đại Gia Học Đường",icon:"🛍️",desc:"Có ≥ 30 món thời trang",condition:g=>g.wardrobe.length>=30},{id:"collector",name:"Nhà Sưu Tầm",icon:"🎁",desc:"Có ≥ 8 tài sản",condition:g=>g.assets.length>=15},{id:"career_climber",name:"Bậc Thầy Sự Nghiệp",icon:"💼",desc:"Kỹ năng ≥ 450 và ≥ 5 chứng chỉ",condition:g=>g.stats.skill>=450&&g.certificates.length>=5},{id:"language_lover",name:"Polyglot",icon:"🌏",desc:"Có HSK 4 và HSK 5",condition:g=>g.certificates.includes("cert_hsk4")&&g.certificates.includes("cert_hsk5")},{id:"english_pro",name:"English Pro",icon:"🇬🇧",desc:"TOEIC và kỹ năng ≥ 350",condition:g=>g.certificates.includes("cert_toeic")&&g.stats.skill>=350},{id:"worker",name:"Người Ham Làm",icon:"⚒️",desc:"Làm việc ≥ 15 lần",condition:g=>g.jobActions>=15},{id:"fashion_star",name:"Ngôi Sao Phong Cách",icon:"✨",desc:"Danh tiếng ≥ 90 và ≥ 20 món",condition:g=>g.stats.reputation>=90&&g.wardrobe.length>=20},{id:"rich_student",name:"Học Sinh Có Của",icon:"💰",desc:"Có ≥ 5.000.000đ",condition:g=>g.stats.money>=5000000});

/* =========================================================
   SAVE / LOAD
========================================================= */

function encodeSaveCode(data){
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";
  const chunk = 0x8000;

  for(let i=0;i<bytes.length;i+=chunk){
    binary += String.fromCharCode(...bytes.subarray(i,i+chunk));
  }

  return btoa(binary)
    .replace(/\+/g,"-")
    .replace(/\//g,"_")
    .replace(/=+$/,"");
}

function decodeSaveCode(code){
  let b64 = code.trim().replace(/-/g,"+").replace(/_/g,"/");
  while(b64.length % 4) b64 += "=";

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);

  for(let i=0;i<binary.length;i++){
    bytes[i] = binary.charCodeAt(i);
  }

  return JSON.parse(new TextDecoder().decode(bytes));
}

function snapshotDay(g){
  return {
    stats:{
      study:g.stats.study,
      money:g.stats.money,
      friends:g.stats.friends,
      energy:g.stats.energy,
      mood:g.stats.mood,
      reputation:g.stats.reputation,
      skill:g.stats.skill,
      love:g.stats.love,
    },
    competitionPoints:g.competitionPoints
  };
}

function emptyDailyCompetition(){
  return {
    player:0,
    lan:0,
    trieuMan:0,
    tuan:0,
    minh:0,
    linh:0,
    phong:0
  };
}

/* =========================================================
   STATE
========================================================= */

function createInitialState(){
  const g = {
    version:17,
    isGameOver:false,
    day:1,
    totalDays:100,
    timeIndex:0,
    location:"class",
    playerName:"",

    stats:{
      hp:85,
      energy:100,
      mood:75,
      study:50,
      friends:40,
      love:20,
      reputation:30,
      skill:25,
      money:150000
    },

    certificates:[],
    assets:[],
    wardrobe:["shirt_white","pants_black","shoes_school","bag_school","hair_black"],

    outfit:{
      shirt:"shirt_white",
      pants:"pants_black",
      shoes:"shoes_school",
      bag:"bag_school",
      accessory:null,
      hair:"hair_black"
    },

    bag:[
      {
        id:"math_note",
        name:"Sổ Công Thức",
        icon:"📘",
        count:1,
        desc:"+8 kiến thức"
      },
      {
        id:"gift_strawberry",
        name:"Kẹo Dâu Tây",
        icon:"🍬",
        count:2,
        desc:"+tình cảm"
      }
    ],

    diaryEntries:[],

    competitionPoints:0,
    achievementPoints:0,
    knowledgePoints:0,

    npcCompetition:{
      lan:42,
      trieuMan:50,
      tuan:36,
      minh:31,
      linh:28,
      phong:34
    },

    dailyCompetition:emptyDailyCompetition(),

    otherPlayers:createOtherPlayers(),

    examResults:{},

    relationships:{
      lan:45,
      trieuMan:30,
      tuan:40,
      minh:35,
      linh:32,
      phong:38
    },

    studyActions:0,
    jobActions:0,
    oralChecksDone:0,
    dailyOralCheckDone:false,
    mainActivityUsed:false,
    mainActivityLabel:null,
    mainActivityCount:0,
    mainActivityLabels:[],

    dailyEvent:null,
    lastEventId:null,
    dayStart:null,

    selectedTitle:"starter",

    // Chống lặp câu hỏi: lưu ID các câu gần đây và khóa quiz nhanh 1 lần/ngày.
    quizHistory:[],
    dailyQuizDone:false,
    dailyQuizCount:0,
    dailyOralCheckCount:0
  };

  const ev = pickDailyEvent(null);

  g.dayStart = snapshotDay(g);
  g.dailyEvent = eventData(ev);
  g.lastEventId = ev.id;
  ev.apply(g);

  return g;
}

function normalizeState(raw){
  const base = createInitialState();

  const g = {
    ...base,
    ...raw,
    stats:{
      ...base.stats,
      ...(raw?.stats || {})
    },
    certificates:Array.isArray(raw?.certificates) ? raw.certificates : base.certificates,
    assets:Array.isArray(raw?.assets) ? raw.assets : base.assets,
    wardrobe:Array.isArray(raw?.wardrobe) ? raw.wardrobe : base.wardrobe,
    bag:Array.isArray(raw?.bag) ? raw.bag : base.bag,
    diaryEntries:Array.isArray(raw?.diaryEntries) ? raw.diaryEntries : [],
    quizHistory:Array.isArray(raw?.quizHistory) ? raw.quizHistory : [],
    npcCompetition:{
      ...base.npcCompetition,
      ...(raw?.npcCompetition || {})
    },
    dailyCompetition:{
      ...base.dailyCompetition,
      ...(raw?.dailyCompetition || {})
    },
    examResults:{
      ...base.examResults,
      ...(raw?.examResults || {})
    },
    relationships:{
      ...base.relationships,
      ...(raw?.relationships || {})
    },
    otherPlayers:Array.isArray(raw?.otherPlayers)
      ? raw.otherPlayers.map((p,i)=>({
          ...(base.otherPlayers[i] || OTHER_PLAYER_SEEDS[i]),
          ...p,
          id:p.id || base.otherPlayers[i]?.id || `p${i+1}`,
          name:String(p.name || base.otherPlayers[i]?.name || `Người chơi ${i+1}`).slice(0,20),
          points:Math.max(0,Math.round(Number(p.points)||0)),
          today:Math.max(0,Math.round(Number(p.today)||0))
        }))
      : createOtherPlayers(),
    outfit:{
      ...base.outfit,
      ...(raw?.outfit || {})
    }
  };

  g.playerName = String(g.playerName || "").trim().slice(0,20);
  g.achievementPoints = Math.max(0, Math.round(Number(g.achievementPoints) || 0));
  g.knowledgePoints = Math.max(0, Math.round(Number(g.knowledgePoints) || 0));
  g.dailyQuizCount = Math.max(0, Math.min(7, Number(g.dailyQuizCount) || (g.dailyQuizDone ? 1 : 0)));
  g.dailyOralCheckCount = Math.max(0, Math.min(4, Number(g.dailyOralCheckCount) || (g.dailyOralCheckDone ? 1 : 0)));
  g.dailyQuizDone = g.dailyQuizCount >= 7;
  g.dailyOralCheckDone = g.dailyOralCheckCount >= 4;
  g.quizHistory = Array.isArray(g.quizHistory)
    ? g.quizHistory.filter(Boolean).slice(-300)
    : [];

  g.day = Math.max(1, Math.min(g.totalDays || 100, Number(g.day) || 1));
  g.timeIndex = Math.max(0, Math.min(TIME_SLOTS.length - 1, Number(g.timeIndex) || 0));
  const legacyCount = g.mainActivityCount == null
    ? (g.mainActivityUsed ? 1 : 0)
    : Number(g.mainActivityCount) || 0;
  g.mainActivityCount = Math.max(0, Math.min(2, legacyCount));
  g.mainActivityLabels = Array.isArray(g.mainActivityLabels)
    ? g.mainActivityLabels.filter(Boolean).slice(0,2)
    : (g.mainActivityLabel ? [g.mainActivityLabel] : []);
  g.mainActivityUsed = g.mainActivityCount >= 2;
  g.mainActivityLabel = g.mainActivityLabels.join(" • ");
  g.mainActivityLabel = g.mainActivityLabel || null;

  for(const key of [
    "hp",
    "energy",
    "mood",
    "study",
    "friends",
    "love",
    "reputation",
    "skill"
  ]){
    const max = key === "skill" ? 500 : 100;
    g.stats[key] = Math.max(0, Math.min(max, Number(g.stats[key]) || 0));
  }

  g.stats.money = Math.max(0, Number(g.stats.money) || 0);

  if(!g.dayStart){
    g.dayStart = snapshotDay(g);
  }

  return g;
}

/* =========================================================
   UI COMPONENTS
========================================================= */

function Modal({title,onClose,children,wide=false}){
  return (
    <div className="modal-backdrop">
      <div className={`modal ${wide ? "modal-wide" : ""}`}>
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          {onClose && (
            <button className="icon-btn" onClick={onClose}>✕</button>
          )}
        </div>
        <div className="modal-body">{children}</div>
        {onClose && (
          <div className="modal-close-action">
            <Button onClick={onClose}>✕ Đóng</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBar({icon,label,value,max=100}){
  return (
    <div className="stat">
      <div className="stat-top">
        <span>{icon} {label}</span>
        <b>{Math.round(value)}</b>
      </div>
      <div className="bar">
        <div
          className="bar-fill"
          style={{width:`${Math.max(0,Math.min(100,(Number(value)||0)/max*100))}%`}}
        />
      </div>
    </div>
  );
}

function Button({children,onClick,disabled=false,className=""}){
  return (
    <button
      className={`game-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* =========================================================
   APP
========================================================= */

function App(){

  const [game,setGame] = useState(()=>{
    try{
      const saved = localStorage.getItem(SAVE_KEY);
      if(saved) return normalizeState(JSON.parse(saved));
    }catch{}
    return createInitialState();
  });

  const [secondsLeft,setSecondsLeft] = useState(SLOT_SECONDS);
  const [autoTime,setAutoTime] = useState(true);

  const [overlay,setOverlay] = useState(null);
  const [toast,setToast] = useState("");

  const [quiz,setQuiz] = useState(null);
  const [quizFeedback,setQuizFeedback] = useState(null);

  const [saveCode,setSaveCode] = useState("");
  const [fashionCategory,setFashionCategory] = useState("Áo");
  const [playerNameDraft,setPlayerNameDraft] = useState("");

  const [audioOn,setAudioOn] = useState(false);

  const [onlineUser,setOnlineUser] = useState(null);
  const [onlinePlayers,setOnlinePlayers] = useState([]);
  const [onlineReady,setOnlineReady] = useState(false);
  const [onlineError,setOnlineError] = useState("");
  const [onlineCount,setOnlineCount] = useState(0);
  const onlineChannelRef = useRef(null);

  const advancingRef = useRef(false);
  const examAutoOpenedRef = useRef(null);
  const examDismissedRef = useRef(null);

  const currentTime = TIME_SLOTS[game.timeIndex];
  const nextTime =
    TIME_SLOTS[Math.min(game.timeIndex + 1,TIME_SLOTS.length - 1)];

  const currentExam = EXAM_SCHEDULE.find(
    exam=>exam.day===game.day && exam.timeIndex===game.timeIndex
  ) || null;

  const todayExam = EXAM_SCHEDULE.find(
    exam=>exam.day===game.day
  ) || null;

  const currentTitle =
    TITLES.find(t=>t.id===game.selectedTitle) || TITLES[0];

  const leaderboard = useMemo(()=>{
    const rows = [
      ...NPCS.map(n=>({
        id:n.id,
        name:n.name,
        icon:n.icon,
        points:game.npcCompetition[n.id] || 0,
        today:game.dailyCompetition[n.id] || 0,
        type:"NPC"
      })),
      ...(onlinePlayers.length
        ? onlinePlayers
            .filter(p=>p.id !== onlineUser?.id)
            .map(p=>({
              id:`online-${p.id}`,
              name:p.player_name || "Người chơi",
              icon:p.icon || "👩🏻‍🎓",
              points:Number(p.points)||0,
              today:Number(p.today)||0,
              type:"Online"
            }))
        : game.otherPlayers.map(p=>({
            id:`other-${p.id}`,
            name:p.name,
            icon:p.icon,
            points:p.points,
            today:p.today,
            type:"Người chơi (demo)"
          }))),
      {
        id:"player",
        name:game.playerName || "Bạn",
        icon:currentTitle.icon,
        points:game.competitionPoints,
        today:game.dailyCompetition.player,
        type:onlineReady ? "Bạn • Online" : "Bạn"
      }
    ];

    return rows.sort((a,b)=>b.points-a.points);
  },[game,currentTitle,onlinePlayers,onlineReady,onlineUser]);

  const ownedFashion = useMemo(
    ()=>FASHION.filter(item=>game.wardrobe.includes(item.id)),
    [game.wardrobe]
  );

  const visibleFashion = useMemo(
    ()=>FASHION.filter(item=>item.category===fashionCategory),
    [fashionCategory]
  );

  /* -----------------------------------------
     MULTIPLAYER ONLINE — REST / POLLING
     Không phụ thuộc @supabase/supabase-js.
  ----------------------------------------- */

  const loadOnlineLeaderboard = useCallback(async(accessToken)=>{
    if(!hasOnlineConfig) return [];

    const rows = await onlineRequest(
      `/rest/v1/${ONLINE_TABLE}?select=id,player_name,icon,points,today,day,time_index,updated_at&order=points.desc,updated_at.desc&limit=100`,
      {headers:onlineAuthHeaders(accessToken)}
    );

    return Array.isArray(rows) ? rows : [];
  },[]);

  const pushOnlineScore = useCallback(async(session)=>{
    if(!session?.access_token || !session?.user?.id || !game.playerName) return;

    const payload = {
      id:session.user.id,
      player_name:game.playerName.slice(0,20),
      icon:currentTitle.icon,
      points:Math.max(0,Math.round(game.competitionPoints)),
      today:Math.max(0,Math.round(game.dailyCompetition.player)),
      day:Math.max(1,Math.round(game.day)),
      time_index:Math.max(0,Math.round(game.timeIndex)),
      updated_at:new Date().toISOString()
    };

    const doPush = async(s)=>onlineRequest(
      `/rest/v1/${ONLINE_TABLE}?on_conflict=id`,
      {
        method:"POST",
        headers:{
          ...onlineAuthHeaders(s.access_token),
          Prefer:"resolution=merge-duplicates,return=minimal"
        },
        body:JSON.stringify(payload)
      }
    );

    try{
      await doPush(session);
    }catch(error){
      const refreshed=await refreshAnonymousSession(session);
      if(!refreshed) throw error;
      await doPush(refreshed);
      setOnlineUser(refreshed.user);
    }
  },[
    game.playerName,
    game.competitionPoints,
    game.dailyCompetition.player,
    game.day,
    game.timeIndex,
    currentTitle.icon
  ]);

  useEffect(()=>{
    let cancelled=false;
    let heartbeatTimer=null;
    let pollTimer=null;

    const init=async()=>{
      if(!hasOnlineConfig){
        setOnlineReady(false);
        setOnlineError("Chưa cấu hình Supabase. Game vẫn chơi được offline.");
        return;
      }

      try{
        let session=readOnlineSession();
        if(!session?.access_token || !session?.user?.id){
          session=await createAnonymousSession();
        }

        try{
          await loadOnlineLeaderboard(session.access_token);
        }catch{
          const refreshed=await refreshAnonymousSession(session);
          if(refreshed) session=refreshed;
          else session=await createAnonymousSession();
        }

        if(cancelled) return;

        setOnlineUser(session.user);
        setOnlineReady(true);
        setOnlineError("");

        const sync=async()=>{
          if(cancelled) return;
          const current=readOnlineSession() || session;
          try{
            await pushOnlineScore(current);
            const rows=await loadOnlineLeaderboard(current.access_token);
            setOnlinePlayers(rows);
            setOnlineError("");
          }catch(error){
            setOnlineError(error?.message || "Không đồng bộ được bảng online.");
          }
        };

        await sync();
        heartbeatTimer=setInterval(sync,ONLINE_HEARTBEAT_MS);
        pollTimer=setInterval(async()=>{
          if(cancelled) return;
          const current=readOnlineSession() || session;
          try{
            const rows=await loadOnlineLeaderboard(current?.access_token);
            setOnlinePlayers(rows);
          }catch{}
        },ONLINE_POLL_MS);
      }catch(error){
        if(cancelled) return;
        setOnlineReady(false);
        setOnlineError(error?.message || "Không kết nối được máy chủ online.");
      }
    };

    init();

    return()=>{
      cancelled=true;
      if(heartbeatTimer) clearInterval(heartbeatTimer);
      if(pollTimer) clearInterval(pollTimer);
    };
  },[loadOnlineLeaderboard,pushOnlineScore]);

  useEffect(()=>{
    if(!onlineReady || !onlineUser || !game.playerName) return;
    pushOnlineScore(readOnlineSession()).catch(()=>{});
  },[
    onlineReady,
    onlineUser,
    game.playerName,
    game.competitionPoints,
    game.dailyCompetition.player,
    game.day,
    game.timeIndex,
    currentTitle.icon,
    pushOnlineScore
  ]);

  /* -----------------------------------------
     SAVE
  ----------------------------------------- */

  useEffect(()=>{
    try{
      localStorage.setItem(SAVE_KEY,JSON.stringify(game));
    }catch{}
  },[game]);

  /* -----------------------------------------
     TOAST
  ----------------------------------------- */

  useEffect(()=>{
    if(!toast) return;

    const id = setTimeout(()=>setToast(""),2400);

    return ()=>clearTimeout(id);
  },[toast]);

  /* -----------------------------------------
     SOUND
  ----------------------------------------- */

  const beep = useCallback((freq=440,duration=.08)=>{
    if(!audioOn) return;

    try{
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = freq;

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(.04,ctx.currentTime);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    }catch{}
  },[audioOn]);

  /* -----------------------------------------
     UPDATE GAME
  ----------------------------------------- */

  const updateGame = useCallback((mutator)=>{
    setGame(prev=>{
      const next = clone(prev);
      mutator(next);
      return normalizeState(next);
    });
  },[]);

  const confirmPlayerName = useCallback(()=>{
    const name = playerNameDraft.trim().replace(/\s+/g," ");

    if(!name){
      setToast("✏️ Hãy nhập tên nhân vật.");
      return;
    }

    updateGame(g=>{
      g.playerName = name.slice(0,20);
    });

    setOverlay(null);
    setToast(`✨ Chào mừng ${name}!`);
  },[playerNameDraft,updateGame]);

  useEffect(()=>{
    if(!game.playerName && !game.isGameOver && overlay===null){
      setPlayerNameDraft("");
      setOverlay("nameSetup");
    }
  },[game.playerName,game.isGameOver,overlay]);

  const canDoMainActivity = useCallback(()=>{
    if(game.isGameOver) return false;
    if((game.mainActivityCount || 0) >= 2){
      setToast(
        `⏱️ Mốc ${currentTime} đã đủ 2 hoạt động chính. ` +
        `Sang mốc mới để hoạt động tiếp.`
      );
      return false;
    }
    return true;
  },[
    game.isGameOver,
    game.mainActivityCount,
    currentTime
  ]);

  /* -----------------------------------------
     NEXT DAY
  ----------------------------------------- */

  const finishDay = useCallback((grantFinalSlotNpcGain=false)=>{
    setGame(prev=>{
      const next = clone(prev);

      const finishedDay = next.day;

      // Mỗi mốc thời gian, NPC nhận điểm thi đua ngẫu nhiên.
      // Mốc cuối cùng được cộng ngay trước khi chuyển sang ngày mới.
      if(grantFinalSlotNpcGain){
        NPCS.forEach(npc=>{
          const gain = 1 + Math.floor(Math.random() * 5);
          next.npcCompetition[npc.id] =
            (next.npcCompetition[npc.id] || 0) + gain;
          next.dailyCompetition[npc.id] =
            (next.dailyCompetition[npc.id] || 0) + gain;
        });

        next.otherPlayers.forEach(player=>{
          const gain = Math.floor(Math.random() * 5);
          player.points += gain;
          player.today += gain;
        });
      }
      const before = next.dayStart || snapshotDay(next);

      const playerGain = Math.max(
        1,
        Math.min(
          10,
          Math.floor(
            (next.stats.study + next.stats.skill + next.stats.reputation) / 35
          )
        )
      );

      next.competitionPoints += playerGain;
      next.dailyCompetition.player += playerGain;

      const deltas = {
        study:next.stats.study-before.stats.study,
        money:next.stats.money-before.stats.money,
        friends:next.stats.friends-before.stats.friends,
        energy:next.stats.energy-before.stats.energy,
        mood:next.stats.mood-before.stats.mood,
        skill:next.stats.skill-before.stats.skill,
        competition:
          next.competitionPoints-before.competitionPoints
      };

      const diary = {
        id:`day-${finishedDay}-${Date.now()}`,
        day:finishedDay,
        event:next.dailyEvent?.title || "Không có sự kiện",
        summary:
          `Kiến thức ${signed(deltas.study)} • ` +
          `Tiền ${signed(deltas.money)}đ • ` +
          `Bạn bè ${signed(deltas.friends)} • ` +
          `Thi đua ${signed(deltas.competition)}`,
        deltas
      };

      next.diaryEntries = [
        diary,
        ...next.diaryEntries
      ].slice(0,60);

      if(finishedDay >= next.totalDays){
        next.isGameOver = true;
        return normalizeState(next);
      }

      next.day = finishedDay + 1;
      next.timeIndex = 0;

      next.dailyOralCheckDone = false;
      next.dailyQuizDone = false;
      next.dailyQuizCount = 0;
      next.dailyOralCheckCount = 0;
      next.mainActivityUsed = false;
      next.mainActivityLabel = null;
      next.mainActivityCount = 0;
      next.mainActivityLabels = [];

      next.dailyCompetition = emptyDailyCompetition();
      next.otherPlayers = next.otherPlayers.map(player=>({
        ...player,
        today:0
      }));

      const ev = pickDailyEvent(next.lastEventId);

      next.dayStart = snapshotDay(next);
      next.dailyEvent = eventData(ev);
      next.lastEventId = ev.id;

      ev.apply(next);

      return normalizeState(next);
    });

    setSecondsLeft(SLOT_SECONDS);
    beep(880,.14);
  },[beep]);

  /* -----------------------------------------
     ADVANCE TIME
  ----------------------------------------- */

  const advanceTime = useCallback(()=>{
    if(advancingRef.current || game.isGameOver) return;

    advancingRef.current = true;

    if(game.timeIndex >= TIME_SLOTS.length - 1){
      finishDay(true);
    }else{
      setGame(prev=>{
        const next = clone(prev);

        // Mỗi lần đồng hồ chuyển sang mốc mới, tất cả NPC đều
        // nhận thêm điểm thi đua ngẫu nhiên (1–5 điểm).
        NPCS.forEach(npc=>{
          const gain = 1 + Math.floor(Math.random() * 5);
          next.npcCompetition[npc.id] =
            (next.npcCompetition[npc.id] || 0) + gain;
          next.dailyCompetition[npc.id] =
            (next.dailyCompetition[npc.id] || 0) + gain;
        });

        next.otherPlayers.forEach(player=>{
          const gain = Math.floor(Math.random() * 5);
          player.points += gain;
          player.today += gain;
        });

        next.timeIndex += 1;

        // Mốc mới = 2 lượt hoạt động chính mới.
        // Phải reset cả count + labels, không chỉ cờ boolean,
        // nếu không normalizeState() sẽ khóa hoạt động ở mốc tiếp theo.
        next.mainActivityCount = 0;
        next.mainActivityUsed = false;
        next.mainActivityLabel = null;
        next.mainActivityLabels = [];

        return normalizeState(next);
      });
      setSecondsLeft(SLOT_SECONDS);
      beep(700,.07);
    }

    setTimeout(()=>{ advancingRef.current = false; },50);
  },[game.isGameOver,game.timeIndex,finishDay,beep]);

  /* -----------------------------------------
     TIMER
  ----------------------------------------- */

  useEffect(()=>{
    // Quiz thường không dừng đồng hồ. Chỉ các kỳ kiểm tra chính thức mới khóa thời gian.
    const quizTimePaused = overlay === "exam" || overlay === "nameSetup";

    if(
      !autoTime ||
      game.isGameOver ||
      quizTimePaused
    ){
      return;
    }

    const timer = setInterval(()=>{
      setSecondsLeft(prev=>{
        // Bảo vệ thêm cho tick đã xếp hàng ngay lúc modal vừa mở.
        if(overlay === "exam" || overlay === "nameSetup") return prev;

        if(prev > 1){
          return prev - 1;
        }

        advanceTime();
        return SLOT_SECONDS;
      });
    },1000);

    return ()=>clearInterval(timer);
  },[
    autoTime,
    game.isGameOver,
    game.timeIndex,
    overlay,
    advanceTime
  ]);

  /* -----------------------------------------
     DAY CHANGE TOAST
  ----------------------------------------- */

  const previousDay = useRef(game.day);

  useEffect(()=>{
    if(game.day !== previousDay.current){
      if(game.day > 1){
        setToast(
          `📔 Nhật ký ngày ${game.day-1} đã chốt • ` +
          `${game.dailyEvent?.icon || "🎲"} ${game.dailyEvent?.title || "Ngày mới"}`
        );
      }
      previousDay.current = game.day;
    }
  },[game.day,game.dailyEvent]);

  /* -----------------------------------------
     GAME OVER
  ----------------------------------------- */

  useEffect(()=>{
    if(game.isGameOver){
      setOverlay("ending");
      setAutoTime(false);
    }
  },[game.isGameOver]);

  /* =========================================================
     ACTIONS
  ========================================================= */

  const startQuiz = useCallback((mode="quick",cert=null,exam=null)=>{
    if(mode==="quick") {
      const count = Number(game.dailyQuizCount) || 0;
      if(count >= 7) {
        setToast("📚 Bạn đã dùng hết 7 lượt quiz hôm nay. Sang ngày mới để làm tiếp.");
        return;
      }
    }

    if(mode==="oral") {
      const count = Number(game.dailyOralCheckCount) || 0;
      if(count >= 4) {
        setToast("🧑‍🏫 Bạn đã dùng hết 4 lượt kiểm tra miệng hôm nay. Sang ngày mới để làm tiếp.");
        return;
      }
    }

    if(mode==="exam") {
      if(!exam) {
        setToast("📝 Không xác định được kỳ thi.");
        return;
      }

      if(game.examResults?.[exam.id]) {
        setToast(`✅ ${exam.title} đã hoàn thành.`);
        return;
      }
    }else if(mode!=="quick" && mode!=="oral" && !canDoMainActivity()){
      return;
    }

    let questions;

    if(mode==="cert"){
      questions = cert.questions.map((q,i)=>({
        ...q,
        id:`${cert.id}-${i}`
      }));
    }else if(mode==="exam"){
      questions = getExamQuestions(exam);
    }else if(mode==="oral"){
      const recent = new Set(game.quizHistory || []);
      const fresh = QUIZ_BANK.filter(q=>!recent.has(q.id));
      questions = shuffle(fresh.length >= 3 ? fresh : QUIZ_BANK).slice(0,3);
    }else{
      const recent = new Set(game.quizHistory || []);
      let fresh = QUIZ_BANK.filter(q=>!recent.has(q.id));
      if(fresh.length < 10) fresh = QUIZ_BANK;
      questions = shuffle(fresh).slice(0,10);
    }

    if(!questions.length){
      setToast("❌ Không tìm thấy bộ đề.");
      return;
    }

    updateGame(g=>{
      if(mode!=="quick" && mode!=="oral"){
        g.mainActivityCount = Math.min(2, (g.mainActivityCount || 0) + 1);
        g.mainActivityLabel =
          mode==="exam" ? `📝 ${exam.title}` :
          mode==="cert" ? `Thi ${cert?.name || "chứng chỉ"}` :
          "Hoạt động";
        g.mainActivityLabels = [
          ...(g.mainActivityLabels || []),
          g.mainActivityLabel
        ].slice(0,2);
        g.mainActivityUsed = g.mainActivityCount >= 2;
      }

      if(mode==="oral"){
        g.dailyOralCheckCount = Math.min(4, (g.dailyOralCheckCount || 0) + 1);
        g.dailyOralCheckDone = g.dailyOralCheckCount >= 4;
        g.oralChecksDone++;
      }

      if(mode==="quick"){
        g.dailyQuizCount = Math.min(7, (g.dailyQuizCount || 0) + 1);
        g.dailyQuizDone = g.dailyQuizCount >= 7;
        g.studyActions++;
        addStat(g,"energy",-3);
      }
    });

    setQuiz({
      mode,
      certId:cert?.id || null,
      certName:cert?.name || null,
      examId:exam?.id || null,
      examTitle:exam?.title || null,
      questions,
      index:0,
      correct:0,
      wrong:0
    });

    if(mode==="exam") {
      setAutoTime(false);
      examDismissedRef.current = null;
    }

    setQuizFeedback(null);
    setOverlay(mode==="exam" ? "exam" : mode==="oral" ? "oral" : mode==="cert" ? "certExam" : "quiz");
  },[
    canDoMainActivity,
    game.dailyOralCheckCount,
    game.dailyQuizCount,
    game.quizHistory,
    game.examResults,
    updateGame
  ]);

  /* -----------------------------------------
     TỰ ĐỘNG MỞ KỲ THI TẠI ĐÚNG MỐC
     (đặt sau startQuiz để tránh lỗi TDZ / trắng màn hình)
  ----------------------------------------- */

  useEffect(()=>{
    if(!currentExam || game.isGameOver) return;

    const examKey = `${currentExam.day}-${currentExam.timeIndex}`;

    if(examAutoOpenedRef.current === examKey) return;
    if(game.examResults?.[currentExam.id]) return;
    if(examDismissedRef.current === examKey) return;

    examAutoOpenedRef.current = examKey;
    startQuiz("exam",null,currentExam);
  },[currentExam,game.isGameOver,game.examResults,startQuiz]);

  const answerQuiz = useCallback((choiceIndex)=>{
    if(!quiz || quizFeedback) return;

    const question = quiz.questions[quiz.index];
    const correct = choiceIndex === question.answer;

    if(correct){
      updateGame(g=>{
        addAchievement(g,5);
        addKnowledge(g,5);
      });
      beep(760,.08);
    }else{
      beep(180,.13);
      updateGame(g=>{
        addAchievement(g,-3);
        addKnowledge(g,-3);
      });
    }

    updateGame(g=>{
      g.quizHistory = [...(g.quizHistory || []), question.id].filter(Boolean).slice(-300);
    });

    setQuizFeedback({
      correct,
      selected:choiceIndex,
      explanation:question.explanation
    });

    setQuiz(q=>({
      ...q,
      correct:q.correct + (correct ? 1 : 0),
      wrong:q.wrong + (correct ? 0 : 1)
    }));
  },[quiz,quizFeedback,beep,updateGame]);

  const nextQuizQuestion = useCallback(()=>{
    if(!quiz) return;

    const finalCorrect = quiz.correct;

    if(quiz.index >= quiz.questions.length - 1){

      if(quiz.mode==="exam"){
        const exam = EXAM_SCHEDULE.find(e=>e.id===quiz.examId);

        updateGame(g=>{
          if(quiz.examId){
            g.examResults = g.examResults || {};
            g.examResults[quiz.examId] = {
              title:quiz.examTitle || exam?.title || "Kỳ thi",
              correct:finalCorrect,
              wrong:quiz.wrong,
              total:quiz.questions.length,
              competition:finalCorrect * 5,
              day:g.day
            };
          }
        });

        setToast(
          `🎓 ${exam?.title || "Kỳ thi"}: ${finalCorrect}/${quiz.questions.length} câu đúng • +${finalCorrect*5} điểm thi đua`
        );
        setAutoTime(true);
      }

      if(quiz.mode==="quick"){
        updateGame(g=>{
          g.dailyQuizDone = (g.dailyQuizCount || 0) >= 7;
          if(finalCorrect===10){
            addStat(g,"study",5);
            addStat(g,"skill",2);
          }else if(finalCorrect>=8){
            addStat(g,"study",4);
          }else if(finalCorrect>=6){
            addStat(g,"study",2);
          }else if(finalCorrect>=4){
            addStat(g,"study",1);
          }
        });

        setToast(
          `📚 Hoàn thành quiz: ${finalCorrect}/10 câu đúng`
        );
      }

      if(quiz.mode==="oral"){
        updateGame(g=>{
          if(finalCorrect===3){
            addStat(g,"study",5);
            addStat(g,"reputation",4);
          }else if(finalCorrect===2){
            addStat(g,"study",2);
            addStat(g,"reputation",2);
          }else if(finalCorrect===0){
            addStat(g,"mood",-4);
            addStat(g,"reputation",-2);
          }
        });

        setToast(
          `🧑‍🏫 Kiểm tra miệng: ${finalCorrect}/3 câu đúng`
        );
      }

      if(quiz.mode==="cert"){
        const cert = CERTS.find(c=>c.id===quiz.certId);

        if(cert){
          if(finalCorrect>=2){
            updateGame(g=>{
              if(!g.certificates.includes(cert.id)){
                g.certificates.push(cert.id);
              }

              addStat(g,"skill",3);
            });

            setToast(`🎓 Đậu ${cert.name}!`);
          }else{
            setToast(`❌ Chưa đạt ${cert.name}. Cần ít nhất 2/3.`);
          }
        }
      }

      setQuiz(null);
      setQuizFeedback(null);
      setOverlay(null);
      return;
    }

    setQuiz(q=>({
      ...q,
      index:q.index+1
    }));

    setQuizFeedback(null);
  },[quiz,updateGame]);

  const buyFashion = useCallback((item)=>{
    if(game.wardrobe.includes(item.id)){
      setToast("👕 Bạn đã sở hữu món này.");
      return;
    }

    if(game.stats.money < item.price){
      setToast("💸 Không đủ tiền.");
      return;
    }

    updateGame(g=>{
      g.wardrobe.push(item.id);
      addMoney(g,-item.price);

      Object.entries(item.bonus || {}).forEach(([key,val])=>{
        if(key==="energy"){
          addStat(g,"energy",val);
        }else if(key==="mood"){
          addStat(g,"mood",val);
        }else if(key==="study"){
          addStat(g,"study",val);
        }else if(key==="friends"){
          addStat(g,"friends",val);
        }else if(key==="love"){
          addStat(g,"love",val);
        }else if(key==="reputation"){
          addStat(g,"reputation",val);
        }else if(key==="skill"){
          addStat(g,"skill",val);
        }
      });
    });

    setToast(`🛍️ Đã mua ${item.name}!`);
  },[game,updateGame]);

  const equipFashion = useCallback((item)=>{
    updateGame(g=>{
      const map = {
        "Áo":"shirt",
        "Quần":"pants",
        "Giày":"shoes",
        "Balo":"bag",
        "Phụ kiện":"accessory",
        "Tóc":"hair"
      };

      const slot = map[item.category];

      if(slot){
        g.outfit[slot] = item.id;
      }
    });

    setToast(`✨ Đã mặc ${item.name}`);
  },[updateGame]);

  const unequipAccessory = useCallback(()=>{
    updateGame(g=>{
      g.outfit.accessory = null;
    });

    setToast("✨ Đã tháo phụ kiện.");
  },[updateGame]);

  const buyAsset = useCallback((asset)=>{
    if(game.assets.includes(asset.id)){
      setToast("🏠 Bạn đã sở hữu tài sản này.");
      return;
    }

    if(game.stats.money < asset.price){
      setToast("💸 Không đủ tiền mua.");
      return;
    }

    updateGame(g=>{
      g.assets.push(asset.id);
      addMoney(g,-asset.price);

      Object.entries(asset.bonus || {}).forEach(([key,val])=>{
        if(key === "knowledge") addKnowledge(g,val);
        else if(key === "money") addMoney(g,val);
        else addStat(g,key,val);
      });
    });

    setToast(`🏠 Đã mua ${asset.name}!`);
  },[game,updateGame]);

  const buyFood = useCallback((item)=>{
    if(game.stats.money < item.price){
      setToast("💸 Không đủ tiền.");
      return;
    }

    updateGame(g=>{
      addMoney(g,-item.price);

      if(item.effect){
        Object.entries(item.effect).forEach(([key,val])=>{
          addStat(g,key,val);
        });
      }
    });

    setToast(`🍱 Đã mua ${item.name}.`);
  },[game.stats.money,updateGame]);

  const doJob = useCallback((job)=>{
    if(!job.can(game)){
      setToast("🔒 Chưa đủ điều kiện.");
      return;
    }

    if(game.stats.energy < job.energy){
      setToast("⚡ Không đủ năng lượng.");
      return;
    }

    if(!canDoMainActivity()) return;

    updateGame(g=>{
      if((g.mainActivityCount || 0) >= 2) return;
      job.apply(g);
      g.jobActions++;
      g.mainActivityCount = Math.min(2, (g.mainActivityCount || 0) + 1);
      g.mainActivityLabel = `Việc làm: ${job.name}`;
      g.mainActivityLabels = [...(g.mainActivityLabels || []), g.mainActivityLabel].slice(0,2);
      g.mainActivityUsed = g.mainActivityCount >= 2;
    });

    setOverlay(null);
    setToast(
      `💼 ${job.name}: +${money(job.pay)}`
    );
  },[game,updateGame]);

  const interactNPC = useCallback((npc)=>{
    if(!canDoMainActivity()) return;

    if(game.stats.energy < 3){
      setToast("⚡ Bạn đang quá mệt.");
      return;
    }

    updateGame(g=>{
      if((g.mainActivityCount || 0) >= 2) return;
      addStat(g,"energy",-3);
      npc.apply(g);
      g.mainActivityCount = Math.min(2, (g.mainActivityCount || 0) + 1);
      g.mainActivityLabel = npc.action;
      g.mainActivityLabels = [...(g.mainActivityLabels || []), g.mainActivityLabel].slice(0,2);
      g.mainActivityUsed = g.mainActivityCount >= 2;
    });

    setToast(`${npc.icon} ${npc.name}: ${npc.action}`);
  },[game.stats.energy,canDoMainActivity,updateGame]);

  const restAtHome = useCallback(()=>{
    if(!canDoMainActivity()) return;

    updateGame(g=>{
      if((g.mainActivityCount || 0) >= 2) return;
      addStat(g,"energy",25);
      addStat(g,"hp",5);
      addStat(g,"mood",5);
      g.mainActivityCount = Math.min(2, (g.mainActivityCount || 0) + 1);
      g.mainActivityLabel = "Nghỉ ngơi";
      g.mainActivityLabels = [...(g.mainActivityLabels || []), g.mainActivityLabel].slice(0,2);
      g.mainActivityUsed = g.mainActivityCount >= 2;
    });

    setToast("🛏️ Nghỉ ngơi giúp bạn hồi phục.");
  },[canDoMainActivity,updateGame]);

  const useItem = useCallback((id)=>{
    updateGame(g=>{
      const item = g.bag.find(x=>x.id===id);

      if(!item || item.count<=0) return;

      if(id==="math_note"){
        addStat(g,"study",8);
        item.count--;
      }

      if(item.count<=0){
        g.bag = g.bag.filter(x=>x.id!==id);
      }
    });

    setToast("🎒 Đã sử dụng vật phẩm.");
  },[updateGame]);

  const startCertificate = useCallback((cert)=>{
    if(game.certificates.includes(cert.id)){
      setToast("🎓 Bạn đã có chứng chỉ này.");
      return;
    }

    if(game.stats.skill < cert.req){
      setToast(`🔒 Cần kỹ năng ≥ ${cert.req}.`);
      return;
    }

    if(game.stats.money < cert.fee){
      setToast("💸 Không đủ lệ phí.");
      return;
    }

    if(!canDoMainActivity()) return;

    updateGame(g=>{
      addMoney(g,-cert.fee);
    });

    startQuiz("cert",cert);
  },[game,updateGame,startQuiz,canDoMainActivity]);

  /* =========================================================
     SAVE FUNCTIONS
  ========================================================= */

  const createSaveCode = ()=>{
    const code = encodeSaveCode(game);
    setSaveCode(code);
    setToast("💾 Đã tạo mã lưu game.");
  };

  const loadSaveCode = ()=>{
    try{
      const loaded = normalizeState(decodeSaveCode(saveCode));

      setGame(loaded);
      setSecondsLeft(SLOT_SECONDS);
      setOverlay(null);
      setToast("✅ Đã nạp game thành công.");
    }catch{
      setToast("❌ Mã lưu không hợp lệ.");
    }
  };

  const exportJSON = ()=>{
    const blob = new Blob(
      [JSON.stringify(game,null,2)],
      {type:"application/json"}
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "thanh-xuan-ruc-ro-save.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const importJSON = (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = ()=>{
      try{
        const loaded = normalizeState(
          JSON.parse(reader.result)
        );

        setGame(loaded);
        setSecondsLeft(SLOT_SECONDS);
        setOverlay(null);
        setToast("✅ Đã nhập file save.");
      }catch{
        setToast("❌ File save không hợp lệ.");
      }
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const restart = ()=>{
    localStorage.removeItem(SAVE_KEY);

    const fresh = createInitialState();

    setGame(fresh);
    setSecondsLeft(SLOT_SECONDS);
    setAutoTime(true);
    setOverlay(null);
    setQuiz(null);
    setQuizFeedback(null);
    setSaveCode("");
    setPlayerNameDraft("");
    examAutoOpenedRef.current = null;
    examDismissedRef.current = null;

    setToast("🌱 Hành trình mới bắt đầu!");
  };

  /* =========================================================
     QUICK ACTIVITIES
  ========================================================= */

  const quickActivities = [
    {
      icon:"📚",
      title:"Quiz 10 câu",
      desc:"Tối đa 7 lượt/ngày • chống lặp câu",
      action:()=>startQuiz("quick")
    },
    {
      icon:"🧑‍🏫",
      title:"Kiểm tra miệng",
      desc:"3 câu / lượt • tối đa 4 lượt/ngày",
      action:()=>startQuiz("oral"),
      disabled:false
    },
    {
      icon:"🍱",
      title:"Căn tin",
      desc:"Mua đồ ăn",
      action:()=>setOverlay("canteen")
    },
    {
      icon:"💼",
      title:"Việc làm",
      desc:"Kiếm tiền",
      action:()=>setOverlay("jobs")
    },
    {
      icon:"🎓",
      title:"Chứng chỉ",
      desc:"Mở nghề mới",
      action:()=>setOverlay("certs")
    },
    {
      icon:"👕",
      title:"Tủ đồ",
      desc:`${game.wardrobe.length} món`,
      action:()=>setOverlay("fashion")
    },
    {
      icon:"🏠",
      title:"Tài sản",
      desc:`${game.assets.length} tài sản`,
      action:()=>setOverlay("assets")
    },
    {
      icon:"🛏️",
      title:"Nghỉ ngơi",
      desc:"+25 năng lượng",
      action:restAtHome
    },
  ];

  /* =========================================================
     RENDER CHARACTER
  ========================================================= */

  const getFashion = (id)=>FASHION.find(x=>x.id===id);

  const fashionVisual = (id, slot)=>{
    const item = getFashion(id);
    if(!item) return {kind:slot, tone:"default", detail:""};

    const idv = item.id;
    if(slot === "shirt") {
      let tone = "white";
      if(/black|leather/.test(idv)) tone = "black";
      else if(/blue|denim|jersey/.test(idv)) tone = "blue";
      else if(/pink/.test(idv)) tone = "pink";
      else if(/green/.test(idv)) tone = "mint";
      else if(/red/.test(idv)) tone = "red";
      else if(/yellow/.test(idv)) tone = "yellow";
      else if(/gray/.test(idv)) tone = "gray";
      else if(/cream/.test(idv)) tone = "cream";
      const detail = /hoodie/.test(idv) ? "hoodie" : /jacket/.test(idv) ? "jacket" : /varsity/.test(idv) ? "varsity" : /cardigan/.test(idv) ? "cardigan" : /sweater/.test(idv) ? "sweater" : /jersey/.test(idv) ? "jersey" : /tee/.test(idv) ? "tee" : "shirt";
      return {kind:"shirt",tone,detail};
    }

    if(slot === "pants") {
      const tone = /white/.test(idv) ? "white" : /gray/.test(idv) ? "gray" : /green/.test(idv) ? "green" : /beige|kaki/.test(idv) ? "beige" : /blue/.test(idv) ? "blue" : "black";
      const detail = /skirt/.test(idv) ? "skirt" : /short/.test(idv) ? "short" : /wide/.test(idv) ? "wide" : /cargo/.test(idv) ? "cargo" : "pants";
      return {kind:"bottom",tone,detail};
    }

    if(slot === "shoes") {
      const tone = /red/.test(idv) ? "red" : /pink/.test(idv) ? "pink" : /black|loafer|boots/.test(idv) ? "black" : "white";
      return {kind:"shoes",tone,detail:/boots/.test(idv)?"boots":/loafer/.test(idv)?"loafer":"sneaker"};
    }

    if(slot === "hair") {
      const tone = /brown/.test(idv) ? "brown" : /blue/.test(idv) ? "blue" : /pink/.test(idv) ? "pink" : "black";
      const detail = /long/.test(idv) ? "long" : /short/.test(idv) ? "short" : /wavy/.test(idv) ? "wavy" : "long";
      return {kind:"hair",tone,detail};
    }

    return {kind:slot,tone:"default",detail:""};
  };

  const renderOutfitAvatar = (size="large")=>{
    const shirt = fashionVisual(game.outfit.shirt,"shirt");
    const bottom = fashionVisual(game.outfit.pants,"pants");
    const shoes = fashionVisual(game.outfit.shoes,"shoes");
    const hair = fashionVisual(game.outfit.hair,"hair");
    return (
      <div className={`outfit-avatar outfit-avatar-${size}`}>
        <div className={`avatar-hair hair-${hair.tone} hair-${hair.detail}`} />
        <div className="avatar-head">
          <span className="avatar-ear avatar-ear-left" />
          <span className="avatar-ear avatar-ear-right" />
          <span className="avatar-face">
            <span className="avatar-brow avatar-brow-left" />
            <span className="avatar-brow avatar-brow-right" />
            <span className="avatar-eye avatar-eye-left"><i /></span>
            <span className="avatar-eye avatar-eye-right"><i /></span>
            <span className="avatar-nose" />
            <span className="avatar-mouth"><i /></span>
            <span className="avatar-blush avatar-blush-left" />
            <span className="avatar-blush avatar-blush-right" />
          </span>
        </div>
        <div className={`avatar-neck neck-${shirt.tone}`} />
        <div className={`avatar-shirt shirt-${shirt.tone} shirt-${shirt.detail}`}>
          <span className="shirt-collar" />
          <span className="shirt-front-detail" />
        </div>
        <div className={`avatar-bottom bottom-${bottom.tone} bottom-${bottom.detail}`} />
        <div className="avatar-legs">
          <span className={`avatar-leg leg-${bottom.tone}`} />
          <span className={`avatar-leg leg-${bottom.tone}`} />
        </div>
        <div className={`avatar-shoes shoes-${shoes.tone} shoes-${shoes.detail}`}>
          <span />
          <span />
        </div>
        {game.outfit.bag && <div className="avatar-bag">🎒</div>}
        {game.outfit.accessory && <div className="avatar-accessory">{getFashion(game.outfit.accessory)?.icon}</div>}
      </div>
    );
  };

  const characterParts = [
    getFashion(game.outfit.hair),
    getFashion(game.outfit.shirt),
    getFashion(game.outfit.pants),
    getFashion(game.outfit.shoes),
    getFashion(game.outfit.bag),
    getFashion(game.outfit.accessory)
  ].filter(Boolean);

  /* =========================================================
     SCENES
  ========================================================= */

  const renderClass = ()=>(
    <>
      <div className="event-card">
        <div className="event-icon">
          {game.dailyEvent?.icon || "🎲"}
        </div>

        <div>
          <div className="event-title">
            {game.dailyEvent?.title || "Ngày mới"}
          </div>

          <div className="muted">
            {game.dailyEvent?.text}
          </div>

          <div className="event-result">
            {game.dailyEvent?.result}
          </div>
        </div>
      </div>

      <div className="section-title">🏫 Hoạt động lớp học</div>

      <div className="activity-grid">
        {quickActivities.slice(0,4).map((a,i)=>(
          <button
            key={i}
            className="activity-card"
            onClick={a.action}
            disabled={a.disabled}
          >
            <span className="activity-icon">{a.icon}</span>
            <b>{a.title}</b>
            <small>{a.desc}</small>
          </button>
        ))}
      </div>

      <div className="section-title">👥 Bạn bè</div>

      <div className="npc-grid">
        {NPCS.map(npc=>(
          <div className="npc-card" key={npc.id}>
            <div className="npc-avatar">{npc.icon}</div>

            <div className="npc-info">
              <b>{npc.name}</b>
              <small>{npc.desc}</small>

              <div className="relationship">
                Quan hệ {game.relationships[npc.id] || 0}/100
              </div>

              <Button onClick={()=>interactNPC(npc)}>
                {npc.action}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderCanteen = ()=> {
    const foods = [
      {
        name:"Nước suối",
        icon:"💧",
        price:5000,
        effect:{energy:8}
      },
      {
        name:"Sữa",
        icon:"🥛",
        price:12000,
        effect:{energy:12,study:2}
      },
      {
        name:"Cơm",
        icon:"🍚",
        price:25000,
        effect:{energy:20,mood:5}
      },
      {
        name:"Bánh ngọt",
        icon:"🍰",
        price:18000,
        effect:{mood:8}
      },
      {
        name:"Trà sữa",
        icon:"🧋",
        price:30000,
        effect:{mood:10,energy:5}
      },
      {
        name:"Hamburger",
        icon:"🍔",
        price:35000,
        effect:{energy:25,mood:5}
      },
      {name:"Mì cay",icon:"🍜",price:40000,effect:{energy:22,mood:7}},{name:"Cơm gà",icon:"🍗",price:45000,effect:{energy:28,study:2}},{name:"Pizza",icon:"🍕",price:55000,effect:{energy:25,mood:10}},{name:"Sinh tố",icon:"🥤",price:28000,effect:{energy:15,mood:6}},{name:"Bánh mì",icon:"🥖",price:18000,effect:{energy:14}},{name:"Matcha latte",icon:"🍵",price:38000,effect:{mood:8,study:3}},{name:"Cơm cuộn",icon:"🍙",price:32000,effect:{energy:18,study:2}},{name:"Kem",icon:"🍦",price:22000,effect:{mood:12}}
    ];

    return (
      <div className="card">
        <div className="section-title">🍱 Căn tin trường</div>

        <div className="shop-grid">
          {foods.map(item=>(
            <div className="shop-card" key={item.name}>
              <div className="shop-icon">{item.icon}</div>
              <b>{item.name}</b>
              <small>{money(item.price)}</small>

              <Button onClick={()=>buyFood(item)}>
                Mua
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderJobs = ()=>(
    <div className="card">
      <div className="section-title">💼 Việc làm thêm</div>

      <div className="job-grid">
        {JOBS.map(job=>{
          const available = job.can(game);
          const enoughEnergy = game.stats.energy >= job.energy;

          return (
            <div className={`job-card ${!available ? "locked" : ""}`} key={job.id}>
              <div className="job-icon">{job.icon}</div>

              <div className="job-content">
                <b>{job.name}</b>
                <small>{job.desc}</small>

                <div className="job-meta">
                  💰 {money(job.pay)}
                  &nbsp; ⚡ -{job.energy}
                </div>

                <Button
                  disabled={!available || !enoughEnergy}
                  onClick={()=>doJob(job)}
                >
                  {!available ? "🔒 Chưa đủ điều kiện" :
                   !enoughEnergy ? "⚡ Thiếu năng lượng" :
                   "Nhận việc"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCerts = ()=>(
    <div className="card">
      <div className="section-title">🎓 Trung tâm chứng chỉ</div>

      <div className="cert-grid">
        {CERTS.map(cert=>{
          const owned = game.certificates.includes(cert.id);
          const enoughSkill = game.stats.skill >= cert.req;
          const enoughMoney = game.stats.money >= cert.fee;

          return (
            <div className={`cert-card ${owned ? "owned" : ""}`} key={cert.id}>
              <div className="cert-icon">{cert.icon}</div>
              <b>{cert.name}</b>
              <small>{cert.desc}</small>

              <div>
                Kỹ năng: <b>{cert.req}</b>
              </div>

              <div>
                Lệ phí: <b>{money(cert.fee)}</b>
              </div>

              <Button
                disabled={owned || !enoughSkill || !enoughMoney}
                onClick={()=>startCertificate(cert)}
              >
                {owned ? "✅ Đã có" :
                 !enoughSkill ? "🔒 Thiếu kỹ năng" :
                 !enoughMoney ? "💸 Thiếu tiền" :
                 "📝 Thi"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAssets = ()=>(
    <div className="card">
      <div className="section-title">🏠 Cửa hàng tài sản</div>

      <div className="asset-grid">
        {ASSETS.map(asset=>{
          const owned = game.assets.includes(asset.id);

          return (
            <div className={`asset-card ${owned ? "owned" : ""}`} key={asset.id}>
              <div className="asset-icon">{asset.icon}</div>
              <b>{asset.name}</b>
              <small>{asset.desc}</small>
              <strong>{money(asset.price)}</strong>

              <Button
                disabled={owned || game.stats.money < asset.price}
                onClick={()=>buyAsset(asset)}
              >
                {owned ? "✅ Đã sở hữu" :
                 game.stats.money < asset.price ? "💸 Thiếu tiền" :
                 "Mua"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFashion = ()=>(
    <div className="fashion-page">

      <div className="fashion-preview">
        <div className="section-title">👕 Nhân vật của bạn</div>

        <div className="character female-character">
          {renderOutfitAvatar("large")}
          <div className="female-outfit-caption">
            {getFashion(game.outfit.hair)?.name || "Tóc tự nhiên"}
          </div>
        </div>

        <div className="outfit-list">
          {[
            ["Áo",game.outfit.shirt],
            ["Quần",game.outfit.pants],
            ["Giày",game.outfit.shoes],
            ["Balo",game.outfit.bag],
            ["Tóc",game.outfit.hair],
            ["Phụ kiện",game.outfit.accessory]
          ].map(([label,id])=>(
            <div className="outfit-row" key={label}>
              <span>{label}</span>
              <b>
                {id
                  ? getFashion(id)?.name || "Không có"
                  : "Không mặc"}
              </b>
            </div>
          ))}

          {game.outfit.accessory && (
            <Button onClick={unequipAccessory}>
              Tháo phụ kiện
            </Button>
          )}
        </div>
      </div>

      <div className="fashion-shop">

        <div className="fashion-head">
          <div>
            <div className="section-title">🛍️ Cửa hàng thời trang</div>
            <small>
              Đã sở hữu {game.wardrobe.length}/{FASHION.length} món
            </small>
          </div>

          <div className="money-pill">
            💰 {money(game.stats.money)}
          </div>
        </div>

        <div className="category-tabs">
          {FASHION_CATEGORIES.map(cat=>(
            <button
              key={cat}
              className={fashionCategory===cat ? "active" : ""}
              onClick={()=>setFashionCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="fashion-grid">
          {visibleFashion.map(item=>{
            const owned = game.wardrobe.includes(item.id);

            const slotMap = {
              "Áo":"shirt",
              "Quần":"pants",
              "Giày":"shoes",
              "Balo":"bag",
              "Phụ kiện":"accessory",
              "Tóc":"hair"
            };

            const equipped =
              game.outfit[slotMap[item.category]] === item.id;

            return (
              <div
                className={`fashion-card ${
                  owned ? "owned" : ""
                } ${equipped ? "equipped" : ""}`}
                key={item.id}
              >
                <div className="fashion-icon">
                  {item.icon}
                </div>

                <b>{item.name}</b>
                <small>{item.desc}</small>

                <div className="fashion-bonus">
                  {Object.entries(item.bonus || {}).map(([k,v])=>(
                    <span key={k}>
                      +{v} {k}
                    </span>
                  ))}
                </div>

                <strong>
                  {item.price===0 ? "Miễn phí" : money(item.price)}
                </strong>

                {!owned ? (
                  <Button
                    disabled={game.stats.money < item.price}
                    onClick={()=>buyFashion(item)}
                  >
                    🛍️ Mua
                  </Button>
                ) : (
                  <Button
                    className={equipped ? "success" : ""}
                    onClick={()=>equipFashion(item)}
                  >
                    {equipped ? "✅ Đang mặc" : "👕 Mặc"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderHome = ()=>(
    <div className="home-grid">
      <div className="card home-card">
        <div className="big-icon">🛏️</div>
        <h2>Phòng ngủ</h2>
        <p>
          Nghỉ ngơi sau một ngày học tập và làm việc.
        </p>

        <Button onClick={restAtHome}>
          🛏️ Nghỉ ngơi +25 năng lượng
        </Button>

        <Button onClick={()=>setOverlay("diary")}>
          📔 Xem nhật ký
        </Button>
      </div>

      <div className="card">
        <div className="section-title">🏆 Thành tích hôm nay</div>

        <div className="mini-stat">
          📚 Lần học: <b>{game.studyActions}</b>
        </div>

        <div className="mini-stat">
          💼 Lần làm việc: <b>{game.jobActions}</b>
        </div>

        <div className="mini-stat">
          👕 Thời trang: <b>{game.wardrobe.length}</b>
        </div>

        <div className="mini-stat">
          🏠 Tài sản: <b>{game.assets.length}</b>
        </div>
      </div>
    </div>
  );

  /* =========================================================
     MAIN SCENE
  ========================================================= */

  const renderLocation = ()=>{
    if(game.location==="class") return renderClass();
    if(game.location==="canteen") return renderCanteen();
    if(game.location==="jobs") return renderJobs();
    if(game.location==="cert") return renderCerts();
    if(game.location==="property") return renderAssets();
    if(game.location==="home") return renderHome();

    return renderClass();
  };

  /* =========================================================
     OVERLAYS
  ========================================================= */

  const renderQuizOverlay = ()=>{
    if(!quiz) return null;

    const q = quiz.questions[quiz.index];

    return (
      <Modal
        title={
          quiz.mode==="exam"
            ? `📝 ${quiz.examTitle || "Kỳ thi"}`
            : quiz.mode==="oral"
            ? "🧑‍🏫 Kiểm tra miệng — 3 câu"
            : quiz.mode==="cert"
            ? `🎓 Thi ${quiz.certName}`
            : "📚 Quiz nhanh"
        }
        onClose={()=>{
          if(quiz.mode==="exam") {
            examDismissedRef.current = currentExam
              ? `${currentExam.day}-${currentExam.timeIndex}`
              : null;
          }
          setAutoTime(true);
          setQuiz(null);
          setQuizFeedback(null);
          setOverlay(null);
        }}
      >
        <div className="quiz-top">
          <span>
            Câu {quiz.index+1}/{quiz.questions.length}
          </span>

          <span>
            ✅ {quiz.correct} &nbsp; ❌ {quiz.wrong}
          </span>

          {quiz.mode==="exam" && (
            <span className="exam-live-badge">
              ⏸️ Thời gian đang tạm dừng
            </span>
          )}
        </div>

        <div className="quiz-question">
          <div className="quiz-subject">
            {q.subject || q.topic || "Kiến thức"}
          </div>

          <h2>{q.q}</h2>
        </div>

        <div className="choices">
          {q.choices.map((choice,index)=>{
            const isCorrect =
              quizFeedback &&
              index===q.answer;

            const isWrong =
              quizFeedback &&
              index===quizFeedback.selected &&
              !quizFeedback.correct;

            return (
              <button
                key={index}
                className={`choice ${
                  isCorrect ? "correct" : ""
                } ${isWrong ? "wrong" : ""}`}
                disabled={Boolean(quizFeedback)}
                onClick={()=>answerQuiz(index)}
              >
                <span>
                  {String.fromCharCode(65+index)}.
                </span>
                {choice}
              </button>
            );
          })}
        </div>

        {quizFeedback && (
          <div className={`feedback ${
            quizFeedback.correct ? "good" : "bad"
          }`}>
            <b>
              {quizFeedback.correct
                ? "✅ Chính xác! +5 thành tích • +5 tri thức"
                : "❌ Sai! -3 thành tích • -3 tri thức"}
            </b>

            <p>{quizFeedback.explanation}</p>

            <Button onClick={nextQuizQuestion}>
              {quiz.index >= quiz.questions.length-1
                ? "🏁 Hoàn thành"
                : "➡️ Câu tiếp theo"}
            </Button>
          </div>
        )}
      </Modal>
    );
  };

  const renderSaveModal = ()=>(
    <Modal
      title="💾 Lưu / Nạp game"
      onClose={()=>setOverlay(null)}
    >
      <div className="save-actions">
        <Button onClick={createSaveCode}>
          🔐 Tạo mã lưu
        </Button>

        <Button onClick={exportJSON}>
          📥 Xuất file JSON
        </Button>
      </div>

      <textarea
        className="save-text"
        value={saveCode}
        onChange={e=>setSaveCode(e.target.value)}
        placeholder="Mã lưu game sẽ xuất hiện ở đây..."
      />

      <div className="save-actions">
        <Button
          onClick={()=>{
            if(navigator.clipboard && saveCode){
              navigator.clipboard.writeText(saveCode);
              setToast("📋 Đã sao chép mã.");
            }
          }}
        >
          📋 Sao chép
        </Button>

        <Button onClick={loadSaveCode}>
          📤 Nạp mã
        </Button>

        <label className="game-btn file-btn">
          📁 Nhập JSON
          <input
            type="file"
            accept=".json"
            onChange={importJSON}
            hidden
          />
        </label>
      </div>

      <div className="save-tip">
        💡 Game cũng tự động lưu vào trình duyệt.
      </div>
    </Modal>
  );

  const renderBagModal = ()=>(
    <Modal
      title="🎒 Túi đồ"
      onClose={()=>setOverlay(null)}
    >
      {game.bag.length===0 ? (
        <div className="empty">
          🎒 Túi đang trống.
        </div>
      ) : (
        <div className="bag-grid">
          {game.bag.map(item=>(
            <div className="bag-card" key={item.id}>
              <div className="bag-icon">{item.icon}</div>
              <b>{item.name}</b>
              <small>{item.desc}</small>
              <span>x{item.count}</span>

              <Button onClick={()=>useItem(item.id)}>
                Dùng
              </Button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );

  const renderCompetitionModal = ()=>(
    <Modal
      title="🏆 Bảng thi đua"
      onClose={()=>setOverlay(null)}
    >
      <div className="online-status">
        <span>🟢 {onlineCount || (onlineReady ? 1 : 0)} người đang online/gần đây</span>
        <small>
          {onlineReady ? "Bảng điểm online đồng bộ mỗi vài giây" : "Chế độ offline / demo cục bộ"}
        </small>
      </div>

      {onlineError && (
        <div className="online-warning">⚠️ {onlineError}</div>
      )}

      <div className="leaderboard">
        {leaderboard.map((row,index)=>(
          <div
            className={`rank-row ${
              row.id==="player" ? "player-rank" : ""
            }`}
            key={row.id}
          >
            <div className="rank-number">
              #{index+1}
            </div>

            <div className="rank-name">
              <span>{row.icon} {row.name}</span>
              <small>{row.type}</small>
            </div>

            <div className="rank-points">
              <b>{row.points}</b>
              <small>+{row.today} hôm nay</small>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );

  const renderTitlesModal = ()=>(
    <Modal
      title="🏅 Danh hiệu"
      onClose={()=>setOverlay(null)}
    >
      <div className="title-grid">
        {TITLES.map(title=>{
          const unlocked = title.condition(game);
          const selected = game.selectedTitle===title.id;

          return (
            <button
              key={title.id}
              disabled={!unlocked}
              className={`title-card ${
                unlocked ? "unlocked" : "locked"
              } ${selected ? "selected" : ""}`}
              onClick={()=>{
                if(!unlocked) return;

                updateGame(g=>{
                  g.selectedTitle=title.id;
                });

                setToast(`🏅 Danh hiệu: ${title.name}`);
              }}
            >
              <span>{title.icon}</span>
              <b>{title.name}</b>
              <small>{title.desc}</small>

              {selected && <em>Đang dùng</em>}
            </button>
          );
        })}
      </div>
    </Modal>
  );

  const renderGuideModal = ()=> (
    <Modal
      title="📖 Hướng dẫn chơi"
      onClose={()=>setOverlay(null)}
      wide
    >
      <div className="guide-wrap">
        <div className="guide-hero">
          <div className="guide-hero-icon">🌸</div>
          <div>
            <h2>Chào mừng đến với Thanh Xuân Rực Rỡ!</h2>
            <p>
              Bạn sẽ trải qua 45 ngày học tập, kết bạn, kiếm tiền,
              săn chứng chỉ, phối đồ và tích điểm thi đua.
            </p>
          </div>
        </div>

        <div className="guide-grid">
          <div className="guide-card">
            <h3>⏱️ 1. Thời gian</h3>
            <p>
              Mỗi mốc kéo dài <b>30 giây</b> và đồng hồ chạy liên tục.
              Mở tủ đồ, túi, nhật ký hay hồ sơ <b>không làm dừng thời gian</b>.
            </p>
            <p>
              Khi sang mốc mới, bạn nhận lại <b>2 lượt hoạt động chính</b>.
            </p>
          </div>

          <div className="guide-card">
            <h3>📝 2. Kỳ thi trong hành trình</h3>
            <p>
              Có <b>5 kỳ thi</b>: Giữa kỳ 1 (ngày 8), Cuối kỳ 1 (ngày 17),
              Giữa kỳ 2 (ngày 26), Cuối kỳ 2 (ngày 35) và Thi THPT (ngày 45).
            </p>
            <p>
              Mỗi kỳ có <b>5 câu cho 8 môn học = 40 câu</b>. Mỗi kỳ dùng một bộ đề riêng,
              không lấy lại câu trong kho ôn tập hiện có + 260 câu mới. Trong lúc thi, <b>đồng hồ tạm dừng</b> và chạy lại sau khi hoàn thành.
            </p>
          </div>

          <div className="guide-card">
            <h3>⚡ 3. Hoạt động chính</h3>
            <p>
              Mỗi mốc được làm tối đa <b>2 việc chính</b>.
            </p>
            <p>
              Ví dụ: Quiz 5 câu, Kiểm tra miệng, Nghỉ ngơi, Việc làm,
              tương tác NPC hoặc thi chứng chỉ.
            </p>
            <p>
              Khi đủ 2 lượt, chờ sang mốc tiếp theo để làm tiếp.
            </p>
          </div>

          <div className="guide-card">
            <h3>📚 4. Học tập</h3>
            <p>
              <b>Quiz 10 câu/ngày</b> giúp tăng thành tích và tri thức.
              Mỗi câu đúng được <b>+5 thành tích +5 tri thức</b>; mỗi câu sai bị
              <b>-3 thành tích -3 tri thức</b>. Câu đã làm gần đây sẽ được hạn chế lặp lại.
            </p>
            <p>
              <b>Kiểm tra miệng</b> có thể thực hiện 1 lần mỗi ngày.
            </p>
          </div>

          <div className="guide-card">
            <h3>🏆 5. Thi đua</h3>
            <p>
              Điểm thi đua của bạn dùng để so với NPC và các người chơi mô phỏng trên bảng xếp hạng.
            </p>
            <p>
              Mỗi khi đồng hồ sang mốc mới, mỗi NPC nhận ngẫu nhiên
              <b> +1 đến +5 điểm</b> thi đua.
            </p>
          </div>

          <div className="guide-card">
            <h3>🛠️ 6. Kỹ năng & ⚡ Năng lượng</h3>
            <p>
              <b>Kỹ năng</b> tối đa <b>500</b> và <b>Năng lượng</b> là 2 chỉ số khác nhau.
            </p>
            <p>
              Mỗi lần đi làm đều tăng kỹ năng; nghề càng cao cấp cho càng nhiều kỹ năng.
            </p>
            <p>
              Kỹ năng giúp mở một số công việc; Năng lượng bị tiêu hao khi
              làm các hoạt động và có thể phục hồi bằng Nghỉ ngơi hoặc đồ ăn.
            </p>
          </div>

          <div className="guide-card">
            <h3>💼 7. Việc làm & 🎓 Chứng chỉ</h3>
            <p>
              Việc làm giúp kiếm tiền và có thể tăng một số chỉ số.
              Một số nghề yêu cầu chứng chỉ hoặc mức kỹ năng nhất định.
            </p>
            <p>
              Mua và thi chứng chỉ để mở thêm lựa chọn nghề nghiệp.
            </p>
          </div>

          <div className="guide-card">
            <h3>👕 8. Tủ đồ</h3>
            <p>
              Mua quần áo trong cửa hàng, sau đó vào <b>Tủ đồ</b> để mặc.
              Bạn có thể thay áo, quần, giày, tóc và phụ kiện.
            </p>
          </div>

          <div className="guide-card">
            <h3>💾 9. Lưu game</h3>
            <p>
              Dùng mục <b>Lưu</b> để tạo mã lưu game và tải lại hành trình sau.
              Nên lưu trước khi thử một lựa chọn quan trọng.
            </p>
          </div>
        </div>

        <div className="guide-tip">
          💡 <b>Mẹo:</b> Hãy để ý đồng hồ, ưu tiên 2 hoạt động chính mỗi mốc,
          giữ năng lượng đủ dùng và kiểm tra bảng thi đua thường xuyên.
        </div>
      </div>
    </Modal>
  );

  const renderDiaryModal = ()=>(
    <Modal
      title="📔 Nhật ký thanh xuân"
      onClose={()=>setOverlay(null)}
      wide
    >
      {game.diaryEntries.length===0 ? (
        <div className="empty">
          Chưa có ngày nào kết thúc.
        </div>
      ) : (
        <div className="diary-list">
          {game.diaryEntries.map(entry=>(
            <div className="diary-card" key={entry.id}>
              <div className="diary-head">
                <b>📅 Ngày {entry.day}</b>
                <span>{entry.event}</span>
              </div>

              <p>{entry.summary}</p>

              <div className="delta-grid">
                <span>📚 {signed(entry.deltas.study)}</span>
                <span>💰 {signed(entry.deltas.money)}đ</span>
                <span>🤝 {signed(entry.deltas.friends)}</span>
                <span>⚡ {signed(entry.deltas.energy)}</span>
                <span>😊 {signed(entry.deltas.mood)}</span>
                <span>🏆 {signed(entry.deltas.competition)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );

  const renderProfileModal = ()=>(
    <Modal
      title="👤 Hồ sơ nhân vật"
      onClose={()=>setOverlay(null)}
      wide
    >
      <div className="profile-layout">
        <div className="profile-character">
          <div className="big-character female-profile-character">
            <div className="female-avatar">👩🏻‍🎓</div>
            <div>{getFashion(game.outfit.shirt)?.icon || "👕"}</div>
            <div>{getFashion(game.outfit.pants)?.icon || "👖"}</div>
            <div>{getFashion(game.outfit.shoes)?.icon || "👟"}</div>
          </div>

          <h2>
            {currentTitle.icon} {currentTitle.name}
          </h2>

          <div className="player-name-card">
            <label htmlFor="player-name-input">✏️ Tên nhân vật</label>
            <div className="player-name-row">
              <input
                id="player-name-input"
                value={playerNameDraft || game.playerName}
                placeholder="Nhập tên nhân vật"
                maxLength={20}
                onChange={e=>setPlayerNameDraft(e.target.value)}
              />
              <Button
                onClick={()=>{
                  const nextName = (playerNameDraft || game.playerName).trim().replace(/\s+/g," ");
                  if(!nextName){
                    setToast("✏️ Hãy nhập tên nhân vật.");
                    return;
                  }
                  updateGame(g=>{g.playerName=nextName.slice(0,20);});
                  setPlayerNameDraft(nextName.slice(0,20));
                  setToast("✅ Đã đổi tên nhân vật.");
                }}
              >
                Lưu tên
              </Button>
            </div>
            <small>Tên này sẽ xuất hiện trên bảng xếp hạng.</small>
          </div>
        </div>

        <div className="profile-stats">
          <StatBar icon="❤️" label="HP" value={game.stats.hp}/>
          <StatBar icon="⚡" label="Năng lượng" value={game.stats.energy}/>
          <StatBar icon="😊" label="Tâm trạng" value={game.stats.mood}/>
          <StatBar icon="📚" label="Kiến thức" value={game.stats.study}/>
          <StatBar icon="🤝" label="Bạn bè" value={game.stats.friends}/>
          <StatBar icon="💗" label="Tình cảm" value={game.stats.love}/>
          <StatBar icon="⭐" label="Danh tiếng" value={game.stats.reputation}/>
          <StatBar icon="🛠️" label="Kỹ năng" value={game.stats.skill} max={500}/>
          <div className="profile-points">
            <span>🏅 Thành tích: <b>{game.achievementPoints || 0}</b></span>
            <span>🧠 Tri thức: <b>{game.knowledgePoints || 0}</b></span>
          </div>
        </div>
      </div>
    </Modal>
  );

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="game-root">
       <style>{CSS}</style>

      <div className="game-shell">

        {/* HEADER */}
        <header className="header">

          <div className="brand">
            <div className="brand-icon">🌸</div>

            <div>
              <h1>Thanh Xuân Rực Rỡ</h1>
              <small>
                Deluxe Career & Fashion Edition
              </small>
            </div>
          </div>

          <div className="header-actions">

            <button
              className="top-btn"
              onClick={()=>setOverlay("profile")}
            >
              👤
            </button>

            <button
              className="top-btn"
              onClick={()=>setOverlay("fashion")}
            >
              👕
            </button>

            <button
              className="top-btn"
              onClick={()=>setOverlay("bag")}
            >
              🎒
            </button>

            <button
              className="top-btn"
              onClick={()=>setOverlay("save")}
            >
              💾
            </button>

          </div>

        </header>

        {/* TIME BAR */}
        <div className="time-panel">

          <div className="time-main">
            <div>
              <span className="day-label">
                NGÀY {game.day}/{game.totalDays}
              </span>

              <strong>
                🕒 {currentTime}
              </strong>

              <small>
                {PERIOD_NAMES[game.timeIndex]}
              </small>
            </div>

            <div className="countdown">
              <span>Còn</span>
              <b>
                00:{String(secondsLeft).padStart(2,"0")}
              </b>
              <small>
                {`🔓 ${Math.max(0, 2 - (game.mainActivityCount || 0))}/2 hoạt động chính còn lại`}
                <span className="muted"> • NPC +1–5 điểm/mốc</span>
                {game.mainActivityLabels?.length
                  ? ` • ${game.mainActivityLabels.join(" • ")}`
                  : ""}
              </small>

              {todayExam && !game.examResults?.[todayExam.id] && (
                <div className="exam-hint">
                  {todayExam.icon} <b>{todayExam.title}</b> tại {TIME_SLOTS[todayExam.timeIndex]}
                  {currentExam && quiz?.mode!=="exam" && (
                    <Button
                      onClick={()=>startQuiz("exam",null,currentExam)}
                    >
                      📝 Mở bài thi
                    </Button>
                  )}
                </div>
              )}

            </div>
          </div>

          <div className="time-progress">
            <div
              style={{
                width:`${(secondsLeft/SLOT_SECONDS)*100}%`
              }}
            />
          </div>

          <div className="schedule-row">
            {TIME_SLOTS.map((time,index)=>{
              const scheduledExam = EXAM_SCHEDULE.find(
                exam=>exam.day===game.day && exam.timeIndex===index
              );

              return (
                <div
                  key={time}
                  className={`schedule-dot ${
                    index===game.timeIndex ? "current" : ""
                  } ${
                    index<game.timeIndex ? "passed" : ""
                  } ${scheduledExam ? "exam-dot" : ""}`}
                  title={scheduledExam
                    ? `${time} — ${scheduledExam.title}`
                    : time}
                >
                  <span>{scheduledExam ? `📝 ${time}` : time}</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* HUD */}
        <div className="hud">

          <div className="hud-stat">
            ❤️ <b>{Math.round(game.stats.hp)}</b>
          </div>

          <div className="hud-stat">
            ⚡ <b>{Math.round(game.stats.energy)}</b>
          </div>

          <div className="hud-stat">
            😊 <b>{Math.round(game.stats.mood)}</b>
          </div>

          <div className="hud-stat">
            📚 <b>{Math.round(game.stats.study)}</b>
          </div>

          <div className="hud-stat">
            🤝 <b>{Math.round(game.stats.friends)}</b>
          </div>

          <div className="hud-stat">
            ⭐ <b>{Math.round(game.stats.reputation)}</b>
          </div>

          <div className="hud-money">
            💰 {money(game.stats.money)}
          </div>

          <button
            className="auto-btn"
            onClick={()=>setAutoTime(v=>!v)}
            disabled={game.isGameOver}
          >
            {autoTime ? "⏱ Tự chạy" : "⏸ Tạm dừng"}
          </button>

        </div>

        {/* CONTENT */}
        <main className="content">

          <section className="scene">

            <div className="scene-top">

              <div>
                <div className="location-title">
                  {game.location==="class" && "🏫 Lớp học"}
                  {game.location==="canteen" && "🍱 Căn tin"}
                  {game.location==="jobs" && "💼 Việc làm"}
                  {game.location==="cert" && "🎓 Chứng chỉ"}
                  {game.location==="property" && "🏠 Tài sản"}
                  {game.location==="home" && "🏠 Nhà"}
                </div>

                <small>
                  {currentTitle.icon} {currentTitle.name}
                </small>
              </div>

              <button
                className="activity-launch"
                onClick={()=>setOverlay("activities")}
              >
                ⚡ Hoạt động
              </button>

            </div>

            {renderLocation()}

          </section>

          {/* SIDE */}
          <aside className="side">

            <div className="character-card">

              <div className="mini-character">
                {renderOutfitAvatar("mini")}
              </div>

              <b>
                {currentTitle.icon} {currentTitle.name}
              </b>

              <small>
                👕 {ownedFashion.length} món thời trang
              </small>

            </div>

            <div className="side-card">

              <div className="side-title">
                ⚡ Truy cập nhanh
              </div>

              <div className="quick-buttons">

                <button onClick={()=>setOverlay("activities")}>
                  ⚡ Hoạt động
                </button>

                <button onClick={()=>setOverlay("fashion")}>
                  👕 Tủ đồ
                </button>

                <button onClick={()=>setOverlay("bag")}>
                  🎒 Túi
                </button>

                <button onClick={()=>setOverlay("diary")}>
                  📔 Nhật ký
                </button>

                <button onClick={()=>setOverlay("competition")}>
                  🏆 Thi đua
                </button>

                <button onClick={()=>setOverlay("titles")}>
                  🏅 Danh hiệu
                </button>

                <button onClick={()=>setOverlay("save")}>
                  💾 Lưu game
                </button>

                <button onClick={()=>setOverlay("guide")}>
                  📖 Hướng dẫn
                </button>

                <button onClick={()=>setOverlay("profile")}>
                  👤 Nhân vật
                </button>

              </div>

            </div>

            <div className="side-card">

              <div className="side-title">
                🗺️ Khu vực
              </div>

              <div className="location-buttons">

                <button
                  className={game.location==="class" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"class"}))}
                >
                  🏫 Lớp
                </button>

                <button
                  className={game.location==="canteen" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"canteen"}))}
                >
                  🍱 Căn tin
                </button>

                <button
                  className={game.location==="jobs" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"jobs"}))}
                >
                  💼 Việc
                </button>

                <button
                  className={game.location==="cert" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"cert"}))}
                >
                  🎓 Thi
                </button>

                <button
                  className={game.location==="property" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"property"}))}
                >
                  🏠 Tài sản
                </button>

                <button
                  className={game.location==="home" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"home"}))}
                >
                  🛏️ Nhà
                </button>

              </div>

            </div>

            <div className="side-card">

              <div className="side-title">
                🏆 Thi đua
              </div>

              <div className="competition-score">
                <strong>{game.competitionPoints}</strong>
                <span>điểm</span>
              </div>

              <Button onClick={()=>setOverlay("competition")}>
                Xem bảng xếp hạng
              </Button>

            </div>

          </aside>

        </main>

        {/* FOOTER NAV */}
        <footer className="footer-nav">

          <button
            className={game.location==="class" ? "active":""}
            onClick={()=>setGame(g=>({...g,location:"class"}))}
          >
            🏫
            <span>Lớp</span>
          </button>

          <button
            onClick={()=>setOverlay("activities")}
          >
            ⚡
            <span>Hoạt động</span>
          </button>

          <button
            onClick={()=>setOverlay("fashion")}
          >
            👕
            <span>Tủ đồ</span>
          </button>

          <button
            onClick={()=>setOverlay("bag")}
          >
            🎒
            <span>Túi</span>
          </button>

          <button
            onClick={()=>setOverlay("competition")}
          >
            🏆
            <span>Thi đua</span>
          </button>

          <button
            onClick={()=>setOverlay("save")}
          >
            💾
            <span>Lưu</span>
          </button>

          <button
            onClick={()=>setOverlay("guide")}
          >
            📖
            <span>Hướng dẫn</span>
          </button>

        </footer>

      </div>

      {/* TOAST */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      {overlay==="nameSetup" && (
        <Modal
          title="🌸 Đặt tên nhân vật"
          onClose={null}
          wide
        >
          <div className="name-setup">
            <div className="name-setup-icon">👩🏻‍🎓</div>
            <h2>Nhân vật của bạn tên gì?</h2>
            <p>Tên này sẽ được dùng trên hồ sơ và bảng xếp hạng.</p>

            <input
              autoFocus
              className="name-setup-input"
              value={playerNameDraft}
              maxLength={20}
              placeholder="Ví dụ: Minh Anh"
              onChange={e=>setPlayerNameDraft(e.target.value)}
              onKeyDown={e=>{
                if(e.key==="Enter") confirmPlayerName();
              }}
            />

            <Button onClick={confirmPlayerName}>✨ Bắt đầu hành trình</Button>
          </div>
        </Modal>
      )}

      {/* =====================================================
          QUICK ACTIVITY MODAL
      ===================================================== */}

      {overlay==="activities" && (
        <Modal
          title="⚡ Tất cả hoạt động"
          onClose={()=>setOverlay(null)}
          wide
        >
          <div className="activity-grid large">

            {quickActivities.map((a,i)=>{
              const isMain =
                ["Quiz 5 câu","Kiểm tra miệng","Nghỉ ngơi","Việc làm"].includes(a.title);

              const blocked =
                Boolean(a.disabled) ||
                (isMain && (game.mainActivityCount || 0) >= 2);

              return (
                <button
                  key={i}
                  className="activity-card"
                  disabled={blocked}
                  onClick={()=>a.action()}
                >
                  <span className="activity-icon">{a.icon}</span>
                  <b>{a.title}</b>
                  <small>
                    {isMain && (game.mainActivityCount || 0) >= 2
                      ? `🔒 Đã đủ 2 việc chính ở mốc ${currentTime}`
                      : a.desc}
                  </small>
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {overlay==="fashion" && (
        <Modal
          title="👕 Tủ đồ thời trang"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderFashion()}
        </Modal>
      )}

      {overlay==="bag" && renderBagModal()}

      {overlay==="profile" && renderProfileModal()}

      {overlay==="save" && renderSaveModal()}

      {overlay==="competition" && renderCompetitionModal()}

      {overlay==="titles" && renderTitlesModal()}

      {overlay==="diary" && renderDiaryModal()}

      {overlay==="guide" && renderGuideModal()}

      {overlay==="canteen" && (
        <Modal
          title="🍱 Căn tin"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderCanteen()}
        </Modal>
      )}

      {overlay==="jobs" && (
        <Modal
          title="💼 Việc làm"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderJobs()}
        </Modal>
      )}

      {overlay==="certs" && (
        <Modal
          title="🎓 Chứng chỉ"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderCerts()}
        </Modal>
      )}

      {overlay==="assets" && (
        <Modal
          title="🏠 Tài sản"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderAssets()}
        </Modal>
      )}

      {(overlay==="quiz" ||
        overlay==="oral" ||
        overlay==="certExam" ||
        overlay==="exam") &&
        renderQuizOverlay()
      }

      {/* =====================================================
          GAME OVER
      ===================================================== */}

      {overlay==="ending" && (
        <Modal
          title="✨ Thanh xuân đã hoàn thành!"
          onClose={null}
          wide
        >
          <div className="ending">

            <div className="ending-icon">
              🌸
            </div>

            <h1>
              Hành trình 45 ngày đã kết thúc
            </h1>

            <p>
              Bạn đã đi qua một hành trình học tập,
              tình bạn, công việc và những lựa chọn
              rất riêng của tuổi học trò.
            </p>

            <div className="ending-stats">

              <div>
                <b>{Math.round(game.stats.study)}</b>
                <span>📚 Kiến thức</span>
              </div>

              <div>
                <b>{Math.round(game.stats.skill)}</b>
                <span>🛠️ Kỹ năng</span>
              </div>

              <div>
                <b>{game.competitionPoints}</b>
                <span>🏆 Thi đua</span>
              </div>

              <div>
                <b>{game.wardrobe.length}</b>
                <span>👕 Thời trang</span>
              </div>

              <div>
                <b>{game.assets.length}</b>
                <span>🏠 Tài sản</span>
              </div>

              <div>
                <b>{game.certificates.length}</b>
                <span>🎓 Chứng chỉ</span>
              </div>

            </div>

            <div className="final-title">
              {currentTitle.icon} {currentTitle.name}
            </div>

            <Button onClick={restart}>
              🌱 Chơi lại từ đầu
            </Button>

            <Button onClick={()=>setOverlay("diary")}>
              📔 Xem lại nhật ký
            </Button>

          </div>
        </Modal>
      )}

    </div>
  );
}

/* =========================================================
   ERROR BOUNDARY
   Nếu có lỗi runtime, hiển thị màn hình lỗi thay vì trắng toàn bộ.
========================================================= */
class GameErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = { error:null };
  }

  static getDerivedStateFromError(error){
    return { error };
  }

  componentDidCatch(error,info){
    console.error("Thanh Xuân Rực Rỡ runtime error:",error,info);
  }

  render(){
    if(this.state.error){
      return (
        <div style={{
          minHeight:"100vh",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          padding:24,
          background:"#f7f1ff",
          color:"#34283e",
          fontFamily:"system-ui, sans-serif"
        }}>
          <div style={{
            maxWidth:720,
            width:"100%",
            background:"white",
            borderRadius:18,
            padding:24,
            boxShadow:"0 12px 40px rgba(80,50,120,.14)"
          }}>
            <h2 style={{marginTop:0}}>⚠️ Game gặp lỗi runtime</h2>
            <p>App không còn trắng toàn màn hình. Hãy kiểm tra Console để xem chi tiết.</p>
            <pre style={{
              whiteSpace:"pre-wrap",
              background:"#f6f3fa",
              padding:12,
              borderRadius:10,
              overflow:"auto"
            }}>{String(this.state.error?.message || this.state.error)}</pre>
            <button
              onClick={()=>window.location.reload()}
              style={{
                border:0,
                borderRadius:10,
                padding:"10px 14px",
                fontWeight:800,
                cursor:"pointer"
              }}
            >↻ Tải lại game</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* =========================================================
   CSS
========================================================= */

const CSS = `
*{
  box-sizing:border-box;
}

html,
body,
#root{
  margin:0;
  width:100%;
  min-height:100%;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

body{
  overflow:hidden;
  background:#f2eaff;
}

button,
input,
textarea{
  font:inherit;
}

button{
  cursor:pointer;
}

button:disabled{
  cursor:not-allowed;
  opacity:.48;
}

.game-root{
  width:100%;
  height:100dvh;
  padding:8px;
  display:flex;
  justify-content:center;
  align-items:center;
  background:
    radial-gradient(circle at 10% 10%,#f8ddff 0,transparent 32%),
    radial-gradient(circle at 90% 80%,#dce9ff 0,transparent 35%),
    linear-gradient(135deg,#f5edff,#edf5ff);
}

.game-shell{
  width:min(1100px,100%);
  height:calc(100dvh - 16px);
  min-height:0;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:rgba(255,255,255,.92);
  border:1px solid rgba(130,90,180,.15);
  border-radius:20px;
  box-shadow:0 20px 70px rgba(71,38,110,.16);
}

/* HEADER */

.header{
  flex:none;
  min-height:62px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:9px 13px;
  background:linear-gradient(110deg,#6f42c1,#9c5de8,#ef75b9);
  color:white;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
}

.brand-icon{
  width:40px;
  height:40px;
  display:grid;
  place-items:center;
  border-radius:13px;
  background:rgba(255,255,255,.18);
  font-size:23px;
}

.brand h1{
  margin:0;
  font-size:17px;
  line-height:1.1;
}

.brand small{
  opacity:.84;
  font-size:10px;
}

.header-actions{
  display:flex;
  gap:5px;
}

.top-btn{
  width:36px;
  height:34px;
  border:0;
  border-radius:10px;
  background:rgba(255,255,255,.17);
  color:white;
  transition:.15s;
}

.top-btn:hover{
  background:rgba(255,255,255,.3);
  transform:translateY(-1px);
}

/* TIME */

.time-panel{
  flex:none;
  padding:8px 12px 6px;
  background:#fff;
  border-bottom:1px solid #eee7f8;
}

.time-main{
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.day-label{
  display:block;
  font-size:9px;
  color:#8057a8;
  font-weight:800;
  letter-spacing:.5px;
}

.time-main strong{
  display:inline-block;
  margin-right:7px;
  font-size:18px;
  color:#30243d;
}

.time-main small{
  color:#8d8197;
  font-size:10px;
}

.countdown{
  display:flex;
  flex-direction:column;
  align-items:flex-end;
}

.countdown span{
  font-size:9px;
  color:#9b90a4;
}

.countdown b{
  font-size:20px;
  color:#7b3fc2;
  font-variant-numeric:tabular-nums;
}

.time-progress{
  height:5px;
  margin-top:5px;
  overflow:hidden;
  background:#eee8f7;
  border-radius:99px;
}

.time-progress div{
  height:100%;
  background:linear-gradient(90deg,#7751d8,#e96fb4);
  transition:width .8s linear;
}

.schedule-row{
  display:flex;
  gap:3px;
  margin-top:6px;
  overflow:hidden;
}

.schedule-dot{
  flex:1;
  min-width:28px;
  height:20px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:6px;
  background:#f4f1f8;
  color:#a098a7;
  font-size:7px;
}

.schedule-dot.current{
  background:#e9dcff;
  color:#713db3;
  font-weight:800;
  box-shadow:inset 0 0 0 1px #b994eb;
}

.schedule-dot.passed{
  background:#eeeaf3;
  color:#777;
}

/* HUD */

.hud{
  flex:none;
  display:flex;
  align-items:center;
  gap:5px;
  padding:6px 10px;
  background:#faf8fd;
  border-bottom:1px solid #eee7f8;
  overflow-x:auto;
}

.hud-stat,
.hud-money,
.auto-btn{
  flex:none;
  height:29px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:4px;
  padding:0 9px;
  border-radius:9px;
  font-size:10px;
  border:1px solid #e9e1f1;
  background:white;
}

.hud-money{
  color:#8150b5;
  font-weight:800;
}

.auto-btn{
  border:0;
  color:white;
  background:#6d49bc;
  font-weight:700;
}

/* CONTENT */

.content{
  flex:1;
  min-height:0;
  display:grid;
  grid-template-columns:minmax(0,1fr) 275px;
  gap:8px;
  padding:8px;
  overflow:hidden;
}

.scene{
  min-width:0;
  min-height:0;
  overflow:auto;
  padding-right:2px;
}

.side{
  min-width:0;
  min-height:0;
  overflow:auto;
}

/* SCENE */

.scene-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:8px;
}

.location-title{
  font-size:18px;
  font-weight:900;
  color:#3a2a46;
}

.scene-top small{
  color:#8d8197;
  font-size:10px;
}

.activity-launch{
  border:0;
  padding:9px 12px;
  border-radius:11px;
  background:linear-gradient(135deg,#7548ca,#e66db2);
  color:white;
  font-weight:800;
  box-shadow:0 6px 15px rgba(120,70,180,.18);
}

/* CARDS */

.card,
.side-card,
.character-card,
.event-card,
.home-card{
  background:white;
  border:1px solid #eee7f5;
  border-radius:14px;
  padding:11px;
  margin-bottom:8px;
  box-shadow:0 3px 12px rgba(55,30,80,.035);
}

.section-title{
  margin-bottom:8px;
  color:#4c3561;
  font-weight:900;
  font-size:13px;
}

.muted{
  color:#8d8294;
  font-size:11px;
  line-height:1.45;
}

.event-card{
  display:flex;
  gap:10px;
  background:linear-gradient(135deg,#fff9ff,#f6f0ff);
}

.event-icon{
  width:42px;
  height:42px;
  flex:none;
  display:grid;
  place-items:center;
  border-radius:12px;
  background:#eadcff;
  font-size:22px;
}

.event-title{
  font-weight:900;
  color:#5b3a79;
  margin-bottom:3px;
}

.event-result{
  margin-top:5px;
  color:#7c4cab;
  font-size:10px;
  font-weight:700;
}

/* BUTTON */

.game-btn{
  width:100%;
  border:0;
  padding:7px 9px;
  border-radius:9px;
  background:#7650bd;
  color:white;
  font-weight:700;
  font-size:10px;
  transition:.15s;
}

.game-btn:hover:not(:disabled){
  transform:translateY(-1px);
  filter:brightness(1.04);
}

.game-btn.success{
  background:#42a36a;
}

/* ACTIVITY */

.activity-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:7px;
  margin-bottom:10px;
}

.activity-grid.large{
  grid-template-columns:repeat(4,minmax(0,1fr));
}

.activity-card{
  min-width:0;
  border:1px solid #eee4f5;
  border-radius:12px;
  padding:10px 7px;
  background:linear-gradient(145deg,#fff,#faf6ff);
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:3px;
  color:#44354e;
  transition:.15s;
}

.activity-card:hover:not(:disabled){
  border-color:#bd9de2;
  transform:translateY(-2px);
  box-shadow:0 7px 16px rgba(90,50,130,.08);
}

.activity-icon{
  font-size:24px;
}

.activity-card b{
  font-size:10px;
}

.activity-card small{
  color:#978c9d;
  font-size:8px;
}

/* NPC */

.npc-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:7px;
}

.npc-card{
  display:flex;
  gap:8px;
  padding:9px;
  border:1px solid #eee7f4;
  border-radius:12px;
  background:#fff;
}

.npc-avatar{
  width:38px;
  height:38px;
  flex:none;
  display:grid;
  place-items:center;
  border-radius:11px;
  background:#f1e9fb;
  font-size:20px;
}

.npc-info{
  min-width:0;
  flex:1;
}

.npc-info b{
  display:block;
  font-size:11px;
}

.npc-info small{
  display:block;
  min-height:27px;
  color:#8e8495;
  font-size:8px;
  line-height:1.3;
}

.relationship{
  color:#9a61c1;
  font-size:8px;
  margin-bottom:5px;
}

/* SIDE */

.character-card{
  text-align:center;
}

.mini-character{
  position:relative;
  width:100px;
  height:125px;
  margin:0 auto 7px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  border-radius:22px;
  background:linear-gradient(145deg,#f5edff,#fff4fa);
  font-size:27px;
}

.mini-character > div{
  height:25px;
  line-height:25px;
}

.mini-accessory{
  position:absolute;
  right:12px;
  top:12px;
  font-size:19px;
}

.character-card b{
  display:block;
  font-size:11px;
}

.character-card small{
  display:block;
  color:#9a8ea0;
  margin-top:3px;
  font-size:9px;
}

.side-title{
  font-weight:900;
  color:#523a66;
  margin-bottom:7px;
  font-size:12px;
}

.quick-buttons{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:5px;
}

.quick-buttons button,
.location-buttons button{
  border:1px solid #eee5f4;
  border-radius:8px;
  padding:7px 5px;
  background:#faf8fc;
  color:#584965;
  font-size:9px;
  font-weight:700;
}

.quick-buttons button:hover,
.location-buttons button:hover,
.location-buttons button.active{
  background:#eadfff;
  color:#693e9d;
  border-color:#cdb0ec;
}

.location-buttons{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:5px;
}

.competition-score{
  display:flex;
  align-items:baseline;
  gap:5px;
  margin-bottom:7px;
}

.competition-score strong{
  font-size:28px;
  color:#7345ae;
}

.competition-score span{
  color:#938799;
  font-size:9px;
}

/* FOOTER */

.footer-nav{
  flex:none;
  height:52px;
  display:flex;
  justify-content:space-around;
  align-items:center;
  border-top:1px solid #eee7f5;
  background:white;
}

.footer-nav button{
  min-width:55px;
  border:0;
  background:none;
  color:#8e8295;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:2px;
  font-size:17px;
}

.footer-nav span{
  font-size:8px;
}

.footer-nav button.active{
  color:#7545b2;
  font-weight:900;
}

/* SHOP */

.shop-grid,
.asset-grid,
.cert-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
}

.shop-card,
.asset-card,
.cert-card,
.bag-card{
  border:1px solid #eee6f4;
  border-radius:11px;
  padding:9px;
  display:flex;
  flex-direction:column;
  gap:4px;
  background:#fff;
}

.shop-icon,
.asset-icon,
.cert-icon,
.bag-icon{
  font-size:25px;
}

.shop-card b,
.asset-card b,
.cert-card b,
.bag-card b{
  font-size:10px;
}

.shop-card small,
.asset-card small,
.cert-card small,
.bag-card small{
  color:#918697;
  font-size:8px;
  min-height:23px;
}

.asset-card strong{
  color:#7544ad;
  font-size:10px;
}

.asset-card.owned,
.cert-card.owned{
  background:#f3fff7;
  border-color:#bde5c9;
}

/* JOB */

.job-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:8px;
}

.job-card{
  display:flex;
  gap:9px;
  padding:10px;
  border:1px solid #eee6f4;
  border-radius:12px;
  background:#fff;
}

.job-card.locked{
  opacity:.65;
}

.job-icon{
  font-size:28px;
}

.job-content{
  min-width:0;
  flex:1;
}

.job-content b{
  display:block;
  font-size:11px;
}

.job-content small{
  display:block;
  color:#908697;
  font-size:9px;
  min-height:25px;
  margin:3px 0;
}

.job-meta{
  color:#8050b5;
  font-size:9px;
  font-weight:700;
  margin-bottom:6px;
}

/* FASHION */

.fashion-page{
  display:grid;
  grid-template-columns:230px minmax(0,1fr);
  gap:10px;
}

.fashion-preview{
  border:1px solid #eee5f4;
  border-radius:14px;
  padding:11px;
  background:linear-gradient(145deg,#fff8ff,#f5f1ff);
}

.character{
  position:relative;
  width:150px;
  height:230px;
  margin:10px auto;
  border-radius:30px;
  background:rgba(255,255,255,.75);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  font-size:45px;
}

.character > div{
  height:42px;
  line-height:42px;
}

.character-accessories{
  position:absolute;
  right:20px;
  top:35px;
  font-size:30px;
}

.female-character{
  overflow:hidden;
  justify-content:flex-start;
  padding-top:10px;
  gap:0;
}

.outfit-avatar{
  position:relative;
  width:128px;
  height:174px;
  margin:4px auto 0;
  flex:none;
}

.outfit-avatar-large{
  transform:translateY(2px);
}

.avatar-head{
  position:absolute;
  z-index:5;
  left:43px;
  top:15px;
  width:42px;
  height:47px;
  border-radius:47% 47% 43% 43% / 42% 42% 55% 55%;
  background:linear-gradient(180deg,#ffd9c8 0%,#f5c1ad 100%);
  box-shadow:0 2px 4px rgba(80,40,110,.12), inset 0 -2px 0 rgba(192,115,97,.10);
  overflow:visible;
}

.avatar-face{
  position:absolute;
  inset:0;
  display:block;
}

.avatar-ear{
  position:absolute;
  z-index:-1;
  top:21px;
  width:7px;
  height:12px;
  border-radius:50%;
  background:#f3b9a6;
}
.avatar-ear-left{left:-3px}.avatar-ear-right{right:-3px}

.avatar-brow{
  position:absolute;
  top:14px;
  width:10px;
  height:2px;
  border-radius:99px;
  background:#513934;
}
.avatar-brow-left{left:8px;transform:rotate(-5deg)}
.avatar-brow-right{right:8px;transform:rotate(5deg)}

.avatar-eye{
  position:absolute;
  top:18px;
  width:10px;
  height:7px;
  border:1.5px solid #44313a;
  border-radius:55% 55% 50% 50%;
  background:#fff;
  overflow:hidden;
}
.avatar-eye-left{left:8px}.avatar-eye-right{right:8px}
.avatar-eye i{
  position:absolute;
  left:3px;
  top:1px;
  width:4px;
  height:4px;
  border-radius:50%;
  background:#3a2931;
}

.avatar-nose{
  position:absolute;
  left:19px;
  top:25px;
  width:5px;
  height:7px;
  border-right:1.5px solid rgba(167,100,87,.75);
  border-bottom:1.5px solid rgba(167,100,87,.75);
  border-radius:0 0 5px 0;
  transform:rotate(12deg);
}

.avatar-mouth{
  position:absolute;
  left:14px;
  top:34px;
  width:14px;
  height:7px;
  border-bottom:2px solid #ad4f68;
  border-radius:0 0 12px 12px;
}
.avatar-mouth i{
  position:absolute;
  left:2px;
  right:2px;
  bottom:0;
  height:2px;
  border-radius:50%;
  background:#f6a2a5;
}

.avatar-blush{
  position:absolute;
  top:29px;
  width:7px;
  height:4px;
  border-radius:50%;
  background:rgba(239,132,143,.34);
}
.avatar-blush-left{left:4px}.avatar-blush-right{right:4px}

.avatar-hair{
  position:absolute;
  z-index:4;
  left:38px;
  top:9px;
  width:52px;
  height:45px;
  border-radius:50% 50% 38% 38%;
  background:#2d2532;
  pointer-events:none;
}

.avatar-hair::after{
  content:"";
  position:absolute;
  left:3px;
  right:3px;
  top:26px;
  height:28px;
  border-radius:8px 8px 18px 18px;
  background:inherit;
}

.hair-black{background:#2d2532}.hair-brown{background:#70452f}.hair-blue{background:#4779b8}.hair-pink{background:#d96d9d}
.hair-short{height:38px}.hair-short::after{height:16px}
.hair-long{height:48px}.hair-long::after{height:42px}
.hair-wavy{border-radius:48% 52% 35% 35%; transform:rotate(-2deg)}

.avatar-neck{
  position:absolute;
  z-index:2;
  left:58px;
  top:52px;
  width:12px;
  height:12px;
  background:#f3c2ae;
  border-radius:0 0 6px 6px;
}

.avatar-shirt{
  position:absolute;
  z-index:3;
  left:29px;
  top:59px;
  width:70px;
  height:58px;
  border-radius:16px 16px 10px 10px;
  box-shadow:inset 0 -5px 0 rgba(0,0,0,.06),0 2px 4px rgba(70,35,90,.12);
  overflow:hidden;
}

.avatar-shirt::before,.avatar-shirt::after{
  content:"";
  position:absolute;
  top:5px;
  width:18px;
  height:36px;
  background:inherit;
  border-radius:10px;
}
.avatar-shirt::before{left:-9px; transform:rotate(10deg)}
.avatar-shirt::after{right:-9px; transform:rotate(-10deg)}

.shirt-white{background:#f8f8ff}.shirt-blue{background:#4f91d8}.shirt-black{background:#34313b}.shirt-pink{background:#eaa7c7}.shirt-mint{background:#8fd5c4}.shirt-red{background:#d95762}.shirt-yellow{background:#f0c95a}.shirt-gray{background:#9b9ba8}.shirt-cream{background:#e9dcc3}
.shirt-hoodie{border-radius:18px 18px 11px 11px}.shirt-jacket{border:3px solid rgba(0,0,0,.1)}.shirt-varsity{border:3px solid rgba(255,255,255,.65)}.shirt-cardigan{box-shadow:inset 0 0 0 3px rgba(255,255,255,.35)}.shirt-sweater{border-radius:13px}.shirt-jersey::after{background:rgba(255,255,255,.25)}

.shirt-collar{
  position:absolute;
  z-index:2;
  left:25px;
  top:0;
  width:20px;
  height:15px;
  background:#fff;
  clip-path:polygon(0 0,50% 70%,100% 0,82% 100%,18% 100%);
}

.shirt-front-detail{
  position:absolute;
  z-index:2;
  left:50%;
  top:17px;
  width:2px;
  height:33px;
  transform:translateX(-50%);
  background:rgba(255,255,255,.38);
}

.avatar-bottom{
  position:absolute;
  z-index:2;
  left:35px;
  top:114px;
  width:58px;
  height:37px;
  border-radius:7px 7px 13px 13px;
  box-shadow:inset 0 -4px 0 rgba(0,0,0,.08);
}

.bottom-black{background:#30303a}.bottom-blue{background:#5b83bd}.bottom-white{background:#eeeef5}.bottom-gray{background:#8f909d}.bottom-green{background:#607d55}.bottom-beige{background:#cbb991}
.bottom-skirt{height:42px; width:66px; left:31px; border-radius:5px 5px 17px 17px; transform:perspective(30px) rotateX(-2deg)}
.bottom-short{height:29px; top:116px}.bottom-wide{width:66px; left:31px}.bottom-cargo{box-shadow:inset 0 -4px 0 rgba(0,0,0,.08), inset 0 0 0 2px rgba(255,255,255,.08)}

.avatar-legs{
  position:absolute;
  z-index:1;
  left:43px;
  top:145px;
  display:flex;
  gap:12px;
}
.avatar-leg{width:13px;height:25px;border-radius:0 0 7px 7px;background:#f0c4ae}.leg-black{background:#f0c4ae}

.avatar-shoes{
  position:absolute;
  z-index:4;
  left:35px;
  top:163px;
  display:flex;
  gap:13px;
}
.avatar-shoes span{display:block;width:28px;height:10px;border-radius:10px 10px 5px 5px;background:#fff;box-shadow:0 2px 3px rgba(0,0,0,.15)}
.shoes-black span{background:#35333d}.shoes-red span{background:#d95762}.shoes-pink span{background:#e8a4c6}.shoes-white span{background:#fff}
.shoes-boots span{height:14px;border-radius:5px 5px 8px 8px}.shoes-loafer span{height:9px;border-radius:8px}

.avatar-bag{
  position:absolute;
  z-index:7;
  right:3px;
  top:91px;
  font-size:26px;
  transform:rotate(5deg);
}

.avatar-accessory{
  position:absolute;
  z-index:8;
  left:82px;
  top:31px;
  font-size:22px;
}

.outfit-avatar-mini{
  width:74px;
  height:104px;
  transform:scale(.58);
  transform-origin:top center;
  margin:0 auto -45px;
}

.outfit-avatar-profile{
  width:150px;
  height:205px;
  transform:scale(1.05);
  transform-origin:center center;
}

.female-outfit-caption{
  margin-top:0;
  padding:3px 8px;
  border-radius:999px;
  background:#f1e7ff;
  color:#72509a;
  font-size:8px;
  font-weight:700;
}

.outfit-list{
  display:flex;
  flex-direction:column;
  gap:4px;
}

.outfit-row{
  display:flex;
  justify-content:space-between;
  gap:5px;
  padding:5px 7px;
  border-radius:7px;
  background:white;
  font-size:8px;
}

.outfit-row b{
  text-align:right;
}

.fashion-shop{
  min-width:0;
}

.fashion-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.money-pill{
  padding:7px 9px;
  border-radius:9px;
  background:#fff3c9;
  color:#9a7115;
  font-size:9px;
  font-weight:800;
}

.category-tabs{
  display:flex;
  gap:4px;
  overflow-x:auto;
  padding:7px 0;
}

.category-tabs button{
  flex:none;
  border:1px solid #e9e0f2;
  border-radius:8px;
  background:#faf8fc;
  color:#6e6075;
  padding:6px 9px;
  font-size:9px;
  font-weight:800;
}

.category-tabs button.active{
  background:#7548b7;
  color:white;
  border-color:#7548b7;
}

.fashion-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
  max-height:500px;
  overflow:auto;
  padding-right:2px;
}

.fashion-card{
  border:1px solid #eee6f4;
  border-radius:11px;
  padding:8px;
  display:flex;
  flex-direction:column;
  gap:4px;
  background:white;
}

.fashion-card.owned{
  background:#faf7ff;
}

.fashion-card.equipped{
  border:2px solid #7b4bb7;
  background:#f5eeff;
}

.fashion-icon{
  width:100%;
  height:48px;
  display:grid;
  place-items:center;
  border-radius:9px;
  background:#f7f1fb;
  font-size:29px;
}

.fashion-card b{
  font-size:9px;
}

.fashion-card small{
  color:#938797;
  font-size:7px;
  min-height:19px;
}

.fashion-card strong{
  color:#7650aa;
  font-size:9px;
}

.fashion-bonus{
  display:flex;
  flex-wrap:wrap;
  gap:2px;
  min-height:18px;
}

.fashion-bonus span{
  padding:2px 4px;
  border-radius:5px;
  background:#eee5fb;
  color:#71439e;
  font-size:6px;
}

/* HOME */

.home-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}

.home-card{
  text-align:center;
}

.big-icon{
  font-size:48px;
}

.home-card h2{
  font-size:17px;
  margin:5px 0;
}

.home-card p{
  color:#918595;
  font-size:10px;
}

/* MODAL */

.modal-backdrop{
  position:fixed;
  inset:0;
  z-index:100;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:12px;
  background:rgba(32,20,42,.45);
  backdrop-filter:blur(4px);
}

.modal{
  width:min(520px,100%);
  max-height:92dvh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border-radius:17px;
  background:white;
  box-shadow:0 25px 80px rgba(30,15,45,.3);
}

.modal-wide{
  width:min(920px,100%);
}

.modal-head{
  flex:none;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:11px 13px;
  background:linear-gradient(110deg,#7144ba,#a25dd9);
  color:white;
}

.modal-title{
  font-size:14px;
  font-weight:900;
}

.icon-btn{
  width:30px;
  height:30px;
  border:0;
  border-radius:8px;
  background:rgba(255,255,255,.16);
  color:white;
}

.modal-body{
  min-height:0;
  overflow:auto;
  padding:12px;
}

/* QUIZ */

.quiz-top{
  display:flex;
  justify-content:space-between;
  color:#8c8193;
  font-size:9px;
  margin-bottom:8px;
}

.exam-live-badge{
  padding:4px 8px;
  border-radius:999px;
  background:#fff4d8;
  color:#8a5a00;
  font-weight:700;
}

.exam-hint{
  margin-top:7px;
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
}

.exam-dot span{
  font-weight:800;
}

.quiz-question{
  padding:12px;
  border-radius:13px;
  background:#f7f2fc;
  margin-bottom:8px;
}

.quiz-subject{
  display:inline-block;
  padding:3px 6px;
  border-radius:6px;
  background:#e5d8f7;
  color:#72469c;
  font-size:8px;
  font-weight:800;
}

.quiz-question h2{
  margin:9px 0 0;
  font-size:17px;
  line-height:1.4;
  color:#34283e;
}

.choices{
  display:grid;
  gap:6px;
}

.choice{
  width:100%;
  display:flex;
  align-items:flex-start;
  gap:7px;
  text-align:left;
  padding:10px;
  border:1px solid #e8dfef;
  border-radius:10px;
  background:white;
  color:#46394f;
  font-size:10px;
}

.choice:hover:not(:disabled){
  border-color:#a87bd0;
  background:#faf6ff;
}

.choice.correct{
  border-color:#69bb83;
  background:#e9f9ef;
  color:#23713d;
}

.choice.wrong{
  border-color:#df7777;
  background:#fff0f0;
  color:#a43d3d;
}

.feedback{
  margin-top:9px;
  padding:10px;
  border-radius:10px;
  font-size:10px;
}

.feedback.good{
  background:#ecfaef;
  color:#246e3c;
}

.feedback.bad{
  background:#fff0f0;
  color:#a63c3c;
}

.feedback p{
  margin:5px 0 8px;
  color:#675c68;
}

/* BAG */

.bag-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
}

/* SAVE */

.save-actions{
  display:flex;
  gap:6px;
  margin-bottom:8px;
}

.save-actions > *{
  flex:1;
}

.save-text{
  width:100%;
  min-height:130px;
  resize:vertical;
  border:1px solid #ddd1e7;
  border-radius:10px;
  padding:9px;
  font-size:9px;
  line-height:1.4;
  margin-bottom:7px;
}

.file-btn{
  display:flex;
  align-items:center;
  justify-content:center;
}

.save-tip{
  padding:8px;
  border-radius:9px;
  background:#f7f2fb;
  color:#82758b;
  font-size:9px;
}

/* ONLINE */

.online-status{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  margin-bottom:7px;
  border-radius:10px;
  background:#f2fbf4;
  color:#2d7745;
  font-size:9px;
  font-weight:800;
}

.online-status small{
  color:#7b8a80;
  font-size:8px;
  font-weight:600;
}

.online-warning{
  padding:8px 10px;
  margin-bottom:7px;
  border-radius:9px;
  background:#fff6df;
  color:#86651a;
  font-size:8px;
}

/* LEADERBOARD */

.leaderboard{
  display:flex;
  flex-direction:column;
  gap:5px;
}

.rank-row{
  display:grid;
  grid-template-columns:40px 1fr 75px;
  align-items:center;
  padding:8px;
  border:1px solid #eee6f4;
  border-radius:9px;
  background:#fff;
}

.player-rank{
  background:#f2eaff;
  border-color:#cdb4e9;
}

.rank-number{
  color:#8d7e96;
  font-weight:900;
}

.rank-name{
  font-size:10px;
  font-weight:800;
}

.rank-points{
  text-align:right;
}

.rank-points b{
  display:block;
  color:#7544ad;
}

.rank-points small{
  color:#9b8e9f;
  font-size:7px;
}

/* TITLE */

.title-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
}

.title-card{
  border:1px solid #e7deef;
  border-radius:11px;
  padding:10px;
  background:white;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
}

.title-card span{
  font-size:27px;
}

.title-card b{
  font-size:9px;
}

.title-card small{
  color:#928598;
  font-size:7px;
}

.title-card.locked{
  filter:grayscale(1);
  opacity:.48;
}

.title-card.selected{
  border:2px solid #7547b0;
  background:#f6efff;
}

.title-card em{
  color:#7446ae;
  font-size:7px;
  font-style:normal;
  font-weight:900;
}

/* DIARY */


.guide-wrap{
  display:flex;
  flex-direction:column;
  gap:16px;
}

.guide-hero{
  display:flex;
  align-items:center;
  gap:14px;
  padding:16px;
  border:1px solid rgba(120,90,170,.16);
  border-radius:18px;
  background:rgba(255,255,255,.78);
}

.guide-hero-icon{
  width:58px;
  height:58px;
  flex:0 0 58px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:16px;
  font-size:30px;
  background:rgba(255,240,250,.95);
}

.guide-hero h2{
  margin:0 0 4px;
  font-size:20px;
}

.guide-hero p{
  margin:0;
  color:#5f5b70;
  line-height:1.5;
}

.guide-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:12px;
}

.guide-card{
  padding:14px;
  border-radius:16px;
  border:1px solid rgba(120,90,170,.13);
  background:#fff;
  box-shadow:0 4px 18px rgba(75,50,120,.05);
}

.guide-card h3{
  margin:0 0 8px;
  font-size:15px;
}

.guide-card p{
  margin:6px 0 0;
  color:#625d72;
  line-height:1.5;
  font-size:13px;
}

.guide-tip{
  padding:13px 14px;
  border-radius:14px;
  background:rgba(245,239,255,.92);
  color:#5d5475;
  line-height:1.5;
}

@media (max-width: 760px){
  .guide-grid{
    grid-template-columns:1fr;
  }
}

.diary-list{
  display:flex;
  flex-direction:column;
  gap:7px;
}

.diary-card{
  padding:10px;
  border:1px solid #eee5f3;
  border-radius:11px;
  background:#fff;
}

.diary-head{
  display:flex;
  justify-content:space-between;
  gap:8px;
}

.diary-head b{
  color:#624079;
  font-size:10px;
}

.diary-head span{
  color:#9a8b9e;
  font-size:8px;
}

.diary-card p{
  font-size:9px;
  color:#65596b;
}

.delta-grid{
  display:flex;
  flex-wrap:wrap;
  gap:4px;
}

.delta-grid span{
  padding:4px 6px;
  border-radius:6px;
  background:#f6f1f9;
  color:#72587e;
  font-size:7px;
}

/* PROFILE */

.profile-layout{
  display:grid;
  grid-template-columns:220px 1fr;
  gap:15px;
}

.player-name-card{
  width:100%;
  max-width:420px;
  margin:14px auto 0;
  padding:14px;
  border:1px solid rgba(126,93,190,.16);
  border-radius:18px;
  background:rgba(255,255,255,.72);
}

.player-name-card label{
  display:block;
  font-weight:800;
  margin-bottom:8px;
}

.player-name-row{
  display:flex;
  gap:8px;
}

.player-name-row input{
  flex:1;
  min-width:0;
  border:1px solid #d9d2ea;
  border-radius:12px;
  padding:10px 12px;
  background:#fff;
  outline:none;
}

.player-name-card small{
  display:block;
  margin-top:7px;
  color:#777;
}

.name-setup{
  max-width:520px;
  margin:0 auto;
  padding:18px 10px 8px;
  text-align:center;
}

.name-setup-icon{
  font-size:72px;
  margin-bottom:8px;
}

.name-setup h2{
  margin:8px 0 6px;
}

.name-setup p{
  margin:0 0 18px;
  color:#666;
}

.name-setup-input{
  width:100%;
  max-width:420px;
  border:2px solid #d9d2ea;
  border-radius:16px;
  padding:13px 16px;
  font-size:17px;
  text-align:center;
  outline:none;
  margin-bottom:12px;
}

.name-setup-input:focus,
.player-name-row input:focus{
  border-color:#a98be8;
}

.rank-name{
  display:flex;
  flex-direction:column;
  gap:2px;
  min-width:0;
}

.rank-name small{
  color:#888;
  font-size:11px;
}

.profile-character{
  text-align:center;
}

.big-character{
  min-height:220px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  border-radius:18px;
  background:linear-gradient(145deg,#f4ecff,#fff2f8);
  font-size:46px;
}

.big-character div{
  height:43px;
}

.female-profile-character .outfit-avatar{
  transform:scale(1.05);
  transform-origin:center center;
}


.profile-character h2{
  font-size:13px;
}

.profile-stats{
  display:grid;
  gap:8px;
  align-content:center;
}

.stat-top{
  display:flex;
  justify-content:space-between;
  font-size:9px;
  color:#6c5d72;
  margin-bottom:3px;
}

.bar{
  height:6px;
  overflow:hidden;
  border-radius:99px;
  background:#eee8f2;
}

.bar-fill{
  height:100%;
  border-radius:99px;
  background:linear-gradient(90deg,#7750bd,#d96cad);
}

/* ENDING */

.ending{
  text-align:center;
  padding:10px;
}

.ending-icon{
  font-size:55px;
}

.ending h1{
  color:#5e3c79;
  font-size:21px;
}

.ending p{
  color:#817586;
  font-size:10px;
  line-height:1.6;
}

.ending-stats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:7px;
  margin:12px 0;
}

.ending-stats div{
  padding:9px;
  border-radius:10px;
  background:#f8f3fb;
}

.ending-stats b{
  display:block;
  color:#7346aa;
  font-size:18px;
}

.ending-stats span{
  color:#8f8295;
  font-size:8px;
}

.final-title{
  margin:10px 0;
  padding:10px;
  border-radius:10px;
  background:#efe3ff;
  color:#7041a5;
  font-weight:900;
}

/* TOAST */

.toast{
  position:fixed;
  z-index:300;
  left:50%;
  bottom:72px;
  transform:translateX(-50%);
  max-width:min(90vw,500px);
  padding:10px 14px;
  border-radius:12px;
  background:#302238;
  color:white;
  box-shadow:0 10px 30px rgba(20,10,30,.25);
  font-size:10px;
  font-weight:700;
  text-align:center;
}

/* EMPTY */

.empty{
  padding:30px;
  text-align:center;
  color:#988b9e;
  font-size:11px;
}

/* RESPONSIVE */

@media(max-width:900px){

  .content{
    grid-template-columns:1fr;
    overflow:auto;
  }

  .side{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:8px;
  }

  .side > *{
    margin:0;
  }

  .fashion-page{
    grid-template-columns:1fr;
  }

  .fashion-preview{
    display:grid;
    grid-template-columns:180px 1fr;
    gap:10px;
  }

  .character{
    width:140px;
    height:190px;
  }
}

@media(max-width:650px){

  .game-root{
    padding:0;
  }

  .game-shell{
    width:100%;
    height:100dvh;
    border-radius:0;
  }

  .header{
    min-height:55px;
  }

  .brand h1{
    font-size:14px;
  }

  .header-actions{
    gap:3px;
  }

  .top-btn{
    width:31px;
    height:30px;
  }

  .schedule-row{
    overflow-x:auto;
  }

  .schedule-dot{
    flex:0 0 48px;
  }

  .hud{
    padding:5px;
  }

  .hud-stat{
    padding:0 7px;
  }

  .content{
    padding:6px;
  }

  .activity-grid,
  .activity-grid.large{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .npc-grid{
    grid-template-columns:1fr;
  }

  .shop-grid,
  .asset-grid,
  .cert-grid,
  .bag-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .job-grid{
    grid-template-columns:1fr;
  }

  .fashion-preview{
    display:block;
  }

  .fashion-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
    max-height:none;
  }

  .title-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .profile-layout{
    grid-template-columns:1fr;
  }

  .ending-stats{
    grid-template-columns:repeat(2,1fr);
  }

  .footer-nav{
    height:55px;
  }
}

@media(max-width:420px){

  .brand small{
    display:none;
  }

  .location-title{
    font-size:15px;
  }

  .fashion-grid{
    grid-template-columns:1fr 1fr;
  }

  .modal-backdrop{
    padding:5px;
  }

  .modal{
    max-height:96dvh;
  }
}
`;

export default function AppWithErrorBoundary(){
  return (
    <GameErrorBoundary>
      <App />
    </GameErrorBoundary>
  );
}
