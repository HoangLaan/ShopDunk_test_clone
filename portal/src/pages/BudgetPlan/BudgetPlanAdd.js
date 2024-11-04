import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import BudgetPlanInfo from './components/Sections/BudgetPlanInfo';
import FormStatusActive from './components/Sections/FormStatusActive';
import { createBudgetPlan, getOldTotalBudgetPlan, updateBudgetPlan } from './helper/call-api';
import { useLocation, useParams } from 'react-router-dom';
import { getDetail } from 'pages/BudgetPlan/helper/call-api'
import BWAccordion from 'components/shared/BWAccordion/index';
function BudgetPlanAdd() {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { reset, handleSubmit } = methods;
  const [loading, setLoading] = useState(false);
  const [totalBudgetPlan, setTotalBudgetPlan] = useState([]);
  const [dataSubmit, setDataSubmit] = useState(null);

  const { pathname } = useLocation();
  const { id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const loadDetail = useCallback(() => {
    if (id) {
      getDetail(id)
        .then((value) => {
          methods.reset({
            ...value,
          });
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [id]);
  useEffect(loadDetail, [loadDetail]);

  const onSubmit = async (payload) => {
    try {
      if (id) {
        await updateBudgetPlan(id, payload)
        showToast.success('Cập nhật thành công');
      } else {
        await createBudgetPlan(payload);
        showToast.success('Thêm mới thành công');
        methods.reset({
          is_active: 1,
        });
      }
    } catch (error) {
      showToast.error(error.message);
    }
  };

  const detailForm = [
    {
      id: 'budget_plan_info',
      title: 'Thông tin kế hoạch ngân sách',
      component: BudgetPlanInfo,
      fieldActive: ['company_id', 'budget_plan_name', 'budgets', 'budget_plan_date_from', 'budget_plan_date_to'],
    },

    {
      title: 'Trạng thái',
      component: FormStatusActive,
      fieldActive: ['is_active'],
    },
  ];

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      submit: true,
      content: id ? 'Hoàn tất sao chép' : 'Hoàn tất thêm mới',
      onClick: () => {
        handleSubmit(onSubmit)
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
      // actions={actions}
      />
    </FormProvider>
  );
}

export default BudgetPlanAdd;
