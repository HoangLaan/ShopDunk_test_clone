import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotify } from 'actions/global';
import NotifySection from 'layouts/notify/components/NotifySection';
import classNames from 'classnames/bind';
import useOutsideClick from 'hooks/use-outside-picker';
import styled from 'styled-components';
import { TYPE_NOTIFY } from 'utils/constants';
import NotifyAccount from './components/NotifyAccount';
import { updateReadAllNotify } from 'services/global.service';
import { notification } from 'antd';

const Wiget = styled.span`
  h3 {
    line-height: 1.2;
  }
`;

const NotifyCommon = () => {
  const ref = useRef();
  const [countNoti, setCountNoti] = useState(0);
  const dispatch = useDispatch();
  const { openNotify, typeNotify } = useSelector((state) => state.global);

  useOutsideClick(ref, () => {
    dispatch(hideNotify());
  });

  const handleUpdateAllNotify = () => {
    updateReadAllNotify()
      .then(() => {
        notification.success({ message: 'Cập nhật thành công' });
      })
      .catch((e) => {
        notification.error({ message: e?.message });
      });
    dispatch(hideNotify());
  };

  return (
    <div ref={ref} style={{ width: '500px' }} className={classNames('bw_box_list', { bw_show: openNotify })}>
      {openNotify && (
        <Wiget>
          <h3>
            {typeNotify?.label}
            {typeNotify?.value === TYPE_NOTIFY.ANNOUNCE ? (
              // <i onClick={() => handleUpdateAllNotify} className='fi fi-rr-check'></i>
              countNoti > 0 && (
                <i onClick={() => handleUpdateAllNotify()} style={style}>
                  Đọc tất cả
                </i>
              )
            ) : (
              <i onClick={() => dispatch(hideNotify())} className='fi fi-rr-cross'></i>
            )}
          </h3>
          {typeNotify?.value === TYPE_NOTIFY.MAIL && <NotifySection />}
          {typeNotify?.value === TYPE_NOTIFY.ANNOUNCE && <NotifyAccount setCountNoti={setCountNoti} />}
        </Wiget>
      )}
    </div>
  );
};

const style = {
  backgroundColor: 'silver',
  padding: '2px 10px',
  borderRadius: '25px',
  color: '#FFFFFF',
};

export default NotifyCommon;
