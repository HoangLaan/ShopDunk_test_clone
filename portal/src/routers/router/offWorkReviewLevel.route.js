import React from 'react';

const OffWorkReviewLevel = React.lazy(() => import('pages/OffWorkReviewLevel/pages/OffWorkRLPage'));
const OffWorkReviewLevelDetail = React.lazy(() => import('pages/OffWorkReviewLevel/pages/OffWorkRLDetail'));
const OffWorkReviewLevelEdit = React.lazy(() => import('pages/OffWorkReviewLevel/pages/OffWorkRLEdit'));
const OffWorkReviewLevelAdd = React.lazy(() => import('pages/OffWorkReviewLevel/pages/OffWorkRLAdd'));

const OffWorkReviewLevelRoutes = [
  {
    path: '/off-work-reviewlevel',
    exact: true,
    name: 'Mức duyệt nghỉ phép',
    function: 'HR_OFFWORK_REVIEWLEVEL_VIEW',
    component: OffWorkReviewLevel,
  },
  {
    path: '/off-work-reviewlevel/edit/:id',
    exact: true,
    name: 'Chỉnh sửa',
    function: 'HR_OFFWORK_REVIEWLEVEL_EDIT',
    component: OffWorkReviewLevelEdit,
  },
  {
    path: '/off-work-reviewlevel/detail/:id',
    exact: true,
    name: 'Chi tiết',
    function: 'HR_OFFWORK_REVIEWLEVEL_VIEW',
    component: OffWorkReviewLevelDetail,
  },
  {
    path: '/off-work-reviewlevel/add',
    exact: true,
    name: 'Thêm mới',
    function: 'HR_OFFWORK_REVIEWLEVEL_ADD',
    component: OffWorkReviewLevelAdd,
  },
];

export default OffWorkReviewLevelRoutes;
