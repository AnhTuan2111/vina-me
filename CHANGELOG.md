# Thay đổi

Mỗi bản phát hành có một tag `vX.Y.Z` và một mục ở đây. Máy đã cài bằng `scripts/setup.mjs` tự cập nhật lên tag mới nhất;
dòng đầu của mục là dòng được in ra khi cập nhật.

## 0.27.0 (27/11/2026)

- `document-types.md` có mục mới Phong cách chức năng: bảng năm phong cách của sách Ngữ văn 10 tới 12 (khoa học, hành chính,
  báo chí, chính luận, sinh hoạt), mỗi phong cách ba đặc trưng kèm luật của skill ứng với đặc trưng đó. Mục này nói thêm
  lỗi lẫn phong cách: giọng quảng cáo trong tài liệu kỹ thuật, lời kêu gọi trong báo cáo, khẩu ngữ trong kiến nghị.
- Mục Nghị luận, thuyết phục có ba lỗi lập luận của sách Ngữ văn 12: luận điểm không nhất quán, luận cứ không xác đáng hay
  không đủ, lập luận mâu thuẫn hay luận cứ không dẫn tới kết luận. Mục Kiến nghị, đề xuất dẫn sang đó.
- Thêm đề thử `evals/proposal`: bản kiến nghị chuyển CI mắc cả ba lỗi lập luận, pha giọng quảng cáo và khẩu ngữ.
- `word-choice.md` có mục mới Phép tu từ, gom hai mục So sánh và ẩn dụ, Liệt kê và lặp cú pháp làm mục con. Bảng mười phép
  tu từ nói mỗi phép dùng được ở loại văn nào và giới hạn ra sao. Mục con Nói quá: trong báo cáo, tài liệu, nói quá là nói
  sai mức, có số đo thì để số đo nói. Mục con Nói giảm nói tránh: chỉ giảm chữ chê, không giảm sự việc.
- Luật nói quá được chép thêm vào bảng F của `machine-tells.md` và mục 6.3 của `core-rules.md`, vì agent sửa văn đọc hai
  tệp này mà có lúc không mở `word-choice.md`.
- Đề thử `evals/rewrite` có thêm một câu nói quá và một chữ chê gắn với người (dữ kiện D20); prompt trong `evals.json` chép
  lại theo `prompt.md`.
- `punctuation.md`: dấu phẩy có bốn việc theo sách Tiếng Việt 5 và Ngữ văn 6, kèm ba lỗi hay gặp (thiếu dấu phẩy sau
  trạng ngữ, dấu phẩy giữa chủ ngữ và vị ngữ, hai câu không liên quan nối bằng dấu phẩy). Dấu chấm lửng có ba việc theo
  sách Ngữ văn 7, văn công việc chỉ dùng nó để báo đã cắt bớt lời trích hay output. Dấu chấm phẩy nói rõ hai việc.
- `word-choice.md`, mục Thuật ngữ: ranh giới giữa thuật ngữ được giữ (deploy, merge, pull request) và chữ tiếng Anh pha tạp
  ("deadline", "confirm", "check"), kèm phép thử: người đọc có cần nhận ra chữ này ở lệnh, nút, log không. Bảng viết hoa
  thêm dòng viết hoa để tỏ sự tôn trọng ("Bác", "Người").
- Thêm dấu phẩy cho câu ví dụ tin nhắn trong `document-types.md`.
- Thêm đề thử `evals/loanwords`: thông báo bảo trì nội bộ chêm chữ tiếng Anh, sai dấu phẩy, để dấu chấm lửng cuối dãy.

## 0.26.0 (27/11/2026)

- `machine-tells.md` giải thích dòng "Không phải X, mà là Y": đó là câu phủ định bác bỏ (sách Ngữ văn 8), cần một ý kiến X
  có thật để bác. Tìm X ở câu trước, trong lời người dùng hay tài liệu gốc, hay trong điều nhóm đã nghi; có thì giữ câu,
  không có thì nói thẳng Y. Soát văn người khác thì nói lý do này, không chỉ gọi là khuôn văn AI slop.
