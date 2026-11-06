# Dấu câu và ký hiệu

## Dấu gạch

Có ba ký tự trông gần giống nhau. Chỉ dùng ký tự thứ nhất.

| Ký tự | Tên | Dùng |
|---|---|---|
| `-` | gạch nối | có |
| U+2013 | gạch vừa | không, ở bất cứ đâu |
| U+2014 | gạch dài | không, ở bất cứ đâu |

"Bất cứ đâu" gồm cả những chỗ dễ sót như nhan đề trang và thẻ `<title>`, đề mục, chú thích hình, ô trống trong bảng,
danh sách nguồn, mục ghi công ảnh, ghi chú trong code, sơ đồ vẽ bằng ký tự, phần mô tả của tệp, commit message và
câu trả lời trong chat.

Dấu gạch đang làm việc gì thì thay bằng thứ làm được đúng việc đó:

| Dấu gạch đang làm việc gì | Thay bằng | Ví dụ |
|---|---|---|
| Chêm lời giải thích giữa câu | hai dấu phẩy, hoặc ngoặc đơn | "kernel, phần lõi của hệ điều hành, giữ bảng này" |
| Mở lời giải thích ở cuối câu | "vì", "tức là", dấu hai chấm, hoặc tách câu | "App không lên, vì thiếu một biến môi trường." |
| Nối hai vế đối nhau | dấu phẩy kèm "còn", "nhưng" | "Switch đọc địa chỉ MAC, còn router đọc địa chỉ IP." |
| Nhan đề "A, gạch, B" | "A: B" | "Bài 04: Phòng lab Linux" |
| Nhan đề đã có dấu hai chấm ở phần sau | viết lại bằng "với", "và" | "Bài 01: IP, port, firewall và vì sao gọi không tới" |
| Dòng nguồn "tên, gạch, tác giả" | dấu phẩy | "Dependency, Randall Munroe, xkcd.com" |
| Tên tài liệu "RFC 3986, gạch, tên" | dấu phẩy | "RFC 3986, Uniform Resource Identifier" |
| Khoảng số, khoảng ngày | gạch nối, hoặc "tới" | "3-5 giờ", "2006-2009", "25/09 tới 03/10" |
| Ô bảng không có giá trị | viết thành chữ | "không có", "chưa học" |
| Ghi chú trong code | dấu hai chấm hoặc dấu phẩy | `# Cửa sổ 1: chỉ listen trên loopback` |
| Nhãn trong sơ đồ ký tự | dấu hai chấm, giữ nguyên bề rộng cột | `lo: giao diện loopback` |
| Cặp từ ghép "thầy, gạch, trò" | viết liền hoặc dùng "và" | "thầy trò", "mình và bạn" |

Lời trích nguyên văn có dấu gạch dài thì ghi thành gạch nối, không đổi chữ nào khác.

Gạch nối thì dùng cho gạch đầu dòng, lời thoại, liên danh ("Hà Nội - Hải Phòng"), khoảng số, tên phiên âm nhiều
tiếng ("Pa-ri") và tuỳ chọn của lệnh (`-v`).

Sửa xong thì tìm hai ký tự U+2013 và U+2014 trong mọi tệp. Kết quả phải là 0.

## Ký hiệu trong câu văn

Trong câu văn, viết thành chữ. Ký hiệu chỉ giữ trong code, output dán nguyên văn và sơ đồ.

| Ký hiệu | Viết thành |
|---|---|
| mũi tên | "dẫn tới", "sang", "thành", "rồi" |
| dấu tick, dấu chéo | "có", "không", "đúng", "sai" |
| emoji, số khoanh tròn, hình khối gõ từ bàn phím | bỏ, hoặc viết thành chữ |
| `~` trước con số | "khoảng" |
| `&` | "và" |
| `/` giữa hai lựa chọn | "hoặc" |
| `=` giữa hai vế | "là", "tức là" |
| `+` giữa hai thứ | "và", "cộng" |
| `vs` | "so với" |
| `v.v.`, dấu chấm lửng cuối dãy liệt kê | kể đủ, hoặc "và vài thứ khác" khi thật sự còn |

Dấu chấm lửng chỉ dùng để báo đã cắt bớt trong lời trích hoặc output, ghi `[…]` hoặc `…`.

## Dấu phẩy

- Ngăn trạng ngữ đầu câu với phần còn lại.
- Nối hai vế câu ghép khi không dùng từ nối.
- Bọc lời giải nghĩa chêm giữa câu, hai dấu ở hai đầu.
- Gỡ câu hai nghĩa, đặt ở ranh giới giữa hai thành phần.

## Dấu hai chấm

Dấu hai chấm có bốn việc. Nó đứng trước lời trích, trước một danh sách, trước vế giải thích cho vế đứng trước, và
trước lời giải nghĩa ở cuối câu.

Hai việc sau thì không để câu nào cũng có. Nhiều câu liền cùng có dấu hai chấm thì đổi bớt sang "vì", "tức là", hoặc
tách câu. Không viết định nghĩa theo khuôn "Tên: lời giải thích" trong câu văn.

## Dấu chấm phẩy

- Ngăn các vế lớn của một câu ghép nhiều tầng.
- Ngăn các mục của một dãy liệt kê khi trong mỗi mục đã có dấu phẩy.

## Ngoặc đơn

Bỏ phần trong ngoặc thì câu vẫn đúng ngữ pháp. Dùng cho tên gọi khác, dạng đầy đủ của chữ viết tắt, danh sách ví dụ,
nghĩa của một từ lạ.

## Ngoặc kép

Dùng cho lời trích nguyên văn, tên tác phẩm, và từ dùng với nghĩa đặc biệt. Từ dùng đúng nghĩa thường thì không để
trong ngoặc kép.

## Dấu chấm than, chấm hỏi

- Chấm hỏi chỉ cho câu hỏi thật, có lời đáp ngay sau.
- Chấm than không dùng trong văn giải thích, báo cáo, tài liệu.

## Nhấn mạnh

Không viết in hoa cả chữ để nhấn. Không in đậm rải khắp đoạn. Nhấn bằng "chính", "chỉ", "ngay cả", bằng cách đưa ý lên
đầu câu, hoặc bằng một câu ngắn riêng.
