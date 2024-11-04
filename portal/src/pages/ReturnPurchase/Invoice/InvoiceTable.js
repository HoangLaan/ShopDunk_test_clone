import { useEffect, useMemo, useState } from 'react';
import { formatPrice, returnDebitAccountCode } from 'utils';
import { useDispatch } from 'react-redux';

import BWAccordion from 'components/shared/BWAccordion';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable';
import { useForm, useFormContext } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptions } from 'services/accounting-account.service';
import { getOrderTypeById } from '../../Orders/helpers/call-api';


const TABLE_TABS = {
  GOOD_MONEY: 0,
  COST_PRICE: 1,
};

const TABLE_TAB_LIST = [
  {
    id: TABLE_TABS.GOOD_MONEY,
    name: 'Hàng tiền',
  },
  // {
  //   id: TABLE_TABS.COST_PRICE,
  //   name: 'Giá vốn',
  // },
];

function InvoiceTable({ title, disabled }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const [accountingOptions, setAccountingOptions] = useState([]);

  const { watch, setValue } = methods;

  const [tab, setTab] = useState(TABLE_TABS.GOOD_MONEY);

  // init account values
  useEffect(() => {
    if (watch('products')) {

      //order_type_id = 35 - đơn hàng bán nội bộ
      let oderTypeId = watch('order_type_id');
      // eslint-disable-next-line no-unused-vars
      let codeDebitAccount;
      // get codeDebitAccount
      getOrderTypeById(oderTypeId).then((data) => {
        codeDebitAccount = returnDebitAccountCode(data.Type);
      });

      getOptions().then((data) => {
        const debtAcc = data?.find((_) => _.code === '331');
        const revenueAcc = data?.find((_) => _.code === codeDebitAccount);
        const revenueAccInternalOrder = data?.find((_) => _.code === '5112'); // defalut accounting for internal order
        const costAcc = data?.find((_) => _.code === '632');
        const stockAcc = data?.find((_) => _.code === '1561');
        const products = watch('products');
        const INTERNAL_ORDER_TYPE = 11;

        let _total_money_without_vat = 0,
          _total_vat = 0;
        for (const key in products) {
          if (!products[key].imei) {
            delete products[key];
            continue;
          }
          products[key].debt_account_id = debtAcc?.id;
          products[key].revenue_account_id =
            products[key].revenue_account_id ||
            (watch('order_type') === INTERNAL_ORDER_TYPE ? revenueAccInternalOrder?.id : revenueAcc?.id);
          products[key].cost_account_id = products[key].cost_account_id || costAcc?.id;
          products[key].stocks_account_id = products[key].stocks_account_id || stockAcc?.id;
          products[key].product_unit_name = products[key].unit_name;
          products[key].base_price = products[key].cost_price || 0;
          products[key].total_base_money = products[key].base_price * products[key].quantity || 0;
          _total_money_without_vat += products[key].total_base_money;

          products[key].value_vat = products[key].vat_value || 0;
          products[key].total_vat = products[key].total_base_money * (products[key].value_vat / 100);
          _total_vat += products[key].total_vat;
          products[key].total_money = products[key].total_base_money + products[key].total_vat || 0;
        }

        setValue('_total_money_without_vat', _total_money_without_vat);
        setValue('_total_vat', _total_vat);
        setAccountingOptions(data || []);
        setValue('products', products);
      });
    }
  }, [watch('order_id')]);

  const columns = useMemo(() => {
    if (tab === TABLE_TABS.GOOD_MONEY) {
      return [
        {
          header: 'Mã sản phẩm',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => p?.product_code,
        },
        {
          header: 'Tên hàng hóa/quy cách',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => p?.product_name,
        },
        {
          header: 'TK công nợ',
          classNameHeader: 'bw_text_center',
          formatter: (_, index) => (
            <FormSelect
              style={{ minWidth: '120px' }}
              bordered
              disabled
              field={`products.${_.keyObject}.debt_account_id`}
              list={accountingOptions?.map((_) => ({
                label: _.code,
                value: _.id,
                name: _.name,
              }))}
            />
          ),
        },
        // {
        //   header: 'TK doanh thu',
        //   classNameHeader: 'bw_text_center',
        //   formatter: (_, index) => (
        //     <FormSelect
        //       style={{ minWidth: '120px' }}
        //       bordered
        //       disabled
        //       field={`products.${_.keyObject}.revenue_account_id`}
        //       list={accountingOptions?.map((_) => ({
        //         label: _.code,
        //         value: _.id,
        //         name: _.name,
        //       }))}
        //     />
        //   ),
        // },
        {
          header: 'TK kho',
          classNameHeader: 'bw_text_center',
          formatter: (_, index) => (
            <FormSelect
              style={{ minWidth: '120px' }}
              bordered
              disabled
              field={`products.${_.keyObject}.stocks_account_id`}
              list={accountingOptions?.map((_) => ({
                label: _.code,
                value: _.id,
                name: _.name,
              }))}
            />
          ),
        },
        {
          header: 'ĐVT',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          accessor: 'product_unit_name',
        },
        {
          header: 'Số lượng',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          accessor: 'quantity',
        },
        {
          header: 'Đơn giá bán',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => formatPrice(p?.base_price, false, ','),
        },
        {
          header: 'Thành tiền',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => formatPrice(p?.total_base_money, false, ','),
        },
        {
          header: 'Thuế suất',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => (p.value_vat || 0) + '%',
        },
        {
          header: 'Tiền thuế',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_right',
          formatter: (p) => formatPrice(p?.total_vat, false, ','),
        },
        {
          header: 'Tổng giá trị thanh toán',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => formatPrice(p?.total_money, false, ','),
        },
      ];
    }
    if (tab === TABLE_TABS.COST_PRICE) {
      return [
        {
          header: 'Mã sản phẩm',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          accessor: 'product_code',
        },
        {
          header: 'Tên hàng hóa/quy cách',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          accessor: 'product_name',
        },
        {
          header: 'Kho',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          accessor: 'stock_name',
        },
        {
          header: 'TK giá vốn',
          classNameHeader: 'bw_text_center',
          formatter: (_, index) => (
            <FormSelect
              style={{ minWidth: '120px' }}
              bordered
              disabled
              field={`products.${_.imei_code}.cost_account_id`}
              list={accountingOptions?.map((_) => ({
                label: _.code,
                value: _.id,
                name: _.name,
              }))}
            />
          ),
        },
        {
          header: 'TK kho',
          classNameHeader: 'bw_text_center',
          formatter: (_, index) => (
            <FormSelect
              style={{ minWidth: '120px' }}
              bordered
              disabled
              field={`products.${_.imei_code}.stocks_account_id`}
              list={accountingOptions?.map((_) => ({
                label: _.code,
                value: _.id,
                name: _.name,
              }))}
            />
          ),
        },
        {
          header: 'ĐVT',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          accessor: 'product_unit_name',
        },
        {
          header: 'Số lượng',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          accessor: 'quantity',
        },
        {
          header: 'Đơn giá vốn',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => formatPrice(p?.cogs_price, false, ','),
        },
        {
          header: 'Tiền vốn',
          classNameHeader: 'bw_text_center',
          classNameBody: 'bw_text_center',
          formatter: (p) => formatPrice(p?.cogs_price * p.quantity, false, ','),
        },
      ];
    }
  }, [tab, disabled, accountingOptions]);

  return (
    <BWAccordion title={title}>
      <ul class='bw_tabs'>
        {TABLE_TAB_LIST.map((item, idx) => (
          <li class={tab === item.id && 'bw_active'}>
            <a
              href='/'
              class='bw_link'
              key={`invoice_table_tab_${item.id}_${idx}`}
              onClick={(e) => {
                e.preventDefault();
                setTab(item.id);
              }}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      <DataTable
        columns={columns}
        data={Object.values(watch('products') || {})}
        actions={[]}
        // loading={loading}
        noSelect
        noPaging
      />

      <div className='bw_row bw_mt_2'>
        <div className='bw_col_8'></div>
        <div className='bw_col_4'>
          <div className='bw_row'>
            <div className='bw_col_8'>
              <div className='bw_flex bw_align_items_center bw_justify_content_right'>
                <b>Tổng tiền hàng</b>
              </div>
            </div>

            <div className='bw_col_4'>
              <div className='bw_flex bw_align_items_center bw_justify_content_right'>
                <b>{formatPrice(Math.round(watch('_total_money_without_vat')), false, ',')}</b>
              </div>
            </div>
          </div>

          <div className='bw_row bw_mt_1'>
            <div className='bw_col_8'>
              <div className='bw_flex bw_align_items_center bw_justify_content_right'>
                <b>Tổng VAT</b>
              </div>
            </div>

            <div className='bw_col_4'>
              <div className='bw_flex bw_align_items_center bw_justify_content_right'>
                <b>{formatPrice(Math.round(watch('_total_vat')), false, ',')}</b>
              </div>
            </div>
          </div>

          <div className='bw_row bw_mt_1'>
            <div className='bw_col_8'>
              <div className='bw_flex bw_align_items_center bw_justify_content_right'>
                <b>Tổng tiền phải thanh toán</b>
              </div>
            </div>

            <div className='bw_col_4'>
              <div className='bw_flex bw_align_items_center bw_justify_content_right'>
                <b>
                  {formatPrice(
                    Math.round(methods.watch('_total_money_without_vat') + methods.watch('_total_vat')),
                    false,
                    ',',
                  )}
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export default InvoiceTable;
