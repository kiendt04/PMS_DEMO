/**
 * tam-ung-luong.js — Quản lý tạm ứng lương với Handsontable
 * Thiết kế đồng bộ với chamcong.js / an-toan-dien.js
 */
(function () {
  'use strict';

  /* ── Constants ── */
  const BASE_SALARY = 3600000;
  const FIXED = 4; // STT | Họ và tên | Mã cán bộ | Số TK

  /* ── Mock data — đồng bộ chamcong.js (bỏ Phòng Kinh tế) ── */
  const DEPTS = [
    { name: 'Phòng Tổng hợp HĐTV', employees: [
      { stt:1,  name:'Nguyễn Kiều Ly',       code:'2020.BKT.7.X0',   stk:'1234567891',    hsl:3.0, hspc:2.0, tu:9000000,  bhxh:1440000, bhyt:270000, bhtn:180000, truylinh:0, truythu:0, note:'' },
      { stt:2,  name:'Bùi Hiểu Bảng',        code:'2021.HDQT.2.X0',  stk:'2468357911',    hsl:2.0, hspc:2.0, tu:7200000,  bhxh:1152000, bhyt:216000, bhtn:144000, truylinh:0, truythu:0, note:'' },
      { stt:3,  name:'Đỗ Trung Kiên',        code:'2025.HDQT.22.C1', stk:'103923558735',  hsl:2.0, hspc:2.0, tu:7200000,  bhxh:1152000, bhyt:216000, bhtn:144000, truylinh:0, truythu:0, note:'' },
      { stt:4,  name:'Dương Văn Minh',       code:'2025.BDT.01.X0',  stk:'5494825544',    hsl:2.0, hspc:2.0, tu:7200000,  bhxh:1152000, bhyt:216000, bhtn:144000, truylinh:0, truythu:0, note:'' },
      { stt:5,  name:'Hà Thu Vân',           code:'2023.HDQT.15.X0', stk:'1236547899',    hsl:2.0, hspc:1.0, tu:5400000,  bhxh:864000,  bhyt:162000, bhtn:108000, truylinh:0, truythu:0, note:'' },
      { stt:6,  name:'Vũ Duy Hưng',          code:'2024.BKT.09.X0',  stk:'9876543211',    hsl:2.0, hspc:0.6, tu:4710000,  bhxh:748800,  bhyt:140400, bhtn:93600,  truylinh:0, truythu:0, note:'' },
      { stt:7,  name:'Đặng Thu Trang',       code:'2022.HDQT.03.X0', stk:'9876543219',    hsl:2.0, hspc:1.5, tu:6300000,  bhxh:1008000, bhyt:189000, bhtn:126000, truylinh:0, truythu:0, note:'' },
    ]},
    { name: 'Phòng Kinh doanh', employees: [
      { stt:8,  name:'Đỗ Anh Thư',           code:'2019.KD.05.X0',   stk:'109876914691',  hsl:2.5, hspc:1.5, tu:7200000,  bhxh:1152000, bhyt:216000, bhtn:144000, truylinh:0, truythu:0, note:'' },
      { stt:9,  name:'Đỗ Đức Thịnh',         code:'2021.KD.08.X0',   stk:'9876543219',    hsl:2.0, hspc:1.0, tu:5400000,  bhxh:864000,  bhyt:162000, bhtn:108000, truylinh:0, truythu:0, note:'' },
      { stt:10, name:'Lê Hà Trang',          code:'2022.KD.11.X0',   stk:'3216549871',    hsl:2.0, hspc:1.2, tu:5760000,  bhxh:921600,  bhyt:172800, bhtn:115200, truylinh:0, truythu:0, note:'' },
      { stt:11, name:'Nguyễn Anh Tài',       code:'2020.KD.04.X0',   stk:'2143658790',    hsl:2.0, hspc:1.0, tu:5400000,  bhxh:864000,  bhyt:162000, bhtn:108000, truylinh:0, truythu:0, note:'' },
      { stt:12, name:'Nguyễn Anh Tú',        code:'2021.KD.09.X0',   stk:'2134365879',    hsl:2.0, hspc:1.0, tu:5400000,  bhxh:864000,  bhyt:162000, bhtn:108000, truylinh:0, truythu:0, note:'' },
      { stt:13, name:'Nguyễn Thu Trang',     code:'2023.KD.13.X0',   stk:'5240914905',    hsl:2.0, hspc:1.2, tu:5760000,  bhxh:921600,  bhyt:172800, bhtn:115200, truylinh:0, truythu:0, note:'' },
    ]},
    { name: 'Phòng Kỹ thuật', employees: [
      { stt:14, name:'Nguyễn Thị Mai',       code:'2021.KT.03.X0',   stk:'12345678',      hsl:2.0, hspc:1.5, tu:6300000,  bhxh:1008000, bhyt:189000, bhtn:126000, truylinh:0, truythu:0, note:'' },
      { stt:15, name:'Nguyễn Tú Anh',        code:'2023.KT.07.X0',   stk:'1234548954',    hsl:2.0, hspc:1.0, tu:5400000,  bhxh:864000,  bhyt:162000, bhtn:108000, truylinh:0, truythu:0, note:'' },
    ]},
    { name: 'Phòng Nhân sự', employees: [
      { stt:16, name:'Nguyễn Phương Anh',    code:'2022.NS.01.X0',   stk:'1256789834',    hsl:2.0, hspc:1.5, tu:6300000,  bhxh:1008000, bhyt:189000, bhtn:126000, truylinh:0, truythu:0, note:'' },
    ]},
    { name: 'Phòng Kế toán', employees: [
      { stt:17, name:'Nguyễn Bá Quốc Cường', code:'2020.KT.02.X0',   stk:'3423463456',    hsl:2.5, hspc:1.0, tu:6300000,  bhxh:1008000, bhyt:189000, bhtn:126000, truylinh:0, truythu:0, note:'' },
      { stt:18, name:'Dương Đức Lự',         code:'2022.KT.04.X0',   stk:'0945780029346', hsl:2.0, hspc:1.0, tu:5400000,  bhxh:864000,  bhyt:162000, bhtn:108000, truylinh:0, truythu:0, note:'' },
    ]},
    { name: 'Phòng Công nghệ', employees: [
      { stt:19, name:'Đoàn Trung Quốc',      code:'2021.CN.02.X0',   stk:'948422354',     hsl:2.0, hspc:1.5, tu:6300000,  bhxh:1008000, bhyt:189000, bhtn:126000, truylinh:0, truythu:0, note:'' },
    ]},
    { name: 'Phòng Chất Lượng', employees: [
      { stt:20, name:'Nguyễn Văn Kiên',      code:'2023.CL.01.X0',   stk:'2498458346',    hsl:2.0, hspc:1.0, tu:5400000,  bhxh:864000,  bhyt:162000, bhtn:108000, truylinh:0, truythu:0, note:'' },
    ]},
  ];

  /* ── State ── */
  let hotTU   = null;
  let deptSet = new Set();
  let _initializing = false;

  /* ── Calculate derived values ── */
  function calcRow(emp) {
    const totalHS  = emp.hsl + emp.hspc;
    const luong1T  = totalHS * BASE_SALARY;
    const tongLinh = emp.tu - (emp.bhxh + emp.bhyt + emp.bhtn) + emp.truylinh - emp.truythu;
    return { totalHS, luong1T, tongLinh };
  }

  /* ── Build flat data ── */
  function buildData() {
    const rows = [];
    deptSet = new Set();
    const NCOLS = FIXED + 12;

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dRow = new Array(NCOLS).fill('');
      dRow[0] = dept.name; // Lưu ở col 0 để renderer dùng value trực tiếp
      rows.push(dRow);

      dept.employees.forEach(emp => {
        const { totalHS, luong1T, tongLinh } = calcRow(emp);
        rows.push([
          emp.stt, emp.name, emp.code, emp.stk,
          emp.hsl, emp.hspc, totalHS, luong1T,
          emp.tu, emp.bhxh, emp.bhyt, emp.bhtn,
          emp.truylinh, emp.truythu, tongLinh, emp.note,
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
      { label: 'Mã cán bộ',             colspan: 1 },
      { label: 'Số TK',                 colspan: 1 },
      { label: 'Hệ số lương',           colspan: 1 },
      { label: 'Hệ số PC',              colspan: 1 },
      { label: 'Tổng hệ số',            colspan: 1 },
      { label: 'Lương chế độ 1 tháng', colspan: 1 },
      { label: `Tạm ứng T${thang}/${nam}`, colspan: 1 },
      { label: 'Mức lương CSDN 3,600,000đ/hsl (thu 10.5%)', colspan: 3 },
      { label: 'Truy lĩnh',             colspan: 1 },
      { label: 'Truy thu',              colspan: 1 },
      { label: 'TỔNG LĨNH',             colspan: 1 },
      { label: 'Ghi chú',               colspan: 1 },
    ];
    const h2 = [
      '', '', '', '', '', '', '', '', '',
      'BHXH (8%)', 'BHYT (1.5%)', 'BHTN (1%)',
      '', '', '', '',
    ];
    return [h1, h2];
  }

  /* ── Build column config ── */
  function buildCols() {
    return [
      { data:0,  readOnly:true, type:'text',    width:35,  className:'htCenter htMiddle' },
      { data:1,  readOnly:true, type:'text',    width:138, className:'htLeft   htMiddle' },
      { data:2,  readOnly:true, type:'text',    width:118, className:'htLeft   htMiddle' },
      { data:3,  readOnly:true, type:'text',    width:100, className:'htLeft   htMiddle' },
      { data:4,  type:'numeric', numericFormat:{pattern:'0.000'}, width:44, className:'htCenter htMiddle' },
      { data:5,  type:'numeric', numericFormat:{pattern:'0.000'}, width:44, className:'htCenter htMiddle' },
      { data:6,  readOnly:true, type:'numeric', numericFormat:{pattern:'0.000'}, width:46, className:'htCenter htMiddle' },
      { data:7,  readOnly:true, type:'numeric', numericFormat:{pattern:'0,0'},   width:100, className:'htRight  htMiddle' },
      { data:8,  type:'numeric', numericFormat:{pattern:'0,0'},   width:100, className:'htRight  htMiddle' },
      { data:9,  type:'numeric', numericFormat:{pattern:'0,0'},   width:82,  className:'htRight  htMiddle' },
      { data:10, type:'numeric', numericFormat:{pattern:'0,0'},   width:82,  className:'htRight  htMiddle' },
      { data:11, type:'numeric', numericFormat:{pattern:'0,0'},   width:72,  className:'htRight  htMiddle' },
      { data:12, type:'numeric', numericFormat:{pattern:'0,0'},   width:72,  className:'htRight  htMiddle' },
      { data:13, type:'numeric', numericFormat:{pattern:'0,0'},   width:72,  className:'htRight  htMiddle' },
      { data:14, readOnly:true, type:'numeric', numericFormat:{pattern:'0,0'},   width:100, className:'htRight  htMiddle tu-total' },
      { data:15, type:'text',    width:90,  className:'htLeft   htMiddle' },
    ];
  }

  /* ── Recalculate derived cols ── */
  function recalcRow(rowIdx) {
    if (!hotTU || deptSet.has(rowIdx)) return;
    const r       = hotTU.getDataAtRow(rowIdx);
    const hsl     = parseFloat(r[4])  || 0;
    const hspc    = parseFloat(r[5])  || 0;
    const tu      = parseFloat(r[8])  || 0;
    const bhxh    = parseFloat(r[9])  || 0;
    const bhyt    = parseFloat(r[10]) || 0;
    const bhtn    = parseFloat(r[11]) || 0;
    const truylin = parseFloat(r[12]) || 0;
    const truythu = parseFloat(r[13]) || 0;

    hotTU.setDataAtCell([
      [rowIdx, 6,  hsl + hspc],
      [rowIdx, 7,  (hsl + hspc) * BASE_SALARY],
      [rowIdx, 14, tu - (bhxh + bhyt + bhtn) + truylin - truythu],
    ], 'recalc');
  }

  /* ── Init / re-init Handsontable ── */
  function initHot() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('tuHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const thang = parseInt(document.getElementById('tuThang')?.value || 4);
    const nam   = parseInt(document.getElementById('tuNam')?.value   || new Date().getFullYear());

    const data    = buildData();
    const headers = buildHeaders(thang, nam);
    const cols    = buildCols();
    const NCOLS   = cols.length;

    const merges = [];
    deptSet.forEach(ri => merges.push({ row: ri, col: 0, rowspan: 1, colspan: NCOLS }));

    if (hotTU) { hotTU.destroy(); hotTU = null; }
    container.style.height = 'auto';

    hotTU = new Handsontable(container, {
      data,
      nestedHeaders:      headers,
      columns:            cols,
      rowHeaders:         false,
      fixedColumnsStart:  FIXED,
      height:             'auto',
      width:              '100%',
      stretchH:           'all',
      autoColumnSize:     false,
      mergeCells:         merges,
      licenseKey:         'non-commercial-and-evaluation',
      rowHeights:         26,
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
        if (row % 2 === 0) classes.push('tu-even-row');
        if (col === 0)  classes.push('htCenter', 'htMiddle');
        if (col === 14) classes.push('tu-total');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        const affected = new Set(
          changes.filter(([,,,src]) => src !== 'recalc').map(([r]) => r)
        );
        affected.forEach(ri => recalcRow(ri));
      },

      // Cho phép header cột HSL / HSPC / Tổng hệ số xuống dòng
      afterGetColHeader(col, th) {
        if ([4, 5, 6].includes(col)) {
          th.style.whiteSpace  = 'normal';
          th.style.lineHeight  = '1.25';
          th.style.padding     = '2px 3px';
          th.style.wordBreak   = 'break-word';
        }
      },

      afterRender() {
        setTimeout(() => { _initializing = false; }, 400);
      },
    });
  }

  /* ── Export CSV ── */
  function exportCSV() {
    if (!hotTU) return;
    try {
      hotTU.getPlugin('exportFile').downloadFile('csv', {
        bom: true, columnHeaders: true, fileExtension: 'csv',
        filename: 'TamUngLuong_' + new Date().toISOString().slice(0, 10),
        mimeType: 'text/csv', rowDelimiter: '\r\n', rowHeaders: false,
      });
    } catch (e) { alert('Xuất file thất bại: ' + e.message); }
  }

  /* ── Refresh ── */
  function refresh() { initHot(); }

  /* ── Init ── */
  function init() {
    const ySel = document.getElementById('tuNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 1; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }

    document.getElementById('tuThang')?.addEventListener('change', refresh);
    document.getElementById('tuNam')?.addEventListener('change', refresh);
    document.querySelectorAll('input[name="tuDoiTuong"]').forEach(r => r.addEventListener('change', refresh));
    document.getElementById('tuExcel')?.addEventListener('click', exportCSV);
    document.getElementById('tuTaoBang')?.addEventListener('click', refresh);

    setTimeout(refresh, 150);

    let _resizeTimer = null;
    const _resizeCb = () => {
      if (_initializing) return;
      const page = document.querySelector('.page-section.active');
      if (page && page.id === 'page-tam-ung-luong') {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(refresh, 300);
      }
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(_resizeCb);
      const mainEl = document.querySelector('.main') || document.getElementById('tuHotContainer');
      if (mainEl) ro.observe(mainEl);
    } else {
      window.addEventListener('resize', _resizeCb);
    }
  }

  /* ── Page activate hook ── */
  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'tam-ung-luong') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 250);

})();
