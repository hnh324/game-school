import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // 1. Synthesizer Audio Engine
    class RetroAudio {
      constructor() { this.ctx = null; this.enabled = true; }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }
      playTone(freq, type = 'square', duration = 0.15, vol = 0.15) {
        if (!this.enabled) return; this.init();
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
          osc.connect(gain); gain.connect(this.ctx.destination);
          osc.start(now); osc.stop(now + duration);
        } catch(e){}
      }
      playSuccess() {
        if (!this.enabled) return; this.init();
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => setTimeout(() => this.playTone(f, 'triangle', 0.18, 0.2), idx * 70));
      }
      playWrong() {
        if (!this.enabled) return; this.init();
        [280, 220, 160].forEach((f, idx) => setTimeout(() => this.playTone(f, 'sawtooth', 0.2, 0.25), idx * 80));
      }
      playBell() {
        if (!this.enabled) return; this.init();
        [440, 554, 659, 880].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.35, 0.18), i * 130));
      }
    }
    const audio = new RetroAudio();

    // 2. Data
    const CERTIFICATES = [
      {
        id: 'cert_driver',
        name: 'GPLX Ô Tô Hạng B2 (Bằng Lái Xe)',
        icon: '🚗',
        fee: 120000,
        reqSkill: 20,
        desc: 'Cho phép điều khiển và sở hữu xe hơi cá nhân, mở khóa nghề tài xế VIP.',
        questions: [
          {
            q: 'Người điều khiển xe ô tô trên đường giao thông khi gặp đèn vàng phải làm gì?',
            opts: ['Dừng lại trước vạch dừng, trừ khi đã đi quá vạch thì được đi tiếp', 'Tăng tốc thật nhanh để vượt qua giao lộ', 'Bấm còi inh ỏi rồi rẽ phải ngay', 'Tắt máy xe dắt bộ'],
            c: 0
          },
          {
            q: 'Khi tham gia giao thông trên đường cao tốc, khoảng cách an toàn tối thiểu với xe phía trước ở tốc độ 100km/h là bao nhiêu?',
            opts: ['Khoảng 70 mét', 'Khoảng 20 mét', 'Khoảng 35 mét', 'Khoảng 5 mét'],
            c: 0
          },
          {
            q: 'Hành vi sử dụng rượu, bia mà trong máu hoặc hơi thở có nồng độ cồn khi lái xe ô tô bị xử lý thế nào?',
            opts: ['Bị nghiêm cấm tuyệt đối theo Luật Phòng chống tác hại rượu bia', 'Được phép lái nếu uống dưới 1 lon bia', 'Chỉ bị nhắc nhở nhẹ', 'Chỉ phạt khi gây tai nạn'],
            c: 0
          }
        ]
      },
      {
        id: 'cert_toeic',
        name: 'Chứng Chỉ Tiếng Anh TOEIC 650+ Listening & Reading',
        icon: '🇬🇧',
        fee: 150000,
        reqSkill: 35,
        desc: 'Chứng chỉ ngoại ngữ quốc tế, chìa khóa vào các công ty đa quốc gia.',
        questions: [
          {
            q: 'Complete the sentence: "The marketing director suggested that we _____ the annual conference until next month."',
            opts: ['postpone', 'postpones', 'postponing', 'postponed'],
            c: 0
          },
          {
            q: 'Choose the word closest in meaning to "SUBSTANTIAL" in: "The company reported a substantial increase in profit."',
            opts: ['Significant', 'Minor', 'Tiny', 'Doubtful'],
            c: 0
          },
          {
            q: 'Which preposition fits: "The sales report must be submitted _____ Friday at 5 PM at the latest."',
            opts: ['by', 'on', 'with', 'during'],
            c: 0
          }
        ]
      },
      {
        id: 'cert_mos',
        name: 'Chứng Chỉ Tin Học Văn Phòng MOS (Excel & Data Specialist)',
        icon: '📊',
        fee: 80000,
        reqSkill: 15,
        desc: 'Thành thạo bảng tính, xử lý báo cáo tự động và mô hình tài chính doanh nghiệp.',
        questions: [
          {
            q: 'Trong Excel, hàm nào được dùng phổ biến để tìm kiếm giá trị theo cột từ trái sang phải?',
            opts: ['VLOOKUP hoặc XLOOKUP', 'COUNTIF', 'AVERAGE', 'CONCATENATE'],
            c: 0
          },
          {
            q: 'Để cố định tuyệt đối ô B5 trong công thức tính toán khi kéo sao chép công thức, ta ghi là gì?',
            opts: ['$B$5', 'B5', '#B#5', '&B&5'],
            c: 0
          },
          {
            q: 'Công cụ nào trong Excel cho phép tổng hợp, phân tích và trích xuất báo cáo dữ liệu dạng bảng xoay nhiều chiều?',
            opts: ['PivotTable', 'Conditional Formatting', 'WordArt', 'Data Validation'],
            c: 0
          }
        ]
      },
      {
        id: 'cert_finance',
        name: 'Chứng Chỉ Môi Giới & Phân Tích Kỹ Thuật Chứng Khoán',
        icon: '📈',
        fee: 250000,
        reqSkill: 40,
        desc: 'Cấp phép tư vấn đầu tư cổ phiếu, phân tích chỉ số tài chính và quản lý quỹ.',
        questions: [
          {
            q: 'Chỉ số P/E (Price-to-Earnings Ratio) trong định giá chứng khoán đo lường điều gì?',
            opts: ['Mức giá thị trường mà nhà đầu tư sẵn sàng trả cho 1 đồng lợi nhuận của doanh nghiệp', 'Tổng số nợ ngân hàng của doanh nghiệp', 'Khối lượng giao dịch trong phiên ATO', 'Tỷ lệ chia cổ tức bằng cổ phiếu'],
            c: 0
          },
          {
            q: 'Hiện tượng "Margin Call" xảy ra khi nào?',
            opts: ['Tỷ lệ ký quỹ tài khoản vay giảm xuống dưới ngưỡng an toàn do giá cổ phiếu giảm mạnh', 'Doanh nghiệp phát hành cổ phiếu thưởng', 'Thị trường chạm mức trần tăng kịch biên độ', 'Nhà đầu tư rút hết tiền mặt về tài khoản'],
            c: 0
          },
          {
            q: 'Đường trung bình động nào sau đây thường được dùng làm thước đo xu hướng trung hạn?',
            opts: ['MA 50 ngày', 'MA 3 ngày', 'RSI 14', 'Bollinger Bands'],
            c: 0
          }
        ]
      }
    ];

    const PROPERTIES_CATALOG = [
      { id: 'asset_bike', name: 'Xe Tay Ga Air Blade 160cc Mới', type: 'vehicle', price: 450000, icon: '🛵', desc: 'Đi lại chủ động, không còn lo trễ học tiết 1.', buffDesc: '+10 Năng lượng mỗi sáng thức dậy', reqLicense: null },
      { id: 'asset_car_sedan', name: 'Xe Ô Tô Sedan Mazda 3 Màu Đỏ Pha Lê', type: 'vehicle', price: 1800000, icon: '🚗', desc: 'Xe che mưa che nắng, chở Triệu Mẫn vi vu cuối tuần cực ngầu.', buffDesc: '+25% Tình cảm crush & Tự động tăng 10 Danh tiếng', reqLicense: 'cert_driver' },
      { id: 'asset_car_super', name: 'Siêu Xe Porsche 911 Targa Thể Thao', type: 'vehicle', price: 6500000, icon: '🏎️', desc: 'Đỉnh cao phong độ giới trẻ, tiếng gầm động cơ làm cả trường ngoái nhìn.', buffDesc: '+50 Danh tiếng & Tối đa hóa Tâm trạng (+30 😊)', reqLicense: 'cert_driver' },
      { id: 'asset_condo', name: 'Căn Hộ Chung Cư Studio View Thành Phố', type: 'house', price: 3200000, icon: '🏙️', desc: 'Không gian sống độc lập, phòng học yên tĩnh tuyệt đối.', buffDesc: 'Mỗi lần về nhà học bài: +15 Học tập & hồi 100% Năng lượng', reqLicense: null },
      { id: 'asset_villa', name: 'Biệt Thự Vườn Thảo Điền Đẳng Cấp', type: 'house', price: 12000000, icon: '🏰', desc: 'Khu biệt thự sang trọng ven sông, khuôn viên hồ bơi và gara siêu xe.', buffDesc: 'Khóa kết thúc: Tự động đạt danh hiệu Huyền Thoại Tài Phú', reqLicense: null }
    ];

    const PART_TIME_JOBS = [
      { id: 'job_canteen', name: 'Phụ việc Căn tin Cô Năm', icon: '🍜', salary: 25000, energyCost: 25, hpCost: 5, skillGain: 4, reqDesc: 'Dành cho mọi học sinh', condition: (s) => true, diaryMsg: 'Phụ cô Năm bán bánh tráng và dọn bàn. Mệt nhưng vui vì có tiền tiêu vặt.' },
      { id: 'job_flyer', name: 'Phát tờ rơi & Pha chế trà sữa', icon: '🧋', salary: 35000, energyCost: 30, hpCost: 6, skillGain: 5, reqDesc: 'Cần Năng lượng ⚡ ≥ 30', condition: (s) => s.stats.energy >= 30, diaryMsg: 'Làm việc năng nổ tại quán trà sữa, nhận tiền công xứng đáng.' },
      { id: 'job_office_excel', name: 'Xử lý Bảng tính & Nhập liệu Doanh nghiệp', icon: '📊', salary: 95000, energyCost: 20, hpCost: 0, skillGain: 8, reqDesc: 'Yêu cầu: Chứng chỉ MOS (Excel)', condition: (s) => s.certificates.includes('cert_mos'), diaryMsg: 'Ứng dụng hàm Excel và PivotTable xử lý dữ liệu tồn kho công ty mượt mà, nhận thưởng nóng!' },
      { id: 'job_driver_vip', name: 'Tài xế Công nghệ Xe Hơi & Chở Khách VIP', icon: '🚘', salary: 180000, energyCost: 25, hpCost: 2, skillGain: 10, reqDesc: 'Yêu cầu: Bằng B2 + Có Ô Tô Sedan', condition: (s) => s.certificates.includes('cert_driver') && (s.assets.includes('asset_car_sedan') || s.assets.includes('asset_car_super')), diaryMsg: 'Lái xe đưa đón đối tác VIP và lượn một vòng đón Mẫn. Thu nhập cực kỳ ấn tượng!' },
      { id: 'job_interpreter', name: 'Trợ lý Song ngữ & Phiên dịch Hội thảo', icon: '🎙️', salary: 220000, energyCost: 22, hpCost: 0, skillGain: 12, reqDesc: 'Yêu cầu: Chứng chỉ TOEIC 650+', condition: (s) => s.certificates.includes('cert_toeic'), diaryMsg: 'Tự tin giao tiếp và dịch thuật lưu loát tại hội thảo quốc tế.' },
      { id: 'job_broker', name: 'Môi giới & Quản lý Danh mục Chứng khoán', icon: '📈', salary: 450000, energyCost: 28, hpCost: 3, skillGain: 16, reqDesc: 'Yêu cầu: Chứng chỉ Môi Giới Chứng Khoán', condition: (s) => s.certificates.includes('cert_finance'), diaryMsg: 'Phân tích biểu đồ kỹ thuật và chốt lệnh thành công mang lại hoa hồng lớn!' }
    ];

    const TEACHERS = {
      toan: { name: 'Thầy Minh', avatar: '👨‍🏫', subject: 'TOÁN HỌC' },
      anh: { name: 'Cô Jennifer', avatar: '👱‍♀️', subject: 'TIẾNG ANH' },
      ly: { name: 'Thầy Tuấn', avatar: '👨‍🔬', subject: 'VẬT LÝ' }
    };

    const QUIZ_BANK = [
      { id: 'm1', subKey: 'toan', q: 'Đạo hàm của hàm số y = e^(2x) là gì?', opts: ['2e^(2x)', 'e^(2x)', '2xe^(2x)', 'e^(2x) / 2'], c: 0, rOk: 'Thầy Minh gật đầu: "Chuẩn xác, đạo hàm e^u bằng u\' nhân e^u!"', rFail: 'Thầy Minh: "Xem lại quy tắc đạo hàm hàm hợp!"' },
      { id: 'm2', subKey: 'toan', q: 'Cho cấp số cộng có u1 = 3, công sai d = 4. Số hạng thứ 5 bằng bao nhiêu?', opts: ['19', '15', '23', '20'], c: 0, rOk: 'Thầy Minh: "u5 = u1 + 4d = 3 + 16 = 19, rất tốt!"', rFail: 'Thầy Minh: "Tính nhầm công thức cấp số cộng rồi!"' },
      { id: 'ta1', subKey: 'anh', q: 'Choose the correct form: "If she _____ harder, she would pass the exam."', opts: ['studied', 'studies', 'study', 'had studied'], c: 0, rOk: 'Cô Jennifer: "Exactly! Conditional sentence type 2."', rFail: 'Cô Jennifer: "Check second conditional rules again!"' },
      { id: 'l1', subKey: 'ly', q: 'Đơn vị đo công suất tiêu thụ điện trong hệ SI là?', opts: ['Watt (W)', 'Joule (J)', 'Volt (V)', 'Ampe (A)'], c: 0, rOk: 'Thầy Tuấn: "Chính xác, công suất đo bằng Watt!"', rFail: 'Thầy Tuấn: "Joule là năng lượng, công suất là Watt!"' }
    ];

    const CANTEEN_MENU = [
      { id: 'f1', name: 'Bánh tráng trộn bò khô', cost: 15000, energy: 25, mood: 15, love: 0, icon: '🥣' },
      { id: 'f2', name: 'Milo dầm trân châu mát lạnh', cost: 20000, energy: 30, mood: 20, love: 0, icon: '🍫' },
      { id: 'f3', name: 'Bao Triệu Mẫn Trà Sữa Full Topping', cost: 45000, energy: 20, mood: 30, love: 12, icon: '💖' }
    ];

    const STATE = {
      isGameOver: false,
      day: 1,
      totalDays: 45,
      timeIndex: 0,
      location: 'class',
      stats: { hp: 85, energy: 100, mood: 75, study: 50, friends: 40, love: 20, reputation: 30, skill: 25, money: 150000 },
      certificates: [],
      assets: [],
      bag: [
        { id: 'math_note', name: 'Sổ Công Thức', icon: '📘', count: 1, desc: '+8 Điểm học tập' },
        { id: 'gift_strawberry', name: 'Kẹo Dâu Tây', icon: '🍬', count: 2, desc: '+8% Tình cảm Triệu Mẫn' }
      ],
      todayEvents: [],
      diaryEntries: []
    };

    const TIME_PERIODS = [
      { text: '07:30', name: 'Buổi sáng • Tiết 1-2' },
      { text: '09:15', name: 'Giờ ra chơi' },
      { text: '11:30', name: 'Tan trường trưa' },
      { text: '14:00', name: 'Buổi chiều • Hoạt động' },
      { text: '17:00', name: 'Chiều muộn • Đi làm' },
      { text: '20:30', name: 'Buổi tối • Góc cá nhân' }
    ];

    const DAYS_OF_WEEK = ['THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY', 'CHỦ NHẬT'];
    const LOCATIONS_LIST = ['class', 'canteen', 'job', 'cert', 'prop', 'home'];

    let currentExam = { certId: null, questionIndex: 0, score: 0, questions: [] };

    // Function bindings to window for HTML onclicks
    window.openCertHub = function() {
      window.closeOverlayCard();
      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      document.getElementById('certExamCard')?.classList.remove('hidden');
      renderCertificatesList();
    };

    function renderCertificatesList() {
      const container = document.getElementById('certListContainer');
      document.getElementById('certExamRunner')?.classList.add('hidden');
      if (!container) return;
      container.classList.remove('hidden');
      container.innerHTML = '';

      CERTIFICATES.forEach(cert => {
        const isPassed = STATE.certificates.includes(cert.id);
        const div = document.createElement('div');
        div.className = `p-3 rounded-xl border flex items-center justify-between text-xs transition ${isPassed ? 'bg-emerald-950/40 border-emerald-600' : 'bg-slate-950 border-slate-800'}`;
        div.innerHTML = `
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">${cert.icon}</span>
            <div>
              <div class="font-bold text-slate-100 flex items-center gap-2">
                ${cert.name}
                ${isPassed ? '<span class="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/40">ĐÃ ĐẠT</span>' : ''}
              </div>
              <div class="text-[10px] text-slate-400 leading-snug">${cert.desc}</div>
              <div class="text-[10px] text-cyan-400 font-mono mt-0.5">Lệ phí thi: ${cert.fee.toLocaleString('vi-VN')}đ | Yêu cầu Kỹ năng 🧠 ≥ ${cert.reqSkill}</div>
            </div>
          </div>
          <div>
            ${isPassed ? 
              '<span class="text-emerald-400 font-bold text-[11px]">Đã có bằng</span>' : 
              `<button onclick="window.startCertificateExam('${cert.id}')" class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-[11px] shrink-0">Đăng Ký Thi</button>`
            }
          </div>
        `;
        container.appendChild(div);
      });
    }

    window.startCertificateExam = function(certId) {
      const cert = CERTIFICATES.find(c => c.id === certId);
      if (!cert) return;

      if (STATE.stats.money < cert.fee) {
        showStatAlert('💸 Không đủ tiền nộp lệ phí thi!', 'text-rose-400');
        audio.playWrong();
        return;
      }
      if (STATE.stats.skill < cert.reqSkill) {
        showStatAlert(`⚠️ Bạn cần ít nhất ${cert.reqSkill} Kỹ năng sống để dự thi!`, 'text-amber-400');
        audio.playWrong();
        return;
      }
      if (STATE.stats.energy < 25) {
        showStatAlert('⚠️ Bạn quá mệt mỏi, cần nghỉ ngơi trước khi thi!', 'text-rose-400');
        audio.playWrong();
        return;
      }

      modifyStats({ money: -cert.fee, energy: -25 });

      currentExam.certId = certId;
      currentExam.questionIndex = 0;
      currentExam.score = 0;
      currentExam.questions = [...cert.questions];

      document.getElementById('certListContainer')?.classList.add('hidden');
      document.getElementById('certExamRunner')?.classList.remove('hidden');
      const rName = document.getElementById('certRunnerName');
      if (rName) rName.textContent = cert.name;

      renderCurrentCertQuestion();
    };

    function renderCurrentCertQuestion() {
      const q = currentExam.questions[currentExam.questionIndex];
      const prog = document.getElementById('certRunnerProgress');
      const qText = document.getElementById('certRunnerQuestion');
      if (prog) prog.textContent = `Câu ${currentExam.questionIndex + 1}/${currentExam.questions.length}`;
      if (qText) qText.textContent = q.q;

      const optBox = document.getElementById('certRunnerOptions');
      if (!optBox) return;
      optBox.innerHTML = '';

      q.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'p-2 bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 rounded-lg text-xs text-left text-slate-200 transition';
        btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
        btn.onclick = () => handleCertAnswer(idx === q.c);
        optBox.appendChild(btn);
      });
    }

    function handleCertAnswer(isCorrect) {
      if (isCorrect) {
        currentExam.score++;
        audio.playSuccess();
      } else {
        audio.playWrong();
      }

      currentExam.questionIndex++;
      if (currentExam.questionIndex < currentExam.questions.length) {
        renderCurrentCertQuestion();
      } else {
        finishCertExam();
      }
    }

    function finishCertExam() {
      const cert = CERTIFICATES.find(c => c.id === currentExam.certId);
      const isPassed = currentExam.score >= 2;

      if (isPassed) {
        STATE.certificates.push(cert.id);
        modifyStats({ reputation: +20, mood: +20, skill: +10 });
        audio.playSuccess();
        alert(`🎉 CHÚC MỪNG! Bạn đã đỗ và nhận [${cert.name}]!`);
        STATE.todayEvents.push(`Nhận được chứng chỉ danh giá [${cert.name}].`);
      } else {
        modifyStats({ mood: -10 });
        audio.playWrong();
        alert(`😢 RẤT TIẾC! Bạn chỉ đúng ${currentExam.score}/${currentExam.questions.length} câu. Hãy thi lại sau!`);
      }
      renderCertificatesList();
      advanceTime();
    }

    window.openPropertyShop = function() {
      window.closeOverlayCard();
      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      document.getElementById('propertyShopCard')?.classList.remove('hidden');

      const list = document.getElementById('propertyShopList');
      if (!list) return;
      list.innerHTML = '';

      PROPERTIES_CATALOG.forEach(item => {
        const isOwned = STATE.assets.includes(item.id);
        const div = document.createElement('div');
        div.className = `p-3 rounded-xl border flex items-center justify-between text-xs transition ${isOwned ? 'bg-amber-950/30 border-amber-500' : 'bg-slate-950 border-slate-800'}`;
        div.innerHTML = `
          <div class="flex items-center gap-2.5">
            <span class="text-3xl">${item.icon}</span>
            <div>
              <div class="font-bold text-slate-100 flex items-center gap-2">
                ${item.name}
                ${isOwned ? '<span class="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/40">ĐÃ SỞ HỮU</span>' : ''}
              </div>
              <div class="text-[10px] text-slate-400">${item.desc}</div>
              <div class="text-[10px] text-emerald-400 font-bold mt-0.5">Giá: ${item.price.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
          <div>
            ${isOwned ? 
              '<span class="text-amber-400 font-bold text-[11px]">Đang dùng</span>' : 
              `<button onclick="window.buyProperty('${item.id}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-[11px] shrink-0">Mua Ngay</button>`
            }
          </div>
        `;
        list.appendChild(div);
      });
    };

    window.buyProperty = function(propId) {
      const item = PROPERTIES_CATALOG.find(p => p.id === propId);
      if (!item) return;

      if (STATE.assets.includes(item.id)) {
        alert('Bạn đã sở hữu tài sản này rồi!');
        return;
      }
      if (item.reqLicense && !STATE.certificates.includes(item.reqLicense)) {
        audio.playWrong();
        alert('⛔ Bạn chưa có [Bằng Lái Xe Ô Tô B2]! Hãy thi lấy bằng trước.');
        return;
      }
      if (STATE.stats.money < item.price) {
        audio.playWrong();
        showStatAlert('💸 Bạn không đủ tiền tích lũy!', 'text-rose-400');
        return;
      }

      modifyStats({ money: -item.price, reputation: +30, mood: +35 });
      STATE.assets.push(item.id);

      if (item.id === 'asset_car_sedan' || item.id === 'asset_car_super') {
        modifyStats({ love: +25 });
        showStatAlert(`🏎️ Tậu xe mới! Triệu Mẫn cực kỳ ấn tượng (+25% 💕)`, 'text-pink-400');
      }
      audio.playSuccess();
      window.openPropertyShop();
    };

    window.openJobMenu = function() {
      window.closeOverlayCard();
      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      document.getElementById('jobMenuCard')?.classList.remove('hidden');

      const list = document.getElementById('jobItemsList');
      if (!list) return;
      list.innerHTML = '';

      PART_TIME_JOBS.forEach(job => {
        const canDo = job.condition(STATE);
        const div = document.createElement('div');
        div.className = `p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${canDo ? 'bg-slate-950 border-slate-800 hover:border-indigo-500/50' : 'bg-slate-950/40 border-slate-900 opacity-60'}`;
        div.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-2xl">${job.icon}</span>
            <div>
              <b class="text-slate-200">${job.name}</b>
              <div class="text-[10px] text-slate-400">Lương: <span class="text-emerald-400 font-bold">+${job.salary.toLocaleString('vi-VN')}đ</span> | Tốn: <span class="text-amber-400">-${job.energyCost}⚡</span></div>
              <div class="text-[9px] text-indigo-300 font-mono">${job.reqDesc}</div>
            </div>
          </div>
          <button class="px-3 py-1.5 ${canDo ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} font-bold rounded-lg text-[11px] shrink-0" onclick="${canDo ? `window.performJob('${job.id}')` : `alert('Chưa đủ điều kiện: ${job.reqDesc}')`}">
            Đi Làm
          </button>
        `;
        list.appendChild(div);
      });
    };

    window.performJob = function(jobId) {
      const job = PART_TIME_JOBS.find(j => j.id === jobId);
      if (!job) return;

      if (STATE.stats.energy < job.energyCost) {
        showStatAlert('⚠️ Bạn quá đuối sức để hoàn thành công việc!', 'text-rose-400');
        audio.playWrong();
        return;
      }

      modifyStats({
        money: job.salary,
        energy: -job.energyCost,
        hp: -job.hpCost,
        skill: job.skillGain,
        mood: -2
      });

      audio.playSuccess();
      showStatAlert(`💰 Nhận lương +${job.salary.toLocaleString('vi-VN')}đ!`, 'text-emerald-400');
      STATE.todayEvents.push(job.diaryMsg);
      advanceTime();
    };

    window.openCanteenMenu = function() {
      window.closeOverlayCard();
      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      document.getElementById('canteenMenuCard')?.classList.remove('hidden');

      const list = document.getElementById('canteenItemsList');
      if (!list) return;
      list.innerHTML = '';
      CANTEEN_MENU.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs';
        div.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-xl">${item.icon}</span>
            <div>
              <div class="font-bold text-slate-200">${item.name}</div>
              <div class="text-[10px] text-emerald-400 font-bold">${item.cost.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
          <button class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px]" onclick="window.buyCanteenItem('${item.id}')">Mua</button>
        `;
        list.appendChild(div);
      });
    };

    window.buyCanteenItem = function(itemId) {
      const item = CANTEEN_MENU.find(f => f.id === itemId);
      if (!item) return;

      if (STATE.stats.money < item.cost) {
        showStatAlert('💸 Ví hết tiền rồi!', 'text-rose-400');
        audio.playWrong();
        return;
      }

      modifyStats({ money: -item.cost, energy: item.energy, mood: item.mood, love: item.love });
      audio.playSuccess();
      showStatAlert(`😋 Đã thưởng thức ${item.name}!`, 'text-emerald-400');
      advanceTime();
    };

    window.startClassroomLesson = function() {
      if (STATE.isGameOver) return;
      if (STATE.stats.energy < 15) {
        showStatAlert('⚠️ Bạn quá buồn ngủ, không tập trung được!', 'text-rose-400');
        return;
      }
      const q = QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)];
      const t = TEACHERS[q.subKey];

      window.closeOverlayCard();
      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      const quizCard = document.getElementById('classroomQuizCard');
      quizCard?.classList.remove('hidden');

      document.getElementById('quizSubjectBadge').textContent = `MÔN ${t.subject}`;
      document.getElementById('quizTeacherName').textContent = t.name;
      document.getElementById('quizTeacherAvatar').textContent = t.avatar;
      document.getElementById('quizTeacherQuestion').textContent = q.q;

      const optsBox = document.getElementById('quizOptionsContainer');
      if (!optsBox) return;
      optsBox.innerHTML = '';
      q.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs font-semibold text-slate-200';
        btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
        btn.onclick = () => {
          quizCard.classList.add('hidden');
          document.getElementById('sceneryAvatarGroup')?.classList.remove('hidden');
          if (idx === q.c) {
            modifyStats({ study: +8, mood: +5, energy: -15, reputation: +3 });
            audio.playSuccess();
            alert(q.rOk);
          } else {
            modifyStats({ study: +2, mood: -5, energy: -15 });
            audio.playWrong();
            alert(q.rFail);
          }
          advanceTime();
        };
        optsBox.appendChild(btn);
      });
    };

    window.interactNPC = function(who) {
      if (STATE.isGameOver) return;
      if (who === 'crush') {
        openCrushDialogue();
      } else if (who === 'lan') {
        modifyStats({ energy: -10, mood: +15, friends: +6 });
        showStatAlert('👧 Tám chuyện cùng bạn thân Lan (+6 👥)', 'text-sky-400');
        advanceTime();
      } else if (who === 'tuan') {
        modifyStats({ energy: -15, hp: +6, mood: +10 });
        showStatAlert('🏀 Ném bóng cùng Tuấn (+6 ❤️)', 'text-amber-400');
        advanceTime();
      }
    };

    function openCrushDialogue() {
      window.closeOverlayCard();
      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      const card = document.getElementById('dialogueCard');
      card?.classList.remove('hidden');

      const hasCar = STATE.assets.includes('asset_car_sedan') || STATE.assets.includes('asset_car_super');
      const speechEl = document.getElementById('dialogueSpeech');
      const choicesEl = document.getElementById('dialogueChoices');
      if (!choicesEl || !speechEl) return;
      choicesEl.innerHTML = '';

      if (hasCar) {
        speechEl.textContent = '“Wow... Bạn tự đi làm tích góp mua được ô tô xịn vậy luôn hả? Chiều nay chở tớ đi ngắm hoàng hôn được không? 💕”';
        createDialogueChoice('“Lên xe nào Mẫn ơi, hôm nay tớ làm tài xế riêng cho cậu!”', { love: +15, mood: +25, energy: -8 }, 'Lái ô tô chở Triệu Mẫn dạo phố');
      } else {
        speechEl.textContent = '“Này cậu! Dạo này thấy cậu chăm chỉ học hành thi cử ghê nha. Cố lên nhé, tớ luôn ủng hộ cậu!”';
        createDialogueChoice('“Cảm ơn Mẫn nhé, tớ đang cố gắng để có một tương lai thật vững vàng.”', { love: +8, mood: +15, energy: -5 }, 'Cười tươi đáp lời Mẫn');
      }
    }

    function createDialogueChoice(text, changes, eventNote) {
      const container = document.getElementById('dialogueChoices');
      const btn = document.createElement('button');
      btn.className = 'w-full p-2.5 bg-slate-800 hover:bg-pink-950/60 rounded-xl border border-pink-700/60 text-left text-xs font-semibold text-slate-100';
      btn.textContent = text;
      btn.onclick = () => {
        modifyStats(changes);
        STATE.todayEvents.push(eventNote);
        audio.playSuccess();
        window.closeOverlayCard();
        advanceTime();
      };
      container?.appendChild(btn);
    }

    window.gotoLocation = function(loc) {
      STATE.location = loc;
      window.closeOverlayCard();
      LOCATIONS_LIST.forEach(l => {
        const btn = document.getElementById(`nav_${l}`);
        if (btn) btn.className = (l === loc) ? 'loc-btn flex-1 py-1.5 px-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold transition flex items-center justify-center gap-1 shadow-inner' : 'loc-btn flex-1 py-1.5 px-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1';
      });

      if (loc === 'class') {
        const lt = document.getElementById('locTitle');
        const li = document.getElementById('locIcon');
        if (lt) lt.textContent = 'LỚP 12A3 - KHỐI CHUYÊN';
        if (li) li.textContent = '🏫';
      } else if (loc === 'canteen') {
        window.openCanteenMenu();
      } else if (loc === 'job') {
        window.openJobMenu();
      } else if (loc === 'home') {
        const lt = document.getElementById('locTitle');
        const li = document.getElementById('locIcon');
        if (lt) lt.textContent = 'PHÒNG RIÊNG Ở NHÀ';
        if (li) li.textContent = '🏠';
        if (STATE.assets.includes('asset_condo')) {
          modifyStats({ energy: +25 });
          showStatAlert('🏙️ Thư giãn trong căn hộ studio tiện nghi (+25 ⚡)', 'text-sky-400');
        }
      }
      updateHUD();
    };

    window.navigateDpad = function(dir) {
      let cur = LOCATIONS_LIST.indexOf(STATE.location);
      cur = (cur + dir + LOCATIONS_LIST.length) % LOCATIONS_LIST.length;
      const target = LOCATIONS_LIST[cur];
      if (target === 'cert') window.openCertHub();
      else if (target === 'prop') window.openPropertyShop();
      else window.gotoLocation(target);
    };

    function modifyStats(c) {
      const s = STATE.stats;
      if (c.hp !== undefined) s.hp = Math.max(0, Math.min(100, s.hp + c.hp));
      if (c.energy !== undefined) s.energy = Math.max(0, Math.min(100, s.energy + c.energy));
      if (c.mood !== undefined) s.mood = Math.max(0, Math.min(100, s.mood + c.mood));
      if (c.study !== undefined) s.study = Math.max(0, s.study + c.study);
      if (c.friends !== undefined) s.friends = Math.max(0, Math.min(100, s.friends + c.friends));
      if (c.love !== undefined) s.love = Math.max(0, Math.min(100, s.love + c.love));
      if (c.reputation !== undefined) s.reputation = Math.max(0, Math.min(100, s.reputation + c.reputation));
      if (c.skill !== undefined) s.skill = Math.max(0, Math.min(100, s.skill + c.skill));
      if (c.money !== undefined) s.money = Math.max(0, s.money + c.money);
      updateHUD();
      window.saveGame();
    }

    function advanceTime() {
      STATE.timeIndex++;
      if (STATE.timeIndex >= TIME_PERIODS.length) {
        triggerEndOfDayDiary();
      } else {
        updateHUD();
      }
    }

    window.quickSleep = function() {
      if (confirm('Đi ngủ sớm để sang ngày mới?')) triggerEndOfDayDiary();
    };

    function triggerEndOfDayDiary() {
      audio.playBell();
      window.closeOverlayCard();

      let energyRecover = 100;
      STATE.stats.energy = energyRecover;
      STATE.stats.money += 20000;

      let diaryText = `Ngày thứ ${STATE.day}: ` + (STATE.todayEvents.length > 0 ? STATE.todayEvents.join(' ') : 'Một ngày học tập và tích lũy trôi qua bình yên.');
      STATE.diaryEntries.push({ day: STATE.day, text: diaryText });
      STATE.todayEvents = [];

      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      const diaryCard = document.getElementById('diaryModalCard');
      diaryCard?.classList.remove('hidden');
      const dt = document.getElementById('diaryTitle');
      const dc = document.getElementById('diaryContentText');
      if (dt) dt.textContent = `NHẬT KÝ — NGÀY ${STATE.day}`;
      if (dc) dc.innerText = diaryText;

      const btnCont = document.getElementById('btnContinueFromDiary');
      if (btnCont) {
        btnCont.onclick = () => {
          window.closeOverlayCard();
          STATE.day++;
          STATE.timeIndex = 0;
          window.gotoLocation('class');
          if (STATE.day > STATE.totalDays) triggerGraduationEnding();
        };
      }
    }

    window.openDiaryManual = function() {
      window.closeOverlayCard();
      const diaryCard = document.getElementById('diaryModalCard');
      diaryCard?.classList.remove('hidden');
      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      const latest = STATE.diaryEntries[STATE.diaryEntries.length - 1];
      const dt = document.getElementById('diaryTitle');
      const dc = document.getElementById('diaryContentText');
      if (dt) dt.textContent = `NHẬT KÝ NGÀY ${latest ? latest.day : STATE.day}`;
      if (dc) dc.innerText = latest ? latest.text : 'Chưa có trang nhật ký nào.';
      const btnCont = document.getElementById('btnContinueFromDiary');
      if (btnCont) btnCont.onclick = () => window.closeOverlayCard();
    };

    function triggerGraduationEnding() {
      STATE.isGameOver = true;
      window.closeOverlayCard();
      document.getElementById('sceneryAvatarGroup')?.classList.add('hidden');
      document.getElementById('endingScreenCard')?.classList.remove('hidden');
      audio.playSuccess();

      const s = STATE.stats;
      let title = '', sub = '', desc = '';

      if (STATE.assets.includes('asset_villa') || s.money >= 5000000) {
        title = '👑 ĐẠI GIA BẤT ĐỘNG SẢN & TÀI CHÍNH';
        sub = 'Tuổi trẻ tài cao, sở hữu dinh cơ tiền tỷ';
        desc = 'Bạn vừa tốt nghiệp đã có trong tay nhà lầu, siêu xe và khối tài sản đáng mơ ước!';
      } else if (STATE.certificates.length >= 3) {
        title = '🌟 CHUYÊN GIA TOÀN NĂNG - TÀI NĂNG ĐA LĨNH VỰC';
        sub = 'Sở hữu bộ sưu tập chứng chỉ quốc tế danh giá';
        desc = 'Bằng lái B2, TOEIC, MOS và Chứng khoán nằm trọn trong tay bạn!';
      } else if (s.love >= 80 && (STATE.assets.includes('asset_car_sedan') || STATE.assets.includes('asset_car_super'))) {
        title = '💕 CHUYỆN TÌNH XE HOA CÙNG TRIỆU MẪN';
        sub = 'Thanh xuân trọn vẹn bên người mình yêu';
        desc = 'Hình ảnh bạn lái ô tô đón Triệu Mẫn ngày bế giảng đã trở thành huyền thoại!';
      } else {
        title = '🌸 THANH XUÂN TỰ LẬP VÀ TRƯỞNG THÀNH';
        sub = 'Vững bước vào đời bằng chính thực lực';
        desc = 'Một thời học sinh đầy trải nghiệm: vừa học, vừa kiếm tiền, thi bằng cấp và sắm sửa ước mơ.';
      }

      const et = document.getElementById('endingTitle');
      const es = document.getElementById('endingSubtitle');
      const ed = document.getElementById('endingDescription');
      if (et) et.textContent = title;
      if (es) es.textContent = sub;
      if (ed) ed.textContent = desc;

      const esStudy = document.getElementById('endStatStudy');
      const esLove = document.getElementById('endStatLove');
      const esCerts = document.getElementById('endStatCerts');
      const esAssets = document.getElementById('endStatAssets');
      if (esStudy) esStudy.textContent = s.study;
      if (esLove) esLove.textContent = `${s.love}%`;
      if (esCerts) esCerts.textContent = `${STATE.certificates.length} bằng`;
      if (esAssets) esAssets.textContent = `${STATE.assets.length} món`;
    }

    window.restartGame = function() {
      localStorage.removeItem('thanh_xuan_jrpg_save');
      window.location.reload();
    };

    window.toggleTabAction = function(tab) {
      const drawer = document.getElementById('actionDrawerPanel');
      const title = document.getElementById('drawerTitle');
      const content = document.getElementById('drawerContent');
      if (!drawer || !title || !content) return;
      drawer.classList.remove('hidden');

      if (tab === 'study') {
        title.textContent = '📖 HỌC TẬP & CÀY ĐỀ';
        content.innerHTML = `
          <button onclick="window.startClassroomLesson()" class="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left text-xs mb-2">✍️ Trả lời câu hỏi giáo viên (-15⚡)</button>
          <button onclick="window.openCertHub()" class="w-full p-2.5 bg-cyan-950 hover:bg-cyan-900 rounded-xl border border-cyan-700 text-left text-xs text-cyan-300">📜 Đến Trung Tâm Thi Chứng Chỉ</button>
        `;
      } else if (tab === 'profile') {
        title.textContent = '🎖️ CÁC CHỨNG CHỈ ĐÃ ĐẠT';
        if (STATE.certificates.length === 0) {
          content.innerHTML = '<p class="text-slate-400 text-xs">Bạn chưa thi đạt chứng chỉ nào. Bấm nút "Chứng Chỉ" ở menu để thi!</p>';
        } else {
          content.innerHTML = STATE.certificates.map(cId => {
            const cert = CERTIFICATES.find(c => c.id === cId);
            return `<div class="p-2 bg-slate-800 rounded-xl border border-cyan-500/50 flex items-center gap-2"><span>${cert.icon}</span><b>${cert.name}</b></div>`;
          }).join('');
        }
      } else if (tab === 'assets') {
        title.textContent = '🏡 BẤT ĐỘNG SẢN & XE ĐANG SỞ HỮU';
        if (STATE.assets.length === 0) {
          content.innerHTML = '<p class="text-slate-400 text-xs">Bạn chưa sở hữu tài sản nào. Vào mục "Nhà & Xe" để tậu!</p>';
        } else {
          content.innerHTML = STATE.assets.map(aId => {
            const ast = PROPERTIES_CATALOG.find(p => p.id === aId);
            return `<div class="p-2 bg-slate-800 rounded-xl border border-amber-500/50 flex items-center justify-between"><div><span>${ast.icon}</span> <b>${ast.name}</b></div><span class="text-[10px] text-amber-300 font-mono">${ast.buffDesc}</span></div>`;
          }).join('');
        }
      } else if (tab === 'bag') {
        title.textContent = '🎒 TÚI ĐỒ CÁ NHÂN';
        content.innerHTML = STATE.bag.map(i => `<div class="p-2 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center text-xs"><span>${i.icon} ${i.name} (x${i.count})</span></div>`).join('');
      }
    };

    window.closeDrawer = function() {
      document.getElementById('actionDrawerPanel')?.classList.add('hidden');
    };

    window.closeOverlayCard = function() {
      ['classroomQuizCard', 'canteenMenuCard', 'jobMenuCard', 'dialogueCard', 'diaryModalCard', 'propertyShopCard', 'certExamCard'].forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
      });
      document.getElementById('sceneryAvatarGroup')?.classList.remove('hidden');
      window.closeDrawer();
    };

    function updateHUD() {
      const p = TIME_PERIODS[STATE.timeIndex] || TIME_PERIODS[0];
      const dow = document.getElementById('uiDayOfWeek');
      const ut = document.getElementById('uiTimeText');
      const ucp = document.getElementById('uiCurrentPeriodText');
      const udc = document.getElementById('uiDayCount');
      if (dow) dow.textContent = DAYS_OF_WEEK[(STATE.day - 1) % 7];
      if (ut) ut.textContent = p.text;
      if (ucp) ucp.textContent = p.name;
      if (udc) udc.textContent = STATE.day;

      const shp = document.getElementById('statHp');
      const se = document.getElementById('statEnergy');
      const sm = document.getElementById('statMood');
      const ss = document.getElementById('statStudy');
      const sl = document.getElementById('statLove');
      const ssk = document.getElementById('statSkill');
      const smo = document.getElementById('statMoney');
      if (shp) shp.textContent = STATE.stats.hp;
      if (se) se.textContent = STATE.stats.energy;
      if (sm) sm.textContent = STATE.stats.mood;
      if (ss) ss.textContent = STATE.stats.study;
      if (sl) sl.textContent = `${STATE.stats.love}%`;
      if (ssk) ssk.textContent = STATE.stats.skill;
      if (smo) smo.textContent = `${STATE.stats.money.toLocaleString('vi-VN')}đ`;
    }

    function showStatAlert(text, colorClass = 'text-emerald-400') {
      const box = document.getElementById('statAlertBox');
      if (!box) return;
      box.textContent = text;
      box.className = `text-[11px] font-mono font-bold ${colorClass} opacity-100 transition-opacity duration-200 bg-black/85 px-2.5 py-1 rounded border border-slate-700`;
      setTimeout(() => box.classList.add('opacity-0'), 3000);
    }

    window.saveGame = function() {
      try { localStorage.setItem('thanh_xuan_jrpg_save', JSON.stringify(STATE)); } catch(e){}
    };
    window.manualSaveGame = function() {
      window.saveGame();
      audio.playSuccess();
      showStatAlert('💾 Đã lưu dữ liệu thành công!', 'text-emerald-400');
    };
    window.manualLoadGame = function() {
      try {
        const raw = localStorage.getItem('thanh_xuan_jrpg_save');
        if (raw) {
          Object.assign(STATE, JSON.parse(raw));
          audio.playSuccess();
          updateHUD();
          window.gotoLocation('class');
          showStatAlert('📂 Tải dữ liệu thành công!', 'text-sky-400');
        }
      } catch(e){}
    };
    window.exportSaveFile = function() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(STATE));
      const a = document.createElement('a');
      a.setAttribute("href", dataStr);
      a.setAttribute("download", `save_day${STATE.day}.json`);
      a.click();
    };
    window.importSaveFile = function(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          Object.assign(STATE, JSON.parse(e.target.result));
          window.saveGame();
          updateHUD();
          window.gotoLocation('class');
        } catch(err){}
      };
      reader.readAsText(file);
    };

    document.getElementById('btnSkipClass')?.addEventListener('click', () => {
      window.closeOverlayCard();
      modifyStats({ energy: +10, study: -4, reputation: -2 });
      audio.playTone(180, 'sawtooth', 0.2);
      advanceTime();
    });

    document.getElementById('btnAudioToggle')?.addEventListener('click', (e) => {
      audio.enabled = !audio.enabled;
      e.target.textContent = audio.enabled ? '🔊 ÂM THANH' : '🔇 TẮT ÂM';
    });

    // Khởi tạo
    window.manualLoadGame();
    window.gotoLocation('class');
    updateHUD();
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-1 sm:p-4 overflow-x-hidden">
      <div className="retro-console-frame bg-slate-900 border-4 border-slate-700 rounded-[32px] p-2.5 sm:p-5 w-full max-w-4xl flex flex-col relative shadow-2xl">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 border-b-2 border-slate-800 text-[10px] text-slate-400 font-pixel">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-amber-400">NINTENDO-BOY COLOR</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button onClick={() => window.manualSaveGame()} className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition">💾 LƯU</button>
            <button onClick={() => window.manualLoadGame()} className="px-2 py-0.5 bg-sky-700 hover:bg-sky-600 text-white rounded transition">📂 TẢI</button>
            <button onClick={() => window.exportSaveFile()} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition hidden sm:inline-block">📤 XUẤT</button>
            <label className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition cursor-pointer hidden sm:inline-block">
              📥 NHẬP
              <input type="file" accept=".json" className="hidden" onChange={(e) => window.importSaveFile(e)} />
            </label>
            <button id="btnAudioToggle" className="hover:text-amber-300 transition">🔊 ÂM THANH</button>
            <span id="saveStatus" className="text-slate-500 font-mono text-[9px]">SẴN SÀNG</span>
          </div>
        </div>

        {/* MAIN SCREEN BEZEL */}
        <div className="screen-bezel rounded-2xl p-2 sm:p-4 border-4 border-slate-800 flex flex-col flex-1 relative overflow-hidden min-h-[620px]">

          {/* TOP HUD */}
          <header className="bg-slate-950/90 pixel-box rounded-xl p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl" id="uiWeatherIcon">☀️</span>
              <div>
                <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <span id="uiDayOfWeek">THỨ HAI</span>
                  <span>-</span>
                  <span id="uiTimeText" className="font-mono text-emerald-400">07:30</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono">NGÀY <b id="uiDayCount">1</b>/45</span>
                </div>
                <div id="uiCurrentPeriodText" className="text-[10px] text-slate-400 font-medium">Buổi sáng • Tiết 1</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap font-mono text-[11px]">
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Sức Khỏe">
                <span>❤️</span><span id="statHp" className="text-rose-400 font-bold">85</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Năng Lượng">
                <span>⚡</span><span id="statEnergy" className="text-amber-400 font-bold">100</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Tâm Trạng">
                <span>😊</span><span id="statMood" className="text-yellow-400 font-bold">75</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Học Tập">
                <span>📚</span><span id="statStudy" className="text-sky-400 font-bold">50</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Tình Cảm Triệu Mẫn">
                <span>💕</span><span id="statLove" className="text-pink-400 font-bold">20%</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Kỹ Năng Sống">
                <span>🧠</span><span id="statSkill" className="text-violet-400 font-bold">25</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Tiền Tiêu Vặt">
                <span>💰</span><span id="statMoney" className="text-emerald-400 font-bold">150.000đ</span>
              </div>
            </div>
          </header>

          {/* MAIN STAGE */}
          <section id="stageContainer" className="flex-1 flex flex-col justify-between relative bg-gradient-to-b from-sky-950/70 via-slate-900 to-slate-950 pixel-box rounded-xl p-3 sm:p-4 overflow-hidden min-h-[380px]">
            
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-700/80 text-xs font-bold text-amber-300">
                <span id="locIcon">🏫</span>
                <span id="locTitle">TRƯỜNG THPT LÉ BIÊN</span>
              </div>
              <div id="statAlertBox" className="text-[11px] font-mono font-bold text-emerald-400 opacity-0 transition-opacity duration-300 bg-black/80 px-2.5 py-1 rounded border border-slate-700">
                +0 Chỉ số
              </div>
            </div>

            <div id="centerViewArea" className="flex-1 flex flex-col items-center justify-center relative my-2">
              
              {/* VIEW 1: SCENERY AVATARS */}
              <div id="sceneryAvatarGroup" className="flex flex-col items-center justify-center gap-2 text-center w-full">
                <div className="flex items-center justify-center gap-6 sm:gap-12 my-2">
                  <div className="text-center cursor-pointer floating-sprite" onClick={() => window.interactNPC('lan')}>
                    <div className="text-4xl sm:text-5xl drop-shadow">👧</div>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1 block">Lan (Bạn Thân)</span>
                  </div>
                  <div className="text-center cursor-pointer floating-sprite" style={{ animationDelay: '0.4s' }} onClick={() => window.interactNPC('crush')}>
                    <div className="text-4xl sm:text-5xl drop-shadow">✨👧</div>
                    <span id="crushNameBadge" className="text-[10px] font-bold text-pink-300 bg-slate-900/90 px-2 py-0.5 rounded border border-pink-700 mt-1 block">Triệu Mẫn 💕</span>
                  </div>
                  <div className="text-center cursor-pointer floating-sprite" style={{ animationDelay: '0.8s' }} onClick={() => window.interactNPC('tuan')}>
                    <div className="text-4xl sm:text-5xl drop-shadow">🏀</div>
                    <span className="text-[10px] font-bold text-sky-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1 block">Tuấn (Bóng Rổ)</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black px-6 py-1 rounded-lg border-2 border-amber-300 text-xs sm:text-sm tracking-widest shadow-lg">
                  LỚP 12A3 - KHỐI CHUYÊN
                </div>
                <p id="sceneNarrative" className="text-xs text-slate-300 max-w-md italic mt-1 px-4 leading-relaxed">
                  "Tự mình làm thêm, gom góp thi bằng lái xe và chứng chỉ để xây dựng cơ đồ!"
                </p>
              </div>

              {/* VIEW 2: CLASSROOM QUIZ */}
              <div id="classroomQuizCard" className="hidden w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-2xl p-4 shadow-2xl flex flex-col space-y-3 z-20">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span id="quizSubjectBadge" className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded border border-amber-500/40">TIẾT HỌC</span>
                  <span id="quizTeacherName" className="text-xs text-slate-400 font-mono">Thầy Cô</span>
                </div>
                <div className="flex gap-3 items-start">
                  <div id="quizTeacherAvatar" className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                    👨‍🏫
                  </div>
                  <div className="text-xs text-slate-200">
                    <p id="quizTeacherQuestion" className="font-semibold leading-relaxed">Đang tải câu hỏi...</p>
                  </div>
                </div>
                <div id="quizOptionsContainer" className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1"></div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>⚡ Tốn 15 Năng Lượng</span>
                  <button id="btnSkipClass" className="text-rose-400 hover:underline">Gục đầu ngủ (-5 Sức khỏe, +10 ⚡)</button>
                </div>
              </div>

              {/* VIEW 3: CANTEEN MENU */}
              <div id="canteenMenuCard" className="hidden w-full max-w-lg bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-black text-emerald-400 uppercase">🍜 CĂN TIN TRƯỜNG - CÔ NĂM</h3>
                  <button onClick={() => window.closeOverlayCard()} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
                </div>
                <div id="canteenItemsList" className="space-y-1.5 max-h-56 overflow-y-auto pr-1"></div>
              </div>

              {/* VIEW 4: JOBS MENU */}
              <div id="jobMenuCard" className="hidden w-full max-w-lg bg-slate-900 border-2 border-indigo-500 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-black text-indigo-400 uppercase">💼 VIỆC LÀM & NGHỀ NGHIỆP</h3>
                  <button onClick={() => window.closeOverlayCard()} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
                </div>
                <p className="text-[11px] text-slate-300">Nhiều công việc thu nhập cao đòi hỏi bạn phải có các Chứng chỉ chuyên ngành tương ứng!</p>
                <div id="jobItemsList" className="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
              </div>

              {/* VIEW 5: SHOP MUA SẮM NHÀ & XE */}
              <div id="propertyShopCard" className="hidden w-full max-w-lg bg-slate-900 border-2 border-amber-400 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-black text-amber-400 uppercase">🏙️ SÀN GIAO DỊCH NHÀ CỬA & SIÊU XE</h3>
                  <button onClick={() => window.closeOverlayCard()} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
                </div>
                <p className="text-[11px] text-slate-300">Tậu nhà xịn hồi phục thể lực, mua xe hơi sang chảnh để dạo phố cùng crush (Lưu ý: Mua ô tô cần có bằng lái B2)!</p>
                <div id="propertyShopList" className="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
              </div>

              {/* VIEW 6: THI CHỨNG CHỈ */}
              <div id="certExamCard" className="hidden w-full max-w-lg bg-slate-900 border-2 border-cyan-400 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-black text-cyan-400 uppercase">📜 TRUNG TÂM KHẢO THÍ CHỨNG CHỈ QUỐC GIA</h3>
                  <button onClick={() => window.closeOverlayCard()} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
                </div>
                <div id="certListContainer" className="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
                
                {/* EXAM QUESTION RUNNER */}
                <div id="certExamRunner" className="hidden bg-slate-950 p-3 rounded-xl border border-cyan-500/60 space-y-2">
                  <div className="flex justify-between text-[11px] text-cyan-300 font-mono">
                    <span id="certRunnerName">BÀI THI</span>
                    <span id="certRunnerProgress">Câu 1/3</span>
                  </div>
                  <p id="certRunnerQuestion" className="text-xs text-slate-100 font-semibold"></p>
                  <div id="certRunnerOptions" className="grid grid-cols-1 gap-1.5 pt-1"></div>
                </div>
              </div>

              {/* VIEW 7: DIALOGUE BRANCHING WITH CRUSH */}
              <div id="dialogueCard" className="hidden w-full max-w-md bg-slate-900 border-2 border-pink-400 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span id="dialogueSpeaker" className="text-pink-400 font-bold text-xs">Triệu Mẫn 💕</span>
                  <span id="dialogueAffinityTag" className="text-[10px] text-pink-300 bg-pink-950 px-2 py-0.5 rounded border border-pink-800 font-mono">Bạn cùng bàn</span>
                </div>
                <p id="dialogueSpeech" className="text-xs text-slate-200 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800"></p>
                <div id="dialogueChoices" className="space-y-1.5 pt-1"></div>
              </div>

              {/* VIEW 8: DIARY VIEW */}
              <div id="diaryModalCard" className="hidden w-full max-w-md bg-amber-50 border-4 border-amber-900/60 rounded-2xl p-4 shadow-2xl space-y-3 z-30 text-amber-950">
                <div className="flex items-center justify-between border-b-2 border-amber-300 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📓</span>
                    <div>
                      <h3 id="diaryTitle" className="font-extrabold text-sm uppercase">NHẬT KÝ — NGÀY 1</h3>
                      <span id="diaryDateSubtitle" className="text-[10px] text-amber-800">Những cột mốc trưởng thành</span>
                    </div>
                  </div>
                  <button onClick={() => window.closeOverlayCard()} className="text-amber-900 hover:text-red-600 font-black text-sm">✕</button>
                </div>
                <div id="diaryContentText" className="text-xs font-serif leading-relaxed space-y-2 italic bg-amber-100/60 p-3 rounded-xl border border-amber-200 min-h-[140px] max-h-56 overflow-y-auto"></div>
                <div className="text-[10px] text-amber-800 font-mono flex justify-between items-center pt-1 border-t border-amber-200">
                  <span id="diaryForecastNextDay">Ngày mai: Lịch học & kiếm tiền</span>
                  <button id="btnContinueFromDiary" className="px-3 py-1.5 bg-amber-800 text-amber-100 font-bold rounded-lg text-xs hover:bg-amber-900">
                    Thức dậy ngày mới ☀️
                  </button>
                </div>
              </div>

              {/* VIEW 9: ENDING SCREEN */}
              <div id="endingScreenCard" className="hidden w-full max-w-md bg-slate-900 border-4 border-yellow-400 rounded-2xl p-5 shadow-2xl text-center space-y-4 z-40">
                <div className="text-4xl animate-bounce">🎓</div>
                <div className="space-y-1">
                  <span className="text-[10px] font-pixel text-amber-400">LỄ TỐT NGHIỆP & TỔNG KẾT SỰ NGHIỆP</span>
                  <h2 id="endingTitle" className="text-lg font-black text-white">🏆 THỦ KHOA 12A3</h2>
                  <p id="endingSubtitle" className="text-xs text-yellow-300 font-semibold"></p>
                </div>
                <div id="endingDescription" className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 text-left"></div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-800/80 p-2.5 rounded-xl text-slate-300">
                  <div>Học tập: <b id="endStatStudy" className="text-sky-400">0</b></div>
                  <div>Tình cảm: <b id="endStatLove" className="text-pink-400">0%</b></div>
                  <div>Chứng chỉ: <b id="endStatCerts" className="text-cyan-400">0</b></div>
                  <div>Tài sản sở hữu: <b id="endStatAssets" className="text-emerald-400">0</b></div>
                </div>
                <button onClick={() => window.restartGame()} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition">
                  CHƠI LẠI VÁN MỚI 🌸
                </button>
              </div>

            </div>

            {/* QUICK LOCATION NAVIGATOR */}
            <nav className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800 text-[11px] font-bold z-10 flex-wrap">
              <button id="nav_class" onClick={() => window.gotoLocation('class')} className="loc-btn flex-1 py-1.5 px-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
                <span>🏫</span><span>Lớp Học</span>
              </button>
              <button id="nav_canteen" onClick={() => window.gotoLocation('canteen')} className="loc-btn flex-1 py-1.5 px-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
                <span>🍜</span><span>Căn Tin</span>
              </button>
              <button id="nav_job" onClick={() => window.gotoLocation('job')} className="loc-btn flex-1 py-1.5 px-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
                <span>💼</span><span>Làm Thêm</span>
              </button>
              <button id="nav_cert" onClick={() => window.openCertHub()} className="loc-btn flex-1 py-1.5 px-1 rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 hover:text-white transition flex items-center justify-center gap-1">
                <span>📜</span><span>Chứng Chỉ</span>
              </button>
              <button id="nav_prop" onClick={() => window.openPropertyShop()} className="loc-btn flex-1 py-1.5 px-1 rounded-lg bg-amber-950/70 border border-amber-700/60 text-amber-300 hover:text-white transition flex items-center justify-center gap-1">
                <span>🏎️</span><span>Nhà & Xe</span>
              </button>
              <button id="nav_home" onClick={() => window.gotoLocation('home')} className="loc-btn flex-1 py-1.5 px-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
                <span>🏠</span><span>Về Nhà</span>
              </button>
            </nav>
          </section>

          {/* JRPG CONTROLLER BAR */}
          <footer className="mt-3 bg-slate-950 pixel-box rounded-xl p-2 flex items-center justify-between gap-1 sm:gap-1.5">
            <button onClick={() => window.toggleTabAction('study')} className="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
              <span className="text-sm">📖</span><span>Học Tập</span>
            </button>
            <button onClick={() => window.toggleTabAction('profile')} className="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
              <span className="text-sm">🎖️</span><span>Bằng Cấp</span>
            </button>
            <button onClick={() => window.toggleTabAction('assets')} className="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
              <span className="text-sm">🏡</span><span>Tài Sản</span>
            </button>
            <button onClick={() => window.toggleTabAction('bag')} className="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
              <span className="text-sm">🎒</span><span>Túi Đồ</span>
            </button>
            <button onClick={() => window.openDiaryManual()} className="rpg-btn flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
              <span className="text-sm">📓</span><span>Nhật Ký</span>
            </button>
          </footer>

          {/* BOTTOM DRAWER POPUP */}
          <div id="actionDrawerPanel" className="hidden absolute bottom-16 left-3 right-3 bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 shadow-2xl z-30 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <h4 id="drawerTitle" className="text-xs font-black text-amber-300 uppercase">BẢNG ĐIỀU KHIỂN</h4>
              <button onClick={() => window.closeDrawer()} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <div id="drawerContent" className="space-y-2 text-xs"></div>
          </div>

        </div>

        {/* PHYSICAL CONSOLE CONTROLLER */}
        <div className="flex items-center justify-between px-3 sm:px-6 pt-3 text-[10px] text-slate-500 font-pixel">
          <div className="flex items-center gap-1">
            <button onClick={() => window.navigateDpad(-1)} className="w-7 h-7 rounded bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs hover:bg-slate-700 active:scale-90 text-amber-400 font-bold">◀</button>
            <button onClick={() => window.navigateDpad(1)} className="w-7 h-7 rounded bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs hover:bg-slate-700 active:scale-90 text-amber-400 font-bold">▶</button>
          </div>
          <div className="text-center">
            <span className="tracking-widest">THANH XUÂN RỰC RỠ • CAREER & ASSETS</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.quickSleep()} className="w-7 h-7 rounded-full bg-rose-700 border-2 border-rose-600 flex items-center justify-center text-[9px] text-white font-bold active:scale-90" title="Đi ngủ">B</button>
            <button onClick={() => window.openDiaryManual()} className="w-7 h-7 rounded-full bg-emerald-700 border-2 border-emerald-600 flex items-center justify-center text-[9px] text-white font-bold active:scale-90" title="Xem nhật ký">A</button>
          </div>
        </div>
      </div>
    </div>
  );
}
