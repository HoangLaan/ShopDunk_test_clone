import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const ClusterInformation = ({ disabled, title, businessOption }) => {
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tên cụm'>
              <FormInput
                type='text'
                field='cluster_name'
                placeholder='Nhập tên cụm'
                validation={{
                  required: 'Tên cụm cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Mã cụm'>
              <FormInput type='text' field='cluster_code' placeholder='Nhập mã cụm' />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Mô tả'>
              <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Trực thuộc miền' isRequired>
              <FormSelect
                showSearch
                allowClear
                field='business_id'
                list={businessOption}
                validation={{
                  required: 'Miền cần chọn là bắt buộc',
                }}
              />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default ClusterInformation;
