import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import DepartmentInformation from 'pages/Department/components/add/DepartmentInformation';
import DepartmentStatus from 'pages/Department/components/add/DepartmentStatus';
import { createDepartment, getDetailDepartment, updateDepartment } from 'services/department.service';
import DepartmentPriorities from 'pages/Department/components/add/DepartmentPriorities';
const DepartmentAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { department_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/view'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;

      //payload.functions = payload.functions_list.map((_) => _.value);
      let label;
      if (department_id) {
        console.log(payload);
        payload.priorities = payload?.priorities.map((o, u) => {
          return {
            department_id: o?.department_id,
            priority: u + 1,
          };
        });
        await updateDepartment(department_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createDepartment(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      console.log(error);
      showToast.error(error?.message);
    }
  };
  const detailForm = [
    {
      title: 'Thông tin phòng ban',
      id: 'information',
      fieldActive: ['department_name', 'company_id'],
      component: DepartmentInformation,
    },
    {
      title: 'Trạng thái',
      id: 'information',
      component: DepartmentStatus,
    },
    {
      title: 'Thứ tự ưu tiên',
      id: 'priorities',
      hidden: !department_id || disabled,
      component: DepartmentPriorities,
    },
  ];

  const loadDeparmentId = useCallback(() => {
    if (department_id) {
      getDetailDepartment(department_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [department_id]);
  useEffect(loadDeparmentId, [loadDeparmentId]);

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};
export default DepartmentAddPage;
