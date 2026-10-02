import React, { useState, useEffect } from 'react';

// ==========================================
// 1. MẶT HÀNG & MÓN ĂN MỞ KHÓA
// ==========================================
const INITIAL_ITEMS = [
  { id: 'banh_trang', name: 'Bánh Tráng Cuộn Bơ', wholesalePrice: 8500, retailPrice: 12000, icon: '🌯', unlocked: true, targetToUnlockNext: 10, nextItemId: 'xuc_xich' },
  { id: 'tra_sua_chai', name: 'Trà Sữa Thái Chai', wholesalePrice: 13000, retailPrice: 18000, icon: '🧋', unlocked: true, targetToUnlockNext: 10, nextItemId: 'tra_dao' },
  { id: 'but_cute', name: 'Bút Bi Cute Pastel', wholesalePrice: 5500, retailPrice: 8000, icon: '🖊', unlocked: true, targetToUnlockNext: 8, nextItemId: 'hop_mau' },
  { id: 'de_cuong', name: 'Đề Cương Ôn Tập', wholesalePrice: 6500, retailPrice: 10000, icon: '📑', unlocked: true },
  // Món mở khóa khi bán đủ số lượng:
  { id: 'xuc_xich', name: 'Xúc Xích Phô Mai', wholesalePrice: 12000, retailPrice: 20000, icon: '🌭', unlocked: false, unlockDesc: 'Bán 10 phần bánh tráng để mở' },
  { id: 'tra_dao', name: 'Trà Đào Cam Sả', wholesalePrice: 18000, retailPrice: 30000, icon: '🍹', unlocked: false, unlockDesc: 'Bán 10 ly trà sữa để mở' },
  { id: 'hop_mau', name: 'Hộp Màu Dạ Quang', wholesalePrice: 20000, retailPrice: 35000, icon: '🎨', unlocked: false, unlockDesc: 'Bán 8 cây bút cute để mở' }
];

// VIỆC LÀM THÊM (CÓ TỈ LỆ ĐẬU/RỚT & PHỎNG VẤN)
const PART_TIME_JOBS = [
  { id: 'cafe', title: 'Phục vụ quán Cafe Acoustic', salary: 35000, reqStudy: 45, passRate: 75, icon: '☕', q: 'Nếu khách làm đổ nước trà ra bàn, bạn sẽ xử lý thế nào?', opts: ['Nhanh chóng lau dọn và nhẹ nhàng đổi ly nước mới cho khách', 'Đứng nhìn chờ khách tự lau', 'Gọi quản lý ra mắng khách'], c: 0 },
  { id: 'tutor', title: 'Gia sư Tiếng Việt tiểu học', salary: 60000, reqStudy: 70, passRate: 60, icon: '📖', q: 'Phương pháp nào giúp học sinh tiếp thu bài nhanh nhất?', opts: ['Kiên nhẫn giảng giải kết hợp ví dụ vui nhộn thực tế', 'Bắt học sinh chép phạt 100 lần', 'Cho học sinh chơi game cả buổi'], c: 0 },
  { id: 'convenience', title: 'Thu ngân Cửa hàng tiện lợi 24/7', salary: 45000, reqStudy: 55, passRate: 70, icon: '🏪', q: 'Khi kiểm tra tiền thừa, điều quan trọng nhất là gì?', opts: ['Đếm cẩn thận trước mặt khách và gửi hóa đơn', 'Đưa đại không cần đếm', 'Giữ lại tiền lẻ làm tiền tip'], c: 0 }
];

// TÀI SẢN MUA SẮM (XE CỘ & BẤT ĐỘNG SẢN)
const ASSETS_LIST = [
  { id: 'bike', name: 'Xe đạp cào cào thể thao', cost: 150000, repBonus: 10, loveBonus: 5, icon: '🚲', desc: 'Phương tiện vi vu chở Triệu Mẫn hóng gió sân trường.' },
  { id: 'scooter', name: 'Xe máy tay ga Vision', cost: 600000, repBonus: 30, loveBonus: 15, icon: '🛵', desc: 'Xe tay ga thời thượng, đón Triệu Mẫn đi học mỗi sáng.' },
  { id: 'car', name: 'Ô tô thể thao mui trần', cost: 3500000, repBonus: 100, loveBonus: 35, icon: '🚗', desc: 'Xế hộp đẳng cấp khiến cả trường trầm trồ nể phục.' },
  { id: 'condo', name: 'Căn hộ chung cư cao cấp', cost: 5000000, repBonus: 150, loveBonus: 45, icon: '🏢', desc: 'Không gian sống tiện nghi riêng tư cho tương lai.' },
  { id: 'villa', name: 'Biệt thự sân vườn ven sông', cost: 12000000, repBonus: 300, loveBonus: 60, icon: '🏰', desc: 'Cơ ngơi đồ sộ chứng minh bản lĩnh đại gia học đường.' }
];

const SPECIAL_GIFTS = [
  { id: 'gift_pin', name: 'Kẹp Tóc Ngọc Bích', cost: 45000, loveGain: 12, icon: '🎀', desc: 'Kẹp tóc xinh xắn Triệu Mẫn rất thích cài khi đi học.' },
  { id: 'gift_diary', name: 'Sổ Tay Thư Tình', cost: 35000, loveGain: 10, icon: '💌', desc: 'Tâm sự chân thành gửi gắm đến cô bạn lớp phó.' },
  { id: 'gift_bear', name: 'Gấu Bông Handmade', cost: 65000, loveGain: 16, icon: '🧸', desc: 'Ấm áp những đêm ôn thi đại học căng thẳng.' },
  { id: 'gift_bracelet', name: 'Vòng Tay Khắc Tên Mẫn', cost: 120000, loveGain: 25, icon: '💍', desc: 'Lời hẹn ước cùng bước vào cánh cổng đại học.' }
];

const HOLIDAYS = {
  10: { name: '20/10 Phụ Nữ Việt Nam', bonus: 1.8 },
  20: { name: '20/11 Nhà Giáo Việt Nam', bonus: 1.4 },
  30: { name: '24/12 Lễ Giáng Sinh', bonus: 2.0 },
  40: { name: '14/02 Valentine Tình Nhân', bonus: 2.5 }
};

