// ══════════ PHÒNG BAN ══════════
let pbData = [
  { id:1, ten:'Phòng Kinh doanh miền Bắc', vietTat:'KD-MB', khoiId:1, thuTu:1, moTa:'Phụ trách kinh doanh khu vực phía Bắc.' },
  { id:2, ten:'Phòng Kinh doanh miền Nam',  vietTat:'KD-MN', khoiId:1, thuTu:2, moTa:'Phụ trách kinh doanh khu vực phía Nam.' },
  { id:3, ten:'Phòng Phát triển phần mềm',  vietTat:'PTPM',  khoiId:2, thuTu:1, moTa:'Phát triển và bảo trì sản phẩm phần mềm.' },
  { id:4, ten:'Phòng Hạ tầng & DevOps',     vietTat:'HT',    khoiId:2, thuTu:2, moTa:'Quản lý hạ tầng, máy chủ và triển khai.' },
  { id:5, ten:'Phòng Hành chính tổng hợp',  vietTat:'HCTH',  khoiId:3, thuTu:1, moTa:'Hành chính, văn thư và hậu cần.' },
  { id:6, ten:'Phòng Nhân sự',              vietTat:'NS',    khoiId:3, thuTu:2, moTa:'Tuyển dụng, đào tạo và quản lý nhân sự.' },
  { id:7, ten:'Phòng Kế toán',              vietTat:'KTO',   khoiId:4, thuTu:1, moTa:'Kế toán tài chính và thuế.' },
];
let pbNextId = 8;
let pbEditId = null;
let pbDeleteId = null;

function pbGetKhoiName(khoiId) {
  const k = kpbData.find(x => x.id === khoiId);
  return k ? k.ten : '—';
}

function pbPopulateKhoiSelects() {
  const opts = kpbData.map(k => `<option value="${k.id}">${k.ten}</option>`).join('');
  document.getElementById('pbKhoi').innerHTML = '<option value="">-- Chọn khối --</option>' + opts;
  document.getElementById('pbFilterKhoi').innerHTML = '<option value="">Tất cả khối</option>' + opts;
}

function pbRender() {
  const q      = (document.getElementById('pbSearch').value || '').trim().toLowerCase();
  const khoi   = document.getElementById('pbFilterKhoi').value;
  let filtered = pbData.filter(r => {
    const matchQ = !q || r.ten.toLowerCase().includes(q) || r.vietTat.toLowerCase().includes(q);
    const matchK = !khoi || String(r.khoiId) === khoi;
    return matchQ && matchK;
  });
  filtered.sort((a,b) => (a.thuTu||999) - (b.thuTu||999) || a.ten.localeCompare(b.ten, 'vi'));

  const tbody = document.getElementById('pbTbody');
  const pill  = document.getElementById('pbTotal');
  if (pill) pill.textContent = filtered.length + ' phòng ban';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="7">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map((r, i) => `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${i+1}</td>
      <td style="text-align:center;color:#9CA3AF;font-size:12.5px">${r.thuTu ?? '—'}</td>
      <td style="font-weight:600;color:#111827">${r.ten}</td>
      <td><span class="cat-chip-teal">${r.vietTat}</span></td>
      <td style="font-size:13px;color:#374151">${pbGetKhoiName(r.khoiId)}</td>
      <td style="font-size:13px;color:#6B7280">${r.moTa || '<span style="color:#D1D5DB">—</span>'}</td>
      <td style="text-align:center">
        <button class="cat-btn-edit" onclick="pbOpenEdit(${r.id})">
          <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Sửa
        </button>
        <button class="cat-btn-del" onclick="pbOpenDelete(${r.id})">
          <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Xóa
        </button>
      </td>
    </tr>`).join('');
}

