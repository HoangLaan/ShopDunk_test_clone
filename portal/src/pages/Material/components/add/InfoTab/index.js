import React from 'react';

import FormSection from 'components/shared/FormSection/index';
import Info from './Info';
import Images from './Images';
import AttributesTable from './AttributesTable';
import Description from './Description';
import DefaultAccount from './DefaulAccount';
import FormStatus from 'components/shared/FormCommon/FormStatus';

export default function InfoTab({ loading, disabled, isEdit }) {
  const detailForm = [
    {
      title: 'Thông tin túi bao bì',
      id: 'information',
      fieldActive: ['material_code', 'material_name', 'material_group_id'],
      component: Info,
      isEdit
    },
    {
      title: 'Ảnh túi bao bì',
      id: 'pictures',
      // fieldActive: ['images'],
      component: Images,
    },
    {
      title: 'Mô tả',
      id: 'description',
      component: Description,
    },
    {
      title: 'Thuộc tính túi bao bì',
      id: 'attributes',
      fieldActive: ['attributes'],
      component: AttributesTable,
    },
    {
      title: 'Tài khoản ngầm định',
      id: 'default_account_list',
      fieldActive: ['default_account_list'],
      component: DefaultAccount,
      disabled: disabled,
    },
    {
      title: 'Trạng thái',
      id: 'status',
      component: FormStatus,
    },
  ];

  return <FormSection loading={loading} disabled={disabled} detailForm={detailForm} />;
}
