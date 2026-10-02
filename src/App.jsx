import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   THANH XUÂN RỰC RỠ
   Deluxe Career & Assets Edition
   180 câu hỏi: 20 câu x 9 môn
   ========================================================= */

const TIME_SLOTS = [
  "07:30",
  "09:15",
  "11:30",
  "14:00",
  "17:00",
  "20:30",
];

const SLOT_SECONDS = 45;
const SAVE_KEY = "thanh_xuan_ruc_ro_deluxe_v6";

const clamp = (n, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(n) || 0));

const money = (n) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n || 0)) + "đ";

const clone = (x) => JSON.parse(JSON.stringify(x));

const q = (subject, question, choices, answer, explanation = "") => ({
  subject,
  q: question,
  choices,
  answer,
  explanation,
});

/* =========================================================
   180 CÂU HỎI
   ========================================================= */

const QUIZ_BANK = [
  /* ==================== VĂN 20 ==================== */

  q(
    "Văn",
    'Tác phẩm "Vợ nhặt" của nhà văn nào?',
    ["Kim Lân", "Nam Cao", "Tô Hoài", "Nguyễn Minh Châu"],
    0,
    "Kim Lân là tác giả của Vợ nhặt."
  ),
  q(
    "Văn",
    '"Mặt trời xuống biển như hòn lửa" sử dụng biện pháp tu từ nào?',
    ["Ẩn dụ", "So sánh", "Hoán dụ", "Điệp ngữ"],
    1,
    'Từ "như" tạo nên phép so sánh.'
  ),
  q(
    "Văn",
    'Tác phẩm "Tây Tiến" được sáng tác bởi ai?',
    ["Chính Hữu", "Quang Dũng", "Tố Hữu", "Huy Cận"],
    1,
    "Quang Dũng là tác giả Tây Tiến."
  ),
  q(
    "Văn",
    "Nhân vật Mị xuất hiện trong tác phẩm nào?",
    ["Vợ chồng A Phủ", "Vợ nhặt", "Rừng xà nu", "Chiếc thuyền ngoài xa"],
    0,
    "Mị là nhân vật chính trong Vợ chồng A Phủ."
  ),
  q(
    "Văn",
    '"Đồng chí" là bài thơ của ai?',
    ["Chính Hữu", "Phạm Tiến Duật", "Quang Dũng", "Hữu Thỉnh"],
    0,
    "Đồng chí của Chính Hữu."
  ),
  q(
    "Văn",
    '"Chiếc thuyền ngoài xa" đặt ra vấn đề nổi bật nào?',
    [
      "Cách nhìn đời và con người đa diện",
      "Tình yêu thiên nhiên",
      "Tuổi trẻ học đường",
      "Khát vọng chinh phục biển",
    ],
    0,
    "Tác phẩm nhấn mạnh cách nhìn đời sống đa diện, sâu sắc."
  ),
  q(
    "Văn",
    'Thể thơ của bài "Sóng" là gì?',
    ["Lục bát", "Thất ngôn", "Năm chữ", "Thơ tự do"],
    3,
    "Sóng được viết theo thể thơ năm chữ biến thể."
  ),
  q(
    "Văn",
    'Tác giả "Ai đã đặt tên cho dòng sông?" là ai?',
    ["Hoàng Phủ Ngọc Tường", "Nguyễn Tuân", "Nguyễn Khoa Điềm", "Xuân Diệu"],
    0,
    "Đây là bút ký nổi tiếng của Hoàng Phủ Ngọc Tường."
  ),
  q(
    "Văn",
    '"Đất Nước" là đoạn trích trong trường ca nào?',
    ["Mặt đường khát vọng", "Việt Bắc", "Máu và hoa", "Những người đi tới biển"],
    0,
    "Đất Nước thuộc trường ca Mặt đường khát vọng."
  ),
  q(
    "Văn",
    '"Rừng xà nu" do ai sáng tác?',
    ["Nguyễn Trung Thành", "Nguyễn Thi", "Nguyễn Minh Châu", "Lê Minh Khuê"],
    0,
    "Nguyễn Trung Thành còn có bút danh Nguyên Ngọc."
  ),
  q(
    "Văn",
    'Hình ảnh "cây xà nu" trong Rừng xà nu chủ yếu tượng trưng cho điều gì?',
    [
      "Sức sống cộng đồng và tinh thần đấu tranh",
      "Sự giàu có",
      "Tuổi thơ",
      "Thiên nhiên yên bình",
    ],
    0,
    "Xà nu gắn với sức sống và sự kiên cường của dân làng Xô Man."
  ),
  q(
    "Văn",
    "Nhà thơ Xuân Quỳnh nổi tiếng với bài thơ nào?",
    ["Sóng", "Tây Tiến", "Đồng chí", "Việt Bắc"],
    0,
    "Sóng là một trong những bài thơ tiêu biểu của Xuân Quỳnh."
  ),
  q(
    "Văn",
    '"Việt Bắc" được sáng tác trong hoàn cảnh nào?',
    [
      "Sau chiến thắng Điện Biên Phủ",
      "Khi tác giả đi du học",
      "Trong thời kỳ đổi mới",
      "Sau năm 1975",
    ],
    0,
    "Bài thơ ra đời tháng 10/1954."
  ),
  q(
    "Văn",
    "Phương thức biểu đạt chính của văn bản nghị luận là gì?",
    ["Tự sự", "Miêu tả", "Nghị luận", "Biểu cảm"],
    2,
    "Nghị luận dùng lập luận và bằng chứng để làm rõ quan điểm."
  ),
  q(
    "Văn",
    "Trong văn nghị luận, luận điểm là gì?",
    [
      "Ý kiến chính cần làm sáng tỏ",
      "Một câu chuyện",
      "Một hình ảnh",
      "Một từ khóa",
    ],
    0,
    "Luận điểm là quan điểm được triển khai bằng lý lẽ và bằng chứng."
  ),
  q(
    "Văn",
    "Biện pháp điệp ngữ là gì?",
    [
      "Lặp lại từ hoặc cụm từ có chủ ý",
      "Đối lập hai ý",
      "So sánh hai sự vật",
      "Nói quá sự thật",
    ],
    0,
    "Điệp ngữ là lặp lại có dụng ý để nhấn mạnh."
  ),
  q(
    "Văn",
    '"Người lái đò Sông Đà" của ai?',
    ["Nguyễn Tuân", "Nam Cao", "Tô Hoài", "Vũ Trọng Phụng"],
    0,
    "Nguyễn Tuân viết Người lái đò Sông Đà."
  ),
  q(
    "Văn",
    "Phong cách nghệ thuật Nguyễn Tuân thường nổi bật ở đặc điểm nào?",
    [
      "Tài hoa, uyên bác",
      "Mộc mạc, giản dị hoàn toàn",
      "Khoa học, khô khan",
      "Chỉ viết về thiếu nhi",
    ],
    0,
    "Nguyễn Tuân nổi tiếng với phong cách tài hoa, uyên bác."
  ),
  q(
    "Văn",
    '"Chữ người tử tù" thuộc thể loại nào?',
    ["Truyện ngắn", "Thơ", "Kịch", "Tùy bút"],
    0,
    "Đây là truyện ngắn nổi tiếng của Nguyễn Tuân."
  ),
  q(
    "Văn",
    "Mục đích chính của thao tác lập luận so sánh là gì?",
    [
      "Làm rõ đối tượng qua sự tương đồng hoặc khác biệt",
      "Kể lại sự việc",
      "Miêu tả phong cảnh",
      "Bộc lộ cảm xúc cá nhân",
    ],
    0,
    "So sánh giúp làm nổi bật đặc điểm của đối tượng."
  ),

  /* ==================== LÝ 20 ==================== */

  q(
    "Lý",
    "Đơn vị SI của công suất là gì?",
    ["Joule", "Watt", "Newton", "Pascal"],
    1,
    "Công suất có đơn vị watt (W)."
  ),
  q(
    "Lý",
    "Định luật II Newton được biểu diễn bằng công thức nào?",
    ["F = ma", "P = UI", "A = Pt", "v = s/t"],
    0,
    "Hợp lực F bằng khối lượng m nhân gia tốc a."
  ),
  q(
    "Lý",
    "Vận tốc được tính bằng công thức nào?",
    ["v=s/t", "v=t/s", "v=s.t", "v=m/V"],
    0,
    "Vận tốc bằng quãng đường chia thời gian."
  ),
  q(
    "Lý",
    "Đơn vị của cường độ dòng điện là gì?",
    ["Volt", "Ohm", "Ampere", "Watt"],
    2,
    "Cường độ dòng điện đo bằng ampe (A)."
  ),
  q(
    "Lý",
    "Đơn vị hiệu điện thế là gì?",
    ["Volt", "Ampere", "Ohm", "Tesla"],
    0,
    "Hiệu điện thế đo bằng volt (V)."
  ),
  q(
    "Lý",
    "Điện trở của vật dẫn được đo bằng đơn vị nào?",
    ["Ohm", "Volt", "Watt", "Joule"],
    0,
    "Điện trở có đơn vị ohm (Ω)."
  ),
  q(
    "Lý",
    "Công thức định luật Ohm cho đoạn mạch là gì?",
    ["I=U/R", "U=I/R", "R=UI", "I=UR"],
    0,
    "I = U/R."
  ),
  q(
    "Lý",
    "Công suất điện có thể tính bằng công thức nào?",
    ["P=UI", "P=U/I", "P=I/U", "P=R/U"],
    0,
    "P = UI."
  ),
  q(
    "Lý",
    "Gia tốc trọng trường gần mặt đất có giá trị xấp xỉ?",
    ["0,98 m/s²", "9,8 m/s²", "98 m/s²", "980 m/s²"],
    1,
    "g xấp xỉ 9,8 m/s²."
  ),
  q(
    "Lý",
    "Động năng của vật phụ thuộc vào yếu tố nào?",
    ["Khối lượng và vận tốc", "Chỉ khối lượng", "Chỉ độ cao", "Nhiệt độ"],
    0,
    "Wđ = 1/2 mv²."
  ),
  q(
    "Lý",
    "Thế năng trọng trường phụ thuộc vào?",
    [
      "Khối lượng, độ cao và g",
      "Chỉ vận tốc",
      "Chỉ nhiệt độ",
      "Điện trở",
    ],
    0,
    "Wt = mgh."
  ),
  q(
    "Lý",
    "Âm thanh không truyền được trong môi trường nào?",
    ["Chất rắn", "Chất lỏng", "Chất khí", "Chân không"],
    3,
    "Âm cần môi trường vật chất để truyền."
  ),
  q(
    "Lý",
    "Ánh sáng truyền trong chân không với tốc độ xấp xỉ?",
    ["3×10^8 m/s", "3×10^6 m/s", "3×10^4 m/s", "3×10^2 m/s"],
    0,
    "Tốc độ ánh sáng trong chân không khoảng 300.000 km/s."
  ),
  q(
    "Lý",
    "Thấu kính hội tụ có đặc điểm nào?",
    [
      "Dày ở giữa, mỏng ở rìa",
      "Mỏng ở giữa, dày ở rìa",
      "Phẳng hoàn toàn",
      "Không làm lệch tia sáng",
    ],
    0,
    "Thấu kính hội tụ thường dày ở giữa."
  ),
  q(
    "Lý",
    "Lực ma sát trượt thường có hướng như thế nào?",
    [
      "Cùng hướng chuyển động",
      "Ngược hướng chuyển động tương đối",
      "Vuông góc trọng lực",
      "Luôn hướng lên",
    ],
    1,
    "Ma sát chống lại chuyển động tương đối."
  ),
  q(
    "Lý",
    "Nhiệt lượng cần để làm nóng vật phụ thuộc vào?",
    [
      "Khối lượng, nhiệt dung riêng và độ tăng nhiệt độ",
      "Chỉ khối lượng",
      "Chỉ thể tích",
      "Chỉ áp suất",
    ],
    0,
    "Q = mcΔt."
  ),
  q(
    "Lý",
    "Hiện tượng cảm ứng điện từ liên quan đến sự biến thiên của?",
    ["Từ thông", "Khối lượng", "Nhiệt độ phòng", "Áp suất khí quyển"],
    0,
    "Biến thiên từ thông tạo ra suất điện động cảm ứng."
  ),
  q(
    "Lý",
    "Trong mạch nối tiếp, đại lượng nào có cùng giá trị qua các phần tử?",
    ["Cường độ dòng điện", "Hiệu điện thế", "Điện trở", "Công suất"],
    0,
    "Dòng điện qua các phần tử nối tiếp như nhau."
  ),
  q(
    "Lý",
    "Trong mạch song song, đại lượng nào có cùng giá trị trên các nhánh?",
    ["Hiệu điện thế", "Cường độ dòng điện", "Điện trở", "Công suất"],
    0,
    "Hiệu điện thế giữa hai đầu các nhánh song song bằng nhau."
  ),
  q(
    "Lý",
    "Một vật đứng yên chịu tác dụng của hai lực cân bằng thì?",
    ["Vật tiếp tục đứng yên", "Vật tăng tốc", "Vật đổi hướng", "Vật luôn rơi"],
    0,
    "Hai lực cân bằng không làm thay đổi trạng thái chuyển động."
  ),

  /* ==================== HÓA 20 ==================== */

  q(
    "Hóa",
    "Dung dịch có pH < 7 có tính chất gì?",
    ["Axit", "Bazơ", "Trung tính", "Không xác định"],
    0,
    "pH nhỏ hơn 7 là môi trường axit."
  ),
  q(
    "Hóa",
    "Công thức hóa học của nước là gì?",
    ["H2O", "CO2", "O2", "H2"],
    0,
    "Nước gồm hai H và một O."
  ),
  q(
    "Hóa",
    "NaCl thuộc loại hợp chất nào?",
    ["Hợp chất ion", "Đơn chất kim loại", "Axit", "Bazơ"],
    0,
    "NaCl hình thành từ ion Na+ và Cl-."
  ),
  q(
    "Hóa",
    "Khí oxi có công thức?",
    ["O2", "O3", "CO2", "H2O"],
    0,
    "Oxi phân tử tồn tại chủ yếu dạng O2."
  ),
  q(
    "Hóa",
    "CO2 là khí gì?",
    ["Carbon dioxide", "Oxygen", "Hydrogen", "Nitrogen"],
    0,
    "CO2 là carbon dioxide."
  ),
  q(
    "Hóa",
    "Kim loại nào thường được dùng làm dây dẫn điện?",
    ["Đồng", "Lưu huỳnh", "Clo", "Iot"],
    0,
    "Đồng dẫn điện tốt."
  ),
  q(
    "Hóa",
    "HCl là?",
    ["Axit clohiđric", "Natri hiđroxit", "Natri clorua", "Axit sunfuric"],
    0,
    "HCl là axit clohiđric."
  ),
  q(
    "Hóa",
    "NaOH thuộc loại nào?",
    ["Bazơ", "Axit", "Muối", "Oxide axit"],
    0,
    "NaOH là bazơ mạnh."
  ),
  q(
    "Hóa",
    "H2SO4 là?",
    ["Axit sunfuric", "Axit nitric", "Axit clohiđric", "Bazơ"],
    0,
    "H2SO4 là axit sulfuric."
  ),
  q(
    "Hóa",
    "Phản ứng giữa axit và bazơ tạo muối và nước gọi là?",
    ["Trung hòa", "Oxi hóa", "Trùng hợp", "Nhiệt phân"],
    0,
    "Đó là phản ứng trung hòa."
  ),
  q(
    "Hóa",
    "Nguyên tố có ký hiệu Fe là?",
    ["Sắt", "Flo", "Kẽm", "Đồng"],
    0,
    "Fe là sắt."
  ),
  q(
    "Hóa",
    "Nguyên tố có ký hiệu Cu là?",
    ["Đồng", "Canxi", "Cacbon", "Coban"],
    0,
    "Cu là đồng."
  ),
  q(
    "Hóa",
    "Khí chiếm tỉ lệ lớn nhất trong không khí là?",
    ["Nitơ", "Oxi", "CO2", "Hidro"],
    0,
    "Nitơ chiếm khoảng 78% thể tích không khí."
  ),
  q(
    "Hóa",
    "Số oxi hóa của O trong H2O thường là?",
    ["-2", "+2", "0", "-1"],
    0,
    "O thường có số oxi hóa -2 trong hợp chất."
  ),
  q(
    "Hóa",
    "Chất xúc tác có tác dụng chủ yếu là gì?",
    [
      "Làm thay đổi tốc độ phản ứng",
      "Làm tăng khối lượng sản phẩm",
      "Luôn bị tiêu hao hoàn toàn",
      "Làm đổi màu mọi chất",
    ],
    0,
    "Chất xúc tác làm thay đổi tốc độ phản ứng."
  ),
  q(
    "Hóa",
    "Dung dịch NaCl dẫn điện vì?",
    [
      "Có các ion chuyển động tự do",
      "Không có ion",
      "Chỉ có phân tử nước",
      "Có kim loại rắn",
    ],
    0,
    "NaCl phân li thành Na+ và Cl-."
  ),
  q(
    "Hóa",
    "Công thức của methane là?",
    ["CH4", "C2H6", "CO2", "CH3OH"],
    0,
    "Methane có công thức CH4."
  ),
  q(
    "Hóa",
    "Ethanol có công thức nào?",
    ["C2H5OH", "CH4", "CH3COOH", "C6H6"],
    0,
    "Ethanol là C2H5OH."
  ),
  q(
    "Hóa",
    "Kim loại nào phản ứng mạnh với nước ở điều kiện thường?",
    ["Natri", "Đồng", "Bạc", "Vàng"],
    0,
    "Natri phản ứng mạnh với nước."
  ),
  q(
    "Hóa",
    "Quá trình đốt cháy thường là phản ứng với?",
    ["Oxi", "Nitơ", "Heli", "Neon"],
    0,
    "Đốt cháy thường là quá trình chất phản ứng với O2."
  ),

  /* ==================== SINH 20 ==================== */

  q(
    "Sinh",
    'Bào quan được xem là "nhà máy năng lượng" của tế bào là?',
    ["Ti thể", "Ribosome", "Nhân", "Không bào"],
    0,
    "Ti thể tạo phần lớn ATP cho tế bào."
  ),
  q(
    "Sinh",
    "DNA có những loại base nitơ nào?",
    ["A,T,G,C", "A,U,G,C", "A,T,U,G", "G,C,U,T"],
    0,
    "DNA chứa A, T, G, C."
  ),
  q(
    "Sinh",
    "RNA sử dụng base nào thay cho thymine?",
    ["Uracil", "Cytosine", "Guanine", "Adenine"],
    0,
    "RNA có uracil (U) thay cho thymine."
  ),
  q(
    "Sinh",
    "Quang hợp ở thực vật chủ yếu diễn ra trong?",
    ["Lục lạp", "Ti thể", "Ribosome", "Nhân"],
    0,
    "Lục lạp chứa diệp lục."
  ),
  q(
    "Sinh",
    "Sắc tố quang hợp chủ yếu ở cây xanh là?",
    ["Diệp lục", "Melanin", "Hemoglobin", "Keratin"],
    0,
    "Diệp lục hấp thụ ánh sáng."
  ),
  q(
    "Sinh",
    "Đơn vị cấu tạo và chức năng cơ bản của cơ thể sống là?",
    ["Tế bào", "Mô", "Cơ quan", "Hệ cơ quan"],
    0,
    "Tế bào là đơn vị cơ bản của sự sống."
  ),
  q(
    "Sinh",
    "Quá trình phân chia tế bào tạo hai tế bào con giống nhau về cơ bản là?",
    ["Nguyên phân", "Giảm phân", "Thụ tinh", "Phiên mã"],
    0,
    "Nguyên phân tạo hai tế bào con."
  ),
  q(
    "Sinh",
    "Giảm phân có vai trò quan trọng trong việc tạo?",
    ["Giao tử", "Tế bào cơ", "Tế bào da", "Hồng cầu trưởng thành"],
    0,
    "Giảm phân tạo giao tử."
  ),
  q(
    "Sinh",
    "Nhiễm sắc thể nằm chủ yếu ở đâu trong tế bào nhân thực?",
    ["Nhân", "Màng tế bào", "Không bào", "Thành tế bào"],
    0,
    "NST nằm trong nhân."
  ),
  q(
    "Sinh",
    "Enzyme có bản chất chủ yếu là?",
    ["Protein", "Lipid", "Tinh bột", "Muối khoáng"],
    0,
    "Phần lớn enzyme là protein."
  ),
  q(
    "Sinh",
    "Hệ tuần hoàn có chức năng chính là?",
    ["Vận chuyển các chất", "Tiêu hóa thức ăn", "Tạo xương", "Điều hòa thân nhiệt duy nhất"],
    0,
    "Máu vận chuyển khí, dinh dưỡng và chất thải."
  ),
  q(
    "Sinh",
    "Hồng cầu có chức năng nổi bật là?",
    ["Vận chuyển oxygen", "Tạo kháng thể chủ yếu", "Tiêu hóa protein", "Co cơ"],
    0,
    "Hemoglobin giúp vận chuyển O2."
  ),
  q(
    "Sinh",
    "Cơ quan trao đổi khí chủ yếu ở người là?",
    ["Phổi", "Gan", "Thận", "Dạ dày"],
    0,
    "Phổi là cơ quan hô hấp chính."
  ),
  q(
    "Sinh",
    "Thận có vai trò quan trọng trong?",
    ["Lọc máu và tạo nước tiểu", "Trao đổi khí", "Tiêu hóa tinh bột", "Bơm máu"],
    0,
    "Thận lọc máu và tạo nước tiểu."
  ),
  q(
    "Sinh",
    "Hormone insulin có vai trò chủ yếu gì?",
    ["Giúp hạ đường huyết", "Tăng nhịp tim", "Tiêu hóa lipid", "Tạo hồng cầu"],
    0,
    "Insulin giúp giảm glucose máu."
  ),
  q(
    "Sinh",
    "Hệ thần kinh trung ương gồm?",
    ["Não và tủy sống", "Tim và phổi", "Gan và thận", "Dạ dày và ruột"],
    0,
    "Não và tủy sống tạo thành hệ thần kinh trung ương."
  ),
  q(
    "Sinh",
    "Trong chuỗi thức ăn, sinh vật sản xuất thường là?",
    ["Thực vật xanh", "Động vật ăn thịt", "Nấm", "Vi khuẩn phân giải"],
    0,
    "Thực vật tự dưỡng tạo chất hữu cơ."
  ),
  q(
    "Sinh",
    "Sinh vật phân giải có vai trò gì?",
    ["Phân hủy chất hữu cơ", "Tạo ánh sáng", "Ăn mọi động vật", "Ngăn chu trình vật chất"],
    0,
    "Sinh vật phân giải giúp hoàn trả chất khoáng."
  ),
  q(
    "Sinh",
    "Đột biến là?",
    ["Biến đổi trong vật chất di truyền", "Một loại thức ăn", "Quá trình hô hấp", "Một cơ quan"],
    0,
    "Đột biến là biến đổi trong vật chất di truyền."
  ),
  q(
    "Sinh",
    "Miễn dịch giúp cơ thể?",
    ["Chống lại tác nhân gây bệnh", "Tăng chiều cao trực tiếp", "Tạo năng lượng từ ánh sáng", "Thay thế mọi tế bào"],
    0,
    "Hệ miễn dịch chống lại tác nhân lạ."
  ),

  /* ==================== SỬ 20 ==================== */

  q(
    "Sử",
    "Cách mạng tháng Tám ở Việt Nam diễn ra năm nào?",
    ["1945", "1930", "1954", "1975"],
    0,
    "Cách mạng tháng Tám thành công năm 1945."
  ),
  q(
    "Sử",
    "Đảng Cộng sản Việt Nam được thành lập năm nào?",
    ["1930", "1945", "1954", "1960"],
    0,
    "Đảng được thành lập ngày 3/2/1930."
  ),
  q(
    "Sử",
    "Chiến thắng Điện Biên Phủ diễn ra năm nào?",
    ["1954", "1945", "1968", "1975"],
    0,
    "Chiến thắng Điện Biên Phủ năm 1954."
  ),
  q(
    "Sử",
    "Hiệp định Genève về Đông Dương được ký năm?",
    ["1954", "1946", "1968", "1973"],
    0,
    "Hiệp định Genève được ký năm 1954."
  ),
  q(
    "Sử",
    "Ngày Quốc khánh Việt Nam là?",
    ["2/9/1945", "30/4/1975", "7/5/1954", "19/8/1945"],
    0,
    "Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập."
  ),
  q(
    "Sử",
    "Chiến dịch Hồ Chí Minh kết thúc vào ngày nào?",
    ["30/4/1975", "2/9/1945", "7/5/1954", "19/12/1946"],
    0,
    "Ngày 30/4/1975."
  ),
  q(
    "Sử",
    "Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam ký năm?",
    ["1973", "1968", "1975", "1954"],
    0,
    "Hiệp định Paris được ký năm 1973."
  ),
  q(
    "Sử",
    "Phong trào Xô viết Nghệ-Tĩnh diễn ra chủ yếu trong thời gian nào?",
    ["1930-1931", "1945-1946", "1954-1955", "1968-1969"],
    0,
    "Đây là phong trào cách mạng 1930-1931."
  ),
  q(
    "Sử",
    "Mặt trận Việt Minh được thành lập năm nào?",
    ["1941", "1930", "1945", "1954"],
    0,
    "Việt Minh thành lập năm 1941."
  ),
  q(
    "Sử",
    "Nhà Trần đánh bại quân Nguyên-Mông lần thứ ba vào năm?",
    ["1288", "1258", "1285", "1077"],
    0,
    "Chiến thắng Bạch Đằng năm 1288."
  ),
  q(
    "Sử",
    "Chiến thắng Bạch Đằng năm 938 gắn với nhân vật nào?",
    ["Ngô Quyền", "Lý Thường Kiệt", "Trần Hưng Đạo", "Lê Lợi"],
    0,
    "Ngô Quyền lãnh đạo chiến thắng năm 938."
  ),
  q(
    "Sử",
    "Lý Thường Kiệt nổi tiếng với chiến thắng nào?",
    ["Phòng tuyến sông Như Nguyệt", "Bạch Đằng 938", "Điện Biên Phủ", "Chi Lăng"],
    0,
    "Ông chỉ huy cuộc kháng chiến chống Tống."
  ),
  q(
    "Sử",
    "Khởi nghĩa Lam Sơn gắn với nhân vật nào?",
    ["Lê Lợi", "Quang Trung", "Ngô Quyền", "Đinh Bộ Lĩnh"],
    0,
    "Lê Lợi lãnh đạo khởi nghĩa Lam Sơn."
  ),
  q(
    "Sử",
    "Quang Trung đại phá quân Thanh vào năm?",
    ["1789", "1771", "1802", "1858"],
    0,
    "Chiến thắng Ngọc Hồi - Đống Đa năm 1789."
  ),
  q(
    "Sử",
    "Thực dân Pháp nổ súng mở đầu cuộc xâm lược Việt Nam tại?",
    ["Đà Nẵng", "Hà Nội", "Huế", "Sài Gòn"],
    0,
    "Pháp tấn công Đà Nẵng năm 1858."
  ),
  q(
    "Sử",
    "Phong trào Đông Du gắn với nhà yêu nước nào?",
    ["Phan Bội Châu", "Phan Châu Trinh", "Nguyễn Tất Thành", "Huỳnh Thúc Kháng"],
    0,
    "Phan Bội Châu khởi xướng phong trào Đông Du."
  ),
  q(
    "Sử",
    "Nguyễn Tất Thành ra đi tìm đường cứu nước năm nào?",
    ["1911", "1905", "1920", "1930"],
    0,
    "Người ra đi năm 1911."
  ),
  q(
    "Sử",
    "Cương lĩnh chính trị đầu tiên của Đảng được thông qua năm?",
    ["1930", "1941", "1945", "1954"],
    0,
    "Cương lĩnh được thông qua khi thành lập Đảng năm 1930."
  ),
  q(
    "Sử",
    "Phong trào Đồng Khởi bùng nổ mạnh mẽ ở tỉnh nào?",
    ["Bến Tre", "Quảng Ninh", "Lạng Sơn", "Lào Cai"],
    0,
    "Bến Tre là nơi phong trào phát triển mạnh."
  ),
  q(
    "Sử",
    "Tổng tiến công và nổi dậy Tết Mậu Thân diễn ra năm?",
    ["1968", "1965", "1972", "1975"],
    0,
    "Tết Mậu Thân là năm 1968."
  ),

  /* ==================== ĐỊA 20 ==================== */

  q(
    "Địa",
    "Việt Nam nằm trong kiểu khí hậu chủ yếu nào?",
    ["Nhiệt đới gió mùa", "Ôn đới hải dương", "Hoang mạc", "Cận cực"],
    0,
    "Việt Nam có khí hậu nhiệt đới gió mùa."
  ),
  q(
    "Địa",
    "Đồng bằng sông Hồng nằm chủ yếu ở?",
    ["Miền Bắc", "Miền Trung", "Tây Nguyên", "Nam Bộ"],
    0,
    "Đồng bằng sông Hồng thuộc Bắc Bộ."
  ),
  q(
    "Địa",
    "Đồng bằng lớn nhất Việt Nam là?",
    ["Đồng bằng sông Cửu Long", "Đồng bằng sông Hồng", "Đồng bằng Thanh Hóa", "Đồng bằng Nghệ An"],
    0,
    "Đồng bằng sông Cửu Long có diện tích lớn nhất."
  ),
  q(
    "Địa",
    "Dãy núi cao nhất Việt Nam là?",
    ["Hoàng Liên Sơn", "Trường Sơn Bắc", "Bạch Mã", "Đông Triều"],
    0,
    "Hoàng Liên Sơn có đỉnh Fansipan."
  ),
  q(
    "Địa",
    "Đỉnh núi cao nhất Việt Nam là?",
    ["Fansipan", "Ngọc Linh", "Tây Côn Lĩnh", "Bạch Mã"],
    0,
    "Fansipan cao khoảng 3.143 m."
  ),
  q(
    "Địa",
    "Hai quần đảo Hoàng Sa và Trường Sa thuộc vùng biển nào?",
    ["Biển Đông", "Biển Đỏ", "Địa Trung Hải", "Biển Đen"],
    0,
    "Hai quần đảo nằm trên Biển Đông."
  ),
  q(
    "Địa",
    "Cà phê được trồng tập trung nhiều ở vùng nào?",
    ["Tây Nguyên", "Đồng bằng sông Hồng", "Đông Bắc", "Duyên hải Bắc Bộ"],
    0,
    "Tây Nguyên là vùng chuyên canh cà phê lớn."
  ),
  q(
    "Địa",
    "Trung tâm kinh tế lớn nhất phía Nam Việt Nam là?",
    ["TP. Hồ Chí Minh", "Cần Thơ", "Đà Lạt", "Biên Hòa"],
    0,
    "TP. Hồ Chí Minh là cực tăng trưởng kinh tế lớn."
  ),
  q(
    "Địa",
    "Sông nào dài nhất chảy hoàn toàn trên lãnh thổ Việt Nam?",
    ["Sông Đồng Nai", "Sông Hồng", "Sông Đà", "Sông Cả"],
    0,
    "Sông Đồng Nai là hệ thống sông lớn."
  ),
  q(
    "Địa",
    "Vùng biển Việt Nam thuộc?",
    ["Tây Thái Bình Dương, Biển Đông", "Đại Tây Dương", "Bắc Băng Dương", "Địa Trung Hải"],
    0,
    "Việt Nam có vùng biển thuộc Biển Đông."
  ),
  q(
    "Địa",
    "Tài nguyên khoáng sản nổi bật ở thềm lục địa phía Nam là?",
    ["Dầu khí", "Than đá", "Sắt", "Bauxite"],
    0,
    "Dầu khí là tài nguyên quan trọng."
  ),
  q(
    "Địa",
    "Bauxite tập trung nhiều ở vùng nào?",
    ["Tây Nguyên", "Đồng bằng sông Hồng", "Đông Nam Bộ", "Bắc Trung Bộ"],
    0,
    "Tây Nguyên có trữ lượng bauxite lớn."
  ),
  q(
    "Địa",
    "Gió mùa mùa đông ở miền Bắc có hướng chủ yếu?",
    ["Đông Bắc", "Tây Nam", "Đông Nam", "Tây Bắc"],
    0,
    "Gió mùa Đông Bắc hoạt động vào mùa đông."
  ),
  q(
    "Địa",
    "Gió mùa mùa hạ chủ yếu mang theo khối khí?",
    ["Nóng ẩm", "Lạnh khô", "Rất lạnh", "Khô hạn quanh năm"],
    0,
    "Gió mùa hạ mang tính nóng ẩm."
  ),
  q(
    "Địa",
    "Đô thị hóa là quá trình?",
    [
      "Gia tăng dân cư và hoạt động kinh tế đô thị",
      "Giảm số đô thị",
      "Chỉ tăng diện tích rừng",
      "Chỉ phát triển nông nghiệp",
    ],
    0,
    "Đô thị hóa gắn với gia tăng dân cư đô thị."
  ),
  q(
    "Địa",
    "Ngành kinh tế sử dụng nhiều lao động và tạo hàng xuất khẩu lớn là?",
    ["Công nghiệp chế biến, chế tạo", "Khai thác vàng thủ công", "Săn bắt", "Du mục"],
    0,
    "Công nghiệp chế biến, chế tạo có vai trò lớn."
  ),
  q(
    "Địa",
    "Vùng nào có thế mạnh nổi bật về thủy điện?",
    ["Trung du và miền núi Bắc Bộ", "Đồng bằng sông Hồng", "Đồng bằng sông Cửu Long", "Duyên hải Nam Trung Bộ"],
    0,
    "Địa hình dốc tạo tiềm năng thủy điện."
  ),
  q(
    "Địa",
    "Cây lúa được trồng nhiều nhất ở?",
    ["Đồng bằng sông Cửu Long", "Tây Nguyên", "Đông Nam Bộ", "Trung du miền núi Bắc Bộ"],
    0,
    "Đồng bằng sông Cửu Long là vùng sản xuất lúa lớn nhất."
  ),
  q(
    "Địa",
    "Đông Nam Bộ có thế mạnh nổi bật nào?",
    ["Công nghiệp và dịch vụ", "Trồng chè ôn đới", "Chăn nuôi du mục", "Chỉ trồng lúa"],
    0,
    "Đông Nam Bộ phát triển mạnh công nghiệp và dịch vụ."
  ),
  q(
    "Địa",
    "Vùng kinh tế trọng điểm phía Nam có hạt nhân là?",
    ["TP. Hồ Chí Minh", "Huế", "Lào Cai", "Hải Phòng"],
    0,
    "TP. Hồ Chí Minh là hạt nhân."
  ),

  /* ==================== ANH 20 ==================== */

  q(
    "Anh",
    "Choose the correct sentence:",
    [
      "She have lived here since 2020.",
      "She has lived here since 2020.",
      "She lived here since 2020.",
      "She living here since 2020.",
    ],
    1,
    "Present perfect: has + V3 with since."
  ),
  q(
    "Anh",
    "If I were you, I ___ harder.",
    ["study", "studied", "would study", "will study"],
    2,
    "Second conditional: If + past, would + V."
  ),
  q(
    "Anh",
    'The opposite of "expensive" is?',
    ["cheap", "large", "modern", "heavy"],
    0,
    "Expensive ↔ cheap."
  ),
  q(
    "Anh",
    "She is interested ___ music.",
    ["on", "at", "in", "for"],
    2,
    "The phrase is interested in."
  ),
  q(
    "Anh",
    "I have known him ___ five years.",
    ["since", "for", "from", "at"],
    1,
    "Use for with a duration."
  ),
  q(
    "Anh",
    "He ___ to school every day.",
    ["go", "goes", "going", "gone"],
    1,
    "He/she/it takes -s in present simple."
  ),
  q(
    "Anh",
    "Yesterday, they ___ football.",
    ["play", "plays", "played", "playing"],
    2,
    "Yesterday signals past simple."
  ),
  q(
    "Anh",
    "There ___ many books on the table.",
    ["is", "are", "was", "be"],
    1,
    "Plural noun books → are."
  ),
  q(
    "Anh",
    "My brother is ___ than me.",
    ["tall", "taller", "tallest", "more tall"],
    1,
    "Comparative adjective: taller."
  ),
  q(
    "Anh",
    "This is the ___ movie I have ever seen.",
    ["good", "better", "best", "well"],
    2,
    "Superlative: the best."
  ),
  q(
    "Anh",
    "You should ___ your homework.",
    ["do", "does", "did", "doing"],
    0,
    "Modal should + base verb."
  ),
  q(
    "Anh",
    '"Could you help me?" is a request for?',
    ["Permission/help", "A prediction", "A past habit", "A comparison"],
    0,
    "It is a polite request for help."
  ),
  q(
    "Anh",
    'The word "rapid" is closest in meaning to?',
    ["slow", "quick", "weak", "quiet"],
    1,
    "Rapid means quick."
  ),
  q(
    "Anh",
    "We went to the cinema ___ Sunday.",
    ["in", "at", "on", "from"],
    2,
    "Use on with days."
  ),
  q(
    "Anh",
    "I am looking forward to ___ you.",
    ["see", "seeing", "saw", "seen"],
    1,
    "Look forward to + V-ing."
  ),
  q(
    "Anh",
    "The book ___ by George Orwell is famous.",
    ["write", "wrote", "written", "writing"],
    2,
    "Past participle phrase: written by."
  ),
  q(
    "Anh",
    "She asked me where I ___.",
    ["live", "lived", "am live", "living"],
    1,
    "Reported speech commonly backshifts live → lived."
  ),
  q(
    "Anh",
    '"Although it was raining, we went out" means?',
    [
      "We stayed home because of rain.",
      "We went out despite the rain.",
      "It did not rain.",
      "We waited until summer.",
    ],
    1,
    "Although introduces contrast."
  ),
  q(
    "Anh",
    'What is the noun form of "decide"?',
    ["decision", "decidingly", "decisive", "decided"],
    0,
    "Decision is the noun."
  ),
  q(
    "Anh",
    'Choose the correct passive sentence: "People speak English worldwide."',
    [
      "English speaks worldwide.",
      "English is spoken worldwide.",
      "English was speak worldwide.",
      "English has speak worldwide.",
    ],
    1,
    "Present simple passive: is + V3."
  ),

  /* ==================== GDCD 20 ==================== */

  q(
    "GDCD",
    "Pháp luật có vai trò nào sau đây?",
    [
      "Điều chỉnh các quan hệ xã hội",
      "Chỉ áp dụng cho trẻ em",
      "Chỉ mang tính khuyến nghị",
      "Không liên quan đến công dân",
    ],
    0,
    "Pháp luật là công cụ quản lý xã hội."
  ),
  q(
    "GDCD",
    "Bình đẳng trước pháp luật có nghĩa là?",
    [
      "Mọi người đều được đối xử theo quy định pháp luật",
      "Ai giàu cũng được ưu tiên",
      "Không ai phải tuân thủ luật",
      "Chỉ cán bộ mới bình đẳng",
    ],
    0,
    "Mọi công dân bình đẳng về quyền và nghĩa vụ theo pháp luật."
  ),
  q(
    "GDCD",
    "Một biểu hiện của trách nhiệm công dân là?",
    ["Tuân thủ pháp luật", "Cố tình vi phạm quy định", "Xâm phạm tài sản người khác", "Gian lận"],
    0,
    "Tuân thủ pháp luật là trách nhiệm cơ bản."
  ),
  q(
    "GDCD",
    "Quyền tự do ngôn luận phải được thực hiện như thế nào?",
    ["Trong khuôn khổ pháp luật", "Muốn nói gì cũng được", "Có thể xúc phạm người khác", "Không cần chịu trách nhiệm"],
    0,
    "Quyền luôn đi kèm trách nhiệm."
  ),
  q(
    "GDCD",
    "Hành vi tham gia giao thông an toàn là?",
    ["Đội mũ bảo hiểm khi đi xe máy", "Vượt đèn đỏ", "Đi ngược chiều", "Dùng điện thoại khi lái xe"],
    0,
    "Đội mũ bảo hiểm là hành vi an toàn."
  ),
  q(
    "GDCD",
    "Tôn trọng người khác thể hiện ở?",
    ["Lắng nghe và không xúc phạm", "Chế giễu điểm yếu", "Ép người khác theo ý mình", "Phát tán bí mật"],
    0,
    "Tôn trọng thể hiện qua giao tiếp văn minh."
  ),
  q(
    "GDCD",
    "Quyền sở hữu tài sản bao gồm các quyền cơ bản nào?",
    ["Chiếm hữu, sử dụng, định đoạt", "Chỉ mua bán", "Chỉ cất giữ", "Chỉ cho thuê"],
    0,
    "Ba quyền cơ bản là chiếm hữu, sử dụng, định đoạt."
  ),
  q(
    "GDCD",
    "Khi phát hiện hành vi vi phạm pháp luật, công dân nên?",
    ["Báo cơ quan có thẩm quyền phù hợp", "Tự ý trả thù", "Che giấu", "Lan truyền tin chưa kiểm chứng"],
    0,
    "Nên thông báo cho cơ quan có thẩm quyền."
  ),
  q(
    "GDCD",
    "Tiết kiệm là biểu hiện của?",
    ["Sử dụng hợp lý nguồn lực", "Phung phí", "Vô trách nhiệm", "Tiêu dùng bất chấp"],
    0,
    "Tiết kiệm giúp sử dụng nguồn lực hiệu quả."
  ),
  q(
    "GDCD",
    "Một người có quyền và nghĩa vụ học tập nhằm?",
    ["Phát triển bản thân và đóng góp xã hội", "Chỉ để giải trí", "Không cần kỹ năng", "Tránh mọi trách nhiệm"],
    0,
    "Học tập giúp phát triển con người và xã hội."
  ),
  q(
    "GDCD",
    "Bảo vệ môi trường là trách nhiệm của?",
    ["Mọi cá nhân và tổ chức", "Chỉ nhà nước", "Chỉ học sinh", "Chỉ doanh nghiệp"],
    0,
    "Bảo vệ môi trường là trách nhiệm chung."
  ),
  q(
    "GDCD",
    "Khi sử dụng thông tin trên mạng, hành vi phù hợp là?",
    ["Kiểm chứng trước khi chia sẻ", "Chia sẻ tin giả", "Đăng dữ liệu riêng tư của người khác", "Xúc phạm người khác"],
    0,
    "Kiểm chứng nguồn giúp hạn chế thông tin sai lệch."
  ),
  q(
    "GDCD",
    "Tự chủ là khả năng?",
    ["Làm chủ suy nghĩ, cảm xúc và hành vi", "Luôn làm theo bạn bè", "Không nghe ai", "Trốn tránh trách nhiệm"],
    0,
    "Tự chủ giúp kiểm soát hành vi phù hợp."
  ),
  q(
    "GDCD",
    "Hợp tác là?",
    ["Cùng làm việc vì mục tiêu chung", "Làm việc một mình", "Cạnh tranh bằng mọi giá", "Không chia sẻ"],
    0,
    "Hợp tác dựa trên phối hợp."
  ),
  q(
    "GDCD",
    "Khoan dung là?",
    ["Tôn trọng và chấp nhận khác biệt hợp lý", "Đồng ý với mọi hành vi sai", "Không quan tâm ai", "Phân biệt đối xử"],
    0,
    "Khoan dung không đồng nghĩa với chấp nhận hành vi sai."
  ),
  q(
    "GDCD",
    "Một biểu hiện của sống có trách nhiệm là?",
    ["Hoàn thành việc mình đã cam kết", "Đổ lỗi cho người khác", "Bỏ việc giữa chừng", "Trốn tránh hậu quả"],
    0,
    "Trách nhiệm gắn với cam kết."
  ),
  q(
    "GDCD",
    "Quyền riêng tư của người khác nên được?",
    ["Tôn trọng", "Công khai tùy ý", "Bán cho người khác", "Đăng lên mạng"],
    0,
    "Thông tin riêng tư cần được bảo vệ."
  ),
  q(
    "GDCD",
    "Khi có mâu thuẫn, cách ứng xử phù hợp là?",
    ["Bình tĩnh trao đổi và tìm giải pháp", "Đe dọa", "Đánh nhau", "Đăng bài xúc phạm"],
    0,
    "Đối thoại bình tĩnh giúp giải quyết xung đột."
  ),
  q(
    "GDCD",
    "Một hành vi thể hiện lòng yêu nước là?",
    ["Tuân thủ pháp luật và đóng góp cho cộng đồng", "Phá hoại tài sản công", "Xả rác nơi công cộng", "Gian lận"],
    0,
    "Yêu nước được thể hiện bằng hành động có trách nhiệm."
  ),
  q(
    "GDCD",
    "Công dân có nghĩa vụ nào đối với Nhà nước và xã hội?",
    ["Tuân thủ pháp luật và thực hiện nghĩa vụ theo quy định", "Không cần tuân thủ luật", "Chỉ đòi quyền lợi", "Tự đặt luật riêng"],
    0,
    "Quyền luôn gắn với nghĩa vụ."
  ),

  /* ==================== ĐỐ MẸO 20 ==================== */

  q(
    "Mẹo",
    "Cái gì có nhiều phím nhưng không mở được ổ khóa?",
    ["Bàn phím", "Chìa khóa", "Cửa", "Tủ"],
    0,
    "Bàn phím có nhiều phím nhưng không mở khóa."
  ),
  q(
    "Mẹo",
    "Cái gì càng lấy đi càng lớn?",
    ["Cái hố", "Cái cây", "Cái hộp", "Con đường"],
    0,
    "Càng đào đất thì cái hố càng lớn."
  ),
  q(
    "Mẹo",
    "Tháng nào có 28 ngày?",
    ["Tháng 2", "Tất cả các tháng", "Tháng 1", "Tháng 12"],
    1,
    "Tháng nào cũng có ít nhất 28 ngày."
  ),
  q(
    "Mẹo",
    "Một người đi dưới mưa nhưng tóc không ướt. Vì sao?",
    ["Người đó bị hói", "Vì mưa giả", "Vì có ô", "Vì chạy rất nhanh"],
    0,
    "Không có tóc thì tóc không thể ướt."
  ),
  q(
    "Mẹo",
    "Cái gì có cổ nhưng không có đầu?",
    ["Cái áo", "Con người", "Cái bàn", "Cái ghế"],
    0,
    "Áo có cổ nhưng không có đầu."
  ),
  q(
    "Mẹo",
    "Cái gì có răng nhưng không cắn?",
    ["Cái lược", "Con chó", "Con cá mập", "Con người"],
    0,
    "Lược có răng nhưng không cắn."
  ),
  q(
    "Mẹo",
    "Cái gì đi khắp thế giới nhưng vẫn ở một góc?",
    ["Con tem", "Chiếc xe", "Máy bay", "Con tàu"],
    0,
    "Tem nằm ở góc phong bì nhưng có thể đi rất xa."
  ),
  q(
    "Mẹo",
    "Cái gì càng lau càng ướt?",
    ["Khăn", "Bàn", "Giày", "Kính"],
    0,
    "Khăn dùng để lau nên hút nước."
  ),
  q(
    "Mẹo",
    "Cái gì có mặt và hai tay nhưng không có chân?",
    ["Đồng hồ", "Con người", "Cái bàn", "Cái ghế"],
    0,
    "Đồng hồ có mặt và kim."
  ),
  q(
    "Mẹo",
    "Cái gì bạn càng giữ chặt thì càng dễ mất?",
    ["Hơi thở", "Tiền", "Sách", "Điện thoại"],
    0,
    "Giữ hơi thở quá lâu sẽ phải thở ra."
  ),
  q(
    "Mẹo",
    "Một con vịt đi trước hai con vịt, một con vịt đi sau hai con vịt, một con vịt ở giữa hai con vịt. Có ít nhất bao nhiêu con vịt?",
    ["3", "4", "5", "6"],
    0,
    "Ba con xếp thành hàng là đủ."
  ),
  q(
    "Mẹo",
    "Cái gì càng nhiều thì càng khó nhìn thấy?",
    ["Bóng tối", "Ánh sáng", "Mặt trời", "Cầu vồng"],
    0,
    "Bóng tối càng nhiều thì càng khó nhìn."
  ),
  q(
    "Mẹo",
    "Cái gì có thể đầy phòng nhưng không chiếm chỗ?",
    ["Ánh sáng", "Bàn ghế", "Nước", "Sách"],
    0,
    "Ánh sáng có thể lan khắp phòng."
  ),
  q(
    "Mẹo",
    "Cái gì không có chân nhưng vẫn chạy?",
    ["Nước", "Cái bàn", "Cái ghế", "Cái tủ"],
    0,
    "Nước có thể chảy."
  ),
  q(
    "Mẹo",
    "Cái gì càng nói càng mất?",
    ["Bí mật", "Thời gian", "Tiền", "Sức khỏe"],
    0,
    "Nói ra thì bí mật không còn là bí mật."
  ),
  q(
    "Mẹo",
    "Cái gì có thể vỡ dù không bị rơi?",
    ["Lời hứa", "Cái ly", "Cái kính", "Quả bóng"],
    0,
    "Lời hứa có thể bị phá vỡ."
  ),
  q(
    "Mẹo",
    "Cái gì có một mắt nhưng không nhìn thấy?",
    ["Cây kim", "Con mắt", "Con mèo", "Máy ảnh"],
    0,
    "Kim khâu có mắt để luồn chỉ."
  ),
  q(
    "Mẹo",
    "Cái gì càng kéo càng ngắn?",
    ["Điếu thuốc", "Sợi dây", "Cái thước", "Con đường"],
    0,
    "Điếu thuốc ngắn dần khi hút."
  ),
  q(
    "Mẹo",
    "Cái gì có đầu và đuôi nhưng không có thân?",
    ["Đồng xu", "Con cá", "Con rắn", "Cái áo"],
    0,
    "Đồng xu có mặt đầu và mặt đuôi."
  ),
  q(
    "Mẹo",
    "Cái gì càng chạy càng đứng yên?",
    ["Đồng hồ", "Con người", "Ô tô", "Con chó"],
    0,
    "Kim đồng hồ chạy nhưng đồng hồ vẫn ở vị trí."
  ),
];

