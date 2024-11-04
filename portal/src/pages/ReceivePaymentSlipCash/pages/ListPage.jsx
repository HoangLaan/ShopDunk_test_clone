import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { cdnPath } from 'utils/index';
import { getList } from 'services/receive-slip.service';
import { deleteReceivePaymentSlip, exportPDF, exportExcel } from 'services/receive-slip.service';
import ReceiveSlipFilter from '../components/Filter';
import ReceiveSlipTable from '../components/TableData';
import Loading from 'components/shared/Loading/index';
import StatisticsBlock from '../components/Statistics';
import { defaultPaging, showToast } from 'utils/helpers';
import ImportExcel from '../components/common/ImportExcel';
import ImportResultModal from '../components/common/ImportResult';
import { CONFIRM_STATUS, REVIEW_STATUS } from '../utils/constants';
import { getListStoreByUser } from 'pages/Orders/helpers/call-api';

export const DEFAULT_PARAMS = {
  is_active: 1,
  page: 1,
  itemsPerPage: 25,
  review_status: REVIEW_STATUS.APPROVE,
  is_book_keeping: CONFIRM_STATUS.CONFIRMED,
};

const ReceiveSlipPage = () => {
  const [loadingExport, setLoadingExport] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(null);
  const [openModalResultImport, setOpenModalResultImport] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [listData, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(false);
  const [storeOpts, setStoreOpts] = useState([]);

  const { items, itemsPerPage, page, totalItems, totalPages } = listData;
  const [params, setParams] = useState(DEFAULT_PARAMS);

  const loadReceiveSlip = useCallback(() => {
    setLoading(true);
    getList(params, 1)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadReceiveSlip, [loadReceiveSlip]);

  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleExportPDF = (receive_payment_id) => {
    setLoadingPdf(true);
    exportPDF({ receive_payment_id })
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  const handleExportExcel = () => {
    setLoadingExport(true);
    exportExcel({ ...params, payment_type: 1 })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `DS_PHIEU_THU_CHI_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  };

  const handleCloseModalImport = (isReload = false) => {
    setOpenModalImport(false);
    if (isReload) setParams(DEFAULT_PARAMS);
  };

  const handleSetImportResult = (importResult) => {
    setImportResult(importResult);
    setOpenModalImport(false);
    setOpenModalResultImport(true);
  };

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  const handleDelete = (listId) => {
    deleteReceivePaymentSlip(listId)
      .then(() => {
        loadReceiveSlip();
        showToast.success('Xóa thu chi thành công !');
      })
      .catch((error) => {
        showToast.error(error.message ?? 'Có lỗi xảy ra!');
      });
  };

  const fetchStoreOpts = useCallback((value, isFirst = false) => {
    return getListStoreByUser({
      search: value,
      is_active: 1,
      itemsPerPage: isFirst ? 9999 : 30,
      page: 1,
    }).then((body) => {
      const _storeOpts = body.items.map((_store) => ({
        label: _store.store_name,
        value: _store.store_id,
        ..._store,
      }));
      const listStoreId = _storeOpts.map((item) => item.value);
      // add option select all for store and set state storeOpts
      setStoreOpts([{ store_name: 'Select all', label: 'Tất cả cửa hàng', value: `${listStoreId}` }, ..._storeOpts]);

      if (isFirst && _storeOpts?.length > 0) {
        DEFAULT_PARAMS.store_id = listStoreId.join(', ');
        setParams((prev) => ({ ...prev, store_id: listStoreId.join(', ') }));
      }
    });
  }, []);

  useEffect(() => {
    fetchStoreOpts(null, true);
  }, [fetchStoreOpts]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <StatisticsBlock params={params} />
          </div>
          <div className='bw_col_8'>
            <ReceiveSlipFilter onChange={setParams} storeOpts={storeOpts} />
          </div>
        </div>
        <ReceiveSlipTable
          onChangePage={(page) => {
            onChange({ page });
          }}
          loadData={loadReceiveSlip}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          exportExcel={handleExportExcel}
          importExcel={() => setOpenModalImport(true)}
          handleExportPDF={handleExportPDF}
          reload={loadReceiveSlip}
        />
        {loadingPdf && <Loading />}
        {openModalImport && <ImportExcel onClose={handleCloseModalImport} handleImportDone={handleSetImportResult} />}
        {loadingExport && <Loading />}
        {openModalResultImport && (
          <ImportResultModal results={importResult} onClose={() => setOpenModalResultImport(false)} />
        )}
      </div>
    </React.Fragment>
  );
};

export default ReceiveSlipPage;
