/**
 * an-toan-dien.js — Quản lý an toàn điện với Handsontable (3-level headers)
 * Hoàn thiện: filter phòng ban kết nối vào HOT, Import/Export Excel
 */
(function () {
  'use strict';

  const Q_MONTHS = { 1:[1,2,3], 2:[4,5,6], 3:[7,8,9], 4:[10,11,12] };
  const MONTH_LBL = {1:'Tháng 1',2:'Tháng 2',3:'Tháng 3',4:'Tháng 4',5:'Tháng 5',6:'Tháng 6',7:'Tháng 7',8:'Tháng 8',9:'Tháng 9',10:'Tháng 10',11:'Tháng 11',12:'Tháng 12'};
  // Per month: 4 cols = 1 (so ngay cong ATD) + 3 (Kcvi, Knqi, Ki)
  const SUB_PER_MONTH = 4;
  const FIXED = 3;

  const DEPTS = [
    { name: 'Phòng Tổng hợp HĐTV', employees: [
      {stt:1,  name:'Nguyễn Kiều Ly',       stk:'1234567891',    data:{}},
      {stt:2,  name:'Bùi Hiểu Bảng',         stk:'2468357911',    data:{}},
      {stt:3,  name:'Đỗ Trung Kiên',         stk:'103923558735',  data:{}},
      {stt:4,  name:'Dương Văn Minh',        stk:'5494825544',    data:{}},
      {stt:5,  name:'Hà Thu Vân',            stk:'1236547899',    data:{}},
      {stt:6,  name:'Vũ Duy Hưng',           stk:'9876543211',    data:{}},
      {stt:7,  name:'Đặng Thu Trang',        stk:'9876543219',    data:{}},
    ]},
    { name: 'Phòng Kinh doanh', employees: [
      {stt:8,  name:'Đỗ Anh Thư',            stk:'109876914691',  data:{}},
      {stt:9,  name:'Đỗ Đức Thịnh',          stk:'9876543219',    data:{}},
      {stt:10, name:'Lê Hà Trang',           stk:'3216549871',    data:{}},
      {stt:11, name:'Nguyễn Anh Tài',        stk:'2143658790',    data:{}},
      {stt:12, name:'Nguyễn Anh Tú',         stk:'2134365879',    data:{}},
      {stt:13, name:'Nguyễn Thu Trang',      stk:'5240914905',    data:{}},
    ]},
    { name: 'Phòng Kỹ thuật', employees: [
      {stt:14, name:'Nguyễn Thị Mai',        stk:'12345678',      data:{}},
      {stt:15, name:'Nguyễn Tú Anh',         stk:'1234548954',    data:{}},
    ]},
    { name: 'Phòng Nhân sự', employees: [
      {stt:16, name:'Nguyễn Phương Anh',     stk:'1256789834',    data:{}},
    ]},
    { name: 'Phòng Kế toán', employees: [
      {stt:17, name:'Nguyễn Bá Quốc Cường',  stk:'3423463456',    data:{4:{LV:2}}},
      {stt:18, name:'Dương Đức Lự',          stk:'0945780029346', data:{4:{LV:2}}},
    ]},
    { name: 'Phòng Công nghệ', employees: [
      {stt:19, name:'Đoàn Trung Quốc',       stk:'948422354',     data:{}},
    ]},
    { name: 'Phòng Chất Lượng', employees: [
      {stt:20, name:'Nguyễn Văn Kiên',       stk:'2498458346',    data:{}},
    ]},
  ];

  let hotATD   = null;
  let deptSet  = new Set();
  let _initializing = false;

  /* ── Get filtered DEPTS based on current phong ban selection ── */
  function getFilteredDepts() {
    const pbVal = document.getElementById('atdPhongBan')?.value || '';
    if (!pbVal) return DEPTS;
    return DEPTS.filter(d => d.name === pbVal);
  }

  /* ── Build data ── */
  function buildData(q) {
    const months = Q_MONTHS[q];
    const totalCols = FIXED + months.length * SUB_PER_MONTH;
    const rows = [];
    deptSet = new Set();

    getFilteredDepts().forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dr = new Array(totalCols).fill('');
      dr[0] = dept.name; // Lưu ở col 0 để renderer dùng value trực tiếp
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

  /* ── Build columns — compact widths, giống chamcong ── */
  function buildCols(q) {
    const months = Q_MONTHS[q];
    const cols = [
      {data:0, readOnly:true, width:35,  type:'text', className:'htCenter htMiddle'},
      {data:1, readOnly:true, width:140, type:'text', className:'htLeft   htMiddle'},
      {data:2, readOnly:true, width:100, type:'text', className:'htLeft   htMiddle'},
    ];
    let ci = FIXED;
    months.forEach(() => {
      cols.push({data:ci++, type:'numeric', width:48, className:'htCenter htMiddle'}); // ngay cong ATD
      cols.push({data:ci++, type:'numeric', width:36, className:'htCenter htMiddle'}); // Kcvi
      cols.push({data:ci++, type:'numeric', width:36, className:'htCenter htMiddle'}); // Knqi
      cols.push({data:ci++, type:'numeric', width:36, className:'htCenter htMiddle'}); // Ki
    });
    return cols;
  }

  /* ── Init ── */
  function initATD(q) {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('atdHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data    = buildData(q);
    const headers = buildHeaders(q);
    const cols    = buildCols(q);

    const merges = [];
    deptSet.forEach(ri => merges.push({row:ri, col:0, rowspan:1, colspan:cols.length}));

    if (hotATD) { hotATD.destroy(); hotATD = null; }
    container.style.height = 'auto';

    hotATD = new Handsontable(container, {
      data,
      nestedHeaders:       headers,
      columns:             cols,
      rowHeaders:          false,
      fixedColumnsStart:   FIXED,
      height:              'auto',
      width:               '100%',
      stretchH:            'all',
      autoColumnSize:      false,
      mergeCells:          merges,
      licenseKey:          'non-commercial-and-evaluation',
      rowHeights:          24,
      columnHeaderHeight:  [24, 36, 22],
      viewportRowRenderingOffset: 'auto',

      cells(row, col) {
        if (deptSet.has(row)) {
          return {
            readOnly: true,
            renderer(inst, td, r, c, prop, value) {
              td.innerHTML = '';
              td.style.cssText = 'background:#DBEAFE;border-bottom:1px solid #93C5FD;border-right:1px solid #BFDBFE;height:24px;';
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
        let classes = [];
        if (row % 2 === 0) classes.push('atd-even-row');
        if (col === 0) classes.push('htCenter', 'htMiddle');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterRender() {
        setTimeout(() => { _initializing = false; }, 400);
      },
    });
  }

  function refresh() {
    const q = parseInt(document.getElementById('atdQuy')?.value || 2);
    initATD(q);
  }

  /* ── Export Excel (CSV) ── */
  function exportATD() {
    if (!hotATD) return;
    try {
      hotATD.getPlugin('exportFile').downloadFile('csv', {
        bom:true, columnHeaders:true, fileExtension:'csv',
        filename:'AnToanDien_' + new Date().toISOString().slice(0,10),
        mimeType:'text/csv', rowDelimiter:'\r\n', rowHeaders:false,
      });
    } catch (e) {
      alert('Xuất file thất bại: ' + e.message);
    }
  }

  /* ── Import Excel (file picker) ── */
  function importATD() {
    // Create hidden file input
    let fileInput = document.getElementById('_atdFileInput');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = '_atdFileInput';
      fileInput.accept = '.csv,.xlsx,.xls';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      fileInput.addEventListener('change', function () {
        const file = this.files && this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          // Parse CSV simply (demo – a real impl would use SheetJS)
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter(l => l.trim());
          if (lines.length < 2) {
            alert('File không có dữ liệu hợp lệ.');
            return;
          }
          // Show success notification
          showNotif('✅ Đã nhập ' + (lines.length - 1) + ' dòng từ file "' + file.name + '"', 'success');
        };
        reader.onerror = function () {
          alert('Không đọc được file. Vui lòng thử lại.');
        };
        reader.readAsText(file, 'utf-8');
        // Reset so same file can be re-selected
        fileInput.value = '';
      });
    }
    fileInput.click();
  }

  /* ── Toast notification ── */
  function showNotif(msg, type) {
    let notif = document.getElementById('_atdNotif');
    if (!notif) {
      notif = document.createElement('div');
      notif.id = '_atdNotif';
      notif.style.cssText = [
        'position:fixed','bottom:24px','right:24px','z-index:9999',
        'padding:12px 20px','border-radius:10px','font-size:13.5px','font-weight:500',
        'box-shadow:0 4px 20px rgba(0,0,0,.15)','transition:opacity .3s','opacity:0',
        'pointer-events:none'
      ].join(';');
      document.body.appendChild(notif);
    }
    notif.textContent = msg;
    if (type === 'success') {
      notif.style.background = '#F0FDF4';
      notif.style.color      = '#166534';
      notif.style.border     = '1px solid #86EFAC';
    } else {
      notif.style.background = '#FEF2F2';
      notif.style.color      = '#991B1B';
      notif.style.border     = '1px solid #FECACA';
    }
    notif.style.opacity = '1';
    clearTimeout(notif._timer);
    notif._timer = setTimeout(() => { notif.style.opacity = '0'; }, 3500);
  }

  /* ── Page activate hook ── */
  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'an-toan-dien') {
      // Always full re-init so width is recalculated after layout change (sidebar toggle, etc.)
      setTimeout(refresh, 50);
    }
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

    // Event listeners — tất cả filter đều refresh lại bảng
    document.getElementById('atdQuy')?.addEventListener('change', refresh);
    document.getElementById('atdNam')?.addEventListener('change', refresh);
    document.getElementById('atdPhongBan')?.addEventListener('change', refresh);

    // Import / Export buttons
    document.getElementById('atdExcel')?.addEventListener('click', exportATD);

    // Import button – tìm theo text "Import Excel"
    document.querySelectorAll('#page-an-toan-dien .btn-cat-add').forEach(btn => {
      if (btn.textContent.includes('Import')) {
        btn.addEventListener('click', importATD);
      }
    });

    // ResizeObserver — observe .main chứ không observe HOT container trực tiếp
    let _resizeTimer = null;
    const _resizeCb = () => {
      if (_initializing) return;
      const page = document.querySelector('.page-section.active');
      if (page && page.id === 'page-an-toan-dien') {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(refresh, 300);
      }
    };

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(_resizeCb);
      const mainEl = document.querySelector('.main') || document.getElementById('atdHotContainer');
      if (mainEl) ro.observe(mainEl);
    } else {
      window.addEventListener('resize', _resizeCb);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 250);

})();
