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
        // data_leads_code: 'TN0000012',
        full_name: 'Dang Nhat Phi',
        birthday: '07/06/2023',
        gender: 'Nam',
        phone_number: '0321234565',
        email: 'phidn.blackwind@gmail.com',
        zalo_id: 'phizalo',
        facebook_id: 'phifacebook',
        affiliate: 'https://shopdunk.com/321234565',
        source_id: '3',
        presenter_id: '1',
        customer_type_id: '27',
        id_card: '052123456789',
        id_card_date: '06/02/2023',
        id_card_place: 'The Earth',
        career_id: '10',
        customer_company_id: '69',
        is_active: 'Có',
    },
];

const exampleImportDataHeader = {
    // data_leads_code: 'Mã khách hàng tiềm năng',
    full_name: 'Tên khách hàng tiềm năng',
    birthday: 'Ngày sinh',
    gender: 'Giới tính',
    phone_number: 'Số điện thoại',
    email: 'Email',
    zalo_id: 'Zalo ID',
    facebook_id: 'Facebook ID',
    affiliate: 'Affiliate',
    source_id: 'Nguồn khách hàng',
    presenter_id: 'Người giới thiệu',
    customer_type_id: 'Loại khách hàng',
    id_card: 'Số CMND',
    id_card_date: 'Ngày cấp CMND',
    id_card_place: 'Nơi cấp CMND',
    career_id: 'Nghề nghiệp',
    customer_company_id: 'Mã công ty',
    is_active: 'Trạng thái',
};

module.exports = {
    excelHeaderStyle,
    exampleImportData,
    exampleImportDataHeader,
};
