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

## 17. Báo cáo gửi cơ quan nhà nước

Trước, viết theo kiểu báo cáo kỹ thuật gửi trong nhóm:

> Bọn mình đã xong phần nhập dữ liệu, khoảng 1,234 đầu sách (gần như đủ hết). Hệ thống chạy ổn từ 15/11, chưa thấy lỗi
> gì. Còn mấy chục cuốn thiếu mã vạch vì phiếu nhập cũ mất, cái này chắc phải hỏi Sở.

Sau, theo thể thức văn bản hành chính:

> I. KẾT QUẢ ĐẠT ĐƯỢC
>
> 1. Đã nhập 1.234 đầu sách, đạt 98,5% số đầu sách hiện có (số liệu tính đến ngày 14/12/2025).
>
> 2. Phần mềm vận hành ổn định từ ngày 15/11/2025, chưa phát sinh sự cố mất dữ liệu.
>
> II. TỒN TẠI, HẠN CHẾ VÀ NGUYÊN NHÂN
>
> Còn 19 đầu sách chưa có mã vạch do phiếu nhập sách năm 2015 bị thất lạc.
>
> III. ĐỀ XUẤT, KIẾN NGHỊ
>
> Đề nghị Sở Giáo dục và Đào tạo hướng dẫn cách ghi nhận các đầu sách không còn phiếu nhập gốc.

Chủ ngữ là đơn vị chứ không phải "bọn mình". "Khoảng", "gần như đủ hết", "mấy chục" thay bằng con số có kỳ số liệu. Số
viết theo kiểu Việt Nam. Ý đoán "chắc phải hỏi Sở" thành một kiến nghị cụ thể. Ba mục theo khung của Nghị định 09/2019.
Bản "trước" thiếu con số 19 và 98,5% nên người viết phải đi tra lại; không có dữ kiện thì để trống, không tự điền.

## 18. Một chuỗi việc kéo theo nhiều thuật ngữ

Trước:

> App trả lời chậm thì Nginx hết proxy_read_timeout, trả 504 cho trình duyệt và ghi "upstream timed out" vào error log.

Vấn đề là một câu mang ba thuật ngữ mới (proxy_read_timeout, 504, upstream) mà không cái nào được giải nghĩa.

Sau:

> Vì sao trình duyệt báo 504 dù app vẫn đang chạy? Vì Nginx không chịu đợi app mãi. Nginx chuyển request vào app rồi đợi
> câu trả lời, mặc định 60 giây, quá thời gian đó thì nó bỏ và tự trả cho trình duyệt mã 504, mã HTTP nghĩa là chỗ đứng
> giữa đã đợi phía sau quá lâu.
>
> Mã 504 ấy thường đi kèm một dòng trong error log của Nginx có chữ `upstream timed out`. Upstream là tên Nginx gọi app
> đứng sau nó, nên dòng này đọc ra là "app trả lời chậm quá".

Mỗi đoạn một thuật ngữ. Tên option `proxy_read_timeout` để tới đoạn nói cách chỉnh, vì chỉ ở đó người đọc mới cần gõ nó;
trước đó nói bằng lời thường, "đợi câu trả lời, mặc định 60 giây".

## 19. Lời giải nghĩa thành tên thứ hai, một việc ba động từ

Trước:

> Gateway đặt rate limit 100 request mỗi phút cho mỗi khách, tức là hạn mức gọi API. Vượt hạn mức thì gateway chặn
> request và trả 429. Đặt ngưỡng thấp quá thì gateway drop nhầm cả khách thật.

Vấn đề là rate limit có ba tên (rate limit, hạn mức, ngưỡng), và một việc của gateway có hai động từ (chặn, drop).
Người đọc tưởng đang có ba thứ và hai việc khác nhau.

Sau:

> Gateway đặt rate limit 100 request mỗi phút cho mỗi khách, tức là mỗi khách được gọi API tối đa 100 lần một phút. Khách
> vượt rate limit thì gateway từ chối request và trả mã 429. Đặt rate limit thấp quá thì gateway từ chối nhầm cả khách
> thật.

Lời giải nghĩa "tối đa 100 lần một phút" chỉ dùng một lần; các câu sau quay về chữ rate limit và chữ "từ chối".

## 20. Hai khái niệm dễ lẫn đứng xa nhau

Trước:

