import React, { useCallback, useEffect, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptionsCompany } from 'services/company.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { getBusinessOptions } from 'services/business.service';
import { getOptionsStocksType } from 'services/stocks-type.service';

const StoreTypeInformation = ({ disabled, title }) => {
  const [companyOptions, setCompanyOptions] = useState([]);
  const [businessOptions, setBusinessOptions] = useState([]);
  const [stocksTypeOptions, setStocksTypeOptions] = useState([]);

  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4Select(res));
    });

    getBusinessOptions().then((res) => {
      setBusinessOptions(mapDataOptions4Select(res));
    });

    getOptionsStocksType().then((res) => {
      setStocksTypeOptions(mapDataOptions4Select(res));
    });
  }, []);

  useEffect(getOptions, [getOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Tên loại cửa hàng' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='store_type_name'
              placeholder='Nhập tên loại cửa hàng'
              validation={{
                required: 'Tên loại cửa hàng là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Thuộc công ty' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              list={companyOptions}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Thuộc miền' isRequired disabled={disabled}>
            <FormSelect
              field='business_id'
              list={businessOptions}
              validation={{
                required: 'Miền là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Áp dụng các loại kho' disabled={disabled}>
            <FormSelect field='stocks_type_ids' list={stocksTypeOptions} mode={'multiple'} />
          </FormItem>
        </div>

        <FormItem className='bw_col_12' label='Mô tả'>
          <FormTextArea field='description' rows={3} placeholder='Mô tả' disabled={disabled} />
        </FormItem>
      </div>
    </BWAccordion>
  );
};
export default StoreTypeInformation;
