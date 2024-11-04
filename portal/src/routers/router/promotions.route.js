import PromotionsPage from 'pages/Promotions/PromotionsPage';
import PromotionsAddPage from 'pages/Promotions/PromotionsAddPage';

const promotionRoute = [
  {
    path: '/promotions',
    exact: true,
    name: 'Danh sách chương trình khuyến mại',
    function: 'PROMOTION_VIEW',
    component: PromotionsPage,
  },
  {
    path: '/promotions/add',
    exact: true,
    name: 'Thêm mới chương trình khuyến mại',
    function: 'PROMOTION_ADD',
    component: PromotionsAddPage,
  },
  {
    path: '/promotions/edit/:promotion_id',
    exact: true,
    name: 'Chỉnh sửa chương trình khuyến mại',
    function: 'PROMOTION_EDIT',
    component: PromotionsAddPage,
  },
  {
    path: '/promotions/detail/:promotion_id',
    exact: true,
    name: 'Chi tiết chương trình khuyến mại',
    function: 'PROMOTION_VIEW',
    component: PromotionsAddPage,
  },
];

export default promotionRoute;
