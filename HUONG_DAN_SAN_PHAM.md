# Trang sản phẩm AOYATE trong website D.KARE

## Cấu trúc

- `san-pham/aoyate/*.html`: 28 trang chi tiết, giữ mã nguồn của hãng.
- `assets/data/aoyate-products.json`: nội dung từng sản phẩm, phân ngành, ảnh, video, FAQ và thông số.
- `assets/data/aoyate-media-manifest.json`: danh sách ảnh/video, tên nguồn và mã kiểm tra nguyên vẹn.
- `images/products/aoyate/<slug>/`: ảnh thật từ hồ sơ, tên file tương đối và không có dấu.
- `videos/products/`: video MP4, tên file theo mã nội dung; các file giống nhau dùng một bản.
- `documents/aoyate/`: catalog tham khảo tải được.
- `assets/product-detail.css`, `assets/product-detail.js`: giao diện và tương tác chung của 8 phần nội dung.
- `tools/build-product-pages.py`: tạo lại các trang HTML từ JSON, không cần dữ liệu ở máy gốc.
- `tools/validate-product-assets.py`: kiểm tra đường dẫn và nguyên vẹn tài nguyên.

## Cập nhật

Sửa nội dung trong JSON, giữ `id` để không sinh hồ sơ trùng. `code` là mã hiển thị, có thể đổi sau. `industries` chứa nhiều ngành khi có căn cứ; A+B 2009D có cả `automotive_leather` và `other_leather`. Các ứng dụng còn chờ xác nhận nằm trong `candidate_industries`.

Chạy `python tools/build-product-pages.py` để tạo lại trang chi tiết. Công cụ không tải nguồn ngoài, không thay ảnh/video. Sau khi sửa ngành hoặc cần cập nhật trang danh mục, cập nhật các thẻ tương ứng trong `san-pham.html` cùng đường dẫn sản phẩm; không tạo bản sao trang chi tiết cho mỗi ngành. Chạy `python tools/validate-product-assets.py` trước khi đưa lên GitHub.

Tất cả trang AOYATE mới đang `noindex, follow` trong lúc duyệt nội dung. Công cụ giữ trạng thái này; khi duyệt để xuất bản, chỉnh quy tắc robots của công cụ, tạo lại trang và bổ sung URL được duyệt vào sitemap. Không tự thêm Offer, giá bán, tồn kho, đánh giá hoặc chứng nhận vào schema nếu chưa có dữ liệu thật.

## Đưa lên GitHub / GitHub Pages

Đưa lên **toàn bộ thư mục website**, gồm `assets`, `images`, `videos`, `documents`, `san-pham` và `.nojekyll`. Chỉ đưa file HTML sẽ thiếu tài nguyên. Cấu hình GitHub Pages trỏ đúng thư mục chứa `index.html`; nếu repo chứa trực tiếp nội dung `dkare-website`, dùng nhánh triển khai với nguồn `/ (root)`.

Ảnh/video của các trang mới nằm trong repo, đường dẫn tương đối, hoạt động cả khi website ở đường dẫn con của GitHub Pages. Không phụ thuộc đường dẫn ổ C hoặc liên kết ảnh của 1688. Video lớn nhất trong lô mới khoảng 23,4 MB, dưới ngưỡng file 100 MiB của Git thông thường. Tổng video vẫn làm repo nặng hơn; có thể chuyển sang dịch vụ video sau khi có kênh chính thức. Không cần Git LFS cho lô tài nguyên hiện tại.

Không đưa `.codex`, `.agents`, tệp riêng của máy hoặc dữ liệu backend vào thao tác thêm file diện rộng. Repo có nhiều thay đổi từ trước; kiểm tra các file định đưa lên trước khi commit. Công việc này chưa commit, push hay xuất bản.

## Những phần đang chờ

- Sáu hồ sơ có danh tính/phối hệ cần đối chiếu: hai 506D, 509G/705K gốc dầu, 802C, 1203/017F–025F và 2008D. Các trang có thể xem trực tiếp nhưng chưa được đưa vào thẻ danh mục công khai của lô này.
- Trang nguồn 256354 là tập hợp mẫu, chưa tạo như một sản phẩm bán lẻ.
- Video `thuốc mở sửa chữa.mp4` chưa gắn sản phẩm vì tên không xác định mã; bản file đã được lưu cùng manifest.
- Ba file 003T, 1209D và 017F–025F có cùng nội dung; dùng một video chung với ghi chú cần đối chiếu mã.
- Chưa có TDS/SDS khớp từng mã để tải. Catalog có nút tải riêng, ghi rõ nguồn tham khảo.
- Chưa có bộ ảnh thử nghiệm riêng của D.KARE. Ảnh hãng giữ nhãn tư liệu nhà cung cấp.
- Form soạn yêu cầu trên thiết bị, có validation, tự gắn mã. Khách chọn mở email để gửi hoặc sao chép nội dung. Chưa kết nối form này với backend và không hiển thị thành công giả.

## Phần DN-1

Giữ nguyên markup của breadcrumb, gallery, tên, mô tả và CTA phía trên. Thêm 8 section bên dưới theo dữ liệu hiện có; không tự xác nhận từng loại nhựa. Chỉnh xử lý pointer của gallery để nút mũi tên không bị lớp chứa ảnh chặn thao tác. Không thay bố cục hay hình ảnh DN-1.
