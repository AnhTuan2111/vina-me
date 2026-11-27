# Dấu câu và ký hiệu

Dấu câu trong văn tiếng Việt làm việc của giọng nói: ngắt hơi, báo sắp giải thích, báo đang hỏi. Tệp này nói dấu nào làm
việc nào, bắt đầu từ dấu gạch, chỗ văn AI slop lộ ra nhiều nhất, rồi tới ký hiệu trong câu văn, dấu trong con số, và từng
dấu câu còn lại.

## Dấu gạch

Có ba ký tự trông gần giống nhau, và skill chỉ dùng ký tự thứ nhất:

| Ký tự | Tên | Dùng |
|---|---|---|
| `-` | gạch nối | có |
| U+2013 | gạch vừa | không, ở bất cứ đâu |
| U+2014 | gạch dài | không, ở bất cứ đâu |

"Bất cứ đâu" gồm cả những chỗ dễ sót: nhan đề trang và thẻ `<title>`, đề mục, chú thích hình, ô trống trong bảng, danh sách
nguồn, mục ghi công ảnh, ghi chú trong code, sơ đồ vẽ bằng ký tự, phần mô tả của tệp, commit message và câu trả lời trong
chat.

Bỏ dấu gạch không có nghĩa là bỏ việc nó đang làm. Dấu gạch đang làm việc gì thì thay bằng thứ làm được việc đó:

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

Lời trích nguyên văn có dấu gạch dài thì ghi thành gạch nối, không đổi chữ nào khác. Đây là ngoại lệ duy nhất của luật
không đụng lời trích ở `core-rules.md` (mục Khi sửa văn có sẵn) và `citations-data-figures.md` (mục Dẫn lời): chỉ ký tự
gạch đổi, chữ và các dấu khác giữ nguyên. Soát văn mà chính dấu gạch dài là lỗi đang báo thì tả nó bằng lời (dấu gạch dài
giữa "A" và "B"), không trích cả câu có ký tự đó.

Gạch nối thì vẫn dùng như thường: gạch đầu dòng, lời thoại, liên danh ("Hà Nội - Hải Phòng"), khoảng số, tên phiên âm
nhiều tiếng ("Pa-ri") và tuỳ chọn của lệnh (`-v`).

Sửa xong thì tìm hai ký tự U+2013 và U+2014 trong mọi tệp. Kết quả phải là 0.

## Ký hiệu trong câu văn

Ký hiệu chỉ giữ trong code, output dán nguyên văn và sơ đồ. Trong câu văn thì viết thành chữ, vì người đọc đọc câu văn
thành tiếng trong đầu, và mũi tên không có tiếng nào để đọc:

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
| `v.v.`, dấu chấm lửng cuối dãy liệt kê | kể đủ, hoặc "và vài thứ khác" khi còn thứ chưa kể |

