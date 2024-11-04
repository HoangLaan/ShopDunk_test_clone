import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import React, { useCallback, useEffect, useState } from 'react';
import { getListFunctionGroup } from 'services/function.service';

const FunctionsInformation = ({ disabled }) => {
  const [dataListFunctionGroup, setDataListFunctionGroup] = useState([]);

  const loadFunctionGroup = useCallback(() => {
    getListFunctionGroup().then((data) => {
      let rs = data.filter(ele => ele.id != "60439")
      setDataListFunctionGroup(rs);
    });
  }, []);
  useEffect(loadFunctionGroup, [loadFunctionGroup]);

  return (
    <BWAccordion title='Thông tin quyền'>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Tên quyền'>
              <FormInput
                disabled={disabled}
                type='text'
                field='function_name'
                placeholder='Nhập tên quyền'
                validation={{
                  required: 'Tên quyền cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Mã hiệu quyền'>
              <FormInput
                disabled={disabled}
                type='text'
                field='function_alias'
                placeholder='Nhập mã hiệu quyền'
                validation={{
                  required: 'Mã hiệu quyền là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Nhóm quyền'>
              <FormSelect
                showSearch
                disabled={disabled}
                type='text'
                field='function_group_id'
                placeholder=''
                validation={{
                  required: 'Cần chọn nhóm quyền',
                }}
                list={(dataListFunctionGroup ?? []).map((_) => {
                  return {
                    label: _.name,
                    value: _.id,
                  };
                })}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Nhập mô tả'>
              <FormTextArea type='text' field='description' placeholder='Mô tả' />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default FunctionsInformation;
