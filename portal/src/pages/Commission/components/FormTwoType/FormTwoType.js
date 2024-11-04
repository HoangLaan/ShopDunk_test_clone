import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import styled from 'styled-components';

import FormItem from 'components/shared/BWFormControl/FormItem';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { TYPE_VALUE } from 'pages/Commission/helpers/constants';
import { getCommissionValueRule } from 'pages/Commission/helpers/formRules';

const FormStyle = styled.div`
  position: relative;

  .bw_type_mon label span {
    height: 38px;
  }
  .bw_inp {
    cursor: auto;
  }
  .ant-input-number-input {
    min-width: 160px;
  }
`;

function FormTwoType(props) {
  const {
    label,
    placeholder = 'Giá trị',
    fieldType,
    fieldValue,
    disabled,
    initType,
    bordered = true,
    isRequired = true,
  } = props;
  const { register, watch, clearErrors, setValue } = useFormContext();
  const watchTypeValue = watch(fieldType);

  useEffect(() => {
    register(fieldType);
  }, [register, fieldType]);

  useEffect(() => {
    if (initType) {
      setValue(fieldType, initType);
    }
  }, [initType, setValue, fieldType]);

  const handleChangeType = (value) => {
    clearErrors(fieldType);
    setValue('type_value', value);
  };

  const renderFormInputValue = () => {
    if (parseInt(watchTypeValue) === TYPE_VALUE.PERCENT) {
      return (
        <FormInput
          className={bordered ? 'bw_inp' : ''}
          type='number'
          field={fieldValue}
          placeholder={placeholder}
          validation={getCommissionValueRule(TYPE_VALUE.PERCENT, isRequired)}
          disabled={disabled}
        />
      );
    }
    if (parseInt(watchTypeValue) === TYPE_VALUE.MONEY) {
      return (
        <FormNumber
          bordered={bordered}
          field={fieldValue}
          placeholder={placeholder}
          validation={getCommissionValueRule(TYPE_VALUE.MONEY, isRequired)}
          style={{ width: 'unset' }}
          disabled={disabled}
          onChange={(value) => {
            clearErrors(fieldValue);
            setValue(fieldValue, value ? `${value}` : '');
          }}
        />
      );
    }
  };
  console.log(watchTypeValue);
  return (
    <FormStyle className='bw_commission_relative'>
      {label && (
        <FormItem label={label} isRequired={true}>
          {renderFormInputValue()}
        </FormItem>
      )}
      {!label && renderFormInputValue()}
      <div
        className={classNames('bw_type_mon', {
          bw_input_two_type: label,
          bw_input_two_type_no_label: !label,
        })}>
        <label className='bw_checkbox'>
          <input
            type='radio'
            value={TYPE_VALUE.PERCENT}
            checked={parseInt(watch(fieldType)) === TYPE_VALUE.PERCENT}
            disabled={disabled}
            onChange={() => handleChangeType(TYPE_VALUE.PERCENT)}
          />
          <span>%</span>
        </label>
        <label className='bw_checkbox'>
          <input
            type='radio'
            value={TYPE_VALUE.MONEY}
            checked={parseInt(watch(fieldType)) === TYPE_VALUE.MONEY}
            disabled={disabled}
            onChange={() => handleChangeType(TYPE_VALUE.MONEY)}
          />
          <span>đ</span>
        </label>
      </div>
    </FormStyle>
  );
}

export default FormTwoType;
