import React, { useCallback, useEffect, useState } from 'react';
import ProfitLossTable from '../components/Tables/ProfitHistoryTable';
import ProfitLossFilter from '../components/Filters/ProfitLossHistoryFilter';
import { LARGE_LIST_PARAMS } from 'utils/constants';
import { defaultPaging, showToast } from 'utils/helpers';
import ProfitLossService from 'services/profitLoss.service';
import moment from 'moment';
import { useFormContext } from 'react-hook-form';

function ProfitLossHistory() {
  const methods = useFormContext();

  const [listData, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages, meta } = listData;
  const [params, setParams] = useState(LARGE_LIST_PARAMS);

  const onClearParams = () => setParams(LARGE_LIST_PARAMS);

  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  const loadData = useCallback(() => {
    setLoading(true);
    ProfitLossService.getHistoryList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    if (methods.watch('reload')) {
      setParams((prev) => ({ ...prev }));
    }
  }, [methods.watch('reload')]);

  useEffect(loadData, [loadData]);

  const handleExportExcel = () => {
    ProfitLossService.exportHistoryExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `DS_PROFIT_LOSS_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'));
  };

  return (
    <div>
      <ProfitLossFilter onChange={onChange} onClearParams={onClearParams} />
      <ProfitLossTable
        onChangePage={onChangePage}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        loading={loading}
        exportExcel={handleExportExcel}
        discountPrograms={meta}
      />
    </div>
  );
}

export default ProfitLossHistory;
