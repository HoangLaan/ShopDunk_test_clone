import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { showToast } from 'utils/helpers';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams, useHistory } from 'react-router-dom';

import {
  createStocksOutRequest,
  exportPDFStocksOut,
  exportTransport,
  getDetailStocksOutRequest,
  stocksOutputed,
  updateStocksOutRequest,
} from 'services/stocks-out-request.service';

import { showConfirmModal } from 'actions/global';
import FormSection from 'components/shared/FormSection';
import StocksOutRequestDetail from 'pages/StocksOutRequest/components/add/StocksOutRequestDetail';
import StocksOutRequestInformation from 'pages/StocksOutRequest/components/add/StocksOutRequestInformation';
import StocksOutRequestProduct from 'pages/StocksOutRequest/components/add/StocksOutRequestProduct';
import StocksOutRequestReview from 'pages/StocksOutRequest/components/add/StocksOutRequestReview';
import { getDetail as getDetailStocks } from 'services/stocks.service';

import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { REVIEW_TYPE } from 'pages/StocksOutRequest/utils/constants';
import { getOptionsOrders } from './helper/call-api';
import { useAuth } from 'context/AuthProvider';
import ConfirmExportModal from './components/add/modal/ConfirmExportModal';
import { TRANSFER_TYPE } from 'pages/StocksTransfer/helpers/const';
import { exportStocksOut, viewDemoStocksOut, viewInvoice } from 'services/misa-invoice.service';
import moment from 'moment';