/* =========================================================
   NPC
   ========================================================= */

const NPCS = [
  {
    id: "lan",
    name: "Lan",
    icon: "👩🏻‍🎓",
    desc: "Học nhóm, chăm chỉ",
    act: "Học nhóm",
    base: 42,
  },
  {
    id: "trieuMan",
    name: "Triệu Mẫn",
    icon: "💗",
    desc: "Dễ thương, tinh tế",
    act: "Tâm sự",
    base: 20,
  },
  {
    id: "tuan",
    name: "Tuấn",
    icon: "🧑🏻‍💻",
    desc: "Thích kỹ năng và công nghệ",
    act: "Luyện kỹ năng",
    base: 36,
  },
  {
    id: "minh",
    name: "Minh",
    icon: "📚",
    desc: "Bạn học giỏi, thích ôn bài",
    act: "Ôn bài",
    base: 31,
  },
  {
    id: "linh",
    name: "Linh",
    icon: "🎨",
    desc: "Năng động, thích CLB",
    act: "CLB nghệ thuật",
    base: 28,
  },
  {
    id: "phong",
    name: "Phong",
    icon: "⚽",
    desc: "Thích thể thao",
    act: "Chạy sân trường",
    base: 34,
  },
];

const NPC_MAP = Object.fromEntries(NPCS.map((x) => [x.id, x]));

