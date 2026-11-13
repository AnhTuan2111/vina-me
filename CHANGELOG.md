# Thay đổi

Mỗi bản phát hành có một tag `vX.Y.Z` và một mục ở đây. Máy đã cài bằng `scripts/setup.mjs` tự cập nhật lên tag mới nhất;
dòng đầu của mục là dòng được in ra khi cập nhật.

## 0.17.0 (13/11/2026)

- Trong Claude Code, mỗi tin người dùng gửi đi kèm một dòng nhắc agent soát câu trả lời theo vina-me, kể cả câu trả lời chỉ vài
  câu, vì nội dung skill chỉ nạp một lần và dễ bị quên trong phiên dài. Máy đã cài được thêm hook này một lần ở lần đồng bộ đầu
  tiên sau khi cập nhật, có hiệu lực từ phiên sau.
- Hook là `UserPromptSubmit` trong settings.json, chạy `scripts/remind.mjs`. Người dùng tự gỡ hook thì lần đồng bộ sau không
  thêm lại. Máy chỉ cài skill, không cài bộ nhớ, thì tự thêm hook theo README.

## 0.16.2 (13/11/2026)

- Trong tệp Word do skill dựng, các chỗ đánh dấu chờ người duyệt như `[cần xác nhận: ...]` được tô nền vàng, nên BA hay người
  duyệt mở tệp ra là thấy ngay chỗ phải tự sửa. Việc tô áp cho hồ sơ dự thầu, văn bản hành chính và báo cáo xuất Word, với cả
  dấu `[cần bổ sung...]` và `[chưa có chứng minh...]`.

## 0.16.1 (13/11/2026)

- Agent dùng skill cho mọi câu trả lời trong chat bằng tiếng Việt, kể cả câu trả lời chỉ vài câu; trước đây skill chỉ được gọi
  khi viết đoạn dài hơn vài câu. Máy cài trước bản này vẫn giữ tệp `AGENTS.md` cũ, vì lúc cập nhật script không ghi đè tệp đó.
  Muốn agent đọc luật mới ngay từ bộ nhớ thì sửa dòng trong mục "Viết tiếng Việt" thành: "Mọi câu trả lời trong chat bằng tiếng
  Việt, dù chỉ vài câu, và mọi đoạn tiếng Việt viết ra hay sửa đều theo skill `vina-me`."

## 0.16.0 (13/11/2026)

- Hồ sơ dự thầu dựng đủ bộ tệp kỹ thuật: bảng đáp ứng dẫn đúng trang tài liệu hãng, tài liệu hãng tự tìm, tải và tô vàng đúng
  chữ được dẫn (`fetch-doc.mjs`, `pdf-highlight.mjs`), bản dịch, thuyết minh, tài liệu phần mềm, tiến độ, bản cam kết, báo cáo
  cho người duyệt; `package-check.mjs` soát cả bộ. Ba lần thử liền trên một gói thầu thật được người chấm độc lập cho 97, 96, 98
  trên 100.
- Các mảng viết (lời giải thích, sửa văn, soát văn, email và tin nhắn, báo cáo rà soát, văn bản hành chính, chữ trên sơ đồ, báo
  cáo xuất Word, viết theo giọng, góp ý về skill) được chấm lại theo thang 100 và sửa luật, ví dụ, script ở những chỗ người chấm
  trừ điểm. `lint.mjs` bắt thêm mẫu câu văn máy, `report-docx.mjs` ghi kèm chữ để soát.
- Thêm `references/storytelling.md`: dẫn dắt người đọc đi một mạch, rút từ ba audio kể chuyện tiếng Việt.
- Bài giảng viết theo lối dẫn dắt của `storytelling.md`: trước khi viết thì kê mọi chữ người học sẽ gặp (đã dạy, dạy ở đây, tránh),
  mở bằng câu hỏi của người học, mỗi câu trả lời mở ra câu hỏi sau. Luật chi tiết chuyển sang `references/teaching-checklist.md`
  để soát. Bảy lần thử bài giảng gần nhất được 89 tới 95 trên 100; bản vá sau sẽ đưa lên mức 95 ổn định.
- Gọi thẳng một việc bằng `/vina-me write|edit|review|word|bid|memory|secret|feedback`. `SKILL.md` gọn lại, chi tiết cách trả kết
  quả từng việc chuyển sang `references/core-rules.md`.
- `setup.mjs` in cách dùng khi gặp `--help`, báo lỗi khi gặp cờ lạ thay vì chạy cài đặt, và không tạo task Task Scheduler thật
  khi chạy với `--home` giả.
- Sổ góp ý: trong lúc làm, gặp chỗ skill hướng dẫn sai hay script lỗi thì agent tự ghi một dòng vào sổ trên máy, không đợi
  người dùng chê; cuối việc hỏi một lần có gửi thành góp ý không. Không có tài khoản GitHub thì gửi tệp sổ cho người cài skill.
- Mô tả skill nói rõ việc làm hồ sơ dự thầu; chữ "thuận mồm" đổi thành "lưu loát".

## 0.15.0 (10/11/2026)

