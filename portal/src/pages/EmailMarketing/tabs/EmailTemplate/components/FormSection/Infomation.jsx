import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { MAIL_SUPPLIER_OPTS } from 'pages/EmailMarketing/utils/constants';
import FormEditor from 'components/shared/BWFormControl/FormEditor';

const EmailTemplateInfo = ({ disabled, title, id }) => {
  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_6'>
          <FormItem label='Tên mẫu mail' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='email_template_name'
              placeholder='Nhập tên mẫu mail'
              validation={{
                required: 'Tên mẫu mail là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div class='bw_col_6'>
          <FormItem label='Nhà cung cấp' isRequired disabled={disabled}>
            <FormSelect
              field='mail_supplier'
              placeholder='Chọn'
              list={MAIL_SUPPLIER_OPTS}
              validation={{
                required: 'Nhà cung cấp là bắt buộc',
              }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default EmailTemplateInfo;
