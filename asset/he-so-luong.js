/**
 * he-so-luong.js — Bảng hệ số lương
 * Sao chép y hệt cấu trúc từ chamcong.js (module chuẩn) để đảm bảo đồng bộ 100%.
 */
(function () {
  'use strict';

  const FIXED = 5;

  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV',
      employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', ma: '2020.BKT.7.X0', bankNo: '1234567891', chucDanh: 'Trưởng phòng' },
        { stt: 2, name: 'Bùi Hiểu Bảng', ma: '2021.HDQT.2.X0', bankNo: '2468357911', chucDanh: 'Phó phòng' },
        { stt: 3, name: 'Đỗ Trung Kiên', ma: '2025.HDQT.22.C1', bankNo: '103923558735', chucDanh: 'Chuyên viên' },
        { stt: 4, name: 'Dương Văn Minh', ma: '2025.BDT.01.X0', bankNo: '5494825544', chucDanh: 'Chuyên viên' },
        { stt: 5, name: 'Hà Thu Vân', ma: '2023.HDQT.15.X0', bankNo: '1236547899', chucDanh: 'Chuyên viên' },
        { stt: 6, name: 'Vũ Duy Hưng', ma: '2024.BKT.09.X0', bankNo: '9876543211', chucDanh: 'Nhân viên' },
        { stt: 7, name: 'Đặng Thu Trang', ma: '2022.HDQT.03.X0', bankNo: '9876543219', chucDanh: 'Nhân viên' },
      ]
    },
    {
      name: 'Phòng Kinh doanh',
      employees: [
        { stt: 8, name: 'Đỗ Anh Thư', ma: '2019.KD.05.X0', bankNo: '109876914691', chucDanh: 'Trưởng phòng' },
        { stt: 9, name: 'Đỗ Đức Thịnh', ma: '2021.KD.08.X0', bankNo: '9876543219', chucDanh: 'Phó phòng' },
        { stt: 10, name: 'Lê Hà Trang', ma: '2022.KD.11.X0', bankNo: '3216549871', chucDanh: 'Nhân viên' },
        { stt: 11, name: 'Nguyễn Anh Tài', ma: '2020.KD.04.X0', bankNo: '2143658790', chucDanh: 'Nhân viên' },
        { stt: 12, name: 'Nguyễn Anh Tú', ma: '2021.KD.09.X0', bankNo: '2134365879', chucDanh: 'Nhân viên' },
        { stt: 13, name: 'Nguyễn Thu Trang', ma: '2023.KD.13.X0', bankNo: '5240914905', chucDanh: 'Nhân viên' },
      ]
    },
    {
      name: 'Phòng Kỹ thuật',
      employees: [
        { stt: 14, name: 'Nguyễn Thị Mai', ma: '2021.KT.03.X0', bankNo: '12345678', chucDanh: 'Trưởng phòng' },
        { stt: 15, name: 'Nguyễn Tú Anh', ma: '2023.KT.07.X0', bankNo: '1234548954', chucDanh: 'Nhân viên' },
      ]
    },
    {
      name: 'Phòng Nhân sự',
      employees: [
        { stt: 16, name: 'Nguyễn Phương Anh', ma: '2022.NS.01.X0', bankNo: '1256789834', chucDanh: 'Trưởng phòng' },
      ]
    },
    {
      name: 'Phòng Kế toán',
      employees: [
        { stt: 17, name: 'Nguyễn Bá Quốc Cường', ma: '2020.KT.02.X0', bankNo: '3423463456', chucDanh: 'Trưởng phòng' },
        { stt: 18, name: 'Dương Đức Lự', ma: '2022.KT.04.X0', bankNo: '0945780029346', chucDanh: 'Kế toán viên' },
      ]
    },
    {
      name: 'Phòng Công nghệ',
      employees: [
        { stt: 19, name: 'Đoàn Trung Quốc', ma: '2021.CN.02.X0', bankNo: '948422354', chucDanh: 'Trưởng phòng' },
      ]
    },
    {
      name: 'Phòng Chất Lượng',
      employees: [
        { stt: 20, name: 'Nguyễn Văn Kiên', ma: '2023.CL.01.X0', bankNo: '2498458346', chucDanh: 'Nhân viên' },
      ]
    },
  ];

  const HS_MAP = {
    'Trưởng phòng': [3.00, 0.80],
    'Phó phòng': [2.66, 0.60],
    'Chuyên viên': [2.34, 0.40],
    'Kế toán viên': [2.34, 0.40],
    'Nhân viên': [2.00, 0.20],
  };

  let hotHSL = null;
  let deptRowSet = new Set();
  let _initializing = false;

  function buildData() {
    const rows = [];
    deptRowSet = new Set();
    DEPTS.forEach(dept => {
      deptRowSet.add(rows.length);
      const dr = new Array(29).fill('');
      dr[1] = dept.name;
      rows.push(dr);
      dept.employees.forEach(emp => {
        const hs = HS_MAP[emp.chucDanh] || [2.00, 0.20];
        const row = [emp.stt, emp.name, emp.chucDanh, emp.ma, emp.bankNo];
        for (let m = 0; m < 12; m++) { row.push(hs[0], hs[1]); }
        rows.push(row);
      });
    });
    return rows;
  }

  function initHot() {
    if (_initializing) return;
    _initializing = true;
    const container = document.getElementById('hslHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data = buildData();
    const h1 = [
      { label: 'STT', colspan: 1 }, { label: 'Họ và tên', colspan: 1 }, { label: 'Chức danh', colspan: 1 }, { label: 'Mã nhân viên', colspan: 1 }, { label: 'Số Tài khoản', colspan: 1 },
      { label: 'T1', colspan: 2 }, { label: 'T2', colspan: 2 }, { label: 'T3', colspan: 2 }, { label: 'T4', colspan: 2 }, { label: 'T5', colspan: 2 }, { label: 'T6', colspan: 2 },
      { label: 'T7', colspan: 2 }, { label: 'T8', colspan: 2 }, { label: 'T9', colspan: 2 }, { label: 'T10', colspan: 2 }, { label: 'T11', colspan: 2 }, { label: 'T12', colspan: 2 },
    ];
    const h2 = ['', '', '', '', ''];
    for (let m = 0; m < 12; m++) { h2.push('HS <br/> cbcv', 'HS <br/> cv+tn'); }

    if (hotHSL) { hotHSL.destroy(); hotHSL = null; }

    hotHSL = new Handsontable(container, {
      data,
      nestedHeaders: [h1, h2],
      columns: [
        { data: 0, width: 35, type: 'text', className: 'htCenter htMiddle' },
        { data: 1, width: 140, type: 'text', className: 'htLeft htMiddle' },
        { data: 2, width: 100, type: 'text', className: 'htCenter htMiddle' },
        { data: 3, width: 120, type: 'text', className: 'htCenter htMiddle' },
        { data: 4, width: 110, type: 'text', className: 'htCenter htMiddle' },
        ...Array(24).fill({ type: 'numeric', width: 36, numericFormat: { pattern: '0.000' }, className: 'htCenter htMiddle' })
      ],
      rowHeaders: false,
      fixedColumnsStart: FIXED,
      height: 'auto',
      width: '100%',
      stretchH: 'all',
      autoColumnSize: false,
      renderAllRows: true,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeights: 26,

      cells(row, col) {
        if (deptRowSet.has(row)) {
          return {
            readOnly: true,
            className: 'dept-row htLeft htMiddle'
          };
        }
        const props = {};
        let classes = [];
        if (row % 2 === 0) classes.push('cc-even-row');
        if (col === 1) classes.push('htLeft');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterRender() { setTimeout(() => { _initializing = false; }, 400); },
    });
  }

  function refresh() { initHot(); }

  function init() {
    const ySel = document.getElementById('hslNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 1; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }
    document.getElementById('hslNam')?.addEventListener('change', refresh);
    document.getElementById('hslExcel')?.addEventListener('click', () => {
      hotHSL?.getPlugin('exportFile').downloadFile('csv', { bom: true, columnHeaders: true, filename: 'HeSoLuong' });
    });
    setTimeout(refresh, 150);
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'he-so-luong') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 250);
})();
