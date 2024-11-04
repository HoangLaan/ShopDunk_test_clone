import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getCompanyOptions } from 'services/announce-type.service';

const AnnounceTypeInformation = ({ disabled }) => {
  const methods = useFormContext();
  const { setValue } = useFormContext();
  const [companyList, setCompanyList] = useState([]);

  const loadCompanyList = useCallback(() => {
    getCompanyOptions().then(setCompanyList);
  }, []);
  useEffect(loadCompanyList, [loadCompanyList]);

  useEffect(() => {
    if (companyList?.length === 1) setValue('company_id', companyList[0]?.id);
  }, [companyList, setValue]);

  return (
    <BWAccordion title='Thông tin loại thông báo nhân viên'>
      <div className='bw_row'>
        <FormItem className='bw_col_4' disabled={disabled} isRequired label='Tên loại thông báo'>
          <FormInput
            type='text'
            field='announce_type_name'
            placeholder='Nhập tên loại thông báo'
            validation={{
              validate: (value) => {
                if (!Boolean(value?.trim())) {
                  return 'Tên loại thông báo là bắt buộc';
                }
                return true;
              },
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' disabled={disabled} isRequired label='Công ty áp dụng'>
          <FormSelect
            field='company_id'
            list={companyList?.map((p) => {
              return {
                label: p?.company_name,
                value: p?.company_id,
              };
            })}
            validation={{
              required: 'Công ty áp dụng là bắt buộc.',
            }}
          />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_12' disabled={disabled} isRequired label='Thể loại'>
          <FormRadioGroup
            field='is_company'
            list={[
              { key: 1, value: 1, label: 'Thông báo nội bộ' },
              { key: 0, value: 0, label: 'Thông báo khách hàng' },
            ]}
            validation={{
              required: 'Thể loại là bắt buộc',
            }}
          />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_12' label='Mô tả' disabled={disabled}>
          <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default AnnounceTypeInformation;
