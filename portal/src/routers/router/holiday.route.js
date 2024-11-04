import React from 'react';

const holidayMainPage = React.lazy(() => import('pages/Holiday/HolidayPage'));
const holidayAddPage = React.lazy(() => import('pages/Holiday/HolidayAddPage'));

const holiday = [
  {
    path: '/holiday',
    exact: true,
    name: 'Danh sách ngày lễ tết',
    function: 'MD_HOLIDAY_VIEW',
    component: holidayMainPage,
  },
  {
    path: '/holiday/add',
    exact: true,
    name: 'Thêm mới ngày lễ tết',
    function: 'MD_HOLIDAY_ADD',
    component: holidayAddPage,
  },
  {
    path: '/holiday/view/:holiday_id',
    exact: true,
    name: 'Chi tiết ngày lễ tết',
    function: 'MD_HOLIDAY_VIEW',
    component: holidayAddPage,
  },
  {
    path: '/holiday/detail/:holiday_id',
    exact: true,
    name: 'Chi tiết ngày lễ tết',
    function: 'MD_HOLIDAY_EDIT',
    component: holidayAddPage,
  },
  {
    path: '/holiday/edit/:holiday_id',
    exact: true,
    name: 'Chỉnh sửa ngày lễ tết',
    function: 'MD_HOLIDAY_EDIT',
    component: holidayAddPage,
  },
];

export default holiday;
