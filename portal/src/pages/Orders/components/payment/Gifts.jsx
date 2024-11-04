import React from 'react';
import { useFormContext } from 'react-hook-form';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const Gifts = ({ disabled }) => {
  const methods = useFormContext({});
  const { watch } = methods;

  const gifts = watch('gifts');

  const columns = [
    {
      header: 'IMEI',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (p, idx) => (
        <FormSelect
          mode='multiple'
          list={p?.imei_code_options || []}
          field={`gifts[${idx}].imei_codes`}
          disabled={disabled}
          allowClear
          style={{ minWidth: '125px' }}
        />
      ),
    },
    {
      header: 'Mã sản phẩm',
      accessor: 'product_code',
      formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên sản phẩm',
      formatter: (p) => (p?.product_name?.length > 50 ? p?.product_name.slice(0, 47) + '...' : p?.product_name),
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Số lượng',
      accessor: 'quantity',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
    },
    {
      header: 'Đơn giá',
      accessor: 'total_price',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (p) => 0,
    },
    {
      header: 'Thành tiền',
      accessor: 'total_price',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (p) => <b className='bw_sticky bw_name_sticky'>{0}</b>,
    },
    {
      header: 'Ghi chú',
      accessor: 'note',
      formatter: (p, idx) => (
        <input type='text' disabled={disabled} value={p?.note} className='bw_inp bw_mw_2' placeholder='Ghi chú' />
      ),
      classNameHeader: 'bw_text_center',
    },
  ];

  return (
    <BWAccordion title='Thông tin quà tặng' id='bw_info_cus' isRequired>
      <DataTable columns={columns} data={gifts || []} noPaging={true} noSelect={true} />
    </BWAccordion>
  );
};

export default Gifts;
