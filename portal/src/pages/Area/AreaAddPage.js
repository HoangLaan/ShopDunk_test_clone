import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createArea, getDetailArea, updateArea } from 'services/area.service';
import { useLocation, useParams } from 'react-router-dom';
import FormSection from 'components/shared/FormSection';
import AreaInformation from './components/AreaInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
const AreaAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { area_id } = useParams();

  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    const label = area_id ? 'Chỉnh sửa' : 'Thêm mới';
    try {
      if (area_id) {
        await updateArea(area_id, payload);
      } else {
        await createArea(payload);
        methods.reset({
          is_active: 1,
        });
      }

      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error.message ?? 'Có lỗi xảy ra!');
    }
  };

  const loadAreaDetailById = useCallback(() => {
    if (area_id) {
      getDetailArea(area_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [area_id]);

  useEffect(loadAreaDetailById, [loadAreaDetailById]);

  const detailForm = [
    {
      title: 'Thông tin khu vực',
      id: 'information',
      disabled,
      component: AreaInformation,
      fieldActive: ['area_name'],
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

export default AreaAddPage;
