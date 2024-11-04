import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import ICON_COMMON from 'utils/icons.common';
import { SOURCE_TYPES } from 'utils/constants';

import useCopyToClipboard from 'hooks/useCopyToClipboard';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import CustomerLeadService from 'services/customer-lead.service';
import { getBase64, getOptionSelected, mapDataOptions } from 'utils/helpers';
import ModalAffiliate from '../modals/ModalAffiliate';
import { useCustomerContext } from 'pages/Customer/utils/context';
import CustomerResetPassword from './CustomerResetPassword';
import { getListCarrer } from 'services/customer.service';
import { customerTypeOptions as TYPE_APPLY } from 'pages/CustomerType/utils/constants';
import { isValid } from 'pages/Customer/utils/formRules';

const CustomerInformation = ({ disabled }) => {
  const methods = useFormContext();
  const { account_id } = useParams();
  const { copy } = useCopyToClipboard();
  const watchPhoneNumber = methods.watch('phone_number');
  const affiliateLink = watchPhoneNumber ? `https://shopdunk.com/${watchPhoneNumber.replace(/^0+/, '')}` : '';

  const { isOpenModalAffiliate, openModalAffiliate } = useCustomerContext();
  const [modalReset, setModalReset] = useState(false);

  const [presenterOptions, setPresenterOptions] = useState([]);
  const customerTypeOptions = useGetOptions(optionType.customerType);
  const _customerTypeOptions = customerTypeOptions.filter((x) => x.type_apply === TYPE_APPLY[0].value);
  const sourceOptions = useGetOptions(optionType.source);
  const sourceSelected = getOptionSelected(sourceOptions, methods.watch('source_id'));

  const isFacebookSource = useMemo(() => sourceSelected.source_type === SOURCE_TYPES[0].value, [sourceSelected]);

  const fetchPresenterOptions = async (search, limit = 100) => {
    const _presenter = await CustomerLeadService.getOptionsPresenter({ search, limit });
    setPresenterOptions(mapDataOptions(_presenter));
  };

  useEffect(() => {
    fetchPresenterOptions();
  }, []);

  const renderAvatar = () => {
    if (methods.watch('image_avatar')) {
      return <img src={methods.watch('image_avatar')} alt='customer avatar' />;
    }
    return <img src='bw_image/default_avatar_v2.png' alt='customer avatar' />;
  };

  const [listCarrer, setListCarrer] = useState([]);
  const loadCareer = useCallback(() => {
    getListCarrer().then((p) => {
      setListCarrer(p?.data);
    });
  }, []);
  useEffect(loadCareer, [loadCareer]);

  return (
    <BWAccordion title='Thông tin khách hàng'>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <div className='bw_load_image bw_mb_2 bw_text_center'>
            <label className='bw_choose_image'>
              <input
                accept='image/*'
                type='file'
                onChange={async (_) => {
                  const getFile = await getBase64(_.target.files[0]);
                  methods.setValue('image_avatar', getFile);
                }}
              />
              {renderAvatar()}
            </label>
            <p>Kích thước ảnh: 500px*500px.</p>
          </div>
          <FormItem disabled={disabled} label='Nguồn'>
            <FormSelect type='text' field='source_id' list={sourceOptions} />
          </FormItem>
          <FormItem display='flex' label='Người giới thiệu' disabled={disabled}>
            <FormDebouneSelect
              style={{ width: '92%' }}
              field='presenter_id'
              showSearch
              options={presenterOptions}
              fetchOptions={fetchPresenterOptions}
              disabled={disabled}
              placeholder={'--Chọn--'}
              onChange={(value) => {
                methods.clearErrors('presenter_id');
                methods.setValue('presenter_id', value.value || value.id);
              }}
            />
            <span
              onClick={() => openModalAffiliate(true)}
              className='bw_btn bw_btn_success'
              style={{ height: 30, width: 30 }}>
              <i className={ICON_COMMON.add} style={{ marginTop: 5 }}></i>
            </span>
          </FormItem>
          <FormItem display='flex' disabled={disabled} label='Link giới thiệu'>
            <FormInput value={affiliateLink} />
            {affiliateLink && (
              <span
                onClick={() => copy(affiliateLink)}
                className='bw_btn bw_btn_success'
                style={{ height: 30, width: 30 }}>
                <i className='fa fa-copy' style={{ marginTop: 2 }}></i>
              </span>
            )}
          </FormItem>
          <FormItem label='Facebook ID' disabled={disabled}>
            <FormInput field='facebook_id' placeholder='Nhập Facebook' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_8'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormItem disabled isRequired label='Mã khách hàng'>
                <FormInput disabled placeholder='Mã khách hàng' field='customer_code' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem isRequired display='flex' disabled={disabled} label='Mật khẩu'>
                <FormInput
                  type='password'
                  field='password'
                  value={account_id ? '**************' : methods.watch('password')}
                  placeholder='Nhập mật khẩu'
                  validation={{
                    required: !account_id && 'Mật khẩu bắt buộc',
                  }}
                />
                {account_id && (
                  <span
                    onClick={() => setModalReset(true)}
                    className='bw_btn bw_btn_success'
                    style={{ height: 30, width: 30 }}>
                    <i className='fi fi-rr-refresh' style={{ marginTop: 5 }}></i>
                  </span>
                )}
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Hạng khách hàng' isRequired={true} disabled={disabled}>
                <FormSelect
                  field='customer_type_id'
                  list={_customerTypeOptions}
                  validation={{
                    required: 'Hạng khách hàng là bắt buộc',
                  }}
                  disabled={disabled}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Họ và tên'>
                <FormInput
                  type='text'
                  field='full_name'
                  placeholder='Nhập họ và tên khách hàng'
                  validation={{
                    required: 'Họ và tên là bắt buộc',
                    validate: (value) => {
                      if (!isValid(value)) {
                        return 'Họ và tên không hợp lệ';
                      }
                    }
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Giới tính'>
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
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Ngày/Tháng/Năm sinh'>
                <FormDatePicker
                  style={{
                    width: '100%',
                    padding: '2px 0px',
                  }}
                  placeholder='Nhập ngày sinh'
                  bordered={false}
                  field='birth_day'
                  format='DD/MM/YYYY'
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired={!isFacebookSource} label='Số điện thoại chính'>
                <FormInput
                  type='number'
                  field='phone_number'
                  validation={{
                    required: !isFacebookSource ? 'Số điện thoại là bắt buộc' : false,
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                      message: 'Số điện thoại không hợp lệ.',
                    },
                  }}
                  placeholder='Nhập số điện thoại khách hàng'
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Số điện thoại phụ'>
                <FormInput
                  type='number'
                  field='phone_number_secondary'
                  validation={{
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                      message: 'Số điện thoại phụ không hợp lệ.',
                    },
                  }}
                  placeholder='Nhập số điện thoại phụ khách hàng'
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Email'>
                <FormInput
                  type='text'
                  field='email'
                  placeholder='Nhập email'
                  validation={{
                    pattern: methods.watch('email') ? {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: 'Email không hợp lệ',
                    }: undefined,
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Zalo ID' disabled={disabled}>
                <FormInput field='zalo_id' placeholder='Nhập Zalo' disabled={disabled} />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} label='Nghề nghiệp'>
                <FormSelect
                  showSearch
                  field='career_id'
                  placeholder='Chọn nghề nghiệp'
                  list={listCarrer?.map((p) => {
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
        <div className='bw_col_4'></div>
      </div>
      {isOpenModalAffiliate && <ModalAffiliate />}
      {modalReset && <CustomerResetPassword onClose={() => setModalReset(false)} />}
    </BWAccordion>
  );
};

export default CustomerInformation;
