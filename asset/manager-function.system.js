// ══════════ QUẢN LÝ CHỨC NĂNG (FUNCTION SYSTEM) ══════════
let funcData = [
  { id: 1, icon: 'home', ten: 'Trang chủ', menuCha: 'Menu gốc', dieuKhien: '/Home', sapXep: 1, metaTitle: 'trang-chu' },
  { id: 2, icon: 'folder', ten: 'Danh mục loại ngày công', menuCha: 'Danh mục', dieuKhien: '/TypeWorkDays', sapXep: 1, metaTitle: 'loai-ngay-cong' },
  { id: 3, icon: 'users', ten: 'Tiện ích', menuCha: 'Menu gốc', dieuKhien: '---', sapXep: 2, metaTitle: 'tien-ich' },
  { id: 4, icon: 'settings', ten: 'Danh mục', menuCha: 'Menu gốc', dieuKhien: '---', sapXep: 3, metaTitle: 'danh-muc' },
  { id: 5, icon: 'command', ten: 'Quản lý phòng ban', menuCha: 'Menu gốc', dieuKhien: '---', sapXep: 4, metaTitle: 'quan-ly-phong-ban' },
  { id: 6, icon: 'command', ten: 'Quản trị hệ thống', menuCha: 'Menu gốc', dieuKhien: '---', sapXep: 5, metaTitle: 'quan-tri-he-thong' },
  { id: 7, icon: 'command', ten: 'Quản lý chấm công', menuCha: 'Tiện ích', dieuKhien: '/TimeKeeping', sapXep: 21, metaTitle: 'time-keeping' },
  { id: 8, icon: 'command', ten: 'Quản lý người dùng', menuCha: 'Tiện ích', dieuKhien: '/tblUsers', sapXep: 22, metaTitle: 'nguoi-dung' },
  { id: 9, icon: 'command', ten: 'Quản lý tạm ứng lương', menuCha: 'Tiện ích', dieuKhien: '/AdvanceSalary', sapXep: 23, metaTitle: 'tam-ung-luong' },
  { id: 10, icon: 'command', ten: 'Quản lý an toàn điện', menuCha: 'Tiện ích', dieuKhien: '	/ElectricalSafety', sapXep: 24, metaTitle: 'an-toan-dien' },
  { id: 11, icon: 'command', ten: 'Quản lý điều chuyển', menuCha: 'Tiện ích', dieuKhien: '/TransferUser', sapXep: 27, metaTitle: 'dieu-chuyen' },
  { id: 12, icon: 'command', ten: 'Quản lý nghỉ phép', menuCha: 'Tiện ích', dieuKhien: '/LeaveManagement', sapXep: 28, metaTitle: 'nghi-phep' },
  { id: 13, icon: 'command', ten: 'Định mức ăn ca', menuCha: 'Danh mục', dieuKhien: '/TblMealAllowanceQuota', sapXep: 29, metaTitle: 'dinh-muc-an-ca' },
  { id: 14, icon: 'command', ten: 'Danh mục Thời gian làm việc', menuCha: 'Danh mục', dieuKhien: '/tblTimeWorks', sapXep: 31, metaTitle: 'thoi-gian-lam-viec' },
  { id: 15, icon: 'command', ten: 'Danh mục chức vụ', menuCha: 'Danh mục', dieuKhien: '/TblPosition', sapXep: 31, metaTitle: 'chuc-vu' },
  { id: 16, icon: 'command', ten: 'Cập nhật Hệ số lương', menuCha: 'Tiện ích', dieuKhien: '/TblSalaryChangeds', sapXep: 31, metaTitle: 'he-so-luong' },
  { id: 17, icon: 'command', ten: 'Danh mục phòng ban', menuCha: 'Danh mục', dieuKhien: '/TblDepartments', sapXep: 32, metaTitle: 'phong-ban' },
  { id: 18, icon: 'command', ten: 'Danh mục lương cơ bản', menuCha: 'Danh mục', dieuKhien: '/TblBaseSalaries', sapXep: 33, metaTitle: 'luong-co-ban' },
  { id: 19, icon: 'command', ten: 'Danh mục định mức điện thoại', menuCha: 'Danh mục', dieuKhien: '/TblPhoneLimits', sapXep: 34, metaTitle: 'dinh-muc-dien-thoai' },
  { id: 20, icon: 'command', ten: 'Danh mục phụ trợ', menuCha: 'Danh mục', dieuKhien: '/PhuTro', sapXep: 35, metaTitle: 'phu-tro' },
];

