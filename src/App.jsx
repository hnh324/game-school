<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Thanh Xuân Rực Rỡ - Deluxe Edition</title>

<script src="https://cdn.tailwindcss.com"></script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">

<style>
*{
    box-sizing:border-box;
}

body{
    margin:0;
    background:
        radial-gradient(circle at top,#172554 0,#020617 42%,#000 100%);
    color:#e2e8f0;
    font-family:"Be Vietnam Pro",sans-serif;
    min-height:100vh;
}

button{
    font-family:inherit;
}

::-webkit-scrollbar{
    width:7px;
    height:7px;
}

::-webkit-scrollbar-track{
    background:#020617;
}

::-webkit-scrollbar-thumb{
    background:#475569;
    border-radius:20px;
}

.pixel{
    font-family:"Press Start 2P",monospace;
}

.retro{
    font-family:"VT323",monospace;
}

.game-shell{
    width:min(1180px,100%);
    margin:auto;
}

.game-screen{
    min-height:720px;
    position:relative;
    overflow:hidden;
    background:
        linear-gradient(
            rgba(2,6,23,.35),
            rgba(2,6,23,.82)
        ),
        radial-gradient(
            circle at 50% 20%,
            #1e3a8a,
            #0f172a 55%,
            #020617
        );
}

.glass{
    background:rgba(15,23,42,.86);
    border:1px solid rgba(148,163,184,.2);
    backdrop-filter:blur(12px);
}

.pixel-border{
    border:2px solid #334155;
    box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.04),
        0 8px 30px rgba(0,0,0,.35);
}

.stat-bar{
    height:7px;
    border-radius:99px;
    overflow:hidden;
    background:#1e293b;
}

.stat-fill{
    height:100%;
    transition:.35s ease;
}

.nav-btn{
    transition:.15s;
}

.nav-btn:active,
.action-btn:active,
.dpad-btn:active{
    transform:scale(.95);
}

.nav-active{
    background:#4f46e5!important;
    color:white!important;
    border-color:#818cf8!important;
}

.action-btn{
    border:1px solid #334155;
    background:#111827;
    transition:.15s;
}

.action-btn:hover{
    background:#1e293b;
    border-color:#6366f1;
}

.dpad-btn{
    width:52px;
    height:42px;
    border-radius:12px;
    background:#111827;
    border:1px solid #475569;
    font-size:20px;
    font-weight:900;
    transition:.15s;
}

.dpad-btn:hover{
    background:#1e293b;
}

.overlay{
    position:absolute;
    inset:0;
    z-index:50;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:16px;
    background:rgba(2,6,23,.75);
    backdrop-filter:blur(5px);
}

.overlay-card{
    width:min(760px,100%);
    max-height:90vh;
    overflow:auto;
    border:1px solid #475569;
    background:#0f172a;
    border-radius:22px;
    box-shadow:0 30px 80px rgba(0,0,0,.7);
}

.choice{
    width:100%;
    text-align:left;
    padding:12px;
    border-radius:14px;
    border:1px solid #334155;
    background:#111827;
    transition:.15s;
}

.choice:hover{
    border-color:#818cf8;
    background:#1e293b;
    transform:translateX(3px);
}

.location-scene{
    position:absolute;
    inset:0;
    pointer-events:none;
}

.building{
    position:absolute;
    left:5%;
    right:5%;
    bottom:100px;
    height:270px;
    border-radius:25px 25px 0 0;
    background:
        linear-gradient(
            90deg,
            #334155,
            #475569,
            #334155
        );
    border:2px solid #64748b;
}

.window-grid{
    position:absolute;
    inset:30px;
    display:grid;
    grid-template-columns:repeat(6,1fr);
    gap:15px;
}

.window{
    border-radius:8px;
    border:2px solid #64748b;
    background:#172554;
    box-shadow:inset 0 0 20px rgba(59,130,246,.25);
}

.ground{
    position:absolute;
    left:0;
    right:0;
    bottom:0;
    height:105px;
    background:
        repeating-linear-gradient(
            45deg,
            #14532d 0,
            #14532d 20px,
            #166534 20px,
            #166534 40px
        );
    border-top:4px solid #334155;
}

.avatar{
    position:absolute;
    bottom:76px;
    width:120px;
    text-align:center;
    pointer-events:auto;
    cursor:pointer;
}

.avatar-face{
    width:74px;
    height:74px;
    margin:auto;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:45px;
    background:#f8fafc;
    border:4px solid #334155;
    box-shadow:0 8px 20px rgba(0,0,0,.4);
}

.avatar-name{
    margin-top:7px;
    font-weight:900;
    font-size:12px;
    background:#020617dd;
    border-radius:10px;
    padding:4px 8px;
}

.a-lan{left:8%}
.a-min{left:42%}
.a-tuan{right:8%}

.hidden{
    display:none!important;
}

.toast{
    position:fixed;
    left:50%;
    top:18px;
    transform:translateX(-50%);
    z-index:999;
    pointer-events:none;
    min-width:260px;
    max-width:90vw;
    text-align:center;
    padding:12px 18px;
    border-radius:14px;
    background:#020617;
    border:1px solid #475569;
    box-shadow:0 15px 40px rgba(0,0,0,.55);
}

input,textarea{
    outline:none;
}

.save-code{
    font-family:monospace;
    word-break:break-all;
    line-height:1.5;
}

@media(max-width:700px){
    .game-screen{
        min-height:760px;
    }

    .building{
        height:220px;
        bottom:100px;
    }

    .window-grid{
        grid-template-columns:repeat(3,1fr);
    }

    .avatar{
        width:90px;
    }

    .avatar-face{
        width:60px;
        height:60px;
        font-size:34px;
    }

    .a-lan{left:2%}
    .a-min{left:calc(50% - 45px)}
    .a-tuan{right:2%}

    .top-controls{
        flex-wrap:wrap;
    }
}
</style>
</head>

<body>

<div class="game-shell p-2 md:p-4">

<!-- =====================================================
     HEADER
===================================================== -->

<div class="glass rounded-2xl p-3 mb-2 pixel-border">

    <div class="flex items-center justify-between gap-2 flex-wrap">

        <div>
            <div class="pixel text-[10px] md:text-sm text-indigo-300">
                THANH XUÂN RỰC RỠ
            </div>

            <div class="text-[11px] text-slate-400 mt-1">
                Deluxe Career & Assets Edition
            </div>
        </div>

        <div class="top-controls flex gap-1 flex-wrap">

            <button
                id="btnAudio"
                onclick="toggleAudio()"
                class="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px]"
            >
                🔊
            </button>

            <button
                onclick="manualSaveGame()"
                class="px-2 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700 text-[10px]"
            >
                💾 LƯU
            </button>

            <button
                onclick="manualLoadGame(true)"
                class="px-2 py-1.5 rounded-lg bg-sky-900/60 border border-sky-700 text-[10px]"
            >
                📂 TẢI
            </button>

            <button
                onclick="exportSaveFile()"
                class="px-2 py-1.5 rounded-lg bg-indigo-900/60 border border-indigo-700 text-[10px]"
            >
                📤 FILE
            </button>

            <label class="cursor-pointer px-2 py-1.5 rounded-lg bg-purple-900/60 border border-purple-700 text-[10px]">
                📥 FILE
                <input
                    type="file"
                    accept=".json"
                    onchange="importSaveFile(event)"
                    class="hidden"
                >
            </label>

            <button
                onclick="showSaveCode()"
                class="px-2 py-1.5 rounded-lg bg-amber-900/60 border border-amber-700 text-[10px]"
            >
                🔑 MÃ
            </button>

            <button
                onclick="loadSaveCode()"
                class="px-2 py-1.5 rounded-lg bg-pink-900/60 border border-pink-700 text-[10px]"
            >
                🔓 NHẬP MÃ
            </button>

            <button
                onclick="restartGame()"
                class="px-2 py-1.5 rounded-lg bg-rose-900/60 border border-rose-700 text-[10px]"
            >
                🔄
            </button>

        </div>

    </div>

    <div
        id="saveStatus"
        class="text-[9px] text-slate-500 font-mono mt-2"
    >
        SẴN SÀNG
    </div>

</div>


<!-- =====================================================
     HUD
===================================================== -->

<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-2">

    <div class="glass rounded-xl p-2">
        <div class="flex justify-between text-[9px]">
            <span>❤️ HP</span>
            <span id="hpValue">85</span>
        </div>
        <div class="stat-bar mt-1">
            <div id="hpBar" class="stat-fill bg-rose-500"></div>
        </div>
    </div>

    <div class="glass rounded-xl p-2">
        <div class="flex justify-between text-[9px]">
            <span>⚡ Năng lượng</span>
            <span id="energyValue">100</span>
        </div>
        <div class="stat-bar mt-1">
            <div id="energyBar" class="stat-fill bg-yellow-400"></div>
        </div>
    </div>

    <div class="glass rounded-xl p-2">
        <div class="flex justify-between text-[9px]">
            <span>😊 Tâm trạng</span>
            <span id="moodValue">75</span>
        </div>
        <div class="stat-bar mt-1">
            <div id="moodBar" class="stat-fill bg-pink-400"></div>
        </div>
    </div>

    <div class="glass rounded-xl p-2">
        <div class="flex justify-between text-[9px]">
            <span>📚 Học tập</span>
            <span id="studyValue">50</span>
        </div>
        <div class="stat-bar mt-1">
            <div id="studyBar" class="stat-fill bg-blue-400"></div>
        </div>
    </div>

    <div class="glass rounded-xl p-2">
        <div class="flex justify-between text-[9px]">
            <span>💕 Tình cảm</span>
            <span id="loveValue">20</span>
        </div>
        <div class="stat-bar mt-1">
            <div id="loveBar" class="stat-fill bg-pink-500"></div>
        </div>
    </div>

    <div class="glass rounded-xl p-2">
        <div class="flex justify-between text-[9px]">
            <span>🧠 Kỹ năng</span>
            <span id="skillValue">25</span>
        </div>
        <div class="stat-bar mt-1">
            <div id="skillBar" class="stat-fill bg-violet-400"></div>
        </div>
    </div>

    <div class="glass rounded-xl p-2">
        <div class="flex justify-between text-[9px]">
            <span>⭐ Uy tín</span>
            <span id="reputationValue">30</span>
        </div>
        <div class="stat-bar mt-1">
            <div id="reputationBar" class="stat-fill bg-amber-400"></div>
        </div>
    </div>

    <div class="glass rounded-xl p-2">
        <div class="text-[9px]">💰 Tiền</div>
        <div
            id="moneyValue"
            class="text-emerald-400 font-black text-xs mt-1"
        >
            150.000đ
        </div>
    </div>

