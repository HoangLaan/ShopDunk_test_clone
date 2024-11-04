import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select } from 'utils/helpers';
import { DebitTypeOptions } from 'pages/DiscountProgram/ultils/constant';
import styled from 'styled-components';
import { allBusiness } from 'pages/Promotions/utils/constants';
import { mapArrayGetKey } from 'pages/Promotions/utils/helpers';

const FormItemWrapper = styled.div`
  .bw_frm_box {
    min-height: 79px;
  }
`;

const DiscountProgramInformation = ({ disabled }) => {
  const methods = useFormContext();
  const { watch, clearErrors, setValue } = methods;
  const { manufacturerData, businessData, areaData } = useSelector((state) => state.global);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOptionsGlobal('manufacturer'));
  }, [dispatch]);

  const loadCompanyList = useCallback(() => {
    dispatch(getOptionsGlobal('business'));
  }, [dispatch]);
  useEffect(loadCompanyList, [loadCompanyList]);

  const loadAreaList = useCallback(() => {
    dispatch(getOptionsGlobal('area'));
  }, [dispatch]);
  useEffect(loadAreaList, [loadAreaList]);

  const handleChangeCompanyBusiness = (value, check) => {
    if (check) {
      setValue('business_id', value);
    } else {
      // setValue('company_id', value);
      setValue('business_id', []);
    }
  };

  return (
    <BWAccordion title='Thông tin chương trình chiết khấu'>
      <FormItemWrapper className='bw_row'>
        <FormItem className='bw_col_6' disabled={disabled} isRequired label='Tên chương trình chiết khấu'>
          <FormInput
            disabled={disabled}
            field='discount_program_name'
            placeholder='Nhập tên chương trình chiết khấu'
            validation={{
              required: 'Tên chương trình chiết khấu là bắt buộc',
            }}
            className='bw_mt_1'
          />
        </FormItem>

        <FormItem className='bw_col_6' disabled={disabled} label='Lưu công nợ'>
          {DebitTypeOptions.map((debit, idx) => (
            <label className='bw_checkbox bw_mt_1'>
              <input
                type='checkbox'
                name='debit_type'
                id={'debit_type_' + idx}
                disabled={disabled}
                checked={watch('debit_type') === debit.value}
                onChange={(e) => {
                  clearErrors('debit_type');
                  setValue('debit_type', e.target.checked ? debit.value : null);
                }}
              />
              <span />
              {debit.label}
            </label>
          ))}
        </FormItem>

        <FormItem className='bw_col_6' disabled={disabled} isRequired label='Hãng áp dụng'>
          <FormSelect
            list={mapDataOptions4Select(manufacturerData)}
            disabled={disabled}
            field='manufacture_id'
            validation={{
              required: 'Hãng là bắt buộc',
            }}
          />
        </FormItem>

        {/* <FormItem className='bw_col_6' label='Thời gian áp dụng' isRequired disabled={disabled}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div>
              <FormTimeRangePicker
                allowClear
                fieldStart='from_hour'
                fieldEnd='to_hour'
                format='HH:mm'
                bordered
                validation={{
                  required: 'Giờ áp dụng là bắt buộc',
                }}
              />
            </div>
            <div>
              <FormRangePicker
                allowClear
                fieldStart='from_date'
                fieldEnd='to_date'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={['DD/MM/YYYY', 'DD/MM/YYYY']}
                validation={{
                  required: 'Thời gian áp dụng là bắt buộc',
                }}
                bordered
              />
            </div>
          </div>
        </FormItem> */}

        <FormItem className='bw_col_6' label='Thời gian áp dụng' isRequired disabled={disabled}>
          <FormRangePicker
            allowClear
            fieldStart='from_date'
            fieldEnd='to_date'
            placeholder={['Từ ngày', 'Đến ngày']}
            format={['DD/MM/YYYY', 'DD/MM/YYYY']}
            validation={{
              required: 'Thời gian áp dụng là bắt buộc',
            }}
          />
        </FormItem>

        <FormItem className='bw_col_6' label='Miền áp dụng' disabled={disabled}>
          <FormSelect
            mode='multiple'
            list={Array.isArray(businessData) && businessData.length > 0
              ? [allBusiness, ...mapDataOptions4Select(businessData)]
              : mapDataOptions4Select(businessData)}
            disabled={disabled}
            field='business_id'
            onChange={(e, o) => {
              let valueSet = e;
              if (e) {
                if (e[e.length - 1] == allBusiness?.value) {
                  const clonebusinessData = structuredClone(mapDataOptions4Select(businessData));
                  valueSet = mapArrayGetKey(clonebusinessData, 'value', allBusiness?.value, []);
                }
              }
              handleChangeCompanyBusiness(valueSet || null, true);
            }}
          // validation={{
          //   required: 'Miền áp dụng là bắt buộc',
          // }}
          />
        </FormItem>

        <FormItem className='bw_col_6' label='Khu vực áp dụng' disabled={disabled}>
          <FormSelect
            mode='multiple'
            list={mapDataOptions4Select(areaData)}
            disabled={disabled}
            field='area_list'
          // validation={{
          //   required: 'Khu vực áp dụng là bắt buộc',
          // }}
          />
        </FormItem>

        <FormItem className='bw_col_12' label='Mô tả' disabled={disabled}>
          <FormTextArea disabled={disabled} field='description' />
        </FormItem>
      </FormItemWrapper>
    </BWAccordion>
  );
};

export default DiscountProgramInformation;
