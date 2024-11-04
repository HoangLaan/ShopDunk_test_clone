import React, { useCallback, useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { getBase64, showToast } from 'utils/helpers';
import { formality } from './constant';
import { createOrderStatus } from 'services/order-status.service';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import OrderStatusPermission from './OrderStatusPermission';

const OrderStatusAddModel = ({ open, onClose, functionOpts }) => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      formality: '0',
    },
  });

  const { watch, setError, setValue, register } = methods;

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '49rem',
    marginLeft: '-20px',
    height: '4rem',
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  const clearInput = useCallback((value = '') => value.trim(), []);

  const onSubmit = async (payload) => {
    try {
      let label;
      payload.is_active = payload.is_active ? 1 : 0;
      payload.order_status_name = clearInput(payload.order_status_name);
      payload.description = clearInput(payload.description);

      await createOrderStatus(payload);
      label = 'Thêm mới';
      methods.reset({
        is_active: 1,
        formality: '0',
      });
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const handleFileUpload = async (_) => {
    const avatar = _.target.files[0];
    const { size } = avatar;
    if (size / 1000 > 500) {
      setError('icon', { type: 'custom', message: 'Dung lượng ảnh vượt quá 500kb.' });
      return;
    }
    const getFile = await getBase64(avatar);
    methods.clearErrors('icon');
    setValue('icon', getFile);
  };

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_addStatus'>
        <div className='bw_modal_container bw_w800' id='bw_order_type_modal' style={styleModal}>
          <div className='bw_title_modal' style={headerStyles}>
            <h3 style={titleModal}>Thêm mới trạng thái đơn hàng</h3>
            <span className='fi fi-rr-cross-small bw_close_modal' onClick={onClose} style={closeModal}></span>
          </div>
          <FormProvider {...methods}>
            <form>
              <div className='bw_main_modal'>
                <div className='bw_collapse'>
                  <div className='bw_row'>
                    <div className='bw_col_4'>
                      <div className='bw_load_image bw_mb_2 bw_text_center'>
                        <label className='bw_choose_image'>
                          <input
                            type='file'
                            field='icon'
                            name='icon'
                            accept='image/*'
                            onChange={(_) => handleFileUpload(_, 'icon')}
                          />
                          {watch('icon')?.length ? (
                            <img alt='' style={{ width: '100%' }} src={watch('icon') ?? ''}></img>
                          ) : (
                            <span className='fi fi-rr-picture' />
                          )}
                        </label>
                        <p>Kích thước ảnh: 500px*500px.</p>
                        <p>Dung lượng tối đa: 500kb</p>
                        {methods.formState.errors['icon'] && (
                          <ErrorMessage message={methods.formState.errors['icon']?.message} />
                        )}
                      </div>
                    </div>
                    <div className='bw_col_8'>
                      <FormItem label='Tên trạng thái' isRequired>
                        <FormInput
                          id='order_status_name'
                          type='text'
                          field='order_status_name'
                          placeholder='Tên trạng thái'
                          validation={{
                            validate: (value) => {
                              value = value?.trim();
                              if (!value || value === '') return 'Tên trạng thái là bắt buộc';
                              return true;
                            },
                          }}
                        />
                      </FormItem>
                      <FormItem label='Mô tả'>
                        <FormTextArea id='description' type='text' field='description' placeholder='Mô tả' />
                      </FormItem>
                    </div>
                  </div>
                </div>

                <div className='bw_collapse bw_mt_2'>
                  <h3 className='bw_title_page'>
                    Chọn hình thức <span className='bw_red'>*</span>
                  </h3>
                  <div className='bw_frm_box bw_mt_1'>
                    <div className='bw_row'>
                      {formality.map((item) => {
                        return (
                          <div className='bw_col_ bw_mb_1'>
                            <label
                              className='bw_radio bw_flex bw_lb_sex bw_align_items_center bw_sex_group'
                              style={{ width: '33%' }}>
                              <input {...register('formality')} value={item.value} type='radio' name='formality' />
                              <span></span>
                              {item.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <OrderStatusPermission functionOpts={functionOpts} />

                <label className='bw_checkbox bw_mt_2'>
                  <FormInput type='checkbox' field='is_active' />
                  <span />
                  Kích hoạt
                </label>
              </div>
              <div className='bw_footer_modal'>
                <button className='bw_btn bw_btn_success' type='button' onClick={methods.handleSubmit(onSubmit)}>
                  <span className='fi fi-rr-check'></span> Thêm mới
                </button>
                <button className='bw_btn_outline' onClick={onClose}>
                  Đóng
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OrderStatusAddModel;