</div>


<!-- =====================================================
     MAIN SCREEN
===================================================== -->

<div class="game-screen rounded-3xl pixel-border">

    <!-- TOP LOCATION -->
    <div class="absolute top-0 left-0 right-0 z-20 p-3">

        <div class="flex items-center justify-between">

            <div
                class="glass rounded-xl px-3 py-2"
            >
                <div
                    id="locTitle"
                    class="font-black text-xs md:text-sm"
                >
                    LỚP 12A3
                </div>

                <div
                    class="text-[10px] text-slate-400"
                >
                    <span id="locIcon">🏫</span>
                    <span id="dayText">Ngày 1</span>
                    ·
                    <span id="timeText">07:30</span>
                </div>
            </div>

            <div
                class="glass rounded-xl px-3 py-2 text-right"
            >
                <div class="text-[9px] text-slate-500">
                    TIẾN ĐỘ
                </div>

                <div
                    id="progressText"
                    class="font-black text-indigo-300 text-xs"
                >
                    1 / 45
                </div>
            </div>

        </div>

    </div>


    <!-- SCENE -->

    <div
        id="scene"
        class="location-scene"
    >

        <div class="building">
            <div class="window-grid">
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
                <div class="window"></div>
            </div>
        </div>

        <div class="ground"></div>

        <!-- LAN -->
        <div
            class="avatar a-lan"
            onclick="interactNPC('lan')"
        >
            <div class="avatar-face">
                👧🏻
            </div>
            <div class="avatar-name">
                Lan
            </div>
        </div>

        <!-- MIN -->
        <div
            class="avatar a-min"
            onclick="interactNPC('min')"
        >
            <div class="avatar-face">
                👩🏻
            </div>
            <div class="avatar-name">
                Triệu Mẫn 💕
            </div>
        </div>

        <!-- TUAN -->
        <div
            class="avatar a-tuan"
            onclick="interactNPC('tuan')"
        >
            <div class="avatar-face">
                👦🏻
            </div>
            <div class="avatar-name">
                Tuấn
            </div>
        </div>

    </div>


    <!-- =================================================
         CLASSROOM
    ================================================= -->

    <div
        id="classroomQuizCard"
        class="overlay hidden"
    >
        <div class="overlay-card p-5">

            <div class="flex justify-between gap-3">

                <div>
                    <div class="pixel text-[10px] text-blue-300">
                        CLASSROOM QUEST
                    </div>

                    <h2
                        id="quizSubject"
                        class="font-black text-xl mt-2"
                    >
                        TOÁN
                    </h2>
                </div>

                <button
                    onclick="closeOverlayCard()"
                    class="text-slate-400 hover:text-white"
                >
                    ✕
                </button>

            </div>

            <div class="mt-5">

                <div
                    id="quizProgress"
                    class="text-[10px] text-slate-500 mb-2"
                >
                    Câu 1/5
                </div>

                <div
                    id="quizQuestion"
                    class="text-base md:text-lg font-bold leading-relaxed"
                >
                </div>

                <div
                    id="quizAnswers"
                    class="grid gap-2 mt-5"
                >
                </div>

            </div>

        </div>
    </div>


    <!-- =================================================
         CANTEEN
    ================================================= -->

    <div
        id="canteenMenuCard"
        class="overlay hidden"
    >
        <div class="overlay-card p-5">

            <div class="flex justify-between">
                <div>
                    <div class="pixel text-[9px] text-orange-300">
                        CANTEEN
                    </div>
                    <h2 class="text-xl font-black mt-1">
                        🍜 Căn tin cô Năm
                    </h2>
                </div>

                <button onclick="closeOverlayCard()">
                    ✕
                </button>
            </div>

            <div
                id="canteenItemsList"
                class="grid md:grid-cols-2 gap-2 mt-5"
            ></div>

        </div>
    </div>


    <!-- =================================================
         JOB
    ================================================= -->

    <div
        id="jobMenuCard"
        class="overlay hidden"
    >
        <div class="overlay-card p-5">

            <div class="flex justify-between">
                <div>
                    <div class="pixel text-[9px] text-emerald-300">
                        CAREER
                    </div>

                    <h2 class="text-xl font-black mt-1">
                        💼 Việc làm thêm
                    </h2>
                </div>

                <button onclick="closeOverlayCard()">
                    ✕
                </button>
            </div>

            <div
                id="jobItemsList"
                class="grid gap-2 mt-5"
            ></div>

        </div>
    </div>


    <!-- =================================================
         PROPERTY
    ================================================= -->

    <div
        id="propertyShopCard"
        class="overlay hidden"
    >
        <div class="overlay-card p-5">

            <div class="flex justify-between">
                <div>
                    <div class="pixel text-[9px] text-amber-300">
                        ASSET MARKET
                    </div>

                    <h2 class="text-xl font-black mt-1">
                        🏠 Tài sản
                    </h2>
                </div>

                <button onclick="closeOverlayCard()">
                    ✕
                </button>
            </div>

            <div
                id="propertyShopList"
                class="grid gap-2 mt-5"
            ></div>

        </div>
    </div>


    <!-- =================================================
         CERTIFICATE
    ================================================= -->

    <div
        id="certExamCard"
        class="overlay hidden"
    >
        <div class="overlay-card p-5">

            <div class="flex justify-between">
                <div>
                    <div class="pixel text-[9px] text-cyan-300">
                        CERTIFICATION HUB
                    </div>

                    <h2 class="text-xl font-black mt-1">
                        📜 Chứng chỉ
                    </h2>
                </div>

                <button onclick="closeOverlayCard()">
                    ✕
                </button>
            </div>

            <div
                id="certList"
                class="grid gap-3 mt-5"
            ></div>

            <div
                id="certQuestionArea"
                class="hidden mt-5"
            >

                <div
                    id="certProgress"
                    class="text-[10px] text-slate-500"
                ></div>

                <div
                    id="certQuestion"
                    class="font-black text-lg mt-3"
                ></div>

                <div
                    id="certAnswers"
                    class="grid gap-2 mt-4"
                ></div>

            </div>

        </div>
    </div>


    <!-- =================================================
         DIALOGUE
    ================================================= -->

    <div
        id="dialogueCard"
        class="overlay hidden"
    >
        <div class="overlay-card p-5">

            <div class="flex items-start gap-3">

                <div
                    id="dialogueAvatar"
                    class="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-4xl"
                >
                    👩🏻
                </div>

                <div class="flex-1">

                    <div
                        id="dialogueName"
                        class="font-black text-lg"
                    >
                        Triệu Mẫn
                    </div>

                    <div
                        id="dialogueText"
                        class="text-sm text-slate-300 mt-2 leading-relaxed"
                    >
                    </div>

                </div>

            </div>

            <div
                id="dialogueChoices"
                class="grid gap-2 mt-5"
            ></div>

        </div>
    </div>


    <!-- =================================================
         DIARY
    ================================================= -->

    <div
        id="diaryModalCard"
        class="overlay hidden"
    >
        <div class="overlay-card p-6">

            <div class="text-center">

                <div class="text-5xl">
                    📖
                </div>

                <div class="pixel text-[10px] text-indigo-300 mt-3">
                    DIARY
                </div>

                <h2
                    id="diaryTitle"
                    class="text-2xl font-black mt-2"
                >
                    Nhật ký
                </h2>

            </div>

            <div
                id="diaryContentText"
                class="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm leading-relaxed"
            ></div>

            <button
                id="btnContinueFromDiary"
                class="w-full mt-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-black"
            >
                TIẾP TỤC →
            </button>

        </div>
    </div>


    <!-- =================================================
         ENDING
    ================================================= -->

    <div
        id="endingScreenCard"
        class="overlay hidden"
    >
        <div class="overlay-card p-7 text-center">

            <div class="text-7xl">
                🎓
            </div>

            <div class="pixel text-[11px] text-amber-300 mt-5">
                THANH XUÂN RỰC RỠ
            </div>

            <h1 class="text-3xl font-black mt-3">
                TỐT NGHIỆP!
            </h1>

            <p
                id="endingText"
                class="text-slate-300 text-sm leading-relaxed mt-5"
            ></p>

            <div
                id="endingStats"
                class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6"
            ></div>

            <button
                onclick="restartGame()"
                class="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-black"
            >
                🔄 CHƠI LẠI
            </button>

        </div>
    </div>


    <!-- =================================================
         BOTTOM CONTROL
    ================================================= -->

    <div class="absolute bottom-0 left-0 right-0 z-30 p-3">

        <!-- LOCATION NAV -->

        <div
            class="glass rounded-2xl p-2 mb-2 flex gap-1"
        >

            <button
                id="nav_class"
                onclick="gotoLocation('class')"
                class="nav-btn nav-active flex-1 py-2 rounded-lg text-[10px] font-bold border border-transparent"
            >
                🏫 Lớp
            </button>

            <button
                id="nav_canteen"
                onclick="gotoLocation('canteen')"
                class="nav-btn flex-1 py-2 rounded-lg text-[10px] font-bold border border-transparent"
            >
                🍜 Căn tin
            </button>

            <button
                id="nav_job"
                onclick="gotoLocation('job')"
                class="nav-btn flex-1 py-2 rounded-lg text-[10px] font-bold border border-transparent"
            >
                💼 Việc
            </button>

            <button
                id="nav_cert"
                onclick="gotoLocation('cert')"
                class="nav-btn flex-1 py-2 rounded-lg text-[10px] font-bold border border-transparent"
            >
                📜 Chứng chỉ
            </button>

            <button
                id="nav_prop"
                onclick="gotoLocation('prop')"
                class="nav-btn flex-1 py-2 rounded-lg text-[10px] font-bold border border-transparent"
            >
                🏠 Tài sản
            </button>

            <button
                id="nav_home"
                onclick="gotoLocation('home')"
                class="nav-btn flex-1 py-2 rounded-lg text-[10px] font-bold border border-transparent"
            >
                🛏️ Nhà
            </button>

        </div>


        <!-- ACTIONS -->

        <div class="grid grid-cols-2 md:grid-cols-5 gap-1.5">

            <button
                onclick="startClassroomLesson()"
                class="action-btn rounded-xl py-2.5 text-[10px] font-black"
            >
                📚 HỌC
            </button>

            <button
                onclick="toggleProfile()"
                class="action-btn rounded-xl py-2.5 text-[10px] font-black"
            >
                👤 PROFILE
            </button>

            <button
                onclick="toggleBag()"
                class="action-btn rounded-xl py-2.5 text-[10px] font-black"
            >
                🎒 TÚI ĐỒ
            </button>

            <button
                onclick="openDiaryManual()"
                class="action-btn rounded-xl py-2.5 text-[10px] font-black"
            >
                📖 NHẬT KÝ
            </button>

            <button
                onclick="quickSleep()"
                class="action-btn rounded-xl py-2.5 text-[10px] font-black"
            >
                😴 NGỦ
            </button>

        </div>


        <!-- D-PAD -->

        <div class="flex items-center justify-between mt-2">

            <div class="flex items-center gap-1">

                <button
                    onclick="navigateDpad(-1)"
                    class="dpad-btn"
                >
                    ◀
                </button>

                <button
                    onclick="navigateDpad(1)"
                    class="dpad-btn"
                >
                    ▶
                </button>

            </div>

            <div
                id="actionMessage"
                class="text-[9px] text-slate-500 text-center"
            >
                Chọn hoạt động để bắt đầu ngày mới.
            </div>

            <button
                onclick="showHelp()"
                class="dpad-btn"
            >
                ?
            </button>

        </div>

    </div>

