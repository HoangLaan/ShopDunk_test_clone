import BWButton from 'components/shared/BWButton/index';
import CheckAccess from 'navigation/CheckAccess';
import ToggleButton from 'components/shared/ToggleButton/ToggleButton';

const ActionTask = ({ actions, onChange, data, params }) => {
  return (
    <div className='bw_row bw_mt_2 bw_align_items_center' style={{ marginBottom: -20, marginTop: 30 }}>
      <div className='bw_col_6 bw_flex bw_justify_content_left bw_btn_group'>
        <ToggleButton
          isActive={params?.is_complete === 2}
          onClick={() => onChange({ is_complete: 2 })}
          style={{ marginRight: 5 }}>
          Tất cả ({data?.[0]?.total_task || 0})
        </ToggleButton>
        <ToggleButton
          color='#2f80ed'
          isActive={params?.is_complete === 1}
          onClick={() => onChange({ is_complete: 1 })}
          style={{ marginRight: 5 }}>
          Đã hoàn thành ({data?.[0]?.total_task_complete || 0})
        </ToggleButton>
        <ToggleButton
          color='#ec2d41'
          isActive={params?.is_complete === 0}
          onClick={() => onChange({ is_complete: 0 })}
          style={{ marginRight: 5 }}>
          Chưa hoàn thành ({(data?.[0]?.total_task || 0) - (data?.[0]?.total_task_complete || 0)})
        </ToggleButton>
      </div>
      <div className='bw_col_6 bw_flex bw_justify_content_right'>
        {actions
          ?.filter((p) => p.globalAction && !p.hidden)
          .map((props, i) => (
            <CheckAccess permission={props?.permission}>
              <BWButton
                style={{
                  marginLeft: '3px',
                }}
                {...props}
              />
            </CheckAccess>
          ))}
      </div>
    </div>
  );
};
export default ActionTask;
