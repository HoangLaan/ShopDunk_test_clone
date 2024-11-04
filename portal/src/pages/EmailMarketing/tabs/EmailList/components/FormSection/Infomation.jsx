import React, { useEffect } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { LIST_TYPE } from 'pages/EmailMarketing/utils/constants';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

const EmailListInfo = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { companyData } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(getOptionsGlobal('company'));
  }, []);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_6'>
          <FormItem label='Tên danh sách' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='email_list_name'
              placeholder='Nhập tên danh sách khách hàng'
              validation={{
                required: 'Tên danh sách khách hàng là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        {/* <div class='bw_col_6'>
          <FormItem label='Nhà cung cấp' isRequired disabled={disabled}>
            <FormSelect
              field='email_list_supplier'
              defaultValue={1}
              placeholder='Chọn'
              list={[{ label: 'Mailchimp', value: 1 }]}
              validation={{
                required: 'Nhà cung cấp là bắt buộc',
              }}
            />
          </FormItem>
        </div> */}
        <div class='bw_col_6'>
          <FormItem label='Loại khách hàng' isRequired disabled={disabled}>
            <FormSelect
              field='email_list_type'
              defaultValue={1}
              placeholder='Chọn'
              list={LIST_TYPE}
              onChange={(value) => {
                methods.clearErrors('email_list_type');
                methods.setValue('email_list_type', value);
                methods.setValue('customer_list', []);
              }}
              validation={{
                required: 'Loại khách hàng là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea field='description' rows={2} placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default EmailListInfo;
