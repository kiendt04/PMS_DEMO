/**
 * he-so-luong.js — Quản lý hệ số lương với Handsontable
 * Alignment: Tên → Right | Còn lại → Center
 */
(function () {
  'use strict';

  const FIXED = 3; // STT | Họ và tên | Mã NV

  /* ── Mock data ── */
  const DEPTS = [
    { name: 'Phòng Tổng hợp HĐTV', employees: [
      { stt:1,  name:'Nguyễn Kiều Ly',       ma:'NV001', chucVu:'Trưởng phòng', hsl:3.00, hspc:0.50 },
      { stt:2,  name:'Bùi Hiểu Bảng',        ma:'NV002', chucVu:'Phó phòng',    hsl:2.66, hspc:0.30 },
      { stt:3,  name:'Đỗ Trung Kiên',         ma:'NV003', chucVu:'Chuyên viên',  hsl:2.34, hspc:0.20 },
      { stt:4,  name:'Dương Văn Minh',        ma:'NV004', chucVu:'Chuyên viên',  hsl:2.34, hspc:0.20 },
      { stt:5,  name:'Hà Thu Vân',            ma:'NV005', chucVu:'Chuyên viên',  hsl:2.34, hspc:0.20 },
      { stt:6,  name:'Vũ Duy Hưng',           ma:'NV006', chucVu:'Nhân viên',    hsl:2.00, hspc:0.10 },
      { stt:7,  name:'Đặng Thu Trang',        ma:'NV007', chucVu:'Nhân viên',    hsl:2.00, hspc:0.10 },
    ]},
    { name: 'Phòng Kinh doanh', employees: [
      { stt:8,  name:'Đỗ Anh Thư',            ma:'NV008', chucVu:'Trưởng phòng', hsl:3.00, hspc:0.50 },
      { stt:9,  name:'Đỗ Đức Thịnh',          ma:'NV009', chucVu:'Phó phòng',    hsl:2.66, hspc:0.30 },
      { stt:10, name:'Lê Hà Trang',           ma:'NV010', chucVu:'Nhân viên',    hsl:2.00, hspc:0.10 },
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
      const dRow = new Array(8).fill('');
      dRow[0] = dept.name;
      rows.push(dRow);
      dept.employees.forEach(emp => {
        rows.push([
          emp.stt, emp.name, emp.ma, emp.chucVu,
          emp.hsl, emp.hspc, +(emp.hsl + emp.hspc).toFixed(3),
          ''
        ]);
      });
    });
    return rows;
  }

  /* ── Build headers ── */
  function buildHeaders() {
    return [
      ['STT', 'Họ và tên', 'Mã NV', 'Chức vụ', 'Hệ số lương', 'Hệ số PC', 'Tổng hệ số', 'Ghi chú']
    ];
  }

  /* ── Build cols ── */
  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    return [
      { data:0, readOnly:true, type:'numeric', width:40,  className: C },
      { data:1, readOnly:true, type:'text',    width:150, className: L },
      { data:2, readOnly:true, type:'text',    width:80,  className: C },
      { data:3, type:'text', width:120, className: C },
      { data:4, type:'numeric', numericFormat:{pattern:'0.000'}, width:70, className: C },
      { data:5, type:'numeric', numericFormat:{pattern:'0.000'}, width:70, className: C },
      { data:6, readOnly:true, type:'numeric', numericFormat:{pattern:'0.000'}, width:70, className: C },
      { data:7, type:'text', width:120, className: C },
    ];
  }

  /* ── initHot ── */
  function initHot() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('hslHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data    = buildData();
    const headers = buildHeaders();
    const cols    = buildCols();

    const merges = [];
    deptSet.forEach(ri => merges.push({ row: ri, col: 0, rowspan: 1, colspan: cols.length }));

    if (hotInstance) { hotInstance.destroy(); hotInstance = null; }
    container.style.height = 'auto';

    hotInstance = new Handsontable(container, {
      data,
      colHeaders:        headers[0],
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
        if (row % 2 === 0) classes.push('hsl-even-row');
        if (col === 1) classes.push('htLeft');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        const affected = new Set(changes.filter(([,,,src]) => src !== 'recalc').map(([r]) => r));
        affected.forEach(ri => {
          if (deptSet.has(ri)) return;
          const h1 = parseFloat(hotInstance.getDataAtCell(ri, 4)) || 0;
          const h2 = parseFloat(hotInstance.getDataAtCell(ri, 5)) || 0;
          hotInstance.setDataAtCell(ri, 6, +(h1 + h2).toFixed(3), 'recalc');
        });
      },

      afterRender() {
        setTimeout(() => { _initializing = false; }, 400);
      },
    });
  }

  function refresh() { initHot(); }

  function exportCSV() {
    if (!hotInstance) return;
    hotInstance.getPlugin('exportFile').downloadFile('csv', {
      bom: true, columnHeaders: true, fileExtension: 'csv',
      filename: 'HeSoLuong_' + new Date().toISOString().slice(0, 10),
      mimeType: 'text/csv', rowDelimiter: '\r\n', rowHeaders: false,
    });
  }

  /* ── Init ── */
  function init() {
    document.getElementById('hslDoiTuong')?.addEventListener('change', refresh);
    document.getElementById('hslExcel')?.addEventListener('click', exportCSV);
    setTimeout(refresh, 150);

    let _t = null;
    const _cb = () => {
      if (_initializing) return;
      const page = document.querySelector('.page-section.active');
      if (page?.id === 'page-he-so-luong') { clearTimeout(_t); _t = setTimeout(refresh, 300); }
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(_cb);
      const el = document.querySelector('.main') || document.getElementById('hslHotContainer');
      if (el) ro.observe(el);
    } else { window.addEventListener('resize', _cb); }
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'he-so-luong') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
