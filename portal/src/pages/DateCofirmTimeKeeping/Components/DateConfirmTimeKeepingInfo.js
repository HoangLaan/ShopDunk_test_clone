import React, { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
//until
import { mapDataOptions4Select } from 'utils/helpers';
import moment from 'moment';

//service
// import { getOptionsSolutionGroup, getOptionsStocksOutType } from 'services/solution.service';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormNumber from 'components/shared/BWFormControl/FormNumber';




export default function DateConfirmTimeKeepingInfor({ disabled }) {
    const methods = useFormContext();
    const { watch, setValue, clearErrors } = methods;

    const isEmptyOrSpaces=(str)=>{
        return str === null || str.match(/^ *$/) !== null;
    }

    return (
        <BWAccordion title='Thông tin ngày khóa xác nhận công' id='bw_info_cus'>
            <div className='bw_row'>
                <FormItem label='Tên ngày khóa xác nhận công' className='bw_col_12' isRequired disabled={disabled}>
                    <FormInput
                        type='text'
                        field='time_keeping_confirm_date_name'
                        placeholder='Nhập tên ngày khóa xác nhận công'
                        maxlength="250"
                        validation={{
                            required: 'Vui lòng không bỏ trống!',
                            validate : () => {
                                const values = watch('time_keeping_confirm_date_name');
                                if(isEmptyOrSpaces(values)){
                                    return 'Vui lòng nhập tên ngày khóa xác nhận công hợp lệ'
                                }
                                if(values && values.length > 250){
                                    return 'Chỉ giới hạn tên 250 kí tự'
                                }
                            }
                        }}
                        disabled={disabled}
                    />
                </FormItem>
                <FormItem label='Mô tả' className='bw_col_12' disabled={disabled}>
                    <FormInput
                        type='text'
                        field='time_keeping_date_description'
                        placeholder='Mô tả về ngày khóa xác nhận công'
                        maxlength="1000"
                        disabled={disabled}
                    />
                </FormItem>
            </div>
        </BWAccordion>
    )

}