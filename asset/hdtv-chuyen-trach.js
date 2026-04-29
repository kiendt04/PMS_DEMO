/**
 * hdtv-chuyen-trach.js
 * Quản lý tính lương cho HĐTV chuyên trách
 * REFACTORED: Now uses window.onPageActivateRegistry to avoid conflicts.
 */
(function () {
  'use strict';

  let hotInstance = null;
  let currentMode = 'tam-ung'; // 'tam-ung' hoặc 'quyet-toan'
  let _initializing = false;

  function init() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('hdtvChuyenTrachHot');
    if (!container || typeof Handsontable === 'undefined') {
      _initializing = false;
      return;
    }

    // Listen for mode change (only once)
    if (!container.dataset.listener) {
      const radios = document.querySelectorAll('input[name="hdtvMode"]');
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          currentMode = e.target.value;
          renderGrid();
        });
      });
      container.dataset.listener = "true";
    }

    renderGrid();
    setTimeout(() => { _initializing = false; }, 300);
  }

  function getAdvanceConfig() {
    return {
      data: [
        { tt: 1, hoTen: 'Nguyễn Văn An', maNV: 'HDTV01', soTK: '1028374655', hsLuong: 10.0, hsPC: 1.0, tongHS: 11.0, luongCheDo: 39600000, bhxh: 2798400, bhyt: 524700, bhtn: 349800, anCa: 730000, caDem: 0, truyThu: 0, truyLinh: 0, tongLinh: 36657100, ghiChu: 'Chủ tịch HĐTV' },
        { tt: 2, hoTen: 'Trần Thị Bình', maNV: 'HDTV02', soTK: '1029485766', hsLuong: 8.0, hsPC: 0.5, tongHS: 8.5, luongCheDo: 30600000, bhxh: 2162400, bhyt: 405450, bhtn: 270300, anCa: 730000, caDem: 0, truyThu: 0, truyLinh: 0, tongLinh: 28491850, ghiChu: 'Thành viên HĐTV' },
        { tt: 3, hoTen: 'Lê Hoàng Cường', maNV: 'HDTV03', soTK: '1030596877', hsLuong: 8.5, hsPC: 0.6, tongHS: 9.1, luongCheDo: 32760000, bhxh: 2315100, bhyt: 434100, bhtn: 289400, anCa: 730000, caDem: 0, truyThu: 0, truyLinh: 0, tongLinh: 30451400, ghiChu: 'Thành viên HĐTV' },
        { tt: 4, hoTen: 'Phạm Minh Đức', maNV: 'BKS01', soTK: '1031607988', hsLuong: 9.0, hsPC: 0.7, tongHS: 9.7, luongCheDo: 34920000, bhxh: 2467680, bhyt: 462690, bhtn: 308460, anCa: 730000, caDem: 0, truyThu: 0, truyLinh: 0, tongLinh: 32411170, ghiChu: 'Trưởng BKS' },
        { tt: 5, hoTen: 'Đặng Thị Thu Hà', maNV: 'BKS02', soTK: '1032718099', hsLuong: 7.5, hsPC: 0.4, tongHS: 7.9, luongCheDo: 28440000, bhxh: 2009800, bhyt: 376800, bhtn: 251200, anCa: 730000, caDem: 0, truyThu: 0, truyLinh: 0, tongLinh: 26532200, ghiChu: 'Thành viên BKS' },
        { tt: 6, hoTen: 'Vũ Quang Phát', maNV: 'BKS03', soTK: '1033829100', hsLuong: 7.0, hsPC: 0.4, tongHS: 7.4, luongCheDo: 26640000, bhxh: 1882600, bhyt: 352900, bhtn: 235300, anCa: 730000, caDem: 0, truyThu: 0, truyLinh: 0, tongLinh: 24899200, ghiChu: 'Thành viên BKS' }
      ],
      colHeaders: [
        'TT', 'Họ và tên', 'Mã nhân viên', 'Số TK', 'Hệ số lương', 'Hệ số PC', 'Tổng hệ số', 'Lương chế độ 1 tháng',
        'BHXH (8%)', 'BHYT (1.5%)', 'BH thất nghiệp (1%)', 'Ăn ca', 'Ca đêm, thêm giờ', 'Truy thu', 'Truy lĩnh', 'TỔNG LĨNH', 'Ghi chú'
      ],
      columns: [
        { data: 'tt', type: 'numeric', width: 50, readOnly: true, className: 'htCenter htMiddle' },
        { data: 'hoTen', type: 'text', width: 180, readOnly: true, className: 'htLeft htMiddle' },
        { data: 'maNV', type: 'text', width: 100, readOnly: true, className: 'htCenter htMiddle' },
        { data: 'soTK', type: 'text', width: 120, readOnly: true, className: 'htCenter htMiddle' },
        { data: 'hsLuong', type: 'numeric', numericFormat: { pattern: '0,0.00' }, width: 90, className: 'htCenter htMiddle' },
        { data: 'hsPC', type: 'numeric', numericFormat: { pattern: '0,0.00' }, width: 80, className: 'htCenter htMiddle' },
        { data: 'tongHS', type: 'numeric', numericFormat: { pattern: '0,0.00' }, width: 90, readOnly: true, className: 'htCenter htMiddle' },
        { data: 'luongCheDo', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 130, className: 'htRight htMiddle' },
        { data: 'bhxh', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 110, className: 'htRight htMiddle' },
        { data: 'bhyt', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: 'htRight htMiddle' },
        { data: 'bhtn', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 110, className: 'htRight htMiddle' },
        { data: 'anCa', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 90, className: 'htRight htMiddle' },
        { data: 'caDem', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 120, className: 'htRight htMiddle' },
        { data: 'truyThu', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: 'htRight htMiddle' },
        { data: 'truyLinh', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: 'htRight htMiddle' },
        { data: 'tongLinh', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 130, readOnly: true, className: 'htRight htMiddle htBold' },
        { data: 'ghiChu', type: 'text', width: 150, className: 'htLeft htMiddle' }
      ],
      nestedHeaders: [
        [
          { label: 'TT', rowspan: 2 },
          { label: 'Họ và tên', rowspan: 2 },
          { label: 'Mã nhân viên', rowspan: 2 },
          { label: 'Số TK', rowspan: 2 },
          { label: 'Hệ số', colspan: 3 },
          { label: 'Lương chế độ', rowspan: 2 },
          { label: 'Mức lương CSDN 3.6M/hsl; thu 10.5%', colspan: 3 },
          { label: 'Lĩnh tiền', colspan: 2 },
          { label: 'Truy thu', rowspan: 2 },
          { label: 'Truy lĩnh', rowspan: 2 },
          { label: 'TỔNG LĨNH', rowspan: 2 },
          { label: 'Ghi chú', rowspan: 2 }
        ],
        [
          '', '', '', '', 'Lương', 'Phụ cấp', 'Tổng',
          'BHXH (8%)', 'BHYT (1.5%)', 'BHTN (1%)', 'Ăn ca', 'Ca đêm'
        ]
      ]
    };
  }

  function getSettlementConfig() {
    return {
      data: [
        { tt: 1, hoTen: 'Nguyễn Văn An', maCB: 'HDTV01', soTK: '1028374655', tongHSL: 11.0, ki: 0.95, hsQuyDoi: 10.45, luongHQ: 80000000, tamUngCD: 36657100, tamUngHQ: 41278952, truyLinh: 0, truyThu: 0, tongLinh: 41278952, ghiChu: '' },
        { tt: 2, hoTen: 'Trần Thị Bình', maCB: 'HDTV02', soTK: '1029485766', tongHSL: 8.5, ki: 0.98, hsQuyDoi: 8.33, luongHQ: 80000000, tamUngCD: 28491850, tamUngHQ: 50527042, truyLinh: 0, truyThu: 0, tongLinh: 50527042, ghiChu: '' },
        { tt: 3, hoTen: 'Lê Hoàng Cường', maCB: 'HDTV03', soTK: '1030596877', tongHSL: 9.1, ki: 0.96, hsQuyDoi: 8.74, luongHQ: 80000000, tamUngCD: 30451400, tamUngHQ: 45210330, truyLinh: 0, truyThu: 0, tongLinh: 45210330, ghiChu: '' },
        { tt: 4, hoTen: 'Phạm Minh Đức', maCB: 'BKS01', soTK: '1031607988', tongHSL: 9.7, ki: 1.0, hsQuyDoi: 9.70, luongHQ: 80000000, tamUngCD: 32411170, tamUngHQ: 47588830, truyLinh: 0, truyThu: 0, tongLinh: 47588830, ghiChu: '' },
        { tt: 5, hoTen: 'Đặng Thị Thu Hà', maCB: 'BKS02', soTK: '1032718099', tongHSL: 7.9, ki: 0.92, hsQuyDoi: 7.27, luongHQ: 80000000, tamUngCD: 26532200, tamUngHQ: 38450120, truyLinh: 0, truyThu: 0, tongLinh: 38450120, ghiChu: '' },
        { tt: 6, hoTen: 'Vũ Quang Phát', maCB: 'BKS03', soTK: '1033829100', tongHSL: 7.4, ki: 0.94, hsQuyDoi: 6.96, luongHQ: 80000000, tamUngCD: 24899200, tamUngHQ: 36720440, truyLinh: 0, truyThu: 0, tongLinh: 36720440, ghiChu: '' }
      ],
      colHeaders: [
        'TT', 'Họ và tên', 'Mã cán bộ', 'Số TK', 'Tổng HSL', 'Ki', 'Hệ số quy đổi', 'Lương hiệu quả thực hiện',
        'Lương tạm ứng chế độ', 'Lương tạm ứng hiệu quả thực hiện', 'Truy lĩnh', 'Truy thu', 'TỔNG LĨNH', 'GHI CHÚ'
      ],
      columns: [
        { data: 'tt', type: 'numeric', width: 50, readOnly: true, className: 'htCenter htMiddle' },
        { data: 'hoTen', type: 'text', width: 180, readOnly: true, className: 'htLeft htMiddle' },
        { data: 'maCB', type: 'text', width: 100, readOnly: true, className: 'htCenter htMiddle' },
        { data: 'soTK', type: 'text', width: 120, readOnly: true, className: 'htCenter htMiddle' },
        { data: 'tongHSL', type: 'numeric', numericFormat: { pattern: '0,0.00' }, width: 90, className: 'htCenter htMiddle' },
        { data: 'ki', type: 'numeric', numericFormat: { pattern: '0.00' }, width: 60, className: 'htCenter htMiddle' },
        { data: 'hsQuyDoi', type: 'numeric', numericFormat: { pattern: '0.00' }, width: 90, readOnly: true, className: 'htCenter htMiddle' },
        { data: 'luongHQ', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 150, className: 'htRight htMiddle' },
        { data: 'tamUngCD', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 130, className: 'htRight htMiddle' },
        { data: 'tamUngHQ', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 150, className: 'htRight htMiddle' },
        { data: 'truyLinh', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: 'htRight htMiddle' },
        { data: 'truyThu', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 100, className: 'htRight htMiddle' },
        { data: 'tongLinh', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 130, readOnly: true, className: 'htRight htMiddle htBold' },
        { data: 'ghiChu', type: 'text', width: 150, className: 'htLeft htMiddle' }
      ]
    };
  }

  function renderGrid() {
    const container = document.getElementById('hdtvChuyenTrachHot');
    const config = currentMode === 'tam-ung' ? getAdvanceConfig() : getSettlementConfig();

    if (hotInstance) hotInstance.destroy();

    const calcHeight = (config.data.length * 28) + 85;

    hotInstance = new Handsontable(container, {
      ...config,
      rowHeaders: false,
      height: calcHeight,
      width: '100%',
      stretchH: 'all',
      manualColumnResize: true,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeights: 28,
      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
      }
    });
  }

  /* ── Register for Activation ── */
  if (!window.onPageActivateRegistry) window.onPageActivateRegistry = {};
  window.onPageActivateRegistry['hdtv-chuyen-trach'] = init;

  const _old = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _old === 'function') _old(page);
    if (window.onPageActivateRegistry[page]) {
      setTimeout(window.onPageActivateRegistry[page], 50);
    }
  }

  // Initial load
  setTimeout(() => {
    if (document.querySelector('.nav-item.active')?.dataset.page === 'hdtv-chuyen-trach') init();
  }, 1000);

})();
