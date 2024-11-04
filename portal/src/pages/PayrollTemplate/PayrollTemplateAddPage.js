import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import PayrollTemplateInformation from './components/add/PayrollTemplateInformation';
import {
  createPayrollTemplate,
  getPayrollTemplateDetail,
  updatePayrollTemplate,
} from 'services/payroll-template.service';
import SalaryElementTable from './components/add/SalaryElementTable';
import { showToast } from 'utils/helpers';

const PayrollTemplateAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);
  const clearInput = useCallback((value = '') => value?.trim(), []);

  const onSubmit = async (payload) => {
    const label = id ? 'Chỉnh sửa' : 'Thêm mới';
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.template_name = clearInput(payload.template_name);
      payload.description = clearInput(payload.description);
      payload.elements = payload.salary_element.map((item) => ({
        is_show: item.is_show ?? 0,
        element_id: item.element_id,
        display_name: clearInput(item.display_name),
      }));
      delete payload.salary_element;

      await (id ? updatePayrollTemplate(payload) : createPayrollTemplate(payload));

      if (!id) {
        methods.reset({
          is_active: 1,
        });
      }

      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? `${label} thất bại`);
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(() => {
    if (id) {
      setLoading(true);
      getPayrollTemplateDetail(id)
        .then((value) => {
          methods.reset(value);
        })
        .catch((error) => {
          showToast.error(error?.message ?? 'Có lỗi xảy ra');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [id]);

  useEffect(loadData, [loadData]);

  const detailForm = [
    {
      title: 'Thông tin mẫu bảng lương',
      isRequired: true,
      id: 'information',
      component: PayrollTemplateInformation,
      fieldActive: ['template_name'],
    },
    {
      title: 'Thành phần bảng lương',
      isRequired: true,
      id: 'information',
      component: SalaryElementTable,
      fieldActive: ['salary_element[0]'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus, fieldActive: ['is_active'] },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default PayrollTemplateAddPage;
