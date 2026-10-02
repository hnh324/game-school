import React from 'react';

export default function App() {
  const gameHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanh Xuân Rực Rỡ: Học Sinh & Tiệm Order Học Đường 7.0</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Be Vietnam Pro', sans-serif; user-select: none; }
    .font-pixel { font-family: 'Press Start 2P', monospace; }
    .font-vt { font-family: 'VT323', monospace; }

    .retro-console-frame {
      box-shadow: 0 0 0 4px #0f172a, 0 0 0 8px #3b82f6, 0 25px 50px -12px rgba(59, 130, 246, 0.4);
      background: linear-gradient(145deg, #0f172a, #090d16);
    }
    .screen-bezel {
      background: radial-gradient(circle at center, #1e293b 0%, #030712 100%);
      box-shadow: inset 0 0 30px rgba(0,0,0,0.9), 0 0 15px rgba(59, 130, 246, 0.2);
    }
    .pixel-box {
      border: 2px solid #334155;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    .pixel-btn {
      border: 2px solid #475569;
      box-shadow: 0 4px 0 #0f172a;
      transition: all 0.08s ease;
    }
    .pixel-btn:hover { filter: brightness(1.1); }
    .pixel-btn:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 #0f172a;
    }

    .scanlines {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
      background-size: 100% 3px, 6px 100%;
      pointer-events: none;
    }

    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #090d16; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }

    @keyframes floatSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .floating-sprite { animation: floatSlow 2.5s ease-in-out infinite; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-2 sm:p-4 overflow-x-hidden relative">

  <canvas id="fireworksCanvas" class="fixed inset-0 pointer-events-none z-50 w-full h-full"></canvas>

  <div class="retro-console-frame border-4 rounded-[36px] p-3 sm:p-5 w-full max-w-4xl flex flex-col relative z-10">
    
    <!-- TOP CONSOLE HEADER -->
    <div class="flex items-center justify-between px-3 py-1.5 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-pixel">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
        <span class="text-sky-400">JRPG SCHOOL TYCOON 7.0 HARDCORE</span>
      </div>
      <div class="flex items-center gap-1.5 flex-wrap">
        <button onclick="openGiftShopModal()" class="hover:text-amber-300 transition text-[9px] bg-pink-900/60 border border-pink-600 px-2 py-0.5 rounded text-pink-200">🎁 TẶNG QUÀ</button>
        <button onclick="openCertModal()" class="hover:text-amber-300 transition text-[9px] bg-blue-900/60 border border-blue-600 px-2 py-0.5 rounded text-blue-200">🎓 CHỨNG CHỈ</button>
        <button onclick="openNameModal()" class="hover:text-amber-300 transition text-[9px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-amber-300">👤 ĐỔI TÊN</button>
        <button onclick="openAchievementsModal()" class="hover:text-amber-300 transition text-[9px] bg-purple-900/60 border border-purple-600 px-2 py-0.5 rounded text-purple-200">🏅 THÀNH TỰU</button>
        <button onclick="openCloudModal()" class="hover:text-amber-300 transition text-[9px] bg-indigo-900 border border-indigo-700 px-2 py-0.5 rounded text-indigo-200">☁️ CLOUD</button>
        <button id="btnAudioToggle" class="hover:text-amber-300 transition text-[9px] bg-slate-800 px-2 py-0.5 rounded">🔊 ÂM</button>
      </div>
    </div>

    <!-- MAIN SCREEN BEZEL -->
    <div class="screen-bezel rounded-2xl p-2 sm:p-4 border-2 border-slate-800/80 flex flex-col flex-1 relative overflow-hidden min-h-[620px]">
      <div class="scanlines absolute inset-0 z-40"></div>

      <!-- TOP HUD -->
      <header class="bg-slate-950/95 pixel-box rounded-xl p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs relative z-10">
        <div class="flex items-center gap-2.5">
          <span class="text-xl" id="uiWeatherIcon">☀️</span>
          <div>
            <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span id="uiPlayerNameText" class="text-sky-400 font-black">HỌC SINH</span>
              <span>•</span>
              <span id="uiDayOfWeek">THỨ HAI</span>
              <span>•</span>
              <span id="uiTimeText" class="font-mono text-emerald-400">07:30</span>
              <span class="text-[10px] px-1.5 py-0.5 bg-slate-800 text-sky-300 rounded font-semibold font-mono">NGÀY <b id="uiDayCount">1</b>/45</span>
            </div>
            <div class="flex items-center gap-2">
              <span id="uiCurrentPeriodText" class="text-[10px] text-slate-400 font-medium">Buổi sáng • Tiết 1-2</span>
              <span id="uiHolidayBadge" class="hidden text-[9px] px-1.5 bg-pink-900 text-pink-200 border border-pink-600 rounded font-bold">🌸 DỊP LỄ ĐẶC BIỆT</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap font-mono text-[11px]">
          <div class="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800" title="Sức Khỏe">
            <span>❤️</span><span id="statHp" class="text-rose-400 font-bold">85</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800" title="Năng Lượng">
            <span>⚡</span><span id="statEnergy" class="text-amber-400 font-bold">100</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800" title="Tâm Trạng">
            <span>😊</span><span id="statMood" class="text-yellow-400 font-bold">75</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800" title="Điểm Học Tập">
            <span>📚</span><span id="statStudy" class="text-sky-400 font-bold">50</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800" title="Tình Cảm Triệu Mẫn">
            <span>💕</span><span id="statLove" class="text-pink-400 font-bold">20%</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800" title="Tiền Tiết Kiệm">
            <span>💰</span><span id="statMoney" class="text-emerald-400 font-bold">30.000đ</span>
          </div>
        </div>
      </header>

      <!-- MAIN STAGE DISPLAY -->
      <section id="stageContainer" class="flex-1 flex flex-col justify-between relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pixel-box rounded-xl p-3 sm:p-4 overflow-hidden min-h-[390px]">
        
        <div class="flex items-center justify-between z-10">
          <div class="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-700/80 text-xs font-bold text-amber-300">
            <span id="locIcon">🏫</span>
            <span id="locTitle">LỚP 12A3 - KHỐI CHUYÊN</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="btnSkipSchool" onclick="triggerSkipSchoolAction()" class="hidden px-2 py-0.5 rounded text-[10px] font-bold bg-rose-900 border border-rose-500 text-rose-200 hover:bg-rose-800">
              🏃 Trốn Học Đi Chơi
            </button>
            <div id="businessStatusTag" class="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 border border-emerald-500 text-emerald-300">
              🟢 ĐƯỢC PHÉP BÁN HÀNG
            </div>
          </div>
          <div id="statAlertBox" class="text-[11px] font-mono font-bold text-emerald-400 opacity-0 transition-opacity duration-300 bg-black/80 px-2 py-0.5 rounded">
            +5 📚 Học tập
          </div>
        </div>

        <!-- DYNAMIC CANVAS -->
        <div id="centerViewArea" class="flex-1 flex flex-col items-center justify-center relative my-2 z-10">
          
          <!-- VIEW 1: SCENERY WITH AVATARS -->
          <div id="sceneryAvatarGroup" class="flex flex-col items-center justify-center gap-2 text-center w-full">
            <div class="flex items-center justify-center gap-6 sm:gap-12 my-2">
              <div class="text-center group cursor-pointer floating-sprite" onclick="interactNPC('lan')">
                <div class="text-4xl sm:text-5xl filter drop-shadow-[0_4px_8px_rgba(56,189,248,0.3)]">👧</div>
                <span class="text-[10px] font-bold text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1 block">Lan (Bạn Thân)</span>
              </div>
              <div class="text-center group cursor-pointer floating-sprite" style="animation-delay: 0.5s;" onclick="interactNPC('mẫn')">
                <div class="text-4xl sm:text-5xl filter drop-shadow-[0_4px_8px_rgba(244,114,182,0.4)]">👸</div>
                <span class="text-[10px] font-bold text-pink-300 bg-slate-900/90 px-2 py-0.5 rounded border border-pink-700 mt-1 block">Triệu Mẫn (Lớp Phó) 💕</span>
              </div>
              <div class="text-center group cursor-pointer floating-sprite" style="animation-delay: 1s;" onclick="interactNPC('tuan')">
                <div class="text-4xl sm:text-5xl filter drop-shadow-[0_4px_8px_rgba(251,191,36,0.3)]">🏀</div>
                <span class="text-[10px] font-bold text-sky-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1 block">Tuấn (Bóng Rổ)</span>
              </div>
            </div>

            <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black px-6 py-1.5 rounded-lg border border-indigo-400 text-xs sm:text-sm tracking-wide shadow-lg">
              SÁNG + RA CHƠI + SAU 17H: BÁN THEO ORDER • CÒN LẠI VỀ HỌC
            </div>
            <p id="sceneNarrative" class="text-xs text-slate-300 max-w-md italic mt-1 px-4 leading-relaxed">
              "Kinh tế cạnh tranh khốc liệt! Vừa gom vốn kinh doanh vừa phải thi lấy chứng chỉ quốc tế để sẵn sàng cho đại học!"
            </p>
          </div>

          <!-- VIEW 2: QUẦY ORDER & ĐÁNH GIÁ SAO / TIỀN TIP -->
          <div id="shopOrderCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-base">🛎</span>
                <div>
                  <h3 class="text-xs font-black text-emerald-400 uppercase">QUẦY ORDER & ĐÁNH GIÁ</h3>
                  <span class="text-[9px] text-amber-300 font-mono">Giao nhanh nhận 5⭐ + Tiền Tip cao!</span>
                </div>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            
            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-around text-[10px] text-slate-300 font-mono">
              <span id="stockBadgeBanhTrang">🌯 Bánh tráng: 0</span>
              <span id="stockBadgeTraSua">🧋 Trà sữa: 0</span>
              <span id="stockBadgeBut">🖊 Bút: 0</span>
              <span id="stockBadgeDeCuong">📑 Đề cương: 0</span>
            </div>

            <div id="orderListContainer" class="space-y-2 max-h-52 overflow-y-auto pr-1"></div>

            <div class="flex justify-between items-center pt-2 border-t border-slate-800">
              <button onclick="openWholesaleTab()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold">
                🚚 Chợ Sỉ Nhập Hàng
              </button>
              <button onclick="spawnCustomerOrder()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black">
                📢 Gọi Khách Mới (-8 ⚡)
              </button>
            </div>
          </div>

          <!-- VIEW 3: CỬA HÀNG QUÀ TẶNG TRIỆU MẪN & DỊP LỄ -->
          <div id="giftShopCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-pink-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-30">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">🎁</span>
                <div>
                  <h3 class="text-xs font-black text-pink-300 uppercase">TIỆM QUÀ LƯU NIỆM DÀNH CHO TRIỆU MẪN</h3>
                  <span class="text-[9px] text-amber-300">Tặng vào các dịp lễ sẽ bùng nổ tình cảm!</span>
                </div>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <div id="giftShopItemsList" class="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs"></div>
          </div>

          <!-- VIEW 4: TRUNG TÂM THI CHỨNG CHỈ (TOEIC, IELTS, MOS, KẾ TOÁN) -->
          <div id="certModalCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-blue-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-30">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">🎓</span>
                <div>
                  <h3 class="text-xs font-black text-blue-300 uppercase">TRUNG TÂM THI CHỨNG CHỈ QUỐC TẾ</h3>
                  <span class="text-[9px] text-slate-400">Đạt chứng chỉ để mở khóa hồ sơ đại học khủng</span>
                </div>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <div id="certListContainer" class="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs"></div>
          </div>

          <!-- VIEW 5: THÀNH TỰU SIÊU KHÓ (HARDCORE) -->
          <div id="achievementsModalCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-purple-500 rounded-2xl p-4 shadow-2xl space-y-3 z-40 text-slate-200">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">🏅</span>
                <div>
                  <h3 class="text-xs font-black text-purple-300 uppercase">DANH HIỆU & THÀNH TỰU KHỦNG</h3>
                  <span id="achieveSummary" class="text-[9px] text-slate-400">Đã mở: 0/8 danh hiệu</span>
                </div>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <div id="achievementsList" class="space-y-1.5 max-h-60 overflow-y-auto pr-1 text-xs"></div>
          </div>

          <!-- VIEW 6: ĐẶT TÊN CHO NGƯỜI CHƠI -->
          <div id="nameModalCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-sky-500 rounded-2xl p-4 shadow-2xl space-y-3 z-50 text-slate-200">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">✍️</span>
                <h3 class="text-xs font-black text-sky-300 uppercase">HỒ SƠ HỌC SINH MỚI</h3>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <p class="text-[11px] text-slate-300">
              Hãy nhập tên của bạn để thầy cô, bạn bè và Triệu Mẫn gọi tên nhé!
            </p>
            <div>
              <input type="text" id="playerNameInput" maxlength="16" placeholder="Nhập tên của bạn..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-amber-300 font-bold outline-none focus:border-sky-400" />
            </div>
            <button onclick="savePlayerName()" class="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 text-white font-black rounded-xl text-xs transition">
              XÁC NHẬN TÊN 🚀
            </button>
          </div>

          <!-- VIEW 7: HƯỚNG DẪN CÁCH CHƠI -->
          <div id="helpModalCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-2xl p-4 shadow-2xl space-y-3 z-50 text-slate-200">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">📖</span>
                <h3 class="text-xs font-black text-amber-300 uppercase">HƯỚNG DẪN THANH XUÂN 7.0</h3>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <div class="space-y-2 text-[11px] leading-relaxed max-h-64 overflow-y-auto pr-1">
              <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b class="text-amber-400">1. Luật Bán Hàng & Trốn Học Đi Chơi:</b>
                <p>• <b>Sáng, Ra Chơi & Sau 17:00</b>: Mở quầy nhận order kiếm vốn.</p>
                <p>• <b>Giờ học chính khóa</b>: Quầy đóng cửa. Bạn có thể chọn tự học chăm chỉ HOẶC bấm <b>"Trèo tường trốn học"</b> để giải trí xả stress (coi chừng bị giám thị bắt!).</p>
              </div>
              <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b class="text-blue-400">2. Trung Tâm Thi Chứng Chỉ:</b>
                <p>• Dành tiền đăng ký thi <b>MOS, TOEIC, IELTS, Kế Toán</b>. Càng nhiều bằng cấp càng dễ ẵm học bổng đại học quốc tế!</p>
              </div>
              <div class="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <b class="text-pink-400">3. Quà Tặng Dịp Lễ Cho Triệu Mẫn:</b>
                <p>• Mua quà lưu niệm (nhẫn cỏ, kẹp tóc, gấu bông). Canh đúng các dịp lễ (20/10, Giáng sinh, Valentine) để tặng Triệu Mẫn sẽ nhận x2 tình cảm!</p>
              </div>
            </div>
            <button onclick="closeOverlayCard()" class="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition">
              ĐÃ HIỂU, VÀO GAME NGAY! 🌸
            </button>
          </div>

          <!-- VIEW 8: CHỢ SỈ ĐẦU MỐI -->
          <div id="wholesaleCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-blue-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-base">🚚</span>
                <h3 class="text-xs font-black text-blue-400 uppercase">CHỢ SỈ ĐẦU MỐI (NHẬP HÀNG)</h3>
              </div>
              <button onclick="openShopOrderCard()" class="text-slate-400 hover:text-white text-xs">← Quay lại quầy order</button>
            </div>
            <div id="wholesaleListContainer" class="space-y-2 max-h-52 overflow-y-auto pr-1"></div>
          </div>

          <!-- VIEW 9: TIẾT HỌC TRÊN LỚP (100+ CÂU HỎI) -->
          <div id="classroomQuizCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-indigo-500/80 rounded-2xl p-4 shadow-2xl flex flex-col space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span id="quizSubjectBadge" class="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold text-[11px] rounded border border-indigo-500/40">TIẾT TOÁN HỌC</span>
              <span id="quizTeacherBadge" class="text-xs text-slate-400 font-mono">Thầy Minh</span>
            </div>
            <div class="flex gap-3 items-start">
              <div id="quizTeacherAvatar" class="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                👨‍🏫
              </div>
              <div class="text-xs text-slate-200">
                <p id="quizTeacherQuestion" class="font-semibold leading-relaxed">Câu hỏi...</p>
              </div>
            </div>
            <div id="quizOptionsContainer" class="grid grid-cols-2 gap-2 pt-1"></div>
            <div class="flex justify-between items-center text-[10px] text-slate-400 pt-1">
              <span>⚡ Tốn 15 Năng Lượng</span>
              <button id="btnSkipClass" class="text-rose-400 hover:underline">Gục đầu ngủ (-5 Sức khỏe, +10 ⚡)</button>
            </div>
          </div>

          <!-- VIEW 10: BẢNG XẾP HẠNG THI ĐUA -->
          <div id="leaderboardCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-yellow-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-30">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">🏆</span>
                <div>
                  <h3 class="text-xs font-black text-amber-300 uppercase">BẢNG XẾP HẠNG THI ĐUA LỚP 12A3</h3>
                  <span class="text-[10px] text-slate-400">Cập nhật theo tuần học tập & hạnh kiểm</span>
                </div>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <div id="leaderboardList" class="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs"></div>
            <p class="text-[10px] text-slate-400 text-center italic">Vươn lên Top 1 để làm Triệu Mẫn tự hào!</p>
          </div>

          <!-- VIEW 11: BÀI THI GIỮA KỲ / CUỐI KỲ -->
          <div id="examMinigameCard" class="hidden w-full max-w-md bg-slate-900 border-4 border-yellow-400 rounded-2xl p-4 shadow-2xl space-y-3 z-30">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl animate-bounce">📝</span>
                <div>
                  <h3 id="examModalTitle" class="font-black text-xs uppercase text-amber-300">KỲ THI GIỮA KỲ LỚP 12</h3>
                  <span id="examProgressText" class="text-[10px] text-slate-400 font-mono">CÂU 1 / 10 • THỜI GIAN ĐÃ ĐẾN!</span>
                </div>
              </div>
            </div>
            <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span id="examSubjectBadge" class="px-2 py-0.5 bg-sky-500/20 text-sky-300 font-bold text-[10px] rounded mb-1 inline-block">MÔN TOÁN</span>
              <p id="examQuestionText" class="font-bold text-slate-200 mt-1 leading-relaxed">Nội dung câu thi...</p>
            </div>
            <div id="examOptionsContainer" class="grid grid-cols-2 gap-2 pt-1"></div>
            <div class="flex justify-between items-center text-[10px] text-slate-400 pt-1">
              <span>Đang đúng: <b id="examCorrectCount" class="text-emerald-400 font-bold">0</b>/10</span>
              <span class="text-amber-400 font-mono">Ảnh hưởng trực tiếp đến Bảng Xếp Hạng!</span>
            </div>
          </div>

          <!-- VIEW 12: MODAL ĐỒNG BỘ CLOUD -->
          <div id="cloudModalCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-indigo-500 rounded-2xl p-4 shadow-2xl space-y-3 z-40">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">☁️</span>
                <h3 class="text-xs font-black text-indigo-300 uppercase">ĐỒNG BỘ DỮ LIỆU ĐA THIẾT BỊ</h3>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <p class="text-[11px] text-slate-300">
              Sao chép mã này để đem sang máy khác dán vào và tiếp tục chơi mà không mất file lưu!
            </p>
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase">Mã Lưu Game (Save Code):</label>
              <textarea id="cloudSaveCodeInput" class="w-full h-20 bg-slate-950 border border-slate-700 rounded-xl p-2 text-[10px] font-mono text-emerald-300 select-all"></textarea>
            </div>
            <div class="flex gap-2 pt-1">
              <button onclick="exportSaveCode()" class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold">
                📋 Xuất Mã Hiện Tại
              </button>
              <button onclick="importSaveCode()" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold">
                📥 Tải Lại Từ Mã Này
              </button>
            </div>
          </div>

          <!-- VIEW 13: CĂN TIN TRƯỜNG -->
          <div id="canteenMenuCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 class="text-xs font-black text-emerald-400 uppercase">🍜 CĂN TIN TRƯỜNG - CÔ NĂM</h3>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <p class="text-[11px] text-slate-300">Nạp lại Năng Lượng & Tâm Trạng, hoặc mua trà sữa đãi Triệu Mẫn!</p>
            <div id="canteenItemsList" class="space-y-2 max-h-48 overflow-y-auto pr-1"></div>
          </div>

          <!-- VIEW 14: DIARY VIEW -->
          <div id="diaryModalCard" class="hidden w-full max-w-md bg-amber-50 border-4 border-amber-900/60 rounded-2xl p-5 shadow-2xl space-y-3 z-30 text-amber-950">
            <div class="flex items-center justify-between border-b-2 border-amber-300 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📓</span>
                <div>
                  <h3 id="diaryTitle" class="font-extrabold text-sm uppercase tracking-wide">NHẬT KÝ — NGÀY 1</h3>
                  <span id="diaryDateSubtitle" class="text-[10px] text-amber-800">Cân bằng giữa Giảng Đường & Kinh Doanh</span>
                </div>
              </div>
              <button onclick="closeOverlayCard()" class="text-amber-900 hover:text-red-600 font-black text-sm">✕</button>
            </div>
            <div id="diaryContentText" class="text-xs font-serif leading-relaxed space-y-2 italic bg-amber-100/60 p-3 rounded-xl border border-amber-200 min-h-[140px] max-h-60 overflow-y-auto"></div>
            <div class="text-[10px] text-amber-800 font-mono flex justify-between items-center pt-1 border-t border-amber-200">
              <span id="diaryForecastNextDay">Lịch học ngày mai...</span>
              <button id="btnContinueFromDiary" class="px-3 py-1.5 bg-amber-800 text-amber-100 font-bold rounded-lg text-xs hover:bg-amber-900">
                Thức dậy ngày mới ☀️
              </button>
            </div>
          </div>

          <!-- VIEW 15: ENDING FINALE SCREEN -->
          <div id="endingScreenCard" class="hidden w-full max-w-md bg-slate-900 border-4 border-yellow-400 rounded-2xl p-5 shadow-2xl text-center space-y-4 z-40">
            <div class="text-4xl animate-bounce">🎓</div>
            <div class="space-y-1">
              <span class="text-[10px] font-pixel text-amber-400">LỄ TỐT NGHIỆP & CÔNG BỐ KẾT QUẢ ĐẠI HỌC</span>
              <h2 id="endingTitle" class="text-lg font-black text-white">🏆 THỦ KHOA ĐẠI HỌC</h2>
              <p id="endingSubtitle" class="text-xs text-yellow-300 font-semibold"></p>
            </div>
            <div id="endingDescription" class="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 text-left"></div>
            <div class="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-800/80 p-2.5 rounded-xl text-slate-300">
              <div>Điểm học tập: <b id="endStatStudy" class="text-sky-400">0</b></div>
              <div>Xếp hạng lớp: <b id="endStatRank" class="text-yellow-400">Top 1</b></div>
              <div>Tổng tài sản: <b id="endStatMoney" class="text-emerald-400">0đ</b></div>
              <div>Chứng chỉ đạt được: <b id="endStatCerts" class="text-blue-400">0</b></div>
            </div>
            <button onclick="restartGame()" class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition">
              CHƠI LẠI VÁN MỚI 🌸
            </button>
          </div>

        </div>

        <!-- QUICK LOCATION NAVIGATOR -->
        <nav class="flex items-center justify-between gap-1 pt-2 border-t border-slate-800 text-[11px] font-bold z-10 flex-wrap">
          <button onclick="gotoLocation('class')" class="loc-btn flex-1 py-1.5 px-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition flex items-center justify-center gap-1">
            <span>🏫</span><span>Lớp Học</span>
          </button>
          <button onclick="gotoLocation('canteen')" class="loc-btn flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>🍜</span><span>Căn Tin</span>
          </button>
          <button onclick="gotoLocation('library')" class="loc-btn flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>📚</span><span>Thư Viện</span>
          </button>
          <button onclick="gotoLocation('yard')" class="loc-btn flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>🌿</span><span>Sân Trường</span>
          </button>
          <button onclick="gotoLocation('home')" class="loc-btn flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>🏠</span><span>Về Nhà Học</span>
          </button>
        </nav>
      </section>

      <!-- BOTTOM BAR -->
      <footer class="mt-3 bg-slate-950 pixel-box rounded-xl p-2 flex items-center justify-between gap-1.5 relative z-10">
        <button id="btnFooterSell" onclick="openShopOrderCard()" class="rpg-btn flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">🛎️</span><span>Nhận Order</span>
        </button>
        <button onclick="openTabAction('study')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">📖</span><span>Học Tập</span>
        </button>
        <button onclick="openLeaderboard()" class="rpg-btn flex-1 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">🏆</span><span>Thi Đua</span>
        </button>
        <button onclick="openGiftShopModal()" class="rpg-btn flex-1 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">🎁</span><span>Tặng Mẫn</span>
        </button>
        <button onclick="openDiaryManual()" class="rpg-btn flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">📓</span><span>Nhật Ký</span>
        </button>
      </footer>

      <!-- ACTION DRAWER PANEL -->
      <div id="actionDrawerPanel" class="hidden absolute bottom-16 left-3 right-3 bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 shadow-2xl z-30 max-h-64 overflow-y-auto">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <h4 id="drawerTitle" class="text-xs font-black text-amber-300 uppercase">DANH SÁCH HOẠT ĐỘNG</h4>
          <button onclick="closeDrawer()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
        </div>
        <div id="drawerContent" class="space-y-2 text-xs"></div>
      </div>

    </div>

    <!-- CONSOLE BUTTONS -->
    <div class="flex items-center justify-between px-6 pt-3 text-[10px] text-slate-500 font-pixel">
      <div class="flex gap-2 items-center">
        <span class="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">▲</span>
        <span class="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">▼</span>
      </div>
      <div class="text-center">
        <span class="tracking-widest text-slate-400">CHINH PHỤC THI ĐẠI HỌC VÀ TRÁI TIM TRIỆU MẪN</span>
      </div>
      <div class="flex gap-3">
        <div class="w-7 h-7 rounded-full bg-rose-700 border border-rose-600 flex items-center justify-center text-[9px] text-white font-bold cursor-pointer" onclick="quickSleep()">B</div>
        <div class="w-7 h-7 rounded-full bg-emerald-700 border border-emerald-600 flex items-center justify-center text-[9px] text-white font-bold cursor-pointer" onclick="openDiaryManual()">A</div>
      </div>
    </div>
  </div>

  <script>
    function checkHoliday() {
      const hol = HOLIDAYS[STATE.day];
      const badge = document.getElementById('uiHolidayBadge');
      if (hol) {
        badge.classList.remove('hidden');
        badge.textContent = \`🌸 \${hol.name}\`;
      } else {
        badge.classList.add('hidden');
      }
    }

    function checkAchievements() {
      ACHIEVEMENTS_DEF.forEach(ach => {
        if (!STATE.unlockedAchievements.includes(ach.id)) {
          if (ach.check(STATE.stats)) {
            STATE.unlockedAchievements.push(ach.id);
            audio.playSuccess();
            triggerFireworks();
            showStatAlert(\`🏅 MỞ KHÓA THÀNH TỰU: \${ach.name}!\`, 'text-purple-400');
          }
        }
      });
    }

    function openAchievementsModal() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const card = document.getElementById('achievementsModalCard');
      card.classList.remove('hidden');

      document.getElementById('achieveSummary').textContent = \`Đã mở: \${STATE.unlockedAchievements.length}/\${ACHIEVEMENTS_DEF.length} danh hiệu\`;

      const list = document.getElementById('achievementsList');
      list.innerHTML = '';

      ACHIEVEMENTS_DEF.forEach(ach => {
        const isUnlocked = STATE.unlockedAchievements.includes(ach.id);
        const row = document.createElement('div');
        row.className = \`p-2.5 rounded-xl border flex items-center justify-between \${isUnlocked ? 'bg-purple-950/40 border-purple-600/70 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-slate-950 border-slate-800 opacity-60'}\`;
        row.innerHTML = \`
          <div class="flex items-center gap-2.5">
            <span class="text-2xl filter \${isUnlocked ? '' : 'grayscale'}">\${ach.icon}</span>
            <div>
              <div class="font-bold \${isUnlocked ? 'text-purple-300' : 'text-slate-400'}">\${ach.name}</div>
              <div class="text-[10px] text-slate-400">\${ach.desc}</div>
            </div>
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold \${isUnlocked ? 'bg-purple-900 text-purple-200' : 'bg-slate-800 text-slate-500'}">
            \${isUnlocked ? 'ĐÃ ĐẠT' : 'CHƯA ĐẠT'}
          </span>
        \`;
        list.appendChild(row);
      });
    }

    function openNameModal() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const card = document.getElementById('nameModalCard');
      card.classList.remove('hidden');
      document.getElementById('playerNameInput').value = STATE.playerName !== 'Bạn' ? STATE.playerName : '';
    }

    function savePlayerName() {
      const val = document.getElementById('playerNameInput').value.trim();
      if (val) {
        STATE.playerName = val;
        saveGame();
        showStatAlert(\`👤 Đã cập nhật tên: \${val}!\`, 'text-sky-400');
      }
      closeOverlayCard();
      updateHUD();
    }

    function openShopOrderCard() {
      closeOverlayCard();

      if (!isSellingAllowed()) {
        audio.playWrong();
        showStatAlert('⛔ Giờ học! Hãy tự học hoặc bấm "Trốn Học Đi Chơi".', 'text-rose-400');
        alert('⛔ QUY TẮC: Khung giờ này (' + TIME_PERIODS[STATE.timeIndex].text + ') quầy đóng cửa!\\nBạn chỉ được bán vào Buổi sáng (07:30), Ra chơi (09:15) và Chiều muộn (Sau 17:00).');
        return;
      }

      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const shopCard = document.getElementById('shopOrderCard');
      shopCard.classList.remove('hidden');

      renderOrders();
    }

    function renderOrders() {
      const getCount = (id) => {
        const item = STATE.inventory.find(i => i.id === id);
        return item ? item.count : 0;
      };
      document.getElementById('stockBadgeBanhTrang').textContent = \`🌯 Bánh tráng: \${getCount('banh_trang')}\`;
      document.getElementById('stockBadgeTraSua').textContent = \`🧋 Trà sữa: \${getCount('tra_sua_chai')}\`;
      document.getElementById('stockBadgeBut').textContent = \`🖊️ Bút: \${getCount('but_cute')}\`;
      document.getElementById('stockBadgeDeCuong').textContent = \`📑 Đề cương: \${getCount('de_cuong')}\`;

      const container = document.getElementById('orderListContainer');
      container.innerHTML = '';

      if (STATE.customerOrders.length === 0) {
        container.innerHTML = \`<div class="p-3 text-center text-slate-400 text-xs italic bg-slate-950 rounded-xl border border-slate-800">Không còn đơn order nào! Bấm nút "Gọi Khách Mới" bên dưới để đón khách.</div>\`;
        return;
      }

      STATE.customerOrders.forEach(ord => {
        const itemInfo = WHOLESALE_ITEMS.find(i => i.id === ord.itemId);
        const inStock = getCount(ord.itemId);
        const canFulfill = inStock >= ord.qty;
        const totalBase = itemInfo.retailPrice * ord.qty;
        const starStr = '⭐'.repeat(ord.stars || 5);

        const row = document.createElement('div');
        row.className = \`bg-slate-950 p-2.5 rounded-xl border \${canFulfill ? 'border-emerald-500/50' : 'border-rose-900/50'} flex items-center justify-between text-xs\`;
        row.innerHTML = \`
          <div class="flex items-center gap-2">
            <span class="text-2xl">\${ord.avatar}</span>
            <div>
              <div class="font-bold text-slate-200 flex items-center gap-1.5">
                <span>\${ord.customer}</span>
                <span class="text-[9px] text-amber-300 font-normal">\${starStr}</span>
              </div>
              <div class="text-[10px] text-slate-300 italic">"\${ord.dialogue}"</div>
              <div class="text-[10px] text-amber-400 font-mono mt-0.5">
                Order: <b>\${ord.qty}x \${itemInfo.name}</b> (\${totalBase.toLocaleString('vi-VN')}đ)
                <span class="text-emerald-300 font-bold ml-1">+Tip \${ord.tip.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <button onclick="fulfillOrder(\${ord.id})" class="px-2.5 py-1.5 \${canFulfill ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} rounded-lg text-[11px] transition">
              \${canFulfill ? 'Giao Đơn' : 'Thiếu Hàng'}
            </button>
          </div>
        \`;
        container.appendChild(row);
      });
    }

    function fulfillOrder(orderId) {
      const idx = STATE.customerOrders.findIndex(o => o.id === orderId);
      if (idx === -1) return;
      const ord = STATE.customerOrders[idx];
      const inv = STATE.inventory.find(i => i.id === ord.itemId);
      const itemInfo = WHOLESALE_ITEMS.find(i => i.id === ord.itemId);

      if (!inv || inv.count < ord.qty) {
        showStatAlert('Kho không đủ hàng! Vào "Chợ Sỉ Nhập Hàng" ngay.', 'text-rose-400');
        audio.playWrong();
        return;
      }

      inv.count -= ord.qty;
      const hasAccounting = STATE.certsEarned && STATE.certsEarned.includes('cert_accounting');
      const tipBonus = hasAccounting ? Math.round(ord.tip * 1.15) : ord.tip;
      const profit = (itemInfo.retailPrice * ord.qty) + tipBonus;
      const isCrush = ord.customer.includes('Triệu Mẫn');

      if (ord.itemId === 'banh_trang') {
        STATE.stats.totalBanhTrangSold = (STATE.stats.totalBanhTrangSold || 0) + ord.qty;
      }
      STATE.stats.totalTipsReceived = (STATE.stats.totalTipsReceived || 0) + tipBonus;

      modifyStats({
        money: +profit,
        mood: +5,
        energy: -5,
        rep: +4,
        love: isCrush ? +10 : 0
      });

      STATE.customerOrders.splice(idx, 1);
      audio.playCash();
      showStatAlert(\`⭐ Khách chấm 5 sao! +\${profit.toLocaleString('vi-VN')}đ (Tip: \${tipBonus.toLocaleString('vi-VN')}đ)\`, 'text-emerald-400');
      STATE.todayEvents.push(\`Giao đúng order \${ord.qty} \${itemInfo.name} cho \${ord.customer}, nhận đủ tiền hàng và tiền tip.\`);

      renderOrders();
      checkAchievements();
    }

    function spawnCustomerOrder() {
      if (!isSellingAllowed()) { showStatAlert('⛔ Hết giờ bán rồi!', 'text-rose-400'); return; }
      if (STATE.stats.energy < 8) { showStatAlert('⚡ Bạn quá mệt mỏi để tiếp khách!', 'text-amber-400'); audio.playWrong(); return; }

      const customers = [
        { name: 'Tuấn (Bóng Rổ)', avatar: '🏀', itemId: 'tra_sua_chai', qty: 2, dialogue: \`Ném xong ván bóng rổ khát khô họng, \${STATE.playerName} cho 2 chai trà sữa lẹ!\`, tip: 4000, stars: 5 },
        { name: 'Hoàng Nam', avatar: '🤓', itemId: 'de_cuong', qty: 1, dialogue: \`\${STATE.playerName} photo cho mình 1 bộ đề cương toán nhé, gửi thêm ít tiền!\`, tip: 5000, stars: 5 },
        { name: 'Bảo Trân', avatar: '✨', itemId: 'but_cute', qty: 2, dialogue: 'Bút viết êm tay ghê, giao nhanh mình gửi thêm tiền nước!', tip: 3000, stars: 5 },
        { name: 'Triệu Mẫn', avatar: '👸', itemId: 'banh_trang', qty: 1, dialogue: \`Bánh tráng bơ thơm nức cả lớp, \${STATE.playerName} để cho Mẫn một phần nhen!\`, tip: 8000, stars: 5 }
      ];

      const newCust = customers[Math.floor(Math.random() * customers.length)];
      const newOrder = {
        id: Date.now(),
        customer: newCust.name,
        avatar: newCust.avatar,
        itemId: newCust.itemId,
        qty: newCust.qty,
        dialogue: newCust.dialogue,
        tip: newCust.tip,
        stars: newCust.stars
      };

      STATE.customerOrders.push(newOrder);
      modifyStats({ energy: -8 });
      audio.playTone(600, 'triangle', 0.15);
      showStatAlert(\`🛎️ Có đơn order mới từ \${newCust.name} (Tip: \${newCust.tip.toLocaleString('vi-VN')}đ)!\`, 'text-sky-400');
      renderOrders();
    }

    function openWholesaleTab() {
      document.getElementById('shopOrderCard').classList.add('hidden');
      const wCard = document.getElementById('wholesaleCard');
      wCard.classList.remove('hidden');

      const container = document.getElementById('wholesaleListContainer');
      container.innerHTML = '';

      WHOLESALE_ITEMS.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs';
        div.innerHTML = \`
          <div class="flex items-center gap-2">
            <span class="text-xl">\${item.icon}</span>
            <div>
              <div class="font-bold text-slate-200">\${item.name}</div>
              <div class="text-[10px] text-slate-400">Giá sỉ: <b class="text-blue-400">\${item.wholesalePrice.toLocaleString('vi-VN')}đ</b> • Bán: \${item.retailPrice.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
          <button onclick="buyWholesaleStock('\${item.id}')" class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px]">
            Nhập 3 Cái
          </button>
        \`;
        container.appendChild(div);
      });
    }

    function buyWholesaleStock(itemId) {
      const item = WHOLESALE_ITEMS.find(i => i.id === itemId);
      const cost = item.wholesalePrice * 3;

      if (STATE.stats.money < cost) {
        showStatAlert('💸 Tiền không đủ để nhập gói sỉ này!', 'text-rose-400');
        audio.playWrong();
        return;
      }

      let inv = STATE.inventory.find(i => i.id === itemId);
      if (!inv) {
        inv = { id: itemId, count: 0 };
        STATE.inventory.push(inv);
      }
      inv.count += 3;

      modifyStats({ money: -cost });
      audio.playTone(550, 'triangle', 0.15);
      showStatAlert(\`📦 Đã nhập 3 phần \${item.name} (-\${cost.toLocaleString('vi-VN')}đ)\`, 'text-sky-400');
      STATE.todayEvents.push(\`Bỏ vốn \${cost.toLocaleString('vi-VN')}đ nhập thêm 3 phần \${item.name} để trả đơn order.\`);
    }

    function openHelpModal() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const card = document.getElementById('helpModalCard');
      card.classList.remove('hidden');
      audio.playTone(400, 'sine', 0.1);
    }

    function openCloudModal() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const card = document.getElementById('cloudModalCard');
      card.classList.remove('hidden');
      exportSaveCode();
    }

    function exportSaveCode() {
      try {
        const jsonStr = JSON.stringify(STATE);
        const code = btoa(unescape(encodeURIComponent(jsonStr)));
        document.getElementById('cloudSaveCodeInput').value = code;
        showStatAlert('📋 Đã xuất mã sao lưu thành công! Hãy copy mã này.', 'text-emerald-400');
      } catch (e) {
        alert('Không thể tạo mã lưu!');
      }
    }

    function importSaveCode() {
      const code = document.getElementById('cloudSaveCodeInput').value.trim();
      if (!code) {
        alert('Vui lòng dán mã lưu vào khung trước khi bấm tải!');
        return;
      }
      try {
        const jsonStr = decodeURIComponent(escape(atob(code)));
        const parsed = JSON.parse(jsonStr);
        if (parsed.stats && parsed.day) {
          Object.assign(STATE, parsed);
          saveGame();
          alert('🎉 Đồng bộ thành công dữ liệu từ máy khác! Tiến trình đã được khôi phục nguyên vẹn.');
          closeOverlayCard();
          updateHUD();
          checkAchievements();
        } else {
          alert('Mã lưu không hợp lệ!');
        }
      } catch (e) {
        alert('Mã lưu bị sai hoặc bị lỗi định dạng!');
      }
    }

    function startClassroomLesson() {
      if (STATE.stats.energy < 15) {
        showStatAlert('⚠️ Bạn quá kiệt sức! Hãy nghỉ ngơi hoặc ăn uống.', 'text-rose-400');
        audio.playWrong();
        return;
      }

      const q = QUIZ_DATABASE[Math.floor(Math.random() * QUIZ_DATABASE.length)];
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      
      const quizCard = document.getElementById('classroomQuizCard');
      quizCard.classList.remove('hidden');

      document.getElementById('quizSubjectBadge').textContent = q.subject;
      document.getElementById('quizTeacherBadge').textContent = q.teacher;
      document.getElementById('quizTeacherAvatar').textContent = q.avatar || '👨‍🏫';
      document.getElementById('quizTeacherQuestion').textContent = q.q;

      const optsBox = document.getElementById('quizOptionsContainer');
      optsBox.innerHTML = '';

      q.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-left text-xs font-semibold text-slate-200 transition active:scale-95 flex items-center gap-1.5';
        btn.innerHTML = \`<span class="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-amber-400 font-bold">\${String.fromCharCode(65 + idx)}</span> <span class="truncate">\${opt}</span>\`;
        btn.onclick = () => answerQuiz(q, idx);
        optsBox.appendChild(btn);
      });
    }

    function answerQuiz(q, selectedIdx) {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');

      if (selectedIdx === q.c) {
        modifyStats({ study: +10, mood: +5, energy: -15, rep: +2 });
        audio.playSuccess();
        showStatAlert(\`🎉 Đúng rồi! \${q.tip} (+10 📚, +5 😊)\`, 'text-emerald-400');
        STATE.todayEvents.push(\`\${STATE.playerName} trả lời xuất sắc câu hỏi \${q.subject} của \${q.teacher}, Triệu Mẫn khẽ gật đầu khen ngợi.\`);
      } else {
        modifyStats({ study: +3, mood: -5, energy: -15 });
        audio.playWrong();
        showStatAlert(\`😭 Sai rồi! Gợi ý: \${q.tip} (+3 📚, -5 😊)\`, 'text-rose-400');
        STATE.todayEvents.push(\`Lúng túng trước câu hỏi \${q.subject}, quyết tâm tối về cày đề thêm.\`);
      }
      advanceTime();
      checkAchievements();
    }

    document.getElementById('btnSkipClass')?.addEventListener('click', () => {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');
      modifyStats({ energy: +10, study: -5, hp: -2 });
      audio.playTone(180, 'sawtooth', 0.2);
      showStatAlert('😴 Ngủ gục trong giờ học! (+10 ⚡, -5 📚)', 'text-amber-400');
      STATE.todayEvents.push('Mệt quá gục đầu xuống bàn ngủ suốt tiết học, suýt bị lớp phó Triệu Mẫn ghi tên.');
      advanceTime();
    });

    function selfStudyAction(isNight = false) {
      if (STATE.stats.energy < 15) {
        showStatAlert('Bạn quá kiệt sức để học bài! Hãy ăn hoặc đi ngủ.', 'text-rose-400');
        audio.playWrong();
        return;
      }

      const gain = isNight ? 14 : 12;
      modifyStats({ study: +gain, energy: -18, mood: -3 });
      audio.playTone(520, 'sine', 0.15);
      showStatAlert(\`📚 Đã hoàn thành 1 đề ôn luyện! (+\${gain} 📚, -18 ⚡)\`, 'text-sky-400');
      
      if (isNight) {
        STATE.todayEvents.push(\`Buổi tối sau khi ăn cơm xong, \${STATE.playerName} ngồi vào bàn học cày đề đại học đến khuya.\`);
      } else {
        STATE.todayEvents.push('Buổi chiều không bán hàng, lên thư viện ngồi yên tĩnh đọc thêm tài liệu nâng cao.');
      }
      advanceTime();
      checkAchievements();
    }

    function openLeaderboard() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const card = document.getElementById('leaderboardCard');
      card.classList.remove('hidden');

      const students = [
        { name: 'Triệu Mẫn (Lớp Phó Học Tập)', baseScore: 92, avatar: '👸', title: 'Học bá toàn diện' },
        { name: \`\${STATE.playerName} (Bạn)\`, baseScore: STATE.stats.study, avatar: '😎', title: 'Vừa học vừa kinh doanh' },
        { name: 'Lan (Bạn Thân)', baseScore: 68, avatar: '👧', title: 'Chuyên gia hỗ trợ' },
        { name: 'Tuấn (Bóng Rổ)', baseScore: 55, avatar: '🏀', title: 'Ngôi sao thể thao' },
        { name: 'Hoàng Nam', baseScore: 84, avatar: '🤓', title: 'Cần cù bù thông minh' },
        { name: 'Bảo Trân', baseScore: 78, avatar: '✨', title: 'Cán sự văn thể' }
      ];

      students.sort((a, b) => b.baseScore - a.baseScore);

      const list = document.getElementById('leaderboardList');
      list.innerHTML = '';

      students.forEach((st, idx) => {
        const isPlayer = st.name.includes(STATE.playerName);
        const isCrush = st.name.includes('Triệu Mẫn');
        const badgeColor = idx === 0 ? 'bg-amber-500 text-slate-950 font-black' : (idx === 1 ? 'bg-slate-300 text-slate-950 font-bold' : (idx === 2 ? 'bg-amber-700 text-white font-bold' : 'bg-slate-800 text-slate-400 font-mono'));

        const row = document.createElement('div');
        row.className = \`p-2 rounded-xl flex items-center justify-between border \${isPlayer ? 'bg-sky-950/70 border-sky-500/80 shadow-[0_0_10px_rgba(56,189,248,0.2)]' : (isCrush ? 'bg-pink-950/40 border-pink-700/50' : 'bg-slate-950 border-slate-800')}\`;
        row.innerHTML = \`
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] \${badgeColor}">#\${idx + 1}</span>
            <span class="text-base">\${st.avatar}</span>
            <div>
              <div class="font-bold \${isPlayer ? 'text-sky-300' : (isCrush ? 'text-pink-300' : 'text-slate-200')}">\${st.name}</div>
              <div class="text-[10px] text-slate-400">\${st.title}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-mono font-bold text-amber-400 text-xs">\${st.baseScore} 📚</div>
            <div class="text-[9px] text-slate-500">Điểm thi đua</div>
          </div>
        \`;
        list.appendChild(row);
      });
    }

    function triggerExam(type) {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const examCard = document.getElementById('examMinigameCard');
      examCard.classList.remove('hidden');

      const shuffled = [...QUIZ_DATABASE].sort(() => 0.5 - Math.random());
      STATE.exam.type = type;
      STATE.exam.questions = shuffled.slice(0, 10);
      STATE.exam.currentStep = 0;
      STATE.exam.correctCount = 0;
      STATE.exam.inProgress = true;

      document.getElementById('examModalTitle').textContent = type === 'midterm' ? '📝 KỲ THI KHẢO SÁT GIỮA KỲ LỚP 12' : '🎓 KỲ THI TỐT NGHIỆP & ĐẠI HỌC QUỐC GIA';
      renderExamStep();
    }

    function renderExamStep() {
      const q = STATE.exam.questions[STATE.exam.currentStep];
      document.getElementById('examProgressText').textContent = \`CÂU \${STATE.exam.currentStep + 1} / 10 • \${STATE.exam.type === 'midterm' ? 'GIỮA KỲ' : 'TỐT NGHIỆP'}\`;
      document.getElementById('examSubjectBadge').textContent = q.subject;
      document.getElementById('examQuestionText').textContent = q.q;
      document.getElementById('examCorrectCount').textContent = STATE.exam.correctCount;

      const container = document.getElementById('examOptionsContainer');
      container.innerHTML = '';

      q.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-yellow-400 text-left text-xs font-semibold text-slate-200 transition active:scale-95 flex items-center gap-1.5';
        btn.innerHTML = \`<span class="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-yellow-400 font-bold">\${String.fromCharCode(65 + idx)}</span> <span class="truncate">\${opt}</span>\`;
        btn.onclick = () => answerExamQuestion(idx);
        container.appendChild(btn);
      });
    }

    function answerExamQuestion(idx) {
      const q = STATE.exam.questions[STATE.exam.currentStep];
      if (idx === q.c) {
        STATE.exam.correctCount++;
        audio.playSuccess();
      } else {
        audio.playWrong();
      }

      STATE.exam.currentStep++;
      if (STATE.exam.currentStep < 10) {
        renderExamStep();
      } else {
        document.getElementById('examMinigameCard').classList.add('hidden');
        if (STATE.exam.type === 'midterm') {
          STATE.stats.midtermScore = STATE.exam.correctCount;
          modifyStats({ study: STATE.exam.correctCount * 3, mood: +10 });
          if (STATE.exam.correctCount >= 8) triggerFireworks();
          alert(\`🎉 KẾT QUẢ GIỮA KỲ: Đúng \${STATE.exam.correctCount}/10 câu!\\nĐiểm thi đã được cộng vào chỉ số Học tập và Bảng Xếp Hạng Lớp 12A3!\`);
          STATE.todayEvents.push(\`Hoàn thành xuất sắc kỳ thi giữa kỳ với số điểm \${STATE.exam.correctCount}/10.\`);
          closeOverlayCard();
          checkAchievements();
        } else {
          STATE.stats.finalScore = STATE.exam.correctCount;
          checkAchievements();
          triggerGraduationEnding();
        }
      }
    }

    const CANTEEN_FOODS = [
      { name: 'Bánh Mì Kẹp Thịt Nóng Giòn', cost: 15000, energy: +30, mood: +10, hp: +5, icon: '🥖' },
      { name: 'Xôi Mặn Thập Cẩm Cô Năm', cost: 15000, energy: +35, mood: +12, hp: +5, icon: '🍙' },
      { name: 'Nước Mía Siêu Sạch', cost: 10000, energy: +20, mood: +15, hp: +5, icon: '🥤' },
      { name: 'Bao Triệu Mẫn Ăn Trưa Căn Tin', cost: 35000, energy: +15, mood: +30, love: +15, icon: '💕' }
    ];

    function openCanteenMenu() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const c = document.getElementById('canteenMenuCard');
      c.classList.remove('hidden');

      const list = document.getElementById('canteenItemsList');
      list.innerHTML = '';
      CANTEEN_FOODS.forEach(food => {
        const item = document.createElement('div');
        item.className = 'bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/50 transition';
        item.innerHTML = \`
          <div class="flex items-center gap-2">
            <span class="text-xl">\${food.icon}</span>
            <div>
              <div class="font-bold text-slate-200">\${food.name}</div>
              <div class="text-[10px] text-slate-400 font-mono">Giá: <span class="text-emerald-400">\${food.cost.toLocaleString('vi-VN')}đ</span></div>
            </div>
          </div>
          <button class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px]" onclick="buyFood('\${food.name}', \${food.cost}, \${food.energy}, \${food.mood}, \${food.love || 0})">
            Ăn Ngay
          </button>
        \`;
        list.appendChild(item);
      });
    }

    function buyFood(name, cost, eGain, mGain, loveGain) {
      if (STATE.stats.money < cost) { showStatAlert('💸 Tiền tiêu vặt không đủ!', 'text-rose-400'); audio.playWrong(); return; }
      modifyStats({ money: -cost, energy: eGain, mood: mGain, love: loveGain });
      audio.playCash();
      showStatAlert(\`😋 Đã ăn \${name}! (+\${eGain} ⚡, +\${mGain} 😊)\`, 'text-emerald-400');
      if (loveGain > 0) {
        STATE.todayEvents.push(\`Bao Triệu Mẫn ăn trưa tại căn tin, nhìn nụ cười duyên dáng của Mẫn mà lòng \${STATE.playerName} xao xuyến.\`);
      } else {
        STATE.todayEvents.push(\`Ghé căn tin làm một phần \${name} ngon lành nạp lại sức.\`);
      }
      advanceTime();
      checkAchievements();
    }

    function interactNPC(who) {
      audio.playTone(450, 'triangle', 0.1);
      if (who === 'mẫn') {
        if (STATE.stats.energy < 10) { showStatAlert('Bạn quá mệt để bắt chuyện với Triệu Mẫn!', 'text-amber-400'); return; }
        modifyStats({ energy: -10, mood: +15, love: +7, study: +3 });
        showStatAlert(\`💕 Triệu Mẫn: "\${STATE.playerName} ơi, nhớ giữ gìn sức khỏe để cùng thi đỗ nhé!" (+7 💕, +3 📚)\`, 'text-pink-400');
        STATE.todayEvents.push(\`Cùng Triệu Mẫn đứng trao đổi phương pháp giải đề Toán bên hành lang lớp học.\`);
        advanceTime();
        checkAchievements();
      } else if (who === 'lan') {
        modifyStats({ energy: -10, mood: +10, friends: +8, study: +4 });
        showStatAlert(\`👧 Lan: "\${STATE.playerName} ơi, tao mới tìm được quán ăn vặt ngon lắm!" (+8 👥, +4 📚)\`, 'text-sky-400');
        STATE.todayEvents.push(\`Ngồi trao đổi bài vở với nhỏ bạn thân Lan, hai đứa vừa học vừa tính chuyện buôn bán.\`);
        advanceTime();
      } else if (who === 'tuan') {
        modifyStats({ energy: -15, hp: +10, mood: +10, friends: +8 });
        showStatAlert(\`🏀 Tuấn: "Ê \${STATE.playerName}, làm ván bóng rổ nạp lại tinh thần nào!" (+10 ❤️, +10 😊)\`, 'text-amber-400');
        STATE.todayEvents.push('Ném bóng rổ cùng Tuấn xả stress sau các tiết học căng thẳng.');
        advanceTime();
      }
    }

    function modifyStats(changes) {
      if (changes.hp !== undefined) STATE.stats.hp = Math.max(0, Math.min(100, STATE.stats.hp + changes.hp));
      if (changes.energy !== undefined) STATE.stats.energy = Math.max(0, Math.min(100, STATE.stats.energy + changes.energy));
      if (changes.mood !== undefined) STATE.stats.mood = Math.max(0, Math.min(100, STATE.stats.mood + changes.mood));
      if (changes.study !== undefined) STATE.stats.study = Math.max(0, STATE.stats.study + changes.study);
      if (changes.friends !== undefined) STATE.stats.friends = Math.max(0, Math.min(100, STATE.stats.friends + changes.friends));
      if (changes.love !== undefined) STATE.stats.love = Math.max(0, Math.min(100, STATE.stats.love + changes.love));
      if (changes.rep !== undefined) STATE.stats.reputation = Math.max(0, Math.min(100, STATE.stats.reputation + changes.rep));
      if (changes.money !== undefined) STATE.stats.money = Math.max(0, STATE.stats.money + changes.money);
      updateHUD();
      saveGame();
    }

    function advanceTime() {
      STATE.timeIndex++;
      if (STATE.timeIndex >= TIME_PERIODS.length) {
        triggerEndOfDayDiary();
      } else {
        updateHUD();
      }
    }

    function quickSleep() {
      if (confirm('Bạn có muốn đi ngủ kết thúc ngày hôm nay để hồi phục toàn bộ năng lượng?')) {
        triggerEndOfDayDiary();
      }
    }

    function triggerEndOfDayDiary() {
      audio.playBell();
      closeOverlayCard();

      STATE.stats.energy = 100;
      STATE.stats.money += 15000;

      let diaryStory = [];
      diaryStory.push(\`Hôm nay là Ngày thứ \${STATE.day} lớp 12 của \${STATE.playerName}.\`);

      if (STATE.todayEvents.length > 0) {
        diaryStory.push(STATE.todayEvents.join(' '));
      } else {
        diaryStory.push('Một ngày học tập và sắp xếp buôn bán trôi qua trọn vẹn.');
      }

      if (STATE.stats.love >= 70) {
        diaryStory.push(\`Triệu Mẫn ngày càng chủ động tìm \${STATE.playerName} trò chuyện nhiều hơn. Lời thề ước cùng vào Đại Học Ngoại Thương không còn xa nữa! 💕\`);
      } else if (STATE.stats.study >= 85) {
        diaryStory.push('Điểm rèn luyện thi đua đang bám sát top đầu của lớp. Kỳ thi sắp tới nhất định sẽ bùng nổ! 📚');
      }

      const fullDiaryText = diaryStory.join('\\n\\n');
      STATE.diaryEntries.push({ day: STATE.day, text: fullDiaryText });
      STATE.todayEvents = [];

      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const diaryCard = document.getElementById('diaryModalCard');
      diaryCard.classList.remove('hidden');

      document.getElementById('diaryTitle').textContent = \`NHẬT KÝ — NGÀY \${STATE.day}\`;
      document.getElementById('diaryContentText').innerText = fullDiaryText;
      
      let forecast = \`Ngày \${STATE.day + 1}: Lịch học bình thường\`;
      if (STATE.day === 21) forecast = 'NGÀY MAI: KỲ THI GIỮA KỲ ĐANG CHỜ ĐÓN!';
      else if (STATE.day === 44) forecast = 'NGÀY MAI: KỲ THI TỐT NGHIỆP & ĐẠI HỌC QUỐC GIA!';
      else if (HOLIDAYS[STATE.day + 1]) forecast = \`NGÀY MAI: \${HOLIDAYS[STATE.day + 1].name.toUpperCase()} (TẶNG QUÀ x2 TÌNH CẢM!)\`;
      document.getElementById('diaryForecastNextDay').textContent = forecast;

      document.getElementById('btnContinueFromDiary').onclick = () => {
        closeOverlayCard();
        STATE.day++;
        STATE.timeIndex = 0;
        gotoLocation('class');
        checkHoliday();

        if (STATE.day === 22) {
          triggerExam('midterm');
        } else if (STATE.day >= STATE.totalDays) {
          triggerExam('final');
        }
      };
    }

    function openDiaryManual() {
      closeOverlayCard();
      const diaryCard = document.getElementById('diaryModalCard');
      diaryCard.classList.remove('hidden');
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');

      const latest = STATE.diaryEntries[STATE.diaryEntries.length - 1];
      document.getElementById('diaryTitle').textContent = \`NHẬT KÝ (NGÀY \${latest ? latest.day : STATE.day})\`;
      document.getElementById('diaryContentText').innerText = latest ? latest.text : 'Chưa có trang nhật ký nào. Hãy hoàn thành ngày học đầu tiên!';
      document.getElementById('btnContinueFromDiary').onclick = () => closeOverlayCard();
    }

    function triggerGraduationEnding() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const endCard = document.getElementById('endingScreenCard');
      endCard.classList.remove('hidden');
      audio.playSuccess();
      triggerFireworks();

      let title = '';
      let sub = '';
      let desc = '';

      const s = STATE.stats;
      const certCount = STATE.certsEarned ? STATE.certsEarned.length : 0;
      const totalScore = s.study + (s.finalScore * 10) + (certCount * 10);

      if (totalScore >= 180 && s.love >= 85) {
        title = '🏆 HUYỀN THOẠI THANH XUÂN: THỦ KHOA & HÔN ƯỚC TRĂM NĂM';
        sub = 'Tuyển thẳng viện đào tạo quốc tế & Lời thề ước cùng Triệu Mẫn';
        desc = \`Một cái kết rực rỡ vượt mọi mong đợi! \${STATE.playerName} không chỉ xuất sắc đạt danh hiệu Thủ khoa, sở hữu trọn bộ chứng chỉ quốc tế và khối tài sản kinh doanh đáng nể, mà còn trao chiếc nhẫn bạc cho Triệu Mẫn trong lễ bế giảng. Triệu Mẫn mỉm cười gật đầu, cả trường vỗ tay reo hò chúc phúc cho mối tình thanh xuân đẹp nhất!\`;
      } else if (totalScore >= 160) {
        title = '🎓 HỌC BÁ BẢNG VÀNG QUỐC TẾ';
        sub = 'Sở hữu bộ chứng chỉ khủng & đỗ trường đại học top 1';
        desc = \`Với sự nỗ lực phi thường cùng các chứng chỉ MOS, TOEIC, IELTS, \${STATE.playerName} xuất sắc nhận học bổng toàn phần từ trường đại học danh tiếng bậc nhất. Bạn là niềm kiêu hãnh của lớp 12A3!\`;
      } else if (s.money >= 1000000) {
        title = '💼 TẬP ĐOÀN KHỞI NGHIỆP TỪ GHẾ NHÀ TRƯỜNG';
        sub = 'Doanh nhân trẻ tuổi với khối tài sản triệu đồng';
        desc = \`Chiến lược buôn bán khôn ngoan cùng sự nhạy bén tài chính đã biến \${STATE.playerName} thành một ông trùm kinh doanh học đường tài ba ngay khi vừa nhận bằng tốt nghiệp!\`;
      } else {
        title = '🌸 KỶ NIỆM THANH XUÂN RỰC RỠ';
        sub = 'Những năm tháng áo trắng khó phai mờ';
        desc = \`Quãng đời học sinh khép lại với muôn vàn cảm xúc: từng gói bánh tráng giờ ra chơi, nụ cười của Triệu Mẫn và những buổi chiều ôn thi miệt mài sẽ mãi là ký ức đẹp nhất đời \${STATE.playerName}.\`;
      }

      document.getElementById('endingTitle').textContent = title;
      document.getElementById('endingSubtitle').textContent = sub;
      document.getElementById('endingDescription').textContent = desc;

      document.getElementById('endStatStudy').textContent = s.study;
      document.getElementById('endStatRank').textContent = totalScore >= 160 ? '#1 Toàn Khối' : '#2 Lớp 12A3';
      document.getElementById('endStatMoney').textContent = \`\${s.money.toLocaleString('vi-VN')}đ\`;
      document.getElementById('endStatCerts').textContent = \`\${certCount}/4 Bằng\`;
    }

    function restartGame() {
      localStorage.removeItem('thanh_xuan_business_save');
      location.reload();
    }

    function openTabAction(tab) {
      const drawer = document.getElementById('actionDrawerPanel');
      const title = document.getElementById('drawerTitle');
      const content = document.getElementById('drawerContent');
      drawer.classList.remove('hidden');

      if (tab === 'study') {
        title.textContent = '📖 HOẠT ĐỘNG HỌC TẬP & ÔN LUYỆN';
        content.innerHTML = \`
          <div class="space-y-2">
            <button onclick="startClassroomLesson()" class="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex justify-between items-center text-left">
              <span>✍️ Trả lời câu hỏi trên lớp (Toán, Lý, Hóa, Sinh, Văn, Sử, Địa, Anh)</span>
              <span class="text-amber-400 font-mono">-15 ⚡</span>
            </button>
            <button onclick="selfStudyAction(false)" class="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex justify-between items-center text-left">
              <span>📚 Tự học / Ôn đề ở thư viện (+12 📚)</span>
              <span class="text-sky-400 font-mono">-18 ⚡</span>
            </button>
            <button onclick="selfStudyAction(true)" class="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex justify-between items-center text-left">
              <span>🌙 Cày đề khuya tại phòng ngủ (+14 📚)</span>
              <span class="text-purple-400 font-mono">-18 ⚡</span>
            </button>
          </div>
        \`;
      }
    }

    function closeDrawer() {
      document.getElementById('actionDrawerPanel').classList.add('hidden');
    }

    function closeOverlayCard() {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('leaderboardCard').classList.add('hidden');
      document.getElementById('examMinigameCard').classList.add('hidden');
      document.getElementById('shopOrderCard').classList.add('hidden');
      document.getElementById('wholesaleCard').classList.add('hidden');
      document.getElementById('cloudModalCard').classList.add('hidden');
      document.getElementById('helpModalCard').classList.add('hidden');
      document.getElementById('nameModalCard').classList.add('hidden');
      document.getElementById('giftShopCard').classList.add('hidden');
      document.getElementById('certModalCard').classList.add('hidden');
      document.getElementById('achievementsModalCard').classList.add('hidden');
      document.getElementById('canteenMenuCard').classList.add('hidden');
      document.getElementById('diaryModalCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');
      closeDrawer();
    }

    function updateHUD() {
      const curPeriod = TIME_PERIODS[STATE.timeIndex] || TIME_PERIODS[0];
      const dayOfWeekIdx = (STATE.day - 1) % 7;

      document.getElementById('uiPlayerNameText').textContent = STATE.playerName.toUpperCase();
      document.getElementById('uiDayOfWeek').textContent = DAYS_OF_WEEK[dayOfWeekIdx];
      document.getElementById('uiTimeText').textContent = curPeriod.text;
      document.getElementById('uiCurrentPeriodText').textContent = curPeriod.name;
      document.getElementById('uiDayCount').textContent = STATE.day;

      document.getElementById('statHp').textContent = STATE.stats.hp;
      document.getElementById('statEnergy').textContent = STATE.stats.energy;
      document.getElementById('statMood').textContent = STATE.stats.mood;
      document.getElementById('statStudy').textContent = STATE.stats.study;
      document.getElementById('statLove').textContent = \`\${STATE.stats.love}%\`;
      document.getElementById('statMoney').textContent = \`\${STATE.stats.money.toLocaleString('vi-VN')}đ\`;

      const statusTag = document.getElementById('businessStatusTag');
      const btnSell = document.getElementById('btnFooterSell');
      const btnSkip = document.getElementById('btnSkipSchool');

      if (curPeriod.canSell) {
        statusTag.textContent = '🟢 ĐƯỢC PHÉP BÁN HÀNG';
        statusTag.className = 'text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 border border-emerald-500 text-emerald-300';
        btnSell.className = 'rpg-btn flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1';
        btnSkip.classList.add('hidden');
      } else {
        statusTag.textContent = '🔒 GIỜ HỌC / ĐÓNG CỬA HÀNG';
        statusTag.className = 'text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-rose-950 border border-rose-600 text-rose-300';
        btnSell.className = 'rpg-btn flex-1 py-2 rounded-lg bg-slate-800 text-slate-500 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1 opacity-70';
        btnSkip.classList.remove('hidden');
      }
    }

    function showStatAlert(text, colorClass = 'text-emerald-400') {
      const box = document.getElementById('statAlertBox');
      box.textContent = text;
      box.className = \`text-[11px] font-mono font-bold \${colorClass} opacity-100 transition-opacity duration-200 bg-black/80 px-2.5 py-1 rounded border border-slate-700\`;
      setTimeout(() => {
        box.classList.remove('opacity-100');
        box.classList.add('opacity-0');
      }, 3000);
    }

    function saveGame() {
      try {
        localStorage.setItem('thanh_xuan_business_save', JSON.stringify(STATE));
      } catch (e) {}
    }

    function loadGame() {
      try {
        const raw = localStorage.getItem('thanh_xuan_business_save');
        if (raw) {
          const parsed = JSON.parse(raw);
          Object.assign(STATE, parsed);
        }
      } catch (e) {}
    }

    document.getElementById('btnAudioToggle')?.addEventListener('click', (e) => {
      audio.enabled = !audio.enabled;
      e.target.textContent = audio.enabled ? '🔊 BẬT ÂM' : '🔇 TẮT ÂM';
    });

    window.addEventListener('DOMContentLoaded', () => {
      loadGame();
      gotoLocation('class');
      updateHUD();
      checkHoliday();
      checkAchievements();
      
      if (STATE.playerName === 'Bạn') {
        openNameModal();
      } else {
        openHelpModal();
      }
    });
  </script>
</body>
</html>`;

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        title="Thanh Xuân Rực Rỡ: Học Sinh & Tiệm Order Học Đường"
        srcDoc={gameHtml}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
