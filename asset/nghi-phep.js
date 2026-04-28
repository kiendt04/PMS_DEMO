/**
 * nghi-phep.js — Quản lý nghỉ phép với Handsontable
 * Pattern: chamcong.js / tam-ung-luong.js
 * Alignment: tên → htLeft, số ngày/phép → htCenter
 */
(function () {
  'use strict';

  const MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  const FIXED = 3; // STT | Họ và tên | Mã NV

  /* ── Mock data ── */
  const DEPTS = [
    { name: 'Phòng Tổng hợp HĐTV', employees: [
      { stt:1,  name:'Nguyễn Kiều Ly',       ma:'NV001', ngayVL:'2018-03-01', phepCD:15, monthly:[0,0,1,0,0,0,1,0,0,1,0,0] },
      { stt:2,  name:'Bùi Hiểu Bảng',        ma:'NV002', ngayVL:'2020-06-15', phepCD:12, monthly:[0,0,0,0,0,0,0,0,1,0,1,0] },
      { stt:3,  name:'Đỗ Trung Kiên',         ma:'NV003', ngayVL:'2019-01-10', phepCD:14, monthly:[0,1,0,0,0,1,0,1,0,0,1,0] },
      { stt:4,  name:'Dương Văn Minh',        ma:'NV004', ngayVL:'2021-09-20', phepCD:12, monthly:[0,0,0,0,0,0,0,0,0,1,0,0] },
      { stt:5,  name:'Hà Thu Vân',            ma:'NV005', ngayVL:'2017-05-11', phepCD:16, monthly:[1,0,0,0,1,0,0,1,0,0,1,1] },
      { stt:6,  name:'Vũ Duy Hưng',           ma:'NV006', ngayVL:'2022-02-28', phepCD:12, monthly:[0,0,0,0,0,0,0,0,0,0,0,0] },
      { stt:7,  name:'Đặng Thu Trang',        ma:'NV007', ngayVL:'2016-07-04', phepCD:18, monthly:[0,0,0,1,1,0,1,0,0,1,1,1] },
    ]},
    { name: 'Phòng Kinh doanh', employees: [
      { stt:8,  name:'Đỗ Anh Thư',            ma:'NV008', ngayVL:'2019-11-01', phepCD:14, monthly:[0,0,0,1,0,0,0,0,0,1,1,0] },
      { stt:9,  name:'Đỗ Đức Thịnh',          ma:'NV009', ngayVL:'2020-03-15', phepCD:12, monthly:[0,0,0,0,0,1,0,0,0,1,0,0] },
      { stt:10, name:'Lê Hà Trang',           ma:'NV010', ngayVL:'2018-08-22', phepCD:15, monthly:[0,0,0,0,1,1,0,0,0,0,1,1] },
      { stt:11, name:'Nguyễn Anh Tài',        ma:'NV011', ngayVL:'2021-01-05', phepCD:12, monthly:[0,0,0,0,0,0,0,0,0,0,1,0] },
      { stt:12, name:'Nguyễn Anh Tú',         ma:'NV012', ngayVL:'2023-04-10', phepCD:12, monthly:[0,0,0,0,0,0,0,0,0,0,0,0] },
      { stt:13, name:'Nguyễn Thu Trang',      ma:'NV013', ngayVL:'2017-12-01', phepCD:17, monthly:[0,1,0,0,1,0,0,1,0,0,1,1] },
    ]},
    { name: 'Phòng Kỹ thuật', employees: [
      { stt:14, name:'Nguyễn Thị Mai',        ma:'NV014', ngayVL:'2019-06-18', phepCD:14, monthly:[0,0,0,0,0,0,0,0,0,1,1,0] },
      { stt:15, name:'Nguyễn Tú Anh',         ma:'NV015', ngayVL:'2022-10-03', phepCD:12, monthly:[0,0,0,0,0,0,0,0,0,0,1,0] },
    ]},
    { name: 'Phòng Nhân sự', employees: [
      { stt:16, name:'Nguyễn Phương Anh',     ma:'NV016', ngayVL:'2020-07-14', phepCD:12, monthly:[0,0,0,0,1,0,0,0,0,0,0,1] },
    ]},
    { name: 'Phòng Kế toán', employees: [
      { stt:17, name:'Nguyễn Bá Quốc Cường',  ma:'NV017', ngayVL:'2015-03-22', phepCD:18, monthly:[1,0,0,0,1,0,1,0,1,0,1,1] },
      { stt:18, name:'Dương Đức Lự',           ma:'NV018', ngayVL:'2018-09-10', phepCD:15, monthly:[0,0,0,1,0,0,1,0,0,1,0,1] },
    ]},
    { name: 'Phòng Công nghệ', employees: [
      { stt:19, name:'Đoàn Trung Quốc',        ma:'NV019', ngayVL:'2021-05-17', phepCD:12, monthly:[0,0,0,0,0,0,0,0,0,0,1,0] },
    ]},
    { name: 'Phòng Chất Lượng', employees: [
      { stt:20, name:'Nguyễn Văn Kiên',        ma:'NV020', ngayVL:'2019-02-28', phepCD:14, monthly:[0,0,0,0,0,1,0,0,0,1,1,0] },
    ]},
  ];

  let hotInstance = null;
  let deptSet     = new Set();
  let _initializing = false;

  /* ── Build data ── */
  function buildData(year) {
    const rows = [];
    deptSet = new Set();
    const NCOLS = FIXED + 8 + 12 + 1; // fixed + info(5) + stats(3) + months(12) + chuyen(1)

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dRow = new Array(NCOLS).fill('');
      dRow[0] = dept.name;
      rows.push(dRow);

      dept.employees.forEach(emp => {
        const hireDate = new Date(emp.ngayVL);
        const refDate  = new Date(year, 11, 31);
        let yrs = refDate.getFullYear() - hireDate.getFullYear();
        let mos = refDate.getMonth()    - hireDate.getMonth();
        if (mos < 0) { yrs--; mos += 12; }

        const totalOff  = emp.monthly.reduce((s, v) => s + (v || 0), 0);
        const conLai    = Math.max(emp.phepCD - totalOff, 0);

        const row = new Array(NCOLS).fill('');
        row[0]  = emp.stt;
        row[1]  = emp.name;
        row[2]  = emp.ma;
        row[3]  = hireDate.getDate();
        row[4]  = hireDate.getMonth() + 1;
        row[5]  = hireDate.getFullYear();
        row[6]  = yrs;
        row[7]  = mos;
        row[8]  = emp.phepCD;
        row[9]  = totalOff;
        row[10] = conLai;
        emp.monthly.forEach((v, i) => { row[11 + i] = v || ''; });
        row[23] = conLai; // Chuyển sang năm sau
        rows.push(row);
      });
    });
    return rows;
  }

  /* ── Build nested headers ── */
  function buildHeaders(year) {
    const h1 = [
      { label: 'TT', rowspan: 2 },
      { label: 'HỌ VÀ TÊN', rowspan: 2 },
      { label: 'MÃ NV', rowspan: 2 },
      { label: 'NGÀY TUYỂN DỤNG', colspan: 3 },
      { label: `SỐ NĂM LĐ ĐẾN 31/12/${year}`, colspan: 2 },
      { label: 'PHÉP THEO<br/>CHẾ ĐỘ', rowspan: 2 },
      { label: 'ĐÃ NGHỈ', rowspan: 2 },
      { label: 'CÒN LẠI', rowspan: 2 },
      { label: 'CHI TIẾT TỪNG THÁNG', colspan: 12 },
      { label: `CHUYỂN SANG<br/>01/${year + 1}`, rowspan: 2 },
    ];
    // SKIP các cột đã có rowspan: 2 ở h1
    const h2 = [
      'Ngày', 'Tháng', 'Năm',
      'Năm', 'Tháng',
      ...MONTH_LABELS
    ];
    return [h1, h2];
  }

  /* ── Build column config ── */
  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    const cols = [
      { data:0,  readOnly:true, type:'numeric', width:35,  className: C },
      { data:1,  readOnly:true, type:'text',    width:145, className: L },
      { data:2,  readOnly:true, type:'text',    width:75,  className: C },
      { data:3,  readOnly:true, type:'numeric', width:38,  className: C }, // Ngày
      { data:4,  readOnly:true, type:'numeric', width:38,  className: C }, // Tháng
      { data:5,  readOnly:true, type:'numeric', width:46,  className: C }, // Năm
      { data:6,  readOnly:true, type:'numeric', width:38,  className: C }, // Năm LĐ
      { data:7,  readOnly:true, type:'numeric', width:42,  className: C }, // Tháng LĐ
      { data:8,  readOnly:true, type:'numeric', width:52,  className: C }, // Phép CD
      { data:9,  readOnly:true, type:'numeric', width:48,  className: C }, // Đã nghỉ
      { data:10, readOnly:true, type:'numeric', width:48,  className: C }, // Còn lại
    ];
    // 12 tháng — editable
    for (let i = 0; i < 12; i++) {
      cols.push({ data: 11 + i, type:'numeric', width:32, className: C });
    }
    // Chuyển phép
    cols.push({ data:23, readOnly:true, type:'numeric', width:55, className: C });
    return cols;
  }

  /* ── initHot ── */
  function initHot(year) {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('npHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data      = buildData(year);
    const headers   = buildHeaders(year);
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
      renderAllRows:     true,
      mergeCells:        merges,
      licenseKey:        'non-commercial-and-evaluation',
      rowHeights:        26,
      columnHeaderHeight: [40, 26],

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
        if (row % 2 === 0) classes.push('np-even-row');
        if (col === 1) classes.push('htLeft');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        const affected = new Set(changes.filter(([,,,src]) => src !== 'recalc').map(([r]) => r));
        affected.forEach(ri => recalcRow(ri));
      },

      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
        th.style.textAlign = 'center';
        // Wrap text cho các header dài
        if ([3, 6, 7, 8, 9, 10, 23].includes(col)) {
          th.style.whiteSpace = 'normal';
          th.style.lineHeight = '1.2';
          th.style.padding = '2px 4px';
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
    let total = 0;
    for (let c = 11; c <= 22; c++) {
      const v = parseFloat(hotInstance.getDataAtCell(ri, c));
      if (!isNaN(v)) total += v;
    }
    const phepCD = parseFloat(hotInstance.getDataAtCell(ri, 8)) || 0;
    const conLai = Math.max(phepCD - total, 0);
    hotInstance.setDataAtCell([
      [ri, 9,  total,  'recalc'],
      [ri, 10, conLai, 'recalc'],
      [ri, 23, conLai, 'recalc'],
    ]);
  }

  /* ── Export CSV ── */
  function exportCSV() {
    if (!hotInstance) return;
    hotInstance.getPlugin('exportFile').downloadFile('csv', {
      bom: true, columnHeaders: true, fileExtension: 'csv',
      filename: `NghiPhep_${getYear()}`,
      mimeType: 'text/csv', rowDelimiter: '\r\n', rowHeaders: false,
    });
  }

  function getYear() { return parseInt(document.getElementById('npNam')?.value) || new Date().getFullYear(); }
  function refresh() { initHot(getYear()); }

  /* ── Init ── */
  function init() {
    const ySel = document.getElementById('npNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 2; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }
    document.getElementById('npNam')?.addEventListener('change', refresh);
    document.getElementById('npExcel')?.addEventListener('click', exportCSV);
    setTimeout(refresh, 150);

    let _t = null;
    const _cb = () => {
      if (_initializing) return;
      const page = document.querySelector('.page-section.active');
      if (page?.id === 'page-nghi-phep') { clearTimeout(_t); _t = setTimeout(refresh, 300); }
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(_cb);
      const el = document.querySelector('.main') || document.getElementById('npHotContainer');
      if (el) ro.observe(el);
    } else { window.addEventListener('resize', _cb); }
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'nghi-phep') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
