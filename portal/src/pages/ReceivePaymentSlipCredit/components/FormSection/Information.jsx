import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import {
  getCashierByCompanyId,
  getReceiveTypeOpts,
  getBusinessOpts,
  getStoreOpts,
} from 'services/receive-slip.service';
import { getPaymentTypeOpts } from 'services/receive-slip.service';
import { mapDataOptions4SelectCustom, mapDataOptions4Select, showToast } from 'utils/helpers';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { RECEIPTSOBJECT, optionsReceiptsObject, RECEIVE_PAYMENT_TYPE, PAYMENTTYPE } from '../../utils/constants';

import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getOptionsSupplier } from 'services/supplier.service';
import { getOptionsUser } from 'services/users.service';
import { getOptionsCustomer } from 'services/stocks-in-request.service';
import { getReviewLevel, getInvoiceOptions } from 'services/payment-slip.service';
import { getPaymentFormOptions } from 'services/payment-form.service';

// User's auth

import FormInput from 'components/shared/BWFormControl/FormInput';
import styled from 'styled-components';
import FormDate from 'components/shared/BWFormControl/FormDate';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { getOptionsGlobal } from 'actions/global';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice } from 'utils/index';
import { PAYMENTFORM_TYPE } from 'pages/PaymentForm/utils/constants';
import useVerifyAccess from 'hooks/useVerifyAccess';
import { fieldDisableToEdit } from 'pages/ReceivePaymentSlipCash/utils/helper';
import { getOptionsStore } from 'services/store.service';
import { useAuth } from 'context/AuthProvider';
import { getOptions as getOptionInstallment } from 'services/installment-partner.service';

const TotalCountWrapper = styled.div`
  .title {
    font-size: 1rem;
    text-align: right;
  }
  .number {
    font-size: 1.1rem;
    font-weight: bold;
    text-align: right;
  }
`;

