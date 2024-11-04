import React, { useCallback, useEffect, useState } from 'react';

import { getBase64, mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useFormContext } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { genCode } from 'services/installment-partner.service';
import { getCountry, getProvince, getDistrict, getWard } from 'services/location.service';
import { PartnerTypeOptions } from 'pages/InstallmentPartner/utils/constant';

const InstallmentPartnerInfo = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const { watch, getValues, clearErrors, setValue } = methods;
  const [countrys, setCountrys] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const renderAvatar = useCallback(() => {
    if (methods.watch('installment_partner_logo')) {
      return <img src={methods.watch('installment_partner_logo')} alt='customer avatar' />;
    }
    return <img src='bw_image/default_avatar_v2.png' alt='customer avatar' />;
  }, [watch('installment_partner_logo')]);

  useEffect(function initializeAddressOptions() {
    getCountry().then((data) => setCountrys(mapDataOptions4SelectCustom(data)));
    getProvince({ parent_id: getValues('country_id') }).then((data) => setProvinces(mapDataOptions4SelectCustom(data)));
    getDistrict({ parent_id: getValues('province_id') }).then((data) =>
      setDistricts(mapDataOptions4SelectCustom(data)),
    );
    getWard({ parent_id: getValues('district_id') }).then((data) => setWards(mapDataOptions4SelectCustom(data)));
  }, []);

  // load code
  useEffect(() => {
    genCode().then((data) => {
      if (!methods.getValues('installment_partner_code') && data?.code) {
        methods.setValue('installment_partner_code', data?.code);
      }
    });
  }, []);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_8'>
          <div className='bw_row'>
            <div className='bw_col_12'>
              <FormItem label='Mã đối tác' isRequired disabled>
                <FormInput
                  type='text'
                  field='installment_partner_code'
                  placeholder='Nhập mã đối tác'
                  validation={{
                    required: 'Mã đối tác là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem label='Tên đối tác trả góp' isRequired disabled={disabled}>
                <FormInput
                  type='text'
                  field='installment_partner_name'
                  placeholder='Nhập tên đối tác trả góp'
                  validation={{
                    required: 'Tên đối tác trả góp là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
          </div>
        </div>

        <div className='bw_col_4'>
          <div className='bw_load_image bw_mb_2 bw_text_center'>
            <label className='bw_choose_image'>
              <input
                accept='image/*'
                type='file'
                onChange={async (_) => {
                  const base64 = await getBase64(_.target.files[0]);
                  methods.setValue('installment_partner_logo', base64);
                  if (base64) {
                    methods.setValue('is_change_logo', 1);
                  }
                }}
                disabled={disabled}
              />
              {renderAvatar()}
            </label>
            <p>Kích thước ảnh: 500px*500px.</p>
          </div>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Loại đối tác' disabled={disabled}>
            <FormSelect field='installment_partner_type' list={PartnerTypeOptions} />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Quốc gia' disabled={disabled}>
            <FormSelect
              field='country_id'
              placeholder='Quốc gia'
              list={countrys}
              onChange={(value) => {
                clearErrors('country_id');
                setValue('country_id', value);
                setValue('province_id', null);
                getProvince({ country_id: value }).then((data) => setProvinces(mapDataOptions4SelectCustom(data)));
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Tỉnh/thành phố' disabled={disabled}>
            <FormSelect
              field='province_id'
              placeholder='Tỉnh/ thành phố'
              list={provinces}
              onChange={(value) => {
                clearErrors('province_id');
                setValue('province_id', value);
                setValue('district_id', null);
                getDistrict({ parent_id: value }).then((data) => setDistricts(mapDataOptions4SelectCustom(data)));
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Quận/huyện' disabled={disabled}>
            <FormSelect
              field='district_id'
              placeholder='Quận/huyện'
              list={districts}
              onChange={(value) => {
                clearErrors('district_id');
                setValue('district_id', value);
                setValue('ward_id', null);
                getWard({ parent_id: value }).then((data) => setWards(mapDataOptions4SelectCustom(data)));
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Phường/xã' disabled={disabled}>
            <FormSelect field='ward_id' placeholder='Phường/xã' list={wards} />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Địa chỉ chi tiết' disabled={disabled}>
            <FormInput field='address_detail' placeholder='Khu phố/ Thôn/ Xóm/ Tổ/ Số nhà/ Đường' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default InstallmentPartnerInfo;
