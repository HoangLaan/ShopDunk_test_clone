import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWAccordion from 'components/shared/BWAccordion/index';
import { Alert } from 'antd';
//components
import FormItem from 'components/shared/BWFormControl/FormItem';

// import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
// import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
// import FormNumber from 'components/shared/BWFormControl/FormNumber';

// Services
import { getListMonth } from '../helpers/call-api';
// import { method } from 'lodash';

const FormMonthlyDateCofirmTimeKeeping = ({ disabled, hiddenActive, hiddenSystem }) => {
    const methods = useFormContext();
    const [loading, setLoading] = useState(false);

    const { time_keeping_confirm_date_id } = useParams();
    const { watch, setValue, clearErrors, getValue , setError , formState: { errors } } = methods;
    // Lấy danh sách tháng đã có ngày chốt công
    const getOptionTimeKeeping = async () => {
        if (!time_keeping_confirm_date_id) {
            setLoading(true);
            try {
                // Những tháng disable 
                let result = await getListMonth();
                methods.reset({
                    ...result,
                    is_active : 1
                });
            } catch (error) {
                // window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vui lòng F5 thử lại'));
            } finally {
                setLoading(false);
            }
        }
    }




    const findValueDefault = (dataOption, keyFind) => {
        let defaultValue = dataOption.find(({ value }) => (1 * value) == keyFind) || "";
        return defaultValue
    }


    const changeCheckMonth = (checked, date) => {
        // formik.setFieldValue(date, checked ? 1 : 0);
        // formik.setFieldValue(date, checked ? 1 : 0);
        // setValue('')

        if (
            watch('is_apply_jan') != 1 ||
            watch('is_apply_Feb') != 1 ||
            watch('is_apply_mar') != 1 ||
            watch('is_apply_apr') != 1 ||
            watch('is_apply_may') != 1 ||
            watch('is_apply_jun') != 1 ||
            watch('is_apply_july') != 1 ||
            watch('is_apply_aug') != 1 ||
            watch('is_apply_sep') != 1 ||
            watch('is_apply_oct') != 1 ||
            watch('is_apply_nov') != 1 ||
            watch('is_apply_dec') != 1
        ) {
            setValue('is_apply_year', 0)
        } else {
            setValue('is_apply_year', 0)
        }
    };

    // Dùng lấy số ngày trong tháng đó thuộc năm này
    const getDateOfMonth = (month) => {
        const date = new Date();
        const currentYear = date.getFullYear()
        return new Date(currentYear, month, 0).getDate();
    }

    // Dùng để lấy danh sách tháng đã được đưa được stick
    const ArrayDateOfMonth = () => {
        let arrayMonth = [];
        if (watch('is_apply_jan') === 1) {
            arrayMonth.push(1)
        }
        if (watch('is_apply_Feb') === 1) {
            arrayMonth.push(2)
        }
        if (watch('is_apply_mar') === 1) {
            arrayMonth.push(3)
        }
        if (watch('is_apply_apr') === 1) {
            arrayMonth.push(4)
        }
        if (watch('is_apply_may') === 1) {
            arrayMonth.push(5)
        }
        if (watch('is_apply_jun') === 1) {
            arrayMonth.push(6)
        }
        if (watch('is_apply_july') === 1) {
            arrayMonth.push(7)
        }
        if (watch('is_apply_aug') === 1) {
            arrayMonth.push(8)
        }
        if (watch('is_apply_sep') === 1) {
            arrayMonth.push(9)
        }
        if (watch('is_apply_oct') === 1) {
            arrayMonth.push(10)
        }
        if (watch('is_apply_nov') === 1) {
            arrayMonth.push(11)
        }
        if (watch('is_apply_dec') === 1) {
            arrayMonth.push(12)
        }
        return arrayMonth;
    }

    // Dùng để lấy từ danh sách các tháng đã check lấy ra số ngày của tháng ít nhất
    const getFinalNumberDate = (array) => {

        let numberdate = getDateOfMonth(array[0]);
        for (let i = 0; i < array.length; i++) {
            let date = getDateOfMonth(array[i])
            if (date <= numberdate) {
                numberdate = date
            }
        }
        return numberdate;
    }

    // Từ số ngày của tháng it nhất đổ dữ liệu vào Select để người dùng chọn
    const getoptionMont = (number) => {
        let option = []
        for (let i = 1; i <= number; i++) {
            option.push({ label: `Ngày ${i}`, value: i })
        }
        setValue('dateOfMonth', option);
    }

    //getOptionTimeKeeping
    useEffect(() => {
        getOptionTimeKeeping();

    }, []);

    useEffect(() => {
        let arrayMonth = ArrayDateOfMonth();
        let numberOption = getFinalNumberDate(arrayMonth);
        getoptionMont(numberOption);
        // formik.setFieldValue('listMonth', arrayMonth);
        setValue('listMonth', arrayMonth)

    }, [
        watch('is_apply_jan'),
        watch('is_apply_Feb'),
        watch('is_apply_mar'),
        watch('is_apply_apr'),
        watch('is_apply_may'),
        watch('is_apply_jun'),
        watch('is_apply_july'),
        watch('is_apply_aug'),
        watch('is_apply_sep'),
        watch('is_apply_oct'),
        watch('is_apply_nov'),
        watch('is_apply_dec'),]
    );


    const textStyles = {
        textDecorationLine : 'line-through',
    }

    const checkDisable = (typeDisable , typeApply ) => {
       return  (!time_keeping_confirm_date_id && watch(`${typeDisable}`) ? true : false
        || (time_keeping_confirm_date_id && watch(`${typeDisable}`) && !watch(`${typeApply}`))) ? textStyles : null
    }

    // Kiểm tra xem ngày bắt đầu và ngày kết thúc có hợp lệ Ngày bắt đầu < Ngày kết thúc
    const checkDate = useCallback(() => {
        let date_from  = watch('date_from');
        let date_to = watch('date_to');
        if(date_from && date_from > date_to && date_to){
            setError('date_from_bigger', { type: 'custom', message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc' });
        }else{
            clearErrors('date_from_bigger');
        }
    }, [watch('date_from'), watch('date_to')])


    useEffect(checkDate , [checkDate]);

    return (
        <BWAccordion title='Các tháng áp dụng'>
                {/* <Tooltip title="prompt text">
                    <span>Vui lòng chọn tháng để chọn được ngày</span>
                </Tooltip> */}
            {
                errors['date_from_bigger'] && <Alert closable className="bw_mb_2" type="error" message={errors['date_from_bigger']?.message} />
            }
            <div className='bw_row'>
                <div className='bw_col_6'>
                    <div className='bw_frm_box'>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_jan', 'is_apply_jan')}>
                                <FormInput  type='checkbox' field='is_apply_jan' 
                                       disabled={
                                        disabled 
                                        || (!time_keeping_confirm_date_id && watch('is_disiable_jan')) ? true : false
                                        || (time_keeping_confirm_date_id && watch('is_disiable_jan') && !watch('is_apply_jan'))
                                    }                     
                                />
                                <span />
                                Tháng 1
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_Feb', 'is_apply_Feb')}>
                                <FormInput type='checkbox' field='is_apply_Feb' 
                                        disabled={
                                        disabled 
                                        || !time_keeping_confirm_date_id && watch('is_disiable_Feb') ? true : false
                                        || (time_keeping_confirm_date_id && watch('is_disiable_Feb') && !watch('is_apply_Feb'))
                                    }  
                                />
                                <span />
                                Tháng 2
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox'  style={checkDisable('is_disiable_mar', 'is_apply_mar')} >
                                <FormInput  type='checkbox' field='is_apply_mar' 
                                    disabled={
                                        disabled 
                                        || !time_keeping_confirm_date_id && watch('is_disiable_mar') ? true : false
                                        || (time_keeping_confirm_date_id && watch('is_disiable_mar') && !watch('is_apply_mar'))
                                    }  
                                />
                                <span />
                                Tháng 3
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_apr', 'is_apply_apr')}>
                                <FormInput  type='checkbox' field='is_apply_apr' 
                                        disabled={
                                            disabled 
                                            || !time_keeping_confirm_date_id && watch('is_disiable_apr') ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_apr') && !watch('is_apply_apr'))
                                        } 
                                />
                                <span />
                                Tháng 4
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox'  style={checkDisable('is_disiable_may', 'is_apply_may')}>
                                <FormInput  type='checkbox' field='is_apply_may' 
                                        disabled={
                                            disabled 
                                            || !time_keeping_confirm_date_id && watch('is_disiable_may') ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_may') && !watch('is_apply_may'))
                                        } 
                                />
                                <span />
                                Tháng 5
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_jun', 'is_apply_jun')}>
                                <FormInput type='checkbox' field='is_apply_jun' 
                                        disabled={
                                            disabled 
                                            || !time_keeping_confirm_date_id && watch('is_disiable_jun') ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_jun') && !watch('is_apply_jun'))
                                        }  
                                />
                                <span />
                                Tháng 6
                            </label>
                        </div>
                    </div>
                </div>
                <div className='bw_col_6'>
                    <div className='bw_frm_box'>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_july', 'is_apply_july')}>
                                <FormInput type='checkbox' field='is_apply_july' 
                                        disabled={
                                            disabled 
                                            || !time_keeping_confirm_date_id && watch('is_disiable_july') ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_july') && !watch('is_apply_july'))
                                        } 
                                />
                                <span />
                                Tháng 7
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_aug', 'is_apply_aug')}>
                                <FormInput  type='checkbox' field='is_apply_aug' 
                                        disabled={
                                            disabled 
                                            || !time_keeping_confirm_date_id && watch('is_disiable_aug') ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_aug') && !watch('is_apply_aug'))
                                        } 
                                />
                                <span />
                                Tháng 8
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_sep', 'is_apply_sep')}>
                                <FormInput  type='checkbox' field='is_apply_sep' 
                                        disabled={
                                            disabled 
                                            || !time_keeping_confirm_date_id && watch('is_disiable_sep') ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_sep') && !watch('is_apply_sep'))
                                        } 
                                />
                                <span />
                                Tháng 9
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_oct', 'is_apply_oct')}>
                                <FormInput  type='checkbox' field='is_apply_oct' 
                                        disabled={
                                            disabled 
                                            || !time_keeping_confirm_date_id && watch('is_disiable_oct') ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_oct') && !watch('is_apply_oct'))
                                        } 
                                />
                                <span />
                                Tháng 10
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_nov', 'is_apply_nov')}>
                                <FormInput  type='checkbox' field='is_apply_nov' 
                                        disabled={
                                            disabled 
                                            || !time_keeping_confirm_date_id && watch('is_disiable_nov') ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_nov') && !watch('is_apply_nov'))
                                        } 
                                />
                                <span />
                                Tháng 11
                            </label>
                        </div>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox' style={checkDisable('is_disiable_dec', 'is_apply_dec')}>
                                <FormInput  type='checkbox' field='is_apply_dec' 
                                        disabled={
                                            disabled 
                                            || (!time_keeping_confirm_date_id && watch('is_disiable_dec')) ? true : false
                                            || (time_keeping_confirm_date_id && watch('is_disiable_dec') && !watch('is_apply_dec'))
                                        }
                                />
                                <span />
                                Tháng 12
                            </label>
                        </div>
                    </div>
                </div>
                <FormItem isRequired label='Ngày bắt đầu' className='bw_col_6' disabled={disabled}>
                    <FormSelect
                        field='date_from'
                        list={watch('dateOfMonth') ?? []}
                        validation={{
                            required: 'Ngày bắt đầu là bắt buộc.',
                        }}
                    />
                </FormItem>

                <FormItem isRequired label='Ngày kết thúc' className='bw_col_6' disabled={disabled}>
                    <FormSelect
                        field='date_to'
                        list={watch('dateOfMonth') ?? []}
                        validation={{
                            required: 'Ngày kết thúc là bắt buộc.',
                        }}
                    />
                </FormItem>
            </div>


        </BWAccordion>
    );
};

export default FormMonthlyDateCofirmTimeKeeping;
