import React, { useCallback, useEffect, useState } from 'react';
import { showToast } from 'utils/helpers';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';

import { getDataSkill } from 'services/users.service';
import CapacityTabble from './CapacityTable';

const Wrapper = styled.div`
  .bw_collapse .bw_collapse_title h4 {
    font-weight: 400;
    margin-top: 14px;
    margin-bottom: 14px;
  }

  .bw_collapse .bw_collapse_title h4 i {
    font-size: 26px;
    margin-bottom: -1px;
  }

  .jd_title {
    display: flex;
    align-items: center;
  }

  iframe {
    width: 90%;
    height: 500px;
    margin: 5px 5%;
  }
`;

function CapacityTab({ disabled, skillList, setSkillList }) {
  const methods = useFormContext();
  const [levelList, setLevelList] = useState([]);
  const [jdFile, setJdFile] = useState(null);

  const user_id = methods.watch('user_id');
  const position_id = methods.watch('position_id');
  const user_level_id = methods.watch('user_level_id');

  const loadData = useCallback(() => {
    if (user_id || (position_id && user_level_id)) {
      getDataSkill({ user_id, position_id, user_level_id })
        .then((res) => {
          setSkillList(res?.skill_list);
          setLevelList(res?.level_list);
          setJdFile(res?.jd_file);
        })
        .catch((error) => {
          showToast.error(error?.message ?? 'Có lỗi xảy ra', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        })
        .finally(() => {});
    } else {
    }
  }, [user_id, position_id, user_level_id, setSkillList]);

  useEffect(loadData, [loadData]);

  return (
    <Wrapper className='bw_tab_items bw_active'>
      {Boolean(jdFile?.file_path) && (
        <div className='bw_collapse'>
          <div className='bw_collapse_title'>
            <h3>Mô tả công việc theo vị trí làm việc</h3>
          </div>

          <div className='bw_collapse_title'>
            <h4 className='jd_title'>
              <i className='fi fi-rr-document-signed'></i> <span>{jdFile?.file_name}</span>
            </h4>
          </div>

          {/* <iframe
          title='Google'
          src='http://docs.google.com/gview?url=http://hhmobile-test.blackwind.vn/file/58850fb4-9749-4a26-ae73-43f4098ed5ad.docx&embedded=true'
          frameborder='0'></iframe> */}
          <iframe
            title='Microsoft'
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${jdFile?.file_path}`}
            frameborder='0'></iframe>
        </div>
      )}

      <div className='bw_collapse'>
        <div className='bw_collapse_title'>
          <h3>
            Khung năng lực nhân sự{' '}
            {methods.watch('user_name') + (methods.watch('full_name') ? ' - ' + methods.watch('full_name') : '')}
          </h3>
        </div>

        <CapacityTabble disabled={disabled} skillList={skillList} setSkillList={setSkillList} levelList={levelList} />
      </div>
    </Wrapper>
  );
}

export default CapacityTab;
