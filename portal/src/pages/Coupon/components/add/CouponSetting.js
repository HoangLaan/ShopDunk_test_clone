import React, { useEffect } from 'react';

import BWAccordion from 'components/shared/BWAccordion';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { Segmented } from 'antd';
import styled from 'styled-components';

import { ARRAY_DEFEND_CONDITION_COUPON_SETTING } from 'pages/Coupon/utils/helpers';

const SegmentedStyled = styled(Segmented)`
  .ant-segmented-item-selected {
    background-color: #1b3c40 !important;
    color: white !important;
  }
`;

const CouponSetting = ({ disabled, title }) => {
  const dispatch = useDispatch();
  const methods = useFormContext({});
  const { watch, setValue } = methods;

  const { promotionsData, couponsData } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(
      getOptionsGlobal('promotions', {
        is_active: 1,
      }),
    );

    dispatch(
      getOptionsGlobal('coupons', {
        is_active: 1,
      }),
    );
  }, []);

  const checkNumberBettween = (value, valFirst = null, valueSecond = null) => {
    let result = value;
    if (valFirst && value < valFirst) {
      result = valFirst;
    }

    if (valueSecond && valueSecond < valFirst) {
      result = valueSecond;
    }
    return result;
  };

  const handleAndCheckConditionConpon = (field, value, valueDefault = null) => {
    const cloneDefffendArray = structuredClone(ARRAY_DEFEND_CONDITION_COUPON_SETTING);
    const getKeyCloneDefffendArray = Object.keys(cloneDefffendArray);
    getKeyCloneDefffendArray?.map((val, index) => {
      if (val && val == field) {
        setValue(field, value);
      }
    });
    let resetArray = cloneDefffendArray[field];
    if (resetArray) {
      resetArray.map((val, index) => {
        if (val) {
          setValue(val, valueDefault);
          // if(!value) {
          //   methods.unregister(val, {});
          // } else {
          //   methods.register(val, { required: 'Trường bắt buộc' });
          // }
        }
      });
    }
  };

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_row bw_flex bw_align_items_center'>
              <div className='bw_col_6'>
                <FormItem>
                  <label className='bw_checkbox'>
                    <FormInput
                      disabled={disabled}
                      type='checkbox'
                      field='is_aplly_other_coupon'
                      onChange={(evt) => {
                        let value = evt.target.checked;
                        handleAndCheckConditionConpon('is_aplly_other_coupon', value, []);
                      }}
                    />
                    <span />
                    Áp dụng với các mã khuyến mại khác
                  </label>
                </FormItem>
                {watch('is_aplly_other_coupon') && (
                  <FormItem disabled={disabled} label='Mã khuyến mại'>
                    <FormSelect
                      list={mapDataOptions4Select(couponsData) ?? []}
                      mode='multiple'
                      disabled={disabled}
                      onChange={(e, o) => {
                        setValue('list_coupon_apply', e || null);
                      }}
                      field='list_coupon_apply'
                    />
                  </FormItem>
                )}
              </div>
              <div className='bw_col_6'>
                <FormItem>
                  <label className='bw_checkbox'>
                    <FormInput
                      disabled={disabled}
                      type='checkbox'
                      field='is_aplly_other_promotion'
                      onChange={(evt) => {
                        let value = evt.target.checked;
                        handleAndCheckConditionConpon('is_aplly_other_promotion', value, []);
                      }}
                    />
                    <span />
                    Áp dụng với các chương trình khuyến mại khác
                  </label>
                </FormItem>
                {Boolean(watch('is_aplly_other_promotion')) && (
                  <FormItem disabled={disabled} label='Chương trình khuyến mại áp dụng'>
                    <FormSelect
                      list={mapDataOptions4Select(promotionsData) ?? []}
                      mode='multiple'
                      disabled={disabled}
                      field='list_order_promotion_apply'
                      onChange={(e, o) => {
                        setValue('list_order_promotion_apply', e || null);
                      }}
                    />
                  </FormItem>
                )}
              </div>
            </div>
            <div className='bw_row bw_flex bw_align_items_center'>
              <div className='bw_col_12'>
                <FormItem>
                  <div>
                    <label className='bw_checkbox'>
                      <FormInput
                        disabled={disabled}
                        type='checkbox'
                        field='is_limit_promotion_times'
                        onChange={(evt) => {
                          let value = evt.target.checked;
                          handleAndCheckConditionConpon('is_limit_promotion_times', value, 1);
                        }}
                      />
                      <span />
                      Giới hạn số lần khuyến mại trên 1 khách hàng
                    </label>
                  </div>
                </FormItem>
              </div>
              <div className='bw_col_12'>
                {Boolean(methods.watch('is_limit_promotion_times')) && (
                  <div className='bw_row'>
                    <FormNumber
                      className='bw_col_4'
                      bordered
                      addonAfter='lần'
                      field='count_promotion_times'
                      disabled={disabled}
                      onChange={(evt) => {
                        let value = checkNumberBettween(evt, 1);
                        setValue('count_promotion_times', value);
                      }}
                    />

                    {methods.watch('is_auto_gen') == 0 ? (
                      <div
                        className='bw_col_4'
                        style={{
                          display: 'flex',
                        }}>
                        <FormNumber
                          bordered
                          addonAfter='tháng'
                          field='mounth_promotion_times'
                          disabled={disabled}
                          onChange={(evt) => {
                            let value = checkNumberBettween(evt, 1);
                            setValue('mounth_promotion_times', value);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default CouponSetting;
