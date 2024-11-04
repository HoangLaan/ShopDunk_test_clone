import React from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

export function DegreeInfo({ disabled, title, id }) {
    return (
        <BWAccordion title={title} id={id} isRequired>
            <div className='bw_row'>
                <div className='bw_col_12'>
                    <FormItem label='Tên bằng cấp' isRequired>
                        <FormInput
                            type='text'
                            field='degree_name'
                            placeholder='Nhập tên bằng cấp'
                            validation={{
                                required: 'Tên bằng cấp là bắt buộc !',
                            }}
                            disabled={disabled}
                        />
                    </FormItem>
                </div>

                <div className='bw_col_12'>
                    <FormItem label='Mô tả'>
                        <FormTextArea
                            field='description'
                            rows={3}
                            disabled={disabled}
                            placeholder='Mô tả'
                        />
                    </FormItem>
                </div>
            </div>
        </BWAccordion>
    )
}

export function DegreeStatus({ disabled, title, id }) {
    return (
        <BWAccordion title={title} id={id} isRequired={false}>
            <div className='bw_row'>
                <div className='bw_col_12'>
                    <div className='bw_frm_box'>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                            <label className='bw_checkbox'>
                                <FormInput
                                    type='checkbox'
                                    field='is_active' disabled={disabled}
                                />
                                <span />
                                Kích hoạt
                            </label>
                            {/* <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_system' disabled={disabled} />
                <span />
                Hệ thống
              </label> */}
                        </div>
                    </div>
                </div>
            </div>
        </BWAccordion>
    )
}
