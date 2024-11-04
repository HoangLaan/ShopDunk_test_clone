import React from 'react';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import styled from 'styled-components';

const TableWrapper = styled.div`
  .bw_mt_2 {
    margin-top: 0;
  }
  .bw_image {
    width: 140px;
  }
`;

const LockshiftCustomers = ({ disabled, title }) => {
  const methods = useFormContext();

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Mã khách hàng',
      disabled: disabled,
      accessor: 'customer_code',
    },
    {
      header: 'Tên khách hàng',
      disabled: disabled,
      accessor: 'fullname',
    },
    {
      header: 'Số điện thoại',
      disabled: disabled,
      accessor: 'phone_number',
    },
    {
      header: 'Email',
      disabled: disabled,
      accessor: 'email',
    },
    {
      header: 'Ghi chú',
      disabled: disabled,
      accessor: 'note',
    },
    {
      header: 'Trạng thái',
      disabled: disabled,
      accessor: 'customer_status',
    },
  ];

  const actions = [];

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_col_12'>
        <TableWrapper>
          <DataTable noSelect noPaging actions={actions} columns={columns} data={methods.watch('customer_list')} />
        </TableWrapper>
      </div>
    </BWAccordion>
  );
};

export default LockshiftCustomers;