- `document-types.md`, mục Tin nhắn công việc: nhờ sếp, người lớn tuổi hơn hay khách thì thêm từ nhờ hoặc dùng câu hỏi
  (hành động nói gián tiếp, sách Ngữ văn 8; phép lịch sự khi nêu yêu cầu, sách Tiếng Việt 4), không dùng câu cầu khiến
  trần; báo lỗi, báo tình hình thì dùng câu trần thuật. Mục Thư và email dẫn sang luật này.
- `scripts/lint.mjs` coi câu "không phải … mà là" đứng sau "nghi ngờ", "cho rằng" là chỗ thường được giữ, chỉ ghi chú.
- Đề thử `evals/review` có thêm câu bác bỏ không có ý kiến bị bác ở mở bài, đặt cạnh câu bác bỏ hợp lệ đã có; đề thử
  `evals/message` chấm thêm câu nhờ việc và câu báo tình hình.

## 0.25.0 (26/11/2026)

- Viết lại 24 tệp `references/` (trừ thư mục `references/bid/`) thành văn liền mạch: mỗi tệp mở bằng câu nói nó dùng làm gì và
  đi theo thứ tự nào, gạch đầu dòng dài tách thành mục con và đoạn văn, ví dụ đặt ngay trong câu nói luật, ô bảng dài tách
  thành đoạn dưới bảng. `core-rules.md` bỏ khuôn "Sai, Sửa, Vì sao" lặp ở mọi mục.
- Luật giữ nguyên. Tên các mục mà tệp khác trỏ tới giữ nguyên; `feedback.md` đổi mục "Không gửi" thành "Thứ không bao giờ
  gửi", `bid-proposals.md` đổi "Những điều không được làm" thành "Việc cấm".
- Thay các câu ví dụ trùng dữ kiện của đề thử (bản 2.4 và nhóm QA, OOMKilled, probe) bằng ví dụ khác.
- `word-choice.md` thêm dòng viết hoa: chữ chung đứng trước tên nhóm (team, nhóm) viết thường giữa câu.

## 0.24.1 (23/11/2026)

- Viết lại `core-rules.md` cho người đọc được: mỗi luật là một mục con có số (1.1, 4.2...), gồm một đoạn nói luật và lúc
  nào dùng, một câu sai, một câu sửa và lý do. Luật giữ nguyên, chỉ đổi cách viết.
- Danh sách thay đổi khi sửa đoạn được dán vào: có hơn năm thay đổi thì chọn năm thay đổi đáng nói nhất, chỗ sửa dấu và
  ký hiệu gom một dòng với một lý do chung, không dành dòng cho việc cố ý không làm.
- Mục Không làm đổi thành Phạm vi của skill, viết thành đoạn văn; danh sách việc có lời trả riêng tách thành danh sách.

## 0.24.0 (23/11/2026)

- `cohesion.md` gọi tên hai lớp liên kết của sách Ngữ văn 9 (liên kết nội dung, liên kết hình thức), thêm phép đồng nghĩa,
  trái nghĩa và phép liên tưởng, và có mục mới Chọn kiểu câu để nối: câu bị động giữ thứ đang bàn ở đầu câu, khởi ngữ
  "Còn X thì…" để chuyển sang thứ thứ hai, trạng ngữ chỉ tình huống để gộp hai câu cùng chủ thể.
- `sentences-and-paragraphs.md` có mục Trật tự từ: bốn việc trật tự từ làm, trong đó câu kết bằng hư từ hay dồn thanh trắc
  thì đọc vấp.
- Gộp hai câu cùng chủ thể thì gộp thật, không chỉ đưa mốc giờ lên đầu; gốc chỉ ghi giờ cho một việc thì mốc giờ đứng
  cạnh việc đó, không để trạng ngữ đầu câu phủ cả hai việc.
- Thêm đề thử `evals/cohesion`: ghi chú bàn giao ca trực viết toàn câu cụt, cài bẫy cho từng kiểu nối.

