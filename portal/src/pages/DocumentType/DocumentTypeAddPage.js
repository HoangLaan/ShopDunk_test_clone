import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { create, update, getDetail } from 'services/document-type.service';
import { useLocation, useParams } from 'react-router-dom';
//components
import { DocumentTypeInfo, DocumentTypeStatus } from './components/DocumentTypeAdd';
const DocumentTypeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { id: document_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.is_managed_document = 0;
      let label;
      if (document_type_id) {
        await update(document_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDoctumentTypeDetail = useCallback(() => {
    if (document_type_id) {
      getDetail(document_type_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }

  }, [document_type_id]);

  useEffect(loadDoctumentTypeDetail, [loadDoctumentTypeDetail, document_type_id]);

  const detailForm = [
    {
      title: 'Thông tin loại hồ sơ',
      id: 'information',
      component: DocumentTypeInfo,
      fieldActive: ['document_type_name'],
    },
    { id: 'status', title: 'Trạng thái', component: DocumentTypeStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default DocumentTypeAddPage;
