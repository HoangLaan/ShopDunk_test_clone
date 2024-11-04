import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
import usePageInformation from 'hooks/usePageInformation';
import { STATUS_TYPES } from 'utils/constants';

import interestContentService from 'services/interestContent.service';
import PageProvider from '../components/PageProvider/PageProvider';
import InformationForm from '../components/Forms/InformationForm';

function InterestContentAdd() {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const { disabled, id: interestContentId } = usePageInformation();

  const initData = async () => {
    try {
      setLoading(true);
      if (interestContentId) {
        const data = await interestContentService.getById(interestContentId);
        methods.reset(data);
      } else {
        methods.reset({ is_active: STATUS_TYPES.ACTIVE });
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

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      if (interestContentId) {
        await interestContentService.update(payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await interestContentService.create(payload);
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
      title: 'Thông tin nội dung quan tâm',
      component: InformationForm,
      fieldActive: ['description'],
    },
    {
      title: 'Trạng thái',
      component: FormStatus,
      hiddenSystem: true,
      fieldActive: methods.watch('is_active')? ['is_active'] : [],
    },
  ];

  return (
    <PageProvider>
      <FormProvider {...methods}>
        <FormSection loading={loading} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
      </FormProvider>
    </PageProvider>
  );
}

export default InterestContentAdd;
