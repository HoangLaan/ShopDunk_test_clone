import React from 'react';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';
import { StyledCareActions } from 'pages/CustomerLead/utils/styles';
import i__cus_home from 'assets/bw_image/icon/i__cus_home.svg'

function CareActions({ params, onChangeStatus, actions, totalItems }) {

  return (
    <StyledCareActions>
      <div className='bw_row bw_row_actions_custom'>
        <div className='bw_col_6 bw_table_top_badges'>
          <div className='bw_care_actions_count'>
            <img src={i__cus_home} alt='total items' />
            Tổng số khách hàng Walk in: {totalItems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          </div>
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
