import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import BWAccordion from 'components/shared/BWAccordion';
import { SLIP_REVIEW_STATUS, SLIP_TYPE } from 'pages/InternalTransfer/helpers/const';
import TooltipHanlde from 'components/shared/TooltipWrapper';

const ReceiveSlipTable = ({ isView, title }) => {
  const { watch, setValue, reset, getValues } = useFormContext();
  const isTransferType = watch('payment_type') === 2;

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Loại chứng từ',
        classNameHeader: 'bw_text_center',
        formatter: (p) => SLIP_TYPE[p.slip_type] ?? '',
      },
      {
        header: 'Số chứng từ',
        accessor: 'slip_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Diễn giải',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <TooltipHanlde maxString={50}>{p.slip_title}</TooltipHanlde>,
      },
      {
        header: 'Ngày chứng từ',
        accessor: 'accounting_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Nhân viên thực hiện',
        accessor: 'user_doing',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái chứng từ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          const instanceReview = SLIP_REVIEW_STATUS.find((item) => item.value === parseInt(p.slip_review_status));
          if (!instanceReview) return;

          return (
            <span className={`bw_label_outline bw_label_outline_${instanceReview.color} text-center`}>
              {instanceReview.label}
            </span>
          );
        },
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SL_INTERNALTRANSFER_RECEIVEPAYMENTSLIP_VIEW',
        onClick: (p) =>
          window._$g.rdr(
            `/receive-payment-slip-${isTransferType ? 'credit' : 'cash'}/detail/${p.slip_id}_${p.slip_type}`,
          ),
      },
    ];
  }, [isTransferType]);

  return (
    <>
      {isView && (
        <BWAccordion title={title}>
          <DataTable
            noPaging
            noSelect
            columns={columns}
            data={watch('receive_payment_slip_list') ?? []}
            actions={actions}
          />
        </BWAccordion>
      )}
    </>
  );
};

export default ReceiveSlipTable;
