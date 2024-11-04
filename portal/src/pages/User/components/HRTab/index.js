import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import IdentityCard from './IdentityCard';
import NativeVillage from './NativeVillage';
import PermanentAddress from './PermanentAddress';
import Education from './Education';
import Document from './Document';
import PersonalInfo from './PersonalInfo';
import FormSection from 'components/shared/FormSection/index';

export default function HRTab({ disabled }) {
  const methods = useFormContext();

  useEffect(() => {
    methods.register('educations');
    methods.register('documents');
  }, [methods]);

  const detailForm = [
    {
      title: 'Thông tin cá nhân',
      id: 'personal_info',
      component: PersonalInfo,
    },
    {
      title: 'Chứng minh nhân dân/Căn cước công dân/Hộ chiếu',
      id: 'identity_card',
      component: IdentityCard,
      // fieldActive: [
      //   'identity_number',
      //   'identity_date',
      //   'identity_place',
      //   'identity_front_image',
      //   'identity_back_image',
      // ],
    },
    {
      title: 'Quê quán',
      id: 'native_village',
      component: NativeVillage,
      // fieldActive: ['country_id', 'province_id', 'ward_id', 'district_id', 'address'],
    },
    {
      title: 'Địa chỉ thường trú',
      id: 'permanent_address',
      component: PermanentAddress,
      // fieldActive: [
      //   'permanent_country_id',
      //   'permanent_province_id',
      //   'permanent_ward_id',
      //   'permanent_district_id',
      //   'permanent_address',
      // ],
    },
    {
      title: 'Trình độ',
      id: 'education',
      component: Education,
      fieldActive: ['educations'],
    },
    {
      title: 'Hồ sơ nhân sự',
      id: 'document',
      component: Document,
      fieldActive: ['documents'],
    },
  ];

  return <FormSection disabled={disabled} detailForm={detailForm} />;
}
