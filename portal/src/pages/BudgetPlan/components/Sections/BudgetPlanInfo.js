import React, { useCallback, useEffect, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { mapDataOptions4SelectCustom, showToast } from "../../../../utils/helpers";
import FormSelect from "../../../../components/shared/BWFormControl/FormSelect";
import { getOptionsDepartment } from "../../../../services/department.service";
import { useFormContext } from "react-hook-form";
import ErrorMessage from "../../../../components/shared/BWFormControl/ErrorMessage";
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { getListCompanyOpts, getOptionsTreeView } from 'pages/BudgetPlan/helper/call-api';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

function BudgetPlanInfo({ disabled, title, id }) {

  const methods = useFormContext();
  const { watch, formState: { errors }, clearErrors } = methods;

  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [companyOpts, setCompanyOpts] = useState([])

  const initData = async () => {
    try {
      let dataCompany = await getListCompanyOpts()
      setCompanyOpts(mapDataOptions4SelectCustom(dataCompany))
    } catch (error) {
      showToast.error(error.message);
    }
  }

  useEffect(() => {
    initData()
  }, [])

  const getDepartment = useCallback(() => {
    if (watch('company_id'))
      getOptionsDepartment({ "company_id": watch('company_id') }).then((res) =>
        setDepartmentOptions(mapDataOptions4SelectCustom(res))
      );
  }, [watch('company_id')])

  useEffect(getDepartment, [getDepartment]);

  const validateDateRange = (startMonth, startYear, endMonth, endYear) => {
    if (startMonth === endMonth && startYear < endYear) {
      return false
    }
    if (endYear > startYear || (endYear === startYear && endMonth >= startMonth)) {
      const monthDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
      return monthDiff <= 12;
    }
    return false;
  };

  const sliceString = (str, sub, position) => {
    let result = str.slice(0, position) + sub + str.slice(position)
    return result
  }

  const budget_plan_date_from = watch('budget_plan_date_from') ? sliceString(watch('budget_plan_date_from'), '/01', 2) : null
  const budget_plan_date_to = watch('budget_plan_date_to') ? sliceString(watch('budget_plan_date_to'), '/01', 2) : null

  useEffect(() => {
    const from_month = new Date(budget_plan_date_from).getMonth() + 1
    const from_year = new Date(budget_plan_date_from).getFullYear()
    const to_month = new Date(budget_plan_date_to).getMonth() + 1
    const to_year = new Date(budget_plan_date_to).getFullYear()

    if (!validateDateRange(from_month, from_year, to_month, to_year) && budget_plan_date_from && budget_plan_date_to) {
      errors["dateRange"] = 'Kế hoạch ngân sách không được vượt quá 12 tháng'
    } else {
      clearErrors("dateRange")
    }
  }, [budget_plan_date_from, budget_plan_date_to])

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem className='bw_col_12' label='Công ty' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              list={companyOpts}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem className='bw_col_12' label='Tên kế hoạch ngân sách' isRequired={true} disabled={disabled}>
            <FormInput
              field='budget_plan_name'
              placeholder='Nhập tên kế hoạch ngân sách'
              validation={{
                required: 'Tên kế hoạch ngân sách là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Phòng ban duyệt' className='bw_col_12' isRequired={true}>
            {/* <div className='bw_frm_box'>
              <label className="bw_checkbox bw_auto_confirm">
                <FormInput type='checkbox'
                  field='is_apply_all_department'
                  value={watch('is_apply_all_department')}
                  disabled={disabled} />
                <span></span>
                Áp dụng cho tất cả phòng ban
              </label>
            </div> */}
            {/* {!watch('is_apply_all_department') &&
            } */}
            <FormSelect
              field='departments'
              id='departments'
              list={departmentOptions}
              allowClear={true}
              mode={'tags'}
              validation={{
                required: 'Phòng ban là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Mã ngân sách' className='bw_col_12' isRequired={true}>
            <FormTreeSelect
              field='budgets'
              id='budgets'
              allowClear={true}
              treeDataSimpleMode
              fetchOptions={getOptionsTreeView}
              placeholder="--Chọn--"
              multiple
              validation={{
                required: 'Mã ngân sách là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Từ tháng' className='bw_col_12' isRequired={true}>
            <FormDatePicker
              field='budget_plan_date_from'
              validation={{ required: 'Tháng bắt đầu là bắt buộc' }}
              placeholder={'MM/YYYY'}
              style={{
                width: '100%',
              }}
              format='MM/YYYY'
              bordered={false}
              disabled={disabled}
              picker="month"
              id='budget_plan_date_from'
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Đến tháng' className='bw_col_12' isRequired={true}>
            <FormDatePicker
              field='budget_plan_date_to'
              validation={{ required: 'Tháng đến là bắt buộc' }}
              placeholder={'MM/YYYY'}
              style={{
                width: '100%',
              }}
              format='MM/YYYY'
              bordered={false}
              disabled={disabled}
              picker="month"
              id='budget_plan_date_to'
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <div className='bw_col_12'>
            {errors['dateRange'] && <ErrorMessage message={errors?.dateRange} />}
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export default BudgetPlanInfo;
