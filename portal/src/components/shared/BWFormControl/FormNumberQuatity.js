import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import { InputNumber } from 'antd';
import styled from 'styled-components';

import { formatNumber } from 'utils/helpers';

const InputNumberStyled = styled(InputNumber)`
  .ant-input-number-group-addon {
    border: ${(props) => (props.bordered ? '' : 'none')};
  }
`;

const FormNumberQuatity = ({ field, validation, bordered = false, disabled, funcParam = () => {}, handleParse = () => {}, ...props }) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  React.useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  const formatterNumber = (val) => {
    if (!val) return '';
    let result = funcParam(val)
    return result;
  };

  return (
    <React.Fragment>
      <InputNumberStyled
        bordered={bordered}
        disabled={disabled}
        formatter={formatterNumber}
        value={methods.watch(field)}
        placeholder='0'
        parser={handleParse}
        onChange={(value) => {
          methods.clearErrors(field);
          methods.setValue(field, value);
        }}
        controls={false}
        {...props}
      />
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormNumberQuatity.propTypes = {
  bordered: PropTypes.bool,
  field: PropTypes.string,
  validation: PropTypes.object,
  disabled: PropTypes.bool,
};

export default FormNumberQuatity;
