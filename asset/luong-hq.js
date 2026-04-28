/**
 * luong-hq.js — Lương hiệu quả công việc
 */
(function () {
  'use strict';

  function buildHeaders() {
    return [
      [
        'TT', 'Họ và tên', 'Mã cán bộ', 'Số TK',
        'Tổng <br/> hệ số','Ki', 'Hệ số <br/> quy đổi <br/> tháng', 'Hệ số <br/> quy đổi <br/> ngày',
        { label: 'Xếp loại ngày công đi làm', colspan: 8 }, 
        { label: 'Xếp loại ngày công đi học', colspan: 3 },
        'Xếp loại <br/> NC CĐ', 'HSL bình quân <br/> thực tế', 'Số Tiền', 'Ghi chú'
      ],
      [
        '', '', '', '', '', '', '', '',
        '1.10','1.05', '1.00', '0.95', '0.90', '0.85', '0.80','0.75', 
        '1.00', '0.40', '0.20', 
        '0.80', '', '', ''
      ]
    ];
  }

  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    const R = 'htRight  htMiddle';
    return [
      { data: 0, type: 'numeric', width: 40, readOnly: true, className: C },
      { data: 1, type: 'text', width: 150, readOnly: true, className: L },
      { data: 2, type: 'text', width: 80, readOnly: true, className: C },
      { data: 3, type: 'text', width: 100, readOnly: true, className: C },
      { data: 4, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 60, readOnly: true, className: C },
      { data: 5, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 50, readOnly: true, className: C },
      { data: 6, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 70, readOnly: true, className: C },
      { data: 7, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 70, readOnly: true, className: C },
      // Xếp loại đi làm
      { data: 8, type: 'numeric', width: 35, className: C },
      { data: 9, type: 'numeric', width: 35, className: C },
      { data: 10, type: 'numeric', width: 35, className: C },
      { data: 11, type: 'numeric', width: 35, className: C },
      { data: 12, type: 'numeric', width: 35, className: C },
      { data: 13, type: 'numeric', width: 35, className: C },
      { data: 14, type: 'numeric', width: 35, className: C },
      { data: 15, type: 'numeric', width: 35, className: C },
      // Xếp loại đi học
      { data: 16, type: 'numeric', width: 35, className: C },
      { data: 17, type: 'numeric', width: 35, className: C },
      { data: 18, type: 'numeric', width: 35, className: C },
      // NC CĐ
      { data: 19, type: 'numeric', width: 45, className: C },
      // HSL thực tế
      { data: 20, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 80, readOnly: true, className: C },
      { data: 21, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, readOnly: true, className: R },
      { data: 22, type: 'text', width: 120, className: L },
    ];
  }

  function buildMockData() {
    return [
      [1, 'Nguyễn Kiều Ly', 'NV001', '123456789', 3.0, 1.0, 3.0, 0.136, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.0, 4500000, ''],
      [2, 'Bùi Hiểu Bảng', 'NV002', '246835791', 2.66, 1.0, 2.66, 0.121, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2.66, 3990000, ''],
    ];
  }

  function initHot() {
    const container = document.getElementById('lhqHotContainer');
    if (!container || typeof Handsontable === 'undefined') return;

    new Handsontable(container, {
      data: buildMockData(),
      nestedHeaders: buildHeaders(),
      columns: buildCols(),
      rowHeaders: false,
      fixedColumnsStart: 3,
      height: 'auto',
      width: '100%',
      stretchH: 'all',
      autoColumnSize: false,
      renderAllRows: true,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeights: 26,
      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
      }
    });
  }

  window.onPageActivate = (function(orig) {
    return function(page) {
      if (typeof orig === 'function') orig(page);
      if (page === 'luong-hq') setTimeout(initHot, 50);
    };
  })(window.onPageActivate);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHot);
  else setTimeout(initHot, 300);

})();
