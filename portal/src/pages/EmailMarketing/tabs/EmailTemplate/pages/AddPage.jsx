import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { create, update, getById } from 'services/email-template.service';
import CustomerTemplateInfo from '../components/FormSection/Infomation';
import DynamicParams from '../components/FormSection/DynamicParams';
import { showToast } from 'utils/helpers';
import { MAIL_SUPPLIER } from 'pages/EmailMarketing/utils/constants';

const EmailTemplateAdd = () => {
  const methods = useForm({
    defaultValues: {
      mail_supplier: MAIL_SUPPLIER.MAIL_CHIMP,
    },
  });

  const { pathname } = useLocation();
  const { id: customer_template_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      let label;
      if (customer_template_id) {
        await update(payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
        methods.reset({
          mail_supplier: MAIL_SUPPLIER.MAIL_CHIMP,
        });
      }
      showToast.success(`${label} thành công !`);
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (customer_template_id) {
      getById(customer_template_id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset({
        mail_supplier: MAIL_SUPPLIER.MAIL_CHIMP,
      });
    }
  }, [customer_template_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin mẫu email',
      id: 'email_template_info',
      component: CustomerTemplateInfo,
      fieldActive: ['email_template_name', 'email_template_html', 'mail_supplier'],
    },
    {
      title: 'Nội dung mẫu',
      id: 'email_template_content',
      component: DynamicParams,
      fieldActive: ['email_template_name', 'email_template_html', 'mail_supplier'],
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection
        detailForm={detailForm}
        onSubmit={onSubmit}
        customerClose={() => {
          window._$g.rdr(`/email-marketing?tab_active=templates`);
        }}
        disabled={disabled}
      />
    </FormProvider>
  );
};

export default EmailTemplateAdd;
