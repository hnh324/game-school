import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   THANH XUÂN RỰC RỠ
   Deluxe Career & Fashion Edition
   - 1 file App.jsx
   - 23 mốc thời gian / ngày
   - Mỗi mốc 45 giây
   - Mỗi mốc tối đa 1 hoạt động chính
   - Quick Activities
   - Fashion / Outfit
   - 460 câu hỏi (180 câu cũ + 100 HSK + 180 English B1-B2)
   - NPC
   - Nghề
   - Chứng chỉ
   - Tài sản
   - Nhật ký
   - Thi đua
   - Save code
========================================================= */

const SAVE_KEY = "thanh_xuan_ruc_ro_deluxe_v8";
const SLOT_SECONDS = 45;

/* =========================================================
   THỜI GIAN
========================================================= */

const TIME_SLOTS = [
  "06:30","07:15","08:00","08:45","09:30","10:15",
  "11:00","11:45","12:30","13:15","14:00","14:45",
  "15:30","16:15","17:00","17:45","18:30","19:15",
  "20:00","20:45","21:30","22:15","23:00"
];

const PERIOD_NAMES = [
  "Buổi sáng","Buổi sáng","Tiết học","Tiết học","Tiết học","Tiết học",
  "Cuối buổi sáng","Cuối buổi sáng","Nghỉ trưa","Buổi chiều","Buổi chiều",
  "Buổi chiều","Buổi chiều","Tan học","Buổi tối","Buổi tối","Buổi tối",
  "Buổi tối","Buổi tối","Buổi tối","Kết thúc ngày","Kết thúc ngày","Kết thúc ngày"
];

/* =========================================================
   HELPERS
========================================================= */

const clamp = (n, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(n) || 0));

const money = (n) =>
  `${Math.round(Number(n) || 0).toLocaleString("vi-VN")}đ`;

