import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

import { RelationshipInfo, RelationshipStatus } from './components/RelationshipForm';
import { createRelationship, getDetail, updateRelationship } from './helpers/call-api';
const RelationshipAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { id: relationshipmember_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      //payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (relationshipmember_id) {
        await updateRelationship(relationshipmember_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createRelationship(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (relationshipmember_id) {
      getDetail(relationshipmember_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [relationshipmember_id]);

  const detailForm = [
    {
      title: 'Thông tin mối quan hệ',
      id: 'information',
      component: RelationshipInfo,
      fieldActive: ['level_name'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: RelationshipStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default RelationshipAdd;
