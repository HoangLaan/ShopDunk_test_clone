import React, { useEffect, useState, useCallback, useRef } from 'react';
// service
import { getList } from 'services/product.service';
// components
import _ from 'lodash';
import DataTable from 'components/shared/DataTable/tableChange';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { showConfirmModal } from 'actions/global';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import ICON_COMMON from 'utils/icons.common';
import BWImage from 'components/shared/BWImage/index';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { checkAndGetValuePromational } from './mathCoupon';
import PromotionProductFilter from 'pages/PromotionOffers/components/add/PromotionProductFilter';
import { COUPON_PERMISSION } from 'pages/Coupon/utils/constants';

export default function CouponAutoCodeGift({
  handleOpenModalGift,
  noLoadData,
  contentCreate,
  contentSelect,
  fieldProduct,
  hiddenAction,
  onClose = () => {},
  disabled,
}) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const [dataProduct, setDataProduct] = useState(defaultPaging);
  const [checkSelect, setCheckSelect] = useState(true);
  const [valueMomentary, setValueMomentary] = useState([]);

  const count = useRef(0);

  const [query, setQuery] = useState({
    ...defaultParams,
    itemsPerPage: 5,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataProduct;

  const handleChangePage = (page) => {
    setQuery({ ...query, page });
  };

  const columns = React.useMemo(
    () => [
      {
        header: 'Mã hàng hóa - vật tư',
        accessor: 'product_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      },
      {
        header: 'Tên hàng hóa - vật tư',
        formatter: (p) => (
          <div className='bw_inf_pro'>
            <BWImage src={p?.picture_url}></BWImage>
            {p?.product_name}
          </div>
        ),
      },
      {
        header: 'Thuộc ngành hàng',
        formatter: (p) => p?.category_name,
      },
      {
        header: 'Hãng',
        formatter: (p) => p?.manufacture_name,
      },
      {
        header: 'Số lượng sản phẩm quà tặng',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormNumber
                bordered={true}
                min={1}
                field={`${fieldProduct}.${index}.quantity`}
                validation={{
                  required: 'Số lượng là bắt buộc',
                }}
                // onChange={(e) => {
                //   checkAndGetValuePromational(methods, null, index, 'quantity', e);
                // }}
                disabled={disabled}
              />
            </React.Fragment>
          );
        },
      },
      {
        hidden: noLoadData,
        header: 'Trạng thái',
        accessor: 'status',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [noLoadData],
  );

  const getProductList = useCallback(() => {
    setLoading(true);
    getList(query).then((data) => {
      setDataProduct(data);
      if (data.totalItems && !count.current) {
        count.current = data.totalItems;
      }
      if (hiddenAction?.check && data.totalItems < count.current) {
        setCheckSelect(false);
      } else {
        setCheckSelect(true);
      }
      setLoading(false);
    });
  }, [query]);

  useEffect(getProductList, [getProductList]);

  const setValueProductListFilter = () => {
    let cloneQuery = structuredClone(query);
    cloneQuery.itemsPerPage = totalItems;
    if (hiddenAction?.check && count.current && totalItems < count.current) {
      getList(cloneQuery).then((data) => {
        if (data.items) {
          let cloneWatch = structuredClone(methods.watch(fieldProduct)) ?? [];
          let items = data.items;
          let cloneValue = structuredClone(valueMomentary);
          let newArray = [...cloneValue, ...items, ...cloneWatch];
          let valueSet = [...new Set(newArray)];
          setValueMomentary(valueSet);
        }
        setQuery(query);
        setLoading(false);
      });
    }
  };

  const actions = React.useMemo(
    () => [
      {
        hidden: !noLoadData,
        globalAction: true,
        icon: 'fi fi-rr-plus',
        color: 'orange',
        permission: 'COUPON_ADD_PRODUCT_GIFT',
        disabled: disabled,
        content: contentCreate,
        onClick: handleOpenModalGift,
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-check',
        color: 'green',
        hidden: checkSelect,
        content: contentSelect,
        onClick: setValueProductListFilter,
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        hidden: hiddenAction?.detail,
        onClick: (item) => window.open(`/product/detail/${item.product_id}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: hiddenAction?.delete,
        permission: COUPON_PERMISSION.DEL_PRODUCT,
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Bạn muốn xóa sản phẩm ra khỏi danh sách áp dụng?`], () => {
              const promotion_offer_product = _.cloneDeep(methods.watch(fieldProduct));
              methods.setValue(
                fieldProduct,
                promotion_offer_product.filter((o) => parseInt(o?.product_id) !== parseInt(value?.product_id)),
              );
              return;
            }),
          );
        },
      },
    ],
    [loading],
  );

  return (
    <>
      <div className='bw_main_wrapp'>
        {!noLoadData && (
          <PromotionProductFilter
            onChange={(value) => {
              setQuery({
                ...query,
                ...value,
              });
            }}
          />
        )}
        <DataTable
          hiddenDeleteClick
          noSelect={noLoadData}
          noPaging={noLoadData}
          dataSelectChange={valueMomentary}
          fieldCheck='product_id'
          defaultDataSelect={!noLoadData ? methods.watch(fieldProduct) : []}
          loading={loading}
          columns={columns}
          data={noLoadData ? methods.watch(fieldProduct) : items}
          actions={actions}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={handleChangePage}
          handleBulkAction={(e) => {
            methods.setValue(fieldProduct, e);
          }}
          deleteAllData={true}
        />
      </div>
    </>
  );
}
