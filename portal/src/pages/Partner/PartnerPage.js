import React, { useState, useCallback, useEffect } from 'react';

import PartnerFilter from 'pages/Partner/components/PartnerFilter';
import PartnerTable from 'pages/Partner/components/PartnerTable';
import { getListPartner, exportExcel } from 'services/partner.service';
import { isEmpty } from 'lodash';
import ModalSelectAll from 'pages/Customer/components/modals/ModalSelectAll';
import { createDownloadFile, showToast } from 'utils/helpers';

const PartnerPage = () => {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
    source_id: 0,
    customer_type_id: 0,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [openModalSelectAll, setOpenModalSelectAll] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadPartner = useCallback(() => {
    setLoading(true);
    getListPartner(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handleExportExcel = useCallback(() => {
      exportExcel(params)
      .then((res) => createDownloadFile(res?.data, 'partner.xlsx'))
      .catch((error) => {
        showToast.error('Không có dữ liệu để xuất file excel.');
      });
  }, [params]);

  useEffect(loadPartner, [loadPartner]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PartnerFilter
          onChange={(e) => {
            if (isEmpty(e)) {
              setParams({
                is_active: 1,
                page: 1,
                itemsPerPage: 25,
                source_id: 0,
                customer_type_id: 0,
              });
            }
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <PartnerTable
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
          onRefresh={loadPartner}
          setSelectedCustomer={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
          tableKey={tableKey}
          setOpenModalSelectAll={setOpenModalSelectAll}
          setLoadedData={setLoadedData}
          setTableKey={setTableKey}
          openModalSelectAll={openModalSelectAll}
          handleExportExcel={handleExportExcel}
        />
      </div>
      {openModalSelectAll && (
        <ModalSelectAll
          title='Khách hàng doanh nghiệp'
          loadedData={loadedData}
          totalItems={totalItems}
          onClose={() => {
            setOpenModalSelectAll(false);
            setLoadedData([]);
          }}
          onConfirm={() => {
            setSelectedCustomer(loadedData);
            setLoadedData([]);
            setTableKey((prev) => ++prev);
            setOpenModalSelectAll(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default PartnerPage;
