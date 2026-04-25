/**
 * sidebar.js — Shared layout module
 * Include on any page that needs the sidebar.
 * Requires: <div id="sidebar-mount"></div> and <div id="topbarTitle">, etc.
 */
(function () {

  /* ── Auth guard ── */
  const _user = sessionStorage.getItem('pms_user');
  if (!_user) { window.location.replace('login.html'); return; }
  const _userData = JSON.parse(_user);

  /* ── Page titles ── */
  const PAGE_TITLES = {
    dashboard: 'Dashboard',
    // Danh mục
    'dm-chuc-vu':        'Danh mục chức vụ',
    'khoi-phong-ban':    'Danh mục nhóm phòng',
    'phong-ban':         'Danh mục phòng ban',
    'dm-luong-co-ban':   'Danh mục lương cơ bản',
    'dm-he-so-danh-gia': 'Danh mục hệ số đánh giá',
    'dm-phu-tro':        'Danh mục phụ trợ',
    'dm-thoi-gian-lv':   'Danh mục thời gian làm việc',
    'dm-phan-nguon':     'Danh mục phân nguồn',
    'dm-an-ca':          'Danh mục định mức ăn ca',
    'dm-nguoi-dung':     'Danh mục người dùng',
    // Tiện ích
    chamcong:            'Quản lý chấm công',
    'an-toan-dien':      'Quản lý an toàn điện',
    'tam-ung-luong':     'Quản lý tạm ứng lương',
    'dieu-chuyen':       'Quản lý điều chuyển',
    'nghi-phep':         'Quản lý nghỉ phép',
    'quan-ly-an-ca':     'Quản lý ăn ca',
    'he-so-luong':       'Bảng hệ số lương',
    'quyet-toan':        'Quyết toán lương',
    'chi-luong':         'Quản lý chi lương theo tháng',
    // Quản lý phòng ban
    'cc-phong-ban':      'Chấm công phòng ban',
    'danh-gia-hq':       'Đánh giá hiệu quả công việc',
    'luong-hq':          'Lương hiệu quả - phòng ban',
    // Quản lý hệ thống
    'ql-chuc-nang':      'Quản lý chức năng',
    'ql-quyen':          'Quản lý quyền',
    'phan-quyen-nd':     'Phân quyền người dùng',
    'phan-quyen-cn':     'Phân quyền Quyền - chức năng',
  };

  /* ── Sidebar HTML ── */
  const sidebarHTML = `
<div class="sidebar">
  <div class="sidebar-logo">
    <div class="sidebar-logo-icon">
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="3" y="5" width="14" height="11" rx="2" stroke="white" stroke-width="1.5"/>
        <path d="M7 5V4a3 3 0 0 1 6 0v1" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="10" cy="11" r="1.5" fill="white"/>
        <path d="M10 12.5v1.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    <div>
      <div class="sidebar-logo-name">PayrollPro</div>
      <div class="sidebar-logo-tagline">Quản lý lương</div>
    </div>
  </div>

  <div class="sidebar-nav">

    <!-- Dashboard -->
    <div class="nav-item active" data-page="dashboard">
      <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/></svg>
      Dashboard
    </div>

    <!-- DANH MỤC -->
    <div class="nav-group open" id="grp-danhmuc">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-danhmuc')">
        <div class="nav-group-ico" style="background:#E6FAF5;color:#1A9E78;width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="1" y="8" width="5" height="3" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="8" y="8" width="5" height="3" rx="1" stroke="currentColor" stroke-width="1.3"/></svg>
        </div>
        <span>Danh mục</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="dm-chuc-vu">Danh mục chức vụ</div>
        <div class="nav-item" data-page="dm-phong-ban">Danh mục phòng ban</div>
        <div class="nav-item" data-page="khoi-phong-ban">Danh mục nhóm phòng</div>
        <div class="nav-item" data-page="dm-luong-co-ban">Danh mục lương cơ bản</div>
        <div class="nav-item" data-page="dm-he-so-danh-gia">Danh mục hệ số đánh giá</div>
        <div class="nav-item" data-page="dm-phu-tro">Danh mục phụ trợ</div>
        <div class="nav-item" data-page="dm-thoi-gian-lv">Danh mục thời gian làm việc</div>
        <div class="nav-item" data-page="dm-phan-nguon">Danh mục phân nguồn</div>
        <div class="nav-item" data-page="dm-an-ca">Danh mục định mức ăn ca</div>
        <div class="nav-item" data-page="dm-nguoi-dung">Danh mục người dùng</div>
      </div>
    </div>

    <!-- TIỆN ÍCH -->
    <div class="nav-group" id="grp-tienich">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-tienich')">
        <div class="nav-group-ico" style="background:#EBF4FF;color:#185FA5;width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span>Tiện ích</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="chamcong">Quản lý chấm công</div>
        <div class="nav-item" data-page="an-toan-dien">Quản lý an toàn điện</div>
        <div class="nav-item" data-page="tam-ung-luong">Quản lý tạm ứng lương</div>
        <div class="nav-item" data-page="dieu-chuyen">Quản lý điều chuyển</div>
        <div class="nav-item" data-page="nghi-phep">Quản lý nghỉ phép</div>
        <div class="nav-item" data-page="quan-ly-an-ca">Quản lý ăn ca</div>
        <div class="nav-item" data-page="he-so-luong">Bảng hệ số lương</div>
        <div class="nav-item" data-page="quyet-toan">Quyết toán lương</div>
        <div class="nav-item" data-page="chi-luong">Quản lý chi lương theo tháng</div>
      </div>
    </div>

    <!-- QUẢN LÝ PHÒNG BAN -->
    <div class="nav-group" id="grp-qlpb">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-qlpb')">
        <div class="nav-group-ico" style="background:#EBF4FF;color:#185FA5;width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span>Quản lý phòng ban</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="cc-phong-ban">Chấm công phòng ban</div>
        <div class="nav-item" data-page="danh-gia-hq">Đánh giá hiệu quả công việc</div>
        <div class="nav-item" data-page="luong-hq">Lương hiệu quả công việc</div>
      </div>
    </div>

    <!-- QUẢN LÝ HỆ THỐNG -->
    <div class="nav-group" id="grp-hethong">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-hethong')">
        <div class="nav-group-ico" style="background:#FEF3E2;color:#B45309;width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.76 2.76l1.41 1.41M9.83 9.83l1.41 1.41M2.76 11.24l1.41-1.41M9.83 4.17l1.41-1.41" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        </div>
        <span>Quản lý hệ thống</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="ql-chuc-nang">Quản lý chức năng</div>
        <div class="nav-item" data-page="ql-quyen">Quản lý quyền</div>
        <div class="nav-item" data-page="phan-quyen-nd">Phân quyền người dùng</div>
        <div class="nav-item" data-page="phan-quyen-cn">Phân quyền Quyền - chức năng</div>
      </div>
    </div>

  </div><!-- /sidebar-nav -->

  <div class="sidebar-bottom">
    <div class="user-row">
      <div class="user-avatar" id="sidebarAvatar">AD</div>
      <div>
        <div class="user-name" id="sidebarName">Admin</div>
        <div class="user-role">Quản trị viên</div>
      </div>
      <button class="btn-logout" id="logoutBtn" title="Đăng xuất">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</div>`;

  /* ── Mount sidebar ── */
  const mount = document.getElementById('sidebar-mount');
  if (mount) mount.innerHTML = sidebarHTML;

  /* ── Set user info ── */
  const av = document.getElementById('sidebarAvatar');
  const nm = document.getElementById('sidebarName');
  if (av) av.textContent = (_userData.name || 'AD').substring(0, 2).toUpperCase();
  if (nm) nm.textContent = _userData.name || 'Admin';

  /* ── Topbar date ── */
  const dateEl = document.getElementById('topbarDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  /* ── Navigation ── */
  function navigateTo(page) {
    // Update nav active state
    document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
    const activeItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
      // Auto-expand parent group
      const grp = activeItem.closest('.nav-group');
      if (grp && !grp.classList.contains('open')) {
        grp.classList.add('open');
      }
    }

    // Switch page section
    document.querySelectorAll('.page-section').forEach(s => {
      s.classList.remove('active', 'fade-in');
    });
    const target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
      void target.offsetWidth; // reflow for animation
      target.classList.add('fade-in');
    }

    // Update topbar title
    const titleEl = document.getElementById('topbarTitle');
    if (titleEl) titleEl.textContent = PAGE_TITLES[page] || page;

    // Trigger page-specific init
    if (typeof window.onPageActivate === 'function') {
      window.onPageActivate(page);
    }
  }

  // Attach click listeners after DOM ready
  function attachNavListeners() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', function () {
        navigateTo(this.dataset.page);
      });
    });
  }
  attachNavListeners();

  /* ── Accordion toggle ── */
  window.sidebarToggle = function (groupId) {
    const grp = document.getElementById(groupId);
    if (grp) grp.classList.toggle('open');
  };

  /* ── Logout ── */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('pms_user');
      window.location.replace('login.html');
    });
  }

  /* ── Expose navigateTo globally ── */
  window.sidebarNavigate = navigateTo;

})();
