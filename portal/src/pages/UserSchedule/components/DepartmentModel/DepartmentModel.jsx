import { getDepartmentList } from 'pages/UserSchedule/helpers/call-api';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FilterModel from './DepartmentFilterModel';
import ModelTable from './DepartmentModelTable';

const DepartmentModel = ({ open, onClose, onConfirm, selected }) => {
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
        header: 'Phòng ban',
        accessor: 'department_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.department_name}</b>,
      },
      {
        header: 'Công ty',
        formatter: (p) => <span>{p?.company_name}</span>,
      },
      {
        header: 'Địa chỉ',
        formatter: (p) => <span>{p?.company_address_full}</span>,
      },
    ],
    [],
  );

  const { items = [], itemsPerPage, page, totalItems, totalPages } = data;
  // Lấy danh sách ca làm việc
  const loadData = useCallback(() => {
    getDepartmentList(params).then(setData);
  }, [params]);

  useEffect(loadData, [loadData]);

  useEffect(() => {
    setItemSelected(selected);
  }, [selected, open]);

  //style to set up modal position
  const styleModal = { marginLeft: '300px' };

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container bw_w900' style={styleModal}>
          <div className='bw_title_modal'>
            <h3>Chọn phòng ban</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
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
              <div className='bw_col_12 bw_mt_1' style={{ overflowX: 'auto', maxHeight: '40vh' }}>
                <h3 style={{ marginBottom: 7, fontWeight: 700 }}>Danh sách ca làm việc</h3>
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
            <button className='bw_btn bw_btn_success' onClick={() => onConfirm('department', itemSelected)}>
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

DepartmentModel.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default DepartmentModel;
