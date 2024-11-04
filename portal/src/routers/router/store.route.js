import StoreAdd from 'pages/Store/StoreAdd';
import StoreDetail from 'pages/Store/StoreDetail';
import StoreEdit from 'pages/Store/StoreEdit';
import StorePage from 'pages/Store/StorePage';
import { PERMISSION_STORE } from 'pages/Store/helpers/constants';

const store = [
  {
    path: '/store',
    exact: true,
    name: 'Danh sách cửa hàng',
    function: PERMISSION_STORE.VIEW,
    component: StorePage,
  },
  {
    path: '/store/add',
    exact: true,
    name: 'Thêm mới cửa hàng',
    function: PERMISSION_STORE.ADD,
    component: StoreAdd,
  },
  {
    path: '/store/detail/:id',
    exact: true,
    name: 'Chi tiết cửa hàng',
    function: PERMISSION_STORE.VIEW,
    component: StoreDetail,
  },
  {
    path: '/store/edit/:id',
    exact: true,
    name: 'Chỉnh sửa cửa hàng',
    function: PERMISSION_STORE.EDIT,
    component: StoreEdit,
  },
];

export default store;
