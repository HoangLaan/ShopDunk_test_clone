import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import EquipmentGroupInformation from './components/add/EquipmentGroupInformation';
import { createEquipmentGroup, getDetailEquipmentGroup, updateEquipmentGroup } from 'services/equipment-group.service';
import FormStatus from 'components/shared/FormCommon/FormStatus';
const EquipmentGroupAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { equipment_group_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      let label;

      if (equipment_group_id) {
        await updateEquipmentGroup(equipment_group_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createEquipmentGroup(payload);
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

  const loadEquipmentGroup = useCallback(() => {
    if (equipment_group_id) {
      getDetailEquipmentGroup(equipment_group_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [methods, equipment_group_id]);

  useEffect(loadEquipmentGroup, [loadEquipmentGroup]);

  const detailForm = [
    {
      title: 'Thông tin thêm nhóm thiết bị',
      id: 'information',
      component: EquipmentGroupInformation,
      fieldActive: ['equipment_group_name', 'equipment_group_code'],
      equipmentGroupId: equipment_group_id,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={methods.handleSubmit(onSubmit)} />
    </FormProvider>
  );
};

export default EquipmentGroupAddPage;
