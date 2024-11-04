import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import moment from 'moment';

import FormSection from 'components/shared/FormSection/index';
import { useAuth } from 'context/AuthProvider';
import {
  createPurchaseOrder,
  genPurchaseOrderId,
  getDetailPurchaseOrder,
  updatePurchaseOrder,
} from '../helpers/call-api';
import { detailRequestPurchaseByCode, detailRequestPurchaseByMulti } from 'services/request-purchase-order.service';
import PurchaseOrdersInfo from '../components/PurchaseOrdersForm';
import PurchaseOrdersNote from '../components/PurchaseOrdersNote';
import PurchaseOrdersStatus from '../components/PurchaseOrdersStatus';
import PurchaseOrdersProductListTable from '../components/PurchaseOrdersProductListTable';
import { showToast } from 'utils/helpers';
import usePageInformation from 'hooks/usePageInformation';
import { PAYMENT_TYPE, STATUS_PAYMENT } from '../utils/constants';
import ICON_COMMON from 'utils/icons.common';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { StyledPurchaseOrderAdd } from '../helpers/styles';
// import useDetectHookFormChange from 'hooks/useDetectHookFormChange';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { PAYMENTTYPE } from 'pages/ReceivePaymentSlipCash/utils/constants';
import { INVOCIE_STATUS } from '../helpers/constants';

