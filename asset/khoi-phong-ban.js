// ══════════ KHỐI PHÒNG BAN ══════════
let kpbData = [
  { id: 1, ma: 'KD', ten: 'Khối Kinh doanh', moTa: 'Phụ trách kinh doanh, bán hàng và chăm sóc khách hàng.' },
  { id: 2, ma: 'KT', ten: 'Khối Kỹ thuật', moTa: 'Phát triển sản phẩm, hạ tầng và hỗ trợ kỹ thuật.' },
  { id: 3, ma: 'HC', ten: 'Khối Hành chính', moTa: 'Quản lý hành chính, văn phòng và nhân sự tổng hợp.' },
  { id: 4, ma: 'TC', ten: 'Khối Tài chính', moTa: 'Kế toán, tài chính và kiểm soát ngân sách.' },
  { id: 5, ma: 'MKT', ten: 'Khối Marketing', moTa: 'Truyền thông, quảng bá thương hiệu và nghiên cứu thị trường.' },
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
  const pill = document.getElementById('kpbTotal');
  if (pill) pill.textContent = filtered.length + ' khối';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="5">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy kết quả phù hợp.
    </td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map((r, i) => `
    <tr>
      <td style="color:#9CA3AF;text-align:center;font-size:12.5px">${i + 1}</td>
      <td><span class="cat-chip-blue">${r.ma}</span></td>
      <td style="font-weight:600;color:#111827">${r.ten}</td>
      <td style="color:#6B7280;font-size:13px">${r.moTa || '<span style="color:#D1D5DB">—</span>'}</td>
      <td style="text-align:center">
        <button class="cat-btn-edit" onclick="kpbOpenEdit(${r.id})">
          <svg viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Sửa
        </button>
        <button class="cat-btn-del" onclick="kpbOpenDelete(${r.id})">
          <svg viewBox="0 0 14 14" fill="none"><polyline points="2 4 3.5 4 12 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 4l-.7 8a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Xóa
        </button>
      </td>
    </tr>`).join('');
}

function kpbOpenAdd() {
  kpbEditId = null;
  document.getElementById('kpbModalTitle').textContent = 'Thêm khối phòng ban';
  document.getElementById('kpbMa').value = '';
  document.getElementById('kpbTen').value = '';
  document.getElementById('kpbMoTa').value = '';
  ['errKpbMa', 'errKpbTen'].forEach(id => {
    const el = document.getElementById(id);
    el.style.display = 'none'; el.textContent = '';
  });
  document.getElementById('kpbModal').classList.add('open');
  setTimeout(() => document.getElementById('kpbMa').focus(), 100);
}

function kpbOpenEdit(id) {
  const r = kpbData.find(x => x.id === id);
  if (!r) return;
  kpbEditId = id;
  document.getElementById('kpbModalTitle').textContent = 'Sửa khối phòng ban';
  document.getElementById('kpbMa').value = r.ma;
  document.getElementById('kpbTen').value = r.ten;
  document.getElementById('kpbMoTa').value = r.moTa;
  ['errKpbMa', 'errKpbTen'].forEach(id => {
    const el = document.getElementById(id);
    el.style.display = 'none'; el.textContent = '';
  });
  document.getElementById('kpbModal').classList.add('open');
  setTimeout(() => document.getElementById('kpbMa').focus(), 100);
}

function kpbCloseModal() {
  document.getElementById('kpbModal').classList.remove('open');
}

function kpbSave() {
  const ma = document.getElementById('kpbMa').value.trim().toUpperCase();
  const ten = document.getElementById('kpbTen').value.trim();
  const moTa = document.getElementById('kpbMoTa').value.trim();
  let valid = true;

  const errMa = document.getElementById('errKpbMa');
  const errTen = document.getElementById('errKpbTen');
  errMa.style.display = 'none'; errTen.style.display = 'none';

  if (!ma) {
    errMa.textContent = 'Vui lòng nhập mã khối.';
    errMa.style.display = 'block'; valid = false;
  } else {
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

document.getElementById('kpbModal').addEventListener('click', function (e) { if (e.target === this) kpbCloseModal(); });
document.getElementById('kpbDeleteModal').addEventListener('click', function (e) { if (e.target === this) kpbCloseDelete(); });

kpbRender();