/* =========================================================
   DANH HIỆU
   ========================================================= */

const TITLES = [
  {
    id: "starter",
    name: "Tân Binh Thanh Xuân",
    icon: "🌱",
    desc: "Bắt đầu hành trình",
    ok: () => true,
  },
  {
    id: "diligent",
    name: "Người Chăm Chỉ",
    icon: "📚",
    desc: "Học ít nhất 8 lần",
    ok: (s) => s.studyActions >= 8,
  },
  {
    id: "scholar",
    name: "Học Bá",
    icon: "🏆",
    desc: "Kiến thức từ 185",
    ok: (s) => s.stats.study >= 185,
  },
  {
    id: "social",
    name: "Tâm Điểm Lớp Học",
    icon: "🤝",
    desc: "Bạn bè từ 85",
    ok: (s) => s.stats.friends >= 85,
  },
  {
    id: "skill",
    name: "Đa Năng",
    icon: "⚡",
    desc: "Kỹ năng từ 80",
    ok: (s) => s.stats.skill >= 80,
  },
  {
    id: "love",
    name: "Thanh Xuân Có Đôi",
    icon: "💗",
    desc: "Tình cảm từ 80",
    ok: (s) => s.stats.love >= 80,
  },
  {
    id: "certificate",
    name: "Bộ Sưu Tập Chứng Chỉ",
    icon: "🎓",
    desc: "Có ít nhất 3 chứng chỉ",
    ok: (s) => s.certificates.length >= 3,
  },
  {
    id: "asset",
    name: "Tay Chơi Tài Sản",
    icon: "🏠",
    desc: "Sở hữu ít nhất 2 tài sản",
    ok: (s) => s.assets.length >= 2,
  },
  {
    id: "competition",
    name: "Ngôi Sao Thi Đua",
    icon: "🌟",
    desc: "100 điểm thi đua",
    ok: (s) => s.competitionPoints >= 100,
  },
  {
    id: "legend",
    name: "Thanh Xuân Rực Rỡ",
    icon: "✨",
    desc: "Hoàn thành hành trình",
    ok: (s) => s.isGameOver,
  },
];

