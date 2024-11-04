import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';



const DateConfirmTimeKeepingFilter = ({onChange})=>{
    const methods = useForm();
    useEffect(() => {
        methods.reset({
          is_active: 1,
        });
      }, []);

      const onClear = () => {

        methods.reset({
          keyword: '',
          is_active: 1,
          date_from: null,
          date_to: null,
          created_date_from : null,
          created_date_to : null
        })
        onChange({
          keyword: '',
          is_active: 1,
          date_from: null,
          date_to: null,
          created_date_to : null,
          created_date_from : null
        })
      }
    
    return (
        <FormProvider {...methods}>
          <FilterSearchBar
            title='Tìm kiếm'
            onSubmit={onChange}
            onClear={() => onClear()}
            actions={[
            //   {
            //     title: 'Từ khóa',
            //     component: <FormInput field='search' />,
            //   },
              {
                title: 'Ngày tạo',
                component: (
                  <FormDateRange
                    allowClear={true}
                    fieldStart={'created_date_from'}
                    fieldEnd={'created_date_to'}
                    placeholder={['Từ ngày', 'Đến ngày']}
                    format={'DD/MM/YYYY'}
                  />
                ),
              },
              {
                  title: 'Ngày khóa xác nhận công',
                  component: (
                    <FormDateRange
                      allowClear={true}
                      fieldStart={'date_from'}
                      fieldEnd={'date_to'}
                      placeholder={['Từ ngày', 'Đến ngày']}
                      format={'DD/MM/YYYY'}
                    />
                  ),
                },
              {
                title: 'Trạng thái',
                component: <FormSelect field='is_active' list={statusTypesOption} />,
              },
            ]}
          />
        </FormProvider>
      );
}

export default DateConfirmTimeKeepingFilter