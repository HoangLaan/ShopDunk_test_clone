/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
// Compnents
import InfoStaff from './InfoStaff';
import Address from './Address';
import UserGroup from './UserGroup';
import BankUser from './BankUser';
import WorkInfo from './WorkInfo';

import Status from './Status';
import FormSection from 'components/shared/FormSection/index';

export default function InfoTab({ disabled = true }) {
  const methods = useFormContext();

  useEffect(() => {
    methods.register('user_groups', {
      required: 'Nhóm người dùng là bắt buộc.',
    });
  }, [methods]);

  const detailForm = [
    {
      title: 'Thông tin nhân viên',
      id: 'info',
      component: InfoStaff,
      fieldActive: [
        'first_name',
        'last_name',
        'department_id',
        'birthday',
        'level_id',
        'phone_number',
        'email',
        'position_id',
        'hard_salary',
        'entry_date',
      ],
    },
    {
      title: 'Nơi ở hiện tại',
      id: 'currentAddress',
      component: Address,
      fieldActive: [
        'current_country_id',
        'current_province_id',
        'current_ward_id',
        'current_district_id',
        'current_address',
      ],
    },
    {
      title: 'Thông tin làm việc',
      id: 'workInfor',
      component: WorkInfo,
      fieldActive: ['entry_date'],
    },
    {
      title: 'Tài khoản ngân hàng',
      id: 'bankUser',
      component: BankUser,
      fieldActive: ['bank_users'],
    },
    {
      title: 'Phân quyền',
      id: 'userGroup',
      component: UserGroup,
      fieldActive: ['user_groups'],
    },
    {
      title: 'Trạng thái',
      id: 'status',
      component: Status,
      fieldActive: ['is_active', 'is_time_keeping'],
    },
  ];

  return <FormSection disabled={disabled} detailForm={detailForm} />;
}
