import React from 'react';

const PublicDiaryPage = React.lazy(() => import('pages/PublicDiary/PublicDiaryPage'));
const path = '/public-diary';
const routers = [
  {
    path: `${path}`,
    exact: true,
    name: 'Danh sách quản lý sổ nhật kí chung',
    function: 'AC_GENERALJOURNAL_VIEW',
    component: PublicDiaryPage,
  },
];

export default routers;
