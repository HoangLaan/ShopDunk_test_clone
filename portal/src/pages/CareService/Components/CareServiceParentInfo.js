import React from 'react';
import { PCAProvider } from 'pages/ProductCategory/helpers/context';
import FormSection from 'components/shared/FormSection/index';
import CareServiceInfo from './TabVnComponents/CareServiceInfo';
import CareServiceInfoExpense from './TabVnComponents/CareServiceInfoExpense';
import SeoInfo from './TabVnComponents/SeoInfo';
import Descirption from './TabVnComponents/Descirption';
import DescirptionReason from './TabVnComponents/DescirptionReason';
import CareServiceStatus from './TabVnComponents/CareServiceStatus';
import CareServicePictureInfo from './TabVnComponents/CareServicePictureInfo';
import PurchaseRequisitionProductListTable from '../Components/add/PurchaseRequisitionProductListTable';
import CareServiceListTable from '../Components/add/ProductRepairListTable';
import PromotionListTable from '../Components/add/PromotionListTable';


export default function CareServiceParentInfo({ disabled, loading }) {
  const detailForm = [
    {
      title: 'Thông tin dịch vụ',
      id: 'bw_info',
      fieldActive: ['category_name', 'company_id', 'vat_id'],
      component: CareServiceInfo,
    },

    { 
      id: 'CareServiceListTable',
      title: 'Sản phẩm sửa chữa',
      component: CareServiceListTable
    },

    {
      title: 'Nhóm dịch vụ cha',
      id: 'pictures',
      fieldActive: ['bw_des'],
      component: CareServiceInfoExpense,
    },

    {
      title: 'Hình ảnh',
      id: 'bw_info_more',
      fieldActive: ['pictures'],
      component: CareServicePictureInfo,
    },

    
    { 
      id: 'review',
      title: 'Thông tin sản phẩm',
      component: PurchaseRequisitionProductListTable 
    },
    { 
      id: 'promotionlist',
      title: 'Thông tin khuyến mãi',
      component: PromotionListTable 
    },

    {
      title: 'Thông tin SEO',
      id: 'bw_seo',
      component: SeoInfo,
    },
    {
      title: 'Mô tả',
      id: 'bw_des',
      component: Descirption,
    },

    {
      title: 'Mô tả lý do',
      id: 'bw_des',
      component: DescirptionReason,
    },

    
    {
      title: 'Trạng thái',
      id: 'bw_mores',
      component: CareServiceStatus,
    },
  ];

  return (
    <PCAProvider>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} />

      {/* <AttributesAdd /> */}
    </PCAProvider>
  );
}
