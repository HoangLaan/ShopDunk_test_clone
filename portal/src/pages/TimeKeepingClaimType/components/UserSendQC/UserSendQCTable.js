import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import UserModal from './UserModal';

const UserSendQCTable = ({disabled}) => {
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const {watch, setValue, reset, getValues} = useFormContext();
  const users_qc = useMemo(() => watch('users_qc'), [watch('users_qc')])
  
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Nhân viên',
        classNameHeader: 'full_name',
        formatter: (d) => `${d.user_name} - ${d.full_name}`,
      },
      {
        header: 'Chức vụ',
        accessor: 'position_name',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        disabled,
        content: 'Chọn nhân viên',
        permission: 'HR_TIMEKEEPINGCLAIMTYPE_QC_ADD',
        onClick: () => setIsOpenUserModal(true),
      },
      {
        icon: 'fi fi-rr-trash',
        permission: 'HR_TIMEKEEPINGCLAIMTYPE_QC_DEL',
        color: 'red',
        onClick: (p, index) => {
          reset({
            ...getValues(),
            users_qc: users_qc.filter((_, i) => i !== index)
          })
        }
      },
    ];
  }, [disabled]);

  return (
    <>
      <DataTable
        noPaging
        noSelect
        columns={columns}
        data={users_qc}
        actions={actions}
      />
    
     
    {isOpenUserModal &&  (
        <UserModal
          open={isOpenUserModal}
          onClose={() => {
            setIsOpenUserModal(false);
          }}
          onApply={(d) => setValue('users_qc', d)}
        />
      )}
    </>
  );
};

export default UserSendQCTable;
