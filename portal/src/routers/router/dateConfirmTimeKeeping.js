import React from 'react';

const DateCofirmTimeKeepingMainPage = React.lazy(() => import('pages/DateCofirmTimeKeeping/DateCofirmTimeKeepingPage'));
const DateCofirmTimeKeepingAddPage = React.lazy(() =>
  import('pages/DateCofirmTimeKeeping/DateConfirmTimeKeepingAddPage'),
);

const dateCofirmTimeKeepingRoute = [
  {
    path: '/date-confirm-time-keeping',
    exact: true,
    name: 'Danh sách ngày khóa xác nhận công',
    function: 'MD_TIMEKEEPINGCONFIRMDATE_VIEW',
    component: DateCofirmTimeKeepingMainPage,
  },
  {
    path: '/date-confirm-time-keeping/add',
    exact: true,
    name: 'Thêm mới ngày khóa xác nhận công',
    function: 'MD_TIMEKEEPINGCONFIRMDATE_ADD',
    component: DateCofirmTimeKeepingAddPage,
  },
  {
    path: '/date-confirm-time-keeping/view/:time_keeping_confirm_date_id',
    exact: true,
    name: 'Chi tiết ngày khóa xác nhận công',
    function: 'MD_TIMEKEEPINGCONFIRMDATE_VIEW',
    component: DateCofirmTimeKeepingAddPage,
  },
  {
    path: '/date-confirm-time-keeping/detail/:time_keeping_confirm_date_id',
    exact: true,
    name: 'Chi tiết ngày khóa xác nhận công',
    function: 'MD_TIMEKEEPINGCONFIRMDATE_EDIT',
    component: DateCofirmTimeKeepingAddPage,
  },
  {
    path: '/date-confirm-time-keeping/edit/:time_keeping_confirm_date_id',
    exact: true,
    name: 'Chỉnh sửa ngày khóa xác nhận công',
    function: 'MD_TIMEKEEPINGCONFIRMDATE_EDIT',
    component: DateCofirmTimeKeepingAddPage,
  },
];

export default dateCofirmTimeKeepingRoute;
