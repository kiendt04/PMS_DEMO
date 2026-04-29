/**
 * phan-quyen-cn.js
 */
(function () {
  const MOCK_DATA = [
    { id: 1, quyen: 'Administrator', chucNang: 'Tất cả chức năng', access: 'Toàn quyền' },
    { id: 2, quyen: 'Manager', chucNang: 'Quản lý chấm công, Quyết toán lương', access: 'Xem/Sửa/Duyệt' },
    { id: 3, quyen: 'Employee', chucNang: 'Xem bảng lương cá nhân', access: 'Chỉ xem' },
  ];

  let hotInstance = null;

  function initTable() {
    const container = document.getElementById('pqcnHotContainer');
    if (!container) return;
    if (hotInstance) hotInstance.destroy();

    hotInstance = new Handsontable(container, {
      data: MOCK_DATA,
      colHeaders: ['ID', 'Nhóm quyền', 'Chức năng được gán', 'Mức độ truy cập'],
      columns: [
        { data: 'id', readOnly: true, width: 50, className: 'htCenter' },
        { data: 'quyen', width: 200 },
        { data: 'chucNang', width: 400 },
        { data: 'access', width: 150 },
      ],
      stretchH: 'all',
      height: 'auto',
      licenseKey: 'non-commercial-and-evaluation'
    });
    const totalEl = document.getElementById('pqcnTotal');
    if (totalEl) totalEl.textContent = `Tổng cộng: ${MOCK_DATA.length}`;
  }

  window.pqcnRender = function() {
    const s = document.getElementById('pqcnSearch')?.value.toLowerCase() || '';
    const filtered = MOCK_DATA.filter(item => item.quyen.toLowerCase().includes(s));
    if (hotInstance) {
      hotInstance.loadData(filtered);
      const totalEl = document.getElementById('pqcnTotal');
      if (totalEl) totalEl.textContent = `Tổng cộng: ${filtered.length}`;
    }
  };

  (function() {
    const prev = window.onPageActivate;
    window.onPageActivate = function(page) {
      if (prev) prev(page);
      if (page === 'phan-quyen-cn') setTimeout(initTable, 100);
    };
  })();
})();
