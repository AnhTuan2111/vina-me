# Thang chấm nhóm client-docs

Tổng 100 điểm, đạt từ 95. Đề ở `prompt.md`, đáp án và bẫy ở `scenario.md`. Bài làm gồm tệp Word (`runs/rN/output.docx` hay
tên khác trong thư mục bài), lời trả trong chat (`runs/rN/output.md` hay phần chat chép vào `notes.md`), và `notes.md`.

## Cách chấm

- Mở tệp Word bằng Word, xuất PDF (giữ khóa `evals/.word-lock` theo `evals/README.md`), xem ảnh từng trang.
  Đọc phông, cỡ, lề trong `word/document.xml` khi ảnh không đủ rõ.
- Đọc văn tuần tự từng câu, từ đầu tới cuối, cả trong tệp lẫn trong chat: câu này có dựa trên câu trước không, có lặp
  từ khoá hay từ nối đúng quan hệ không. Không quét cả bài rồi chấm theo cảm giác.
- Mọi điểm trừ ghi mục, số điểm, và trích nguyên văn câu hay ô bảng làm bằng chứng. Không có bằng chứng thì không trừ.
- Một lỗi chỉ trừ ở một mục, mục nặng nhất.
- Đối chiếu dữ kiện với bảng đáp án trong `scenario.md`, không với trí nhớ.

## Trần điểm

| Điều kiện | Tổng không quá |
|---|---|
| Bịa một dữ kiện (danh sách "Điều bài không được bịa" trong `scenario.md`, hay bất kỳ con số, tên, cổng, hạn nào không có trong ba tệp vào) | 80 |
| Bịa từ hai dữ kiện trở lên | 70 |
| Lọt từ ba thông tin nội bộ trở lên vào tệp gửi khách | 85 |
| Không có tệp `.docx` | 50 |

## A. Đúng dữ kiện, không bịa: 30 điểm

| Lỗi | Trừ |
|---|---|
| Sai hoặc thiếu một dữ kiện ở mục 1, 3, 4, 5 (tên, số vCPU, RAM, ổ đĩa, IP, phiên bản, máy cài, cổng) | 2 mỗi chỗ, tối đa 12 |
| Không theo chỗ khách đã sửa: giờ sao lưu 01:00, tên miền `hoadon.capnuocvankhe.vn`, Grafana chỉ mở cho 10.20.9.0/24, giữ 30 ngày | 4 mỗi chỗ |
| Cổng ứng dụng: tự chọn 8080 hay 8443 mà không đánh dấu trong tệp và không báo người dùng | 8 |
| Cổng ứng dụng: đánh dấu trong tệp mà không báo trong chat, hoặc báo trong chat mà tệp ghi chắc một số | 3 |
| Hệ điều hành db02 để trống mà không đánh dấu, không báo (điền một bản bất kỳ thì tính là bịa, áp trần) | 3 |
| Thiếu một tình huống ở mục 8, hay một ngưỡng cảnh báo ở mục 7, hay một bước của quy trình db01 hỏng | 2 mỗi chỗ |
| Thiếu chi tiết sao lưu: công cụ, máy chạy, WAL, đường dẫn NAS, cách phục hồi PITR | 1 mỗi chỗ, tối đa 4 |
| Chép nguyên chiều replication "db01 tới db02" mà không sửa, không báo | 2 |
| Mỗi dữ kiện bịa (ngoài việc áp trần) | 5 |

## B. Theo mẫu của khách, chỉ mô tả hệ thống đích: 20 điểm

Luật nguồn: `references/diagrams-and-docs.md`, mục "Tài liệu kỹ thuật gửi khách".

