import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  // --- 1. DỮ LIỆU CỐ ĐỊNH ---
  const WHOLESALE_ITEMS = [
    { id: 'banh_trang', name: 'Bánh Tráng Cuộn Bơ', wholesalePrice: 8500, retailPrice: 12000, icon: '🌯' },
    { id: 'tra_sua_chai', name: 'Trà Sữa Thái Chai', wholesalePrice: 13000, retailPrice: 18000, icon: '🧋' },
    { id: 'but_cute', name: 'Bút Bi Cute Pastel', wholesalePrice: 5500, retailPrice: 8000, icon: '🖊️' },
    { id: 'de_cuong', name: 'Đề Cương Ôn Tập', wholesalePrice: 6500, retailPrice: 10000, icon: '📑' }
  ];

  const CERTIFICATES_DEF = [
    { id: 'cert_mos', name: 'Tin Học MOS (Word/Excel)', cost: 50000, reqStudy: 60, icon: '💻', desc: 'Thành thạo văn phòng, +10 Uy tín' },
    { id: 'cert_accounting', name: 'Kế Toán Doanh Nghiệp', cost: 80000, reqStudy: 70, icon: '📊', desc: 'Nắm vững sổ sách, +15% tiền tip' },
    { id: 'cert_toeic', name: 'TOEIC 650+', cost: 120000, reqStudy: 75, icon: '📘', desc: 'Chuẩn quốc tế, cộng +15 Học tập' },
    { id: 'cert_ielts', name: 'IELTS Academic 7.0+', cost: 200000, reqStudy: 85, icon: '📕', desc: 'Tuyển thẳng viện đào tạo quốc tế!' }
  ];

  const SPECIAL_GIFTS = [
    { id: 'gift_pin', name: 'Kẹp Tóc Ngọc Bích', cost: 45000, loveGain: 12, icon: '🎀', desc: 'Món quà xinh xắn Mẫn rất thích cài lên tóc.' },
    { id: 'gift_diary', name: 'Sổ Tay Thư Tình', cost: 35000, loveGain: 10, icon: '💌', desc: 'Những dòng tâm sự chân thành gửi lớp phó.' },
    { id: 'gift_bear', name: 'Gấu Bông Handmade', cost: 65000, loveGain: 16, icon: '🧸', desc: 'Ấm áp những đêm cày đề căng thẳng.' },
    { id: 'gift_bracelet', name: 'Vòng Tay Bạc Triệu Mẫn', cost: 120000, loveGain: 25, icon: '💍', desc: 'Minh chứng cho lời hẹn ước cùng đỗ đại học.' }
  ];

  const HOLIDAYS = {
    10: { name: '20/10 Ngày Phụ Nữ VN', bonus: 1.8 },
    20: { name: '20/11 Ngày Nhà Giáo VN', bonus: 1.4 },
    30: { name: '24/12 Lễ Giáng Sinh', bonus: 2.0 },
    40: { name: '14/02 Lễ Valentine', bonus: 2.5 }
  };

  const QUIZ_DATABASE = [
    { subject: 'TOÁN HỌC', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Nếu x + 5 = 12 thì giá trị của biểu thức 2x - 4 bằng bao nhiêu?', opts: ['10', '14', '7', '18'], c: 0, tip: 'x = 7 => 2*(7) - 4 = 10' },
    { subject: 'TOÁN HỌC', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Hàm số y = x² - 4x + 3 có hoành độ đỉnh Parabol bằng:', opts: ['2', '-2', '4', '1'], c: 0, tip: 'x = -b/(2a) = 4/2 = 2' },
    { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Trong dao động điều hòa của con lắc lò xo, cơ năng biến thiên thế nào?', opts: ['Bảo toàn không đổi', 'Tăng giảm tuần hoàn', 'Bằng 0', 'Luôn giảm'], c: 0, tip: 'Bỏ qua ma sát, cơ năng luôn bảo toàn.' },
    { subject: 'HÓA HỌC', teacher: 'Cô Phương', avatar: '👩‍🔬', q: 'Kim loại nào dẫn điện tốt nhất ở điều kiện thường?', opts: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'], c: 0, tip: 'Ag > Cu > Au > Al' },
    { subject: 'SINH HỌC', teacher: 'Thầy Đức', avatar: '👨‍🏫', q: 'Bào quan nào được ví là “nhà máy năng lượng” của tế bào?', opts: ['Ty thể', 'Ribôxôm', 'Bộ máy Golgi', 'Lizôxôm'], c: 0, tip: 'Ty thể diễn ra hô hấp tổng hợp ATP.' },
    { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', avatar: '👩‍🏫', q: 'Ai là tác giả của tác phẩm “Vợ Nhặt”?', opts: ['Kim Lân', 'Nam Cao', 'Tô Hoài', 'Nguyễn Tuân'], c: 0, tip: 'Nhà văn Kim Lân viết về nạn đói năm 1945.' },
    { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', avatar: '👨‍🏫', q: 'Chiến dịch Điện Biên Phủ toàn thắng vào năm nào?', opts: ['1954', '1945', '1975', '1968'], c: 0, tip: 'Toàn thắng vào ngày 07/05/1954.' },
    { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', avatar: '👩‍💼', q: 'She has been studying in this school ___ 2022.', opts: ['since', 'for', 'in', 'at'], c: 0, tip: 'Since + mốc thời gian trong hiện tại hoàn thành.' }
  ];

  const TIME_PERIODS = [
    { text: '07:30', name: 'Buổi sáng • Tiết 1-2', canSell: true },
    { text: '09:15', name: 'Giờ ra chơi 15 phút', canSell: true },
    { text: '11:30', name: 'Tan trường trưa • Giờ tự học', canSell: false },
    { text: '14:00', name: 'Buổi chiều • Thư viện / Chính khóa', canSell: false },
    { text: '17:00', name: 'Chiều muộn sau 17h • Tan trường bán đồ', canSell: true },
    { text: '20:30', name: 'Buổi tối • Tự học khuya tại nhà', canSell: false }
  ];

  const DAYS_OF_WEEK = ['THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY', 'CHỦ NHẬT'];

  // --- 2. GAME STATE ---
  const [playerName, setPlayerName] = useState('Bạn');
  const [day, setDay] = useState(1);
  const [timeIndex, setTimeIndex] = useState(0);
  const [location, setLocation] = useState('class');
  
  const [stats, setStats] = useState({
    hp: 85,
    energy: 100,
    mood: 75,
    study: 50,
    love: 20,
    reputation: 15,
    money: 30000,
    midtermScore: 0,
    finalScore: 0,
    totalBanhTrangSold: 0,
    totalTipsReceived: 0
  });

  const [inventory, setInventory] = useState([
    { id: 'banh_trang', count: 2 },
    { id: 'tra_sua_chai', count: 1 },
    { id: 'but_cute', count: 1 },
    { id: 'de_cuong', count: 1 }
  ]);

  const [customerOrders, setCustomerOrders] = useState([
    { id: 1, customer: 'Lan (Bạn Thân)', avatar: '👧', itemId: 'banh_trang', qty: 2, dialogue: 'Đói bụng quá, để cho tao 2 bịch bánh tráng bơ nha!', tip: 2000, stars: 5 },
    { id: 2, customer: 'Triệu Mẫn (Lớp Phó)', avatar: '👸', itemId: 'tra_sua_chai', qty: 1, dialogue: 'Bạn còn chai trà sữa nào mát lạnh không? Mình đang khát quá!', tip: 6000, stars: 5 }
  ]);

  const [certsEarned, setCertsEarned] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [activeModal, setActiveModal] = useState('help'); // Hiện modal hướng dẫn ngay khi vào game
  const [alertText, setAlertText] = useState('');
  const [cloudCodeText, setCloudCodeText] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // Thi cử
  const [examState, setExamState] = useState({
    type: 'midterm',
    step: 0,
    questions: [],
    correct: 0
  });

  const canvasRef = useRef(null);

  // Hiệu ứng pháo hoa
  const triggerFireworks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#a855f7', '#34d399'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1
      });
    }

    let frame = 0;
    const anim = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      frame++;
      if (frame < 50) requestAnimationFrame(anim);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    anim();
  };

  const showAlert = (msg) => {
    setAlertText(msg);
    setTimeout(() => setAlertText(''), 3000);
  };

  // Tiến trình thời gian
  const advanceTime = () => {
    setTimeIndex((prev) => {
      if (prev + 1 >= TIME_PERIODS.length) {
        // Hết ngày
        setDay((d) => d + 1);
        setStats((s) => ({ ...s, energy: 100, money: s.money + 15000 }));
        showAlert('☀️ Thức dậy ngày mới! Năng lượng hồi phục và nhận 15.000đ tiền tiêu vặt.');
        return 0;
      }
      return prev + 1;
    });
  };

  // --- 3. ĐỒNG BỘ CLOUD AN TOÀN TUYỆT ĐỐI ---
  const handleExportCloud = () => {
    try {
      const saveData = {
        playerName,
        day,
        timeIndex,
        stats,
        inventory,
        certsEarned,
        unlockedAchievements
      };
      // Mã hóa an toàn không sợ lỗi tiếng Việt
      const jsonStr = JSON.stringify(saveData);
      const safeCode = btoa(encodeURIComponent(jsonStr));
      setCloudCodeText(safeCode);
      showAlert('📋 Đã tạo mã lưu Game thành công! Hãy copy mã.');
    } catch (err) {
      alert('Lỗi tạo mã lưu: ' + err.message);
    }
  };

  const handleImportCloud = () => {
    try {
      if (!cloudCodeText.trim()) {
        alert('Vui lòng dán mã lưu vào khung trước!');
        return;
      }
      const jsonStr = decodeURIComponent(atob(cloudCodeText.trim()));
      const data = JSON.parse(jsonStr);

      if (data && data.stats) {
        setPlayerName(data.playerName || 'Bạn');
        setDay(data.day || 1);
        setTimeIndex(data.timeIndex || 0);
        setStats(data.stats);
        if (data.inventory) setInventory(data.inventory);
        if (data.certsEarned) setCertsEarned(data.certsEarned);
        if (data.unlockedAchievements) setUnlockedAchievements(data.unlockedAchievements);

        setActiveModal(null);
        showAlert('🎉 Khôi phục dữ liệu thành công!');
        triggerFireworks();
      }
    } catch (err) {
      alert('Mã lưu không hợp lệ hoặc bị lỗi định dạng!');
    }
  };

  // Giao order
  const fulfillOrder = (orderId) => {
    const ord = customerOrders.find((o) => o.id === orderId);
    if (!ord) return;
    const invItem = inventory.find((i) => i.id === ord.itemId);
    const itemDef = WHOLESALE_ITEMS.find((i) => i.id === ord.itemId);

    if (!invItem || invItem.count < ord.qty) {
      alert('Kho không đủ hàng! Hãy vào Chợ Sỉ để nhập thêm.');
      return;
    }

    // Trừ kho & cộng tiền
    setInventory((prev) =>
      prev.map((i) => (i.id === ord.itemId ? { ...i, count: i.count - ord.qty } : i))
    );

    const isCrush = ord.customer.includes('Triệu Mẫn');
    const hasAccounting = certsEarned.includes('cert_accounting');
    const finalTip = hasAccounting ? Math.round(ord.tip * 1.15) : ord.tip;
    const profit = itemDef.retailPrice * ord.qty + finalTip;

    setStats((prev) => ({
      ...prev,
      money: prev.money + profit,
      love: isCrush ? Math.min(100, prev.love + 8) : prev.love,
      energy: Math.max(0, prev.energy - 5),
      mood: Math.min(100, prev.mood + 5),
      totalBanhTrangSold: ord.itemId === 'banh_trang' ? prev.totalBanhTrangSold + ord.qty : prev.totalBanhTrangSold,
      totalTipsReceived: prev.totalTipsReceived + finalTip
    }));

    setCustomerOrders((prev) => prev.filter((o) => o.id !== orderId));
    showAlert(`💵 Đã giao đơn cho ${ord.customer}! Thu về +${profit.toLocaleString('vi-VN')}đ`);
  };

  const buyWholesale = (itemId) => {
    const item = WHOLESALE_ITEMS.find((i) => i.id === itemId);
    const cost = item.wholesalePrice * 3;
    if (stats.money < cost) {
      alert('Không đủ tiền để nhập 3 phần hàng sỉ!');
      return;
    }
    setStats((s) => ({ ...s, money: s.money - cost }));
    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, count: i.count + 3 } : i))
    );
    showAlert(`📦 Đã nhập 3 phần ${item.name}!`);
  };

  const currentPeriod = TIME_PERIODS[timeIndex];
  const isSelling = currentPeriod.canSell;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-2 sm:p-4 font-sans select-none relative overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>

      <div className="bg-slate-900 border-4 border-slate-700 rounded-[32px] p-3 sm:p-5 w-full max-w-4xl shadow-2xl relative z-10">
        
        {/* HEADER TOP BAR */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sky-400 font-bold">THIẾT KẾ CHO: {playerName.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setActiveModal('name')} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-300">👤 Đổi Tên</button>
            <button onClick={() => setActiveModal('gift')} className="px-2 py-0.5 bg-pink-900/60 hover:bg-pink-800 rounded text-pink-200">🎁 Tặng Mẫn</button>
            <button onClick={() => setActiveModal('cert')} className="px-2 py-0.5 bg-blue-900/60 hover:bg-blue-800 rounded text-blue-200">🎓 Chứng Chỉ</button>
            <button onClick={() => setActiveModal('help')} className="px-2 py-0.5 bg-amber-900/60 hover:bg-amber-800 rounded text-amber-200">📖 Hướng Dẫn</button>
            <button onClick={() => { setActiveModal('cloud'); handleExportCloud(); }} className="px-2 py-0.5 bg-indigo-900/80 hover:bg-indigo-700 rounded text-indigo-200 font-bold">☁️ CLOUD</button>
          </div>
        </div>

        {/* HUD CHỈ SỐ */}
        <header className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-3 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">☀️️</span>
            <div>
              <div className="font-extrabold text-amber-300">
                {DAYS_OF_WEEK[(day - 1) % 7]} • <span className="text-emerald-400 font-mono">{currentPeriod.text}</span> • NGÀY {day}/45
              </div>
              <div className="text-[10px] text-slate-400">{currentPeriod.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap">
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-rose-400">❤️ {stats.hp}</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-amber-400">⚡ {stats.energy}</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-yellow-400">😊 {stats.mood}</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-sky-400">📚 {stats.study}</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-pink-400 font-bold">💕 {stats.love}% Mẫn</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-emerald-400 font-bold">💰 {stats.money.toLocaleString('vi-VN')}đ</span>
          </div>
        </header>

        {alertText && (
          <div className="mb-2 p-2 bg-emerald-950 border border-emerald-500 rounded text-emerald-300 text-xs text-center font-bold animate-pulse">
            {alertText}
          </div>
        )}

        {/* KHUNG NỘI DUNG CHÍNH */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[360px] flex flex-col justify-between relative">
          
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-amber-300">
              🏫 LỚP 12A3 - KHỐI CHUYÊN
            </span>
            <div className="flex items-center gap-2">
              {!isSelling && (
                <button
                  onClick={() => {
                    const caught = Math.random() < 0.35;
                    if (caught) {
                      setStats((s) => ({ ...s, mood: Math.max(0, s.mood - 15), study: Math.max(0, s.study - 5) }));
                      alert('🚨 Bị thầy giám thị Nam tóm sống khi leo tường! Trừ 15 Tâm trạng và ghi sổ đầu bài.');
                    } else {
                      setStats((s) => ({ ...s, mood: Math.min(100, s.mood + 20), energy: Math.max(0, s.energy - 10) }));
                      showAlert('🎉 Trốn học ra quán Cyber leo rank thành công! (+20 😊)');
                    }
                    advanceTime();
                  }}
                  className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-600 rounded text-[11px]"
                >
                  🏃 Trèo Tường Trốn Học
                </button>
              )}
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isSelling ? 'bg-emerald-950 border border-emerald-500 text-emerald-300' : 'bg-rose-950 border border-rose-600 text-rose-300'}`}>
                {isSelling ? '🟢 ĐƯỢC BÁN HÀNG' : '🔒 GIỜ HỌC BÀI'}
              </span>
            </div>
          </div>

          {/* AVATAR BẠN BÈ */}
          <div className="my-auto py-6 flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center justify-center gap-10">
              <div onClick={() => { setStats((s) => ({ ...s, friends: s.friends + 5 })); showAlert('👧 Tám chuyện cùng bạn thân Lan!'); advanceTime(); }} className="cursor-pointer hover:scale-110 transition">
                <div className="text-5xl">👧</div>
                <span className="text-[10px] text-slate-300 font-bold block mt-1">Lan (Bạn thân)</span>
              </div>
              <div onClick={() => { setStats((s) => ({ ...s, love: Math.min(100, s.love + 5), study: s.study + 2 })); showAlert('💕 Triệu Mẫn chia sẻ bí quyết học tốt!'); advanceTime(); }} className="cursor-pointer hover:scale-110 transition">
                <div className="text-5xl">👸</div>
                <span className="text-[10px] text-pink-300 font-bold block mt-1">Triệu Mẫn 💕</span>
              </div>
              <div onClick={() => { setStats((s) => ({ ...s, mood: Math.min(100, s.mood + 10) })); showAlert('🏀 Ném bóng rổ cùng Tuấn!'); advanceTime(); }} className="cursor-pointer hover:scale-110 transition">
                <div className="text-5xl">🏀</div>
                <span className="text-[10px] text-sky-300 font-bold block mt-1">Tuấn (Bóng rổ)</span>
              </div>
            </div>
            <div className="bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 italic max-w-md">
              "Sáng sớm, ra chơi và sau 17:00 nhận order trả khách. Giờ học chính khóa hãy học bài hoặc trốn học đi chơi!"
            </div>
          </div>

          {/* ACTION BUTTONS DƯỚI KHUNG */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                if (!isSelling) {
                  alert('⛔ Bây giờ là giờ học! Chỉ nhận order vào buổi sáng, ra chơi hoặc sau 17:00.');
                  return;
                }
                setActiveModal('order');
              }}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg"
            >
              <span>🛎️</span> Nhận Order
            </button>
            <button
              onClick={() => {
                const q = QUIZ_DATABASE[Math.floor(Math.random() * QUIZ_DATABASE.length)];
                setCurrentQuiz(q);
                setActiveModal('quiz');
              }}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
            >
              <span>✍️</span> Học Trên Lớp
            </button>
            <button
              onClick={() => {
                if (stats.energy < 15) { alert('Bạn quá mệt để cày đề!'); return; }
                setStats((s) => ({ ...s, study: s.study + 12, energy: Math.max(0, s.energy - 18) }));
                showAlert('📚 Cày xong 1 đề đại học ở thư viện! (+12 📚)');
                advanceTime();
              }}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
            >
              <span>📚</span> Tự Học Thư Viện
            </button>
            <button
              onClick={() => setActiveModal('leaderboard')}
              className="py-2.5 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg"
            >
              <span>🏆</span> Bảng Thi Đua
            </button>
          </div>
        </div>

        {/* CÁC CỬA SỔ POPUP (MODAL) */}

        {/* 1. MODAL ĐỒNG BỘ CLOUD */}
        {activeModal === 'cloud' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-indigo-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-indigo-300">☁️ ĐỒNG BỘ CLOUD (CHƠI TRÊN MÁY KHÁC)</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <p className="text-[11px] text-slate-300">Sao chép mã này để đem sang điện thoại hoặc máy tính khác dán vào để tải lại:</p>
              <textarea
                value={cloudCodeText}
                onChange={(e) => setCloudCodeText(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-2 text-[10px] font-mono text-emerald-300 select-all"
              />
              <div className="flex gap-2">
                <button onClick={handleExportCloud} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold">📋 Tạo Mã Hiện Tại</button>
                <button onClick={handleImportCloud} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold">📥 Tải Từ Mã Này</button>
              </div>
            </div>
          </div>
        )}

        {/* 2. MODAL NHẬN ORDER */}
        {activeModal === 'order' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-emerald-400">🛎️ QUẦY ORDER HỌC ĐƯỜNG</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono bg-slate-950 p-2 rounded-xl text-center">
                {inventory.map((inv) => (
                  <span key={inv.id} className="text-slate-300">{inv.id === 'banh_trang' ? '🌯' : inv.id === 'tra_sua_chai' ? '🧋' : inv.id === 'but_cute' ? '🖊️' : '📑'}: <b>{inv.count}</b></span>
                ))}
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {customerOrders.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-500">Đã giao hết đơn order! Bấm gọi khách mới bên dưới.</div>
                ) : (
                  customerOrders.map((ord) => {
                    const invItem = inventory.find((i) => i.id === ord.itemId);
                    const canFulfill = invItem && invItem.count >= ord.qty;
                    return (
                      <div key={ord.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ord.avatar}</span>
                          <div>
                            <div className="font-bold text-slate-200">{ord.customer}</div>
                            <div className="text-[10px] text-slate-400 italic">"{ord.dialogue}"</div>
                            <div className="text-[10px] text-amber-400 font-mono mt-0.5">Đặt: {ord.qty}x • Tip: +{ord.tip.toLocaleString('vi-VN')}đ</div>
                          </div>
                        </div>
                        <button
                          onClick={() => fulfillOrder(ord.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${canFulfill ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                          {canFulfill ? 'Giao Đơn' : 'Thiếu Hàng'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button onClick={() => setActiveModal('wholesale')} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg">🚚 Chợ Sỉ Nhập Hàng</button>
                <button
                  onClick={() => {
                    if (stats.energy < 8) { alert('Bạn quá mệt mỏi!'); return; }
                    const newOrd = { id: Date.now(), customer: 'Tuấn (Bóng rổ)', avatar: '🏀', itemId: 'tra_sua_chai', qty: 1, dialogue: 'Đá bóng khát nước quá, có trà sữa ko?', tip: 3000, stars: 5 };
                    setCustomerOrders((prev) => [...prev, newOrd]);
                    setStats((s) => ({ ...s, energy: s.energy - 8 }));
                    showAlert('🛎️️ Có khách mới đặt order!');
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
                >
                  📢 Gọi Thêm Khách
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. MODAL CHỢ SỈ */}
        {activeModal === 'wholesale' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-blue-300">🚚 CHỢ SỈ ĐẦU MỐI (NHẬP HÀNG)</h3>
                <button onClick={() => setActiveModal('order')} className="text-slate-400 hover:text-white text-xs">← Quay lại quầy</button>
              </div>
              <div className="space-y-2">
                {WHOLESALE_ITEMS.map((item) => (
                  <div key={item.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-400">Giá sỉ: {item.wholesalePrice.toLocaleString('vi-VN')}đ / cái</div>
                      </div>
                    </div>
                    <button onClick={() => buyWholesale(item.id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px]">
                      Nhập 3 Cái ({(item.wholesalePrice * 3).toLocaleString('vi-VN')}đ)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. MODAL TRẢ LỜI CÂU HỎI TRÊN LỚP */}
        {activeModal === 'quiz' && currentQuiz && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-indigo-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-indigo-300">TIẾT HỌC {currentQuiz.subject}</span>
                <span className="text-[10px] text-slate-400">{currentQuiz.teacher}</span>
              </div>
              <p className="text-xs text-slate-200 font-semibold">{currentQuiz.q}</p>
              <div className="grid grid-cols-2 gap-2">
                {currentQuiz.opts.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === currentQuiz.c) {
                        setStats((s) => ({ ...s, study: s.study + 10, mood: Math.min(100, s.mood + 5), energy: Math.max(0, s.energy - 12) }));
                        showAlert(`🎉 Đúng rồi! (+10 📚) ${currentQuiz.tip}`);
                      } else {
                        setStats((s) => ({ ...s, study: s.study + 3, mood: Math.max(0, s.mood - 5), energy: Math.max(0, s.energy - 12) }));
                        showAlert(`😭 Sai rồi! Gợi ý: ${currentQuiz.tip}`);
                      }
                      setActiveModal(null);
                      advanceTime();
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-left text-xs font-bold border border-slate-700 hover:border-amber-400"
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. MODAL HƯỚNG DẪN */}
        {activeModal === 'help' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-amber-300">📖 HƯỚNG DẪN LUẬT CHƠI</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <div className="space-y-2 text-[11px] text-slate-300">
                <p>• <b>Buổi Sáng, Ra Chơi & Sau 17:00</b>: Mở quầy nhận order từ bạn bè kiếm tiền.</p>
                <p>• <b>Trưa, Chiều & Tối</b>: Quầy đóng cửa. Bạn bắt buộc phải tự học, cày đề hoặc bấm <b>Trèo tường trốn học</b> để giải trí.</p>
                <p>• <b>Nút CLOUD góc trên</b>: Bấm vào để copy mã lưu game đem sang điện thoại hoặc máy khác dán vào chơi tiếp.</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs">
                ĐÃ HIỂU, VÀO CHƠI NGAY! 🌸
              </button>
            </div>
          </div>
        )}

        {/* 6. MODAL ĐỔI TÊN */}
        {activeModal === 'name' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-sky-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-sky-300">👤 ĐỔI TÊN HỌC SINH</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <input
                type="text"
                placeholder="Nhập tên của bạn..."
                defaultValue={playerName}
                id="nameInputBox"
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-amber-300 font-bold outline-none"
              />
              <button
                onClick={() => {
                  const val = document.getElementById('nameInputBox').value.trim();
                  if (val) setPlayerName(val);
                  setActiveModal(null);
                  showAlert('Đã đổi tên học sinh thành công!');
                }}
                className="w-full py-2 bg-sky-600 text-white font-bold rounded-xl text-xs"
              >
                Xác Nhận Tên
              </button>
            </div>
          </div>
        )}

        {/* 7. MODAL THI CHỨNG CHỈ */}
        {activeModal === 'cert' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-blue-300">🎓 TRUNG TÂM THI CHỨNG CHỈ QUỐC TẾ</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {CERTIFICATES_DEF.map((c) => {
                  const earned = certsEarned.includes(c.id);
                  return (
                    <div key={c.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{c.icon} {c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.desc}</div>
                        <div className="text-[10px] text-blue-400 font-mono">Lệ phí: {c.cost.toLocaleString('vi-VN')}đ • Yêu cầu: {c.reqStudy} 📚</div>
                      </div>
                      <button
                        disabled={earned}
                        onClick={() => {
                          if (stats.money < c.cost) { alert('Không đủ tiền đóng lệ phí thi!'); return; }
                          if (stats.study < c.reqStudy) { alert(`Cần tối thiểu ${c.reqStudy} điểm Học Tập để thi đỗ!`); return; }
                          setStats((s) => ({ ...s, money: s.money - c.cost, reputation: s.reputation + 15 }));
                          setCertsEarned((prev) => [...prev, c.id]);
                          showAlert(`🎉 Chúc mừng bạn đã thi đỗ ${c.name}!`);
                          triggerFireworks();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${earned ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                      >
                        {earned ? 'ĐÃ ĐẠT' : 'Thi Ngay'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 8. MODAL TẶNG QUÀ CHO TRIỆU MẪN */}
        {activeModal === 'gift' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-pink-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-pink-300">🎁 TIỆM QUÀ LƯU NIỆM DÀNH CHO TRIỆU MẪN</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {SPECIAL_GIFTS.map((g) => (
                  <div key={g.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{g.icon} {g.name}</div>
                      <div className="text-[10px] text-slate-400">{g.desc}</div>
                      <div className="text-[10px] text-pink-400 font-mono">Giá: {g.cost.toLocaleString('vi-VN')}đ • Tăng: +{g.loveGain}% 💕</div>
                    </div>
                    <button
                      onClick={() => {
                        if (stats.money < g.cost) { alert('Không đủ tiền mua quà!'); return; }
                        setStats((s) => ({ ...s, money: s.money - g.cost, love: Math.min(100, s.love + g.loveGain), mood: Math.min(100, s.mood + 10) }));
                        showAlert(`💕 Đã tặng ${g.name} cho Triệu Mẫn! Mẫn rất vui và cảm động.`);
                        triggerFireworks();
                        setActiveModal(null);
                      }}
                      className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-[11px] font-bold"
                    >
                      Tặng Mẫn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 9. MODAL BẢNG THI ĐUA */}
        {activeModal === 'leaderboard' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50">
            <div className="bg-slate-900 border-2 border-yellow-500 rounded-2xl p-4 w-full max-w-md space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-amber-300">🏆 BẢNG THI ĐUA LỚP 12A3</h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
                  <span>🥇 Triệu Mẫn (Lớp Phó)</span>
                  <span className="font-mono text-amber-400 font-bold">92 📚</span>
                </div>
                <div className="p-2 bg-sky-950 border border-sky-500 rounded-xl flex justify-between font-bold text-sky-300">
                  <span>{stats.study > 92 ? '🥇' : '🥈'} {playerName} (Bạn)</span>
                  <span className="font-mono text-amber-400">{stats.study} 📚</span>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex justify-between">
                  <span>🥉 Hoàng Nam</span>
                  <span className="font-mono text-amber-400 font-bold">84 📚</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
