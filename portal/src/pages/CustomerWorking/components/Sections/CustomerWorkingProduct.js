import React from 'react';
import { useFormContext } from 'react-hook-form';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/Orders/helpers/msgError';
import { useDispatch } from 'react-redux';
import { formatPrice } from 'utils/index';
import { useState } from 'react';
import ProductModel from '../ProductModel/ProductModel';

const CustomerWorkingProduct = ({ disabled }) => {
  const dispatch = useDispatch();
  const methods = useFormContext({});
  const {
    formState: { errors },
  } = methods;

  const [isModelProduct, setIsModelProduct] = useState(false);

  const handleSelect = (key, values = {}) => {
    let data_format = Object.values(values).reduce((a, v) => ({ ...a, [v.product_id]: { ...v } }), {});

    methods.setValue(`${key}`, data_format);
    setIsModelProduct(false);
  };

  const handleDelete = (imei_code) => {
    const _product = methods.watch('products');
    if (imei_code) {
      delete _product[imei_code];
      methods.setValue('products', _product);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center bw_w1',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
      },
      {
        header: 'Mã sản phẩm',
        classNameHeader: 'bw_text_center',
        accessor: 'product_code',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      },
      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        accessor: 'product_name',
      },
      {
        header: 'Loại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'product_type',
        formatter: (p) => {
          if (p?.product_type === 2) {
            return <span className='bw_label bw_label_success'>Linh kiện</span>;
          } else {
            return <span className='bw_label bw_label_danger'>Sản phẩm</span>;
          }
        },
      },
      {
        header: 'ĐVT',
        classNameHeader: 'bw_text_center',
        accessor: 'unit_name',
      },
      {
        header: 'Đơn giá bán (Đã gồm VAT)',
        classNameHeader: 'bw_text_center',
        accessor: 'price',
        formatter: (p) => <span>{formatPrice(p?.price, true, ',')}</span>,
      },
      {
        header: 'Ghi chú',
        classNameHeader: 'bw_text_center',
        accessor: 'note',
        formatter: (p, idx) => (
          <input type='text' disabled={disabled} value={p?.note} className='bw_inp bw_mw_2' placeholder='Ghi chú' />
        ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: ['SL_WORKING_ADD', 'SL_WORKING_EDIT'],
        disabled: disabled ? disabled : false,
        onClick: (p) =>
          !disabled
            ? dispatch(
                showConfirmModal(msgError['model_error'], async () => {
                  handleDelete(p?.product_id);
                }),
              )
            : null,
      },
    ];
  }, []);

  return (
    <BWAccordion title='Thông tin sản phẩm' id='bw_info_cus' isRequired>
      {!disabled ? (
        <div className='bw_row bw_align_items_center'>
          <div className='bw_col_4'></div>
          <div className='bw_col_8' style={{ flexWrap: 'nowrap' }}>
            <div className='bw_btn_group bw_btn_grp bw_flex bw_align_items_center bw_justify_content_right'>
              <a
                className='bw_btn bw_btn_success bw_open_modal'
                onClick={() => {
                  setIsModelProduct(true);
                }}>
                <span className='fi fi-rr-plus'></span> Chọn sản phẩm
              </a>
            </div>
          </div>
        </div>
      ) : null}
      {errors['products'] ? <span className='bw_red'>Sản phẩm bán là bắt buộc.</span> : null}
      <DataTable
        columns={columns}
        data={methods.watch('products') ? Object.values(methods.watch('products')) : []}
        actions={actions}
        noPaging={true}
        noSelect={true}
      />

      {isModelProduct ? (
        <ProductModel
          open={isModelProduct}
          onClose={() => setIsModelProduct(false)}
          onConfirm={handleSelect}
          selected={methods.watch('products') || {}}
        />
      ) : null}
    </BWAccordion>
  );
};

export default CustomerWorkingProduct;
