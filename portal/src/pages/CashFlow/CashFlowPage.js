import React, { useState, useCallback, useEffect } from 'react';
import { showToast } from 'utils/helpers';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';

import { exportExcelCashFlow, getCashFlowList } from 'services/cash-flow.service';
import { defaultPaging, defaultParams } from 'utils/helpers';

import CashFlowFilter from './components/CashFlowFilter';
import CashFlowTable from './components/CashFlowTable';
import ImportExcel from './components/modals/ImportExcel';
import ImportError from './components/modals/ImportError';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const CashFlowPage = () => {
  const [isOpenModalImport, setIsOpenModalImport] = useState(false);
  const [isOpenModalErrorImport, setIsOpenModalErrorImport] = useState(false);
  const [errorImport, setErrorImport] = useState(null);
  const [params, setParams] = useState({ ...defaultParams, cash_flow_type: 3 });
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const handleCloseModalImport = (isReload = false) => {
    setIsOpenModalImport(false);
    if (isReload) loadData();
  };

  const handleSetErrorImport = (errorsImport) => {
    setErrorImport(errorsImport);
    setIsOpenModalImport(false);
    setIsOpenModalErrorImport(true);
  };

  const loadData = useCallback(() => {
    setLoading(true);
    getCashFlowList({ ...params, parent_id: 0 })
      .then(setDataList)
      .catch((err) => {
        showToast.error(err?.message ?? 'Có lỗi xảy ra', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadData, [loadData]);

  const exportExcel = useCallback(() => {
    setLoadingExport(true);
    exportExcelCashFlow(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY_HHmmss');
        link.setAttribute('download', `Danh_sach_dong_tien_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        showToast.error(error?.message ?? 'Có lỗi xảy ra', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      })
      .finally(() => setLoadingExport(false));
  }, [params]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp'>
        <Spin spinning={loading || loadingExport} indicator={antIcon}>
          <CashFlowFilter
            onChange={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                };
              });
            }}
            setLoading={setLoading}
          />
          <CashFlowTable
            loading={loading}
            onChangePage={(page) => {
              setParams({
                ...params,
                page,
              });
            }}
            data={items}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            page={page}
            totalItems={totalItems}
            onRefresh={loadData}
            exportExcel={exportExcel}
            importExcel={() => {
              setIsOpenModalImport(true);
            }}
            getChildren={getCashFlowList}
          />
        </Spin>
      </div>

      {isOpenModalImport && (
        <ImportExcel onClose={handleCloseModalImport} handleSetErrorImport={handleSetErrorImport} />
      )}

      {isOpenModalErrorImport && <ImportError errors={errorImport} onClose={() => setIsOpenModalErrorImport(false)} />}
    </React.Fragment>
  );
};

export default CashFlowPage;
