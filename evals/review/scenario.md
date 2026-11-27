# Đề nhóm review: soát hướng dẫn khôi phục database mà không sửa

## Lời yêu cầu

Ở `prompt.md`. Tệp vào: `inputs/restore-guide.md` (379 tiếng, Markdown, hai khối code bash). Dữ kiện giả: app ClinicBook,
máy `db-staging-01`, bucket `clinicbook-backup`, role `report_reader`, kênh #staging.

SHA-256 của tệp vào lúc ra đề, để người chấm kiểm tra bài làm có sửa tệp hay không:
`2d7e5ef770178b6b534257069770552815bb84ce6b8690afda6249ca00a49b6d`

## Đề thử điều gì của skill

- Đúng loại việc "Soát mà không sửa" trong bảng Trả kết quả của `SKILL.md`: từng chỗ "câu gốc, vấn đề, cách sửa", từ
  nặng tới nhẹ, không viết lại cả bài, không đụng vào tệp. Người dùng còn dặn thêm thứ tự: nội dung sai và chỗ làm người
  đọc làm sai lên trước, lỗi câu chữ sau.
- Có đọc tuần tự từng câu như người đọc thật hay chỉ chép lại kết quả của `scripts/lint.mjs`. Script bắt được mười bốn chỗ;
  những chỗ nặng nhất và hai chỗ phạm phương châm hội thoại nằm ngoài tầm của nó.
- Có biết khi nào kết quả của script là báo nhầm (luật "không phải X mà là Y" được giữ khi sửa một cách hiểu có thật).
- Phân biệt được hai câu phủ định bác bỏ (`references/machine-tells.md`, đoạn dưới bảng B): câu ở mục Backup chạy thế
  nào bác một cách hiểu sai mà câu trước đã nêu, nên giữ; câu ở mở bài bác một ý chưa ai nói, nên bỏ. Bài phải nói được
  lý do (câu bác bỏ cần một ý kiến có thật để bác), không chỉ gọi đó là khuôn văn AI slop.
- Có giữ được luật "nói thật" khi soát: gặp hai con số chọi nhau thì hỏi tác giả, không tự chọn một số; không bịa cách sửa
  dựa trên dữ kiện tệp không có.
- Không bắt nhầm ký hiệu trong code (skill chỉ cấm `~`, `&` trong câu văn).
- Năm câu hỏi theo phương châm hội thoại (`references/core-rules.md`, mục Soát theo năm phương châm hội thoại). Tệp có một
  câu lạc đề kèm suy luận không theo được (phương châm quan hệ, về chất) và một câu phán xét dev mới (phương châm lịch
  sự). Lời soát của chính bài cũng phải giữ lịch sự mà vẫn nói rõ là lỗi: nói giảm chữ chê, không nói giảm tới mức lỗi
  làm người đọc xoá nhầm dữ liệu thành lời gợi ý nhẹ (`references/review-reports.md`, mục Giọng).

## Kết quả lint lúc ra đề

`node scripts/lint.mjs inputs/restore-guide.md` (bản 0.26.0) báo mười bốn chỗ: gạch dài ở nhan đề; "đóng vai trò", "không
chỉ", "chìa khoá", "then chốt"; "Hãy"; "Tóm lại"; "KHÔNG" in hoa; dấu `&`; mở bài "Trong thời đại…"; câu mở bằng "Với";
database, CSDL, DB; "Mỗi đêm" với "9h sáng"; "kịp thời" với "lẽ ra"; giữ 7 ngày với giữ 14 ngày; câu "không phải … mà là" ở mở bài. Câu "không phải … mà là" ở
mục Backup chạy thế nào thì nó chỉ ghi chú là thường được giữ, vì câu trước có "Rất dễ nghĩ".

Script không bắt được: lời dặn kiểm tra tên máy đứng sau lệnh xoá, bản dump lấy từ database nào, "Tuy nhiên" sai quan hệ,
"nó" trỏ không rõ, câu PostgreSQL lạc đề và câu phán xét dev mới. Script cũng không nói vì sao câu bác bỏ ở mở bài
phải bỏ còn câu ở mục Backup được giữ; lý do đó bài phải tự nói.

## Đáp án: chỗ bài phải chỉ ra

Xếp từ nặng tới nhẹ như người dùng dặn. Câu gốc trích nguyên văn từ tệp.

### Nội dung sai hoặc làm người đọc làm sai (phải đứng đầu bài)

1. Hai con số chọi nhau về thời gian giữ backup. "Bản backup được giữ 7 ngày rồi tự xoá." (mục Backup chạy thế nào) và
   "Bản backup trên bucket được giữ 14 ngày, nên có thể lấy bản cũ hơn nếu bản mới nhất bị hỏng." (mục Khi có lỗi). Cách
   sửa đúng: hỏi tác giả số nào đúng (xem cấu hình xoá tự động của bucket), sửa cả hai chỗ về một số. Không được tự chọn
   7 hay 14.
