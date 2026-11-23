sửa giúp mình ghi chú bàn giao ca trực này cho đọc liền mạch, đang cụt lủn quá. giữ nguyên dữ kiện, ca sáng mai đọc nên viết bình thường thôi

**Bàn giao ca đêm 24/11**

Lan nhận cảnh báo ổ /data của db-1 đầy 92% lúc 02:10. Lan xoá log cũ trong /var/log/app. Ổ còn 71% lúc 02:25. Bản 2.4 của app đặt lịch deploy lúc 22h tối qua. Nhóm QA kiểm tra bản 2.4 tới 23h. Nhóm QA chưa thấy lỗi. Máy web-1 đã lên bản 2.4. Máy web-2 chưa lên bản 2.4. Máy web-2 báo thiếu biến môi trường PAYMENT_KEY. Pipeline của repo payment đang đỏ. Bước test hỏng ở module refund. Lỗi pipeline nằm ở ticket OPS-118. Đây là ticket mà anh Hà muốn ca sáng báo lại kết quả cho.
