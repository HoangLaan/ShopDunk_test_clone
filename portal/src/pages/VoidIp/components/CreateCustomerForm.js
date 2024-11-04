import FormSelect from "components/shared/BWFormControl/FormSelect";
import { CUSTOMER_TYPE } from "pages/CustomerType/utils/constants";
import React, { memo, useCallback, useEffect, useState } from "react";
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { createCustomer } from 'services/customer.service';
import CustomerLeadService from 'services/customer-lead.service';
import FormInput from "components/shared/BWFormControl/FormInput";
import FormItem from "components/shared/BWFormControl/FormItem";
import FormRadioGroup from "components/shared/BWFormControl/FormRadioGroup";
import { mapDataOptions4Select, showToast } from "utils/helpers";
import FormDebouneSelect from "components/shared/BWFormControl/FormDebouneSelect";
import { getOptionsSource } from "services/customer-of-task.service";
import FormDatePicker from "components/shared/BWFormControl/FormDate";
import { cns_source_id } from "../utils/helpers";

const customerObject = [
  {
    value: CUSTOMER_TYPE.INDIVIDUAL,
    label: 'Khách hàng cá nhân',
    apiFunction: createCustomer
  },
  {
    value: CUSTOMER_TYPE.LEADS,
    label: 'Khách hàng tiềm năng',
    apiFunction: CustomerLeadService.create
  }
]
const CreateCustomerForm = ({ phone_number, onClose, onRefresh, setTabActive, info, setFetchCustomer }) => {
  const optionsType = useGetOptions(optionType.customerType);
  const [optionsSource, setOptionsSource] = useState([
    {
      id: cns_source_id,
      label: 'Hotline',
      value: cns_source_id
    }
  ]);
  const [customer_type_id, setCustomer_type_id] = useState();
  const methods = useForm()

  // const customerTypeOptions = useGetOptions(optionType.customerType);
  // const customer_object_id = methods.watch('customer_object_id');
  // const _customerTypeOptions = customerTypeOptions.filter((x) => x.type_apply == methods.watch('customer_object_id'));

  const fetchOptionsSource = async () => await getOptionsSource();

  const loadData = useCallback(async () => {
    try {
      const source = await fetchOptionsSource();
      setOptionsSource(mapDataOptions4Select(source));
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  }, []);

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if(optionsType.length > 0){
      const _customerTypeIdOptions = optionsType?.filter((x) => x.type_apply === CUSTOMER_TYPE.LEADS);
      setCustomer_type_id(_customerTypeIdOptions?.[0]?.value);
    }
  }, [phone_number, customer_type_id, optionsType])

  useEffect(() => {
    methods.setValue('source_id', cns_source_id)
    methods.setValue('customer_object_id', CUSTOMER_TYPE.LEADS)
  }, [optionsSource])

  useEffect(() => {
    methods.setValue('phone_number', phone_number);
  }, [])

  const onSubmit = async (payload) => {
    try {
      setFetchCustomer(false);
      // const payload = methods.watch();
      payload.phone_number = phone_number;
      payload.is_active = 1;
      payload.is_system = 0;
      payload.full_name_customer = payload.full_name; //KH tiem nang
      payload.fullNameCustomer = payload.full_name; //Kh ca nhan
      payload.customer_type_id = customer_type_id;
      // payload.customer_type_id = 124; //fix cứng để fix sau

      const _ = customerObject.find(p => p?.value === payload.customer_object_id);
      
      await _.apiFunction(payload).then((resp) => { 
        showToast.success('Thêm mới thành công');
        onRefresh(); 
        setFetchCustomer(true);
        setTabActive(info.HISTORY_WORKFLOW)
      // onClose();
      }).catch((error) => {
        showToast.error(error.message)
      });
    } catch (error) {
      showToast.error(error.message)
    }
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
      <h5 style={{fontWeight: 'bold', textAlign: 'left'}}>Thêm mới khách hàng</h5>
      <div className='bw_items_frm'>
        <div className='bw_row bw_col_12'>
            <div className="bw_col_6">
              {/* <FormItem> */}
                    <FormRadioGroup
                    field='gender'
                    list={[
                        { value: 1, label: 'Anh' },
                        { value: 0, label: 'Chị' },
                    ]}
                />
              {/* </FormItem> */}
                <div className="bw_frm_box">
                    <label style={{textAlign: 'left'}}>Họ và tên: <span style={{color: 'red'}}>*</span></label>
                    <span>
                        <FormInput 
                          field='full_name' 
                          placeholder="Nhập họ và tên khách hàng" 
                          validation={{
                            required: 'Họ tên là bắt buộc'
                          }}
                        />
                    </span>
                    {/* {errorMsg?.err ? <span className="text_valiadte">{errorMsg?.err_msg}</span> : ''} */}
                </div>
                <div className="bw_frm_box">
                    <label style={{textAlign: 'left'}}>Số điện thoại <span style={{color: 'red'}}>*</span></label>
                    <span>
                        <FormInput 
                          field='phone_number' 
                          placeholder="Nhập số điện thoại khách hàng" 
                          validation={{
                            required: 'Số điện thoại là bắt buộc'
                          }}
                        />
                    </span>
                    {/* {errorMsg?.err && <span className="text_valiadte">{errorMsg?.err_msg}</span>} */}
                </div>
                <div className="bw_frm_box">
                    <label style={{textAlign: 'left'}}>Email:</label>
                    <span>
                        <FormInput field='email' placeholder="Nhập email khách hàng"
                         />
                    </span>
                </div>
                    
            </div>
            <div className="bw_col_6">
              <div className="bw_frm_box" style={{marginTop: '30px'}}>
                <label>Loại khách hàng: <span style={{color: 'red'}}>*</span></label>
                <FormSelect
                  placeholder="--Chọn loại khách hàng--"
                  className='bw_col_12'
                  field='customer_object_id'
                  list={customerObject}
                  validation={{
                    required: 'Cần loại khách hàng',
                  }}
                />
                {/* {errorMsg?.err && <span className="text_valiadte">{errorMsg?.err_msg}</span>} */}
              </div>
              <div className="bw_frm_box">
                <FormItem label='Ngày/Tháng/Năm sinh'>
                  <FormDatePicker
                    style={{
                      width: '100%',
                      padding: '2px 0px',
                    }}
                    placeholder='Nhập ngày sinh'
                    bordered={false}
                    field='birthday'
                    format='DD/MM/YYYY'
                  />
                </FormItem>
              </div>
              <div className="bw_frm_box">
                <label>Nguồn khách hàng: <span style={{color: 'red'}}>*</span>
                      <FormDebouneSelect
                          field='source_id'
                          fetchOptions={fetchOptionsSource}
                          allowClear={true}
                          placeholder='--Chọn--'
                          list={optionsSource}
                          validation={{
                              required: 'Nguồn là bắt buộc',
                          }}
                          onChange={(value) => {
                            methods.clearErrors('source_id');
                            methods.setValue('source_id', value.value || value.id);
                          }}
                      />
                </label>
                </div>
              <div className="bw_flex bw_justify_content_end">
                <button className="bw_btn_add_customer" >
                  Thêm mới
                </button>
              </div>
            </div>
            
          {/* <div className="bw_col_12">
            <div className="bw_frm_box  ">
              <label>Đối tượng khách hàng:</label>
              <FormSelect
                placeholder="--Chọn đối tượng khách hàng--"
                className='bw_col_12'
                field='customer_object_id'
                list={customerObject}
              />
            </div>
          </div> */}

          {/* <div className="bw_col_12">
            <div className="bw_frm_box  ">
              <label>Họ và tên:</label>
              <span>
                <FormInput field='full_name' placeholder="Nhập họ và tên khách hàng" />
              </span>
            </div>
          </div> */}

          {/* <div className="bw_col_12">
            <div className="bw_frm_box  ">
              <label>Hạng khách hàng:</label>
              <FormSelect
                field='customer_type_id'
                list={_customerTypeOptions}
                placeholder='Chọn hạng khách hàng'
                validation={{
                  required: 'Hạng khách hàng là bắt buộc',
                }}
              //disabled={disabled}
              />
            </div>
          </div> */}
          {/* <div className="bw_col_12">
            <button
              className="bw_btn bw_btn_success mr-2"
              type="button"
              onClick={onSubmit}>
              <span className="fi fi-rr-check">
              </span>Hoàn tất thêm mới khách hàng
            </button>
          </div> */}
        </div>
      </div>
      </form>
    </FormProvider>
  )
}

export default memo(CreateCustomerForm);