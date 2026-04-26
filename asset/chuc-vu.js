/**
 * chuc-vu.js — Danh muc chuc vu CRUD
 */
(function () {
  'use strict';

  /* ── Sample data ── */
  let CV_DATA = [
    { id:1,  ten:'Giám đốc',              vietTat:'GĐ',    hsCoBan:5.00, hsTrachNhiem:1.30, hsChucVu:6.50, ngayHL:'2020-01-01', moTa:'Lãnh đạo cao nhất của tổ chức' },
    { id:2,  ten:'Phó Giám đốc',          vietTat:'PGĐ',   hsCoBan:4.50, hsTrachNhiem:1.20, hsChucVu:5.70, ngayHL:'2020-01-01', moTa:'Hỗ trợ Giám đốc điều hành' },
    { id:3,  ten:'Kế toán trưởng',        vietTat:'KTT',   hsCoBan:4.20, hsTrachNhiem:1.00, hsChucVu:5.20, ngayHL:'2020-01-01', moTa:'Phụ trách tài chính kế toán' },
    { id:4,  ten:'Trưởng phòng',          vietTat:'TP',    hsCoBan:3.80, hsTrachNhiem:0.90, hsChucVu:4.70, ngayHL:'2020-01-01', moTa:'Quản lý phòng ban' },
    { id:5,  ten:'Phó trưởng phòng',      vietTat:'PTP',   hsCoBan:3.50, hsTrachNhiem:0.70, hsChucVu:4.20, ngayHL:'2020-01-01', moTa:'' },
    { id:6,  ten:'Tổ trưởng',             vietTat:'TT',    hsCoBan:3.20, hsTrachNhiem:0.50, hsChucVu:3.70, ngayHL:'2020-01-01', moTa:'Quản lý tổ sản xuất/vận hành' },
    { id:7,  ten:'Chuyên viên cao cấp',   vietTat:'CVCC',  hsCoBan:3.00, hsTrachNhiem:0.40, hsChucVu:3.40, ngayHL:'2020-01-01', moTa:'' },
    { id:8,  ten:'Chuyên viên chính',     vietTat:'CVC',   hsCoBan:2.70, hsTrachNhiem:0.25, hsChucVu:2.95, ngayHL:'2020-01-01', moTa:'' },
    { id:9,  ten:'Chuyên viên',           vietTat:'CV',    hsCoBan:2.40, hsTrachNhiem:0.15, hsChucVu:2.55, ngayHL:'2020-01-01', moTa:'' },
    { id:10, ten:'Nhân viên kỹ thuật',    vietTat:'NVKT',  hsCoBan:2.20, hsTrachNhiem:0.10, hsChucVu:2.30, ngayHL:'2020-01-01', moTa:'Nhân viên kỹ thuật vận hành' },
    { id:11, ten:'Nhân viên',             vietTat:'NV',    hsCoBan:1.80, hsTrachNhiem:0.00, hsChucVu:1.80, ngayHL:'2020-01-01', moTa:'' },
    { id:12, ten:'Cán sự',                vietTat:'CS',    hsCoBan:2.00, hsTrachNhiem:0.05, hsChucVu:2.05, ngayHL:'2020-01-01', moTa:'' },
    { id:13, ten:'Thư ký',                vietTat:'TK',    hsCoBan:2.10, hsTrachNhiem:0.10, hsChucVu:2.20, ngayHL:'2020-06-01', moTa:'Thư ký văn phòng' },
    { id:14, ten:'Kỹ sư',                 vietTat:'KS',    hsCoBan:2.50, hsTrachNhiem:0.15, hsChucVu:2.65, ngayHL:'2021-01-01', moTa:'Kỹ sư thiết kế / vận hành' },
    { id:15, ten:'Kỹ sư cao cấp',         vietTat:'KSCC',  hsCoBan:2.90, hsTrachNhiem:0.30, hsChucVu:3.20, ngayHL:'2021-01-01', moTa:'' },
  ];

  let nextId   = 16;
  let editingId = null;
  let deletingId = null;
  const PAGE_SIZE = 10;
  let currentPage = 1;

  /* ── Helper ── */
  function fmtHS(v) { return Number(v).toFixed(2); }
  function fmtDate(s) {
    if (!s) return '—';
    const [y,m,d] = s.split('-');
    return `${d}/${m}/${y}`;
  }

  /* ── Filter ── */
  function getFiltered() {
    const q = (document.getElementById('cvSearch')?.value || '').toLowerCase();
    return CV_DATA.filter(r =>
      r.ten.toLowerCase().includes(q) ||
      r.vietTat.toLowerCase().includes(q)
    );
  }

  /* ── Render ── */
  window.cvRender = function () {
    const filtered = getFiltered();
    const total    = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const pill = document.getElementById('cvTotal');
    if (pill) pill.textContent = `${total} chức vụ`;

    const tbody = document.getElementById('cvTbody');
    if (!tbody) return;

    const slice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    tbody.innerHTML = slice.map(r => `
      <tr>
        <td style="text-align:center;color:#64748B;font-size:11px">${r.id}</td>
        <td style="font-weight:600;color:#1E293B">${r.ten}</td>
        <td><span class="cat-badge cat-badge-blue">${r.vietTat}</span></td>
        <td style="text-align:right;font-variant-numeric:tabular-nums">${fmtHS(r.hsCoBan)}</td>
        <td style="text-align:right;font-variant-numeric:tabular-nums">${fmtHS(r.hsTrachNhiem)}</td>
        <td style="text-align:right;font-weight:700;color:#185FA5;font-variant-numeric:tabular-nums">${fmtHS(r.hsChucVu)}</td>
        <td style="color:#64748B;font-size:12px">${fmtDate(r.ngayHL)}</td>
        <td style="color:#64748B;font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.moTa || '—'}</td>
        <td style="text-align:center">
          <div class="cat-action-btns">
            <button class="cat-btn-edit"   onclick="cvOpenEdit(${r.id})">Sửa</button>
            <button class="cat-btn-delete" onclick="cvOpenDelete(${r.id})">Xóa</button>
          </div>
        </td>
      </tr>`).join('');

    renderCvPagination(totalPages);
  };

  /* ── Pagination ── */
  function renderCvPagination(totalPages) {
    const pg = document.getElementById('cvPagination');
    if (!pg) return;
    if (totalPages <= 1) { pg.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="cat-pg-btn ${i === currentPage ? 'active' : ''}" onclick="cvGoPage(${i})">${i}</button>`;
    }
    pg.innerHTML = html;
  }

  window.cvGoPage = function (p) { currentPage = p; cvRender(); };

  /* ── Open Add ── */
  window.cvOpenAdd = function () {
    editingId = null;
    document.getElementById('cvModalTitle').textContent = 'Thêm chức vụ';
    ['cvTen','cvVietTat','cvMoTa'].forEach(id => document.getElementById(id).value = '');
    ['cvHSCoban','cvHSTrachNhiem','cvHSChucVu'].forEach(id => document.getElementById(id).value = '0.00');
    document.getElementById('cvNgayHieuLuc').value = new Date().toISOString().slice(0,10);
    ['errCvTen','errCvVietTat','errCvNgayHieuLuc'].forEach(id => document.getElementById(id).textContent = '');
    document.getElementById('cvModal').classList.add('active');
  };

  /* ── Open Edit ── */
  window.cvOpenEdit = function (id) {
    const r = CV_DATA.find(x => x.id === id);
    if (!r) return;
    editingId = id;
    document.getElementById('cvModalTitle').textContent = 'Sửa chức vụ';
    document.getElementById('cvTen').value           = r.ten;
    document.getElementById('cvVietTat').value       = r.vietTat;
    document.getElementById('cvHSCoban').value       = r.hsCoBan;
    document.getElementById('cvHSTrachNhiem').value  = r.hsTrachNhiem;
    document.getElementById('cvHSChucVu').value      = r.hsChucVu;
    document.getElementById('cvNgayHieuLuc').value   = r.ngayHL;
    document.getElementById('cvMoTa').value          = r.moTa;
    ['errCvTen','errCvVietTat','errCvNgayHieuLuc'].forEach(id => document.getElementById(id).textContent = '');
    document.getElementById('cvModal').classList.add('active');
  };

  window.cvCloseModal = function () {
    document.getElementById('cvModal').classList.remove('active');
  };

  /* ── Save ── */
  window.cvSave = function () {
    const ten  = document.getElementById('cvTen').value.trim();
    const vt   = document.getElementById('cvVietTat').value.trim();
    const ngay = document.getElementById('cvNgayHieuLuc').value;
    let ok = true;
    if (!ten)  { document.getElementById('errCvTen').textContent      = 'Vui lòng nhập tên chức vụ'; ok = false; }
    if (!vt)   { document.getElementById('errCvVietTat').textContent  = 'Vui lòng nhập tên viết tắt'; ok = false; }
    if (!ngay) { document.getElementById('errCvNgayHieuLuc').textContent = 'Vui lòng chọn ngày hiệu lực'; ok = false; }
    if (!ok) return;

    const rec = {
      ten, vietTat: vt,
      hsCoBan:       parseFloat(document.getElementById('cvHSCoban').value)      || 0,
      hsTrachNhiem:  parseFloat(document.getElementById('cvHSTrachNhiem').value) || 0,
      hsChucVu:      parseFloat(document.getElementById('cvHSChucVu').value)     || 0,
      ngayHL: ngay,
      moTa:   document.getElementById('cvMoTa').value.trim(),
    };

    if (editingId) {
      const idx = CV_DATA.findIndex(x => x.id === editingId);
      if (idx >= 0) CV_DATA[idx] = { ...CV_DATA[idx], ...rec };
    } else {
      CV_DATA.push({ id: nextId++, ...rec });
    }
    cvCloseModal();
    cvRender();
  };

  /* ── Delete ── */
  window.cvOpenDelete = function (id) {
    deletingId = id;
    const r = CV_DATA.find(x => x.id === id);
    document.getElementById('cvDeleteMsg').textContent = `Bạn có chắc muốn xóa chức vụ "${r?.ten}"?`;
    document.getElementById('cvDeleteModal').classList.add('active');
  };
  window.cvCloseDelete   = function () { document.getElementById('cvDeleteModal').classList.remove('active'); };
  window.cvConfirmDelete = function () {
    CV_DATA = CV_DATA.filter(x => x.id !== deletingId);
    cvCloseDelete();
    cvRender();
  };

  /* ── Init on page activate ── */
  const _origCv = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _origCv === 'function') _origCv(page);
    if (page === 'dm-chuc-vu') cvRender();
  };

  // Also init if page is already active on load
  setTimeout(() => {
    if (document.getElementById('cvTbody')) cvRender();
  }, 300);

})();