// Dữ liệu mẫu thêm để xem phân trang
for (let i = 6; i <= 25; i++) {
  funcData.push({
    id: i,
    icon: 'circle',
    ten: `Chức năng mẫu ${i}`,
    menuCha: i % 2 === 0 ? 'Danh mục' : 'Hệ thống',
    dieuKhien: `func-${i}`,
    sapXep: i,
    metaTitle: `Tiêu đề ${i}`
  });
}

let funcNextId = 26;
let funcEditId = null;
let funcDeleteId = null;
let funcCurrentPage = 1;
const FUNC_ITEMS_PER_PAGE = 10;

// ─── Render bảng ───────────────────────────────────────────────────
function funcRender() {
  const q = (document.getElementById('funcSearch').value || '').trim().toLowerCase();
  const filtered = funcData.filter(r =>
    r.ten.toLowerCase().includes(q) ||
    r.menuCha.toLowerCase().includes(q) ||
    r.dieuKhien.toLowerCase().includes(q) ||
    r.id.toString() === q
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / FUNC_ITEMS_PER_PAGE) || 1;

  if (funcCurrentPage > totalPages) funcCurrentPage = totalPages;
  if (funcCurrentPage < 1) funcCurrentPage = 1;

  const startIndex = (funcCurrentPage - 1) * FUNC_ITEMS_PER_PAGE;
  const pagedData = filtered.slice(startIndex, startIndex + FUNC_ITEMS_PER_PAGE);

  const tbody = document.getElementById('funcTbody');
  const pill = document.getElementById('funcTotal');
  if (pill) pill.textContent = totalItems + ' chức năng';

  if (pagedData.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="8">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    document.getElementById('funcPagination').innerHTML = '';
    return;
  }

  tbody.innerHTML = pagedData.map(r => `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${r.id}</td>
      <td style="text-align:center;"><span class="cat-chip-blue" style="font-family:monospace;">${r.icon}</span></td>
      <td style="font-weight:600;color:#111827">${r.ten}</td>
      <td style="color:#6B7280">${r.menuCha || '<span style="color:#D1D5DB">Gốc</span>'}</td>
      <td><code style="background:#F3F4F6;padding:2px 4px;border-radius:4px;font-size:12px;">${r.dieuKhien}</code></td>
      <td style="text-align:center">${r.sapXep}</td>
      <td style="font-style:italic;color:#6B7280;font-size:12px">${r.metaTitle || ''}</td>
      <td style="text-align:center; white-space:nowrap;">
        <div class="cat-action-btns">
          <button class="cat-btn-edit" onclick="funcOpenEdit(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Sửa
          </button>
          <button class="cat-btn-del" onclick="funcOpenDelete(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Xóa
          </button>
        </div>
      </td>
    </tr>`).join('');

  funcRenderPagination(totalPages);
}

// ─── Phân trang ────────────────────────────────────────────────────
function funcRenderPagination(totalPages) {
  const container = document.getElementById('funcPagination');
  let html = '';

  html += `<button onclick="funcGoPage(${funcCurrentPage - 1})" ${funcCurrentPage === 1 ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${funcCurrentPage === 1 ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Trước</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === funcCurrentPage) {
      html += `<button style="padding:4px 10px;border:1px solid #0D9488;background:#0D9488;color:#fff;cursor:default;border-radius:4px;font-size:13px;font-weight:600;">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= funcCurrentPage - 2 && i <= funcCurrentPage + 2)) {
      html += `<button onclick="funcGoPage(${i})" style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;transition:all 0.2s;">${i}</button>`;
    } else if (i === funcCurrentPage - 3 || i === funcCurrentPage + 3) {
      html += `<span style="padding:4px 5px;color:#6B7280;">...</span>`;
    }
  }

  html += `<button onclick="funcGoPage(${funcCurrentPage + 1})" ${funcCurrentPage === totalPages ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${funcCurrentPage === totalPages ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Sau</button>`;

  container.innerHTML = html;
}

function funcGoPage(page) {
  funcCurrentPage = page;
  funcRender();
}

