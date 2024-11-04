import React, { useEffect, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { useFormContext } from 'react-hook-form';
import { OFFER_TYPE } from 'pages/PromotionOffers/utils/constants';
import { offerTypes, typePromotionOffers } from 'pages/PromotionOffers/utils/helpers';
import PromotionsProductTable from './PromotionProductTable';
import PromotionProductModal from './PromotionProductModal';
import { Segmented } from 'antd';
import styled from 'styled-components';
import { showToast } from 'utils/helpers';

const SHIPPING_TYPE = {
  FREE: 1,
  MONEYTRANFER: 2,
  PERCENTTRANFER: 3,
};

const SegmentedStyled = styled(Segmented)`
  .ant-segmented-item-selected {
    background-color: #1b3c40 !important;
    color: white !important;
  }
`;

const PromotionOffersType = ({ disabled }) => {
  const [openModalGift, setOpenModalGift] = useState(false);
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const [selectedOption, setSelectedOption] = useState(1);

  const offer_type = watch('offer_type');
  const typeValue = watch('type_value');

  useEffect(() => {
    methods.register('offer_type');
  }, []);

  useEffect(() => {
    if(typeValue && typeValue !==1) {
      setSelectedOption(typeValue)
    }
  }, [typeValue]);

  const handleOptionChange = (e) => {
    setSelectedOption(e);
  };

  const discountValue = watch('discount_value')
  const companyValue = watch('company_value')

  useEffect(() => {
    if (discountValue && companyValue && selectedOption === 1 && !disabled) {
      const partnerValue = discountValue - companyValue
      if (partnerValue >= 0) {
        setValue('partner_value', partnerValue);
        setValue('type_value', selectedOption);
      } else {
        setValue('partner_value', 0);
        showToast.error('Số tiền không hợp lệ!');
      }
    } else if (discountValue && companyValue && selectedOption === 2 && !disabled) {
      const partnerValue = 100 - companyValue
      if (partnerValue >= 0) {
        setValue('partner_value', partnerValue);
        setValue('type_value', selectedOption);
      } else {
        setValue('partner_value', 0);
        showToast.error('Số tiền không hợp lệ!');
      }
    }

    if(selectedOption === 2 && companyValue > 100) {
      setValue('company_value', 100);
    }

  }, [selectedOption, discountValue, companyValue, setValue]);

  const renderOfferType = (offerType, addonAfter) => {
    if (offer_type !== offerType) return null;

    switch (offerType) {
      case OFFER_TYPE.GIFT:
        return (
          <PromotionsProductTable
            fieldProduct='list_offer_gifts'
            contentCreate='Chọn quà tặng'
            noLoadData
            handleOpenModalGift={() => setOpenModalGift(true)}
          />
        );
      case OFFER_TYPE.TRANSPORT:
        return (
          <div className='bw_row'>
            <label className='bw_col_12 bw_radio'>
              <input
                type='radio'
                onClick={() => {
                  setValue('shipping_promotion', SHIPPING_TYPE.FREE);
                }}
                checked={watch('shipping_promotion') == SHIPPING_TYPE.FREE}></input>
              <span /> Miễn phí vận chuyển
            </label>
            <label className='bw_col_12 bw_radio'>
              <input
                onClick={() => {
                  setValue('shipping_promotion', SHIPPING_TYPE.MONEYTRANFER);
                }}
                type='radio'
                checked={watch('shipping_promotion') == SHIPPING_TYPE.MONEYTRANFER}></input>
              <span /> Số tiền phí vận chuyển hỗ trợ
            </label>
            {watch('shipping_promotion') == SHIPPING_TYPE.MONEYTRANFER && (
              <div className='bw_col_12'>
                <FormNumber addonAfter='VND' field='discount_shipping_fee' disabled={disabled} />
              </div>
            )}
            <label className='bw_col_12 bw_radio'>
              <input
                onClick={() => {
                  setValue('shipping_promotion', SHIPPING_TYPE.PERCENTTRANFER);
                }}
                type='radio'
                checked={watch('shipping_promotion') == SHIPPING_TYPE.PERCENTTRANFER}></input>
              <span /> Phần trăm phí vận chuyển hỗ trợ
            </label>
            {watch('shipping_promotion') == SHIPPING_TYPE.PERCENTTRANFER && (
              <>
                <div className='bw_col_6'>
                  <FormNumber addonAfter='%' max={100} field='percent_shipping_fee' disabled={disabled} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className='bw_col_6'>
                  <span className='bw_col_3'>Giảm tối đa</span>
                  <FormNumber className='bw_col_9' addonAfter='VND' field='discount_max' disabled={disabled} />
                </div>
              </>
            )}
          </div>
        );
      case OFFER_TYPE.PERCENT:
        return (
          <div className='bw_row'>
            <div className='bw_col_12'>
              <div className='bw_row'>
                <div
                  style={{
                    maxWidth: '6%',
                    // flex: '0 0 100%',
                    padding: '10px',
                  }}>
                  <label className='bw_checkbox' style={{ marginRight: '0' }}>
                    Giá trị
                  </label>
                </div>
                <FormNumber
                  className='bw_col_2'
                  addonAfter={addonAfter}
                  field='discount_value'
                  disabled={disabled}
                  bordered
                />

                <div
                  style={{
                    maxWidth: '10%',
                    // flex: '0 0 100%',
                    padding: '10px',
                  }}>
                  <label className='bw_checkbox' style={{ marginRight: '0' }}>
                    Giảm tối đa
                  </label>
                </div>
                <FormNumber
                  className='bw_col_3'
                  field='max_value_reduce'
                  addonAfter='VNĐ'
                  disabled={disabled}
                  bordered
                />
              </div>

              <div className='bw_row'>
                <div
                  style={{
                    maxWidth: '14%',
                    // flex: '0 0 100%',
                    padding: '10px',
                  }}>
                  <label className='bw_checkbox' style={{ marginRight: '0' }}>
                    Điều kiện áp dụng
                  </label>
                </div>
                <FormNumber
                  className='bw_col_3'
                  field='min_total_money'
                  addonAfter='VNĐ'
                  disabled={disabled}
                  bordered
                />

                <div
                  style={{
                    maxWidth: '3%',
                    // flex: '0 0 100%',
                    padding: '10px',
                  }}>
                  <label className='bw_checkbox' style={{ marginRight: '0' }}>
                    -
                  </label>
                </div>
                <FormNumber
                  className='bw_col_3'
                  field='max_total_money'
                  addonAfter='VNĐ'
                  disabled={disabled}
                  bordered
                />
              </div>
            </div>
          </div>
        );
      case OFFER_TYPE.ISPAYMENTFORM:
        return (
          <div className='bw_row'>
            <div className='bw_col_12'>
              <div className='bw_row'>
                <div
                  style={{
                    width: '20%',
                    padding: '10px',
                  }}>
                  <label className='bw_checkbox' style={{ marginRight: '0' }}>
                    Giá trị
                  </label>
                </div>

                <FormNumber
                  className='bw_col_3'
                  field='discount_value'
                  addonAfter='VNĐ'
                  disabled={disabled}
                  bordered
                />

              </div>

              <div className='bw_row'>
                <div
                  style={{
                    width: '20%',
                    padding: '10px',
                  }}>
                  <label className='bw_checkbox' style={{ marginRight: '0' }}>
                    Hesman
                  </label>
                </div>

                <FormNumber
                  className='bw_col_3'
                  field='company_value'
                  addonAfter={
                    <SegmentedStyled
                      disabled={disabled}
                      options={typePromotionOffers}
                      onChange={handleOptionChange}
                      value={selectedOption}
                    />
                  }
                  max={selectedOption === 2 ? 100 : ''}
                  paddingnone='true'
                  disabled={disabled}
                  bordered
                />
              </div>

              <div className='bw_row'>
                <div
                  style={{
                    width: '20%',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}>
                  <label className='bw_checkbox' style={{ marginRight: '0' }}>
                    Đơn vị chấp nhận thanh toán
                  </label>
                </div>

                <FormNumber
                  className='bw_col_3'
                  field='partner_value'
                  addonAfter={
                    <SegmentedStyled
                      disabled={true}
                      options={typePromotionOffers}
                      onChange={handleOptionChange}
                      value={selectedOption}
                    />
                  }
                  paddingnone='true'
                  disabled={true}
                  bordered
                />
              </div>

            </div>
          </div>
        );
      default:
        return (
          <div className='bw_row'>
            <div
              style={{
                maxWidth: '6%',
                // flex: '0 0 100%',
                padding: '10px',
              }}>
              <label className='bw_checkbox' style={{ marginRight: '0' }}>
                Giá trị
              </label>
            </div>
            <FormNumber
              className='bw_col_3'
              addonAfter={addonAfter}
              field='discount_value'
              disabled={disabled}
              bordered
            />
          </div>
        );
    }
  };

  const handleChangeOfferType = (offerType) => {
    setValue('discount_value', 0);
    setValue('offer_type', offerType);
    setValue('partner_value', 0)
    setValue('company_value', 0)
  };

  return (
    <BWAccordion title='Ưu đãi khuyến mại'>
      <div className='bw_row'>
        {offerTypes.map(({ value, label, className, addonAfter }, index) => (
          <div className={`bw_col_12 ${className}`} key={`offer-${index}`}>
            <FormItem disabled={disabled} label=''>
              <label className='bw_checkbox'>
                <input
                  onClick={() => handleChangeOfferType(value)}
                  checked={+offer_type === value}
                  type='checkbox'></input>
                <span />
                {label}
              </label>
              {renderOfferType(value, addonAfter)}
            </FormItem>
          </div>
        ))}
      </div>

      {openModalGift && (
        <PromotionProductModal fieldProduct='list_offer_gifts' onClose={() => setOpenModalGift(false)} />
      )}
    </BWAccordion>
  );
};

export default PromotionOffersType;
