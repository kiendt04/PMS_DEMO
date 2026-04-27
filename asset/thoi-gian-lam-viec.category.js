// ══════════ DANH MỤC THỜI GIAN LÀM VIỆC ══════════
const TLV_THANG_NAMES = [
  '', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

// Dữ liệu mẫu cho năm 2023, 2024, 2025
let tlvData = [
  // ── 2023 ──
  { id: 1, thang: 1, nam: 2023, soNgayLamViec: 21, soNgayLe: 0 },
  { id: 2, thang: 2, nam: 2023, soNgayLamViec: 20, soNgayLe: 0 },
  { id: 3, thang: 3, nam: 2023, soNgayLamViec: 23, soNgayLe: 0 },
  { id: 4, thang: 4, nam: 2023, soNgayLamViec: 18, soNgayLe: 2 }, // Giỗ Tổ + 30/4
  { id: 5, thang: 5, nam: 2023, soNgayLamViec: 22, soNgayLe: 1 }, // 01/5
  { id: 6, thang: 6, nam: 2023, soNgayLamViec: 22, soNgayLe: 0 },
  { id: 7, thang: 7, nam: 2023, soNgayLamViec: 21, soNgayLe: 0 },
  { id: 8, thang: 8, nam: 2023, soNgayLamViec: 23, soNgayLe: 0 },
  { id: 9, thang: 9, nam: 2023, soNgayLamViec: 20, soNgayLe: 2 }, // 02/9
  { id: 10, thang: 10, nam: 2023, soNgayLamViec: 22, soNgayLe: 0 },
  { id: 11, thang: 11, nam: 2023, soNgayLamViec: 22, soNgayLe: 0 },
  { id: 12, thang: 12, nam: 2023, soNgayLamViec: 21, soNgayLe: 0 },
  // ── 2024 ──
  { id: 13, thang: 1, nam: 2024, soNgayLamViec: 19, soNgayLe: 1 }, // Tết Dương lịch
  { id: 14, thang: 2, nam: 2024, soNgayLamViec: 15, soNgayLe: 5 }, // Tết Nguyên Đán
  { id: 15, thang: 3, nam: 2024, soNgayLamViec: 21, soNgayLe: 0 },
  { id: 16, thang: 4, nam: 2024, soNgayLamViec: 19, soNgayLe: 2 }, // Giỗ Tổ + 30/4
  { id: 17, thang: 5, nam: 2024, soNgayLamViec: 22, soNgayLe: 1 }, // 01/5
  { id: 18, thang: 6, nam: 2024, soNgayLamViec: 20, soNgayLe: 0 },
  { id: 19, thang: 7, nam: 2024, soNgayLamViec: 23, soNgayLe: 0 },
  { id: 20, thang: 8, nam: 2024, soNgayLamViec: 22, soNgayLe: 0 },
  { id: 21, thang: 9, nam: 2024, soNgayLamViec: 19, soNgayLe: 2 }, // 02/9
  { id: 22, thang: 10, nam: 2024, soNgayLamViec: 23, soNgayLe: 0 },
  { id: 23, thang: 11, nam: 2024, soNgayLamViec: 21, soNgayLe: 0 },
  { id: 24, thang: 12, nam: 2024, soNgayLamViec: 22, soNgayLe: 0 },
  // ── 2025 ──
  { id: 25, thang: 1, nam: 2025, soNgayLamViec: 20, soNgayLe: 1 }, // Tết Dương lịch
  { id: 26, thang: 2, nam: 2025, soNgayLamViec: 14, soNgayLe: 5 }, // Tết Nguyên Đán
  { id: 27, thang: 3, nam: 2025, soNgayLamViec: 21, soNgayLe: 0 },
  { id: 28, thang: 4, nam: 2025, soNgayLamViec: 20, soNgayLe: 2 }, // Giỗ Tổ + 30/4
  { id: 29, thang: 5, nam: 2025, soNgayLamViec: 21, soNgayLe: 1 }, // 01/5
  { id: 30, thang: 6, nam: 2025, soNgayLamViec: 21, soNgayLe: 0 },
  { id: 31, thang: 7, nam: 2025, soNgayLamViec: 23, soNgayLe: 0 },
  { id: 32, thang: 8, nam: 2025, soNgayLamViec: 21, soNgayLe: 0 },
  { id: 33, thang: 9, nam: 2025, soNgayLamViec: 20, soNgayLe: 2 }, // 02/9
  { id: 34, thang: 10, nam: 2025, soNgayLamViec: 23, soNgayLe: 0 },
  { id: 35, thang: 11, nam: 2025, soNgayLamViec: 20, soNgayLe: 0 },
  { id: 36, thang: 12, nam: 2025, soNgayLamViec: 22, soNgayLe: 0 },
];

let tlvNextId = 37;
let tlvEditId = null;
let tlvDeleteId = null;
let tlvCurrentPage = 1;
const TLV_ITEMS_PER_PAGE = 10;

// ─── Khởi tạo dropdown năm ──────────────────────────────────────────
function tlvInitYearFilter() {
  const sel = document.getElementById('tlvFilterNam');
  if (!sel) return;
  const years = [...new Set(tlvData.map(r => r.nam))].sort((a, b) => b - a);
  sel.innerHTML = '<option value="">Tất cả năm</option>';
  years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = 'Năm ' + y;
    sel.appendChild(opt);
  });
}

