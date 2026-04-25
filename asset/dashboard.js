// ── Auth guard: nếu chưa đăng nhập thì về login.html
(function() {
  const user = sessionStorage.getItem('pms_user');
  if (!user) {
    window.location.replace('login.html');
  } else {
    // Hiển thị tên user trên sidebar
    const data = JSON.parse(user);
    const av = document.getElementById('sidebarAvatar');
    const nm = document.getElementById('sidebarName');
    if (av) av.textContent = (data.name || 'AD').substring(0, 2).toUpperCase();
    if (nm) nm.textContent = data.name || 'Admin';
  }
})();

// ── Date
const now = new Date();
document.getElementById('topbarDate').textContent =
  now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// ── Bar chart
const months = ['Th11', 'Th12', 'Th1', 'Th2', 'Th3', 'Th4'];
const vals   = [3.6, 3.8, 3.7, 4.0, 3.9, 4.2];
const max    = Math.max(...vals);
const bc     = document.getElementById('barChart');
months.forEach((m, i) => {
  const h = Math.round((vals[i] / max) * 88);
  bc.innerHTML += `<div class="bar-col">
    <div class="bar ${i===5?'highlight':''}" style="height:${h}px" title="${vals[i]} tỷ"></div>
    <span class="bar-label">${m}</span>
  </div>`;
});

// ── Sidebar navigation
const navItems = document.querySelectorAll('.nav-item');
const pageTitles = {
  dashboard: 'Dashboard', nhanvien: 'Quản lý nhân viên',
  bangluong: 'Bảng lương', chamcong: 'Chấm công',
  'thưởng': 'Thưởng & Phụ cấp', baocao: 'Báo cáo tháng',
  thue: 'Thuế TNCN', caidat: 'Cài đặt',
  'khoi-phong-ban': 'Danh mục khối phòng ban',
  'phong-ban': 'Danh mục phòng ban'
};

navItems.forEach(item => {
  item.addEventListener('click', function() {
    const page = this.dataset.page;
    navItems.forEach(n => n.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.page-section').forEach(s => {
      s.classList.remove('active');
      s.classList.remove('fade-in');
    });
    const target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
      void target.offsetWidth;
      target.classList.add('fade-in');
    }
    document.getElementById('topbarTitle').textContent = pageTitles[page] || page;
  });
});

// ── Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
  sessionStorage.removeItem('pms_user');
  window.location.replace('login.html');
});
