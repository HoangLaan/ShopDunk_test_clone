import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import ICON_COMMON from 'utils/icons.common';
import {showToast} from 'utils/helpers';
import BudgetTransferInfo from './components/Sections/BudgetTransferInfo';
import {createTransferBudgetPlan} from "../../services/budget-plan.service";
import {useParams} from 'react-router';

function BudgetPlanTransfer() {
  const methods = useForm();
  const {id} = useParams()

  const {reset, handleSubmit} = methods;
  const [loading, setLoading] = useState(false);

  const initData = async () => {
    try {
      setLoading(true);
      reset({
        budget_plan_id: id,
        budget_transfer_list: []
      })
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
      console.log(dataSubmit)
      setLoading(true);
      await createTransferBudgetPlan(dataSubmit);
      showToast.success('Chuyển ngân sách thành công');
      await initData();
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin kế hoạch ngân sách',
      component: BudgetTransferInfo,
      fieldActive: [],
    }
  ];

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      submit: true,
      content: 'Hoàn tất chuyển đổi',
      onClick: () => {
        handleSubmit(onSubmit);
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        noSideBar={true}
        loading={loading}
        detailForm={detailForm}
        onSubmit={onSubmit}
        actions={actions}
      />
    </FormProvider>
  );
}

export default BudgetPlanTransfer;