/* =========================================================
   CĂN TIN
   ========================================================= */

const CANTEEN_ITEMS = [
  {
    id: "water",
    name: "Nước suối",
    icon: "💧",
    price: 5000,
    desc: "+8 năng lượng",
    effect: (g) => {
      g.stats.energy += 8;
    },
  },
  {
    id: "milk",
    name: "Sữa hộp",
    icon: "🥛",
    price: 12000,
    desc: "+12 năng lượng, +2 kiến thức",
    effect: (g) => {
      g.stats.energy += 12;
      g.stats.study += 2;
    },
  },
  {
    id: "rice",
    name: "Cơm phần",
    icon: "🍱",
    price: 25000,
    desc: "+40 năng lượng, +5 tâm trạng",
    effect: (g) => {
      g.stats.energy += 40;
      g.stats.mood += 5;
    },
  },
  {
    id: "cake",
    name: "Bánh ngọt",
    icon: "🍰",
    price: 18000,
    desc: "+8 tâm trạng",
    effect: (g) => {
      g.stats.mood += 8;
    },
  },
];

/* =========================================================
   TÀI SẢN
   ========================================================= */

const PROPERTIES = [
  {
    id: "bike",
    name: "Xe đạp xịn",
    icon: "🚲",
    price: 500000,
    desc: "+3 kỹ năng, +2 thi đua",
    effect: (g) => {
      g.stats.skill += 3;
      g.competitionPoints += 2;
    },
  },
  {
    id: "sedan",
    name: "Sedan đầu đời",
    icon: "🚗",
    price: 1800000,
    desc: "+5 danh tiếng, +8 thi đua",
    effect: (g) => {
      g.stats.reputation += 5;
      g.competitionPoints += 8;
    },
  },
  {
    id: "supercar",
    name: "Siêu xe",
    icon: "🏎️",
    price: 5000000,
    desc: "+10 danh tiếng, +15 thi đua",
    effect: (g) => {
      g.stats.reputation += 10;
      g.competitionPoints += 15;
    },
  },
  {
    id: "condo",
    name: "Căn hộ",
    icon: "🏢",
    price: 20000000,
    desc: "+10 tâm trạng, +20 thi đua",
    effect: (g) => {
      g.stats.mood += 10;
      g.competitionPoints += 20;
    },
  },
  {
    id: "villa",
    name: "Biệt thự",
    icon: "🏡",
    price: 60000000,
    desc: "+15 tâm trạng, +30 thi đua",
    effect: (g) => {
      g.stats.mood += 15;
      g.competitionPoints += 30;
    },
  },
];

/* =========================================================
   CHỨNG CHỈ
   ========================================================= */

const CERTS = [
  {
    id: "cert_driver",
    name: "Bằng lái xe",
    icon: "🚘",
    fee: 30000,
    req: 100,
    desc: "Mở khóa việc lái xe VIP",
    questions: [
      q(
        "Lái xe",
        "Đèn đỏ yêu cầu người điều khiển phương tiện?",
        ["Dừng lại", "Tăng tốc", "Đi ngược chiều", "Bấm còi"],
        0
      ),
      q(
        "Lái xe",
        "Dây an toàn dùng để?",
        [
          "Giảm nguy cơ chấn thương",
          "Tăng tốc xe",
          "Tiết kiệm xăng tuyệt đối",
          "Thay phanh",
        ],
        0
      ),
      q(
        "Lái xe",
        "Khi buồn ngủ khi lái xe nên?",
        [
          "Dừng nghỉ an toàn",
          "Cố lái nhanh hơn",
          "Tiếp tục bất chấp",
          "Tắt đèn",
        ],
        0
      ),
    ],
  },
  {
    id: "cert_toeic",
    name: "Chứng chỉ tiếng Anh",
    icon: "🇬🇧",
    fee: 50000,
    req: 300,
    desc: "Mở khóa việc phiên dịch",
    questions: [
      QUIZ_BANK[80],
      QUIZ_BANK[82],
      QUIZ_BANK[96],
    ],
  },
  {
    id: "cert_mos",
    name: "MOS Tin học",
    icon: "💻",
    fee: 45000,
    req: 500,
    desc: "Mở khóa việc Excel",
    questions: [
      q(
        "Tin học",
        "Phím tắt sao chép thường dùng là?",
        ["Ctrl+C", "Ctrl+V", "Ctrl+X", "Ctrl+Z"],
        0
      ),
      q(
        "Tin học",
        "Hàm SUM trong bảng tính dùng để?",
        ["Tính tổng", "Đếm chữ", "Đổi màu", "Xóa ô"],
        0
      ),
      q(
        "Tin học",
        "Excel là phần mềm chủ yếu để?",
        ["Xử lý bảng tính", "Chỉnh video", "Vẽ 3D", "Nghe nhạc"],
        0
      ),
    ],
  },
  {
    id: "cert_finance",
    name: "Chứng chỉ tài chính",
    icon: "📈",
    fee: 80000,
    req: 700,
    desc: "Mở khóa việc tài chính",
    questions: [
      q(
        "Tài chính",
        "Đa dạng hóa danh mục nhằm?",
        ["Phân tán rủi ro", "Tăng rủi ro chắc chắn", "Không cần nghiên cứu", "Đảm bảo lợi nhuận"],
        0
      ),
      q(
        "Tài chính",
        "Cổ phiếu đại diện cho?",
        [
          "Quyền sở hữu một phần doanh nghiệp",
          "Một khoản vay bắt buộc",
          "Tiền mặt",
          "Hợp đồng thuê nhà",
        ],
        0
      ),
      q(
        "Tài chính",
        "Quản trị rủi ro thường bắt đầu bằng?",
        [
          "Nhận diện và đánh giá rủi ro",
          "Bỏ qua rủi ro",
          "Mua mọi tài sản",
          "Vay tối đa",
        ],
        0
      ),
    ],
  },
];

/* =========================================================
   CÔNG VIỆC
   ========================================================= */

const JOBS = [
  {
    id: "canteenJob",
    name: "Phụ bếp căn tin",
    icon: "🍳",
    money: 25000,
    energy: 8,
    desc: "+35k, -8 năng lượng",
    ok: () => true,
    comp: 2,
  },
  {
    id: "flyer",
    name: "Phát tờ rơi",
    icon: "📄",
    money: 30000,
    energy: 12,
    desc: "+50k, -12 năng lượng",
    ok: () => true,
    comp: 2,
  },
  {
    id: "excel",
    name: "Nhập Excel",
    icon: "🖥️",
    money: 90000,
    energy: 10,
    desc: "+90k, cần kỹ năng 300",
    ok: (g) =>
      g.stats.skill >= 300 && g.certificates.includes("cert_mos"),
    comp: 4,
  },
  {
    id: "driver",
    name: "Lái xe VIP",
    icon: "🚘",
    money: 150000,
    energy: 18,
    desc: "+150k, cần bằng lái + xe",
    ok: (g) =>
      g.certificates.includes("cert_driver") &&
      g.assets.some((a) => ["sedan", "supercar"].includes(a)),
    comp: 6,
  },
  {
    id: "interpreter",
    name: "Phiên dịch",
    icon: "🗣️",
    money: 180000,
    energy: 15,
    desc: "+180k, cần Anh + kỹ năng 500",
    ok: (g) =>
      g.certificates.includes("cert_toeic") && g.stats.skill >= 500,
    comp: 7,
  },
  {
    id: "broker",
    name: "Trợ lý tài chính",
    icon: "📊",
    money: 250000,
    energy: 20,
    desc: "+250k, cần tài chính + kỹ năng 700",
    ok: (g) =>
      g.certificates.includes("cert_finance") && g.stats.skill >= 700,
    comp: 8,
  },
];

