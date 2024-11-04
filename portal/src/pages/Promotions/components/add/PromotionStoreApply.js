import React, { useState, useMemo } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ICON_COMMON from 'utils/icons.common';
import PropTypes from 'prop-types';
import PromotionStoreModal from '../modal/PromotionStoreModal';

const PromotionStoreApply = ({ loading, disabled, isShowTitle = true }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(undefined);

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
        header: 'Địa chỉ',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.address}</span>,
      },
      {
        header: 'Miền',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <span>{p?.area_name}</span>,
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
        hidden: !isShowTitle,
      },
    ],
    [isShowTitle],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn cửa hàng',
        permission: 'PROMOTION_ADD',
        hidden: disabled,
        onClick: () => {
          setModalOpen(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        permission: 'PROMOTION_ADD',
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.store_name} ra khỏi danh sách khách hàng áp dụng ?`], () => {
              let list_apply_store = _.cloneDeep(methods.watch('list_apply_store'));
              list_apply_store = list_apply_store ? list_apply_store : _.cloneDeep(methods.watch('store_apply_list'));
              methods.setValue(
                'list_apply_store',
                list_apply_store.filter((o) => parseInt(o?.store_id) !== parseInt(value?.store_id)),
              );
              methods.setValue(
                'store_apply_list',
                list_apply_store.filter((o) => parseInt(o?.store_id) !== parseInt(value?.store_id)),
              );
              return;
            }),
          );
        },
      },
    ];
  }, [isShowTitle, disabled, methods, dispatch]);

  const title = (
    <div className='bw_count_cus'>Tổng số cửa hàng đã chọn: {methods.watch('store_apply_list')?.length ?? 0}</div>
  );

  return (
    <div className='bw_frm_box'>
      <div className='bw_col_12'>
        {isShowTitle && (
          <div className='bw_collapse_title bw_ml_2 bw_mb_1'>
            <h3>
              Cửa hàng áp dụng <span className='bw_red'> *</span>
            </h3>
          </div>
        )}
        <label className='bw_checkbox bw_col_12'>
          <FormInput disabled={disabled} type='checkbox' field='is_apply_all_store' />
          <span />
          Áp dụng cho tất cả cửa hàng
        </label>
      </div>
      {!Boolean(methods.watch('is_apply_all_store')) && (
        <DataTable
          hiddenActionRow
          noPaging
          noSelect
          loading={loading}
          data={methods.watch('store_apply_list')}
          columns={columns}
          actions={actions}
          title={title}
        />
      )}
      <FormInput
        hidden={true}
        disabled={disabled}
        type='text'
        field='check_store'
        style={{ lineHeight: 1, display: 'none' }}
        validation={{
          validate: (value) => {
            if (!watch('is_apply_all_store') && !watch('store_apply_list')?.length) {
              return 'Cửa hàng áp dụng là bắt buộc';
            }

            return true;
          },
        }}
      />
      {modalOpen && (
        <PromotionStoreModal
          open={modalOpen}
          columns={columns}
          onClose={() => {
            methods.unregister('keyword');
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

PromotionStoreApply.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default PromotionStoreApply;
