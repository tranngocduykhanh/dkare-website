document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-car-scene]');
  const dialog = root?.querySelector('[data-detail-dialog]');
  const stage = root?.querySelector('.car3d__detail-stage');
  if (!root || !dialog || !stage) return;
  const image = dialog.querySelector('[data-detail-image]');
  const number = dialog.querySelector('[data-detail-number]');
  const title = dialog.querySelector('[data-detail-title]');
  const copy = dialog.querySelector('[data-detail-copy]');
  const stageImage = stage.querySelector('[data-stage-image]');
  const stageNumber = stage.querySelector('[data-stage-number]');
  const stageTitle = stage.querySelector('[data-stage-title]');
  const stageCopy = stage.querySelector('[data-stage-copy]');
  const parts = {
    dashboard:['01','Taplo & bảng điều khiển','Ảnh taplo dùng để nhận biết khu vực nhựa, cụm điều khiển và các chi tiết cần xử lý riêng.','../images/porsche-interior-3d/porsche-02-dashboard.jpg','Taplo Porsche 718 nội thất tím'],
    steering:['02','Vô lăng','Kiểm tra bề mặt da, độ bạc màu và các vùng tiếp xúc cao trên vô lăng.','../images/porsche-interior-3d/porsche-03-steering-wheel.jpg','Vô lăng Porsche 718 bọc da tím'],
    door:['03','Cửa','Tapi cửa có nhiều vật liệu; ảnh này dùng để phân biệt mảng da, nhựa và tay nắm.','../images/porsche-interior-3d/porsche-06-door-panel.jpg','Tapi cửa Porsche 718 nội thất tím'],
    pillar:['04','Cột nội thất','Cột và mép viền là các bề mặt nhựa cần được kiểm tra độ bám trước khi xử lý.','../images/porsche-interior-3d/porsche-01-cabin-wide.jpg','Cột nội thất Porsche 718 màu tím'],
    ceiling:['05','Trần xe','Trần xe cần được xác định riêng vì vật liệu và cách xử lý khác các chi tiết nhựa hoặc da.','../images/porsche-interior-3d/porsche-01-cabin-wide.jpg','Trần nội thất Porsche 718'],
    seats:['06','Ghế da','Quan sát da ghế, đường may, vùng tựa lưng và mặt ngồi trước khi phục hồi.','../images/porsche-interior-3d/porsche-04-driver-seat.jpg','Ghế da Porsche 718 màu tím'],
    gear:['07','Cần số','Cần số có nhiều mảng vật liệu nhỏ; cần thao tác theo từng chi tiết.','../images/porsche-interior-3d/porsche-05-center-console.jpg','Cần số và console Porsche 718'],
    handle:['08','Tay nắm cửa','Tay nắm cửa cần được xác định vật liệu nền trước khi làm sạch và hoàn thiện màu.','../images/porsche-interior-3d/porsche-06-door-panel.jpg','Tay nắm cửa Porsche 718']
  };
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-station]');
    const item = parts[button?.dataset.station];
    if (!item) return;
    number.textContent=item[0]; title.textContent=item[1]; copy.textContent=item[2]; image.src=item[3]; image.alt=item[4];
    stageNumber.textContent=`${item[0]} / 08`; stageTitle.textContent=item[1]; stageCopy.textContent=item[2]; stageImage.src=item[3]; stageImage.alt=item[4];
    root.querySelectorAll('.car3d__controls--parts [data-station]').forEach(control => control.classList.toggle('is-active', control.dataset.station === button.dataset.station));
    root.classList.add('is-detail');
  });
  stage.querySelector('[data-close-stage]').addEventListener('click', () => { root.classList.remove('is-detail'); root.querySelectorAll('.car3d__controls--parts [data-station]').forEach(control => control.classList.remove('is-active')); });
  dialog.querySelector('[data-close-detail]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
});
