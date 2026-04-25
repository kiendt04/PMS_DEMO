/**
 * chamcong.js — Attendance management with Handsontable
 */
(function () {
  'use strict';

  /* ── Constants ── */
  const Q_MONTHS = { 1: [1,2,3], 2: [4,5,6], 3: [7,8,9], 4: [10,11,12] };
  const MONTH_LBL = { 1:'T1',2:'T2',3:'T3',4:'T4',5:'T5',6:'T6',7:'T7',8:'T8',9:'T9',10:'T10',11:'T11',12:'T12' };
  const SUB_COLS = {
    'thoi-gian': ['LV','H','P','L','OTS','CD','KL'],
    'ca-dem':    ['LCD','HCD','PCD','OTSCD'],
    'them-gio':  ['OT','OTN','OTH']
  };
  const FIXED = 3; // STT | Ho va ten | So TK

  /* ── Sample data ── */
  const DEPTS = [
    { name: 'Phong Tong hop HDTV', employees: [
      {stt:1,  name:'Nguyen Kieu Ly',       stk:'1234567891',    data:{}},
      {stt:2,  name:'Bui Hieu Bang',         stk:'2468357911',    data:{}},
      {stt:3,  name:'Do Trung Kien',         stk:'103923558735',  data:{}},
      {stt:4,  name:'Duong Van Minh',        stk:'5494825544',    data:{}},
      {stt:5,  name:'Ha Thu Van',            stk:'1236547899',    data:{}},
      {stt:6,  name:'Vu Duy Hung',           stk:'9876543211',    data:{}},
      {stt:7,  name:'Dang Thu Trang',        stk:'9876543219',    data:{}},
    ]},
    { name: 'Phong Kinh te', employees: [] },
    { name: 'Phong Kinh doanh', employees: [
      {stt:8,  name:'Do Anh Thu',            stk:'109876914691',  data:{}},
      {stt:9,  name:'Do Duc Thinh',          stk:'9876543219',    data:{}},
      {stt:10, name:'Le Ha Trang',           stk:'3216549871',    data:{}},
      {stt:11, name:'Nguyen Anh Tai',        stk:'2143658790',    data:{}},
      {stt:12, name:'Nguyen Anh Tu',         stk:'2134365879',    data:{}},
      {stt:13, name:'Nguyen Thu Trang',      stk:'5240914905',    data:{}},
    ]},
    { name: 'Phong Ky thuat', employees: [
      {stt:14, name:'Nguyen Thi Mai',        stk:'12345678',      data:{}},
      {stt:15, name:'Nguyen Tu Anh',         stk:'1234548954',    data:{}},
    ]},
    { name: 'Phong Nhan su', employees: [
      {stt:16, name:'Nguyen Phuong Anh',     stk:'1256789834',    data:{}},
    ]},
    { name: 'Phong Ke toan', employees: [
      {stt:17, name:'Nguyen Ba Quoc Cuong',  stk:'3423463456',    data:{4:{LV:2}}},
      {stt:18, name:'Duong Duc Lu',          stk:'0945780029346', data:{4:{LV:2}}},
    ]},
    { name: 'Phong Cong nghe', employees: [
      {stt:19, name:'Doan Trung Quoc',       stk:'948422354',     data:{}},
    ]},
    { name: 'Phong Chat Luong', employees: [
      {stt:20, name:'Nguyen Van Kien',       stk:'2498458346',    data:{}},
    ]},
  ];

  /* ── State ── */
  let hotInstance = null;
  let deptRowSet  = new Set();

  /* ── Build flat data for Handsontable ── */
  function buildData(q, colType) {
    const months  = Q_MONTHS[q];
    const subCols = SUB_COLS[colType];
    const totalCols = FIXED + months.length * subCols.length + 1;
    const rows = [];
    deptRowSet = new Set();

    DEPTS.forEach(dept => {
      // Dept header row
      const di = rows.length;
      deptRowSet.add(di);
      const dRow = new Array(totalCols).fill('');
      dRow[1] = dept.name;
      rows.push(dRow);

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
    const months  = Q_MONTHS[q];
    const subCols = SUB_COLS[colType];
    const h1 = [
      {label:'STT',colspan:1},
      {label:'Ho va ten',colspan:1},
      {label:'So TK',colspan:1},
    ];
    months.forEach(m => h1.push({label: MONTH_LBL[m], colspan: subCols.length}));
    h1.push({label: `Tong hop Q${q}`, colspan: 1});

    const h2 = ['STT','Ho va ten','So TK'];
    months.forEach(() => subCols.forEach(sc => h2.push(sc)));
    h2.push('Tong');

    return [h1, h2];
  }

  /* ── Build column config ── */
  function buildCols(q, colType) {
    const months  = Q_MONTHS[q];
    const subCols = SUB_COLS[colType];
    const cols = [
      {data:0, readOnly:true, width:45,  type:'text', className:'htCenter htMiddle cc-fixed'},
      {data:1, readOnly:true, width:165, type:'text', className:'htLeft htMiddle cc-fixed'},
      {data:2, readOnly:true, width:120, type:'text', className:'htLeft htMiddle cc-fixed'},
    ];
    let ci = FIXED;
    months.forEach(() => {
      subCols.forEach(() => {
        cols.push({data:ci++, type:'numeric', width:40, className:'htCenter htMiddle'});
      });
    });
    cols.push({data:ci, readOnly:true, type:'numeric', width:52, className:'htCenter htMiddle cc-total'});
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
    const container = document.getElementById('ccHotContainer');
    if (!container || typeof Handsontable === 'undefined') return;

    const data    = buildData(q, colType);
    const headers = buildHeaders(q, colType);
    const cols    = buildCols(q, colType);
    const totalCols = cols.length;

    // Merge cells for dept rows
    const merges = [];
    deptRowSet.forEach(ri => {
      merges.push({ row: ri, col: 0, rowspan: 1, colspan: totalCols });
    });

    if (hotInstance) {
      hotInstance.destroy();
      hotInstance = null;
    }

    const containerH = Math.max(300, Math.min(data.length * 26 + 80, window.innerHeight - 260));
    container.style.height = containerH + 'px';

    hotInstance = new Handsontable(container, {
      data:           data,
      nestedHeaders:  headers,
      columns:        cols,
      rowHeaders:     false,
      fixedColumnsStart: FIXED,
      height:         containerH,
      width:          '100%',
      stretchH:       'none',
      autoColumnSize: false,
      mergeCells:     merges,
      licenseKey:     'non-commercial-and-evaluation',
      renderAllRows:  false,

      cells(row) {
        if (deptRowSet.has(row)) {
          return {
            readOnly: true,
            renderer: function(inst, td, r, c) {
              if (c === 0) {
                td.innerHTML = '';
                td.style.cssText = 'background:#DBEAFE;color:#1E40AF;font-weight:700;font-size:12px;padding:5px 8px;border-bottom:1px solid #BFDBFE;border-right:1px solid #E2E8F0;';
                td.textContent = inst.getDataAtCell(r, 1) || '';
              } else {
                td.innerHTML = '';
                td.style.cssText = 'background:#DBEAFE;border-bottom:1px solid #BFDBFE;border-right:1px solid #E2E8F0;';
              }
            }
          };
        }
        if (row % 2 === 0) {
          return { className: 'cc-even-row' };
        }
        return {};
      },

      afterChange(changes) {
        if (!changes) return;
        const affectedRows = new Set(changes.map(([r]) => r));
        affectedRows.forEach(ri => recalcTotal(ri));
      },
    });
  }

  /* ── Recalculate total for a row ── */
  function recalcTotal(rowIdx) {
    if (!hotInstance || deptRowSet.has(rowIdx)) return;
    const row  = hotInstance.getDataAtRow(rowIdx);
    const last = row.length - 1;
    let sum    = 0;
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
        filename: 'ChamCong_' + new Date().toISOString().slice(0,10),
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
    const q  = parseInt(document.getElementById('ccQuy')?.value || 2);
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
    if (page === 'chamcong' && !hotInstance) {
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
