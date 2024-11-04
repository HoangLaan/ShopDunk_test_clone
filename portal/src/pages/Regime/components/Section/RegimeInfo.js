import React, {useEffect, useState} from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import {mapDataOptions4SelectCustom} from "utils/helpers";
import FormSelect from "components/shared/BWFormControl/FormSelect";
import FormRangePicker from "components/shared/BWFormControl/FormDateRange";
import {useDispatch, useSelector} from "react-redux";
import {getOptionsGlobal} from "actions/global";
import {useFieldArray, useFormContext} from "react-hook-form";
import {getListReviewRegimeType} from "services/regime.service";
import {useAuth} from "context/AuthProvider";

function RegimeInfo({id = null, disabled, title}) {
  const dispatch = useDispatch();
  const methods = useFormContext()
  const {user} = useAuth()
  const {setValue, watch, formState: {errors}} = methods
  const [departmentName, setDepartmentName] = useState(null)
  useEffect(() => {
    dispatch(getOptionsGlobal('regimeType'))
    dispatch(getOptionsGlobal('department'))
  }, [])
  const {regimeTypeData, departmentData} = useSelector(state => state.global)

  useEffect(() => {
    setDepartmentName(departmentData?.find((i) => i?.id == user?.department_id)?.name)
  }, [departmentData])

  useEffect(() => {
    getListReviewRegimeType({regime_code: watch("regime_type_id")}).then((res) => {
      setValue("regime_review_list", res || [])
    })
  }, [watch("regime_type_id")])

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Loại chế độ' disabled={disabled}>
            <FormSelect
              field='regime_type_id'
              list={mapDataOptions4SelectCustom(regimeTypeData)}
              validation={{
                required: 'Loại chế độ là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_4'>
          <FormItem label='Thời gian đăng ký' disabled={true}>
            {id ? watch("created_date") : new Date().toUTCString()}
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Người đăng ký' disabled={true}>
            {id ? watch("created_user") : user.full_name}
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Phòng ban' disabled={true}>
            {id ? watch("department_name") : departmentName}
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Tên chế độ' disabled={disabled}>
            <FormInput
              field='regime_name'
              placeholder='Nhập tên chế độ'
              validation={{
                required: 'Tên chế độ là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Khoảng thời gian' isRequired={true} disabled={disabled}>
            <FormRangePicker
              style={{width: '100%'}}
              fieldStart='from_date'
              fieldEnd='to_date'
              validation={{
                required: 'Thời gian hưởng chế độ là bắt buộc',
              }}
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'DD/MM/YYYY'}
              allowClear={true}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default RegimeInfo;
