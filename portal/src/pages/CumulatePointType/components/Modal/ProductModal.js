import React, { useState, useCallback, useEffect } from 'react';
import DataTable from 'components/shared/DataTable';

import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';

import { useDispatch } from 'react-redux';
import { getList } from 'services/product.service';
import { useFormContext } from 'react-hook-form';
import { defaultPaging } from 'utils/helpers';
import PromotionProductFilter from 'pages/PromotionOffers/components/add/PromotionProductFilter';

const ProductModal = ({ open, columns, onClose }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [dataProduct, setDataProduct] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataProduct;

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

  const loadProduct = useCallback(() => {
    getList(params).then((data) => {
      setDataProduct(data);
    });
  }, [dispatch, params]);
  useEffect(loadProduct, [loadProduct]);

  const handleSubmitFilter = (values) => {
    let _query = { ...params, ...values, page: 1 };
    setParams(_query);
  };

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        header='Chọn sản phẩm'
        styleModal={styleModal}
        headerStyles={headerStyles}
        titleModal={titleModal}
        closeModal={closeModal}
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
        <PromotionProductFilter onChange={handleSubmitFilter} />
        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='product_id'
          defaultDataSelect={methods.watch('list_product')}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            methods.setValue('list_product', e);
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

export default ProductModal;
