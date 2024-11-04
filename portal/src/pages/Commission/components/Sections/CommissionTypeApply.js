import React, { useEffect, useState } from 'react';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion/index';

import FormTwoType from '../FormTwoType/FormTwoType';

import { getOptionsOrderType } from 'services/commission.service';

function CommissionTypeApply({ disabled, title }) {
  const [optionsOrderType, setOptionsOrderType] = useState(null);

  useEffect(() => {
    const getOrderTypeOptions = async () => {
      let data = await getOptionsOrderType();
      const orderTypeOpts = data.items.map((_res) => ({
        label: _res.order_type_name,
        value: _res.order_type_id.toString(),
        ..._res,
      }));

      setOptionsOrderType(orderTypeOpts);
    };
    getOrderTypeOptions();
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormTwoType
            label='Giá trị hoa hồng'
            fieldType='type_value'
            fieldValue='commission_value'
            disabled={disabled}
            bordered={false}
          />
        </div>
        <div className='bw_col_12'>
          <FormItem label='Loại đơn hàng áp dụng' isRequired={true}>
            <FormSelect
              field='order_types'
              mode='multiple'
              list={optionsOrderType}
              disabled={disabled}
              validation={{
                required: 'Loại đơn hàng áp dụng là bắt buộc',
              }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default CommissionTypeApply;
