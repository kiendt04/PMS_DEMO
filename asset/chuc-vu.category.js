// ══════════ CHỨC VỤ ══════════
let cvData = [
  { id: 1, ten: 'Giám đốc', vietTat: 'GĐ', hsCoBan: 5.0, hsTrachNhiem: 2.0, hsChucVu: 1.5, ngayHieuLuc: '2024-01-01', moTa: 'Điều hành chung' },
  { id: 2, ten: 'Phó giám đốc', vietTat: 'PGĐ', hsCoBan: 4.5, hsTrachNhiem: 1.5, hsChucVu: 1.2, ngayHieuLuc: '2024-01-01', moTa: 'Phụ trách chuyên môn' },
  { id: 3, ten: 'Trưởng phòng', vietTat: 'TP', hsCoBan: 3.5, hsTrachNhiem: 1.0, hsChucVu: 0.8, ngayHieuLuc: '2024-01-01', moTa: 'Quản lý phòng ban' },
  { id: 4, ten: 'Phó phòng', vietTat: 'PP', hsCoBan: 3.0, hsTrachNhiem: 0.8, hsChucVu: 0.5, ngayHieuLuc: '2024-01-01', moTa: 'Hỗ trợ trưởng phòng' },
  { id: 5, ten: 'Nhân viên', vietTat: 'NV', hsCoBan: 2.34, hsTrachNhiem: 0.0, hsChucVu: 0.0, ngayHieuLuc: '2024-01-01', moTa: 'Thực hiện công việc' }
];

// Dữ liệu mẫu thêm để xem phân trang
for (let i = 6; i <= 25; i++) {
  cvData.push({ id: i, ten: `Chức vụ ${i}`, vietTat: `CV${i}`, hsCoBan: 2.0, hsTrachNhiem: 0.0, hsChucVu: 0.0, ngayHieuLuc: '2024-01-01', moTa: 'Mô tả...' });
}

let cvNextId = 26;
let cvEditId = null;
let cvDeleteId = null;
let cvCurrentPage = 1;
const CV_ITEMS_PER_PAGE = 10;

function cvRender() {
  const q = (document.getElementById('cvSearch').value || '').trim().toLowerCase();
  const filtered = cvData.filter(r =>
    r.ten.toLowerCase().includes(q) || r.vietTat.toLowerCase().includes(q) || r.id.toString() === q
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / CV_ITEMS_PER_PAGE) || 1;
  
  if (cvCurrentPage > totalPages) cvCurrentPage = totalPages;
  if (cvCurrentPage < 1) cvCurrentPage = 1;

  const startIndex = (cvCurrentPage - 1) * CV_ITEMS_PER_PAGE;
  const pagedData = filtered.slice(startIndex, startIndex + CV_ITEMS_PER_PAGE);

  const tbody = document.getElementById('cvTbody');
  const pill = document.getElementById('cvTotal');
  if (pill) pill.textContent = totalItems + ' chức vụ';

  if (pagedData.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="9">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    document.getElementById('cvPagination').innerHTML = '';
    return;
  }

  tbody.innerHTML = pagedData.map((r, i) => `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${r.id}</td>
      <td style="font-weight:600;color:#111827">${r.ten}</td>
      <td><span class="cat-chip-blue">${r.vietTat}</span></td>
      <td style="text-align:center">${r.hsCoBan.toFixed(2)}</td>
      <td style="text-align:center">${r.hsTrachNhiem.toFixed(2)}</td>
      <td style="text-align:center">${r.hsChucVu.toFixed(2)}</td>
      <td style="text-align:center; white-space:nowrap;">${r.ngayHieuLuc}</td>
      <td style="color:#6B7280;font-size:13px">${r.moTa || '<span style="color:#D1D5DB">—</span>'}</td>
      <td style="text-align:center; white-space:nowrap;">
        <div class="cat-action-btns">
          <button class="cat-btn-edit" onclick="cvOpenEdit(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Sửa
          </button>
          <button class="cat-btn-del" onclick="cvOpenDelete(${r.id})">
            <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Xóa
          </button>
        </div>
      </td>
    </tr>`).join('');

  cvRenderPagination(totalPages);
}

