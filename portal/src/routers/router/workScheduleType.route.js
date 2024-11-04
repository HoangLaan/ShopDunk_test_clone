import React from 'react';

const WorkScheduleTypeAddPage = React.lazy(() => import('pages/WorkScheduleType/WorkScheduleTypeAddPage'));
const WorkScheduleTypePage = React.lazy(() => import('pages/WorkScheduleType/WorkScheduleTypePage'));

const prefix = '/work-schedule-type';
const WorkScheduleType = [
  {
    path: prefix,
    exact: true,
    name: 'Danh sách loại lịch công tác',
    function: 'HR_WORKSCHEDULE_VIEW',
    component: WorkScheduleTypePage,
  },
  {
    path: `${prefix}/add`,
    exact: true,
    name: 'Thêm mới loại lịch công tác',
    function: 'HR_WORKSCHEDULE_ADD',
    component: WorkScheduleTypeAddPage,
  },
  {
    path: `${prefix}/edit/:id`,
    exact: true,
    name: 'Chỉnh sửa loại lịch công tác',
    function: 'HR_WORKSCHEDULE_EDIT',
    component: WorkScheduleTypeAddPage,
  },
  {
    path: `${prefix}/detail/:id`,
    exact: true,
    name: 'Chi tiết loại lịch công tác',
    function: 'HR_WORKSCHEDULE_VIEW',
    component: WorkScheduleTypeAddPage,
  },
];

export default WorkScheduleType;
