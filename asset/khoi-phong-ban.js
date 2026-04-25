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

kpbRender();
