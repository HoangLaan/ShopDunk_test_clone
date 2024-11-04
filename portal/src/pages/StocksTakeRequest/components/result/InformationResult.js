import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

const InformationResult = ({ title }) => {
  const { watch } = useFormContext();

  const data = [
    {
      name: 'Phiếu nhập kiểm kê',
      render: <a target='_blank' href={`stocks-in-request/detail/${watch('stocks_take_in_id')}`}>{watch('stocks_take_in_code')}</a>
    },
    {
      name: 'Phiếu xuất kiểm kê',
      render: <a target='_blank' href={`stocks-out-request/detail/${watch('stocks_take_out_id')}`}>{watch('stocks_take_out_code')}</a>
    },
  ];

  const columns = [
    {
      header: 'Loại phiếu',
      accessor: 'name',
    },
    {
      header: 'Mã số phiếu',
      formatter: (p) => p?.render,
    },
  ];

  return (
    <BWAccordion title={title}>
      <DataTable noSelect noPaging columns={columns} data={data} />
    </BWAccordion>
  );
};

export default InformationResult;
