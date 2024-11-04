import { useCallback, useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getCompanyOptions, getBusinessOptions } from 'services/receive-type.service';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';

function BankAccountModalAdd({ loadBankAccount, setParams }) {
  const methods = useForm();
  const { watch } = methods;
  const [companyList, setCompanyList] = useState([]);
  const [businessList, setBusinessList] = useState([]);

  const loadCompanyList = useCallback(() => {
    getCompanyOptions().then((res) => {
      setCompanyList(res);
      if (companyList?.length === 1 && !methods.getValues('company_id')) {
        methods.setValue('company_id', companyList[0]?.id);
      }
    });
  }, []);
  useEffect(loadCompanyList, [loadCompanyList]);

  const company_id = watch('company_id');
  const loadBusinessList = useCallback(() => {
    getBusinessOptions({ company_id: company_id }).then(setBusinessList);
  }, [company_id]);
  useEffect(loadBusinessList, [loadBusinessList]);

  const handleSelectBusiness = (businessIds) => {
    methods.setValue('business_ids', businessIds);
  };

  return (
    <FormProvider {...methods}>
      <div
        className='bw_col_12'
        style={{
          background: '#f3f3f3',
          paddingTop: '20px',
        }}>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FilterSearchBar
              title='Tìm kiếm'
              colSize={4}
              onClear={() => {
                setParams({
                  is_active: 1,
                  page: 1,
                  itemsPerPage: 10,
                  business_ids: null,
                  company_id: null,
                });
              }}
              onSubmit={(e) => {
                setParams((prev) => {
                  return {
                    ...prev,
                    ...e,
                    business_ids: watch('business_ids'),
                    company_id: watch('company_id'),
                  };
                });
              }}
              actions={[
                {
                  title: 'Từ khoá',
                  component: <FormInput field='search' placeholder='Tên ngân hàng, số tài khoản' />
                },
                {
                  title: 'Công ty',
                  component:
                  <FormSelect
                    type='text'
                    field='company_id'
                    placeholder='Chọn công ty'
                    list={companyList?.map((p) => {
                      return {
                        label: p?.name,
                        value: p?.id,
                      };
                    })}
                  />
                },
                {
                  title: 'Miền',
                  component:
                    <FormSelect
                      type='text'
                      field='business_ids'
                      placeholder='Chọn miền'
                      list={businessList?.map((p) => {
                        return {
                          label: p?.name,
                          value: p?.id,
                        };
                      })}
                      mode={'multiple'}
                      allowClear={true}
                      onChange={(value) => handleSelectBusiness(value)}
                    />
                },
              ]}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default BankAccountModalAdd;
