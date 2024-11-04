import React, { useCallback, useEffect, useState } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import styled from 'styled-components';
import { create } from 'services/customer-type.service';
import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { FormProvider, useForm } from 'react-hook-form';
import { getOptionsCompany } from 'services/company.service';
import { getOptionsBusiness } from 'services/business.service';
import { getBase64, mapDataOptions4Select } from 'utils/helpers';
import { showToast } from 'utils/helpers';
import { OrOrAnd, customerTypeOptions, timeTypeOptions } from 'pages/CustomerType/utils/constants';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const SpanAddDonLabel = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0b2447;
  border-radius: 5px;
  font-weight: 600;
  height: 100%;
  color: white;
  width: 180px;
`;

const SpanAddDonFrom = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #e9ecef;
  padding: 0 18px;
  border-radius: 5px;
  font-weight: 600;
  height: 100%;
`;

const SpanAddDonTo = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #e9ecef;
  padding: 0 15px;
  border-radius: 5px;
  font-weight: 600;
  height: 100%;
`;

const AddCustomerTypeModal = ({ open, onClose }) => {
  const methods = useForm();
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [optionsCompany, setOptionsCompany] = useState(null);
  const [optionsBusiness, setOptionsBusiness] = useState(null);
  useEffect(() => {
    register('icon_url');
    register('is_active');
  }, [register]);
  const handleFileUpload = async (_) => {
    const getFile = await getBase64(_.target.files[0]);
    setValue('icon_url', getFile);
  };

  const getDataOptions = async () => {
    let _company = await getOptionsCompany();
    setOptionsCompany(mapDataOptions4Select(_company));
  };
  useEffect(() => {
    getDataOptions();
  }, []);

  const getOptionsSelect = useCallback(() => {
    setOptionsBusiness([]);
    if (watch('company_id')) {
      getOptionsBusiness({ company_id: watch('company_id') }).then((data) => {
        if (data) {
          setOptionsBusiness(mapDataOptions4Select(data));
        }
      });
    }
  }, [watch('company_id')]);
  useEffect(getOptionsSelect, [getOptionsSelect]);

  const onSubmit = async (values) => {
    try {
      values.is_active = 1;
      await create(values);
      showToast.success('Thêm mới loại khách hàng thành công');
      reset({ is_active: 1 });
      onClose();
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  const handleOnChangeCompany = (e, o) => {
    setValue('company_id', o.value);
    setValue('business_id', null);
  };
  return (
    <React.Fragment>
      <Modal
        witdh='70vw'
        header='Thêm loại khách hàng'
        open={open}
        onClose={onClose}
        footer={<BWButton type='success' outline content={'Xác nhận'} onClick={handleSubmit(onSubmit)} />}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <BWAccordion title='Thông tin loại khách hàng' id='bw_info_cus' isRequired={false}>
              <div className='bw_row'>
                <div className='bw_col_4'>
                  <div className='bw_load_image bw_mb_2 bw_text_center'>
                    <label className='bw_choose_image'>
                      <input type='file' field='icon' onChange={(_) => handleFileUpload(_, 'icon_url')} />
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
                      <FormInput type='color' field='color' />
                    </FormItem>
                    <FormItem label='Mã màu KH' className='bw_col_6'>
                      <FormInput type='text' field='color' disabled={true} />
                    </FormItem>
                    <FormItem label='Màu ghi chú' className='bw_col_6'>
                      <FormInput type='color' field='note_color' />
                    </FormItem>
                    <FormItem label='Mã màu ghi chú' className='bw_col_6'>
                      <FormInput type='text' field='note_color' disabled={true} />
                    </FormItem>
                  </div>
                </div>
                <div className='bw_col_4'>
                  <FormItem label='Tên loại khách hàng' isRequired={true}>
                    <FormInput
                      type='text'
                      field='customer_type_name'
                      placeholder='Nhập tên loại khách hàng'
                      validation={{
                        required: 'Tên loại khách hàng là bắt buộc',
                      }}
                    />
                  </FormItem>
                  <FormItem label='Công ty áp dụng' isRequired={true}>
                    <FormSelect
                      field='company_id'
                      list={optionsCompany}
                      validation={{
                        required: 'Công ty là bắt buộc',
                      }}
                      onChange={(e, o) => handleOnChangeCompany(e, o)}
                    />
                  </FormItem>
                  <FormItem label='Miền áp dụng' isRequired={true}>
                    <FormSelect
                      field='business_id'
                      list={optionsBusiness}
                      validation={{
                        required: 'Miền là bắt buộc',
                      }}
                    />
                  </FormItem>
                  <FormItem label='Loại khách hàng' isRequired={true}>
                    <FormSelect
                      field='customer_type'
                      list={customerTypeOptions}
                      validation={{
                        required: 'Loại khách hàng là bắt buộc',
                      }}
                    />
                  </FormItem>
                </div>

                <div className='bw_col_4'>
                  <FormItem label='Số ngày được phép nợ' isRequired>
                    <FormInput
                      type='number'
                      field='debt_time'
                      validation={{
                        required: 'Số ngày được phép nợ là bắt buộc',
                        min: { value: 0, message: 'Số ngày được phép nợ cần lớn hơn 0' },
                      }}
                      className='bw_text_right'
                      min={0}
                    />
                  </FormItem>
                  <div className='bw_row'>
                    <FormItem className='bw_col_7' label='Thời gian duy trì hạn' isRequired>
                      <FormInput
                        type='number'
                        field='time_limit'
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
                      />
                    </FormItem>
                    <FormItem className='bw_col_12' label='Thứ tự' isRequired>
                      <FormInput
                        type='number'
                        field='order_index'
                        validation={{
                          required: 'Thứ tự là bắt buộc.',
                        }}
                        className='bw_text_right'
                        min={0}
                      />
                    </FormItem>
                  </div>
                </div>
              </div>
            </BWAccordion>
            <BWAccordion title='Mô tả' id='bw_description' isRequired={false}>
              {/* <FormEditor field='description'  /> */}
            </BWAccordion>

            <BWAccordion title='Điều kiện hạng' id='bw_condition' isRequired={false}>
              <div className='bw_row'>
                <div
                  className='bw_col_2 bw_flex bw_align_items_center bw_justify_content_center'
                  style={{ height: '52px' }}>
                  <SpanAddDonLabel>Tổng tiền chi tiêu từ</SpanAddDonLabel>
                </div>
                <div className='bw_col_4'>
                  <div className='bw_row'>
                    <div style={{ width: '160px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập số tiền',
                            min: { value: 0, message: 'Số tiền cần lớn hơn 0' },
                          }}
                          bordered={false}
                          field='total_paid_from'
                          addonAfter='VNĐ'
                        />
                      </FormItem>
                    </div>
                    <div className='bw_flex bw_align_items_center bw_justify_content_center' style={{ height: '52px' }}>
                      <SpanAddDonTo>Đến</SpanAddDonTo>
                    </div>
                    <div style={{ width: '160px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập số tiền',
                            min: { value: 0, message: 'Số tiền cần lớn hơn 0' },
                            validate: (value) => {
                              if (watch('total_paid_from') > value) {
                                return 'Số tiền phải lớn số tiền trước ';
                              }
                            },
                          }}
                          bordered={false}
                          field='total_paid_to'
                          addonAfter='VNĐ'
                        />
                      </FormItem>
                    </div>
                  </div>
                </div>
                <div className='bw_col_6'>
                  <div className='bw_row bw_flex'>
                    <div
                      className='bw_flex bw_align_items_center bw_justify_content_center'
                      style={{ height: '52px', width: '52px', marginLeft: '20px' }}>
                      <SpanAddDonFrom>Từ</SpanAddDonFrom>
                    </div>
                    <div style={{ width: '140px', marginRight: '3px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập thời gian',
                            min: { value: 0, message: 'Thời gian cần lớn hơn 0' },
                          }}
                          bordered={false}
                          field='time_total_paid_from'
                        />
                      </FormItem>
                    </div>
                    <div
                      className='bw_flex bw_align_items_center bw_justify_content_center'
                      style={{ height: '52px', width: '52px' }}>
                      <SpanAddDonTo>Đến</SpanAddDonTo>
                    </div>
                    <div style={{ width: '140px', marginLeft: '3px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập thời gian',
                            min: { value: 0, message: 'Thời gian cần lớn hơn 0' },
                            validate: (value) => {
                              if (watch('time_total_paid_from') > value) {
                                return 'Thời gian phải lớn thời gian trước ';
                              }
                            },
                          }}
                          bordered={false}
                          field='time_total_paid_to'
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_3 bw_flex bw_align_items_center bw_justify_content_center'>
                      <FormItem className='bw_col_12'>
                        <FormSelect
                          field='time_type_total_paid'
                          list={timeTypeOptions}
                          validation={{
                            required: 'Chọn loại thời gian là bắt buộc.',
                          }}
                        />
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bw_row bw_flex bw_justify_content_center'>
                <FormItem className='bw_col_2'>
                  <FormSelect
                    field='condition_1'
                    list={OrOrAnd}
                    validation={{
                      required: 'Chọn loại thời gian là bắt buộc.',
                    }}
                  />
                </FormItem>
              </div>
              <div className='bw_row'>
                <div
                  className='bw_col_2 bw_flex bw_align_items_center bw_justify_content_center'
                  style={{ height: '52px' }}>
                  <SpanAddDonLabel>Tổng điểm từ</SpanAddDonLabel>
                </div>
                <div className='bw_col_4'>
                  <div className='bw_row'>
                    <div style={{ width: '160px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập điểm',
                            min: { value: 0, message: 'Điểm cần lớn hơn 0' },
                          }}
                          bordered={false}
                          field='total_point_from'
                          addonAfter='ĐIỂM'
                        />
                      </FormItem>
                    </div>
                    <div className='bw_flex bw_align_items_center bw_justify_content_center' style={{ height: '52px' }}>
                      <SpanAddDonTo>Đến</SpanAddDonTo>
                    </div>
                    <div style={{ width: '160px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập điểm',
                            min: { value: 0, message: 'Điểm cần lớn hơn 0' },
                            validate: (value) => {
                              if (watch('total_point_from') > value) {
                                return 'Điểm phải lớn điểm trước ';
                              }
                            },
                          }}
                          bordered={false}
                          field='total_point_to'
                          addonAfter='ĐIỂM'
                        />
                      </FormItem>
                    </div>
                  </div>
                </div>
                <div className='bw_col_6'>
                  <div className='bw_row bw_flex'>
                    <div
                      className='bw_flex bw_align_items_center bw_justify_content_center'
                      style={{ height: '52px', width: '52px', marginLeft: '20px' }}>
                      <SpanAddDonFrom>Từ</SpanAddDonFrom>
                    </div>
                    <div style={{ width: '140px', marginRight: '3px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập thời gian',
                            min: { value: 0, message: 'Thời gian cần lớn hơn 0' },
                          }}
                          bordered={false}
                          field='time_total_point_from'
                        />
                      </FormItem>
                    </div>
                    <div
                      className='bw_flex bw_align_items_center bw_justify_content_center'
                      style={{ height: '52px', width: '52px' }}>
                      <SpanAddDonTo>Đến</SpanAddDonTo>
                    </div>
                    <div style={{ width: '140px', marginLeft: '3px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập thời gian',
                            min: { value: 0, message: 'Thời gian cần lớn hơn 0' },
                            validate: (value) => {
                              if (watch('time_total_point_from') > value) {
                                return 'Thời gian phải lớn thời gian trước ';
                              }
                            },
                          }}
                          bordered={false}
                          field='time_total_point_to'
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_3 bw_flex bw_align_items_center bw_justify_content_center'>
                      <FormItem className='bw_col_12'>
                        <FormSelect
                          field='time_type_total_point'
                          list={timeTypeOptions}
                          validation={{
                            required: 'Chọn loại thời gian là bắt buộc.',
                          }}
                        />
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bw_row bw_flex bw_justify_content_center'>
                <FormItem className='bw_col_2'>
                  <FormSelect
                    field='condition_2'
                    list={OrOrAnd}
                    validation={{
                      required: 'Chọn loại thời gian là bắt buộc.',
                    }}
                  />
                </FormItem>
              </div>
              <div className='bw_row'>
                <div
                  className='bw_col_2 bw_flex bw_align_items_center bw_justify_content_center'
                  style={{ height: '52px' }}>
                  <SpanAddDonLabel>Tổng số lần mua hàng từ</SpanAddDonLabel>
                </div>
                <div className='bw_col_4'>
                  <div className='bw_row'>
                    <div style={{ width: '160px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập số tiền',
                            min: { value: 0, message: 'Số tiền cần lớn hơn 0' },
                          }}
                          bordered={false}
                          field='total_buy_from'
                          addonAfter='LẦN'
                        />
                      </FormItem>
                    </div>
                    <div className='bw_flex bw_align_items_center bw_justify_content_center' style={{ height: '52px' }}>
                      <SpanAddDonTo>Đến</SpanAddDonTo>
                    </div>
                    <div style={{ width: '160px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập số tiền',
                            min: { value: 0, message: 'Số tiền cần lớn hơn 0' },
                            validate: (value) => {
                              if (watch('total_buy_from') > value) {
                                return 'Số lần phải lớn số lần trước ';
                              }
                            },
                          }}
                          bordered={false}
                          field='total_buy_to'
                          addonAfter='LẦN'
                        />
                      </FormItem>
                    </div>
                  </div>
                </div>
                <div className='bw_col_6'>
                  <div className='bw_row bw_flex'>
                    <div
                      className='bw_flex bw_align_items_center bw_justify_content_center'
                      style={{ height: '52px', width: '52px', marginLeft: '20px' }}>
                      <SpanAddDonFrom>Từ</SpanAddDonFrom>
                    </div>
                    <div style={{ width: '140px', marginRight: '3px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập thời gian',
                            min: { value: 0, message: 'Thời gian cần lớn hơn 0' },
                          }}
                          bordered={false}
                          field='time_total_buy_from'
                        />
                      </FormItem>
                    </div>
                    <div
                      className='bw_flex bw_align_items_center bw_justify_content_center'
                      style={{ height: '52px', width: '52px' }}>
                      <SpanAddDonTo>Đến</SpanAddDonTo>
                    </div>
                    <div style={{ width: '140px', marginLeft: '3px' }}>
                      <FormItem>
                        <FormNumber
                          min={0}
                          validation={{
                            required: 'Vui lòng nhập thời gian',
                            min: { value: 0, message: 'Thời gian cần lớn hơn 0' },
                            validate: (value) => {
                              if (watch('time_total_buy_from') > value) {
                                return 'Thời gian phải lớn thời gian trước ';
                              }
                            },
                          }}
                          bordered={false}
                          field='time_total_buy_to'
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_3 bw_flex bw_align_items_center bw_justify_content_center'>
                      <FormItem className='bw_col_12'>
                        <FormSelect
                          field='time_type_total_buy'
                          list={timeTypeOptions}
                          validation={{
                            required: 'Chọn loại thời gian là bắt buộc.',
                          }}
                        />
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
            </BWAccordion>
          </form>
        </FormProvider>
      </Modal>
    </React.Fragment>
  );
};

export default AddCustomerTypeModal;
