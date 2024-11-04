const propertys = [
    {
        value: 1,
        label: 'Dư nợ',
    },
    {
        value: 2,
        label: 'Dư có',
    },
    {
        value: 3,
        label: 'Lưỡng tính',
    },
];
const columns = {
    accounting_account_name: 'Tên tài khoản *',
    accounting_account_code: 'Mã tài khoản *',
    property: 'Tính chất *',
    description: 'Diễn giải',
    company: 'Công ty áp dụng *',
    is_active: 'Kích hoạt*',
};
module.exports = {
    propertys,
    columns,
};
