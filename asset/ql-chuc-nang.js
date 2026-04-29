/**
 * ql-chuc-nang.js
 */
(function () {
  const MOCK_DATA = [
    { id: 1, ten: 'Danh mục chức vụ', ma: 'dm-chuc-vu', moTa: 'Quản lý danh sách chức vụ' },
    { id: 2, ten: 'Quản lý chấm công', ma: 'chamcong', moTa: 'Quản lý bảng chấm công hàng tháng' },
    { id: 3, ten: 'Quyết toán lương', ma: 'quyet-toan', moTa: 'Tính toán và quyết toán lương' },
    { id: 4, ten: 'Quản lý người dùng', ma: 'dm-nguoi-dung', moTa: 'Quản lý tài khoản truy cập' },
  ];

  let hotInstance = null;

  function initTable() {
    const container = document.getElementById('qlcnHotContainer');
    if (!container) return;
    if (hotInstance) hotInstance.destroy();

    hotInstance = new Handsontable(container, {
      data: MOCK_DATA,
      colHeaders: ['ID', 'Tên chức năng', 'Mã chức năng', 'Mô tả'],
      columns: [
        { data: 'id', readOnly: true, width: 50, className: 'htCenter' },
        { data: 'ten', width: 200 },
        { data: 'ma', width: 150 },
        { data: 'moTa', width: 400 },
      ],
      stretchH: 'all',
      height: 'auto',
      licenseKey: 'non-commercial-and-evaluation'
    });
    const totalEl = document.getElementById('qlcnTotal');
    if (totalEl) totalEl.textContent = `Tổng cộng: ${MOCK_DATA.length}`;
  }

  window.qlcnRender = function() {
    const s = document.getElementById('qlcnSearch')?.value.toLowerCase() || '';
    const filtered = MOCK_DATA.filter(item => item.ten.toLowerCase().includes(s) || item.ma.toLowerCase().includes(s));
    if (hotInstance) {
      hotInstance.loadData(filtered);
      const totalEl = document.getElementById('qlcnTotal');
      if (totalEl) totalEl.textContent = `Tổng cộng: ${filtered.length}`;
    }
  };

  (function() {
    const prev = window.onPageActivate;
    window.onPageActivate = function(page) {
      if (prev) prev(page);
      if (page === 'ql-chuc-nang') setTimeout(initTable, 100);
    };
  })();
})();
