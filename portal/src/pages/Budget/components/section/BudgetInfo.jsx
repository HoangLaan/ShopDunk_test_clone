import React, { useCallback, useEffect } from 'react';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { msgError } from '../../helpers/msgError';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

import BudgetRuleTable from '../subTable/BudgetRuleTable';

import { getParentOptions } from 'services/budget.service';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const BudgetInfo = ({ id, title, disabled }) => {
  const dispatch = useDispatch();

  const { budgetTypeData } = useSelector((state) => state.global);

  const methods = useFormContext();

  const loadOptions = useCallback(async () => {
    dispatch(getOptionsGlobal('budgetType'));
  }, []);

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <React.Fragment>
      <BWAccordion title={title} id={id}>
        <div className='bw_row'>
          <FormItem label='Loại ngân sách' className='bw_col_6' disabled={disabled} isRequired={true}>
            <FormSelect
              type='text'
              field='budget_type_id'
              placeholder='Chọn'
              list={mapDataOptions4SelectCustom(budgetTypeData)}
              validation={msgError.budget_type_id}
            />
          </FormItem>
          <FormItem label='Thuộc ngân sách' className='bw_col_6' disabled={disabled}>
            {/* <FormSelect type='text' field='parent_id' placeholder='Chọn' list={getParentOptions} /> */}
            <FormTreeSelect field='parent_id' treeDataSimpleMode fetchOptions={getParentOptions} disabled={disabled} />
          </FormItem>
          <FormItem label='Mã ngân sách' className='bw_col_6' disabled={disabled} isRequired={true}>
            <FormInput type='text' field='budget_code' placeholder='Mã ngân sách' validation={msgError.budget_code} />
          </FormItem>
          <FormItem label='Tên ngân sách viết tắt' className='bw_col_6' disabled={disabled} isRequired={true}>
            <FormInput
              type='text'
              field='short_name'
              placeholder='Tên ngân sách viết tắt'
              validation={msgError.short_name}
            />
          </FormItem>
          <FormItem label='Tên ngân sách đầy đủ' className='bw_col_12' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='budget_name'
              placeholder='Tên ngân sách đầy đủ'
              validation={msgError.budget_name}
            />
          </FormItem>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <label className='bw_checkbox'>
                <FormInput
                  disabled={disabled}
                  type='checkbox'
                  field='is_dynamic_budget'
                  onChange={({ target: { checked } }) => {
                    methods.setValue('is_dynamic_budget', checked ? 1 : 0);
                  }}
                />
                <span />
                Ngân sách động
              </label>
            </div>
          </div>
          <div className='bw_col_12'>
            {methods.watch('is_dynamic_budget') ? <BudgetRuleTable disabled={disabled} /> : <></>}
          </div>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <label>Mô tả</label>
              <FormTextArea disabled={disabled} placeholder='Nhập mô tả' field='description' />
            </div>
          </div>
          <div className='bw_col_12'>
            <div className='bw_frm_box'>
              <label>Ghi chú</label>
              <FormTextArea disabled={disabled} placeholder='Nhập ghi chú' field='note' />
            </div>
          </div>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

export default BudgetInfo;
