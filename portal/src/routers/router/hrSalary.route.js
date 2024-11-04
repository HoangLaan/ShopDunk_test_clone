import React from 'react';

const HrSalaryPage = React.lazy(() => import('pages/HrSalary/HrSalary'));
const HrSalaryAddPage = React.lazy(() => import('pages/HrSalary/HrSalaryAddPage'));

const hrSalary = [
  {
    path: '/hr-salary',
    exact: true,
    name: 'Danh sách mức lương',
    function: 'HR_SALARY_VIEW',
    component: HrSalaryPage,
  },
  {
    path: '/hr-salary/add',
    exact: true,
    name: 'Thêm mới mức lương',
    function: 'HR_SALARY_ADD',
    component: HrSalaryAddPage,
  },
  {
    path: '/hr-salary/view/:hr_salary_id',
    exact: true,
    name: 'Chi tiết mức lương',
    function: 'HR_SALARY_VIEW',
    component: HrSalaryAddPage,
  },
  {
    path: '/hr-salary/edit/:hr_salary_id',
    exact: true,
    name: 'Chỉnh sửa mức lương',
    function: 'HR_SALARY_EDIT',
    component: HrSalaryAddPage,
  },
];

export default hrSalary;