// ─── Render bảng ─────────────────────────────────────────────────────
function tlvRender() {
  const q = (document.getElementById('tlvSearch').value || '').trim().toLowerCase();
  const namSel = (document.getElementById('tlvFilterNam').value || '').trim();

  const filtered = tlvData.filter(r => {
    const matchNam = namSel ? r.nam === parseInt(namSel) : true;
    const matchQ = q
      ? TLV_THANG_NAMES[r.thang].toLowerCase().includes(q) ||
      r.nam.toString().includes(q) ||
      r.id.toString() === q
      : true;
    return matchNam && matchQ;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / TLV_ITEMS_PER_PAGE) || 1;

  if (tlvCurrentPage > totalPages) tlvCurrentPage = totalPages;
  if (tlvCurrentPage < 1) tlvCurrentPage = 1;

  const startIndex = (tlvCurrentPage - 1) * TLV_ITEMS_PER_PAGE;
  const pagedData = filtered.slice(startIndex, startIndex + TLV_ITEMS_PER_PAGE);

  const tbody = document.getElementById('tlvTbody');
  const pill = document.getElementById('tlvTotal');
  if (pill) pill.textContent = totalItems + ' bản ghi';

  if (pagedData.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="6">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    document.getElementById('tlvPagination').innerHTML = '';
    return;
  }

  tbody.innerHTML = pagedData.map(r => `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${r.id}</td>
      <td style="font-weight:600;color:#111827">${TLV_THANG_NAMES[r.thang]}</td>
      <td>
        <span style="display:inline-block;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:600;background:#EFF6FF;color:#1D4ED8;">${r.nam}</span>
      </td>
      <td style="text-align:center;">
        <span style="display:inline-flex;align-items:center;gap:5px;font-weight:700;color:#059669;font-size:14px;">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M6.5 4v3l2 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          ${r.soNgayLamViec} ngày
        </span>
      </td>
      <td style="text-align:center;white-space:nowrap;">
        <div class="cat-action-btns">
          <button class="cat-btn-edit" onclick="tlvOpenEdit(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Sửa
          </button>
          <button class="cat-btn-del" onclick="tlvOpenDelete(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Xóa
          </button>
        </div>
      </td>
    </tr>`).join('');

  tlvRenderPagination(totalPages);
}

// ─── Phân trang ──────────────────────────────────────────────────────
function tlvRenderPagination(totalPages) {
  const container = document.getElementById('tlvPagination');
  let html = '';

  html += `<button onclick="tlvGoPage(${tlvCurrentPage - 1})" ${tlvCurrentPage === 1 ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${tlvCurrentPage === 1 ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Trước</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === tlvCurrentPage) {
      html += `<button style="padding:4px 10px;border:1px solid #185FA5;background:#185FA5;color:#fff;cursor:default;border-radius:4px;font-size:13px;font-weight:600;">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= tlvCurrentPage - 2 && i <= tlvCurrentPage + 2)) {
      html += `<button onclick="tlvGoPage(${i})" style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;transition:all 0.2s;">${i}</button>`;
    } else if (i === tlvCurrentPage - 3 || i === tlvCurrentPage + 3) {
      html += `<span style="padding:4px 5px;color:#6B7280;">...</span>`;
    }
  }

  html += `<button onclick="tlvGoPage(${tlvCurrentPage + 1})" ${tlvCurrentPage === totalPages ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${tlvCurrentPage === totalPages ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Sau</button>`;

  container.innerHTML = html;
}

function tlvGoPage(page) {
  tlvCurrentPage = page;
  tlvRender();
}

