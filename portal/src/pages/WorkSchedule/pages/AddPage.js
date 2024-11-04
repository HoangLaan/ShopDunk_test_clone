import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import FormInfomation from '../components/Section/Infomation';
import FormStatus from '../components/Section/Status';
import FormAttachment from '../components/Section/Attachment';
import ReviewList from '../components/Section/Review';
import { createWorkSchedule, getWorkScheduleById, updateWorkSchedule } from 'services/work-schedule.service';

function WorkScheduleAdd({ id = null, disabled = false }) {
  const methods = useForm({});
  const { reset, handleSubmit } = methods;
  const [loading, setLoading] = useState(false);

  const initData = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getWorkScheduleById(id);
        data.work_schedule_review = (data.work_schedule_review || []).map((item) => {
          return { ...item, user_review: item.user_review * 1 };
        });
        reset({
          ...data,
          show_review_status: true,
        });
      } else {
        reset({
          is_active: STATUS_TYPES.ACTIVE,
          is_system: STATUS_TYPES.HIDDEN,
        });
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
      const data = new FormData();
      // handle files
      if (dataSubmit?.attached_files) {
        const savedFiles = dataSubmit?.attached_files.filter((_) => _.attachment_id);
        const newFiles = dataSubmit?.attached_files.filter((_) => _.file);
        dataSubmit.attached_files = savedFiles;

        newFiles.forEach((_) => {
          data.append('file', _.file);
        });
      }

      data.append('data', JSON.stringify(dataSubmit));

      if (id) {
        await updateWorkSchedule(id, data);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await createWorkSchedule(data);
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
      component: FormInfomation,
      id: id,
      fieldActive: ['work_schedule_name', 'work_schedule_type_id', 'start_time', 'end_time'],
    },
    {
      title: 'Minh chứng',
      component: FormAttachment,
      fieldActive: ['attached_files'],
    },
    {
      title: 'Thông tin duyệt',
      component: ReviewList,
      onRefresh: initData,
      fieldActive: null,
    },
    {
      title: 'Trạng thái',
      component: FormStatus,
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

export default WorkScheduleAdd;