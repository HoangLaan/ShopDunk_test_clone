import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import ManufacturerInformation from './components/add/ManufacturerInformation';
import AddressSelectAccordion from 'components/shared/AddressSelectAccordion/index';
import ManufacturerStatus from './components/add/ManufacturerStatus';
import { createManufacturer, getDetailManufacturer, updateManufacturer } from 'services/manufacturer.service';
const ManufacturerAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { manufacturer_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      //payload.functions = payload.functions_list.map((_) => _.value);
      let label;
      if (manufacturer_id) {
        await updateManufacturer(manufacturer_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createManufacturer(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      console.log(error);
      let errorMessage = 'Có lỗi xảy ra!';
      if (['Tên nhà sản xuất đã tồn tại.', 'Mã nhà sản xuất đã tồn tại.'].includes(error.message))
        errorMessage = error.message;
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin hãng',
      id: 'information',
      component: ManufacturerInformation,
      fieldActive: [
        'manufacturer_code',
        'manufacturer_name',
        'alt_name',
        'display_name',
        'representative_name',
        'email',
        'phone_number',
        'representative_position',
      ],
    },
    {
      id: 'address',
      title: 'Địa chỉ',
      component: AddressSelectAccordion,
      fieldActive: ['country_id', 'province_id', 'district_id', 'ward_id', 'postal_code', 'address'],
    },
    { id: 'status', title: 'Trạng thái', component: ManufacturerStatus },
  ];

  const loadManufacturer = useCallback(() => {
    if (manufacturer_id) {
      setLoading(true);
      getDetailManufacturer(manufacturer_id).then((value) => {
        methods.reset({
          address: value?.manufacturer_address,
          country_id: 6,
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
    setLoading(false);
  }, [manufacturer_id]);

  useEffect(loadManufacturer, [loadManufacturer]);

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ManufacturerAddPage;
