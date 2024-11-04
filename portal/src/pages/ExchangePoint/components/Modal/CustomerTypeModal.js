import React, { useState, useMemo, useCallback, useEffect } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import styled from 'styled-components';

import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';

import { useDispatch, useSelector } from 'react-redux';
import { getCustomerType } from 'pages/Coupon/actions/actions';
import { useFormContext } from 'react-hook-form';

const Label = styled.label`
  display: 'flex';
`;

const ButtonSearch = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CustomerTypeModal = ({ open, onClose }) => {
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
        header: 'Tên loại khách hàng',
        accessor: 'customer_type_name',
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
      },
      {
        header: 'Cơ sở áp dụng',
        accessor: 'business_name',
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        header='Chọn loại khách hàng'
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
        <div className='bw_search_box'>
          <div className='bw_row bw_mt_1'>
            <div className='bw_col_6'>
              <div className='bw_frm_box'>
                <Label
                  style={{
                    display: 'flex',
                  }}>
                  Từ khoá
                </Label>
                <FormInput
                  field='keyword'
                  onKeyDown={(event) => {
                    if (1 * event.keyCode === 13) {
                      event.preventDefault();
                      setParams((prev) => {
                        return {
                          ...prev,
                          keyword: methods.watch('keyword'),
                        };
                      });
                    }
                  }}
                  onChange={(e) => {
                    methods.setValue('keyword', e.target.value);
                  }}
                  placeholder='Nhập từ khoá tìm kiếm'
                />
              </div>
            </div>
            <div
              style={{
                marginTop: '54px',
              }}
              className='bw_col_6'>
              <ButtonSearch>
                <button
                  onClick={() => {
                    setParams((prev) => {
                      return {
                        ...prev,
                        keyword: methods.watch('keyword'),
                      };
                    });
                  }}
                  type='button'
                  style={{ marginRight: '10px' }}
                  className='bw_btn bw_btn_success'>
                  <span className='fi fi-rr-filter'></span> Tìm kiếm
                </button>
                <button
                  onClick={() => {
                    methods.setValue('keyword', '');
                    setParams({
                      is_active: 1,
                      page: 1,
                      itemsPerPage: 5,
                    });
                  }}
                  className='bw_btn_outline'
                  type='button'>
                  Làm mới
                </button>
              </ButtonSearch>
            </div>
          </div>
        </div>

        <DataTable
          hiddenDeleteClick
          hiddenActionRow
          fieldCheck='customer_type_id'
          defaultDataSelect={methods.watch('list_customer_type')}
          loading={loading}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            methods.clearErrors('list_customer_type');
            methods.setValue('list_customer_type', e);
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

export default CustomerTypeModal;
