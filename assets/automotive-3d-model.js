import * as THREE from './vendor/three-0.160.0.module.js';
import { GLTFLoader } from './vendor/GLTFLoader-0.160.0.module.js';

const root = document.querySelector('[data-car-scene]');
if (!root) throw new Error('Không tìm thấy vùng mô hình 3D.');

const mount = root.querySelector('.car3d__scene');
const panelCount = root.querySelector('[data-panel-count]');
const panelTitle = root.querySelector('[data-panel-title]');
const panelCopy = root.querySelector('[data-panel-copy]');
const panelLink = root.querySelector('[data-panel-link]');
const buttons = [...root.querySelectorAll('[data-surface]')];
const modeButtons = [...root.querySelectorAll('[data-mode]')];
const viewButtons = [...root.querySelectorAll('[data-view]')];
const stationButtons = [...root.querySelectorAll('[data-station]')];
const detailDialog = root.querySelector('[data-detail-dialog]');
const detailImage = root.querySelector('[data-detail-image]');
const detailNumber = root.querySelector('[data-detail-number]');
const detailTitle = root.querySelector('[data-detail-title]');
const detailCopy = root.querySelector('[data-detail-copy]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const content = {
  overview: { count: '01 / 08', title: 'Tổng quan mô hình xe', copy: 'Mô hình xe 3D được dùng để quan sát tổng thể khoang lái và xác định vị trí các bề mặt cần đánh giá trước khi xử lý.', href: '#porsche-references', label: 'Xem ảnh tham chiếu' },
  dashboard: { count: '02 / 05', title: 'Taplo & bảng điều khiển', copy: 'Taplo, hốc gió và cụm điều khiển là các nhóm bề mặt nhựa cần xác định đúng nền trước khi sơn.', href: '../san-pham.html#tab-nhua', label: 'Xem nhóm sơn nhựa' },
  steering: { count: '03 / 05', title: 'Vô lăng', copy: 'Vô lăng là vùng tiếp xúc cao. Kiểm tra độ bạc màu, nếp gấp và độ ổn định của da trước khi phục hồi.', href: '../san-pham.html#tab-da', label: 'Xem nhóm sơn da' },
  door: { count: '04 / 05', title: 'Cánh cửa', copy: 'Tapi cửa có thể gồm nhựa, da và chi tiết kim loại. Cần xử lý theo từng mảng vật liệu.', href: '../san-pham.html#tab-nhua', label: 'Xem nhóm sơn nhựa' },
  seats: { count: '05 / 05', title: 'Ghế da', copy: 'Ghế cần được nhìn theo vùng tựa lưng, mặt ngồi và đường may trước khi phục hồi màu.', href: '../san-pham.html#tab-da', label: 'Xem nhóm sơn da' },
  console: { count: '07 / 08', title: 'Console trung tâm', copy: 'Console gồm nhựa, lớp phủ và chi tiết kim loại; cần xác định từng loại bề mặt trước khi hoàn thiện.', href: '../san-pham.html#tab-nhua', label: 'Xem nhóm sơn nhựa' }
};
const stations = {
  dashboard: { number:'01', title:'Taplo & bảng điều khiển', copy:'Ảnh taplo dùng để nhận biết khu vực nhựa, cụm điều khiển và các chi tiết cần xử lý riêng.', image:'../images/porsche-interior-3d/porsche-02-dashboard.jpg', alt:'Taplo Porsche 718 nội thất tím' },
  steering: { number:'02', title:'Vô lăng', copy:'Kiểm tra bề mặt da, độ bạc màu và các vùng tiếp xúc cao trên vô lăng.', image:'../images/porsche-interior-3d/porsche-03-steering-wheel.jpg', alt:'Vô lăng Porsche 718 bọc da tím' },
  door: { number:'03', title:'Cánh cửa', copy:'Tapi cửa có nhiều vật liệu; ảnh này dùng để phân biệt mảng da, nhựa và tay nắm.', image:'../images/porsche-interior-3d/porsche-06-door-panel.jpg', alt:'Tapi cửa Porsche 718 nội thất tím' },
  seats: { number:'04', title:'Ghế da', copy:'Quan sát phần da ghế, đường may, vùng tựa lưng và vùng mặt ngồi trước khi phục hồi.', image:'../images/porsche-interior-3d/porsche-04-driver-seat.jpg', alt:'Ghế da Porsche 718 màu tím' },
  pillar: { number:'04', title:'Cột nội thất', copy:'Cột và mép viền là các bề mặt nhựa cần được kiểm tra độ bám và tình trạng bề mặt trước khi xử lý.', image:'../images/porsche-interior-3d/porsche-01-cabin-wide.jpg', alt:'Cột nội thất Porsche 718 màu tím' },
  ceiling: { number:'05', title:'Trần xe', copy:'Trần xe cần được xác định riêng vì vật liệu, độ hút sơn và cách xử lý khác các chi tiết nhựa hoặc da.', image:'../images/porsche-interior-3d/porsche-01-cabin-wide.jpg', alt:'Trần nội thất Porsche 718' },
  seats: { number:'06', title:'Ghế da', copy:'Quan sát phần da ghế, đường may, vùng tựa lưng và vùng mặt ngồi trước khi phục hồi.', image:'../images/porsche-interior-3d/porsche-04-driver-seat.jpg', alt:'Ghế da Porsche 718 màu tím' },
  gear: { number:'07', title:'Cần số', copy:'Cần số là cụm có nhiều mảng vật liệu nhỏ. Cần che chắn và thao tác theo từng chi tiết.', image:'../images/porsche-interior-3d/porsche-05-center-console.jpg', alt:'Cần số và console Porsche 718' },
  handle: { number:'08', title:'Tay nắm cửa', copy:'Tay nắm cửa cần xác định vật liệu nền trước khi làm sạch, tạo bám và hoàn thiện màu.', image:'../images/porsche-interior-3d/porsche-06-door-panel.jpg', alt:'Tay nắm cửa Porsche 718' }
};

