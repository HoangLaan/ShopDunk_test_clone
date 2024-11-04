import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePicker, Dropdown, notification } from 'antd';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { getBusinessOpts, getDepartmentOpts, getShiftOpts, getStoreOpts } from '../helpers/call-api';
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import CheckAccess from 'navigation/CheckAccess';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmTimeKeeping from './ConfirmTimeKeeping';
import { getTimeKeeping } from '../actions/actions';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { getOptionsGlobal } from 'actions/global';
import FormInput from 'components/shared/BWFormControl/FormInput';

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

const TimekeepingFilter = ({
  handleExportXcel,
  handleConfirmSchedule,
  setDateType,
  selected,
  users,
  isLockConfirm,
}) => {
  const dispatch = useDispatch();

  const { query: params } = useSelector((state) => state.timeKeeping);

  const methods = useForm({ defaultValues: { type_date: 'isoweek', curent_date: dayjs() } });

  const {
    register,
    watch,
    formState: { errors },
  } = methods;

  const [departmentOpts, setDepartmentOpts] = useState([]);
  const [businessOpts, setBusinessOpts] = useState([]);
  const [storeOpts, setStoreOpts] = useState([]);
  const [shiftOpts, setShiftOpts] = useState([]);
  const [momentOpts] = useState([
    { value: 'isoweek', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
  ]);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const items = [
    {
      key: '1',
      label: 'Dạng danh sách',
      onClick: () => {
        handleExportXcel(1);
      },
    },
    // {
    //   key: '2',
    //   label: 'Dạng danh bảng',
    //   onClick: () => {
    //     handleExportXcel(2);
    //   },
    // },
  ];
  const initDataSearch = async () => {
    // lấy danh sách option cho phòng ban
    const _departmentOpts = await getDepartmentOpts();
    setDepartmentOpts(mapDataOptions4Select(_departmentOpts));

    // lấy danh sách miền làm việc
    const _businessOpts = await getBusinessOpts();
    setBusinessOpts(mapDataOptions4Select(_businessOpts));

    // lấy danh sách cửa hàng làm việc
    const _storeOpts = await getStoreOpts();
    setStoreOpts(mapDataOptions4Select(_storeOpts));

    // Lấy danh sách ca làm việc
    const _shiftOpts = await getShiftOpts();
    setShiftOpts(mapDataOptions4SelectCustom(_shiftOpts[0], 'shift_id', 'shift_name'));
  };

  const handleOpenModal = () => {
    // users
    if (!users.length) {
      notification.error({
        message: 'Vui lòng chọn nhân viên',
      });
    } else {
      setIsOpenModel(true);
    }
  };

  const handleFilterTimekeeping = useCallback((isClear) => {
    let value = methods.getValues();

    if (isClear) {
      value = {
        ...value,
        type_date: 'isoweek',
        curent_date: dayjs(),
        business_id: undefined,
        store_id: undefined,
        shift_id: undefined,
      };
    }

    if (value.curent_date) {
      value.date_from = dayjs(value.curent_date).startOf(value.type_date).format('DD/MM/YYYY');
      value.date_to = dayjs(value.curent_date).endOf(value.type_date).format('DD/MM/YYYY');
    }

    methods.reset(value);

    dispatch(
      getTimeKeeping({
        ...params,
        ...value,
      }),
    );
  }, []);

  useEffect(() => {
    initDataSearch();
    handleFilterTimekeeping();
  }, []);

  useEffect(() => {
    setDateType(watch('type_date'));
  }, [watch('type_date')]);

  return (
    <FormProvider {...methods}>
      {/* ChungLD: Bổ sung class bw_mb_2 */}
      <div className='bw_row bw_mb_2'>
        <div className='bw_col_4'>
        </div>
        <div className='bw_col_8 bw_flex bw_align_items_center bw_justify_content_right bw_btn_group'>
          <CheckAccess permission={'HR_USER_TIMEKEEPING_EXPORT'}>
            {
              (
                <button onClick={() => handleExportXcel(2, false, false, true)} className='bw_btn_outline bw_btn_outline_success'>
                  <span className='fi fi-rr-inbox-out'></span> Xuất Công All
                </button>
              )
            }
          </CheckAccess>
          <CheckAccess permission={'HR_USER_TIMEKEEPING_EXPORT'}>
            {
              (
                <button onClick={() => handleExportXcel(2, false, true, false)} className='bw_btn_outline bw_btn_outline_success'>
                  <span className='fi fi-rr-inbox-out'></span> Xuất Công Danh Sách Lọc
                </button>
              )
            }
          </CheckAccess>
          <CheckAccess permission={'HR_USER_TIMEKEEPING_EXPORT'}>
            <button
              type='button'
              style={{
                backgroundColor: '#aa9cc5',
                color: 'white',
                borderColor: '#aa9cc5'
              }}
              className='bw_btn_outline bw_btn_outline_success'
              onClick={() => handleExportXcel(2, true)}>
              <span className='fa fi-rr-inbox-out'></span> Xuất Tất Cả
            </button>
          </CheckAccess>
          <CheckAccess permission={'HR_USER_TIMEKEEPING_EXPORT'}>
            {
              // users?.length <= 1 ? 
              (
                <button
                  style={{
                    backgroundColor: '#aa9cc5',
                    color: 'white',
                    borderColor: '#aa9cc5'
                  }}
                  onClick={() => handleExportXcel(2)} className='bw_btn_outline bw_btn_outline_success'>
                  <span className='fi fi-rr-inbox-out'></span> Xuất Danh Sách Lọc
                </button>
              )
              // : (
              //   <Dropdown menu={{ items }} placement='top' arrow={{ pointAtCenter: true }}>
              //     <button type='button' className='bw_btn_outline bw_btn_outline_success' onClick={() => {}}>
              //       <span className='fa fi-rr-inbox-out'></span> Xuất excel
              //     </button>
              //   </Dropdown>
              // )
            }
          </CheckAccess>
          {!isLockConfirm ? (
            <CheckAccess permission={'HR_USER_TIMEKEEPING_CONFIRM'}>
              <a
                data-href='#bw_add_nv'
                className='bw_btn bw_btn_success bw_open_modal'
                onClick={() => handleOpenModal()}>
                <span className='fi fi-rr-check'></span> Xác Nhận Công
              </a>
            </CheckAccess>
          ) : null}
        </div>
      </div>

      <FilterSearchBar
        expanded={true}
        disable={true}
        title='Tìm kiếm'
        onSubmit={() => handleFilterTimekeeping()}
        onClear={() => handleFilterTimekeeping(true)}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder='Nhập mã nhân viên, tên nhân viên' field='keyword' />,
          },
          {
            title: 'Miền',
            component: <FormSelect field='business_id' id='business_id' list={businessOpts} allowClear={true} />,
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect field='store_id' id='store_id' list={storeOpts} allowClear={true} />,
          },
          {
            title: 'Ca làm việc',
            component: <FormSelect field='shift_id' id='shift_id' list={shiftOpts} allowClear={true} />,
          },
          {
            title: 'Hiển thị theo',
            component: <FormSelect field='type_date' id='type_date' list={momentOpts} />,
          },
          {
            title: 'Hiển thị theo',
            component: (
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date, dateString) => {
                  methods.setValue('curent_date', date);
                }}
                defaultValue={watch('type_date') == 'month' ? dayjs() : dayjs().isoWeekday(1)}
                format={(value) =>
                  watch('type_date') == 'month' ? `Tháng ${value.format('MM/YYYY')}` : `Tuần ${value.format('WW/YYYY')}`
                }
                picker={watch('type_date') == 'month' ? 'month' : 'week'}
                bordered={false}
                allowClear={false}
              />
            ),
          },
        ]}
      />

      {isOpenModel ? (
        <ConfirmTimeKeeping
          open={isOpenModel}
          onClose={() => setIsOpenModel(false)}
          selected={selected}
          shiftOpts={shiftOpts}
          onConfirm={(value) => {
            handleConfirmSchedule(value);
            setIsOpenModel(false);
          }}
          isConfirmMulti={true}
        />
      ) : null}
    </FormProvider>
  );
};

export default TimekeepingFilter;