// ─── Modal Thêm ────────────────────────────────────────────────────
function funcOpenAdd() {
  funcEditId = null;
  document.getElementById('funcModalTitle').textContent = 'Thêm chức năng mới';
  document.getElementById('funcIcon').value = '';
  document.getElementById('funcTen').value = '';
  document.getElementById('funcMenuCha').value = '';
  document.getElementById('funcDieuKhien').value = '';
  document.getElementById('funcSapXep').value = '1';
  document.getElementById('funcMetaTitle').value = '';
  _funcClearErrors();
  document.getElementById('funcModal').classList.add('open');
  setTimeout(() => document.getElementById('funcTen').focus(), 100);
}

// ─── Modal Sửa ────────────────────────────────────────────────────
function funcOpenEdit(id) {
  const r = funcData.find(x => x.id === id);
  if (!r) return;
  funcEditId = id;
  document.getElementById('funcModalTitle').textContent = 'Sửa chức năng';
  document.getElementById('funcIcon').value = r.icon;
  document.getElementById('funcTen').value = r.ten;
  document.getElementById('funcMenuCha').value = r.menuCha;
  document.getElementById('funcDieuKhien').value = r.dieuKhien;
  document.getElementById('funcSapXep').value = r.sapXep;
  document.getElementById('funcMetaTitle').value = r.metaTitle;
  _funcClearErrors();
  document.getElementById('funcModal').classList.add('open');
  setTimeout(() => document.getElementById('funcTen').focus(), 100);
}

function funcCloseModal() {
  document.getElementById('funcModal').classList.remove('open');
}

function _funcClearErrors() {
  ['errFuncTen', 'errFuncDieuKhien'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

// ─── Lưu (thêm / sửa) ─────────────────────────────────────────────
function funcSave() {
  const icon = document.getElementById('funcIcon').value.trim();
  const ten = document.getElementById('funcTen').value.trim();
  const menuCha = document.getElementById('funcMenuCha').value.trim();
  const dieuKhien = document.getElementById('funcDieuKhien').value.trim();
  const sapXep = parseInt(document.getElementById('funcSapXep').value) || 0;
  const metaTitle = document.getElementById('funcMetaTitle').value.trim();

  let valid = true;
  const errTen = document.getElementById('errFuncTen');
  const errDieuKhien = document.getElementById('errFuncDieuKhien');

  if (errTen) errTen.style.display = 'none';
  if (errDieuKhien) errDieuKhien.style.display = 'none';

  if (!ten) {
    if (errTen) { errTen.textContent = 'Vui lòng nhập tên menu.'; errTen.style.display = 'block'; }
    valid = false;
  }
  if (!dieuKhien) {
    if (errDieuKhien) { errDieuKhien.textContent = 'Vui lòng nhập tên điều khiển.'; errDieuKhien.style.display = 'block'; }
    valid = false;
  }

  if (!valid) return;

  if (funcEditId) {
    const r = funcData.find(x => x.id === funcEditId);
    if (r) {
      r.icon = icon; r.ten = ten; r.menuCha = menuCha;
      r.dieuKhien = dieuKhien; r.sapXep = sapXep; r.metaTitle = metaTitle;
    }
  } else {
    funcData.unshift({ id: funcNextId++, icon, ten, menuCha, dieuKhien, sapXep, metaTitle });
  }

  funcCloseModal();
  funcRender();
}

// ─── Xóa ──────────────────────────────────────────────────────────
function funcOpenDelete(id) {
  funcDeleteId = id;
  const r = funcData.find(x => x.id === id);
  if (!r) return;
  document.getElementById('funcDeleteMsg').textContent =
    `Bạn có chắc muốn xóa chức năng "${r.ten}" không? Hành động này không thể hoàn tác.`;
  document.getElementById('funcDeleteModal').classList.add('open');
}

function funcCloseDelete() {
  document.getElementById('funcDeleteModal').classList.remove('open');
}

function funcConfirmDelete() {
  funcData = funcData.filter(x => x.id !== funcDeleteId);
  const totalPages = Math.ceil(funcData.length / FUNC_ITEMS_PER_PAGE) || 1;
  if (funcCurrentPage > totalPages) funcCurrentPage = totalPages;
  funcCloseDelete();
  funcRender();
}

// ─── Close on backdrop ────────────────────────────────────────────
document.getElementById('funcModal').addEventListener('click', function (e) { if (e.target === this) funcCloseModal(); });
document.getElementById('funcDeleteModal').addEventListener('click', function (e) { if (e.target === this) funcCloseDelete(); });

// ─── Khởi tạo ────────────────────────────────────────────────────
funcRender();

(function () {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'ql-chuc-nang') funcRender();
  };
})();
