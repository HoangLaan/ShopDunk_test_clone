import FormSection from 'components/shared/FormSection';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Other from './components/Other';
import { getConfigValue } from 'services/app-config.service';
import { notification } from 'antd';
import { getOptionsBrand } from 'services/brand.service';
import { getTaskOptions, getTaskTypeOptions } from 'services/task.service';
import { getCustomerTypeOptions } from 'services/return-policy.service';
import { toString } from 'lodash';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsDepartment } from 'services/department.service';
import { getOptionByDepartmentId } from 'services/position.service';

const OtherConfig = () => {
  const methods = useFormContext();
  const { watch ,setValue } = methods;
  const [loadDetail, setLoadDetail] = useState(0);
  const customToString = (data) => {
    data = mapDataOptions4Select(data);
    data.forEach((item) => {
      item.id = toString(item.id);
    });
    return data;
  };
  const getOptions = useCallback(() => {
    try {
      getOptionsBrand().then((data) => {
        setValue('brand_option', customToString(data));
      });
      getTaskOptions().then((data) => {
        setValue('task_option', customToString(data));
      });
      getCustomerTypeOptions().then((data) => {
        setValue('customer_type_option', customToString(data.items));
      });
      getTaskTypeOptions().then((data) => {
        setValue('task_type_option', customToString(data));
      });
      getOptionsDepartment().then((data)=>{
        setValue('department_option', customToString(data));
      })
      getOptionByDepartmentId({department_id: watch('FI_DEPARTMENT_FINANCE')}).then((data)=>{
        setValue('position_option', customToString(data));
      })
    } catch (error) {
      notification.error({ message: window._$g._(error.message) });
    }
  }, []);
  const getDetail = useCallback(() => {
    try {
      const keys = [
        'BRANDNAME_SHOPDUNK',
        'BRANDNAME_SAMCENTER',
        'TASKTYPEFORSHOP',
        'TASKFORSHOP',
        'FI_DEPARTMENT_FINANCE',
        'FI_DEPARTMENT_FINANCE_POSITION',
        'ZALO_OA_REFRESH_TOKEN',
        'CUSTOMERFORSHOP'
      ];
      keys.forEach((key) => {
        getConfigValue({ key_config: key }).then((data) => {
          if (key == 'FI_DEPARTMENT_FINANCE_POSITION') {
          }
          setValue(key, toString(data[0].value_config));
        }).finally(()=>{
          setLoadDetail(1);
        });
      });
    } catch (error) {
      notification.error({ message: window._$g._(error.message) });
    }
  }, []);
  useEffect(getDetail, [getDetail]);
  useEffect(getOptions, [loadDetail, watch('FI_DEPARTMENT_FINANCE')]);

  const detailForm = [
    {
      title: 'Cài đặt khác',
      id: 'OtherConfig',
      component: Other,
    },
  ];
  return <FormSection detailForm={detailForm} />;
};

export default OtherConfig;
