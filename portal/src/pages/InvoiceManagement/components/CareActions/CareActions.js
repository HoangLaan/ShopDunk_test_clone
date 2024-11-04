import React from 'react';
import { Dropdown } from 'antd';
import { useHistory } from 'react-router-dom';

import { PERMISSION, TASK_STATUS } from 'pages/CustomerLead/utils/constants';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';
import BlankButton from '../BlankButton/BlankButton';
import { StyledCareActions } from 'pages/CustomerLead/utils/styles';
import i__cus_home from 'assets/bw_image/icon/i__cus_home.svg';
import { showToast } from 'utils/helpers';
import ToggleButton from 'components/shared/ToggleButton/ToggleButton';
import BlankButtonPermission from 'components/shared/FormCommon/BlankButtonPermission';

function CareActions({
  params,
  onChangeStatus,
  actions,
  actionsSelect,
  totalItems,
  setOpenModalMail,
  selectedCustomer,
  setOpenModalSMS,
  setIsOpenModalZalo,
}) {
  const history = useHistory();
  console.log(selectedCustomer)
  return (
    <StyledCareActions>
      <div className='bw_row bw_row_actions_custom'>
        <div className='bw_col_6 bw_flex bw_align_items_center'>
          <div className='bw_care_actions_count'>
            <img src={i__cus_home} alt='total items' />
            Số hóa đơn đã chọn: {selectedCustomer?.length ?? 0}
          </div>
          {actionsSelect
            ?.filter((p) => p.globalAction && !p.hidden)
            .map((props, i) => (
              <CheckAccess permission={props?.permission}>
                <BWButton style={{ marginLeft: '3px' }} {...props} />
              </CheckAccess>
            ))}
        </div>
        <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'>
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
