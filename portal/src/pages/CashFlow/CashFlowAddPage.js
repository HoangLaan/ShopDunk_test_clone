import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { createCashFlow, getCashFlowDetail, updateCashFlow } from 'services/cash-flow.service';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import CashFlowInformation from './components/add/CashFlowInformation';
import { parseStringToArray, parseArrayToString } from './helper';
import { showToast } from 'utils/helpers';

const CashFlowAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      cash_flow_type: 1,
    },
  });
  const { pathname } = useLocation();
  const { cash_flow_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isCopy = useMemo(() => pathname.includes('/add'), [pathname]) && cash_flow_id;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.parent_id = payload.parent_id?.value ? payload.parent_id.value : payload.parent_id;

      let label;
      payload.implicit_account_id = parseArrayToString(payload.implicit_account_id, 'id', ',');
      if (cash_flow_id && !isCopy) {
        await updateCashFlow(payload);
        label = 'Chỉnh sửa';
      } else {
        await createCashFlow(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
          cash_flow_type: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(() => {
    if (cash_flow_id) {
      setLoading(true);
      getCashFlowDetail(cash_flow_id)
        .then((value) => {
          let implicit_account_id = parseStringToArray(value.implicit_account_id, ',', { id: '', value: '' });
          methods.reset({
            ...value,
            company_id: value?.company_id,
            implicit_account_id: implicit_account_id,
            cash_flow_code: isCopy ? null : String(value?.cash_flow_code),
            cash_flow_id: isCopy ? null : String(value?.cash_flow_id),
            parent_id: value?.parent_id <= 0 ? null : { value: value?.parent_id, label: value?.parent_name },
          });
        })
        .catch((error) => {
          showToast.error(error?.message ?? 'Có lỗi xảy ra', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
        cash_flow_type: 1,
      });
    }
  }, [cash_flow_id, isCopy, methods]);

  useEffect(loadData, [loadData]);

  const detailForm = [
    {
      title: 'Thông tin dòng tiền',
      id: 'information',
      component: CashFlowInformation,
      fieldActive: ['company_id', 'cash_flow_code', 'cash_flow_name'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default CashFlowAddPage;
