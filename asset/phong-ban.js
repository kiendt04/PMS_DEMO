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
  // sort by thuTu then ten
  filtered.sort((a,b) => (a.thuTu||999) - (b.thuTu||999) || a.ten.localeCompare(b.ten, 'vi'));

  const tbody = document.getElementById('pbTbody');
  document.getElementById('pbTotal').textContent = 'Tổng: ' + filtered.length + ' phòng ban';

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Không tìm thấy kết quả phù hợp.</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map((r, i) => `
    <tr>
      <td style="color:#aaa;text-align:center">${i+1}</td>
      <td style="text-align:center;color:#888">${r.thuTu || '—'}</td>
      <td style="font-weight:500">${r.ten}</td>
      <td><span style="background:#E6F1FB;color:#185FA5;font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px">${r.vietTat}</span></td>
      <td style="font-size:12.5px;color:#555">${pbGetKhoiName(r.khoiId)}</td>
      <td style="font-size:12.5px;color:#666">${r.moTa || '<span style="color:#ccc">—</span>'}</td>
      <td style="text-align:center">
        <button class="btn-action btn-edit" onclick="pbOpenEdit(${r.id})">Sửa</button>
        <button class="btn-action btn-delete" onclick="pbOpenDelete(${r.id})" style="margin-left:6px">Xóa</button>
      </td>
    </tr>`).join('');
}

function pbOpenAdd() {
  pbPopulateKhoiSelects();
  pbEditId = null;
  document.getElementById('pbModalTitle').textContent = 'Thêm phòng ban';
  document.getElementById('pbTen').value = '';
  document.getElementById('pbVietTat').value = '';
  document.getElementById('pbKhoi').value = '';
  document.getElementById('pbThuTu').value = '';
  document.getElementById('pbMoTa').value = '';
  ['errPbTen','errPbVietTat','errPbKhoi','errPbThuTu'].forEach(id => document.getElementById(id).style.display='none');
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
  ['errPbTen','errPbVietTat','errPbKhoi','errPbThuTu'].forEach(id => document.getElementById(id).style.display='none');
  document.getElementById('pbModal').classList.add('open');
  setTimeout(() => document.getElementById('pbTen').focus(), 100);
}

function pbCloseModal() { document.getElementById('pbModal').classList.remove('open'); }

function pbSave() {
  const ten     = document.getElementById('pbTen').value.trim();
  const vietTat = document.getElementById('pbVietTat').value.trim().toUpperCase();
  const khoiId  = parseInt(document.getElementById('pbKhoi').value);
  const thuTuRaw = document.getElementById('pbThuTu').value.trim();
  const moTa    = document.getElementById('pbMoTa').value.trim();
  let valid = true;

  ['errPbTen','errPbVietTat','errPbKhoi','errPbThuTu'].forEach(id => document.getElementById(id).style.display='none');

  if (!ten)     { showFE('errPbTen',    'Vui lòng nhập tên phòng ban.');   valid=false; }
  if (!vietTat) { showFE('errPbVietTat','Vui lòng nhập tên viết tắt.');    valid=false; }
  if (!khoiId)  { showFE('errPbKhoi',   'Vui lòng chọn khối phòng ban.');  valid=false; }
  let thuTu = null;
  if (thuTuRaw !== '') {
    thuTu = parseInt(thuTuRaw);
    if (isNaN(thuTu) || thuTu < 1) { showFE('errPbThuTu', 'Thứ tự phải là số nguyên dương.'); valid=false; }
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

// style select on focus
document.getElementById('pbKhoi').addEventListener('focus', function(){ this.style.borderColor='#378ADD'; this.style.boxShadow='0 0 0 3px rgba(55,138,221,.1)'; });
document.getElementById('pbKhoi').addEventListener('blur',  function(){ this.style.borderColor='#ddd'; this.style.boxShadow=''; });

pbPopulateKhoiSelects();
pbRender();
