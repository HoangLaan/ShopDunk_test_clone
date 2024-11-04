import React from 'react';
import { useSelector } from 'react-redux';

import { INFORMATION_KEY } from 'pages/StocksTakeRequest/utils/constants';

import StocksTakeRequestCommon from './StocksTakeRequestCommon';
import FormSection from 'components/shared/FormSection/index';
import StocksTakeRequestPersonal from './StocksTakeRequestPersonal';
import StocksTakeRequestRequest from './StocksTakeRequestRequest';
import StocksTakeRequestStore from '../store-list/StocksTakeRequestStore';

const StocksTakeRequestInformation = ({ disabled, isAdd }) => {
  const { getStocksTakeRequestLoading } = useSelector((state) => state.stocksTakeRequest);

  const detailForm = [
    {
      key: INFORMATION_KEY.COMMON,
      title: 'Thông tin kiểm kê kho',
      component: StocksTakeRequestCommon,
      isAdd: isAdd,
      disabled: disabled,
    },
    {
      key: INFORMATION_KEY.REQUEST,
      title: 'Thông tin yêu cầu kiểm kê',
      component: StocksTakeRequestRequest,
      isAdd: isAdd,
      disabled: disabled,
      fieldActive: [
        'stocks_take_type_id',
        'stocks_take_request_name',
        'department_request_id',
        'stocks_take_request_user',
        'stocks_take_request_date',
      ],
    },
    {
      key: INFORMATION_KEY.STORE,
      title: 'Cửa hàng',
      component: StocksTakeRequestStore,
      isAdd: isAdd,
      disabled: disabled,
      fieldActive: ['store_apply_list[0]'],
    },
    {
      key: INFORMATION_KEY.INVENTORY_PERSON,
      title: 'Nhân sự kiểm kê',
      component: StocksTakeRequestPersonal,
      isAdd: isAdd,
      disabled: disabled,
      fieldActive: ['stocks_take_users[0]'],
    },
  ];

  return (
    <FormSection
      loading={getStocksTakeRequestLoading}
      style={{
        padding: '10px 0px',
      }}
      noActions
      detailForm={detailForm}
    />
  );
};

export default StocksTakeRequestInformation;
