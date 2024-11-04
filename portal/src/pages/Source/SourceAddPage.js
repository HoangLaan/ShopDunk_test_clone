import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import SourceInformation from './components/add/SourceInformation';
import { createSource, getDetailSource, updateSource } from 'services/source.service';
import FormStatus from 'components/shared/FormCommon/FormStatus';
const SourceAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { source_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      let value = {
        ...payload,
        is_active: payload.is_active ? 1 : 0,
      };
      //
      let label;
      if (source_id) {
        await updateSource(source_id, value);
        label = 'Chỉnh sửa';
      } else {
        await createSource(value);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const loadSource = useCallback(() => {
    if (source_id) {
      getDetailSource(source_id).then((value) => {
        methods.reset({
          ...value,
          source_type: value.source_type || 0,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [source_id]);

  useEffect(loadSource, [loadSource]);

  const detailForm = [
    {
      title: 'Thông tin nguồn khách hàng',
      id: 'information',
      component: SourceInformation,
      fieldActive: ['source_name', 'source_type'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default SourceAddPage;
