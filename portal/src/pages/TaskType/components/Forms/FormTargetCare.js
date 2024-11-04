import React, { Fragment } from 'react';
import { useFormContext } from 'react-hook-form';

import FormCheckboxCare from '../Shared/FormCheckboxCare';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

import FormItemCheckbox from '../Shared/FormItemCheckbox';
import { TYPE_TIME_NOT_BUYING_OPTIONS } from 'pages/TaskType/utils/constants';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

function FormTargetCare({ disabled }) {
  const methods = useFormContext();

  const taskWorkFlowOptions = useGetOptions(optionType.taskWorkFlow);
  const productModelOptions = useGetOptions(optionType.productModel, { valueAsString: true });

  return (
    <Fragment>
      <div className='bw_collapse_title bw_mb_1'>
        <h3>Chỉ tiêu chăm sóc</h3>
      </div>
      <div className='bw_row bw_mb_1'>
        <div className='bw_col_12'>
          <FormItemCheckbox label='Sinh nhật trong tháng'>
            <FormInput disabled={disabled} type='checkbox' field='is_birthday' />
          </FormItemCheckbox>
        </div>
        <div className='bw_col_12'>
          <FormItemCheckbox label='Sinh nhật người thân'>
            <FormInput disabled={disabled} type='checkbox' field='is_birthday_relatives' />
          </FormItemCheckbox>
        </div>
      </div>
      {/* <FormCheckboxCare label='Tổng số lần mua hàng từ'>
        <FormInput disabled={disabled} type='checkbox' field='is_number_of_buying' />
        <FormNumber
          disabled={disabled || !methods.watch('is_number_of_buying')}
          field='value_number_of_buying_from'
          bordered={true}
        />
        <FormNumber
          disabled={disabled || !methods.watch('is_number_of_buying')}
          field='value_number_of_buying_to'
          bordered={true}
        />
      </FormCheckboxCare>
      <FormCheckboxCare label='Sau lần mua hàng gần nhất'>
        <FormInput disabled={disabled} type='checkbox' field='is_time_not_buying' />
        <FormNumber
          disabled={disabled || !methods.watch('is_time_not_buying')}
          field='value_time_not_buying'
          bordered={true}
        />
        <FormSelect
          disabled={disabled || !methods.watch('is_time_not_buying')}
          field='type_time_not_buying'
          bordered={true}
          list={TYPE_TIME_NOT_BUYING_OPTIONS}
        />
      </FormCheckboxCare>
      <FormCheckboxCare label='Thời gian mua hàng từ'>
        <FormInput disabled={disabled} type='checkbox' field='is_final_buy' />
        <FormDatePicker
          field='time_final_buy_from'
          placeholder={'dd/mm/yyyy'}
          format='DD/MM/YYYY'
          bordered={true}
          allowClear
          className='bw_form_bordered'
          disabled={disabled || !methods.watch('is_final_buy')}
        />
        <FormDatePicker
          field='time_final_buy_to'
          placeholder={'dd/mm/yyyy'}
          format='DD/MM/YYYY'
          bordered={true}
          allowClear
          className='bw_form_bordered'
          disabled={disabled || !methods.watch('is_final_buy')}
        />
      </FormCheckboxCare>
      <FormCheckboxCare label='Sau lần chăm sóc gần nhất'>
        <FormInput disabled={disabled} type='checkbox' field='is_after_the_last_care' />
        <FormNumber
          disabled={disabled || !methods.watch('is_after_the_last_care')}
          field='value_after_the_last_care'
          bordered={true}
        />
        <FormSelect
          disabled={disabled || !methods.watch('is_after_the_last_care')}
          field='type_after_the_last_care'
          bordered={true}
          list={TYPE_TIME_NOT_BUYING_OPTIONS}
        />
      </FormCheckboxCare>
      <FormCheckboxCare label='Tổng tiền chi tiêu'>
        <FormInput disabled={disabled} type='checkbox' field='is_total_money_spending' />
        <FormNumber
          disabled={disabled || !methods.watch('is_total_money_spending')}
          field='value_total_money_spending_from'
          bordered={true}
          addonAfter='triệu'
        />
        <FormNumber
          disabled={disabled || !methods.watch('is_total_money_spending')}
          field='value_total_money_spending_to'
          bordered={true}
          addonAfter='triệu'
        />
      </FormCheckboxCare>
      <FormCheckboxCare label='Số điểm tích lũy đạt'>
        <FormInput disabled={disabled} type='checkbox' field='is_total_current_point' />
        <FormNumber
          disabled={disabled || !methods.watch('is_total_current_point')}
          field='value_total_current_point_from'
          bordered={true}
          addonAfter='điểm'
        />
        <FormNumber
          disabled={disabled || !methods.watch('is_total_current_point')}
          field='value_total_current_point_to'
          bordered={true}
          addonAfter='điểm'
        />
      </FormCheckboxCare>
      <FormCheckboxCare label='Sau thăng hạng khách hàng'>
        <FormInput disabled={disabled} type='checkbox' field='is_after_upgrade' />
        <FormNumber
          disabled={disabled || !methods.watch('is_after_upgrade')}
          field='value_date_after_upgrade'
          bordered={true}
          addonAfter='ngày'
        />
      </FormCheckboxCare>
      <FormCheckboxCare label='Có bước xử lý công việc'>
        <FormInput disabled={disabled} type='checkbox' field='is_current_workflow' />
        <FormSelect
          disabled={disabled || !methods.watch('is_current_workflow')}
          field='task_workflow_id'
          bordered={true}
          list={taskWorkFlowOptions}
        />
      </FormCheckboxCare>
      <FormCheckboxCare label='Sản phẩm mới phù hợp với sở thích'>
        <FormInput disabled={disabled} type='checkbox' field='is_product_hobbies' />
        <FormSelect
          disabled={disabled || !methods.watch('is_product_hobbies')}
          mode='multiple'
          field='model_list'
          bordered={true}
          list={productModelOptions}
        />
      </FormCheckboxCare> */}
    </Fragment>
  );
}

export default FormTargetCare;
