/**
 * nghi-phep.js — Quản lý nghỉ phép với Handsontable
 * Rebuilt based on user image request.
 */
(function () {
  'use strict';

  const MONTH_LABELS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  const FIXED = 3; // TT | HỌ VÀ TÊN | Mã nhân viên

  /* ── Sample data (Synced with other modules) ── */
  const DEPTS = [
    {
      name: 'Phòng Tổng hợp HĐTV', employees: [
        { stt: 1, name: 'Nguyễn Kiều Ly', ma: '2020.BKT.7.X0', ngayVL: '2003-07-27', phepCD: 426 },
        { stt: 2, name: 'Bùi Hiểu Bảng', ma: '2021.HDQT.2.X0', ngayVL: '2005-09-27', phepCD: 378 },
        { stt: 3, name: 'Đỗ Trung Kiên', ma: '2019.HDQT.3.X0', ngayVL: '2019-01-10', phepCD: 140 },
        { stt: 4, name: 'Dương Văn Minh', ma: '2025.BDT.01.X0', ngayVL: '2025-01-01', phepCD: 24 },
        { stt: 5, name: 'Hà Thu Vân', ma: '2023.HDQT.15.X0', ngayVL: '1999-09-12', phepCD: 522 },
        { stt: 6, name: 'Vũ Duy Hưng', ma: '2024.BKT.09.X0', ngayVL: '2006-04-27', phepCD: 354 },
        { stt: 7, name: 'Đặng Thu Trang', ma: '2016.NV.27.X1', ngayVL: '2016-07-04', phepCD: 180 },
      ]
    },
    {
      name: 'Phòng Kinh doanh', employees: [
        { stt: 8, name: 'Đỗ Anh Thư', ma: '2025.BKT.101.X1', ngayVL: '2024-01-02', phepCD: 36 },
        { stt: 9, name: 'Đỗ Đức Thịnh', ma: '2025.BKT.17.X0', ngayVL: '2024-01-01', phepCD: 36 },
        { stt: 10, name: 'Lê Hà Trang', ma: '2024.BKT.9.X0', ngayVL: '1999-02-12', phepCD: 522 },
        { stt: 11, name: 'Nguyễn Anh Tài', ma: '2025.BKT', ngayVL: '2000-03-27', phepCD: 498 },
        { stt: 12, name: 'Nguyễn Anh Tú', ma: '2022.HDQT.3.X0', ngayVL: '2000-04-27', phepCD: 498 },
        { stt: 13, name: 'Nguyễn Thu Trang', ma: '2025.BGD.10.X1', ngayVL: '2025-01-01', phepCD: 24 },
      ]
    },
    {
      name: 'Phòng Kỹ thuật', employees: [
        { stt: 14, name: 'Nguyễn Thị Mai', ma: '2019.KT.01.X0', ngayVL: '2019-06-18', phepCD: 140 },
        { stt: 15, name: 'Nguyễn Tú Anh', ma: '2022.KT.02.X0', ngayVL: '2022-10-03', phepCD: 120 },
      ]
    },
    {
      name: 'Phòng Nhân sự', employees: [
        { stt: 16, name: 'Nguyễn Phương Anh', ma: '2020.NS.01.X0', ngayVL: '2020-07-14', phepCD: 120 },
      ]
    },
    {
      name: 'Phòng Kế toán', employees: [
        { stt: 17, name: 'Nguyễn Bá Quốc Cường', ma: '2015.KT.01.X0', ngayVL: '2015-03-22', phepCD: 180 },
        { stt: 18, name: 'Dương Đức Lự', ma: '2018.KT.02.X0', ngayVL: '2018-09-10', phepCD: 150 },
      ]
    },
    {
      name: 'Phòng Công nghệ', employees: [
        { stt: 19, name: 'Đoàn Trung Quốc', ma: '2021.CN.01.X0', ngayVL: '2021-05-17', phepCD: 120 },
      ]
    },
    {
      name: 'Phòng Chất Lượng', employees: [
        { stt: 20, name: 'Nguyễn Văn Kiên', ma: '2019.CL.01.X0', ngayVL: '2019-02-28', phepCD: 140 },
      ]
    }
  ];

  let hotInstance = null;
  let deptSet = new Set();
  let _initializing = false;

  /* ── Tenure Calculation ── */
  function getTenure(hireDateStr, refYear) {
    const hireDate = new Date(hireDateStr);
    const refDate = new Date(refYear, 11, 31);
    let years = refDate.getFullYear() - hireDate.getFullYear();
    let months = refDate.getMonth() - hireDate.getMonth();
    if (months < 0) { years--; months += 12; }
    return { years, months };
  }

  /* ── Build data ── */
  function buildData(year) {
    const rows = [];
    deptSet = new Set();
    // NCOLS: TT(1) + Name(1) + Ma(1) + Hire(3) + Tenure(2) + PhepCD(1) + DaNghi(1) + ConLai(1) + Months(12) + Chuyen(1) = 24 cols
    const NCOLS = 24;

    DEPTS.forEach(dept => {
      const di = rows.length;
      deptSet.add(di);
      const dRow = new Array(NCOLS).fill('');
      dRow[1] = dept.name; // Move to index 1
      rows.push(dRow);

      dept.employees.forEach(emp => {
        const hire = new Date(emp.ngayVL);
        const { years, months } = getTenure(emp.ngayVL, year);

        const row = new Array(NCOLS).fill('');
        row[0] = emp.stt;
        row[1] = emp.name;
        row[2] = emp.ma;
        row[3] = hire.getDate();
        row[4] = hire.getMonth() + 1;
        row[5] = hire.getFullYear();
        row[6] = years;
        row[7] = months;
        row[8] = emp.phepCD;
        row[9] = 0; // Đã nghỉ
        row[10] = emp.phepCD; // Còn lại
        for (let i = 0; i < 12; i++) row[11 + i] = 0;
        row[23] = emp.phepCD; // Chuyển năm sau
        rows.push(row);
      });
    });
    return rows;
  }

  /* ── Headers ── */
  function buildHeaders(year) {
    const h1 = [
      { label: 'TT' },
      { label: 'HỌ VÀ TÊN' },
      { label: 'Mã nhân viên' },
      { label: 'Ngày tuyển dụng', colspan: 3 },
      { label: `Số năm lao động<br/>tính đến 31/12/${year}`, colspan: 2 },
      { label: 'Số<br/>ngày phép<br/>theo chế độ' },
      { label: 'Số ngày<br/>đã nghỉ<br/>cả năm' },
      { label: 'Số ngày<br/>phép<br/>còn lại' },
      { label: 'Số liệu chi tiết<br/>từng tháng', colspan: 12 },
      { label: `Chuyển phép sang<br/>tháng 01/${year + 1}` },
    ];
    const h2 = [
      null, null, null,
      'Ngày', 'Tháng', 'Năm',
      'Năm', 'Tháng',
      null, null, null,
      ...MONTH_LABELS,
      null
    ];
    return [h1, h2];
  }

  /* ── Column Config ── */
  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    return [
      { data: 0, readOnly: true, width: 35, className: C },
      { data: 1, readOnly: true, width: 160, className: L },
      { data: 2, readOnly: true, width: 110, className: C },
      // Ngày tuyển dụng
      { data: 3, readOnly: true, width: 45, className: C },
      { data: 4, readOnly: true, width: 50, className: C },
      { data: 5, readOnly: true, width: 55, className: C },
      // Tenure
      { data: 6, readOnly: true, width: 45, className: C },
      { data: 7, readOnly: true, width: 50, className: C },
      // Leave Stats
      { data: 8, readOnly: true, width: 70, className: C },
      { data: 9, readOnly: true, width: 70, className: C },
      { data: 10, readOnly: true, width: 70, className: C },
      // 12 Months
      ...Array(12).fill(0).map((_, i) => ({ data: 11 + i, type: 'numeric', width: 32, className: C })),
      // Carry forward
      { data: 23, readOnly: true, width: 85, className: C },
    ];
  }

  /* ── initHot ── */
  function initHot(year) {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('npHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data = buildData(year);
    const headers = buildHeaders(year);
    const cols = buildCols();
    const totalCols = cols.length;
    const merges = [];
    deptSet.forEach(ri => merges.push({ row: ri, col: 0, rowspan: 1, colspan: totalCols }));

    if (hotInstance) { hotInstance.destroy(); hotInstance = null; }

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
      autoRowSize: true,
      licenseKey: 'non-commercial-and-evaluation',
      wordWrap: true,

      cells(row, col) {
        if (deptSet.has(row)) {
          return {
            readOnly: true,
            className: 'dept-row htLeft htMiddle'
          };
        }
        const props = {};
        const classes = [];
        if (row % 2 === 0) classes.push('row-even');
        if (col === 1) classes.push('htLeft');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterChange(changes) {
        if (!changes) return;
        const affected = new Set(changes.filter(([, , , src]) => src !== 'recalc').map(([r]) => r));
        affected.forEach(ri => recalcRow(ri));
      },

      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
        th.style.textAlign = 'center';
        th.style.whiteSpace = 'nowrap';
        th.style.lineHeight = '1.2';
        th.style.padding = '4px 2px';
      },

      afterRender() {
        this.view.adjustElementsSize();
      }
    });

    setTimeout(() => {
      hotInstance.render();
      hotInstance.view.adjustElementsSize();
    }, 0);
  }

  /* ── Recalc ── */
  function recalcRow(ri) {
    if (!hotInstance || deptSet.has(ri)) return;
    let totalUsed = 0;
    for (let c = 11; c <= 22; c++) {
      const v = parseFloat(hotInstance.getDataAtCell(ri, c));
      if (!isNaN(v)) totalUsed += v;
    }
    const phepCD = parseFloat(hotInstance.getDataAtCell(ri, 8)) || 0;
    const conLai = Math.max(phepCD - totalUsed, 0);
    hotInstance.setDataAtCell([
      [ri, 9, totalUsed, 'recalc'],
      [ri, 10, conLai, 'recalc'],
      [ri, 23, conLai, 'recalc'],
    ]);
  }

  /* ── Export CSV ── */
  function exportCSV() {
    if (!hotInstance) return;
    hotInstance.getPlugin('exportFile').downloadFile('csv', {
      bom: true, columnHeaders: true, fileExtension: 'csv',
      filename: `NghiPhep_${getYear()}`,
      mimeType: 'text/csv', rowDelimiter: '\r\n', rowHeaders: false,
    });
  }

  function getYear() { return parseInt(document.getElementById('npNam')?.value) || new Date().getFullYear(); }
  function refresh() { initHot(getYear()); }

  /* ── Init ── */
  function init() {
    const ySel = document.getElementById('npNam');
    if (ySel && ySel.options.length === 0) {
      const cur = new Date().getFullYear();
      for (let y = cur - 2; y <= cur + 2; y++) {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        if (y === cur) o.selected = true;
        ySel.appendChild(o);
      }
    }
    document.getElementById('npNam')?.addEventListener('change', refresh);
    document.getElementById('npExcel')?.addEventListener('click', exportCSV);
    setTimeout(refresh, 150);
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'nghi-phep') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
