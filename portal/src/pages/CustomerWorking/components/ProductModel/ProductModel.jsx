import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FilterModel from './FilterModel';
import ModelTable from './ModelTable';
import { formatPrice } from 'utils/index';
// Service
import { getList } from 'services/product.service';
const ProductModel = ({ open, onClose, onConfirm, selected = {} }) => {
  const [itemSelected, setItemSelected] = useState({});

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
  });
  const [data, setData] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 25,
    totalPages: 1,
  });

  const columns = useMemo(
    () => [
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      },
      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.product_name}</span>,
      },
      {
        header: 'Loại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'product_type',
        formatter: (p) => {
          if (p?.product_type === 2) {
            return <span className='bw_label bw_label_success'>Linh kiện</span>;
          } else {
            return <span className='bw_label bw_label_danger'>Sản phẩm</span>;
          }
        },
      },
      {
        header: 'Giá bán',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.price ? formatPrice(p?.price, true, ',') : 0}</span>,
      },
      {
        header: 'Đơn vị tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.unit_name}</span>,
      },
    ],
    [],
  );

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '49rem',
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

  const { items = [], itemsPerPage, page, totalItems, totalPages } = data;

  // Lấy danh sách sản phẩm
  const loadData = useCallback(() => {
    getList({ ...params })
      .then((res) => {
        setData(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setItemSelected(selected);
  }, []);

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container bw_w800' id='bw_walk_in_modal' style={styleModal}>
          <div className='bw_title_modal' style={headerStyles}>
            <h3 style={titleModal}>Chọn sản phẩm bán</h3>
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
                  setItemSelected={setItemSelected}
                  data={items || []}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  page={page}
                  totalItems={totalItems}
                  columns={columns}
                  onChangePage={(page) => {
                    setParams({
                      ...params,
                      page,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className='bw_footer_modal'>
            <button type='button' className='bw_btn bw_btn_success' onClick={() => onConfirm('products', itemSelected)}>
              <span className='fi fi-rr-check'></span>
              Cập nhật
            </button>
            <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_danger'>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ProductModel.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default ProductModel;
