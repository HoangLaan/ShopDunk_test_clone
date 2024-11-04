import React from 'react';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';
import { StyledCareActions } from 'pages/Customer/utils/styles';
import { Select } from 'antd';
import { CURRENCY_UNIT } from '../../helper/constants';

function CustomeActions({ actions, permission, onChangeFilter }) {
  return (
    <StyledCareActions>
      <div
        className='bw_row bw_flex bw_justify_content_between bw_align_items_center bw_btn_group'
        style={{ marginBottom: '-20px', marginTop: '20px' }}>
        {actions
          ?.filter((p) => p.globalAction && !p.hidden)
          .map((props, i) => (
            <CheckAccess permission={props?.permission}>
              <BWButton style={{ marginLeft: '3px' }} {...props} />
            </CheckAccess>
          ))}
        <CheckAccess permission={permission}>
          <Select
            defaultValue={CURRENCY_UNIT.MILLION}
            style={{ width: 150 }}
            onChange={onChangeFilter}
            options={[
              { label: 'DVT: Triệu đồng', value: CURRENCY_UNIT.MILLION },
              { label: 'DVT: Nghìn đồng', value: CURRENCY_UNIT.THOUSAND },
            ]}
          />
        </CheckAccess>
      </div>
    </StyledCareActions>
  );
}

export default CustomeActions;
