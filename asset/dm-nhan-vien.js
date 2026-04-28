/**
 * dm-nhan-vien.js — Quản lý nhân viên (Personnel Management)
 * Dựa trên cấu trúc TblUsers/Index.cshtml
 */
(function () {
  'use strict';

  let hotInstance = null;

  function buildHeaders() {
    return [
      'STT', 'Mã nhân viên', 'Họ và tên', 'Phòng ban', 'Chức vụ', 
      'Ngày sinh', 'Tài khoản', 'Số tài khoản', 'Hệ số lương', 'Email', 'Thao tác'
    ];
  }

  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    return [
      { data: 'stt', readOnly: true, width: 45, className: C },
      { data: 'userCode', width: 100, className: C },
      { data: 'name', width: 180, className: L },
      { data: 'department', width: 180, className: L },
      { data: 'position', width: 140, className: L },
      { data: 'dob', type: 'date', dateFormat: 'DD/MM/YYYY', width: 100, className: C },
      { data: 'accountName', width: 120, className: C },
      { data: 'bankNo', width: 130, className: C },
      { data: 'salaryCoeff', type: 'numeric', numericFormat: { pattern: '0.000' }, width: 90, className: 'htRight htMiddle' },
      { data: 'email', width: 180, className: L },
      {
        data: 'actions',
        readOnly: true,
        width: 80,
        className: C,
        renderer: function (instance, td, row, col, prop, value, cellProperties) {
          td.innerHTML = `<div style="display:flex;gap:8px;justify-content:center;">
            <svg class="action-icon edit" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <svg class="action-icon delete" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
          </div>`;
          return td;
        }
      }
    ];
  }

  function getMockData() {
    return [
      { stt: 1, userCode: 'NV001', name: 'Nguyễn Kiều Ly', department: 'Phòng Tổng hợp HĐTV', position: 'Chuyên viên', dob: '15/05/1990', accountName: 'lynk', bankNo: '123456789', salaryCoeff: 3.66, email: 'lynk@pms.com' },
      { stt: 2, userCode: 'NV002', name: 'Bùi Hiểu Bảng', department: 'Phòng Kế hoạch', position: 'Trưởng phòng', dob: '20/10/1985', accountName: 'bangbh', bankNo: '987654321', salaryCoeff: 4.98, email: 'bangbh@pms.com' },
      { stt: 3, userCode: 'NV003', name: 'Đỗ Trung Kiên', department: 'Phòng Kỹ thuật', position: 'Kỹ sư', dob: '12/03/1992', accountName: 'kiendt', bankNo: '456789123', salaryCoeff: 3.33, email: 'kiendt@pms.com' },
      { stt: 4, userCode: 'NV004', name: 'Dương Văn Minh', department: 'Phòng Tổng hợp HĐTV', position: 'Chuyên viên', dob: '05/08/1988', accountName: 'minhdv', bankNo: '321654987', salaryCoeff: 3.99, email: 'minhdv@pms.com' },
      { stt: 5, userCode: 'NV005', name: 'Hà Thu Vân', department: 'Phòng Kế toán', position: 'Kế toán trưởng', dob: '22/12/1987', accountName: 'vanht', bankNo: '789123456', salaryCoeff: 4.55, email: 'vanht@pms.com' }
    ];
  }

  function initHot() {
    const container = document.getElementById('nsHotContainer');
    if (!container || typeof Handsontable === 'undefined') return;

    if (hotInstance) hotInstance.destroy();

    hotInstance = new Handsontable(container, {
      data: getMockData(),
      colHeaders: buildHeaders(),
      columns: buildCols(),
      rowHeaders: false,
      height: 'auto',
      width: '100%',
      stretchH: 'all',
      autoColumnSize: true,
      renderAllRows: true,
      licenseKey: 'non-commercial-and-evaluation',
      fixedColumnsStart: 3,
      columnHeaderHeight: 40,
      rowHeights: 32,
      
      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
        th.style.textAlign = 'center';
        th.style.fontWeight = '700';
      }
    });

    // Cập nhật tổng số nhân viên
    const totalPill = document.getElementById('nsTotal');
    if (totalPill) totalPill.textContent = `Tổng số: ${getMockData().length} nhân viên`;
  }

  window.nsOpenAdd = function() {
     alert('Chức năng thêm mới nhân viên đang được cập nhật...');
  };

  // Listen for search
  document.getElementById('nsSearch')?.addEventListener('input', function(e) {
     const val = e.target.value.toLowerCase();
     if (!hotInstance) return;
     const allData = getMockData();
     const filtered = allData.filter(r => 
        r.name.toLowerCase().includes(val) || 
        r.userCode.toLowerCase().includes(val) ||
        r.accountName.toLowerCase().includes(val)
     );
     hotInstance.loadData(filtered);
     const totalPill = document.getElementById('nsTotal');
     if (totalPill) totalPill.textContent = `Tìm thấy: ${filtered.length} nhân viên`;
  });

  // Listen for page activation
  window.onPageActivate = (function (orig) {
    return function (page) {
      if (typeof orig === 'function') orig(page);
      if (page === 'ns') {
        setTimeout(initHot, 100);
      }
    };
  })(window.onPageActivate);

  // Initial load if needed
  setTimeout(() => {
     if (document.querySelector('.nav-item.active')?.dataset.page === 'ns') initHot();
  }, 500);

})();
