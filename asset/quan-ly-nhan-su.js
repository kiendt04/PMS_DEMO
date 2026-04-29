/**
 * quan-ly-nhan-su.js — Quản lý nhân sự (nhân viên)
 * Được thiết kế dựa trên TblUsers/Index.cshtml
 */
(function () {
  'use strict';

  let hotInstance = null;

  const EMPLOYEES = [
    { stt: 1,  ma: 'NV001', name: 'Nguyễn Kiều Ly',       dept: 'Phòng Tổng hợp HĐTV', pos: 'Trưởng phòng', dob: '15/05/1990', acc: 'lynk',  stk: '1234567891', hsl: 3.66, email: 'lynk@pms.com', note: '' },
    { stt: 2,  ma: 'NV002', name: 'Bùi Hiểu Bảng',        dept: 'Phòng Tổng hợp HĐTV', pos: 'Phó phòng',    dob: '20/10/1985', acc: 'bangbh', stk: '2468357911', hsl: 4.98, email: 'bangbh@pms.com', note: '' },
    { stt: 3,  ma: 'NV003', name: 'Đỗ Trung Kiên',         dept: 'Phòng Tổng hợp HĐTV', pos: 'Chuyên viên',  dob: '12/03/1992', acc: 'kiendt', stk: '103923558735', hsl: 3.33, email: 'kiendt@pms.com', note: '' },
    { stt: 4,  ma: 'NV004', name: 'Dương Văn Minh',        dept: 'Phòng Tổng hợp HĐTV', pos: 'Chuyên viên',  dob: '05/08/1988', acc: 'minhdv', stk: '5494825544', hsl: 3.99, email: 'minhdv@pms.com', note: '' },
    { stt: 5,  ma: 'NV005', name: 'Hà Thu Vân',            dept: 'Phòng Kế toán',     pos: 'Kế toán trưởng', dob: '22/12/1987', acc: 'vanht',  stk: '1236547899', hsl: 4.55, email: 'vanht@pms.com', note: '' }
  ];

  function buildHeaders() {
    return ['STT', 'Mã nhân viên', 'Họ và tên', 'Phòng ban', 'Chức vụ', 'Ngày sinh', 'Tên tài khoản', 'Số tài khoản', 'Hệ số', 'Email', 'Thao tác'];
  }

  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    const R = 'htRight  htMiddle';
    return [
      { data: 'stt', readOnly: true, width: 45, className: C },
      { data: 'ma', width: 90, className: C },
      { data: 'name', width: 180, className: L },
      { data: 'dept', width: 180, className: L },
      { data: 'pos', width: 130, className: L },
      { data: 'dob', width: 95, className: C },
      { data: 'acc', width: 100, className: C },
      { data: 'stk', width: 120, className: C },
      { data: 'hsl', type: 'numeric', numericFormat: { pattern: '0.000' }, width: 80, className: R },
      { data: 'email', width: 160, className: L },
      {
        data: 'actions', readOnly: true, width: 80, className: C,
        renderer: function (instance, td, row, col, prop, value, cellProperties) {
          td.innerHTML = `<div style="display:flex;gap:10px;justify-content:center;cursor:pointer;">
            <svg title="Sửa" onclick="nsEdit(${row})" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <svg title="Xóa" onclick="nsDelete(${row})" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
          </div>`;
          return td;
        }
      }
    ];
  }

  function initHot() {
    const container = document.getElementById('nsHotContainer');
    if (!container || typeof Handsontable === 'undefined') return;

    if (hotInstance) hotInstance.destroy();
    container.style.height = 'auto';

    hotInstance = new Handsontable(container, {
      data: EMPLOYEES,
      colHeaders: buildHeaders(),
      columns: buildCols(),
      rowHeaders: false,
      height: 'auto',
      width: '100%',
      stretchH: 'all',
      autoColumnSize: true,
      renderAllRows: true,
      fixedColumnsStart: 3,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeights: 32,
      columnHeaderHeight: 40,
      
      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
        th.style.textAlign = 'center';
        th.style.fontWeight = '700';
      }
    });

    const totalEl = document.getElementById('nsTotal');
    if (totalEl) totalEl.textContent = `Tổng cộng: ${EMPLOYEES.length} nhân viên`;
  }

  window.nsOpenAdd = function() {
    alert('Mở form thêm nhân viên mới (Create.cshtml pattern)');
  };
  window.nsEdit = function(row) {
    alert('Sửa nhân viên: ' + EMPLOYEES[row].name);
  };
  window.nsDelete = function(row) {
    if(confirm('Bạn có chắc muốn xóa nhân viên ' + EMPLOYEES[row].name + '?')) {
        alert('Đã xóa!');
    }
  };

  // Search logic
  document.getElementById('nsSearch')?.addEventListener('input', function(e) {
    const val = e.target.value.toLowerCase();
    if (!hotInstance) return;
    const filtered = EMPLOYEES.filter(r => 
      r.name.toLowerCase().includes(val) || 
      r.ma.toLowerCase().includes(val) ||
      r.acc.toLowerCase().includes(val)
    );
    hotInstance.loadData(filtered);
  });

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'dm-nguoi-dung') setTimeout(initHot, 100);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.querySelector('.nav-item.active')?.dataset.page === 'dm-nguoi-dung') initHot();
    });
  } else {
    setTimeout(() => {
       if (document.querySelector('.nav-item.active')?.dataset.page === 'dm-nguoi-dung') initHot();
    }, 500);
  }

})();
