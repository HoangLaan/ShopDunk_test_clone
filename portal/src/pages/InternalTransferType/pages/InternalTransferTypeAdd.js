import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
import usePageInformation from 'hooks/usePageInformation';
import { STATUS_TYPES } from 'utils/constants';

import internalTransferTypeService from 'services/internalTransferType.service';
import PageProvider from '../components/PageProvider/PageProvider';
import InformationForm from '../components/Forms/InformationForm';
import ReviewLevelUserForm from '../components/Forms/ReviewLevelUserForm';
import useDetectHookFormChange from 'hooks/useDetectHookFormChange';

function InternalTransferTypeAdd() {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const { disabled, id: internalTransferTypeId } = usePageInformation();

  // useDetectHookFormChange(methods)
  console.log('InternalTransferTypeAdd', methods.watch())

  const initData = async () => {
    try {
      setLoading(true);
      if (internalTransferTypeId) {
        const data = await internalTransferTypeService.getById(internalTransferTypeId);
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
      if (internalTransferTypeId) {
        await internalTransferTypeService.update(payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await internalTransferTypeService.create(payload);
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
      title: 'Thông tin hình thức chuyển tiền',
      component: InformationForm,
      fieldActive: ['description'],
    },
    {
      id: 'REVIEW_LEVEL_USER_FORM',
      title: 'Thông tin mức duyệt',
      component: ReviewLevelUserForm,
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

export default InternalTransferTypeAdd;
