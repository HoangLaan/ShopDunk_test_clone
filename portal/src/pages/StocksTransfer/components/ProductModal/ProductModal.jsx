import { getProductList } from 'pages/StocksTransfer/helpers/call-api';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FilterModel from './FilterModal';
import ModelTable from './ModalTable';
import { FormProvider, useForm } from 'react-hook-form';
const ProductModal = ({ open, onClose, onConfirm, selected, stockId = null }) => {
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 6,
  });

  const [data, setData] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const columns = useMemo(
    () => [
      {
        header: 'Ngày nhập kho',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.create_date}</span>,
      },
      {
        header: 'IMEI',
        accessor: 'product_imei',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.imei}</b>,
      },
      {
        header: 'Mã sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.product_code}</b>,
      },
      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.product_name}</b>,
      },
      {
        header: 'Số lô',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.lot_number != 'null' ? p?.lot_number : 'N/A'}</span>,
      },
      {
        header: 'Đơn vị tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.unit_name}</span>,
      },

      {
        header: 'Số lượng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.quantity}</span>,
      },
    ],
    [],
  );

  // Lấy danh sách ca làm việc
  const loadData = useCallback(() => {
    setLoading(true);
    getProductList({ ...params, stock_id: stockId })
      .then(setData)
      .finally(() => {
        setLoading(false);
      });
  }, [params, stockId]);
  useEffect(loadData, [loadData, stockId]);

  useEffect(() => {
    if (Object.values(selected).length) {
      setItemSelected(selected);
    }
  }, [selected]);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = data;

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

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
          <div className='bw_modal_container bw_w800' style={styleModal}>
            <div className='bw_title_modal' style={headerStyles}>
              <h3 style={titleModal}>Chọn sản phẩm chuyển kho</h3>
              <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose} style={closeModal}></span>
            </div>
            <div className='bw_main_modal bw_border_top'>
              <div className='bw_row'>
                <FilterModel
                  onChange={(p) => {
                    setParams({
                      ...params,
                      ...p,
                    });
                  }}
                />
                <div className='bw_col_12 bw_mt_1' style={{ overflowX: 'auto', maxHeight: '45vh' }}>
                  <h3 style={{ marginBottom: 7, fontWeight: 700 }}>Danh sách sản phẩm</h3>
                  <ModelTable
                    itemSelected={itemSelected}
                    setItemSelected={(_value) => setItemSelected(_value)}
                    data={items}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    page={page}
                    totalItems={totalItems}
                    columns={columns}
                    onChangePage={(page) => {
                      setParams({
                        ...params,
                        page: page,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='bw_footer_modal'>
              <button
                className='bw_btn bw_btn_success'
                type='button'
                onClick={() => onConfirm('product_transfer', itemSelected)}>
                <span className='fi fi-rr-check'></span>
                Cập nhật
              </button>
              <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </FormProvider>
    </React.Fragment>
  );
};

ProductModal.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default ProductModal;