## 0.23.0 (23/11/2026)

- Soát theo năm phương châm hội thoại của sách Ngữ văn 9 (lượng, chất, quan hệ, cách thức, lịch sự): `core-rules.md` có mục
  mới gồm năm câu hỏi, mỗi câu kèm câu sai và câu sửa; bước Soát của `SKILL.md` và mục Cách đọc của `scoring.md` dẫn sang.
- `review-reports.md`, mục Giọng: chỉ lỗi thì nói giảm chữ chê ("chưa khớp", "cần sửa"), nhưng không giảm tới mức người
  nhận không biết đó là lỗi.
- Đề thử `evals/review` cài thêm một câu lạc đề kèm suy luận không theo được và một câu phán xét người đọc; thang chấm có
  mục mới cho phương châm hội thoại.
- Lời soát mà không sửa: lỗi làm người đọc hiểu sai giờ, ngày, con số xếp trên lỗi câu chữ; nhắc lại chỗ khác bằng vài
  chữ của câu gốc, không bằng số mục tự đặt; không đưa dữ kiện ngoài tệp để bác câu gốc.

## 0.22.2 (23/11/2026)

- Luật vế sau mượn chủ ngữ của vế trước ("Bản 2.3 thêm cache…, chưa đo lại độ trễ") có thêm ở `core-rules.md` điều 3 và mục
  Soát của `function-words.md`, vì agent sửa văn không mở `sentences-and-paragraphs.md` nên đề thử vẫn mắc lỗi này.
- Bảng tiến độ tóm tắt và bảng lớp đào tạo ở `references/bid/house-style.md` đo lại từ hồ sơ mẫu của công ty: 7, 33, 9, 9,
  11, 31 và 7, 29, 15, 33, 17. Hai bộ số cũ là số chỉnh tay lúc dựng hồ sơ, và `schedule-letters.md` ghi một bộ thứ ba;
  giờ `schedule-letters.md` trỏ sang `house-style.md`.

## 0.22.1 (23/11/2026)

- Skill tự đặt tên đời thường cho nhiều thứ đã có thuật ngữ trong sách Tiếng Việt và Ngữ văn. Đã đổi sang thuật ngữ: hư từ
  (thay "từ nhỏ", "chữ nhỏ"), thành phần phụ chú (thay "lời chêm"), phép liên kết câu (thay "Bốn cách nối câu"), trạng ngữ
  chỉ thời gian, tổng phân hợp và song hành, cặp quan hệ từ, câu ghép có cấu tạo phức tạp, câu cầu khiến, hàm ý, lặp cú
  pháp, biệt ngữ xã hội, dẫn chứng. Câu có chữ "giống" nay gọi là phép so sánh; ẩn dụ là so sánh ngầm, theo cùng luật.
- Bỏ hơn trăm chỗ skill tự dùng "đúng" để nhấn ("đúng chỗ", "đúng như", "đúng chữ"), và "thật sự" để nhấn. `lint.mjs` báo
  thêm "đúng như", "đúng tên".
- Sửa nốt chữ "Văn máy" viết hoa còn sót trong evals.
- Thêm đề thử `evals/function-words` cho `references/function-words.md`.
- Rà cả skill tìm luật mơ hồ, chữ hỏng và hai tệp dạy ngược nhau (129 chỗ), sửa một lượt: luật mơ hồ có thêm khi nào áp,
  câu sai và câu sửa; chỗ dạy ngược nhau chốt một luật (hỏi khi thiếu dữ kiện, câu bị động không chủ thể, đặt lời giải
  nghĩa, thuật ngữ gửi lãnh đạo, câu thứ hai sau cách đoán sai, mốc tách câu); văn của skill thôi tự dịch packet, browser,
  domain, certificate, restart, rollback, cluster.
