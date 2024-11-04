import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';

import { deleteItems, getList, exportExcel } from 'services/item.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';

import ItemTable from '../components/ItemTable';
import ItemFilter from '../components/ItemFilter';

import ImportExcel from '../components/ImportExcel';
import Loading from '../components/Loading';
import ImportResultModal from '../components/ImportResult';

const DefaultItemPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const [loadingExport, setLoadingExport] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(null);
  const [openModalResultImport, setOpenModalResultImport] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  const loadItems = useCallback(() => {
    setLoading(true);
    getList({
      ...params,
      parent_id: 0,
    })
      .then(setDataItem)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = (listId) => {
    deleteItems(listId)
      .then(() => {
        loadItems();
        showToast.success('Xóa khoản mục thành công !');
      })
      .catch((error) => {
        showToast.error(error.message ?? 'Có lỗi xảy ra!');
      });
  };

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  const handleExportExcel = () => {
    setLoadingExport(true);
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `DS_KHOẢN_MỤC_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  };

  const handleCloseModalImport = (isReload = false) => {
    setOpenModalImport(false);
    if (isReload) setParams(defaultParams);
  };

  const handleSetImportResult = (importResult) => {
    setImportResult(importResult);
    setOpenModalImport(false);
    setOpenModalResultImport(true);
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ItemFilter onChange={onChange} />
        <ItemTable
          onChangePage={(page) => {
            onChange({ page });
          }}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          getChildren={getList}
          exportExcel={handleExportExcel}
          importExcel={() => setOpenModalImport(true)}
        />
      </div>
      {openModalImport && <ImportExcel onClose={handleCloseModalImport} handleImportDone={handleSetImportResult} />}
      {loadingExport && <Loading />}
      {openModalResultImport && (
        <ImportResultModal results={importResult} onClose={() => setOpenModalResultImport(false)} />
      )}
    </React.Fragment>
  );
};

export default DefaultItemPage;
