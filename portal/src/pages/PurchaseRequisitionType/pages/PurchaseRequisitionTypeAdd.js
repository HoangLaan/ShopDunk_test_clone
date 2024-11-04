import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
import usePageInformation from 'hooks/usePageInformation';
import { STATUS_TYPES } from 'utils/constants';

import purchaseRequisitionTypeService from 'services/purchaseRequisitionType.service';
import PageProvider from '../components/PageProvider/PageProvider';
import InformationForm from '../components/Forms/InformationForm';
import ReviewLevelUserForm from '../components/Forms/ReviewLevelUserForm';
import AccountingForm from '../components/Forms/AccountingForm';
import { defaultValues } from '../utils/constants';

function PurchaseRequisitionTypeAdd() {
  const methods = useForm({
    defaultValues,
  });
  const [loading, setLoading] = useState(false);

  const { disabled, id: purchaseRequisitionTypeId } = usePageInformation();

  const initData = async () => {
    try {
      setLoading(true);
      if (purchaseRequisitionTypeId) {
        const data = await purchaseRequisitionTypeService.getById(purchaseRequisitionTypeId);
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
      payload.purchase_requisition_type_id = purchaseRequisitionTypeId;
      setLoading(true);
      if (purchaseRequisitionTypeId) {
        await purchaseRequisitionTypeService.update(payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await purchaseRequisitionTypeService.create(payload);
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
      id: 'INFORMATION_FORM',
      title: 'Thông tin loại yêu cầu mua hàng',
      component: InformationForm,
      fieldActive: ['description'],
    },
    {
      id: 'REVIEW_LEVEL_USER_FORM',
      title: 'Thông tin mức duyệt',
      component: ReviewLevelUserForm,
    },
    {
      id: 'ACCOUNTING_FORM',
      title: 'Thông tin hạch toán',
      component: AccountingForm,
    },
    {
      id: 'STATUS_FORM',
      title: 'Trạng thái',
      component: FormStatus,
      hiddenSystem: true,
      fieldActive: ['is_active'],
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

export default PurchaseRequisitionTypeAdd;
