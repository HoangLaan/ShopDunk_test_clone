import React, { useCallback, useEffect, useMemo, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4Select } from 'utils/helpers';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import ReturnConditionModal from './modal/ReturnConditionModal';
import BWButton from 'components/shared/BWButton/index';
import { useFormContext } from 'react-hook-form';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

const ReturnPolicyInformation = ({ disabled, title, isReturn, nameType, isSubmit, listConditionEdit }) => {
  const [conditionOptions, setConditionOptions] = useState([]);
  const { setValue, watch, clearErrors } = useFormContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const objCheckbox = useMemo(() => {
    const fieldCheckbox = isReturn === 0 ? 'is_depreciation' : 'is_cashback';
    const content = {
      is_depreciation: 'Thu phí khách hàng theo giá trị hóa đơn sản phẩm',
      is_cashback: 'Hoàn tiền cho khách hàng',
    };
    return { field: fieldCheckbox, content: content[fieldCheckbox] };
  }, [isReturn]);

  const isDepreciation = watch('is_depreciation') === 1;

  useEffect(() => {
    if (isSubmit) {
      setConditionOptions([]);
      setValue('condition_ids', []);
    }
  }, [isSubmit]);

  useEffect(() => {
    setConditionOptions(mapDataOptions4Select(listConditionEdit, 'return_condition_id', 'return_condition_name'));
  }, [listConditionEdit]);

  useEffect(() => {
    setValue(
      'condition_ids',
      conditionOptions.map((c) => ({ id: c.return_condition_id, value: c.return_condition_id })),
    );
  }, [conditionOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_6' label={`Mã chính sách ${nameType} hàng`} isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='return_policy_code'
              placeholder={`Nhập mã chính sách ${nameType} hàng`}
              validation={{
                required: `Mã chính sách ${nameType} hàng là bắt buộc`,
              }}
            />
          </FormItem>
        </div>
        <div className='bw_row'>
          <FormItem className='bw_col_6' label={`Tên chính sách ${nameType} hàng`} isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='return_policy_name'
              placeholder={`Nhập tên chính sách ${nameType} hàng`}
              validation={{
                required: `Tên chính sách ${nameType} hàng là bắt buộc`,
              }}
            />
          </FormItem>
          <FormItem disabled={disabled} className='bw_col_6' label='Thời gian áp dụng chính sách'>
            <div className='bw_row'>
              <FormItem disabled={disabled} className='bw_col_6' label='Từ ngày'>
                <FormDatePicker format={'DD/MM/YYYY'} field={'start_date'} placeholder={'Từ ngày'} />
              </FormItem>
              <FormItem disabled={disabled} className='bw_col_6' label='Đến ngày'>
                <FormDatePicker allowClear={true} format={'DD/MM/YYYY'} field={'end_date'} placeholder={'Đến ngày'} />
              </FormItem>
            </div>
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem disabled={disabled} className='bw_col_12' label='Mô tả'>
            <FormTextArea field='description' rows={3} placeholder='Mô tả' />
          </FormItem>
        </div>
        <div className='bw_row'>
          <div style={{ width: '100%' }}>
            <BWButton
              disabled={disabled}
              style={{ float: 'right', margin: '0 0.4em 0.8em 0' }}
              icon={'fi fi-rr-plus'}
              content={'Thêm'}
              onClick={() => {
                if (clearErrors('condition_ids')) clearErrors('condition_ids');
                setIsOpenModal(true);
              }}
            />
          </div>
          <FormItem disabled={disabled} isRequired className='bw_col_12' label={`Điều kiện ${nameType} hàng`}>
            <FormSelect
              field='condition_ids'
              list={conditionOptions}
              mode={'multiple'}
              disabled={conditionOptions.length === 0 || disabled}
              validation={{
                required: `Điều kiện ${nameType} hàng là bắt buộc`,
              }}
            />
          </FormItem>
        </div>
        <div className='bw_row'>
          <div className='bw_col_8'>
            <label className='bw_checkbox'>
              <FormInput disabled={disabled} type='checkbox' field={objCheckbox.field} />
              <span />
              {objCheckbox.content}
            </label>
          </div>
          <div className='bw_col_4'>
            {isDepreciation && (
              <FormItem label='Tỷ lệ thu phí % (theo tháng)' disabled={disabled}>
                <FormNumber type='number' field='percent_value' />
              </FormItem>
            )}
          </div>
        </div>
      </div>

      {isOpenModal && (
        <ReturnConditionModal
          open={isOpenModal}
          onClose={() => {
            setIsOpenModal(false);
          }}
          onApply={(d) => {
            setConditionOptions(mapDataOptions4Select(d, 'return_condition_id', 'return_condition_name'));
          }}
          defaultDataSelect={[]}
          isReturn={isReturn}
        />
      )}
    </BWAccordion>
  );
};
export default ReturnPolicyInformation;
