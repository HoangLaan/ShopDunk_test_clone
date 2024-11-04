import React, { useRef, useState, useEffect, useCallback } from 'react';
import { callPhone } from '../utils/helpers';
import ModalCallCustomerList from './Modal/ModalCallCustomerList';
import ModalCallNumberList from './Modal/ModalCallNumberList';
import { getListByUser } from 'services/accounting-account.service';
import { defaultParams } from 'utils/helpers';
import _ from 'lodash';
import useScroll from 'hooks/use-scroll';
import CallingModal from './CallingModal';

const CallScreen = ({ openPhone, screen, setScreen, setOpenPhone }) => {
  const [phoneCall, setPhoneCall] = useState('');
  const [dataCustomer, setDataCustomer] = useState([]);
  const [params, setParams] = useState(defaultParams);
  const [stopScroll, setStopScroll] = useState(false);
  const [loading, setLoading] = useState(false);
  const viewListRef = useRef(null);
  const [isScroll] = useScroll(viewListRef);
  const getInitData = useCallback(() => {
    getListByUser(params).then((data) => {
      if (data?.length === 0) {
        setStopScroll(true);
        setLoading(false);
        return;
      }
      if (params.page > 1) {
        setDataCustomer((prev) => _.concat(prev, data));
      } else {
        setDataCustomer(data);
      }
      setLoading(false);
    });
  }, [params]);

  useEffect(getInitData, [getInitData]);

  useEffect(() => {
    if (isScroll && !loading && !stopScroll) {
      setParams((prev) => {
        return {
          ...prev,
          page: prev.page + 1,
        };
      });
    }
  }, [isScroll, loading, stopScroll]);

  return (
    <React.Fragment>
      <div className={`bw_box_iphone ${openPhone ? 'bw_show' : ''}`} id='bw_callScreenEnterPhone'>
        <ModalCallNumberList
          setScreen={setScreen}
          screen={screen}
          phoneCall={phoneCall}
          onCall={callPhone}
          setPhoneCall={setPhoneCall}
          setOpenPhone={setOpenPhone}></ModalCallNumberList>
        <ModalCallCustomerList
          setScreen={setScreen}
          screen={screen}
          phoneCall={phoneCall}
          setPhoneCall={setPhoneCall}
          dataCustomer={dataCustomer}
          conRef={viewListRef}></ModalCallCustomerList>
      </div>
      <CallingModal />
      <h3 id='sip_id__call_after__call'></h3>
    </React.Fragment>
  );
};

export default CallScreen;
