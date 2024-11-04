/* eslint-disable react/style-prop-object */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { createSupplier } from 'services/supplier.service';

import FormStatus from 'components/shared/FormCommon/FormStatus';
import FormSection from 'components/shared/FormSection/index';
import AddressSelectAccordion from 'components/shared/AddressSelectAccordion/index';

import { useRequestPurchaseContext } from 'pages/RequestPurchaseOrder/helpers/context';
import ModalSupplierInformation from 'pages/RequestPurchaseOrder/components/Sections/ModalSupplierInformation';
import { showToast } from 'utils/helpers';

const INIT_SUPPLIER = {
  is_active: 1,
  is_system: 0
}

const ModalSupplierAdd = ({ disabled }) => {
  const methods = useForm();
  const { handleSubmit, getValues, reset } = methods;

  // console.log('ModalSupplierAdd values', methods.getValues());

  const { openModalSupplierAdd, setOpenModalSupplierAdd } = useRequestPurchaseContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset(INIT_SUPPLIER);
  }, [reset]);

  const onCloseModal = () => {
    setOpenModalSupplierAdd(false);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const dataSubmit = getValues();
      await createSupplier(dataSubmit);
      showToast.success('Thêm mới thành công');
      reset(INIT_SUPPLIER)
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin nhà cung cấp',
      component: ModalSupplierInformation,
    },
    {
      title: 'Địa chỉ',
      component: AddressSelectAccordion,
    },
    {
      title: 'Trạng thái',
      component: FormStatus,
    },
  ];

  return openModalSupplierAdd ? (
    <FormProvider {...methods}>
      <div className='bw_modal bw_modal_open bw_modal_supplier'>
        <div className='bw_modal_container bw_w900'>
          <div className='bw_title_modal'>
            <h3>Thêm mới nhà cung cấp</h3>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={onCloseModal}></span>
          </div>
          <div className='bw_main_modal'>
            <FormSection loading={loading} detailForm={detailForm} disabled={disabled} noSideBar={true} />
          </div>
          <div className='bw_footer_modal'>
            <button type='submit' className='bw_btn bw_btn_success' onClick={handleSubmit(onSubmit)}>
              <span className='fi fi-rr-check'></span> Thêm mới
            </button>
            <button className='bw_btn_outline bw_close_modal' onClick={onCloseModal}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  ) : null;
};

export default ModalSupplierAdd;