> Request không kèm token thì server trả 401. Token lấy ở trang cài đặt tài khoản, mỗi token có hạn riêng, hết hạn thì
> tạo cái mới. […] Kèm token rồi mà vẫn lỗi thì đó là 403, do tài khoản thiếu quyền.

Vấn đề là hai mã cách nhau cả đoạn, mỗi mã một khuôn câu, nên người đọc không thấy chúng là một cặp để phân biệt.

Sau:

> 401 là server chưa biết bạn là ai, thường vì request không kèm token hay token đã hết hạn, còn 403 là server biết bạn là
> ai mà tài khoản không có quyền làm việc đó. Gặp 401 thì đi lấy token, gặp 403 thì đi xin quyền.

Phần cách lấy token đi sau cặp này, ở đoạn của nó.

## 21. Ẩn dụ chia rạch ròi thứ bài chưa chia được

Bối cảnh: lệnh `df` báo ổ 100 GB đã dùng 95 GB, cộng các thư mục quen bằng `du` chỉ được 60 GB, và bài đã nói chưa biết
phần chênh nằm ở đâu.

Trước:

> Giống một cái tủ 100 ngăn đã đầy 95 ngăn. Bạn mở các ngăn quen ra đếm được 60 ngăn đồ của mình, vậy 35 ngăn kia là đồ
> người khác để vào. Ví von này hết đúng ở chỗ tủ thì có cửa, còn ổ đĩa thì không.

Vấn đề là ẩn dụ gán số và chủ cho phần chênh ("35 ngăn kia là đồ người khác"), đúng điều bài vừa nói là chưa biết. Chỗ
hết đúng được chọn là một khác biệt vô hại, không chặn được cách suy sai đó.

Sau:

> Chuyện của ổ này giống một cái tủ báo đã đầy, mà mở hết các ngăn quen ra thì vẫn thấy còn trống nhiều. Ví von này
> hết đúng ở chỗ tủ thật thì đồ chiếm chỗ phải nằm trong một ngăn nào đó, còn ở đây tệp đã xoá mà vẫn có process giữ mở
> thì vẫn chiếm ổ, `du` không thấy, nên phần chênh có thể không nằm ở thư mục nào cả.

## 22. Lời trả khi giao một văn bản viết mới

Trước:

> Mình viết xong ghi chú ở `deploy-502.md`, khoảng 450 chữ. Lỗi 502 là do app khởi động chậm, không phải do Nginx như bạn
> đoán. Nginx chỉ chuyển request, còn app mất cả phút mới nhận request nên lần chuyển đầu bị lỗi. Ví von trong ghi chú là
> quán ăn mở cửa muộn. Đã soát bằng `lint.mjs` (0 chỗ) và đọc lại hai lượt.

Vấn đề là lời trả tóm lại cả ghi chú, nhắc lại ví von, kể việc đã soát và báo số chữ không ai hỏi.

Sau:

> Ghi chú ở `deploy-502.md`. Đoán lỗi ở Nginx là chưa đúng, ghi chú có nói vì sao. Log không ghi giờ app khởi động xong
> nên chưa biết app cần bao lâu, mức chờ trong ghi chú là điểm thử, phải đo lại.

## 23. Chữ người dùng đã gõ vẫn là thuật ngữ mới, cặp dễ lẫn mở bằng bằng chứng

Bối cảnh: người dùng biết Java, chưa biết Kubernetes, gõ "pod cứ CrashLoopBackOff, liveness probe fail, chắc app lỗi
code nên crash". Log app không có exception nào.

Trước:

> Mình đoán app lỗi code nên crash. Nhưng app lỗi code thì log có exception, còn log này không có dòng nào như thế.
>
> Pod vào `CrashLoopBackOff` vì liveness probe fail, kubelet restart container liên tục và pod lại crash.

Vấn đề là người dùng đã gõ `CrashLoopBackOff` và liveness probe nhưng chưa hiểu, nên cả hai vẫn là thuật ngữ mới, và
một câu mang ba thuật ngữ (thêm kubelet). Pod và container dùng lẫn cho cùng một thứ bị chạy lại. Exception đứng ở đoạn
mở làm bằng chứng, còn liveness probe xuất hiện ở đoạn sau với khuôn khác, nên người đọc không thấy hai cách chết là
một cặp.

Sau:

