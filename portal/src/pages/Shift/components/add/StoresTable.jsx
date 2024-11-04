import DataTable from 'components/shared/DataTable/index';
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import StoreModal from '../Modal/StoreModal';
import { useFormContext } from 'react-hook-form';

dayjs.extend(customParseFormat);

const StoresTable = () => {
  const { setValue, watch, reset, getValues } = useFormContext();
  const data = useMemo(() => watch('store_apply_list') ?? [], [watch('store_apply_list')]);
  const itemsPerPage = 10;
  const [isOpenStore, setIsOpenStore] = useState(false);
  const [page, setPage] = useState(1);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    if (data.length > 0 && page === 1) {
      setDataList(data.slice(0, itemsPerPage));
    }
  }, [page, data]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã cửa hàng',
        accessor: 'store_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên cửa hàng',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Miền',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
      },
      {
        header: 'Cụm',
        classNameHeader: 'bw_text_center',
        accessor: 'cluster_name',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Chọn cửa hàng',
        permission: 'MD_SHIFT_EDIT',
        onClick: () => setIsOpenStore(true),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_SHIFT_EDIT',
        onClick: (p, index) => {
          const store_apply_list = watch('store_apply_list')?.filter((item) => item.store_id !== p.store_id);
          reset({
            ...getValues(),
            store_apply_list,
          });
          setDataList(store_apply_list.slice((page - 1) * itemsPerPage, page * itemsPerPage));
        },
      },
    ];
  }, [data]);

  return (
    <>
      <DataTable
        key={data}
        title={
          <b>
            Cửa hàng áp dụng <span className='bw_red'>*</span>
          </b>
        }
        noSelect={true}
        columns={columns}
        data={dataList}
        actions={actions}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={data.length}
        totalPages={Math.ceil(data.length / itemsPerPage)}
        onChangePage={(page) => {
          setPage(page);
          setDataList(data.slice((page - 1) * itemsPerPage, page * itemsPerPage));
        }}
      />

      {isOpenStore && (
        <StoreModal
          open={isOpenStore}
          onClose={() => {
            setIsOpenStore(false);
          }}
          onApply={(d) => {
            setValue('store_apply_list', d);
          }}
          defaultDataSelect={data}
        />
      )}
    </>
  );
};

export default StoresTable;
