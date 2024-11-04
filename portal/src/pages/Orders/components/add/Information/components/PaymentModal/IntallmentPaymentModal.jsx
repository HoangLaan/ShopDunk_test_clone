import React, { useState, useEffect } from 'react';
import BWButton from 'components/shared/BWButton';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import { formatPrice } from 'utils';
import { getInstallmentBanks } from 'services/onepay.service';
import { BANK_IMAGES, CARD_IMAGES, ONEPAY_ENV } from './constant';
import { Skeleton } from 'antd';
import { createPaymentUrl, createSecureHash, getIPAddress } from './helper';
import { useFormContext } from 'react-hook-form';
import QRModal from './QRModal';
import { v4 as uuidv4 } from 'uuid';
import { showToast } from 'utils/helpers';

const InstallmentContainer = styled.div`
  .card_item {
    height: 60px;
    padding: 10px;
    cursor: pointer;
    border-radius: 8px;
    outline: 1px solid rgba(0, 0, 0, 0.1);
  }

  .card_item.selected {
    outline: 2px solid #0066cc;
  }

  .card_logo {
    width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .installment_container {
    margin-top: 10px;
  }

  .intsallment_title {
    margin-bottom: 10px;
  }

  .plan_col {
    width: 20%;
  }

  .plan_row {
    display: flex;
    flex-wrap: warp;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

function InstallmentPaymentModal({ onClose, amount = 0, orderCode }) {
  const [openModalOR, setOpenModalOR] = useState(false);
  const [paymentURL, setPaymentURL] = useState('');
  const [loading, setLoading] = useState(false);
  const methods = useFormContext();

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState({});
  const [selectedCard, setSelectedCard] = useState({});
  const [selectedTime, setSelectedTime] = useState({});

  const bankClickHandler = (bank) => {
    setSelectedBank(bank);
    setSelectedCard(bank.cards[0]);
    setSelectedTime(bank.cards[0].times[0]);
  };

  const cardClickHandler = (card) => {
    setSelectedCard(card);
  };

  const paymentHandler = async () => {
    const payment_url = ONEPAY_ENV.PAYMENT_URL;
    const installmentQueryData = {
      vpc_Theme: 'ita',
      vpc_CardList: selectedCard?.type,
      vpc_ItaBank: selectedBank?.bank_id,
      vpc_ItaTime: selectedTime?.time,
      vpc_ItaFeeAmount: selectedTime?.fee_amount * 100, // phí trả góp * 100
    };
    const commonQueryData = {
      vpc_Version: 2,
      vpc_Currency: 'VND',
      vpc_Command: 'pay',
      vpc_AccessCode: ONEPAY_ENV.ACCESS_CODE,
      vpc_Merchant: ONEPAY_ENV.MERCHANT_ID,
      vpc_Locale: 'vn',
      vpc_ReturnURL: window.location.origin + '/payment-result',
    };
    const orderQueryData = {
      vpc_MerchTxnRef: 'ot_' + uuidv4(),
      vpc_OrderInfo: orderCode?.trim(),
      vpc_Amount: amount * 100, // số tiền thanh toán * 100
      vpc_TicketNo: await getIPAddress(),
      AgainLink: window.location.href,
      Title: `Thanh toán đơn hàng trả góp ${orderCode?.trim()}`,
      // vpc_Customer_Phone: watch('phone_number'),
      // vpc_Customer_Id: watch('customer_code'),
      // user_Xxxxxx: `user_${watch('customer_code')?.trim()}`,
    };

    const allQuery = {
      ...commonQueryData,
      ...orderQueryData,
      ...installmentQueryData,
    };

    const vpc_SecureHash = createSecureHash(allQuery);

    allQuery.vpc_SecureHash = vpc_SecureHash;

    const paymentURL = createPaymentUrl(payment_url, allQuery);
    setPaymentURL(paymentURL);
    setOpenModalOR(true);
  };

  // load installment bank list
  useEffect(() => {
    setLoading(true);
    getInstallmentBanks({ amount })
      .then((banks) => {
        banks.forEach((bank) => {
          bank.bank_image = BANK_IMAGES.find((_) => _.bank_id === bank.bank_id)?.bank_logo;
          bank.cards?.forEach((card) => {
            card.card_image = CARD_IMAGES.find((_) => _.card_type === card.type)?.card_logo;
          });
        });
        setBanks(banks);
        setSelectedBank(banks[0]);
        setSelectedCard(banks[0].cards[0]);
        setSelectedTime(banks[0].cards[0].times[0]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <React.Fragment>
      <div className='bw_modal bw_modal_open'>
        <div className='bw_modal_container bw_w1200'>
          <div className='bw_title_modal'>
            <div className='bw_flex' style={{ justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <h3>Thanh toán</h3>
            </div>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} />
          </div>
          <Skeleton active loading={loading} />
          {!loading ? (
            <InstallmentContainer>
              <div className='installment_container installment_banks'>
                <p className='intsallment_title'>1. Chọn ngân hàng trả góp</p>

                <div className='installment_wrapper'>
                  <Row gutter={[12, 12]}>
                    {banks.map((bank) => (
                      <Col span={4} key={bank.bank_id}>
                        <div
                          className={`card_item ${bank.bank_id === selectedBank.bank_id ? 'selected' : ''}`}
                          onClick={() => {
                            bankClickHandler(bank);
                          }}>
                          <img className='card_logo' src={bank.bank_image} alt={bank.bank_id} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
                <div className='installment_container installment_cards'>
                  <p className='intsallment_title'>2. Chọn loại thẻ</p>
                  <div className='installment_wrapper'>
                    <Row gutter={[12, 12]}>
                      {selectedBank.cards?.map((card, index) => (
                        <Col span={4} key={index}>
                          <div
                            className={`card_item ${selectedCard.type === card.type ? 'selected' : ''}`}
                            onClick={() => {
                              cardClickHandler(card);
                            }}>
                            <img className='card_logo' src={card.card_image} alt={card.description} />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
                <div className='installment_container installment_plans'>
                  <p className='intsallment_title'>3. Chọn gói trả góp</p>
                  <div className='installment_wrapper'>
                    <Row gutter={[12, 12]}>
                      {selectedCard.times?.map((time, index) => (
                        <Col span={4} key={index}>
                          <div
                            className={`card_item ${selectedTime.time === time.time ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedTime(time);
                            }}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                              }}>{`${time.time} tháng`}</div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
                <div className='installment_container installment_times'>
                  <div className='installment_wrapper'>
                    <div className='plan_row'>
                      <div className='plan_col'>Gói trả góp</div>
                      {selectedCard.times?.map((time, index) => {
                        return (
                          <div className='plan_col' key={index}>
                            <strong>{time.time} tháng</strong>
                          </div>
                        );
                      })}
                    </div>
                    <div className='plan_row'>
                      <div className='plan_col'>Góp mỗi tháng</div>
                      {selectedCard.times?.map((time, index) => {
                        return (
                          <div className='plan_col' key={index}>
                            <strong>{formatPrice(time.monthly_amount, true, ',')}</strong>
                          </div>
                        );
                      })}
                    </div>
                    <div className='plan_row' style={{ border: 'none' }}>
                      <div className='plan_col'>Phí trả góp</div>
                      {selectedCard.times?.map((time, index) => {
                        return (
                          <div className='plan_col' key={index}>
                            <strong>{formatPrice(time.fee_amount, true)}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <p className='bw_mt_1 bw_mb_1'>(*) Phí phụ thu sẽ được tính khi bạn thanh toán</p>
            </InstallmentContainer>
          ) : null}
          <div className='bw_footer_modal' style={{ justifyContent: 'right' }}>
            <BWButton
              content='Thanh toán'
              onClick={() => {
                if (methods.watch('order_id')) {
                  paymentHandler();
                } else {
                  showToast.warning('Đơn hàng cần phải lưu trước khi thanh toán đơn hàng !');
                }
              }}></BWButton>
            <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
      {openModalOR ? (
        <QRModal
          onClose={() => {
            setOpenModalOR(false);
          }}
          paymentURL={paymentURL}
        />
      ) : null}
    </React.Fragment>
  );
}

export default InstallmentPaymentModal;
