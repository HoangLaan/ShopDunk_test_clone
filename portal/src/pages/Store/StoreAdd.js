import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { Select } from 'antd';
//service
import { getDetail, update } from 'services/store.service';
//utils
import { getBase64, showToast } from 'utils/helpers';
import { mapDataOptions4Select } from 'utils/helpers';
//helpers
import { getControlActive } from 'pages/Store/helpers';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWButton from 'components/shared/BWButton/index';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import BWAddress, { DEFAULT_COUNTRY_ID } from 'components/shared/BWAddress';
import IpAddress from 'pages/Store/components/IpAddress';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import ModalStock from 'pages/Store/components/ModalStock';
import { sizeTypeOptions, storeStatusOptions } from 'pages/Store/helpers/';
import { Empty } from 'antd';
import { TYPE_STORE_PANEL } from 'pages/Store/helpers/constants';
import { getUserOptions } from 'services/user-level-history.service';
import { LoadingOutlined } from '@ant-design/icons';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import useDetectHookFormChange from 'hooks/useDetectHookFormChange';
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

export default function StoreAdd({ storeId = null, isEdit = true }) {
  const methods = useForm();
  const areaData = useGetOptions(optionType.area);
  const companyData = useGetOptions(optionType.company);
  const clusterData = useGetOptions(optionType.cluster);
  const businessData = useGetOptions(optionType.business, {
    params: { company_id: methods.watch('company_id') },
  });
  const bankData = useGetOptions(optionType.bank);
  const storeTypeData = useGetOptions(optionType.storeType);
  const brandData = useGetOptions(optionType.brand);

  const [typePanel, setTypePanel] = useState(TYPE_STORE_PANEL.GENERAL);
  const [modalStock, setModalStock] = useState(undefined);
  const [userData, setUserData] = useState([]);

  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  // useDetectHookFormChange()
  // console.log('store', methods.watch())

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bank_accounts',
    rules: {
      required: false,
    },
  });

  useEffect(() => {
    register('is_active');
    register('banner_url');
    register('stock_list');
  }, [methods]);

  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
  };

  const getData = useCallback(() => {
    if (storeId) {
      getDetail(storeId).then((data) => {
        if (data) {
          reset(data);
        }
      });
    } else {
      reset({
        is_active: 1,
        country_id: DEFAULT_COUNTRY_ID,
      });
    }
  }, [storeId]);

  useEffect(getData, [getData]);
  const onSubmit = async (values) => {
    try {
      if (storeId) {
        await update(storeId, values);
        showToast.success('Cập nhật cửa hàng thành công');
      } else {
        setModalStock(true);
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  useEffect(() => {
    getUserOptions('', 1).then((res) => setUserData(res));
  }, []);
  // useEffect(() => {
  //   dispatch(
  //     getOptionsGlobal('business', {
  //       company_id: methods.watch('company_id'),
  //     }),
  //   );
  // }, [methods.watch('company_id')]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ul className='bw_tabs'>
          <li
            onClick={() => setTypePanel(TYPE_STORE_PANEL.GENERAL)}
            className={typePanel === TYPE_STORE_PANEL.GENERAL ? 'bw_active' : ''}>
            <a className='bw_link'>Thông tin chung</a>
          </li>
          <li
            onClick={() => setTypePanel(TYPE_STORE_PANEL.DETAIL)}
            className={typePanel === TYPE_STORE_PANEL.DETAIL ? 'bw_active' : ''}>
            <a className='bw_link'>Thông tin chi tiết</a>
          </li>
          <li
            onClick={() => setTypePanel(TYPE_STORE_PANEL.IP)}
            className={typePanel === TYPE_STORE_PANEL.IP ? 'bw_active' : ''}>
            <a className='bw_link'>Thông tin IP</a>
          </li>
        </ul>
        <div className='bw_row bw_mt_2'>
          <div className='bw_col_3'>
            <ul className='bw_control_form'>
              {Boolean(typePanel === TYPE_STORE_PANEL.GENERAL) && (
                <>
                  <li onClick={() => handleScrollToFormItem('bw_info')}>
                    <a data-href='#bw_info' className={getControlActive('info', watch) ? 'bw_active' : ''}>
                      <span className='fi fi-rr-check' /> Thông tin cửa hàng
                    </a>
                  </li>
                  <li onClick={() => handleScrollToFormItem('bw_info')}>
                    <a data-href='#bw_info' className={getControlActive('bank_info', watch) ? 'bw_active' : ''}>
                      <span className='fi fi-rr-check' /> Tài khoản ngân hàng
                    </a>
                  </li>
                  <li onClick={() => handleScrollToFormItem('bw_mores')}>
                    <a data-href='#bw_mores' className={getControlActive('status', watch) ? 'bw_active' : ''}>
                      <span className='fi fi-rr-check' /> Trạng thái
                    </a>
                  </li>
                </>
              )}

              {Boolean(typePanel === TYPE_STORE_PANEL.DETAIL) && (
                <>
                  <li onClick={() => handleScrollToFormItem('bw_detail')}>
                    <a data-href='#bw_address' className={getControlActive('bw_detail', watch) ? 'bw_active' : ''}>
                      <span className='fi fi-rr-check' /> Thông tin chi tiết
                    </a>
                  </li>
                  <li onClick={() => handleScrollToFormItem('bw_address')}>
                    <a data-href='#bw_address' className={getControlActive('address', watch) ? 'bw_active' : ''}>
                      <span className='fi fi-rr-check' /> Địa chỉ cửa hàng
                    </a>
                  </li>
                </>
              )}
              {Boolean(typePanel === TYPE_STORE_PANEL.IP) && (
                <li onClick={() => handleScrollToFormItem('bw_ipaddress')}>
                  <a data-href='#bw_ipaddress' className={getControlActive('ip', watch) ? 'bw_active' : ''}>
                    <span className='fi fi-rr-check' /> Địa chỉ IP
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {Boolean(typePanel === TYPE_STORE_PANEL.GENERAL) && (
                  <>
                    <BWAccordion title='Thông tin cửa hàng' id='bw_info' isRequired={true}>
                      <div className='bw_row'>
                        <div className='bw_col_6'>
                          <FormItem label='Công ty' isRequired={true}>
                            <FormSelect
                              disabled={!isEdit}
                              field='company_id'
                              list={mapDataOptions4Select(companyData)}
                              validation={{
                                required: 'Công ty là bắt buộc',
                              }}
                            />
                          </FormItem>
                          <FormItem disabled={!isEdit || !methods.watch('company_id')} label='Miền' isRequired={true}>
                            <FormSelect
                              disabled={!isEdit || !methods.watch('company_id')}
                              field='business_id'
                              list={mapDataOptions4Select(businessData)}
                              validation={{
                                required: 'Miền công ty là bắt buộc',
                              }}
                            />
                          </FormItem>
                        </div>

                        <div className='bw_col_6'>
                          <FormItem label='Khu vực' isRequired={true}>
                            <FormSelect
                              field='area_id'
                              list={mapDataOptions4Select(areaData)}
                              validation={{
                                required: 'Khu vực là bắt buộc',
                              }}
                              disabled={!isEdit}
                            />
                          </FormItem>
                          <FormItem label='Cụm'>
                            <FormSelect
                              field='cluster_id'
                              list={mapDataOptions4Select(clusterData)}
                              // validation={{
                              //   required: 'Cụm là bắt buộc',
                              // }}
                              disabled={!isEdit}
                            />
                          </FormItem>
                        </div>
                        <div className='bw_col_4'></div>
                        <div className='bw_col_12'>
                          <FormItem label='Tên cửa hàng' isRequired={true}>
                            <FormInput
                              type='text'
                              field='store_name'
                              placeholder='Tên cửa hàng'
                              validation={{
                                required: 'Tên cửa hàng là bắt buộc',
                                maxLength: {
                                  value: 100,
                                  message: 'Tên cửa hàng tối đa 100 ký tự.',
                                },
                              }}
                              disabled={!isEdit}
                            />
                          </FormItem>
                        </div>
                        <div className='bw_col_6'>
                          <FormItem label='Mã cửa hàng' isRequired={true}>
                            <FormInput
                              disabled={!isEdit}
                              type='text'
                              field='store_code'
                              placeholder='Mã cửa hàng'
                              validation={{
                                required: 'Mã cửa hàng là bắt buộc',
                                maxLength: {
                                  value: 10,
                                  message: 'Mã cửa hàng tối đa 10 ký tự.',
                                },
                              }}
                            />
                          </FormItem>
                          <FormItem label='Loại cửa hàng' isRequired={true}>
                            <FormSelect
                              disabled={!isEdit}
                              type='text'
                              field='store_type_id'
                              placeholder='Loại cửa hàng'
                              list={mapDataOptions4Select(storeTypeData)}
                              validation={{
                                required: 'Loại cửa hàng là bắt buộc',
                              }}
                            />
                          </FormItem>
                          <FormItem label='Tuổi của shop'>
                            <FormSelect
                              field='age_store'
                              list={[
                                {
                                  value: 1,
                                  label: 'NSO',
                                },
                                {
                                  value: 2,
                                  label: 'LFL',
                                },
                                {
                                  value: 3,
                                  label: 'STU',
                                },
                              ]}
                              // validation={{
                              //   required: 'Tuổi là bắt buộc',
                              // }}
                              disabled={!isEdit}
                            />
                          </FormItem>
                          <FormItem label='Ngày khai trương'>
                            <FormInput type='date' field='opening_day' disabled={!isEdit} />
                          </FormItem>
                          <FormItem label='Trạng thái hoạt động' isRequired={true}>
                            <FormSelect
                              field='status_type'
                              list={storeStatusOptions}
                              validation={{
                                required: 'Trạng thái hoạt động là bắt buộc',
                              }}
                              disabled={!isEdit}
                            />
                          </FormItem>
                        </div>
                        <div className='bw_col_6'>
                          <FormItem label='Thương hiệu' isRequired={true}>
                            <FormSelect
                              field='brand_id'
                              list={mapDataOptions4Select(brandData)}
                              validation={{
                                required: 'Thương hiệu là bắt buộc',
                              }}
                              disabled={!isEdit}
                            />
                          </FormItem>

                          <FormItem label='Mô hình' isRequired={true}>
                            <FormSelect
                              field='architecture_type'
                              list={[
                                {
                                  value: 1,
                                  label: 'Mono',
                                },
                                {
                                  value: 2,
                                  label: 'PPG',
                                },
                              ]}
                              validation={{
                                required: 'Mô hình là bắt buộc',
                              }}
                              disabled={!isEdit}
                            />
                          </FormItem>
                          <FormItem label='Số điện thoại' isRequired={true}>
                            <FormInput
                              type='text'
                              field='phone_number'
                              placeholder='Số điện thoại'
                              validation={{
                                required: 'Số điện thoại là bắt buộc',
                                pattern: {
                                  value: /^[0-9]+$/,
                                  message: 'Số điện thoại phải là số.',
                                },
                                maxLength: {
                                  value: 10,
                                  message: 'Số điện thoại không hợp lệ.',
                                },
                                minLength: {
                                  value: 10,
                                  message: 'Số điện thoại không hợp lệ.',
                                },
                              }}
                              disabled={!isEdit}
                            />
                          </FormItem>
                          <FormItem label='Ngày đóng cửa'>
                            <FormInput type='date' field='closing_day' disabled={!isEdit} />
                          </FormItem>
                        </div>
                      </div>
                    </BWAccordion>
                    <BWAccordion title='Tài khoản ngân hàng' id='bw_bank_com' isRequired={false}>
                      <div>
                        {isEdit && (
                          <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '1em' }}>
                            <a data-href className='bw_btn_outline bw_btn_outline_success' onClick={() => append({})}>
                              <span className='fi fi-rr-plus' /> Thêm tài khoản
                            </a>
                          </div>
                        )}
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
                                          />
                                        </td>
                                        <td style={{ width: 500 }}>
                                          <Select
                                            showSearch
                                            placeholder='Chọn ngân hàng'
                                            size='middle'
                                            defaultValue={watch(`bank_accounts.${index}.bank_id`) || undefined}
                                            onChange={(value) =>
                                              methods.setValue(`bank_accounts.${index}.bank_id`, value)
                                            }
                                            options={mapDataOptions4Select(bankData)}
                                            disabled={!isEdit}
                                            style={{ with: 500 }}
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
                                <td colSpan={8}>
                                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không tìm thấy dữ liệu' />
                                </td>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </BWAccordion>
                    <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
                      <div className='bw_row'>
                        <div className='bw_col_12'>
                          <div className='bw_frm_box'>
                            <div className='bw_flex bw_align_items_center bw_lb_sex'>
                              <label className='bw_checkbox'>
                                <FormInput
                                  disabled={!isEdit}
                                  type='checkbox'
                                  field='is_active'
                                  value={watch('is_active')}
                                />
                                <span />
                                Kích hoạt
                              </label>
                              <label className='bw_checkbox'>
                                <FormInput
                                  disabled={!isEdit}
                                  type='checkbox'
                                  field='is_system'
                                  value={watch('is_system')}
                                />
                                <span />
                                Hệ thống
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </BWAccordion>
                  </>
                )}

                {Boolean(typePanel === TYPE_STORE_PANEL.DETAIL) && (
                  <>
                    <BWAccordion title='Thông tin chi tiết' id='bw_infortion' isRequired={false}>
                      <div className='bw_row'>
                        <FormItem className='bw_col_6' label='Diện tích kinh doanh(m²)'>
                          <FormNumber
                            field='acreage'
                            // validation={{
                            //   required: 'Diện tích kinh doanh là bắt buộc',
                            // }}
                            type='number'
                            placeholder='Nhập diện tích'
                            disabled={!isEdit}
                          />
                        </FormItem>
                        <FormItem className='bw_col_6' label='Size'>
                          <FormSelect
                            field='size_type'
                            type='size'
                            list={sizeTypeOptions}
                            placeholder='--Chọn--'
                            // validation={{
                            //   required: 'Size là bắt buộc',
                            // }}
                          />
                        </FormItem>
                        <FormItem className='bw_col_6' label='Giờ mở cửa' isRequired={true}>
                          <FormInput
                            type='time'
                            field='open_time'
                            placeholder='Giờ mở cửa'
                            validation={{
                              required: 'Giờ mở cửa là bắt buộc',
                              pattern: {
                                value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                                message: 'Giờ mở cửa không hợp lệ.',
                              },
                            }}
                            disabled={!isEdit}
                          />
                        </FormItem>
                        <FormItem className='bw_col_6' label='Giờ đóng cửa' isRequired={true}>
                          <FormInput
                            type='time'
                            field='close_time'
                            placeholder='Giờ đóng cửa'
                            validation={{
                              required: 'Giờ đóng cửa là bắt buộc',
                              pattern: {
                                value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                                message: 'Giờ đóng cửa không hợp lệ.',
                              },
                            }}
                            disabled={!isEdit}
                          />
                        </FormItem>
                        <FormItem className='bw_col_6' label='Quản lý cửa hàng'>
                          <FormDebouneSelect
                            field='management'
                            fetchOptions={getUserOptions}
                            // validation={{
                            //   required: 'Quản lý cửa hàng là bắt buộc',
                            // }}
                            disabled={!isEdit}
                            allowClear={true}
                            placeholder='Chọn người quản lý'
                          />
                        </FormItem>
                        <FormItem className='bw_col_6' label='Phó cửa hàng'>
                          <FormDebouneSelect
                            field='store_assistants'
                            fetchOptions={() => getUserOptions('', 1)}
                            list={mapDataOptions4Select(userData)}
                            mode={'tags'}
                            disabled={!isEdit}
                            allowClear={true}
                            placeholder='Chọn phó cửa hàng'
                          />
                        </FormItem>
                        {!isEdit && (
                          <FormItem className='bw_col_6' label='Số điện thoại quản lý cửa hàng' isRequired={true}>
                            <FormInput disabled type='text' field='phone_number_manager' placeholder='Số điện thoại' />
                          </FormItem>
                        )}
                        <FormItem className='bw_col_12' label='Mô tả'>
                          <FormTextArea field='description' />
                        </FormItem>
                      </div>
                    </BWAccordion>
                    <BWAccordion title='Địa chỉ cửa hàng' id='bw_address' isRequired={false}>
                      <div className='bw_row'>
                        <FormItem className='bw_col_4' label='Quốc gia' isRequired={true}>
                          <BWAddress
                            field='country_id'
                            type='country'
                            placeholder='Chọn'
                            validation={{
                              required: 'Quốc gia là bắt buộc.',
                            }}
                          />
                        </FormItem>
                        <FormItem className='bw_col_4' label='Tỉnh/Thành phố' isRequired={true}>
                          <BWAddress
                            field='province_id'
                            type='province'
                            placeholder='Chọn'
                            validation={{
                              required: 'Tỉnh/Thành phố là bắt buộc.',
                            }}
                          />
                        </FormItem>
                        <FormItem className='bw_col_4' label='Quận/Huyện' isRequired={true}>
                          <BWAddress
                            field='district_id'
                            type='district'
                            placeholder='Chọn'
                            validation={{
                              required: 'Quận/Huyện phố là bắt buộc.',
                            }}
                          />
                        </FormItem>
                        <FormItem className='bw_col_4' label='Phường/Xã' isRequired={true}>
                          <BWAddress
                            field='ward_id'
                            type='ward'
                            placeholder='Chọn'
                            validation={{
                              required: 'Phường/Xã phố là bắt buộc.',
                            }}
                          />
                        </FormItem>
                        <FormItem className='bw_col_8' label='Số nhà, tên đường' isRequired={true}>
                          <FormInput
                            type='text'
                            field='address'
                            placeholder='VD: 46 Cửu long'
                            validation={{
                              required: 'Số nhà, tên đường là bắt buộc',
                            }}
                            disabled={!isEdit}
                          />
                        </FormItem>
                        <div className='bw_col_12'>
                          <p className='bw_titleS'>
                            Kinh độ - Vĩ độ cửa hàng | <a>Tham khảo cách lấy kinh độ, vĩ độ</a>
                          </p>
                          <div className='bw_row'>
                            <FormItem className='bw_col_6' label='Kinh độ' isRequired={true}>
                              <FormInput
                                type='text'
                                field='location_x'
                                placeholder='Kinh độ'
                                validation={{
                                  required: 'Kinh độ là bắt buộc',
                                  pattern: {
                                    value: /^[0-9.,]+$/,
                                    message: 'Kinh độ phải là số.',
                                  },
                                }}
                                disabled={!isEdit}
                              />
                            </FormItem>
                            <FormItem className='bw_col_6' label='Vĩ độ' isRequired={true}>
                              <FormInput
                                type='text'
                                field='location_y'
                                placeholder='Vĩ độ'
                                validation={{
                                  required: 'Vĩ độ là bắt buộc',
                                  pattern: {
                                    value: /^[0-9.,]+$/,
                                    message: 'Vĩ độ phải là số.',
                                  },
                                }}
                                disabled={!isEdit}
                              />
                            </FormItem>
                          </div>
                        </div>
                        <div className='bw_col_12'>
                          <p className='bw_titleS'>
                            Google maps | <a href='#!'>Tham khảo cách lấy</a>
                          </p>
                          <div className='bw_frm_box'>
                            <FormTextArea field='map_url' placeholder='Google map' />
                          </div>
                        </div>
                      </div>
                    </BWAccordion>
                    {/* Images */}
                    <BWAccordion title='Hình ảnh' id='bw_image' isRequired={false}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          textAlign: 'center',
                        }}>
                        <span className='bw_col_6'>
                          <b>Banner</b>
                          <div className='bw_load_image bw_mb_2 bw_mt_2 bw_text_center'>
                            <label className='bw_choose_image'>
                              <input
                                type='file'
                                accept='image/*'
                                disabled={!isEdit}
                                onChange={async (_) => {
                                  const getFile = await getBase64(_.target.files[0]);
                                  methods.setValue('banner_url', getFile);
                                }}
                              />
                              {methods.watch('banner_url') ? (
                                <img alt='logo' style={{ width: '100%' }} src={methods.watch('banner_url') ?? ''}></img>
                              ) : (
                                <span className='fi fi-rr-picture' />
                              )}
                            </label>
                          </div>
                        </span>
                        <span className='bw_col_6'>
                          <b>Ảnh cửa hàng</b>
                          <div className='bw_load_image bw_mb_2 bw_mt_2 bw_text_center'>
                            <label className='bw_choose_image'>
                              <input
                                type='file'
                                accept='image/*'
                                disabled={!isEdit}
                                onChange={async (_) => {
                                  const getFile = await getBase64(_.target.files[0]);
                                  methods.setValue('store_image_url', getFile);
                                }}
                              />
                              {methods.watch('store_image_url') ? (
                                <img
                                  alt='logo'
                                  style={{ width: '100%' }}
                                  src={methods.watch('store_image_url') ?? ''}></img>
                              ) : (
                                <span className='fi fi-rr-picture' />
                              )}
                            </label>
                          </div>
                        </span>
                      </div>
                    </BWAccordion>
                    {/* IPaddress */}
                  </>
                )}
                {Boolean(typePanel === TYPE_STORE_PANEL.IP) && (
                  <BWAccordion title='Địa chỉ IP' id='bw_ip_address' isRequired={false}>
                    <IpAddress isEdit={isEdit} />
                  </BWAccordion>
                )}
                <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
                  <BWButton
                    type='success'
                    icon='fi fi-rr-check'
                    content={!isEdit ? 'Chỉnh sửa' : storeId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
                    onClick={() => {
                      if (!isEdit) window._$g.rdr('/store/edit/' + storeId);
                      else handleSubmit(onSubmit);
                    }}
                    submit={Boolean(isEdit)}></BWButton>
                  <BWButton outline content='Đóng' onClick={() => window._$g.rdr('/store')}></BWButton>
                </div>
                {modalStock && (
                  <ModalStock
                    onClose={() => {
                      setModalStock(false);
                    }}
                  />
                )}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
