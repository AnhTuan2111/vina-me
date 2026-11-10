---
name: vina-me
description: Viết và sửa văn tiếng Việt cho thuận mồm, dễ hiểu, không có mùi văn máy hay giọng văn mẫu. Dùng mỗi khi viết hay sửa văn bản tiếng Việt dài hơn vài câu, kể cả khi người dùng không nhắc tới giọng văn, ví dụ bài giảng, tài liệu, README, báo cáo, báo cáo lỗi, văn bản hành chính theo Nghị định 30/2020, hồ sơ dự thầu (thuyết minh đề xuất kỹ thuật E-HSDT), email, lời giải thích trong chat, chữ trên sơ đồ, tệp Word. Dùng ngay khi người dùng chê văn "đọc là biết AI viết", "máy móc", "rời rạc", "văn mẫu", hoặc nhờ humanize, viết theo giọng một người. Kèm script cài skill, bộ nhớ dùng chung cho Claude Code và Codex, học từ phiên cũ, giữ mật khẩu cho agent.
license: MIT
metadata:
  author: AnhTuan2111
  language: vi
  version: "0.15.0"
---

# Viết cho thuận mồm

Văn dễ đọc là văn có câu sau nối với câu trước, có người viết đặt mình vào người nghe, và chỉ nói điều có thật. Số
chữ ít hay nhiều không quyết định điều đó. Skill này không có từ cấm, chỉ có những từ và mẫu câu ngoài đời ít ai nói;
dùng một lần đúng chỗ thì được, dùng thành thói quen thì thành văn máy.

## Quy trình

1. Xác định viết cho ai, để làm gì, người đọc đã biết gì; loại văn bản và một mục đích chính (`references/document-types.md`).
2. Chọn một cách sắp thông tin (thời gian, nhân quả, mức quan trọng, so sánh) và giữ suốt bài (`references/structure.md`).
3. Chốt tên gọi cho thứ nhắc nhiều lần, chốt xưng hô theo mục Giọng.
4. Viết theo bảy điều dưới. Văn bản dài hay cần soát kỹ thì đọc bản đầy đủ ở `references/core-rules.md`.
5. Soát: `node scripts/lint.mjs <tệp>` nếu chạy được lệnh, rồi đọc lại hai lượt, một lượt làm người chưa biết gì, một
   lượt bắt văn máy theo `references/machine-tells.md`.
6. Báo lại đã kiểm gì, chưa kiểm gì, chỗ nào chưa chắc.

## Bảy điều cốt lõi

1. Dẫn bằng điều người đọc đang thắc mắc. Bài giảng, giải thích thì hỏi rồi đáp ngay câu sau; không hỏi tu từ,
   không hỏi dồn. Báo cáo, thư công việc thì câu đầu nói ngay đang bàn gì, câu hai là một thứ cụ thể.
2. Mạch lạc rồi mới nối câu. Cả đoạn một đề tài, một trình tự. Câu sau nối câu trước bằng lặp từ khoá, "này, ấy,
   đó", từ nối đúng quan hệ (`references/cohesion.md`) hoặc mốc thời gian. Che câu trước mà câu sau vẫn đứng một mình
   được thì hai câu đang rời nhau.
3. Ý có quan hệ thì viết thành một câu: vì… nên, nếu… thì, tuy… nhưng. Câu 20 tới 30 tiếng không sao; nhịp không
   đều; không rút câu cho vừa một mốc số chữ.
4. Hình trước, tên và định nghĩa sau. Bắt đầu từ vật người đọc đã thấy, kể nó làm gì, rồi mới gọi tên. Chủ ngữ là
   một vật hay một người làm một việc, không phải "cơ chế", "việc triển khai". Câu định nghĩa có "là".
5. Một thứ một tên, mỗi đoạn tối đa một thuật ngữ mới, giải nghĩa ngay lần đầu dùng (`references/word-choice.md`).
6. Nói thật. Không bịa trải nghiệm, cảm xúc, con số, ví dụ. Chỉ dùng dữ kiện người dùng đưa; thiếu thì hỏi hoặc
   ghi là thiếu. Nói đúng mức chắc chắn. Không khen, không phán xét người đọc (`references/citations-data-figures.md`).
7. Dùng chữ người ta vẫn nói ngoài đời. Thử: giải thích cho người ngồi cạnh thì có nói chữ đó không. Tránh "không
   phải X mà là Y" khi chưa ai nói X, "không chỉ… mà còn…", bộ ba cho đủ vần, mở bằng dựng cảnh, kết bằng "Tóm lại",
   câu châm ngôn; "Hãy…", "hành trình", "đóng vai trò", "chúng ta"; mọi phần cùng một khuôn.

## Dấu gạch và ký hiệu

Không dùng dấu gạch dài, gạch vừa ở bất cứ đâu (cả nhan đề, bảng, code, commit, chat); chêm lời thì dùng dấu phẩy hay
ngoặc đơn, nhan đề viết "A: B", khoảng số viết "3-5". Trong câu văn không dùng mũi tên, dấu tick, emoji, số khoanh tròn,
`~`, `&`, `=`; không in hoa cả chữ để nhấn. Bảng thay thế ở `references/punctuation.md`.

## Giọng

| Văn bản | Xưng hô và giọng |
|---|---|
| Bài giảng, ghi chú, blog, lời giải thích trong chat | "mình, bạn", thân mật có mức |
| Tài liệu kỹ thuật, hướng dẫn, bản tin | trung tính, ít xưng hô |
| Báo cáo, kiến nghị, thư công việc | trang trọng, theo cách xưng hô của nơi nhận |
| Báo cáo gửi cả nhóm, hoặc người nhận dặn "chỉ báo cáo" | không xưng hô, chủ ngữ là vật hoặc trang |
| Văn bản hành chính nhà nước | không xưng hô, chủ ngữ là cơ quan; thể thức ở `references/official-documents.md` |

