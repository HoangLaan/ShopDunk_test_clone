import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormInput from 'components/shared/BWFormControl/FormInput'
import FormItem from 'components/shared/BWFormControl/FormItem'



const ShiftFilterModel = ({ onChange }) => {

    const methods = useForm()

    const onClear = () => {

        methods.reset({
            keyword: '',
            is_active: 1
        })
        onChange(methods.getValues())
    }

    return (
        <FormProvider {...methods} >

            <div className='bw_search_box bw_col_12' >
                <form onSubmit={methods.handleSubmit(onChange)}>
                    <FormItem label='Từ khoá' className='bw_col_6'>
                        <FormInput type="text" field='keyword'
                            placeholder="Tên ca làm việc"

                        />
                    </FormItem>
                    <div className='bw_row bw_align_items_center '>
                        <div className='bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
                            <button style={{ marginRight: '10px' }} type='button' onClick={(e) => methods.handleSubmit(onChange)(e)} className='bw_btn bw_btn_success'>
                                <span className='fi fi-rr-filter'></span> Tìm kiếm
                            </button>
                            <button
                                type='button'
                                onClick={() => {
                                    methods.reset({
                                        is_active: 1,
                                    });
                                    onClear({});
                                }}
                                className='bw_btn_outline'>
                                Làm mới
                            </button>
                        </div>
                    </div>
                </form>
            </div>



        </FormProvider>
    );
};

export default ShiftFilterModel;
