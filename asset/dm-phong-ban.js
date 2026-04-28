/**
 * dm-phong-ban.js — Danh mục phòng ban với Handsontable
 */
(function () {
  'use strict';

  /* ── Mock data ── */
  const DEPARTMENTS = [
    { stt: 1, name: 'Phòng Tổng hợp HĐTV',  short: 'TH-HĐTV', desc: 'Tham mưu cho Hội đồng thành viên', note: '' },
    { stt: 2, name: 'Phòng Kiểm toán nội bộ', short: 'KTNB',    desc: 'Kiểm tra, giám sát hoạt động', note: '' },
    { stt: 3, name: 'Ban TGĐ',               short: 'Ban TGĐ', desc: 'Ban điều hành hệ thống', note: '' },
    { stt: 4, name: 'Phòng Pháp chế',         short: 'PC',      desc: 'Phụ trách các vấn đề pháp lý', note: '' },
    { stt: 5, name: 'Phòng Kinh doanh',       short: 'KD',      desc: 'Khai thác khách hàng và thị trường', note: '' },
    { stt: 6, name: 'Phòng Kỹ thuật',        short: 'KT',      desc: 'Quản lý hạ tầng kỹ thuật', note: '' },
    { stt: 7, name: 'Phòng Kế hoạch tổng hợp', short: 'KHTH',    desc: 'Lập kế hoạch và báo cáo tổng hợp', note: '' },
    { stt: 8, name: 'Phòng Tổ chức nhân sự',  short: 'TCNS',    desc: 'Quản lý nhân lực và tuyển dụng', note: '' },
    { stt: 9, name: 'Phòng Kế toán tài chính', short: 'KTTC',    desc: 'Quản lý tài chính kế toán', note: '' },
  ];

  let hotInstance = null;
  let _initializing = false;

  /* ── Build data ── */
  function buildData() {
    return DEPARTMENTS.map(d => [d.stt, d.name, d.short, d.desc, d.note]);
  }

  /* ── Build headers ── */
  function buildHeaders() {
    return ['STT', 'Tên phòng ban', 'Tên viết tắt', 'Mô tả', 'Ghi chú'];
  }

  /* ── Build cols ── */
  function buildCols() {
    const C = 'htCenter htMiddle';
    const L = 'htLeft   htMiddle';
    return [
      { data: 0, readOnly: true, type: 'numeric', width: 45,  className: C },
      { data: 1, readOnly: true, type: 'text',    width: 250, className: L },
      { data: 2, readOnly: true, type: 'text',    width: 120, className: C },
      { data: 3, readOnly: true, type: 'text',    width: 300, className: L },
      { data: 4, readOnly: true, type: 'text',    width: 150, className: L },
    ];
  }

  /* ── initHot ── */
  function initHot() {
    if (_initializing) return;
    _initializing = true;

    const container = document.getElementById('pbHotContainer');
    if (!container || typeof Handsontable === 'undefined') { _initializing = false; return; }

    const data    = buildData();
    const headers = buildHeaders();
    const cols    = buildCols();

    if (hotInstance) { hotInstance.destroy(); hotInstance = null; }
    container.style.height = 'auto';

    hotInstance = new Handsontable(container, {
      data,
      colHeaders:        headers,
      columns:           cols,
      rowHeaders:        false,
      height:            'auto',
      width:             '100%',
      stretchH:          'all',
      autoColumnSize:    false,
      renderAllRows:      true,
      licenseKey:        'non-commercial-and-evaluation',
      rowHeights:        28,
      columnHeaderHeight: 32,

      cells(row, col) {
        const props = {};
        const classes = [];
        if (row % 2 === 0) classes.push('pb-even-row');
        if (col === 1 || col === 3 || col === 4) classes.push('htLeft');
        else classes.push('htCenter');
        classes.push('htMiddle');
        if (classes.length) props.className = classes.join(' ');
        return props;
      },

      afterGetColHeader(col, th) {
        th.style.verticalAlign = 'middle';
      },

      afterRender() {
        const total = DEPARTMENTS.length;
        const totalEl = document.getElementById('pbTotalPill');
        if (totalEl) totalEl.textContent = `Tổng cộng: ${total} phòng ban`;
        setTimeout(() => { _initializing = false; }, 400);
      },
    });
  }

  function refresh() { initHot(); }

  /* ── Init ── */
  function init() {
    setTimeout(refresh, 150);

    let _t = null;
    const _cb = () => {
      if (_initializing) return;
      const page = document.querySelector('.page-section.active');
      if (page?.id === 'page-dm-phong-ban') { clearTimeout(_t); _t = setTimeout(refresh, 300); }
    };
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(_cb);
      const el = document.querySelector('.main') || document.getElementById('pbHotContainer');
      if (el) ro.observe(el);
    } else { window.addEventListener('resize', _cb); }
  }

  const _orig = window.onPageActivate;
  window.onPageActivate = function (page) {
    if (typeof _orig === 'function') _orig(page);
    if (page === 'dm-phong-ban') setTimeout(refresh, 50);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 200);
})();