| Lỗi | Trừ |
|---|---|
| Thêm, bớt, đổi tên hay đổi thứ tự một mục so với 9 mục của TL-03 (kể cả thêm "Giới thiệu", "Ghi chú", "Phụ lục") | 5 mỗi chỗ |
| Bảng thiếu, thêm hay đổi tên cột so với mẫu | 2 mỗi bảng |
| Thiếu dòng "Hệ thống: ..." dưới tên tài liệu | 1 |
| Một tình huống ở mục 8 thiếu dấu hiệu nhận biết, các bước, hay người thực hiện (để chỗ đánh dấu cần bổ sung thì không trừ) | 1 mỗi tình huống, tối đa 4 |
| Lọt thông tin nội bộ: nhánh, commit, tag rc, load test, bug BILL-412, nhánh `feature/payment-v2`, kết quả thử phục hồi 40 phút, RAM hiện tại 12 GB, tên người của Bên B | 4 mỗi thứ |
| Thứ đã chốt mà viết dạng đề xuất ("có thể dùng", "nên", "dự kiến", "đề xuất sử dụng") | 2 mỗi chỗ |
| Chỗ chưa chốt (SMTP, nơi lưu ảnh hóa đơn) nằm trong thân mục khác thay vì mục 9, hay viết ở đó như đã chốt | 3 mỗi chỗ |
| Mục 9 thiếu SMTP hay nơi lưu ảnh hóa đơn | 4 mỗi thứ |
| Mục 9 còn dòng thời gian giữ bản sao lưu (khách đã chốt) | 2 |
| Cột "Phương án Bên B đề xuất" của dòng lưu ảnh không nêu phương án nghiêng về S3 của Bên A, hay không nói phương án còn lại | 1 |

## C. Chữ cho sơ đồ: 10 điểm

Luật nguồn: `references/diagrams-and-docs.md`, mục "Sơ đồ". Chấm phần chữ sơ đồ trong chat và chú thích hình trong tệp.

| Lỗi | Trừ |
|---|---|
| Không gửi chữ cho sơ đồ trong chat | 10 |
| Khối kèm dòng phụ cấu hình, phiên bản, IP, mô tả dài thay vì chỉ tên | 2 |
| Nhãn trộn hai ngôn ngữ, hay đổi cách gọi một khối giữa các nhãn | 2 |
| Thiếu khối mà tài liệu có nhắc: người dùng, web01, app01, app02, db01, db02, mon01, NAS, dải quản trị | 2 mỗi khối, tối đa 4 |
| Nhãn mũi tên chỉ ghi giao thức hay cổng, không nói việc gì xảy ra | 2 |
| Mũi tên trỏ vào thứ chung chung ("mạng", "các máy") thay vì thứ nhận, hay không nói chiều | 2 |
| Đánh số mũi tên như một quy trình cho sơ đồ cấu trúc | 1 |
| Chú thích không theo dạng "Hình 1. ...", hoặc chỉ ghi "Sơ đồ triển khai" mà không nói sơ đồ cho thấy gì | 2 |
| Tệp không chừa chỗ cho hình (không có khung hay khoảng trống) | 1 |

## D. Đúng loại việc và cách trả kết quả: 10 điểm

Luật nguồn: bảng "Trả kết quả" và mục "Trả lời trong chat" của `SKILL.md`. Đây là việc viết mới ra tệp Word: dựng tệp, xuất
PDF, xem từng trang trước khi đưa, rồi trả tệp cộng một hai câu về chỗ chưa kiểm hay thiếu dữ kiện.

| Lỗi | Trừ |
|---|---|
| Không có tệp `.docx` | 10 (và mục F được 0) |
| Không xuất PDF và xem từng trang (không có bằng chứng trong `notes.md` hay chat) | 4 |
| Không nói đã kiểm gì, chưa kiểm gì, chỗ nào thiếu dữ kiện | 3 |
| Lời chat lặp lại nội dung tệp, khen, chấm điểm, ước lượng thời gian, kể lể từng bước đã làm | 2 mỗi loại, tối đa 4 |
| Câu hỏi gửi người dùng không tự đứng được (không nói ở đâu, hiện thế nào, mỗi phương án ra sao) | 2 |
| Không chạy `scripts/lint.mjs` hay không nói đã soát văn bằng cách nào | 1 |

## E. Độ lưu loát, văn máy: 15 điểm

Áp cho mọi câu văn trong tệp (mục 6, 7, 8, chú thích, ô bảng viết thành câu) và trong chat. Đọc tuần tự từng câu.

