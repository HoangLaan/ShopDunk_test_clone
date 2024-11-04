import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import FormStatus from 'components/shared/FormCommon/FormStatus';
import FormSection from 'components/shared/FormSection';
import HrSalaryInformation from './components/add/HrSalaryInformation';
import { createHrSalary, getDetaiHrSalary, updateHrSalary } from '../../services/hr-salary.service';

const HrSalaryAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const reset = methods.reset;
  const { pathname } = useLocation();
  const { hr_salary_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/view'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (hr_salary_id) {
        await updateHrSalary({ ...payload, hr_salary_id });
        label = 'Chỉnh sửa';
      } else {
        await createHrSalary(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (error) {
      showToast.error(error.message || 'Có lỗi xảy ra!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  const loadDetailHrSalary = useCallback(() => {
    if (hr_salary_id) {
      getDetaiHrSalary(hr_salary_id).then((value) => {
        reset({
          ...value,
        });
      });
    } else {
      reset({
        is_active: 1,
      });
    }
  }, [hr_salary_id, reset]);

  useEffect(loadDetailHrSalary, [loadDetailHrSalary]);

  const detailForm = [
    {
      title: 'Thông tin mức lương',
      id: 'information',
      component: HrSalaryInformation,
      fieldActive: ['hr_salary_name', 'hr_salary_from', 'hr_salary_to'],
    },
    { id: 'form_status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default HrSalaryAddPage;
