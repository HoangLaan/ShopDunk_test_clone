import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext } from 'react-hook-form';
import DataTable from 'components/shared/DataTable';
import { formatMoney } from 'utils';
import { VOUCHER_TYPE } from 'pages/ReconcileDebt/utils/constant';
import usePagination from 'hooks/usePagination';

const FIELD_NAME = 'history_list';

const VoucherPayments = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const { items, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({
    data: watch(FIELD_NAME),
    itemsPerPage: 10,
  });

  const columns = [
    {
      header: 'Loại chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        switch (item.voucher_type) {
          case VOUCHER_TYPE.PAYMENTSLIP_CASH:
            return 'Phiếu chi';
          case VOUCHER_TYPE.PAYMENTSLIP_CREDIT:
            return 'Ủy nhiệm chi';
          case VOUCHER_TYPE.OTHER_VOUCHER:
            return 'Chứng từ khác';
          default:
            return 'Không xác định';
        }
      },
    },
    {
      header: 'Ngày chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'accounting_date',
    },
    {
      header: 'Số chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'voucher_code',
    },
    {
      header: 'Số đối trừ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        return formatMoney(item.voucher_reconcile_money);
      },
    },
    {
      header: 'Loại chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: () => 'Đơn mua hàng',
    },
    {
      header: 'Ngày chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'invoice_date',
    },
    {
      header: 'Số chứng từ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'purchase_order_code',
    },
    {
      header: 'Số hóa đơn',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'invoice_no',
    },
    {
      header: 'Số đối trừ',
      disabled: disabled,
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item, index) => {
        return formatMoney(item.invoice_reconcile_money);
      },
    },
  ];

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <DataTable
            page={page}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            onChangePage={onChangePage}
            totalItems={totalItems}
            fieldCheck={'reconcile_history_detail_id'}
            onChangeSelect={(dataSelect) => {
              setValue('selected_history', dataSelect);
            }}
            hiddenDeleteClick
            columns={columns}
            data={items || []}
          />
        </div>
      </div>
    </BWAccordion>
  );
};

export default VoucherPayments;
