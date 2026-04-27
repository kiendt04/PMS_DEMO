/**
 * chi-luong.js — Quản lý chi lương theo tháng với Handsontable
 * Alignment: tên/STK/ngày chi/ghi chú → htLeft | tiền → htRight | mã/stt → htCenter
 */
(function () {
  'use strict';

  const FIXED = 4; // STT | Họ và tên | Mã CB | Số TK

  /* ── Mock data ── */
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
  let deptSet     = new Set();
  let _initializing = false;

  /* ── Build data ── */
  function buildData() {
    const rows = [];
    deptSet = new Set();

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dRow = new Array(14).fill('');
      dRow[0] = dept.name;
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

  /* ── Build nested headers ── */
  function buildHeaders(thang, nam) {
    const h1 = [
      { label: 'TT',                         colspan: 1 },
      { label: 'Họ và tên',                  colspan: 1 },
      { label: 'Mã cán bộ',                  colspan: 1 },
      { label: 'Số TK',                      colspan: 1 },
      { label: 'Lương chế độ',               colspan: 1 },
      { label: `Đã tạm ứng<br/>T${thang}/${nam}`, colspan: 1 },
      { label: 'Quyết toán<br/>lương',       colspan: 1 },
      { label: 'Ăn ca',                      colspan: 1 },
      { label: 'Ca đêm,<br/>thêm giờ',       colspan: 1 },
      { label: 'Truy lĩnh',                  colspan: 1 },
      { label: 'Truy thu',                   colspan: 1 },
      { label: 'THỰC LĨNH',                  colspan: 1 },
      { label: 'Ngày chi',                   colspan: 1 },
      { label: 'Ghi chú',                    colspan: 1 },
    ];
    return [h1];
  }

  /* ── Build column config ── */
  function buildCols() {
    const C   = 'htCenter htMiddle';
    const L   = 'htLeft   htMiddle';
    const R   = 'htRight  htMiddle';
    const FMT = { type:'numeric', numericFormat:{ pattern:'0,0' } };
    return [
      { data:0,  readOnly:true, type:'numeric', width:35,  className: C },
      { data:1,  readOnly:true, type:'text',    width:145, className: L },
      { data:2,  readOnly:true, type:'text',    width:80,  className: C },
      { data:3,  readOnly:true, type:'text',    width:118, className: C },
      // Cột tiền — right
      { data:4,  readOnly:true, ...FMT, width:100, className: R },
      { data:5,  readOnly:true, ...FMT, width:100, className: R },
      { data:6,  readOnly:true, ...FMT, width:100, className: R },
      { data:7,  readOnly:true, ...FMT, width:88,  className: R },
      { data:8,  readOnly:true, ...FMT, width:88,  className: R },
      // Truy lĩnh / truy thu — editable, right
      { data:9,  ...FMT, width:82, className: R },
      { data:10, ...FMT, width:82, className: R },
      // THỰC LĨNH — right + highlight
      { data:11, readOnly:true, ...FMT, width:108, className: R + ' cl-total' },
      // Ngày chi — center
      { data:12, readOnly:true, type:'text', width:90, className: C },
      // Ghi chú — center
      { data:13, type:'text', width:100, className: C },
    ];
  }

  /* ── initHot ── */
  function initHot(thang, nam) {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('clHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data      = buildData();
    const headers   = buildHeaders(thang, nam);
    const cols      = buildCols();
    const totalCols = cols.length;
    const merges    = [];
    deptSet.forEach(ri => merges.push({ row: ri, col: 0, rowspan: 1, colspan: totalCols }));

    if (hotInstance) { hotInstance.destroy(); hotInstance = null; }
    container.style.height = 'auto';

    hotInstance = new Handsontable(container, {
      data,
      nestedHeaders:     headers,
      columns:           cols,
      rowHeaders:        false,
      fixedColumnsStart: FIXED,
      height:            'auto',
      width:             '100%',
      stretchH:          'all',
      autoColumnSize:    false,
      mergeCells:        merges,
      licenseKey:        'non-commercial-and-evaluation',
      rowHeights:        26,
      columnHeaderHeight: [32],
      viewportRowRenderingOffset: 'auto',

      cells(row, col) {
        if (deptSet.has(row)) {
          return {
            readOnly: true,
            renderer(inst, td, r, c, prop, value) {
              td.innerHTML = '';
              td.style.cssText = 'background:#DBEAFE;border-bottom:1px solid #93C5FD;border-right:1px solid #BFDBFE;height:26px;';
              if (c === 0) {
                td.style.color      = '#1E40AF';
                td.style.fontWeight = '700';
                td.style.fontSize   = '12px';
                td.style.padding    = '0 8px';
                td.style.textAlign  = 'left';
                td.textContent      = value || '';
              }
            }
          };
        }
        const props = {};
        const classes = [];
        if (row % 2 === 0) classes.push('cl-even-row');
        if (col === 1) classes.push('htLeft');
        else if (col >= 4 && col <= 11) classes.push('htRight');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (col === 11)    classes.push('cl-total');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        const affected = new Set(changes.filter(([,,,src]) => src !== 'recalc').map(([r]) => r));
        affected.forEach(ri => recalcTotal(ri));
      },

      afterGetColHeader(col, th) {
        // Wrap header dài
        if ([5, 6, 8].includes(col)) {
          th.style.whiteSpace = 'normal';
          th.style.lineHeight = '1.25';
          th.style.padding    = '2px 3px';
          th.style.wordBreak  = 'break-word';
        }
      },

      afterRender() {
        setTimeout(() => { _initializing = false; }, 400);
      },
    });
  }

  /* ── Recalc THỰC LĨNH ── */
  function recalcTotal(ri) {
    if (!hotInstance || deptSet.has(ri)) return;
    const qt = parseFloat(hotInstance.getDataAtCell(ri, 6))  || 0;
    const ac = parseFloat(hotInstance.getDataAtCell(ri, 7))  || 0;
    const cd = parseFloat(hotInstance.getDataAtCell(ri, 8))  || 0;
    const tl = parseFloat(hotInstance.getDataAtCell(ri, 9))  || 0;
    const tt = parseFloat(hotInstance.getDataAtCell(ri, 10)) || 0;
    hotInstance.setDataAtCell(ri, 11, qt + ac + cd + tl - tt || '', 'recalc');
  }

  /* ── Export CSV ── */
  function exportCSV() {
    if (!hotInstance) return;
    const t = document.getElementById('clThang')?.value || '';
    const n = document.getElementById('clNam')?.value   || '';
    hotInstance.getPlugin('exportFile').downloadFile('csv', {
      bom: true, columnHeaders: true, fileExtension: 'csv',
      filename: `ChiLuong_T${t}_${n}`, mimeType: 'text/csv',
      rowDelimiter: '\r\n', rowHeaders: false,
    });
  }

  function refresh() {
    const thang = parseInt(document.getElementById('clThang')?.value) || new Date().getMonth() + 1;
    const nam   = parseInt(document.getElementById('clNam')?.value)   || new Date().getFullYear();
    initHot(thang, nam);
  }

  /* ── Init ── */
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

    let _t = null;
    const _cb = () => {
      if (_initializing) return;
      const page = document.querySelector('.page-section.active');
      if (page?.id === 'page-chi-luong') { clearTimeout(_t); _t = setTimeout(refresh, 300); }
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(_cb);
      const el = document.querySelector('.main') || document.getElementById('clHotContainer');
      if (el) ro.observe(el);
    } else { window.addEventListener('resize', _cb); }
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'chi-luong') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
