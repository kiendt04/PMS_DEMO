// ══════════ QUẢN LÝ QUYỀN (ROLE SYSTEM) ══════════
let roleData = [
  { id: 1, ten: 'Giám đốc', moTa: 'Người có quyền điều hành mọi vấn đề quan trọng của công ty' },
  { id: 2, ten: 'Nhân viên phòng TCNS', moTa: 'Trưởng phòng có các quyền sau: - Chấm công - Theo dõi nghỉ phép ...' },
  { id: 3, ten: 'Nhân viên phòng TCKT', moTa: 'NV phòng tài chính kế toán được phép: - Tính lương - Tra cứu thông tin tiền lương của cả đơn vị' },
  { id: 4, ten: 'Phó giám đốc', moTa: '' },
  { id: 5, ten: 'Nhân viên', moTa: '' },
  { id: 5, ten: 'Nhân viên nhập liệu', moTa: 'Nhập liệu thông tin cho từng phòng ban' },
];

let roleNextId = 26;
let roleEditId = null;
let roleDeleteId = null;
let roleCurrentPage = 1;
const ROLE_ITEMS_PER_PAGE = 10;

// ─── Render bảng ───────────────────────────────────────────────────
function roleRender() {
  const q = (document.getElementById('roleSearch').value || '').trim().toLowerCase();
  const filtered = roleData.filter(r =>
    r.ten.toLowerCase().includes(q) ||
    r.moTa.toLowerCase().includes(q) ||
    r.id.toString() === q
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / ROLE_ITEMS_PER_PAGE) || 1;

  if (roleCurrentPage > totalPages) roleCurrentPage = totalPages;
  if (roleCurrentPage < 1) roleCurrentPage = 1;

  const startIndex = (roleCurrentPage - 1) * ROLE_ITEMS_PER_PAGE;
  const pagedData = filtered.slice(startIndex, startIndex + ROLE_ITEMS_PER_PAGE);

  const tbody = document.getElementById('roleTbody');
  const pill = document.getElementById('roleTotal');
  if (pill) pill.textContent = totalItems + ' quyền';

  if (pagedData.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="4">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    document.getElementById('rolePagination').innerHTML = '';
    return;
  }

  tbody.innerHTML = pagedData.map(r => `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${r.id}</td>
      <td style="font-weight:600;color:#111827">${r.ten}</td>
      <td style="color:#6B7280;font-size:13px">${r.moTa || '<span style="color:#D1D5DB">—</span>'}</td>
      <td style="text-align:center; white-space:nowrap;">
        <div class="cat-action-btns">
          <button class="cat-btn-edit" onclick="roleOpenEdit(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Sửa
          </button>
          <button class="cat-btn-del" onclick="roleOpenDelete(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Xóa
          </button>
        </div>
      </td>
    </tr>`).join('');

  roleRenderPagination(totalPages);
}

// ─── Phân trang ────────────────────────────────────────────────────
function roleRenderPagination(totalPages) {
  const container = document.getElementById('rolePagination');
  let html = '';

  html += `<button onclick="roleGoPage(${roleCurrentPage - 1})" ${roleCurrentPage === 1 ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${roleCurrentPage === 1 ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Trước</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === roleCurrentPage) {
      html += `<button style="padding:4px 10px;border:1px solid #0D9488;background:#0D9488;color:#fff;cursor:default;border-radius:4px;font-size:13px;font-weight:600;">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= roleCurrentPage - 2 && i <= roleCurrentPage + 2)) {
      html += `<button onclick="roleGoPage(${i})" style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;transition:all 0.2s;">${i}</button>`;
    } else if (i === roleCurrentPage - 3 || i === roleCurrentPage + 3) {
      html += `<span style="padding:4px 5px;color:#6B7280;">...</span>`;
    }
  }

  html += `<button onclick="roleGoPage(${roleCurrentPage + 1})" ${roleCurrentPage === totalPages ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${roleCurrentPage === totalPages ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Sau</button>`;

  container.innerHTML = html;
}

function roleGoPage(page) {
  roleCurrentPage = page;
  roleRender();
}

// ─── Modal Thêm ────────────────────────────────────────────────────
function roleOpenAdd() {
  roleEditId = null;
  document.getElementById('roleModalTitle').textContent = 'Thêm quyền mới';
  document.getElementById('roleTen').value = '';
  document.getElementById('roleMoTa').value = '';
  _roleClearErrors();
  document.getElementById('roleModal').classList.add('open');
  setTimeout(() => document.getElementById('roleTen').focus(), 100);
}

// ─── Modal Sửa ────────────────────────────────────────────────────
function roleOpenEdit(id) {
  const r = roleData.find(x => x.id === id);
  if (!r) return;
  roleEditId = id;
  document.getElementById('roleModalTitle').textContent = 'Sửa thông tin quyền';
  document.getElementById('roleTen').value = r.ten;
  document.getElementById('roleMoTa').value = r.moTa;
  _roleClearErrors();
  document.getElementById('roleModal').classList.add('open');
  setTimeout(() => document.getElementById('roleTen').focus(), 100);
}

function roleCloseModal() {
  document.getElementById('roleModal').classList.remove('open');
}

function _roleClearErrors() {
  ['errRoleTen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

// ─── Lưu (thêm / sửa) ─────────────────────────────────────────────
function roleSave() {
  const ten = document.getElementById('roleTen').value.trim();
  const moTa = document.getElementById('roleMoTa').value.trim();

  let valid = true;
  const errTen = document.getElementById('errRoleTen');

  if (errTen) errTen.style.display = 'none';

  if (!ten) {
    if (errTen) {
      errTen.textContent = 'Vui lòng nhập tên quyền.';
      errTen.style.display = 'block';
    }
    valid = false;
  }

  if (!valid) return;

  if (roleEditId) {
    const r = roleData.find(x => x.id === roleEditId);
    if (r) {
      r.ten = ten;
      r.moTa = moTa;
    }
  } else {
    roleData.unshift({ id: roleNextId++, ten, moTa });
  }

  roleCloseModal();
  roleRender();
}

// ─── Xóa ──────────────────────────────────────────────────────────
function roleOpenDelete(id) {
  roleDeleteId = id;
  const r = roleData.find(x => x.id === id);
  if (!r) return;
  document.getElementById('roleDeleteMsg').textContent =
    `Bạn có chắc muốn xóa quyền "${r.ten}" không? Hành động này không thể hoàn tác.`;
  document.getElementById('roleDeleteModal').classList.add('open');
}

function roleCloseDelete() {
  document.getElementById('roleDeleteModal').classList.remove('open');
}

function roleConfirmDelete() {
  roleData = roleData.filter(x => x.id !== roleDeleteId);
  const totalPages = Math.ceil(roleData.length / ROLE_ITEMS_PER_PAGE) || 1;
  if (roleCurrentPage > totalPages) roleCurrentPage = totalPages;
  roleCloseDelete();
  roleRender();
}

// ─── Close on backdrop ────────────────────────────────────────────
document.getElementById('roleModal').addEventListener('click', function (e) { if (e.target === this) roleCloseModal(); });
document.getElementById('roleDeleteModal').addEventListener('click', function (e) { if (e.target === this) roleCloseDelete(); });

// ─── Khởi tạo ────────────────────────────────────────────────────
roleRender();

(function () {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'ql-quyen') roleRender();
  };
})();
