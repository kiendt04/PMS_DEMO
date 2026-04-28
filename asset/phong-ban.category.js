// ══════════ DANH MỤC PHÒNG BAN ══════════
let pbcData = [
  { id: 1,  ten: 'Phòng Kinh doanh Miền Bắc',   vietTat: 'KD-MB',  hsCoBan: 3.50, hsTrachNhiem: 1.20, ngayHieuLuc: '2024-01-01', moTa: 'Kinh doanh khu vực phía Bắc' },
  { id: 2,  ten: 'Phòng Kinh doanh Miền Nam',   vietTat: 'KD-MN',  hsCoBan: 3.50, hsTrachNhiem: 1.20, ngayHieuLuc: '2024-01-01', moTa: 'Kinh doanh khu vực phía Nam' },
  { id: 3,  ten: 'Phòng Kỹ thuật',              vietTat: 'KT',     hsCoBan: 3.80, hsTrachNhiem: 1.50, ngayHieuLuc: '2024-01-01', moTa: 'Quản lý kỹ thuật và công nghệ' },
  { id: 4,  ten: 'Phòng Hành chính Nhân sự',    vietTat: 'HCNS',   hsCoBan: 3.20, hsTrachNhiem: 1.00, ngayHieuLuc: '2024-01-01', moTa: 'Quản lý nhân sự và hành chính' },
  { id: 5,  ten: 'Phòng Tài chính Kế toán',     vietTat: 'TCKT',   hsCoBan: 3.60, hsTrachNhiem: 1.30, ngayHieuLuc: '2024-01-01', moTa: 'Quản lý tài chính và kế toán' },
  { id: 6,  ten: 'Phòng Marketing',             vietTat: 'MKT',    hsCoBan: 3.40, hsTrachNhiem: 1.10, ngayHieuLuc: '2024-01-01', moTa: 'Tiếp thị và phát triển thương hiệu' },
  { id: 7,  ten: 'Phòng Công nghệ thông tin',   vietTat: 'CNTT',   hsCoBan: 4.00, hsTrachNhiem: 1.60, ngayHieuLuc: '2024-01-01', moTa: 'Phát triển và vận hành hệ thống IT' },
  { id: 8,  ten: 'Phòng Pháp chế',              vietTat: 'PC',     hsCoBan: 3.70, hsTrachNhiem: 1.40, ngayHieuLuc: '2024-01-01', moTa: 'Quản lý pháp lý và tuân thủ' },
  { id: 9,  ten: 'Phòng Nghiên cứu Phát triển', vietTat: 'R&D',    hsCoBan: 4.20, hsTrachNhiem: 1.80, ngayHieuLuc: '2024-01-01', moTa: 'Nghiên cứu và phát triển sản phẩm' },
  { id: 10, ten: 'Phòng Vận hành',              vietTat: 'VH',     hsCoBan: 3.30, hsTrachNhiem: 1.05, ngayHieuLuc: '2024-01-01', moTa: 'Quản lý vận hành sản xuất' },
];

// Dữ liệu mẫu thêm để xem phân trang
for (let i = 11; i <= 25; i++) {
  pbcData.push({
    id: i,
    ten: `Phòng ban ${i}`,
    vietTat: `PB${i}`,
    hsCoBan: 3.00,
    hsTrachNhiem: 1.00,
    ngayHieuLuc: '2024-01-01',
    moTa: 'Mô tả phòng ban...'
  });
}

let pbcNextId   = 26;
let pbcEditId   = null;
let pbcDeleteId = null;
let pbcCurrentPage = 1;
const PBC_ITEMS_PER_PAGE = 10;

