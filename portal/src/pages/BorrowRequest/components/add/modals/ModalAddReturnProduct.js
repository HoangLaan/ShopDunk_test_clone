import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import { defaultPaging, defaultParams } from 'utils/helpers';
import { getListReturnProduct } from 'services/borrow-request.service';

import ModalReturnProductTable from './ModalReturnProductTable';

const ModalWrapper = styled.div`
  .bw_modal_wrapper {
    max-height: 80vh;
    max-width: 80vw;
  }
`;

const styleModal = { marginLeft: '300px' };

const headerStyles = {
  backgroundColor: 'white',
  borderBottom: '#ddd 1px solid',
  position: 'sticky',
  marginTop: '-20px',
  // zIndex: '1',
  top: '-2rem',
  width: '74rem',
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

const ModalAddReturnProduct = ({ setIsOpenModal, borrowRequestId }) => {
  const [params, setParams] = useState(defaultParams);
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  const loadData = useCallback(() => {
    setLoading(true);
    let cloneParams = structuredClone(params);
    cloneParams.borrow_request_id = borrowRequestId;
    getListReturnProduct(cloneParams)
      .then(setDataItem)
      .finally(() => {
        setLoading(false);
      });
  }, [params, borrowRequestId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  return (
    <ModalWrapper>
      <div className='bw_modal bw_modal_open' id='bw_addProduct'>
        <div class='bw_modal_container bw_w1200 bw_modal_wrapper' style={styleModal}>
          <div class='bw_title_modal' style={headerStyles}>
            <h3 style={titleModal}>Danh sách đã mượn</h3>
            <span
              class='fi fi-rr-cross-small bw_close_modal'
              onClick={() => setIsOpenModal(false)}
              style={closeModal}></span>
          </div>
          <div>
            <div>
              <div className='bw_main_wrapp'>
                <ModalReturnProductTable
                  onChangePage={(page) => {
                    onChange({ page });
                  }}
                  data={items}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  page={page}
                  totalItems={totalItems}
                  loading={loading}
                />
              </div>
              <div className='bw_footer_modal bw_flex bw_justify_content_right'>
                <button
                  onClick={() => {
                    document.getElementById('trigger-delete')?.click();
                    setIsOpenModal(false);
                  }}
                  className='bw_btn bw_btn_success'>
                  Chọn sản phẩm
                </button>
                <button onClick={() => setIsOpenModal(false)} className='bw_btn_outline bw_close_modal'>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ModalAddReturnProduct;
