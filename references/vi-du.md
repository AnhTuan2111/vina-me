# Ví dụ: trước và sau

Mỗi cặp minh hoạ một quy tắc. Đọc để thấy cách sửa, không chép lại câu chữ.

## 1. Định nghĩa trước hình

Trước:

> Định nghĩa dùng được thì nhìn theo đường đi của gói tin: hai máy cùng mạng khi gói tin đi từ máy này tới máy kia mà
> không phải qua router nào.

Vấn đề là người đọc chưa có hình nào trong đầu, chủ ngữ là một cụm trừu tượng, và dấu hai chấm bị dùng làm khung
cho định nghĩa.

Sau:

> Thế nào là hai máy cùng mạng? Bắt đầu từ thứ có sẵn trong nhà đã, là cục phát WiFi mà nhà mạng lắp cho bạn. Laptop
> của bạn nối vào nó bằng sóng WiFi, điện thoại cũng vậy, còn máy bàn thì có thể cắm cáp vào một cổng ở mặt sau của
> nó. Ba máy đó cùng mạng với nhau, vì cả ba cùng nối vào một cục phát WiFi.

Rồi vài đoạn sau, khi đã kể gói tin đi qua router ra sao:

> Tới đây thì nói lại được "cùng mạng" cho chính xác. Hai máy cùng mạng khi gói tin đi từ máy này sang máy kia mà
> không phải đi qua router.

## 2. Câu cụt rời nhau

Trước:

> DNS dịch tên thành địa chỉ. Máy người dùng không biết địa chỉ. Nó hỏi một server DNS. Server đó trả lời.

Vấn đề là không câu nào nhắc tới câu trước.

Sau:

> Trình duyệt đã biết phải tìm địa chỉ của api.example.com, nhưng tìm ở đâu? Máy người dùng không tự biết câu trả
> lời, nên nó phải hỏi DNS. Hệ điều hành gửi câu hỏi tới một server DNS đã được cài sẵn cho nó, thường là cục phát WiFi
> trong nhà hoặc một server của nhà mạng. Server DNS đó hoặc trả lời luôn, hoặc đi hỏi tiếp giúp rồi mới trả lời.

## 3. Mở bằng dựng cảnh

Trước:

> Chín giờ tối thứ Sáu. Điện thoại rung. Một tin nhắn từ sếp hiện lên, và tim bạn chùng xuống.

Sau:

> Giả sử sếp nhắn đúng một câu: "Web không vào được em ơi." Không có ảnh chụp, không có mã lỗi, không biết hỏng từ lúc
> nào. Nhận được tin như thế thì bắt đầu tìm từ đâu?

## 4. Mở bằng bối cảnh thời đại

Trước:

> Trong xã hội hiện đại, việc sử dụng điện thoại trước khi đi ngủ đã trở thành một thói quen phổ biến, đặc biệt là
> trong giới trẻ.

Sau:

> Dùng điện thoại trong một giờ trước khi ngủ làm bạn ngủ muộn hơn. Màn hình phát ánh sáng xanh, và ánh sáng đó làm
> cơ thể chậm tiết ra chất gây buồn ngủ.

(Câu sau chỉ viết được khi kiểm được nguồn cho hai điều đó.)

## 5. Đối lập giả và câu châm ngôn

Trước:

> Docker không phải là một máy ảo, mà là một cuộc cách mạng trong cách chúng ta đóng gói phần mềm. Và đó chính là sức
> mạnh thật sự của container.

Sau:

> Container là một process Linux bình thường chạy từ một image, chỉ khác là bị kernel giới hạn tầm nhìn và tài nguyên.
> Nó dùng chung kernel với máy, nên nó không có kernel riêng như máy ảo.

## 6. "Không chỉ… mà còn…" để nâng tầm

Trước:

> Siêu trăng máu không chỉ là một sự kiện thiên văn ngoạn mục mà còn mang lại cho chúng ta cơ hội để hiểu sâu hơn về
> các quá trình thiên văn học.

Sau:

> Siêu trăng máu xảy ra khi Mặt Trăng vừa ở gần Trái Đất nhất vừa đi vào bóng của Trái Đất. Lúc đó nó trông lớn hơn
> và ngả sang màu đỏ.

## 7. Chủ ngữ trừu tượng, danh từ hoá