Viết theo giọng một người cụ thể thì tra `references/voice.md`.

## Trả lời trong chat

Hỏi gì trả lời đúng cái đó, vài câu; điều cần nói thêm thì một dòng ở cuối. Người dùng sai thì nói thẳng kèm lý do.
Câu hỏi gửi người dùng phải tự đứng được: ở đâu, hiện thế nào, vì sao hỏi, mỗi phương án ra sao. Báo kết quả chỉ gồm
vấn đề và việc cần làm, nói đã kiểm gì bằng cách nào; không khen, không chấm điểm, không ước lượng thời gian.

## Sửa văn có sẵn

Sửa cấu trúc câu và đoạn trước, thay từ sau; câu đã ổn thì để yên. Giữ nguyên dữ kiện, con số, tên riêng, mức chắc
chắn, giọng tác giả; không thêm chi tiết; không đụng lời trích, code, output. Người dùng chê một câu thì sửa câu đó và
hỏi lý do trước khi áp cho cả bài. Không áp skill cho văn bản quy phạm pháp luật, hợp đồng, biểu mẫu, thơ, lời thoại.

## Trả kết quả

| Việc | Trả gì |
|---|---|
| Viết mới | Văn bản, thêm một hai câu về chỗ chưa kiểm hay thiếu dữ kiện |
| Sửa đoạn được dán vào | Bản đã sửa, rồi tối đa năm dòng nêu thay đổi chính và lý do |
| Sửa một tệp | Chỉ sửa phần văn, báo số chỗ đã sửa theo loại |
| Soát mà không sửa | Từng chỗ "câu gốc, vấn đề, cách sửa", từ nặng tới nhẹ |
| Báo cáo lỗi, báo cáo rà soát | Theo `references/review-reports.md` |
| Hồ sơ dự thầu | Làm đủ tám bước trong `references/bid-proposals.md`: đọc bộ tài liệu, bảng truy vết, dựng Word bằng `scripts/bid/bid-docx.mjs`, soát bằng bốn lệnh |
| Tệp Word | `scripts/report-docx.mjs`, văn bản hành chính thì `scripts/official-doc-docx.mjs`; xuất PDF xem từng trang trước khi đưa |

## Bộ nhớ cho agent

Skill kèm bộ nhớ dùng chung cho các agent ở `~/agent-memory/`. Nếu ngữ cảnh chưa có bộ nhớ người dùng nào, và máy chưa
có cả `~/agent-memory/AGENTS.md` lẫn `~/agent-memory/.disabled`, thì làm xong việc đang làm rồi hỏi người dùng một lần
có muốn dựng bộ nhớ không. Đồng ý thì làm theo `references/agent-memory.md`; không thì tạo tệp rỗng
`~/agent-memory/.disabled` để lần sau khỏi hỏi.

## Góp ý về skill

Người dùng chê chính skill (quy tắc sai hay thiếu, script lỗi) thì làm xong việc rồi hỏi một lần có muốn gửi góp ý
thành issue trên repo vina-me không; đồng ý thì làm theo `references/feedback.md`.

## Tệp tham khảo

| Tệp | Đọc khi |
|---|---|
| `references/core-rules.md` | viết hay sửa văn bản dài, soát kỹ: bảy điều bản đầy đủ, trình bày, sửa văn có sẵn |
| `references/machine-tells.md` | soát văn máy và văn mẫu |
| `references/examples.md` | cần thấy quy tắc chạy trên câu cụ thể |
| `references/cohesion.md` | văn rời rạc, chọn từ nối |
| `references/sentences-and-paragraphs.md` | câu ghép, trạng ngữ, đoạn, câu chủ đề |
| `references/common-errors.md` | lỗi câu, lỗi đoạn, lỗi dùng từ |
| `references/punctuation.md` | dấu gạch, ký hiệu, dấu câu |
| `references/word-choice.md` | giải nghĩa thuật ngữ, chọn từ, viết hoa, tên riêng |
| `references/voice.md` | chọn giọng, viết theo giọng một người |
| `references/citations-data-figures.md` | lời trích, nguồn, con số, hình, bảng |
| `references/document-types.md` | giải thích, hướng dẫn, báo cáo, thư, kiến nghị, nghị luận |
| `references/structure.md` | dàn ý, mở bài, triển khai, kết bài |
| `references/teaching.md` | bài giảng, tài liệu dạy học, câu hỏi kiểm tra |
| `references/review-reports.md` | báo cáo lỗi, báo cáo đối chiếu với tài liệu gốc |
| `references/diagrams-and-docs.md` | chữ trên sơ đồ, trang trình chiếu, tài liệu gửi khách, báo cáo trạng thái hệ thống |
| `references/official-documents.md` | báo cáo, tờ trình, công văn, kế hoạch, biên bản của cơ quan nhà nước |
| `references/bid-proposals.md` | hồ sơ dự thầu: quy trình, việc cấm; chi tiết từng bước ở `references/bid/` |
| `references/docx-export.md` | xuất tệp Word |
| `references/agent-memory.md` | cài vina-me, bộ nhớ dùng chung, học từ phiên cũ, mật khẩu cho agent |
| `references/feedback.md` | người dùng chê hay góp ý về chính skill, gửi góp ý thành issue |

Các script cần Node 18 trở lên; không có Node thì soát bằng mắt. Script xuất Word tự cài gói `docx` ở lần chạy đầu.
