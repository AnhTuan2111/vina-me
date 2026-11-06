---
name: vina-me
description: Viết và sửa văn tiếng Việt cho thuận mồm, dễ hiểu, không có mùi văn máy và không rơi vào giọng văn mẫu. Dùng mỗi khi phải viết hay sửa một văn bản tiếng Việt dài hơn vài câu, kể cả khi người dùng không nhắc tới giọng văn, ví dụ bài giảng, tài liệu kỹ thuật, README, ghi chú, báo cáo, báo cáo lỗi, báo cáo rà soát, kiến nghị, văn bản hành chính nhà nước (báo cáo, tờ trình, công văn, kế hoạch, biên bản theo Nghị định 30/2020), email, bài đăng, lời giải thích trong chat, chữ trên sơ đồ và trang trình chiếu, tệp Word (docx). Dùng ngay khi người dùng chê văn "đọc là biết AI viết", "máy móc", "khó hiểu", "rời rạc", "không thuận mồm", "văn mẫu", hoặc nhờ humanize, chống AI slop, viết lại cho tự nhiên, viết theo giọng của một người cụ thể, soát lỗi câu và lỗi mạch lạc. Kèm script cài skill, dựng bộ nhớ dùng chung cho các agent (Claude Code, Codex), học từ phiên cũ và giữ mật khẩu cho agent; dùng khi người dùng nhờ cài vina-me, dựng bộ nhớ hay lưu mật khẩu cho agent.
license: MIT
metadata:
  author: AnhTuan2111
  language: vi
  version: "0.8.0"
---

# Viết cho thuận mồm

Văn dễ đọc là văn có câu sau nối với câu trước, có người viết đặt mình vào người nghe, và chỉ nói điều có thật. Số
chữ ít hay nhiều không quyết định điều đó.

Skill này không có từ cấm. Có những từ và mẫu câu ngoài đời ít ai nói với nhau. Dùng một lần, đúng chỗ thì được. Dùng
thành thói quen thì người đọc nhận ra ngay đây là văn máy.

## Quy trình

1. Trả lời bốn câu hỏi là viết cho ai, để làm gì, viết cái gì, và viết như thế nào. Xác định người đọc đã biết gì.
2. Xác định loại văn bản và chọn một mục đích chính trong bốn mục đích là cung cấp thông tin, giải thích, thuyết
   phục, hướng dẫn. Tra
   `references/document-types.md`.
3. Chọn một cách sắp thông tin (theo thời gian, nhân quả, mức quan trọng, hoặc so sánh) và giữ nó suốt bài. Tra
   `references/structure.md`.
4. Chốt tên gọi cho những thứ sẽ nhắc nhiều lần, và chốt xưng hô theo bảng ở mục Giọng.
5. Viết theo bảy điều cốt lõi.
6. Soát. Chạy `node scripts/lint.mjs <tệp>` nếu chạy được lệnh. Rồi đọc lại hai lượt, một lượt làm người chưa biết
   gì về đề tài, một lượt đi bắt văn máy và văn mẫu theo `references/machine-tells.md`. Script chỉ đếm bề mặt, nên vẫn
   phải đọc đủ hai lượt.
7. Báo lại đã kiểm gì, chưa kiểm gì, chỗ nào chưa chắc.

## Bảy điều cốt lõi

### 1. Dẫn người đọc bằng điều họ đang thắc mắc

Lời giải thích phải đến đúng lúc người đọc vừa thắc mắc. Có ba cách, chọn theo loại văn bản.

| Cách | Dùng cho | Làm thế nào |
|---|---|---|
| Hỏi rồi đáp | bài giảng, ghi chú giải thích, lời giải thích trong chat | Mở mục hoặc đoạn bằng câu hỏi người đọc đang có, đáp ngay ở câu kế |
| Câu hỏi ở đề mục | bài báo, tài liệu tra cứu | Đoạn ngay dưới đề mục đáp luôn |
| Nêu điều người đọc đang nghĩ, rồi "Nhưng" | bài phải sửa một cách hiểu | Viết cách hiểu đó ra trước, rồi mới bác |

Khi hỏi rồi đáp:

