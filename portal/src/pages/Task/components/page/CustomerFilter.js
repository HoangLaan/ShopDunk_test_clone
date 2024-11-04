import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';
import { StyledFilterTaskCustomer } from 'pages/Task/utils/style';
import BWAddress from 'components/shared/BWAddress/index';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import ToggleButton from 'components/shared/ToggleButton/ToggleButton';

const CustomerFilter = ({ params, onChange, metaCount }) => {
  const methods = useForm();

  const customerTypeOptions = useGetOptions(optionType.customerType);
  const taskTypeWflowOptions = useGetOptions(optionType.taskTypeWflow, {
    params: {
      parent_id: params.task_id,
    },
  });
  const taskTypeOptions = useGetOptions(optionType.taskType);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <StyledFilterTaskCustomer>
        <FilterSearchBar
          title='Tìm kiếm'
          onSubmit={onChange}
          onClear={() => onChange({})}
          actions={[
            {
              title: 'Từ khóa',
              component: <FormInput field='keyword' placeholder='Nhập thông tin khách hàng' />,
            },
            {
              title: 'Hạng khách hàng',
              component: <FormSelect field='customer_type_id' list={customerTypeOptions} />,
            },
            {
              title: 'Loại công việc',
              component: <FormSelect field='task_type_id' list={taskTypeOptions} />,
            },
            {
              title: 'Trạng thái CSKH',
              component: <FormSelect field='task_type_wflow_id' list={taskTypeWflowOptions} />,
            },
            {
              title: 'Ngày sinh nhật',
              component: (
                <FormDateRange
                  allowClear={true}
                  fieldStart={'birthday_date_from'}
                  fieldEnd={'birthday_date_to'}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  format={'DD/MM/YYYY'}
                />
              ),
            },
            {
              title: 'Quốc gia',
              component: <BWAddress type='country' field='country_id'></BWAddress>,
            },
            {
              title: 'Tỉnh/Thành phố',
              component: <BWAddress type='province' field='province_id'></BWAddress>,
            },
            {
              title: 'Quận/Huyện',
              component: <BWAddress type='district' field='district_id'></BWAddress>,
            },
            {
              title: 'Phường/xã',
              component: <BWAddress type='ward' field='ward_id'></BWAddress>,
            },
            {
              title: 'Trạng thái',
              component: <FormSelect field='is_active' list={statusTypesOption} />,
            },
          ]}
        />
        <div className='bw_group_btn_filter'>
          <ToggleButton
            color='#333333'
            isActive={params?.type_purchase === 3}
            onClick={() => onChange({ type_purchase: 3 })}
            style={{ marginRight: 5 }}>
            Tất cả ({metaCount?.all || 0})
          </ToggleButton>
          <ToggleButton
            color='#f2994a'
            isActive={params?.type_purchase === null}
            onClick={() => onChange({ type_purchase: null })}
            style={{ marginRight: 5 }}>
            Đang xử lý ({metaCount?.in_progress || 0})
          </ToggleButton>
          <ToggleButton
            color='#2f80ed'
            isActive={params?.type_purchase === 1}
            onClick={() => onChange({ type_purchase: 1 })}
            style={{ marginRight: 5 }}>
            Chốt đơn hàng thành công ({metaCount?.success || 0})
          </ToggleButton>
          <ToggleButton
            color='#ec2d41'
            isActive={params?.type_purchase === 0}
            onClick={() => onChange({ type_purchase: 0 })}
            style={{ marginRight: 5 }}>
            Không chốt đơn hàng thành công ({metaCount?.failed || 0})
          </ToggleButton>
        </div>
      </StyledFilterTaskCustomer>
    </FormProvider>
  );
};

export default CustomerFilter;
