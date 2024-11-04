import React from 'react';

const ContractPage = React.lazy(() => import('pages/Contract/ContractPage'));
const ContractAddPage = React.lazy(() => import('pages/Contract/ContractAddPage'));

const contract = [
  {
    path: '/contract',
    exact: true,
    name: 'Danh sách hợp đồng',
    function: 'HR_CONTRACT_VIEW',
    component: ContractPage,
  },
  {
    path: '/contract/add',
    exact: true,
    name: 'Thêm mới hợp đồng',
    function: 'HR_CONTRACT_ADD',
    component: ContractAddPage,
  },
  {
    path: '/contract/edit/:contract_id',
    exact: true,
    name: 'Chỉnh sửa hợp đồng',
    function: 'HR_CONTRACT_EDIT',
    component: ContractAddPage,
  },
  {
    path: '/contract/detail/:contract_id',
    exact: true,
    name: 'Chi tiết hợp đồng',
    function: 'HR_CONTRACT_VIEW',
    component: ContractAddPage,
  },
];

export default contract;