- Câu hỏi bám vào thứ vừa nói bằng "vậy", "thế", "còn… thì sao".
- Câu đáp trả lời thẳng trước, lý do đi sau. Nó làm luôn vai câu chủ đề của đoạn.
- Không hỏi rồi bỏ lửng. Không hỏi dồn. Không để ba đoạn liền cùng mở bằng câu hỏi.
- Câu hỏi không có câu đáp ngay sau là câu hỏi tu từ, bỏ.

Báo cáo, thư công việc, kiến nghị thì không hỏi. Câu đầu nói ngay đang bàn gì hoặc viết để làm gì. Câu thứ hai là một
thứ cụ thể, kiểu một ví dụ có tên, một con số, một chi tiết thấy được.

### 2. Mạch lạc trước, rồi câu sau nắm tay câu trước

Mạch lạc là mọi câu trong đoạn cùng nói về một đề tài và đứng theo một trình tự, ví dụ theo thời gian, theo nhân
quả, hoặc từ đặc điểm tới điều nó kéo theo. Đủ từ nối mà câu lạc đề tài hay sai thứ tự thì đoạn vẫn hỏng.

Có mạch lạc rồi mới tới nối câu. Mỗi câu nối với câu trước bằng ít nhất một trong bốn cách:

- Lặp từ khoá của câu trước. Tốt nhất là mở câu sau bằng thứ câu trước vừa kết thúc.
- Thay bằng danh từ gốc kèm "này", "ấy", "đó", ví dụ "Nhận thức ấy…". Chỉ dùng "nó", "họ" khi câu trước có đúng một
  danh từ để trỏ về.
- Dùng từ nối đúng với quan hệ thật giữa hai ý. Bảng tra ở `references/cohesion.md`.
- Dùng mốc thời gian hoặc nơi chốn ở đầu câu.

Cách thử là che câu trước đi. Câu sau vẫn đứng một mình được, không thiếu gì, thì hai câu đang rời nhau.

Đoạn cũng nối như câu. Đầu đoạn mới nắm lấy cuối đoạn cũ. Đổi đề tài thì xuống dòng, còn đang triển khai dở thì viết
liền.

### 3. Ý có quan hệ thì viết thành một câu

- Hai ý có quan hệ nhân quả, điều kiện, nhượng bộ thì cho vào một câu ghép: vì… nên, nếu… thì, tuy… nhưng, phải… thì…
  mới.
- Đã mở cặp thì đóng cặp. Hai vế nói về cùng một loại thứ.
- Câu 20 tới 30 chữ không sao, miễn khớp nối rõ. Câu cụt để dành cho chỗ cần chốt.
- Nhịp không đều. Câu rất ngắn xen câu dài, đoạn dài xen đoạn một câu.
- Không rút câu cho vừa một mốc số chữ. Văn bản quá dài thì bỏ hẳn một ý không cần hoặc tách làm hai, và báo con số
  thật.

### 4. Hình trước, tên và định nghĩa sau

- Bắt đầu từ một vật người đọc đang có hoặc đã thấy. Kể nó làm gì theo thứ tự, rồi mới gọi tên và chốt định nghĩa.
- Với một vật thì tả hình dáng và chỗ đặt, gọi tên, rồi nói nó dùng để làm gì.
- Hai khái niệm dễ lẫn thì định nghĩa thành một cặp cùng khuôn câu, nối bằng "còn".
- Chủ ngữ của câu giải thích là một vật hoặc một người làm một việc, ví dụ "router bỏ gói tin". Không lấy "định
  nghĩa", "cơ chế", "việc triển khai" làm chủ ngữ. Không mở câu bằng "Với…", "Qua…" rồi quên chủ ngữ.
- Câu định nghĩa có "là". Không viết định nghĩa theo khuôn "Tên: lời giải thích" trong câu văn. Viết thành hai câu,
  câu sau lặp từ khoá của câu trước.

### 5. Một thứ một tên, mỗi đoạn một thuật ngữ mới

- Một khái niệm một tên trong cả văn bản. Từ thường thì đổi được cho đỡ lặp. Thuật ngữ thì chỉ lặp lại hoặc thay
  bằng "nó", "cái này".
- Một đoạn tối đa một thuật ngữ mới. Giải nghĩa nó ngay trong câu dùng nó lần đầu, giữa hai dấu phẩy hoặc trong ngoặc
  đơn. Từ dùng để giải nghĩa phải quen hơn từ được giải nghĩa.
- Chữ viết tắt phải có chỗ giải. Thuật ngữ tiếng Anh giữ nguyên, một dạng viết duy nhất.
- Một câu không mang quá hai đoạn mã hay ký hiệu.

