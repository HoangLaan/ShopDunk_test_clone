import React, { useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import Products from './Products';
// import Cost from './Cost';

function ProductImport({ disabled, locationPurchaseOrder }) {
  const [tabActive, setTabActive] = useState('bw_cate');
  return (
    <React.Fragment>
      <BWAccordion title='Sản phẩm nhập kho' id='bw_account_cus' isRequired>
        {/* <ul className='bw_tabs'>
          <li className={tabActive === 'bw_cate' ? 'bw_active' : ''}>
            <a
              data-href='#bw_cate'
              className='bw_link'
              style={{ color: tabActive === 'bw_pay' ? '#333333' : '' }}
              onClick={() => setTabActive('bw_cate')}>
              Danh sách hàng hóa
            </a>
          </li>
          <li className={tabActive === 'bw_pay' ? 'bw_active' : ''}>
            <a
              data-href='#bw_pay'
              className='bw_link'
              style={{ color: tabActive === 'bw_cate' ? '#333333' : '' }}
              onClick={() => setTabActive('bw_pay')}>
              Chi phí
            </a>
          </li>
        </ul> */}
        <Products disabled={disabled} setTabActive={setTabActive} autoGenImeiDisable={locationPurchaseOrder?.purchase ? true : false} />
        {/* {tabActive === 'bw_cate' ? (
          <Products disabled={disabled} setTabActive={setTabActive} />
        ) : (
          <Cost disabled={disabled} />
        )} */}
      </BWAccordion>
    </React.Fragment>
  );
}

export default ProductImport;
