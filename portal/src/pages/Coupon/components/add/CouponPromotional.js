import _ from 'lodash';
import React, { useMemo } from 'react';
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
import { TYPE_PROMOTION_VALUE } from 'pages/Coupon/utils/constants';
import { typePromotionValues } from 'pages/Coupon/utils/helpers';
import {
  getValueWatchByIndex,
  setValueWatchByIndex,
  handleGetTotal,
  checkAndGetValuePromational,
  checkCodePromotionalList,
} from './mathCoupon';
import utilVar from '../../helpers/index';
import WrapUnregister from 'components/shared/FormCommon/WrapUnregister';

const SegmentedStyled = styled(Segmented)`
  .ant-segmented-item-selected {
    background-color: #1b3c40 !important;
    color: white !important;
  }
`;

const CouponPromotional = ({ loading, title, disabled, isReady, id }) => {
  const methods = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'promotional_list',
  });
  const dispatch = useDispatch();

  const funcCheckvalue = (value, objArr, func) => {
    let result = value;
    if (!value && value !== 0) {
      result = func(objArr);
    }
    return result;
  };
  const columns = [
    {
      header: 'Mã khuyến mại',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => {
        return (
          <React.Fragment>
            <FormInput
              style={{
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
              disabled={disabled}
              type='text'
              field={`promotional_list.${index}.coupon_code`}
              placeholder='Mã khuyến mại'
              validation={{
                required: 'Mã khuyến mại là bắt buộc',
              }}
              onChange={(e) => {
                methods.clearErrors(`promotional_list.${index}.coupon_code`);
                const promotional_list = getValueWatchByIndex(methods, null, 'promotional_list');
                let valueUppercase = e.target.value.toUpperCase();
                let valueReturn = checkCodePromotionalList(valueUppercase, index, promotional_list);
                methods.setValue(`promotional_list.${index}.coupon_code`, valueReturn);
              }}
            />
          </React.Fragment>
        );
      },
    },
    {
      header: 'Tỉ lệ',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => {
        const promotional_list = getValueWatchByIndex(methods, null, 'promotional_list');
        const totalMax = utilVar.getValueReturnInArray(100, promotional_list, 'percent_value', index);

        return (
          <div
            style={{
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
            }}>
            <FormNumber
              style={{
                width: '80px',
              }}
              bordered={true}
              min={0}
              max={totalMax}
              field={`promotional_list.${index}.percent_value`}
              onChange={(e) => {
                checkAndGetValuePromational(methods, null, index, 'percent_value', e);
              }}
              validation={{
                required: 'Số lượng là bắt buộc',
              }}
              disabled={disabled}
            />
            <b>%</b>
          </div>
        );
      },
    },
    {
      header: 'Tổng giá trị',
      classNameHeader: 'bw_text_center',
      formatter: (_, index) => {
        let totalValue = getValueWatchByIndex(methods, index, 'total_value', 'promotional_list');
        let totalPercent = getValueWatchByIndex(methods, index, 'percent_value', 'promotional_list');
        let totalBudget = getValueWatchByIndex(methods, null, 'budget');
        const getTotalValueByIndex = funcCheckvalue(totalValue, [totalPercent, totalBudget], handleGetTotal);
        return (
          <div
            style={{
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
            }}>
            <FormNumber
              type='text'
              style={{
                width: '100px',
              }}
              min={0}
              field={`promotional_list.${index}.total_value`}
              value={getTotalValueByIndex}
              disabled={true}
            />
            <span>đ</span>
          </div>
        );
      },
    },
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
              disabled={disabled || !getValueWatchByIndex(methods, index, 'percent_value', 'promotional_list')}
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

  const isCheckTotalCoupon = Boolean(methods.watch('budget'));

  const promotionalRatioValue = (methods.watch('promotional_list') ?? []).reduce(function (acc, obj) {
    return acc + obj.percent_value;
  }, 0);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm dòng',
        hidden: disabled,
        onClick: () => {
          if (isCheckTotalCoupon) {
            if (promotionalRatioValue >= 100) {
              showToast.error('Tỉ lệ  khuyến mại đã bằng 100%', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
              });
              return;
            }
            append(new PromotionnalSchema(TYPE_PROMOTION_VALUE.MONEY));
          } else {
            showToast.error('Vui lòng nhập ngân sách coupon!', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });
          }
        },
      },
      {
        icon: ICON_COMMON.trash,
        hidden: disabled,
        color: 'red',
        onClick: (value, index) => {
          dispatch(
            showConfirmModal([`Xoá mã khuyến mại này?`], () => {
              remove(index);
            }),
          );
        },
      },
    ];
  }, [isCheckTotalCoupon, promotionalRatioValue]);

  return (
    <React.Fragment>
      {(isReady && id) || (!isReady && !id) ? (
        <WrapUnregister field={['promotional_list']}>
          <BWAccordion isRequired title={title}>
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
              actions={actions}
            />
          </BWAccordion>
        </WrapUnregister>
      ) : null}
    </React.Fragment>
  );
};

CouponPromotional.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CouponPromotional;