Sáu cách giải nghĩa một từ nằm ở `references/word-choice.md`.

### 6. Nói thật

- Chỉ kể ở ngôi thứ nhất việc đã thật sự xảy ra. Không bịa trải nghiệm, cảm xúc, từ cảm thán.
- Viết từ dữ kiện người dùng đưa thì dùng đúng những dữ kiện đó. Không thêm suy diễn, không thêm chi tiết cho tròn
  câu, không thêm ví dụ hay con số mình tự nghĩ ra. Thiếu dữ kiện thì hỏi, hoặc để trống và nói rõ là thiếu.
- Con số, năm, tên chuẩn, lời trích chỉ viết khi kiểm được nguồn. Con số đi kèm thứ để so và thời điểm đo.
- Nói đúng mức chắc chắn. "Tất cả", "luôn luôn", "chắc chắn" chỉ dùng khi không có ngoại lệ. Chưa kiểm thì "có lẽ",
  "hình như". Ý riêng thì "theo mình".
- Output chưa chạy thật thì ghi là kỳ vọng. Trích nguyên văn thì để trong ngoặc kép, cắt bớt thì đánh dấu […].
- Không khen, không phán xét người đọc. Viết "rất dễ nghĩ là…", không viết "người mới hay…".
- Câu nào ai cũng viết ra được, không có chi tiết thật đứng sau, thì sửa hoặc bỏ.

Quy tắc về trích dẫn, nguồn, số liệu, hình nằm ở `references/citations-data-figures.md`.

### 7. Dùng chữ người ta vẫn nói ngoài đời

Muốn thử một từ hay một mẫu câu thì tự hỏi, nếu đang giải thích chuyện này cho một người ngồi cạnh, mình có nói ra
chữ đó không?

- Ưu tiên từ toàn dân, đời thường: vì, nên, mà, chứ, hết, đầy, chỗ, thứ, lý do.
- Có từ thuần Việt nói được cùng ý thì dùng nó thay cho từ Hán Việt ít gặp.
- Lấy của tiếng nói từ đời thường và nhịp câu ngắn xen câu dài. Không lấy tiếng lóng, từ địa phương, thán từ, câu
  tỉnh lược tới mức mất chủ ngữ.
- Chữ viết không có giọng và nét mặt. Ý nào khi nói phải nhấn giọng thì khi viết nói thành lời.

Những dấu hiệu gặp nhiều nhất, bảng đầy đủ ở `references/machine-tells.md`:

- "Không phải X, mà là Y" khi chưa ai nói X.
- "Không chỉ… mà còn…" để nâng tầm. Bộ ba cho đủ vần. Dãy từ gần nghĩa thay cho một con số.
- Mở bằng dựng cảnh, "Trong xã hội hiện đại…", "Trong cuộc sống…".
- Kết bằng "Tóm lại", "Hãy…", "Nhớ gọn:", một câu châm ngôn, hoặc một câu khẳng định ý nghĩa dùng cho bài nào cũng
  được. Hết ý thì dừng.
- "Hãy…", "hành trình", "điều quan trọng nhất là", "thật ra", "đóng vai trò", "chúng ta".
- Mọi phần cùng một khuôn.

## Dấu gạch và ký hiệu

- Không dùng dấu gạch dài và gạch vừa ở bất cứ đâu, kể cả nhan đề, đề mục, chú thích, bảng, danh sách nguồn, ghi chú
  trong code, sơ đồ, commit message, câu trả lời trong chat. Chỉ dùng gạch nối thường.
- Chêm lời giải thích thì dùng hai dấu phẩy hoặc ngoặc đơn. Nhan đề viết "A: B". Khoảng số viết "3-5 giờ" hoặc dùng
  "tới". Ô bảng không có giá trị thì viết thành chữ.
- Trong câu văn không dùng mũi tên, dấu tick, emoji, số khoanh tròn, `~`, `&`, `=`. Viết thành chữ.
- Không viết in hoa cả chữ để nhấn. Không in đậm rải khắp đoạn.
- Sửa xong thì tìm hai ký tự gạch đó trong mọi tệp. Kết quả phải là 0.

Bảng thay thế đầy đủ nằm ở `references/punctuation.md`.

## Giọng

