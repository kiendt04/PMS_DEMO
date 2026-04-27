// ══════════ DANH MỤC LƯƠNG CƠ BẢN ══════════
let lcbData = [
  { id: 1,  ten: 'Lương tối thiểu vùng I',   mucLuong: 4680000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Áp dụng cho khu vực I (Hà Nội, TP.HCM, Bình Dương...)' },
  { id: 2,  ten: 'Lương tối thiểu vùng II',  mucLuong: 4160000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Áp dụng cho khu vực II' },
  { id: 3,  ten: 'Lương tối thiểu vùng III', mucLuong: 3640000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Áp dụng cho khu vực III' },
  { id: 4,  ten: 'Lương tối thiểu vùng IV',  mucLuong: 3250000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Áp dụng cho khu vực IV' },
  { id: 5,  ten: 'Lương cơ sở nhà nước',      mucLuong: 2340000,  ngayHieuLuc: '2023-07-01', ngayKetThuc: '2024-06-30', moTa: 'Lương cơ sở cũ, hết hiệu lực từ 01/07/2024' },
  { id: 6,  ten: 'Lương cơ sở nhà nước mới',  mucLuong: 2800000,  ngayHieuLuc: '2024-07-01', ngayKetThuc: null,          moTa: 'Điều chỉnh theo Nghị định mới từ 01/07/2024' },
  { id: 7,  ten: 'Lương bậc 1 - Kỹ thuật',   mucLuong: 5500000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Bậc khởi điểm khối kỹ thuật' },
  { id: 8,  ten: 'Lương bậc 2 - Kỹ thuật',   mucLuong: 6500000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Bậc trung cấp khối kỹ thuật' },
  { id: 9,  ten: 'Lương bậc 3 - Kỹ thuật',   mucLuong: 7800000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Bậc cao khối kỹ thuật' },
  { id: 10, ten: 'Lương bậc 1 - Kinh doanh', mucLuong: 5000000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Bậc khởi điểm khối kinh doanh' },
  { id: 11, ten: 'Lương bậc 2 - Kinh doanh', mucLuong: 6000000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Bậc trung cấp khối kinh doanh' },
  { id: 12, ten: 'Lương bậc 3 - Kinh doanh', mucLuong: 7200000,  ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Bậc cao khối kinh doanh' },
  { id: 13, ten: 'Lương quản lý cấp 1',       mucLuong: 15000000, ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Trưởng phòng, phó phòng' },
  { id: 14, ten: 'Lương quản lý cấp 2',       mucLuong: 20000000, ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Giám đốc bộ phận' },
  { id: 15, ten: 'Lương quản lý cấp 3',       mucLuong: 30000000, ngayHieuLuc: '2024-01-01', ngayKetThuc: null,          moTa: 'Giám đốc điều hành, phó tổng' },
];

// Thêm dữ liệu mẫu để xem phân trang
for (let i = 16; i <= 28; i++) {
  lcbData.push({
    id: i,
    ten: `Mức lương ${i}`,
    mucLuong: i * 1000000,
    ngayHieuLuc: '2024-01-01',
    ngayKetThuc: null,
    moTa: 'Mô tả mức lương...'
  });
}

let lcbNextId   = 29;
let lcbEditId   = null;
let lcbDeleteId = null;
let lcbCurrentPage = 1;
const LCB_ITEMS_PER_PAGE = 10;

// ─── Định dạng tiền VNĐ ──────────────────────────────────────────────
function lcbFormatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

// ─── Render bảng ─────────────────────────────────────────────────────
function lcbRender() {
  const q = (document.getElementById('lcbSearch').value || '').trim().toLowerCase();
  const filtered = lcbData.filter(r =>
    r.ten.toLowerCase().includes(q) ||
    r.id.toString() === q
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / LCB_ITEMS_PER_PAGE) || 1;

  if (lcbCurrentPage > totalPages) lcbCurrentPage = totalPages;
  if (lcbCurrentPage < 1)         lcbCurrentPage = 1;

  const startIndex = (lcbCurrentPage - 1) * LCB_ITEMS_PER_PAGE;
  const pagedData  = filtered.slice(startIndex, startIndex + LCB_ITEMS_PER_PAGE);

  const tbody = document.getElementById('lcbTbody');
  const pill  = document.getElementById('lcbTotal');
  if (pill) pill.textContent = totalItems + ' mức lương';

  if (pagedData.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="6">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    document.getElementById('lcbPagination').innerHTML = '';
    return;
  }

  tbody.innerHTML = pagedData.map(r => {
    const ngayKT = r.ngayKetThuc
      ? `<span style="color:#374151">${r.ngayKetThuc}</span>`
      : `<span style="color:#D1D5DB;font-weight:600">—</span>`;

    return `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${r.id}</td>
      <td style="font-weight:600;color:#111827">${r.ten}</td>
      <td style="text-align:right;font-weight:700;color:#185FA5;font-size:14px">${lcbFormatVND(r.mucLuong)}</td>
      <td>${r.ngayHieuLuc}</td>
      <td>${ngayKT}</td>
      <td style="color:#6B7280;font-size:13px">${r.moTa || '<span style="color:#D1D5DB">—</span>'}</td>
      <td style="text-align:center;white-space:nowrap;">
        <button class="cat-btn-edit" onclick="lcbOpenEdit(${r.id})">
          <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Sửa
        </button>
        <button class="cat-btn-del" onclick="lcbOpenDelete(${r.id})">
          <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Xóa
        </button>
      </td>
    </tr>`;
  }).join('');

  lcbRenderPagination(totalPages);
}

// ─── Phân trang ──────────────────────────────────────────────────────
function lcbRenderPagination(totalPages) {
  const container = document.getElementById('lcbPagination');
  let html = '';

  html += `<button onclick="lcbGoPage(${lcbCurrentPage - 1})" ${lcbCurrentPage === 1 ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${lcbCurrentPage === 1 ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Trước</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === lcbCurrentPage) {
      html += `<button style="padding:4px 10px;border:1px solid #185FA5;background:#185FA5;color:#fff;cursor:default;border-radius:4px;font-size:13px;font-weight:600;">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= lcbCurrentPage - 2 && i <= lcbCurrentPage + 2)) {
      html += `<button onclick="lcbGoPage(${i})" style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;transition:all 0.2s;">${i}</button>`;
    } else if (i === lcbCurrentPage - 3 || i === lcbCurrentPage + 3) {
      html += `<span style="padding:4px 5px;color:#6B7280;">...</span>`;
    }
  }

  html += `<button onclick="lcbGoPage(${lcbCurrentPage + 1})" ${lcbCurrentPage === totalPages ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${lcbCurrentPage === totalPages ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Sau</button>`;

  container.innerHTML = html;
}

function lcbGoPage(page) {
  lcbCurrentPage = page;
  lcbRender();
}

// ─── Xóa lỗi form ────────────────────────────────────────────────────
function _lcbClearErrors() {
  ['errLcbTen', 'errLcbMucLuong', 'errLcbNgayHieuLuc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

// ─── Modal Thêm ──────────────────────────────────────────────────────
function lcbOpenAdd() {
  lcbEditId = null;
  document.getElementById('lcbModalTitle').textContent = 'Thêm mức lương cơ bản';
  document.getElementById('lcbTen').value          = '';
  document.getElementById('lcbMucLuong').value     = '';
  document.getElementById('lcbNgayHieuLuc').value  = '';
  document.getElementById('lcbNgayKetThuc').value  = '';
  document.getElementById('lcbMoTa').value         = '';
  _lcbClearErrors();
  document.getElementById('lcbModal').classList.add('open');
  setTimeout(() => document.getElementById('lcbTen').focus(), 100);
}

// ─── Modal Sửa ───────────────────────────────────────────────────────
function lcbOpenEdit(id) {
  const r = lcbData.find(x => x.id === id);
  if (!r) return;
  lcbEditId = id;
  document.getElementById('lcbModalTitle').textContent = 'Sửa mức lương cơ bản';
  document.getElementById('lcbTen').value         = r.ten;
  document.getElementById('lcbMucLuong').value    = r.mucLuong;
  document.getElementById('lcbNgayHieuLuc').value = r.ngayHieuLuc;
  document.getElementById('lcbNgayKetThuc').value = r.ngayKetThuc || '';
  document.getElementById('lcbMoTa').value        = r.moTa || '';
  _lcbClearErrors();
  document.getElementById('lcbModal').classList.add('open');
  setTimeout(() => document.getElementById('lcbTen').focus(), 100);
}

function lcbCloseModal() {
  document.getElementById('lcbModal').classList.remove('open');
}

// ─── Lưu (thêm / sửa) ───────────────────────────────────────────────
function lcbSave() {
  const ten         = document.getElementById('lcbTen').value.trim();
  const mucLuong    = parseFloat(document.getElementById('lcbMucLuong').value) || 0;
  const ngayHieuLuc = document.getElementById('lcbNgayHieuLuc').value;
  const ngayKetThuc = document.getElementById('lcbNgayKetThuc').value || null;
  const moTa        = document.getElementById('lcbMoTa').value.trim();

  let valid = true;
  const errTen         = document.getElementById('errLcbTen');
  const errMucLuong    = document.getElementById('errLcbMucLuong');
  const errNgayHieuLuc = document.getElementById('errLcbNgayHieuLuc');

  if (errTen)         errTen.style.display = 'none';
  if (errMucLuong)    errMucLuong.style.display = 'none';
  if (errNgayHieuLuc) errNgayHieuLuc.style.display = 'none';

  if (!ten) {
    if (errTen) { errTen.textContent = 'Vui lòng nhập tên mức lương.'; errTen.style.display = 'block'; }
    valid = false;
  }
  if (!mucLuong || mucLuong <= 0) {
    if (errMucLuong) { errMucLuong.textContent = 'Vui lòng nhập mức lương hợp lệ (> 0).'; errMucLuong.style.display = 'block'; }
    valid = false;
  }
  if (!ngayHieuLuc) {
    if (errNgayHieuLuc) { errNgayHieuLuc.textContent = 'Vui lòng chọn ngày hiệu lực.'; errNgayHieuLuc.style.display = 'block'; }
    valid = false;
  }

  if (!valid) return;

  if (lcbEditId) {
    const r = lcbData.find(x => x.id === lcbEditId);
    if (r) {
      r.ten = ten; r.mucLuong = mucLuong;
      r.ngayHieuLuc = ngayHieuLuc; r.ngayKetThuc = ngayKetThuc; r.moTa = moTa;
    }
  } else {
    lcbData.unshift({ id: lcbNextId++, ten, mucLuong, ngayHieuLuc, ngayKetThuc, moTa });
  }

  lcbCloseModal();
  lcbRender();
}

// ─── Xóa ────────────────────────────────────────────────────────────
function lcbOpenDelete(id) {
  lcbDeleteId = id;
  const r = lcbData.find(x => x.id === id);
  if (!r) return;
  document.getElementById('lcbDeleteMsg').textContent =
    `Bạn có chắc muốn xóa mức lương "${r.ten}" không? Hành động này không thể hoàn tác.`;
  document.getElementById('lcbDeleteModal').classList.add('open');
}

function lcbCloseDelete() {
  document.getElementById('lcbDeleteModal').classList.remove('open');
}

function lcbConfirmDelete() {
  lcbData = lcbData.filter(x => x.id !== lcbDeleteId);
  const totalPages = Math.ceil(lcbData.length / LCB_ITEMS_PER_PAGE) || 1;
  if (lcbCurrentPage > totalPages) lcbCurrentPage = totalPages;
  lcbCloseDelete();
  lcbRender();
}

// ─── Close on backdrop ───────────────────────────────────────────────
document.getElementById('lcbModal').addEventListener('click', function (e) { if (e.target === this) lcbCloseModal(); });
document.getElementById('lcbDeleteModal').addEventListener('click', function (e) { if (e.target === this) lcbCloseDelete(); });

// ─── Khởi tạo ───────────────────────────────────────────────────────
lcbRender();

(function() {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'dm-luong-co-ban') lcbRender();
  };
})();
