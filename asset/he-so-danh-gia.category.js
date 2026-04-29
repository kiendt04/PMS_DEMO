/**
 * he-so-danh-gia.category.js
 * Quản lý danh mục hệ số đánh giá
 */
(function () {
  const MOCK_DATA = [
    { id: 1, ten: 'Công đi làm', kyHieuCong: 'Kti', kyHieuNgay: 'Nti', giaTri: 1.00, thuTu: 1, ngayBD: '01/01/2024', ngayKT: '', trangThai: 'Hoạt động', ghiChu: '' },
    { id: 2, ten: 'Công đi học', kyHieuCong: 'Kdhi', kyHieuNgay: 'Ndhi', giaTri: 0.80, thuTu: 2, ngayBD: '01/01/2024', ngayKT: '', trangThai: 'Hoạt động', ghiChu: '' },
    { id: 3, ten: 'Công nghỉ chế độ', kyHieuCong: 'Kcdi', kyHieuNgay: 'Ncdi', giaTri: 0.80, thuTu: 3, ngayBD: '01/01/2024', ngayKT: '', trangThai: 'Hoạt động', ghiChu: '' },
    { id: 4, ten: 'Ngày công nghỉ lễ', kyHieuCong: '', kyHieuNgay: 'NLễ', giaTri: 0.00, thuTu: 4, ngayBD: '01/01/2024', ngayKT: '', trangThai: 'Hoạt động', ghiChu: '' },
  ];

  let hotInstance = null;
  
  function statusRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<span class="badge badge-green" style="border-radius:20px; font-size:10px; padding:2px 8px;">${value}</span>`;
    td.classList.add('htCenter', 'htMiddle');
    return td;
  }

  function actionRenderer(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = `
      <div style="display:flex; justify-content:center; gap:10px; align-items:center; height:100%;">
        <button style="border:none; background:none; cursor:pointer; color:#378ADD;" title="Sửa"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
        <button style="border:none; background:none; cursor:pointer; color:#EF4444;" title="Xóa"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
      </div>
    `;
    td.classList.add('htCenter', 'htMiddle');
    return td;
  }

  function initTable() {
    const container = document.getElementById('hsdgHotContainer');
    if (!container) return;

    if (hotInstance) {
      hotInstance.destroy();
    }

    hotInstance = new Handsontable(container, {
      data: MOCK_DATA,
      colHeaders: ['#', 'TÊN LOẠI NGÀY CÔNG', 'KÝ HIỆU CÔNG', 'KÝ HIỆU NGÀY', 'GIÁ TRỊ', 'THỨ TỰ', 'NGÀY BẮT ĐẦU', 'NGÀY KẾT THÚC', 'TRẠNG THÁI', 'GHI CHÚ', 'THAO TÁC'],
      columns: [
        { data: 'id', readOnly: true, width: 40, className: 'htCenter' },
        { data: 'ten', width: 200, className: 'htLeft' },
        { data: 'kyHieuCong', width: 120, className: 'htCenter' },
        { data: 'kyHieuNgay', width: 120, className: 'htCenter' },
        { data: 'giaTri', type: 'numeric', numericFormat: { pattern: '0.00' }, width: 80, className: 'htCenter' },
        { data: 'thuTu', type: 'numeric', width: 70, className: 'htCenter' },
        { data: 'ngayBD', width: 110, className: 'htCenter' },
        { data: 'ngayKT', width: 110, className: 'htCenter' },
        { data: 'trangThai', width: 100, className: 'htCenter', renderer: statusRenderer },
        { data: 'ghiChu', width: 120, className: 'htLeft' },
        { data: null, width: 100, readOnly: true, renderer: actionRenderer }
      ],
      stretchH: 'all',
      height: 'auto',
      autoWrapRow: true,
      autoWrapCol: true,
      licenseKey: 'non-commercial-and-evaluation'
    });

    const totalEl = document.getElementById('hsdgTotal');
    if (totalEl) totalEl.textContent = `Tổng cộng: ${MOCK_DATA.length}`;
  }

  window.hsdgRender = function() {
    const searchVal = document.getElementById('hsdgSearch')?.value.toLowerCase() || '';
    const filtered = MOCK_DATA.filter(item => 
      item.ten.toLowerCase().includes(searchVal) || 
      item.kyHieuCong.toLowerCase().includes(searchVal) ||
      item.kyHieuNgay.toLowerCase().includes(searchVal)
    );
    if (hotInstance) {
      hotInstance.loadData(filtered);
      const totalEl = document.getElementById('hsdgTotal');
      if (totalEl) totalEl.textContent = `Tổng cộng: ${filtered.length}`;
    }
  };

  // Listen for page activation
  const originalOnPageActivate = window.onPageActivate;
  window.onPageActivate = function(page) {
    if (typeof originalOnPageActivate === 'function') {
      originalOnPageActivate(page);
    }
    if (page === 'dm-he-so-danh-gia') {
      setTimeout(initTable, 100);
    }
  };

})();