try {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = false;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x090d13, 12, 34);
  const camera = new THREE.PerspectiveCamera(31, 1, .1, 100);
  const focus = new THREE.Vector3(1.4, .35, 0);
  let distance = 11.2, yaw = -.56, pitch = .08, dragging = false, lastX = 0, lastY = 0;
  const modelRoot = new THREE.Group(); scene.add(modelRoot);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 96), new THREE.MeshStandardMaterial({ color: 0x111821, metalness: .5, roughness: .35 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.18; floor.receiveShadow = true; scene.add(floor);
  scene.add(new THREE.HemisphereLight(0xdbe4f2, 0x111119, 2.1));
  const key = new THREE.DirectionalLight(0xffe8de, 5.1); key.position.set(-6, 8, 5); key.castShadow = true; key.shadow.mapSize.set(1024,1024); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9cb8ff, 3.6); rim.position.set(8, 4, -4); scene.add(rim);
  const violet = new THREE.PointLight(0x7f2da1, 14, 14, 2); violet.position.set(1, 2, -4); scene.add(violet);
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  let car, originalMaterials = new Map();

  const updatePanel = surface => {
    const cfg = content[surface];
    panelCount.textContent = cfg.count; panelTitle.textContent = cfg.title; panelCopy.textContent = cfg.copy;
    panelLink.href = cfg.href; panelLink.firstChild.textContent = `${cfg.label} `;
    buttons.forEach(button => button.classList.toggle('is-active', button.dataset.surface === surface));
    if (!car) return;
    car.traverse(object => {
      if (!object.isMesh) return;
      const material = object.material;
      if (!originalMaterials.has(object.uuid)) originalMaterials.set(object.uuid, material);
      if (surface === 'overview') { object.material = originalMaterials.get(object.uuid); return; }
      const name = `${object.name} ${object.parent?.name || ''}`.toLowerCase();
      const matched = (surface === 'dashboard' && /dash|screen|console|interior/.test(name)) ||
        (surface === 'steering' && /steer|wheel/.test(name)) ||
        (surface === 'door' && /door/.test(name)) ||
        (surface === 'seats' && /seat|chair/.test(name));
      if (matched) {
        const clone = originalMaterials.get(object.uuid).clone();
        if ('emissive' in clone) { clone.emissive.setHex(0x7d2c98); clone.emissiveIntensity = .32; }
        object.material = clone;
      } else object.material = originalMaterials.get(object.uuid);
    });
  };
  const render = () => {
    const spherical = new THREE.Spherical(distance, Math.PI / 2 - pitch, yaw);
    camera.position.copy(focus).add(new THREE.Vector3().setFromSpherical(spherical));
    camera.lookAt(focus); renderer.render(scene, camera);
  };
  const resize = () => { const { width, height } = mount.getBoundingClientRect(); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); render(); };
  const loader = new GLTFLoader();
  loader.load('../images/3d/car-concept.glb', gltf => {
    car = gltf.scene;
    car.traverse(object => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
    const bounds = new THREE.Box3().setFromObject(car);
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 6.9 / Math.max(size.x, size.z);
    car.scale.setScalar(scale);
    bounds.setFromObject(car);
    const center = bounds.getCenter(new THREE.Vector3());
    car.position.sub(center); car.position.x = 1.9; car.position.y = -1.08;
    car.rotation.y = -.2;
    modelRoot.add(car); updatePanel('overview'); render();
  }, undefined, error => { console.error(error); root.dataset.fallback = 'true'; });

  mount.addEventListener('pointerdown', event => { dragging = true; lastX = event.clientX; lastY = event.clientY; mount.setPointerCapture(event.pointerId); });
  mount.addEventListener('pointermove', event => { if (!dragging) return; yaw -= (event.clientX-lastX)*.007; pitch = THREE.MathUtils.clamp(pitch+(event.clientY-lastY)*.005, -.45, .42); lastX=event.clientX; lastY=event.clientY; render(); });
  mount.addEventListener('pointerup', event => { dragging=false; mount.releasePointerCapture(event.pointerId); pointer.x=((event.clientX-mount.getBoundingClientRect().left)/mount.clientWidth)*2-1; pointer.y=-((event.clientY-mount.getBoundingClientRect().top)/mount.clientHeight)*2+1; raycaster.setFromCamera(pointer,camera); const hit=car && raycaster.intersectObject(car,true)[0]; if(hit) updatePanel('overview'); });
  mount.addEventListener('wheel', event => { event.preventDefault(); distance=THREE.MathUtils.clamp(distance+event.deltaY*.008,7.5,16); render(); },{passive:false});
  const setMode = mode => {
    const stationsMode = mode === 'stations';
    root.classList.toggle('is-stations', stationsMode);
    modeButtons.forEach(button => button.classList.toggle('is-active', button.dataset.mode === mode));
    if (!stationsMode) { distance=11.2; yaw=-.56; pitch=.08; render(); }
  };
  const setView = view => {
    if (!root.classList.contains('is-stations')) setMode('stations');
    root.dataset.interiorView = view;
    viewButtons.forEach(button => button.classList.toggle('is-active', button.dataset.view === view));
  };
  const openStation = key => {
    const item = stations[key]; if (!item) return;
    detailNumber.textContent = item.number; detailTitle.textContent = item.title; detailCopy.textContent = item.copy;
    detailImage.src = item.image; detailImage.alt = item.alt;
    detailDialog.showModal();
  };
  modeButtons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
  viewButtons.forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
  detailDialog.querySelector('[data-close-detail]').addEventListener('click', () => detailDialog.close());
  detailDialog.addEventListener('click', event => { if (event.target === detailDialog) detailDialog.close(); });
  buttons.forEach(button => button.addEventListener('click', () => updatePanel(button.dataset.surface)));
  root.querySelector('[data-reset]')?.addEventListener('click', () => { setMode('assembled'); distance=11.2; yaw=-.56; pitch=.08; render(); });
  new ResizeObserver(resize).observe(mount); resize();
  render();
} catch (error) { console.error(error); root.dataset.fallback='true'; }
