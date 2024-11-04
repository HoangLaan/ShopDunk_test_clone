import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import '../../style.scss';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import {
  getListProduct,
  getOptionProduct,
  deleteProductShopee,
  updateStocks,
  updateProductShopee,
  getListOrder,
  printShipping,
  getOptionShipping,
} from '../../helpers/call-api-shopee';

import { convertArrayToObjectShopee } from '../../helpers/constaint';

import { cdnPath } from 'utils/index';
import { showToast } from 'utils/helpers';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
// Components
import Panel from 'components/shared/Panel/index';
import useQueryString from 'hooks/use-query-string';
import BWLoadingPage from 'components/shared/BWLoadingPage';
import TableProductShopee from './TableProduct';
import FilterManager from './FilterManager';
import TableOrderShopee from './TableOrder';
import FilterOrder from './FilterOrder';
import ModalShippingOrder from './ShippingOrderForm';
import ModalCancelOrder from './CancelOrderForm';
import { triggerSidebar } from 'actions/global';

const PageManagerShopee = () => {
  const { id } = useParams();
  const [query, setQuery] = useQueryString();
  const tab_active = query?.tab_active ?? '';
  const dispatch = useDispatch();
  let id_redux = useSelector((state) => state?.shopProfile?.shop?.shop_id);
  const shop_id = id_redux ? id_redux : id;
  const methods = useForm();

  const [params, setParams] = useState({
    itemsPerPage: 10,
    page: 1,
  });

  const [paramsOrder, setParamsOrder] = useState({
    itemsPerPage: 10,
    page: 1,
    start_date: dayjs(new Date()).subtract(14, 'day').format('DD/MM/YYYY'),
    end_date: dayjs(new Date()).format('DD/MM/YYYY'),
    more: false,
    order_type: 'READY_TO_SHIP',
  });

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [dataListOrder, setDataListOrder] = useState({
    items: [],
    itemsPerPage: 0,
  });

  const [loading, setLoading] = useState(false);
  const [productOption, setproductOption] = useState([]);
  const [listCurrentOrder, setListCurrentOrder] = useState({});
  const [isShowGetShipping, setShowShipping] = useState(false);
  const [checkedList, setCheckedList] = useState({});
  const [orderListPrint, setOrderListPrint] = useState([]);
  const [isPrint, setIsPrint] = useState(false);
  const [loadingTabOrder, setLoadingTabOrder] = useState(false);
  const [orderCancel, setOrerCancel] = useState({});
  const [isShowcancel, setIsShowCancel] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [pageOrder, setPageOrder] = useState(1);
  const [initLoading, setInitLoading] = useState(true);
  const [optionShipping, setOptionShipping] = useState([]);
  const [optionsCancel, setOptionsCancel] = useState([
    {
      value: 'OUT_OF_STOCK',
      label: 'Hết hàng',
    },
  ]);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const { items: itemsOrder, page: pageTabOrder } = dataListOrder;

  const loadingProduct = useCallback(() => {
    if (shop_id && tab_active == 'product') {
      setLoading(true);
      getListProduct({ ...params, shop_id })
        .then((res) => {
          setDataList(res);
          setLoading(false);
        })
        .catch((error) => {
          showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          setLoading(false);
        });
    }
  }, [params, shop_id, tab_active]);

  const loadingOrder = useCallback(() => {
    if (shop_id && tab_active == 'order') {
      setLoadingTabOrder(true);
      setLoadingPage(true);
      let { start_date, end_date } = paramsOrder || {};
      let total = TotalDay(start_date, end_date);
      if (total > 14) {
        setLoadingTabOrder(false);
        setLoadingPage(false);
        // setLoadingOrderTable(false);

        showToast.error('Chỉ Lấy đơn hàng trong khoảng 15 ngày!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        return;
      }

      getListOrder({ ...paramsOrder, shop_id })
        .then((res) => {
          setDataListOrder(res);
          let { total = 0, data: resData = [], cursor = 0, more = false } = res || {};
          if (more) {
            setPageOrder(paramsOrder.page + 1);
          }
          setDataListOrder({
            items: resData,
            more: more,
            itemsPerPage: cursor,
          });
          setInitLoading(!more);
          setLoadingTabOrder(false);
          setLoadingPage(false);
        })
        .catch((error) => {
          showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          setLoadingTabOrder(false);
          setLoadingPage(false);
        });
    }
  }, [paramsOrder, shop_id, tab_active]);

  const loadingOptionShipping = useCallback(() => {
    if (isShowGetShipping == true && listCurrentOrder && listCurrentOrder.length > 0) {
      getOptionShipping({ shop_id, list_current_order: listCurrentOrder })
        .then((res) => {
          setOptionShipping(res);
        })
        .catch((error) => {
          showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        });
    }
  }, [shop_id, isShowGetShipping, listCurrentOrder]);

  const handleGetShippingParamater = (value) => {
    setShowShipping(true);
    let object = {};
    object[value?.order_id] = value;
    setListCurrentOrder(Object.values(object));
  };

  const handleGetShippingParamaters = (e) => {
    e.preventDefault();
    setShowShipping(true);
    setListCurrentOrder(Object.values(checkedList));
  };

  const handlePrintShippingDocument = (value) => {
    setOrderListPrint([value]);
    setIsPrint(true);
  };

  const handlePrintShippingDocuments = (e) => {
    e.preventDefault();
    setOrderListPrint(Object.values(checkedList));
    setIsPrint(true);
  };

  const handleCancelOrder = (values) => {
    setIsShowCancel(true);
    setOrerCancel(values);
  };

  const onClose = () => {
    setIsShowCancel(!isShowcancel);
  };

  const onLoadMore = () => {
    setLoadingPage(true);
    getListOrder({ ...paramsOrder, page: pageOrder, shop_id })
      .then((data) => {
        let { total = 0, data: resData = [], cursor = 0, more = false } = data || {};
        if (more) {
          setPageOrder(pageOrder + 1);
        }
        let listNew = [...itemsOrder].concat(resData);
        setDataListOrder({
          items: listNew,
        });
        setInitLoading(!more);
        setLoadingTabOrder(false);
        setLoadingPage(false);
      })
      .catch((error) => {
        showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setLoadingTabOrder(false);
        setLoadingPage(false);
      });
  };

  const loadingPrintShipping = useCallback(() => {
    if (isPrint) {
      setLoadingPage(true);
      printShipping({ shop_id, order_list: orderListPrint })
        .then((res) => {
          let varUrl = res.path;
          const url = cdnPath(varUrl);
          const pdflink = document.createElement('a');
          pdflink.target = '_blank';
          pdflink.href = url;
          document.body.appendChild(pdflink);
          pdflink.click();
          setLoadingPage(false);
          setIsPrint(false);
          setOrderListPrint([]);
        })
        .catch((error) => {
          setLoadingPage(false);
          showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        });
    }
  }, [orderListPrint, shop_id, isPrint]);

  // Tính tổng ngày từ ngày đến ngày
  const TotalDay = (startDate, endDate) => {
    let date1 = dayjs(startDate, 'DD/MM/YYYY');
    let date2 = dayjs(endDate, 'DD/MM/YYYY');
    return date2.diff(date1, 'day', true);
  };

  const ComponentTableProduct = () => {
    return (
      <>
        <div className='bw_col_4 bw_mt_2'>
          <h3 className='bw_title_card'>{totalItems} sản phẩm</h3>
          <h3 className='bw_title_card'>{(items || [])?.length || 0} model</h3>
        </div>
        <TableProductShopee
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={loadingProduct}
          fetchProductOpts={fetchProductOpts}
          productOption={productOption}
          handleChangeProduct={handleChangeProduct}
          handleDeleteProduct={handleDeleteProduct}
          handelUpdateProductToShopee={handelUpdateProductToShopee}
        />
      </>
    );
  };

  const ComponentTableOrder = () => {
    return (
      <>
        <div class='bw_col_4 bw_mt_2'>
          <h3 class='bw_title_card'>đơn hàng</h3>
        </div>
        {Object.values(checkedList)?.length > 0 ? (
          <> {RenderHandleButton()} </>
        ) : (
          <>
            <FilterOrder
              paramsOrder={paramsOrder}
              onChange={(e) => {
                setParamsOrder((prev) => {
                  return {
                    ...prev,
                    ...e,
                  };
                });
              }}
            />
          </>
        )}
        <TableOrderShopee
          onChangePage={(page) => {
            setParamsOrder({
              ...paramsOrder,
              page,
            });
          }}
          data={itemsOrder}
          page={pageTabOrder}
          loading={loadingTabOrder}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          handleConfirmOrder={handleGetShippingParamater}
          handlePrintShippingDocument={handlePrintShippingDocument}
          handleCancelOrder={handleCancelOrder}
          isHidden={Object.values(checkedList)?.length > 0 ? true : false}
          onLoadMore={onLoadMore}
          initLoading={initLoading}
          // handleConfirmDelivery={(e) => {
          //   let { key = null } = (e || {});
          //   dispatch(
          //     showConfirmModal(
          //       ['Việc cập nhật này sẽ do người bán vận chuyển đơn hàng và cập nhật trạng thái lên sàn ?'],
          //       async () => {
          //         await handelConfirmOrder(e);
          //       },
          //       key == 'success' ? 'Giao thành công' : 'Giao thất bại',
          //       'Đóng'
          //     ),
          //   )
          // }}
        />
      </>
    );
  };

  const RenderHandleButton = () => {
    let { order_type = null } = paramsOrder;
    return (
      <div
        className='bw_row'
        style={{
          marginTop: '10px',
        }}>
        <div className='bw_col_12'>
          {order_type && order_type == 'READY_TO_SHIP' ? (
            <button
              type='button'
              onClick={(e) => handleGetShippingParamaters(e)}
              className='bw_btn bw_btn_success'
              style={{
                marginLeft: '8px',
                marginRight: '8px',
              }}>
              <span className='fi fi-rr-check'></span>
              Nhận đơn
            </button>
          ) : null}
          {order_type && order_type == 'PROCESSED' ? (
            <button
              type='button'
              onClick={(e) => handlePrintShippingDocuments(e)}
              className='bw_btn bw_btn_success'
              style={{
                marginLeft: '8px',
                marginRight: '8px',
              }}>
              <span className='fi fi-rr-check'></span>
              In đơn
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  const handleChangeProduct = async (product = null, product_shopee = null) => {
    if (product_shopee && product) {
      try {
        let result = await updateProductShopee({ shop_id, product, product_shopee });
        let dataProductShopUpdate = convertArrayToObjectShopee(items);
        dataProductShopUpdate[product_shopee?.item_id].product_portal = result;
        setDataList({ ...dataList, items: Object.values(dataProductShopUpdate) });
      } catch (error) {
        showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    }
  };

  const handleDeleteProduct = async (product = null) => {
    if (product) {
      try {
        await deleteProductShopee({ shop_id, product });
        let dataProductShopUpdate = convertArrayToObjectShopee(items);
        dataProductShopUpdate[product?.item_id].product_portal = {};
        setDataList({ ...dataList, items: Object.values(dataProductShopUpdate) });
      } catch (error) {
        showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    }
  };

  const handelUpdateProductToShopee = async (product = {}) => {
    let { product_portal = {} } = product || {};
    if (product_portal && Object.values(product_portal) && Object.values(product_portal).length > 0) {
      try {
        setLoading(true);
        let result = await updateStocks({ ...product, shop_id });
        let dataProductShopUpdate = convertArrayToObjectShopee(items);
        dataProductShopUpdate[product?.item_id].seller_stock = [{ stock: product_portal?.total_inventory }];
        setDataList({ ...dataList, items: Object.values(dataProductShopUpdate) });
        setLoading(false);
      } catch (error) {
        showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setLoading(false);
      }
    } else {
      showToast.error('Vui lòng chọn sản phẩm ở phía portal', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const handelShipOrder = (value) => {
    let { list_order = {} } = value || {};
    let list = (itemsOrder || []).reduce((a, v) => ({ ...a, [v?.order_sn]: v }), {});
    Object.keys(list_order || {}).map((item) => {
      delete list[`${item}`];
    });
    setDataListOrder({
      items: Object.values(list || {}),
    });
    setCheckedList({});
  };

  const fetchProductOpts = async (search, limit = 400) => {
    const _optionsProduct = await getOptionProduct({ keyword: search, itemsPerPage: limit });
    setproductOption(_optionsProduct);
  };

  const onCloseShipingOrder = () => {
    setShowShipping(!isShowGetShipping);
  };

  const panels = [
    {
      key: 'PRODUCT',
      label: 'Sản phẩm',
      noActions: true,
      component: ComponentTableProduct,
      disabled: false,
    },
    {
      key: 'ORDER',
      label: 'Đơn hàng',
      component: ComponentTableOrder,
      disabled: false,
    },
  ];

  /// Call UseEffect
  useEffect(loadingProduct, [loadingProduct]);
  useEffect(loadingOrder, [loadingOrder]);
  useEffect(loadingPrintShipping, [loadingPrintShipping]);
  useEffect(loadingOptionShipping, [loadingOptionShipping]);
  useEffect(() => {
    fetchProductOpts();
  }, []);
  useEffect(() => {
    dispatch(triggerSidebar());
  }, []);

  return (
    <>
      {isShowGetShipping ? (
        <ModalShippingOrder
          shop_id={shop_id}
          list_order={listCurrentOrder}
          onClose={onCloseShipingOrder}
          optionShipping={optionShipping}
          onChange={handelShipOrder}
          // onChange={(e) => {
          //   setParamsOrder((prev) => {
          //     return {
          //       ...prev,
          //       ...e
          //     }
          //   })
          //   setCheckedList({});
          // }}
        />
      ) : null}
      {isShowcancel ? (
        <ModalCancelOrder
          onClose={onClose}
          optionsCancel={optionsCancel}
          orderCancel={orderCancel}
          shop_id={shop_id}
          onChange={(e) => {
            setParamsOrder((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
      ) : null}
      <FormProvider {...methods}>
        <React.Fragment>
          {loadingPage && (
            <BWLoadingPage
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '100%',
                height: '100%',
                opacity: '0.5',
                zIndex: '20',
              }}
            />
          )}
          <div className='bw_main_wrapp'>
            <FilterManager
              shop_id={shop_id}
              onChange={(e) => {
                setParams((prev) => {
                  return {
                    ...prev,
                    ...e,
                  };
                });
                setParamsOrder((prev) => {
                  return {
                    ...prev,
                    ...e,
                  };
                });
              }}
            />
            <Panel panes={panels} />
          </div>
        </React.Fragment>
      </FormProvider>
    </>
  );
};

export default PageManagerShopee;
