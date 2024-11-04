import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

import { create, update, getDetail } from 'services/product-attribute.service';
import { optionsAttribute } from './helper/index';
import FormSection from 'components/shared/FormSection';

//components
import { ProductAttributeInfo, ProductAttributeStatus, ProductAttributeValue } from './components/ProductAttributeAdd';
const ProductAttributeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      attribute_type: 1,
    },
  });
  const { pathname } = useLocation();
  
  const { id: product_attribute_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const onSubmit = async (values) => {
    try {
      let payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
        ...(optionsAttribute || []).reduce((o, x) => {
          o[x.key] = 0;
          return o;
        }, {}),
        [(optionsAttribute || []).find((e) => e.value === values.attribute_type)?.key]: 1,
      };
      let label;
      if (product_attribute_id) {
        await update(product_attribute_id, payload);
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

  const loadProductAttributeDetail = useCallback(() => {
    if (product_attribute_id) {
      getDetail(product_attribute_id).then((value) => {
        methods.reset({
          ...value,
          attribute_type: optionsAttribute.find((x) => value[x.key] * 1 === 1)?.value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
        attribute_type: 1,
      });
    }
  }, [product_attribute_id, methods]);

  useEffect(loadProductAttributeDetail, [loadProductAttributeDetail]);

  const detailForm = [
    {
      title: 'Thông tin thuộc tính',
      id: 'information',
      component: ProductAttributeInfo,
      fieldActive: ['attribute_name', 'attribute_type', 'unit_id'],
    },
    {
      title: 'Giá trị',
      id: 'values',
      component: ProductAttributeValue,
      fieldActive: [
        ...(methods.watch('attribute_value_list') || []).map((_, idx) => {
          return `attribute_value_list[${idx}].attribute_values`;
        }),
      ],
    },
    { id: 'status', title: 'Trạng thái', component: ProductAttributeStatus },
  ];
  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default ProductAttributeAddPage;
