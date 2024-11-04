import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import FunctionGroupInformation from './components/add/ClusterInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { createCluster, getDetailCluster, getOptionsCluster, updateCluster } from 'services/cluster.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import StoreTable from './components/add/StoreTable';
const ClusterAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { cluster_id } = useParams();
  const [businessOption, setBusinessOption] = useState([]);
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.stores = (payload.store_list || []).map((x) => x.store_id);
      let label;
      if (cluster_id) {
        await updateCluster(cluster_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createCluster(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const loadCluster = useCallback(() => {
    if (cluster_id) {
      getDetailCluster(cluster_id).then((value) => {
        methods.reset({
          ...value,
          store_list: (value.store_list || []).map((store) => ({
            ...store,
            value: +store.store_id,
            label: store.store_name,
          })),
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [cluster_id]);

  const loadBusiness = useCallback(() => {
    getOptionsCluster({}).then((res) => {
      setBusinessOption(mapDataOptions4SelectCustom(res, 'id', 'name'));
    });
  }, []);
  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  useEffect(loadCluster, [loadCluster]);

  const detailForm = [
    {
      title: 'Thông tin cụm',
      id: 'information',
      businessOption: businessOption,
      component: FunctionGroupInformation,
      fieldActive: ['cluster_name', 'business_id'],
    },
    {
      title: 'Cửa hàng thuộc cụm',
      id: 'stores',
      hidden: isAdd,
      component: StoreTable,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ClusterAddPage;