const StocksOutRequestAddPage = ({ isModel }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const methods = useForm();
  const { watch } = methods;
  const { user } = useAuth();
  const [showConfirmInvoice, setShowConfirmInvoice] = useState(false);

  const { pathname, search } = useLocation();

  const { stocks_out_request_id } = useParams();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { request_id, order_id } = queryString.parse(search);
  const [managerList, setManagerList] = useState([]);

  const list_review = methods.watch('list_review') ?? [];
  const is_edit_after_review = methods.watch('is_edit_after_review');
  const lengthPending = list_review.filter((p) => parseInt(p.is_reviewed) === REVIEW_TYPE.PENDING).length;
  const lengthAcp = list_review.filter((p) => parseInt(p.is_reviewed) === REVIEW_TYPE.ACCEPT).length;
  const loading = loadingDetail;

  const isDetailRoute = useMemo(() => pathname.includes('/detail'), [pathname]);

  const disabled = useMemo(() => {
    const isWithCondition = !is_edit_after_review && stocks_out_request_id && lengthPending < list_review.length;
    if (isDetailRoute || isWithCondition) {
      return true;
    }
  }, [pathname, lengthPending, list_review]);

  // get managers of stocks
  useEffect(() => {
    const from_stocks_id = methods.watch('from_stocks_id');
    if (from_stocks_id) {
      getDetailStocks(from_stocks_id).then((data) => {
        if (data.stocks_user_manage_list) {
          setManagerList(data.stocks_user_manage_list);
        }
      });
    }
  }, [methods.watch('from_stocks_id')]);

  const viewDemoStocksOutHandler = async () => {
    try {
      setLoadingDetail(true);
      const payload = {
        RefID: watch('stocks_out_request_code'),
        StockOutAddress: watch('from_stocks_address'),
        TransporterName: watch('transport_user'),
        StockInAddress: watch('to_stocks_address'),
        InternalCommandNo: watch('stocks_out_request_code')?.trim()?.replace('PX', 'LDD'),
        InternalCommandDate: watch('stocks_out_request_date')
          ? moment(watch('stocks_out_request_date'), 'DD/MM/YYYY').format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        TransportContractCode: watch('contract_number'),
        JournalMemo: `Chyển hàng ${watch('from_stocks_name')} - ${watch('to_stocks_name')}`,
        Transport: watch('transport_vehicle'),
        OriginalInvoiceDetail: Object.values(watch('product_list')).map((item) => ({
          ItemCode: item.product_code || item.material_code,
          ItemName: item.label,
          UnitName: item.unit_name,
          Quantity: item.quantity,
          UnitPrice:
            methods.watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS
              ? Number(item?.list_imei?.reduce((acc, item) => acc + item.price, 0) / item?.list_imei.length)
              : 0, // trung bình cộng giá của các imie -> chuyển giữa các kho tổng thì mới có tính phí
          ItemType: 1,
        })),
      };

      const viewLink = await viewDemoStocksOut(payload, {
        stocks_id: watch('from_stocks_id'),
      });
      window.open(viewLink, '_blank');
    } catch (error) {
      if (error?.message) {
        showToast.warning(error?.message || 'Xem phiếu xuất kho xảy ra lỗi !');
      } else {
        showToast.error('Xem phiếu xuất kho xảy ra lỗi !');
      }
    }
    setLoadingDetail(false);
  };

  const exportStocksOutHandler = async () => {
    try {
      setLoadingDetail(true);
      const payload = {
        RefID: watch('stocks_out_request_code'),
        StockOutAddress: watch('from_stocks_address'),
        TransporterName: watch('transport_user'),
        StockInAddress: watch('to_stocks_address'),
        InternalCommandNo: watch('stocks_out_request_code')?.trim()?.replace('PX', 'LDD'),
        InternalCommandDate: watch('stocks_out_request_date')
          ? moment(watch('stocks_out_request_date'), 'DD/MM/YYYY').format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        TransportContractCode: watch('contract_number'),
        JournalMemo: `Chyển hàng ${watch('from_stocks_name')} - ${watch('to_stocks_name')}`,
        Transport: watch('transport_vehicle'),
        OriginalInvoiceDetail: Object.values(watch('product_list')).map((item) => ({
          ItemCode: item.product_code || item.material_code,
          ItemName: item.label,
          UnitName: item.unit_name,
          Quantity: item.quantity,
          UnitPrice:
            methods.watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS
              ? Number(item?.list_imei?.reduce((acc, item) => acc + item.price, 0) / item?.list_imei.length)
              : 0, // trung bình cộng giá của các imie -> chuyển giữa các kho tổng thì mới có tính phí
          ItemType: 1,
          // InWards: item.quantity,
        })),
      };

      const exportRes = await exportStocksOut(
        {
          OriginalInvoiceData: payload,
          RefID: watch('stocks_out_request_code'),
          IsSendEmail: false,
          IsInvoiceSummary: false,
          stocks_out_request_id: stocks_out_request_id,
        },
        {
          stocks_id: watch('from_stocks_id'),
        },
      );

      if (exportRes.transaction_id && exportRes.view_link) {
        methods.setValue('transaction_id', exportRes.transaction_id);
        showToast.success('Xuất phiếu thành công !');
      } else {
        showToast.error('Xuất phiếu xảy ra lỗi !');
      }
    } catch (error) {
      if (error?.message) {
        showToast.warning(error?.message || 'Xuất phiếu xuất kho xảy ra lỗi !');
      } else {
        showToast.error('Xuất phiếu xuất kho xảy ra lỗi !');
      }
    }
    setLoadingDetail(false);
  };

  const viewInvoieHanlder = async () => {
    const viewLink = await viewInvoice(methods.watch('transaction_id'));
    if (viewLink) {
      window.open(viewLink, '_blank');
    } else {
      showToast.error('Xem PXKKVCNB xảy ra lỗi !');
    }
  };

  const onSubmit = async (payload) => {
    if (list_review.length > 0) {
      let list_review_no_auto_reviewed = list_review.filter((item) => !item.is_auto_reviewed) || [];
      let check = list_review_no_auto_reviewed.some((item) => !item.user_name);
      if (check) {
        showToast.warning('Vui lòng chọn người duyệt');
        return;
      }
    }

    try {
      let label;
      payload.member_id = payload?.customer_selected?.value;
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.from_store_id = payload.from_store?.value;
      payload.to_store_id = payload.to_store?.value;
      payload.product_list = Object.values(payload.product_list || {});
      payload.request_id = request_id ? request_id : null;

      if (stocks_out_request_id) {
        label = 'Chỉnh sửa';
        await updateStocksOutRequest(stocks_out_request_id, payload);
      } else {
        label = 'Thêm mới';
        await createStocksOutRequest(payload);
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const isTransferDiffBusiness = watch('transfer_type') === TRANSFER_TYPE.DIFF_BUSINESS;
  const detailForm = [
    {
      title: 'Thông tin xuất kho',
      id: 'information',
      component: StocksOutRequestInformation,
      isTransferDiffBusiness,
    },
    {
      title: 'Yêu cầu xuất kho',
      id: 'request',
      component: StocksOutRequestDetail,
      fieldActive: [
        'business_id',
        'department_id',
        'stocks_out_type_id',
        'from_store',
        'request_user',
        'from_stocks_id',
        'customer_selected',
      ],
    },
    {
      title: 'Sản phẩm xuất kho',
      id: 'product',
      component: StocksOutRequestProduct,
      isTransferDiffBusiness,
      fieldActive: ['product_list'],
    },
    {
      title: 'Duyệt',
      id: 'review',
      component: StocksOutRequestReview,
    },
  ];

  const loadStocksOutRequest = useCallback(() => {
    if (stocks_out_request_id) {
      setLoadingDetail(true);
      getDetailStocksOutRequest(stocks_out_request_id)
        .then((e) => {
          // change title page
          if (e?.request_code?.toUpperCase().includes('PCK') && isDetailRoute) {
            const titleElement = document.getElementById('bw_form_title');
            if (titleElement) {
              titleElement.textContent = 'Chi tiết phiếu xuất kho lúc chuyển kho';
            }
          }

          methods.reset({
            ...e,
            business_id: e?.business_request_id,
            department_id: e?.department_request_id,
            from_store: {
              value: e?.from_store_id,
              label: e?.from_store_name,
            },
            customer_selected: {
              value: e?.member_id,
              label: e?.customer_full_name,
              address_full: e?.customer_address,
              phone_number: e?.customer_phone_number,
            },
            to_store: {
              value: e?.to_store_id,
              label: e?.to_store_name,
            },
          });
        })
        .finally(() => {
          setLoadingDetail(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [stocks_out_request_id]);

  useEffect(loadStocksOutRequest, [loadStocksOutRequest]);

  //Phiếu xuất kho của đơn hàng
  const loadOrderDetail = useCallback(() => {
    if (order_id) {
      getOptionsOrders({ order_id }).then((e) => {
        methods.reset((p) => ({
          ...p,
          ...e,
          from_store: {
            value: e?.from_store_id,
            label: e?.from_store_name,
          },
          customer_selected: {
            value: e?.member_id,
            label: e?.customer_full_name,
            address_full: e?.customer_address,
            phone_number: e?.customer_phone_number,
          },
        }));
      });
    }
  }, [order_id]);

  useEffect(loadOrderDetail, [loadOrderDetail]);

  const actions = [
    {
      globalAction: true,
      icon: 'fi fi-rr-check',
      type: 'success',
      submit: true,
      content: 'Lưu phiếu',
      hidden: isDetailRoute || lengthAcp,
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-caravan',
      type: 'success',
      permission: 'ST_STOCKSOUTREQUEST_WAREHOUSE',
      content: methods.watch('is_outputted') ? 'Đã xuất kho' : 'Xuất kho',
      disabled: methods.watch('is_outputted'),
      onClick: async () => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xuất kho?'],
            async () => {
              try {
                await stocksOutputed({
                  stocks_out_request_id: stocks_out_request_id,
                });
                methods.setValue('is_edit_after_review', 0);
                methods.setValue('is_outputted', 1);
                history.push(`/stocks-out-request/detail/${stocks_out_request_id}`);
              } catch (error) {
                showToast.error(error?.message ?? 'Có lỗi xảy ra', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: 'colored',
                });
              }
            },
            'Đồng ý',
          ),
        );
      },
      hidden:
        !stocks_out_request_id ||
        !(list_review?.length === lengthAcp) ||
        isDetailRoute ||
        !(user.isAdministrator || managerList?.find((_) => _.stocks_manager_user == user.user_name)),
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-print',
      type: 'success',
      content: 'In lệnh điều động',
      hidden: !(methods.watch('hidden_price') && methods.watch('is_outputted')),
      onClick: () => {
        exportTransport(stocks_out_request_id).then((result) => {
          window.open(result, '_blank');
        });
      },
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-print',
      type: 'success',
      outline: true,
      content: 'In phiếu',
      hidden: !methods.watch('is_outputted') || methods.watch('hidden_price'),
      onClick: () => {
        exportPDFStocksOut(stocks_out_request_id).then((result) => {
          window.location.href = result;
        });
      },
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-inbox-out',
      type: 'success',
      content: 'Xuất PXKKVCNB',
      hidden:
        !(methods.watch('hidden_price') && methods.watch('is_outputted')) ||
        methods.watch('transaction_id') ||
        isTransferDiffBusiness,
      onClick: () => {
        setShowConfirmInvoice(true);
      },
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-eye',
      type: 'success',
      content: 'Xem PXKKVCNB',
      hidden: !methods.watch('transaction_id') || isTransferDiffBusiness,
      onClick: () => {
        viewInvoieHanlder();
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        loading={loading}
        actions={actions}
        disabled={disabled}
        detailForm={detailForm}
        onSubmit={onSubmit}
        noSideBar={isModel}
      />
      {showConfirmInvoice ? (
        <ConfirmExportModal
          onClose={() => {
            setShowConfirmInvoice(false);
          }}
          exportInvoice={exportStocksOutHandler}
          viewDemoStocksOut={viewDemoStocksOutHandler}
          viewStocksOut={viewInvoieHanlder}
        />
      ) : null}
    </FormProvider>
  );
};

export default StocksOutRequestAddPage;
