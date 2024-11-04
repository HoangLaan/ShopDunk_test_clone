import React, { useEffect, useCallback, useState } from 'react';
import moment from 'moment';
import { getList } from 'services/compare-budget.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';
import Filter from '../components/Filter';
import Table from '../components/Table';
import { exportExcel } from 'services/compare-budget.service';
import Loading from '../components/common/Loading';

const CompareBudgetPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages, sum } = dataList;

  const getData = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(getData, [getData]);

  const onChangeQuery = (query) => {
    setParams((prev) => ({ ...prev, ...query }));
  };

  const handleExportExcel = () => {
    setLoadingExport(true);
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `BANG_SO_SANH_NGAN_SACH_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  };

  return (
    <div class='bw_main_wrapp'>
      <Filter
        onChange={onChangeQuery}
        onReset={(query) => {
          setParams({ ...defaultParams, ...query });
        }}
      />
      <Table
        onChangePage={(page) => {
          onChangeQuery({ page });
        }}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        loading={loading}
        onRefresh={getData}
        exportExcel={handleExportExcel}
        sumRecord={sum}
      />
      {loadingExport && <Loading />}
    </div>
  );
};

export default CompareBudgetPage;
