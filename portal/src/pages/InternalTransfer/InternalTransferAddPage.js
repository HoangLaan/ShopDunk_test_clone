import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  createInternalTransfer,
  genCode,
  getDetailInternalTransfer,
  updateInternalTransfer,
} from 'services/internal-transfer.service';
import { useLocation, useParams } from 'react-router-dom';
import FormSection from 'components/shared/FormSection';
import InternalTransferInformation from './components/InternalTransferInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
import ReviewLevelTable from './components/ReviewLevel/ReviewLevelTable';
import AccountingTable from './components/Accounting/AccountingTable';
import ReceiveSlipTable from './components/ReceiveSlip/ReceiveSlipTable';
import Attachments from './components/Attachments/Attachments';
import moment from 'moment';
const InternalTransferAddPage = () => {
  const defaultValues = useMemo(
    () => ({
      is_active: 1,
      is_system: 0,
      currency_type: 1,
      payment_type: 1,
      review_status: 0, // Chờ duyệt
      created_date: moment().format('DD/MM/YYYY'),
      accounting_date: moment().format('DD/MM/YYYY'),
      accounting_list: [],
      review_level_list: [],
      attachment_list: [],
      status_receive_money: 0,
    }),
    [],
  );
  const methods = useForm({ defaultValues });
  const { reset, getValues, watch } = methods;
  const { pathname } = useLocation();
  const { id } = useParams();
  const isReviewed = watch('review_status') !== 0;

  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    const label = id ? 'Chỉnh sửa' : 'Thêm mới';
    try {
      await (id ? updateInternalTransfer(payload) : createInternalTransfer(payload));
      if (!id) methods.reset({ ...defaultValues, internal_transfer_code: await genCode() });

      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error.message ?? `${label} thất bại`);
    }
  };

  const loadDetail = useCallback(async () => {
    if (id) {
      getDetailInternalTransfer(id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      reset({ ...getValues(), internal_transfer_code: await genCode() });
    }
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const detailForm = [
    {
      title: 'Thông tin chuyển tiền nội bộ',
      id: 'information',
      disabled,
      component: InternalTransferInformation,
      fieldActive: ['internal_transfer_name'],
    },
    {
      title: 'Hạch toán',
      id: 'information',
      disabled: disabled || isReviewed,
      component: AccountingTable,
      fieldActive: ['internal_transfer_name'],
    },
    {
      title: 'Thông tin duyệt',
      id: 'information',
      disabled: disabled || isReviewed,
      component: ReviewLevelTable,
      fieldActive: ['internal_transfer_name'],
      onRefresh: loadDetail,
    },
    {
      id: 'document',
      title: 'File bổ sung',
      fieldActive: ['attachment_list'],
      component: Attachments,
      onRefresh: loadDetail,
    },
    {
      // Sau khi phiếu đã duyệt toàn bộ thì mới hiện, lấy ra danh sách toàn bộ phiếu thu / chi và phiếu ủy nhiệm thu / chi
      title: 'Chứng từ kèm theo',
      id: 'information',
      isView: isReviewed,
      component: ReceiveSlipTable,
      fieldActive: ['internal_transfer_name'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  const actions = [
    {
      globalAction: true,
      className: 'bw_btn bw_btn_success',
      icon: 'fi fi-rr-check',
      type: 'success',
      content: disabled ? 'Chỉnh sửa' : id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      hidden: isReviewed,
      onClick: () => {
        if (disabled) return window._$g.rdr(`/internal-transfer/edit/${id}`);
        methods.handleSubmit(onSubmit)();
      },
    },
  ];

  return (
    <React.Fragment>
      <FormProvider {...methods}>
        <FormSection actions={actions} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
      </FormProvider>
    </React.Fragment>
  );
};

export default InternalTransferAddPage;
