import DataTable from 'components/shared/DataTable/index';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import Modal from 'components/shared/Modal/index';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getListDepartment, getListPosition, getListUser } from 'services/customer-care-type.service';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import BWButton from 'components/shared/BWButton/index';
function ModalStaff({ open, onClose, onApply, defaultDataSelect }) {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [departments, setDepartments] = useState([]);
  const [selectReceiver, setSelectReceiver] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  const loadDepartment = useCallback(() => {
    getListDepartment().then((res) => setDepartments(mapDataOptions4SelectCustom(res, 'id', 'name')));
  }, []);

  const loadPosition = useCallback(() => {
    getListPosition().then((res) => setPositions(mapDataOptions4SelectCustom(res, 'id', 'name')));
  }, []);

  const loadUser = useCallback(() => {
    setLoading(true);
    getListUser(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(() => {
    loadUser();
    loadDepartment();
    loadPosition();
  }, [loadDepartment, loadPosition, loadUser]);
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        accessor: '',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Họ và tên',
        accessor: 'full_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Chức vụ',
        accessor: 'position_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
    ],
    [],
  );
  return (
    <Modal
      witdh={'60%'}
      open={open}
      onClose={onClose}
      header='Danh sách nhân viên'
      footer={
        <BWButton
          type='primary'
          outline
          content={'Áp dụng'}
          onClick={() => {
            onApply(selectReceiver);
            onClose();
          }}
        />
      }>
      <div className='bw_main_wrapp'>
        <FormProvider {...methods}>
          <FilterSearchBar
            title='Tìm kiếm'
            onSubmit={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                };
              });
            }}
            onClear={() => setParams({ is_active: 1, page: 1, itemsPerPage: 25 })}
            actions={[
              {
                title: 'Từ khóa',
                component: <FormInput field='keyword' />,
              },
              {
                title: 'Vị trí',
                component: <FormSelect field={'position_id'} list={positions}></FormSelect>,
              },
              {
                title: 'Phòng ban',
                component: <FormSelect field={'department_id'} list={departments}></FormSelect>,
              },
              {
                title: 'Ngày tạo',
                component: (
                  <FormDateRange
                    allowClear={true}
                    fieldStart={'created_date_from'}
                    fieldEnd={'created_date_to'}
                    placeholder={['Từ ngày', 'Đến ngày']}
                    format={'DD/MM/YYYY'}
                  />
                ),
              },
              {
                title: 'Trạng thái',
                component: <FormSelect field='is_active' list={statusTypesOption} />,
              },
            ]}
          />
        </FormProvider>
        <DataTable
          hiddenDeleteClick
          defaultDataSelect={defaultDataSelect}
          loading={loading}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangeSelect={(data) => setSelectReceiver(data)}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
        />
      </div>
    </Modal>
  );
}

export default ModalStaff;
