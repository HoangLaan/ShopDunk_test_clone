import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { genderTypesOptions, statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';

import FormNumber from 'components/shared/BWFormControl/FormNumber';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import moment from 'moment';

const searchTypeOptions = [
  {
    value: 4,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Khách hàng cá nhân',
  },
  {
    value: 3,
    label: 'Khách hàng tiềm năng',
  },
];

const initFilter = {
  search: '',
  is_active: STATUS_TYPES.ACTIVE,
  search_type: 3,
};

const FilterCustomerCare = ({ onChange, onClear }) => {
  const methods = useForm();

  const hobbiesOptions = useGetOptions(optionType.hobbiesForUser);
  const customerTypeOptions = useGetOptions(optionType.customerType);

  const { search_type } = methods.watch();

  const _customerTypeOptions =
    search_type === 4 || !search_type
      ? customerTypeOptions
      : customerTypeOptions.filter((x) => x.type_apply === search_type);

  useEffect(() => {
    methods.reset(initFilter);
  }, [methods]);

  const handleClear = () => {
    methods.reset(initFilter);
    onClear();
  };

  return (
    <div className='bw_filter_customer_care'>
      <FormProvider {...methods}>
        <FilterSearchBar
          title='Tìm kiếm'
          onSubmit={onChange}
          onClear={handleClear}
          expanded={true}
          actions={[
            {
              title: 'Từ khóa',
              component: <FormInput field='search' placeholder='Nhập mã khách hàng, tên khách hàng' />,
            },
            {
              title: 'Đối tượng',
              component: <FormSelect field='search_type' list={searchTypeOptions} allowClear={true} />,
            },
            {
              title: 'Hạng khách hàng',
              component: <FormSelect field='customer_type_id' list={_customerTypeOptions} allowClear={true} />,
            },
            {
              title: 'Số ngày chưa chăm sóc',
              component: (
                <div className='bw_row bw_filter_no_care_days'>
                  <div className='bw_col_6'>
                    <FormNumber
                      field='no_care_days_from'
                      bordered={true}
                      addonAfter='ngày'
                      placeholder='Từ'
                      validation={
                        methods.watch('no_care_days_from')
                          ? {
                              required: 'Số ngày chưa chăm sóc là bắt buộc',
                              min: {
                                value: 0,
                                message: 'Số ngày chưa chăm sóc phải lớn hơn 0',
                              },
                            }
                          : {
                            required: false,
                            min: undefined
                          }
                      }
                    />
                  </div>
                  <div className='bw_col_6'>
                    <FormNumber
                      field='no_care_days_to'
                      placeholder='Đến'
                      bordered={true}
                      addonAfter='ngày'
                      validation={
                        methods.watch('no_care_days_to')
                          ? {
                              required: 'Số ngày chưa chăm sóc là bắt buộc',
                              min: {
                                value: 0,
                                message: 'Số ngày chưa chăm sóc phải lớn hơn 0',
                              },
                            }
                          : {
                            required: false,
                            min: undefined
                          }
                      }
                    />
                  </div>
                </div>
              ),
            },
            {
              title: 'Số lần mua hàng',
              component: (
                <div className='bw_row'>
                  <div className='bw_col_6'>
                    <FormNumber
                      field='order_count_from'
                      bordered={true}
                      placeholder='Từ'
                      style={{ paddingLeft: 5, width: '100%' }}
                      validation={
                        methods.watch('order_count_from')
                          ? {
                              required: 'Số lần mua là bắt buộc',
                              min: {
                                value: 0,
                                message: 'Số lần mua phải lớn hơn 0',
                              },
                            }
                          : {
                            required: false,
                            min: undefined
                          }
                      }
                    />
                  </div>
                  <div className='bw_col_6'>
                    <FormNumber
                      field='order_count_to'
                      placeholder='Đến'
                      bordered={true}
                      style={{ paddingLeft: 5, width: '100%' }}
                      validation={
                        methods.watch('order_count_to')
                          ? {
                              required: 'Số lần mua là bắt buộc',
                              min: {
                                value: 0,
                                message: 'Số lần mua phải lớn hơn 0',
                              },
                            }
                          : {
                            required: false,
                            min: undefined
                          }
                      }
                    />
                  </div>
                </div>
              ),
            },
            {
              title: 'Số điểm thưởng của khách hàng',
              component: (
                <div className='bw_row bw_filter_total_money'>
                  <div className='bw_col_6'>
                    <FormNumber
                      field='point_from'
                      bordered={true}
                      placeholder='Từ'
                      addonAfter='điểm'
                      validation={
                        methods.watch('point_from')
                          ? {
                              required: 'Giá trị này là bắt buộc',
                              min: {
                                value: 0,
                                message: 'Giá trị này phải lớn hơn 0',
                              },
                            }
                          : {
                            required: false,
                            min: undefined
                          }
                      }
                    />
                  </div>
                  <div className='bw_col_6'>
                    <FormNumber
                      field='point_to'
                      placeholder='Đến'
                      bordered={true}
                      addonAfter='điểm'
                      validation={
                        methods.watch('point_to')
                          ? {
                              required: 'Giá trị này là bắt buộc',
                              min: {
                                value: 0,
                                message: 'Giá trị này phải lớn hơn 0',
                              },
                            }
                          : {
                            required: false,
                            min: undefined
                          }
                      }
                    />
                  </div>
                </div>
              ),
            },
            {
              title: 'Tổng số tiền chi tiêu',
              component: (
                <div className='bw_row bw_filter_total_money'>
                  <div className='bw_col_6'>
                    <FormNumber
                      field='total_money_from'
                      bordered={true}
                      placeholder='Từ'
                      addonAfter='đ'
                      validation={
                        methods.watch('total_money_from')
                          ? {
                              required: 'Giá trị này là bắt buộc',
                              min: {
                                value: 0,
                                message: 'Giá trị này phải lớn hơn 0',
                              },
                            }
                          : {
                            required: false,
                            min: undefined
                          }
                      }
                    />
                  </div>
                  <div className='bw_col_6'>
                    <FormNumber
                      field='total_money_to'
                      placeholder='Đến'
                      bordered={true}
                      addonAfter='đ'
                      validation={
                        methods.watch('total_money_to')
                          ? {
                              required: 'Giá trị này là bắt buộc',
                              min: {
                                value: 0,
                                message: 'Giá trị này phải lớn hơn 0',
                              },
                            }
                          : {
                            required: false,
                            min: undefined
                          }
                      }
                    />
                  </div>
                </div>
              ),
            },
            {
              title: 'Thời gian mua hàng',
              component: (
                <FormRangePicker
                  style={{ width: '100%' }}
                  fieldStart='buy_from'
                  fieldEnd='buy_to'
                  placeholder={['Từ ngày', 'Đến ngày']}
                  format='DD/MM/YYYY'
                  allowClear={true}
                />
              ),
            },
            {
              title: 'Sinh nhật',
              component: (
                <FormSelect
                  field='birthday_type'
                  list={[
                    { value: 1, label: 'Hôm nay' },
                    { value: 2, label: 'Trong tháng' },
                    { value: 3, label: 'Chọn ngày cụ thể' },
                  ]}
                  onChange={(value) => {
                    methods.clearErrors('birthday_type');
                    methods.setValue('birthday_type', value);
                    if (value === 1) {
                      methods.setValue('from_birthday', moment().format('DD/MM/YYYY'));
                      methods.setValue('to_birthday', moment().format('DD/MM/YYYY'));
                    }
                    if (value === 2) {
                      methods.setValue('from_birthday', moment().startOf('month').format('DD/MM/YYYY'));
                      methods.setValue('to_birthday', moment().endOf('month').format('DD/MM/YYYY'));
                    }
                    if (value === 3) {
                      methods.setValue('from_birthday', null);
                      methods.setValue('to_birthday', null);
                    }
                  }}
                />
              ),
            },
            {
              title: 'Ngày sinh',
              hidden: methods.watch('birthday_type') !== 3,
              component: (
                <FormRangePicker
                  style={{ width: '100%' }}
                  fieldStart='from_birthday'
                  fieldEnd='to_birthday'
                  placeholder={['Từ ngày', 'Đến ngày']}
                  format='DD/MM/YYYY'
                  allowClear={true}
                />
              ),
            },
            {
              title: 'Giới tính',
              component: <FormSelect field='gender' list={genderTypesOptions} />,
            },
            {
              title: 'Sở thích',
              component: <FormSelect field='hobbies_id' list={hobbiesOptions} />,
            },
            {
              title: 'Kích hoạt',
              component: <FormSelect field='is_active' list={statusTypesOption} />,
            },
          ]}
        />
      </FormProvider>
    </div>
  );
};

export default FilterCustomerCare;