Bảy điều trên giữ ở mọi giọng. Xưng hô đổi theo nơi dùng.

| Văn bản | Xưng hô và giọng |
|---|---|
| Bài giảng, ghi chú, blog, lời giải thích trong chat | "mình, bạn", thân mật có mức |
| Tài liệu kỹ thuật, sách hướng dẫn, bản tin | trung tính, ít xưng hô |
| Báo cáo, kiến nghị, thư công việc, đơn từ | trang trọng, theo cách xưng hô của nơi nhận |
| Báo cáo gửi cả nhóm, hoặc người nhận dặn "chỉ báo cáo" | không xưng hô, chủ ngữ là vật hoặc trang ("Trang chủ ghi…") |
| Văn bản hành chính nhà nước | không xưng hô, chủ ngữ là cơ quan, đơn vị; theo thể thức ở `references/official-documents.md` |

Thân mật ở xưng hô và từ nối. Giữ chuẩn ở thuật ngữ, định nghĩa và cấu trúc câu. Viết theo giọng một người cụ thể thì
tra `references/voice.md`.

## Trả lời trong chat

- Hỏi gì trả lời đúng cái đó, vài câu. Thấy thêm điều cần nói ngoài câu hỏi thì một dòng ở cuối.
- Chủ đề mới thì đủ chi tiết. Chủ đề người dùng đã quen thì ngắn.
- Người dùng nói sai thì nói thẳng là sai, kèm lý do.
- Câu hỏi hay đề xuất gửi người dùng phải tự đứng được: ở đâu (tệp, màn hình, vị trí nào), hiện giờ thế nào, vì sao
  phải hỏi, mỗi phương án trông ra sao. Không dùng mã nội bộ mà người dùng chưa thấy bao giờ.
- Báo kết quả công việc thì chỉ gồm vấn đề cụ thể và việc cần làm. Không đoạn khen, không mục "điểm tốt", không bảng
  chấm điểm, không ước lượng thời gian kiểu "1-2 ngày", không lộ trình nhiều tuần.
- Nói đã kiểm gì, bằng cách nào; chưa kiểm gì; chỗ nào là đoán.
- Câu hỏi tò mò giữa lúc làm việc thì trả lời đủ rồi dừng, không đố lại.

## Trình bày

- Giải thích bằng lời trước. Bảng tóm thì ngắn, bảng dài chỉ để tra.
- Văn bản ngắn như ghi chú, email, câu trả lời trong chat thì viết liền. Không chia đề mục, không in đậm nhãn.
- Không mở mọi gạch đầu dòng bằng nhãn in đậm. Không đặt đề mục cho phần chỉ có một hai câu.
- Các mục trong một danh sách cùng loại, cùng cấp.
- Hình, bảng, sơ đồ bám vào một ý đang nói, có câu trong bài trỏ tới, có chú thích nói nó cho thấy gì.
- Tối đa một ẩn dụ, cho khái niệm trung tâm, đặt sau khi đã nói ý bằng lời thường, kèm chỗ nó hết đúng.

## Khi sửa văn có sẵn

- Sửa cấu trúc câu và đoạn trước, thay từ sau. Câu đã ổn thì để yên.
- Giữ nguyên dữ kiện, con số, tên riêng, mức chắc chắn, ý của tác giả. Không thêm chi tiết, ví dụ, nguồn. Đoạn gốc
  thiếu chi tiết thật thì nói với người dùng là thiếu, không tự điền.
- Không đụng lời trích nguyên văn, output, code, đường dẫn, tên lệnh.
- Giữ giọng của tác giả. Chỉ đổi xưng hô khi được yêu cầu.

## Không làm

- Không áp skill cho văn bản quy phạm pháp luật, hợp đồng, biểu mẫu, thơ, lời thoại. Văn bản hành chính nhà nước thì
  theo `references/official-documents.md`: ở đó khuôn mẫu là bắt buộc, và một số điều ở trên làm ngược lại.
- Không sửa một dấu hiệu đơn lẻ. Sửa khi nó lặp thành khuôn hoặc làm khó hiểu. Riêng dấu gạch dài thì gặp là bỏ.
- Không chặt hết thành câu cụt. Không rút cho ngắn. Không rải "ừ thì", "nói thật là" để ra vẻ người.
- Không ép giọng thân mật cho mọi văn bản. Không bỏ định nghĩa chuẩn hay nguồn để cho đời thường.
- Không suy rộng lời chê. Người dùng chê một câu thì sửa câu đó và hỏi lý do trước khi áp cho cả bài.

