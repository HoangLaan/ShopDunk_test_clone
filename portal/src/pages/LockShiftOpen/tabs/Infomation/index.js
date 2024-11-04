import React, {useCallback, useEffect} from 'react';

import {getListCash} from 'services/lockshift-open.service';
import {useFormContext} from 'react-hook-form';
import LockShiftCash from './section/LockShiftCash';
import LockShiftNote from './section/LockShiftNote';
import LockShiftInfo from './section/LockShiftInfo';
import FormSection from 'components/shared/FormSection/index';

const Information = ({disabled, lockShiftId, onSubmit}) => {
  const methods = useFormContext();
  const {setValue, watch} = methods

  const loadItemDetail = useCallback(async () => {
    const dataCash = await getListCash({lockShiftId});
    setValue("list_shift_cash", dataCash)
  }, []);

  useEffect(() => {
    loadItemDetail();
  }, [loadItemDetail]);

  const detailForm = [
    {
      title: 'Thông tin ca làm việc',
      component: LockShiftInfo,
      lockShiftId: lockShiftId
    },
    {
      title: 'Tiền mặt đầu ca',
      component: LockShiftCash,
      fieldActive: [],
      disabled: disabled,
    },
    {
      title: 'Ghi chú',
      component: LockShiftNote,
      fieldActive: ['note'],
      disabled: disabled,
    },
  ];

  return <FormSection detailForm={detailForm} onSubmit={onSubmit} noSideBar={true} disabled={disabled}/>
};

export default Information;
