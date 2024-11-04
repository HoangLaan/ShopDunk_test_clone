import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createPositionLevel, getDetailPositionLevel, updatePositionLevel } from 'services/position-level.service';
import { useLocation, useParams } from 'react-router-dom';
import FormSection from 'components/shared/FormSection';
import PositionLevelInformation from './components/PositionLevelInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
const PositionLevelAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { position_level_id } = useParams();

  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    const label = position_level_id ? 'Chỉnh sửa' : 'Thêm mới';
    try {
      if (position_level_id) {
        payload.position_level_id = position_level_id;
        await updatePositionLevel(payload);
      } else {
        await createPositionLevel(payload);
        methods.reset({
          is_active: 1,
        });
      }

      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error.message ?? 'Có lỗi xảy ra!');
    }
  };

  const loadPositionLevelDetailById = useCallback(() => {
    if (position_level_id) {
      getDetailPositionLevel(position_level_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [position_level_id]);

  useEffect(loadPositionLevelDetailById, [loadPositionLevelDetailById]);

  const detailForm = [
    {
      title: 'Thông tin cấp bậc nhân viên',
      id: 'information',
      disabled,
      component: PositionLevelInformation,
      fieldActive: ['position_level_name'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
      </FormProvider>
    </React.Fragment>
  );
};

export default PositionLevelAddPage;
