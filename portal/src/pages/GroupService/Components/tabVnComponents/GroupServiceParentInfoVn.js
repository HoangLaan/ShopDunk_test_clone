import React from 'react';

import { PCAProvider } from 'pages/ProductCategory/helpers/context';
import FormSection from 'components/shared/FormSection/index';
import GroupServiceInfo from './GroupServiceInfo';
import GroupServiceSeoInfo from './GroupServiceSeoInfo';
import GroupServiceDescriptionInfo from './GroupServiceDescriptionInfo';
import GroupServicePictureInfo from './GroupServicePictureInfo';
import GroupServiceStatusInfo from './GroupServiceStatusInfo';

export default function GroupServiceParentInfoVn({ disabled, loading, language_id }) {

  const detailForm = [
    {
      title: 'Thông tin nhóm dịch vụ',
      id: 'bw_info',
      fieldActive: ['group_service_code', 'group_service_name', 'order_index'],
      component: GroupServiceInfo,
      language_id: language_id,
    },
    {
      title: 'Thông tin SEO',
      id: 'bw_info_more',
      fieldActive: ['seo_name', 'meta_title', 'meta_key_words', 'meta_description'],
      component: GroupServiceSeoInfo,
    },
    {
      title: 'Hình ảnh',
      id: 'bw_info_more',
      fieldActive: ['large_images', 'medium_images', 'small_images'],
      component: GroupServicePictureInfo,
    },
    {
      title: 'Trạng thái',
      id: 'bw_mores',
      fieldActive: ['is_active', 'is_show_web'],
      component: GroupServiceStatusInfo,
    },
    {
      title: 'Mô tả',
      id: 'bw_des',
      fieldActive: ['description'],
      component: GroupServiceDescriptionInfo,
    },
  ];

  return (
    <PCAProvider>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} />

      {/* <AttributesAdd /> */}
    </PCAProvider>
  );
}
