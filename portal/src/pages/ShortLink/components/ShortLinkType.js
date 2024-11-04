import BWAccordion from "components/shared/BWAccordion";
import FormInput from "components/shared/BWFormControl/FormInput";
import FormItem from "components/shared/BWFormControl/FormItem";
import React from "react";

const ShortLinkType = ({
  disabled
}) => {
  return (
    <BWAccordion title='Thông tin Shortlink' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tên chiến dịch' isRequired>
            <FormInput
              type='text'
              field='short_link_name'
              placeholder='Nhập tên chiến dịch'
              validation={{
                required: 'Tên chiến dịch',
              }}
              disabled={disabled}
            />
          </FormItem>
          <FormItem label='Loại ShortLink'>
            <label className='bw_checkbox mt-1'>
              <FormInput disabled={disabled} type='checkbox' field='short_link_type' />
              <span />
              PreOrder
            </label>
          </FormItem>
          <FormItem label='Link redirect' isRequired>
            <FormInput
              type='text'
              field='short_link_redirect'
              placeholder='Link redirect'
              validation={{
                required: 'Link redirect',
                pattern: {
                  value: "/^(https?:\/\/[^\s]+)+$/"
                }
              }} ma
              disabled={disabled}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  )
}

export default ShortLinkType