import React from 'react';

const UserLevelHistory = React.lazy(() => import('pages/UserLevelHistory/ULHistory'));
const UserLevelHistoryAdd = React.lazy(() => import('pages/UserLevelHistory/ULHistoryAdd'));

const userLevelHistory = [
  {
    path: '/user-level-history',
    exact: true,
    name: 'Danh sách lịch sử chuyển cấp',
    function: 'SYS_USERLEVEL_HISTORY_VIEW',
    component: UserLevelHistory,
  },
  {
    path: '/user-level-history/add',
    exact: true,
    name: 'Thêm mới lịch sử chuyển cấp',
    function: 'SYS_USERLEVEL_HISTORY_ADD',
    component: UserLevelHistoryAdd,
  },
  {
    path: '/user-level-history/edit/:id',
    exact: true,
    name: 'Chỉnh sửa lịch sử chuyển cấp',
    function: 'SYS_USERLEVEL_HISTORY_EDIT',
    component: UserLevelHistoryAdd,
  },
  {
    path: '/user-level-history/detail/:id',
    exact: true,
    name: 'Chi tiết lịch sử chuyển cấp',
    function: 'SYS_USERLEVEL_HISTORY_VIEW',
    component: UserLevelHistoryAdd,
  },
];

export default userLevelHistory;
