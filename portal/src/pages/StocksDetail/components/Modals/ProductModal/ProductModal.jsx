import React from 'react'
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { defaultPaging, defaultParams } from 'utils/helpers';
import Filter from './Filter';
import Table from './Table';
import { getList } from 'services/product.service';
const ModalWrapper = styled.div`
  .bw_modal_wrapper {
    max-height: 80vh;
    max-width: 80vw;
  }
`;

function ProductModal({ setIsOpenModal }) {
    const [params, setParams] = useState(defaultParams);
    const [dataItem, setDataItem] = useState(defaultPaging);
    const [loading, setLoading] = useState(true);
  
    const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

    const styleModal = { marginLeft: '300px' };

    const headerStyles = {
      backgroundColor: 'white',
      borderBottom: '#ddd 1px solid',
      position: 'sticky',
      marginTop: '-20px',
      zIndex: '1',
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

    const loadData = useCallback(() => {
        setLoading(true);
        getList(params)
          .then(setDataItem)
          .finally(() => {
            setLoading(false);
          });
      }, [params]);
    
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
            <h3 style={titleModal}>CHỌN HÀNG HÓA VẬT TƯ TÍNH GIÁ</h3>
            <span
              class='fi fi-rr-cross-small bw_close_modal'
              onClick={() => setIsOpenModal(false)}
              style={closeModal}></span>
          </div>
          <div>
            <div>
              <div className='bw_main_wrapp'>
                <Filter onChange={onChange} />
                <Table
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
                  Chọn
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
  )
}

export default ProductModal