/* =========================================================
   SỰ KIỆN NGẪU NHIÊN
   ========================================================= */

const DAILY_EVENTS = [
  {
    id: "praise",
    icon: "👏",
    title: "Được giáo viên khen",
    text: "Bạn trả lời tốt trước lớp.",
    result: "+3 kiến thức, +5 danh tiếng, +4 thi đua",
    apply: (g) => {
      g.stats.study += 3;
      g.stats.reputation += 5;
      g.competitionPoints += 4;
    },
  },
  {
    id: "snack",
    icon: "🍪",
    title: "Bạn rủ ăn vặt",
    text: "Một người bạn bất ngờ chia đồ ăn.",
    result: "+6 tâm trạng, +5 năng lượng, +3 bạn bè",
    apply: (g) => {
      g.stats.mood += 6;
      g.stats.energy += 5;
      g.stats.friends += 3;
    },
  },
  {
    id: "library",
    icon: "📚",
    title: "Góc sách bất ngờ",
    text: "Bạn tìm được tài liệu học cực hữu ích.",
    result: "+5 kiến thức, +2 kỹ năng",
    apply: (g) => {
      g.stats.study += 5;
      g.stats.skill += 2;
    },
  },
  {
    id: "rain",
    icon: "🌧️",
    title: "Mưa bất chợt",
    text: "Đường về trường hôm nay hơi mệt.",
    result: "-5 năng lượng, -3 tâm trạng",
    apply: (g) => {
      g.stats.energy -= 5;
      g.stats.mood -= 3;
    },
  },
  {
    id: "contest",
    icon: "🏅",
    title: "Cuộc thi nhỏ của lớp",
    text: "Lớp tổ chức một cuộc thi nhanh.",
    result: "+4 kỹ năng, +5 thi đua",
    apply: (g) => {
      g.stats.skill += 4;
      g.competitionPoints += 5;
    },
  },
  {
    id: "club",
    icon: "🎨",
    title: "CLB tuyển thành viên",
    text: "Một CLB thú vị mời bạn tham gia.",
    result: "+4 bạn bè, +4 kỹ năng",
    apply: (g) => {
      g.stats.friends += 4;
      g.stats.skill += 4;
    },
  },
  {
    id: "coupon",
    icon: "🎟️",
    title: "Phiếu giảm giá",
    text: "Bạn nhận được một voucher nhỏ.",
    result: "+20.000đ",
    apply: (g) => {
      g.stats.money += 20000;
    },
  },
  {
    id: "wallet",
    icon: "👛",
    title: "Quên ví một chút",
    text: "Bạn sơ ý làm mất một khoản tiền nhỏ.",
    result: "-20.000đ, -2 tâm trạng",
    apply: (g) => {
      g.stats.money -= 20000;
      g.stats.mood -= 2;
    },
  },
  {
    id: "sports",
    icon: "⚽",
    title: "Tiết thể thao vui",
    text: "Cả lớp có một trận đấu vui vẻ.",
    result: "+5 HP, +4 bạn bè, -4 năng lượng",
    apply: (g) => {
      g.stats.hp += 5;
      g.stats.friends += 4;
      g.stats.energy -= 4;
    },
  },
  {
    id: "teacherTest",
    icon: "📝",
    title: "Bài kiểm tra đột xuất",
    text: "Giáo viên cho một câu hỏi thử thách.",
    result: "+2 danh tiếng, +2 thi đua",
    apply: (g) => {
      g.stats.reputation += 2;
      g.competitionPoints += 2;
    },
  },
  {
    id: "message",
    icon: "💬",
    title: "Tin nhắn từ bạn cũ",
    text: "Một người bạn cũ nhắn hỏi thăm.",
    result: "+5 bạn bè, +4 tâm trạng",
    apply: (g) => {
      g.stats.friends += 5;
      g.stats.mood += 4;
    },
  },
  {
    id: "clean",
    icon: "🧹",
    title: "Dọn lớp cuối buổi",
    text: "Bạn cùng lớp cùng nhau dọn phòng.",
    result: "+3 danh tiếng, +2 bạn bè",
    apply: (g) => {
      g.stats.reputation += 3;
      g.stats.friends += 2;
    },
  },
];

const eventData = (e) => ({
  id: e.id,
  icon: e.icon,
  title: e.title,
  text: e.text,
  result: e.result,
});

const pickEvent = (last) => {
  const available = DAILY_EVENTS.filter((e) => e.id !== last);
  return (
    available[Math.floor(Math.random() * available.length)] ||
    DAILY_EVENTS[0]
  );
};

/* =========================================================
   STATE
   ========================================================= */

function snapshot(g) {
  return {
    study: g.stats.study,
    energy: g.stats.energy,
    mood: g.stats.mood,
    friends: g.stats.friends,
    love: g.stats.love,
    reputation: g.stats.reputation,
    skill: g.stats.skill,
    money: g.stats.money,
    competitionPoints: g.competitionPoints,
  };
}

function createBase(withEvent = true) {
  const g = {
    isGameOver: false,
    day: 1,
    totalDays: 45,
    timeIndex: 0,
    location: "class",

    stats: {
      hp: 85,
      energy: 100,
      mood: 75,
      study: 50,
      friends: 40,
      love: 20,
      reputation: 30,
      skill: 15,
      money: 100000,
    },

    certificates: [],
    assets: [],

    bag: [
      {
        id: "candy",
        name: "Kẹo dâu",
        icon: "🍬",
        count: 2,
        desc: "+8 tình cảm Triệu Mẫn",
      },
    ],

    diaryEntries: [],

    competitionPoints: 0,

    npcCompetition: Object.fromEntries(
      NPCS.map((n) => [n.id, n.base])
    ),

    relationships: {
      lan: 45,
      trieuMan: 15,
      tuan: 40,
      minh: 34,
      linh: 32,
      phong: 38,
    },

    dailyCompetition: {
      player: 0,
      ...Object.fromEntries(NPCS.map((n) => [n.id, 0])),
    },

    dailyEvent: null,
    lastEventId: null,

    dayStart: null,

    slotActionUsed: false,
    dailyActionCount: 0,

    studyActions: 0,
    jobActions: 0,
    oralChecksDone: 0,
    dailyOralCheckDone: false,

    selectedTitle: "starter",
  };

  g.dayStart = snapshot(g);

  if (withEvent) {
    const e = pickEvent(null);

    g.lastEventId = e.id;
    g.dailyEvent = eventData(e);

    e.apply(g);

    [
      "hp",
      "energy",
      "mood",
      "study",
      "friends",
      "love",
      "reputation",
      "skill",
    ].forEach((key) => {
      g.stats[key] = clamp(g.stats[key]);
    });

    g.stats.money = Math.max(0, g.stats.money);
  }

  return g;
}

function createInitialState() {
  return createBase(true);
}

function normalizeState(raw) {
  const base = createBase(false);
  const r = raw && typeof raw === "object" ? raw : {};

  const g = {
    ...base,
    ...r,

    stats: {
      ...base.stats,
      ...(r.stats || {}),
    },

    npcCompetition: {
      ...base.npcCompetition,
      ...(r.npcCompetition || {}),
    },

    relationships: {
      ...base.relationships,
      ...(r.relationships || {}),
    },

    dailyCompetition: {
      ...base.dailyCompetition,
      ...(r.dailyCompetition || {}),
    },

    dayStart: {
      ...base.dayStart,
      ...(r.dayStart || {}),
    },
  };

  g.day = Math.max(
    1,
    Math.min(g.totalDays, Number(g.day) || 1)
  );

  g.timeIndex = Math.max(
    0,
    Math.min(5, Number(g.timeIndex) || 0)
  );

  [
    "hp",
    "energy",
    "mood",
    "study",
    "friends",
    "love",
    "reputation",
    "skill",
  ].forEach((key) => {
    g.stats[key] = clamp(g.stats[key]);
  });

  g.stats.money = Math.max(0, Number(g.stats.money) || 0);

  g.certificates = Array.isArray(g.certificates)
    ? g.certificates
    : [];

  g.assets = Array.isArray(g.assets) ? g.assets : [];

  g.diaryEntries = Array.isArray(g.diaryEntries)
    ? g.diaryEntries
    : [];

  g.bag = Array.isArray(g.bag)
    ? g.bag
    : base.bag;

  if (!g.dailyEvent) {
    g.dailyEvent = eventData(DAILY_EVENTS[0]);
  }

  return g;
}

function makeDiary(g, day) {
  const d = g.dayStart || snapshot(g);

  const diff = (key) =>
    Math.round((g.stats[key] || 0) - (d[key] || 0));

  return {
    day,
    event: g.dailyEvent?.title || "Không có",

    summary:
      `Kiến thức ${g.stats.study}/100 • ` +
      `Năng lượng ${g.stats.energy}/100 • ` +
      `Bạn bè ${g.stats.friends}/100 • ` +
      `Tiền ${money(g.stats.money)}`,

    deltas: {
      study: diff("study"),
      energy: diff("energy"),
      mood: diff("mood"),
      friends: diff("friends"),
      love: diff("love"),
      reputation: diff("reputation"),
      skill: diff("skill"),
      money: Math.round(g.stats.money - (d.money || 0)),
      competition: Math.round(
        g.competitionPoints - (d.competitionPoints || 0)
      ),
    },
  };
}

/* =========================================================
   SAVE CODE
   ========================================================= */