const InformationDetail = ({ disabled, title, objectName = 'chi', objectType, isAddPage }) => {
  const { user } = useAuth();
  const { verifyPermission } = useVerifyAccess();

  const methods = useFormContext();
  const dispatch = useDispatch();
  const { watch, setValue, getValues } = methods;
  const [optionsReceipts, setOptionsReceipts] = useState([]);
  const [lableObject, setLabelObject] = useState(`Đối tượng ${objectName}`);
  const [enableBankAccount, setEnableBankAccount] = useState(false);

  const userAuth = useMemo(() => {
    return {
      isAdmin: user?.isAdministrator,
      isHavePermissionToEdit: verifyPermission('SL_RECEIVE_PAYMENT_CASH_ACCOUNTING_EDIT'),
    };
  }, []);

  disabled = disabled || (!isAddPage && !(userAuth.isAdmin || userAuth.isHavePermissionToEdit));

  const getReceiveObjectOptions = (value) => {
    let opts = [];
    return (
      watch('receiver_type') === RECEIPTSOBJECT.STAFF
        ? getOptionsUser
        : watch('receiver_type') === RECEIPTSOBJECT.CUSTOMER
        ? getOptionsCustomer
        : watch('receiver_type') === RECEIPTSOBJECT.SUPPLIER
        ? getOptionsSupplier
        : getOptionInstallment
    )({
      search: value,
    }).then((body) => {
      opts = body.map((_) => ({
        label: _?.name,
        value: _?.id,
      }));
      setOptionsReceipts(opts);
    });
  };

  const [optionsObjectType, setOptionsObjectType] = useState([]);
  const [optionsCashier, setOptionsCashier] = useState([]);
  const [paymentFormOptions, setPaymentFormOptions] = useState([]);
  const [storeOptions, setStoreOptions] = useState([]);

  const companyData = useSelector((state) => state.global.companyData);
  // const paymentFormData = useSelector((state) => state.global.paymentFormData);
  const businessBankData = useSelector((state) => state.global.businessBankData);
  const storeBankData = useSelector((state) => state.global.storeBankData);
  const businessData = useSelector((state) => state.global.businessData);

  useEffect(() => {
    dispatch(getOptionsGlobal('company'));
    dispatch(getOptionsGlobal('businessBank', { parent_id: getValues('business_id') }));
    dispatch(getOptionsGlobal('storeBank', { parent_id: getValues('store_id') }));
    dispatch(getOptionsGlobal('business'));
    dispatch(getOptionsGlobal('store'));

    getCashierByCompanyId({ company_id: getValues('company_id') }).then((data) => {
      setOptionsCashier(mapDataOptions4Select(data));
    });

    getOptionsStore({ business_id: watch('business_id') }).then((data) => {
      setStoreOptions(mapDataOptions4SelectCustom(data));
    });

    if (objectType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP) {
      getReceiveTypeOpts({ company_id: watch('company_id'), business_id: watch('business_id') }).then((data) => {
        setOptionsObjectType(mapDataOptions4Select(data));
      });
    } else {
      getPaymentTypeOpts({ company_id: watch('company_id'), business_id: watch('business_id') }).then((data) => {
        setOptionsObjectType(mapDataOptions4SelectCustom(data));
      });
    }

    getPaymentFormOptions({
      company_id: getValues('company_id'),
      business_id: getValues('business_id'),
      store_id: getValues('store_id'),
    }).then(setPaymentFormOptions);
  }, []);

  useEffect(() => {
    if (isAddPage && !watch('is_set_default_value') && paymentFormOptions?.length > 0) {
      const defaultPaymentMethod = paymentFormOptions?.find((_) => _.label?.toUpperCase() === 'CHUYỂN KHOẢN');
      if (defaultPaymentMethod) {
        methods.setValue('is_set_default_value', true);
        methods.setValue('payment_form_id', defaultPaymentMethod?.value);
      }
    }
  }, [isAddPage, paymentFormOptions]);

  useEffect(() => {
    getOptionsStore({ business_id: watch('business_id') || null }).then((data) => {
      setStoreOptions(mapDataOptions4SelectCustom(data));
    });
  }, [watch('business_id')]);

  // update options by receiver type
  useEffect(() => {
    if (watch('receiver_type') === RECEIPTSOBJECT.SUPPLIER) {
      setLabelObject('Nhà cung cấp');
    } else if (watch('receiver_type') === RECEIPTSOBJECT.STAFF) {
      setLabelObject('Nhân viên');
    } else if (watch('receiver_type') === RECEIPTSOBJECT.CUSTOMER) {
      setLabelObject('Khách hàng');
    } else if (watch('receiver_type') === RECEIPTSOBJECT.INSTALLMENT_PARTNER) {
      setLabelObject('Đối tác trả góp');
    } else {
      setLabelObject(`Đối tượng ${objectName}`);
    }

    if (watch('receiver_type')) {
      getReceiveObjectOptions('');
    }
  }, [watch('receiver_type')]);

  const getOptsCustomer = useCallback(
    (value) => {
      return getCashierByCompanyId({
        keyword: value,
        company_id: watch('company_id'),
      }).then((body) =>
        body.map((user) => ({
          label: user?.name,
          value: user?.id,
        })),
      );
    },
    [watch('company_id')],
  );

  useEffect(() => {
    const currentPaymentForm = paymentFormOptions?.find((_) => _.value === getValues('payment_form_id'));
    if (currentPaymentForm) {
      setEnableBankAccount(currentPaymentForm.payment_type === 2 || currentPaymentForm.payment_type === 3);
    }
  }, [watch('payment_form_id'), paymentFormOptions]);

  const isSupplier = watch('receiver_type') === RECEIPTSOBJECT.SUPPLIER;
  const supplier_id = watch('receiver_id');
  const is_from_pay_debit = watch('is_from_pay_debit');
  useEffect(() => {
    if (isSupplier && supplier_id && !is_from_pay_debit) {
      getInvoiceOptions({ supplier_id }).then((res) => {
        setValue('invoice_options', res);
        setValue('is_disabled', 0);
      });
    }
  }, [isSupplier, supplier_id, is_from_pay_debit]);

  const clearInvoice = useCallback(() => {
    setValue('invoice_ids', []);
    setValue('invoice_options', []);
    setValue('invoice_payment_list', []);
  }, []);

  // Set default diễn giải và nội dung chi
  const accounting_list = useMemo(() => watch('accounting_list') ?? [], [watch('accounting_list')]);
  const invoice_ids = useMemo(() => watch('invoice_ids') ?? [], [watch('invoice_ids')]);
  useEffect(() => {
    if (invoice_ids.length === 0) return () => {};
    let descriptions = '';
    if (isSupplier && supplier_id) {
      const receiver_name = watch('receiver_name');
      const invoice_payment_list = watch('invoice_payment_list') ?? [];
      descriptions = `Trả tiền của ${receiver_name} theo hóa đơn ${invoice_payment_list
        .map((item) => item.invoice_no)
        ?.join(', ')}`;
    }
    setValue('descriptions', descriptions);
    setValue(
      'accounting_list',
      accounting_list.map((item) => ({ ...item, explain: descriptions })),
    );
  }, [isSupplier, supplier_id, invoice_ids]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_9'>
            <div className='bw_row'>
              <FormItem className='bw_col_4' label='Công ty' disabled={disabled} isRequired>
                <FormSelect
                  field='company_id'
                  list={mapDataOptions4SelectCustom(
                    companyData?.filter((_) => user.user_name === 'administrator' || _.id == user.company_id) || [],
                  )}
                  onChange={(value) => {
                    methods.clearErrors('company_id');
                    methods.setValue('company_id', value);
                    setValue('business_id', null);
                    setValue('store_id', null);
                    dispatch(getOptionsGlobal('business', { parent_id: value }));
                    getPaymentFormOptions({ company_id: value }).then(setPaymentFormOptions);
                  }}
                  validation={{
                    required: 'Công ty là bắt buộc',
                  }}
                />
              </FormItem>
              <FormItem label='Miền' className='bw_col_4' disabled={disabled} isRequired>
                <FormSelect
                  field='business_id'
                  list={mapDataOptions4SelectCustom(businessData)}
                  onChange={(value) => {
                    methods.clearErrors('business_id');
                    methods.setValue('business_id', value);
                    setValue('bank_account_id', null);
                    setValue('store_id', null);
                    if (objectType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP) {
                      setValue('receive_type_id', null);
                      getReceiveTypeOpts({ company_id: watch('company_id'), business_id: value }).then((data) => {
                        setOptionsObjectType(mapDataOptions4Select(data));
                      });
                    } else {
                      setValue('expend_type_id', null);
                      getPaymentTypeOpts({ company_id: watch('company_id'), business_id: value }).then((data) => {
                        setOptionsObjectType(mapDataOptions4SelectCustom(data));
                      });
                    }
                    dispatch(getOptionsGlobal('store', { parent_id: value }));
                    dispatch(getOptionsGlobal('businessBank', { parent_id: value }));
                    getPaymentFormOptions({ business_id: value }).then(setPaymentFormOptions);
                  }}
                  validation={{
                    required: 'Miền là bắt buộc',
                  }}
                />
              </FormItem>
              <FormItem label='Cửa hàng' className='bw_col_4' disabled={disabled}>
                <FormSelect
                  field='store_id'
                  list={storeOptions}
                  onChange={(value) => {
                    methods.clearErrors('store_id');
                    methods.setValue('store_id', value);
                    setValue('bank_account_id', null);
                    dispatch(getOptionsGlobal('storeBank', { parent_id: value }));
                    getPaymentFormOptions({ store_id: value }).then(setPaymentFormOptions);
                  }}
                />
              </FormItem>
              <FormItem label={`Loại ${objectName}`} className='bw_col_4' disabled={disabled} isRequired>
                <FormSelect
                  field={objectType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP ? 'receive_type_id' : 'expend_type_id'}
                  list={optionsObjectType}
                  onChange={(value) => {
                    if (objectType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP) {
                      methods.clearErrors('receive_type_id');
                      methods.setValue('receive_type_id', value);
                    } else {
                      methods.clearErrors('expend_type_id');
                      methods.setValue('expend_type_id', value);
                    }

                    const selecedItem = optionsObjectType.find((_) => _.value == value);
                    if (selecedItem) {
                      methods.setValue('descriptions', selecedItem.description ?? methods.watch('descriptions'));
                    }

                    // get review list when user change payment type
                    if (objectType === RECEIVE_PAYMENT_TYPE.PAYMENTSLIP) {
                      methods.clearErrors('review_list');
                      getReviewLevel({ expend_type_id: value }).then((data = []) => {
                        methods.setValue('review_list', data);
                      });
                    }
                  }}
                  validation={{
                    required: `Loại ${objectName} là bắt buộc`,
                  }}
                />
              </FormItem>
              <FormItem
                label={`Tài khoản ${objectName}`}
                className='bw_col_4'
                disabled={!enableBankAccount || disabled}>
                <FormSelect
                  field='bank_account_id'
                  list={mapDataOptions4SelectCustom(methods.getValues('store_id') ? storeBankData : businessBankData)}
                />
              </FormItem>
              <FormItem label={`Nhân viên ${objectName}`} className='bw_col_4' disabled={disabled} isRequired>
                <FormDebouneSelect
                  field={objectType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP ? 'cashier_id' : 'payer_id'}
                  fetchOptions={getOptsCustomer}
                  placeholder='--Chọn--'
                  options={optionsCashier}
                  onChange={(e) => {
                    if (objectType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP) {
                      methods.clearErrors('cashier_name');
                      setValue('cashier_name', e.label);
                      setValue('cashier_id', e.value);
                    } else {
                      methods.clearErrors('payer_name');
                      setValue('payer_name', e.label);
                      setValue('payer_id', e.value);
                    }
                  }}
                  validation={{
                    required: `Nhân viên ${objectName} là bắt buộc`,
                  }}
                />
              </FormItem>
              <FormItem label='Loại đối tượng' className='bw_col_4' disabled={disabled} isRequired>
                <FormSelect
                  field='receiver_type'
                  list={optionsReceiptsObject}
                  validation={{
                    required: 'Loại đối tượng là bắt buộc',
                  }}
                  onChange={(value) => {
                    methods.clearErrors('receiver_type');
                    setValue('receiver_type', value);
                    setValue('receiver_name', null);
                    setValue('receiver_id', null);
                    clearInvoice();
                  }}
                />
              </FormItem>
              <FormItem
                label={lableObject}
                className='bw_col_4'
                disabled={disabled || !watch('receiver_type') || watch('receiver_type') === RECEIPTSOBJECT.OTHER}
                isRequired>
                <FormDebouneSelect
                  validation={{
                    required:
                      !(watch('receiver_type') === RECEIPTSOBJECT.OTHER) && `Đối tượng ${objectName} là bắt buộc`,
                  }}
                  field='receiver_name'
                  fetchOptions={getReceiveObjectOptions}
                  options={optionsReceipts}
                  placeholder='--Chọn--'
                  onChange={(e) => {
                    methods.clearErrors('receiver_name');
                    setValue('receiver_name', e.label);
                    setValue('receiver_id', e.value);
                    clearInvoice();
                  }}
                />
              </FormItem>
              <FormItem label='Hình thức thanh toán' className='bw_col_4' disabled={disabled} isRequired>
                <FormSelect
                  field='payment_form_id'
                  list={paymentFormOptions?.filter((_) => _.payment_type !== PAYMENTFORM_TYPE.CASH)}
                  onChange={(value) => {
                    methods.clearErrors('payment_form_id');
                    setValue('payment_form_id', value);
                  }}
                  validation={{
                    required: 'Hình thức thanh toán là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
          </div>

          <div className='bw_col_3'>
            <div className='bw_row'>
              <FormItem label='Ngày hạch toán' className='bw_col_12'>
                <FormDate
                  style={{ border: 'none', padding: '5px 4px' }}
                  format='DD/MM/YYYY'
                  field='created_date'
                  placeholder={'dd/mm/yyyy'}
                  bordered={false}
                  disabled={disabled}
                />
              </FormItem>
              <FormItem label='Ngày chứng từ' className='bw_col_12'>
                <FormDate
                  style={{ border: 'none', padding: '5px 4px' }}
                  format='DD/MM/YYYY'
                  field='accounting_date'
                  disabled={disabled}
                />
              </FormItem>
              <FormItem className='bw_col_12' disabled={disabled} isRequired label={`Số phiếu ${objectName}`}>
                <FormInput
                  disabled={disabled}
                  type='text'
                  field={objectType === RECEIVE_PAYMENT_TYPE.RECEIVESLIP ? 'receive_slip_code' : 'payment_slip_code'}
                  placeholder={`Số phiếu ${objectName}`}
                />
              </FormItem>
            </div>
          </div>
        </div>
        <div className='bw_row'>
          <FormItem label={`Nội dung ${objectName}`} className='bw_col_6' disabled={disabled}>
            <FormTextArea field='descriptions' />
          </FormItem>
          <div className='bw_col_6'>
            <div className='bw_row'>
              <FormItem label='Số lượng chứng từ gốc' className='bw_col_6' disabled={true}>
                <FormNumber field='attachment_count' bordered={false} min={0} />
              </FormItem>
              <div className='bw_col_6'>
                <div className='bw_row'>
                  <div className='bw_col_7'>
                    <FormItem label='Loại tiền'>
                      <FormRadioGroup field='currency_type' list={[{ value: 1, label: 'VND' }]} disabled={disabled} />
                    </FormItem>
                  </div>
                  <div className='bw_col_5'>
                    <TotalCountWrapper>
                      <p className='title'>Tổng tiền</p>
                      <p className='number'>{formatPrice(methods.watch('total_money') || 0)}</p>
                    </TotalCountWrapper>
                  </div>
                </div>
              </div>
              <div className='bw_col_12'>
                <a>Tham chiếu</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default InformationDetail;
