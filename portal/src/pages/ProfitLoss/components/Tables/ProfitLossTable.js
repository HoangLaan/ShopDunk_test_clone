import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import profitLossService from 'services/profitLoss.service';
import { CHANGE_TYPE, PROFIT_LOSS_PERMISSION, RulePrice } from 'pages/ProfitLoss/utils/constants';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { useFormContext } from 'react-hook-form';
import { formatPrice } from 'utils';
import { calculateDiscount } from 'pages/ProfitLoss/utils/helper';
import { useHistory } from 'react-router-dom';

const FIELD_LIST = 'list';

const ProfitLossTable = ({ params, onChangePage, exportExcel }) => {
  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });
  const methods = useFormContext();
  const { watch } = methods;

  const [selectedData, setSelectedData] = useState([]);
  const history = useHistory();

  const updatePrice = useCallback((item, index, changeType) => {
    const fullPrice = item?.full_price || 0;
    const categoryPercent = item?.category_percent || 0;
    const vatValue = item?.vat_value || 0;

    const p1Vat = (fullPrice * (1 - categoryPercent / 100)) / (1 + vatValue / 100);
    const rebateValue = (p1Vat * item?.rebate_percent) / 100;

    const sumDiscountValue = item.discount_programs?.reduce((total, program) => {
      return total + (item[`dynamic_column_${program.discount_program_id}`] || 0);
    }, 0);

    const netVat = p1Vat - rebateValue - sumDiscountValue;
    const netFullVat = netVat * (1 + vatValue / 100);

    if (changeType === CHANGE_TYPE.SUGGESTD_PRICE) {
      const profitPercent = netFullVat ? ((item.suggested_price - netFullVat) / netFullVat) * 100 : 0;
      methods.setValue(`${FIELD_LIST}.${index}.profit_percent`, Math.round(profitPercent * 100) / 100);
    } else if (changeType === CHANGE_TYPE.PROFIT_PERCENT) {
      const suggestedPrice = netFullVat * (item.profit_percent / 100 + 1);
      methods.setValue(`${FIELD_LIST}.${index}.suggested_price`, Math.round(suggestedPrice));
    }

    const profitPrice = watch(`${FIELD_LIST}.${index}.suggested_price`) - netFullVat;

    methods.setValue(`${FIELD_LIST}.${index}.p1_vat`, p1Vat);
    methods.setValue(`${FIELD_LIST}.${index}.rebate_value`, rebateValue);
    methods.setValue(`${FIELD_LIST}.${index}.net_vat_price`, netVat);
    methods.setValue(`${FIELD_LIST}.${index}.net_price_full_vat`, netFullVat);
    methods.setValue(`${FIELD_LIST}.${index}.profit_price`, profitPrice);
  }, []);

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    profitLossService
      .getList(params)
      .then((data) => {
        setDataRows(data);
        methods.setValue(FIELD_LIST, data.items || []);
      })
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(loadData, [loadData]);

  // calculate dynamic discount for all products
  useEffect(() => {
    const products = watch(FIELD_LIST);
    products?.forEach((product, index) => {
      product.discount_programs?.forEach((program) => {
        const discountPrice = calculateDiscount(program, product);
        methods.setValue(`${FIELD_LIST}.${index}.dynamic_column_${program?.discount_program_id}`, discountPrice);
      });
    });
  }, [watch(FIELD_LIST)]);

  const columns = useMemo(() => {
    const topColumns = [
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        formatter: (p) => (
          <div style={{ minWidth: '400px', maxWidth: '600px', whiteSpace: 'initial' }}>{p.product_name}</div>
        ),
      },
      {
        header: 'Giá NY Full Vat (P3)',
        accessor: 'full_price',
        formatter: (item, index) => {
          return (
            <FormNumber
              style={{ minWidth: '120px' }}
              onChange={(value = 0) => {
                const field = `${FIELD_LIST}.${index}.full_price`;
                methods.clearErrors(field);
                methods.setValue(field, value);
                item.full_price = value;
                updatePrice(item, index);
              }}
              bordered
              field={`${FIELD_LIST}.${index}.full_price`}
              validation={RulePrice}
            />
          );
        },
      },
      {
        header: 'P1-VAT',
        accessor: 'p1_vat',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (item) => formatPrice(Math.round(item?.p1_vat || 0), false, ','),
      },
      {
        header: 'Rebate 1.5% (*P1)',
        accessor: 'rebate_value',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (item) => formatPrice(Math.round(item?.rebate_value || 0), false, ','),
      },
    ];

    const dynamicColumns =
      watch('discount_programs')?.map((program) => ({
        header: program.label,
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: `dynamic_column_${program?.value}`,
        formatter: (item) =>
          item.discount_programs?.find((_) => _.discount_program_id === program?.value) ? (
            formatPrice(item?.[`dynamic_column_${program?.value}`], false, ',')
          ) : (
            <sapn className='bw_label_outline text-center bw_label_outline_warning'>Không áp dụng</sapn>
          ),
      })) || [];

    const bottomColumns = [
      {
        header: 'Net - VAT',
        accessor: 'net_vat_price',
        formatter: (p) => formatPrice(Math.round(p.net_vat_price || 0), false, ','),
      },
      {
        header: 'Giá Net Full VAT',
        accessor: 'net_price_full_vat',
        formatter: (p) => formatPrice(Math.round(p.net_price_full_vat || 0), false, ','),
      },
      {
        header: 'Giá bán đề xuất',
        accessor: 'suggested_price',
        formatter: (item, index) => {
          return (
            <FormNumber
              style={{ minWidth: '120px' }}
              onChange={(value = 0) => {
                const field = `${FIELD_LIST}.${index}.suggested_price`;
                methods.clearErrors(field);
                item.suggested_price = value;
                updatePrice(item, index, CHANGE_TYPE.SUGGESTD_PRICE);
              }}
              bordered
              field={`${FIELD_LIST}.${index}.suggested_price`}
              validation={RulePrice}
            />
          );
        },
      },
      {
        header: 'Lợi nhuận (%)',
        accessor: 'profit_percent',
        formatter: (item, index) => {
          return (
            <FormNumber
              style={{ minWidth: '70px' }}
              onChange={(value = 0) => {
                const field = `${FIELD_LIST}.${index}.profit_percent`;
                methods.clearErrors(field);
                methods.setValue(field, value);
                item.profit_percent = value;
                updatePrice(item, index, CHANGE_TYPE.PROFIT_PERCENT);
              }}
              bordered
              field={`${FIELD_LIST}.${index}.profit_percent`}
              addonAfter='%'
            />
          );
        },
      },
      {
        header: 'Số tiền lợi nhuận dự kiến',
        accessor: 'profit_price',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => formatPrice(Math.round(p.profit_price || 0), false, ','),
      },
    ];

    return [...topColumns, ...dynamicColumns, ...bottomColumns];
  }, [watch('discount_programs')]);

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-check',
        type: 'warning',
        submit: true,
        content: 'Lưu',
        permission: PROFIT_LOSS_PERMISSION.ADD,
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'primary',
        style: { marginLeft: '5px' },
        content: 'Xuất Excel',
        permission: PROFIT_LOSS_PERMISSION.EXPORT,
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-dollar',
        type: 'danger',
        style: { marginLeft: '5px' },
        content: 'Làm giá',
        hidden: !selectedData?.length > 0,
        permission: PROFIT_LOSS_PERMISSION.MAKE_PRICE,
        onClick: () => {
          const PRODUCT_TYPE = 2;
          history.push(`/prices-list/add`, {
            productType: PRODUCT_TYPE,
            priceVat: selectedData[0]?.suggested_price || 0,
            productPrices: selectedData.reduce(
              (acc, product) => ({
                ...acc,
                ['key' + product.product_id]: {
                  product_id: Number(product.product_id),
                  product_name: product.product_name,
                  product_imei: null,
                  product_code: product.product_code,
                  category_name: product.category_name,
                  manufacture_name: product.manufacturer_name,
                  model_id: product.model_id,
                  model_name: product.model_name,
                  unit_id: product.unit_id,
                  unit_name: product.unit_name,
                  product_type: PRODUCT_TYPE,
                  picture_url: null,
                  stocks_name: null,
                  activation_date: null,
                },
              }),
              {},
            ),
          });
        },
      },
    ],
    [selectedData],
  );

  return (
    <DataTable
      hiddenDeleteClick
      onChangeSelect={setSelectedData}
      actions={actions}
      loading={dataRows.loading}
      columns={columns}
      data={watch(FIELD_LIST) || []}
      totalPages={dataRows.totalPages}
      itemsPerPage={dataRows.itemsPerPage}
      page={dataRows.page}
      totalItems={dataRows.totalItems}
      onChangePage={onChangePage}
    />
  );
};

export default ProfitLossTable;
