import React, { useState, useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { mapDataOptions, statusTypesOption } from 'utils/helpers';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { OPERATOR_OPTIONS } from 'pages/Customer/utils/constants';
import CustomerCareService from 'services/customer-care.service';
import { STATUS_TYPES } from 'utils/constants';
import { getListSource } from 'services/customer.service';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { getListBrand } from 'services/brand.service';

const INIT_FILTER = {
  search: '',
  is_active: STATUS_TYPES.ACTIVE,
  order_count: 0,
  order_operator: OPERATOR_OPTIONS[1].value,
  source_id: null,
  gender: null,
  days_since_last_order_from: null,
  days_since_last_order_to: null,
  from_birth_day: null,
  to_birth_day: null,
  created_date_from: null,
  created_date_to: null,
};

const CustomerFilter = ({ onChange, onClearParams }) => {
  const methods = useForm();

  const [optionsCustomerType, setOptionsCustomerType] = useState([]);
  const [optionsSource, setOptionsSource] = useState([]);
  const [optionsBrand, setOptionsBrand] = useState([]);
  const wflowOptions = useGetOptions(optionType.taskWorkFlow)
  const interestContentOptions = useGetOptions(optionType.interestContent);

  useEffect(() => {
    const getDataOptions = async () => {
      const _optionsCustomerType = await CustomerCareService.getOptionsCustomerType();
      setOptionsCustomerType(mapDataOptions(_optionsCustomerType));

      const _optionsSource = await getListSource();
      setOptionsSource(mapDataOptions(_optionsSource.data));
      
      const _optionsBrand = await getListBrand();
      setOptionsBrand(mapDataOptions(_optionsBrand?.items?.map((_i) => ({
        id: _i.brand_id,
        name: _i.brand_name
      }))));
    };
    methods.reset(INIT_FILTER);
    getDataOptions();
  }, []);

  const onClear = () => {
    methods.reset(INIT_FILTER);
    onClearParams();
  };

  return (
    <div className='bw_customer_filter'>
      <FormProvider {...methods}>
        <FilterSearchBar
          title='Tìm kiếm'
          onSubmit={onChange}
          onClear={onClear}
          actions={[
            {
              title: 'Từ khóa',
              component: <FormInput field='search' placeholder='Nhập mã khách hàng, Họ và tên, SĐT, Email' />,
            },
            {
              title: 'Nguồn khách hàng',
              component: <FormSelect field='source_id' list={optionsSource} allowClear={true} />,
            },
            {
              title: 'Hạng khách hàng',
              component: <FormSelect field='customer_type_id' id='bw_company' list={optionsCustomerType} allowClear />,
            },
            {
              title: 'Trạng thái CSKH',
              component: <FormSelect field='wflow_id' id='bw_company' list={wflowOptions} allowClear />,
            },
            {
              title: 'Nội dung quan tâm',
              component: <FormSelect field='interest_content' list={interestContentOptions} />,
            },
            {
              title: 'Ngày sinh',
              component: (
                <FormRangePicker
                  style={{ width: '100%' }}
                  fieldStart='from_birth_day'
                  fieldEnd='to_birth_day'
                  placeholder={['Từ ngày', 'Đến ngày']}
                  format='DD/MM/YYYY'
                  allowClear={true}
                />
              ),
            },
            {
              title: 'Ngày tạo',
              component: (
                <FormRangePicker
                  style={{ width: '100%' }}
                  allowClear={true}
                  fieldStart={'created_date_from'}
                  fieldEnd={'created_date_to'}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  format={'DD/MM/YYYY'}
                />
              ),
            },
            {
              title: 'Số lần mua',
              component: (
                <div className='bw_row bw_operator'>
                  <div className='bw_col_4'>
                    <FormSelect field='order_operator' bordered={true} list={OPERATOR_OPTIONS} />
                  </div>
                  <div className='bw_col_8'>
                    <FormNumber
                      field='order_count'
                      bordered={true}
                      validation={{
                        required: 'Số lần mua là bắt buộc',
                        min: {
                          value: 0,
                          message: 'Số lần mua phải lớn hơn 0',
                        },
                      }}
                    />
                  </div>
                </div>
              ),
            },
            {
              title: 'Thời gian mua hàng',
              component: (
                <FormRangePicker
                  style={{ width: '100%' }}
                  fieldStart='buy_from'
                  fieldEnd='buy_to'
                  placeholder={['Từ ngày', 'Đến ngày']}
                  format='DD/MM/YYYY'
                  allowClear={true}
                />
              ),
            },
            {
              title: 'Kích hoạt',
              component: <FormSelect field='is_active' list={statusTypesOption} />,
            },
            {
              title: 'Thương hiệu',
              component: <FormSelect field='brand_id' list={optionsBrand} />,
            },
          ]}
        />
      </FormProvider>
    </div>
  );
};

export default CustomerFilter;
