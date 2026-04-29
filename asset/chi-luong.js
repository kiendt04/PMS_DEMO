/**
 * chi-luong.js — Quản lý chi lương theo tháng
 * Fix lỗi lệch dòng và chênh lệch chiều cao header bằng cách đồng nhất cấu trúc CSS và Handsontable.
 */
(function () {
  'use strict';

  const FIXED = 4; // STT | Họ và tên | Mã CB | Số TK

  const DEPTS = [
    { name: 'Phòng Tổng hợp HĐTV', employees: [
      { stt:1,  name:'Nguyễn Kiều Ly',       ma:'NV001', stk:'1234567891',    luongCD:7020000, tamUng:3660000, qt:3360000, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:2,  name:'Bùi Hiểu Bảng',        ma:'NV002', stk:'2468357911',    luongCD:6959400, tamUng:3629700, qt:3329700, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:3,  name:'Đỗ Trung Kiên',         ma:'NV003', stk:'103923558735',  luongCD:8923200, tamUng:4611600, qt:4311600, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:4,  name:'Dương Văn Minh',        ma:'NV004', stk:'5494825544',    luongCD:6084960, tamUng:3192480, qt:2892480, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:5,  name:'Hà Thu Vân',            ma:'NV005', stk:'1236547899',    luongCD:9922440, tamUng:5111220, qt:4811220, anCa:770000, cdTg:0,      truyLinh:500000,  truyThu:0,      ngayChi:'15/04/2025' },
      { stt:6,  name:'Vũ Duy Hưng',           ma:'NV006', stk:'9876543211',    luongCD:6084960, tamUng:3192480, qt:2892480, anCa:770000, cdTg:135000, truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:7,  name:'Đặng Thu Trang',        ma:'NV007', stk:'9876543219',    luongCD:11232000,tamUng:5766000, qt:5466000, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:200000, ngayChi:'15/04/2025' },
    ]},
    { name: 'Phòng Kinh doanh', employees: [
      { stt:8,  name:'Đỗ Anh Thư',            ma:'NV008', stk:'109876914691',  luongCD:7020000, tamUng:3660000, qt:3360000, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:9,  name:'Đỗ Đức Thịnh',          ma:'NV009', stk:'9876543219',    luongCD:6959400, tamUng:3629700, qt:3329700, anCa:770000, cdTg:135000, truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:10, name:'Lê Hà Trang',           ma:'NV010', stk:'3216549871',    luongCD:6084960, tamUng:3192480, qt:2892480, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:11, name:'Nguyễn Anh Tài',        ma:'NV011', stk:'2143658790',    luongCD:8923200, tamUng:4611600, qt:4311600, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:12, name:'Nguyễn Anh Tú',         ma:'NV012', stk:'2134365879',    luongCD:6959400, tamUng:3629700, qt:3329700, anCa:770000, cdTg:0,      truyLinh:300000,  truyThu:0,      ngayChi:'15/04/2025' },
      { stt:13, name:'Nguyễn Thu Trang',      ma:'NV013', stk:'5240914905',    luongCD:9922440, tamUng:5111220, qt:4811220, anCa:770000, cdTg:180000, truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
    ]},
    { name: 'Phòng Kỹ thuật', employees: [
      { stt:14, name:'Nguyễn Thị Mai',        ma:'NV014', stk:'12345678',      luongCD:8923200, tamUng:4611600, qt:4311600, anCa:770000, cdTg:270000, truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:15, name:'Nguyễn Tú Anh',         ma:'NV015', stk:'1234548954',    luongCD:6084960, tamUng:3192480, qt:2892480, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
    ]},
    { name: 'Phòng Nhân sự', employees: [
      { stt:16, name:'Nguyễn Phương Anh',     ma:'NV016', stk:'1256789834',    luongCD:6959400, tamUng:3629700, qt:3329700, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
    ]},
    { name: 'Phòng Kế toán', employees: [
      { stt:17, name:'Nguyễn Bá Quốc Cường',  ma:'NV017', stk:'3423463456',    luongCD:11232000,tamUng:5766000, qt:5466000, anCa:770000, cdTg:90000,  truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
      { stt:18, name:'Dương Đức Lự',           ma:'NV018', stk:'0945780029346', luongCD:9922440, tamUng:5111220, qt:4811220, anCa:770000, cdTg:135000, truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
    ]},
    { name: 'Phòng Công nghệ', employees: [
      { stt:19, name:'Đoàn Trung Quốc',        ma:'NV019', stk:'948422354',     luongCD:7020000, tamUng:3660000, qt:3360000, anCa:770000, cdTg:225000, truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
    ]},
    { name: 'Phòng Chất Lượng', employees: [
      { stt:20, name:'Nguyễn Văn Kiên',        ma:'NV020', stk:'2498458346',    luongCD:6959400, tamUng:3629700, qt:3329700, anCa:770000, cdTg:0,      truyLinh:0,       truyThu:0,      ngayChi:'15/04/2025' },
    ]},
  ];

  let hotInstance = null;
  let deptRowSet = new Set();
  let _initializing = false;

  function buildData() {
    const rows = [];
    deptRowSet = new Set();
    DEPTS.forEach(dept => {
      deptRowSet.add(rows.length);
      const dRow = new Array(14).fill('');
      dRow[1] = dept.name; // Move to index 1
      rows.push(dRow);
      dept.employees.forEach(emp => {
        const thucLinh = emp.qt + emp.anCa + emp.cdTg + (emp.truyLinh || 0) - (emp.truyThu || 0);
        rows.push([
          emp.stt, emp.name, emp.ma, emp.stk,
          emp.luongCD, emp.tamUng, emp.qt,
          emp.anCa, emp.cdTg,
          emp.truyLinh || '', emp.truyThu || '',
          thucLinh,
          emp.ngayChi || '', '',
        ]);
      });
    });
    return rows;
  }

  function initHot(thang, nam) {
    if (_initializing) return;
    _initializing = true;
    const container = document.getElementById('clHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data = buildData();
    const headers = [
      { label: 'TT', colspan: 1 },
      { label: 'Họ và tên', colspan: 1 },
      { label: 'Mã cán bộ', colspan: 1 },
      { label: 'Số TK', colspan: 1 },
      { label: 'Lương<br/>chế độ', colspan: 1 },
      { label: `Đã tạm ứng<br/>T${thang}/${nam}`, colspan: 1 },
      { label: 'Quyết toán<br/>lương', colspan: 1 },
      { label: 'Ăn ca', colspan: 1 },
      { label: 'Ca đêm,<br/>thêm giờ', colspan: 1 },
      { label: 'Truy lĩnh', colspan: 1 },
      { label: 'Truy thu', colspan: 1 },
      { label: 'THỰC LĨNH', colspan: 1 },
      { label: 'Ngày chi', colspan: 1 },
      { label: 'Ghi chú', colspan: 1 },
    ];

    const merges = [];
    deptRowSet.forEach(ri => merges.push({ row: ri, col: 0, rowspan: 1, colspan: 14 }));

    if (hotInstance) { hotInstance.destroy(); hotInstance = null; }

    hotInstance = new Handsontable(container, {
      data,
      nestedHeaders: [headers],
      colHeaders: false,
      rowHeaders: false,
      fixedColumnsStart: FIXED,
      height: 'auto',
      width: '100%',
      stretchH: 'all',
      autoColumnSize: false,
      autoRowSize: false,
      renderAllRows: true,
      renderAllRows: true,
      licenseKey: 'non-commercial-and-evaluation',

      columns: [
        { width: 40, type: 'numeric', className: 'htCenter htMiddle' },
        { width: 160, type: 'text', className: 'htLeft htMiddle' },
        { width: 100, type: 'text', className: 'htCenter htMiddle' },
        { width: 110, type: 'text', className: 'htCenter htMiddle' },
        { width: 100, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { width: 100, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { width: 100, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { width: 85, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { width: 85, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { width: 85, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { width: 85, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle' },
        { width: 110, type: 'numeric', numericFormat: { pattern: '0,0' }, className: 'htRight htMiddle cl-total' },
        { width: 95, type: 'text', className: 'htCenter htMiddle' },
        { width: 100, type: 'text', className: 'htCenter htMiddle' },
      ],

      cells(row, col) {
        if (deptRowSet.has(row)) {
          return {
            readOnly: true,
            className: 'dept-row htLeft htMiddle'
          };
        }
        const props = {};
        if (row % 2 === 0) props.className = (this.columns[col].className || '') + ' cl-even-row';
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        changes.forEach(([ri, cp, oldV, newV]) => {
          if (cp >= 4 && cp <= 10 && oldV !== newV) recalcTotal(ri);
        });
      },

      afterRender() {
        setTimeout(() => { _initializing = false; }, 400);
      },
    });
  }

  function recalcTotal(ri) {
    if (!hotInstance || deptRowSet.has(ri)) return;
    const r = hotInstance.getDataAtRow(ri);
    const qt = parseFloat(r[6]) || 0;
    const ac = parseFloat(r[7]) || 0;
    const cd = parseFloat(r[8]) || 0;
    const tl = parseFloat(r[9]) || 0;
    const tt = parseFloat(r[10]) || 0;
    hotInstance.setDataAtCell(ri, 11, qt + ac + cd + tl - tt, 'recalc');
  }

  function exportCSV() {
    if (!hotInstance) return;
    hotInstance.getPlugin('exportFile').downloadFile('csv', { bom: true, filename: 'ChiLuongThang' });
  }

  function refresh() {
    const thang = parseInt(document.getElementById('clThang')?.value) || new Date().getMonth() + 1;
    const nam = parseInt(document.getElementById('clNam')?.value) || new Date().getFullYear();
    initHot(thang, nam);
  }

  function init() {
    const ySel = document.getElementById('clNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 2; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }
    document.getElementById('clThang')?.addEventListener('change', refresh);
    document.getElementById('clNam')?.addEventListener('change', refresh);
    document.getElementById('clExcel')?.addEventListener('click', exportCSV);
    setTimeout(refresh, 150);
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'chi-luong') setTimeout(refresh, 50);
  };

  if (!document.getElementById('cl-style')) {
    const s = document.createElement('style');
    s.id = 'cl-style';
    s.textContent = `
      #clHotContainer .wtHolder { overflow-x: auto !important; overflow-y: visible !important; height: auto !important; }
      #clHotContainer .ht_master .wtHolder { overflow-x: auto !important; overflow-y: visible !important; }
      #clHotContainer .ht_clone_top .wtHolder { overflow: hidden !important; }
      .handsontable td { white-space: nowrap !important; font-size: 13px !important; color: #333 !important; }
      .handsontable th { background: #1E3A5F !important; color: #fff !important; font-weight: 700 !important; vertical-align: middle !important; text-align: center !important; height: 32px !important; }
      .handsontable span.colHeader { white-space: normal !important; line-height: 1.1 !important; display: block !important; }
      #clHotContainer .cl-even-row { background-color: #fafafa !important; }
      #clHotContainer .cl-total { font-weight: 700 !important; color: #1e40af !important; background: #eff6ff !important; }
      #clHotContainer .htCenter { text-align: center !important; }
      #clHotContainer .htRight { text-align: right !important; }
      #clHotContainer .htLeft { text-align: left !important; }
    `;
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
