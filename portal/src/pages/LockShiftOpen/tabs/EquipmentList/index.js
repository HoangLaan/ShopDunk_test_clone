import React, {useCallback, useEffect} from 'react';
import {useFormContext} from "react-hook-form";
import {getListEquipment} from "services/lockshift-open.service";
import FormSection from "components/shared/FormSection";
import LockShiftEquipment from "./section/LockShiftEquipment";

const Equipment = ({disabled, lockShiftId, onSubmit}) => {
  const methods = useFormContext();
  const {setValue, watch} = methods
  const loadInfoEquipment = useCallback(async () => {
    const dataEquipment = await getListEquipment({lockShiftId});
    setValue("list_shift_equipment", dataEquipment)
  }, []);

  useEffect(() => {
    loadInfoEquipment()
  }, [loadInfoEquipment]);

  const detailForm = [
    {
      title: 'Danh sách thiết bi tiêu hao',
      component: LockShiftEquipment,
      fieldActive: [],
      disabled: disabled,
    }
  ];


  return <FormSection detailForm={detailForm} onSubmit={onSubmit} noSideBar={true} disabled={disabled}/>;
};

export default Equipment;
