# Đọc bộ tài liệu gói thầu

Viết sai thường bắt đầu từ đọc sai: lấy tên nhà thầu từ hồ sơ cũ, lấy số lượng từ bản chữ lệch cột, bỏ sót một ý trong điều
kiện đạt. Bước này đọc hết, đọc ảnh những chỗ bản chữ không tin được, và đối chiếu các tệp với nhau.

## Kiểm kê

Lập bảng: tệp, số trang, là gì, có lớp chữ hay chỉ là ảnh quét, dùng vào đâu. Tệp không có chữ (`pdftotext` ra rỗng hay
vài byte) là ảnh quét: đọc bằng ảnh trang, không bỏ qua.

Bộ tài liệu thường gồm:

| Nhóm | Tệp hay gặp | Lấy gì |
|---|---|---|
| HSMT | quyết định phê duyệt E-HSMT | tên gói chính thức, số và ngày quyết định, căn cứ pháp lý, đơn vị tư vấn |
| | Chương I chỉ dẫn nhà thầu | quy định chung, ít dùng |
| | Chương II bảng dữ liệu | hiệu lực hồ sơ, bảo đảm dự thầu, tài liệu phải nộp theo từng thư mục (E-CDNT 10.8), phương pháp đánh giá |
| | Chương III, mục tiêu chuẩn đánh giá kỹ thuật | tên tiêu chí, điều kiện đạt; là dàn mục của thuyết minh |
| | Chương IV biểu mẫu | Mẫu 01A phạm vi cung cấp (số lượng, đơn vị, thời hạn giao), dịch vụ liên quan |
| | Chương V yêu cầu kỹ thuật | hạng mục, thông số, mẫu bảng đáp ứng, tài liệu phải nộp kèm, kiểm tra thử nghiệm |
| | Chương VI, VII | bảo hành, sửa chữa thay thế, hỗ trợ kỹ thuật, phạt, thanh toán, bảo đảm thực hiện hợp đồng |
| Giấy tờ nhà thầu (HSDT) | đăng ký kinh doanh, báo cáo tài chính | tên đầy đủ, mã số doanh nghiệp, địa chỉ, điện thoại, người đại diện, chức danh |
| Hàng hóa | catalog, datasheet | thông số và số trang để dẫn |
| Mẫu | hồ sơ đề xuất đã nộp, tài liệu kỹ thuật đã nộp | hình thức, dàn mục, cách viết |

## Trích chữ và xem ảnh

```bash
pdftotext -layout -enc UTF-8 "<tệp>.pdf" "<tệp>.txt"        # chữ
pdftoppm -r 80 -png -f <trang> -l <trang> "<tệp>.pdf" out   # ảnh trang để đọc bằng mắt
pdfinfo "<tệp>.pdf"                                          # số trang, tệp quét thường ghi máy quét ở Creator
```

Tệp Word: `node scripts/bid/docx-profile.mjs <tệp.docx>` cho dàn mục và hình thức; muốn đọc chữ thì `bid-check.mjs` dùng chung bộ
đọc, hoặc mở bằng Word.

Bản chữ trích từ PDF sai ở những chỗ đã gặp thật, nên các chỗ sau phải đọc bằng ảnh trang:

- ký hiệu so sánh mất: "Nguồn ≥ 1.200W" thành "Nguồn 1.200W", "Trọng lượng ≤ 500 g" thành "Trọng lượng 500 g";
- bảng tràn trang: dòng cuối của hạng mục 1 nằm đầu trang sau, bản chữ ghép nó vào hạng mục kế;
- bảng nhiều cột lệch dòng: đơn vị tính, khối lượng của Mẫu 01A nhảy sang dòng khác;
- ô số liệu mất: báo cáo kết quả kinh doanh trích ra lợi nhuận trước thuế bằng 0, ảnh trang ghi 177.261.445;
- tệp quét không có chữ: quyết định phê duyệt, đăng ký kinh doanh.

Mọi con số đưa vào hồ sơ (thông số, số lượng, thời hạn, tiền) phải khớp ảnh trang.

## Đối chiếu chéo

- **Ngành nghề**: đọc trang ngành nghề kinh doanh của đăng ký kinh doanh (kể cả giấy xác nhận thay đổi). Gói có phần mềm mà không
  thấy ngành lập trình (mã 62) hay xuất bản phần mềm (5820) thì luôn đưa vào câu hỏi cho BA. Địa chỉ còn ghi quận, huyện đã bỏ
  từ 01/7/2025 thì nêu trong câu hỏi về địa chỉ.
