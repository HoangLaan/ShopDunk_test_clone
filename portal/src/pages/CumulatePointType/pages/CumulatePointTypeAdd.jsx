import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import CumulatePointTypeInformation from '../components/add/CumulatePointTypeInformation';
import { configToast } from '../utils/constants';
import {
  createCumulatePointType,
  getDetailCumulatePointType,
  updateCumulatePointType,
} from 'services/cumulate-point-type.service';
import ApplyCumulatePoint from '../components/add/ApplyCumulatePoint';
const CumulatePointTypeAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { ac_point_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      let value = {
        ...payload,
        is_active: payload.is_active ? 1 : 0,
        is_system: payload.is_system ? 1 : 0,
      };
      let label;
      if (ac_point_id) {
        await updateCumulatePointType(ac_point_id, value);
        label = 'Chỉnh sửa';
      } else {
        await createCumulatePointType(value);
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

  const loadCumulatePointType = useCallback(() => {
    if (ac_point_id) {
      getDetailCumulatePointType(ac_point_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        is_apply_condition: 1,
        is_apply_all_category: 1,
        is_all_member_type: 1,
      });
    }
  }, [ac_point_id]);

  useEffect(loadCumulatePointType, [loadCumulatePointType]);

  const detailForm = [
    {
      title: 'Thông tin ',
      id: 'information',
      component: CumulatePointTypeInformation,
      fieldActive: ['ac_point_name'],
    },
    {
      title: 'Áp dụng tích điểm với',
      id: 'apply',
      component: ApplyCumulatePoint,
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

export default CumulatePointTypeAdd;
