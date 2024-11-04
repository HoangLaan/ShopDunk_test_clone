import React from 'react'
import BWAccordion from 'components/shared/BWAccordion/index'
import { useFormContext } from 'react-hook-form';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { getBase64 } from 'utils/helpers';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const InfoSeo = ({ title, id, disabled }) => {
    const methods = useFormContext();
    const {
        watch,
        setError,
        setValue,
    } = methods;


    return (
        <BWAccordion title={title} id={id}>
            <div className='bw_row'>
                <div class="bw_col_6">
                    <FormItem label='Tên trang'>
                        <FormInput
                            field='seo_name_en'
                            disabled={disabled}
                            placeholder='Tên trang'
                        />
                    </FormItem>
                    
                  

                    <FormItem label='Tiêu đề meta'>
                        <FormInput
                            field='meta_title_en'
                            disabled={disabled}
                            placeholder='Tiêu đề meta'
                        />
                    </FormItem>
                </div>


                <div class="bw_col_6">
                    <FormItem label='Từ khóa meta'>
                        <FormInput
                            field='meta_keywords_en'
                            disabled={disabled}
                            placeholder='Từ khóa meta'
                        />
                    </FormItem>
                    

                    <FormItem label='Mô tả meta'>
                        <FormInput
                            field='meta_discription_en'
                            disabled={disabled}
                            placeholder='Mô tả meta'
                        />
                    </FormItem>

                </div>


              
            </div>
        </BWAccordion>
    )
}

export default InfoSeo