import React from 'react';

const SkillLevel = React.lazy(() => import('pages/SkillLevel/SkillLevel'));
const SkillLevelAdd = React.lazy(() => import('pages/SkillLevel/SkillLevelAdd'));
const SkillLevelEdit = React.lazy(() => import('pages/SkillLevel/SkillLevelEdit'));
const SkillLevelDetail = React.lazy(() => import('pages/SkillLevel/SkillLevelDetail'));

const SkillLevelRoutes = [
  {
    path: '/skill-level',
    exact: true,
    name: 'Danh sách trình độ kỹ năng',
    function: 'HR_SKILLLEVEL_VIEW',
    component: SkillLevel,
  },

  {
    path: '/skill-level/add',
    exact: true,
    name: 'Thêm mới trình độ kỹ năng',
    function: 'HR_SKILLLEVEL_ADD',
    component: SkillLevelAdd,
  },
  {
    path: '/skill-level/edit/:id',
    exact: true,
    name: 'Chỉnh sửa trình độ kỹ năng',
    function: 'HR_SKILLLEVEL_EDIT',
    component: SkillLevelEdit,
  },
  {
    path: '/skill-level/detail/:id',
    exact: true,
    name: 'Chi tiết trình độ kỹ năng',
    function: 'HR_SKILLLEVEL_VIEW',
    component: SkillLevelDetail,
  },
];

export default SkillLevelRoutes;
