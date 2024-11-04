import React, { useEffect, useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import purchaseOrderDivisionService from 'services/purchaseOrderDivision.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

function InformationForm({ title, disabled, handleChangePurchaseOrder, stockOption = [] , setStockOption, handleChangeStocks, isDivisionFromPreorder}) {
  const purchaseOrderOptions = useGetOptions(optionType.purchaseOrder, { valueAsString: true, params: { is_active: 1 } });
  const methods = useFormContext();
  const DIVISIONTYPE = useMemo(
    () => {
      const radios = [
        // { value: 0, label: 'Chia hàng Không từ kho tổng' },
        { value: 1, label: 'Chia hàng từ kho tổng' },
      ]
      if(isDivisionFromPreorder) radios.push({ value: 2, label: 'Chia hàng PreOrder thông qua kho tổng' })
      return radios;
    },
    [isDivisionFromPreorder],
  );

  useEffect(() => {
    const business_id = methods.watch(`business_id`)
    if(isDivisionFromPreorder && business_id){
      purchaseOrderDivisionService.getStockOfBusiness({business_id}).then((res) => methods.setValue('stocks_of_business',mapDataOptions4SelectCustom(res)));
    }
  }, [methods.watch(`business_id`)])

  useEffect(() => {
    methods.reset({...methods.getValues()})
  }, [methods.watch('division_type')])

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên phiếu chia hàng' isRequired={true} disabled={disabled}>
            <FormInput
              field='purchase_order_division_name'
              placeholder='Nhập tên chia hàng'
              validation={{ required: 'Tên phiếu chia hàng là bắt buộc' }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mã phiếu chia hàng' isRequired={true} disabled={true}>
            <FormInput
              field='purchase_order_division_code'
              placeholder='Mã phiếu chia hàng'
              disabled={disabled}
            />
          </FormItem>
        </div>
        {methods.watch(`division_type`) !== 2 ?
        <div className='bw_col_6'>
        <FormItem label='Mã đơn mua hàng' disabled={disabled}>
          <FormSelect
            // mode={methods.watch('division_type') == 1 ? "multiple" : ''}
            mode={'multiple'}
            field='purchase_order_id'
            // validation={{ required: 'Mã đơn mua hàng là bắt buộc' }}
            list={purchaseOrderOptions}
            disabled={disabled}
            onChange={methods.watch('division_type') == 1 ?  (value) => {methods.setValue('purchase_order_id',value)} : handleChangePurchaseOrder}
          />
        </FormItem>
      </div>
      : null
      }
        
        {
          methods.watch('division_type') !== 0 ? 
          <div className='bw_col_6'>
            <FormItem label='Kho tổng' isRequired disabled={disabled}>
              <FormSelect
                field='stocks_id'
                validation={{ required: 'Kho tổng là bắt buộc' }}
                list={(methods.watch('stocks_of_business') || (stockOption || []).filter(item => item?.type == 9))}
                disabled={disabled}
                onChange={handleChangeStocks}
              />
            </FormItem>
          </div> 
          : null
        } 
        <div className='bw_col_6'>
          <FormItem disabled label='Ngày tạo'>
            <FormDatePicker
              style={{ width: '100%' }}
              type='text'
              field='created_date'
              placeholder='dd/mm/yyyy'
              bordered={false}
              format={'DD/MM/YYYY'}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem disabled label='Người tạo'>
            <FormInput field='created_user' />
          </FormItem>
        </div>
      </div>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <label>
              Loại chia hàng <span className='bw_red'>*</span>
            </label>
            <FormRadioGroup field='division_type' list={DIVISIONTYPE} disabled={disabled} />
            {/* <label className='bw_radio'>
                <input
                  type='radio'
                  name={'division_type'}
                  disabled={disabled}
                  onChange={(e) => {
                    methods.setValue(`division_type`, 2);
                  }}
                />
                <span />
                Chia hàng PreOrder thông qua kho tổng
              </label> */}
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export default InformationForm;
