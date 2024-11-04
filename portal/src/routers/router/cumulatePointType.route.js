import React from 'react';

const CumulatePointTypeAdd = React.lazy(() => import('pages/CumulatePointType/pages/CumulatePointTypeAdd'));
const CumulatePointTypePage = React.lazy(() => import('pages/CumulatePointType/pages/CumulatePointTypePage'));

const cumulatePointType = [
  {
    path: '/cumulate-point-type',
    exact: true,
    name: 'Danh sách tích điểm',
    function: 'PT_ACCUMULATEPOINTTYPE_VIEW',
    component: CumulatePointTypePage,
  },
  {
    path: '/cumulate-point-type/add',
    exact: true,
    name: 'Thiết lập tích điểm',
    function: 'PT_ACCUMULATEPOINTTYPE_ADD',
    component: CumulatePointTypeAdd,
  },
  {
    path: '/cumulate-point-type/edit/:ac_point_id',
    exact: true,
    name: 'Chỉnh sửa thiết lập tích điểm',
    function: 'PT_ACCUMULATEPOINTTYPE_EDIT',
    component: CumulatePointTypeAdd,
  },
  {
    path: '/cumulate-point-type/detail/:ac_point_id',
    exact: true,
    name: 'Chi tiết thiết lập tích điểm ',
    function: 'PT_ACCUMULATEPOINTTYPE_VIEW',
    component: CumulatePointTypeAdd,
  },
];

export default cumulatePointType;
