import React from 'react';
import { INTEREST_CONTENT_PERMISSION } from 'pages/InterestContent/utils/constants';

const InterestContent = React.lazy(() => import('pages/InterestContent/pages/InterestContent'));
const InterestContentAdd = React.lazy(() => import('pages/InterestContent/pages/InterestContentAdd'));

const interestContentRoute = [
  {
    path: '/interest-content',
    exact: true,
    name: 'Danh sách nội dung quan tâm',
    function: INTEREST_CONTENT_PERMISSION.VIEW,
    component: InterestContent,
  },
  {
    path: '/interest-content/add',
    exact: true,
    name: 'Thêm mới nội dung quan tâm',
    function: INTEREST_CONTENT_PERMISSION.ADD,
    component: InterestContentAdd,
  },
  {
    path: '/interest-content/edit/:interestContentId',
    exact: true,
    name: 'Chỉnh sửa nội dung quan tâm',
    function: INTEREST_CONTENT_PERMISSION.EDIT,
    component: InterestContentAdd,
  },
  {
    path: '/interest-content/detail/:interestContentId',
    exact: true,
    name: 'Chi tiết nội dung quan tâm',
    function: INTEREST_CONTENT_PERMISSION.VIEW,
    component: InterestContentAdd,
  },
];

export default interestContentRoute;
