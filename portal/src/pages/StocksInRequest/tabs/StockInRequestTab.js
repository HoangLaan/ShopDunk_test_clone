import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { cdnPath } from 'utils/index';
import { useAuth } from 'context/AuthProvider';
import FormSection from 'components/shared/FormSection';
import {
  create,
  update,
  getDetail,
  genStocksInCode,
  getListStocksManager,
  createStocksDetail,
  exportPDF,
  genLotNumber,
} from 'services/stocks-in-request.service';
//components
import Information from 'pages/StocksInRequest/components/Information';
import Request from 'pages/StocksInRequest/components/Request';
import Review from 'pages/StocksInRequest/components/Review';
import ProductImport from 'pages/StocksInRequest/components/ProductImport';
import { REVIEW_TYPE } from 'pages/StocksInRequest/components/utils/constants';

import BWLoader from 'components/shared/BWLoader/index';

import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { showConfirmModal } from 'actions/global';
import { getDetailPurchaseOrder } from 'pages/PurchaseOrder/helpers/call-api';
import { detailRequestPurchaseByCode, detailRequestPurchaseByMulti } from 'services/request-purchase-order.service';
import { checkProductInventory } from 'pages/StocksTransfer/helpers/call-api';
import { calculateOutStocks } from 'services/stocks-detail.service';
import Loading from 'components/shared/Loading';


