import React, { useState, useCallback, useEffect } from 'react';
import { showToast } from 'utils/helpers';

import SelectMemberModalTable from './SelectMemberModalTable';
import SelectMemberModalFilter from './SelectMemberModalFilter';

import { getMemberList } from 'services/task.service';

const SelectMemberModal = ({ onClose, customerType }) => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    gender: 2,
    crm_state: 1,
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
    customer_type: customerType,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '50rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
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

  const loadData = useCallback(() => {
    setLoading(true);
    getMemberList(params)
      .then(setDataList)
      .catch((err) => {
        showToast.error(err?.message ?? 'Có lỗi xảy ra', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadData, [loadData]);

  return (
    <div className='bw_modal bw_modal_open' id='bw_skill'>
      <div className='bw_modal_container bw_w800' style={styleModal}>
        <div className='bw_title_modal' style={headerStyles}>
          <h3 style={titleModal}>Danh sách khách hàng {customerType === 1 ? 'cá nhân' : 'tiềm năng'}</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal' style={closeModal}></span>
        </div>

        <div className='bw_main_modal'>
          <SelectMemberModalFilter
            onChange={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                };
              });
            }}
            customerType={customerType}
          />
          <SelectMemberModalTable
            loading={loading}
            data={items}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            page={page}
            totalItems={totalItems}
            onChangePage={(page) => {
              setParams({
                ...params,
                page,
              });
            }}
            onRefresh={loadData}
            customerType={customerType}
          />
        </div>
        <div className='bw_footer_modal bw_flex bw_justify_content_right'>
          <button
            onClick={() => {
              document.getElementById('trigger-delete')?.click();
              onClose();
            }}
            className='bw_btn bw_btn_success'>
            Chọn khách hàng
          </button>
          <button onClick={onClose} className='bw_btn_outline bw_close_modal'>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectMemberModal;
