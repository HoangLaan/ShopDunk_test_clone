import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { InputNumber } from 'antd';
import styled from 'styled-components';

const InputNumberStyled = styled(InputNumber)`
  .ant-input-number-group-addon {
    border: ${(props) => (props.bordered ? '' : 'none')};
    padding: ${(props) => (props.paddingnone ? '0 !important' : 'auto')};
  }
  .ant-input-number-input::placeholder {
    color: #00000080;
  }
  .ant-input-number-input {
    color: black !important;
  }
`;

const FormNumber = ({ field, validation, bordered = false, value = null, disabled, ...props }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);

  React.useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  const formatterNumber = (val) => {
    if (!val) return '';
    return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const onChangeHandler = (value) => {
    if (value && value > 0 && !isNaN(value)) {
      methods.clearErrors(field);
      methods.setValue(field, value);
    } else {
      methods.setError(field, {
        message: 'Cần nhập vào số nguyên dương.',
      });
      methods.setValue(field, value);
    }
  };

  return (
    <React.Fragment>
      <InputNumberStyled
        style={{
          width: '100%',
        }}
        bordered={bordered}
        disabled={disabled}
        formatter={formatterNumber}
        value={value !== null ? value : methods.watch(field)}
        placeholder='0'
        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
        onChange={onChangeHandler}
        controls={false}
        {...props}
      />
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormNumber.propTypes = {
  bordered: PropTypes.bool,
  field: PropTypes.string,
  validation: PropTypes.object,
  disabled: PropTypes.bool,
};

export default FormNumber;
