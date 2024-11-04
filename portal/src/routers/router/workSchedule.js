import React from 'react';

const ListPage = React.lazy(() => import('pages/WorkSchedule/pages/ListPage'));
const AddPage = React.lazy(() => import('pages/WorkSchedule/pages/AddPage'));
const EditPage = React.lazy(() => import('pages/WorkSchedule/pages/EditPage'));
const DetailPage = React.lazy(() => import('pages/WorkSchedule/pages/DetailPage'));

const WorkScheduleRoutes = [
  {
    path: '/work-schedule',
    exact: true,
    name: 'Danh sách lịch công tác',
    function: 'HR_WORKSCHEDULE_VIEW',
    component: ListPage,
  },
  {
    path: '/work-schedule/add',
    exact: true,
    name: 'Đăng ký lịch công tác',
    function: 'HR_WORKSCHEDULE_ADD',
    component: AddPage,
  },
  {
    path: '/work-schedule/edit/:id',
    exact: true,
    name: 'Chỉnh sửa lịch công tác',
    function: 'HR_WORKSCHEDULE_EDIT',
    component: EditPage,
  },
  {
    path: '/work-schedule/detail/:id',
    exact: true,
    name: 'Chi tiết lịch công tác',
    function: 'HR_WORKSCHEDULE_VIEW',
    component: DetailPage,
  },
];
export default WorkScheduleRoutes;
