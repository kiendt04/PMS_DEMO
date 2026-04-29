/**
 * dinh-muc-dt.category.js
 * Quản lý danh mục định mức điện thoại
 */
(function () {
  const MOCK_DATA = [
    { id: 1, ten: 'Định mức Ban Giám đốc', giaTri: 500000, doiTuong: 'Ban Giám đốc', ngayHL: '2024-01-01' },
    { id: 2, ten: 'Định mức Trưởng phòng', giaTri: 300000, doiTuong: 'Trưởng phòng', ngayHL: '2024-01-01' },
    { id: 3, ten: 'Định mức Phó phòng', giaTri: 200000, doiTuong: 'Phó phòng', ngayHL: '2024-01-01' },
    { id: 4, ten: 'Định mức Nhân viên KD', giaTri: 150000, doiTuong: 'Nhân viên Kinh doanh', ngayHL: '2024-01-01' },
  ];

  let hotInstance = null;

  function initTable() {
    const container = document.getElementById('dmdtHotContainer');
    if (!container) return;

    if (hotInstance) {
      hotInstance.destroy();
    }

    hotInstance = new Handsontable(container, {
      data: MOCK_DATA,
      colHeaders: ['ID', 'Tên định mức', 'Giá trị (VNĐ)', 'Đối tượng áp dụng', 'Ngày hiệu lực'],
      columns: [
        { data: 'id', readOnly: true, width: 50, className: 'htCenter' },
        { data: 'ten', width: 200 },
        { data: 'giaTri', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 120 },
        { data: 'doiTuong', width: 200 },
        { data: 'ngayHL', type: 'date', dateFormat: 'YYYY-MM-DD', width: 120, className: 'htCenter' },
      ],
      stretchH: 'all',
      height: 'auto',
      autoWrapRow: true,
      autoWrapCol: true,
      licenseKey: 'non-commercial-and-evaluation'
    });

    const totalEl = document.getElementById('dmdtTotal');
    if (totalEl) totalEl.textContent = `Tổng cộng: ${MOCK_DATA.length}`;
  }

  window.dmdtRender = function() {
    const searchVal = document.getElementById('dmdtSearch')?.value.toLowerCase() || '';
    const filtered = MOCK_DATA.filter(item => 
      item.ten.toLowerCase().includes(searchVal) || 
      item.doiTuong.toLowerCase().includes(searchVal)
    );
    if (hotInstance) {
      hotInstance.loadData(filtered);
      const totalEl = document.getElementById('dmdtTotal');
      if (totalEl) totalEl.textContent = `Tổng cộng: ${filtered.length}`;
    }
  };

  // Listen for page activation
  (function() {
    const prevOnPageActivate = window.onPageActivate;
    window.onPageActivate = function(page) {
      if (prevOnPageActivate) prevOnPageActivate(page);
      if (page === 'dm-dinh-muc-dt') {
        setTimeout(initTable, 100);
      }
    };
  })();

})();
