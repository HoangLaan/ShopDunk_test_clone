import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from 'react-hook-form'
import FormInput from 'components/shared/BWFormControl/FormInput'
import FormItem from 'components/shared/BWFormControl/FormItem'
import FormDatePicker from "components/shared/BWFormControl/FormDate"
import FormSelect from "components/shared/BWFormControl/FormSelect"
import { Alert } from 'antd'
import { updateCofirmTimeKeeping, updateTimeKeeping } from '../helpers/call-api'
import { useDispatch, useSelector } from 'react-redux'
import { notification } from 'antd'
import { getTimeKeeping } from "../actions/actions"
import { mapDataOptions4Select, showToast } from "utils/helpers"


const ConfirmTimeKeeping = ({ open, onClose, onConfirm, keepingConfirm = {}, isConfirmMulti = false, shiftOpts: _shiftOpts = [], selected = null }) => {
    const dispatch = useDispatch()
    const { query: params } = useSelector((state) => state.timeKeeping)
    const [msgError, setMsgError] = useState(undefined)
    const [shiftOpts, setShiftOpts] = useState([])
    const [userOpts, setUserOpts] = useState([]);
    const methods = useForm()
    const { reset, setValue, watch } = methods
    const shift_id = methods.watch('shift_id');
    const [isSelectShift, setIsSelecShift] = useState(true);
    const isBreakShift = watch('is_break_shift');
    const setKeepingConfirm = useCallback(() => {
        if (!isConfirmMulti) {
            // Lấy time_start và time_end của ca làm viêc 
            reset({
                ...keepingConfirm,
                time_start: keepingConfirm?.time_start,
                time_end: keepingConfirm?.time_end
            })
        }
    }, [])

    useEffect(() => {
        setKeepingConfirm()
    }, [])

    useEffect(()=>{
        if(shift_id){  
            setIsSelecShift(false)
        }else{
            setIsSelecShift(true)
        }
    },[shift_id])

    const handleSetShiftOption = useCallback(() => {
        let options = [];
        if (_shiftOpts && _shiftOpts.length) {
            // lấy danh sách ca làm việc theo những nhân viên đã chọn
            let userList = Object.values(selected);

            let _objShift = {};

            for (let index = 0; index < userList.length; index++) {
                const element = userList[index];

                for (let key in element.listSchedule) {
                    let key_values = element.listSchedule[key]
                    let k = 0
                    while (k < key_values.length) {
                        const item = key_values[k]
                        if (!_objShift[item.shift_id]) {

                            _objShift[item.shift_id] = item.shift_id
                        }
                        k++;
                    }

                }

            }
            let _shiftOption = Object.values(_objShift);

            options = _shiftOpts.filter(x => {
                return (_shiftOption || []).find((y) => x.value == y) && {
                    ...x,
                }
            });
        }

        setShiftOpts(options)
    }, [])

    useEffect(() => {
        handleSetShiftOption()
    }, [])
    
    useEffect(()=>{
        if(selected){
            const user_list = Object.values(selected);
            const selected_user = user_list.map(i=>i?.user_name)
            setUserOpts(user_list);
            setValue('user_list',selected_user)
        }
    },[selected])
    // sự kiện onchange ca là việc khi là duyệt nhiều ca làm việc
    const handleChangeShift = (value) => {

        methods.setValue('shift_id', value)

        // Lấy các thông tin của ca làm việc đã chọn và lưu dữ liệu
        const detailShift = shiftOpts.find((_shift) => _shift?.value == value)

        if (detailShift) {
            methods.setValue('time_start', detailShift?.time_start)
            methods.setValue('time_end', detailShift?.time_end)
        }

    }


    // handle update trạng thái ca làm việc
    const onSubmit = async (values) => {
        try {

            if (isConfirmMulti) {
                const res =  await updateCofirmTimeKeeping({ ...values, user_confirm: selected });
                if(res?.total_time_late >=2 ){
                    showToast.warning(res?.message)
                }
            } else {
                const res = await updateTimeKeeping(values)
                if(res?.total_time_late >=2 ){
                    showToast.warning(res?.message)
                }
            }
            notification.success({
                message: 'Xác nhận công thành công'
            })
            dispatch(getTimeKeeping(params))
            onClose()

        } catch (error) {
            notification.error({
                message: 'Đã xảy ra lỗi vui lòng thử lại'
            })
        }

    }
    return (
        <React.Fragment>

            <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`}>
                <div className="bw_modal_container bw_w700">
                    <div className="bw_title_modal">
                        <h3>Xác nhận công</h3>
                        <span onClick={onClose} className="bw_close_modal fi fi-rr-cross-small"></span>
                    </div>
                    {msgError ? <Alert type={'error'} message={msgError} showIcon /> : null}
                    <div className="bw_main_modal bw_border_top">
                        <FormProvider {...methods} >
                            <div className="bw_row">
                                {isConfirmMulti ? (
                                    <>
                                    <FormItem label='Nhân viên' className='bw_col_6' isRequired={true} disabled={true}>
                                        <FormSelect 
                                            field='user_list'
                                            id='user_list'
                                            mode={'multiple'}
                                            list={mapDataOptions4Select(userOpts,'user_name','user_fullname')}
                                            allowClear={true}
                                            onChange={(value) => handleChangeShift(value)}
                                        />
                                    </FormItem>
                                    <FormItem label='Ca làm việc' className='bw_col_6' isRequired={true}>
                                        <FormSelect field='shift_id'
                                            id='shift_id'
                                            list={shiftOpts}
                                            allowClear={true}
                                            onChange={(value) => handleChangeShift(value)}
                                        />
                                    </FormItem></>

                                ) : (
                                    <>
                                        <FormItem label='Nhân viên' className='bw_col_6 ' isRequired={true} disabled={true}>
                                            <FormInput type="text" field='user_fullname'
                                                placeholder="Nhân viên"


                                            />
                                        </FormItem>
                                        <FormItem label='Ca làm việc' className='bw_col_6' isRequired={true} disabled={true}>
                                            <FormInput type="text" field='shift_name'
                                                placeholder="Ca làm việc"

                                            />
                                        </FormItem>
                                    </>
                                )}

                                {!isBreakShift ? 
                                <>
                                <div className="bw_col_12">
                                    <div className="bw_frm_box bw_readonly">
                                        <label>Thời gian ra vào ca <span className="bw_red">*</span></label>
                                        <div className="bw_row">
                                            <FormItem label='' className='bw_col_6' disabled={isSelectShift}>
                                                <FormDatePicker
                                                    field='time_start'
                                                    placeholder={'Start time'}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    format='HH:mm'
                                                    bordered={false}
                                                    allowClear
                                                    picker={'time'}
                                                    showNow={false}
                                                    validation={{
                                                        required: 'Vui lòng chọn giờ bắt đầu.'
                                                    }}
                                                />
                                            </FormItem>
                                            <FormItem label='' className='bw_col_6' disabled={isSelectShift}>
                                                <FormDatePicker
                                                    field='time_end'
                                                    placeholder={'End time'}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    format='HH:mm'
                                                    bordered={false}
                                                    allowClear
                                                    picker={'time'}
                                                    showNow={false}
                                                    validation={{
                                                        required: 'Vui lòng chọn giờ kết thúc.'
                                                    }}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                </>
                                :
                                <>
                                <div className="bw_col_12">
                                    <div className="bw_frm_box bw_readonly">
                                        <label>Thời gian ra vào ca <span className="bw_red">*</span></label>
                                        {/* Ca 1 */}
                                        <div className="bw_row">
                                            <FormItem label='' className='bw_col_6' disabled={isSelectShift}>
                                                <FormDatePicker
                                                    field='time_start'
                                                    placeholder={'Start time'}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    format='HH:mm'
                                                    bordered={false}
                                                    allowClear
                                                    picker={'time'}
                                                    showNow={false}
                                                    validation={{
                                                        required: 'Vui lòng chọn giờ bắt đầu.'
                                                    }}
                                                />
                                            </FormItem>
                                            <FormItem label='' className='bw_col_6' disabled={isSelectShift}>
                                                <FormDatePicker
                                                    field='checkin_break_time'
                                                    placeholder={'End time'}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    format='HH:mm'
                                                    bordered={false}
                                                    allowClear
                                                    picker={'time'}
                                                    showNow={false}
                                                    validation={{
                                                        required: 'Vui lòng chọn giờ kết thúc.'
                                                    }}
                                                />
                                            </FormItem>
                                        </div>
                                        {/* Ca 2 */}
                                        <div className="bw_row">
                                            <FormItem label='' className='bw_col_6' disabled={isSelectShift}>
                                                <FormDatePicker
                                                    field='checkout_break_time'
                                                    placeholder={'Start time'}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    format='HH:mm'
                                                    bordered={false}
                                                    allowClear
                                                    picker={'time'}
                                                    showNow={false}
                                                    validation={{
                                                        required: 'Vui lòng chọn giờ bắt đầu.'
                                                    }}
                                                />
                                            </FormItem>
                                            <FormItem label='' className='bw_col_6' disabled={isSelectShift}>
                                                <FormDatePicker
                                                    field='time_end'
                                                    placeholder={'End time'}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    format='HH:mm'
                                                    bordered={false}
                                                    allowClear
                                                    picker={'time'}
                                                    showNow={false}
                                                    validation={{
                                                        required: 'Vui lòng chọn giờ kết thúc.'
                                                    }}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>
                                </>
                                }
                                
                            </div>
                        </FormProvider>
                    </div>
                    <div className="bw_footer_modal bw_justify_content_center">
                        <button type="button" onClick={methods.handleSubmit(onSubmit)} className="bw_btn bw_btn_success" >
                            <span className="fi fi-rr-check"></span>
                            Xác nhận công
                        </button>
                        <button type="button" onClick={onClose} className="bw_btn_outline bw_btn_outline_success bw_close_modal">
                            <span className="fi fi-rr-refresh"></span>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>

        </React.Fragment>

    )
}
export default ConfirmTimeKeeping