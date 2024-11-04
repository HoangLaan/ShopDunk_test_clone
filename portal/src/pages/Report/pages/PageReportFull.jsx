import React from 'react';
import { useEffect, useCallback, useState } from 'react';
import moment from 'moment';
import { getList, exportExcel, exportPDF } from 'services/accounting-detail.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';
import Loading from '../components/common/Loading';

import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import ModalFilter from '../components/common/ModalFilter';
import ReportTableFull from '../components/common/TableReportFull';
import { exportReportAccounting, getListReportAccounting } from 'services/report';
import { convertedArr, dateReport, monthDefault } from '../utils/helper';
import { keyReport } from '../utils/constant';

const ReportSale = () => {
  const methods = useForm();
  
  const [params, setParams] = useState({
    ...defaultParams,
    itemsPerPage: 26
  });
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(true);
  const [listBusiness, setListBusiness] = useState();
  const [timeReport, setTimeReport] = useState();

  const { items, itemsPerPage, page, totalItems, totalPages, meta } = dataList;

  const getData = useCallback(() => {
    if(!isOpenModal){
        setLoading(true);
        getListReportAccounting(params)
          .then(setDataList)
          .finally(() => {
            setLoading(false);
        });
    }
  }, [params, isOpenModal]);

  useEffect(getData, [getData]);

  useEffect(() => {
    document.getElementById('bw_close_nav')?.click();
  }, []);

  const openFilter = useCallback(() => {
    setIsOpenModal(true);
  }, [])

  const handleExportExcel = useCallback(() => {
    setLoadingExport(true);
    exportReportAccounting({...params, list_business: methods.watch('business_id')?.map(i => i?.label), time_report: JSON.stringify(timeReport)})
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `SO_CHI_TIET_BAN_HANG_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  }, [params]);

  return (
    <FormProvider {...methods}>
      <div class='bw_main_wrapp' style={{position: 'unset'}}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'x-large', fontWeight: 'bold'}}>
            SỔ CHI TIẾT BÁN HÀNG
          </h1>
          <h3 style={{ padding: '5px', fontWeight: 'bold', fontStyle: 'italic'}}>
            {methods.watch('business_id') 
              && convertedArr(methods.watch('business_id').map(i => i?.label))}
          </h3>
          <h3 style={{ padding: '5px', fontWeight: 'bold', fontStyle: 'italic'}}>
            {timeReport ? dateReport(timeReport) : `${monthDefault} năm ${moment().year()}`}
          </h3>
        </div>

        <ReportTableFull
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
          exportExcel={handleExportExcel}
          setParams={setParams}
          openFilter={openFilter}
          meta={meta}
        />
        {loadingExport && <Loading />}
      {
        isOpenModal && 
        <ModalFilter 
          setIsOpenModal={setIsOpenModal} 
          setParams={setParams} 
          setListBusiness={setListBusiness}
          isOpenModal={isOpenModal}
          setTimeReport={setTimeReport}
          methods={methods}
          keyFilter={keyReport.REPORT_ACCOUTING}
        />
      }
      </div>

    </FormProvider>
  );
};

export default ReportSale;
