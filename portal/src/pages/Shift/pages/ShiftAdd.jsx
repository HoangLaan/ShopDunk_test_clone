import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, notification } from 'antd';
import { update, create, read, gencode } from '../helpers/call-api';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { msgError } from '../helpers/msgError';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { defaultValues } from '../helpers/const';
import ShiftReviewTable from '../components/add/ShiftReviewTable';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import StoresTable from '../components/add/StoresTable';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const ALL_VALUE = 0;

dayjs.extend(customParseFormat);

const ShiftAdd = ({ shiftId = null, isEdit = true }) => {
  const methods = useForm({ defaultValues: defaultValues });

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    clearErrors,
    getValues,
    formState: { errors },
  } = methods;

  const OVERTIME_TYPE = [
    { value: 0, label: 'Không', key: 'shift_isovertime' },
    { value: 1, label: 'Có', key: 'shift_isovertime' },
  ];
  const isBreakShift = watch('is_break_shift');

  const [alerts, setAlerts] = useState([]);
  const storeOptions = useGetOptions(optionType.store);
  useEffect(() => {
    register('is_active');
    register('shift_time');
    register('shift_code');
    register('date_apply', {
      validate: () => {
        if (
          !watch('is_apply_monday') &&
          !watch('is_apply_tuesday') &&
          !watch('is_apply_wednesday') &&
          !watch('is_apply_thursday') &&
          !watch('is_apply_friday') &&
          !watch('is_apply_saturday') &&
          !watch('is_apply_sunday')
        ) {
          return 'Ngày áp dụng trong tuần là bắt buộc.';
        }
      },
    });
  }, [register]);

  useEffect(() => {
    clearErrors('date_apply');
  }, [
    watch('is_apply_monday'),
    watch('is_apply_tuesday'),
    watch('is_apply_wednesday'),
    watch('is_apply_thursday'),
    watch('is_apply_friday'),
    watch('is_apply_saturday'),
    watch('is_apply_sunday'),
  ]);

  const getInitData = useCallback(async () => {
    try {
      if (shiftId) {
        const shift = await read(shiftId);
        reset({ ...shift });
      } else {
        const code = await gencode();
        setValue('shift_code', code ? code.shift_code.trim() : '');
      }
    } catch (error) {
      notification.error({
        message: 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  }, [shiftId]);

  useEffect(() => {
    getInitData();
  }, [getInitData]);

  // const time_start = watch('time_start');
  // const time_end = watch('time_end');
  // useEffect(() => {
  //   if (time_start) {
  //     setValue('time_checkin', time_start);
  //   }
  //   if (time_end) {
  //     setValue('time_checkout', time_end);
  //   }
  // }, [time_start, time_end]);

  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
  };

  const onSubmit = async (values) => {
    try {
      if (values.shift_isovertime === 1) {
        values = {
          ...values,
          // Remove options users review
          shift_review: values.shift_review.map(({ users, ...item }) => ({ ...item })),
        };
      }
      values.is_active = values.is_active ? 1 : 0;
      values.store_apply_list = values?.store_apply_list?.map((item) => ({ id: item.store_id, value: item.store_id }));
      if (shiftId) {
        await update(shiftId, values);
        notification.success({
          message: 'Cập nhật ca làm việc thành công',
        });
      } else {
        await create(values);
        notification.success({
          message: 'Thêm mới ca làm việc thành công',
        });
        reset({ is_active: 1 });
        setAlerts([]);
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('<br/>');
      setAlerts([{ type: 'error', msg }]);
    }
  };

  useEffect(() => {
    calShiftTime();
  }, [watch('time_start'), watch('time_end'), watch('time_break_start'), watch('time_break_end')]);

  const calShiftTime = () => {
    let {
      time_start = '00:00',
      time_end = '00:00',
      time_break_start = '00:00',
      time_break_end = '00:00',
    } = getValues();

    time_start = time_start ? time_start.split(':') : [0, 0];
    time_end = time_end ? time_end.split(':') : [0, 0];
    time_break_start = time_break_start ? time_break_start.split(':') : [0, 0];
    time_break_end = time_break_end ? time_break_end.split(':') : [0, 0];

    const shift_hourstart = time_start ? time_start[0] : 0;
    const shift_minutestart = time_start ? time_start[1] : 0;

    const shift_hourbreakstart = time_break_start ? time_break_start[0] : 0;
    const shift_minusbreakstart = time_break_start ? time_break_start[1] : 0;

    const shift_hourend = time_end ? time_end[0] : 0;
    const shift_minutend = time_end ? time_end[1] : 0;

    const shift_hourbreakend = time_break_end ? time_break_end[0] : 0;
    const shift_minusbreakend = time_break_end ? time_break_end[1] : 0;

    let shift_time = 0;
    // TÍNH THỜI GIAN NGHỈ
    let timebreak = 0;
    let totaltimeStart = 1 * shift_hourstart * 60 + 1 * shift_minutestart;
    let totaltimeEnd = 1 * shift_hourend * 60 + 1 * shift_minutend;
    let totaltimeBreakStart = 1 * shift_hourbreakstart * 60 + 1 * shift_minusbreakstart;
    let totaltimeBreakEnd = 1 * shift_hourbreakend * 60 + 1 * shift_minusbreakend;

    if (totaltimeStart > totaltimeBreakStart || totaltimeEnd < totaltimeBreakEnd) {
      timebreak = 0;
    } else {
      timebreak =
        shift_hourbreakstart && shift_hourbreakend
          ? shift_hourbreakend * 60 +
            1 * shift_minusbreakend -
            (1 * shift_hourbreakstart * 60 + 1 * shift_minusbreakstart)
          : 0;
    }
    //GIỜ VÀO LÀM LỚN HƠN GIỜ NGHỈ(Trường hợp làm qua đêm)
    if (1 * shift_hourend < 1 * shift_hourstart) {
      shift_time =
        24 * 60 -
        (1 * shift_hourstart * 60 + 1 * shift_minutestart - (1 * shift_hourend * 60 + 1 * shift_minutend)) -
        timebreak;
    } else {
      //GIỜ VÀO LÀM BÉ HƠN GIỜ NGHỈ
      shift_time =
        1 * shift_hourend * 60 + 1 * shift_minutend - (shift_hourstart * 60 + 1 * shift_minutestart) - timebreak;
    }

    setValue('shift_time', shift_time > 0 ? shift_time : 0);
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {/* general alerts */}
        {alerts.map(({ type, msg }, idx) => {
          return <Alert key={`alert-${idx}`} type={type} message={msg} showIcon />;
        })}
        <div className='bw_row'>
          <div className='bw_col_3'>
            <ul className='bw_control_form'>
              <li>
                <a
                  data-href='#bw_info_cus'
                  onClick={() => handleScrollToFormItem('bw_info_cus')}
                  className={`${
                    Boolean(
                      watch('shift_name') &&
                        watch('shift_code') &&
                        watch('time_start') &&
                        watch('time_end') &&
                        watch('numberofworkday'),
                    )
                      ? 'bw_active'
                      : ''
                  }`}>
                  <span className='fi fi-rr-check'></span>
                  Thông tin ca làm việc
                </a>
              </li>
              <li>
                <a
                  data-href='#bw_cc'
                  onClick={() => handleScrollToFormItem('bw_cc')}
                  className={`${Boolean(watch('time_checkin') && watch('time_checkout')) ? 'bw_active' : ''}`}>
                  <span className='fi fi-rr-check'></span>
                  Chấm công
                </a>
              </li>
              <li>
                <a
                  data-href='#bw_phanca'
                  onClick={() => handleScrollToFormItem('bw_phanca')}
                  className={`${
                    Boolean(
                      watch('is_apply_monday') ||
                        watch('is_apply_tuesday') ||
                        watch('is_apply_wednesday') ||
                        watch('is_apply_thursday') ||
                        watch('is_apply_friday') ||
                        watch('is_apply_saturday') ||
                        watch('is_apply_sunday'),
                    )
                      ? 'bw_active'
                      : ''
                  }`}>
                  <span className='fi fi-rr-check'></span>
                  Phân ca
                </a>
              </li>
              <li>
                <a
                  data-href='#bw_account_cus'
                  onClick={() => handleScrollToFormItem('bw_account_cus')}
                  className='bw_active'>
                  <span className='fi fi-rr-check'></span>
                  Trạng thái
                </a>
              </li>
            </ul>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <BWAccordion title='Thông tin ca làm việc' id='bw_info_cus' isRequired={true}>
                <div className='bw_row'>
                  <FormItem label='Tên ca làm việc' className='bw_col_6' isRequired={true} disabled={!isEdit}>
                    <FormInput
                      type='text'
                      field='shift_name'
                      placeholder='Tên ca làm việc'
                      validation={msgError['shift_name']}
                    />
                  </FormItem>
                  <FormItem label='Mã ca làm việc' className='bw_col_6' isRequired={true} disabled={!isEdit}>
                    <FormInput
                      type='text'
                      field='shift_code'
                      placeholder='Mã ca làm việc'
                      validation={msgError['shift_code']}
                    />
                  </FormItem>

                  <div className='bw_col_6'>
                    <div className='bw_frm_box'>
                      <label>
                        Giờ làm <span className='bw_red'>*</span>
                      </label>
                      <div className='bw_row'>
                        <FormItem label='' className='bw_col_6' disabled={!isEdit}>
                          <FormDatePicker
                            field='time_start'
                            validation={msgError['time_start']}
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

                        <FormItem label='' className='bw_col_6' disabled={!isEdit}>
                          <FormDatePicker
                            field='time_end'
                            validation={msgError['time_end']}
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
                    </div>
                  </div>
                  <div className='bw_col_6'>
                    <div className='bw_frm_box'>
                      <label>Giờ nghỉ {isBreakShift ? <span className='bw_red'>*</span> : <></>}</label>
                      <div className='bw_row'>
                        <FormItem
                          label=''
                          className='bw_col_6'
                          disabled={!isEdit ? true : !watch('time_start') || !watch('time_end') ? true : false}>
                          <FormDatePicker
                            field='time_break_start'
                            placeholder={'--:--'}
                            style={{
                              width: '100%',
                            }}
                            format='HH:mm'
                            bordered={false}
                            allowClear
                            showNow={false}
                            picker={'time'}
                            validation={{
                              validate: (time) => {
                                // Nếu là ca gãy thì giờ nghỉ là bắt buộc
                                if (!time && isBreakShift) return 'Giờ nghỉ là bắt buộc';
                                if (time) {
                                  // nếu giờ nghỉ bắt đầu và giờ nghỉ kết thúc là 00:00 thì không cần check
                                  if (time === '00:00' && watch('time_break_end') === '00:00') return true;

                                  let houseStart = watch('time_start').split(':');
                                  let houseBreakStart = time.split(':');

                                  let totaltimeStart =
                                    Number.parseInt(houseStart[0]) * 60 + Number.parseInt(houseStart[1]);
                                  let totaltimeBreakStart =
                                    Number.parseInt(houseBreakStart[0]) * 60 + Number.parseInt(houseBreakStart[1]);

                                  let houseEnd = watch('time_end').split(':');
                                  let houseBreakEnd = time.split(':');
                                  let totaltimeEnd = Number.parseInt(houseEnd[0]) * 60 + Number.parseInt(houseEnd[1]);
                                  let totaltimeBreakEnd =
                                    Number.parseInt(houseBreakEnd[0]) * 60 + Number.parseInt(houseBreakEnd[1]);

                                  // if (
                                  //   (time && totaltimeStart > totaltimeBreakStart) ||
                                  //   totaltimeEnd < totaltimeBreakEnd
                                  // ) {
                                  //   return 'Giờ nghỉ bắt đầu phải trong khoảng giờ làm.';
                                  // }
                                  if (
                                    (time && totaltimeStart > totaltimeBreakStart) ||
                                    totaltimeEnd < totaltimeBreakEnd
                                  ) {
                                    return 'Giờ nghỉ bắt đầu phải trong khoảng giờ làm.';
                                  }
                                }
                              },
                            }}
                          />
                        </FormItem>

                        <FormItem
                          label=''
                          className='bw_col_6'
                          disabled={
                            !isEdit
                              ? true
                              : !watch('time_start') || !watch('time_end') || !watch('time_break_start')
                              ? true
                              : false
                          }>
                          <FormDatePicker
                            field='time_break_end'
                            placeholder={'--:--'}
                            style={{
                              width: '100%',
                            }}
                            format='HH:mm'
                            bordered={false}
                            allowClear
                            showNow={false}
                            picker={'time'}
                            validation={{
                              validate: (time) => {
                                if (time) {
                                  // nếu giờ nghỉ bắt đầu và giờ nghỉ kết thúc là 00:00 thì không cần check
                                  if (time === '00:00' && watch('time_break_start') === '00:00') return true;

                                  let houseStart = watch('time_start').split(':');
                                  let houseBreakStart = watch('time_break_start').split(':');

                                  let totaltimeStart =
                                    Number.parseInt(houseStart[0]) * 60 + Number.parseInt(houseStart[1]);
                                  let totaltimeBreakStart =
                                    Number.parseInt(houseBreakStart[0]) * 60 + Number.parseInt(houseBreakStart[1]);

                                  let houseEnd = watch('time_end').split(':');
                                  let houseBreakEnd = time.split(':');
                                  let totaltimeEnd = Number.parseInt(houseEnd[0]) * 60 + Number.parseInt(houseEnd[1]);
                                  let totaltimeBreakEnd =
                                    Number.parseInt(houseBreakEnd[0]) * 60 + Number.parseInt(houseBreakEnd[1]);

                                  // if (totaltimeBreakEnd < totaltimeBreakStart) {
                                  //   return 'Giờ nghỉ kết thúc phải lớn hơn giờ nghỉ bắt đầu.';
                                  // } else if (
                                  //   (time && totaltimeEnd < totaltimeBreakEnd) ||
                                  //   totaltimeStart > totaltimeBreakStart
                                  // ) {
                                  //   return 'Giờ nghỉ kết thúc phải trong khoảng giờ làm.';
                                  // }
                                  if (totaltimeBreakEnd < totaltimeBreakStart) {
                                    return 'Giờ nghỉ kết thúc phải lớn hơn giờ nghỉ bắt đầu.';
                                  } else if (
                                    (time && totaltimeEnd < totaltimeBreakEnd) ||
                                    totaltimeStart > totaltimeBreakStart
                                  ) {
                                    return 'Giờ nghỉ kết thúc phải trong khoảng giờ làm.';
                                  }
                                }
                              },
                            }}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <FormItem label='Thời gian ca (Phút)' className='bw_col_6' isRequired={true} disabled={true}>
                    <FormInput type='number' field='shift_time' placeholder='Thời gian ca' />
                  </FormItem>
                  <FormItem label='Số công' className='bw_col_6' isRequired={true} disabled={!isEdit}>
                    <FormInput
                      type='number'
                      field='numberofworkday'
                      placeholder='Số công'
                      validation={msgError['numberofworkday']}
                    />
                  </FormItem>
                  <div className='bw_col_4'>
                    <div className='bw_frm_box'>
                      <label>
                        Tăng ca <span className='bw_red'>*</span>
                      </label>
                      <FormRadioGroup field='shift_isovertime' list={OVERTIME_TYPE} disabled={!isEdit} />
                    </div>
                  </div>
                  <div className='bw_col_4'>
                    <div className='bw_frm_box'>
                      <label>Ca gãy</label>
                      <FormRadioGroup field='is_break_shift' list={OVERTIME_TYPE} disabled={!isEdit} />
                    </div>
                  </div>
                  <div className='bw_col_4'>
                    <div className='bw_frm_box'>
                      <label>Ca QC</label>
                      <FormRadioGroup field='is_check_store' list={OVERTIME_TYPE} disabled={!isEdit} />
                    </div>
                  </div>
                  
                  {/* Thêm Ca hỗ trợ, Ca thị trường, Ca đào tạo */}
                  <div className='bw_col_4'>
                    <div className='bw_frm_box'>
                      <label> Ca hỗ trợ</label>
                      <FormRadioGroup field='is_support' list={OVERTIME_TYPE} disabled={!isEdit} />
                    </div>
                  </div>
                  <div className='bw_col_4'>
                    <div className='bw_frm_box'>
                      <label>Ca thị trường</label>
                      <FormRadioGroup field='is_market_research' list={OVERTIME_TYPE} disabled={!isEdit} />
                    </div>
                  </div>
                  <div className='bw_col_4'>
                    <div className='bw_frm_box'>
                      <label>Ca đào tạo</label>
                      <FormRadioGroup field='is_training' list={OVERTIME_TYPE} disabled={!isEdit} />
                    </div>
                  </div>

                  {/* <FormItem label='Cửa hàng áp dụng' className='bw_col_12' isRequired={true} disabled={!isEdit}>
                    <FormSelect
                      list={[{ value: ALL_VALUE, label: 'Tất cả' }, ...storeOptions]}
                      bordered
                      disabled={!isEdit}
                      placeholder='--Chọn--'
                      mode='multiple'
                      onChange={(values) => {
                        const field = 'store_apply_list';
                        methods.clearErrors(field);

                        if (values.includes(ALL_VALUE)) {
                          methods.setValue(
                            field,
                            storeOptions.map((_) => ({ id: _.id, value: _.value })),
                          );
                        } else {
                          methods.setValue(
                            field,
                            values.map((_) => ({ id: _, value: _ })),
                          );
                        }
                      }}
                      field={'store_apply_list'}
                      showSearch
                      allowClear
                    />
                  </FormItem> */}
                  <div className='bw_col_12'>
                    <StoresTable />
                  </div>
                  <FormItem label='Mô tả' className='bw_col_12' disabled={!isEdit}>
                    <FormInput type='textarea' field='shift_description' placeholder='Mô tả' />
                  </FormItem>
                </div>
              </BWAccordion>

              {watch('shift_isovertime') ? (
                <ShiftReviewTable title={'Duyệt ca làm việc'} id={'review_shift'} isEdit={isEdit} />
              ) : null}

              <BWAccordion title='Chấm công' id='bw_cc' isRequired={true}>
                <div className='bw_row'>
                  <FormItem label='Giờ vào ca' className='bw_col_3' isRequired={true} disabled={!isEdit}>
                    <FormDatePicker
                      field='time_checkin'
                      placeholder={'--:--'}
                      style={{
                        width: '100%',
                      }}
                      format='HH:mm'
                      bordered={false}
                      allowClear
                      picker={'time'}
                      validation={msgError['time_checkin']}
                    />
                  </FormItem>

                  <FormItem label='Giờ ra ca' className='bw_col_3' isRequired={true} disabled={!isEdit}>
                    <FormDatePicker
                      field='time_checkout'
                      placeholder={'--:--'}
                      style={{
                        width: '100%',
                      }}
                      format='HH:mm'
                      bordered={false}
                      allowClear
                      picker={'time'}
                      validation={msgError['time_checkout']}
                    />
                  </FormItem>
                  <FormItem label='Số phút đi trễ' className='bw_col_3' disabled={!isEdit}>
                    <FormNumber
                      placeholder={'Số phút đi trễ'}
                      field={'shift_minutecheckinlate'}
                      allowClear
                      min={0}
                      max={59}
                    />
                  </FormItem>
                  <FormItem label='Số phút về sớm' className='bw_col_3' disabled={!isEdit}>
                    <FormNumber
                      placeholder={'Số phút về sớm'}
                      field={'shift_minutecheckoutearly'}
                      allowClear
                      min={0}
                      max={59}
                    />
                  </FormItem>
                </div>
              </BWAccordion>
              <BWAccordion title='Phân ca' id='bw_mores' isRequired={true}>
                <div className='bw_frm_box'>
                  <label>
                    Ngày áp dụng <span className='bw_red'>*</span>
                  </label>

                  {errors['date_apply'] ? (
                    <div className='bw_mt_1 bw_mb_1'>
                      <span className='bw_red'>Vui lòng chọn ngày áp dụng.</span>
                    </div>
                  ) : null}

                  <div className='bw_flex bw_align_items_center bw_lb_sex'>
                    <label className='bw_checkbox' style={{ marginBottom: 16 }}>
                      <FormInput type='checkbox' field='is_apply_monday' disabled={!isEdit} />
                      <span></span>
                      Thứ 2
                    </label>
                    <label className='bw_checkbox' style={{ marginBottom: 16 }}>
                      <FormInput type='checkbox' field='is_apply_tuesday' disabled={!isEdit} />
                      <span></span>
                      Thứ 3
                    </label>
                    <label className='bw_checkbox' style={{ marginBottom: 16 }}>
                      <FormInput type='checkbox' field='is_apply_wednesday' disabled={!isEdit} />
                      <span></span>
                      Thứ 4
                    </label>
                    <label className='bw_checkbox' style={{ marginBottom: 16 }}>
                      <FormInput type='checkbox' field='is_apply_thursday' disabled={!isEdit} />
                      <span></span>
                      Thứ 5
                    </label>
                    <label className='bw_checkbox'>
                      <FormInput type='checkbox' field='is_apply_friday' disabled={!isEdit} />
                      <span></span>
                      Thứ 6
                    </label>
                    <label className='bw_checkbox'>
                      <FormInput type='checkbox' field='is_apply_saturday' disabled={!isEdit} />
                      <span></span>
                      Thứ 7
                    </label>
                    <label className='bw_checkbox'>
                      <FormInput type='checkbox' field='is_apply_sunday' disabled={!isEdit} />
                      <span></span>
                      Chủ nhật
                    </label>
                  </div>
                </div>
              </BWAccordion>

              <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
                <div className='bw_row'>
                  <div className='bw_col_12'>
                    <div className='bw_frm_box'>
                      <div className='bw_flex bw_align_items_center bw_lb_sex'>
                        <label className='bw_checkbox'>
                          <FormInput type='checkbox' field='is_active' value={watch('is_active')} disabled={!isEdit} />
                          <span />
                          Kích hoạt
                        </label>
                        <label className='bw_checkbox'>
                          <FormInput type='checkbox' field='is_online' value={watch('is_online')} disabled={!isEdit} />
                          <span />
                          Làm việc online
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </BWAccordion>
            </FormProvider>
          </div>
        </div>
      </div>
      <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
        {!isEdit ? (
          <BWButton
            type='success'
            submit
            icon='fi fi-rr-check'
            content='Chỉnh sửa'
            onClick={() => window._$g.rdr(`/shift/edit/${shiftId}`)}></BWButton>
        ) : (
          <BWButton
            type='success'
            submit
            icon='fi fi-rr-check'
            content={shiftId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới'}
            onClick={handleSubmit(onSubmit)}></BWButton>
        )}

        <BWButton type='' outline content='Đóng' onClick={() => window._$g.rdr('/shift')}></BWButton>
      </div>
    </React.Fragment>
  );
};

export default ShiftAdd;
