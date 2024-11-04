import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, notification } from 'antd';
//service
import { getDetail, create, update } from 'services/user-group.service';
import { getOptionsCompany } from 'services/company.service';
import { getOptionsBusiness } from 'services/business.service';
//utils
import { mapDataOptions4Select } from 'utils/helpers';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWButton from 'components/shared/BWButton/index';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

export default function UserGroupAdd({ userGroupId = null, isEdit = true }) {
  const methods = useForm();
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [optionsCompany, setOptionsCompany] = useState(null);
  const [optionsBusiness, setOptionsBusiness] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [tab, setTab] = useState('bw_info');

  useEffect(() => {
    register('is_active');
  }, [register]);

  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
    setTab(id);
  };

  const getData = useCallback(() => {
    try {
      if (userGroupId) {
        getDetail(userGroupId).then((data) => {
          if (data) {
            reset({
              ...data,
            });
          }
        });
      } else {
        reset({
          is_active: 1,
        });
      }
    } catch (error) {
      notification.error({ message: window._$g._(error.message) });
    }
  }, [userGroupId]);

  useEffect(getData, [getData]);

  const getDataOptions = async () => {
    let _company = await getOptionsCompany();
    setOptionsCompany(mapDataOptions4Select(_company));
  };
  useEffect(() => {
    getDataOptions();
  }, []);

  useEffect(() => {
    getOptionsBusiness({
      company_id: watch('company_id'),
    }).then((_business) => setOptionsBusiness(mapDataOptions4Select(_business)));
  }, [watch('user_group_id')]);

  const handleChangeCompany = async (company_id) => {
    const _dataBusiness = await getOptionsBusiness({ company_id });
    setOptionsBusiness(mapDataOptions4Select(_dataBusiness));
    setValue('company_id', company_id);
    setValue('business_id', null);
  };

  const onSubmit = async (values) => {
    let _alerts = [];
    try {
      if (userGroupId) {
        await update(userGroupId, values);
        notification.success({
          message: 'Cập nhật nhóm người dùng thành công',
        });
      } else {
        await create(values);
        notification.success({
          message: 'Thêm mới nhóm người dùng thành công',
        });
        reset({ is_active: 1 });
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('.');
      _alerts.push({ type: 'error', msg });
    } finally {
      setAlerts(_alerts);
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {/* <Alert message="Success Tips" type="success" showIcon /> */}
        {/* general alerts */}
        {(alerts || []).map(({ type, msg }, idx) => {
          return (
            <Alert
              key={`alert-${idx}`}
              type={type}
              message={msg}
              showIcon
            />
          );
        })}
        <div className='bw_row bw_mt_2'>
          <div className='bw_col_3'>
            <ul className='bw_control_form'>
              <li onClick={() => handleScrollToFormItem('bw_info')}>
                <a data-href='#bw_info' className={tab == 'bw_info' ? 'bw_active' : ''}>
                  <span className='fi fi-rr-check' /> Thông tin nhóm người dùng
                </a>
              </li>
              <li onClick={() => handleScrollToFormItem('bw_mores')}>
                <a data-href='#bw_mores' className={tab == 'bw_mores' ? 'bw_active' : ''}>
                  <span className='fi fi-rr-check' /> Trạng thái
                </a>
              </li>
            </ul>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <BWAccordion title='Thông tin nhóm người dùng' id='bw_info' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_6'>
                      <FormItem label='Tên nhóm người dùng' isRequired={true}>
                        <FormInput
                          type='text'
                          field='user_group_name'
                          placeholder='Tên nhóm người dùng'
                          validation={{
                            required: 'Tên nhóm người dùng là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_6'>
                      <FormItem label='Thuộc công ty' isRequired={true}>
                        <FormSelect
                          field='company_id'
                          list={optionsCompany}
                          onChange={handleChangeCompany}
                          validation={{
                            required: 'Công ty là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_6'>
                      <FormItem label='Miền áp dụng' isRequired={true}>
                        <FormSelect
                          field='business_id'
                          list={optionsBusiness}
                          validation={{
                            required: 'Miền là bắt buộc',
                          }}
                          disabled={!isEdit}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_6'>
                      <FormItem label='Thứ tự' isRequired={true}>
                        <FormNumber
                          field='order_index'
                          placeholder='Thứ tự'
                          validation={{
                            required: 'Thứ tự là bắt buộc',
                          }}
                          disabled={!isEdit}
                          bordered={false}
                          style={{
                            width: '100%',
                          }}
                          min={1}
                          max={99999}
                        />
                      </FormItem>
                    </div>
                    <div className='bw_col_12'>
                      <FormItem label='Mô tả'>
                        <FormTextArea field='description' />
                      </FormItem>
                    </div>
                  </div>
                </BWAccordion>
                {/* Status */}
                <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
                  <div className='bw_row'>
                    <div className='bw_col_12'>
                      <div className='bw_frm_box'>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                          <label className='bw_checkbox'>
                            <FormInput type='checkbox' field='is_active' value={watch('is_active')} />
                            <span />
                            Kích hoạt
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </BWAccordion>
                <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
                  <BWButton
                    type='success'
                    submit
                    icon='fi fi-rr-check'
                    content={userGroupId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
                    onClick={handleSubmit(onSubmit)}></BWButton>
                  <BWButton outline content='Đóng' onClick={() => window._$g.rdr('/user-group')}></BWButton>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
