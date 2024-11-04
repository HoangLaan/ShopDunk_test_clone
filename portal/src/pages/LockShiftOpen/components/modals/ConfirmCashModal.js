import BWButton from 'components/shared/BWButton';
import LockShiftOpenContext from 'pages/LockShiftOpen/context/LockShiftOpenContext';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import ICON_COMMON from 'utils/icons.common';
import {formatPrice} from 'utils/index';


export default function ConfirmCashModal({setIsOpenConfirmCash, listCash, onConfirm }) {
  const context = useContext(LockShiftOpenContext);
  const [actualQuantity,setActualQuantity] = useState()


  useEffect(()=>{
    let totalActualQuantity = 0;
    for(let i = 0; i< listCash?.length;i++){
      totalActualQuantity += listCash[i].denomination_value * (listCash[i].actual_quantity ?? 0)
    }
    setActualQuantity(totalActualQuantity);
  },[listCash])

  return (
    <div className='bw_modal bw_modal_open'>
      <div className='bw_modal_container bw_w700'>
        <div className='bw_title_modal'>
            <h3>Xác nhận số lượng bàn giao</h3>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={()=>setIsOpenConfirmCash(false)}></span>
        </div>
        <div className='bw_main_modal'>
            <div className='bw_frm_box bw_readonly'>
              <label>Số lượng thực tế: {formatPrice(actualQuantity ?? 0, true)}</label>
              <label>Số lượng bàn giao: {formatPrice(context?.statistic.previous_total_money ?? '', true)}</label>
            </div>
          </div>
          <div className='bw_footer_modal'>
            <BWButton type='success' icon={ICON_COMMON.save} content={'Đồng ý'} onClick={()=>onConfirm()} />
            <BWButton type='danger' icon={ICON_COMMON.reject} content={'Cập nhật lại'} onClick={()=>setIsOpenConfirmCash(false)} />
        </div>
      </div>
    </div>
  );
}