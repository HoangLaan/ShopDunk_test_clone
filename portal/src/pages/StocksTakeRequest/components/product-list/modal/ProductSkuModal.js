import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';
import moment from 'moment';

import { showToast } from 'utils/helpers';
import { getBase64 } from 'utils/helpers';
import { showConfirmModal } from 'actions/global';
import { STOCKS_TAKE_REQUEST_PERMISSION } from 'pages/StocksTakeRequest/utils/constants';

import DataTable from 'components/shared/DataTable/index';
import BWButton from 'components/shared/BWButton/index';

const TextArea = styled.textarea`
  width: 100%;
  height: 140px;
  border: 0.1px solid #ccc;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 12px;
  border-radius: 5px;
  font-family: Roboto;
`;

const ProductSkuModal = ({ open, onClose, field, is_take_inventory, actual_inventory }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { fields, append, update, remove } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: field, // unique name for your Field Array
  });

  const { productList } = useSelector((state) => state.stocksTakeRequest);
  const { items, totalItems, page, totalPages, itemsPerPage } = productList;

  const actions = [
    {
      hidden: is_take_inventory,
      icon: 'fi fi-rr-trash',
      color: 'red',
      onClick: (_, index) => {
        dispatch(
          showConfirmModal(
            ['Bạn muốn xoá?'],
            async () => {
              remove(index);
            },
            'Đồng ý',
          ),
        );
      },
      permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
    },
  ];
  const columns = [
    {
      header: 'Mã imei',
      accessor: 'product_imei_code',
    },
    {
      header: 'Ngày nhập/Quét mã',
      formatter: (p) => {
        return moment(p?.execution_time).format('HH:mm DD/MM/YYYY');
      },
    },
    {
      header: 'Ghi chú',
      formatter: (_, index) => (
        <TextArea
          style={{
            height: '50px',
          }}
          disabled={is_take_inventory}
          onChange={(p) => {
            update(index, {
              ...fields[index],
              note: p.target.value,
            });
          }}>
          {fields[index]?.note}
        </TextArea>
      ),
    },
    {
      header: 'Ảnh đính kèm',
      classNameBody: 'bw_text_center',
      formatter: (_, index) => (
        <React.Fragment>
          <div className='bw_load_image bw_mb_2 bw_text_center'>
            <label
              style={{
                width: '50px',
                height: '50px',
              }}
              className='bw_choose_image'>
              <input
                //disabled={disabled}
                accept='image/*'
                type='file'
                onChange={async (_) => {
                  const getFile = await getBase64(_.target.files[0]);
                  update(index, {
                    ...fields[index],
                    url_image: getFile,
                  });
                }}
              />
              {fields[index]?.url_image ? (
                <img alt='logo' style={{ width: '100%' }} src={fields[index]?.url_image ?? ''}></img>
              ) : (
                <span
                  style={{
                    fontSize: '19px',
                  }}
                  className='fi fi-rr-picture'
                />
              )}
            </label>
          </div>
        </React.Fragment>
      ),
    },
  ];

  const updateSku = () => {
    const value = document.getElementById('imei_sku_take_in').value.trim();
    try {
      if (actual_inventory <= fields.length) {
        throw Error('Số lượng imei đã bằng với số lượng thực tế!!!');
      }

      if (Boolean(value === '')) {
        throw Error('Vui lòng nhập imei hợp lệ!!!');
      }
      const findImeiCode = (fields ?? []).find((o) => o?.product_imei_code === value);
      if (findImeiCode) {
        throw Error('Imei này đã được nhập');
      } else {
        append({
          product_imei_code: value,
          execution_time: moment(new Date()).valueOf(),
          note: '',
          url_image: '',
          available_in_stock: 1,
        });
        document.getElementById('imei_sku_take_in').value = '';
      }
    } catch (error) {
      showToast.error(error?.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  return (
    <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`}>
      <div className='bw_modal_container bw_w800'>
        <div className='bw_title_modal'>
          <h3>{is_take_inventory ? 'Xem' : 'Thêm'} mã Imei</h3>
          <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal'></span>
        </div>
        {!is_take_inventory && (
          <>
            <div
              style={{
                border: '0.1px solid #ccc',
                borderRadius: '6px',
                marginBottom: '3px',
              }}
              className='bw_col_12'>
              <input
                onKeyDown={(event) => {
                  if (1 * event.keyCode === 13) {
                    event.preventDefault();
                    updateSku();
                  }
                }}
                id='imei_sku_take_in'
                className='bw_col_12'
                style={{
                  width: '100%',
                  border: 'none',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  fontSize: '19px',
                  outline: 'none',
                }}
                placeholder='Nhập mã Imei'></input>
            </div>
            <div
              style={{
                marginTop: '10px',
              }}>
              <BWButton
                style={{
                  marginRight: '6px',
                }}
                onClick={() => {
                  updateSku();
                }}
                icon='fi fi-rr-plus'
                type='success'
                content='Nhập imei'
              />
              <BWButton icon='fi fi-rr-camera' outline type='success' content='Quét Barcode' />
            </div>
          </>
        )}
        <div className='bw_box_card bw_mt_1'>
          <DataTable
            noSelect
            noPaging
            fieldCheck='product_imei_code'
            columns={columns}
            actions={actions}
            data={fields ?? []}
            totalItems={totalItems}
            page={page}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
};
export default ProductSkuModal;
