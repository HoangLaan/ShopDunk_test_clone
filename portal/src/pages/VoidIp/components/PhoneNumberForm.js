import React, { useState } from 'react';

import { callPhone } from 'pages/VoidIp/utils/helpers';

import i__agreeCall from 'assets/bw_image/i__agreeCall.svg';
import i__backspace from 'assets/bw_image/i__backspace.svg';

const callMethods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '0'];

function PhoneNumberForm() {
  const [phoneCall, setPhoneCall] = useState('');

  return (
    <React.Fragment>
      <div className='bw_numberPhone' id='bw_showNumber'>
        <input
          type='number'
          value={phoneCall}
          onChange={(e) => {
            setPhoneCall(e.target.value);
          }}
        />
      </div>
      <div className='bw_btnNumer'>
        {callMethods.map((o) => (
          <a
            href='/'
            onClick={(e) => {
              e.preventDefault();
              setPhoneCall((value) => value.concat(o));
            }}
            className='bw_itemsNumber'>
            {o}
          </a>
        ))}
        <a
          href='/'
          onClick={(e) => {
            e.preventDefault();
            setPhoneCall((value) => value.slice(0, -1));
          }}
          className='bw_itemsNumber'>
          <img src={i__backspace} alt='' />
        </a>
      </div>
      <div className='bw_ft_call'>
        <a
          className='bw_callNow bw_open_modal'
          onClick={(e) => {
            e.preventDefault();
            if (phoneCall && phoneCall !== '') {
              callPhone(phoneCall);
              //setModalCall(true);
            }
          }}>
          <img src={i__agreeCall} alt='' />
        </a>
      </div>
    </React.Fragment>
  );
}

export default PhoneNumberForm;
