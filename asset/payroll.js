// ── Auth guard: nếu chưa đăng nhập thì về login.html
(function() {
  const user = sessionStorage.getItem('pms_user');
  if (!user) {
    window.location.replace('login.html');
  } else {
    // Hiển thị tên user trên sidebar
    const data = JSON.parse(user);
    const av = document.getElementById('sidebarAvatar');
    const nm = document.getElementById('sidebarName');
    if (av) av.textContent = (data.name || 'AD').substring(0, 2).toUpperCase();
    if (nm) nm.textContent = data.name || 'Admin';
  }
})();

// ── Date
const now = new Date();
document.getElementById('topbarDate').textContent =
  now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// ── Bar chart
const months = ['Th11', 'Th12', 'Th1', 'Th2', 'Th3', 'Th4'];
const vals   = [3.6, 3.8, 3.7, 4.0, 3.9, 4.2];
const max    = Math.max(...vals);
const bc     = document.getElementById('barChart');
months.forEach((m, i) => {
  const h = Math.round((vals[i] / max) * 88);
  bc.innerHTML += `<div class="bar-col">
    <div class="bar ${i===5?'highlight':''}" style="height:${h}px" title="${vals[i]} tỷ"></div>
    <span class="bar-label">${m}</span>
  </div>`;
});

// ── Sidebar navigation
const navItems = document.querySelectorAll('.nav-item');
const pageTitles = {
  dashboard: 'Dashboard', nhanvien: 'Quản lý nhân viên',
  bangluong: 'Bảng lương', chamcong: 'Chấm công',
  'thưởng': 'Thưởng & Phụ cấp', baocao: 'Báo cáo tháng',
  thue: 'Thuế TNCN', caidat: 'Cài đặt',
  'khoi-phong-ban': 'Danh mục khối phòng ban',
  'phong-ban': 'Danh mục phòng ban'
};

navItems.forEach(item => {
  item.addEventListener('click', function() {
    const page = this.dataset.page;
    navItems.forEach(n => n.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.page-section').forEach(s => {
      s.classList.remove('active');
      s.classList.remove('fade-in');
    });
    const target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
      void target.offsetWidth;
      target.classList.add('fade-in');
    }
    document.getElementById('topbarTitle').textContent = pageTitles[page] || page;
  });
});

// ── Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
  sessionStorage.removeItem('pms_user');
  window.location.replace('login.html');
});

// ══════════ KHỐI PHÒNG BAN ══════════
let kpbData = [
  { id: 1, ma: 'KD',  ten: 'Khối Kinh doanh',    moTa: 'Phụ trách kinh doanh, bán hàng và chăm sóc khách hàng.' },
  { id: 2, ma: 'KT',  ten: 'Khối Kỹ thuật',      moTa: 'Phát triển sản phẩm, hạ tầng và hỗ trợ kỹ thuật.' },
  { id: 3, ma: 'HC',  ten: 'Khối Hành chính',     moTa: 'Quản lý hành chính, văn phòng và nhân sự tổng hợp.' },
  { id: 4, ma: 'TC',  ten: 'Khối Tài chính',      moTa: 'Kế toán, tài chính và kiểm soát ngân sách.' },
  { id: 5, ma: 'MKT', ten: 'Khối Marketing',      moTa: 'Truyền thông, quảng bá thương hiệu và nghiên cứu thị trường.' },
];
let kpbNextId = 6;
let kpbEditId = null;
let kpbDeleteId = null;

function kpbRender() {
  const q = (document.getElementById('kpbSearch').value || '').trim().toLowerCase();
  const filtered = kpbData.filter(r =>
    r.ma.toLowerCase().includes(q) || r.ten.toLowerCase().includes(q)
  );
  const tbody = document.getElementById('kpbTbody');
  document.getElementById('kpbTotal').textContent = 'Tổng: ' + filtered.length + ' khối';

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Không tìm thấy kết quả phù hợp.</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map((r, i) => `
    <tr>
      <td style="color:#aaa; text-align:center">${i + 1}</td>
      <td><strong style="color:#185FA5; font-weight:600">${r.ma}</strong></td>
      <td>${r.ten}</td>
      <td style="color:#555; font-size:13px">${r.moTa || '<span style="color:#ccc">—</span>'}</td>
      <td style="text-align:center">
        <button class="btn-action btn-edit" onclick="kpbOpenEdit(${r.id})">Sửa</button>
        <button class="btn-action btn-delete" onclick="kpbOpenDelete(${r.id})" style="margin-left:6px">Xóa</button>
      </td>
    </tr>`).join('');
}

