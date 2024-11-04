import React, { memo, useCallback, useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { GENDER_OPTIONS } from 'utils/constants';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAddress from 'components/shared/BWAddress/index';
import CustomerContactTable from 'pages/Partner/components/add/CustomerContactTable';
import ModalCustomerContact from 'pages/Partner/components/add/Modal/ModalCustomerContact';
import {
  getCustomerTypeInfo,
  getOptionAccount,
  getOptionCustomerType,
  getOptionSource,
  getOptionUser,
} from 'services/partner.service';
import { useFormContext } from 'react-hook-form';
import { getBase64, mapDataOptions4SelectCustom } from 'utils/helpers';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { CUSTOMER_TYPE } from 'pages/CustomerType/utils/constants';

const PartnerInformation = ({ disabled, title }) => {
  const methods = useFormContext();
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [sources, setSources] = useState([]);
  const [customerTypeInfo, setCustomerTypeInfo] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const customerTypeOptions = useGetOptions(optionType.customerType);
  const _customerTypeOptions = customerTypeOptions.filter((x) => x.type_apply === CUSTOMER_TYPE.BUSINESS);

  const onchangeFileAvatar = async (e) => {
    const getFile = await getBase64(e.target.files[0]);
    methods.setValue('image_avatar', getFile);
  };

  const loadUser = useCallback(() => {
    getOptionUser().then((res) => setUsers(mapDataOptions4SelectCustom(res, 'id', 'name')));
  }, []);
  useEffect(loadUser, [loadUser]);

  const loadSource = useCallback(() => {
    getOptionSource().then((res) => setSources(mapDataOptions4SelectCustom(res, 'id', 'name')));
  }, []);
  useEffect(loadSource, [loadSource]);

  const loadAccount = useCallback(() => {
    getOptionAccount().then((res) => setAccounts(mapDataOptions4SelectCustom(res, 'id', 'name')));
  }, []);
  useEffect(loadAccount, [loadAccount]);

  const loadCustomerTypeInfo = useCallback(() => {
    getCustomerTypeInfo(methods.watch('customer_type_id')).then((res) => setCustomerTypeInfo(res));
  }, [methods]);

  useEffect(() => {
    if (methods.watch('customer_type_id')) loadCustomerTypeInfo(methods.watch('customer_type_id'));
  }, [methods.watch('customer_type_id'), loadCustomerTypeInfo]);

  const handleCustomerContact = (obj) => {
    methods.setValue(
      'customer_contacts',
      methods.watch('customer_contacts') ? [...methods.watch('customer_contacts'), obj] : [obj],
    );
  };
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <div className='bw_load_image bw_mb_2 bw_text_center'>
              <label className='bw_choose_image'>
                <input disabled={disabled} accept='image/*' type='file' onChange={onchangeFileAvatar} />
                {methods.watch('image_avatar') ? (
                  <img style={{ width: '100%' }} src={methods.watch('image_avatar') ?? ''} alt='' />
                ) : (
                  <span className='fi fi-rr-picture' />
                )}
              </label>
              <p>Kích thước ảnh: 500px*500px.</p>
            </div>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={true} label='Mã khách hàng DN'>
              <FormInput type='text' field='partner_code' disabled />
            </FormItem>
            <FormItem disabled={disabled} label='Hạng khách hàng doanh nghiệp'>
              <FormSelect list={_customerTypeOptions} field={'customer_type_id'}></FormSelect>
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} label='Nhân viên phụ trách KH DN'>
              <FormSelect list={users} field={'caring_user'}></FormSelect>
            </FormItem>
            <FormItem
              disabled={disabled}
              label='Mã số thuế'
              linkLabelHref={'https://tracuunnt.gdt.gov.vn/tcnnt/mstdn.jsp'}
              labelHref={'(Tra cứu mã số thuế)'}>
              <FormInput type='text' field='tax_code' placeholder='Nhập mã số thuế' />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <label className='bw_checkbox'>
              <FormInput disabled={disabled} type='checkbox' field='is_crt_system' />
              <span />
              Có trên hệ thống CRT
            </label>
          </div>
          <div className='bw_col_8'>
            <FormItem disabled={disabled} isRequired label='Tên khách hàng DN'>
              <FormInput
                type='text'
                field='partner_name'
                placeholder='Nhập tên khách hàng DN'
                validation={{
                  required: 'Tên khách hàng DN cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} label='Nguồn khách hàng'>
              <FormSelect field={'source_id'} list={sources}></FormSelect>
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Số điện thoại'>
              <FormInput
                type='text'
                field='phone_number'
                validation={{
                  required: 'Số điện thoại là bắt buộc',
                  pattern: {
                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                    message: 'Số điện thoại không hợp lệ.',
                  },
                }}
                placeholder='Nhập số điện thoại'
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Email'>
              <FormInput
                type='text'
                field='email'
                placeholder='Nhập Email'
                validation={{
                  required: 'Nhập email là bắt buộc',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Email không đúng định dạng',
                  },
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} label='Người giới thiệu'>
              <FormSelect list={accounts} field={'user_id'}></FormSelect>
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem label='Quốc gia' disabled={disabled}>
              <BWAddress type='country' field='country_id'></BWAddress>
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem label='Tỉnh/Thành phố' disabled={disabled}>
              <BWAddress type='province' field='province_id'></BWAddress>
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <div style={{ border: '2px solid black', padding: '5px' }}>
              <h3 className='bw_title_search'>Chính sách công nợ theo hạng</h3>
              <div className='bw_row'>
                <div className='bw_col_8'>Ngày công nợ </div>
                <span className='bw_col_4' style={{ textAlign: 'right', fontWeight: '700' }}>
                  {customerTypeInfo.debt_time_from}
                </span>
              </div>
              <div className='bw_row'>
                <div className='bw_col_8'>Trần công nợ </div>
                <span className='bw_col_4' style={{ textAlign: 'right', fontWeight: '700' }}>
                  {customerTypeInfo.debt_time_to}
                </span>
              </div>
            </div>
          </div>
          <div className='bw_col_8'>
            <div className='bw_row'>
              <div className='bw_col_6'>
                <FormItem label='Quận/Huyện' disabled={disabled}>
                  <BWAddress type='district' field='district_id'></BWAddress>
                </FormItem>
              </div>
              <div className='bw_col_6'>
                <FormItem label='Phường/Xã' disabled={disabled}>
                  <BWAddress type='ward' field='ward_id'></BWAddress>
                </FormItem>
              </div>
              <div className='bw_col_12'>
                <FormItem disabled={disabled} label='Khu phố/Thôn/Xóm/Tổ/Số nhà/Đường'>
                  <FormInput type='text' field='address' placeholder='Khu phố/Thôn/Xóm/Tổ/Số nhà/Đường' />
                </FormItem>
              </div>
              <div className='bw_col_12'>
                <FormItem disabled={disabled} label='Mô tả'>
                  <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
                </FormItem>
              </div>
              <div className='bw_col_12'>
                <FormItem disabled={disabled} label='Ghi chú'>
                  <FormTextArea type='text' field='note' placeholder='Nhập ghi chú' />
                </FormItem>
              </div>
              <h3 className='bw_title_search'>Thông tin người đại diện</h3>
              <div className='bw_row'>
                <div className='bw_col_6'>
                  <FormItem disabled={disabled} label='Họ và tên'>
                    <FormInput type='text' field='representative_name' placeholder='Nhập họ tên' />
                  </FormItem>
                </div>
                <div className='bw_col_6'>
                  <FormItem disabled={disabled} label='Giới tính '>
                    <FormRadioGroup field='representative_gender' list={GENDER_OPTIONS} />
                  </FormItem>
                </div>
                <div className='bw_col_6'>
                  <FormItem disabled={disabled} label='Email '>
                    <FormInput
                      type='text'
                      field='representative_email'
                      placeholder='Nhập email '
                      validation={{
                        required: false,
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: 'Email không đúng định dạng',
                        },
                      }}
                    />
                  </FormItem>
                </div>
                <div className='bw_col_6'>
                  <FormItem disabled={disabled} label='Số điện thoại '>
                    <FormInput
                      type='text'
                      field='representative_phone'
                      validation={{
                        required: false,
                        pattern: {
                          value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                          message: 'Số điện thoại không hợp lệ.',
                        },
                      }}
                      placeholder='Nhập số điện thoại '
                    />
                  </FormItem>
                </div>
                {/* <div className='bw_col_6'>
                  <FormItem disabled={disabled} label='Số CCCD'>
                    <FormInput type='text' field='representative_id_card' placeholder='Nhập số CCCD ' />
                  </FormItem>
                </div>
                <div className='bw_col_6'>
                  <FormItem disabled={disabled} label='Nơi cấp CCCD'>
                    <FormInput type='text' field='representative_id_card_place' placeholder='Nhập nơi cấp CCCD' />
                  </FormItem>
                </div> */}
              </div>
              <h3 className='bw_title_search'>Thông tin người liên hệ</h3>
              <div className='bw_col_12'>
                <CustomerContactTable
                  noPaging
                  onOpenModal={() => setOpenModal(true)}
                  deleteData={(data) => {
                    methods.setValue(
                      'customer_contacts',
                      methods
                        .watch('customer_contacts')
                        .filter((x) => x.contact_customer_id !== data.contact_customer_id),
                    );
                  }}
                  data={methods.watch('customer_contacts')}
                  noAction={disabled}
                  noSelect></CustomerContactTable>
                {openModal && (
                  <ModalCustomerContact
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onChange={(obj) => handleCustomerContact(obj)}></ModalCustomerContact>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default memo(PartnerInformation);
