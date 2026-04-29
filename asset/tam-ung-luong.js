/**
 * tam-ung-luong.js — Quản lý tạm ứng lương
 * FIXED: Alignment fix by removing cells() overwrite.
 */
(function () {
  'use strict';

  let hotInstance = null;
  let _initializing = false;

  const BASE_SALARY = 3600000;
  const FIXED = 4;

  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV', employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', code: '2020.BKT.7.X0', stk: '1234567891', hsl: 3.0, hspc: 2.0, tu: 9000000, bhxh: 1440000, bhyt: 270000, bhtn: 180000 },
        { stt: 2, name: 'Bùi Hiểu Bảng', code: '2021.HDQT.2.X0', stk: '2468357911', hsl: 2.0, hspc: 2.0, tu: 7200000, bhxh: 1152000, bhyt: 216000, bhtn: 144000 },
        { stt: 3, name: 'Đỗ Trung Kiên', code: '2025.HDQT.22.C1', stk: '103923558735', hsl: 2.0, hspc: 2.0, tu: 7200000, bhxh: 1152000, bhyt: 216000, bhtn: 144000 },
        { stt: 4, name: 'Dương Văn Minh', code: '2025.BDT.01.X0', stk: '5494825544', hsl: 2.0, hspc: 2.0, tu: 7200000, bhxh: 1152000, bhyt: 216000, bhtn: 144000 },
        { stt: 5, name: 'Hà Thu Vân', code: '2023.HDQT.15.X0', stk: '1236547899', hsl: 2.0, hspc: 1.0, tu: 5400000, bhxh: 864000, bhyt: 162000, bhtn: 108000 },
        { stt: 6, name: 'Vũ Duy Hưng', code: '2024.BKT.09.X0', stk: '9876543211', hsl: 2.0, hspc: 0.6, tu: 4710000, bhxh: 748800, bhyt: 140400, bhtn: 93600 },
        { stt: 7, name: 'Đặng Thu Trang', code: '2022.HDQT.03.X0', stk: '9876543219', hsl: 2.0, hspc: 1.5, tu: 6300000, bhxh: 1008000, bhyt: 189000, bhtn: 126000 },
      ]
    },
    {
      name: 'Phòng Kinh doanh', employees: [
        { stt: 8, name: 'Đỗ Anh Thư', code: '2019.KD.05.X0', stk: '109876914691', hsl: 2.5, hspc: 1.5, tu: 7200000, bhxh: 1152000, bhyt: 216000, bhtn: 144000 },
        { stt: 9, name: 'Đỗ Đức Thịnh', code: '2021.KD.08.X0', stk: '9876543219', hsl: 2.0, hspc: 1.0, tu: 5400000, bhxh: 864000, bhyt: 162000, bhtn: 108000 },
        { stt: 10, name: 'Lê Hà Trang', code: '2022.KD.11.X0', stk: '3216549871', hsl: 2.0, hspc: 1.2, tu: 5760000, bhxh: 921600, bhyt: 172800, bhtn: 115200 },
        { stt: 11, name: 'Nguyễn Anh Tài', code: '2020.KD.04.X0', stk: '2143658790', hsl: 2.0, hspc: 1.0, tu: 5400000, bhxh: 864000, bhyt: 162000, bhtn: 108000 },
        { stt: 12, name: 'Nguyễn Anh Tú', code: '2021.KD.09.X0', stk: '2134365879', hsl: 2.0, hspc: 1.0, tu: 5400000, bhxh: 864000, bhyt: 162000, bhtn: 108000 },
        { stt: 13, name: 'Nguyễn Thu Trang', code: '2023.KD.13.X0', stk: '5240914905', hsl: 2.0, hspc: 1.2, tu: 5760000, bhxh: 921600, bhyt: 172800, bhtn: 115200 },
      ]
    },
    {
      name: 'Phòng Kỹ thuật', employees: [
        { stt: 14, name: 'Nguyễn Thị Mai', code: '2021.KT.03.X0', stk: '12345678', hsl: 2.0, hspc: 1.5, tu: 6300000, bhxh: 1008000, bhyt: 189000, bhtn: 126000 },
        { stt: 15, name: 'Nguyễn Tú Anh', code: '2023.KT.07.X0', stk: '1234548954', hsl: 2.0, hspc: 1.0, tu: 5400000, bhxh: 864000, bhyt: 162000, bhtn: 108000 },
      ]
    },
    {
      name: 'Phòng Nhân sự', employees: [
        { stt: 16, name: 'Nguyễn Phương Anh', code: '2022.NS.01.X0', stk: '1256789834', hsl: 2.0, hspc: 1.5, tu: 6300000, bhxh: 1008000, bhyt: 189000, bhtn: 126000 },
      ]
    },
    {
      name: 'Phòng Kế toán', employees: [
        { stt: 17, name: 'Nguyễn Bá Quốc Cường', code: '2020.KT.02.X0', stk: '3423463456', hsl: 2.5, hspc: 1.0, tu: 6300000, bhxh: 1008000, bhyt: 189000, bhtn: 126000 },
        { stt: 18, name: 'Dương Đức Lự', code: '2022.KT.04.X0', stk: '0945780029346', hsl: 2.0, hspc: 1.0, tu: 5400000, bhxh: 864000, bhyt: 162000, bhtn: 108000 },
      ]
    },
    {
      name: 'Phòng Công nghệ', employees: [
        { stt: 19, name: 'Đoàn Trung Quốc', code: '2021.CN.02.X0', stk: '948422354', hsl: 2.0, hspc: 1.5, tu: 6300000, bhxh: 1008000, bhyt: 189000, bhtn: 126000 },
      ]
    },
    {
      name: 'Phòng Chất Lượng', employees: [
        { stt: 20, name: 'Nguyễn Văn Kiên', code: '2023.CL.01.X0', stk: '2498458346', hsl: 2.0, hspc: 1.0, tu: 5400000, bhxh: 864000, bhyt: 162000, bhtn: 108000 },
      ]
    }
  ];

  function buildHeaders() {
    return [
      [
        'TT', 'HỌ VÀ TÊN', 'MÃ CÁN BỘ', 'SỐ TK',
        'HỆ SỐ LƯƠNG', 'HỆ SỐ PC', 'TỔNG HỆ SỐ', 'LƯƠNG CHẾ ĐỘ',
        'TẠM ỨNG', { label: 'CÁC KHOẢN KHẤU TRỪ', colspan: 3 },
        'TRUY LĨNH', 'TRUY THU', 'TỔNG LĨNH', 'GHI CHÚ'
      ],
      [
        '', '', '', '', '', '', '', '', '',
        'BHXH (8%)', 'BHYT (1.5%)', 'BHTN (1%)',
        '', '', '', ''
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
      { data: 2, readOnly: true, width: 100, className: C },
      { data: 3, readOnly: true, width: 110, className: C },
      { data: 4, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 65, className: C },
      { data: 5, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 65, className: C },
      { data: 6, readOnly: true, type: 'numeric', numericFormat: { pattern: '0.000' }, width: 65, className: C },
      { data: 7, readOnly: true, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: R },
      { data: 8, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 90, className: R },
      { data: 9, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 85, className: R },
      { data: 10, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 85, className: R },
      { data: 11, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 85, className: R },
      { data: 12, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 85, className: R },
      { data: 13, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 85, className: R },
      { data: 14, readOnly: true, type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: R + ' tu-total' },
      { data: 15, type: 'text', width: 120, className: L },
    ];
  }

  function buildData() {
    const rows = [];
    DEPTS.forEach(dept => {
      dept.employees.forEach(emp => {
        const totalHS = (emp.hsl || 0) + (emp.hspc || 0);
        const luongCD = totalHS * BASE_SALARY;
        const tongLinh = (emp.tu || 0) - ((emp.bhxh || 0) + (emp.bhyt || 0) + (emp.bhtn || 0));
        rows.push([
          emp.stt, emp.name, emp.code, emp.stk,
          emp.hsl, emp.hspc, totalHS, luongCD,
          emp.tu, emp.bhxh, emp.bhyt, emp.bhtn,
          0, 0, tongLinh, ''
        ]);
      });
    });
    return rows;
  }

  function initHot() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('tuHotContainer');
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
  window.onPageActivateRegistry['tam-ung-luong'] = initHot;

  const _old = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (typeof _old === 'function') _old(page);
    if (window.onPageActivateRegistry[page]) {
      setTimeout(window.onPageActivateRegistry[page], 50);
    }
  }

  setTimeout(() => {
    if (document.querySelector('.nav-item.active')?.dataset.page === 'tam-ung-luong') initHot();
  }, 1000);

})();