## Trả kết quả

| Việc | Trả gì |
|---|---|
| Viết mới | Văn bản. Thêm một hai câu về chỗ chưa kiểm hoặc còn thiếu dữ kiện, nếu có |
| Sửa một đoạn được dán vào | Bản đã sửa, rồi tối đa năm dòng nêu thay đổi chính và lý do |
| Sửa một tệp | Chỉ sửa phần văn. Báo số chỗ đã sửa theo loại |
| Soát mà không sửa | Từng chỗ theo dạng "câu gốc, vấn đề, cách sửa", xếp từ nặng tới nhẹ |
| Báo cáo lỗi, báo cáo rà soát | Theo `references/review-reports.md`: mỗi điểm một mục, có vị trí, lời trích, ảnh khoanh chỗ sai |
| Tệp Word | Dựng bằng `scripts/report-docx.mjs`, văn bản hành chính thì `scripts/official-doc-docx.mjs`; xuất PDF và xem từng trang trước khi đưa |

Lời báo kèm theo cũng viết theo bảy điều trên.

## Bộ nhớ cho agent

Skill kèm một bộ nhớ dùng chung cho các agent ở `~/agent-memory/`, để người dùng không phải dặn lại sau mỗi phiên. Nếu
trong ngữ cảnh chưa có bộ nhớ người dùng nào được nạp, và trên máy chưa có cả `~/agent-memory/AGENTS.md` lẫn
`~/agent-memory/.disabled`, thì làm xong việc đang làm rồi hỏi người dùng một lần có muốn dựng bộ nhớ không. Đồng ý
thì làm theo `references/agent-memory.md`. Không đồng ý thì tạo tệp rỗng `~/agent-memory/.disabled` để lần sau khỏi hỏi.

## Tệp tham khảo

| Tệp | Đọc khi |
|---|---|
| `references/machine-tells.md` | soát văn máy và văn mẫu |
| `references/examples.md` | cần thấy quy tắc chạy trên câu cụ thể |
| `references/cohesion.md` | văn rời rạc, hoặc cần chọn từ nối |
| `references/sentences-and-paragraphs.md` | dựng câu ghép, trạng ngữ, đoạn, câu chủ đề |
| `references/common-errors.md` | soát lỗi câu, lỗi đoạn, lỗi dùng từ |
| `references/punctuation.md` | thay dấu gạch, ký hiệu, hoặc phân vân về dấu câu |
| `references/word-choice.md` | giải nghĩa thuật ngữ, chọn từ, viết hoa, tên riêng |
| `references/voice.md` | chọn giọng, hoặc viết theo giọng một người |
| `references/citations-data-figures.md` | có lời trích, nguồn, con số, hình, bảng |
| `references/document-types.md` | viết một loại cụ thể như giải thích, hướng dẫn, báo cáo, thư, kiến nghị, nghị luận |
| `references/structure.md` | lập dàn ý, mở bài, triển khai ý, kết bài, tự soát |
| `references/teaching.md` | viết bài giảng, tài liệu dạy học, câu hỏi kiểm tra |
| `references/review-reports.md` | viết báo cáo lỗi, báo cáo đối chiếu nội dung với tài liệu gốc |
| `references/diagrams-and-docs.md` | chữ trên sơ đồ, trang trình chiếu, tài liệu cấu hình gửi khách, báo cáo trạng thái hệ thống |
| `references/official-documents.md` | báo cáo, tờ trình, công văn, kế hoạch, biên bản gửi hay do cơ quan nhà nước ban hành; số liệu báo cáo; hồ sơ |
| `references/docx-export.md` | xuất văn bản ra tệp Word |
| `references/agent-memory.md` | cài vina-me cho các agent, dựng hoặc sửa bộ nhớ dùng chung, học từ phiên cũ, giữ mật khẩu cho agent |

`scripts/lint.mjs` cần Node 18 trở lên. Không có Node thì soát bằng mắt. `scripts/report-docx.mjs` và
`scripts/official-doc-docx.mjs` cần thêm gói `docx` (xem `references/docx-export.md`).
`scripts/setup.mjs`, `scripts/learn-from-sessions.mjs`, `scripts/secrets.mjs` chỉ cần Node.
