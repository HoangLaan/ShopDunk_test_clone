import DiscountProgramAddPage from 'pages/DiscountProgram/DiscountProgramAddPage';
import DiscountProgramPage from 'pages/DiscountProgram/DiscountProgramPage';

const discountProgramRoute = [
  {
    path: '/discount-program',
    exact: true,
    name: 'Danh sách chương trình chiết khấu',
    function: 'PO_DISCOUNT_PROGRAM_VIEW',
    component: DiscountProgramPage,
  },
  {
    path: '/discount-program/add',
    exact: true,
    function: 'PO_DISCOUNT_PROGRAM_ADD',
    name: 'Thêm mới chương trình chiết khấu',
    component: DiscountProgramAddPage,
  },
  {
    path: '/discount-program/edit/:discount_program_id',
    exact: true,
    function: 'PO_DISCOUNT_PROGRAM_EDIT',
    name: 'Chỉnh sửa chương trình chiết khấu',
    component: DiscountProgramAddPage,
  },
  {
    path: '/discount-program/detail/:discount_program_id',
    exact: true,
    function: 'PO_DISCOUNT_PROGRAM_VIEW',
    name: 'Chi tiết chương trình chiết khấu',
    component: DiscountProgramAddPage,
  },
];

export default discountProgramRoute;
