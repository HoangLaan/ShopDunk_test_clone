import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { PayTypeOptions } from 'pages/InstallmentPartner/utils/constant';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import styled from 'styled-components';

const FormNumberCustom = styled(FormNumber)`
  .ant-input-number-input {
    padding-left: 11px !important;
    padding-right: 11px !important;
  }
`;

const CheckingInfo = ({ disabled, title, id }) => {
  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <FormItem disabled={disabled} label='Kiểu đối soát'>
            <FormSelect type='text' field='checking_type' list={PayTypeOptions} disabled={disabled} />
          </FormItem>
        </div>
        <div class='bw_col_12'>
          <FormItem disabled={disabled} label='Ngày đối soát'>
            <div className='bw_row'>
              <div className='bw_col_6'>
                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <span>T (Ngày phát sinh giao dịch)</span>
                  <span style={{ marginLeft: '10px' }}>+</span>
                </div>
              </div>
              <div className='bw_col_6'>
                <FormNumberCustom
                  bordered
                  field='checking_day'
                  validation={{
                    min: {
                      value: 0,
                      message: 'Giá trị phải lớn hơn 0',
                    },
                  }}
                  addonAfter='Ngày'
                />
              </div>
            </div>
          </FormItem>
        </div>
        <div class='bw_col_12 bw_mt_1'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field='checking_on_weekend' disabled={disabled} />
            <span />
            Trừ thứ 7, chủ nhật và các ngày lễ trong năm
          </label>
        </div>
      </div>
    </BWAccordion>
  );
};

export default CheckingInfo;
