import React from 'react';
import styled from 'styled-components';

import BWAccordion from 'components/shared/BWAccordion/index';

const CustomStyle = styled.ul`
  display: flex;
  flex-wrap: wrap;

  li {
    width: 50%;
    padding: 4px 0;
  }
`;

function TaskInformation({ taskInformation }) {
  return (
    <React.Fragment>
      <BWAccordion title={'Thông tin công việc'}>
        <div className='bw_frm_box'>
          <CustomStyle>
            <li>Loại công việc: {taskInformation.task_type_name}</li>
            <li>Ngày bắt đầu: {`${taskInformation.start_date || ''} - ${taskInformation.end_date || ''}`}</li>
            <li>
              Tên công việc: <b>{taskInformation.task_name}</b>
            </li>
            <li>
              Nhân viên xử lý:{' '}
              {taskInformation?.user_id && (
                <a href={`/users/detail/${taskInformation.user_id}`} className='text_link'>
                  {taskInformation.staff_name}
                </a>
              )}
            </li>
            <li>
              Nhân viên giám sát:{' '}
              {taskInformation?.supervisor_user_id && (
                <a href={`/users/detail/${taskInformation.supervisor_user_id}`} className='text_link'>
                  {taskInformation?.supervisor_name}
                </a>
              )}
            </li>
          </CustomStyle>
        </div>
      </BWAccordion>
    </React.Fragment>
  );
}

export default TaskInformation;
