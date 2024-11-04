import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import ContractInformation from './components/add/ContractInformation';
import ContractAttachment from './components/add/ContractAttachment';
import ContractContent from './components/add/ContractContent';
import { createContract, getContractDetail, updateContract } from 'services/contract.service';

const ContractAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { contract_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;

      const data = new FormData();
      for (var key in payload) {
        if (!payload[key]) {
          continue;
        }

        if (key === 'contract_term_id') data.append(key, payload[key] ? payload[key] : undefined);
        else data.append(key, payload[key]);
      }

      let label;
      if (contract_id) {
        await updateContract(data);
        label = 'Chỉnh sửa';
      } else {
        await createContract(data);
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

  const loadData = useCallback(() => {
    if (contract_id) {
      setLoading(true);
      getContractDetail(contract_id)
        .then((value) => {
          methods.reset({
            ...value,
            company_id: String(value?.company_id),
            working_form_id: String(value?.working_form_id),
            contract_type_id: String(value?.contract_type_id),
            contract_term_id: value?.contract_term_id ? String(value?.contract_term_id) : null,
          });
        })
        .catch((error) => {
          showToast.error(error?.message ?? 'Có lỗi xảy ra', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
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
  }, [contract_id, methods]);

  useEffect(loadData, [loadData]);

  const detailForm = [
    {
      title: 'Thông tin hợp đồng',
      id: 'information',
      component: ContractInformation,
      fieldActive: ['contract_name', 'company_id', 'working_form_id', 'contract_type_id'],
    },
    { title: 'File đính kèm', id: 'attachment', component: ContractAttachment, fieldActive: ['attachment'] },
    { title: 'Nội dung hợp đồng', id: 'content', component: ContractContent, fieldActive: ['content'] },
    { id: 'status', title: 'Trạng thái', component: FormStatus, hiddenSystem: true },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ContractAddPage;
