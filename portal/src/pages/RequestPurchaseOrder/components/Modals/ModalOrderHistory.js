import React, { useState } from 'react';
import { MEDIUM_LIST_PARAMS } from 'utils/constants';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import FilterOrderHistory from '../Filters/FilterOrderHistory';
import TableOrderHistory from '../Tables/TableOrderHistory';

function ModalOrderHistory({ setModalHistory, product, purchaseRequisitionList }) {
  const purchase_requisition_ids = purchaseRequisitionList?.map((v) => v.value);
  const initParams = {
    ...MEDIUM_LIST_PARAMS,
    product_id: product?.product_id,
    purchase_requisition_ids,
  };
  const [params, setParams] = useState(initParams);
  const onClearParams = () => setParams(initParams);
  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  return (
    <ModalPortal
      title='Lịch sử bán hàng'
      onConfirm={false}
      width={1200}
      onClose={() => setModalHistory({ isOpen: false, product: null })}>
      <div style={{ marginBottom: 20 }}>
        Sản phẩm:{' '}
        <a
          href='/#'
          onClick={(e) => {
            e.preventDefault();
            window._$g.rdr(`/product/detail/${product.product_id}?tab_active=information`);
          }}>
          {product.product_code} - {product.product_name}
        </a>
      </div>
      <FilterOrderHistory
        onChange={onChange}
        onClearParams={onClearParams}
        purchaseRequisitionIds={purchase_requisition_ids}
      />
      <TableOrderHistory params={params} onChange={onChange} />
    </ModalPortal>
  );
}

export default ModalOrderHistory;
