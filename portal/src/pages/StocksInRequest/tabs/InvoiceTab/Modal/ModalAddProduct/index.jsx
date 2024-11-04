import React, { useState, useEffect } from 'react';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';
import FilterSection from './section/Filter';
import TableSection from './section/Table';
import { getListPurchaseOrder, getDetailPurchaseOrder } from 'pages/PurchaseOrder/helpers/call-api';
import styled from 'styled-components';
import { convertFromPurchaseOrder } from '../../utils/helper';
import { useFormContext } from 'react-hook-form';

const StickyFooter = styled.div`
  display: flex;
  justify-content: end;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 2;
  padding-bottom: 20px;
`;

const FIELD_NAME = 'product_list';

const AddPurchaseOrder = ({ open, onClose, title }) => {
  const methods = useFormContext();
  const [params, setParams] = useState({
    ...defaultParams,
    itemsPerPage: 10,
    supplier_id: methods?.watch('supplier_id'),
    purchase_order_id: methods?.watch('purchase_order_id'),
  });
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState([]);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  useEffect(() => {
    setLoading(true);
    getListPurchaseOrder(params)
      .then((data) => {
        setDataItem(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  return (
    <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_addProduct' style={{ marginLeft: '140px' }}>
      <div class='bw_modal_container bw_w1200 bw_modal_wrapper' style={{ maxHeight: '75vh' }}>
        <div
          class='bw_title_modal'
          style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '0px' }}>
          <h3>{title}</h3>
          <span class='fi fi-rr-cross-small bw_close_modal' onClick={onClose}></span>
        </div>
        <div>
          <div className='bw_main_wrapp'>
            <FilterSection onChange={onChange} />
            <TableSection
              onChangePage={(page) => {
                onChange({ page });
              }}
              data={items}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              page={page}
              totalItems={totalItems}
              loading={loading}
              closeModal={onClose}
              onChangeSelect={setSelectedData}
            />
          </div>
        </div>
        <StickyFooter className='bw_footer_modal bw_mt_1'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={async () => {
              if (!selectedData || selectedData?.length === 0) {
                showToast.warning('Vui lòng chọn đơn mua hàng !');
              } else {
                const purchaseDetails = await Promise.all(
                  selectedData?.map((purchase) => getDetailPurchaseOrder(purchase?.purchase_order_id)),
                );

                purchaseDetails.forEach((purchase) => {
                  const productList = convertFromPurchaseOrder(purchase);
                  methods.setValue(FIELD_NAME, methods.watch(FIELD_NAME)?.concat(productList));
                  methods.setValue('update_all_product', {});
                  onClose();
                });
              }
            }}>
            <span className='fi fi-rr-check' /> Xác nhận
          </button>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </StickyFooter>
      </div>
    </div>
  );
};

export default AddPurchaseOrder;
