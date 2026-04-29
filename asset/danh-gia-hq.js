/**
 * danh-gia-hq.js — Đánh giá hiệu quả công việc
 * Updated: Synchronized data, Dark Teal premium headers, No-merge layout.
 */
(function () {
  'use strict';

  let hotInstance = null;
  let _initializing = false;

  const FIXED = 3; // STT | Họ tên | Số TK

  /* ── Synced Data (from chamcong.js) ── */
  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV', employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', stk: '1234567891' },
        { stt: 2, name: 'Bùi Hiểu Bảng', stk: '2468357911' },
        { stt: 3, name: 'Đỗ Trung Kiên', stk: '103923558735' },
        { stt: 4, name: 'Dương Văn Minh', stk: '5494825544' },
        { stt: 5, name: 'Hà Thu Vân', stk: '1236547899' },
        { stt: 6, name: 'Vũ Duy Hưng', stk: '9876543211' },
        { stt: 7, name: 'Đặng Thu Trang', stk: '9876543219' },
      ]
    },
    {
      name: 'Phòng Kinh doanh', employees: [
        { stt: 8, name: 'Đỗ Anh Thư', stk: '109876914691' },
        { stt: 9, name: 'Đỗ Đức Thịnh', stk: '9876543219' },
        { stt: 10, name: 'Lê Hà Trang', stk: '3216549871' },
        { stt: 11, name: 'Nguyễn Anh Tài', stk: '2143658790' },
        { stt: 12, name: 'Nguyễn Anh Tú', stk: '2134365879' },
        { stt: 13, name: 'Nguyễn Thu Trang', stk: '5240914905' },
      ]
    },
    {
      name: 'Phòng Kỹ thuật', employees: [
        { stt: 14, name: 'Nguyễn Thị Mai', stk: '12345678' },
        { stt: 15, name: 'Nguyễn Tú Anh', stk: '1234548954' },
      ]
    },
    {
      name: 'Phòng Nhân sự', employees: [
        { stt: 16, name: 'Nguyễn Phương Anh', stk: '1256789834' },
      ]
    },
    {
      name: 'Phòng Kế toán', employees: [
        { stt: 17, name: 'Nguyễn Bá Quốc Cường', stk: '3423463456' },
        { stt: 18, name: 'Dương Đức Lự', stk: '0945780029346' },
      ]
    },
    {
      name: 'Phòng Công nghệ', employees: [
        { stt: 19, name: 'Đoàn Trung Quốc', stk: '948422354' },
      ]
    }
  ];

  function buildHeaders() {
    const h1 = [
      { label: 'STT' },
      { label: 'HỌ VÀ TÊN' },
      { label: 'SỐ TK' },
      { label: 'HỆ SỐ ĐG', colspan: 3 },
      { label: 'NGÀY CÔNG', colspan: 4 },
      { label: 'GHI CHÚ' }
    ];
    const h2 = [
      '', '', '',
      'KTI', 'KDHI', 'KCDI',
      'NTI', 'NDHI', 'NCDI', 'NLễ',
      ''
    ];
    return [h1, h2];
  }

  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft htMiddle';
    return [
      { data: 0, readOnly: true, width: 30, className: C },
      { data: 1, readOnly: true, width: 130, className: L },
      { data: 2, readOnly: true, width: 100, className: C },
      // Hệ số ĐG
      { data: 3, type: 'numeric', width: 35, className: C },
      { data: 4, type: 'numeric', width: 35, className: C },
      { data: 5, type: 'numeric', width: 35, className: C },
      // Ngày công
      { data: 6, type: 'numeric', width: 35, className: C },
      { data: 7, type: 'numeric', width: 35, className: C },
      { data: 8, type: 'numeric', width: 35, className: C },
      { data: 9, type: 'numeric', width: 35, className: C },
      { data: 10, type: 'text', width: 80, className: L },
    ];
  }

  function buildData() {
    const rows = [];
    const deptRows = new Set();
    const totalCols = FIXED + 3 + 4 + 1; // 11 cols

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
        row[2] = emp.stk;
        row[3] = 1.1; // Default A
        rows.push(row);
      });
    });
    return { rows, deptRows };
  }

  function initHot() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('dghqHotContainer');
    if (!container || typeof Handsontable === 'undefined') {
      _initializing = false;
      return;
    }

    const { rows, deptRows } = buildData();
    const headers = buildHeaders();
    const cols = buildCols();

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
      stretchH: 'none',
      autoColumnSize: false,
      manualColumnResize: true,
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

  // Register onPageActivate
  if (!window.onPageActivateRegistry) window.onPageActivateRegistry = {};
  window.onPageActivateRegistry['danh-gia-hq'] = initHot;

  const _oldActivate = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _oldActivate === 'function') _oldActivate(page);
    if (window.onPageActivateRegistry[page]) {
      setTimeout(window.onPageActivateRegistry[page], 100);
    }
  };

  setTimeout(() => {
    const active = document.querySelector('.nav-item.active')?.dataset.page;
    if (active === 'danh-gia-hq') initHot();
  }, 1000);

})();
