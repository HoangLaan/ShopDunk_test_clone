import { getList } from 'pages/Shift/helpers/call-api';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ShiftFilterModel from './ShiftFilterModel';
import ShiftModelTable from './ShiftModelTable';

const ShiftModel = ({ open, onClose, onConfirm, selected = {} ,store_ids, user_id}) => {
  const [itemSelected, setItemSelected] = useState({});

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 6,
    is_active: 1,
  });
  const [dataShift, setDataShift] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  //style Modal to set up modal position
  const styleModal = { marginLeft: '300px' };

  const columns = useMemo(
    () => [
      {
        header: 'Tên ca làm việc',
        accessor: 'shift_name',
        classNameHeader: 'bw_sticky bw_name_sticky ',
        classNameBody: 'bw_sticky bw_name_sticky ',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.shift_name}</b>,
      },
      {
        header: 'Giờ bắt đầu',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.time_start}</span>,
      },
      {
        header: 'Giờ kết thúc',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.time_end}</span>,
      },

      {
        header: 'Số công',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'numberofworkday',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'shift_description',
      },
      // {
      //   header: 'Trạng thái',
      //   accessor: 'is_active',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   formatter: (p) =>
      //     p?.is_active ? (
      //       <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
      //     ) : (
      //       <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
      //     ),
      // },
    ],
    [],
  );

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataShift;
  // Lấy danh sách ca làm việc
  const loadShift = useCallback(() => {
    getList({...params,store_ids: store_ids, user_id: user_id}).then(setDataShift);
  }, [params, store_ids, user_id]);

  useEffect(loadShift, [loadShift,store_ids]);

  useEffect(() => {
    setItemSelected(selected);
  }, [selected, open]);

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container bw_w900' style={styleModal}>
          <div className='bw_title_modal'>
            <h3>Chọn ca làm việc</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
          </div>
          <div className='bw_main_modal bw_border_top'>
            <div className='bw_row'>
              <ShiftFilterModel
                onChange={(p) => {
                  setParams({
                    ...params,
                    ...p,
                  });
                }}
              />
              <div className='bw_col_12 bw_mt_1' style={{ overflowX: 'auto', maxHeight: '40vh' }}>
                <h3 style={{ marginBottom: 7, fontWeight: 700 }}>Danh sách ca làm việc</h3>
                <ShiftModelTable
                  itemSelected={itemSelected}
                  setItemSelected={setItemSelected}
                  data={items}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  page={parseInt(page)}
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
            <button className='bw_btn bw_btn_success' type='button' onClick={() => onConfirm('shift', itemSelected)}>
              <span className='fi fi-rr-check'></span>
              Cập nhật
            </button>
            <button type='button' onClick={onClose} className='bw_btn_outline bw_btn_outline_success'>
              <span className='fi fi-rr-refresh'></span>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ShiftModel.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default ShiftModel;
