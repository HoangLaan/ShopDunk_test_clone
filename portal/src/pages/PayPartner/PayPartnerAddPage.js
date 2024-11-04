import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';
import Panel from 'components/shared/Panel/index';
import PayPartnerAdd from './components/add/PayPartnerAdd';
import { ToastStyle } from './utils/constants';
import ApiInformation from './components/add/ApiInformation';
import { createPayPartner, getDetailPayPartner, updatePayPartner } from 'services/pay-partner.service';

const PayPartnerAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { pay_partner_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      let file = payload.documents?.length > 0 ? payload.documents[0] : null;
      let value = {
        ...payload,
        list_api: payload.list_api?.map((x) => ({
          ...x,
          is_default: x.is_default ? 1 : 0,
        })),
        is_active: payload.is_active ? 1 : 0,
        is_system: payload.is_system ? 1 : 0,
        file_name: file ? file.file_name : null,
        file_name_path: file ? file.file_name_path : null,
      };
      //
      let label;
      if (pay_partner_id) {
        await updatePayPartner(pay_partner_id, value);
        label = 'Chỉnh sửa';
      } else {
        await createPayPartner(value);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`, ToastStyle);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra', ToastStyle);
    }
  };

  const loadPayPartner = useCallback(() => {
    if (pay_partner_id) {
      getDetailPayPartner(pay_partner_id).then((value) => {
        methods.reset({
          ...value,
          documents: value.file_name
            ? [
                {
                  file_name: value.file_name,
                  file_name_path: value.file_name_path,
                },
              ]
            : [],
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [pay_partner_id]);

  useEffect(loadPayPartner, [loadPayPartner]);

  const panel = [
    {
      label: 'Thông tin chung',
      key: 'information',
      disabled: disabled,
      component: PayPartnerAdd,
      hidden: false,
    },
    {
      label: 'Thông tin API',
      key: 'api_information',
      disabled: disabled,
      component: ApiInformation,
      hidden: false,
    },
  ];
  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <Panel hasSubmit onSubmit={onSubmit} panes={panel} />
      </div>
    </FormProvider>
  );
};

export default PayPartnerAddPage;
