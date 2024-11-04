import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

// Component share
import FormStatus from 'components/shared/FormCommon/FormStatus';
import FormMonthly from './Components/DateConfirmTimeKeepingFormMonth';
// import FormStatusHoliday from './Components/FormStatusHoliday';
import FormSection from 'components/shared/FormSection';
import DateConfirmTimeKeepingInfor from 'pages/DateCofirmTimeKeeping/Components/DateConfirmTimeKeepingInfo';

// Services
import {
  createTimeKeepingDateConfirm,
  getTimeKeepingDateConfirmyById,
  updateTimeKeepingDateConfirm,
  CheckTimeKeepingDateConfirm,
} from './helpers/call-api';

const DateCofirmTimeKeepingAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { time_keeping_confirm_date_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/view') || pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;

      let label;
      if (time_keeping_confirm_date_id) {
        await updateTimeKeepingDateConfirm(time_keeping_confirm_date_id, {
          ...payload,
          time_keeping_confirm_date_id: `${time_keeping_confirm_date_id}`,
        });
        label = 'Chỉnh sửa';
      } else {
        await createTimeKeepingDateConfirm(payload);
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
        progress: undefined,
        theme: 'colored',
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

  const loadDetailDateConfirmTimeKeeping = useCallback(() => {
    if (time_keeping_confirm_date_id) {
      getTimeKeepingDateConfirmyById(time_keeping_confirm_date_id).then((value) => {
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
  }, [time_keeping_confirm_date_id]);

  useEffect(loadDetailDateConfirmTimeKeeping, [loadDetailDateConfirmTimeKeeping]);

  const detailForm = [
    {
      title: 'Thông tin ngày khóa xác nhận công',
      id: 'information',
      component: DateConfirmTimeKeepingInfor,
      fieldActive: ['time_keeping_confirm_date_name'],
    },
    {
      title: 'Các tháng áp dụng',
      id: 'information month',
      component: FormMonthly,
      fieldActive: ['date_from', 'date_to'],
    },
    { id: 'form_status', title: 'Trạng thái', component: FormStatus, hiddenSystem: true },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};
export default DateCofirmTimeKeepingAddPage;
