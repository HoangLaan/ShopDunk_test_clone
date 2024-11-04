import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection';

import {
  createPurchaseRequisition,
  getDetailPurchaseRequisition,
  updatePurchaseRequisition,
  updateReview,
} from 'services/purchase-requisition.service';
import PurchaseRequisitionInformation from './components/add/PurchaseRequisitionInformation';
import PurchaseRequisitionStatus from './components/add/PurchaseRequisitionStatus';
import PurchaseRequisitionProductListTable from './components/add/PurchaseRequisitionProductListTable';
import { showToast } from 'utils/helpers';
import ReviewLevelUserForm from './components/add/ReviewLevelUserForm';
import usePageInformation from 'hooks/usePageInformation';
import { useAuth } from 'context/AuthProvider';
import { printPR } from './utils/utils';
import ICON_COMMON from 'utils/icons.common';
import ModalReview from './components/main/ModalReview'
import { getCurrentDate } from 'utils';

const PurchaseRequisitionAddPage = () => {
  const { user } = useAuth()
  const defaultValues = {
    is_active: 1,
    pr_status_id: 1,
    department_request_id: user.department_id,
    business_request_id: user.user_business?.length ? user.user_business[0] : null,
    to_buy_date: getCurrentDate()
  };

  const methods = useForm({ defaultValues });
  const is_reviewed = methods.watch('is_reviewed');
  const [isShowModalReview, setIsShowModalReview] = useState(false);


  const { id: purchase_requisition_id, disabled, isAdd, isEdit } = usePageInformation()
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      if (!payload.product_list || payload.product_list.length === 0) {
        showToast.warning('Danh sách sản phẩm không được để trống');
        return;
      }

      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;

      payload.department_request_id = payload.department_request_id?.value
        ? payload.department_request_id?.value
        : payload.department_request_id;
      payload.business_request_id = payload.business_request_id?.value
        ? payload.business_request_id?.value
        : payload.business_request_id;
      payload.store_request_id = payload.store_request_id?.value
        ? payload.store_request_id?.value
        : payload.store_request_id;

      if (purchase_requisition_id) {
        await updatePurchaseRequisition({ ...payload, purchase_requisition_id });
        showToast.success('Chỉnh sửa thành công');
      } else {
        const createRes = await createPurchaseRequisition(payload);
        window._$g.rdr('/purchase-requisition/view/' + createRes)
        showToast.success('Thêm mới thành công');
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin phiếu',
      id: 'information',
      component: PurchaseRequisitionInformation,
      fieldActive: [
        'purchase_requisition_date',
        'department_request_id',
        'business_request_id',
        'store_request_id',
        'pr_status_id',
      ],
    },
    { id: 'review', title: 'Thông tin sản phẩm', component: PurchaseRequisitionProductListTable },
    {
      id: 'reviewLevel',
      title: 'Thông tin mức duyệt',
      component: ReviewLevelUserForm,
    },
    { id: 'status', title: 'Trạng thái', component: PurchaseRequisitionStatus },
  ];

  const loadPurchaseRequisition = useCallback(() => {
    if (purchase_requisition_id) {
      setLoading(true);
      getDetailPurchaseRequisition(purchase_requisition_id)
        .then((value) => {
          methods.reset({
            ...value,
            business_request_id: String(value.business_request_id),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset(defaultValues);
    }
  }, [purchase_requisition_id, methods]);
  useEffect(loadPurchaseRequisition, [loadPurchaseRequisition]);

  const pending = 2;
  const actions = [
    {
      className: 'bw_btn bw_btn_success',
      icon: 'fi fi-rr-check',
      content: 'Duyệt',
      hidden: (is_reviewed !== pending || isAdd) || !methods.watch(`review_level_user_list`)?.find(item => item.user_review === user.user_name),
      onClick: () => setIsShowModalReview(true),
    },
    {
      icon: ICON_COMMON.print,
      content: 'In phiếu',
      className: 'bw_btn bw_btn_warning',
      hidden: isAdd,
      onClick: () => printPR(purchase_requisition_id),
    },
    {
      globalAction: true,
      className: 'bw_btn bw_btn_success',
      icon: 'fi fi-rr-check',
      type: 'success',
      content: disabled ? 'Chỉnh sửa' : purchase_requisition_id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      hidden: isAdd ? false : is_reviewed !== pending,
      onClick: () => {
        if (disabled) window._$g.rdr(`/purchase-requisition/edit/${purchase_requisition_id}`);
        else methods.handleSubmit(onSubmit)();
      },
    },
  ];

  const onSubmitReview = async (payload) => {
    try {
      updateReview({
        purchase_requisition_id,
        ...payload,
      }).then(res => {
        loadPurchaseRequisition();
        showToast.success(`Cập nhật duyệt thành công`)
      });
      setIsShowModalReview(false);
    } catch (error) {
      showToast.error(error.message);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <FormSection actions={actions} loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
      </FormProvider>
      {isShowModalReview && (
        <ModalReview onSubmit={onSubmitReview} onClose={() => setIsShowModalReview(false)} isShowModalReview={isShowModalReview} />
      )}
    </>
  );
};

export default PurchaseRequisitionAddPage;
