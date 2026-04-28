/**
 * danh-gia-hq.js — Đánh giá hiệu quả công việc
 */
(function () {
  'use strict';

  function buildHeaders() {
    return [
      ['STT', 'Họ và tên', 'Mã cán bộ', { label: 'HỆ SỐ ĐG', colspan: 4 }, { label: 'NGÀY CÔNG', colspan: 4 }, 'Ghi chú'],
      ['', '', '', 'A', 'B', 'C', 'D', 'Lễ', 'Phép', 'Học', 'CĐ', '']
    ];
  }

  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    return [
      { data: 0, readOnly: true, width: 40, className: C },
      { data: 1, readOnly: true, width: 150, className: L },
      { data: 2, readOnly: true, width: 80, className: C },
      // Hệ số ĐG
      { data: 3, type: 'numeric', width: 50, className: C },
      { data: 4, type: 'numeric', width: 50, className: C },
      { data: 5, type: 'numeric', width: 50, className: C },
      { data: 6, type: 'numeric', width: 50, className: C },
      // Ngày công
      { data: 7, type: 'numeric', width: 50, className: C },
      { data: 8, type: 'numeric', width: 50, className: C },
      { data: 9, type: 'numeric', width: 50, className: C },
      { data: 10, type: 'numeric', width: 50, className: C },
      { data: 11, type: 'text', width: 150, className: L },
    ];
  }

  function buildMockData() {
    return [
      [1, 'Nguyễn Kiều Ly', 'NV001', 1.10, 0, 0, 0, 0, 0, 0, 0, ''],
      [2, 'Bùi Hiểu Bảng', 'NV002', 1.05, 0, 0, 0, 0, 0, 0, 0, ''],
      [3, 'Đỗ Trung Kiên', 'NV003', 1.00, 0, 0, 0, 0, 0, 0, 0, ''],
    ];
  }

  function initHot() {
    const container = document.getElementById('dghqHotContainer');
    if (!container || typeof Handsontable === 'undefined') return;

    new Handsontable(container, {
      data: buildMockData(),
      nestedHeaders: buildHeaders(),
      columns: buildCols(),
      rowHeaders: false,
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
      if (page === 'danh-gia-hq') setTimeout(initHot, 50);
    };
  })(window.onPageActivate);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHot);
  else setTimeout(initHot, 300);

})();
