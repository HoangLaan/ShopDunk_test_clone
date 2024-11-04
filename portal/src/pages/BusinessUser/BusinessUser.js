import React, { useEffect, useState } from 'react';
import BusinessUserFilter from './BusinessUserFilter';
import { getErrorMessage } from '../../utils/index';
import TableBusUser from './TableBusUser';
import ModalDelete from './ModalDelete';
import { deleteBusinessUser, getListBusinessUser } from '../../services/business-user.service';
import ModalAddBusUser from './ModalAddBusUser';

function BusinessUser(props) {
  const [openModal, setOpenModal] = useState(false);
  const [showAddBusUser, setShowAddBusUser] = useState(false);

  const [dataBusUser, setDataBusUser] = useState({
    items: [],
    itemsPerPage: 25,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [query, setQuery] = useState({
    search: '',
    company_id: null,
    department_id: null,
    position_id: null,
    gender: null,
    page: 1,
    itemsPerPage: 25,
  });

  const [itemDel, setItemDel] = useState([]);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataBusUser;

  useEffect(() => {
    _getBusiessUser();
  }, []);

  const _getBusiessUser = async (_query) => {
    try {
      let data = await getListBusinessUser(_query);
      setDataBusUser(data);
    } catch (error) {}
  };

  const handleSubmitFilter = (params) => {
    let _query = { ...query, ...params, page: 1 };
    _getBusiessUser(_query);
    setQuery(_query);
  };

  const handleChangePage = (newPage, sizePage) => {
    let _query = { ...query, page: newPage };
    _getBusiessUser(_query);
    setQuery(_query);
  };

  const handleBulkAction = async (items, action) => {
    if (action === 'delete') {
      setOpenModal(true);
      setItemDel(items);
    }
  };

  const handleActionRow = (item, type) => {
    if (type === 'add') {
      setShowAddBusUser(true);
    } else {
      setOpenModal(true);
      setItemDel([item]);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBusinessUser(itemDel);
      setItemDel([]);
      setOpenModal(false);
      let _query = { ...query, page: 1 };
      _getBusiessUser(_query);
      setQuery(_query);
    } catch (error) {}
  };

  const _handleCloseModal = () => {
    setOpenModal(false);
    setItemDel([]);
  };

  const handleCloseModalAdd = (isReload = false) => {
    setShowAddBusUser(false);
    if (isReload) {
      _getBusiessUser(query)
    }
  };

  return (
    <div className='bw_main_wrapp'>
      <BusinessUserFilter onChange={handleSubmitFilter} />
      <TableBusUser
        onChangePage={handleChangePage}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        handleActionRow={handleActionRow}
        handleBulkAction={handleBulkAction}
      />
      {openModal && <ModalDelete onCloseModal={_handleCloseModal} handleDelete={handleDelete} />}
      {showAddBusUser && <ModalAddBusUser handleCloseModal={handleCloseModalAdd} />}
    </div>
  );
}

export default BusinessUser;
