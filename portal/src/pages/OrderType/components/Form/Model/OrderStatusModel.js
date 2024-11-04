import React, { useCallback, useEffect, useMemo, useState } from 'react';

import FilterOrderStatusModel from './FilterOrderStatusModel';
import TableOrderStatusTable from './TableOrderStatusTable';
import { getListOrderStatus } from 'services/order-status.service';

const OrderStatusModel = ({ open, onClose, onConfirm, selected }) => {
  const [itemSelected, setItemSelected] = useState({});
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 6,
    is_active: 1,
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
        header: 'Tên trạng thái',
        accessor: 'order_status_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.order_status_name}</b>,
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        accessor: 'description',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
    ],
    [],
  );

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

  // Lấy danh sách
  const loadData = useCallback(() => {
    getListOrderStatus({ ...params }).then(setData);
  }, [params]);
  useEffect(loadData, [loadData]);

  useEffect(() => {
    let obj;
    if (Array.isArray(selected)) {
      obj = selected.reduce((a, v) => ({ ...a, ['key' + v.order_status_id]: { ...v, is_complete: false } }), {});
    } else {
      obj = selected;
    }
    setItemSelected(obj);
  }, [selected]);

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_chooseStatus'>
        <div className='bw_modal_container bw_w800' style={styleModal}>
          <div className='bw_title_modal' style={headerStyles}>
            <h3 style={titleModal}>Chọn trạng thái đơn hàng</h3>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} style={closeModal}></span>
          </div>
          <div className='bw_main_modal'>
            <div className='bw_row'>
              <FilterOrderStatusModel
                onChange={(p) => {
                  setParams({
                    ...params,
                    ...p,
                  });
                }}
              />
              <div className='bw_col_12 bw_mt_1' style={{ overflowX: 'auto', maxHeight: '45vh' }}>
                <TableOrderStatusTable
                  itemSelected={itemSelected}
                  setItemSelected={setItemSelected}
                  data={items}
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
            <button
              type='button'
              className='bw_btn bw_btn_success'
              onClick={() => onConfirm('order_status_list', itemSelected)}>
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

export default OrderStatusModel;
