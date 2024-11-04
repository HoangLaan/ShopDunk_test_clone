import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { createStocksTakeType, getDetail, updateStocksTakeType } from './helpers/call-api';
import StocksTakeTypeInfo from './components/Form/StocksTakeTypeInfo';
import StocksTakeTypeReview from './components/Form/StocksTakeTypeReview';
import StocksTakeTypeReviewStatus from './components/Form/StocksTakeTypeReviewStatus';

const StocksTakeTypeAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { watch } = methods;

  const { pathname } = useLocation();
  const { id: stocks_take_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.stocks_take_review_level_list =
        payload.is_stocks_take_review === 1 ? [] : payload.stocks_take_review_level_list;
      // payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (stocks_take_type_id) {
        await updateStocksTakeType(stocks_take_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createStocksTakeType(payload);
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
    if (stocks_take_type_id) {
      getDetail(stocks_take_type_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        stocks_out_type: 1,
        stocks_in_review_level_list: null,
        is_stocks_take_imei_code: 1,
      });
    }
  }, [stocks_take_type_id]);

  const detailForm = [
    {
      title: 'Thông tin kiểm kê kho',
      id: 'information_stocks',
      component: StocksTakeTypeInfo,
      fieldActive: ['stocks_take_type_name'],
    },
    {
      title: 'Thông tin mức duyệt',
      id: 'information_type',
      component: StocksTakeTypeReview,
      fieldActive: ['stocks_take_review_level_list'],
      hidden: watch('is_stocks_take_review') === 1 ? true : false,
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: StocksTakeTypeReviewStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default StocksTakeTypeAdd;
