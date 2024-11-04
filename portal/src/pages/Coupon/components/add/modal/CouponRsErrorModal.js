import React, { useState, useMemo, useCallback, useEffect } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import styled from 'styled-components';

import Modal from 'components/shared/Modal';
import BWButton from 'components/shared/BWButton';
import { useDispatch, useSelector } from 'react-redux';
import { getRsError } from 'pages/Coupon/actions/actions';
import { useFormContext } from 'react-hook-form';

const Label = styled.label`
  display: 'flex';
`;

const ButtonSearch = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CouponRsErrorModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const { rsErrorList, rsErrorLoading } = useSelector((state) => state.coupon);
  const { items, itemsPerPage, page, totalItems, totalPages } = rsErrorList;
  const loading = rsErrorLoading;

  const loadCoupon = useCallback(() => {
    dispatch(getRsError(params));
  }, [dispatch, params]);
  useEffect(loadCoupon, [loadCoupon]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã lỗi máy',
        accessor: 'error_code',
      },
      {
        header: 'Tên lỗi máy',
        accessor: 'error_name',
      },
      {
        header: 'Nhóm lỗi',
        accessor: 'error_group_name',
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <Modal
        witdh='50vw'
        header='Chọn lỗi máy'
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
                  Tên lỗi máy
                </Label>
                <FormInput
                  field='search'
                  onChange={(e) => {
                    methods.setValue('search', e.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (1 * event.keyCode === 13) {
                      event.preventDefault();
                      setParams((prev) => {
                        return {
                          ...prev,
                          search: methods.watch('search'),
                        };
                      });
                    }
                  }}
                  placeholder='Nhập mã, tên lỗi máy'
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
                        search: methods.watch('search'),
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
                    methods.setValue('search', '');
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
          hiddenActionRow
          hiddenDeleteClick
          fieldCheck='error_id'
          defaultDataSelect={methods.watch('error_list')}
          loading={loading}
          columns={columns}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          handleBulkAction={(e) => {
            methods.setValue('error_list', e);
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

export default CouponRsErrorModal;
