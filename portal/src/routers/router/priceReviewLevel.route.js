import React from 'react';

const PriceReviewLevel = React.lazy(() => import('pages/PriceReviewLevel/pages/PriceReviewLevelPage'));

const priceReviewLevel = [
  {
    path: '/price-review-level',
    exact: true,
    name: 'Danh sách mức duyệt cho hình thức xuất bán',
    function: 'SL_PRICEREVIEWLEVEL_VIEW',
    component: PriceReviewLevel,
  },
];

export default priceReviewLevel;
