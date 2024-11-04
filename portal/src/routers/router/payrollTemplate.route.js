import React from 'react';
const PayrollTemplatePage = React.lazy(() => import('pages/PayrollTemplate/PayrollTemplatePage'));
const PayrollTemplateAddPage = React.lazy(() => import('pages/PayrollTemplate/PayrollTemplateAddPage'));

const payrollTemplateRoutes = [
  {
    path: '/payroll-template',
    exact: true,
    name: 'Danh sách mẫu bảng lương',
    function: 'SA_PAYROLLTEMPLATE_VIEW',
    component: PayrollTemplatePage,
  },
  {
    path: '/payroll-template/add',
    exact: true,
    name: 'Thêm mẫu bảng lương',
    function: 'SA_PAYROLLTEMPLATE_ADD',
    component: PayrollTemplateAddPage,
  },
  {
    path: '/payroll-template/edit/:id',
    exact: true,
    name: 'Chỉnh sửa mẫu bảng lương',
    function: 'SA_PAYROLLTEMPLATE_EDIT',
    component: PayrollTemplateAddPage,
  },
  {
    path: '/payroll-template/detail/:id',
    exact: true,
    name: 'Chi tiết mẫu bảng lương',
    function: 'SA_PAYROLLTEMPLATE_VIEW',
    component: PayrollTemplateAddPage,
  },
];

export default payrollTemplateRoutes;
