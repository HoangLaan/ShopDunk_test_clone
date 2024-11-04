import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import DefaultAccountInformation from './components/add/DefaultAccountInformation';
import {
  createDefaultAccount,
  getDetailDefaultAccount,
  getDocumentOptions,
  updateDefaultAccount,
} from 'services/default-account.service';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { mapDataOptions4Select, showToast } from 'utils/helpers';

const DefaultAccountAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const [documentOptions, setDocumentOptions] = useState([]);
  useEffect(() => {
    getDocumentOptions().then(({ items: data }) => {
      setDocumentOptions(mapDataOptions4Select(data));
    });
  }, []);
  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;

      payload.default_account_list = payload.default_account_list?.map((item) => {
        const keyOne = Object.keys(item)[0];
        return { ...item, [keyOne]: item[keyOne]?.map((i) => i.id ?? i) };
      });

      let label;
      if (id) {
        await updateDefaultAccount(id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createDefaultAccount(payload);
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

  const loadDefaultAccount = useCallback(() => {
    if (id) {
      getDetailDefaultAccount(id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [methods, id]);

  useEffect(loadDefaultAccount, [loadDefaultAccount]);

  const detailForm = [
    {
      title: 'Thông tin tài khoản ngầm định',
      id: 'information',
      disabled,
      component: DefaultAccountInformation,
      fieldActive: ['ac_default_account_name', 'default_account_list'],
      documentOptions,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default DefaultAccountAddPage;
