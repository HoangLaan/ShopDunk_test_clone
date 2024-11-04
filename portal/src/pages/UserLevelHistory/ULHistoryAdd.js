import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
// Service
import { getDetail, create, update } from 'services/user-level-history.service';
import FormSection from 'components/shared/FormSection/index';
import UserLevelHistoryInfo from './components/add/UserLevelHistoryInfo';

export default function ULHistoryAdd() {
  const methods = useForm();
  const { reset } = methods;

  const { pathname } = useLocation();
  const { id: ulhistoryId } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(() => {
    if (ulhistoryId) {
      setLoading(true);
      getDetail(ulhistoryId)
        .then((data) => {
          if (data) {
            reset({
              ...data,
            });
          }
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
          setLoading(false);
        });
    } else {
      reset({});
    }
  }, [ulhistoryId, reset]);

  useEffect(getData, [getData]);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);

      let label;
      if (ulhistoryId) {
        await update(ulhistoryId, payload);
        label = 'Cập nhật chuyển cấp';
      } else {
        await create(payload);
        label = 'Chuyển cấp';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);

      methods.reset({});
    } catch (error) {
      let { errors, statusText, message } = error;

      showToast.error([`${statusText || message}`].concat(errors || []).join('.') ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin',
      id: 'information',
      component: UserLevelHistoryInfo,
      fieldActive: [
        'username',
        'department_old_id',
        'position_old_id',
        'position_level_old_id',
        'department_new_id',
        'position_new_id',
        'position_level_new_id',
        'apply_date',
      ],
      ulhistoryId: ulhistoryId,
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
}