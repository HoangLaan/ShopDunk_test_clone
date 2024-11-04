import React from 'react'

const Company = React.lazy(() => import('pages/Company/Company'));
const CompanyAdd = React.lazy(() => import('pages/Company/CompanyAdd'));
const CompanyDetail = React.lazy(() => import('pages/Company/CompanyDetail'));
const CompanyEdit = React.lazy(() => import('pages/Company/CompanyEdit'));

const companyRoute = [
  {
    path: '/company',
    exact: true,
    name: 'Danh sách công ty',
    function: 'AM_COMPANY_VIEW',
    component: Company,
  },
  {
    path: '/company/add',
    exact: true,
    name: 'Thêm mới công ty',
    function: 'AM_COMPANY_ADD',
    component: CompanyAdd,
  },
  {
    path: '/company/detail/:id',
    exact: true,
    name: 'Chi tiết công ty',
    function: 'AM_COMPANY_VIEW',
    component: CompanyDetail,
  },
  {
    path: '/company/edit/:id',
    exact: true,
    name: 'Chỉnh sửa công ty',
    function: 'AM_COMPANY_EDIT',
    component: CompanyEdit,
  },
]

export default companyRoute
