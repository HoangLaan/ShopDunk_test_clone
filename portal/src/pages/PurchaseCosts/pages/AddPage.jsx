import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

import { DEFMATHTOTALACCOUNT, PAYMENTSTATUS, PAYMENT_TYPE } from '../utils/constants';
import FormSection from 'components/shared/FormSection';
import Information from '../components/FormSection/Infomation';
import ProductStocksInRequest from '../components/FormSection/ProductStocksInRequest';
import AcocuntingForm from '../components/FormSection/Accounting';
import Status from '../components/FormSection/Status';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { showToast } from 'utils/helpers';
import { PAYMENTTYPE } from 'pages/ReceivePaymentSlipCash/utils/constants';

import servicePurchaseCost from 'services/purchase-cost.service';
import ICON_COMMON from 'utils/icons.common';
import { STATUS_PAYMENT } from 'pages/PurchaseOrder/utils/constants';

const ReceiveSlipAddPage = ({ purchaseCostId = null, receivePaymentType, isEdit = true }) => {
  const methods = useForm();
  const { handleSubmit, watch, getValues } = methods;
  const { payment_form_id } = watch();
  const { pathname } = useLocation();
  const history = useHistory();
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const isView = useMemo(() => pathname.includes('/detail'), [pathname]);

  // tài khoảng thanh toán
  const [deptAccountingAccountOpts, setDeptAccountingAccountOpts] = useState([]);
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);
  const [realPaymentStatus, setRealPaymentStatus] = useState(STATUS_PAYMENT.UNPAID);

  const payment_slip_list = watch('payment_slip_list');
  const is_payments_status_id = watch('is_payments_status_id');

  const debtList = {
    331: deptAccountingAccountOpts.find((x) => x.name === '331')?.id,
    156: deptAccountingAccountOpts.find((x) => x.name === '156')?.id,
    1331: deptAccountingAccountOpts.find((x) => x.name === '1331')?.id,
  };
  const creditList = {
    '111_1121': creditAccountingAccountOpts.find((x) => x.name === '111' || x.name === '1121')?.id,
    331: creditAccountingAccountOpts.find((x) => x.name === '331')?.id,
    111: creditAccountingAccountOpts.find((x) => x.name === '111')?.id,
    1111: creditAccountingAccountOpts.find((x) => x.name === '1111')?.id,
    1121: creditAccountingAccountOpts.find((x) => x.name === '1121')?.id,
  };

  useEffect(() => {
    getDeptAccountOpts().then(setDeptAccountingAccountOpts);
    getCreditAccountOpts().then(setCreditAccountingAccountOpts);
  }, []);
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  if (searchParams.get('type')) {
    receivePaymentType = Number(searchParams.get('type'));
  }

  const [loading, setLoading] = useState(false);

  const loadPurchaseCostDetail = useCallback(() => {
    try {
      if (purchaseCostId) {
        setLoading(true);
        servicePurchaseCost.getDetailPurchaseCost(purchaseCostId).then((response) => {
          if (response) {
            const accounting_list_unique = [];
            for (const item of response?.accounting_list ?? []) {
              if (accounting_list_unique.find((ac) => ac.purchase_cost_detail_id === item.purchase_cost_detail_id))
                continue;
              accounting_list_unique.push(item);
            }
            methods.reset({
              ...response,
              accounting_list: accounting_list_unique,
              accounting_list_begin: response?.accounting_list,
            });
            setRealPaymentStatus(response.is_payments_status_id);
          }
        });
        setLoading(false);
      } else {
        methods.reset({
          is_active: 1,
          payment_status: PAYMENTSTATUS.PAID,
          payment_date: moment().format('DD/MM/YYYY'),
          accounting_date: moment().format('DD/MM/YYYY'),
          currency_type: 1,
          attachment_count: 0,
          payment_type: 1,
        });
      }
    } catch (error) {
      showToast.error(error?.message || 'Đã xảy ra lỗi !');
    }
  }, []);

  useEffect(loadPurchaseCostDetail, [loadPurchaseCostDetail]);

  const onSubmit = async (payload) => {
    const accountingList = methods.getValues('accounting_list') || [];
    try {
      accountingList.length === 0 && showToast.warning('Hạch toán là bắt buộc !');
      await servicePurchaseCost.createPurchaseCost(payload);
      let defendLabel = 'Thêm mới';
      if (purchaseCostId) {
        defendLabel = 'Cập nhật';
      }
      showToast.success(`${defendLabel} chi phí mua hàng thành công`);

      if (!purchaseCostId) {
        methods.reset({});
      }
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra !');
    }
  };

  const detailForm = useMemo(
    () => [
      {
        id: 'infomation',
        title: 'Thông tin chi phí mua hàng',
        component: Information,
        fieldActive: [
          'cost_type_id',
          'supplier_code',
          'tax_code',
          'supplier_id',
          'is_payments_status_id',
          'order_status_id',
          'payment_form_id',
        ],
        realPaymentStatus: realPaymentStatus,
      },
      {
        id: 'products',
        title: 'Mã đơn mua hàng',
        fieldActive: ['products_list'],
        component: ProductStocksInRequest,
      },
      {
        id: 'accounting',
        title: 'Chi phí',
        fieldActive: ['accounting_list'],
        component: AcocuntingForm,
      },
      {
        id: 'status',
        title: 'Trạng thái',
        fieldActive: ['is_active'],
        component: Status,
      },
    ],
    [realPaymentStatus],
  );

  const actions = [
    {
      content: 'Thanh toán',
      icon: ICON_COMMON.money,
      className: 'bw_btn bw_btn_warning',
      hidden: isAdd || +realPaymentStatus === STATUS_PAYMENT.PAID || !watch('payment_form_id'),
      onClick: async () => {
        if (payment_form_id !== PAYMENT_TYPE.TRANSFER && payment_form_id !== PAYMENT_TYPE.CASH) {
          return showToast.warning('Vui lòng chọn hình thức thanh toán');
        }
        if (payment_form_id === PAYMENT_TYPE.TRANSFER) {
          history.push(`/receive-payment-slip-credit/add?type=2`, {
            purchaseCostId: purchaseCostId,
            debt_account: debtList['331'],
            credit_account: creditList['111_1121'],
            total_money: watch(`${DEFMATHTOTALACCOUNT}_money`),
            payment_date: watch('payment_date'),
          });
        }
        if (payment_form_id === PAYMENT_TYPE.CASH) {
          history.push(`/receive-payment-slip-cash/add?type=2`, {
            purchaseCostId: purchaseCostId,
            debt_account: debtList['331'],
            credit_account: creditList['1111'],
            total_money: watch(`${DEFMATHTOTALACCOUNT}_money`),
            payment_date: watch('payment_date'),
          });
        }
      },
    },
    {
      globalAction: true,
      icon: ICON_COMMON.money,
      type: 'success',
      submit: false,
      content: 'Xem phiếu chi',
      hidden: !payment_slip_list?.length,
      onClick: () => {
        if (payment_slip_list?.length > 0) {
          for (let i = 0; i < payment_slip_list.length; i++) {
            if (+payment_slip_list[i]?.payment_type === PAYMENTTYPE.CASH)
              window.open(
                `/receive-payment-slip-cash/detail/${payment_slip_list[i]?.payment_slip_id}`,
                '_blank',
                'rel=noopener noreferrer',
              );
            else
              window.open(
                `/receive-payment-slip-credit/detail/${payment_slip_list[i]?.payment_slip_id}`,
                '_blank',
                'rel=noopener noreferrer',
              );
          }
        }
      },
    },
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      submit: false,
      content: !isEdit ? 'Chỉnh sửa' : purchaseCostId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (isView) window._$g.rdr('/purchase-cost/edit/' + purchaseCostId);
        else onSubmit(getValues());
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection actions={actions} loading={loading} detailForm={detailForm} onSubmit={onSubmit} disabled={!isEdit} />
    </FormProvider>
  );
};

export default ReceiveSlipAddPage;
