import React, { useEffect } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptionsGlobal } from 'actions/global';
import { useDispatch, useSelector } from 'react-redux';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { PAYMENTFORM_TYPE, PAYMENTFORM_TYPE_OPTIONS } from 'pages/PaymentForm/utils/constants';
import { useFormContext } from 'react-hook-form';
import BusinessTable from './BusinessTable';
import StoreTable from './StoreTable';

const PaymentFormInformation = ({ disabled, title }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { companyData, payPartnerData } = useSelector((state) => state.global);

  function convertNameToCode(name) {
    const words = name.split(' ');
    let initials = '';
    for (const element of words) {
      const initial = element.charAt(0).toUpperCase();
      initials += initial;
    }
    return initials;
  }

  const handleChange = (e) => {
    methods.clearErrors('payment_form_name');
    methods.setValue('payment_form_name', e.target.value);
    methods.clearErrors('payment_form_code');
    methods.setValue('payment_form_code', convertNameToCode(e.target.value));
  };

  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
  }, [companyData, dispatch]);

  useEffect(() => {
    if (!payPartnerData) dispatch(getOptionsGlobal('payPartner'));
  }, [payPartnerData, dispatch]);

  useEffect(() => {
    if (methods.watch('is_all_store')) methods.setValue('list_store', []);
  }, [methods.watch('is_all_store')]);

  useEffect(() => {
    if (methods.watch('is_all_business')) methods.setValue('list_business', []);
  }, [methods.watch('is_all_business')]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Công ty'>
              <FormSelect
                field={'company_id'}
                list={mapDataOptions4SelectCustom(companyData, 'id', 'name')}
                validation={{ required: 'Công ty chọn là bắt buộc' }}></FormSelect>
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tên hình thức thanh toán'>
              <FormInput
                field={'payment_form_name'}
                validation={{ required: 'Nhập tên hình thức thanh toán là bắt buộc' }}
                onChange={handleChange}></FormInput>
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Mã hình thức thanh toán'>
              <FormInput
                field={'payment_form_code'}
                validation={{ required: 'Nhập mã hình thức thanh toán là bắt buộc' }}></FormInput>
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Loại'>
              <FormSelect
                list={PAYMENTFORM_TYPE_OPTIONS.filter((item) => item.value !== 0)}
                field={'payment_type'}
                validation={{ required: 'Chọn loại là bắt buộc' }}></FormSelect>
            </FormItem>
          </div>
          {methods.watch('payment_type') === PAYMENTFORM_TYPE.PARTNER && (
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Đối tác'>
                <FormSelect
                  field={'partner_id'}
                  allowClear
                  list={mapDataOptions4SelectCustom(payPartnerData, 'id', 'name')}
                  validation={{
                    required:
                      methods.watch('payment_type') === PAYMENTFORM_TYPE.PARTNER ? 'Đối tác chọn là bắt buộc' : null,
                  }}></FormSelect>
              </FormItem>
            </div>
          )}
          <div className='bw_col_12'>
            <BusinessTable disabled={disabled}></BusinessTable>
          </div>
          <div className='bw_col_12'>
            <StoreTable disabled={disabled}></StoreTable>
          </div>
          <div className='bw_col_12 bw_mt_2'>
            <FormItem disabled={disabled} label='Mô tả'>
              <FormTextArea field={'description'}></FormTextArea>
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};
export default PaymentFormInformation;
