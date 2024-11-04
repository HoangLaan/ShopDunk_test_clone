import React, { Component, PureComponent, useEffect, useState } from 'react';
import { getDistrict, getProvince, getWard, getCountry } from 'services/location.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';

export const DEFAULT_COUNTRY_ID = 6;

function mapData(data) {
  return data.map(({ name, id, ...props }) => ({ label: name, value: id, ...props }));
}

function parentId(parent_id) {
  return parent_id || -1;
}

function convertValue(value, options) {
  if (!(typeof value === 'object') && options && options.length) {
    value = ((_val) => {
      return options.find((item) => '' + item.value === '' + _val);
    })(value);
  }
  return value;
}

function convertSelectProps(selectProps, selectOpts) {
  let { value, defaultValue, ...props } = selectProps;
  let _props = {
    isSearchable: true,
    placeholder: (selectOpts[0] && selectOpts[0].label) || '',
    value: undefined !== value ? convertValue(value, selectOpts) : undefined,
    defaultValue:
      undefined !== defaultValue
        ? convertValue(defaultValue, selectOpts)
        : selectProps.type === 'country'
        ? DEFAULT_COUNTRY_ID
        : undefined,
    options: selectOpts,
    list: selectOpts,
    // menuPortalTarget: document.querySelector('body'),
    ...props,
  };
  return _props;
}

function getCountryData() {
  return getCountry().then(mapData);
}

function getProvinceData(parent_id) {
  let data = getProvinceData.cache[(parent_id = parentId(parent_id))];
  if (data) {
    return Promise.resolve(data);
  }
  return getProvince({ parent_id }).then((data) => (getProvinceData.cache[parent_id] = mapData(data)));
}
getProvinceData.cache = {};

function getDistrictData(parent_id) {
  let data = getDistrictData.cache[(parent_id = parentId(parent_id))];
  if (data) {
    return Promise.resolve(data);
  }
  return getDistrict({ parent_id }).then((data) => (getDistrictData.cache[parent_id] = mapData(data)));
}
getDistrictData.cache = {};

function getWardData(parent_id) {
  let data = getWardData.cache[(parent_id = parentId(parent_id))];
  if (data) {
    return Promise.resolve(data);
  }
  return getWard({ parent_id }).then((data) => (getWardData.cache[parent_id] = mapData(data)));
}
getWardData.cache = {};

function BWAddress(props) {
  let { type = 'province' } = props || {};
  const method = useFormContext();

  const [options, setOptions] = useState([]);
  const [mainValue, setMainValue] = useState(null);

  const _getOption = async (mainValue) => {
    try {
      let _options = [];
      switch (type) {
        case 'province':
          _options = await getProvinceData(mainValue);
          break;
        case 'district':
          _options = await getDistrictData(mainValue);
          break;
        case 'ward':
          _options = await getWardData(mainValue);
          break;
        case 'country':
          _options = await getCountryData();
          break;
      }
      setOptions(_options);
    } catch (error) {}
  };

  const getMainValue = (type) => {
    if (type == 'country') return -1;
    if (type == 'province') return method.getValues(props.parentField || 'country_id') || DEFAULT_COUNTRY_ID;
    if (type == 'district') return method.getValues(props.parentField || 'province_id');
    if (type == 'ward') return method.getValues(props.parentField || 'district_id');
  };

  useEffect(() => {
    setMainValue(getMainValue(type));
  }, [method.watch(props.parentField)]);

  useEffect(() => {
    if (mainValue) {
      _getOption(parentId(mainValue));
    } else {
      setOptions([]);
    }
  }, [mainValue]);

  const renderSelect = () => {
    const value = method.getValues(props.field);
    let _props = convertSelectProps({ ...props, value }, options);
    return <FormSelect {..._props} />;
  };

  return renderSelect();
}

export default BWAddress;
