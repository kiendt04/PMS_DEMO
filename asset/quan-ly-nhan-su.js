/**
 * quan-ly-nhan-su.js — Quản lý nhân sự (nhân viên)
 * Sử dụng bảng HTML tiêu chuẩn.
 */

// Dữ liệu mẫu khởi tạo đồng bộ với chi-luong.js
let EMPLOYEES = [
  { stt: 1,  ma: 'NV001', name: 'Nguyễn Kiều Ly',       dept: 'Phòng Tổng hợp HĐTV', pos: 'Trưởng phòng', dob: '1990-05-15', acc: 'lynk',  stk: '1234567891', hsl: 3.66, email: 'lynk@pms.com', join: '2020-01-01', gender: 'Nữ' },
  { stt: 2,  ma: 'NV002', name: 'Bùi Hiểu Bảng',        dept: 'Phòng Tổng hợp HĐTV', pos: 'Phó phòng',    dob: '1985-10-20', acc: 'bangbh', stk: '2468357911', hsl: 4.98, email: 'bangbh@pms.com', join: '2021-06-15', gender: 'Nam' },
  { stt: 3,  ma: 'NV003', name: 'Đỗ Trung Kiên',         dept: 'Phòng Tổng hợp HĐTV', pos: 'Chuyên viên',  dob: '1992-03-12', acc: 'kiendt', stk: '103923558735', hsl: 3.33, email: 'kiendt@pms.com', join: '2025-01-10', gender: 'Nam' },
  { stt: 4,  ma: 'NV004', name: 'Dương Văn Minh',        dept: 'Phòng Tổng hợp HĐTV', pos: 'Chuyên viên',  dob: '1988-08-05', acc: 'minhdv', stk: '5494825544', hsl: 3.99, email: 'minhdv@pms.com', join: '2024-03-22', gender: 'Nam' },
  { stt: 5,  ma: 'NV005', name: 'Hà Thu Vân',            dept: 'Phòng Kế toán',     pos: 'Kế toán trưởng', dob: '1987-12-22', acc: 'vanht',  stk: '1236547899', hsl: 4.55, email: 'vanht@pms.com', join: '2023-11-05', gender: 'Nữ' },
  { stt: 6,  ma: 'NV006', name: 'Vũ Duy Hưng',           dept: 'Phòng Tổng hợp HĐTV', pos: 'Chuyên viên',  dob: '1991-04-20', acc: 'hungvd', stk: '9876543211', hsl: 3.00, email: 'hungvd@pms.com', join: '2022-05-10', gender: 'Nam' },
  { stt: 7,  ma: 'NV007', name: 'Đặng Thu Trang',        dept: 'Phòng Tổng hợp HĐTV', pos: 'Chuyên viên',  dob: '1993-11-12', acc: 'trangdt', stk: '9876543219', hsl: 5.50, email: 'trangdt@pms.com', join: '2020-08-15', gender: 'Nữ' },
  { stt: 8,  ma: 'NV008', name: 'Đỗ Anh Thư',            dept: 'Phòng Kinh doanh',   pos: 'Trưởng phòng', dob: '1994-02-14', acc: 'thuda', stk: '109876914691', hsl: 3.66, email: 'thuda@pms.com', join: '2021-03-01', gender: 'Nữ' },
  { stt: 9,  ma: 'NV009', name: 'Đỗ Đức Thịnh',          dept: 'Phòng Kinh doanh',   pos: 'Chuyên viên',  dob: '1990-09-09', acc: 'thinhdd', stk: '9876543219', hsl: 3.42, email: 'thinhdd@pms.com', join: '2022-07-20', gender: 'Nam' },
  { stt: 10, ma: 'NV010', name: 'Lê Hà Trang',           dept: 'Phòng Kinh doanh',   pos: 'Nhân viên',    dob: '1996-05-30', acc: 'tranglh', stk: '3216549871', hsl: 3.00, email: 'tranglh@pms.com', join: '2024-01-15', gender: 'Nữ' },
  { stt: 11, ma: 'NV011', name: 'Nguyễn Anh Tài',        dept: 'Phòng Kinh doanh',   pos: 'Chuyên viên',  dob: '1989-12-12', acc: 'taina', stk: '2143658790', hsl: 4.40, email: 'taina@pms.com', join: '2020-10-10', gender: 'Nam' },
  { stt: 12, ma: 'NV012', name: 'Nguyễn Anh Tú',         dept: 'Phòng Kinh doanh',   pos: 'Chuyên viên',  dob: '1992-06-25', acc: 'tuna', stk: '2134365879', hsl: 3.42, email: 'tuna@pms.com', join: '2021-09-22', gender: 'Nam' },
  { stt: 13, ma: 'NV013', name: 'Nguyễn Thu Trang',      dept: 'Phòng Kinh doanh',   pos: 'Chuyên viên',  dob: '1987-03-18', acc: 'trangnt', stk: '5240914905', hsl: 4.55, email: 'trangnt@pms.com', join: '2023-11-05', gender: 'Nữ' },
  { stt: 14, ma: 'NV014', name: 'Nguyễn Thị Mai',        dept: 'Phòng Kỹ thuật',     pos: 'Chuyên viên',  dob: '1990-01-01', acc: 'maint', stk: '12345678', hsl: 4.40, email: 'maint@pms.com', join: '2020-01-01', gender: 'Nữ' },
  { stt: 15, ma: 'NV015', name: 'Nguyễn Tú Anh',         dept: 'Phòng Kỹ thuật',     pos: 'Nhân viên',    dob: '1995-05-05', acc: 'anhnt', stk: '1234548954', hsl: 3.00, email: 'anhnt@pms.com', join: '2024-03-22', gender: 'Nam' },
  { stt: 16, ma: 'NV016', name: 'Nguyễn Phương Anh',     dept: 'Phòng Nhân sự',      pos: 'Chuyên viên',  dob: '1993-08-08', acc: 'anhnp', stk: '1256789834', hsl: 3.42, email: 'anhnp@pms.com', join: '2022-05-10', gender: 'Nữ' },
  { stt: 17, ma: 'NV017', name: 'Nguyễn Bá Quốc Cường',  dept: 'Phòng Kế toán',      pos: 'Kế toán viên', dob: '1985-12-12', acc: 'cuongnbq', stk: '3423463456', hsl: 5.50, email: 'cuongnbq@pms.com', join: '2020-08-15', gender: 'Nam' },
  { stt: 18, ma: 'NV018', name: 'Dương Đức Lự',           dept: 'Phòng Kế toán',      pos: 'Kế toán viên', dob: '1988-02-02', acc: 'ludd', stk: '0945780029346', hsl: 4.55, email: 'ludd@pms.com', join: '2023-11-05', gender: 'Nam' },
  { stt: 19, ma: 'NV019', name: 'Đoàn Trung Quốc',        dept: 'Phòng Công nghệ',    pos: 'Chuyên viên IT', dob: '1994-04-04', acc: 'quocdt', stk: '948422354', hsl: 3.66, email: 'quocdt@pms.com', join: '2021-03-01', gender: 'Nam' },
  { stt: 20, ma: 'NV020', name: 'Nguyễn Văn Kiên',        dept: 'Phòng Chất Lượng',   pos: 'Chuyên viên',  dob: '1990-10-10', acc: 'kiennv', stk: '2498458346', hsl: 3.42, email: 'kiennv@pms.com', join: '2022-07-20', gender: 'Nam' }
];