// ─── Render bảng ───────────────────────────────────────────────────
function pbcRender() {
  const q = (document.getElementById('pbcSearch').value || '').trim().toLowerCase();
  const filtered = pbcData.filter(r =>
    r.ten.toLowerCase().includes(q) ||
    r.vietTat.toLowerCase().includes(q) ||
    r.id.toString() === q
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / PBC_ITEMS_PER_PAGE) || 1;

  if (pbcCurrentPage > totalPages) pbcCurrentPage = totalPages;
  if (pbcCurrentPage < 1)         pbcCurrentPage = 1;

  const startIndex = (pbcCurrentPage - 1) * PBC_ITEMS_PER_PAGE;
  const pagedData  = filtered.slice(startIndex, startIndex + PBC_ITEMS_PER_PAGE);

  const tbody = document.getElementById('pbcTbody');
  const pill  = document.getElementById('pbcTotal');
  if (pill) pill.textContent = totalItems + ' phòng ban';

  if (pagedData.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="8">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    document.getElementById('pbcPagination').innerHTML = '';
    return;
  }

  tbody.innerHTML = pagedData.map(r => `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${r.id}</td>
      <td style="font-weight:600;color:#111827">${r.ten}</td>
      <td><span class="cat-chip-blue">${r.vietTat}</span></td>
      <td style="text-align:center">${r.hsCoBan.toFixed(2)}</td>
      <td style="text-align:center">${r.hsTrachNhiem.toFixed(2)}</td>
      <td style="text-align:center; white-space:nowrap;">${r.ngayHieuLuc}</td>
      <td style="color:#6B7280;font-size:13px">${r.moTa || '<span style="color:#D1D5DB">—</span>'}</td>
      <td style="text-align:center; white-space:nowrap;">
        <div class="cat-action-btns">
          <button class="cat-btn-edit" onclick="pbcOpenEdit(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Sửa
          </button>
          <button class="cat-btn-del" onclick="pbcOpenDelete(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Xóa
          </button>
        </div>
      </td>
    </tr>`).join('');

  pbcRenderPagination(totalPages);
}

// ─── Phân trang ────────────────────────────────────────────────────
function pbcRenderPagination(totalPages) {
  const container = document.getElementById('pbcPagination');
  let html = '';

  html += `<button onclick="pbcGoPage(${pbcCurrentPage - 1})" ${pbcCurrentPage === 1 ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${pbcCurrentPage === 1 ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Trước</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === pbcCurrentPage) {
      html += `<button style="padding:4px 10px;border:1px solid #0D9488;background:#0D9488;color:#fff;cursor:default;border-radius:4px;font-size:13px;font-weight:600;">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= pbcCurrentPage - 2 && i <= pbcCurrentPage + 2)) {
      html += `<button onclick="pbcGoPage(${i})" style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;transition:all 0.2s;">${i}</button>`;
    } else if (i === pbcCurrentPage - 3 || i === pbcCurrentPage + 3) {
      html += `<span style="padding:4px 5px;color:#6B7280;">...</span>`;
    }
  }

  html += `<button onclick="pbcGoPage(${pbcCurrentPage + 1})" ${pbcCurrentPage === totalPages ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${pbcCurrentPage === totalPages ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Sau</button>`;

  container.innerHTML = html;
}

function pbcGoPage(page) {
  pbcCurrentPage = page;
  pbcRender();
}

// ─── Modal Thêm ────────────────────────────────────────────────────
function pbcOpenAdd() {
  pbcEditId = null;
  document.getElementById('pbcModalTitle').textContent = 'Thêm phòng ban';
  document.getElementById('pbcTen').value          = '';
  document.getElementById('pbcVietTat').value      = '';
  document.getElementById('pbcNgayHieuLuc').value  = '';
  document.getElementById('pbcHSCoBan').value      = '0.00';
  document.getElementById('pbcHSTrachNhiem').value = '0.00';
  document.getElementById('pbcMoTa').value         = '';
  _pbcClearErrors();
  document.getElementById('pbcModal').classList.add('open');
  setTimeout(() => document.getElementById('pbcTen').focus(), 100);
}

// ─── Modal Sửa ────────────────────────────────────────────────────
function pbcOpenEdit(id) {
  const r = pbcData.find(x => x.id === id);
  if (!r) return;
  pbcEditId = id;
  document.getElementById('pbcModalTitle').textContent = 'Sửa phòng ban';
  document.getElementById('pbcTen').value          = r.ten;
  document.getElementById('pbcVietTat').value      = r.vietTat;
  document.getElementById('pbcNgayHieuLuc').value  = r.ngayHieuLuc;
  document.getElementById('pbcHSCoBan').value      = r.hsCoBan;
  document.getElementById('pbcHSTrachNhiem').value = r.hsTrachNhiem;
  document.getElementById('pbcMoTa').value         = r.moTa;
  _pbcClearErrors();
  document.getElementById('pbcModal').classList.add('open');
  setTimeout(() => document.getElementById('pbcTen').focus(), 100);
}