function cvRenderPagination(totalPages) {
  const container = document.getElementById('cvPagination');
  let html = '';
  
  html += `<button onclick="cvGoPage(${cvCurrentPage - 1})" ${cvCurrentPage === 1 ? 'disabled' : ''} style="padding:4px 10px; border:1px solid #E5E7EB; background:#fff; color:#374151; cursor:pointer; border-radius:4px; font-size:13px; font-weight:500; ${cvCurrentPage === 1 ? 'opacity:0.5; cursor:not-allowed;' : ''} transition:all 0.2s;">Trước</button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === cvCurrentPage) {
      html += `<button style="padding:4px 10px; border:1px solid #185FA5; background:#185FA5; color:#fff; cursor:default; border-radius:4px; font-size:13px; font-weight:600;">${i}</button>`;
    } else {
      if (i === 1 || i === totalPages || (i >= cvCurrentPage - 2 && i <= cvCurrentPage + 2)) {
        html += `<button onclick="cvGoPage(${i})" style="padding:4px 10px; border:1px solid #E5E7EB; background:#fff; color:#374151; cursor:pointer; border-radius:4px; font-size:13px; font-weight:500; transition:all 0.2s;">${i}</button>`;
      } else if (i === cvCurrentPage - 3 || i === cvCurrentPage + 3) {
        html += `<span style="padding:4px 5px; color:#6B7280;">...</span>`;
      }
    }
  }

  html += `<button onclick="cvGoPage(${cvCurrentPage + 1})" ${cvCurrentPage === totalPages ? 'disabled' : ''} style="padding:4px 10px; border:1px solid #E5E7EB; background:#fff; color:#374151; cursor:pointer; border-radius:4px; font-size:13px; font-weight:500; ${cvCurrentPage === totalPages ? 'opacity:0.5; cursor:not-allowed;' : ''} transition:all 0.2s;">Sau</button>`;

  container.innerHTML = html;
}

function cvGoPage(page) {
  cvCurrentPage = page;
  cvRender();
}

function cvOpenAdd() {
  cvEditId = null;
  document.getElementById('cvModalTitle').textContent = 'Thêm chức vụ';
  document.getElementById('cvTen').value = '';
  document.getElementById('cvVietTat').value = '';
  document.getElementById('cvNgayHieuLuc').value = '';
  document.getElementById('cvHSCoban').value = '0.00';
  document.getElementById('cvHSTrachNhiem').value = '0.00';
  document.getElementById('cvHSChucVu').value = '0.00';
  document.getElementById('cvMoTa').value = '';
  ['errCvTen','errCvVietTat','errCvNgayHieuLuc'].forEach(id => {
    const el = document.getElementById(id);
    if(el) { el.style.display = 'none'; el.textContent = ''; }
  });
  document.getElementById('cvModal').classList.add('open');
  setTimeout(() => document.getElementById('cvTen').focus(), 100);
}

function cvOpenEdit(id) {
  const r = cvData.find(x => x.id === id);
  if (!r) return;
  cvEditId = id;
  document.getElementById('cvModalTitle').textContent = 'Sửa chức vụ';
  document.getElementById('cvTen').value = r.ten;
  document.getElementById('cvVietTat').value = r.vietTat;
  document.getElementById('cvNgayHieuLuc').value = r.ngayHieuLuc;
  document.getElementById('cvHSCoban').value = r.hsCoBan;
  document.getElementById('cvHSTrachNhiem').value = r.hsTrachNhiem;
  document.getElementById('cvHSChucVu').value = r.hsChucVu;
  document.getElementById('cvMoTa').value = r.moTa;
  ['errCvTen','errCvVietTat','errCvNgayHieuLuc'].forEach(id => {
    const el = document.getElementById(id);
    if(el) { el.style.display = 'none'; el.textContent = ''; }
  });
  document.getElementById('cvModal').classList.add('open');
  setTimeout(() => document.getElementById('cvTen').focus(), 100);
}

function cvCloseModal() {
  document.getElementById('cvModal').classList.remove('open');
}

function cvSave() {
  const ten = document.getElementById('cvTen').value.trim();
  const vietTat = document.getElementById('cvVietTat').value.trim().toUpperCase();
  const ngayHieuLuc = document.getElementById('cvNgayHieuLuc').value;
  const hsCoBan = parseFloat(document.getElementById('cvHSCoban').value) || 0;
  const hsTrachNhiem = parseFloat(document.getElementById('cvHSTrachNhiem').value) || 0;
  const hsChucVu = parseFloat(document.getElementById('cvHSChucVu').value) || 0;
  const moTa = document.getElementById('cvMoTa').value.trim();
  
  let valid = true;
  const errTen = document.getElementById('errCvTen');
  const errVietTat = document.getElementById('errCvVietTat');
  const errNgayHieuLuc = document.getElementById('errCvNgayHieuLuc');
  
  if(errTen) errTen.style.display = 'none';
  if(errVietTat) errVietTat.style.display = 'none';
  if(errNgayHieuLuc) errNgayHieuLuc.style.display = 'none';

  if (!ten) { if(errTen) {errTen.textContent = 'Vui lòng nhập tên chức vụ.'; errTen.style.display = 'block';} valid = false; }
  if (!vietTat) { if(errVietTat) {errVietTat.textContent = 'Vui lòng nhập tên viết tắt.'; errVietTat.style.display = 'block';} valid = false; }
  if (!ngayHieuLuc) { if(errNgayHieuLuc) {errNgayHieuLuc.textContent = 'Vui lòng chọn ngày hiệu lực.'; errNgayHieuLuc.style.display = 'block';} valid = false; }

  if (!valid) return;

  if (cvEditId) {
    const r = cvData.find(x => x.id === cvEditId);
    if(r) {
      r.ten = ten; r.vietTat = vietTat; r.ngayHieuLuc = ngayHieuLuc;
      r.hsCoBan = hsCoBan; r.hsTrachNhiem = hsTrachNhiem; r.hsChucVu = hsChucVu; r.moTa = moTa;
    }
  } else {
    cvData.unshift({ 
      id: cvNextId++, 
      ten, 
      vietTat, 
      ngayHieuLuc, 
      hsCoBan, 
      hsTrachNhiem, 
      hsChucVu, 
      moTa 
    });
  }
  cvCloseModal();
  cvRender();
}

function cvOpenDelete(id) {
  cvDeleteId = id;
  const r = cvData.find(x => x.id === id);
  if (!r) return;
  document.getElementById('cvDeleteMsg').textContent =
    `Bạn có chắc muốn xóa chức vụ "${r.ten}" (${r.vietTat}) không? Hành động này không thể hoàn tác.`;
  document.getElementById('cvDeleteModal').classList.add('open');
}

function cvCloseDelete() {
  document.getElementById('cvDeleteModal').classList.remove('open');
}

function cvConfirmDelete() {
  cvData = cvData.filter(x => x.id !== cvDeleteId);
  // adjust pagination if necessary
  const totalItems = cvData.length;
  const totalPages = Math.ceil(totalItems / CV_ITEMS_PER_PAGE) || 1;
  if (cvCurrentPage > totalPages) cvCurrentPage = totalPages;
  
  cvCloseDelete();
  cvRender();
}

document.getElementById('cvModal').addEventListener('click', function(e) { if (e.target === this) cvCloseModal(); });
document.getElementById('cvDeleteModal').addEventListener('click', function(e) { if (e.target === this) cvCloseDelete(); });

// Initialize when script loaded
cvRender();

(function() {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'dm-chuc-vu') cvRender();
  };
})();
