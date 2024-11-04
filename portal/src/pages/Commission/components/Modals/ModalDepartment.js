import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import _ from 'lodash';

import { getListDepartment } from 'services/department.service';
import { getOptionsCompany } from 'services/company.service';
import { mapDataOptions4Select } from 'utils/helpers';

import WrapperModal from 'pages/Commission/helpers/WrapperModal';
import { useCommissionContext } from 'pages/Commission/helpers/context';
import { toastError } from 'pages/Commission/helpers/utils';
import { useModalSelect } from 'pages/Commission/helpers/hooks';
import ModalDepartmentFilter from './ModalDepartmentFilter';
import TableSelect from '../TableSelect/TableSelect';

const selectId = 'department_id';

const columns = [
  {
    title: 'Phòng ban',
    key: 'department_name',
  },
  {
    title: 'Thuộc phòng ban',
    key: 'parent_name',
  },
  {
    title: 'Công ty áp dụng',
    key: 'company_name',
  },
];

function ModalDepartment({ onConfirm }) {
  const { isOpenModalDepartment, setIsOpenModalDepartment } = useCommissionContext();
  const { getValues } = useFormContext();
  const initValues = getValues('departments');

  const [itemSelected, setItemSelected] = useState(_.keyBy(initValues, selectId));

  const company = getValues('company_id');
  const [data, setData] = useState({
    query: {
      page: 1,
      itemsPerPage: 5,
      search: '',
      company_id: company,
      is_active: 1,
    },
    dataItems: {},
  });
  const { items = [], itemsPerPage = 5, totalItems = 0, totalPages = 0 } = data?.dataItems;
  const [optionsCompany, setOptionsCompany] = useState([]);

  useEffect(() => {
    getData({ ...data.query, page: 1 });

    const getDataOptions = async () => {
      let _area = await getOptionsCompany();
      setOptionsCompany(mapDataOptions4Select(_area));
    };
    getDataOptions();
  }, [isOpenModalDepartment, data.query]);

  const getData = async (query) => {
    try {
      const res = await getListDepartment(query);
      setData((t) => ({ ...t, dataItems: res }));
    } catch (error) {
      toastError(error.message);
    }
  };

  const { handleChangePage, isCheckAll, handleCheckAll, handleSelectedItem, onChangeFilter } = useModalSelect({
    data,
    setData,
    getData,
    items,
    itemSelected,
    selectId,
    setItemSelected,
  });

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
    <WrapperModal
      // common wrapper modal
      id='bw_modal_commission_department'
      isOpen={isOpenModalDepartment}
      styleModal={styleModal}
      headerStyles={headerStyles}
      titleModal={titleModal}
      closeModal={closeModal}
      title='Chọn phòng ban'
      onClose={() => setIsOpenModalDepartment(false)}
      onConfirm={() => onConfirm(itemSelected)}>
      <ModalDepartmentFilter onChange={onChangeFilter} optionsCompany={optionsCompany} />
      <TableSelect
        isCheckAll={isCheckAll}
        handleCheckAll={handleCheckAll}
        items={items}
        initValues={initValues}
        selectId={selectId}
        handleSelectedItem={handleSelectedItem}
        itemSelected={itemSelected}
        itemsPerPage={itemsPerPage}
        data={data}
        totalPages={totalPages}
        totalItems={totalItems}
        handleChangePage={handleChangePage}
        columns={columns}
      />
    </WrapperModal>
  );
}

export default ModalDepartment;
