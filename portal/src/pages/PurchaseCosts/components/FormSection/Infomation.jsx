import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { mapDataOptions4SelectCustom, mapDataOptions4SelectCustomByType } from 'utils/helpers';
// import { RECEIVE_PAYMENT_TYPE } from '../../utils/constants';

import {
  PAYMENT_TYPE_OPTIONS,
  STATUS_PAYMENT,
  statusPaymentFormOption,
  statusPurchaseOrdersFormOption,
} from 'pages/PurchaseOrder/utils/constants';

import CheckAccess from 'navigation/CheckAccess';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDate from 'components/shared/BWFormControl/FormDate';
import BWButton from 'components/shared/BWButton/index';
// import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

import { getExpendTypeOptions } from 'services/expend-type.service';
import { getOptionsSupplier } from 'services/supplier.service';
// import { getListOrderStatus } from 'services/order-status.service';
//services
import { getOptionsGlobal } from 'actions/global';
import { useAuth } from 'context/AuthProvider';

const InformationDetail = ({ disabled, title, realPaymentStatus }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { watch, setValue, clearErrors } = methods;

  const { paymentFormData, userData } = useSelector((state) => state.global);

  const [optionsCostType, setOptionsCostType] = useState([]);
  const [optionsSupplier, setOptionsSupplier] = useState([]);

  useEffect(() => {
    if (optionsCostType.length > 0) {
      setValue('cost_type_id', optionsCostType.find((item) => item.label?.includes('Chi phí mua hàng'))?.id);
    }
  }, [optionsCostType]);

  const { user } = useAuth();
  useEffect(() => {
    if (userData?.length > 0) {
      if (watch('employee_purchase')) return;
      setValue('employee_purchase', userData.find((item) => item.id === user.user_name)?.id);
    }
  }, [userData]);

  const getOptsCostType = useCallback(() => {
    getExpendTypeOptions().then((data) => {
      if (data) {
        let dataParse = mapDataOptions4SelectCustom(data, 'value', 'title');
        setOptionsCostType(dataParse);
      }
    });

    getOptionsSupplier().then((data) => {
      setOptionsSupplier(mapDataOptions4SelectCustom(data));
    });

    dispatch(getOptionsGlobal('paymentForm'));

    dispatch(getOptionsGlobal('user', { company_id: watch('company_id') }));
  }, []);

  useEffect(getOptsCostType, [getOptsCostType]);

  // Lấy danh sách trạng thái đơn hàng
  // const fetchOrderStatus = async (value) => {
  //   return getListOrderStatus({
  //     search: value,
  //     is_active: 1,
  //     order_type_id: watch('order_type_id'),
  //   }).then((body) => {
  //     const _orderStatusOpts = mapDataOptions4SelectCustomByType(body.items, 'order_status_id', 'order_status_name', 'number');

  //     if (watch('order_type_id')) {
  //       const idxStatusNew = _orderStatusOpts.find((_st) => _st?.is_new_order);
  //       setValue('order_status_id', idxStatusNew?.value);
  //       clearErrors('order_status_id');
  //     }
  //     //set danh sách trạng thái đơn hàng
  //     setOrderStatusOpts(_orderStatusOpts);
  //   });
  // };

  const checkAndSetValue = (value, field, setValueIn = () => {}, valueDefault = '') => {
    let result = valueDefault;
    if (value) {
      result = value;
    }
    if (setValueIn) {
      setValueIn(field, result);
    } else {
      return;
    }
  };

  const checkSymBolToUpperCase = (value) => {
    let cloneValue = structuredClone(value) ?? '';
    if (cloneValue) {
      cloneValue = cloneValue.toString();
      cloneValue = cloneValue.replace(/[^A-Za-z0-9]+/g, '');
      cloneValue = cloneValue.toUpperCase();
    }
    return cloneValue;
  };

  const handleChangeAndCompare = (evt, field, valueDefault = '') => {
    let value = valueDefault;
    if (evt.target) {
      value = evt.target.value;
    } else {
      if (evt) {
        value = evt;
      }
    }
    let varC = checkSymBolToUpperCase(value);
    setValue(field, varC);
  };

  const onChangePaymentStatusId = (value, valueCompare = null) => {
    setValue('is_payments_status_id', value);
    methods.clearErrors('payment_form_id');

    if (value && valueCompare != value) {
      methods.unregister('payment_form_id', {});
    } else {
      // methods.register('payment_form_id', { required: 'Hình thức thanh toán là bắt buộc' });
    }
    setValue('payment_form_id', null);
  };

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          {/* <div className='bw_col_3'>
            <div className='bw_row'>
              <FormItem label='Ngày hạch toán' className='bw_col_12'>
                <FormDate
                  style={{ border: 'none', padding: '5px 4px' }}
                  format='DD/MM/YYYY'
                  field='accounting_date'
                  disabled
                />
              </FormItem>
              <FormItem label='Ngày chứng từ' className='bw_col_12'>
                <FormDate
                  style={{ border: 'none', padding: '5px 4px' }}
                  format='DD/MM/YYYY'
                  field='payment_date'
                  disabled
                />
              </FormItem>
              <FormItem className='bw_col_12' label='Số chứng từ' disabled={disabled} isRequired>
                <FormInput type='text' field='payment_code' placeholder='Nhập số chứng từ' onChange={(evt) => handleChangeAndCompare(evt, 'payment_code')}/>
              </FormItem>
            </div>
          </div> */}
          <div className='bw_col_12'>
            <div className='bw_row'>
              <FormItem label='Ngày hạch toán' className='bw_col_4'>
                <FormDate
                  style={{ border: 'none', padding: '5px 4px' }}
                  format='DD/MM/YYYY'
                  field='accounting_date'
                  disabled
                />
              </FormItem>
              <FormItem label='Ngày chứng từ' className='bw_col_4'>
                <FormDate
                  style={{ border: 'none', padding: '5px 4px' }}
                  format='DD/MM/YYYY'
                  field='payment_date'
                  disabled={disabled}
                />
              </FormItem>
              <FormItem className='bw_col_4' label='Số chứng từ' isRequired disabled={disabled}>
                <FormInput
                  type='text'
                  field='payment_code'
                  placeholder='Nhập số chứng từ'
                  onChange={(evt) => handleChangeAndCompare(evt, 'payment_code')}
                  style={{ height: '32px' }}
                  validation={{
                    required: 'Số chứng từ là bắt buộc',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_4' label='Loại chi phí' disabled={disabled} isRequired>
                <FormSelect
                  disabled={true}
                  field='cost_type_id'
                  list={optionsCostType}
                  validation={{
                    required: 'Loại chi phí là bắt buộc',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_4' label='Mã nhà cung cấp' disabled={true} isRequired>
                <FormInput
                  field='supplier_code'
                  validation={{
                    required: 'Mã nhà cung cấp là bắt buộc',
                  }}
                  style={{ height: '36px' }}
                />
              </FormItem>
              <FormItem className='bw_col_4' disabled={disabled} label='Mã số thuế'>
                <FormInput
                  disabled={disabled}
                  type='text'
                  field='tax_code'
                  placeholder='Nhập mã số thuế'
                  onChange={(evt) => handleChangeAndCompare(evt, 'tax_code')}
                  style={{ height: '36px' }}
                />
              </FormItem>
              <FormItem className='bw_col_4' label='Trạng thái thanh toán'>
                <FormSelect
                  field='is_payments_status_id'
                  list={statusPaymentFormOption}
                  onChange={(evt) => {
                    onChangePaymentStatusId(evt, statusPaymentFormOption[1].value);
                  }}
                  validation={{
                    required: 'Trạng thái thanh toán là bắt buộc',
                  }}
                />
              </FormItem>
              <FormItem className='bw_col_4' label='Tên nhà cung cấp' disabled={disabled}>
                <div className='bw_row'>
                  <div className='bw_col_9'>
                    <FormSelect
                      disabled={disabled}
                      field='supplier_id'
                      list={optionsSupplier}
                      onChange={(e, opts) => {
                        setValue('supplier_id', e);
                        checkAndSetValue(opts?.supplier_code, 'supplier_code', setValue, null);
                        checkAndSetValue(opts?.address_full, 'address', setValue, null);
                        checkAndSetValue(opts?.postal_code, 'tax_code', setValue, null);
                        setValue('cost_type_list_opts', opts);
                      }}
                      validation={{
                        required: 'Nhà cung cấp là bắt buộc',
                      }}
                    />
                  </div>
                  <div className='bw_col_3'>
                    <CheckAccess permission={'SUPPLIER_ADD'}>
                      <BWButton
                        style={{ padding: '7px 10px' }}
                        icon={'fi fi-rr-plus'}
                        color={'blue'}
                        onClick={() => window.open('/supplier/add')}
                      />
                    </CheckAccess>
                  </div>
                </div>
              </FormItem>
              <FormItem className='bw_col_4' label='Địa chỉ' disabled={disabled}>
                <FormInput type='text' field='address' placeholder='Nhập địa chỉ' style={{ height: '36px' }} />
              </FormItem>
              {watch('is_payments_status_id') && +realPaymentStatus !== STATUS_PAYMENT.PAID ? (
                <FormItem className='bw_col_4' label='Hình thức thanh toán'>
                  <FormSelect field='payment_form_id' list={PAYMENT_TYPE_OPTIONS} />
                </FormItem>
              ) : null}
              <FormItem label='Trạng thái đơn hàng' className='bw_col_4' disabled={disabled} isRequired>
                {/* <FormDebouneSelect
                  field='order_status_id'
                  id='order_status_id'
                  options={orderStatusOpts}
                  allowClear={true}
                  style={{ width: '100%' }}
                  fetchOptions={statusPurchaseOrdersFormOption}
                  debounceTimeout={700}
                  placeholder={'-- Chọn --'}
                  validation={{
                    required: 'Trạng thái đơn hàng là bắt buộc',
                  }}
                  onChange={(_, opt) => {
                    setValue('order_status_id', opt?.value);
                    clearErrors('order_status_id');
                  }}
                /> */}
                <FormSelect
                  field='order_status_id'
                  list={statusPurchaseOrdersFormOption}
                  allowClear={true}
                  defaultValue={statusPurchaseOrdersFormOption[3].value}
                  placeholder={'-- Chọn --'}
                  validation={{
                    required: 'Trạng thái đơn hàng là bắt buộc',
                  }}
                  disabled={disabled}
                />
              </FormItem>
              <FormItem label='Nhân viên mua hàng' className='bw_col_4' isRequired={true} disabled={disabled}>
                <FormSelect
                  field='employee_purchase'
                  list={mapDataOptions4SelectCustomByType(userData)}
                  validation={{
                    required: 'Nhân viên mua hàng là bắt buộc',
                  }}
                  disabled={disabled}
                />
              </FormItem>
            </div>
          </div>
        </div>
        <div className='bw_row'>
          <FormItem label='Diễn giải' className='bw_col_12' disabled={disabled}>
            <FormTextArea field='purchase_cost_note' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default InformationDetail;
