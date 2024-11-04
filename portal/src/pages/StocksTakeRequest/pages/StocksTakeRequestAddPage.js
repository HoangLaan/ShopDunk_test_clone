import React, { useCallback, useEffect, useMemo } from 'react';
import moment from 'moment';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { isString } from 'lodash';

import { getDepartments, getStocks, setReviewData } from 'pages/StocksTakeRequest/actions';
import { getStockTakeTypes } from 'pages/StocksTakeRequest/actions';
import { useAuth } from 'context/AuthProvider';
import {
  createStocksTake,
  getGenerateCode,
  getListProduct,
  updateStocksTake,
} from 'services/stocks-take-request.service';
import { getStocksTakeType } from 'pages/StocksTakeRequest/actions';
import { getStocksTakeRequest } from 'pages/StocksTakeRequest/actions';
import { DEFAULT_REVIEW_DATA, REVIEW_TYPES } from 'pages/StocksTakeRequest/utils/constants';
import { showToast } from 'utils/helpers';

import Panel from 'components/shared/Panel';
import StocksTakeRequestReview from 'pages/StocksTakeRequest/components/review-list/StocksTakeRequestReview';
import StocksTakeProductListTab from 'pages/StocksTakeRequest/components/product-list/StocksTakeProductListTab';
import StocksTakeRequestInformation from 'pages/StocksTakeRequest/components/information';
import StocksTakeResult from 'pages/StocksTakeRequest/components/result';
import StocksTakeReviewModal from 'pages/StocksTakeRequest/components/review-list/StocksTakeReviewModal';

const keyPanel = {
  information: 'information',
  review: 'review',
  product_list: 'product_list',
  result: 'result',
};

