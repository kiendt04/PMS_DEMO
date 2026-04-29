/**
 * quyet-toan.js — Quyết toán lương
 * Sao chép y hệt cấu trúc từ chamcong.js (module chuẩn) để đảm bảo đồng bộ 100%.
 */
(function () {
  'use strict';

  const FIXED = 4; // STT | Họ và tên | Mã CB | Số TK
  const BASE_SALARY = 2340000;

  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV', employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', ma: 'NV001', stk: '1234567891', hsl: 3.00, hspc: 0.50, truyLinh: 0, truyThu: 0 },
        { stt: 2, name: 'Bùi Hiểu Bảng', ma: 'NV002', stk: '2468357911', hsl: 2.66, hspc: 0.30, truyLinh: 0, truyThu: 0 },
        { stt: 3, name: 'Đỗ Trung Kiên', ma: 'NV003', stk: '103923558735', hsl: 3.33, hspc: 0.50, truyLinh: 0, truyThu: 0 },
        { stt: 4, name: 'Dương Văn Minh', ma: 'NV004', stk: '5494825544', hsl: 2.34, hspc: 0.30, truyLinh: 0, truyThu: 0 },
        { stt: 5, name: 'Hà Thu Vân', ma: 'NV005', stk: '1236547899', hsl: 3.66, hspc: 0.60, truyLinh: 500000, truyThu: 0 },
        { stt: 6, name: 'Vũ Duy Hưng', ma: 'NV006', stk: '9876543211', hsl: 2.34, hspc: 0.30, truyLinh: 0, truyThu: 0 },
        { stt: 7, name: 'Đặng Thu Trang', ma: 'NV007', stk: '9876543219', hsl: 4.00, hspc: 0.80, truyLinh: 0, truyThu: 200000 },
      ]
    },
    {
      name: 'Phòng Kinh doanh', employees: [
        { stt: 8, name: 'Đỗ Anh Thư', ma: 'NV008', stk: '109876914691', hsl: 3.00, hspc: 0.50, truyLinh: 0, truyThu: 0 },
        { stt: 9, name: 'Đỗ Đức Thịnh', ma: 'NV009', stk: '9876543219', hsl: 2.66, hspc: 0.30, truyLinh: 0, truyThu: 0 },
        { stt: 10, name: 'Lê Hà Trang', ma: 'NV010', stk: '3216549871', hsl: 2.34, hspc: 0.20, truyLinh: 0, truyThu: 0 },
        { stt: 11, name: 'Nguyễn Anh Tài', ma: 'NV011', stk: '2143658790', hsl: 3.33, hspc: 0.50, truyLinh: 0, truyThu: 0 },
        { stt: 12, name: 'Nguyễn Anh Tú', ma: 'NV012', stk: '2134365879', hsl: 2.66, hspc: 0.30, truyLinh: 300000, truyThu: 0 },
        { stt: 13, name: 'Nguyễn Thu Trang', ma: 'NV013', stk: '5240914905', hsl: 3.66, hspc: 0.60, truyLinh: 0, truyThu: 0 },
      ]
    },
    {
      name: 'Phòng Kỹ thuật', employees: [
        { stt: 14, name: 'Nguyễn Thị Mai', ma: 'NV014', stk: '12345678', hsl: 3.33, hspc: 0.50, truyLinh: 0, truyThu: 0 },
        { stt: 15, name: 'Nguyễn Tú Anh', ma: 'NV015', stk: '1234548954', hsl: 2.34, hspc: 0.30, truyLinh: 0, truyThu: 0 },
      ]
    },
    {
      name: 'Phòng Nhân sự', employees: [
        { stt: 16, name: 'Nguyễn Phương Anh', ma: 'NV016', stk: '1256789834', hsl: 2.66, hspc: 0.30, truyLinh: 0, truyThu: 0 },
      ]
    },
    {
      name: 'Phòng Kế toán', employees: [
        { stt: 17, name: 'Nguyễn Bá Quốc Cường', ma: 'NV017', stk: '3423463456', hsl: 4.00, hspc: 0.80, truyLinh: 0, truyThu: 0 },
        { stt: 18, name: 'Dương Đức Lự', ma: 'NV018', stk: '0945780029346', hsl: 3.66, hspc: 0.60, truyLinh: 0, truyThu: 0 },
      ]
    },
    {
      name: 'Phòng Công nghệ', employees: [
        { stt: 19, name: 'Đoàn Trung Quốc', ma: 'NV019', stk: '948422354', hsl: 3.00, hspc: 0.50, truyLinh: 0, truyThu: 0 },
      ]
    },
    {
      name: 'Phòng Chất Lượng', employees: [
        { stt: 20, name: 'Nguyễn Văn Kiên', ma: 'NV020', stk: '2498458346', hsl: 2.66, hspc: 0.30, truyLinh: 0, truyThu: 0 },
      ]
    },
  ];

  let hotInstance = null;
  let deptRowSet = new Set();
  let _initializing = false;

  function buildData() {
    const rows = [];
    deptRowSet = new Set();
    DEPTS.forEach(dept => {
      deptRowSet.add(rows.length);
      const dRow = new Array(16).fill('');
      dRow[1] = dept.name;
      rows.push(dRow);
      dept.employees.forEach(emp => {
        const tongHS = +(emp.hsl + emp.hspc).toFixed(3);
        const luongCD = Math.round(tongHS * BASE_SALARY);
        const rem = luongCD % 100000;
        const daUng = Math.round((luongCD - rem) / 2 + rem);
        const qtLuong = luongCD - daUng;
        const anCa = 770000;
        const cdTg = 0;
        const tong = qtLuong + anCa + cdTg + (emp.truyLinh || 0) - (emp.truyThu || 0);
        rows.push([
          emp.stt, emp.name, emp.ma, emp.stk,
          emp.hsl, emp.hspc, tongHS,
          luongCD, daUng, qtLuong,
          anCa, cdTg,
          emp.truyLinh || '', emp.truyThu || '',
          tong, '',
        ]);
      });
    });
    return rows;
  }

  function initHot() {
    if (_initializing) return;
    _initializing = true;
    const container = document.getElementById('qtHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const thang = parseInt(document.getElementById('qtThang')?.value) || new Date().getMonth() + 1;
    const nam = parseInt(document.getElementById('qtNam')?.value) || new Date().getFullYear();

    const data = buildData();
    const h1 = [
      { label: 'TT', colspan: 1 }, { label: 'Họ và tên', colspan: 1 }, { label: 'Mã cán bộ', colspan: 1 }, { label: 'Số TK', colspan: 1 },
      { label: 'Hệ số lương', colspan: 1 }, { label: 'Hệ số PC', colspan: 1 }, { label: 'Tổng HS lương', colspan: 1 }, { label: 'Lương chế độ 1 tháng', colspan: 1 },
      { label: `Đã tạm ứng T${thang}/${nam}`, colspan: 1 }, { label: 'Lĩnh tiền', colspan: 3 }, { label: 'Truy lĩnh', colspan: 1 }, { label: 'Truy thu', colspan: 1 }, { label: 'TỔNG LĨNH', colspan: 1 }, { label: 'Ghi chú', colspan: 1 }
    ];
    const h2 = ['', '', '', '', '', '', '', '', '', 'Quyết toán lương', 'Ăn ca', 'Ca đêm, thêm giờ', '', '', '', ''];

    if (hotInstance) { hotInstance.destroy(); hotInstance = null; }

    hotInstance = new Handsontable(container, {
      data,
      nestedHeaders: [h1, h2],
      columns: [
        { data: 0, width: 35, type: 'numeric', className: 'htCenter htMiddle' },
        { data: 1, width: 140, type: 'text', className: 'htLeft htMiddle' },
        { data: 2, width: 100, type: 'text', className: 'htCenter htMiddle' },
        { data: 3, width: 110, type: 'text', className: 'htCenter htMiddle' },
        { data: 4, width: 70, type: 'numeric', numericFormat: { pattern: '0.000' }, className: 'htCenter htMiddle' },
        { data: 5, width: 70, type: 'numeric', numericFormat: { pattern: '0.000' }, className: 'htCenter htMiddle' },
        { data: 6, width: 70, type: 'numeric', numericFormat: { pattern: '0.000' }, readOnly: true, className: 'htCenter htMiddle' },
        { data: 7, width: 100, type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight htMiddle' },
        { data: 8, width: 100, type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight htMiddle' },
        { data: 9, width: 100, type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight htMiddle' },
        { data: 10, width: 80, type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight htMiddle' },
        { data: 11, width: 80, type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight htMiddle' },
        { data: 12, width: 90, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { data: 13, width: 90, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { data: 14, width: 110, type: 'numeric', numericFormat: { pattern: '0,0' }, readOnly: true, className: 'htRight htMiddle cc-total' },
        { data: 15, width: 90, type: 'text', className: 'htCenter htMiddle' },
      ],
      rowHeaders: false,
      rowHeights: 26,
      fixedColumnsStart: FIXED,
      height: 'auto',
      width: '100%',
      stretchH: 'all',
      autoColumnSize: false,
      renderAllRows: true,
      licenseKey: 'non-commercial-and-evaluation',

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

      afterChange(changes) {
        if (!changes) return;
        changes.forEach(([ri, cp, oldV, newV]) => {
          if (cp >= 4 && cp <= 13 && oldV !== newV) recalcTotal(ri);
        });
      },

      afterRender() { setTimeout(() => { _initializing = false; }, 400); },
    });
  }

  function recalcTotal(ri) {
    if (!hotInstance || deptRowSet.has(ri)) return;
    const r = hotInstance.getDataAtRow(ri);
    const hsl = parseFloat(r[4]) || 0;
    const hspc = parseFloat(r[5]) || 0;
    const tongHS = +(hsl + hspc).toFixed(3);
    const luongCD = Math.round(tongHS * BASE_SALARY);
    const rem = luongCD % 100000;
    const daUng = Math.round((luongCD - rem) / 2 + rem);
    const qtLuong = luongCD - daUng;
    const anCa = parseFloat(r[10]) || 0;
    const cdTg = parseFloat(r[11]) || 0;
    const tl = parseFloat(r[12]) || 0;
    const tt = parseFloat(r[13]) || 0;
    const tong = qtLuong + anCa + cdTg + tl - tt;
    hotInstance.setDataAtCell([[ri, 6, tongHS], [ri, 7, luongCD], [ri, 8, daUng], [ri, 9, qtLuong], [ri, 14, tong]], 'recalc');
  }

  function exportCSV() {
    if (!hotInstance) return;
    hotInstance.getPlugin('exportFile').downloadFile('csv', { bom: true, filename: 'QuyetToanLuong' });
  }

  function refresh() { initHot(); }

  function init() {
    const ySel = document.getElementById('qtNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 2; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }
    document.getElementById('qtThang')?.addEventListener('change', refresh);
    document.getElementById('qtNam')?.addEventListener('change', refresh);
    document.getElementById('qtExcel')?.addEventListener('click', exportCSV);
    setTimeout(refresh, 150);
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'quyet-toan') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
