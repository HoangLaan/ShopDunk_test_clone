import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { Tooltip } from 'antd';

import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/Orders/helpers/msgError';
import { formatPrice, getErrorMessage } from 'utils/index';
import { getListByProduct } from 'services/material.service';
import { getProduct } from 'pages/Orders/helpers/call-api';
import { resetMoneyAndPromotion } from 'pages/Orders/helpers/utils';
import { orderType, orderTypeId, productOutputType } from 'pages/Orders/helpers/constans';
import { getListIMEI } from 'services/stocks-detail.service';
import { mapDataOptions4Select, showToast } from 'utils/helpers';
import { getPromotionIsMax } from './AutoGetPromotion';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ProductModal from '../ProductModel/ProductModal';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import BWButton from 'components/shared/BWButton';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import ReviewVoucherModel from '../ReviewVoucherModel/ReviewVoucherModel';
import { useAuth } from 'context/AuthProvider';

const BWAccordionStyled = styled(BWAccordion)`
  .bw_table th:nth-last-child(2) {
    left: none;
    right: 76px;
  }
`;

const Products = ({ disabled, isOrderFromStocksTransfer }) => {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const {
    formState: { errors },
    clearErrors,
    watch,
    setValue,
  } = methods;
  const {user} = useAuth();

  const [isShowSelectProductModal, setIsShowSelectProductModal] = useState(false);
  const [selectProductModalData, setSelectProductModalData] = useState({});
  const [selectProductModalParams, setSelectProductModalParams] = useState({});
  const [productKeyword, setProductKeyword] = useState('');
  const [openModalLate, setOpenModalLate] = useState(false);
  const [selectProduct, setSelectProduct] = useState(null);
  const [isModelReview, setIsModelReview] = useState(false);

  const store_id = watch('store_id');

  const handleCalculateTotalMoney = useCallback(() => {
    resetMoneyAndPromotion(watch, setValue);
  }, [watch, setValue]);

  const loadMaterial = useCallback(
    (products) => {
      getListByProduct({ products }).then((res) => {
        setValue('materials', res);
        clearErrors('materials');
      });
    },
    [setValue, clearErrors],
  );

  const onChangeProducts = useCallback(
    (products) => {
      // xoa qua tang khi thay doi danh sach san pham
      products = Object.keys(products).reduce(function (r, e) {
        if (!products[e].is_promotion_gift) r[e] = products[e];
        return r;
      }, {});

      //Lấy túi bao bì của sản phầm
      loadMaterial(
        Object.values(products).reduce((acc, product) => {
          const findIndex = acc.findIndex((item) => item?.product_id === product?.product_id);
          if (findIndex === -1) {
            return [
              ...acc,
              {
                product_id: product?.product_id,
                quantity: product?.quantity,
              },
            ];
          }

          acc[findIndex].quantity += product?.quantity;
          return acc;
        }, []),
      );
      clearErrors('products');

      // tính tổng tiền trên tổng hoá đơn 7542Qw
      handleCalculateTotalMoney();

      setValue(`products`, products);
      getPromotionIsMax(methods, 'products', products);
    },
    [setValue, clearErrors, handleCalculateTotalMoney, loadMaterial, methods],
  );

  const debounceOnChangeProducts = debounce(onChangeProducts, 100);

  const onChangeProductsPreOrder = () => {
    const products = watch('products');
    const gifts = watch('gifts');
    const materials = watch('materials');

    const products_ = Object.values(products || {}).filter((product) => product?.product_id);
    if (products_?.length > 0) {
      const selectedImeis = [
        // imei cua cac material
        ...materials.reduce((acc, material) => acc.concat(material?.imei_codes || []), []).map((imei) => imei?.value),
        // imei cua cac gift
        ...gifts.reduce((acc, gift) => acc.concat(gift?.imei_codes || []), []).map((imei) => imei?.value),
        // imei cua cac product
        ...products_.reduce((acc, product) => acc.concat(product?.imei_codes || []), []).map((imei) => imei?.value),
      ];

      // disable cac imei da chon
      const newProducts = products_.map((product) => {
        const newImeiOptions = product?.imei_code_options?.map((imei) => {
          const isDisabled =
            // đã được chọn
            selectedImeis?.findIndex((item) => item === imei?.value) !== -1 &&
            // và không nằm trong ds imei đã chọn của material hiện tại
            !(product?.imei_codes?.findIndex((item) => item?.value === imei?.value) > -1);

          return {
            ...imei,
            disabled: isDisabled,
          };
        });

        return {
          ...product,
          imei_code_options: newImeiOptions,
        };
      });

      setValue(
        'products',
        newProducts.reduce((acc, product) => ({ ...acc, [product?.product_id]: product }), {}),
      );
    }
  };

  // useEffect(() => {
  //   handleCalculateTotalMoney();
  // }, [handleCalculateTotalMoney, products]);

  const handleAddProduct = (product = {}) => {
    const products = watch('products') || {};
    // tính tổng tiền sản phẩm
    if (product?.product_output_type?.[0].value === productOutputType.PREORDER) {
      products[product.product_id] = {
        ...product,
        total_price: product?.price,
        total_price_base: Math.round((product?.price) / (1 + product?.value_vat / 100)),
        vat_amount: product?.price - Math.round((product?.price) / (1 + product?.value_vat / 100)),
        discount: 0,
        quantity: 1,
      };
    } else {
      products[product.imei_code] = {
        ...product,
        total_price: product?.price,
        total_price_base: Math.round((product?.price) / (1 + product?.value_vat / 100)),
        vat_amount: product?.price - Math.round((product?.price) / (1 + product?.value_vat / 100)),
        discount: 0,
        quantity: 1,
      };
    }
    debounceOnChangeProducts(products);
  };

  const handleDelete = useCallback(
    (imei_code) => {
      const products = watch('products') || {};
      if (imei_code) {
        delete products[imei_code];
        debounceOnChangeProducts(products);
      }
    },
    [debounceOnChangeProducts, watch],
  );

  const handleChangeOutputType = useCallback(
    (imei_code, value, o) => {
      let _products = watch('products') || {};
      _products[imei_code].product_output_type_id = value;

      //đơn giá chưa bao gồm VAT
      _products[imei_code]['base_price'] = o?.price / (1 + o?.value_vat / 100);
      //Thành tiền
      _products[imei_code]['total_price_base'] = (o?.price / (1 + o?.value_vat / 100)) * _products[imei_code]['quantity'];
      //Tiền thuế
      _products[imei_code]['vat_amount'] = Math.round(
        (_products[imei_code]['quantity'] * (o?.price - o?.price / (1 + o?.value_vat / 100)))
      );
      _products[imei_code]['value_vat'] = o?.value_vat;
      //Tổng giá trị
      _products[imei_code]['total_price'] = o?.price * _products[imei_code]['quantity'];
      //Giá có VAT
      _products[imei_code]['price'] = o?.price;

      setValue('products', _products);

      // tính tổng tiền trên tổng hoá đơn
      handleCalculateTotalMoney();
    },
    [handleCalculateTotalMoney, setValue, watch],
  );

  const getProductHandle = () => {
    const order_type = watch('order_type');
    const store_id = watch('store_id');

    getProduct({
      keyword: productKeyword,
      order_type_id: order_type === orderType.PREORDER ? orderTypeId.RETAIL : watch('order_type_id'), // nếu là đơn pre-order, vẫn lấy giá sản phẩm thêm mới theo hình thức bán lẻ
      store_id: store_id,
      itemsPerPage: 10
    })
      .then((res) => {
        if (res?.product_id && res?.imei_code) {
          handleAddProduct({
            ...res,
            product_output_type_id: parseInt(res.product_output_type_id),
          });
        } else if (res.items && res.items.length > 0) {
          setIsShowSelectProductModal(true);
          setSelectProductModalData(res);
          setSelectProductModalParams({
            keyword: productKeyword,
            order_type_id: order_type === orderType.PREORDER ? orderTypeId.RETAIL : watch('order_type_id'),
            store_id: store_id,
            itemsPerPage: 10
          });
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
        setProductKeyword('');
      });
  };

  const handleInputProduct = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      getProductHandle();
    }
  };

  const fetchImeiOptions = (search, product) => {
    return getListIMEI({
      search,
      id: product?.product_id,
      store_id: store_id,
      table: 'PRODUCT',
      stock_type: 11,
      order_type_id: watch('order_type_id'),
    })
      .then((res) => {
        if (product?.imei_codes?.length) {
          for (let i = 0; i < product.imei_codes.length; i++) {
            const imei = product.imei_codes[i];
            const index = res.findIndex((item) => item?.value === imei?.value);
            if (index === -1) {
              res = [...res, imei];
            }
          }
        }

        setValue(`products.${product?.product_id}.imei_code_options`, mapDataOptions4Select(res || []));
        onChangeProductsPreOrder();
      })
      .catch((error) => {
        showToast.error(
          getErrorMessage({
            message: error.message || 'Có lỗi khi lấy IMEI.',
          }),
        );
      });
  };

  const onEnterImei = (e, productId) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      getListIMEI({
        search: e.target.value?.replace('Ư', 'W'),
        id: productId,
        store_id: watch('store_id'),
        table: 'PRODUCT',
        order_type_id: watch('order_type_id'),
      })
        .then((res) => {
          if (res?.length === 1) {
            setValue(
              `products[${productId}].imei_codes`,
              Object.assign(watch(`products[${productId}].imei_codes`), res),
            );
          }
        })
        .catch((err) => {
          showToast.error(
            getErrorMessage({
              message: err.message || 'Lỗi khi tìm sản phẩm',
            }),
          );
        });
    }
  };

  const accountingAccountOptions = useGetOptions(optionType.accounting_account, { labelName: 'code' });

  useEffect(() => {
    // hard default tax accounting account
    // 3331
    const TAX_CODE = '3331';
    if (accountingAccountOptions?.length > 0) {
      const taxAccount = accountingAccountOptions.find((account) => account.label === TAX_CODE);
      if (taxAccount) {
        const productList = watch('products') || {};

        if (Object.values(productList)?.every((product) => product?.tax_account_id)) {
          return;
        }

        for (let product of Object.values(productList)) {
          product.tax_account_id = taxAccount.value;
        }
        methods.setValue('products', productList);
      }
    }
  }, [accountingAccountOptions, watch('products')]);

  const showModal = (value) => {
    setSelectProduct(value)
    setOpenModalLate(true);
  };

  const columns = [
    // {
    //   header: 'STT',
    //   classNameHeader: 'bw_text_center bw_w1',
    //   classNameBody: 'bw_text_center',
    //   formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
    // },
    {
      header: 'IMEI',
      formatter: (p) => {
        if (p?.product_output_type?.[0].value === productOutputType.PREORDER) {
          return (
            <FormDebouneSelect
              fetchOptions={(search) => fetchImeiOptions(search, p)}
              mode='multiple'
              options={watch(`products[${p.product_id}].imei_code_options`) || []}
              field={`products[${p.product_id}].imei_codes`}
              disabled={disabled}
              allowClear
              onChange={(value, options) => {
                if (value?.length > +p?.quantity) {
                  showToast.error('Số lượng IMEI không khớp');
                  return;
                }

                clearErrors(`products[${p.product_id}].imei_codes`);
                setValue(`products[${p.product_id}].imei_codes`, Object.assign(value, options));

                onChangeProductsPreOrder();
              }}
              style={{ minWidth: '125px' }}
              onKeyDown={(e) => {
                onEnterImei(e, p?.product_id);
              }}
            />
          );
        } else {
          return <b>{p?.imei_code}</b>;
        }
      },
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Mã sản phẩm',
      accessor: 'product_code',
      formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên sản phẩm',
      formatter: (p) => (
        <Tooltip title={p?.product_name}>
          {p?.product_name?.length > 43 ? p?.product_name.slice(0, 40) + '...' : p?.product_name}
        </Tooltip>
      ),
      classNameHeader: 'bw_text_center',
    },
    {
      hidden: !isOrderFromStocksTransfer,
      header: 'TK',
      classNameHeader: 'bw_text_center',
      formatter: (p, index) => {
        return <FormSelect list={accountingAccountOptions} field={`products[${p?.imei_code}].debt_account_id`} />;
      },
    },
    {
      hidden: !isOrderFromStocksTransfer,
      header: 'TK Doanh thu',
      classNameHeader: 'bw_text_center',
      formatter: (p, index) => {
        return <FormSelect list={accountingAccountOptions} field={`products[${p?.imei_code}].revenue_account_id`} />;
      },
    },
    {
      header: 'ĐVT',
      accessor: 'unit_name',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Hình thức xuất',
      accessor: 'product_output_type_id',
      formatter: (p, idx) => (
        <FormSelect
          disabled={disabled}
          value={p?.product_output_type_id}
          list={p?.product_output_type || []}
          className='bw_inp'
          style={{ padding: '0px 16px' }}
          placeholder={'--Chọn--'}
          onChange={(value, o) => {
            handleChangeOutputType(p?.imei_code, value, o);
          }}
        />
      ),
      classNameHeader: 'bw_text_center',
    },
    // {
    //   header: 'Đơn giá bán (chưa bao gồm VAT)',
    //   accessor: 'base_price',
    //   formatter: (p) => <span>{formatPrice(p?.base_price, false, ',')}</span>,
    //   classNameBody: 'bw_text_right',
    // },
    {
      header: 'Thành tiền',
      accessor: 'total_price',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (p) => <b className='bw_sticky bw_name_sticky'>{formatPrice((p?.total_price_base), false, ',')}</b>,
    },
    {
      header: 'Thuế suất',
      accessor: 'value_vat',
      formatter: (p) => {
        return (
          <div className='bw_text_center'>
            <span>{p?.value_vat ? p?.value_vat + '%' : '0%'}</span>
          </div>
        );
      },
      classNameBody: 'bw_text_right',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'TK Thuế',
      classNameBody: 'bw_text_right',
      classNameHeader: 'bw_text_center',
      formatter: (p, index) => {
        return (
          <FormSelect disabled list={accountingAccountOptions} field={`products[${p?.imei_code}].tax_account_id`} />
        );
      },
    },
    {
      header: 'Tiền thuế VAT',
      accessor: 'vat_amount',
      formatter: (p) => <span>{formatPrice(p?.vat_amount, false, ',')}</span>,
      classNameBody: 'bw_text_right',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Ghi chú',
      accessor: 'note',
      formatter: (p, idx) => (
        <input
          type='text'
          disabled={disabled}
          value={p?.note}
          onChange={({ target: { value } }) => setValue(`products['${p?.imei_code}'].note`, value)}
          className='bw_inp bw_mw_2'
          placeholder='Ghi chú'
        />
      ),
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Thành tiền (đã bao gồm VAT)',
      classNameHeader: 'bw_sticky bw_text_center',
      classNameBody: 'bw_sticky bw_name_sticky bw_text_right',
      formatter: (p) => <b>{formatPrice(p?.total_price, false, ',')}</b>,
      style: { left: 'none', right: '76px' },
      styleHeader: {
        right: '76px',
        minWidth: '100px',
        textWrap: 'wrap',
      },
    },
  ];

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-eye',
        color: 'red',
        permission: 'SL_ORDER_EDIT',
        // disabled: (p) =>  !p?.review_user,
        hidden: (p) => (!p?.review_user) || methods.watch('payment_status') !== 1,
        onClick: (p) => {
          showModal({can_review_order: 1, ...p})
        },
      },
      {
        icon: 'fi fi-rr-add',
        color: 'blue',
        title: 'Tạo duyệt thêm voucher',
        permission: 'SL_ORDER_EDIT',
        hidden: (p) => methods.watch('payment_status') !== 1 || p?.is_review === 1 || p?.review_user,
        onClick: (p) => { showModal(p) }
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: ['SL_ORDER_ADD', 'SL_ORDER_EDIT'],
        disabled: disabled,
        hidden: (p) => p?.product_output_type?.[0].value === productOutputType.PREORDER,
        onClick: (p) =>
          !disabled
            ? dispatch(
              showConfirmModal(msgError['model_error'], async () => {
                handleDelete(p?.imei_code);
              }),
            )
            : null,
      },
    ];
  }, [disabled, dispatch, handleDelete]);

  return (
    <BWAccordionStyled
      title='Thông tin sản phẩm'
      id='bw_info_cus'
      isRequired={isOrderFromStocksTransfer ? false : true}>
      {!disabled ? (
        <div className='bw_row bw_align_items_center' disabled={!watch('stock_id')}>
          <div className='bw_col_4'>
            <input
              onKeyDown={handleInputProduct}
              type='text'
              placeholder='Nhập mã barcode, mã sản phẩm, tên sản phẩm'
              className='bw_inp'
              //disabled={!watch('order_type_id') || !watch('store_id')}
              onChange={(e) => {
                setProductKeyword(e.target.value);
              }}
              value={productKeyword}
            />
          </div>
          {watch('order_type_id') && watch('store_id') && (
            <BWButton outline icon='fi-rr-search' onClick={getProductHandle} />
          )}
        </div>
      ) : null}
      <DataTable
        columns={columns}
        data={Object.values(watch('products') || {})}
        actions={actions}
        noPaging={true}
        noSelect={disabled}
        handleBulkAction={(dataSelect) => {
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              for (let i = 0; i < dataSelect.length; i++) {
                handleDelete(dataSelect[i]?.imei_code);
              }
              document.getElementById('data-table-select').click();
            }),
          );
        }}
      />
      {errors['products'] ? <span className='bw_red'>Sản phẩm bán là bắt buộc.</span> : null}

      {isShowSelectProductModal && (
        <ProductModal
          onClose={() => {
            setIsShowSelectProductModal(false);
          }}
          onConfirm={(products) => {
            products.forEach((p) => {
              handleAddProduct({
                ...p,
                product_output_type_id: parseInt(p?.product_output_type_id),
              });
            });
            setIsShowSelectProductModal(false);
          }}
          data={selectProductModalData}
          params={selectProductModalParams}
        />
      )}

      {openModalLate && (
        <ReviewVoucherModel
          data={selectProduct}
          dataOrder={methods.getValues() ?? {}}
          open={openModalLate}
          store_id={store_id}
          onClose={() => setOpenModalLate(false)}
        />
      )}

    </BWAccordionStyled>
  );
};

export default Products;
