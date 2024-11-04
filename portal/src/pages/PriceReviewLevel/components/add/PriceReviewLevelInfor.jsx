import React from 'react';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';

const PriceReviewLevelInfor = ({ disabled }) => {
  return (
    <React.Fragment>
      <BWAccordion title='Thông tin mức duyệt' id='information'>
        <div className='bw_row'>
          <FormItem label='Tên mức duyệt' className='bw_col_6' disabled={disabled} isRequired={true}>
            <FormInput
              type='text'
              field='price_review_level_name'
              placeholder='Tên mức duyệt'
              validation={{
                required: 'Tên mức duyệt là bắt buộc.',
              }}
            />
          </FormItem>
          <FormItem label='Số thứ tự' className='bw_col_6' disabled={disabled}>
            <FormInput type='number' field='order_index' placeholder='Số thứ tự' />
          </FormItem>

          <FormItem label='Mô tả' className='bw_col_12' disabled={disabled}>
            <FormInput type='text' field='description' placeholder='Mô tả' />
          </FormItem>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default PriceReviewLevelInfor;
