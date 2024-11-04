import moment from 'moment';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { getListCdrs, getVoipExt } from 'services/voip.services';
import { Empty } from 'antd';
import DataTable from 'components/shared/DataTable';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { defaultPaging } from 'utils/helpers';
const defaultParam = {
  is_active: 1,
  page: 1,
  itemsPerPage: 15,
};

const HistoryVoipExt = ({ phone_number }) => {
  const methods = useForm();
  const [params, setParams] = useState(defaultParam);

  const [dataList, setDataList] = useState(defaultPaging);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadVoipExt = useCallback(() => {
    getVoipExt(params)
      .then(setDataList)
      .finally(() => {});
  }, [params]);
  useEffect(loadVoipExt, [loadVoipExt]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Số máy nhánh',
        accessor: 'voip_ext',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên máy nhánh',
        accessor: 'voip_ext_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Thương hiệu',
        accessor: 'brand_name',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  return (
    <>
      <FormProvider {...methods}>
        <FilterSearchBar
          title='Tìm kiếm'
          onSubmit={setParams}
          onClear={() => setParams(defaultParam)}
          actions={[
            {
              title: 'Từ khóa',
              component: <FormInput field='keyword' placeholder={'Nhập  tên máy nhánh'} />,
            },
          ]}
          colSize={6}
        />
      </FormProvider>
      <DataTable
        noSelect
        hiddenDeleteClick
        columns={columns}
        data={items}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={(page) => {
          setParams({
            ...params,
            page,
          });
        }}
      />
    </>
  );
};

export default HistoryVoipExt;
