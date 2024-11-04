import React from 'react';
import FormSection from 'components/shared/FormSection/index';
import InformationResult from './InformationResult';
import ConcludeResult from './ConcludeResult';

const StocksTakeResult = () => {
  const detailForm = [
    {
      key: 'information',
      title: 'Thông tin xử lý',
      component: InformationResult,
    },
    {
      key: 'conclude',
      title: 'Kết luận',
      component: ConcludeResult,
    },
    // {
    //   key: INFORMATION_KEY.INVENTORY_PERSON,
    //   title: 'Nhân sự kiểm kê',
    //   component: StocksTakeRequestPersonal,
    // },
  ];

  return (
    <FormSection
      style={{
        padding: '10px 0px',
      }}
      noActions
      detailForm={detailForm}
    />
  );
};

export default StocksTakeResult;
