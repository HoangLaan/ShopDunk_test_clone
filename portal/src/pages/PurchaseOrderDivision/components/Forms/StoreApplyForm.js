import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import usePageInformation from 'hooks/usePageInformation';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import StoreApplyTableNoneStock from '../Tables/StoreApplyTable';
import StoreApplyTableStock from '../Tables/StoreApplyModify';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import purchaseOrderDivisionService from 'services/purchaseOrderDivision.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

function StoreApplyForm({ title, stockOption }) {
  const methods = useFormContext();
  const { disabled } = usePageInformation();

  // const businessOptions = useGetOptions(optionType.business);
  const areaOptions = useGetOptions(optionType.area);
  const [businessOptions, setBusinessOptions] = useState([]);

  useEffect(() => {
    const area_list = methods.watch('area_list') ?? []
    if (area_list.length > 0) {
      purchaseOrderDivisionService.getBusinessByStore({ area_list }).then(res => setBusinessOptions(mapDataOptions4SelectCustom(res)))
    }
  }, [methods.watch('area_list')])

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Khu vực áp dụng' isRequired={true} disabled={disabled}>
            <FormSelect
              field='area_list'
              list={areaOptions}
              validation={{ required: 'Khu vực áp dụng là bắt buộc' }}
              disabled={disabled}
              mode='multiple'
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Miền áp dụng' isRequired={true} disabled={disabled || (methods.watch('area_list') ?? []).length === 0}>
            <FormSelect
              field='business_id'
              list={businessOptions}
              validation={{ required: 'Miền áp dụng là bắt buộc' }}
              disabled={disabled}
              mode='multiple'
            />
          </FormItem>
        </div>

      </div>
      {/* {
        methods.watch('division_type') == 2 ? 
        <div className='bw_col_6'>
        <FormItem disabled={disabled} label='Ngày dự kiến về hàng'>
        <FormDatePicker
          style={{ width: '100%' }}
          type='text'
          field='expected_date_all'
          placeholder='dd/mm/yyyy'
          bordered={false}
          format={'DD/MM/YYYY'}
          validation={{
            required: 'Ngày dự kiến là bắt buộc',
          }}
        />
      </FormItem>
      </div>
        : null
      } */}
      {
        methods.watch('division_type') == 0 ?
          <div className='bw_col_12'>
            {methods.watch('area_list')?.length > 0 &&
              <StoreApplyTableNoneStock stockOption={stockOption} disabled={disabled} />
            }
          </div>
          : <div className='bw_col_12'>
            {methods.watch('area_list')?.length > 0 &&
              (methods.watch('stocks_id') || methods.watch('division_type') === 2) &&
              <StoreApplyTableStock stockOption={stockOption} disabled={disabled} />
            }
          </div>
      }
    </BWAccordion>
  );
}

export default StoreApplyForm;