</div>

</div>


<!-- =====================================================
     TOAST
===================================================== -->

<div
    id="toast"
    class="toast hidden"
>
    <div
        id="toastText"
        class="font-bold text-sm"
    ></div>
</div>


<!-- =====================================================
     JAVASCRIPT
===================================================== -->

<script>

/* =====================================================
   AUDIO
===================================================== */

class RetroAudio {

    constructor(){

        this.enabled = true;
        this.ctx = null;

    }

    init(){

        if(!this.enabled) return;

        try{

            if(!this.ctx){

                const AudioCtx =
                    window.AudioContext ||
                    window.webkitAudioContext;

                if(!AudioCtx){

                    this.enabled = false;
                    return;
                }

                this.ctx = new AudioCtx();
            }

            if(this.ctx.state === 'suspended'){
                this.ctx.resume();
            }

        }catch(e){

            this.enabled = false;

        }
    }

    playTone(
        frequency=440,
        type='square',
        duration=.1,
        volume=.05
    ){

        if(!this.enabled) return;

        this.init();

        if(!this.ctx) return;

        try{

            const osc =
                this.ctx.createOscillator();

            const gain =
                this.ctx.createGain();

            osc.type = type;
            osc.frequency.value = frequency;

            gain.gain.setValueAtTime(
                volume,
                this.ctx.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                .001,
                this.ctx.currentTime + duration
            );

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(
                this.ctx.currentTime + duration
            );

        }catch(e){}
    }

    playClick(){
        this.playTone(500,'square',.06,.04);
    }

    playSuccess(){

        this.playTone(660,'square',.1,.05);

        setTimeout(
            ()=>this.playTone(880,'square',.12,.05),
            80
        );
    }

    playWrong(){

        this.playTone(180,'sawtooth',.18,.05);

    }

    playBell(){

        this.playTone(880,'sine',.15,.05);

        setTimeout(
            ()=>this.playTone(1100,'sine',.2,.05),
            130
        );
    }

}

const audio = new RetroAudio();


/* =====================================================
   DATA
===================================================== */

const TIME_PERIODS = [
    '07:30',
    '09:15',
    '11:30',
    '14:00',
    '17:00',
    '20:30'
];

const LOCATIONS_LIST = [
    'class',
    'canteen',
    'job',
    'cert',
    'prop',
    'home'
];


/* =====================================================
   QUIZ BANK
===================================================== */

const QUIZ_BANK = [

{
    id:'m1',
    subject:'Toán',
    q:'Cho hàm số y = x² - 4x + 3. Hoành độ đỉnh của parabol là?',
    options:['1','2','3','4'],
    answer:1
},

{
    id:'m2',
    subject:'Toán',
    q:'Cấp số cộng có u₁ = 3 và công sai d = 2. u₅ bằng?',
    options:['9','10','11','12'],
    answer:2
},

{
    id:'v1',
    subject:'Ngữ văn',
    q:'Tác phẩm "Vợ nhặt" của Kim Lân tập trung phản ánh điều gì?',
    options:[
        'Cuộc sống đô thị hiện đại',
        'Nạn đói năm 1945 và tình người',
        'Chiến tranh thế giới thứ nhất',
        'Đời sống công nhân'
    ],
    answer:1
},

{
    id:'l1',
    subject:'Vật lý',
    q:'Đơn vị của công suất trong hệ SI là gì?',
    options:[
        'Joule',
        'Newton',
        'Watt',
        'Pascal'
    ],
    answer:2
},

{
    id:'h1',
    subject:'Hóa học',
    q:'Công thức của axit sunfuric là?',
    options:[
        'HCl',
        'HNO₃',
        'H₂SO₄',
        'NaOH'
    ],
    answer:2
},

{
    id:'s1',
    subject:'Sinh học',
    q:'Đơn vị cấu tạo cơ bản của cơ thể sống là?',
    options:[
        'Mô',
        'Tế bào',
        'Cơ quan',
        'Hệ cơ quan'
    ],
    answer:1
},

{
    id:'su1',
    subject:'Lịch sử',
    q:'Cách mạng tháng Tám ở Việt Nam thành công vào năm nào?',
    options:[
        '1930',
        '1941',
        '1945',
        '1954'
    ],
    answer:2
},

{
    id:'d1',
    subject:'Địa lý',
    q:'Việt Nam nằm ở khu vực nào của châu Á?',
    options:[
        'Đông Á',
        'Đông Nam Á',
        'Tây Á',
        'Nam Á'
    ],
    answer:1
},

{
    id:'a1',
    subject:'Tiếng Anh',
    q:'If I ___ rich, I would travel around the world.',
    options:[
        'am',
        'was',
        'were',
        'will be'
    ],
    answer:2
},

{
    id:'gd1',
    subject:'GDCD',
    q:'Pháp luật có đặc điểm cơ bản nào sau đây?',
    options:[
        'Tính tự nguyện tuyệt đối',
        'Tính bắt buộc chung',
        'Chỉ áp dụng cho học sinh',
        'Không có chế tài'
    ],
    answer:1
},

{
    id:'me1',
    subject:'Đố mẹo',
    q:'Cái gì càng lấy đi thì càng lớn?',
    options:[
        'Cái túi',
        'Cái hố',
        'Cái hộp',
        'Cái cây'
    ],
    answer:1
},

{
    id:'m3',
    subject:'Toán',
    q:'Đạo hàm của y = x³ là?',
    options:[
        'x²',
        '2x',
        '3x²',
        '3x'
    ],
    answer:2
},

{
    id:'l2',
    subject:'Vật lý',
    q:'Vận tốc ánh sáng trong chân không xấp xỉ bằng?',
    options:[
        '3×10⁶ m/s',
        '3×10⁸ m/s',
        '3×10⁴ m/s',
        '3×10¹⁰ m/s'
    ],
    answer:1
},

{
    id:'h2',
    subject:'Hóa học',
    q:'NaCl là công thức của chất nào?',
    options:[
        'Muối ăn',
        'Đường',
        'Nước',
        'Axit'
    ],
    answer:0
},

{
    id:'s2',
    subject:'Sinh học',
    q:'ADN có chức năng chủ yếu nào?',
    options:[
        'Lưu trữ thông tin di truyền',
        'Tiêu hóa thức ăn',
        'Vận chuyển oxy',
        'Tạo năng lượng trực tiếp'
    ],
    answer:0
},

{
    id:'su2',
    subject:'Lịch sử',
    q:'Chiến thắng Điện Biên Phủ diễn ra năm nào?',
    options:[
        '1945',
        '1950',
        '1954',
        '1975'
    ],
    answer:2
},

{
    id:'d2',
    subject:'Địa lý',
    q:'Đồng bằng lớn nhất Việt Nam là?',
    options:[
        'Đồng bằng sông Hồng',
        'Đồng bằng sông Cửu Long',
        'Đồng bằng Thanh Hóa',
        'Đồng bằng Nghệ An'
    ],
    answer:1
},

{
    id:'a2',
    subject:'Tiếng Anh',
    q:'She has lived here ___ 2020.',
    options:[
        'for',
        'since',
        'from',
        'at'
    ],
    answer:1
},

{
    id:'gd2',
    subject:'GDCD',
    q:'Công dân bình đẳng trước pháp luật nghĩa là?',
    options:[
        'Mọi người đều có quyền và nghĩa vụ theo quy định pháp luật',
        'Ai giàu cũng được ưu tiên',
        'Chỉ người lớn mới chịu pháp luật',
        'Không cần tuân thủ pháp luật'
    ],
    answer:0
},

{
    id:'me2',
    subject:'Đố mẹo',
    q:'Một con gà đứng trên mái nhà đẻ trứng. Trứng sẽ lăn về bên nào?',
    options:[
        'Bên trái',
        'Bên phải',
        'Phía trước',
        'Gà trống không đẻ trứng'
    ],
    answer:3
}

];


/* =====================================================
   CANTEEN
===================================================== */

const CANTEEN_MENU = [

{
    id:'banhmi',
    name:'Bánh mì trứng',
    icon:'🥖',
    cost:15000,
    energy:12,
    mood:4,
    love:0
},

{
    id:'milk',
    name:'Sữa tươi',
    icon:'🥛',
    cost:10000,
    energy:8,
    mood:2,
    love:0
},

{
    id:'rice',
    name:'Cơm phần',
    icon:'🍱',
    cost:25000,
    energy:22,
    mood:6,
    love:0
},

{
    id:'tra',
    name:'Trà đào',
    icon:'🧋',
    cost:18000,
    energy:5,
    mood:10,
    love:2
},

{
    id:'strawberry',
    name:'Kẹo dâu',
    icon:'🍬',
    cost:12000,
    energy:2,
    mood:8,
    love:5
}

];


/* =====================================================
   JOBS
===================================================== */