function encodeSaveCode(data) {
  const bytes = new TextEncoder().encode(JSON.stringify(data));

  let binary = "";

  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + 0x8000)
    );
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeSaveCode(code) {
  let b64 = code.trim()
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  while (b64.length % 4) b64 += "=";

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return JSON.parse(
    new TextDecoder().decode(bytes)
  );
}

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  const [game, setGame] = useState(createInitialState);

  const [secondsLeft, setSecondsLeft] =
    useState(SLOT_SECONDS);

  const [autoTime, setAutoTime] =
    useState(true);

  const [overlay, setOverlay] =
    useState(null);

  const [toast, setToast] =
    useState("");

  const [audioOn, setAudioOn] =
    useState(false);

  const [saveCode, setSaveCode] =
    useState("");

  const [quiz, setQuiz] =
    useState(null);

  const [oral, setOral] =
    useState(null);

  const [quizLock, setQuizLock] =
    useState(false);

  const fileRef = useRef(null);

  const prevDay = useRef(game.day);
  const first = useRef(true);

  /* ---------------- AUDIO ---------------- */

  const beep = useCallback(
    (freq = 520, duration = 0.07) => {
      if (!audioOn) return;

      try {
        const AudioContext =
          window.AudioContext ||
          window.webkitAudioContext;

        if (!AudioContext) return;

        const ctx = new AudioContext();

        const oscillator =
          ctx.createOscillator();

        const gain =
          ctx.createGain();

        oscillator.frequency.value = freq;
        gain.gain.value = 0.035;

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
          ctx.currentTime + duration
        );
      } catch {}
    },
    [audioOn]
  );

  const notify = useCallback(
    (message) => {
      setToast(message);
      beep();
    },
    [beep]
  );

  /* ---------------- AUTOSAVE ---------------- */

  useEffect(() => {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
      );
    } catch {}
  }, [game]);

  /* ---------------- TOAST ---------------- */

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(""),
      2600
    );

    return () => clearTimeout(timer);
  }, [toast]);

  /* ---------------- DAY CHANGE ---------------- */

  useEffect(() => {
    if (first.current) {
      first.current = false;

      setTimeout(() => {
        notify(
          `🎲 Ngày 1: ${game.dailyEvent?.title}`
        );
      }, 300);

      return;
    }

    if (game.day !== prevDay.current) {
      const oldDay = prevDay.current;

      prevDay.current = game.day;

      notify(
        `📔 Nhật ký ngày ${oldDay} đã chốt! • 🎲 ${game.dailyEvent?.title}`
      );
    }
  }, [
    game.day,
    game.dailyEvent,
    notify,
  ]);

  const blocking = !!overlay;

  /* =========================================================
     CHUYỂN MỐC THỜI GIAN
     ========================================================= */

  const advanceTime = useCallback(() => {
    setSecondsLeft(SLOT_SECONDS);

    setGame((prev) => {
      if (prev.isGameOver) return prev;

      const next = clone(prev);

      /* Chưa hết ngày */

      if (next.timeIndex < 5) {
        next.timeIndex += 1;
        next.slotActionUsed = false;

        return normalizeState(next);
      }

      /* ---------------- KẾT THÚC NGÀY ---------------- */

      const finishedDay = next.day;

      next.diaryEntries = [
        makeDiary(next, finishedDay),
        ...(next.diaryEntries || []),
      ];

      /* Điểm người chơi cuối ngày */

      const playerGain = Math.max(
        2,
        Math.min(
          10,
          Math.floor(
            (
              next.stats.study +
              next.stats.skill +
              next.stats.reputation
            ) / 55
          )
        )
      );

      next.competitionPoints += playerGain;

      const gains = {
        player: playerGain,
      };

      /* NPC tự tăng điểm */

      NPCS.forEach((npc, index) => {
        const gain =
          2 + ((finishedDay + index) % 3);

        next.npcCompetition[npc.id] =
          (next.npcCompetition[npc.id] || 0) +
          gain;

        gains[npc.id] = gain;
      });

      next.dailyCompetition = gains;

      /* ---------------- GAME OVER ---------------- */

      if (finishedDay >= next.totalDays) {
        next.isGameOver = true;
        next.selectedTitle = "legend";

        return normalizeState(next);
      }

      /* ---------------- NGÀY MỚI ---------------- */

      next.day += 1;
      next.timeIndex = 0;
      next.slotActionUsed = false;
      next.dailyActionCount = 0;
      next.dailyOralCheckDone = false;

      const event = pickEvent(
        next.lastEventId
      );

      next.lastEventId = event.id;
      next.dailyEvent = eventData(event);

      /*
        dayStart được lưu TRƯỚC khi áp dụng event
        để event cũng được tính vào nhật ký ngày đó.
      */

      next.dayStart = snapshot(next);

      event.apply(next);

      return normalizeState(next);
    });
  }, []);

  /* =========================================================
     ĐỒNG HỒ 45 GIÂY
     ========================================================= */

  useEffect(() => {
    if (
      !autoTime ||
      blocking ||
      game.isGameOver
    ) {
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          advanceTime();
          return SLOT_SECONDS;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [
    autoTime,
    blocking,
    game.isGameOver,
    advanceTime,
  ]);

  /* =========================================================
     DANH HIỆU
     ========================================================= */

  const titles = useMemo(
    () => TITLES.filter((title) => title.ok(game)),
    [game]
  );

  /* =========================================================
     BẢNG THI ĐUA
     ========================================================= */

  const leaderboard = useMemo(() => {
    return [
      {
        id: "player",
        name: "Bạn",
        icon: "⭐",
        points: game.competitionPoints,
        today: game.dailyCompetition.player || 0,
      },

      ...NPCS.map((npc) => ({
        id: npc.id,
        name: npc.name,
        icon: npc.icon,
        points:
          game.npcCompetition[npc.id] || 0,
        today:
          game.dailyCompetition[npc.id] || 0,
      })),
    ].sort(
      (a, b) => b.points - a.points
    );
  }, [game]);

  /* =========================================================
     DÙNG HOẠT ĐỘNG CHÍNH
     ========================================================= */

  const useSlot = useCallback(
    (label) => {
      if (game.slotActionUsed) {
        notify(
          `⏳ Mốc ${TIME_SLOTS[game.timeIndex]} đã dùng hoạt động chính rồi.`
        );

        return false;
      }

      setGame((g) => ({
        ...g,
        slotActionUsed: true,
        dailyActionCount:
          g.dailyActionCount + 1,
      }));

      notify(`🎯 ${label}`);

      return true;
    },
    [
      game.slotActionUsed,
      game.timeIndex,
      notify,
    ]
  );

  /* =========================================================
     QUIZ
     ========================================================= */

  const startQuiz = useCallback(
    (kind = "quiz", questions = null) => {
      if (
        kind === "oral" &&
        game.dailyOralCheckDone
      ) {
        notify(
          "🧑‍🏫 Hôm nay bạn đã kiểm tra miệng rồi."
        );

        return;
      }

      if (
        !useSlot(
          kind === "oral"
            ? "Kiểm tra miệng 15 phút"
            : "Quiz nhanh"
        )
      ) {
        return;
      }

      const selected =
        questions ||
        [...QUIZ_BANK]
          .sort(() => Math.random() - 0.5)
          .slice(
            0,
            kind === "oral" ? 3 : 5
          );

      const data = {
        questions: selected,
        index: 0,
        score: 0,
        wrong: 0,
        feedback: "",
      };

      if (kind === "oral") {
        setOral(data);
      } else {
        setQuiz(data);
      }

      setOverlay(kind);
    },
    [
      game.dailyOralCheckDone,
      notify,
      useSlot,
    ]
  );

  const answerQuiz = useCallback(
    (index, isOral = false) => {
      if (quizLock) return;

      setQuizLock(true);

      const currentData =
        isOral ? oral : quiz;

      if (!currentData) return;

      const currentQuestion =
        currentData.questions[
          currentData.index
        ];

      const correct =
        index === currentQuestion.answer;

      const next = clone(currentData);

      next.score += correct ? 1 : 0;
      next.wrong += correct ? 0 : 1;

      next.feedback = correct
        ? `✅ Đúng! ${
            currentQuestion.explanation || ""
          }`
        : `❌ Sai! Kiến thức -2. ${
            currentQuestion.explanation || ""
          }`;

      /* Sai = -2 kiến thức */

      setGame((g) => {
        const n = clone(g);

        if (!correct) {
          n.stats.study =
            clamp(n.stats.study - 2);
        } else {
          n.stats.mood =
            clamp(n.stats.mood + 1);
        }

        return normalizeState(n);
      });

      beep(correct ? 720 : 180);

      if (isOral) {
        setOral(next);
      } else {
        setQuiz(next);
      }

      setTimeout(() => {
        if (
          next.index >=
          next.questions.length - 1
        ) {
          const score = next.score;

          setGame((g) => {
            const n = clone(g);

            if (isOral) {
              n.dailyOralCheckDone = true;
              n.oralChecksDone =
                (n.oralChecksDone || 0) + 1;

              if (score === 3) {
                n.stats.study += 5;
                n.stats.reputation += 4;
                n.competitionPoints += 6;
              } else if (score === 2) {
                n.stats.study += 2;
                n.stats.reputation += 2;
                n.competitionPoints += 4;
              } else if (score === 0) {
                n.stats.mood -= 4;
                n.stats.reputation -= 2;
              }
            } else {
              n.studyActions += 1;

              if (score >= 4) {
                n.stats.study += 4;
                n.stats.skill += 2;
                n.competitionPoints += 4;
              } else if (score === 3) {
                n.stats.study += 2;
                n.competitionPoints += 2;
              }
            }

            return normalizeState(n);
          });

          setOverlay(null);

          if (isOral) {
            setOral(null);
          } else {
            setQuiz(null);
          }

          notify(
            isOral
              ? `🧑‍🏫 Kiểm tra miệng: ${score}/3.`
              : `📚 Quiz: ${score}/${next.questions.length}.`
          );
        } else {
          next.index += 1;
          next.feedback = "";

          if (isOral) {
            setOral(next);
          } else {
            setQuiz(next);
          }
        }

        setQuizLock(false);
      }, 700);
    },
    [
      quizLock,
      oral,
      quiz,
      beep,
      notify,
    ]
  );

  /* =========================================================
     BẠN BÈ
     ========================================================= */

  const interact = useCallback(
    (id) => {
      if (!useSlot(NPC_MAP[id].act)) {
        return;
      }

      setGame((g) => {
        const n = clone(g);

        n.relationships[id] = clamp(
          (n.relationships[id] || 30) + 4
        );

        n.stats.friends +=
          id === "linh" ? 5 : 3;

        if (
          id === "lan" ||
          id === "minh"
        ) {
          n.stats.study += 4;
        }

        if (id === "tuan") {
          n.stats.skill += 4;
          n.stats.reputation += 2;
        }

        if (id === "linh") {
          n.stats.skill += 2;
          n.stats.mood += 5;
        }

        if (id === "phong") {
          n.stats.hp += 5;
          n.stats.energy -= 5;
        }

        if (id === "trieuMan") {
          const candy = n.bag.find(
            (x) =>
              x.id === "candy" &&
              x.count > 0
          );

          if (candy) {
            candy.count--;

            n.stats.love += 8;
            n.relationships[id] += 2;
          } else {
            n.stats.love += 3;
          }
        }

        n.competitionPoints += 3;

        return normalizeState(n);
      });

      notify(
        `🤝 Đã tương tác với ${NPC_MAP[id].name}`
      );
    },
    [useSlot, notify]
  );

  /* =========================================================
     CĂN TIN
     ========================================================= */

  const buyFood = (id) => {
    const item = CANTEEN_ITEMS.find(
      (x) => x.id === id
    );

    if (!item) return;

    if (game.stats.money < item.price) {
      notify("💸 Không đủ tiền.");
      return;
    }

    if (!useSlot("Mua đồ căn tin")) return;

    setGame((g) => {
      const n = clone(g);

      n.stats.money -= item.price;

      item.effect(n);

      return normalizeState(n);
    });
  };

  /* =========================================================
     VIỆC LÀM
     ========================================================= */

  const doJob = (id) => {
    const job = JOBS.find(
      (x) => x.id === id
    );

    if (!job) return;

    if (!job.ok(game)) {
      notify(
        "🔒 Chưa đủ điều kiện cho công việc này."
      );
      return;
    }

    if (!useSlot(job.name)) return;

    setGame((g) => {
      const n = clone(g);

      n.stats.money += job.money;
      n.stats.energy -= job.energy;

      if (job.energy > 15) {
        n.stats.mood -= 2;
      }

      n.jobActions++;
      n.competitionPoints += job.comp;

      return normalizeState(n);
    });

    notify(
      `💼 Hoàn thành việc: +${money(job.money)}`
    );
  };

  /* =========================================================
     TÀI SẢN
     ========================================================= */

  const buyProperty = (id) => {
    const property = PROPERTIES.find(
      (x) => x.id === id
    );

    if (!property) return;

    if (game.assets.includes(id)) {
      notify(
        "🏠 Bạn đã sở hữu tài sản này."
      );
      return;
    }

    if (game.stats.money < property.price) {
      notify("💸 Chưa đủ tiền.");
      return;
    }

    setGame((g) => {
      const n = clone(g);

      n.stats.money -= property.price;
      n.assets.push(id);

      property.effect(n);

      return normalizeState(n);
    });

    notify(`🏠 Mua ${property.name}`);
  };

  /* =========================================================
     CHỨNG CHỈ
     ========================================================= */

  const startCert = (id) => {
    const cert = CERTS.find(
      (x) => x.id === id
    );

    if (!cert) return;

    if (game.certificates.includes(id)) {
      notify("🎓 Bạn đã có chứng chỉ này.");
      return;
    }

    if (
      game.stats.money < cert.fee ||
      game.stats.skill < cert.req
    ) {
      notify(
        "🔒 Chưa đủ tiền hoặc kỹ năng."
      );
      return;
    }

    if (!useSlot("Thi chứng chỉ")) {
      return;
    }

    setQuiz({
      questions: cert.questions,
      index: 0,
      score: 0,
      wrong: 0,
      certId: id,
      cert,
      feedback: "",
    });

    setOverlay("cert");
  };

  const answerCert = (index) => {
    if (quizLock || !quiz) return;

    const cert = quiz.cert;

    const currentQuestion =
      quiz.questions[quiz.index];

    const correct =
      index === currentQuestion.answer;

    const next = clone(quiz);

    next.score += correct ? 1 : 0;
    next.wrong += correct ? 0 : 1;

    next.feedback = correct
      ? "✅ Chính xác!"
      : "❌ Sai! Kiến thức -2.";

    setGame((g) => {
      const n = clone(g);

      if (!correct) {
        n.stats.study -= 2;
      }

      return normalizeState(n);
    });

    setQuiz(next);
    setQuizLock(true);

    setTimeout(() => {
      if (
        next.index >=
        next.questions.length - 1
      ) {
        const pass = next.score >= 2;

        setGame((g) => {
          const n = clone(g);

          if (pass) {
            n.stats.money -= cert.fee;

            n.certificates.push(
              cert.id
            );

            n.stats.skill += 3;
            n.competitionPoints += 10;
          } else {
            n.stats.mood -= 2;
          }

          return normalizeState(n);
        });

        setOverlay(null);
        setQuiz(null);

        notify(
          pass
            ? `🎓 Đậu ${cert.name}!`
            : `📕 Chưa đạt ${cert.name}.`
        );
      } else {
        next.index += 1;
        next.feedback = "";

        setQuiz(next);
      }

      setQuizLock(false);
    }, 700);
  };

  /* =========================================================
     NGHỈ
     ========================================================= */

  const rest = () => {
    if (!useSlot("Nghỉ ngơi")) {
      return;
    }

    setGame((g) => {
      const n = clone(g);

      n.stats.energy += 25;
      n.stats.mood += 3;
      n.stats.hp += 2;

      return normalizeState(n);
    });
  };

  /* =========================================================
     SAVE
     ========================================================= */

  const saveNow = () => {
    setSaveCode(
      encodeSaveCode(game)
    );

    notify("💾 Đã tạo mã lưu game.");
  };

  const loadCode = () => {
    try {
      const loaded =
        normalizeState(
          decodeSaveCode(saveCode)
        );

      setGame(loaded);
      setSecondsLeft(SLOT_SECONDS);
      setOverlay(null);

      notify("📥 Đã nạp game.");
    } catch {
      notify(
        "❌ Mã lưu không hợp lệ."
      );
    }
  };

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify(game, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "thanh-xuan-save.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  const importJson = async (file) => {
    try {
      const raw =
        await file.text();

      setGame(
        normalizeState(
          JSON.parse(raw)
        )
      );

      setSecondsLeft(
        SLOT_SECONDS
      );

      notify(
        "📥 Đã nhập file lưu game."
      );
    } catch {
      notify(
        "❌ File lưu không hợp lệ."
      );
    }
  };

  const reset = () => {
    const fresh =
      createInitialState();

    setGame(fresh);
    setSecondsLeft(
      SLOT_SECONDS
    );
    setOverlay(null);

    notify(
      "🌱 Bắt đầu lại hành trình!"
    );
  };

  /* =========================================================
     CÂU HỎI HIỆN TẠI
     ========================================================= */

  const currentQuestion =
    quiz?.questions?.[quiz.index];

  const currentOralQuestion =
    oral?.questions?.[oral.index];

  /* =========================================================
     DI CHUYỂN LOCATION
     ========================================================= */

  const navLocations = [
    "class",
    "canteen",
    "job",
    "friends",
    "home",
    "cert",
    "property",
  ];

  const navLoc = (direction) => {
    let index =
      navLocations.indexOf(
        game.location
      );

    index =
      (index +
        direction +
        navLocations.length) %
      navLocations.length;

    setGame((g) => ({
      ...g,
      location:
        navLocations[index],
    }));
  };

  const locationTitle = {
    class: "🏫 Lớp học",
    canteen: "🍱 Căn tin",
    job: "💼 Việc làm",
    friends: "👥 Bạn bè",
    home: "🏠 Nhà",
    cert: "🎓 Chứng chỉ",
    property: "🏠 Tài sản",
  };

  /* =========================================================
     STATS
     ========================================================= */

  const statItems = [
    ["❤️", "HP", "hp"],
    ["⚡", "NL", "energy"],
    ["🧠", "KT", "study"],
    ["😊", "Mood", "mood"],
    ["🤝", "Bạn", "friends"],
    ["💗", "Tình", "love"],
    ["⭐", "Danh", "reputation"],
    ["🛠️", "Kỹ năng", "skill"],
  ];

  /* =========================================================
     LOCATION RENDER
     ========================================================= */

  const renderLocation = () => {
    switch (game.location) {
      case "class":
        return (
          <Section title="📚 Lớp học">
            <div className="event">
              <b>
                {game.dailyEvent?.icon}{" "}
                {game.dailyEvent?.title}
              </b>

              <span>
                {game.dailyEvent?.text}
              </span>

              <small>
                {game.dailyEvent?.result}
              </small>
            </div>

            <div className="actions">
              <button
                onClick={() =>
                  startQuiz("quiz")
                }
              >
                📖 Quiz nhanh · 5 câu
              </button>

              <button
                disabled={
                  game.dailyOralCheckDone
                }
                onClick={() =>
                  startQuiz("oral")
                }
              >
                🧑‍🏫 Kiểm tra miệng · 15'
              </button>
            </div>

            <div className="hint">
              ❌ Trả lời sai:
              <b> -2 Kiến thức</b>.
              <br />
              🧑‍🏫 Kiểm tra miệng chỉ thực
              hiện 1 lần mỗi ngày.
            </div>
          </Section>
        );

      case "canteen":
        return (
          <Section title="🍱 Căn tin">
            <div className="grid">
              {CANTEEN_ITEMS.map((item) => (
                <Card key={item.id}>
                  <div className="big">
                    {item.icon}
                  </div>

                  <b>{item.name}</b>

                  <small>
                    {item.desc}
                  </small>

                  <button
                    onClick={() =>
                      buyFood(item.id)
                    }
                  >
                    {money(item.price)}
                  </button>
                </Card>
              ))}
            </div>
          </Section>
        );

      case "job":
        return (
          <Section title="💼 Việc làm">
            <div className="grid">
              {JOBS.map((job) => (
                <Card key={job.id}>
                  <div className="big">
                    {job.icon}
                  </div>

                  <b>{job.name}</b>

                  <small>
                    {job.desc}
                  </small>

                  <button
                    disabled={!job.ok(game)}
                    onClick={() =>
                      doJob(job.id)
                    }
                  >
                    Nhận việc · +
                    {money(job.money)}
                  </button>
                </Card>
              ))}
            </div>
          </Section>
        );

      case "friends":
        return (
          <Section title="👥 Bạn bè">
            <div className="grid">
              {NPCS.map((npc) => (
                <Card key={npc.id}>
                  <div className="person">
                    {npc.icon}
                  </div>

                  <b>{npc.name}</b>

                  <small>
                    {npc.desc}
                  </small>

                  <span>
                    Quan hệ:{" "}
                    {game.relationships[
                      npc.id
                    ] || 0}
                    /100
                  </span>

                  <button
                    onClick={() =>
                      interact(npc.id)
                    }
                  >
                    {npc.act}
                  </button>
                </Card>
              ))}
            </div>
          </Section>
        );

      case "home":
        return (
          <Section title="🏠 Nhà">
            <div className="homeBox">
              <div className="big">
                🛏️
              </div>

              <h3>
                Nghỉ một chút
              </h3>

              <p>
                +25 năng lượng • +3 tâm trạng
                • +2 HP
              </p>

              <button onClick={rest}>
                😴 Nghỉ ngơi
              </button>
            </div>
          </Section>
        );

      case "cert":
        return (
          <Section title="🎓 Phòng chứng chỉ">
            <div className="grid">
              {CERTS.map((cert) => (
                <Card key={cert.id}>
                  <div className="big">
                    {cert.icon}
                  </div>

                  <b>{cert.name}</b>

                  <small>
                    {cert.desc}
                  </small>

                  <span>
                    Phí: {money(cert.fee)}
                    <br />
                    Kỹ năng ≥ {cert.req}
                  </span>

                  <button
                    disabled={game.certificates.includes(
                      cert.id
                    )}
                    onClick={() =>
                      startCert(cert.id)
                    }
                  >
                    {game.certificates.includes(
                      cert.id
                    )
                      ? "Đã có"
                      : "Thi · 3 câu"}
                  </button>
                </Card>
              ))}
            </div>
          </Section>
        );

      default:
        return (
          <Section title="🏠 Cửa hàng tài sản">
            <div className="grid">
              {PROPERTIES.map(
                (property) => (
                  <Card key={property.id}>
                    <div className="big">
                      {property.icon}
                    </div>

                    <b>
                      {property.name}
                    </b>

                    <small>
                      {property.desc}
                    </small>

                    <span>
                      {money(
                        property.price
                      )}
                    </span>

                    <button
                      disabled={game.assets.includes(
                        property.id
                      )}
                      onClick={() =>
                        buyProperty(
                          property.id
                        )
                      }
                    >
                      {game.assets.includes(
                        property.id
                      )
                        ? "Đã sở hữu"
                        : "Mua"}
                    </button>
                  </Card>
                )
              )}
            </div>
          </Section>
        );
    }
  };

  /* =========================================================
     MODAL
     ========================================================= */

  const modal =
    overlay && (
      <div
        className="modalBack"
        onMouseDown={(event) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            if (
              ![
                "quiz",
                "oral",
                "cert",
                "ending",
              ].includes(overlay)
            ) {
              setOverlay(null);
            }
          }
        }}
      >
        <div className="modal">
          {[
            "quiz",
            "oral",
            "cert",
          ].includes(overlay) && (
            <QuizModal
              type={overlay}
              data={
                overlay === "oral"
                  ? oral
                  : quiz
              }
              question={
                overlay === "oral"
                  ? currentOralQuestion
                  : currentQuestion
              }
              onAnswer={
                overlay === "cert"
                  ? answerCert
                  : (index) =>
                      answerQuiz(
                        index,
                        overlay === "oral"
                      )
              }
              onClose={() =>
                setOverlay(null)
              }
            />
          )}

          {overlay === "save" && (
            <SaveModal
              code={saveCode}
              setCode={setSaveCode}
              onCreate={saveNow}
              onLoad={loadCode}
              onExport={exportJson}
              onImport={() =>
                fileRef.current?.click()
              }
              onClose={() =>
                setOverlay(null)
              }
            />
          )}

          {overlay === "diary" && (
            <DiaryModal
              entries={
                game.diaryEntries
              }
              onClose={() =>
                setOverlay(null)
              }
            />
          )}

          {overlay === "titles" && (
            <TitlesModal
              titles={TITLES}
              unlocked={titles}
              selected={
                game.selectedTitle
              }
              setSelected={(id) =>
                setGame((g) => ({
                  ...g,
                  selectedTitle: id,
                }))
              }
              onClose={() =>
                setOverlay(null)
              }
            />
          )}

          {overlay === "leader" && (
            <LeaderModal
              board={leaderboard}
              onClose={() =>
                setOverlay(null)
              }
            />
          )}

          {overlay === "profile" && (
            <ProfileModal
              game={game}
              onClose={() =>
                setOverlay(null)
              }
            />
          )}

          {overlay === "ending" && (
            <Ending
              game={game}
              board={leaderboard}
              titles={titles}
              onReset={reset}
            />
          )}
        </div>
      </div>
    );

  /* =========================================================
     GAME UI
     ========================================================= */

  return (
    <div className="root">
      <div className="shell">

        {/* HEADER */}

        <header>
          <div>
            <strong>
              ✨ Thanh Xuân Rực Rỡ
            </strong>

            <small>
              Deluxe Career & Assets
              Edition
            </small>
          </div>

          <div className="headBtns">
            <button
              onClick={() =>
                setAutoTime(
                  (value) => !value
                )
              }
            >
              {autoTime
                ? "⏱️ Tự chạy"
                : "⏸️ Tạm dừng"}
            </button>

            <button
              onClick={() =>
                setAudioOn(
                  (value) => !value
                )
              }
            >
              {audioOn ? "🔊" : "🔇"}
            </button>

            <button
              onClick={() =>
                setOverlay("save")
              }
            >
              💾
            </button>
          </div>
        </header>

        {/* TIME */}

        <div className="top">
          <div>
            <b>
              Ngày {game.day}/
              {game.totalDays}
            </b>

            {" · "}

            <b>
              {TIME_SLOTS[
                game.timeIndex
              ]}
            </b>

            <span className="pill">
              {game.slotActionUsed
                ? "🎯 Đã dùng"
                : "🎯 Chưa dùng"}
            </span>
          </div>

          <div className="clock">
            <b>
              {autoTime && !blocking
                ? `00:${String(
                    secondsLeft
                  ).padStart(2, "0")}`
                : "⏸"}
            </b>

            <div className="bar">
              <i
                style={{
                  width: `${
                    autoTime && !blocking
                      ? (secondsLeft /
                          SLOT_SECONDS) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* STATS */}

        <div className="stats">
          {statItems.map(
            ([icon, name, key]) => (
              <div key={key}>
                <span>{icon}</span>

                <b>{name}</b>

                <em>
                  {game.stats[key]}
                </em>
              </div>
            )
          )}

          <div>
            <span>💰</span>
            <b>Tiền</b>

            <em>
              {money(game.stats.money)}
            </em>
          </div>
        </div>

        {/* MAIN */}

        <main>
          <section className="scene">

            <div className="locNav">
              <button
                onClick={() =>
                  navLoc(-1)
                }
              >
                ◀
              </button>

              <h2>
                {
                  locationTitle[
                    game.location
                  ]
                }
              </h2>

              <button
                onClick={() =>
                  navLoc(1)
                }
              >
                ▶
              </button>
            </div>

            {renderLocation()}

            <div className="bottom">
              <button
                onClick={() =>
                  setOverlay("profile")
                }
              >
                👤 Hồ sơ
              </button>

              <button
                onClick={() =>
                  setOverlay("leader")
                }
              >
                🏆 Thi đua
              </button>

              <button
                onClick={() =>
                  setOverlay("diary")
                }
              >
                📔 Nhật ký
              </button>

              <button
                onClick={() =>
                  setOverlay("titles")
                }
              >
                🏷️ Danh hiệu
              </button>
            </div>
          </section>

          {/* SIDEBAR */}

          <aside className="side">

            <div className="sideCard">
              <b>📊 Thi đua</b>

              {leaderboard
                .slice(0, 4)
                .map((item, index) => (
                  <div
                    className="rank"
                    key={item.id}
                  >
                    <span>
                      #{index + 1}{" "}
                      {item.icon}{" "}
                      {item.name}
                    </span>

                    <strong>
                      {item.points}
                    </strong>
                  </div>
                ))}

              <button
                onClick={() =>
                  setOverlay("leader")
                }
              >
                Xem bảng đầy đủ
              </button>
            </div>

            <div className="sideCard">
              <b>🎒 Túi đồ</b>

              {game.bag
                .filter(
                  (item) =>
                    item.count > 0
                )
                .map((item) => (
                  <div
                    className="bag"
                    key={item.id}
                  >
                    {item.icon}{" "}
                    {item.name} ×
                    {item.count}
                  </div>
                ))}

              {game.bag.every(
                (item) =>
                  !item.count
              ) && (
                <small>
                  Túi đang trống.
                </small>
              )}
            </div>

            <div className="sideCard">
              <b>🏆 Danh hiệu</b>

              <div className="currentTitle">
                {
                  (
                    TITLES.find(
                      (t) =>
                        t.id ===
                        game.selectedTitle
                    ) || TITLES[0]
                  ).icon
                }{" "}
                {
                  (
                    TITLES.find(
                      (t) =>
                        t.id ===
                        game.selectedTitle
                    ) || TITLES[0]
                  ).name
                }
              </div>

              <small>
                Đã mở:{" "}
                {titles.length}/
                {TITLES.length}
              </small>
            </div>
          </aside>
        </main>

        {/* FOOTER */}

        <footer>
          <span>
            ⏱️ 45 giây = 1 mốc • 6 mốc = 1 ngày
          </span>

          <span>
            📔 Nhật ký tự chốt lúc 20:30
          </span>
        </footer>
      </div>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      {modal}

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        hidden
        onChange={(event) => {
          const file =
            event.target.files?.[0];

          if (file) {
            importJson(file);
          }
        }}
      />

      {game.isGameOver &&
        overlay !== "ending" && (
          <div
            className="modalBack"
            style={{ zIndex: 100 }}
          >
            <div className="modal">
              <Ending
                game={game}
                board={leaderboard}
                titles={titles}
                onReset={reset}
              />
            </div>
          </div>
        )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
   ========================================================= */

function Section({ title, children }) {
  return (
    <div className="section">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

/* =========================================================
   QUIZ MODAL
   ========================================================= */

function QuizModal({
  type,
  data,
  question,
  onAnswer,
  onClose,
}) {
  if (!data || !question) {
    return null;
  }

  const total =
    data.questions.length;

  return (
    <div>
      <div className="modalHead">
        <b>
          {type === "oral"
            ? "🧑‍🏫 Kiểm tra miệng · 15 phút"
            : type === "cert"
            ? `🎓 ${
                data.cert?.name ||
                "Thi chứng chỉ"
              }`
            : "📖 Quiz nhanh"}
        </b>

        {![
          "oral",
          "cert",
        ].includes(type) && (
          <button onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="qmeta">
        Câu {data.index + 1}/
        {total}
        {" · "}
        Đúng {data.score}
        {" · "}
        Sai {data.wrong}
      </div>

      <div className="subject">
        {question.subject}
      </div>

      <h2 className="question">
        {question.q}
      </h2>

      <div className="choices">
        {question.choices.map(
          (choice, index) => (
            <button
              key={choice}
              disabled={
                !!data.feedback
              }
              onClick={() =>
                onAnswer(index)
              }
            >
              <b>
                {String.fromCharCode(
                  65 + index
                )}
              </b>

              {choice}
            </button>
          )
        )}
      </div>

      {data.feedback && (
        <div
          className={
            data.feedback.startsWith(
              "✅"
            )
              ? "feedback ok"
              : "feedback bad"
          }
        >
          {data.feedback}
        </div>
      )}

      <div className="hint">
        Mỗi câu sai:
        <b> -2 Kiến thức</b>.
      </div>
    </div>
  );
}

/* =========================================================
   SAVE MODAL
   ========================================================= */

function SaveModal({
  code,
  setCode,
  onCreate,
  onLoad,
  onExport,
  onImport,
  onClose,
}) {
  return (
    <div>
      <div className="modalHead">
        <b>
          💾 Lưu / Nạp game
        </b>

        <button onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="actions">
        <button onClick={onCreate}>
          🔐 Tạo mã lưu
        </button>

        <button onClick={onExport}>
          📄 Xuất JSON
        </button>

        <button onClick={onImport}>
          📥 Nhập JSON
        </button>
      </div>

      <textarea
        value={code}
        onChange={(event) =>
          setCode(event.target.value)
        }
        placeholder="Mã lưu game sẽ xuất hiện ở đây..."
      />

      <button
        className="primary"
        onClick={onLoad}
      >
        📥 Nạp từ mã
      </button>
    </div>
  );
}

/* =========================================================
   DIARY
   ========================================================= */

function DiaryModal({
  entries,
  onClose,
}) {
  return (
    <div>
      <div className="modalHead">
        <b>
          📔 Nhật ký cuối ngày
        </b>

        <button onClick={onClose}>
          ✕
        </button>
      </div>

      {entries.length ? (
        entries.map((entry) => (
          <div
            className="diary"
            key={entry.day}
          >
            <b>
              Ngày {entry.day} ·{" "}
              {entry.event}
            </b>

            <p>
              {entry.summary}
            </p>

            <div className="deltas">
              🧠{" "}
              {entry.deltas.study >= 0
                ? "+"
                : ""}
              {entry.deltas.study}

              {" · "}

              ⚡{" "}
              {entry.deltas.energy >= 0
                ? "+"
                : ""}
              {entry.deltas.energy}

              {" · "}

              🤝{" "}
              {entry.deltas.friends >= 0
                ? "+"
                : ""}
              {entry.deltas.friends}

              {" · "}

              💰{" "}
              {entry.deltas.money >= 0
                ? "+"
                : ""}
              {money(
                entry.deltas.money
              )}

              {" · "}

              🏆{" "}
              {entry.deltas.competition >=
              0
                ? "+"
                : ""}
              {
                entry.deltas
                  .competition
              }
            </div>
          </div>
        ))
      ) : (
        <p>
          Chưa có ngày nào kết thúc.
          Nhật ký sẽ chốt lúc 20:30.
        </p>
      )}
    </div>
  );
}

/* =========================================================
   TITLES
   ========================================================= */

function TitlesModal({
  titles,
  unlocked,
  selected,
  setSelected,
  onClose,
}) {
  return (
    <div>
      <div className="modalHead">
        <b>🏷️ Danh hiệu</b>

        <button onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="grid">
        {titles.map((title) => {
          const isUnlocked =
            unlocked.some(
              (x) =>
                x.id === title.id
            );

          return (
            <Card key={title.id}>
              <div className="big">
                {title.icon}
              </div>

              <b>
                {title.name}
              </b>

              <small>
                {title.desc}
              </small>

              <button
                disabled={!isUnlocked}
                onClick={() =>
                  setSelected(
                    title.id
                  )
                }
              >
                {selected ===
                title.id
                  ? "Đang đeo"
                  : isUnlocked
                  ? "Đeo danh hiệu"
                  : "Chưa mở"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   LEADERBOARD
   ========================================================= */

function LeaderModal({
  board,
  onClose,
}) {
  return (
    <div>
      <div className="modalHead">
        <b>
          🏆 Bảng thi đua
        </b>

        <button onClick={onClose}>
          ✕
        </button>
      </div>

      {board.map(
        (item, index) => (
          <div
            className="leader"
            key={item.id}
          >
            <b>
              #{index + 1}
            </b>

            <span>
              {item.icon}{" "}
              {item.name}
            </span>

            <strong>
              {item.points}
            </strong>

            <small>
              +{item.today} hôm nay
            </small>
          </div>
        )
      )}
    </div>
  );
}

/* =========================================================
   PROFILE
   ========================================================= */

function ProfileModal({
  game,
  onClose,
}) {
  const title =
    TITLES.find(
      (item) =>
        item.id ===
        game.selectedTitle
    ) || TITLES[0];

  return (
    <div>
      <div className="modalHead">
        <b>
          👤 Hồ sơ nhân vật
        </b>

        <button onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="profile">
        <div className="avatar">
          🧑🏻‍🎓
        </div>

        <h2>
          Nhân vật chính
        </h2>

        <p>
          {title.icon}{" "}
          {title.name}
        </p>

        <div className="profileGrid">
          <span>
            📚 Học:{" "}
            {game.studyActions}
          </span>

          <span>
            💼 Việc:{" "}
            {game.jobActions}
          </span>

          <span>
            🧑‍🏫 Kiểm tra:{" "}
            {game.oralChecksDone}
          </span>

          <span>
            🎓 Chứng chỉ:{" "}
            {game.certificates.length}
          </span>

          <span>
            🏠 Tài sản:{" "}
            {game.assets.length}
          </span>

          <span>
            🏆 Thi đua:{" "}
            {game.competitionPoints}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ENDING
   ========================================================= */

function Ending({
  game,
  board,
  titles,
  onReset,
}) {
  return (
    <div className="ending">
      <div className="big">
        ✨
      </div>

      <h1>
        Thanh Xuân Rực Rỡ!
      </h1>

      <p>
        Bạn đã hoàn thành{" "}
        {game.totalDays} ngày
        của hành trình cấp 3.
      </p>

      <div className="finalStats">
        <b>
          🧠 Kiến thức{" "}
          {game.stats.study}
        </b>

        <b>
          🤝 Bạn bè{" "}
          {game.stats.friends}
        </b>

        <b>
          🛠️ Kỹ năng{" "}
          {game.stats.skill}
        </b>

        <b>
          🏆 Thi đua{" "}
          {game.competitionPoints}
        </b>

        <b>
          💰{" "}
          {money(
            game.stats.money
          )}
        </b>
      </div>

      <h3>
        🏅 Bảng thi đua cuối hành trình
      </h3>

      {board
        .slice(0, 5)
        .map((item, index) => (
          <div
            className="leader"
            key={item.id}
          >
            <b>
              #{index + 1}
            </b>

            <span>
              {item.icon}{" "}
              {item.name}
            </span>

            <strong>
              {item.points}
            </strong>
          </div>
        ))}

      <p>
        Danh hiệu đã mở:{" "}
        {titles.length}/
        {TITLES.length}
      </p>

      <button
        className="primary"
        onClick={onReset}
      >
        🌱 Chơi lại
      </button>
    </div>
  );
}

/* =========================================================
   CSS
   ========================================================= */

const CSS = `
*{
  box-sizing:border-box;
}

html,
body,
#root{
  margin:0;
  width:100%;
  min-height:100%;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  color:#211a35;
}

body{
  overflow:hidden;
  background:#120c24;
}

button,
input,
textarea{
  font:inherit;
}

button{
  cursor:pointer;
}

.root{
  height:100dvh;
  min-height:100dvh;
  padding:8px;

  display:flex;
  justify-content:center;
  align-items:center;

  background:
    radial-gradient(
      circle at 20% 10%,
      #5b2b78 0,
      #24103d 35%,
      #100a1d 100%
    );
}

.shell{
  width:min(1100px,100%);
  height:calc(100dvh - 16px);

  min-height:0;

  display:flex;
  flex-direction:column;

  overflow:hidden;

  border:1px solid #6d4a88;
  border-radius:18px;

  background:#f7f4fb;

  box-shadow:
    0 20px 70px #0008;
}

/* HEADER */

header{
  height:52px;
  flex:none;

  padding:7px 12px;

  background:
    linear-gradient(
      100deg,
      #51257b,
      #7a3ca3
    );

  color:white;

  display:flex;
  align-items:center;
  justify-content:space-between;
}

header strong{
  display:block;
  font-size:16px;
}

header small{
  display:block;
  opacity:.78;
  font-size:10px;
}

.headBtns{
  display:flex;
  gap:5px;
}

.headBtns button{
  border:1px solid #ffffff45;
  background:#ffffff18;
  color:white;

  border-radius:9px;

  padding:7px 9px;

  font-size:12px;
  font-weight:700;
}

/* TIME */

.top{
  flex:none;

  height:43px;

  padding:5px 10px;

  background:#fff;

  display:flex;
  justify-content:space-between;
  align-items:center;

  border-bottom:1px solid #e4dcea;

  font-size:12px;
}

.pill{
  margin-left:7px;

  padding:3px 7px;

  border-radius:20px;

  background:#eee5f7;
  color:#60317b;

  font-size:10px;
}

.clock{
  width:145px;
  text-align:right;
}

.clock b{
  font-variant-numeric:
    tabular-nums;
}

.bar{
  height:4px;

  background:#e8deef;

  border-radius:5px;

  overflow:hidden;

  margin-top:2px;
}

.bar i{
  display:block;

  height:100%;

  background:#7a3ca3;

  transition:width .2s;
}

/* STATS */

.stats{
  flex:none;

  padding:5px 8px;

  display:grid;

  grid-template-columns:
    repeat(9,1fr);

  gap:4px;

  background:#eee8f4;

  border-bottom:1px solid #ddd2e7;
}

.stats > div{
  min-width:0;

  background:white;

  border:1px solid #e0d6e8;

  border-radius:8px;

  padding:3px 4px;

  text-align:center;

  display:grid;

  grid-template-columns:
    auto 1fr;

  align-items:center;

  column-gap:3px;
}

.stats span{
  font-size:12px;
}

.stats b{
  font-size:9px;
  text-align:left;
  color:#665872;
}

.stats em{
  grid-column:1/3;

  font-style:normal;

  font-size:11px;

  font-weight:800;

  color:#241a32;

  white-space:nowrap;

  overflow:hidden;

  text-overflow:ellipsis;
}

.stats > div:last-child em{
  font-size:9px;
}

/* MAIN */

main{
  flex:1;

  min-height:0;

  display:grid;

  grid-template-columns:
    minmax(0,1fr) 250px;

  gap:7px;

  padding:7px;

  overflow:hidden;
}

.scene,
.sideCard{
  background:#fff;

  border:1px solid #e2d8e9;

  border-radius:12px;
}

.scene{
  min-width:0;
  min-height:0;

  overflow:auto;

  padding:8px;
}

.sideCard{
  padding:9px;
  margin-bottom:7px;
}

.sideCard > b{
  font-size:12px;

  display:block;

  margin-bottom:6px;
}

/* LOCATION */

.locNav{
  height:35px;

  display:grid;

  grid-template-columns:
    34px 1fr 34px;

  gap:5px;

  align-items:center;

  margin-bottom:6px;
}

.locNav h2{
  text-align:center;

  font-size:15px;

  margin:0;
}

/* BUTTON */

button{
  border:1px solid #d8c9e5;

  background:#fff;

  color:#322344;

  border-radius:9px;

  padding:7px 9px;

  font-weight:700;

  font-size:12px;
}

button:hover:not(:disabled){
  transform:translateY(-1px);
  filter:brightness(.98);
}

button:disabled{
  opacity:.45;
  cursor:not-allowed;
}

/* EVENT */

.event{
  padding:9px;

  border-radius:10px;

  background:#f5eff9;

  border:1px solid #dfd0eb;

  display:grid;

  gap:3px;
}

.event b{
  font-size:13px;
}

.event span,
.event small{
  font-size:11px;

  color:#665872;
}

/* ACTIONS */

.actions{
  display:flex;

  flex-wrap:wrap;

  gap:6px;

  margin-top:7px;
}

.actions button{
  flex:1;

  min-width:180px;
}

.hint{
  font-size:10px;

  color:#776b80;

  margin-top:7px;

  padding:5px 7px;

  background:#faf8fc;

  border-radius:7px;
}

/* CARDS */

.grid{
  display:grid;

  grid-template-columns:
    repeat(3,minmax(0,1fr));

  gap:6px;
}

.card{
  border:1px solid #e5ddea;

  border-radius:10px;

  padding:8px;

  display:flex;

  flex-direction:column;

  gap:4px;

  min-width:0;

  background:#fcfbfd;
}

.card b{
  font-size:11px;
}

.card small,
.card span{
  font-size:9px;

  color:#6e6277;

  line-height:1.3;
}

.card button{
  margin-top:auto;

  padding:6px;
}

.big{
  font-size:24px;

  line-height:1.1;
}

.person{
  font-size:30px;
}

/* HOME */

.homeBox{
  text-align:center;

  padding:22px 8px;

  background:#f7f2fa;

  border-radius:12px;
}

.homeBox h3{
  margin:5px;
}

.homeBox p{
  font-size:11px;

  color:#6e6277;
}

/* BOTTOM */

.bottom{
  display:grid;

  grid-template-columns:
    repeat(4,1fr);

  gap:5px;

  margin-top:7px;
}

.bottom button{
  padding:7px 4px;

  font-size:10px;
}

/* SIDEBAR */

.rank{
  display:grid;

  grid-template-columns:
    1fr auto;

  gap:4px;

  align-items:center;

  padding:5px 0;

  border-bottom:1px solid #eee7f2;

  font-size:10px;
}

.rank strong{
  font-size:11px;
}

.sideCard button{
  width:100%;

  margin-top:6px;
}

.bag{
  font-size:10px;

  padding:4px 0;
}

.currentTitle{
  font-size:11px;

  margin-bottom:3px;
}

.sideCard small{
  font-size:9px;

  color:#786d82;
}

/* MODAL */

.modalBack{
  position:fixed;

  inset:0;

  background:#120a1dbd;

  z-index:50;

  display:flex;

  align-items:center;

  justify-content:center;

  padding:12px;
}

.modal{
  width:min(600px,100%);

  max-height:88dvh;

  overflow:auto;

  background:#fff;

  border-radius:16px;

  border:1px solid #d6c4e2;

  box-shadow:
    0 25px 80px #0008;

  padding:13px;
}

.modalHead{
  display:flex;

  justify-content:space-between;

  align-items:center;

  margin-bottom:8px;
}

.modalHead b{
  font-size:15px;
}

/* QUIZ */

.qmeta{
  font-size:10px;

  color:#76687d;

  margin-bottom:5px;
}

.subject{
  display:inline-block;

  padding:3px 7px;

  border-radius:20px;

  background:#eee3f5;

  color:#66317f;

  font-size:10px;

  font-weight:800;
}

.question{
  font-size:18px;

  line-height:1.3;

  margin:9px 0;
}

.choices{
  display:grid;

  gap:6px;
}

.choices button{
  text-align:left;

  padding:9px;

  display:flex;

  gap:8px;

  align-items:flex-start;
}

.choices button b{
  background:#eee4f5;

  border-radius:5px;

  padding:2px 5px;
}

.feedback{
  margin-top:8px;

  padding:8px;

  border-radius:8px;

  font-size:11px;

  font-weight:700;
}

.feedback.ok{
  background:#eaf8ef;

  color:#20703d;
}

.feedback.bad{
  background:#fff0f0;

  color:#a12a2a;
}

.modal textarea{
  width:100%;

  height:150px;

  border:1px solid #ddd0e7;

  border-radius:9px;

  padding:8px;

  resize:vertical;

  margin:8px 0;

  font-size:10px;
}

.primary{
  width:100%;

  background:#65328a;

  color:#fff;

  border-color:#65328a;
}

/* DIARY */

.diary{
  padding:8px;

  border:1px solid #e6dceb;

  border-radius:9px;

  margin-bottom:6px;

  background:#fcfbfd;
}

.diary > b{
  font-size:11px;
}

.diary p{
  font-size:10px;

  margin:4px 0;

  color:#62576b;
}

.deltas{
  font-size:9px;

  color:#68417d;
}

/* LEADER */

.leader{
  display:grid;

  grid-template-columns:
    30px 1fr 50px 65px;

  gap:4px;

  align-items:center;

  padding:7px 0;

  border-bottom:1px solid #eee7f2;

  font-size:11px;
}

.leader strong{
  font-size:11px;
}

.leader small{
  text-align:right;

  color:#7b6d82;

  font-size:9px;
}

/* PROFILE */

.profile{
  text-align:center;
}

.avatar{
  font-size:55px;
}

.profile h2{
  font-size:17px;

  margin:4px;
}

.profile p{
  font-size:11px;
}

.profileGrid{
  display:grid;

  grid-template-columns:
    1fr 1fr;

  gap:5px;

  text-align:left;
}

.profileGrid span{
  padding:7px;

  background:#f5eff8;

  border-radius:7px;

  font-size:10px;
}

/* ENDING */

.ending{
  text-align:center;

  padding:10px;
}

.ending h1{
  font-size:24px;

  margin:5px;
}

.ending p{
  font-size:11px;

  color:#665a70;
}

.finalStats{
  display:grid;

  grid-template-columns:
    1fr 1fr;

  gap:5px;

  margin:10px 0;
}

.finalStats b{
  padding:7px;

  background:#f5eff8;

  border-radius:7px;

  font-size:10px;
}

/* TOAST */

.toast{
  position:fixed;

  left:50%;

  bottom:18px;

  transform:translateX(-50%);

  z-index:80;

  background:#241530;

  color:#fff;

  padding:9px 13px;

  border-radius:10px;

  box-shadow:
    0 10px 30px #0006;

  font-size:11px;

  font-weight:700;

  max-width:min(90vw,520px);

  text-align:center;
}

/* FOOTER */

footer{
  flex:none;

  height:25px;

  padding:3px 10px;

  background:#eee8f4;

  color:#786c80;

  font-size:9px;

  display:flex;

  justify-content:space-between;
}

/* RESPONSIVE */

@media(max-width:820px){

  .root{
    padding:0;
  }

  .shell{
    height:100dvh;

    border-radius:0;
  }

  .stats{
    grid-template-columns:
      repeat(5,1fr);
  }

  main{
    grid-template-columns:1fr;

    overflow:auto;
  }

  .scene{
    overflow:visible;
  }

  .side{
    display:grid;

    grid-template-columns:
      repeat(3,1fr);

    gap:6px;
  }

  .sideCard{
    margin:0;
  }

  .grid{
    grid-template-columns:
      repeat(3,1fr);
  }
}

@media(max-width:560px){

  header strong{
    font-size:13px;
  }

  .top{
    font-size:10px;
  }

  .clock{
    width:100px;
  }

  .stats{
    grid-template-columns:
      repeat(5,1fr);
  }

  .stats > div:nth-child(n+6){
    display:none;
  }

  .grid{
    grid-template-columns:
      repeat(2,1fr);
  }

  .side{
    grid-template-columns:1fr;
  }

  .bottom{
    grid-template-columns:
      repeat(2,1fr);
  }

  .question{
    font-size:16px;
  }

  .modal{
    padding:10px;
  }

  .finalStats{
    grid-template-columns:1fr;
  }
}
`;

/* =========================================================
   INJECT CSS
   ========================================================= */

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "txrr-style"
  )
) {
  const style =
    document.createElement("style");

  style.id = "txrr-style";
  style.textContent = CSS;

  document.head.appendChild(style);
}
