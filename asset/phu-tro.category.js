/**
 * phu-tro.category.js
 * Quản lý danh mục phụ trợ
 */
(function () {
  const MOCK_DATA = [
    { id: 1, ten: 'Phụ cấp độc hại', giaTri: 500000, moTa: 'Dành cho nhân viên làm việc trong môi trường độc hại', ngayHL: '2024-01-01' },
    { id: 2, ten: 'Phụ cấp đi lại', giaTri: 300000, moTa: 'Hỗ trợ chi phí xăng xe', ngayHL: '2024-01-01' },
    { id: 3, ten: 'Phụ cấp điện thoại', giaTri: 200000, moTa: 'Hỗ trợ cước liên lạc', ngayHL: '2024-01-01' },
    { id: 4, ten: 'Thưởng chuyên cần', giaTri: 500000, moTa: 'Dành cho nhân viên đi làm đầy đủ', ngayHL: '2024-01-01' },
  ];

  let hotInstance = null;

  function initTable() {
    const container = document.getElementById('ptHotContainer');
    if (!container) return;

    if (hotInstance) {
      hotInstance.destroy();
    }

    hotInstance = new Handsontable(container, {
      data: MOCK_DATA,
      colHeaders: ['ID', 'Tên phụ trợ', 'Giá trị (VNĐ)', 'Ngày hiệu lực', 'Mô tả'],
      columns: [
        { data: 'id', readOnly: true, width: 50, className: 'htCenter' },
        { data: 'ten', width: 200 },
        { data: 'giaTri', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 120 },
        { data: 'ngayHL', type: 'date', dateFormat: 'YYYY-MM-DD', width: 120, className: 'htCenter' },
        { data: 'moTa', width: 300 },
      ],
      stretchH: 'all',
      height: 'auto',
      autoWrapRow: true,
      autoWrapCol: true,
      licenseKey: 'non-commercial-and-evaluation'
    });

    const totalEl = document.getElementById('ptTotal');
    if (totalEl) totalEl.textContent = `Tổng cộng: ${MOCK_DATA.length}`;
  }

  window.ptRender = function() {
    const searchVal = document.getElementById('ptSearch')?.value.toLowerCase() || '';
    const filtered = MOCK_DATA.filter(item => 
      item.ten.toLowerCase().includes(searchVal) || 
      item.moTa.toLowerCase().includes(searchVal)
    );
    if (hotInstance) {
      hotInstance.loadData(filtered);
      const totalEl = document.getElementById('ptTotal');
      if (totalEl) totalEl.textContent = `Tổng cộng: ${filtered.length}`;
    }
  };

  // Listen for page activation
  window.addEventListener('load', () => {
    if (window.onPageActivate) {
      const oldActivate = window.onPageActivate;
      window.onPageActivate = function (page) {
        oldActivate(page);
        if (page === 'dm-phu-tro') {
          setTimeout(initTable, 100);
        }
      };
    } else {
      window.onPageActivate = function (page) {
        if (page === 'dm-phu-tro') {
          setTimeout(initTable, 100);
        }
      };
    }
  });

})();
