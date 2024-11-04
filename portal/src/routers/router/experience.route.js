import React from 'react';
import { PERMISSION } from 'pages/Experience/utils/constants';
import ExperienceAdd from '../../pages/Experience/pages/ExperienceAdd';

const Experience = React.lazy(() => import('pages/Experience/pages/Experience'));
const ExperienceEdit = React.lazy(() => import('pages/Experience/pages/ExperienceEdit'));
const ExperienceDetail = React.lazy(() => import('pages/Experience/pages/ExperienceDetail'));

const experienceRoute = [
  {
    path: '/experience',
    exact: true,
    name: 'Danh sách số năm kinh nghiệm',
    function: PERMISSION.VIEW,
    component: Experience,
  },
  {
    path: '/experience/add',
    exact: true,
    name: 'Thêm mới số năm kinh nghiệm',
    function: PERMISSION.ADD,
    component: ExperienceAdd,
  },

  {
    path: '/experience/edit/:id',
    exact: true,
    name: 'Chỉnh sửa số năm Kinh Nghiệm',
    function: PERMISSION.EDIT,
    component: ExperienceEdit,
  },
  {
    path: '/experience/detail/:id',
    exact: true,
    name: 'Chi tiết số năm kinh nghiệm',
    function: PERMISSION.VIEW,
    component: ExperienceDetail,
  },
];

export default experienceRoute;
