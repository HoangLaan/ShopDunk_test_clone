import React, { useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { getOptionsGlobal as _getOptionsGlobal } from 'services/global.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
import {
  getListReview,
  getListShift,
  getListTransferShiftType,
  getOptionsBusiness,
} from 'services/transfer-shift.service';
import { useAuth } from 'context/AuthProvider';
import dayjs from 'dayjs';

const TransferShiftInformation = ({ disabled, title }) => {
  const { watch, setValue } = useFormContext();
  const [businessOptions, setBusinessData] = useState([]);
  const [dataTransferShiftType, setDataTransferShiftType] = useState([]);
  const [currentStore, setCurrentStore] = useState([]);
  const [newStore, setNewStore] = useState([]);
  const [currentShifts, setCurrentShifts] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [disabledBusiness, setDisabledBusiness] = useState(false);
  const [disabledNewBusiness, setDisabledNewBusiness] = useState(false);
  const { user } = useAuth();
  const isStoreManagerUser = true ?? user?.functions?.includes('HR_STOREMANAGER_TRANSFERSHIFT');
  const isHRUser = user?.functions?.includes('HR_HRDEPARTMENT_TRANSFERSHIFT');

  useEffect(() => {
    if(!watch('date_from')){
      setValue('date_from', dayjs().format('DD/MM/YYYY'))
      setValue('date_to', dayjs().format('DD/MM/YYYY'))
    }
  }, [watch()]) 

  useEffect(() => {
    getOptionsBusiness({
      company_id: isHRUser || isStoreManagerUser ? user.company_id : 0,
      // Lấy ra tất cả miền, cửa hàng khi user không phải là trưởng cửa hàng hoặc là admin
      user_id: !isStoreManagerUser || user.isAdministrator ? 0 : null,
    }).then((res) => setBusinessData(res));
  }, []);

  //Lấy danh sách cửa hàng của ca hiện tại
  useEffect(() => {
    if (!watch('current_business_id')) {
      //change type: store -> mdShiftApplyStore
      _getOptionsGlobal({ type: 'mdShiftApplyStore', parent_id: watch('current_business_id') }).then(setCurrentStore);
    }
    if (disabledNewBusiness) {
      setValue('business_id', watch('current_business_id'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('current_business_id')]);

  //Lấy danh sách cửa hàng của ca chuyển
  useEffect(() => {
    if (!watch('business_id')) {
      //change type: store -> mdShiftApplyStore
      _getOptionsGlobal({ type: 'mdShiftApplyStore', parent_id: watch('business_id') }).then(setNewStore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('business_id')]);

  //Lấy danh sách loại chuyển ca
  useEffect(() => {
    getListTransferShiftType().then(setDataTransferShiftType);
  }, []);

  //Lấy danh sách ca hiện tại của user
  useEffect(() => {
    if (watch('current_store_id') && watch('date_from') && watch('date_to'))
      getListShift({
        store_id: watch('current_store_id'),
        date_from: watch('date_from'),
        date_to: watch('date_to'),
        current_shift_id: watch('current_shift_id'),
      }).then(setCurrentShifts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('current_store_id'), watch('date_from'), watch('date_to')]);

  //Lấy dnh sách ca chuyển
  useEffect(() => {
    if (watch('store_id') && watch('current_shift_id') && watch('date_from') && watch('date_to'))
      getListShift({
        store_id: watch('store_id'),
        date_from: watch('date_from'),
        date_to: watch('date_to'),
        current_shift_id: watch('current_shift_id'),
        is_support: watch('current_store_id') !== watch('store_id') ? true : false,
        current_store_id: watch('current_store_id')
      }).then(setShifts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('store_id'), watch('current_shift_id'), watch('date_from'), watch('date_to')]);

  //Kiểm tra có được chọn khác miền không
  useEffect(() => {
    if (watch('transfer_shift_type_id')) {
      setDisabledBusiness(false);
      if (
        dataTransferShiftType.find((x) => x.transfer_shift_type_id === +watch('transfer_shift_type_id'))
          ?.is_another_business
      ) {
        setDisabledNewBusiness(false);
      } else {
        setDisabledNewBusiness(true);
      }
    } else setDisabledBusiness(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('transfer_shift_type_id')]);

  const loadTransferShiftType = (value) => {
    getListReview({
      transfer_shift_type_id: value,
    }).then((res) => setValue('list_review', res));
  };
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tên loại yêu cầu chuyển ca'>
              <FormSelect
                showSearch
                allowClear
                field='transfer_shift_type_id'
                list={mapDataOptions4SelectCustom(
                  dataTransferShiftType,
                  'transfer_shift_type_id',
                  'transfer_shift_type_name',
                )}
                validation={{
                  required: 'Loại tên yêu cầu chuyển ca là bắt buộc',
                }}
                onChange={(value) => {
                  setValue('transfer_shift_type_id', value);
                  loadTransferShiftType(value);
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Ngày chuyển ca'>
              <FormDateRange
                allowClear={true}
                fieldStart={'date_from'}
                fieldEnd={'date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                minDate={new Date()}
                format={'DD/MM/YYYY'}
                validation={{
                  required: 'Chọn ngày chuyển ca là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <div className='bw_col_12 bw_mb_2'>
              <h1 style={{ fontWeight: '700' }}>Ca hiện tại</h1>
            </div>
            <div className='bw_col_12'>
              <div className='bw_col_12'>
                <FormItem disabled={disabled || disabledBusiness} label='Miền' isRequired>
                  <FormSelect
                    showSearch
                    allowClear
                    // disabled={disabledBusiness}
                    field='current_business_id'
                    list={mapDataOptions4SelectCustom(businessOptions, 'id', 'name')}
                    validation={{
                      required: 'Miền chọn là bắt buộc',
                    }}
                  />
                </FormItem>
              </div>
              <div className='bw_col_12'>
                <FormItem disabled={disabled || !watch('current_business_id')} label='Cửa hàng' isRequired>
                  <FormSelect
                    showSearch
                    allowClear
                    // disabled={!watch('current_business_id')}
                    field='current_store_id'
                    list={mapDataOptions4SelectCustom(currentStore, 'store_id', 'store_name')}
                    validation={{
                      required: 'Cửa hàng chọn là bắt buộc',
                    }}
                  />
                </FormItem>
              </div>
              <div className='bw_col_12 '>
                <FormItem
                  disabled={disabled || !watch('current_store_id') || !watch('date_from') || !watch('date_to')}
                  label='Ca hiện tại'
                  isRequired>
                  <FormSelect
                    showSearch
                    allowClear
                    // disabled={!watch('current_store_id') || !watch('date_from') || !watch('date_to')}
                    field='current_shift_id'
                    list={mapDataOptions4SelectCustom(currentShifts, 'shift_id', 'shift_name')}
                    validation={{
                      required: 'Ca hiện tại chọn là bắt buộc',
                    }}
                  />
                </FormItem>
              </div>
            </div>
          </div>
          <div className='bw_col_6'>
            <div className='bw_col_12 bw_mb_2'>
              <h1 style={{ fontWeight: '700' }}>Ca chuyển</h1>
            </div>
            <div className='bw_col_12 '>
              <div className='bw_col_12'>
                <FormItem disabled={disabled || disabledBusiness || disabledNewBusiness} label='Miền' isRequired>
                  <FormSelect
                    showSearch
                    allowClear
                    // disabled={disabledBusiness || disabledNewBusiness}
                    field='business_id'
                    list={mapDataOptions4SelectCustom(businessOptions, 'id', 'name')}
                    validation={{
                      required: 'Miền chọn là bắt buộc',
                    }}
                  />
                </FormItem>
              </div>
              <div className='bw_col_12'>
                <FormItem disabled={disabled || !watch('business_id')} label='Cửa hàng' isRequired>
                  <FormSelect
                    showSearch
                    allowClear
                    // disabled={!watch('business_id')}
                    field='store_id'
                    list={mapDataOptions4SelectCustom(newStore, 'store_id', 'store_name')}
                    validation={{
                      required: 'Cửa hàng chọn là bắt buộc',
                    }}
                  />
                </FormItem>
              </div>
              <div className='bw_col_12'>
                <FormItem
                  disabled={
                    disabled ||
                    !watch('store_id') ||
                    !watch('date_from') ||
                    !watch('date_to') ||
                    currentShifts.length === 0
                  }
                  label='Ca chuyển'
                  isRequired>
                  <FormSelect
                    showSearch
                    allowClear
                    // disabled={
                    //   !watch('store_id') || !watch('date_from') || !watch('date_to') || currentShifts.length === 0
                    // }
                    field='new_shift_id'
                    list={mapDataOptions4SelectCustom(shifts, 'shift_id', 'shift_name')}
                    validation={{
                      required: 'Ca chuyển chọn là bắt buộc',
                    }}
                  />
                </FormItem>
              </div>
            </div>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Lý do chuyển' isRequired>
              <FormTextArea
                type='text'
                field='reason'
                validation={{
                  required: 'Nhập lý do chuyển là bắt buộc',
                }}
                placeholder='Nhập lý do chuyển'
              />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default TransferShiftInformation;
