/**
 * Handsontable Shared Configurations
 */
const HOTConfigs = {
    // Cấu hình chung cho bảng dữ liệu
    base: {
        licenseKey: 'non-commercial-and-evaluation',
        rowHeaders: true,
        stretchH: 'all',
        autoWrapRow: true,
        height: 'auto',
        renderAllRows: false,
        viewportRowRenderingOffset: 20
    },

    // Định dạng cột số (Tiền tệ, số lượng)
    columnTypes: {
        currency: {
            type: 'numeric',
            numericFormat: {
                pattern: '0,0',
                culture: 'vi-VN'
            }
        },
        date: {
            type: 'date',
            dateFormat: 'DD/MM/YYYY',
            correctFormat: true
        }
    }
};
