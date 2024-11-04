import React from 'react';

// UserSchedule
const UserSchedule = React.lazy(() => import('pages/UserSchedule/pages/UserSchedulePage'));
const UserScheduleAdd = React.lazy(() => import('pages/UserSchedule/pages/UserScheduleAdd'));
const UserScheduleDetail = React.lazy(() => import('pages/UserSchedule/pages/UserScheduleDetail'));
const UserScheduleEdit = React.lazy(() => import('pages/UserSchedule/pages/UserScheduleEdit'));
//.end #UserSchedule

const userSchedule = [
  // userschedule
  {
    path: '/user-schedule',
    exact: true,
    name: 'Danh sách phân ca làm việc',
    function: 'HR_USER_SCHEDULE',
    component: UserSchedule,
  },
  {
    path: '/user-schedule/add',
    exact: true,
    name: 'Thêm mới phân ca làm việc',
    function: 'HR_USER_SCHEDULE_ADD',
    component: UserScheduleAdd,
  },
  {
    path: '/user-schedule/detail',
    exact: true,
    name: 'Chi tiết phân ca làm việc',
    function: 'HR_USER_SCHEDULE',
    component: UserScheduleDetail,
  },
  {
    path: '/user-schedule/edit',
    exact: true,
    name: 'Chỉnh sửa phân ca làm việc',
    function: 'HR_USER_SCHEDULE_EDIT',
    component: UserScheduleEdit,
  },
  //.end userschedule
];

export default userSchedule;
