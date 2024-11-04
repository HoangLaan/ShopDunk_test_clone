import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { monthOptions } from 'pages/Promotions/utils/helpers';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import CouponProductGift from 'pages/Coupon/components/add/CouponProductGift';
import { DEFFEND_KEY_GET, DEFFEND_KEY_SET, getValueByField, checkArgumentsArr } from '../../utils/helpers';
import { ARRAY_DEFEND_CONDITION_PROMOTION, ARRAY_DEFEND_CONDITION_PROMOTION_BY_KEY } from '../../utils/constants';

const DisplayBlock = styled.label`
  display: block;
`;

const PromotionsCondition = ({}) => {
  const methods = useFormContext();

  const handleAndCheckConditionPromotion = (field, value) => {
    const cloneDefffendArray = structuredClone(ARRAY_DEFEND_CONDITION_PROMOTION);
    const shortDef = structuredClone(ARRAY_DEFEND_CONDITION_PROMOTION_BY_KEY);
    let arrValueDefffendArray = [];
    cloneDefffendArray?.map((val, index) => {
      if (val) {
        let result = null;
        if (field && val === field) {
          result = getValueByField(methods, field, value, DEFFEND_KEY_SET);
        } else {
          result = getValueByField(methods, val, null, DEFFEND_KEY_GET);
        }

        if (!result) {
          methods.unregister(shortDef[`${val}`]['fieldOne'], {});
          if (shortDef[`${val}`]['fieldTwo']) {
            methods.unregister(shortDef[`${val}`]['fieldTwo'], {});
          }
        } else {
          methods.register(shortDef[`${val}`]['fieldOne'], { required: 'Trường bắt buộc' });
          if (shortDef[val]['fieldTwo']) {
            methods.register(shortDef[`${val}`]['fieldTwo'], { required: 'Trường bắt buộc' });
          }
        }
        arrValueDefffendArray.push(result);
      }
    });

    // let checkConditionPro = checkArgumentsArr(arrValueDefffendArray);
    // if(checkConditionPro) {
    //   methods.setValue('check_condition', 1);
    // } else {
    //   methods.setValue('check_condition', null);
    // }
  };

  return (
    <BWAccordion title='Điều kiện khuyến mại'>
      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_5'>
          <label className='bw_checkbox'>
            <input
              checked={methods.watch('is_promotion_by_price')}
              type='checkbox'
              onChange={(e) => {
                handleAndCheckConditionPromotion('is_promotion_by_price', e.target.checked);
              }}
            />
            <span></span> Khuyến mại theo mức giá
          </label>
        </div>
        {Boolean(methods.watch('is_promotion_by_price')) && (
          <>
            <div className='bw_col_3'>
              <FormNumber field='from_price' addonAfter='VNĐ' bordered />
            </div>
            <div className='bw_col_3'>
              <FormNumber field='to_price' addonAfter='VNĐ' bordered />
            </div>
          </>
        )}
      </div>
      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_5'>
          <label className='bw_checkbox'>
            <input
              checked={methods.watch('is_promotion_by_total_money')}
              type='checkbox'
              onChange={(e) => {
                handleAndCheckConditionPromotion('is_promotion_by_total_money', e.target.checked);
              }}
            />
            <span></span> Khuyến mại trên tổng tiền
          </label>
        </div>
        {Boolean(methods.watch('is_promotion_by_total_money')) && (
          <>
            <div className='bw_col_3'>
              <FormNumber field='min_promotion_total_money' addonAfter='VNĐ' bordered />
            </div>
            <div className='bw_col_3'>
              <FormNumber field='max_promotion_total_money' addonAfter='VNĐ' bordered />
            </div>
          </>
        )}
      </div>
      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_5'>
          <label className='bw_checkbox'>
            <input
              checked={methods.watch('is_promorion_by_total_quantity')}
              type='checkbox'
              onChange={(e) => {
                handleAndCheckConditionPromotion('is_promorion_by_total_quantity', e.target.checked);
              }}
            />
            <span></span> Khuyến mại theo số lượng mua
          </label>
        </div>
        {Boolean(methods.watch('is_promorion_by_total_quantity')) && (
          <>
            <div className='bw_col_3'>
              <FormNumber field='min_promotion_total_quantity' bordered />
            </div>
            <div className='bw_col_3'>
              <FormNumber field='max_promotion_total_quantity' bordered />
            </div>
          </>
        )}
      </div>
      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <CouponProductGift />
        </div>
      </div>
      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <label className='bw_checkbox'>
            <input
              checked={methods.watch('is_promorion_by_apply_birthday')}
              type='checkbox'
              onChange={(e) => {
                handleAndCheckConditionPromotion('is_promorion_by_apply_birthday', e.target.checked);
              }}
            />
            <span></span> Khuyến mại theo sinh nhật khách hàng
          </label>
        </div>
        {Boolean(methods.watch('is_promorion_by_apply_birthday')) && (
          <>
            <div className='bw_col_12'>
              <DisplayBlock className='bw_mt_1 bw_mb_1'>
                Chọn tháng sinh nhật sẽ áp dụng chương trình khuyến mại <span className='bw_red'> *</span>
              </DisplayBlock>
              <FormItem hiddenLabel={true} label='Chọn tháng'>
                <FormSelect mode='multiple' field='apply_birthday_list' list={monthOptions} />
              </FormItem>
            </div>
          </>
        )}

        {/* <FormInput type='hidden' field='check_condition'         
          validation={{
            required: 'Điều kiện khuyến mãi là bắt buộc',
          }}
        /> */}
      </div>
    </BWAccordion>
  );
};

export default PromotionsCondition;