2. "Mỗi đêm" chọi với giờ chạy. Đoạn đó nói cron chạy 2h sáng giờ UTC, tức 9h sáng ở Việt Nam, nên với người đọc ở Việt Nam
   backup không chạy "mỗi đêm". Cách sửa: "Mỗi ngày" hoặc ghi thẳng giờ. Phép đổi 2h UTC ra 9h giờ Việt Nam là đúng (UTC+7).
3. Lời dặn kiểm tra tên máy đứng sai chỗ. "Lưu ý: KHÔNG chạy bước 3 trên production. Hãy kiểm tra kỹ tên máy trước khi gõ
   lệnh." đặt sau Bước 4, tức là sau lệnh `dropdb` đã chạy; người làm theo thứ tự sẽ đọc thấy nó khi đã xoá xong. Chính
   câu sau trong tệp cũng nói việc này "lẽ ra phải được làm trước khi tải backup". Cách sửa: đưa thành một bước trước Bước
   1 (hoặc ít nhất ngay trước Bước 3).
4. Không rõ bản dump trên bucket lấy từ database nào. Mục Backup chạy thế nào chỉ nói "dump toàn bộ database", còn mục Khi
   có lỗi lại nói lỗi role "thường gặp khi bản dump lấy từ production". Người đọc không biết `latest.sql.gz` là dữ liệu
   staging hay production, mà đó là điều quyết định có được nạp vào staging không (dữ liệu thật của production vào môi
   trường dùng chung). Cách sửa: hỏi tác giả và ghi rõ nguồn của bản dump. Không được tự khẳng định nó là production hay
   staging.

### Lỗi câu, từ, liên kết

