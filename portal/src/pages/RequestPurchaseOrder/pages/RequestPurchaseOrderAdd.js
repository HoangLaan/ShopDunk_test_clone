import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';

import { useAuth } from 'context/AuthProvider';
import { STATUS_TYPES } from 'utils/constants';
import FormSection from 'components/shared/FormSection/index';

import {
  createRequestPurchase,
  generateRequestPurchaseCode,
  detailRequestPurchase,
  updateRequestPurchase,
  updateReview,
} from 'services/request-purchase-order.service';

import { StyledRequestPurchase } from 'pages/RequestPurchaseOrder/helpers/styles';
import { RequestPurchaseProvider } from 'pages/RequestPurchaseOrder/helpers/context';
import { STATUS_ORDER, STATUS_REVIEW, PERMISSION } from 'pages/RequestPurchaseOrder/helpers/constants';

import RequestPurchaseOrderInformation from 'pages/RequestPurchaseOrder/components/Sections/RequestPurchaseOrderInformation';
import RequestPurchaseProduct from 'pages/RequestPurchaseOrder/components/Sections/RequestPurchaseProduct';
import RequestPurchaseStatus from 'pages/RequestPurchaseOrder/components/Sections/RequestPurchaseStatus';
import ModalSupplierAdd from 'pages/RequestPurchaseOrder/components/Modals/ModalSupplierAdd';
import ModalProductRequisitionList from 'pages/RequestPurchaseOrder/components/Modals/ModalProductRequisitionList';
import { showToast } from 'utils/helpers';
import usePageInformation from 'hooks/usePageInformation';
import ReviewLevelTable from '../components/ReviewLevel/ReviewLevelTable';
import ModalReview from '../components/Modals/ModalReview';
import ConfirmPurchaseOrder from '../components/Modals/ModelConfirmPurchaseOrder';

