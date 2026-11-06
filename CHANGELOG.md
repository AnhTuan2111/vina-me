# Thay đổi

Mỗi bản phát hành có một tag `vX.Y.Z` và một mục ở đây. Máy đã cài bằng `scripts/setup.mjs` tự cập nhật lên tag mới nhất;
dòng đầu của mục là dòng được in ra khi cập nhật.

## 0.9.0 (07/11/2026)

- Tự cập nhật theo bản phát hành có tag thay vì nhánh `main`; người bảo trì chuyển kênh bằng `setup.mjs channel main`.
- Bộ nhớ có lệnh `check` (quá dài, ý gần trùng, lời trích thiếu ngày), `conflict` và `resolve mine|theirs` khi hai máy sửa
  cùng chỗ; `sync` chờ mạng tối đa 15 giây, kiểm bản mới tối đa 6 giờ một lần.
- Học từ phiên cũ nói rõ việc gửi lịch sử lên nhà cung cấp mô hình, thêm `--only`, `--exclude`, báo số chỗ đã che.
- Mô tả đúng phạm vi bảo vệ của `secrets.mjs`: chặn lộ qua chat và lịch sử phiên, không chặn chương trình chạy cùng tài khoản.
- Script xuất Word tự cài gói `docx` ở lần chạy đầu; `lint.mjs` đếm độ dài câu theo tiếng.
- Thêm sáu đề thử cho văn bản hành chính và văn bản của BA, tester.

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
