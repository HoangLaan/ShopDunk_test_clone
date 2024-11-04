import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Modal from 'components/shared/Modal';
import DataTable from 'components/shared/DataTable';
import BWButton from 'components/shared/BWButton';
import DiscountProgramFinnanceCompanyModalFilter from './DiscountProgramFinnanceCompanyModalFilter';

import { defaultPaging, showToast } from 'utils/helpers';
import financeCompanyService from 'services/finance-company.service';

const DiscountProgramFinnanceCompanyModal = ({ open, onClose }) => {
  const methods = useFormContext();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [data, setData] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = data;

  const loadData = useCallback(() => {
    financeCompanyService
      .getList(params)
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
        header: 'Tên viết tắt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => p.finance_code,
      },
      {
        header: 'Tên đầy đủ',
        classNameHeader: 'bw_text_center',
        formatter: (p, idx) => p.finance_company_name,
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        header='Danh sách công ty tài chính'
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
                methods.setValue('finance_company_list', []);
              }
              onClose();
            }}
          />
        }>
        <DiscountProgramFinnanceCompanyModalFilter onChange={handleSubmitFilter} />

        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='finance_company_id'
          defaultDataSelect={methods.watch('finance_company_list')}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(selected) => {
            methods.setValue(
              'finance_company_list',
              selected?.map((item) => ({
                ...item,
                from_time: 0,
                to_time: 0,
                time_type: 0,
              })),
            );
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

export default DiscountProgramFinnanceCompanyModal;
