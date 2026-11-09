# Gửi góp ý về skill thành issue

Người dùng chê một câu agent viết thì phần lớn là chuyện của bài đó: sửa xong là hết. Nhưng có lúc cái sai nằm ở chính
skill, ví dụ quy tắc khuyên một kiểu câu mà người dùng thấy gượng, một loại văn bản skill chưa nói tới, `lint.mjs` báo
nhầm, script cài lỗi. Những chỗ đó tác giả skill cần biết để sửa cho mọi người dùng, nên agent hỏi người dùng có muốn
gửi góp ý thành issue trên repo `github.com/AnhTuan2111/vina-me` không.

## Khi nào hỏi

Hỏi khi lời chê hay góp ý nhắm vào cách skill làm việc:

- văn agent viết theo skill vẫn bị chê là máy móc, rời rạc, văn mẫu, và lỗi lặp lại sau khi đã sửa theo quy tắc;
- người dùng nói một quy tắc của skill sai, thừa, hay thiếu một trường hợp;
- script của skill (`setup.mjs`, `lint.mjs`, `learn-from-sessions.mjs`, script xuất Word) báo lỗi hay chạy sai;
- người dùng nói thẳng muốn góp ý cho skill.

Không hỏi khi người dùng chỉ sửa dữ kiện, con số, ý của bài, chê thứ không do skill quyết (mô hình chậm, công cụ khác
lỗi), hay khi họ đã từ chối gửi chuyện đó trong phiên này.

## Các bước

1. Làm xong việc người dùng đang cần trước, góp ý để sau.
2. Hỏi một câu, nói rõ repo công khai: "Chỗ này có vẻ do quy tắc của skill. Mình gửi góp ý lên repo vina-me để tác giả
   sửa nhé? Issue ở repo công khai nên ai cũng đọc được, mình sẽ cho bạn xem bản nháp trước." Không đồng ý thì thôi.
3. Viết bản nháp. Tiêu đề là một câu nói chỗ sai, ví dụ "Quy tắc hỏi rồi đáp bị áp cho cả thư gửi sếp". Thân có bốn mục:
   - **Người dùng nói gì**: lời phàn nàn, trích nguyên văn trong ngoặc kép.
   - **Skill đã làm gì**: loại văn bản đang viết, đoạn bị chê (tối đa mười dòng).
   - **Lẽ ra thế nào**: theo lời người dùng; quy tắc nào của skill dính vào (tên tệp, tên mục). Đoán thì ghi là đoán.
   - **Cách lặp lại**: yêu cầu kiểu gì thì ra lỗi này, đủ để tác giả thử lại.
4. Trong đoạn trích, thay tên người, tên cơ quan, tên khách hàng, số liệu, địa chỉ bằng chữ chung ("[tên công ty]",
   "[số tiền]"). Văn bản mật hay nội bộ thì không trích, chỉ tả kiểu câu bị lỗi bằng một câu tự đặt.
5. Đưa người dùng xem nguyên bản nháp, sửa theo ý họ. Có câu đồng ý mới gửi.
6. Ghi thân bài ra một tệp tạm, rồi chạy từ thư mục skill:

   ```
   node scripts/feedback.mjs --title "<tiêu đề>" --body-file <tệp> --agent "<Claude Code hoặc Codex>"
   ```

   Script che mật khẩu, token trông thấy được, thêm "Góp ý: " vào đầu tiêu đề và một dòng phiên bản skill ở cuối.
7. Đưa người dùng đúng link script in ra. Máy có `gh` đã đăng nhập thì đó là link issue vừa tạo. Chưa có thì đó là link
   trang tạo issue đã điền sẵn: người dùng mở, đăng nhập GitHub, xem lại rồi bấm "Submit new issue". Người dùng không
   có tài khoản GitHub thì họ gửi link đó cho người có tài khoản, hoặc báo thẳng cho tác giả.

Muốn xem trước đúng thứ sẽ gửi thì thêm `--dry-run`: script in tiêu đề, nội dung đã che và link, không gửi gì.

## Không gửi

Mật khẩu, token, khoá; nội dung tài liệu nội bộ; tên khách hàng, dữ liệu cá nhân; đường dẫn máy có tên người. Script chỉ
che được bí mật có hình dạng quen (token GitHub, chuỗi khoá dài, "mật khẩu: ..."), không nhận ra một đoạn văn mật. Giữ
những thứ đó ra khỏi bản nháp là việc của agent ở bước 4.
