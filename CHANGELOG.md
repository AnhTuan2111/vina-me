# Thay đổi

Mỗi bản phát hành có một tag `vX.Y.Z` và một mục ở đây. Máy đã cài bằng `scripts/setup.mjs` tự cập nhật lên tag mới nhất;
dòng đầu của mục là dòng được in ra khi cập nhật.

## 0.13.1 (09/11/2026)

- `bid-check.mjs` bắt cả chỗ đánh dấu "[chưa có chứng minh]", không còn đọc nhầm "A08 tháng 8/2026" thành thời hạn 8 tháng.
  Hướng dẫn hồ sơ dự thầu nói thêm: bản chữ trích từ PDF hay mất ký hiệu ≥ và ≤, nên cột yêu cầu chép theo ảnh trang.

## 0.13.0 (09/11/2026)

- Viết hồ sơ dự thầu: hướng dẫn ở `references/bid-proposals.md` (bảng truy vết yêu cầu, dàn mục theo tiêu chuẩn đánh giá
  kỹ thuật, bảng đáp ứng thông số, tài liệu kỹ thuật sản phẩm, dùng hồ sơ cũ làm bản đối chứng); `scripts/bid-docx.mjs`
  dựng tệp Word trên khuôn là tệp Word của công ty; `scripts/bid-check.mjs` soát chỗ còn trống, mục dẫn sai, tên và thời
  hạn của gói cũ còn sót. Hai script không cần cài gói npm.

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
