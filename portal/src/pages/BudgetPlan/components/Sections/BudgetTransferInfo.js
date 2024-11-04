import React, { useCallback, useEffect, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { mapDataOptions4SelectCustom } from '../../../../utils/helpers';
import FormSelect from '../../../../components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
import DetailTransferTable from '../Table/DetailTransferTable';
import { getBudgetByDepartment, getBudgetPlanDetailByID } from 'services/budget-plan.service';

function BudgetTransferInfo() {
  const { id } = useParams();
  const methods = useFormContext();
  const { watch, setValue, reset } = methods;

  const [infoBudget, setInfoBudget] = useState([]);
  const [departmentOpts, setDepartmentOpts] = useState([]);
  const [budgetOpts, setBudgetOpts] = useState([]);

  const innitRender = useCallback(async () => {
    const data = await getBudgetPlanDetailByID(id);
    setInfoBudget(data);
    setDepartmentOpts(mapDataOptions4SelectCustom(data.departments || [], 'department_id', 'department_name'));
  }, [id]);

  useEffect(innitRender, [innitRender]);

  const getBudgetOptsByDepartment = useCallback(() => {
    if (watch('department'))
      getBudgetByDepartment(id, { department: watch('department') }).then((res) => {
        setBudgetOpts(mapDataOptions4SelectCustom(res, 'budget_id', 'budget_name'));
      });
  }, [watch('department')]);

  useEffect(getBudgetOptsByDepartment, [getBudgetOptsByDepartment]);

  const resetTable = useCallback(() => {
    setValue('budget_transfer_list', []);
  }, [watch('department'), watch('budget_id_from'), watch('budget_id_to')]);
  useEffect(resetTable, [resetTable]);
  return (
    <BWAccordion title='Thông tin chuyển đổi'>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem className='bw_col_12' label='Công ty' disabled={true}>
            {infoBudget?.company_name}
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem className='bw_col_12' label='Tên kế hoạch ngân sách' disabled={true}>
            {infoBudget?.budget_plan_name}
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Phòng ban chuyển' className='bw_col_12' isRequired={true}>
            <FormSelect
              field='department'
              id='transfer_department'
              list={departmentOpts}
              validation={{
                required: 'Phòng ban chuyển là bắt buộc.',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Phòng ban nhận' className='bw_col_12' isRequired={true} disabled={true}>
            <FormSelect field='department' list={departmentOpts} />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mã ngân sách' className='bw_col_12' isRequired={true}>
            <FormSelect
              field='budget_id_from'
              id='budget_id_from'
              list={budgetOpts}
              allowClear={true}
              validation={{
                required: 'Mã ngân sách chuyển là bắt buộc.',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mã ngân sách' className='bw_col_12' isRequired={true}>
            <FormSelect
              field='budget_id_to'
              id='budget_id_to'
              list={budgetOpts}
              allowClear={true}
              validation={{
                required: 'Mã ngân sách nhận là bắt buộc.',
              }}
            />
          </FormItem>
        </div>
      </div>
      <DetailTransferTable
        idPlan={id}
        disabled={!(watch('budget_id_from') && watch('budget_id_to') && watch('department'))}
      />
    </BWAccordion>
  );
}

export default BudgetTransferInfo;
