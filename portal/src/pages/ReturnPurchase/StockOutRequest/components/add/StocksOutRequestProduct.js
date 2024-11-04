import React, { useEffect } from 'react';
import { showToast } from 'utils/helpers';
import { FormProvider, useFormContext } from 'react-hook-form';
import BWAccordion from 'components/shared/BWAccordion/index';
import { Empty } from 'antd';
import { getProductByImei } from 'services/stocks-out-request.service';
import { getErrorMessage } from 'utils';
import ProductRow from './product-handle/ProductRow';

const StocksOutRequestProduct = ({ disabled, isTransferDiffBusiness, stocks_out_request_id, title, productList }) => {
  const methods = useFormContext();

  useEffect(() => {
    if (Object.values(productList).length > 0) {
      methods.setValue('product_list', productList);
    }
  }, [productList]);

  const { watch, setValue } = methods;
  const product_list = methods.watch('product_list')
    ? Object.values(methods.watch('product_list')).filter((item) => item.imei)
    : [];

  const handleInputProduct = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      getProductByImei({
        keyword: e.target.value,
        stocks_id: watch('from_stocks_id'),
        stocks_out_request_id: watch('stocks_out_request_id'),
        itemsPerPage: 5,
        currentPage: 1,
      })
        .then((res) => {
          if (res.length) {
            const productSelected = res[0];
            for (let i = 0; i < product_list.length; i++) {
              const field = `product_list.${product_list[i]?.keyObject}`;
              if (
                productSelected.product_id === product_list[i].product_id &&
                parseInt(watch(`${field}.quantity`)) > (watch(`${field}.list_imei`)?.length || 0)
              ) {
                const currentState = watch(`product_list.${product_list[i]?.keyObject}.list_imei`) || [];
                setValue(`${field}.list_imei`, [...currentState, productSelected]);
              } else if (
                productSelected.product_id === product_list[i].product_id &&
                parseInt(watch(`${field}.quantity`)) === (watch(`${field}.list_imei`)?.length || 0)
              ) {
                showToast.warning(`Sản phẩm ${product_list[i]?.label} đã đủ số lượng imei`);
              }
            }
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

  return (
    <BWAccordion title={title}>
      {/* {!disabled ? (
        <div className='bw_row bw_align_items_center' disabled={!methods.watch('from_stocks_id')}>
          <div className='bw_col_4'>
            <input type='text' placeholder='Nhập mã barcode' className='bw_inp' onKeyDown={handleInputProduct} />
          </div>
        </div>
      ) : null} */}
      <table
        className='bw_table'
        style={{ display: product_list?.length ? 'block' : 'table', borderRadius: '0px', marginTop: '2px' }}>
        <thead>
          <tr>
            <th className='bw_sticky bw_check_sticky bw_text_center'>STT</th>
            <th className='bw_text_center'>Mã SP</th>
            <th className='bw_text_center'>Tên hàng hóa/quy cách</th>
            <th className='bw_text_center'>IMEI</th>
            <th className='bw_text_center'>TK công nợ</th>
            <th className='bw_text_center'>TK Kho</th>
            <th className='bw_text_center'>ĐVT</th>
            <th className='bw_text_center'>Số lượng</th>
            {/* <th className='bw_hiden'>Đơn giá vốn</th>
            <th className='bw_hiden'>Thành tiền giá vốn</th>
            {isTransferDiffBusiness ? (
              <>
                <th className='bw_text_center'>Đơn giá nhập</th>
                <th className='bw_text_center'>Thành tiền</th>
              </>
            ) : (
              <></>
            )} */}
            <th className='bw_text_center'>Ghi chú</th>
            {!disabled && <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {product_list.length ? (
            <FormProvider {...methods}>
              {product_list.map((p, index) => (
                <ProductRow
                  isTransferDiffBusiness={isTransferDiffBusiness}
                  disabled={disabled}
                  keyProduct={p?.keyObject}
                  indexProduct={index}
                  isAddPage={!stocks_out_request_id}
                />
              ))}
            </FormProvider>
          ) : (
            <tr>
              <td colSpan={10}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* {!disabled && (
        <div
          onClick={() => {
            if (!methods.watch('from_stocks_id')) {
              showToast.warn('Vui lòng chọn kho xuất');
              return;
            }
            const key = String(Date.now().toString(36));
            const _ = {
              ...(methods.watch('product_list') || []),
              [key]: {
                keyObject: key,
              },
            };
            methods.setValue('product_list', _);
          }}
          className='bw_btn_outline bw_btn_outline_success bw_add_us'>
          <span className='fi fi-rr-plus'></span> Thêm
        </div>
      )} */}
    </BWAccordion>
  );
};

export default StocksOutRequestProduct;
