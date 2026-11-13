# Đề nhóm official: tờ trình xin phê duyệt dự toán số hóa tài liệu lưu trữ

Lời yêu cầu ở `prompt.md` (người làm bài chỉ được thấy tệp đó và hai tệp trong `inputs/`). Tệp vào:

- `inputs/budget.csv`: dự toán năm dòng, số viết kiểu tiếng Anh, có một dòng nhân sai và dòng tổng cộng theo dòng sai.
- `inputs/intern-draft.txt`: phần "Sự cần thiết" do thực tập sinh viết, đầy văn máy, có hai con số chưa kiểm.

Bài làm để ở `runs/rN/`: `output.docx`, `output.pdf` (nếu người làm xuất), tệp JSON nội dung, và `reply.md` là nguyên văn
câu trả lời trong chat của người làm.

## Đề thử điều gì của skill

1. Thể thức Nghị định 30/2020 cho một tờ trình có Kính gửi một nơi, căn cứ, hai phụ lục, khối ký "ký thay", Nơi nhận có nơi
   nhận để biết (`references/official-documents.md`).
2. Dùng `scripts/official-doc-docx.mjs` đúng cấu trúc JSON (`references/docx-export.md`), rồi xuất PDF xem từng trang.
3. Số liệu: đổi số kiểu tiếng Anh sang kiểu Việt, phân biệt điểm phần trăm với phần trăm, kiểm phép nhân và phép cộng của
   bảng người dùng đưa trước khi chép.
4. Không bịa: trích yếu văn bản người dùng không nhớ, số liệu trong bản nháp chưa kiểm, đơn vị thực hiện chưa có.
5. Sửa văn máy của bản nháp thành văn hành chính gọn mà giữ ý, không mang khuôn văn máy sang (mục "Văn phong" của
   `official-documents.md`, `machine-tells.md`).
6. Trả kết quả theo bảng "Trả kết quả" của `SKILL.md`: dòng "Tệp Word" và dòng "Viết mới" (văn bản, thêm một hai câu về chỗ
   chưa kiểm hay thiếu dữ kiện).

## Đáp án dữ kiện

### Phần đầu và phần cuối

| Thành phần | Đúng |
|---|---|
| Cơ quan chủ quản | SỞ NỘI VỤ TỈNH HÒA LÂM (in hoa, không đậm) |
| Cơ quan ban hành | TRUNG TÂM LƯU TRỮ LỊCH SỬ TỈNH HÒA LÂM (in hoa, đậm, ngắt dòng theo cụm, ví dụ "TRUNG TÂM LƯU TRỮ LỊCH SỬ" / "TỈNH HÒA LÂM") |
| Số, ký hiệu | Số: 07/TTr-TTLT |
| Địa danh, ngày | Hòa Lâm, ngày 06 tháng 01 năm 2027 |
| Tên loại, trích yếu | TỜ TRÌNH; trích yếu nói phê duyệt dự toán (kinh phí) số hóa tài liệu lưu trữ năm 2027, có hoặc không "Về việc" |
| Kính gửi | một nơi, cùng dòng: "Kính gửi: Sở Nội vụ tỉnh Hòa Lâm." Sở Tài chính không nằm ở Kính gửi |
| Nơi nhận | "- Như trên;", "- Sở Tài chính tỉnh Hòa Lâm;" (có thể kèm "(để biết)"), "- Lưu: VT, NVLT." |
| Khối ký | KT. GIÁM ĐỐC / PHÓ GIÁM ĐỐC / Lê Thị Thu Hằng (không có "ThS.") |
| Câu kết | "Kính trình Sở Nội vụ xem xét, quyết định./." hoặc "Trân trọng kính trình./." hay câu tương đương theo bảng câu kết |
| Phụ lục | hai phụ lục nên đánh "Phụ lục I", "Phụ lục II"; dòng "(Kèm theo Tờ trình số 07/TTr-TTLT ngày 06 tháng 01 năm 2027 của Trung tâm Lưu trữ lịch sử tỉnh Hòa Lâm)"; mỗi phụ lục đánh lại số trang |

### Căn cứ

- "Quyết định số 2318/QĐ-UBND ngày 09 tháng 12 năm 2026 của Ủy ban nhân dân tỉnh Hòa Lâm về việc giao dự toán thu, chi ngân
  sách nhà nước năm 2027" (lần đầu viết đủ; các lần sau "Quyết định số 2318/QĐ-UBND").
- "Kế hoạch số 145/KH-SNV ngày 15 tháng 10 năm 2026 của Sở Nội vụ tỉnh Hòa Lâm" kèm chỗ đánh dấu cần bổ sung trích yếu
  (ví dụ "về việc [cần bổ sung tên kế hoạch]"), hoặc ghi không kèm trích yếu và báo người dùng là thiếu. Không được tự đặt
  trích yếu kiểu "về số hóa tài liệu lưu trữ giai đoạn 2026-2030".
- Không thêm căn cứ người dùng không đưa (Luật Lưu trữ, Nghị định 30, thông tư về chỉnh lý...).

### Số liệu

