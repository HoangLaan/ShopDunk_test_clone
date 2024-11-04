import { getUserList } from 'pages/UserSchedule/helpers/call-api';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FilterModel from './FilterModel';
import ModelTable from './ModelTable';

const UserModel = ({ open, onClose, onConfirm, selected, business_ids, store_ids, shift_ids }) => {
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
        header: 'Nhân viên',
        accessor: 'full_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => (
          <b className='bw_sticky bw_name_sticky'>
            {p?.user_name} - {p?.full_name}
          </b>
        ),
      },
      {
        header: 'Phòng ban',
        formatter: (p) => <span>{p?.department_name}</span>,
      },
      {
        header: 'Chức vụ',
        formatter: (p) => <span>{p?.position_name}</span>,
      },
    ],
    [],
  );

  const { items = [], itemsPerPage, page, totalItems, totalPages } = data;

  // Lấy danh sách ca làm việc
  const loadData = useCallback(() => {
    let newParams = { ...params };
    if (business_ids?.length > 0) {
      const _business_ids = business_ids.map((x) => x.id).join('|');
      const _store_ids = store_ids.map((x) => x.id).join('|');
      const shift_ids_converted = Object.keys(shift_ids);
      const _shift_ids = shift_ids_converted.join('|');

      newParams = {
        ...params,
        business_ids: _business_ids,
        store_ids: _store_ids,
        shift_ids: _shift_ids
      };
    }
    getUserList(newParams).then(setData);
  }, [params, business_ids, store_ids, shift_ids]);
  useEffect(loadData, [loadData, business_ids]);

  useEffect(() => {
    setItemSelected(selected);
  }, [selected, open]);

  // reset page on open
  useEffect(() => {
    if (open) {
      setParams((pre) => ({
        ...pre,
        page: 1,
      }));
    }
  }, [open]);

  //style to set up modal position
  const styleModal = { marginLeft: '300px' };

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container bw_w900'>
          <div className='bw_title_modal'>
            <h3>Chọn nhân viên</h3>
            <span
              className='bw_close_modal fi fi-rr-cross-small'
              onClick={() => {
                onClose();
                // setCheckedAll(false);
              }}></span>
          </div>
          <div className='bw_main_modal bw_border_top'>
            <div className='bw_row'>
              <FilterModel
                onChange={(p) => {
                  setParams({
                    ...params,
                    ...p,
                    page: 1,
                  });
                }}
              />
              <div className='bw_col_12 bw_mt_1' style={{ overflowX: 'auto', maxHeight: '40vh' }}>
                <div className='bw_row'>
                  <div className='bw_col_6'>
                    {/* <h3 style={{ marginBottom: 7, fontWeight: 700 }}>Danh sách ca làm việc</h3> */}
                  </div>
                  <div className='bw_col_4'></div>
                  {/* <div className='bw_col_2'>
                    <label className='bw_checkbox'>
                      <input checked={checkedAll} type='checkbox' onChange={handleCheckALLUsers} />
                      <span />
                      Chọn tất cả
                    </label>
                  </div> */}
                </div>

                <ModelTable
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
            <button className='bw_btn bw_btn_success' onClick={() => onConfirm('user', itemSelected)}>
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

UserModel.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
  business_ids: PropTypes.array,
};

export default UserModel;
