/**
 * cc-phong-ban.js — Chấm công phòng ban
 * Updated: Deep Blue headers, No-merge layout, synced data.
 */
(function () {
  'use strict';

  let hotInstance = null;
  let _initializing = false;

  const FIXED = 4; // STT | Họ tên | Mã NV | Chức danh

  /* ── Synced Data ── */
  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV', employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', ma: 'NV001', pos: 'Chuyên viên' },
        { stt: 2, name: 'Bùi Hiểu Bảng', ma: 'NV002', pos: 'Trưởng phòng' },
        { stt: 3, name: 'Đỗ Trung Kiên', ma: 'NV003', pos: 'Kỹ sư' },
        { stt: 4, name: 'Dương Văn Minh', ma: 'NV004', pos: 'Chuyên viên' },
        { stt: 5, name: 'Hà Thu Vân', ma: 'NV005', pos: 'Kế toán' },
      ]
    },
    {
      name: 'Phòng Kinh doanh', employees: [
        { stt: 6, name: 'Đỗ Anh Thư', ma: 'NV006', pos: 'Chuyên viên' },
        { stt: 7, name: 'Đỗ Đức Thịnh', ma: 'NV007', pos: 'Kỹ sư' },
      ]
    },
    {
      name: 'Phòng Kỹ thuật', employees: [
        { stt: 8, name: 'Nguyễn Thị Mai', ma: 'NV008', pos: 'Kỹ sư' },
        { stt: 9, name: 'Nguyễn Tú Anh', ma: 'NV009', pos: 'Kỹ thuật viên' },
      ]
    }
  ];

  function getDaysInMonth() { return 30; }

  function buildHeaders(days) {
    const h1 = [
      { label: 'STT' },
      { label: 'HỌ VÀ TÊN' },
      { label: 'Mã NV' },
      { label: 'Ngạch bậc / Chức danh' },
      { label: 'NGÀY LÀM VIỆC TRONG THÁNG', colspan: days },
      { label: 'QUY RA CÔNG', colspan: 7 }
    ];
    const h2 = [
      '', '', '', '',
      ...Array.from({ length: days }, (_, i) => (i + 1).toString()),
      'SP', 'TG', 'P100', '0%', '40%', '80%', 'BHXH'
    ];
    return [h1, h2];
  }

  function buildCols(days) {
    const C = 'htCenter htMiddle';
    const L = 'htLeft htMiddle';
    const cols = [
      { data: 0, readOnly: true, width: 40, className: C },
      { data: 1, readOnly: true, width: 170, className: L },
      { data: 2, readOnly: true, width: 85, className: C },
      { data: 3, readOnly: true, width: 140, className: C },
    ];
    for (let i = 1; i <= days; i++) cols.push({ data: 3 + i, width: 35, className: C });
    for (let i = 0; i < 7; i++) cols.push({ data: 3 + days + 1 + i, width: 45, className: C });
    return cols;
  }

  function buildData(days) {
    const rows = [];
    const deptRows = new Set();
    const totalCols = FIXED + days + 7;

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptRows.add(di);
      const dr = new Array(totalCols).fill('');
      dr[1] = dept.name;
      rows.push(dr);

      dept.employees.forEach(emp => {
        const row = new Array(totalCols).fill('');
        row[0] = emp.stt;
        row[1] = emp.name;
        row[2] = emp.ma;
        row[3] = emp.pos;
        for (let d = 1; d <= days; d++) row[3 + d] = (d % 7 === 6 || d % 7 === 0) ? '' : '8';
        rows.push(row);
      });
    });
    return { rows, deptRows };
  }

  function initHot() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('ccpbHotContainer');
    if (!container || typeof Handsontable === 'undefined') { 
      _initializing = false; 
      return; 
    }

    const days = getDaysInMonth();
    const { rows, deptRows } = buildData(days);
    const headers = buildHeaders(days);
    const cols = buildCols(days);

    if (hotInstance) { 
      hotInstance.destroy(); 
      hotInstance = null; 
    }

    hotInstance = new Handsontable(container, {
      data: rows,
      nestedHeaders: headers,
      columns: cols,
      rowHeaders: false,
      fixedColumnsStart: FIXED,
      height: 'auto',
      width: '100%',
      stretchH: 'all',
      autoColumnSize: false,
      renderAllRows: true,
      viewportRowRenderingOffset: 1000,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeights: 26,

      cells(row, col) {
        if (deptRows.has(row)) {
          return { readOnly: true, className: 'dept-row htLeft htMiddle' };
        }
        const props = {};
        const classes = [];
        if (row % 2 === 0) classes.push('row-even');
        if (col === 1) classes.push('htLeft');
        else classes.push('htCenter');
        classes.push('htMiddle');
        
        const dayIdx = col - 4;
        if (dayIdx >= 0 && dayIdx < days) {
          const d = dayIdx + 1;
          if (d % 7 === 6 || d % 7 === 0) classes.push('weekend-cell');
        }

        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
        th.style.textAlign = 'center';
      }
    });

    setTimeout(() => { _initializing = false; }, 400);
  }

  window.ccpbOpenAdd = function() { document.getElementById('ccpbModal')?.classList.add('active'); };
  window.ccpbCloseModal = function() { document.getElementById('ccpbModal')?.classList.remove('active'); };

  // Register onPageActivate
  if (!window.onPageActivateRegistry) window.onPageActivateRegistry = {};
  window.onPageActivateRegistry['cc-phong-ban'] = initHot;

  const _oldActivate = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (typeof _oldActivate === 'function') _oldActivate(page);
    if (window.onPageActivateRegistry[page]) {
      setTimeout(window.onPageActivateRegistry[page], 100);
    }
  };

  // Initial load check
  setTimeout(() => {
    const active = document.querySelector('.nav-item.active')?.dataset.page;
    if (active === 'cc-phong-ban') initHot();
  }, 1000);

})();
