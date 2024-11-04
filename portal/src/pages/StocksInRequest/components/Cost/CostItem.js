import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getProductOptions, genCostValue, genLotNumber } from 'services/stocks-in-request.service';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { updateProductPrice } from '../utils/helper';
import { getTotalCostApply } from '../utils/helper';

function CostItem({ keyCost, item, index, disabled, handelRemoveCost }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;
  // const [costDetail, setCostDetail] = useState(null);
  // useEffect(() => {
  //   if (item) {
  //     setCostDetail(item);
  //   }
  // }, [watch(keyCost)]);

  // const getCostDetail = useCallback(() => {
  //   if (item) {
  //     genCostValue(item.id).then((data) => {
  //       setCostDetail({ ...item, ...data });
  //       setValue(keyCost, { ...item, ...data });

  //       // if (costDetail) {
  //       //   setCostDetail({ ...costDetail, ...item, ...data });
  //       //   setValue(keyCost, { ...costDetail, ...item, ...data });
  //       // }
  //     });
  //   }
  // }, [item.cost_value]);
  // useEffect(getCostDetail, [getCostDetail]);
  
  useEffect(() => {
    const { total_price, total_cost_apply } = getTotalCostApply(
      watch('products_list'),
      watch('cost_type_list'),
      watch('is_apply_unit_price'),
    );
    let total_quantity = (watch('products_list') || []).reduce((total, v) => (total += (v.quantity || 0) * 1), 0);
    setValue('total_cost_apply', total_cost_apply);
    setValue('cost_per_quantity', total_cost_apply / total_quantity);

    // tính lại giá trị và %
    if (watch(`${keyCost}.cost_value`)>0 && watch(`${keyCost}.is_input_values`)) {
      setValue(`${keyCost}.percent_cost_value`, handleCostValue(watch(`${keyCost}.cost_value`), 'cost_value'));
    }
    if (watch(`${keyCost}.percent_cost_value`)>0 && !watch(`${keyCost}.is_input_values`)) {
      setValue(`${keyCost}.cost_value`, handleCostValue(watch(`${keyCost}.percent_cost_value`), 'percent_cost_value'));
    }
  }, [watch(`${keyCost}.cost_value`)]);

  const handleCostValue = (value, type) => {
    let total_price = (watch('products_list') || []).reduce((total, v) => (total += (v.total_price ?? 0) * 1), 0);
    let new_value = 0;
    if (type === 'percent_cost_value') {
      new_value = (value * total_price) / 100;
      return new_value;
    } else {
      new_value = (((value * 1) / total_price) * 100).toFixed(2);
      return new_value;
    }
  };

  return (
    <tr>
      <td className='bw_sticky bw_check_sticky bw_text_center'>{index + 1}</td>
      <td>{watch(keyCost)?.cost_name}</td>
      {watch('is_apply_unit_price') ? (
        <td className='bw_text_center bw_mw_1'>
          <FormNumber
            min={0}
            addonAfter='đ'
            field={`${keyCost}.cost_value`}
            className=''
            disabled={disabled}
            //value={costDetail ? costDetail.cost_value : item?.cost_value}
            controls={false}
          />
        </td>
      ) : (
        <>
          <td>
            <FormNumber
              min={0}
              addonAfter='%'
              controls={false}
              field={`${keyCost}.percent_cost_value`}
              style={{ background: !watch(keyCost)?.is_percent ? '#f0f0f0' : '' }}
              disabled={disabled || !watch(keyCost)?.is_percent}
              onChange={(e) => {
                setValue(`${keyCost}.percent_cost_value`, e);
                setValue(`${keyCost}.cost_value`, handleCostValue(e, 'percent_cost_value'));
              }}
              //value={watch(`${keyCost}.cost_value`) ? handleCostValue(watch(`${keyCost}.cost_value`), 'cost_value')  : watch(`${keyCost}.percent_cost_value`)}
            />
          </td>
          <td>
            <FormNumber
              min={0}
              addonAfter='đ'
              controls={false}
              field={`${keyCost}.cost_value`}
              className=''
              style={{ background: !watch(keyCost)?.is_input_values ? '#f0f0f0' : '' }}
              disabled={disabled || !watch(keyCost)?.is_input_values}
              onChange={(e) => {
                setValue(`${keyCost}.cost_value`, e);
                setValue(`${keyCost}.percent_cost_value`, handleCostValue(e, 'cost_value'));
              }}
              // value={
              //   !watch(keyCost)?.is_percent && watch(`${keyCost}.percent_cost_value`)
              //     ? handleCostValue(watch('products_list'), watch(`${keyCost}.percent_cost_value`))
              //     : watch(`${keyCost}.cost_value`)
              // }
            />
          </td>
        </>
      )}
      <td>{watch(keyCost)?.description}</td>

      <td className='bw_sticky bw_action_table bw_text_center'>
        {disabled ? null : (
          <a className='bw_btn_table bw_delete bw_red' onClick={() => handelRemoveCost(watch(keyCost)?.cost_id)}>
            <i className='fi fi-rr-trash' />
          </a>
        )}
      </td>
    </tr>
  );
}

export default CostItem;
