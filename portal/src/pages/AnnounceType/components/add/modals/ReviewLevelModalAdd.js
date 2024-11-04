import { useForm, FormProvider } from 'react-hook-form';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { createReviewLevel } from 'services/announce-type.service';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { showToast } from 'utils/helpers';

function ReviewLevelModalAdd({ onRefresh }) {
  const methods = useForm();
  const onSubmit = async (payload) => {
    try {
      payload.department_id_list = (payload?.department_id_list ?? [])?.map((e) => e.value);
      await createReviewLevel(payload);
      onRefresh();
      methods.reset({ is_apply_all_department: false });
      showToast.success(`Thêm mới thành công!!!`);
    } catch (error) {
      showToast.error(error.message || 'Có lỗi xảy ra!');
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
          <div className='bw_col_12'>
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
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Mô tả'>
            <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
          </FormItem>
        </div>

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
