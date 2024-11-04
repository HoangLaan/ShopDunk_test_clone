import React from 'react';
import { useEffect, useCallback, useState } from 'react';
import moment from 'moment';
// import { getList } from 'services/accounting.service';
import { getList, exportExcel, exportPDF } from 'services/accounting-detail.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';
import Loading from '../components/common/Loading';

import Filter from '../components/Filter';
import Table from '../components/Table';
import { cdnPath } from 'utils';
import { FormProvider, useForm } from 'react-hook-form';
import { DefaultFilter } from '../utils/constant';
import { useSelector } from 'react-redux';

const AccountinList = () => {
  const methods = useForm({
    defaultValues: DefaultFilter,
  });
  const [createdDateFrom, setCreatedDateFrom] = useState();
  const [createdDateTo, setCreatedDateTo] = useState();
  const [params, setParams] = useState({
    ...defaultParams,
    itemsPerPage: 26,
    ...DefaultFilter,
  });
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

  useEffect(() => {
    document.getElementById('bw_close_nav')?.click();
  }, []);

  const handleExportPDF = useCallback(() => {
    setLoadingExport(true);
    exportPDF(params)
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  }, [params]);

  const handleExportExcel = useCallback(() => {
    setLoadingExport(true);
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `BANG_HACH_TOAN_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  }, [params]);

  const paymentFormData = useSelector((state) => state.global.paymentFormData);

  return (
    <FormProvider {...methods}>
      <div class='bw_main_wrapp'>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'x-large', fontWeight: '600', padding: '10px 10px 40px 10px', fontStyle: 'italic' }}>
            Từ ngày {createdDateFrom} đến ngày {createdDateTo}
          </h1>
        </div>

        <Filter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          setCreatedDateFrom={setCreatedDateFrom}
          setCreatedDateTo={setCreatedDateTo}
          paymentFormData={paymentFormData}
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
          exportPDF={handleExportPDF}
          exportExcel={handleExportExcel}
          setParams={setParams}
          paymentFormData={paymentFormData}
          // sumRecord={sum || {}}
        />
        {loadingExport && <Loading />}
      </div>
    </FormProvider>
  );
};

export default AccountinList;
