import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
// Services
import { deleteDebit } from '../helpers/call-api';
import { formatMoney } from 'utils/index';
import BWImage from 'components/shared/BWImage/index';
import { DEBIT_STATUS } from '../helpers/constant';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'context/AuthProvider';
import { toLowerCaseString } from 'utils/string.helper';

const PayDebitTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  handleExportExcel,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const columns = useMemo(
    () => [
      // {
      //   header: 'STT',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   formatter: (_, index) => index + 1,
      // },
      {
        header: 'Đối tượng',
        accessor: 'full_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => {
          // let picture = p?.avatar ? p?.avatar : defaultImage;
          return <div className='bw_inf_pro'>{p?.full_name}</div>;
        },
      },
      {
        header: 'Số hóa đơn',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'ref_code',
        formatter: (p) => {
          if (p.invoice_id) {
            return (
              <a
                href='.'
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `/purchase-orders/detail/${p?.purchase_order_invoice_id}?tab_active=invoice`,
                    '_blank',
                    'rel=noopener noreferrer',
                  );
                }}
                style={{ textDecoration: 'underline' }}>
                {p?.invoice_code}
              </a>
            );
          } else {
            return '-';
          }
        },
      },
      {
        header: 'Số Phiếu',
        classNameHeader: 'bw_text_center',
        accessor: 'ref_code',
        // formatter: (p) => p?.invoice_no ? <p>{p?.invoice_no}</p> : <p>{p?.ref_code}</p>
        // style: { textDecoration: 'underline', color: 'blue' },
        formatter: (p) => {
          return (
            <a
              href='.'
              onClick={(e) => {
                e.preventDefault();
                if (p.purchase_order_id)
                  window.open(`/purchase-orders/detail/${p?.purchase_order_id}`, '_blank', 'rel=noopener noreferrer');
                else if (p?.purchase_cost_id)
                  window.open(`/purchase-cost/detail/${p?.purchase_cost_id}`, '_blank', 'rel=noopener noreferrer');
              }}
              style={{ textDecoration: 'underline' }}>
              {p?.ref_code}
            </a>
          );
        },
      },
      {
        header: 'Số tiền cần trả theo số phiếu (đ)',
        accessor: 'total_money',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => {
          return formatMoney(
            p?.purchase_order_invoice_id ? p?.purchase_order_total_money : p?.purchase_order_id ? p?.total_money : null,
          );
        },
      },
      {
        header: 'Số tiền cần trả theo hóa đơn (đ)',
        accessor: 'total_money',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => {
          return formatMoney(p?.total_money);
        },
      },
      {
        header: 'Đã thanh toán (đ)',
        accessor: 'total_paid',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => {
          return formatMoney(p?.total_paid) || 0;
        },
      },
      {
        header: 'Công nợ (đ)',
        accessor: 'total_amount',
        classNameBody: 'bw_text_right',
        formatter: (p) => {
          return formatMoney(p?.total_amount) || 0;
        },
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái thanh toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          return p?.total_paid - p?.total_money >= 0 ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã thanh toán</span>
          ) : (p?.total_paid ?? 0) === 0 ? (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Chưa thanh toán</span>
          ) : (
            <span className='bw_label_outline text-center'>Thanh toán một phần</span>
          );
        },
      },
      {
        header: 'Thời hạn thanh toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'payment_expire_date',
      },
      {
        header: 'Trạng thái hạn công nợ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          return p.debit_status === DEBIT_STATUS.DONE ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Hoàn thành</span>
          ) : p.debit_status === DEBIT_STATUS.NOT_EXPIRED ? (
            <span className='bw_label_outline text-center'>Chưa quá hạn</span>
          ) : p.debit_status === DEBIT_STATUS.EXPIRED ? (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Đã quá hạn</span>
          ) : p.debit_status === DEBIT_STATUS.DONE_BUT_EXPIRED ? (
            <span className='bw_label_outline bw_label_outline_warning text-center'>Hoàn thành trễ hạn</span>
          ) : null;
        },
      },
      {
        header: 'Loại công nợ',
        accessor: 'debit_type',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.debit_type === 1 ? (
            <span className='bw_label  bw_label_success text-center'>Thu</span>
          ) : (
            <span className='bw_label bw_label_danger text-center'>Trả</span>
          ),
      },
    ],
    [],
  );

  const methods = useForm({
    defaultValues: {
      is_show_btn_cash: 1,
      is_show_btn_transfer: 1,
    },
  });
  const { watch, setValue } = methods;
  const list_pay_selected = watch('list_pay_selected') ?? [];
  // Chỉ có đơn mua hàng là được tạo thanh toán
  const conditionShowBtnGeneral =
    list_pay_selected.length > 0 && list_pay_selected.some((item) => !item.purchase_cost_id);

  const isShowButtonCash = watch('is_show_btn_cash') && conditionShowBtnGeneral;
  const isShowButtonTransfer = watch('is_show_btn_transfer') && conditionShowBtnGeneral;

  const paymentOptions = useGetOptions(optionType.paymentForm);

  const PAYMENT_FORM_INSTANCE = useMemo(
    () => ({
      TRANSFER: paymentOptions.find((item) => toLowerCaseString(item.name) === toLowerCaseString('Chuyển khoản'))?.id,
      CASH: paymentOptions.find((item) => toLowerCaseString(item.name) === toLowerCaseString('Tiền mặt'))?.id,
    }),
    [paymentOptions],
  );

  const { user } = useAuth();
  const handlePay = useCallback(
    (isTransfer = false) => {
      const { company_id, business_id, full_name, supplier_id } = list_pay_selected[0];
      const descriptions = `Trả tiền của ${full_name} theo các mã đơn hàng ${list_pay_selected
        .map((item) => item.invoice_code)
        ?.join(', ')}`;
      const invoice_list = list_pay_selected
        .map((item) => ({
          invoice_id: item.invoice_id,
          invoice_no: item.invoice_code,
          total_payment_price: item.total_amount ?? 0,
          purchase_order_id: item.purchase_order_id,
          created_date: item.invoice_created_date,
          remaining_price: item.total_amount ?? 0,
        }))
        .sort((a, b) => {
          // Sắp xếp theo ngày hóa đơn tăng dần
          const _a = a.created_date.split('/').reverse().join(),
            _b = b.created_date.split('/').reverse().join();
          return _a < _b ? -1 : _a > _b ? 1 : 0;
        });
      let data_payment = {
        receiver_type: 1, // Mặc định là nhà cung cấp
        receiver_name: full_name,
        receiver_id: supplier_id,
        business_id: user.user_business && user.user_business.length > 0 ? parseInt(user.user_business[0]) : null,
        payer_id: user.user_name,
        payer_name: `${user.user_name} - ${user.full_name}`,
        company_id: parseInt(company_id),
        descriptions,
        accounting_list: [
          {
            explain: descriptions,
            money: list_pay_selected.reduce((acc, cur) => (acc += cur.total_amount ?? 0), 0),
            credit_account: isTransfer ? 6 : 2, // Mặc định là 1111
            debt_account: 114, // Mặc định là 331
          },
        ],
        total_money: list_pay_selected.reduce((acc, cur) => (acc += cur.total_amount ?? 0), 0),
        payment_form_id: isTransfer ? PAYMENT_FORM_INSTANCE.TRANSFER : PAYMENT_FORM_INSTANCE.CASH,
        invoice_payment_list: invoice_list,
        invoice_options: invoice_list.map((item) => ({
          ...item,
          value: item.invoice_id,
          label: item.invoice_no,
        })),
        invoice_ids: list_pay_selected.map((item) => item.invoice_id),
        is_from_pay_debit: 1,
      };
      history.push(`/receive-payment-slip-${isTransfer ? 'credit' : 'cash'}/add?type=2`, {
        data_payment_from_pay_debt: data_payment,
      });
    },
    [list_pay_selected],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thanh toán tiền mặt',
        hidden: !isShowButtonCash,
        permission: 'MD_DEBIT_PAY_CASH',
        onClick: () => {
          handlePay();
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thanh toán chuyển khoản',
        hidden: !isShowButtonTransfer,
        permission: 'MD_DEBIT_PAY_TRANSFER',
        onClick: () => {
          handlePay(true);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'MD_DEBIT_PAY_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/pay-debit/detail/${p?.debit_id}`);
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'warning',
        content: 'Xuất excel',
        hidden: data?.length === 0,
        permission: 'MD_DEBIT_PAY_EXPORT',
        onClick: () => {
          handleExportExcel();
        },
      },

      // {
      //   icon: 'fi fi-rr-trash',
      //   color: 'red',
      //   title: 'Xóa',
      //   permissions: 'MD_DEBIT_PAY_DEL',
      //   onClick: (_, d) =>
      //     dispatch(
      //       showConfirmModal(
      //         ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
      //         // () =>
      //         //     handleDelete(`${_.time_keeping_confirm_date_id}`),
      //         async () => {
      //           await deleteDebit({ list_id: `${_?.debit_id}` });
      //           onRefresh();
      //         },
      //       ),
      //     ),
      // },
    ];
  }, [list_pay_selected, isShowButtonCash, isShowButtonTransfer]);
  // }, [dispatch, onRefresh,handleClick]);

  // const handleDelete = async (arr) => {
  //     await deleteDebit({ list_id: arr });
  //     onRefresh();
  // };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.debit_id)?.join(',');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], async () => {
          await deleteDebit({ list_id: arrDel });
          onRefresh();
          //     handleDelete(arrDel)
          //     // (items || []).forEach((item) => {
          //     //   handleDelete(item.solution_id);
          //     // });
        }),
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <DataTable
        hiddenDeleteClick
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={handleBulkAction}
        onChangeSelect={(data, valueSelected) => {
          if (!valueSelected) return;
          const list_pay_selected = watch('list_pay_selected') ?? [];
          if (
            list_pay_selected.find((item) => item.supplier_id !== valueSelected.supplier_id) &&
            valueSelected.isChecked
          ) {
            setValue('is_show_btn_transfer', 0);
            setValue('is_show_btn_cash', 0);
            return showToast.error('Bạn chỉ có thể chọn từ 1 nhà cung cấp !');
          }

          if (valueSelected?.total_paid - valueSelected?.total_money >= 0 && valueSelected.isChecked) {
            setValue('is_show_btn_transfer', 0);
            setValue('is_show_btn_cash', 0);
            return;
          }

          setValue('is_show_btn_transfer', 1);
          setValue('is_show_btn_cash', 1);
          setValue('list_pay_selected', data);
        }}
      />
    </FormProvider>
  );
};

export default PayDebitTable;
