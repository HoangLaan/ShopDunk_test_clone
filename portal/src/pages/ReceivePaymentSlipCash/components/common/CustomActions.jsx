import React from 'react';
import { Dropdown } from 'antd';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';
import BlankButton from './BlankButton';
import { StyledCareActions } from 'pages/Customer/utils/styles';

function CustomeActions({ actions, permission }) {
  const items = [
    {
      key: '1',
      label: (
        <BlankButton
          onClick={() => window._$g.rdr(`/receive-payment-slip-cash/add?type=1`)}
          icon='fi fi-rr-plus'
          title='Thêm phiếu thu'
        />
      ),
    },
    {
      key: '2',
      label: (
        <BlankButton
          onClick={() => window._$g.rdr(`/receive-payment-slip-cash/add?type=2`)}
          icon='fi fi-rr-plus'
          title='Thêm phiếu chi'
        />
      ),
    },
  ];

  return (
    <StyledCareActions>
      <div className='bw_row bw_flex bw_justify_content_right bw_align_items_center bw_btn_group'>
        <CheckAccess permission={permission}>
          <Dropdown menu={{ items }} placement='top' arrow={{ pointAtCenter: true }}>
            <button type='button' className='bw_btn bw_btn_success' onClick={() => {}}>
              <span className='fi fi-rr-plus'></span> Thêm mới
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
    </StyledCareActions>
  );
}

export default CustomeActions;