Sách Ngữ văn 7 dạy ba việc của dấu chấm lửng: báo còn nhiều thứ chưa kể ra, ghi lời nói ngập ngừng, và làm giãn nhịp câu
trước một ý bất ngờ. Văn công việc không dùng việc nào trong ba việc đó. Kể chưa hết thì nói rõ còn gì ("và hai máy khác ở
cụm staging") hoặc kể đủ, đừng để người đọc tự đoán phần sau dấu chấm lửng. Ngập ngừng và giãn nhịp thuộc về lời thoại,
bài kể, không thuộc về tài liệu, báo cáo. Dấu chấm lửng trong văn công việc chỉ còn một việc: báo đã cắt bớt trong lời
trích hay output, ghi `[…]` hoặc `…`.

Dấu so sánh trong câu văn cũng viết thành chữ, và khi viết thì không được đổi nghĩa: `>` là "trên", "quá", "lớn hơn"; `>=`
là "từ… trở lên"; `<` là "dưới". "> 5 lỗi" thành "trên 5 lỗi", không thành "từ 5 lỗi".

## Dấu trong con số

Viết mới thì dấu chấm ngăn hàng nghìn, dấu phẩy ngăn phần thập phân: "2.500 lượt/ngày", "3,5 giây". Số phiên bản ("2.4.1"),
số trong code và output giữ nguyên.

Giờ viết một kiểu trong cả văn bản. Đã dùng "22h00" thì mọi chỗ là "22h00", kể cả khi dữ kiện gốc viết lẫn; riêng lời
trích và output giữ như gốc.

Sửa văn có sẵn thì giữ dấu trong con số như gốc, nhất là khi người dùng dặn giữ số liệu. Chỉ khi một con số đọc được hai
giá trị, vì gốc dùng dấu chấm cho cả hàng nghìn lẫn thập phân, thì hỏi người dùng chứ không tự đoán.

## Dấu phẩy

Sách Tiếng Việt 5 và Ngữ văn 6 dạy bốn việc của dấu phẩy:

- Ngăn thành phần phụ với nòng cốt câu, hay gặp nhất là trạng ngữ đứng đầu câu: "Từ tối nay, job backup chạy lúc 2h."
- Ngăn các từ ngữ cùng chức vụ trong một dãy liệt kê: "web-1, web-2 và db-1 đã lên bản mới."
- Ngăn một từ ngữ với phần chú thích của nó. Phần chú thích đứng giữa câu thì bọc bằng hai dấu ở hai đầu: "Máy db-1, máy chứa
  database chính, tắt sau cùng."
- Ngăn các vế câu ghép khi không dùng từ nối: "Web chạy lại rồi, hàng đợi vẫn còn 300 việc."

Dấu phẩy còn gỡ được câu hai nghĩa: đặt dấu phẩy ở ranh giới giữa hai thành phần thì người đọc biết từ nào đi với từ nào.
"Lúc chạy migration bảng orders bị khoá." đọc được như "migration bảng orders", còn "Lúc chạy migration, bảng orders bị
khoá." thì chỉ hiểu được một cách.

Ba lỗi dấu phẩy hay gặp đi ngược ba việc trên. Lỗi thứ nhất là thiếu dấu phẩy sau trạng ngữ dài, như câu migration vừa kể.
Lỗi thứ hai là đặt dấu phẩy giữa chủ ngữ và vị ngữ: "Bản 2.6 deploy tối qua, đã sửa lỗi đăng nhập." tách chủ ngữ "Bản 2.6
deploy tối qua" khỏi vị ngữ của nó, nên bỏ dấu phẩy đi. Lỗi thứ ba là nối hai câu trọn vẹn không liên quan bằng dấu phẩy;
hai vế ấy không phải câu ghép, nên tách bằng dấu chấm.

## Dấu hai chấm

Dấu hai chấm có bốn việc: đứng trước lời trích, trước một danh sách, trước vế giải thích cho vế đứng trước, và trước lời
giải nghĩa ở cuối câu.

Hai việc sau dễ thành thói quen. Từ khoảng ba chỗ trong văn bản dưới 800 tiếng là thành khuôn (`machine-tells.md`, bảng A),
và khi đó đổi bớt sang "vì", "tức là", hoặc tách câu. "Pod restart: probe hết giờ. Ổ đầy: log không xoay vòng." đọc như
ghi chú; viết thành câu thì quan hệ hiện ra: "Pod restart vì probe hết giờ, còn ổ đầy vì log không xoay vòng." Câu văn
cũng không viết định nghĩa theo khuôn "Tên: lời giải thích".

## Dấu chấm phẩy

Dấu chấm phẩy có hai việc theo sách Ngữ văn 7. Nó ngăn các vế lớn của một câu ghép có cấu tạo phức tạp, khi trong mỗi vế
đã có dấu phẩy. Nó cũng ngăn các mục của một dãy liệt kê khi trong mỗi mục đã có dấu phẩy. Câu ghép hai vế ngắn thì dấu
phẩy là đủ, không cần chấm phẩy.

## Ngoặc đơn

Bỏ phần trong ngoặc đơn đi thì câu vẫn đúng ngữ pháp. Ngoặc đơn dùng cho tên gọi khác, dạng đầy đủ của chữ viết tắt, danh
sách ví dụ, và nghĩa của một từ lạ.

## Ngoặc kép

Ngoặc kép dùng cho lời trích nguyên văn, tên tác phẩm, và từ dùng với nghĩa đặc biệt. Từ dùng với nghĩa thường thì không
để trong ngoặc kép, vì người đọc sẽ đi tìm cái nghĩa đặc biệt không có.

## Dấu chấm than, chấm hỏi

Chấm hỏi chỉ dùng cho câu hỏi thật, có lời đáp ngay sau. Chấm than không dùng trong văn giải thích, báo cáo, tài liệu.

## Nhấn mạnh

Văn viết không nhấn bằng chữ in hoa cả từ, cũng không rải in đậm khắp đoạn. Nó nhấn bằng trợ từ "chỉ", "ngay cả"
(`function-words.md`, mục Trợ từ), bằng cách đưa ý lên đầu câu, hoặc bằng một câu ngắn đứng riêng.