function pbcCloseModal() {
  document.getElementById('pbcModal').classList.remove('open');
}

function _pbcClearErrors() {
  ['errPbcTen', 'errPbcVietTat', 'errPbcNgayHieuLuc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

// ─── Lưu (thêm / sửa) ─────────────────────────────────────────────
function pbcSave() {
  const ten          = document.getElementById('pbcTen').value.trim();
  const vietTat      = document.getElementById('pbcVietTat').value.trim().toUpperCase();
  const ngayHieuLuc  = document.getElementById('pbcNgayHieuLuc').value;
  const hsCoBan      = parseFloat(document.getElementById('pbcHSCoBan').value) || 0;
  const hsTrachNhiem = parseFloat(document.getElementById('pbcHSTrachNhiem').value) || 0;
  const moTa         = document.getElementById('pbcMoTa').value.trim();

  let valid = true;
  const errTen         = document.getElementById('errPbcTen');
  const errVietTat     = document.getElementById('errPbcVietTat');
  const errNgayHieuLuc = document.getElementById('errPbcNgayHieuLuc');

  if (errTen)         errTen.style.display = 'none';
  if (errVietTat)     errVietTat.style.display = 'none';
  if (errNgayHieuLuc) errNgayHieuLuc.style.display = 'none';

  if (!ten)          { if (errTen)         { errTen.textContent = 'Vui lòng nhập tên phòng ban.';   errTen.style.display = 'block'; }         valid = false; }
  if (!vietTat)      { if (errVietTat)     { errVietTat.textContent = 'Vui lòng nhập tên viết tắt.'; errVietTat.style.display = 'block'; }   valid = false; }
  if (!ngayHieuLuc)  { if (errNgayHieuLuc){ errNgayHieuLuc.textContent = 'Vui lòng chọn ngày hiệu lực.'; errNgayHieuLuc.style.display = 'block'; } valid = false; }

  if (!valid) return;

  if (pbcEditId) {
    const r = pbcData.find(x => x.id === pbcEditId);
    if (r) {
      r.ten = ten; r.vietTat = vietTat; r.ngayHieuLuc = ngayHieuLuc;
      r.hsCoBan = hsCoBan; r.hsTrachNhiem = hsTrachNhiem; r.moTa = moTa;
    }
  } else {
    pbcData.unshift({ id: pbcNextId++, ten, vietTat, ngayHieuLuc, hsCoBan, hsTrachNhiem, moTa });
  }

  pbcCloseModal();
  pbcRender();
}

// ─── Xóa ──────────────────────────────────────────────────────────
function pbcOpenDelete(id) {
  pbcDeleteId = id;
  const r = pbcData.find(x => x.id === id);
  if (!r) return;
  document.getElementById('pbcDeleteMsg').textContent =
    `Bạn có chắc muốn xóa phòng ban "${r.ten}" (${r.vietTat}) không? Hành động này không thể hoàn tác.`;
  document.getElementById('pbcDeleteModal').classList.add('open');
}

function pbcCloseDelete() {
  document.getElementById('pbcDeleteModal').classList.remove('open');
}

function pbcConfirmDelete() {
  pbcData = pbcData.filter(x => x.id !== pbcDeleteId);
  const totalPages = Math.ceil(pbcData.length / PBC_ITEMS_PER_PAGE) || 1;
  if (pbcCurrentPage > totalPages) pbcCurrentPage = totalPages;
  pbcCloseDelete();
  pbcRender();
}

// ─── Close on backdrop ────────────────────────────────────────────
document.getElementById('pbcModal').addEventListener('click', function (e) { if (e.target === this) pbcCloseModal(); });
document.getElementById('pbcDeleteModal').addEventListener('click', function (e) { if (e.target === this) pbcCloseDelete(); });

// ─── Khởi tạo ────────────────────────────────────────────────────
pbcRender();

(function() {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'phong-ban') pbcRender();
  };
})();
