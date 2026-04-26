/**
 * an-toan-dien.js — Quan ly an toan dien with Handsontable (3-level headers)
 */
(function () {
  'use strict';

  const Q_MONTHS = { 1:[1,2,3], 2:[4,5,6], 3:[7,8,9], 4:[10,11,12] };
  const MONTH_LBL = {1:'Tháng 1',2:'Tháng 2',3:'Tháng 3',4:'Tháng 4',5:'Tháng 5',6:'Tháng 6',7:'Tháng 7',8:'Tháng 8',9:'Tháng 9',10:'Tháng 10',11:'Tháng 11',12:'Tháng 12'};
  // Per month: 4 cols = 1 (so ngay cong ATD) + 3 (Kcvi, Knqi, Ki)
  const SUB_PER_MONTH = 4;
  const FIXED = 3;

  const DEPTS = [
    { name:'Phòng Tổng hợp HĐTV', employees:[
      {stt:1,  name:'Nguyễn Kiều Ly',      stk:'1234567891'},
      {stt:2,  name:'Bùi Hiểu Bảng',       stk:'2468357911'},
      {stt:3,  name:'Đỗ Trung Kiên',        stk:'103923558735'},
      {stt:4,  name:'Dương Văn Minh',       stk:'5494825544'},
      {stt:5,  name:'Hà Thu Vân',           stk:'1236547899'},
      {stt:6,  name:'Vũ Duy Hưng',          stk:'9876543211'},
    ]},
    { name:'Phòng Kinh tế', employees:[
      {stt:7,  name:'Đặng Thu Trang',       stk:'9876543219'},
    ]},
    { name:'Phòng Kinh doanh', employees:[
      {stt:8,  name:'Đỗ Anh Thư',           stk:'109876914691'},
      {stt:9,  name:'Đỗ Đức Thịnh',         stk:'9876543219'},
      {stt:10, name:'Lê Hà Trang',          stk:'3216549871'},
      {stt:11, name:'Nguyễn Anh Tài',       stk:'2143658790'},
      {stt:12, name:'Nguyễn Anh Tú',        stk:'2134365879'},
      {stt:13, name:'Nguyễn Thu Trang',     stk:'5240914905'},
    ]},
    { name:'Phòng Kỹ thuật', employees:[
      {stt:14, name:'Nguyễn Thị Mai',       stk:'12345678'},
      {stt:15, name:'Nguyễn Tú Anh',        stk:'1234548954'},
    ]},
    { name:'Phòng Nhân sự', employees:[
      {stt:16, name:'Nguyễn Phương Anh',    stk:'1256789834'},
    ]},
    { name:'Phòng Kế toán', employees:[
      {stt:17, name:'Nguyễn Bá Quốc Cường', stk:'3423463456'},
      {stt:18, name:'Dương Đức Tú',         stk:'0945780029346'},
    ]},
    { name:'Phòng Marketing', employees:[
      {stt:19, name:'Đoàn Trung Quốc',      stk:'948422354'},
    ]},
    { name:'Phòng Chất Lượng', employees:[
      {stt:20, name:'Nguyễn Văn Kiên',      stk:'2498458346'},
    ]},
  ];

  let hotATD   = null;
  let deptSet  = new Set();

  /* ── Build data ── */
  function buildData(q) {
    const months = Q_MONTHS[q];
    const totalCols = FIXED + months.length * SUB_PER_MONTH;
    const rows = [];
    deptSet = new Set();

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dr = new Array(totalCols).fill('');
      dr[1] = dept.name;
      rows.push(dr);
      dept.employees.forEach(emp => {
        const row = new Array(totalCols).fill('');
        row[0] = emp.stt;
        row[1] = emp.name;
        row[2] = emp.stk;
        rows.push(row);
      });
    });
    return rows;
  }

  /* ── Build 3-level nested headers ── */
  function buildHeaders(q) {
    const months = Q_MONTHS[q];
    // Level 1: fixed + month groups
    const h1 = [
      {label:'STT', colspan:1},
      {label:'Họ và tên', colspan:1},
      {label:'Số TK', colspan:1},
    ];
    months.forEach(m => h1.push({label: MONTH_LBL[m], colspan: SUB_PER_MONTH}));

    // Level 2: fixed empty + per month: 'Số ngày công được thưởng ATĐ'(1) + 'Hệ số đánh giá'(3)
    const h2 = ['', '', ''];
    months.forEach(() => {
      h2.push({label:'Số ngày công được thưởng ATĐ', colspan:1});
      h2.push({label:'Hệ số đánh giá', colspan:3});
    });

    // Level 3: fixed empty + per month: '' (for ngay cong) + Kcvi, Knqi, Ki
    const h3 = ['', '', ''];
    months.forEach(() => {
      h3.push('');     // ngay cong col
      h3.push('Kcvi');
      h3.push('Knqi');
      h3.push('Ki');
    });

    return [h1, h2, h3];
  }

  /* ── Build columns ── */
  function buildCols(q) {
    const months = Q_MONTHS[q];
    const cols = [
      {data:0, readOnly:true, width:38,  type:'text', className:'htCenter htMiddle'},
      {data:1, readOnly:true, width:145, type:'text', className:'htLeft   htMiddle'},
      {data:2, readOnly:true, width:110, type:'text', className:'htLeft   htMiddle'},
    ];
    let ci = FIXED;
    months.forEach(() => {
      cols.push({data:ci++, type:'numeric', width:55, className:'htCenter htMiddle'}); // ngay cong ATD
      cols.push({data:ci++, type:'numeric', width:42, className:'htCenter htMiddle'}); // Kcvi
      cols.push({data:ci++, type:'numeric', width:42, className:'htCenter htMiddle'}); // Knqi
      cols.push({data:ci++, type:'numeric', width:38, className:'htCenter htMiddle'}); // Ki
    });
    return cols;
  }

  /* ── Init ── */
  function initATD(q) {
    const container = document.getElementById('atdHotContainer');
    if (!container || typeof Handsontable === 'undefined') return;

    const data    = buildData(q);
    const headers = buildHeaders(q);
    const cols    = buildCols(q);

    const merges = [];
    deptSet.forEach(ri => merges.push({row:ri, col:0, rowspan:1, colspan:cols.length}));

    if (hotATD) { hotATD.destroy(); hotATD = null; }

    // Height = remaining viewport from container top
    const rect = container.getBoundingClientRect();
    const h    = Math.max(300, window.innerHeight - rect.top - 16);
    container.style.height = h + 'px';

    hotATD = new Handsontable(container, {
      data,
      nestedHeaders:       headers,
      columns:             cols,
      rowHeaders:          false,
      fixedColumnsStart:   FIXED,
      height:              h,
      width:               '100%',
      stretchH:            'last',
      autoColumnSize:      false,
      mergeCells:          merges,
      licenseKey:          'non-commercial-and-evaluation',
      rowHeights:          24,
      columnHeaderHeight:  [24, 36, 22],   // [month row, "Số ngày công..." row, Kcvi/Knqi/Ki row]
      viewportRowRenderingOffset: 'auto',

      cells(row) {
        if (deptSet.has(row)) {
          return {
            readOnly: true,
            renderer(inst, td, r, c) {
              td.innerHTML = '';
              td.style.background   = '#DBEAFE';
              td.style.borderBottom = '1px solid #93C5FD';
              td.style.borderRight  = '1px solid #BFDBFE';
              td.style.height       = '24px';
              if (c === 0) {
                td.style.color      = '#1E40AF';
                td.style.fontWeight = '700';
                td.style.fontSize   = '12px';
                td.style.padding    = '0 8px';
                td.textContent = inst.getDataAtCell(r, 1) || '';
              }
            }
          };
        }
        return row % 2 === 0 ? { className:'atd-even-row' } : {};
      },
    });
  }

  function refresh() {
    const q = parseInt(document.getElementById('atdQuy')?.value || 2);
    initATD(q);
  }

  function exportATD() {
    if (!hotATD) return;
    hotATD.getPlugin('exportFile').downloadFile('csv', {
      bom:true, columnHeaders:true, fileExtension:'csv',
      filename:'AnToanDien_' + new Date().toISOString().slice(0,10),
      mimeType:'text/csv', rowDelimiter:'\r\n', rowHeaders:false,
    });
  }

  /* ── Page activate hook ── */
  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'an-toan-dien' && !hotATD) setTimeout(refresh, 50);
  };

  /* ── Init listeners after DOM ── */
  function init() {
    // Year select
    const ySel = document.getElementById('atdNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 1; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }
    // Dept select
    const pbSel = document.getElementById('atdPhongBan');
    if (pbSel && pbSel.options.length <= 1) {
      DEPTS.forEach(d => {
        const o = document.createElement('option');
        o.value = d.name; o.textContent = d.name;
        pbSel.appendChild(o);
      });
    }
    document.getElementById('atdQuy')?.addEventListener('change', refresh);
    document.getElementById('atdNam')?.addEventListener('change', refresh);
    document.getElementById('atdExcel')?.addEventListener('click', exportATD);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 250);

})();