- `word-choice.md` đổi nhan đề thành Chọn từ và thuật ngữ.
- Sửa theo kết quả chạy đề thử: sửa văn có sẵn mà gốc tự lệch mức chắc chắn thì theo mức thấp hơn ở mọi câu; bản sửa
  đặt ngay đầu lời trả, không câu dẫn, cuối chỉ một câu hỏi; không thêm "rồi", "nên" mà gốc không nói; gạch dài trong
  lời trích đổi thành gạch nối; lời trích của người ngoài có câu dẫn; việc rời nhau viết thành danh sách; việc hệ thống
  làm theo lịch không dùng "bị".

## 0.22.0 (23/11/2026)

- `references/word-choice.md` có mục mới Thành phần tình thái, thay cho mục Từ tăng mức và từ giảm mức: mỗi câu nói một sự
  việc và người viết chắc tới đâu về sự việc đó. Mục có bảng bốn mức ("chắc", "có lẽ", "theo mình"), cách đặt thành phần
  tình thái trước ý đang đoán, mỗi câu một thành phần tình thái, tóm tắt không chắc hơn thân bài. "Tất cả", "luôn luôn"
  chuyển sang mục Phạm vi của câu.
- Đề thử `evals/rewrite` thêm ba bẫy về thành phần tình thái.

## 0.21.0 (18/11/2026)

- Thêm `references/function-words.md` về hư từ, chỉ từ và đại từ: phó từ ("đã", "sẽ", "được", "bị", "có thể",
  "chưa"), lượng từ ("các", "những", "mọi", "mỗi", "từng"), chỉ từ, quan hệ từ, trợ từ và tình thái từ. Tiếng Việt báo thời, số nhiều, bị động bằng
  các từ này chứ không biến đổi hình thái của từ như tiếng Anh, nên văn dịch sát hay thừa "đã được", "các", "của… của", "việc".
  Tệp nêu khi nào bỏ, khi nào phải giữ, kèm ví dụ văn kỹ thuật, theo phần Tiếng Việt của sách Ngữ văn 6 tới 11.

## 0.20.1 (18/11/2026)

- Chữ "văn máy" nằm khắp SKILL.md, `references/` và evals, nên agent viết theo, trong khi ngoài đời không ai nói thế. Đã đổi
  hết thành "văn AI slop", và `scripts/lint.mjs` báo khi gặp chữ "văn máy".

## 0.20.0 (17/11/2026)

- Lệnh `/vina-me score <tệp>` giờ chỉ chấm: agent đang chạy lệnh đọc từng câu, trả điểm và danh sách câu rồi dừng, không gọi
  agent khác, không sửa rồi chấm lại, vì gọi nhầm lệnh là tốn nhiều token. Muốn agent khác chấm hay sửa tới một mốc điểm thì
  nói rõ trong lời nhờ; cách làm vẫn ở `references/scoring.md`.
- Viết xong bài dài, agent không tự nhờ agent khác chấm nữa, chỉ chấm khi người dùng muốn có điểm.

## 0.19.2 (14/11/2026)

- Chữ "kiểm" đứng lẻ (sửa, kiểm, chạy; chưa kiểm) nằm khắp SKILL.md và `references/`, nên agent viết theo. Đã đổi hết thành
  "kiểm tra", và `scripts/lint.mjs` báo chữ "kiểm" lẻ; "kiểm" chỉ đi trong từ ghép như kiểm thử, kiểm kê.

## 0.19.1 (14/11/2026)

- Thêm luật cứng vào đầu SKILL.md: viết bất cứ thứ gì có tiếng Việt, kể cả câu chat vài chữ, thì luôn gọi skill trước khi viết.
  Dòng nhắc của hook mỗi lượt cũng đổi thành lệnh gọi skill, không chỉ nhắc áp luật.

## 0.19.0 (14/11/2026)

- Agent chạy `setup.mjs` thay người dùng trên Windows mà không kèm `--answers` thì script mở một cửa sổ PowerShell riêng để
  người dùng tự trả lời tám câu, chờ cửa sổ đóng rồi báo lại cho agent cài xong hay lỗi. Không muốn mở cửa sổ thì thêm
  `--no-window`; macOS và Linux vẫn nhắc ghi câu trả lời vào tệp như cũ.

