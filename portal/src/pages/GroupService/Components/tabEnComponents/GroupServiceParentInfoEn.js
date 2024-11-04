import React from 'react';

import { PCAProvider } from 'pages/ProductCategory/helpers/context';
import FormSection from 'components/shared/FormSection/index';
import GroupServiceInfo from './GroupServiceInfo';
import GroupServiceSeoInfo from './GroupServiceSeoInfo';


export default function GroupServiceParentInfoEn({ disabled, loading }) {
  const detailForm = [
    {
      title: 'Thông tin nhóm dịch vụ',
      id: 'bw_info',
      fieldActive: ['group_service_code', 'group_service_name_en', 'order_index_en'],
      component: GroupServiceInfo,
    },
    {
      title: 'Thông tin SEO',
      id: 'pictures',
      fieldActive: ['seo_name_en', 'meta_title_en', 'meta_keyword_en', 'meta_description_en'],
      component: GroupServiceSeoInfo,
    },
  ];

  return (
    <PCAProvider>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} />

      {/* <AttributesAdd /> */}
    </PCAProvider>
  );
}
