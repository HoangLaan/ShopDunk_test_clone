import React from 'react';
import { Select } from 'antd';
import { CaretDownOutlined, LoadingOutlined } from '@ant-design/icons';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';
import { useHistory } from 'react-router-dom';

const SelectStyle = styled(Select)`
  display: flex;
  .ant-select-selector {
    font-size: 15px !important;
    width: 100%;
    padding: 0 !important;
    margin: 1.8px 0;
  }
  .ant-select-arrow .anticon:not(.ant-select-suffix) {
    pointer-events: none;
  }
  .ant-select-selection-search {
    width: 100%;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
  }
  .ant-select-selection-item {
    padding: ${(props) => (props.bordered ? '0 7px!important' : undefined)};
    color: black;
  }
  :where(.css-dev-only-do-not-override-1me4733).ant-select-multiple .ant-select-selection-item {
    background: var(--mainColor);
    color: var(--whiteColor);
    font-size: 14px !important;
    height: 26.5px;
    padding-top: 1px;
  }
  :where(.css-dev-only-do-not-override-1me4733).ant-select-multiple .ant-select-selection-item-remove {
    color: var(--whiteColor);
    border-left: 1px solid;
    padding-right: 3px;
    padding-left: 7px;
    font-weight: bold;
  }
`;

const objectParse = (item) => {
  return {
    id: item,
    value: item,
  };
};

const FormSelect = ({
  list = [],
  loading,
  bordered = false,
  placeholder = '--Chọn--',
  className,
  disabled = false,
  field,
  validation,
  mode = null,
  allowClear = false,
  showSearch = true,
  defaultValue,
  ...props
}) => {
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  const history = useHistory();
  
  React.useEffect(() => {
    methods.register(field, validation);
  }, [methods, field, validation]);

  const elements = document.querySelectorAll('.reload_remove_icon .ant-select-selection-item .ant-select-selection-item-remove');
  React.useEffect(() => {
    const handleClick = () => {
      history.replace('/request-purchase-order/add', {
        pr_list: null, // hoặc null
      });
      window.location.reload();
    };

    elements.forEach(element => {
      element.addEventListener('click', handleClick);
    });

    return () => {
      elements.forEach(element => {
        element.removeEventListener('click', handleClick);
      });
    };
  }, [elements]); 

  return (
    <React.Fragment>
      <SelectStyle
        className={className}
        mode={mode}
        suffixIcon={loading ? <LoadingOutlined /> : <CaretDownOutlined />}
        bordered={bordered}
        showSearch={showSearch}
        allowClear={allowClear}
        placeholder={placeholder}
        optionFilterProp='children'
        disabled={disabled}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        defaultValue={defaultValue}
        value={methods.watch(field)}
        options={list}
        removeIcon={() => 'X'}
        onChange={(value) => {
          methods.clearErrors(field);
          if (Array.isArray(value)) {
            methods.setValue(field, value.map(objectParse));
          } else {
            methods.setValue(field, value);
          }
        }}
        {...props}
      />
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormSelect.propTypes = {
  field: PropTypes.string,
  className: PropTypes.string,
  validation: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  mode: PropTypes.string,
};

FormSelect.defaultValue = {
  bordered: false,
  loading: false,
};

export default FormSelect;
