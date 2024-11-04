import React, { useCallback, useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import BWButton from 'components/shared/BWButton';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import CheckAccess from 'navigation/CheckAccess';
import styled from 'styled-components';
import moment from 'moment';
import { Tag } from 'antd';
import { useAuth } from 'context/AuthProvider';
import {
  getProductOptions,
  getOptionsSource,
  getListCustomer,
  getOptionsStore,
  getOptionsTaskWorkFlow,
  getConfig,
} from 'services/customer-of-task.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
import { getListStoreByUser } from '../../utils/call-api';
import CustomerAddModal from '../CustomerModel/CustomerAddModal';

const FromLabel = styled.div`
  font-weight: 500;
`;

const Info = ({ disabled, title, id }) => {
  const [customerOptions, setCustomerOptions] = useState([]);
  const [optionsSource, setOptionsSource] = useState([]);
  // const [optionsStore, setOptionsStore] = useState([]);
  const [optionsTaskWorkFlow, setOptionsTaskWorkFlow] = useState([]);
  const [config, setConfig] = useState([]);
  const { user } = useAuth();
  const [storeOpts, setStoreOpts] = useState([]);
  const [showModalAddCustomer, setShowModalCustomer] = useState(false);

  const { getValues, clearErrors, setValue, reset, watch } = useFormContext();

  const convertOptions = (options) => {
    return options?.map((p) => {
      return {
        label: p?.name,
        value: p?.id,
      };
    });
  };

  // Lấy danh sách customer
  const fetchCustomer = useCallback((value) => {
    return getListCustomer({
      search: value,
      itemsPerPage: 50,
    }).then((body) => {
      const _customerOpts = body.items.map((_res) => ({
        label: _res.customer_code + '-' + _res.full_name,
        value: Boolean(+_res.member_id) ? `KH${_res.member_id}` : `TN${_res.dataleads_id}`,
        ..._res,
      }));
      setCustomerOptions(_customerOpts);
      return _customerOpts;
    });
  }, []);
  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  //fetch user options
  const fetchProductOptions = useCallback((search) => getProductOptions({ search }), []);
  const fetchOptionsSource = () => getOptionsSource();
  const fetchOptionsStore = () => getOptionsStore();
  const fetchOptionsTaskWorkFlow = () => getOptionsTaskWorkFlow();

  const loadData = useCallback(async () => {
    try {
      const source = await fetchOptionsSource();
      // const store = await fetchOptionsStore();
      const task_work_flow = await fetchOptionsTaskWorkFlow();
      const config = await getConfig();
      setOptionsSource(mapDataOptions4Select(source));
      // setOptionsStore(mapDataOptions4Select(store));
      setOptionsTaskWorkFlow(mapDataOptions4Select(task_work_flow));
      setConfig(config);
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  }, []);

  const fetchStoreOpts = useCallback(
    (value, isFirst = false) => {
      return getListStoreByUser({
        search: value,
        is_active: 1,
        itemsPerPage: 200,
        page: 1,
      }).then((body) => {
        const _storeOpts = body?.items?.map((_store) => ({
          label: _store.store_name,
          value: _store.store_id,
          ..._store,
        }));

        setStoreOpts(_storeOpts);

        if (isFirst && _storeOpts?.length === 1) {
          setValue('store_id', _storeOpts[0]?.store_id);
          setValue('business_id', _storeOpts[0]?.business_id);
          setValue('business_name', _storeOpts[0]?.business_name);
          setValue('store_address', _storeOpts[0]?.address);
          setValue('store_name', _storeOpts[0]?.store_name);
        }
      });
    },
    [setValue],
  );

  useEffect(() => {
    fetchStoreOpts(null, true);
  }, [fetchStoreOpts]);

  const handleChangeStore = useCallback(
    (store_id) => {
      setValue('store_id', store_id);

      // Lấy store trong mảng
      let findStore = storeOpts.find((_store) => _store.value === store_id);
      // lưu giá trị business tìm dc
      setValue('business_id', findStore?.business_id);
      setValue('business_name', findStore?.business_name);
      setValue('store_address', findStore?.address);
      setValue('store_name', findStore?.store_name);

      clearErrors('store_id');

    },
    [storeOpts, setValue, watch, clearErrors],
  );
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <FormItem className='bw_col_12 bw_mt_2 bw_mr_2'>
          <FromLabel className='label bw_mb_1'>Ngày: {moment().format('HH:mm DD/MM/YYYY')}</FromLabel>
          {/* <FromLabel className="label">Nhân viên: {user.user_name} - {user.full_name}</FromLabel> */}
          <FromLabel className='label'>Nhân viên: {watch('employee')}</FromLabel>
        </FormItem>
        <FormItem label='Tên khách hàng hoặc Số điện thoại' className='bw_col_6' disabled={disabled} isRequired>
          <div className='bw_row' style={{ marginTop: '-10px' }}>
            <div className='bw_col_9'>
              <FormDebouneSelect
                field='customer_id'
                id='customer'
                allowClear={true}
                noCallApi={true}
                fetchOptions={fetchCustomer}
                list={convertOptions(customerOptions)}
                debounceTimeout={700}
                placeholder={'-- Tìm kiếm --'}
                onChange={(selectedValue, selectedOption) => {
                  reset({
                    ...getValues(),
                    customer_id: selectedValue,
                    customer: { ...selectedOption, ...selectedValue },
                    member_id: selectedOption?.member_id,
                    dataleads_id: selectedOption?.dataleads_id,
                  });
                  clearErrors('customer');
                }}
                validation={{
                  required: 'Khách hàng là bắt buộc',
                }}
              />
            </div>
            <div className='bw_col_3 bw_flex bw_justify_content_center bw_align_items_center'>
              {!disabled && (
                <CheckAccess permission={'CRM_CUSTOMEROFTASK_ADD'}>
                  <BWButton
                    type='success'
                    color='success'
                    icon='fi fi-rr-plus'
                    content='Thêm mới KH'
                    // onClick={(e) => {
                    //   window._$g.rdr(`/customer/add`);
                    // }}>
                    onClick={() => setShowModalCustomer(true)}>
                    </BWButton>
                </CheckAccess>
              )}
            </div>
          </div>
        </FormItem>

        <FormItem label='Nguồn' className='bw_col_6' disabled={disabled} isRequired>
          <FormDebouneSelect
            field='source_id'
            fetchOptions={fetchOptionsSource}
            allowClear={true}
            placeholder='--Chọn--'
            list={optionsSource}
            disabled={disabled}
            validation={{
              required: 'Nguồn là bắt buộc',
            }}
            onChange={(value) => {
              clearErrors('source_id');
              setValue('source_id', value.value || value.id);
            }}
          />
        </FormItem>

        <FormItem label='Ghi chú' className='bw_col_12' disabled={disabled}>
          <FormTextArea rows={1} field='description' placeholder='Nhập ghi chú' disabled={disabled} />
        </FormItem>
        <FormItem label='Sản phẩm quan tâm' className='bw_col_12' disabled={disabled}>
          <FormDebouneSelect
            placeholder='--Chọn--'
            field='care_product_list'
            fetchOptions={(keyword) => fetchProductOptions(keyword)}
            mode='multiple'
          />
        </FormItem>
      </div>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Phân loại khách hàng' isRequired>
            <FormDebouneSelect
              field='task_work_flow_id'
              fetchOptions={fetchOptionsTaskWorkFlow}
              allowClear={true}
              placeholder='--Chọn--'
              list={optionsTaskWorkFlow}
              disabled={disabled}
              onChange={(value) => {
                clearErrors('task_work_flow_id');
                setValue('task_work_flow_id', value.value || value.id);
              }}
              validation={{
                required: 'Phân loại khách hàng là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem label='Chi nhánh chuyển' className='bw_pt_1' disabled={disabled}>
            <FormDebouneSelect
              field='store_id'
              id='store_id'
              options={storeOpts}
              allowClear={true}
              style={{ width: '100%' }}
              fetchOptions={fetchStoreOpts}
              debounceTimeout={700}
              placeholder={'-- Chọn --'}
              onChange={(e) => {
                handleChangeStore(e?.value);
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem>
            {config && config.length > 0 && (
              <Tag
                color='processing'
                onClick={() => window._$g.rdr(`/task/edit/${config.find((p) => p?.name === 'TASKFORSHOP')?.id || ''}`)}
                style={{ cursor: 'pointer' }}>
                Công việc: {config.find((p) => p?.name === 'TASKFORSHOP')?.parent_id || ''}
              </Tag>
            )}
          </FormItem>
          <FormItem className='bw_mt_2'>
            {config && config.length > 0 && (
              <Tag
                color='processing'
                onClick={() =>
                  window._$g.rdr(`/task-type/edit/${config.find((p) => p?.name === 'TASKTYPEFORSHOP')?.id || ''}`)
                }
                style={{ cursor: 'pointer' }}>
                Loại công việc: {config.find((p) => p?.name === 'TASKTYPEFORSHOP')?.parent_id || ''}
              </Tag>
            )}
          </FormItem>
        </div>
      </div>

      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Ngày chuyển' disabled={disabled}>
            <FromLabel className='label bw_pt_1'>{watch('tranfer_date')}</FromLabel>
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Người chuyển' disabled={disabled}>
            <FromLabel className='label bw_pt_1'>{watch('tranfer_user')}</FromLabel>
          </FormItem>
        </div>
      </div>
      {showModalAddCustomer && (
        <CustomerAddModal
          onClose={() => setShowModalCustomer(false)}
          getOptsCustomer={fetchCustomer}
          setValueCustomer={(customer) => {
            setValue('customer', {
              ...customer,
              value: `TN${customer.dataleads_id}`,
              label: `${customer.customer_code}-${customer.full_name}`,
              member_id: +customer?.member_id,
              dataleads_id: +customer?.dataleads_id,
            });
            
            setValue('customer_id', {
              key: `TN${customer.dataleads_id}`, 
              label: `${customer.customer_code}-${customer.full_name}`, 
              value: `TN${customer.dataleads_id}`
            })

            // clearErrors('customer');
            // clearErrors('customer_id');
          }}
        />
      )}
    </BWAccordion>
  );
};

export default Info;
