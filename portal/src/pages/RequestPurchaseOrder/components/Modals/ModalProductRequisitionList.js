/* eslint-disable react/style-prop-object */
import React, { useCallback, useState } from 'react';
import { useRequestPurchaseContext } from 'pages/RequestPurchaseOrder/helpers/context';
import TableProductRequisitionList from 'pages/RequestPurchaseOrder/components/Tables/TableProductRequisitionList';
import FilterProductRequisitionList from 'pages/RequestPurchaseOrder/components/Filters/FilterProductRequisitionList';

const ModalProductRequisitionList = ({ disabled }) => {
  const { modalPRListProduct, modalPRList, openModalPRList, closeModalPRListFunc } = useRequestPurchaseContext();

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
  });

  const onChangePage = useCallback(
    (page) => {
      setParams((prev) => ({ ...prev, page }));
    },
    [params],
  );

  const onCloseModal = () => {
    closeModalPRListFunc();
  };

  const _params = {
    ...params,
    product_id: modalPRListProduct.product_id,
    purchase_requisition_list: modalPRList,
  };

  return openModalPRList ? (
    <div className='bw_modal bw_modal_open bw_modal_supplier'>
      <div className='bw_modal_container bw_w900'>
        <div className='bw_title_modal'>
          <h3>Danh sách phiếu yêu cầu nhập hàng</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onCloseModal}></span>
        </div>
        <div className='bw_main_modal'>
          <div className='bw_row'>
            <div className='bw_col_12'>
              <div className='bw_modal_title bw_text_left'>
                <div>Số lượng: <b>{modalPRListProduct.total_quantity}</b></div>
                <div>
                  Sản phẩm:{' '}
                  <a href="/#" onClick={(e) => {
                    e.preventDefault();
                    window._$g.rdr(`/product/detail/${modalPRListProduct.product_id}?tab_active=information`)
                  }}>
                    {modalPRListProduct.product_code} - {modalPRListProduct.product_name}
                  </a>
                </div>
              </div>
            </div>
            <div className='bw_col_12'>
              <FilterProductRequisitionList onChange={(p) => setParams({ ...params, ...p })} />
              <TableProductRequisitionList params={_params} onChangePage={onChangePage} />
            </div>
          </div>
        </div>
        <div className='bw_footer_modal'>
          <button className='bw_btn_outline bw_close_modal' onClick={onCloseModal}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ModalProductRequisitionList;
