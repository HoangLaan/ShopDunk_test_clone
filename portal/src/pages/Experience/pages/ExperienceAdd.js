import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import experienceService from 'services/experience.service';
import { StyledExperience } from 'pages/Experience/utils/styles';
import ExperienceInfo from '../components/Sections/ExperienceInfo';
import FormStatusActive from '../components/Sections/FormStatusActive';

function ExperienceAdd({ id = null, disabled = false }) {
  const methods = useForm();
  const { reset, handleSubmit } = methods;

  const [loading, setLoading] = useState(false);

  const initData = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await experienceService.getById(id);
        reset(data);
      } else {
        reset({
            is_active: STATUS_TYPES.ACTIVE,
            is_system: STATUS_TYPES.HIDDEN
          }
        );
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (dataSubmit) => {
    try {
      setLoading(true);
      if (id) {
        await experienceService.update(id, dataSubmit);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await experienceService.create(dataSubmit);
        showToast.success('Thêm mới thành công');
        await initData();
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin năm kinh nghiệm',
      component: ExperienceInfo,
      fieldActive: ['experience_name', 'experience_from', 'experience_to'],
    },

    {
      title: 'Trạng thái',
      component: FormStatusActive,
      fieldActive: ['is_active', 'is_system'],
    },
  ];

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      submit: true,
      content: disabled ? 'Chỉnh sửa' : id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/experience/edit/' + id);
        else handleSubmit(onSubmit);
      },
    },
  ];

  return (
    <StyledExperience>
        <FormProvider {...methods}>
          <FormSection
            loading={loading}
            detailForm={detailForm}
            onSubmit={onSubmit}
            disabled={disabled}
            actions={actions}
          />
        </FormProvider>
    </StyledExperience>
  );
}

export default ExperienceAdd;
