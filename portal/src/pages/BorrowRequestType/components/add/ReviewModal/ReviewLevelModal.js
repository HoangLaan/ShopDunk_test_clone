import React, { useState, useCallback, useEffect } from 'react';

import { getListBorrowReviewLv } from 'services/borrow-request-rl.service';
import { useAuth } from 'context/AuthProvider';

import ReviewLevelModalTable from './ReviewLevelModalTable';
import ReviewLevelModalAdd from './ReviewLevelModalAdd';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';

///zone handle scroll effect for header position
const headerStyles = {
  backgroundColor: 'white',
  borderBottom: '#ddd 1px solid',
  position: 'sticky',
  marginTop: '-20px',
  zIndex: '1',
  top: '-2rem',
  // width: '74rem',
  marginLeft: '-20px',
  height: '4rem',
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

const ReviewLevelModal = ({ onClose,reviewLevelUserListField }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 10,
    company_id: user?.company_id,
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
    getListBorrowReviewLv(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => setLoading(false));
  }, [params]);
  useEffect(loadReviewLevel, [loadReviewLevel]);

  return (
    <ModalPortal
      title='Chọn mức duyệt'
      style={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
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
        reviewLevelUserListField={reviewLevelUserListField}
      />
    </ModalPortal>
  );
};

export default ReviewLevelModal;
