/**
 * luong-hq.js — Lương hiệu quả công việc
 * FIXED: Alignment fix by removing cells() overwrite.
 */
(function () {
  'use strict';

  let hotInstance = null;
  let _initializing = false;

  const FIXED = 4;

  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV', employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', code: 'NV001', stk: '1234567891' },
        { stt: 2, name: 'Bùi Hiểu Bảng', code: 'NV002', stk: '2468357911' },
        { stt: 3, name: 'Đỗ Trung Kiên', code: 'NV003', stk: '103923558735' },
        { stt: 4, name: 'Dương Văn Minh', code: 'NV004', stk: '5494825544' },
        { stt: 5, name: 'Hà Thu Vân', code: 'NV005', stk: '1236547899' },
        { stt: 6, name: 'Vũ Duy Hưng', code: 'NV006', stk: '9876543211' },
        { stt: 7, name: 'Đặng Thu Trang', code: 'NV007', stk: '9876543219' },
      ]
    },
    {
      name: 'Phòng Kinh doanh', employees: [
        { stt: 8, name: 'Đỗ Anh Thư', code: 'NV008', stk: '109876914691' },
        { stt: 9, name: 'Đỗ Đức Thịnh', code: 'NV009', stk: '9876543219' },
        { stt: 10, name: 'Lê Hà Trang', code: 'NV010', stk: '3216549871' },
        { stt: 11, name: 'Nguyễn Anh Tài', code: 'NV011', stk: '2143658790' },
        { stt: 12, name: 'Nguyễn Anh Tú', code: 'NV012', stk: '2134365879' },
        { stt: 13, name: 'Nguyễn Thu Trang', code: 'NV013', stk: '5240914905' },
      ]
    },
    {
      name: 'Phòng Kỹ thuật', employees: [
        { stt: 14, name: 'Nguyễn Thị Mai', code: 'NV014', stk: '12345678' },
        { stt: 15, name: 'Nguyễn Tú Anh', code: 'NV015', stk: '1234548954' },
      ]
    },
    {
      name: 'Phòng Nhân sự', employees: [
        { stt: 16, name: 'Nguyễn Phương Anh', code: 'NV016', stk: '1256789834' },
      ]
    },
    {
      name: 'Phòng Kế toán', employees: [
        { stt: 17, name: 'Nguyễn Bá Quốc Cường', code: 'NV017', stk: '3423463456' },
        { stt: 18, name: 'Dương Đức Lự', code: 'NV018', stk: '0945780029346' },
      ]
    },
    {
      name: 'Phòng Công nghệ', employees: [
        { stt: 19, name: 'Đoàn Trung Quốc', code: 'NV019', stk: '948422354' },
      ]
    },
    {
      name: 'Phòng Chất Lượng', employees: [
        { stt: 20, name: 'Nguyễn Văn Kiên', code: 'NV020', stk: '2498458346' },
      ]
    }
  ];

  function buildHeaders() {
    return [
      [
        'TT', 'HỌ VÀ TÊN', 'MÃ CÁN BỘ', 'SỐ TK',
        'TỔNG HỆ SỐ', 'KI', 'HỆ SỐ QUY ĐỔI THÁNG', 'HỆ SỐ QUY ĐỔI NGÀY',
        { label: 'XẾP LOẠI NGÀY CÔNG ĐI LÀM', colspan: 8 },
        { label: 'XẾP LOẠI NGÀY CÔNG ĐI HỌC', colspan: 3 },
        'XẾP LOẠI NC CĐ', 'HSL BQ THỰC TẾ', 'SỐ TIỀN', 'GHI CHÚ'
      ],
      [
        '', '', '', '', '', '', '', '',
        '1.10', '1.05', '1.00', '0.95', '0.90', '0.85', '0.80', '0.75',
        '1.00', '0.40', '0.20',
        '0.80', '', '', ''
      ]
    ];
  }

  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft htMiddle';
    const R = 'htRight htMiddle';
    return [
      { data: 0, readOnly: true, width: 40, className: C },
      { data: 1, readOnly: true, width: 180, className: L },
      { data: 2, readOnly: true, width: 90, className: C },
      { data: 3, readOnly: true, width: 110, className: C },
      { data: 4, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 75, readOnly: true, className: C },
      { data: 5, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 50, readOnly: true, className: C },
      { data: 6, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 85, readOnly: true, className: C },
      { data: 7, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 85, readOnly: true, className: C },
      { data: 8, type: 'numeric', width: 55, className: C },
      { data: 9, type: 'numeric', width: 55, className: C },
      { data: 10, type: 'numeric', width: 55, className: C },
      { data: 11, type: 'numeric', width: 55, className: C },
      { data: 12, type: 'numeric', width: 55, className: C },
      { data: 13, type: 'numeric', width: 55, className: C },
      { data: 14, type: 'numeric', width: 55, className: C },
      { data: 15, type: 'numeric', width: 55, className: C },
      { data: 16, type: 'numeric', width: 55, className: C },
      { data: 17, type: 'numeric', width: 55, className: C },
      { data: 18, type: 'numeric', width: 55, className: C },
      { data: 19, type: 'numeric', width: 55, className: C },
      { data: 20, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 95, readOnly: true, className: C },
      { data: 21, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 120, readOnly: true, className: R },
      { data: 22, type: 'text', width: 150, className: L },
    ];
  }

  function buildData() {
    const rows = [];
    DEPTS.forEach(dept => {
      dept.employees.forEach(emp => {
        rows.push([
          emp.stt, emp.name, emp.code, emp.stk,
          3.000, 1.000, 3.000, 0.136,
          0, 0, 22, 0, 0, 0, 0, 0,
          0, 0, 0,
          0, 3.000, 4500000, ''
        ]);
      });
    });
    return rows;
  }

  function initHot() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('lhqHotContainer');
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
      nestedHeaders: buildHeaders(),
      columns: buildCols(),
      rowHeaders: false,
      fixedColumnsStart: FIXED,
      height: calcHeight,
      width: '100%',
      stretchH: 'none',
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
  window.onPageActivateRegistry['luong-hq'] = initHot;

  const _old = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (typeof _old === 'function') _old(page);
    if (window.onPageActivateRegistry[page]) {
      setTimeout(window.onPageActivateRegistry[page], 50);
    }
  }

  setTimeout(() => {
    if (document.querySelector('.nav-item.active')?.dataset.page === 'luong-hq') initHot();
  }, 1000);

})();
