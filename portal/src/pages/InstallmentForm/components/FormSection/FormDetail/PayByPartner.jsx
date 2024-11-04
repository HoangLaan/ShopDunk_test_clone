import React, { useEffect, useState } from 'react';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import styled from 'styled-components';
import { RulePercent } from 'pages/InstallmentForm/utils/validate';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';

const FormNumberCustom = styled(FormNumber)`
  .ant-input-number-input {
    padding-left: 11px !important;
    padding-right: 11px !important;
  }
`;

const PayByPartner = ({ disabled }) => {
  const methods = useFormContext();

  return (
    <div style={{ width: '100%', padding: '0 5px' }}>
      <div className='bw_row'>
        <div class='bw_col_6'>
          <FormItem label='Gói trả góp' isRequired disabled={disabled}>
            <FormSelect
              field='installment_partner_period_id'
              placeholder='Chọn'
              list={methods.watch('installment_partner_period_options') || []}
              onChange={(value) => {
                methods.clearErrors('installment_partner_period_id');
                methods.setValue('installment_partner_period_id', value);
                const optionList = methods.watch('installment_partner_period_options') || [];
                const selected = optionList.find((_) => _.value === value);
                if (selected) {
                  methods.setValue('min_prepay', selected.min_prepay);
                  methods.setValue('interest_rate', selected.interest_rate);
                  methods.setValue('payer', selected.payer);
                }
              }}
              validation={{
                required: 'Kỳ hạn là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Mức khách trả trước tối thiểu'>
            <FormNumberCustom bordered field={'min_prepay'} validation={RulePercent} disabled addonAfter='%' />
          </FormItem>
        </div>

        <div class='bw_col_6'>
          <FormItem label='Người trả lãi suất'>
            <FormSelect
              field='payer'
              disabled
              placeholder='Chọn'
              list={[
                {
                  label: 'Người mua',
                  value: 1,
                },
                {
                  label: 'Công ty',
                  value: 2,
                },
              ]}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Lãi suất phải trả'>
            <FormNumberCustom
              bordered
              disabled
              field={'interest_rate'}
              validation={RulePercent}
              addonAfter='% giá trị đơn hàng'
            />
          </FormItem>
        </div>
      </div>
    </div>
  );
};

export default PayByPartner;