const StocksTakeRequestAddPage = () => {
  const { user } = useAuth();
  let { stocks_take_request_id } = useParams();
  const { pathname } = useLocation();
  const isView = useMemo(() => pathname.toLowerCase().includes('/detail') || pathname.includes('/view'), [pathname]);

  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { watch, reset } = methods;
  const is_reviewed = watch('is_reviewed');
  const is_all_product = watch('is_all_product');
  const is_take_inventory = watch('is_take_inventory'); // đã lấy số lượng tồn
  const show_concluded = watch('stocks_take_in_code') || watch('stocks_take_out_code');
  const user_review_list_ = watch('user_review_list');
  const user_review_list = useMemo(() => user_review_list_ || [], [user_review_list_]);

  const noSubmit = is_reviewed !== REVIEW_TYPES.TOBE && show_concluded;
  const isNotEdit = useMemo(() => {
    if (stocks_take_request_id) {
      if (user_review_list.find((o) => o?.is_reviewed === REVIEW_TYPES.APPROVED)) {
        return true;
      }
    }
  }, [user_review_list, stocks_take_request_id]);
  const disabled = isNotEdit || pathname.includes('/detail');

  const { stocksTakeRequestData, stocksTakeTypeList, stocksTakeTypeData, reviewData } = useSelector(
    (state) => state.stocksTakeRequest,
  );

  const { is_show_review_modal, is_show_review_btn } = reviewData;

  const loadStocksTakeType = useCallback(() => {
    // if (stocksTakeTypeList?.length === 0)
    dispatch(getStockTakeTypes());
  }, [dispatch]);
  useEffect(loadStocksTakeType, [loadStocksTakeType]);

  const loadDepartment = useCallback(() => {
    dispatch(getDepartments());
  }, [dispatch]);
  useEffect(loadDepartment, [loadDepartment]);

  const loadStocks = useCallback(() => {
    dispatch(getStocks());
  }, [dispatch]);
  useEffect(loadStocks, [loadStocks]);

  const loadGenerateCode = useCallback(() => {
    if (!stocks_take_request_id)
      getGenerateCode().then((e) => {
        const data = {
          stocks_take_request_code: e,
          stocks_take_request_date: moment(new Date()).format('DD/MM/YYYY'),
          created_user: user?.full_name,
        };
        reset(data);
      });
  }, [user, stocks_take_request_id, reset]);
  useEffect(loadGenerateCode, [loadGenerateCode]);

  const loadDetailStocksTakeRequest = useCallback(() => {
    if (stocks_take_request_id) {
      dispatch(getStocksTakeRequest(stocks_take_request_id));
    }
  }, [stocks_take_request_id, dispatch]);
  useEffect(loadDetailStocksTakeRequest, [loadDetailStocksTakeRequest]);
  const isStockTakeImeiCode =
    stocksTakeTypeList?.find((p) => parseInt(p?.stocks_take_type_id) === parseInt(watch('stocks_take_type_id')))
      ?.is_stocks_take_imei_code ?? 0;

  useEffect(() => {
    dispatch(setReviewData(DEFAULT_REVIEW_DATA));
  }, [dispatch]);

  const panel = [
    {
      key: keyPanel.information,
      label: 'Thông tin chung',
      disabled: disabled || (is_reviewed && is_reviewed !== REVIEW_TYPES.TOBE),
      isAdd: !Boolean(stocks_take_request_id),
      component: StocksTakeRequestInformation,
    },
    {
      key: keyPanel.review,
      label: 'Duyệt kiểm kê',
      hidden: !Boolean(watch('stocks_take_type_id')) || !stocksTakeTypeData?.stocks_take_review_level_list?.length,
      disabled: disabled,
      isAdd: !Boolean(stocks_take_request_id),
      component: StocksTakeRequestReview,
    },
    {
      key: keyPanel.product_list,
      label: 'Danh sách sản phẩm kiểm kê',
      hidden: !(is_reviewed === REVIEW_TYPES.APPROVED || (is_show_review_btn && !is_all_product)),
      // hidden: !(is_reviewed === REVIEW_TYPES.APPROVED) && is_all_product,
      disabled: disabled || noSubmit,
      isAdd: !Boolean(stocks_take_request_id),
      onRowClick: () => {
        const product_list = watch('product_list');
        const stocks_list_id = watch('stocks_list_id');
        const isHaveProductList = Array.isArray(product_list) && product_list.length > 0;
        const isHaveStocksList = Array.isArray(stocks_list_id) && stocks_list_id.length > 0;

        // if (stocks_take_request_id)
        if (!isHaveProductList && isHaveStocksList) {
          getListProduct({
            is_stocks_take_imei_code: isStockTakeImeiCode,
            stocks_list: stocks_list_id,
            page: 1,
            itemsPerPage: 900000,
          }).then((e) =>
            methods.setValue(
              'product_list',
              e?.items.map((o) => ({
                ...o,
                available_in_stock: 1,
              })),
            ),
          );
        }
      },
      component: StocksTakeProductListTab,
    },
    {
      key: keyPanel.result,
      label: 'Kết quả xử lý',
      hidden: !show_concluded,
      isAdd: !Boolean(stocks_take_request_id),
      component: StocksTakeResult,
      disabled: disabled,
    },
  ];

  const onSubmit = (payload) => {
    try {
      const isStockTakeImeiCode =
        stocksTakeTypeList.find((p) => parseInt(p?.stocks_take_type_id) === parseInt(watch('stocks_take_type_id')))
          ?.is_stocks_take_imei_code ?? 0;

      delete payload.created_user;
      delete payload.created_date;
      delete payload.address_id;
      delete payload.adress;
      if (isStockTakeImeiCode) {
        const product_list = payload.product_list ?? [];
        const groupBy = product_list.filter(
          (value, index, self) => index === self.findIndex((t) => t.product_code === value.product_code),
        );
        payload.product_list = groupBy.map((o) => {
          const list_imei = product_list.filter((value) => value.product_code === o.product_code);
          return {
            ...o,
            actual_inventory: list_imei.filter((o) => o.actual_inventory).length,
            total_inventory: list_imei.filter((o) => o.total_inventory).length,
            list_imei,
          };
        });
      } else {
        if (is_reviewed && is_take_inventory) {
          for (let i of payload.product_list) {
            if (i.actual_inventory > (i?.list_imei ?? []).length) {
              throw Error(
                `${i?.product_name} bạn chưa tiến hành quét IMEI vui lòng kiểm tra lại trước khi hoàn tất chỉnh sửa`,
              );
            }
          }
        }
      }
      payload.stocks_take_request_user = payload?.stocks_take_request_user?.value;
      payload.stocks_take_users = (payload.stocks_take_users ?? [])?.map((o) => ({
        department_id: o?.department_id,
        stocks_take_user_id: o?.stocks_take_user_id,
        is_main_responsibility: o?.is_main_responsibility,
        user_name: o?.user_name?.value ?? o?.user_name,
      }));
      payload.user_review_list = (payload?.user_review_list ?? []).filter((o) => Boolean(o.user_name));

      if (stocks_take_request_id) {
        updateStocksTake(stocks_take_request_id, payload)
          .then(() => {
            showToast.success(`Chỉnh sửa thành công`);
          })
          .catch((error) => {
            showToast.error(isString(error?.message) && error?.message ? error?.message : 'Có lỗi xảy ra!');
          });
      } else {
        createStocksTake(payload)
          .then(() => {
            showToast.success(`Thêm mới thành công`);
          })
          .catch((error) => {
            showToast.error(isString(error?.message) && error?.message ? error?.message : 'Có lỗi xảy ra!');
          });
      }
    } catch (error) {
      showToast.error(isString(error?.message) && error?.message ? error?.message : 'Có lỗi xảy ra!');
    }
  };

  const stocks_take_type_id = watch('stocks_take_type_id');

  const loadStocksTakeRequestDetail = useCallback(() => {
    if (stocks_take_type_id) {
      dispatch(getStocksTakeType(stocks_take_type_id, stocks_take_request_id));
    }
  }, [dispatch, stocks_take_type_id, stocks_take_request_id]);
  useEffect(loadStocksTakeRequestDetail, [loadStocksTakeRequestDetail]);
  useEffect(() => {
    if (stocksTakeRequestData) {
      reset({
        ...stocksTakeRequestData,
        stocks_take_request_user: {
          value: stocksTakeRequestData?.stocks_take_request_user,
          label: stocksTakeRequestData?.stocks_take_request_username,
        },
      });
    }
  }, [stocksTakeRequestData, reset]);

  const actions = [
    {
      hidden: !is_show_review_btn || !isView,
      onClick: () => {
        dispatch(
          setReviewData({
            is_show_review_modal: true,
          }),
        );
      },
      outline: true,
      content: 'Duyệt',
      type: 'success',
    },
  ];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <div className='bw_main_wrapp'>
          <Panel hasSubmit={!noSubmit} onSubmit={onSubmit} panes={panel} actions={actions} />
        </div>
      </FormProvider>

      {is_show_review_modal && (
        <StocksTakeReviewModal
          onClose={() => {
            dispatch(
              setReviewData({
                is_show_review_modal: false,
                stocks_take_review_list_id: undefined,
                stocks_review_level_id: undefined,
              }),
            );
          }}
        />
      )}
    </React.Fragment>
  );
};

export default StocksTakeRequestAddPage;
