import DataTable from 'components/shared/DataTable/index';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BWButton from 'components/shared/BWButton/index';
import { getListUser } from 'services/time-keeping-claim-type.service';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';

function UserModal({ open, onClose, onApply }) {
  const methods= useForm();
  const {watch} = methods;
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
    // department_ids: watch('department_id')?.map(item => item.id ?? item.value ?? item)?.join(","),
  });
  const [listUser, setListUser] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [reviewLevelSelected, setUserSelected] = useState([]);

  const loadListUser = useCallback(() => {
    getListUser(params)
      .then(setListUser)
  }, [params]);

  const { items, itemsPerPage, page, totalItems, totalPages } = listUser;

  useEffect(() => {
    loadListUser();
  }, [loadListUser]);

  const onSubmit = useCallback((value) => setParams(prev => ({
    ...prev,
    ...value, 
    page: 1
  })), []) 

  const columns = useMemo(
    () => [
      {
        header: 'Nhân viên',
        classNameHeader: 'bw_text_center',
        formatter: (d) => `${d.user_name} - ${d.full_name}` 
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Chức vụ',
        accessor: 'position_name',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  return (
    <Modal
      witdh={'40%'}
      open={open}
      onClose={onClose}
      header='Chọn nhân viên'
      footer={
        <BWButton
          type='success'
          outline
          content={'Cập nhật'}
          onClick={() => {
            onApply(reviewLevelSelected);
            onClose();
          }}
        />
      }>
        <FormProvider {...methods}>
            <FilterSearchBar
            title='Tìm kiếm'
            onSubmit={onSubmit}
            onClear={() => setParams(prev => ({
              ...prev, 
              search: undefined
            }))
            }
            actions={[
              {
                title: 'Từ khóa',
                component: <FormInput 
                placeholder='Nhập tên nhân viên, mã nhân viên' 
                field='search' 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    methods.handleSubmit(onSubmit)();
                  }
                }}
                />,
              },
            ]}
            colSize={6}
          />
          <DataTable
            title='Danh sách nhân viên'
            hiddenDeleteClick
            defaultDataSelect={watch('users_qc')}
            fieldCheck={'user_name'}
            columns={columns}
            data={items}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            page={page}
            totalItems={totalItems}
            onChangeSelect={(d) => {
              setUserSelected(d);
            }}
            onChangePage={(page) => {
              setParams({
                ...params,
                page,
              });
            }}
          />
        </FormProvider>
    </Modal>
  );
}

export default UserModal;
