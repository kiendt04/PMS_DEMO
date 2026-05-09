/**
 * phan-nguon.category.js — Quản lý phân nguồn ngân sách
 * Giao diện tùy biến cao, không dùng Handsontable.
 * Cấu trúc phân cấp Year -> Quarter -> Month.
 * Cập nhật: Phân bổ HDTV chia làm 2 bảng (Chuyên trách & Không chuyên trách).
 */
(function () {
  'use strict';

  const DEPTS = [
    'Phòng Tổng hợp HĐTV', 'Phòng Kinh doanh', 'Phòng Kỹ thuật', 
    'Phòng Nhân sự', 'Phòng Kế toán', 'Phòng Công nghệ', 'Phòng Chất Lượng'
  ];

  /* ── 1. DỮ LIỆU MẪU ── */
  let sourceData = [
    {
      id: 'y2024', label: 'NĂM 2024', hdtv: 1500000000, nld: 3500000000, note: 'Kế hoạch ngân sách 2024', isOpen: true,
      quarters: [
        {
          id: 'q1-2024', label: 'Quý 1', hdtv: 400000000, nld: 900000000, note: 'Tạm giao Q1', isOpen: true,
          months: [
            { id: 'm1-2024', label: 'Tháng 1', hdtv: 120000000, nld: 280000000, note: 'Thực hiện T1' },
            { id: 'm2-2024', label: 'Tháng 2', hdtv: 115000000, nld: 260000000, note: 'Thực hiện T2' },
            { id: 'm3-2024', label: 'Tháng 3', hdtv: 165000000, nld: 360000000, note: 'Thực hiện T3' },
          ]
        }
      ]
    }
  ];

  const HDTV_CT = [
    { stt: 1, name: 'Nguyễn A', ma: 'HDTV01', pos: 'Chủ tịch HĐTV', hsl: 10, hspc: 1, luongTH: 100000000, luongTU: 80000000 },
    { stt: 2, name: 'Nguyễn B', ma: 'HDTV02', pos: 'Thành viên HĐTV', hsl: 8, hspc: 0.5, luongTH: 100000000, luongTU: 80000000 }
  ];

  const HDTV_KCT = [
    { stt: 1, name: 'Nguyễn C', ma: 'HDTV03', pos: 'Thành viên HĐTV', hsl: 8, hspc: 0.5, luongTH: 1200000000, luongTU: 960000000 },
    { stt: 2, name: 'Nguyễn E', ma: 'BKS02', pos: 'KSV', hsl: 8, hspc: 0.5, luongTH: 1200000000, luongTU: 960000000 }
  ];

  /* ── 2. RENDER BẢNG CHÍNH ── */
  function renderMainTable() {
    const tbody = document.getElementById('pnTableBody');
    if (!tbody) return;

    let html = '';
    sourceData.forEach(year => {
      html += `<tr class="pn-row-level-0" onclick="pnToggleRow('${year.id}')">
        <td class="pn-cell-expand"><span class="pn-toggle-icon ${year.isOpen ? 'open' : ''}"></span><strong>${year.label}</strong></td>
        <td colspan="4" style="text-align:right; padding-right: 20px;"><span class="pn-badge pn-badge-blue">TỔNG CỘNG: ${(year.hdtv + year.nld).toLocaleString()} VNĐ</span></td>
      </tr>`;

      if (year.isOpen) {
        html += renderTypeRows(year, 'pn-row-sub-0');
        year.quarters.forEach(q => {
          html += `<tr class="pn-row-level-1" onclick="pnToggleRow('${year.id}', '${q.id}')">
            <td class="pn-cell-expand" style="padding-left: 30px;"><span class="pn-toggle-icon ${q.isOpen ? 'open' : ''}"></span>${q.label}</td>
            <td colspan="4" style="text-align:right; padding-right: 20px;"><span class="pn-badge pn-badge-teal">Tổng Quý: ${(q.hdtv + q.nld).toLocaleString()} VNĐ</span></td>
          </tr>`;

          if (q.isOpen) {
            html += renderTypeRows(q, 'pn-row-sub-1', 40);
            q.months.forEach(m => {
              html += `<tr class="pn-row-level-2"><td style="padding-left: 60px; color: #64748B;">↳ ${m.label}</td><td colspan="4"></td></tr>
                <tr class="pn-row-data">
                   <td style="padding-left: 80px; font-size: 12px; color: #94A3B8;">Thành phần HDTV</td>
                   <td style="text-align:center"><span class="pn-type-tag hdtv">HDTV</span></td>
                   <td style="text-align:right; font-weight: 600;">${m.hdtv.toLocaleString()}</td>
                   <td style="font-size: 12px; color: #64748B;">${m.note}</td>
                   <td style="text-align:center"><button class="pn-action-btn" onclick="pnOpenDetailModal('${m.label}', 'HDTV', ${m.hdtv})"><svg viewBox="0 0 24 24" fill="none" width="16"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Phân bổ</button></td>
                </tr>
                <tr class="pn-row-data">
                   <td style="padding-left: 80px; font-size: 12px; color: #94A3B8;">Thành phần NLĐ</td>
                   <td style="text-align:center"><span class="pn-type-tag nld">NLĐ</span></td>
                   <td style="text-align:right; font-weight: 600;">${m.nld.toLocaleString()}</td>
                   <td style="font-size: 12px; color: #64748B;">${m.note}</td>
                   <td style="text-align:center"><button class="pn-action-btn" onclick="pnOpenDetailModal('${m.label}', 'NLĐ', ${m.nld})"><svg viewBox="0 0 24 24" fill="none" width="16"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Phân bổ</button></td>
                </tr>`;
            });
          }
        });
      }
    });
    tbody.innerHTML = html;
  }

  function renderTypeRows(item, className, pad = 20) {
    return `<tr class="${className} pn-row-data">
        <td style="padding-left: ${pad}px; font-style: italic; color: #94A3B8;">— Thành phần HDTV</td>
        <td style="text-align:center"><span class="pn-type-tag hdtv">HDTV</span></td>
        <td style="text-align:right; font-weight: 600;">${item.hdtv.toLocaleString()}</td>
        <td style="font-size: 12px; color: #64748B;">${item.note}</td>
        <td></td>
      </tr>
      <tr class="${className} pn-row-data">
        <td style="padding-left: ${pad}px; font-style: italic; color: #94A3B8;">— Thành phần NLĐ</td>
        <td style="text-align:center"><span class="pn-type-tag nld">NLĐ</span></td>
        <td style="text-align:right; font-weight: 600;">${item.nld.toLocaleString()}</td>
        <td style="font-size: 12px; color: #64748B;">${item.note}</td>
        <td></td>
      </tr>`;
  }

  window.pnToggleRow = function (yearId, quarterId = null) {
    const year = sourceData.find(y => y.id === yearId);
    if (!year) return;
    if (!quarterId) year.isOpen = !year.isOpen;
    else { const q = year.quarters.find(x => x.id === quarterId); if (q) q.isOpen = !q.isOpen; }
    renderMainTable();
  };

  /* ── 3. RENDER MODAL CHI TIẾT ── */
  window.pnOpenDetailModal = function (monthLabel, type, totalAmount) {
    const title = document.getElementById('pnDetailTitle');
    title.innerHTML = `Phân bổ nguồn <strong>${type}</strong> - ${monthLabel}`;

    const viewNLD = document.getElementById('pnDetailViewNLD');
    const viewHDTV = document.getElementById('pnDetailViewHDTV');
    const summary = document.getElementById('pnDetailSummary');

    if (type === 'NLĐ') {
      viewNLD.style.display = 'block';
      viewHDTV.style.display = 'none';
      summary.style.display = 'grid';
      renderNLDTable(totalAmount);
    } else {
      viewNLD.style.display = 'none';
      viewHDTV.style.display = 'block';
      summary.style.display = 'none'; // HDTV often has fixed plans, hide summary if not needed
      renderHDTVTables();
    }

    document.getElementById('pnDetailModal').classList.add('open');
  };

  function renderNLDTable(totalAmount) {
    const totalHS = 23.04;
    const giaTri1HS = totalAmount > 0 ? Math.round(totalAmount / totalHS) : 0;
    document.getElementById('pnDetailSourceType').textContent = 'NLĐ';
    document.getElementById('pnDetailTotalAmount').textContent = totalAmount.toLocaleString() + ' VNĐ';
    document.getElementById('pnDetailTotalHS').textContent = totalHS.toFixed(2);
    document.getElementById('pnDetailValPerHS').textContent = giaTri1HS.toLocaleString() + ' VNĐ';

    const tbody = document.getElementById('pnDetailTbodyNLD');
    tbody.innerHTML = DEPTS.map((name, i) => {
      const hs = i === 0 ? 11.77 : (i === 1 ? 11.27 : 0);
      const qlKH = Math.round(hs * giaTri1HS);
      return `<tr>
        <td style="font-weight: 600; color: #1E293B;">${name}</td>
        <td style="text-align:center"><input type="number" class="pn-input-sm" value="1" style="width: 50px;"></td>
        <td style="text-align:center"><input type="number" class="pn-input-sm" value="${hs}" step="0.01" style="width: 70px;"></td>
        <td style="text-align:right; color: #64748B;">${giaTri1HS.toLocaleString()}</td>
        <td style="text-align:right; font-weight: 700;">${qlKH.toLocaleString()}</td>
        <td style="text-align:right; font-weight: 700; color: #185FA5;">${qlKH.toLocaleString()}</td>
        <td style="text-align:right; color: #059669">0</td>
        <td style="text-align:right; color: #D97706">0</td>
        <td style="text-align:right; font-weight: 600;">${(i < 2 ? (i === 0 ? 40000000 : 30000000) : 0).toLocaleString()}</td>
      </tr>`;
    }).join('');
  }

  function renderHDTVTables() {
    const tbodyCT = document.getElementById('pnDetailTbodyHDTV_CT');
    tbodyCT.innerHTML = HDTV_CT.map(item => `<tr>
      <td style="text-align:center">${item.stt}</td>
      <td style="font-weight:600">${item.name}</td>
      <td style="text-align:center">${item.ma}</td>
      <td>${item.pos}</td>
      <td style="text-align:center">${item.hsl}</td>
      <td style="text-align:center">${item.hspc}</td>
      <td style="text-align:right; font-weight:700">${item.luongTH.toLocaleString()}</td>
      <td style="text-align:right; font-weight:700; color:#185FA5">${item.luongTU.toLocaleString()}</td>
    </tr>`).join('');

    const tbodyKCT = document.getElementById('pnDetailTbodyHDTV_KCT');
    tbodyKCT.innerHTML = HDTV_KCT.map(item => `<tr>
      <td style="text-align:center">${item.stt}</td>
      <td style="font-weight:600">${item.name}</td>
      <td style="text-align:center">${item.ma}</td>
      <td>${item.pos}</td>
      <td style="text-align:center">${item.hsl}</td>
      <td style="text-align:center">${item.hspc}</td>
      <td style="text-align:right; font-weight:700">${item.luongTH.toLocaleString()}</td>
      <td style="text-align:right; font-weight:700; color:#185FA5">${item.luongTU.toLocaleString()}</td>
    </tr>`).join('');
  }

  window.pnDetailCloseModal = function () { document.getElementById('pnDetailModal').classList.remove('open'); };
  window.pnDetailSave = function () { alert('Đã lưu dữ liệu phân bổ thành công!'); pnDetailCloseModal(); };

  // Logic Thêm mới phân nguồn
  window.pnOpenAdd = function () {
    document.getElementById('pnAddModal').classList.add('open');
  };
  window.pnCloseAdd = function () {
    document.getElementById('pnAddModal').classList.remove('open');
  };
  window.pnSaveNew = function () {
    const amount = document.getElementById('pnAddAmount').value;
    if (!amount) { alert('Vui lòng nhập số tiền!'); return; }
    alert('Thêm phân nguồn mới thành công!');
    pnCloseAdd();
  };

  if (!window.onPageActivateRegistry) window.onPageActivateRegistry = {};
  window.onPageActivateRegistry['dm-phan-nguon'] = renderMainTable;

  const _old = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _old === 'function') _old(page);
    if (window.onPageActivateRegistry[page]) { setTimeout(window.onPageActivateRegistry[page], 50); }
  };

  setTimeout(() => { if (document.querySelector('.nav-item.active')?.dataset.page === 'dm-phan-nguon') renderMainTable(); }, 500);

})();
