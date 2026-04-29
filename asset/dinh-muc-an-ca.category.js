// ══════════ DANH MỤC ĐỊNH MỨC ĂN CA ══════════
let dmacData = [
  { id: 2, tenLoai: 'Loại 2', giaTri: 730000, moTa: 'Số công hưởng ăn ca dưới 730000đ/tháng', ngayHieuLuc: '2024-01-01', ngayKetThuc: null },
  { id: 3, tenLoai: 'Loại 3', giaTri: 31000, moTa: 'Số công hưởng(31000đ/ngày)', ngayHieuLuc: '2024-01-01', ngayKetThuc: null },
  { id: 4, tenLoai: 'Loại 4', giaTri: 27000, moTa: 'Số công hưởng(27000đ/ngày)', ngayHieuLuc: '2024-01-01', ngayKetThuc: null },
  { id: 1, tenLoai: 'Loại 1', giaTri: 730000, moTa: 'Số công hưởng ăn ca trên 730000đ/tháng', ngayHieuLuc: '2023-01-01', ngayKetThuc: null },
];

let dmacNextId = 5;
let dmacEditId = null;
let dmacDeleteId = null;
let dmacCurrentPage = 1;
const DMAC_ITEMS_PER_PAGE = 10;

// ─── Render bảng ───────────────────────────────────────────────────
function dmacRender() {
  const q = (document.getElementById('dmacSearch')?.value || '').trim().toLowerCase();
  const filtered = dmacData.filter(r =>
    r.tenLoai.toLowerCase().includes(q) ||
    r.id.toString() === q
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / DMAC_ITEMS_PER_PAGE) || 1;

  if (dmacCurrentPage > totalPages) dmacCurrentPage = totalPages;
  if (dmacCurrentPage < 1)         dmacCurrentPage = 1;

  const startIndex = (dmacCurrentPage - 1) * DMAC_ITEMS_PER_PAGE;
  const pagedData  = filtered.slice(startIndex, startIndex + DMAC_ITEMS_PER_PAGE);

  const tbody = document.getElementById('dmacTbody');
  const pill  = document.getElementById('dmacTotal');
  if (pill) pill.textContent = totalItems + ' bản ghi';

  if (!tbody) return;

  if (pagedData.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="7">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    const pagin = document.getElementById('dmacPagination');
    if (pagin) pagin.innerHTML = '';
    return;
  }

  tbody.innerHTML = pagedData.map(r => `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${r.id}</td>
      <td style="font-weight:600;color:#111827">${r.tenLoai}</td>
      <td style="text-align:right;font-weight:700;color:#185FA5">${r.giaTri.toLocaleString()} VNĐ</td>
      <td style="color:#6B7280;font-size:13px">${r.moTa || '<span style="color:#D1D5DB">—</span>'}</td>
      <td style="text-align:center">${r.ngayHieuLuc}</td>
      <td style="text-align:center">${r.ngayKetThuc || '<span style="color:#D1D5DB">—</span>'}</td>
      <td style="text-align:center;white-space:nowrap;">
        <div class="cat-action-btns">
          <button class="cat-btn-edit" onclick="dmacOpenEdit(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Sửa
          </button>
          <button class="cat-btn-del" onclick="dmacOpenDelete(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Xóa
          </button>
        </div>
      </td>
    </tr>`).join('');

  dmacRenderPagination(totalPages);
}

// ─── Phân trang ────────────────────────────────────────────────────
function dmacRenderPagination(totalPages) {
  const container = document.getElementById('dmacPagination');
  if (!container) return;
  let html = '';

  html += `<button onclick="dmacGoPage(${dmacCurrentPage - 1})" ${dmacCurrentPage === 1 ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${dmacCurrentPage === 1 ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Trước</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === dmacCurrentPage) {
      html += `<button style="padding:4px 10px;border:1px solid #185FA5;background:#185FA5;color:#fff;cursor:default;border-radius:4px;font-size:13px;font-weight:600;">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= dmacCurrentPage - 2 && i <= dmacCurrentPage + 2)) {
      html += `<button onclick="dmacGoPage(${i})" style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;transition:all 0.2s;">${i}</button>`;
    } else if (i === dmacCurrentPage - 3 || i === dmacCurrentPage + 3) {
      html += `<span style="padding:4px 5px;color:#6B7280;">...</span>`;
    }
  }

  html += `<button onclick="dmacGoPage(${dmacCurrentPage + 1})" ${dmacCurrentPage === totalPages ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${dmacCurrentPage === totalPages ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Sau</button>`;

  container.innerHTML = html;
}

function dmacGoPage(page) {
  dmacCurrentPage = page;
  dmacRender();
}

