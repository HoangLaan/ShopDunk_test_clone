import React, { useState, useCallback, useEffect } from 'react';

import CDRSTable from './components/CDRsTable';
import CDRSFilter from './components/CDRsFilter';
import { getListCdrsSamCenter, exportExcel } from './services/call-api';
import Loading from './components/Loading';
import { showToast } from 'utils/helpers';
import moment from 'moment';
import { useAuth } from 'context/AuthProvider';
import { IS_MISSED_CALL } from './utils/constants';
const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();
// Định dạng ngày, tháng, năm và jsYear thành chuỗi
const formattedDate = `${day}/${month}/${year}`;

const CDRSPage = ({ phoneNumber }) => {
  const [tabActive, setTabActive] = useState(IS_MISSED_CALL[0].value);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
    phone: {
      value: phoneNumber,
    },
    start_date: formattedDate,
    end_date: formattedDate,
    is_missed: 0,
  });

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    meta: {},
  });
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages, meta } = dataList;
  const { user } = useAuth();
  const loadList = useCallback(() => {
    setLoading(true);
    getListCdrsSamCenter(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [params]);
  useEffect(loadList, [loadList]);

  useEffect(() => {
    if (phoneNumber) {
      setParams((prev) => {
        return {
          ...prev,
          phone: {
            value: phoneNumber,
          },
        };
      });
    }
  }, [phoneNumber, setParams]);


  const handleExportExcel = () => {
    setLoadingExport(true);
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `VOID_SAMCENTER_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  };

  const onChangeDataList = (row) => {
    setDataList((prevDataList) => {
      // Tìm vị trí của phần tử cần cập nhật trong mảng items
      const indexToUpdate = prevDataList.items.findIndex((item) => item.id === row.id);

      // Nếu tìm thấy phần tử, cập nhật giá trị user
      if (indexToUpdate !== -1) {
        const updatedItems = [...prevDataList.items];
        updatedItems[indexToUpdate].user = user.full_name;
        updatedItems[indexToUpdate].is_recall = 1
        // Trả về một bản sao mới của prevDataList với items được cập nhật
        return {
          ...prevDataList,
          items: updatedItems,
        };
      }

      // Nếu không tìm thấy phần tử, trả về prevDataList nguyên vẹn
      return prevDataList;
    });
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <CDRSFilter
          phoneNumber={phoneNumber}
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
                is_missed: tabActive || e?.is_missed,
                phone: e?.phone_search || e?.phone || ''
              };
            });
          }}
          onClear={() => {
            setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 25,
              start_date: formattedDate,
              end_date: formattedDate,
              is_missed: 0,
            });
          }}
        />
        <CDRSTable
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onChangeParams={(data) => {
            setParams((prev) => ({
              ...prev,
              ...data,
            }));
          }}
          data={items ?? []}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={row => onChangeDataList(row)}
          missed_counts={meta.missed_counts}
          tabActive={tabActive}
          setTabActive={setTabActive}
          handleExportExcel={handleExportExcel}
          params={params}
        />
      </div>
      {loadingExport && <Loading />}
      {/* <ConfirmModal /> */}
    </React.Fragment>
  );
};

export default CDRSPage;
