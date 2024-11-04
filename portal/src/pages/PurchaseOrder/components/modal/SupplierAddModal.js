import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { createCustomer } from 'services/customer.service';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getListCustomerType, getListSource, generateCustomerCode } from 'services/customer.service';
import { getDistrict, getCountry, getProvince, getWard } from 'services/location.service';
import Loading from 'components/shared/Loading/index';
const SupplierAddModal = ({ onClose, getOptsCustomer, setValueCustomer }) => {
  const methods = useForm({
    defaultValue: {
      gender: 1,
    },
  });
  useEffect(() => {
    methods.setValue('gender', 1);
  }, []);
  const [loading, setLoading] = useState(false);
  const [customerTypeList, setCustomerTypeList] = useState([]);
  const [dataCountryList, setDataCountryList] = useState([]);
  const [dataProvinceList, setDataProvinceList] = useState([]);
  const [dataDistrictList, setDataDistrictList] = useState([]);
  const [dataWardList, setDataWardList] = useState([]);
  const loadCustomerType = useCallback(() => {
    getListCustomerType().then((p) => {
      setCustomerTypeList(p?.items);
    });
  }, []);
  useEffect(loadCustomerType, [loadCustomerType]);

  useEffect(() => {
    methods.setValue('customer_code', methods.watch('phone_number'));
  }, [methods.watch('phone_number')]);

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
    console.log(province_id);
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
      setLoading(true);
      const memberDetail = await createCustomer(payload);

      setValueCustomer({ ...payload, ...memberDetail });
      // methods.reset({
      //   is_active: 1,
      // });
      showToast.success(`Thêm mới khách hàng thành công!!!`);
      onClose();
      getOptsCustomer();
    } catch (error) {
      showToast.error(error ? error?.message : 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='bw_modal bw_modal_open' id='bw_add_supplier'>
      {loading && <Loading />}
      <div className='bw_modal_container bw_w900 '>
        <div className='bw_title_modal'>
          <h3>Thêm mới nhà cung cấp</h3>
          <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
        </div>
        <FormProvider {...methods}>
          <div className='bw_main_modal'>
            <div className='bw_row'>
              <div className='bw_col_4'>
                <FormItem disabled isRequired label='Mã khách hàng'>
                  <FormInput type='text' field='customer_code' placeholder='Mã khách hàng' />
                </FormItem>
                <FormItem isRequired label='Giới tính' style='gray'>
                  <div className='bw_flex bw_align_items_center bw_lb_sex'>
                    <label className='bw_radio'>
                      <input
                        onChange={(e) => methods.setValue('gender', 1)}
                        type='radio'
                        checked={methods.watch('gender') === 1}
                      />
                      <span></span>
                      Nam
                    </label>
                    <label className='bw_radio'>
                      <input
                        onChange={(e) => methods.setValue('gender', 0)}
                        type='radio'
                        checked={methods.watch('gender') === 0}
                      />
                      <span></span>
                      Nữ
                    </label>
                  </div>
                </FormItem>
                <FormItem label='Quốc gia' style='gray'>
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

                <FormItem
                  disabled={!methods.watch('district_id')}
                  label='Phường/Xã'
                  style={!methods.watch('district_id') ? '' : 'gray'}>
                  <FormSelect
                    field='ward_id'
                    list={dataWardList?.map((p) => {
                      return {
                        label: p?.name,
                        value: p?.id,
                      };
                    })}
                  />
                </FormItem>
              </div>

              <div className='bw_col_4'>
                <FormItem isRequired label='Họ và tên' style='gray'>
                  <FormInput
                    type='text'
                    field='full_name'
                    placeholder='Nhập họ và tên khách hàng'
                    validation={{
                      required: 'Họ và tên là bắt buộc',
                    }}
                  />
                </FormItem>
                <FormItem isRequired label='Số điện thoại' style='gray'>
                  <FormInput
                    type='text'
                    field='phone_number'
                    placeholder='Nhập số điện thoại khách hàng'
                    validation={{
                      required: 'Số điện thoại khách hàng là bắt buộc',
                    }}
                  />
                </FormItem>
                <FormItem label='Tỉnh/Thành phố' style='gray'>
                  <FormSelect
                    field='province_id'
                    list={dataProvinceList?.map((p) => {
                      return {
                        label: p?.name,
                        value: p?.id,
                      };
                    })}
                  />
                </FormItem>

                <FormItem label='Số nhà, tên đường' style='gray'>
                  <FormInput field='address' />
                </FormItem>
              </div>
              <div className='bw_col_4'>
                <FormItem isRequired label='Loại khách hàng' style='gray'>
                  <FormSelect
                    list={customerTypeList?.map((p) => {
                      return {
                        label: p?.customer_type_name,
                        value: p?.customer_type_id,
                      };
                    })}
                    type='text'
                    field='customer_type_id'
                    placeholder='Loại khách hàng'
                    validation={{
                      required: 'Loại khách hàng là bắt buộc.',
                    }}
                  />
                </FormItem>
                <FormItem isRequired label='Email' style='gray'>
                  <FormInput
                    type='text'
                    field='email'
                    placeholder='Nhập email'
                    validation={{
                      required: 'Email là bắt buộc.',
                    }}
                  />
                </FormItem>
                <FormItem
                  disabled={!methods.watch('province_id')}
                  label='Quận/Huyện'
                  style={!methods.watch('province_id') ? '' : 'gray'}>
                  <FormSelect
                    field='district_id'
                    list={dataDistrictList?.map((p) => {
                      return {
                        label: p?.name,
                        value: p?.id,
                      };
                    })}
                  />
                </FormItem>
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

export default SupplierAddModal;
