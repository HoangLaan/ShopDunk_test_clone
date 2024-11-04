import React, { useEffect, useForm, useState, useCallback } from 'react';
//until
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { generateGroupCode } from '../../helpers/call-api'
import { getListOptions } from 'services/group-care-service.service'
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';


export default function GroupServiceInfo({ disabled }) {
  const methods = useFormContext();
  const { watch, setValue, clearErrors } = methods;
  const [optionsGroupService, setOptionsGroupService] = useState(null);



  const initGroupService = useCallback(() => {
    if (!watch('group_service_code')) {
      generateGroupCode()
        .then((data) => {
          methods.reset({
            group_service_code: data
          });
        })
    }
  }, []);
  useEffect(initGroupService, [initGroupService]);

  const getDataOptions = async () => {
    const keyword = watch('parent_id');
    let listParent = await getListOptions(keyword);
    setOptionsGroupService(mapDataOptions4Select(listParent));
  };

  useEffect(() => {
    getDataOptions();
  }, []);

  return (
    <BWAccordion title='Thông tin nhóm dịch vụ' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Mã nhóm dịch vụ' isRequired={true}>
            <FormInput
              type='text'
              field='group_service_code'
              placeholder='Mã nhóm dịch vụ'
              validation={{
                required: 'Mã nhóm dịch vụ là bắt buộc',
              }}
              disabled={true}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Nhóm dịch vụ cha'>
          <FormSelect
              field={'parent_id'}
              value={(optionsGroupService || []).find(item => item.code === methods.watch('parent_id'))}
              list={optionsGroupService}
              allowClear
              // onChange={(selectedValue) => {
              //   if (selectedValue === undefined || selectedValue === 0) {
              //     // Clear the value when selectedValue is undefined or null
              //     setValue('parent_id', 0);
              //   }
              // }}
              disabled={disabled}
            />


          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Tên nhóm dịch vụ' isRequired={true}>
            <FormInput
              type='text'
              field='group_service_name'
              placeholder='Tên nhóm dịch vụ'
              validation={{
                required: 'Tên nhóm dịch vụ là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Thứ tự hiển thị' isRequired={true}>
            <FormInput
              type='number'
              field='order_index'
              placeholder='Thứ tự hiển thị'
              validation={{
                required: 'Vui lòng nhập kiểu số',
                pattern: {
                  value: /^\d+$/,
                  message: 'Vui lòng nhập kiểu số'
                }
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        {/* <FormItem label='Ngôn ngữ' isRequired={true}>
          <FormSelect
            field='company_id'
            value={(optionsLanguage || []).find(item => item.id === methods.watch('language_id'))}
            list={optionsLanguage}
            // validation={{
            //   required: 'Ngôn ngữ là bắt buộc',
            // }}
            disabled={disabled}
          />
        </FormItem> */}
      </div>
    </BWAccordion>
  );
}