const PurchaseOrdersAdd = ({ setpurchaseOrder }) => {
  const methods = useForm({});
  const globalMethods = useFormContext();
  const history = useHistory();
  const location = history.location;
  const { watch } = methods;
  const { user } = useAuth();
  const { id: purchase_order_id, disabled: pageDisabled, isAdd } = usePageInformation();
  const { request_purchase_code, request_purchase_id } = location?.state || {};
  const locationPOList = location?.state?.po_list?.map((x) => ({ ...x, value: String(x.value) }));
  const [redirectFrom, setRedirectFrom] = useState(location?.state?.redirect_from);
  const { stocks_id, payment_id, payment_type, is_payments_status_id } = methods.watch();
  const isShowPaymentDetail = Boolean(purchase_order_id) && payment_id && payment_type && is_payments_status_id === 1;
  const isShowStocksDetail = Boolean(purchase_order_id);

  const disabled = pageDisabled || (isShowPaymentDetail && isShowStocksDetail);

  const supplier_id = methods.watch('supplier_id');
  const purchase_order_code = methods.watch('purchase_order_code');
  const payment_slip_list = methods.watch('payment_slip_list');
  const po_division_list = methods.watch('po_division_list');
  const stocks_in_request_list = methods.watch('stocks_in_request_list');
  const optionsSupplier = useGetOptions(optionType.supplier);

  const [deptAccountingAccountOpts, setDeptAccountingAccountOpts] = useState([]);
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);

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

  const [isShowWarehouseBtn, setIsShowWarehouseBtn] = useState(false);
  const [isDividedBtn, setIsDividedBtn] = useState(false);
  const product_list = useMemo(() => watch('product_list') ?? [], [watch('product_list')]);
  const calTotal = (field) => product_list.reduce((acc, p) => (acc += p[field] ?? 0), 0);

  useEffect(() => {
    if (product_list.length === 0) return;
    const loadStatusOfBtns = async () => {
      product_list.forEach((prod) => {
        if (prod?.quantity > (prod?.warehoused_quantity ?? 0)) {
          setIsShowWarehouseBtn(true);
        }
        if (prod?.quantity > (prod?.divided_quantity ?? 0)) {
          setIsDividedBtn(true);
        }
      });
      // Nếu tổng số lượng chia >= tổng số lượng thì ko cho nhập kho nữa
      if (calTotal('divided_quantity') >= calTotal('quantity')) setIsShowWarehouseBtn(false);
    };
    loadStatusOfBtns();
  }, [watch('product_list')]);

  const orderNoteGenerate = useMemo(() => {
    const supplier = optionsSupplier.find((item) => item.value === supplier_id);
    if (!supplier) return '';
    return `Mua hàng của "${supplier.name}" Theo Mã đơn mua hàng "${purchase_order_code}"`;
  }, [supplier_id, optionsSupplier, purchase_order_code]);

  useEffect(() => {
    if (isAdd && orderNoteGenerate) {
      methods.setValue('order_note', orderNoteGenerate);
    }
  }, [isAdd, orderNoteGenerate]);

  useEffect(() => {
    getDeptAccountOpts().then(setDeptAccountingAccountOpts);
    getCreditAccountOpts().then(setCreditAccountingAccountOpts);
  }, []);

  const defaultForm = {
    is_active: 1,
    created_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
    created_user: `${user.user_name} - ${user.full_name}`,
    order_status: 1,
    payment_status: 0,
    invoice_status: INVOCIE_STATUS.NOT_HAVE,
    is_payments_status_id: STATUS_PAYMENT.UNPAID,
  };

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      if (!payload.product_list || payload.product_list.length === 0) {
        showToast.warning('Danh sách sản phẩm không được để trống');
        return;
      }
      if (purchase_order_id) {
        await updatePurchaseOrder({ ...payload, purchase_order_id });
        showToast.success('Chỉnh sửa thành công');
        methods.setValue('order_status_saved', payload.order_status);
        methods.setValue('payment_type_saved', payload.payment_type);
      } else {
        await createPurchaseOrder(payload);
        showToast.success('Thêm mới thành công');
        window._$g.rdr('/purchase-orders');
      }
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra');
    }
  };

  // useDetectHookFormChange(methods);

  const loadDetail = useCallback(() => {
    if (purchase_order_id) {
      const getByPoId = async () => {
        const res = await getDetailPurchaseOrder(purchase_order_id);
        methods.reset({ ...res });
        methods.setValue('order_status_saved', res.order_status);
        methods.setValue('payment_type_saved', res.payment_type);
        setpurchaseOrder(res);
      };
      getByPoId();
      return;
    }

    const fetchInitData = async () => {
      const purchase_order_code = await genPurchaseOrderId();

      if (request_purchase_code) {
        detailRequestPurchaseByCode(request_purchase_code).then((response) => {
          if (response.request_purchase_id) {
            methods.reset({
              ...defaultForm,
              company_id: String(response.company_id),
              product_list: response.product_list.map((x) => ({ ...x, cost_price: x.rpo_price })),
              supplier_id: response.supplier_id,
              discount_program_id: response.discount_program_id,
              request_purchase_code: request_purchase_code,
              purchase_order_code,
            });
            return;
          }
        });
      } else {
        let res;
        if (locationPOList?.length) {
          res = await detailRequestPurchaseByMulti(locationPOList);
        }
        methods.reset({
          ...defaultForm,
          company_id: res?.company_id ? String(res.company_id) : null,
          request_purchase_code: locationPOList?.length ? locationPOList : [],
          // Nếu có số lượng dự kiến (quantity_reality) sẽ không lấy số lượng đề xuất (quantity_expected)
          product_list: res?.product_list.map((x) => ({
            ...x,
            cost_price: x.rpo_price,
            quantity: (x.quantity_reality ?? 0) === 0 ? x.quantity_expected ?? 0 : x.quantity_reality ?? 0,
            origin_quantity: (x.quantity_reality ?? 0) === 0 ? x.quantity_expected ?? 0 : x.quantity_reality ?? 0,
          })),
          supplier_id: res?.supplier_id,
          discount_program_id: res?.discount_program_id,
          purchase_order_code,
          editable: redirectFrom ? 0 : 1,
        });
      }
    };
    fetchInitData();
  }, [purchase_order_id, globalMethods.watch('reload')]);

  useEffect(loadDetail, [loadDetail, globalMethods.watch('reload')]);

  useEffect(() => {
    const headerDom = document.querySelector('header');
    if (headerDom) {
      headerDom.style.position = 'sticky';
      headerDom.style.top = 0;
      headerDom.style.background = '#f8f8f8';
    }
    return () => {
      if (headerDom) {
        headerDom.style.position = '';
        headerDom.style.top = '';
        headerDom.style.background = '';
      }
    };
  }, []);

  // console.log('Thông tin đơn mua hàng', methods.watch())
  // useDetectHookFormChange(methods)

  const detailForm = [
    {
      title: 'Thông tin đơn mua hàng',
      id: 'information',
      component: PurchaseOrdersInfo,
      defaultForm,
      fieldActive: [
        'purchase_order_code',
        'company_id',
        'supplier_id',
        'order_status',
        'is_payments_status_id',
        'expected_date',
        'created_user',
        'created_date',
      ],
      disabled,
      isShowPaymentDetail,
    },
    {
      id: 'review',
      title: 'Thông tin sản phẩm',
      component: PurchaseOrdersProductListTable,
      fieldActive: ['product_list'],
      disabled,
    },

    {
      title: 'Ghi chú',
      id: 'order_note',
      component: PurchaseOrdersNote,
      fieldActive: ['order_note'],
      disabled,
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: PurchaseOrdersStatus,
      disabled,
    },
  ];

  const actions = [
    // {
    //   content: 'Thanh toán',
    //   icon: ICON_COMMON.money,
    //   className: 'bw_btn bw_btn_warning',
    //   isShow: !isShowPaymentDetail && purchase_order_id,
    //   onClick: async () => {
    //     if (payment_type !== PAYMENT_TYPE.TRANSFER && payment_type !== PAYMENT_TYPE.CASH) {
    //       return showToast.warning('Vui lòng chọn hình thức thanh toán');
    //     }
    //     const total_price_all =
    //       (parseInt(watch('total_price_all')) || 0) -
    //       (payment_slip_list || []).reduce((acc, curr) => acc + (parseInt(curr.total_money) || 0), 0);

    //     if (payment_type === PAYMENT_TYPE.TRANSFER && !stocks_id) {
    //       history.push(`/receive-payment-slip-credit/add?type=2`, {
    //         purchase_order_id,
    //         debt_account: debtList['331'],
    //         credit_account: creditList['1121'],
    //         total_price_all: total_price_all,
    //       });
    //     }
    //     if (payment_type === PAYMENT_TYPE.TRANSFER && stocks_id) {
    //       history.push(`/receive-payment-slip-credit/add?type=2`, {
    //         purchase_order_id,
    //         debt_account: debtList['156'],
    //         credit_account: creditList['1121'],
    //         total_price_all: total_price_all,
    //       });
    //     }
    //     if (payment_type === PAYMENT_TYPE.CASH && !stocks_id) {
    //       history.push(`/receive-payment-slip-cash/add?type=2`, {
    //         purchase_order_id,
    //         debt_account: debtList['331'],
    //         credit_account: creditList['1111'],
    //         total_price_all: total_price_all,
    //       });
    //     }
    //     if (payment_type === PAYMENT_TYPE.CASH && stocks_id) {
    //       history.push(`/receive-payment-slip-cash/add?type=2`, {
    //         purchase_order_id,
    //         debt_account: debtList['156'],
    //         credit_account: creditList['331'],
    //         total_price_all: total_price_all,
    //       });
    //     }
    //   },
    // },
    {
      globalAction: true,
      icon: ICON_COMMON.money,
      type: 'success',
      submit: false,
      className: 'bw_btn bw_btn_watch',
      content: 'Xem phiếu chi',
      isShow: !!payment_slip_list?.length,
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
    // {
    //   content: 'Xem phiếu thanh toán',
    //   icon: ICON_COMMON.money,
    //   className: 'bw_btn bw_btn_warning',
    //   isShow: isShowPaymentDetail,
    //   onClick: () => {
    //     if (payment_type === PAYMENT_TYPE.CASH) {
    //       history.push(`/receive-payment-slip-cash/detail/${payment_id}_2`);
    //     }
    //     if (payment_type === PAYMENT_TYPE.TRANSFER) {
    //       history.push(`/receive-payment-slip-credit/detail/${payment_id}_2`);
    //     }
    //   },
    // },
    {
      content: 'Tạo PNK',
      icon: 'fi fi-rr-add-document',
      className: 'bw_btn bw_btn_warning',
      isShow: Boolean(purchase_order_id) && isShowWarehouseBtn,
      // onClick: () => history.push(`/stocks-in-request/add?purchase_order_id=${purchase_order_id}`),
      onClick: () => {
        history.push(`/stocks-in-request/add?tab_active=stocks_in_request&purchase_order_id=${purchase_order_id}`, {
          purchase_order_code: watch('purchase_order_code'),
        });
      },
    },
    {
      content: 'Xem PNK',
      icon: ICON_COMMON.view,
      className: 'bw_btn bw_btn_watch',
      isShow: !!stocks_in_request_list?.length,
      onClick: () => {
        if (stocks_in_request_list?.length > 0) {
          for (let i = 0; i < stocks_in_request_list.length; i++) {
            window.open(
              `/stocks-in-request/detail/${stocks_in_request_list[i]?.stocks_in_request_id}`,
              '_blank',
              'rel=noopener noreferrer',
            );
          }
        }
      },
    },
    {
      content: 'Tạo PCH',
      icon: 'fi fi-rr-add-document',
      className: 'bw_btn bw_btn_warning',
      isShow: isShowStocksDetail && isDividedBtn,
      onClick: () => history.push(`/purchase-order-division/add?purchase_order_id=${purchase_order_id}`),
    },
    {
      content: 'Xem PCH',
      icon: ICON_COMMON.view,
      className: 'bw_btn bw_btn_watch',
      isShow: !!po_division_list?.length,
      onClick: () => {
        if (po_division_list?.length > 0) {
          for (let i = 0; i < po_division_list.length; i++) {
            window.open(
              `/purchase-order-division/detail/${po_division_list[i]?.purchase_order_division_id}`,
              '_blank',
              'rel=noopener noreferrer',
            );
          }
        }
      },
    },
    {
      globalAction: true,
      className: 'bw_btn bw_btn_success',
      icon: ICON_COMMON.save,
      type: 'success',
      isShow: !isShowPaymentDetail || !isShowStocksDetail,
      content: disabled ? 'Chỉnh sửa' : purchase_order_id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr(`/purchase-orders/edit/${purchase_order_id}`);
        else methods.handleSubmit(onSubmit)();
      },
    },
  ].filter((x) => x.isShow);

  return (
    <FormProvider {...methods}>
      <StyledPurchaseOrderAdd>
        <FormSection
          actions={actions}
          detailForm={detailForm}
          onSubmit={onSubmit}
          disabled={disabled}
          customerClose={
            request_purchase_id && request_purchase_code ? () => window._$g.rdr('/request-purchase-order') : undefined
          }
        />
      </StyledPurchaseOrderAdd>
    </FormProvider>
  );
};

export default PurchaseOrdersAdd;
