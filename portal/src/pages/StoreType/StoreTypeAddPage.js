import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import StoreTypeInformation from './components/add/StoreTypeInformation';
import { createStoreType, getStoreTypeDetail, updateStoreType } from 'services/store-type.service';

const StoreTypeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { store_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.stocks_type_ids = payload.stocks_type_ids?.map((item) => item.value);

      let label;
      if (store_type_id) {
        await updateStoreType(payload);
        label = 'Chỉnh sửa';
      } else {
        await createStoreType(payload);
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
    if (store_type_id) {
      setLoading(true);
      getStoreTypeDetail(store_type_id)
        .then((value) => {
          methods.reset({
            ...value,
            company_id: String(value.company_id),
            business_id: String(value.business_id),
          });
        })
        .catch((err) => {
          showToast.error(err?.message ?? 'Có lỗi xảy ra', {
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
  }, [store_type_id, methods]);

  useEffect(loadData, [loadData]);

  const detailForm = [
    {
      title: 'Thông tin loại cửa hàng',
      id: 'information',
      component: StoreTypeInformation,
      fieldActive: ['store_type_name', 'company_id'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default StoreTypeAddPage;
