import React, { useState } from 'react'
import i__agreeCall from 'assets/bw_image/i__agreeCall.svg';
import i__backspace from 'assets/bw_image/i__backspace.svg';
import { transferCall } from 'services/voip.services';
import { useSelector } from 'react-redux';
import { useAuth } from 'context/AuthProvider';
import { callPhone, makeBlindTransfer ,holdCall, unholdCall } from '../../utils/helpers'

function TransferCall({setTransferPhone ,transferPhone , isOpenTransferCallModal , side , setIsOpenTransferCallModal}) {
    const callMethods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '0','*'];
    const [isHoldCall, setIsHoldCall] = useState(false)


  return (
    <React.Fragment>
      <div
        key='TransferCall'
        className={`bw_box_iphone bw_transfer_call_modal ${isOpenTransferCallModal ? 'bw_show' : null}`}
        id='bw_callScreenEnterPhone'>
        <div className='bw_numberPhone' id='bw_showNumber'>
          <input
            type='text'
            pattern='[0-9*#]+'
            maxlength='10'
            value={transferPhone}
            onChange={(e) => {
              const validCharacters = e.target.value.match(/[0-9*#]+/g);
              const sanitizedValue = validCharacters ? validCharacters.join('').substring(0, 10) : '';
              setTransferPhone(sanitizedValue);
            }}
          />
        </div>
        <div className='bw_btnNumer'>
          {callMethods.map((o) => (
            <a
              onClick={() => {
                setTransferPhone((prev) => `${prev}${o}`);
              }}
              className='bw_itemsNumber'>
              {o}
            </a>
          ))}
          <a
            onClick={() => {
              setTransferPhone('');
            }}
            className='bw_itemsNumber'>
            <img src={i__backspace} />
          </a>
        </div>
        <div className='bw_ft_call'>
          {isHoldCall ? (
            <div
              onClick={() => {
                setIsHoldCall(!isHoldCall);
                unholdCall();
              }}>
              <a className='bw_transfer_btnNumer'>
                <span className='fi fi-rr-play'></span>
              </a>{' '}
            </div>
          ) : (
            <div
              onClick={() => {
                setIsHoldCall(!isHoldCall);
                holdCall();
              }}>
              {' '}
              <a className='bw_transfer_btnNumer'>
                <span className='fi fi-rr-pause'></span>
              </a>
            </div>
          )}
          <div
            onClick={() => {
              if (transferPhone.length > 0) {
                // transferCall({ext: transferPhone, sip_id:sip_id , legs: side , current_ext : user?.voip_ext});
                makeBlindTransfer(transferPhone);
                setIsOpenTransferCallModal(false);
                document.getElementById('bw_calling').classList.remove('bw_modal_open');
              }
            }}>
            {' '}
            <a className='bw_callNow bw_open_modal' data-href='#bw_calling'>
              <img src={i__agreeCall} />
            </a>
          </div>
          <div
            onClick={() => {
              if (transferPhone.length > 0) {
                // transferCall({ext: transferPhone, sip_id:sip_id , legs: side , current_ext : user?.voip_ext});
                makeBlindTransfer(transferPhone);
                setIsOpenTransferCallModal(false);
                document.getElementById('bw_calling').classList.remove('bw_modal_open');
              }
            }}
            className='bw_transfer_btnNumer'>
            <a className='bw_itemsNumber'>
              <span className='fi fi-rr-data-transfer'></span>
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TransferCall