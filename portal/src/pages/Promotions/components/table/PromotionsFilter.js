import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4Select, reviewStatusOption, statusTypesOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';

const PromotionsFilter = ({ onChange }) => {
  const dispatch = useDispatch();
  const { companyData, businessData } = useSelector((state) => state.global);
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  useEffect(() => {
    dispatch(getOptionsGlobal('company'));
  }, []);

  useEffect(() => {
    dispatch(
      getOptionsGlobal('business', {
        company_id: methods.watch('company_id'),
      }),
    );
  }, [methods.watch('company_id')]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: '',
            company_id: null,
            bussiness_id: null,
            begin_date: null,
            end_date: null,
            is_active: 1,
            create_date_from: null,
            create_date_to: null,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên chương trình khuyến mại' />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={mapDataOptions4Select(companyData ?? [])} />,
          },
          {
            title: 'Miền',
            component: <FormSelect field='bussiness_id' list={mapDataOptions4Select(businessData ?? [])} />,
          },
          {
            title: 'Ngày áp dụng',
            component: (
              <FormRangePicker
                fieldStart={'create_date_from'}
                fieldEnd={'create_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Trạng thái duyệt',
            component: <FormSelect field='is_active' list={reviewStatusOption} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                fieldStart={'create_date_from'}
                fieldEnd={'create_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default PromotionsFilter;
