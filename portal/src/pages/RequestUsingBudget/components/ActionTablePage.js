import BWButton from 'components/shared/BWButton/index';
import CheckAccess from 'navigation/CheckAccess';

const ActionTablePage = ({ actions, onChange, result }) => {
  return (
    <div className='bw_row action_table bw_mt_2 '>
      <div className='bw_col_6   bw_btn_group '>
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
      <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group'>
        {actions
          .filter((x) => !x.globalAction && !x.hidden)
          .map((x, index) => (
            <BWButton {...x} key={index}></BWButton>
          ))}
      </div>
    </div>
  );
};
export default ActionTablePage;
