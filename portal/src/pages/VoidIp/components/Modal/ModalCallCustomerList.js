import React from 'react';
import i__agreeCall from 'assets/bw_image/i__agreeCall.svg';
import i__numberCall from 'assets/bw_image/i__numberCall.svg';
import { callPhone } from 'pages/VoidIp/utils/helpers';

const ModalCallNumberList = ({ screen, setScreen, dataCustomer, conRef }) => {

  return (
    <React.Fragment>
      {!screen && <>
        <div className="bw_list_customer">
          <h3>Danh sách khách hàng</h3>
          <ul ref={conRef}>
            {dataCustomer && dataCustomer.map((value, index) => {
              if (value) {
                return (
                  <li key={index}>
                    <h4>{value.full_name}</h4>
                    <span>{value.phone_number}</span>
                    <a className="bw_callBtn">
                      <img src={i__agreeCall}
                        onClick={() => {
                          callPhone(value.phone_number);
                        }} />
                    </a>
                  </li>
                )
              }
            })}
          </ul>
        </div>
        <div className="bw_changeMethodCal">
          <a className="bw_btn_changeMethod"><img src={i__numberCall}
            onClick={() => setScreen(true)}
            alt="Call" /></a>
        </div></>}
    </React.Fragment>
  );
};

export default ModalCallNumberList;
