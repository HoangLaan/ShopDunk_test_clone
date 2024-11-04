import React from 'react';
//context
import { PCAProvider } from 'pages/ProductCategory/helpers/context';
//compnents
import FormSection from 'components/shared/FormSection/index';
import AttributesAdd from './modals/AttributesModalAdd';
import ProductCategoryInfo from './ProductCategoryInfo';
import ProductCategoryPictures from './ProductCategoryPictures';
import ProductCategoryDescription from './ProductCategoryDescription';
import ProductCategoryAttribute from './ProductCategoryAttribute';
import ProductCategoryFunction from './ProductCategoryFunction';
import ProductCategoryStatus from './ProductCategoryStatus';

export default function ProductCategoryCommonInfo({ disabled, loading }) {
  const detailForm = [
    {
      title: 'Thông tin ngành hàng',
      id: 'bw_info',
      fieldActive: ['category_name', 'company_id', 'vat_id'],
      component: ProductCategoryInfo,
    },
    {
      title: 'Ảnh ngành hàng',
      id: 'pictures',
      fieldActive: ['pictures'],
      component: ProductCategoryPictures,
    },
    {
      title: 'Mô tả',
      id: 'bw_des',
      component: ProductCategoryDescription,
    },
    {
      title: 'Thuộc tính sản phẩm',
      id: 'bw_info_more',
      fieldActive: ['attributes'],
      component: ProductCategoryAttribute,
    },
    {
      title: 'Thông tin quyền',
      id: 'bw_account_cus',
      fieldActive: ['add_function_id', 'edit_function_id', 'delete_function_id', 'view_function_id'],
      component: ProductCategoryFunction,
    },
    {
      title: 'Trạng thái',
      id: 'bw_mores',
      component: ProductCategoryStatus,
    },
  ];

  return (
    <PCAProvider>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} />

      <AttributesAdd />
    </PCAProvider>
  );
}
