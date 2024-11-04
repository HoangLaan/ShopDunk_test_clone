import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import LockshiftCommonInfo from 'pages/LockshiftClose/components/LockshiftCommonInfo';
import InfomationTab from '../tabs/Infomation/index';
import ProductListTab from '../tabs/ProductList/index';
import CustomerListTab from '../tabs/CustomerList/index';
import EquipmentListTab from '../tabs/EquipmentList/index';
import { getDetail, update, create } from 'services/lockshift-close.service';

import { getHasPermission } from "services/lockshift-open.service"
import Panel from 'components/shared/Panel/index';
import { showToast } from 'utils/helpers';

const AddLockshiftPage = ({ id = 0, isEdit = true }) => {
  const methods = useForm({
    defaultValue: {
      lockshift_id: id,
      cash_list: [],
      product_list: [],
      equipment_list: [],
      customer_list: [],
    },
  });
  const { pathname } = useLocation();
  const isAdd = useMemo(() => pathname.toLowerCase().includes('/add'), [pathname]);
  useEffect(() => {
    (async () => {
      try {
          const res1 = await getHasPermission();
        if(!isAdd){
          return
        }
        if (!Boolean(res1?.isTrue)) {
          showToast.warning('Bạn không có quyền truy cập trang này.');
          window._$g.rdr(`/lockshift-open`);
          return;
        }   
      } catch (error) {
        console.error('Error:', error);
      }
    })()    
  }, []);


  const loadItemDetail = useCallback(async () => {
    if (Number.isInteger(Number(id))) {
      const detail = await getDetail(id);
      methods.reset({
        ...methods.getValues(),
        ...detail,
      });
    }
  }, []);

  useEffect(() => {
    loadItemDetail();
  }, [loadItemDetail]);

  const onSubmit = async (data) => {
    try {
      if (data.shift_leader) {
        data.shift_leader = data.shift_leader.split('-')[0].trim();
      }
      if (id) {
        await update(id, data);
        showToast.success('Cập nhật kết ca thành công !');
      } else {
        const res = await create(data);
        showToast.success('Kết ca thành công !');
        const detail = await getDetail(res?.lockshiftId);
        methods.reset({ ...detail });
      }
    } catch (error) {
      showToast.error(error?.message);
    }
  };

  const panel = [
    {
      key: 'information',
      label: 'Thông tin chung',
      component: InfomationTab,
      disabled: !isEdit,
      lockshiftId: id,
      onSubmit,
    },
    {
      key: 'products',
      label: 'Danh sách hàng hóa',
      component: ProductListTab,
      disabled: !isEdit,
      lockshiftId: id,
      onSubmit,
    },
  ];

  return (
    <FormProvider {...methods}>
      <div className='bw_main_wrapp'>
        <LockshiftCommonInfo lockshiftId={id} />
        <Panel panes={panel} />
      </div>
    </FormProvider>
  );
};

export default AddLockshiftPage;
