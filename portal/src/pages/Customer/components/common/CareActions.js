import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'antd';

import { PERMISSION, TASK_STATUS } from 'pages/Customer/utils/constants';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';
import BlankButton from './BlankButton';
import { StyledCareActions } from 'pages/Customer/utils/styles';
import i__cus_home from 'assets/bw_image/icon/i__cus_home.svg';
import { showToast } from 'utils/helpers';
import ToggleButton from 'components/shared/ToggleButton/ToggleButton';
import BlankButtonPermission from 'components/shared/FormCommon/BlankButtonPermission';

function CareActions({
  params,
  onChangeStatus,
  actions,
  totalItems,
  selectedCustomer,
  openModalSendMail,
  openModalSendSMS,
  setIsOpenModalZalo,
}) {
  const history = useHistory();

  const items = [
    {
      key: '1',
      label: <BlankButtonPermission icon='fa fa-tasks' title='Tạo công việc' permission={PERMISSION.ACTIONS_TASK} />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để tạo công việc');
        } else {
          history.push('/task/add', {
            selectedCustomer: (selectedCustomer || []).map((x) => ({ ...x, birthday: x.birth_day })),
          });
        }
      },
    },
    {
      key: '2',
      label: <BlankButtonPermission icon='fa fa-share' title='Gửi Email' permission={PERMISSION.ACTIONS_EMAIL} />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi mail');
        } else {
          openModalSendMail();
        }
      },
    },
    {
      key: '3',
      label: <BlankButtonPermission icon='fa fa-rss' title='Gửi SMS' permission={PERMISSION.ACTIONS_SMS} />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi SMS');
        } else {
          openModalSendSMS();
        }
      },
    },
    {
      key: '4',
      label: <BlankButtonPermission icon='fa fa-comments' title='Gửi Zalo' permission={PERMISSION.ACTIONS_ZALO} />,
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
    <StyledCareActions>
      <div className='bw_row bw_row_actions_custom'>
        <div className='bw_col_6 bw_flex bw_align_items_center '>
          <div className='bw_care_actions_count'>
            <img src={i__cus_home} alt='total items' />
            Tổng số khách hàng: {totalItems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          </div>
          <div>
            <ToggleButton
              color='#2f80ed'
              isActive={params?.task_status === TASK_STATUS.ASSIGNED}
              onClick={() => onChangeStatus(TASK_STATUS.ASSIGNED)}
              style={{ marginRight: 10 }}>
              Đã phân công
            </ToggleButton>
            <ToggleButton
              color='#ec2d41'
              isActive={params?.task_status === TASK_STATUS.NOT_ASSIGNED}
              onClick={() => onChangeStatus(TASK_STATUS.NOT_ASSIGNED)}
              style={{ marginRight: 10 }}>
              Chưa phân công
            </ToggleButton>
            <ToggleButton
              color='#f2994a'
              isActive={params?.task_status === TASK_STATUS.IN_PROCESS}
              onClick={() => onChangeStatus(TASK_STATUS.IN_PROCESS)}>
              Đang chăm sóc
            </ToggleButton>
          </div>
        </div>
        <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'>
          <CheckAccess permission={PERMISSION.ACTIONS}>
            <Dropdown menu={{ items }} placement='top' arrow={{ pointAtCenter: true }}>
              <button type='button' className='bw_btn bw_btn_success' onClick={() => {}}>
                <span className='fa fa-cogs'></span> Thao tác
              </button>
            </Dropdown>
          </CheckAccess>
          {actions
            ?.filter((p) => p.globalAction && !p.hidden)
            .map((props, i) => (
              <CheckAccess permission={props?.permission}>
                <BWButton style={{ marginLeft: '3px' }} {...props} />
              </CheckAccess>
            ))}
        </div>
      </div>
    </StyledCareActions>
  );
}

export default CareActions;
