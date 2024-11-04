import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// Utils
import { getBase64 } from 'utils/helpers';
import { mapDataOptions4Select } from 'utils/helpers';
import { userStatus } from 'pages/User/helpers/index';
import { getOptionsGlobal } from 'actions/global';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
// Services
import { getOptionByPositionId } from 'services/position-level.service';
import { getOptionsPosition, getOptionByDepartmentId } from 'services/position.service';
import { USER_STATUS } from 'pages/User/helpers/constants';
import { genUsername } from 'services/users.service';
import dayjs from 'dayjs';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { VOIP_EXT } from './utils';

export default function InfoStaff({ disabled = true }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { watch, setError, setValue, register } = methods;
  const [optionsPositionLevel, setOptionsPositionLevel] = useState(null);
  const [optionsPosition, setOptionsPosition] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { blockData, nationData, hobbiesForUserData, departmentByBlockData } = useSelector((state) => state.global);
  const { pathname } = useLocation();
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  const companyOptions = useGetOptions(optionType.company);
  const block_id = watch('block_id');
  const user_id = watch('user_id');
  const position_id = watch('position_id');
  const department_id = watch('department_id');
  // Lay cac gia tri options: phong ban, chuc vu va cap do
  const getOptions = useCallback(() => {
    try {
      if (department_id) {
        getOptionByDepartmentId({ department_id: department_id }).then((data) => {
          setOptionsPosition(mapDataOptions4Select(data));
        });
      }

      if (user_id) {
        dispatch(getOptionsGlobal('departmentByBlock', { parent_id: block_id }));

        getOptionByPositionId({ position_id }).then((res) => {
          setOptionsPositionLevel(mapDataOptions4Select(res));
        });
      }

      dispatch(getOptionsGlobal('block'));

      dispatch(getOptionsGlobal('nation'));

      dispatch(getOptionsGlobal('hobbiesForUser'));
    } catch (error) {
      notification.error({ message: window._$g._(error.message) });
    }
  }, [dispatch, block_id, user_id, position_id, department_id]);

  useEffect(getOptions, [getOptions]);

  const handleChangeBlock = async (value) => {
    methods.clearErrors('block_id');
    methods.setValue('block_id', value);
    methods.setValue('department_id', null);
    methods.setValue('position_id', null);
    methods.setValue('user_level_id', null);
    if (value) {
      dispatch(getOptionsGlobal('departmentByBlock', { parent_id: value }));
    }
  };

  const handleChangeDepartment = async (value) => {
    methods.clearErrors('department_id');
    methods.setValue('department_id', value);
    methods.setValue('position_id', null);
    methods.setValue('user_level_id', null);
  };
  const handleChangeUserStatus = useCallback(
    (status) => {
      setValue('user_status', status);
      if (+status === USER_STATUS.WORKING || +status === USER_STATUS.MATERNITY_LEAVE) {
        setValue('quit_job_date', null);
      }
    },
    [setValue],
  );

  const handleChangePosition = useCallback(
    (value) => {
      methods.clearErrors('position_id');

      methods.setValue('position_id', value);

      getOptionByPositionId({ position_id: value }).then((res) => {
        setOptionsPositionLevel(mapDataOptions4Select(res));
      });
    },
    [methods],
  );

  const handleFileUpload = async (_) => {
    const avatar = _.target.files[0];
    const { size } = avatar;
    if (size / 1000 > 500) {
      setError('default_picture_url', { type: 'custom', message: 'Dung lượng ảnh vượt quá 500kb.' });
      return;
    }
    const getFile = await getBase64(avatar);
    methods.clearErrors('default_picture_url');
    setValue('default_picture_url', getFile);
  };

  useEffect(() => {
    if (isAdd) {
      genUsername().then((res) => {
        setValue('user_name', res.user_name);
      });
    }
  }, [isAdd, setValue]);

  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <BWAccordion title='Thông tin nhân viên' id='bw_info_cus' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <div className='bw_load_image bw_mb_2 bw_text_center'>
            <label className='bw_choose_image'>
              <input
                type='file'
                field='default_picture_url'
                name='default_picture_url'
                accept='image/*'
                onChange={(_) => handleFileUpload(_, 'default_picture_url')}
                disabled={disabled}
              />
              {watch('default_picture_url')?.length ? (
                <img style={{ width: '100%' }} src={watch('default_picture_url') ?? ''}></img>
              ) : (
                <span className='fi fi-rr-picture' />
              )}
            </label>
            <p>Kích thước ảnh: 500px*500px.</p>
            <p>Dung lượng tối đa: 500kb</p>
            {methods.formState.errors['default_picture_url'] && (
              <ErrorMessage message={methods.formState.errors['default_picture_url']?.message} />
            )}
          </div>

          <div className='bw_frm_box bw_disable'>
            <label>Mã nhân viên</label>
            <input type='text' value={watch('user_name')} disabled />
          </div>

          {watch('user_id') && (
            <div className='bw_frm_box bw_disable'>
              <label>Mã phụ nhân viên</label>
              <input type='text' value={watch('sub_username')} disabled />
            </div>
          )}
          {!watch('user_id') && (
            <div className='bw_frm_box bw_relative'>
              <label>
                Mật khẩu <span className='bw_red'>*</span>
              </label>
              <input
                value={methods.watch('password')}
                type={isShowPassword ? 'text' : 'password'}
                placeholder='**************'
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc.',
                })}
              />
              <span
                className='bw_btn bw_change_password'
                style={{ top: 25, height: 33 }}
                onClick={() => setIsShowPassword(!isShowPassword)}>
                <i className={'fi ' + (isShowPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye')}></i>
              </span>
              {methods.formState.errors['password'] && (
                <ErrorMessage message={methods.formState.errors['password']?.message} />
              )}
            </div>
          )}
          <FormItem label='Công ty' isRequired={true} disabled={disabled}>
            <FormSelect
              field='company_id'
              list={companyOptions}
              validation={{
                required: 'Công ty là bắt buộc.',
              }}
            />
          </FormItem>
          <FormItem label='Trạng thái làm việc' isRequired={true} disabled={disabled}>
            <FormSelect
              field='user_status'
              list={userStatus}
              validation={{
                required: 'Trạng thái làm việc là bắt buộc.',
              }}
              onChange={handleChangeUserStatus}
            />
          </FormItem>
          <FormItem label='Sở thích' disabled={disabled}>
            <FormSelect field='hobby_list' mode='multiple' list={mapDataOptions4Select(hobbiesForUserData)} />
          </FormItem>
        </div>

        <div className='bw_col_4'>
          <FormItem label='Họ' isRequired={true} disabled={disabled}>
            <FormInput
              type='text'
              field='first_name'
              placeholder='Họ'
              validation={{
                required: 'Họ là bắt buộc',
                maxLength: {
                  value: 20,
                  message: 'Họ tối đa 20 ký tự.',
                },
              }}
            />
          </FormItem>

          <FormItem label='Khối' isRequired={true} disabled={disabled}>
            <FormSelect
              field='block_id'
              list={mapDataOptions4Select(blockData ?? [])}
              validation={{
                required: 'Đơn vị là bắt buộc.',
              }}
              onChange={handleChangeBlock}
            />
          </FormItem>

          <FormItem label='Chức vụ' isRequired={true} disabled={disabled || !department_id}>
            <FormSelect
              field='position_id'
              list={optionsPosition ?? []}
              validation={{
                required: 'Chức vụ là bắt buộc.',
              }}
              onChange={handleChangePosition}
            />
          </FormItem>

          {/* <FormItem label='Lương' isRequired={true} disabled={disabled}>
            <FormNumber
              // type='number'
              field='hard_salary'
              placeholder='10,000,000'
              validation={{
                required: 'Lương là bắt buộc.',
              }}
            />
          </FormItem> */}

          <FormItem label='Giới tính' isRequired={true} disabled={disabled}>
            <FormRadioGroup
              field={'gender'}
              list={[
                { value: 1, label: 'Nam' },
                { value: 0, label: 'Nữ' },
              ]}
            />
          </FormItem>

          {/* <FormItem label='Ngày thôi việc' disabled={disabled}>
            <FormDatePicker
              format={'DD/MM/YYYY'}
              field={'quit_job_date'}
              placeholder={'dd/mm/yyyy'}
              style={{
                width: '100%',
              }}
              bordered={false}
              allowClear
            />
          </FormItem> */}

          <FormItem label='Số điện thoại' isRequired={true} disabled={disabled}>
            <FormInput
              type='text'
              field='phone_number'
              placeholder='Số điện thoại'
              validation={{
                required: 'Số điện thoại là bắt buộc.',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Số điện thoại phải là số.',
                },
                maxLength: {
                  value: 10,
                  message: 'Số điện thoại không hợp lệ.',
                },
                minLength: {
                  value: 10,
                  message: 'Số điện thoại không hợp lệ.',
                },
              }}
            />
          </FormItem>

          <FormItem label='Email cá nhân' isRequired={true} disabled={disabled}>
            <FormInput
              type='text'
              field='email'
              placeholder='Email cá nhân'
              validation={{
                required: 'Email cá nhân là bắt buộc.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ.',
                },
              }}
              novalidate
            />
          </FormItem>
        </div>

        <div className='bw_col_4'>
          <FormItem label='Tên' isRequired={true} disabled={disabled}>
            <FormInput
              type='text'
              field='last_name'
              placeholder='Tên'
              validation={{
                required: 'Tên là bắt buộc.',
                maxLength: {
                  value: 100,
                  message: 'Tên tối đa 100 ký tự.',
                },
              }}
            />
          </FormItem>

          <FormItem label='Phòng ban' isRequired={true} disabled={disabled || !block_id}>
            <FormSelect
              field='department_id'
              list={mapDataOptions4Select(departmentByBlockData)}
              validation={{
                required: 'Phòng ban là bắt buộc.',
              }}
              onChange={handleChangeDepartment}
            />
          </FormItem>

          <FormItem label='Cấp bậc' disabled={disabled || !methods.watch('position_id')}>
            <FormSelect
              field='user_level_id'
              list={optionsPositionLevel ?? []}
              // validation={{
              //   required: 'Cấp độ là bắt buộc.',
              // }}
            />
          </FormItem>

          <FormItem label='Ngày/Tháng/Năm sinh' isRequired={true} disabled={disabled}>
            <FormDatePicker
              format={'DD/MM/YYYY'}
              field={'birthday'}
              validation={{
                required: 'Ngày/Tháng/Năm sinh là bắt buộc.',
              }}
              placeholder={'dd/mm/yyyy'}
              style={{
                width: '100%',
              }}
              bordered={false}
              allowClear
              disabledDate={disabledDate}
            />
          </FormItem>

          <FormItem label='Dân tộc' disabled={disabled} isRequired={true}>
            <FormSelect
              field='nation_id'
              list={mapDataOptions4Select(nationData ?? [])}
              validation={{
                required: 'Dân tộc là bắt buộc.',
              }}
            />
          </FormItem>

          <FormItem label='Email công ty' disabled={disabled}>
            <FormInput
              type='text'
              field='email_company'
              placeholder='Email công ty'
              validation={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ.',
                },
              }}
              novalidate
            />
          </FormItem>
        </div>
        <div className='bw_col_4'></div>
        <div className='bw_col_8'>
          <FormItem label='Máy nhánh(nếu là bộ phận CSKH)' disabled={disabled}>
            <FormSelect
              field='voip_ext'
              list={VOIP_EXT.map((value) => {
                return {
                  value: value.toString(),
                  label: value.toString(),
                };
              })}
              allowClear
            />
          </FormItem>
          <FormItem label='Ghi chú' disabled={disabled}>
            <FormTextArea field='description' placeholder='Nhập ghi chú' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}
