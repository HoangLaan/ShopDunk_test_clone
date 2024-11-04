import FormStatus from 'components/shared/FormCommon/FormStatus';
import FormSection from 'components/shared/FormSection';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { createProposal, getDetailProposal, updateProposal } from 'services/proposal.service';
import { showToast } from 'utils/helpers';
import ModalPdf from '../components/Modal/ModalPdf';
import GeneralInformation from '../components/add/GeneralInformation';
import ProposalInformation from '../components/add/ProposalInformation';
import ReviewInformation from '../components/add/ReviewInformation';
import { configToast } from '../utils/constants';
const ProposalAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { proposal_id } = useParams();
  const isDetail = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isReview = useMemo(() => pathname.includes('/review'), [pathname]);
  const disabled = isDetail || isReview;
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const [openModalPdf, setOpenModalPdf] = useState(false);

  const onSubmit = async (payload) => {
    try {
      let value = {
        ...payload,
        is_active: payload.is_active ? 1 : 0,
        is_system: payload.is_system ? 1 : 0,
      };
      let label;
      if (proposal_id) {
        await updateProposal(proposal_id, value);
        label = 'Chỉnh sửa';
      } else {
        await createProposal(value);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`, configToast);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra', configToast);
    }
  };

  const loadProposal = useCallback(() => {
    if (proposal_id) {
      getDetailProposal(proposal_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [proposal_id]);

  useEffect(loadProposal, [loadProposal]);

  const detailForm = [
    {
      title: 'Thông tin chung',
      id: 'general',
      isAdd: isAdd,
      isDetail,
      component: GeneralInformation,
      fieldActive: ['created_date', 'created_user'],
    },
    {
      title: 'Thông tin đề xuất',
      id: 'information',
      component: ProposalInformation,
      fieldActive: ['proposal_type_id', 'user_name', 'change_type', 'effective_date'],
    },
    {
      title: 'Thông tin mức duyệt',
      id: 'review',
      isReview: isReview,
      onRefresh: loadProposal,
      component: ReviewInformation,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];
  const actions = [
    {
      icon: 'fi fi-rr-print',
      content: 'In phiếu',
      className: 'bw_btn bw_btn_warning',
      onClick: () => setOpenModalPdf(true),
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        actions={methods.watch('is_review') === 1 || methods.watch('is_review') === 0 ? actions : null}
        disabled={disabled}
        detailForm={detailForm}
        onSubmit={onSubmit}
      />
      <ModalPdf open={openModalPdf} onClose={() => setOpenModalPdf(false)} />
    </FormProvider>
  );
};

export default ProposalAdd;
