import React from 'react';
import { PERMISSION } from 'pages/Experience/utils/constants';
import RelationshipAdd from '../../pages/Relationship/RelationshipAdd';

const Relationship = React.lazy(() => import('pages/Relationship/Relationship'));
const RelationshipEdit = React.lazy(() => import('pages/Relationship/RelationshipEdit'));
const RelationshipDetail = React.lazy(() => import('pages/Relationship/RelationshipDetail'));

const relationshipRoute = [
  {
    path: '/relationship',
    exact: true,
    name: 'Danh sách mối quan hệ',
    function: PERMISSION.VIEW,
    component: Relationship,
  },
  {
    path: '/relationship/add',
    exact: true,
    name: 'Thêm mối quan hệ',
    function: PERMISSION.ADD,
    component: RelationshipAdd,
  },

  {
    path: '/relationship/edit/:id',
    exact: true,
    name: 'Sửa thông tin mối quan hệ',
    function: PERMISSION.EDIT,
    component: RelationshipEdit,
  },
  {
    path: '/relationship/detail/:id',
    exact: true,
    name: 'Xem thông tin quan hệ',
    function: PERMISSION.EDIT,
    component: RelationshipDetail,
  },
];

export default relationshipRoute;
