import React, { useState, useEffect } from 'react';
import { showToast } from 'utils/helpers';

import BWModalDelete from 'components/shared/BWModal/BWModalDelete';
import StocksTransferTypeFilter from './components/StocksTransferTypeFilter';
import StocksTransferTypeTable from './components/StocksTransferTypeTable';
import { getErrorMessage } from '../../utils/index';
import { delStocksTransferType, getListStocksTransferType } from '../../services/stocks-transfer-type.service.js';

function StocksTransferType() {
  const [data, setData] = useState({
    items: [],
    itemsPerPage: 25,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [query, setQuery] = useState({
    search: '',
    from_date: null,
    to_date: null,
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });

  const [itemDel, setItemDel] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages } = data;

  useEffect(() => {
    _getListStocsTransferType(query);
  }, []);

  const _getListStocsTransferType = async (_query) => {
    try {
      let data = await getListStocksTransferType(_query);
      setData(data);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleSubmitFilter = (params) => {
    let _query = { ...query, ...params, page: 1 };
    _getListStocsTransferType(_query);
    setQuery(_query);
  };

  const handleChangePage = (newPage, sizePage) => {
    let _query = { ...query, page: newPage };
    _getListStocsTransferType(_query);
    setQuery(_query);
  };

  const handleActionRow = (item, type) => {
    let routes = {
      detail: '/stocks-transfer-type/detail/',
      edit: '/stocks-transfer-type/edit/',
      add: '/stocks-transfer-type/add',
    };
    const route = routes[type];
    if (type.match(/detail|edit/i)) {
      window._$g.rdr(`${route}${item.stocks_transfer_type_id}`);
    } else {
      setOpenModal(true);
      setItemDel([item]);
    }
  };

  const handleBulkAction = async (items, action) => {
    if (action === 'delete') {
      setOpenModal(true);
      setItemDel(items);
    }
  };

  const _handleCloseModal = () => {
    setOpenModal(false);
    setItemDel([]);
  };

  const _handleDelete = async () => {
    try {
      let ids = (itemDel || []).map((p) => p.stocks_transfer_type_id);
      await delStocksTransferType(ids);
      let _query = { ...query, page: 1 };
      _getListStocsTransferType(_query);
      setItemDel([]);
      setOpenModal(false);
      setQuery(_query);
    } catch (error) {}
  };

  return (
    <div className='bw_main_wrapp'>
      <StocksTransferTypeFilter onChange={handleSubmitFilter} />
      <StocksTransferTypeTable
        onChangePage={handleChangePage}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        handleActionRow={handleActionRow}
        handleBulkAction={handleBulkAction}
      />
      {openModal && <BWModalDelete onCloseModal={_handleCloseModal} handleDelete={_handleDelete} />}
    </div>
  );
}

export default StocksTransferType;
