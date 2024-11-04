import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

// Component share
// import FormStatus from 'components/shared/FormCommon/FormStatus';
import FormStatusHoliday from './Components/FormStatusHoliday';
import FormSection from 'components/shared/FormSection';
// import FormSection from 'components/shared/FormSectionUpdate';

import FormInfor from './Components/HolidayInfo';

// Services
import { createHoliday, getHolidayById, updateHoliday } from './helpers/call-api';

const HolidayAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { holiday_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/view') || pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.is_apply_work_day = payload.is_apply_work_day ? 1 : 0;
      payload.holiday_name = payload.holiday_name;
      payload.start_date = payload.start_date?.value;
      payload.end_date = payload.end_date?.value;

      let label;
      if (holiday_id) {
        await updateHoliday(holiday_id, { ...payload, holiday_id: `${holiday_id}` });
        label = 'Chỉnh sửa';
      } else {
        await createHoliday(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        // progress: true,
        theme: 'colored',
        progress: undefined,
      });
    } catch (error) {
      let { errors = {} } = error;
      let { message = 'Có lỗi xảy ra!' } = errors;
      showToast.error(`${message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        // progress: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };
  const loadDetailHoliday = useCallback(() => {
    if (holiday_id) {
      getHolidayById(holiday_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        is_apply_work_day: 1,
      });
    }
  }, [holiday_id]);

  useEffect(loadDetailHoliday, [loadDetailHoliday]);

  const detailForm = [
    {
      title: 'Thông tin ngày lễ',
      id: 'information',
      component: FormInfor,
      fieldActive: ['holiday_name', 'date_from', 'date_to', 'total_day'],
    },
    { id: 'form_status', title: 'Trạng thái', component: FormStatusHoliday, hiddenSystem: true },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default HolidayAddPage;
