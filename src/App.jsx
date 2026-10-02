<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanh Xuân Rực Rỡ: Nhật Ký Cấp 3 - Deluxe Edition</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Be Vietnam Pro', sans-serif; user-select: none; }
    .font-pixel { font-family: 'Press Start 2P', monospace; }
    .font-vt { font-family: 'VT323', monospace; }

    .retro-console-frame {
      box-shadow: 0 0 0 4px #1e293b, 0 0 0 8px #334155, 0 20px 40px -5px rgba(0, 0, 0, 0.85);
    }
    .screen-bezel {
      background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
      box-shadow: inset 0 0 25px rgba(0,0,0,0.9);
    }
    .pixel-box {
      border: 3px solid #334155;
      box-shadow: 3px 3px 0px #090d16;
    }
    .pixel-btn {
      border: 2px solid #475569;
      box-shadow: 2px 2px 0px #090d16;
      transition: all 0.08s ease;
    }
    .pixel-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 0px 0px 0px #090d16;
    }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }

    @keyframes floatSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .floating-sprite { animation: floatSlow 2.5s ease-in-out infinite; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-1 sm:p-4 overflow-x-hidden">

  <div class="retro-console-frame bg-slate-900 border-4 border-slate-700 rounded-[32px] p-2.5 sm:p-5 w-full max-w-4xl flex flex-col relative shadow-2xl">
    
    <!-- CONSOLE TOP BRANDING & QUICK ACTIONS -->
    <div class="flex items-center justify-between px-3 py-1.5 mb-2 border-b-2 border-slate-800 text-[10px] text-slate-400 font-pixel">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-amber-400">NINTENDO-BOY COLOR</span>
      </div>
      <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <button onclick="manualSaveGame()" class="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition">💾 LƯU</button>
        <button onclick="manualLoadGame()" class="px-2 py-0.5 bg-sky-700 hover:bg-sky-600 text-white rounded transition">📂 TẢI</button>
        <button onclick="exportSaveFile()" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition hidden sm:inline-block">📤 XUẤT</button>
        <label class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition cursor-pointer hidden sm:inline-block">
          📥 NHẬP
          <input type="file" accept=".json" class="hidden" onchange="importSaveFile(event)">
        </label>
        <button id="btnAudioToggle" class="hover:text-amber-300 transition">🔊 ÂM THANH</button>
        <span id="saveStatus" class="text-slate-500 font-mono text-[9px]">SẴN SÀNG</span>
      </div>
    </div>

    <!-- MAIN SCREEN BEZEL -->
    <div class="screen-bezel rounded-2xl p-2 sm:p-4 border-4 border-slate-800 flex flex-col flex-1 relative overflow-hidden min-h-[620px]">

      <!-- TOP HUD -->
      <header class="bg-slate-950/90 pixel-box rounded-xl p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-xl" id="uiWeatherIcon">☀️</span>
          <div>
            <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span id="uiDayOfWeek">THỨ HAI</span>
              <span>-</span>
              <span id="uiTimeText" class="font-mono text-emerald-400">07:30</span>
              <span class="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono">NGÀY <b id="uiDayCount">1</b>/45</span>
            </div>
            <div id="uiCurrentPeriodText" class="text-[10px] text-slate-400 font-medium">Buổi sáng • Tiết 1</div>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-2.5 flex-wrap font-mono text-[11px]">
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Sức Khỏe">
            <span>❤️</span><span id="statHp" class="text-rose-400 font-bold">85</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Năng Lượng">
            <span>⚡</span><span id="statEnergy" class="text-amber-400 font-bold">100</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Tâm Trạng">
            <span>😊</span><span id="statMood" class="text-yellow-400 font-bold">75</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Học Tập">
            <span>📚</span><span id="statStudy" class="text-sky-400 font-bold">50</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Tình Cảm Triệu Mẫn">
            <span>💕</span><span id="statLove" class="text-pink-400 font-bold">20%</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Kỹ Năng Sống">
            <span>🧠</span><span id="statSkill" class="text-violet-400 font-bold">25</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Tiền Tiêu Vặt">
            <span>💰</span><span id="statMoney" class="text-emerald-400 font-bold">50.000đ</span>
          </div>
        </div>
      </header>

      <!-- MAIN STAGE -->
      <section id="stageContainer" class="flex-1 flex flex-col justify-between relative bg-gradient-to-b from-sky-950/70 via-slate-900 to-slate-950 pixel-box rounded-xl p-3 sm:p-4 overflow-hidden min-h-[380px]">
        
        <div class="flex items-center justify-between z-10">
          <div class="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-700/80 text-xs font-bold text-amber-300">
            <span id="locIcon">🏫</span>
            <span id="locTitle">TRƯỜNG THPT LÉ BIÊN</span>
          </div>
          <div id="statAlertBox" class="text-[11px] font-mono font-bold text-emerald-400 opacity-0 transition-opacity duration-300 bg-black/80 px-2.5 py-1 rounded border border-slate-700">
            +0 Chỉ số
          </div>
        </div>

        <div id="centerViewArea" class="flex-1 flex flex-col items-center justify-center relative my-2">
          
          <!-- VIEW 1: SCENERY AVATARS -->
          <div id="sceneryAvatarGroup" class="flex flex-col items-center justify-center gap-2 text-center w-full">
            <div class="flex items-center justify-center gap-6 sm:gap-12 my-2">
              <div class="text-center cursor-pointer floating-sprite" onclick="interactNPC('lan')">
                <div class="text-4xl sm:text-5xl drop-shadow">👧</div>
                <span class="text-[10px] font-bold text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1 block">Lan (Bạn Thân)</span>
              </div>
              <div class="text-center cursor-pointer floating-sprite" style="animation-delay: 0.4s;" onclick="interactNPC('crush')">
                <div class="text-4xl sm:text-5xl drop-shadow">✨👧</div>
                <span id="crushNameBadge" class="text-[10px] font-bold text-pink-300 bg-slate-900/90 px-2 py-0.5 rounded border border-pink-700 mt-1 block">Triệu Mẫn 💕</span>
              </div>
              <div class="text-center cursor-pointer floating-sprite" style="animation-delay: 0.8s;" onclick="interactNPC('tuan')">
                <div class="text-4xl sm:text-5xl drop-shadow">🏀</div>
                <span class="text-[10px] font-bold text-sky-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1 block">Tuấn (Bóng Rổ)</span>
              </div>
            </div>

            <div class="bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black px-6 py-1 rounded-lg border-2 border-amber-300 text-xs sm:text-sm tracking-widest shadow-lg">
              LỚP 12A3 - KHỐI CHUYÊN
            </div>
            <p id="sceneNarrative" class="text-xs text-slate-300 max-w-md italic mt-1 px-4 leading-relaxed">
              "Bố mẹ bán con trâu nuôi con bò. Hôm nay bạn sẽ dành thời gian học bài hay lén trêu Triệu Mẫn?"
            </p>
          </div>

          <!-- VIEW 2: CLASSROOM QUIZ -->
          <div id="classroomQuizCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-amber-400 rounded-2xl p-4 shadow-2xl flex flex-col space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span id="quizSubjectBadge" class="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded border border-amber-500/40">TIẾT HỌC</span>
              <span id="quizTeacherName" class="text-xs text-slate-400 font-mono">Thầy Cô</span>
            </div>
            <div class="flex gap-3 items-start">
              <div id="quizTeacherAvatar" class="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                👨‍🏫
              </div>
              <div class="text-xs text-slate-200">
                <p id="quizTeacherQuestion" class="font-semibold leading-relaxed">Đang tải câu hỏi...</p>
              </div>
            </div>
            <div id="quizOptionsContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1"></div>
            <div class="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <span>⚡ Tốn 15 Năng Lượng</span>
              <button id="btnSkipClass" class="text-rose-400 hover:underline">Gục đầu ngủ (-5 Sức khỏe, +10 ⚡)</button>
            </div>
          </div>

          <!-- VIEW 3: CANTEEN MENU -->
          <div id="canteenMenuCard" class="hidden w-full max-w-lg bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 class="text-xs font-black text-emerald-400 uppercase">🍜 CĂN TIN TRƯỜNG - CÔ NĂM (20+ MÓN HỌC ĐƯỜNG)</h3>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <p class="text-[11px] text-slate-300">Nạp lại Năng Lượng & Tâm Trạng, hoặc mua phần đặc biệt bao Triệu Mẫn để tăng mạnh tình cảm!</p>
            <div id="canteenItemsList" class="space-y-1.5 max-h-56 overflow-y-auto pr-1"></div>
          </div>

          <!-- VIEW 4: PART-TIME JOBS MENU -->
          <div id="jobMenuCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-indigo-500 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 class="text-xs font-black text-indigo-400 uppercase">💼 VIỆC LÀM THÊM HỌC SINH</h3>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <p class="text-[11px] text-slate-300">Kiếm thêm tiền tiêu vặt mua trà sữa cho crush hoặc mua sách luyện thi, nhưng coi chừng kiệt sức nhé!</p>
            <div id="jobItemsList" class="space-y-2 max-h-56 overflow-y-auto pr-1"></div>
          </div>

          <!-- VIEW 5: DIALOGUE BRANCHING WITH CRUSH -->
          <div id="dialogueCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-pink-400 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span id="dialogueSpeaker" class="text-pink-400 font-bold text-xs">Triệu Mẫn 💕</span>
              <span id="dialogueAffinityTag" class="text-[10px] text-pink-300 bg-pink-950 px-2 py-0.5 rounded border border-pink-800 font-mono">Bạn cùng bàn</span>
            </div>
            <p id="dialogueSpeech" class="text-xs text-slate-200 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800"></p>
            <div id="dialogueChoices" class="space-y-1.5 pt-1"></div>
          </div>

          <!-- VIEW 6: BOSS FIGHT (KỲ THI HỌC KỲ) -->
          <div id="bossFightCard" class="hidden w-full max-w-md bg-slate-950 border-4 border-red-500 rounded-2xl p-4 shadow-2xl space-y-3 z-30">
            <div class="flex items-center justify-between border-b border-red-800 pb-2">
              <span class="text-red-400 font-bold text-xs uppercase animate-pulse">🔥 KỲ THI KHẢO SÁT CHẤT LƯỢNG</span>
              <span id="bossTimer" class="text-amber-400 font-mono font-bold text-sm bg-red-950 px-2 py-0.5 rounded border border-red-700">⏱️ 15s</span>
            </div>
            <div class="flex justify-between text-[11px] text-slate-300">
              <span>Đề thi cấp tốc: Câu <b id="bossQuestionIndex" class="text-amber-300">1/3</b></span>
              <span>Số câu đúng: <b id="bossScoreText" class="text-emerald-400">0</b></span>
            </div>
            <p id="bossQuestionText" class="text-xs font-semibold text-slate-100 min-h-[40px]"></p>
            <div id="bossOptionsContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-2"></div>
          </div>

          <!-- VIEW 7: DIARY VIEW -->
          <div id="diaryModalCard" class="hidden w-full max-w-md bg-amber-50 border-4 border-amber-900/60 rounded-2xl p-4 shadow-2xl space-y-3 z-30 text-amber-950">
            <div class="flex items-center justify-between border-b-2 border-amber-300 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📓</span>
                <div>
                  <h3 id="diaryTitle" class="font-extrabold text-sm uppercase">NHẬT KÝ — NGÀY 1</h3>
                  <span id="diaryDateSubtitle" class="text-[10px] text-amber-800">Những xúc cảm tuổi 17</span>
                </div>
              </div>
              <button onclick="closeOverlayCard()" class="text-amber-900 hover:text-red-600 font-black text-sm">✕</button>
            </div>
            <div id="diaryContentText" class="text-xs font-serif leading-relaxed space-y-2 italic bg-amber-100/60 p-3 rounded-xl border border-amber-200 min-h-[140px] max-h-56 overflow-y-auto"></div>
            <div class="text-[10px] text-amber-800 font-mono flex justify-between items-center pt-1 border-t border-amber-200">
              <span id="diaryForecastNextDay">Ngày mai: Lịch học bình thường</span>
              <button id="btnContinueFromDiary" class="px-3 py-1.5 bg-amber-800 text-amber-100 font-bold rounded-lg text-xs hover:bg-amber-900">
                Thức dậy ngày mới ☀️
              </button>
            </div>
          </div>

          <!-- VIEW 8: ENDING SCREEN -->
          <div id="endingScreenCard" class="hidden w-full max-w-md bg-slate-900 border-4 border-yellow-400 rounded-2xl p-5 shadow-2xl text-center space-y-4 z-40">
            <div class="text-4xl animate-bounce">🎓</div>
            <div class="space-y-1">
              <span class="text-[10px] font-pixel text-amber-400">LỄ TỐT NGHIỆP THPT THANH XUÂN</span>
              <h2 id="endingTitle" class="text-lg font-black text-white">🏆 THỦ KHOA 12A3</h2>
              <p id="endingSubtitle" class="text-xs text-yellow-300 font-semibold"></p>
            </div>
            <div id="endingDescription" class="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 text-left"></div>
            <div class="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-800/80 p-2.5 rounded-xl text-slate-300">
              <div>Tổng điểm học tập: <b id="endStatStudy" class="text-sky-400">0</b></div>
              <div>Tình cảm Triệu Mẫn: <b id="endStatLove" class="text-pink-400">0%</b></div>
              <div>Số bạn bè thân thiết: <b id="endStatFriends" class="text-amber-400">0</b></div>
              <div>Tài sản tích lũy: <b id="endStatMoney" class="text-emerald-400">0đ</b></div>
            </div>
            <button onclick="restartGame()" class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition">
              CHƠI LẠI THANH XUÂN MỚI 🌸
            </button>
          </div>

        </div>

        <!-- QUICK LOCATION NAVIGATOR (6 ĐỊA ĐIỂM) -->
        <nav class="flex items-center justify-between gap-1 pt-2 border-t border-slate-800 text-[11px] font-bold z-10 flex-wrap">
          <button id="nav_class" onclick="gotoLocation('class')" class="loc-btn flex-1 py-1.5 px-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>🏫</span><span>Lớp Học</span>
          </button>
          <button id="nav_canteen" onclick="gotoLocation('canteen')" class="loc-btn flex-1 py-1.5 px-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>🍜</span><span>Căn Tin</span>
          </button>
          <button id="nav_library" onclick="gotoLocation('library')" class="loc-btn flex-1 py-1.5 px-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>📚</span><span>Thư Viện</span>
          </button>
          <button id="nav_yard" onclick="gotoLocation('yard')" class="loc-btn flex-1 py-1.5 px-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>🌿</span><span>Sân Trường</span>
          </button>
          <button id="nav_job" onclick="gotoLocation('job')" class="loc-btn flex-1 py-1.5 px-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>💼</span><span>Làm Thêm</span>
          </button>
          <button id="nav_home" onclick="gotoLocation('home')" class="loc-btn flex-1 py-1.5 px-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1">
            <span>🏠</span><span>Về Nhà</span>
          </button>
        </nav>
      </section>

      <!-- BOTTOM JRPG CONTROLLER BAR -->
      <footer class="mt-3 bg-slate-950 pixel-box rounded-xl p-2 flex items-center justify-between gap-1 sm:gap-1.5">
        <button onclick="toggleTabAction('study')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">📖</span><span>Học Tập</span>
        </button>
        <button onclick="toggleTabAction('friends')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">👥</span><span>Bạn Bè</span>
        </button>
        <button onclick="toggleTabAction('chat')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">💬</span><span>Tin Nhắn</span>
        </button>
        <button onclick="toggleTabAction('bag')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">🎒</span><span>Túi Đồ</span>
        </button>
        <button onclick="openDiaryManual()" class="rpg-btn flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">📓</span><span>Nhật Ký</span>
        </button>
      </footer>

      <!-- BOTTOM DRAWER POPUP -->
      <div id="actionDrawerPanel" class="hidden absolute bottom-16 left-3 right-3 bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 shadow-2xl z-30 max-h-64 overflow-y-auto">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <h4 id="drawerTitle" class="text-xs font-black text-amber-300 uppercase">BẢNG ĐIỀU KHIỂN</h4>
          <button onclick="closeDrawer()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
        </div>
        <div id="drawerContent" class="space-y-2 text-xs"></div>
      </div>

    </div>

    <!-- CONSOLE PHYSICAL BUTTONS & D-PAD -->
    <div class="flex items-center justify-between px-3 sm:px-6 pt-3 text-[10px] text-slate-500 font-pixel">
      <!-- D-PAD VIRTUAL -->
      <div class="flex items-center gap-1">
        <button onclick="navigateDpad(-1)" class="w-7 h-7 rounded bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs hover:bg-slate-700 active:scale-90 text-amber-400 font-bold" title="Lùi địa điểm">◀</button>
        <button onclick="navigateDpad(1)" class="w-7 h-7 rounded bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs hover:bg-slate-700 active:scale-90 text-amber-400 font-bold" title="Tiến địa điểm">▶</button>
      </div>
      <div class="text-center">
        <span class="tracking-widest">THANH XUÂN RỰC RỠ • CẤP 3</span>
      </div>
      <!-- ACTION BUTTONS -->
      <div class="flex gap-2">
        <button onclick="quickSleep()" class="w-7 h-7 rounded-full bg-rose-700 border-2 border-rose-600 flex items-center justify-center text-[9px] text-white font-bold active:scale-90" title="Đi ngủ">B</button>
        <button onclick="openDiaryManual()" class="w-7 h-7 rounded-full bg-emerald-700 border-2 border-emerald-600 flex items-center justify-center text-[9px] text-white font-bold active:scale-90" title="Xem nhật ký">A</button>
      </div>
    </div>
  </div>

  <script>
    /* =============================================================
       1. SYNTHESIZER 8-BIT AUDIO ENGINE
       ============================================================= */
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

    /* =============================================================
       2. NGÂN HÀNG CÂU HỎI MỞ RỘNG (60+ CÂU THEO MÔN & THẦY CÔ)
       ============================================================= */
    const TEACHERS = {
      toan: { name: 'Thầy Minh', avatar: '👨‍🏫', subject: 'TOÁN HỌC' },
      van: { name: 'Cô Thảo', avatar: '👩‍🏫', subject: 'NGỮ VĂN' },
      ly: { name: 'Thầy Tuấn', avatar: '👨‍🔬', subject: 'VẬT LÝ' },
      hoa: { name: 'Cô Hương', avatar: '👩‍🔬', subject: 'HÓA HỌC' },
      sinh: { name: 'Thầy Đức', avatar: '🧑‍🌾', subject: 'SINH HỌC' },
      su: { name: 'Thầy Hùng', avatar: '👨‍🦳', subject: 'LỊCH SỬ' },
      dia: { name: 'Cô Mai', avatar: '👩‍💼', subject: 'ĐỊA LÝ' },
      anh: { name: 'Cô Jennifer', avatar: '👱‍♀️', subject: 'TIẾNG ANH' },
      gdcd: { name: 'Thầy Nam', avatar: '👨‍⚖️', subject: 'GDCD' },
      meo: { name: 'Bác Bảo Vệ & Lớp Trưởng', avatar: '🥸', subject: 'ĐỐ MẸO HỌC TRÒ' }
    };

    const QUIZ_BANK = [
      // TOÁN (21 câu)
      { id: 'm1', subKey: 'toan', q: 'Cho hàm số y = ax² + bx + c (a ≠ 0). Tọa độ hoành độ đỉnh Parabol là gì?', opts: ['-b / 2a', 'b / 2a', '-Δ / 4a', '-b / a'], c: 0, rOk: 'Thầy Minh mỉm cười gật đầu: "Tốt lắm, kiến thức cơ bản phải nắm chắc như thế!"', rFail: 'Thầy Minh thở dài: "Nhầm dấu cơ bản rồi em ơi, xem lại trục đối xứng ngay!"' },
      { id: 'm2', subKey: 'toan', q: 'Tập nghiệm của bất phương trình log₂(x) < 3 là?', opts: ['(0; 8)', '(-∞; 8)', '(0; 9)', '[0; 8)'], c: 0, rOk: 'Thầy Minh: "Chuẩn xác! Em không hề quên điều kiện xác định x > 0."', rFail: 'Thầy Minh: "Quên điều kiện xác định x > 0 rồi, cẩn thận kẻo bị bẫy đề thi!"' },
      { id: 'm3', subKey: 'toan', q: 'Đạo hàm của hàm số y = e^(2x) là?', opts: ['2e^(2x)', 'e^(2x)', '2xe^(2x)', 'e^(2x) / 2'], c: 0, rOk: 'Thầy Minh: "Xuất sắc, đạo hàm hàm hợp chuẩn chỉ!"', rFail: 'Thầy Minh: "Đạo hàm e^u bằng u\' nhân e^u cơ mà!"' },
      { id: 'm4', subKey: 'toan', q: 'Nguyên hàm của hàm số f(x) = cos(x) là?', opts: ['sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C'], c: 0, rOk: 'Thầy Minh vỗ tay tán thưởng sự nhanh nhạy của bạn.', rFail: 'Thầy Minh: "Nhầm giữa đạo hàm và nguyên hàm của hàm lượng giác rồi!"' },
      { id: 'm5', subKey: 'toan', q: 'Một hộp có 5 bi xanh và 4 bi đỏ. Số cách chọn 2 viên bi tùy ý là?', opts: ['C(9, 2) = 36', 'A(9, 2) = 72', '20', '18'], c: 0, rOk: 'Thầy Minh: "Đúng rồi! Chọn không quan tâm thứ tự thì dùng tổ hợp C."', rFail: 'Thầy Minh: "Phân biệt lại giữa chỉnh hợp A và tổ hợp C nhé!"' },
      { id: 'm6', subKey: 'toan', q: 'Số mặt phẳng đối xứng của hình lập phương là bao nhiêu?', opts: ['9', '6', '8', '12'], c: 0, rOk: 'Thầy Minh: "Rất chuẩn! 3 mặt song song các đáy và 6 mặt chéo."', rFail: 'Thầy Minh: "Vẽ lại hình hộp lập phương và đếm cẩn thận lại nào."' },
      { id: 'm7', subKey: 'toan', q: 'Tiệm cận ngang của đồ thị hàm số y = (2x - 1) / (x + 3) là đường thẳng nào?', opts: ['y = 2', 'x = -3', 'y = -1/3', 'x = 2'], c: 0, rOk: 'Thầy Minh gật gù hài lòng.', rFail: 'Thầy Minh: "y = 2 là tiệm cận ngang, còn x = -3 là tiệm cận đứng!"' },
      { id: 'm8', subKey: 'toan', q: 'Giá trị cực đại của hàm số y = -x³ + 3x trên R là?', opts: ['2 (tại x = 1)', '-2 (tại x = -1)', '0', '3'], c: 0, rOk: 'Thầy Minh: "Tính đạo hàm và lập bảng biến thiên rất chuẩn."', rFail: 'Thầy Minh: "Cần phân biệt giá trị cực đại y_CĐ với điểm cực đại x_CĐ."' },
      { id: 'm9', subKey: 'toan', q: 'Nếu f(x) = x³ - 3x² + 2 thì f\'(x) bằng?', opts: ['3x² - 6x', '3x² - 3x', 'x² - 6x', '3x - 6'], c: 0, rOk: 'Thầy Minh: "Chính xác! Nhớ đạo hàm x³ là 3x² và -3x² là -6x."', rFail: 'Thầy Minh: "Cẩn thận hệ số khi đạo hàm từng hạng tử nhé!"' },
      { id: 'm10', subKey: 'toan', q: 'Phương trình 2ˣ = 8 có nghiệm x bằng?', opts: ['3', '2', '4', '8'], c: 0, rOk: 'Thầy Minh: "Quá cơ bản và chính xác! 8 = 2³."', rFail: 'Thầy Minh: "Đưa 8 về lũy thừa cơ số 2: 8 = 2³ nhé!"' },
      { id: 'm11', subKey: 'toan', q: 'Giá trị của log₃(27) bằng?', opts: ['3', '9', '27', '4'], c: 0, rOk: 'Thầy Minh: "Đúng rồi! 3³ = 27 nên log₃27 = 3."', rFail: 'Thầy Minh: "Nhớ định nghĩa log: 3 mũ mấy bằng 27?"' },
      { id: 'm12', subKey: 'toan', q: 'Diện tích hình tròn bán kính R được tính theo công thức nào?', opts: ['πR²', '2πR', 'πR', '2πR²'], c: 0, rOk: 'Thầy Minh: "Chuẩn! Đừng nhầm diện tích với chu vi nhé."', rFail: 'Thầy Minh: "2πR là chu vi, còn diện tích hình tròn là πR²."' },
      { id: 'm13', subKey: 'toan', q: 'Một cấp số cộng có số hạng đầu u₁ = 3 và công sai d = 2. Số hạng thứ 5 bằng?', opts: ['11', '10', '12', '13'], c: 0, rOk: 'Thầy Minh: "Chính xác! u₅ = u₁ + 4d = 11."', rFail: 'Thầy Minh: "Dùng công thức uₙ = u₁ + (n - 1)d nhé!"' },
      { id: 'm14', subKey: 'toan', q: 'Một cấp số nhân có u₁ = 2 và công bội q = 3. Số hạng thứ 4 bằng?', opts: ['54', '18', '27', '81'], c: 0, rOk: 'Thầy Minh: "Rất tốt! u₄ = 2 × 3³ = 54."', rFail: 'Thầy Minh: "Nhớ số mũ là n - 1 nhé: u₄ = 2 × 3³."' },
      { id: 'm15', subKey: 'toan', q: 'Nếu hai vectơ a và b vuông góc thì tích vô hướng a · b bằng?', opts: ['0', '1', '-1', '|a||b|'], c: 0, rOk: 'Thầy Minh: "Chính xác! Hai vectơ vuông góc thì tích vô hướng bằng 0."', rFail: 'Thầy Minh: "Công thức a·b = |a||b|cosα, mà α = 90° nên kết quả bằng 0."' },
      { id: 'm16', subKey: 'toan', q: 'Phương trình đường thẳng đi qua điểm O(0;0) và có hệ số góc 2 là?', opts: ['y = 2x', 'y = x + 2', 'y = 2x + 1', 'x = 2y'], c: 0, rOk: 'Thầy Minh: "Chuẩn! Đường thẳng qua O có dạng y = ax."', rFail: 'Thầy Minh: "Qua O nên hệ số tự do phải bằng 0 nhé!"' },
      { id: 'm17', subKey: 'toan', q: 'Một hình hộp chữ nhật có chiều dài 3 cm, rộng 4 cm và cao 5 cm. Thể tích bằng?', opts: ['60 cm³', '12 cm³', '47 cm³', '120 cm³'], c: 0, rOk: 'Thầy Minh: "Nhanh và chính xác! V = 3 × 4 × 5 = 60 cm³."', rFail: 'Thầy Minh: "Thể tích hình hộp chữ nhật = dài × rộng × cao."' },
      { id: 'm18', subKey: 'toan', q: 'Xác suất để gieo một con xúc xắc cân đối được mặt số chẵn là?', opts: ['1/2', '1/3', '1/6', '2/3'], c: 0, rOk: 'Thầy Minh: "Đúng! Có 3 kết quả thuận lợi 2, 4, 6 trên tổng 6 kết quả."', rFail: 'Thầy Minh: "Có 3 mặt chẵn trong 6 mặt: 2, 4, 6."' },
      { id: 'm19', subKey: 'toan', q: 'Giá trị của √49 + √16 bằng?', opts: ['11', '9', '65', '7'], c: 0, rOk: 'Thầy Minh: "Quá dễ! 7 + 4 = 11."', rFail: 'Thầy Minh: "Tính từng căn: √49 = 7 và √16 = 4 nhé!"' },
      { id: 'm20', subKey: 'toan', q: 'Nếu x² = 25 thì x có thể nhận những giá trị nào?', opts: ['x = 5 hoặc x = -5', 'x = 5', 'x = -5', 'x = 25'], c: 0, rOk: 'Thầy Minh: "Chính xác! Đừng quên nghiệm âm khi giải phương trình x² = 25."', rFail: 'Thầy Minh: "Bình phương của cả 5 và -5 đều bằng 25 nhé!"' },
      { id: 'm21', subKey: 'toan', q: 'Tổng ba góc trong một tam giác bằng bao nhiêu độ?', opts: ['180°', '90°', '360°', '270°'], c: 0, rOk: 'Thầy Minh: "Kiến thức hình học nền tảng, rất tốt!"', rFail: 'Thầy Minh: "Ba góc trong mọi tam giác luôn có tổng bằng 180°."' },
      
        // NGỮ VĂN (20 câu)
      { id: 'v1', subKey: 'van', q: 'Ai là tác giả của tùy bút nổi tiếng "Người lái đò Sông Đà"?', opts: ['Nguyễn Tuân', 'Tô Hoài', 'Hoàng Phủ Ngọc Tường', 'Kim Lân'], c: 0, rOk: 'Cô Thảo ánh mắt trìu mến: "Rất đúng, phong cách tài hoa và uyên bác của Nguyễn Tuân."', rFail: 'Cô Thảo khẽ nhắc: "Chất tài hoa, ngông nghênh này chỉ có thể là cụ Nguyễn Tuân thôi."' },
      { id: 'v2', subKey: 'van', q: 'Tác phẩm "Vợ Chồng A Phủ" của Tô Hoài lấy bối cảnh vùng đất nào?', opts: ['Tây Bắc (Hồng Ngài)', 'Việt Bắc', 'Tây Nguyên', 'Đồng bằng Bắc Bộ'], c: 0, rOk: 'Cô Thảo: "Chính xác, đêm tình mùa xuân ở Hồng Ngài miền Tây Bắc."', rFail: 'Cô Thảo: "Nhớ nhầm sang vùng đất khác rồi em nhé."' },
      { id: 'v3', subKey: 'van', q: 'Hình tượng con sóng trong bài thơ "Sóng" của Xuân Quỳnh tượng trưng cho điều gì?', opts: ['Tình yêu và tâm hồn người phụ nữ', 'Sức mạnh bão táp thiên nhiên', 'Nỗi đau chiến tranh', 'Sự chia ly vĩnh hằng'], c: 0, rOk: 'Cô Thảo khen ngợi: "Cảm nhận chất thơ rất sâu sắc."', rFail: 'Cô Thảo: "Sóng chính là sự phân thân của cái tôi người phụ nữ khi yêu."' },
      { id: 'v4', subKey: 'van', q: 'Chi tiết "nồi cháo cám" xuất hiện trong tác phẩm văn học nào?', opts: ['Vợ Nhặt (Kim Lân)', 'Chí Phèo (Nam Cao)', 'Chiếc Thuyền Ngoài Xa', 'Lão Hạc'], c: 0, rOk: 'Cô Thảo: "Chính xác, bữa cơm ngày đói đượm tình mẫu tử của bà cụ Tứ."', rFail: 'Cô Thảo: "Đó là bữa ăn nghẹn ngào nhưng ấm áp trong truyện Vợ Nhặt."' },
      { id: 'v5', subKey: 'van', q: 'Trong bài thơ "Tây Tiến", địa danh nào gắn liền với hình ảnh "heo hút cồn mây súng ngửi trời"?', opts: ['Mường Lát', 'Sài Khao', 'Mai Châu', 'Châu Mộc'], c: 1, rOk: 'Cô Thảo gật đầu: "Sài Khao sương lấp đoàn quân mỏi, câu thơ tuyệt đẹp!"', rFail: 'Cô Thảo nhắc nhở: "Đó là địa danh Sài Khao hiểm trở nơi địa đầu biên giới."' },
      { id: 'v6', subKey: 'van', q: 'Nghệ thuật tương phản giữa bức ảnh nghệ thuật chiếc thuyền và cảnh bạo lực gia đình ở đâu?', opts: ['Chiếc Thuyền Ngoài Xa (Nguyễn Minh Châu)', 'Rừng Xà Nu', 'Mảnh Trăng Cuối Rừng', 'Những Đứa Con Trong Gia Đình'], c: 0, rOk: 'Cô Thảo: "Cái nhìn đa diện, sâu sắc của nhà văn Nguyễn Minh Châu thời kỳ đổi mới."', rFail: 'Cô Thảo: "Đó là nghịch lý cuộc đời trong Chiếc Thuyền Ngoài Xa."' },
      { id: 'v7', subKey: 'van', q: 'Câu thơ "Đất Nước là nơi em đánh rơi chiếc khăn trong nỗi nhớ thầm" thuộc trường ca nào?', opts: ['Mặt Đường Khát Vọng (Nguyễn Khoa Điềm)', 'Trường Ca Đất Nước', 'Bài Thơ Về Tiểu Đội Xe Không Kính', 'Ánh Trăng'], c: 0, rOk: 'Cô Thảo: "Rất lãng mạn và đúng đắn."', rFail: 'Cô Thảo: "Đoạn trích Đất Nước thuộc trường ca Mặt Đường Khát Vọng năm 1971."' },
      { id: 'v8', subKey: 'van', q: 'Nhân vật Tnú trong truyện ngắn "Rừng Xà Nu" của ai sáng tác?', opts: ['Nguyễn Trung Thành', 'Anh Đức', 'Lê Minh Khuê', 'Nguyễn Thi'], c: 0, rOk: 'Cô Thảo: "Nhà văn gắn bó máu thịt với mảnh đất Tây Nguyên kiên cường."', rFail: 'Cô Thảo: "Nguyễn Trung Thành (Nguyên Ngọc) chính là tác giả."' },
      { id: 'v9', subKey: 'van', q: 'Tác phẩm "Chí Phèo" được sáng tác bởi nhà văn nào?', opts: ['Nam Cao', 'Ngô Tất Tố', 'Vũ Trọng Phụng', 'Kim Lân'], c: 0, rOk: 'Cô Thảo: "Chính xác! Nam Cao đã xây dựng một Chí Phèo đầy bi kịch của người nông dân bị tha hóa."', rFail: 'Cô Thảo: "Chí Phèo là tác phẩm tiêu biểu của Nam Cao em nhé!"' },
      { id: 'v10', subKey: 'van', q: 'Nhân vật chính trong truyện ngắn "Vợ Nhặt" của Kim Lân là ai?', opts: ['Tràng', 'A Phủ', 'Mị', 'Tnú'], c: 0, rOk: 'Cô Thảo: "Đúng rồi! Tràng là người 'nhặt' được vợ giữa nạn đói."', rFail: 'Cô Thảo: "Nhân vật trung tâm của Vợ Nhặt là anh Tràng nhé!"' }
      { id: 'v11', subKey: 'van', q: 'Bài thơ "Đất Nước" của Nguyễn Khoa Điềm được viết theo thể thơ nào?', opts: ['Thơ tự do', 'Lục bát', 'Thất ngôn bát cú', 'Ngũ ngôn'], c: 0, rOk: 'Cô Thảo: "Rất tốt! Đoạn trích Đất Nước được viết chủ yếu bằng thể thơ tự do."', rFail: 'Cô Thảo: "Đoạn trích Đất Nước sử dụng thể thơ tự do, phù hợp với mạch suy tưởng."', },
      { id: 'v12', subKey: 'van', q: 'Hình ảnh "chiếc thuyền ngoài xa" trong tác phẩm của Nguyễn Minh Châu gợi ra bài học nào?', opts: ['Cần nhìn cuộc sống một cách đa diện, sâu sắc', 'Thiên nhiên luôn đẹp hơn con người', 'Nghệ thuật không liên quan đến cuộc sống', 'Con người luôn có thể tránh khỏi nghịch cảnh'], c: 0, rOk: 'Cô Thảo: "Chính xác! Đừng nhìn cuộc đời chỉ từ một phía."', rFail: 'Cô Thảo: "Tác phẩm nhấn mạnh cách nhìn đa diện, không đơn giản hóa cuộc sống."' },
      { id: 'v13', subKey: 'van', q: 'Tác giả của bài thơ "Tây Tiến" là ai?', opts: ['Quang Dũng', 'Tố Hữu', 'Chính Hữu', 'Huy Cận'], c: 0, rOk: 'Cô Thảo: "Đúng rồi! Quang Dũng đã tái hiện vẻ đẹp hào hoa, bi tráng của người lính Tây Tiến."', rFail: 'Cô Thảo: "Tây Tiến là tác phẩm nổi tiếng của nhà thơ Quang Dũng."' }
      { id: 'v14', subKey: 'van', q: 'Trong "Vợ Chồng A Phủ", Mị cắt dây cởi trói cho A Phủ vào thời điểm nào?', opts: ['Khi nhìn thấy dòng nước mắt của A Phủ', 'Khi nghe tiếng sáo mùa xuân', 'Khi cha thống lí đi vắng', 'Sau khi A Sử bị đánh'], c: 0, rOk: 'Cô Thảo: "Rất tốt! Dòng nước mắt của A Phủ đã đánh thức lòng thương người và sức sống phản kháng trong Mị."', rFail: 'Cô Thảo: "Chính dòng nước mắt của A Phủ đã khiến Mị đồng cảm và hành động."' },
      { id: 'v15', subKey: 'van', q: 'Tác phẩm "Rừng xà nu" chủ yếu phản ánh cuộc đấu tranh của nhân dân ở vùng nào?', opts: ['Tây Nguyên', 'Tây Bắc', 'Đồng bằng Bắc Bộ', 'Nam Bộ'], c: 0, rOk: 'Cô Thảo: "Chính xác! Không gian Tây Nguyên gắn liền với hình tượng cây xà nu và nhân vật Tnú."', rFail: 'Cô Thảo: "Rừng xà nu gắn với không gian Tây Nguyên em nhé!"' },
      { id: 'v16', subKey: 'van', q: 'Câu thơ "Sóng bắt đầu từ gió / Gió bắt đầu từ đâu?" thể hiện điều gì?', opts: ['Sự trăn trở về nguồn gốc của tình yêu', 'Nỗi nhớ quê hương', 'Khát vọng hòa bình', 'Tình yêu thiên nhiên đơn thuần'], c: 0, rOk: 'Cô Thảo: "Rất tốt! Xuân Quỳnh dùng hình tượng sóng để khám phá những bí ẩn của tình yêu."', rFail: 'Cô Thảo: "Đây là sự suy tư của người phụ nữ về nguồn gốc và bản chất tình yêu."' },
      { id: 'v17', subKey: 'van', q: 'Nhân vật ông lái đò trong "Người lái đò Sông Đà" được Nguyễn Tuân khắc họa nổi bật với phẩm chất nào?', opts: ['Tài hoa, dũng cảm và giàu kinh nghiệm', 'Nhút nhát và thụ động', 'Giàu có và quyền lực', 'Trẻ trung và lãng mạn'], c: 0, rOk: 'Cô Thảo: "Chính xác! Ông lái đò là nghệ sĩ trong nghệ thuật vượt thác."', rFail: 'Cô Thảo: "Nguyễn Tuân đặc biệt nhấn mạnh chất tài hoa và bản lĩnh của ông lái đò."' },
      { id: 'v18', subKey: 'van', q: 'Trong "Vợ Nhặt", bà cụ Tứ là mẹ của nhân vật nào?', opts: ['Tràng', 'Phúc', 'A Phủ', 'Chí Phèo'], c: 0, rOk: 'Cô Thảo: "Đúng rồi! Bà cụ Tứ là người mẹ nghèo nhưng giàu lòng thương con."', rFail: 'Cô Thảo: "Bà cụ Tứ là mẹ của Tràng trong Vợ Nhặt."' },
      { id: 'v19', subKey: 'van', q: 'Phong cách nghệ thuật của Nguyễn Tuân trước Cách mạng tháng Tám thường được nhận xét là gì?', opts: ['Tài hoa, uyên bác và có ý thức sâu sắc về cái tôi', 'Mộc mạc, giản dị hoàn toàn', 'Hiện thực phê phán theo phong cách Nam Cao', 'Lãng mạn cách mạng'], c: 0, rOk: 'Cô Thảo: "Rất chuẩn! Cái tôi tài hoa, độc đáo là dấu ấn nổi bật của Nguyễn Tuân."', rFail: 'Cô Thảo: "Nguyễn Tuân nổi bật với phong cách tài hoa, uyên bác và độc đáo."' },
      { id: 'v20', subKey: 'van', q: 'Trong "Chiếc thuyền ngoài xa", nhân vật Phùng là người làm nghề gì?', opts: ['Nhiếp ảnh gia', 'Nhà văn', 'Nhà báo', 'Giáo viên'], c: 0, rOk: 'Cô Thảo: "Chính xác! Phùng là nghệ sĩ nhiếp ảnh được giao nhiệm vụ chụp ảnh biển."', rFail: 'Cô Thảo: "Phùng là một nghệ sĩ nhiếp ảnh trong tác phẩm."' },
     
        // VẬT LÝ (19 câu)
      { id: 'l1', subKey: 'ly', q: 'Tần số góc ω của con lắc lò xo lý tưởng có độ cứng k và khối lượng m là?', opts: ['√(k / m)', '√(m / k)', '2π√(k / m)', '1/2π √(k / m)'], c: 0, rOk: 'Thầy Tuấn cười: "Công thức chuẩn không cần chỉnh!"', rFail: 'Thầy Tuấn gõ thước: "Ôi trời, \'Kẹo / Muối\' chứ có phải \'Muối / Kẹo\' đâu em!"' },
      { id: 'l2', subKey: 'ly', q: 'Hiện tượng giao thoa ánh sáng chứng minh ánh sáng có tính chất gì?', opts: ['Tính chất sóng', 'Tính chất hạt', 'Tính chất từ', 'Tính dẫn điện'], c: 0, rOk: 'Thầy Tuấn: "Chính xác, tán sắc và giao thoa khẳng định tính chất sóng."', rFail: 'Thầy Tuấn: "Hiện tượng quang điện mới chứng minh tính hạt, giao thoa là tính sóng!"' },
      { id: 'l3', subKey: 'ly', q: 'Bước sóng λ được tính theo công thức liên hệ nào giữa vận tốc v và chu kỳ T?', opts: ['λ = v * T', 'λ = v / T', 'λ = T / v', 'λ = 2π * v * T'], c: 0, rOk: 'Thầy Tuấn gật đầu khen ngợi.', rFail: 'Thầy Tuấn: "Bước sóng là quãng đường sóng truyền trong 1 chu kỳ: λ = v.T."' },
      { id: 'l4', subKey: 'ly', q: 'Hạt nhân nguyên tử cấu tạo từ các nucleon gồm những loại hạt nào?', opts: ['Proton và Neutron', 'Proton và Electron', 'Neutron và Positron', 'Chỉ gồm Proton'], c: 0, rOk: 'Thầy Tuấn: "Chính xác, proton mang điện tích dương và neutron không mang điện."', rFail: 'Thầy Tuấn: "Electron ở vỏ nguyên tử chứ không nằm trong hạt nhân!"' },
      { id: 'l5', subKey: 'ly', q: 'Sóng âm truyền nhanh nhất trong môi trường nào sau đây?', opts: ['Chất rắn', 'Chất lỏng', 'Chất khí', 'Chân không'], c: 0, rOk: 'Thầy Tuấn: "Rắn > Lỏng > Khí, chuẩn quy luật mật độ phân tử!"', rFail: 'Thầy Tuấn: "Trong chất rắn mật độ liên kết cao nhất nên truyền âm nhanh nhất."' },
      { id: 'l6', subKey: 'ly', q: 'Đơn vị đo mức cường độ âm trong thực tế thường dùng là?', opts: ['Ben (B) hoặc Decibel (dB)', 'Watt trên mét vuông (W/m²)', 'Hertz (Hz)', 'Newton (N)'], c: 0, rOk: 'Thầy Tuấn: "Đúng rồi, Decibel đo độ to cảm nhận."', rFail: 'Thầy Tuấn: "W/m² là cường độ âm I, còn mức cường độ âm L đo bằng dB."' },
      { id: 'l7', subKey: 'ly', q: 'Trong mạch dao động LC lý tưởng, năng lượng điện từ được bảo toàn bằng tổng của?', opts: ['Năng lượng điện trường và năng lượng từ trường', 'Năng lượng nhiệt và cơ năng', 'Động năng và thế năng', 'Quang năng và điện năng'], c: 0, rOk: 'Thầy Tuấn gật đầu đánh giá cao.', rFail: 'Thầy Tuấn: "Điện trường ở tụ điện và từ trường ở cuộn cảm LC."' },
      { id: 'l8', subKey: 'ly', q: 'Công thức tính động năng của một vật khối lượng m chuyển động với vận tốc v là?', opts: ['Wđ = 1/2 mv²', 'Wđ = mv', 'Wđ = mv²', 'Wđ = 2mv²'], c: 0, rOk: 'Thầy Tuấn: "Chính xác! Động năng phụ thuộc vào bình phương vận tốc."', rFail: 'Thầy Tuấn: "Nhớ công thức Wđ = 1/2mv² nhé!"' },
      { id: 'l9', subKey: 'ly', q: 'Đơn vị của công suất trong hệ SI là gì?', opts: ['Watt (W)', 'Jun (J)', 'Newton (N)', 'Pascal (Pa)'], c: 0, rOk: 'Thầy Tuấn: "Đúng! Công suất được đo bằng Watt."', rFail: 'Thầy Tuấn: "Jun là đơn vị năng lượng, còn công suất dùng Watt."' },
      { id: 'l10', subKey: 'ly', q: 'Trong dao động điều hòa, gia tốc của vật có độ lớn cực đại khi nào?', opts: ['Khi vật ở biên', 'Khi vật qua vị trí cân bằng', 'Khi vận tốc cực đại', 'Khi li độ bằng 0'], c: 0, rOk: 'Thầy Tuấn: "Chính xác! |a|max = ω²A tại vị trí biên."', rFail: 'Thầy Tuấn: "Gia tốc có độ lớn cực đại ở hai biên dao động."' },
      { id: 'l11', subKey: 'ly', q: 'Điện trở của dây dẫn phụ thuộc vào những yếu tố nào?', opts: ['Chiều dài, tiết diện và vật liệu làm dây', 'Chỉ phụ thuộc vào hiệu điện thế', 'Chỉ phụ thuộc vào cường độ dòng điện', 'Chỉ phụ thuộc vào khối lượng dây'], c: 0, rOk: 'Thầy Tuấn: "R = ρl/S, nhớ ba yếu tố quan trọng này nhé!"', rFail: 'Thầy Tuấn: "Công thức R = ρl/S cho thấy điện trở phụ thuộc chiều dài, tiết diện và vật liệu."' },
      { id: 'l12', subKey: 'ly', q: 'Theo định luật Ôm cho đoạn mạch, cường độ dòng điện được tính bằng?', opts: ['I = U/R', 'I = UR', 'I = R/U', 'I = U + R'], c: 0, rOk: 'Thầy Tuấn: "Công thức nền tảng của điện học, rất tốt!"', rFail: 'Thầy Tuấn: "Định luật Ôm: I = U/R."' },
      { id: 'l13', subKey: 'ly', q: 'Khi một vật rơi tự do từ độ cao h xuống đất, nếu bỏ qua sức cản không khí thì cơ năng của vật như thế nào?', opts: ['Được bảo toàn', 'Tăng dần', 'Giảm dần về 0', 'Không xác định'], c: 0, rOk: 'Thầy Tuấn: "Đúng! Thế năng chuyển hóa thành động năng nhưng tổng cơ năng bảo toàn."', rFail: 'Thầy Tuấn: "Trong rơi tự do lý tưởng, cơ năng được bảo toàn."' },
      { id: 'l14', subKey: 'ly', q: 'Hiện tượng quang điện ngoài chứng tỏ ánh sáng có tính chất nào?', opts: ['Tính chất hạt', 'Tính chất sóng thuần túy', 'Tính chất cơ học', 'Tính chất từ'], c: 0, rOk: 'Thầy Tuấn: "Chính xác! Quang điện ngoài là bằng chứng quan trọng cho tính chất hạt của ánh sáng."', rFail: 'Thầy Tuấn: "Giao thoa thể hiện tính sóng, còn quang điện ngoài thể hiện tính hạt."' },
      { id: 'l15', subKey: 'ly', q: 'Trong chân không, tốc độ ánh sáng xấp xỉ bằng bao nhiêu?', opts: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁵ m/s', '3 × 10¹⁰ m/s'], c: 0, rOk: 'Thầy Tuấn: "Chuẩn! c ≈ 3 × 10⁸ m/s."', rFail: 'Thầy Tuấn: "Tốc độ ánh sáng trong chân không là khoảng 300.000 km/s."' },
      { id: 'l16', subKey: 'ly', q: 'Máy biến áp hoạt động dựa trên hiện tượng vật lý nào?', opts: ['Cảm ứng điện từ', 'Quang điện', 'Phản xạ ánh sáng', 'Nhiệt điện'], c: 0, rOk: 'Thầy Tuấn: "Chính xác! Máy biến áp dùng hiện tượng cảm ứng điện từ."', rFail: 'Thầy Tuấn: "Máy biến áp hoạt động dựa trên cảm ứng điện từ giữa hai cuộn dây."' },
      { id: 'l17', subKey: 'ly', q: 'Một vật có khối lượng 2 kg chuyển động với vận tốc 3 m/s. Động năng của vật bằng?', opts: ['9 J', '6 J', '18 J', '3 J'], c: 0, rOk: 'Thầy Tuấn: "Đúng! Wđ = 1/2 × 2 × 3² = 9 J."', rFail: 'Thầy Tuấn: "Thay vào Wđ = 1/2mv², kết quả là 9 J."' },
      { id: 'l18', subKey: 'ly', q: 'Trong mạch điện xoay chiều, tần số của dòng điện dân dụng ở Việt Nam là bao nhiêu?', opts: ['50 Hz', '60 Hz', '100 Hz', '220 Hz'], c: 0, rOk: 'Thầy Tuấn: "Chính xác! Điện lưới dân dụng Việt Nam sử dụng tần số 50 Hz."', rFail: 'Thầy Tuấn: "Đừng nhầm 220 V là hiệu điện thế với 50 Hz là tần số."' },
      { id: 'l19', subKey: 'ly', q: 'Khi ánh sáng truyền từ không khí vào nước, đại lượng nào của ánh sáng không thay đổi?', opts: ['Tần số', 'Bước sóng', 'Tốc độ truyền', 'Không có đại lượng nào'], c: 0, rOk: 'Thầy Tuấn: "Rất tốt! Tần số do nguồn sáng quyết định nên không đổi khi qua môi trường."', rFail: 'Thầy Tuấn: "Khi đổi môi trường, tốc độ và bước sóng thay đổi nhưng tần số không đổi."' },
 
        // HÓA HỌC (19 câu)
      { id: 'h1', subKey: 'hoa', q: 'Kim loại nào sau đây có tính dẫn điện tốt nhất trong các kim loại?', opts: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'], c: 0, rOk: 'Cô Hương: "Rất chuẩn! Thứ tự là Bạc > Đồng > Vàng > Nhôm > Sắt."', rFail: 'Cô Hương: "Tuy đồng phổ biến làm dây điện nhưng Bạc mới dẫn điện tốt nhất nhé!"' },
      { id: 'h2', subKey: 'hoa', q: 'Este no, đơn chức, mạch hở có công thức chung là gì?', opts: ['CnH2nO2 (n ≥ 2)', 'CnH2n-2O2 (n ≥ 3)', 'CnH2n+2O2', 'CnH2nO'], c: 0, rOk: 'Cô Hương khen ngợi câu trả lời nhanh.', rFail: 'Cô Hương: "CnH2nO2 với n bắt đầu từ 2 (HCOOCH3) em nhé."' },
      { id: 'h3', subKey: 'hoa', q: 'Chất nào sau đây thuộc loại đisaccarit?', opts: ['Saccarozơ', 'Glucozơ', 'Fructozơ', 'Tinh bột'], c: 0, rOk: 'Cô Hương: "Saccarozơ gồm 1 gốc glucozơ và 1 gốc fructozơ liên kết."', rFail: 'Cô Hương: "Glucozơ và Fructozơ là monosaccarit, còn Saccarozơ mới là đisaccarit."' },
      { id: 'h4', subKey: 'hoa', q: 'Polime nào sau đây được điều chế bằng phản ứng trùng ngưng?', opts: ['Nilon-6,6', 'Polietilen (PE)', 'Poli(vinyl clorua) (PVC)', 'Cao su buna'], c: 0, rOk: 'Cô Hương mỉm cười gật đầu.', rFail: 'Cô Hương: "Nilon-6,6 trùng ngưng từ axit adipic và hexametylendiamin."' },
      { id: 'h5', subKey: 'hoa', q: 'Kim loại nào có nhiệt độ nóng chảy cao nhất dùng làm dây tóc bóng đèn?', opts: ['Vonfram (W)', 'Crom (Cr)', 'Sắt (Fe)', 'Thủy ngân (Hg)'], c: 0, rOk: 'Cô Hương: "Nhiệt độ nóng chảy trên 3400°C của Vonfram."', rFail: 'Cô Hương: "Vonfram chịu nhiệt đỉnh nhất, Crom là kim loại cứng nhất."' },
      { id: 'h6', subKey: 'hoa', q: 'Amino axit nhỏ nhất có tên gọi là Glyxin có khối lượng mol phân tử bằng bao nhiêu?', opts: ['75', '89', '103', '147'], c: 0, rOk: 'Cô Hương: "M = 75, nhớ rất vững số liệu bài toán peptit!"', rFail: 'Cô Hương: "Gly = 75, Ala = 89, Val = 117. Cần thuộc lòng để bấm casio!"' },
      { id: 'h7', subKey: 'hoa', q: 'Dung dịch làm quỳ tím chuyển sang màu xanh là?', opts: ['Metylamin (CH3NH2)', 'Anilin (C6H5NH2)', 'Axit axetic', 'Glucozơ'], c: 0, rOk: 'Cô Hương gật đầu tán thành.', rFail: 'Cô Hương: "Anilin tính bazơ quá yếu không đổi màu quỳ tím, metylamin mới làm quỳ hóa xanh!"' },
      { id: 'h8', subKey: 'hoa', q: 'Dung dịch có pH < 7 có môi trường gì?', opts: ['Axit', 'Bazơ', 'Trung tính', 'Không xác định'], c: 0, rOk: 'Cô Hương: "Chính xác! pH < 7 là môi trường axit."', rFail: 'Cô Hương: "Nhớ quy tắc: pH < 7 axit, pH = 7 trung tính, pH > 7 bazơ."' },
      { id: 'h9', subKey: 'hoa', q: 'Kim loại nào sau đây phản ứng mạnh với nước ở nhiệt độ thường?', opts: ['Na', 'Cu', 'Ag', 'Au'], c: 0, rOk: 'Cô Hương: "Đúng! Natri phản ứng mạnh với nước tạo NaOH và H₂."', rFail: 'Cô Hương: "Natri thuộc kim loại kiềm nên phản ứng mạnh với nước."' },
      { id: 'h10', subKey: 'hoa', q: 'Công thức hóa học của glucozơ là?', opts: ['C₆H₁₂O₆', 'C₁₂H₂₂O₁₁', 'C₂H₅OH', 'CH₃COOH'], c: 0, rOk: 'Cô Hương: "Rất tốt! Glucozơ có công thức phân tử C₆H₁₂O₆."', rFail: 'Cô Hương: "Đừng nhầm glucozơ C₆H₁₂O₆ với saccarozơ C₁₂H₂₂O₁₁."' },
      { id: 'h11', subKey: 'hoa', q: 'Phản ứng giữa axit và bazơ tạo ra muối và nước được gọi là phản ứng gì?', opts: ['Phản ứng trung hòa', 'Phản ứng trùng hợp', 'Phản ứng nhiệt phân', 'Phản ứng thế'], c: 0, rOk: 'Cô Hương: "Chính xác! Axit + bazơ → muối + nước là phản ứng trung hòa."', rFail: 'Cô Hương: "Đó là phản ứng trung hòa, kiến thức rất cơ bản nhé!"' },
      { id: 'h12', subKey: 'hoa', q: 'Khí CO₂ làm nước vôi trong xuất hiện hiện tượng gì?', opts: ['Vẩn đục do tạo CaCO₃', 'Chuyển sang màu xanh', 'Sủi bọt mạnh và không đổi màu', 'Không có hiện tượng'], c: 0, rOk: 'Cô Hương: "Đúng! CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O."', rFail: 'Cô Hương: "CO₂ làm nước vôi trong vẩn đục do tạo kết tủa CaCO₃."' },
      { id: 'h13', subKey: 'hoa', q: 'Chất nào sau đây là ancol etylic?', opts: ['C₂H₅OH', 'CH₃COOH', 'CH₃OH', 'C₆H₅OH'], c: 0, rOk: 'Cô Hương: "Chính xác! C₂H₅OH là ethanol hay ancol etylic."', rFail: 'Cô Hương: "Ancol etylic có công thức C₂H₅OH nhé!"' },
      { id: 'h14', subKey: 'hoa', q: 'Chất nào sau đây là axit axetic?', opts: ['CH₃COOH', 'C₂H₅OH', 'CH₃OH', 'CH₃CHO'], c: 0, rOk: 'Cô Hương: "Rất tốt! CH₃COOH là thành phần tạo vị chua đặc trưng của giấm."', rFail: 'Cô Hương: "Axit axetic có công thức CH₃COOH."' },
      { id: 'h15', subKey: 'hoa', q: 'Trong phản ứng oxi hóa - khử, chất khử là chất như thế nào?', opts: ['Chất nhường electron', 'Chất nhận electron', 'Chất nhận proton', 'Chất không thay đổi số oxi hóa'], c: 0, rOk: 'Cô Hương: "Chuẩn! Chất khử nhường electron và bản thân bị oxi hóa."', rFail: 'Cô Hương: "Nhớ: chất khử cho e, chất oxi hóa nhận e."' },
      { id: 'h16', subKey: 'hoa', q: 'Nguyên tố nào có kí hiệu hóa học là Fe?', opts: ['Sắt', 'Flo', 'Kẽm', 'Đồng'], c: 0, rOk: 'Cô Hương: "Đúng! Fe bắt nguồn từ tên Latin ferrum của sắt."', rFail: 'Cô Hương: "Fe là sắt, Cu mới là đồng nhé!"' },
      { id: 'h17', subKey: 'hoa', q: 'Khi đốt cháy hoàn toàn một hiđrocacbon, sản phẩm thu được thường là?', opts: ['CO₂ và H₂O', 'CO và H₂', 'C và H₂', 'CH₄ và O₂'], c: 0, rOk: 'Cô Hương: "Chính xác! Hiđrocacbon cháy hoàn toàn tạo CO₂ và H₂O."', rFail: 'Cô Hương: "Cháy hoàn toàn hiđrocacbon luôn tạo CO₂ và H₂O."' },
      { id: 'h18', subKey: 'hoa', q: 'Số oxi hóa của oxi trong phần lớn hợp chất là bao nhiêu?', opts: ['-2', '0', '+2', '-1'], c: 0, rOk: 'Cô Hương: "Đúng! Oxi thường có số oxi hóa -2, ngoại trừ một số trường hợp đặc biệt."', rFail: 'Cô Hương: "Oxi thông thường có số oxi hóa -2 nhé!"' },
      { id: 'h19', subKey: 'hoa', q: 'Polietilen (PE) được điều chế từ monome nào?', opts: ['Etilen (CH₂=CH₂)', 'Vinyl clorua', 'Stiren', 'Axit acrylic'], c: 0, rOk: 'Cô Hương: "Chính xác! Etilen trùng hợp tạo polietilen."', rFail: 'Cô Hương: "PE được tạo thành từ phản ứng trùng hợp etilen."' },
    
        // SINH HỌC (18 câu)
      { id: 's1', subKey: 'sinh', q: 'Cơ quan hô hấp của giun đất là gì?', opts: ['Qua bề mặt da ẩm ướt', 'Hệ thống ống khí', 'Mang', 'Phổi'], c: 0, rOk: 'Thầy Đức cười: "Chuẩn xác, da giun luôn cần chất nhầy ẩm để khuếch tán khí O2/CO2."', rFail: 'Thầy Đức: "Giun chưa có phổi hay ống khí đâu, hô hấp hoàn toàn qua da."' },
      { id: 's2', subKey: 'sinh', q: 'Mã di truyền mở đầu cho quá trình dịch mã trên mARN là codon nào?', opts: ['5\' AUG 3\' (mã hóa Met)', '5\' UAA 3\'', '5\' UAG 3\'', '5\' UGA 3\''], c: 0, rOk: 'Thầy Đức khen: "Rất chuẩn, mã mở đầu dịch mã ra Methionine."', rFail: 'Thầy Đức: "AUG là mã mở đầu, còn UAA, UAG, UGA là 3 mã kết thúc."' },
      { id: 's3', subKey: 'sinh', q: 'Quy luật di truyền phân ly độc lập của Menđen được phát hiện qua đối tượng thí nghiệm nào?', opts: ['Đậu Hà Lan', 'Ruồi giấm', 'Cây hoa phấn', 'Chuột túi'], c: 0, rOk: 'Thầy Đức: "Menđen chọn cây đậu Hà Lan tự thụ phấn nghiêm ngặt."', rFail: 'Thầy Đức: "Ruồi giấm là đối tượng thí nghiệm liên kết gen của Moocgan."' },
      { id: 's4', subKey: 'sinh', q: 'Quá trình quang hợp ở thực vật diễn ra chủ yếu ở bào quan nào?', opts: ['Lục lạp', 'Ti thể', 'Không bào', 'Bộ máy Golgi'], c: 0, rOk: 'Thầy Đức gật đầu.', rFail: 'Thầy Đức: "Ti thể là hô hấp tế bào, lục lạp chứa diệp lục mới quang hợp!"' },
      { id: 's5', subKey: 'sinh', q: 'Đột biến cấu trúc nhiễm sắc thể làm tăng số lượng bản sao một gen trên NST gọi là gì?', opts: ['Đột biến lặp đoạn', 'Đột biến mất đoạn', 'Đột biến đảo đoạn', 'Đột biến chuyển đoạn'], c: 0, rOk: 'Thầy Đức: "Chính xác, lặp đoạn làm tăng liều lượng gen."', rFail: 'Thầy Đức: "Lặp đoạn chính là nhân đôi một đoạn NST chứa gen."' },
      { id: 's6', subKey: 'sinh', q: 'Huyết áp trong hệ tuần hoàn của người đạt giá trị cao nhất tại đâu?', opts: ['Động mạch chủ', 'Tĩnh mạch chủ', 'Mao mạch', 'Tâm thất phải'], c: 0, rOk: 'Thầy Đức: "Máu vừa tống ra từ tâm thất trái vào động mạch chủ có áp lực lớn nhất."', rFail: 'Thầy Đức: "Huyết áp giảm dần từ động mạch chủ -> mao mạch -> tĩnh mạch."' },
      { id: 's7', subKey: 'sinh', q: 'DNA có chức năng chủ yếu nào sau đây?', opts: ['Lưu trữ và truyền đạt thông tin di truyền', 'Cung cấp năng lượng trực tiếp', 'Vận chuyển oxi', 'Tiêu hóa thức ăn'], c: 0, rOk: 'Thầy Đức: "Chính xác! DNA là vật chất di truyền chủ yếu ở sinh vật."', rFail: 'Thầy Đức: "DNA có vai trò lưu giữ và truyền đạt thông tin di truyền."' },
      { id: 's8', subKey: 'sinh', q: 'Đơn phân cấu tạo nên protein là gì?', opts: ['Amino acid', 'Glucose', 'Nucleotide', 'Acid béo'], c: 0, rOk: 'Thầy Đức: "Rất tốt! Protein được cấu tạo từ các amino acid."', rFail: 'Thầy Đức: "Amino acid mới là đơn phân của protein."' },
      { id: 's9', subKey: 'sinh', q: 'Đơn phân cấu tạo nên DNA và RNA là?', opts: ['Nucleotide', 'Amino acid', 'Glucose', 'Glycerol'], c: 0, rOk: 'Thầy Đức: "Chính xác! DNA và RNA đều là các polymer của nucleotide."', rFail: 'Thầy Đức: "Nucleotide là đơn phân của acid nucleic."' },
      { id: 's10', subKey: 'sinh', q: 'Trong tế bào nhân thực, hô hấp tế bào diễn ra chủ yếu ở bào quan nào?', opts: ['Ti thể', 'Lục lạp', 'Ribosome', 'Bộ máy Golgi'], c: 0, rOk: 'Thầy Đức: "Đúng! Ti thể thường được gọi là nhà máy năng lượng của tế bào."', rFail: 'Thầy Đức: "Lục lạp thực hiện quang hợp, còn ti thể là nơi hô hấp tế bào."' },
      { id: 's11', subKey: 'sinh', q: 'Quá trình tổng hợp protein dựa trên khuôn mARN được gọi là gì?', opts: ['Dịch mã', 'Nhân đôi DNA', 'Phiên mã', 'Đột biến'], c: 0, rOk: 'Thầy Đức: "Chính xác! Ribosome đọc mARN để tổng hợp chuỗi polypeptide."', rFail: 'Thầy Đức: "Phiên mã tạo mARN từ DNA, còn dịch mã tạo protein."' },
      { id: 's12', subKey: 'sinh', q: 'Bộ phận nào của tế bào thực vật thực hiện quang hợp?', opts: ['Lục lạp', 'Ti thể', 'Nhân', 'Ribosome'], c: 0, rOk: 'Thầy Đức: "Đúng rồi! Lục lạp chứa hệ sắc tố quang hợp."', rFail: 'Thầy Đức: "Lục lạp là bào quan đặc trưng thực hiện quang hợp ở thực vật."' },
      { id: 's13', subKey: 'sinh', q: 'Ở người, nhóm máu nào thường được gọi là nhóm máu chuyên cho trong hệ ABO?', opts: ['O', 'A', 'B', 'AB'], c: 0, rOk: 'Thầy Đức: "Đúng trong hệ ABO! Người nhóm O không có kháng nguyên A và B trên hồng cầu."', rFail: 'Thầy Đức: "Trong hệ ABO, O thường được xem là nhóm cho phổ quát về mặt hồng cầu, nhưng truyền máu thực tế còn phải xét Rh và phản ứng chéo."' },
      { id: 's14', subKey: 'sinh', q: 'Hoocmon insulin có tác dụng chủ yếu gì?', opts: ['Làm giảm nồng độ glucose trong máu', 'Làm tăng nhịp tim', 'Làm tăng thân nhiệt', 'Làm tăng nồng độ oxygen trong máu'], c: 0, rOk: 'Thầy Đức: "Chính xác! Insulin thúc đẩy tế bào sử dụng và dự trữ glucose."', rFail: 'Thầy Đức: "Insulin có vai trò quan trọng trong việc hạ đường huyết."' },
      { id: 's15', subKey: 'sinh', q: 'Cơ quan nào của người có chức năng lọc máu và tạo nước tiểu?', opts: ['Thận', 'Gan', 'Tim', 'Phổi'], c: 0, rOk: 'Thầy Đức: "Rất tốt! Thận là cơ quan chủ yếu của hệ bài tiết nước tiểu."', rFail: 'Thầy Đức: "Thận đảm nhiệm chức năng lọc máu và hình thành nước tiểu."' },
      { id: 's16', subKey: 'sinh', q: 'Trong quần thể, quan hệ giữa các cá thể cùng loài tranh giành nguồn sống gọi là gì?', opts: ['Cạnh tranh', 'Cộng sinh', 'Hội sinh', 'Kí sinh'], c: 0, rOk: 'Thầy Đức: "Chính xác! Cạnh tranh giúp điều chỉnh số lượng cá thể trong quần thể."', rFail: 'Thầy Đức: "Các cá thể cùng loài có thể cạnh tranh về thức ăn, nơi ở và bạn tình."' },
      { id: 's17', subKey: 'sinh', q: 'Quang hợp hấp thụ khí nào từ môi trường?', opts: ['CO₂', 'O₂', 'N₂', 'H₂'], c: 0, rOk: 'Thầy Đức: "Đúng! Thực vật sử dụng CO₂ và nước để tổng hợp chất hữu cơ nhờ năng lượng ánh sáng."', rFail: 'Thầy Đức: "CO₂ là nguyên liệu quan trọng của quá trình quang hợp."' },
      { id: 's18', subKey: 'sinh', q: 'Sự trao đổi khí ở phổi người diễn ra chủ yếu tại đâu?', opts: ['Phế nang', 'Khí quản', 'Thanh quản', 'Khoang mũi'], c: 0, rOk: 'Thầy Đức: "Chính xác! Phế nang có thành rất mỏng, thuận lợi cho khuếch tán khí."', rFail: 'Thầy Đức: "Trao đổi O₂ và CO₂ chủ yếu diễn ra qua màng phế nang."' },
  
        // LỊCH SỬ (18 câu)
      { id: 'ls1', subKey: 'su', q: 'Chiến thắng nào của quân và dân ta đã làm thất bại hoàn toàn kế hoạch Nava của thực dân Pháp?', opts: ['Chiến dịch Điện Biên Phủ 1954', 'Chiến dịch Việt Bắc 1947', 'Chiến dịch Biên Giới 1950', 'Chiến dịch Tây Bắc 1952'], c: 0, rOk: 'Thầy Hùng hào sảng: "Lừng lẫy năm châu, chấn động địa cầu!"', rFail: 'Thầy Hùng: "Chiến dịch lịch sử Điện Biên Phủ 1954 đập tan cứ điểm kiên cố nhất của Pháp."' },
      { id: 'ls2', subKey: 'su', q: 'Tổ chức Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập vào năm nào?', opts: ['1967 (tại Bangkok)', '1975', '1995', '1986'], c: 0, rOk: 'Thầy Hùng: "Chính xác, tuyên bố Bangkok ngày 8/8/1967."', rFail: 'Thầy Hùng: "ASEAN ra đời năm 1967, Việt Nam gia nhập năm 1995."' },
      { id: 'ls3', subKey: 'su', q: 'Hội nghị Ianta (2/1945) có sự tham gia của nguyên thủ ba cường quốc nào?', opts: ['Liên Xô, Mỹ, Anh', 'Mỹ, Anh, Pháp', 'Liên Xô, Mỹ, Trung Quốc', 'Đức, Ý, Nhật'], c: 0, rOk: 'Thầy Hùng gật đầu hài lòng.', rFail: 'Thầy Hùng: "Big Three thời điểm đó gồm Stalin (Liên Xô), Roosevelt (Mỹ), Churchill (Anh)."' },
      { id: 'ls4', subKey: 'su', q: 'Đại hội Đảng toàn quốc lần thứ VI (12/1986) đã đề ra đường lối quan trọng nào?', opts: ['Đường lối đổi mới đất nước', 'Đường lối công nghiệp hóa', 'Thống nhất đất nước về mặt nhà nước', 'Kế hoạch 5 năm đầu tiên'], c: 0, rOk: 'Thầy Hùng: "Dấu mốc lịch sử vĩ đại đưa đất nước bước vào kỷ nguyên đổi mới."', rFail: 'Thầy Hùng: "Năm 1986 là bước ngoặt đổi mới toàn diện kinh tế - xã hội."' },
      { id: 'ls5', subKey: 'su', q: 'Trận "Điện Biên Phủ trên không" năm 1972 diễn ra trong bao nhiêu ngày đêm?', opts: ['12 ngày đêm', '10 ngày đêm', '15 ngày đêm', '56 ngày đêm'], c: 0, rOk: 'Thầy Hùng: "12 ngày đêm kiên cường bắn rơi pháo đài bay B52 của đế quốc Mỹ."', rFail: 'Thầy Hùng: "12 ngày đêm tháng 12 năm 1972 tại bầu trời Hà Nội - Hải Phòng."' },
      { id: 'ls6', subKey: 'su', q: 'Nguyễn Ái Quốc thành lập Hội Việt Nam Cách mạng Thanh niên tại đâu vào năm 1925?', opts: ['Quảng Châu (Trung Quốc)', 'Hương Cảng', 'Paris (Pháp)', 'Cao Bằng'], c: 0, rOk: 'Thầy Hùng: "Chính xác, lớp đào tạo cán bộ cách mạng tiền phong tại Quảng Châu."', rFail: 'Thầy Hùng: "Quảng Châu là nơi mở các lớp huấn luyện chính trị năm 1925."' },
      { id: 'ls7', subKey: 'su', q: 'Cách mạng tháng Tám năm 1945 ở Việt Nam diễn ra trong thời gian nào?', opts: ['Tháng 8 năm 1945', 'Tháng 5 năm 1945', 'Tháng 9 năm 1945', 'Tháng 12 năm 1945'], c: 0, rOk: 'Thầy Hùng: "Chính xác! Cách mạng tháng Tám đã giành chính quyền trên cả nước."', rFail: 'Thầy Hùng: "Tên gọi đã gợi ý rồi: Cách mạng tháng Tám năm 1945."' },
      { id: 'ls8', subKey: 'su', q: 'Ngày Quốc khánh của nước Việt Nam hiện nay là ngày nào?', opts: ['2/9', '19/8', '30/4', '7/5'], c: 0, rOk: 'Thầy Hùng: "Đúng! Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập."', rFail: 'Thầy Hùng: "Quốc khánh Việt Nam là ngày 2 tháng 9."' },
      { id: 'ls9', subKey: 'su', q: 'Ai đọc Tuyên ngôn Độc lập ngày 2/9/1945?', opts: ['Chủ tịch Hồ Chí Minh', 'Võ Nguyên Giáp', 'Phạm Văn Đồng', 'Trường Chinh'], c: 0, rOk: 'Thầy Hùng: "Chính xác! Bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa."', rFail: 'Thầy Hùng: "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình."' },
      { id: 'ls10', subKey: 'su', q: 'Hiệp định Genève về Đông Dương được ký kết vào năm nào?', opts: ['1954', '1945', '1968', '1973'], c: 0, rOk: 'Thầy Hùng: "Rất tốt! Hiệp định Genève được ký năm 1954."', rFail: 'Thầy Hùng: "Nhớ mốc 1954 gắn với cả Điện Biên Phủ và Hiệp định Genève."' },
      { id: 'ls11', subKey: 'su', q: 'Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký năm nào?', opts: ['1973', '1972', '1975', '1968'], c: 0, rOk: 'Thầy Hùng: "Chính xác! Hiệp định Paris được ký ngày 27/1/1973."', rFail: 'Thầy Hùng: "Mốc cần nhớ: Hiệp định Paris năm 1973."' },
      { id: 'ls12', subKey: 'su', q: 'Ngày giải phóng miền Nam, thống nhất đất nước là ngày nào?', opts: ['30/4/1975', '2/9/1945', '7/5/1954', '19/8/1945'], c: 0, rOk: 'Thầy Hùng: "Đúng! Ngày 30/4/1975 là một dấu mốc lớn của lịch sử Việt Nam hiện đại."', rFail: 'Thầy Hùng: "30/4/1975 là ngày giải phóng miền Nam, thống nhất đất nước."' },
      { id: 'ls13', subKey: 'su', q: 'Đảng Cộng sản Việt Nam được thành lập vào năm nào?', opts: ['1930', '1925', '1945', '1954'], c: 0, rOk: 'Thầy Hùng: "Chính xác! Đảng được thành lập ngày 3/2/1930."', rFail: 'Thầy Hùng: "Mốc quan trọng: năm 1930, dưới sự chủ trì của Nguyễn Ái Quốc."' },
      { id: 'ls14', subKey: 'su', q: 'Phong trào Đông Du đầu thế kỷ XX gắn với nhân vật lịch sử nào?', opts: ['Phan Bội Châu', 'Phan Châu Trinh', 'Nguyễn Thái Học', 'Huỳnh Thúc Kháng'], c: 0, rOk: 'Thầy Hùng: "Đúng! Phan Bội Châu chủ trương đưa thanh niên Việt Nam sang Nhật học tập."', rFail: 'Thầy Hùng: "Phong trào Đông Du gắn liền với nhà yêu nước Phan Bội Châu."' },
      { id: 'ls15', subKey: 'su', q: 'Chiến dịch Hồ Chí Minh diễn ra vào năm nào?', opts: ['1975', '1973', '1968', '1954'], c: 0, rOk: 'Thầy Hùng: "Chính xác! Chiến dịch Hồ Chí Minh kết thúc thắng lợi ngày 30/4/1975."', rFail: 'Thầy Hùng: "Chiến dịch Hồ Chí Minh là chiến dịch quyết định trong mùa Xuân 1975."' },
      { id: 'ls16', subKey: 'su', q: 'Việt Nam chính thức trở thành thành viên của ASEAN vào năm nào?', opts: ['1995', '1986', '1990', '2000'], c: 0, rOk: 'Thầy Hùng: "Đúng! Việt Nam gia nhập ASEAN ngày 28/7/1995."', rFail: 'Thầy Hùng: "Việt Nam là thành viên thứ bảy của ASEAN từ năm 1995."' },
      { id: 'ls17', subKey: 'su', q: 'Nhà nước Văn Lang trong truyền thuyết và sử liệu gắn với các vua nào?', opts: ['Các Vua Hùng', 'Nhà Lý', 'Nhà Trần', 'Nhà Nguyễn'], c: 0, rOk: 'Thầy Hùng: "Rất tốt! Các Vua Hùng gắn với thời kỳ dựng nước Văn Lang."', rFail: 'Thầy Hùng: "Văn Lang gắn với thời đại Hùng Vương."' },
      { id: 'ls18', subKey: 'su', q: 'Ai là vị tướng chỉ huy chiến dịch Điện Biên Phủ năm 1954?', opts: ['Võ Nguyên Giáp', 'Văn Tiến Dũng', 'Nguyễn Chí Thanh', 'Trần Văn Trà'], c: 0, rOk: 'Thầy Hùng: "Chính xác! Đại tướng Võ Nguyên Giáp là Tổng Tư lệnh chiến dịch Điện Biên Phủ."', rFail: 'Thầy Hùng: "Đại tướng Võ Nguyên Giáp là người trực tiếp chỉ huy chiến dịch Điện Biên Phủ."' },
   
        // ĐỊA LÝ (6 câu)
      { id: 'dl1', subKey: 'dia', q: 'Đỉnh núi Phanxipăng cao nhất Việt Nam và Đông Dương thuộc dãy núi nào?', opts: ['Hoàng Liên Sơn', 'Trường Sơn Bắc', 'Trường Sơn Nam', 'Con Voi'], c: 0, rOk: 'Cô Mai: "3143 mét trên dãy Hoàng Liên Sơn hùng vĩ."', rFail: 'Cô Mai: "Nóc nhà Đông Dương nằm trên dãy núi Hoàng Liên Sơn em ơi."' },
      { id: 'dl2', subKey: 'dia', q: 'Vùng kinh tế trọng điểm nào có quy mô GDP và mật độ đô thị lớn nhất nước ta?', opts: ['Vùng kinh tế trọng điểm phía Nam', 'Vùng kinh tế trọng điểm Bắc Bộ', 'Vùng kinh tế trọng điểm miền Trung', 'Đồng bằng sông Cửu Long'], c: 0, rOk: 'Cô Mai khen: "Nắm rất chắc thực tế kinh tế xã hội."', rFail: 'Cô Mai: "Vùng trọng điểm phía Nam (TP.HCM, Bình Dương, Đồng Nai...) dẫn đầu cả nước."' },
      { id: 'dl3', subKey: 'dia', q: 'Gió mùa Đông Bắc hoạt động chủ yếu ở miền khí hậu nào của nước ta?', opts: ['Miền Bắc (từ dãy Bạch Mã trở ra)', 'Miền Nam', 'Tây Nguyên', 'Duyên hải Nam Trung Bộ'], c: 0, rOk: 'Cô Mai gật đầu tán thành.', rFail: 'Cô Mai: "Dãy Bạch Mã chắn gió mùa Đông Bắc tràn sâu xuống phía Nam."' },
      { id: 'dl4', subKey: 'dia', q: 'Tỉnh nào ở nước ta vừa có đường biên giới trên đất liền với hai quốc gia Lào và Campuchia?', opts: ['Kon Tum', 'Điện Biên', 'Quảng Trị', 'Gia Lai'], c: 0, rOk: 'Cô Mai: "Ngã ba Đông Dương - một tiếng gà gáy ba nước cùng nghe tại Kon Tum!"', rFail: 'Cô Mai: "Tỉnh Kon Tum có cửa khẩu Bờ Y tiếp giáp cả Lào và Campuchia."' },
      { id: 'dl5', subKey: 'dia', q: 'Đồng bằng sông Cửu Long gặp khó khăn lớn nhất về tự nhiên vào mùa khô là gì?', opts: ['Xâm nhập mặn và thiếu nước ngọt', 'Bão lũ ngập úng kéo dài', 'Động đất và núi lửa', 'Rét buốt sương muối'], c: 0, rOk: 'Cô Mai: "Hạn hán và mặn hóa ảnh hưởng sâu sắc đến đời sống và nông nghiệp."', rFail: 'Cô Mai: "Vào mùa khô, thủy triều đẩy nước biển vào sâu gây xâm nhập mặn nghiêm trọng."' },
      { id: 'dl6', subKey: 'dia', q: 'Loại đất chiếm diện tích lớn nhất ở vùng Tây Nguyên thích hợp trồng cây cà phê là?', opts: ['Đất Feralit phát triển trên đá bazan', 'Đất phù sa ngọt cổ', 'Đất mặn ven biển', 'Đất cát pha'], c: 0, rOk: 'Cô Mai: "Đất đỏ bazan màu mỡ tầng dày rất thích hợp trồng cây công nghiệp lâu năm."', rFail: 'Cô Mai: "Đất badan Tây Nguyên tạo nên thủ phủ cà phê số 1 nước ta."' },
      { id: 'dl7', subKey: 'dia', q: 'Việt Nam nằm hoàn toàn trong khu vực khí hậu nào?', opts: ['Nhiệt đới', 'Ôn đới', 'Hàn đới', 'Cận cực'], c: 0, rOk: 'Cô Mai: "Đúng! Việt Nam nằm trong vùng nội chí tuyến của bán cầu Bắc, mang tính chất nhiệt đới rõ rệt."', rFail: 'Cô Mai: "Nước ta nằm trong khu vực nội chí tuyến nên khí hậu mang tính nhiệt đới."' },
      { id: 'dl8', subKey: 'dia', q: 'Sông nào có lưu vực lớn nhất Việt Nam?', opts: ['Sông Hồng', 'Sông Đồng Nai', 'Sông Cả', 'Sông Mã'], c: 0, rOk: 'Cô Mai: "Tốt! Lưu vực hệ thống sông Hồng - Thái Bình có quy mô rất lớn."', rFail: 'Cô Mai: "Hệ thống sông Hồng - Thái Bình là một trong những hệ thống sông lớn nhất nước ta."' },
      { id: 'dl9', subKey: 'dia', q: 'Vùng nào của Việt Nam có diện tích trồng cà phê lớn nhất?', opts: ['Tây Nguyên', 'Đồng bằng sông Hồng', 'Đồng bằng sông Cửu Long', 'Đông Nam Bộ'], c: 0, rOk: 'Cô Mai: "Chính xác! Tây Nguyên là vùng chuyên canh cà phê lớn nhất nước ta."', rFail: 'Cô Mai: "Tây Nguyên nổi tiếng với các vùng chuyên canh cà phê như Đắk Lắk và Gia Lai."' },
      { id: 'dl10', subKey: 'dia', q: 'Đồng bằng sông Hồng được bồi đắp chủ yếu bởi hệ thống sông nào?', opts: ['Sông Hồng và sông Thái Bình', 'Sông Tiền và sông Hậu', 'Sông Đồng Nai và sông Bé', 'Sông Mã và sông Cả'], c: 0, rOk: 'Cô Mai: "Đúng! Hai hệ thống sông lớn đã bồi đắp nên đồng bằng này."', rFail: 'Cô Mai: "Đồng bằng sông Hồng gắn với hệ thống sông Hồng - Thái Bình."' },
      { id: 'dl11', subKey: 'dia', q: 'Đồng bằng sông Cửu Long được bồi đắp chủ yếu bởi phù sa của hệ thống sông nào?', opts: ['Sông Mekong', 'Sông Hồng', 'Sông Đồng Nai', 'Sông Mã'], c: 0, rOk: 'Cô Mai: "Chính xác! Mekong khi vào Việt Nam phân thành sông Tiền và sông Hậu."', rFail: 'Cô Mai: "Đồng bằng sông Cửu Long là phần hạ lưu của hệ thống sông Mekong."' },
      { id: 'dl12', subKey: 'dia', q: 'Loại khoáng sản nào là thế mạnh nổi bật của vùng Trung du và miền núi Bắc Bộ?', opts: ['Than và khoáng sản kim loại', 'Dầu khí ngoài khơi', 'Muối biển', 'Bô-xít duy nhất cả nước'], c: 0, rOk: 'Cô Mai: "Đúng! Đây là vùng giàu tài nguyên khoáng sản đa dạng."', rFail: 'Cô Mai: "Trung du và miền núi Bắc Bộ có thế mạnh lớn về than và nhiều loại khoáng sản kim loại."' },
      { id: 'dl13', subKey: 'dia', q: 'Đông Nam Bộ là vùng kinh tế nổi bật với ngành công nghiệp nào?', opts: ['Công nghiệp chế biến, chế tạo và các ngành công nghiệp hiện đại', 'Trồng lúa nước quy mô lớn nhất', 'Khai thác muối', 'Trồng chè là chủ lực'], c: 0, rOk: 'Cô Mai: "Chính xác! Đông Nam Bộ là một trung tâm công nghiệp lớn của cả nước."', rFail: 'Cô Mai: "Đông Nam Bộ có cơ cấu công nghiệp đa dạng và mức độ tập trung công nghiệp cao."' },
      { id: 'dl14', subKey: 'dia', q: 'Vịnh Hạ Long thuộc tỉnh, thành phố nào?', opts: ['Quảng Ninh', 'Hải Phòng', 'Thanh Hóa', 'Nghệ An'], c: 0, rOk: 'Cô Mai: "Đúng! Vịnh Hạ Long thuộc tỉnh Quảng Ninh."', rFail: 'Cô Mai: "Vịnh Hạ Long là danh thắng nổi tiếng của Quảng Ninh."' },
      { id: 'dl15', subKey: 'dia', q: 'Khí hậu miền Nam Việt Nam có đặc điểm nổi bật nào?', opts: ['Có hai mùa mưa và khô rõ rệt', 'Có mùa đông lạnh kéo dài', 'Có băng tuyết thường xuyên', 'Có bốn mùa rõ rệt như ôn đới'], c: 0, rOk: 'Cô Mai: "Chính xác! Nam Bộ có mùa mưa và mùa khô tương phản khá rõ."', rFail: 'Cô Mai: "Đặc trưng khí hậu Nam Bộ là sự phân hóa thành mùa mưa và mùa khô."' },
      { id: 'dl16', subKey: 'dia', q: 'Loại hình giao thông vận tải nào có vai trò quan trọng nhất trong vận chuyển hàng hóa khối lượng lớn trên các tuyến đường dài?', opts: ['Đường biển', 'Đường hàng không', 'Đường bộ nội đô', 'Đường ống'], c: 0, rOk: 'Cô Mai: "Đúng! Đường biển có ưu thế lớn về khối lượng và cự ly vận chuyển hàng hóa quốc tế."', rFail: 'Cô Mai: "Vận tải biển phù hợp với hàng hóa khối lượng lớn và cự ly xa."' },
      { id: 'dl17', subKey: 'dia', q: 'Thành phố nào là trung tâm kinh tế lớn nhất ở phía Nam Việt Nam?', opts: ['Thành phố Hồ Chí Minh', 'Cần Thơ', 'Đà Lạt', 'Nha Trang'], c: 0, rOk: 'Cô Mai: "Chính xác! Thành phố Hồ Chí Minh là đầu tàu kinh tế quan trọng của phía Nam."', rFail: 'Cô Mai: "Thành phố Hồ Chí Minh là trung tâm kinh tế, tài chính và dịch vụ lớn ở phía Nam."' },
      { id: 'dl18', subKey: 'dia', q: 'Biển Đông có ý nghĩa quan trọng đối với Việt Nam chủ yếu vì?', opts: ['Có giá trị về kinh tế, giao thông, tài nguyên và quốc phòng - an ninh', 'Chỉ có giá trị du lịch', 'Chỉ cung cấp nước ngọt', 'Chỉ có giá trị về đánh bắt cá'], c: 0, rOk: 'Cô Mai: "Rất tốt! Biển có vai trò tổng hợp về kinh tế, giao thông, môi trường và quốc phòng - an ninh."', rFail: 'Cô Mai: "Biển Đông có ý nghĩa tổng hợp, không chỉ riêng về đánh bắt hay du lịch."' },
  
        // TIẾNG ANH (18 câu)
      { id: 'ta1', subKey: 'anh', q: 'Choose the correct form: "If I _____ you, I would study harder for the upcoming final exam."', opts: ['were', 'am', 'was to be', 'had been'], c: 0, rOk: 'Cô Jennifer smiles: "Excellent! Second conditional structure with \'were\' for all persons."', rFail: 'Cô Jennifer: "Remember: Condition type 2 uses \'were\' in formal grammar!"' },
      { id: 'ta2', subKey: 'anh', q: 'Find the closest synonym for "VITAL" in: "Water is vital for living organisms."', opts: ['Crucial', 'Optional', 'Dangerous', 'Insignificant'], c: 0, rOk: 'Cô Jennifer: "Well done! Vital means extremely important or crucial."', rFail: 'Cô Jennifer: "Vital means essential/crucial, not optional!"' },
      { id: 'ta3', subKey: 'anh', q: 'Fill in the blank: "She succeeded _____ passing the graduation exam with flying colors."', opts: ['in', 'at', 'on', 'with'], c: 0, rOk: 'Cô Jennifer: "Great job! Succeed always goes with preposition IN."', rFail: 'Cô Jennifer: "Succeed IN doing something, note it in your notebook!"' },
      { id: 'ta4', subKey: 'anh', q: 'Identify the word with different stress pattern: \'candidate\', \'experience\', \'certificate\', \'intensity\'?', opts: ['candidate (stress 1)', 'experience (stress 2)', 'certificate (stress 2)', 'intensity (stress 2)'], c: 0, rOk: 'Cô Jennifer: "Awesome pronunciation skill!"', rFail: 'Cô Jennifer: "Candidate stresses syllable 1, the rest stress syllable 2."' },
      { id: 'ta5', subKey: 'anh', q: '"Neither Lan nor her classmates _____ present in the classroom right now."', opts: ['are', 'is', 'was', 'were'], c: 0, rOk: 'Cô Jennifer: "Correct! Subject verb agreement follows the closest noun \'classmates\'."', rFail: 'Cô Jennifer: "With Neither... nor, verb agrees with the nearest subject!"' },
      { id: 'ta6', subKey: 'anh', q: 'Idiom meaning: What does "break a leg" mean before an exam or performance?', opts: ['Good luck!', 'Be careful!', 'Give up soon!', 'Don\'t run fast!'], c: 0, rOk: 'Cô Jennifer: "Smart student! Break a leg means wishing good luck in theater/slang."', rFail: 'Cô Jennifer: "It\'s an English idiom meaning Good Luck!"' },
      { id: 'ta7', subKey: 'anh', q: 'Choose the correct answer: "She _____ to school every day."', opts: ['goes', 'go', 'going', 'gone'], c: 0, rOk: 'Cô Jennifer: "Excellent! Third-person singular in the present simple takes -s/-es."', rFail: 'Cô Jennifer: "With SHE, use GOES in the present simple."' },
      { id: 'ta8', subKey: 'anh', q: 'Choose the correct form: "I _____ my homework when my friend called."', opts: ['was doing', 'do', 'have done', 'did'], c: 0, rOk: 'Cô Jennifer: "Perfect! Past continuous describes an action in progress when another action happened."', rFail: 'Cô Jennifer: "Use WAS/WERE + V-ing for an action in progress in the past."' },
      { id: 'ta9', subKey: 'anh', q: 'What is the opposite of "generous"?', opts: ['Stingy', 'Kind', 'Friendly', 'Helpful'], c: 0, rOk: 'Cô Jennifer: "Correct! Stingy means unwilling to give or spend."', rFail: 'Cô Jennifer: "The opposite of generous is STINGY."' },
      { id: 'ta10', subKey: 'anh', q: 'Choose the correct preposition: "She is interested _____ learning English."', opts: ['in', 'on', 'at', 'for'], c: 0, rOk: 'Cô Jennifer: "Great! The expression is interested IN + noun/V-ing."', rFail: 'Cô Jennifer: "Remember: interested IN something or doing something."' },
      { id: 'ta11', subKey: 'anh', q: 'Choose the correct answer: "This is the book _____ I bought yesterday."', opts: ['that', 'where', 'who', 'when'], c: 0, rOk: 'Cô Jennifer: "Excellent! THAT can refer to a thing in a relative clause."', rFail: 'Cô Jennifer: "For a thing, THAT is appropriate here."' },
      { id: 'ta12', subKey: 'anh', q: 'What does "look after" mean?', opts: ['Take care of', 'Look at carefully', 'Search for', 'Wait for'], c: 0, rOk: 'Cô Jennifer: "Well done! Look after means take care of."', rFail: 'Cô Jennifer: "Look after someone means take care of them."' },
      { id: 'ta13', subKey: 'anh', q: 'Choose the correct passive form: "The homework _____ by the students yesterday."', opts: ['was completed', 'completed', 'is completing', 'has complete'], c: 0, rOk: 'Cô Jennifer: "Correct! Past passive = was/were + past participle."', rFail: 'Cô Jennifer: "Use WAS + past participle for a singular subject in the past passive."' },
      { id: 'ta14', subKey: 'anh', q: 'Choose the correct word: "If it rains tomorrow, we _____ at home."', opts: ['will stay', 'would stay', 'stayed', 'have stayed'], c: 0, rOk: 'Cô Jennifer: "Excellent! First conditional uses If + present simple, will + V."', rFail: 'Cô Jennifer: "This is the first conditional: If + present, WILL + verb."' },
      { id: 'ta15', subKey: 'anh', q: 'Which word is closest in meaning to "rapid"?', opts: ['Fast', 'Slow', 'Weak', 'Quiet'], c: 0, rOk: 'Cô Jennifer: "Exactly! Rapid means very fast or quick."', rFail: 'Cô Jennifer: "Rapid is a synonym of FAST or QUICK."' },
      { id: 'ta16', subKey: 'anh', q: 'Choose the correct answer: "There _____ many students in the classroom."', opts: ['are', 'is', 'was', 'be'], c: 0, rOk: 'Cô Jennifer: "Correct! The plural noun STUDENTS requires ARE."', rFail: 'Cô Jennifer: "Students is plural, so use THERE ARE."' },
      { id: 'ta17', subKey: 'anh', q: 'Which sentence is grammatically correct?', opts: ['I have lived here for five years.', 'I live here since five years.', 'I am live here for five years.', 'I lived here since five years.'], c: 0, rOk: 'Cô Jennifer: "Perfect! Present perfect works with FOR + a period of time."', rFail: 'Cô Jennifer: "Use HAVE/HAS + past participle with FOR when the situation continues to the present."' },
      { id: 'ta18', subKey: 'anh', q: 'What does "once in a blue moon" mean?', opts: ['Very rarely', 'Every day', 'Very quickly', 'At midnight'], c: 0, rOk: 'Cô Jennifer: "Great! It means something happens very rarely."', rFail: 'Cô Jennifer: "Once in a blue moon means very rarely."' },
    
        // GDCD (17 câu)
      { id: 'gd1', subKey: 'gdcd', q: 'Quy luật giá trị yêu cầu việc sản xuất và lưu thông hàng hóa phải dựa trên cơ sở nào?', opts: ['Thời gian lao động xã hội cần thiết', 'Thời gian lao động cá biệt', 'Sở thích của người tiêu dùng', 'Mệnh lệnh cơ quan nhà nước'], c: 0, rOk: 'Thầy Nam: "Chuẩn xác, căn bản của kinh tế chính trị!"', rFail: 'Thầy Nam: "Sản xuất và lưu thông phải dựa trên thời gian lao động xã hội cần thiết."' },
      { id: 'gd2', subKey: 'gdcd', q: 'Công dân đủ bao nhiêu tuổi trở lên có quyền bầu cử Quốc hội và Hội đồng nhân dân?', opts: ['Đủ 18 tuổi', 'Đủ 20 tuổi', 'Đủ 21 tuổi', 'Đủ 16 tuổi'], c: 0, rOk: 'Thầy Nam: "Chính xác, điều 27 Hiến pháp nước CHXHCN Việt Nam quy định đủ 18 tuổi."', rFail: 'Thầy Nam: "Bầu cử là đủ 18 tuổi, ứng cử là đủ 21 tuổi em nhé!"' },
      { id: 'gd3', subKey: 'gdcd', q: 'Hành vi vi phạm pháp luật có mức độ nguy hiểm cao nhất cho xã hội được gọi là gì?', opts: ['Tội phạm hình sự', 'Vi phạm hành chính', 'Vi phạm kỷ luật', 'Vi phạm dân sự'], c: 0, rOk: 'Thầy Nam: "Đúng rồi, tội phạm hình sự được quy định nghiêm ngặt trong Bộ luật Hình sự."', rFail: 'Thầy Nam: "Vi phạm hình sự (tội phạm) là hành vi có tính chất nguy hiểm cao nhất."' },
      { id: 'gd4', subKey: 'gdcd', q: 'Bất kỳ công dân nào vi phạm pháp luật đều phải chịu trách nhiệm pháp lý thể hiện quyền gì?', opts: ['Quyền bình đẳng trước pháp luật', 'Quyền tự do kinh doanh', 'Quyền được phát triển', 'Quyền tự do ngôn luận'], c: 0, rOk: 'Thầy Nam gật đầu biểu dương.', rFail: 'Thầy Nam: "Mọi công dân không phân biệt đối xử đều bình đẳng trước pháp luật."' },
      { id: 'gd5', subKey: 'gdcd', q: 'Một trong những nội dung của quyền học tập của công dân là học không hạn chế từ?', opts: ['Tiểu học đến đại học và sau đại học', 'Cấp 1 đến cấp 3', 'Đại học tại chức', 'Học nghề tự do'], c: 0, rOk: 'Thầy Nam: "Học tập suốt đời và học không hạn chế là quyền hiến định."', rFail: 'Thầy Nam: "Quyền học tập cho phép công dân học từ thấp đến cao không giới hạn."' },
      { id: 'gd6', subKey: 'gdcd', q: 'Hiến pháp là gì?', opts: ['Luật cơ bản của Nhà nước, có hiệu lực pháp lý cao nhất', 'Một loại nghị định', 'Một văn bản nội bộ của doanh nghiệp', 'Một bản hợp đồng dân sự'], c: 0, rOk: 'Thầy Nam: "Chính xác! Hiến pháp là luật cơ bản của Nhà nước."', rFail: 'Thầy Nam: "Hiến pháp có vị trí pháp lý cao nhất trong hệ thống pháp luật quốc gia."' },
      { id: 'gd7', subKey: 'gdcd', q: 'Quyền tự do ngôn luận của công dân được thực hiện trong khuôn khổ nào?', opts: ['Theo quy định của pháp luật', 'Không có bất kỳ giới hạn nào', 'Chỉ khi được cơ quan nhà nước cho phép', 'Chỉ trên mạng xã hội'], c: 0, rOk: 'Thầy Nam: "Đúng! Quyền phải được thực hiện phù hợp với Hiến pháp và pháp luật."', rFail: 'Thầy Nam: "Các quyền tự do của công dân được thực hiện trong khuôn khổ pháp luật."' },
      { id: 'gd8', subKey: 'gdcd', q: 'Thuế là khoản tiền mà tổ chức, cá nhân phải nộp cho Nhà nước theo nguyên tắc nào?', opts: ['Theo quy định của pháp luật', 'Theo thỏa thuận cá nhân', 'Theo sở thích của doanh nghiệp', 'Theo yêu cầu của người bán hàng'], c: 0, rOk: 'Thầy Nam: "Chính xác! Nghĩa vụ thuế được pháp luật quy định."', rFail: 'Thầy Nam: "Thuế là khoản nộp bắt buộc theo quy định của pháp luật."' },
      { id: 'gd9', subKey: 'gdcd', q: 'Bình đẳng trong lao động thể hiện ở việc người lao động có quyền nào?', opts: ['Làm việc, lựa chọn nghề nghiệp phù hợp và hưởng quyền lợi theo pháp luật', 'Tự ý phá hợp đồng bất cứ lúc nào', 'Không cần tuân thủ nội quy lao động', 'Được miễn mọi nghĩa vụ trong công việc'], c: 0, rOk: 'Thầy Nam: "Rất tốt! Quyền lao động luôn đi cùng nghĩa vụ và trách nhiệm."', rFail: 'Thầy Nam: "Bình đẳng trong lao động phải gắn với quyền và nghĩa vụ theo pháp luật."' },
      { id: 'gd10', subKey: 'gdcd', q: 'Một trong những biểu hiện của cạnh tranh lành mạnh là gì?', opts: ['Tuân thủ pháp luật và tôn trọng đối thủ', 'Bôi nhọ đối thủ', 'Làm hàng giả', 'Che giấu thông tin bắt buộc'], c: 0, rOk: 'Thầy Nam: "Chính xác! Cạnh tranh phải tuân thủ pháp luật và chuẩn mực kinh doanh."', rFail: 'Thầy Nam: "Cạnh tranh lành mạnh không bao gồm hành vi gian lận hay phá hoại đối thủ."' },
      { id: 'gd11', subKey: 'gdcd', q: 'Khi tham gia giao thông bằng xe máy, hành vi nào là đúng?', opts: ['Đội mũ bảo hiểm đúng quy cách và chấp hành luật giao thông', 'Đi ngược chiều khi đường vắng', 'Vượt đèn đỏ khi không có cảnh sát', 'Sử dụng điện thoại khi đang lái xe'], c: 0, rOk: 'Thầy Nam: "Rất tốt! An toàn giao thông bắt đầu từ ý thức của mỗi người."', rFail: 'Thầy Nam: "Hãy luôn đội mũ bảo hiểm và tuân thủ quy tắc giao thông."' },
      { id: 'gd12', subKey: 'gdcd', q: 'Trách nhiệm pháp lý nhằm mục đích nào?', opts: ['Xử lý hành vi vi phạm và bảo đảm trật tự pháp luật', 'Khuyến khích vi phạm pháp luật', 'Thay thế mọi quy tắc đạo đức', 'Chỉ áp dụng cho doanh nghiệp'], c: 0, rOk: 'Thầy Nam: "Chính xác! Trách nhiệm pháp lý góp phần bảo đảm kỷ cương và trật tự xã hội."', rFail: 'Thầy Nam: "Trách nhiệm pháp lý là hậu quả pháp lý mà chủ thể vi phạm phải gánh chịu."' },
      { id: 'gd13', subKey: 'gdcd', q: 'Hành vi nào thể hiện quyền tự do kinh doanh của công dân?', opts: ['Lựa chọn ngành nghề kinh doanh mà pháp luật không cấm', 'Kinh doanh mọi mặt hàng bất kể pháp luật', 'Buôn bán hàng giả', 'Trốn tránh nghĩa vụ thuế'], c: 0, rOk: 'Thầy Nam: "Đúng! Tự do kinh doanh luôn nằm trong khuôn khổ pháp luật."', rFail: 'Thầy Nam: "Công dân được tự do kinh doanh trong những ngành nghề mà pháp luật không cấm."' },
      { id: 'gd14', subKey: 'gdcd', q: 'Công dân có nghĩa vụ nào đối với tài sản của Nhà nước?', opts: ['Tôn trọng, bảo vệ và sử dụng đúng quy định', 'Tự ý chiếm giữ', 'Có thể sử dụng cho mục đích cá nhân', 'Được phép bán lại'], c: 0, rOk: 'Thầy Nam: "Chính xác! Tài sản công cần được bảo vệ và sử dụng đúng mục đích."', rFail: 'Thầy Nam: "Tài sản Nhà nước không phải tài sản cá nhân để tự ý sử dụng."' },
      { id: 'gd15', subKey: 'gdcd', q: 'Pháp luật có đặc điểm nào sau đây?', opts: ['Có tính bắt buộc chung và được Nhà nước bảo đảm thực hiện', 'Chỉ mang tính khuyến nghị', 'Chỉ áp dụng cho cán bộ', 'Không có chế tài'], c: 0, rOk: 'Thầy Nam: "Rất chính xác! Đây là một đặc trưng cơ bản của pháp luật."', rFail: 'Thầy Nam: "Tính bắt buộc chung và sự bảo đảm của Nhà nước là đặc trưng quan trọng của pháp luật."' },
      { id: 'gd16', subKey: 'gdcd', q: 'Khi phát hiện hành vi xâm phạm quyền lợi hợp pháp của mình, công dân có thể làm gì?', opts: ['Sử dụng các phương thức khiếu nại, tố cáo hoặc yêu cầu cơ quan có thẩm quyền giải quyết theo luật', 'Tự ý trả thù', 'Đăng thông tin cá nhân của người khác', 'Bỏ qua trong mọi trường hợp'], c: 0, rOk: 'Thầy Nam: "Đúng! Pháp luật cung cấp các cơ chế để bảo vệ quyền và lợi ích hợp pháp."', rFail: 'Thầy Nam: "Nên sử dụng đúng cơ chế pháp luật thay vì tự ý xử lý bằng hành vi trả đũa."' },
      { id: 'gd17', subKey: 'gdcd', q: 'Một người đủ tuổi và có năng lực hành vi phù hợp phải chịu trách nhiệm về hành vi vi phạm pháp luật của mình thể hiện nguyên tắc nào?', opts: ['Cá nhân phải chịu trách nhiệm pháp lý về hành vi vi phạm của mình', 'Không ai phải chịu trách nhiệm', 'Chỉ người bị hại chịu trách nhiệm', 'Chỉ doanh nghiệp chịu trách nhiệm'], c: 0, rOk: 'Thầy Nam: "Chính xác! Trách nhiệm pháp lý gắn với hành vi và điều kiện trách nhiệm theo luật."', rFail: 'Thầy Nam: "Khi đủ điều kiện chịu trách nhiệm, cá nhân phải chịu hậu quả pháp lý do hành vi vi phạm gây ra."' },
    
        // ĐỐ MẸO HỌC TRÒ (6 câu)
      { id: 'dm1', subKey: 'meo', q: 'Cái gì học sinh càng bôi nhiều thì nó lại càng đen xì?', opts: ['Bảng đen phấn trắng', 'Quyển vở viết', 'Mực bút máy', 'Cục tẩy gôm'], c: 0, rOk: 'Bác bảo vệ cười khà khà: "Đúng rồi, viết phấn trắng xóa đi thì bảng lại đen xì!"', rFail: 'Cả lớp cười ồ: "Bảng lớp học chứ cái gì nữa đồ ngốc ơi!"' },
      { id: 'dm2', subKey: 'meo', q: 'Thầy giáo dạy hình học sợ nhất môn thể thao nào sau đây?', opts: ['Môn Đấm Bốc (vì sợ ăn quả đấm tròn xoe)', 'Bóng đá', 'Cầu lông', 'Bóng chuyền'], c: 0, rOk: 'Cả lớp cười khúc khích trước câu trả lời dí dỏm!', rFail: 'Đám bạn trêu: "Bị đấm một phát sưng vù mắt thành hình tròn méo mó đấy!"' },
      { id: 'dm3', subKey: 'meo', q: 'Một người đứng quay lưng về hướng Bắc, mặt hướng về phía Nam. Bên tay phải người đó là hướng nào?', opts: ['Hướng Tây', 'Hướng Đông', 'Hướng Bắc', 'Hướng Đông Bắc'], c: 0, rOk: 'Rất nhanh trí, định hướng không gian chuẩn đét!', rFail: 'Nhầm lẫn phương hướng rồi! Tay phải là hướng Tây.' },
      { id: 'dm4', subKey: 'meo', q: 'Từ nào trong từ điển tiếng Việt mà tất cả học sinh cấp 3 đều phát âm là "SAI"?', opts: ['Từ "SAI"', 'Từ "ĐÚNG"', 'Từ "KHÓ"', 'Từ "LƯỜI"'], c: 0, rOk: 'Câu đố chữ kinh điển của tuổi học trò!', rFail: 'Từ "SAI" thì đọc là sai chứ đọc là gì nữa!' },
      { id: 'dm5', subKey: 'meo', q: 'Con gì đập thì sống, không đập thì chết ngắc ngoải?', opts: ['Con tim', 'Con muỗi', 'Con gián', 'Con cá'], c: 0, rOk: 'Trái tim rộn ràng đập rộn rã khi ngồi cạnh Triệu Mẫn!', rFail: 'Trái tim của chính mình đó bạn ơi!' },
      { id: 'dm6', subKey: 'meo', q: 'Cái gì bạn có thể mượn của bạn cùng bàn mãi mãi mà không bao giờ trả lại được?', opts: ['Lời cảm ơn hoặc nụ cười', 'Cục tẩy', 'Bút bi', 'Vở bài tập'], c: 0, rOk: 'Một câu trả lời ấm áp tình cảm tuổi học trò.', rFail: 'Mượn nụ cười và ánh mắt ai đó làm sao mà hoàn trả được!' }
    ];

    /* =============================================================
       3. MENU CĂN TIN 20+ MÓN HỌC ĐƯỜNG
       ============================================================= */
    const CANTEEN_MENU = [
      { id: 'f1', name: 'Bánh tráng trộn khô bò trứng cút', cost: 15000, energy: 20, mood: 15, hp: 5, love: 0, icon: '🥣', desc: 'Đầy ắp khô bò, xoài chua, rau răm và hành phi giòn rụm.' },
      { id: 'f2', name: 'Bánh mì que pate nướng giòn', cost: 12000, energy: 25, mood: 10, hp: 5, love: 0, icon: '🥖', desc: 'Thơm nức mùi bơ pate béo ngậy, cắn nghe giòn tan.' },
      { id: 'f3', name: 'Milo dầm trân châu pudding trứng', cost: 20000, energy: 30, mood: 25, hp: 0, love: 0, icon: '🍫', desc: 'Đậm đặc bột cacao Milo, ngọt lịm tan chảy ngày hè.' },
      { id: 'f4', name: 'Trà tắc khổng lồ hạt chia mát lạnh', cost: 12000, energy: 15, mood: 20, hp: 8, love: 0, icon: '🍹', desc: 'Chua thanh ngọt mát, giải tỏa cơn khát sau giờ thể dục.' },
      { id: 'f5', name: 'Mì tôm chanh bò xúc xích nóng', cost: 22000, energy: 35, mood: 15, hp: -2, love: 0, icon: '🍜', desc: 'Bát mì bốc khói nghi ngút trứ danh cứu đói giờ ra chơi.' },
      { id: 'f6', name: 'Bánh tráng cuốn sốt me bơ trứng', cost: 18000, energy: 22, mood: 18, hp: 3, love: 0, icon: '🌯', desc: 'Sốt me chua ngọt đẫm vị hòa quyện mayonnaise béo bùi.' },
      { id: 'f7', name: 'Bắp xào bơ hành tôm khô ngọt lịm', cost: 15000, energy: 20, mood: 12, hp: 6, love: 0, icon: '🌽', desc: 'Hạt bắp nổ lách tách trên chảo bơ bốc khói ngào ngạt.' },
      { id: 'f8', name: 'Cá viên chiên mắm bơ tỏi ớt', cost: 20000, energy: 25, mood: 20, hp: 2, love: 0, icon: '🍢', desc: 'Chiên vàng ươm ngập mắm tỏi cay nồng kích thích vị giác.' },
      { id: 'f9', name: 'Tokbokki lắc phô mai giòn rụm', cost: 20000, energy: 24, mood: 18, hp: 4, love: 0, icon: '🧀', desc: 'Bánh gạo chiên giòn áo lớp bột phô mai mằn mặn thơm phức.' },
      { id: 'f10', name: 'Sữa tươi trân châu đường đen', cost: 25000, energy: 28, mood: 25, hp: 5, love: 0, icon: '🧋', desc: 'Trân châu dẻo quánh nấu đường nâu ấm nóng thơm nồng.' },
      { id: 'f11', name: 'Trà đào cam sả thanh mát sảng khoái', cost: 20000, energy: 18, mood: 22, hp: 10, love: 0, icon: '🍑', desc: 'Miếng đào giòn sần sật quyện vị cam vàng sả tươi thanh tao.' },
      { id: 'f12', name: 'Bò khô cháy tỏi vắt quất chua cay', cost: 25000, energy: 15, mood: 20, hp: 5, love: 0, icon: '🥩', desc: 'Từng thớ thịt cay cay xé nhỏ nhâm nhi cùng hội bạn thân.' },
      { id: 'f13', name: 'Cơm cháy mỡ hành chà bông giòn tan', cost: 15000, energy: 25, mood: 14, hp: 3, love: 0, icon: '🍘', desc: 'Cơm cháy đáy nồi giòn tan đẫm mỡ hành óng ánh.' },
      { id: 'f14', name: 'Khoai tây lốc xoáy rắc phô mai', cost: 15000, energy: 20, mood: 15, hp: 2, love: 0, icon: '🥔', desc: 'Xoắn ốc đẹp mắt cắn rụm rụm giữa sân trường náo nhiệt.' },
      { id: 'f15', name: 'Kem ốc quế 7 màu mát lạnh', cost: 10000, energy: 12, mood: 22, hp: 4, love: 0, icon: '🍦', desc: 'Vị vani sôcôla dâu ngọt ngào xua tan cơn mệt mỏi tiết 4.' },
      { id: 'f16', name: 'Xôi mặn thập cẩm chả lụa lạp xưởng', cost: 20000, energy: 40, mood: 16, hp: 8, love: 0, icon: '🍙', desc: 'Hạt nếp dẻo quánh lót dạ chắc bụng suốt cả buổi học.' },
      { id: 'f17', name: 'Bánh tiêu sầu riêng bọc xôi', cost: 12000, energy: 22, mood: 15, hp: 3, love: 0, icon: '🥠', desc: 'Vỏ bánh tiêu ngọt bùi thơm lừng góc cổng trường.' },
      { id: 'f18', name: 'Trà chanh hoa hồng thơm ngát', cost: 12000, energy: 15, mood: 18, hp: 8, love: 0, icon: '🍋', desc: 'Hương hoa thoang thoảng giúp tinh thần sảng khoái, tập trung học bài.' },
      { id: 'f19', name: 'Xúc xích Đức nướng phô mai que', cost: 18000, energy: 26, mood: 16, hp: 4, love: 0, icon: '🌭', desc: 'Xúc xích béo ngậy ăn kèm phô mai kéo sợi thơm phức.' },
      // MÓN ĐẶC BIỆT DÀNH CHO CRUSH
      { id: 'f20', name: 'Combo Đôi Bạn Cùng Tiến (Bao Triệu Mẫn)', cost: 45000, energy: 25, mood: 35, hp: 10, love: 12, icon: '💖', desc: 'Gồm 2 ly Trà Sữa Full Topping + Đĩa Bánh Tráng Trộn Đặc Biệt chia sẻ cùng Triệu Mẫn.' },
      { id: 'f21', name: 'Bánh Mousse Trái Tim Dâu Tây (Tặng Mẫn)', cost: 35000, energy: 15, mood: 30, hp: 5, love: 15, icon: '🍰', desc: 'Chiếc bánh kem dâu xinh xắn gửi gắm tâm tình ngọt ngào đến bàn bên.' }
    ];

    /* =============================================================
       4. HỆ THỐNG VIỆC LÀM THÊM (PART-TIME JOBS)
       ============================================================= */
    const PART_TIME_JOBS = [
      {
        id: 'job_canteen',
        name: 'Trực phụ bán tại Căn tin Cô Năm',
        icon: '🍜',
        salary: 25000,
        energyCost: 25,
        hpCost: 5,
        skillGain: 4,
        reqDesc: 'Không yêu cầu điểm số',
        condition: (s) => true,
        diaryMsg: 'Hôm nay phụ cô Năm bưng bánh tráng trộn và rửa ly ở căn tin. Mồ hôi nhễ nhại nhưng bù lại cô Năm cho thêm đĩa bắp xào nóng hổi.'
      },
      {
        id: 'job_tutor',
        name: 'Gia sư kèm Toán/Lý cho học sinh lớp 10',
        icon: '🧑‍🏫',
        salary: 60000,
        energyCost: 30,
        hpCost: 0,
        skillGain: 6,
        reqDesc: 'Cần Điểm học tập 📚 ≥ 324',
        condition: (s) => s.stats.study >= 324,
        diaryMsg: 'Nhận dạy kèm cho cậu em lớp 10. Lúc giảng bài say sưa mình cũng tình cờ ôn lại được cả đống dạng bài khó sắp thi.'
      },
      {
        id: 'job_flyer',
        name: 'Phát tờ rơi & Bưng bê trà sữa gần trường',
        icon: '🧋',
        salary: 30000,
        energyCost: 35,
        hpCost: 8,
        skillGain: 5,
        reqDesc: 'Cần Năng lượng ⚡ ≥ 40',
        condition: (s) => s.stats.energy >= 40,
        diaryMsg: 'Đi phát tờ rơi trung tâm luyện thi dưới cái nắng gay gắt rồi phụ bưng bê quán trà sữa. Chân mỏi rã rời nhưng có tiền tiêu xài.'
      },
      {
        id: 'job_designer',
        name: 'Thiết kế Slide thuyết trình / Báo tường cho lớp',
        icon: '🎨',
        salary: 45000,
        energyCost: 20,
        hpCost: 2,
        skillGain: 8,
        reqDesc: 'Cần Kỹ năng sống 🧠 ≥ 35',
        condition: (s) => s.stats.skill >= 35,
        diaryMsg: 'Ngồi cặm cụi thiết kế bài thuyết trình Canva cho lớp bạn. Ai xem xong cũng khen tấm tắc và chuyển khoản tiền công liền tay!'
      },
      {
        id: 'job_freelance',
        name: 'Cộng tác viên viết bài & Quản trị fanpage online',
        icon: '💻',
        salary: 50000,
        energyCost: 22,
        hpCost: 3,
        skillGain: 7,
        reqDesc: 'Chỉ làm được vào Buổi tối ở nhà',
        condition: (s) => s.location === 'home' || s.timeIndex >= 4,
        diaryMsg: 'Đêm khuya gõ phím viết bài cộng tác viên kiếm thêm thu nhập. Góc bàn học sáng ánh đèn ấm cúng.'
      }
    ];

    /* =============================================================
       5. GAME STATE
       ============================================================= */
    const STATE = {
      isGameOver: false,
      day: 1,
      totalDays: 45,
      timeIndex: 0, // 0: 07:30, 1: 09:15, 2: 11:30, 3: 14:00, 4: 17:00, 5: 20:30
      location: 'class', // 'class', 'canteen', 'library', 'yard', 'job', 'home'
      
      stats: {
        hp: 85,          // ❤️ Sức khỏe
        energy: 100,     // ⚡ Năng lượng
        mood: 75,        // 😊 Tâm trạng
        study: 10,       // 📚 Điểm học tập
        friends: 40,     // 👥 Bạn bè
        love: 10,        // 💕 Tình cảm Triệu Mẫn (%)
        reputation: 30,  // ⭐ Danh tiếng
        skill: 25,       // 🧠 Kỹ năng sống & xã hội
        money: 50000     // 💰 Tiền mặt (VNĐ)
      },

      bag: [
        { id: 'math_note', name: 'Sổ Bí Kíp Công Thức Toán', icon: '📘', count: 1, desc: 'Dùng tăng vĩnh viễn +8 📚 Điểm học tập.' },
        { id: 'gift_strawberry', name: 'Kẹo Dâu Ngọt Ngào', icon: '🍬', count: 2, desc: 'Tặng Triệu Mẫn tăng +8% 💕 Tình cảm.' }
      ],

      todayEvents: [],
      diaryEntries: []
    };

    const TIME_PERIODS = [
      { text: '07:30', name: 'Buổi sáng • Tiết 1-2' },
      { text: '09:15', name: 'Giờ ra chơi 15 phút' },
      { text: '11:30', name: 'Tan trường buổi sáng' },
      { text: '14:00', name: 'Buổi chiều • Ôn tập / Hoạt động' },
      { text: '17:00', name: 'Chiều muộn • Thể thao & Việc làm' },
      { text: '20:30', name: 'Buổi tối • Góc học tập tại nhà' }
    ];

    const DAYS_OF_WEEK = ['THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY', 'CHỦ NHẬT'];
    const LOCATIONS_LIST = ['class', 'canteen', 'library', 'yard', 'job', 'home'];

    /* =============================================================
       6. HỘI THOẠI PHÂN NHÁNH VỚI TRIỆU MẪN THEO MỐC TÌNH CẢM
       ============================================================= */
    function getCrushAffinityLevel(loveVal) {
      if (loveVal < 25) return { stage: 1, tag: 'Bạn Cùng Bàn', title: 'Triệu Mẫn (Bạn cùng bàn)' };
      if (loveVal < 50) return { stage: 2, tag: 'Bạn Thân Thiết', title: 'Triệu Mẫn (Hay trêu)' };
      if (loveVal < 75) return { stage: 3, tag: 'Mối Quan Hệ Mập Mờ', title: 'Triệu Mẫn (Crush tim đập thình thịch) ✨' };
      return { stage: 4, tag: 'Hẹn Ước Tương Lai', title: 'Triệu Mẫn (Người thương tương lai) 💕' };
    }

    function openCrushDialogue() {
      if (STATE.isGameOver) return;
      if (STATE.stats.energy < 8) {
        showStatAlert('⚠️ Bạn quá đuối sức, mắt díu lại không kịp nhìn Mẫn!', 'text-amber-400');
        audio.playWrong();
        return;
      }

      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const card = document.getElementById('dialogueCard');
      card.classList.remove('hidden');

      const aff = getCrushAffinityLevel(STATE.stats.love);
      document.getElementById('dialogueAffinityTag').textContent = aff.tag;
      document.getElementById('dialogueSpeaker').textContent = aff.title;

      const speechEl = document.getElementById('dialogueSpeech');
      const choicesEl = document.getElementById('dialogueChoices');
      choicesEl.innerHTML = '';

      if (aff.stage === 1) {
        speechEl.textContent = '“Này cậu! Cho tớ mượn cục tẩy với compa được không? Nhìn mặt cậu hôm nay ngố tàu dễ sợ!”';
        createDialogueChoice('“Tẩy đây, có cần tớ chỉ cho công thức câu hình học không?”', { love: +5, study: +3, mood: +6, energy: -8 }, 'Cho mượn đồ kèm nụ cười thân thiện');
        createDialogueChoice('“Có mượn thì nhớ mai trả đấy nhé, không tớ đòi tiền lãi kẹo dâu!”', { love: +3, mood: +10, energy: -8 }, 'Trêu lại Mẫn một câu dí dỏm');
      } else if (aff.stage === 2) {
        speechEl.textContent = '“Hôm nay tan học cậu có ghé căn tin không? Tớ tự dưng thèm bánh tráng trộn quá chừng, mà đi một mình thì chán...”';
        createDialogueChoice('“Đi chứ! Để tớ dắt xe bao cậu một phần đặc biệt luôn!”', { love: +8, mood: +12, money: -20000, energy: -10 }, 'Sẵn sàng rủ Mẫn đi ăn vặt (-20k)');
        createDialogueChoice('“Để tớ giảng nốt cho cậu bài toán này rồi mình cùng xuống nhé!”', { love: +6, study: +5, mood: +8, energy: -10 }, 'Vừa chỉ bài vừa rủ đi chung');
      } else if (aff.stage === 3) {
        speechEl.textContent = '“Cậu này... Mai sau thi đại học xong, cậu có tính nộp hồ sơ cùng thành phố với tớ không? Tớ... sợ xa đám bạn lớp mình lắm.”';
        createDialogueChoice('“Chắc chắn rồi! Dù học trường nào tớ cũng sẽ qua chở cậu đi dạo phố!”', { love: +12, mood: +20, energy: -10 }, 'Khẳng định lời hứa chân thành');
        createDialogueChoice('“Cậu mà đỗ thủ khoa thì tớ cũng phải bám sát chứ sao bỏ rơi Mẫn được!”', { love: +10, study: +4, mood: +15, energy: -10 }, 'Vừa ngọt ngào vừa nhắc nhở mục tiêu học tập');
      } else {
        speechEl.textContent = '“Mấy hôm nay tớ cứ nghĩ hoài về ngày bế giảng... Cảm ơn cậu vì đã luôn đồng hành cùng tớ suốt những ngày tháng cấp 3 rực rỡ nhất.”';
        createDialogueChoice('Khẽ nắm nhẹ tay Triệu Mẫn: “Thanh xuân của tớ đẹp nhất là vì có cậu xuất hiện.”', { love: +15, mood: +30, energy: -5 }, 'Cái nắm tay ấm áp dưới bóng cây bàng');
        createDialogueChoice('“Sau lễ tốt nghiệp, hãy đi dạo cùng tớ nhé!”', { love: +12, mood: +25, energy: -5 }, 'Hẹn ước một buổi hẹn hò trọn vẹn');
      }
    }

    function createDialogueChoice(text, changes, eventNote) {
      const container = document.getElementById('dialogueChoices');
      const btn = document.createElement('button');
      btn.className = 'w-full p-2.5 bg-slate-800 hover:bg-pink-950/60 rounded-xl border border-pink-700/60 hover:border-pink-400 text-left text-xs font-semibold text-slate-100 transition active:scale-95 flex items-center justify-between';
      btn.innerHTML = `<span>💬 ${text}</span> <span class="text-pink-400 font-mono text-[10px] shrink-0 ml-2">Tương tác</span>`;
      btn.onclick = () => {
        modifyStats(changes);
        STATE.todayEvents.push(eventNote + ' cùng Triệu Mẫn.');
        audio.playSuccess();
        closeOverlayCard();
        advanceTime();
      };
      container.appendChild(btn);
    }

    /* =============================================================
       7. BOSS FIGHT HỌC ĐƯỜNG: THI KHẢO SÁT CHẤT LƯỢNG ĐẾM NGƯỢC
       ============================================================= */
    let bossState = {
      active: false,
      timer: 15,
      intervalId: null,
      questionList: [],
      currentIndex: 0,
      score: 0
    };

    function checkAndTriggerExamDay() {
      // Thi khảo sát định kỳ vào ngày 15 và ngày 30
      if (STATE.day === 15 || STATE.day === 30) {
        startBossExamFight();
        return true;
      }
      return false;
    }

    function startBossExamFight() {
      bossState.active = true;
      bossState.score = 0;
      bossState.currentIndex = 0;
      bossState.questionList = [...QUIZ_BANK].sort(() => 0.5 - Math.random()).slice(0, 3);

      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const card = document.getElementById('bossFightCard');
      card.classList.remove('hidden');

      audio.playTone(250, 'sawtooth', 0.4);
      loadNextBossQuestion();
    }

    function loadNextBossQuestion() {
      if (bossState.currentIndex >= 3) {
        finishBossExam();
        return;
      }

      clearInterval(bossState.intervalId);
      bossState.timer = 15;
      updateBossTimerDisplay();

      const q = bossState.questionList[bossState.currentIndex];
      document.getElementById('bossQuestionIndex').textContent = `${bossState.currentIndex + 1}/3`;
      document.getElementById('bossScoreText').textContent = bossState.score;
      document.getElementById('bossQuestionText').textContent = `[${TEACHERS[q.subKey].subject}] ${q.q}`;

      const box = document.getElementById('bossOptionsContainer');
      box.innerHTML = '';
      q.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'p-2 bg-slate-900 hover:bg-red-950 border border-red-700/70 hover:border-red-400 rounded-lg text-xs font-medium text-slate-200 text-left transition';
        btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
        btn.onclick = () => answerBossQuestion(idx === q.c);
        box.appendChild(btn);
      });

      bossState.intervalId = setInterval(() => {
        bossState.timer--;
        updateBossTimerDisplay();
        if (bossState.timer <= 0) {
          clearInterval(bossState.intervalId);
          answerBossQuestion(false, true);
        }
      }, 1000);
    }

    function updateBossTimerDisplay() {
      const el = document.getElementById('bossTimer');
      el.textContent = `⏱️ ${bossState.timer}s`;
      if (bossState.timer <= 5) {
        el.className = 'text-rose-400 font-mono font-bold text-sm bg-red-950 px-2 py-0.5 rounded border border-rose-500 animate-pulse';
        audio.playTone(500, 'square', 0.05);
      } else {
        el.className = 'text-amber-400 font-mono font-bold text-sm bg-red-950 px-2 py-0.5 rounded border border-red-700';
      }
    }

    function answerBossQuestion(isCorrect, isTimeout = false) {
      clearInterval(bossState.intervalId);
      if (isCorrect) {
        bossState.score++;
        audio.playSuccess();
        showStatAlert('🎯 Câu trả lời chính xác!', 'text-emerald-400');
      } else {
        audio.playWrong();
        showStatAlert(isTimeout ? '⏰ Hết giờ làm bài!' : '❌ Chưa chính xác!', 'text-rose-400');
      }
      bossState.currentIndex++;
      setTimeout(loadNextBossQuestion, 500);
    }

    function finishBossExam() {
      bossState.active = false;
      document.getElementById('bossFightCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');

      if (bossState.score >= 2) {
        modifyStats({ study: +20, reputation: +15, mood: +15, money: +40000 });
        audio.playSuccess();
        alert(`🎉 XUẤT SẮC! Bạn đạt ${bossState.score}/3 điểm trong Kỳ Thi Khảo Sát!\nThầy hiệu trưởng tuyên dương trước toàn trường. Nhận học bổng +40.000đ & +20 Điểm học tập!`);
        STATE.todayEvents.push(`Hoàn thành xuất sắc kỳ thi khảo sát chất lượng với điểm số ấn tượng (${bossState.score}/3 câu đúng), cả lớp 12A3 vỗ tay thán phục.`);
      } else {
        modifyStats({ study: +8, mood: -10 });
        audio.playWrong();
        alert(`😢 Kết quả chưa như ý: Bạn đúng ${bossState.score}/3 câu.\nCần nỗ lực cày đề nhiều hơn ở thư viện nhé!`);
        STATE.todayEvents.push(`Kỳ thi khảo sát vừa qua hơi chông gai, chỉ làm đúng được ${bossState.score}/3 câu. Tự nhủ phải cố gắng cày cuốc bù lại.`);
      }
      advanceTime();
    }

    /* =============================================================
       8. SỰ KIỆN NGẪU NHIÊN KHI CHUYỂN BUỔI (RANDOM EVENTS)
       ============================================================= */
    function checkRandomEvent() {
      if (Math.random() > 0.22) return; // Tỉ lệ 22%

      const events = [
        {
          name: 'Cơn mưa rào đầu hạ',
          text: 'Trời bất chợt đổ cơn mưa rào mùa hạ. Triệu Mẫn quên mang ô đứng nép dưới mái hiên. Bạn chạy tới che chung chiếc ô hoa nhỏ.',
          effect: () => modifyStats({ love: +8, mood: +15 }),
          log: 'Che chung ô với Triệu Mẫn dưới cơn mưa rào bất chợt, mùi hương nhài thanh khiết vương mãi trên vai áo.'
        },
        {
          name: 'Kiểm tra 15 phút đột xuất',
          text: 'Thầy Tuấn bước vào lớp với xấp đề kiểm tra 15 phút Lý bất ngờ! May mắn bạn vừa ôn lại bài tối qua.',
          effect: () => modifyStats({ study: +6, energy: -10 }),
          log: 'Bị dính bài kiểm tra 15 phút bất ngờ nhưng xử lý trót lọt.'
        },
        {
          name: 'Mẹ thưởng tiền tiêu vặt',
          text: 'Mẹ thấy bạn dạo này chăm chỉ học hành ôn thi nên thưởng thêm tiền ăn sáng.',
          effect: () => modifyStats({ money: +30000, mood: +10 }),
          log: 'Được mẹ khen ngợi và cho thêm 30.000đ tiền tiêu vặt.'
        },
        {
          name: 'Trận bóng rổ nảy lửa',
          text: 'Tuấn rủ bạn ra ném bóng ăn chè đậu đỏ. Cả đám hò reo vui vẻ làm tan biến áp lực học tập.',
          effect: () => modifyStats({ friends: +10, hp: +5, energy: -15 }),
          log: 'Làm một trận bóng rổ nảy lửa với Tuấn dưới sân trường rực nắng.'
        }
      ];

      const ev = events[Math.floor(Math.random() * events.length)];
      ev.effect();
      audio.playTone(600, 'sine', 0.2);
      showStatAlert(`✨ Sự kiện: ${ev.name}`, 'text-amber-300');
      STATE.todayEvents.push(ev.log);
    }

    /* =============================================================
       9. ĐIỀU HƯỚNG ĐỊA ĐIỂM & GIAO DIỆN
       ============================================================= */
    function gotoLocation(loc) {
      if (STATE.isGameOver) return;
      STATE.location = loc;
      closeOverlayCard();
      audio.playTone(320, 'sine', 0.08);

      const titleEl = document.getElementById('locTitle');
      const iconEl = document.getElementById('locIcon');
      const descEl = document.getElementById('sceneNarrative');

      // Update Active Navigation Tab Buttons
      LOCATIONS_LIST.forEach(l => {
        const btn = document.getElementById(`nav_${l}`);
        if (!btn) return;
        if (l === loc) {
          btn.className = 'loc-btn flex-1 py-1.5 px-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold transition flex items-center justify-center gap-1 shadow-inner';
        } else {
          btn.className = 'loc-btn flex-1 py-1.5 px-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1';
        }
      });

      if (loc === 'class') {
        titleEl.textContent = 'LỚP 12A3 - KHỐI CHUYÊN';
        iconEl.textContent = '🏫';
        descEl.textContent = 'Bảng phấn, ghế gỗ quen thuộc. Tiếng giảng bài của thầy cô vang vọng bên tai.';
      } else if (loc === 'canteen') {
        titleEl.textContent = 'CĂN TIN TRƯỜNG - CÔ NĂM';
        iconEl.textContent = '🍜';
        descEl.textContent = 'Mùi thơm nức mũi của bánh tráng trộn sa tế, bắp xào và tiếng gọi nhau í ới của học sinh.';
        openCanteenMenu();
      } else if (loc === 'library') {
        titleEl.textContent = 'THƯ VIỆN YÊN TĨNH';
        iconEl.textContent = '📚';
        descEl.textContent = 'Không gian tĩnh lặng ngập tràn sách vở. Nơi lý tưởng để cày đề thi đại học.';
      } else if (loc === 'yard') {
        titleEl.textContent = 'SÂN TRƯỜNG & CÂY BÀNG';
        iconEl.textContent = '🌿';
        descEl.textContent = 'Gió thổi mát rượi dưới bóng cây bàng lá đỏ. Nơi tụ tập trò chuyện lý tưởng.';
      } else if (loc === 'job') {
        titleEl.textContent = 'KHU VỰC LÀM THÊM HỌC ĐƯỜNG';
        iconEl.textContent = '💼';
        descEl.textContent = 'Cơ hội kiếm thêm thu nhập chân chính từ chính đôi bàn tay và trí óc của mình.';
        openJobMenu();
      } else if (loc === 'home') {
        titleEl.textContent = 'PHÒNG NGỦ & BÀN HỌC Ở NHÀ';
        iconEl.textContent = '🏠';
        descEl.textContent = 'Góc học tập ấm cúng. Nơi bạn có thể tự học khuya hoặc leo lên giường ngủ nạp lại năng lượng.';
      }
      updateHUD();
    }

    function navigateDpad(direction) {
      if (STATE.isGameOver) return;
      let curIdx = LOCATIONS_LIST.indexOf(STATE.location);
      curIdx = (curIdx + direction + LOCATIONS_LIST.length) % LOCATIONS_LIST.length;
      gotoLocation(LOCATIONS_LIST[curIdx]);
    }

    /* =============================================================
       10. HỆ THỐNG LỚP HỌC & TRẮC NGHIỆM TỰ ĐỘNG THEO TIẾT
       ============================================================= */
    function startClassroomLesson() {
      if (STATE.isGameOver) return;
      if (STATE.stats.energy < 15) {
        showStatAlert('⚠️ Bạn quá kiệt sức! Hãy ăn vặt hoặc đi ngủ nạp năng lượng.', 'text-rose-400');
        audio.playWrong();
        return;
      }

      // Lựa chọn câu hỏi theo phân phối ngẫu nhiên đa dạng môn
      const q = QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)];
      const t = TEACHERS[q.subKey];

      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const quizCard = document.getElementById('classroomQuizCard');
      quizCard.classList.remove('hidden');

      document.getElementById('quizSubjectBadge').textContent = `MÔN ${t.subject}`;
      document.getElementById('quizTeacherName').textContent = t.name;
      document.getElementById('quizTeacherAvatar').textContent = t.avatar;
      document.getElementById('quizTeacherQuestion').textContent = q.q;

      const optsBox = document.getElementById('quizOptionsContainer');
      optsBox.innerHTML = '';

      q.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-left text-xs font-semibold text-slate-200 transition active:scale-95 flex items-center gap-1.5';
        btn.innerHTML = `<span class="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-amber-400 font-bold shrink-0">${String.fromCharCode(65 + idx)}</span> <span class="truncate">${opt}</span>`;
        btn.onclick = () => answerQuiz(q, idx);
        optsBox.appendChild(btn);
      });
    }

    function answerQuiz(q, selectedIdx) {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');

      if (selectedIdx === q.c) {
        modifyStats({ study: +8, mood: +5, energy: -15, reputation: +4 });
        audio.playSuccess();
        alert(q.rOk);
        showStatAlert('🎉 Trả lời xuất sắc! (+8 📚, +5 😊)', 'text-emerald-400');
        STATE.todayEvents.push(`Tự tin đứng lên trả lời đúng câu hỏi môn ${TEACHERS[q.subKey].subject} của ${TEACHERS[q.subKey].name}.`);
      } else {
        modifyStats({ study: +2, mood: -6, energy: -15 });
        audio.playWrong();
        alert(q.rFail);
        showStatAlert('😭 Gà! (+2 📚, -6 😊)', 'text-rose-400');
        STATE.todayEvents.push(`Bị lúng túng khi giải câu hỏi môn ${TEACHERS[q.subKey].subject} của ${TEACHERS[q.subKey].name}, tự nhủ phải ôn lại.`);
      }
      advanceTime();
    }

    document.getElementById('btnSkipClass')?.addEventListener('click', () => {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');
      modifyStats({ energy: +10, study: -5, reputation: -3, hp: -2 });
      audio.playTone(180, 'sawtooth', 0.2);
      showStatAlert('😴 Ngủ gật trong giờ! (+10 ⚡, -5 📚)', 'text-amber-400');
      STATE.todayEvents.push('Gục đầu xuống bàn ngủ say sưa suốt tiết học, may mắn không bị ghi vào sổ đầu bài.');
      advanceTime();
    });

    /* =============================================================
       11. CĂN TIN MENU 20+ MÓN
       ============================================================= */
    function openCanteenMenu() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const c = document.getElementById('canteenMenuCard');
      c.classList.remove('hidden');

      const list = document.getElementById('canteenItemsList');
      list.innerHTML = '';
      CANTEEN_MENU.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/40 transition';
        div.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-xl shrink-0">${item.icon}</span>
            <div>
              <div class="font-bold text-slate-200">${item.name}</div>
              <div class="text-[10px] text-slate-400 leading-tight">${item.desc}</div>
              <div class="text-[10px] font-mono mt-0.5 text-emerald-400 font-bold">Giá: ${item.cost.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
          <button class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] shrink-0 ml-2" onclick="buyCanteenItem('${item.id}')">
            Mua Ăn
          </button>
        `;
        list.appendChild(div);
      });
    }

    function buyCanteenItem(itemId) {
      const item = CANTEEN_MENU.find(f => f.id === itemId);
      if (!item) return;

      if (STATE.stats.money < item.cost) {
        showStatAlert('💸 Ví hết tiền rồi, ráng đi làm thêm kiếm nhé!', 'text-rose-400');
        audio.playWrong();
        return;
      }

      modifyStats({
        money: -item.cost,
        energy: item.energy,
        mood: item.mood,
        hp: item.hp,
        love: item.love || 0
      });

      audio.playSuccess();
      if (item.love > 0) {
        showStatAlert(`💖 Triệu Mẫn cười tít mắt nhận món ngon! (+${item.love}% 💕)`, 'text-pink-400');
        STATE.todayEvents.push(`Bao Triệu Mẫn ăn ${item.name} tại căn tin. Nhìn Mẫn ăn ngon miệng mà lòng mình vui rộn rã.`);
      } else {
        showStatAlert(`😋 Thưởng thức ${item.name}! (+${item.energy} ⚡, +${item.mood} 😊)`, 'text-emerald-400');
        STATE.todayEvents.push(`Ghé căn tin làm một phần ${item.name} thơm lừng nạp lại tinh thần.`);
      }
      advanceTime();
    }

    /* =============================================================
       12. KHU VỰC LÀM THÊM (PART-TIME JOBS)
       ============================================================= */
    function openJobMenu() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const jc = document.getElementById('jobMenuCard');
      jc.classList.remove('hidden');

      const list = document.getElementById('jobItemsList');
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
          <button class="px-3 py-1.5 ${canDo ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} font-bold rounded-lg text-[11px] shrink-0" onclick="${canDo ? `performJob('${job.id}')` : `alert('Bạn chưa đủ điều kiện: ${job.reqDesc}')`}">
            Làm Việc
          </button>
        `;
        list.appendChild(div);
      });
    }

    function performJob(jobId) {
      const job = PART_TIME_JOBS.find(j => j.id === jobId);
      if (!job) return;

      if (STATE.stats.energy < job.energyCost) {
        showStatAlert('⚠️ Bạn quá kiệt sức, không thể làm thêm nổi!', 'text-rose-400');
        audio.playWrong();
        return;
      }

      modifyStats({
        money: job.salary,
        energy: -job.energyCost,
        hp: -job.hpCost,
        skill: job.skillGain,
        mood: -4
      });

      audio.playSuccess();
      showStatAlert(`💰 Nhận lương +${job.salary.toLocaleString('vi-VN')}đ! (+${job.skillGain} 🧠)`, 'text-emerald-400');
      STATE.todayEvents.push(job.diaryMsg);
      advanceTime();
    }

    /* =============================================================
       13. TƯƠNG TÁC NPC (LAN, CRUSH, TUẤN)
       ============================================================= */
    function interactNPC(who) {
      if (STATE.isGameOver) return;
      audio.playTone(450, 'triangle', 0.1);

      if (who === 'crush') {
        openCrushDialogue();
      } else if (who === 'lan') {
        if (STATE.stats.energy < 10) { showStatAlert('Hết năng lượng để tám chuyện!', 'text-amber-400'); return; }
        modifyStats({ energy: -10, mood: +15, friends: +8, study: +4 });
        showStatAlert('👧 Tám chuyện và chép bài cùng Lan (+8 👥, +4 📚)', 'text-sky-400');
        STATE.todayEvents.push('Ngồi đối chiếu bài tập với cô bạn thân Lan, hai đứa vừa học vừa cười rúc rích.');
        advanceTime();
      } else if (who === 'tuan') {
        if (STATE.stats.energy < 18) { showStatAlert('Không đủ sức để ném bóng rổ!', 'text-amber-400'); return; }
        modifyStats({ energy: -18, hp: +8, mood: +12, friends: +8 });
        showStatAlert('🏀 Làm một ván bóng rổ với Tuấn (+8 ❤️, +12 😊)', 'text-amber-400');
        STATE.todayEvents.push('Cùng Tuấn ném bóng rổ dưới sân trường toát mồ hôi nhưng giải tỏa căng thẳng cực đã.');
        advanceTime();
      }
    }

    /* =============================================================
       14. TIẾN TRÌNH THỜI GIAN & NHẬT KÝ TỰ SINH
       ============================================================= */
    function modifyStats(changes) {
      const s = STATE.stats;
      if (changes.hp !== undefined) s.hp = Math.max(0, Math.min(100, s.hp + changes.hp));
      if (changes.energy !== undefined) s.energy = Math.max(0, Math.min(100, s.energy + changes.energy));
      if (changes.mood !== undefined) s.mood = Math.max(0, Math.min(100, s.mood + changes.mood));
      if (changes.study !== undefined) s.study = Math.max(0, s.study + changes.study);
      if (changes.friends !== undefined) s.friends = Math.max(0, Math.min(100, s.friends + changes.friends));
      if (changes.love !== undefined) s.love = Math.max(0, Math.min(100, s.love + changes.love));
      if (changes.reputation !== undefined) s.reputation = Math.max(0, Math.min(100, s.reputation + changes.reputation));
      if (changes.skill !== undefined) s.skill = Math.max(0, Math.min(100, s.skill + changes.skill));
      if (changes.money !== undefined) s.money = Math.max(0, s.money + changes.money);
      updateHUD();
      saveGame();
    }

    function advanceTime() {
      if (STATE.isGameOver) return;
      STATE.timeIndex++;
      checkRandomEvent();

      if (STATE.timeIndex >= TIME_PERIODS.length) {
        triggerEndOfDayDiary();
      } else {
        updateHUD();
      }
    }

    function quickSleep() {
      if (STATE.isGameOver) return;
      if (confirm('Bạn có muốn đi ngủ sớm để kết thúc ngày hôm nay và viết nhật ký?')) {
        triggerEndOfDayDiary();
      }
    }

    function triggerEndOfDayDiary() {
      audio.playBell();
      closeOverlayCard();

      // Hồi phục ngày mới
      STATE.stats.energy = 100;
      STATE.stats.money += 25000; // Tiền ăn sáng mẹ cho

      // Tự sinh nội dung nhật ký
      let diaryStory = [];
      diaryStory.push(`Hôm nay là Ngày thứ ${STATE.day} của năm lớp 12.`);

      if (STATE.todayEvents.length > 0) {
        diaryStory.push(STATE.todayEvents.join(' '));
      } else {
        diaryStory.push('Một ngày học trôi qua thật êm ả, chỉ có tiếng ve kêu và gió thổi lay tà áo trắng trên hiên lớp.');
      }

      // Đúc kết tâm trạng & tình cảm
      if (STATE.stats.love >= 75) {
        diaryStory.push('Hình bóng Triệu Mẫn cứ quẩn quanh mãi trong tâm trí mình. Cảm giác hai đứa bây giờ không chỉ đơn thuần là bạn cùng bàn nữa rồi... 💕');
      } else if (STATE.stats.study >= 90) {
        diaryStory.push('Kiến thức các môn khối tự nhiên đã vững vàng. Mục tiêu chạm tay vào danh hiệu Thủ khoa THPT Thanh Xuân đang ở rất gần! 📚');
      } else if (STATE.stats.energy <= 25) {
        diaryStory.push('Hôm nay đi làm thêm và học bài mệt rã rời tay chân, nhưng nghĩ đến tương lai lại thấy có thêm động lực cố gắng.');
      }

      const fullDiaryText = diaryStory.join('\n\n');
      STATE.diaryEntries.push({ day: STATE.day, text: fullDiaryText });
      STATE.todayEvents = [];

      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const diaryCard = document.getElementById('diaryModalCard');
      diaryCard.classList.remove('hidden');

      document.getElementById('diaryTitle').textContent = `NHẬT KÝ — NGÀY ${STATE.day}`;
      document.getElementById('diaryContentText').innerText = fullDiaryText;
      document.getElementById('diaryForecastNextDay').textContent = `Ngày ${STATE.day + 1}: ${(STATE.day + 1 === 15 || STATE.day + 1 === 30) ? 'KỲ THI KHẢO SÁT CHẤT LƯỢNG!' : 'Lịch học bình thường'}`;

      document.getElementById('btnContinueFromDiary').onclick = () => {
        closeOverlayCard();
        STATE.day++;
        STATE.timeIndex = 0;
        gotoLocation('class');

        if (STATE.day > STATE.totalDays) {
          triggerGraduationEnding();
        } else {
          checkAndTriggerExamDay();
        }
      };
    }

    function openDiaryManual() {
      closeOverlayCard();
      const diaryCard = document.getElementById('diaryModalCard');
      diaryCard.classList.remove('hidden');
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');

      const latest = STATE.diaryEntries[STATE.diaryEntries.length - 1];
      document.getElementById('diaryTitle').textContent = `NHẬT KÝ ĐÃ LƯU (NGÀY ${latest ? latest.day : STATE.day})`;
      document.getElementById('diaryContentText').innerText = latest ? latest.text : 'Chưa có trang nhật ký nào. Hãy hoàn thành ngày học đầu tiên!';
      document.getElementById('btnContinueFromDiary').onclick = () => closeOverlayCard();
    }

    /* =============================================================
       15. ĐA KẾT THÚC (7+ ENDINGS) & KHÓA GAME OVER
       ============================================================= */
    function triggerGraduationEnding() {
      STATE.isGameOver = true;
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const endCard = document.getElementById('endingScreenCard');
      endCard.classList.remove('hidden');
      audio.playSuccess();

      let title = '', sub = '', desc = '';
      const s = STATE.stats;

      if (s.study >= 95) {
        title = '🏆 HỌC BÁ TOÀN NĂNG - THỦ KHOA ĐẠI HỌC';
        sub = 'Vinh quang rực rỡ nơi giảng đường danh giá';
        desc = 'Với điểm số học tập kỷ lục, bạn chính thức trở thành Thủ khoa toàn trường THPT Thanh Xuân! Tên bạn được vinh danh trên bảng vàng truyền thống, thầy cô tự hào, bạn bè khâm phục.';
      } else if (s.love >= 85) {
        title = '💕 NẮM TAY TRIỆU MẪN DƯỚI MƯA HOA';
        sub = 'Lời hẹn ước ngọt ngào của mối tình đầu';
        desc = 'Trong buổi lễ bế giảng ngập tràn hoa phượng đỏ, bạn đã lấy hết dũng khí nắm tay Triệu Mẫn. Nụ cười hạnh phúc cùng cái gật đầu của Mẫn chính là cái kết thanh xuân đẹp đẽ nhất trần đời.';
      } else if (s.money >= 350000) {
        title = '💼 TỔNG TÀI KHỞI NGHIỆP TUỔI 18';
        sub = 'Tự chủ tài chính ngay khi rời ghế nhà trường';
        desc = 'Nhờ óc kinh doanh nhạy bén, chăm chỉ làm thêm và quản lý chi tiêu xuất sắc, bạn đã tích lũy số vốn đáng nể để cùng bạn bè khởi nghiệp ngay sau khi tốt nghiệp cấp 3!';
      } else if (s.skill >= 75) {
        title = '🌟 THỦ LĨNH THANH NIÊN XUẤT SẮC';
        sub = 'Người dẫn dắt phong trào học đường';
        desc = 'Kỹ năng mềm điêu luyện, vừa học giỏi vừa hoạt động phong trào sôi nổi. Bạn là người truyền cảm hứng cho hàng trăm học sinh khóa dưới!';
      } else if (s.friends >= 85) {
        title = '👥 TÌNH BẠN BẤT DIỆT LỚP 12A3';
        sub = 'Kỷ niệm khó phai suốt một thời áo trắng';
        desc = 'Dù mai này mỗi đứa một phương trời, nhưng cuốn lưu bút đầy ắp chữ ký và những buổi chiều ăn vặt cùng Lan, Tuấn, Mẫn sẽ mãi mãi là hành trang vô giá.';
      } else if (s.hp <= 30 && s.study <= 45) {
        title = '😴 HUYỀN THOẠI NGỦ GỤC TRONG GIỜ';
        sub = 'Kỷ lục ngủ từ tiết 1 đến tiết 5';
        desc = 'Dù điểm số không quá cao nhưng bạn luôn là cây hài số 1 của lớp 12A3. Kỷ niệm về những lần ngủ gật bị thầy cô gọi lên bảng sẽ được nhắc lại trong mọi buổi họp lớp!';
      } else {
        title = '🌸 THANH XUÂN RỰC RỠ TRỌN VẸN';
        sub = 'Thời áo trắng bình yên và đáng nhớ';
        desc = 'Bạn đã cân bằng tuyệt vời giữa việc học tập, kết bạn, kiếm tiền tiêu vặt và tận hưởng từng phút giây của tuổi học trò. Một thanh xuân trọn vẹn không hề có chút nuối tiếc!';
      }

      document.getElementById('endingTitle').textContent = title;
      document.getElementById('endingSubtitle').textContent = sub;
      document.getElementById('endingDescription').textContent = desc;

      document.getElementById('endStatStudy').textContent = s.study;
      document.getElementById('endStatLove').textContent = `${s.love}%`;
      document.getElementById('endStatFriends').textContent = s.friends;
      document.getElementById('endStatMoney').textContent = `${s.money.toLocaleString('vi-VN')}đ`;
    }

    function restartGame() {
      localStorage.removeItem('thanh_xuan_jrpg_save');
      location.reload();
    }

    /* =============================================================
       16. TOGGLE DRAWER HOẠT ĐỘNG, TIN NHẮN, TÚI ĐỒ & BẠN BÈ
       ============================================================= */
    let currentOpenTab = null;

    function toggleTabAction(tab) {
      if (STATE.isGameOver) return;
      const drawer = document.getElementById('actionDrawerPanel');
      if (currentOpenTab === tab && !drawer.classList.contains('hidden')) {
        closeDrawer();
        return;
      }
      currentOpenTab = tab;
      const title = document.getElementById('drawerTitle');
      const content = document.getElementById('drawerContent');
      drawer.classList.remove('hidden');

      if (tab === 'study') {
        title.textContent = '📖 HOẠT ĐỘNG HỌC TẬP & CÀY ĐỀ';
        content.innerHTML = `
          <div class="space-y-2">
            <button onclick="startClassroomLesson()" class="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
              <span>✍️ Trả lời câu hỏi giáo viên đứng lớp</span>
              <span class="text-amber-400 font-mono">-15 ⚡</span>
            </button>
            <button onclick="selfStudyLibrary()" class="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
              <span>📚 Tự học cày đề tại thư viện (+12 📚, -20 ⚡)</span>
              <span class="text-sky-400 font-mono">Tự học</span>
            </button>
          </div>
        `;
      } else if (tab === 'friends') {
        title.textContent = '👥 DANH SÁCH BẠN BÈ LỚP 12A3';
        content.innerHTML = `
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2 bg-slate-800 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>👧</span><div><b>Lan</b> <span class="text-[10px] text-slate-400">Bạn thân chép bài</span></div></div>
              <button onclick="interactNPC('lan')" class="px-2.5 py-1 bg-sky-600 rounded text-[11px] font-bold">Rủ học chung</button>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-800 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>💕</span><div><b>Triệu Mẫn</b> <span class="text-[10px] text-pink-400">Crush xinh xắn</span></div></div>
              <button onclick="interactNPC('crush')" class="px-2.5 py-1 bg-pink-600 rounded text-[11px] font-bold">Trò chuyện</button>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-800 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>🏀</span><div><b>Tuấn</b> <span class="text-[10px] text-amber-400">Bóng rổ</span></div></div>
              <button onclick="interactNPC('tuan')" class="px-2.5 py-1 bg-amber-600 rounded text-[11px] font-bold">Ném bóng</button>
            </div>
          </div>
        `;
      } else if (tab === 'chat') {
        title.textContent = '💬 HỘP THƯ TIN NHẮN SMS';
        const aff = getCrushAffinityLevel(STATE.stats.love);
        let crushMsg = '“Hôm nay làm bài kiểm tra Toán được không đó đồ ngốc? Mai nhớ mua trà sữa cho tớ nhé! 😉”';
        if (aff.stage >= 3) crushMsg = '“Tối nay cậu học bài muộn thế? Nhớ giữ gìn sức khỏe đấy, mai tớ mang kẹo dâu cho cậu nhé! 💕”';
        content.innerHTML = `
          <div class="space-y-2 text-[11px]">
            <div class="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <b class="text-pink-300">Triệu Mẫn:</b> ${crushMsg}
            </div>
            <div class="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <b class="text-sky-300">Lan:</b> "Mai nhớ mang vở Văn cho tao mượn chép bài đấy nhé con heo!"
            </div>
          </div>
        `;
      } else if (tab === 'bag') {
        title.textContent = '🎒 TÚI ĐỒ HỌC SINH';
        content.innerHTML = STATE.bag.map(item => `
          <div class="p-2 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
            <div class="flex items-center gap-2">
              <span class="text-xl">${item.icon}</span>
              <div>
                <b>${item.name}</b> (x${item.count})
                <p class="text-[10px] text-slate-400">${item.desc}</p>
              </div>
            </div>
            <button onclick="useItem('${item.id}')" class="px-2.5 py-1 bg-emerald-600 rounded text-[11px] font-bold">Dùng</button>
          </div>
        `).join('');
      }
    }

    function selfStudyLibrary() {
      if (STATE.stats.energy < 20) { showStatAlert('Bạn quá kiệt sức để cày đề!', 'text-rose-400'); return; }
      modifyStats({ study: +12, energy: -20, mood: -4 });
      audio.playTone(520, 'sine', 0.15);
      showStatAlert('📚 Giải xong 1 đề thi thử đại học! (+12 📚, -20 ⚡)', 'text-sky-400');
      STATE.todayEvents.push('Ngồi yên tĩnh trong thư viện giải xong trọn vẹn một đề thi thử đại học.');
      advanceTime();
    }

    function useItem(itemId) {
      const it = STATE.bag.find(b => b.id === itemId);
      if (!it || it.count <= 0) return;
      it.count--;
      if (itemId === 'math_note') {
        modifyStats({ study: +8 });
        showStatAlert('📘 Đọc sổ tay công thức Toán! (+8 📚)', 'text-sky-400');
      } else if (itemId === 'gift_strawberry') {
        modifyStats({ love: +8, mood: +10 });
        showStatAlert('🍬 Tặng kẹo dâu cho Triệu Mẫn! (+8% 💕)', 'text-pink-400');
      }
      toggleTabAction('bag');
    }

    function closeDrawer() {
      document.getElementById('actionDrawerPanel').classList.add('hidden');
      currentOpenTab = null;
    }

    function closeOverlayCard() {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('canteenMenuCard').classList.add('hidden');
      document.getElementById('jobMenuCard').classList.add('hidden');
      document.getElementById('dialogueCard').classList.add('hidden');
      document.getElementById('bossFightCard').classList.add('hidden');
      document.getElementById('diaryModalCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');
      closeDrawer();
    }

    /* =============================================================
       17. CẬP NHẬT HUD & STORAGE
       ============================================================= */
    function updateHUD() {
      const curPeriod = TIME_PERIODS[STATE.timeIndex] || TIME_PERIODS[0];
      const dayOfWeekIdx = (STATE.day - 1) % 7;

      document.getElementById('uiDayOfWeek').textContent = DAYS_OF_WEEK[dayOfWeekIdx];
      document.getElementById('uiTimeText').textContent = curPeriod.text;
      document.getElementById('uiCurrentPeriodText').textContent = curPeriod.name;
      document.getElementById('uiDayCount').textContent = STATE.day;

      document.getElementById('statHp').textContent = STATE.stats.hp;
      document.getElementById('statEnergy').textContent = STATE.stats.energy;
      document.getElementById('statMood').textContent = STATE.stats.mood;
      document.getElementById('statStudy').textContent = STATE.stats.study;
      document.getElementById('statLove').textContent = `${STATE.stats.love}%`;
      document.getElementById('statSkill').textContent = STATE.stats.skill;
      document.getElementById('statMoney').textContent = `${STATE.stats.money.toLocaleString('vi-VN')}đ`;

      const aff = getCrushAffinityLevel(STATE.stats.love);
      const nameBadge = document.getElementById('crushNameBadge');
      if (nameBadge) nameBadge.textContent = `${aff.title}`;
    }

    function showStatAlert(text, colorClass = 'text-emerald-400') {
      const box = document.getElementById('statAlertBox');
      box.textContent = text;
      box.className = `text-[11px] font-mono font-bold ${colorClass} opacity-100 transition-opacity duration-200 bg-black/85 px-2.5 py-1 rounded border border-slate-700`;
      setTimeout(() => {
        box.classList.remove('opacity-100');
        box.classList.add('opacity-0');
      }, 3000);
    }

    function saveGame() {
      try {
        localStorage.setItem('thanh_xuan_jrpg_save', JSON.stringify(STATE));
        const status = document.getElementById('saveStatus');
        if (status) status.textContent = 'AUTO-SAVED';
      } catch (e) {}
    }

    function manualSaveGame() {
      try {
        localStorage.setItem('thanh_xuan_jrpg_save', JSON.stringify(STATE));
        audio.playSuccess();
        const d = new Date();
        const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
        const status = document.getElementById('saveStatus');
        if (status) status.textContent = `ĐÃ LƯU (${timeStr})`;
        showStatAlert(`💾 Đã lưu tiến trình thành công lúc ${timeStr}!`, 'text-emerald-400');
      } catch (e) {
        showStatAlert('❌ Không thể lưu vào bộ nhớ trình duyệt!', 'text-rose-400');
      }
    }

    function manualLoadGame() {
      try {
        const raw = localStorage.getItem('thanh_xuan_jrpg_save');
        if (raw) {
          const parsed = JSON.parse(raw);
          Object.assign(STATE, parsed);
          audio.playSuccess();
          updateHUD();
          gotoLocation(STATE.location || 'class');
          showStatAlert(`📂 Tải lại ngày ${STATE.day} thành công!`, 'text-sky-400');
        } else {
          showStatAlert('⚠️ Chưa có bản lưu nào trước đó!', 'text-amber-400');
          audio.playWrong();
        }
      } catch (e) {
        showStatAlert('❌ Lỗi khi đọc file lưu!', 'text-rose-400');
      }
    }

    function exportSaveFile() {
      try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(STATE, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `thanh_xuan_cap3_day${STATE.day}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showStatAlert('📤 Đã tải xuống file sao lưu!', 'text-emerald-400');
        audio.playSuccess();
      } catch (e) {
        showStatAlert('❌ Lỗi khi xuất file save!', 'text-rose-400');
      }
    }

    function importSaveFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported && imported.stats) {
            Object.assign(STATE, imported);
            saveGame();
            updateHUD();
            gotoLocation(STATE.location || 'class');
            audio.playSuccess();
            showStatAlert(`📥 Nhập dữ liệu Ngày ${STATE.day} thành công!`, 'text-emerald-400');
          }
        } catch (err) {
          showStatAlert('❌ Lỗi cú pháp file JSON!', 'text-rose-400');
        }
      };
      reader.readAsText(file);
    }

    function loadGame() {
      try {
        const raw = localStorage.getItem('thanh_xuan_jrpg_save');
        if (raw) {
          const parsed = JSON.parse(raw);
          Object.assign(STATE, parsed);
        }
      } catch (e) {}
    }

    document.getElementById('btnAudioToggle')?.addEventListener('click', (e) => {
      audio.enabled = !audio.enabled;
      e.target.textContent = audio.enabled ? '🔊 ÂM THANH' : '🔇 TẮT ÂM';
    });

    window.addEventListener('DOMContentLoaded', () => {
      loadGame();
      gotoLocation('class');
      updateHUD();
    });
  </script>
</body>
</html>
