<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanh Xuân Rực Rỡ: Nhật Ký Cấp 3 (JRPG Life Sim)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Be Vietnam Pro', sans-serif; user-select: none; }
    .font-pixel { font-family: 'Press Start 2P', monospace; }
    .font-vt { font-family: 'VT323', monospace; }

    /* Console Border & CRT Styling */
    .retro-console-frame {
      box-shadow: 0 0 0 4px #1e293b, 0 0 0 8px #334155, 0 15px 35px -5px rgba(0, 0, 0, 0.7);
    }
    .screen-bezel {
      background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
      box-shadow: inset 0 0 18px rgba(0,0,0,0.8);
    }
    .pixel-box {
      border: 3px solid #334155;
      box-shadow: 3px 3px 0px #0f172a;
    }
    .pixel-btn {
      border: 2px solid #475569;
      box-shadow: 2px 2px 0px #0f172a;
      transition: all 0.08s ease;
    }
    .pixel-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 0px 0px 0px #0f172a;
    }
    .dialogue-bubble {
      clip-path: polygon(0% 0%, 100% 0%, 100% 85%, 30px 85%, 20px 100%, 15px 85%, 0% 85%);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }

    @keyframes floatSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .floating-sprite { animation: floatSlow 2.5s ease-in-out infinite; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-2 sm:p-4 overflow-x-hidden">

  <!-- ============================================================== -->
  <!-- RETRO JRPG HANDHELD CONSOLE SHELL -->
  <!-- ============================================================== -->
  <div class="retro-console-frame bg-slate-900 border-4 border-slate-700 rounded-[32px] p-3 sm:p-5 w-full max-w-4xl flex flex-col relative shadow-2xl">
    
    <!-- CONSOLE TOP BRANDING -->
    <div class="flex items-center justify-between px-3 py-1 mb-2 border-b-2 border-slate-800 text-[10px] text-slate-400 font-pixel">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-amber-400">NINTENDO-BOY COLOR</span>
      </div>
      <div class="flex items-center gap-3">
        <button id="btnAudioToggle" class="hover:text-amber-300 transition">🔊 ÂM THANH</button>
        <span id="saveStatus" class="text-slate-500">AUTO-SAVED</span>
      </div>
    </div>

    <!-- MAIN SCREEN BEZEL -->
    <div class="screen-bezel rounded-2xl p-2 sm:p-4 border-4 border-slate-800 flex flex-col flex-1 relative overflow-hidden min-h-[580px]">

      <!-- ============================================================== -->
      <!-- TOP HUD: THỜI GIAN & CHỈ SỐ NHANH -->
      <!-- ============================================================== -->
      <header class="bg-slate-950/90 pixel-box rounded-xl p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-base" id="uiWeatherIcon">☀️</span>
          <div>
            <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span id="uiDayOfWeek">THỨ HAI</span>
              <span>-</span>
              <span id="uiTimeText" class="font-mono text-emerald-400">07:30</span>
              <span class="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-normal font-mono">NGÀY <b id="uiDayCount">1</b>/45</span>
            </div>
            <div id="uiCurrentPeriodText" class="text-[10px] text-slate-400 font-medium">Buổi sáng • Tiết 1</div>
          </div>
        </div>

        <!-- 8 CHỈ SỐ SỐNG CÒN CỦA ĐỜI HỌC SINH -->
        <div class="flex items-center gap-2 sm:gap-3 flex-wrap font-mono text-[11px]">
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
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Tình Cảm Crush">
            <span>💕</span><span id="statLove" class="text-pink-400 font-bold">20</span>
          </div>
          <div class="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800" title="Tiền Tiêu Vặt">
            <span>💰</span><span id="statMoney" class="text-emerald-400 font-bold">50.000đ</span>
          </div>
        </div>
      </header>

      <!-- ============================================================== -->
      <!-- MAIN DISPLAY STAGE (JRPG SCENERY & INTERACTION) -->
      <!-- ============================================================== -->
      <section id="stageContainer" class="flex-1 flex flex-col justify-between relative bg-gradient-to-b from-sky-950/70 via-slate-900 to-slate-950 pixel-box rounded-xl p-3 sm:p-4 overflow-hidden min-h-[360px]">
        
        <!-- SCENERY TITLE BADGE -->
        <div class="flex items-center justify-between z-10">
          <div class="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-700/80 text-xs font-bold text-amber-300">
            <span id="locIcon">🏫</span>
            <span id="locTitle">TRƯỜNG THPT THANH XUÂN</span>
          </div>
          <div id="statAlertBox" class="text-[11px] font-mono font-bold text-emerald-400 opacity-0 transition-opacity duration-300 bg-black/70 px-2 py-0.5 rounded">
            +5 📚 Học tập
          </div>
        </div>

        <!-- DYNAMIC CENTER CANVAS / VISUAL VIEW -->
        <div id="centerViewArea" class="flex-1 flex flex-col items-center justify-center relative my-2">
          
          <!-- VIEW 1: SCENERY BACKGROUND WITH PIXEL AVATARS -->
          <div id="sceneryAvatarGroup" class="flex flex-col items-center justify-center gap-2 text-center w-full">
            <div class="flex items-center justify-center gap-6 sm:gap-10 my-2">
              <div class="text-center group cursor-pointer floating-sprite" onclick="interactNPC('lan')">
                <div class="text-4xl sm:text-5xl filter drop-shadow-md">👧</div>
                <span class="text-[10px] font-bold text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1 block">Lan (Bạn Thân)</span>
              </div>
              <div class="text-center group cursor-pointer floating-sprite" style="animation-delay: 0.5s;" onclick="interactNPC('crush')">
                <div class="text-4xl sm:text-5xl filter drop-shadow-md">🧑‍🤝‍🧑</div>
                <span class="text-[10px] font-bold text-pink-300 bg-slate-900/90 px-2 py-0.5 rounded border border-pink-700 mt-1 block">Mai Linh (Crush) 💕</span>
              </div>
              <div class="text-center group cursor-pointer floating-sprite" style="animation-delay: 1s;" onclick="interactNPC('tuan')">
                <div class="text-4xl sm:text-5xl filter drop-shadow-md">🏀</div>
                <span class="text-[10px] font-bold text-sky-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1 block">Tuấn (Bóng Rổ)</span>
              </div>
            </div>

            <!-- CLASSROOM NAMEPLATE -->
            <div class="bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black px-6 py-1.5 rounded-lg border-2 border-amber-300 text-xs sm:text-sm tracking-widest shadow-lg">
              LỚP 12A3 - KHỐI CHUYÊN
            </div>
            <p id="sceneNarrative" class="text-xs text-slate-300 max-w-md italic mt-1 px-4 leading-relaxed">
              "Tiếng ve râm ran đầu hạ, gió khẽ lay tà áo dài trắng bên hiên lớp. Hôm nay bạn sẽ dành thời gian học gạo hay đi ăn vặt cùng bạn bè?"
            </p>
          </div>

          <!-- VIEW 2: QUIZ / CLASSROOM INTERACTION CARD (TIẾT HỌC THỰC SỰ) -->
          <div id="classroomQuizCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-amber-400/80 rounded-2xl p-4 shadow-2xl flex flex-col space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span id="quizSubjectBadge" class="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[11px] rounded border border-amber-500/40">TIẾT TOÁN HỌC</span>
              <span class="text-xs text-slate-400 font-mono">Thầy Minh</span>
            </div>
            <div class="flex gap-3 items-start">
              <div class="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                👨‍🏫
              </div>
              <div class="text-xs text-slate-200">
                <p id="quizTeacherQuestion" class="font-semibold leading-relaxed">
                  "Nếu tam giác vuông có hai cạnh góc vuông là 3 và 4 thì độ dài cạnh huyền bằng bao nhiêu?"
                </p>
              </div>
            </div>

            <!-- 4 LỰA CHỌN TRẮC NGHIỆM -->
            <div id="quizOptionsContainer" class="grid grid-cols-2 gap-2 pt-1">
              <!-- Render động -->
            </div>

            <div class="flex justify-between items-center text-[10px] text-slate-400 pt-1">
              <span>⚡ Tốn 15 Năng Lượng</span>
              <button id="btnSkipClass" class="text-rose-400 hover:underline">Gục đầu ngủ (-5 Sức khỏe, +10 ⚡)</button>
            </div>
          </div>

          <!-- VIEW 3: CANTEEN SNACK MENU (MÓN ĂN HỌC ĐƯỜNG) -->
          <div id="canteenMenuCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 class="text-xs font-black text-emerald-400 uppercase">🍜 CĂN TIN TRƯỜNG - CÔ NĂM</h3>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <p class="text-[11px] text-slate-300">Ăn uống nạp lại Năng Lượng & Tâm Trạng, hoặc bao Crush để tăng tình cảm!</p>
            <div id="canteenItemsList" class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <!-- Render Canteen Items -->
            </div>
          </div>

          <!-- VIEW 4: DIARY VIEW (NHẬT KÝ ĐỜI HỌC SINH) -->
          <div id="diaryModalCard" class="hidden w-full max-w-md bg-amber-50 border-4 border-amber-900/60 rounded-2xl p-5 shadow-2xl space-y-3 z-30 text-amber-950">
            <div class="flex items-center justify-between border-b-2 border-amber-300 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📓</span>
                <div>
                  <h3 id="diaryTitle" class="font-extrabold text-sm uppercase tracking-wide">NHẬT KÝ — NGÀY 1</h3>
                  <span id="diaryDateSubtitle" class="text-[10px] text-amber-800">Ghi lại cảm xúc dưới mái trường</span>
                </div>
              </div>
              <button onclick="closeOverlayCard()" class="text-amber-900 hover:text-red-600 font-black text-sm">✕</button>
            </div>
            <div id="diaryContentText" class="text-xs font-serif leading-relaxed space-y-2 italic bg-amber-100/60 p-3 rounded-xl border border-amber-200 min-h-[140px] max-h-60 overflow-y-auto">
              <!-- Nội dung nhật ký tự sinh động -->
            </div>
            <div class="text-[10px] text-amber-800 font-mono flex justify-between items-center pt-1 border-t border-amber-200">
              <span id="diaryForecastNextDay">Ngày mai: Có tiết kiểm tra 1 tiết</span>
              <button id="btnContinueFromDiary" class="px-3 py-1.5 bg-amber-800 text-amber-100 font-bold rounded-lg text-xs hover:bg-amber-900">
                Thức dậy ngày mới ☀️
              </button>
            </div>
          </div>

          <!-- VIEW 5: ENDING FINALE SCREEN (TỔNG KẾT TỐT NGHIỆP) -->
          <div id="endingScreenCard" class="hidden w-full max-w-md bg-slate-900 border-4 border-yellow-400 rounded-2xl p-5 shadow-2xl text-center space-y-4 z-40">
            <div class="text-4xl animate-bounce">🎓</div>
            <div class="space-y-1">
              <span class="text-[10px] font-pixel text-amber-400">LỄ TỐT NGHIỆP THPT THANH XUÂN</span>
              <h2 id="endingTitle" class="text-lg font-black text-white">🏆 THỦ KHOA 12A3</h2>
              <p id="endingSubtitle" class="text-xs text-yellow-300 font-semibold"></p>
            </div>
            <div id="endingDescription" class="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 text-left">
              <!-- Nội dung kết thúc -->
            </div>
            <div class="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-800/80 p-2.5 rounded-xl text-slate-300">
              <div>Tổng điểm học tập: <b id="endStatStudy" class="text-sky-400">0</b></div>
              <div>Tình cảm crush: <b id="endStatLove" class="text-pink-400">0%</b></div>
              <div>Số bạn bè thân thiết: <b id="endStatFriends" class="text-amber-400">0</b></div>
              <div>Tài sản tích lũy: <b id="endStatMoney" class="text-emerald-400">0đ</b></div>
            </div>
            <button onclick="restartGame()" class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition">
              CHƠI LẠI THANH XUÂN MỚI 🌸
            </button>
          </div>

        </div>

        <!-- QUICK LOCATION NAVIGATOR (5 ĐỊA ĐIỂM HỌC ĐƯỜNG) -->
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
            <span>🏠</span><span>Về Nhà</span>
          </button>
        </nav>
      </section>

      <!-- ============================================================== -->
      <!-- BOTTOM JRPG CONTROLLER BAR: HOẠT ĐỘNG, BẠN BÈ, CHAT, TÚI ĐỒ, NHẬT KÝ -->
      <!-- ============================================================== -->
      <footer class="mt-3 bg-slate-950 pixel-box rounded-xl p-2 flex items-center justify-between gap-1.5">
        <button onclick="openTabAction('study')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">📖</span><span>Học Tập</span>
        </button>
        <button onclick="openTabAction('friends')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">👥</span><span>Bạn Bè</span>
        </button>
        <button onclick="openTabAction('chat')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">💬</span><span>Tin Nhắn</span>
        </button>
        <button onclick="openTabAction('bag')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">🎒</span><span>Túi Đồ</span>
        </button>
        <button onclick="openDiaryManual()" class="rpg-btn flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">📓</span><span>Nhật Ký</span>
        </button>
      </footer>

      <!-- ACTION DRAWER / BOTTOM POPUP PANEL -->
      <div id="actionDrawerPanel" class="hidden absolute bottom-16 left-3 right-3 bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 shadow-2xl z-30 max-h-64 overflow-y-auto">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <h4 id="drawerTitle" class="text-xs font-black text-amber-300 uppercase">DANH SÁCH HOẠT ĐỘNG</h4>
          <button onclick="closeDrawer()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
        </div>
        <div id="drawerContent" class="space-y-2 text-xs">
          <!-- Render nội dung theo từng tab -->
        </div>
      </div>

    </div>

    <!-- CONSOLE PHYSICAL BUTTON ACCENTS -->
    <div class="flex items-center justify-between px-6 pt-3 text-[10px] text-slate-500 font-pixel">
      <div class="flex gap-2 items-center">
        <span class="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs">▲</span>
        <span class="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs">▼</span>
      </div>
      <div class="text-center">
        <span class="tracking-widest">THANH XUÂN RỰC RỠ • CẤP 3</span>
      </div>
      <div class="flex gap-3">
        <div class="w-7 h-7 rounded-full bg-rose-700 border-2 border-rose-600 flex items-center justify-center text-[9px] text-white font-bold cursor-pointer" onclick="quickSleep()">B</div>
        <div class="w-7 h-7 rounded-full bg-emerald-700 border-2 border-emerald-600 flex items-center justify-center text-[9px] text-white font-bold cursor-pointer" onclick="openDiaryManual()">A</div>
      </div>
    </div>
  </div>

  <!-- ============================================================== -->
  <!-- JAVASCRIPT GAME LOGIC & JRPG ENGINE -->
  <!-- ============================================================== -->
  <script>
    /* -------------------------------------------------------------
       1. WEB AUDIO SYNTHESIZER (8-BIT JRPG CHIPTUNE)
       ------------------------------------------------------------- */
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
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + duration);
      }
      playSuccess() {
        if (!this.enabled) return; this.init();
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
          setTimeout(() => this.playTone(f, 'triangle', 0.2, 0.2), idx * 70);
        });
      }
      playWrong() {
        if (!this.enabled) return; this.init();
        [280, 220, 160].forEach((f, idx) => {
          setTimeout(() => this.playTone(f, 'sawtooth', 0.2, 0.25), idx * 90);
        });
      }
      playBell() {
        if (!this.enabled) return; this.init();
        [440, 554, 659, 880].forEach((f, i) => {
          setTimeout(() => this.playTone(f, 'sine', 0.35, 0.18), i * 140);
        });
      }
    }
    const audio = new RetroAudio();

    /* -------------------------------------------------------------
       2. TRẮC NGHIỆM HỌC ĐƯỜNG CÁC MÔN HỌC (QUIZ DATABASE)
       ------------------------------------------------------------- */
    const QUIZ_QUESTIONS = [
      {
        subject: 'MÔN TOÁN', teacher: 'Thầy Minh',
        question: '“Nếu x + 5 = 12 thì giá trị của biểu thức 2x - 4 bằng bao nhiêu?”',
        options: ['10', '14', '7', '18'], correct: 0,
        tip: 'Tìm x = 7, sau đó tính 2*(7) - 4 = 10.'
      },
      {
        subject: 'MÔN TOÁN', teacher: 'Thầy Minh',
        question: '“Hàm số y = x² - 4x + 3 có tọa độ đỉnh Parabol là?”',
        options: ['(2; -1)', '(1; 0)', '(-2; 1)', '(2; 3)'], correct: 0,
        tip: 'x = -b/(2a) = 2; thay vào y = -1.'
      },
      {
        subject: 'MÔN NGỮ VĂN', teacher: 'Cô Thảo',
        question: '“Ai là tác giả của thiên truyện ngắn nổi tiếng ‘Vợ Nhặt’?”',
        options: ['Kim Lân', 'Nam Cao', 'Tô Hoài', 'Nguyễn Tuân'], correct: 0,
        tip: 'Nhà văn Kim Lân - cây bút xuất sắc của làng quê Việt Nam.'
      },
      {
        subject: 'MÔN NGỮ VĂN', teacher: 'Cô Thảo',
        question: '“Hình tượng người chiến sĩ Tây Tiến được miêu tả qua vẻ đẹp nào?”',
        options: ['Hào hoa, lãng mạn và bi tráng', 'Mộc mạc, nông dân', 'U sầu, cô độc', 'Thần thánh hóa'], correct: 0,
        tip: 'Bài thơ Tây Tiến của Quang Dũng nổi bật với cảm hứng lãng mạn và tinh thần bi tráng.'
      },
      {
        subject: 'MÔN TIẾNG ANH', teacher: 'Cô Jennifer',
        question: '“Choose the correct preposition: ‘She has been waiting for you ___ 8:00 AM.’”',
        options: ['since', 'for', 'at', 'in'], correct: 0,
        tip: 'Dùng ‘since’ cho mốc thời gian cụ thể trong hiện tại hoàn thành.'
      },
      {
        subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn',
        question: '“Trong dao động điều hòa của con lắc lò xo, cơ năng biến thiên như thế nào?”',
        options: ['Bảo toàn không đổi theo thời gian', 'Tăng giảm tuần hoàn', 'Luôn bằng 0', 'Tăng dần'], correct: 0,
        tip: 'Bỏ qua ma sát thì cơ năng của dao động điều hòa luôn được bảo toàn.'
      },
      {
        subject: 'MÔN LỊCH SỬ', teacher: 'Thầy Hùng',
        question: '“Chiến thắng Điện Biên Phủ ‘lừng lẫy năm châu, chấn động địa cầu’ diễn ra vào năm nào?”',
        options: ['1954', '1945', '1975', '1968'], correct: 0,
        tip: 'Ngày 7 tháng 5 năm 1954, tập đoàn cứ điểm Điện Biên Phủ hoàn toàn thất thủ.'
      }
    ];

    /* -------------------------------------------------------------
       3. TRẠNG THÁI NGƯỜI CHƠI (GAME STATE & METRICS)
       ------------------------------------------------------------- */
    const STATE = {
      day: 1,
      totalDays: 45,
      timeIndex: 0, // 0: 07:30, 1: 09:15, 2: 11:30, 3: 14:00, 4: 17:00, 5: 20:30
      location: 'class', // 'class', 'canteen', 'library', 'yard', 'home'
      
      // CHỈ SỐ SỐNG CÒN
      stats: {
        hp: 85,          // ❤️ Sức khỏe (ảnh hưởng khả năng học)
        energy: 100,     // ⚡ Năng lượng (dùng cho hành động)
        mood: 75,        // 😊 Tâm trạng (ảnh hưởng hiệu suất)
        study: 50,       // 📚 Điểm học tập (ảnh hưởng đỗ đại học/thủ khoa)
        friends: 40,     // 👥 Tình bạn bè
        love: 20,        // 💕 Tình cảm với Crush Mai Linh
        reputation: 30,  // ⭐ Danh tiếng trường
        money: 50000,    // 💰 Tiền ăn vặt
        skill: 25        // 🧠 Kỹ năng sống & giao tiếp
      },

      // TÚI ĐỒ (INVENTORY)
      bag: [
        { id: 'milk_tea', name: 'Trà Sữa Trân Châu', icon: '🧋', count: 1, desc: 'Tặng Crush +15 💕 hoặc tự uống +15 😊' },
        { id: 'math_book', name: 'Sổ Tay Công Thức Toán', icon: '📘', count: 1, desc: 'Dùng khi học bài +8 📚' }
      ],

      // LỊCH SỬ HÀNH ĐỘNG TRONG NGÀY (DÙNG ĐỂ TỰ SINH NHẬT KÝ)
      todayEvents: [],
      diaryEntries: []
    };

    const TIME_PERIODS = [
      { text: '07:30', name: 'Buổi sáng • Tiết 1-2' },
      { text: '09:15', name: 'Giờ ra chơi 15 phút' },
      { text: '11:30', name: 'Tan trường buổi sáng' },
      { text: '14:00', name: 'Buổi chiều • Thư viện / Tự học' },
      { text: '17:00', name: 'Chiều muộn • Hoạt động sân trường' },
      { text: '20:30', name: 'Buổi tối • Góc học tập ở nhà' }
    ];

    const DAYS_OF_WEEK = ['THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY', 'CHỦ NHẬT'];

    /* -------------------------------------------------------------
       4. ĐIỀU HƯỚNG ĐỊA ĐIỂM (LOCATION SWITCHING)
       ------------------------------------------------------------- */
    function gotoLocation(loc) {
      STATE.location = loc;
      closeOverlayCard();
      audio.playTone(320, 'sine', 0.08);

      const titleEl = document.getElementById('locTitle');
      const iconEl = document.getElementById('locIcon');
      const descEl = document.getElementById('sceneNarrative');

      document.querySelectorAll('.loc-btn').forEach(btn => {
        btn.className = 'loc-btn flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center gap-1';
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
        descEl.textContent = 'Không gian tĩnh lặng ngập tràn sách vở. Nơi lý tưởng để cày đề đại học.';
      } else if (loc === 'yard') {
        titleEl.textContent = 'SÂN TRƯỜNG & CÂY BÀNG LÁ ĐỎ';
        iconEl.textContent = '🌿';
        descEl.textContent = 'Gió thổi mát rượi dưới bóng mát cây bàng. Đám bạn nam đang hò reo thi ném bóng rổ.';
      } else if (loc === 'home') {
        titleEl.textContent = 'PHÒNG NGỦ & BÀN HỌC Ở NHÀ';
        iconEl.textContent = '🏠';
        descEl.textContent = 'Góc học tập ấm cúng. Nơi bạn có thể tự học khuya hoặc leo lên giường ngủ nạp lại năng lượng.';
      }
      updateHUD();
    }

    /* -------------------------------------------------------------
       5. HỆ THỐNG LỚP HỌC & TRẮC NGHIỆM TƯƠNG TÁC THỰC SỰ
       ------------------------------------------------------------- */
    function startClassroomLesson() {
      if (STATE.stats.energy < 15) {
        showStatAlert('⚠️ Bạn quá kiệt sức! Hãy về nhà ngủ hoặc uống trà sữa.', 'text-rose-400');
        audio.playWrong();
        return;
      }

      // Chọn câu hỏi ngẫu nhiên
      const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      document.getElementById('canteenMenuCard').classList.add('hidden');
      document.getElementById('diaryModalCard').classList.add('hidden');
      
      const quizCard = document.getElementById('classroomQuizCard');
      quizCard.classList.remove('hidden');

      document.getElementById('quizSubjectBadge').textContent = q.subject;
      document.getElementById('quizTeacherQuestion').textContent = q.question;

      const optsBox = document.getElementById('quizOptionsContainer');
      optsBox.innerHTML = '';

      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-left text-xs font-semibold text-slate-200 transition active:scale-95 flex items-center gap-1.5';
        btn.innerHTML = `<span class="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-amber-400 font-bold">${String.fromCharCode(65 + idx)}</span> <span class="truncate">${opt}</span>`;
        btn.onclick = () => answerQuiz(q, idx);
        optsBox.appendChild(btn);
      });
    }

    function answerQuiz(q, selectedIdx) {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');

      if (selectedIdx === q.correct) {
        // TRẢ LỜI ĐÚNG: TĂNG HỌC TẬP, TÂM TRẠNG, GIẢM NĂNG LƯỢNG
        modifyStats({ study: +8, mood: +4, energy: -15, rep: +5 });
        audio.playSuccess();
        showStatAlert('🎉 Thầy khen bạn trả lời xuất sắc! (+8 📚, +4 😊)', 'text-emerald-400');
        STATE.todayEvents.push(`Bị thầy gọi lên bảng môn ${q.subject}. May mắn trả lời trúng phóc được cả lớp trầm trồ.`);
      } else {
        // TRẢ LỜI SAI: GIẢM TÂM TRẠNG, HỌC ĐƯỢC CHÚT BÀI HỌC
        modifyStats({ study: +2, mood: -6, energy: -15 });
        audio.playWrong();
        showStatAlert('😭 Sai mất rồi! Bị bạn bè trêu nhẹ. (+2 📚, -6 😊)', 'text-rose-400');
        STATE.todayEvents.push(`Lúng túng không giải được câu đố môn ${q.subject}. Tự nhủ tối nay phải xem lại công thức.`);
      }
      advanceTime();
    }

    document.getElementById('btnSkipClass')?.addEventListener('click', () => {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');
      modifyStats({ energy: +10, study: -4, rep: -3, hp: -2 });
      audio.playTone(180, 'sawtooth', 0.2);
      showStatAlert('😴 Ngủ gật trong giờ học! (+10 ⚡, -4 📚)', 'text-amber-400');
      STATE.todayEvents.push('Gục đầu xuống bàn ngủ ngon lành suốt tiết học, suýt bị cán sự lớp ghi tên vào sổ.');
      advanceTime();
    });

    /* -------------------------------------------------------------
       6. HỆ THỐNG CĂN TIN & MÓN ĂN
       ------------------------------------------------------------- */
    const CANTEEN_FOODS = [
      { name: 'Bánh Tráng Trộn Cô Năm', cost: 15000, energy: +25, mood: +15, hp: +5, icon: '🥣' },
      { name: 'Bắp Xào Bơ Hành Nóng Hổi', cost: 12000, energy: +20, mood: +10, hp: +5, icon: '🌽' },
      { name: 'Trà Đào Cam Sả Mát Lạnh', cost: 18000, energy: +15, mood: +20, hp: +8, icon: '🍹' },
      { name: 'Bao Crush Mai Linh Ăn Vặt', cost: 35000, energy: +10, mood: +30, love: +15, icon: '💕' }
    ];

    function openCanteenMenu() {
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      document.getElementById('classroomQuizCard').classList.add('hidden');
      const c = document.getElementById('canteenMenuCard');
      c.classList.remove('hidden');

      const list = document.getElementById('canteenItemsList');
      list.innerHTML = '';
      CANTEEN_FOODS.forEach(food => {
        const item = document.createElement('div');
        item.className = 'bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/50 transition';
        item.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-xl">${food.icon}</span>
            <div>
              <div class="font-bold text-slate-200">${food.name}</div>
              <div class="text-[10px] text-slate-400 font-mono">Giá: <span class="text-emerald-400">${food.cost.toLocaleString('vi-VN')}đ</span></div>
            </div>
          </div>
          <button class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px]" onclick="buyFood('${food.name}', ${food.cost}, ${food.energy}, ${food.mood}, ${food.love || 0})">
            Mua Ăn
          </button>
        `;
        list.appendChild(item);
      });
    }

    function buyFood(name, cost, eGain, mGain, loveGain) {
      if (STATE.stats.money < cost) {
        showStatAlert('💸 Bạn không đủ tiền tiêu vặt rồi!', 'text-rose-400');
        audio.playWrong();
        return;
      }
      modifyStats({
        money: -cost,
        energy: eGain,
        mood: mGain,
        love: loveGain
      });
      audio.playTone(600, 'sine', 0.15);
      showStatAlert(`😋 Măm măm ${name}! (+${eGain} ⚡, +${mGain} 😊)`, 'text-emerald-400');
      if (loveGain > 0) {
        STATE.todayEvents.push(`Bao Mai Linh ăn vặt ở căn tin. Nhìn nụ cười của Linh mà tim mình đập thình thịch.`);
      } else {
        STATE.todayEvents.push(`Ghé căn tin làm một phần ${name} thơm lừng nạp lại năng lượng.`);
      }
      advanceTime();
    }

    /* -------------------------------------------------------------
       7. TƯƠNG TÁC NPC & BẠN BÈ (SOCIAL NETWORKING)
       ------------------------------------------------------------- */
    function interactNPC(who) {
      audio.playTone(450, 'triangle', 0.1);
      if (who === 'crush') {
        if (STATE.stats.energy < 10) { showStatAlert('Bạn quá mệt để bắt chuyện với crush!', 'text-amber-400'); return; }
        modifyStats({ energy: -10, mood: +10, love: +6, study: -2 });
        showStatAlert('💕 Nói chuyện vu vơ với Mai Linh (+6 💕, +10 😊)', 'text-pink-400');
        STATE.todayEvents.push('Đứng dưới gốc bàng nói chuyện cùng Mai Linh. Linh còn cho mình mượn bút bi màu hồng.');
        advanceTime();
      } else if (who === 'lan') {
        modifyStats({ energy: -10, mood: +15, friends: +8, study: +4 });
        showStatAlert('👧 Tám chuyện và mượn vở Lan chép bài (+8 👥, +4 📚)', 'text-sky-400');
        STATE.todayEvents.push('Cùng Lan bạn thân ngồi đối chiếu bài tập về nhà. Lan vừa giảng bài vừa trêu mình.');
        advanceTime();
      } else if (who === 'tuan') {
        modifyStats({ energy: -20, hp: +10, mood: +12, friends: +8 });
        showStatAlert('🏀 Làm một ván bóng rổ với Tuấn (+10 ❤️, +12 😊)', 'text-amber-400');
        STATE.todayEvents.push('Làm vài pha ném bóng rổ 3 điểm cùng Tuấn dưới sân trường toát cả mồ hôi nhưng cực vui.');
        advanceTime();
      }
    }

    /* -------------------------------------------------------------
       8. CƠ CHẾ TRADE-OFF CHỈ SỐ & TIẾN TRÌNH THỜI GIAN
       ------------------------------------------------------------- */
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
        // Hết một ngày học -> Tự động kích hoạt Nhật Ký Cuối Ngày
        triggerEndOfDayDiary();
      } else {
        updateHUD();
      }
    }

    function quickSleep() {
      if (confirm('Bạn có muốn đi ngủ để kết thúc ngày hôm nay và viết nhật ký?')) {
        triggerEndOfDayDiary();
      }
    }

    /* -------------------------------------------------------------
       9. HỆ THỐNG TỰ SINH NHẬT KÝ ĐỜI HỌC SINH (DYNAMIC DIARY)
       ------------------------------------------------------------- */
    function triggerEndOfDayDiary() {
      audio.playBell();
      closeOverlayCard();

      // Hồi phục năng lượng và tiền tiêu vặt mỗi sáng
      STATE.stats.energy = 100;
      STATE.stats.money += 30000; // Tiền ăn sáng mẹ cho

      // Tự sinh nội dung nhật ký dựa trên hành động thực tế trong ngày
      let diaryStory = [];
      diaryStory.push(`Hôm nay là Ngày thứ ${STATE.day} của năm lớp 12.`);

      if (STATE.todayEvents.length > 0) {
        diaryStory.push(STATE.todayEvents.join(' '));
      } else {
        diaryStory.push('Một ngày học trôi qua thật êm đềm, mình chỉ cặm cụi ngồi nghe giảng và ngắm nhìn sân trường đầy nắng.');
      }

      // Thêm đoạn kết suy nghĩ cá nhân
      if (STATE.stats.love >= 50) {
        diaryStory.push('Dạo này Mai Linh hay nhìn trộm mình thì phải... Có khi nào sau lễ tốt nghiệp mình sẽ can đảm tỏ tình không? 💕');
      } else if (STATE.stats.study >= 80) {
        diaryStory.push('Kiến thức ôn thi khối A đã tương đối vững vàng. Mục tiêu thủ khoa trường THPT Thanh Xuân không còn xa nữa! 📚');
      } else if (STATE.stats.mood <= 30) {
        diaryStory.push('Thấy hơi áp lực thi cử và mệt mỏi trong lòng. Ngày mai nhất định phải rủ đám bạn ra căn tin xả stress mới được. 😭');
      }

      const fullDiaryText = diaryStory.join('\n\n');
      STATE.diaryEntries.push({ day: STATE.day, text: fullDiaryText });
      STATE.todayEvents = []; // Reset cho ngày mới

      // Hiển thị Card Nhật Ký
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const diaryCard = document.getElementById('diaryModalCard');
      diaryCard.classList.remove('hidden');

      document.getElementById('diaryTitle').textContent = `NHẬT KÝ — NGÀY ${STATE.day}`;
      document.getElementById('diaryContentText').innerText = fullDiaryText;
      document.getElementById('diaryForecastNextDay').textContent = `Ngày ${STATE.day + 1}: ${STATE.day % 5 === 0 ? 'Có bài khảo sát chất lượng!' : 'Lịch học bình thường.'}`;

      document.getElementById('btnContinueFromDiary').onclick = () => {
        closeOverlayCard();
        STATE.day++;
        STATE.timeIndex = 0;
        gotoLocation('class');

        // Kiểm tra xem đã đến ngày tốt nghiệp chưa (Ngày 45)
        if (STATE.day > STATE.totalDays) {
          triggerGraduationEnding();
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

    /* -------------------------------------------------------------
       10. HỆ THỐNG ĐA KẾT THÚC (7+ ENDINGS SYSTEM)
       ------------------------------------------------------------- */
    function triggerGraduationEnding() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const endCard = document.getElementById('endingScreenCard');
      endCard.classList.remove('hidden');
      audio.playSuccess();

      let title = '';
      let sub = '';
      let desc = '';

      const s = STATE.stats;

      if (s.study >= 90) {
        title = '🏆 HỌC BÁ 12A3 - THỦ KHOA ĐẠI HỌC';
        sub = 'Tương lai rộng mở nơi giảng đường danh giá';
        desc = 'Với điểm số học tập kỷ lục, bạn chính thức trở thành Thủ khoa khối tự nhiên toàn trường! Thầy cô tự hào, bạn bè khâm phục. Bạn đã chứng minh sự nỗ lực không ngừng nghỉ suốt những năm tháng cấp 3.';
      } else if (s.love >= 80) {
        title = '💕 THANH XUÂN CÓ NGƯỜI ẤY';
        sub = 'Lời hẹn ước thiệp hồng dưới gốc bàng rực rỡ';
        desc = 'Trong buổi lễ bế giảng ngập tràn nước mắt và tiếng cười, bạn đã lấy hết dũng khí nắm tay Mai Linh dưới bóng cây bàng lá đỏ. Nụ cười hạnh phúc của người ấy chính là món quà thanh xuân đẹp nhất đời bạn.';
      } else if (s.friends >= 85) {
        title = '👥 NGƯỜI CÓ HỘI BẠN THÂN NHẤT';
        sub = 'Tình bạn bất diệt không bao giờ phai nhạt';
        desc = 'Bạn là linh hồn của lớp 12A3! Dù mai này mỗi đứa một phương trời, nhưng cuốn lưu bút đầy ắp chữ ký và những buổi chiều căn tin ăn vặt cùng Lan, Tuấn sẽ mãi mãi là ký ức vô giá.';
      } else if (s.money >= 300000) {
        title = '💼 KHỞI NGHIỆP TỪ NĂM 17 TUỔI';
        sub = 'Ông trùm buôn bán học đường tài ba';
        desc = 'Nhờ tài ăn nói khéo léo và óc kinh doanh nhạy bén quanh các quầy bánh tráng trộn căn tin, bạn đã tích lũy được khoản vốn khởi nghiệp đáng nể ngay khi tốt nghiệp cấp 3!';
      } else if (s.hp <= 30 && s.study <= 40) {
        title = '😴 CHUYÊN GIA NGỦ TRONG GIỜ';
        sub = 'Huyền thoại giấc ngủ trưa kéo dài từ tiết 1 đến tiết 5';
        desc = 'Bạn đã lập kỷ lục ngủ gục suốt các tiết Toán, Văn, Lý, Hóa mà không bị đuổi ra khỏi lớp. Dù điểm số không quá cao, nhưng bạn luôn là kỷ niệm hài hước nhất trong mắt bạn bè mỗi khi họp lớp!';
      } else {
        title = '🌸 THANH XUÂN RỰC RỠ TRỌN VẸN';
        sub = 'Một thời áo trắng bình yên và đẹp đẽ';
        desc = 'Bạn đã cân bằng tuyệt vời giữa việc học tập, kết bạn và tận hưởng từng phút giây của tuổi học trò. Một thanh xuân trọn vẹn, không hề có chút nuối tiếc!';
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

    /* -------------------------------------------------------------
       11. DRAWER HOẠT ĐỘNG, TIN NHẮN, TÚI ĐỒ & BẠN BÈ
       ------------------------------------------------------------- */
    function openTabAction(tab) {
      const drawer = document.getElementById('actionDrawerPanel');
      const title = document.getElementById('drawerTitle');
      const content = document.getElementById('drawerContent');
      drawer.classList.remove('hidden');

      if (tab === 'study') {
        title.textContent = '📖 HOẠT ĐỘNG HỌC TẬP & CÀY ĐỀ';
        content.innerHTML = `
          <div class="space-y-2">
            <button onclick="startClassroomLesson()" class="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex justify-between items-center">
              <span>✍️ Trả lời câu hỏi của giáo viên</span>
              <span class="text-amber-400 font-mono">-15 ⚡</span>
            </button>
            <button onclick="selfStudyLibrary()" class="w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex justify-between items-center">
              <span>📚 Tự học tại thư viện (+12 📚, -20 ⚡, -5 😊)</span>
              <span class="text-sky-400 font-mono">Tự học</span>
            </button>
          </div>
        `;
      } else if (tab === 'friends') {
        title.textContent = '👥 DANH SÁCH BẠN BÈ LỚP 12A3';
        content.innerHTML = `
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>👧</span><div><b>Lan</b> <span class="text-[10px] text-slate-400">Bạn Thân</span></div></div>
              <button onclick="interactNPC('lan')" class="px-2.5 py-1 bg-sky-600 rounded text-[11px] font-bold">Rủ học chung</button>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>💕</span><div><b>Mai Linh</b> <span class="text-[10px] text-pink-400">Crush</span></div></div>
              <button onclick="interactNPC('crush')" class="px-2.5 py-1 bg-pink-600 rounded text-[11px] font-bold">Trò chuyện</button>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>🏀</span><div><b>Tuấn</b> <span class="text-[10px] text-amber-400">Bóng Rổ</span></div></div>
              <button onclick="interactNPC('tuan')" class="px-2.5 py-1 bg-amber-600 rounded text-[11px] font-bold">Ném bóng</button>
            </div>
          </div>
        `;
      } else if (tab === 'chat') {
        title.textContent = '💬 HỘP THƯ TIN NHẮN SMS';
        content.innerHTML = `
          <div class="space-y-2 text-[11px]">
            <div class="p-2 bg-slate-800 rounded-xl border border-slate-700">
              <b class="text-pink-300">Mai Linh:</b> "Hôm nay cậu làm bài khảo sát được không? Đừng thức khuya quá nha! 😊"
            </div>
            <div class="p-2 bg-slate-800 rounded-xl border border-slate-700">
              <b class="text-sky-300">Lan:</b> "Mai nhớ mang vở Văn cho tao mượn chép bài đấy nhé con heo!"
            </div>
          </div>
        `;
      } else if (tab === 'bag') {
        title.textContent = '🎒 TÚI ĐỒ HỌC SINH';
        content.innerHTML = STATE.bag.map(item => `
          <div class="p-2 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center">
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
      modifyStats({ study: +12, energy: -20, mood: -5 });
      audio.playTone(520, 'sine', 0.15);
      showStatAlert('📚 Cày xong 1 đề thi đại học! (+12 📚, -20 ⚡, -5 😊)', 'text-sky-400');
      STATE.todayEvents.push('Ngồi lì trong thư viện giải xong trọn vẹn một đề thi thử đại học môn Toán.');
      advanceTime();
    }

    function useItem(itemId) {
      const it = STATE.bag.find(b => b.id === itemId);
      if (!it || it.count <= 0) return;
      it.count--;
      if (itemId === 'milk_tea') {
        modifyStats({ mood: +15, energy: +15 });
        showStatAlert('🧋 Uống trà sữa thơm ngon! (+15 😊, +15 ⚡)', 'text-emerald-400');
      } else if (itemId === 'math_book') {
        modifyStats({ study: +8 });
        showStatAlert('📘 Đọc sổ tay công thức! (+8 📚)', 'text-sky-400');
      }
      openTabAction('bag');
    }

    function closeDrawer() {
      document.getElementById('actionDrawerPanel').classList.add('hidden');
    }
    function closeOverlayCard() {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      document.getElementById('canteenMenuCard').classList.add('hidden');
      document.getElementById('diaryModalCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');
      closeDrawer();
    }

    /* -------------------------------------------------------------
       12. CẬP NHẬT HUD & LƯU TIẾN TRÌNH (STORAGE)
       ------------------------------------------------------------- */
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
      document.getElementById('statMoney').textContent = `${STATE.stats.money.toLocaleString('vi-VN')}đ`;
    }

    function showStatAlert(text, colorClass = 'text-emerald-400') {
      const box = document.getElementById('statAlertBox');
      box.textContent = text;
      box.className = `text-[11px] font-mono font-bold ${colorClass} opacity-100 transition-opacity duration-200 bg-black/80 px-2.5 py-1 rounded border border-slate-700`;
      setTimeout(() => {
        box.classList.remove('opacity-100');
        box.classList.add('opacity-0');
      }, 3000);
    }

    function saveGame() {
      try {
        localStorage.setItem('thanh_xuan_jrpg_save', JSON.stringify(STATE));
        document.getElementById('saveStatus').textContent = 'AUTO-SAVED';
      } catch (e) {}
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

    // Nút Bật / Tắt Âm thanh
    document.getElementById('btnAudioToggle')?.addEventListener('click', (e) => {
      audio.enabled = !audio.enabled;
      e.target.textContent = audio.enabled ? '🔊 ÂM THANH' : '🔇 TẮT ÂM';
    });

    // KHỞI ĐỘNG GAME
    window.addEventListener('DOMContentLoaded', () => {
      loadGame();
      gotoLocation('class');
      updateHUD();
    });
  </script>
</body>
</html>
