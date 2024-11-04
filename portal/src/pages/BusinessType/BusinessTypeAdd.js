import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert } from 'antd';
import { useAuth } from 'context/AuthProvider';
//service
import { create, getDetail, update } from 'services/business-type.service';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import BWButton from 'components/shared/BWButton/index';
import { showToast } from 'utils/helpers';

export default function BusinessTypeAdd({ businessTypeId = null, isEdit = true }) {
  const { user } = useAuth();
  const isAdministrator = user.isAdministrator ? user.isAdministrator : 0;
  const methods = useForm({
    defaultValues: {
      bank_accounts: [],
    },
  });
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    register('is_active');
  }, [register]);

  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
  };

  const getData = useCallback(() => {
    try {
      if (businessTypeId) {
        getDetail(businessTypeId)
          .then((data) => {
            if (data) {
              reset({
                ...data,
              });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        reset({
          is_active: 1,
        });
      }
    } catch (error) {}
  }, [businessTypeId]);
  useEffect(getData, [getData]);

  const onSubmit = async (values) => {
    try {
      if (businessTypeId) {
        await update(businessTypeId, values);
        showToast.success('Cập nhật loại miền thành công!!!');
      } else {
        await create(values);
        showToast.success('Thêm mới loại miền thành công!!!');

        reset({ is_active: 1 });
      }
      setAlerts([]);
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('<br/>');
      setAlerts([{ type: 'error', msg }]);
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp business_type'>
        {/* general alerts */}
        {alerts.map(({ type, msg }, idx) => {
          return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
        })}
        <div className='bw_row bw_mt_2'>
          <div className='bw_col_3'>
            <ul className='bw_control_form'>
              <li onClick={() => handleScrollToFormItem('bw_info_cus')}>
                <a data-href='#bw_info_cus' className={`${Boolean(watch('business_type_name')) ? 'bw_active' : ''}`}>
                  <span className='fi fi-rr-check' />
                  Thông tin loại miền
                </a>
              </li>
              <li onClick={() => handleScrollToFormItem('bw_mores')}>
                <a data-href='#bw_mores' className='bw_active'>
                  <span className='fi fi-rr-check' /> Trạng thái
                </a>
              </li>
            </ul>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <BWAccordion title='Thông tin loại miền' id='bw_info_cus'>
                  <div className='bw_row'>
                    <div className='bw_col_12'>
                      <FormItem label='Tên loại miền' isRequired>
                        <FormInput
                          type='text'
                          field='business_type_name'
                          placeholder='Nhập tên loại miền'
                          validation={{
                            required: 'Tên loại miền là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>

                    <div className='bw_col_12'>
                      <FormItem label='Mô tả'>
                        <FormTextArea field='descriptions' rows={3} disabled={!isEdit} placeholder='Mô tả' />
                      </FormItem>
                    </div>
                  </div>
                </BWAccordion>

                <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_12'>
                      <div className='bw_frm_box'>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                          <label className='bw_checkbox'>
                            <FormInput
                              type='checkbox'
                              field='is_active'
                              value={watch('is_active')}
                              disabled={!isEdit}
                            />
                            <span />
                            Kích hoạt
                          </label>
                          <label className='bw_checkbox'>
                            <FormInput type='checkbox' field='is_system' disabled={!isEdit} />
                            <span />
                            Hệ thống
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </BWAccordion>
                <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
                  {isEdit ? (
                    <BWButton
                      type='success'
                      submit
                      icon='fi fi-rr-check'
                      content={businessTypeId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
                      onClick={handleSubmit(onSubmit)}
                      disabled={isAdministrator || !watch('is_system') ? false : true}
                    />
                  ) : (
                    <BWButton
                      type='success'
                      outline
                      content='Chỉnh sửa'
                      onClick={() => window._$g.rdr(`/business-type/edit/${businessTypeId}`)}
                      disabled={isAdministrator || !watch('is_system') ? false : true}
                      className={isAdministrator || !watch('is_system') ? '' : 'btn_disabled'}
                    />
                  )}
                  <BWButton type='' outline content='Đóng' onClick={() => window._$g.rdr('/business-type')} />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