- **Nhà thầu** là đơn vị trên đăng ký kinh doanh và báo cáo tài chính trong thư mục nhà thầu. Hồ sơ cũ có thể đứng tên công ty
  khác (công ty phát triển phần mềm, công ty liên danh). Khác nhau thì ghi rõ trong `00-reading.md` và luôn đưa vào câu hỏi cho
  BA, kể cả khi hồ sơ mới không nhắc đơn vị kia: đơn vị đứng tên ở hồ sơ mẫu là gì với nhà thầu (thầu phụ, liên danh, đơn vị
  phát triển), ai ký, tài liệu kỹ thuật sản phẩm đứng tên ai.
- **Nhà thầu phụ**: đọc điều về nhà thầu phụ ở Chương I (E-CDNT, thường mục 27) và E-BDL, Mẫu 01D (dịch vụ liên quan). HSMT
  chỉ cho thầu phụ làm dịch vụ liên quan mà Mẫu 01D ghi "Không", hay giới hạn phần việc, thì BA định giao cho thầu phụ phần
  việc khác (phát triển phần mềm) là rủi ro bị loại: nêu đầu báo cáo (BA có tệp trả lời thì nêu ở dòng của câu trả lời đó trong bảng mở báo cáo), trích đúng điều HSMT, hỏi BA cách xử lý (nhà thầu tự làm,
  liên danh), không tự khuyên kê thầu phụ.
- **Tên gói** so giữa quyết định phê duyệt, Chương II, Chương IV, Chương V. Khác một chữ cũng ghi lại; dùng tên trong quyết
  định.
- **Địa chỉ nhà thầu**: đăng ký kinh doanh cũ có thể ghi phường, quận trước khi sắp xếp đơn vị hành chính; báo cáo tài chính
  mới ghi tên mới. Ghi cả hai, hỏi BA dùng cái nào. Trong lúc chờ, hồ sơ ghi theo đăng ký kinh doanh (giấy tờ pháp lý gốc) và
  đánh dấu `[cần xác nhận: địa chỉ]` ở mục đầu mối liên hệ và `[cần xác nhận]` ngắn ở mỗi chỗ in lại địa chỉ (bản cam kết),
  để BA sửa một chỗ không sót chỗ khác.
- **Thời hạn**: thời gian thực hiện (Chương V), ngày giao sớm nhất, muộn nhất (Mẫu 01A), mốc tính (ngày ký hay ngày hợp đồng
  có hiệu lực), bảo hành từng hạng mục, thời gian đáp ứng (Mục 3), thời hạn sửa chữa thay thế và hỗ trợ (Chương VII).
- **Tiêu chí** ở Mục 3 so với yêu cầu ở Chương V: yêu cầu nào thuộc tiêu chí nào.
- **Catalog** so với từng thông số của Chương V (xem `goods.md`). Đọc hết mọi bảng của catalog (khoang ổ, cấu hình ổ, cổng
  mạng, nguồn) trước khi kết luận catalog không ghi: thông số hay nằm ở bảng của mục khác (số khoang ở bảng ổ đĩa; ổ 1 TB đáp
  ứng yêu cầu 960 GB vì lớn hơn).

## Kết quả `00-reading.md`

1. Bảng kiểm kê.
2. Thông tin gói: tên, mã thông báo mời thầu, chủ đầu tư (địa chỉ, mã số thuế, điện thoại), hình thức, phương thức, loại hợp
   đồng, thời gian thực hiện, nguồn vốn, phương pháp đánh giá, hiệu lực hồ sơ, bảo đảm dự thầu.
3. Nhà thầu: tên đầy đủ, mã số doanh nghiệp, địa chỉ, điện thoại, fax, thư điện tử, người đại diện, chức danh, nguồn.
4. Phạm vi cung cấp: bảng hạng mục, đơn vị, khối lượng, thời hạn giao.
5. Yêu cầu kỹ thuật theo hạng mục, chép theo ảnh trang.
6. Tiêu chí đánh giá và điều kiện đạt, chép nguyên văn.
7. Tài liệu phải nộp theo từng thư mục.
8. Điều kiện hợp đồng ảnh hưởng tới nội dung kỹ thuật (bảo hành, hỗ trợ, phạt, kiểm tra, nghiệm thu).
9. Chỗ HSMT tự lệch hoặc thiếu; chỗ bản chữ trích sai và giá trị đúng theo ảnh.
10. Câu hỏi cho BA.
