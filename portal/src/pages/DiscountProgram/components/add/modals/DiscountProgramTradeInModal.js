import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import Modal from 'components/shared/Modal';
import DataTable from 'components/shared/DataTable';
import BWButton from 'components/shared/BWButton';
import DiscountProgramTradeInModalFilter from './DiscountProgramTradeInModalFilter';

import { defaultPaging, showToast } from 'utils/helpers';
import tradeInProgramService from 'services/trade-in-program.service';

const DiscountProgramTradeInModal = ({ open, onClose }) => {
  const methods = useFormContext();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [data, setData] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = data;

  const loadData = useCallback(() => {
    tradeInProgramService
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
        header: 'Chương trình thu cũ đổi mới',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.trade_in_program_name}</b>,
      },
      {
        header: 'Áp dụng từ',
        classNameHeader: 'bw_text_center',
        accessor: 'begin_date',
      },
      {
        header: 'Áp dụng đến',
        classNameHeader: 'bw_text_center',
        accessor: 'end_date',
      },
      {
        header: 'Trạng thái áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'apply_status_name',
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        header='Chọn chương trình thu cũ đổi mới'
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
                methods.setValue('trade_in_program_list', []);
              }
              onClose();
            }}
          />
        }>
        <DiscountProgramTradeInModalFilter onChange={handleSubmitFilter} />

        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='trade_in_program_id'
          defaultDataSelect={methods.watch('trade_in_program_list')}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            const selected = e?.map((item) => ({
              ...item,
              supplier_deductible_type: item.supplier_deductible_type || 1,
              buyer_deductible_type: item.supplier_deductible_type || 1,
            }));
            methods.setValue('trade_in_program_list', selected);
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

export default DiscountProgramTradeInModal;
