import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import {
  getCompanyOptions,
  getDepartmentOptions,
  getPositionOptions,
  createReviewLevel,
} from 'services/work-schedule-type.service';
import RLMDepartmentTable from './RLMDepartmentTable';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import { FormProvider } from 'react-hook-form';
import BWButton from 'components/shared/BWButton/index';
import { showToast } from 'utils/helpers';

const RLMInformation = ({ disabled, refreshListReviewLevel }) => {
  const [companyOptions, setCompanyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);

  const DEFAULT_COMPANY = 1;
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      is_apply_all_department: 1,
      departments: [],
      positions: [{ id: 0, value: 0 }],
      company_id: DEFAULT_COMPANY,
    },
  });
  const { watch, setValue, handleSubmit, clearErrors, getFieldState, formState, getValues, reset } = methods;

  const handleSelectCompany = useCallback((companyId) => {
    getDepartmentOptions({ company_id: companyId }).then(({ items: data }) =>
      setDepartmentOptions(mapDataOptions4Select(data)),
    );
    setValue('company_id', companyId);
  }, []);

  const departments = useMemo(() => watch('departments'), [watch('departments')]);

  const isAllDepartment = useMemo(() => watch('is_apply_all_department'), [watch('is_apply_all_department')]);

  useEffect(() => {
    getPositionOptions().then(({ items: data }) =>
      setPositionOptions([{ value: 0, label: 'Tất cả vị trí' }, ...mapDataOptions4Select(data)]),
    );
  }, []);

  const handleAddNewReviewLevel = useCallback(async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      if (watch('is_apply_all_department') === 1) {
        const isAllPosition = payload.positions.some((p) => p.id === 0);
        if (!isAllPosition) payload.departments = [{ id: 0, positions: payload.positions }];
        payload.is_apply_all_position = isAllPosition ? 1 : 0;
      }
      delete payload.positions;

      // create
      await createReviewLevel(payload);

      // trigger new list
      reset({ is_active: 1 });
      refreshListReviewLevel();
      return showToast.success(`Tạo thành công`);
    } catch (error) {
      showToast.error(`Tạo thất bại`);
    }
  }, []);

  const listDepartment = useMemo(() => {
    return departments?.map((item) => ({
      department_name: departmentOptions.find((d) => d.id === item.id)?.name,
      positionOptions,
    }));
  }, [departments]);

  useEffect(() => {
    getCompanyOptions().then(({ items: data }) => setCompanyOptions(mapDataOptions4SelectCustom(data)));
    handleSelectCompany(1);
  }, []);

  return (
    <BWAccordion title={'Thêm mới mức duyệt'}>
      <FormProvider {...methods}>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} isRequired label='Tên mức duyệt'>
                <FormInput
                  type='text'
                  field='work_schedule_review_level_name'
                  placeholder='Tên mức duyệt'
                  validation={{
                    validate: (value) => {
                      if (!value || value === '') return 'Tên mức duyệt là bắt buộc';
                      const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                      if (regexSpecial.test(value)) return 'Tên mức duyệt không được chứa ký tự đặc biệt';

                      return true;
                    },
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} isRequired label='Công ty'>
                <FormSelect
                  defaultValue={DEFAULT_COMPANY}
                  list={companyOptions}
                  field='company_id'
                  placeholder='Chọn công ty'
                  validation={{
                    required: 'Công ty là bắt buộc',
                  }}
                  onChange={handleSelectCompany}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem>
                <label className='bw_checkbox'>
                  <FormInput
                    checked={isAllDepartment}
                    disabled={disabled}
                    type='checkbox'
                    field='is_apply_all_department'
                    // onClick={() => {
                    //   const { error } = getFieldState('departments', formState);
                    //   if (error) clearErrors('departments');
                    // }}
                  />
                  <span />
                  Tất cả phòng ban
                </label>
                {isAllDepartment === 1 && (
                  <FormItem isRequired label='Vị trí duyệt'>
                    <FormSelect
                      defaultValue={0}
                      list={positionOptions}
                      field={`positions`}
                      placeholder='Chọn vị trí duyệt'
                      mode={'multiple'}
                      validation={{
                        required: 'Vị trí là bắt buộc',
                      }}
                    />
                  </FormItem>
                )}
              </FormItem>
            </div>
            {!isAllDepartment && (
              <div className='bw_col_12'>
                <FormItem
                  disabled={disabled || isAllDepartment || departmentOptions.length === 0}
                  isRequired
                  label='Chọn phòng ban'>
                  <FormSelect
                    list={departmentOptions}
                    field='departments'
                    placeholder='Chọn phòng ban'
                    mode={'multiple'}
                    validation={{
                      required: !isAllDepartment ? 'Phòng ban là bắt buộc' : false,
                    }}
                  />

                  {listDepartment?.length > 0 && (
                    <RLMDepartmentTable isValidate={isAllDepartment} data={listDepartment} />
                  )}
                </FormItem>
              </div>
            )}

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
  );
};

export default RLMInformation;