const PART_TIME_JOBS = [

{
    id:'canteen',
    name:'Phụ bán căn tin',
    icon:'🍜',
    salary:50000,
    energyCost:15,
    reqDesc:'Không yêu cầu',
    condition:s=>true
},

{
    id:'flyer',
    name:'Phát tờ rơi',
    icon:'📄',
    salary:70000,
    energyCost:20,
    reqDesc:'Năng lượng ≥ 30',
    condition:s=>s.stats.energy>=30
},

{
    id:'excel',
    name:'Nhập dữ liệu Excel',
    icon:'💻',
    salary:120000,
    energyCost:25,
    reqDesc:'Kỹ năng ≥ 35',
    condition:s=>s.stats.skill>=35
},

{
    id:'driver',
    name:'Tài xế VIP',
    icon:'🚗',
    salary:250000,
    energyCost:35,
    reqDesc:'Có bằng lái + ô tô',
    condition:s=>
        s.certificates.includes('cert_driver') &&
        (
            s.assets.includes('asset_car_sedan') ||
            s.assets.includes('asset_car_super')
        )
},

{
    id:'interpreter',
    name:'Cộng tác viên phiên dịch',
    icon:'🌎',
    salary:300000,
    energyCost:30,
    reqDesc:'TOEIC + Kỹ năng ≥ 55',
    condition:s=>
        s.certificates.includes('cert_toeic') &&
        s.stats.skill>=55
},

{
    id:'broker',
    name:'Cộng tác viên chứng khoán',
    icon:'📈',
    salary:350000,
    energyCost:35,
    reqDesc:'Tài chính + Kỹ năng ≥ 65',
    condition:s=>
        s.certificates.includes('cert_finance') &&
        s.stats.skill>=65
}

];


/* =====================================================
   CERTIFICATES
===================================================== */

const CERTIFICATES = [

{
    id:'cert_driver',
    name:'Bằng lái ô tô',
    icon:'🚗',
    fee:500000,
    reqSkill:25,
    questions:[
        {
            q:'Đèn đỏ có ý nghĩa gì?',
            options:['Được đi','Dừng lại','Đi chậm','Quay đầu'],
            answer:1
        },
        {
            q:'Người lái xe phải làm gì khi gặp biển STOP?',
            options:[
                'Tăng tốc',
                'Dừng xe',
                'Bấm còi',
                'Vượt xe'
            ],
            answer:1
        },
        {
            q:'Khi lái xe, hành vi nào nguy hiểm?',
            options:[
                'Thắt dây an toàn',
                'Quan sát gương',
                'Sử dụng điện thoại',
                'Giữ khoảng cách'
            ],
            answer:2
        }
    ]
},

{
    id:'cert_toeic',
    name:'TOEIC',
    icon:'🇬🇧',
    fee:350000,
    reqSkill:35,
    questions:[
        {
            q:'Choose: I ___ to school every day.',
            options:['go','goes','going','gone'],
            answer:0
        },
        {
            q:'What is the opposite of "cheap"?',
            options:['small','expensive','easy','short'],
            answer:1
        },
        {
            q:'She ___ finished her homework.',
            options:['have','has','having','had'],
            answer:1
        }
    ]
},

{
    id:'cert_mos',
    name:'MOS Office',
    icon:'💻',
    fee:300000,
    reqSkill:45,
    questions:[
        {
            q:'Excel dùng chủ yếu để làm gì?',
            options:[
                'Xử lý bảng tính',
                'Chỉnh ảnh',
                'Dựng phim',
                'Nghe nhạc'
            ],
            answer:0
        },
        {
            q:'Hàm SUM dùng để?',
            options:[
                'Đếm ký tự',
                'Tính tổng',
                'Tìm ngày',
                'Xóa dữ liệu'
            ],
            answer:1
        },
        {
            q:'Ctrl + C có chức năng?',
            options:[
                'Dán',
                'Sao chép',
                'Cắt',
                'Lưu'
            ],
            answer:1
        }
    ]
},

{
    id:'cert_finance',
    name:'Tài chính cơ bản',
    icon:'📈',
    fee:400000,
    reqSkill:55,
    questions:[
        {
            q:'ROI là chỉ số liên quan đến?',
            options:[
                'Lợi nhuận trên đầu tư',
                'Dân số',
                'Thời tiết',
                'Tốc độ mạng'
            ],
            answer:0
        },
        {
            q:'Rủi ro và lợi nhuận thường có quan hệ như thế nào?',
            options:[
                'Không liên quan',
                'Rủi ro cao có thể đi kèm lợi nhuận kỳ vọng cao hơn',
                'Rủi ro cao luôn lỗ',
                'Không thể đo lường'
            ],
            answer:1
        },
        {
            q:'Đa dạng hóa danh mục nhằm mục đích gì?',
            options:[
                'Tăng mọi rủi ro',
                'Giảm rủi ro tập trung',
                'Không cần theo dõi',
                'Đảm bảo chắc chắn có lãi'
            ],
            answer:1
        }
    ]
}

];


/* =====================================================
   PROPERTIES
===================================================== */

const PROPERTIES_CATALOG = [

{
    id:'asset_bike',
    name:'Xe máy phổ thông',
    icon:'🛵',
    price:8000000,
    desc:'Phương tiện đi học',
    buffDesc:'+10% hiệu quả đi làm',
    reqLicense:null
},

{
    id:'asset_car_sedan',
    name:'Sedan hạng B',
    icon:'🚗',
    price:450000000,
    desc:'Ô tô đầu tiên',
    buffDesc:'+25% tình cảm',
    reqLicense:'cert_driver'
},

{
    id:'asset_car_super',
    name:'Siêu xe',
    icon:'🏎️',
    price:1800000000,
    desc:'Biểu tượng thành công',
    buffDesc:'+40% tình cảm, +20 uy tín',
    reqLicense:'cert_driver'
},

{
    id:'asset_condo',
    name:'Căn hộ cao cấp',
    icon:'🏢',
    price:2500000000,
    desc:'Không gian sống riêng',
    buffDesc:'+25 năng lượng khi nghỉ',
    reqLicense:null
},

{
    id:'asset_villa',
    name:'Biệt thự',
    icon:'🏰',
    price:7000000000,
    desc:'Mục tiêu cuối game',
    buffDesc:'+35 năng lượng, +10 mood',
    reqLicense:null
}

];


/* =====================================================
   DEFAULT STATE
===================================================== */

const DEFAULT_STATE = {

    version:2,

    isGameOver:false,

    day:1,

    totalDays:45,

    timeIndex:0,

    location:'class',

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

    bag:[
        {
            id:'math_note',
            name:'Sổ Công Thức',
            icon:'📘',
            count:1,
            desc:'+8 Điểm học tập'
        },
        {
            id:'gift_strawberry',
            name:'Kẹo Dâu Tây',
            icon:'🍬',
            count:2,
            desc:'+8 Tình cảm'
        },
        {
            id:'energy_drink',
            name:'Nước tăng lực',
            icon:'🥤',
            count:1,
            desc:'+25 năng lượng'
        }
    ],

    todayEvents:[],

    diaryEntries:[]

};


function clone(obj){

    return JSON.parse(
        JSON.stringify(obj)
    );

}


let STATE = clone(DEFAULT_STATE);


/* =====================================================
   NORMALIZE STATE
===================================================== */

function normalizeState(data){

    const base =
        clone(DEFAULT_STATE);

    if(!data || typeof data !== 'object'){
        return base;
    }

    base.version = 2;

    base.isGameOver =
        Boolean(data.isGameOver);

    base.day =
        Number.isFinite(Number(data.day))
            ? Math.max(
                1,
                Math.min(
                    base.totalDays,
                    Number(data.day)
                )
            )
            : 1;

    base.totalDays =
        Number.isFinite(Number(data.totalDays))
            ? Math.max(1,Number(data.totalDays))
            : 45;

    base.timeIndex =
        Number.isFinite(Number(data.timeIndex))
            ? Math.max(
                0,
                Math.min(
                    TIME_PERIODS.length-1,
                    Number(data.timeIndex)
                )
            )
            : 0;

    base.location =
        LOCATIONS_LIST.includes(data.location)
            ? data.location
            : 'class';

    base.stats = {
        ...base.stats,
        ...(data.stats || {})
    };

    Object.keys(base.stats).forEach(key=>{

        base.stats[key] =
            Number(base.stats[key]) || 0;

    });

    base.certificates =
        Array.isArray(data.certificates)
            ? [...new Set(data.certificates)]
            : [];

    base.assets =
        Array.isArray(data.assets)
            ? [...new Set(data.assets)]
            : [];

    base.bag =
        Array.isArray(data.bag)
            ? data.bag
            : clone(DEFAULT_STATE.bag);

    base.todayEvents =
        Array.isArray(data.todayEvents)
            ? data.todayEvents
            : [];

    base.diaryEntries =
        Array.isArray(data.diaryEntries)
            ? data.diaryEntries
            : [];

    return base;

}


/* =====================================================
   DOM HELPERS
===================================================== */

function $(id){

    return document.getElementById(id);

}


function clamp(
    value,
    min=0,
    max=100
){

    return Math.max(
        min,
        Math.min(max,value)
    );

}


/* =====================================================
   HUD
===================================================== */

function updateBar(
    valueId,
    barId,
    value
){

    const valueEl = $(valueId);
    const barEl = $(barId);

    if(valueEl){
        valueEl.textContent =
            Math.round(value);
    }

    if(barEl){
        barEl.style.width =
            `${clamp(value)}%`;
    }

}


function updateHUD(){

    const s = STATE.stats;

    updateBar(
        'hpValue',
        'hpBar',
        s.hp
    );

    updateBar(
        'energyValue',
        'energyBar',
        s.energy
    );

    updateBar(
        'moodValue',
        'moodBar',
        s.mood
    );

    updateBar(
        'studyValue',
        'studyBar',
        s.study
    );

    updateBar(
        'loveValue',
        'loveBar',
        s.love
    );

    updateBar(
        'skillValue',
        'skillBar',
        s.skill
    );

    updateBar(
        'reputationValue',
        'reputationBar',
        s.reputation
    );

    if($('moneyValue')){

        $('moneyValue').textContent =
            `${Math.round(s.money).toLocaleString('vi-VN')}đ`;

    }

    if($('dayText')){

        $('dayText').textContent =
            `Ngày ${STATE.day}`;

    }

    if($('timeText')){

        $('timeText').textContent =
            TIME_PERIODS[
                STATE.timeIndex
            ];

    }

    if($('progressText')){

        $('progressText').textContent =
            `${STATE.day} / ${STATE.totalDays}`;

    }

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer = null;

function showStatAlert(
    message,
    colorClass='text-white'
){

    const toast = $('toast');
    const text = $('toastText');

    if(!toast || !text) return;

    text.textContent = message;

    text.className =
        `font-bold text-sm ${colorClass}`;

    toast.classList.remove('hidden');

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            ()=>toast.classList.add('hidden'),
            2200
        );

}


/* =====================================================
   OVERLAYS
===================================================== */

