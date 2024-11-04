import React, { useState } from 'react';
import i__backspace from 'assets/bw_image/i__backspace.svg';
import i__agreeCall from 'assets/bw_image/i__agreeCall.svg';

const callMethods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '0', '*'];

const ModalCallNumberList = ({ screen, phoneCall, setPhoneCall, onCall, setScreen, setOpenPhone }) => {
  return (
    <React.Fragment>
      {screen ? (
        <>
          <div className='bw_numberPhone' id='bw_showNumber'>
            <input
              type='text'
              pattern='[0-9*#]+'
              maxlength='10'
              value={phoneCall}
              onChange={(e) => {
                const validCharacters = e.target.value.match(/[0-9*#]+/g);
                const sanitizedValue = validCharacters ? validCharacters.join('').substring(0, 10) : '';
                setPhoneCall(sanitizedValue);
              }}
            />
          </div>
          <div className='bw_btnNumer'>
            {callMethods.map((o) => (
              <a
                onClick={() => {
                  setPhoneCall((value) => value.concat(o));
                }}
                className='bw_itemsNumber'>
                {o}
              </a>
            ))}
            <a
              onClick={() => {
                setPhoneCall('');
              }}
              className='bw_itemsNumber'>
              <img src={i__backspace} />
            </a>
          </div>
          <div
            onClick={() => {
              if (phoneCall.length > 0) onCall(phoneCall);
              setScreen(!screen);
              setOpenPhone(false);
            }}
            className='bw_ft_call'>
            <a className='bw_callNow bw_open_modal' data-href='#bw_calling'>
              <img src={i__agreeCall} />
            </a>
          </div>
        </>
      ) : null}
    </React.Fragment>
  );
};

export default ModalCallNumberList;
