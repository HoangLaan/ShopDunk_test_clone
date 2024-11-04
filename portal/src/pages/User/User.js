import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';

// service
import { getList, deleteUser, exportExcel } from 'services/users.service';

// components
import Filter from './components/Filter';
import Table from './components/Table';
import BWModal from 'components/shared/BWModal/index';
import Password from './components/Password';
import { createDownloadFile, showToast } from 'utils/helpers';
import moment from 'moment';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function User() {
  const [dataUser, setDataUser] = useState({
    items: [],
    itemsPerPage: 25,
    page: 0,
    // status: 1,
    totalItems: 0,
    totalPages: 0,
  });

  const [openModal, setOpenModal] = useState(null);
  const [user, setUser] = useState([]);
  const onCloseModal = () => {
    setOpenModal(null);
  };

  const [query, setQuery] = useState({
    search: '',
    //Comment -> filter default value null
    // is_active: 1,
    user_status: 1,
    // gender: 2,
    // is_time_keeping: 2,
    // hr_profile: 2,
    page: 1,
    itemsPerPage: 25,
  });
  const ref = useRef();

  const { items, itemsPerPage, page, totalItems, totalPages } = dataUser;

  const getData = useCallback(() => {
    try {
      getList(query).then((data) => {
        setDataUser(data);
      });
    } catch (error) {
      window._$g.dialogs.alert(window._$g._(error.message));
    }
  }, [query]);

  useEffect(getData, [getData]);

  const handleActionRow = (item, type) => {
    let routes = {
      detail: '/users/detail/',
      edit: '/users/edit/',
      add: '/users/add',
    };
    const route = routes[type];
    if (type.match(/detail|edit/i)) {
      window._$g.rdr(`${route}${item.user_id}`);
    } else {
      setOpenModal(type == 'delete' ? 'delete' : 'changepwd');
      setUser([item]);
    }
  };

  const handleDelete = async (user) => {
    await deleteUser(user);
    setUser([]);
    onCloseModal();
    getData();
  };

  const handleSubmitFilter = (values) => {
    let _query = { ...query, ...values, page: 1 };
    setQuery(_query);
    ref.current = _query;
  };

  const handleChangePage = (newPage) => {
    let _query = { ...query, page: newPage };
    setQuery(_query);
  };

  const handleBulkAction = async (items, action) => {
    if (action == 'delete') {
      setOpenModal('delete');
      setUser(items);
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

  const handleExportExcel = () => {
    exportExcel(ref.current)
      .then((res) => createDownloadFile(res?.data, `Danh_sach_nhan_vien_${moment().format('DD/MM/YYYY')}.xlsx`))
      .catch((error) => {
        showToast.error('Không có dữ liệu để xuất file excel.');
      });
  };

  return (
    <>
      <div className='bw_main_wrapp'>
        <Filter onChange={handleSubmitFilter} />
        <Table
          onChangePage={handleChangePage}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleActionRow={handleActionRow}
          handleBulkAction={handleBulkAction}
          onRefresh={() => {
            getData(query);
          }}
          handleExportExcel={handleExportExcel}
        />
      </div>
      {openModal == 'delete' && (
        <BWModal
          onClose={onCloseModal}
          open={openModal}
          header={headerModal}
          footer='Tôi muốn xóa'
          onConfirm={() => handleDelete(user)}>
          <ModalContent>Bạn có thật sự muốn xóa? </ModalContent>
          <ModalContent>Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.</ModalContent>
        </BWModal>
      )}
      {openModal == 'changepwd' && <Password onClose={onCloseModal} user={user[0]} />}
    </>
  );
}
