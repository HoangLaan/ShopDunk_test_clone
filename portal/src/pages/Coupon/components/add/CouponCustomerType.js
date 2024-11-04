import React, { useState, useMemo, useEffect } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { COUPON_PERMISSION } from 'pages/Coupon/utils/constants';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import { defineCustomerType } from 'pages/CustomerType/components/contain';
import CouponCustomerTypeModal from './modal/CouponCustomerTypeModal';
import ICON_COMMON from 'utils/icons.common';
import PropTypes from 'prop-types';

const CouponCustomerType = ({ loading, title, disabled }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const dispatch = useDispatch();
  const [modalCustomerType, setModalCustomerType] = useState(undefined);

  useEffect(() => {
    methods.clearErrors('check_customer_type');
    if (watch('is_all_customer_type') || watch('customer_type_list')?.length > 0) {
      methods.unregister('check_customer_type', {});
    } else {
      methods.register('check_customer_type', { required: 'Hạng khách áp dụng là bắt buộc' });
    }
  }, [watch('is_all_customer_type'), watch('customer_type_list')]);

  const columns = useMemo(
    () => [
      {
        header: 'Tên hạng khách hàng',
        accessor: 'customer_type_name',
        classNameHeader: ' bw_text_center',
      },
      {
        header: 'Loại',
        accessor: 'type_customer',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (p) => (
          <span class='bw_label_outline bw_label_outline_success text-center'>
            {defineCustomerType[p?.type_customer]?.label}
          </span>
        ),
      },
      // {
      //   header: 'Công ty áp dụng',
      //   accessor: 'company_name',
      // },
      {
        header: 'Miền áp dụng',
        accessor: 'business_name',
        classNameHeader: ' bw_text_center',
        formatter: (p) => (p?.business_id == -1 ? 'Tất cả' : p?.business_name),
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
        content: 'Thêm mới hạng khách hàng',
        permission: 'CRM_CUSTOMERTYPE_ADD',
        onClick: () => window._$g.rdr(`/customer-type/add`),
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn hạng khách hàng',
        permission: COUPON_PERMISSION.SELECT_CUSTOMER_TYPE,
        hidden: disabled,
        onClick: () => {
          setModalCustomerType(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        permission: COUPON_PERMISSION.SELECT_CUSTOMER_TYPE,
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.customer_type_name} ra khỏi danh sách khách hàng áp dụng ?`], () => {
              const customer_type_list = _.cloneDeep(methods.watch('customer_type_list'));
              methods.setValue(
                'customer_type_list',
                customer_type_list.filter((o) => parseInt(o?.customer_type_id) !== parseInt(value?.customer_type_id)),
              );
              return;
            }),
          );
        },
      },
    ];
  }, []);

  const styleAction = { gap: '15px' };

  return (
    <React.Fragment>
      <BWAccordion title={title}>
        <div className='bw_frm_box'>
          <div className='bw_col_12'>
            <div className='bw_col_12'>
              <label className='bw_checkbox bw_col_12'>
                <FormInput disabled={disabled} type='checkbox' field='is_all_customer_type' />
                <span />
                Áp dụng tất cả các hạng khách hàng
              </label>
            </div>
            {!Boolean(methods.watch('is_all_customer_type')) && (
              <DataTable
                hiddenActionRow
                noPaging
                noSelect
                loading={loading}
                data={methods.watch('customer_type_list')}
                columns={columns}
                actions={actions}
                styleAction={styleAction}
              />
            )}
            <FormInput hidden={true} disabled={disabled} type='text' field='check_customer_type' />
          </div>
        </div>
      </BWAccordion>
      {modalCustomerType && (
        <CouponCustomerTypeModal
          open={modalCustomerType}
          onClose={() => {
            methods.unregister('keyword');
            setModalCustomerType(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

CouponCustomerType.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CouponCustomerType;
