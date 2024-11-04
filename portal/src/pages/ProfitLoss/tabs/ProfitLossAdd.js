import React, { useState } from 'react';
import ProfitLossTable from '../components/Tables/ProfitLossTable';
import ProfitLossFilter from '../components/Filters/ProfitLossFilter';
import { LARGE_LIST_PARAMS } from 'utils/constants';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import profitLossService from 'services/profitLoss.service';
import moment from 'moment';

function ProfitLossAdd() {
  const methods = useForm();
  const parentMethods = useFormContext();

  const [params, setParams] = useState(LARGE_LIST_PARAMS);
  const onClearParams = () => setParams(LARGE_LIST_PARAMS);

  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));
  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  const onSubmit = (data) => {
    if (!data?.list || data?.list?.length === 0) {
      return showToast.warning('Không có dữ liệu !');
    }

    profitLossService
      .create(data)
      .then(() => {
        showToast.success('Lưu thành công !');
      })
      .catch((err) => {
        showToast.error(err.message || 'Có lỗi xảy ra !');
      });

    parentMethods.setValue('reload', {});
  };

  const handleExportExcel = () => {
    if (!methods.watch('list') || methods.watch('list')?.length === 0) {
      return showToast.warning('Không có dữ liệu !');
    }
    profitLossService
      .exportExcel({ list: methods.watch('list'), programs: methods.watch('discount_programs') })
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
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          methods.handleSubmit(onSubmit)(e);
        }}>
        <ProfitLossFilter onChange={onChange} onClearParams={onClearParams} />
        <ProfitLossTable exportExcel={handleExportExcel} params={params} onChangePage={onChangePage} />
      </form>
    </FormProvider>
  );
}

export default ProfitLossAdd;
