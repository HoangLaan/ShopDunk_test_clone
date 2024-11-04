import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import { createRegimeType, getDetailRegimeType, updateRegimeType } from 'services/regime-type.service';

import FormSection from 'components/shared/FormSection';
import RegimeTypeInformation from './components/add/RegimeTypeInformation';
import FormStatus from '../../components/shared/FormCommon/FormStatus';
import ReviewLevelUserTable from './components/add/ReviewLevelUserTable';

const RegimeTypeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { regime_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.is_auto_review = payload.is_auto_review ? 1 : 0;

      payload.parent_id = payload.parent_id?.value ? payload.parent_id.value : Number(payload.parent_id);

      if (payload.is_auto_review) {
        payload.review_level_user_list = undefined;
      } else {
        payload.review_level_user_list = (payload?.review_level_user_list ?? []).map((review_level_user) => {
          if (review_level_user.is_auto_review) {
            review_level_user.user_review_list = undefined;
          } else {
            review_level_user.user_review_list = (review_level_user.user_review_list ?? []).map(
              (user_review) => user_review.value ?? user_review,
            );
          }
          return review_level_user;
        });
      }

      let label;
      if (regime_type_id) {
        await updateRegimeType(regime_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createRegimeType(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin loại chế độ',
      id: 'information',
      component: RegimeTypeInformation,
      fieldActive: ['regime_type_name', 'policy'],
    },
    {
      title: 'Thông tin mức duyệt',
      id: 'reviewLevel',
      component: ReviewLevelUserTable,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  const loadExppendType = useCallback(() => {
    if (regime_type_id) {
      setLoading(true);
      getDetailRegimeType(regime_type_id)
        .then((value) => {
          methods.reset({
            ...value,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [regime_type_id, methods]);
  useEffect(loadExppendType, [loadExppendType]);

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default RegimeTypeAddPage;
