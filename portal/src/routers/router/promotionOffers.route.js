import PromotionOffersAddPage from 'pages/PromotionOffers/PromotionOffersAddPage';
import PromotionOffersPage from 'pages/PromotionOffers/PromotionOffersPage';
import React from 'react';

const promotionOffersRoute = [
  {
    path: '/promotion-offers',
    exact: true,
    name: 'Danh sách ưu đãi khuyến mại',
    function: 'SM_PROMOTIONOFFER_VIEW',
    component: PromotionOffersPage,
  },
  {
    path: '/promotion-offers/add',
    exact: true,
    name: 'Thêm mới ưu đãi khuyến mại',
    function: 'SM_PROMOTIONOFFER_ADD',
    component: PromotionOffersAddPage,
  },
  {
    path: '/promotion-offers/edit/:promotion_offers_id',
    exact: true,
    name: 'Chỉnh sửa ưu đãi khuyến mại',
    function: 'SM_PROMOTIONOFFER_EDIT',
    component: PromotionOffersAddPage,
  },
  {
    path: '/promotion-offers/detail/:promotion_offers_id',
    exact: true,
    name: 'Chi tiết ưu đãi khuyến mại',
    function: 'SM_PROMOTIONOFFER_VIEW',
    component: PromotionOffersAddPage,
  },
];

export default promotionOffersRoute;
