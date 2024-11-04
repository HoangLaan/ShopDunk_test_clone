import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

import { CompanyTypeInfo, CompanyTypeStatus } from './components/CompanyTypeForm';
import { createCompanyType, getDetail, updateCompanyType } from './helpers/call-api';
const CompanyTypeAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { id: company_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      //payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (company_type_id) {
        await updateCompanyType(company_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createCompanyType(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (company_type_id) {
      getDetail(company_type_id).then((value) => {
        methods.reset({
          ...value,
        });
        if (value?.is_system) {
          methods.setValue('disabled', true);
        }
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [company_type_id]);

  const detailForm = [
    {
      title: 'Thông tin',
      id: 'information',
      component: CompanyTypeInfo,
      fieldActive: ['company_type_name'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: CompanyTypeStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled || methods.watch('disabled')} />
    </FormProvider>
  );
};

export default CompanyTypeAdd;