// ─── Xóa lỗi form ────────────────────────────────────────────────────
function _tlvClearErrors() {
  ['errTlvThang', 'errTlvNam', 'errTlvNgayLV'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

// ─── Populate month options trong modal ───────────────────────────────
function _tlvPopulateThangOptions(selectedVal) {
  const sel = document.getElementById('tlvThang');
  sel.innerHTML = '<option value="">-- Chọn tháng --</option>';
  for (let i = 1; i <= 12; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = TLV_THANG_NAMES[i];
    if (selectedVal === i) opt.selected = true;
    sel.appendChild(opt);
  }
}

// ─── Modal Thêm ──────────────────────────────────────────────────────
function tlvOpenAdd() {
  tlvEditId = null;
  document.getElementById('tlvModalTitle').textContent = 'Thêm thời gian làm việc';
  _tlvPopulateThangOptions(null);
  document.getElementById('tlvNam').value = new Date().getFullYear();
  document.getElementById('tlvNgayLV').value = '';
  _tlvClearErrors();
  document.getElementById('tlvModal').classList.add('open');
  setTimeout(() => document.getElementById('tlvThang').focus(), 100);
}

// ─── Modal Sửa ───────────────────────────────────────────────────────
function tlvOpenEdit(id) {
  const r = tlvData.find(x => x.id === id);
  if (!r) return;
  tlvEditId = id;
  document.getElementById('tlvModalTitle').textContent = 'Sửa thời gian làm việc';
  _tlvPopulateThangOptions(r.thang);
  document.getElementById('tlvNam').value = r.nam;
  document.getElementById('tlvNgayLV').value = r.soNgayLamViec;
  _tlvClearErrors();
  document.getElementById('tlvModal').classList.add('open');
}

function tlvCloseModal() {
  document.getElementById('tlvModal').classList.remove('open');
}

// ─── Lưu (thêm / sửa) ───────────────────────────────────────────────
function tlvSave() {
  const thang = parseInt(document.getElementById('tlvThang').value) || 0;
  const nam = parseInt(document.getElementById('tlvNam').value) || 0;
  const soNgayLV = parseInt(document.getElementById('tlvNgayLV').value) || 0;

  let valid = true;
  const errThang = document.getElementById('errTlvThang');
  const errNam = document.getElementById('errTlvNam');
  const errNgayLV = document.getElementById('errTlvNgayLV');

  if (errThang) errThang.style.display = 'none';
  if (errNam) errNam.style.display = 'none';
  if (errNgayLV) errNgayLV.style.display = 'none';

  if (!thang || thang < 1 || thang > 12) {
    if (errThang) { errThang.textContent = 'Vui lòng chọn tháng.'; errThang.style.display = 'block'; }
    valid = false;
  }
  if (!nam || nam < 2000 || nam > 2099) {
    if (errNam) { errNam.textContent = 'Vui lòng nhập năm hợp lệ (2000–2099).'; errNam.style.display = 'block'; }
    valid = false;
  }
  if (!soNgayLV || soNgayLV <= 0 || soNgayLV > 31) {
    if (errNgayLV) { errNgayLV.textContent = 'Số ngày làm việc phải từ 1 đến 31.'; errNgayLV.style.display = 'block'; }
    valid = false;
  }

  if (!valid) return;

  if (tlvEditId) {
    const r = tlvData.find(x => x.id === tlvEditId);
    if (r) { r.thang = thang; r.nam = nam; r.soNgayLamViec = soNgayLV; }
  } else {
    tlvData.unshift({ id: tlvNextId++, thang, nam, soNgayLamViec: soNgayLV });
  }

  // Cập nhật lại dropdown năm nếu có năm mới
  tlvInitYearFilter();
  tlvCloseModal();
  tlvCurrentPage = 1;
  tlvRender();
}

// ─── Xóa ────────────────────────────────────────────────────────────
function tlvOpenDelete(id) {
  tlvDeleteId = id;
  const r = tlvData.find(x => x.id === id);
  if (!r) return;
  document.getElementById('tlvDeleteMsg').textContent =
    `Bạn có chắc muốn xóa bản ghi "${TLV_THANG_NAMES[r.thang]} năm ${r.nam}" không? Hành động này không thể hoàn tác.`;
  document.getElementById('tlvDeleteModal').classList.add('open');
}

function tlvCloseDelete() {
  document.getElementById('tlvDeleteModal').classList.remove('open');
}

function tlvConfirmDelete() {
  tlvData = tlvData.filter(x => x.id !== tlvDeleteId);
  const totalPages = Math.ceil(tlvData.length / TLV_ITEMS_PER_PAGE) || 1;
  if (tlvCurrentPage > totalPages) tlvCurrentPage = totalPages;
  tlvCloseDelete();
  tlvRender();
}

// ─── Close on backdrop ───────────────────────────────────────────────
document.getElementById('tlvModal').addEventListener('click', function (e) { if (e.target === this) tlvCloseModal(); });
document.getElementById('tlvDeleteModal').addEventListener('click', function (e) { if (e.target === this) tlvCloseDelete(); });

// ─── Khởi tạo ───────────────────────────────────────────────────────
tlvInitYearFilter();
tlvRender();

(function() {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'dm-thoi-gian-lv') tlvRender();
  };
})();
