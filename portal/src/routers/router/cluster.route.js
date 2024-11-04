import React from 'react';

const ClusterAddPage = React.lazy(() => import('pages/Cluster/ClusterAddPage'));
const ClusterPage = React.lazy(() => import('pages/Cluster/ClusterPage'));

const cluster = [
  {
    path: '/cluster',
    exact: true,
    name: 'Danh sách cụm',
    function: 'MD_CLUSTER_VIEW',
    component: ClusterPage,
  },
  {
    path: '/cluster/add',
    exact: true,
    name: 'Thêm mới cụm',
    function: 'MD_CLUSTER_ADD',
    component: ClusterAddPage,
  },
  {
    path: '/cluster/edit/:cluster_id',
    exact: true,
    name: 'Chỉnh sửa cụm',
    function: 'MD_CLUSTER_EDIT',
    component: ClusterAddPage,
  },
  {
    path: '/cluster/detail/:cluster_id',
    exact: true,
    name: 'Chi tiết cụm',
    function: 'MD_CLUSTER_VIEW',
    component: ClusterAddPage,
  },
];

export default cluster;
