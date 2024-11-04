import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { notification } from 'antd';

// service
import { getList, deleteProduct, exportExcel } from 'services/material.service';
// components
import Filter from './components/Filter';
import Table from './components/Table';
import BWModal from 'components/shared/BWModal';
import ImportExcel from './components/ImportExcel';
import Loading from './components/Loading';
import ImportError from './components/ImportError';
import { defaultPaging } from 'utils/helpers';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function Material() {
  const [dataProduct, setDataProduct] = useState(defaultPaging);

  const [openModal, setOpenModal] = useState(null);
  const [openModalImport, setOpenModalImport] = useState(null);
  const [openModalErrorImport, setOpenModalErrorImport] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [itemDel, setItemDel] = useState([]);
  const [errorImport, setErrorImport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    search: '',
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataProduct;

  const onCloseModal = () => {
    setOpenModal(null);
  };
  const getData = useCallback(() => {
    try {
      setLoading(true);
      getList(query).then((data) => {
        setDataProduct(data);
      });
    } catch (error) {
      notification.error({ message: window._$g._(error.message) });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(getData, [getData]);

  const handleActionRow = (item, type) => {
    let routes = {
      detail: '/material/detail/',
      edit: '/material/edit/',
      add: '/material/add',
      copy: '/material/add/',
    };
    const route = routes[type];
    if (type.match(/detail|copy|edit/i)) {
      window._$g.rdr(`${route}${item.material_id}`);
    } else {
      setOpenModal(type === 'delete' ? 'delete' : 'changepwd');
      setItemDel([item]);
    }
  };

  const handleDelete = async (product) => {
    await deleteProduct(product);
    setItemDel([]);
    onCloseModal();
    getData();
  };

  const handleSubmitFilter = (values) => {
    let _query = { ...query, ...values, page: 1 };
    setQuery(_query);
  };

  const handleChangePage = (newPage) => {
    let _query = { ...query, page: newPage };
    setQuery(_query);
  };

  const handleBulkAction = async (items, action) => {
    if (action === 'delete') {
      setOpenModal(true);
      setItemDel(items);
    }
  };

  const handleExportExcel = () => {
    setLoadingExport(true);
    exportExcel(query)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY_HHmmss');
        link.setAttribute('download', `Tui_bao_bi_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => notification.error({ message: error.message || 'Lỗi tải tập tin.' }))
      .finally(() => setLoadingExport(false));
  };

  const handleSetErrorImport = (errorsImport) => {
    setErrorImport(errorsImport);
    setOpenModalImport(false);
    setOpenModalErrorImport(true);
  };

  const handleCloseModalImport = (isReload = false) => {
    setOpenModalImport(false);
    if (isReload)
      setQuery({
        search: '',
        is_active: 2,
        page: 1,
        itemsPerPage: 25,
      });
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
        <Table
          onChangePage={handleChangePage}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleActionRow={handleActionRow}
          handleBulkAction={handleBulkAction}
          exportExcel={handleExportExcel}
          importExcel={() => setOpenModalImport(true)}
          loading={loading}
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
      {openModalImport && <ImportExcel fetchData={getData} onClose={handleCloseModalImport} handleSetErrorImport={handleSetErrorImport} />}
      {loadingExport && <Loading />}
      {openModalErrorImport && <ImportError errors={errorImport} onClose={() => setOpenModalErrorImport(false)} />}
    </>
  );
}
