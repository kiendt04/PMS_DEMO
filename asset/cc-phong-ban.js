/**
 * cc-phong-ban.js — Chấm công phòng ban (Phát triển dựa trên mẫu chuẩn DailyAttendance)
 * Hỗ trợ 3 chế độ: Thời gian, Ca đêm, Thêm giờ với giao diện tiêu đề 3 tầng.
 */
(function () {
  'use strict';

  let hotInstance = null;
  let currentMode = 'thoi-gian'; // 'thoi-gian', 'ca-dem', 'them-gio'

  /**
   * Cấu hình tiêu đề và cột cho chế độ THỜI GIAN (Regular)
   */
  function getRegularConfig(daysInMonth) {
    const nestedHeaders = [
      [
        'Số TT', 'Họ và tên', 'Mã NV', 'Ngạch bậc lương<br/>hoặc cấp bậc<br/>chức vụ',
        { label: 'Ngày làm việc trong tháng', colspan: daysInMonth },
        { label: 'Quy ra công', colspan: 7 }
      ],
      [
        '', '', '', '',
        ...Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()),
        'Số công<br/>hưởng<br/>lương SP',
        'Số công<br/>hưởng<br/>lương TG',
        'Số công nghỉ<br/>100% lương',
        { label: 'Số công nghỉ < 100% lương', colspan: 3 },
        'Số công<br/>hưởng<br/>BHXH'
      ],
      [
        '', '', '', '',
        ...Array.from({ length: daysInMonth }, () => ''),
        '', '', '', '0%', '40%', '80%', ''
      ]
    ];

    const columns = [
      { data: 'stt', readOnly: true, width: 45, className: 'htCenter htMiddle' },
      { data: 'fullName', readOnly: true, width: 180, className: 'htLeft htMiddle' },
      { data: 'userCode', readOnly: true, width: 80, className: 'htCenter htMiddle' },
      { data: 'position', readOnly: true, width: 120, className: 'htCenter htMiddle' },
    ];

    for (let i = 1; i <= daysInMonth; i++) {
      columns.push({ data: `d${i}`, type: 'text', width: 35, className: 'htCenter htMiddle' });
    }

    // Quy ra công
    ['sp', 'tg', 'p100', 'p0', 'p40', 'p80', 'bhxh'].forEach(p => {
      columns.push({ data: p, type: 'numeric', width: 50, className: 'htCenter htMiddle' });
    });

    return { nestedHeaders, columns };
  }

  /**
   * Cấu hình tiêu đề và cột cho chế độ CA ĐÊM (Night Shift) - Dạng form 31 ngày
   */
  function getNightShiftConfig(daysInMonth) {
    const nestedHeaders = [
      [
        'Số TT', 'Họ và tên', 'Mã NV', 'Ngạch bậc lương',
        { label: 'Số giờ ca đêm từng ngày', colspan: daysInMonth },
        'Tổng cộng'
      ],
      [
        '', '', '', '',
        ...Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()),
        'Số ca'
      ]
    ];

    const columns = [
      { data: 'stt', readOnly: true, width: 45, className: 'htCenter htMiddle' },
      { data: 'fullName', readOnly: true, width: 180, className: 'htLeft htMiddle' },
      { data: 'userCode', readOnly: true, width: 80, className: 'htCenter htMiddle' },
      { data: 'position', readOnly: true, width: 120, className: 'htCenter htMiddle' },
    ];

    for (let i = 1; i <= daysInMonth; i++) {
      columns.push({ data: `d${i}`, type: 'numeric', width: 35, className: 'htCenter htMiddle' });
    }

    columns.push({ data: 'total', type: 'numeric', width: 80, className: 'htCenter htMiddle', readOnly: true });

    return { nestedHeaders, columns };
  }

  /**
   * Cấu hình tiêu đề và cột cho chế độ THÊM GIỜ (Overtime)
   */
  function getOvertimeConfig(daysInMonth) {
    const nestedHeaders = [
      [
        'Số TT', 'Họ và tên', 'Mã NV', 'Ngạch bậc lương',
        { label: 'Giờ thêm từng ngày', colspan: daysInMonth },
        { label: 'Tổng hợp theo loại ngày', colspan: 3 }
      ],
      [
        '', '', '', '',
        ...Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()),
        'Ngày thường<br/>x1.5',
        'Cuối tuần<br/>x2.0',
        'Lễ / Tết<br/>x3.0'
      ]
    ];

    const columns = [
      { data: 'stt', readOnly: true, width: 45, className: 'htCenter htMiddle' },
      { data: 'fullName', readOnly: true, width: 180, className: 'htLeft htMiddle' },
      { data: 'userCode', readOnly: true, width: 80, className: 'htCenter htMiddle' },
      { data: 'position', readOnly: true, width: 120, className: 'htCenter htMiddle' },
    ];

    for (let i = 1; i <= daysInMonth; i++) {
      columns.push({ data: `d${i}`, type: 'numeric', width: 35, className: 'htCenter htMiddle' });
    }

    columns.push({ data: 'ot15', type: 'numeric', width: 80, className: 'htCenter htMiddle', readOnly: true });
    columns.push({ data: 'ot20', type: 'numeric', width: 80, className: 'htCenter htMiddle', readOnly: true });
    columns.push({ data: 'ot30', type: 'numeric', width: 80, className: 'htCenter htMiddle', readOnly: true });

    return { nestedHeaders, columns };
  }

  function getMockData(mode, days) {
    const names = [
      { n: 'Nguyễn Kiều Ly', c: 'NV001', p: 'Chuyên viên' },
      { n: 'Bùi Hiểu Bảng', c: 'NV002', p: 'Trưởng phòng' },
      { n: 'Đỗ Trung Kiên', c: 'NV003', p: 'Kỹ sư' },
      { n: 'Dương Văn Minh', c: 'NV004', p: 'Chuyên viên' },
      { n: 'Hà Thu Vân', c: 'NV005', p: 'Kế toán' }
    ];

    return names.map((emp, i) => {
      const row = {
        stt: i + 1,
        fullName: emp.n,
        userCode: emp.c,
        position: emp.p
      };

      if (mode === 'thoi-gian') {
        for (let d = 1; d <= days; d++) row[`d${d}`] = (d % 7 === 0 || d % 7 === 6) ? '' : '8';
        row.sp = 160; row.tg = 16; row.p100 = 0; row.p0 = 0; row.p40 = 0; row.p80 = 0; row.bhxh = 0;
      } else if (mode === 'ca-dem') {
        for (let d = 1; d <= days; d++) row[`d${d}`] = (d % 5 === 0) ? 4 : '';
        row.total = 20;
      } else {
        for (let d = 1; d <= days; d++) row[`d${d}`] = (d % 10 === 0) ? 2 : '';
        row.ot15 = 4; row.ot20 = 2; row.ot30 = 0;
      }
      return row;
    });
  }

  function initHot() {
    const container = document.getElementById('ccpbHotContainer');
    if (!container || typeof Handsontable === 'undefined') return;

    const days = 30; // Giả sử tháng có 30 ngày
    let config;
    if (currentMode === 'thoi-gian') config = getRegularConfig(days);
    else if (currentMode === 'ca-dem') config = getNightShiftConfig(days);
    else config = getOvertimeConfig(days);

    if (hotInstance) {
      hotInstance.destroy();
    }

    hotInstance = new Handsontable(container, {
      data: getMockData(currentMode, days),
      nestedHeaders: config.nestedHeaders,
      columns: config.columns,
      rowHeaders: false,
      fixedColumnsStart: 4,
      height: 'auto',
      width: '100%',
      stretchH: 'none',
      autoColumnSize: true,
      renderAllRows: true,
      licenseKey: 'non-commercial-and-evaluation',
      className: 'htMiddle',
      
      cells(row, col) {
        const props = {};
        // Căn lề cho cột tên
        if (col === 1) props.className = 'htLeft htMiddle';
        // Highlight cuối tuần (giả sử T7=cột 4+5, 4+6...)
        const colIdx = col - 4;
        if (colIdx >= 0 && colIdx < days) {
            const d = colIdx + 1;
            if (d % 7 === 6 || d % 7 === 0) {
                props.className = (props.className || '') + ' cc-weekend-cell';
            }
        }
        return props;
      },

      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
        th.style.textAlign = 'center';
        th.style.fontWeight = '700';
        th.style.backgroundColor = '#f8fafc';
        th.style.color = '#1e293b';
      }
    });
  }

  // Modal Functions
  window.ccpbOpenAdd = function () {
    document.getElementById('ccpbModal').classList.add('active');
    // Set default mode based on current table mode
    if (currentMode === 'ca-dem' || currentMode === 'them-gio') {
      document.getElementById('ccpbModalLoai').value = currentMode;
    }
  };

  window.ccpbCloseModal = function () {
    document.getElementById('ccpbModal').classList.remove('active');
  };

  window.ccpbSaveModal = function () {
    const emp = document.getElementById('ccpbModalEmp').value;
    const val = document.getElementById('ccpbModalVal').value;
    if (!emp || !val) {
      alert('Vui lòng chọn nhân viên và nhập giá trị!');
      return;
    }
    alert('Đã lưu dữ liệu chấm công thành công!');
    window.ccpbCloseModal();
    initHot(); // Refresh table
  };

  // Listen for mode changes
  document.addEventListener('change', (e) => {
    if (e.target.name === 'ccpbLoai') {
      currentMode = e.target.value;
      initHot();
    }
  });

  // Listen for page activation
  window.onPageActivate = (function (orig) {
    return function (page) {
      if (typeof orig === 'function') orig(page);
      if (page === 'cc-phong-ban') {
        setTimeout(initHot, 100);
      }
    };
  })(window.onPageActivate);

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
       if (document.querySelector('.nav-item.active')?.dataset.page === 'cc-phong-ban') initHot();
    });
  } else {
     setTimeout(() => {
        if (document.querySelector('.nav-item.active')?.dataset.page === 'cc-phong-ban') initHot();
     }, 500);
  }

})();
