import FormSection from 'components/shared/FormSection/index';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import BrandInfo from './components/Form/BrandInfo';
import BrandStatus from './components/Form/BrandStatus';
import { createBrand, getDetail, updateBrand } from 'services/brand.service';
import { showToast } from 'utils/helpers';
const BrandAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { brand_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;

      let label;
      if (brand_id) {
        await updateBrand(brand_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createBrand(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (brand_id) {
      getDetail(brand_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [brand_id]);
  useEffect(loadDetail, [loadDetail]);

  const detailForm = [
    {
      title: 'Thông tin thương hiệu',
      id: 'information',
      component: BrandInfo,
      fieldActive: ['brand_name', 'brand_code', 'company_id'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: BrandStatus,
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default BrandAdd;
