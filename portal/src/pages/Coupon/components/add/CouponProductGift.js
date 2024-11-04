import React, { useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { COUPON_PRODUCT_TYPE } from 'pages/Coupon/utils/constants';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import PromotionsProductTable from 'pages/PromotionOffers/components/add/PromotionProductTable';
import PromotionProductModal from 'pages/PromotionOffers/components/add/PromotionProductModal';

const Wrapper = styled.div`
  .bw_lb_sex label {
    width: 100%;
  }
`;

const CouponProductGift = ({ loading, title, disabled }) => {
  const methods = useFormContext();
  const [modalCoupon, setModalCoupon] = useState(undefined);

  const handleChangeAllProduct = (value) => {
    methods.setValue('is_all_promotion_product', value);
    if(value) {
      let checkTypeApplyProduct = methods.watch('type_apply_promotion_product');
      if(!checkTypeApplyProduct) {
        methods.setValue('type_apply_promotion_product', COUPON_PRODUCT_TYPE.ANY);
      }
    } else {
      methods.setValue('type_apply_promotion_product', null);
    }
  }

  return (
    <React.Fragment>
      {/* <BWAccordion title={title}>
        <Wrapper className='bw_frm_box'> */}
          <div className='bw_col_12'>
            <div className='bw_lb_sex bw_col_12'>
              <label class='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_all_promotion_product' 
                    onChange={(evt) => {
                        handleChangeAllProduct(evt.target.checked);
                        }}/>
                <span />
                Khuyến mại khi mua kèm sản phẩm
              </label>
            </div>
            {Boolean(methods.watch('is_all_promotion_product')) && (
              <React.Fragment>
                <div className='bw_flex bw_align_items_center' style={{ gap: '8px' }}>
                  <label class='bw_radio'>
                    <input
                      disabled={disabled}
                      onChange={() => {
                        methods.setValue('type_apply_promotion_product', COUPON_PRODUCT_TYPE.ANY);
                      }}
                      checked={methods.watch('type_apply_promotion_product') === COUPON_PRODUCT_TYPE.ANY}
                      type='radio'
                      name='bw_type_promotion'
                    />
                    <span></span> Áp dụng cho sản phẩm bất kỳ (Bất kỳ sản phẩm trong DS dưới đây)
                  </label>
                  <label class='bw_radio'>
                    <input
                      disabled={disabled}
                      onChange={() => {
                        methods.setValue('type_apply_promotion_product', COUPON_PRODUCT_TYPE.APPOINT);
                      }}
                      checked={methods.watch('type_apply_promotion_product') === COUPON_PRODUCT_TYPE.APPOINT}
                      type='radio'
                      name='bw_type_promotion'
                    />
                    <span></span>Áp dụng cho sản phẩm chỉ định (Mua toàn bộ sản phẩm trong DS dưới đây)
                  </label>
                </div>
                <PromotionsProductTable
                  hiddenAction={{ detail: true }}
                  contentCreate='Chọn sản phẩm'
                  noLoadData
                  handleOpenModalGift={() => setModalCoupon(true)}
                  fieldProduct='product_promotion_list'
                />
              </React.Fragment>
            )}
          </div>
        {/* </Wrapper>
      </BWAccordion> */}
      {modalCoupon && <PromotionProductModal fieldProduct='product_promotion_list' onClose={() => setModalCoupon(false)} />}
    </React.Fragment>
  );
};

CouponProductGift.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CouponProductGift;