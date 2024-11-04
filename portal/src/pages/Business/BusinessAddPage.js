import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import BusinessInformation from './components/add/BusinessInformation';
import AddressSelectAccordion from 'components/shared/AddressSelectAccordion/index';
import { create, getDetail, update } from 'services/business.service';
import BusinessBankAccountListTable from './components/add/BusinessBankAccountListTable';
import { showToast } from 'utils/helpers';
import BusinessMisaAccount from './components/add/BusinessMisa';

const BusinessAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { business_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.is_business_place = payload.is_business_place ? 1 : 0;
      payload.bank_account_list = payload.bank_account_list?.map((item) => {
        return { ...item, is_default: item.is_default ? 1 : 0 };
      });

      let label;
      if (business_id) {
        await update(payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const loadBusiness = useCallback(() => {
    if (business_id) {
      setLoading(true);
      getDetail(business_id)
        .then((value) => {
          methods.reset({
            ...value,
            bank_account_list: value.bank_account_list?.map((item) => {
              return { ...item, bank_id: String(item.bank_id) };
            }),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [business_id, methods]);

  useEffect(loadBusiness, [loadBusiness]);

  const detailForm = [
    {
      title: 'Thông tin miền',
      id: 'information',
      component: BusinessInformation,
      fieldActive: [
        'business_code',
        'business_name',
        'company_id',
        'area_id',
        'business_type_id',
        'business_phone_number',
        'business_mail',
      ],
    },
    {
      id: 'address',
      title: 'Địa chỉ',
      component: AddressSelectAccordion,
      fieldActive: ['country_id', 'province_id', 'district_id', 'ward_id', 'postal_code', 'address'],
    },
    {
      id: 'misa-account',
      title: 'Tài khoản Misa',
      component: BusinessMisaAccount,
      fieldActive: ['misa_username', 'misa_password'],
    },
    { id: 'bank_account', title: 'Tài khoản ngân hàng', component: BusinessBankAccountListTable },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default BusinessAddPage;
