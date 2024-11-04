import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Modal from 'components/shared/Modal';
import DataTable from 'components/shared/DataTable';
import BWButton from 'components/shared/BWButton';
import BWImage from 'components/shared/BWImage';
import DiscountProgramBankModalFilter from './DiscountProgramBankModalFilter';

import { defaultPaging, showToast } from 'utils/helpers';
import { getListBank } from 'services/bank.service';

const DiscountProgramBankModal = ({ open, onClose }) => {
  const methods = useFormContext();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [data, setData] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = data;

  const loadData = useCallback(() => {
    getListBank(params)
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        showToast.error(err?.message ?? 'Có lỗi xảy ra');
      });
  }, [params]);
  useEffect(loadData, [loadData]);

  const handleSubmitFilter = (values) => {
    let _query = { ...params, ...values, page: 1 };
    setParams(_query);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Logo',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => (
          <BWImage
            src={p?.bank_logo}
            key={`discount-program-bank-${idx}`}
            preview={false}
            style={{ maxHeight: '45px' }}
          />
        ),
        style: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        header: 'Tên viết tắt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => p.bank_code,
      },
      {
        header: 'Tên đầy đủ',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => p.bank_name,
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        header='Danh sách ngân hàng'
        open={open}
        onClose={onClose}
        footer={
          <BWButton
            type='success'
            outline
            content={'Xác nhận'}
            onClick={() => {
              if (document.getElementById('trigger-delete')) {
                document.getElementById('trigger-delete').click();
              } else {
                methods.setValue('bank_list', []);
              }
              onClose();
            }}
          />
        }>
        <DiscountProgramBankModalFilter onChange={handleSubmitFilter} />

        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='bank_id'
          defaultDataSelect={methods.watch('bank_list')}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(selected) => {
            methods.setValue('bank_list', selected);
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

export default DiscountProgramBankModal;
