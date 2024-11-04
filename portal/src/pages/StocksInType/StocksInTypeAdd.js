import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { StocksInTypeInfo, StocksInTypeStatus, StocksInTypeReview } from './components/StocksInTypeForm';
import { createStocksInType, getDetail, updateStocksInType } from './helpers/call-api';
const StocksInTypeAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      is_auto_review: 0,
    },
  });

  const { watch } = methods;
  const { pathname } = useLocation;
  const { id: stocks_in_type_id } = useParams();
  const disabled = useMemo(() => pathname?.includes('/detail'), [pathname]);

  const stocksInTypeOptions = useMemo(
    () => ({
      0: 'is_transfer',
      1: 'is_purchase',
      2: 'is_inventory_control',
      3: 'is_exchange_goods',
      4: 'is_warranty',
      5: 'is_electronics_component',
      6: 'is_internal',
      7: 'is_different',
      8: 'is_returned_goods',
    }),
    [],
  );

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload[stocksInTypeOptions[payload.stocks_in_type]] = 1;

      payload.stocks_in_review_level_list = payload.is_auto_review === 1 ? [] : payload.stocks_in_review_level_list;

      let label;
      if (stocks_in_type_id) {
        await updateStocksInType(stocks_in_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createStocksInType(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
          is_auto_review: 0,
          stocks_in_type: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (stocks_in_type_id) {
      getDetail(stocks_in_type_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        is_auto_review: 0,
        stocks_in_type: 1,
      });
    }
  }, [stocks_in_type_id]);

  const detailForm = [
    {
      title: 'Thông tin nhập kho',
      id: 'information_stocks',
      component: StocksInTypeInfo,
      fieldActive: ['stocks_in_type_name', 'stocks_in_type'],
    },
    {
      title: 'Thông tin mức duyệt',
      id: 'information_review',
      component: StocksInTypeReview,
      fieldActive: ['stocks_in_review_level_list'],
      hidden: watch('is_auto_review') === 1 ? true : false,
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: StocksInTypeStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default StocksInTypeAdd;