> Mình đoán app lỗi code nên crash. Nhưng app lỗi code thì log có exception, còn log này không có dòng nào như thế.
>
> Vậy ai cho container chạy lại? Kubernetes, vì nó hỏi thăm app định kỳ và app không trả lời kịp. Việc hỏi thăm đó gọi
> là liveness probe. Exception là lỗi app tự ném ra khi hỏng, còn liveness probe thất bại là Kubernetes thấy app im
> lặng rồi tự chạy lại container, dù app chưa ném gì.
>
> Container bị chạy lại nhiều lần liền thì Kubernetes chờ lâu dần giữa hai lần, và trong lúc chờ nó ghi trạng thái
> `CrashLoopBackOff`. Trạng thái này chỉ báo container đang bị chạy lại liên tục, không nói lý do.

Mỗi đoạn một thuật ngữ. Kubelet nói bằng lời thường là "Kubernetes", vì người đọc không gặp lại chữ đó. Bài chỉ dùng
"container" cho thứ bị chạy lại. Câu gọi tên liveness probe viết đủ cặp với exception đã nhắc ở đoạn mở, và việc
của exception chỉ có một động từ "ném", không chỗ "ném" chỗ "báo". Việc người dùng hỏi tới (container chạy lại) có câu
nói rõ ai làm.

## 24. Phần cách chỉnh khi người dùng xin "nói qua"

Bối cảnh: tiếp mục 23, bài đã nói chưa đo app cần bao lâu để khởi động xong.

Trước:

> Còn chỉnh thì nói qua: tăng `initialDelaySeconds`, hoặc thêm startup probe với `failureThreshold: 30` và
> `periodSeconds: 10`, rồi chạy `kubectl describe` xem phần Events.

Vấn đề là người dùng xin "nói qua" mà đoạn đưa ba tên trường cấu hình, một tên tính năng mới và một lệnh, tức năm thuật
ngữ trong một câu. "Còn chỉnh thì nói qua" mở chuyện mới, không nắm đoạn trước, và chép lời yêu cầu vào ghi chú; đọc lại
sau thì không rõ ai "nói qua".

Sau:

> Chưa biết app cần bao lâu để khởi động xong nên cũng chưa biết liveness probe phải chờ bao lâu mới bắt đầu hỏi thăm.
> Đo thời gian khởi động thật của app trước, rồi cho liveness probe chờ lâu hơn số đó, hoặc làm app khởi động nhanh hơn.

Đoạn mở bằng chỗ chưa biết của đoạn trước, nói việc cần làm và lý do bằng lời thường. Tên trường cấu hình để khi người
dùng hỏi tiếp.

## 25. Ẩn dụ mở không chủ ngữ, chỗ hết đúng nói ngược bài

Bối cảnh: người dùng đã đặt log của app xoay vòng tối đa 5 GB mà ổ 20 GB vẫn đầy. Đoạn trước vừa kể phần ngoài log
gồm image Docker cũ và journal của hệ thống, và nói chưa đo phần đó lớn bao nhiêu.

Trước:

> Giống tủ lạnh dùng chung: mỗi người chỉ dọn ngăn của mình sao cho ngăn đó tối đa bằng cả tủ. Ngăn chưa đầy mà tủ vẫn
> có thể chật, vì đồ người khác nằm ngoài ngăn. Ví von này hết đúng ở chỗ tủ mở ra là thấy đồ của ai, còn ổ thì chưa
> biết phần ngoài log gồm gì.

Vấn đề là câu mở bằng "Giống" mà không có cái gì giống, dấu hai chấm làm khung. Vế so là một luật không ai làm ngoài đời
(dọn ngăn sao cho bằng cả tủ), nên đọc lần đầu không hiểu. Chỗ hết đúng nói "chưa biết gồm gì" trong khi đoạn trước vừa
kể nó gồm gì, và bỏ qua chỗ người đọc dễ suy sai nhất: đồ người khác trong tủ thì nằm yên một cỡ.

Sau:

> Chuyện của ổ này giống một tủ lạnh dùng chung: mình dọn ngăn của mình đều đặn mà tủ vẫn chật, vì đồ người khác để ở
> ngăn khác. Ví von này hết đúng ở chỗ đồ người khác trong tủ thường để yên một cỡ, còn image Docker và journal có thể
> lớn dần mỗi lần deploy, mà chưa đo nên chưa biết cái nào đang lớn.

Câu mở có chủ ngữ là thứ đang bàn. Vế so là việc người ta làm thật. Chỗ hết đúng nói đúng điều chưa biết (cỡ và xu
hướng), không nói ngược điều bài đã kể.
