import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Alert, notification } from 'antd';
import {
  update,
  create,
  read,
  getTotalDayOffWork,
  getOffWorkTypeOpts,
  getListOffWorkRLUser,
  getUserOfDepartmentOpts,
  getUserScheduleOtps,
  updateConfirm,
} from '../helpers/call-api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import OffWorkItem from '../components/OffWorkItem';
import i__defaultImg from 'assets/bw_image/default_img.png';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import { msgError } from '../helpers/msgError';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4Select, showToast } from 'utils/helpers';
import { defaultValues } from '../helpers/const';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

import { getOptionsDepartment } from 'services/department.service';
import OffWorkReviewAdd from '../components/OffWorkReviewAdd';
import OffWorkReviewConfirm from '../components/OffWorkReviewConfirm';
import useDetectHookFormChange from 'hooks/useDetectHookFormChange';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { useAuth } from 'context/AuthProvider';
import { isFloat } from 'utils/number';
import { addDays } from 'utils';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import moment from 'moment';
import useQueryString from 'hooks/use-query-string';
import { useLocation } from 'react-router-dom';
import BWImage from 'components/shared/BWImage';
dayjs.extend(customParseFormat);

const OffWorkAdd = ({ offworkId = null, isEdit = true, isReview = false }) => {
  const { user } = useAuth();
  const methods = useForm({ defaultValues: { ...defaultValues, department_id: user.department_id } });
  const [departmentOpts, setDepartmentOpts] = useState([]);
  const [offworkType, setOffworkType] = useState([]);
  const [dayOffWork, setDayOffWork] = useState({});
  const [userOpts, setUserOpts] = useState([]);
  const [query] = useQueryString();
  const { pathname } = useLocation();
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);

  const {
    register,
    unregister,
    watch,
    setValue,
    reset,
    handleSubmit,
    setError,
    getValues,
    control,
    formState: { errors },
  } = methods;

  const isValidConfirm = user.user_name === watch('user_refuse');

  const { append, remove, fields, setFields } = useFieldArray({
    control,
    name: 'shift_schedule',
  });

  const isShowTotalTimeOff = watch('from_date') && watch('to_date');
  const is_refuse = watch('is_refuse');
  const is_confirm = watch('is_confirm');

  const [alerts, setAlerts] = useState([]);

  const getInitData = useCallback(async () => {
    try {
      // lấy chi tiết phép của user
      let _dayOffWork = await getTotalDayOffWork({off_workId: offworkId});
      setDayOffWork(_dayOffWork);

      // lấy option loại nghỉ phép
      let _offworkType = await getOffWorkTypeOpts();

      setOffworkType(_offworkType);

      // Lấy option phòng ban
      let _departmentOpts = await getOptionsDepartment();
      setDepartmentOpts(mapDataOptions4Select(_departmentOpts));

      if (offworkId) {
        let _offworkDetail = await read(offworkId, { useReview: isReview });
        setValue(
          'shift_schedule',
          _offworkDetail.date_list?.map((x) => ({ date: x })),
        );
        setValue('shift_list', _offworkDetail.shift_list);
        reset({ ..._offworkDetail });
      }
    } catch (error) {
      notification.error({
        message: 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  }, [watch('shift_schedule')]);

  useEffect(() => {
    getInitData();
  }, [getInitData]);

  useEffect(() => {
    register('is_active');
    register('is_sub_time_off');
    register('values_off');
  }, [register]);

  const handlegetOffworkRLOptions = useCallback(async () => {
    if (watch('off_work_type_id') && !isReview) {
      try {
        // Lấy danh sách user duyệt của loại phiếu nghỉ phép
        const _listOffWorkRLUser = await getListOffWorkRLUser({ off_work_type_id: watch('off_work_type_id') });

        // set user duyệt mặc định cho từng mức duyệt
        if (_listOffWorkRLUser?.items && _listOffWorkRLUser?.items.length) {
          const _offWorkRLUser = _listOffWorkRLUser?.items;

          let offwork_review_list = _offWorkRLUser.map((_user) => {
            return {
              ..._user,
              review_user: _user?.users && _user?.users.length > 0 ? _user?.users[0]?.username : null,
            };
          });

          setValue('offwork_review_list', offwork_review_list);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [watch('off_work_type_id')]);

  useEffect(() => {
    handlegetOffworkRLOptions();
  }, [handlegetOffworkRLOptions]);

  useEffect(() => {
    if (!offworkId) {
      setValue('user_refuse', null);
    }
  }, [offworkId]);

  useEffect(() => {
    if (isShowTotalTimeOff) {
      getUserOfDepartmentOpts({
        department_id: watch('department_id'),
        from_date: watch('from_date'),
        to_date: watch('to_date'),
      }).then((res) => setUserOpts(mapDataOptions4Select(res)));
    }
  }, [watch('department_id'), isShowTotalTimeOff]);

  const handleChangeReviewList = (value, offwork_review_level_id) => {
    // offwork_review_list
    let _offwork_review_list = watch('offwork_review_list');

    if (_offwork_review_list && _offwork_review_list.length) {
      // Lấy vị trí thay đổi
      let idx = _offwork_review_list.findIndex(
        (_offwork) => _offwork?.offwork_review_level_id == offwork_review_level_id,
      );

      if (idx > -1) {
        _offwork_review_list[idx].review_user = value;
      }
    }

    setValue('offwork_review_list', _offwork_review_list);
  };

  const onSubmit = async (values) => {
    try {
      const total_time_off = watch('total_time_off');
      if (!total_time_off || total_time_off === 0) return showToast.error('Số ngày nghỉ phải > 0');

      if (total_time_off && total_time_off > 0 && isShowTotalTimeOff) {
        values.to_date = dayjs(watch('from_date'), 'DD/MM/YYYY')
          .add(Math.ceil(total_time_off) - 1, 'day')
          .format('DD/MM/YYYY');
      }

      if (offworkId) {
        await update(offworkId, values);
        notification.success({
          message: 'Cập nhật đăng kí nghỉ phép thành công',
        });
      } else {
        if (values.is_refuse) {
          values = {
            ...values,
            full_name: user.full_name,
            full_name_refuse: userOpts
              ?.find((u) => u.id === String(values.user_refuse))
              ?.name?.split('-')?.[1]
              ?.trim(),
          };
        }
        await create(values);
        notification.success({
          message: 'Đăng kí nghỉ phép thành công',
        });
        reset({ is_active: 1, is_approve: 2 });
        setAlerts([]);
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('<br/>');
      setAlerts([{ type: 'error', msg }]);
    }
  };

  const off_work_type_id = watch('off_work_type_id');
  const disabledDate = useCallback(
    (current) => {
      let dateDisable = dayjs().startOf('day');

      if (off_work_type_id) {
        const offWorkTypeCurrent = offworkType.find((_offwork) => _offwork.off_work_type_id === off_work_type_id);
        const before_day = offWorkTypeCurrent?.before_day;
        // before_day < 0: Đăng kí nghỉ phép ở tương lai, before_day > 0: Đăng kí nghỉ phép sau khi đã nghỉ trước đó
        dateDisable = dayjs()
          .add(before_day < 0 ? Math.abs(before_day) : -before_day, 'day')
          .startOf('day');
      }
      return current && current < dateDisable;
    },
    [off_work_type_id],
  );

  useEffect(() => {
    if (isShowTotalTimeOff) {
      let total_time_off = 0;
      let from_date = dayjs(watch('from_date'), 'DD/MM/YYYY');
      let to_date = dayjs(watch('to_date'), 'DD/MM/YYYY');
      total_time_off = to_date.diff(from_date, 'day');

      if (total_time_off < 0) {
        setError('to_date', { type: 'custom', message: 'Ngày nghỉ phép không hợp lệ.' });
      } else {
        handleChangeTimeOff(total_time_off + 1);
      }
    }
  }, [isShowTotalTimeOff]);

  const handleChangeTimeOff = (value) => {
    value = parseFloat(value ?? 0);
    methods.clearErrors('total_time_off');
    // kiểm tra xem số ngày nghỉ có lớn hơn số ngày nghỉ tối đa của loại phép không
    let _offworkType = offworkType.find((_offwork) => _offwork.off_work_type_id == watch('off_work_type_id'));

    if (parseFloat(_offworkType?.max_day_off) < value && parseFloat(_offworkType?.max_day_off) > 0) {
      value = _offworkType?.max_day_off;
    }

    if (parseInt(_offworkType?.is_sub_time_off) === 1 && parseFloat(dayOffWork?.time_can_off) < parseFloat(value)) {
      value = dayOffWork?.time_can_off;
    }

    if (isShowTotalTimeOff) {
      let from_date = dayjs(watch('from_date'), 'DD/MM/YYYY');
      let to_date = dayjs(watch('to_date'), 'DD/MM/YYYY');
      const total_time_off = parseFloat(to_date.diff(from_date, 'day') + 1);
      if (total_time_off < value) {
        value = total_time_off;
      }

      // Nếu là ngày lẻ thì hiện giờ để chọn
      if (isFloat(value)) {
        setValue('start_hour', '01:00');
      } else {
        unregister('start_hour');
      }
    }

    setValue('total_time_off', value);
  };

  useEffect(() => {
    if (!is_refuse) {
      reset(getValues());
    }
  }, [is_refuse]);

  useEffect(() => {
    setValue('from_date', '');
    setValue('to_date', '');
    setValue('total_time_off', 0);
    setValue('content_off_work', '');
    setValue('department_id', '');
  }, [off_work_type_id])

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {/* general alerts */}
        {alerts.map(({ type, msg }, idx) => {
          return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
        })}
        <div className='bw_row'>
          <div className='bw_col_3'>
            <ul className='bw_control_form bw_info_wod'>
              <li>
                Tổng phép tồn: <b>{dayOffWork?.total_time}</b>
              </li>
              <li className='bw_mt_2'>
                Số phép đã sử dụng: <b className='bw_red'>{dayOffWork?.total_time_off}</b>
              </li>
              <li className='bw_mt_2'>
                Số phép có thể sử dụng: <b className='bw_green '>{dayOffWork?.time_can_off}</b>
              </li>
            </ul>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <BWAccordion title='Thông tin đăng ký' id='bw_info_cus' isRequired={true}>
                <div className='bw_row'>
                  <div className='bw_col_6'>
                    <FormItem label='Loại phép' className='bw_col_12' isRequired={true} disabled={!isEdit || isReview}>
                      <FormSelect
                        field='off_work_type_id'
                        id='off_work_type_id'
                        list={offworkType}
                        allowClear={true}
                        validation={{ required: 'Loại nghỉ phép là bắt buộc' }}
                        style={{ height: '32px' }}
                      />
                    </FormItem>
                    <FormItem
                      label='Ngày nghỉ'
                      className='bw_col_12'
                      isRequired={true}
                      disabled={!isEdit || isReview || !off_work_type_id}>
                      <FormDateRange
                        allowClear={true}
                        fieldStart={'from_date'}
                        fieldEnd={'to_date'}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        format={'DD/MM/YYYY'}
                        disabledDate={disabledDate}
                      />
                    </FormItem>
                  </div>
                  <div className='bw_col_6' style={{paddingTop: '10px'}}>
                  {offworkId && <FormItem label='Thông tin nhân viên' isRequired={true} disabled={!isEdit || isReview}>
                    <div className='bw_row'>
                      <div className="bw_col_2">
                        <BWImage style={{maxWidth:'100%', width: '60px',height: 'auto', borderRadius: '50%'}} src={watch('default_picture_url') ? process.env.REACT_APP_CDN + watch('default_picture_url') : i__defaultImg} />
                      </div>
                      <div className='bw_col_10'>
                        {watch('user_name')} - {watch('full_name')} <br/>
                        Phòng ban: {watch('department_name')}
                      </div>
                    </div>
                  </FormItem>}
                  </div>
                  {isShowTotalTimeOff && (
                    <>
                      <FormItem
                        label='Số ngày nghỉ'
                        className='bw_col_12'
                        isRequired={true}
                        disabled={!isEdit || isReview}>
                        <FormNumber
                          field='total_time_off'
                          placeholder='Số ngày nghỉ'
                          validation={msgError['total_time_off']}
                          onChange={(value) => handleChangeTimeOff(value)}
                        />
                        <span style={{ fontSize: 11 }}>
                          Vui lòng trừ đi số ngày lễ, thứ 7 và chủ nhật nếu chọn thời gian nghỉ trùng.
                        </span>
                      </FormItem>

                      {watch('start_hour') && (
                        <FormItem label='Giờ nghỉ' className='bw_col_6' isRequired={true} disabled={!isEdit}>
                          <div className='bw_row'>
                            <FormItem
                              label='Giờ bắt đầu'
                              className='bw_col_6'
                              isRequired={true}
                              disabled={!isEdit || isReview}>
                              <FormDatePicker
                                field='start_hour'
                                placeholder={'--:--'}
                                style={{
                                  width: '100%',
                                }}
                                format='HH:mm'
                                bordered={false}
                                allowClear
                                picker={'time'}
                              />
                            </FormItem>
                            <FormItem
                              label='Giờ kết thúc'
                              className='bw_col_6'
                              isRequired={true}
                              disabled={!isEdit || isReview || !watch('start_hour')}>
                              <FormDatePicker
                                field='end_hour'
                                placeholder={'--:--'}
                                style={{
                                  width: '100%',
                                }}
                                format='HH:mm'
                                bordered={false}
                                allowClear
                                picker={'time'}
                              />
                            </FormItem>
                          </div>
                        </FormItem>
                      )}
                    </>
                  )}

                  <FormItem label='Lý do' className='bw_col_12' isRequired={true} disabled={!isEdit || isReview}>
                    <FormTextArea
                      type='text'
                      field='content_off_work'
                      placeholder='Lý do xin nghỉ'
                      validation={{ required: 'Lý do nghỉ là bắt buộc' }}
                    />
                  </FormItem>
                  {/* {(fields || []).map((x,index)=>  <OffWorkItem offwork={x} index={index} shift_list={watch('shift_list')}  date={x}/>)}
                    <div className='bw_col_12'>
                    <BWButton
                    type='success'
                    icon={'fi fi-rr-plus'}
                    content={'Thêm ngày nghỉ'}
                    onClick={() => append({})}
                    />
                    </div> */}
                </div>
              </BWAccordion>
              <BWAccordion title='Nhân sự thay thế' id='bw_confirm'>
                <div className='bw_row'>
                  <div className='bw_col_12'>
                    <div className='bw_frm_box'>
                      <label className='bw_checkbox bw_auto_confirm'>
                        <FormInput type='checkbox' field='is_refuse' disabled={!isEdit || isReview} />
                        <span></span>
                        Có nhân sự thay thế
                      </label>
                    </div>
                  </div>
                </div>

                {is_refuse ? (
                  <div className='bw_row'>
                    <FormItem label='Phòng ban' className='bw_col_4' disabled={!isEdit || isReview}>
                      <FormSelect
                        field='department_id'
                        id='department_id'
                        list={departmentOpts}
                        //validation={watch('is_refuse') ? { required: 'Phòng ban thay thế là bắt buộc' } : null}
                      />
                    </FormItem>
                    <FormItem
                      label='Nhân sự thay thế'
                      className='bw_col_4'
                      disabled={!isEdit || isReview || !watch('department_id') || !isShowTotalTimeOff}
                      isRequired={is_refuse}>
                      <FormSelect
                        field='user_refuse'
                        id='user_refuse'
                        list={userOpts}
                        validation={{ required: is_refuse ? 'Nhân sự thay thế là bắt buộc' : null }}
                      />
                    </FormItem>
                    {!isAdd ? (
                      <>
                        <FormItem
                          label='Trạng thái xác nhận từ nhân sự thay thế'
                          className='bw_col_4'
                          disabled={!isValidConfirm}>
                          <div className='bw_text_center'>
                            {offworkId &&
                              (is_confirm !== null ? (
                                <BWButton
                                  button
                                  type={is_confirm ? 'success' : 'danger'}
                                  content={is_confirm ? 'Đã xác nhận' : 'Không xác nhận'}
                                />
                              ) : (
                                <>
                                  <BWButton
                                    type='success'
                                    button
                                    icon='fi fi-rr-check'
                                    content='Xác nhận thay thế'
                                    onClick={() => {
                                      updateConfirm({ off_work_id: offworkId, is_confirm: 1 }).then(() => {
                                        getInitData();
                                        showToast.success('Xác nhận thành công');
                                      });
                                    }}></BWButton>
                                  <BWButton
                                    type='danger'
                                    button
                                    icon='fi fi-rr-check'
                                    content='Không xác nhận'
                                    onClick={() => {
                                      updateConfirm({ off_work_id: offworkId, is_confirm: 0 }).then(() => {
                                        getInitData();
                                        showToast.success('Xác nhận thành công');
                                      });
                                    }}></BWButton>
                                </>
                              ))}
                          </div>
                        </FormItem>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </BWAccordion>
              {!watch('off_work_type_id') ? (
                <div className='bw_items_frm' id='bw_confirm'>
                  <div className='bw_collapse bw_mt_2 bw_active'>
                    <div className='bw_collapse_title'>
                      <span className='fi fi-rr-angle-small-down'></span>
                      <h3>
                        Mức duyệt phép <span className='bw_red'></span>
                      </h3>
                    </div>
                    <div className='bw_collapse_panel'>
                      <div className='bw_row'>
                        <div className='bw_col_12'>
                          <div className='bw_frm_box'>
                            <b className='bw_red'>Bạn vui lòng chọn "Loại nghỉ phép" để thực hiện.</b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <BWAccordion title='Mức duyệt phép' id='bw_confirm'>
                  {!isReview ? (
                    <OffWorkReviewAdd
                      offworkReviewList={watch('offwork_review_list') || []}
                      handleChangeReviewList={handleChangeReviewList}
                      disabled={!isEdit || isReview}
                    />
                  ) : (
                    <OffWorkReviewConfirm offworkReviewList={watch('offwork_review_list') || []} />
                  )}
                </BWAccordion>
              )}
            </FormProvider>
          </div>
        </div>
      </div>
      <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
        {!isReview && watch('is_approve') == 2 ? (
          !isEdit ? (
            <BWButton
              type='success'
              button
              outline
              icon='fi fi-rr-edit'
              content='Chỉnh sửa'
              onClick={() => window._$g.rdr(`/off-work/edit/${offworkId}`)}></BWButton>
          ) : (
            <BWButton
              type='success'
              submit
              icon='fi fi-rr-check'
              content={offworkId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
              onClick={handleSubmit(onSubmit)}></BWButton>
          )
        ) : (
          <></>
        )}
        <BWButton type='' outline content='Đóng' button onClick={() => window._$g.rdr('/off-work')}></BWButton>
      </div>
    </React.Fragment>
  );
};

export default OffWorkAdd;
