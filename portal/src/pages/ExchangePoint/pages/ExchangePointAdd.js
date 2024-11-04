import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import ExchangePointInformation from '../components/add/ExchangePointInformation';
import { configToast } from '../utils/constants';
import ApplyExchangePoint from '../components/add/ApplyExchangePoint';
import { createExchangePoint, getDetailExchangePoint, updateExchangePoint } from 'services/exchange-point.service';
import { getOptionsGlobal } from 'services/global.service';
const ExchangePointAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { ex_point_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      let value = {
        ...payload,
        is_active: payload.is_active ? 1 : 0,
        is_system: payload.is_system ? 1 : 0,
      };
      let label;
      if (ex_point_id) {
        await updateExchangePoint(ex_point_id, value);
        label = 'Chỉnh sửa';
      } else {
        await createExchangePoint(value);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`, configToast);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra', configToast);
    }
  };

  const loadExchangePoint = useCallback(() => {
    if (ex_point_id) {
      getDetailExchangePoint(ex_point_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      getOptionsGlobal({ type: 'company' }).then((data) => {
        methods.reset({
          is_active: 1,
          is_apply_all_category: 1,
          is_all_member_type: 1,
          is_apply_condition: 1,
          company_id: +data?.[0].id,
        });
      });
    }
  }, [ex_point_id]);

  useEffect(loadExchangePoint, [loadExchangePoint]);

  const detailForm = [
    {
      title: 'Thông tin ',
      id: 'information',
      component: ExchangePointInformation,
      fieldActive: ['ex_point_name'],
    },
    {
      title: 'Áp dụng tiêu điểm với',
      id: 'apply',
      component: ApplyExchangePoint,
      fieldActive: ['company_id'],
    },

    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ExchangePointAdd;
