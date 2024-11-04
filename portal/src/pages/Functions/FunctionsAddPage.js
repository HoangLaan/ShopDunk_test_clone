import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import FunctionsInformation from './components/add/FunctionsInformation';
import FunctionsStatus from './components/add/FunctionsStatus';
import { createFunction, getDetailFunction, updateFunction } from 'services/function.service';
import { useLocation, useParams } from 'react-router-dom';
const FunctionsAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { function_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (function_id) {
        await updateFunction(function_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createFunction(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra!');
    }
  };

  const loadFunctionDetail = useCallback(() => {
    if (function_id) {
      getDetailFunction(function_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [function_id]);

  useEffect(loadFunctionDetail, [loadFunctionDetail]);

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin quyền',
      component: FunctionsInformation,
      fieldActive: ['function_name', 'function_alias', 'function_group_id'],
    },
    { id: 'status', title: 'Trạng thái', component: FunctionsStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default FunctionsAddPage;
