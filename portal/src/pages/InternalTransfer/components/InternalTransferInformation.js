import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { useFormContext } from 'react-hook-form';
import UserSendQCTable from './Accounting/AccountingTable';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { useAuth } from 'context/AuthProvider';
import { CURRENCY_TYPE, PAYMENT_TYPE, REVIEW_STATUS, STATUS_RECEIVE_MONEY } from '../helpers/const';
import {
  getStoreOptions,
  getBankAccountOptions,
  getInternalTransferTypeOptions,
} from 'services/internal-transfer.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

const InternalTransferInformation = ({ disabled, title }) => {
  const { user } = useAuth();
  const { watch, setValue, unregister } = useFormContext();
  const [storeOptions, setStoreOptions] = useState([]);
  const [bankAccountReceiveOptions, setBankAccountReceiveOptions] = useState([]);
  const [bankAccountTransferOptions, setBankAccountTransferOptions] = useState([]);
  const [internalTransferTypeOptions, setInternalTransferTypeOptions] = useState([]);
  const convertListWithoutOptionAll = useCallback(
    (list = [], valueOfAll) => list.filter((item) => item.value !== valueOfAll),
    [],
  );
  const paymentTypeOptions = useMemo(() => convertListWithoutOptionAll(PAYMENT_TYPE, 0), [PAYMENT_TYPE]);
  const reviewStatusOptions = useMemo(() => convertListWithoutOptionAll(REVIEW_STATUS, -1), [REVIEW_STATUS]);

  const isTransferPayment = watch('payment_type') === 2;
  const internal_transfer_name = watch('internal_transfer_name');
  const store_receive_id = watch('store_receive_id');
  const store_transfer_id = watch('store_transfer_id');
  const internal_transfer_code = watch('internal_transfer_code');

  const getBusinessIdOfStore = useCallback(
    (store_id) => storeOptions?.find((item) => item.id === store_id)?.business_id,
    [storeOptions],
  );

  const setDefaultValue = useCallback((field, list = []) => setValue(field, list[0]?.id), []);

  useEffect(() => {
    if (!(store_receive_id && store_transfer_id)) return () => {};
    const business_receive_id = getBusinessIdOfStore(store_receive_id);
    const business_transfer_id = getBusinessIdOfStore(store_transfer_id);
    const is_same_business = business_receive_id === business_transfer_id ? 1 : 0;
    setValue('is_same_business', is_same_business);
    getInternalTransferTypeOptions({ is_same_business }).then((data) => {
      setInternalTransferTypeOptions(mapDataOptions4SelectCustom(data));
      if (data.length === 1) setDefaultValue('internal_transfer_type_id', data);
    });
  }, [store_receive_id, store_transfer_id]);

  useEffect(() => {
    if (!isTransferPayment) return () => {};
    if (store_receive_id) {
      getBankAccountOptions({ store_id: store_receive_id }).then((data) => {
        setBankAccountReceiveOptions(mapDataOptions4SelectCustom(data));
        if (data.length === 1) setDefaultValue('bank_account_receive_id', data);
      });
    }

    if (store_transfer_id) {
      getBankAccountOptions({ store_id: store_transfer_id }).then((data) => {
        setBankAccountTransferOptions(mapDataOptions4SelectCustom(data));
        if (data.length === 1) setDefaultValue('bank_account_transfer_id', data);
      });
    }
  }, [isTransferPayment, store_receive_id, store_transfer_id]);

  useEffect(() => {
    setValue('created_user', `${user.user_name} - ${user.full_name}`);
    getStoreOptions().then((stores) => setStoreOptions(mapDataOptions4SelectCustom(stores)));
  }, []);

  useEffect(() => {
    if (internal_transfer_name && internal_transfer_name.search('...') === -1) return () => {};
    setValue(
      'internal_transfer_name',
      `Chuyển tiền nội bộ từ của hàng ${
        storeOptions.find((item) => item.id === store_transfer_id)?.name ?? '...'
      } đến cửa hàng ${
        storeOptions.find((item) => item.id === store_receive_id)?.name ?? '...'
      } theo phiếu số ${internal_transfer_code}`,
    );
  }, [internal_transfer_code, store_receive_id, store_transfer_id, storeOptions, internal_transfer_name]);

  useEffect(() => {
    if (!isTransferPayment) {
      unregister('bank_account_transfer_id');
      unregister('bank_account_receive_id');
    }
  }, [isTransferPayment]);

  return (
    <BWAccordion title={title} isRequired>
      <div className='bw_row'>
        <FormItem className='bw_col_3' label='Cửa hàng chi' isRequired disabled={disabled}>
          <FormSelect
            field='store_transfer_id'
            placeholder='Cửa hàng chi'
            validation={{ required: 'Cửa hàng chi là bắt buộc' }}
            list={storeOptions.filter((item) => (item.id ?? item) !== store_receive_id)}
          />
        </FormItem>
        <FormItem
          className='bw_col_3'
          label='Tài khoản đi'
          isRequired={isTransferPayment}
          disabled={disabled || !isTransferPayment || !store_transfer_id}>
          <FormSelect
            field='bank_account_transfer_id'
            placeholder='Tài khoản đi'
            validation={{ required: !isTransferPayment ? false : 'Tài khoản đi là bắt buộc' }}
            list={bankAccountTransferOptions}
          />
        </FormItem>
        <FormItem className='bw_col_3' label='Trạng thái' isRequired disabled={true}>
          <FormSelect
            field='review_status'
            placeholder='Trạng thái'
            validation={{ required: 'Trạng thái là bắt buộc' }}
            list={reviewStatusOptions}
          />
        </FormItem>
        <FormItem label='Ngày hạch toán' className='bw_col_3' isRequired>
          <FormDatePicker
            style={{ border: 'none', padding: '5px 4px' }}
            format='DD/MM/YYYY'
            field='created_date'
            disabled={disabled}
            validation={{ required: 'Ngày hạch toán là bắt buộc' }}
          />
        </FormItem>
      </div>
      <div className='bw_row'>
        <FormItem className='bw_col_3' label='Cửa hàng thu' isRequired disabled={disabled}>
          <FormSelect
            field='store_receive_id'
            placeholder='Cửa hàng thu'
            validation={{ required: 'Cửa hàng thu là bắt buộc' }}
            list={storeOptions.filter((item) => (item.id ?? item) !== store_transfer_id)}
          />
        </FormItem>

        <FormItem
          className='bw_col_3'
          label='Tài khoản đến'
          isRequired={isTransferPayment}
          disabled={disabled || !isTransferPayment || !store_receive_id}>
          <FormSelect
            field='bank_account_receive_id'
            placeholder='Tài khoản đến'
            validation={{ required: !isTransferPayment ? false : 'Tài khoản đến là bắt buộc' }}
            list={bankAccountReceiveOptions}
          />{' '}
        </FormItem>

        <FormItem className='bw_col_3' isRequired label='Người tạo phiếu' disabled={true}>
          <FormInput
            field='created_user'
            placeholder='Người tạo phiếu'
            validation={{ required: 'Người tạo phiếu là bắt buộc' }}
          />
        </FormItem>

        <FormItem label='Ngày chứng từ' className='bw_col_3' isRequired>
          <FormDatePicker
            style={{ border: 'none', padding: '5px 4px' }}
            format='DD/MM/YYYY'
            field='accounting_date'
            disabled={disabled}
            validation={{ required: 'Ngày chứng từ là bắt buộc' }}
          />
        </FormItem>
      </div>
      <div className='bw_row'>
        <FormItem
          className='bw_col_3'
          label='Hình thức chuyển'
          isRequired
          disabled={disabled || !(store_receive_id && store_transfer_id)}>
          <FormSelect
            field='internal_transfer_type_id'
            placeholder='Hình thức chuyển'
            validation={{ required: 'Hình thức chuyển là bắt buộc' }}
            list={internalTransferTypeOptions}
          />
        </FormItem>
        <FormItem className='bw_col_3' label='Hình thức thanh toán' isRequired disabled={disabled}>
          <FormSelect
            field='payment_type'
            placeholder='Hình thức thanh toán'
            validation={{ required: 'Hình thức thanh toán là bắt buộc' }}
            list={paymentTypeOptions}
          />
        </FormItem>
        <FormItem className='bw_col_3' label='Trạng thái nhận tiền' isRequired disabled={true}>
          <FormSelect
            field='status_receive_money'
            placeholder='Trạng thái nhận tiền'
            validation={{ required: 'Trạng thái nhận tiền là bắt buộc' }}
            list={STATUS_RECEIVE_MONEY}
          />
        </FormItem>
        <FormItem className='bw_col_3' isRequired label='Số chứng từ' disabled={true}>
          <FormInput
            field='internal_transfer_code'
            placeholder='Số chứng từ'
            validation={{ required: 'Số chứng từ là bắt buộc' }}
          />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_9' label='Lý do chuyển' isRequired disabled={disabled}>
          <FormInput field='internal_transfer_name' validation={{ required: 'Lý do chuyển là bắt buộc' }} />
        </FormItem>
        <FormItem className='bw_col_3' label='Loai tiền' isRequired disabled={disabled}>
          <FormSelect
            field='currency_type'
            placeholder='Loai tiền'
            validation={{ required: 'Loai tiền là bắt buộc' }}
            list={CURRENCY_TYPE}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default InternalTransferInformation;
