import React, { useState, useCallback, useEffect } from 'react';
// services
import { ExportExcelStock, getList } from 'services/stocks-detail.service';
//components
import StocksDetailFilter from './components/Filter';
import StocksDetailTable from './components/Table';
import './style.scss';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import { useMemo } from 'react';
import CalculatePricingOutStocks from './components/Modals/CalStocks/CalculatePricingOutStocks';
import PanelCalculate from './components/Modals/CalStocks/PanelCalculate';
import { showToast } from 'utils/helpers';
import { getErrorMessage } from 'utils';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const StocksDetailPage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_out_of_stock: 1,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;
  const [isOpenCalculateModal, setIsOpenCalculateModal] = useState(false);
  const isCalculatePage = useMemo(() => pathname.toLowerCase().includes('/out-calculate-pricing'), [pathname]);

  const loadStocksDetail = useCallback(() => {
    setLoading(true);
    if(params?.search){
      history.push(`/stocks-detail?search=${params.search}`)
    }else {
      history.replace('/stocks-detail');
    }
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadStocksDetail, [loadStocksDetail]);

  useEffect(() => {
    setIsOpenCalculateModal(isCalculatePage);
  }, [isCalculatePage]);

  const handleExportExcel = () => {
    ExportExcelStock(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DS_Ton_Kho.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        const { message } = err;
        showToast.error(
          getErrorMessage({
            message: message || 'Đã xảy ra lỗi vui lòng kiểm tra lại',
          }),
        );
      })
      .finally(() => {});
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp detail_inventory'>
        <StocksDetailFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
                page: 1,
              };
            });
          }}
        />

        <StocksDetailTable
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onChangeParams={(query) => {
            setParams((prev) => {
              return {
                ...prev,
                ...query,
                page: 1,
              };
            });
          }}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={loadStocksDetail}
          handleExportExcel={handleExportExcel}
        />
      </div>
      {isOpenCalculateModal && <PanelCalculate setShowModal={setIsOpenCalculateModal} />}
    </React.Fragment>
  );
};

export default StocksDetailPage;