function kpbOpenAdd() {
  kpbEditId = null;
  document.getElementById('kpbModalTitle').textContent = 'Thêm khối phòng ban';
  document.getElementById('kpbMa').value = '';
  document.getElementById('kpbTen').value = '';
  document.getElementById('kpbMoTa').value = '';
  ['errKpbMa','errKpbTen'].forEach(id => document.getElementById(id).style.display = 'none');
  document.getElementById('kpbModal').classList.add('open');
  setTimeout(() => document.getElementById('kpbMa').focus(), 100);
}

function kpbOpenEdit(id) {
  const r = kpbData.find(x => x.id === id);
  if (!r) return;
  kpbEditId = id;
  document.getElementById('kpbModalTitle').textContent = 'Sửa khối phòng ban';
  document.getElementById('kpbMa').value  = r.ma;
  document.getElementById('kpbTen').value = r.ten;
  document.getElementById('kpbMoTa').value = r.moTa;
  ['errKpbMa','errKpbTen'].forEach(id => document.getElementById(id).style.display = 'none');
  document.getElementById('kpbModal').classList.add('open');
  setTimeout(() => document.getElementById('kpbMa').focus(), 100);
}

function kpbCloseModal() {
  document.getElementById('kpbModal').classList.remove('open');
}

function kpbSave() {
  const ma  = document.getElementById('kpbMa').value.trim().toUpperCase();
  const ten = document.getElementById('kpbTen').value.trim();
  const moTa = document.getElementById('kpbMoTa').value.trim();
  let valid = true;

  const errMa  = document.getElementById('errKpbMa');
  const errTen = document.getElementById('errKpbTen');
  errMa.style.display = 'none'; errTen.style.display = 'none';

  if (!ma)  { errMa.textContent  = 'Vui lòng nhập mã khối.';  errMa.style.display  = 'block'; valid = false; }
  else {
    const dup = kpbData.find(x => x.ma.toLowerCase() === ma.toLowerCase() && x.id !== kpbEditId);
    if (dup) { errMa.textContent = 'Mã khối này đã tồn tại.'; errMa.style.display = 'block'; valid = false; }
  }
  if (!ten) { errTen.textContent = 'Vui lòng nhập tên khối.'; errTen.style.display = 'block'; valid = false; }
  if (!valid) return;

  if (kpbEditId) {
    const r = kpbData.find(x => x.id === kpbEditId);
    r.ma = ma; r.ten = ten; r.moTa = moTa;
  } else {
    kpbData.push({ id: kpbNextId++, ma, ten, moTa });
  }
  kpbCloseModal();
  kpbRender();
}

function kpbOpenDelete(id) {
  kpbDeleteId = id;
  const r = kpbData.find(x => x.id === id);
  document.getElementById('kpbDeleteMsg').textContent =
    `Bạn có chắc muốn xóa khối "${r.ten}" (${r.ma}) không? Hành động này không thể hoàn tác.`;
  document.getElementById('kpbDeleteModal').classList.add('open');
}

function kpbCloseDelete() {
  document.getElementById('kpbDeleteModal').classList.remove('open');
}

function kpbConfirmDelete() {
  kpbData = kpbData.filter(x => x.id !== kpbDeleteId);
  kpbCloseDelete();
  kpbRender();
}

// Close modals on overlay click
document.getElementById('kpbModal').addEventListener('click', function(e) { if (e.target === this) kpbCloseModal(); });
document.getElementById('kpbDeleteModal').addEventListener('click', function(e) { if (e.target === this) kpbCloseDelete(); });

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
kpbRender();
