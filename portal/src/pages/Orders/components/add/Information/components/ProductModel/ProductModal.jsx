import React, { useCallback, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getProduct } from 'pages/Orders/helpers/call-api';
import { formatPrice, splitString } from 'utils';

import DataTable from 'components/shared/DataTable';
import { orderType } from 'pages/Orders/helpers/constans';

const ProductModal = ({ onClose, onConfirm, data, params }) => {
  const { watch } = useFormContext();
  const order_type = watch('order_type');
  const [selectedProduct, setSelectedProduct] = useState(order_type !== orderType.PREORDER ? Object.values(watch('products') || {}) : []);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataList?.items?.length ? dataList : data;

  ///zone handle scroll effect for header position
  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    // width: '74rem',
    marginLeft: '-20px',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  const onChangePage = useCallback(
    (page) => {
      setLoading(true);

      getProduct({
        ...params,
        page,
      })
        .then((res) => {
          setDataList(res);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [params],
  );

  const onChangeSelect = useCallback((selected) => {
    setSelectedProduct(selected);
  }, []);

  const renderProductPrice = useCallback((product) => {
    const prices = product?.product_output_type?.map((item) => item.price) || [];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return `${formatPrice(minPrice, true, ',')} - ${formatPrice(maxPrice, true, ',')}`;
  }, []);

  const columns = useMemo(
    () => [
      // {
      //   header: 'STT',
      //   classNameHeader: 'bw_text_center bw_w1',
      //   classNameBody: 'bw_text_center',
      //   formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
      // },
      {
        header: 'IMEI',
        formatter: (p) => <b>{p?.imei_code}</b>,
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
      },
      {
        header: 'Ngày nhập kho',
        accessor: 'stock_date',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Giá bán dự kiến',
        accessor: 'base_price',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{renderProductPrice(p)}</span>,
      },
    ],
    [renderProductPrice],
  );


  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      <div className='bw_modal_container bw_w1200' style={styleModal}>
        <div className='bw_title_modal' style={headerStyles}>
          <h3 style={titleModal}>Chọn sản phẩm</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} style={closeModal} />
        </div>
        <div className='bw_main_modal' style={{ padding: '0px' }}>
          <DataTable
            columns={columns}
            data={items}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            page={page}
            totalItems={totalItems}
            onChangePage={onChangePage}
            loading={loading}
            onChangeSelect={onChangeSelect}
            defaultDataSelect={selectedProduct}
            fieldCheck='imei_code'
            isOrderProductList={true}
          />
        </div>
        <div className='bw_footer_modal bw_mt_1'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={() => {
              onConfirm(selectedProduct);
            }}>
            <span className='fi fi-rr-check' />
            Chọn sản phẩm
          </button>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
