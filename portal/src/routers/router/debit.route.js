import React from 'react';

const Debit = React.lazy(() => import('pages/Debit/DebitPage'));
// const DegreeAdd = React.lazy(() => import('pages/Degree/DegreeAdd'));
// const DegreeEdit = React.lazy(() => import('pages/Degree/DegreeEdit'));
// const DegreeDetail = React.lazy(() => import('pages/Degree/DegreeDetail'));

const debitRoute = [
  {
    path: '/debit',
    exact: true,
    name: 'Danh sách công nợ',
    function: 'MD_DEBIT_VIEW',
    component: Debit,
  },
];

export default debitRoute;
