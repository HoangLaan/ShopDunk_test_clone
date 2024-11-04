import React from 'react';

const EquipmentGroupAddPage = React.lazy(() => import('pages/EquipmentGroup/EquipmentGroupAddPage'));
const EquipmentGroupPage = React.lazy(() => import('pages/EquipmentGroup/EquipmentGroupPage'));

const EquipmentGroup = [
  {
    path: '/equipment-group',
    exact: true,
    name: 'Danh sách nhóm thiết bị',
    function: 'MD_EQUIPMENTGROUP_VIEW',
    component: EquipmentGroupPage,
  },
  {
    path: '/equipment-group/add',
    exact: true,
    name: 'Thêm nhóm thiết bị',
    function: 'MD_EQUIPMENTGROUP_ADD',
    component: EquipmentGroupAddPage,
  },
  {
    path: '/equipment-group/edit/:equipment_group_id',
    exact: true,
    name: 'Sửa nhóm thiết bị',
    function: 'MD_EQUIPMENTGROUP_EDIT',
    component: EquipmentGroupAddPage,
  },
  {
    path: '/equipment-group/detail/:equipment_group_id',
    exact: true,
    name: 'Xem nhóm thiết bị',
    function: 'MD_EQUIPMENTGROUP_VIEW',
    component: EquipmentGroupAddPage,
  },
];

export default EquipmentGroup;
