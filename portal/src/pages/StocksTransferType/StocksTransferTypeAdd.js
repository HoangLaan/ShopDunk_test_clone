import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import StocksTransferTypeReview from './components/StocksTransferTypeReview';
import StocksTransferTypeInfo from './components/StocksTransferTypeInfo';
import { getErrorMessage } from '../../utils/index';
import {
  createOrUpdateStocksTransferType,
  getDetaiStocksTransferType,
  getOptionsStocksReviewTransfer,
} from '../../services/stocks-transfer-type.service.js';

function StocksTransferTypeAdd({ stocksTransferTypeId, disabled = false }) {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      is_stocks_in_review: 1,
      review_users: {},
      description: '',
    },
  });

  let {
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = methods;

  const [optionsReviewLevel, setOptionsReviewLevel] = useState([]);

  useEffect(() => {
    loadOptionsReviewLevel();
  }, []);

  useEffect(() => {
    if (!watch('is_stocks_in_review')) {
      if (watch('reviews') && watch('reviews').length) setValue('reviews', []);
      if (errors['reviews']) clearErrors('reviews');
    }
  }, [watch('is_stocks_in_review')]);

  useEffect(() => {
    if (stocksTransferTypeId) {
      loadStocksTransferTypeDetail();
    }
  }, [stocksTransferTypeId]);

  const loadOptionsReviewLevel = async () => {
    try {
      let options = await getOptionsStocksReviewTransfer(4);
      setOptionsReviewLevel(options);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const loadStocksTransferTypeDetail = async () => {
    try {
      let detail = await getDetaiStocksTransferType(stocksTransferTypeId);
      methods.reset({
        ...detail,
      });
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const onSubmit = async (payload) => {
    try {
      let _value = { ...payload };
      _value.is_active = _value.is_active ? 1 : 0;
      _value.is_system = _value.is_system ? 1 : 0;
      _value.stocks_transfer_type_id = stocksTransferTypeId;
      delete _value['review_users'];
      await createOrUpdateStocksTransferType(_value);
      showToast.success(`${stocksTransferTypeId ? 'Cập nhật' : 'Thêm mới'} hình thức luân chuyển kho thành công.`);
      if (!stocksTransferTypeId) {
        methods.reset({
          is_active: 1,
          is_stocks_in_review: 1,
          description: '',
          reviews: [],
        });
      }
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const detailForm = [
    {
      title: 'Thông tin luân chuyển kho',
      id: 'information',
      component: StocksTransferTypeInfo,
      fieldActive: ['stocks_transfer_type_name'],
    },
    {
      id: 'review',
      title: 'Thông tin mức duyệt',
      component: StocksTransferTypeReview,
      fieldActive: ['reviews[0]'],
      hidden: !watch('is_stocks_in_review'),
      optionsReviewLevel,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
}

export default StocksTransferTypeAdd;
