import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { notification } from 'antd';
// Service
import { getList, deleteStore, deleteStoreList } from 'services/store.service';
// Components
import Filter from 'pages/Store/components/Filter';
import StoreTable from 'pages/Store/components/StoreTable';
import BWModal from 'components/shared/BWModal';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { trim, values } from 'lodash';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function StorePage() {
  const [loadingData, setLoadingData] = useState(false);
  const [dataStore, setDataStore] = useState(defaultPaging);
  const [query, setQuery] = useState(defaultParams);

  const [openModal, setOpenModal] = useState(false);
  const [itemDel, setItemDel] = useState([]);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const { items, itemsPerPage, page, totalItems, totalPages } = dataStore;

  const getData = useCallback(() => {
    setLoadingData(true);
    getList(query)
      .then((data) => {
        setDataStore(data);
      })
      .catch((e) => {
        notification.error({ message: window._$g._(e.message) });
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [query]);

  useEffect(getData, [getData]);

  const handleActionRow = (item, type) => {
    let routes = {
      detail: '/store/detail/',
      delete: '/store/delete/',
      edit: '/store/edit/',
      add: '/store/add',
    };
    const route = routes[type];
    if (type.match(/detail|edit/i)) {
      window._$g.rdr(`${route}${item.store_id}`);
    } else {
      setOpenModal(true);
      setItemDel([item]);
    }
  };

  const handleDelete = async (itemDel) => {
    await deleteStoreList(itemDel?.map((o) => o?.store_id));
    setItemDel([]);
    onCloseModal();
    getData();
  };

  const handleSubmitFilter = (values) => {
    values.search = trim(values.search.replace(/\s+/g, ' '));
    let _query = { ...query, ...values, page: 1 };
    setQuery(_query);
  };

  const handleChangePage = (newPage) => {
    let _query = { ...query, page: newPage };
    setQuery(_query);
  };

  const handleBulkAction = async (items, action) => {
    if (action == 'delete') {
      setOpenModal(true);
      setItemDel(items);
    }
  };

  const headerModal = (
    <>
      <span className='bw_icon_notice'>
        <i className='fi fi-rr-bell'></i>
      </span>{' '}
      Thông báo
    </>
  );
  return (
    <>
      <div className='bw_main_wrapp'>
        <Filter onChange={handleSubmitFilter} />
        <StoreTable
          loading={loadingData}
          onChangePage={handleChangePage}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleActionRow={handleActionRow}
          handleBulkAction={handleBulkAction}
        />
      </div>
      {openModal && (
        <BWModal
          onClose={onCloseModal}
          open={openModal}
          header={headerModal}
          footer='Tôi muốn xóa'
          onConfirm={() => handleDelete(itemDel)}>
          <ModalContent>Bạn có thật sự muốn xóa? </ModalContent>
          <ModalContent>Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.</ModalContent>
        </BWModal>
      )}
    </>
  );
}
