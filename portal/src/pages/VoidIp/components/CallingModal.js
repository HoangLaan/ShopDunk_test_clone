import React, { useRef, useState } from 'react';

import { answerCall, cancelCall } from 'pages/VoidIp/utils/helpers';
import i__callGen from 'assets/bw_image/i__callGen.svg';
import i_user_call from 'assets/bw_image/i_user_call.png';
import i__agreeCall from 'assets/bw_image/i__agreeCall.svg';
import i__removeCall from 'assets/bw_image/i__removeCall.svg';
import i__scaleDownCall from 'assets/bw_image/i__scaleDownCall.svg';
import i__scaleUpCall from 'assets/bw_image/i__scaleUpCall.svg';
import InformationCalling from './InformationCalling';
import TransferCall from './Modal/TransferCall';
import { useSelector } from 'react-redux';
import TabInforCalling from './TabInforCalling';

const sideCall = {
  ALEG: 'aleg',
  BLEG: 'bleg',
};
function CallingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const myRef = useRef();
  const { is_user_incall } = useSelector((state) => state.voidIp);
  //const phone_number = document.getElementById('bw_calling__phonenumber')?.innerHTML;
  const [isOpenTransferCallModal, setIsOpenTransferCallModal] = useState(false);
  const [transferPhone, setTransferPhone] = useState('');
  const [side, setSide] = useState();
  const [imageUrl, setImageUrl] = useState(i_user_call);

  const handleClickRemove = () => {
    document.getElementById('bw_calling').classList.remove('bw_modal_open');
    setIsOpen(true);
  };

  const handleClickOpen = () => {
    document.getElementById('bw_calling').classList.add('bw_modal_open');
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      {isOpen && (
        <div className='bw_btn_closeCall' onClick={() => handleClickOpen()}>
          <a className='bw_btn_call'>
            <img src={i__scaleUpCall} alt='' />
          </a>
        </div>
      )}

      <div id='bw_calling' className='bw_modal'>
        {/*  style={{position: 'fixed', left: '10vw', top: '30vh'}} */}
        <div className='bw_content_call' style={{position: 'fixed', left: '10vw', top: '30vh'}}>
          <div className=''>
            <p id='bw_calling__item' style={{color: '#0FE65E'}}>Đang gọi...</p>
            <img src={imageUrl || i_user_call} className='bw_imgNumber' alt='' />
            <h3 id='bw_calling__nameNumber'></h3>
            <h3 ref={myRef} id='bw_calling__phonenumber'></h3>
          </div>
          {is_user_incall && (
            <div
              // className='bw_btn bw_transferCall bw_btn_transferCallS'
              onClick={() => {
                setIsOpenTransferCallModal(!isOpenTransferCallModal);
                setSide(sideCall.ALEG);
              }}>
              {/* style={{position: 'fixed', top: '70vh', left: 'calc(10vw + 10vw)'}} */}
              <a className='bw_btn_call' style={{position: 'fixed', top: '70vh', left: 'calc(10vw + 10vw)'}}>
                <img src={i__callGen} alt='' />
              </a>
            </div> 
          )}
          <a
            onClick={(e) => {
              cancelCall();
              setIsOpenTransferCallModal(false);
              e.preventDefault();
            }}
            className='bw_endCall bw_close_modal'>
            <img src={i__removeCall} alt='' />
          </a>
          <a
            onClick={(e) => {
              handleClickRemove();
              e.preventDefault();
            }}
            className='bw_btn_scale_down'>
            <img src={i__scaleDownCall} alt='' />
          </a>
          <div className='bw_Evaluate_call'>
            <span>* Đánh giá cuộc gọi</span> <br/>
            <span style={{fontWeight: 'bold'}}>ERP: phím 68</span> <br/>
            <span style={{marginLeft: '30px', fontWeight: 'bold'}}>Máy call: phím *168#</span>
          </div>
        </div>
        <TabInforCalling setImageUrl={setImageUrl} />
      </div>

      <div id='bw_reCalling' className='bw_modal'>
        <div className='bw_content_call bw_show bw_open_modal' style={{position: 'fixed', left: '10vw', top: '30vh'}}>
          <div className=''>
            <img src={i_user_call} className='bw_imgNumber' />
            <h3 id='bw_reCalling__number'></h3>
            <p id='bw_reCalling__item' style={{color: '#0FE65E'}}>Đang gọi bạn....</p>
          </div>
          <div className='bw_mofal_ft bw_flex bw_justify_content_center bw_algin_items_center'>
            <a
              style={{position: 'fixed', margin: 0, }}
              id='bw_enjoyCalling__endCall'
              onClick={(e) => {
                answerCall();
                e.preventDefault();
              }}
              className='bw_endCall bw_open_modal'
              data-href='#bw_enjoyCalling'>
              <img src={i__agreeCall} alt='' />
            </a>
            {is_user_incall && (
              <div
                className='bw_btn bw_transferCall bw_btn_callS'
                style={{width: 0, marginLeft: '20px', animation: 'none'}}
                onClick={() => {
                  setIsOpenTransferCallModal(!isOpenTransferCallModal);
                  setSide(sideCall.BLEG);
                }}>
                <a className='bw_btn_call' style={{position: 'unset'}}>
                  <img src={i__callGen} alt='' />
                </a>
              </div>
            )}
            <a
              className='bw_btn_scale_down'
              onClick={(e) => {
                handleClickRemove();
                e.preventDefault();
              }}>
              <img src={i__scaleDownCall} alt='' />
            </a>
            <div className='bw_Evaluate_call'>
              <span>* Đánh giá cuộc gọi</span> <br/>
              <span style={{fontWeight: 'bold'}}>ERP: phím 68</span> <br/>
              <span style={{marginLeft: '30px', fontWeight: 'bold'}}>Máy call: phím *168#</span>
            </div>
          </div>
        </div>
        <TabInforCalling setImageUrl={setImageUrl} />
      </div>

      {isOpenTransferCallModal && is_user_incall && (
        <TransferCall
          side={side}
          setIsOpenTransferCallModal={setIsOpenTransferCallModal}
          isOpenTransferCallModal={isOpenTransferCallModal}
          transferPhone={transferPhone}
          setTransferPhone={setTransferPhone}
        />
      )}
    </React.Fragment>
  );
}

export default CallingModal;
