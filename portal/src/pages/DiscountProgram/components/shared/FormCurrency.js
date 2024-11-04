import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import styled from 'styled-components';

import FormNumber from 'components/shared/BWFormControl/FormNumber';

import { CurrencyType } from 'pages/DiscountProgram/ultils/constant';
import { getCurrencyTypeRule } from 'pages/DiscountProgram/ultils/formRules';

const FormStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  .bw_type_mon {
    width: 70px;
    height: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-wrap: nowrap;
  }

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

function FormCurrency(props) {
  const {
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
    setValue(fieldType, value);
  };

  const renderFormInputValue = () => {
    if (parseInt(watchTypeValue) === CurrencyType.PERCENT) {
      return (
        <FormNumber
          bordered={bordered}
          field={fieldValue}
          placeholder={placeholder}
          validation={getCurrencyTypeRule(CurrencyType.PERCENT, isRequired)}
          disabled={disabled}
          style={{ width: 'unset' }}
        />
      );
    }
    if (parseInt(watchTypeValue) === CurrencyType.MONEY) {
      return (
        <FormNumber
          bordered={bordered}
          field={fieldValue}
          placeholder={placeholder}
          validation={getCurrencyTypeRule(CurrencyType.MONEY, isRequired)}
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

  return (
    <FormStyle className='bw_commission_relative'>
      {renderFormInputValue()}
      <div
        className={classNames('bw_type_mon', {
          bw_input_two_type_no_labe: 1,
        })}>
        <label className='bw_checkbox'>
          <input
            type='radio'
            value={CurrencyType.PERCENT}
            checked={parseInt(watch(fieldType)) === CurrencyType.PERCENT}
            disabled={disabled}
            onChange={() => handleChangeType(CurrencyType.PERCENT)}
          />
          <span>%</span>
        </label>
        <label className='bw_checkbox'>
          <input
            type='radio'
            value={CurrencyType.MONEY}
            checked={parseInt(watch(fieldType)) === CurrencyType.MONEY}
            disabled={disabled}
            onChange={() => handleChangeType(CurrencyType.MONEY)}
          />
          <span>đ</span>
        </label>
      </div>
    </FormStyle>
  );
}

export default FormCurrency;
