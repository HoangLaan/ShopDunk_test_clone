import { showConfirmModal } from 'actions/global';
import CheckAccess from 'navigation/CheckAccess';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { msgError } from 'pages/StocksTransfer/helpers/msgError';
import ProductModel from '../ProductModal/ProductModal';
import { notification } from 'antd';
import { useFormContext } from 'react-hook-form';
import BWAccordion from 'components/shared/BWAccordion/index';
import ModalmportExcel from '../ModalmportExcel/ModalmportExcel';
import ModalImei from '../ModalIMEI/ModalImei';
import { formatQuantity } from 'utils/number';
import { getProductTransferByImei } from 'pages/StocksTransfer/helpers/call-api';
import { showToast } from 'utils/helpers';
import { getErrorMessage } from 'utils';
import { TRANSFER_TYPE } from 'pages/StocksTransfer/helpers/const';

const StocksTransferProduct = ({ disabled }) => {
  const methods = useFormContext();

  const {
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const [isModelProduct, setIsModelProduct] = useState(false);
  const [isImportExcel, setIsImportExcel] = useState(false);
  const [page, setpage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalItems, setTotalItem] = useState(0);
  const [isOpenImei, setIsOpenImei] = useState();
  const [imeiIndex, setImeiIndex] = useState(0);

  const handleSelect = (key, values = {}) => {
    setValue(`${key}`, values);
    setIsModelProduct(false);

    setTotalItem(Object.values(watch('product_transfer')).length);
    setTotalPages(Math.ceil(Object.values(watch('product_transfer')).length / itemsPerPage));
  };

  const dispatch = useDispatch();

  const handleDelete = (key = '', keyValue = '') => {
    let _ojectValue = watch(`${key}`);

    if (_ojectValue[`${keyValue}`]) {
      delete _ojectValue[`${keyValue}`];
    }

    setValue(`${key}`, _ojectValue);

    setTotalItem(Object.values(_ojectValue).length);
    setTotalPages(Math.ceil(Object.values(_ojectValue).length / itemsPerPage));
  };

  const handleCheckStocks = (key) => {
    if (!watch('stocks_export_id')) {
      showToast.error('Vui lòng chọn kho chuyển.');
      return;
    }
    if (key === 'Excel') {
      setIsImportExcel(true);
    } else {
      setIsModelProduct(true);
    }
  };

  const handleImportExcel = (value) => {
    methods.setValue('product_transfer', value);
    setIsImportExcel(false);
  };

  const handleInputProduct = (e) => {
    if (e.keyCode === 13) {
      if (!watch('stocks_export_id')) {
        showToast.error('Vui lòng chọn kho chuyển.');
        return;
      }
      e.preventDefault();
      getProductTransferByImei({
        imei: e.target.value,
        stock_id: watch('stocks_export_id'),
      })
        .then((res) => {
          if (res.imei) {
            let productList = watch('product_transfer');
            let item = { ...productList, [e.target.value]: res };
            setValue('product_transfer', item);
          }
        })
        .catch((err) => {
          showToast.error(
            getErrorMessage({
              message: err.message || 'Lỗi khi tìm sản phẩm',
            }),
          );
        })
        .finally(() => {
          e.target.value = '';
        });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
      },
      {
        header: 'Mã sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <p>{p?.product_code}</p>,
      },
      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.product_name}</b>,
      },
      {
        header: 'IMEI',
        classNameHeader: 'bw_text_center',
        // formatter: (p) => <b>{p?.imei}</b>,
        formatter: (p, index) => {
          return (
            <a
              data-href
              className='bw_btn_outline bw_btn_add_imei'
              onClick={(e) => {
                e.preventDefault();
                setValue(`imeis.${index}`, p.imei);
                setImeiIndex(index);
                setIsOpenImei(true);
              }}>
              <span className='fi fi-rr-barcode' />
            </a>
          );
        },
      },
      {
        header: 'ĐVT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <b>{p?.unit_name}</b>,
      },
      {
        header: 'SL',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <b>{p?.quantity}</b>,
      },
      {
        header: 'Đơn giá nhập',
        hidden: !watch('hidden_price'),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
            <span className='bw_red'>{formatQuantity(p?.price)}</span>
          </div>
        ),
      },
      {
        header: 'Thành tiền',
        hidden: !watch('hidden_price'),
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
            <span className='bw_red'>{formatQuantity((p?.price ?? 0) * (p?.quantity ?? 0))}</span>
          </div>
        ),
      },
    ],
    [watch('hidden_price')],
  );

  const renderData = useCallback(
    (valueRender, keyRender) => (
      <tr>
        {columns
          ?.filter((_) => !_.hidden)
          ?.map((column, key) => {
            if (column.formatter) {
              return (
                <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                  {column?.formatter(valueRender, keyRender)}
                </td>
              );
            } else if (column.accessor) {
              return (
                <td className={column?.classNameBody} key={`${keyRender}${key}`}>
                  {valueRender[column.accessor]}
                </td>
              );
            } else {
              return <td className={column?.classNameBody} key={`${keyRender}${key}`}></td>;
            }
          })}

        <td className='bw_sticky bw_action_table bw_text_center'>
          <CheckAccess permission={'ST_STOCKSTRANSFER_EDIT'}>
            <a
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  dispatch(
                    showConfirmModal(msgError['model_error'], async () => {
                      handleDelete('product_transfer', valueRender?.imei);
                    }),
                  );
                }
              }}
              style={{
                marginRight: '2px',
              }}
              className={`bw_btn_table bw_red`}>
              <i className={`fi fi-rr-trash`}></i>
            </a>
          </CheckAccess>
        </td>
      </tr>
    ),
    [columns],
  );
  return (
    <React.Fragment>
      <BWAccordion title='Sản phẩm chuyển kho' id='bw_account_cus' isRequired={true}>
        {!disabled ? (
          <div className='bw_row bw_align_items_center'>
            <div className='bw_col_4'>
              <input type='text' placeholder='Nhập mã barcode' className='bw_inp' onKeyDown={handleInputProduct} />
            </div>
            <div className='bw_col_8' style={{ flexWrap: 'nowrap' }}>
              <div className='bw_btn_group bw_btn_grp bw_flex bw_align_items_center bw_justify_content_right'>
                <a
                  className='bw_btn_outline bw_btn_outline_success bw_open_modal'
                  onClick={() => handleCheckStocks('Excel')}>
                  <span className='fi fi-rr-inbox-in'></span> Import
                </a>
                <a className='bw_btn bw_btn_success bw_open_modal' onClick={() => handleCheckStocks()}>
                  <span className='fi fi-rr-plus'></span> Thêm
                </a>
              </div>
            </div>
          </div>
        ) : null}

        <div className='bw_table_responsive bw_mt_2'>
          {errors['product_transfer'] ? <span className='bw_red'>Sản phẩm chuyển kho là bắt buộc.</span> : null}

          <table className='bw_table bw_mt_1'>
            <thead>
              {columns
                ?.filter((_) => !_.hidden)
                ?.map((p, idx) => (
                  <th key={idx} className={p?.classNameHeader}>
                    {p?.header}
                  </th>
                ))}
              <th className='bw_sticky bw_action_table bw_text_center' style={{ width: '10%' }}>
                Thao tác
              </th>
            </thead>

            <tbody>
              {watch('product_transfer') && Object.values(watch('product_transfer')).length ? (
                Object.values(watch('product_transfer'))?.map((value, key) => {
                  return Math.ceil((key + 1) / itemsPerPage) == page ? renderData(value, key) : null;
                })
              ) : (
                <tr>
                  <td colSpan={10} className='bw_text_center'>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {watch('product_transfer') && Object.values(watch('product_transfer')).length > itemsPerPage ? (
          <div className='bw_row bw_mt_2 bw_show_table_page'>
            <div className='bw_col_6'>
              <p>
                Show {totalItems < 15 ? totalItems : itemsPerPage}/{totalItems} records
              </p>
            </div>

            <div className='bw_col_6 bw_flex bw_justify_content_right bw_align_items_center'>
              <div className='bw_nav_table'>
                <button
                  disabled={!(Boolean(page) && parseInt(page) !== 1)}
                  onClick={() => {
                    setpage(parseInt(page) - 1);
                  }}
                  className={Boolean(page) && parseInt(page) !== 1 && 'bw_active'}>
                  <span className='fi fi-rr-angle-small-left'></span>
                </button>
                <input type='number' value={parseInt(page)} step='1' max={totalPages} />
                <span className='bw_all_page'>/ {totalPages}</span>
                <button
                  disabled={parseInt(totalPages) === parseInt(page)}
                  onClick={() => {
                    setpage(parseInt(page) + 1);
                  }}
                  className={!(parseInt(totalPages) === parseInt(page)) && 'bw_active'}>
                  <span className='fi fi-rr-angle-small-right'></span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </BWAccordion>

      {isModelProduct ? (
        <ProductModel
          open={isModelProduct}
          onConfirm={handleSelect}
          onClose={() => setIsModelProduct(false)}
          header={'Chọn sản phẩm chuyển kho'}
          footer={'Chọn sản phẩm'}
          selected={watch('product_transfer') || {}}
          stockId={watch('stocks_export_id') || null}
        />
      ) : null}

      {/* show model import xcel */}
      {isImportExcel ? (
        <ModalmportExcel
          open={isImportExcel}
          onConfirm={handleImportExcel}
          onClose={() => setIsImportExcel(false)}
          stockId={watch('stocks_export_id') || null}
        />
      ) : null}

      {/* Model Imei */}
      {isOpenImei && (
        <ModalImei
          data={
            Array.isArray(watch(`imeis.${imeiIndex}`)) ? watch(`imeis.${imeiIndex}`) : [watch(`imeis.${imeiIndex}`)]
          }
          open={isOpenImei}
          onClose={() => {
            setIsOpenImei(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default StocksTransferProduct;
