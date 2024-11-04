import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import moment from 'moment';
import { CODE_TYPE, PAYMENTSTATUS, RECEIPTSOBJECT, RECEIVE_PAYMENT_TYPE } from '../utils/constants';
import { useDispatch } from 'react-redux';
import FormSection from 'components/shared/FormSection';
import Information from '../components/FormSection/Information';
import InvoiceList from '../components/FormSection/InvoiceList';
import ReviewForm from '../components/FormSection/ReviewForm';

import {
  createReceiveSlip,
  updateReceiveSlip,
  getDetailReceiveSlip,
  genReceiveSlipCode,
  confirmReceiveMoney,
} from 'services/receive-slip.service';

import {
  createPaymentSlip,
  updatePaymentSlip,
  getDetailPaymentSlip,
  genPaymentSlipCode,
  getReviewLevel,
  // getDetailPaymentSlip,
  // genReceiveSlipCode,
} from 'services/payment-slip.service';

import DocumentForm from '../components/FormSection/Attachment';
import AcocuntingForm from '../components/FormSection/Accounting';
import { showToast } from 'utils/helpers';
import { getDetailPurchaseOrder } from 'pages/PurchaseOrder/helpers/call-api';
import { detailRequestPurchaseByCode, detailRequestPurchaseByMulti } from 'services/request-purchase-order.service';
import { getDetailPurchaseCost } from 'services/purchase-cost.service';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { getCreditAccountOpts } from 'services/receive-slip.service';
import { useAuth } from 'context/AuthProvider';

