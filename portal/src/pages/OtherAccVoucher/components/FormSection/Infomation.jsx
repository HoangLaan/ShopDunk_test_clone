import React, { useEffect, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useFormContext } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { genCode, getStoreOptions } from 'services/other-acc-voucher.service';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { formatPrice } from 'utils';
import { getReceiveTypeOpts, getPaymentTypeOpts } from 'services/receive-slip.service';
import { VOUCHER_TYPE } from 'pages/OtherAccVoucher/utils/constant';
import { mapDataOptions4Select } from 'utils/helpers';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const InstallmentPartnerInfo = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const [typeOptions, setTypeOptions] = useState([]);
  const businessOpts = useGetOptions(optionType.business);
  const [storeOptions, setStoreOptions] = useState([]);

  useState(() => {
    getStoreOptions().then(setStoreOptions);
  }, []);

  // update business by store changes
  const storeId = watch('store_id');

  useEffect(() => {
    if (storeId) {
      const selectedStore = storeOptions?.find((store) => store.value === storeId);
      if (selectedStore) {
        methods.setValue('business_id', selectedStore.business_id);
      }
    }
  }, [storeId]);

  // load code
  useEffect(() => {
    genCode().then((data) => {
      if (!methods.getValues('other_acc_voucher_code') && data?.code) {
        methods.setValue('other_acc_voucher_code', data?.code);
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      const data = await Promise.all([getReceiveTypeOpts(), getPaymentTypeOpts()]);
      const options = data[0]
        ?.map((_) => ({ ..._, id: `${_.id}_${VOUCHER_TYPE.RECEIVE}` }))
        .concat(data[1]?.map((_) => ({ ..._, id: `${_.id}_${VOUCHER_TYPE.EXPEND}` })));
      setTypeOptions(mapDataOptions4Select(options));
    })();
  }, []);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div className='bw_col_8'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormItem label='Ngày hạch toán' disabled={disabled}>
                <FormDatePicker
                  field='created_date'
                  style={{ width: '100%' }}
                  placeholder={'Ngày hạch toán'}
                  format='DD/MM/YYYY'
                  bordered={false}
                  allowClear
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Loại chứng từ' disabled={disabled}>
                <FormSelect field='voucher_type' list={typeOptions} />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Hạn thanh toán' disabled={disabled}>
                <FormDatePicker
                  field='payment_expired_date'
                  style={{ width: '100%' }}
                  placeholder={'Hạn thanh toán'}
                  format='DD/MM/YYYY'
                  bordered={false}
                  allowClear
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Ngày chứng từ' disabled={disabled}>
                <FormDatePicker
                  field='invoice_date'
                  style={{ width: '100%' }}
                  placeholder={'Hạn thanh toán'}
                  format='DD/MM/YYYY'
                  bordered={false}
                  allowClear
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Cửa hàng' disabled={disabled}>
                <FormSelect field='store_id' list={storeOptions} />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Chi nhánh' disabled>
                <FormSelect field='business_id' list={businessOpts} />
              </FormItem>
            </div>
          </div>
        </div>
        <div
          className='bw_col_4'
          style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ marginBottom: '4px' }}>Tổng phát sinh</p>
          <div
            style={{
              border: '1px solid #ccc',
              background: 'white',
              fontSize: '1.3rem',
              width: '160px',
              height: '160px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}>
            {formatPrice(watch('total_money') || 0, false, ',')}
          </div>
        </div>

        <div className='bw_col_8'>
          <FormItem label='Diễn giải' disabled={disabled}>
            <FormTextArea field='description' placeholder='Nội dung diễn giải' rows={2} />
          </FormItem>
        </div>

        <div className='bw_col_4'>
          <FormItem label='Số chứng từ' disabled>
            <FormInput type='text' field='other_acc_voucher_code' placeholder='Số chứng từ' />
          </FormItem>
          {/* <label className='bw_checkbox bw_mt_1'>
            <FormInput type='checkbox' field='is_merge_invoice' disabled={disabled} />
            <span />
            Hạch toán gộp nhiều hóa đơn
          </label> */}
        </div>
      </div>
    </BWAccordion>
  );
};

export default InstallmentPartnerInfo;
