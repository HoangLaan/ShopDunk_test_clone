import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { createStocks, getDetail, updateStocks } from './helpers/call-api';
import InfoStocks from './components/Form/InfoStocks';
import UserManageStocks from './components/Form/UserManageStocks';
import StocksStaTus from './components/Form/StocksStaTus';
import FormAddressSelect from './components/Form/FormAddressSelect';

const StocksAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { id: stocks_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;

      let label;
      if (stocks_id) {
        await updateStocks(stocks_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createStocks(payload);
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
    if (stocks_id) {
      getDetail(stocks_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [stocks_id]);

  const detailForm = [
    {
      title: 'Thông tin kho',
      id: 'information_stocks',
      component: InfoStocks,
      fieldActive: ['stocks_name', 'stocks_code', 'alternate_name', 'phone_number', 'address'],
    },
    {
      id: 'address',
      title: 'Địa chỉ',
      component: FormAddressSelect,
      fieldActive: ['country_id', 'province_id', 'district_id', 'ward_id', 'postal_code', 'address'],
    },
    {
      title: 'Người quản lý kho',
      id: 'information_review',
      component: UserManageStocks,
      fieldActive: ['stocks_user_manage_list'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: StocksStaTus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} methods={methods} />
    </FormProvider>
  );
};

export default StocksAdd;
