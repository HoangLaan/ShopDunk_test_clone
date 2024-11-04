import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { getListDepartment, getListPosition } from 'services/customer-care-type.service';
import ModalPortal from 'components/shared/ModalPortal/ModalPortal';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import TaskTypeService from 'services/task-type.service';
import { DEFAULT_PAGINATION, MEDIUM_LIST_PARAMS } from 'utils/constants';

function ModalUserCare({ onClose, onApply, defaultDataSelect }) {
  const [params, setParams] = useState(MEDIUM_LIST_PARAMS);
  const [dataList, setDataList] = useState(DEFAULT_PAGINATION);
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
    TaskTypeService.getListUser(params)
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
        header: 'Họ và tên',
        accessor: 'full_name',
      },
      {
        header: 'Chức vụ',
        accessor: 'position_name',
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
      },
    ],
    [],
  );

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '50rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  return (
    <ModalPortal
      title='Chọn người nhận thông tin CSKH'
      styleModal={styleModal}
      style={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
      width={800}
      onClose={onClose}
      onConfirm={() => {
        onApply(selectReceiver);
        onClose();
      }}>
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
              component: <FormInput field='keyword' placeholder='Nhập tên nhân viên' />,
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
        fieldCheck='user_name'
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
    </ModalPortal>
  );
}

export default ModalUserCare;
