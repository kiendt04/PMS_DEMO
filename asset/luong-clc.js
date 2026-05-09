/**
 * luong-clc.js — Tính lương CLC cho nhân viên
 * Giao diện bảng theo yêu cầu người dùng.
 */
(function () {
  'use strict';

  let hotInstance = null;
  const DEPTS = [
    {
      name: 'Phòng A', 
      employees: [
        { name: 'Nguyễn F', code: 'NV001', stk: '123', hsl: 5.2, ki: 0.9, hsClc: 4.346, amount: 11829925, note: '' },
        { name: 'Nguyễn G', code: 'NV002', stk: '124', hsl: 3.0, ki: 1.0, hsClc: 2.776, amount: 7554483, note: '' },
        { name: 'Nguyễn H', code: 'NV003', stk: '125', hsl: 3.0, ki: 0.9, hsClc: 2.507, amount: 6824957, note: '' },
        { name: 'Nguyễn I', code: 'NV004', stk: '124', hsl: 3.0, ki: 0.9, hsClc: 2.507, amount: 6824957, note: '' },
        { name: 'Nguyễn K', code: 'NV005', stk: '125', hsl: 3.0, ki: 0.9, hsClc: 2.559, amount: 6965678, note: '' },
      ]
    },
    {
      name: 'Phòng B',
      employees: [
        { name: 'Nguyễn L', code: 'NV006', stk: '123', hsl: 5.2, ki: 1.0, hsClc: 4.717, amount: 10674695, note: '' },
        { name: 'Nguyễn M', code: 'NV007', stk: '124', hsl: 3.0, ki: 0.9, hsClc: 2.204, amount: 4988367, note: '' },
        { name: 'Nguyễn N', code: 'NV008', stk: '125', hsl: 3.0, ki: 0.9, hsClc: 2.204, amount: 4988367, note: '' },
        { name: 'Nguyễn O', code: 'NV009', stk: '124', hsl: 3.0, ki: 1.0, hsClc: 2.721, amount: 6158478, note: '' },
        { name: 'Nguyễn P', code: 'NV010', stk: '125', hsl: 3.0, ki: 0.7, hsClc: 1.410, amount: 3190092, note: '' },
      ]
    }
  ];

  function initTable() {
    const container = document.getElementById('luongClcHot');
    if (!container) return;

    if (hotInstance) {
      hotInstance.destroy();
    }

    const data = [];
    let globalIndex = 1;

    DEPTS.forEach(dept => {
      // Dept Header Row
      data.push({
        tt: '', 
        name: dept.name, 
        isHeader: true
      });

      dept.employees.forEach(emp => {
        data.push({
          tt: globalIndex++,
          name: emp.name,
          code: emp.code,
          stk: emp.stk,
          hsl: emp.hsl,
          ki: emp.ki,
          hsClc: emp.hsClc,
          amount: emp.amount,
          note: emp.note
        });
      });
    });

    // Total Row
    data.push({
      tt: 'Tổng',
      hsl: 31.4, 
      ki: 9.2, 
      hsClc: 27.75, 
      amount: 69999999,
      isTotal: true
    });

    hotInstance = new Handsontable(container, {
      data: data,
      columns: [
        { data: 'tt', title: 'TT', width: 50, readOnly: true, className: 'htCenter' },
        { data: 'name', title: 'Họ và tên', width: 200 },
        { data: 'code', title: 'Mã nhân viên', width: 120, className: 'htCenter' },
        { data: 'stk', title: 'Số TK', width: 100, className: 'htCenter' },
        { data: 'hsl', title: 'Tổng HSL', type: 'numeric', numericFormat: { pattern: '0,0.000' }, width: 100, className: 'htRight' },
        { data: 'ki', title: 'Ki', type: 'numeric', numericFormat: { pattern: '0,0.0' }, width: 80, className: 'htCenter' },
        { data: 'hsClc', title: 'Hệ số sử dụng CLC', type: 'numeric', numericFormat: { pattern: '0,0.000' }, width: 150, className: 'htRight' },
        { data: 'amount', title: 'Số tiền', type: 'numeric', numericFormat: { pattern: '0,0' }, width: 150, className: 'htRight' },
        { data: 'note', title: 'Ghi chú', width: 150 }
      ],
      rowHeaders: false,
      colHeaders: true,
      height: 'auto',
      stretchH: 'all',
      licenseKey: 'non-commercial-and-evaluation',
      cells: function (row, col) {
        const cellProperties = {};
        const rowData = this.instance.getSourceDataAtRow(row);
        if (rowData && rowData.isHeader) {
          cellProperties.readOnly = true;
          cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            td.style.fontWeight = 'bold';
            td.style.backgroundColor = '#FFD700'; // Gold color like in image
            td.style.color = '#000';
            td.style.textAlign = 'center';
            if (prop !== 'name') td.textContent = '';
          };
        }
        if (rowData && rowData.isTotal) {
          cellProperties.readOnly = true;
          cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            td.style.fontWeight = 'bold';
            td.style.backgroundColor = '#F1F5F9';
          };
        }
        return cellProperties;
      }
    });
  }

  if (!window.onPageActivateRegistry) window.onPageActivateRegistry = {};
  window.onPageActivateRegistry['luong-clc'] = initTable;

})();
