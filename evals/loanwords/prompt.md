sửa giúp mình cái thông báo này trước khi gửi cả nhóm dev, viết vội nên lủng củng, chêm tiếng anh nhiều quá. dữ kiện giữ nguyên nhé

**Thông báo bảo trì staging tối thứ Sáu 04/12**

Basically tối thứ Sáu 04/12 team Platform sẽ bảo trì cụm staging từ 20h tới 23h. Trong lúc bảo trì cụm staging không nhận job mới. Các pipeline đang chạy lúc 20h, sẽ bị dừng và không deploy được cho tới khi bảo trì xong.

Các bạn check lại các pull request đang mở, merge xong trước 18h hôm đó nhé. Deadline gửi danh sách app cần giữ chạy là 17h thứ Năm 03/12, ai cần thì confirm qua kênh #staging.

Sau bảo trì, cụm staging được update lên bản Kubernetes mới, các app order-api, payment-api, user-api... sẽ được deploy lại. Máy stg-db-1 máy chứa database của staging sẽ restart sau cùng. Lịch này đã chốt với anh Long, phòng họp tầng 3 vẫn mở như thường.

Có feedback gì về lịch này thì các bạn cứ gửi, team sẽ support.
