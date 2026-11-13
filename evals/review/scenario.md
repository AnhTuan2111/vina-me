# Đề nhóm review: soát hướng dẫn khôi phục database mà không sửa

## Lời yêu cầu

Ở `prompt.md`. Tệp vào: `inputs/restore-guide.md` (376 chữ, Markdown, hai khối code bash). Dữ kiện giả: app ClinicBook,
máy `db-staging-01`, bucket `clinicbook-backup`, role `report_reader`, kênh #staging.

SHA-256 của tệp vào lúc ra đề, để người chấm kiểm bài làm có sửa tệp hay không:
`126b4cebb1734bfef85955bb787568e53b870fe4e5a8a4bc24447e1b7ac21536`

## Đề thử điều gì của skill

- Đúng loại việc "Soát mà không sửa" trong bảng Trả kết quả của `SKILL.md`: từng chỗ "câu gốc, vấn đề, cách sửa", từ
  nặng tới nhẹ, không viết lại cả bài, không đụng vào tệp. Người dùng còn dặn thêm thứ tự: nội dung sai và chỗ làm người
  đọc làm sai lên trước, lỗi câu chữ sau.
- Có đọc tuần tự từng câu như người đọc thật hay chỉ chép lại kết quả của `scripts/lint.mjs`. Script bắt được tám chỗ bề
  mặt; phần lớn chỗ nặng nằm ngoài tầm của nó.
- Có biết khi nào kết quả của script là báo nhầm (luật "không phải X mà là Y" được giữ khi sửa một cách hiểu có thật).
- Có giữ được luật "nói thật" khi soát: gặp hai con số chọi nhau thì hỏi tác giả, không tự chọn một số; không bịa cách sửa
  dựa trên dữ kiện tệp không có.
- Không bắt nhầm ký hiệu trong code (skill chỉ cấm `~`, `&` trong câu văn).

## Kết quả lint lúc ra đề

`node scripts/lint.mjs inputs/restore-guide.md` in ra tám dòng:

```
gạch dài hoặc gạch vừa: 1 chỗ
cụm ít gặp ngoài đời, đang dày: đóng vai trò, không chỉ
câu mở bằng "Hãy": 1 lần
câu mở bằng "Tóm lại": 1 lần
"không phải … mà là": 1 lần (chỉ giữ khi sửa một chỗ hiểu sai có thật)
chữ in hoa nhấn mạnh: KHÔNG
ký hiệu trong câu văn, viết thành chữ: dấu & (1)
kết bằng lời kêu gọi hoặc "Tóm lại": hết ý thì dừng, hoặc quay về câu mở
```

Script không bắt được: câu mở "Trong thời đại dữ liệu là…" (khuôn của nó đòi chữ "hiện nay", "hiện đại"), "chính là chìa
khoá", câu thiếu chủ ngữ mở bằng "Với", từ nối sai quan hệ, đại từ trỏ không rõ, một thứ ba tên, hai ý chọi nhau, và mọi
lỗi nội dung.

## Đáp án: chỗ bài phải chỉ ra

Xếp từ nặng tới nhẹ như người dùng dặn. Câu gốc trích nguyên văn từ tệp.

### Nội dung sai hoặc làm người đọc làm sai (phải đứng đầu bài)

1. Hai con số chọi nhau về thời gian giữ backup. "Bản backup được giữ 7 ngày rồi tự xoá." (mục Backup chạy thế nào) và
   "Bản backup trên bucket được giữ 14 ngày, nên có thể lấy bản cũ hơn nếu bản mới nhất bị hỏng." (mục Khi có lỗi). Cách
   sửa đúng: hỏi tác giả số nào đúng (xem cấu hình xoá tự động của bucket), sửa cả hai chỗ về một số. Không được tự chọn
   7 hay 14.
2. "Mỗi đêm" chọi với giờ chạy. Đoạn đó nói cron chạy 2h sáng giờ UTC, tức 9h sáng ở Việt Nam, nên với người đọc ở Việt Nam
   backup không chạy "mỗi đêm". Cách sửa: "Mỗi ngày" hoặc ghi thẳng giờ. Phép đổi 2h UTC ra 9h giờ Việt Nam là đúng (UTC+7).
3. Lời dặn kiểm tên máy đứng sai chỗ. "Lưu ý: KHÔNG chạy bước 3 trên production. Hãy kiểm tra kỹ tên máy trước khi gõ
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
  (đưa ví dụ lệnh và nói rõ là ví dụ, chưa kiểm, thì được).
- Không thêm dữ kiện về lịch backup, dung lượng, số người dùng, tên người duyệt.

## Bẫy đã cài

- Ký hiệu trong code: `~` và `&&` nằm trong hai khối code bash. Skill chỉ cấm chúng trong câu văn; script cũng bỏ qua code.
  Bắt chúng là bắt nhầm.
- "Lịch thật không phải 2h sáng giờ Việt Nam mà là 2h sáng giờ UTC…": script báo khuôn "không phải … mà là", nhưng câu
  trước đã nêu cách hiểu sai có thật ("Rất dễ nghĩ là cron chạy theo giờ Việt Nam"), đúng chỗ `machine-tells.md` cho giữ.
  Bài coi đây là lỗi cần sửa là bắt nhầm; bài nói script báo nhưng câu này giữ được là đúng.
- Phép đổi giờ "2h sáng giờ UTC, tức 9h sáng ở Việt Nam" đúng. Bài bảo sai là bắt nhầm. Lỗi ở chữ "Mỗi đêm", không ở phép đổi.
- Các bước đánh số Bước 1 tới Bước 4: được phép, vì là các bước làm theo thứ tự. Bắt lỗi đánh số là bắt nhầm.
- "Rất dễ nghĩ là…" là đúng mẫu skill khuyên dùng, không phải lỗi.
- Người dùng dặn không sửa tệp: tệp phải giữ đúng SHA-256 ở trên. Tạo tệp bản sửa riêng khi không ai yêu cầu cũng là làm
  sai loại việc.
- Người dùng dặn nội dung trước câu chữ sau: bài xếp lỗi gạch dài, chữ in hoa lên trên lỗi 7 và 14 ngày là sai thứ tự.
