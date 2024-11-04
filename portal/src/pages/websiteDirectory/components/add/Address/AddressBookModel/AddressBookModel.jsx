import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createCustomer } from 'services/customer.service';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getDistrict, getCountry, getProvince, getWard } from 'services/location.service';
import Loading from 'components/shared/Loading/index';
import { createAddressBook } from 'pages/websiteDirectory/helpers/call-api';
import { showToast } from 'utils/helpers';

const AddressBookModel = ({ onClose, getInitAddress, customerId }) => {
  const methods = useForm({});

  const [loading, setLoading] = useState(false);
  const [dataCountryList, setDataCountryList] = useState([]);
  const [dataProvinceList, setDataProvinceList] = useState([]);
  const [dataDistrictList, setDataDistrictList] = useState([]);
  const [dataWardList, setDataWardList] = useState([]);

  const loadCountry = useCallback(() => {
    getCountry().then((p) => {
      setDataCountryList(p);
      methods.setValue('country_id', p?.[0]?.id);
    });
  }, []);
  useEffect(loadCountry, [loadCountry]);

  const loadProvince = useCallback(() => {
    getProvince().then(setDataProvinceList);
  }, []);
  useEffect(loadProvince, [loadProvince]);

  const province_id = useMemo(() => methods.watch('province_id'), [methods.watch('province_id')]);

  const loadDistrict = useCallback(() => {
    getDistrict({
      parent_id: province_id,
    }).then((p) => {
      setDataDistrictList(p);
    });
  }, [province_id]);
  useEffect(loadDistrict, [loadDistrict]);

  const district_id = useMemo(() => methods.watch('district_id'), [methods.watch('district_id')]);
  const loadWard = useCallback(() => {
    getWard({
      parent_id: district_id,
    }).then(setDataWardList);
  }, [district_id]);
  useEffect(loadWard, [loadWard]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = 1;
      payload.is_system = 0;
      payload.member_id = customerId;
      setLoading(true);

      await createAddressBook(payload);

      showToast.success(`Thêm mới địa chỉ khách hàng thành công!!!`);
      onClose();
      getInitAddress();
    } catch (error) {
      showToast.error(error ? error?.message : 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='bw_modal bw_modal_open' id='bw_add_customer'>
      {loading && <Loading />}
      <div className='bw_modal_container bw_w900 '>
        <div className='bw_title_modal'>
          <h3>Thêm mới địa chỉ khách hàng</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <FormProvider {...methods}>
          <div className='bw_main_modal'>
            <div className='bw_row'>
              <FormItem isRequired label='Họ và tên' style='gray' className='bw_col_6'>
                <FormInput
                  type='text'
                  field='full_name'
                  placeholder='Nhập họ và tên khách hàng'
                  validation={{
                    required: 'Họ và tên là bắt buộc',
                  }}
                />
              </FormItem>
              <FormItem isRequired label='Số điện thoại' style='gray' className='bw_col_6'>
                <FormInput
                  type='number'
                  field='phone_number'
                  placeholder='Nhập số điện thoại khách hàng'
                  validation={{
                    required: 'Số điện thoại khách hàng là bắt buộc',
                  }}
                />
              </FormItem>

              <FormItem isRequired label='Email' style='gray' className='bw_col_6'>
                <FormInput type='text' field='email' placeholder='Nhập email' />
              </FormItem>

              <FormItem isRequired label='Quốc gia' style='gray' className='bw_col_6'>
                <FormSelect
                  showSearch
                  field='country_id'
                  validation={{
                    required: 'Cần chọn quốc gia',
                  }}
                  list={dataCountryList?.map((p) => {
                    return {
                      label: p?.name,
                      value: p?.id,
                    };
                  })}
                />
              </FormItem>
              <FormItem isRequired label='Tỉnh/Thành phố' style='gray' className='bw_col_6'>
                <FormSelect
                  field='province_id'
                  list={dataProvinceList?.map((p) => {
                    return {
                      label: p?.name,
                      value: p?.id,
                    };
                  })}
                  validation={{
                    required: 'Cần chọn Tỉnh/Thành phố',
                  }}
                />
              </FormItem>
              <FormItem
                disabled={!methods.watch('province_id')}
                isRequired
                label='Quận/Huyện'
                style={!methods.watch('province_id') ? '' : 'gray'}
                className='bw_col_6'>
                <FormSelect
                  field='district_id'
                  list={dataDistrictList?.map((p) => {
                    return {
                      label: p?.name,
                      value: p?.id,
                    };
                  })}
                  validation={{
                    required: 'Cần chọn Quận/Huyện',
                  }}
                />
              </FormItem>

              <FormItem
                disabled={!methods.watch('district_id')}
                label='Phường/Xã'
                isRequired
                style={!methods.watch('district_id') ? '' : 'gray'}
                className='bw_col_6'>
                <FormSelect
                  field='ward_id'
                  list={dataWardList?.map((p) => {
                    return {
                      label: p?.name,
                      value: p?.id,
                    };
                  })}
                  validation={{
                    required: 'Cần chọn Phường/Xã',
                  }}
                />
              </FormItem>

              <FormItem label='Số nhà, tên đường' isRequired style='gray' className='bw_col_12'>
                <FormInput
                  field='address'
                  placeholder={'Nhập địa chỉ, số nhà, tên đường'}
                  validation={{
                    required: 'Cần nhập địa chỉ',
                  }}
                />
              </FormItem>

              <div className='bw_col_12'>
                <label className='bw_checkbox'>
                  <FormInput type='checkbox' field='is_default' value={methods.watch('is_default')} />
                  <span />
                  Là địa chỉ mặc định
                </label>
              </div>
            </div>
          </div>
          <div className='bw_footer_modal bw_mt_1'>
            <button type='button' className='bw_btn bw_btn_success' onClick={methods.handleSubmit(onSubmit)}>
              <span className='fi fi-rr-check' /> Thêm mới
            </button>
            <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
              Đóng
            </button>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddressBookModel;
