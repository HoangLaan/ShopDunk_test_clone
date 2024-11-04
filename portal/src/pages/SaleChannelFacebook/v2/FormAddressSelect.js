import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getCountry, getProvince, getDistrict, getWard } from 'services/location.service';
import { useFormContext } from 'react-hook-form';

const FormAddressSelect = ({ disabled }) => {
  const methods = useFormContext();
  const [dataCountryList, setDataCountryList] = useState([]);
  const [dataProvinceList, setDataProvinceList] = useState([]);
  const [dataDistrictList, setDataDistrictList] = useState([]);
  const [dataWardList, setDataWardList] = useState([]);

  const loadCountry = useCallback(() => {
    getCountry().then((val) => {
      methods.setValue('country_id', 6);
      setDataCountryList(val);
    });
  }, []);
  useEffect(loadCountry, [loadCountry]);

  const loadProvince = useCallback(() => {
    getProvince().then(setDataProvinceList);
  }, []);
  useEffect(loadProvince, [loadProvince]);

  const province_id = useMemo(() => methods.watch('province_id'), [methods]);
  const loadDistrict = useCallback(() => {
    getDistrict({ parent_id: province_id }).then(setDataDistrictList);
  }, [province_id]);
  useEffect(loadDistrict, [loadDistrict]);

  const district_id = useMemo(() => methods.watch('district_id'), [methods]);
  const loadWard = useCallback(() => {
    getWard({ parent_id: district_id }).then(setDataWardList);
  }, [district_id]);
  useEffect(loadWard, [loadWard]);

  return (
    <div className='bw_row'>
      <div className='bw_col_6'>
        <FormItem disabled={disabled} label='Quốc gia'>
          <FormSelect
            showSearch
            field='country_id'
            list={dataCountryList?.map((p) => {
              return {
                label: p?.name,
                value: p?.id,
              };
            })}
          />
        </FormItem>
      </div>
      <div className='bw_col_6'>
        <FormItem disabled={!methods.watch('country_id') || disabled} label='Tỉnh/Thành phố'>
          <FormSelect
            field='province_id'
            list={dataProvinceList?.map((p) => {
              return {
                label: p?.name,
                value: p?.id,
              };
            })}
            onChange={(value) => {
              methods.clearErrors('province_id');
              methods.setValue('province_id', value);
              methods.setValue('district_id', null);
              methods.setValue('ward_id', null);
            }}
          />
        </FormItem>
      </div>
      <div className='bw_col_6'>
        <FormItem disabled={!methods.watch('province_id') || disabled} label='Quận/Huyện'>
          <FormSelect
            field='district_id'
            list={dataDistrictList?.map((p) => {
              return {
                label: p?.name,
                value: p?.id,
              };
            })}
            onChange={(value) => {
              methods.clearErrors('district_id');
              methods.setValue('district_id', value);
              methods.setValue('ward_id', null);
            }}
          />
        </FormItem>
      </div>
      <div className='bw_col_6'>
        <FormItem disabled={!methods.watch('district_id') || disabled} label='Phường/Xã'>
          <FormSelect
            field='ward_id'
            list={dataWardList?.map((p) => {
              return {
                label: p?.name,
                value: p?.id,
              };
            })}
            onChange={(value) => {
              methods.clearErrors('ward_id');
              methods.setValue('ward_id', value);
            }}
          />
        </FormItem>
      </div>
      <div className='bw_col_12'>
        <FormItem disabled={disabled} label='Địa chỉ'>
          <FormInput field='address' placeholder='Nhập địa chỉ' />
        </FormItem>
      </div>
    </div>
  );
};

export default FormAddressSelect;
