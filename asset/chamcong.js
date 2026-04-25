// ══════════════════════════════════════════
//  QUẢN LÝ CHẤM CÔNG
// ══════════════════════════════════════════

const CC = (() => {
  // ── Cấu hình cột loại công ──
  const COL_TYPES = {
    'thoi-gian': { label: 'Thời gian', cols: ['LV','H','P','L','OTS','CD','KL'] },
    'ca-dem':    { label: 'Ca đếm',    cols: ['LV','H','P','L','OTS','CD','KL'] },
    'them-gio':  { label: 'Thêm giờ', cols: ['T1','T15','T2','NG','TG'] },
  };

  const QUARTERS = {
    1: [1,2,3], 2: [4,5,6], 3: [7,8,9], 4: [10,11,12]
  };

  const MONTH_NAMES = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

  // ── Sample data ──
  const departments = [
    {
      id: 1, name: 'Phòng Tổng hợp HDTV',
      employees: [
        { id: 1, name: 'Nguyễn Kiều Ly',    stk: '1234567891' },
        { id: 2, name: 'Bùi Hiếu Bằng',     stk: '2468357911' },
        { id: 3, name: 'Đỗ Trung Kiên',      stk: '1039235587135' },
        { id: 4, name: 'Dương Văn Minh',     stk: '5494402544' },
        { id: 5, name: 'Hà Thu Vân',         stk: '1236547899' },
        { id: 6, name: 'Vũ Duy Hưng',        stk: '9876543211' },
      ]
    },
    {
      id: 2, name: 'Phòng Kinh tế',
      employees: [
        { id: 7, name: 'Đặng Thu Trang',     stk: '9876543219' },
      ]
    },
    {
      id: 3, name: 'Phòng Kinh doanh',
      employees: [
        { id: 8,  name: 'Bố Anh Thu',        stk: '1038759146911' },
        { id: 9,  name: 'Đỗ Đức Thịnh',      stk: '9876543219' },
        { id: 10, name: 'Lê Hà Trang',       stk: '3216549871' },
        { id: 11, name: 'Nguyễn Anh Tài',    stk: '2143658798' },
        { id: 12, name: 'Nguyễn Anh Tú',     stk: '2134365879' },
        { id: 13, name: 'Nguyễn Thu Trang',  stk: '5240914905' },
      ]
    },
    {
      id: 4, name: 'Phòng Kỹ thuật',
      employees: [
        { id: 14, name: 'Nguyễn Thị Mai',    stk: '12345678' },
        { id: 15, name: 'Nguyễn Tú Anh',     stk: '1234548954' },
      ]
    },
    {
      id: 5, name: 'Phòng Nhân sự',
      employees: [
        { id: 16, name: 'Nguyễn Phương Anh', stk: '1256789834' },
      ]
    },
    {
      id: 6, name: 'Phòng Kế toán',
      employees: [
        { id: 17, name: 'Nguyễn Bá Quốc Cường', stk: '3423463456' },
        { id: 18, name: 'Dương Đức Tú',          stk: '0945870029346' },
      ]
    },
    {
      id: 7, name: 'Phòng Công nghệ',
      employees: [
        { id: 19, name: 'Đoàn Trung Quốc',   stk: '948422354' },
      ]
    },
    {
      id: 8, name: 'Phòng Chất lượng',
      employees: [
        { id: 20, name: 'Nguyễn Văn Kiên',   stk: '2438458346' },
      ]
    },
  ];

  // ── Generate random attendance data ──
  function genData(empId, month, colType) {
    const cols = COL_TYPES[colType].cols;
    const seed = (empId * 31 + month * 7) % 17;
    const result = {};
    cols.forEach((c, i) => {
      const val = ((seed + i * 3) % 5 === 0) ? Math.floor(Math.random() * 3 + 1) : 0;
      result[c] = val;
    });
    // Ensure LV has meaningful data for non-zero employees
    if (cols.includes('LV') && empId % 3 !== 0) {
      result['LV'] = Math.floor(Math.random() * 4 + 18);
    }
    return result;
  }

  // ── State ──
  let state = {
    quy: 2,
    nam: new Date().getFullYear(),
    loai: 'thoi-gian',
  };

  // ── Render ──
  function render() {
    const months = QUARTERS[state.quy];
    const cols   = COL_TYPES[state.loai].cols;
    const thead  = document.getElementById('ccThead');
    const tbody  = document.getElementById('ccTbody');
    if (!thead || !tbody) return;

    // ── Header ──
    const qLabel = `Tổng hợp Q${state.quy}`;
    let row1 = `<tr>
      <th rowspan="2" class="cc-th-fixed cc-th-stt">#</th>
      <th rowspan="2" class="cc-th-fixed cc-th-name">Họ và tên</th>
      <th rowspan="2" class="cc-th-fixed cc-th-stk">Số TK</th>`;

    months.forEach(m => {
      row1 += `<th colspan="${cols.length}" class="cc-th-month">T${m}</th>`;
    });
    row1 += `<th colspan="2" class="cc-th-quarter">${qLabel}</th></tr>`;

    let row2 = '<tr>';
    months.forEach(() => {
      cols.forEach(c => {
        row2 += `<th class="cc-th-col">${c}</th>`;
      });
    });
    row2 += `<th class="cc-th-col">Tổng</th><th class="cc-th-col cc-last">%</th></tr>`;

    thead.innerHTML = row1 + row2;

    // ── Body ──
    let rowIdx = 0;
    let html = '';
    departments.forEach(dept => {
      html += `<tr class="cc-dept-row"><td colspan="${3 + months.length * cols.length + 2}">${dept.name}</td></tr>`;
      dept.employees.forEach(emp => {
        rowIdx++;
        let total = 0;
        let cells = '';
        months.forEach(m => {
          const data = genData(emp.id, m, state.loai);
          cols.forEach(c => {
            const v = data[c] || 0;
            total += (c === 'LV') ? v : 0;
            cells += v > 0
              ? `<td class="cc-td-val">${v}</td>`
              : `<td class="cc-td-empty"></td>`;
          });
        });
        const pct = total > 0 ? Math.min(100, Math.round(total / (months.length * 22) * 100)) : 0;
        html += `<tr class="cc-data-row">
          <td class="cc-td-stt">${rowIdx}</td>
          <td class="cc-td-name">${emp.name}</td>
          <td class="cc-td-stk">${emp.stk}</td>
          ${cells}
          <td class="cc-td-total">${total || ''}</td>
          <td class="cc-td-pct">${total > 0 ? pct + '%' : ''}</td>
        </tr>`;
      });
    });

    tbody.innerHTML = html;
  }

  // ── Excel export (basic CSV) ──
  function exportExcel() {
    const months = QUARTERS[state.quy];
    const cols   = COL_TYPES[state.loai].cols;
    let csv = `"#","Họ và tên","Số TK"`;
    months.forEach(m => cols.forEach(c => { csv += `,"T${m}-${c}"`; }));
    csv += `,"Tổng","%"\n`;

    let rowIdx = 0;
    departments.forEach(dept => {
      csv += `"","${dept.name}",""\n`;
      dept.employees.forEach(emp => {
        rowIdx++;
        let total = 0;
        let cells = '';
        months.forEach(m => {
          const data = genData(emp.id, m, state.loai);
          cols.forEach(c => {
            const v = data[c] || 0;
            if (c === 'LV') total += v;
            cells += `,"${v > 0 ? v : ''}"`;
          });
        });
        const pct = total > 0 ? Math.min(100, Math.round(total / (months.length * 22) * 100)) + '%' : '';
        csv += `"${rowIdx}","${emp.name}","${emp.stk}"${cells},"${total || ''}","${pct}"\n`;
      });
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `chamcong_Q${state.quy}_${state.nam}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Init ──
  function init() {
    const selQuy  = document.getElementById('ccQuy');
    const selNam  = document.getElementById('ccNam');
    const rdGroup = document.querySelectorAll('input[name="ccLoai"]');
    const btnXls  = document.getElementById('ccExcel');

    if (!selQuy) return; // page not ready

    // Populate năm
    const curYear = new Date().getFullYear();
    for (let y = curYear - 3; y <= curYear + 1; y++) {
      const opt = document.createElement('option');
      opt.value = y; opt.textContent = y;
      if (y === curYear) opt.selected = true;
      selNam.appendChild(opt);
    }

    selQuy.value = state.quy;

    selQuy.addEventListener('change', () => { state.quy = +selQuy.value; render(); });
    selNam.addEventListener('change', () => { state.nam = +selNam.value; render(); });
    rdGroup.forEach(rd => {
      rd.addEventListener('change', () => { state.loai = rd.value; render(); });
    });
    if (btnXls) btnXls.addEventListener('click', exportExcel);

    render();
  }

  return { init, render };
})();

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', CC.init);
// Also init immediately in case DOM already loaded
if (document.readyState !== 'loading') CC.init();
