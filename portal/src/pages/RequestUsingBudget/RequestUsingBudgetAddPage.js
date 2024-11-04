import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import RequestUsingBudgetInformation from './components/add/RequestUsingBudgetInformation';
import {
  createRequestUsingBudget,
  getCodeRequestUsingBudget,
  getDetailRequestUsingBudget,
  updateRequestUsingBudget,
} from 'services/request-using-budget.service';
import BudgetGoalTable from './components/add/BudgetGoalTable';
import BrowsingInformation from './components/add/BrowsingInformation';
import { useAuth } from 'context/AuthProvider';
import moment from 'moment';
import dayjs from 'dayjs';
import FormStatus from 'components/shared/FormCommon/FormStatus';
const RequestUsingBudgetAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { user } = useAuth();

  const { pathname } = useLocation();
  const { request_using_budget_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isReview = useMemo(() => pathname.includes('/review'), [pathname]);
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const isCopy = useMemo(() => pathname.includes('/copy'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      let value = {
        ...payload,
        is_active: payload.is_active ? 1 : 0,
      };
      //
      let label;
      if (request_using_budget_id && !isCopy) {
        await updateRequestUsingBudget(request_using_budget_id, value);
        label = 'Chỉnh sửa';
      } else {
        await createRequestUsingBudget(value);
        if (isCopy) {
          label = 'Sao chép';
        } else label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const loadRequestUsingBudget = useCallback(() => {
    if (request_using_budget_id) {
      getDetailRequestUsingBudget(request_using_budget_id).then((value) => {
        if (isCopy) {
          getCodeRequestUsingBudget().then((res) => {
            methods.reset({
              ...value,
              create_date: dayjs(moment(new Date(value.create_date)).format('DD/MM/YYYY'), 'DD/MM/YYYY'),
              request_using_budget_code: res,
            });
          });
        } else {
          methods.reset({
            ...value,
            create_date: dayjs(moment(new Date(value.create_date)).format('DD/MM/YYYY'), 'DD/MM/YYYY'),
          });
        }
      });
    } else {
      getCodeRequestUsingBudget().then((value) => {
        methods.reset({
          request_using_budget_code: value,
          department_id: user.department_id,
          user_request: user.user_name,
          company_id: user.company_id,
          create_date: dayjs(moment(new Date()).format('DD/MM/YYYY'), 'DD/MM/YYYY'),
          is_active: 1,
          is_review: null,
          total_request_budget: 0,
        });
      });
    }
  }, [request_using_budget_id]);

  useEffect(loadRequestUsingBudget, [loadRequestUsingBudget]);

  const detailForm = [
    {
      title: 'Thông tin đề nghị ',
      id: 'information',
      isReview: isReview,
      component: RequestUsingBudgetInformation,
      fieldActive: ['suggest_using_budget_code', 'budget_type_id'],
    },
    {
      title: 'Mục tiêu sử dụng ngân sách',
      id: 'budget_goal',
      isAdd: isAdd,
      isReview: isReview,
      component: BudgetGoalTable,
      fieldActive: ['list_budget_goal'],
    },
    {
      title: 'Thông tin duyệt',
      id: 'list_user',
      isReview: isReview,
      component: BrowsingInformation,
      fieldActive: ['list_user'],
    },

    { id: 'status', title: 'Trạng thái', hiddenSystem: true, component: FormStatus },
  ];
  const actions = [
    {
      icon: 'fa fa-files-o',
      color: 'blue',
      content: 'Sao chép',
      permission: 'FI_RQ_USINGBUDGET_COPY',
      submit: true,
    },
  ];
  return (
    <FormProvider {...methods}>
      <FormSection actions={isCopy ? actions : null} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default RequestUsingBudgetAddPage;
