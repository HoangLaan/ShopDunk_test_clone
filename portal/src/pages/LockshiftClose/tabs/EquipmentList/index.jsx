import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import LockshiftEquipments from './section/LockshiftEquipment';
import { getListLockShiftEquipments } from 'services/lockshift-close.service';
import { showToast } from 'utils/helpers';

const EquipmentList = ({ disabled, lockshiftId, onSubmit }) => {
  const methods = useFormContext();

  useEffect(() => {
    getListLockShiftEquipments(lockshiftId)
      .then((data) => {
        methods.setValue('equipment_list', data);
      })
      .catch((err) => {
        showToast(err?.message);
      });
  }, []);

  const detailForm = [
    {
      title: 'Danh sách thiết bị tiêu hao',
      id: 'lockshift-equipmentlist',
      component: LockshiftEquipments,
      lockshiftId,
      disabled,
    },
  ];

  return <FormSection detailForm={detailForm} onSubmit={onSubmit} noSideBar disabled={disabled} />;
};

export default EquipmentList;
