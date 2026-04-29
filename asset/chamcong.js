/**
 * chamcong.js — Quản lý chấm công với Handsontable
 */
(function () {
  'use strict';

  /* ── Constants ── */
  const Q_MONTHS = { 1: [1, 2, 3], 2: [4, 5, 6], 3: [7, 8, 9], 4: [10, 11, 12] };
  const MONTH_LBL = { 1: 'T1', 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7', 8: 'T8', 9: 'T9', 10: 'T10', 11: 'T11', 12: 'T12' };
  const SUB_COLS = {
    'thoi-gian': ['LV', 'H', 'P', 'L', 'OTS', 'CD', 'KL'],
    'ca-dem': ['LCD', 'HCD', 'PCD', 'OTSCD'],
    'them-gio': ['OT', 'OTN', 'OTH']
  };
  const FIXED = 3; // STT | Họ và tên | Số TK

  /* ── Sample data ── */
  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV', employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', stk: '1234567891', data: {} },
        { stt: 2, name: 'Bùi Hiểu Bảng', stk: '2468357911', data: {} },
        { stt: 3, name: 'Đỗ Trung Kiên', stk: '103923558735', data: {} },
        { stt: 4, name: 'Dương Văn Minh', stk: '5494825544', data: {} },
        { stt: 5, name: 'Hà Thu Vân', stk: '1236547899', data: {} },
        { stt: 6, name: 'Vũ Duy Hưng', stk: '9876543211', data: {} },
        { stt: 7, name: 'Đặng Thu Trang', stk: '9876543219', data: {} },
      ]
    },
    {
      name: 'Phòng Kinh doanh', employees: [
        { stt: 8, name: 'Đỗ Anh Thư', stk: '109876914691', data: {} },
        { stt: 9, name: 'Đỗ Đức Thịnh', stk: '9876543219', data: {} },
        { stt: 10, name: 'Lê Hà Trang', stk: '3216549871', data: {} },
        { stt: 11, name: 'Nguyễn Anh Tài', stk: '2143658790', data: {} },
        { stt: 12, name: 'Nguyễn Anh Tú', stk: '2134365879', data: {} },
        { stt: 13, name: 'Nguyễn Thu Trang', stk: '5240914905', data: {} },
      ]
    },
    {
      name: 'Phòng Kỹ thuật', employees: [
        { stt: 14, name: 'Nguyễn Thị Mai', stk: '12345678', data: {} },
        { stt: 15, name: 'Nguyễn Tú Anh', stk: '1234548954', data: {} },
      ]
    },
    {
      name: 'Phòng Nhân sự', employees: [
        { stt: 16, name: 'Nguyễn Phương Anh', stk: '1256789834', data: {} },
      ]
    },
    {
      name: 'Phòng Kế toán', employees: [
        { stt: 17, name: 'Nguyễn Bá Quốc Cường', stk: '3423463456', data: { 4: { LV: 2 } } },
        { stt: 18, name: 'Dương Đức Lự', stk: '0945780029346', data: { 4: { LV: 2 } } },
      ]
    },
    {
      name: 'Phòng Công nghệ', employees: [
        { stt: 19, name: 'Đoàn Trung Quốc', stk: '948422354', data: {} },
      ]
    },
    {
      name: 'Phòng Chất Lượng', employees: [
        { stt: 20, name: 'Nguyễn Văn Kiên', stk: '2498458346', data: {} },
      ]
    },
  ];

  /* ── State ── */
  let hotInstance = null;
  let deptRowSet = new Set();
  let _initializing = false;

  /* ── Build flat data for Handsontable ── */
  function buildData(q, colType) {
    const months = Q_MONTHS[q];
    const subCols = SUB_COLS[colType];
    const totalCols = FIXED + months.length * subCols.length + 1;
    const rows = [];
    deptRowSet = new Set();

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptRowSet.add(di);
      const dr = new Array(totalCols).fill('');
      dr[1] = dept.name; // Move to index 1
      rows.push(dr);

      dept.employees.forEach(emp => {
        const row = new Array(totalCols).fill('');
        row[0] = emp.stt;
        row[1] = emp.name;
        row[2] = emp.stk;
        let total = 0;
        months.forEach((m, mi) => {
          subCols.forEach((sc, si) => {
            const idx = FIXED + mi * subCols.length + si;
            const v = emp.data[m] && emp.data[m][sc] != null ? emp.data[m][sc] : '';
            row[idx] = v;
            if (v !== '') total += Number(v);
          });
        });
        row[totalCols - 1] = total > 0 ? total : '';
        rows.push(row);
      });
    });
    return rows;
  }

  /* ── Build nested headers ── */
  function buildHeaders(q, colType) {
    const months = Q_MONTHS[q];
    const subCols = SUB_COLS[colType];
    const h1 = [
      { label: 'STT', colspan: 1 },
      { label: 'Họ và tên', colspan: 1 },
      { label: 'Số TK', colspan: 1 },
    ];
    months.forEach(m => h1.push({ label: MONTH_LBL[m], colspan: subCols.length }));
    h1.push({ label: `Tổng hợp Q${q}`, colspan: 1 });

    // h2: empty string cho cot fixed va total → Handsontable se tu rowspan 2 rows
    const h2 = ['', '', ''];
    months.forEach(() => subCols.forEach(sc => h2.push(sc)));
    h2.push('');

    return [h1, h2];
  }

  /* ── Build column config ── */
  function buildCols(q, colType) {
    const months = Q_MONTHS[q];
    const subCols = SUB_COLS[colType];
    const cols = [
      { data: 0, readOnly: true, width: 35, type: 'text', className: 'htCenter htMiddle cc-fixed' },
      { data: 1, readOnly: true, width: 140, type: 'text', className: 'htLeft   htMiddle cc-fixed' },
      { data: 2, readOnly: true, width: 100, type: 'text', className: 'htCenter htMiddle cc-fixed' },
    ];
    let ci = FIXED;
    months.forEach(() => {
      subCols.forEach(() => {
        cols.push({ data: ci++, type: 'numeric', width: 36, className: 'htCenter htMiddle' });
      });
    });
    cols.push({ data: ci, readOnly: true, type: 'numeric', width: 48, className: 'htCenter htMiddle cc-total' });
    return cols;
  }

  /* ── Custom dept row renderer ── */
  function deptRenderer(instance, td, row) {
    td.innerHTML = '';
    td.style.cssText = 'background:#DBEAFE;color:#1E40AF;font-weight:700;font-size:12px;padding:5px 8px;border-bottom:1px solid #93C5FD;';
    if (row === 0 || instance.getDataAtCell(row, 1) === instance.getDataAtCell(row, 1)) {
      td.textContent = instance.getDataAtCell(row, 1) || '';
    }
  }

  /* ── Init / re-init Handsontable ── */
  function initHot(q, year, colType) {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('ccHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data = buildData(q, colType);
    const headers = buildHeaders(q, colType);
    const cols = buildCols(q, colType);
    const totalCols = cols.length;

    const merges = [];
    deptRowSet.forEach(ri => merges.push({ row: ri, col: 0, rowspan: 1, colspan: totalCols }));

    if (hotInstance) { hotInstance.destroy(); hotInstance = null; }

    container.style.height = 'auto';

    hotInstance = new Handsontable(container, {
      data,
      nestedHeaders: headers,
      columns: cols,
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

      afterChange(changes) {
        if (!changes) return;
        const affectedRows = new Set(changes.map(([r]) => r));
        affectedRows.forEach(ri => recalcTotal(ri));
      },

      afterRender() {
        // Cho phép ResizeObserver hoạt động lại sau khi render xong
        setTimeout(() => { _initializing = false; }, 400);
      },
    });
  }

  /* ── Recalculate total for a row ── */
  function recalcTotal(rowIdx) {
    if (!hotInstance || deptRowSet.has(rowIdx)) return;
    const row = hotInstance.getDataAtRow(rowIdx);
    const last = row.length - 1;
    let sum = 0;
    for (let c = FIXED; c < last; c++) {
      const v = parseFloat(row[c]);
      if (!isNaN(v)) sum += v;
    }
    hotInstance.setDataAtCell(rowIdx, last, sum > 0 ? sum : '', 'recalc');
  }

  /* ── Export CSV ── */
  function exportCSV() {
    if (!hotInstance) return;
    try {
      const plugin = hotInstance.getPlugin('exportFile');
      plugin.downloadFile('csv', {
        bom: true,
        columnHeaders: true,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: 'csv',
        filename: 'ChamCong_' + new Date().toISOString().slice(0, 10),
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: false,
      });
    } catch (e) {
      alert('Xuat file that bai: ' + e.message);
    }
  }

  /* ── Refresh ── */
  function refresh() {
    const q = parseInt(document.getElementById('ccQuy')?.value || 2);
    const yr = parseInt(document.getElementById('ccNam')?.value || new Date().getFullYear());
    const tp = document.querySelector('input[name="ccLoai"]:checked')?.value || 'thoi-gian';
    initHot(q, yr, tp);
  }

  /* ── Init ── */
  function init() {
    // Year select
    const ySel = document.getElementById('ccNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 2; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }

    // Event listeners
    document.getElementById('ccQuy')?.addEventListener('change', refresh);
    document.getElementById('ccNam')?.addEventListener('change', refresh);
    document.querySelectorAll('input[name="ccLoai"]').forEach(r => r.addEventListener('change', refresh));
    document.getElementById('ccExcel')?.addEventListener('click', exportCSV);

    // Initial render (delayed so container has dimensions)
    setTimeout(refresh, 150);

  }

  /* ── Re-init when page becomes active ── */
  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'chamcong') {
      setTimeout(refresh, 50);
    }
  };

  // Run init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 200);
  }

})();
