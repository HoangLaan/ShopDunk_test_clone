import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import { createDenomination, getDenominationDetail, updateDenomination } from 'services/denomination.service';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import DenominationInformation from './components/add/DenominationInformation';

const DenominationAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { denomination_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;

      let label;
      if (denomination_id) {
        await updateDenomination(payload);
        label = 'Chỉnh sửa';
      } else {
        await createDenomination(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(() => {
    if (denomination_id) {
      setLoading(true);
      getDenominationDetail(denomination_id)
        .then((value) => {
          methods.reset({ ...value, company_id: String(value?.company_id) });
        })
        .catch((error) => {
          showToast.error(error?.message ?? 'Có lỗi xảy ra', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [denomination_id, methods]);

  useEffect(loadData, [loadData]);

  const detailForm = [
    {
      title: 'Thông tin mệnh giá',
      id: 'information',
      component: DenominationInformation,
      fieldActive: ['image_url', 'denomination_value'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default DenominationAddPage;
