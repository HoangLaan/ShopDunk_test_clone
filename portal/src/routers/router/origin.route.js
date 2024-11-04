import OriginPage from 'pages/Origin/OriginPage';
import OriginAddPage from 'pages/Origin/OriginAddPage';

const originRoute = [
  {
    path: '/origin',
    exact: true,
    name: 'Danh sách xuất xứ',
    function: 'MD_ORIGIN_VIEW',
    component: OriginPage,
  },

  {
    path: '/origin/add',
    exact: true,
    name: 'Thêm mới xuất xứ',
    function: 'MD_ORIGIN_ADD',
    component: OriginAddPage,
  },
  {
    path: '/origin/edit/:origin_id',
    exact: true,
    name: 'Chỉnh sửa xuất xứ',
    function: 'MD_ORIGIN_EDIT',
    component: OriginAddPage,
  },
  {
    path: '/origin/detail/:origin_id',
    exact: true,
    name: 'Chi tiết xuất xứ',
    function: 'MD_ORIGIN_VIEW',
    component: OriginAddPage,
  },
];

export default originRoute;