// ==========================================
// 2. NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM ĐỒ SỘ (CÓ GIẢI THÍCH)
// ==========================================
const QUIZ_DATABASE = [
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Nếu x + 5 = 12 thì giá trị của 2x - 4 bằng bao nhiêu?', opts: ['10', '14', '7', '18'], c: 0, explain: 'x = 12 - 5 = 7. Thay vào 2*(7) - 4 = 10.' },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Đỉnh Parabol y = x² - 4x + 3 có hoành độ bằng mấy?', opts: ['2', '-2', '4', '1'], c: 0, explain: 'Hoành độ đỉnh x = -b/(2a) = 4/2 = 2.' },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Khối lập phương cạnh 3cm có thể tích là bao nhiêu?', opts: ['27 cm³', '9 cm³', '54 cm³', '18 cm³'], c: 0, explain: 'Thể tích V = a³ = 3³ = 27 cm³.' },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Đạo hàm của hàm số y = sin(2x) là gì?', opts: ['2cos(2x)', '-2cos(2x)', 'cos(2x)', '-cos(2x)'], c: 0, explain: '(sin 2x)\' = 2cos(2x).' },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Cơ năng của con lắc lò xo biến thiên thế nào khi bỏ qua ma sát?', opts: ['Bảo toàn không đổi', 'Tăng giảm tuần hoàn', 'Bằng 0', 'Luôn giảm'], c: 0, explain: 'Bỏ qua ma sát, cơ năng luôn bảo toàn.' },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Sóng âm truyền nhanh nhất trong môi trường nào?', opts: ['Chất rắn', 'Chất lỏng', 'Chất khí', 'Chân không'], c: 0, explain: 'V_rắn > V_lỏng > V_khí (chân không không truyền được âm).' },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Kim loại nào dẫn điện tốt nhất ở điều kiện thường?', opts: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'], c: 0, explain: 'Thứ tự dẫn điện: Ag > Cu > Au > Al.' },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Dung dịch axit làm quỳ tím chuyển sang màu gì?', opts: ['Đỏ', 'Xanh', 'Tím', 'Vàng'], c: 0, explain: 'Dung dịch axit làm quỳ tím chuyển đỏ.' },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Bào quan nào là “nhà máy năng lượng” của tế bào?', opts: ['Ty thể', 'Ribôxôm', 'Bộ máy Golgi', 'Lizôxôm'], c: 0, explain: 'Ty thể tổng hợp năng lượng ATP cho tế bào.' },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Ai là tác giả của truyện ngắn “Vợ Nhặt”?', opts: ['Kim Lân', 'Nam Cao', 'Tô Hoài', 'Nguyễn Tuân'], c: 0, explain: 'Kim Lân - ngòi bút xuất sắc viết về nạn đói năm 1945.' },
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Chiến thắng Điện Biên Phủ toàn thắng vào ngày nào?', opts: ['07/05/1954', '02/09/1945', '30/04/1975', '19/08/1945'], c: 0, explain: 'Chiều ngày 07/05/1954 quân ta toàn thắng tại Điện Biên Phủ.' },
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'Choose the correct word: "She has lived here ___ 2020."', opts: ['since', 'for', 'in', 'at'], c: 0, explain: 'Since đi kèm mốc thời gian xác định.' },
  { subject: 'ĐỜI SỐNG', teacher: 'Lớp 12A3', q: 'Ai là cô bạn lớp phó học tập kiêm crush đáng yêu nhất lớp?', opts: ['Triệu Mẫn', 'Thị Nở', 'Cô Năm căn tin', 'Nhỏ bạn bàn bên'], c: 0, explain: 'Chính là Triệu Mẫn - lớp phó học tập xinh xắn của bạn!' }
];

