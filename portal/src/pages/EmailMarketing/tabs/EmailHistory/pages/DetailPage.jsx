import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { create, update, getById } from 'services/email-history.service';
import EmailHistoryInfo from '../components/FormSection/Infomation';
import EmailContent from '../components/FormSection/MailContent';
import { showToast } from 'utils/helpers';
import { useHistory } from 'react-router-dom';

const EmailHistoryDetail = () => {
  const methods = useForm({});
  const history = useHistory();

  const { pathname } = useLocation();
  const { id: email_history_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      let label;
      if (email_history_id) {
        await update(payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
        methods.reset({});
      }
      showToast.success(`${label} thành công !`);
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (email_history_id) {
      getById(email_history_id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset({});
    }
  }, [email_history_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin gửi mail',
      id: 'eamil_history_info',
      component: EmailHistoryInfo,
      fieldActive: ['email_from', 'email_to'],
    },
    {
      title: 'Nội dung gửi mail',
      id: 'eamil_history_info',
      component: EmailContent,
      fieldActive: ['email_content'],
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection
        actions={[]}
        detailForm={detailForm}
        onSubmit={onSubmit}
        customerClose={() => {
          history.goBack();
        }}
        disabled={disabled}
      />
    </FormProvider>
  );
};

export default EmailHistoryDetail;