const ALL_OVERLAYS = [
    'classroomQuizCard',
    'canteenMenuCard',
    'jobMenuCard',
    'propertyShopCard',
    'certExamCard',
    'dialogueCard',
    'diaryModalCard',
    'endingScreenCard'
];


function closeDrawer(){

    const panel =
        $('actionDrawerPanel');

    if(panel){
        panel.classList.add('hidden');
    }

}


function hideAllOverlays(){

    ALL_OVERLAYS.forEach(id=>{

        const el = $(id);

        if(el){
            el.classList.add('hidden');
        }

    });

}


function closeOverlayCard(){

    hideAllOverlays();

    if(STATE.isGameOver){

        return;

    }

    $('scene')?.classList.remove('hidden');

}


function showOverlay(id){

    hideAllOverlays();

    const scene = $('scene');

    if(scene){
        scene.classList.add('hidden');
    }

    const el = $(id);

    if(el){
        el.classList.remove('hidden');
    }

}


/* =====================================================
   LOCATION
===================================================== */

function updateLocationButtons(){

    LOCATIONS_LIST.forEach(loc=>{

        const btn =
            $(`nav_${loc}`);

        if(!btn) return;

        btn.classList.toggle(
            'nav-active',
            STATE.location === loc
        );

    });

}


function gotoLocation(loc){

    if(STATE.isGameOver) return;

    if(!LOCATIONS_LIST.includes(loc)){
        loc='class';
    }

    STATE.location = loc;

    closeDrawer();

    hideAllOverlays();

    $('scene')?.classList.remove('hidden');

    updateLocationButtons();

    switch(loc){

        case'class':

            $('locTitle').textContent =
                'LỚP 12A3 - KHỐI CHUYÊN';

            $('locIcon').textContent='🏫';

            break;


        case'canteen':

            $('locTitle').textContent =
                'CĂN TIN TRƯỜNG';

            $('locIcon').textContent='🍜';

            openCanteenMenu();

            break;


        case'job':

            $('locTitle').textContent =
                'KHU VIỆC LÀM';

            $('locIcon').textContent='💼';

            openJobMenu();

            break;


        case'cert':

            $('locTitle').textContent =
                'TRUNG TÂM CHỨNG CHỈ';

            $('locIcon').textContent='📜';

            openCertHub();

            break;


        case'prop':

            $('locTitle').textContent =
                'SÀN TÀI SẢN';

            $('locIcon').textContent='🏠';

            openPropertyShop();

            break;


        case'home':

            $('locTitle').textContent =
                'PHÒNG RIÊNG';

            $('locIcon').textContent='🏠';

            break;

    }

    updateHUD();

    saveGame();

}


/* =====================================================
   D-PAD
===================================================== */

function navigateDpad(direction){

    if(STATE.isGameOver) return;

    let index =
        LOCATIONS_LIST.indexOf(
            STATE.location
        );

    if(index<0) index=0;

    index += direction;

    if(index<0){
        index =
            LOCATIONS_LIST.length-1;
    }

    if(index>=LOCATIONS_LIST.length){
        index=0;
    }

    audio.playClick();

    gotoLocation(
        LOCATIONS_LIST[index]
    );

}


/* =====================================================
   MODIFY STATS
===================================================== */

function modifyStats(changes){

    Object.keys(changes).forEach(key=>{

        if(
            key==='money'
        ){

            STATE.stats.money +=
                Number(changes[key]) || 0;

            return;
        }

        if(
            typeof STATE.stats[key] === 'number'
        ){

            STATE.stats[key] =
                clamp(
                    STATE.stats[key] +
                    Number(changes[key] || 0)
                );

        }

    });

    updateHUD();

    saveGame();

}


/* =====================================================
   ADVANCE TIME
===================================================== */

function advanceTime(){

    if(STATE.isGameOver) return;

    STATE.timeIndex++;

    if(
        STATE.timeIndex >=
        TIME_PERIODS.length
    ){

        triggerEndOfDayDiary();

        return;
    }

    updateHUD();

    saveGame();

}


/* =====================================================
   CLASS QUIZ
===================================================== */

let currentQuizQuestions = [];

let currentQuizIndex = 0;

let currentQuizScore = 0;


function startClassroomLesson(){

    if(STATE.isGameOver) return;

    if(STATE.stats.energy < 12){

        showStatAlert(
            '⚡ Không đủ năng lượng để học!',
            'text-amber-400'
        );

        return;
    }

    const shuffled =
        [...QUIZ_BANK]
        .sort(
            ()=>Math.random()-.5
        );

    currentQuizQuestions =
        shuffled.slice(0,5);

    currentQuizIndex=0;
    currentQuizScore=0;

    showOverlay(
        'classroomQuizCard'
    );

    renderQuizQuestion();

}


function renderQuizQuestion(){

    const q =
        currentQuizQuestions[
            currentQuizIndex
        ];

    if(!q) return;

    $('quizSubject').textContent =
        q.subject;

    $('quizProgress').textContent =
        `Câu ${currentQuizIndex+1}/${currentQuizQuestions.length}`;

    $('quizQuestion').textContent =
        q.q;

    const answers =
        $('quizAnswers');

    answers.innerHTML='';

    q.options.forEach(
        (option,index)=>{

            const btn =
                document.createElement('button');

            btn.className =
                'choice';

            btn.innerHTML =
                `<b>${String.fromCharCode(65+index)}.</b> ${option}`;

            btn.onclick =
                ()=>handleQuizAnswer(
                    index
                );

            answers.appendChild(btn);

        }
    );

}


function handleQuizAnswer(index){

    const q =
        currentQuizQuestions[
            currentQuizIndex
        ];

    if(index === q.answer){

        currentQuizScore++;

        audio.playSuccess();

        showStatAlert(
            '✅ Chính xác!',
            'text-emerald-400'
        );

    }else{

        audio.playWrong();

        showStatAlert(
            '❌ Chưa đúng!',
            'text-rose-400'
        );

    }

    setTimeout(()=>{

        currentQuizIndex++;

        if(
            currentQuizIndex >=
            currentQuizQuestions.length
        ){

            finishClassQuiz();

        }else{

            renderQuizQuestion();

        }

    },500);

}


function finishClassQuiz(){

    closeOverlayCard();

    const reward =
        currentQuizScore * 4;

    const skillReward =
        currentQuizScore >= 4
            ? 3
            : 1;

    modifyStats({

        energy:-12,

        study:reward,

        skill:skillReward,

        mood:
            currentQuizScore>=3
                ? 4
                : -2

    });

    STATE.todayEvents.push(
        `Đã hoàn thành tiết học và đúng ${currentQuizScore}/${currentQuizQuestions.length} câu.`
    );

    showStatAlert(
        `📚 +${reward} học tập · +${skillReward} kỹ năng`,
        'text-blue-400'
    );

    advanceTime();

}


/* =====================================================
   CANTEEN
===================================================== */

function openCanteenMenu(){

    showOverlay(
        'canteenMenuCard'
    );

    const list =
        $('canteenItemsList');

    list.innerHTML='';

    CANTEEN_MENU.forEach(item=>{

        const row =
            document.createElement('div');

        row.className =
            'glass rounded-xl p-3 flex items-center justify-between gap-3';

        row.innerHTML=`

            <div class="flex items-center gap-3">

                <div class="text-3xl">
                    ${item.icon}
                </div>

                <div>

                    <div class="font-bold">
                        ${item.name}
                    </div>

                    <div class="text-[10px] text-slate-400">
                        +${item.energy} ⚡
                        ·
                        +${item.mood} 😊
                        ${item.love ? `· +${item.love} 💕`:''}
                    </div>

                    <div class="text-[10px] text-emerald-400 font-bold">
                        ${item.cost.toLocaleString('vi-VN')}đ
                    </div>

                </div>

            </div>

            <button
                class="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-black"
                onclick="buyCanteenItem('${item.id}')"
            >
                MUA
            </button>

        `;

        list.appendChild(row);

    });

}


function buyCanteenItem(id){

    const item =
        CANTEEN_MENU.find(
            x=>x.id===id
        );

    if(!item) return;

    if(STATE.stats.money < item.cost){

        audio.playWrong();

        showStatAlert(
            '💸 Không đủ tiền!',
            'text-rose-400'
        );

        return;

    }

    STATE.stats.money -=
        item.cost;

    STATE.stats.energy =
        clamp(
            STATE.stats.energy +
            item.energy
        );

    STATE.stats.mood =
        clamp(
            STATE.stats.mood +
            item.mood
        );

    STATE.stats.love =
        clamp(
            STATE.stats.love +
            item.love
        );

    STATE.todayEvents.push(
        `Đã ăn ${item.name}.`
    );

    audio.playSuccess();

    updateHUD();

    saveGame();

    showStatAlert(
        `😋 ${item.name} rất ngon!`,
        'text-emerald-400'
    );

    advanceTime();

}


/* =====================================================
   JOB
===================================================== */

function openJobMenu(){

    showOverlay(
        'jobMenuCard'
    );

    const list =
        $('jobItemsList');

    list.innerHTML='';

    PART_TIME_JOBS.forEach(job=>{

        const available =
            job.condition(STATE);

        const row =
            document.createElement('div');

        row.className =
            'glass rounded-xl p-3 flex items-center justify-between gap-3';

        row.innerHTML=`

            <div class="flex items-center gap-3">

                <div class="text-3xl">
                    ${job.icon}
                </div>

                <div>

                    <div class="font-bold">
                        ${job.name}
                    </div>

                    <div class="text-[10px] text-emerald-400">
                        +${job.salary.toLocaleString('vi-VN')}đ
                    </div>

                    <div class="text-[10px] text-amber-400">
                        -${job.energyCost} ⚡
                    </div>

                    <div class="text-[9px] text-indigo-300">
                        ${job.reqDesc}
                    </div>

                </div>

            </div>

        `;

        const button =
            document.createElement('button');

        button.className =
            available
                ? 'px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-black'
                : 'px-3 py-2 rounded-lg bg-slate-800 text-slate-500 text-xs font-black';

        button.textContent =
            available
                ? 'ĐI LÀM'
                : 'KHÓA';

        button.onclick=()=>{

            if(!available){

                showStatAlert(
                    `🔒 ${job.reqDesc}`,
                    'text-amber-400'
                );

                return;

            }

            performJob(job.id);

        };

        row.appendChild(button);

        list.appendChild(row);

    });

}


