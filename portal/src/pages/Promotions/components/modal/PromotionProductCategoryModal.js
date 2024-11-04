import React, { useState, useCallback, useEffect } from 'react';
import DataTable from 'components/shared/DataTable';

import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';

import { useDispatch } from 'react-redux';
import { getList } from 'services/product-category.service';
import { useFormContext } from 'react-hook-form';
import { defaultPaging } from 'utils/helpers';
import Filter from 'pages/ProductCategory/components/Filter';

const PromotionProductCategoryModal = ({ open, columns, onClose }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [dataProductCategory, setDataProductCategory] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataProductCategory;

  const loadCustomerType = useCallback(() => {
    getList(params).then((data) => {
      setDataProductCategory(data);
    });
  }, [dispatch, params]);
  useEffect(loadCustomerType, [loadCustomerType]);

  const handleSubmitFilter = (values) => {
    let _query = { ...params, ...values, page: 1 };
    setParams(_query);
  };

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

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        styleModal={styleModal}
        headerStyles={headerStyles}
        titleModal={titleModal}
        closeModal={closeModal}
        header='Chọn ngành hàng'
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
        <Filter
          onChange={handleSubmitFilter}
          hiddenBoxFilter={{ company: true, show_web: true, type: true, date_construct: true }}
        />
        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='product_category_id'
          defaultDataSelect={methods.watch('product_category_apply_list')}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            methods.setValue('product_category_apply_list', e);
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

export default PromotionProductCategoryModal;
