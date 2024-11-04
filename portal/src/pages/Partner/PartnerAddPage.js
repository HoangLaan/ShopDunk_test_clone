import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import PartnerInformation from 'pages/Partner/components/add/PartnerInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { createPartner, getDetailPartner, updatePartner } from 'services/partner.service';

const PartnerAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { partner_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      let value = {
        ...payload,
        is_active: payload.is_active ? 1 : 0,
        is_system: payload.is_system ? 1 : 0,
      };
      let label;
      if (partner_id) {
        await updatePartner(partner_id, value);
        label = 'Chỉnh sửa';
      } else {
        await createPartner(value);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const loadPartner = useCallback(() => {
    if (partner_id) {
      getDetailPartner(partner_id).then((value) => {
        methods.reset({
          ...value,
          caring_user: +value.caring_user,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        representative_gender: 1,
      });
    }
  }, [partner_id]);

  useEffect(loadPartner, [loadPartner]);

  const detailForm = [
    {
      title: 'Thông tin khách hàng DN',
      id: 'information',
      component: PartnerInformation,
      fieldActive: ['partner_name'],
    },

    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default PartnerAddPage;