const signed = (n) => {
  const x = Number(n) || 0;
  return x > 0 ? `+${x}` : `${x}`;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const addStat = (g, key, amount) => {
  const max = key === "skill" ? 500 : 100;
  g.stats[key] = clamp(g.stats[key] + amount, 0, max);
};

const addMoney = (g, amount) => {
  g.stats.money = Math.max(0, g.stats.money + amount);
};

const addCompetition = (g, amount) => {
  const n = Math.round(Number(amount) || 0);
  g.competitionPoints = Math.max(0, g.competitionPoints + n);
  g.dailyCompetition.player += n;
};

const addRelationship = (g, id, amount) => {
  g.relationships[id] = clamp((g.relationships[id] || 0) + amount);
};

/* =========================================================
   180 CÂU HỎI
   9 MÔN × 20 CÂU
========================================================= */

const VAN_QUESTIONS = [
  ["Vợ nhặt", "Tác phẩm Vợ nhặt của ai?", ["Kim Lân", "Nam Cao", "Tô Hoài", "Nguyễn Tuân"], 0, "Vợ nhặt là truyện ngắn nổi tiếng của Kim Lân."],
  ["Vợ nhặt", "Bối cảnh chính của Vợ nhặt gắn với sự kiện nào?", ["Nạn đói 1945", "Cách mạng tháng Tám 1930", "Kháng chiến chống Mỹ", "Đổi mới"], 0, "Tác phẩm lấy bối cảnh nạn đói năm 1945."],
  ["Đoàn thuyền đánh cá", "“Mặt trời xuống biển như hòn lửa” sử dụng biện pháp gì?", ["So sánh", "Hoán dụ", "Nói quá", "Điệp ngữ"], 0, "Hình ảnh mặt trời được so sánh với hòn lửa."],
  ["Truyện Kiều", "Tác giả Truyện Kiều là ai?", ["Nguyễn Du", "Nguyễn Trãi", "Nguyễn Đình Chiểu", "Hồ Xuân Hương"], 0, "Nguyễn Du là tác giả Truyện Kiều."],
  ["Chí Phèo", "Chí Phèo là tác phẩm của ai?", ["Nam Cao", "Kim Lân", "Ngô Tất Tố", "Vũ Trọng Phụng"], 0, "Chí Phèo là truyện ngắn của Nam Cao."],
  ["Tây Tiến", "Tây Tiến được sáng tác bởi nhà thơ nào?", ["Quang Dũng", "Tố Hữu", "Chính Hữu", "Huy Cận"], 0, "Quang Dũng sáng tác Tây Tiến."],
  ["Việt Bắc", "Việt Bắc là tác phẩm của ai?", ["Tố Hữu", "Quang Dũng", "Xuân Quỳnh", "Bằng Việt"], 0, "Việt Bắc là trường ca thơ của Tố Hữu."],
  ["Tuyên ngôn Độc lập", "Tuyên ngôn Độc lập năm 1945 do ai đọc?", ["Hồ Chí Minh", "Võ Nguyên Giáp", "Phạm Văn Đồng", "Trường Chinh"], 0, "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2/9/1945."],
  ["Đất Nước", "Đoạn trích Đất Nước thuộc trường ca nào?", ["Mặt đường khát vọng", "Việt Bắc", "Đất nước", "Những người đi tới biển"], 0, "Đất Nước của Nguyễn Khoa Điềm thuộc trường ca Mặt đường khát vọng."],
  ["Sóng", "Sóng là tác phẩm của ai?", ["Xuân Quỳnh", "Hàn Mặc Tử", "Lưu Trọng Lư", "Chế Lan Viên"], 0, "Sóng là bài thơ nổi tiếng của Xuân Quỳnh."],
  ["Người lái đò sông Đà", "Tác giả Người lái đò sông Đà là ai?", ["Nguyễn Tuân", "Nguyễn Minh Châu", "Tô Hoài", "Thạch Lam"], 0, "Nguyễn Tuân nổi tiếng với phong cách tài hoa, uyên bác."],
  ["Vợ chồng A Phủ", "Vợ chồng A Phủ của tác giả nào?", ["Tô Hoài", "Kim Lân", "Nam Cao", "Nguyễn Tuân"], 0, "Tô Hoài viết Vợ chồng A Phủ."],
  ["Rừng xà nu", "Rừng xà nu là tác phẩm của ai?", ["Nguyễn Trung Thành", "Nguyễn Minh Châu", "Nguyễn Khoa Điềm", "Tô Hoài"], 0, "Nguyễn Trung Thành là tác giả Rừng xà nu."],
  ["Chiếc thuyền ngoài xa", "Chiếc thuyền ngoài xa của ai?", ["Nguyễn Minh Châu", "Nguyễn Tuân", "Nam Cao", "Kim Lân"], 0, "Đây là truyện ngắn của Nguyễn Minh Châu."],
  ["Ai đã đặt tên cho dòng sông?", "Tác giả Ai đã đặt tên cho dòng sông? là ai?", ["Hoàng Phủ Ngọc Tường", "Nguyễn Tuân", "Tố Hữu", "Xuân Diệu"], 0, "Hoàng Phủ Ngọc Tường là tác giả bút ký này."],
  ["Hai đứa trẻ", "Hai đứa trẻ là tác phẩm của ai?", ["Thạch Lam", "Nam Cao", "Vũ Trọng Phụng", "Nguyễn Công Hoan"], 0, "Hai đứa trẻ là truyện ngắn của Thạch Lam."],
  ["Chữ người tử tù", "Chữ người tử tù của ai?", ["Nguyễn Tuân", "Nguyễn Du", "Nam Cao", "Tô Hoài"], 0, "Nguyễn Tuân viết Chữ người tử tù."],
  ["Lão Hạc", "Lão Hạc là tác phẩm của nhà văn nào?", ["Nam Cao", "Kim Lân", "Thạch Lam", "Ngô Tất Tố"], 0, "Lão Hạc là truyện ngắn nổi tiếng của Nam Cao."],
  ["Đồng chí", "Đồng chí là bài thơ của ai?", ["Chính Hữu", "Quang Dũng", "Tố Hữu", "Huy Cận"], 0, "Chính Hữu viết Đồng chí."],
  ["Bếp lửa", "Bếp lửa là tác phẩm của ai?", ["Bằng Việt", "Xuân Quỳnh", "Tố Hữu", "Chế Lan Viên"], 0, "Bằng Việt sáng tác Bếp lửa."],
];

const LY_QUESTIONS = [
  ["Công suất", "Đơn vị SI của công suất là gì?", ["W", "J", "N", "Pa"], 0, "Công suất có đơn vị watt (W)."],
  ["Newton", "Định luật II Newton có công thức nào?", ["F = ma", "F = m/a", "F = a/m", "F = mv"], 0, "Lực bằng khối lượng nhân gia tốc."],
  ["Vận tốc", "Đơn vị thường dùng của vận tốc là gì?", ["m/s", "kg", "N", "J"], 0, "Trong SI, vận tốc có đơn vị m/s."],
  ["Ohm", "Định luật Ohm cho đoạn mạch có công thức?", ["U = IR", "U = I/R", "I = UR", "R = UI"], 0, "U = IR."],
  ["Mạch nối tiếp", "Trong mạch nối tiếp, đại lượng nào giống nhau qua các phần tử?", ["Cường độ dòng điện", "Hiệu điện thế", "Điện trở", "Công suất"], 0, "Dòng điện qua các phần tử nối tiếp có cùng cường độ."],
  ["Mạch song song", "Trong mạch song song, đại lượng nào giống nhau?", ["Hiệu điện thế", "Cường độ dòng điện", "Điện trở", "Công suất"], 0, "Các nhánh song song có cùng hiệu điện thế."],
  ["Động năng", "Động năng của vật được tính bằng?", ["1/2mv²", "mv", "mgh", "Fs"], 0, "Động năng Wđ = 1/2mv²."],
  ["Thế năng", "Thế năng trọng trường gần mặt đất là?", ["mgh", "1/2mv²", "ma", "UI"], 0, "Wt = mgh."],
  ["Công cơ học", "Công của lực không đổi được tính bằng?", ["Fs cosα", "F/s", "Fs sinα", "mgh/t"], 0, "A = Fs cosα."],
  ["Tần số", "Đơn vị của tần số là?", ["Hz", "W", "V", "Ω"], 0, "Hertz (Hz)."],
  ["Ánh sáng", "Tốc độ ánh sáng trong chân không xấp xỉ?", ["3×10⁸ m/s", "3×10⁶ m/s", "3×10⁴ m/s", "3×10² m/s"], 0, "Giá trị gần đúng là 3×10⁸ m/s."],
  ["Thấu kính", "Thấu kính hội tụ có tác dụng chính là?", ["Hội tụ chùm tia", "Phân kỳ chùm tia", "Hấp thụ ánh sáng", "Phản xạ hoàn toàn"], 0, "Thấu kính hội tụ làm các tia tới song song hội tụ."],
  ["Dòng điện", "Đơn vị của cường độ dòng điện là?", ["A", "V", "Ω", "W"], 0, "Ampe (A)."],
  ["Điện trở", "Đơn vị của điện trở là?", ["Ω", "A", "V", "J"], 0, "Ohm (Ω)."],
  ["Máy biến áp", "Máy biến áp thông thường hoạt động với?", ["Dòng điện xoay chiều", "Dòng điện một chiều", "Cả hai như nhau", "Không cần điện"], 0, "Máy biến áp dựa trên hiện tượng cảm ứng điện từ và dùng AC."],
  ["Động lượng", "Động lượng được tính bằng?", ["p = mv", "p = ma", "p = F/s", "p = mgh"], 0, "Động lượng p = mv."],
  ["Gia tốc", "Đơn vị của gia tốc là?", ["m/s²", "m/s", "N", "J"], 0, "Gia tốc có đơn vị m/s²."],
  ["Công suất điện", "Công suất điện được tính bằng?", ["P = UI", "P = U/I", "P = IR", "P = U+I"], 0, "P = UI."],
  ["Sóng", "Quan hệ giữa vận tốc, bước sóng và tần số là?", ["v = λf", "v = λ/f", "v = f/λ", "v = λ+f"], 0, "Công thức sóng v = λf."],
  ["Âm thanh", "Âm thanh không truyền được trong môi trường nào?", ["Chân không", "Không khí", "Nước", "Kim loại"], 0, "Âm thanh cần môi trường vật chất để truyền."],
];

const HOA_QUESTIONS = [
  ["pH", "Dung dịch có pH < 7 thường có tính gì?", ["Axit", "Bazơ", "Trung tính", "Muối"], 0, "pH nhỏ hơn 7 thường biểu thị môi trường axit."],
  ["NaCl", "NaCl thuộc loại hợp chất nào?", ["Ion", "Cộng hóa trị không cực", "Kim loại", "Polymer"], 0, "NaCl là hợp chất ion."],
  ["Nguyên tử", "Số hiệu nguyên tử cho biết số lượng?", ["Proton", "Neutron", "Electron lớp ngoài cùng", "Phân tử"], 0, "Số hiệu nguyên tử Z bằng số proton."],
  ["O2", "O2 là công thức của?", ["Khí oxygen", "Khí hydrogen", "Khí nitrogen", "Khí carbon dioxide"], 0, "O2 là phân tử oxygen."],
  ["H2O", "Khối lượng mol của H2O gần bằng?", ["18 g/mol", "16 g/mol", "20 g/mol", "2 g/mol"], 0, "2×1 + 16 = 18 g/mol."],
  ["CO2", "CO2 thuộc loại hợp chất nào?", ["Oxide", "Axit", "Bazơ", "Muối"], 0, "CO2 là oxide của carbon."],
  ["HCl", "HCl trong nước là?", ["Axit", "Bazơ", "Muối", "Kim loại"], 0, "HCl là acid hydrochloric."],
  ["NaOH", "NaOH là?", ["Bazơ", "Axit", "Muối", "Oxide"], 0, "NaOH là một bazơ mạnh."],
  ["Trung hòa", "Axit + bazơ thường tạo ra?", ["Muối và nước", "Kim loại", "Oxygen", "Polymer"], 0, "Phản ứng trung hòa tạo muối và nước."],
  ["Xúc tác", "Chất xúc tác có tác dụng gì?", ["Thay đổi tốc độ phản ứng", "Luôn bị tiêu hao hoàn toàn", "Làm phản ứng dừng", "Tạo nguyên tố mới"], 0, "Xúc tác làm thay đổi tốc độ phản ứng và thường không bị tiêu hao."],
  ["Bảng tuần hoàn", "Nhóm 1 gồm các kim loại nào đặc trưng?", ["Kim loại kiềm", "Halogen", "Khí hiếm", "Kim loại chuyển tiếp"], 0, "Nhóm 1 là nhóm kim loại kiềm, trừ hydrogen."],
  ["Oxi hóa", "Quá trình oxi hóa theo quan niệm electron là?", ["Nhường electron", "Nhận electron", "Nhận proton", "Nhường neutron"], 0, "Oxi hóa là quá trình nhường electron."],
  ["Khử", "Quá trình khử là?", ["Nhận electron", "Nhường electron", "Nhận neutron", "Tạo proton"], 0, "Khử là quá trình nhận electron."],
  ["Avogadro", "Một mol chứa khoảng bao nhiêu hạt?", ["6,02×10²³", "6,02×10²⁰", "9,8×10²³", "3×10⁸"], 0, "Hằng số Avogadro khoảng 6,02×10²³."],
  ["Fe và CuSO4", "Fe + CuSO4 tạo ra?", ["FeSO4 và Cu", "Fe2O3", "CuO và Fe", "H2SO4"], 0, "Sắt đẩy đồng ra khỏi muối: Fe + CuSO4 → FeSO4 + Cu."],
  ["Đá vôi", "Thành phần chính của đá vôi là?", ["CaCO3", "NaCl", "CaO", "CO"], 0, "Đá vôi chủ yếu chứa calcium carbonate CaCO3."],
  ["Methane", "CH4 là?", ["Methane", "Ethanol", "Ethene", "Acetic acid"], 0, "CH4 là methane."],
  ["Ethanol", "C2H5OH là?", ["Ethanol", "Methane", "Glucose", "Acetic acid"], 0, "C2H5OH là ethanol."],
  ["Este hóa", "Axit + alcohol thường tạo?", ["Este và nước", "Muối và oxygen", "Bazơ", "Kim loại"], 0, "Phản ứng ester hóa tạo este và nước."],
  ["Polymer", "Chất nào là polymer?", ["Polyethylene", "NaCl", "H2O", "CO2"], 0, "Polyethylene là polymer tổng hợp."],
];

const SINH_QUESTIONS = [
  ["Tế bào", "Bào quan thường được gọi là 'nhà máy năng lượng'?", ["Ty thể", "Ribosome", "Lục lạp", "Nhân"], 0, "Ty thể là nơi diễn ra phần lớn quá trình hô hấp tế bào."],
  ["DNA", "Các base của DNA gồm?", ["A, T, G, C", "A, U, G, C", "A, B, C, D", "X, Y, Z, T"], 0, "DNA chứa A, T, G, C."],
  ["Quang hợp", "Quang hợp ở thực vật chủ yếu diễn ra tại?", ["Lục lạp", "Ty thể", "Ribosome", "Không bào"], 0, "Lục lạp chứa chlorophyll và là nơi quang hợp."],
  ["Protein", "Bào quan trực tiếp tham gia tổng hợp protein?", ["Ribosome", "Lysosome", "Không bào", "Trung thể"], 0, "Ribosome là nơi diễn ra quá trình dịch mã."],
  ["Nhiễm sắc thể", "Tế bào soma người bình thường có bao nhiêu NST?", ["46", "23", "44", "48"], 0, "Tế bào soma người có 46 NST, gồm 23 cặp."],
  ["Giao tử", "Giao tử người bình thường có bao nhiêu NST?", ["23", "46", "44", "92"], 0, "Giao tử là tế bào đơn bội, có 23 NST."],
  ["Mendel", "Gregor Mendel nổi tiếng với nghiên cứu?", ["Di truyền học", "Tiến hóa", "Sinh thái học", "Vi sinh"], 0, "Mendel đặt nền móng cho di truyền học."],
  ["Kiểu gen", "Kiểu gen là?", ["Tổ hợp gene của cá thể", "Đặc điểm quan sát được", "Môi trường sống", "Quần thể"], 0, "Kiểu gen là toàn bộ tổ hợp gene của cá thể."],
  ["Alen trội", "Alen trội biểu hiện khi?", ["Có mặt trong kiểu gen theo quy luật tương ứng", "Luôn cần hai bản sao", "Chỉ khi không có môi trường", "Không bao giờ biểu hiện"], 0, "Alen trội có thể biểu hiện ở trạng thái đồng hợp hoặc dị hợp theo quy luật Mendel."],
  ["Hệ sinh thái", "Hệ sinh thái gồm?", ["Thành phần hữu sinh và vô sinh", "Chỉ động vật", "Chỉ thực vật", "Chỉ đất"], 0, "Hệ sinh thái gồm quần xã sinh vật và môi trường vô sinh."],
  ["Chuỗi thức ăn", "Chuỗi thức ăn thường bắt đầu bằng?", ["Sinh vật sản xuất", "Động vật ăn thịt", "Sinh vật phân giải", "Con người"], 0, "Sinh vật sản xuất thường là mắt xích đầu tiên."],
  ["Hô hấp", "Hô hấp tế bào có vai trò chính là?", ["Giải phóng năng lượng", "Tạo ánh sáng", "Tạo đất", "Tạo nước biển"], 0, "Hô hấp tế bào giải phóng năng lượng từ chất hữu cơ."],
  ["Máu", "Hồng cầu có chức năng chính?", ["Vận chuyển oxygen", "Tiêu hóa thức ăn", "Tạo insulin", "Lọc nước tiểu"], 0, "Hemoglobin trong hồng cầu giúp vận chuyển oxygen."],
  ["Tim", "Tim người bình thường có bao nhiêu ngăn?", ["4", "2", "3", "5"], 0, "Tim gồm 2 tâm nhĩ và 2 tâm thất."],
  ["Insulin", "Insulin được tiết ra chủ yếu bởi?", ["Tuyến tụy", "Gan", "Thận", "Tim"], 0, "Tế bào beta ở tuyến tụy tiết insulin."],
  ["Thận", "Đơn vị chức năng của thận là?", ["Nephron", "Neuron", "Alveolus", "Ribosome"], 0, "Nephron là đơn vị cấu tạo và chức năng của thận."],
  ["Darwin", "Charles Darwin nổi tiếng với học thuyết?", ["Tiến hóa bằng chọn lọc tự nhiên", "Tế bào", "Di truyền Mendel", "Vi trùng học"], 0, "Darwin phát triển học thuyết chọn lọc tự nhiên."],
  ["Giảm phân", "Giảm phân tạo ra tế bào có bộ NST?", ["Đơn bội", "Lưỡng bội", "Tam bội", "Tứ bội"], 0, "Giảm phân tạo giao tử đơn bội."],
  ["Đột biến", "Đột biến là?", ["Biến đổi vật chất di truyền", "Biến đổi thời tiết", "Thay đổi thức ăn", "Thay đổi môi trường בלבד"], 0, "Đột biến là biến đổi trong vật chất di truyền."],
  ["Vaccine", "Vaccine có tác dụng chủ yếu là?", ["Kích thích đáp ứng miễn dịch", "Làm tăng đường huyết", "Thay thế máu", "Tiêu hóa protein"], 0, "Vaccine giúp hệ miễn dịch hình thành đáp ứng bảo vệ."],
];

const SU_QUESTIONS = [
  ["1945", "Cách mạng tháng Tám thành công vào năm nào?", ["1945", "1944", "1946", "1954"], 0, "Cách mạng tháng Tám diễn ra năm 1945."],
  ["Điện Biên Phủ", "Chiến thắng Điện Biên Phủ diễn ra năm?", ["1954", "1950", "1953", "1956"], 0, "Chiến thắng Điện Biên Phủ năm 1954."],
  ["Geneva", "Hiệp định Genève về Đông Dương được ký năm?", ["1954", "1950", "1968", "1973"], 0, "Hiệp định Genève được ký năm 1954."],
  ["1975", "Ngày 30/4/1975 gắn với sự kiện nào?", ["Giải phóng miền Nam, thống nhất đất nước", "Đổi mới", "Gia nhập ASEAN", "Tổng tuyển cử 1946"], 0, "Ngày 30/4/1975 đánh dấu thắng lợi của chiến dịch Hồ Chí Minh."],
  ["Độc lập", "Tuyên ngôn Độc lập được đọc ngày nào?", ["2/9/1945", "19/8/1945", "30/4/1975", "7/5/1954"], 0, "Ngày Quốc khánh Việt Nam là 2/9/1945."],
  ["Đảng", "Đảng Cộng sản Việt Nam thành lập năm nào?", ["1930", "1925", "1945", "1954"], 0, "Đảng được thành lập năm 1930."],
  ["Ba Đình", "Tuyên ngôn Độc lập được đọc tại đâu?", ["Quảng trường Ba Đình", "Dinh Độc Lập", "Bến Nhà Rồng", "Quảng trường Lam Sơn"], 0, "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn tại Quảng trường Ba Đình."],
  ["ASEAN", "ASEAN được thành lập năm nào?", ["1967", "1954", "1975", "1986"], 0, "ASEAN thành lập năm 1967."],
  ["Liên Hợp Quốc", "Liên Hợp Quốc được thành lập năm nào?", ["1945", "1939", "1954", "1960"], 0, "Liên Hợp Quốc ra đời năm 1945."],
  ["Đổi mới", "Việt Nam bắt đầu công cuộc Đổi mới từ Đại hội nào?", ["Đại hội VI", "Đại hội IV", "Đại hội VIII", "Đại hội X"], 0, "Đại hội VI năm 1986 đề ra đường lối Đổi mới."],
  ["Bạch Đằng", "Năm 938, Ngô Quyền đánh thắng quân nào trên sông Bạch Đằng?", ["Nam Hán", "Tống", "Mông - Nguyên", "Minh"], 0, "Ngô Quyền đánh bại quân Nam Hán năm 938."],
  ["Lam Sơn", "Khởi nghĩa Lam Sơn bắt đầu năm nào?", ["1418", "1428", "1407", "1471"], 0, "Khởi nghĩa Lam Sơn bắt đầu năm 1418."],
  ["Tây Sơn", "Phong trào Tây Sơn bùng nổ vào năm nào?", ["1771", "1789", "1802", "1750"], 0, "Phong trào Tây Sơn bắt đầu năm 1771."],
  ["Quang Trung", "Chiến thắng Ngọc Hồi - Đống Đa gắn với vua nào?", ["Quang Trung", "Gia Long", "Lê Lợi", "Trần Nhân Tông"], 0, "Quang Trung đại phá quân Thanh năm 1789."],
  ["Pháp xâm lược", "Pháp nổ súng xâm lược Việt Nam năm 1858 tại?", ["Đà Nẵng", "Hà Nội", "Huế", "Sài Gòn"], 0, "Quân Pháp nổ súng tại Đà Nẵng năm 1858."],
  ["Hà Nội", "Ngày 19/8/1945 gắn với sự kiện nào?", ["Khởi nghĩa giành chính quyền ở Hà Nội", "Chiến thắng Điện Biên Phủ", "Ký Hiệp định Paris", "Đổi mới"], 0, "Ngày 19/8/1945, Hà Nội giành chính quyền."],
  ["Chiến tranh", "Chiến tranh Việt Nam kết thúc vào năm?", ["1975", "1973", "1976", "1968"], 0, "Năm 1975 đánh dấu kết thúc chiến tranh."],
  ["TP.HCM", "Sài Gòn - Gia Định được mang tên Thành phố Hồ Chí Minh từ năm?", ["1976", "1975", "1986", "1990"], 0, "Tên Thành phố Hồ Chí Minh được Quốc hội quyết định năm 1976."],
  ["Paris", "Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam ký năm?", ["1973", "1972", "1975", "1968"], 0, "Hiệp định Paris được ký năm 1973."],
  ["ASEAN", "Việt Nam gia nhập ASEAN vào năm nào?", ["1995", "1990", "1986", "2000"], 0, "Việt Nam trở thành thành viên ASEAN năm 1995."],
];

const DIA_QUESTIONS = [
  ["Khí hậu", "Việt Nam có kiểu khí hậu chủ yếu nào?", ["Nhiệt đới gió mùa", "Ôn đới", "Hàn đới", "Hoang mạc"], 0, "Việt Nam nằm trong vùng nhiệt đới gió mùa."],
  ["Đồng bằng", "Đồng bằng sông Hồng nằm chủ yếu ở?", ["Miền Bắc", "Miền Trung", "Tây Nguyên", "Nam Bộ"], 0, "Đồng bằng sông Hồng thuộc khu vực Bắc Bộ."],
  ["Đồng bằng", "Đồng bằng sông Cửu Long nằm ở?", ["Nam Bộ", "Bắc Bộ", "Tây Bắc", "Bắc Trung Bộ"], 0, "Đồng bằng sông Cửu Long nằm ở Nam Bộ."],
  ["Fansipan", "Đỉnh núi cao nhất Việt Nam là?", ["Fansipan", "Bạch Mã", "Ngọc Linh", "Langbiang"], 0, "Fansipan cao khoảng 3.143 m."],
  ["Sông", "Sông nào là một trong những hệ thống sông lớn của miền Bắc?", ["Sông Hồng", "Sông Đồng Nai", "Sông Tiền", "Sông Hậu"], 0, "Sông Hồng là hệ thống sông lớn ở miền Bắc."],
  ["Biển", "Bờ biển Việt Nam dài khoảng bao nhiêu?", ["Hơn 3.000 km", "500 km", "1.000 km", "10.000 km"], 0, "Bờ biển Việt Nam dài khoảng 3.260 km."],
  ["Khu vực", "Việt Nam thuộc khu vực nào của châu Á?", ["Đông Nam Á", "Đông Á", "Nam Á", "Tây Á"], 0, "Việt Nam nằm ở Đông Nam Á."],
  ["Biển Đông", "Việt Nam giáp vùng biển nào?", ["Biển Đông", "Địa Trung Hải", "Biển Đỏ", "Biển Baltic"], 0, "Biển Đông nằm ở phía đông và đông nam Việt Nam."],
  ["Gió mùa", "Gió mùa Đông Bắc ảnh hưởng rõ nhất đến?", ["Miền Bắc", "Đồng bằng sông Cửu Long", "Nam Trung Bộ", "Tây Nguyên"], 0, "Gió mùa Đông Bắc ảnh hưởng mạnh tới miền Bắc."],
  ["Gió mùa", "Gió mùa Tây Nam hoạt động mạnh vào?", ["Mùa hạ", "Mùa đông", "Mùa xuân בלבד", "Quanh năm như nhau"], 0, "Gió mùa Tây Nam chủ yếu hoạt động mùa hạ."],
  ["Tây Nguyên", "Tây Nguyên nổi tiếng với loại đất nào?", ["Đất đỏ bazan", "Đất phù sa", "Đất mặn", "Đất cát"], 0, "Đất đỏ bazan thích hợp với cây công nghiệp lâu năm."],
  ["Nông nghiệp", "Đồng bằng sông Cửu Long là vùng sản xuất mạnh về?", ["Lúa gạo", "Than đá", "Bauxite", "Chè"], 0, "Đây là vùng sản xuất lúa lớn nhất cả nước."],
  ["Dân cư", "Đồng bằng sông Hồng có đặc điểm?", ["Mật độ dân số cao", "Dân cư rất thưa", "Không có đô thị", "Chỉ làm lâm nghiệp"], 0, "Đồng bằng sông Hồng có mật độ dân số cao."],
  ["Rừng", "Bảo vệ rừng có ý nghĩa quan trọng đối với?", ["Bảo vệ đất và nguồn nước", "Tăng sa mạc hóa", "Giảm đa dạng sinh học", "Tăng xói mòn"], 0, "Rừng giúp bảo vệ đất, nước và đa dạng sinh học."],
  ["Đô thị hóa", "Đô thị hóa diễn ra mạnh ở?", ["Các thành phố lớn", "Vùng núi xa xôi", "Đảo hoang", "Nơi không có dân cư"], 0, "Các đô thị lớn có tốc độ đô thị hóa cao."],
  ["Than", "Tỉnh nổi tiếng về khai thác than ở Việt Nam?", ["Quảng Ninh", "Đồng Tháp", "An Giang", "Lâm Đồng"], 0, "Quảng Ninh là vùng than lớn của Việt Nam."],
  ["Bauxite", "Bauxite tập trung nhiều ở?", ["Tây Nguyên", "Đồng bằng sông Hồng", "Đồng bằng sông Cửu Long", "Đông Bắc"], 0, "Tây Nguyên có trữ lượng bauxite lớn."],
  ["Dầu khí", "Dầu khí của Việt Nam tập trung đáng kể ở?", ["Thềm lục địa phía Nam", "Tây Bắc", "Đồng bằng sông Hồng", "Tây Nguyên"], 0, "Dầu khí tập trung nhiều ở thềm lục địa phía Nam."],
  ["Thủy sản", "Nuôi trồng thủy sản phát triển mạnh ở?", ["Đồng bằng sông Cửu Long", "Tây Bắc", "Tây Nguyên", "Đông Bắc"], 0, "ĐBSCL có điều kiện thuận lợi cho nuôi trồng thủy sản."],
  ["Du lịch", "Một lợi thế của du lịch Việt Nam là?", ["Đa dạng khí hậu và cảnh quan", "Chỉ có một mùa", "Không có biển", "Không có di sản"], 0, "Việt Nam có biển, núi, đồng bằng và nhiều cảnh quan đa dạng."],
];

const ANH_QUESTIONS = [
  ["Grammar", "If I were you, I ___ harder.", ["would study", "will study", "studied", "study"], 0, "Câu điều kiện loại 2 dùng would + V."],
  ["Grammar", "She ___ here since 2020.", ["has lived", "lived", "lives", "is living"], 0, "Since + mốc thời gian thường dùng hiện tại hoàn thành."],
  ["Past Simple", "Yesterday, I ___ to school.", ["went", "go", "have gone", "going"], 0, "Yesterday là dấu hiệu của quá khứ đơn."],
  ["Present Perfect", "I ___ my homework.", ["have finished", "finish", "finished yesterday", "am finish"], 0, "Have finished là hiện tại hoàn thành."],
  ["Comparison", "This book is ___ than that one.", ["more interesting", "most interesting", "interestingest", "more interest"], 0, "Tính từ dài dùng more + adjective."],
  ["Superlative", "She is ___ student in the class.", ["the tallest", "taller", "tall", "most tall"], 0, "So sánh nhất dùng the + adjective-est với tính từ ngắn."],
  ["Modal", "You ___ wear a helmet when riding a motorbike.", ["must", "might", "couldn't", "would"], 0, "Must diễn tả sự bắt buộc."],
  ["Passive", "The book ___ by Nam.", ["was written", "wrote", "writes", "is write"], 0, "Bị động quá khứ: was/were + V3."],
  ["Reported Speech", "He said that he ___ tired.", ["was", "is", "will", "be"], 0, "Lùi thì: am/is → was trong câu tường thuật quá khứ."],
  ["Conditional", "If it rains, we ___ home.", ["will stay", "stayed", "would stayed", "stay yesterday"], 0, "Điều kiện loại 1: If + hiện tại, will + V."],
  ["Conjunction", "___ it was raining, we went out.", ["Although", "Because", "So", "Therefore"], 0, "Although diễn tả sự tương phản."],
  ["Reason", "I stayed home ___ I was sick.", ["because", "although", "but", "despite"], 0, "Because dùng để nêu nguyên nhân."],
  ["Plural", "The plural of child is?", ["children", "childs", "childes", "childrens"], 0, "Child → children."],
  ["Advice", "You ___ see a doctor.", ["should", "mustn't", "can't", "wouldn't"], 0, "Should thường dùng để đưa lời khuyên."],
  ["Preposition", "She is interested ___ music.", ["in", "on", "at", "for"], 0, "Cụm đúng: be interested in."],
  ["Expression", "I look forward to ___ you.", ["meeting", "meet", "met", "to meet"], 0, "Look forward to + V-ing."],
  ["Used to", "I used to ___ football.", ["play", "playing", "played", "plays"], 0, "Used to + động từ nguyên mẫu."],
  ["Too...to", "The box is too heavy ___.", ["to carry", "carrying", "carry", "carried"], 0, "Too + adjective + to V."],
  ["Neither", "___ Tom nor Mary is here.", ["Neither", "Either", "Both", "All"], 0, "Neither...nor mang nghĩa không... cũng không."],
  ["Vocabulary", "Which word means the natural world around us?", ["environment", "equipment", "employment", "entertainment"], 0, "Environment = môi trường."],
];

const GDCD_QUESTIONS = [
  ["Pháp luật", "Hiến pháp được hiểu là?", ["Luật cơ bản của Nhà nước", "Một nội quy lớp học", "Một hợp đồng", "Một quyển sách giáo khoa"], 0, "Hiến pháp là luật cơ bản của Nhà nước."],
  ["Bình đẳng", "Bình đẳng trước pháp luật có nghĩa là?", ["Mọi người có quyền và nghĩa vụ theo quy định pháp luật", "Không cần tuân thủ luật", "Chỉ người giàu mới có quyền", "Chỉ cán bộ mới chịu trách nhiệm"], 0, "Mọi người đều bình đẳng trước pháp luật trong phạm vi quy định."],
  ["Tự do", "Quyền tự do ngôn luận phải được thực hiện như thế nào?", ["Trong khuôn khổ pháp luật", "Muốn nói gì cũng được", "Không cần tôn trọng người khác", "Có thể xâm phạm bí mật người khác"], 0, "Quyền tự do luôn gắn với giới hạn do pháp luật quy định."],
  ["Thuế", "Thuế là khoản đóng góp như thế nào?", ["Bắt buộc theo quy định pháp luật", "Hoàn toàn tự nguyện", "Chỉ dành cho học sinh", "Chỉ doanh nghiệp mới đóng"], 0, "Thuế là khoản nộp theo quy định của pháp luật."],
  ["Giao thông", "Khi đèn đỏ bật, người tham gia giao thông phải?", ["Dừng lại", "Tăng tốc", "Đi ngược chiều", "Bấm còi liên tục"], 0, "Đèn đỏ báo hiệu phải dừng."],
  ["Hợp đồng", "Hợp đồng là sự thỏa thuận nhằm?", ["Xác lập quyền và nghĩa vụ", "Xóa mọi trách nhiệm", "Không có giá trị", "Thay thế Hiến pháp"], 0, "Hợp đồng tạo lập quyền và nghĩa vụ giữa các bên."],
  ["Nhân phẩm", "Tôn trọng nhân phẩm người khác là?", ["Ứng xử đúng mực và không xúc phạm", "Đăng thông tin riêng tư", "Chế giễu người khác", "Bịa đặt thông tin"], 0, "Mỗi người cần tôn trọng danh dự và nhân phẩm của người khác."],
  ["Đời tư", "Thông tin đời tư của người khác nên được?", ["Tôn trọng và bảo vệ theo pháp luật", "Tự ý đăng lên mạng", "Bán cho người khác", "Công khai mọi lúc"], 0, "Đời tư và dữ liệu cá nhân cần được tôn trọng."],
  ["Môi trường", "Bảo vệ môi trường là trách nhiệm của?", ["Mọi cá nhân và tổ chức", "Chỉ công ty môi trường", "Chỉ học sinh", "Chỉ Nhà nước"], 0, "Bảo vệ môi trường là trách nhiệm chung."],
  ["Trung thực", "Trung thực trong học tập thể hiện qua?", ["Tự làm bài, không gian lận", "Chép bài", "Mua điểm", "Nhờ người thi hộ"], 0, "Trung thực là một phẩm chất đạo đức quan trọng."],
  ["Khoan dung", "Khoan dung là?", ["Tôn trọng và biết tha thứ phù hợp", "Chấp nhận mọi hành vi phạm luật", "Không quan tâm ai", "Luôn đồng ý với mọi người"], 0, "Khoan dung không đồng nghĩa với bỏ qua hành vi trái pháp luật."],
  ["Quyền và nghĩa vụ", "Quyền của công dân thường đi kèm với?", ["Nghĩa vụ và trách nhiệm", "Không có trách nhiệm", "Đặc quyền tuyệt đối", "Miễn tuân thủ pháp luật"], 0, "Quyền và nghĩa vụ của công dân gắn bó với nhau."],
  ["Tự vệ", "Phòng vệ chính đáng cần được thực hiện?", ["Trong giới hạn pháp luật cho phép", "Bằng mọi cách", "Không có giới hạn", "Bất kể hậu quả"], 0, "Phòng vệ phải phù hợp quy định pháp luật."],
  ["Tài sản", "Quyền sở hữu thường gồm?", ["Chiếm hữu, sử dụng, định đoạt", "Chỉ mua bán", "Chỉ sử dụng", "Chỉ cất giữ"], 0, "Ba quyền cơ bản là chiếm hữu, sử dụng và định đoạt."],
  ["Người tiêu dùng", "Khi mua hàng, người tiêu dùng nên?", ["Kiểm tra thông tin và hóa đơn", "Không cần xem sản phẩm", "Đưa mật khẩu ngân hàng", "Bỏ qua nguồn gốc"], 0, "Kiểm tra thông tin giúp bảo vệ quyền lợi người tiêu dùng."],
  ["Bình đẳng giới", "Bình đẳng giới hướng tới?", ["Cơ hội và quyền bình đẳng", "Một giới có mọi quyền", "Phân biệt nghề nghiệp", "Hạn chế cơ hội"], 0, "Bình đẳng giới nhằm bảo đảm quyền và cơ hội bình đẳng."],
  ["Mạng xã hội", "Khi sử dụng mạng xã hội nên?", ["Tôn trọng pháp luật và quyền riêng tư", "Đăng mọi thông tin cá nhân của người khác", "Lan truyền tin chưa kiểm chứng", "Mạo danh người khác"], 0, "Ứng xử trên mạng cũng cần tuân thủ pháp luật."],
  ["Tình nguyện", "Hoạt động tình nguyện thường thể hiện?", ["Tinh thần tự nguyện và trách nhiệm cộng đồng", "Ép buộc", "Vụ lợi bắt buộc", "Trốn tránh trách nhiệm"], 0, "Tình nguyện hướng tới đóng góp cho cộng đồng trên tinh thần tự nguyện."],
  ["Nhà nước pháp quyền", "Trong Nhà nước pháp quyền, ai phải tuân thủ pháp luật?", ["Mọi tổ chức và cá nhân", "Chỉ người dân", "Chỉ doanh nghiệp", "Chỉ học sinh"], 0, "Mọi cá nhân, tổ chức đều phải tuân thủ pháp luật."],
  ["Trách nhiệm", "Khi làm sai, thái độ phù hợp là?", ["Nhận trách nhiệm và khắc phục", "Đổ lỗi cho người khác", "Che giấu", "Xóa bằng chứng"], 0, "Nhận trách nhiệm và khắc phục là cách ứng xử tích cực."],
];

const MEO_QUESTIONS = [
  ["Câu đố", "Thứ gì có rất nhiều phím nhưng không mở được ổ khóa?", ["Bàn phím", "Chìa khóa", "Cửa", "Tủ"], 0, "Bàn phím có nhiều phím nhưng không phải chìa khóa."],
  ["Câu đố", "Thứ gì đi lên đi xuống nhưng không di chuyển?", ["Cầu thang", "Xe máy", "Thang máy", "Con người"], 0, "Cầu thang có hướng lên xuống nhưng đứng yên."],
  ["Câu đố", "Cái gì có kim và mặt nhưng không có tay?", ["Đồng hồ", "Con mèo", "Cái bàn", "Cái kéo"], 0, "Đồng hồ có kim và mặt đồng hồ."],
  ["Câu đố", "Cái gì có cổ nhưng không có đầu?", ["Cái chai", "Con người", "Con ngựa", "Cái bàn"], 0, "Chai có phần cổ chai."],
  ["Câu đố", "Cái gì càng lau càng ướt?", ["Khăn", "Bàn", "Sàn", "Giấy"], 0, "Khăn lau nước sẽ bị ướt."],
  ["Câu đố", "Cái gì có một mắt nhưng không nhìn thấy?", ["Cây kim", "Con mèo", "Con chim", "Cái cốc"], 0, "Kim khâu có mắt kim."],
  ["Câu đố", "Cái gì có răng nhưng không cắn?", ["Cái lược", "Con chó", "Cá mập", "Con ngựa"], 0, "Lược có các răng lược."],
  ["Câu đố", "Cái gì có thành phố, sông nhưng không có người và nước thật?", ["Bản đồ", "Quyển sách", "Điện thoại", "Tivi"], 0, "Bản đồ có ký hiệu thành phố và sông."],
  ["Câu đố", "Cái gì có nhiều chữ nhưng không biết nói?", ["Quyển sách", "Con người", "Điện thoại", "Radio"], 0, "Sách có chữ nhưng không tự nói."],
  ["Câu đố", "Tháng nào cũng có ít nhất 28 ngày?", ["Tất cả các tháng", "Tháng 2 בלבד", "Tháng 1", "Tháng 12"], 0, "Mọi tháng đều có ít nhất 28 ngày."],
  ["Câu đố", "Thứ gì đi vòng quanh thế giới nhưng vẫn nằm ở một góc?", ["Tem thư", "Máy bay", "Xe", "Con tàu"], 0, "Tem nằm ở góc phong bì nhưng có thể đi khắp thế giới."],
  ["Câu đố", "Cái gì có chân nhưng không đi?", ["Cái bàn", "Con chó", "Con mèo", "Con người"], 0, "Bàn có chân bàn."],
  ["Câu đố", "Cái gì có thể bắt nhưng không thể ném?", ["Cảm lạnh", "Quả bóng", "Con cá", "Chiếc túi"], 0, "Ta có thể 'catch a cold'."],
  ["Câu đố", "Thứ gì thuộc về bạn nhưng người khác dùng nhiều hơn?", ["Tên của bạn", "Đôi giày", "Xe của bạn", "Nhà bạn"], 0, "Người khác thường gọi tên bạn nhiều hơn chính bạn."],
  ["Câu đố", "Cái gì có mặt và hai tay nhưng không có chân?", ["Đồng hồ", "Cái ghế", "Con người", "Cái kéo"], 0, "Đồng hồ có mặt và hai kim."],
  ["Câu đố", "Cái gì có rất nhiều lỗ nhưng vẫn giữ được nước?", ["Miếng bọt biển", "Cái rổ", "Cái lưới", "Cái sàng"], 0, "Bọt biển có nhiều lỗ nhỏ nhưng giữ nước."],
  ["Câu đố", "Cái gì có thể bị phá vỡ mà không cần chạm vào?", ["Lời hứa", "Cái ly", "Cánh cửa", "Chiếc bàn"], 0, "Ta có thể phá vỡ một lời hứa."],
  ["Câu đố", "Cái gì rơi xuống nhưng không bao giờ đi lên?", ["Mưa", "Bóng", "Khói", "Bóng bay"], 0, "Mưa rơi xuống mặt đất."],
  ["Câu đố", "Cái gì có đầu và đuôi nhưng không có thân?", ["Đồng xu", "Con cá", "Con rắn", "Cái chai"], 0, "Đồng xu có mặt đầu và mặt đuôi."],
  ["Câu đố", "Càng lấy đi nhiều thì nó càng lớn là gì?", ["Cái hố", "Cái túi", "Cái hộp", "Đống sách"], 0, "Càng đào lấy đất thì cái hố càng lớn."],
];


const HSK4_QUESTIONS = [
  ["词汇", "“安排”最接近下面哪个意思？", ["计划并确定", "马上离开", "认真批评", "突然发现"], 0, "安排表示对事情进行计划、布置和确定。"],
  ["词汇", "“丰富”最接近下面哪个意思？", ["内容多、种类多", "速度很慢", "价格很低", "距离很远"], 0, "丰富表示种类、内容或数量很多。"],
  ["词汇", "“适合”最接近下面哪个意思？", ["合适、符合需要", "特别便宜", "马上完成", "非常危险"], 0, "适合表示符合某人的情况或需要。"],
  ["词汇", "“负责”最接近下面哪个意思？", ["承担责任", "得到奖励", "改变计划", "提出问题"], 0, "负责表示承担某项工作或责任。"],
  ["词汇", "“及时”最接近下面哪个意思？", ["在需要的时候马上做", "每天重复做", "提前很多年", "慢慢地做"], 0, "及时强调在合适、需要的时候迅速处理。"],
  ["词汇", "“耐心”最接近下面哪个意思？", ["能够不着急地坚持", "非常喜欢竞争", "容易感到害怕", "总是改变意见"], 0, "耐心表示做事不急躁，能够坚持。"],
  ["词汇", "“顺便”最接近下面哪个意思？", ["做一件事时另外做另一件相关的事", "专门花很多时间做", "完全不想做", "重新开始做"], 0, "顺便表示在做主要事情时同时做另一件事。"],
  ["词汇", "“估计”最接近下面哪个意思？", ["根据情况推测", "亲自证明", "完全忘记", "马上拒绝"], 0, "估计表示根据已有情况进行推测。"],
  ["词汇", "“提供”最接近下面哪个意思？", ["给别人需要的东西或条件", "把东西藏起来", "拒绝帮助别人", "把东西弄坏"], 0, "提供表示把需要的东西、信息或条件给别人。"],
  ["词汇", "“区别”最接近下面哪个意思？", ["不同之处", "共同目标", "最后结果", "工作机会"], 0, "区别表示两个或多个事物之间的不同。"],
  ["语法", "我已经等了你半个小时，你怎么还____？", ["没来", "不来过", "没有来着", "来不了过"], 0, "表示到现在仍然没有来，用“还没来”最自然。"],
  ["语法", "他每天____七点开始上班。", ["在", "从", "到", "把"], 0, "“在七点开始上班”表示动作开始的时间。"],
  ["语法", "如果明天下雨，我们____在家学习。", ["就", "才", "再", "又"], 0, "“如果……就……”表示条件关系。"],
  ["语法", "这件衣服太贵了，____便宜一点儿？", ["能不能", "是不是", "有没有", "会不会"], 0, "“能不能便宜一点儿”用于礼貌地询问能否降价。"],
  ["语法", "她不仅会说汉语，____会说英语。", ["还", "才", "就", "又"], 0, "“不仅……还……”表示递进关系。"],
  ["语法", "我把作业____老师了。", ["交给", "经过", "来自", "关于"], 0, "“把作业交给老师”是常见搭配。"],
  ["语法", "会议____下午三点开始。", ["将在", "已经是", "刚才把", "一直被"], 0, "“将在”表示将来的时间或安排。"],
  ["语法", "他汉语说得____流利。", ["非常", "很地", "得很地", "是地"], 0, "“说得非常流利”中“非常”修饰“流利”。"],
  ["语法", "我昨天买____一本很有意思的小说。", ["了", "着", "过", "得"], 0, "“买了一本”表示动作已经完成。"],
  ["语法", "她一边听音乐，____做作业。", ["一边", "又", "才", "只"], 0, "“一边……一边……”表示两个动作同时进行。"],
  ["阅读", "小王每天坐地铁上班。他觉得坐地铁很方便，因为不用担心堵车。根据短文，小王为什么喜欢坐地铁？", ["因为比较方便", "因为可以开车", "因为票很贵", "因为离公司很远"], 0, "短文直接说明坐地铁方便，而且不用担心堵车。"],
  ["阅读", "李老师周末喜欢做饭。星期六上午，他去市场买了鱼、蔬菜和水果，下午在家做了一顿晚饭。李老师星期六下午做什么？", ["在家做饭", "去学校上课", "去旅行", "去看电影"], 0, "短文说下午他在家做了一顿晚饭。"],
  ["阅读", "小张最近工作很忙，所以每天晚上都会提前安排第二天的事情。这样做让他觉得工作更有条理。提前安排有什么好处？", ["让工作更有条理", "让工作更困难", "让每天睡得更晚", "让事情越来越少"], 0, "短文最后指出这样做让工作更有条理。"],
  ["阅读", "王老师提醒学生，考试前不要只看书，还应该保证充足的睡眠。根据这句话，考试前学生还应该注意什么？", ["睡眠", "买新书", "减少吃饭", "每天旅行"], 0, "王老师特别提醒要保证充足的睡眠。"],
  ["阅读", "这家餐厅中午十二点开始营业，晚上九点结束营业。小陈晚上八点半到餐厅吃饭，他还能进去吗？", ["可以", "不可以", "只有周末可以", "只有老板同意才可以"], 0, "晚上八点半还没有到九点，餐厅仍在营业。"],
  ["阅读", "小美搬到新城市以后，主动参加社区活动，很快认识了很多新朋友。她是怎么认识新朋友的？", ["参加社区活动", "每天待在家里", "换了工作", "买了新房子"], 0, "短文明确说她主动参加社区活动，因此认识了很多朋友。"],
  ["阅读", "医生告诉小赵，感冒以后应该多喝水、多休息。如果发烧严重，就应该及时去医院。根据医生的建议，发烧严重时应该怎么办？", ["及时去医院", "继续熬夜", "少喝水", "马上运动"], 0, "医生建议发烧严重时及时去医院。"],
  ["阅读", "小刘原来每天开车上班，后来为了保护环境，他开始骑自行车。虽然路上花的时间多了一点，但是他觉得身体更健康了。小刘为什么开始骑自行车？", ["为了保护环境", "为了买新车", "因为公司要求", "因为自行车更快"], 0, "短文明确说明他为了保护环境开始骑自行车。"],
  ["阅读", "学校下周举办中文演讲比赛，报名截止时间是星期五下午五点。小林星期五下午四点半报名，他能参加比赛吗？", ["能", "不能", "只能明年参加", "必须星期四报名"], 0, "四点半还早于五点，仍在报名截止时间之前。"],
  ["阅读", "天气预报说明天上午有大雨，因此学校把户外活动改到了体育馆。学校为什么改变活动地点？", ["因为可能下大雨", "因为体育馆关闭", "因为学生太少", "因为天气很热"], 0, "天气预报说明上午有大雨，所以活动改到室内。"],
  ["词汇", "“建议”最接近下面哪个意思？", ["提出意见供别人参考", "命令别人必须做", "忘记以前的事情", "拒绝别人帮助"], 0, "建议是提出意见或办法供别人参考。"],
  ["词汇", "“继续”最接近下面哪个意思？", ["接着做下去", "马上停止", "重新购买", "提前结束"], 0, "继续表示不中断，接着进行。"],
  ["词汇", "“准确”最接近下面哪个意思？", ["正确而没有明显误差", "速度非常快", "声音很大", "价格很高"], 0, "准确表示正确、没有明显误差。"],
  ["词汇", "“复杂”最接近下面哪个意思？", ["内容多而不简单", "非常容易", "距离很近", "颜色很淡"], 0, "复杂表示情况或结构比较多，不简单。"],
  ["语法", "你吃完饭____给我打电话吧。", ["以后", "以前", "之间", "附近"], 0, "“……以后”表示某个动作完成之后。"],
  ["语法", "他跑得太快了，我____不上他。", ["追", "被", "把", "向"], 0, "“追不上”表示无法追到。"],
  ["语法", "这本书____我借给你的，你看完了吗？", ["是", "被", "把", "让"], 0, "“这本书是我借给你的”使用“是……的”结构说明动作关系。"],
  ["语法", "虽然今天很冷，____他还是去跑步了。", ["但是", "所以", "因为", "或者"], 0, "“虽然……但是……”表示转折关系。"],
  ["语法", "只要你认真学习，____一定会有进步。", ["就", "才", "又", "再"], 0, "“只要……就……”表示条件关系。"],
  ["词汇", "“经历”通常指什么？", ["亲身经历过的事情", "未来的计划", "别人送的礼物", "没有发生的故事"], 0, "经历可以指亲身体验过的事情，也可作动词表示亲身经过。"],
  ["词汇", "“熟悉”最接近下面哪个意思？", ["了解得比较多", "完全不知道", "特别害怕", "马上忘记"], 0, "熟悉表示对人或事物了解得比较多。"],
  ["词汇", "“减少”最接近下面哪个意思？", ["变少", "变大", "变快", "变亮"], 0, "减少表示数量、程度等变少。"],
  ["词汇", "“及时”与哪个词意思相反？", ["拖延", "马上", "按时", "尽快"], 0, "拖延表示把事情往后推，与及时相反。"],
  ["语法", "他已经三年没有____北京了。", ["去过", "去着", "去得", "去了过"], 0, "“三年没有去过北京”表示过去到现在没有这样的经历。"],
  ["语法", "老师让我们____教室里安静地读书。", ["在", "从", "被", "把"], 0, "地点“教室里”前使用“在”。"],
  ["语法", "请你____这件事告诉我。", ["把", "被", "从", "向"], 0, "“把这件事告诉我”是典型的把字句。"],
  ["语法", "他今天没有来，____生病了。", ["可能", "一定是", "只要", "虽然"], 0, "“可能”表示推测，语气比“一定”弱。"],
  ["阅读", "小陈发现自己的汉字写得不太好，所以每天晚上练习二十分钟。一个月以后，他的字明显漂亮了。小陈为什么每天练字？", ["因为汉字写得不太好", "因为考试已经结束", "因为朋友要求", "因为没有别的事情"], 0, "他发现自己的汉字写得不好，所以坚持练习。"],
  ["阅读", "公司规定员工上班时间是上午九点。小王今天八点四十分到公司，先喝了一杯咖啡，然后开始工作。他是否迟到？", ["没有迟到", "迟到了", "下午才知道", "无法判断"], 0, "八点四十分早于九点，因此没有迟到。"],
  ["阅读", "小周准备旅行时，不但带了衣服，还提前查了天气和交通情况。这样可以让旅行更加顺利。小周为什么提前查这些信息？", ["让旅行更加顺利", "为了取消旅行", "为了买更多衣服", "为了晚一点出发"], 0, "提前了解天气和交通有助于顺利旅行。"],
];

const HSK5_QUESTIONS = [
  ["词汇", "“承担”最接近下面哪个意思？", ["接受并负责某项任务或责任", "把事情完全忘记", "拒绝所有帮助", "马上离开某地"], 0, "承担表示接受并负责某项责任、任务或费用。"],
  ["词汇", "“促进”最接近下面哪个意思？", ["推动某事发展", "阻止某事发生", "隐藏重要信息", "降低所有价格"], 0, "促进表示推动事物向前发展。"],
  ["词汇", "“维持”最接近下面哪个意思？", ["使某种状态继续保持", "彻底改变", "马上结束", "重新开始"], 0, "维持表示使某种状态继续存在。"],
  ["词汇", "“逐渐”最接近下面哪个意思？", ["慢慢地发生变化", "突然发生", "从来没有发生", "故意停止"], 0, "逐渐表示变化一步一步地发生。"],
  ["词汇", "“显著”最接近下面哪个意思？", ["明显而突出", "非常隐蔽", "完全相同", "没有意义"], 0, "显著表示非常明显、突出。"],
  ["词汇", "“忽视”最接近下面哪个意思？", ["不注意、不重视", "认真研究", "积极帮助", "及时发现"], 0, "忽视表示没有注意或没有重视。"],
  ["词汇", "“采取措施”中的“措施”最接近什么？", ["为解决问题而采取的办法", "天气变化", "个人爱好", "旅行路线"], 0, "措施是为解决问题或达到目的而采取的方法。"],
  ["词汇", "“具备”最接近下面哪个意思？", ["具有某种条件或能力", "暂时失去", "主动放弃", "马上借给别人"], 0, "具备表示已经具有某种条件、能力或资格。"],
  ["词汇", "“稳定”最接近下面哪个意思？", ["保持相对平稳、不容易变化", "变化特别快", "完全无法控制", "突然消失"], 0, "稳定表示状态平稳，不容易发生大的变化。"],
  ["词汇", "“现象”最接近下面哪个意思？", ["可以观察到的事情或表现", "秘密计划", "个人姓名", "未来收入"], 0, "现象指可以观察到的事情、状态或表现。"],
  ["语法", "他明明知道答案，____故意不说。", ["却", "因此", "否则", "于是"], 0, "“明明……却……”表示事实与预期相反。"],
  ["语法", "这项工作看起来很简单，实际上比我们想象的____复杂。", ["要", "才", "被", "向"], 0, "“比……要……”可以表示比较中的程度。"],
  ["语法", "____天气不好，比赛还是按计划举行了。", ["尽管", "由于", "既然", "只要"], 0, "“尽管……还是……”表示让步关系。"],
  ["语法", "他为了提高效率，____每天早上提前半小时到办公室。", ["宁可", "索性", "干脆", "决定"], 3, "“决定每天早到”表示作出决定。"],
  ["语法", "与其坐在这里抱怨，____想办法解决问题。", ["不如", "否则", "甚至", "以免"], 0, "“与其……不如……”用于比较两种选择。"],
  ["语法", "他不仅完成了任务，____主动帮助了其他同事。", ["而且", "反而", "否则", "尽管"], 0, "“不仅……而且……”表示递进。"],
  ["语法", "为了避免____误会，我们最好把情况解释清楚。", ["产生", "得到", "接受", "通过"], 0, "“产生误会”是常见搭配。"],
  ["语法", "这件事一旦决定下来，____不能轻易改变。", ["就", "才", "再", "又"], 0, "“一旦……就……”表示条件一出现，结果随之发生。"],
  ["语法", "他把报告修改了好几遍，____达到要求。", ["直到", "由于", "即使", "除非"], 0, "“直到达到要求”表示动作持续到某个结果出现。"],
  ["语法", "她宁愿自己辛苦一点儿，____给别人增加麻烦。", ["也不", "而且", "所以", "甚至"], 0, "“宁愿……也不……”表示选择前者而拒绝后者。"],
  ["阅读", "近年来，越来越多的人选择线上学习。它不受地点限制，学生可以根据自己的时间安排课程。不过，线上学习也要求学生有较强的自律能力。根据短文，线上学习有什么要求？", ["需要较强的自律能力", "必须每天去学校", "不能自己安排时间", "只能在晚上学习"], 0, "短文最后指出线上学习要求学生有较强的自律能力。"],
  ["阅读", "某公司调查发现，员工午休后工作效率通常会有所提高。因此，公司决定适当延长午休时间。公司为什么这样决定？", ["因为午休有助于提高工作效率", "因为员工不愿意工作", "因为公司没有工作", "因为下午不用上班"], 0, "调查发现午休后工作效率提高，因此公司延长午休。"],
  ["阅读", "研究人员发现，城市绿地不仅能够改善空气质量，还能为居民提供休闲空间。因此，一些城市开始增加公园和公共绿地。根据短文，城市为什么增加绿地？", ["因为绿地有多种作用", "因为绿地会减少休闲活动", "因为居民不喜欢公园", "因为空气质量不重要"], 0, "绿地可以改善空气质量并提供休闲空间，因此城市增加绿地。"],
  ["阅读", "小赵毕业后没有马上找工作，而是花了半年时间学习数据分析。半年后，他成功进入一家互联网公司。根据短文，小赵为什么花时间学习数据分析？", ["为了提高就业能力", "为了推迟毕业", "因为公司要求他辞职", "为了减少学习时间"], 0, "结合结果可以看出，他通过学习数据分析提升就业能力。"],
  ["阅读", "虽然这家书店面积不大，但是书籍分类非常清楚，而且工作人员服务热情，所以每天都有不少顾客。书店为什么有不少顾客？", ["分类清楚且服务热情", "面积非常大", "书籍特别少", "工作人员很少"], 0, "短文列出了书籍分类清楚和服务热情两个原因。"],
  ["阅读", "专家指出，运动并不一定要进行很长时间，关键是保持规律。每周进行几次适量运动，也能给身体带来积极影响。专家强调什么？", ["运动应该保持规律", "运动必须持续几个小时", "只有高强度运动才有效", "运动次数越少越好"], 0, "专家强调的重点是规律运动，而不是一次运动很长时间。"],
  ["阅读", "由于今年夏天气温较高，城市用电量明显增加。为了保证居民正常用电，当地电力部门呼吁大家合理使用空调。根据短文，电力部门为什么提出建议？", ["因为高温导致用电量增加", "因为居民没有空调", "因为冬天气温下降", "因为电价完全不变"], 0, "高温导致用电量增加，因此电力部门呼吁合理用电。"],
  ["阅读", "小林原本计划周末去爬山，但出发前发现天气预报有暴雨，于是改成去博物馆。他改变计划的主要原因是什么？", ["天气可能有暴雨", "博物馆距离更远", "朋友不喜欢爬山", "他忘了带鞋"], 0, "暴雨预报使他放弃户外爬山，改去博物馆。"],
  ["阅读", "一项调查显示，人们在购买电子产品时越来越重视售后服务，而不仅仅关注价格。这说明消费者的需求正在发生变化。根据调查，消费者越来越重视什么？", ["售后服务", "产品颜色", "广告数量", "包装大小"], 0, "调查直接指出消费者越来越重视售后服务。"],
  ["阅读", "为了减少塑料垃圾，学校在食堂推广可重复使用的餐具。刚开始有些学生不习惯，但一段时间后，大多数学生都接受了这种方式。根据短文，学校推广餐具的目的是什么？", ["减少塑料垃圾", "增加塑料使用", "让学生少吃饭", "提高餐具价格"], 0, "学校推广可重复使用餐具是为了减少塑料垃圾。"],
  ["词汇", "“趋势”最接近下面哪个意思？", ["事物发展的方向", "突然发生的错误", "个人的秘密", "固定不变的价格"], 0, "趋势表示事物发展变化的方向。"],
  ["词汇", "“逐步”与哪个词意思最接近？", ["逐渐", "突然", "完全", "立刻"], 0, "逐步和逐渐都表示一步一步地发生变化。"],
  ["词汇", "“妨碍”最接近下面哪个意思？", ["阻碍事情顺利进行", "帮助事情完成", "提前安排工作", "认真总结经验"], 0, "妨碍表示阻碍、影响某件事情正常进行。"],
  ["词汇", "“充分”最接近下面哪个意思？", ["足够、充足", "完全没有", "非常突然", "不太准确"], 0, "充分表示数量或程度足够。"],
  ["词汇", "“针对”最接近下面哪个意思？", ["对准某个对象或问题", "离开某个地方", "忘记某件事情", "取消所有计划"], 0, "针对表示对准某个对象、情况或问题采取行动。"],
  ["词汇", "“逐渐改善”中的“改善”最接近什么？", ["使情况变得更好", "让问题变严重", "完全停止工作", "把东西藏起来"], 0, "改善表示使原来的情况变得更好。"],
  ["语法", "无论遇到什么困难，他____没有放弃。", ["都", "才", "再", "又"], 0, "“无论……都……”表示在任何条件下结果都相同。"],
  ["语法", "除非你提前预约，____不能参加这次活动。", ["否则", "虽然", "即使", "于是"], 0, "“除非……否则……”表示必要条件。"],
  ["语法", "他刚到家，电话____响了起来。", ["就", "才", "再", "却"], 0, "“刚……就……”表示两个动作发生时间非常接近。"],
  ["语法", "她忙____连午饭都没有时间吃。", ["得", "地", "的", "着"], 0, "“忙得连午饭都没有时间吃”使用“形容词/动词+得+结果”结构。"],
  ["语法", "这个问题不是你想象的____简单。", ["那么", "怎么", "哪里", "多少"], 0, "“不是……那么……”表示程度没有想象中那么高。"],
  ["语法", "经过几个月的训练，他终于____了比赛。", ["适应", "适合", "适当", "适量"], 0, "“适应比赛”表示逐渐能够适应比赛环境和要求。"],
  ["阅读", "为了提高会议效率，经理要求大家提前阅读材料，并把问题写下来。这样开会时就可以直接讨论重点。经理这样安排的目的是什么？", ["提高会议效率", "延长会议时间", "减少会议内容", "取消讨论"], 0, "提前准备材料可以让会议直接讨论重点，从而提高效率。"],
  ["阅读", "这项新政策实施以后，小企业获得了更多培训机会。许多企业负责人表示，这些培训帮助他们解决了经营中的实际问题。培训带来了什么作用？", ["帮助解决实际经营问题", "增加企业税收", "减少培训机会", "让企业停止经营"], 0, "企业负责人表示培训帮助他们解决实际经营问题。"],
  ["阅读", "很多人认为阅读纸质书和电子书各有优点。纸质书阅读体验比较稳定，而电子书方便携带、查找和保存。根据短文，电子书的优点之一是什么？", ["方便携带和查找", "一定比纸质书便宜", "不能保存", "阅读体验一定更差"], 0, "短文明确提到电子书方便携带、查找和保存。"],
  ["阅读", "某社区发现老人独居的情况越来越多，于是建立了志愿者联系制度。志愿者会定期打电话或上门了解老人的情况。社区建立这一制度的主要目的是什么？", ["加强对独居老人的关心", "增加老人独居人数", "减少志愿者活动", "让老人搬家"], 0, "志愿者通过联系和探访关心独居老人。"],
  ["阅读", "研究表明，学习一门新语言需要长期积累。每天学习一点儿，比偶尔一次学习很长时间更容易形成稳定的学习习惯。根据短文，怎样学习更容易形成习惯？", ["每天坚持一点儿", "偶尔学习很长时间", "完全不做计划", "只在考试前学习"], 0, "短文强调每天坚持一点儿更容易形成稳定习惯。"],
  ["词汇", "“实施”最接近下面哪个意思？", ["正式执行某项计划或政策", "讨论但不行动", "取消已经制定的计划", "把问题隐藏起来"], 0, "实施表示把计划、政策等正式执行起来。"],
  ["词汇", "“意识到”最接近下面哪个意思？", ["认识到某件事情", "故意忘记某件事情", "马上解决问题", "拒绝接受建议"], 0, "意识到表示认识、察觉到某种情况。"],
  ["词汇", "“效率”通常指什么？", ["完成事情的速度和效果", "物品的颜色", "一个人的身高", "天气的温度"], 0, "效率通常表示完成工作所达到的效果与所花时间、资源之间的关系。"],
];



/* =========================================================
   ENGLISH B1-B2 QUESTION BANKS
   9 CATEGORIES × 20 QUESTIONS = 180 QUESTIONS
========================================================= */

const INVERSION_QUESTIONS = [
  ["Grammar", "Only after the meeting did I realize how serious the problem was.", ["Only after the meeting did I realize", "Only after the meeting I realized", "Only after did I realize the meeting", "Only the meeting after I realized"], 0, "After a negative/restrictive expression such as 'only after' comes first, auxiliary inversion is required."],
  ["Grammar", "Rarely _____ such a beautiful view.", ["have I seen", "I have seen", "did I saw", "I saw have"], 0, "After 'rarely' at the beginning, use subject-auxiliary inversion: 'have I seen'."],
  ["Grammar", "Never _____ such a difficult decision before.", ["had she faced", "she had faced", "did she faced", "has she face"], 0, "'Never' at the beginning triggers inversion: 'had she faced'."],
  ["Grammar", "Not until midnight _____ the missing document.", ["did they find", "they found", "they did find", "found they"], 0, "'Not until...' at the beginning requires 'did + subject + base verb'."],
  ["Grammar", "Under no circumstances _____ confidential information.", ["should you share", "you should share", "should share you", "you share should"], 0, "'Under no circumstances' triggers inversion with the modal 'should'."],
  ["Grammar", "No sooner _____ home than the phone rang.", ["had he arrived", "he had arrived", "did he arrive", "he arrived had"], 0, "The structure is 'No sooner had + subject + past participle + than...'."],
  ["Grammar", "Hardly _____ when the lights went out.", ["had we started", "we had started", "did we started", "we started had"], 0, "The structure is 'Hardly had + subject + past participle + when...'."],
  ["Grammar", "Little _____ that the decision would change everything.", ["did we know", "we knew", "we did know", "knew we did"], 0, "'Little did we know' is a standard inverted structure."],
  ["Grammar", "Only by working together _____ solve the problem.", ["can we", "we can", "can", "we"], 0, "'Only by...' at the beginning requires inversion: 'can we'."],
  ["Grammar", "Not only _____ late, but he also forgot the documents.", ["was he", "he was", "did he was", "was"], 0, "'Not only' at the beginning requires inversion."],
  ["Grammar", "Seldom _____ to work on Sundays.", ["does she have to go", "she has to go", "has she to go", "does she has to go"], 0, "With 'seldom', use auxiliary 'does' + subject + base verb."],
  ["Grammar", "Only when the results arrived _____ the researchers celebrate.", ["did the researchers", "the researchers did", "did researchers the", "the researchers"], 0, "'Only when...' requires inversion in the main clause."],
  ["Grammar", "Nowhere else _____ such a peaceful atmosphere.", ["can you find", "you can find", "can find you", "you find can"], 0, "After 'nowhere else', inversion is used."],
  ["Grammar", "At no time _____ the manager admit responsibility.", ["did the manager", "the manager did", "did manager the", "the manager"], 0, "'At no time' triggers inversion with 'did'."],
  ["Grammar", "Barely _____ the speech when the audience started asking questions.", ["had she finished", "she had finished", "did she finished", "she finished had"], 0, "'Barely had...' is the correct inverted pattern."],
  ["Grammar", "Only then _____ how much work remained.", ["did I understand", "I understood", "I did understand", "understood I"], 0, "'Only then' at the beginning triggers inversion."],
  ["Grammar", "Not once _____ about the consequences.", ["did he think", "he thought", "did he thought", "he did think"], 0, "'Not once' requires 'did + subject + base verb'."],
  ["Grammar", "So difficult _____ that several students gave up.", ["was the exam", "the exam was", "was exam the", "the exam did"], 0, "The pattern is 'So + adjective + be + subject + that...'."],
  ["Grammar", "Such was the demand that the company _____ extra staff.", ["had to hire", "had hire", "has to hiring", "did hired"], 0, "'Such was...' is an inverted structure followed by a normal clause."],
  ["Grammar", "Only if you follow the instructions carefully _____ succeed.", ["will you", "you will", "will", "you"], 0, "'Only if' at the beginning requires inversion: 'will you succeed'."],
];

const SUBJUNCTIVE_MOOD_QUESTIONS = [
  ["Grammar", "It is essential that every applicant _____ the form before Friday.", ["complete", "completes", "completed", "will complete"], 0, "After 'it is essential that', formal English commonly uses the base-form subjunctive."],
  ["Grammar", "The manager insisted that he _____ informed immediately.", ["be", "was", "is", "will be"], 0, "After 'insist that', the mandative subjunctive uses the base form 'be'."],
  ["Grammar", "I wish I _____ more time to prepare for the exam.", ["had", "have", "will have", "would have"], 0, "For a present unreal situation, use past simple: 'I wish I had...'."],
  ["Grammar", "If I _____ you, I would apologize.", ["were", "was", "am", "had been"], 0, "In the second conditional, formal English uses 'were' for all persons."],
  ["Grammar", "If she had studied harder, she _____ the test.", ["would have passed", "would pass", "will have passed", "passed"], 0, "Third conditional: 'if + past perfect' → 'would have + past participle'."],
  ["Grammar", "I would rather you _____ me before making a decision.", ["told", "tell", "will tell", "had tell"], 0, "After 'would rather + subject', use past simple for a present/future preference."],
  ["Grammar", "It is important that he _____ on time.", ["be", "is", "was", "will be"], 0, "The mandative subjunctive uses the base form 'be'."],
  ["Grammar", "The doctor recommended that she _____ more water.", ["drink", "drinks", "drank", "will drink"], 0, "After 'recommend that', the base-form subjunctive is standard in formal English."],
  ["Grammar", "Suppose you _____ offered the job. Would you accept it?", ["were", "are", "will be", "have been"], 0, "'Suppose' can introduce a hypothetical situation; 'were offered' is the passive hypothetical form."],
  ["Grammar", "If only I _____ the answer!", ["knew", "know", "had know", "will know"], 0, "'If only + past simple' expresses a wish about the present."],
  ["Grammar", "He acts as if he _____ the owner of the company.", ["were", "is", "will be", "has been"], 0, "'As if' for an unreal present situation can take the subjunctive 'were'."],
  ["Grammar", "It was suggested that the meeting _____ postponed.", ["be", "was", "is", "will be"], 0, "After 'it was suggested that', formal English uses the subjunctive 'be'."],
  ["Grammar", "If I had known about the traffic, I _____ earlier.", ["would have left", "would leave", "will leave", "left"], 0, "This is a third conditional result."],
  ["Grammar", "I wish you _____ making so much noise.", ["would stop", "stop", "stopped", "have stopped"], 0, "'Wish + would' expresses annoyance about a repeated action."],
  ["Grammar", "The teacher demanded that all phones _____ switched off.", ["be", "are", "were", "will be"], 0, "The mandative subjunctive uses 'be' after 'demanded that'."],
  ["Grammar", "Were I in your position, I _____ accept the offer.", ["would", "will", "did", "have"], 0, "'Were I...' is an inverted second conditional; the result uses 'would'."],
  ["Grammar", "Had they left earlier, they _____ the train.", ["would have caught", "would catch", "will catch", "caught"], 0, "'Had they left...' is an inverted third conditional."],
  ["Grammar", "It is vital that the report _____ accurate.", ["be", "is", "was", "will be"], 0, "After 'it is vital that', use the base-form subjunctive."],
  ["Grammar", "I would rather _____ at home tonight.", ["stay", "stayed", "staying", "to stay"], 0, "After 'would rather' without a new subject, use the base verb."],
  ["Grammar", "If he _____ more careful, he wouldn't make so many mistakes.", ["were", "is", "had been", "will be"], 0, "A present unreal condition uses 'were' in formal English."],
];

const REDUCED_ADVERBIAL_CLAUSES_QUESTIONS = [
  ["Grammar", "_____ the instructions, she started the machine.", ["Having read", "Having reading", "Read having", "To read having"], 0, "'Having read' reduces a perfect adverbial clause showing an earlier action."],
  ["Grammar", "_____ by the news, he couldn't speak for several minutes.", ["Shocked", "Shocking", "Having shock", "Was shocked"], 0, "'Shocked by...' is a reduced passive adverbial clause."],
  ["Grammar", "_____ the road, we saw a deer.", ["Driving along", "Driven along", "Drive along", "Having drive"], 0, "'Driving along...' reduces 'While we were driving along...'."],
  ["Grammar", "_____ the report, the manager sent it to the client.", ["After checking", "After checked", "Checking after", "Having check"], 0, "'After checking...' is a reduced time clause with the same subject."],
  ["Grammar", "_____ all the evidence, the jury reached a decision.", ["Having considered", "Having consider", "Considered having", "Consider"], 0, "'Having considered...' shows the consideration happened first."],
  ["Grammar", "_____ in London, she knows the city very well.", ["Having lived", "Having live", "Lived having", "To living"], 0, "'Having lived...' reduces 'Because/As she has lived...'."],
  ["Grammar", "_____ from the airport, call me.", ["When arriving", "Arriving when", "Arrived when", "When arrived"], 0, "'When arriving...' can reduce a time clause when the subject is understood."],
  ["Grammar", "_____ carefully, the instructions are easy to follow.", ["When read", "When reading", "Read when", "Having read"], 0, "'When read' is a reduced passive clause meaning 'when they are read'."],
  ["Grammar", "_____ the door, he realized he had forgotten his keys.", ["Having locked", "Having lock", "Locked having", "To locked"], 0, "The perfect participle shows the first action happened before the realization."],
  ["Grammar", "_____ tired, she decided to go home.", ["Feeling", "Felt", "Having feel", "To feeling"], 0, "'Feeling tired' reduces 'Because she felt tired...'."],
  ["Grammar", "_____ the problem, they looked for a solution.", ["Understanding", "Understood", "Having understand", "To understood"], 0, "The present participle can reduce a clause with the same subject."],
  ["Grammar", "_____ enough money, he couldn't buy the laptop.", ["Not having", "Not had", "Having not had", "Not have"], 0, "'Not having enough money' is a reduced negative clause."],
  ["Grammar", "_____ by the sudden noise, the baby started crying.", ["Frightened", "Frightening", "Having frighten", "Was frightening"], 0, "'Frightened by...' is a reduced passive clause."],
  ["Grammar", "_____ the email, she immediately called her colleague.", ["Having received", "Received having", "Receiving had", "To received"], 0, "'Having received...' indicates the email came first."],
  ["Grammar", "_____ for the bus, I met an old friend.", ["Waiting", "Waited", "Having wait", "To waited"], 0, "'Waiting for the bus' reduces 'While I was waiting...'."],
  ["Grammar", "_____ the project on time, the team celebrated.", ["Having completed", "Completed having", "Having complete", "To completing"], 0, "'Having completed...' shows completion before the celebration."],
  ["Grammar", "_____ properly, this equipment can last for years.", ["Maintained", "Maintaining", "Having maintain", "Maintain"], 0, "'Maintained properly' is a reduced passive condition."],
  ["Grammar", "_____ the answer, he remained silent.", ["Knowing", "Known", "Having know", "To knowing"], 0, "'Knowing the answer' reduces a clause with the same subject."],
  ["Grammar", "_____ the report, she noticed several errors.", ["While reviewing", "While reviewed", "Reviewed while", "To reviewed"], 0, "'While reviewing...' is a reduced time clause."],
  ["Grammar", "_____ all the tickets, we could not enter the concert.", ["Having forgotten", "Forgotten having", "Having forget", "To forgetting"], 0, "'Having forgotten...' shows the earlier action causing the later situation."],
];

const ADVERBIAL_CLAUSES_QUESTIONS = [
  ["Grammar", "I'll call you _____ I arrive at the station.", ["as soon as", "unless", "although", "whereas"], 0, "'As soon as' introduces a time clause."],
  ["Grammar", "_____ it was raining, they continued the match.", ["Although", "Because", "Unless", "So that"], 0, "'Although' introduces a contrast/concession clause."],
  ["Grammar", "You should take an umbrella _____ it rains later.", ["in case", "although", "whereas", "because of"], 0, "'In case' introduces a precaution against a possible future event."],
  ["Grammar", "We stayed inside _____ the storm had passed.", ["until", "unless", "whereas", "so that"], 0, "'Until' introduces the time limit."],
  ["Grammar", "He left early _____ he could catch the first train.", ["so that", "although", "unless", "whereas"], 0, "'So that' introduces a purpose clause."],
  ["Grammar", "_____ you work hard, you can achieve your goal.", ["If", "Although", "Whereas", "Since"], 0, "'If' introduces a condition."],
  ["Grammar", "She stayed home _____ she was feeling ill.", ["because", "although", "unless", "whereas"], 0, "'Because' gives the reason."],
  ["Grammar", "_____ you apologize, she may not forgive you.", ["Unless", "Although", "Because", "Whereas"], 0, "'Unless' means 'if not'."],
  ["Grammar", "He talks _____ he knew everything.", ["as if", "because", "until", "so that"], 0, "'As if' introduces a comparison with an apparent but possibly unreal situation."],
  ["Grammar", "_____ I was cooking, the phone rang.", ["While", "Unless", "Although", "Since"], 0, "'While' introduces an action happening at the same time."],
  ["Grammar", "She took notes _____ she wouldn't forget the details.", ["so that", "whereas", "although", "until"], 0, "'So that' expresses purpose."],
  ["Grammar", "_____ you have finished your work, you can leave.", ["Once", "Although", "Unless", "Whereas"], 0, "'Once' introduces a time/condition meaning 'after or when'."],
  ["Grammar", "We went for a walk _____ the weather was cold.", ["even though", "because", "unless", "so that"], 0, "'Even though' introduces a strong contrast."],
  ["Grammar", "He works from home _____ his wife works in an office.", ["whereas", "because", "until", "unless"], 0, "'Whereas' contrasts two situations."],
  ["Grammar", "_____ she was tired, she finished the report.", ["Even though", "Because", "Unless", "So that"], 0, "'Even though' shows contrast."],
  ["Grammar", "I'll wait here _____ you come back.", ["until", "although", "because", "whereas"], 0, "'Until' marks the endpoint of the waiting."],
  ["Grammar", "They cancelled the picnic _____ the forecast predicted heavy rain.", ["since", "although", "unless", "whereas"], 0, "'Since' can introduce a reason."],
  ["Grammar", "Take your passport with you _____ you need to show identification.", ["in case", "although", "whereas", "until"], 0, "'In case' expresses precaution."],
  ["Grammar", "She whispered _____ nobody would hear her.", ["so that", "although", "unless", "whereas"], 0, "'So that' introduces the purpose of whispering."],
  ["Grammar", "_____ he had never studied abroad, his English was excellent.", ["Although", "Because", "Unless", "Until"], 0, "'Although' introduces the contrast."],
];

const IDIOMS_QUESTIONS = [
  ["Vocabulary", "If a task is 'a piece of cake', it is _____.", ["very easy", "very expensive", "dangerous", "unfinished"], 0, "'A piece of cake' means something is very easy."],
  ["Vocabulary", "If someone says 'break a leg', they usually mean _____.", ["good luck", "be careful", "hurry up", "calm down"], 0, "'Break a leg' is an idiomatic way to wish someone good luck."],
  ["Vocabulary", "If you are 'under the weather', you feel _____.", ["ill", "excited", "wealthy", "confused"], 0, "'Under the weather' means feeling unwell."],
  ["Vocabulary", "If someone 'hits the nail on the head', they _____.", ["describe something exactly", "make a mistake", "arrive late", "avoid a problem"], 0, "The idiom means to say or do something exactly right."],
  ["Vocabulary", "If you 'spill the beans', you _____.", ["reveal a secret", "cook dinner", "waste money", "leave early"], 0, "'Spill the beans' means reveal secret information."],
  ["Vocabulary", "If something 'costs an arm and a leg', it is _____.", ["very expensive", "very small", "free", "easy to find"], 0, "The idiom means extremely expensive."],
  ["Vocabulary", "If you 'see eye to eye' with someone, you _____.", ["agree with them", "avoid them", "argue with them", "work for them"], 0, "'See eye to eye' means agree or have the same opinion."],
  ["Vocabulary", "If you 'get cold feet', you _____.", ["become nervous and lose confidence", "become very cold", "run a marathon", "feel hungry"], 0, "'Get cold feet' means become too nervous to do something."],
  ["Vocabulary", "If a person is 'a night owl', they prefer to _____.", ["stay awake late", "wake up very early", "work outdoors", "sleep at noon"], 0, "A 'night owl' is someone who is active late at night."],
  ["Vocabulary", "If you 'keep an eye on' something, you _____.", ["watch it carefully", "hide it", "buy it", "repair it"], 0, "'Keep an eye on' means watch or monitor."],
  ["Vocabulary", "If a plan 'goes down in flames', it _____.", ["fails badly", "succeeds quickly", "costs nothing", "starts early"], 0, "The idiom describes a complete or embarrassing failure."],
  ["Vocabulary", "If someone is 'on the same page', they _____.", ["have the same understanding", "are reading together", "are angry", "are lost"], 0, "'On the same page' means sharing the same understanding or goals."],
  ["Vocabulary", "If you 'bite the bullet', you _____.", ["face a difficult situation bravely", "avoid responsibility", "change your name", "take a holiday"], 0, "'Bite the bullet' means accept and face something difficult."],
  ["Vocabulary", "If something happens 'once in a blue moon', it happens _____.", ["very rarely", "every day", "at midnight", "without warning"], 0, "The idiom means very rarely."],
  ["Vocabulary", "If you 'call it a day', you _____.", ["stop working for the day", "start a new project", "make a phone call", "arrive at work"], 0, "'Call it a day' means stop working for the day."],
  ["Vocabulary", "If someone 'pulls your leg', they are _____.", ["joking with you", "helping you walk", "criticizing you", "copying your work"], 0, "'Pull someone's leg' means tease or joke with them."],
  ["Vocabulary", "If you are 'in hot water', you are _____.", ["in trouble", "very successful", "very thirsty", "on holiday"], 0, "'In hot water' means in trouble."],
  ["Vocabulary", "If you 'make ends meet', you _____.", ["manage your money successfully", "finish a meeting early", "make two people meet", "avoid paying taxes"], 0, "'Make ends meet' means have enough money for basic expenses."],
  ["Vocabulary", "If a colleague is 'a people person', they are good at _____.", ["dealing with other people", "working alone", "using computers", "driving"], 0, "A 'people person' is sociable and comfortable dealing with others."],
  ["Vocabulary", "If you 'go the extra mile', you _____.", ["make more effort than expected", "travel exactly one mile", "stop working", "ask for a refund"], 0, "'Go the extra mile' means make extra effort."],
];

const PHRASAL_VERBS_QUESTIONS = [
  ["Vocabulary", "Please _____ the lights before you leave.", ["turn off", "turn into", "turn over", "turn up"], 0, "'Turn off' means switch something off."],
  ["Vocabulary", "We need to _____ the meeting until next Monday.", ["put off", "put on", "put out", "put up"], 0, "'Put off' means postpone."],
  ["Vocabulary", "She _____ her younger brother after school.", ["looks after", "looks into", "looks up", "looks over"], 0, "'Look after' means take care of."],
  ["Vocabulary", "I need to _____ this word in the dictionary.", ["look up", "look after", "look out", "look over"], 0, "'Look up' means search for information."],
  ["Vocabulary", "The plane _____ at 7:30.", ["took off", "took after", "took over", "took up"], 0, "'Take off' means an aircraft leaves the ground."],
  ["Vocabulary", "He _____ smoking last year.", ["gave up", "gave away", "gave in", "gave off"], 0, "'Give up' means stop doing something."],
  ["Vocabulary", "Can you _____ the form before submitting it?", ["fill in", "fill out", "fill over", "fill off"], 1, "'Fill out' is commonly used for completing a form."],
  ["Vocabulary", "The company decided to _____ a new branch.", ["set up", "set off", "set aside", "set out"], 0, "'Set up' means establish or create."],
  ["Vocabulary", "Please _____ the word if you don't know it.", ["write down", "write off", "write out of", "write over"], 0, "'Write down' means record something on paper."],
  ["Vocabulary", "We have _____ milk, so I'll buy some.", ["run out of", "run into", "run over", "run after"], 0, "'Run out of' means have none left."],
  ["Vocabulary", "I _____ an old friend at the station yesterday.", ["ran into", "ran out of", "ran over", "ran after"], 0, "'Run into' can mean meet someone unexpectedly."],
  ["Vocabulary", "The fire department quickly _____ the fire.", ["put out", "put off", "put away", "put through"], 0, "'Put out' means extinguish a fire."],
  ["Vocabulary", "Could you _____ the volume? I can't hear it.", ["turn up", "turn off", "turn down", "turn into"], 0, "'Turn up' means increase the volume."],
  ["Vocabulary", "She _____ the job offer because the salary was too low.", ["turned down", "turned up", "turned into", "turned over"], 0, "'Turn down' means reject or refuse."],
  ["Vocabulary", "We need to _____ the problem before making a decision.", ["look into", "look after", "look up to", "look out"], 0, "'Look into' means investigate."],
  ["Vocabulary", "He _____ his old laptop to his cousin.", ["gave away", "gave up", "gave in", "gave off"], 0, "'Give away' means give something to someone for free."],
  ["Vocabulary", "The manager asked us to _____ the issue at the next meeting.", ["bring up", "bring in", "bring out", "bring over"], 0, "'Bring up' means introduce a topic for discussion."],
  ["Vocabulary", "The new policy will _____ major changes.", ["bring about", "bring up", "bring out", "bring back"], 0, "'Bring about' means cause something to happen."],
  ["Vocabulary", "Please _____ your shoes before entering.", ["take off", "take after", "take over", "take up"], 0, "'Take off' can mean remove clothing."],
  ["Vocabulary", "She _____ her father in the way she speaks.", ["takes after", "takes off", "takes over", "takes up"], 0, "'Take after' means resemble a family member."],
];

const SYNONYMS_QUESTIONS = [
  ["Vocabulary", "Choose the word closest in meaning to 'reliable'.", ["dependable", "temporary", "uncertain", "careless"], 0, "Reliable means dependable or trustworthy."],
  ["Vocabulary", "Choose the word closest in meaning to 'rapid'.", ["quick", "weak", "rare", "quiet"], 0, "Rapid means very fast or quick."],
  ["Vocabulary", "Choose the word closest in meaning to 'purchase'.", ["buy", "borrow", "repair", "sell"], 0, "Purchase is a formal synonym of buy."],
  ["Vocabulary", "Choose the word closest in meaning to 'assist'.", ["help", "avoid", "refuse", "delay"], 0, "Assist means help."],
  ["Vocabulary", "Choose the word closest in meaning to 'accurate'.", ["correct", "uncertain", "late", "complex"], 0, "Accurate means correct and free from significant error."],
  ["Vocabulary", "Choose the word closest in meaning to 'essential'.", ["necessary", "optional", "ordinary", "distant"], 0, "Essential means absolutely necessary."],
  ["Vocabulary", "Choose the word closest in meaning to 'obtain'.", ["get", "lose", "hide", "throw"], 0, "Obtain means get or acquire."],
  ["Vocabulary", "Choose the word closest in meaning to 'maintain'.", ["keep", "destroy", "replace", "ignore"], 0, "Maintain means keep something in a particular condition."],
  ["Vocabulary", "Choose the word closest in meaning to 'significant'.", ["important", "tiny", "private", "temporary"], 0, "Significant means important or meaningful."],
  ["Vocabulary", "Choose the word closest in meaning to 'decline'.", ["decrease", "increase", "accept", "celebrate"], 0, "Decline can mean decrease."],
  ["Vocabulary", "Choose the word closest in meaning to 'acquire'.", ["obtain", "lose", "return", "borrow"], 0, "Acquire means obtain or get something."],
  ["Vocabulary", "Choose the word closest in meaning to 'require'.", ["need", "offer", "avoid", "finish"], 0, "Require means need."],
  ["Vocabulary", "Choose the word closest in meaning to 'brief'.", ["short", "wide", "heavy", "formal"], 0, "Brief means short in duration or length."],
  ["Vocabulary", "Choose the word closest in meaning to 'complex'.", ["complicated", "simple", "empty", "cheap"], 0, "Complex means complicated."],
  ["Vocabulary", "Choose the word closest in meaning to 'fortunate'.", ["lucky", "unhappy", "careless", "ordinary"], 0, "Fortunate means lucky."],
  ["Vocabulary", "Choose the word closest in meaning to 'sufficient'.", ["enough", "rare", "extraordinary", "missing"], 0, "Sufficient means enough."],
  ["Vocabulary", "Choose the word closest in meaning to 'improve'.", ["enhance", "damage", "reduce", "ignore"], 0, "Enhance means improve or increase quality."],
  ["Vocabulary", "Choose the word closest in meaning to 'prevent'.", ["stop", "allow", "encourage", "repeat"], 0, "Prevent means stop something from happening."],
  ["Vocabulary", "Choose the word closest in meaning to 'aware'.", ["conscious", "unrelated", "silent", "unprepared"], 0, "Aware means conscious of or knowing about something."],
  ["Vocabulary", "Choose the word closest in meaning to 'purchase'.", ["buy", "rent", "lend", "lose"], 0, "Purchase means buy."],
];

const ANTONYMS_QUESTIONS = [
  ["Vocabulary", "Choose the word opposite in meaning to 'expand'.", ["contract", "increase", "develop", "extend"], 0, "Contract means become smaller or reduce in size."],
  ["Vocabulary", "Choose the word opposite in meaning to 'generous'.", ["selfish", "kind", "helpful", "friendly"], 0, "Selfish is opposite to generous in this context."],
  ["Vocabulary", "Choose the word opposite in meaning to 'temporary'.", ["permanent", "brief", "short", "limited"], 0, "Permanent means lasting for a long time or indefinitely."],
  ["Vocabulary", "Choose the word opposite in meaning to 'ancient'.", ["modern", "historic", "old", "traditional"], 0, "Modern is the opposite of ancient."],
  ["Vocabulary", "Choose the word opposite in meaning to 'accept'.", ["reject", "receive", "allow", "agree"], 0, "Reject means refuse to accept."],
  ["Vocabulary", "Choose the word opposite in meaning to 'increase'.", ["decrease", "grow", "raise", "improve"], 0, "Decrease means become less."],
  ["Vocabulary", "Choose the word opposite in meaning to 'polite'.", ["rude", "formal", "kind", "friendly"], 0, "Rude is the opposite of polite."],
  ["Vocabulary", "Choose the word opposite in meaning to 'visible'.", ["hidden", "clear", "obvious", "bright"], 0, "Hidden means not visible."],
  ["Vocabulary", "Choose the word opposite in meaning to 'flexible'.", ["rigid", "adaptable", "soft", "changeable"], 0, "Rigid means not flexible."],
  ["Vocabulary", "Choose the word opposite in meaning to 'optimistic'.", ["pessimistic", "hopeful", "positive", "confident"], 0, "Pessimistic is the opposite of optimistic."],
  ["Vocabulary", "Choose the word opposite in meaning to 'minor'.", ["major", "small", "slight", "limited"], 0, "Major is the opposite of minor."],
  ["Vocabulary", "Choose the word opposite in meaning to 'frequent'.", ["rare", "regular", "common", "usual"], 0, "Rare means happening infrequently."],
  ["Vocabulary", "Choose the word opposite in meaning to 'complex'.", ["simple", "difficult", "complicated", "advanced"], 0, "Simple is the opposite of complex."],
  ["Vocabulary", "Choose the word opposite in meaning to 'arrive'.", ["depart", "reach", "come", "enter"], 0, "Depart means leave, the opposite of arrive."],
  ["Vocabulary", "Choose the word opposite in meaning to 'include'.", ["exclude", "contain", "involve", "add"], 0, "Exclude means leave out."],
  ["Vocabulary", "Choose the word opposite in meaning to 'victory'.", ["defeat", "success", "triumph", "win"], 0, "Defeat is the opposite of victory."],
  ["Vocabulary", "Choose the word opposite in meaning to 'legal'.", ["illegal", "official", "valid", "lawful"], 0, "Illegal is the opposite of legal."],
  ["Vocabulary", "Choose the word opposite in meaning to 'accurate'.", ["inaccurate", "correct", "precise", "exact"], 0, "Inaccurate means not correct."],
  ["Vocabulary", "Choose the word opposite in meaning to 'maximum'.", ["minimum", "highest", "greatest", "top"], 0, "Minimum is the opposite of maximum."],
  ["Vocabulary", "Choose the word opposite in meaning to 'advance'.", ["retreat", "progress", "develop", "improve"], 0, "Retreat means move back, the opposite of advance."],
];

const CONJUNCTIONS_QUESTIONS = [
  ["Grammar", "I stayed at home _____ I was feeling sick.", ["because", "although", "unless", "whereas"], 0, "'Because' introduces a reason."],
  ["Grammar", "_____ he was tired, he finished the report.", ["Although", "Because", "Unless", "So"], 0, "'Although' introduces a contrast."],
  ["Grammar", "Hurry up, _____ we will miss the bus.", ["or", "and", "because", "although"], 0, "'Or' can introduce a negative consequence if an action is not taken."],
  ["Grammar", "She studied hard, _____ she passed the exam.", ["so", "but", "unless", "although"], 0, "'So' introduces the result."],
  ["Grammar", "I like tea, _____ my brother prefers coffee.", ["whereas", "because", "so", "unless"], 0, "'Whereas' contrasts two preferences."],
  ["Grammar", "We can go out _____ it stops raining.", ["if", "although", "because", "whereas"], 0, "'If' introduces a condition."],
  ["Grammar", "He didn't go to work _____ he was ill.", ["because", "although", "unless", "while"], 0, "'Because' gives the reason."],
  ["Grammar", "You won't improve _____ you practice regularly.", ["unless", "because", "although", "whereas"], 0, "'Unless' means 'if not'."],
  ["Grammar", "She called me _____ she arrived.", ["when", "unless", "although", "whereas"], 0, "'When' introduces a time clause."],
  ["Grammar", "Take an umbrella _____ it rains.", ["in case", "although", "whereas", "until"], 0, "'In case' expresses precaution."],
  ["Grammar", "He is rich, _____ he isn't very happy.", ["but", "because", "so", "unless"], 0, "'But' introduces contrast."],
  ["Grammar", "We waited _____ the shop opened.", ["until", "because", "although", "whereas"], 0, "'Until' marks the endpoint of waiting."],
  ["Grammar", "She spoke quietly _____ nobody would hear.", ["so that", "although", "unless", "whereas"], 0, "'So that' expresses purpose."],
  ["Grammar", "_____ you finish, you can leave.", ["Once", "Although", "Because", "Whereas"], 0, "'Once' means after/when a condition is fulfilled."],
  ["Grammar", "I will go _____ you come with me.", ["provided that", "although", "because", "whereas"], 0, "'Provided that' means 'if' with a condition."],
  ["Grammar", "He continued working _____ he was exhausted.", ["even though", "because", "unless", "so that"], 0, "'Even though' introduces a strong contrast."],
  ["Grammar", "We left early _____ avoid the traffic.", ["so as to", "although", "whereas", "unless"], 0, "'So as to' introduces purpose."],
  ["Grammar", "She didn't buy it _____ it was on sale.", ["even though", "because", "unless", "whereas"], 0, "'Even though' introduces an unexpected contrast."],
  ["Grammar", "Call me _____ you need any help.", ["if", "although", "whereas", "until"], 0, "'If' introduces a condition."],
  ["Grammar", "He saved money _____ he could travel abroad.", ["so that", "although", "unless", "whereas"], 0, "'So that' introduces purpose."],
];

const toQuestions = (subject, key, rows) =>
  rows.map((r, i) => ({
    id: `${key}${String(i + 1).padStart(2, "0")}`,
    subject,
    topic: r[0],
    q: r[1],
    choices: r[2],
    answer: r[3],
    explanation: r[4],
  }));

const QUIZ_BANK = [
  ...toQuestions("Ngữ văn", "van", VAN_QUESTIONS),
  ...toQuestions("Vật lý", "ly", LY_QUESTIONS),
  ...toQuestions("Hóa học", "hoa", HOA_QUESTIONS),
  ...toQuestions("Sinh học", "sinh", SINH_QUESTIONS),
  ...toQuestions("Lịch sử", "su", SU_QUESTIONS),
  ...toQuestions("Địa lý", "dia", DIA_QUESTIONS),
  ...toQuestions("Tiếng Anh", "anh", ANH_QUESTIONS),
  ...toQuestions("GDCD", "gdcd", GDCD_QUESTIONS),
  ...toQuestions("Đố mẹo", "meo", MEO_QUESTIONS),
  ...toQuestions("Tiếng Trung HSK 4", "hsk4", HSK4_QUESTIONS),
  ...toQuestions("Tiếng Trung HSK 5", "hsk5", HSK5_QUESTIONS),
  ...toQuestions("English B1-B2 — Inversion", "inv", INVERSION_QUESTIONS),
  ...toQuestions("English B1-B2 — Subjunctive/Mood", "subj", SUBJUNCTIVE_MOOD_QUESTIONS),
  ...toQuestions("English B1-B2 — Reduced Adverbial Clauses", "redadv", REDUCED_ADVERBIAL_CLAUSES_QUESTIONS),
  ...toQuestions("English B1-B2 — Adverbial Clauses", "advcl", ADVERBIAL_CLAUSES_QUESTIONS),
  ...toQuestions("English B1-B2 — Idioms", "idiom", IDIOMS_QUESTIONS),
  ...toQuestions("English B1-B2 — Phrasal Verbs", "phrasal", PHRASAL_VERBS_QUESTIONS),
  ...toQuestions("English B1-B2 — Synonyms", "syn", SYNONYMS_QUESTIONS),
  ...toQuestions("English B1-B2 — Antonyms", "ant", ANTONYMS_QUESTIONS),
  ...toQuestions("English B1-B2 — Conjunctions", "conj", CONJUNCTIONS_QUESTIONS),
];

/* =========================================================
   THỜI TRANG
========================================================= */

const FASHION = [
  /* ÁO */
  { id:"shirt_white", category:"Áo", name:"Áo sơ mi trắng", icon:"👔", price:0, desc:"Đồng phục quốc dân", bonus:{reputation:2} },
  { id:"shirt_blue", category:"Áo", name:"Sơ mi xanh biển", icon:"👔", price:25000, desc:"Gọn gàng, trẻ trung", bonus:{mood:2} },
  { id:"shirt_black", category:"Áo", name:"Sơ mi đen basic", icon:"🖤", price:35000, desc:"Tối giản", bonus:{reputation:2} },
  { id:"shirt_pink", category:"Áo", name:"Sơ mi hồng pastel", icon:"🌸", price:45000, desc:"Nhẹ nhàng", bonus:{mood:4} },
  { id:"shirt_green", category:"Áo", name:"Sơ mi xanh mint", icon:"🍃", price:45000, desc:"Fresh", bonus:{mood:4} },
  { id:"tee_white", category:"Áo", name:"T-shirt trắng", icon:"👕", price:20000, desc:"Đơn giản", bonus:{friends:2} },
  { id:"tee_black", category:"Áo", name:"T-shirt đen", icon:"🖤", price:25000, desc:"Cool", bonus:{mood:3} },
  { id:"tee_red", category:"Áo", name:"T-shirt đỏ", icon:"❤️", price:30000, desc:"Nổi bật", bonus:{reputation:3} },
  { id:"tee_yellow", category:"Áo", name:"T-shirt vàng", icon:"💛", price:30000, desc:"Năng lượng", bonus:{mood:5} },
  { id:"tee_cloud", category:"Áo", name:"T-shirt mây xanh", icon:"☁️", price:40000, desc:"Cute", bonus:{mood:5} },
  { id:"hoodie_gray", category:"Áo", name:"Hoodie xám", icon:"🧥", price:70000, desc:"Ấm áp", bonus:{mood:5} },
  { id:"hoodie_black", category:"Áo", name:"Hoodie đen", icon:"🧥", price:80000, desc:"Street style", bonus:{reputation:5} },
  { id:"hoodie_pink", category:"Áo", name:"Hoodie hồng", icon:"🩷", price:85000, desc:"Cute style", bonus:{love:5} },
  { id:"varsity_blue", category:"Áo", name:"Áo varsity xanh", icon:"🏫", price:120000, desc:"Phong cách học đường", bonus:{friends:6} },
  { id:"varsity_red", category:"Áo", name:"Áo varsity đỏ", icon:"🔥", price:130000, desc:"Nổi bật", bonus:{reputation:6} },
  { id:"jacket_denim", category:"Áo", name:"Áo khoác denim", icon:"🧥", price:150000, desc:"Denim classic", bonus:{reputation:5} },
  { id:"jacket_leather", category:"Áo", name:"Áo khoác da", icon:"🧥", price:220000, desc:"Cool ngầu", bonus:{reputation:8} },
  { id:"cardigan_cream", category:"Áo", name:"Cardigan kem", icon:"🤍", price:95000, desc:"Vintage", bonus:{love:5} },
  { id:"sweater_bear", category:"Áo", name:"Sweater gấu", icon:"🐻", price:90000, desc:"Dễ thương", bonus:{mood:7} },
  { id:"jersey", category:"Áo", name:"Áo bóng đá", icon:"⚽", price:65000, desc:"Thể thao", bonus:{friends:5, skill:2} },

  /* QUẦN */
  { id:"pants_black", category:"Quần", name:"Quần tây đen", icon:"👖", price:0, desc:"Đồng phục", bonus:{reputation:2} },
  { id:"pants_blue", category:"Quần", name:"Quần jean xanh", icon:"👖", price:55000, desc:"Classic", bonus:{friends:2} },
  { id:"pants_black_jean", category:"Quần", name:"Jean đen", icon:"👖", price:65000, desc:"Cool", bonus:{reputation:3} },
  { id:"pants_white", category:"Quần", name:"Jean trắng", icon:"👖", price:75000, desc:"Sạch sẽ", bonus:{mood:3} },
  { id:"pants_cargo", category:"Quần", name:"Quần cargo", icon:"👖", price:90000, desc:"Street", bonus:{skill:2} },
  { id:"pants_kaki", category:"Quần", name:"Kaki be", icon:"👖", price:65000, desc:"Smart casual", bonus:{reputation:3} },
  { id:"pants_gray", category:"Quần", name:"Quần jogger xám", icon:"👖", price:70000, desc:"Thoải mái", bonus:{energy:2} },
  { id:"pants_green", category:"Quần", name:"Cargo xanh rêu", icon:"🟢", price:95000, desc:"Outdoor", bonus:{skill:3} },
  { id:"short_black", category:"Quần", name:"Short đen", icon:"🩳", price:40000, desc:"Năng động", bonus:{energy:3} },
  { id:"short_beige", category:"Quần", name:"Short be", icon:"🩳", price:45000, desc:"Mùa hè", bonus:{mood:3} },
  { id:"skirt_black", category:"Quần", name:"Chân váy đen", icon:"🖤", price:55000, desc:"Thanh lịch", bonus:{reputation:3} },
  { id:"skirt_plaid", category:"Quần", name:"Chân váy caro", icon:"🩷", price:70000, desc:"Học đường", bonus:{love:4} },
  { id:"skirt_white", category:"Quần", name:"Chân váy trắng", icon:"🤍", price:75000, desc:"Nữ tính", bonus:{mood:4} },
  { id:"wide_pants", category:"Quần", name:"Quần ống rộng", icon:"👖", price:85000, desc:"Fashion", bonus:{reputation:4} },

  /* GIÀY */
  { id:"shoes_school", category:"Giày", name:"Giày học sinh", icon:"👟", price:0, desc:"Cơ bản", bonus:{reputation:1} },
  { id:"sneaker_white", category:"Giày", name:"Sneaker trắng", icon:"👟", price:85000, desc:"Clean", bonus:{mood:4} },
  { id:"sneaker_black", category:"Giày", name:"Sneaker đen", icon:"👟", price:90000, desc:"Basic", bonus:{reputation:3} },
  { id:"sneaker_red", category:"Giày", name:"Sneaker đỏ", icon:"👟", price:110000, desc:"Nổi bật", bonus:{reputation:5} },
  { id:"high_top", category:"Giày", name:"High-top", icon:"👟", price:130000, desc:"Street", bonus:{friends:5} },
  { id:"running", category:"Giày", name:"Giày chạy bộ", icon:"🏃", price:100000, desc:"Thể thao", bonus:{skill:3, energy:2} },
  { id:"loafer", category:"Giày", name:"Loafer", icon:"👞", price:120000, desc:"Thanh lịch", bonus:{reputation:6} },
  { id:"boots", category:"Giày", name:"Boot cổ ngắn", icon:"🥾", price:180000, desc:"Cool", bonus:{reputation:7} },
  { id:"canvas", category:"Giày", name:"Canvas xanh", icon:"👟", price:70000, desc:"Nhẹ nhàng", bonus:{friends:3} },
  { id:"pink_shoes", category:"Giày", name:"Sneaker hồng", icon:"🩷", price:105000, desc:"Cute", bonus:{love:5} },

  /* BALO */
  { id:"bag_school", category:"Balo", name:"Balo học sinh", icon:"🎒", price:0, desc:"Balo cơ bản", bonus:{study:2} },
  { id:"bag_black", category:"Balo", name:"Balo đen premium", icon:"🎒", price:80000, desc:"Gọn và xịn", bonus:{reputation:4} },
  { id:"bag_pink", category:"Balo", name:"Balo hồng", icon:"🎒", price:90000, desc:"Dễ thương", bonus:{love:5} },
  { id:"bag_blue", category:"Balo", name:"Balo xanh", icon:"🎒", price:85000, desc:"Năng động", bonus:{friends:4} },
  { id:"bag_canvas", category:"Balo", name:"Túi canvas", icon:"👜", price:65000, desc:"Vintage", bonus:{mood:4} },
  { id:"bag_luxury", category:"Balo", name:"Balo luxury", icon:"🎒", price:250000, desc:"Đẳng cấp", bonus:{reputation:10} },

  /* PHỤ KIỆN */
  { id:"cap_black", category:"Phụ kiện", name:"Mũ lưỡi trai đen", icon:"🧢", price:35000, desc:"Street", bonus:{reputation:2} },
  { id:"cap_blue", category:"Phụ kiện", name:"Mũ xanh", icon:"🧢", price:35000, desc:"Năng động", bonus:{friends:2} },
  { id:"cap_pink", category:"Phụ kiện", name:"Mũ hồng", icon:"🧢", price:45000, desc:"Cute", bonus:{love:3} },
  { id:"glasses", category:"Phụ kiện", name:"Kính tri thức", icon:"👓", price:60000, desc:"Học bá", bonus:{study:5} },
  { id:"sunglasses", category:"Phụ kiện", name:"Kính thời trang", icon:"🕶️", price:75000, desc:"Cool", bonus:{reputation:6} },
  { id:"watch", category:"Phụ kiện", name:"Đồng hồ bạc", icon:"⌚", price:150000, desc:"Chín chắn", bonus:{reputation:7} },
  { id:"smartwatch", category:"Phụ kiện", name:"Smartwatch", icon:"⌚", price:280000, desc:"Công nghệ", bonus:{skill:7} },
  { id:"necklace", category:"Phụ kiện", name:"Dây chuyền", icon:"📿", price:180000, desc:"Thanh lịch", bonus:{love:7} },
  { id:"bracelet", category:"Phụ kiện", name:"Vòng tay", icon:"📿", price:80000, desc:"Nhẹ nhàng", bonus:{love:4} },
  { id:"headphone", category:"Phụ kiện", name:"Tai nghe", icon:"🎧", price:180000, desc:"Music", bonus:{mood:7} },
  { id:"hairclip", category:"Phụ kiện", name:"Kẹp tóc hoa", icon:"🌸", price:45000, desc:"Xinh xắn", bonus:{love:4} },
  { id:"backpack_keychain", category:"Phụ kiện", name:"Móc khóa gấu", icon:"🧸", price:30000, desc:"Cute", bonus:{mood:3} },

  /* TÓC */
  { id:"hair_black", category:"Tóc", name:"Tóc đen tự nhiên", icon:"💇", price:0, desc:"Classic", bonus:{reputation:1} },
  { id:"hair_brown", category:"Tóc", name:"Tóc nâu", icon:"💇", price:60000, desc:"Ấm áp", bonus:{mood:4} },
  { id:"hair_short", category:"Tóc", name:"Tóc ngắn năng động", icon:"💇", price:70000, desc:"Năng động", bonus:{friends:4} },
  { id:"hair_long", category:"Tóc", name:"Tóc dài nữ tính", icon:"💇", price:70000, desc:"Dịu dàng", bonus:{love:4} },
  { id:"hair_wavy", category:"Tóc", name:"Tóc xoăn nhẹ", icon:"💇", price:100000, desc:"Fashion", bonus:{reputation:5} },
  { id:"hair_blue", category:"Tóc", name:"Tóc highlight xanh", icon:"💙", price:140000, desc:"Cá tính", bonus:{reputation:8} },
  { id:"hair_pink", category:"Tóc", name:"Tóc highlight hồng", icon:"🩷", price:150000, desc:"Cute", bonus:{love:8} },
];

const FASHION_CATEGORIES = ["Áo", "Quần", "Giày", "Balo", "Phụ kiện", "Tóc"];

/* =========================================================
   NPC
========================================================= */

const NPCS = [
  {
    id:"lan",
    name:"Lan",
    icon:"👧",
    desc:"Bạn học chăm chỉ, thích học nhóm.",
    action:"📚 Học nhóm",
    apply:g=>{
      addStat(g,"study",3);
      addStat(g,"friends",4);
      addRelationship(g,"lan",5);
      addCompetition(g,3);
      g.studyActions++;
    }
  },
  {
    id:"trieuMan",
    name:"Triệu Mẫn",
    icon:"🌸",
    desc:"Vịu ơ.",
    action:"💗 Tâm sự",
    apply:g=>{
      addStat(g,"mood",4);
      addStat(g,"love",4);
      addStat(g,"friends",3);
      addRelationship(g,"trieuMan",5);
      addCompetition(g,2);
    }
  },
  {
    id:"tuan",
    name:"Tuấn",
    icon:"👦",
    desc:"Thích thể thao và kỹ năng.",
    action:"⚡ Luyện kỹ năng",
    apply:g=>{
      addStat(g,"skill",4);
      addStat(g,"reputation",2);
      addRelationship(g,"tuan",5);
      addCompetition(g,3);
    }
  },
  {
    id:"minh",
    name:"Minh",
    icon:"🧑‍🎓",
    desc:"Bạn cùng bàn khá thông minh.",
    action:"📝 Ôn bài",
    apply:g=>{
      addStat(g,"study",4);
      addStat(g,"friends",2);
      addRelationship(g,"minh",4);
      addCompetition(g,3);
      g.studyActions++;
    }
  },
  {
    id:"linh",
    name:"Linh",
    icon:"🎨",
    desc:"Thành viên CLB nghệ thuật.",
    action:"🎨 Vào CLB",
    apply:g=>{
      addStat(g,"mood",5);
      addStat(g,"friends",5);
      addStat(g,"skill",2);
      addRelationship(g,"linh",5);
      addCompetition(g,2);
    }
  },
  {
    id:"phong",
    name:"Phong",
    icon:"🏃",
    desc:"Bạn mê thể thao.",
    action:"🏃 Chạy sân trường",
    apply:g=>{
      addStat(g,"hp",5);
      addStat(g,"energy",-5);
      addStat(g,"friends",3);
      addRelationship(g,"phong",4);
      addCompetition(g,3);
    }
  }
];

/* =========================================================
   SỰ KIỆN NGẪU NHIÊN
========================================================= */

const DAILY_EVENTS = [
  {
    id:"teacher",
    icon:"🧑‍🏫",
    title:"Được giáo viên khen",
    text:"Bạn phát biểu rất tốt trong lớp.",
    result:"Kiến thức +3 • Danh tiếng +5 • Thi đua +4",
    apply:g=>{
      addStat(g,"study",3);
      addStat(g,"reputation",5);
      addCompetition(g,4);
    }
  },
  {
    id:"festival",
    icon:"🎉",
    title:"Trường tổ chức ngày hội",
    text:"Cả trường náo nhiệt với nhiều hoạt động.",
    result:"Tâm trạng +8 • Bạn bè +5 • Thi đua +3",
    apply:g=>{
      addStat(g,"mood",8);
      addStat(g,"friends",5);
      addCompetition(g,3);
    }
  },
  {
    id:"test",
    icon:"📄",
    title:"Kiểm tra bất ngờ",
    text:"Giáo viên bất ngờ phát đề.",
    result:"Kiến thức -4 • Danh tiếng +2 • Thi đua +2",
    apply:g=>{
      addStat(g,"study",-4);
      addStat(g,"reputation",2);
      addCompetition(g,2);
    }
  },
  {
    id:"wallet",
    icon:"💸",
    title:"Làm rơi ví",
    text:"Một khoản tiền nhỏ bị thất lạc.",
    result:"Tiền -30.000đ • Tâm trạng -4",
    apply:g=>{
      addMoney(g,-30000);
      addStat(g,"mood",-4);
    }
  },
  {
    id:"snack",
    icon:"🍪",
    title:"Bạn cho đồ ăn",
    text:"Một người bạn bất ngờ chia đồ ăn cho bạn.",
    result:"Năng lượng +5 • Tâm trạng +5",
    apply:g=>{
      addStat(g,"energy",5);
      addStat(g,"mood",5);
    }
  },
  {
    id:"rain",
    icon:"🌧️",
    title:"Trời mưa",
    text:"Mưa lớn khiến việc di chuyển khó khăn.",
    result:"Năng lượng -5 • Tâm trạng -3",
    apply:g=>{
      addStat(g,"energy",-5);
      addStat(g,"mood",-3);
    }
  },
  {
    id:"club",
    icon:"🎯",
    title:"CLB tuyển thành viên",
    text:"Bạn được mời tham gia một CLB mới.",
    result:"Kỹ năng +4 • Bạn bè +3",
    apply:g=>{
      addStat(g,"skill",4);
      addStat(g,"friends",3);
    }
  },
  {
    id:"lunch",
    icon:"🍱",
    title:"Được mời ăn trưa",
    text:"Một người bạn mời bạn ăn trưa.",
    result:"Tiền +20.000đ • Tâm trạng +4",
    apply:g=>{
      addMoney(g,20000);
      addStat(g,"mood",4);
    }
  },
  {
    id:"library",
    icon:"📚",
    title:"Tìm được tài liệu hay",
    text:"Bạn tình cờ tìm thấy một cuốn sách hữu ích.",
    result:"Kiến thức +5",
    apply:g=>{
      addStat(g,"study",5);
      g.studyActions++;
    }
  },
  {
    id:"sport",
    icon:"🏅",
    title:"Ngày hội thể thao",
    text:"Bạn tham gia một trận đấu vui vẻ.",
    result:"HP +3 • Bạn bè +4 • Năng lượng -5",
    apply:g=>{
      addStat(g,"hp",3);
      addStat(g,"friends",4);
      addStat(g,"energy",-5);
    }
  },
  {
    id:"contest",
    icon:"💻",
    title:"Cuộc thi online",
    text:"Bạn được rủ tham gia một cuộc thi kiến thức.",
    result:"Kỹ năng +3 • Thi đua +5",
    apply:g=>{
      addStat(g,"skill",3);
      addCompetition(g,5);
    }
  },
  {
    id:"bus",
    icon:"🚌",
    title:"Trễ xe buýt",
    text:"Bạn phải chờ xe lâu hơn bình thường.",
    result:"Năng lượng -8 • Tâm trạng -3",
    apply:g=>{
      addStat(g,"energy",-8);
      addStat(g,"mood",-3);
    }
  },
  {
    id:"message",
    icon:"📱",
    title:"Bạn cũ nhắn tin",
    text:"Một người bạn cũ bất ngờ liên lạc.",
    result:"Bạn bè +5 • Tâm trạng +4",
    apply:g=>{
      addStat(g,"friends",5);
      addStat(g,"mood",4);
    }
  },
  {
    id:"coupon",
    icon:"🎟️",
    title:"Nhận voucher",
    text:"Bạn nhận được voucher từ một cửa hàng.",
    result:"Tiền +15.000đ",
    apply:g=>addMoney(g,15000)
  },
  {
    id:"clean",
    icon:"🧹",
    title:"Dọn lớp",
    text:"Bạn ở lại giúp lớp dọn dẹp.",
    result:"Danh tiếng +3 • Bạn bè +2 • Thi đua +2",
    apply:g=>{
      addStat(g,"reputation",3);
      addStat(g,"friends",2);
      addCompetition(g,2);
    }
  }
];

function eventData(ev){
  return {
    id:ev.id,
    icon:ev.icon,
    title:ev.title,
    text:ev.text,
    result:ev.result
  };
}

function pickDailyEvent(lastId){
  const available = DAILY_EVENTS.filter(e=>e.id !== lastId);
  return pick(available.length ? available : DAILY_EVENTS);
}

/* =========================================================
   NGHỀ
========================================================= */

const JOBS = [
  {
    id:"canteen",
    name:"Phục vụ căn tin",
    icon:"🍱",
    pay:25000,
    energy:8,
    desc:"Ca nhẹ, phù hợp người mới.",
    can:()=>true,
    apply:g=>{
      addMoney(g,25000);
      addStat(g,"energy",-8);
      addStat(g,"skill",1);
      addCompetition(g,2);
    }
  },
  {
    id:"flyer",
    name:"Phát tờ rơi",
    icon:"📄",
    pay:30000,
    energy:12,
    desc:"Việc đơn giản nhưng khá mệt.",
    can:()=>true,
    apply:g=>{
      addMoney(g,30000);
      addStat(g,"energy",-12);
      addStat(g,"mood",-2);
      addStat(g,"skill",2);
      addCompetition(g,2);
    }
  },
  {
    id:"excel",
    name:"Nhập dữ liệu Excel",
    icon:"💻",
    pay:50000,
    energy:10,
    desc:"Cần kỹ năng từ 100.",
    can:g=>g.stats.skill>=35,
    apply:g=>{
      addMoney(g,50000);
      addStat(g,"energy",-10);
      addStat(g,"skill",4);
      addCompetition(g,4);
    }
  },
  {
    id:"driver",
    name:"Lái xe VIP",
    icon:"🚗",
    pay:100000,
    energy:20,
    desc:"Cần chứng chỉ lái xe.",
    can:g=>g.certificates.includes("cert_driver"),
    apply:g=>{
      addMoney(g,100000);
      addStat(g,"energy",-20);
      addStat(g,"reputation",3);
      addStat(g,"skill",5);
      addCompetition(g,6);
    }
  },
  {
    id:"interpreter",
    name:"Trợ lý tiếng Anh",
    icon:"🌎",
    pay:150000,
    energy:15,
    desc:"Cần TOEIC và kỹ năng ≥ 300.",
    can:g=>g.certificates.includes("cert_toeic") && g.stats.skill>=300,
    apply:g=>{
      addMoney(g,150000);
      addStat(g,"energy",-10);
      addStat(g,"skill",7);
      addCompetition(g,7);
    }
  },
  {
    id:"broker",
    name:"Cộng tác viên chứng khoán",
    icon:"📈",
    pay:200000,
    energy:10,
    desc:"Cần chứng chỉ tài chính và kỹ năng ≥ 500.",
    can:g=>g.certificates.includes("cert_finance") && g.stats.skill>=500,
    apply:g=>{
      addMoney(g,200000);
      addStat(g,"energy",-10);
      addStat(g,"reputation",4);
      addStat(g,"skill",8);
      addCompetition(g,8);
    }
  }
];

/* =========================================================
   CHỨNG CHỈ
========================================================= */

const CERTS = [
  {
    id:"cert_driver",
    name:"Chứng chỉ lái xe",
    icon:"🚗",
    fee:80000,
    req:100,
    desc:"Mở khóa công việc lái xe VIP.",
    questions:[
      {
        q:"Khi đèn đỏ, người lái xe phải làm gì?",
        choices:["Dừng lại","Tăng tốc","Đi ngược chiều","Bấm còi"],
        answer:0,
        explanation:"Đèn đỏ yêu cầu phương tiện dừng lại."
      },
      {
        q:"Dây an toàn có tác dụng chính là?",
        choices:["Giảm nguy cơ chấn thương","Tăng tốc xe","Tiết kiệm xăng","Tăng âm thanh"],
        answer:0,
        explanation:"Dây an toàn giúp giảm nguy cơ chấn thương khi va chạm."
      },
      {
        q:"Khi lái xe cần ưu tiên điều gì?",
        choices:["An toàn giao thông","Tốc độ tối đa","Bấm còi","Vượt mọi xe"],
        answer:0,
        explanation:"An toàn là ưu tiên hàng đầu."
      }
    ]
  },
  {
    id:"cert_toeic",
    name:"Chứng chỉ TOEIC",
    icon:"🇬🇧",
    fee:120000,
    req:150,
    desc:"Mở khóa việc trợ lý tiếng Anh.",
    questions:[
      {
        q:"Choose the correct answer: She ___ to school every day.",
        choices:["goes","go","going","gone"],
        answer:0,
        explanation:"She là ngôi thứ ba số ít nên dùng goes."
      },
      {
        q:"What is the opposite of 'cheap'?",
        choices:["expensive","small","easy","short"],
        answer:0,
        explanation:"Cheap = rẻ, opposite = expensive."
      },
      {
        q:"I am interested ___ English.",
        choices:["in","on","at","for"],
        answer:0,
        explanation:"Cấu trúc: be interested in."
      }
    ]
  },
  {
    id:"cert_mos",
    name:"Chứng chỉ MOS",
    icon:"💻",
    fee:100000,
    req:300,
    desc:"Chứng minh kỹ năng văn phòng.",
    questions:[
      {
        q:"Excel dùng chủ yếu để làm gì?",
        choices:["Bảng tính và dữ liệu","Chỉnh ảnh","Dựng phim","Nghe nhạc"],
        answer:0,
        explanation:"Excel là phần mềm bảng tính."
      },
      {
        q:"Trong Excel, SUM dùng để?",
        choices:["Tính tổng","Đếm ký tự","Đổi màu","Xóa file"],
        answer:0,
        explanation:"SUM dùng để tính tổng."
      },
      {
        q:"Ctrl + C thường dùng để?",
        choices:["Copy","Paste","Save","Close"],
        answer:0,
        explanation:"Ctrl + C là sao chép."
      }
    ]
  },
  {
    id:"cert_finance",
    name:"Chứng chỉ tài chính",
    icon:"📈",
    fee:180000,
    req:500,
    desc:"Mở khóa công việc chứng khoán.",
    questions:[
      {
        q:"Đầu tư đa dạng hóa nhằm mục đích gì?",
        choices:["Phân tán rủi ro","Tăng chắc chắn lợi nhuận","Không có rủi ro","Không cần nghiên cứu"],
        answer:0,
        explanation:"Đa dạng hóa giúp phân tán rủi ro."
      },
      {
        q:"Cổ phiếu đại diện cho điều gì?",
        choices:["Quyền sở hữu một phần doanh nghiệp","Khoản vay ngân hàng","Tiền mặt","Hợp đồng lao động"],
        answer:0,
        explanation:"Cổ phiếu đại diện cho quyền sở hữu vốn trong doanh nghiệp."
      },
      {
        q:"Nguyên tắc quan trọng khi đầu tư là?",
        choices:["Quản trị rủi ro","Luôn mua theo tin đồn","Vay tối đa","Không cần kế hoạch"],
        answer:0,
        explanation:"Quản trị rủi ro là nguyên tắc quan trọng trong đầu tư."
      }
    ]
  }
];

/* =========================================================
   TÀI SẢN
========================================================= */

const ASSETS = [
  {id:"bike",name:"Xe đạp",icon:"🚲",price:120000,desc:"Đi học nhanh hơn",bonus:{energy:3}},
  {id:"scooter",name:"Xe máy",icon:"🛵",price:800000,desc:"Di chuyển tiện lợi",bonus:{energy:5,reputation:3}},
  {id:"sedan",name:"Sedan",icon:"🚗",price:1800000,desc:"Tài sản đầu tiên",bonus:{reputation:6,mood:4}},
  {id:"supercar",name:"Siêu xe",icon:"🏎️",price:5000000,desc:"Cực kỳ nổi bật",bonus:{reputation:12,mood:8}},
  {id:"condo",name:"Căn hộ",icon:"🏢",price:20000000,desc:"Không gian riêng",bonus:{mood:12,energy:5}},
  {id:"villa",name:"Biệt thự",icon:"🏡",price:60000000,desc:"Tài sản mơ ước",bonus:{mood:18,reputation:15}},
];

/* =========================================================
   TITLE
========================================================= */

const TITLES = [
  {id:"starter",name:"Tân Binh Thanh Xuân",icon:"🌱",desc:"Bắt đầu hành trình",condition:()=>true},
  {id:"diligent",name:"Người Chăm Chỉ",icon:"📚",desc:"8 lần học",condition:g=>g.studyActions>=8},
  {id:"scholar",name:"Học Bá",icon:"🏆",desc:"Kiến thức ≥ 85",condition:g=>g.stats.study>=85},
  {id:"social",name:"Tâm Điểm Lớp",icon:"🤝",desc:"Bạn bè ≥ 85",condition:g=>g.stats.friends>=85},
  {id:"skill",name:"Đa Năng",icon:"⚡",desc:"Kỹ năng ≥ 80",condition:g=>g.stats.skill>=80},
  {id:"love",name:"Thanh Xuân Có Đôi",icon:"💗",desc:"Tình cảm ≥ 80",condition:g=>g.stats.love>=80},
  {id:"certificate",name:"Bộ Sưu Tập Chứng Chỉ",icon:"🎓",desc:"Có ≥ 3 chứng chỉ",condition:g=>g.certificates.length>=3},
  {id:"fashion",name:"Fashionista Học Đường",icon:"👗",desc:"Có ≥ 15 món thời trang",condition:g=>g.wardrobe.length>=15},
  {id:"asset",name:"Tay Chơi Tài Sản",icon:"🏠",desc:"Sở hữu ≥ 2 tài sản",condition:g=>g.assets.length>=2},
  {id:"future",name:"Nhà Đầu Tư Tương Lai",icon:"📈",desc:"Có chứng chỉ tài chính",condition:g=>g.certificates.includes("cert_finance")},
  {id:"competition",name:"Ngôi Sao Thi Đua",icon:"🌟",desc:"≥ 100 điểm thi đua",condition:g=>g.competitionPoints>=100},
  {id:"legend",name:"Thanh Xuân Rực Rỡ",icon:"✨",desc:"Hoàn thành hành trình",condition:g=>g.isGameOver},
];

/* =========================================================
   SAVE / LOAD
========================================================= */

function encodeSaveCode(data){
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";
  const chunk = 0x8000;

  for(let i=0;i<bytes.length;i+=chunk){
    binary += String.fromCharCode(...bytes.subarray(i,i+chunk));
  }

  return btoa(binary)
    .replace(/\+/g,"-")
    .replace(/\//g,"_")
    .replace(/=+$/,"");
}

function decodeSaveCode(code){
  let b64 = code.trim().replace(/-/g,"+").replace(/_/g,"/");
  while(b64.length % 4) b64 += "=";

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);

  for(let i=0;i<binary.length;i++){
    bytes[i] = binary.charCodeAt(i);
  }

  return JSON.parse(new TextDecoder().decode(bytes));
}

function snapshotDay(g){
  return {
    stats:{
      study:g.stats.study,
      money:g.stats.money,
      friends:g.stats.friends,
      energy:g.stats.energy,
      mood:g.stats.mood,
      reputation:g.stats.reputation,
      skill:g.stats.skill,
      love:g.stats.love,
    },
    competitionPoints:g.competitionPoints
  };
}

function emptyDailyCompetition(){
  return {
    player:0,
    lan:0,
    trieuMan:0,
    tuan:0,
    minh:0,
    linh:0,
    phong:0
  };
}

/* =========================================================
   STATE
========================================================= */

function createInitialState(){
  const g = {
    version:6,
    isGameOver:false,
    day:1,
    totalDays:45,
    timeIndex:0,
    location:"class",

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
    wardrobe:["shirt_white","pants_black","shoes_school","bag_school","hair_black"],

    outfit:{
      shirt:"shirt_white",
      pants:"pants_black",
      shoes:"shoes_school",
      bag:"bag_school",
      accessory:null,
      hair:"hair_black"
    },

    bag:[
      {
        id:"math_note",
        name:"Sổ Công Thức",
        icon:"📘",
        count:1,
        desc:"+8 kiến thức"
      },
      {
        id:"gift_strawberry",
        name:"Kẹo Dâu Tây",
        icon:"🍬",
        count:2,
        desc:"+tình cảm"
      }
    ],

    diaryEntries:[],

    competitionPoints:0,

    npcCompetition:{
      lan:42,
      trieuMan:50,
      tuan:36,
      minh:31,
      linh:28,
      phong:34
    },

    dailyCompetition:emptyDailyCompetition(),

    relationships:{
      lan:45,
      trieuMan:30,
      tuan:40,
      minh:35,
      linh:32,
      phong:38
    },

    studyActions:0,
    jobActions:0,
    oralChecksDone:0,
    dailyOralCheckDone:false,
    mainActivityUsed:false,
    mainActivityLabel:null,
    mainActivityCount:0,
    mainActivityLabels:[],

    dailyEvent:null,
    lastEventId:null,
    dayStart:null,

    selectedTitle:"starter",

    // Lịch sử câu hỏi để hạn chế lặp lại quá nhiều.
    questionUsage:{},
    recentQuestionIds:[]
  };

  const ev = pickDailyEvent(null);

  g.dayStart = snapshotDay(g);
  g.dailyEvent = eventData(ev);
  g.lastEventId = ev.id;
  ev.apply(g);

  return g;
}

function normalizeState(raw){
  const base = createInitialState();

  const g = {
    ...base,
    ...raw,
    stats:{
      ...base.stats,
      ...(raw?.stats || {})
    },
    certificates:Array.isArray(raw?.certificates) ? raw.certificates : base.certificates,
    assets:Array.isArray(raw?.assets) ? raw.assets : base.assets,
    wardrobe:Array.isArray(raw?.wardrobe) ? raw.wardrobe : base.wardrobe,
    bag:Array.isArray(raw?.bag) ? raw.bag : base.bag,
    diaryEntries:Array.isArray(raw?.diaryEntries) ? raw.diaryEntries : [],
    npcCompetition:{
      ...base.npcCompetition,
      ...(raw?.npcCompetition || {})
    },
    dailyCompetition:{
      ...base.dailyCompetition,
      ...(raw?.dailyCompetition || {})
    },
    relationships:{
      ...base.relationships,
      ...(raw?.relationships || {})
    },
    outfit:{
      ...base.outfit,
      ...(raw?.outfit || {})
    }
  };

  g.day = Math.max(1, Math.min(g.totalDays || 45, Number(g.day) || 1));
  g.timeIndex = Math.max(0, Math.min(TIME_SLOTS.length - 1, Number(g.timeIndex) || 0));
  const legacyCount = g.mainActivityCount == null
    ? (g.mainActivityUsed ? 1 : 0)
    : Number(g.mainActivityCount) || 0;
  g.mainActivityCount = Math.max(0, Math.min(1, legacyCount));
  g.mainActivityLabels = Array.isArray(g.mainActivityLabels)
    ? g.mainActivityLabels.filter(Boolean).slice(0,1)
    : (g.mainActivityLabel ? [g.mainActivityLabel] : []);
  g.mainActivityUsed = g.mainActivityCount >= 1;
  g.mainActivityLabel = g.mainActivityLabels.join(" • ");
  g.mainActivityLabel = g.mainActivityLabel || null;

  for(const key of [
    "hp",
    "energy",
    "mood",
    "study",
    "friends",
    "love",
    "reputation"
  ]){
    g.stats[key] = clamp(g.stats[key]);
  }
  g.stats.skill = clamp(g.stats.skill, 0, 500);

  g.stats.money = Math.max(0, Number(g.stats.money) || 0);

  g.questionUsage = (raw?.questionUsage && typeof raw.questionUsage === "object")
    ? raw.questionUsage
    : {};
  g.recentQuestionIds = Array.isArray(raw?.recentQuestionIds)
    ? raw.recentQuestionIds.filter(Boolean).slice(-60)
    : [];

  if(!g.dayStart){
    g.dayStart = snapshotDay(g);
  }

  return g;
}

/* =========================================================
   UI COMPONENTS
========================================================= */

function Modal({title,onClose,children,wide=false}){
  return (
    <div className="modal-backdrop">
      <div className={`modal ${wide ? "modal-wide" : ""}`}>
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          {onClose && (
            <button className="icon-btn" onClick={onClose}>✕</button>
          )}
        </div>
        <div className="modal-body">{children}</div>
        {onClose && (
          <div className="modal-close-action">
            <Button onClick={onClose}>✕ Đóng</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBar({icon,label,value,max=100}){
  return (
    <div className="stat">
      <div className="stat-top">
        <span>{icon} {label}</span>
        <b>{Math.round(value)}</b>
      </div>
      <div className="bar">
        <div
          className="bar-fill"
          style={{width:`${Math.max(0,Math.min(100,(Number(value)||0)/max*100))}%`}}
        />
      </div>
    </div>
  );
}

function Button({children,onClick,disabled=false,className=""}){
  return (
    <button
      className={`game-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App(){

  const [game,setGame] = useState(()=>{
    try{
      const saved = localStorage.getItem(SAVE_KEY);
      if(saved) return normalizeState(JSON.parse(saved));
    }catch{}
    return createInitialState();
  });

  const [secondsLeft,setSecondsLeft] = useState(SLOT_SECONDS);
  const [autoTime,setAutoTime] = useState(true);

  const [overlay,setOverlay] = useState(null);
  const [toast,setToast] = useState("");

  const [quiz,setQuiz] = useState(null);
  const [quizFeedback,setQuizFeedback] = useState(null);

  const [saveCode,setSaveCode] = useState("");
  const [fashionCategory,setFashionCategory] = useState("Áo");

  const [audioOn,setAudioOn] = useState(false);

  const advancingRef = useRef(false);

  const blockingOverlay = Boolean(overlay);

  const currentTime = TIME_SLOTS[game.timeIndex];
  const nextTime =
    TIME_SLOTS[Math.min(game.timeIndex + 1,TIME_SLOTS.length - 1)];

  const currentTitle =
    TITLES.find(t=>t.id===game.selectedTitle) || TITLES[0];

  const leaderboard = useMemo(()=>{
    const rows = [
      {
        id:"player",
        name:"Bạn",
        icon:currentTitle.icon,
        points:game.competitionPoints,
        today:game.dailyCompetition.player
      },
      ...NPCS.map(n=>({
        id:n.id,
        name:n.name,
        icon:n.icon,
        points:game.npcCompetition[n.id] || 0,
        today:game.dailyCompetition[n.id] || 0
      }))
    ];

    return rows.sort((a,b)=>b.points-a.points);
  },[game,currentTitle]);

  const ownedFashion = useMemo(
    ()=>FASHION.filter(item=>game.wardrobe.includes(item.id)),
    [game.wardrobe]
  );

  const visibleFashion = useMemo(
    ()=>FASHION.filter(item=>item.category===fashionCategory),
    [fashionCategory]
  );

  /* -----------------------------------------
     SAVE
  ----------------------------------------- */

  useEffect(()=>{
    try{
      localStorage.setItem(SAVE_KEY,JSON.stringify(game));
    }catch{}
  },[game]);

  /* -----------------------------------------
     TOAST
  ----------------------------------------- */

  useEffect(()=>{
    if(!toast) return;

    const id = setTimeout(()=>setToast(""),2400);

    return ()=>clearTimeout(id);
  },[toast]);

  /* -----------------------------------------
     SOUND
  ----------------------------------------- */

  const beep = useCallback((freq=440,duration=.08)=>{
    if(!audioOn) return;

    try{
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = freq;

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(.04,ctx.currentTime);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    }catch{}
  },[audioOn]);

  /* -----------------------------------------
     UPDATE GAME
  ----------------------------------------- */

  const updateGame = useCallback((mutator)=>{
    setGame(prev=>{
      const next = clone(prev);
      mutator(next);
      return normalizeState(next);
    });
  },[]);

  const canDoMainActivity = useCallback(()=>{
    if(game.isGameOver) return false;
    if((game.mainActivityCount || 0) >= 1){
      setToast(
        `⏱️ Mốc ${currentTime} đã dùng hoạt động chính. ` +
        `Sang mốc mới để hoạt động tiếp.`
      );
      return false;
    }
    return true;
  },[
    game.isGameOver,
    game.mainActivityCount,
    currentTime
  ]);

  /* -----------------------------------------
     NEXT DAY
  ----------------------------------------- */

  const finishDay = useCallback(()=>{
    setGame(prev=>{
      const next = clone(prev);

      const finishedDay = next.day;
      const before = next.dayStart || snapshotDay(next);

      const playerGain = Math.max(
        1,
        Math.min(
          10,
          Math.floor(
            (next.stats.study + next.stats.skill + next.stats.reputation) / 35
          )
        )
      );

      next.competitionPoints += playerGain;
      next.dailyCompetition.player += playerGain;

      // Từ ngày 2 trở đi, điểm từng NPC tăng ngẫu nhiên mỗi ngày.
      const npcGain = {};
      NPCS.forEach(npc=>{
        npcGain[npc.id] = 1 + Math.floor(Math.random() * 8);
      });

      Object.entries(npcGain).forEach(([id,gain])=>{
        next.npcCompetition[id] =
          (next.npcCompetition[id] || 0) + gain;

        next.dailyCompetition[id] = gain;
      });

      const deltas = {
        study:next.stats.study-before.stats.study,
        money:next.stats.money-before.stats.money,
        friends:next.stats.friends-before.stats.friends,
        energy:next.stats.energy-before.stats.energy,
        mood:next.stats.mood-before.stats.mood,
        skill:next.stats.skill-before.stats.skill,
        competition:
          next.competitionPoints-before.competitionPoints
      };

      const diary = {
        id:`day-${finishedDay}-${Date.now()}`,
        day:finishedDay,
        event:next.dailyEvent?.title || "Không có sự kiện",
        summary:
          `Kiến thức ${signed(deltas.study)} • ` +
          `Tiền ${signed(deltas.money)}đ • ` +
          `Bạn bè ${signed(deltas.friends)} • ` +
          `Thi đua ${signed(deltas.competition)}`,
        deltas
      };

      next.diaryEntries = [
        diary,
        ...next.diaryEntries
      ].slice(0,60);

      if(finishedDay >= next.totalDays){
        next.isGameOver = true;
        return normalizeState(next);
      }

      next.day = finishedDay + 1;
      next.timeIndex = 0;

      next.dailyOralCheckDone = false;
      next.mainActivityUsed = false;
      next.mainActivityLabel = null;
      next.mainActivityCount = 0;
      next.mainActivityLabels = [];

      next.dailyCompetition = emptyDailyCompetition();

      const ev = pickDailyEvent(next.lastEventId);

      next.dayStart = snapshotDay(next);
      next.dailyEvent = eventData(ev);
      next.lastEventId = ev.id;

      ev.apply(next);

      return normalizeState(next);
    });

    setSecondsLeft(SLOT_SECONDS);
    beep(880,.14);
  },[beep]);

  /* -----------------------------------------
     ADVANCE TIME
  ----------------------------------------- */

  const advanceTime = useCallback(()=>{
    if(advancingRef.current || game.isGameOver || blockingOverlay) return;

    advancingRef.current = true;

    if(game.timeIndex >= TIME_SLOTS.length - 1){
      finishDay();
    }else{
      setGame(prev=>{
        const next = clone(prev);
        next.timeIndex += 1;
        next.mainActivityUsed = false;
        next.mainActivityLabel = null;
        return normalizeState(next);
      });
      setSecondsLeft(SLOT_SECONDS);
      beep(700,.07);
    }

    setTimeout(()=>{ advancingRef.current = false; },50);
  },[game.isGameOver,game.timeIndex,blockingOverlay,finishDay,beep]);

  /* -----------------------------------------
     TIMER
  ----------------------------------------- */

  useEffect(()=>{
    if(
      !autoTime ||
      blockingOverlay ||
      game.isGameOver
    ){
      return;
    }

    const timer = setInterval(()=>{
      setSecondsLeft(prev=>{
        if(prev > 1){
          return prev - 1;
        }

        advanceTime();
        return SLOT_SECONDS;
      });
    },1000);

    return ()=>clearInterval(timer);
  },[
    autoTime,
    blockingOverlay,
    game.isGameOver,
    game.timeIndex,
    advanceTime
  ]);

  /* -----------------------------------------
     DAY CHANGE TOAST
  ----------------------------------------- */

  const previousDay = useRef(game.day);

  useEffect(()=>{
    if(game.day !== previousDay.current){
      if(game.day > 1){
        setToast(
          `📔 Nhật ký ngày ${game.day-1} đã chốt • ` +
          `${game.dailyEvent?.icon || "🎲"} ${game.dailyEvent?.title || "Ngày mới"}`
        );
      }
      previousDay.current = game.day;
    }
  },[game.day,game.dailyEvent]);

  /* -----------------------------------------
     GAME OVER
  ----------------------------------------- */

  useEffect(()=>{
    if(game.isGameOver){
      setOverlay("ending");
      setAutoTime(false);
    }
  },[game.isGameOver]);

  /* =========================================================
     ACTIONS
  ========================================================= */

  const selectQuizQuestions = useCallback((count)=>{
    const recent = new Set(game.recentQuestionIds || []);
    const usage = game.questionUsage || {};

    // Ưu tiên câu chưa dùng; nếu hết thì ưu tiên câu có lượt dùng thấp nhất.
    let pool = QUIZ_BANK.filter(q=>!recent.has(q.id));
    if(pool.length < count){
      pool = [...QUIZ_BANK];
    }

    const shuffled = shuffle(pool);
    shuffled.sort((a,b)=>(usage[a.id] || 0) - (usage[b.id] || 0));
    return shuffled.slice(0,count);
  },[game.recentQuestionIds,game.questionUsage]);

  const markQuestionsUsed = useCallback((questions)=>{
    updateGame(g=>{
      const ids = questions.map(q=>q.id);
      ids.forEach(id=>{
        g.questionUsage[id] = (g.questionUsage[id] || 0) + 1;
      });
      g.recentQuestionIds = [
        ...(g.recentQuestionIds || []),
        ...ids
      ].slice(-60);
    });
  },[updateGame]);

  const startQuiz = useCallback((mode="quick",cert=null)=>{
    if(!canDoMainActivity()) return;

    if(mode==="oral" && game.dailyOralCheckDone){
      setToast("🧑‍🏫 Bạn đã hoàn thành kiểm tra miệng hôm nay.");
      return;
    }

    const questions =
      mode==="cert"
        ? cert.questions.map((q,i)=>({
            ...q,
            id:`${cert.id}-${i}`
          }))
        : selectQuizQuestions(mode==="oral" ? 3 : 10);

    updateGame(g=>{
      g.mainActivityCount = Math.min(1, (g.mainActivityCount || 0) + 1);
      g.mainActivityLabel =
        mode==="oral" ? "Kiểm tra miệng" :
        mode==="cert" ? `Thi ${cert?.name || "chứng chỉ"}` :
        "Quiz nhanh";
      g.mainActivityLabels = [g.mainActivityLabel].slice(0,1);
      g.mainActivityUsed = g.mainActivityCount >= 1;

      if(mode==="oral"){
        g.dailyOralCheckDone = true;
        g.oralChecksDone++;
      }

      if(mode==="quick"){
        g.studyActions++;
        addStat(g,"energy",-3);
      }
    });

    if(mode !== "cert"){
      markQuestionsUsed(questions);
    }

    setQuiz({
      mode,
      certId:cert?.id || null,
      certName:cert?.name || null,
      questions,
      index:0,
      correct:0,
      wrong:0
    });

    setQuizFeedback(null);
    setOverlay(mode==="oral" ? "oral" : mode==="cert" ? "certExam" : "quiz");
  },[canDoMainActivity,game.dailyOralCheckDone,updateGame,selectQuizQuestions,markQuestionsUsed]);

  const answerQuiz = useCallback((choiceIndex)=>{
    if(!quiz || quizFeedback) return;

    const question = quiz.questions[quiz.index];
    const correct = choiceIndex === question.answer;

    if(correct){
      updateGame(g=>{
        addCompetition(g,5);
        addStat(g,"study",5);
      });
      beep(760,.08);
    }else{
      beep(180,.13);
      updateGame(g=>{
        addCompetition(g,-3);
        addStat(g,"study",-3);
      });
    }

    setQuizFeedback({
      correct,
      selected:choiceIndex,
      explanation:question.explanation
    });

    setQuiz(q=>({
      ...q,
      correct:q.correct + (correct ? 1 : 0),
      wrong:q.wrong + (correct ? 0 : 1)
    }));
  },[quiz,quizFeedback,beep,updateGame]);

  const nextQuizQuestion = useCallback(()=>{
    if(!quiz) return;

    const finalCorrect = quiz.correct;

    if(quiz.index >= quiz.questions.length - 1){

      if(quiz.mode==="quick"){
        updateGame(g=>{
          if(finalCorrect===5){
            addStat(g,"skill",2);
          }
        });

        setToast(
          `📚 Hoàn thành quiz: ${finalCorrect}/${quiz.questions.length} câu đúng`
        );
      }

      if(quiz.mode==="oral"){
        updateGame(g=>{
          if(finalCorrect===3){
            addStat(g,"reputation",4);
          }else if(finalCorrect===2){
            addStat(g,"reputation",2);
          }else if(finalCorrect===0){
            addStat(g,"mood",-4);
            addStat(g,"reputation",-2);
          }
        });

        setToast(
          `🧑‍🏫 Kiểm tra miệng: ${finalCorrect}/3 câu đúng`
        );
      }

      if(quiz.mode==="cert"){
        const cert = CERTS.find(c=>c.id===quiz.certId);

        if(cert){
          if(finalCorrect>=2){
            updateGame(g=>{
              if(!g.certificates.includes(cert.id)){
                g.certificates.push(cert.id);
              }

              addStat(g,"skill",3);
            });

            setToast(`🎓 Đậu ${cert.name}!`);
          }else{
            setToast(`❌ Chưa đạt ${cert.name}. Cần ít nhất 2/3.`);
          }
        }
      }

      setQuiz(null);
      setQuizFeedback(null);
      setOverlay(null);
      return;
    }

    setQuiz(q=>({
      ...q,
      index:q.index+1
    }));

    setQuizFeedback(null);
  },[quiz,updateGame]);

  const buyFashion = useCallback((item)=>{
    if(game.wardrobe.includes(item.id)){
      setToast("👕 Bạn đã sở hữu món này.");
      return;
    }

    if(game.stats.money < item.price){
      setToast("💸 Không đủ tiền.");
      return;
    }

    updateGame(g=>{
      g.wardrobe.push(item.id);
      addMoney(g,-item.price);

      Object.entries(item.bonus || {}).forEach(([key,val])=>{
        if(key==="energy"){
          addStat(g,"energy",val);
        }else if(key==="mood"){
          addStat(g,"mood",val);
        }else if(key==="study"){
          addStat(g,"study",val);
        }else if(key==="friends"){
          addStat(g,"friends",val);
        }else if(key==="love"){
          addStat(g,"love",val);
        }else if(key==="reputation"){
          addStat(g,"reputation",val);
        }else if(key==="skill"){
          addStat(g,"skill",val);
        }
      });
    });

    setToast(`🛍️ Đã mua ${item.name}!`);
  },[game,updateGame]);

  const equipFashion = useCallback((item)=>{
    updateGame(g=>{
      const map = {
        "Áo":"shirt",
        "Quần":"pants",
        "Giày":"shoes",
        "Balo":"bag",
        "Phụ kiện":"accessory",
        "Tóc":"hair"
      };

      const slot = map[item.category];

      if(slot){
        g.outfit[slot] = item.id;
      }
    });

    setToast(`✨ Đã mặc ${item.name}`);
  },[updateGame]);

  const unequipAccessory = useCallback(()=>{
    updateGame(g=>{
      g.outfit.accessory = null;
    });

    setToast("✨ Đã tháo phụ kiện.");
  },[updateGame]);

  const buyAsset = useCallback((asset)=>{
    if(game.assets.includes(asset.id)){
      setToast("🏠 Bạn đã sở hữu tài sản này.");
      return;
    }

    if(game.stats.money < asset.price){
      setToast("💸 Không đủ tiền mua.");
      return;
    }

    updateGame(g=>{
      g.assets.push(asset.id);
      addMoney(g,-asset.price);

      Object.entries(asset.bonus || {}).forEach(([key,val])=>{
        addStat(g,key,val);
      });
    });

    setToast(`🏠 Đã mua ${asset.name}!`);
  },[game,updateGame]);

  const buyFood = useCallback((item)=>{
    if(game.stats.money < item.price){
      setToast("💸 Không đủ tiền.");
      return;
    }

    updateGame(g=>{
      addMoney(g,-item.price);

      if(item.effect){
        Object.entries(item.effect).forEach(([key,val])=>{
          addStat(g,key,val);
        });
      }
    });

    setToast(`🍱 Đã mua ${item.name}.`);
  },[game.stats.money,updateGame]);

  const doJob = useCallback((job)=>{
    if(!job.can(game)){
      setToast("🔒 Chưa đủ điều kiện.");
      return;
    }

    if(game.stats.energy < job.energy){
      setToast("⚡ Không đủ năng lượng.");
      return;
    }

    if(!canDoMainActivity()) return;

    updateGame(g=>{
      if((g.mainActivityCount || 0) >= 1) return;
      job.apply(g);
      g.jobActions++;
      g.mainActivityCount = Math.min(1, (g.mainActivityCount || 0) + 1);
      g.mainActivityLabel = `Việc làm: ${job.name}`;
      g.mainActivityLabels = [g.mainActivityLabel].slice(0,1);
      g.mainActivityUsed = g.mainActivityCount >= 1;
    });

    setOverlay(null);
    setToast(
      `💼 ${job.name}: +${money(job.pay)}`
    );
  },[game,updateGame]);

  const interactNPC = useCallback((npc)=>{
    if(!canDoMainActivity()) return;

    if(game.stats.energy < 3){
      setToast("⚡ Bạn đang quá mệt.");
      return;
    }

    updateGame(g=>{
      if((g.mainActivityCount || 0) >= 1) return;
      addStat(g,"energy",-3);
      npc.apply(g);
      g.mainActivityCount = Math.min(1, (g.mainActivityCount || 0) + 1);
      g.mainActivityLabel = npc.action;
      g.mainActivityLabels = [g.mainActivityLabel].slice(0,1);
      g.mainActivityUsed = g.mainActivityCount >= 1;
    });

    setToast(`${npc.icon} ${npc.name}: ${npc.action}`);
  },[game.stats.energy,canDoMainActivity,updateGame]);

  const restAtHome = useCallback(()=>{
    if(!canDoMainActivity()) return;

    updateGame(g=>{
      if((g.mainActivityCount || 0) >= 1) return;
      addStat(g,"energy",25);
      addStat(g,"hp",5);
      addStat(g,"mood",5);
      g.mainActivityCount = Math.min(1, (g.mainActivityCount || 0) + 1);
      g.mainActivityLabel = "Nghỉ ngơi";
      g.mainActivityLabels = [g.mainActivityLabel].slice(0,1);
      g.mainActivityUsed = g.mainActivityCount >= 1;
    });

    setToast("🛏️ Nghỉ ngơi giúp bạn hồi phục.");
  },[canDoMainActivity,updateGame]);

  const useItem = useCallback((id)=>{
    updateGame(g=>{
      const item = g.bag.find(x=>x.id===id);

      if(!item || item.count<=0) return;

      if(id==="math_note"){
        addStat(g,"study",8);
        item.count--;
      }

      if(item.count<=0){
        g.bag = g.bag.filter(x=>x.id!==id);
      }
    });

    setToast("🎒 Đã sử dụng vật phẩm.");
  },[updateGame]);

  const startCertificate = useCallback((cert)=>{
    if(game.certificates.includes(cert.id)){
      setToast("🎓 Bạn đã có chứng chỉ này.");
      return;
    }

    if(game.stats.skill < cert.req){
      setToast(`🔒 Cần kỹ năng ≥ ${cert.req}.`);
      return;
    }

    if(game.stats.money < cert.fee){
      setToast("💸 Không đủ lệ phí.");
      return;
    }

    if(!canDoMainActivity()) return;

    updateGame(g=>{
      addMoney(g,-cert.fee);
    });

    startQuiz("cert",cert);
  },[game,updateGame,startQuiz,canDoMainActivity]);

  /* =========================================================
     SAVE FUNCTIONS
  ========================================================= */

  const createSaveCode = ()=>{
    const code = encodeSaveCode(game);
    setSaveCode(code);
    setToast("💾 Đã tạo mã lưu game.");
  };

  const loadSaveCode = ()=>{
    try{
      const loaded = normalizeState(decodeSaveCode(saveCode));

      setGame(loaded);
      setSecondsLeft(SLOT_SECONDS);
      setOverlay(null);
      setToast("✅ Đã nạp game thành công.");
    }catch{
      setToast("❌ Mã lưu không hợp lệ.");
    }
  };

  const exportJSON = ()=>{
    const blob = new Blob(
      [JSON.stringify(game,null,2)],
      {type:"application/json"}
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "thanh-xuan-ruc-ro-save.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const importJSON = (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = ()=>{
      try{
        const loaded = normalizeState(
          JSON.parse(reader.result)
        );

        setGame(loaded);
        setSecondsLeft(SLOT_SECONDS);
        setOverlay(null);
        setToast("✅ Đã nhập file save.");
      }catch{
        setToast("❌ File save không hợp lệ.");
      }
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const restart = ()=>{
    localStorage.removeItem(SAVE_KEY);

    const fresh = createInitialState();

    setGame(fresh);
    setSecondsLeft(SLOT_SECONDS);
    setAutoTime(true);
    setOverlay(null);
    setQuiz(null);
    setQuizFeedback(null);
    setSaveCode("");

    setToast("🌱 Hành trình mới bắt đầu!");
  };

  /* =========================================================
     QUICK ACTIVITIES
  ========================================================= */

  const quickActivities = [
    {
      icon:"📚",
      title:"Quiz 10 câu",
      desc:"Ôn tập 460 câu: 180 câu gốc + HSK 4–5 + English B1–B2",
      action:()=>startQuiz("quick")
    },
    {
      icon:"🧑‍🏫",
      title:"Kiểm tra miệng",
      desc:"3 câu / ngày",
      action:()=>startQuiz("oral"),
      disabled:false
    },
    {
      icon:"🍱",
      title:"Căn tin",
      desc:"Mua đồ ăn",
      action:()=>setOverlay("canteen")
    },
    {
      icon:"💼",
      title:"Việc làm",
      desc:"Kiếm tiền",
      action:()=>setOverlay("jobs")
    },
    {
      icon:"🎓",
      title:"Chứng chỉ",
      desc:"Mở nghề mới",
      action:()=>setOverlay("certs")
    },
    {
      icon:"👕",
      title:"Tủ đồ",
      desc:`${game.wardrobe.length} món`,
      action:()=>setOverlay("fashion")
    },
    {
      icon:"🏠",
      title:"Tài sản",
      desc:`${game.assets.length} tài sản`,
      action:()=>setOverlay("assets")
    },
    {
      icon:"🛏️",
      title:"Nghỉ ngơi",
      desc:"+25 năng lượng",
      action:restAtHome
    },
  ];

  /* =========================================================
     RENDER CHARACTER
  ========================================================= */

  const getFashion = (id)=>FASHION.find(x=>x.id===id);

  const characterParts = [
    getFashion(game.outfit.hair),
    getFashion(game.outfit.shirt),
    getFashion(game.outfit.pants),
    getFashion(game.outfit.shoes),
    getFashion(game.outfit.bag),
    getFashion(game.outfit.accessory)
  ].filter(Boolean);

  /* =========================================================
     SCENES
  ========================================================= */

  const renderClass = ()=>(
    <>
      <div className="event-card">
        <div className="event-icon">
          {game.dailyEvent?.icon || "🎲"}
        </div>

        <div>
          <div className="event-title">
            {game.dailyEvent?.title || "Ngày mới"}
          </div>

          <div className="muted">
            {game.dailyEvent?.text}
          </div>

          <div className="event-result">
            {game.dailyEvent?.result}
          </div>
        </div>
      </div>

      <div className="section-title">🏫 Hoạt động lớp học</div>

      <div className="activity-grid">
        {quickActivities.slice(0,4).map((a,i)=>(
          <button
            key={i}
            className="activity-card"
            onClick={a.action}
            disabled={a.disabled}
          >
            <span className="activity-icon">{a.icon}</span>
            <b>{a.title}</b>
            <small>{a.desc}</small>
          </button>
        ))}
      </div>

      <div className="section-title">👥 Bạn bè</div>

      <div className="npc-grid">
        {NPCS.map(npc=>(
          <div className="npc-card" key={npc.id}>
            <div className="npc-avatar">{npc.icon}</div>

            <div className="npc-info">
              <b>{npc.name}</b>
              <small>{npc.desc}</small>

              <div className="relationship">
                Quan hệ {game.relationships[npc.id] || 0}/100
              </div>

              <Button onClick={()=>interactNPC(npc)}>
                {npc.action}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderCanteen = ()=> {
    const foods = [
      {
        name:"Nước suối",
        icon:"💧",
        price:5000,
        effect:{energy:8}
      },
      {
        name:"Sữa",
        icon:"🥛",
        price:12000,
        effect:{energy:12,study:2}
      },
      {
        name:"Cơm",
        icon:"🍚",
        price:25000,
        effect:{energy:20,mood:5}
      },
      {
        name:"Bánh ngọt",
        icon:"🍰",
        price:18000,
        effect:{mood:8}
      },
      {
        name:"Trà sữa",
        icon:"🧋",
        price:30000,
        effect:{mood:10,energy:5}
      },
      {
        name:"Hamburger",
        icon:"🍔",
        price:35000,
        effect:{energy:25,mood:5}
      }
    ];

    return (
      <div className="card">
        <div className="section-title">🍱 Căn tin trường</div>

        <div className="shop-grid">
          {foods.map(item=>(
            <div className="shop-card" key={item.name}>
              <div className="shop-icon">{item.icon}</div>
              <b>{item.name}</b>
              <small>{money(item.price)}</small>

              <Button onClick={()=>buyFood(item)}>
                Mua
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderJobs = ()=>(
    <div className="card">
      <div className="section-title">💼 Việc làm thêm</div>

      <div className="job-grid">
        {JOBS.map(job=>{
          const available = job.can(game);
          const enoughEnergy = game.stats.energy >= job.energy;

          return (
            <div className={`job-card ${!available ? "locked" : ""}`} key={job.id}>
              <div className="job-icon">{job.icon}</div>

              <div className="job-content">
                <b>{job.name}</b>
                <small>{job.desc}</small>

                <div className="job-meta">
                  💰 {money(job.pay)}
                  &nbsp; ⚡ -{job.energy}
                </div>

                <Button
                  disabled={!available || !enoughEnergy}
                  onClick={()=>doJob(job)}
                >
                  {!available ? "🔒 Chưa đủ điều kiện" :
                   !enoughEnergy ? "⚡ Thiếu năng lượng" :
                   "Nhận việc"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCerts = ()=>(
    <div className="card">
      <div className="section-title">🎓 Trung tâm chứng chỉ</div>

      <div className="cert-grid">
        {CERTS.map(cert=>{
          const owned = game.certificates.includes(cert.id);
          const enoughSkill = game.stats.skill >= cert.req;
          const enoughMoney = game.stats.money >= cert.fee;

          return (
            <div className={`cert-card ${owned ? "owned" : ""}`} key={cert.id}>
              <div className="cert-icon">{cert.icon}</div>
              <b>{cert.name}</b>
              <small>{cert.desc}</small>

              <div>
                Kỹ năng: <b>{cert.req}</b>
              </div>

              <div>
                Lệ phí: <b>{money(cert.fee)}</b>
              </div>

              <Button
                disabled={owned || !enoughSkill || !enoughMoney}
                onClick={()=>startCertificate(cert)}
              >
                {owned ? "✅ Đã có" :
                 !enoughSkill ? "🔒 Thiếu kỹ năng" :
                 !enoughMoney ? "💸 Thiếu tiền" :
                 "📝 Thi"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAssets = ()=>(
    <div className="card">
      <div className="section-title">🏠 Cửa hàng tài sản</div>

      <div className="asset-grid">
        {ASSETS.map(asset=>{
          const owned = game.assets.includes(asset.id);

          return (
            <div className={`asset-card ${owned ? "owned" : ""}`} key={asset.id}>
              <div className="asset-icon">{asset.icon}</div>
              <b>{asset.name}</b>
              <small>{asset.desc}</small>
              <strong>{money(asset.price)}</strong>

              <Button
                disabled={owned || game.stats.money < asset.price}
                onClick={()=>buyAsset(asset)}
              >
                {owned ? "✅ Đã sở hữu" :
                 game.stats.money < asset.price ? "💸 Thiếu tiền" :
                 "Mua"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFashion = ()=>(
    <div className="fashion-page">

      <div className="fashion-preview">
        <div className="section-title">👕 Nhân vật của bạn</div>

        <div className="character female-character">
          <div className="female-avatar">👩🏻‍🎓</div>
          <div className="worn-clothes">
            <span className="worn-shirt">{getFashion(game.outfit.shirt)?.icon || "👕"}</span>
            <span className="worn-bottom">{getFashion(game.outfit.pants)?.icon || "👖"}</span>
            <span className="worn-shoes">{getFashion(game.outfit.shoes)?.icon || "👟"}</span>
          </div>
          {game.outfit.bag && (
            <span className="worn-bag">{getFashion(game.outfit.bag)?.icon || "🎒"}</span>
          )}
          {game.outfit.accessory && (
            <span className="worn-accessory">{getFashion(game.outfit.accessory)?.icon || ""}</span>
          )}
          <div className="female-outfit-caption">
            {getFashion(game.outfit.hair)?.name || "Tóc tự nhiên"}
          </div>
        </div>

        <div className="outfit-list">
          {[
            ["Áo",game.outfit.shirt],
            ["Quần",game.outfit.pants],
            ["Giày",game.outfit.shoes],
            ["Balo",game.outfit.bag],
            ["Tóc",game.outfit.hair],
            ["Phụ kiện",game.outfit.accessory]
          ].map(([label,id])=>(
            <div className="outfit-row" key={label}>
              <span>{label}</span>
              <b>
                {id
                  ? getFashion(id)?.name || "Không có"
                  : "Không mặc"}
              </b>
            </div>
          ))}

          {game.outfit.accessory && (
            <Button onClick={unequipAccessory}>
              Tháo phụ kiện
            </Button>
          )}
        </div>
      </div>

      <div className="fashion-shop">

        <div className="fashion-head">
          <div>
            <div className="section-title">🛍️ Cửa hàng thời trang</div>
            <small>
              Đã sở hữu {game.wardrobe.length}/{FASHION.length} món
            </small>
          </div>

          <div className="money-pill">
            💰 {money(game.stats.money)}
          </div>
        </div>

        <div className="category-tabs">
          {FASHION_CATEGORIES.map(cat=>(
            <button
              key={cat}
              className={fashionCategory===cat ? "active" : ""}
              onClick={()=>setFashionCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="fashion-grid">
          {visibleFashion.map(item=>{
            const owned = game.wardrobe.includes(item.id);

            const slotMap = {
              "Áo":"shirt",
              "Quần":"pants",
              "Giày":"shoes",
              "Balo":"bag",
              "Phụ kiện":"accessory",
              "Tóc":"hair"
            };

            const equipped =
              game.outfit[slotMap[item.category]] === item.id;

            return (
              <div
                className={`fashion-card ${
                  owned ? "owned" : ""
                } ${equipped ? "equipped" : ""}`}
                key={item.id}
              >
                <div className="fashion-icon">
                  {item.icon}
                </div>

                <b>{item.name}</b>
                <small>{item.desc}</small>

                <div className="fashion-bonus">
                  {Object.entries(item.bonus || {}).map(([k,v])=>(
                    <span key={k}>
                      +{v} {k}
                    </span>
                  ))}
                </div>

                <strong>
                  {item.price===0 ? "Miễn phí" : money(item.price)}
                </strong>

                {!owned ? (
                  <Button
                    disabled={game.stats.money < item.price}
                    onClick={()=>buyFashion(item)}
                  >
                    🛍️ Mua
                  </Button>
                ) : (
                  <Button
                    className={equipped ? "success" : ""}
                    onClick={()=>equipFashion(item)}
                  >
                    {equipped ? "✅ Đang mặc" : "👕 Mặc"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderHome = ()=>(
    <div className="home-grid">
      <div className="card home-card">
        <div className="big-icon">🛏️</div>
        <h2>Phòng ngủ</h2>
        <p>
          Nghỉ ngơi sau một ngày học tập và làm việc.
        </p>

        <Button onClick={restAtHome}>
          🛏️ Nghỉ ngơi +25 năng lượng
        </Button>

        <Button onClick={()=>setOverlay("diary")}>
          📔 Xem nhật ký
        </Button>
      </div>

      <div className="card">
        <div className="section-title">🏆 Thành tích hôm nay</div>

        <div className="mini-stat">
          📚 Lần học: <b>{game.studyActions}</b>
        </div>

        <div className="mini-stat">
          💼 Lần làm việc: <b>{game.jobActions}</b>
        </div>

        <div className="mini-stat">
          👕 Thời trang: <b>{game.wardrobe.length}</b>
        </div>

        <div className="mini-stat">
          🏠 Tài sản: <b>{game.assets.length}</b>
        </div>
      </div>
    </div>
  );

  /* =========================================================
     MAIN SCENE
  ========================================================= */

  const renderLocation = ()=>{
    if(game.location==="class") return renderClass();
    if(game.location==="canteen") return renderCanteen();
    if(game.location==="jobs") return renderJobs();
    if(game.location==="cert") return renderCerts();
    if(game.location==="property") return renderAssets();
    if(game.location==="home") return renderHome();

    return renderClass();
  };

  /* =========================================================
     OVERLAYS
  ========================================================= */

  const renderQuizOverlay = ()=>{
    if(!quiz) return null;

    const q = quiz.questions[quiz.index];

    return (
      <Modal
        title={
          quiz.mode==="oral"
            ? "🧑‍🏫 Kiểm tra miệng — 15 phút"
            : quiz.mode==="cert"
            ? `🎓 Thi ${quiz.certName}`
            : "📚 Quiz nhanh"
        }
        onClose={()=>{
          setQuiz(null);
          setQuizFeedback(null);
          setOverlay(null);
        }}
      >
        <div className="quiz-top">
          <span>
            Câu {quiz.index+1}/{quiz.questions.length}
          </span>

          <span>
            ✅ {quiz.correct} &nbsp; ❌ {quiz.wrong}
          </span>
        </div>

        <div className="quiz-question">
          <div className="quiz-subject">
            {q.subject || q.topic || "Kiến thức"}
          </div>

          <h2>{q.q}</h2>
        </div>

        <div className="choices">
          {q.choices.map((choice,index)=>{
            const isCorrect =
              quizFeedback &&
              index===q.answer;

            const isWrong =
              quizFeedback &&
              index===quizFeedback.selected &&
              !quizFeedback.correct;

            return (
              <button
                key={index}
                className={`choice ${
                  isCorrect ? "correct" : ""
                } ${isWrong ? "wrong" : ""}`}
                disabled={Boolean(quizFeedback)}
                onClick={()=>answerQuiz(index)}
              >
                <span>
                  {String.fromCharCode(65+index)}.
                </span>
                {choice}
              </button>
            );
          })}
        </div>

        {quizFeedback && (
          <div className={`feedback ${
            quizFeedback.correct ? "good" : "bad"
          }`}>
            <b>
              {quizFeedback.correct
                ? "✅ Chính xác! +5 điểm thành tích • +5 điểm tri thức"
                : "❌ Sai! -3 điểm thành tích • -3 điểm tri thức"}
            </b>

            <p>{quizFeedback.explanation}</p>

            <Button onClick={nextQuizQuestion}>
              {quiz.index >= quiz.questions.length-1
                ? "🏁 Hoàn thành"
                : "➡️ Câu tiếp theo"}
            </Button>
          </div>
        )}
      </Modal>
    );
  };

  const renderSaveModal = ()=>(
    <Modal
      title="💾 Lưu / Nạp game"
      onClose={()=>setOverlay(null)}
    >
      <div className="save-actions">
        <Button onClick={createSaveCode}>
          🔐 Tạo mã lưu
        </Button>

        <Button onClick={exportJSON}>
          📥 Xuất file JSON
        </Button>
      </div>

      <textarea
        className="save-text"
        value={saveCode}
        onChange={e=>setSaveCode(e.target.value)}
        placeholder="Mã lưu game sẽ xuất hiện ở đây..."
      />

      <div className="save-actions">
        <Button
          onClick={()=>{
            if(navigator.clipboard && saveCode){
              navigator.clipboard.writeText(saveCode);
              setToast("📋 Đã sao chép mã.");
            }
          }}
        >
          📋 Sao chép
        </Button>

        <Button onClick={loadSaveCode}>
          📤 Nạp mã
        </Button>

        <label className="game-btn file-btn">
          📁 Nhập JSON
          <input
            type="file"
            accept=".json"
            onChange={importJSON}
            hidden
          />
        </label>
      </div>

      <div className="save-tip">
        💡 Game cũng tự động lưu vào trình duyệt.
      </div>
    </Modal>
  );

  const renderBagModal = ()=>(
    <Modal
      title="🎒 Túi đồ"
      onClose={()=>setOverlay(null)}
    >
      {game.bag.length===0 ? (
        <div className="empty">
          🎒 Túi đang trống.
        </div>
      ) : (
        <div className="bag-grid">
          {game.bag.map(item=>(
            <div className="bag-card" key={item.id}>
              <div className="bag-icon">{item.icon}</div>
              <b>{item.name}</b>
              <small>{item.desc}</small>
              <span>x{item.count}</span>

              <Button onClick={()=>useItem(item.id)}>
                Dùng
              </Button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );

  const renderCompetitionModal = ()=>(
    <Modal
      title="🏆 Bảng thi đua"
      onClose={()=>setOverlay(null)}
    >
      <div className="leaderboard">
        {leaderboard.map((row,index)=>(
          <div
            className={`rank-row ${
              row.id==="player" ? "player-rank" : ""
            }`}
            key={row.id}
          >
            <div className="rank-number">
              #{index+1}
            </div>

            <div className="rank-name">
              {row.icon} {row.name}
            </div>

            <div className="rank-points">
              <b>{row.points}</b>
              <small>+{row.today} hôm nay</small>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );

  const renderTitlesModal = ()=>(
    <Modal
      title="🏅 Danh hiệu"
      onClose={()=>setOverlay(null)}
    >
      <div className="title-grid">
        {TITLES.map(title=>{
          const unlocked = title.condition(game);
          const selected = game.selectedTitle===title.id;

          return (
            <button
              key={title.id}
              disabled={!unlocked}
              className={`title-card ${
                unlocked ? "unlocked" : "locked"
              } ${selected ? "selected" : ""}`}
              onClick={()=>{
                if(!unlocked) return;

                updateGame(g=>{
                  g.selectedTitle=title.id;
                });

                setToast(`🏅 Danh hiệu: ${title.name}`);
              }}
            >
              <span>{title.icon}</span>
              <b>{title.name}</b>
              <small>{title.desc}</small>

              {selected && <em>Đang dùng</em>}
            </button>
          );
        })}
      </div>
    </Modal>
  );

  const renderDiaryModal = ()=>(
    <Modal
      title="📔 Nhật ký thanh xuân"
      onClose={()=>setOverlay(null)}
      wide
    >
      {game.diaryEntries.length===0 ? (
        <div className="empty">
          Chưa có ngày nào kết thúc.
        </div>
      ) : (
        <div className="diary-list">
          {game.diaryEntries.map(entry=>(
            <div className="diary-card" key={entry.id}>
              <div className="diary-head">
                <b>📅 Ngày {entry.day}</b>
                <span>{entry.event}</span>
              </div>

              <p>{entry.summary}</p>

              <div className="delta-grid">
                <span>📚 {signed(entry.deltas.study)}</span>
                <span>💰 {signed(entry.deltas.money)}đ</span>
                <span>🤝 {signed(entry.deltas.friends)}</span>
                <span>⚡ {signed(entry.deltas.energy)}</span>
                <span>😊 {signed(entry.deltas.mood)}</span>
                <span>🏆 {signed(entry.deltas.competition)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );

  const renderProfileModal = ()=>(
    <Modal
      title="👤 Hồ sơ nhân vật"
      onClose={()=>setOverlay(null)}
      wide
    >
      <div className="profile-layout">
        <div className="profile-character">
          <div className="big-character female-profile-character">
            <div className="female-avatar">👩🏻‍🎓</div>
            <div>{getFashion(game.outfit.shirt)?.icon || "👕"}</div>
            <div>{getFashion(game.outfit.pants)?.icon || "👖"}</div>
            <div>{getFashion(game.outfit.shoes)?.icon || "👟"}</div>
          </div>

          <h2>
            {currentTitle.icon} {currentTitle.name}
          </h2>
        </div>

        <div className="profile-stats">
          <StatBar icon="❤️" label="HP" value={game.stats.hp}/>
          <StatBar icon="⚡" label="Năng lượng" value={game.stats.energy}/>
          <StatBar icon="😊" label="Tâm trạng" value={game.stats.mood}/>
          <StatBar icon="📚" label="Kiến thức" value={game.stats.study}/>
          <StatBar icon="🤝" label="Bạn bè" value={game.stats.friends}/>
          <StatBar icon="💗" label="Tình cảm" value={game.stats.love}/>
          <StatBar icon="⭐" label="Danh tiếng" value={game.stats.reputation}/>
          <StatBar icon="🛠️" label="Kỹ năng" value={game.stats.skill} max={500}/>
        </div>
      </div>
    </Modal>
  );

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="game-root">
       <style>{CSS}</style>

      <div className="game-shell">

        {/* HEADER */}
        <header className="header">

          <div className="brand">
            <div className="brand-icon">🌸</div>

            <div>
              <h1>Thanh Xuân Rực Rỡ</h1>
              <small>
                Deluxe Career & Fashion Edition
              </small>
            </div>
          </div>

          <div className="header-actions">

            <button
              className="top-btn"
              onClick={()=>setOverlay("profile")}
            >
              👤
            </button>

            <button
              className="top-btn"
              onClick={()=>setOverlay("fashion")}
            >
              👕
            </button>

            <button
              className="top-btn"
              onClick={()=>setOverlay("bag")}
            >
              🎒
            </button>

            <button
              className="top-btn"
              onClick={()=>setOverlay("save")}
            >
              💾
            </button>

          </div>

        </header>

        {/* TIME BAR */}
        <div className="time-panel">

          <div className="time-main">
            <div>
              <span className="day-label">
                NGÀY {game.day}/{game.totalDays}
              </span>

              <strong>
                🕒 {currentTime}
              </strong>

              <small>
                {PERIOD_NAMES[game.timeIndex]}
              </small>
            </div>

            <div className="countdown">
              <span>Còn</span>
              <b>
                00:{String(secondsLeft).padStart(2,"0")}
              </b>
              <small>
                {game.mainActivityCount ? "🔒 Đã dùng hoạt động chính" : "🔓 Còn 1 hoạt động chính"}
                {game.mainActivityLabels?.length
                  ? ` • ${game.mainActivityLabels.join(" • ")}`
                  : ""}
              </small>
            </div>
          </div>

          <div className="time-progress">
            <div
              style={{
                width:`${(secondsLeft/SLOT_SECONDS)*100}%`
              }}
            />
          </div>

          <div className="schedule-row">
            {TIME_SLOTS.map((time,index)=>(
              <div
                key={time}
                className={`schedule-dot ${
                  index===game.timeIndex ? "current" : ""
                } ${
                  index<game.timeIndex ? "passed" : ""
                }`}
                title={time}
              >
                <span>{time}</span>
              </div>
            ))}
          </div>

        </div>

        {/* HUD */}
        <div className="hud">

          <div className="hud-stat">
            ❤️ <b>{Math.round(game.stats.hp)}</b>
          </div>

          <div className="hud-stat">
            ⚡ <b>{Math.round(game.stats.energy)}</b>
          </div>

          <div className="hud-stat">
            😊 <b>{Math.round(game.stats.mood)}</b>
          </div>

          <div className="hud-stat">
            📚 <b>{Math.round(game.stats.study)}</b>
          </div>

          <div className="hud-stat">
            🤝 <b>{Math.round(game.stats.friends)}</b>
          </div>

          <div className="hud-stat">
            ⭐ <b>{Math.round(game.stats.reputation)}</b>
          </div>

          <div className="hud-money">
            💰 {money(game.stats.money)}
          </div>

          <button
            className="auto-btn"
            onClick={()=>setAutoTime(v=>!v)}
            disabled={game.isGameOver}
          >
            {autoTime ? "⏱ Tự chạy" : "⏸ Tạm dừng"}
          </button>

        </div>

        {/* CONTENT */}
        <main className="content">

          <section className="scene">

            <div className="scene-top">

              <div>
                <div className="location-title">
                  {game.location==="class" && "🏫 Lớp học"}
                  {game.location==="canteen" && "🍱 Căn tin"}
                  {game.location==="jobs" && "💼 Việc làm"}
                  {game.location==="cert" && "🎓 Chứng chỉ"}
                  {game.location==="property" && "🏠 Tài sản"}
                  {game.location==="home" && "🏠 Nhà"}
                </div>

                <small>
                  {currentTitle.icon} {currentTitle.name}
                </small>
              </div>

              <button
                className="activity-launch"
                onClick={()=>setOverlay("activities")}
              >
                ⚡ Hoạt động
              </button>

            </div>

            {renderLocation()}

          </section>

          {/* SIDE */}
          <aside className="side">

            <div className="character-card">

              <div className="mini-character">

                <div>
                  {getFashion(game.outfit.hair)?.icon}
                </div>

                <div>
                  {getFashion(game.outfit.shirt)?.icon}
                </div>

                <div>
                  {getFashion(game.outfit.pants)?.icon}
                </div>

                <div>
                  {getFashion(game.outfit.shoes)?.icon}
                </div>

                <div className="mini-accessory">
                  {getFashion(game.outfit.accessory)?.icon}
                </div>

              </div>

              <b>
                {currentTitle.icon} {currentTitle.name}
              </b>

              <small>
                👕 {ownedFashion.length} món thời trang
              </small>

            </div>

            <div className="side-card">

              <div className="side-title">
                ⚡ Truy cập nhanh
              </div>

              <div className="quick-buttons">

                <button onClick={()=>setOverlay("activities")}>
                  ⚡ Hoạt động
                </button>

                <button onClick={()=>setOverlay("fashion")}>
                  👕 Tủ đồ
                </button>

                <button onClick={()=>setOverlay("bag")}>
                  🎒 Túi
                </button>

                <button onClick={()=>setOverlay("diary")}>
                  📔 Nhật ký
                </button>

                <button onClick={()=>setOverlay("competition")}>
                  🏆 Thi đua
                </button>

                <button onClick={()=>setOverlay("titles")}>
                  🏅 Danh hiệu
                </button>

                <button onClick={()=>setOverlay("save")}>
                  💾 Lưu game
                </button>

                <button onClick={()=>setOverlay("profile")}>
                  👤 Nhân vật
                </button>

              </div>

            </div>

            <div className="side-card">

              <div className="side-title">
                🗺️ Khu vực
              </div>

              <div className="location-buttons">

                <button
                  className={game.location==="class" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"class"}))}
                >
                  🏫 Lớp
                </button>

                <button
                  className={game.location==="canteen" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"canteen"}))}
                >
                  🍱 Căn tin
                </button>

                <button
                  className={game.location==="jobs" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"jobs"}))}
                >
                  💼 Việc
                </button>

                <button
                  className={game.location==="cert" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"cert"}))}
                >
                  🎓 Thi
                </button>

                <button
                  className={game.location==="property" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"property"}))}
                >
                  🏠 Tài sản
                </button>

                <button
                  className={game.location==="home" ? "active":""}
                  onClick={()=>setGame(g=>({...g,location:"home"}))}
                >
                  🛏️ Nhà
                </button>

              </div>

            </div>

            <div className="side-card">

              <div className="side-title">
                🏆 Thi đua
              </div>

              <div className="competition-score">
                <strong>{game.competitionPoints}</strong>
                <span>điểm</span>
              </div>

              <Button onClick={()=>setOverlay("competition")}>
                Xem bảng xếp hạng
              </Button>

            </div>

          </aside>

        </main>

        {/* FOOTER NAV */}
        <footer className="footer-nav">

          <button
            className={game.location==="class" ? "active":""}
            onClick={()=>setGame(g=>({...g,location:"class"}))}
          >
            🏫
            <span>Lớp</span>
          </button>

          <button
            onClick={()=>setOverlay("activities")}
          >
            ⚡
            <span>Hoạt động</span>
          </button>

          <button
            onClick={()=>setOverlay("fashion")}
          >
            👕
            <span>Tủ đồ</span>
          </button>

          <button
            onClick={()=>setOverlay("bag")}
          >
            🎒
            <span>Túi</span>
          </button>

          <button
            onClick={()=>setOverlay("competition")}
          >
            🏆
            <span>Thi đua</span>
          </button>

          <button
            onClick={()=>setOverlay("save")}
          >
            💾
            <span>Lưu</span>
          </button>

        </footer>

      </div>

      {/* TOAST */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      {/* =====================================================
          QUICK ACTIVITY MODAL
      ===================================================== */}

      {overlay==="activities" && (
        <Modal
          title="⚡ Tất cả hoạt động"
          onClose={()=>setOverlay(null)}
          wide
        >
          <div className="activity-grid large">

            {quickActivities.map((a,i)=>{
              const isMain =
                ["Quiz 10 câu","Kiểm tra miệng","Nghỉ ngơi","Việc làm"].includes(a.title);

              const blocked =
                Boolean(a.disabled) ||
                (isMain && (game.mainActivityCount || 0) >= 1);

              return (
                <button
                  key={i}
                  className="activity-card"
                  disabled={blocked}
                  onClick={()=>a.action()}
                >
                  <span className="activity-icon">{a.icon}</span>
                  <b>{a.title}</b>
                  <small>
                    {isMain && (game.mainActivityCount || 0) >= 1
                      ? `🔒 Đã dùng mốc ${currentTime}`
                      : a.desc}
                  </small>
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {overlay==="fashion" && (
        <Modal
          title="👕 Tủ đồ thời trang"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderFashion()}
        </Modal>
      )}

      {overlay==="bag" && renderBagModal()}

      {overlay==="profile" && renderProfileModal()}

      {overlay==="save" && renderSaveModal()}

      {overlay==="competition" && renderCompetitionModal()}

      {overlay==="titles" && renderTitlesModal()}

      {overlay==="diary" && renderDiaryModal()}

      {overlay==="canteen" && (
        <Modal
          title="🍱 Căn tin"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderCanteen()}
        </Modal>
      )}

      {overlay==="jobs" && (
        <Modal
          title="💼 Việc làm"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderJobs()}
        </Modal>
      )}

      {overlay==="certs" && (
        <Modal
          title="🎓 Chứng chỉ"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderCerts()}
        </Modal>
      )}

      {overlay==="assets" && (
        <Modal
          title="🏠 Tài sản"
          onClose={()=>setOverlay(null)}
          wide
        >
          {renderAssets()}
        </Modal>
      )}

      {(overlay==="quiz" ||
        overlay==="oral" ||
        overlay==="certExam") &&
        renderQuizOverlay()
      }

      {/* =====================================================
          GAME OVER
      ===================================================== */}

      {overlay==="ending" && (
        <Modal
          title="✨ Thanh xuân đã hoàn thành!"
          onClose={null}
          wide
        >
          <div className="ending">

            <div className="ending-icon">
              🌸
            </div>

            <h1>
              Hành trình 45 ngày đã kết thúc
            </h1>

            <p>
              Bạn đã đi qua một hành trình học tập,
              tình bạn, công việc và những lựa chọn
              rất riêng của tuổi học trò.
            </p>

            <div className="ending-stats">

              <div>
                <b>{Math.round(game.stats.study)}</b>
                <span>📚 Kiến thức</span>
              </div>

              <div>
                <b>{Math.round(game.stats.skill)}</b>
                <span>🛠️ Kỹ năng</span>
              </div>

              <div>
                <b>{game.competitionPoints}</b>
                <span>🏆 Thi đua</span>
              </div>

              <div>
                <b>{game.wardrobe.length}</b>
                <span>👕 Thời trang</span>
              </div>

              <div>
                <b>{game.assets.length}</b>
                <span>🏠 Tài sản</span>
              </div>

              <div>
                <b>{game.certificates.length}</b>
                <span>🎓 Chứng chỉ</span>
              </div>

            </div>

            <div className="final-title">
              {currentTitle.icon} {currentTitle.name}
            </div>

            <Button onClick={restart}>
              🌱 Chơi lại từ đầu
            </Button>

            <Button onClick={()=>setOverlay("diary")}>
              📔 Xem lại nhật ký
            </Button>

          </div>
        </Modal>
      )}

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
}

body{
  overflow:hidden;
  background:#f2eaff;
}

button,
input,
textarea{
  font:inherit;
}

button{
  cursor:pointer;
}

button:disabled{
  cursor:not-allowed;
  opacity:.48;
}

.game-root{
  width:100%;
  height:100dvh;
  padding:8px;
  display:flex;
  justify-content:center;
  align-items:center;
  background:
    radial-gradient(circle at 10% 10%,#f8ddff 0,transparent 32%),
    radial-gradient(circle at 90% 80%,#dce9ff 0,transparent 35%),
    linear-gradient(135deg,#f5edff,#edf5ff);
}

.game-shell{
  width:min(1100px,100%);
  height:calc(100dvh - 16px);
  min-height:0;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:rgba(255,255,255,.92);
  border:1px solid rgba(130,90,180,.15);
  border-radius:20px;
  box-shadow:0 20px 70px rgba(71,38,110,.16);
}

/* HEADER */

.header{
  flex:none;
  min-height:62px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:9px 13px;
  background:linear-gradient(110deg,#6f42c1,#9c5de8,#ef75b9);
  color:white;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
}

.brand-icon{
  width:40px;
  height:40px;
  display:grid;
  place-items:center;
  border-radius:13px;
  background:rgba(255,255,255,.18);
  font-size:23px;
}

.brand h1{
  margin:0;
  font-size:17px;
  line-height:1.1;
}

.brand small{
  opacity:.84;
  font-size:10px;
}

.header-actions{
  display:flex;
  gap:5px;
}

.top-btn{
  width:36px;
  height:34px;
  border:0;
  border-radius:10px;
  background:rgba(255,255,255,.17);
  color:white;
  transition:.15s;
}

.top-btn:hover{
  background:rgba(255,255,255,.3);
  transform:translateY(-1px);
}

/* TIME */

.time-panel{
  flex:none;
  padding:8px 12px 6px;
  background:#fff;
  border-bottom:1px solid #eee7f8;
}

.time-main{
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.day-label{
  display:block;
  font-size:9px;
  color:#8057a8;
  font-weight:800;
  letter-spacing:.5px;
}

.time-main strong{
  display:inline-block;
  margin-right:7px;
  font-size:18px;
  color:#30243d;
}

.time-main small{
  color:#8d8197;
  font-size:10px;
}

.countdown{
  display:flex;
  flex-direction:column;
  align-items:flex-end;
}

.countdown span{
  font-size:9px;
  color:#9b90a4;
}

.countdown b{
  font-size:20px;
  color:#7b3fc2;
  font-variant-numeric:tabular-nums;
}

.time-progress{
  height:5px;
  margin-top:5px;
  overflow:hidden;
  background:#eee8f7;
  border-radius:99px;
}

.time-progress div{
  height:100%;
  background:linear-gradient(90deg,#7751d8,#e96fb4);
  transition:width .8s linear;
}

.schedule-row{
  display:flex;
  gap:3px;
  margin-top:6px;
  overflow:hidden;
}

.schedule-dot{
  flex:1;
  min-width:28px;
  height:20px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:6px;
  background:#f4f1f8;
  color:#a098a7;
  font-size:7px;
}

.schedule-dot.current{
  background:#e9dcff;
  color:#713db3;
  font-weight:800;
  box-shadow:inset 0 0 0 1px #b994eb;
}

.schedule-dot.passed{
  background:#eeeaf3;
  color:#777;
}

/* HUD */

.hud{
  flex:none;
  display:flex;
  align-items:center;
  gap:5px;
  padding:6px 10px;
  background:#faf8fd;
  border-bottom:1px solid #eee7f8;
  overflow-x:auto;
}

.hud-stat,
.hud-money,
.auto-btn{
  flex:none;
  height:29px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:4px;
  padding:0 9px;
  border-radius:9px;
  font-size:10px;
  border:1px solid #e9e1f1;
  background:white;
}

.hud-money{
  color:#8150b5;
  font-weight:800;
}

.auto-btn{
  border:0;
  color:white;
  background:#6d49bc;
  font-weight:700;
}

/* CONTENT */

.content{
  flex:1;
  min-height:0;
  display:grid;
  grid-template-columns:minmax(0,1fr) 275px;
  gap:8px;
  padding:8px;
  overflow:hidden;
}

.scene{
  min-width:0;
  min-height:0;
  overflow:auto;
  padding-right:2px;
}

.side{
  min-width:0;
  min-height:0;
  overflow:auto;
}

/* SCENE */

.scene-top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:8px;
}

.location-title{
  font-size:18px;
  font-weight:900;
  color:#3a2a46;
}

.scene-top small{
  color:#8d8197;
  font-size:10px;
}

.activity-launch{
  border:0;
  padding:9px 12px;
  border-radius:11px;
  background:linear-gradient(135deg,#7548ca,#e66db2);
  color:white;
  font-weight:800;
  box-shadow:0 6px 15px rgba(120,70,180,.18);
}

/* CARDS */

.card,
.side-card,
.character-card,
.event-card,
.home-card{
  background:white;
  border:1px solid #eee7f5;
  border-radius:14px;
  padding:11px;
  margin-bottom:8px;
  box-shadow:0 3px 12px rgba(55,30,80,.035);
}

.section-title{
  margin-bottom:8px;
  color:#4c3561;
  font-weight:900;
  font-size:13px;
}

.muted{
  color:#8d8294;
  font-size:11px;
  line-height:1.45;
}

.event-card{
  display:flex;
  gap:10px;
  background:linear-gradient(135deg,#fff9ff,#f6f0ff);
}

.event-icon{
  width:42px;
  height:42px;
  flex:none;
  display:grid;
  place-items:center;
  border-radius:12px;
  background:#eadcff;
  font-size:22px;
}

.event-title{
  font-weight:900;
  color:#5b3a79;
  margin-bottom:3px;
}

.event-result{
  margin-top:5px;
  color:#7c4cab;
  font-size:10px;
  font-weight:700;
}

/* BUTTON */

.game-btn{
  width:100%;
  border:0;
  padding:7px 9px;
  border-radius:9px;
  background:#7650bd;
  color:white;
  font-weight:700;
  font-size:10px;
  transition:.15s;
}

.game-btn:hover:not(:disabled){
  transform:translateY(-1px);
  filter:brightness(1.04);
}

.game-btn.success{
  background:#42a36a;
}

/* ACTIVITY */

.activity-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:7px;
  margin-bottom:10px;
}

.activity-grid.large{
  grid-template-columns:repeat(4,minmax(0,1fr));
}

.activity-card{
  min-width:0;
  border:1px solid #eee4f5;
  border-radius:12px;
  padding:10px 7px;
  background:linear-gradient(145deg,#fff,#faf6ff);
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:3px;
  color:#44354e;
  transition:.15s;
}

.activity-card:hover:not(:disabled){
  border-color:#bd9de2;
  transform:translateY(-2px);
  box-shadow:0 7px 16px rgba(90,50,130,.08);
}

.activity-icon{
  font-size:24px;
}

.activity-card b{
  font-size:10px;
}

.activity-card small{
  color:#978c9d;
  font-size:8px;
}

/* NPC */

.npc-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:7px;
}

.npc-card{
  display:flex;
  gap:8px;
  padding:9px;
  border:1px solid #eee7f4;
  border-radius:12px;
  background:#fff;
}

.npc-avatar{
  width:38px;
  height:38px;
  flex:none;
  display:grid;
  place-items:center;
  border-radius:11px;
  background:#f1e9fb;
  font-size:20px;
}

.npc-info{
  min-width:0;
  flex:1;
}

.npc-info b{
  display:block;
  font-size:11px;
}

.npc-info small{
  display:block;
  min-height:27px;
  color:#8e8495;
  font-size:8px;
  line-height:1.3;
}

.relationship{
  color:#9a61c1;
  font-size:8px;
  margin-bottom:5px;
}

/* SIDE */

.character-card{
  text-align:center;
}

.mini-character{
  position:relative;
  width:100px;
  height:125px;
  margin:0 auto 7px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  border-radius:22px;
  background:linear-gradient(145deg,#f5edff,#fff4fa);
  font-size:27px;
}

.mini-character > div{
  height:25px;
  line-height:25px;
}

.mini-accessory{
  position:absolute;
  right:12px;
  top:12px;
  font-size:19px;
}

.character-card b{
  display:block;
  font-size:11px;
}

.character-card small{
  display:block;
  color:#9a8ea0;
  margin-top:3px;
  font-size:9px;
}

.side-title{
  font-weight:900;
  color:#523a66;
  margin-bottom:7px;
  font-size:12px;
}

.quick-buttons{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:5px;
}

.quick-buttons button,
.location-buttons button{
  border:1px solid #eee5f4;
  border-radius:8px;
  padding:7px 5px;
  background:#faf8fc;
  color:#584965;
  font-size:9px;
  font-weight:700;
}

.quick-buttons button:hover,
.location-buttons button:hover,
.location-buttons button.active{
  background:#eadfff;
  color:#693e9d;
  border-color:#cdb0ec;
}

.location-buttons{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:5px;
}

.competition-score{
  display:flex;
  align-items:baseline;
  gap:5px;
  margin-bottom:7px;
}

.competition-score strong{
  font-size:28px;
  color:#7345ae;
}

.competition-score span{
  color:#938799;
  font-size:9px;
}

/* FOOTER */

.footer-nav{
  flex:none;
  height:52px;
  display:flex;
  justify-content:space-around;
  align-items:center;
  border-top:1px solid #eee7f5;
  background:white;
}

.footer-nav button{
  min-width:55px;
  border:0;
  background:none;
  color:#8e8295;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:2px;
  font-size:17px;
}

.footer-nav span{
  font-size:8px;
}

.footer-nav button.active{
  color:#7545b2;
  font-weight:900;
}

/* SHOP */

.shop-grid,
.asset-grid,
.cert-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
}

.shop-card,
.asset-card,
.cert-card,
.bag-card{
  border:1px solid #eee6f4;
  border-radius:11px;
  padding:9px;
  display:flex;
  flex-direction:column;
  gap:4px;
  background:#fff;
}

.shop-icon,
.asset-icon,
.cert-icon,
.bag-icon{
  font-size:25px;
}

.shop-card b,
.asset-card b,
.cert-card b,
.bag-card b{
  font-size:10px;
}

.shop-card small,
.asset-card small,
.cert-card small,
.bag-card small{
  color:#918697;
  font-size:8px;
  min-height:23px;
}

.asset-card strong{
  color:#7544ad;
  font-size:10px;
}

.asset-card.owned,
.cert-card.owned{
  background:#f3fff7;
  border-color:#bde5c9;
}

/* JOB */

.job-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:8px;
}

.job-card{
  display:flex;
  gap:9px;
  padding:10px;
  border:1px solid #eee6f4;
  border-radius:12px;
  background:#fff;
}

.job-card.locked{
  opacity:.65;
}

.job-icon{
  font-size:28px;
}

.job-content{
  min-width:0;
  flex:1;
}

.job-content b{
  display:block;
  font-size:11px;
}

.job-content small{
  display:block;
  color:#908697;
  font-size:9px;
  min-height:25px;
  margin:3px 0;
}

.job-meta{
  color:#8050b5;
  font-size:9px;
  font-weight:700;
  margin-bottom:6px;
}

/* FASHION */

.fashion-page{
  display:grid;
  grid-template-columns:230px minmax(0,1fr);
  gap:10px;
}

.fashion-preview{
  border:1px solid #eee5f4;
  border-radius:14px;
  padding:11px;
  background:linear-gradient(145deg,#fff8ff,#f5f1ff);
}

.character{
  position:relative;
  width:150px;
  height:230px;
  margin:10px auto;
  border-radius:30px;
  background:rgba(255,255,255,.75);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  font-size:45px;
}

.character > div{
  height:42px;
  line-height:42px;
}

.character-accessories{
  position:absolute;
  right:20px;
  top:35px;
  font-size:30px;
}

.female-character{
  overflow:hidden;
  justify-content:flex-start;
  padding-top:12px;
  gap:0;
}

.female-avatar{
  position:relative;
  z-index:3;
  font-size:58px;
  line-height:64px;
  filter:drop-shadow(0 3px 2px rgba(80,40,110,.12));
}

.worn-clothes{
  position:relative;
  z-index:2;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:2px;
  margin-top:-3px;
}

.worn-shirt{font-size:42px; transform:scale(1.05);}
.worn-bottom{font-size:39px; margin-left:-7px;}
.worn-shoes{font-size:32px; margin-left:-4px;}
.worn-bag{position:absolute; right:12px; top:92px; font-size:28px; z-index:4;}
.worn-accessory{position:absolute; left:12px; top:42px; font-size:26px; z-index:5;}

.female-outfit-caption{
  margin-top:2px;
  padding:3px 8px;
  border-radius:999px;
  background:#f1e7ff;
  color:#72509a;
  font-size:8px;
  font-weight:700;
}

.outfit-list{
  display:flex;
  flex-direction:column;
  gap:4px;
}

.outfit-row{
  display:flex;
  justify-content:space-between;
  gap:5px;
  padding:5px 7px;
  border-radius:7px;
  background:white;
  font-size:8px;
}

.outfit-row b{
  text-align:right;
}

.fashion-shop{
  min-width:0;
}

.fashion-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.money-pill{
  padding:7px 9px;
  border-radius:9px;
  background:#fff3c9;
  color:#9a7115;
  font-size:9px;
  font-weight:800;
}

.category-tabs{
  display:flex;
  gap:4px;
  overflow-x:auto;
  padding:7px 0;
}

.category-tabs button{
  flex:none;
  border:1px solid #e9e0f2;
  border-radius:8px;
  background:#faf8fc;
  color:#6e6075;
  padding:6px 9px;
  font-size:9px;
  font-weight:800;
}

.category-tabs button.active{
  background:#7548b7;
  color:white;
  border-color:#7548b7;
}

.fashion-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
  max-height:500px;
  overflow:auto;
  padding-right:2px;
}

.fashion-card{
  border:1px solid #eee6f4;
  border-radius:11px;
  padding:8px;
  display:flex;
  flex-direction:column;
  gap:4px;
  background:white;
}

.fashion-card.owned{
  background:#faf7ff;
}

.fashion-card.equipped{
  border:2px solid #7b4bb7;
  background:#f5eeff;
}

.fashion-icon{
  width:100%;
  height:48px;
  display:grid;
  place-items:center;
  border-radius:9px;
  background:#f7f1fb;
  font-size:29px;
}

.fashion-card b{
  font-size:9px;
}

.fashion-card small{
  color:#938797;
  font-size:7px;
  min-height:19px;
}

.fashion-card strong{
  color:#7650aa;
  font-size:9px;
}

.fashion-bonus{
  display:flex;
  flex-wrap:wrap;
  gap:2px;
  min-height:18px;
}

.fashion-bonus span{
  padding:2px 4px;
  border-radius:5px;
  background:#eee5fb;
  color:#71439e;
  font-size:6px;
}

/* HOME */

.home-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}

.home-card{
  text-align:center;
}

.big-icon{
  font-size:48px;
}

.home-card h2{
  font-size:17px;
  margin:5px 0;
}

.home-card p{
  color:#918595;
  font-size:10px;
}

/* MODAL */

.modal-backdrop{
  position:fixed;
  inset:0;
  z-index:100;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:12px;
  background:rgba(32,20,42,.45);
  backdrop-filter:blur(4px);
}

.modal{
  width:min(520px,100%);
  max-height:92dvh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border-radius:17px;
  background:white;
  box-shadow:0 25px 80px rgba(30,15,45,.3);
}

.modal-wide{
  width:min(920px,100%);
}

.modal-head{
  flex:none;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:11px 13px;
  background:linear-gradient(110deg,#7144ba,#a25dd9);
  color:white;
}

.modal-title{
  font-size:14px;
  font-weight:900;
}

.icon-btn{
  width:30px;
  height:30px;
  border:0;
  border-radius:8px;
  background:rgba(255,255,255,.16);
  color:white;
}

.modal-body{
  min-height:0;
  overflow:auto;
  padding:12px;
}

/* QUIZ */

.quiz-top{
  display:flex;
  justify-content:space-between;
  color:#8c8193;
  font-size:9px;
  margin-bottom:8px;
}

.quiz-question{
  padding:12px;
  border-radius:13px;
  background:#f7f2fc;
  margin-bottom:8px;
}

.quiz-subject{
  display:inline-block;
  padding:3px 6px;
  border-radius:6px;
  background:#e5d8f7;
  color:#72469c;
  font-size:8px;
  font-weight:800;
}

.quiz-question h2{
  margin:9px 0 0;
  font-size:17px;
  line-height:1.4;
  color:#34283e;
}

.choices{
  display:grid;
  gap:6px;
}

.choice{
  width:100%;
  display:flex;
  align-items:flex-start;
  gap:7px;
  text-align:left;
  padding:10px;
  border:1px solid #e8dfef;
  border-radius:10px;
  background:white;
  color:#46394f;
  font-size:10px;
}

.choice:hover:not(:disabled){
  border-color:#a87bd0;
  background:#faf6ff;
}

.choice.correct{
  border-color:#69bb83;
  background:#e9f9ef;
  color:#23713d;
}

.choice.wrong{
  border-color:#df7777;
  background:#fff0f0;
  color:#a43d3d;
}

.feedback{
  margin-top:9px;
  padding:10px;
  border-radius:10px;
  font-size:10px;
}

.feedback.good{
  background:#ecfaef;
  color:#246e3c;
}

.feedback.bad{
  background:#fff0f0;
  color:#a63c3c;
}

.feedback p{
  margin:5px 0 8px;
  color:#675c68;
}

/* BAG */

.bag-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
}

/* SAVE */

.save-actions{
  display:flex;
  gap:6px;
  margin-bottom:8px;
}

.save-actions > *{
  flex:1;
}

.save-text{
  width:100%;
  min-height:130px;
  resize:vertical;
  border:1px solid #ddd1e7;
  border-radius:10px;
  padding:9px;
  font-size:9px;
  line-height:1.4;
  margin-bottom:7px;
}

.file-btn{
  display:flex;
  align-items:center;
  justify-content:center;
}

.save-tip{
  padding:8px;
  border-radius:9px;
  background:#f7f2fb;
  color:#82758b;
  font-size:9px;
}

/* LEADERBOARD */

.leaderboard{
  display:flex;
  flex-direction:column;
  gap:5px;
}

.rank-row{
  display:grid;
  grid-template-columns:40px 1fr 75px;
  align-items:center;
  padding:8px;
  border:1px solid #eee6f4;
  border-radius:9px;
  background:#fff;
}

.player-rank{
  background:#f2eaff;
  border-color:#cdb4e9;
}

.rank-number{
  color:#8d7e96;
  font-weight:900;
}

.rank-name{
  font-size:10px;
  font-weight:800;
}

.rank-points{
  text-align:right;
}

.rank-points b{
  display:block;
  color:#7544ad;
}

.rank-points small{
  color:#9b8e9f;
  font-size:7px;
}

/* TITLE */

.title-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
}

.title-card{
  border:1px solid #e7deef;
  border-radius:11px;
  padding:10px;
  background:white;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
}

.title-card span{
  font-size:27px;
}

.title-card b{
  font-size:9px;
}

.title-card small{
  color:#928598;
  font-size:7px;
}

.title-card.locked{
  filter:grayscale(1);
  opacity:.48;
}

.title-card.selected{
  border:2px solid #7547b0;
  background:#f6efff;
}

.title-card em{
  color:#7446ae;
  font-size:7px;
  font-style:normal;
  font-weight:900;
}

/* DIARY */

.diary-list{
  display:flex;
  flex-direction:column;
  gap:7px;
}

.diary-card{
  padding:10px;
  border:1px solid #eee5f3;
  border-radius:11px;
  background:#fff;
}

.diary-head{
  display:flex;
  justify-content:space-between;
  gap:8px;
}

.diary-head b{
  color:#624079;
  font-size:10px;
}

.diary-head span{
  color:#9a8b9e;
  font-size:8px;
}

.diary-card p{
  font-size:9px;
  color:#65596b;
}

.delta-grid{
  display:flex;
  flex-wrap:wrap;
  gap:4px;
}

.delta-grid span{
  padding:4px 6px;
  border-radius:6px;
  background:#f6f1f9;
  color:#72587e;
  font-size:7px;
}

/* PROFILE */

.profile-layout{
  display:grid;
  grid-template-columns:220px 1fr;
  gap:15px;
}

.profile-character{
  text-align:center;
}

.big-character{
  min-height:220px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  border-radius:18px;
  background:linear-gradient(145deg,#f4ecff,#fff2f8);
  font-size:46px;
}

.big-character div{
  height:43px;
}

.female-profile-character .female-avatar{
  height:auto;
  font-size:68px;
  line-height:70px;
}


.profile-character h2{
  font-size:13px;
}

.profile-stats{
  display:grid;
  gap:8px;
  align-content:center;
}

.stat-top{
  display:flex;
  justify-content:space-between;
  font-size:9px;
  color:#6c5d72;
  margin-bottom:3px;
}

.bar{
  height:6px;
  overflow:hidden;
  border-radius:99px;
  background:#eee8f2;
}

.bar-fill{
  height:100%;
  border-radius:99px;
  background:linear-gradient(90deg,#7750bd,#d96cad);
}

/* ENDING */

.ending{
  text-align:center;
  padding:10px;
}

.ending-icon{
  font-size:55px;
}

.ending h1{
  color:#5e3c79;
  font-size:21px;
}

.ending p{
  color:#817586;
  font-size:10px;
  line-height:1.6;
}

.ending-stats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:7px;
  margin:12px 0;
}

.ending-stats div{
  padding:9px;
  border-radius:10px;
  background:#f8f3fb;
}

.ending-stats b{
  display:block;
  color:#7346aa;
  font-size:18px;
}

.ending-stats span{
  color:#8f8295;
  font-size:8px;
}

.final-title{
  margin:10px 0;
  padding:10px;
  border-radius:10px;
  background:#efe3ff;
  color:#7041a5;
  font-weight:900;
}

/* TOAST */

.toast{
  position:fixed;
  z-index:300;
  left:50%;
  bottom:72px;
  transform:translateX(-50%);
  max-width:min(90vw,500px);
  padding:10px 14px;
  border-radius:12px;
  background:#302238;
  color:white;
  box-shadow:0 10px 30px rgba(20,10,30,.25);
  font-size:10px;
  font-weight:700;
  text-align:center;
}

/* EMPTY */

.empty{
  padding:30px;
  text-align:center;
  color:#988b9e;
  font-size:11px;
}

/* RESPONSIVE */

@media(max-width:900px){

  .content{
    grid-template-columns:1fr;
    overflow:auto;
  }

  .side{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:8px;
  }

  .side > *{
    margin:0;
  }

  .fashion-page{
    grid-template-columns:1fr;
  }

  .fashion-preview{
    display:grid;
    grid-template-columns:180px 1fr;
    gap:10px;
  }

  .character{
    width:140px;
    height:190px;
  }
}

@media(max-width:650px){

  .game-root{
    padding:0;
  }

  .game-shell{
    width:100%;
    height:100dvh;
    border-radius:0;
  }

  .header{
    min-height:55px;
  }

  .brand h1{
    font-size:14px;
  }

  .header-actions{
    gap:3px;
  }

  .top-btn{
    width:31px;
    height:30px;
  }

  .schedule-row{
    overflow-x:auto;
  }

  .schedule-dot{
    flex:0 0 48px;
  }

  .hud{
    padding:5px;
  }

  .hud-stat{
    padding:0 7px;
  }

  .content{
    padding:6px;
  }

  .activity-grid,
  .activity-grid.large{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .npc-grid{
    grid-template-columns:1fr;
  }

  .shop-grid,
  .asset-grid,
  .cert-grid,
  .bag-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .job-grid{
    grid-template-columns:1fr;
  }

  .fashion-preview{
    display:block;
  }

  .fashion-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
    max-height:none;
  }

  .title-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .profile-layout{
    grid-template-columns:1fr;
  }

  .ending-stats{
    grid-template-columns:repeat(2,1fr);
  }

  .footer-nav{
    height:55px;
  }
}

@media(max-width:420px){

  .brand small{
    display:none;
  }

  .location-title{
    font-size:15px;
  }

  .fashion-grid{
    grid-template-columns:1fr 1fr;
  }

  .modal-backdrop{
    padding:5px;
  }

  .modal{
    max-height:96dvh;
  }
}
`;
