// ══════════ PHÂN QUYỀN QUYỀN - CHỨC NĂNG (PERMISSION SYSTEM) ══════════

// Dữ liệu phân quyền: Map từ roleId sang danh sách các functionId
let permData = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Giám đốc: Full quyền
  2: [1, 2, 4, 7, 12, 14, 17, 18], // Nhân viên phòng TCNS
  3: [1, 4, 9, 16, 18, 19, 20],    // Nhân viên phòng TCKT
  4: [1, 2, 3, 4, 5, 6, 7, 11, 13], // Phó giám đốc
  5: [1, 3, 12],                   // Nhân viên
  6: [1, 3, 10, 21, 22, 23, 24, 25] // Nhân viên nhập liệu
};

let permCurrentRoleId = 1; // Mặc định là Giám đốc
let permSearchQuery = '';

// ─── Render bảng ───────────────────────────────────────────────────
function permRender() {
  const roleSelect = document.getElementById('permRoleSelect');
  if (roleSelect) {
    // Fill role select if empty
    if (roleSelect.options.length === 0) {
      roleData.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = r.ten;
        roleSelect.appendChild(opt);
      });
      roleSelect.value = permCurrentRoleId;
    }
    permCurrentRoleId = parseInt(roleSelect.value);
  }

  const q = (document.getElementById('permSearch').value || '').trim().toLowerCase();
  const filteredFuncs = funcData.filter(f =>
    f.ten.toLowerCase().includes(q) ||
    (f.menuCha && f.menuCha.toLowerCase().includes(q)) ||
    f.id.toString() === q
  );

  const tbody = document.getElementById('permTbody');
  const totalEl = document.getElementById('permTotal');
  if (totalEl) totalEl.textContent = filteredFuncs.length + ' chức năng';

  if (filteredFuncs.length === 0) {
    tbody.innerHTML = `<tr class="cat-empty"><td colspan="5">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style="display:block;margin:0 auto 10px;opacity:.25"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="2"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Không tìm thấy chức năng phù hợp.
    </td></tr>`;
    return;
  }

  // Lấy danh sách functionId đã gán cho role hiện tại
  const assignedFuncs = permData[permCurrentRoleId] || [];

  tbody.innerHTML = filteredFuncs.map(f => {
    const isChecked = assignedFuncs.includes(f.id);
    return `
      <tr class="${isChecked ? 'perm-row-checked' : ''}">
        <td style="text-align:center; width:50px;">
          <input type="checkbox" class="perm-checkbox" ${isChecked ? 'checked' : ''} onchange="permToggle(${f.id})">
        </td>
        <td style="font-weight:600;color:#111827">${f.ten}</td>
        <td style="color:#6B7280;font-size:13px">${f.menuCha || '<span style="color:#D1D5DB">Gốc</span>'}</td>
        <td style="text-align:center;color:#6B7280">${f.sapXep || 0}</td>
        <td style="font-family:monospace;font-size:12px;color:#0369A1">${f.metaTitle || ''}</td>
      </tr>`;
  }).join('');
}

// ─── Logic Toggle ──────────────────────────────────────────────────
function permToggle(funcId) {
  if (!permData[permCurrentRoleId]) {
    permData[permCurrentRoleId] = [];
  }

  const index = permData[permCurrentRoleId].indexOf(funcId);
  if (index > -1) {
    // Xóa quyền
    permData[permCurrentRoleId].splice(index, 1);
  } else {
    // Thêm quyền
    permData[permCurrentRoleId].push(funcId);
  }
  
  // Re-render row style or full table
  permRender();
  console.log(`Updated Role ${permCurrentRoleId}:`, permData[permCurrentRoleId]);
}

// ─── Khởi tạo ────────────────────────────────────────────────────
(function () {
  const prevOnPageActivate = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (prevOnPageActivate) prevOnPageActivate(page);
    if (page === 'phan-quyen-cn') {
      // Đảm bảo funcData và roleData đã có
      if (typeof funcData !== 'undefined' && typeof roleData !== 'undefined') {
        permRender();
      } else {
        setTimeout(permRender, 200);
      }
    }
  };
})();