## 0.18.1 (14/11/2026)

- Thuật ngữ có tên chuẩn tiếng Anh giữ nguyên, không dịch sang tiếng Việt, kể cả chữ đã có từ Việt quen: option, không
  "cờ"; layer, không "tầng"; packet, domain, certificate. Chữ đời thường không phải thuật ngữ (máy, tệp, lệnh) vẫn viết
  tiếng Việt.

## 0.18.0 (14/11/2026)

- Lệnh mới `/vina-me score <tệp> [mốc]`: một agent khác, không thấy quá trình viết, đọc tuần tự từng câu rồi trừ điểm theo ba
  mức nặng, vừa, nhẹ, trả về điểm và danh sách câu gốc kèm câu thay thế. Có mốc thì sửa rồi chấm lại, ba lần liền từ mốc trở
  lên mới đạt; mốc mặc định là 90. Cách chấm và cách xử lý khi hai người chấm chê ngược nhau ở `references/scoring.md`.
- Trước mỗi lần viết hay viết lại văn dài, agent đọc lại skill và tệp tham khảo hợp loại, không viết theo trí nhớ về luật.
- Viết đủ từ ghép ("tóm tắt", "quản lý"), không cắt còn một tiếng.

## 0.17.0 (13/11/2026)

- Trong Claude Code, mỗi tin người dùng gửi đi kèm một dòng nhắc agent soát câu trả lời theo vina-me, kể cả câu trả lời chỉ vài
  câu, vì nội dung skill chỉ nạp một lần và dễ bị quên trong phiên dài. Máy đã cài được thêm hook này một lần ở lần đồng bộ đầu
  tiên sau khi cập nhật, có hiệu lực từ phiên sau.
- Hook là `UserPromptSubmit` trong settings.json, chạy `scripts/remind.mjs`. Người dùng tự gỡ hook thì lần đồng bộ sau không
  thêm lại. Máy chỉ cài skill, không cài bộ nhớ, thì tự thêm hook theo README.

## 0.16.2 (13/11/2026)

- Trong tệp Word do skill dựng, các chỗ đánh dấu chờ người duyệt như `[cần xác nhận: ...]` được tô nền vàng, nên BA hay người
  duyệt mở tệp ra là thấy ngay chỗ phải tự sửa. Việc tô áp cho hồ sơ dự thầu, văn bản hành chính và báo cáo xuất Word, với cả
  dấu `[cần bổ sung...]` và `[chưa có chứng minh...]`.

## 0.16.1 (13/11/2026)

- Agent dùng skill cho mọi câu trả lời trong chat bằng tiếng Việt, kể cả câu trả lời chỉ vài câu; trước đây skill chỉ được gọi
  khi viết đoạn dài hơn vài câu. Máy cài trước bản này vẫn giữ tệp `AGENTS.md` cũ, vì lúc cập nhật script không ghi đè tệp đó.
  Muốn agent đọc luật mới ngay từ bộ nhớ thì sửa dòng trong mục "Viết tiếng Việt" thành: "Mọi câu trả lời trong chat bằng tiếng
  Việt, dù chỉ vài câu, và mọi đoạn tiếng Việt viết ra hay sửa đều theo skill `vina-me`."

## 0.16.0 (13/11/2026)

- Hồ sơ dự thầu dựng đủ bộ tệp kỹ thuật: bảng đáp ứng dẫn đúng trang tài liệu hãng, tài liệu hãng tự tìm, tải và tô vàng đúng
  chữ được dẫn (`fetch-doc.mjs`, `pdf-highlight.mjs`), bản dịch, thuyết minh, tài liệu phần mềm, tiến độ, bản cam kết, báo cáo
  cho người duyệt; `package-check.mjs` soát cả bộ. Ba lần thử liền trên một gói thầu thật được người chấm độc lập cho 97, 96, 98
  trên 100.
