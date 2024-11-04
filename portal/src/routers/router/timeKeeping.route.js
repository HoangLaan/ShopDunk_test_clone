import React from 'react';

const Timekeeping = React.lazy(() => import('pages/TimeKeeping/pages/TimekeepingPage'));

const timeKeeping = [
  {
    path: '/time-keeping',
    exact: true,
    name: 'Chấm công',
    function: 'HR_USER_TIMEKEEPING_VIEW',
    component: Timekeeping,
  },
];

export default timeKeeping;