let currentData = [...EMPLOYEES];
let currentEditMa = null;

// Hàm vẽ bảng
window.renderNsTable = function() {
  const tbody = document.getElementById('nsTableBody');
  if (!tbody) return;

  tbody.innerHTML = currentData.map((emp, index) => `
    <tr>
      <td style="text-align: center; color: #94A3B8;">${index + 1}</td>
      <td style="text-align: center; font-weight: 700; color: #1E3A5F; font-size: 12px;">${emp.ma}</td>
      <td>
         <div style="display:flex; align-items:center; gap:10px;">
            <div class="ns-badge" style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:#EFF6FF; color:#2563EB; border-radius:8px; font-weight:700;">${emp.name.charAt(0)}</div>
            <span style="font-weight: 600;">${emp.name}</span>
         </div>
      </td>
      <td><span style="font-size: 12px; color: #475569;">${emp.dept}</span></td>
      <td><span class="ns-badge ns-badge-success" style="font-size: 11px;">${emp.pos}</span></td>
      <td style="text-align: center; color: #64748B;">${emp.acc}</td>
      <td style="text-align: right; font-weight: 700; color: #185FA5;">${emp.hsl.toFixed(3)}</td>
      <td>
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button class="ns-btn-icon" onclick="nsEdit('${emp.ma}')" title="Chỉnh sửa hồ sơ">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="ns-btn-icon delete" onclick="nsDelete('${emp.ma}')" title="Xóa nhân sự">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
};

window.nsOpenAdd = function() {
  const modal = document.getElementById('nsAddModal');
  if (!modal) { console.error('Modal nsAddModal not found'); return; }
  modal.classList.add('open');
  
  const nextMa = 'NV' + (EMPLOYEES.length + 1).toString().padStart(3, '0');
  const maInput = document.getElementById('add_ma');
  if (maInput) maInput.value = nextMa;
  
  ['add_name', 'add_dob', 'add_email'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
};

window.nsCloseAdd = function() {
  const modal = document.getElementById('nsAddModal');
  if (modal) modal.classList.remove('open');
};

window.nsSaveNew = function() {
  const nameEl = document.getElementById('add_name');
  if (!nameEl || !nameEl.value) { alert('Vui lòng nhập họ tên!'); return; }

  const newEmp = {
      stt: EMPLOYEES.length + 1,
      ma: document.getElementById('add_ma').value,
      name: nameEl.value,
      dept: document.getElementById('add_dept')?.value || 'Phòng Tổng hợp HĐTV',
      pos: 'Nhân viên',
      dob: document.getElementById('add_dob').value || '1995-01-01',
      acc: 'user' + (EMPLOYEES.length + 1),
      hsl: 1.0,
      email: document.getElementById('add_email').value || '',
      join: new Date().toISOString().split('T')[0],
      gender: document.getElementById('add_gender')?.value || 'Nam'
  };
  
  EMPLOYEES.push(newEmp);
  window.nsApplyFilters();
  window.nsCloseAdd();
  alert('Đã thêm nhân viên mới thành công!');
};

window.nsEdit = function(ma) {
  const emp = EMPLOYEES.find(e => e.ma === ma);
  if (!emp) return;
  currentEditMa = ma;
  
  const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
  setVal('edit_ma', emp.ma);
  setVal('edit_name', emp.name);
  setVal('edit_dob', emp.dob);
  setVal('edit_join', emp.join);
  
  const modal = document.getElementById('nsEditModal');
  if (modal) modal.classList.add('open');
};

window.nsCloseEdit = function() {
  const modal = document.getElementById('nsEditModal');
  if (modal) modal.classList.remove('open');
};

window.nsSaveEdit = function() {
  const emp = EMPLOYEES.find(e => e.ma === currentEditMa);
  if (!emp) return;
  
  emp.name = document.getElementById('edit_name').value;
  emp.dob = document.getElementById('edit_dob').value;
  
  window.nsApplyFilters();
  window.nsCloseEdit();
  alert('Đã cập nhật thông tin nhân viên!');
};

window.nsDelete = function(ma) {
  if(confirm('Bạn có chắc muốn xóa nhân viên ' + ma + '?')) {
      EMPLOYEES = EMPLOYEES.filter(e => e.ma !== ma);
      window.nsApplyFilters();
      alert('Đã xóa nhân viên!');
  }
};

window.nsApplyFilters = function() {
  const searchEl = document.getElementById('nsSearch');
  const val = (searchEl ? searchEl.value : '').toLowerCase();
  
  currentData = EMPLOYEES.filter(r => 
    r.name.toLowerCase().includes(val) || 
    r.ma.toLowerCase().includes(val) ||
    r.acc.toLowerCase().includes(val)
  );
  window.renderNsTable();
};

window.nsToggleSubForm = function(id) {
  const panel = document.getElementById(id);
  const all = document.querySelectorAll('.ns-subform-panel');
  if (!panel) return;
  const isVisible = panel.style.display === 'block';
  all.forEach(p => p.style.display = 'none');
  if (!isVisible) panel.style.display = 'block';
};

// Đăng ký với hệ thống dashboard
window.pageInitRegistry = window.pageInitRegistry || {};
window.pageInitRegistry['dm-nguoi-dung'] = window.renderNsTable;

// Chạy thử lần đầu nếu đang ở đúng trang
if (document.getElementById('page-dm-nguoi-dung')?.classList.contains('active')) {
  setTimeout(window.renderNsTable, 300);
}
