import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

//component
import FormSection from 'components/shared/FormSection/index';
import OrderInfor from './components/add/OrderInfor';
import CustomerInfor from './components/add/CustomerInfor';
import BusinessInfo from './components/add/BusinessInfo';
import SEOInfo from './components/add/SEO';
import NewsStatus from './components/add/ApproveInfor';

const Information = ({ disabled, website_category_id, loading, userSchedule, onSubmit }) => {
  const methods = useFormContext();
  const { watch } = methods;

  const detailForm = useMemo(() => {
    return [
      {
        title: 'Thông tin danh mục website',
        id: 'OrderInfor',
        component: OrderInfor,
        CustomerInfor,
        fieldActive:[''],
        website_category_id: website_category_id,
        userSchedule: userSchedule,
        nameInstanceBusiness: 'business_receive',
      },

      {
        title: 'Thông tin SEO',
        id: 'SEOInformation',
        fieldActive:[''],

        component: SEOInfo,
        nameInstanceBusiness: 'business_receive',
        website_category_id: website_category_id,
      },
      {
        title: 'Mô tả',
        fieldActive:[''],

        id: 'CustomerInfor',
        component: BusinessInfo,
        nameInstanceBusiness: 'business_receive',
        website_category_id: website_category_id,
      },

      {
        title: 'Hệ thống',
        fieldActive:[''],

        id: 'NewsStatus',
        component: NewsStatus,
        website_category_id: website_category_id,
        userSchedule: userSchedule,
        nameInstanceBusiness: 'business_receive',
      },
    ];
  }, [website_category_id, userSchedule]);

  return <FormSection detailForm={detailForm} disabled={disabled} loading={loading} />;
};

export default Information;
