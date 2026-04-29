/**
 * quan-ly-an-ca.js — Quản lý chi tiền ăn ca với Handsontable
 * Alignment: tên → htLeft | tiền → htRight | còn lại → htCenter
 */
(function () {
  'use strict';

  const FIXED = 4; // TT | Họ và tên | Mã nhân viên | Số TK
  const MEAL_RATE = { l1: 730000, l2: 730000, l3: 31000, l4: 27000 };

  /* ── Mock data ── */
  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV', employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', ma: 'NV001', stk: '1234567891', l1: 22, l2: 0, l3: 0, l4: 0 },
        { stt: 2, name: 'Bùi Hiểu Bảng', ma: 'NV002', stk: '2468357911', l1: 20, l2: 2, l3: 0, l4: 0 },
        { stt: 3, name: 'Đỗ Trung Kiên', ma: 'NV003', stk: '103923558735', l1: 22, l2: 0, l3: 3, l4: 0 },
        { stt: 4, name: 'Dương Văn Minh', ma: 'NV004', stk: '5494825544', l1: 18, l2: 4, l3: 0, l4: 2 },
        { stt: 5, name: 'Hà Thu Vân', ma: 'NV005', stk: '1236547899', l1: 22, l2: 0, l3: 0, l4: 0 },
        { stt: 6, name: 'Vũ Duy Hưng', ma: 'NV006', stk: '9876543211', l1: 22, l2: 0, l3: 5, l4: 3 },
        { stt: 7, name: 'Đặng Thu Trang', ma: 'NV007', stk: '9876543219', l1: 20, l2: 0, l3: 2, l4: 0 },
      ]
    },
    {
      name: 'Phòng Kinh doanh', employees: [
        { stt: 8, name: 'Đỗ Anh Thư', ma: 'NV008', stk: '109876914691', l1: 22, l2: 0, l3: 0, l4: 4 },
        { stt: 9, name: 'Đỗ Đức Thịnh', ma: 'NV009', stk: '9876543219', l1: 21, l2: 1, l3: 3, l4: 0 },
        { stt: 10, name: 'Lê Hà Trang', ma: 'NV010', stk: '3216549871', l1: 22, l2: 0, l3: 0, l4: 0 },
        { stt: 11, name: 'Nguyễn Anh Tài', ma: 'NV011', stk: '2143658790', l1: 19, l2: 3, l3: 0, l4: 0 },
        { stt: 12, name: 'Nguyễn Anh Tú', ma: 'NV012', stk: '2134365879', l1: 22, l2: 0, l3: 0, l4: 2 },
        { stt: 13, name: 'Nguyễn Thu Trang', ma: 'NV013', stk: '5240914905', l1: 22, l2: 0, l3: 4, l4: 0 },
      ]
    },
    {
      name: 'Phòng Kỹ thuật', employees: [
        { stt: 14, name: 'Nguyễn Thị Mai', ma: 'NV014', stk: '12345678', l1: 22, l2: 0, l3: 6, l4: 4 },
        { stt: 15, name: 'Nguyễn Tú Anh', ma: 'NV015', stk: '1234548954', l1: 20, l2: 2, l3: 0, l4: 0 },
      ]
    },
    {
      name: 'Phòng Nhân sự', employees: [
        { stt: 16, name: 'Nguyễn Phương Anh', ma: 'NV016', stk: '1256789834', l1: 22, l2: 0, l3: 0, l4: 0 },
      ]
    },
    {
      name: 'Phòng Kế toán', employees: [
        { stt: 17, name: 'Nguyễn Bá Quốc Cường', ma: 'NV017', stk: '3423463456', l1: 22, l2: 0, l3: 2, l4: 0 },
        { stt: 18, name: 'Dương Đức Lự', ma: 'NV018', stk: '0945780029346', l1: 22, l2: 0, l3: 3, l4: 1 },
      ]
    },
    {
      name: 'Phòng Công nghệ', employees: [
        { stt: 19, name: 'Đoàn Trung Quốc', ma: 'NV019', stk: '948422354', l1: 22, l2: 0, l3: 0, l4: 5 },
      ]
    },
    {
      name: 'Phòng Chất Lượng', employees: [
        { stt: 20, name: 'Nguyễn Văn Kiên', ma: 'NV020', stk: '2498458346', l1: 21, l2: 1, l3: 0, l4: 0 },
      ]
    },
  ];

  let hotInstance = null;
  let deptSet = new Set();
  let _initializing = false;

  /* ── Calc tiền ── */
  function calcMoney(emp) {
    // Logic: Nếu hưởng loại 1 hoặc 2 (tháng) thì nhân tỉ lệ công (giả định 22 công chuẩn)
    // Nếu hưởng loại 3 hoặc 4 (ngày) thì nhân trực tiếp số buổi
    const ac1 = (emp.l1 / 22) * MEAL_RATE.l1;
    const ac2 = (emp.l2 / 22) * MEAL_RATE.l2;
    const ac3 = emp.l3 * MEAL_RATE.l3;
    const ac4 = emp.l4 * MEAL_RATE.l4;

    const anCa = Math.ceil(ac1 + ac2 + ac3 + ac4);
    const caDem = 0; // Placeholder
    const themGio = 0; // Placeholder
    return { anCa, caDem, themGio, total: Math.ceil(anCa + caDem + themGio) };
  }

  /* ── Build data ── */
  function buildData() {
    const rows = [];
    deptSet = new Set();
    const NCOLS = FIXED + 4 + 4 + 1; // fixed(4) + loại công(4) + tiền(3) + ghi chú(1) = chú ý: index 8=ac,9=cd,10=tg,11=tổng,12=ghichu

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dRow = new Array(NCOLS).fill('');
      dRow[1] = dept.name;
      rows.push(dRow);
      dept.employees.forEach(emp => {
        const { anCa, caDem, themGio, total } = calcMoney(emp);
        rows.push([
          emp.stt, emp.name, emp.ma, emp.stk,
          emp.l1 || '', emp.l2 || '', emp.l3 || '', emp.l4 || '',
          anCa || '', caDem || '', themGio || '', total || '', '',
        ]);
      });
    });
    return rows;
  }

  /* ── Build nested headers ── */
  function buildHeaders(thang, nam) {
    const h1 = [
      { label: 'TT', colspan: 1 },
      { label: 'Họ và tên', colspan: 1 },
      { label: 'Mã NV', colspan: 1 },
      { label: 'Số TK', colspan: 1 },
      { label: 'Số công hưởng ăn ca <br> trên 730.000đ/tháng' },
      { label: 'Số công hưởng ăn ca <br> dưới 730.000đ/tháng' },
      { label: 'Số công hưởng <br> (31.000đ/ngày)' },
      { label: 'Số công hưởng <br> (27.000đ/ngày)' },
      { label: 'Các khoản chế độ khác', colspan: 3 },
      { label: 'Tổng lĩnh', colspan: 1 },
      { label: 'Ghi chú', colspan: 1 },
    ];
    const h2 = [
      '', '', '', '', '', '', '', '',
      'Ăn ca', 'Ca đêm', 'Thêm giờ',
      '', '',
    ];
    return [h1, h2];
  }

  /* ── Build cols ── */
  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    const R = 'htRight  htMiddle';
    const FMT = { pattern: '0,0' };
    return [
      { data: 0, readOnly: true, type: 'numeric', width: 35, className: C },
      { data: 1, readOnly: true, type: 'text', width: 135, className: L },
      { data: 2, readOnly: true, type: 'text', width: 75, className: C },
      { data: 3, readOnly: true, type: 'text', width: 85, className: C },
      // 4 cột số công - thu hẹp tối đa xuống 42px
      { data: 4, type: 'numeric', width: 42, className: C },
      { data: 5, type: 'numeric', width: 42, className: C },
      { data: 6, type: 'numeric', width: 42, className: C },
      { data: 7, type: 'numeric', width: 42, className: C },
      // Chế độ khác
      { data: 8, readOnly: true, type: 'numeric', numericFormat: FMT, width: 75, className: R },
      { data: 9, readOnly: true, type: 'numeric', numericFormat: FMT, width: 70, className: R },
      { data: 10, readOnly: true, type: 'numeric', numericFormat: FMT, width: 70, className: R },
      // Tổng lĩnh
      { data: 11, readOnly: true, type: 'numeric', numericFormat: FMT, width: 85, className: R + ' ac-total' },
      // Ghi chú
      { data: 12, type: 'text', width: 80, className: C },
    ];
  }

  /* ── initHot ── */
  function initHot(thang, nam) {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('acHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data = buildData();
    const headers = buildHeaders(thang, nam);
    const cols = buildCols();
    const totalCols = cols.length;
    const merges = [];
    deptSet.forEach(ri => merges.push({ row: ri, col: 0, rowspan: 1, colspan: totalCols }));

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
      manualColumnResize: true,
      renderAllRows: true,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeights: 26,

      cells(row, col) {
        if (deptSet.has(row)) {
          return {
            readOnly: true,
            className: 'dept-row htLeft htMiddle'
          };
        }
        const props = {};
        const classes = [];
        if (row % 2 === 0) classes.push('ac-even-row');
        if (col === 1) classes.push('htLeft');
        else if (col >= 8 && col <= 11) classes.push('htRight');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (col === 11) classes.push('ac-total');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        const affected = new Set(changes.filter(([, , , src]) => src !== 'recalc').map(([r]) => r));
        affected.forEach(ri => recalcRow(ri));
      },

      afterRender() {
        // Force sync header heights between frozen and scrollable zones
        if (hotInstance) {
          requestAnimationFrame(() => hotInstance.refreshDimensions());
        }
        setTimeout(() => { _initializing = false; }, 400);
      },
    });
  }

  /* ── Recalc ── */
  function recalcRow(ri) {
    if (!hotInstance || deptSet.has(ri)) return;
    const l1 = parseFloat(hotInstance.getDataAtCell(ri, 4)) || 0;
    const l2 = parseFloat(hotInstance.getDataAtCell(ri, 5)) || 0;
    const l3 = parseFloat(hotInstance.getDataAtCell(ri, 6)) || 0;
    const l4 = parseFloat(hotInstance.getDataAtCell(ri, 7)) || 0;

    const ac1 = (l1 / 22) * MEAL_RATE.l1;
    const ac2 = (l2 / 22) * MEAL_RATE.l2;
    const ac3 = l3 * MEAL_RATE.l3;
    const ac4 = l4 * MEAL_RATE.l4;
    const anCa = Math.ceil(ac1 + ac2 + ac3 + ac4);

    // Giữ nguyên các cột khác nếu có
    const caDem = parseFloat(hotInstance.getDataAtCell(ri, 9)) || 0;
    const themGio = parseFloat(hotInstance.getDataAtCell(ri, 10)) || 0;

    hotInstance.setDataAtCell([
      [ri, 8, anCa || '', 'recalc'],
      [ri, 11, Math.ceil(anCa + caDem + themGio) || '', 'recalc'],
    ]);
  }

  /* ── Export CSV ── */
  function exportCSV() {
    if (!hotInstance) return;
    const t = document.getElementById('acThang')?.value || '';
    const n = document.getElementById('acNam')?.value || '';
    hotInstance.getPlugin('exportFile').downloadFile('csv', {
      bom: true, columnHeaders: true, fileExtension: 'csv',
      filename: `AnCa_T${t}_${n}`, mimeType: 'text/csv',
      rowDelimiter: '\r\n', rowHeaders: false,
    });
  }

  function refresh() {
    const thang = parseInt(document.getElementById('acThang')?.value) || new Date().getMonth() + 1;
    const nam = parseInt(document.getElementById('acNam')?.value) || new Date().getFullYear();
    initHot(thang, nam);
  }

  /* ── Init ── */
  function init() {
    const ySel = document.getElementById('acNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 2; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }
    document.getElementById('acThang')?.addEventListener('change', refresh);
    document.getElementById('acNam')?.addEventListener('change', refresh);
    document.getElementById('acExcel')?.addEventListener('click', exportCSV);
    setTimeout(refresh, 150);


  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'quan-ly-an-ca') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
