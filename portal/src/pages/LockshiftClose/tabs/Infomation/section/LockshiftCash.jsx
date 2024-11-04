import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWImage from 'components/shared/BWImage/index';
import { getOptionsGlobal } from 'actions/global';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { msgError } from 'pages/LockshiftClose/helpers/msgError';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { useFormContext, useFieldArray } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';
import styled from 'styled-components';
import { formatCurrency } from 'pages/Component/helpers/index';
import { formatPrice } from 'utils/index';

const TableWrapper = styled.div`
  .bw_mb_2 {
    margin-bottom: 0;
  }
  .bw_mt_2 {
    margin-top: 0;
  }
  .bw_image {
    width: 140px;
  }
`;

const LockshiftCash = ({ disabled, lockshiftId, title }) => {
  const methods = useFormContext();
  const { watch } = methods;

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Hình ảnh',
      formatter: (_, index) => {
        return <BWImage className='bw_image' src={_?.image_url} />;
      },
      classNameBody: 'bw_text_center',
    },
    {
      header: 'Mệnh giá',
      classNameBody: 'bw_text_right',
      disabled: disabled,
      formatter: (_, index) => {
        return formatPrice(_.denominations_value, true);
      },
    },
    {
      header: 'Số lượng kiểm đếm',
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput
            disabled={disabled}
            className='bw_input'
            type='number'
            field={`cash_list.${index}.actual_quantity`}
            // validation={msgError.actual_quantity}
          />
        </FormItem>
      ),
    },
    {
      header: 'Tổng tiền',
      classNameBody: 'bw_text_right',
      disabled: disabled,
      accessor: 'total_money',
      formatter: (item, index) => {
        return !isNaN(item.denominations_value * item.actual_quantity)
          ? formatPrice(item.denominations_value * item.actual_quantity, true)
          : 0;
      },
    },
    {
      header: 'Ghi chú',
      disabled: disabled,
      formatter: (_, index) => (
        <FormItem>
          <FormInput className='bw_input' disabled={disabled} type='text' field={`cash_list.${index}.note`} />
        </FormItem>
      ),
    },
  ];
  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mệnh giá',
      },
    ],
    [],
  );

  return (
    <BWAccordion title={title} id='bw_info_cus'>
      <div className='bw_col_12 '>
        <TableWrapper>
          <DataTable noSelect noPaging actions={actions} columns={columns} data={watch('cash_list')} />
        </TableWrapper>
      </div>
    </BWAccordion>
  );
};

export default LockshiftCash;
