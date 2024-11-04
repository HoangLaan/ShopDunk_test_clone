import React, { useState, useMemo, useEffect, useCallback } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import DataTable from 'components/shared/DataTable/index';
import ModalAddProduct from 'pages/PurchaseOrder/tabs/InvoiceTab/Modal/ModalAddProduct';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { convertFromPurchaseOrder } from '../utils/helper';
import { formatPrice } from 'utils';
import { getOptions } from 'services/accounting-account.service';
import { showToast } from 'utils/helpers';

const FIELD_NAME = 'product_list';

const ProductList = ({ disabled, title, id, purchaseOrder = {}, isAdd, isEdit }) => {
  const dispatch = useDispatch();

  const methods = useFormContext();
  const [openModalAddCustomer, setOpenModalAddCustomer] = useState(false);
  const [accountingAccount, setAccountingAccount] = useState([]);

  const { control, setValue, watch } = methods;

  const updateMoney = useCallback((record, index, list = []) => {
    const listClone = [...list];
    record.discount_percent = record.discount_percent || 0;

    const intoMoney = Math.round(record.product_quantity * record.product_price) || 0;
    const vatPrice =
      Math.round(
        (record.product_quantity * record.product_price * (100 - record.discount_percent) * (record.vat_value || 0)) /
          10000,
      ) || 0;
    const discountPrice =
      Math.round((record.product_quantity * record.product_price * record.discount_percent) / 100) || 0;

    const purchaseCost = !record.product_quantity
      ? 0
      : Math.round(record.purchase_cost_total / record.total_quantity) * record.product_quantity || 0;

    const paymentPrice = intoMoney - discountPrice + purchaseCost;

    setValue(`${FIELD_NAME}.${index}.into_money`, intoMoney);
    setValue(`${FIELD_NAME}.${index}.vat_price`, vatPrice);
    setValue(`${FIELD_NAME}.${index}.payment_price`, paymentPrice);
    setValue(`${FIELD_NAME}.${index}.discount_price`, discountPrice);
    setValue(`${FIELD_NAME}.${index}.total_after_discount`, intoMoney - discountPrice);
    setValue(`${FIELD_NAME}.${index}.final_payment_price`, intoMoney - discountPrice + vatPrice);
    setValue(`${FIELD_NAME}.${index}.purchase_cost`, purchaseCost);

    listClone[index].into_money = intoMoney;
    listClone[index].vat_price = vatPrice;
    listClone[index].payment_price = paymentPrice;
    listClone[index].discount_price = discountPrice;
    listClone[index].discount_price = discountPrice;
    listClone[index].total_after_discount = intoMoney - discountPrice;
    listClone[index].final_payment_price = intoMoney - discountPrice + vatPrice;

    // update sum record total
    const sumRecord = listClone?.reduce(
      (total, product) => {
        total.product_quantity += product.product_quantity || 0;
        total.into_money += product.into_money || 0;
        total.vat_price += product.vat_price || 0;
        total.purchase_cost += product.purchase_cost || 0;
        total.payment_price += product.payment_price || 0;
        total.discount_price += product.discount_price || 0;
        total.total_after_discount += product.total_after_discount || 0;
        total.final_payment_price += product.final_payment_price || 0;
        return total;
      },
      {
        product_quantity: 0,
        into_money: 0,
        vat_price: 0,
        purchase_cost: 0,
        payment_price: 0,
        discount_price: 0,
        total_after_discount: 0,
        final_payment_price: 0,
      },
    );
    setValue(`sum_product_quantity`, sumRecord?.product_quantity); // Tổng số lượng sản phẩm
    setValue(`sum_into_money`, sumRecord?.into_money); // Tổng tiền hàng
    setValue(`sum_vat_price`, sumRecord?.vat_price); // Tổng thuế
    setValue(`sum_purchase_cost`, sumRecord?.purchase_cost); // Tổng chi phí mua hàng
    setValue(`sum_payment_price`, sumRecord?.payment_price); // Tổng tiền giá trị nhập kho
    setValue(`sum_total_price`, sumRecord?.into_money + sumRecord?.vat_price); // Tổng tiền
    setValue(`sum_discount_price`, sumRecord?.discount_price); // Tổng chiết khấu
    setValue(`sum_total_after_discount`, sumRecord?.total_after_discount); // Tổng thành tiền sau chiết khấu
    setValue(`sum_final_payment_price`, sumRecord?.final_payment_price); // Tổng tiền phải thanh toán
  }, []);

  // update all products
  useEffect(() => {
    if (watch('update_all_product')) {
      const productList = watch(FIELD_NAME);
      productList?.forEach(updateMoney);
    }
  }, [watch('update_all_product')]);

  useEffect(() => {
    if (isAdd) {
      if (purchaseOrder?.product_list) {
        const productList = convertFromPurchaseOrder(purchaseOrder);
        setValue(FIELD_NAME, productList);
        // update total money
        productList?.forEach(updateMoney);
      }
    }
  }, [isAdd, purchaseOrder]);

  useEffect(() => {
    getOptions().then((data) => {
      setAccountingAccount(data || []);
    });
  }, []);

  // load default accounting value
  useEffect(() => {
    if ((isAdd || watch('update_all_product')) && accountingAccount && accountingAccount.length > 0) {
      const debtAaccount = accountingAccount?.find((_) => _.code === '331');
      const taxAaccount = accountingAccount?.find((_) => _.code === '1331');
      const stocksAccount = accountingAccount?.find((_) => _.code === '1561');
      if (debtAaccount) {
        setValue(
          FIELD_NAME,
          watch(FIELD_NAME)?.map((_) => ({
            ..._,
            debt_account_id: _.debt_account_id ?? debtAaccount?.id,
          })),
        );
      }
      if (taxAaccount) {
        setValue(
          FIELD_NAME,
          watch(FIELD_NAME)?.map((_) => ({
            ..._,
            tax_account_id: _.tax_account_id ?? taxAaccount?.id,
          })),
        );
      }
      if (stocksAccount) {
        setValue(
          FIELD_NAME,
          watch(FIELD_NAME)?.map((_) => ({
            ..._,
            stocks_account_id: _?.stocks_account_id ?? stocksAccount?.id,
          })),
        );
      }
    }
  }, [accountingAccount, isAdd, watch('update_all_product')]);

  useEffect(() => {
    if (openModalAddCustomer) {
      setValue('z_index', -1);
    } else {
      setValue('z_index', 2);
    }
  }, [openModalAddCustomer]);

  const { remove } = useFieldArray({
    control,
    name: FIELD_NAME,
  });

  const columns = [
    {
      header: 'STT',
      formatter: (_, index) => index + 1,
      classNameBody: 'bw_text_center',
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Mã đơn mua hàng',
      disabled: disabled,
      accessor: 'purchase_order_code',
    },
    {
      header: 'Mã sản phẩm',
      disabled: disabled,
      accessor: 'product_code',
    },
    {
      header: 'Tên hàng hóa',
      disabled: disabled,
      accessor: 'product_name',
    },
    {
      header: 'Kho',
      disabled: disabled,
      accessor: 'stocks_list',
      formatter: (_, index) => (
        <div>
          {_.stocks_in_request_list?.map((stocksIn) => (
            <div>{stocksIn?.stocks_code}</div>
          ))}
        </div>
      ),
    },
    {
      header: 'TK Kho',
      disabled: disabled,
      accessor: 'stocks_account_id',
      formatter: (_, index) => (
        <FormSelect
          style={{ minWidth: '120px' }}
          bordered
          disabled={disabled}
          field={`${FIELD_NAME}.${index}.stocks_account_id`}
          list={accountingAccount?.map((_) => ({
            label: _.code,
            value: _.id,
            name: _.name,
          }))}
          validation={{
            required: 'Tài khoản kho là bắt buộc !',
          }}
        />
      ),
    },
    {
      header: 'TK Công nợ',
      disabled: disabled,
      accessor: 'debt_account_id',
      formatter: (_, index) => (
        <FormSelect
          style={{ minWidth: '120px' }}
          bordered
          disabled={disabled}
          field={`${FIELD_NAME}.${index}.debt_account_id`}
          list={accountingAccount?.map((_) => ({
            label: _.code,
            value: _.id,
            name: _.name,
          }))}
          validation={{
            required: 'Tài khoản công nợ là bắt buộc !',
          }}
        />
      ),
    },
    {
      header: 'ĐVT',
      disabled: disabled,
      accessor: 'product_unit',
    },
    {
      header: 'Số lượng',
      disabled: disabled,
      accessor: 'product_quantity',
      formatter: (item, index) => {
        return (
          <FormNumber
            style={{ minWidth: '100px' }}
            bordered
            disabled={disabled}
            field={`${FIELD_NAME}.${index}.product_quantity`}
            validation={{
              required: 'Số lượng là bắt buộc',
              min: {
                value: 0,
                message: 'Số lượng phải lớn hơn 0',
              },
              max: {
                value: 100,
                message: 'Số lượng phải nhỏ hơn 100',
              },
            }}
            onChange={(value) => {
              const field = `${FIELD_NAME}.${index}.product_quantity`;
              const productItem = methods.getValues(`${FIELD_NAME}.${index}`);
              if (value && value > productItem?.max_quantity) {
                showToast.warning('Số lượng vượt quá trong đơn mua hàng');
              } else {
                methods.clearErrors(field);
                methods.setValue(field, value);
                updateMoney(item, index, watch(FIELD_NAME));
              }
            }}
          />
        );
      },
    },
    {
      header: 'Đơn giá',
      disabled: disabled,
      accessor: 'product_price',
      formatter: (_) => {
        return formatPrice(_.product_price, false, ',');
      },
    },
    {
      header: 'Thành tiền',
      disabled: disabled,
      accessor: 'into_money',
      formatter: (_) => formatPrice(_.into_money, false, ','),
    },
    {
      header: 'Chiết khấu',
      disabled: disabled,
      accessor: 'discount_price',
      formatter: (_) => formatPrice(_.discount_price, false, ','),
    },
    {
      header: 'Thành tiền sau CK',
      disabled: disabled,
      accessor: 'total_after_discount',
      formatter: (_) => formatPrice(_.total_after_discount, false, ','),
    },
    {
      header: 'Thuế suất',
      disabled: disabled,
      accessor: 'vat_value',
      formatter: (_) => <span>{`${_.vat_value || 0} %`}</span>,
    },
    {
      header: 'Tiền thuế',
      disabled: disabled,
      accessor: 'vat_price',
      formatter: (_) => formatPrice(_.vat_price || 0, false, ','),
    },
    {
      header: 'TK Thuế',
      disabled: disabled,
      accessor: 'tax_account_id',
      formatter: (_, index) => (
        <FormSelect
          style={{ minWidth: '120px' }}
          bordered
          disabled={disabled}
          field={`${FIELD_NAME}.${index}.tax_account_id`}
          list={accountingAccount?.map((_) => ({
            label: _.code,
            value: _.id,
            name: _.name,
          }))}
          validation={{
            required: 'Tài khoản thuế là bắt buộc !',
          }}
        />
      ),
    },
    {
      header: 'Chi phí mua hàng',
      disabled: disabled,
      accessor: 'purchase_cost',
      formatter: (_) => <span>{formatPrice(_?.purchase_cost || 0, false, ',')}</span>,
    },
    {
      header: 'Tổng giá trị nhập kho',
      disabled: disabled,
      accessor: 'payment_price',
      formatter: (_) => formatPrice(_.payment_price, false, ','),
    },
  ];

  const actions = useMemo(
    () => [
      // {
      //   globalAction: true,
      //   icon: 'fi fi-rr-add',
      //   type: 'success',
      //   disabled: disabled,
      //   content: 'Chọn đơn mua hàng',
      //   permission: 'SL_INVOICE_EDIT',
      //   onClick: () => {
      //     setOpenModalAddCustomer(true);
      //   },
      // },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        disabled: disabled,
        permission: 'SL_INVOICE_EDIT',
        onClick: (_, index) => {
          if (!disabled) {
            dispatch(
              showConfirmModal(
                ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
                async () => {
                  remove(index);
                  methods.setValue('update_all_product', {}); // object
                },
              ),
            );
          }
        },
      },
    ],
    [disabled],
  );

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <DataTable
            customSumRow={[
              {
                index: 1,
                value: 'Tổng cộng',
                colSpan: 4,
                style: {
                  textAlign: 'center',
                },
              },
              {
                index: 9,
                value: watch('sum_product_quantity') || 0,
              },
              {
                index: 11,
                value: formatPrice(watch('sum_into_money') || 0, false, ','),
              },
              {
                index: 12,
                value: formatPrice(watch('sum_discount_price') || 0, false, ','),
              },
              {
                index: 13,
                value: formatPrice(watch('sum_total_after_discount') || 0, false, ','),
              },
              {
                index: 15,
                value: formatPrice(watch('sum_vat_price') || 0, false, ','),
              },
              {
                index: 17,
                value: formatPrice(watch('sum_purchase_cost') || 0, false, ','),
              },
              {
                index: 18,
                value: formatPrice(watch('sum_payment_price') || 0, false, ','),
              },
            ]}
            noSelect
            noPaging
            actions={actions}
            columns={columns}
            data={methods.watch('product_list') || []}
          />
        </div>
        {openModalAddCustomer && !disabled ? (
          <ModalAddProduct
            open={openModalAddCustomer}
            onClose={() => setOpenModalAddCustomer(false)}
            title='Chọn đơn mua hàng'
          />
        ) : null}
      </div>
    </BWAccordion>
  );
};

export default ProductList;
