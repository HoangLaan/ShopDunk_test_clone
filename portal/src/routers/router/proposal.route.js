import React from 'react';

const ProposalAdd = React.lazy(() => import('pages/Proposal/pages/ProposalAdd'));
const ProposalPage = React.lazy(() => import('pages/Proposal/pages/ProposalPage'));

const proposal = [
  {
    path: '/proposal',
    exact: true,
    name: 'Danh sách đề xuất',
    function: 'HR_PROPOSAL_VIEW',
    component: ProposalPage,
  },
  {
    path: '/proposal/add',
    exact: true,
    name: 'Thêm mới đề xuất',
    function: 'HR_PROPOSAL_ADD',
    component: ProposalAdd,
  },
  {
    path: '/proposal/review/:proposal_id',
    exact: true,
    name: 'Duyệt đề xuất',
    function: 'HR_PROPOSAL_REVIEW',
    component: ProposalAdd,
  },
  {
    path: '/proposal/edit/:proposal_id',
    exact: true,
    name: 'Chỉnh sửa đề xuất',
    function: 'HR_PROPOSAL_EDIT',
    component: ProposalAdd,
  },
  {
    path: '/proposal/detail/:proposal_id',
    exact: true,
    name: 'Chi tiết đề xuất',
    function: 'HR_PROPOSAL_VIEW',
    component: ProposalAdd,
  },
];

export default proposal;
