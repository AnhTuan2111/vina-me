sửa giúp mình đoạn postmortem này cho đỡ giọng AI với, đọc cứ sao sao ấy. để đăng lên wiki của team nên giọng trung tính thôi, số liệu giữ nguyên nha

**Tổng quan sự cố order-api ngày 03/11/2026**

Trong bối cảnh hệ thống ngày càng phức tạp như hiện nay, sự cố ngày 03/11/2026 không chỉ là một lỗi kỹ thuật đơn thuần mà còn là bài học quý giá cho toàn đội. Từ 14:05 đến 14:47, dịch vụ **order-api** đã trả về lỗi 503 cho khoảng 18% request thanh toán — một con số đáng báo động. Đồng thời, độ trễ p95 tăng vọt từ 380ms lên ~4.2s, và 3 trong 6 Pod bị restart liên tục do liveness probe fail. Liveness probe: cơ chế Kubernetes gọi định kỳ để biết container còn sống hay không, nếu fail thì Kubernetes sẽ restart container đó.

Với bản 3.8.0 được deploy lúc 13:58 đã thay đổi kích thước connection pool (HikariCP `maximumPoolSize`) từ 50 -> 20. Ban đầu, team nghi ngờ database bị quá tải. Tuy nhiên, CPU của database lúc đó chỉ ở mức 35%, vì vậy nguyên nhân KHÔNG phải là database quá tải, mà là pool kết nối quá nhỏ. Lúc 14:20, Minh mở dashboard và thấy số kết nối đang dùng trong pool luôn ở mức 20/20. Nhiều khả năng bể kết nối 20 không đủ khi lượng request lúc cao điểm vào khoảng 1.200 request/phút, tuy nhiên điều này chưa được xác nhận bằng load test. Phải chăng chúng ta đã quá chủ quan khi thay đổi cấu hình?

Team Platform đã tiến hành rollback lúc 14:41 thông qua việc chạy lệnh `kubectl rollout undo deployment/order-api -n shop`. Bộ phận CSKH chuyển lại lời một khách: "Thanh toán cứ xoay mãi rồi báo lỗi — tôi thử ba lần đều vậy." Sau khi rollback lúc 14:44, tỉ lệ lỗi giảm dần và trở về 0 lúc 14:47. Theo đánh giá sơ bộ, sự cố đã gây ảnh hưởng không nhỏ tới doanh thu. Điều này cho thấy tầm quan trọng của việc kiểm soát cấu hình một cách chặt chẽ.

Để không để lặp lại thiếu xót này, chúng ta cần hành động một cách nhanh chóng, quyết liệt và hiệu quả:
- **Cấu hình:** Đưa Connection Pool về 50 trong bản 3.8.1 (Minh, hạn 07/11).
- **Giám sát:** Thêm cảnh báo khi số luồng chờ kết nối > 10 trong 2 phút.
- **Kiểm thử:** Chạy load test để xác nhận nguyên nhân (chưa có người nhận).

Tóm lại, hãy luôn nhớ rằng: một thay đổi nhỏ trong cấu hình có thể dẫn tới hậu quả lớn.
