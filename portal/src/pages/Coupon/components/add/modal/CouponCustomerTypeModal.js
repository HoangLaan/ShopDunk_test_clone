import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable from 'components/shared/DataTable';

import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';

import { useDispatch, useSelector } from 'react-redux';
import { getCustomerType } from 'pages/Coupon/actions/actions';
import { useFormContext } from 'react-hook-form';

import CustomerTypeFilter from 'pages/CustomerType/components/CustomerTypeFilter';
import { defineCustomerType } from 'pages/CustomerType/components/contain';

const CouponCustomerTypeModal = ({ open, onClose }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const { customerTypeList, customerTypeLoading } = useSelector((state) => state.coupon);
  const { items, itemsPerPage, page, totalItems, totalPages } = customerTypeList;
  const loading = customerTypeLoading;

  const loadCustomerType = useCallback(() => {
    dispatch(getCustomerType(params));
  }, [dispatch, params]);
  useEffect(loadCustomerType, [loadCustomerType]);

  const columns = useMemo(
    () => [
      {
        header: 'Tên hạng khách hàng',
        accessor: 'customer_type_name',
        classNameHeader: ' bw_text_center',
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
        classNameHeader: ' bw_text_center',
      },

      {
        header: 'Loại khách hàng',
        accessor: 'type_customer',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (p) => (
          <span class='bw_label_outline bw_label_outline_success text-center'>
            {defineCustomerType[p?.type_customer]?.label}
          </span>
        ),
      },
      {
        header: 'Miền áp dụng',
        accessor: 'business_name',
        formatter: (p) => (p?.business_id == -1 ? 'Tất cả' : p?.business_name),
      },
      {
        header: 'Người tạo',
        classNameHeader: ' bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '47rem',
    marginLeft: '-20px',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        styleModal={styleModal}
        // headerStyles={headerStyles}
        closeModal={closeModal}
        header='Danh sách hạng khách hàng'
        open={open}
        onClose={onClose}
        footer={
          <BWButton
            type='success'
            outline
            content={'Xác nhận'}
            onClick={() => {
              document.getElementById('trigger-delete').click();
              onClose();
            }}
          />
        }>
        <CustomerTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='customer_type_id'
          defaultDataSelect={methods.watch('customer_type_list')}
          loading={loading}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            methods.setValue('customer_type_list', e);
          }}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
        />
      </Modal>
    </React.Fragment>
  );
};

export default CouponCustomerTypeModal;
