// ══════════ DANH MỤC PHÂN NGUỒN ══════════

// ─── Dữ liệu mẫu Bảng 1: Nguồn chính theo năm ───
let pnMainData = [
  { id: 1, nam: 2024, tongNganSach: 5000000000, nsNhanVien: 3500000000, nsQuanLy: 1500000000, nguoiTao: 'Admin', ngayTao: '2024-01-01' },
  { id: 2, nam: 2025, tongNganSach: 5500000000, nsNhanVien: 3800000000, nsQuanLy: 1700000000, nguoiTao: 'Admin', ngayTao: '2024-12-15' },
];

// ─── Dữ liệu mẫu Bảng 2: Phân nguồn theo tháng ───
let pnMonthData = [
  { id: 1, nam: 2024, quy: 1, thang: 1, nld: 280000000, nql: 120000000, tong: 400000000, ghiChu: 'Phân nguồn tháng 1' },
  { id: 2, nam: 2024, quy: 1, thang: 2, nld: 290000000, nql: 125000000, tong: 415000000, ghiChu: 'Phân nguồn tháng 2' },
  { id: 3, nam: 2024, quy: 1, thang: 3, nld: 285000000, nql: 122000000, tong: 407000000, ghiChu: 'Phân nguồn tháng 3' },
];

let pnMainNextId = 3;
let pnMonthNextId = 4;
let pnMainEditId = null;
let pnMonthEditId = null;
let pnMainDeleteId = null;
let pnMonthDeleteId = null;

