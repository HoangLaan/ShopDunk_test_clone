import React from 'react'

const RegimePage = React.lazy(() => import('pages/Regime/pages/RegimePage'));
const RegimeAdd = React.lazy(() => import('pages/Regime/pages/RegimeAdd'));
const RegimeEdit = React.lazy(() => import('pages/Regime/pages/RegimeEdit'));
const RegimeDetail = React.lazy(() => import('pages/Regime/pages/RegimeDetail'));

const RegimeRoutes = [
  {
    path: '/regime',
    exact: true,
    name: 'Danh sách đăng ký hưởng chế độ',
    function: 'HR_REGIME_VIEW',
    component: RegimePage,
  },
  {
    path: '/regime/add',
    exact: true,
    name: 'Đăng ký hưởng chế độ',
    function: 'HR_REGIME_ADD',
    component: RegimeAdd,
  },
  {
    path: '/regime/edit/:id',
    exact: true,
    name: 'Sửa đăng ký hưởng chế độ',
    function: 'HR_REGIME_EDIT',
    component: RegimeEdit,
  },
  {
    path: '/regime/detail/:id',
    exact: true,
    name: 'Xem đăng ký hưởng chế độ',
    function: 'HR_REGIME_VIEW',
    component: RegimeDetail,
  },

]
export default RegimeRoutes;
