/* eslint-disable react/style-prop-object */
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormItemCheckbox from '../Shared/FormItemCheckbox';
import ICON_COMMON from 'utils/icons.common';
import BWButton from 'components/shared/BWButton/index';
import TaskTypeService from 'services/task-type.service';
import { showToast } from 'utils/helpers';
import { getErrorMessage } from 'pages/TaskType/utils/utils';
import { useTaskTypeContext } from 'pages/TaskType/utils/context';

const INIT_FORM = {
  is_active: 1,
  is_database: 0,
};

function FormTaskWorkflowCondition({ disabled }) {
  const methods = useForm();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { refreshCondition } = useTaskTypeContext();

  const onSubmit = async (values) => {
    try {
      setLoadingSubmit(true);
      await TaskTypeService.createCondition(values);
      showToast.success('Thêm mới thành công');
      methods.reset(INIT_FORM);
      refreshCondition();
    } catch (error) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    methods.reset(INIT_FORM);
  }, []);

  return (
    <FormProvider {...methods}>
      <Spin spinning={loadingSubmit} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            methods.handleSubmit(onSubmit)(e);
          }}>
          <FormItem disabled={disabled} isRequired label='Tên điều kiện' style='gray'>
            <FormInput disabled={disabled} placeholder='Nhập tên điều kiện' field='condition_name' />
          </FormItem>
          <FormItemCheckbox label='Theo dữ liệu' gray={true}>
            <FormInput disabled={disabled} type='checkbox' field='is_database' />
          </FormItemCheckbox>
          <div className='bw_footer_modal bw_justify_content_right bw_mb_2 bw_pr_15px'>
            <BWButton
              type='success'
              icon={ICON_COMMON.save}
              outline={true}
              content='Xác nhận'
              onClick={methods.handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </Spin>
    </FormProvider>
  );
}

export default FormTaskWorkflowCondition;
