import React from 'react';
import styled from 'styled-components';

import BWAccordion from 'components/shared/BWAccordion/index';

// display: flex;
// flex-wrap: wrap;
const CustomStyle = styled.ul`

  li {
    width: 100%;
    padding: 4px 0;
  }
`;

function CustomerInformation({ customerInformation }) {
  return (
    // <React.Fragment>
      // <BWAccordion title={'Thông tin khách hàng'}>
      <div>
        {/* <h2 style={{fontWeight: 'bold', fontSize: '20px'}}>Thông tin khách hàng</h2> */}
        <div className='bw_frm_box'>
          <CustomStyle>
            <li>Loại khách hàng: {customerInformation.customer_type_name}</li>
            <li>Ngày sinh: {customerInformation.birthday || ' Chưa có thông tin'}</li>
            <li>Số điện thoại: {customerInformation.phone_number}</li>
            <li>Email: {customerInformation.email || ' Chưa có thông tin'}</li>
            <li>Giới tính: {customerInformation.gender ? 'Nam' : 'Nữ'}</li>
            {/* <li>Sở thích: {customerInformation.hobbies || ' Chưa có thông tin'}</li> */}
            <li>Địa chỉ: {customerInformation.address || ' Chưa có thông tin'}</li>
          </CustomStyle>
        </div>
      </ div>
  );
}

export default CustomerInformation;
