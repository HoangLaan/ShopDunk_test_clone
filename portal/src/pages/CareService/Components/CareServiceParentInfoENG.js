import React from 'react';
import { PCAProvider } from 'pages/ProductCategory/helpers/context';
import FormSection from 'components/shared/FormSection/index';
import CareServiceInfo from './TabENGComponents/CareServiceInfo';
import SeoInfo from './TabENGComponents/SeoInfo';
import Descirption from './TabENGComponents/Descirption';
import DescirptionReason from './TabENGComponents/DescirptionReason';


export default function CareServiceParentInfoENG({ disabled, loading }) {
  const detailForm = [
    {
      title: 'Thông tin dịch vụ',
      id: 'bw_info',
      fieldActive: ['category_name', 'company_id', 'vat_id'],
      component: CareServiceInfo,
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

  ];

  return (
    <PCAProvider>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} />

      {/* <AttributesAdd /> */}
    </PCAProvider>
  );
}