function performJob(id){

    const job =
        PART_TIME_JOBS.find(
            x=>x.id===id
        );

    if(!job) return;

    if(!job.condition(STATE)){

        showStatAlert(
            `🔒 ${job.reqDesc}`,
            'text-amber-400'
        );

        return;

    }

    if(
        STATE.stats.energy <
        job.energyCost
    ){

        audio.playWrong();

        showStatAlert(
            '⚡ Không đủ năng lượng!',
            'text-amber-400'
        );

        return;

    }

    let salary =
        job.salary;

    if(
        STATE.assets.includes(
            'asset_bike'
        )
    ){

        salary =
            Math.round(
                salary * 1.1
            );

    }

    STATE.stats.energy -=
        job.energyCost;

    STATE.stats.money +=
        salary;

    STATE.stats.skill =
        clamp(
            STATE.stats.skill +
            2
        );

    STATE.stats.reputation =
        clamp(
            STATE.stats.reputation +
            1
        );

    STATE.todayEvents.push(
        `Đi làm: ${job.name}, nhận ${salary.toLocaleString('vi-VN')}đ.`
    );

    audio.playSuccess();

    saveGame();

    updateHUD();

    showStatAlert(
        `💼 +${salary.toLocaleString('vi-VN')}đ`,
        'text-emerald-400'
    );

    advanceTime();

}


/* =====================================================
   PROPERTY
===================================================== */

function openPropertyShop(){

    showOverlay(
        'propertyShopCard'
    );

    const list =
        $('propertyShopList');

    list.innerHTML='';

    PROPERTIES_CATALOG.forEach(item=>{

        const owned =
            STATE.assets.includes(
                item.id
            );

        const locked =
            item.reqLicense &&
            !STATE.certificates.includes(
                item.reqLicense
            );

        const row =
            document.createElement('div');

        row.className =
            'glass rounded-xl p-3 flex items-center justify-between gap-3';

        row.innerHTML=`

            <div class="flex items-center gap-3">

                <div class="text-4xl">
                    ${item.icon}
                </div>

                <div>

                    <div class="font-black">
                        ${item.name}
                    </div>

                    <div class="text-[10px] text-slate-400">
                        ${item.desc}
                    </div>

                    <div class="text-[10px] text-amber-300">
                        ${item.buffDesc}
                    </div>

                    <div class="text-[10px] text-emerald-400 font-bold">
                        ${item.price.toLocaleString('vi-VN')}đ
                    </div>

                    ${
                        item.reqLicense
                        ?
                        `<div class="text-[9px] text-cyan-300">
                            🔑 Cần bằng lái ô tô
                         </div>`
                        :''
                    }

                </div>

            </div>

        `;

        const button =
            document.createElement('button');

        button.className =
            'px-3 py-2 rounded-lg text-xs font-black ' +
            (
                owned
                    ? 'bg-emerald-700 text-white'
                    : locked
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            );

        button.textContent =
            owned
                ? 'ĐÃ MUA'
                : locked
                    ? 'KHÓA'
                    : 'MUA';

        button.onclick=()=>{

            if(!owned && !locked){

                buyProperty(item.id);

            }else if(locked){

                showStatAlert(
                    '🔒 Cần bằng lái ô tô!',
                    'text-amber-400'
                );

            }

        };

        row.appendChild(button);

        list.appendChild(row);

    });

}


function buyProperty(id){

    const item =
        PROPERTIES_CATALOG.find(
            x=>x.id===id
        );

    if(!item) return;

    if(STATE.assets.includes(id)){

        showStatAlert(
            '🏠 Bạn đã sở hữu tài sản này!',
            'text-amber-400'
        );

        return;

    }

    if(
        item.reqLicense &&
        !STATE.certificates.includes(
            item.reqLicense
        )
    ){

        showStatAlert(
            '🔒 Bạn chưa có bằng lái!',
            'text-rose-400'
        );

        return;

    }

    if(
        STATE.stats.money <
        item.price
    ){

        audio.playWrong();

        showStatAlert(
            `💸 Cần ${item.price.toLocaleString('vi-VN')}đ`,
            'text-rose-400'
        );

        return;

    }

    STATE.stats.money -=
        item.price;

    STATE.assets.push(id);

    STATE.stats.reputation =
        clamp(
            STATE.stats.reputation +
            (
                id==='asset_car_super'
                    ? 20
                    : 8
            )
        );

    STATE.stats.love =
        clamp(
            STATE.stats.love +
            (
                id.includes('car')
                    ? 25
                    : 5
            )
        );

    STATE.stats.mood =
        clamp(
            STATE.stats.mood +
            15
        );

    STATE.todayEvents.push(
        `Mua thành công ${item.name}.`
    );

    audio.playSuccess();

    saveGame();

    updateHUD();

    showStatAlert(
        `🎉 Đã mua ${item.name}!`,
        'text-amber-300'
    );

    openPropertyShop();

}


/* =====================================================
   CERTIFICATE
===================================================== */

let currentCert = null;

let currentCertQuestion = 0;

let currentCertScore = 0;


function openCertHub(){

    showOverlay(
        'certExamCard'
    );

    $('certQuestionArea')
        .classList.add('hidden');

    $('certList')
        .classList.remove('hidden');

    renderCertificatesList();

}


function renderCertificatesList(){

    const list =
        $('certList');

    list.innerHTML='';

    CERTIFICATES.forEach(cert=>{

        const owned =
            STATE.certificates.includes(
                cert.id
            );

        const canTake =
            STATE.stats.skill >=
            cert.reqSkill;

        const row =
            document.createElement('div');

        row.className =
            'glass rounded-xl p-4';

        row.innerHTML=`

            <div class="flex items-center justify-between gap-3">

                <div class="flex items-center gap-3">

                    <div class="text-4xl">
                        ${cert.icon}
                    </div>

                    <div>

                        <div class="font-black">
                            ${cert.name}
                        </div>

                        <div class="text-[10px] text-slate-400">
                            Lệ phí:
                            ${cert.fee.toLocaleString('vi-VN')}đ
                        </div>

                        <div class="text-[10px] text-indigo-300">
                            Yêu cầu kỹ năng:
                            ${cert.reqSkill}
                        </div>

                    </div>

                </div>

            </div>

        `;

        const btn =
            document.createElement('button');

        btn.className =
            'w-full mt-3 py-2 rounded-lg text-xs font-black ' +
            (
                owned
                    ? 'bg-emerald-700'
                    : canTake
                        ? 'bg-cyan-600 hover:bg-cyan-500'
                        : 'bg-slate-800 text-slate-500'
            );

        btn.textContent =
            owned
                ? '✅ ĐÃ CÓ'
                : canTake
                    ? 'THI NGAY'
                    : '🔒 CHƯA ĐỦ KỸ NĂNG';

        btn.onclick=()=>{

            if(owned) return;

            if(!canTake){

                showStatAlert(
                    `🧠 Cần kỹ năng ≥ ${cert.reqSkill}`,
                    'text-amber-400'
                );

                return;

            }

            startCertificateExam(
                cert.id
            );

        };

        row.appendChild(btn);

        list.appendChild(row);

    });

}


function startCertificateExam(id){

    const cert =
        CERTIFICATES.find(
            x=>x.id===id
        );

    if(!cert) return;

    if(
        STATE.certificates.includes(id)
    ){

        showStatAlert(
            'Bạn đã có chứng chỉ này!',
            'text-emerald-400'
        );

        return;

    }

    if(
        STATE.stats.skill <
        cert.reqSkill
    ){

        showStatAlert(
            `🔒 Cần kỹ năng ≥ ${cert.reqSkill}`,
            'text-amber-400'
        );

        return;

    }

    if(
        STATE.stats.money <
        cert.fee
    ){

        showStatAlert(
            '💸 Không đủ tiền đóng lệ phí!',
            'text-rose-400'
        );

        return;

    }

    currentCert =
        cert;

    currentCertQuestion=0;

    currentCertScore=0;

    STATE.stats.money -=
        cert.fee;

    $('certList')
        .classList.add('hidden');

    $('certQuestionArea')
        .classList.remove('hidden');

    renderCurrentCertQuestion();

    saveGame();

}


function renderCurrentCertQuestion(){

    const q =
        currentCert.questions[
            currentCertQuestion
        ];

    $('certProgress').textContent =
        `${currentCert.name} · Câu ${currentCertQuestion+1}/${currentCert.questions.length}`;

    $('certQuestion').textContent =
        q.q;

    const answers =
        $('certAnswers');

    answers.innerHTML='';

    q.options.forEach(
        (option,index)=>{

            const btn =
                document.createElement('button');

            btn.className =
                'choice';

            btn.textContent =
                `${String.fromCharCode(65+index)}. ${option}`;

            btn.onclick =
                ()=>handleCertAnswer(
                    index
                );

            answers.appendChild(btn);

        }
    );

}


function handleCertAnswer(index){

    const q =
        currentCert.questions[
            currentCertQuestion
        ];

    if(index===q.answer){

        currentCertScore++;

        audio.playSuccess();

    }else{

        audio.playWrong();

    }

    currentCertQuestion++;

    if(
        currentCertQuestion >=
        currentCert.questions.length
    ){

        finishCertExam();

    }else{

        renderCurrentCertQuestion();

    }

}


function finishCertExam(){

    const passed =
        currentCertScore >= 2;

    $('certQuestionArea')
        .classList.add('hidden');

    $('certList')
        .classList.remove('hidden');

    if(passed){

        STATE.certificates.push(
            currentCert.id
        );

        STATE.stats.skill =
            clamp(
                STATE.stats.skill + 5
            );

        STATE.stats.reputation =
            clamp(
                STATE.stats.reputation + 5
            );

        STATE.todayEvents.push(
            `Đậu chứng chỉ ${currentCert.name}.`
        );

        audio.playSuccess();

        showStatAlert(
            `🎓 ĐẬU ${currentCert.name}!`,
            'text-emerald-400'
        );

    }else{

        STATE.stats.mood =
            clamp(
                STATE.stats.mood - 5
            );

        showStatAlert(
            `❌ Trượt ${currentCert.name} (${currentCertScore}/3)`,
            'text-rose-400'
        );

    }

    saveGame();

    renderCertificatesList();

    currentCert=null;

}


/* =====================================================
   NPC
===================================================== */

