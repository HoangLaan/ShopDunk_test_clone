import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import { createAnnounceType, getDetailAnnounceType, updateAnnounceType } from 'services/announce-type.service';
import AnnounceTypeInformation from './components/add/AnnounceTypeInformation';
import AnnounceTypeStatus from './components/add/AnnounceTypeStatus';
import AnnounceTypeReviewLevelUserTable from './components/add/AnnounceTypeReviewLevelUserTable';
import { showToast } from 'utils/helpers';

const defaultValues = {
  is_active: 1,
  is_auto_review: 0,
  is_company: 1,
};

const AnnounceTypeAddPage = () => {
  const methods = useForm({
    defaultValues,
  });
  const { pathname } = useLocation();
  const { announce_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/view'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.announce_type_name = payload.announce_type_name.trim();
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_auto_review = payload.is_auto_review ? 1 : 0;
      payload.is_company = payload.is_company ? 1 : 0;
      payload.is_auto_review = payload.is_auto_review ? 1 : 0;

      if (payload.is_auto_review === 0) {
        if (!payload.review_level_user_list || payload.review_level_user_list.length === 0) {
          showToast.error('Vui lòng thêm mức duyệt!');
          return;
        }

        payload.review_level_user_list.forEach((review_level_user_item, index, review_level_user_list) => {
          review_level_user_list[index].is_complete_review = review_level_user_item.is_complete_review ? 1 : 0;
          review_level_user_list[index].review_level_id =
            review_level_user_item.review_level_id.value ?? review_level_user_item.review_level_id;
          review_level_user_list[index].is_auto_review = review_level_user_item.is_auto_review ? 1 : 0;

          if (review_level_user_list[index].is_auto_review === 0) {
            review_level_user_list[index].user_review_list = review_level_user_list[index].user_review_list.map(
              (e) => e.value ?? e,
            );
          } else {
            review_level_user_list[index].user_review_list = [];
          }
        });
      }

      let label;
      if (announce_type_id) {
        await updateAnnounceType(announce_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createAnnounceType(payload);
        label = 'Thêm mới';
        methods.reset(defaultValues);
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const isHiddenAnnounceTypeReviewLevelUserTable = methods.watch('is_auto_review');

  const detailForm = [
    {
      title: 'Thông tin loại thông báo nhân viên',
      id: 'information',
      component: AnnounceTypeInformation,
      fieldActive: ['announce_type_name', 'company_id'],
    },
    { id: 'status', title: 'Trạng thái', component: AnnounceTypeStatus },
    {
      id: 'review',
      title: 'Thông tin mức duyệt',
      hidden: isHiddenAnnounceTypeReviewLevelUserTable,
      component: AnnounceTypeReviewLevelUserTable,
    },
  ];

  const loadAnnounceType = useCallback(() => {
    if (announce_type_id) {
      setLoading(true);
      getDetailAnnounceType(announce_type_id)
        .then((value) => {
          methods.reset({
            ...value,
            company_id: String(value.company_id),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset(defaultValues);
    }
  }, [announce_type_id, methods]);
  useEffect(loadAnnounceType, [loadAnnounceType]);

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default AnnounceTypeAddPage;
