import CustomerFilter from 'pages/Customer/components/filters/CustomerFilter';
import CustomerTable from 'pages/Customer/components/tables/CustomerTable';
import ModalLoading from 'pages/Product/components/Loading';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { exportExcelCustomer, getListCustomerOptimal } from 'services/customer.service';
import { LARGE_LIST_PARAMS } from 'utils/constants';
import { createDownloadFile, showToast } from 'utils/helpers';
import ModalImportError from '../components/modals/ModalImportError';
import PageProvider from '../components/provider/PageProvider';
import { MODAL } from '../utils/constants';

const CustomerPage = () => {
  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);

  const [dataCustomer, setDataCustomer] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);

  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  const loadCustomer = useCallback(() => {
    setLoading(true);
    getListCustomerOptimal(params)
      .then(setDataCustomer)
      .finally(() => setLoading(false));
  }, [params]);
  useEffect(loadCustomer, [loadCustomer]);

  const exportExcel = useCallback(() => {
    setLoadingExport(true);
    if (dataCustomer.totalItems <= 0) {
      showToast.warning('Hiện tại không có dữ liệu để xuất excel');
      return;
    }
    exportExcelCustomer(params)
      .then((response) => createDownloadFile(response?.data, 'danh-sach-khach-hang.xlsx'))
      .catch(() => {})
      .finally(() => setLoadingExport(false));
  }, [params, dataCustomer.totalItems]);

  const title = useMemo(
    () => (
      <div className='bw_col_6'>
        <div className='bw_count_cus'>
          <img src='bw_image/icon/i__cus_home.svg' alt='total customer' />
          Tổng khách hàng: {dataCustomer.totalItems}
        </div>
      </div>
    ),
    [dataCustomer.totalItems],
  );

  return (
    <>
      <PageProvider>
        <div className='bw_main_wrapp'>
          <CustomerFilter onChange={onChange} onClearParams={onClearParams} />
          <CustomerTable
            title={title}
            loading={loading}
            params={params}
            onChange={onChange}
            data={dataCustomer.items}
            totalPages={dataCustomer.totalPages}
            itemsPerPage={dataCustomer.itemsPerPage}
            page={dataCustomer.page}
            totalItems={dataCustomer.totalItems}
            onRefresh={loadCustomer}
            exportExcel={exportExcel}
          />
          {loadingExport && <ModalLoading />}
        </div>
        <ModalImportError />
        <div id={MODAL.IMPORT}></div>
        <div id={MODAL.IMPORT_ERROR}></div>
      </PageProvider>
    </>
  );
};
export default CustomerPage;
