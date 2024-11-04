const _ = require('lodash');

const excelHeaderStyle = {
    font: {
        bold: true,
        color: '#FFFFFF',
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#0b2447',
    },
};

const exampleImportData = [
    {
        company_id: 1,
        bank_number: '19133187562563',
        bank_id: '3 - Ngân hàng TMCP Sài Gòn Thương tín',
        province_id: '66 - Thành phố Hà Nội',
        bank_branch: 'Cao Bang',
        branch_address: 'CB 123',
        bank_username: 'BW 123',
        description: 'Mo ta tai khoan ngan hang',
        bank_name: 'Ngân hàng ACB',
        is_active: 'Có',
    },
];

const exampleImportDataHeader = {
    company_id: 'Công ty *',
    bank_number: 'Sô tài khoản *',
    bank_id: 'Ngân hàng *',
    province_id: 'Tỉnh/Thành phố',
    bank_branch: 'Chi nhánh',
    branch_address: 'Địa chỉ chin hánh',
    bank_username: 'Chủ tài khoản *',
    description: 'Mô tả',
    is_active: 'Kích hoạt *',
};

const transformDataHeader = _.invert(exampleImportDataHeader);

const exampleConfig = {
    bank_number: {
        title: 'Sô tài khoản *',
        width: 20,
    },
    bank_id: {
        title: 'Ngân hàng *',
        width: 20,
    },
    bank_branch: {
        title: 'Chi nhánh',
        width: 20,
    },
    branch_address: {
        title: 'Địa chỉ chin hánh',
        width: 20,
    },
    bank_username: {
        title: 'Chủ tài khoản *',
        width: 20,
    },
    description: {
        title: 'Mô tả',
        width: 20,
    },
    is_active: {
        title: 'Kích hoạt *',
        width: 20,
    },
};

module.exports = {
    excelHeaderStyle,
    exampleImportData,
    exampleImportDataHeader,
    transformDataHeader,
    exampleConfig,
};