| Lỗi | Trừ |
|---|---|
| Câu sau không dựa trên câu trước: đổi đề tài không có từ nối, che câu trước thì câu sau đứng riêng được trong khi hai ý có quan hệ | 1 mỗi chỗ, tối đa 5 |
| Văn máy, văn mẫu: "đóng vai trò", "đảm bảo tính...", "nhằm mục đích", "giải pháp toàn diện", "Hãy", "chúng ta", "không chỉ... mà còn", bộ ba cho đủ, mở mục bằng "Mục này trình bày..." hay "Tài liệu này nhằm..." | 1 mỗi chỗ, tối đa 5 |
| Liệt kê "một là, hai là", hay chặt một chuỗi nhân quả (hỏng thì làm gì, rồi sao) thành gạch đầu dòng cụt | 1 mỗi chỗ, tối đa 3 |
| Câu chốt cuối đoạn hay cuối mục ("Nhờ vậy hệ thống luôn sẵn sàng", "Như vậy dữ liệu được bảo vệ an toàn") | 2 mỗi chỗ |
| Chữ nhấn thừa ("rất", "hoàn toàn", "luôn luôn", "chính là", "đúng"), in đậm để nhấn trong thân | 1 mỗi chỗ, tối đa 3 |
| Dấu gạch dài, gạch vừa, mũi tên ký tự (kể cả `->`), `~`, `&`, `=` trong câu văn hay nhãn sơ đồ (trừ lệnh, cấu hình chép nguyên trong phông mã) | 2 mỗi loại |
| Một thứ hai tên (db01 lúc "máy chủ chính", lúc "primary", lúc "DB chính" mà không chốt) | 1 mỗi thứ |
| Xưng hô sai giọng trong tệp gửi khách ("mình", "chúng tôi", "bạn" thay cho Bên A, Bên B hay chủ ngữ là máy) | 2 |

## F. Hình thức trang Word: 15 điểm

Luật nguồn: phần "Quy định trình bày" của mẫu TL-03 (thắng quy ước Arial 11 của `references/docx-export.md` vì luật "có mẫu
của bên nhận thì theo đúng mẫu"), và mục "Kiểm sau khi xuất" của `references/docx-export.md`. Chấm trên ảnh trang PDF.

| Lỗi | Trừ |
|---|---|
| Còn phông khác Times New Roman ở chữ thường, đề mục hay bảng (Arial của `report-docx.mjs` còn sót) | 5 |
| Cỡ sai: thân khác 13, chữ bảng khác 12, lệnh và đường dẫn không phải Courier New 11 | 1 mỗi loại |
| Lề khác trên 20, dưới 20, trái 30, phải 15 mm | 3 |
| Không có số trang giữa chân trang | 2 |
| Tên tài liệu không in hoa, đậm, cỡ 14, căn giữa | 1 |
| Đề mục không đánh số "1.", "2." theo mẫu, hay đánh số lặp ("1. 1. Thông tin chung") | 2 |
| Bảng thiếu viền ô, hay hàng tiêu đề không lặp khi bảng sang trang | 1 mỗi lỗi |
| Bảng tràn lề, hay cột hẹp tới mức IP, phiên bản, đường dẫn bị ngắt giữa chừng | 2 |
| Đề mục nằm cuối trang mà nội dung ở trang sau, trang trống, chú thích hình rời khỏi chỗ chừa hình | 1 mỗi chỗ |

## Bài trung bình trông ra sao

Một bài dựng bằng `report-docx.mjs` mà không sửa phông, lề, số trang (mất 10 ở F), tự chọn cổng 8080 không báo (mất 8 ở A),
còn vài câu văn mẫu ở mục 6, 8 (mất 2-3 ở E) thì vào khoảng 78-80. Bài đạt 95 phải đúng hết dữ kiện, đánh dấu và báo đủ ba
chỗ thiếu hay mâu thuẫn, giữ sạch thông tin nội bộ, và tệp đúng thể thức TL-03 trên ảnh trang PDF.
