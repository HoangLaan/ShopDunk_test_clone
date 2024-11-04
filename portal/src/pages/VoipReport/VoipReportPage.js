import React, { useState, useCallback, useEffect } from 'react';

import VoipReportTable from './components/VoipReportTable';
import VoipReportFilter from './components/VoipReportFilter';
import { getListVoipReport, exportExcel } from 'services/voip-report.services';
import { DEFAULT_PARAMS } from './utils/constants';
import { defaultPaging } from 'utils/helpers';
import Loading from './components/Loading';
import { showToast } from 'utils/helpers';
import moment from 'moment';

const CDRSPage = () => {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadList = useCallback(() => {
    setLoading(true);
    getListVoipReport(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [params]);

  useEffect(loadList, [loadList]);

  const handleExportExcel = () => {
    let sheetName;
    if (params.type_report === "/v3/report/call/user") {
      sheetName = 'Báo Cáo Dựa Trên Người Dùng'
    } else if (params.type_report === "/v3/report/call/extension") {
      sheetName = 'Báo Cáo Tổng Hợp Máy Nhánh'
    } else if (params.type_report === "/v3/report/call/extension/summary") {
      sheetName = 'Báo Cáo Tổng Hợp Máy Nhánh Và Người dùng'
    } else if (params.type_report === "/v3/report/call/extension/summary/day") {
      sheetName = 'Báo Cáo Tổng Hợp Máy Nhánh Theo Ngày'
    } else if (params.type_report === "/v3/report/call/agent/detail") {
      sheetName = 'Báo Cáo Chi tiết Agent'
    } else if (params.type_report === "/v3/report/call/agent/performance-with-customer") {
      sheetName = 'Báo Cáo Hiệu Suất Của Agent Với Khách Hàng'
    }
    setLoadingExport(true);
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `${sheetName}_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <VoipReportFilter
          onChange={(e) => {
            console.log(e);
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <VoipReportTable
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          data={items ?? []}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={loadList}
          handleExportExcel={handleExportExcel}
          params={params}
        />
      </div>
      {loadingExport && <Loading />}
    </React.Fragment>
  );
};

export default CDRSPage;
