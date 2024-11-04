import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import { createFunctionGroup, getDetailFunctionGroup, updateFunctionGroup } from 'services/function-group.service';
import FunctionGroupInformation from './components/add/FunctionGroupInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import PermissionTable from './components/add/PermissionTable';
const FunctionGroupAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { function_group_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.functions = (payload.functions_list ?? [])?.map((_) => _.value);
      let label;
      if (function_group_id) {
        await updateFunctionGroup(function_group_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createFunctionGroup(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const loadFunctionGroup = useCallback(() => {
    if (function_group_id) {
      getDetailFunctionGroup(function_group_id).then((value) => {
        methods.reset({
          ...value,
          functions_list: value.functions_list.map((e) => {
            return {
              ...e,
              label: e?.function_name,
              value: e?.function_id,
            };
          }),
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [function_group_id]);

  useEffect(loadFunctionGroup, [loadFunctionGroup]);

  const detailForm = [
    {
      title: 'Thông tin nhóm quyền',
      id: 'information',
      component: FunctionGroupInformation,
      fieldActive: ['function_group_name', 'order_index'],
    },
    {
      title: 'Quyền',
      id: 'information',
      component: PermissionTable,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default FunctionGroupAddPage;
