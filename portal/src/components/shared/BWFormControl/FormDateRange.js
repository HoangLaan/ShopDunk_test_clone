import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';

import ErrorMessage from './ErrorMessage';

const { RangePicker } = DatePicker;

const FormStyled = styled.div`
  .ant-picker-input > input::placeholder {
    opacity: 0.7;
  }
`;

const FormRangePicker = ({
  fieldStart,
  fieldEnd,
  validation,
  placeholder,
  disabled = false,
  style,
  format,
  bordered = false,
  allowClear,
  minDate,
  ...props
}) => {
  // #region use-form
  const methods = useFormContext();
  const { error: fieldStartError } = methods.getFieldState(fieldStart, methods.formState);
  const { error: fieldEndError } = methods.getFieldState(fieldEnd, methods.formState);

  const error = useMemo(() => {
    return fieldStartError ?? fieldEndError;
  }, [fieldStartError, fieldEndError]);

  // const disabledDate = (current) => {
  //   // Can't select days before today
  //   return current && current < moment().endOf('day');
  // };
  React.useEffect(() => {
    methods.register(fieldStart, validation);
    methods.register(fieldEnd, validation);
  }, [methods, fieldStart, fieldEnd, validation]);
  // #endregion
  return (
    <FormStyled>
      <RangePicker
        bordered={bordered}
        allowClear={allowClear}
        disabled={disabled}
        minDate={minDate ? dayjs(minDate) : dayjs(new Date(1999, 10 - 1, 25))}
        placeholder={placeholder}
        value={
          methods.watch(fieldStart) || methods.watch(fieldEnd)
            ? [dayjs(methods.watch(fieldStart), format), dayjs(methods.watch(fieldEnd), format)]
            : ''
        }
        onChange={(dates, dateStrings) => {
          if (dates) {
            methods.clearErrors(fieldStart);
            methods.clearErrors(fieldEnd);
            methods.setValue(fieldStart, dateStrings[0]);
            methods.setValue(fieldEnd, dateStrings[1]);
          } else {
            methods.setValue(fieldStart, '');
            methods.setValue(fieldEnd, '');
          }
        }}
        format={format}
        style={{
          width: '100%',
          ...style,
        }}
        {...props}
      />
      {error && <ErrorMessage message={error?.message} />}
    </FormStyled>
  );
};

FormRangePicker.propTypes = {
  fieldStart: PropTypes.string,
  fieldEnd: PropTypes.string,
  validation: PropTypes.object,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  allowClear: PropTypes.bool,
  bordered: PropTypes.bool,
};

FormRangePicker.defaultProps = {};

export default FormRangePicker;
