/**
 * hdtv-khong-chuyen-trach.js — HĐTV không chuyên trách
 */
(function () {
  'use strict';

  let hotInstance = null;
  let _initializing = false;

  const FIXED = 0;

  function buildHeaders() {
    return [
      'TT', 'HỌ VÀ TÊN', 'MÃ CÁN BỘ', 'SỐ TK', 'TỔNG HSL',
      'QUỸ LƯƠNG TẠM ỨNG', 'SỐ THÁNG LÀM VIỆC', 'LƯƠNG THÙ LAO TẠM ỨNG',
      'TRUY LĨNH', 'TRUY THU', 'TỔNG LĨNH', 'GHI CHÚ'
    ];
  }

  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft htMiddle';
    const R = 'htRight htMiddle';
    const B = 'htBold';
    return [
      { data: 0, readOnly: true, width: 60, className: C }, // TT -> Back to 40px
      { data: 1, readOnly: true, width: 180, className: L },
      { data: 2, readOnly: true, width: 100, className: C },
      { data: 3, readOnly: true, width: 110, className: C },
      { data: 4, type: 'numeric', numericFormat: { pattern: '0.00' }, width: 80, className: C },
      { data: 5, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 150, className: R },
      { data: 6, type: 'numeric', width: 120, className: C },
      { data: 7, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 150, className: R + ' ' + B },
      { data: 8, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: R },
      { data: 9, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: R },
      { data: 10, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 130, className: R + ' ' + B },
      { data: 11, type: 'text', width: 150, className: C },
    ];
  }

  function buildData() {
    return [
      [1, 'Trần Văn A', 'HDTV01', '1234567890', 9.50, 1080000000, 12, 90000000, 0, 0, 90000000, ''],
      [2, 'Lê Thị B', 'HDTV02', '2345678901', 9.00, 1020000000, 12, 85000000, 0, 0, 85000000, ''],
      [3, 'Nguyễn Văn C', 'HDTV03', '3456789012', 8.50, 960000000, 12, 80000000, 0, 0, 80000000, ''],
      [4, 'Phạm Minh D', 'BKS01', '4567890123', 8.00, 900000000, 12, 75000000, 0, 0, 75000000, ''],
      [5, 'Nguyễn Văn E', 'BKS02', '5678901234', 8.50, 960000000, 12, 80000000, 0, 0, 80000000, ''],
    ];
  }

  function initHot() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('hdtvKctHotContainer');
    if (!container || typeof Handsontable === 'undefined') {
      _initializing = false;
      return;
    }

    const data = buildData();

    if (hotInstance) {
      hotInstance.destroy();
      hotInstance = null;
    }

    const calcHeight = (data.length * 28) + 80;

    hotInstance = new Handsontable(container, {
      data: data,
      colHeaders: buildHeaders(),
      columns: buildCols(),
      rowHeaders: false,
      fixedColumnsStart: FIXED,
      height: calcHeight,
      width: '100%',
      stretchH: 'all',
      autoColumnSize: false,
      manualColumnResize: true,
      renderAllRows: true,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeights: 28,
      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
      }
    });

    setTimeout(() => { _initializing = false; }, 300);
  }

  if (!window.onPageActivateRegistry) window.onPageActivateRegistry = {};
  window.onPageActivateRegistry['hdtv-khong-chuyen-trach'] = initHot;

  const _old = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _old === 'function') _old(page);
    if (window.onPageActivateRegistry[page]) {
      setTimeout(window.onPageActivateRegistry[page], 50);
    }
  }

  setTimeout(() => {
    if (document.querySelector('.nav-item.active')?.dataset.page === 'hdtv-khong-chuyen-trach') initHot();
  }, 1000);

})();
