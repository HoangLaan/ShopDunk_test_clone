import React, { useCallback, useEffect, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptionsCompany } from 'services/company.service';
import { mapDataOptions4Select } from 'utils/helpers';

const BlockInformation = ({ disabled, title }) => {
  const [companyOptions, setCompanyOptions] = useState([]);

  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4Select(res));
    });
  }, []);

  useEffect(getOptions, [getOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_4' label='Mã khối' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='block_code'
              placeholder='Nhập mã khối'
              validation={{
                required: 'Mã khối là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_4' label='Tên khối' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='block_name'
              placeholder='Nhập tên khối'
              validation={{
                required: 'Tên khối là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_4' label='Thuộc công ty' isRequired disabled={disabled}>
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
          <FormItem className='bw_col_12' label='Mô tả'>
            <FormTextArea field='description' rows={3} placeholder='Mô tả' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};
export default BlockInformation;
