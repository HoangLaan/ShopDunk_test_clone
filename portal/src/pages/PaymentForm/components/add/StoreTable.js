import DataTable from 'components/shared/DataTable/index';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ModalStore from './Modal/ModalStore';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { PERMISSION_PAYMENT_FORM } from 'pages/PaymentForm/utils/constants';

const StoreTable = ({ disabled }) => {
  const { control, watch, setValue, register, getFieldState, formState } = useFormContext();
  const dispatch = useDispatch();
  const [openModalStore, setOpenModalStore] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 5,
  });

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên cửa hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (item, index) => item.store_code + '-' + item.store_name,
      },
      {
        header: 'Loại cửa hàng',
        accessor: 'store_type_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
    ],
    [],
  );

  const { fields, remove } = useFieldArray({
    control,
    name: 'list_store',
  });

  const { error } = getFieldState('list_store', formState);

  const totalPages = useMemo(() => Math.ceil(fields.length / params.itemsPerPage), [fields, params.itemsPerPage]);

  const data = useMemo(() => {
    let start = (params.page - 1) * params.itemsPerPage;
    let end = start + params.itemsPerPage;
    return fields.slice(start, end);
  }, [fields, params.itemsPerPage, params.page]);

  useEffect(() => {
    if (totalPages > 0 && params.page > totalPages) {
      setParams((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  }, [totalPages, params]);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Chọn',
        permission: [PERMISSION_PAYMENT_FORM.ADD, PERMISSION_PAYMENT_FORM.EDIT],
        hidden: disabled || watch('is_all_store') === 1,
        onClick: () => setOpenModalStore(true),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: [PERMISSION_PAYMENT_FORM.ADD, PERMISSION_PAYMENT_FORM.EDIT],
        onClick: (_, d) => {
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
              remove(d);
            }),
          );
        },
      },
    ];
  }, [disabled, remove, watch('is_all_store')]);

  const handleAddStore = (items) => {
    setValue('list_store', items);
    setOpenModalStore(false);
  };

  useEffect(() => {
    register('list_store', {
      required: watch('is_all_store') ? false : 'Bắt buộc chọn cửa hàng',
    });
  }, [watch('is_all_store')]);

  return (
    <Fragment>
      <label className='bw_checkbox'>
        <FormInput disabled={disabled} type='checkbox' field='is_all_store' />
        <span />
        Áp dụng tất cả cửa hàng
      </label>
      {!watch('is_all_store') && (
        <DataTable
          title={error && <ErrorMessage message={error?.root?.message} />}
          columns={columns}
          data={data}
          noSelect
          actions={actions}
          totalPages={totalPages}
          itemsPerPage={params.itemsPerPage}
          page={params.page}
          totalItems={fields.length}
          onChangePage={(data) => {
            setParams((prev) => ({
              ...prev,
              page: data,
            }));
          }}
        />
      )}
      {openModalStore && (
        <ModalStore
          open={openModalStore}
          handleAddStore={handleAddStore}
          onClose={() => setOpenModalStore(false)}
          defaultDataSelect={fields}></ModalStore>
      )}
    </Fragment>
  );
};
export default StoreTable;
