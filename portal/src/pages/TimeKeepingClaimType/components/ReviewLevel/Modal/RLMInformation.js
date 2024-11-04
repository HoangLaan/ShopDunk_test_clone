import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import {
  createOrUpdateReviewLevel,
} from 'services/time-keeping-claim-type.service';
import {
  getPositionByDepartmentId,
  getDepartmentOptions
} from 'services/time-keeping-claim-type.service';
import RLMDepartmentTable from './RLMDepartmentTable';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { FormProvider } from 'react-hook-form';
import BWButton from 'components/shared/BWButton/index';
import { showToast } from 'utils/helpers';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const RLMInformation = ({ disabled, refreshListReviewLevel }) => {
  const defaultValues = useMemo(
    () => ({
      is_active: 1,
      departments: [],
      positions: [{ id: 0, value: 0 }],
    }),
    [],
  );

  const methods = useForm({defaultValues});
  const { watch, setValue, handleSubmit, reset } = methods;

  const companyOptions = useGetOptions(optionType.company);
  const [departmentOptions, setDepartmentOptions] = useState([{id: 0, value: 0, name: 'Tất cả phòng ban'}]);

  useEffect(() => {
    getDepartmentOptions({company_id: watch('company_id')}).then((data) => setDepartmentOptions((prev) =>  mapDataOptions4SelectCustom([...prev, ...data])))
  }, [watch('company_id')])
  
  const handleAddNewReviewLevel = useCallback(async (payload) => {
    try {
      await createOrUpdateReviewLevel(payload);

      reset({...defaultValues, company_id: parseInt(companyOptions[0].id)});
      refreshListReviewLevel();
      return showToast.success(`Tạo thành công`);
    } catch (error) {
      showToast.error(error.message ?? `Tạo thất bại`);
    }
  }, []);

  const departments = useMemo(() => watch('departments'), [watch('departments')]);
  const [listDepartment, setListDepartment] = useState([]);
  useEffect(() => {
    Promise.all(departments?.map(async (item) => {
      const departmentFind = departmentOptions.find((d) => d.id === (item.id ?? item.value ?? item));
      return {
        department_name: departmentFind?.name,
        positionOptions: await getPositionByDepartmentId({department_id: departmentFind?.id}).then(data => {
          if(data.length > 0){
            data = [{id: 0, value: 0, name: 'Tất cả vị trí'}, ...data]
          }
          return mapDataOptions4SelectCustom(data)
        } ),
      }
    })).then(data => setListDepartment(data))
  }, [departments])

  return (
    <>
     <BWAccordion title={'Thêm mới mức duyệt'}>
      <FormProvider {...methods}>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Tên mức duyệt'>
                <FormInput
                  type='text'
                  field='review_level_name'
                  placeholder='Tên mức duyệt'
                  validation={{
                    required: 'Tên mức duyệt là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Công ty'>
                <FormSelect
                  list={companyOptions}
                  field='company_id'
                  placeholder='Chọn công ty'
                  validation={{
                    required: 'Công ty là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <BWAccordion title={'Phòng ban duyệt'}>
                {/* <FormProvider {...methods}> */}
                    <div className='bw_col_12'>
                      <FormItem
                        disabled={disabled || !watch('company_id')}
                        isRequired
                        label='Chọn phòng ban'>
                        <FormSelect
                          list={departmentOptions}
                          field='departments'
                          placeholder='Chọn phòng ban'
                          mode={'multiple'}
                          validation={{
                            required: 'Phòng ban là bắt buộc',
                          }}
                          onChange={(value) => {
                              // Chọn tất cả thì clear hết value trước đó
                              if(value.includes(0)){
                                return setValue('departments', [{id: 0, value: 0}])
                              }
                              methods.setValue('departments', value.map(item => ({id: item, value: item})))        
                          }}
                        />

                        {listDepartment?.length > 0 && (
                          <RLMDepartmentTable data={listDepartment} />
                        )}
                      </FormItem>
                    </div>
                {/* </FormProvider> */}
              </BWAccordion>
            </div>

            <div className='bw_col_12' style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <BWButton
                onClick={handleSubmit(handleAddNewReviewLevel)}
                type={'success'}
                icon={'fi fi-rr-check'}
                content={'Thêm mới'}
              />
            </div>
          </div>
        </div>
      </FormProvider>
    </BWAccordion>
    </>
   
  );
};

export default RLMInformation;
