import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';
import { Select, Spin, Tooltip } from 'antd';
import { useFormContext } from 'react-hook-form';
import { CaretDownOutlined, LoadingOutlined } from '@ant-design/icons';
import { mapDataOptions4Select } from 'utils/helpers';
import styled from 'styled-components';

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
`;

const FormDebouneSelect = ({
  field,
  placeholder,
  validation,
  bordered,
  fetchOptions,
  debounceTimeout,
  isLoadingFirst = false,
  noCallApi,
  ...props
}) => {
  //#region useForm
  const methods = useFormContext();
  const { error } = methods.getFieldState(field, methods.formState);
  React.useEffect(() => {
    methods?.register(field, validation);
  }, [methods, field, validation]);
  //#endreigon

  //#region handle deboune
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(props?.list ?? []);

  const loadOptions = useCallback(
    (value) => {
      if (noCallApi) {
        if (value) {
          setLoading(true);
          fetchOptions(value)
            .then((newOptions) => {
              setOptions(mapDataOptions4Select(newOptions));
              setLoading(false);
            })
            .catch((error) => { })
            .finally(() => {
              setLoading(false);
            });
        }
      } else {
        setLoading(true);
        fetchOptions(value)
          .then((newOptions) => {
            setOptions(mapDataOptions4Select(newOptions));
            setLoading(false);
          })
          .catch((error) => { })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [fetchOptions, setOptions],
  );

  useEffect(() => {
    if (isLoadingFirst && options.length === 0) {
      loadOptions();
    }
  }, [isLoadingFirst]);

  const debounceFetcher = useMemo(() => {
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, loadOptions]);

  //#endregion
  return (
    <React.Fragment>
      {/* <Tooltip title={methods?.watch(field)}> */}
      <SelectStyle
        onClick={() => loadOptions()}
        style={{
          width: '100%',
        }}
        placeholder={placeholder}
        showSearch
        labelInValue
        suffixIcon={loading ? <LoadingOutlined /> : <CaretDownOutlined />}
        bordered={bordered}
        filterOption={false}
        onSearch={debounceFetcher}
        value={methods?.watch(field) ?? undefined}
        onChange={(e, options) => {
          methods.clearErrors(field);
          methods.setValue(field, options ? Object.assign(e, options) : null);
        }}
        notFoundContent={loading ? <Spin size='small' /> : <p>Không tìm thấy dữ liệu</p>}
        options={options}
        {...props}
      />
      {/* </Tooltip> */}
      {error && <ErrorMessage message={error?.message} />}
    </React.Fragment>
  );
};

FormDebouneSelect.propTypes = {
  field: PropTypes.string.isRequired,
  validation: PropTypes.object,
  bordered: PropTypes.bool,
  fetchOptions: PropTypes.func,
  debounceTimeout: PropTypes.number,
};

FormDebouneSelect.defaultProps = {
  field: '',
  bordered: false,
  fetchOptions: () => { },
  debounceTimeout: 500,
};

export default FormDebouneSelect;
