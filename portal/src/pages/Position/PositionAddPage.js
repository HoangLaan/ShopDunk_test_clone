import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import _ from 'lodash';

import { createPosition, getDetailPosition, updatePosition } from 'services/position.service';
import { getOptionsGlobal } from 'actions/global';
import { getBase64 } from 'utils/helpers';

import PositionInformation from './components/add/PositionInformation';
import PositionStatus from './components/add/PositionStatus';
import FormSection from 'components/shared/FormSection';
import PositionLevelTab from './components/add/PositionLevelTab';

const PositionAddPage = () => {
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { position_id } = useParams();
  const [loadingDetail, setLoadingDetail] = useState(false);

  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.description = payload.description ?? '';
      payload.level_list = _.isObject(payload.level_list) ? Object.values(payload.level_list) : [];
      for (let i of payload.level_list) {
        i.skill_list = _.isObject(i.skill_list) ? Object.values(i.skill_list) : [];
        i.work_type_list = _.isObject(i.work_type_list) ? Object.values(i.work_type_list) : [];
      }

      let data = new FormData();

      for (let key in payload) {
        if (payload[key] instanceof Array) {
          data.append(key, JSON.stringify(payload[key]));
        } else {
          data.append(key, payload[key]);
        }
      }

      const level_list = payload.level_list;
      for (let i = 0; i < level_list.length; i++) {
        data.append(`jd_file_list[${level_list[i].hr_level_id}]`, level_list[i].jd_file);
      }

      let label;
      if (position_id) {
        await updatePosition(position_id, data);
        label = 'Chỉnh sửa';
      } else {
        await createPosition(data);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
          level_list: {
            0: {
              hr_level_id: undefined,
              experience_id: undefined,
              salary_id: undefined,
            },
          },
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error?.message);
    }
  };

  const loadPositionDetal = useCallback(() => {
    if (position_id) {
      setLoadingDetail(true);
      getDetailPosition(position_id)
        .then((value) => {
          methods.reset({
            position_id: position_id,
            position_name: value?.position_name,
            department_list: value?.department_list,
            description: value?.description,
            level_list: value?.level_list,
            is_active: value?.is_active,
            is_system: value?.is_system,
          });
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
        .finally(() => {
          setLoadingDetail(false);
        });
    } else {
      methods.reset({
        level_list: {
          0: {
            hr_level_id: undefined,
            experience_id: undefined,
            salary_id: undefined,
          },
        },
        is_active: 1,
      });
    }
  }, [position_id]);

  useEffect(loadPositionDetal, [loadPositionDetal]);

  const loadExperience = useCallback(() => {
    dispatch(getOptionsGlobal('experience'));
  }, []);
  useEffect(loadExperience, [loadExperience]);

  const loadSalary = useCallback(() => {
    dispatch(getOptionsGlobal('salary'));
  }, []);
  useEffect(loadSalary, [loadSalary]);

  const loadLevel = useCallback(() => {
    dispatch(getOptionsGlobal('level'));
  }, []);
  useEffect(loadLevel, [loadLevel]);

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin vị trí',
      component: PositionInformation,
      fieldActive: ['position_name', 'department_list'],
    },
    {
      id: 'status',
      title: 'Cấp bậc',
      component: PositionLevelTab,
      fieldActive: [
        'level_list[0].hr_level_id',
        'level_list[0].experience_id',
        'level_list[0].salary_id',
        'level_list[0].jd_file',
        'level_list[0].skill_list',
        'level_list[0].work_type_list',
      ],
    },
    { id: 'level', title: 'Trạng thái', component: PositionStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loadingDetail} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default PositionAddPage;
