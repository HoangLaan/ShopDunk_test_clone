import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptions } from 'pages/RequestPurchaseOrder/helpers/utils';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { RP_STATUS_OPTIONS } from 'pages/RequestPurchaseOrder/helpers/constants';
import usePageInformation from 'hooks/usePageInformation';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton';

function RequestPurchaseOrderInformation({ title }) {
  const { watch, setValue } = useFormContext();
  const watchCompanyId = watch('company_id');
  const { disabled } = usePageInformation();

  const supplierOptions = useGetOptions(optionType.supplier);

  const [optionsCompany, setOptionsCompany] = useState([]);
  const [optionsBusiness, setOptionsBusiness] = useState([]);
  const [optionsStore, setOptionsStore] = useState([]);

  useEffect(() => {
    const getDataOptions = async () => {
      const _company = await getOptions('company');
      const _companyOptions = mapDataOptions4SelectCustom(_company);
      setOptionsCompany(_companyOptions);
    };
    getDataOptions();
  }, []);

  useEffect(() => {
    if (watchCompanyId) {
      const fetchOptionsBusiness = async () => {
        const _business = await getOptions('business', { company_id: watchCompanyId });
        setOptionsBusiness(mapDataOptions4SelectCustom(_business));
      };

      fetchOptionsBusiness();
    }
  }, [watchCompanyId]);

  useEffect(() => {
    if (optionsCompany?.length > 1 && !watchCompanyId) {
      setValue('company_id', optionsCompany[0].value);
    }
  }, [optionsCompany, watchCompanyId]);

  useEffect(() => {
    if(watch('business_receive_id'))
    getOptions('store', {business_id: watch('business_receive_id')}).then(res => setOptionsStore(mapDataOptions4SelectCustom(res)));
  }, [watch('business_receive_id')])

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Mã đơn đặt hàng' isRequired={true}>
            <FormInput
              type='text'
              field='request_purchase_code'
              placeholder='Mã đơn đặt hàng'
              validation={{
                required: 'Mã đơn đặt hàng là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Công ty' isRequired={true} disabled={disabled}>
            <FormSelect
              field='company_id'
              list={optionsCompany}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Chi nhánh nhận hàng' isRequired={true} disabled={disabled}>
            <FormSelect
              field='business_receive_id'
              list={optionsBusiness}
              validation={{
                required: 'Chi nhánh nhận hàng là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Ngày lập đơn' isRequired={true} disabled={true}>
            <FormInput
              type='text'
              field='request_purchase_date'
              placeholder='Ngày lập đơn'
              validation={{
                required: 'Ngày lập đơn là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Chi nhánh đặt hàng' isRequired={true} disabled={disabled}>
            <FormSelect
              field='business_request_id'
              list={optionsBusiness}
              validation={{
                required: 'Chi nhánh đặt hàng là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Cửa hàng nhận hàng' disabled={disabled || !watch('business_receive_id')}>
            <FormSelect field='store_receive_id' list={optionsStore} disabled={disabled} allowClear />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Người yêu cầu' isRequired={true} disabled={true}>
            <FormInput
              type='text'
              field='created_user'
              placeholder='Người yêu cầu'
              validation={{
                required: 'Người yêu cầu là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem  label='Nhà cung cấp' isRequired={true} disabled={disabled}>
        <div className='bw_row'>
        <div className='bw_col_9'>
        <FormSelect
              field='supplier_id'
              list={supplierOptions}
              validation={{
                required: 'Nhà cung cấp là bắt buộc',
              }}
              disabled={disabled}
            />
        </div>
          <div className='bw_col_3'>
                    <CheckAccess permission={'SUPPLIER_ADD'}>
                      <BWButton
                        style={{padding: '7px 10px'}}
                        icon={'fi fi-rr-plus'}
                        color={'blue'}
                        onClick={() => window.open('/supplier/add')}
                      />
                    </CheckAccess>
          </div>
        </div>
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} label='Trạng thái'>
            <FormSelect field={'status'} list={RP_STATUS_OPTIONS} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default RequestPurchaseOrderInformation;
