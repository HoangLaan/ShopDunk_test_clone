import React, { useState, useMemo } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ICON_COMMON from 'utils/icons.common';
import PropTypes from 'prop-types';
import PromotionPaymentModal from 'pages/Promotions/components/modal/PromotionPaymentModal';
import { PAYMENTFORM_TYPE_OPTIONS } from 'pages/PaymentForm/utils/constants';
import BWAccordion from 'components/shared/BWAccordion';

const PromotionsPaymentApply = ({ loading, title, disabled }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(undefined);

  const columns = useMemo(
    () => [
      {
        header: 'Mã hình thức thanh toán',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.payment_form_code}</b>,
      },
      {
        header: 'Tên hình thức thanh toán',
        formatter: (p) => <b>{p?.payment_form_name}</b>,
      },
      {
        header: 'Loại',
        classNameHeader: 'bw_text_left',
        classNameBody: 'bw_text_left',
        formatter: (item) => PAYMENTFORM_TYPE_OPTIONS.find((x) => x.value === item.payment_type)?.label,
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Áp dụng tất cả miền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',

        formatter: (p) =>
          p?.is_all_business ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Áp dụng tất cả cửa hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',

        formatter: (p) =>
          p?.is_all_store ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn hình thức thanh toán',
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
            showConfirmModal([`Xoá ${value?.payment_form_name} ra khỏi hình thức thanh toán áp dụng ?`], () => {
              const payment_form_list = _.cloneDeep(methods.watch('payment_form_list'));
              methods.setValue(
                'payment_form_list',
                payment_form_list.filter((o) => parseInt(o?.payment_form_id) !== parseInt(value?.payment_form_id)),
              );
              return;
            }),
          );
        },
      },
    ];
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_frm_box'>
        <div className='bw_col_12'>
          <label className='bw_checkbox bw_col_12'>
            <FormInput disabled={disabled} type='checkbox' field='is_all_payment_form' />
            <span />
            Áp dụng với tất cả hình thức thanh toán
          </label>
        </div>
        {!Boolean(methods.watch('is_all_payment_form')) && (
          <DataTable
            hiddenActionRow
            noPaging
            noSelect
            loading={loading}
            data={methods.watch('payment_form_list')}
            columns={columns}
            actions={actions}
          />
        )}

        {modalOpen && (
          <PromotionPaymentModal
            open={modalOpen}
            columns={columns}
            onClose={() => {
              methods.unregister('keyword');
              setModalOpen(false);
            }}
          />
        )}
      </div>
    </BWAccordion>)
};

PromotionsPaymentApply.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default PromotionsPaymentApply;
