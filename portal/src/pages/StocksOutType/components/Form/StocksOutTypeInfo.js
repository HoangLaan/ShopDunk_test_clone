import React from 'react';
import BWAccordion from '../../../../components/shared/BWAccordion/index';
import FormInput from '../../../../components/shared/BWFormControl/FormInput';
import FormItem from '../../../../components/shared/BWFormControl/FormItem';
import FormTextArea from '../../../../components/shared/BWFormControl/FormTextArea';

const StocksOutTypeInfo = ({ disabled, title, id }) => {
  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Tên hình thức phiếu ' isRequired>
            <FormInput
              type='text'
              field='stocks_out_type_name'
              placeholder='Nhập tên hình thức phiếu'
              validation={{
                required: 'Tên hình thức phiếu là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
      </div>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea
              field='description'
              rows={2}
              disabled={disabled}
              placeholder='Nhập mô tả hình thức xuất kho'
            />
          </FormItem>
          <div className='bw_mt_1'>
            <label className='bw_checkbox'>
              <FormInput type='checkbox' field='is_auto_review' disabled={disabled} />
              <span />
              Tự động duyệt
            </label>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default StocksOutTypeInfo;
