import React, { useEffect, useState, useCallback } from 'react';
// components
import DataTable from 'components/shared/DataTable/index';
import PromotionProductFilter from './PromotionProductFilter';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { useFormContext } from 'react-hook-form'

export default function SelectModalTable({
  handleOpenModalGift,
  noLoadData,
  contentCreate,
  filedList
}) {
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const [dataProduct, setDataProduct] = useState(defaultPaging);

  const [query, setQuery] = useState({
    ...defaultParams,
    itemsPerPage: 5
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
            <img
              alt=''
              src={/[/.](gif|jpg|jpeg|tiff|png)$/i.test(p?.picture_url) ? p.picture_url : 'bw_image/img_cate_1.png'}
            />
            {p?.product_name}
          </div>
        ),
      },
      {
        header: 'Thuộc loại hàng hóa',
        formatter: (p) => <b>{p?.category_name}</b>,
      },
      {
        header: 'Hãng',
        formatter: (p) => <b>{p?.manufacture_name}</b>,
      },
      {
        header: 'Ngày tạo',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.created_date}</b>,
      },
      {
        hidden: noLoadData,
        header: 'Trạng thái duyệt',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => 'Đã duyệt',
      },
      {
        hidden: noLoadData,
        header: 'Kích hoạt',
        accessor: 'status',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
    ],
    [noLoadData],
  );

  const actions = [
    {
      hidden: !noLoadData,
      globalAction: true,
      icon: 'fi fi-rr-plus',
      color: 'orange',
      content: contentCreate,
      onClick: handleOpenModalGift
    },
    {
      icon: 'fi fi-rr-eye',
      color: 'green',
      onClick: (item) => window.open(`/product/detail/${item.product_id}`)
    }
  ];

  const getProductList = useCallback(() => {
    setLoading(true)
    getList(query).then((data) => {
      setDataProduct(data);
      setLoading(false)
    });
  }, [query]);

  useEffect(getProductList, [getProductList]);

  return (
    <>
      <div className='bw_main_wrapp'>
        {!noLoadData &&
          <PromotionProductFilter onChange={(value) => {
            setQuery({
              ...query,
              ...value,
            })
          }} />}
        <DataTable
          hiddenDeleteClick
          noSelect={noLoadData}
          noPaging={noLoadData}
          fieldCheck='product_id'
          defaultDataSelect={!noLoadData ? methods.watch(filedList) : []}
          loading={loading}
          columns={columns}
          data={noLoadData ? methods.watch(filedList) : items}
          actions={actions}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={handleChangePage}
          handleBulkAction={(e) => {
            methods.setValue(filedList, e);
          }}
        />
      </div>
    </>
  );
}