function RequestPurchaseAdd({ requestPurchaseId = null, location }) {
  const methods = useForm();
  const {  formState: { errors }, watch, reset, handleSubmit } = methods;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { disabled, isEdit, isAdd, isView } = usePageInformation();
  const history = useHistory();
  const locationPrList = location?.state?.pr_list;
  const [isShowModalReview, setIsShowModalReview] = useState(false);
  const [showConfirmPO, setShowConfirmPO] = useState(false);

  const pending = 2;

  const isCanReview =
    methods.watch('is_reviewed_saved') === pending &&
    !isAdd &&
    methods.watch(`review_level`)?.find((item) => item.user_name === parseInt(user.user_name))?.is_reviewed === 2;

  const isOrderOfSamSung =
    watch('pr_product_list') &&
    watch('pr_product_list')?.every((product) => product.manufacture_name?.toUpperCase() === 'SAMSUNG');

  // console.log('RequestPurchaseAdd values', methods.watch());
  // console.log('RequestPurchaseAdd errors', methods.formState.errors);

  const initFormPage = async () => {
    const purchaseOrderCode = await generateRequestPurchaseCode();
    methods.reset({
      request_purchase_code: purchaseOrderCode,
      username: user.user_name,
      created_user: `${user.user_name} - ${user.full_name}`,
      request_purchase_date: dayjs().format('DD/MM/YYYY'),
      is_active: STATUS_TYPES.ACTIVE,
      is_ordered: STATUS_ORDER.NOTORDER,
      is_reviewed: STATUS_REVIEW.REVIEWING,
      pr_product_list: [],
      purchase_requisition_list: locationPrList?.length ? locationPrList : [],
      business_request_id: locationPrList?.length ? locationPrList[0].business_request_id : null,
      review_level: [],
      status: 1,
    });
  };

  const getInitData = useCallback(() => {
    try {
      setLoading(true);
      if (requestPurchaseId) {
        const fetchData = async () => {
          const data = await detailRequestPurchase(requestPurchaseId);
          const purchase_requisition_list = (data?.purchase_requisition_list || [])?.map((x) => ({
            label: x?.purchase_requisition_code,
            value: x?.purchase_requisition_id,
          }));
          reset({ ...data, purchase_requisition_list, is_reviewed_saved: data?.is_reviewed });
          methods.setValue("company_id", Number(data.company_id))
        };
        fetchData();
      } else {
        initFormPage();
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [requestPurchaseId]);

  useEffect(getInitData, [getInitData]);

  const onSubmit = async (dataSubmit) => {
    try {
      dataSubmit.purchase_requisition_list = (dataSubmit?.purchase_requisition_list || [])?.map((x) => x?.value);
      dataSubmit.review_level = dataSubmit.review_level?.map(({ user_review_list, ...item }) => item);
      if (!dataSubmit.review_level?.length) {
        throw new Error('Thông tin mức duyệt là bắt buộc');
      }
      setLoading(true);
      if (requestPurchaseId) {
        methods.setValue('is_reviewed_saved', dataSubmit.is_reviewed);

        await updateRequestPurchase(requestPurchaseId, dataSubmit);

        // check is review
        const isReview = dataSubmit.pr_product_list?.every(
          (product) => product.is_reviewed === 1 || product.is_reviewed === 0,
        );
        if (isReview && isCanReview) {
          await updateReview({ is_reviewed: 1, note: 'OK', request_purchase_id: requestPurchaseId });
        }

        showToast.success('Chỉnh sửa thành công');
      } else {
        await createRequestPurchase(dataSubmit);
        showToast.success('Thêm mới thành công');
        initFormPage();
      }
    } catch (error) {
      showToast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin phiếu',
      component: RequestPurchaseOrderInformation,
      fieldActive: [
        'request_purchase_code',
        'request_purchase_date',
        'created_user',
        'company_id',
        'business_request_id',
        'business_receive_id',
        'department_request_id',
        'store_receive_id',
      ],
    },
    {
      title: 'Thông tin sản phẩm',
      component: RequestPurchaseProduct,
      requestPurchaseId,
      isAdd,
    },
    {
      title: 'Thông tin mức duyệt',
      component: ReviewLevelTable,
      fieldActive: [],
      isEdit: requestPurchaseId ? true : false,
    },
    {
      title: 'Trạng thái',
      component: RequestPurchaseStatus,
      fieldActive: !watch('is_ordered') ? ['is_active', 'is_ordered__'] : ['is_active'],
    },
  ];

  const actions = [
    {
      globalAction: true,
      className: 'bw_btn bw_btn_success',
      icon: 'fi fi-rr-check',
      content: 'Duyệt',
      permission: PERMISSION.REVIEW,
      isShow: isCanReview,
      onClick: () => setIsShowModalReview(true),
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-check',
      type: 'success',
      content: disabled ? 'Chỉnh sửa' : requestPurchaseId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      isShow: isAdd || methods.watch('is_reviewed_saved') !== 1,
      onClick: () => {
        if (disabled) {
          window._$g.rdr(`/request-purchase-order/edit/${requestPurchaseId}`);
        } else {
          handleSubmit(onSubmit)();
        }
      },
    },
    {
      icon: 'fi fi-rr-check',
      type: 'success',
      content: 'Tạo đơn mua hàng',
      isShow: isEdit && methods.watch('is_reviewed_saved') === 1,
      onClick: () => {
        history.push('/purchase-orders/add', {
          request_purchase_code: methods.watch('request_purchase_code'),
          request_purchase_id: methods.watch('request_purchase_id'),
        });
      },
    },
    {
      icon: methods.watch('is_purchase_samsung') ? 'fi fi fi-rr-eye' : 'fi fi-rr-shopping-cart-add',
      type: 'success',
      content: methods.watch('is_purchase_samsung') ? 'Xem thông tin đặt hàng Samsung' : 'Đặt hàng Samsung',
      isShow: methods.watch('is_reviewed') === 1 && isOrderOfSamSung,
      onClick: () => setShowConfirmPO(true),
    },
  ].filter((x) => x.isShow);

  const onSubmitReview = async (data) => {
    try {
      await updateReview({ ...data, request_purchase_id: requestPurchaseId });
      setIsShowModalReview(true);
      showToast.success('Duyệt thành công');
    } catch (error) {
      showToast.error(error.message ?? 'Duyệt thất bại');
    }
  };

  return (
    <StyledRequestPurchase>
      <RequestPurchaseProvider>
        <FormProvider {...methods}>
          <FormSection
            loading={loading}
            detailForm={detailForm}
            onSubmit={onSubmit}
            disabled={disabled}
            actions={actions}
          />
        </FormProvider>

        {/* Modals */}
        <ModalSupplierAdd />
        <ModalProductRequisitionList />
        {isShowModalReview && <ModalReview onSubmit={onSubmitReview} onClose={() => setIsShowModalReview(false)} />}
      </RequestPurchaseProvider>
      {showConfirmPO && (
        <ConfirmPurchaseOrder
          setShowModal={setShowConfirmPO}
          setLoading={setLoading}
          loading={loading}
          purchaseOrder={methods.getValues()}
          savedPurchaseOrder={methods.getValues('purchase_data')}
          disabled={!!watch('is_purchase_samsung')}
        />
      )}
    </StyledRequestPurchase>
  );
}

export default RequestPurchaseAdd;
