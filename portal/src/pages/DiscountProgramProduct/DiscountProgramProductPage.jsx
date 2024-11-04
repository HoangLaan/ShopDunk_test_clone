import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { notification } from 'antd';
import DiscountProgramProductFilter from './components/DiscountProgramProductFilter';
import DiscountProgramProductTable from './components/DiscountProgramProductTable';
import {
  exportExcelDiscountProgramProduct,
  getListDiscountProgramProduct,
} from 'services/discount-program-product.service';
import Loading from 'components/shared/Loading/index';

const DiscountProgramProductPage = () => {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 25,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);
  const { items, itemsPerPage, page, totalItems, totalPages, meta } = dataList;

  const loadDiscountProgramProduct = useCallback(() => {
    setLoading(true);
    getListDiscountProgramProduct(params)
      .then((data) => {
        let productList = data?.items;

        productList = productList.reduce((acc, product, index) => {
          // insert start group when loop over first item
          if (index === 0) {
            acc.push({
              record_type: 'START',
              time: product.month + '/' + product.year,
              month: product.month,
              year: product.year,
              index: `Tháng ${product.month + '/' + product.year}`,
            });
          }

          const lastItem = acc[acc.length - 1];
          if (lastItem.month === product.month && lastItem.year === product.year) {
            acc.push({
              ...product,
              index: index + 1,
            });
          } else {
            // end of previous group
            acc.push({
              record_type: 'SUM',
              time: lastItem.month + '/' + lastItem.year,
              month: lastItem.month,
              year: lastItem.year,
              index: `Tổng tháng ${lastItem.month + '/' + lastItem.year}`,
              discount_money: acc?.reduce(
                (total, item) =>
                  item?.month === lastItem.month && item?.year === lastItem.year
                    ? total + (item.discount_money || 0)
                    : total,
                0,
              ),
            });
            // start of current group
            acc.push({
              record_type: 'START',
              time: product.month + '/' + product.year,
              month: product.month,
              year: product.year,
              index: `Tháng ${product.month + '/' + product.year}`,
            });
            acc.push({
              ...product,
              index: index + 1,
            });
          }

          // insert end group when loop over last item
          if (index === productList.length - 1) {
            if (product.next_month !== product.month || product.next_year !== product.year) {
              acc.push({
                record_type: 'SUM',
                time: product.month + '/' + product.year,
                month: product.month,
                year: product.year,
                index: `Tổng tháng ${product.month + '/' + product.year}`,
                discount_money: acc?.reduce(
                  (total, item) =>
                    item?.month === product.month && item?.year === product.year
                      ? total + (item.discount_money || 0)
                      : total,
                  0,
                ),
              });
            }
          }

          return acc;
        }, []);

        data.items = productList;
        setDataList(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const exportExcel = () => {
    setLoadingExport(true);
    exportExcelDiscountProgramProduct(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `Discount_Program_Product_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => notification.error({ message: error.message || 'Lỗi tải tập tin.' }))
      .finally((done) => setLoadingExport(false));
  };

  useEffect(loadDiscountProgramProduct, [loadDiscountProgramProduct]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <DiscountProgramProductFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <DiscountProgramProductTable
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
          exportExcel={() => exportExcel()}
          onRefresh={loadDiscountProgramProduct}
          sum={meta?.sum}
        />
        {loadingExport && <Loading />}
      </div>
    </React.Fragment>
  );
};

export default DiscountProgramProductPage;
