import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { showToast } from 'utils/helpers';
import { showConfirmModal } from 'actions/global';
import { executeStocksTakeRequestPeriod, getListProductInventory } from 'services/stocks-take-request.service';
import { STOCKS_TAKE_REQUEST_PERMISSION } from 'pages/StocksTakeRequest/utils/constants';

import FormNumber from 'components/shared/BWFormControl/FormNumber';
import ProductSkuModal from './modal/ProductSkuModal';
import DataTable from 'components/shared/DataTable';
import ProductListModal from './modal/ProductListModal';
import ImportProductModal from './modal/ImportProductModal';

const textInventory = {
  0: 'Không trong kho',
  1: 'Tồn kho',
};

const StocksTakeProductListTab = ({ disabled }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const is_reviewed = methods.watch('is_reviewed') === 1;
  const is_take_inventory = methods.watch('is_take_inventory');
  const is_processed = methods.watch('is_processed');
  const stocks_take_in_code = methods.watch('stocks_take_in_code');
  const stocks_take_out_code = methods.watch('stocks_take_out_code');
  const { stocks_take_request_id } = useParams();
  const [productListModal, setProductListModal] = useState(false);
  const [importExcelModal, setImportExcelModal] = useState(false);
  const [productListSkuModal, setProductListSkuModal] = useState(undefined);
  const { stocksTakeTypeList } = useSelector((state) => state.stocksTakeRequest);

  const isStockTakeImeiCode =
    (stocksTakeTypeList ?? []).find(
      (p) => parseInt(p?.stocks_take_type_id) === parseInt(methods.watch('stocks_take_type_id')),
    )?.is_stocks_take_imei_code ?? 0;

  const actions = [
    {
      globalAction: true,
      icon: 'fi fi-rr-plus',
      type: 'success',
      content: 'Thêm sản phẩm',
      //hidden: () => disabled,
      hidden: is_processed || is_take_inventory,
      onClick: () => {
        setProductListModal(true);
      },
      permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
    },
    // {
    //   globalAction: true,
    //   icon: 'fi fi-rr-upload',
    //   outline: true,
    //   color: 'blue',
    //   content: 'Import sản phẩm',
    //   hidden: is_reviewed,
    //   onClick: () => {
    //     setImportExcelModal(true);
    //   },
    // },
    {
      hidden: !isStockTakeImeiCode || is_reviewed || disabled,
      globalAction: true,
      icon: 'fi fi-rr-camera',
      color: 'green',
      content: 'Quét Barcode',
      permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-database',
      outline: true,
      type: 'success',
      hidden: !is_take_inventory || is_processed || stocks_take_in_code || stocks_take_out_code,
      content: 'Xử lí tồn kho',
      onClick: () => {
        dispatch(
          showConfirmModal(
            ['Bạn muốn xử lí tồn kho'],
            async () => {
              executeStocksTakeRequestPeriod(stocks_take_request_id)
                .then((e) => {
                  window.location.reload(true);
                })
                .catch((err) => {
                  showToast.error(err?.errors, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                  });
                });
            },
            'Đồng ý',
          ),
        );
      },
      permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
    },
    {
      globalAction: true,
      icon: 'fi fi-rr-plus',
      type: 'success',
      hidden: !is_reviewed || is_take_inventory,
      content: 'Lấy số tồn phần mềm',
      onClick: () => {
        dispatch(
          showConfirmModal(
            ['Bạn muốn lấy số lượng tồn kho'],
            async () => {
              getListProductInventory(stocks_take_request_id)
                .then((e) => {
                  methods.setValue('is_take_inventory', 1);
                  const product_list = [...methods.watch('product_list')];
                  if (isStockTakeImeiCode) {
                    methods.setValue('product_list', e?.items);
                  } else {
                    methods.setValue(
                      'product_list',
                      e?.items?.map((o) => {
                        const findIn = product_list.find(
                          (value) => String(value?.product_id) === String(o?.product_id),
                        );
                        return {
                          ...o,
                          list_imei: findIn?.list_imei,
                        };
                      }),
                    );
                  }
                })
                .catch((err) => {
                  showToast.error(err?.errors, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                  });
                });
            },
            'Đồng ý',
          ),
        );
      },
      permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
    },
    {
      icon: 'fi fi-rr-trash',
      //hidden: is_reviewed,
      color: 'red',
      hidden: () => is_take_inventory,
      onClick: (_, index) => {
        dispatch(
          showConfirmModal(['Bạn muốn xoá khỏi danh sách đang kiểm kê'], async () => {
            methods.setValue(
              'product_list',
              methods.watch('product_list').filter((_, o) => index !== o),
            );
          }),
        );
      },
      permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
    },
    {
      icon: 'fi fi-rr-plus',
      color: 'green',
      hidden: (p) => {
        return (
          p?.total_inventory - p?.actual_inventory === 0 || !is_take_inventory || is_processed || isStockTakeImeiCode
        );
      },
      onClick: (_, index) => {
        setProductListSkuModal(index);
      },
      permission: [STOCKS_TAKE_REQUEST_PERMISSION.EDIT, STOCKS_TAKE_REQUEST_PERMISSION.ADD],
    },
  ];

  const columns = [
    {
      header: 'Kho',
      accessor: 'stocks_name',
    },
    {
      header: 'Mã sản phẩm',
      accessor: 'product_code',
    },
    {
      header: 'Tên sản phẩm',
      accessor: 'product_name',
    },
    {
      header: 'Tên imei code',
      accessor: 'product_imei_code',
      hidden: !isStockTakeImeiCode,
    },
    {
      header: 'Ngành hàng',
      accessor: 'category_name',
    },
    {
      header: 'Đơn vị tính',
      accessor: 'unit_name',
    },
    {
      header: 'SL tồn phần mềm',
      hidden: !is_reviewed || !is_take_inventory,
      formatter: (p) => {
        const color = () => {
          if (methods.watch('is_take_inventory')) {
            if (p?.total_inventory === 0) {
              return 'bw_label_danger';
            } else {
              return 'bw_label_success';
            }
          } else {
            return 'bw_label_warning';
          }
        };

        return isStockTakeImeiCode ? (
          <span className={`bw_label ${color()}`}>
            {methods.watch('is_take_inventory') ? textInventory[p?.total_inventory] : 'Chưa lấy số lượng'}
          </span>
        ) : (
          <span className='bw_text_center'>{p?.total_inventory ? p?.total_inventory : 'Chưa lấy tồn'}</span>
        );
      },
    },
    {
      header: 'SL thực tế kiểm đếm',
      //hidden: is_reviewed,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (_, index) =>
        isStockTakeImeiCode ? (
          <label
            style={{
              marginLeft: '24px',
            }}
            className='bw_radio'>
            <input
              style={{
                textAlign: 'center!important',
              }}
              type='checkbox'
              disabled={is_reviewed}
              onChange={() => {
                const flag = methods.watch(`product_list.${index}.available_in_stock`);
                methods.setValue(`product_list.${index}.available_in_stock`, flag ? 0 : 1);
              }}
              checked={Boolean(methods.watch(`product_list.${index}.available_in_stock`))}
            />
            <span></span>
          </label>
        ) : (
          <FormNumber field={`product_list.${index}.actual_inventory`} />
        ),
    },
    {
      header: 'Chênh lệch',
      hidden: isStockTakeImeiCode || !is_reviewed || !is_take_inventory,
      formatter: (p, index) => {
        const actual_inventory = methods.watch(`product_list.${index}.actual_inventory`);
        if (p?.total_inventory === null) {
          return '---';
        }

        if (isStockTakeImeiCode) {
          if (p?.total_inventory - p?.available_in_stock === 0) {
            return 'Cân bằng';
          } else if (p?.total_inventory - p?.available_in_stock === 1) {
            return 'Thiếu';
          } else if (p?.total_inventory - p?.available_in_stock === -1) {
            return 'Thừa';
          }
        } else {
          const total_inventory = parseInt(p?.total_inventory ?? 0);
          if (actual_inventory === total_inventory) {
            return 'Cân bằng';
          } else if (actual_inventory > total_inventory) {
            return 'Thừa';
          } else if (actual_inventory < total_inventory) {
            return 'Thiếu';
          }
        }
      },
    },
    {
      header: 'SL chênh lệch',
      hidden: isStockTakeImeiCode || !is_reviewed || !is_take_inventory,
      formatter: (p, index) => {
        const actual_inventory = methods.watch(`product_list.${index}.actual_inventory`);
        if (p?.total_inventory === null) {
          return '---';
        }
        return Math.abs(actual_inventory - p?.total_inventory);
      },
    },
    {
      header: 'Ngày lấy tồn phần mềm',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      hidden: !is_take_inventory,
      formatter: (p) => {
        if (p?.total_inventory === null) {
          return '---';
        }
        return p?.take_inventory_date;
      },
    },
  ];

  return (
    <React.Fragment>
      <DataTable
        loading={false}
        noSelect
        noPaging
        actions={actions}
        columns={columns ?? []}
        data={
          isStockTakeImeiCode
            ? methods.watch('product_list') ?? []
            : [...new Map((methods.watch('product_list') ?? [])?.map((m) => [m.product_id, m])).values()]
        }
      />
      {productListModal && (
        <ProductListModal
          isStockTakeImeiCode={isStockTakeImeiCode}
          open={productListModal}
          onClose={() => {
            setProductListModal(false);
          }}
        />
      )}
      {productListSkuModal >= 0 && (
        <ProductSkuModal
          is_reviewed={is_reviewed}
          field={`product_list.${productListSkuModal}.list_imei`}
          actual_inventory={methods.watch(`product_list.${productListSkuModal}.actual_inventory`)}
          open={productListSkuModal >= 0}
          onClose={() => {
            setProductListSkuModal(undefined);
          }}
        />
      )}
      {importExcelModal && (
        <ImportProductModal
          open={importExcelModal}
          onChange={(value) => {
            let _productList = [...methods.watch('product_list')];
            if (isStockTakeImeiCode) {
              _productList = [
                ...new Map(([..._productList, ...value] ?? [])?.map((m) => [m.product_imei_code, m])).values(),
              ];
            } else {
              for (let i of value) {
                const indexProduct = _productList.findIndex((product) => product.product_code === i.product_code);
                if (indexProduct >= 0) {
                  _productList[indexProduct].list_imei = [
                    ...new Map(
                      ([..._productList[indexProduct].list_imei, i] ?? [])?.map((m) => [m.product_imei_code, m]),
                    ).values(),
                  ];
                } else {
                  _productList.push({
                    ...i,
                    list_imei: [i],
                  });
                }
              }
            }
            methods.setValue('product_list', _productList);
          }}
          onClose={() => {
            setImportExcelModal(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default StocksTakeProductListTab;
