import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import '../../style.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListProduct,
  getOptionProduct,
  updateProductLazada,
  deleteProductLazada,
  updateSingleStock,
  getListOrder,
  getOptionShipping,
  printShipping,
  getOptionCancel,
  updateSuccessOrFailed,
  updateListProductToLazada,
} from '../../helpers/call-api-lazada';
import { cdnPath } from 'utils/index';
import { showToast } from 'utils/helpers';
import TableProductLazada from './TableProduct';
import TableOrderLazada from './TableOrder';
import { showConfirmModal, triggerSidebar } from 'actions/global';

// import { getBase64, getOptionSelected, mapDataOptions } from 'utils/helpers';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import FilterManager from './FilterManager';
import FilterOrder from './FilterOrder';
// Components
import Panel from 'components/shared/Panel/index';
import useQueryString from 'hooks/use-query-string';
import BWLoadingPage from 'components/shared/BWLoadingPage';

import ModalCancelOrder from './CancelOrderForm';

const PageManagerLazada = () => {
  const { id } = useParams();
  const [query] = useQueryString();
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
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingTabOrder, setLoadingTabOrder] = useState(false);
  const [checkedList, setCheckedList] = useState({});
  const [checkedListProduct, setCheckedListProduct] = useState({});

  const [productOption, setproductOption] = useState([]);
  const [listCurrentOrder, setListCurrentOrder] = useState({});
  const [isShowGetShipping, setShowShipping] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [orderListPrint, setOrderListPrint] = useState([]);
  const [isShowcancel, setIsShowCancel] = useState(false);
  const [orderCancel, setOrerCancel] = useState({});
  const [optionsCancel, setOptionsCancel] = useState([]);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const {
    items: itemsOrder,
    itemsPerPage: itemsPerPageOrder,
    page: pageOrder,
    totalItems: totalItemsOrder,
    totalPages: totalPagesOrder,
  } = dataListOrder;

  const loadingProduct = useCallback(() => {
    if (shop_id && tab_active == 'product') {
      setLoading(true);
      getListProduct({ ...params, shop_id })
        .then((res) => {
          setDataList(res);
          setLoading(false);
        })
        .catch((error) => {
          showToast.error(error ? error.message : 'Có lỗi xảy ra');
          setLoading(false);
        });
    }
  }, [params, shop_id, tab_active]);

  const loadingOrder = useCallback(() => {
    if (shop_id && tab_active == 'order') {
      setLoadingTabOrder(true);
      setLoadingPage(true);
      getListOrder({ ...paramsOrder, shop_id })
        .then((res) => {
          setDataListOrder(res);
          setLoadingTabOrder(false);
          setLoadingPage(false);
        })
        .catch((error) => {
          showToast.error(error ? error.message : 'Có lỗi xảy ra');
          setLoadingTabOrder(false);
          setLoadingPage(false);
        });
    }
  }, [paramsOrder, shop_id, tab_active]);

  const getListOptionShippingList = useCallback(() => {
    if (isShowGetShipping == true && listCurrentOrder && listCurrentOrder.length > 0) {
      setLoadingPage(true);
      getOptionShipping({ shop_id, list_current_order: listCurrentOrder })
        .then((res) => {
          setShowShipping(false);
          setListCurrentOrder([]);
          setParamsOrder({
            page: 1,
            itemsPerPage: 10,
            order_type: 'ready_to_ship',
          });
          setCheckedList([]);
          // setDefaultType('ready_to_ship')
          // window._$g.toastr.show('Nhận đơn hàng thành công!', 'success');
          // handleSubmitFilterOrder({
          //   start_date: null,
          //   end_date: null,
          //   page: 1,
          //   order_type: 'ready_to_ship',
          // });
          setShowShipping(false);
          setLoadingPage(false);
        })
        .catch((error) => {
          setShowShipping(false);
          setLoadingPage(false);
          showToast.error(error ? error.message : 'Có lỗi xảy ra!');
        });
    }
  }, [shop_id, isShowGetShipping, listCurrentOrder]);

  const loadingPrintShipping = useCallback(() => {
    if (isPrint) {
      setLoadingPage(true);
      printShipping({ shop_id, order_list: orderListPrint })
        .then((res) => {
          let varUrl = res.pdf_url;
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
          showToast.error(error ? error.message : 'Có lỗi xảy ra');
        });
    }
  }, [orderListPrint, shop_id, isPrint]);

  const loadingOptionCancel = useCallback(() => {
    if (isShowcancel) {
      getOptionCancel({ shop_id, orderCancel }).then((res) => {
        let { reason_options = [], tip_content = 'Đã xảy ra lỗi', tip_type = 'error' } = res || {};
        let listOption = (reason_options || []).map((item) => {
          return {
            ...item,
            value: item?.reason_id,
            label: item?.reason_name,
            id: item?.reason_id,
            name: item?.reason_name,
          };
        });
        let color = 'danger';
        if (tip_type == 'error') {
          color = 'danger';
        } else if (tip_type == 'warning') {
          color = 'warning';
        }
        setOptionsCancel(listOption);
      });
    }
  }, [isShowcancel, orderCancel]);

  const fetchProductOpts = async (search, limit = 400) => {
    const _optionsProduct = await getOptionProduct({ keyword: search, itemsPerPage: limit });
    setproductOption(_optionsProduct);
  };

  useEffect(() => {
    fetchProductOpts();
  }, []);

  const convertArrayToObject = (array = []) => {
    return array.reduce((a, v) => ({ ...a, [v?.SkuId]: v }), {});
  };

  const handleChangeProduct = async (product = null, product_lazada = null) => {
    if (product_lazada && product) {
      try {
        let result = await updateProductLazada({ shop_id, product, product_lazada });
        let dataProductShopUpdate = convertArrayToObject(items);
        dataProductShopUpdate[product_lazada?.SkuId].product_portal = result;
        setDataList({ ...dataList, items: Object.values(dataProductShopUpdate) });
      } catch (error) {
        showToast.error(error ? error.message : 'Có lỗi xảy ra');
      }
    }
  };

  const handleDeleteProduct = async (product = null) => {
    if (product) {
      try {
        await deleteProductLazada({ shop_id, product });
        let dataProductShopUpdate = convertArrayToObject(items);
        dataProductShopUpdate[product?.SkuId].product_portal = {};
        setDataList({ ...dataList, items: Object.values(dataProductShopUpdate) });
      } catch (error) {
        showToast.error(error ? error.message : 'Có lỗi xảy ra');
      }
    }
  };

  const handelUpdateProductToLazada = async (product = {}) => {
    let { product_portal = {} } = product || {};
    if (product_portal && Object.values(product_portal) && Object.values(product_portal).length > 0) {
      try {
        setLoading(true);
        let result = await updateSingleStock({ ...product, shop_id });
        let dataProductShopUpdate = convertArrayToObject(items);
        dataProductShopUpdate[product?.SkuId].quantity = result?.quantity || 0;
        setDataList({ ...dataList, items: Object.values(dataProductShopUpdate) });
        setLoading(false);
      } catch (error) {
        showToast.error(error ? error.message : 'Có lỗi xảy ra');
        setLoading(false);
      }
    } else {
      showToast.error('Vui lòng chọn sản phẩm ở phía portal');
    }
  };

  const handelUpdateListProductToLazada = async () => {
    try {
      // updateListProductToLazada
      let listFilter = Object.values(checkedListProduct).filter((pro) => {
        let { product_portal = {} } = pro || {};
        if (Object.values(product_portal) && Object.values(product_portal).length > 0) {
          return pro;
        }
      });
      let list = await updateListProductToLazada({ shop_id, list_product_checked: listFilter });
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra');
    }
  };

  const handelConfirmOrder = async (params = {}) => {
    let { key = null } = params || {};
    try {
      let result = await updateSuccessOrFailed({ shop_id, ...params });
      setParamsOrder({
        page: 1,
        itemsPerPage: 10,
        order_type: key == 'success' ? 'delivered' : 'failed',
      });
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra');
    }
  };

  const ComponentTableProduct = () => {
    return (
      <>
        <div className='bw_col_4 bw_mt_2'>
          <h3 className='bw_title_card'>{totalItems} sản phẩm</h3>
        </div>
        {Object.values(checkedListProduct)?.length > 0 ? <> {RenderHandleButtonProduct()} </> : <></>}
        <TableProductLazada
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
          handelUpdateProductToLazada={handelUpdateProductToLazada}
          checkedListProduct={checkedListProduct}
          setCheckedListProduct={setCheckedListProduct}
          isHidden={Object.values(checkedListProduct)?.length > 0 ? true : false}
        />
      </>
    );
  };

  const ComponentTableOrder = () => {
    return (
      <>
        <div class='bw_col_4 bw_mt_2'>
          <h3 class='bw_title_card'>{totalItemsOrder} đơn hàng</h3>
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
        <TableOrderLazada
          onChangePage={(page) => {
            setParamsOrder({
              ...paramsOrder,
              page,
            });
          }}
          data={itemsOrder}
          totalPages={totalPagesOrder}
          itemsPerPage={itemsPerPageOrder}
          page={pageOrder}
          totalItems={totalItemsOrder}
          loading={loadingTabOrder}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          handleConfirmOrder={handleGetShippingParamater}
          handlePrintShippingDocument={handlePrintShippingDocument}
          handleCancelOrder={handleCancelOrder}
          isHidden={Object.values(checkedList)?.length > 0 ? true : false}
          handleConfirmDelivery={(e) => {
            let { key = null } = e || {};
            dispatch(
              showConfirmModal(
                ['Việc cập nhật này sẽ do người bán vận chuyển đơn hàng và cập nhật trạng thái lên sàn ?'],
                async () => {
                  await handelConfirmOrder(e);
                },
                key == 'success' ? 'Giao thành công' : 'Giao thất bại',
                'Đóng',
              ),
            );
          }}
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
          {order_type && order_type == 'pending' ? (
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
          {order_type && order_type == 'ready_to_ship' ? (
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

  const RenderHandleButtonProduct = () => {
    return (
      <div
        className='bw_row'
        style={{
          marginTop: '10px',
        }}>
        <div className='bw_col_12'>
          <button
            type='button'
            onClick={(e) => handelUpdateListProductToLazada(e)}
            className='bw_btn bw_btn_success'
            style={{
              marginLeft: '8px',
              marginRight: '8px',
            }}>
            <span className='fi fi-rr-refresh'></span>
            Đồng bộ tồn kho
          </button>
        </div>
      </div>
    );
  };

  const handleGetShippingParamater = (value) => {
    setShowShipping(true);
    let object = {};
    object[value?.order_id] = value;
    setListCurrentOrder(Object.values(object));
    // setFieldValue('list_order', object);
  };

  const handleGetShippingParamaters = (e) => {
    e.preventDefault();
    setShowShipping(true);
    // setFieldValue('list_order', checkedList);
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

  const onClose = () => {
    setIsShowCancel(!isShowcancel);
  };

  const handleCancelOrder = (values) => {
    setIsShowCancel(true);
    setOrerCancel(values);
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
  useEffect(getListOptionShippingList, [getListOptionShippingList]);
  useEffect(loadingPrintShipping, [loadingPrintShipping]);
  useEffect(loadingOptionCancel, [loadingOptionCancel]);
  useEffect(() => {
    dispatch(triggerSidebar());
  }, []);

  return (
    <FormProvider {...methods}>
      {isShowcancel ? (
        <ModalCancelOrder
          onClose={onClose}
          optionsCancel={optionsCancel}
          orderCancel={orderCancel}
          shop_id={shop_id}
          loadingOrder={loadingOrder}
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
          <Panel panes={panels} noActions={true} />
        </div>
      </React.Fragment>
    </FormProvider>
  );
};

export default PageManagerLazada;
