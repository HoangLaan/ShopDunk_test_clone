import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getProvince, getDistrict, getWard } from 'services/location.service';
import { useFormContext } from 'react-hook-form';

const FormAddressSelect = ({ disabled }) => {
  const methods = useFormContext();
  const { setValue } = methods;

  //Address
  const [dataProvinceList, setDataProvinceList] = useState([]);
  const [dataDistrictList, setDataDistrictList] = useState([]);
  const [dataWardList, setDataWardList] = useState([]);

  //Address
  const loadProvince = useCallback(() => {
    getProvince().then(setDataProvinceList);
  }, []);
  useEffect(loadProvince, [loadProvince]);
  const province_id = useMemo(() => methods.watch('province_id'), [methods]);

  const loadDistrict = useCallback(() => {
      if (province_id) {
          getDistrict({
              parent_id: province_id,
          }).then((p) => {
              setDataDistrictList(p);
          });
      }
  }, [province_id]);
  useEffect(loadDistrict, [loadDistrict]);

  const district_id = useMemo(() => methods.watch('district_id'), [methods]);

  const loadWard = useCallback(() => {
      if (district_id) {
          getWard({
              parent_id: district_id,
          }).then(setDataWardList);
      }
  }, [district_id]);
  useEffect(loadWard, [loadWard]);

  const handleOnChangeProvince = (e, o) => {
      setValue('province_id', o.value)
      setValue('district_id', null)
      setValue('ward_id', null)
  }

  const handleOnChangeDistrict = (e, o) => {
      setValue('district_id', o.value)
      setValue('ward_id', null)
  }

  return (
    <BWAccordion title='Địa chỉ' id='bw_address_com'>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tỉnh/Thành phố' isRequired>
            <FormSelect
                field='province_id'
                list={dataProvinceList?.map((p) => {
                    return {
                        label: p?.name,
                        value: p?.id,
                    };
                })}
                validation={{
                    required: 'Tỉnh/Thành phố là bắt buộc',
                }}
                disabled={disabled}
                onChange={(e, o) => handleOnChangeProvince(e, o)}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Quận/Huyện' isRequired>
            <FormSelect
                field='district_id'
                list={dataDistrictList?.map((p) => {
                    return {
                        label: p?.name,
                        value: p?.id,
                    };
                })}
                validation={{
                    required: 'Quận/Huyện là bắt buộc',
                }}
                disabled={disabled}
                onChange={(e, o) => handleOnChangeDistrict(e, o)}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Phường/Xã ' isRequired>
              <FormSelect
                  field='ward_id'
                  list={dataWardList?.map((p) => {
                      return {
                          label: p?.name,
                          value: p?.id,
                      };
                  })}
                  validation={{
                      required: 'Phường/Xã là bắt buộc',
                  }}
                  disabled={disabled}

              />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem disabled={disabled} label='Số nhà, tên đường'>
            <FormInput field='address' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};
export default FormAddressSelect;