export default function App() {
  // Lấy dữ liệu tự động từ localStorage nếu có
  const savedData = (() => {
    try {
      const item = localStorage.getItem('thanh_xuan_game_autosave');
      return item ? JSON.parse(item) : null;
    } catch { return null; }
  })();

  const [playerName, setPlayerName] = useState(savedData?.playerName || 'Bạn');
  const [day, setDay] = useState(savedData?.day || 1);
  const [minuteOfDay, setMinuteOfDay] = useState(savedData?.minuteOfDay || 420);
  const [timeSpeed, setTimeSpeed] = useState(1);

  const [stats, setStats] = useState(savedData?.stats || {
    hp: 85, energy: 100, mood: 75, study: 50, love: 20, money: 40000,
    totalBanhTrangSold: 0, totalTraSuaSold: 0, totalButSold: 0,
    totalTipsReceived: 0, midtermScore: 0, finalScore: 0, reputation: 15
  });

  // Điểm thi đua của NPC (tự động cộng 50đ mỗi ngày)
  const [npcScores, setNpcScores] = useState(savedData?.npcScores || {
    mẫn: 92, lan: 68, tuan: 55, nam: 84
  });

  const [inventory, setInventory] = useState(savedData?.inventory || [
    { id: 'banh_trang', count: 3 },
    { id: 'tra_sua_chai', count: 2 },
    { id: 'but_cute', count: 2 },
    { id: 'de_cuong', count: 1 }
  ]);

  const [itemsList, setItemsList] = useState(savedData?.itemsList || INITIAL_ITEMS);
  const [ownedAssets, setOwnedAssets] = useState(savedData?.ownedAssets || []);

  const [customerOrders, setCustomerOrders] = useState([
    { id: 1, customer: 'Lan (Bạn Thân)', avatar: '👧', itemId: 'banh_trang', qty: 2, dialogue: 'Đói bụng quá nè! Cho 2 bịch bánh tráng bơ ăn lót dạ đi!', tip: 2000 },
    { id: 2, customer: 'Triệu Mẫn (Lớp Phó)', avatar: '👸', itemId: 'tra_sua_chai', qty: 1, dialogue: 'Bạn còn chai trà sữa nào mát lạnh không? Mình đang khát quá!', tip: 6000 }
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'order','wholesale','gift','jobs','assets','leaderboard','name','quiz','exam','diary','help'
  const [alertText, setAlertText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [examState, setExamState] = useState({ type: 'midterm', currentStep: 0, correctCount: 0, questions: [] });
  const [jobInterview, setJobInterview] = useState(null); // Quản lý phỏng vấn xin việc

  const showAlert = (text) => {
    setAlertText(text);
    setTimeout(() => setAlertText(''), 3000);
  };

  // TỰ ĐỘNG LƯU TRÌNH DUYỆT (AUTO-SAVE)
  useEffect(() => {
    try {
      const payload = { playerName, day, minuteOfDay, stats, npcScores, inventory, itemsList, ownedAssets };
      localStorage.setItem('thanh_xuan_game_autosave', JSON.stringify(payload));
    } catch {}
  }, [playerName, day, minuteOfDay, stats, npcScores, inventory, itemsList, ownedAssets]);

  const getSchedule = () => {
    const m = minuteOfDay;
    if (m >= 420 && m < 510) return { text: 'Đầu giờ sáng (07:00-08:30) • Quầy mở bán', canSell: true };
    if (m >= 510 && m < 555) return { text: 'Tiết 1-2 chính khóa • Cấm buôn bán', canSell: false };
    if (m >= 555 && m < 585) return { text: 'Giờ ra chơi 30 phút • Khách đông đúc!', canSell: true };
    if (m >= 585 && m < 690) return { text: 'Tiết 3-4 chính khóa • Cấm buôn bán', canSell: false };
    if (m >= 690 && m < 810) return { text: 'Nghỉ trưa & Căn tin trường', canSell: false };
    if (m >= 810 && m < 1020) return { text: 'Buổi chiều • Thư viện / Tự học', canSell: false };
    if (m >= 1020 && m < 1110) return { text: 'Tan trường 17:00 • Nhận order', canSell: true };
    return { text: 'Buổi tối • Góc học tập tại nhà', canSell: false };
  };

  const schedule = getSchedule();

  // ĐỒNG HỒ TỰ ĐỘNG CHẠY
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeSpeed === 0) return;
      setMinuteOfDay(prev => {
        if (prev >= 1350) {
          handleEndOfDay();
          return 420;
        }
        return prev + 1;
      });
    }, timeSpeed === 2 ? 400 : 800);
    return () => clearInterval(timer);
  }, [timeSpeed]);

  // KHÁCH TỰ ĐỘNG KÉO ĐẾN MỖI 3 GIÂY
  useEffect(() => {
    const custTimer = setInterval(() => {
      if (schedule.canSell && timeSpeed > 0) {
        setCustomerOrders(prev => {
          if (prev.length >= 4) return prev;
          const unlockedIds = itemsList.filter(x => x.unlocked).map(x => x.id);
          const sampleList = [
            { name: 'Tuấn (Bóng Rổ)', avatar: '🏀', itemId: 'tra_sua_chai', qty: 2, dialogue: 'Đá banh khát khô họng, cho 2 chai trà sữa lẹ bạn ơi!', tip: 4000 },
            { name: 'Hoàng Nam', avatar: '🤓', itemId: 'de_cuong', qty: 1, dialogue: 'Photo cho mình 1 bộ đề cương toán nha, gửi thêm ít tiền nè!', tip: 5000 },
            { name: 'Bảo Trân', avatar: '✨', itemId: 'but_cute', qty: 2, dialogue: 'Bút viết êm tay ghê, giao nhanh mình gửi thêm tiền nước!', tip: 3000 },
            { name: 'Triệu Mẫn', avatar: '👸', itemId: 'banh_trang', qty: 1, dialogue: 'Bánh tráng bơ thơm nức mũi, để cho Mẫn một phần nhen!', tip: 8000 }
          ];
          const newCust = sampleList[Math.floor(Math.random() * sampleList.length)];
          const validItemId = unlockedIds.includes(newCust.itemId) ? newCust.itemId : unlockedIds[0];
          return [...prev, {
            id: Date.now(), customer: newCust.name, avatar: newCust.avatar,
            itemId: validItemId, qty: newCust.qty, dialogue: newCust.dialogue, tip: newCust.tip
          }];
        });
      }
    }, 3000);
    return () => clearInterval(custTimer);
  }, [schedule.canSell, timeSpeed, itemsList]);

  // Hết ngày & chuyển sang ngày mới
  const handleEndOfDay = () => {
    setActiveModal('diary');
    setStats(prev => ({ ...prev, energy: 100, money: prev.money + 15000 }));
    // NPC TỰ ĐỘNG CỘNG 50 ĐIỂM THI ĐUA MỖI NGÀY
    setNpcScores(prev => ({
      mẫn: prev.mẫn + 50,
      lan: prev.lan + 45,
      tuan: prev.tuan + 35,
      nam: prev.nam + 48
    }));
  };

  const nextDay = () => {
    setActiveModal(null);
    setDay(prev => {
      const next = prev + 1;
      if (next === 22) triggerExam('midterm');
      if (next >= 45) triggerExam('final');
      return next;
    });
    setMinuteOfDay(420);
  };

  // Trả đơn order & kiểm tra MỞ KHÓA MÓN ĂN MỚI
  const fulfillOrder = (orderId) => {
    const ord = customerOrders.find(o => o.id === orderId);
    if (!ord) return;
    const inv = inventory.find(i => i.id === ord.itemId);
    const itemInfo = itemsList.find(i => i.id === ord.itemId);

    if (!inv || inv.count < ord.qty) {
      showAlert('Kho không đủ hàng! Vào Chợ Sỉ ngay!');
      return;
    }

    setInventory(prev => prev.map(i => i.id === ord.itemId ? { ...i, count: i.count - ord.qty } : i));
    setCustomerOrders(prev => prev.filter(o => o.id !== orderId));

    const isCrush = ord.customer.includes('Triệu Mẫn');
    const earned = (itemInfo.retailPrice * ord.qty) + ord.tip;

    let newBanhTrang = stats.totalBanhTrangSold;
    let newTraSua = stats.totalTraSuaSold;
    let newBut = stats.totalButSold;

    if (ord.itemId === 'banh_trang') newBanhTrang += ord.qty;
    if (ord.itemId === 'tra_sua_chai') newTraSua += ord.qty;
    if (ord.itemId === 'but_cute') newBut += ord.qty;

    // KIỂM TRA MỞ KHÓA MÓN ĂN MỚI
    setItemsList(prev => prev.map(item => {
      if (item.id === 'xuc_xich' && !item.unlocked && newBanhTrang >= 10) {
        showAlert('🎉 ĐÃ MỞ KHÓA MÓN MỚI: XÚC XÍCH NƯỚNG PHÔ MAI!');
        return { ...item, unlocked: true };
      }
      if (item.id === 'tra_dao' && !item.unlocked && newTraSua >= 10) {
        showAlert('🎉 ĐÃ MỞ KHÓA MÓN MỚI: TRÀ ĐÀO CAM SẢ KHỔNG LỒ!');
        return { ...item, unlocked: true };
      }
      if (item.id === 'hop_mau' && !item.unlocked && newBut >= 8) {
        showAlert('🎉 ĐÃ MỞ KHÓA VẬT PHẨM MỚI: HỘP MÀU DẠ QUANG!');
        return { ...item, unlocked: true };
      }
      return item;
    }));

    setStats(prev => ({
      ...prev,
      money: prev.money + earned,
      mood: Math.min(100, prev.mood + 5),
      love: isCrush ? Math.min(100, prev.love + 8) : prev.love,
      totalBanhTrangSold: newBanhTrang,
      totalTraSuaSold: newTraSua,
      totalButSold: newBut,
      totalTipsReceived: prev.totalTipsReceived + ord.tip
    }));

    showAlert(`⭐ Giao thành công! Thu về +${earned.toLocaleString('vi-VN')}đ`);
  };

  const buyWholesale = (itemId) => {
    const item = itemsList.find(i => i.id === itemId);
    const cost = item.wholesalePrice * 3;
    if (stats.money < cost) {
      showAlert('Tiền trong ví không đủ!');
      return;
    }
    setStats(prev => ({ ...prev, money: prev.money - cost }));
    setInventory(prev => {
      const exists = prev.find(i => i.id === itemId);
      if (exists) return prev.map(i => i.id === itemId ? { ...i, count: i.count + 3 } : i);
      return [...prev, { id: itemId, count: 3 }];
    });
    showAlert(`📦 Đã nhập 3 ${item.name}!`);
  };

  const giveGift = (giftId) => {
    const g = SPECIAL_GIFTS.find(x => x.id === giftId);
    if (stats.money < g.cost) {
      showAlert('Tiền tiết kiệm không đủ mua quà này!');
      return;
    }
    const hol = HOLIDAYS[day];
    const mult = hol ? hol.bonus : 1.0;
    const gainedLove = Math.round(g.loveGain * mult);

    setStats(prev => ({
      ...prev,
      money: prev.money - g.cost,
      love: Math.min(100, prev.love + gainedLove),
      mood: Math.min(100, prev.mood + 15)
    }));
    setActiveModal(null);
    showAlert(`💕 Triệu Mẫn nhận quà và mỉm cười e thẹn! (+${gainedLove}% 💕)`);
  };

  // MUA SẮM NHÀ CỬA & XE CỘ
  const buyAsset = (assetId) => {
    const asset = ASSETS_LIST.find(a => a.id === assetId);
    if (stats.money < asset.cost) {
      showAlert('Tiền trong ví không đủ mua tài sản này!');
      return;
    }
    setStats(prev => ({
      ...prev,
      money: prev.money - asset.cost,
      reputation: prev.reputation + asset.repBonus,
      love: Math.min(100, prev.love + asset.loveBonus)
    }));
    setOwnedAssets(prev => [...prev, asset.id]);
    setActiveModal(null);
    showAlert(`🎉 Đã sở hữu ${asset.name}! Danh tiếng và điểm hảo cảm Triệu Mẫn tăng mạnh!`);
  };

  // PHỎNG VẤN & ĐI LÀM THÊM (PART-TIME)
  const applyJob = (job) => {
    if (stats.study < job.reqStudy) {
      showAlert(`Điểm học tập chưa đủ (${stats.study}/${job.reqStudy}) để ứng tuyển!`);
      return;
    }
    setJobInterview(job);
  };

  const submitJobAnswer = (idx) => {
    const isCorrect = idx === jobInterview.c;
    const passed = isCorrect && (Math.random() * 100 <= jobInterview.passRate);
    if (passed) {
      setStats(prev => ({
        ...prev,
        money: prev.money + jobInterview.salary,
        energy: Math.max(0, prev.energy - 20),
        reputation: prev.reputation + 5
      }));
      alert(`🎉 PHỎNG VẤN THÀNH CÔNG!\nBạn được nhận vào làm "${jobInterview.title}" và hoàn thành ca làm việc, nhận lương +${jobInterview.salary.toLocaleString('vi-VN')}đ!`);
    } else {
      setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 10), energy: Math.max(0, prev.energy - 10) }));
      alert(`😭 RẤT TIẾC, BẠN ĐÃ RỚT PHỎNG VẤN!\nNhà tuyển dụng đánh giá câu trả lời chưa phù hợp hoặc tỉ lệ chọi quá cao. Hãy ôn luyện và thử lại sau nhé!`);
    }
    setJobInterview(null);
    setActiveModal(null);
    setMinuteOfDay(prev => prev + 60);
  };

  // Trả lời câu hỏi trên lớp - TRỪ ĐIỂM THI ĐUA NẾU TRẢ LỜI SAI
  const startQuiz = () => {
    const q = QUIZ_DATABASE[Math.floor(Math.random() * QUIZ_DATABASE.length)];
    setCurrentQuiz(q);
    setActiveModal('quiz');
  };

  const answerQuiz = (index) => {
    const isCorrect = index === currentQuiz.c;
    if (isCorrect) {
      setStats(prev => ({ ...prev, study: prev.study + 8, mood: Math.min(100, prev.mood + 5), energy: Math.max(0, prev.energy - 10) }));
    } else {
      // BỊ TRỪ 5 ĐIỂM THI ĐUA KHI TRẢ LỜI SAI
      setStats(prev => ({ ...prev, study: Math.max(0, prev.study - 5), mood: Math.max(0, prev.mood - 5), energy: Math.max(0, prev.energy - 10) }));
    }

    setFeedback({
      isCorrect,
      selected: currentQuiz.opts[index],
      correctAns: currentQuiz.opts[currentQuiz.c],
      explain: currentQuiz.explain,
      onNext: () => {
        setFeedback(null);
        setActiveModal(null);
        setMinuteOfDay(prev => prev + 25);
      }
    });
  };

  // Thi giữa / cuối kỳ
  const triggerExam = (type) => {
    const shuffled = [...QUIZ_DATABASE].sort(() => 0.5 - Math.random()).slice(0, 10);
    setExamState({ type, currentStep: 0, correctCount: 0, questions: shuffled });
    setActiveModal('exam');
  };

  const answerExam = (idx) => {
    const q = examState.questions[examState.currentStep];
    const isCorrect = idx === q.c;
    const newCorrect = isCorrect ? examState.correctCount + 1 : examState.correctCount;

    setFeedback({
      isCorrect,
      selected: q.opts[idx],
      correctAns: q.opts[q.c],
      explain: q.explain,
      onNext: () => {
        setFeedback(null);
        if (examState.currentStep + 1 < 10) {
          setExamState(prev => ({ ...prev, currentStep: prev.currentStep + 1, correctCount: newCorrect }));
        } else {
          setActiveModal(null);
          if (examState.type === 'midterm') {
            setStats(prev => ({ ...prev, midtermScore: newCorrect, study: prev.study + (newCorrect * 3) }));
            alert(`🎉 KẾT QUẢ GIỮA KỲ: Đúng ${newCorrect}/10 câu!`);
          } else {
            setStats(prev => ({ ...prev, finalScore: newCorrect }));
            alert(`🎓 KẾT QUẢ TỐT NGHIỆP: Đúng ${newCorrect}/10 câu!`);
          }
        }
      }
    });
  };

  const interactNPC = (who) => {
    if (who === 'mẫn') {
      setStats(prev => ({ ...prev, love: Math.min(100, prev.love + 5), mood: Math.min(100, prev.mood + 10) }));
      showAlert(`💕 Triệu Mẫn: "${playerName} ơi, nhớ chăm học để tụi mình cùng đỗ trường top nhen!" (+5 💕)`);
    } else if (who === 'lan') {
      setStats(prev => ({ ...prev, mood: Math.min(100, prev.mood + 10), study: prev.study + 2 }));
      showAlert(`👧 Lan: "Hôm nay cô kiểm tra bài cũ đấy, chép bài nhanh lên ${playerName}!"`);
    } else if (who === 'tuan') {
      setStats(prev => ({ ...prev, hp: Math.min(100, prev.hp + 5), mood: Math.min(100, prev.mood + 10) }));
      showAlert(`🏀 Tuấn: "Ra sân ném 3 điểm với tao một ván cho giãn gân cốt nào ${playerName}!"`);
    }
    setMinuteOfDay(prev => prev + 15);
  };

  const hours = Math.floor(minuteOfDay / 60);
  const mins = minuteOfDay % 60;
  const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', color: '#f8fafc', fontFamily: 'sans-serif', userSelect: 'none' }}>
      
      {alertText && (
        <div style={{ position: 'fixed', top: '16px', zIndex: 100, background: 'rgba(2, 6, 23, 0.95)', border: '2px solid #10b981', color: '#34d399', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 8px 24px rgba(0,0,0,0.8)' }}>
          {alertText}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '880px', background: 'linear-gradient(145deg, #0f172a, #020617)', border: '4px solid #1e293b', borderRadius: '28px', padding: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        
        {/* HEADER TOOLBAR NÚT CHỨC NĂNG */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ fontSize: '12px', fontWeight: '900', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', display: 'inline-block' }}></span>
            THANH XUÂN RỰC RỠ 8.0
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveModal('jobs')} style={{ background: '#0284c7', color: '#fff', border: '1px solid #38bdf8', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>💼 VIỆC LÀM</button>
            <button onClick={() => setActiveModal('assets')} style={{ background: '#7c3aed', color: '#fff', border: '1px solid #a78bfa', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🚗 MUA SẮM</button>
            <button onClick={() => setActiveModal('gift')} style={{ background: '#9d174d', color: '#fff', border: '1px solid #db2777', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🎁 TẶNG QUÀ</button>
            <button onClick={() => setActiveModal('leaderboard')} style={{ background: '#b45309', color: '#fff', border: '1px solid #f59e0b', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🏆 THI ĐUA</button>
            <button onClick={() => setActiveModal('name')} style={{ background: '#1e293b', color: '#fde047', border: '1px solid #475569', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>👤 ĐỔI TÊN</button>
            <button onClick={() => setActiveModal('help')} style={{ background: '#0f766e', color: '#fff', border: '1px solid #14b8a6', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📖 HƯỚNG DẪN</button>
          </div>
        </div>

        {/* MÀN HÌNH CHÍNH */}
        <div style={{ background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)', border: '2px solid #1e293b', borderRadius: '20px', padding: '14px', position: 'relative' }}>
          
          {/* HUD CHỈ SỐ */}
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '2px solid #334155', borderRadius: '14px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: '900', color: '#fde047', fontSize: '13px' }}>
                <span onClick={() => setActiveModal('name')} style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>{playerName.toUpperCase()}</span> • 
                <span style={{ color: '#34d399', fontFamily: 'monospace', marginLeft: '6px', background: '#020617', padding: '2px 6px', borderRadius: '6px' }}>{timeStr}</span> • 
                <span style={{ color: '#93c5fd', marginLeft: '6px' }}>NGÀY {day}/45</span>
                {HOLIDAYS[day] && <span style={{ marginLeft: '6px', background: '#9d174d', color: '#fbcfe8', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>🌸 {HOLIDAYS[day].name}</span>}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{schedule.text}</div>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '4px', background: '#020617', padding: '2px 6px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <button onClick={() => setTimeSpeed(0)} style={{ background: timeSpeed === 0 ? '#b45309' : '#1e293b', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>⏸️</button>
                <button onClick={() => setTimeSpeed(1)} style={{ background: timeSpeed === 1 ? '#1e40af' : '#1e293b', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>▶️ 1x</button>
                <button onClick={() => setTimeSpeed(2)} style={{ background: timeSpeed === 2 ? '#065f46' : '#1e293b', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>⏩ 2x</button>
              </div>

              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#fb7185', fontSize: '11px', fontFamily: 'monospace' }}>❤️ {stats.hp}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#fde047', fontSize: '11px', fontFamily: 'monospace' }}>⚡ {stats.energy}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#38bdf8', fontSize: '11px', fontFamily: 'monospace' }} title="Sai bị trừ 5đ">📚 {stats.study}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#f472b6', fontSize: '11px', fontFamily: 'monospace' }}>💕 {stats.love}%</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#34d399', fontSize: '11px', fontFamily: 'monospace' }}>💰 {stats.money.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* SÂN TRƯỜNG & KHU TƯƠNG TÁC */}
          <div style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.95) 100%)', border: '2px solid #1e293b', borderRadius: '16px', padding: '16px', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: '#020617', padding: '4px 10px', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', fontWeight: 'bold', color: '#fde047' }}>
                🏫 LỚP 12A3 - KHỐI CHUYÊN
              </div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: schedule.canSell ? '#064e3b' : '#4c0519', color: schedule.canSell ? '#a7f3d0' : '#fecdd3', border: `1px solid ${schedule.canSell ? '#10b981' : '#e11d48'}` }}>
                {schedule.canSell ? '🟢 ĐƯỢC PHÉP BÁN HÀNG' : '🔒 ĐANG TRONG TIẾT HỌC'}
              </div>
            </div>

            {/* NHÂN VẬT ĐỒNG HÀNH */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '14px' }}>
                <div onClick={() => interactNPC('lan')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px' }}>👧</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#7dd3fc', background: '#1e293b', padding: '2px 8px', borderRadius: '6px', marginTop: '4px' }}>Lan (Bạn Thân)</div>
                </div>
                <div onClick={() => interactNPC('mẫn')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px' }}>👸</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f472b6', background: '#1e293b', border: '1px solid #db2777', padding: '2px 8px', borderRadius: '6px', marginTop: '4px' }}>Triệu Mẫn (Lớp Phó) 💕</div>
                </div>
                <div onClick={() => interactNPC('tuan')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px' }}>🏀</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fde047', background: '#1e293b', padding: '2px 8px', borderRadius: '6px', marginTop: '4px' }}>Tuấn (Bóng Rổ)</div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed)', color: 'white', fontWeight: '900', fontSize: '12px', padding: '6px 16px', borderRadius: '8px', display: 'inline-block' }}>
                {schedule.canSell ? '🔥 KHÁCH ĐANG TỰ ĐỘNG KÉO ĐẾN MỖI 3 GIÂY!' : '⚠️ TRẢ LỜI SAI CÂU HỎI SẼ BỊ TRỪ 5 ĐIỂM THI ĐUA!'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
              <button onClick={() => setMinuteOfDay(prev => prev + 30)} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>⏩ Tua 30 Phút</button>
              <button onClick={startQuiz} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📚 Trả Lời Câu Hỏi</button>
            </div>
          </div>

          {/* NÚT THAO TÁC CHÍNH DƯỚI CÙNG */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={() => { if (!schedule.canSell) { showAlert('Giờ học quầy đóng cửa!'); return; } setActiveModal('order'); }} style={{ flex: 1, background: '#065f46', color: '#ecfdf5', border: '2px solid #10b981', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>
              🛎️ Quầy Order ({customerOrders.length})
            </button>
            <button onClick={startQuiz} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '2px solid #475569', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              📖 Trả Lời Thầy Cô
            </button>
            <button onClick={() => setActiveModal('wholesale')} style={{ flex: 1, background: '#1e40af', color: '#eff6ff', border: '2px solid #3b82f6', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              🚚 Chợ Sỉ Nhập Hàng
            </button>
            <button onClick={() => setActiveModal('diary')} style={{ flex: 1, background: '#b45309', color: '#fffbeb', border: '2px solid #f59e0b', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              📓 Xem Nhật Ký
            </button>
          </div>

          {/* ========================================================
              POPUP ĐÁNH GIÁ ĐÁP ÁN (HIỂN THỊ ĐÁP ÁN ĐÚNG NẾU SAI)
              ======================================================== */}
          {feedback && (
            <div style={{ position: 'absolute', inset: '10px', background: 'rgba(2, 6, 23, 0.95)', border: `2px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`, borderRadius: '16px', padding: '20px', zIndex: 80, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: feedback.isCorrect ? '#34d399' : '#f87171', marginBottom: '8px' }}>
                  {feedback.isCorrect ? '🎉 CHÍNH XÁC! (+8 📚)' : '❌ BẠN ĐÃ TRẢ LỜI SAI! (-5 ĐIỂM THI ĐUA)'}
                </div>
                {!feedback.isCorrect && (
                  <div style={{ background: '#450a0a', border: '1px solid #dc2626', padding: '10px', borderRadius: '8px', color: '#fecaca', fontSize: '13px', marginBottom: '12px' }}>
                    <div>Bạn đã chọn: <b>{feedback.selected}</b></div>
                    <div style={{ color: '#34d399', marginTop: '4px' }}>👉 Đáp án chính xác là: <b>{feedback.correctAns}</b></div>
                  </div>
                )}
                {feedback.explain && (
                  <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '10px', borderRadius: '8px', color: '#cbd5e1', fontSize: '12px', lineHeight: 1.5 }}>
                    💡 <b>Giải thích chi tiết:</b> {feedback.explain}
                  </div>
                )}
              </div>
              <button onClick={feedback.onNext} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: '16px' }}>
                Tiếp Tục ➔
              </button>
            </div>
          )}

          {/* MODAL VIỆC LÀM THÊM (PART-TIME) */}
          {activeModal === 'jobs' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #0284c7', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#38bdf8', fontSize: '13px' }}>💼 XIN VIỆC LÀM THÊM (PHỎNG VẤN & CÓ TỈ LỆ RỚT)</b>
                <button onClick={() => { setActiveModal(null); setJobInterview(null); }} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>

              {!jobInterview ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                  {PART_TIME_JOBS.map(job => (
                    <div key={job.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{job.icon} {job.title}</div>
                        <div style={{ color: '#34d399', fontSize: '11px', marginTop: '2px' }}>Lương: +{job.salary.toLocaleString('vi-VN')}đ/ca • Yêu cầu: {job.reqStudy} 📚 • Tỉ lệ đậu: {job.passRate}%</div>
                      </div>
                      <button onClick={() => applyJob(job)} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                        Ứng Tuyển
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    <div style={{ color: '#fde047', fontWeight: 'bold', fontSize: '12px' }}>PHỎNG VẤN: {jobInterview.title}</div>
                    <p style={{ fontSize: '13px', margin: '14px 0', lineHeight: 1.5 }}>"{jobInterview.q}"</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {jobInterview.opts.map((opt, idx) => (
                      <button key={idx} onClick={() => submitJobAnswer(idx)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #475569', padding: '10px', borderRadius: '8px', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>
                        <b>{String.fromCharCode(65 + idx)}.</b> {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODAL MUA SẮM (XE CỘ & BẤT ĐỘNG SẢN) */}
          {activeModal === 'assets' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #7c3aed', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#c084fc', fontSize: '13px' }}>🚗 SÀN GIAO DỊCH TÀI SẢN (XE & BẤT ĐỘNG SẢN)</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {ASSETS_LIST.map(asset => {
                  const owned = ownedAssets.includes(asset.id);
                  return (
                    <div key={asset.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: `1px solid ${owned ? '#059669' : '#1e293b'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{asset.icon} {asset.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '10px' }}>{asset.desc}</div>
                        <div style={{ color: '#fde047', fontSize: '11px', marginTop: '2px' }}>Giá: {asset.cost.toLocaleString('vi-VN')}đ • +{asset.repBonus} Uy tín • +{asset.loveBonus}% Triệu Mẫn 💕</div>
                      </div>
                      <button onClick={() => buyAsset(asset.id)} disabled={owned} style={{ background: owned ? '#334155' : '#7c3aed', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: owned ? 'default' : 'pointer' }}>
                        {owned ? 'ĐÃ SỞ HỮU' : 'Mua Ngay'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODAL ORDER */}
          {activeModal === 'order' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #10b981', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#34d399', fontSize: '13px' }}>🛎️ DANH SÁCH ORDER TỰ ĐỘNG</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', background: '#020617', padding: '8px', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}>
                {inventory.map(i => <span key={i.id}>{itemsList.find(x => x.id === i.id)?.icon} {i.count}</span>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {customerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '11px' }}>Khách đang tới quầy, bạn chờ vài giây nhé...</div>
                ) : (
                  customerOrders.map(ord => {
                    const item = itemsList.find(x => x.id === ord.itemId);
                    const inv = inventory.find(x => x.id === ord.itemId);
                    const canFulfill = (inv?.count || 0) >= ord.qty;
                    return (
                      <div key={ord.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: `1px solid ${canFulfill ? '#059669' : '#dc2626'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{ord.avatar} {ord.customer} <span style={{ color: '#fde047', fontSize: '10px' }}>⭐⭐⭐⭐⭐</span></div>
                          <div style={{ color: '#94a3b8', fontSize: '11px', fontStyle: 'italic' }}>"{ord.dialogue}"</div>
                          <div style={{ color: '#fde047', fontSize: '11px', marginTop: '2px' }}>Order: <b>{ord.qty}x {item?.name}</b> <span style={{ color: '#34d399' }}>(+Tip {ord.tip.toLocaleString('vi-VN')}đ)</span></div>
                        </div>
                        <button onClick={() => fulfillOrder(ord.id)} style={{ background: canFulfill ? '#059669' : '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: canFulfill ? 'pointer' : 'default' }}>
                          {canFulfill ? 'Giao Đơn' : 'Hết Hàng'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* MODAL CHỢ SỈ (CÓ MÓN ĂN MỞ KHÓA) */}
          {activeModal === 'wholesale' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #3b82f6', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#60a5fa', fontSize: '13px' }}>🚚 CHỢ SỈ ĐẦU MỐI (BÁN ĐỦ ĐỂ MỞ MÓN MỚI)</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {itemsList.map(item => (
                  <div key={item.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: `1px solid ${item.unlocked ? '#1e293b' : '#450a0a'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.icon} {item.name} {!item.unlocked && <span style={{ color: '#f87171', fontSize: '10px' }}>(🔒 {item.unlockDesc})</span>}</div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>Giá sỉ: <b style={{ color: '#60a5fa' }}>{item.wholesalePrice.toLocaleString('vi-VN')}đ</b> • Bán: {item.retailPrice.toLocaleString('vi-VN')}đ</div>
                    </div>
                    {item.unlocked ? (
                      <button onClick={() => buyWholesale(item.id)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                        Nhập 3 Cái ({(item.wholesalePrice * 3).toLocaleString('vi-VN')}đ)
                      </button>
                    ) : (
                      <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 'bold' }}>CHƯA MỞ</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODAL TẶNG QUÀ */}
          {activeModal === 'gift' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #db2777', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#f472b6', fontSize: '13px' }}>🎁 TIỆM QUÀ DÀNH CHO TRIỆU MẪN</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {SPECIAL_GIFTS.map(g => (
                  <div key={g.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{g.icon} {g.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '10px' }}>{g.desc}</div>
                      <div style={{ color: '#f472b6', fontSize: '11px', marginTop: '2px' }}>Giá: {g.cost.toLocaleString('vi-VN')}đ • Hiệu quả: +{g.loveGain}% 💕</div>
                    </div>
                    <button onClick={() => giveGift(g.id)} style={{ background: '#db2777', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                      Tặng Mẫn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODAL THI ĐUA (NPC TỰ ĐỘNG CỘNG 50Đ MỖI NGÀY) */}
          {activeModal === 'leaderboard' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #f59e0b', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#fde047', fontSize: '13px' }}>🏆 BẢNG THI ĐUA LỚP 12A3 (NPC CỘNG 50Đ/NGÀY)</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Triệu Mẫn (Lớp Phó)', score: npcScores.mẫn, avatar: '👸' },
                  { name: `${playerName} (Bạn)`, score: stats.study, avatar: '😎' },
                  { name: 'Hoàng Nam', score: npcScores.nam, avatar: '🤓' },
                  { name: 'Lan (Bạn Thân)', score: npcScores.lan, avatar: '👧' },
                  { name: 'Tuấn (Bóng Rổ)', score: npcScores.tuan, avatar: '🏀' }
                ].sort((a,b) => b.score - a.score).map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: '#020617', padding: '8px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <span>#{idx+1} {s.avatar} <b>{s.name}</b></span>
                    <b style={{ color: '#34d399' }}>{s.score} 📚</b>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODAL TRẮC NGHIỆM TRÊN LỚP */}
          {activeModal === 'quiz' && currentQuiz && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #38bdf8', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                  <b style={{ color: '#93c5fd' }}>{currentQuiz.subject} - {currentQuiz.teacher}</b>
                  <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 'bold' }}>Sai bị trừ 5đ thi đua!</span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '16px 0', lineHeight: 1.5 }}>{currentQuiz.q}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {currentQuiz.opts.map((opt, idx) => (
                  <button key={idx} onClick={() => answerQuiz(idx)} style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}>
                    <b style={{ color: '#fde047' }}>{String.fromCharCode(65 + idx)}.</b> {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODAL ĐỔI TÊN */}
          {activeModal === 'name' && (
            <div style={{ position: 'absolute', inset: '20px', margin: 'auto', maxWidth: '380px', height: '180px', background: '#0f172a', border: '2px solid #38bdf8', borderRadius: '16px', padding: '16px', zIndex: 70, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <b style={{ color: '#38bdf8' }}>✍️ NHẬP TÊN CỦA BẠN:</b>
              <input type="text" maxLength={16} defaultValue={playerName} id="nameInputBox" style={{ background: '#020617', border: '2px solid #334155', borderRadius: '8px', padding: '8px', color: '#fde047', fontWeight: 'bold', fontSize: '13px', outline: 'none' }} />
              <button onClick={() => {
                const val = document.getElementById('nameInputBox')?.value.trim();
                if (val) setPlayerName(val);
                setActiveModal(null);
                showAlert('Đã lưu tên thành công!');
              }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Xác Nhận Tên 🚀
              </button>
            </div>
          )}

          {/* MODAL THI CỬ */}
          {activeModal === 'exam' && examState.questions.length > 0 && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #f59e0b', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                  <b style={{ color: '#fde047' }}>KỲ THI: CÂU {examState.currentStep + 1} / 10</b>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>Đang đúng: {examState.correctCount}/10</span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '16px 0', lineHeight: 1.5 }}>{examState.questions[examState.currentStep]?.q}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {examState.questions[examState.currentStep]?.opts.map((opt, idx) => (
                  <button key={idx} onClick={() => answerExam(idx)} style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}>
                    <b style={{ color: '#fde047' }}>{String.fromCharCode(65 + idx)}.</b> {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODAL NHẬT KÝ */}
          {activeModal === 'diary' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#fef3c7', color: '#78350f', border: '2px solid #d97706', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <b style={{ fontSize: '14px', color: '#92400e' }}>📓 NHẬT KÝ NGÀY {day}</b>
                <p style={{ fontStyle: 'italic', fontSize: '12px', marginTop: '10px', lineHeight: 1.6 }}>
                  Một ngày học tập và kinh doanh của {playerName} tại lớp 12A3 đã khép lại. Điểm học tập hiện tại là {stats.study}, ví tiền tích lũy được {stats.money.toLocaleString('vi-VN')}đ và tình cảm cùng Triệu Mẫn đạt {stats.love}%. Các bạn trong lớp đã cày thêm 50 điểm thi đua!
                </p>
              </div>
              <button onClick={nextDay} style={{ background: '#92400e', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Thức Dậy Ngày Mới ☀️
              </button>
            </div>
          )}

          {/* MODAL HƯỚNG DẪN */}
          {activeModal === 'help' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #14b8a6', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#2dd4bf', fontSize: '13px' }}>📖 HƯỚNG DẪN CẬP NHẬT 8.0</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#cbd5e1' }}>
                <p>• <b>Tự động lưu:</b> Mọi hành động được tự lưu vào máy, bật lại web chơi tiếp bình thường.</p>
                <p>• <b>Mở khóa món mới:</b> Bán đủ 10 bánh tráng mở Xúc xích nướng; 10 trà sữa mở Trà đào; 8 bút mở Hộp màu!</p>
                <p>• <b>Phạt thi đua:</b> Trả lời sai trên lớp bị <b>trừ 5 điểm thi đua</b> (có hiện đáp án đúng để học).</p>
                <p>• <b>NPC tự cày:</b> Mỗi ngày mới, các đối thủ trong lớp tự động được <b>cộng 50 điểm thi đua</b>.</p>
                <p>• <b>Việc làm & Tài sản:</b> Phỏng vấn xin việc làm thêm kiếm lương ca; tích lũy tiền sắm xe máy, ô tô, biệt thự!</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
