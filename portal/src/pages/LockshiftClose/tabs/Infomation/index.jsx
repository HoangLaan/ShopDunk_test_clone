import React from 'react';

import LockshiftCash from './section/LockshiftCash';
import LockshiftNote from './section/LockshiftNote';
import LockshiftInfo from './section/LockshiftInfo';

import FormSection from 'components/shared/FormSection/index';

const Information = ({ disabled, lockshiftId, onSubmit }) => {
  const detailForm = [
    {
      title: 'Thông tin ca làm việc',
      id: 'LockshiftInfo',
      component: LockshiftInfo,
      fieldActive: ['lockshift_id', 'shift_leader'],
    },
    {
      title: 'Tiền mặt cuối ca',
      id: 'lockshift-cash',
      component: LockshiftCash,
      fieldActive: [],
      disabled: disabled,
    },
    {
      title: 'Ghi chú',
      id: 'lockshift-note',
      component: LockshiftNote,
      fieldActive: ['note'],
      lockshiftId,
      disabled: disabled,
    },
  ];

  return <FormSection detailForm={detailForm} onSubmit={onSubmit} noSideBar disabled={disabled} />;
};

export default Information;
