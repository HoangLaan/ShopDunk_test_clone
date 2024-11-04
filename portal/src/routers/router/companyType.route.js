import React from 'react';

const CompanyType = React.lazy(() => import('pages/CompanyType/CompanyType'));
const CompanyTypeAdd = React.lazy(() => import('pages/CompanyType/CompanyTypeAdd'));
const CompanyTypeEdit = React.lazy(() => import('pages/CompanyType/CompanyTypeEdit'));
const CompanyTypeDetail = React.lazy(() => import('pages/CompanyType/CompanyTypeDetail'));

const companyTypeRoute = [
  {
    path: '/company-type',
    exact: true,
    name: 'Danh sách loại công ty',
    function: 'MD_COMPANY_TYPE_VIEW',
    component: CompanyType,
  },

  {
    path: '/company-type/add',
    exact: true,
    name: 'Thêm mới loại công ty',
    function: 'MD_COMPANY_TYPE_ADD',
    component: CompanyTypeAdd,
  },
  {
    path: '/company-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại công ty',
    function: 'MD_COMPANY_TYPE_EDIT',
    component: CompanyTypeEdit,
  },
  {
    path: '/company-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại công ty',
    function: 'MD_COMPANY_TYPE_VIEW',
    component: CompanyTypeDetail,
  },
];

export default companyTypeRoute;
