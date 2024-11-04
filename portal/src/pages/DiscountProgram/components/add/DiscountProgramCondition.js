import React from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import DiscountProgramTradeIn from './DiscountProgramTradeIn';
import DiscountProgramDirectDiscount from './DiscountProgramDirectDiscount';
import DiscountProgramQuantityDiscount from './DiscountProgramQuantityDiscount';
import DiscountProgramGift from './DiscountProgramGift';
import DiscountProgramServicePackage from './DiscountProgramServicePackage';
import DiscountProgramInstallmentProduct from './DiscountProgramInstallmentProduct';
import FormInput from 'components/shared/BWFormControl/FormInput';

const DiscountProgramCondition = ({ disabled, loading }) => {
  const methods = useFormContext();
  const { watch, setValue, reset } = methods;

  const is_apply_with_trade_in_program = watch('is_apply_with_trade_in_program');
  const is_apply_direct_discount = watch('is_apply_direct_discount');
  const is_apply_quantity_discount = watch('is_apply_quantity_discount');
  const is_apply_gift = watch('is_apply_gift');
  const is_apply_service_pack = watch('is_apply_service_pack');
  const is_apply_installment_product = watch('is_apply_installment_product');

  const onChangeCondition = (field) => {
    setValue('is_apply_with_trade_in_program', false);
    setValue('is_apply_direct_discount', false);
    setValue('is_apply_quantity_discount', false);
    setValue('is_apply_gift', false);
    setValue('is_apply_service_pack', false);
    setValue('is_apply_installment_product', false);
    setValue(field, true);
    reset(watch());
  };

  return (
    <BWAccordion isRequired title='Điều kiện chiết khấu'>
      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <label className='bw_radio'>
            <input
              disabled={disabled}
              checked={is_apply_with_trade_in_program}
              type='checkbox'
              onChange={(e) => {
                onChangeCondition('is_apply_with_trade_in_program');
              }}
            />
            <span></span> Áp dụng cùng chương trình thu cũ đổi mới
          </label>
        </div>
        {is_apply_with_trade_in_program && (
          <>
            <DiscountProgramTradeIn loading={loading} disabled={disabled} />
          </>
        )}
      </div>

      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <label className='bw_radio'>
            <input
              disabled={disabled}
              checked={is_apply_direct_discount}
              type='checkbox'
              onChange={(e) => {
                onChangeCondition('is_apply_direct_discount');
              }}
            />
            <span></span> Áp dụng chiết khấu trực tiếp
          </label>
        </div>
        {is_apply_direct_discount && (
          <>
            <DiscountProgramDirectDiscount loading={loading} disabled={disabled} />
          </>
        )}
      </div>

      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <label className='bw_radio'>
            <input
              disabled={disabled}
              checked={is_apply_quantity_discount}
              type='checkbox'
              onChange={(e) => {
                onChangeCondition('is_apply_quantity_discount');
              }}
            />
            <span></span> Áp dụng chiết khấu theo thời gian và số lượng
          </label>
        </div>
        {is_apply_quantity_discount && (
          <>
            <DiscountProgramQuantityDiscount loading={loading} disabled={disabled} />
          </>
        )}
      </div>

      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <label className='bw_radio'>
            <input
              disabled={disabled}
              checked={is_apply_gift}
              type='checkbox'
              onChange={(e) => {
                onChangeCondition('is_apply_gift');
              }}
            />
            <span></span> Áp dụng quà tặng
          </label>
        </div>
        {is_apply_gift && (
          <>
            <DiscountProgramGift loading={loading} disabled={disabled} />
          </>
        )}
      </div>

      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <label className='bw_radio'>
            <input
              disabled={disabled}
              checked={is_apply_service_pack}
              type='checkbox'
              onChange={(e) => {
                onChangeCondition('is_apply_service_pack');
              }}
            />
            <span></span> Áp dụng chiết khấu cho gói dịch vụ
          </label>
        </div>
        {is_apply_service_pack && (
          <>
            <DiscountProgramServicePackage loading={loading} disabled={disabled} />
          </>
        )}
      </div>

      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <label className='bw_radio'>
            <input
              disabled={disabled}
              checked={is_apply_installment_product}
              type='checkbox'
              onChange={(e) => {
                onChangeCondition('is_apply_installment_product');
              }}
            />
            <span></span> Áp dụng chiết khấu cho sản phẩm trả góp
          </label>
        </div>
        {is_apply_installment_product && (
          <>
            <DiscountProgramInstallmentProduct loading={loading} disabled={disabled} />
          </>
        )}
      </div>

      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_12'>
          <label className='bw_checkbox'>
            <FormInput disabled={disabled} field='is_apply_all_discount_program' type='checkbox' />
            <span></span> Áp dụng cùng các chương trình chiết khấu khác
          </label>
        </div>
      </div>

      {/* <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_3'>
          <label className='bw_checkbox'>
            <input
              checked={watch('is_discount_percent')}
              type='checkbox'
              onChange={(e) => {
                methods.setValue('is_discount_percent', e.target.checked);
              }}
            />
            <span></span> Chiết khấu giảm theo %
          </label>
        </div>
        {watch('is_discount_percent') && (
          <>
            <div className='bw_col_4'>
              <FormNumber field='percent_from' min={0} max={watch('percent_to')} addonAfter='%' bordered />
            </div>
            <div className='bw_col_4'>
              <FormNumber field='percent_to' min={watch('percent_from')} max={100} addonAfter='%' bordered />
            </div>
          </>
        )}
      </div>

      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_3'>
          <label className='bw_checkbox'>
            <input
              checked={watch('is_discount_buy_with')}
              type='checkbox'
              onChange={(e) => {
                methods.setValue('is_discount_buy_with', e.target.checked);
              }}
            />
            <span></span> Chiết khấu mua kèm
          </label>
        </div>
      </div>
      {watch('is_discount_buy_with') && (
        <>
          <DiscountProgramProductTable
            handleOpenModal={() => setModalDiscount(true)}
            contentCreate='Chọn sản phẩm'
            noLoadData
            fieldProduct='product_list_buy'
          />
          {modalDiscount && (
            <DiscountProgramModal fieldProduct='product_list_buy' onClose={() => setModalDiscount(false)} />
          )}
        </>
      )}

      <div className='bw_col_12 bw_flex bw_align_items_center bw_mt_1'>
        <div className='bw_col_3'>
          <span></span> Áp dụng với số lượng
        </div>
        <div className='bw_col_3'>
          <FormNumber field='quantity_from' bordered />
        </div>
        <div className='bw_col_2'>
          <h1
            style={{
              fontSize: '34px',
              textAlign: 'center',
            }}>
            →
          </h1>
        </div>
        <div className='bw_col_3'>
          <FormNumber
            field='quantity_to'
            bordered
            validation={{
              validate: (p) => {
                if (p <= watch('quantity_from')) {
                  return 'Số lượng phải lớn hơn số lượng đầu';
                }
              },
            }}
          />
        </div>
      </div> */}
    </BWAccordion>
  );
};

export default DiscountProgramCondition;