5. "Với bản dump này đã chứa cả dữ liệu lẫn cấu trúc bảng." Thiếu chủ ngữ do mở bằng "Với". Sửa: "Bản dump này chứa cả…".
6. "Tuy nhiên, nó mất khoảng 15 phút." Hai lỗi trong một câu: "Tuy nhiên" không có ý tương phản nào với câu trước (báo trên
   kênh #staging); "nó" có thể trỏ việc khôi phục, việc báo, hay CSDL. Sửa: gọi đúng tên, ví dụ "Cả lần khôi phục mất
   khoảng 15 phút", và chuyển câu về chỗ hợp (cạnh câu báo kênh, nối bằng "vì" hoặc "nên"). Bài chỉ nêu một trong hai lỗi
   thì được nửa điểm mục này.
7. Một thứ ba tên: "database" (nhan đề, mở bài, Bước 3), "CSDL" (đoạn hai mục Backup), "DB" (Bước 2). Sửa: giữ "database".
8. "Việc kiểm tra tên máy kịp thời này lẽ ra phải được làm trước khi tải backup." Hai ý chọi nhau: "kịp thời" nói việc đã
   làm đúng lúc, "lẽ ra" nói việc chưa làm. Đây là đúng mẫu lỗi trong `references/common-errors.md`. Sửa: bỏ câu, vì việc
   này đã thành một bước ở đầu (gộp với điểm 3).
9. Mở bài văn mẫu: "Trong thời đại dữ liệu là tài sản quý giá nhất của doanh nghiệp, việc sao lưu đóng vai trò then chốt."
   Khuôn bối cảnh thời đại, "đóng vai trò", chủ ngữ "việc sao lưu". Sửa: bỏ câu, mở thẳng bằng câu thứ hai.
10. Đoạn kết văn mẫu: "Khôi phục không chỉ giúp sửa lỗi mà còn giúp đội ngũ tự tin hơn, nhanh hơn & chủ động hơn. Tóm
    lại, nắm vững quy trình này chính là chìa khoá để làm chủ hệ thống." Gồm "không chỉ… mà còn" nâng tầm, bộ ba cho đủ
    vần, dấu `&` trong câu văn, "Tóm lại", "chính là" nhấn thừa, ẩn dụ "chìa khoá", câu khẳng định ý nghĩa dùng cho bài
    nào cũng được. Sửa: bỏ cả đoạn, hướng dẫn hết ở mục Khi có lỗi là dừng.
16. "Khôi phục database không phải là việc khó, mà là việc phải làm cẩn thận từng bước." Câu phủ định bác bỏ mà không có
    ý kiến nào để bác: trong tệp chưa ai nói khôi phục là việc khó, nên vế "không phải là việc khó" gán cho người đọc một
    cách nghĩ họ không có. Khác với câu "Lịch thật không phải 2h sáng giờ Việt Nam…", nơi câu trước đã nêu cách hiểu sai.
    Sửa: nói thẳng vế sau, ví dụ "Làm lần lượt từng bước, vì Bước 3 xoá database cũ.", hoặc bỏ câu nếu lời dặn đọc kỹ ở
    đầu mục Các bước đã nói ý này.

### Phương châm hội thoại

14. "PostgreSQL ra đời năm 1996 ở Đại học Berkeley nên rất ổn định, ít khi hỏng dữ liệu." Lạc đề với việc khôi phục
    (phương châm quan hệ); vế "nên" không theo được, vì năm và nơi ra đời không làm phần mềm ổn định; "ít khi hỏng dữ liệu"
    là khẳng định không có bằng chứng, lại đi ngược lý do tài liệu tồn tại (phương châm về chất). Sửa: bỏ câu.
15. "Dev mới hay làm ẩu, nên đọc kỹ từng bước rồi mới gõ lệnh." Phán xét cả nhóm người đọc của chính tài liệu (phương châm
    lịch sự; `machine-tells.md` bảng B, dòng Phán xét một nhóm người). Sửa: giữ lời dặn, bỏ phần phán xét, nói lý do thật:
    "Đọc hết các bước rồi mới gõ lệnh, vì Bước 3 xoá database."

### Dấu và ký hiệu

11. Gạch dài ở nhan đề: "Khôi phục database staging — hướng dẫn cho dev mới". Sửa: "Khôi phục database staging: hướng
    dẫn cho dev mới".
12. "KHÔNG" in hoa để nhấn. Sửa: viết thường, nhấn bằng cách đưa ý lên đầu, hoặc để thành bước riêng (gộp với điểm 3).
13. "Hãy kiểm tra kỹ tên máy…": "Hãy" ở đầu câu hướng dẫn. Sửa: nói thẳng việc, "Kiểm tra tên máy…".

### Nhẹ, có thì tốt, không bắt buộc

- "các bạn" trong mở bài: tài liệu hướng dẫn nên trung tính, ít xưng hô (bảng Giọng của `SKILL.md`). Chấp nhận cả khi bài
  để yên vì tệp nói rõ viết cho dev mới.
- "kiểm tra vài màn chính" ở Bước 4 chưa nói màn nào. Cách sửa đúng là hỏi tác giả hoặc để chỗ trống cho tác giả điền,
  không tự đặt tên màn.
- Mục Khi có lỗi chỉ nói "tạo role đó trước" mà không nói tạo bằng gì. Cách sửa đúng là đề nghị tác giả thêm lệnh, không
  khẳng định role cần quyền gì.

## Điều bài không được bịa

- Không chọn 7 hay 14 ngày làm số đúng.
- Không khẳng định bản dump là của production hay của staging.
- Không đặt tên màn cụ thể cho Bước 4, không viết lệnh `CREATE ROLE` kèm quyền như thể đó là cấu hình thật của hệ thống
  (đưa ví dụ lệnh và nói rõ là ví dụ, chưa kiểm tra, thì được).
- Không thêm dữ kiện về lịch backup, dung lượng, số người dùng, tên người duyệt.
- Không sửa câu PostgreSQL bằng một mốc lịch sử khác; chỉ cần chỉ ra câu lạc đề và bỏ đi.

## Bẫy đã cài

- Lời soát nói giảm quá tay: lỗi 7 và 14 ngày hay lời dặn đứng sau lệnh xoá mà chỉ viết "có lẽ nên cân nhắc xem lại" là
  làm mất tính chất lỗi. Lời soát dùng chữ chê nặng ("cẩu thả", "sai bét", "vô lý") với tài liệu của chính người dùng cũng
  là phạm phương châm lịch sự.
- Ký hiệu trong code: `~` và `&&` nằm trong hai khối code bash. Skill chỉ cấm chúng trong câu văn; script cũng bỏ qua code.
  Bắt chúng là bắt nhầm.
- "Lịch thật không phải 2h sáng giờ Việt Nam mà là 2h sáng giờ UTC…": script ghi chú khuôn "không phải … mà là", và câu
  trước đã nêu cách hiểu sai có thật ("Rất dễ nghĩ là cron chạy theo giờ Việt Nam"), đúng chỗ `machine-tells.md` cho giữ.
  Bài coi đây là lỗi cần sửa là bắt nhầm; bài nói script báo nhưng câu này giữ được là đúng.
- Hai câu "không phải … mà là" trong cùng tệp: bài bỏ cả hai, hay giữ cả hai, là chưa phân biệt được câu bác bỏ có ý kiến
  bị bác với câu không có.
- Phép đổi giờ "2h sáng giờ UTC, tức 9h sáng ở Việt Nam" đúng. Bài bảo sai là bắt nhầm. Lỗi ở chữ "Mỗi đêm", không ở phép đổi.
- Các bước đánh số Bước 1 tới Bước 4: được phép, vì là các bước làm theo thứ tự. Bắt lỗi đánh số là bắt nhầm.
- "Rất dễ nghĩ là…" là đúng mẫu skill khuyên dùng, không phải lỗi.
- Người dùng dặn không sửa tệp: tệp phải giữ đúng SHA-256 ở trên. Tạo tệp bản sửa riêng khi không ai yêu cầu cũng là làm
  sai loại việc.
- Người dùng dặn nội dung trước câu chữ sau: bài xếp lỗi gạch dài, chữ in hoa lên trên lỗi 7 và 14 ngày là sai thứ tự.
