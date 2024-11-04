import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

import { createCostType, updateCostType, getDetail } from '../helpers/call-api';

import CostTypeInfo from '../components/Form/CostTypeInfo';
import CostTypeMethod from '../components/Form/CostTypeMethod';
import Status from '../components/Form/Status';

const CostTypeAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      is_percent: 0,
      is_discount: 0,
    },
  });

  const { pathname } = useLocation();
  const { id: cost_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_percent = payload.is_percent ? 1 : 0;
      payload.is_discount = payload.is_discount ? 1 : 0;

      let label;
      if (cost_id) {
        await updateCostType(cost_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createCostType(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
          is_percent: 0,
          is_discount: 0,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (cost_id) {
      getDetail(cost_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        is_percent: 0,
        is_discount: 0,
      });
    }
  }, [cost_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin loại chi phí',
      id: 'information_cost_type',
      component: CostTypeInfo,
      fieldActive: ['cost_name'],
    },
    {
      title: 'Cách thức tính chi phí',
      id: 'method_cost_type',
      component: CostTypeMethod,
      fieldActive: [],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: Status,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default CostTypeAdd;
