import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { getList } from 'services/other-acc-voucher.service';
import { defaultPaging, showToast } from 'utils/helpers';

import Filter from '../components/Filter';
import Table from '../components/Table';
import { DefaultParams } from '../utils/constant';
import { exportExcel, exportPDF } from 'services/other-acc-voucher.service';
import moment from 'moment';
import { cdnPath } from 'utils';
import { Spin } from 'antd';

const InstallmentPartnerList = () => {
  const [params, setParams] = useState(DefaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const getData = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handleExportExcel = () => {
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `ds_chung_tu_nghiep_vu_khac_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'));
  };

  const handleExportPDF = (otherVoucherId) => {
    setLoadingPdf(true);
    exportPDF({ other_voucher_id: otherVoucherId })
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

  useEffect(getData, [getData]);

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 60px)' }}>
      <div class='bw_main_wrapp'>
        <Filter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <Table
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
          loading={loading}
          onRefresh={getData}
          handleExportExcel={handleExportExcel}
          handleExportPDF={handleExportPDF}
          loadingPdf={loadingPdf}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: loadingPdf ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Spin />
      </div>
    </div>
  );
};

export default InstallmentPartnerList;
