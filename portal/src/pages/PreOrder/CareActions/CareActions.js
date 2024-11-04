import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'antd';

import CheckAccess from 'navigation/CheckAccess';
import { CUSTOMER_CARE_PERMISSION } from 'pages/CustomerCare/utils/constants';
import BlankButton from 'pages/CustomerCare/components/BlankButton/BlankButton';
import { showToast } from 'utils/helpers';
import ModalSendMail from 'pages/Customer/components/modals/ModalSendMail';
import ModalSendSMS from 'pages/Customer/components/modals/ModalSendSMS';
import ModalZalo from 'pages/CustomerCare/components/Modals/ModalZalo';

function CareActions(props) {
  const {
    selectedCustomer,
    isOpenModalSendMail,
    setIsOpenModalSendMail,
    isOpenModalSMS,
    setIsOpenModalSMS,
    isOpenModalZalo,
    setIsOpenModalZalo,
  } = props;

  const history = useHistory();
  const items = [
    {
      key: '1',
      label: <BlankButton icon='fa fa-tasks' title='Tạo công việc' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để tạo công việc');
        } else {
          history.push('/task/add', { selectedCustomer });
        }
      },
    },
    {
      key: '2',
      label: <BlankButton icon='fa fa-share' title='Gửi Email' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi mail');
        } else {
          setIsOpenModalSendMail(true);
        }
      },
    },
    {
      key: '3',
      label: <BlankButton icon='fa fa-rss' title='Gửi SMS' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi SMS');
        } else {
          setIsOpenModalSMS(true);
        }
      },
    },
    {
      key: '4',
      label: <BlankButton icon='fa fa-comments' title='Gửi Zalo' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi Zalo');
        } else {
          setIsOpenModalZalo(true);
        }
      },
    },
  ];
  return (
    <div className='bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
      <CheckAccess permission={CUSTOMER_CARE_PERMISSION.ACTIONS}>
        <Dropdown menu={{ items }} placement='top' arrow={{ pointAtCenter: true }}>
          <button type='button' className='bw_btn bw_btn_success' onClick={() => {}}>
            <span className='fa fa-cogs'></span> Thao tác
            <i className='bw_icon_action fa fa-angle-down bw_mr_1'></i>
          </button>
        </Dropdown>
      </CheckAccess>
      {isOpenModalSendMail && (
        <ModalSendMail onClose={() => setIsOpenModalSendMail(false)} selectedCustomer={selectedCustomer} />
      )}
      {isOpenModalSMS && <ModalSendSMS selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalSMS(false)} />}
      {isOpenModalZalo && (
        <ModalZalo selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalZalo(false)} customer={{}} />
      )}
    </div>
  );
}

export default CareActions;
