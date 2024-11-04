import React, { useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { checkBudget } from './mathCoupon';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import WrapUnregister from 'components/shared/FormCommon/WrapUnregister';
import { disabledDatePrevious } from 'utils';
import moment from 'moment';

const CouponInformation = ({ title, disabled, isReady, id }) => {
  const dispatch = useDispatch();
  const methods = useFormContext({});
  const { setValue, watch, clearErrors } = methods;
  const { supplierData, orderTypeData, payPartnerData } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(
      getOptionsGlobal('supplier', {
        is_active: 1,
      }),
    );
    dispatch(
      getOptionsGlobal('orderType', {
        is_active: 1,
      }),
    );
    dispatch(
      getOptionsGlobal('payPartner', {
        is_active: 1,
      }),
    );
  }, []);

  return (
    <React.Fragment>
      <BWAccordion title={title} isRequired>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <label class='bw_radio bw_col_12'>
                <FormInput
                  disabled={disabled}
                  type='checkbox'
                  field='is_partner'
                  onChange={() => {
                    methods.setValue('is_partner', 1);
                    methods.setValue('is_supplier', 0);
                  }}
                />
                <span />
                Mã khuyến mại của đối tác thanh toán
              </label>
            </div>
            {watch('is_handmade') !== 0 ? (
              <div className='bw_col_6'>
                <label class='bw_radio bw_col_12'>
                  <FormInput
                    disabled={disabled}
                    type='checkbox'
                    field='is_supplier'
                    onChange={() => {
                      methods.setValue('is_partner', 0);
                      methods.setValue('is_supplier', 1);
                    }}
                  />
                  <span />
                  Mã khuyến mại của nhà cung cấp
                </label>
              </div>
            ) : (
              <div className='bw_col_6'></div>
            )}

            {Boolean(methods.watch('is_supplier') || methods.watch('is_partner')) && (
              <div
                style={{
                  marginTop: '2px',
                }}
                className='bw_col_12'>
                <FormItem
                  disabled={disabled}
                  isRequired
                  label={methods.watch('is_supplier') ? 'Chọn nhà cung cấp' : 'Chọn đối tác'}>
                  <FormSelect
                    list={mapDataOptions4Select(methods.watch('is_supplier') ? supplierData : payPartnerData)}
                    disabled={disabled}
                    type='text'
                    field={methods.watch('is_supplier') ? 'supplier_id' : 'partner_id'}
                  />
                </FormItem>
              </div>
            )}

            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Tên chương trình'>
                <FormInput
                  disabled={disabled}
                  type='text'
                  field='coupon_name'
                  placeholder='Tên chương trình'
                  validation={{
                    required: 'Tên chương trình là bắt buộc',
                    validate: (p) => {
                      if (p.trim().length === 0) {
                        return 'Tên chương trình là bắt buộc';
                      }
                    },
                  }}
                />
              </FormItem>
            </div>
            {(isReady && id) || (!isReady && !id) ? ( /// isReady: true có nghĩa là đã load được data || id: là trong form detail
              <div className='bw_col_6 bw_row'>
                <div className='bw_col_6' style={{ padding: 'unset' }}>
                  <FormItem disabled={disabled} label='Thời gian bắt đầu'>
                    <FormDatePicker
                      disabled={disabled}
                      allowClear
                      field={'start_date'}
                      format={'DD/MM/YYYY'}
                      placeholder={'Từ ngày'}
                      validation={{
                        required: 'Cần chọn thời gian bắt đầu',
                      }}
                      // onChange = {(value, dateString) => {
                      //   clearErrors('end_date')
                      //   setValue('start_date',dateString)
                      // }}
                    />
                  </FormItem>
                </div>
                <div className='bw_col_6' style={{ padding: 'unset' }}>
                  <FormItem disabled={disabled} label='Thời gian kết thúc'>
                    <FormDatePicker
                      disabled={disabled}
                      allowClear
                      field={'end_date'}
                      format={'DD/MM/YYYY'}
                      placeholder={'Đến ngày'}
                      disabledDate={(current) => {
                        return current && current < moment(watch('start_date'), 'DD/MM/YYYY');
                      }}
                    />
                  </FormItem>
                </div>
              </div>
            ) : null}
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Ngân sách'>
                <FormNumber
                  min={0}
                  addonAfter='đ'
                  field='budget'
                  className=''
                  disabled={disabled}
                  bordered={false}
                  controls={false}
                  onChange={(e) => checkBudget(methods, e)}
                  validation={{
                    required: 'Ngân sách là bắt buộc',
                    validate: (p) => {
                      if (p < methods.watch('total_coupon_value')) {
                        return 'Ngân sách phải lớn hơn hoặc bằng tổng giá trị coupon';
                      }
                    },
                  }}
                />
              </FormItem>
            </div>
            {!Boolean(watch('is_auto_gen')) ? (
              <div className='bw_col_6'>
                <FormItem disabled={disabled} isRequired label='Tổng giá trị Coupon'>
                  <FormNumber
                    min={0}
                    bordered={false}
                    field='total_coupon_value'
                    addonAfter='đ'
                    className=''
                    disabled={true}
                    validation={{
                      required: 'Tổng giá trị coupon là bắt buộc',
                    }}
                  />
                </FormItem>
              </div>
            ) : (
              <div className='bw_col_6'></div>
            )}
            <div className='bw_col_6'>
              <label class='bw_radio bw_col_12'>
                <FormInput
                  disabled={disabled}
                  type='checkbox'
                  field='is_auto_gen'
                  onChange={() => {
                    methods.setValue('is_auto_gen', 1);
                    methods.setValue('is_handmade', 0);
                  }}
                />
                <span />
                Tạo mã giảm giá tự động
              </label>
            </div>
            <div className='bw_col_6'>
              <label class='bw_radio bw_col_12'>
                <FormInput
                  disabled={disabled}
                  type='checkbox'
                  field='is_handmade'
                  onChange={() => {
                    methods.setValue('is_handmade', 1);
                    methods.setValue('is_auto_gen', 0);
                  }}
                />
                <span />
                Tạo mã giảm giá thủ công
              </label>
            </div>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} isRequired label='Loại đơn hàng áp dụng'>
                <FormSelect
                  list={mapDataOptions4Select(orderTypeData)}
                  mode='multiple'
                  disabled={disabled}
                  type='text'
                  field='order_type_list'
                  validation={{
                    required: 'Loại đơn hàng là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} label='Ghi chú'>
                <FormTextArea type='text' field='description' placeholder='Mô tả' />
              </FormItem>
            </div>
          </div>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
};

CouponInformation.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CouponInformation;
