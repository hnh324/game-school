import React from 'react';

export default function App() {
  const gameHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanh Xuân Rực Rỡ 7.4 - Thời Gian Tự Động Trôi</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #030712; color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 12px; overflow-x: hidden; }

    .console-shell {
      width: 100%;
      max-width: 860px;
      background: linear-gradient(145deg, #0f172a, #020617);
      border: 4px solid #1e293b;
      box-shadow: 0 0 0 4px #020617, 0 0 25px rgba(56, 189, 248, 0.25), 0 20px 40px rgba(0,0,0,0.8);
      border-radius: 28px;
      padding: 16px;
      position: relative;
    }

    .screen-bezel {
      background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
      border: 3px solid #1e293b;
      border-radius: 20px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.9);
      position: relative;
      min-height: 580px;
    }

    .pixel-box {
      background: rgba(15, 23, 42, 0.85);
      border: 2px solid #334155;
      border-radius: 12px;
      padding: 10px 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }

    .pixel-btn {
      background: #1e293b;
      color: #f1f5f9;
      border: 2px solid #475569;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 3px 0 #0f172a;
      transition: all 0.08s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .pixel-btn:hover { filter: brightness(1.2); }
    .pixel-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 #0f172a; }

    .btn-pink { background: #9d174d; border-color: #db2777; color: #fdf2f8; }
    .btn-blue { background: #1e40af; border-color: #3b82f6; color: #eff6ff; }
    .btn-green { background: #065f46; border-color: #10b981; color: #ecfdf5; }
    .btn-yellow { background: #b45309; border-color: #f59e0b; color: #fffbeb; }
    .btn-purple { background: #6b21a8; border-color: #a855f7; color: #faf5ff; }
    .btn-red { background: #991b1b; border-color: #ef4444; color: #fef2f2; }

    .flex-row-between { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .flex-wrap { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

    .stat-chip {
      background: #090d16;
      border: 1px solid #1e293b;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      font-family: monospace;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stage-area {
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.9) 100%);
      border: 2px solid #1e293b;
      border-radius: 16px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 380px;
      position: relative;
    }

    .modal-card {
      position: absolute;
      inset: 12px;
      background: #0f172a;
      border: 2px solid #38bdf8;
      border-radius: 16px;
      padding: 16px;
      z-index: 40;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      overflow-y: auto;
    }
    .hidden { display: none !important; }

    .avatar-card { text-align: center; cursor: pointer; transition: transform 0.15s; }
    .avatar-card:hover { transform: scale(1.08); }
    .avatar-icon { font-size: 44px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)); }
    .avatar-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; background: #1e293b; border: 1px solid #334155; margin-top: 4px; display: inline-block; }

    #statAlertBox {
      position: absolute;
      top: 12px; right: 12px;
      background: rgba(0,0,0,0.85);
      border: 1px solid #10b981;
      color: #34d399;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 30;
      pointer-events: none;
    }
  </style>
</head>
<body>

  <canvas id="fireworksCanvas" style="position:fixed;inset:0;pointer-events:none;z-index:50;width:100%;height:100%;"></canvas>

  <div class="console-shell">
    
    <!-- TOP TOOLBAR -->
    <div class="flex-row-between" style="border-bottom: 2px solid #1e293b; padding-bottom: 8px; margin-bottom: 10px;">
      <div style="font-size: 10px; font-weight: 900; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
        <span style="width: 8px; height: 8px; background: #34d399; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #34d399;"></span>
        JRPG SCHOOL TYCOON 7.4
      </div>
      <div class="flex-wrap">
        <button onclick="openGiftShopModal()" class="pixel-btn btn-pink">🎁 TẶNG QUÀ</button>
        <button onclick="openCertModal()" class="pixel-btn btn-blue">🎓 CHỨNG CHỈ</button>
        <button onclick="openNameModal()" class="pixel-btn">👤 ĐỔI TÊN</button>
        <button onclick="openAchievementsModal()" class="pixel-btn btn-purple">🏅 THÀNH TỰU</button>
        <button onclick="openCloudModal()" class="pixel-btn btn-green">☁️ CLOUD</button>
        <button onclick="openHelpModal()" class="pixel-btn btn-yellow">📖 HƯỚNG DẪN</button>
        <button id="btnAudioToggle" class="pixel-btn">🔊 ÂM</button>
      </div>
    </div>

    <!-- MAIN SCREEN -->
    <div class="screen-bezel">

      <!-- TOP HUD -->
      <header class="pixel-box flex-row-between" style="flex-wrap: wrap;">
        <div>
          <div style="font-weight: 900; color: #fde047; font-size: 13px; display: flex; align-items: center; gap: 6px;">
            <span id="uiPlayerNameText" style="color: #38bdf8;">HỌC SINH</span> •
            <span id="uiDayOfWeek">THỨ HAI</span> •
            <span id="uiTimeText" style="color: #34d399; font-family: monospace; font-size: 15px; font-weight: 900; background: #020617; padding: 2px 6px; border-radius: 6px; border: 1px solid #1e293b;">07:00</span>
            <span style="background: #1e293b; color: #93c5fd; padding: 2px 6px; border-radius: 6px; font-size: 10px;">NGÀY <b id="uiDayCount">1</b>/45</span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px; display: flex; align-items: center; gap: 6px;">
            <span id="uiCurrentPeriodText">Đầu giờ sáng • Chuẩn bị vào lớp</span>
            <span id="uiHolidayBadge" class="hidden" style="background: #9d174d; color: #fbcfe8; padding: 1px 6px; border-radius: 4px; font-size: 9px; font-weight: bold;">🌸 DỊP LỄ</span>
          </div>
        </div>

        <div class="flex-wrap">
          <!-- ĐIỀU TỐC THỜI GIAN -->
          <div style="display:flex; gap:4px; align-items:center; background:#020617; padding:2px 6px; border-radius:8px; border:1px solid #1e293b; margin-right:4px;">
            <button onclick="setTimeSpeed(0)" id="btnSpeed0" class="pixel-btn" style="padding:2px 6px; font-size:9px;">⏸️</button>
            <button onclick="setTimeSpeed(1)" id="btnSpeed1" class="pixel-btn btn-blue" style="padding:2px 6px; font-size:9px;">▶️ 1x</button>
            <button onclick="setTimeSpeed(2)" id="btnSpeed2" class="pixel-btn" style="padding:2px 6px; font-size:9px;">⏩ 2x</button>
          </div>
          <div class="stat-chip" title="Sức Khỏe"><span>❤️</span><span id="statHp" style="color:#fb7185;">85</span></div>
          <div class="stat-chip" title="Năng Lượng"><span>⚡</span><span id="statEnergy" style="color:#fde047;">100</span></div>
          <div class="stat-chip" title="Tâm Trạng"><span>😊</span><span id="statMood" style="color:#facc15;">75</span></div>
          <div class="stat-chip" title="Điểm Học Tập"><span>📚</span><span id="statStudy" style="color:#38bdf8;">50</span></div>
          <div class="stat-chip" title="Tình Cảm Triệu Mẫn"><span>💕</span><span id="statLove" style="color:#f472b6;">20%</span></div>
          <div class="stat-chip" title="Ví Tiền"><span>💰</span><span id="statMoney" style="color:#34d399;">30.000đ</span></div>
        </div>
      </header>

      <!-- STAGE AREA -->
      <section class="stage-area">
        <div id="statAlertBox">+5 📚 Học tập</div>

        <div class="flex-row-between">
          <div style="background: rgba(2,6,23,0.8); border: 1px solid #334155; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; color: #fde047;">
            <span id="locIcon">🏫</span> <span id="locTitle">LỚP 12A3 - KHỐI CHUYÊN</span>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button id="btnSkipSchool" onclick="triggerSkipSchoolAction()" class="pixel-btn btn-red hidden" style="padding: 3px 8px; font-size: 10px;">
              🏃 Trốn Học Đi Chơi
            </button>
            <div id="businessStatusTag" style="font-size: 10px; font-weight: 800; font-family: monospace; padding: 4px 8px; border-radius: 6px; background: #064e3b; border: 1px solid #10b981; color: #a7f3d0;">
              🟢 ĐƯỢC PHÉP BÁN HÀNG
            </div>
          </div>
        </div>

        <!-- AVATARS -->
        <div id="sceneryAvatarGroup" style="text-align: center; margin: 16px 0;">
          <div style="display: flex; justify-content: center; gap: 36px; margin-bottom: 12px;">
            <div class="avatar-card" onclick="interactNPC('lan')">
              <div class="avatar-icon">👧</div>
              <div class="avatar-tag" style="color:#7dd3fc;">Lan (Bạn Thân)</div>
            </div>
            <div class="avatar-card" onclick="interactNPC('mẫn')">
              <div class="avatar-icon">👸</div>
              <div class="avatar-tag" style="color:#f472b6; border-color:#be185d;">Triệu Mẫn (Lớp Phó) 💕</div>
            </div>
            <div class="avatar-card" onclick="interactNPC('tuan')">
              <div class="avatar-icon">🏀</div>
              <div class="avatar-tag" style="color:#fde047;">Tuấn (Bóng Rổ)</div>
            </div>
          </div>

          <div style="background: linear-gradient(90deg, #2563eb, #7c3aed); color: white; font-weight: 900; font-size: 12px; padding: 6px 14px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.4);">
            THỜI GIAN ĐANG TỰ ĐỘNG CHẠY • ĐẾN GIỜ QUẦY SẼ TỰ ĐÓNG/MỞ!
          </div>
          <p id="sceneNarrative" style="font-size: 11px; color: #cbd5e1; font-style: italic; max-width: 500px; margin: 8px auto 0; line-height: 1.5;">
            "Đồng hồ đang tự động trôi từng phút! Sáng, ra chơi và tan trường khách tự tới mua đồ. Giờ học hãy tranh thủ cày đề ôn thi!"
          </p>
        </div>

        <!-- NAVIGATION -->
        <nav class="flex-row-between" style="border-top: 1px solid #1e293b; padding-top: 8px;">
          <button onclick="gotoLocation('class')" class="pixel-btn" style="flex:1;">🏫 Lớp Học</button>
          <button onclick="gotoLocation('canteen')" class="pixel-btn" style="flex:1;">🍜 Căn Tin</button>
          <button onclick="gotoLocation('library')" class="pixel-btn" style="flex:1;">📚 Thư Viện</button>
          <button onclick="gotoLocation('yard')" class="pixel-btn" style="flex:1;">🌿 Sân Trường</button>
          <button onclick="gotoLocation('home')" class="pixel-btn" style="flex:1;">🏠 Về Nhà</button>
        </nav>

        <!-- ==================== CÁC MODAL ==================== -->

        <!-- 1. QUẦY ORDER (TỰ ĐỘNG KHÁCH TỚI) -->
        <div id="shopOrderCard" class="modal-card hidden" style="border-color:#10b981;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div>
              <div style="font-weight: 900; color: #34d399; font-size: 13px;">🛎️ QUẦY ORDER HỌC ĐƯỜNG</div>
              <div style="font-size: 9px; color: #cbd5e1;">Khách tự động kéo tới đặt đơn, chuẩn bị hàng để giao nhé!</div>
            </div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <div style="background:#020617; padding:8px; border-radius:8px; display:flex; justify-content:space-around; font-size:10px; font-family:monospace;">
            <span id="stockBadgeBanhTrang">🌯 Bánh tráng: 0</span>
            <span id="stockBadgeTraSua">🧋 Trà sữa: 0</span>
            <span id="stockBadgeBut">🖊️ Bút: 0</span>
            <span id="stockBadgeDeCuong">📑 Đề cương: 0</span>
          </div>
          <div id="orderListContainer" style="display:flex; flex-direction:column; gap:8px; max-height:220px; overflow-y:auto;"></div>
          <div class="flex-row-between" style="border-top:1px solid #334155; padding-top:8px;">
            <button onclick="openWholesaleTab()" class="pixel-btn btn-blue" style="flex:1;">🚚 Chợ Sỉ Nhập Hàng</button>
            <div style="font-size:10px; color:#fde047; font-family:monospace; margin-left:8px;" id="orderAutoStatusText">⏳ Khách đang đến theo thời gian...</div>
          </div>
        </div>

        <!-- 2. CHỢ SỈ NHẬP HÀNG -->
        <div id="wholesaleCard" class="modal-card hidden" style="border-color:#3b82f6;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div style="font-weight: 900; color: #60a5fa; font-size: 13px;">🚚 CHỢ SỈ ĐẦU MỐI (NHẬP HÀNG TRẢ ORDER)</div>
            <button onclick="openShopOrderCard()" class="pixel-btn">← Quay lại Order</button>
          </div>
          <div id="wholesaleListContainer" style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto;"></div>
        </div>

        <!-- 3. TIỆM QUÀ TẶNG TRIỆU MẪN -->
        <div id="giftShopCard" class="modal-card hidden" style="border-color:#ec4899;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div style="font-weight: 900; color: #f472b6; font-size: 13px;">🎁 TIỆM QUÀ LƯU NIỆM TRIỆU MẪN</div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <div id="giftShopItemsList" style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto;"></div>
        </div>

        <!-- 4. TRUNG TÂM CHỨNG CHỈ -->
        <div id="certModalCard" class="modal-card hidden" style="border-color:#38bdf8;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div style="font-weight: 900; color: #38bdf8; font-size: 13px;">🎓 THI CHỨNG CHỈ QUỐC TẾ (MOS, TOEIC, IELTS, KẾ TOÁN)</div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <div id="certListContainer" style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto;"></div>
        </div>

        <!-- 5. BẢNG XẾP HẠNG THI ĐUA -->
        <div id="leaderboardCard" class="modal-card hidden" style="border-color:#f59e0b;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div style="font-weight: 900; color: #fde047; font-size: 13px;">🏆 BẢNG XẾP HẠNG THI ĐUA LỚP 12A3</div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <div id="leaderboardList" style="display:flex; flex-direction:column; gap:6px; max-height:240px; overflow-y:auto;"></div>
        </div>

        <!-- 6. THÀNH TỰU -->
        <div id="achievementsModalCard" class="modal-card hidden" style="border-color:#a855f7;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div>
              <div style="font-weight: 900; color: #c084fc; font-size: 13px;">🏅 THÀNH TỰU & DANH HIỆU</div>
              <div id="achieveSummary" style="font-size: 10px; color: #94a3b8;">Đã mở: 0/8 danh hiệu</div>
            </div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <div id="achievementsList" style="display:flex; flex-direction:column; gap:6px; max-height:240px; overflow-y:auto;"></div>
        </div>

        <!-- 7. ĐẶT TÊN -->
        <div id="nameModalCard" class="modal-card hidden" style="border-color:#38bdf8; max-width:400px; margin:auto;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div style="font-weight: 900; color: #38bdf8; font-size: 13px;">✍️ ĐẶT TÊN HỌC SINH</div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <p style="font-size: 11px; color: #cbd5e1;">Nhập tên để Triệu Mẫn, Lan và thầy cô gọi bạn nhé:</p>
          <input type="text" id="playerNameInput" maxlength="16" placeholder="Nhập tên của bạn..." style="background:#020617; border:2px solid #334155; border-radius:8px; padding:8px; color:#fde047; font-weight:bold; font-size:12px; outline:none;" />
          <button onclick="savePlayerName()" class="pixel-btn btn-blue" style="padding:8px;">XÁC NHẬN TÊN 🚀</button>
        </div>

        <!-- 8. HƯỚNG DẪN -->
        <div id="helpModalCard" class="modal-card hidden" style="border-color:#f59e0b;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div style="font-weight: 900; color: #fde047; font-size: 13px;">📖 HƯỚNG DẪN LUẬT CHƠI</div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <div style="font-size: 11px; line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">
            <div style="background:#020617; padding:8px; border-radius:8px; border:1px solid #1e293b;">
              <b style="color:#fde047;">1. Thời Gian Tự Động Trôi:</b><br/>
              • Giờ học sẽ liên tục trôi theo thời gian thực (có thể bấm ⏸️ tạm dừng hoặc ⏩ tua nhanh trên góc).<br/>
              • Đến các mốc giờ ra chơi, tan trường quầy sẽ tự động mở và khách tự tới mua đồ!
            </div>
            <div style="background:#020617; padding:8px; border-radius:8px; border:1px solid #1e293b;">
              <b style="color:#34d399;">2. Nhận Order & Trốn Học:</b><br/>
              • Giao đúng đơn nhận 5⭐ và tiền tip. Hết hàng thì vào "Chợ Sỉ" nhập về giao.<br/>
              • Trong giờ học có thể chọn học bài hoặc bấm "Trốn học đi chơi" xả stress!
            </div>
          </div>
          <button onclick="closeOverlayCard()" class="pixel-btn btn-yellow" style="padding:8px;">ĐÃ HIỂU, VÀO GAME NGAY! 🌸</button>
        </div>

        <!-- 9. CLOUD SAVE -->
        <div id="cloudModalCard" class="modal-card hidden" style="border-color:#6366f1;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div style="font-weight: 900; color: #818cf8; font-size: 13px;">☁️ ĐỒNG BỘ ĐA THIẾT BỊ (CLOUD SAVE)</div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <p style="font-size: 11px; color: #cbd5e1;">Sao chép mã này để đem sang điện thoại hoặc máy tính khác dán vào:</p>
          <textarea id="cloudSaveCodeInput" style="width:100%; height:70px; background:#020617; border:1px solid #334155; border-radius:8px; padding:6px; font-family:monospace; font-size:10px; color:#34d399; outline:none;"></textarea>
          <div style="display:flex; gap:8px;">
            <button onclick="exportSaveCode()" class="pixel-btn btn-blue" style="flex:1;">📋 Xuất Mã Hiện Tại</button>
            <button onclick="importSaveCode()" class="pixel-btn btn-green" style="flex:1;">📥 Tải Lại Từ Mã Này</button>
          </div>
        </div>

        <!-- 10. TIẾT HỌC TRÊN LỚP (QUIZ) -->
        <div id="classroomQuizCard" class="modal-card hidden" style="border-color:#38bdf8;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <span id="quizSubjectBadge" style="background:#1e3a8a; color:#bfdbfe; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:bold;">TIẾT HỌC</span>
            <span id="quizTeacherBadge" style="font-size:11px; color:#94a3b8;">Thầy Minh</span>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <div id="quizTeacherAvatar" style="font-size:32px;">👨‍🏫</div>
            <p id="quizTeacherQuestion" style="font-size:12px; font-weight:600; line-height:1.4; color:#f1f5f9;">Câu hỏi...</p>
          </div>
          <div id="quizOptionsContainer" style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:4px;"></div>
          <div class="flex-row-between" style="font-size:10px; color:#94a3b8; margin-top:4px;">
            <span>⚡ Tốn 15 Năng Lượng</span>
            <button id="btnSkipClass" style="background:none; border:none; color:#f43f5e; cursor:pointer; text-decoration:underline;">Gục đầu ngủ (+10 ⚡, -5 📚)</button>
          </div>
        </div>

        <!-- 11. BÀI THI GIỮA KỲ / CUỐI KỲ -->
        <div id="examMinigameCard" class="modal-card hidden" style="border-color:#f59e0b;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div>
              <h3 id="examModalTitle" style="font-weight:900; color:#fde047; font-size:13px;">📝 KỲ THI LỚP 12</h3>
              <span id="examProgressText" style="font-size:10px; color:#94a3b8; font-family:monospace;">CÂU 1 / 10</span>
            </div>
          </div>
          <div style="background:#020617; padding:8px; border-radius:8px;">
            <span id="examSubjectBadge" style="background:#1e3a8a; color:#bfdbfe; padding:1px 6px; border-radius:4px; font-size:9px; font-weight:bold;">MÔN TOÁN</span>
            <p id="examQuestionText" style="font-size:12px; font-weight:600; color:#f8fafc; margin-top:4px;">Nội dung câu thi...</p>
          </div>
          <div id="examOptionsContainer" style="display:grid; grid-template-columns:1fr 1fr; gap:6px;"></div>
          <div class="flex-row-between" style="font-size:10px; color:#94a3b8;">
            <span>Đang đúng: <b id="examCorrectCount" style="color:#34d399;">0</b>/10</span>
            <span style="color:#fde047;">Điểm thi quyết định xếp hạng tốt nghiệp!</span>
          </div>
        </div>

        <!-- 12. CĂN TIN -->
        <div id="canteenMenuCard" class="modal-card hidden" style="border-color:#10b981;">
          <div class="flex-row-between" style="border-bottom: 1px solid #334155; padding-bottom: 6px;">
            <div style="font-weight:900; color:#34d399; font-size:13px;">🍜 CĂN TIN TRƯỜNG - CÔ NĂM</div>
            <button onclick="closeOverlayCard()" class="pixel-btn">✕ Đóng</button>
          </div>
          <div id="canteenItemsList" style="display:flex; flex-direction:column; gap:6px; max-height:240px; overflow-y:auto;"></div>
        </div>

        <!-- 13. NHẬT KÝ CUỐI NGÀY -->
        <div id="diaryModalCard" class="modal-card hidden" style="background:#fef3c7; color:#78350f; border-color:#d97706;">
          <div class="flex-row-between" style="border-bottom: 2px solid #fde68a; padding-bottom: 6px;">
            <div style="font-weight:900; color:#92400e; font-size:14px;">📓 <span id="diaryTitle">NHẬT KÝ — NGÀY 1</span></div>
            <button onclick="closeOverlayCard()" style="background:none; border:none; font-size:16px; font-weight:bold; color:#78350f; cursor:pointer;">✕</button>
          </div>
          <div id="diaryContentText" style="font-size:12px; font-style:italic; line-height:1.6; max-height:180px; overflow-y:auto; padding:8px; background:rgba(254, 240, 138, 0.4); border-radius:8px;"></div>
          <div class="flex-row-between" style="font-size:10px; color:#92400e; border-top:1px solid #fde68a; padding-top:6px;">
            <span id="diaryForecastNextDay">Lịch học ngày mai...</span>
            <button id="btnContinueFromDiary" class="pixel-btn" style="background:#92400e; color:#fff; border:none;">Thức dậy ngày mới ☀️</button>
          </div>
        </div>

        <!-- 14. KẾT THÚC FINALE -->
        <div id="endingScreenCard" class="modal-card hidden" style="border-color:#fde047; text-align:center;">
          <div style="font-size:40px;">🎓</div>
          <div id="endingTitle" style="font-size:16px; font-weight:900; color:#fde047;">🏆 THỦ KHOA ĐẠI HỌC</div>
          <div id="endingSubtitle" style="font-size:11px; color:#fef08a; font-weight:bold;"></div>
          <div id="endingDescription" style="font-size:11px; text-align:left; background:#020617; padding:10px; border-radius:8px; border:1px solid #1e293b; line-height:1.5;"></div>
          <button onclick="restartGame()" class="pixel-btn btn-yellow" style="padding:10px; width:100%; font-weight:900;">CHƠI LẠI VÁN MỚI 🌸</button>
        </div>

      </section>

      <!-- BOTTOM CONTROL BAR -->
      <footer class="pixel-box flex-row-between">
        <button id="btnFooterSell" onclick="openShopOrderCard()" class="pixel-btn btn-green" style="flex:1; padding:8px;">
          🛎️ Quầy Order
        </button>
        <button onclick="startClassroomLesson()" class="pixel-btn" style="flex:1; padding:8px;">
          📖 Học Tập
        </button>
        <button onclick="openLeaderboard()" class="pixel-btn btn-yellow" style="flex:1; padding:8px;">
          🏆 Thi Đua
        </button>
        <button onclick="openGiftShopModal()" class="pixel-btn btn-pink" style="flex:1; padding:8px;">
          🎁 Tặng Mẫn
        </button>
        <button onclick="openDiaryManual()" class="pixel-btn" style="flex:1; padding:8px;">
          📓 Nhật Ký
        </button>
      </footer>

    </div>
  </div>

  <script>
    /* =============================================================
       1. TRẠNG THÁI GAME & ĐỒNG HỒ TỰ ĐỘNG
       ============================================================= */
    const STATE = {
      playerName: 'Bạn',
      day: 1,
      totalDays: 45,
      // Thời gian tính theo phút trong ngày (từ 07:00 = 420 phút, đến 22:30 = 1350 phút)
      minuteOfDay: 420,
      timeSpeed: 1, // 0: pause, 1: normal (1.5s = 1 phút), 2: fast (0.75s = 1 phút)
      location: 'class',
      stats: {
        hp: 85, energy: 100, mood: 75, study: 50, friends: 40, love: 20, reputation: 15, money: 30000,
        midtermScore: 0, finalScore: 0, totalBanhTrangSold: 0, totalTipsReceived: 0
      },
      certsEarned: [],
      unlockedAchievements: [],
      inventory: [
        { id: 'banh_trang', count: 3 },
        { id: 'tra_sua_chai', count: 2 },
        { id: 'but_cute', count: 2 },
        { id: 'de_cuong', count: 1 }
      ],
      customerOrders: [
        { id: 1, customer: 'Lan (Bạn Thân)', avatar: '👧', itemId: 'banh_trang', qty: 2, dialogue: 'Đói bụng quá, để cho tao 2 bịch bánh tráng bơ nha!', tip: 2000 },
        { id: 2, customer: 'Triệu Mẫn (Lớp Phó)', avatar: '👸', itemId: 'tra_sua_chai', qty: 1, dialogue: 'Bạn còn chai trà sữa nào mát lạnh không? Mình khát quá!', tip: 5000 }
      ],
      todayEvents: [],
      diaryEntries: [],
      exam: { type: 'midterm', inProgress: false, currentStep: 0, questions: [], correctCount: 0 }
    };

    const DAYS_OF_WEEK = ['THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY', 'CHỦ NHẬT'];

    // XÁC ĐỊNH KHUNG GIỜ VÀ QUYỀN BÁN HÀNG DỰA TRÊN PHÚT TRONG NGÀY
    function getCurrentSchedule() {
      const m = STATE.minuteOfDay;
      if (m >= 420 && m < 510) {
        return { text: 'Đầu giờ sáng • Chuẩn bị vào lớp', canSell: true }; // 07:00 - 08:30
      } else if (m >= 510 && m < 555) {
        return { text: 'Tiết 1-2 chính khóa • Tập trung học bài', canSell: false }; // 08:30 - 09:15
      } else if (m >= 555 && m < 585) {
        return { text: 'Giờ ra chơi 30 phút • Khách tới đông đúc!', canSell: true }; // 09:15 - 09:45
      } else if (m >= 585 && m < 690) {
        return { text: 'Tiết 3-4 chính khóa • Cấm buôn bán', canSell: false }; // 09:45 - 11:30
      } else if (m >= 690 && m < 810) {
        return { text: 'Tan trường trưa & Nghỉ trưa căn tin', canSell: false }; // 11:30 - 13:30
      } else if (m >= 810 && m < 1020) {
        return { text: 'Buổi chiều • Thư viện / Tự học', canSell: false }; // 13:30 - 17:00
      } else if (m >= 1020 && m < 1110) {
        return { text: 'Chiều muộn sau 17:00 • Tan trường nhận order', canSell: true }; // 17:00 - 18:30
      } else {
        return { text: 'Buổi tối • Góc học tập tại nhà', canSell: false }; // 18:30 - 22:30
      }
    }

    function isSellingAllowed() {
      return getCurrentSchedule().canSell;
    }

    /* ĐỒNG HỒ TỰ ĐỘNG CHẠY */
    let clockInterval = null;
    function startAutoClock() {
      if (clockInterval) clearInterval(clockInterval);
      clockInterval = setInterval(() => {
        if (STATE.timeSpeed === 0) return; // Tạm dừng
        
        STATE.minuteOfDay += 1; // Nhích 1 phút
        
        // Hết ngày lúc 22:30 (1350 phút) -> Kích hoạt Nhật Ký
        if (STATE.minuteOfDay >= 1350) {
          STATE.minuteOfDay = 420; // Reset về 07:00 sáng hôm sau
          triggerEndOfDayDiary();
        } else {
          updateHUD();
        }
      }, STATE.timeSpeed === 2 ? 600 : 1200);
    }

    function setTimeSpeed(spd) {
      STATE.timeSpeed = spd;
      document.getElementById('btnSpeed0').className = spd === 0 ? 'pixel-btn btn-yellow' : 'pixel-btn';
      document.getElementById('btnSpeed1').className = spd === 1 ? 'pixel-btn btn-blue' : 'pixel-btn';
      document.getElementById('btnSpeed2').className = spd === 2 ? 'pixel-btn btn-green' : 'pixel-btn';
      startAutoClock();
    }

    function updateHUD() {
      const hours = Math.floor(STATE.minuteOfDay / 60);
      const mins = STATE.minuteOfDay % 60;
      const timeStr = \`\${String(hours).padStart(2, '0')}:\${String(mins).padStart(2, '0')}\`;

      const dayOfWeekIdx = (STATE.day - 1) % 7;
      const sched = getCurrentSchedule();

      document.getElementById('uiPlayerNameText').textContent = STATE.playerName.toUpperCase();
      document.getElementById('uiDayOfWeek').textContent = DAYS_OF_WEEK[dayOfWeekIdx];
      document.getElementById('uiTimeText').textContent = timeStr;
      document.getElementById('uiCurrentPeriodText').textContent = sched.text;
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

      if (sched.canSell) {
        statusTag.textContent = '🟢 ĐƯỢC PHÉP BÁN HÀNG';
        statusTag.style.background = '#064e3b';
        statusTag.style.borderColor = '#10b981';
        statusTag.style.color = '#a7f3d0';
        btnSell.className = 'pixel-btn btn-green';
        btnSkip.classList.add('hidden');
      } else {
        statusTag.textContent = '🔒 GIỜ HỌC / ĐÓNG CỬA HÀNG';
        statusTag.style.background = '#4c0519';
        statusTag.style.borderColor = '#e11d48';
        statusTag.style.color = '#fecdd3';
        btnSell.className = 'pixel-btn';
        btnSkip.classList.remove('hidden');
      }
    }

    /* =============================================================
       2. TỰ ĐỘNG KHÁCH ĐẾN MUA HÀNG THEO CHU KỲ
       ============================================================= */
    let customerArrivalTimer = null;
    function startAutoCustomerSpawner() {
      if (customerArrivalTimer) clearInterval(customerArrivalTimer);
      customerArrivalTimer = setInterval(() => {
        if (isSellingAllowed() && STATE.customerOrders.length < 4 && STATE.timeSpeed > 0) {
          autoSpawnCustomer();
        }
      }, 5000);
    }

    function autoSpawnCustomer() {
      const customers = [
        { name: 'Tuấn (Bóng Rổ)', avatar: '🏀', itemId: 'tra_sua_chai', qty: 2, dialogue: 'Đá banh khát khô họng, cho 2 chai trà sữa lẹ!', tip: 4000 },
        { name: 'Hoàng Nam', avatar: '🤓', itemId: 'de_cuong', qty: 1, dialogue: 'Photo cho mình 1 bộ đề cương toán nha, gửi thêm ít tiền!', tip: 5000 },
        { name: 'Bảo Trân', avatar: '✨', itemId: 'but_cute', qty: 2, dialogue: 'Bút viết êm tay ghê, giao nhanh mình gửi thêm tiền nước!', tip: 3000 },
        { name: 'Triệu Mẫn', avatar: '👸', itemId: 'banh_trang', qty: 1, dialogue: 'Bánh tráng thơm quá, để cho Mẫn một phần nhen!', tip: 8000 },
        { name: 'Lan (Bạn Thân)', avatar: '👧', itemId: 'banh_trang', qty: 1, dialogue: 'Đói bụng quá, lấy tao một phần bánh tráng ăn lót dạ!', tip: 2500 }
      ];
      const newCust = customers[Math.floor(Math.random() * customers.length)];
      STATE.customerOrders.push({
        id: Date.now(), customer: newCust.name, avatar: newCust.avatar,
        itemId: newCust.itemId, qty: newCust.qty, dialogue: newCust.dialogue, tip: newCust.tip
      });
      audio.playTone(700, 'sine', 0.1);
      showStatAlert(\`🛎️ \${newCust.name} vừa ghé quầy order món!\`, '#38bdf8');
      
      const shopCard = document.getElementById('shopOrderCard');
      if (shopCard && !shopCard.classList.contains('hidden')) {
        renderOrders();
      }
    }

    /* =============================================================
       3. TOÀN BỘ CƠ SỞ DỮ LIỆU & LOGIC SỰ KIỆN
       ============================================================= */
    const WHOLESALE_ITEMS = [
      { id: 'banh_trang', name: 'Bánh Tráng Cuộn Bơ', wholesalePrice: 8500, retailPrice: 12000, icon: '🌯' },
      { id: 'tra_sua_chai', name: 'Trà Sữa Thái Chai', wholesalePrice: 13000, retailPrice: 18000, icon: '🧋' },
      { id: 'but_cute', name: 'Bút Bi Cute Pastel', wholesalePrice: 5500, retailPrice: 8000, icon: '🖊️' },
      { id: 'de_cuong', name: 'Đề Cương Ôn Tập', wholesalePrice: 6500, retailPrice: 10000, icon: '📑' }
    ];

    const CERTIFICATES_DEF = [
      { id: 'cert_mos', name: 'Tin Học MOS (Word/Excel)', cost: 50000, reqStudy: 60, icon: '💻', desc: 'Thành thạo văn phòng, +10 Uy tín' },
      { id: 'cert_accounting', name: 'Kế Toán Doanh Nghiệp', cost: 80000, reqStudy: 70, icon: '📊', desc: 'Quản lý sổ sách, +15% tiền tip đơn hàng' },
      { id: 'cert_toeic', name: 'Tiếng Anh TOEIC 650+', cost: 120000, reqStudy: 75, icon: '📘', desc: 'Giao tiếp chuẩn, cộng vĩnh viễn +15 📚' },
      { id: 'cert_ielts', name: 'IELTS Academic 7.0+', cost: 200000, reqStudy: 85, icon: '📕', desc: 'Tuyển thẳng đại học quốc tế!' }
    ];

    const SPECIAL_GIFTS = [
      { id: 'gift_pin', name: 'Kẹp Tóc Ngọc Bích', cost: 45000, loveGain: 12, icon: '🎀', desc: 'Món quà Triệu Mẫn rất thích cài lên tóc.' },
      { id: 'gift_diary', name: 'Sổ Tay Thư Tình Viết Tay', cost: 35000, loveGain: 10, icon: '💌', desc: 'Tâm sự chân thành gửi gắm đến lớp phó.' },
      { id: 'gift_bear', name: 'Gấu Bông Thủ Công Handmade', cost: 65000, loveGain: 16, icon: '🧸', desc: 'Ấm áp những đêm ôn thi căng thẳng.' },
      { id: 'gift_bracelet', name: 'Vòng Tay Bạc Khắc Tên Mẫn', cost: 120000, loveGain: 25, icon: '💍', desc: 'Lời hẹn ước cùng bước vào giảng đường.' }
    ];

    const HOLIDAYS = {
      10: { name: '20/10 Ngày Phụ Nữ Việt Nam', bonus: 1.8 },
      20: { name: '20/11 Ngày Nhà Giáo Việt Nam', bonus: 1.4 },
      30: { name: '24/12 Lễ Giáng Sinh An Lành', bonus: 2.0 },
      40: { name: '14/02 Lễ Tình Nhân Valentine', bonus: 2.5 }
    };

    const QUIZ_DATABASE = [
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Nếu x + 5 = 12 thì giá trị của 2x - 4 bằng bao nhiêu?', opts: ['10', '14', '7', '18'], c: 0, tip: 'x = 7 => 2(7) - 4 = 10.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Hàm số y = x² - 4x + 3 có hoành độ đỉnh Parabol bằng?', opts: ['2', '-2', '4', '1'], c: 0, tip: 'x = -b/(2a) = 4/2 = 2.' },
      { subject: 'MÔN TOÁN', teacher: 'Thầy Minh', avatar: '👨‍🏫', q: 'Một khối lập phương cạnh bằng 3 cm có thể tích bằng:', opts: ['27 cm³', '9 cm³', '54 cm³', '18 cm³'], c: 0, tip: 'V = 3³ = 27 cm³.' },
      { subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Cơ năng của con lắc lò xo biến thiên thế nào khi bỏ qua ma sát?', opts: ['Bảo toàn không đổi', 'Tăng giảm tuần hoàn', 'Bằng 0', 'Luôn giảm'], c: 0, tip: 'Cơ năng luôn bảo toàn.' },
      { subject: 'MÔN VẬT LÝ', teacher: 'Thầy Tuấn', avatar: '👨‍🔬', q: 'Sóng âm truyền nhanh nhất trong môi trường nào?', opts: ['Chất rắn', 'Chất lỏng', 'Chất khí', 'Chân không'], c: 0, tip: 'V_rắn > V_lỏng > V_khí.' },
      { subject: 'MÔN HÓA HỌC', teacher: 'Cô Lan Phương', avatar: '👩‍🔬', q: 'Kim loại nào dẫn điện tốt nhất ở điều kiện thường?', opts: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'], c: 0, tip: 'Ag > Cu > Au > Al.' },
      { subject: 'MÔN SINH HỌC', teacher: 'Thầy Đức', avatar: '👨‍🏫', q: 'Bào quan nào là “nhà máy năng lượng” của tế bào?', opts: ['Ty thể', 'Ribôxôm', 'Bộ máy Golgi', 'Lizôxôm'], c: 0, tip: 'Ty thể tổng hợp ATP.' },
      { subject: 'MÔN NGỮ VĂN', teacher: 'Cô Thảo', avatar: '👩‍🏫', q: 'Ai là tác giả của tác phẩm “Vợ Nhặt”?', opts: ['Kim Lân', 'Nam Cao', 'Tô Hoài', 'Nguyễn Tuân'], c: 0, tip: 'Nhà văn Kim Lân viết về nạn đói 1945.' },
      { subject: 'MÔN LỊCH SỬ', teacher: 'Thầy Hùng', avatar: '👨‍🏫', q: 'Chiến thắng Điện Biên Phủ diễn ra vào năm nào?', opts: ['1954', '1945', '1975', '1968'], c: 0, tip: 'Toàn thắng 07/05/1954.' },
      { subject: 'MÔN TIẾNG ANH', teacher: 'Cô Jennifer', avatar: '👩‍💼', q: 'She has been studying in this school ___ 2022.', opts: ['since', 'for', 'in', 'at'], c: 0, tip: 'Since + mốc thời gian.' }
    ];

    const ACHIEVEMENTS_DEF = [
      { id: 'master_banh_trang', name: 'Vua Bán Dạo Học Đường', icon: '🌯', desc: 'Giao chuẩn xác 15 đơn bánh tráng bơ', check: (s) => s.totalBanhTrangSold >= 15 },
      { id: 'rich_student_1', name: 'Tiểu Đại Gia Cấp 3', icon: '💰', desc: 'Tích lũy tài sản đạt 500.000đ', check: (s) => s.money >= 500000 },
      { id: 'rich_student_2', name: 'Triệu Phú Học Đường', icon: '💎', desc: 'Tích lũy tài sản đạt 1.500.000đ', check: (s) => s.money >= 1500000 },
      { id: 'cert_master', name: 'Chuyên Gia Chứng Chỉ', icon: '🎓', desc: 'Thu thập đủ cả 4 chứng chỉ quốc tế', check: (s) => s.certsEarned && s.certsEarned.length >= 4 },
      { id: 'top_1_class', name: 'Đỉnh Cao Lớp 12A3', icon: '🥇', desc: 'Vượt mốc 96 điểm soán ngôi Triệu Mẫn', check: (s) => s.study >= 96 },
      { id: 'exam_genius', name: 'Thủ Khoa Độc Tôn', icon: '👑', desc: 'Đạt điểm tuyệt đối 10/10 ở kỳ thi', check: (s) => s.midtermScore >= 10 || s.finalScore >= 10 },
      { id: 'eternal_love', name: 'Hôn Ước Trăm Năm', icon: '💖', desc: 'Đạt 90% tình cảm với Triệu Mẫn', check: (s) => s.love >= 90 },
      { id: 'five_star_service', name: 'Đại Sứ Dịch Vụ', icon: '⭐', desc: 'Tích lũy tổng tiền tip vượt 50.000đ', check: (s) => s.totalTipsReceived >= 50000 }
    ];

    function closeOverlayCard() {
      document.querySelectorAll('.modal-card').forEach(c => c.classList.add('hidden'));
    }

    function gotoLocation(loc) {
      STATE.location = loc;
      closeOverlayCard();
      audio.playTone(320, 'sine', 0.08);

      const titleEl = document.getElementById('locTitle');
      const iconEl = document.getElementById('locIcon');
      const descEl = document.getElementById('sceneNarrative');

      if (loc === 'class') {
        titleEl.textContent = 'LỚP 12A3 - KHỐI CHUYÊN';
        iconEl.textContent = '🏫';
        descEl.textContent = isSellingAllowed() 
          ? \`Đang trong giờ bán hàng! Bạn bè đang tự động ghé quầy order bánh tráng, trà sữa.\`
          : 'Giờ học chính khóa! Cất đồ buôn bán vào cặp và tập trung học hoặc trốn học đi chơi!';
      } else if (loc === 'canteen') {
        titleEl.textContent = 'CĂN TIN TRƯỜNG - CÔ NĂM';
        iconEl.textContent = '🍜';
        descEl.textContent = 'Căn tin nhộn nhịp, nạp lại năng lượng hoặc mua đồ ngon đãi Triệu Mẫn!';
        openCanteenMenu();
      } else if (loc === 'library') {
        titleEl.textContent = 'THƯ VIỆN YÊN TĨNH';
        iconEl.textContent = '📚';
        descEl.textContent = 'Không gian tĩnh mịch ngập tràn sách vở. Triệu Mẫn cũng thường hay ngồi đọc sách ở góc bàn cạnh cửa sổ.';
      } else if (loc === 'yard') {
        titleEl.textContent = 'SÂN TRƯỜNG & CÂY BÀNG';
        iconEl.textContent = '🌿';
        descEl.textContent = isSellingAllowed()
          ? 'Sau 17:00 học sinh ùa ra sân trường, khách tự động kéo tới order đông vui!'
          : 'Sân trường rợp bóng mát, nơi bạn bè thư giãn sau các ca học.';
      } else if (loc === 'home') {
        titleEl.textContent = 'PHÒNG NGỦ & BÀN HỌC Ở NHÀ';
        iconEl.textContent = '🏠';
        descEl.textContent = 'Góc học tập ban đêm. Ngồi ôn lại bài và đi ngủ đúng giờ nạp lại sức khỏe.';
      }
      updateHUD();
    }

    function triggerSkipSchoolAction() {
      if (isSellingAllowed()) return;
      if (STATE.stats.energy < 15) {
        showStatAlert('Quá mệt mỏi, không đủ sức leo tường!', '#fb7185');
        return;
      }
      const caught = Math.random() < 0.35;
      if (caught) {
        audio.playWrong();
        modifyStats({ mood: -20, study: -6, rep: -10, energy: -15 });
        alert(\`🚨 BỊ BẮT QUẢ TANG!\\nThầy giám thị bắt được bạn đang leo tường rào. Bị ghi sổ đầu bài và hạ hạnh kiểm!\`);
      } else {
        audio.playSuccess();
        modifyStats({ mood: +25, energy: -15, study: -3 });
        showStatAlert('🎉 Trốn học thành công ra quán Net làm vài ván rank! (+25 😊)', '#34d399');
      }
      STATE.minuteOfDay += 30; // Trốn học mất 30 phút
      updateHUD();
    }

    function openShopOrderCard() {
      closeOverlayCard();
      if (!isSellingAllowed()) {
        audio.playWrong();
        alert('⛔ Đang là giờ học chính khóa! Quầy đóng cửa.\\nHãy tự học hoặc bấm nút "Trốn Học Đi Chơi" màu đỏ ở trên!');
        return;
      }
      document.getElementById('shopOrderCard').classList.remove('hidden');
      renderOrders();
    }

    function renderOrders() {
      const getCount = (id) => (STATE.inventory.find(i => i.id === id) || { count: 0 }).count;
      document.getElementById('stockBadgeBanhTrang').textContent = \`🌯 Bánh tráng: \${getCount('banh_trang')}\`;
      document.getElementById('stockBadgeTraSua').textContent = \`🧋 Trà sữa: \${getCount('tra_sua_chai')}\`;
      document.getElementById('stockBadgeBut').textContent = \`🖊️ Bút: \${getCount('but_cute')}\`;
      document.getElementById('stockBadgeDeCuong').textContent = \`📑 Đề cương: \${getCount('de_cuong')}\`;

      const container = document.getElementById('orderListContainer');
      container.innerHTML = '';

      if (STATE.customerOrders.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:16px; color:#94a3b8; font-size:11px;">Khách đang trên đường tới quầy, bạn chờ vài giây nhé...</div>';
        return;
      }

      STATE.customerOrders.forEach(ord => {
        const itemInfo = WHOLESALE_ITEMS.find(i => i.id === ord.itemId);
        const inStock = getCount(ord.itemId);
        const canFulfill = inStock >= ord.qty;
        const totalBase = itemInfo.retailPrice * ord.qty;

        const row = document.createElement('div');
        row.style.cssText = \`background:#020617; padding:8px 10px; border-radius:8px; border:1px solid \${canFulfill ? '#059669' : '#dc2626'}; display:flex; align-items:center; justify-content:space-between; font-size:11px;\`;
        row.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">\${ord.avatar}</span>
            <div>
              <div style="font-weight:bold; color:#f8fafc;">\${ord.customer} <span style="color:#fde047; font-size:9px;">⭐⭐⭐⭐⭐</span></div>
              <div style="color:#94a3b8; font-size:10px; font-style:italic;">"\${ord.dialogue}"</div>
              <div style="color:#fde047; font-size:10px; font-family:monospace; margin-top:2px;">
                Order: <b>\${ord.qty}x \${itemInfo.name}</b> (\${totalBase.toLocaleString('vi-VN')}đ)
                <span style="color:#34d399; font-weight:bold;">+Tip \${ord.tip.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
          <button onclick="fulfillOrder(\${ord.id})" class="pixel-btn \${canFulfill ? 'btn-green' : ''}" style="padding:4px 8px; font-size:10px;">
            \${canFulfill ? 'Giao Đơn' : 'Thiếu Hàng'}
          </button>
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
        showStatAlert('Kho không đủ hàng! Vào Chợ Sỉ ngay.', '#fb7185');
        audio.playWrong();
        return;
      }

      inv.count -= ord.qty;
      const profit = (itemInfo.retailPrice * ord.qty) + ord.tip;
      const isCrush = ord.customer.includes('Triệu Mẫn');

      if (ord.itemId === 'banh_trang') STATE.stats.totalBanhTrangSold = (STATE.stats.totalBanhTrangSold || 0) + ord.qty;
      STATE.stats.totalTipsReceived = (STATE.stats.totalTipsReceived || 0) + ord.tip;

      modifyStats({ money: +profit, mood: +5, energy: -2, rep: +4, love: isCrush ? +10 : 0 });

      STATE.customerOrders.splice(idx, 1);
      audio.playCash();
      showStatAlert(\`⭐ Khách nhận hàng và gửi tip: +\${profit.toLocaleString('vi-VN')}đ\`, '#34d399');

      renderOrders();
      checkAchievements();
    }

    function openWholesaleTab() {
      closeOverlayCard();
      document.getElementById('wholesaleCard').classList.remove('hidden');
      const container = document.getElementById('wholesaleListContainer');
      container.innerHTML = '';

      WHOLESALE_ITEMS.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'background:#020617; padding:8px 10px; border-radius:8px; border:1px solid #1e293b; display:flex; align-items:center; justify-content:space-between; font-size:11px;';
        div.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">\${item.icon}</span>
            <div>
              <div style="font-weight:bold; color:#f8fafc;">\${item.name}</div>
              <div style="color:#94a3b8; font-size:10px;">Giá sỉ: <b style="color:#60a5fa;">\${item.wholesalePrice.toLocaleString('vi-VN')}đ</b> • Bán: \${item.retailPrice.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
          <button onclick="buyWholesaleStock('\${item.id}')" class="pixel-btn btn-blue" style="padding:4px 8px; font-size:10px;">Nhập 3 Cái</button>
        \`;
        container.appendChild(div);
      });
    }

    function buyWholesaleStock(itemId) {
      const item = WHOLESALE_ITEMS.find(i => i.id === itemId);
      const cost = item.wholesalePrice * 3;
      if (STATE.stats.money < cost) {
        showStatAlert('Tiền không đủ để nhập sỉ!', '#fb7185');
        audio.playWrong();
        return;
      }
      let inv = STATE.inventory.find(i => i.id === itemId);
      if (!inv) { inv = { id: itemId, count: 0 }; STATE.inventory.push(inv); }
      inv.count += 3;
      modifyStats({ money: -cost });
      audio.playTone(550, 'triangle', 0.15);
      showStatAlert(\`📦 Đã nhập 3 \${item.name} (-\${cost.toLocaleString('vi-VN')}đ)\`, '#38bdf8');
    }

    function openGiftShopModal() {
      closeOverlayCard();
      document.getElementById('giftShopCard').classList.remove('hidden');
      const container = document.getElementById('giftShopItemsList');
      container.innerHTML = '';
      const hol = HOLIDAYS[STATE.day];

      SPECIAL_GIFTS.forEach(g => {
        const row = document.createElement('div');
        row.style.cssText = 'background:#020617; padding:8px 10px; border-radius:8px; border:1px solid #1e293b; display:flex; align-items:center; justify-content:space-between; font-size:11px;';
        row.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">\${g.icon}</span>
            <div>
              <div style="font-weight:bold; color:#f8fafc;">\${g.name}</div>
              <div style="color:#94a3b8; font-size:10px;">\${g.desc}</div>
              <div style="color:#f472b6; font-size:10px; margin-top:2px;">Giá: \${g.cost.toLocaleString('vi-VN')}đ • Hiệu quả: +\${g.loveGain}% 💕</div>
            </div>
          </div>
          <button onclick="buyAndGiveGift('\${g.id}')" class="pixel-btn btn-pink" style="padding:4px 8px; font-size:10px;">Tặng Mẫn</button>
        \`;
        container.appendChild(row);
      });
    }

    function buyAndGiveGift(giftId) {
      const g = SPECIAL_GIFTS.find(x => x.id === giftId);
      if (!g) return;
      if (STATE.stats.money < g.cost) {
        showStatAlert('Tiền không đủ mua quà!', '#fb7185');
        audio.playWrong();
        return;
      }
      const hol = HOLIDAYS[STATE.day];
      const mult = hol ? hol.bonus : 1.0;
      const finalLove = Math.round(g.loveGain * mult);
      modifyStats({ money: -g.cost, love: +finalLove, mood: +15 });
      audio.playCash();
      triggerFireworks();
      alert(\`💕 Triệu Mẫn đón nhận món quà \${g.name} từ bạn với ánh mắt ngập tràn hạnh phúc! (+\${finalLove}% Tình Cảm)\`);
      closeOverlayCard();
      checkAchievements();
    }

    function openCertModal() {
      closeOverlayCard();
      document.getElementById('certModalCard').classList.remove('hidden');
      const container = document.getElementById('certListContainer');
      container.innerHTML = '';

      CERTIFICATES_DEF.forEach(cert => {
        const earned = STATE.certsEarned && STATE.certsEarned.includes(cert.id);
        const row = document.createElement('div');
        row.style.cssText = \`background:#020617; padding:8px 10px; border-radius:8px; border:1px solid \${earned ? '#059669' : '#1e293b'}; display:flex; align-items:center; justify-content:space-between; font-size:11px;\`;
        row.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">\${cert.icon}</span>
            <div>
              <div style="font-weight:bold; color:\${earned ? '#34d399' : '#f8fafc'};">\${cert.name}</div>
              <div style="color:#94a3b8; font-size:10px;">\${cert.desc}</div>
              <div style="color:#60a5fa; font-size:10px; margin-top:2px;">Lệ phí: \${cert.cost.toLocaleString('vi-VN')}đ • Yêu cầu: \${cert.reqStudy} 📚</div>
            </div>
          </div>
          <button \${earned ? 'disabled' : ''} onclick="takeCertExam('\${cert.id}')" class="pixel-btn \${earned ? '' : 'btn-blue'}" style="padding:4px 8px; font-size:10px;">
            \${earned ? 'ĐÃ ĐẠT' : 'Thi Ngay'}
          </button>
        \`;
        container.appendChild(row);
      });
    }

    function takeCertExam(certId) {
      const cert = CERTIFICATES_DEF.find(c => c.id === certId);
      if (!cert) return;
      if (STATE.stats.money < cert.cost) {
        showStatAlert('Không đủ lệ phí dự thi!', '#fb7185');
        audio.playWrong();
        return;
      }
      if (STATE.stats.study < cert.reqStudy) {
        alert(\`⚠ Bạn cần ít nhất \${cert.reqStudy} điểm Học Tập để thi đỗ \${cert.name}. Hãy lên thư viện ôn đề thêm nhé!\`);
        return;
      }
      modifyStats({ money: -cert.cost, rep: +15, energy: -20 });
      if (!STATE.certsEarned) STATE.certsEarned = [];
      STATE.certsEarned.push(cert.id);
      audio.playSuccess();
      triggerFireworks();
      alert(\`🎉 XUẤT SẮC VƯỢT QUA KỲ THI!\\nBạn chính thức nhận được \${cert.name}!\`);
      closeOverlayCard();
      checkAchievements();
    }

    function openLeaderboard() {
      closeOverlayCard();
      document.getElementById('leaderboardCard').classList.remove('hidden');
      const list = document.getElementById('leaderboardList');
      list.innerHTML = '';
      const students = [
        { name: 'Triệu Mẫn (Lớp Phó)', score: 92, avatar: '👸' },
        { name: \`\${STATE.playerName} (Bạn)\`, score: STATE.stats.study, avatar: '😎' },
        { name: 'Lan (Bạn Thân)', score: 68, avatar: '👧' },
        { name: 'Tuấn (Bóng Rổ)', score: 55, avatar: '🏀' },
        { name: 'Hoàng Nam', score: 84, avatar: '🤓' }
      ].sort((a,b) => b.score - a.score);

      students.forEach((st, idx) => {
        const isPlayer = st.name.includes(STATE.playerName);
        const row = document.createElement('div');
        row.style.cssText = \`background:\${isPlayer ? '#0c4a6e' : '#020617'}; padding:6px 10px; border-radius:8px; border:1px solid #1e293b; display:flex; align-items:center; justify-content:space-between; font-size:11px;\`;
        row.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <b style="color:#fde047; font-family:monospace;">#\${idx+1}</b>
            <span>\${st.avatar}</span>
            <span style="font-weight:bold; color:\${isPlayer ? '#38bdf8' : '#f8fafc'};">\${st.name}</span>
          </div>
          <b style="color:#34d399; font-family:monospace;">\${st.score} 📚</b>
        \`;
        list.appendChild(row);
      });
    }

    function openAchievementsModal() {
      closeOverlayCard();
      document.getElementById('achievementsModalCard').classList.remove('hidden');
      document.getElementById('achieveSummary').textContent = \`Đã mở: \${STATE.unlockedAchievements.length}/\${ACHIEVEMENTS_DEF.length} danh hiệu\`;
      const list = document.getElementById('achievementsList');
      list.innerHTML = '';
      ACHIEVEMENTS_DEF.forEach(ach => {
        const isUnlocked = STATE.unlockedAchievements.includes(ach.id);
        const row = document.createElement('div');
        row.style.cssText = \`background:\${isUnlocked ? '#3b0764' : '#020617'}; padding:6px 10px; border-radius:8px; border:1px solid \${isUnlocked ? '#a855f7' : '#1e293b'}; display:flex; align-items:center; justify-content:space-between; font-size:11px; opacity:\${isUnlocked ? 1 : 0.6};\`;
        row.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:20px;">\${ach.icon}</span>
            <div>
              <b style="color:\${isUnlocked ? '#c084fc' : '#94a3b8'};">\${ach.name}</b>
              <div style="font-size:9px; color:#cbd5e1;">\${ach.desc}</div>
            </div>
          </div>
          <span style="font-size:9px; font-weight:bold; padding:2px 6px; border-radius:4px; background:\${isUnlocked ? '#7e22ce' : '#334155'}; color:#fff;">
            \${isUnlocked ? 'ĐÃ ĐẠT' : 'CHƯA'}
          </span>
        \`;
        list.appendChild(row);
      });
    }

    function checkAchievements() {
      ACHIEVEMENTS_DEF.forEach(ach => {
        if (!STATE.unlockedAchievements.includes(ach.id) && ach.check(STATE.stats)) {
          STATE.unlockedAchievements.push(ach.id);
          audio.playSuccess();
          triggerFireworks();
          showStatAlert(\`🏅 THÀNH TỰU MỚI: \${ach.name}!\`, '#a855f7');
        }
      });
    }

    function openNameModal() {
      closeOverlayCard();
      document.getElementById('nameModalCard').classList.remove('hidden');
      document.getElementById('playerNameInput').value = STATE.playerName !== 'Bạn' ? STATE.playerName : '';
    }

    function savePlayerName() {
      const val = document.getElementById('playerNameInput').value.trim();
      if (val) {
        STATE.playerName = val;
        saveGame();
        showStatAlert(\`Đã đổi tên: \${val}!\`, '#38bdf8');
      }
      closeOverlayCard();
      updateHUD();
    }

    function openHelpModal() {
      closeOverlayCard();
      document.getElementById('helpModalCard').classList.remove('hidden');
    }

    function openCloudModal() {
      closeOverlayCard();
      document.getElementById('cloudModalCard').classList.remove('hidden');
      exportSaveCode();
    }

    function exportSaveCode() {
      try {
        const jsonStr = JSON.stringify(STATE);
        const code = window.btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
        document.getElementById('cloudSaveCodeInput').value = code;
        showStatAlert('📋 Đã xuất mã lưu thành công!', '#34d399');
      } catch (e) {
        alert('Lỗi tạo mã lưu: ' + e.message);
      }
    }

    function importSaveCode() {
      const code = document.getElementById('cloudSaveCodeInput').value.trim();
      if (!code) { alert('Vui lòng dán mã lưu vào khung!'); return; }
      try {
        const jsonStr = decodeURIComponent(Array.prototype.map.call(window.atob(code), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        const parsed = JSON.parse(jsonStr);
        if (parsed.stats && parsed.day) {
          Object.assign(STATE, parsed);
          saveGame();
          alert('🎉 Khôi phục tiến trình thành công!');
          closeOverlayCard();
          updateHUD();
          checkHoliday();
          checkAchievements();
        } else {
          alert('Mã lưu không đúng định dạng!');
        }
      } catch (e) {
        alert('Mã lưu không hợp lệ!');
      }
    }

    function startClassroomLesson() {
      if (STATE.stats.energy < 15) {
        showStatAlert('Bạn quá mệt để học bài!', '#fb7185');
        audio.playWrong();
        return;
      }
      closeOverlayCard();
      const q = QUIZ_DATABASE[Math.floor(Math.random() * QUIZ_DATABASE.length)];
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
        btn.className = 'pixel-btn';
        btn.style.cssText = 'padding:8px; font-size:11px; justify-content:flex-start; text-align:left;';
        btn.innerHTML = \`<b style="color:#fde047;">\${String.fromCharCode(65 + idx)}.</b> \${opt}\`;
        btn.onclick = () => answerQuiz(q, idx);
        optsBox.appendChild(btn);
      });
    }

    function answerQuiz(q, selectedIdx) {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      if (selectedIdx === q.c) {
        modifyStats({ study: +10, mood: +5, energy: -15, rep: +2 });
        audio.playSuccess();
        showStatAlert(\`🎉 Đúng rồi! (+10 📚, +5 😊)\`, '#34d399');
      } else {
        modifyStats({ study: +3, mood: -5, energy: -15 });
        audio.playWrong();
        showStatAlert('😭 Sai rồi! Ghi nhớ để thi nhé.', '#fb7185');
      }
      STATE.minuteOfDay += 20; // Trả lời câu hỏi tốn 20 phút
      updateHUD();
      checkAchievements();
    }

    document.getElementById('btnSkipClass')?.addEventListener('click', () => {
      document.getElementById('classroomQuizCard').classList.add('hidden');
      modifyStats({ energy: +10, study: -5, hp: -2 });
      showStatAlert('😴 Ngủ gục trong giờ học! (+10 ⚡, -5 📚)', '#fde047');
      STATE.minuteOfDay += 30;
      updateHUD();
    });

    function interactNPC(who) {
      audio.playTone(450, 'triangle', 0.1);
      if (who === 'mẫn') {
        if (STATE.stats.energy < 10) { showStatAlert('Bạn quá mệt để bắt chuyện!', '#fb7185'); return; }
        modifyStats({ energy: -10, mood: +15, love: +7, study: +3 });
        showStatAlert(\`💕 Triệu Mẫn mỉm cười động viên \${STATE.playerName}! (+7 💕, +3 📚)\`, '#f472b6');
        STATE.minuteOfDay += 15;
        updateHUD();
        checkAchievements();
      } else if (who === 'lan') {
        modifyStats({ energy: -10, mood: +10, friends: +8, study: +4 });
        showStatAlert(\`👧 Lan rủ \${STATE.playerName} cùng làm bài tập! (+8 👥, +4 📚)\`, '#38bdf8');
        STATE.minuteOfDay += 15;
        updateHUD();
      } else if (who === 'tuan') {
        modifyStats({ energy: -15, hp: +10, mood: +10, friends: +8 });
        showStatAlert('🏀 Làm một ván bóng rổ nạp lại tinh thần! (+10 ❤️, +10 😊)', '#fde047');
        STATE.minuteOfDay += 20;
        updateHUD();
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

    function triggerEndOfDayDiary() {
      audio.playTone(440, 'sine', 0.2);
      closeOverlayCard();
      STATE.stats.energy = 100;
      STATE.stats.money += 15000;

      const diaryCard = document.getElementById('diaryModalCard');
      diaryCard.classList.remove('hidden');
      document.getElementById('diaryTitle').textContent = \`NHẬT KÝ — NGÀY \${STATE.day}\`;
      document.getElementById('diaryContentText').innerText = \`Hôm nay là Ngày thứ \${STATE.day} lớp 12 của \${STATE.playerName}. Vừa cố gắng hoàn thành các đơn hàng vừa tích cực cày bài ôn thi cùng Triệu Mẫn.\`;
      document.getElementById('diaryForecastNextDay').textContent = STATE.day === 21 ? 'NGÀY MAI: THI GIỮA KỲ!' : (STATE.day === 44 ? 'NGÀY MAI: THI TỐT NGHIỆP!' : \`Ngày \${STATE.day + 1}: Lịch học bình thường\`);

      document.getElementById('btnContinueFromDiary').onclick = () => {
        closeOverlayCard();
        STATE.day++;
        STATE.minuteOfDay = 420;
        gotoLocation('class');
        checkHoliday();
        if (STATE.day === 22) triggerExam('midterm');
        else if (STATE.day >= STATE.totalDays) triggerExam('final');
      };
    }

    function triggerExam(type) {
      closeOverlayCard();
      const examCard = document.getElementById('examMinigameCard');
      examCard.classList.remove('hidden');
      const shuffled = [...QUIZ_DATABASE].sort(() => 0.5 - Math.random());
      STATE.exam.type = type;
      STATE.exam.questions = shuffled.slice(0, 10);
      STATE.exam.currentStep = 0;
      STATE.exam.correctCount = 0;
      document.getElementById('examModalTitle').textContent = type === 'midterm' ? '📝 KỲ THI GIỮA KỲ LỚP 12' : '🎓 KỲ THI TỐT NGHIỆP ĐẠI HỌC';
      renderExamStep();
    }

    function renderExamStep() {
      const q = STATE.exam.questions[STATE.exam.currentStep];
      document.getElementById('examProgressText').textContent = \`CÂU \${STATE.exam.currentStep + 1} / 10\`;
      document.getElementById('examSubjectBadge').textContent = q.subject;
      document.getElementById('examQuestionText').textContent = q.q;
      document.getElementById('examCorrectCount').textContent = STATE.exam.correctCount;

      const container = document.getElementById('examOptionsContainer');
      container.innerHTML = '';
      q.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'pixel-btn';
        btn.style.cssText = 'padding:8px; font-size:11px; justify-content:flex-start; text-align:left;';
        btn.innerHTML = \`<b style="color:#fde047;">\${String.fromCharCode(65 + idx)}.</b> \${opt}\`;
        btn.onclick = () => {
          if (idx === q.c) { STATE.exam.correctCount++; audio.playSuccess(); } else { audio.playWrong(); }
          STATE.exam.currentStep++;
          if (STATE.exam.currentStep < 10) renderExamStep();
          else {
            closeOverlayCard();
            if (STATE.exam.type === 'midterm') {
              STATE.stats.midtermScore = STATE.exam.correctCount;
              modifyStats({ study: STATE.exam.correctCount * 3, mood: +10 });
              alert(\`🎉 KẾT QUẢ GIỮA KỲ: Đúng \${STATE.exam.correctCount}/10 câu!\`);
            } else {
              STATE.stats.finalScore = STATE.exam.correctCount;
              triggerGraduationEnding();
            }
          }
        };
        container.appendChild(btn);
      });
    }

    function triggerGraduationEnding() {
      closeOverlayCard();
      const endCard = document.getElementById('endingScreenCard');
      endCard.classList.remove('hidden');
      audio.playSuccess();
      triggerFireworks();

      const certCount = (STATE.certsEarned || []).length;
      const totalScore = STATE.stats.study + (STATE.stats.finalScore * 10) + (certCount * 10);

      document.getElementById('endingTitle').textContent = totalScore >= 180 && STATE.stats.love >= 85 ? '🏆 THỦ KHOA & HÔN ƯỚC TRĂM NĂM' : '🌸 THANH XUÂN RỰC RỠ TRỌN VẸN';
      document.getElementById('endingSubtitle').textContent = \`Điểm thi: \${STATE.stats.finalScore}/10 • Chứng chỉ: \${certCount}/4\`;
      document.getElementById('endingDescription').textContent = \`Chúc mừng \${STATE.playerName}! Bạn đã hoàn thành 45 ngày cấp 3 với tổng tài sản \${STATE.stats.money.toLocaleString('vi-VN')}đ và tình cảm với Triệu Mẫn đạt \${STATE.stats.love}%!\`;
      document.getElementById('endStatStudy').textContent = STATE.stats.study;
      document.getElementById('endStatRank').textContent = totalScore >= 160 ? '#1 Toàn Khối' : '#2 Lớp 12A3';
      document.getElementById('endStatMoney').textContent = \`\${STATE.stats.money.toLocaleString('vi-VN')}đ\`;
      document.getElementById('endStatCerts').textContent = \`\${certCount}/4\`;
    }

    function restartGame() {
      localStorage.removeItem('thanh_xuan_business_save');
      location.reload();
    }

    function openCanteenMenu() {
      closeOverlayCard();
      document.getElementById('canteenMenuCard').classList.remove('hidden');
      const list = document.getElementById('canteenItemsList');
      list.innerHTML = '';
      [
        { name: 'Bánh Mì Nóng Giòn', cost: 15000, energy: +30, mood: +10, icon: '🥖' },
        { name: 'Xôi Mặn Thập Cẩm', cost: 15000, energy: +35, mood: +12, icon: '🍙' },
        { name: 'Nước Mía Siêu Sạch', cost: 10000, energy: +20, mood: +15, icon: '🥤' }
      ].forEach(f => {
        const item = document.createElement('div');
        item.style.cssText = 'background:#020617; padding:8px 10px; border-radius:8px; border:1px solid #1e293b; display:flex; align-items:center; justify-content:space-between; font-size:11px;';
        item.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">\${f.icon}</span>
            <div><b>\${f.name}</b> <span style="color:#34d399;">(\${f.cost.toLocaleString('vi-VN')}đ)</span></div>
          </div>
          <button onclick="buyFood('\${f.name}', \${f.cost}, \${f.energy}, \${f.mood})" class="pixel-btn btn-green" style="padding:4px 8px; font-size:10px;">Ăn Ngay</button>
        \`;
        list.appendChild(item);
      });
    }

    function buyFood(name, cost, energy, mood) {
      if (STATE.stats.money < cost) { showStatAlert('Không đủ tiền!', '#fb7185'); return; }
      modifyStats({ money: -cost, energy: energy, mood: mood });
      audio.playCash();
      showStatAlert(\`😋 Đã ăn \${name}! (+ \${energy} ⚡)\`, '#34d399');
      STATE.minuteOfDay += 15;
      updateHUD();
    }

    function openDiaryManual() {
      closeOverlayCard();
      document.getElementById('diaryModalCard').classList.remove('hidden');
      document.getElementById('diaryTitle').textContent = \`NHẬT KÝ ĐÃ LƯU (NGÀY \${STATE.day})\`;
      document.getElementById('diaryContentText').innerText = \`Tiến trình ngày \${STATE.day}: Điểm học tập \${STATE.stats.study}, Ví tiền \${STATE.stats.money.toLocaleString('vi-VN')}đ.\`;
      document.getElementById('btnContinueFromDiary').onclick = () => closeOverlayCard();
    }

    function showStatAlert(text, color) {
      const box = document.getElementById('statAlertBox');
      box.textContent = text;
      box.style.borderColor = color;
      box.style.color = color;
      box.style.opacity = '1';
      setTimeout(() => { box.style.opacity = '0'; }, 3000);
    }

    function saveGame() {
      try { localStorage.setItem('thanh_xuan_business_save', JSON.stringify(STATE)); } catch(e){}
    }

    function loadGame() {
      try {
        const raw = localStorage.getItem('thanh_xuan_business_save');
        if (raw) Object.assign(STATE, JSON.parse(raw));
      } catch(e){}
    }

    document.getElementById('btnAudioToggle')?.addEventListener('click', (e) => {
      audio.enabled = !audio.enabled;
      e.target.textContent = audio.enabled ? '🔊 BẬT ÂM' : '🔇 TẮT ÂM';
    });

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

    window.addEventListener('DOMContentLoaded', () => {
      loadGame();
      gotoLocation('class');
      updateHUD();
      checkHoliday();
      checkAchievements();
      startAutoClock();
      startAutoCustomerSpawner();
      if (STATE.playerName === 'Bạn') openNameModal();
      else openHelpModal();
    });
  </script>
</body>
</html>`;

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        title="Thanh Xuân Rực Rỡ 7.4"
        srcDoc={gameHtml}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
