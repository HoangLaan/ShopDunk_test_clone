import React, { useState, useCallback, useEffect } from 'react';

import ReviewLevelModalTable from './ReviewLevelModalTable';
import ReviewLevelModalAdd from './ReviewLevelModalAdd';
import purchaseRequisitionService from 'services/purchase-requisition.service';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';

const ReviewLevelModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadReviewLevel = useCallback(() => {
    setLoading(true);
    purchaseRequisitionService
      .getReviewLevelList(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => setLoading(false));
  }, [params]);
  useEffect(loadReviewLevel, [loadReviewLevel]);

  return (
    <ModalPortal
      title='Thêm mức duyệt'
      width={1200}
      onClose={onClose}
      onConfirm={() => {
        document.getElementById('trigger-delete')?.click();
        onClose();
      }}>
      <ReviewLevelModalAdd onRefresh={loadReviewLevel} />
      <ReviewLevelModalTable
        loading={loading}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={(page) => setParams((prev) => ({ ...prev, page }))}
        onRefresh={loadReviewLevel}
        onClose={onClose}
      />
    </ModalPortal>
  );
};

export default ReviewLevelModal;
