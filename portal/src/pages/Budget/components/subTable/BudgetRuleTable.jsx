import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { criteriaOptions, measureOptions, valueUnitOptions } from 'pages/Budget/utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { msgError } from 'pages/Budget/helpers/msgError';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { useFormContext, useFieldArray } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const BudgetRuleTable = ({ disabled }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { watch, register } = methods;
  const { budgetRuleData } = useSelector((state) => state.global);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'budgetRules',
  });

  useEffect(() => {
    register('budgetRules');
  }, [register]);

  useEffect(() => {
    dispatch(getOptionsGlobal('budgetRule'));
  }, []);

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên nguyên tắc',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          type='text'
          field={`budgetRules[${index}].rule_id`}
          validation={msgError.budget_type_name}
          placeholder='Chọn'
          list={mapDataOptions4SelectCustom(budgetRuleData)}
        />
      ),
    },
    {
      header: 'Cách tính',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          type='text'
          field={`budgetRules[${index}].measure`}
          validation={msgError.measure}
          placeholder='Chọn'
          list={measureOptions}
        />
      ),
    },
    {
      header: 'Gía trị',
      disabled: disabled,
      formatter: (_, index) => (
        <FormNumber
          bordered
          type='text'
          className='bw-input'
          field={`budgetRules[${index}].budget_value`}
          validation={msgError.budget_value}
        />
      ),
    },
    {
      header: 'Đơn vị',
      disabled: disabled,
      formatter: (_, index) => (
        <FormSelect
          type='text'
          field={`budgetRules[${index}].budget_value_type`}
          validation={msgError.budget_value_type}
          placeholder='Chọn'
          list={valueUnitOptions}
        />
      ),
    },
    {
      header: 'Tiêu chí',
      disabled: disabled,
      style: { minWidth: '120px' },
      formatter: (_, index) => (
        <FormSelect
          type='text'
          field={`budgetRules[${index}].criteria`}
          placeholder='Chọn'
          list={criteriaOptions}
          validation={msgError.criteria}
        />
      ),
    },
    {
      header: 'Khoảng thời gian',
      disabled: disabled,
      formatter: (_, index) => (
        <FormRangePicker
          fieldStart={`budgetRules[${index}].date_from`}
          fieldEnd={`budgetRules[${index}].date_to`}
          placeholder={['Từ ngày', 'Đến ngày']}
          format={'DD/MM/YYYY'}
          validation={{ required: 'Khoảng thời gian là bắt buộc !' }}
          allowClear={false}
        />
      ),
    },
  ];

  const actions = [
    {
      icon: 'fi fi-rr-trash',
      color: 'red',
      disabled: disabled,
      permission: 'FI_BUDGET_EDIT',
      onClick: (_, index) =>
        dispatch(
          showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], async () =>
            remove(index),
          ),
        ),
    },
  ];

  return (
    <div className='bw_col_12 bw_mb_2'>
      <DataTable noSelect noPaging columns={columns} actions={actions} data={fields} />
      {!disabled && (
        <a
          onClick={() => {
            append({});
          }}
          className='bw_btn_outline bw_btn_outline_success bw_add_us'>
          <span className='fi fi-rr-plus'></span> Thêm dòng
        </a>
      )}
    </div>
  );
};

export default BudgetRuleTable;
