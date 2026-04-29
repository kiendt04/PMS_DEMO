/**
 * ql-quyen.js
 */
(function () {
  const MOCK_DATA = [
    { id: 1, ten: 'Administrator', ma: 'ADMIN', moTa: 'Toàn quyền hệ thống' },
    { id: 2, ten: 'Manager', ma: 'MANAGER', moTa: 'Quản lý phòng ban' },
    { id: 3, ten: 'Employee', ma: 'EMPLOYEE', moTa: 'Nhân viên xem thông tin cá nhân' },
  ];

  let hotInstance = null;

  function initTable() {
    const container = document.getElementById('qlqHotContainer');
    if (!container) return;
    if (hotInstance) hotInstance.destroy();

    hotInstance = new Handsontable(container, {
      data: MOCK_DATA,
      colHeaders: ['ID', 'Tên nhóm quyền', 'Mã quyền', 'Mô tả'],
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
    const totalEl = document.getElementById('qlqTotal');
    if (totalEl) totalEl.textContent = `Tổng cộng: ${MOCK_DATA.length}`;
  }

  window.qlqRender = function() {
    const s = document.getElementById('qlqSearch')?.value.toLowerCase() || '';
    const filtered = MOCK_DATA.filter(item => item.ten.toLowerCase().includes(s) || item.ma.toLowerCase().includes(s));
    if (hotInstance) {
      hotInstance.loadData(filtered);
      const totalEl = document.getElementById('qlqTotal');
      if (totalEl) totalEl.textContent = `Tổng cộng: ${filtered.length}`;
    }
  };

  (function() {
    const prev = window.onPageActivate;
    window.onPageActivate = function(page) {
      if (prev) prev(page);
      if (page === 'ql-quyen') setTimeout(initTable, 100);
    };
  })();
})();
