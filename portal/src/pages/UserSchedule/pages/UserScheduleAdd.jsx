import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, notification } from 'antd';
import { create, update, getBusinessOpts, getStoreOpts, getCompanyOpts, read } from '../helpers/call-api';
import dayjs from 'dayjs';
import { showToast } from 'utils/helpers';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4Select } from 'utils/helpers';
import ShiftTable from '../components/ShiftTable';
import DepartmentTable from '../components/DepartmentTable';
import UsersTable from '../components/UsersTable';
import ShiftModel from '../components/ShiftModel/ShiftModel';
import DepartmentModel from '../components/DepartmentModel/DepartmentModel';
import UserModel from '../components/UserModel/UserModel';
import CalendarPickDate from '../components/CalendarPickDate';
import { msgError } from '../helpers/msgError';
import { getErrorMessage } from 'utils/index';
import { useLocation } from 'react-router-dom';
import UserScheduleReviewTable from '../components/UserScheduleReviewTable';
import { useAuth } from 'context/AuthProvider';
import { getStores } from 'services/business-user.service';
import lodash from 'lodash';

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf('d');
};

const UserScheduleAdd = ({ querySchedule = null, isEdit = true }) => {
  const methods = useForm({
    defaultValues: { is_active: 1, shift: {}, department: {}, is_range_date: 1, is_pick_date: 0, review_list: [] },
  });
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = methods;
  const { pathname } = useLocation();
  const isDetail = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isCreate = useMemo(() => pathname.includes('/add'), [pathname]);
  const [companyOpts, setCompanyOpts] = useState([]);
  const [businessOpts, setBusinessOpts] = useState([]);
  const [storeOpts, setStoreOpts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [isModelShift, setIsModelShift] = useState(false);

  const [isModelDepartment, setIsModelDepartment] = useState(false);
  const [isModelUser, setIsModelUser] = useState(false);

  const [pickDate, setPickDate] = useState({});

  const { user } = useAuth();
  const isStoreManagerUser = user?.functions?.includes('HR_STOREMANAGER_SCHEDULE');
  const isHRUser = user?.functions?.includes('HR_HRDEPARTMENT_SCHEDULE');

  useEffect(() => {
    // Lấy ra tất cả miền, cửa hàng khi user không phải là trưởng cửa hàng hoặc admin
    if (!isStoreManagerUser || user.isAdministrator) {
      setValue('user_id', 0);
    }
  }, [user]);

  // get default user store
  useEffect(() => {
    if (isCreate) {
      getStores().then((stores) => {
        setStoreOpts(mapDataOptions4Select(stores || []));

        if (stores?.length === 1) {
          const store = stores[0];
          methods.setValue('business', [
            {
              id: store.business_id,
              value: store.business_id,
            },
          ]);
          methods.setValue('store', [
            {
              value: store.store_id,
              id: store.store_id,
            },
          ]);
        }
      });
    }
  }, []);

  useEffect(() => {
    register('is_active');
  }, [register]);

  useEffect(() => {
    if (isCreate) {
      isEdit = true;
    }
  }, [isCreate]);

  const getInitData = useCallback(async () => {
    try {
      // lấy danh sách công ty
      const companyOpts = await getCompanyOpts();

      setCompanyOpts(mapDataOptions4Select(companyOpts));
      if (querySchedule) {
        // Lấy chi tiết thông tin của phân ca làm việc
        const {
          user_schedule,
          business = [],
          shift_date = {},
          shift = {},
          review_list = [],
        } = await read(querySchedule);
        setPickDate(shift_date);

        reset({
          ...user_schedule,
          store: [{ value: user_schedule?.store_id, label: user_schedule?.store_name }],
          is_pick_date: 1,
          business: mapDataOptions4Select(business),
          shift: shift,
          pickDate: pickDate,
          review_list,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  }, [querySchedule]);

  useEffect(() => {
    getInitData();
  }, [getInitData]);

  useEffect(() => {
    if (user) {
      setValue('company_id', String(user.company_id));
    }
  }, [user]);

  const handleScrollToFormItem = (id) => {
    const violation = document.getElementById(id);
    window.scrollTo({
      top: violation.offsetTop,
      behavior: 'smooth',
    });
  };

  // load business by store
  useEffect(() => {
    if (isCreate) {
      const businessIds =
        storeOpts
          ?.filter((opt) => watch('store')?.some((store) => store.id == opt.id))
          ?.map((store) => store.business_id)
          ?.filter((_) => _) || [];

      if (businessIds.length > 0) {
        const businessOptions = lodash.uniq(businessIds)?.map((businessId) => ({
          id: businessId,
          value: businessId,
        }));
        methods.setValue('business', businessOptions);
      }
    }
  }, [watch('store'), isCreate, storeOpts]);

  useEffect(() => {
    if (watch('company_id')) {
      getBusinessOpts(watch('company_id'), { user_id: watch('user_id') }).then((res) =>
        setBusinessOpts(mapDataOptions4Select(res)),
      );
    }
  }, [watch('company_id')]);

  const business = useMemo(() => watch('business'), [watch('business')]);

  useEffect(() => {
    if (business && !isCreate) {
      getStoreOpts({ business: business || null, user_id: watch('user_id') }).then((res) =>
        setStoreOpts(mapDataOptions4Select(res)),
      );
    }
  }, [business]);

  const handleSelect = (key, values = {}) => {
    setValue(`${key}`, values);
    setIsModelShift(false);
    setIsModelDepartment(false);
    setIsModelUser(false);
  };
  const handleDeleteModel = (key = '', keyValue = '') => {
    let _ojectValue = watch(`${key}`);

    if (_ojectValue[`${keyValue}`]) {
      delete _ojectValue[`${keyValue}`];
    }

    setValue(`${key}`, _ojectValue);
  };

  useEffect(() => {
    if (watch('is_range_date')) {
      setValue('is_pick_date', 0);
    }
  }, [watch('is_range_date')]);

  useEffect(() => {
    if (watch('is_pick_date')) {
      setValue('is_range_date', 0);
    }
  }, [watch('is_pick_date')]);

  useEffect(() => {
    if (watch('is_select_all')) {
      setValue('department', {});
      setValue('user', {});
    }
  }, [watch('is_select_all')]);

  const [isResetListUser, setIsResetListUser] = useState(false);
  const onSubmit = async (values) => {
    //validate data
    setAlerts([]);

    if (Object.keys(watch('shift') || {}).length <= 0) {
      setAlerts([{ type: 'warning', msg: 'Vui lòng chọn ca làm việc' }]);
      return;
    }

    if ((!watch('date_from') || !watch('date_to')) && Object.keys(pickDate || {}).length <= 0) {
      setAlerts([{ type: 'warning', msg: 'Vui lòng chọn ngày làm việc' }]);
      return;
    }

    if (
      !watch('is_select_all') &&
      Object.keys(watch('department') || {}).length <= 0 &&
      Object.keys(watch('user') || {}).length <= 0 &&
      !isEdit
    ) {
      setAlerts([{ type: 'warning', msg: 'Vui lòng chọn phân ca' }]);
      return;
    }

    if (
      !watch('is_select_all') &&
      Object.keys(watch('user') || {}).length <= 0 && isCreate
    ) {
      setAlerts([{ type: 'warning', msg: 'Vui lòng chọn nhân viên phân ca' }]);
      return;
    }

    let formData = {
      ...values,
      pickDate,
      schedule_id: querySchedule?.schedule_id,
      shift: Object.values(watch('shift') || []),
      department: Object.values(watch('department') || []),
      user: Object.values(watch('user') || []),
    };
    // format data
    try {
      if (querySchedule) {
        await update(formData);
        notification.success({
          message: 'Cập nhật ca làm việc thành công',
        });
      } else {
        await create(formData);
        notification.success({
          message: 'Thêm mới ca làm việc thành công',
        });
        reset({ is_active: 1, is_range_date: 1, company_id: String(user.company_id) });
        setIsResetListUser(true);
        setAlerts([]);
        setPickDate({});
      }
    } catch (error) {
      notification.error({
        message: error?.message || 'Đã xảy ra lỗi vui lòng thử lại',
      });
    }
  };

  function isDisabled(date, time) {
    if (!date || !time) return false;
    let [day, month, year] = date?.split('/');
    let checkDateTime = new Date(`${year}-${month}-${day}T${time}:00`);
    let currentDate = new Date();
    // Kiểm tra điều kiện và trả về true hoặc false
    return currentDate > checkDateTime;
  }

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
                  className={watch('company_id') && watch('business') && watch('store') && 'bw_active'}
                  onClick={() => handleScrollToFormItem('bw_info_cus')}>
                  <span className='fi fi-rr-check'></span>
                  Miền áp dụng
                </a>
              </li>
              <li>
                <a
                  data-href='#bw_cc'
                  onClick={() => handleScrollToFormItem('bw_cc')}
                  className={Object.keys(watch('shift') || {})?.length > 0 && 'bw_active'}>
                  <span className='fi fi-rr-check'></span> Thời gian
                </a>
              </li>

              <li>
                <a
                  data-href='#bw_phanca'
                  className={
                    (watch('is_select_all') ||
                      Object.keys(watch('department') || {})?.length > 0 ||
                      Object.keys(watch('user') || {})?.length > 0) &&
                    'bw_active'
                  }
                  onClick={() => handleScrollToFormItem('bw_phanca')}>
                  <span className='fi fi-rr-check'></span> Phân ca
                </a>
              </li>
            </ul>
          </div>
          <div className='bw_col_9 bw_pb_6'>
            <FormProvider {...methods}>
              <BWAccordion title='Miền áp dụng' id='bw_info_cus' isRequired={true}>
                <div className='bw_row'>
                  {querySchedule ? (
                    <FormItem label='Nhân viên' className='bw_col_6' disabled={true}>
                      <FormInput type='text' field='user_fullname' placeholder='Tên nhân viên' />
                    </FormItem>
                  ) : null}
                  <FormItem
                    label='Công ty'
                    className='bw_col_6'
                    disabled={(querySchedule ? true : !isEdit) || isStoreManagerUser || isHRUser}
                    isRequired={true}>
                    <FormSelect
                      field='company_id'
                      id='company_id'
                      list={companyOpts}
                      validation={msgError['company_id']}
                    />
                  </FormItem>

                  <FormItem
                    label='Miền'
                    disabled={querySchedule ? true : !isEdit}
                    className='bw_col_6'
                    isRequired={true}>
                    <FormSelect
                      field='business'
                      id='business'
                      list={businessOpts}
                      mode='multiple'
                      validation={msgError['business']}
                      onChange={(value) => {
                        methods.clearErrors('business');
                        if (Array.isArray(value)) {
                          methods.setValue(
                            'business',
                            (value || []).map((_) => {
                              return { id: _, value: _ };
                            }),
                          );
                        }

                        if (watch('business')) {
                          getStoreOpts({ business: watch('business') || null, user_id: watch('user_id') }).then((res) =>
                            setStoreOpts(mapDataOptions4Select(res)),
                          );
                        }

                        setValue('store', []);
                      }}
                    />
                  </FormItem>
                  <FormItem
                    label='Cửa hàng'
                    disabled={(querySchedule ? true : !isEdit) || !watch('business')}
                    className='bw_col_6'
                    isRequired={true}>
                    <FormSelect
                      field='store'
                      id='store'
                      list={storeOpts}
                      mode='multiple'
                      validation={msgError['store']}
                    />
                  </FormItem>
                </div>
              </BWAccordion>

              <BWAccordion title='Thời gian' id='bw_cc' isRequired={true}>
                <div className='bw_table_responsive'>
                  <ShiftTable
                    data={Object.values(watch('shift') || {})}
                    handleDelete={handleDeleteModel}
                    disabled={!isEdit}
                  />
                </div>
                {!isDetail && (
                  <a onClick={() => setIsModelShift(true)} className='bw_btn_outline bw_btn_outline_success bw_add_us'>
                    <span className='fi fi-rr-plus'></span>
                    Chọn ca làm việc
                  </a>
                )}
                <div className='bw_row bw_mt_2'>
                  <div className='bw_col_12'>
                    <div className='bw_frm_box'>
                      <div className='bw_flex bw_align_items_center bw_lb_sex'>
                        <label className='bw_checkbox'>
                          <FormInput type='checkbox' field='is_range_date' disabled={!isEdit} />
                          <span />
                          Chọn theo khoảng
                        </label>
                        <label className='bw_checkbox'>
                          <FormInput type='checkbox' field='is_pick_date' disabled={!isEdit} />
                          <span />
                          Chọn theo ngày
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='bw_frm_box bw_mt_2'>
                  <label>
                    Thời gian áp dụng <span className='bw_red'>*</span>
                  </label>
                  {watch('is_range_date') ? (
                    <div className='bw_row'>
                      <FormItem label='' className='bw_col_3'>
                        <FormDatePicker
                          field='date_from'
                          // validation={msgError['time_start']}
                          placeholder={'dd/mm/yyyy'}
                          style={{
                            width: '100%',
                          }}
                          format='DD/MM/YYYY'
                          bordered={false}
                          allowClear
                          disabled={!isEdit}
                          disabledDate={disabledDate}
                        />
                      </FormItem>

                      <FormItem label='' className='bw_col_3'>
                        <FormDatePicker
                          field='date_to'
                          // validation={msgError['time_start']}
                          placeholder={'dd/mm/yyyy'}
                          style={{
                            width: '100%',
                          }}
                          format='DD/MM/YYYY'
                          bordered={false}
                          allowClear
                          disabled={!isEdit}
                          showToday={false}
                          disabledDate={disabledDate}
                        />
                      </FormItem>
                    </div>
                  ) : null}
                  {watch('is_pick_date') ? (
                    <CalendarPickDate pickDate={pickDate} setPickDate={setPickDate} disabled={!isEdit} />
                  ) : null}
                </div>
              </BWAccordion>
              {isEdit && !querySchedule ? (
                <BWAccordion title='Phân ca' id='bw_info_cus' isRequired={true}>
                  <label className='bw_checkbox'>
                    <FormInput type='checkbox' field='is_select_all' disabled={!isEdit} />
                    <span></span>
                    Chọn tất cả
                  </label>

                  <p className='bw_mt_2'>
                    <b>Nhân viên</b>
                  </p>

                  <UsersTable
                    data={Object.values(watch('user') || {})}
                    handleDelete={handleDeleteModel}
                    isResetListUser={isResetListUser}
                  />
                  {!watch('is_select_all') ? (
                    <a
                      data-href=''
                      className='bw_btn_outline bw_btn_outline_success bw_add_us'
                      onClick={() => setIsModelUser(true)}>
                      <span className='fi fi-rr-plus'></span>
                      Chọn nhân viên
                    </a>
                  ) : null}
                  <p className='bw_mt_2'>
                    <b style={{ color: 'red' }}>Lưu ý*: Dùng Cho Phân Ca Theo Phòng Ban</b>
                  </p>
                  <p className='bw_mt_2'>
                    <b>Phòng ban</b>
                  </p>

                  <DepartmentTable data={Object.values(watch('department') || {})} handleDelete={handleDeleteModel} />
                  {!watch('is_select_all') ? (
                    <a
                      data-href=''
                      className='bw_btn_outline bw_btn_outline_success bw_add_us'
                      onClick={() => setIsModelDepartment(true)}>
                      <span className='fi fi-rr-plus'></span>
                      Chọn phòng ban
                    </a>
                  ) : null}
                </BWAccordion>
              ) : null}
              {!isCreate && (
                <BWAccordion title='Mức duyệt' id='bw_info_cus' isRequired={true}>
                  <UserScheduleReviewTable data={watch('review_list')} onRefresh={getInitData} />
                </BWAccordion>
              )}
            </FormProvider>
          </div>
        </div>
      </div>
      <div className='bw_btn_save bw_btn_group bw_flex bw_justify_content_right bw_align_items_center'>
        {isEdit && !isCreate ? (
          <BWButton
            type='success'
            submit
            icon='fi fi-rr-check'
            content='Hoàn tất chỉnh sửa'
            onClick={handleSubmit(onSubmit)}></BWButton>
        ) : (
          (!isDetail && (
            <BWButton
              type='success'
              submit
              icon='fi fi-rr-check'
              content='Hoàn tất thêm mới'
              onClick={handleSubmit(onSubmit)}></BWButton>
          )) ||
          (isDetail && (
            <BWButton
              type='success'
              submit
              disabled={isDisabled(watch('shift_date'), Object.values(watch('shift') || {})[0]?.time_start)}
              icon='fi fi-rr-check'
              content='Chỉnh sửa'
              onClick={() =>
                window._$g.rdr(
                  `/user-schedule/edit/?store_id=${querySchedule.store_id}&shift_id=${querySchedule.shift_id}&user_name=${querySchedule.user_name}&shift_date=${querySchedule.shift_date}&schedule_id=${querySchedule.schedule_id}`,
                )
              }></BWButton>
          ))
        )}

        <BWButton outline content='Đóng' onClick={() => window._$g.rdr('/user-schedule')}></BWButton>
      </div>

      {/**Model View */}
      <ShiftModel
        open={isModelShift}
        onConfirm={handleSelect}
        onClose={() => setIsModelShift(false)}
        header={'Chọn ca làm việc'}
        footer={'Xác nhận'}
        store_ids={watch('store')}
        selected={watch('shift') || {}}
      />

      <DepartmentModel
        open={isModelDepartment}
        onConfirm={handleSelect}
        onClose={() => setIsModelDepartment(false)}
        header={'Chọn ca làm việc'}
        footer={'Xác nhận'}
        selected={watch('department') || {}}
      />

      <UserModel
        open={isModelUser}
        onConfirm={handleSelect}
        onClose={() => setIsModelUser(false)}
        header={'Chọn ca làm việc'}
        footer={'Xác nhận'}
        selected={watch('user') || {}}
        business_ids={watch('business')}
        store_ids={watch('store')}
        shift_ids={watch('shift') || {}}
        isRequired={true}
      />
    </React.Fragment>
  );
};

export default UserScheduleAdd;