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
    'dm-chuc-vu': 'Danh mục chức vụ',
    'khoi-phong-ban': 'Danh mục nhóm phòng',
    'phong-ban': 'Danh mục phòng ban',
    'dm-luong-co-ban': 'Danh mục lương cơ bản',
    'dm-he-so-danh-gia': 'Danh mục loại ngày công',
    'dm-phu-tro': 'Danh mục phụ trợ',
    'dm-thoi-gian-lv': 'Danh mục thời gian làm việc',
    'dm-phan-nguon': 'Danh mục phân nguồn',
    'dm-an-ca': 'Danh mục định mức ăn ca',
    'dm-dinh-muc-dt': 'Danh mục định mức điện thoại',
    // Tiện ích
    // Quản lý phòng ban
    'cc-phong-ban': 'Chấm công',
    'danh-gia-hq': 'Đánh giá',
    // Quản lý Chấm công
    'chamcong': 'Quản lý chấm công',
    'nghi-phep': 'Quản lý nghỉ phép',
    'an-toan-dien': 'Quản lý an toàn điện',
    // Tính lương Nhân viên
    'tam-ung-luong': 'Tạm ứng',
    'quyet-toan': 'Quyết toán',
    'luong-hq': 'Chi lương hiệu quả',
    // Tính lương NQL
    'hdtv-chuyen-trach': 'HĐTV chuyên trách',
    'hdtv-khong-chuyen-trach': 'HĐTV không chuyên trách',
    // Tiện ích / Khác
    'dm-nguoi-dung': 'Quản lý nhân sự',
    'quan-ly-an-ca': 'Quản lý ăn ca',
    'he-so-luong': 'Bảng hệ số lương',
    'chi-luong': 'Quản lý chi lương theo tháng',
    // Quản lý hệ thống
    'ql-chuc-nang': 'Quản lý chức năng',
    'ql-quyen': 'Quản lý quyền',
    'phan-quyen-nd': 'Phân quyền người dùng',
    'phan-quyen-cn': 'Phân quyền Quyền - chức năng',
  };

  /* ── Sidebar HTML ── */
  const sidebarHTML = `
<div class="sidebar" id="appSidebar">
  <!-- Internal Toggle Button -->
  <div class="sidebar-toggle-inner" id="sidebarToggleInner" title="Thu gọn/Mở rộng">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </div>

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
      <svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/></svg>
      <span>Dashboard</span>
    </div>

    <!-- DANH MỤC -->
    <div class="nav-group open" id="grp-danhmuc" data-group-name="Danh mục">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-danhmuc')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <span>Danh mục</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="dm-chuc-vu">Danh mục chức vụ</div>
        <div class="nav-item" data-page="dm-phong-ban">Danh mục phòng ban</div>
        <div class="nav-item" data-page="khoi-phong-ban">Danh mục nhóm phòng</div>
        <div class="nav-item" data-page="dm-luong-co-ban">Danh mục lương cơ bản</div>
        <div class="nav-item" data-page="dm-he-so-danh-gia">Danh mục loại ngày công</div>
        <div class="nav-item" data-page="dm-phu-tro">Danh mục phụ trợ</div>
        <div class="nav-item" data-page="dm-thoi-gian-lv">Danh mục thời gian làm việc</div>
        <div class="nav-item" data-page="dm-phan-nguon">Danh mục phân nguồn</div>
        <div class="nav-item" data-page="dm-an-ca">Danh mục định mức ăn ca</div>
        <div class="nav-item" data-page="dm-dinh-muc-dt">Danh mục định mức điện thoại</div>
      </div>
    </div>

    <!-- PHÒNG BAN -->
    <div class="nav-group open" id="grp-phongban" data-group-name="Phòng ban">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-phongban')" data-tooltip="Phòng ban">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span>Phòng ban</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="cc-phong-ban">Chấm công</div>
        <div class="nav-item" data-page="danh-gia-hq">Đánh giá</div>
      </div>
    </div>

    <!-- CHẤM CÔNG -->
    <div class="nav-group" id="grp-chamcong" data-group-name="Chấm công">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-chamcong')" data-tooltip="Chấm công">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Chấm công</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="chamcong">Quản lý chấm công</div>
        <div class="nav-item" data-page="nghi-phep">Quản lý nghỉ phép</div>
        <div class="nav-item" data-page="an-toan-dien">Quản lý an toàn điện</div>
      </div>
    </div>

    <!-- TÍNH LƯƠNG NHÂN VIÊN -->
    <div class="nav-group" id="grp-luongnv" data-group-name="Tính lương Nhân viên">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-luongnv')" data-tooltip="Tính lương Nhân viên">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <span>Tính lương Nhân viên</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="tam-ung-luong">Tạm ứng</div>
        <div class="nav-item" data-page="quyet-toan">Quyết toán</div>
        <div class="nav-item" data-page="luong-hq">Chi lương hiệu quả</div>
      </div>
    </div>

    <!-- TÍNH LƯƠNG NQL -->
    <div class="nav-group" id="grp-luongnql" data-group-name="Tính lương NQL">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-luongnql')" data-tooltip="Tính lương NQL">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
        <span>Tính lương NQL</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="hdtv-chuyen-trach">HĐTV chuyên trách</div>
        <div class="nav-item" data-page="hdtv-khong-chuyen-trach">HĐTV không chuyên trách</div>
      </div>
    </div>

    <!-- TIỆN ÍCH KHÁC -->
    <div class="nav-group" id="grp-tienich" data-group-name="Tiện ích khác">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-tienich')" data-tooltip="Tiện ích khác">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        <span>Tiện ích khác</span>
        <svg class="nav-group-arrow" width="10" height="10" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </div>
      <div class="nav-group-items">
        <div class="nav-item" data-page="dm-nguoi-dung">Quản lý nhân sự</div>
        <div class="nav-item" data-page="quan-ly-an-ca">Quản lý ăn ca</div>
        <div class="nav-item" data-page="he-so-luong">Bảng hệ số lương</div>
        <div class="nav-item" data-page="chi-luong">Quản lý chi lương theo tháng</div>
      </div>
    </div>

    <!-- QUẢN LÝ HỆ THỐNG -->
    <div class="nav-group" id="grp-hethong" data-group-name="Hệ thống">
      <div class="nav-group-hdr" onclick="sidebarToggle('grp-hethong')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        <span>Hệ thống</span>
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

  <!-- Flyout Submenu Container -->
  <div id="sidebarFlyout" class="sidebar-flyout"></div>

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

  /* ── Topbar date & user ── */
  const dateEl = document.getElementById('topbarDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const topName = document.getElementById('topbarUserName');
  const topAvatar = document.getElementById('topbarAvatar');
  if (topName) topName.textContent = _userData.name || 'Admin';
  if (topAvatar) topAvatar.textContent = (_userData.name || 'AD').substring(0, 2).toUpperCase();

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
    // Save state
    sessionStorage.setItem('pms_active_page', page);
  }

  // Initial navigation
  const _savedPage = sessionStorage.getItem('pms_active_page') || 'dashboard';
  setTimeout(() => { navigateTo(_savedPage); }, 100);

  /* ── Accordion toggle ── */
  window.sidebarToggle = function (groupId) {
    const sidebar = document.getElementById('appSidebar');
    const isCollapsed = sidebar && sidebar.classList.contains('collapsed');

    if (isCollapsed) {
      // Show flyout menu if collapsed
      showFlyout(groupId);
    } else {
      // Toggle accordion if expanded
      const grp = document.getElementById(groupId);
      if (grp) grp.classList.toggle('open');
    }
  };

  /* ── Flyout Submenu Logic ── */
  const flyout = document.getElementById('sidebarFlyout');
  function showFlyout(groupId) {
    const grp = document.getElementById(groupId);
    if (!grp || !flyout) return;

    const groupName = grp.getAttribute('data-group-name');
    const items = grp.querySelectorAll('.nav-item');
    const hdr = grp.querySelector('.nav-group-hdr');
    const rect = hdr.getBoundingClientRect();

    let html = `<div class="sidebar-flyout-hdr">${groupName}</div>`;
    items.forEach(item => {
      const page = item.getAttribute('data-page');
      const text = item.textContent;
      const isActive = item.classList.contains('active') ? 'active' : '';
      html += `<div class="flyout-item ${isActive}" onclick="sidebarNavigate('${page}'); hideFlyout();">${text}</div>`;
    });

    flyout.innerHTML = html;
    flyout.style.top = rect.top + 'px';
    flyout.classList.add('active');

    // Close on click outside
    const outsideClick = (e) => {
      if (!flyout.contains(e.target) && !hdr.contains(e.target)) {
        hideFlyout();
        document.removeEventListener('mousedown', outsideClick);
      }
    };
    document.addEventListener('mousedown', outsideClick);
  }

  window.hideFlyout = function () {
    if (flyout) flyout.classList.remove('active');
  };

  /* ── Sidebar show/hide toggle ── */
  function applySidebarState(collapsed) {
    const sidebar = document.getElementById('appSidebar');
    const main = document.querySelector('.main');
    if (collapsed) {
      if (sidebar) sidebar.classList.add('collapsed');
      if (main) main.classList.add('sidebar-collapsed');
    } else {
      if (sidebar) sidebar.classList.remove('collapsed');
      if (main) main.classList.remove('sidebar-collapsed');
    }
  }

  // Restore saved state OR default to collapsed on small screens
  const isSmallScreen = window.innerWidth < 1024;
  const _savedCollapsed = localStorage.getItem('pms_sidebar_collapsed');
  const initialCollapsed = _savedCollapsed !== null ? (_savedCollapsed === 'true') : isSmallScreen;

  applySidebarState(initialCollapsed);

  const toggleBtn = document.getElementById('sidebarToggleInner');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const sidebar = document.getElementById('appSidebar');
      const isCollapsed = sidebar && sidebar.classList.contains('collapsed');
      const nextCollapsed = !isCollapsed;
      applySidebarState(nextCollapsed);
      localStorage.setItem('pms_sidebar_collapsed', nextCollapsed);

      // Close any open flyout
      hideFlyout();

      // Re-render HOT after transition so dimensions update
      setTimeout(function () {
        const active = document.querySelector('.page-section.active');
        if (active) {
          const pageId = active.id.replace('page-', '');
          if (typeof window.onPageActivate === 'function') window.onPageActivate(pageId);
        }
      }, 350);
    });
  }

  /* ── Navigation ── */
  function navigateTo(page) {
    // Update nav active state
    document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
    const activeItems = document.querySelectorAll(`.nav-item[data-page="${page}"]`);
    activeItems.forEach(item => {
      item.classList.add('active');
      // Auto-expand parent group
      const grp = item.closest('.nav-group');
      if (grp && !grp.classList.contains('open')) {
        const sidebar = document.getElementById('appSidebar');
        if (sidebar && !sidebar.classList.contains('collapsed')) {
          grp.classList.add('open');
        }
      }
    });

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

