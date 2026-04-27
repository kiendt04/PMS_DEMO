/**
 * quyet-toan.js — Quyết toán lương với Handsontable
 * Alignment: tên/STK/ghichu → htLeft | tiền lớn → htRight | hệ số/mã → htCenter
 */
(function () {
  'use strict';

  const FIXED       = 4; // STT | Họ và tên | Mã cán bộ | Số TK
  const BASE_SALARY = 2340000;

  /* ── Mock data ── */
  const DEPTS = [
    { name: 'Phòng Tổng hợp HĐTV', employees: [
      { stt:1,  name:'Nguyễn Kiều Ly',       ma:'NV001', stk:'1234567891',    hsl:3.00, hspc:0.50, truyLinh:0,       truyThu:0 },
      { stt:2,  name:'Bùi Hiểu Bảng',        ma:'NV002', stk:'2468357911',    hsl:2.66, hspc:0.30, truyLinh:0,       truyThu:0 },
      { stt:3,  name:'Đỗ Trung Kiên',         ma:'NV003', stk:'103923558735',  hsl:3.33, hspc:0.50, truyLinh:0,       truyThu:0 },
      { stt:4,  name:'Dương Văn Minh',        ma:'NV004', stk:'5494825544',    hsl:2.34, hspc:0.30, truyLinh:0,       truyThu:0 },
      { stt:5,  name:'Hà Thu Vân',            ma:'NV005', stk:'1236547899',    hsl:3.66, hspc:0.60, truyLinh:500000,  truyThu:0 },
      { stt:6,  name:'Vũ Duy Hưng',           ma:'NV006', stk:'9876543211',    hsl:2.34, hspc:0.30, truyLinh:0,       truyThu:0 },
      { stt:7,  name:'Đặng Thu Trang',        ma:'NV007', stk:'9876543219',    hsl:4.00, hspc:0.80, truyLinh:0,       truyThu:200000 },
    ]},
    { name: 'Phòng Kinh doanh', employees: [
      { stt:8,  name:'Đỗ Anh Thư',            ma:'NV008', stk:'109876914691',  hsl:3.00, hspc:0.50, truyLinh:0,       truyThu:0 },
      { stt:9,  name:'Đỗ Đức Thịnh',          ma:'NV009', stk:'9876543219',    hsl:2.66, hspc:0.30, truyLinh:0,       truyThu:0 },
      { stt:10, name:'Lê Hà Trang',           ma:'NV010', stk:'3216549871',    hsl:2.34, hspc:0.20, truyLinh:0,       truyThu:0 },
      { stt:11, name:'Nguyễn Anh Tài',        ma:'NV011', stk:'2143658790',    hsl:3.33, hspc:0.50, truyLinh:0,       truyThu:0 },
      { stt:12, name:'Nguyễn Anh Tú',         ma:'NV012', stk:'2134365879',    hsl:2.66, hspc:0.30, truyLinh:300000,  truyThu:0 },
      { stt:13, name:'Nguyễn Thu Trang',      ma:'NV013', stk:'5240914905',    hsl:3.66, hspc:0.60, truyLinh:0,       truyThu:0 },
    ]},
    { name: 'Phòng Kỹ thuật', employees: [
      { stt:14, name:'Nguyễn Thị Mai',        ma:'NV014', stk:'12345678',      hsl:3.33, hspc:0.50, truyLinh:0,       truyThu:0 },
      { stt:15, name:'Nguyễn Tú Anh',         ma:'NV015', stk:'1234548954',    hsl:2.34, hspc:0.30, truyLinh:0,       truyThu:0 },
    ]},
    { name: 'Phòng Nhân sự', employees: [
      { stt:16, name:'Nguyễn Phương Anh',     ma:'NV016', stk:'1256789834',    hsl:2.66, hspc:0.30, truyLinh:0,       truyThu:0 },
    ]},
    { name: 'Phòng Kế toán', employees: [
      { stt:17, name:'Nguyễn Bá Quốc Cường',  ma:'NV017', stk:'3423463456',    hsl:4.00, hspc:0.80, truyLinh:0,       truyThu:0 },
      { stt:18, name:'Dương Đức Lự',           ma:'NV018', stk:'0945780029346', hsl:3.66, hspc:0.60, truyLinh:0,       truyThu:0 },
    ]},
    { name: 'Phòng Công nghệ', employees: [
      { stt:19, name:'Đoàn Trung Quốc',        ma:'NV019', stk:'948422354',     hsl:3.00, hspc:0.50, truyLinh:0,       truyThu:0 },
    ]},
    { name: 'Phòng Chất Lượng', employees: [
      { stt:20, name:'Nguyễn Văn Kiên',        ma:'NV020', stk:'2498458346',    hsl:2.66, hspc:0.30, truyLinh:0,       truyThu:0 },
    ]},
  ];

  let hotInstance = null;
  let deptSet     = new Set();
  let _initializing = false;

  function calcAdvance(luong) {
    const rem = luong % 100000;
    return Math.round((luong - rem) / 2 + rem);
  }

  /* ── Build data ── */
  function buildData() {
    const rows = [];
    deptSet = new Set();

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dRow = new Array(16).fill('');
      dRow[0] = dept.name;
      rows.push(dRow);

      dept.employees.forEach(emp => {
        const tongHS  = +(emp.hsl + emp.hspc).toFixed(3);
        const luongCD = Math.round(tongHS * BASE_SALARY);
        const daUng   = calcAdvance(luongCD);
        const qtLuong = luongCD - daUng;
        const anCa    = 770000;  // placeholder
        const cdTg    = 0;       // placeholder
        const tong    = qtLuong + anCa + cdTg + (emp.truyLinh || 0) - (emp.truyThu || 0);

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

  /* ── Build nested headers ── */
  function buildHeaders(thang, nam) {
    const h1 = [
      { label: 'TT',                      colspan: 1 },
      { label: 'Họ và tên',               colspan: 1 },
      { label: 'Mã cán bộ',               colspan: 1 },
      { label: 'Số TK',                   colspan: 1 },
      { label: 'Hệ số<br/>lương',         colspan: 1 },
      { label: 'Hệ số<br/>PC',            colspan: 1 },
      { label: 'Tổng<br/>hệ số',          colspan: 1 },
      { label: 'Lương chế độ<br/>1 tháng', colspan: 1 },
      { label: `Đã tạm ứng<br/>T${thang}/${nam}`, colspan: 1 },
      { label: 'Lĩnh tiền',               colspan: 3 },
      { label: 'Truy lĩnh',               colspan: 1 },
      { label: 'Truy thu',                colspan: 1 },
      { label: 'TỔNG LĨNH',               colspan: 1 },
      { label: 'Ghi chú',                 colspan: 1 },
    ];
    const h2 = [
      '', '', '', '', '', '', '', '', '',
      'QT lương<br/>chế độ', 'Ăn ca', 'Ca đêm<br/>thêm giờ',
      '', '', '', '',
    ];
    return [h1, h2];
  }

  /* ── Build column config ── */
  function buildCols() {
    const C   = 'htCenter htMiddle';
    const L   = 'htLeft   htMiddle';
    const R   = 'htRight  htMiddle';
    const HS  = { type:'numeric', numericFormat:{ pattern:'0.000' } };
    const FMT = { type:'numeric', numericFormat:{ pattern:'0,0'   } };
    return [
      { data:0,  readOnly:true, type:'numeric', width:35,  className: C },
      { data:1,  readOnly:true, type:'text',    width:145, className: L },
      { data:2,  readOnly:true, type:'text',    width:105, className: C },
      { data:3,  readOnly:true, type:'text',    width:118, className: C },
      // Hệ số — center
      { data:4,  ...HS, width:46, className: C },
      { data:5,  ...HS, width:46, className: C },
      { data:6,  readOnly:true, ...HS, width:48, className: C },
      // Tiền lớn — right
      { data:7,  readOnly:true, ...FMT, width:100, className: R },
      { data:8,  readOnly:true, ...FMT, width:100, className: R },
      { data:9,  readOnly:true, ...FMT, width:100, className: R },
      { data:10, readOnly:true, ...FMT, width:88,  className: R },
      { data:11, readOnly:true, ...FMT, width:88,  className: R },
      // Truy lĩnh / truy thu — editable, right
      { data:12, ...FMT, width:82, className: R },
      { data:13, ...FMT, width:82, className: R },
      // TỔNG LĨNH — right + highlight
      { data:14, readOnly:true, ...FMT, width:108, className: R + ' qt-total' },
      // Ghi chú — center
      { data:15, type:'text', width:90, className: C },
    ];
  }

  /* ── initHot ── */
  function initHot(thang, nam) {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('qtHotContainer');
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
      columnHeaderHeight: [38, 26],
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
        if (row % 2 === 0) classes.push('qt-even-row');
        if (col === 1) classes.push('htLeft');
        else if (col >= 7 && col <= 14) classes.push('htRight');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (col === 14)    classes.push('qt-total');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        const affected = new Set(changes.filter(([,,,src]) => src !== 'recalc').map(([r]) => r));
        affected.forEach(ri => recalcTotal(ri));
      },

      afterGetColHeader(col, th) {
        if ([4, 5, 6, 7, 8, 9, 11].includes(col)) {
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

  /* ── Recalc TỔNG LĨNH ── */
  function recalcTotal(ri) {
    if (!hotInstance || deptSet.has(ri)) return;
    const qt = parseFloat(hotInstance.getDataAtCell(ri, 9))  || 0;
    const ac = parseFloat(hotInstance.getDataAtCell(ri, 10)) || 0;
    const cd = parseFloat(hotInstance.getDataAtCell(ri, 11)) || 0;
    const tl = parseFloat(hotInstance.getDataAtCell(ri, 12)) || 0;
    const tt = parseFloat(hotInstance.getDataAtCell(ri, 13)) || 0;
    hotInstance.setDataAtCell(ri, 14, qt + ac + cd + tl - tt || '', 'recalc');
  }

  /* ── Export CSV ── */
  function exportCSV() {
    if (!hotInstance) return;
    const t = document.getElementById('qtThang')?.value || '';
    const n = document.getElementById('qtNam')?.value   || '';
    hotInstance.getPlugin('exportFile').downloadFile('csv', {
      bom: true, columnHeaders: true, fileExtension: 'csv',
      filename: `QuyetToan_T${t}_${n}`, mimeType: 'text/csv',
      rowDelimiter: '\r\n', rowHeaders: false,
    });
  }

  function refresh() {
    const thang = parseInt(document.getElementById('qtThang')?.value) || new Date().getMonth() + 1;
    const nam   = parseInt(document.getElementById('qtNam')?.value)   || new Date().getFullYear();
    initHot(thang, nam);
  }

  /* ── Init ── */
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
    document.getElementById('qtDoiTuong0')?.addEventListener('change', refresh);
    document.getElementById('qtDoiTuong1')?.addEventListener('change', refresh);
    document.getElementById('qtExcel')?.addEventListener('click', exportCSV);
    setTimeout(refresh, 150);

    let _t = null;
    const _cb = () => {
      if (_initializing) return;
      const page = document.querySelector('.page-section.active');
      if (page?.id === 'page-quyet-toan') { clearTimeout(_t); _t = setTimeout(refresh, 300); }
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(_cb);
      const el = document.querySelector('.main') || document.getElementById('qtHotContainer');
      if (el) ro.observe(el);
    } else { window.addEventListener('resize', _cb); }
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'quyet-toan') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
