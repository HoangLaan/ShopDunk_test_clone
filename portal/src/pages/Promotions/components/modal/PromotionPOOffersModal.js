import React, { useState, useCallback, useEffect } from 'react';
import DataTable from 'components/shared/DataTable';
import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';
import { useDispatch } from 'react-redux';
import { getList } from 'services/promotion-offers.service';
import { useFormContext } from 'react-hook-form';
import { defaultPaging, defaultParams } from 'utils/helpers';
import PromotionOffersFilter from 'pages/PromotionOffers/components/table/PromotionOffersFilter';

const PromotionPOOffersModal = ({ open, columns, onClose }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [dataProductCategory, setDataProductCategory] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataProductCategory;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '47rem',
    marginLeft: '-20px',
    height: '4rem',
  };

  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  const loadListPromotionOffer = useCallback(() => {
    getList(params).then((data) => {
      setDataProductCategory(data);
    });
  }, [dispatch, params]);
  useEffect(loadListPromotionOffer, [loadListPromotionOffer]);

  const handleSubmitFilter = (values) => {
    let _query = { ...params, ...values, page: 1 };
    setParams(_query);
  };

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        styleModal={styleModal}
        headerStyles={headerStyles}
        closeModal={closeModal}
        header='Danh sách ưu đãi khuyến mại'
        open={open}
        onClose={onClose}
        footer={
          <BWButton
            type='success'
            outline
            content={'Xác nhận'}
            onClick={() => {
              document.getElementById('trigger-delete').click();
              onClose();
            }}
          />
        }>
        <PromotionOffersFilter
          onClear={() => {
            setParams({
              search: '',
              offer_type: null,
              bussiness_id: null,
              company_id: null,
              ...defaultParams,
            });
          }}
          onChange={handleSubmitFilter}
        />

        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='promotion_offer_id'
          defaultDataSelect={methods.watch('promotion_offer_apply_list')}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            methods.setValue('promotion_offer_apply_list', e);
          }}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
        />
      </Modal>
    </React.Fragment>
  );
};

export default PromotionPOOffersModal;
