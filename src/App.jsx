import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. DỮ LIỆU ĐỒ DÙNG, QUÀ TẶNG & CHỨNG CHỈ
// ==========================================
const WHOLESALE_ITEMS = [
  { id: 'banh_trang', name: 'Bánh Tráng Cuộn Bơ', wholesalePrice: 8500, retailPrice: 12000, icon: '🌯' },
  { id: 'tra_sua_chai', name: 'Trà Sữa Thái Chai', wholesalePrice: 13000, retailPrice: 18000, icon: '🧋' },
  { id: 'but_cute', name: 'Bút Bi Cute Pastel', wholesalePrice: 5500, retailPrice: 8000, icon: '🖊️️' },
  { id: 'de_cuong', name: 'Đề Cương Ôn Tập', wholesalePrice: 6500, retailPrice: 10000, icon: '📑' }
];

const CERTIFICATES_DEF = [
  { id: 'cert_mos', name: 'Tin Học MOS (Word/Excel)', cost: 50000, reqStudy: 60, icon: '💻', desc: 'Thành thạo văn phòng, +10 Uy tín' },
  { id: 'cert_accounting', name: 'Kế Toán Doanh Nghiệp', cost: 80000, reqStudy: 70, icon: '📊', desc: 'Quản lý sổ sách, +15% tiền tip đơn hàng' },
  { id: 'cert_toeic', name: 'Tiếng Anh TOEIC 650+', cost: 120000, reqStudy: 75, icon: '📘', desc: 'Giao tiếp chuẩn, cộng vĩnh viễn +15 📚' },
  { id: 'cert_ielts', name: 'IELTS Academic 7.0+', cost: 200000, reqStudy: 85, icon: '📕', desc: 'Tuyển thẳng đại học quốc tế!' }
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
// 2. NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM ĐỒ SỘ (100+ CÂU)
// ==========================================
const QUIZ_DATABASE = [
  // Toán học
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Nếu x + 5 = 12 thì 2x - 4 bằng bao nhiêu?', opts: ['10', '14', '7', '18'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Đỉnh Parabol y = x² - 4x + 3 có hoành độ bằng mấy?', opts: ['2', '-2', '4', '1'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Khối lập phương cạnh 3cm có thể tích là bao nhiêu?', opts: ['27 cm³', '9 cm³', '54 cm³', '18 cm³'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Đạo hàm của hàm số y = sin(2x) là gì?', opts: ['2cos(2x)', '-2cos(2x)', 'cos(2x)', '-cos(2x)'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Tập xác định của hàm số y = 1/(x - 2) là gì?', opts: ['R \\ {2}', 'R', '(2; +∞)', '[2; +∞)'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Số mặt của một hình tứ diện đều là bao nhiêu?', opts: ['4 mặt', '6 mặt', '8 mặt', '12 mặt'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Tích phân từ 0 đến 1 của 2x dx bằng bao nhiêu?', opts: ['1', '2', '0', '0.5'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Giá trị của log₂(8) bằng bao nhiêu?', opts: ['3', '4', '2', '8'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Số nghiệm của phương trình x² + 1 = 0 trên tập số thực là?', opts: ['0', '1', '2', 'Vô số'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Công thức tính diện tích hình tròn bán kính R là?', opts: ['πR²', '2πR', '4πR²', 'πR'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Nếu cấp số cộng có u₁ = 2, công sai d = 3 thì u₂ bằng?', opts: ['5', '6', '7', '8'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Đồ thị hàm số y = x³ - 3x có bao nhiêu điểm cực trị?', opts: ['2', '0', '1', '3'], c: 0 },

  // Vật lý
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Cơ năng của con lắc lò xo biến thiên thế nào khi bỏ qua ma sát?', opts: ['Bảo toàn không đổi', 'Tăng giảm tuần hoàn', 'Bằng 0', 'Luôn giảm'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Sóng âm truyền nhanh nhất trong môi trường nào?', opts: ['Chất rắn', 'Chất lỏng', 'Chất khí', 'Chân không'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Đơn vị đo điện trở trong hệ SI là gì?', opts: ['Ôm (Ω)', 'Vôn (V)', 'Ampe (A)', 'Oát (W)'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Quang phổ liên tục do vật nào phát ra khi bị nung nóng?', opts: ['Chất rắn, lỏng hoặc khí có áp suất lớn', 'Khí áp suất thấp', 'Chỉ chất lỏng', 'Chất khí loãng'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Chu kỳ dao động T của con lắc đơn phụ thuộc vào yếu tố nào?', opts: ['Chiều dài dây treo và gia tốc trọng trường', 'Khối lượng quả nặng', 'Biên độ dao động', 'Vận tốc ban đầu'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Tốc độ ánh sáng trong chân không xấp xỉ bằng bao nhiêu?', opts: ['3.10⁸ m/s', '3.10⁶ m/s', '340 m/s', '3.10⁵ km/h'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Hiện tượng tán sắc ánh sáng được phát hiện lần đầu bởi ai?', opts: ['Newton', 'Einstein', 'Galileo', 'Huygens'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Dòng điện xoay chiều ở Việt Nam có tần số chuẩn là bao nhiêu?', opts: ['50 Hz', '60 Hz', '100 Hz', '120 Hz'], c: 0 },

  // Hóa học
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Kim loại nào dẫn điện tốt nhất ở điều kiện thường?', opts: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Dung dịch axit làm quỳ tím chuyển sang màu gì?', opts: ['Đỏ', 'Xanh', 'Tím', 'Vàng'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Chất nào sau đây thuộc loại monosaccarit?', opts: ['Glucozơ', 'Saccarozơ', 'Tinh bột', 'Xenlulozơ'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Kim loại nào có nhiệt độ nóng chảy thấp nhất, ở thể lỏng ở nhiệt độ thường?', opts: ['Thủy ngân (Hg)', 'Xesi (Cs)', 'Nhôm (Al)', 'Sắt (Fe)'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Kim loại sắt (Fe) bị thụ động hóa trong dung dịch nào nguội?', opts: ['HNO₃ đặc nguội', 'HCl loãng', 'H₂SO₄ loãng', 'CuSO₄'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Khí nào gây ra hiện tượng hiệu ứng nhà kính mạnh nhất?', opts: ['CO₂', 'O₂', 'N₂', 'H₂'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Công thức phân tử của khí ozon là gì?', opts: ['O₃', 'O₂', 'O', 'CO'], c: 0 },

  // Sinh học
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Bào quan nào được ví là “nhà máy năng lượng” của tế bào?', opts: ['Ty thể', 'Ribôxôm', 'Bộ máy Golgi', 'Lizôxôm'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Phân tử ADN được cấu tạo từ 4 loại đơn phân nào?', opts: ['A, T, G, X', 'A, U, G, X', 'A, T, U, G', 'Axit amin'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Hội chứng Đao ở người do đột biến thừa 1 chiếc ở cặp NST số mấy?', opts: ['Cặp số 21', 'Cặp số 23', 'Cặp số 18', 'Cặp số 13'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Mã di truyền mở đầu trên mARN dịch mã cho axit amin Metionin là?', opts: ['5\'AUG3\'', '5\'UAG3\'', '5\'UAA3\'', '5\'UGA3\''], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Động vật nào sau đây có dạ dày 4 ngăn?', opts: ['Trâu, bò', 'Ngựa', 'Thỏ', 'Chó'], c: 0 },

  // Ngữ văn
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Ai là tác giả của truyện ngắn “Vợ Nhặt”?', opts: ['Kim Lân', 'Nam Cao', 'Tô Hoài', 'Nguyễn Tuân'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Hình tượng người lính trong bài thơ “Tây Tiến” nổi bật với vẻ đẹp gì?', opts: ['Lãng mạn và bi tráng', 'Mộc mạc nông dân', 'U uất bi quan', 'Thần thánh hóa'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Hình tượng sông Đà trong tác phẩm của Nguyễn Tuân mang 2 nét tính cách nào?', opts: ['Hung bạo và trữ tình', 'Hiền hòa và dữ dội', 'Thơ mộng và êm đềm', 'Lặng lẽ và trầm mặc'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Nhân vật bà cụ Tứ xuất hiện trong tác phẩm nào?', opts: ['Vợ Nhặt', 'Chí Phèo', 'Vợ chồng A Phủ', 'Rừng xà nu'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Bài thơ “Sóng” của Xuân Quỳnh được viết theo thể thơ nào?', opts: ['Thơ 5 chữ', 'Thơ 7 chữ', 'Thơ lục bát', 'Thơ tự do'], c: 0 },

  // Lịch sử & Địa lý
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Chiến thắng Điện Biên Phủ toàn thắng vào ngày tháng năm nào?', opts: ['07/05/1954', '02/09/1945', '30/04/1975', '19/08/1945'], c: 0 },
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Bác Hồ đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình vào ngày nào?', opts: ['02/09/1945', '19/08/1945', '30/04/1975', '03/02/1930'], c: 0 },
  { subject: 'ĐỊA LÝ', teacher: 'Cô Mai Anh', q: 'Đỉnh núi Fansipan có độ cao bao nhiêu mét?', opts: ['3.143 m', '2.800 m', '3.500 m', '2.950 m'], c: 0 },
  { subject: 'ĐỊA LÝ', teacher: 'Cô Mai Anh', q: 'Thủ phủ cà phê lớn nhất Việt Nam nằm ở vùng nào?', opts: ['Tây Nguyên', 'Đông Bắc', 'Đồng bằng sông Hồng', 'Bắc Trung Bộ'], c: 0 },

  // Tiếng Anh & Đời sống
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'Choose the correct word: "She has lived here ___ 2020."', opts: ['since', 'for', 'in', 'at'], c: 0 },
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'Synonym of "abundant" is:', opts: ['plentiful', 'scarce', 'narrow', 'rare'], c: 0 },
  { subject: 'ĐỜI SỐNG', teacher: 'Căn Tin', q: 'Món ăn vặt quốc dân nào được học sinh săn lùng nhiều nhất giờ ra chơi?', opts: ['Bánh tráng trộn/cuộn bơ', 'Cơm tấm sườn', 'Phở bò', 'Bún riêu cua'], c: 0 },
  { subject: 'ĐỜI SỐNG', teacher: 'Lớp 12A3', q: 'Ai là cô bạn lớp phó học tập xinh xắn nhất lớp 12A3?', opts: ['Triệu Mẫn', 'Thị Nở', 'Cô Năm căn tin', 'Nhỏ bạn bàn bên'], c: 0 }
];

export default function App() {
  // Trạng thái nhân vật
  const [playerName, setPlayerName] = useState('Bạn');
  const [day, setDay] = useState(1);
  const [minuteOfDay, setMinuteOfDay] = useState(420); // 07:00
  const [location, setLocation] = useState('class');

  // Chỉ số
  const [stats, setStats] = useState({
    hp: 85, energy: 100, mood: 75, study: 50, love: 20, money: 30000,
    totalBanhTrangSold: 0, totalTipsReceived: 0, midtermScore: 0, finalScore: 0
  });

  const [inventory, setInventory] = useState([
    { id: 'banh_trang', count: 3 },
    { id: 'tra_sua_chai', count: 2 },
    { id: 'but_cute', count: 2 },
    { id: 'de_cuong', count: 1 }
  ]);

  const [customerOrders, setCustomerOrders] = useState([
    { id: 1, customer: 'Lan (Bạn Thân)', avatar: '👧', itemId: 'banh_trang', qty: 2, dialogue: 'Đói meo mốc rồi nè! Cho 2 bịch bánh tráng bơ ăn lót dạ đi!', tip: 2000 },
    { id: 2, customer: 'Triệu Mẫn (Lớp Phó)', avatar: '👸', itemId: 'tra_sua_chai', qty: 1, dialogue: 'Bạn còn chai trà sữa nào mát lạnh không? Mình đang khát quá!', tip: 6000 }
  ]);

  const [certsEarned, setCertsEarned] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'order', 'wholesale', 'gift', 'cert', 'leaderboard', 'achieve', 'name', 'quiz', 'exam', 'diary', 'help'
  const [alertText, setAlertText] = useState('');

  // Trắc nghiệm & thi cử
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [examState, setExamState] = useState({ type: 'midterm', currentStep: 0, correctCount: 0, questions: [] });

  const showAlert = (text) => {
    setAlertText(text);
    setTimeout(() => setAlertText(''), 3000);
  };

  // Xác định lịch học & quyền bán hàng
  const getSchedule = () => {
    const m = minuteOfDay;
    if (m >= 420 && m < 510) return { text: 'Đầu giờ sáng • Nhận order', canSell: true }; // 07:00 - 08:30
    if (m >= 510 && m < 555) return { text: 'Tiết 1-2 chính khóa • Học bài', canSell: false }; // 08:30 - 09:15
    if (m >= 555 && m < 585) return { text: 'Giờ ra chơi 30 phút • Khách đông!', canSell: true }; // 09:15 - 09:45
    if (m >= 585 && m < 690) return { text: 'Tiết 3-4 chính khóa • Cấm bán', canSell: false }; // 09:45 - 11:30
    if (m >= 690 && m < 810) return { text: 'Nghỉ trưa & Căn tin', canSell: false }; // 11:30 - 13:30
    if (m >= 810 && m < 1020) return { text: 'Buổi chiều • Thư viện / Tự học', canSell: false }; // 13:30 - 17:00
    if (m >= 1020 && m < 1110) return { text: 'Tan trường 17:00 • Nhận order', canSell: true }; // 17:00 - 18:30
    return { text: 'Buổi tối • Góc học tập tại nhà', canSell: false }; // 18:30 - 22:30
  };

  const schedule = getSchedule();

  // ĐỒNG HỒ TỰ ĐỘNG CHẠY NHANH MƯỢT
  useEffect(() => {
    const timer = setInterval(() => {
      setMinuteOfDay(prev => {
        if (prev >= 1350) {
          // Hết ngày lúc 22:30
          handleEndOfDay();
          return 420;
        }
        return prev + 1;
      });
    }, 700); // 0.7 giây thực = 1 phút game, thời gian trôi tự nhiên và nhanh

    return () => clearInterval(timer);
  }, []);

  // TỰ ĐỘNG KHÁCH ĐẾN NHANH HƠN (mỗi 2.8 giây có khách mới nếu quầy mở)
  useEffect(() => {
    const custTimer = setInterval(() => {
      if (schedule.canSell) {
        setCustomerOrders(prev => {
          if (prev.length >= 4) return prev;
          const sampleList = [
            { name: 'Tuấn (Bóng Rổ)', avatar: '🏀', itemId: 'tra_sua_chai', qty: 2, dialogue: 'Đá banh khát khô họng, cho 2 chai trà sữa lẹ bạn ơi!', tip: 4000 },
            { name: 'Hoàng Nam', avatar: '🤓', itemId: 'de_cuong', qty: 1, dialogue: 'Photo cho mình 1 bộ đề cương toán nha, gửi thêm ít tiền!', tip: 5000 },
            { name: 'Bảo Trân', avatar: '✨', itemId: 'but_cute', qty: 2, dialogue: 'Bút viết êm tay ghê, giao nhanh mình gửi thêm tiền nước!', tip: 3000 },
            { name: 'Triệu Mẫn', avatar: '👸', itemId: 'banh_trang', qty: 1, dialogue: 'Bánh tráng bơ thơm nức mũi, để cho Mẫn một phần nhen!', tip: 8000 },
            { name: 'Lan (Bạn Thân)', avatar: '👧', itemId: 'banh_trang', qty: 1, dialogue: 'Đói bụng quá, lấy tao một phần bánh tráng ăn lót dạ đi!', tip: 2500 }
          ];
          const newCust = sampleList[Math.floor(Math.random() * sampleList.length)];
          return [...prev, {
            id: Date.now(), customer: newCust.name, avatar: newCust.avatar,
            itemId: newCust.itemId, qty: newCust.qty, dialogue: newCust.dialogue, tip: newCust.tip
          }];
        });
      }
    }, 2800);

    return () => clearInterval(custTimer);
  }, [schedule.canSell]);

  // Hết ngày & chuyển sang ngày mới
  const handleEndOfDay = () => {
    setActiveModal('diary');
    setStats(prev => ({ ...prev, energy: 100, money: prev.money + 15000 }));
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
    setLocation('class');
  };

  // Trả đơn order
  const fulfillOrder = (orderId) => {
    const ord = customerOrders.find(o => o.id === orderId);
    if (!ord) return;

    const inv = inventory.find(i => i.id === ord.itemId);
    const itemInfo = WHOLESALE_ITEMS.find(i => i.id === ord.itemId);

    if (!inv || inv.count < ord.qty) {
      showAlert('Kho không đủ hàng! Vào Chợ Sỉ ngay!');
      return;
    }

    setInventory(prev => prev.map(i => i.id === ord.itemId ? { ...i, count: i.count - ord.qty } : i));
    setCustomerOrders(prev => prev.filter(o => o.id !== orderId));

    const isCrush = ord.customer.includes('Triệu Mẫn');
    const earned = (itemInfo.retailPrice * ord.qty) + ord.tip;

    setStats(prev => ({
      ...prev,
      money: prev.money + earned,
      mood: Math.min(100, prev.mood + 5),
      love: isCrush ? Math.min(100, prev.love + 8) : prev.love,
      totalBanhTrangSold: ord.itemId === 'banh_trang' ? prev.totalBanhTrangSold + ord.qty : prev.totalBanhTrangSold,
      totalTipsReceived: prev.totalTipsReceived + ord.tip
    }));

    showAlert(`⭐ Giao đơn thành công! Nhận +${earned.toLocaleString('vi-VN')}đ (Tip: ${ord.tip.toLocaleString('vi-VN')}đ)`);
  };

  // Nhập sỉ
  const buyWholesale = (itemId) => {
    const item = WHOLESALE_ITEMS.find(i => i.id === itemId);
    const cost = item.wholesalePrice * 3;
    if (stats.money < cost) {
      showAlert('Tiền trong ví không đủ nhập gói sỉ này!');
      return;
    }
    setStats(prev => ({ ...prev, money: prev.money - cost }));
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, count: i.count + 3 } : i));
    showAlert(`📦 Đã nhập 3 ${item.name}!`);
  };

  // Tặng quà Triệu Mẫn
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

  // Trốn học đi chơi
  const skipSchool = () => {
    if (schedule.canSell) return;
    const caught = Math.random() < 0.35;
    if (caught) {
      setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20), study: Math.max(0, prev.study - 5), energy: Math.max(0, prev.energy - 15) }));
      showAlert('🚨 Bị giám thị bắt gặp trèo tường! Bị phạt và hạ hạnh kiểm!');
    } else {
      setStats(prev => ({ ...prev, mood: Math.min(100, prev.mood + 25), energy: Math.max(0, prev.energy - 10) }));
      showAlert('🎉 Trốn học thành công ra quán net quẩy cực đã! (+25 😊)');
    }
    setMinuteOfDay(prev => prev + 40);
  };

  // Trả lời câu hỏi trên lớp
  const startQuiz = () => {
    const q = QUIZ_DATABASE[Math.floor(Math.random() * QUIZ_DATABASE.length)];
    setCurrentQuiz(q);
    setActiveModal('quiz');
  };

  const answerQuiz = (index) => {
    if (index === currentQuiz.c) {
      setStats(prev => ({ ...prev, study: prev.study + 8, mood: Math.min(100, prev.mood + 5), energy: Math.max(0, prev.energy - 10) }));
      showAlert('🎉 Đúng rồi! Thầy cô khen ngợi (+8 📚)');
    } else {
      setStats(prev => ({ ...prev, study: prev.study + 2, mood: Math.max(0, prev.mood - 5), energy: Math.max(0, prev.energy - 10) }));
      showAlert('😭 Sai rồi! Nhớ ghi chú lại vào vở nhé.');
    }
    setActiveModal(null);
    setMinuteOfDay(prev => prev + 25);
  };

  // Kỳ thi giữa / cuối kỳ
  const triggerExam = (type) => {
    const shuffled = [...QUIZ_DATABASE].sort(() => 0.5 - Math.random()).slice(0, 10);
    setExamState({ type, currentStep: 0, correctCount: 0, questions: shuffled });
    setActiveModal('exam');
  };

  const answerExam = (idx) => {
    const q = examState.questions[examState.currentStep];
    const isCorrect = idx === q.c;
    const newCorrect = isCorrect ? examState.correctCount + 1 : examState.correctCount;

    if (examState.currentStep + 1 < 10) {
      setExamState(prev => ({ ...prev, currentStep: prev.currentStep + 1, correctCount: newCorrect }));
    } else {
      setActiveModal(null);
      if (examState.type === 'midterm') {
        setStats(prev => ({ ...prev, midtermScore: newCorrect, study: prev.study + (newCorrect * 3) }));
        showAlert(`🎉 KẾT QUẢ GIỮA KỲ: Đúng ${newCorrect}/10 câu!`);
      } else {
        setStats(prev => ({ ...prev, finalScore: newCorrect }));
        showAlert(`🎓 KẾT QUẢ TỐT NGHIỆP: Đúng ${newCorrect}/10 câu!`);
      }
    }
  };

  // Tương tác NPC
  const interactNPC = (who) => {
    if (who === 'mẫn') {
      setStats(prev => ({ ...prev, love: Math.min(100, prev.love + 5), mood: Math.min(100, prev.mood + 10) }));
      showAlert(`💕 Triệu Mẫn: "${playerName} ơi, nhớ chăm học để tụi mình cùng đỗ trường top nhen!" (+5 💕)`);
    } else if (who === 'lan') {
      setStats(prev => ({ ...prev, mood: Math.min(100, prev.mood + 10), study: prev.study + 2 }));
      showAlert(`👧 Lan: "Hôm nay bà cô kiểm tra bài tập về nhà đấy, chép nhanh lên ${playerName}!"`);
    } else if (who === 'tuan') {
      setStats(prev => ({ ...prev, hp: Math.min(100, prev.hp + 5), mood: Math.min(100, prev.mood + 10) }));
      showAlert(`🏀 Tuấn: "Ra sân ném 3 điểm với tao một ván cho giãn gân cốt nào ${playerName}!"`);
    }
  };

  const hours = Math.floor(minuteOfDay / 60);
  const mins = minuteOfDay % 60;
  const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', color: '#f8fafc', fontFamily: 'sans-serif', userSelect: 'none' }}>
      
      {/* THÔNG BÁO POPUP */}
      {alertText && (
        <div style={{ position: 'fixed', top: '16px', zIndex: 100, background: 'rgba(2, 6, 23, 0.95)', border: '2px solid #10b981', color: '#34d399', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 8px 24px rgba(0,0,0,0.8)' }}>
          {alertText}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '860px', background: 'linear-gradient(145deg, #0f172a, #020617)', border: '4px solid #1e293b', borderRadius: '28px', padding: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        
        {/* HEADER TOOLBAR NÚT CHỨC NĂNG */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: '900', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', display: 'inline-block' }}></span>
            THANH XUÂN RỰC RỠ 7.5
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveModal('gift')} style={{ background: '#9d174d', color: '#fff', border: '1px solid #db2777', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🎁 TẶNG QUÀ</button>
            <button onClick={() => setActiveModal('cert')} style={{ background: '#1e40af', color: '#fff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🎓 CHỨNG CHỈ</button>
            <button onClick={() => setActiveModal('name')} style={{ background: '#1e293b', color: '#fde047', border: '1px solid #475569', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>👤 ĐỔI TÊN</button>
            <button onClick={() => setActiveModal('leaderboard')} style={{ background: '#b45309', color: '#fff', border: '1px solid #f59e0b', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🏆 THI ĐUA</button>
            <button onClick={() => setActiveModal('help')} style={{ background: '#0f766e', color: '#fff', border: '1px solid #14b8a6', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📖 HƯỚNG DẪN</button>
          </div>
        </div>

        {/* MÀN HÌNH CHÍNH */}
        <div style={{ background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)', border: '2px solid #1e293b', borderRadius: '20px', padding: '14px', position: 'relative' }}>
          
          {/* HUD CHỈ SỐ */}
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '2px solid #334155', borderRadius: '14px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: '900', color: '#fde047', fontSize: '13px' }}>
                <span style={{ color: '#38bdf8' }}>{playerName.toUpperCase()}</span> • 
                <span style={{ color: '#34d399', fontFamily: 'monospace', marginLeft: '6px' }}>{timeStr}</span> • 
                <span style={{ color: '#93c5fd', marginLeft: '6px' }}>NGÀY {day}/45</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{schedule.text}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#fb7185' }}>❤️ {stats.hp}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#fde047' }}>⚡ {stats.energy}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#38bdf8' }}>📚 {stats.study}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#f472b6' }}>💕 {stats.love}%</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#34d399' }}>💰 {stats.money.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* SÂN TRƯỜNG & KHU TƯƠNG TÁC */}
          <div style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.95) 100%)', border: '2px solid #1e293b', borderRadius: '16px', padding: '16px', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            {/* THANH TRẠNG THÁI VÀ TRỐN HỌC */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: '#020617', padding: '4px 10px', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', fontWeight: 'bold', color: '#fde047' }}>
                🏫 LỚP 12A3 - KHỐI CHUYÊN
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {!schedule.canSell && (
                  <button onClick={skipSchool} style={{ background: '#991b1b', color: '#fef2f2', border: '1px solid #ef4444', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    🏃 Trốn Học Đi Chơi
                  </button>
                )}
                <div style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: schedule.canSell ? '#064e3b' : '#4c0519', color: schedule.canSell ? '#a7f3d0' : '#fecdd3', border: `1px solid ${schedule.canSell ? '#10b981' : '#e11d48'}` }}>
                  {schedule.canSell ? '🟢 ĐƯỢC PHÉP BÁN HÀNG' : '🔒 ĐANG TRONG GIỜ HỌC'}
                </div>
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
                {schedule.canSell ? '🔥 KHÁCH TỰ ĐỘNG KÉO ĐẾN ORDER MỖI 3 GIÂY!' : '📖 ĐANG TRONG TIẾT HỌC - TẬP TRUNG HỌC HOẶC TRỐN HỌC!'}
              </div>
            </div>

            {/* ĐIỀU HƯỚNG ĐỊA ĐIỂM */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
              <button onClick={() => setLocation('class')} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🏫 Lớp Học</button>
              <button onClick={() => setActiveModal('canteen')} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🍜 Căn Tin</button>
              <button onClick={() => startQuiz()} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📚 Trả Lời Câu Hỏi</button>
              <button onClick={() => setMinuteOfDay(prev => prev + 60)} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>⏩ Tua 1 Tiếng</button>
            </div>
          </div>

          {/* THANH ĐIỀU KHIỂN DƯỚI CÙNG */}
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
              CÁC POPUP MODAL HOÀN TOÀN ĐỘC LẬP (KHÔNG BỊ CHẶN CLICK)
              ======================================================== */}

          {/* MODAL ORDER */}
          {activeModal === 'order' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #10b981', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#34d399', fontSize: '13px' }}>🛎️ DANH SÁCH ORDER TỰ ĐỘNG</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', background: '#020617', padding: '8px', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}>
                {inventory.map(i => <span key={i.id}>{WHOLESALE_ITEMS.find(x => x.id === i.id)?.icon} {i.count}</span>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {customerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '11px' }}>Khách đang chạy lại quầy, đợi vài giây nhé...</div>
                ) : (
                  customerOrders.map(ord => {
                    const item = WHOLESALE_ITEMS.find(x => x.id === ord.itemId);
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

          {/* MODAL CHỢ SỈ */}
          {activeModal === 'wholesale' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #3b82f6', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#60a5fa', fontSize: '13px' }}>🚚 CHỢ SỈ ĐẦU MỐI (NHẬP HÀNG)</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {WHOLESALE_ITEMS.map(item => (
                  <div key={item.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.icon} {item.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>Giá sỉ: <b style={{ color: '#60a5fa' }}>{item.wholesalePrice.toLocaleString('vi-VN')}đ</b> • Bán: {item.retailPrice.toLocaleString('vi-VN')}đ</div>
                    </div>
                    <button onClick={() => buyWholesale(item.id)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                      Nhập 3 Cái ({(item.wholesalePrice * 3).toLocaleString('vi-VN')}đ)
                    </button>
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

          {/* MODAL ĐẶT TÊN */}
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

          {/* MODAL TRẢ LỜI CÂU HỎI TRÊN LỚP */}
          {activeModal === 'quiz' && currentQuiz && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #38bdf8', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                  <b style={{ color: '#93c5fd' }}>{currentQuiz.subject} - {currentQuiz.teacher}</b>
                  <span style={{ color: '#fde047', fontSize: '11px' }}>⚡ Tốn 10 Năng lượng</span>
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
                  Một ngày học tập và kinh doanh của {playerName} tại lớp 12A3 đã khép lại. Điểm học tập hiện tại là {stats.study}, ví tiền tích lũy được {stats.money.toLocaleString('vi-VN')}đ và tình cảm cùng Triệu Mẫn đạt {stats.love}%.
                </p>
              </div>
              <button onClick={nextDay} style={{ background: '#92400e', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Thức Dậy Ngày Mới ☀️
              </button>
            </div>
          )}

          {/* MODAL THI ĐUA */}
          {activeModal === 'leaderboard' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #f59e0b', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#fde047' }}>🏆 BẢNG THI ĐUA LỚP 12A3</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Triệu Mẫn (Lớp Phó)', score: 92, avatar: '👸' },
                  { name: `${playerName} (Bạn)`, score: stats.study, avatar: '😎' },
                  { name: 'Lan (Bạn Thân)', score: 68, avatar: '👧' },
                  { name: 'Tuấn (Bóng Rổ)', score: 55, avatar: '🏀' }
                ].sort((a,b) => b.score - a.score).map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: '#020617', padding: '8px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <span>#{idx+1} {s.avatar} <b>{s.name}</b></span>
                    <b style={{ color: '#34d399' }}>{s.score} 📚</b>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