function interactNPC(who){

    if(STATE.isGameOver) return;

    if(who==='min'){

        openCrushDialogue();

        return;

    }

    if(who==='lan'){

        openSimpleDialogue(
            'Lan',
            '👧🏻',
            'Hôm nay cậu học hành thế nào rồi? Nhớ cân bằng học và nghỉ nhé!',
            [
                {
                    text:'Mình đang cố gắng!',
                    effect:{
                        mood:5,
                        friends:5
                    }
                },
                {
                    text:'Cho mình chút động lực!',
                    effect:{
                        study:4,
                        friends:3
                    }
                }
            ]
        );

        return;

    }

    if(who==='tuan'){

        openSimpleDialogue(
            'Tuấn',
            '👦🏻',
            'Chiều nay đi làm thêm không? Kiếm tiền mua xe thôi!',
            [
                {
                    text:'Đi làm!',
                    effect:{
                        skill:3,
                        reputation:2
                    }
                },
                {
                    text:'Hôm nay nghỉ.',
                    effect:{
                        energy:5,
                        mood:3
                    }
                }
            ]
        );

    }

}


function openSimpleDialogue(
    name,
    avatar,
    text,
    choices
){

    showOverlay(
        'dialogueCard'
    );

    $('dialogueName').textContent =
        name;

    $('dialogueAvatar').textContent =
        avatar;

    $('dialogueText').textContent =
        text;

    const area =
        $('dialogueChoices');

    area.innerHTML='';

    choices.forEach(choice=>{

        const btn =
            document.createElement('button');

        btn.className =
            'choice';

        btn.textContent =
            choice.text;

        btn.onclick=()=>{

            modifyStats(
                choice.effect
            );

            STATE.todayEvents.push(
                `Nói chuyện với ${name}.`
            );

            closeOverlayCard();

            showStatAlert(
                '💬 Đã trò chuyện!',
                'text-indigo-300'
            );

        };

        area.appendChild(btn);

    });

}


function openCrushDialogue(){

    showOverlay(
        'dialogueCard'
    );

    $('dialogueName').textContent =
        'Triệu Mẫn 💕';

    $('dialogueAvatar').textContent =
        '👩🏻';

    $('dialogueText').textContent =
        STATE.stats.love >= 70
            ? 'Mẫn mỉm cười: “Hình như chúng ta ngày càng hiểu nhau hơn rồi…”'
            : 'Mẫn hỏi: “Dạo này cậu thế nào? Việc học ổn không?”';

    const area =
        $('dialogueChoices');

    area.innerHTML='';

    const choices = [

        {
            text:'💕 Tặng kẹo dâu',
            effect:{
                love:8,
                mood:5
            }
        },

        {
            text:'📚 Rủ nhau học',
            effect:{
                love:4,
                study:5
            }
        },

        {
            text:'😎 Kể chuyện hài',
            effect:{
                love:3,
                mood:8
            }
        },

        {
            text:'👋 Hẹn gặp lại',
            effect:{}
        }

    ];

    choices.forEach(choice=>{

        const btn =
            document.createElement('button');

        btn.className =
            'choice';

        btn.textContent =
            choice.text;

        btn.onclick=()=>{

            if(
                choice.text.includes(
                    'Tặng kẹo'
                )
            ){

                const item =
                    STATE.bag.find(
                        x=>x.id==='gift_strawberry'
                    );

                if(!item || item.count<=0){

                    showStatAlert(
                        '🍬 Bạn không còn kẹo dâu!',
                        'text-amber-400'
                    );

                    return;

                }

                item.count--;

            }

            modifyStats(
                choice.effect
            );

            STATE.todayEvents.push(
                'Có một cuộc trò chuyện đáng nhớ với Triệu Mẫn.'
            );

            closeOverlayCard();

            showStatAlert(
                '💕 Khoảnh khắc thanh xuân!',
                'text-pink-400'
            );

        };

        area.appendChild(btn);

    });

}


/* =====================================================
   PROFILE
===================================================== */

function toggleProfile(){

    if(STATE.isGameOver) return;

    const message = `
Ngày: ${STATE.day}/${STATE.totalDays}

❤️ HP: ${Math.round(STATE.stats.hp)}
⚡ Năng lượng: ${Math.round(STATE.stats.energy)}
😊 Tâm trạng: ${Math.round(STATE.stats.mood)}
📚 Học tập: ${Math.round(STATE.stats.study)}
💕 Tình cảm: ${Math.round(STATE.stats.love)}
🧠 Kỹ năng: ${Math.round(STATE.stats.skill)}
⭐ Uy tín: ${Math.round(STATE.stats.reputation)}
🤝 Bạn bè: ${Math.round(STATE.stats.friends)}

💰 Tiền:
${Math.round(STATE.stats.money).toLocaleString('vi-VN')}đ

📜 Chứng chỉ:
${STATE.certificates.length
    ? STATE.certificates.join(', ')
    : 'Chưa có'}

🏠 Tài sản:
${STATE.assets.length
    ? STATE.assets.join(', ')
    : 'Chưa có'}
`;

    alert(message);

}


/* =====================================================
   BAG
===================================================== */

function toggleBag(){

    if(STATE.isGameOver) return;

    const items =
        STATE.bag
        .filter(x=>x.count>0);

    if(!items.length){

        showStatAlert(
            '🎒 Túi đồ đang trống!',
            'text-slate-400'
        );

        return;

    }

    let html =
        '🎒 TÚI ĐỒ\\n\\n';

    items.forEach(
        (item,index)=>{

            html +=
                `${index+1}. ${item.icon} ${item.name} x${item.count}\\n`+
                `   ${item.desc}\\n\\n`;

        }
    );

    html +=
        'Nhấn OK để dùng vật phẩm đầu tiên.';

    if(confirm(html)){

        useBagItem(
            items[0].id
        );

    }

}


function useBagItem(id){

    const item =
        STATE.bag.find(
            x=>x.id===id
        );

    if(!item || item.count<=0){

        showStatAlert(
            'Không có vật phẩm!',
            'text-rose-400'
        );

        return;

    }

    if(id==='math_note'){

        STATE.stats.study =
            clamp(
                STATE.stats.study + 8
            );

        showStatAlert(
            '📘 +8 điểm học tập!',
            'text-blue-400'
        );

    }

    else if(
        id==='gift_strawberry'
    ){

        STATE.stats.love =
            clamp(
                STATE.stats.love + 8
            );

        showStatAlert(
            '🍬 +8 tình cảm!',
            'text-pink-400'
        );

    }

    else if(
        id==='energy_drink'
    ){

        STATE.stats.energy =
            clamp(
                STATE.stats.energy + 25
            );

        showStatAlert(
            '🥤 +25 năng lượng!',
            'text-yellow-400'
        );

    }

    item.count--;

    updateHUD();

    saveGame();

}


/* =====================================================
   DIARY
===================================================== */

function openDiaryManual(){

    showOverlay(
        'diaryModalCard'
    );

    $('diaryTitle').textContent =
        'NHẬT KÝ THANH XUÂN';

    if(
        !STATE.diaryEntries.length
    ){

        $('diaryContentText').textContent =
            'Chưa có trang nhật ký nào. Hãy bắt đầu hành trình!';

        return;

    }

    const latest =
        STATE.diaryEntries[
            STATE.diaryEntries.length-1
        ];

    $('diaryContentText').textContent =
        latest.text;

    $('btnContinueFromDiary').textContent =
        'ĐÓNG';

    $('btnContinueFromDiary').onclick =
        ()=>closeOverlayCard();

}


function triggerEndOfDayDiary(){

    if(STATE.isGameOver) return;

    STATE.stats.energy=100;

    STATE.stats.hp =
        clamp(
            STATE.stats.hp + 10
        );

    STATE.stats.money +=
        20000;

    const text =
        `Ngày ${STATE.day}: ` +
        (
            STATE.todayEvents.length
                ? STATE.todayEvents.join(' ')
                : 'Một ngày bình thường trôi qua.'
        ) +
        ` Cuối ngày, bạn nhận 20.000đ sinh hoạt.`;

    STATE.diaryEntries.push({

        day:STATE.day,

        text:text

    });

    STATE.todayEvents=[];

    saveGame();

    showOverlay(
        'diaryModalCard'
    );

    $('diaryTitle').textContent =
        `NHẬT KÝ — NGÀY ${STATE.day}`;

    $('diaryContentText').textContent =
        text;

    const btn =
        $('btnContinueFromDiary');

    btn.textContent =
        STATE.day >= STATE.totalDays
            ? '🎓 TỐT NGHIỆP'
            : 'NGÀY TIẾP THEO →';

    btn.onclick=()=>{

        closeOverlayCard();

        if(
            STATE.day >=
            STATE.totalDays
        ){

            triggerGraduationEnding();

            return;

        }

        STATE.day++;

        STATE.timeIndex=0;

        STATE.location='class';

        gotoLocation(
            'class'
        );

        saveGame();

    };

}


/* =====================================================
   ENDING
===================================================== */

function triggerGraduationEnding(){

    STATE.isGameOver=true;

    hideAllOverlays();

    $('endingScreenCard')
        .classList.remove('hidden');

    const s =
        STATE.stats;

    let ending = '';

    if(
        s.study>=80 &&
        s.skill>=70 &&
        s.love>=70
    ){

        ending =
            'Bạn đã tạo nên một thanh xuân gần như hoàn hảo: học tập tốt, kỹ năng vững vàng và có một mối quan hệ thật đẹp.';

    }

    else if(
        s.study>=80
    ){

        ending =
            'Bạn rời mái trường với thành tích học tập đáng tự hào. Con đường tương lai đang mở ra trước mắt.';

    }

    else if(
        s.money>=1000000000
    ){

        ending =
            'Bạn đã chứng minh rằng khả năng kiếm tiền và xây dựng tài sản của mình là rất đáng nể.';

    }

    else if(
        s.love>=80
    ){

        ending =
            'Thanh xuân của bạn có một câu chuyện tình cảm rất đáng nhớ.';

    }

    else{

        ending =
            'Bạn không cần một thanh xuân hoàn hảo. Bạn đã sống, đã thử, đã sai và đã trưởng thành.';

    }

    $('endingText').textContent =
        ending;

    $('endingStats').innerHTML = `

        <div class="glass rounded-xl p-3">
            <div class="text-2xl">📚</div>
            <div class="font-black">
                ${Math.round(s.study)}
            </div>
            <div class="text-[9px] text-slate-500">
                HỌC TẬP
            </div>
        </div>

        <div class="glass rounded-xl p-3">
            <div class="text-2xl">🧠</div>
            <div class="font-black">
                ${Math.round(s.skill)}
            </div>
            <div class="text-[9px] text-slate-500">
                KỸ NĂNG
            </div>
        </div>

        <div class="glass rounded-xl p-3">
            <div class="text-2xl">💕</div>
            <div class="font-black">
                ${Math.round(s.love)}
            </div>
            <div class="text-[9px] text-slate-500">
                TÌNH CẢM
            </div>
        </div>

        <div class="glass rounded-xl p-3">
            <div class="text-2xl">💰</div>
            <div class="font-black text-xs">
                ${Math.round(s.money).toLocaleString('vi-VN')}đ
            </div>
            <div class="text-[9px] text-slate-500">
                TÀI SẢN TIỀN MẶT
            </div>
        </div>

    `;

    audio.playBell();

    saveGame();

}


