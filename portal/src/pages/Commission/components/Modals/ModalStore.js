import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import _ from 'lodash';

import { getList } from 'services/store.service';
import { getOptionsArea } from 'services/area.service';
import { mapDataOptions4Select } from 'utils/helpers';

import WrapperModal from 'pages/Commission/helpers/WrapperModal';
import { useCommissionContext } from 'pages/Commission/helpers/context';
import { toastError } from 'pages/Commission/helpers/utils';
import { useModalSelect } from 'pages/Commission/helpers/hooks';
import ModalStoreFilter from './ModalStoreFilter';
import TableSelect from '../TableSelect/TableSelect';

const selectId = 'store_id';

const columns = [
  {
    title: 'Mã cửa hàng',
    key: 'store_code',
  },
  {
    title: 'Tên cửa hàng',
    key: 'store_name',
  },
  {
    title: 'Địa chỉ',
    key: 'address',
  },
];

function ModalStore({ onConfirm }) {
  const { isOpenModalStore, setIsOpenModalStore } = useCommissionContext();
  const { getValues } = useFormContext();

  const initValues = getValues('stores');
  const businessApplyValue = getValues('business_apply');
  const company_id = getValues('company_id');
  const [itemSelected, setItemSelected] = useState(_.keyBy(initValues, selectId));
  const [data, setData] = useState({
    query: {
      page: 1,
      itemsPerPage: 5,
      search: '',
      business_ids: businessApplyValue?.length ? businessApplyValue.map((e) => e.id).join(',') : '',
      company_id : company_id
    },
    dataItems: {},
  });
  const { items = [], itemsPerPage = 5, totalItems = 0, totalPages = 0 } = data?.dataItems;

  const [optionsArea, setOptionsArea] = useState([]);

  useEffect(() => {
    getData({ page: 1, itemsPerPage: 5, search: '', business_ids: data.query.business_ids });

    const getDataOptions = async () => {
      let _area = await getOptionsArea();
      setOptionsArea(mapDataOptions4Select(_area));
    };
    getDataOptions();
  }, [isOpenModalStore, data.query.business_apply]);

  const getData = async (query) => {
    try {
      const res = await getList(query);
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

  return (
    <WrapperModal
      id='bw_modal_commission_store'
      isOpen={isOpenModalStore}
      title='Chọn cửa hàng'
      onClose={() => setIsOpenModalStore(false)}
      onConfirm={() => onConfirm(itemSelected)}>
      <ModalStoreFilter onChange={onChangeFilter} optionsArea={optionsArea} />
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

export default ModalStore;
