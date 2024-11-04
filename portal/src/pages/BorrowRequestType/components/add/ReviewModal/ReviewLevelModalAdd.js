import { useEffect } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import { showToast } from 'utils/helpers';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { create } from 'services/borrow-request-rl.service';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import ReviewLevelModalAddPositionTable from './ReviewLevelModalAddPositionTable';
import BWAccordion from 'components/shared/BWAccordion';

function ReviewLevelModalAdd({ onRefresh }) {
  const methods = useForm();
  const { watch } = methods;
  const { company_id, department_ids } = watch();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'position_list',
  });

  const companyOptions = useGetOptions(optionType.company);
  const departmentOptions = useGetOptions(optionType.department, { is_active: 1, company_id });

  useEffect(() => {
    if (companyOptions?.length >= 1 && !methods.getValues('company_id')) {
      methods.setValue('company_id', parseInt(companyOptions[0]?.id));
    }
  }, [companyOptions, methods]);

  useEffect(() => {
    const selectedDepartmentList = departmentOptions?.filter((e) => {
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
  }, [department_ids, departmentOptions, remove, append, watch]);

  const removeDepartmentIdListItem = (id) => {
    methods.setValue(
      'department_ids',
      department_ids?.filter((e) => e.value !== id),
    );
  };

  const onSubmit = async (payload) => {
    try {
      payload.department_ids = (payload?.department_ids ?? [])?.map((e) => e.value);
      await create(payload);
      onRefresh();
      methods.reset({ is_apply_all_department: false });
      showToast.success('Thêm mới thành công');
    } catch (error) {
      showToast.error(error.message);
    }
  };

  return (
    <BWAccordion title='Thêm mới mức duyệt'>
      <FormProvider {...methods}>
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
                list={companyOptions}
                validation={{
                  required: 'Công ty là bắt buộc',
                }}
              />
            </FormItem>
          </div>
        </div>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem isRequired={true} label='Phòng ban'>
              <FormSelect
                type='text'
                field='department_ids'
                placeholder='Chọn phòng ban'
                list={departmentOptions}
                validation={{
                  validate: {
                    required: (v) => v?.length > 0 || 'Phòng ban là bắt buộc',
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
        <div className='bw_row'>
          <button
            style={{ marginTop: 15 }}
            type='button'
            onClick={methods.handleSubmit(onSubmit)}
            className='bw_btn bw_btn_success'>
            Thêm mức duyệt
          </button>
        </div>
      </FormProvider>
    </BWAccordion>
  );
}

export default ReviewLevelModalAdd;
