import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';
// Components
import Panel from 'components/shared/Panel/index';
import InfoTab from './components/InfoTab/index';
import HRTab from './components/HRTab/index';
import HistoryTab from './components/HistoryTab/index';
import CapacityTab from './components/CapacityTab/index';
import SalaryHistory from './components/SalaryHistory/index';
// Services
import { getDetail, update, create } from 'services/users.service';
import { PANEL_TYPES } from './helpers/constants';
import PositionHistory from './components/PositionHistory/index';
import { generateUUID } from 'utils/helpers';

const defaultValues = {
  gender: 1,
  is_active: 1,
  is_time_keeping: 1,
  user_status: 1,
  nation_id: 1,
  current_country_id: 1,
  company_id: 1,
};
export default function UserAdd() {
  const methods = useForm({
    defaultValues,
  });

  const { reset } = methods;

  const [skillList, setSkillList] = useState([]);
  const { id: userId } = useParams();
  const { pathname } = useLocation();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const getData = useCallback(() => {
    try {
      if (userId) {
        getDetail(userId)
          .then((data) => {
            if (data) reset({ ...data });
          })
          .catch(() => {
            showToast.error(`Không tìm thấy nhân viên.`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
            });

            window._$g.rdr('/404');
          });
      } else {
        const obj = {
          ...defaultValues,
          password: Math.random().toString(36).slice(-8),
        };
        reset({ ...obj });
      }
    } catch (error) {
      showToast.error(window._$g._(error.message));
    }
  }, [userId, reset]);

  useEffect(getData, [getData]);

  const onSubmit = async (values) => {
    values.skill_list = skillList;
    try {
      if (userId) {
        await update(userId, values);
        showToast.success(`Cập nhật nhân viên thành công`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        await create(values);

        showToast.success(`Thêm mới nhân viên thành công`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });

        reset({ is_active: 1, password: '' });
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`]
        .concat((errors || []).map((item) => item?.messages?.join('. ')))
        .join('. ');
      showToast.error(msg);
    } finally {
    }
  };

  const panels = [
    {
      key: PANEL_TYPES.INFORMATION,
      label: 'Thông tin nhân viên',
      noActions: true,
      component: InfoTab,
      disabled: disabled,
    },
    {
      key: PANEL_TYPES.STAFF_INFO,
      label: 'Hồ sơ nhân sự',
      component: HRTab,
      disabled: disabled,
    },
    {
      key: PANEL_TYPES.LEVEL_HISTORY,
      label: 'Lịch sử chuyển cấp độ',
      component: HistoryTab,
      hidden: !disabled,
    },
    {
      key: PANEL_TYPES.SALARY_HISTORY,
      label: 'Lịch sử lương',
      component: SalaryHistory,
      hidden: !disabled,
    },
    {
      key: PANEL_TYPES.POSITION_HISTORY,
      label: ' Lịch sử bổ nhiệm đề xuất/sa thải',
      component: PositionHistory,
      hidden: !disabled,
    },
    {
      key: PANEL_TYPES.CAPACITY,
      label: 'Khung năng lực',
      component: CapacityTab,
      disabled: disabled,
      skillList: skillList,
      setSkillList: setSkillList,
    },
  ];
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <FormProvider {...methods}>
          <Panel panes={panels} onSubmit={onSubmit} hasSubmit />
        </FormProvider>
      </div>
    </React.Fragment>
  );
}
