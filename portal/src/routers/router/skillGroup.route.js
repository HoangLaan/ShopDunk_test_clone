import React from 'react';

const SkillGroup = React.lazy(() => import('pages/SkillGroup/SkillGroup'));
const SkillGroupAdd = React.lazy(() => import('pages/SkillGroup/SkillGroupAdd'));
const SkillGroupEdit = React.lazy(() => import('pages/SkillGroup/SkillGroupEdit'));
const SkillGroupDetail = React.lazy(() => import('pages/SkillGroup/SkillGroupDetail'));

const skillGroup = [
  {
    path: '/skill-group',
    exact: true,
    name: 'Danh sách nhóm kỹ năng',
    function: 'HR_SKILLGROUP_VIEW',
    component: SkillGroup,
  },
  {
    path: '/skill-group/add',
    exact: true,
    name: 'Thêm mới nhóm kỹ năng',
    function: 'HR_SKILLGROUP_ADD',
    component: SkillGroupAdd,
  },
  {
    path: '/skill-group/detail/:id',
    exact: true,
    name: 'Chi tiết nhóm kỹ năng',
    function: 'HR_SKILLGROUP_VIEW',
    component: SkillGroupDetail,
  },
  {
    path: '/skill-group/edit/:id',
    exact: true,
    name: 'Chỉnh sửa nhóm kỹ năng',
    function: 'HR_SKILLGROUP_EDIT',
    component: SkillGroupEdit,
  },
];

export default skillGroup;
