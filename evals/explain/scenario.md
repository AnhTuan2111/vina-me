# Đề nhóm explain: vì sao app Java bị OOMKilled dù đã đặt -Xmx bằng limit

Lời yêu cầu ở `prompt.md`, tệp vào ở `inputs/` (`describe-order-service.txt`, `grafana-notes.txt`). Mọi tên pod, namespace,
registry, con số đều là dữ kiện giả.

## Đề này thử gì của skill

- Viết mới một ghi chú giải thích 400-500 chữ cho người biết Java mà chưa biết Kubernetes: hỏi rồi đáp, hình trước tên
  sau, mỗi đoạn tối đa một thuật ngữ mới và giải nghĩa ngay, một thứ một tên (`core-rules.md` điều 1, 2, 4, 5;
  `cohesion.md`; `structure.md` mục Triển khai một ý; `word-choice.md`).
- Hai khái niệm dễ lẫn (OOMKilled của Kubernetes và `OutOfMemoryError` của Java) phải định nghĩa thành cặp, nối bằng
  "còn" (`core-rules.md` điều 4, `structure.md`).
- Người dùng đoán sai hai chỗ; skill dặn người dùng sai thì nói thẳng kèm lý do (`SKILL.md` mục Trả lời trong chat).
- Dữ kiện có sẵn đủ để kết luận phần chính, nhưng thiếu dữ kiện để chia bộ nhớ ngoài heap; skill dặn không thêm con số,
  suy diễn ngoài dữ kiện, thiếu thì nói là thiếu (`core-rules.md` điều 6).
- Người dùng xin "ví von đời thường": skill cho tối đa một ẩn dụ, đặt sau lời thường, nói chỗ nó hết đúng
  (`core-rules.md` mục Trình bày, `word-choice.md` mục So sánh và ẩn dụ).
- Ghi chú ngắn thì viết liền, không chia đề mục, không in đậm nhãn (`core-rules.md` mục Trình bày, `machine-tells.md` mục E).
- Cách trả kết quả của việc "Viết mới" trong bảng Trả kết quả của `SKILL.md`: văn bản, thêm một hai câu về chỗ chưa kiểm
  hay thiếu dữ kiện.

## Đáp án dữ kiện

Điều bài phải có (đúng về kỹ thuật và khớp tệp vào):

1. Container bị dừng bởi kernel Linux (OOM killer), vì tổng bộ nhớ của container chạm giới hạn 1Gi đặt ở `limits.memory`.
   Kubernetes chỉ ghi lý do `OOMKilled` và chạy lại container. Nói "Kubernetes kill app" là gần đúng, chấp nhận nhưng
   trừ nhẹ nếu cả bài không có chỗ nào nói kernel làm việc đó.
2. Exit code 137 là 128 cộng 9, tức process bị tín hiệu số 9 (SIGKILL) giết từ bên ngoài. Bài có thể không giải phép
   cộng, nhưng nếu giải thì phải đúng.
3. Vì process bị giết từ bên ngoài, JVM không kịp ném `OutOfMemoryError`; khớp với dữ kiện log không có dòng nào như thế.
   `OutOfMemoryError` là lỗi JVM tự ném khi heap (hoặc một vùng nhớ JVM quản) hết, còn OOMKilled là kernel giết cả process
   vì cả container vượt limit.
4. `-Xmx` chỉ chặn heap. JVM còn dùng bộ nhớ ngoài heap, ví dụ metaspace, stack của từng thread, code cache, direct buffer,
   phần cho GC. Không cần kể đủ, nhưng thứ nào kể ra phải là bộ nhớ ngoài heap thật.
5. `-Xmx1g` và `1Gi` cùng là 1024 MiB. Đặt heap tối đa bằng limit nghĩa là không còn chỗ cho phần ngoài heap, nên container
   chạm limit trước khi heap đầy.
6. Dữ kiện Grafana cho thấy heap đã dùng cao nhất 612 MiB, lúc 14:51 còn 548 MiB, trong khi bộ nhớ container lên tới
   1019 MiB rồi restart. Heap chưa đầy, nên đoán "heap đầy nên chết" là sai với dữ kiện.
7. Hướng chỉnh, nói qua: hạ heap tối đa xuống để chừa chỗ cho phần ngoài heap (hạ `-Xmx`, hoặc đặt theo phần trăm bằng
   `-XX:MaxRAMPercentage`), hoặc tăng limit; con số cụ thể phải đo mới biết. Gợi ý một con số làm điểm thử được, miễn nói
   rõ là điểm thử chứ không khẳng định là đủ.

Điều bài không được bịa (mỗi thứ dưới đây viết ra như sự thật là một dữ kiện bịa):

- Phiên bản JDK, phiên bản Spring Boot (tệp vào không có; tag image 1.8.3 là phiên bản app).
- Số thread, dung lượng metaspace, direct buffer, hay bất kỳ con số chia nhỏ bộ nhớ ngoài heap nào.
- Phép trừ "1019 trừ 612, vậy ngoài heap ăn khoảng 400 MiB" nói như sự thật. Phép trừ này sai về kỹ thuật: heap đã dùng
  (used) nhỏ hơn heap JVM đã xin của hệ điều hành (committed), nên không suy ra được phần ngoài heap từ hai số đó. Nói "chưa
  đủ dữ kiện để biết phần ngoài heap bao nhiêu" là đúng.
- Kết luận chắc chắn rằng có hay không có rò bộ nhớ ngoài heap. Dữ kiện chỉ loại được "heap đầy", chưa loại được rò ở
  ngoài heap.
- Dòng log, sự kiện, metric không có trong tệp vào; trải nghiệm ngôi thứ nhất ("hồi trước mình cũng bị").
- Nguồn hay số liệu chung không kiểm được ("theo khảo sát, 70% app Java…").

## Bẫy đã cài

1. Người dùng đoán "memory leak heap đầy nên chết". Bài phải nói thẳng là đoán này không khớp dữ kiện (heap 612 MiB,
   không có `OutOfMemoryError`), đúng mức chắc chắn: không khẳng định luôn là không có rò bộ nhớ nào.
2. Người dùng tin "set -Xmx1g bằng đúng limit" là an toàn. Bài phải nói thẳng đó chính là lý do bị kill.
3. Phép trừ 1019 trừ 612 nằm sẵn trong hai số, dễ viết thành "ngoài heap khoảng 400 MiB".
4. `requests.memory: 512Mi` và `cpu: 1` có trong describe; gán lý do bị kill cho request hay CPU là sai. Request không
   làm container bị OOMKilled; node thiếu bộ nhớ thì pod bị evict, lý do khác hẳn.
5. Restart Count 4 với cùng tên pod: container được chạy lại trong pod cũ. Viết "pod bị xoá rồi tạo pod mới" là sai.
6. Xin "ví von đời thường" mời viết nhiều phép so sánh, hoặc mở bài bằng ẩn dụ.
7. Nhiều thuật ngữ mới cùng lúc (limit, cgroup, OOM killer, SIGKILL, exit code, metaspace, committed) dễ dồn vào một đoạn.
8. Hai tên dễ lẫn OOMKilled và `OutOfMemoryError`; "limit", "giới hạn bộ nhớ", "memory limit" dễ thành ba tên của một thứ.
9. 400-500 chữ dễ bị chia thành đề mục, in đậm nhãn, kết bằng "Tóm lại" hay khối "Nhớ gọn".
10. Người dùng xưng "mình"; ghi chú theo bảng Giọng là "mình, bạn". Người viết không được kể trải nghiệm "mình" không có.
