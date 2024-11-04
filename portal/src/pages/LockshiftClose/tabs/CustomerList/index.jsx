import React, { useCallback, useEffect } from 'react';

import { getListLockshiftCustomers } from 'services/lockshift-close.service';
import { useFormContext } from 'react-hook-form';
import LockshiftCustomers from './section/LockshiftCustomers';

import FormSection from 'components/shared/FormSection/index';
import { showToast } from 'utils/helpers';

const CustomerList = ({ disabled, lockshiftId, onSubmit }) => {
  const methods = useFormContext();

  useEffect(() => {
    getListLockshiftCustomers(lockshiftId)
      .then((data) => {
        methods.setValue('customer_list', data);
      })
      .catch((err) => {
        showToast.error(err?.message || 'Load thông tin khách hàng thất bại!');
      });
  }, [lockshiftId]);

  const detailForm = [
    {
      title: 'Danh sách khách hàng',
      id: 'lockshift-customers',
      component: LockshiftCustomers,
      fieldActive: [],
      disabled: disabled,
    },
  ];

  return <FormSection detailForm={detailForm} onSubmit={onSubmit} noSideBar disabled={disabled} />;
};

export default CustomerList;
