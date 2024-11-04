import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

//service
import { getDetail, create, update } from 'services/customer-type.service';
import { getOptionsBusiness } from 'services/business.service';
//utils
import { getBase64, mapDataOptions, showToast, wrappedOptionAll } from 'utils/helpers';
import { mapDataOptions4Select } from 'utils/helpers';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWButton from 'components/shared/BWButton/index';
import { useAuth } from 'context/AuthProvider';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { timeTypeOptions, customerTypeOptions, OrOrAnd, CUSTOMER_TYPE } from './utils/constants';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './style.scss';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import useDetectHookFormChange from 'hooks/useDetectHookFormChange';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { Wrapper } from './utils/styles';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

function CustomerTypeAdd({ customerTypeId = null, isEdit = true }) {
  const { user } = useAuth();
  const isAdministrator = user.isAdministrator ? user.isAdministrator : 0;
  const methods = useForm();
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const optionsCompany = useGetOptions(optionType.company, { valueAsString: true });
  const companyHesman = optionsCompany?.find((x) => x.name.match(/hesman/i));
  const initForm = {
    company_id: companyHesman?.value,
    business_id: '-1',
    customer_type: CUSTOMER_TYPE.INDIVIDUAL,
    order_index: 1,
    time_limit: 30,
    time_type: 1,
    debt_time: 0,
    is_active: 1,
  }

  const [optionsBusiness, setOptionsBusiness] = useState(null);
  useEffect(() => {
    register('icon_url');
    register('is_active');
  }, [register]);
  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
  };

  const handleFileUpload = async (_) => {
    const getFile = await getBase64(_.target.files[0]);
    setValue('icon_url', getFile);
  };

  const getData = useCallback(() => {
    try {
      if (customerTypeId) {
        getDetail(customerTypeId)
          .then(reset)
          .catch((e) => showToast.error(e.message));
      } else {
        reset(initForm);
      }
    } catch (error) {}
  }, [customerTypeId, optionsCompany]);
  useEffect(getData, [getData]);

  const getOptionsSelect = useCallback(() => {
    setOptionsBusiness([]);
    if (watch('company_id')) {
      getOptionsBusiness({ company_id: watch('company_id') }).then((data) => {
        if (data) {
          let _options = mapDataOptions(data, { valueAsString: true })
          _options = wrappedOptionAll(_options, 'Tất cả', true)
          setOptionsBusiness(_options);
        }
      });
    }
  }, [watch('company_id')]);
  useEffect(getOptionsSelect, [getOptionsSelect]);

  const onSubmit = async (values) => {
    try {
      if (customerTypeId) {
        await update(customerTypeId, values);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await create(values);
        showToast.success('Thêm mới thành công');
        reset(initForm);
      }
    } catch (error) {
      showToast.error(error.message);
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  const handleOnChangeCompany = (e, o) => {
    setValue('company_id', o.value);
    setValue('business_id', '-1');
  };

  return (
    <Wrapper>
      <Spin spinning={isSubmitting} indicator={antIcon}>
        <div className='bw_main_wrapp customer_type'>
          <div className='bw_row bw_mt_2'>
            <div className='bw_col_3'>
              <ul className='bw_control_form'>
                <li onClick={() => handleScrollToFormItem('bw_info_cus')}>
                  <a
                    data-href='#bw_info_cus'
                    className={`${
                      Boolean(watch('customer_type_name') && watch('company_id') && watch('business_id'))
                        ? 'bw_active'
                        : ''
                    }`}>
                    <span className='fi fi-rr-check' /> Thông tin hạng khách hàng
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
                  <BWAccordion title='Thông tin hạng khách hàng' id='bw_info_cus' isRequired={false}>
                    <div className='bw_row'>
                      <div className='bw_col_4'>
                        <div className='bw_load_image bw_mb_2 bw_text_center'>
                          <label className='bw_choose_image'>
                            <input
                              type='file'
                              field='icon'
                              onChange={(_) => handleFileUpload(_, 'icon_url')}
                              disabled={!isEdit}
                            />
                            {watch('icon_url') ? (
                              <img style={{ width: '100%' }} src={watch('icon_url') ?? ''}></img>
                            ) : (
                              <span className='fi fi-rr-picture' />
                            )}
                          </label>
                          <p>Tải lên icon</p>
                        </div>
                        <div className='bw_row'>
                          <FormItem label='Màu loại KH' className='bw_col_6'>
                            <FormInput type='color' field='color' disabled={!isEdit} />
                          </FormItem>
                          <FormItem label='Mã màu KH' className='bw_col_6'>
                            <FormInput type='text' field='color' disabled={true} />
                          </FormItem>
                          <FormItem label='Màu ghi chú' className='bw_col_6'>
                            <FormInput type='color' field='note_color' disabled={!isEdit} />
                          </FormItem>
                          <FormItem label='Mã màu ghi chú' className='bw_col_6'>
                            <FormInput type='text' field='note_color' disabled={true} />
                          </FormItem>
                        </div>
                      </div>
                      <div className='bw_col_4'>
                        <FormItem label='Tên hạng khách hàng' isRequired={true}>
                          <FormInput
                            type='text'
                            field='customer_type_name'
                            placeholder='Nhập tên hạng khách hàng'
                            validation={{
                              required: 'Tên hạng khách hàng là bắt buộc',
                            }}
                            disabled={!isEdit}
                          />
                        </FormItem>

                        <FormItem label='Miền áp dụng' isRequired={true}>
                          <FormSelect
                            field='business_id'
                            list={optionsBusiness}
                            validation={{
                              required: 'Miền là bắt buộc',
                            }}
                            disabled={!isEdit}
                          />
                        </FormItem>

                        <div className='bw_row'>
                          <FormItem className='bw_col_7' label='Thời gian duy trì hạn' isRequired>
                            <FormInput
                              type='number'
                              field='time_limit'
                              disabled={!isEdit}
                              validation={{
                                required: 'Thời gian duy trì hạn là bắt buộc',
                                min: { value: 0, message: 'Thời gian duy trì hạng cần lớn hơn 0' },
                              }}
                              className='bw_text_right'
                              min={0}
                            />
                          </FormItem>
                          <FormItem className='bw_col_5' label='Loại' isRequired>
                            <FormSelect
                              field='time_type'
                              list={timeTypeOptions}
                              validation={{
                                required: 'Chọn loại thời gian là bắt buộc.',
                              }}
                              disabled={!isEdit}
                            />
                          </FormItem>
                        </div>
                        <FormItem className='bw_col_12' label='Thứ tự'>
                          <FormInput
                            type='number'
                            field='order_index'
                            validation={{
                              required: 'Thứ tự là bắt buộc.',
                            }}
                            disabled={!isEdit}
                            className='bw_text_right'
                            min={0}
                          />
                        </FormItem>
                      </div>
                      <div className='bw_col_4'>
                        <FormItem label='Công ty áp dụng' isRequired={true}>
                          <FormSelect
                            field='company_id'
                            list={optionsCompany}
                            validation={{
                              required: 'Công ty là bắt buộc',
                            }}
                            disabled={!isEdit}
                            onChange={(e, o) => handleOnChangeCompany(e, o)}
                          />
                        </FormItem>

                        <div className='bw_row'>
                          <FormItem className='bw_col_12' label='Áp dụng cho khách hàng' isRequired={true}>
                            <FormSelect
                              field='customer_type'
                              list={customerTypeOptions}
                              validation={{
                                required: 'Áp dụng cho khách hàng là bắt buộc',
                              }}
                              disabled={!isEdit}
                            />
                          </FormItem>

                          {watch('customer_type') !== CUSTOMER_TYPE.LEADS && (
                            <FormItem className='bw_col_12' label='Số ngày được phép nợ'>
                              <FormInput type='number' field='debt_time' className='bw_text_right' min={0} />
                            </FormItem>
                          )}
                        </div>
                      </div>
                      <FormItem label='Mô tả' className='bw_col_12'>
                        <FormTextArea field='description' rows={3} disabled={!isEdit} placeholder='Nhập mô tả' />
                      </FormItem>
                    </div>
                  </BWAccordion>

                  <BWAccordion title='Điều kiện hạng' id='bw_condition' isRequired={false}>
                    <div className='bw_collapse_panel'>
                      <div className='bw_item_dk'>
                        <div className='bw_row'>
                          <div className='bw_col_6'>
                            <div className='bw_frm_box'>
                              <h3>Tổng tiền chi tiêu từ</h3>
                              <div className='bw_flex bw_align_items_center'>
                                <div className='bw_show'>
                                  <FormNumber
                                    min={0}
                                    bordered={false}
                                    field='total_paid_from'
                                    addonAfter='VNĐ'
                                    disabled={!isEdit}
                                  />
                                </div>
                                <div className='bw_text_show'>&lt;-&gt;</div>
                                <div className='bw_show'>
                                  <FormNumber
                                    min={0}
                                    validation={{
                                      validate: (value) => {
                                        if (watch('total_paid_to') && watch('total_paid_from') > value) {
                                          return 'Số tiền phải lớn số tiền trước ';
                                        }
                                      },
                                    }}
                                    bordered={false}
                                    field='total_paid_to'
                                    addonAfter='VNĐ'
                                    disabled={!isEdit}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='bw_col_6'>
                            <div className='bw_frm_box'>
                              <label>Trong khoảng thời gian</label>
                              <div className='bw_flex bw_align_items_center'>
                                <div className='bw_showtime'>
                                  <FormNumber
                                    min={0}
                                    bordered={false}
                                    field='time_total_paid_from'
                                    disabled={!isEdit}
                                  />
                                </div>
                                <div className='bw_text_showtime'>đến</div>
                                <div className='bw_showtime'>
                                  <FormNumber
                                    min={methods.watch('time_total_paid_from') + 1}
                                    validation={{
                                      validate: (value) => {
                                        if (watch('time_total_paid_to') && watch('time_total_paid_from') > value) {
                                          return 'Thời gian phải lớn thời gian trước ';
                                        }
                                      },
                                    }}
                                    bordered={false}
                                    field='time_total_paid_to'
                                    disabled={!isEdit}
                                  />
                                </div>
                                <span className='bw_choose_time'>
                                  <FormSelect bordered={true} field='time_type_total_paid' list={timeTypeOptions} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='bw_choose_pt'>
                          <FormSelect
                            placeholder='--Chọn điều kiện--'
                            bordered={true}
                            field='condition_1'
                            list={OrOrAnd}
                          />
                        </div>
                      </div>
                      <div className='bw_item_dk'>
                        <div className='bw_row'>
                          <div className='bw_col_6'>
                            <div className='bw_frm_box'>
                              <h3>Tổng điểm từ</h3>
                              <div className='bw_flex bw_align_items_center'>
                                <div className='bw_show'>
                                  <FormNumber
                                    min={0}
                                    bordered={false}
                                    field='total_point_from'
                                    addonAfter='ĐIỂM'
                                    disabled={!isEdit}
                                  />
                                </div>
                                <div className='bw_text_show'>&lt;-&gt;</div>
                                <div className='bw_show'>
                                  <FormNumber
                                    min={methods.watch('total_point_from') + 1}
                                    validation={{
                                      validate: (value) => {
                                        if (watch('total_point_to') && watch('total_point_from') > value) {
                                          return 'Điểm phải lớn điểm trước ';
                                        }
                                      },
                                    }}
                                    bordered={false}
                                    field='total_point_to'
                                    addonAfter='ĐIỂM'
                                    disabled={!isEdit}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='bw_col_6'>
                            <div className='bw_frm_box'>
                              <label>Trong khoảng thời gian</label>
                              <div className='bw_flex bw_align_items_center'>
                                <div className='bw_showtime'>
                                  <FormNumber min={0} field='time_total_point_from' disabled={!isEdit} />
                                </div>
                                <div className='bw_text_showtime'>đến</div>
                                <div className='bw_showtime'>
                                  <FormNumber
                                    min={methods.watch('time_total_point_from') + 1}
                                    validation={{
                                      validate: (value) => {
                                        if (watch('time_total_point_to') && watch('time_total_point_from') > value) {
                                          return 'Thời gian phải lớn thời gian trước ';
                                        }
                                      },
                                    }}
                                    field='time_total_point_to'
                                    disabled={!isEdit}
                                  />
                                </div>
                                <div className='bw_choose_time'>
                                  <FormSelect bordered field='time_type_total_point' list={timeTypeOptions} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='bw_choose_pt'>
                          <FormSelect
                            placeholder='--Chọn điều kiện--'
                            bordered={true}
                            field='condition_2'
                            list={OrOrAnd}
                          />
                        </div>
                      </div>
                      <div className='bw_item_dk'>
                        <div className='bw_row'>
                          <div className='bw_col_6'>
                            <div className='bw_frm_box'>
                              <h3>Tổng số lần mua hàng từ</h3>
                              <div className='bw_flex bw_align_items_center'>
                                <div className='bw_show'>
                                  <FormNumber
                                    min={0}
                                    bordered={false}
                                    field='total_buy_from'
                                    addonAfter='Lần'
                                    disabled={!isEdit}
                                  />
                                </div>
                                <div className='bw_text_show'>&lt;-&gt;</div>
                                <div className='bw_show'>
                                  <FormNumber
                                    min={0}
                                    addonAfter='Lần'
                                    validation={{
                                      validate: (value) => {
                                        if (watch('total_buy_to') && watch('total_buy_from') > value) {
                                          return 'Thời gian phải lớn thời gian trước ';
                                        }
                                      },
                                    }}
                                    bordered={false}
                                    field='total_buy_to'
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='bw_col_6'>
                            <div className='bw_frm_box'>
                              <label>Trong khoảng thời gian</label>
                              <div className='bw_flex bw_align_items_center'>
                                <div className='bw_showtime'>
                                  <FormNumber min={0} bordered={false} field='time_total_buy_from' disabled={!isEdit} />
                                </div>
                                <div className='bw_text_showtime'>đến</div>
                                <div className='bw_showtime'>
                                  <FormNumber
                                    min={0}
                                    validation={{
                                      validate: (value) => {
                                        if (watch('time_total_buy_to') && watch('time_total_buy_from') > value) {
                                          return 'Thời gian phải lớn thời gian trước ';
                                        }
                                      },
                                    }}
                                    field='time_total_buy_to'
                                    disabled={!isEdit}
                                  />
                                </div>
                                <div className='bw_choose_time'>
                                  <FormSelect bordered field='time_type_total_buy' list={timeTypeOptions} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
                        content={customerTypeId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
                        onClick={handleSubmit(onSubmit)}
                      />
                    ) : (
                      <BWButton
                        type='success'
                        outline
                        content='Chỉnh sửa'
                        onClick={() => window._$g.rdr(`/customer-type/edit/${customerTypeId}`)}
                        disabled={isAdministrator || !watch('is_system') ? false : true}
                        className={isAdministrator || !watch('is_system') ? '' : 'btn_disabled'}
                      />
                    )}
                    <BWButton
                      type=''
                      outline
                      content='Đóng'
                      onClick={() => window._$g.rdr('/customer-type')}></BWButton>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </Spin>
    </Wrapper>
  );
}

export default CustomerTypeAdd;