// ─── RENDER BẢNG 1: NGUỒN CHÍNH ─────────────────────────────────────
function pnMainRender() {
  const filterNam = document.getElementById('pnMainFilterNam')?.value || '';
  const filtered = pnMainData.filter(r => !filterNam || r.nam.toString() === filterNam);

  const tbody = document.getElementById('pnMainTbody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;color:#94A3B8;">Không có dữ liệu nguồn chính cho năm này.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td style="text-align:center;color:#94A3B8;font-size:12px">${r.id}</td>
      <td style="text-align:center;font-weight:700;color:#1E293B">${r.nam}</td>
      <td style="text-align:right;font-weight:700;color:#185FA5">${r.tongNganSach.toLocaleString()}</td>
      <td style="text-align:right;color:#059669">${r.nsNhanVien.toLocaleString()}</td>
      <td style="text-align:right;color:#D97706">${r.nsQuanLy.toLocaleString()}</td>
      <td style="text-align:center">${r.nguoiTao}</td>
      <td style="text-align:center;color:#64748B;font-size:12px">${r.ngayTao}</td>
      <td style="text-align:center">
        <div class="cat-action-btns">
          <button class="cat-btn-edit" onclick="pnMainOpenEdit(${r.id})">Sửa</button>
          <button class="cat-btn-del" onclick="pnMainOpenDelete(${r.id})">Xóa</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── RENDER BẢNG 2: PHÂN NGUỒN THÁNG ────────────────────────────────
function pnMonthRender() {
  const filterQuy = document.getElementById('pnMonthFilterQuy')?.value || '';
  const filterNam = document.getElementById('pnMonthFilterNam')?.value || '';
  
  const filtered = pnMonthData.filter(r => 
    (!filterQuy || r.quy.toString() === filterQuy) && 
    (!filterNam || r.nam.toString() === filterNam)
  );

  const tbody = document.getElementById('pnMonthTbody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:30px;color:#94A3B8;">Không tìm thấy dữ liệu phân nguồn theo tháng.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td style="text-align:center;color:#94A3B8;font-size:12px">${r.id}</td>
      <td style="text-align:center">${r.nam}</td>
      <td style="text-align:center"><span class="cat-badge cat-badge-blue">Quý ${r.quy}</span></td>
      <td style="text-align:center;font-weight:600">Tháng ${r.thang}</td>
      <td style="text-align:right">${r.nld.toLocaleString()}</td>
      <td style="text-align:right">${r.nql.toLocaleString()}</td>
      <td style="text-align:right;font-weight:700;color:#185FA5">${r.tong.toLocaleString()}</td>
      <td style="font-size:12px;color:#64748B">${r.ghiChu || '—'}</td>
      <td style="text-align:center">
        <div class="cat-action-btns">
          <button class="cat-btn-edit" onclick="pnMonthOpenEdit(${r.id})" title="Sửa"><svg viewBox="0 0 14 14" fill="none" width="12"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4"/></svg></button>
          <button class="cat-btn-del" onclick="pnMonthOpenDelete(${r.id})" title="Xóa"><svg viewBox="0 0 14 14" fill="none" width="12"><path d="M2 4h10M4 4v8a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" stroke-width="1.4"/></svg></button>
          <button class="cat-btn-edit" onclick="pnMonthViewDetail(${r.id})" style="background:#F0F9FF;color:#0369A1;border-color:#BAE6FD;" title="Chi tiết theo phòng">
            <svg viewBox="0 0 14 14" fill="none" width="12"><path d="M1 7s2.5-4.5 6-4.5 6 4.5 6 4.5-2.5 4.5-6 4.5-6-4.5-6-4.5z" stroke="currentColor" stroke-width="1.4"/><circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.4"/></svg>
            Chi tiết
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── MODAL NGUỒN CHÍNH ─────────────────────────────────────────────
function pnMainOpenAdd() {
  pnMainEditId = null;
  document.getElementById('pnMainModalTitle').textContent = 'Thêm nguồn chính';
  document.getElementById('pnMainNam').value = new Date().getFullYear();
  document.getElementById('pnMainTong').value = '';
  document.getElementById('pnMainNsNLĐ').value = '';
  document.getElementById('pnMainNsNQL').value = '';
  document.getElementById('pnMainModal').classList.add('open');
}

function pnMainOpenEdit(id) {
  const r = pnMainData.find(x => x.id === id);
  if (!r) return;
  pnMainEditId = id;
  document.getElementById('pnMainModalTitle').textContent = 'Sửa nguồn chính';
  document.getElementById('pnMainNam').value = r.nam;
  document.getElementById('pnMainTong').value = r.tongNganSach;
  document.getElementById('pnMainNsNLĐ').value = r.nsNhanVien;
  document.getElementById('pnMainNsNQL').value = r.nsQuanLy;
  document.getElementById('pnMainModal').classList.add('open');
}

function pnMainSave() {
  const nam = parseInt(document.getElementById('pnMainNam').value);
  const tong = parseFloat(document.getElementById('pnMainTong').value) || 0;
  const nld = parseFloat(document.getElementById('pnMainNsNLĐ').value) || 0;
  const nql = parseFloat(document.getElementById('pnMainNsNQL').value) || 0;

  if (pnMainEditId) {
    const r = pnMainData.find(x => x.id === pnMainEditId);
    if (r) { r.nam = nam; r.tongNganSach = tong; r.nsNhanVien = nld; r.nsQuanLy = nql; }
  } else {
    pnMainData.unshift({
      id: pnMainNextId++, nam, tongNganSach: tong, nsNhanVien: nld, nsQuanLy: nql,
      nguoiTao: 'Admin', ngayTao: new Date().toISOString().split('T')[0]
    });
  }
  pnMainCloseModal();
  pnMainRender();
}

function pnMainCloseModal() { document.getElementById('pnMainModal').classList.remove('open'); }

// ─── MODAL PHÂN NGUỒN THÁNG ─────────────────────────────────────────
function pnMonthOpenAdd() {
  pnMonthEditId = null;
  document.getElementById('pnMonthModalTitle').textContent = 'Thêm phân nguồn tháng';
  document.getElementById('pnMonthNam').value = new Date().getFullYear();
  document.getElementById('pnMonthQuy').value = Math.floor((new Date().getMonth() + 3) / 3);
  document.getElementById('pnMonthThang').value = new Date().getMonth() + 1;
  document.getElementById('pnMonthNLD').value = '';
  document.getElementById('pnMonthNQL').value = '';
  document.getElementById('pnMonthGhiChu').value = '';
  document.getElementById('pnMonthModal').classList.add('open');
}

function pnMonthOpenEdit(id) {
  const r = pnMonthData.find(x => x.id === id);
  if (!r) return;
  pnMonthEditId = id;
  document.getElementById('pnMonthModalTitle').textContent = 'Sửa phân nguồn tháng';
  document.getElementById('pnMonthNam').value = r.nam;
  document.getElementById('pnMonthQuy').value = r.quy;
  document.getElementById('pnMonthThang').value = r.thang;
  document.getElementById('pnMonthNLD').value = r.nld;
  document.getElementById('pnMonthNQL').value = r.nql;
  document.getElementById('pnMonthGhiChu').value = r.ghiChu;
  document.getElementById('pnMonthModal').classList.add('open');
}

function pnMonthSave() {
  const nam = parseInt(document.getElementById('pnMonthNam').value);
  const quy = parseInt(document.getElementById('pnMonthQuy').value);
  const thang = parseInt(document.getElementById('pnMonthThang').value);
  const nld = parseFloat(document.getElementById('pnMonthNLD').value) || 0;
  const nql = parseFloat(document.getElementById('pnMonthNQL').value) || 0;
  const ghiChu = document.getElementById('pnMonthGhiChu').value;

  if (pnMonthEditId) {
    const r = pnMonthData.find(x => x.id === pnMonthEditId);
    if (r) { r.nam = nam; r.quy = quy; r.thang = thang; r.nld = nld; r.nql = nql; r.tong = nld + nql; r.ghiChu = ghiChu; }
  } else {
    pnMonthData.unshift({ id: pnMonthNextId++, nam, quy, thang, nld, nql, tong: nld + nql, ghiChu });
  }
  pnMonthCloseModal();
  pnMonthRender();
}

function pnMonthCloseModal() { document.getElementById('pnMonthModal').classList.remove('open'); }

// ─── XÓA ────────────────────────────────────────────────────────────
function pnMainOpenDelete(id) { pnMainDeleteId = id; document.getElementById('pnMainDeleteModal').classList.add('open'); }
function pnMainConfirmDelete() { pnMainData = pnMainData.filter(x => x.id !== pnMainDeleteId); pnMainCloseDelete(); pnMainRender(); }
function pnMainCloseDelete() { document.getElementById('pnMainDeleteModal').classList.remove('open'); }

function pnMonthOpenDelete(id) { pnMonthDeleteId = id; document.getElementById('pnMonthDeleteModal').classList.add('open'); }
function pnMonthConfirmDelete() { pnMonthData = pnMonthData.filter(x => x.id !== pnMonthDeleteId); pnMonthCloseDelete(); pnMonthRender(); }
function pnMonthCloseDelete() { document.getElementById('pnMonthDeleteModal').classList.remove('open'); }

// ─── CHI TIẾT THEO PHÒNG ────────────────────────────────────────────
function pnMonthViewDetail(id) {
  const r = pnMonthData.find(x => x.id === id);
  if (!r) return;
  document.getElementById('pnDetailTitle').textContent = `Chi tiết phân nguồn - Tháng ${r.thang}/${r.nam}`;
  // Mock data details
  const details = [
    { pb: 'Phòng Kỹ thuật', nld: r.nld * 0.4, nql: r.nql * 0.4 },
    { pb: 'Phòng Kinh doanh', nld: r.nld * 0.3, nql: r.nql * 0.3 },
    { pb: 'Phòng Hành chính', nld: r.nld * 0.3, nql: r.nql * 0.3 },
  ];
  const tbody = document.getElementById('pnDetailTbody');
  tbody.innerHTML = details.map(d => `
    <tr>
      <td style="font-weight:600">${d.pb}</td>
      <td style="text-align:right">${d.nld.toLocaleString()}</td>
      <td style="text-align:right">${d.nql.toLocaleString()}</td>
      <td style="text-align:right;font-weight:700;color:#185FA5">${(d.nld + d.nql).toLocaleString()}</td>
    </tr>
  `).join('');
  document.getElementById('pnDetailModal').classList.add('open');
}

function pnDetailCloseModal() { document.getElementById('pnDetailModal').classList.remove('open'); }

// ─── KHỞI TẠO ───────────────────────────────────────────────────────
window.onPageActivate = window.onPageActivate || function(page) {
  if (page === 'dm-phan-nguon') { pnMainRender(); pnMonthRender(); }
};