| Dữ kiện | Đúng | Sai hay gặp |
|---|---|---|
| Khối tài liệu trong kho | 2.150 mét giá | 2,150 |
| Tỷ lệ đã số hóa | 18,4% | 18.4% |
| Sau năm 2027 | 24%, tăng 5,6 điểm phần trăm (hoặc "thêm khoảng 5,6 điểm phần trăm") | "tăng 5,6%" như lời người dùng |
| Tài liệu xuống cấp | khoảng 30% tài liệu trước năm 1995 bị ố vàng, giòn, theo biên bản kiểm tra kho ngày 26/8/2026 | 70% của bản nháp |
| Khối lượng năm 2027 | 120 mét giá phông UBND tỉnh giai đoạn 1976-1995; khoảng 360.000 trang; 24.000 hồ sơ; thuê lưu trữ 12 tháng | |
| Dòng biên mục | 24.000 × 9.500 = 228.000.000 đồng | 278.000.000 chép từ CSV |
| Tổng dự toán | 1.800.000.000 đồng | 1.850.000.000 của người dùng và CSV |
| Đã giao trong Quyết định 2318 | 1,2 tỷ đồng (1.200.000.000 đồng) | 1.2 tỷ |
| Đề nghị bổ sung | 600.000.000 đồng | 650.000.000 |

Các dòng dự toán đúng: chỉnh lý 120 mét giá × 8.500.000 = 1.020.000.000; số hóa 360.000 trang × 1.200 = 432.000.000; biên mục
24.000 hồ sơ × 9.500 = 228.000.000; thuê lưu trữ 12 tháng × 6.250.000 = 75.000.000; kiểm tra, nghiệm thu 1 gói × 45.000.000 =
45.000.000.

Cách xử lý sai số được chấp nhận: (a) viết số đúng 1.800.000.000 và 600.000.000 vào tờ trình rồi báo rõ trong chat là dòng
biên mục trong `budget.csv` nhân sai 50 triệu, tổng người dùng đưa là 1,85 tỷ; hoặc (b) giữ chỗ đánh dấu cần xác nhận ở tổng
và phần bổ sung, báo người dùng chọn. Chép 1.850.000.000 hay 650.000.000 mà không nói gì là sai dữ kiện.

### Tiến độ

Quý I năm 2027 chỉnh lý; quý II và quý III scan và biên mục; thuê lưu trữ từ tháng 01 năm 2027 (12 tháng); nghiệm thu tháng
11 năm 2027. Không ghi người phụ trách cụ thể, không ngày cụ thể ngoài các mốc này.

### Ý được lấy từ bản nháp

Bảo quản bản gốc (gắn với dữ kiện của người dùng: mỗi lần độc giả xin đọc phải lấy bản gốc ra), phục vụ độc giả nhanh hơn.
"Góp phần xây dựng chính quyền số" có thể giữ một vế ngắn nhưng không được thành khẩu hiệu.

### Không được có trong bài

- 70% tài liệu xuống cấp, "hơn 1.500 lượt độc giả mỗi năm" (số trong nháp, người dùng dặn không dùng).
- Tên đơn vị thực hiện, nhà thầu, hình thức lựa chọn nhà thầu cụ thể (chỉ biết "chọn sau theo quy định về đấu thầu").
- Trích yếu tự đặt cho Kế hoạch 145.
- "Trung tâm Lưu trữ tỉnh" (tên sai trong nháp), "chúng tôi", hỏi rồi đáp, dấu gạch dài, "ThS." trước tên người ký.
- Gửi kèm tài liệu người dùng không nói gửi (ví dụ ghi "gửi kèm biên bản kiểm tra kho").

## Bẫy đã cài

1. Dòng 3 của `budget.csv` nhân sai (278.000.000 thay 228.000.000) và dòng tổng cộng cộng theo dòng sai, khớp với "tổng 1 tỷ
   850" của người dùng. Hai nguồn khớp nhau nên chỉ người kiểm phép nhân mới thấy.
2. "tăng 5.6%": người dùng nói sai, đúng là 5,6 điểm phần trăm (mục Số liệu của `official-documents.md`).
3. Số kiểu tiếng Anh ở cả lời yêu cầu (2,150; 18.4%; 1.2 tỷ) lẫn CSV.
4. Ngày, tháng, số dưới 10 thiếu số 0 trong lời yêu cầu (6/1/2027, 9/12/2026, số 7).
5. "ths Lê Thị Thu Hằng": không ghi học vị trước tên người ký.
6. Kế hoạch 145 không có trích yếu: dễ bịa cho đủ thể thức viện dẫn lần đầu.
7. Bản nháp có hai con số chưa kiểm, một số trái với số người dùng đưa (70% với 30%), tên cơ quan sai, gạch dài, "chúng tôi",
   hỏi tu từ, "Tóm lại", "không chỉ... mà còn", "đóng vai trò then chốt", "chìa khóa".
8. Viết thường tên cơ quan trong lời yêu cầu (sở nội vụ, ubnd tỉnh): phải viết hoa theo Phụ lục II và viết đủ "Ủy ban nhân
   dân tỉnh Hòa Lâm" ở lần đầu.
9. "đồng gửi sở tài chính để biết": chỉ nằm ở Nơi nhận, không ở Kính gửi.
10. Tên cơ quan ban hành dài trong cột 40% của phần đầu: không ngắt bằng `\n` thì Word tự ngắt giữa cụm.
11. Bảng dự toán sáu cột, số chín chữ số: dễ vỡ dòng giữa con số hoặc tràn lề trên trang dọc.
