import React from 'react';
import PropTypes from 'prop-types';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { showToast } from 'utils/helpers';
import { createWorkType } from 'services/position.service';
import { useForm, FormProvider } from 'react-hook-form';

const WorkTypeAddModal = ({ onClose, disabled }) => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      await createWorkType(payload);
      onClose();
      showToast.success(`Thêm mới thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className='bw_modal bw_modal_open' id='bw_skill'>
        <div className='bw_modal_container bw_w800'>
          <div className='bw_title_modal'>
            <h3>Thêm loại công việc</h3>
            <span onClick={onClose} className='fi fi-rr-cross-small bw_close_modal'></span>
          </div>

          <div
            className='bw_main_modal'
            style={{
              background: '#f1f1f1',
            }}>
            <div className='bw_col_12'>
              <div className='bw_row'>
                <div className='bw_col_12'>
                  <FormItem isRequired label='Tên loại công việc'>
                    <FormInput
                      type='text'
                      field='work_type_name'
                      placeholder='Nhập tên loại công việc'
                      validation={{
                        required: 'Tên loại công việc là bắt buộc',
                      }}
                    />
                  </FormItem>
                </div>

                <div className='bw_col_12'>
                  <FormItem label='Mô tả'>
                    <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
                  </FormItem>
                </div>

                <div className='bw_col_12'>
                  <div className='bw_frm_box'>
                    <div className='bw_flex bw_align_items_center bw_lb_sex'>
                      <label className='bw_checkbox'>
                        <FormInput disabled={disabled} type='checkbox' field='is_active' />
                        <span />
                        Kích hoạt
                      </label>

                      <label className='bw_checkbox'>
                        <FormInput disabled={disabled} type='checkbox' field='is_system' />
                        <span />
                        Hệ thống
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='bw_footer_modal'>
            <button type='button' onClick={methods.handleSubmit(onSubmit)} className='bw_btn bw_btn_success'>
              Chọn loại công việc
            </button>
            <button onClick={onClose} className='bw_btn_outline bw_close_modal'>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

WorkTypeAddModal.propTypes = {
  onClose: PropTypes.func,
  disabled: PropTypes.bool,
};

WorkTypeAddModal.defaultProps = {
  onClose: () => {},
  disabled: false,
};

export default WorkTypeAddModal;
