// ══════════ PHÂN QUYỀN NGƯỜI DÙNG (USER PERMISSIONS) ══════════
let upermData = [
  { id: 1, account: 'admin', gd: true, tcns: true, tckt: true, pgd: true, nv: true, nvnl: true },
  { id: 2, account: 'Bùi Hải Đăng', gd: true, tcns: false, tckt: false, pgd: false, nv: false, nvnl: false },
  { id: 3, account: 'Bùi Hồng Nhung', gd: false, tcns: true, tckt: false, pgd: false, nv: true, nvnl: false },
  { id: 4, account: 'Bùi Hữu Tài	', gd: false, tcns: false, tckt: true, pgd: false, nv: true, nvnl: false },
  { id: 5, account: 'Bùi Minh Khoa', gd: false, tcns: false, tckt: false, pgd: false, nv: false, nvnl: true },
  { id: 6, account: 'Bùi Ngọc Bảo', gd: false, tcns: false, tckt: false, pgd: false, nv: false, nvnl: true },
  { id: 7, account: 'Bùi Ngọc Hà', gd: false, tcns: false, tckt: false, pgd: false, nv: false, nvnl: true },
  { id: 8, account: 'Bùi Ngọc Khánh', gd: false, tcns: false, tckt: false, pgd: false, nv: false, nvnl: true },
  { id: 9, account: 'Bùi Phương Thảo', gd: false, tcns: false, tckt: false, pgd: false, nv: false, nvnl: true },
  { id: 10, account: 'Bùi Thanh Tâm', gd: false, tcns: false, tckt: false, pgd: false, nv: false, nvnl: true },
];

// Dữ liệu mẫu thêm để xem phân trang
for (let i = 6; i <= 20; i++) {
  upermData.push({
    id: i,
    account: `user${i}`,
    gd: false,
    tcns: i % 2 === 0,
    tckt: i % 3 === 0,
    pgd: false,
    nv: true,
    nvnl: false
  });
}

let upermNextId = 21;
let upermCurrentPage = 1;
const UPERM_ITEMS_PER_PAGE = 10;

// ─── Render bảng ───────────────────────────────────────────────────
function upermRender() {
  const q = (document.getElementById('upermSearch').value || '').trim().toLowerCase();
  const filtered = upermData.filter(r =>
    r.account.toLowerCase().includes(q)
  );

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / UPERM_ITEMS_PER_PAGE) || 1;

  if (upermCurrentPage > totalPages) upermCurrentPage = totalPages;
  if (upermCurrentPage < 1) upermCurrentPage = 1;

  const startIndex = (upermCurrentPage - 1) * UPERM_ITEMS_PER_PAGE;
  const pagedData = filtered.slice(startIndex, startIndex + UPERM_ITEMS_PER_PAGE);

  const tbody = document.getElementById('upermTbody');
  const pill = document.getElementById('upermTotal');
  if (pill) pill.textContent = totalItems + ' tài khoản';

  if (pagedData.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="8">Không tìm thấy tài khoản phù hợp.</td></tr>`;
    document.getElementById('upermPagination').innerHTML = '';
    return;
  }

  tbody.innerHTML = pagedData.map(r => `
    <tr>
      <td style="font-weight:600;color:#111827">${r.account}</td>
      <td style="text-align:center"><input type="checkbox" ${r.gd ? 'checked' : ''} onchange="upermToggle(${r.id}, 'gd')"></td>
      <td style="text-align:center"><input type="checkbox" ${r.tcns ? 'checked' : ''} onchange="upermToggle(${r.id}, 'tcns')"></td>
      <td style="text-align:center"><input type="checkbox" ${r.tckt ? 'checked' : ''} onchange="upermToggle(${r.id}, 'tckt')"></td>
      <td style="text-align:center"><input type="checkbox" ${r.pgd ? 'checked' : ''} onchange="upermToggle(${r.id}, 'pgd')"></td>
      <td style="text-align:center"><input type="checkbox" ${r.nv ? 'checked' : ''} onchange="upermToggle(${r.id}, 'nv')"></td>
      <td style="text-align:center"><input type="checkbox" ${r.nvnl ? 'checked' : ''} onchange="upermToggle(${r.id}, 'nvnl')"></td>
    </tr>`).join('');

  upermRenderPagination(totalPages);
}

// ─── Logic Toggle ──────────────────────────────────────────────────
function upermToggle(id, field) {
  const item = upermData.find(x => x.id === id);
  if (item) {
    item[field] = !item[field];
    console.log(`Updated ${item.account}: ${field} = ${item[field]}`);
  }
}

// ─── Phân trang ────────────────────────────────────────────────────
function upermRenderPagination(totalPages) {
  const container = document.getElementById('upermPagination');
  if (!container) return;
  let html = '';

  html += `<button onclick="upermGoPage(${upermCurrentPage - 1})" ${upermCurrentPage === 1 ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${upermCurrentPage === 1 ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Trước</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === upermCurrentPage) {
      html += `<button style="padding:4px 10px;border:1px solid #185FA5;background:#185FA5;color:#fff;cursor:default;border-radius:4px;font-size:13px;font-weight:600;">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= upermCurrentPage - 2 && i <= upermCurrentPage + 2)) {
      html += `<button onclick="upermGoPage(${i})" style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;transition:all 0.2s;">${i}</button>`;
    } else if (i === upermCurrentPage - 3 || i === upermCurrentPage + 3) {
      html += `<span style="padding:4px 5px;color:#6B7280;">...</span>`;
    }
  }

  html += `<button onclick="upermGoPage(${upermCurrentPage + 1})" ${upermCurrentPage === totalPages ? 'disabled' : ''} style="padding:4px 10px;border:1px solid #E5E7EB;background:#fff;color:#374151;cursor:pointer;border-radius:4px;font-size:13px;font-weight:500;${upermCurrentPage === totalPages ? 'opacity:0.5;cursor:not-allowed;' : ''}transition:all 0.2s;">Sau</button>`;

  container.innerHTML = html;
}

function upermGoPage(page) {
  upermCurrentPage = page;
  upermRender();
}

// ─── Khởi tạo ────────────────────────────────────────────────────
(function () {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'phan-quyen-nd') upermRender();
  };
})();