const StocksInRequestAddPage = ({ isModal = false, onClose, dataModal, location, setpurchaseOrder }) => {
  const { user } = useAuth();
  const panelContext = useFormContext();

  const search = useLocation().search;
  const state = useLocation().state;

  const searchParams = new URLSearchParams(search);
  const purchaseOrderId = searchParams.get('purchase_order_id');
  const { purchase_order_code } = state || {};
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      products_list: [],
      is_apply_unit_price: 1,
    },
  });
  const { watch } = methods;
  const { pathname } = useLocation();
  const { stocks_in_request_id } = useParams();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loading, setLoading] = useState(false);

  const review_level_list = methods.watch('review_level_list') ?? [];

  const lengthAccept = review_level_list.filter((p) => parseInt(p.is_reviewed) === REVIEW_TYPE.ACCEPT).length;

  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [optionsReceiver, setOptionsReceiver] = useState([]);

  const isCanImport = useMemo(
    () => optionsReceiver.findIndex((_) => _.id === user.user_name) === -1,
    [optionsReceiver, user.user_name],
  );

  const [isReady, setIsReady] = useState(false);
  const [locationPurchaseOrder, setLocationPurchaseOrder] = useState({});

  const onSubmit = async (payload) => {
    methods.clearErrors();

    try {
      payload.request_id = dataModal?.request_id ?? null;
      payload.request_id = dataModal?.request_code ?? null;
      setLoading(true);
      if (stocks_in_request_id) {
        await update(stocks_in_request_id, payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        create(payload).then(() => {
          setLoading(false);
          showToast.success('Thêm mới thành công');
        }).catch((err) => {
          setLoading(false); 
          showToast.error(err?.message);
        });
        methods.reset({
          is_active: 1,
          is_reviewed: 2,
          status_reviewed: 2,
          is_imported: 0,
          cost_type_list: [],
          review_level_list: [],
          products_list: [],
          created_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
          stocks_in_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
          created_user: `${user.user_name} - ${user.full_name}`,
          is_apply_unit_price: 1,
        });
      }
    } catch (error) {
      setLoading(false);
      showToast.error('Có lỗi xảy ra');
    }
  };
  const purchase_Order_Id = watch('purchase_order_id')
  // load purchase order detail by id 
  useEffect(() => {
    if (purchase_Order_Id) {
      getDetailPurchaseOrder(purchase_Order_Id).then((data) => {
        setpurchaseOrder(data);
      });
    }
  }, [setpurchaseOrder, purchase_Order_Id]);

  useEffect(() => {
    if(purchaseOrderId){
      setpurchaseOrder({purchase_order_id: purchaseOrderId})
    }
  }, [purchaseOrderId])

  const handleExportPDF = (stocks_in_request_id) => {
    setLoadingPdf(true);
    exportPDF({ stocks_in_request_id })
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  const loadStocksInRequestDetail = useCallback(() => {
    if (stocks_in_request_id) {
      getDetail(stocks_in_request_id).then((value) => {
        watch('purchase_order_id', value?.purchase_order_id);
        setpurchaseOrder(value)
        if (value?.stocks_id) {
          getListStocksManager(value?.stocks_id).then((data) => {
            setOptionsReceiver(mapDataOptions4SelectCustom(data?.items));
          });
        }
        methods.reset(value);
        setIsReady(true);
      });
    } else {
      const initData = async () => {
        const codeRes = await genStocksInCode();
        let initForm = {
          stocks_in_code: codeRes.stocks_in_code.trim(),
          is_active: 1,
          created_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
          stocks_in_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
          created_user: `${user.user_name} - ${user.full_name}`,
          is_reviewed: 2,
          status_reviewed: 2,
          is_imported: 0,
          is_apply_unit_price: 1,
          request_code: dataModal?.request_code ?? null,
          products_list: dataModal?.products ?? [],
          request_id: dataModal?.request_id ?? null,
          ...(await genLotNumber()),
        };

        if (purchaseOrderId) {
          const purchaseRes = await getDetailPurchaseOrder(purchaseOrderId);
          if (purchaseRes.request_purchase_code?.length === 1) {
            const requestRes = await detailRequestPurchaseByCode(
              purchaseRes.request_purchase_code[0].request_purchase_code,
            );
            initForm = {
              ...initForm,
              // Set lại quantity trừ đi số lượng đã nhập kho
              products_list: purchaseRes.product_list.map((item) => ({
                ...item,
                quantity: item.quantity - item.warehoused_quantity,
              })),
              business_request_id: requestRes.business_request_id?.toString(),
              business_receive_id: requestRes.business_receive_id?.toString(),
              store_id: requestRes.store_receive_id,
              supplier_id: requestRes.supplier_id,
              // request_code: purchaseRes.request_purchase_code[0].request_purchase_code,
              request_code: purchase_order_code || purchaseRes.request_purchase_code[0].request_purchase_code,
              department_request_id: purchaseRes.department_id,
              request_user: purchaseRes.created_user?.split(' - ')[0],
              stocks_id: purchaseRes.expected_imported_stock_id,
            };
            setLocationPurchaseOrder({ purchase: purchaseRes, request: requestRes });
          } else {
            const requestRes = await detailRequestPurchaseByMulti(purchaseRes.request_purchase_code);
            const request_code = purchaseRes?.request_purchase_code?.map((x) => x.request_purchase_code).join(', ');
            initForm = {
              ...initForm,
              products_list: purchaseRes.product_list,
              business_request_id: requestRes.business_request_id?.toString(),
              business_receive_id: requestRes.business_receive_id?.toString(),
              store_id: requestRes.store_receive_id,
              supplier_id: requestRes.supplier_id,
              // request_code: request_code,
              request_code: purchase_order_code || request_code,
              department_request_id: purchaseRes.department_id,
              request_user: purchaseRes.created_user?.split(' - ')[0],
            };
            setLocationPurchaseOrder({ purchase: purchaseRes, request: requestRes });
          }
        }
        methods.reset(initForm);
        setIsReady(true);
      };
      initData();
    }
  }, [stocks_in_request_id, methods, user.user_name, user.full_name, dataModal?.request_code, dataModal?.products, dataModal?.request_id, purchaseOrderId, purchase_order_code]);

  useEffect(loadStocksInRequestDetail, [loadStocksInRequestDetail]);

  const handleImportStock = async (values) => {
    try {
      if (stocks_in_request_id) {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn nhập kho không?'],
            async () => {
              try {
                if (values.find((v) => v.skus.find((item) => item.sku === '')))
                  return showToast.error('IMEI/Serial Number không được để trống!');
                // get imies
                const skus_list = values.map((_) => _.skus).flat();
                setLoading(true);
                const productStatus = await checkProductInventory({
                  imies: skus_list.map((_) => _.sku)?.join('|'),
                });
                // nếu có sản phẩm nào còn tồn trong kho thì không cho nhập kho
                const products = productStatus.filter((_) => _.STATUS === 0 || _.STATUS === 1);
                if (productStatus && products?.length > 0) {
                  showToast.warning(
                    `Sản phẩm ${products
                      .map((_) => _.IMEI)
                      .join(', ')} vẫn còn tồn trong kho khác, không thể nhập kho !`,
                  );
                  setLoading(false);
                  return;
                }
                await update(stocks_in_request_id, {
                  ...methods.watch(),
                  stocks_in_date: moment(new Date(), 'DD/MM/yyyy').format('DD/MM/yyyy'),
                });
                await createStocksDetail({
                  products_list: values,
                  stocks_id: methods.watch('stocks_id'),
                  is_reviewed: methods.watch('status_reviewed'),
                  is_imported: methods.watch('is_imported'),
                  request_code: methods.watch('request_code'),
                  request_id: methods.watch('request_id'),
                  is_transfer: methods.watch('stocks_in_type')?.is_transfer,
                });

                // Tính lại giá xuất kho
                const currentDate = moment().format('DD/MM/YYYY');
                await calculateOutStocks({
                  calculate_method: 3,
                  stocks_type_list: [{ id: watch('stocks_type_id') }],
                  choose_calculate_goods: 1,
                  selected_product: values.map((item) => ({ product_id: item.product_id })),
                  start_date: currentDate,
                  end_date: currentDate,
                  period: 1,
                  calculate_according_stocks: 1,
                  stocks_id: methods.watch('stocks_id'),
                });
                setLoading(false);
                showToast.success(`Nhập kho thành công`);
                loadStocksInRequestDetail();
              } catch (error) {
                setLoading(false);
                showToast.error(error.message);
              }
            },
            'Đồng ý',
          ),
        );
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  //lay người nhập = người quản lý kho
  const getStocksManager = useCallback(() => {
    if (methods.watch('stocks_id')) {
      getListStocksManager(methods.watch('stocks_id')).then((data) => {
        setOptionsReceiver(mapDataOptions4SelectCustom(data?.items));
      });
    }
  }, [watch, methods, getListStocksManager]);

  useEffect(getStocksManager, [getStocksManager]);

  const detailForm = [
    {
      title: 'Thông tin phiếu nhập kho',
      id: 'information',
      component: Information,
      fieldActive: ['stocks_in_code', 'created_date', 'created_user', 'status_reviewed'],
    },
    {
      id: 'request',
      title: 'Yêu cầu nhập kho',
      component: Request,
      locationPurchaseOrder: locationPurchaseOrder,
      isDisassembleComponent: dataModal?.is_disassemble_component ?? null,
      fieldActive:
        methods.watch('stocks_in_type_id') == 3
          ? [
            'stocks_in_type_id',
            // 'receiver_name',
            'stocks_id',
            // 'member_id'
          ]
          : methods.watch('stocks_in_type_id') == 1
            ? [
              'business_request_id',
              'stocks_in_type_id',
              // 'supplier_id',
              // 'department_request_id',
              // 'request_user',
              'stocks_id',
            ]
            : [
              'stocks_in_type_id',
              // 'receiver_name',
              'stocks_id',
              // 'member_id'
            ],
    },
    {
      id: 'product',
      title: 'Sản phẩm nhập kho',
      component: ProductImport,
      locationPurchaseOrder: locationPurchaseOrder,
      fieldActive: ['products_list[0]', 'cost_type_list[0]'],
    },
    {
      id: 'review',
      title: 'Duyệt',
      component: Review,
      fieldActive: ['review_level_list'],
      loadStocksInRequestDetail: loadStocksInRequestDetail,
    },
  ];
  const actions = [
    {
      globalAction: true,
      icon: 'fi fi-rr-check',
      type: 'success',
      submit: true,
      content: 'Lưu phiếu',
      hidden: disabled || methods.watch('status_reviewed') === 1,
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-check',
      type: 'success',
      content: methods.watch('is_imported') ? 'Đã nhập kho' : 'Nhập kho',
      disabled: methods.watch('is_imported'),
      onClick: async () => {
        handleImportStock(methods.watch('products_list'));
        if (methods.watch('is_imported')) loadStocksInRequestDetail();
      },
      hidden: !stocks_in_request_id || !(review_level_list.length === lengthAccept) || isCanImport,
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-print',
      type: 'success',
      outline: true,
      content: 'In phiếu',
      hidden: !stocks_in_request_id || !(review_level_list.length === lengthAccept),
      onClick: () => {
        handleExportPDF(stocks_in_request_id);
      },
    },
  ];

  const customClose = purchaseOrderId
    ? () => {
      window._$g.rdr(`/purchase-orders/detail/${purchaseOrderId}`);
    }
    : undefined;

  return (
    <React.Fragment>
      {!isModal ? (
        isReady && (
          <FormProvider {...methods}>
            {loadingPdf && <BWLoader isPage={false} />}
            <FormSection
              detailForm={detailForm}
              onSubmit={onSubmit}
              disabled={disabled}
              actions={actions}
              loading={loading}
              customerClose={customClose}
            />
          </FormProvider>
        )
      ) : (
        <div className='bw_modal bw_modal_open' id='bw_add_stocks_out'>
          <div className='bw_modal_container bw_w900 '>
            <div className='bw_title_modal'>
              <h3>Thêm mới phiếu nhập</h3>
              <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
            </div>
            <FormProvider {...methods}>
              {loading && <Loading />}
              {isReady && <FormSection disabled={disabled} detailForm={detailForm} noSideBar={true} noActions={true} />}
            </FormProvider>
            <div className='bw_footer_modal' style={{ marginTop: -20 }}>
              <button type='button' onClick={methods.handleSubmit(onSubmit)} className='bw_btn bw_btn_success'>
                Lưu phiếu
              </button>
              <button onClick={onClose} className='bw_btn_outline bw_close_modal'>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && <Loading />}
    </React.Fragment>
  );
};

export default StocksInRequestAddPage;
