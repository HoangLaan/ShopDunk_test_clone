import React from 'react';

const OutputType = React.lazy(() => import('pages/OutputType/pages/OutputTypePage'));
const OutputTypeAdd = React.lazy(() => import('pages/OutputType/pages/OutputTypeAdd'));
const OutputTypeDetail = React.lazy(() => import('pages/OutputType/pages/OutputTypeDetail'));
const OutputTypeEdit = React.lazy(() => import('pages/OutputType/pages/OutputTypeEdit'));

const outputType = [
  {
    path: '/output-type',
    exact: true,
    name: 'Danh sách hình thức xuất bán',
    function: 'SL_OUTPUTTYPE_VIEW',
    component: OutputType,
  },
  {
    path: '/output-type/add',
    exact: true,
    name: 'Thêm mới hình thức xuất bán',
    function: 'SL_OUTPUTTYPE_ADD',
    component: OutputTypeAdd,
  },
  {
    path: '/output-type/detail/:id',
    exact: true,
    name: 'Chi tiết hình thức xuất bán',
    function: 'SL_OUTPUTTYPE_VIEW',
    component: OutputTypeDetail,
  },
  {
    path: '/output-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa hình thức xuất bán',
    function: 'SL_OUTPUTTYPE_EDIT',
    component: OutputTypeEdit,
  },
];

export default outputType;