/* =====================================================
   SAVE CODE
===================================================== */

function utf8ToBase64(str){

    const bytes =
        new TextEncoder()
        .encode(str);

    let binary='';

    const chunk=0x8000;

    for(
        let i=0;
        i<bytes.length;
        i+=chunk
    ){

        binary +=
            String.fromCharCode(
                ...bytes.subarray(
                    i,
                    i+chunk
                )
            );

    }

    return btoa(binary)
        .replace(/\+/g,'-')
        .replace(/\//g,'_')
        .replace(/=+$/,'');

}


function base64ToUtf8(base64){

    let b64 =
        base64
        .trim()
        .replace(/-/g,'+')
        .replace(/_/g,'/');

    while(
        b64.length % 4
    ){

        b64 += '=';

    }

    const binary =
        atob(b64);

    const bytes =
        new Uint8Array(
            binary.length
        );

    for(
        let i=0;
        i<binary.length;
        i++
    ){

        bytes[i] =
            binary.charCodeAt(i);

    }

    return new TextDecoder()
        .decode(bytes);

}


function getSaveData(){

    return {

        version:2,

        isGameOver:
            STATE.isGameOver,

        day:
            STATE.day,

        totalDays:
            STATE.totalDays,

        timeIndex:
            STATE.timeIndex,

        location:
            STATE.location,

        stats:{
            ...STATE.stats
        },

        certificates:[
            ...STATE.certificates
        ],

        assets:[
            ...STATE.assets
        ],

        bag:clone(
            STATE.bag
        ),

        todayEvents:[
            ...STATE.todayEvents
        ],

        diaryEntries:
            clone(
                STATE.diaryEntries
            )

    };

}


function generateSaveCode(){

    return utf8ToBase64(
        JSON.stringify(
            getSaveData()
        )
    );

}


function showSaveCode(){

    const code =
        generateSaveCode();

    navigator.clipboard
        ?.writeText(code)
        .catch(()=>{});

    prompt(
        '🔑 MÃ LƯU GAME\\n\\nĐã cố gắng sao chép mã. Bạn cũng có thể copy mã bên dưới:',
        code
    );

}


function loadSaveCode(){

    const code =
        prompt(
            '🔓 DÁN MÃ LƯU GAME VÀO ĐÂY:'
        );

    if(!code || !code.trim()){
        return;
    }

    try{

        const json =
            base64ToUtf8(
                code
            );

        const data =
            JSON.parse(json);

        STATE =
            normalizeState(
                data
            );

        saveGame();

        updateHUD();

        if(
            STATE.isGameOver
        ){

            triggerGraduationEnding();

        }else{

            gotoLocation(
                STATE.location
            );

        }

        audio.playSuccess();

        showStatAlert(
            '🔓 Đã tải mã lưu game!',
            'text-emerald-400'
        );

    }catch(error){

        console.error(error);

        audio.playWrong();

        showStatAlert(
            '❌ Mã lưu không hợp lệ!',
            'text-rose-400'
        );

    }

}


/* =====================================================
   LOCAL SAVE
===================================================== */

function saveGame(){

    try{

        localStorage.setItem(
            'thanh_xuan_ruc_ro_save',
            JSON.stringify(
                getSaveData()
            )
        );

        if($('saveStatus')){

            $('saveStatus').textContent =
                'ĐÃ LƯU ✓';

            $('saveStatus').className =
                'text-[9px] text-emerald-400 font-mono mt-2';

            setTimeout(()=>{

                if($('saveStatus')){

                    $('saveStatus').textContent =
                        'SẴN SÀNG';

                    $('saveStatus').className =
                        'text-[9px] text-slate-500 font-mono mt-2';

                }

            },1200);

        }

        return true;

    }catch(error){

        console.error(
            'Save error:',
            error
        );

        return false;

    }

}


function manualSaveGame(){

    if(saveGame()){

        audio.playSuccess();

        showStatAlert(
            '💾 Đã lưu game!',
            'text-emerald-400'
        );

    }else{

        showStatAlert(
            '❌ Không thể lưu game!',
            'text-rose-400'
        );

    }

}


function manualLoadGame(showMessage=false){

    try{

        const raw =
            localStorage.getItem(
                'thanh_xuan_ruc_ro_save'
            );

        if(!raw){

            if(showMessage){

                showStatAlert(
                    '📂 Chưa có game được lưu.',
                    'text-slate-400'
                );

            }

            return false;

        }

        const data =
            JSON.parse(raw);

        STATE =
            normalizeState(
                data
            );

        updateHUD();

        if(
            STATE.isGameOver
        ){

            triggerGraduationEnding();

        }else{

            gotoLocation(
                STATE.location
            );

        }

        if(showMessage){

            audio.playSuccess();

            showStatAlert(
                `📂 Đã tải game ngày ${STATE.day}!`,
                'text-sky-400'
            );

        }

        return true;

    }catch(error){

        console.error(
            'Load error:',
            error
        );

        if(showMessage){

            showStatAlert(
                '❌ Dữ liệu save bị lỗi!',
                'text-rose-400'
            );

        }

        return false;

    }

}


/* =====================================================
   EXPORT
===================================================== */

function exportSaveFile(){

    try{

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        getSaveData(),
                        null,
                        2
                    )
                ],
                {
                    type:
                        'application/json'
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const a =
            document.createElement('a');

        a.href=url;

        a.download =
            `thanh-xuan-ngay-${STATE.day}.json`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        URL.revokeObjectURL(
            url
        );

        showStatAlert(
            '📤 Đã xuất file save!',
            'text-indigo-300'
        );

    }catch(error){

        console.error(error);

        showStatAlert(
            '❌ Không thể xuất file!',
            'text-rose-400'
        );

    }

}


/* =====================================================
   IMPORT
===================================================== */

function importSaveFile(event){

    const file =
        event.target.files?.[0];

    if(!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function(){

            try{

                const data =
                    JSON.parse(
                        reader.result
                    );

                STATE =
                    normalizeState(
                        data
                    );

                saveGame();

                updateHUD();

                if(
                    STATE.isGameOver
                ){

                    triggerGraduationEnding();

                }else{

                    gotoLocation(
                        STATE.location
                    );

                }

                showStatAlert(
                    '📥 Đã nhập file save!',
                    'text-emerald-400'
                );

            }catch(error){

                console.error(error);

                showStatAlert(
                    '❌ File save không hợp lệ!',
                    'text-rose-400'
                );

            }

            event.target.value='';

        };

    reader.onerror =
        function(){

            showStatAlert(
                '❌ Không đọc được file!',
                'text-rose-400'
            );

            event.target.value='';

        };

    reader.readAsText(file);

}


/* =====================================================
   AUDIO
===================================================== */

function toggleAudio(){

    audio.enabled =
        !audio.enabled;

    $('btnAudio').textContent =
        audio.enabled
            ? '🔊'
            : '🔇';

    if(audio.enabled){

        audio.playTone(
            660,
            'square',
            .1,
            .04
        );

    }

}


/* =====================================================
   SLEEP
===================================================== */

function quickSleep(){

    if(STATE.isGameOver) return;

    if(
        !confirm(
            'Bạn muốn đi ngủ sớm và kết thúc ngày này?'
        )
    ){

        return;

    }

    triggerEndOfDayDiary();

}


/* =====================================================
   HELP
===================================================== */

function showHelp(){

    alert(
`🎮 THANH XUÂN RỰC RỠ

MỤC TIÊU:
Sống 45 ngày học sinh và xây dựng tương lai của bạn.

📚 HỌC:
Trả lời câu hỏi để tăng học tập và kỹ năng.

🍜 CĂN TIN:
Mua đồ ăn để hồi năng lượng.

💼 VIỆC:
Làm thêm kiếm tiền.

📜 CHỨNG CHỈ:
Dùng tiền + kỹ năng để thi chứng chỉ.

🏠 TÀI SẢN:
Mua xe, nhà và các tài sản lớn.

💕 TRIỆU MẪN:
Tương tác để tăng tình cảm.

🎒 TÚI ĐỒ:
Sử dụng vật phẩm hỗ trợ.

💾 LƯU:
Game tự động lưu sau các hành động.

🔑 MÃ:
Tạo mã lưu để copy sang máy khác.

🎓 NGÀY 45:
Bạn sẽ bước vào màn hình tốt nghiệp.`
    );

}


/* =====================================================
   RESTART
===================================================== */

function restartGame(){

    const ok =
        confirm(
            'Bạn có chắc muốn xóa toàn bộ tiến trình và chơi lại từ đầu?'
        );

    if(!ok) return;

    localStorage.removeItem(
        'thanh_xuan_ruc_ro_save'
    );

    STATE =
        clone(
            DEFAULT_STATE
        );

    currentQuizQuestions=[];
    currentQuizIndex=0;
    currentQuizScore=0;

    currentCert=null;
    currentCertQuestion=0;
    currentCertScore=0;

    hideAllOverlays();

    updateHUD();

    gotoLocation(
        'class'
    );

    saveGame();

    showStatAlert(
        '🔄 Đã bắt đầu lại từ ngày 1!',
        'text-indigo-300'
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

function initGame(){

    const loaded =
        manualLoadGame(false);

    if(!loaded){

        STATE =
            clone(
                DEFAULT_STATE
            );

        saveGame();

        updateHUD();

        gotoLocation(
            'class'
        );

    }

    updateHUD();

}


/* =====================================================
   START
===================================================== */

if(
    document.readyState ===
    'loading'
){

    document.addEventListener(
        'DOMContentLoaded',
        initGame,
        {once:true}
    );

}else{

    initGame();

}


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    'keydown',
    event=>{

        if(
            event.key==='ArrowLeft'
        ){

            navigateDpad(-1);

        }

        if(
            event.key==='ArrowRight'
        ){

            navigateDpad(1);

        }

        if(
            event.key==='Escape'
        ){

            closeOverlayCard();

        }

    }
);

</script>

</body>
</html>
