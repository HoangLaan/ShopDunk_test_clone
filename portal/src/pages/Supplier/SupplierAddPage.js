import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { createSupplier, getDetailSupplier, updateSupplier } from 'services/supplier.service';
import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import SupplierInformation from './components/add/SupplierInformation';
import AccountInformation from './components/add/AccountInformation';
import SuppierApiTable from './components/add/SupplierApiTable';
import SupplierImportProduct from './components/add/SupplierImportProduct';
import FormAddressSelect from './components/add/FormAddressSelect';
import { showToast } from 'utils/helpers';

const SupplierAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      representative_gender: 1,
      country_id: 6,
    },
  });
  console.log('methods', methods.getValues())
  const { pathname } = useLocation();
  const { supplier_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (supplier_id) {
        await updateSupplier(supplier_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createSupplier(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const onChangeSupplierCode = (e) => {
    const value = e.target.value;
    methods.setValue('supplier_code', value);
    methods.setValue('account', value);
  };

  const detailForm = [
    {
      title: 'Thông tin nhà cung cấp',
      id: 'information',
      component: SupplierInformation,
      fieldActive: [
        'supplier_code',
        'supplier_name',
        'altname',
        'display_name',
        'representative_name',
        'representative_email',
        'representative_phonenumber',
        'representative_position',
      ],
      onChangeSupplierCode: onChangeSupplierCode,
    },
    {
      id: 'address',
      title: 'Địa chỉ',
      component: FormAddressSelect,
      fieldActive: ['country_id', 'province_id', 'district_id', 'ward_id', 'postal_code', 'address'],
    },
    {
      title: 'Thông tin tài khoản',
      id: 'accountInformation',
      component: AccountInformation,
    },
    {
      title: 'Thông tin API',
      id: 'supplierApiTable',
      component: SuppierApiTable,
      fieldActive: ['supplier_api_list'],
    },
    {
      title: 'Lịch sử nhập hàng',
      id: 'SupplierImportProduct',
      component: SupplierImportProduct,
      hidden: isAdd,
      supplierId: supplier_id,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  const loadSupplier = useCallback(() => {
    if (supplier_id) {
      setLoading(true);
      getDetailSupplier(supplier_id)
        .then((value) => {
          methods.reset({
            country_id: 6,
            ...value,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        country_id: 6,
        is_active: 1,
        representative_gender: 1,
      });
    }
  }, [supplier_id, methods]);
  useEffect(loadSupplier, [loadSupplier]);

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default SupplierAddPage;