const ReceiveSlipAddPage = ({
  receivePaymentId = null,
  receivePaymentType,
  isCopy = false,
  isEdit = true,
  location,
  isAddPage = true,
  defaultValues,
}) => {
  const dispatch = useDispatch();
  const methods = useForm({ defaultValues });
  const { user } = useAuth();
  const { state, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  if (searchParams.get('type')) {
    receivePaymentType = parseInt(Number(searchParams.get('type'))) || null;
  }
  const { data_payment_from_pay_debt: data_payment } = state ?? {};

  useEffect(() => {
    if (data_payment) {
      methods.reset(data_payment);
    }
  }, [data_payment]);

  const purchaseOrderId = location?.state?.purchase_order_id;
  const purchaseCostId = location?.state?.purchaseCostId;
  const totalPricePO = location?.state?.total_price_all;
  const totalMoney = location?.state?.total_money;
  const payment_date = location?.state?.payment_date;
  const invoiceData = location?.state?.invoice_data;
  const expendTypeOptions = useGetOptions(optionType.expendType);
  const expendTypePurchaseId = expendTypeOptions.find((x) => x?.name?.match(/chi phí mua hàng/i))?.id;

  const [loading, setLoading] = useState(false);
  const [objectName, setObjectName] = useState(receivePaymentType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP ? 'thu' : 'chi');
  const [generatedCode, setGeneratedCode] = useState('');
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);

  const creditList = {
    '111_1121': creditAccountingAccountOpts.find((x) => x.name === '111' || x.name === '1121')?.id,
    331: creditAccountingAccountOpts.find((x) => x.name === '331')?.id,
    111: creditAccountingAccountOpts.find((x) => x.name === '111')?.id,
    1111: creditAccountingAccountOpts.find((x) => x.name === '1111')?.id,
    1121: creditAccountingAccountOpts.find((x) => x.name === '1121')?.id,
  };
  // check book keeping
  if (receivePaymentId) {
    const isBookkeeping = methods.getValues('is_bookkeeping');
    if (isBookkeeping) {
      isEdit = false;
    }
  }

  // rename title
  useEffect(() => {
    const title = `${!receivePaymentId ? 'Thêm mới' : isCopy ? 'Sao chép' : isEdit ? 'Chỉnh sửa' : 'Chi tiết'
      } ủy nhiệm ${objectName}`;

    const titleElement = document.getElementById('bw_form_title');
    if (titleElement) {
      titleElement.innerText = title;
    }
  }, []);
  useEffect(() => {
    getCreditAccountOpts().then(setCreditAccountingAccountOpts);
  }, []);
  const loadReceiveSlipDetal = useCallback(async () => {
    try {
      if (receivePaymentId) {
        setLoading(true);
        if (receivePaymentType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP) {
          const data = await getDetailReceiveSlip(receivePaymentId);
          methods.reset(data);
        } else {
          const data = await getDetailPaymentSlip(receivePaymentId);
          methods.reset(data);
        }
        setLoading(false);
      } else {
        let initForm = {
          is_active: 1,
          payment_status: PAYMENTSTATUS.PAID,
          created_date: moment().format('DD/MM/yyyy'),
          accounting_date: moment().format('DD/MM/yyyy'),
          currency_type: 1,
          attachment_count: 0,
          payment_type: 2,
          is_disabled: 1,
          company_id: user.company_id,
          business_id: user.user_business ? parseInt(user.user_business[0]) : null,
          [receivePaymentType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP ? 'cashier_id' : 'payer_id']: user.user_name,
        };

        if (invoiceData) {
          initForm = {
            ...initForm,
            company_id: Number(invoiceData?.company_id) || null,
            business_id: Number(invoiceData?.business_id) || null,
            receiver_type: invoiceData?.receiver_type,
            receiver_id: invoiceData?.receiver_id,
            receiver_name: invoiceData?.receiver_name,
            descriptions: `Mua hàng của ${invoiceData?.receiver_name} theo mã đơn mua hàng ${invoiceData.product_list[0]?.purchase_order_code}`,
            payer_id: invoiceData?.created_user?.split('-')[0],
            payer_name: invoiceData?.created_user,
            accounting_list: [
              {
                explain: `Mua hàng của ${invoiceData?.receiver_name} theo mã đơn mua hàng ${invoiceData.product_list[0]?.purchase_order_code}}`,
                debt_account: location?.state?.debt_account,
                credit_account: location?.state?.credit_account,
                money: invoiceData?.payment_list?.reduce((total, payment) => total + payment?.remaining_price, 0),
              },
            ],
            total_money: invoiceData?.payment_list?.reduce((total, payment) => total + payment?.remaining_price, 0),
            expend_type_id: expendTypePurchaseId,
            invoice_payment_list: invoiceData?.payment_list,
            is_multiple_invoice: true,
            invoice_options: invoiceData.invoice_options,
            invoice_ids: invoiceData.invoice_ids,
            invoice_id: invoiceData.payment_list.length === 1 ? invoiceData.payment_list[0].invoice_id : null, // nếu là thanh toán cho 1 invoice thì lấy ra, ngược lại để null
          };
          // Load thông tin người duyệt
          getReviewLevel({ expend_type_id: expendTypePurchaseId }).then((data = []) => {
            methods.setValue('review_list', data);
          });
        }

        if (purchaseOrderId && !purchaseCostId) {
          const doRes = await getDetailPurchaseOrder(purchaseOrderId);
          if (doRes?.request_purchase_code) {
            const poRes = await detailRequestPurchaseByCode(
              Array.isArray(doRes?.request_purchase_code)
                ? doRes?.request_purchase_code[0].request_purchase_code
                : doRes?.request_purchase_code,
            );
            initForm = {
              ...initForm,
              business_id: parseInt(Number(poRes?.business_receive_id)) || null,
            };
          }
          const [payer_id, payer_name] = doRes.created_user.split(' - ');
          initForm = {
            ...initForm,
            company_id: Number(doRes?.company_id),
            receiver_type: RECEIPTSOBJECT.SUPPLIER,
            receiver_id: doRes?.supplier_id,
            receiver_name: doRes?.supplier_name,
            descriptions: doRes?.order_note.replace(/<[^>]*>/g, ''),
            payer_id: payer_id,
            payer_name: payer_name || payer_id,
            accounting_list: [
              {
                explain: doRes?.order_note.replace(/<[^>]*>/g, ''),
                debt_account: location?.state?.debt_account,
                credit_account: location?.state?.credit_account,
                money: totalPricePO,
              },
            ],
            total_money: totalPricePO,
            purchase_order_id: purchaseOrderId,
            expend_type_id: expendTypePurchaseId,
          };
          // Load thông tin người duyệt
          getReviewLevel({ expend_type_id: expendTypePurchaseId }).then((data = []) => {
            methods.setValue('review_list', data);
          });
        } else if (purchaseCostId) {
          let purchaseOrderId = 0;
          const pcRes = await getDetailPurchaseCost(purchaseCostId);
          purchaseOrderId = pcRes?.purchase_order_order_id || 0;
          if (purchaseOrderId) {
            const poRes = await getDetailPurchaseOrder(purchaseOrderId);
            initForm = {
              ...initForm,
              business_id: parseInt(Number(poRes?.business_id)) || null,
              company_id: parseInt(Number(poRes?.company_id)) || null,
              receiver_name: poRes?.supplier_name,
            };
          }
          const [payer_id, payer_name] = pcRes.created_user.split(' - ');
          const accounting_list_payment = pcRes?.accounting_list.map((item) => ({
            ...item,
            credit_account: creditList['1121'],
            debt_account: item?.credit_account,
          }));
          initForm = {
            ...initForm,
            receiver_type: RECEIPTSOBJECT.SUPPLIER,
            receiver_id: pcRes?.supplier_id,
            descriptions: '',
            payer_id: payer_id,
            payer_name: payer_name || payer_id,
            accounting_list: accounting_list_payment,
            total_money: totalMoney || pcRes?.total_total_cost_price,
            purchase_order_id: purchaseOrderId,
            expend_type_id: expendTypePurchaseId,
            purchase_cost_id: purchaseCostId,
            created_date: payment_date,
          };
          // Load thông tin người duyệt
          getReviewLevel({ expend_type_id: expendTypePurchaseId }).then((data = []) => {
            methods.setValue('review_list', data);
          });
        }
        methods.reset({ ...methods.getValues(), ...initForm });
      }
    } catch (error) {
      showToast.error(error?.message || 'Đã xảy ra lỗi !');
    }
  }, [dispatch, receivePaymentId, purchaseOrderId, expendTypePurchaseId, creditAccountingAccountOpts]);

  useEffect(() => {
    loadReceiveSlipDetal();
  }, [loadReceiveSlipDetal]);

  // gen code
  useEffect(() => {
    if (receivePaymentType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP) {
      genReceiveSlipCode({ type: CODE_TYPE.CREDIT })
        .then((data) => {
          if (data?.receive_slip_code && !receivePaymentId) {
            const genCode = data?.receive_slip_code?.trim();
            methods.setValue('receive_slip_code', genCode);
            setGeneratedCode(genCode);
          }
        })
        .catch((err) => {
          showToast.error(`Tạo mã phiếu ${objectName} thất bại !`);
        });
    } else {
      genPaymentSlipCode({ type: CODE_TYPE.CREDIT })
        .then((data) => {
          if (data && !receivePaymentId) {
            const genCode = data?.trim();
            methods.setValue('payment_slip_code', genCode);
            setGeneratedCode(genCode);
          }
        })
        .catch((err) => {
          showToast.error(`Tạo mã phiếu ${objectName} thất bại !`);
        });
    }
  }, []);

  const onSubmit = (payload) => {
    const accountingList = methods.getValues('accounting_list') || [];
    accountingList.length === 0 && showToast.warning('Hạch toán là bắt buộc !');

    if (accountingList.length > 0) {
      try {
        if (receivePaymentId && !isCopy) {
          receivePaymentType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP
            ? updateReceiveSlip(payload)
            : updatePaymentSlip(payload);
          if (methods.watch('bookeeping_status') === 1) {
            showToast.success(`Đã ghi sổ thành công !`);
          } else if (methods.watch('bookeeping_status') === 0) {
            showToast.success(`Bỏ ghi sổ thành công !`);
          } else {
            showToast.success(`Cập nhật phiếu ${objectName} thành công !`);
          }
        } else {
          if (isCopy) {
            // reset ids
            payload.receive_slip_id = null;
            payload.payment_slip_id = null;
            payload.attachment_list.forEach((attachemnt) => {
              attachemnt.receive_slip_attachment_id = null;
              attachemnt.payment_slip_attachment_id = null;
            });
            payload.accounting_list.forEach((accouting) => {
              accouting.accounting_id = null;
            });
          }
          receivePaymentType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP
            ? createReceiveSlip(payload)
            : createPaymentSlip(payload);

          methods.reset({
            is_active: 1,
            payment_status: PAYMENTSTATUS.PAID,
            created_date: moment().format('DD/MM/YYYY'),
            receive_slip_code: generatedCode?.trim(),
            payment_slip_code: generatedCode?.trim(),
          });
          showToast.success(`${isCopy ? 'Sao chép' : 'Thêm mới'} phiếu ${objectName} thành công !`);
        }
      } catch (error) {
        showToast.error(error?.message || 'Có lỗi xảy ra !');
      }
    }
  };

  const detailForm = useMemo(() => {
    const formList = [
      {
        id: 'infomation',
        title: `Thông tin phiếu ${objectName}`,
        component: Information,
        fieldActive: ['company_id', 'business_id', 'receiver_type', 'receiver_id', 'total_money'],
        objectName: objectName,
        objectType: receivePaymentType,
        isAddPage,
      },
      {
        id: 'accounting',
        title: 'Hạch toán',
        fieldActive: ['accounting_list'],
        component: AcocuntingForm,
        type: receivePaymentType,
        isAddPage,
      },
      {
        id: 'invoice_list',
        title: 'Hóa đơn',
        fieldActive: ['invoice_list'],
        component: InvoiceList,
        type: receivePaymentType,
        isAddPage,
      },
      {
        id: 'document',
        title: 'Đính kèm',
        fieldActive: ['attachment_list'],
        component: DocumentForm,
        onRefesh: loadReceiveSlipDetal,
      },
    ];
    if (receivePaymentType === RECEIVE_PAYMENT_TYPE.PAYMENTSLIP) {
      formList.push({
        id: 'review_list',
        title: 'Thông tin duyệt',
        fieldActive: ['review_list'],
        component: ReviewForm,
        // disabled: !isEdit,
        paymentId: receivePaymentId,
      });
    }
    return formList;
  }, [receivePaymentType]);

  const internal_transfer_id = methods.watch('internal_transfer_id');
  const isConfirmReceiveBefore = methods.watch('status_receive_money') === 1;
  const isValidUserReceive = user.user_name === methods.watch('cashier_id');
  const buttonConfirmMoney =
    internal_transfer_id && !isConfirmReceiveBefore && isValidUserReceive
      ? [
        {
          icon: 'fi fi-rr-edit',
          content: 'Xác nhận nhận tiền',
          type: 'warning',
          onClick: () => {
            confirmReceiveMoney({ internal_transfer_id })
              .then((res) => showToast.success('Xác nhận nhận tiền thành công'))
              .then(() => loadReceiveSlipDetal())
              .catch((error) => showToast.error('Xác nhận nhận tiền thất bại'));
          },
          className: 'bw_btn bw_btn_primary',
        },
      ]
      : [];

  const actions = [
    ...buttonConfirmMoney,
    // {
    //   icon: 'fi fi-rr-edit',
    //   submit: true,
    //   content: 'Lưu và ghi sổ',
    //   onClick: () => {
    //     methods.setValue('is_bookkeeping', 1);
    //     methods.setValue('bookeeping_status', 1);
    //   },
    //   className: 'bw_btn bw_btn_primary',
    // },
    {
      icon: 'fi fi-rr-edit',
      submit: true,
      content: 'Lưu',
      onClick: () => {
        methods.setValue('bookeeping_status', 2);
      },
      className: 'bw_btn bw_btn_success',
    },
  ];

  const copyActions = [
    {
      icon: 'fi fi-rr-copy',
      submit: true,
      content: 'Sao chép',
      className: 'bw_btn bw_btn_success',
    },
  ];

  const customActions = useMemo(() => {
    if (isCopy) {
      return copyActions;
    }
    if (isEdit) {
      return actions;
    } else if (receivePaymentId && methods.getValues('is_bookkeeping')) {
      // case book keeping
      // return [
      //   {
      //     icon: 'fi fi-rr-edit',
      //     submit: true,
      //     content: 'Bỏ ghi sổ',
      //     onClick: () => {
      //       methods.setValue('is_bookkeeping', 0);
      //       methods.setValue('bookeeping_status', 0);
      //     },
      //     className: 'bw_btn bw_btn_danger',
      //   },
      // ];
    }

    return null;
  }, [isCopy, isEdit, actions]);

  const customClose = purchaseOrderId
    ? () => {
      window._$g.rdr(`/purchase-orders/detail/${purchaseOrderId}`);
    }
    : undefined;

  return (
    <FormProvider {...methods}>
      <FormSection
        actions={customActions}
        loading={loading}
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={!isEdit}
        customerClose={customClose}
      />
    </FormProvider>
  );
};

export default ReceiveSlipAddPage;
