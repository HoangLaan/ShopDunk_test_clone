import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormEditor from 'components/shared/BWFormControl/FormEditor';
import styled from 'styled-components';

const FormEdittorStyled = styled(FormItem)`
  .bw_frm_box label {
    margin-bottom: 2px;
  }
  .tox-tinymce {
    border: none;
  }
`;

const InstallmentFormInfo = ({ disabled, title, id }) => {
  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <FormItem label='Tên hình thức trả góp' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='installment_form_name'
              placeholder='Nhập tên hình thức trả góp'
              disabled={disabled}
              validation={{
                required: 'Tên hình thức trả góp là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormEdittorStyled label='Mô tả' disabled={disabled}>
            <FormEditor field='description' disabled={disabled} />
          </FormEdittorStyled>
        </div>
      </div>
    </BWAccordion>
  );
};

export default InstallmentFormInfo;
