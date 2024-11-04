import { useCallback, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';

import { getOptionsGlobal } from 'actions/global';
import { createReviewLevel } from 'services/regime-type.service';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ReviewLevelModalAddPositionTable from './ReviewLevelModalAddPositionTable';
import BWAccordion from 'components/shared/BWAccordion';

function ReviewLevelModalAdd({ onRefresh }) {
  const dispatch = useDispatch();
  const methods = useForm();
  const { watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'position_list',
  });
  const { companyData, departmentData } = useSelector((state) => state.global);

  const loadCompanyOptions = useCallback(() => {
    dispatch(getOptionsGlobal('company'));
  }, [dispatch]);
  useEffect(loadCompanyOptions, [loadCompanyOptions]);

  // set default value for company_id
  useEffect(() => {
    if (companyData?.length > 0) {
      methods.setValue('company_id', parseInt(companyData[0]?.id));
    }
  }, [companyData, methods]);

  const company_id = watch('company_id');
  const loadDepartmentList = useCallback(() => {
    dispatch(getOptionsGlobal('department', { company_id }));
  }, [dispatch, company_id]);
  useEffect(loadDepartmentList, [loadDepartmentList]);

  const department_ids = watch('department_ids');
  useEffect(() => {
    const selectedDepartmentList = departmentData?.filter((e) => {
      const find = department_ids?.find((p) => p.value === e.id);
      return Boolean(find);
    });

    const position_list = watch('position_list');
    remove();
    append(
      selectedDepartmentList?.map((e) => {
        const find = position_list?.find((p) => p.department_id === e.id);
        return { department_id: e.id, department_name: e.name, ...find };
      }),
    );
  }, [department_ids, departmentData, remove, append, watch]);

  const removeDepartmentIdListItem = (id) => {
    methods.setValue(
      'department_ids',
      department_ids?.filter((e) => e.value !== id),
    );
  };

  const onSubmit = async (payload) => {
    try {
      payload.department_ids = (payload?.department_ids ?? [])?.map((e) => e.value);
      await createReviewLevel(payload);
      onRefresh();
      methods.reset({ is_apply_all_department: false });
      showToast.success(`Thêm mới thành công!!!`);
    } catch (error) {
      showToast.error('Có lỗi xảy ra!');
    }
  };

  return (
    <FormProvider {...methods}>
      <BWAccordion title={'Thêm mới mức duyệt'}>
        <div className='bw_col_12'>
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
                  list={mapDataOptions4SelectCustom(companyData)}
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
                    field='department_ids'
                    placeholder='Chọn phòng ban'
                    list={mapDataOptions4Select(departmentData)}
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
          <div style={{ display: 'flex', flexDirection: 'row-reverse' }} className='bw_row'>
            <button
              style={{ margin: '10px' }}
              type='button'
              onClick={methods.handleSubmit(onSubmit)}
              className='bw_btn bw_btn_success'>
              Thêm mức duyệt
            </button>
          </div>
        </div>
      </BWAccordion>
    </FormProvider>
  );
}

export default ReviewLevelModalAdd;
