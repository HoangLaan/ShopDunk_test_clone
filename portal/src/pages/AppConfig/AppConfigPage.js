import React, { useCallback } from 'react';
import Panel from 'components/shared/Panel';
import { FormProvider, useForm } from 'react-hook-form';
import StockConfig from './components/StockConfig/StockConfig';
import OrderConfig from './components/OrderConfig/OrderConfig';
import PreOrderConfig from './components/PreOrderConfig/PreOrderConfig';
import OtherConfig from './components/OtherConfig/OtherConfig';
import { updatePageConfig } from 'services/app-config.service';
import { showToast } from 'utils/helpers';

const AppConfig = () => {
  const defaultValues = {};
  const methods = useForm({
    defaultValues,
  });

  const panels = [
    {
      key: 'StockConfig',
      label: 'Cài đặt kho',
      component: StockConfig,
    },
    {
      key: 'OrderConfig',
      label: 'Cài đặt đơn hàng',
      component: OrderConfig,
    },
    {
      key: 'PreOrderConfig',
      label: 'Cài đặt Pre-order',
      component: PreOrderConfig,
    },
    {
      key: 'OtherConfig',
      label: 'Cài đặt khác',
      component: OtherConfig,
    },
  ];

  const onSubmit = async (values) => {
    let formData = { ...values };
    formData = Object.fromEntries(Object.entries(formData).filter(([key, value]) => !key?.endsWith('_option')));

    let finalFormData = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        finalFormData[key] = value.join('|');
      } else {
        finalFormData[key] = value;
      }
    });

    await updatePageConfig(finalFormData)
      .then(() => {
        showToast.success('Lưu cài đặt thành công');
      })
      .catch((err) => {
        showToast.error('Lưu cài đặt thất bại');
      });
    // let values = values.slice(0, )
  };
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <FormProvider {...methods}>
          <Panel panes={panels} onSubmit={onSubmit} hasSubmit noActions={true} />
          <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
            <button type='button' className='bw_btn bw_btn_success' onClick={methods.handleSubmit(onSubmit)}>
              <span className='fi fi-rr-check'></span> Lưu cài đặt
            </button>
          </div>
        </FormProvider>
      </div>
    </React.Fragment>
  );
};

export default AppConfig;
