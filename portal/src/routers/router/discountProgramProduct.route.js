import React from 'react';

const DiscountProgramProductPage = React.lazy(() => import('pages/DiscountProgramProduct/DiscountProgramProductPage'));

const prefix = '/discount-program-product';
const DiscountProgramProduct = [
  {
    path: prefix,
    exact: true,
    name: 'Bảng theo dõi thưởng/chiết khấu',
    function: 'PO_DISCOUNTPROGRAMPRODUCT_APPLY_VIEW',
    component: DiscountProgramProductPage,
  },
];

export default DiscountProgramProduct;
