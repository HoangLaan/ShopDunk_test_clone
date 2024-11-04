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
      full_name: 'Dang Nhat Phi',
      birth_day: '01/01/2000',
      gender: 'Nam',
      phone_number: '0321234565',
      email: 'phidn.blackwind@gmail.com',
      password: 'SDxinchao123',
      zalo_id: 'phizalo',
      facebook_id: 'phifacebook',
      affiliate: 'https://shopdunk.com/321234565',
      source_id: '3',
      presenter_id: '1',
      customer_type_id: '27',
      id_card: '052123456789',
      id_card_date: '06/02/2023',
      id_card_place: 'Hà Nội',
      career_id: '10',
      is_active: 'Có',
  },
];

const exampleImportDataHeader = {
  full_name: { title: 'Tên khách hàng *' },
  birth_day: { title: 'Ngày sinh' },
  gender: { title: 'Giới tính' },
  phone_number: { title: 'Số điện thoại *' },
  email: { title: 'Email' },
  password: { title: 'Mật khẩu' },
  zalo_id: { title: 'Zalo ID' },
  facebook_id: { title: 'Facebook ID' },
  affiliate: { title: 'Affiliate' },
  source_id: { title: 'Nguồn khách hàng' },
  presenter_id: { title: 'Người giới thiệu' },
  customer_type_id: { title: 'Hạng khách hàng' },
  id_card: { title: 'Số CMND' },
  id_card_date: { title: 'Ngày cấp CMND' },
  id_card_place: { title: 'Nơi cấp CMND' },
  career_id: { title: 'Nghề nghiệp' },
  is_active: { title: 'Trạng thái' },
};

module.exports = {
  excelHeaderStyle,
  exampleImportData,
  exampleImportDataHeader,
};
