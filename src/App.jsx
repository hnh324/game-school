import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. DỮ LIỆU ĐỒ DÙNG, QUÀ TẶNG & CHỨNG CHỈ
// ==========================================
const WHOLESALE_ITEMS = [
  { id: 'banh_trang', name: 'Bánh Tráng Cuộn Bơ', wholesalePrice: 8500, retailPrice: 12000, icon: '🌯' },
  { id: 'tra_sua_chai', name: 'Trà Sữa Thái Chai', wholesalePrice: 13000, retailPrice: 18000, icon: '🧋' },
  { id: 'but_cute', name: 'Bút Bi Cute Pastel', wholesalePrice: 5500, retailPrice: 8000, icon: '🖊' },
  { id: 'de_cuong', name: 'Đề Cương Ôn Tập', wholesalePrice: 6500, retailPrice: 10000, icon: '📑' }
];

const CERTIFICATES_DEF = [
  { id: 'cert_mos', name: 'Tin Học MOS (Word/Excel)', cost: 50000, reqStudy: 60, icon: '💻', desc: 'Thành thạo văn phòng, +10 Uy tín' },
  { id: 'cert_accounting', name: 'Kế Toán Doanh Nghiệp', cost: 80000, reqStudy: 70, icon: '📊', desc: 'Quản lý sổ sách, +15% tiền tip đơn hàng' },
  { id: 'cert_toeic', name: 'Tiếng Anh TOEIC 650+', cost: 120000, reqStudy: 75, icon: '📘', desc: 'Giao tiếp chuẩn, cộng vĩnh viễn +15 📚' },
  { id: 'cert_ielts', name: 'IELTS Academic 7.0+', cost: 200000, reqStudy: 85, icon: '📕', desc: 'Tuyển thẳng đại học quốc tế!' }
];

const SPECIAL_GIFTS = [
  { id: 'gift_pin', name: 'Kẹp Tóc Ngọc Bích', cost: 45000, loveGain: 12, icon: '🎀', desc: 'Kẹp tóc xinh xắn Triệu Mẫn rất thích cài khi đi học.' },
  { id: 'gift_diary', name: 'Sổ Tay Thư Tình', cost: 35000, loveGain: 10, icon: '💌', desc: 'Tâm sự chân thành gửi gắm đến cô bạn lớp phó.' },
  { id: 'gift_bear', name: 'Gấu Bông Handmade', cost: 65000, loveGain: 16, icon: '🧸', desc: 'Ấm áp những đêm ôn thi đại học căng thẳng.' },
  { id: 'gift_bracelet', name: 'Vòng Tay Khắc Tên Mẫn', cost: 120000, loveGain: 25, icon: '💍', desc: 'Lời hẹn ước cùng bước vào cánh cổng đại học.' }
];

const HOLIDAYS = {
  10: { name: '20/10 Phụ Nữ Việt Nam', bonus: 1.8 },
  20: { name: '20/11 Nhà Giáo Việt Nam', bonus: 1.4 },
  30: { name: '24/12 Lễ Giáng Sinh', bonus: 2.0 },
  40: { name: '14/02 Valentine Tình Nhân', bonus: 2.5 }
};

