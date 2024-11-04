import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import ICON_COMMON from 'utils/icons.common';
import styled from 'styled-components';
import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import PropTypes from 'prop-types';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import { Segmented } from 'antd';
import { PromotionnalSchema } from 'pages/Coupon/utils/contructor';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { showToast } from 'utils/helpers';
import { COUPON_PRODUCT_TYPE, TYPE_PROMOTION_VALUE } from 'pages/Coupon/utils/constants';
import { typePromotionValues } from 'pages/Coupon/utils/helpers';
import {
  getValueWatchByIndex,
  setValueWatchByIndex,
  handleGetTotal,
  checkAndGetValuePromational,
  checkCodePromotionalList,
} from './mathCoupon';
import utilVar from '../../helpers/index';
import PromotionsProductTable from 'pages/PromotionOffers/components/add/PromotionProductTable';
import PromotionProductModal from 'pages/PromotionOffers/components/add/PromotionProductModal';
import CouponAutoCodeGift from './CouponAutoCodeGift';

const SegmentedStyled = styled(Segmented)`
  .ant-segmented-item-selected {
    background-color: #1b3c40 !important;
    color: white !important;
  }
`;

const CouponValue = ({ loading, title, disabled }) => {
  const methods = useFormContext();
  const { setValue, watch, unregister } = methods;
  const [modalCoupon, setModalCoupon] = useState(undefined);
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'promotional_list',
  });

  const funcCheckvalue = (value, objArr, func) => {
    let result = value;
    if (!value && value !== 0) {
      result = func(objArr);
    }
    return result;
  };

  const columns = [
    {
      header: 'Giá trị',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => {
        return (
          <div
            style={{
              display: 'flex',
            }}>
            <FormNumber
              style={{
                width: '140px',
              }}
              bordered={true}
              min={0}
              field={`promotional_list.${index}.code_value`}
              onChange={(e) => {
                checkAndGetValuePromational(methods, null, index, 'code_value', e);
              }}
              validation={{
                required: 'Giá trị khuyến mại là bắt buộc',
              }}
              disabled={disabled}
            />
            <SegmentedStyled
              disabled={disabled}
              value={methods.watch(`promotional_list.${index}.code_type`)}
              options={typePromotionValues}
              onChange={(e) => {
                checkAndGetValuePromational(methods, null, index, 'code_type', e);
              }}
            />
          </div>
        );
      },
    },
    {
      header: 'Số lượng',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => {
        return (
          <React.Fragment>
            <FormNumber
              bordered={true}
              min={0}
              field={`promotional_list.${index}.quantity`}
              validation={{
                required: 'Số lượng là bắt buộc',
              }}
              onChange={(e) => {
                checkAndGetValuePromational(methods, null, index, 'quantity', e);
              }}
              disabled={disabled}
            />
          </React.Fragment>
        );
      },
    },
    {
      header: 'Giá trị áp dụng',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => {
        return (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}>
            <FormNumber
              style={{
                width: '100px',
              }}
              disabled={disabled}
              field={`promotional_list.${index}.min_total_money`}
              placeholder='Giá trị tối thiểu'
            />
            <div
              style={{
                marginRight: '2px',
                marginLeft: '2px',
              }}>
              →
            </div>
            <FormNumber
              style={{
                width: '100px',
              }}
              placeholder='Giá trị tối đa'
              disabled={disabled}
              type='text'
              field={`promotional_list.${index}.max_total_money`}
            />
          </span>
        );
      },
    },
    {
      header: 'Số lượng áp dụng',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => {
        return (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
            }}>
            <FormNumber
              style={{
                width: '100px',
              }}
              disabled={disabled}
              field={`promotional_list.${index}.min_count`}
              placeholder='Số lượng tối thiểu'
            />
            <div
              style={{
                marginRight: '2px',
                marginLeft: '2px',
              }}>
              →
            </div>
            <FormNumber
              style={{
                width: '100px',
              }}
              placeholder='Số lượng tối đa'
              disabled={disabled}
              type='text'
              field={`promotional_list.${index}.max_count`}
            />
          </span>
        );
      },
    },
    {
      header: 'Giảm tối đa',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => {
        const maxValue = getValueWatchByIndex(methods, index, 'total_value', 'promotional_list');
        return (
          getValueWatchByIndex(methods, index, 'code_type', 'promotional_list') * 1 ===
            TYPE_PROMOTION_VALUE.PERCENT && (
            <FormNumber
              type='text'
              style={{
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
              min={0}
              max={maxValue}
              disabled={disabled || methods.watch(`promotional_list.${index}.code_type`) === TYPE_PROMOTION_VALUE.MONEY}
              field={`promotional_list.${index}.max_value_reduce`}
              placeholder='Giá trị giảm tối đa'
            />
          )
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <BWAccordion isRequired title={title}>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_12'>
              <div className='bw_col_4'>
                <label class='bw_checkbox bw_col_12'>
                  <FormInput
                    disabled={disabled}
                    type='checkbox'
                    field='is_gift_code'
                    onChange={() => {
                      const is_gift_code = watch('is_gift_code');
                      methods.setValue('is_gift_code', is_gift_code ? 0 : 1);
                      if (!is_gift_code) {
                        unregister('promotional_list');
                      } else {
                        setValue('promotional_list', [
                          {
                            code_value: undefined,
                            code_type: 1,
                            quantity: undefined,
                            min_total_money: undefined,
                            max_total_money: undefined,
                            min_count: undefined,
                            max_count: undefined,
                            max_value_reduce: undefined,
                          },
                        ]);
                      }
                    }}
                  />
                  <span />
                  Mã giảm giá quà tặng
                </label>
              </div>
            </div>
          </div>
        </div>
        {!Boolean(watch('is_gift_code')) ? (
          <DataTable
            style={{
              marginTop: '0px',
            }}
            hiddenActionRow
            noPaging
            noSelect
            data={fields}
            columns={columns}
            loading={loading}
          />
        ) : (
          <div className='bw_col_12'>
            <React.Fragment>
              <CouponAutoCodeGift
                disabled={disabled}
                hiddenAction={{ detail: true }}
                contentCreate='Chọn sản phẩm'
                noLoadData
                handleOpenModalGift={() => setModalCoupon(true)}
                fieldProduct='auto_code_gift_list'
              />
              {modalCoupon && (
                <PromotionProductModal fieldProduct='auto_code_gift_list' onClose={() => setModalCoupon(false)} />
              )}
            </React.Fragment>
          </div>
        )}
      </BWAccordion>
    </React.Fragment>
  );
};

CouponValue.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CouponValue;
