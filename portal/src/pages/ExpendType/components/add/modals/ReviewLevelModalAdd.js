import { useCallback, useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { createReviewLevel, getCompanyOptions, getDepartmentOptions } from 'services/expend-type.service';
import ReviewLevelModalAddPositionTable from './ReviewLevelModalAddPositionTable';
import { showToast } from 'utils/helpers';

function ReviewLevelModalAdd({ onRefresh }) {
  const methods = useForm();
  const { watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'position_list',
  });
  const [companyList, setCompanyList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const loadCompanyList = useCallback(() => {
    getCompanyOptions().then(setCompanyList);
  }, []);
  useEffect(loadCompanyList, [loadCompanyList]);

  useEffect(() => {
    if (companyList?.length === 1 && !methods.getValues('company_id')) {
      methods.setValue('company_id', companyList[0]?.id);
    }
  }, [companyList, methods]);
  const company_id = watch('company_id');
  const loadDepartmentList = useCallback(() => {
    getDepartmentOptions({ company_id: company_id }).then(setDepartmentList);
  }, [company_id]);
  useEffect(loadDepartmentList, [loadDepartmentList]);

  const department_id_list = watch('department_id_list');
  useEffect(() => {
    const selectedDepartmentList = departmentList.filter((e) => {
      const find = department_id_list?.find((p) => p.value === e.id);
      return Boolean(find);
    });

    const position_list = watch('position_list');
    remove();
    append(
      selectedDepartmentList.map((e) => {
        const find = position_list?.find((p) => p.department_id === e.id);
        return { department_id: e.id, department_name: e.name, position_id: [{ id: 0, value: 0 }], ...find };
      }),
    );
  }, [department_id_list, departmentList, remove, append, watch]);

  const removeDepartmentIdListItem = (id) => {
    methods.setValue(
      'department_id_list',
      department_id_list?.filter((e) => e.value !== id),
    );
  };

  const onSubmit = async (payload) => {
    try {
      payload.department_id_list = (payload?.department_id_list ?? [])?.map((e) => e.value);
      await createReviewLevel(payload);
      onRefresh();
      methods.reset({ is_apply_all_department: false });
      showToast.success('Thêm mới thành công !');
    } catch (error) {
      showToast.error('Có lỗi xảy ra !');
    }
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
          <div className='bw_col_6'>
            <FormItem isRequired label='Tên mức duyệt'>
              <FormInput
                type='text'
                field='review_level_name'
                placeholder='Nhập tên mức duyệt'
                validation={{
                  required: 'Tên mức duyệt là bắt buộc',
                }}
              />
            </FormItem>
          </div>

          <div className='bw_col_6'>
            <FormItem isRequired label='Công ty'>
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
                validation={{
                  required: 'Công ty là bắt buộc',
                }}
              />
            </FormItem>
          </div>
        </div>
        <div className='bw_row' style={{ marginBottom: '10px' }}>
          <div className='bw_col_12'>
            <label className='bw_checkbox'>
              <FormInput type='checkbox' field='is_apply_all_department' />
              <span />
              Tất cả phòng ban
            </label>
          </div>
        </div>
        {!methods.watch('is_apply_all_department') && (
          <div className='bw_row'>
            <div className='bw_col_12'>
              <FormItem isRequired={!methods.watch('is_apply_all_department')} label='Phòng ban'>
                <FormSelect
                  type='text'
                  field='department_id_list'
                  placeholder='Chọn phòng ban'
                  list={departmentList?.map((p) => {
                    return {
                      label: p?.name,
                      value: p?.id,
                    };
                  })}
                  validation={{
                    // required: !Boolean(methods.watch('is_apply_all_department')) && 'Phòng ban là bắt buộc',
                    validate: {
                      required: (v) =>
                        methods.watch('is_apply_all_department') || v?.length > 0 || 'Phòng ban là bắt buộc',
                    },
                  }}
                  mode={'multiple'}
                  allowClear={true}
                  disabled={!company_id}
                />
              </FormItem>
              <ReviewLevelModalAddPositionTable data={fields} onRemove={removeDepartmentIdListItem} remove={remove} />
            </div>
          </div>
        )}
        <div className='bw_row'>
          <button
            style={{ margin: '10px' }}
            type='button'
            onClick={methods.handleSubmit(onSubmit)}
            className='bw_btn bw_btn_success'>
            Thêm mức duyệt
          </button>
        </div>
      </div>
    </FormProvider>
  );
}

export default ReviewLevelModalAdd;