function pbOpenAdd() {
  pbPopulateKhoiSelects();
  pbEditId = null;
  document.getElementById('pbModalTitle').textContent = 'Thêm phòng ban';
  ['pbTen','pbVietTat','pbThuTu','pbMoTa'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pbKhoi').value = '';
  ['errPbTen','errPbVietTat','errPbKhoi','errPbThuTu'].forEach(id => {
    const el = document.getElementById(id);
    el.style.display = 'none'; el.textContent = '';
  });
  document.getElementById('pbModal').classList.add('open');
  setTimeout(() => document.getElementById('pbTen').focus(), 100);
}

function pbOpenEdit(id) {
  pbPopulateKhoiSelects();
  const r = pbData.find(x => x.id === id);
  if (!r) return;
  pbEditId = id;
  document.getElementById('pbModalTitle').textContent = 'Sửa phòng ban';
  document.getElementById('pbTen').value     = r.ten;
  document.getElementById('pbVietTat').value = r.vietTat;
  document.getElementById('pbKhoi').value    = r.khoiId;
  document.getElementById('pbThuTu').value   = r.thuTu || '';
  document.getElementById('pbMoTa').value    = r.moTa;
  ['errPbTen','errPbVietTat','errPbKhoi','errPbThuTu'].forEach(id => {
    const el = document.getElementById(id);
    el.style.display = 'none'; el.textContent = '';
  });
  document.getElementById('pbModal').classList.add('open');
  setTimeout(() => document.getElementById('pbTen').focus(), 100);
}

function pbCloseModal() { document.getElementById('pbModal').classList.remove('open'); }

function pbSave() {
  const ten      = document.getElementById('pbTen').value.trim();
  const vietTat  = document.getElementById('pbVietTat').value.trim().toUpperCase();
  const khoiId   = parseInt(document.getElementById('pbKhoi').value);
  const thuTuRaw = document.getElementById('pbThuTu').value.trim();
  const moTa     = document.getElementById('pbMoTa').value.trim();
  let valid = true;

  ['errPbTen','errPbVietTat','errPbKhoi','errPbThuTu'].forEach(id => {
    const el = document.getElementById(id);
    el.style.display = 'none'; el.textContent = '';
  });

  if (!ten)     { showFE('errPbTen',    'Vui lòng nhập tên phòng ban.');   valid = false; }
  if (!vietTat) { showFE('errPbVietTat','Vui lòng nhập tên viết tắt.');    valid = false; }
  if (!khoiId)  { showFE('errPbKhoi',   'Vui lòng chọn khối phòng ban.');  valid = false; }
  let thuTu = null;
  if (thuTuRaw !== '') {
    thuTu = parseInt(thuTuRaw);
    if (isNaN(thuTu) || thuTu < 1) { showFE('errPbThuTu', 'Thứ tự phải là số nguyên dương.'); valid = false; }
  }
  if (!valid) return;

  if (pbEditId) {
    const r = pbData.find(x => x.id === pbEditId);
    Object.assign(r, { ten, vietTat, khoiId, thuTu, moTa });
  } else {
    pbData.push({ id: pbNextId++, ten, vietTat, khoiId, thuTu, moTa });
  }
  pbCloseModal();
  pbRender();
}

function showFE(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg; el.style.display = 'block';
}

function pbOpenDelete(id) {
  pbDeleteId = id;
  const r = pbData.find(x => x.id === id);
  document.getElementById('pbDeleteMsg').textContent =
    `Bạn có chắc muốn xóa phòng ban "${r.ten}" (${r.vietTat}) không? Hành động này không thể hoàn tác.`;
  document.getElementById('pbDeleteModal').classList.add('open');
}

function pbCloseDelete() { document.getElementById('pbDeleteModal').classList.remove('open'); }

function pbConfirmDelete() {
  pbData = pbData.filter(x => x.id !== pbDeleteId);
  pbCloseDelete();
  pbRender();
}

document.getElementById('pbModal').addEventListener('click', function(e){ if(e.target===this) pbCloseModal(); });
document.getElementById('pbDeleteModal').addEventListener('click', function(e){ if(e.target===this) pbCloseDelete(); });

pbPopulateKhoiSelects();
pbRender();
