sửa giúp mình bản kiến nghị này với, mình định gửi anh Quang (lead) chiều nay. muốn bản sửa chặt chẽ hơn, đọc ra dáng kiến nghị chứ đừng như chat. dữ kiện mình để hết trong bài rồi, đừng thêm gì nha

Kiến nghị chuyển CI của repo shop-web từ Jenkins sang GitLab CI

Trong kỷ nguyên số, GitLab CI là giải pháp đột phá, mang tính cách mạng cho mọi đội phát triển. Em đề xuất chuyển pipeline của repo shop-web từ Jenkins sang GitLab CI trong tháng 12.

Nói chung là Jenkins hiện tại kiểu như là hơi cũ rồi anh ạ. Từ 01/11 tới 25/11, pipeline shop-web chạy 214 lần, có 9 lần hỏng vì plugin Git của Jenkins bị treo, lần nào em cũng phải vào máy jenkins-01 restart Jenkins bằng tay. Jenkins lúc nào cũng lỗi, nên đội mất rất nhiều thời gian.

Lý do chính để chuyển là GitLab CI dễ học hơn, bạn mới vào đọc file .gitlab-ci.yml là hiểu ngay. Google, Netflix và rất nhiều công ty lớn đều dùng GitLab CI nên chắc chắn nó phù hợp với mình. Em đọc trên một blog thấy GitLab CI chạy nhanh hơn Jenkins gấp 3 lần.

Jenkins trên máy jenkins-01 đang chạy ổn định, chưa phải restart lần nào trong tháng 11, vì vậy cần chuyển sớm. GitLab runner không cần thêm máy, chạy luôn trên jenkins-01. Chuyển xong thì mình sẽ cần thêm một máy runner 8 GB RAM.

Ngoài ra, em nghĩ mình nên bỏ luôn bước chạy test tích hợp trong pipeline để pipeline nhanh hơn.

Hãy cùng nhau hành động để đội mình bắt kịp xu thế! Rất mong anh quan tâm.

Nam
