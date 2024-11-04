import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { cdnPath, urlToList } from 'utils';

import { create, update, getById } from 'services/other-acc-voucher.service';
import Information from '../components/FormSection/Infomation';
import AccountingInvoice from '../components/FormSection/AccountingInvoice';
import AttachmentList from '../components/FormSection/Attachments';
import { exportPDF } from 'services/other-acc-voucher.service';

import { showToast } from 'utils/helpers';
import { DefaultValue } from '../utils/constant';
import { PERMISSIONS } from '../utils/permission';

const OtherVoucherAdd = () => {
  const methods = useForm({
    defaultValues: DefaultValue,
  });

  const history = useHistory();
  const path = urlToList(useLocation().pathname)[0];

  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();
  const { id: other_voucher_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      if (other_voucher_id) {
        await update(payload);

        if (methods.watch('bookeeping_status') === 1) {
          showToast.success(`Lưu và ghi sổ thành công !`);
        } else if (methods.watch('bookeeping_status') === 0) {
          showToast.success(`Bỏ ghi sổ thành công !`);
        } else {
          showToast.success(`Cập nhật thành công !`);
        }
      } else {
        await create(payload);
        methods.reset(DefaultValue);
        showToast.success(`Thêm mới thành công !`);
      }
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleExportPDF = (otherVoucherId) => {
    setLoading(true);
    exportPDF({ other_voucher_id: otherVoucherId })
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadDetail = useCallback(() => {
    if (other_voucher_id) {
      setLoading(true);
      getById(other_voucher_id)
        .then((value) => {
          methods.reset(value);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset(DefaultValue);
    }
  }, [other_voucher_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin chứng từ',
      id: 'other_acc_voucher_info',
      component: Information,
      fieldActive: false,
    },
    {
      title: 'Hạch toán & Thuế',
      id: 'other_acc_voucher_invoice',
      component: AccountingInvoice,
      fieldActive: false,
    },
    {
      title: 'Tệp đính kèm',
      id: 'other_acc_voucher_documents',
      component: AttachmentList,
      fieldActive: false,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  const customActions = useMemo(() => {
    if (!other_voucher_id) {
      // thêm mới
      return [
        {
          icon: 'fi fi-rr-edit',
          submit: true,
          content: 'Lưu và ghi sổ',
          permission: PERMISSIONS.AC_OTHERACCVOUCHER_ADD,
          onClick: () => {
            methods.setValue('is_bookkeeping', 1);
            methods.setValue('bookeeping_status', 1);
          },
          className: 'bw_btn bw_btn_warning',
        },
        {
          icon: 'fi fi-rr-edit',
          submit: true,
          permission: PERMISSIONS.AC_OTHERACCVOUCHER_ADD,
          content: 'Lưu',
          onClick: () => {
            methods.setValue('bookeeping_status', 2);
          },
          className: 'bw_btn bw_btn_success',
        },
      ];
    } else if (other_voucher_id && !methods.watch('is_bookkeeping') && !disabled) {
      // chỉnh sửa và chưa ghi sổ
      return [
        {
          icon: 'fi fi-rr-print',
          content: 'In phiếu',
          outline: true,
          permission: PERMISSIONS.AC_OTHERACCVOUCHER_PRINT,
          onClick: () => {
            handleExportPDF(other_voucher_id);
          },
          className: 'bw_btn bw_btn_warning',
        },
        {
          icon: 'fi fi-rr-edit',
          submit: true,
          content: 'Lưu và ghi sổ',
          permission: PERMISSIONS.AC_OTHERACCVOUCHER_ADD,
          onClick: () => {
            methods.setValue('is_bookkeeping', 1);
            methods.setValue('bookeeping_status', 1);
          },
          className: 'bw_btn bw_btn_warning',
        },
        {
          icon: 'fi fi-rr-edit',
          submit: true,
          permission: PERMISSIONS.AC_OTHERACCVOUCHER_ADD,
          content: 'Lưu',
          onClick: () => {
            methods.setValue('bookeeping_status', 2);
          },
          className: 'bw_btn bw_btn_success',
        },
      ];
    } else if (other_voucher_id && methods.watch('is_bookkeeping') && !disabled) {
      // chỉnh sửa và đã ghi sổ
      return [
        {
          icon: 'fi fi-rr-print',
          content: 'In phiếu',
          outline: true,
          permission: PERMISSIONS.AC_OTHERACCVOUCHER_PRINT,
          onClick: () => {
            handleExportPDF(other_voucher_id);
          },
          className: 'bw_btn bw_btn_warning',
        },
        {
          icon: 'fi fi-rr-edit',
          submit: true,
          content: 'Bỏ ghi sổ',
          onClick: () => {
            methods.setValue('is_bookkeeping', 0);
            methods.setValue('bookeeping_status', 0);
          },
          className: 'bw_btn bw_btn_danger',
        },
      ];
    }

    return [
      {
        icon: 'fi fi-rr-print',
        content: 'In phiếu',
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_PRINT,
        onClick: () => {
          handleExportPDF(other_voucher_id);
        },
        className: 'bw_btn bw_btn_warning',
      },
      {
        content: 'Chỉnh sửa',
        outline: true,
        permission: PERMISSIONS.AC_OTHERACCVOUCHER_EDIT,
        onClick: () => {
          history.push(`${path}/edit/${other_voucher_id}`);
        },
      },
    ];
  }, [other_voucher_id, methods.watch('is_bookkeeping')]);

  return (
    <FormProvider {...methods}>
      <FormSection
        actions={customActions}
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={disabled || !!(other_voucher_id && methods.watch('is_bookkeeping'))}
        loading={loading}
      />
    </FormProvider>
  );
};

export default OtherVoucherAdd;
