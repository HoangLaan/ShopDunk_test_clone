import React, { useMemo, useCallback, useEffect, Fragment } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import TransferShiftInformation from './components/add/TransferShiftInformation';
import { createTransferShift, getDetailTransferShift, updateTransferShift } from 'services/transfer-shift.service';
import ReviewList from './components/add/ReviewList';
import { isNull } from 'lodash';
const TransferShiftAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { transfer_shift_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      let label;
      if (transfer_shift_id) {
        await updateTransferShift(transfer_shift_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createTransferShift(payload);
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

  const loadTransferShift = useCallback(() => {
    if (transfer_shift_id) {
      getDetailTransferShift(transfer_shift_id).then((value) => {
        methods.reset({
          ...value,
          list_review: value.list_review?.map((x) => ({
            ...x,
            review_user: +x.review_user,
          })),
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [transfer_shift_id]);

  useEffect(loadTransferShift, [loadTransferShift]);

  const detailForm = [
    {
      title: 'Thông tin chuyển ca',
      id: 'information',
      component: TransferShiftInformation,
      fieldActive: [],
    },
    {
      title: 'Thông tin mức duyệt',
      id: 'list_review',
      component: ReviewList,
      fieldActive: [],
    },
  ];

  return (
    <Fragment>
      <FormProvider {...methods}>
        <FormSection
          disabled={disabled}
          detailForm={detailForm}
          onSubmit={onSubmit}
          disabledBtn={!isNull(methods.watch('is_review'))}
        />
      </FormProvider>
    </Fragment>
  );
};

export default TransferShiftAddPage;