Trước:

> Việc triển khai được thực hiện thông qua cơ chế kết nối SSH, đóng vai trò là cầu nối giữa pipeline và server.

Sau:

> Pipeline đăng nhập vào server bằng SSH, rồi kéo image mới về và chạy lại.

## 8. Một thứ nhiều tên

Trước:

> DB chạy trong một container. Cơ sở dữ liệu này lắng nghe ở cổng 5432, và kho dữ liệu chỉ nhận kết nối từ ứng dụng.

Sau:

> Database chạy trong một container và listen port 5432. Nó chỉ nhận kết nối từ ứng dụng.

## 9. Thuật ngữ dồn một chỗ

Trước:

> Deployment tạo ReplicaSet, ReplicaSet tạo Pod, Service chọn Pod theo label, và Ingress trỏ vào Service.

Sau:

> Đưa app lên cụm bằng gì? Bằng một Deployment, tức một bản khai nói "muốn có ba bản app đang chạy". Cụm giữ đủ số bản
> đó, bản nào chết thì nó thay bản khác vào.

Các tên còn lại để tới những đoạn sau, mỗi đoạn một tên.

## 10. Tả vật trước, gọi tên sau

Trước:

> Cây cần câu là bộ phận giữ thăng bằng của ghe ngo.

Sau:

> Giữa lườn ghe người ta đặt một cây dài từ đầu đến cuối thân ghe, gọi là cây cần câu, để giữ thăng bằng.

## 11. Nhận định trừu tượng không có việc thấy được

Trước:

> Ở đó việc thi cử rất được coi trọng.

Sau:

> Ở đó việc thi cử rất được coi trọng. Ngày thi, người ta cấm làm ồn quanh điểm thi, chặn bớt đường, và hoãn cả giờ
> máy bay cất cánh trong lúc thí sinh làm bài nghe.

(Chỉ viết được khi ba việc đó kiểm được.)

## 12. Lời hứa về phần sau

Trước:

> Lệnh này có ký hiệu `2>/dev/null`, chúng ta sẽ tìm hiểu kỹ ở Bài 12.

Sau:

> Phần `2>/dev/null` giấu các dòng chẩn đoán. Biết chừng đó là đủ để chạy lab này.

## 13. Ép cho ngắn

Trước:

> Switch: nối máy trong một mạng, đọc MAC. Router: nối hai mạng, đọc IP.

Sau:

> Router khác switch ở hai chỗ. Thứ nhất, switch nằm trong một mạng, còn router đứng giữa hai mạng. Thứ hai, switch
> chỉ đọc địa chỉ MAC trên lớp vỏ, còn router mở lớp vỏ ra và đọc địa chỉ IP bên trong để biết gói tin cần sang mạng
> nào.

## 14. Trải nghiệm bịa

Trước:

> Nói thật là hồi mới học mình cũng toát mồ hôi với cái lỗi này luôn á, kaka.

Sau, nếu không có chuyện đó:

> Lỗi này rất dễ gặp ở lần chạy đầu.

Sau, nếu có một lần đoán sai thật đã được ghi lại:

> Có lần mình đoán một website hết chứng chỉ đúng thứ Hai là do tình cờ. Không tình cờ đâu, vì hạn là ngày cấp cộng
> 90 ngày.

## 15. Kết bằng lời kêu gọi

Trước:

> Tóm lại, Docker là công cụ không thể thiếu. Hãy bắt đầu học Docker ngay hôm nay để mở ra tương lai của bạn!

Sau:

> Vậy là app và database đã chạy bằng hai lệnh. Còn một chỗ chưa ổn là xoá container database thì dữ liệu mất theo.

## 16. Email công việc

Trước:

> Chào anh, em xin phép được chia sẻ với anh về hành trình deploy đầy thử thách tối qua. Thật ra mọi chuyện bắt đầu
> khi…

Sau:

> Chào anh, tối qua lúc 22h em deploy bản 2.4.1 lên production thì bị lỗi, trang đăng nhập trả 502 trong khoảng 12
> phút. Em đã quay lại bản 2.4.0 lúc 22h15. Lý do là bản mới cần một biến môi trường mà production chưa có. Em sẽ bổ
> sung và deploy lại lúc 14h hôm nay, anh duyệt giúp em trước giờ đó.
