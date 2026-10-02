import React from 'react';

export default function App() {
  const gameHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanh Xuân Rực Rỡ: Học Sinh & Con Buôn Học Đường 4.0</title>
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
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-2 sm:p-4 overflow-x-hidden">

  <div class="retro-console-frame border-4 rounded-[36px] p-3 sm:p-5 w-full max-w-4xl flex flex-col relative">
    
    <!-- TOP CONSOLE HEADER -->
    <div class="flex items-center justify-between px-3 py-1.5 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-pixel">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
        <span class="text-sky-400">JRPG SCHOOL TYCOON 4.0</span>
      </div>
      <div class="flex items-center gap-3">
        <button id="btnAudioToggle" class="hover:text-amber-300 transition text-[9px] bg-slate-800 px-2 py-0.5 rounded">🔊 BẬT ÂM</button>
        <span id="saveStatus" class="text-slate-500 font-mono">ĐÃ LƯU</span>
      </div>
    </div>

    <!-- MAIN SCREEN BEZEL -->
    <div class="screen-bezel rounded-2xl p-2 sm:p-4 border-2 border-slate-800/80 flex flex-col flex-1 relative overflow-hidden min-h-[620px]">
      <div class="scanlines absolute inset-0 z-50"></div>

      <!-- TOP HUD -->
      <header class="bg-slate-950/95 pixel-box rounded-xl p-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs relative z-10">
        <div class="flex items-center gap-2.5">
          <span class="text-xl" id="uiWeatherIcon">☀️</span>
          <div>
            <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span id="uiDayOfWeek">THỨ HAI</span>
              <span>•</span>
              <span id="uiTimeText" class="font-mono text-emerald-400">07:30</span>
              <span class="text-[10px] px-1.5 py-0.5 bg-slate-800 text-sky-300 rounded font-semibold font-mono">NGÀY <b id="uiDayCount">1</b>/45</span>
            </div>
            <div id="uiCurrentPeriodText" class="text-[10px] text-slate-400 font-medium">Buổi sáng • Tiết 1-2</div>
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
            <span>💰</span><span id="statMoney" class="text-emerald-400 font-bold">60.000đ</span>
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
          <div id="businessStatusTag" class="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 border border-emerald-500 text-emerald-300">
            🟢 ĐƯỢC PHÉP BÁN HÀNG
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
              SÁNG + RA CHƠI + SAU 17H: BÁN HÀNG • CÒN LẠI VỀ HỌC
            </div>
            <p id="sceneNarrative" class="text-xs text-slate-300 max-w-md italic mt-1 px-4 leading-relaxed">
              "Kỳ thi Giữa Kỳ (Ngày 22) và Cuối Kỳ (Ngày 45) sắp đến. Vừa kiếm vốn vừa phải leo lên top 1 thi đua để gây ấn tượng với Triệu Mẫn!"
            </p>
          </div>

          <!-- VIEW 2: TIẾT HỌC THỰC SỰ -->
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

          <!-- VIEW 3: BẢNG XẾP HẠNG THI ĐUA -->
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
            <p class="text-[10px] text-slate-400 text-center italic">Cố gắng vươn lên Top 1 để được vinh danh và làm Triệu Mẫn tự hào!</p>
          </div>

          <!-- VIEW 4: BÀI THI GIỮA KỲ / CUỐI KỲ -->
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

          <!-- VIEW 5: QUẦY BÁN HÀNG CÁ NHÂN -->
          <div id="shopSellCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-base">💼</span>
                <h3 class="text-xs font-black text-emerald-400 uppercase">QUẦY BÁN HÀNG CỦA BẠN</h3>
              </div>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <p class="text-[11px] text-slate-300">
              Chỉ được bán vào: <b>Sáng (07:30)</b>, <b>Ra Chơi (09:15)</b> và <b>Sau 17:00 Tan Trường</b>!
            </p>
            <div id="stockListContainer" class="space-y-2 max-h-52 overflow-y-auto pr-1"></div>
            <div class="flex justify-between items-center pt-2 border-t border-slate-800">
              <button onclick="openWholesaleTab()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold">
                🚚 Nhập Thêm Hàng Sỉ
              </button>
              <button onclick="sellToCrowd()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black">
                📢 Mời Chào Khắp Sân Trường (-10 ⚡)
              </button>
            </div>
          </div>

          <!-- VIEW 6: CHỢ SỈ ĐẦU MỐI -->
          <div id="wholesaleCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-blue-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-base">🚚</span>
                <h3 class="text-xs font-black text-blue-400 uppercase">CHỢ SỈ ĐẦU MỐI (NHẬP HÀNG)</h3>
              </div>
              <button onclick="openShopSellCard()" class="text-slate-400 hover:text-white text-xs">← Quay lại quầy</button>
            </div>
            <div id="wholesaleListContainer" class="space-y-2 max-h-52 overflow-y-auto pr-1"></div>
          </div>

          <!-- VIEW 7: CĂN TIN TRƯỜNG -->
          <div id="canteenMenuCard" class="hidden w-full max-w-md bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl space-y-3 z-20">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 class="text-xs font-black text-emerald-400 uppercase">🍜 CĂN TIN TRƯỜNG - CÔ NĂM</h3>
              <button onclick="closeOverlayCard()" class="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>
            <p class="text-[11px] text-slate-300">Nạp lại Năng Lượng & Tâm Trạng, hoặc mua trà sữa tặng Triệu Mẫn!</p>
            <div id="canteenItemsList" class="space-y-2 max-h-48 overflow-y-auto pr-1"></div>
          </div>

          <!-- VIEW 8: DIARY VIEW -->
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

          <!-- VIEW 9: ENDING SCREEN -->
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
              <div>Tình cảm Triệu Mẫn: <b id="endStatLove" class="text-pink-400">0%</b></div>
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
        <button id="btnFooterSell" onclick="openShopSellCard()" class="rpg-btn flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">💼</span><span>Bán Hàng</span>
        </button>
        <button onclick="openTabAction('study')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">📖</span><span>Học Tập</span>
        </button>
        <button onclick="openLeaderboard()" class="rpg-btn flex-1 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">🏆</span><span>Thi Đua</span>
        </button>
        <button onclick="openTabAction('friends')" class="rpg-btn flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1">
          <span class="text-sm">👥</span><span>Bạn Bè</span>
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
      playCash() {
        if (!this.enabled) return; this.init();
        [987, 1318].forEach((f, idx) => {
          setTimeout(() => this.playTone(f, 'sine', 0.18, 0.2), idx * 80);
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

    const WHOLESALE_ITEMS = [
      { id: 'banh_trang', name: 'Bánh Tráng Cuộn Bơ', wholesalePrice: 7000, retailPrice: 12000, icon: '🌯', desc: 'Món ăn vặt số 1 giờ ra chơi & lúc tan trường.' },
      { id: 'tra_sua_chai', name: 'Trà Sữa Thái Đóng Chai', wholesalePrice: 10000, retailPrice: 18000, icon: '🧋', desc: 'Mát lạnh, hút khách nữ sau giờ tan học.' },
      { id: 'but_cute', name: 'Bút Bi Gel Cute Pastel', wholesalePrice: 4000, retailPrice: 8000, icon: '🖊️', desc: 'Đồ dùng học tập bạn nào cũng cần.' },
      { id: 'de_cuong', name: 'Tài Liệu & Đề Cương Tóm Tắt', wholesalePrice: 3000, retailPrice: 10000, icon: '📑', desc: 'Siêu đắt hàng trước kỳ thi!' }
    ];

    const QUIZ_DATABASE = [
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Nếu x + 5 = 12 thì giá trị của biểu thức 2x - 4 bằng bao nhiêu?', opts: ['10', '14', '7', '18'], c: 0, tip: 'x = 7 => 2(7) - 4 = 10.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Hàm số y = x² - 4x + 3 có hoành độ đỉnh Parabol bằng?', opts: ['2', '-2', '4', '1'], c: 0, tip: 'x = -b/(2a) = 4/2 = 2.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Đạo hàm của hàm số f(x) = x³ - 3x² + 5 là:', opts: ['3x² - 6x', '3x² - 6', 'x² - 3x', '3x² - 6x + 5'], c: 0, tip: '(x³)\\'=3x², (-3x²)\\'=-6x.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Một khối lập phương cạnh bằng 3 cm có thể tích bằng:', opts: ['27 cm³', '9 cm³', '54 cm³', '18 cm³'], c: 0, tip: 'V = 3³ = 27 cm³.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Nghiệm của phương trình 2^(x - 1) = 8 là:', opts: ['x = 4', 'x = 3', 'x = 5', 'x = 2'], c: 0, tip: '8 = 2³ => x - 1 = 3 => x = 4.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Giá trị của log₂ 32 bằng bao nhiêu?', opts: ['5', '6', '4', '16'], c: 0, tip: '2⁵ = 32 nên log₂ 32 = 5.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Hình chóp tam giác đều có bao nhiêu mặt?', opts: ['4 mặt', '3 mặt', '5 mặt', '6 mặt'], c: 0, tip: '1 đáy + 3 mặt bên = 4 mặt.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍‍🏫', q: 'Nguyên hàm của f(x) = cos(x) là:', opts: ['sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C'], c: 0, tip: '(sin x)\\' = cos x.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Đường tiệm cận đứng của đồ thị y = (2x + 1)/(x - 3) là:', opts: ['x = 3', 'x = 2', 'y = 2', 'y = 3'], c: 0, tip: 'Mẫu số triệt tiêu tại x = 3.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Tập xác định của hàm số y = √(x - 4) là:', opts: ['[4; +∞)', '(4; +∞)', '(-∞; 4]', 'R \\\\ {4}'], c: 0, tip: 'x - 4 >= 0 => x >= 4.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Công thức diện tích xung quanh của hình trụ bán kính r, chiều cao h là:', opts: ['2πrh', 'πr²h', 'πrh', '4πr²'], c: 0, tip: 'S_xq = 2πrh.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Số tổ hợp chập 2 của 5 phần tử C(5, 2) bằng:', opts: ['10', '20', '15', '5'], c: 0, tip: '5! / (2! * 3!) = 10.' },

      { subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Trong dao động điều hòa của con lắc lò xo, cơ năng biến thiên như thế nào?', opts: ['Bảo toàn không đổi', 'Tăng giảm tuần hoàn', 'Bằng 0', 'Luôn giảm'], c: 0, tip: 'Cơ năng của dao động điều hòa luôn được bảo toàn.' },
      { subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Sóng âm truyền nhanh nhất trong môi trường nào?', opts: ['Chất rắn', 'Chất lỏng', 'Chất khí', 'Chân không'], c: 0, tip: 'V_rắn > V_lỏng > V_khí.' },
      { subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Tần số góc ω của con lắc lò xo độ cứng k, khối lượng m tính bởi công thức:', opts: ['√(k/m)', '√(m/k)', '2π√(m/k)', '√(g/l)'], c: 0, tip: 'ω = √(k/m).' },
      { subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Tia nào sau đây có bản chất là sóng điện từ?', opts: ['Tia X', 'Tia Alpha', 'Tia Beta cộng', 'Tia Beta trừ'], c: 0, tip: 'Tia X và tia gamma là sóng điện từ.' },
      { subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Dòng điện xoay chiều có tần số f = 50Hz thì chu kỳ T bằng:', opts: ['0,02 s', '0,05 s', '0,5 s', '0,2 s'], c: 0, tip: 'T = 1/f = 1/50 = 0,02 s.' },
      { subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Tốc độ ánh sáng trong chân không có giá trị xấp xỉ bằng:', opts: ['3.10⁸ m/s', '3.10⁶ m/s', '340 m/s', '1.10⁸ m/s'], c: 0, tip: 'c ≈ 3.10⁸ m/s.' },

      { subject: 'MÔN HÓA HỌC', teacher: 'Cô Lan Phương', avatar: '👩‍🔬', q: 'Kim loại nào dẫn điện tốt nhất ở điều kiện thường?', opts: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'], c: 0, tip: 'Thứ tự dẫn điện: Ag > Cu > Au > Al > Fe.' },
      { subject: 'MÔN HÓA HỌC', teacher: 'Cô Lan Phương', avatar: '👩‍🔬', q: 'Dung dịch làm quỳ tím hóa đỏ là:', opts: ['HCl', 'NaOH', 'NaCl', 'H₂O'], c: 0, tip: 'Axit làm quỳ tím chuyển sang màu đỏ.' },
      { subject: 'MÔN HÓA HỌC', teacher: 'Cô Lan Phương', avatar: '👩‍🔬', q: 'Kim loại nào ở trạng thái lỏng tại nhiệt độ phòng?', opts: ['Thủy ngân (Hg)', 'Xesi (Cs)', 'Liti (Li)', 'Chì (Pb)'], c: 0, tip: 'Thủy ngân (Hg) nóng chảy ở -38.83°C.' },
      { subject: 'MÔN HÓA HỌC', teacher: 'Cô Lan Phương', avatar: '👩‍🔬', q: 'Chất nào là đồng phân của glucozơ?', opts: ['Fructozơ', 'Saccarozơ', 'Mantozơ', 'Tinh bột'], c: 0, tip: 'Glucozơ và Fructozơ cùng có CTPT C₆H₁₂O₆.' },
      { subject: 'MÔN HÓA HỌC', teacher: 'Cô Lan Phương', avatar: '👩‍🔬', q: 'Khí thoát ra khi cho CaCO₃ tác dụng với dung dịch HCl dư là:', opts: ['CO₂', 'SO₂', 'H₂', 'Cl₂'], c: 0, tip: 'CaCO₃ + 2HCl -> CaCl₂ + CO₂↑ + H₂O.' },

      { subject: 'MÔN SINH HỌC', teacher: 'Thầy Đức', avatar: '👨‍🏫', q: 'Bào quan nào là “nhà máy năng lượng” sản xuất ATP của tế bào?', opts: ['Ty thể', 'Ribôxôm', 'Bộ máy Golgi', 'Lizôxôm'], c: 0, tip: 'Ty thể diễn ra hô hấp tế bào tổng hợp ATP.' },
      { subject: 'MÔN SINH HỌC', teacher: 'Thầy Đức', avatar: '👨‍🏫', q: 'Bộ ba mã mở đầu trên mARN dịch mã cho axit amin Metionin là:', opts: ['5\\'AUG3\\'', '5\\'UAG3\\'', '5\\'UAA3\\'', '5\\'UGA3\\''], c: 0, tip: '5\\'AUG3\\' quy định mã mở đầu (Met).' },
      { subject: 'MÔN SINH HỌC', teacher: 'Thầy Đức', avatar: '👨‍🏫', q: 'Người mắc hội chứng Đao (Down) có bao nhiêu nhiễm sắc thể?', opts: ['47 NST (3 NST số 21)', '45 NST', '46 NST', '48 NST'], c: 0, tip: 'Thể ba ở cặp NST số 21 (2n + 1 = 47).' },

      { subject: 'MÔN NGỮ VĂN', teacher: 'Cô Thảo', avatar: '👩‍🏫', q: 'Ai là tác giả của tác phẩm “Vợ Nhặt”?', opts: ['Kim Lân', 'Nam Cao', 'Tô Hoài', 'Nguyễn Tuân'], c: 0, tip: 'Kim Lân viết về nạn đói năm 1945 và tình người.' },
      { subject: 'MÔN NGỮ VĂN', teacher: 'Cô Thảo', avatar: '👩‍🏫', q: 'Hình tượng người lính trong bài thơ “Tây Tiến” nổi bật với vẻ đẹp:', opts: ['Lãng mạn và bi tráng', 'Mộc mạc nông dân', 'U uất bi quan', 'Thần thánh hóa'], c: 0, tip: 'Chất lãng mạn kết hợp cảm hứng bi tráng.' },
      { subject: 'MÔN NGỮ VĂN', teacher: 'Cô Thảo', avatar: '👩‍‍🏫', q: 'Nhân vật bà cụ Tứ xuất hiện trong tác phẩm văn học nào?', opts: ['Vợ Nhặt', 'Chí Phèo', 'Vợ chồng A Phủ', 'Rừng xà nu'], c: 0, tip: 'Bà cụ Tứ là mẹ của anh cu Tràng trong Vợ Nhặt.' },
      { subject: 'MÔN NGỮ VĂN', teacher: 'Cô Thảo', avatar: '👩‍🏫', q: 'Tác phẩm “Chiếc thuyền ngoài xa” là sáng tác của nhà văn nào?', opts: ['Nguyễn Minh Châu', 'Nguyễn Khải', 'Nguyễn Trung Thành', 'Lưu Quang Vũ'], c: 0, tip: 'Nguyễn Minh Châu - người mở đường tinh anh.' },

      { subject: 'MÔN LỊCH SỬ', teacher: 'Thầy Hùng', avatar: '👨‍🏫', q: 'Chiến thắng Điện Biên Phủ diễn ra vào năm nào?', opts: ['1954', '1945', '1975', '1968'], c: 0, tip: 'Toàn thắng ngày 07/05/1954.' },
      { subject: 'MÔN LỊCH SỬ', teacher: 'Thầy Hùng', avatar: '👨‍🏫', q: 'Bản Tuyên ngôn Độc lập được Bác Hồ đọc vào ngày nào?', opts: ['02/09/1945', '19/08/1945', '30/04/1975', '03/02/1930'], c: 0, tip: 'Ngày 2/9/1945 tại Quảng trường Ba Đình.' },
      { subject: 'MÔN ĐỊA LÝ', teacher: 'Cô Mai Anh', avatar: '👩‍🏫', q: 'Đỉnh núi nào được mệnh danh là “Nóc nhà Đông Dương”?', opts: ['Fansipan (3.143m)', 'Pu Si Lung', 'Bạch Mộc Lương Tử', 'Tây Côn Lĩnh'], c: 0, tip: 'Fansipan cao 3.143m ở Lào Cai.' },
      { subject: 'MÔN ĐỊA LÝ', teacher: 'Cô Mai Anh', avatar: '👩‍‍🏫', q: 'Cây công nghiệp lâu năm được trồng nhiều nhất ở Tây Nguyên là:', opts: ['Cà phê', 'Cao su', 'Chè', 'Hồ tiêu'], c: 0, tip: 'Tây Nguyên là thủ phủ cà phê của Việt Nam.' },

      { subject: 'MÔN TIẾNG ANH', teacher: 'Cô Jennifer', avatar: '👩‍💼', q: 'She has been studying in this school ___ 2022.', opts: ['since', 'for', 'in', 'at'], c: 0, tip: 'Since + mốc thời gian trong hiện tại hoàn thành.' },
      { subject: 'MÔN TIẾNG ANH', teacher: 'Cô Jennifer', avatar: '👩‍💼', q: 'If I ___ rich, I would travel around the world.', opts: ['were', 'am', 'will be', 'have been'], c: 0, tip: 'Câu điều kiện loại 2: If + S + were.' },
      { subject: 'MÔN TIẾNG ANH', teacher: 'Cô Jennifer', avatar: '👩‍💼', q: 'The book ___ by my favorite author last year.', opts: ['was written', 'wrote', 'has written', 'writes'], c: 0, tip: 'Bị động quá khứ đơn: was/were + V3/ed.' }
    ];

    const STATE = {
      day: 1,
      totalDays: 45,
      timeIndex: 0,
      location: 'class',
      
      stats: {
        hp: 85,
        energy: 100,
        mood: 75,
        study: 50,
        friends: 40,
        love: 20,
        reputation: 15,
        money: 60000,
        midtermScore: 0,
        finalScore: 0
      },

      inventory: [
        { id: 'banh_trang', count: 4 },
        { id: 'tra_sua_chai', count: 2 },
        { id: 'but_cute', count: 3 },
        { id: 'de_cuong', count: 2 }
      ],

      bag: [
        { id: 'math_book', name: 'Sổ Công Thức Toán', icon: '📘', count: 1, desc: 'Dùng khi học bài +8 📚' }
      ],

      todayEvents: [],
      diaryEntries: [],

      exam: {
        type: 'midterm',
        inProgress: false,
        currentStep: 0,
        questions: [],
        correctCount: 0
      }
    };

    const TIME_PERIODS = [
      { text: '07:30', name: 'Buổi sáng • Tiết 1-2', canSell: true },
      { text: '09:15', name: 'Giờ ra chơi 15 phút', canSell: true },
      { text: '11:30', name: 'Tan trường trưa • Ăn trưa nghỉ ngơi', canSell: false },
      { text: '14:00', name: 'Buổi chiều • Thư viện / Tiết học chính', canSell: false },
      { text: '17:00', name: 'Chiều muộn sau 17h • Tan trường bán đồ', canSell: true },
      { text: '20:30', name: 'Buổi tối • Tự học khuya tại nhà', canSell: false }
    ];

    const DAYS_OF_WEEK = ['THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY', 'CHỦ NHẬT'];

    function isSellingAllowed() {
      const cur = TIME_PERIODS[STATE.timeIndex];
      return cur && cur.canSell === true;
    }

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
        descEl.textContent = isSellingAllowed() 
          ? 'Đang trong giờ bán hàng! Bạn bè tranh thủ mua bánh tráng, trà sữa và đồ dùng.'
          : 'Giờ học chính khóa! Cất hết đồ buôn bán vào cặp và tập trung nghe giảng.';
      } else if (loc === 'canteen') {
        titleEl.textContent = 'CĂN TIN TRƯỜNG - CÔ NĂM';
        iconEl.textContent = '🍜';
        descEl.textContent = 'Căn tin nhộn nhịp, nơi mua đồ ăn ngon hoặc mua trà sữa đãi Triệu Mẫn!';
        openCanteenMenu();
      } else if (loc === 'library') {
        titleEl.textContent = 'THƯ VIỆN YÊN TĨNH';
        iconEl.textContent = '📚';
        descEl.textContent = 'Không gian tĩnh mịch ngập tràn sách vở. Triệu Mẫn cũng thường hay ngồi đọc sách ở góc bàn cạnh cửa sổ.';
      } else if (loc === 'yard') {
        titleEl.textContent = 'SÂN TRƯỜNG & CÂY BÀNG';
        iconEl.textContent = '🌿';
        descEl.textContent = isSellingAllowed()
          ? 'Sau 17:00 học sinh ùa ra sân trường, cơ hội tuyệt vời để chào bán trà sữa và đồ ăn vặt!'
          : 'Sân trường rợp bóng mát, nơi bạn bè tụ tập thư giãn giữa các ca học.';
      } else if (loc === 'home') {
        titleEl.textContent = 'PHÒNG NGỦ & BÀN HỌC Ở NHÀ';
        iconEl.textContent = '🏠';
        descEl.textContent = 'Góc học tập ban đêm. Ngồi ôn lại bài, chuẩn bị đề thi ngày mai và đi ngủ đúng giờ.';
      }
      updateHUD();
    }

    function openLeaderboard() {
      closeOverlayCard();
      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const card = document.getElementById('leaderboardCard');
      card.classList.remove('hidden');

      const students = [
        { name: 'Triệu Mẫn (Lớp Phó Học Tập)', baseScore: 92, avatar: '👸', title: 'Học bá toàn diện' },
        { name: 'Bạn (Người Chơi)', baseScore: STATE.stats.study, avatar: '😎', title: 'Vừa học vừa kinh doanh' },
        { name: 'Lan (Bạn Thân)', baseScore: 68, avatar: '👧', title: 'Chuyên gia hỗ trợ' },
        { name: 'Tuấn (Bóng Rổ)', baseScore: 55, avatar: '🏀', title: 'Ngôi sao thể thao' },
        { name: 'Hoàng Nam', baseScore: 84, avatar: '🤓', title: 'Cần cù bù thông minh' },
        { name: 'Bảo Trân', baseScore: 78, avatar: '✨', title: 'Cán sự văn thể' }
      ];

      students.sort((a, b) => b.baseScore - a.baseScore);

      const list = document.getElementById('leaderboardList');
      list.innerHTML = '';

      students.forEach((st, idx) => {
        const isPlayer = st.name.includes('Bạn');
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

    function openShopSellCard() {
      closeOverlayCard();

      if (!isSellingAllowed()) {
        audio.playWrong();
        showStatAlert('⛔ Bây giờ là giờ học! Chỉ được bán lúc 07:30, 09:15 hoặc sau 17:00.', 'text-rose-400');
        alert('⛔ QUY TẮC: Khung giờ này (' + TIME_PERIODS[STATE.timeIndex].text + ') bắt buộc phải tập trung học!\\nKhung giờ bán hàng: Buổi sáng (07:30), Giờ ra chơi (09:15) và Chiều muộn (Sau 17:00).');
        return;
      }

      document.getElementById('sceneryAvatarGroup').classList.add('hidden');
      const shopCard = document.getElementById('shopSellCard');
      shopCard.classList.remove('hidden');

      renderStockList();
    }

    function renderStockList() {
      const container = document.getElementById('stockListContainer');
      container.innerHTML = '';
      let totalStock = 0;

      WHOLESALE_ITEMS.forEach(item => {
        const inv = STATE.inventory.find(i => i.id === item.id);
        const count = inv ? inv.count : 0;
        totalStock += count;

        const row = document.createElement('div');
        row.className = 'bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs';
        row.innerHTML = \`
          <div class="flex items-center gap-2">
            <span class="text-xl">\${item.icon}</span>
            <div>
              <div class="font-bold text-slate-200">\${item.name} <span class="text-amber-400 font-mono">(Còn \${count})</span></div>
              <div class="text-[10px] text-slate-400">Giá bán lẻ: <b class="text-emerald-400">\${item.retailPrice.toLocaleString('vi-VN')}đ</b> • Giá sỉ: \${item.wholesalePrice.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
          <button \${count <= 0 ? 'disabled' : ''} onclick="sellSingleItem('\${item.id}')" class="px-2.5 py-1.5 \${count > 0 ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} font-bold rounded-lg text-[11px] transition">
            Bán 1 Cái
          </button>
        \`;
        container.appendChild(row);
      });

      if (totalStock === 0) {
        container.innerHTML += \`<div class="p-3 text-center text-rose-400 text-[11px] italic bg-rose-950/20 rounded-xl border border-rose-900/50">Hết sạch hàng trong cặp rồi! Bấm "Nhập Thêm Hàng Sỉ" bên dưới để lấy thêm hàng nhé.</div>\`;
      }
    }

    function sellSingleItem(itemId) {
      if (!isSellingAllowed()) { showStatAlert('⛔ Đã hết giờ bán hàng!', 'text-rose-400'); return; }
      if (STATE.stats.energy < 8) { showStatAlert('⚡ Bạn quá mệt mỏi để chào bán hàng!', 'text-amber-400'); audio.playWrong(); return; }

      const inv = STATE.inventory.find(i => i.id === itemId);
      const itemInfo = WHOLESALE_ITEMS.find(i => i.id === itemId);

      if (!inv || inv.count <= 0) { showStatAlert('Món này đã hết hàng!', 'text-rose-400'); return; }

      inv.count--;
      const profit = itemInfo.retailPrice;
      modifyStats({ money: +profit, energy: -8, mood: +3, rep: +2 });
      audio.playCash();
      showStatAlert(\`💵 Bán được 1 \${itemInfo.name}! Thu về +\${profit.toLocaleString('vi-VN')}đ\`, 'text-emerald-400');
      STATE.todayEvents.push(\`Bán lẻ 1 \${itemInfo.name}, thu về \${profit.toLocaleString('vi-VN')}đ.\`);
      renderStockList();
    }

    function sellToCrowd() {
      if (!isSellingAllowed()) { showStatAlert('⛔ Hết giờ bán rồi, vào tiết học bài thôi!', 'text-rose-400'); return; }
      if (STATE.stats.energy < 15) { showStatAlert('⚡ Cần ít nhất 15 Năng Lượng!', 'text-amber-400'); audio.playWrong(); return; }

      let totalSold = 0;
      let totalMoney = 0;

      STATE.inventory.forEach(inv => {
        if (inv.count > 0) {
          const sellCount = Math.min(inv.count, Math.floor(Math.random() * 2) + 1);
          inv.count -= sellCount;
          totalSold += sellCount;
          const info = WHOLESALE_ITEMS.find(i => i.id === inv.id);
          if (info) totalMoney += sellCount * info.retailPrice;
        }
      });

      if (totalSold === 0) { showStatAlert('Cặp rỗng túi! Hãy nhập hàng sỉ trước đã.', 'text-rose-400'); return; }

      modifyStats({ money: +totalMoney, energy: -15, mood: +5, rep: +5 });
      audio.playSuccess();
      showStatAlert(\`🎉 Đợt bán đại thành công! Bán vèo \${totalSold} món, thu về +\${totalMoney.toLocaleString('vi-VN')}đ!\`, 'text-emerald-400');
      STATE.todayEvents.push(\`Đợt bán hàng nhộn nhịp thu về \${totalMoney.toLocaleString('vi-VN')}đ.\`);
      renderStockList();
      advanceTime();
    }

    function openWholesaleTab() {
      document.getElementById('shopSellCard').classList.add('hidden');
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
              <div class="text-[10px] text-slate-400">Giá sỉ: <b class="text-blue-400">\${item.wholesalePrice.toLocaleString('vi-VN')}đ</b> • Giá bán: \${item.retailPrice.toLocaleString('vi-VN')}đ</div>
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
        showStatAlert('💸 Tiền trong ví không đủ để nhập gói sỉ này!', 'text-rose-400');
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
      STATE.todayEvents.push(\`Bỏ ra \${cost.toLocaleString('vi-VN')}đ lấy 3 phần sỉ \${item.name}.\`);
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
      document.getElementById('quizTeacherAvatar').textContent = q.avatar || '👨‍‍🏫';
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
        STATE.todayEvents.push(\`Trả lời xuất sắc câu hỏi \${q.subject} của \${q.teacher}, Triệu Mẫn khẽ gật đầu khen ngợi.\`);
      } else {
        modifyStats({ study: +3, mood: -5, energy: -15 });
        audio.playWrong();
        showStatAlert(\`😭 Sai rồi! Gợi ý: \${q.tip} (+3 📚, -5 😊)\`, 'text-rose-400');
        STATE.todayEvents.push(\`Lúng túng trước câu hỏi \${q.subject}, quyết tâm tối về cày đề thêm.\`);
      }
      advanceTime();
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
        STATE.todayEvents.push('Buổi tối sau khi ăn cơm xong, ngồi vào bàn học cày đề đại học đến khuya.');
      } else {
        STATE.todayEvents.push('Buổi chiều không bán hàng, lên thư viện ngồi yên tĩnh đọc thêm tài liệu nâng cao.');
      }
      advanceTime();
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
          alert(\`🎉 KẾT QUẢ GIỮA KỲ: Đúng \${STATE.exam.correctCount}/10 câu!\\nĐiểm thi đã được cộng vào chỉ số Học tập và Bảng Xếp Hạng Lớp 12A3!\`);
          STATE.todayEvents.push(\`Hoàn thành xuất sắc kỳ thi giữa kỳ với số điểm \${STATE.exam.correctCount}/10.\`);
          closeOverlayCard();
        } else {
          STATE.stats.finalScore = STATE.exam.correctCount;
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
        STATE.todayEvents.push('Bao Triệu Mẫn ăn trưa tại căn tin, nhìn nụ cười duyên dáng của Mẫn mà lòng xao xuyến.');
      } else {
        STATE.todayEvents.push(\`Ghé căn tin làm một phần \${name} ngon lành nạp lại sức.\`);
      }
      advanceTime();
    }

    function interactNPC(who) {
      audio.playTone(450, 'triangle', 0.1);
      if (who === 'mẫn') {
        if (STATE.stats.energy < 10) { showStatAlert('Bạn quá mệt để bắt chuyện với Triệu Mẫn!', 'text-amber-400'); return; }
        modifyStats({ energy: -10, mood: +15, love: +7, study: +3 });
        showStatAlert('💕 Triệu Mẫn chia sẻ bí quyết học tốt và cười dịu dàng! (+7 💕, +3 📚)', 'text-pink-400');
        STATE.todayEvents.push('Cùng Triệu Mẫn đứng trao đổi phương pháp giải đề Toán bên hành lang lớp học.');
        advanceTime();
      } else if (who === 'lan') {
        modifyStats({ energy: -10, mood: +10, friends: +8, study: +4 });
        showStatAlert('👧 Mượn vở Lan chép bài & cùng ăn quà (+8 👥, +4 📚)', 'text-sky-400');
        STATE.todayEvents.push('Ngồi trao đổi bài vở với nhỏ bạn thân Lan, hai đứa vừa học vừa tính chuyện bán hàng.');
        advanceTime();
      } else if (who === 'tuan') {
        modifyStats({ energy: -15, hp: +10, mood: +10, friends: +8 });
        showStatAlert('🏀 Ra sân ném bóng rổ với Tuấn (+10 ❤️, +10 😊)', 'text-amber-400');
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
      STATE.stats.money += 20000;

      let diaryStory = [];
      diaryStory.push(\`Hôm nay là Ngày thứ \${STATE.day} lớp 12.\`);

      if (STATE.todayEvents.length > 0) {
        diaryStory.push(STATE.todayEvents.join(' '));
      } else {
        diaryStory.push('Một ngày học tập và sắp xếp buôn bán trôi qua trọn vẹn.');
      }

      if (STATE.stats.love >= 60) {
        diaryStory.push('Dạo này Triệu Mẫn hay quan tâm đến việc học và sức khỏe của mình hơn trước. Có lẽ nào Mẫn cũng có tình cảm với mình? 💕');
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
      document.getElementById('diaryForecastNextDay').textContent = forecast;

      document.getElementById('btnContinueFromDiary').onclick = () => {
        closeOverlayCard();
        STATE.day++;
        STATE.timeIndex = 0;
        gotoLocation('class');

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

      let title = '';
      let sub = '';
      let desc = '';

      const s = STATE.stats;
      const totalScore = s.study + (s.finalScore * 10);

      if (totalScore >= 160 && s.love >= 70) {
        title = '🏆 THỦ KHOA SONG HÀNH CÙNG TRIỆU MẪN';
        sub = 'Cùng bước vào cánh cổng Đại Học Ngoại Thương & Lời hẹn ước trăm năm';
        desc = 'Một cái kết hoàn hảo như phim! Bạn đạt điểm số thi tốt nghiệp kỷ lục, vượt qua cả lớp phó Triệu Mẫn để giành vị trí Thủ khoa toàn trường. Trong buổi lễ bế giảng, Triệu Mẫn đã chủ động trao cho bạn chiếc kẹp tóc kỷ vật và đồng ý cùng bạn viết tiếp chuyện tình thời sinh viên!';
      } else if (totalScore >= 150) {
        title = '🎓 HỌC BÁ ĐẠI HỌC QUỐC GIA';
        sub = 'Bảng vàng ghi danh, vươn lên Top 1 thi đua';
        desc = 'Với sự nỗ lực vượt bậc ở các ca học chiều và tối, bạn đã thi đỗ vào ngành công nghệ / kinh tế mũi nhọn với số điểm cao ngất ngưởng. Bạn là niềm tự hào của lớp 12A3!';
      } else if (s.money >= 400000) {
        title = '💼 TỔNG TÀI KHỞI NGHIỆP TRẺ TUỔI';
        sub = 'Triệu Mẫn làm trợ lý tài chính tài ba';
        desc = 'Số vốn tích lũy từ buôn bán học đường cùng tư duy nhạy bén đã biến bạn thành một startup trẻ đầy triển vọng ngay sau khi ra trường!';
      } else {
        title = '🌸 KỶ NIỆM THANH XUÂN RỰC RỠ';
        sub = 'Những năm tháng áo trắng khó phai mờ';
        desc = 'Hoàn thành bài thi và quãng đời học sinh với muôn vàn cảm xúc: từng gói bánh tráng giờ ra chơi, nụ cười của Triệu Mẫn và những buổi chiều ôn thi miệt mài sẽ mãi là ký ức đẹp nhất.';
      }

      document.getElementById('endingTitle').textContent = title;
      document.getElementById('endingSubtitle').textContent = sub;
      document.getElementById('endingDescription').textContent = desc;

      document.getElementById('endStatStudy').textContent = s.study;
      document.getElementById('endStatRank').textContent = totalScore >= 150 ? '#1 Toàn Khối' : '#2 Lớp 12A3';
      document.getElementById('endStatMoney').textContent = \`\${s.money.toLocaleString('vi-VN')}đ\`;
      document.getElementById('endStatLove').textContent = \`\${s.love}%\`;
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
        title.textContent = '📖 HOẠT ĐỘNG HỌC TẬP (100+ CÂU HỎI TRẮC NGHIỆM)';
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
      } else if (tab === 'friends') {
        title.textContent = '👥 BẠN BÈ & TRIỆU MẪN';
        content.innerHTML = \`
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>👸</span><div><b>Triệu Mẫn</b> <span class="text-[10px] text-pink-400">Lớp phó & Crush 💕</span></div></div>
              <button onclick="interactNPC('mẫn')" class="px-2.5 py-1 bg-pink-600 rounded text-[11px] font-bold">Hỏi bài</button>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>👧</span><div><b>Lan</b> <span class="text-[10px] text-slate-400">Bạn thân</span></div></div>
              <button onclick="interactNPC('lan')" class="px-2.5 py-1 bg-sky-600 rounded text-[11px] font-bold">Tám chuyện</button>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
              <div class="flex items-center gap-2"><span>🏀</span><div><b>Tuấn</b> <span class="text-[10px] text-amber-400">Bóng Rổ</span></div></div>
              <button onclick="interactNPC('tuan')" class="px-2.5 py-1 bg-amber-600 rounded text-[11px] font-bold">Ném bóng</button>
            </div>
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
      document.getElementById('shopSellCard').classList.add('hidden');
      document.getElementById('wholesaleCard').classList.add('hidden');
      document.getElementById('canteenMenuCard').classList.add('hidden');
      document.getElementById('diaryModalCard').classList.add('hidden');
      document.getElementById('sceneryAvatarGroup').classList.remove('hidden');
      closeDrawer();
    }

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
      document.getElementById('statLove').textContent = \`\${STATE.stats.love}%\`;
      document.getElementById('statMoney').textContent = \`\${STATE.stats.money.toLocaleString('vi-VN')}đ\`;

      const statusTag = document.getElementById('businessStatusTag');
      const btnSell = document.getElementById('btnFooterSell');

      if (curPeriod.canSell) {
        statusTag.textContent = '🟢 ĐƯỢC PHÉP BÁN HÀNG';
        statusTag.className = 'text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 border border-emerald-500 text-emerald-300';
        btnSell.className = 'rpg-btn flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1';
      } else {
        statusTag.textContent = '🔒 GIỜ HỌC / ĐÓNG CỬA HÀNG';
        statusTag.className = 'text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-rose-950 border border-rose-600 text-rose-300';
        btnSell.className = 'rpg-btn flex-1 py-2 rounded-lg bg-slate-800 text-slate-500 text-xs font-bold pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1 opacity-70';
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
        document.getElementById('saveStatus').textContent = 'ĐÃ LƯU';
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
    });
  </script>
</body>
</html>`;

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        title="Thanh Xuân Rực Rỡ: Học Sinh & Con Buôn Học Đường"
        srcDoc={gameHtml}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
