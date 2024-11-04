import FormSelect from "components/shared/BWFormControl/FormSelect";
import { CUSTOMER_TYPE } from "pages/CustomerType/utils/constants";
import React, { useEffect } from "react";
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { useFormContext } from "react-hook-form";
import { createCustomer } from 'services/customer.service';
import CustomerLeadService from 'services/customer-lead.service';
import FormInput from "components/shared/BWFormControl/FormInput";
import FormItem from "components/shared/BWFormControl/FormItem";
import FormRadioGroup from "components/shared/BWFormControl/FormRadioGroup";


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
const CustomerForm = ({ phone_number, onClose, onRefresh }) => {
  console.log(phone_number);
  const methods = useFormContext()
  const customerTypeOptions = useGetOptions(optionType.customerType);
  const customer_object_id = methods.watch('customer_object_id');
  const _customerTypeOptions = customerTypeOptions.filter((x) => x.type_apply == methods.watch('customer_object_id'));
  console.log(customerTypeOptions);

  useEffect(() => {
    methods.setValue('customer_type_id', _customerTypeOptions[0]?.id)
  }, [customer_object_id]);

  const onSubmit = async () => {
    try {
      const payload = methods.watch();
      payload.phone_number = phone_number;
      payload.is_active = 1;
      payload.is_system = 0;
      const _ = customerObject.find(p => p?.value === payload.customer_object_id);
      await _.apiFunction(payload);
      onRefresh();
      onClose();
    } catch (error) {
      console.log(error)
    }
  };
  console.log(methods.watch())
  return (
    <React.Fragment>
      <div className='bw_items_frm'>
        <div className='bw_row'>
          <div className="bw_col_12">
            <div className="bw_frm_box  ">
              <label>Đối tượng khách hàng:</label>
              <FormSelect
                placeholder="--Chọn đối tượng khách hàng--"
                className='bw_col_12'
                field='customer_object_id'
                list={customerObject}
              />
            </div>
          </div>

          <div className="bw_col_12">
            <div className="bw_frm_box  ">
              <label>Họ và tên:</label>
              <span>
                <FormInput field='full_name' placeholder="Nhập họ và tên khách hàng" />
              </span>
            </div>
          </div>

          <div className="bw_col_12">
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
          </div>
          <FormItem className="bw_col_12" label='Giới tính' isRequired={true}>
            <FormRadioGroup
              field='gender'
              list={[
                { value: 1, label: 'Nam' },
                { value: 0, label: 'Nữ' },
              ]}
            />
          </FormItem>
          <div className="bw_col_12">
            <button
              className="bw_btn bw_btn_success mr-2"
              type="button"
              onClick={onSubmit}>
              <span className="fi fi-rr-check">
              </span>Hoàn tất thêm mới khách hàng
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default CustomerForm;