// ==========================================
// 2. NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM ĐỒ SỘ (100+ CÂU)
// ==========================================
const QUIZ_DATABASE = [
  // TOÁN HỌC (15 câu)
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Nếu x + 5 = 12 thì giá trị của 2x - 4 bằng bao nhiêu?', opts: ['10', '14', '7', '18'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Đỉnh Parabol y = x² - 4x + 3 có hoành độ bằng mấy?', opts: ['2', '-2', '4', '1'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Khối lập phương cạnh 3cm có thể tích là bao nhiêu?', opts: ['27 cm³', '9 cm³', '54 cm³', '18 cm³'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Đạo hàm của hàm số y = sin(2x) là gì?', opts: ['2cos(2x)', '-2cos(2x)', 'cos(2x)', '-cos(2x)'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Tập xác định của hàm số y = 1/(x - 2) là gì?', opts: ['R \\ {2}', 'R', '(2; +∞)', '[2; +∞)'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Số mặt của một hình tứ diện đều là bao nhiêu?', opts: ['4 mặt', '6 mặt', '8 mặt', '12 mặt'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Tích phân từ 0 đến 1 của 2x dx bằng bao nhiêu?', opts: ['1', '2', '0', '0.5'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Giá trị của log₂(8) bằng bao nhiêu?', opts: ['3', '4', '2', '8'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Số nghiệm của phương trình x² + 1 = 0 trên tập số thực là?', opts: ['0', '1', '2', 'Vô số'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Công thức tính diện tích hình tròn bán kính R là?', opts: ['πR²', '2πR', '4πR²', 'πR'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Cấp số cộng có u₁ = 2, công sai d = 3 thì u₂ bằng?', opts: ['5', '6', '7', '8'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Đồ thị hàm số y = x³ - 3x có bao nhiêu điểm cực trị?', opts: ['2', '0', '1', '3'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Giá trị của biểu thức 2³ + 3² bằng bao nhiêu?', opts: ['17', '18', '19', '25'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Một tam giác vuông có 2 cạnh góc vuông là 3 và 4 thì cạnh huyền là?', opts: ['5', '6', '7', '8'], c: 0 },
  { subject: 'TOÁN', teacher: 'Thầy Minh', q: 'Số đo góc của tam giác đều là bao nhiêu độ?', opts: ['60°', '45°', '90°', '120°'], c: 0 },

  // VẬT LÝ (13 câu)
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Cơ năng của con lắc lò xo biến thiên thế nào khi bỏ qua ma sát?', opts: ['Bảo toàn không đổi', 'Tăng giảm tuần hoàn', 'Bằng 0', 'Luôn giảm'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Sóng âm truyền nhanh nhất trong môi trường nào?', opts: ['Chất rắn', 'Chất lỏng', 'Chất khí', 'Chân không'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Đơn vị đo điện trở trong hệ SI là gì?', opts: ['Ôm (Ω)', 'Vôn (V)', 'Ampe (A)', 'Oát (W)'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Quang phổ liên tục do vật nào phát ra khi nung nóng?', opts: ['Chất rắn, lỏng hoặc khí áp suất lớn', 'Khí áp suất thấp', 'Chỉ chất lỏng', 'Chất khí loãng'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Chu kỳ dao động T của con lắc đơn phụ thuộc vào?', opts: ['Chiều dài dây treo và gia tốc trọng trường', 'Khối lượng quả nặng', 'Biên độ dao động', 'Vận tốc ban đầu'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Tốc độ ánh sáng trong chân không xấp xỉ bằng bao nhiêu?', opts: ['3.10⁸ m/s', '3.10⁶ m/s', '340 m/s', '3.10⁵ km/h'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Hiện tượng tán sắc ánh sáng được phát hiện lần đầu bởi ai?', opts: ['Newton', 'Einstein', 'Galileo', 'Huygens'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Dòng điện xoay chiều ở Việt Nam có tần số chuẩn là bao nhiêu?', opts: ['50 Hz', '60 Hz', '100 Hz', '120 Hz'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Hạt nhân nguyên tử được cấu tạo từ các hạt nào?', opts: ['Proton và nơtron', 'Proton và electron', 'Electron và nơtron', 'Chỉ có proton'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Hiện tượng quang điện ngoài xảy ra khi chiếu ánh sáng thích hợp vào?', opts: ['Bề mặt kim loại', 'Chất bán dẫn', 'Dung dịch muối', 'Chất điện môi'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Thiết bị nào biến đổi cơ năng thành điện năng?', opts: ['Máy phát điện', 'Động cơ điện', 'Nồi cơm điện', 'Biến áp'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Âm thanh có tần số nhỏ hơn 16 Hz gọi là gì?', opts: ['Hạ âm', 'Siêu âm', 'Tạp âm', 'Nhạc âm'], c: 0 },
  { subject: 'VẬT LÝ', teacher: 'Thầy Tuấn', q: 'Tia nào có khả năng đâm xuyên mạnh nhất và ion hóa cao?', opts: ['Tia Gamma', 'Tia Hồng ngoại', 'Tia Tử ngoại', 'Ánh sáng nhìn thấy'], c: 0 },

  // HÓA HỌC (13 câu)
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Kim loại nào dẫn điện tốt nhất ở điều kiện thường?', opts: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Dung dịch axit làm quỳ tím chuyển sang màu gì?', opts: ['Đỏ', 'Xanh', 'Tím', 'Vàng'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Chất nào sau đây thuộc loại monosaccarit?', opts: ['Glucozơ', 'Saccarozơ', 'Tinh bột', 'Xenlulozơ'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Kim loại nào ở thể lỏng ở nhiệt độ thường?', opts: ['Thủy ngân (Hg)', 'Xesi (Cs)', 'Nhôm (Al)', 'Sắt (Fe)'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Kim loại sắt (Fe) bị thụ động hóa trong axit nào nguội?', opts: ['HNO₃ đặc nguội', 'HCl loãng', 'H₂SO₄ loãng', 'CuSO₄'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Khí nào gây ra hiện tượng hiệu ứng nhà kính mạnh nhất?', opts: ['CO₂', 'O₂', 'N₂', 'H₂'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Công thức phân tử của khí ozon là gì?', opts: ['O₃', 'O₂', 'O', 'CO'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Dung dịch nước vôi trong là dung dịch của chất nào?', opts: ['Ca(OH)₂', 'CaO', 'CaCO₃', 'CaCl₂'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Chất béo là trieste của axit béo với chất nào?', opts: ['Glixerol', 'Etylen glicol', 'Metanol', 'Etanol'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Kim loại kiềm thuộc nhóm nào trong bảng tuần hoàn?', opts: ['Nhóm IA', 'Nhóm IIA', 'Nhóm IIIA', 'Nhóm VIIA'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Chất nào sau đây tham gia phản ứng tráng gương?', opts: ['Glucozơ', 'Saccarozơ', 'Etyl axetat', 'Glyxin'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Số liên kết peptit trong một phân tử tripeptit là?', opts: ['2', '3', '1', '4'], c: 0 },
  { subject: 'HÓA HỌC', teacher: 'Cô Lan Phương', q: 'Quặng bauxite dùng để sản xuất kim loại nào?', opts: ['Nhôm', 'Sắt', 'Đồng', 'Kẽm'], c: 0 },

  // SINH HỌC (12 câu)
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Bào quan nào là “nhà máy năng lượng” của tế bào?', opts: ['Ty thể', 'Ribôxôm', 'Bộ máy Golgi', 'Lizôxôm'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Phân tử ADN được cấu tạo từ 4 loại đơn phân nào?', opts: ['A, T, G, X', 'A, U, G, X', 'A, T, U, G', 'Axit amin'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Hội chứng Đao ở người do đột biến ở cặp NST số mấy?', opts: ['Cặp số 21', 'Cặp số 23', 'Cặp số 18', 'Cặp số 13'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Mã mở đầu trên mARN dịch mã cho axit amin Metionin là?', opts: ['5\'AUG3\'', '5\'UAG3\'', '5\'UAA3\'', '5\'UGA3\''], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Động vật nào sau đây có dạ dày 4 ngăn?', opts: ['Trâu, bò', 'Ngựa', 'Thỏ', 'Chó'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Cơ quan hô hấp của chim bồ câu gồm phổi và gì?', opts: ['Hệ thống túi khí', 'Da', 'Mang', 'Ống khí'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Nhóm sinh vật nào đóng vai trò phân giải trong hệ sinh thái?', opts: ['Vi khuẩn và nấm', 'Cây xanh', 'Động vật ăn cỏ', 'Động vật ăn thịt'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Ai là người phát hiện ra quy luật phân ly độc lập?', opts: ['Mendel', 'Morgan', 'Darwin', 'Lamark'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Bộ nhiễm sắc thể lưỡng bội (2n) ở người bình thường là?', opts: ['46 chiếc', '48 chiếc', '44 chiếc', '23 chiếc'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Quá trình quang hợp ở thực vật diễn ra tại bào quan nào?', opts: ['Lục lạp', 'Ty thể', 'Không bào', 'Nhân con'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Máu từ tim bơm đi nuôi cơ thể qua mạch nào?', opts: ['Động mạch', 'Tĩnh mạch', 'Mao mạch', 'Bạch huyết'], c: 0 },
  { subject: 'SINH HỌC', teacher: 'Thầy Đức', q: 'Sắc tố trực tiếp tham gia hấp thụ ánh sáng quang hợp là?', opts: ['Diệp lục a', 'Diệp lục b', 'Caroten', 'Xanthophyll'], c: 0 },

  // NGỮ VĂN (12 câu)
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Ai là tác giả của truyện ngắn “Vợ Nhặt”?', opts: ['Kim Lân', 'Nam Cao', 'Tô Hoài', 'Nguyễn Tuân'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Hình tượng người lính trong bài thơ “Tây Tiến” nổi bật với vẻ đẹp gì?', opts: ['Lãng mạn và bi tráng', 'Mộc mạc nông dân', 'U uất bi quan', 'Thần thánh hóa'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Hình tượng sông Đà trong tác phẩm của Nguyễn Tuân mang 2 nét tính cách nào?', opts: ['Hung bạo và trữ tình', 'Hiền hòa và dữ dội', 'Thơ mộng và êm đềm', 'Lặng lẽ và trầm mặc'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Nhân vật bà cụ Tứ xuất hiện trong tác phẩm nào?', opts: ['Vợ Nhặt', 'Chí Phèo', 'Vợ chồng A Phủ', 'Rừng xà nu'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Bài thơ “Sóng” của Xuân Quỳnh được viết theo thể thơ nào?', opts: ['Thơ 5 chữ', 'Thơ 7 chữ', 'Thơ lục bát', 'Thơ tự do'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Tác phẩm “Chiếc thuyền ngoài xa” là sáng tác của nhà văn nào?', opts: ['Nguyễn Minh Châu', 'Nguyễn Khải', 'Nguyễn Trung Thành', 'Lưu Quang Vũ'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Nhân vật Mỵ trong truyện ngắn “Vợ chồng A Phủ” là người dân tộc nào?', opts: ['Dân tộc Mông', 'Dân tộc Thái', 'Dân tộc Tày', 'Dân tộc Mường'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Bài thơ “Việt Bắc” của Tố Hữu được sáng tác theo thể thơ nào?', opts: ['Lục bát', 'Thơ 8 chữ', 'Song thất lục bát', 'Thất ngôn bát cú'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Thiên truyện ngắn “Chí Phèo” ban đầu có tên là gì?', opts: ['Cái lò gạch cũ', 'Đôi lứa xứng đôi', 'Làng Vũ Đại', 'Bát cháo hành'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Dòng sông nào gắn với tùy bút “Ai đã đặt tên cho dòng sông?”', opts: ['Sông Hương', 'Sông Đà', 'Sông Hồng', 'Sông Thu Bồn'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Cây xà nu trong tác phẩm của Nguyễn Trung Thành mọc ở vùng đất nào?', opts: ['Tây Nguyên', 'Tây Bắc', 'Việt Bắc', 'Nam Bộ'], c: 0 },
  { subject: 'NGỮ VĂN', teacher: 'Cô Thảo', q: 'Vở kịch “Hồn Trương Ba, da hàng thịt” là của tác giả nào?', opts: ['Lưu Quang Vũ', 'Xuân Trình', 'Đào Hồng Cẩm', 'Nguyễn Huy Tưởng'], c: 0 },

  // LỊCH SỬ & ĐỊA LÝ (12 câu)
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Chiến thắng Điện Biên Phủ toàn thắng vào ngày tháng năm nào?', opts: ['07/05/1954', '02/09/1945', '30/04/1975', '19/08/1945'], c: 0 },
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Bác Hồ đọc bản Tuyên ngôn Độc lập tại Ba Đình vào ngày nào?', opts: ['02/09/1945', '19/08/1945', '30/04/1975', '03/02/1930'], c: 0 },
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Chiến dịch lịch sử giải phóng miền Nam năm 1975 mang tên gì?', opts: ['Chiến dịch Hồ Chí Minh', 'Chiến dịch Tây Nguyên', 'Chiến dịch Huế - Đà Nẵng', 'Chiến dịch Điện Biên Phủ'], c: 0 },
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Đảng Cộng sản Việt Nam thành lập vào đầu năm 1930 tại đâu?', opts: ['Hương Cảng (Trung Quốc)', 'Hà Nội', 'Quảng Châu', 'Xiêm'], c: 0 },
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Liên Hợp Quốc chính thức thành lập vào năm nào?', opts: ['1945', '1918', '1939', '1955'], c: 0 },
  { subject: 'LỊCH SỬ', teacher: 'Thầy Hùng', q: 'Hiệp định Pa-ri về chấm dứt chiến tranh ở VN ký năm nào?', opts: ['1973', '1954', '1968', '1975'], c: 0 },
  { subject: 'ĐỊA LÝ', teacher: 'Cô Mai Anh', q: 'Đỉnh núi Fansipan có độ cao bao nhiêu mét?', opts: ['3.143 m', '2.800 m', '3.500 m', '2.950 m'], c: 0 },
  { subject: 'ĐỊA LÝ', teacher: 'Cô Mai Anh', q: 'Thủ phủ cà phê lớn nhất Việt Nam nằm ở vùng nào?', opts: ['Tây Nguyên', 'Đông Bắc', 'Đồng bằng sông Hồng', 'Bắc Trung Bộ'], c: 0 },
  { subject: 'ĐỊA LÝ', teacher: 'Cô Mai Anh', q: 'Tỉnh nào có đường bờ biển dài nhất Việt Nam?', opts: ['Khánh Hòa', 'Quảng Ninh', 'Cà Mau', 'Bình Thuận'], c: 0 },
  { subject: 'ĐỊA LÝ', teacher: 'Cô Mai Anh', q: 'Vùng đồi núi nước ta chiếm bao nhiêu diện tích đất liền?', opts: ['3/4 diện tích', '1/2 diện tích', '1/4 diện tích', 'Toàn bộ'], c: 0 },
  { subject: 'ĐỊA LÝ', teacher: 'Cô Mai Anh', q: 'Nhà máy thủy điện Hòa Bình được xây trên dòng sông nào?', opts: ['Sông Đà', 'Sông Hồng', 'Sông Đồng Nai', 'Sông Chảy'], c: 0 },
  { subject: 'ĐỊA LÝ', teacher: 'Cô Mai Anh', q: 'Hai đô thị loại đặc biệt của Việt Nam là?', opts: ['Hà Nội & TP.HCM', 'Hà Nội & Đà Nẵng', 'TP.HCM & Hải Phòng', 'Đà Nẵng & Cần Thơ'], c: 0 },

  // TIẾNG ANH & ĐỜI SỐNG HỌC ĐƯỜNG (13 câu)
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'Choose the correct word: "She has lived here ___ 2020."', opts: ['since', 'for', 'in', 'at'], c: 0 },
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'Synonym of "abundant" is:', opts: ['plentiful', 'scarce', 'narrow', 'rare'], c: 0 },
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'If I ___ you, I would take that course.', opts: ['were', 'am', 'was', 'have been'], c: 0 },
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'Antonym of "generous" is:', opts: ['selfish', 'kind', 'warm', 'friendly'], c: 0 },
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'The book ___ by my teacher yesterday.', opts: ['was signed', 'signed', 'has signed', 'signs'], c: 0 },
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'He is keen ___ playing basketball.', opts: ['on', 'in', 'at', 'about'], c: 0 },
  { subject: 'TIẾNG ANH', teacher: 'Cô Jennifer', q: 'Neither John nor his friends ___ coming today.', opts: ['are', 'is', 'was', 'have'], c: 0 },
  { subject: 'ĐỜI SỐNG', teacher: 'Căn Tin', q: 'Món ăn vặt quốc dân nào bán chạy nhất giờ ra chơi?', opts: ['Bánh tráng cuộn bơ', 'Cơm sườn bì chả', 'Bún bò Huế', 'Phở tái nạm'], c: 0 },
  { subject: 'ĐỜI SỐNG', teacher: 'Lớp 12A3', q: 'Ai là cô bạn lớp phó học tập kiêm crush xinh xắn nhất lớp?', opts: ['Triệu Mẫn', 'Thị Nở', 'Cô Năm căn tin', 'Nhỏ bạn bàn bên'], c: 0 },
  { subject: 'ĐỜI SỐNG', teacher: 'Sân Trường', q: 'Tuấn bạn thân lớp 12A3 đam mê môn thể thao nào nhất?', opts: ['Bóng rổ', 'Cầu lông', 'Bóng chuyền', 'Cờ vua'], c: 0 },
  { subject: 'ĐỜI SỐNG', teacher: 'Lớp Học', q: 'Lan bạn thân hay làm gì mỗi khi đến tiết kiểm tra bài cũ?', opts: ['Chép bài và cầu cứu bạn', 'Ngủ gục', 'Hát karaoke', 'Trốn ra ngoài'], c: 0 },
  { subject: 'ĐỜI SỐNG', teacher: 'Quy Tắc', q: 'Sau 17:00 tan trường là thời điểm lý tưởng nhất để làm gì?', opts: ['Bán hàng trả order và đi dạo', 'Đi ngủ ngay', 'Viết bản kiểm điểm', 'Lên phòng giám thị'], c: 0 },
  { subject: 'ĐỜI SỐNG', teacher: 'Tình Cảm', q: 'Tặng quà gì cho Triệu Mẫn vào dịp lễ sẽ nhận nhiều điểm tình cảm nhất?', opts: ['Vòng tay bạc hoặc kẹp tóc', 'Vỏ bánh tráng rỗng', 'Cục tẩy cũ', 'Tờ giấy nháp'], c: 0 }
];

// ==========================================
// 3. THÀNH TỰU SIÊU KHÓ (HARDCORE)
// ==========================================
const ACHIEVEMENTS_DEF = [
  { id: 'master_banh_trang', name: 'Vua Bán Dạo Học Đường', icon: '🌯', desc: 'Giao chuẩn xác 15 đơn bánh tráng bơ', check: (s) => s.totalBanhTrangSold >= 15 },
  { id: 'rich_student_1', name: 'Tiểu Đại Gia Cấp 3', icon: '💰', desc: 'Tích lũy tài sản đạt mốc 500.000đ', check: (s) => s.money >= 500000 },
  { id: 'rich_student_2', name: 'Triệu Phú Học Đường', icon: '💎', desc: 'Tích lũy tài sản đạt mốc 1.500.000đ', check: (s) => s.money >= 1500000 },
  { id: 'cert_master', name: 'Chuyên Gia Chứng Chỉ', icon: '🎓', desc: 'Thu thập đủ cả 4 chứng chỉ quốc tế', check: (s) => s.certsEarned && s.certsEarned.length >= 4 },
  { id: 'top_1_class', name: 'Đỉnh Cao Lớp 12A3', icon: '🥇', desc: 'Vượt mốc 96 điểm soán ngôi Triệu Mẫn', check: (s) => s.study >= 96 },
  { id: 'exam_genius', name: 'Thủ Khoa Độc Tôn', icon: '👑', desc: 'Đạt điểm tuyệt đối 10/10 ở kỳ thi', check: (s) => s.midtermScore >= 10 || s.finalScore >= 10 },
  { id: 'eternal_love', name: 'Hôn Ước Trăm Năm', icon: '💖', desc: 'Đạt 90% tình cảm với Triệu Mẫn', check: (s) => s.love >= 90 },
  { id: 'five_star_service', name: 'Đại Sứ Dịch Vụ', icon: '⭐', desc: 'Tích lũy tổng tiền tip vượt 50.000đ', check: (s) => s.totalTipsReceived >= 50000 }
];

// ==========================================
// 4. HIỆU ỨNG PHÁO HOA CANVAS
// ==========================================
class FireworkParticle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
  }
  update() { this.x += this.vx; this.y += this.vy; this.vy += 0.08; this.alpha -= this.decay; }
  draw(ctx) {
    ctx.save(); ctx.globalAlpha = Math.max(0, this.alpha); ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
}

function triggerFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#a855f7', '#34d399', '#f97316'];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 3;
  let particles = [];

  for (let burst = 0; burst < 3; burst++) {
    setTimeout(() => {
      const bx = cx + (Math.random() - 0.5) * 300;
      const by = cy + (Math.random() - 0.5) * 150;
      const col = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 50; i++) particles.push(new FireworkParticle(bx, by, col));
    }, burst * 200);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    if (particles.length > 0) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ==========================================
// 5. COMPONENT CHÍNH (REACT NATIVE STATE)
// ==========================================
export default function App() {
  const [playerName, setPlayerName] = useState('Bạn');
  const [day, setDay] = useState(1);
  const [minuteOfDay, setMinuteOfDay] = useState(420); // 07:00
  const [timeSpeed, setTimeSpeed] = useState(1); // 0: pause, 1: normal, 2: fast

  const [stats, setStats] = useState({
    hp: 85, energy: 100, mood: 75, study: 50, love: 20, money: 30000,
    totalBanhTrangSold: 0, totalTipsReceived: 0, midtermScore: 0, finalScore: 0
  });

  const [inventory, setInventory] = useState([
    { id: 'banh_trang', count: 3 },
    { id: 'tra_sua_chai', count: 2 },
    { id: 'but_cute', count: 2 },
    { id: 'de_cuong', count: 1 }
  ]);

  const [customerOrders, setCustomerOrders] = useState([
    { id: 1, customer: 'Lan (Bạn Thân)', avatar: '👧', itemId: 'banh_trang', qty: 2, dialogue: 'Đói bụng quá nè! Cho 2 bịch bánh tráng bơ ăn lót dạ đi!', tip: 2000 },
    { id: 2, customer: 'Triệu Mẫn (Lớp Phó)', avatar: '👸', itemId: 'tra_sua_chai', qty: 1, dialogue: 'Bạn còn chai trà sữa nào mát lạnh không? Mình đang khát quá!', tip: 5000 }
  ]);

  const [certsEarned, setCertsEarned] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'order', 'wholesale', 'gift', 'cert', 'leaderboard', 'achieve', 'name', 'quiz', 'exam', 'diary', 'help', 'canteen'
  const [alertText, setAlertText] = useState('');

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [examState, setExamState] = useState({ type: 'midterm', currentStep: 0, correctCount: 0, questions: [] });

  const showAlert = (text) => {
    setAlertText(text);
    setTimeout(() => setAlertText(''), 3000);
  };

  // Xác định lịch học & quyền bán hàng theo phút
  const getSchedule = () => {
    const m = minuteOfDay;
    if (m >= 420 && m < 510) return { text: 'Đầu giờ sáng (07:00-08:30) • Quầy mở bán', canSell: true };
    if (m >= 510 && m < 555) return { text: 'Tiết 1-2 chính khóa • Cấm buôn bán', canSell: false };
    if (m >= 555 && m < 585) return { text: 'Giờ ra chơi 30 phút • Khách đông đúc!', canSell: true };
    if (m >= 585 && m < 690) return { text: 'Tiết 3-4 chính khóa • Cấm buôn bán', canSell: false };
    if (m >= 690 && m < 810) return { text: 'Nghỉ trưa & Căn tin trường', canSell: false };
    if (m >= 810 && m < 1020) return { text: 'Buổi chiều • Thư viện / Tự học', canSell: false };
    if (m >= 1020 && m < 1110) return { text: 'Tan trường 17:00 • Nhận order', canSell: true };
    return { text: 'Buổi tối • Góc học tập tại nhà', canSell: false };
  };

  const schedule = getSchedule();

  // Kiểm tra thành tựu
  useEffect(() => {
    ACHIEVEMENTS_DEF.forEach(ach => {
      if (!unlockedAchievements.includes(ach.id) && ach.check(stats)) {
        setUnlockedAchievements(prev => [...prev, ach.id]);
        triggerFireworks();
        showAlert(`🏅 THÀNH TỰU MỚI: ${ach.name}!`);
      }
    });
  }, [stats]);

  // ĐỒNG HỒ TỰ ĐỘNG CHẠY THỜI GIAN THỰC
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeSpeed === 0) return;
      setMinuteOfDay(prev => {
        if (prev >= 1350) {
          handleEndOfDay();
          return 420;
        }
        return prev + 1;
      });
    }, timeSpeed === 2 ? 400 : 800); // Tốc độ trôi nhanh và tự nhiên

    return () => clearInterval(timer);
  }, [timeSpeed]);

  // KHÁCH TỰ ĐỘNG KÉO ĐẾN MỖI 3 GIÂY
  useEffect(() => {
    const custTimer = setInterval(() => {
      if (schedule.canSell && timeSpeed > 0) {
        setCustomerOrders(prev => {
          if (prev.length >= 4) return prev;
          const sampleList = [
            { name: 'Tuấn (Bóng Rổ)', avatar: '🏀', itemId: 'tra_sua_chai', qty: 2, dialogue: 'Đá banh khát khô họng, cho 2 chai trà sữa lẹ bạn ơi!', tip: 4000 },
            { name: 'Hoàng Nam', avatar: '🤓', itemId: 'de_cuong', qty: 1, dialogue: 'Photo cho mình 1 bộ đề cương toán nha, gửi thêm ít tiền nè!', tip: 5000 },
            { name: 'Bảo Trân', avatar: '✨', itemId: 'but_cute', qty: 2, dialogue: 'Bút viết êm tay ghê, giao nhanh mình gửi thêm tiền nước!', tip: 3000 },
            { name: 'Triệu Mẫn', avatar: '👸', itemId: 'banh_trang', qty: 1, dialogue: 'Bánh tráng bơ thơm nức mũi, để cho Mẫn một phần nhen!', tip: 8000 },
            { name: 'Lan (Bạn Thân)', avatar: '👧', itemId: 'banh_trang', qty: 1, dialogue: 'Đói bụng quá, lấy tao một phần bánh tráng ăn lót dạ đi!', tip: 2500 }
          ];
          const newCust = sampleList[Math.floor(Math.random() * sampleList.length)];
          return [...prev, {
            id: Date.now(), customer: newCust.name, avatar: newCust.avatar,
            itemId: newCust.itemId, qty: newCust.qty, dialogue: newCust.dialogue, tip: newCust.tip
          }];
        });
      }
    }, 3000);

    return () => clearInterval(custTimer);
  }, [schedule.canSell, timeSpeed]);

  const handleEndOfDay = () => {
    setActiveModal('diary');
    setStats(prev => ({ ...prev, energy: 100, money: prev.money + 15000 }));
  };

  const nextDay = () => {
    setActiveModal(null);
    setDay(prev => {
      const next = prev + 1;
      if (next === 22) triggerExam('midterm');
      if (next >= 45) triggerExam('final');
      return next;
    });
    setMinuteOfDay(420);
  };

  // Trả đơn order
  const fulfillOrder = (orderId) => {
    const ord = customerOrders.find(o => o.id === orderId);
    if (!ord) return;

    const inv = inventory.find(i => i.id === ord.itemId);
    const itemInfo = WHOLESALE_ITEMS.find(i => i.id === ord.itemId);

    if (!inv || inv.count < ord.qty) {
      showAlert('Kho không đủ hàng! Vào Chợ Sỉ ngay!');
      return;
    }

    setInventory(prev => prev.map(i => i.id === ord.itemId ? { ...i, count: i.count - ord.qty } : i));
    setCustomerOrders(prev => prev.filter(o => o.id !== orderId));

    const isCrush = ord.customer.includes('Triệu Mẫn');
    const hasAccounting = certsEarned.includes('cert_accounting');
    const tipEarned = hasAccounting ? Math.round(ord.tip * 1.15) : ord.tip;
    const earned = (itemInfo.retailPrice * ord.qty) + tipEarned;

    setStats(prev => ({
      ...prev,
      money: prev.money + earned,
      mood: Math.min(100, prev.mood + 5),
      love: isCrush ? Math.min(100, prev.love + 8) : prev.love,
      totalBanhTrangSold: ord.itemId === 'banh_trang' ? prev.totalBanhTrangSold + ord.qty : prev.totalBanhTrangSold,
      totalTipsReceived: prev.totalTipsReceived + tipEarned
    }));

    showAlert(`⭐ Giao đơn thành công! Thu về +${earned.toLocaleString('vi-VN')}đ (Tip: ${tipEarned.toLocaleString('vi-VN')}đ)`);
  };

  // Nhập hàng sỉ
  const buyWholesale = (itemId) => {
    const item = WHOLESALE_ITEMS.find(i => i.id === itemId);
    const cost = item.wholesalePrice * 3;
    if (stats.money < cost) {
      showAlert('Tiền trong ví không đủ nhập gói sỉ này!');
      return;
    }
    setStats(prev => ({ ...prev, money: prev.money - cost }));
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, count: i.count + 3 } : i));
    showAlert(`📦 Đã nhập 3 ${item.name}!`);
  };

  // Tặng quà Triệu Mẫn
  const giveGift = (giftId) => {
    const g = SPECIAL_GIFTS.find(x => x.id === giftId);
    if (stats.money < g.cost) {
      showAlert('Tiền tiết kiệm không đủ mua quà này!');
      return;
    }
    const hol = HOLIDAYS[day];
    const mult = hol ? hol.bonus : 1.0;
    const gainedLove = Math.round(g.loveGain * mult);

    setStats(prev => ({
      ...prev,
      money: prev.money - g.cost,
      love: Math.min(100, prev.love + gainedLove),
      mood: Math.min(100, prev.mood + 15)
    }));
    setActiveModal(null);
    triggerFireworks();
    showAlert(`💕 Triệu Mẫn nhận quà và mỉm cười e thẹn! (+${gainedLove}% 💕)`);
  };

  // Thi chứng chỉ
  const takeCertExam = (certId) => {
    const cert = CERTIFICATES_DEF.find(c => c.id === certId);
    if (!cert) return;
    if (stats.money < cert.cost) {
      showAlert('Không đủ lệ phí đăng ký dự thi!');
      return;
    }
    if (stats.study < cert.reqStudy) {
      showAlert(`Cần ít nhất ${cert.reqStudy} điểm Học Tập để thi đỗ!`);
      return;
    }
    setStats(prev => ({ ...prev, money: prev.money - cert.cost, study: prev.study + 10 }));
    setCertsEarned(prev => [...prev, cert.id]);
    setActiveModal(null);
    triggerFireworks();
    showAlert(`🎉 Xuất sắc nhận được ${cert.name}!`);
  };

  // Trèo tường trốn học đi chơi
  const skipSchool = () => {
    if (schedule.canSell) return;
    const caught = Math.random() < 0.35;
    if (caught) {
      setStats(prev => ({ ...prev, mood: Math.max(0, prev.mood - 20), study: Math.max(0, prev.study - 5), energy: Math.max(0, prev.energy - 15) }));
      showAlert('🚨 Bị giám thị bắt gặp trèo tường! Bị phạt và hạ hạnh kiểm!');
    } else {
      setStats(prev => ({ ...prev, mood: Math.min(100, prev.mood + 25), energy: Math.max(0, prev.energy - 10) }));
      showAlert('🎉 Trốn học thành công ra quán net quẩy cực đã! (+25 😊)');
    }
    setMinuteOfDay(prev => prev + 35);
  };

  // Trắc nghiệm trên lớp
  const startQuiz = () => {
    const q = QUIZ_DATABASE[Math.floor(Math.random() * QUIZ_DATABASE.length)];
    setCurrentQuiz(q);
    setActiveModal('quiz');
  };

  const answerQuiz = (index) => {
    if (index === currentQuiz.c) {
      setStats(prev => ({ ...prev, study: prev.study + 8, mood: Math.min(100, prev.mood + 5), energy: Math.max(0, prev.energy - 10) }));
      showAlert('🎉 Đúng rồi! Thầy cô khen ngợi (+8 📚)');
    } else {
      setStats(prev => ({ ...prev, study: prev.study + 2, mood: Math.max(0, prev.mood - 5), energy: Math.max(0, prev.energy - 10) }));
      showAlert('😭 Sai rồi! Nhớ ghi chú lại vào vở nhé.');
    }
    setActiveModal(null);
    setMinuteOfDay(prev => prev + 20);
  };

  // Kỳ thi giữa / cuối kỳ
  const triggerExam = (type) => {
    const shuffled = [...QUIZ_DATABASE].sort(() => 0.5 - Math.random()).slice(0, 10);
    setExamState({ type, currentStep: 0, correctCount: 0, questions: shuffled });
    setActiveModal('exam');
  };

  const answerExam = (idx) => {
    const q = examState.questions[examState.currentStep];
    const isCorrect = idx === q.c;
    const newCorrect = isCorrect ? examState.correctCount + 1 : examState.correctCount;

    if (examState.currentStep + 1 < 10) {
      setExamState(prev => ({ ...prev, currentStep: prev.currentStep + 1, correctCount: newCorrect }));
    } else {
      setActiveModal(null);
      triggerFireworks();
      if (examState.type === 'midterm') {
        setStats(prev => ({ ...prev, midtermScore: newCorrect, study: prev.study + (newCorrect * 3) }));
        showAlert(`🎉 KẾT QUẢ GIỮA KỲ: Đúng ${newCorrect}/10 câu!`);
      } else {
        setStats(prev => ({ ...prev, finalScore: newCorrect }));
        showAlert(`🎓 KẾT QUẢ TỐT NGHIỆP: Đúng ${newCorrect}/10 câu!`);
      }
    }
  };

  // Tương tác bạn bè
  const interactNPC = (who) => {
    if (who === 'mẫn') {
      setStats(prev => ({ ...prev, love: Math.min(100, prev.love + 5), mood: Math.min(100, prev.mood + 10) }));
      showAlert(`💕 Triệu Mẫn: "${playerName} ơi, nhớ chăm học để tụi mình cùng đỗ trường top nhen!" (+5 💕)`);
    } else if (who === 'lan') {
      setStats(prev => ({ ...prev, mood: Math.min(100, prev.mood + 10), study: prev.study + 2 }));
      showAlert(`👧 Lan: "Hôm nay cô kiểm tra bài cũ đấy, chép bài nhanh lên ${playerName}!"`);
    } else if (who === 'tuan') {
      setStats(prev => ({ ...prev, hp: Math.min(100, prev.hp + 5), mood: Math.min(100, prev.mood + 10) }));
      showAlert(`🏀 Tuấn: "Ra sân ném 3 điểm với tao một ván cho giãn gân cốt nào ${playerName}!"`);
    }
    setMinuteOfDay(prev => prev + 15);
  };

  // Cloud Save UTF-8 An toàn
  const exportSave = () => {
    const stateObj = { playerName, day, minuteOfDay, stats, inventory, certsEarned, unlockedAchievements };
    const code = window.btoa(encodeURIComponent(JSON.stringify(stateObj)));
    navigator.clipboard?.writeText(code);
    alert('📋 Đã sao chép mã Cloud Save vào clipboard! Hãy dán để lưu giữ.');
  };

  const importSave = () => {
    const code = prompt('Dán mã Cloud Save của bạn vào đây:');
    if (!code) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(window.atob(code)));
      if (parsed.stats && parsed.day) {
        setPlayerName(parsed.playerName || 'Bạn');
        setDay(parsed.day);
        setMinuteOfDay(parsed.minuteOfDay || 420);
        setStats(parsed.stats);
        setInventory(parsed.inventory || inventory);
        setCertsEarned(parsed.certsEarned || []);
        setUnlockedAchievements(parsed.unlockedAchievements || []);
        showAlert('🎉 Khôi phục tiến trình thành công!');
      }
    } catch (e) {
      alert('Mã lưu không đúng định dạng!');
    }
  };

  const hours = Math.floor(minuteOfDay / 60);
  const mins = minuteOfDay % 60;
  const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', color: '#f8fafc', fontFamily: 'sans-serif', userSelect: 'none' }}>
      
      <canvas id="fireworksCanvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 90, width: '100%', height: '100%' }}></canvas>

      {/* ALERT POPUP */}
      {alertText && (
        <div style={{ position: 'fixed', top: '16px', zIndex: 100, background: 'rgba(2, 6, 23, 0.95)', border: '2px solid #10b981', color: '#34d399', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 8px 24px rgba(0,0,0,0.8)' }}>
          {alertText}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '860px', background: 'linear-gradient(145deg, #0f172a, #020617)', border: '4px solid #1e293b', borderRadius: '28px', padding: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        
        {/* HEADER TOOLBAR NÚT CHỨC NĂNG */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '10px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: '900', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', display: 'inline-block' }}></span>
            THANH XUÂN RỰC RỠ 7.5
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveModal('gift')} style={{ background: '#9d174d', color: '#fff', border: '1px solid #db2777', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🎁 TẶNG QUÀ</button>
            <button onClick={() => setActiveModal('cert')} style={{ background: '#1e40af', color: '#fff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🎓 CHỨNG CHỈ</button>
            <button onClick={() => setActiveModal('achieve')} style={{ background: '#6b21a8', color: '#fff', border: '1px solid #a855f7', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🏅 THÀNH TỰU</button>
            <button onClick={() => setActiveModal('leaderboard')} style={{ background: '#b45309', color: '#fff', border: '1px solid #f59e0b', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🏆 THI ĐUA</button>
            <button onClick={exportSave} style={{ background: '#065f46', color: '#fff', border: '1px solid #10b981', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>☁️ LƯU MÃ</button>
            <button onClick={importSave} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #475569', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📥 NẠP MÃ</button>
            <button onClick={() => setActiveModal('help')} style={{ background: '#0f766e', color: '#fff', border: '1px solid #14b8a6', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📖 HƯỚNG DẪN</button>
          </div>
        </div>

        {/* MÀN HÌNH CHÍNH */}
        <div style={{ background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)', border: '2px solid #1e293b', borderRadius: '20px', padding: '14px', position: 'relative' }}>
          
          {/* HUD CHỈ SỐ */}
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '2px solid #334155', borderRadius: '14px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: '900', color: '#fde047', fontSize: '13px' }}>
                <span onClick={() => setActiveModal('name')} style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>{playerName.toUpperCase()}</span> • 
                <span style={{ color: '#34d399', fontFamily: 'monospace', marginLeft: '6px', background: '#020617', padding: '2px 6px', borderRadius: '6px' }}>{timeStr}</span> • 
                <span style={{ color: '#93c5fd', marginLeft: '6px' }}>NGÀY {day}/45</span>
                {HOLIDAYS[day] && <span style={{ marginLeft: '6px', background: '#9d174d', color: '#fbcfe8', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>🌸 {HOLIDAYS[day].name}</span>}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{schedule.text}</div>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* ĐIỀU TỐC THỜI GIAN */}
              <div style={{ display: 'flex', gap: '4px', background: '#020617', padding: '2px 6px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <button onClick={() => setTimeSpeed(0)} style={{ background: timeSpeed === 0 ? '#b45309' : '#1e293b', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>⏸️</button>
                <button onClick={() => setTimeSpeed(1)} style={{ background: timeSpeed === 1 ? '#1e40af' : '#1e293b', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>▶️ 1x</button>
                <button onClick={() => setTimeSpeed(2)} style={{ background: timeSpeed === 2 ? '#065f46' : '#1e293b', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}>⏩ 2x</button>
              </div>

              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#fb7185', fontSize: '11px', fontFamily: 'monospace' }}>❤️ {stats.hp}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#fde047', fontSize: '11px', fontFamily: 'monospace' }}>⚡ {stats.energy}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#38bdf8', fontSize: '11px', fontFamily: 'monospace' }}>📚 {stats.study}</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#f472b6', fontSize: '11px', fontFamily: 'monospace' }}>💕 {stats.love}%</span>
              <span style={{ background: '#020617', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1e293b', color: '#34d399', fontSize: '11px', fontFamily: 'monospace' }}>💰 {stats.money.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* SÂN TRƯỜNG & KHU TƯƠNG TÁC */}
          <div style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.95) 100%)', border: '2px solid #1e293b', borderRadius: '16px', padding: '16px', minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            {/* THANH TRẠNG THÁI VÀ TRỐN HỌC */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: '#020617', padding: '4px 10px', borderRadius: '8px', border: '1px solid #334155', fontSize: '11px', fontWeight: 'bold', color: '#fde047' }}>
                🏫 LỚP 12A3 - KHỐI CHUYÊN
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {!schedule.canSell && (
                  <button onClick={skipSchool} style={{ background: '#991b1b', color: '#fef2f2', border: '1px solid #ef4444', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                    🏃 Trốn Học Đi Chơi
                  </button>
                )}
                <div style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: schedule.canSell ? '#064e3b' : '#4c0519', color: schedule.canSell ? '#a7f3d0' : '#fecdd3', border: `1px solid ${schedule.canSell ? '#10b981' : '#e11d48'}` }}>
                  {schedule.canSell ? '🟢 ĐƯỢC PHÉP BÁN HÀNG' : '🔒 ĐANG TRONG GIỜ HỌC'}
                </div>
              </div>
            </div>

            {/* NHÂN VẬT ĐỒNG HÀNH */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '14px' }}>
                <div onClick={() => interactNPC('lan')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px' }}>👧</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#7dd3fc', background: '#1e293b', padding: '2px 8px', borderRadius: '6px', marginTop: '4px' }}>Lan (Bạn Thân)</div>
                </div>
                <div onClick={() => interactNPC('mẫn')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px' }}>👸</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f472b6', background: '#1e293b', border: '1px solid #db2777', padding: '2px 8px', borderRadius: '6px', marginTop: '4px' }}>Triệu Mẫn (Lớp Phó) 💕</div>
                </div>
                <div onClick={() => interactNPC('tuan')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px' }}>🏀</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fde047', background: '#1e293b', padding: '2px 8px', borderRadius: '6px', marginTop: '4px' }}>Tuấn (Bóng Rổ)</div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed)', color: 'white', fontWeight: '900', fontSize: '12px', padding: '6px 16px', borderRadius: '8px', display: 'inline-block' }}>
                {schedule.canSell ? '🔥 KHÁCH ĐANG TỰ ĐỘNG KÉO ĐẾN MỖI 3 GIÂY!' : '📖 ĐANG TRONG TIẾT HỌC - TẬP TRUNG HỌC HOẶC TRỐN HỌC!'}
              </div>
            </div>

            {/* ĐIỀU HƯỚNG ĐỊA ĐIỂM */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
              <button onClick={() => setMinuteOfDay(prev => prev + 30)} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>⏩ Tua 30 Phút</button>
              <button onClick={() => setActiveModal('canteen')} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>🍜 Căn Tin</button>
              <button onClick={startQuiz} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📚 Trả Lời Câu Hỏi</button>
            </div>
          </div>

          {/* THANH ĐIỀU KHIỂN DƯỚI CÙNG */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={() => { if (!schedule.canSell) { showAlert('Giờ học quầy đóng cửa!'); return; } setActiveModal('order'); }} style={{ flex: 1, background: '#065f46', color: '#ecfdf5', border: '2px solid #10b981', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>
              🛎️ Quầy Order ({customerOrders.length})
            </button>
            <button onClick={startQuiz} style={{ flex: 1, background: '#1e293b', color: '#f8fafc', border: '2px solid #475569', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              📖 Trả Lời Thầy Cô
            </button>
            <button onClick={() => setActiveModal('wholesale')} style={{ flex: 1, background: '#1e40af', color: '#eff6ff', border: '2px solid #3b82f6', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              🚚 Chợ Sỉ Nhập Hàng
            </button>
            <button onClick={() => setActiveModal('diary')} style={{ flex: 1, background: '#b45309', color: '#fffbeb', border: '2px solid #f59e0b', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              📓 Xem Nhật Ký
            </button>
          </div>

          {/* ========================================================
              CÁC POPUP MODAL REACT THUẦN (ĂN LỆNH 100%)
              ======================================================== */}

          {/* 1. MODAL ORDER */}
          {activeModal === 'order' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #10b981', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#34d399', fontSize: '13px' }}>🛎️ QUẦY ORDER (KHÁCH TỰ ĐỘNG TỚI)</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', background: '#020617', padding: '8px', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}>
                {inventory.map(i => <span key={i.id}>{WHOLESALE_ITEMS.find(x => x.id === i.id)?.icon} {i.count}</span>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {customerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '11px' }}>Khách đang tới quầy, bạn chờ vài giây nhé...</div>
                ) : (
                  customerOrders.map(ord => {
                    const item = WHOLESALE_ITEMS.find(x => x.id === ord.itemId);
                    const inv = inventory.find(x => x.id === ord.itemId);
                    const canFulfill = (inv?.count || 0) >= ord.qty;
                    return (
                      <div key={ord.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: `1px solid ${canFulfill ? '#059669' : '#dc2626'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{ord.avatar} {ord.customer} <span style={{ color: '#fde047', fontSize: '10px' }}>⭐⭐⭐⭐⭐</span></div>
                          <div style={{ color: '#94a3b8', fontSize: '11px', fontStyle: 'italic' }}>"{ord.dialogue}"</div>
                          <div style={{ color: '#fde047', fontSize: '11px', marginTop: '2px' }}>Order: <b>{ord.qty}x {item?.name}</b> <span style={{ color: '#34d399' }}>(+Tip {ord.tip.toLocaleString('vi-VN')}đ)</span></div>
                        </div>
                        <button onClick={() => fulfillOrder(ord.id)} style={{ background: canFulfill ? '#059669' : '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: canFulfill ? 'pointer' : 'default' }}>
                          {canFulfill ? 'Giao Đơn' : 'Hết Hàng'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 2. MODAL CHỢ SỈ */}
          {activeModal === 'wholesale' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #3b82f6', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#60a5fa', fontSize: '13px' }}>🚚 CHỢ SỈ ĐẦU MỐI (NHẬP HÀNG)</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {WHOLESALE_ITEMS.map(item => (
                  <div key={item.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.icon} {item.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '11px' }}>Giá sỉ: <b style={{ color: '#60a5fa' }}>{item.wholesalePrice.toLocaleString('vi-VN')}đ</b> • Bán: {item.retailPrice.toLocaleString('vi-VN')}đ</div>
                    </div>
                    <button onClick={() => buyWholesale(item.id)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                      Nhập 3 Cái ({(item.wholesalePrice * 3).toLocaleString('vi-VN')}đ)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. MODAL TẶNG QUÀ */}
          {activeModal === 'gift' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #db2777', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#f472b6', fontSize: '13px' }}>🎁 TIỆM QUÀ DÀNH CHO TRIỆU MẪN</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {SPECIAL_GIFTS.map(g => (
                  <div key={g.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{g.icon} {g.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: '10px' }}>{g.desc}</div>
                      <div style={{ color: '#f472b6', fontSize: '11px', marginTop: '2px' }}>Giá: {g.cost.toLocaleString('vi-VN')}đ • Hiệu quả: +{g.loveGain}% 💕</div>
                    </div>
                    <button onClick={() => giveGift(g.id)} style={{ background: '#db2777', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                      Tặng Mẫn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MODAL CHỨNG CHỈ */}
          {activeModal === 'cert' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #38bdf8', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#38bdf8', fontSize: '13px' }}>🎓 TRUNG TÂM THI CHỨNG CHỈ QUỐC TẾ</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {CERTIFICATES_DEF.map(c => {
                  const earned = certsEarned.includes(c.id);
                  return (
                    <div key={c.id} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: `1px solid ${earned ? '#059669' : '#1e293b'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: earned ? '#34d399' : '#f8fafc' }}>{c.icon} {c.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '10px' }}>{c.desc}</div>
                        <div style={{ color: '#60a5fa', fontSize: '11px', marginTop: '2px' }}>Lệ phí: {c.cost.toLocaleString('vi-VN')}đ • Yêu cầu: {c.reqStudy} 📚</div>
                      </div>
                      <button onClick={() => takeCertExam(c.id)} disabled={earned} style={{ background: earned ? '#334155' : '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: earned ? 'default' : 'pointer' }}>
                        {earned ? 'ĐÃ ĐẠT' : 'Thi Ngay'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. MODAL THI ĐUA */}
          {activeModal === 'leaderboard' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #f59e0b', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#fde047', fontSize: '13px' }}>🏆 BẢNG THI ĐUA LỚP 12A3</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Triệu Mẫn (Lớp Phó)', score: 92, avatar: '👸' },
                  { name: `${playerName} (Bạn)`, score: stats.study, avatar: '😎' },
                  { name: 'Lan (Bạn Thân)', score: 68, avatar: '👧' },
                  { name: 'Tuấn (Bóng Rổ)', score: 55, avatar: '🏀' },
                  { name: 'Hoàng Nam', score: 84, avatar: '🤓' }
                ].sort((a,b) => b.score - a.score).map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: '#020617', padding: '8px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <span>#{idx+1} {s.avatar} <b>{s.name}</b></span>
                    <b style={{ color: '#34d399' }}>{s.score} 📚</b>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. MODAL THÀNH TỰU */}
          {activeModal === 'achieve' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #a855f7', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#c084fc', fontSize: '13px' }}>🏅 THÀNH TỰU & DANH HIỆU</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {ACHIEVEMENTS_DEF.map(ach => {
                  const isUnlocked = unlockedAchievements.includes(ach.id);
                  return (
                    <div key={ach.id} style={{ background: isUnlocked ? '#3b0764' : '#020617', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${isUnlocked ? '#a855f7' : '#1e293b'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isUnlocked ? 1 : 0.6 }}>
                      <div>
                        <b style={{ color: isUnlocked ? '#c084fc' : '#94a3b8' }}>{ach.icon} {ach.name}</b>
                        <div style={{ fontSize: '10px', color: '#cbd5e1' }}>{ach.desc}</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', background: isUnlocked ? '#7e22ce' : '#334155', color: '#fff' }}>
                        {isUnlocked ? 'ĐÃ ĐẠT' : 'CHƯA'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. MODAL ĐẶT TÊN */}
          {activeModal === 'name' && (
            <div style={{ position: 'absolute', inset: '20px', margin: 'auto', maxWidth: '380px', height: '180px', background: '#0f172a', border: '2px solid #38bdf8', borderRadius: '16px', padding: '16px', zIndex: 70, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <b style={{ color: '#38bdf8' }}>✍️ NHẬP TÊN CỦA BẠN:</b>
              <input type="text" maxLength={16} defaultValue={playerName} id="nameInputBox" style={{ background: '#020617', border: '2px solid #334155', borderRadius: '8px', padding: '8px', color: '#fde047', fontWeight: 'bold', fontSize: '13px', outline: 'none' }} />
              <button onClick={() => {
                const val = document.getElementById('nameInputBox')?.value.trim();
                if (val) setPlayerName(val);
                setActiveModal(null);
                showAlert('Đã lưu tên thành công!');
              }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Xác Nhận Tên 🚀
              </button>
            </div>
          )}

          {/* 8. MODAL TRẢ LỜI CÂU HỎI TRÊN LỚP */}
          {activeModal === 'quiz' && currentQuiz && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #38bdf8', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                  <b style={{ color: '#93c5fd' }}>{currentQuiz.subject} - {currentQuiz.teacher}</b>
                  <span style={{ color: '#fde047', fontSize: '11px' }}>⚡ Tốn 10 Năng lượng</span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '16px 0', lineHeight: 1.5 }}>{currentQuiz.q}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {currentQuiz.opts.map((opt, idx) => (
                  <button key={idx} onClick={() => answerQuiz(idx)} style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}>
                    <b style={{ color: '#fde047' }}>{String.fromCharCode(65 + idx)}.</b> {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 9. MODAL THI CỬ */}
          {activeModal === 'exam' && examState.questions.length > 0 && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #f59e0b', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                  <b style={{ color: '#fde047' }}>KỲ THI: CÂU {examState.currentStep + 1} / 10</b>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>Đang đúng: {examState.correctCount}/10</span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '16px 0', lineHeight: 1.5 }}>{examState.questions[examState.currentStep]?.q}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {examState.questions[examState.currentStep]?.opts.map((opt, idx) => (
                  <button key={idx} onClick={() => answerExam(idx)} style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #475569', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}>
                    <b style={{ color: '#fde047' }}>{String.fromCharCode(65 + idx)}.</b> {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 10. MODAL NHẬT KÝ */}
          {activeModal === 'diary' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#fef3c7', color: '#78350f', border: '2px solid #d97706', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <b style={{ fontSize: '14px', color: '#92400e' }}>📓 NHẬT KÝ NGÀY {day}</b>
                <p style={{ fontStyle: 'italic', fontSize: '12px', marginTop: '10px', lineHeight: 1.6 }}>
                  Một ngày học tập và kinh doanh của {playerName} tại lớp 12A3 đã khép lại. Điểm học tập hiện tại là {stats.study}, ví tiền tích lũy được {stats.money.toLocaleString('vi-VN')}đ và tình cảm cùng Triệu Mẫn đạt {stats.love}%.
                </p>
              </div>
              <button onClick={nextDay} style={{ background: '#92400e', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Thức Dậy Ngày Mới ☀️
              </button>
            </div>
          )}

          {/* 11. MODAL CĂN TIN */}
          {activeModal === 'canteen' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #10b981', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#34d399', fontSize: '13px' }}>🍜 CĂN TIN TRƯỜNG - CÔ NĂM</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Bánh Mì Nóng Giòn', cost: 15000, energy: 30 },
                  { name: 'Xôi Mặn Thập Cẩm', cost: 15000, energy: 35 },
                  { name: 'Nước Mía Siêu Sạch', cost: 10000, energy: 20 }
                ].map((f, idx) => (
                  <div key={idx} style={{ background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><b>{f.name}</b> ({f.cost.toLocaleString('vi-VN')}đ)</span>
                    <button onClick={() => {
                      if (stats.money < f.cost) { showAlert('Không đủ tiền!'); return; }
                      setStats(prev => ({ ...prev, money: prev.money - f.cost, energy: Math.min(100, prev.energy + f.energy) }));
                      showAlert(`😋 Đã ăn ${f.name}! (+${f.energy} ⚡)`);
                    }} style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Ăn Ngay
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. MODAL HƯỚNG DẪN */}
          {activeModal === 'help' && (
            <div style={{ position: 'absolute', inset: '10px', background: '#0f172a', border: '2px solid #14b8a6', borderRadius: '16px', padding: '16px', zIndex: 60, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
                <b style={{ color: '#2dd4bf', fontSize: '13px' }}>📖 HƯỚNG DẪN CÁCH CHƠI</b>
                <button onClick={() => setActiveModal(null)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>✕ Đóng</button>
              </div>
              <div style={{ fontSize: '11px', lineHeight: 1.6, color: '#cbd5e1' }}>
                <p>• <b>Thời gian tự động trôi:</b> Nhịp sống học đường diễn ra liên tục. Bạn có thể bấm nút ⏸️, ▶️, ⏩ góc trên để điều chỉnh tốc độ.</p>
                <p>• <b>Khách tự động đến:</b> Sáng, ra chơi và tan trường khách tự ghé quầy order món. Hãy chuẩn bị sẵn hàng trong cặp để giao đơn nhận 5⭐ và tiền tip!</p>
                <p>• <b>Giờ học chính khóa:</b> Quầy đóng cửa. Bạn có thể tự học cày đề HOẶC bấm <b>"Trốn học đi chơi"</b> giải trí (coi chừng giám thị bắt!).</p>
                <p>• <b>Triệu Mẫn & Thi Cử:</b> Tặng quà đúng các dịp lễ (20/10, Valentine...) để nhận x2 tình cảm. Thi giữa kỳ ngày 22 và tốt nghiệp ngày 45 để hướng tới cái kết thủ khoa trăm năm hẹn ước 💕!</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
