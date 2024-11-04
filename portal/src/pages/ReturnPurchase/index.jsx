import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Panel from 'components/shared/Panel/index';
import StocksOutRequestAddPage from './StockOutRequest/StocksOutRequestAddPage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getPurchaseOrdersOptions, getStocksOptions, getPurchaseOrdersDetail } from 'services/return-purchase.service';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import BWButton from 'components/shared/BWButton';
import FormInput from 'components/shared/BWFormControl/FormInput';
import ProductsModal from './Modal/ProductsModal';
import Invoice from './Invoice';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import ReceiveSlipCashAddPage from 'pages/ReceivePaymentSlipCash/pages/AddPage';
import ReceiveSlipCreditAddPage from 'pages/ReceivePaymentSlipCredit/pages/AddPage';
import { RECEIPTSOBJECT } from 'pages/ReceivePaymentSlipCash/utils/constants';
import moment from 'moment';

const receiveTypeOptions = [
  { key: 1, value: 1, label: 'Giảm trừ công nợ', index: true },
  { key: 2, value: 2, label: 'Thu tiền mặt' },
  { key: 3, value: 3, label: 'Thu tiền gửi ngân hàng' },
];
const defaultValues = {
  is_returned_stocks: 1,
  receive_type: receiveTypeOptions.find((item) => item.index).value,
  order_invoice_date: moment().format('DD/MM/YYYY'),
};
const ReturnPurchase = () => {
  const methods = useForm({
    defaultValues,
  });
  const [purchaseOrdersOptions, setPurchaseOrdersOptions] = useState([]);
  const [stocksOptions, setStocksOptions] = useState([]);
  const [isOpenProductsModal, setIsOpenProductsModal] = useState(false);
  const [productList, setProductList] = useState({});
  const { watch, setValue, reset } = methods;
  const receive_type = watch('receive_type');
  const isCash = receive_type === 2;
  const isOtherReceiveType = ![2, 3].includes(receiveTypeOptions.find((item) => item.value === receive_type)?.value);
  const { business_id, supplier_id, order_id } = watch() ?? {};
  const accountingOptions = useGetOptions(optionType.accountingAccount);
  const getAccounting = (code) => accountingOptions.find((item) => item.code === code)?.id;
  const descriptionReceive = `Thu tiền mua hàng của ${watch('supplier_name')}`;
  const total_money = Object.values(productList).reduce((acc, cur) => (acc += cur.cost_price * cur.quantity), 0);
  const panel = [
    {
      key: 'stocks_out_request',
      label: 'Phiếu xuất',
      component: StocksOutRequestAddPage,
      productList,
    },
    {
      key: 'invoice',
      label: 'Hóa đơn',
      component: Invoice,
    },
    {
      key: 'receive_slip',
      hidden: isOtherReceiveType,
      label: isCash ? 'Phiếu thu' : 'Uỷ nhiệm thu',
      component: isCash ? ReceiveSlipCashAddPage : ReceiveSlipCreditAddPage,
      receivePaymentType: 1,
      defaultValues: {
        business_id,
        receiver_type: RECEIPTSOBJECT.SUPPLIER,
        receiver_name: supplier_id,
        descriptions: descriptionReceive,
        total_money,
        order_id,
        accounting_list: [
          {
            debt_account: getAccounting('1111'),
            credit_account: getAccounting('331'),
            money: total_money,
            explain: descriptionReceive,
          },
        ],
      },
    },
  ];

  useEffect(() => {
    getPurchaseOrdersOptions().then(setPurchaseOrdersOptions);
  }, []);

  // const acc1561 = useMemo(() => accountingOptions?.find((_) => _.code === '1561'), [accountingOptions]);
  // const acc331 = useMemo(() => accountingOptions?.find((_) => _.code === '331'), [accountingOptions]);
  const purchase_order_id = watch('purchase_order_id');
  useEffect(() => {
    if (purchase_order_id) {
      getStocksOptions({ purchase_order_id }).then(setStocksOptions);
      const purchaseOrderSelected = purchaseOrdersOptions.find((item) => item.value === purchase_order_id);
      const [purchase_code, _, supplier_name] = purchaseOrderSelected?.label?.split('-');
      setValue('supplier_id', purchaseOrderSelected?.supplier_id);

      setValue('request_code', purchase_code?.trim());
      setValue('purchase_user', String(purchaseOrderSelected?.purchase_user));
      const supplier_name_trim = supplier_name?.trim();
      setValue('supplier_name', supplier_name_trim);
      setValue('note', `Xuất hàng trả lại cho ${supplier_name_trim}`);

      setValue('supplier_tax_code', purchaseOrderSelected?.supplier_tax_code);
      setValue('supplier_phone_number', purchaseOrderSelected?.supplier_phone_number);
      setValue('supplier_address', purchaseOrderSelected?.supplier_address);
    }
  }, [purchase_order_id]);

  const stocks_id = watch('stocks_id');
  useEffect(() => {
    if (stocks_id) {
      const stocksSelected = stocksOptions.find((item) => item.value === stocks_id);
      setValue('from_stocks_id', stocks_id);
      setValue('from_store', stocksSelected?.store_id);
    }
  }, [stocks_id]);

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <div className='bw_row'>
          <div className='bw_col_5'>
            <FormItem label='Đơn mua hàng'>
              <FormSelect
                bordered
                field={'purchase_order_id'}
                list={purchaseOrdersOptions}
                onChange={(value) => {
                  reset({
                    ...defaultValues,
                    purchase_order_id: value,
                  });
                  setProductList({});
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_3'>
            <FormItem disabled={!watch('purchase_order_id')} label='Kho'>
              <FormSelect bordered field={'stocks_id'} list={stocksOptions} />
            </FormItem>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }} className='bw_col_1'>
            <BWButton disabled={!watch('stocks_id')} content={'Chọn'} onClick={() => setIsOpenProductsModal(true)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }} className='bw_col_3'>
            <FormItem>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_returned_stocks' />
                <span />
                Trả lại hàng trong kho
              </label>
            </FormItem>
          </div>
        </div>
        <FormRadioGroup field='receive_type' list={receiveTypeOptions} custom={true} />
        {Object.values(productList).length ? <Panel panes={panel} noActions={true} /> : <></>}
        {isOpenProductsModal && (
          <ProductsModal
            title={`Danh sách sản phẩm của ${
              purchaseOrdersOptions.find((item) => item.value === watch('purchase_order_id'))?.label
            }`}
            open={isOpenProductsModal}
            onClose={() => {
              setIsOpenProductsModal(false);
            }}
            onApply={(value) => {
              const product_list = {};
              for (const item of value) {
                if (!product_list[item.product_id]) {
                  product_list[item.product_id] = {
                    ...item,
                    label: item.product_name,
                    keyObject: item.product_id,
                    price: item.cost_price,
                    list_imei: [{ ...item, product_imei_code: item.imei }],
                    quantity: 1,
                  };
                } else {
                  const preImeis = product_list[item.product_id].list_imei;
                  product_list[item.product_id].list_imei = [...preImeis, { ...item, product_imei_code: item.imei }];
                  product_list[item.product_id].quantity += product_list[item.product_id].quantity;
                }
              }

              console.log('>>> pro', product_list);

              setValue('products', product_list);
              setProductList(product_list);
            }}
            // defaultDataSelect={Object.values(productList)}
          />
        )}
      </div>
    </FormProvider>
  );
};

export default ReturnPurchase;
