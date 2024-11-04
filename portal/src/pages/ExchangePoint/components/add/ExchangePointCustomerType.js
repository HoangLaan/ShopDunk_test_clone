import React, { useState, useMemo, useEffect } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ICON_COMMON from 'utils/icons.common';
import PropTypes from 'prop-types';
import CustomerTypeModal from '../Modal/CustomerTypeModal';
import AddCustomerTypeModal from '../Modal/AddCustomerTypeModal';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';

const ExchangePointCustomerType = ({ loading, title, disabled }) => {
  const { watch, unregister, setValue, register, getFieldState, formState, clearErrors } = useFormContext();
  const dispatch = useDispatch();
  const [openModalCustomerTypeAdd, setOpenModalCustomerTypeAdd] = useState(false);
  const [openModalCustomerType, setOpenModalCustomerType] = useState(false);
  const { error } = getFieldState('list_customer_type', formState);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên loại khách hàng',
        accessor: 'customer_type_name',
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
      },
      {
        header: 'Chi nhánh áp dụng',
        accessor: 'business_name',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
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
        content: 'Thêm loại khách hàng',
        hidden: disabled,
        onClick: () => {
          setOpenModalCustomerTypeAdd(true);
        },
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn loại khách hàng',
        hidden: disabled,
        onClick: () => {
          setOpenModalCustomerType(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.customer_type_name} ra khỏi danh sách hạng khách hàng áp dụng ?`], () => {
              const list_customer_type = _.cloneDeep(watch('list_customer_type'));
              setValue(
                'list_customer_type',
                list_customer_type.filter((o) => parseInt(o?.customer_type_id) !== parseInt(value?.customer_type_id)),
              );
              return;
            }),
          );
        },
      },
    ];
  }, []);

  useEffect(() => {
    register('list_customer_type', {
      required: watch('is_all_member_type') ? false : 'Loại khách hàng bắt buộc',
    });
  }, [watch('is_all_member_type')]);

  const handleChangeAll = (e) => {
    clearErrors('is_all_member_type');
    setValue('is_all_member_type', e.target.checked ? 1 : 0);
    setValue('list_customer_type', []);
  };

  return (
    <React.Fragment>
      <div className='bw_frm_box'>
        <div className='bw_col_12'>
          <div className='bw_col_12'>
            <label className='bw_checkbox bw_col_12'>
              <FormInput
                disabled={disabled}
                type='checkbox'
                field='is_all_member_type'
                onChange={(e) => handleChangeAll(e)}
              />
              <span />
              Áp dụng với tất cả hạng khách hàng
            </label>
          </div>
          {!Boolean(watch('is_all_member_type')) && (
            <DataTable
              hiddenActionRow
              noPaging
              noSelect
              loading={loading}
              data={watch('list_customer_type')}
              columns={columns}
              actions={actions}
              title={error && <ErrorMessage message={error?.message} />}
            />
          )}
        </div>
      </div>
      {openModalCustomerType && (
        <CustomerTypeModal
          open={openModalCustomerType}
          onClose={() => {
            unregister('keyword');
            setOpenModalCustomerType(false);
          }}
        />
      )}
      {openModalCustomerTypeAdd && (
        <AddCustomerTypeModal open={openModalCustomerTypeAdd} onClose={() => setOpenModalCustomerTypeAdd(false)} />
      )}
    </React.Fragment>
  );
};

ExchangePointCustomerType.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ExchangePointCustomerType;
