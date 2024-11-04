import moment from 'moment';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { getListCdrs, getVoipExt } from 'services/voip.services';
import { Empty, Tag } from 'antd';
import DataTable from 'components/shared/DataTable';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { defaultPaging, mapDataOptions4Select, showToast } from 'utils/helpers';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import BWAccordion from 'components/shared/BWAccordion';
import { getProductOptions } from 'services/task.service';
import { getListStoreByUser } from 'pages/CustomerOfTask/utils/call-api';
import styled from 'styled-components';
import { create, getById, getConfig, getListCustomer, getOptionsSource, getOptionsTaskWorkFlow, update } from 'services/customer-of-task.service';
import { DefaultValue } from 'pages/CustomerOfTask/utils/constant';
import { cns_source_id, form_work_flow } from '../utils/helpers';
const defaultParam = {
  is_active: 1,
  page: 1,
  itemsPerPage: 15,
};

const FromLabel = styled.div`
  font-weight: 500;
`;

const HistoryWorkFlow = ({ dataTask, onRefresh, phone_number, fetchCustomerStatus, setFormWorkFlow, formWorkFlow }) => {
  const formDataWFlow = JSON.parse(localStorage.getItem(form_work_flow));
  const methods = useForm({
    defaultValues: DefaultValue,
  });
  const { getValues, clearErrors, setValue, reset, watch, handleSubmit } = methods;
  
    const [config, setConfig] = useState([]);
    const [storeOpts, setStoreOpts] = useState([]);
    const [optionsSource, setOptionsSource] = useState([
      {
        id: cns_source_id,
        label: 'Hotline',
        value: cns_source_id
      }
    ]);
    const [optionsTaskWorkFlow, setOptionsTaskWorkFlow] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [prodOpts, setProdOpts] = useState([]);

    const fetchOptionsSource = () => getOptionsSource();
    const fetchOptionsTaskWorkFlow = () => getOptionsTaskWorkFlow();

    // const loadDetail = useCallback(() => {
    //   console.log('dataTask', dataTask);
    //     if (dataTask?.task_detail_id) {
    //         getById(dataTask.task_detail_id).then((value) => {
    //         methods.reset({
    //             ...value,
    //         });
    //         });
    //     } else {
    //         methods.reset(DefaultValue);
    //         methods.setValue('source_id', 41)
    //     }
    // }, [dataTask, methods]);

    // useEffect(loadDetail, [loadDetail]);

    const convertOptions = (options) => {
        return options?.map((p) => {
          return {
            label: p?.name,
            value: p?.id,
          };
        });
      };

    const loadData = useCallback(async () => {
        try {
          const source = await fetchOptionsSource();
          const task_work_flow = await fetchOptionsTaskWorkFlow();
          const config = await getConfig();
          setOptionsSource(mapDataOptions4Select(source));
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

      const handleChangeStore = useCallback(
        (store_id) => {
          setValue('store_id', store_id);
          clearErrors('store_id');    
        },
        [storeOpts, setValue, watch, clearErrors],
      );

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

      useEffect(() => {
        fetchStoreOpts(null, true);
      }, [fetchStoreOpts]);

      useEffect(() => {
        loadData();
      }, [loadData]);

    const fetchProductOptions = useCallback((search) => getProductOptions({ search }).then((body) => {
      const _prodOpt = body.map(_prod => ({
        label: _prod.name,
        value: _prod.id,
        id: _prod.id
      }))

      setProdOpts(_prodOpt);
    }), []);

    useEffect(() => {
      if(formDataWFlow?.care_product_list?.length > 0){
        fetchProductOptions()
      }
    }, [fetchProductOptions])

  const onSubmitForm = async (payload) => {
    delete payload.task_detail_id;
    payload.member_id =
        (payload.member_id !== null ? +payload.member_id : undefined) ||
        (payload?.customer?.member_id !== null ? +payload?.customer?.member_id : undefined);
      payload.dataleads_id = payload.dataleads_id !== null ? +payload.dataleads_id : undefined;
      
    // if (dataTask?.task_detail_id) {
      const { store_id, source_id, task_work_flow_id, customer, task_id } = payload;
      payload.task_work_flow_id = task_work_flow_id?.value !== undefined ? task_work_flow_id.value : payload.task_work_flow_id !== undefined ? payload.task_work_flow_id : null;
      payload.source_id = source_id?.value !== undefined ? source_id.value : payload.source_id !== undefined ? payload.source_id : null;
      payload.store_id = store_id?.value !== undefined ? store_id.value : payload.store_id !== undefined ? payload.store_id : null;
      payload.task_id = task_id?.value !== undefined ? task_id.value : payload.task_id !== undefined ? payload.task_id : null;
      payload.member_id = customer?.member_id || payload?.member_id;
      payload.dataleads_id = customer?.dataleads_id || payload?.dataleads_id;
    //   await update({ task_detail_id: dataTask?.task_detail_id, ...payload })
    //   .then(() => {
    //     loadDetail();
    //     onRefresh();
    //     showToast.success(`Cập nhật thành công !`);
    //   }).catch((err) => {
    //     showToast.error(err.message);
    //   })
    // } else {
      await create(payload)
      .then(() => {
        onRefresh();
        methods.setValue('description', undefined);
        methods.setValue('task_work_flow_id', undefined);
        methods.setValue('care_product_list', undefined);
        methods.setValue('store_id', undefined);
        setFormWorkFlow(undefined);
        localStorage.removeItem(form_work_flow);
        showToast.success(`Thêm mới thành công !`);
      }).catch((err) => {
        showToast.error(err.message);
      })
    // }

  }

  useEffect(() => {
    // methods.setValue('source_id', 41) //fix cứng source id
    getListCustomer({
      search: phone_number,
      itemsPerPage: 1,
    }).then((resp) => {
      const bodyCustomer = resp.items[0];
      if(bodyCustomer){
        methods.reset({
          ...getValues(),
          customer_id: {
            key: Boolean(+bodyCustomer.member_id) ? `KH${bodyCustomer.member_id}` : `TN${bodyCustomer.dataleads_id}`,
            label: bodyCustomer?.customer_code + '-' + bodyCustomer?.full_name,
            value: Boolean(+bodyCustomer.member_id) ? `KH${bodyCustomer.member_id}` : `TN${bodyCustomer.dataleads_id}`
          },
          source_id: 41,
          dataleads_id: bodyCustomer.dataleads_id,
          member_id: bodyCustomer.member_id,
        })
        //Nếu lưu ở localStorage -> get value
        if(formDataWFlow){
          Object.entries(formDataWFlow).forEach(([key, value]) => {
            methods.setValue(key, value);
          })
        } else { //Nếu không thì default khi vào là undefined
          methods.setValue('description', undefined);
          methods.setValue('task_work_flow_id', undefined);
          methods.setValue('care_product_list', undefined);
          methods.setValue('store_id', undefined);
        }
      } else { //default khi là form khách hàng mới
        methods.setValue('description', null);
        methods.setValue('task_work_flow_id', null);
        methods.setValue('care_product_list', null);
        methods.setValue('store_id', null);
        methods.setValue('customer_id', null);
        methods.setValue('source_id', 41);
      }
    })
  }, [phone_number, fetchCustomerStatus])

  return (
    <React.Fragment>
        <BWAccordion title={'Thông tin khách hàng thuộc công việc'} >
        <FormProvider {...methods}>
        <form className='bw_flex' onSubmit={handleSubmit(onSubmitForm)}>
            <div className='bw_col_6'>
                <FormItem>
                    <div className='label bw_mb_1'>Ngày: {moment().format('HH:mm DD/MM/YYYY')}</div>
                </FormItem>

                <FormItem
                    label='Khách hàng'
                >
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
                        setFormWorkFlow({
                          ...getValues(),
                          customer_id: selectedValue,
                          customer: { ...selectedOption, ...selectedValue },
                          member_id: selectedOption?.member_id,
                          dataleads_id: selectedOption?.dataleads_id,
                        })
                        }}
                        validation={{
                        required: 'Khách hàng là bắt buộc',
                        }}
                    />
                </FormItem>

                <FormItem label='Nguồn' isRequired>
                  <FormDebouneSelect
                      field='source_id'
                      fetchOptions={fetchOptionsSource}
                      allowClear={true}
                      placeholder='--Chọn--'
                      options={optionsSource}
                      validation={{
                          required: 'Nguồn là bắt buộc',
                      }}
                      onChange={(value) => {
                      clearErrors('source_id');
                      setValue('source_id', value.value || value.id);
                      setFormWorkFlow({
                        ...formWorkFlow,
                        source_id: value.value || value.id
                      })
                      }}
                  />
                </FormItem>

                <FormItem label='Phân loại khách hàng' isRequired>
                  <FormDebouneSelect
                    field='task_work_flow_id'
                    fetchOptions={fetchOptionsTaskWorkFlow}
                    allowClear={true}
                    placeholder='--Chọn--'
                    options={optionsTaskWorkFlow}
                    onChange={(value) => {
                      clearErrors('task_work_flow_id');
                      setValue('task_work_flow_id', value.value || value.id);
                      setFormWorkFlow({
                        ...formWorkFlow,
                        task_work_flow_id: value.value || value.id
                      })
                    }}
                    validation={{
                      required: 'Phân loại khách hàng là bắt buộc',
                    }}
                  />
                </FormItem>

                <FormItem label='Ghi chú'>
                    <FormTextArea 
                      rows={1} 
                      field='description' 
                      placeholder='Nhập ghi chú' 
                      onChange={(event) => {
                        setFormWorkFlow({
                          ...formWorkFlow,
                          description: event.target.value
                        })
                      }}  
                    />
                </FormItem>

            </div>
            <div className='bw_col_6'>
                <FormItem>
                <Tag
                    color='processing'
                    onClick={() => window._$g.rdr(`/task/edit/${config.find((p) => p?.name === 'TASKFORSHOP')?.id || ''}`)}
                    style={{ cursor: 'pointer' }}>
                    Công việc: {config.find((p) => p?.name === 'TASKFORSHOP')?.parent_id || ''}
                </Tag>
                </FormItem>
                <FormItem className='bw_mt_2'>
                    <Tag
                        color='processing'
                        onClick={() =>
                        window._$g.rdr(`/task-type/edit/${config.find((p) => p?.name === 'TASKTYPEFORSHOP')?.id || ''}`)
                        }
                        style={{ cursor: 'pointer' }}>
                        Loại công việc: {config.find((p) => p?.name === 'TASKTYPEFORSHOP')?.parent_id || ''}
                    </Tag>
                </FormItem>
                <FormItem label='Sản phẩm quan tâm'>
                    <FormDebouneSelect
                        placeholder='--Chọn--'
                        field='care_product_list'
                        fetchOptions={(keyword) => fetchProductOptions(keyword)}
                        mode='multiple'
                        options={prodOpts}
                        onChange={(value) => {
                          setFormWorkFlow({
                            ...formWorkFlow,
                            care_product_list: value.map(item => item.value || item.id)
                          })
                        }}
                    />
                </FormItem>
                <FormItem label='Chi nhánh chuyển' className='bw_pt_1' >
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
                            setFormWorkFlow({
                              ...formWorkFlow,
                              store_id: e?.value
                            })
                        }}
                    />
                </FormItem>
                <div>
                    <button type='submit' className='bw_btn_save_work_flow'>
                        Lưu thông tin
                    </button>
                </div>
            </div>
        </form>
        </FormProvider>
        </BWAccordion>
    </React.Fragment>
  );
};

export default HistoryWorkFlow;
