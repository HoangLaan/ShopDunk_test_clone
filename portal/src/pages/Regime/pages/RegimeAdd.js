import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import RegimeInfo from '../components/Section/RegimeInfo';
import RegimeStatus from '../components/Section/FormStatusRegime';
import RegimeAttachment from '../components/Section/RegimeAttachment';
import RegimeReview from '../components/Section/RegimeReview';
import { createRegisterRegime, getRegimeById, updateRegisterRegime } from '../../../services/regime.service';

function BenefitAdd({ id = null, disabled = false }) {
  const methods = useForm();
  const { reset, handleSubmit } = methods;
  const [loading, setLoading] = useState(false);

  const initData = () => {
    if (id) {
      setLoading(true);
      getRegimeById(id)
        .then((data) => {
          data.regime_review = (data.regime_review || []).map((item) => {
            return { ...item, user_review: item.user_review * 1 };
          });

          reset(data);
        })
        .catch((error) => {
          showToast.error(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      reset({
        is_active: STATUS_TYPES.ACTIVE,
        is_system: STATUS_TYPES.HIDDEN,
      });
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (dataSubmit) => {
    try {
      setLoading(true);
      const data = new FormData();
      if (dataSubmit.attached_files && dataSubmit.attached_files.length > 0) {
        for (let i = 0; i < dataSubmit.attached_files.length; i++) {
          data.append('file', dataSubmit.attached_files[i]);
        }
      }
      data.append('data', JSON.stringify(dataSubmit));

      if (id) {
        await updateRegisterRegime(id, data);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await createRegisterRegime(data);
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
      title: 'Thông tin đăng ký',
      component: RegimeInfo,
      id: id,
      fieldActive: ['regime_type_id', 'regime_name', 'from_date', 'to_date'],
    },
    {
      title: 'Minh chứng',
      component: RegimeAttachment,
      fieldActive: ['attached_files'],
    },
    {
      title: 'Thông tin duyệt',
      component: RegimeReview,
      fieldActive: null,
    },
    {
      title: 'Trạng thái',
      component: RegimeStatus,
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
        if (disabled) window._$g.rdr('/regime/edit/' + id);
        else handleSubmit(onSubmit);
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        loading={loading}
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={disabled}
        actions={actions}
      />
    </FormProvider>
  );
}

export default BenefitAdd;
