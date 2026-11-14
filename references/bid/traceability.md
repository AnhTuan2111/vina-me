# Bảng truy vết

Bảng truy vết trả lời một câu: yêu cầu nào của HSMT được đáp ứng ở đâu trong hồ sơ, bằng tài liệu nào. Người soát dùng nó để
chắc không bỏ sót; BA dùng nó để biết còn phải đi lấy tài liệu gì.

| Mã | Yêu cầu (nguyên văn) | Nguồn | Mức | Mục đáp ứng | Chứng minh | Trạng thái |
|---|---|---|---|---|---|---|
| KT-1.01 | CPU Intel Xeon W-3500 hoặc Xeon W-2500 hoặc tương đương, tối thiểu 16 nhân | Chương V, 1.2.2, hạng mục 1, tr. 2 | cơ bản | A.I.1, bảng 1 dòng 1 | Catalog tr. 15 | chưa có chứng minh |

- **Mã**: nhóm theo nguồn: `KT` yêu cầu kỹ thuật Chương V, `TC` điều kiện đạt của tiêu chí Mục 3, `HD` điều kiện hợp đồng,
  `NP` tài liệu phải nộp. Số theo hạng mục và thứ tự.
- **Yêu cầu**: chép theo ảnh trang, giữ ký hiệu ≥ ≤, mỗi thông số một dòng, kể cả hàng chưa có catalog (không gộp "KT-2.02 tới
  KT-2.18" vào một dòng); số dòng của mỗi hạng mục bằng số dòng thông số của Chương V.
- Yêu cầu nhiều ý ("Tối thiểu 8 nhân, tiến trình ≤ 4nm (hoặc ...)") tách dòng con KT-2.04a, KT-2.04b, mỗi ý một chứng minh.
- **Mức**: cơ bản (không đạt là loại), chấp nhận được, để biết.
- **Mục đáp ứng**: số mục trong dàn mục; điền sau bước 4, kiểm tra lại sau bước 6.
- **Chứng minh**: tài liệu, trang, mục; với phần mềm là mục của tài liệu kỹ thuật hoặc bản cam kết.
- **Trạng thái**: đáp ứng, tốt hơn, tương đương (ghi nội hàm), chưa có chứng minh, không đáp ứng, cần BA quyết.

Mọi điều kiện đạt của Mục 3 đều có dòng `TC`, kể cả câu cam kết (không quá 02 hợp đồng chậm tiến độ, đổi trả, thu hồi).
Cuối bảng đếm số dòng theo trạng thái; các dòng chưa xong đưa vào phần báo lại.
