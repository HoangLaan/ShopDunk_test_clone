import React, { useEffect, useState, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import { showConfirmModal } from 'actions/global';
import ICON_COMMON from 'utils/icons.common';
import { FIELD_STOCKSTAKEREQUEST, STOCKS_TAKE_REQUEST_PERMISSION } from 'pages/StocksTakeRequest/utils/constants';

import DataTable from 'components/shared/DataTable';
import StocksTakeRequestStoreModal from './StocksTakeRequestStoreModal';
import BWAccordion from 'components/shared/BWAccordion';
import StoreListDropdown from 'pages/StocksTakeRequest/components/dropdown/StoreListDropdown';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const StocksTakeRequestStore = ({ loading, disabled }) => {
  const dispatch = useDispatch();

  const methods = useFormContext();
  const { watch, unregister, register, clearErrors, setValue, getFieldState, formState, reset } = methods;
  const { fields, remove } = useFieldArray({
    control: methods.control,
    name: FIELD_STOCKSTAKEREQUEST.store_apply_list,
  });
  const [modalOpen, setModalOpen] = useState(undefined);

  const is_apply_all_store = watch('is_apply_all_store');
  const store_apply_list = useMemo(() => fields || [], [fields]);

  const { error } = getFieldState(FIELD_STOCKSTAKEREQUEST.store_apply_list, formState);

  useEffect(() => {
    methods.register(FIELD_STOCKSTAKEREQUEST.store_apply_list, {
      validate: (value) => {
        if (!value?.length) {
          return 'Vui lòng nhập ít nhất một cửa hàng';
        }
        return true;
      },
    });
  }, [methods]);

  useEffect(() => {
    clearErrors('check_store');
    if (is_apply_all_store || store_apply_list?.length > 0) {
      unregister('check_store', {});
    } else {
      register('check_store');
    }
  }, [is_apply_all_store, store_apply_list, unregister, register, clearErrors]);

  const setStockListId = useCallback(() => {
    const stockIdList = store_apply_list.reduce((acc, curr) => {
      return [...acc, ...(curr.stocks || []).map((o) => o.value)];
    }, []);

    setValue('stocks_list_id', _.uniq(stockIdList));
  }, [setValue, store_apply_list]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.store_code}</b>,
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.store_name}</b>,
      },
      {
        header: 'Kho kiểm kê',
        classNameHeader: 'bw_text_center',
        formatter: (p, index) =>
          p?.store_id && (
            <StoreListDropdown
              disabled={disabled}
              field={`${FIELD_STOCKSTAKEREQUEST.store_apply_list}.${index}.stocks`}
              store_id={p?.store_id}
              onChange={setStockListId}
            />
          ),
      },
      {
        header: 'Miền',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.business_name}</span>,
      },
      {
        header: 'Cụm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.cluster_name}</span>,
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.phone_number}</span>,
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        accessor: 'is_active',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Khóa</span>
          ),
      },
    ],
    [setStockListId, disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn cửa hàng',
        permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
        //disabled: () => disabled,
        onClick: () => {
          setModalOpen(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        disabled: () => disabled,
        permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
        onClick: (value, index) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.store_name} ra khỏi danh sách khách hàng áp dụng ?`], () => {
              remove(index);
              reset(watch());
            }),
          );
        },
      },
    ];
  }, [dispatch, disabled, remove, reset, watch]);

  const title = <div className='bw_count_cus'>Tổng số cửa hàng đã chọn: {fields?.length ?? 0}</div>;

  return (
    <BWAccordion title='Cửa hàng'>
      {error && error?.root && error.root?.message && <ErrorMessage message={error.root?.message} />}

      <DataTable
        fieldCheck='store_id'
        hiddenActionRow
        noPaging
        noSelect
        loading={loading}
        data={fields}
        columns={columns}
        actions={actions}
        title={title}
      />
      {modalOpen && (
        <StocksTakeRequestStoreModal
          open={modalOpen}
          columns={columns}
          onClose={() => {
            methods.unregister('keyword');
            setModalOpen(false);
          }}
        />
      )}
    </BWAccordion>
  );
};

StocksTakeRequestStore.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default StocksTakeRequestStore;
