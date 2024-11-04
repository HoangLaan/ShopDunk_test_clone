import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

//component
import FormSection from 'components/shared/FormSection/index';
import OrderInforEG from './components/add/OrderInforEG';
import CustomerInfor from './components/add/CustomerInfor';
import SEOEGInfo from './components/add/SEOEG';

const InformationEG = ({ disabled, website_category_id, loading, userSchedule, onSubmit }) => {
  const methods = useFormContext();
  const { watch } = methods;

  const detailForm = useMemo(() => {
    return [
      {
        title: 'Thông tin danh mục website',
        id: 'WebsiteEG',
        component: OrderInforEG,
        CustomerInfor,
        fieldActive: [''],
        website_category_id: website_category_id,
        userSchedule: userSchedule,
        nameInstanceBusiness: 'business_receive',
      },

      {
        title: 'Thông tin SEO',
        id: 'SEOInformationEG',
        component: SEOEGInfo,
        fieldActive: [''],

        nameInstanceBusiness: 'business_receive',
        website_category_id: website_category_id,
      },
    ];
  }, [website_category_id, userSchedule]);

  return <FormSection detailForm={detailForm} disabled={disabled} loading={loading} />;
};

export default InformationEG;
