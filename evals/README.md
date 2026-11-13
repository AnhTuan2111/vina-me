# Đề thử và thang chấm

`evals.json` viết theo khuôn eval của skill `skill-creator`. Mỗi đề trong đó có lời yêu cầu, bài đạt trông thế nào và các tệp
vào. Đề 1 tới 13 là bộ đầu, người chấm đối chiếu bài làm với phần `expected_output`. Từ đề 14, mỗi đề có một thư mục riêng
`evals/<nhóm>/`, trong thư mục có các tệp sau:

- `prompt.md`: lời yêu cầu như người dùng thật gõ.
- `scenario.md`: đề này thử luật nào của skill, đáp án dữ kiện, bẫy, điều bài không được bịa.
- `rubric.md`: thang 100 điểm, đạt từ 95.
- `inputs/`: tệp vào, nếu đề cần.

Mọi tên công ty, cơ quan, người, con số trong đề là dữ kiện giả.

## Cách làm và chấm

1. Người làm đưa lời yêu cầu ở `prompt.md` cho một agent đã cài vina-me, chạy trong thư mục gốc của skill. Bài làm lưu vào
   `evals/<nhóm>/runs/rN/`, gồm tệp kết quả và `notes.md` ghi lời trả trong chat cùng các lệnh đã chạy.
2. Người chấm là một agent khác. Agent này không sửa bài, không sửa skill, chỉ ghi `grade.md` vào thư mục của lần làm đó theo
   `rubric.md`. Mỗi điểm trừ phải trích nguyên văn câu trong bài. Soát độ đọc thì đọc tuần tự từng câu, xem câu sau có nối và
   dựa trên câu trước không.
3. Một đề coi là đạt khi ba lần làm liền nhau đều từ 95 điểm.

Bài làm, home giả và khóa Word không đưa lên repo, `.gitignore` đã chặn sẵn.

## An toàn máy

- Đề nhóm `memory` và `feedback` chạy script của skill, nên luôn đặt `HOME` và `USERPROFILE` vào một thư mục tạm. Đề `memory`
  dựng sẵn thư mục đó bằng `node evals/memory/inputs/build-home.mjs`.
- Không chạy `scripts/setup.mjs` để cài thật, không chạy `tests/setup.test.mjs` trên bản checkout đang dùng, không gửi issue
  thật.
- Xuất PDF bằng Word thì giữ khóa để hai agent không mở Word cùng lúc. Trước khi mở Word, tạo thư mục `evals/.word-lock`; tạo
  không được thì chờ 20 giây rồi thử lại. Xong việc thì xoá thư mục đó.
