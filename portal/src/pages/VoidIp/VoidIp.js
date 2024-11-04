import React, { useEffect, useRef, useState } from 'react';
import i__callGen from 'assets/bw_image/i__callGen.svg';

import CallScreen from './components/CallScreen';
import useOutsideClick from 'hooks/use-outside-picker';
import { useAuth } from 'context/AuthProvider';
import { beforeInit } from './utils/helpers';
import { getShiftInfo } from 'services/voip.services';
import { checkIsSamTenant, genSamTenantConfig } from './utils/check.helper';
import ringingFile from './assets/Phone_Ringing.mp3';

const VoidIp = () => {
  const { user, isUserShift, setIsUserShift } = useAuth();
  const ref = useRef();
  const [openPhone, setOpenPhone] = useState(false);
  const [screen, setScreen] = useState(false);
  // const [openButton, setOpenButton] = useState(false);

  useOutsideClick(ref, () => {
    setOpenPhone(false);
  });

  useEffect(() => {
    /**
     * Fix cung khi phan ca bị loi
     */
    // const iUser = '101';
    // const iWsServers = 'wss://sbc.shopdunk.com:7444';
    // const iUri = `sip:101@pbx.shopdunk.com`;
    // const iPassword = '123abc@#123';
    // const iProxy = 'pbx.shopdunk.com:50061';
    // beforeInit(iUser, iWsServers, iUri, iPassword, iProxy);
    // setIsUserShift(true)

    // không có lịch làm việc sẽ không connect voip
    if (!user.isAdministrator) {
      // getShiftInfo()
      //   .then(() => {
          if (user?.voip_ext) {
            setIsUserShift(true);
            if (checkIsSamTenant(user?.voip_ext)) {
              const object = genSamTenantConfig(user?.voip_ext);
              beforeInit(
                object.iUser,
                object.iWsServers,
                object.iUri,
                object.iPassword,
                object.iProxy,
                user?.user_name,
              );
            } else if (user?.voip_ext.toString().startsWith('1')) {
              const iUser = user?.is_sync_voip ? user?.user_name : String(user?.voip_ext);
              const iWsServers = 'wss://sbc.shopdunk.com:7444';
              const iUri = `sip:${iUser}@pbx.shopdunk.com`;
              const iPassword = '123abc@#123'; // dang gan cung
              const iProxy = 'pbx.shopdunk.com:50061';
              beforeInit(iUser, iWsServers, iUri, iPassword, iProxy, user?.user_name);
            }
          }
        // })
        // .catch((e) => {
        //   console.log('raaaaaaaaaaaaaaaaaayt');
        //   setIsUserShift(false);
        // });
    } else {
      const iUser = 110; // set tạm máy nhánh 110 cho admin
      const iWsServers = 'wss://sbc.shopdunk.com:7444';
      const iUri = `sip:${iUser}@pbx.shopdunk.com`;
      const iPassword = '123abc@#123'; // dang gan cung
      const iProxy = 'pbx.shopdunk.com:50061';
      beforeInit(iUser, iWsServers, iUri, iPassword, iProxy, user?.user_name);
    }
  }, [user]);

  return (
    <React.Fragment>
      {/* isUserShift */}
      {(user?.voip_ext || user.isAdministrator) && (
        <>
          <div
            onClick={() => {
              setOpenPhone((value) => !Boolean(value));
              setScreen(false);
            }}
            className='bw_btn_callS'>
            <a className='bw_btn_call'>
              <img src={i__callGen} alt='' />
            </a>
          </div>
          <div ref={ref}>
            <CallScreen
              openPhone={openPhone}
              setScreenDefault={false}
              screen={screen}
              setScreen={setScreen}
              setOpenPhone={setOpenPhone}
            />
          </div>
          <audio id='voip_ringing' src={ringingFile} muted={true} />
        </>
      )}
    </React.Fragment>
  );
};

export default VoidIp;