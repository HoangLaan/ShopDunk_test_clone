import React, { useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
// service
import { getList } from 'services/product.service';
import { defaultPaging, defaultParams } from 'utils/helpers';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
// components
import DataTable from 'components/shared/DataTable/index';
import PromotionProductFilter from 'pages/PromotionOffers/components/add/PromotionProductFilter';

export default function DiscountProgramProductTable({
  disabled,
  handleOpenModal,
  noLoadData,
  contentCreate,
  fieldProduct,
  hiddenDeleteBtn = true,
  manufacture_id
}) {
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const [dataProduct, setDataProduct] = useState(defaultPaging);
  const dispatch = useDispatch();

  const [query, setQuery] = useState({
    ...defaultParams,
    itemsPerPage: 5,
    manufacture_id
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataProduct;

  const handleChangePage = (page) => {
    setQuery({ ...query, page });
  };

  const columns = React.useMemo(
    () => [
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Model',
        accessor: 'model_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Hãng',
        accessor: 'manufacture_name',
        classNameHeader: 'bw_text_center',
      },
      // {
      //   hidden: handleOpenModal,
      //   header: 'Đơn giá nhập',
      //   formatter: (p, index) =>
      //     handleOpenModal && (
      //       <FormNumber className='bw+' bordered field={`${fieldProduct}.${index}.discount_money`} addonAfter='VNĐ' />
      //     ),
      // },
    ],
    [],
  );

  const actions = [
    {
      hidden: !noLoadData || disabled,
      globalAction: true,
      icon: 'fi fi-rr-plus',
      color: 'orange',
      content: contentCreate,
      onClick: handleOpenModal,
      permission: 'PO_DISCOUNT_PROGRAM_ADD',
    },
    {
      icon: 'fi fi-rr-eye',
      color: 'green',
      onClick: (item) => window.open(`/product/detail/${item.product_id}`),
      permission: 'PO_DISCOUNT_PROGRAM_ADD',
    },
    {
      icon: ICON_COMMON.trash,
      color: 'red',
      hidden: disabled || hiddenDeleteBtn,
      permission: 'PO_DISCOUNT_PROGRAM_ADD',
      onClick: (value) => {
        dispatch(
          showConfirmModal([`Xoá ${value?.product_name} khỏi danh sách sản phẩm áp dụng ?`], () => {
            let list_apply_product = _.cloneDeep(methods.watch(fieldProduct));
            methods.setValue(
              fieldProduct,
              list_apply_product.filter((o) => parseInt(o?.product_id) !== parseInt(value?.product_id)),
            );
            return;
          }),
        );
      },
    },
  ];

  const getProductList = useCallback(() => {
    setLoading(true);
    getList(query).then((data) => {
      setDataProduct(data);
      setLoading(false);
    });
  }, [query]);

  useEffect(getProductList, [getProductList]);

  return (
    <>
      {!noLoadData && (
        <PromotionProductFilter
          onChange={(value) => {
            setQuery({
              ...query,
              ...value,
            });
          }}
          miniForm={true}
          manufacture_id
        />
      )}
      <DataTable
        hiddenDeleteClick
        noSelect={noLoadData}
        noPaging={noLoadData}
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
      />
    </>
  );
}
