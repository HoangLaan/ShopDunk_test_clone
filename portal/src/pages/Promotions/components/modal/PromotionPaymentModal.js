import React, { useState, useCallback, useEffect } from 'react';
import DataTable from 'components/shared/DataTable';

import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';

import { useDispatch } from 'react-redux';
import { getListPaymentForm } from 'services/payment-form.service';
import { useFormContext } from 'react-hook-form';
import { defaultPaging } from 'utils/helpers';
import PaymentFormFilter from 'pages/PaymentForm/components/PaymentFormFilter';

const PromotionPaymentModal = ({ open, columns, onClose }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [dataPayment, setDataPayment] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataPayment;

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

  const loadList = useCallback(() => {
    getListPaymentForm(params).then((data) => {
      setDataPayment(data);
    });
  }, [dispatch, params]);
  useEffect(loadList, [loadList]);

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        header='Danh sách hình thức thanh toán'
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
        <PaymentFormFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />

        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='payment_form_id'
          defaultDataSelect={methods.watch('payment_form_list')}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            methods.setValue('payment_form_list', e);
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

export default PromotionPaymentModal;
