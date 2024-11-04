import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm, Controller, useFieldArray } from 'react-hook-form';
import { Alert, notification } from 'antd';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getBase64, showToast } from 'utils/helpers';

//service
import { getDetail, create, update } from 'services/company.service';
import { getOptionsCompanyType } from 'services/company-type.service';
import { getOptionsBanks } from 'services/bank.service';
import { getOptionsCountry } from 'services/country.service';
import { getOptionsProvince } from 'services/province.service';
import { getOptionsDistrict } from 'services/district.service';
import { getOptionsWard } from 'services/ward.service';
//utils
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormEditor from 'components/shared/BWFormControl/FormEditor';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import BWButton from 'components/shared/BWButton/index';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { readImageAsBase64 } from 'utils/helpers';

const SelectStyle = styled(Select)`
  display: flex;
  .ant-select-selector {
    font-size: 15px !important;
    width: 100%;
    padding: 0 !important;
  }
  .ant-select-arrow .anticon:not(.ant-select-suffix) {
    pointer-events: none;
  }
  .ant-select-selection-search {
    width: 100%;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
  }
`;
export default function CompanyAdd({ companyId = null, isEdit = true }) {
  const methods = useForm({
    defaultValues: {
      bank_accounts: [],
    },
  });
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
    control,
    clearErrors,
  } = methods;
  const [optionsCompanyType, setOptionsCompanyType] = useState(null);
  const [optionsBanks, setOptionsBanks] = useState(null);
  const [dataFile, setDataFile] = useState([]);
  const [optionsAddress, setOptionsAddress] = useState({
    optionsCountry: [],
    optionsProvince: [],
    optionsDistrict: [],
    optionsWard: [],
  });
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    register('is_active');
    register('bank_accounts');
  }, [register]);

  const handleFileUpload = async (_) => {
    const logo = _.target.files[0];
    const { size } = logo;
    if (size / 1000 > 500) {
      setError('logo_img', { type: 'custom', message: 'Dung lượng ảnh vượt quá 500kb.' });
      return;
    }
    const getFile = await getBase64(logo);
    methods.clearErrors('logo_img');
    setValue('logo_img', getFile);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bank_accounts',
    rules: {
      required: false,
      validate: (field) => {
        if (field?.length > 0 && field.findIndex((_) => !_.bank_account_name) !== -1) {
          return `Nhập chủ tài khoản ngân hàng dòng thứ ${field.findIndex((_) => !_.bank_account_name) + 1}`;
        }
        if (field?.length > 0 && field.findIndex((_) => !_.bank_number) !== -1) {
          return `Nhập số chủ tài khoản ngân hàng dòng thứ ${field.findIndex((_) => !_.bank_number) + 1}`;
        }
        if (field?.length > 0 && field.findIndex((_) => !_.bank_id) !== -1) {
          return `Chọn ngân hàng dòng thứ ${field.findIndex((_) => !_.bank_id) + 1}`;
        }
        if (field?.length > 0 && field.filter((_) => _.is_default).length === 0) {
          return 'Ngân hàng mặc định là bắt buộc';
        }
        if (field?.length > 0 && field.filter((_) => _.is_default).length > 1) {
          return 'Chỉ chọn một ngân hàng làm ngân hàng mặc định';
        }
      },
    },
  });
  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
  };
  const getDataOptions = async () => {
    let _company_type = await getOptionsCompanyType();
    setOptionsCompanyType(mapDataOptions4Select(_company_type));
    let _bank = await getOptionsBanks();
    const _optionBank = _bank.map((item) => ({
      ...item,
      label: item.code + ' - ' + item.name,
      value: item.id * 1,
    }));
    setOptionsBanks(_optionBank);

    let _country = await getOptionsCountry();
    let _province = await getOptionsProvince();
    let opts = {};
    if (companyId) {
      let _district = await getOptionsDistrict({ parent_id: watch('province_id') });
      let _ward = await getOptionsWard({ parent_id: watch('district_id') });
      opts.district = mapDataOptions4SelectCustom(_district);
      opts.ward = mapDataOptions4SelectCustom(_ward);
    }
    setOptionsAddress({
      optionsCountry: mapDataOptions4SelectCustom([_country[0]]),
      optionsProvince: mapDataOptions4SelectCustom(_province),
      optionsDistrict: opts.district,
      optionsWard: opts.ward,
    });
  };
  useEffect(() => {
    getDataOptions();
  }, []);
  const getData = useCallback(() => {
    try {
      if (companyId) {
        getDetail(companyId)
          .then((data) => {
            if (data) {
              reset({
                ...data,
              });
              if (data.is_active !== 1) {
                reset({
                  ...data,
                  is_system: 1,
                });
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        reset({
          is_active: 1,
          country_id: 6,
        });
      }
    } catch (error) {}
  }, [companyId]);
  useEffect(getData, [getData]);

  const onSubmit = async (values) => {
    try {
      if (companyId) {
        await update(companyId, values);
        showToast.success('Cập nhật công ty thành công!!!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        await create(values);
        showToast.success('Thêm mới công ty thành công!!!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        reset({ is_active: 1 });
      }
      setAlerts([]);
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('<br/>');
      setAlerts([{ type: 'error', msg }]);
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  const handleChangeAddress = async (value, field) => {
    if (field == 'country_id') {
      let _province = await getOptionsProvince({ parent_id: value });
      setOptionsAddress({
        ...optionsAddress,
        optionsProvince: mapDataOptions4SelectCustom(_province),
      });
      setValue('province_id', null);
      setValue('district_id', null);
      setValue('ward_id', null);
    } else if (field == 'province_id') {
      let _district = await getOptionsDistrict({ parent_id: value });
      setOptionsAddress({
        ...optionsAddress,
        optionsDistrict: mapDataOptions4SelectCustom(_district),
      });
      setValue('district_id', null);
      setValue('ward_id', null);
    } else {
      let _ward = await getOptionsWard({ parent_id: value });
      setOptionsAddress({
        ...optionsAddress,
        optionsWard: mapDataOptions4SelectCustom(_ward),
      });
      setValue('ward_id', null);
    }
    methods.clearErrors(field);
    setValue(field, value);
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {/* general alerts */}
        {alerts.map(({ type, msg }, idx) => {
          return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
        })}
        <div className='bw_row bw_mt_2'>
          <div className='bw_col_3'>
            <ul className='bw_control_form'>
              <li onClick={() => handleScrollToFormItem('bw_info_cus')}>
                <a
                  data-href='#bw_info_cus'
                  className={`${
                    Boolean(
                      watch('company_name') &&
                        watch('company_type_id') &&
                        watch('open_date') &&
                        watch('phone_number') &&
                        watch('email') &&
                        watch('fax'),
                    )
                      ? 'bw_active'
                      : ''
                  }`}>
                  <span className='fi fi-rr-check' />
                  Thông tin công ty
                </a>
              </li>

              <li onClick={() => handleScrollToFormItem('bw_address_com')}>
                <a
                  data-href='#bw_address_com'
                  className={`${
                    Boolean(
                      watch('country_id') &&
                        watch('province_id') &&
                        watch('district_id') &&
                        watch('ward_id') &&
                        watch('address'),
                    )
                      ? 'bw_active'
                      : ''
                  }`}>
                  <span className='fi fi-rr-check' />
                  Địa chỉ
                </a>
              </li>
              <li onClick={() => handleScrollToFormItem('bw_bank_com')}>
                <a data-href='#bw_bank_com' className={`${Boolean(watch('bank_accounts')) ? 'bw_active' : ''}`}>
                  <span className='fi fi-rr-check' />
                  Tài khoản ngân hàng
                </a>
              </li>
              <li onClick={() => handleScrollToFormItem('bw_mores')}>
                <a data-href='#bw_mores' className='bw_active'>
                  <span className='fi fi-rr-check' /> Trạng thái
                </a>
              </li>
            </ul>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <BWAccordion title='Thông tin công ty' id='bw_info_cus'>
                  <div className='bw_row'>
                    <div className='bw_col_4'>
                      <FormItem label='Tên công ty' isRequired disabled={!isEdit}>
                        <FormInput
                          type='text'
                          field='company_name'
                          placeholder='Nhập tên công ty'
                          validation={{
                            required: 'Tên công ty là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem label='Loại hình tổ chức' isRequired disabled={!isEdit}>
                        <FormSelect
                          field='company_type_id'
                          list={optionsCompanyType}
                          validation={{
                            required: 'Loại hình công ty là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem label='Ngày thành lập' disabled={!isEdit}>
                        <FormDatePicker
                          field='open_date'
                          placeholder={'dd/mm/yyyy'}
                          style={{
                            width: '100%',
                          }}
                          format='DD/MM/YYYY'
                          bordered={false}
                          allowClear
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem label='Số điện thoại' isRequired disabled={!isEdit}>
                        <FormInput
                          type='text'
                          field='phone_number'
                          placeholder='Số điện thoại'
                          validation={{
                            required: 'Số điện thoại là bắt buộc',
                            pattern: {
                              value:
                                /^((\\+[1-9]{1,4}[ \\-]*)|((?!0[0-9])\d+$)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                              message: 'Số điện thoại không hợp lệ',
                            },
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem label='Email' isRequired disabled={!isEdit}>
                        <FormInput
                          type='text'
                          field='email'
                          placeholder='Email'
                          validation={{
                            required: 'Email là bắt buộc',
                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: 'Email không hợp lệ',
                            },
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem label='Mã số thuế' disabled={!isEdit}>
                        <FormInput type='text' field='fax' placeholder='Mã số thuế' disabled={!isEdit} />
                      </FormItem>
                    </div>
                    <div className='bw_col_12 bw_mb_2'>
                      <FormItem label='Logo' disabled={!isEdit}>
                          <input
                              type='file'
                              field='logo_img'
                              name='logo_img'
                              accept='image/*'
                              onChange={(e) => handleFileUpload(e)}
                          />
                          {watch('logo_img') && (
                            <img style={{ width: '15%', marginTop: '0.5em', padding: '0.5em', border: '1px dashed' }} src={watch('logo_img') ?? ''}></img>
                          )}
                      </FormItem>
                    </div>
                    <div className='bw_col_12'>
                      <FormItem label='Mô tả' disabled={!isEdit}>
                        <FormTextArea field='descriptions' rows={3} disabled={!isEdit} placeholder='Mô tả' />
                      </FormItem>
                    </div>
                  </div>
                </BWAccordion>
                <BWAccordion title='Địa chỉ' id='bw_address_com' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_4'>
                      <FormItem label='Quốc gia' isRequired disabled={!isEdit}>
                        <Controller
                          name='country_id'
                          control={control}
                          rules={{ required: 'Quốc gia là bắt buộc' }}
                          render={({ field }) => (
                            <SelectStyle
                              {...field}
                              suffixIcon={<CaretDownOutlined />}
                              bordered={false}
                              allowClear
                              showSearch
                              placeholder='--Chọn--'
                              optionFilterProp='children'
                              disabled={!isEdit}
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              value={watch('country_id')}
                              options={optionsAddress.optionsCountry}
                              onChange={(value) => {
                                handleChangeAddress(value, 'country_id');
                              }}
                            />
                          )}
                        />

                        {errors['country_id'] && <ErrorMessage message={errors['country_id']?.message} />}
                        {/* <FormSelect
                          field='country_id'
                          list={optionsAddress.optionsCountry}
                          validation={{
                            required: 'Quốc gia là bắt buộc',
                          }}
                          disabled={!isEdit}
                        /> */}
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem label='Tỉnh/Thành phố' isRequired disabled={!isEdit}>
                        <Controller
                          name='province_id'
                          control={control}
                          rules={{ required: 'Tỉnh/Thành phố là bắt buộc' }}
                          render={({ field }) => (
                            <SelectStyle
                              {...field}
                              suffixIcon={<CaretDownOutlined />}
                              bordered={false}
                              allowClear
                              showSearch
                              placeholder='--Chọn--'
                              optionFilterProp='children'
                              disabled={!isEdit}
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              value={watch('province_id')}
                              options={optionsAddress.optionsProvince}
                              onChange={(value) => {
                                handleChangeAddress(value, 'province_id');
                              }}
                            />
                          )}
                        />

                        {errors['province_id'] && <ErrorMessage message={errors['province_id']?.message} />}
                        {/* <FormSelect
                          field='province_id'
                          list={optionsAddress.optionsProvince}
                          validation={{
                            required: 'Tỉnh/Thành phố là bắt buộc',
                          }}
                          disabled={!isEdit}
                        /> */}
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem label='Quận/Huyện' isRequired disabled={!isEdit}>
                        <Controller
                          name='district_id'
                          control={control}
                          rules={{ required: 'Quận/Huyện là bắt buộc' }}
                          render={({ field }) => (
                            <SelectStyle
                              {...field}
                              suffixIcon={<CaretDownOutlined />}
                              bordered={false}
                              allowClear
                              showSearch
                              placeholder='--Chọn--'
                              optionFilterProp='children'
                              disabled={!isEdit}
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              value={watch('district_id')}
                              options={optionsAddress.optionsDistrict}
                              onChange={(value) => {
                                handleChangeAddress(value, 'district_id');
                              }}
                            />
                          )}
                        />

                        {errors['district_id'] && <ErrorMessage message={errors['district_id']?.message} />}
                        {/* <FormSelect
                          field='district_id'
                          list={optionsAddress.optionsDistrict}
                          validation={{
                            required: 'Quận/Huyện là bắt buộc',
                          }}
                          disabled={!isEdit}
                        /> */}
                      </FormItem>
                    </div>
                    <div className='bw_col_4'>
                      <FormItem label='Phường/Xã' isRequired disabled={!isEdit}>
                        <FormSelect
                          field='ward_id'
                          list={optionsAddress.optionsWard}
                          validation={{
                            required: 'Phường/Xã là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_8'>
                      <FormItem label='Số nhà, tên đường' isRequired disabled={!isEdit}>
                        <FormInput
                          type='text'
                          field='address'
                          placeholder='VD: 46 Cửu Long'
                          validation={{
                            required: 'Địa chỉ là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                  </div>
                </BWAccordion>
                <BWAccordion title='Tài khoản ngân hàng' id='bw_bank_com' isRequired={false}>
                  <div>
                    <div className='bw_table_responsive'>
                      <table className='bw_table'>
                        <thead>
                          <tr>
                            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
                            <th className='bw_text_center'>Chủ tài khoản</th>
                            <th className='bw_text_center'>Số tài khoản</th>
                            <th className='bw_text_center'>Ngân hàng</th>
                            <th className='bw_text_center'>Chi nhánh</th>
                            <th className='bw_text_center'>SwiftCode</th>
                            <th className='bw_text_center'>Mặc định</th>
                            <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields && fields.length > 0 ? (
                            (fields || []).map((item, index) => {
                              return (
                                item && (
                                  <tr key={index}>
                                    <td className='bw_text_center'>{index + 1}</td>
                                    <td>
                                      <FormInput
                                        type='text'
                                        field={`bank_accounts.${index}.bank_account_name`}
                                        placeholder='Chủ tài khoản'
                                        className='bw_inp bw_mw_2'
                                        disabled={!isEdit}
                                      />
                                    </td>
                                    <td>
                                      <FormInput
                                        type='text'
                                        field={`bank_accounts.${index}.bank_number`}
                                        placeholder='Số tài khoản'
                                        className='bw_inp bw_mw_2'
                                        disabled={!isEdit}
                                        validation={{
                                          pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Số tài khoản chỉ bao gồm toàn số',
                                          },
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <FormSelect
                                        field={`bank_accounts.${index}.bank_id`}
                                        list={optionsBanks}
                                        placeholder='Chọn ngân hàng'
                                        className='bw_inp bw_mw_2'
                                        disabled={!isEdit}
                                        showSearch
                                      />
                                    </td>
                                    <td>
                                      <FormInput
                                        type='text'
                                        field={`bank_accounts.${index}.bank_branch`}
                                        placeholder='Chi nhánh'
                                        className='bw_inp bw_mw_2'
                                        disabled={!isEdit}
                                      />
                                    </td>
                                    <td>
                                      <FormInput
                                        type='text'
                                        field={`bank_accounts.${index}.bank_code`}
                                        placeholder='SwiftCode'
                                        className='bw_inp bw_mw_2'
                                        disabled={!isEdit}
                                      />
                                    </td>
                                    <td className='bw_text_center'>
                                      <label className='bw_checkbox' style={{ marginRight: 0 }}>
                                        <FormInput
                                          type='checkbox'
                                          field={`bank_accounts.${index}.is_default`}
                                          className='bw_inp bw_mw_2'
                                          disabled={!isEdit}
                                        />
                                        <span style={{ marginRight: 0 }} />
                                      </label>
                                    </td>
                                    <td className='bw_sticky bw_action_table bw_text_center'>
                                      {isEdit && (
                                        <a className='bw_btn_table bw_delete bw_red' onClick={() => remove(index)}>
                                          <i className='fi fi-rr-trash' />
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                )
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {errors['bank_accounts'] && <ErrorMessage message={errors?.bank_accounts?.root?.message} />}

                    {/* {errors['bank_accounts'] && <ErrorMessage message={errors['bank_accounts']?.message} />} */}
                    {errors['bank_accounts'] &&
                      errors['bank_accounts'].length > 0 &&
                      errors['bank_accounts'].map((item, idx) => {
                        return (
                          <ErrorMessage
                            message={`Thêm đầy đủ thông tin tài khoản ngân hàng dòng số ${idx + 1} `}
                            key={idx}
                          />
                        );
                      })}

                    {isEdit && (
                      <a
                        data-href
                        className='bw_btn_outline bw_btn_outline_success bw_add_us'
                        onClick={() => append({})}>
                        <span className='fi fi-rr-plus' /> Thêm tài khoản
                      </a>
                    )}
                  </div>
                </BWAccordion>
                <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_12'>
                      <div className='bw_frm_box'>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                          <label className='bw_checkbox'>
                            <FormInput
                              type='checkbox'
                              field='is_active'
                              value={watch('is_active')}
                              disabled={!isEdit}
                            />
                            <span />
                            Kích hoạt
                          </label>
                          <label className='bw_checkbox'>
                            <FormInput type='checkbox' field='is_system' disabled={!isEdit} />
                            <span />
                            Hệ thống
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </BWAccordion>
                <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
                  {isEdit ? (
                    <BWButton
                      type='success'
                      submit
                      icon='fi fi-rr-check'
                      content={companyId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
                      onClick={handleSubmit(onSubmit)}
                    />
                  ) : (
                    <BWButton
                      type='success'
                      outline
                      content='Chỉnh sửa'
                      onClick={() => window._$g.rdr(`/company/edit/${companyId}`)}
                    />
                  )}
                  <BWButton type='' outline content='Đóng' onClick={() => window._$g.rdr('/company')} />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
