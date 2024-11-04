import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { showToast } from 'utils/helpers';
// Service
import { getList, deleteProductCategory, exportExcel } from 'services/product-category.service';
// Components
import Filter from './components/Filter';
import Table from './components/Table';
import BWModal from 'components/shared/BWModal/index';

const ModalContent = styled.p`
  margin-bottom: 0;
`;

export default function ProductCategory() {
  const [dataProductCategory, setDataProductCategory] = useState({
    items: [],
    itemsPerPage: 25,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [openModal, setOpenModal] = useState(false);
  const [itemDel, setItemDel] = useState([]);
  const onCloseModal = () => {
    setOpenModal(false);
  };

  const [query, setQuery] = useState({
    search: '',
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
    type: 4,
    is_show_web: 2,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataProductCategory;

  const getData = useCallback(() => {
    try {
      getList(query).then((data) => {
        setDataProductCategory(data);
      });
    } catch (error) {
      showToast.error(window._$g._(error.message));
    }
  }, [query]);

  useEffect(getData, [getData]);

  const handleActionRow = (item, type) => {
    let routes = {
      detail: '/product-category/detail/',
      delete: '/product-category/delete/',
      edit: '/product-category/edit/',
      add: '/product-category/add',
    };
    const route = routes[type];
    if (type.match(/detail|edit/i)) {
      window._$g.rdr(`${route}${item.product_category_id}`);
    } else {
      setOpenModal(true);
      setItemDel([item]);
    }
  };

  const handleDelete = async (itemDel) => {
    await deleteProductCategory(itemDel);
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
    if (action == 'delete') {
      setOpenModal(true);
      setItemDel(items);
    }
  };

  const handleExportExcel = () => {
    exportExcel(query)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `Danh_muc_nganh_hanh_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        showToast.error('Không có dữ liệu để xuất file excel.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
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
