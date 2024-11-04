import VAT from 'pages/VAT/VAT';
import VATAdd from 'pages/VAT/VATAdd';
import VATDetail from 'pages/VAT/VATDetail';
import VATEdit from 'pages/VAT/VATEdit';

const vatRoute = [
  {
    path: '/vat',
    exact: true,
    name: 'Danh sách VAT',
    function: 'MD_VAT_VIEW',
    component: VAT,
  },

  {
    path: '/vat/add',
    exact: true,
    name: 'Thêm mới VAT',
    function: 'MD_VAT_ADD',
    component: VATAdd,
  },
  {
    path: '/vat/edit/:id',
    exact: true,
    name: 'Chỉnh sửa VAT',
    function: 'MD_VAT_EDIT',
    component: VATEdit,
  },
  {
    path: '/vat/detail/:id',
    exact: true,
    name: 'Chi tiết VAT',
    function: 'MD_VAT_VIEW',
    component: VATDetail,
  },
];

export default vatRoute;
