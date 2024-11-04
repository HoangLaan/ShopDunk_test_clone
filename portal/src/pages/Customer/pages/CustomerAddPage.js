import React, { useState } from 'react';

import { MODAL } from 'pages/Customer/utils/constants';
import { usePageInformation } from 'pages/Customer/utils/hooks';
import PageProvider from 'pages/Customer/components/provider/PageProvider';
import CustomerTypeHistory from 'pages/Customer/components/detail/CustomerTypeHistory';
import WarrantyRepairHistory from 'pages/Customer/components/detail/WarrantyRepairHistory';
import AddressBook from 'pages/Customer/components/detail/AddressBook';
import HobbiesRelatives from 'pages/Customer/components/detail/HobbiesRelatives';
import Information from 'pages/Customer/components/detail/Information';
import PurchaseHistory from 'pages/Customer/components/detail/PurchaseHistory';
import CDRSPage from 'pages/CDRs/CDRsPage';
import CustomerCareHistory from '../components/detail/CustomerCare';
import MemberPointHistory from '../components/detail/MemberPointHistory';
import Panel from '../shared/Panel';

const CustomerAddPage = () => {
  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const { isAdd } = usePageInformation();

  const panel = [
    {
      key: 'information',
      label: 'Thông tin khách hàng',
      component: Information,
      setPhoneNumber: (p) => setPhoneNumber(p),
      hidden: false,
    },
    {
      key: 'hobbies_relatives',
      label: 'Sở thích/ TT người thân',
      component: HobbiesRelatives,
      hidden: isAdd,
      renderWhenNoActive: false,
    },
    {
      key: 'address_book',
      label: 'Sổ địa chỉ',
      component: AddressBook,
      hidden: isAdd,
      renderWhenNoActive: false,
    },
    {
      key: 'purchase_history',
      label: 'Lịch sử mua hàng',
      component: PurchaseHistory,
      hidden: isAdd,
      renderWhenNoActive: false,
    },
    {
      key: 'point_history',
      label: 'Lịch sử điểm',
      component: MemberPointHistory,
      hidden: isAdd,
      renderWhenNoActive: false,
    },
    {
      key: 'customer_type_history',
      label: 'Lịch sử thăng hạng',
      component: CustomerTypeHistory,
      hidden: isAdd,
      renderWhenNoActive: false,
    },
    {
      key: 'warranty_repair_history',
      label: 'Lịch sử bảo hành',
      component: WarrantyRepairHistory,
      hidden: isAdd,
      renderWhenNoActive: false,
    },
    {
      key: 'call_history',
      label: 'Lịch sử chăm sóc qua tổng đài',
      phoneNumber: phoneNumber,
      component: CDRSPage,
      hidden: isAdd,
      renderWhenNoActive: false,
    },
    {
      key: 'customer_history_list',
      label: 'Lịch sử chăm sóc khách hàng',
      component: CustomerCareHistory,
      hidden: isAdd,
      renderWhenNoActive: false,
    },
  ].filter((x) => !Boolean(x.hidden));

  return (
    <PageProvider>
      <div className='bw_main_wrapp'>
        <Panel panes={panel} />
      </div>
      <div id={MODAL.ADD_ADDRESS_BOOK}></div>
      <div id={MODAL.ADD_HOBBIES}></div>
      <div id={MODAL.ADD_RELATIVES}></div>
      <div id={MODAL.AFFILIATE}></div>
    </PageProvider>
  );
};

export default CustomerAddPage;
