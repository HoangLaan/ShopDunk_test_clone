import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';

import { useAuth } from 'context/AuthProvider';
import { mapDataOptions4SelectCustomByType } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { getListReviewByType } from 'services/borrow-request.service';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import BWButton from 'components/shared/BWButton';

function BorrowRequestInfo({ disabled, title, genCode }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const methods = useFormContext();
  const { watch, setValue, unregister } = methods;

  const [storeBorrow, setStoreBorrow] = useState([]);
  const [storeOut, setStoreOut] = useState([]);
  const [stockBorrow, setStockBorrow] = useState([]);
  const [stockOut, setStockOut] = useState([]);

  const { companyData, userData, borrowTypeData } = useSelector((state) => state.global);

  const company_id = watch('company_id');
  const store_id = watch('store_id');
  const store_borrow_id = watch('store_borrow_id');
  const store_out_id = watch('store_out_id');
  const employee_borrow = watch('employee_borrow');

  useEffect(() => {
    setValue('company_id', String(user?.company_id));
    setValue('employee_borrow', String(user?.user_name));
  }, [user, setValue]);

  const getOptions1Time = useCallback(() => {
    dispatch(getOptionsGlobal('company'));
    dispatch(getOptionsGlobal('borrowType'));
  }, [dispatch]);
  useEffect(getOptions1Time, [getOptions1Time]);

  const getBorrowStoreOptions = useCallback(() => {
    if ((employee_borrow, company_id)) {
      dispatch(getOptionsGlobal('store', { company_id, user_name: employee_borrow, is_check_permission: 1 })).then(
        (res) => {
          setStoreBorrow(res);
        },
      );
    }
  }, [employee_borrow, company_id, dispatch]);
  useEffect(getBorrowStoreOptions, [getBorrowStoreOptions]);

  const getOutStoreOptions = useCallback(() => {
    if (company_id) {
      dispatch(getOptionsGlobal('store', { company_id, user_name: '' })).then((res) => {
        setStoreOut(res);
      });
    }
  }, [company_id, dispatch]);
  useEffect(getOutStoreOptions, [getOutStoreOptions]);

  const getUserOptions = useCallback(() => {
    if (company_id) {
      dispatch(getOptionsGlobal('user', { company_id: company_id, store_id: store_id }));
    }
  }, [company_id, store_id, dispatch]);
  useEffect(getUserOptions, [getUserOptions]);

  const getStockOptions = useCallback(
    (store_id, field) => {
      if (store_id) {
        dispatch(getOptionsGlobal('stocksForSell', { store_id })).then((res) => {
          if (field === 'stock_borrow_id') {
            setStockBorrow(res);
          } else if (field === 'stock_out_id') {
            setStockOut(res);
          }
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    getStockOptions(store_borrow_id, 'stock_borrow_id');
  }, [getStockOptions, store_borrow_id]);

  useEffect(() => {
    getStockOptions(store_out_id, 'stock_out_id');
  }, [getStockOptions, store_out_id]);

  const handleChangeTypeBorrow = (value) => {
    setValue('borrow_type_id', value);

    getListReviewByType({ borrow_type_id: value }).then((res) => {
      unregister('borrow_request_review_list');
      setValue('borrow_request_review_list', res);
    });
  };

  const handleCompanyChange = useCallback(
    (value = null) => {
      setValue('company_id', value);

      setValue('store_id', null);
      setValue('employee_borrow', null);
      setValue('store_borrow_id', null);
      setValue('stock_borrow_id', null);
      setValue('store_out_id', null);
      setValue('stock_out_id', null);
      setStockBorrow([]);
      setStockOut([]);
    },
    [setValue],
  );

  const hangdleChangeStoreBorrow = useCallback(
    (value = null) => {
      setValue('store_borrow_id', value);
      setValue('stock_borrow_id', null);
    },
    [setValue],
  );

  const handleChangeStockOut = useCallback(
    (value = null) => {
      setValue('store_out_id', value);
      setValue('stock_out_id', null);
    },
    [setValue],
  );

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Hình thức mượn hàng' isRequired disabled={disabled}>
            <FormSelect
              field='borrow_type_id'
              onChange={handleChangeTypeBorrow}
              list={mapDataOptions4SelectCustomByType(borrowTypeData)}
              validation={{
                required: 'Hình thức mượn là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Thuộc công ty' isRequired disabled>
            <FormSelect
              field='company_id'
              list={mapDataOptions4SelectCustomByType(companyData)}
              onChange={(evt) => {
                handleCompanyChange(evt);
              }}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <div className={`bw_frm_box ${disabled ? 'bw_disable' : ''}`}>
            <div className='bw_flex bw_justify_content_between'>
              <label>
                Mã phiếu mượn<span class='bw_red'>*</span>
              </label>
              {!disabled && <BWButton content='Tạo mới' onClick={genCode} disabled={disabled} />}
            </div>
            <FormInput
              field='borrow_request_code'
              validation={{
                required: 'Mã phiếu là bắt buộc',
              }}
              disabled={disabled}
            />
          </div>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Tên phiếu mượn' isRequired disabled={disabled}>
            <FormInput
              field='borrow_request_name'
              validation={{
                required: 'Tên phiếu mượn là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Nhân viên mượn' isRequired={true} disabled>
            <FormSelect
              field='employee_borrow'
              list={mapDataOptions4SelectCustomByType(userData)}
              validation={{
                required: 'Nhân viên mượn là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Ngày hẹn trả' disabled={disabled} isRequired>
            <FormDatePicker
              field='date_return'
              validation={{
                required: 'Thời gian trả là bắt buộc',
              }}
              format={'DD/MM/YYYY'}
              allowClear={true}
              bordered={false}
              disabledDate={(current) => {
                return moment().add(-1, 'days') >= current;
              }}
              placeholder='Chọn ngày'
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Cửa hàng mượn' isRequired={true} disabled={disabled}>
            <FormSelect
              field='store_borrow_id'
              list={mapDataOptions4SelectCustomByType(storeBorrow).map((item) => ({
                ...item,
                disabled: item.value === store_out_id,
              }))}
              onChange={(evt) => {
                hangdleChangeStoreBorrow(evt);
              }}
              validation={{
                required: 'Cửa hàng mượn là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Kho Mượn' isRequired={true} disabled={disabled}>
            <FormSelect
              field='stock_borrow_id'
              list={mapDataOptions4SelectCustomByType(stockBorrow)}
              validation={{
                required: 'Kho mượn là bắt buộc',
              }}
              disabled={disabled || !watch('store_borrow_id')}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Cửa hàng xuất' isRequired={true} disabled={disabled}>
            <FormSelect
              field='store_out_id'
              list={mapDataOptions4SelectCustomByType(storeOut).map((item) => ({
                ...item,
                disabled: item.value === store_borrow_id,
              }))}
              validation={{
                required: 'Cửa hàng xuất là bắt buộc',
              }}
              onChange={(evt) => {
                handleChangeStockOut(evt);
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Kho xuất' isRequired={true} disabled={disabled}>
            <FormSelect
              field='stock_out_id'
              list={mapDataOptions4SelectCustomByType(stockOut)}
              validation={{
                required: 'Kho xuất là bắt buộc',
              }}
              disabled={disabled || !watch('store_out_id')}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Ghi chú' disabled={disabled}>
            <FormTextArea field='note' placeholder='Nhập ghi chú' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default BorrowRequestInfo;