// ─── Modal Thêm ────────────────────────────────────────────────────
function dmacOpenAdd() {
  dmacEditId = null;
  document.getElementById('dmacModalTitle').textContent = 'Thêm định mức ăn ca';
  document.getElementById('dmacTenLoai').value      = '';
  document.getElementById('dmacGiaTri').value       = '';
  document.getElementById('dmacMoTa').value          = '';
  document.getElementById('dmacNgayHieuLuc').value   = '';
  document.getElementById('dmacNgayKetThuc').value  = '';
  _dmacClearErrors();
  document.getElementById('dmacModal').classList.add('open');
  setTimeout(() => document.getElementById('dmacTenLoai').focus(), 100);
}

// ─── Modal Sửa ────────────────────────────────────────────────────
function dmacOpenEdit(id) {
  const r = dmacData.find(x => x.id === id);
  if (!r) return;
  dmacEditId = id;
  document.getElementById('dmacModalTitle').textContent = 'Sửa định mức ăn ca';
  document.getElementById('dmacTenLoai').value      = r.tenLoai;
  document.getElementById('dmacGiaTri').value       = r.giaTri;
  document.getElementById('dmacMoTa').value          = r.moTa;
  document.getElementById('dmacNgayHieuLuc').value   = r.ngayHieuLuc;
  document.getElementById('dmacNgayKetThuc').value  = r.ngayKetThuc || '';
  _dmacClearErrors();
  document.getElementById('dmacModal').classList.add('open');
  setTimeout(() => document.getElementById('dmacTenLoai').focus(), 100);
}

function dmacCloseModal() {
  document.getElementById('dmacModal').classList.remove('open');
}

function _dmacClearErrors() {
  ['errDmacTenLoai', 'errDmacGiaTri', 'errDmacNgayHieuLuc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

// ─── Lưu (thêm / sửa) ─────────────────────────────────────────────
function dmacSave() {
  const tenLoai      = document.getElementById('dmacTenLoai').value.trim();
  const giaTri       = parseFloat(document.getElementById('dmacGiaTri').value) || 0;
  const moTa         = document.getElementById('dmacMoTa').value.trim();
  const ngayHieuLuc  = document.getElementById('dmacNgayHieuLuc').value;
  const ngayKetThuc  = document.getElementById('dmacNgayKetThuc').value || null;

  let valid = true;
  const errTen         = document.getElementById('errDmacTenLoai');
  const errGiaTri      = document.getElementById('errDmacGiaTri');
  const errNgayHieuLuc = document.getElementById('errDmacNgayHieuLuc');

  if (!tenLoai)      { if (errTen)         { errTen.textContent = 'Vui lòng nhập tên loại.';   errTen.style.display = 'block'; }         valid = false; }
  if (giaTri <= 0)   { if (errGiaTri)      { errGiaTri.textContent = 'Giá trị phải lớn hơn 0.'; errGiaTri.style.display = 'block'; }      valid = false; }
  if (!ngayHieuLuc)  { if (errNgayHieuLuc){ errNgayHieuLuc.textContent = 'Vui lòng chọn ngày hiệu lực.'; errNgayHieuLuc.style.display = 'block'; } valid = false; }

  if (!valid) return;

  if (dmacEditId) {
    const r = dmacData.find(x => x.id === dmacEditId);
    if (r) {
      r.tenLoai = tenLoai; r.giaTri = giaTri; r.moTa = moTa;
      r.ngayHieuLuc = ngayHieuLuc; r.ngayKetThuc = ngayKetThuc;
    }
  } else {
    dmacData.unshift({ id: dmacNextId++, tenLoai, giaTri, moTa, ngayHieuLuc, ngayKetThuc });
  }

  dmacCloseModal();
  dmacRender();
}

// ─── Xóa ──────────────────────────────────────────────────────────
function dmacOpenDelete(id) {
  dmacDeleteId = id;
  const r = dmacData.find(x => x.id === id);
  if (!r) return;
  document.getElementById('dmacDeleteMsg').textContent =
    `Bạn có chắc muốn xóa định mức ăn ca "${r.tenLoai}" không?`;
  document.getElementById('dmacDeleteModal').classList.add('open');
}

function dmacCloseDelete() {
  document.getElementById('dmacDeleteModal').classList.remove('open');
}

function dmacConfirmDelete() {
  dmacData = dmacData.filter(x => x.id !== dmacDeleteId);
  const totalPages = Math.ceil(dmacData.length / DMAC_ITEMS_PER_PAGE) || 1;
  if (dmacCurrentPage > totalPages) dmacCurrentPage = totalPages;
  dmacCloseDelete();
  dmacRender();
}

// ─── Initialize ───────────────────────────────────────────────────
(function() {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'dm-an-ca') dmacRender();
  };
})();

// Also call it immediately if we're already on that page (unlikely but safe)
if (document.getElementById('page-dm-an-ca')?.classList.contains('active')) {
  dmacRender();
}
