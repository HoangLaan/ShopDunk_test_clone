import React, { useEffect } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { TYPE } from 'pages/OrderType/utils/constants';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

const OrderTypeInfo = ({ disabled, title, id }) => {
  const { watch, register, clearErrors, setValue } = useFormContext();
  const dispatch = useDispatch();
  const { businessData } = useSelector((state) => state.global);

  useEffect(() => {
    if (!businessData) dispatch(getOptionsGlobal('business'));
  }, [businessData, dispatch]);

  useEffect(() => {
    register('business_ids', {
      required: watch('is_all_business') ? false : 'Chọn miền là bắt buộc',
    });
  }, [watch('is_all_business')]);

  useEffect(() => {
    let data = TYPE.filter((x) => x.is_other === 1);
    if (data.findIndex((x) => x.value === watch('type')) > -1) {
      setValue('is_online', 0);
      setValue('is_offline', 0);
    }
  }, [watch('type')]);

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tên loại đơn hàng' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='order_type_name'
              placeholder='Nhập tên loại đơn hàng'
              validation={{
                validate: (value) => {
                  value = value?.trim();
                  if (!value || value === '') return 'Tên loại đơn hàng là bắt buộc';
                  return true;
                },
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_12 bw_mb_2'>
          <label className='bw_checkbox'>
            <FormInput disabled={disabled} type='checkbox' field='is_all_business' />
            <span />
            Áp dụng tất cả miền
          </label>
        </div>
        {!Boolean(watch('is_all_business')) && (
          <div className='bw_col_12'>
            <FormItem label='Miền áp dụng' isRequired disabled={disabled}>
              <FormSelect
                list={mapDataOptions4SelectCustom(businessData, 'id', 'name')}
                field={'business_ids'}
                mode={'multiple'}
              />
            </FormItem>
          </div>
        )}
        <div className='bw_col_12 bw_mb_1'>
          <div className='bw_row' style={{ alignItems: 'center' }}>
            <div className='bw_col_2'>
              <label className='bw_radio'>
                <FormInput
                  type='radio'
                  field={'is_offline'}
                  disabled={disabled}
                  onChange={(e) => {
                    clearErrors('is_offline');
                    setValue('type', 1);
                    setValue('is_offline', e.target.checked ? 1 : 0);
                    if (e.target.checked) {
                      setValue('is_online', 0);
                    }
                  }}
                />
                <span />
                Đơn hàng offline
              </label>
            </div>
            <div className='bw_col_3'>
              {Boolean(watch('is_offline')) && (
                <FormSelect
                  bordered
                  list={mapDataOptions4Select(TYPE.filter((x) => x.is_offline === 1))}
                  field='type'
                />
              )}
            </div>
            <div className='bw_col_2' style={{ marginLeft: '66px' }}>
              <label className='bw_radio'>
                <FormInput
                  type='radio'
                  field={'is_online'}
                  disabled={disabled}
                  onChange={(e) => {
                    clearErrors('is_online');
                    setValue('is_online', e.target.checked ? 1 : 0);
                    setValue('type', 3);
                    if (e.target.checked) {
                      setValue('is_offline', 0);
                    }
                  }}
                />
                <span />
                Đơn hàng online
              </label>
            </div>
            <div className='bw_col_3'>
              {Boolean(watch('is_online')) && (
                <FormSelect bordered list={mapDataOptions4Select(TYPE.filter((x) => x.is_online === 1))} field='type' />
              )}
            </div>
          </div>
        </div>
        {/* <div className='bw_col_12 '>
          <div className='bw_row' style={{ alignItems: 'center' }}>
            <div className='bw_col_2'>
              <label className='bw_radio'>
                <FormInput
                  type='radio'
                  field={'is_online'}
                  disabled={disabled}
                  onChange={(e) => {
                    clearErrors('is_online');
                    setValue('is_online', e.target.checked ? 1 : 0);
                    setValue('type', 3);
                    if (e.target.checked) {
                      setValue('is_offline', 0);
                    }
                  }}
                />
                <span />
                Đơn hàng online
              </label>
            </div>
            <div className='bw_col_3'>
              {Boolean(watch('is_online')) && (
                <FormSelect bordered list={mapDataOptions4Select(TYPE.filter((x) => x.is_online === 1))} field='type' />
              )}
            </div>
          </div>
        </div> */}
        <div className='bw_col_12'>
          <FormRadioGroup list={TYPE.filter((x) => x.is_other === 1)} disabled={disabled} field='type' custom />
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea field='description' rows={2} placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default OrderTypeInfo;
