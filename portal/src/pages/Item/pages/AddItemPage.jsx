import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { create, getDetail, update } from 'services/item.service';
import { getErrorMessage } from 'utils/index';
import { mapDataOptions4Select, mapDataOptions4SelectCustom, showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import ItemInfo from '../components/section/ItemInfo';
import ItemStatus from '../components/section/ItemStatus';
//compnents

const formDefaultValue = { is_active: 1, is_system: 0, is_budget_creation: 1, is_budget_adjustment: 1 };

const AddItemPage = ({ itemId = null, isEdit = true }) => {
  const methods = useForm({ defaultValues: formDefaultValue });

  const onSubmit = async (values) => {
    let formData = { ...values };
    try {
      if (itemId) {
        await update(itemId, formData);
        showToast.success('Cập nhật thành công !');
      } else {
        await create(formData);
        showToast.success('Thêm thành công !');
        methods.reset({});
      }
    } catch (error) {
      showToast.error(error.message ?? 'Có lỗi xảy ra!');
    }
  };

  const loadItemDetail = useCallback(async () => {
    if (itemId) {
      const detail = await getDetail(itemId);
      methods.reset({
        ...detail,
      });
    }
  }, [itemId, methods]);

  useEffect(() => {
    loadItemDetail();
  }, [loadItemDetail]);

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin khoản mục',
      component: ItemInfo,
      fieldActive: ['company_id', 'item_code', 'item_name'],
    },
    { id: 'status', title: 'Trạng thái', component: ItemStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={!isEdit} />
    </FormProvider>
  );
};

export default AddItemPage;
