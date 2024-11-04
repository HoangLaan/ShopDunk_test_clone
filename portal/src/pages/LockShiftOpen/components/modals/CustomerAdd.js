import BWButton from 'components/shared/BWButton';
import LockShiftOpenContext from 'pages/LockShiftOpen/context/LockShiftOpenContext';
import React, { useEffect, useState } from 'react';
import ICON_COMMON from 'utils/icons.common';
import { FormProvider, useForm } from 'react-hook-form';
import { createCustomer } from 'services/customer.service';
import { getOptionSelected, showToast } from 'utils/helpers';
import BWAccordion from 'components/shared/BWAccordion';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { FORM_RULES } from 'utils/constants';

const INIT_FORM_INFORMATION = {
  is_active: 1,
  is_system: 0,
  gender: 1,
  password: 'SDxinchao',
};

export default function CustomerAdd({ setIsOpenAddCutomer }) {
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const sourceOptions = useGetOptions(optionType.source);
  const customerTypeOptions = useGetOptions(optionType.customerType);
  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      const newPayload = { ...payload, is_active: 1, is_system: 0 };
      await createCustomer(newPayload);
      showToast.success(`Thêm mới thành công`);
      methods.reset(INIT_FORM_INFORMATION);
      setLoading(false);
      setIsOpenAddCutomer(false);
    } catch (error) {
      showToast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        methods.handleSubmit(onSubmit)(e);
      }}>
      <div className='bw_modal bw_modal_open'>
        <div className='bw_modal_container bw_w800'>
          <div className='bw_title_modal'>
            <h3>Thông tin khách hàng</h3>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={() => setIsOpenAddCutomer(false)}></span>
          </div>
          <FormProvider {...methods}>
            <BWAccordion>
              <div className='bw_main_modal'>
                <div className='bw_frm_box'>
                  <div className='bw_row'>
                    <div className='bw_col_4'>
                      <FormItem label='Loại khách hàng' isRequired={true}>
                        <FormSelect
                          field='customer_type_id'
                          list={customerTypeOptions}
                          placeholder='Loại khách hàng'
                          validation={{
                            required: 'Loại khách hàng là bắt buộc',
                          }}
                          disabled={disabled}
                        />
                      </FormItem>
                      <FormItem disabled={disabled} label='Nguồn'>
                        <FormSelect
                          type='text'
                          placeholder='Chọn nguồn khách hàng'
                          field='source_id'
                          list={sourceOptions}
                        />
                      </FormItem>
                      <FormItem disabled={disabled} isRequired={true} label='Số điện thoại chính'>
                        <FormInput
                          type='number'
                          field='phone_number'
                          validation={{
                            required: 'Số điện thoại là bắt buộc',
                            pattern: {
                              value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                              message: 'Số điện thoại không hợp lệ.',
                            },
                          }}
                          placeholder='Nhập số điện thoại khách hàng'
                        />
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
                              value={methods.watch('password')}
                              placeholder='Nhập mật khẩu'
                              validation={{
                                required: 'Mật khẩu bắt buộc',
                              }}
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
                          <FormItem disabled={disabled} isRequired label='Ngày/Tháng/Năm sinh'>
                            <FormDatePicker
                              style={{
                                width: '100%',
                                padding: '2px 0px',
                              }}
                              placeholder='Nhập ngày sinh'
                              bordered={false}
                              field='birth_day'
                              format='DD/MM/YYYY'
                              validation={{
                                required: 'Ngày sinh là bắt buộc',
                              }}
                            />
                          </FormItem>
                        </div>
                        <div className='bw_col_6'>
                          <FormItem isRequired disabled={disabled} label='Email'>
                            <FormInput
                              type='text'
                              field='email'
                              placeholder='Nhập email'
                              validation={FORM_RULES.email}
                            />
                          </FormItem>
                        </div>
                      </div>
                    </div>
                    <div className='bw_col_4'></div>
                  </div>
                </div>
              </div>
              <div className='bw_footer_modal'>
                <button type='submit' className='bw_btn bw_btn_success' onClick={methods.handleSubmit(onSubmit)}>
                  <span className='fi fi-rr-check'></span> Hoàn tất thêm mới
                </button>
                <BWButton
                  type='danger'
                  icon={ICON_COMMON.reject}
                  content={'Đóng'}
                  onClick={() => setIsOpenAddCutomer(false)}
                />
              </div>
            </BWAccordion>
          </FormProvider>
        </div>
      </div>
    </form>
  );
}
