import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

import { reviewStatusOption, mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsUnit } from 'services/unit.service';
import { getOptionsStocksCostType } from 'services/stocks-cost-type';
import { genCostValue } from 'services/stocks-in-request.service';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import CostItem from './CostItem';

function Cost({ disabled }) {
  const methods = useFormContext();
  const { watch, setValue, formState, control } = methods;
  const [costItem, setCostItem] = useState({});

  const [optionsCostType, setOptionsCostType] = useState([]);
  const getOptsCostType = useCallback(() => {
    getOptionsStocksCostType().then((data) => {
      setOptionsCostType(mapDataOptions4SelectCustom(data));
    });
  }, []);
  useEffect(getOptsCostType, [getOptsCostType]);

  const getCostDetail = useCallback(() => {
    if (watch('cost_type_list') && watch('cost_type_list').length > 0) {
      watch('cost_type_list').map((_, index) => {
        genCostValue(_.id).then((data) => {
          setValue(`cost_type_list.${index}`, { ..._, ...data });
        });
      });
    }
  }, [watch('cost_type_list')]);
  useEffect(getCostDetail, [getCostDetail]);

  // lấy danh sách sp áp dụng chi phí
  useEffect(() => {
    if (!watch('is_apply_unit_price')) {
      setValue('product_apply_cost', watch('products_list'));
    }
  }, [watch('products_list')]);

  const handelRemoveCost = (cost_id) => {
    let _ojectValue = methods.watch('cost_type_list');
    if (_ojectValue['cost' + cost_id]) {
      delete _ojectValue['cost' + cost_id];
    }
    methods.setValue('cost_type_list_opts', Object.values(_ojectValue));
    methods.setValue('cost_type_list', _ojectValue);
  };

  const { fields } = useFieldArray({
    control,
    name: 'cost_type_list',
    rules: {
      required: false,
      validate: (field) => {
        if (field?.length > 0 && field.findIndex((_) => !_.cost_value) !== -1) {
          return `Nhập giá trị chi phí dòng số ${field.findIndex((_) => !_.cost_value) + 1}`;
        }
      },
    },
  });
  return (
    <React.Fragment>
      <div className='bw_tab_items bw_no_pt bw_active bw_mt_2' id='bw_pay'>
        <div className='bw_row bw_align_items_center'>
          <div className='bw_col_4'>
            <label className='bw_checkbox bw_checks'>
              {/* <input type='checkbox' defaultValue={1} defaultChecked /> */}
              <FormInput
                type='checkbox'
                field='is_apply_unit_price'
                disabled={disabled}
                onChange={(e) => {
                  setValue('is_apply_unit_price', e.target.checked);
                  setValue('cost_type_list', []);
                  setValue('cost_type_list_opts', []);
                  if (!e.target.checked) {
                    setValue('product_apply_cost', watch('products_list'));
                  }
                }}
              />
              <span />
              Áp dụng theo đơn giá
            </label>
          </div>
          <div className='bw_col_8 bw_flex bw_align_items_center' style={{ flexWrap: 'nowrap' }}>
            Loại chi phí:
            <div style={{ padding: '0 10px', margin: 0, marginLeft: 10, width: 'calc(100% - 140px)' }}>
              <FormSelect
                mode='multiple'
                disabled={disabled}
                showArrow
                className='bw_inp'
                placeholder='--Chọn loại chi phí--'
                field='cost_type_list_opts'
                list={optionsCostType}
                removeIcon={<></>}
                onChange={(e, opts) => {
                  setValue('cost_type_list_opts', opts);
                  let list = watch('cost_type_list');
                  let a = opts.map((item, idx) => {
                    return {
                      ...item,
                      ...list[idx],
                    };
                  });
                  setValue('cost_type_list', a);

                  // setValue('cost_type_list_opts', opts);
                  // let list = opts.reduce((t, v) => ({ ...t, ['cost' + v.cost_id]: v}),{})
                  // setValue('cost_type_list', list);
                }}
              />
            </div>
          </div>
        </div>
        <div className='bw_table_responsive bw_mt_2'>
          <table className='bw_table' id='bw_text_s'>
            <thead>
              <tr>
                <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
                <th className='bw_mw_2'>Loại chi phí</th>
                {watch('is_apply_unit_price') ? (
                  <th className='bw_mw_1'>Đơn giá</th>
                ) : (
                  <>
                    <th>Phần trăm áp dụng (%)</th>
                    <th style={{ minWidth: '190px' }}>Giá trị chi phí</th>
                  </>
                )}
                <th>Mô tả</th>

                <th className='bw_text_center'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {watch('cost_type_list') && Object.values(watch('cost_type_list') || {}).length > 0 ? (
                Object.values(watch('cost_type_list') || {}).map((item, index) => {
                  return (
                    item && (
                      <CostItem
                        key={index}
                        keyCost={`cost_type_list.${index}`}
                        item={item}
                        index={index}
                        disabled={disabled}
                        handelRemoveCost={handelRemoveCost}
                      />
                    )
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className='bw_text_center'>
                    Chưa chọn loại chi phí
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {watch('is_apply_unit_price') ? null : (
          <>
            <p className='bw_text_right bw_mt_1 bw_nonCheck bw_number_total'>
              Tổng chi phí: <b>{new Intl.NumberFormat().format(watch('total_cost_apply') ?? 0)} đ</b>
            </p>
            <div className='bw_table_responsive bw_mt_2 bw_nonCheck'>
              <table className='bw_table'>
                <thead>
                  <tr>
                    <th className='bw_text_center'>STT</th>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th className='bw_text_center'>Đơn vị tính</th>
                    <th className='bw_text_center'>Số lượng</th>
                    <th>Chi phí/Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {watch('product_apply_cost') && watch('product_apply_cost').length > 0
                    ? watch('product_apply_cost').map((p, idx) => {
                        return (
                          <tr>
                            <td className='bw_text_center'>{idx + 1}</td>
                            <td>
                              <b>{p.product_code}</b>
                            </td>
                            <td>
                              <b>{p.product_name}</b>
                            </td>
                            <td className='bw_text_center'>
                              <b>{p.unit_name}</b>
                              {/* <FormSelect
                                //field={`${keyProduct}.unit`}
                                list={p?.unit_list}
                                className='bw_inp bw_mw_2'
                                value={p.unit}
                              /> */}
                            </td>
                            <td className='bw_text_center'>{p.quantity}</td>
                            {/* <td rowSpan={3} className='bw_text_center'>
                              {p.cost_price} đ
                            </td> */}
                            {idx === 0 && (
                              <td rowSpan={watch('product_apply_cost').length + 1 ?? 1} className='bw_text_center'>
                                {new Intl.NumberFormat().format(watch('cost_per_quantity')) ?? 0} đ
                              </td>
                            )}
                          </tr>
                        );
                      })
                    : null}

                  {/* <tr>

                  </tr> */}
                  <tr>
                    <td colSpan={5} className='bw_text_center'>
                      Tổng cộng : {watch('total_quantity') ?? 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {formState.errors['cost_type_list'] && <ErrorMessage message={formState.errors?.cost_type_list?.root?.message} />}
    </React.Fragment>
  );
}

export default Cost;
