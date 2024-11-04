import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { createStocksOutType, getDetail, updateStocksOutType } from './helpers/call-api';
import StocksOutTypeInfo from './components/Form/StocksOutTypeInfo';
import StocksOutOptionType from './components/Form/StocksOutOptionType';
import StocksOutTypeReview from './components/Form/StocksOutTypeReview';
import StocksOutTypeStatus from './components/Form/StocksOutTypeStatus';

const StocksOutTypeAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { watch } = methods;

  const { pathname } = useLocation();
  const { id: stocks_out_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;

      payload.is_internal = payload.stocks_out_type === 1 ? 1 : 0;
      payload.is_sell = payload.stocks_out_type === 2 ? 1 : 0;
      payload.is_exchange_goods = payload.stocks_out_type === 3 ? 1 : 0;
      payload.is_warranty = payload.stocks_out_type === 4 ? 1 : 0;
      payload.is_return_supplier = payload.stocks_out_type === 5 ? 1 : 0;
      payload.is_transfer = payload.stocks_out_type === 6 ? 1 : 0;
      payload.is_inventor_control = payload.stocks_out_type === 7 ? 1 : 0;
      payload.is_component = payload.stocks_out_type === 8 ? 1 : 0;
      payload.is_destroy = payload.stocks_out_type === 9 ? 1 : 0;
      payload.is_company = payload.stocks_out_type === 10 ? 1 : 0;

      payload.stocks_out_review_level_list = payload.is_auto_review === 1 ? [] : payload.stocks_out_review_level_list;

      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (stocks_out_type_id) {
        await updateStocksOutType(stocks_out_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createStocksOutType(payload);
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
    if (stocks_out_type_id) {
      getDetail(stocks_out_type_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        stocks_out_type: 2,
        stocks_out_review_level_list: null,
      });
    }
  }, [stocks_out_type_id]);

  const detailForm = [
    {
      title: 'Thông tin hình thức xuất kho',
      id: 'information_stocks',
      component: StocksOutTypeInfo,
      fieldActive: ['stocks_out_type_name'],
    },
    {
      title: 'Loại hình thức xuất kho',
      id: 'information_type',
      component: StocksOutOptionType,
      fieldActive: ['stocks_out_type'],
    },
    {
      title: 'Trạng thái thông tin mức duyệt',
      id: 'information_review',
      component: StocksOutTypeReview,
      fieldActive: ['stocks_out_review_level_list'],
      hidden: watch('is_auto_review') === 1 ? true : false,
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: StocksOutTypeStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default StocksOutTypeAdd;
