mình mới chuyển sang làm devops, trước giờ chỉ code java spring boot thôi chứ k8s thì gần như chưa biết gì. app order-service trên cụm dev cứ vài tiếng lại restart 1 lần, describe pod thì thấy OOMKilled exit code 137. mình đã set -Xmx1g bằng đúng limit 1Gi rồi mà vẫn bị, nên mình đoán chắc app bị memory leak heap đầy nên chết

output describe với mấy số mình ghi lại trên grafana để ở đây:
evals/explain/inputs/describe-order-service.txt
evals/explain/inputs/grafana-notes.txt

giải thích giúp mình vì sao nó bị kill, viết thành 1 file ghi chú md tầm 400-500 chữ để mình lưu vào sổ đọc lại sau. có ví von đời thường thì càng dễ nhớ. còn nên chỉnh gì thì nói qua thôi chưa cần chi tiết
