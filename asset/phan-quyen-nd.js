/**
 * phan-quyen-nd.js
 */
(function () {
  const MOCK_DATA = [
    { id: 1, user: 'admin', ten: 'Quản trị viên', quyen: 'Administrator' },
    { id: 2, user: 'manager01', ten: 'Nguyễn Văn Quản', quyen: 'Manager' },
    { id: 3, user: 'staff01', ten: 'Trần Thị Nhân', quyen: 'Employee' },
  ];

  let hotInstance = null;

  function initTable() {
    const container = document.getElementById('pqndHotContainer');
    if (!container) return;
    if (hotInstance) hotInstance.destroy();

    hotInstance = new Handsontable(container, {
      data: MOCK_DATA,
      colHeaders: ['ID', 'Tên đăng nhập', 'Họ tên', 'Nhóm quyền'],
      columns: [
        { data: 'id', readOnly: true, width: 50, className: 'htCenter' },
        { data: 'user', width: 150 },
        { data: 'ten', width: 250 },
        { data: 'quyen', width: 200 },
      ],
      stretchH: 'all',
      height: 'auto',
      licenseKey: 'non-commercial-and-evaluation'
    });
    const totalEl = document.getElementById('pqndTotal');
    if (totalEl) totalEl.textContent = `Tổng cộng: ${MOCK_DATA.length}`;
  }

  window.pqndRender = function() {
    const s = document.getElementById('pqndSearch')?.value.toLowerCase() || '';
    const filtered = MOCK_DATA.filter(item => item.user.toLowerCase().includes(s) || item.ten.toLowerCase().includes(s));
    if (hotInstance) {
      hotInstance.loadData(filtered);
      const totalEl = document.getElementById('pqndTotal');
      if (totalEl) totalEl.textContent = `Tổng cộng: ${filtered.length}`;
    }
  };

  (function() {
    const prev = window.onPageActivate;
    window.onPageActivate = function(page) {
      if (prev) prev(page);
      if (page === 'phan-quyen-nd') setTimeout(initTable, 100);
    };
  })();
})();
