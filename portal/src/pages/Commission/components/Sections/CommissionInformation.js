import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusOutlined } from '@ant-design/icons';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion/index';

import { getOptionsCompany } from 'services/company.service';
import { getOptionsBusiness } from 'services/business.service';
import { mapDataOptions4Select } from 'utils/helpers';

import ModalStore from '../Modals/ModalStore';
import { useCommissionContext } from 'pages/Commission/helpers/context';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

function CommissionInformation({ disabled, title }) {
  const { watch, control, setValue, clearErrors } = useFormContext();

  const watchCompanyId = watch('company_id');

  const { isOpenModalStore, setIsOpenModalStore } = useCommissionContext();
  const [optionsCompany, setOptionsCompany] = useState(null);
  const [optionsBusiness, setOptionsBusiness] = useState(null);

  const { fields: storeFields, replace: replaceStore } = useFieldArray({
    control,
    name: 'stores',
  });

  const listStore = storeFields.map((item) => ({
    ...item,
    label: item.store_name,
    value: item.store_id,
  }));

  const onConfirmModalStore = (attributesSelected) => {
    replaceStore(Object.values(attributesSelected));
    setIsOpenModalStore(false);
  };

  useEffect(() => {
    const getDataOptions = async () => {
      let _company = await getOptionsCompany();
      const _companyOptions = mapDataOptions4Select(_company);
      if (_companyOptions?.length === 1) {
        setValue('company_id', _companyOptions[0].value);
      }
      setOptionsCompany(_companyOptions);
    };
    getDataOptions();
  }, [setValue]);

  useEffect(() => {
    if (watchCompanyId) {
      getOptionsBusiness({
        company_id: watchCompanyId,
      }).then((_business) => {
        const _businessOptions = mapDataOptions4Select(_business).map((item) => ({
          ...item,
          value: Number(item.value),
          id: Number(item.id),
        }));
        setOptionsBusiness(_businessOptions);
      });
    }
  }, [watchCompanyId]);

  const onDeselectBusiness = () => {
    replaceStore([]);
  };

  const onDeselectStore = (value) => {
    const newStoreFields = storeFields.filter((item) => item.store_id !== value);
    replaceStore(newStoreFields);
  };

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Tên chương trình hoa hồng' isRequired={true}>
            <FormInput
              type='text'
              field='commission_name'
              placeholder='Tên chương trình hoa hồng'
              validation={{
                required: 'Tên chương trình hoa hồng là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Ngày áp dụng'>
            <FormRangePicker
              fieldStart={'start_date'}
              fieldEnd={'end_date'}
              validation={{
                required: 'Bắt buộc chọn ngày áp dụng',
              }}
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'DD/MM/YYYY'}
              allowClear
              disabled={disabled}
            />
          </FormItem>
        </div>
        {/* <div className='bw_col_4'>
          <FormItem label='Ngày bắt đầu' isRequired={true}>
            <FormDatePicker
              field='start_date'
              validation={{ required: 'Ngày bắt đầu là bắt buộc' }}
              placeholder={'dd/mm/yyyy'}
              style={{
                width: '100%',
              }}
              format='DD/MM/YYYY'
              bordered={false}
              allowClear
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Ngày kết thúc' isRequired={true}>
            <FormDatePicker
              field='end_date'
              validation={{ required: 'Ngày kết thúc là bắt buộc' }}
              placeholder={'dd/mm/yyyy'}
              style={{
                width: '100%',
              }}
              format='DD/MM/YYYY'
              bordered={false}
              allowClear
              disabled={disabled}
            />
          </FormItem>
        </div> */}
        <div className='bw_col_4'>
          <FormItem label='Công ty áp dụng' disabled={disabled} isRequired={true}>
            <FormSelect
              field='company_id'
              list={optionsCompany}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
              onChange={(value) => {
                clearErrors('company_id');
                setValue('company_id', value);
                setValue('business_apply', []);
                setValue('store_apply', []);
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Miền áp dụng' disabled={disabled} isRequired={true}>
            <FormSelect
              field='business_apply'
              mode='multiple'
              onDeselect={onDeselectBusiness}
              list={optionsBusiness}
              validation={{
                required: 'Miền là bắt buộc',
              }}
              onChange={(value) => {
                clearErrors('business_apply');
                if (Array.isArray(value)) {
                  setValue(
                    'business_apply',
                    value.map((x) => ({
                      id: x,
                      value: x,
                    })),
                  );
                }
                setValue('store_apply', []);
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem
            label='Cửa hàng áp dụng'
            disabled={disabled || !(watch('business_apply')?.length > 0 && watch('company_id'))}>
            <FormSelect
              field='store_apply'
              suffixIcon={<PlusOutlined />}
              dropdownStyle={{ display: 'none' }}
              mode='multiple'
              list={listStore}
              placeholder='--Chọn cửa hàng--'
              value={listStore.map((item) => item.value)}
              onDeselect={onDeselectStore}
              onClick={() => {
                if (!disabled) {
                  setIsOpenModalStore((prev) => !prev);
                }
              }}
            />
          </FormItem>
        </div>
      </div>
      {isOpenModalStore && <ModalStore onConfirm={onConfirmModalStore} />}
    </BWAccordion>
  );
}

export default CommissionInformation;
