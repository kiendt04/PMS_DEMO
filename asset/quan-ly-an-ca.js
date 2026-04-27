/**
 * quan-ly-an-ca.js — Quản lý chi tiền ăn ca với Handsontable
 * Alignment: tên → htLeft | tiền → htRight | còn lại → htCenter
 */
(function () {
  'use strict';

  const FIXED = 4; // STT | Họ và tên | Mã NV | Số TK
  const MEAL_RATE = { l1: 35000, l2: 17500, l3: 45000, l4: 22000 };

  /* ── Mock data ── */
  const DEPTS = [
    { name: 'Phòng Tổng hợp HĐTV', employees: [
      { stt:1,  name:'Nguyễn Kiều Ly',       ma:'NV001', stk:'1234567891',    l1:22, l2:0, l3:0,  l4:0 },
      { stt:2,  name:'Bùi Hiểu Bảng',        ma:'NV002', stk:'2468357911',    l1:20, l2:2, l3:0,  l4:0 },
      { stt:3,  name:'Đỗ Trung Kiên',         ma:'NV003', stk:'103923558735',  l1:22, l2:0, l3:3,  l4:0 },
      { stt:4,  name:'Dương Văn Minh',        ma:'NV004', stk:'5494825544',    l1:18, l2:4, l3:0,  l4:2 },
      { stt:5,  name:'Hà Thu Vân',            ma:'NV005', stk:'1236547899',    l1:22, l2:0, l3:0,  l4:0 },
      { stt:6,  name:'Vũ Duy Hưng',           ma:'NV006', stk:'9876543211',    l1:22, l2:0, l3:5,  l4:3 },
      { stt:7,  name:'Đặng Thu Trang',        ma:'NV007', stk:'9876543219',    l1:20, l2:0, l3:2,  l4:0 },
    ]},
    { name: 'Phòng Kinh doanh', employees: [
      { stt:8,  name:'Đỗ Anh Thư',            ma:'NV008', stk:'109876914691',  l1:22, l2:0, l3:0,  l4:4 },
      { stt:9,  name:'Đỗ Đức Thịnh',          ma:'NV009', stk:'9876543219',    l1:21, l2:1, l3:3,  l4:0 },
      { stt:10, name:'Lê Hà Trang',           ma:'NV010', stk:'3216549871',    l1:22, l2:0, l3:0,  l4:0 },
      { stt:11, name:'Nguyễn Anh Tài',        ma:'NV011', stk:'2143658790',    l1:19, l2:3, l3:0,  l4:0 },
      { stt:12, name:'Nguyễn Anh Tú',         ma:'NV012', stk:'2134365879',    l1:22, l2:0, l3:0,  l4:2 },
      { stt:13, name:'Nguyễn Thu Trang',      ma:'NV013', stk:'5240914905',    l1:22, l2:0, l3:4,  l4:0 },
    ]},
    { name: 'Phòng Kỹ thuật', employees: [
      { stt:14, name:'Nguyễn Thị Mai',        ma:'NV014', stk:'12345678',      l1:22, l2:0, l3:6,  l4:4 },
      { stt:15, name:'Nguyễn Tú Anh',         ma:'NV015', stk:'1234548954',    l1:20, l2:2, l3:0,  l4:0 },
    ]},
    { name: 'Phòng Nhân sự', employees: [
      { stt:16, name:'Nguyễn Phương Anh',     ma:'NV016', stk:'1256789834',    l1:22, l2:0, l3:0,  l4:0 },
    ]},
    { name: 'Phòng Kế toán', employees: [
      { stt:17, name:'Nguyễn Bá Quốc Cường',  ma:'NV017', stk:'3423463456',    l1:22, l2:0, l3:2,  l4:0 },
      { stt:18, name:'Dương Đức Lự',           ma:'NV018', stk:'0945780029346', l1:22, l2:0, l3:3,  l4:1 },
    ]},
    { name: 'Phòng Công nghệ', employees: [
      { stt:19, name:'Đoàn Trung Quốc',        ma:'NV019', stk:'948422354',     l1:22, l2:0, l3:0,  l4:5 },
    ]},
    { name: 'Phòng Chất Lượng', employees: [
      { stt:20, name:'Nguyễn Văn Kiên',        ma:'NV020', stk:'2498458346',    l1:21, l2:1, l3:0,  l4:0 },
    ]},
  ];

  let hotInstance = null;
  let deptSet     = new Set();
  let _initializing = false;

  /* ── Calc tiền ── */
  function calcMoney(emp) {
    const ac    = emp.l1 * MEAL_RATE.l1 + emp.l2 * MEAL_RATE.l2;
    const cd    = emp.l3 * MEAL_RATE.l3;
    const tg    = emp.l4 * MEAL_RATE.l4;
    return { ac, cd, tg, total: ac + cd + tg };
  }

  /* ── Build data ── */
  function buildData() {
    const rows = [];
    deptSet = new Set();
    const NCOLS = FIXED + 4 + 4 + 1; // fixed(4) + loại công(4) + tiền(3) + ghi chú(1) = chú ý: index 8=ac,9=cd,10=tg,11=tổng,12=ghichu

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dRow = new Array(13).fill('');
      dRow[0] = dept.name;
      rows.push(dRow);
      dept.employees.forEach(emp => {
        const { ac, cd, tg, total } = calcMoney(emp);
        rows.push([
          emp.stt, emp.name, emp.ma, emp.stk,
          emp.l1 || '', emp.l2 || '', emp.l3 || '', emp.l4 || '',
          ac || '', cd || '', tg || '', total || '', '',
        ]);
      });
    });
    return rows;
  }

  /* ── Build nested headers ── */
  function buildHeaders(thang, nam) {
    const h1 = [
      { label: 'TT',                    colspan: 1 },
      { label: 'Họ và tên',             colspan: 1 },
      { label: 'Mã NV',                 colspan: 1 },
      { label: 'Số TK',                 colspan: 1 },
      { label: `Số công hưởng ăn ca T${thang}/${nam}`, colspan: 4 },
      { label: 'Các khoản tiền (đồng)', colspan: 3 },
      { label: 'TỔNG LĨNH',             colspan: 1 },
      { label: 'Ghi chú',               colspan: 1 },
    ];
    const h2 = [
      '', '', '', '',
      'TC (22c)', 'Nửa ngày (11c)', 'Ca đêm', 'Thêm giờ',
      'Ăn ca', 'Ca đêm', 'Thêm giờ',
      '', '',
    ];
    return [h1, h2];
  }

  /* ── Build cols ── */
  function buildCols() {
    const C  = 'htCenter htMiddle';
    const L  = 'htLeft   htMiddle';
    const R  = 'htRight  htMiddle';
    const FMT = { pattern: '0,0' };
    return [
      { data:0,  readOnly:true, type:'numeric', width:35,  className: C },
      { data:1,  readOnly:true, type:'text',    width:145, className: L },
      { data:2,  readOnly:true, type:'text',    width:75,  className: C },
      { data:3,  readOnly:true, type:'text',    width:115, className: C },
      // Số công — center
      { data:4,  type:'numeric', width:52, className: C },
      { data:5,  type:'numeric', width:52, className: C },
      { data:6,  type:'numeric', width:52, className: C },
      { data:7,  type:'numeric', width:52, className: C },
      // Tiền — right
      { data:8,  readOnly:true, type:'numeric', numericFormat:FMT, width:92,  className: R },
      { data:9,  readOnly:true, type:'numeric', numericFormat:FMT, width:88,  className: R },
      { data:10, readOnly:true, type:'numeric', numericFormat:FMT, width:88,  className: R },
      // TỔNG LĨNH — right + highlight
      { data:11, readOnly:true, type:'numeric', numericFormat:FMT, width:100, className: R + ' ac-total' },
      // Ghi chú — center
      { data:12, type:'text', width:110, className: C },
    ];
  }

  /* ── initHot ── */
  function initHot(thang, nam) {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('acHotContainer');
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
      columnHeaderHeight: [38, 22],
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
        if (row % 2 === 0) classes.push('ac-even-row');
        if (col === 1) classes.push('htLeft');
        else if (col >= 8 && col <= 11) classes.push('htRight');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (col === 11) classes.push('ac-total');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        const affected = new Set(changes.filter(([,,,src]) => src !== 'recalc').map(([r]) => r));
        affected.forEach(ri => recalcRow(ri));
      },

      afterGetColHeader(col, th) {
        if ([4, 5, 6, 7].includes(col)) {
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

  /* ── Recalc ── */
  function recalcRow(ri) {
    if (!hotInstance || deptSet.has(ri)) return;
    const l1 = parseFloat(hotInstance.getDataAtCell(ri, 4)) || 0;
    const l2 = parseFloat(hotInstance.getDataAtCell(ri, 5)) || 0;
    const l3 = parseFloat(hotInstance.getDataAtCell(ri, 6)) || 0;
    const l4 = parseFloat(hotInstance.getDataAtCell(ri, 7)) || 0;
    const ac = l1 * MEAL_RATE.l1 + l2 * MEAL_RATE.l2;
    const cd = l3 * MEAL_RATE.l3;
    const tg = l4 * MEAL_RATE.l4;
    hotInstance.setDataAtCell([
      [ri, 8,  ac || '',            'recalc'],
      [ri, 9,  cd || '',            'recalc'],
      [ri, 10, tg || '',            'recalc'],
      [ri, 11, (ac+cd+tg) || '',   'recalc'],
    ]);
  }

  /* ── Export CSV ── */
  function exportCSV() {
    if (!hotInstance) return;
    const t = document.getElementById('acThang')?.value || '';
    const n = document.getElementById('acNam')?.value   || '';
    hotInstance.getPlugin('exportFile').downloadFile('csv', {
      bom: true, columnHeaders: true, fileExtension: 'csv',
      filename: `AnCa_T${t}_${n}`, mimeType: 'text/csv',
      rowDelimiter: '\r\n', rowHeaders: false,
    });
  }

  function refresh() {
    const thang = parseInt(document.getElementById('acThang')?.value) || new Date().getMonth() + 1;
    const nam   = parseInt(document.getElementById('acNam')?.value)   || new Date().getFullYear();
    initHot(thang, nam);
  }

  /* ── Init ── */
  function init() {
    const ySel = document.getElementById('acNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 2; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }
    document.getElementById('acThang')?.addEventListener('change', refresh);
    document.getElementById('acNam')?.addEventListener('change', refresh);
    document.getElementById('acExcel')?.addEventListener('click', exportCSV);
    setTimeout(refresh, 150);

    let _t = null;
    const _cb = () => {
      if (_initializing) return;
      const page = document.querySelector('.page-section.active');
      if (page?.id === 'page-quan-ly-an-ca') { clearTimeout(_t); _t = setTimeout(refresh, 300); }
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(_cb);
      const el = document.querySelector('.main') || document.getElementById('acHotContainer');
      if (el) ro.observe(el);
    } else { window.addEventListener('resize', _cb); }
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'quan-ly-an-ca') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
