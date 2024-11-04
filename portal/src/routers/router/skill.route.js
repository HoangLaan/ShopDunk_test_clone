import React from 'react';

const Skill = React.lazy(() => import('pages/Skill/Skill'));
const SkillAdd = React.lazy(() => import('pages/Skill/SkillAdd'));
const SkillEdit = React.lazy(() => import('pages/Skill/SkillEdit'));
const SkillDetail = React.lazy(() => import('pages/Skill/SkillDetail'));

const skillRoute = [
  {
    path: '/skill',
    exact: true,
    name: 'Danh sách kỹ năng',
    function: 'MD_SKILL_VIEW',
    component: Skill,
  },
  {
    path: '/skill/add',
    exact: true,
    name: 'Thêm mới kỹ năng',
    function: 'MD_SKILL_ADD',
    component: SkillAdd,
  },
  {
    path: '/skill/detail/:id',
    exact: true,
    name: 'Chi tiết kỹ năng',
    function: 'MD_SKILL_VIEW',
    component: SkillDetail,
  },
  {
    path: '/skill/edit/:id',
    exact: true,
    name: 'Chỉnh sửa kỹ năng',
    function: 'MD_SKILL_EDIT',
    component: SkillEdit,
  },
];

export default skillRoute;
