import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Tooltip } from 'antd';

import { formatPrice } from 'utils/index';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import styled from 'styled-components';

const BWAccordionStyled = styled(BWAccordion)`
  .bw_table th:nth-last-child(2) {
    left: none;
    right: 0;
  }
`;

const Products = () => {
  const methods = useFormContext({});
  const { watch } = methods;

  const columns = useMemo(
    () => [
      // {
      //   header: 'STT',
      //   classNameHeader: 'bw_text_center bw_w1',
      //   classNameBody: 'bw_text_center',
      //   formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
      // },
      {
        header: 'IMEI',
        formatter: (p) => <b>{p?.imei_code}</b>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên sản phẩm',
        formatter: (p) => (
          <Tooltip title={p?.product_name}>
            {p?.product_name?.length > 43 ? p?.product_name.slice(0, 40) + '...' : p?.product_name}
          </Tooltip>
        ),
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'ĐVT',
        accessor: 'unit_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Hình thức xuất',
        accessor: 'product_output_type_id',
        formatter: (p, idx) => (
          <FormSelect
            disabled
            value={p?.product_output_type_id}
            list={p?.product_output_type || []}
            className='bw_inp'
            style={{ padding: '0px 16px' }}
            placeholder={'--Chọn--'}
          />
        ),
        classNameHeader: 'bw_text_center',
      },
      // {
      //   header: 'Đơn giá bán (chưa bao gồm VAT)',
      //   accessor: 'base_price',
      //   formatter: (p) => <span>{formatPrice(p?.base_price, false, ',')}</span>,
      //   classNameBody: 'bw_text_right',
      // },
      {
        header: 'Thành tiền',
        accessor: 'total_price',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{formatPrice(p?.total_price_base, false, ',')}</b>,
      },
      {
        header: 'Thuế suất',
        accessor: 'value_vat',
        formatter: (p) => {
          return (
            <div className='bw_text_center'>
              <span>{p?.value_vat ? p?.value_vat + '%' : '0%'}</span>
            </div>
          );
        },
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tiền thuế VAT',
        accessor: 'vat_amount',
        formatter: (p) => <span>{formatPrice(p?.vat_amount, false, ',')}</span>,
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Thành tiền (đã bao gồm VAT)',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_right',
        formatter: (p) => <b>{formatPrice(p?.total_price, false, ',')}</b>,
        styleHeader: { minWidth: '138px', textWrap: 'wrap', right: '0' },
        style: { right: '0' },
      },
      {
        header: 'Ghi chú',
        accessor: 'note',
        formatter: (p, idx) => (
          <input type='text' disabled value={p?.note} className='bw_inp bw_mw_2' placeholder='Ghi chú' />
        ),
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [];
  }, []);

  return (
    <BWAccordionStyled title='Thông tin sản phẩm' id='bw_info_cus' isRequired>
      <DataTable
        columns={columns}
        data={watch('products') ? Object.values(watch('products')) : []}
        actions={actions}
        noPaging={true}
        noSelect={true}
      />
    </BWAccordionStyled>
  );
};

export default Products;
