import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { Input } from 'antd';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const FormPassword = ({ field, validation, type = 'text', placeholder, className, disabled, ...props }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  React.useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  const handleChange = (e) => {
    methods.clearErrors(field);
    methods.setValue(field, e.target.value);
  };

  return (
    <React.Fragment>
      <Input.Password
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        value={methods.watch(field) ?? ''}
        onChange={handleChange}
        style={{ lineHeight: 1 }}
        {...props}
      />
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormPassword.propTypes = {
  field: PropTypes.string,
  validation: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

FormPassword.defaultProps = {
  className: '',
};

export default FormPassword;