- Hồ sơ dự thầu soát kỹ hơn, theo các lỗi người chấm đã trừ điểm ở những lần thử: `bid-check.mjs` bắt lịch nhắc lại ngoài phần
  tiến độ chưa đánh dấu, số thập phân dấu chấm kiểu Anh, câu khẳng định ai làm phần mềm khi đang chờ BA, thêm lời nói với BA
  trong thân hồ sơ. `bid-docx.mjs` không để tên phần còn một chữ ở dòng cuối, không gãy mã hiệu ở dấu gạch nối, báo cột bảng
  quá hẹp, căn giữa cột STT, Bước, Mã. `render-pdf.ps1 -UpdateDocx` giữ tên nhà thầu ở "người sửa cuối" của tệp Word. Hướng
  dẫn thêm mục soát cuối như người chấm, cách điền Mẫu 10B, cách đánh dấu lịch và đề xuất nhắc lại ở nhiều chỗ.

## 0.14.0 (10/11/2026)

- Viết phần kỹ thuật của hồ sơ dự thầu (thuyết minh đề xuất kỹ thuật E-HSDT) từ hồ sơ mời thầu: quy trình tám bước ở
  `references/bid-proposals.md`, hướng dẫn từng bước ở `references/bid/`. Script ở `scripts/bid/`: `bid-docx.mjs` dựng Word
  theo khuôn hồ sơ mẫu của công ty hoặc khuôn dựng sẵn; `bid-check.mjs` soát chỗ còn trống, chữ gán sai trang catalog, cam
  kết và chi tiết kỹ thuật tự đặt chưa đánh dấu, chữ của gói cũ; `docx-profile.mjs` so định dạng với hồ sơ mẫu;
  `page-check.mjs` soát bố cục trang PDF; `render-pdf.ps1` cho Word cập nhật mục lục và xuất PDF. Bảng, mục lục, bìa, bảng
  tiến độ trình bày gọn hơn hồ sơ mẫu. Thay cho phần hồ sơ dự thầu của bản 0.13 đã gỡ.

## 0.12.0 (09/11/2026)

- Người dùng chê hay góp ý về chính skill thì agent hỏi có muốn gửi thành issue trên repo vina-me không, soạn bản nháp cho
  người dùng duyệt rồi gửi bằng `scripts/feedback.mjs` (che mật khẩu, token; chưa có gh thì đưa link trang tạo issue điền sẵn).

## 0.11.0 (07/11/2026)

- SKILL.md gọn còn một nửa (khoảng 4.300 token thay vì 8.700 mỗi lần gọi skill); bản đầy đủ của bảy điều chuyển sang
  `references/core-rules.md`, agent đọc khi viết văn bản dài hay soát kỹ. Mô tả skill nạp ở mọi phiên ngắn đi một phần ba.

## 0.10.1 (07/11/2026)

- Dòng báo khi cập nhật in đủ câu, không còn bị cắt ở chỗ CHANGELOG xuống dòng.

## 0.10.0 (07/11/2026)

- Học từ phiên cũ kèm tóm gọn từng lượt của agent: đoạn đầu phần suy nghĩ, đoạn đầu câu trả lời, skill đã gọi; `overview.md`
  có bảng skill dùng nhiều. Cờ `--user-only` để chỉ lấy lời người dùng như trước.

## 0.9.0 (07/11/2026)

- Tự cập nhật theo bản phát hành có tag thay vì nhánh `main`; người bảo trì chuyển kênh bằng `setup.mjs channel main`.
- Bộ nhớ có lệnh `check` (quá dài, ý gần trùng, lời trích thiếu ngày), `conflict` và `resolve mine|theirs` khi hai máy sửa
  cùng chỗ; `sync` chờ mạng tối đa 15 giây, kiểm bản mới tối đa 6 giờ một lần.
- Học từ phiên cũ nói rõ việc gửi lịch sử lên nhà cung cấp mô hình, thêm `--only`, `--exclude`, báo số chỗ đã che.
- Mô tả đúng phạm vi bảo vệ của `secrets.mjs`: chặn lộ qua chat và lịch sử phiên, không chặn chương trình chạy cùng tài khoản.
- Script xuất Word tự cài gói `docx` ở lần chạy đầu; `lint.mjs` đếm độ dài câu theo tiếng.
- Thêm sáu đề thử cho văn bản hành chính và văn bản của BA, tester.
- README gọn lại, có ảnh màn hỏi khi cài.

## 0.8.0 (06/11/2026)

- Mọi tên tệp, cờ, lệnh con, khoá JSON đổi sang tiếng Anh.
- Bộ nhớ tự xếp ý vào `user.md` hay `memory.md`; agent chỉ sửa tệp, `sync` gom thành một commit khi mở, đóng phiên, khi
  đăng nhập máy và mỗi 2 giờ; vina-me tự cập nhật.

## 0.7.0 (06/11/2026)

- Script cài cho Claude Code và Codex, bộ nhớ dùng chung `~/agent-memory`, đồng bộ qua repo GitHub riêng tư.
- Học từ phiên cũ, giữ mật khẩu cho agent, giao diện hỏi kiểu powerline.

## 0.6.0 (06/11/2026)

- Văn bản hành chính theo Nghị định 30/2020: tài liệu thể thức, soát thể thức, script xuất docx.

## 0.5.0 (06/11/2026)

- Báo cáo rà soát, chữ trên sơ đồ và tài liệu kỹ thuật, xuất docx, cách trả lời trong chat.

## 0.1.0 (13/10/2026)

- Bản đầu tiên: bảy điều viết cho thuận mồm và các tệp tham khảo.
