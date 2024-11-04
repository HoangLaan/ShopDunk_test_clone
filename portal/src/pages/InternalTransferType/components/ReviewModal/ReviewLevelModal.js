import React, { useState, useCallback, useEffect } from 'react';

import ReviewLevelModalTable from './ReviewLevelModalTable';
import ReviewLevelModalAdd from './ReviewLevelModalAdd';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import internalTransferTypeService from 'services/internalTransferType.service';

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

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
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

  const loadReviewLevel = useCallback(() => {
    setLoading(true);
    internalTransferTypeService
      .getReviewLevelList(params)
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
      />
    </ModalPortal>
  );
};

export default ReviewLevelModal;