- Các mảng viết (lời giải thích, sửa văn, soát văn, email và tin nhắn, báo cáo rà soát, văn bản hành chính, chữ trên sơ đồ, báo
  cáo xuất Word, viết theo giọng, góp ý về skill) được chấm lại theo thang 100 và sửa luật, ví dụ, script ở những chỗ người chấm
  trừ điểm. `lint.mjs` bắt thêm mẫu câu văn AI slop, `report-docx.mjs` ghi kèm chữ để soát.
- Thêm `references/storytelling.md`: dẫn dắt người đọc đi một mạch, rút từ ba audio kể chuyện tiếng Việt.
- Bài giảng viết theo lối dẫn dắt của `storytelling.md`: trước khi viết thì kê mọi chữ người học sẽ gặp (đã dạy, dạy ở đây, tránh),
  mở bằng câu hỏi của người học, mỗi câu trả lời mở ra câu hỏi sau. Luật chi tiết chuyển sang `references/teaching-checklist.md`
  để soát. Bảy lần thử bài giảng gần nhất được 89 tới 95 trên 100; bản vá sau sẽ đưa lên mức 95 ổn định.
- Gọi thẳng một việc bằng `/vina-me write|edit|review|word|bid|memory|secret|feedback`. `SKILL.md` gọn lại, chi tiết cách trả kết
  quả từng việc chuyển sang `references/core-rules.md`.
- `setup.mjs` in cách dùng khi gặp `--help`, báo lỗi khi gặp cờ lạ thay vì chạy cài đặt, và không tạo task Task Scheduler thật
  khi chạy với `--home` giả.
- Sổ góp ý: trong lúc làm, gặp chỗ skill hướng dẫn sai hay script lỗi thì agent tự ghi một dòng vào sổ trên máy, không đợi
  người dùng chê; cuối việc hỏi một lần có gửi thành góp ý không. Không có tài khoản GitHub thì gửi tệp sổ cho người cài skill.
- Mô tả skill nói rõ việc làm hồ sơ dự thầu; chữ "thuận mồm" đổi thành "lưu loát".

## 0.15.0 (10/11/2026)

- Hồ sơ dự thầu soát kỹ hơn, theo các lỗi người chấm đã trừ điểm ở những lần thử: `bid-check.mjs` bắt lịch nhắc lại ngoài phần
  tiến độ chưa đánh dấu, số thập phân dấu chấm kiểu Anh, câu khẳng định ai làm phần mềm khi đang chờ BA, thêm lời nói với BA
  trong thân hồ sơ. `bid-docx.mjs` không để tên phần còn một chữ ở dòng cuối, không gãy mã hiệu ở dấu gạch nối, báo cột bảng
  quá hẹp, căn giữa cột STT, Bước, Mã. `render-pdf.ps1 -UpdateDocx` giữ tên nhà thầu ở "người sửa cuối" của tệp Word. Hướng
  dẫn thêm mục soát cuối như người chấm, cách điền Mẫu 10B, cách đánh dấu lịch và đề xuất nhắc lại ở nhiều chỗ.

## 0.14.0 (10/11/2026)

- Viết phần kỹ thuật của hồ sơ dự thầu (thuyết minh đề xuất kỹ thuật E-HSDT) từ hồ sơ mời thầu: quy trình tám bước ở
  `references/bid-proposals.md`, hướng dẫn từng bước ở `references/bid/`. Script ở `scripts/bid/`: `bid-docx.mjs` dựng Word
  theo khuôn hồ sơ mẫu của công ty hoặc khuôn dựng sẵn; `bid-check.mjs` soát chỗ còn trống, chữ gán sai trang catalog, cam
  kết và chi tiết kỹ thuật tự đặt chưa đánh dấu, chữ của gói cũ; `docx-profile.mjs` so định dạng với hồ sơ mẫu;
  `page-check.mjs` soát bố cục trang PDF; `render-pdf.ps1` cho Word cập nhật mục lục và xuất PDF. Bảng, mục lục, bìa, bảng
  tiến độ trình bày gọn hơn hồ sơ mẫu. Thay cho phần hồ sơ dự thầu của bản 0.13 đã gỡ.

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
