import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { create, getDetail, update } from 'services/short-link.service';
// import FormAddressSelect from './components/Form/FormAddressSelect';
import ShortLinkType from './components/ShortLinkType';
import MemberInformationTable from 'pages/Task/components/add/MemberInformationTable';

const ShortLinkAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { id: short_link_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      let label = '';
      if (payload?.short_link_id) {
        await update(payload.short_link_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const detailForm = [
    {
      title: 'Thông tin Shortlink',
      id: 'information_shortlink',
      component: ShortLinkType,
    },
    {
      title: 'Danh sách khách hàng gửi',
      id: 'memberInformation',
      component: MemberInformationTable,
      fieldActive: ['member_list'],
    },
  ];

  const loadDetail = useCallback(() => {
    if (short_link_id) {
      getDetail(short_link_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [short_link_id]);

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} methods={methods} />
    </FormProvider>
  );
};

export default ShortLinkAddPage;
