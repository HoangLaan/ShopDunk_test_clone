import React, { useEffect, useForm, useState, useCallback } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index'
// import { useFormContext } from 'react-hook-form';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { getBase64 } from 'utils/helpers';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { LANGUAGE_OPTIONS } from 'utils/constants';
import { generateStaticCode } from '../../helpers/call-api'
import { useFormContext } from 'react-hook-form';
import { getListOptions } from 'services/group-care-service.service';
import { mapDataOptions4Select } from 'utils/helpers';

const NewsInformation = ({ title, id, disabled }) => {
    const methods = useFormContext();
    const { watch, setValue, clearErrors } = methods;
    const [optionsGroupService, setOptionsGroupService] = useState(null);

    const initGroupService = useCallback(() => {
        if (!watch('static_code')) {
            generateStaticCode()
            .then((data) => {
              methods.reset({
                static_code: data
              });
            })
        }
        //console.log('static_code',static_code)
      }, []);
      useEffect(initGroupService, [initGroupService]);

      const getDataOptions = async () => {
        const keyword = watch('parent_id');
        let listParent = await getListOptions(keyword);
        setOptionsGroupService(mapDataOptions4Select(listParent));
      };

      useEffect(() => {
        getDataOptions();
      }, []);
    

    // const methods = useFormContext();
    // const {
    //     watch,
    //     setError,
    //     setValue,
    // } = methods;

    // const handleFileUpload = async (_) => {
    //     const avatar = _.target.files[0]
    //     const { size } = avatar;
    //     if (size / 1000 > 500) {
    //         setError('image_url', { type: 'custom', message: "Dung lượng ảnh vượt quá 500kb." });
    //         return;
    //     }
    //     const getFile = await getBase64(avatar);
    //     methods.clearErrors('image_url');
    //     setValue('image_url', getFile);
    // };
    return (
        <BWAccordion title={title} id={id} isRequired>
            <div className='bw_row'>
                <div class="bw_col_6">
                    <FormItem label='Mã trang tĩnh' disabled>
                        <FormInput
                            field='static_code'
                            disabled={disabled}
                            placeholder='Mã trang tĩnh'
                        />
                    </FormItem>
                    
                    <div class="bw_row">
                        <div class="bw_col_12">
                            <FormItem label='Tên trang tĩnh' isRequired>
                                <FormInput
                                    type='text'
                                    field='static_name'
                                    placeholder='Nhập tên trang tĩnh'
                                    validation={{
                                        //required: 'Tên trang tĩnh là bắt buộc',
                                        validate: (value) => {
                                            if (!Boolean(value?.trim())) {
                                              return 'Tên trang tĩnh là bắt buộc';
                                            }
                                            return true;
                                          },
                                    }}
                                    disabled={disabled}
                                />
                            </FormItem>
                        </div>
                    </div>

                    <FormItem label='Keyword'>
                        <FormInput
                            field='keyword'
                            disabled={disabled}
                            placeholder='Keyword'
                        />
                    </FormItem>

                    <FormItem label='Link'>
                        <FormInput
                            field='static_link'
                            disabled={disabled}
                            placeholder='Link'
                        />
                    </FormItem>
                </div>


                <div class="bw_col_6">
                    <FormItem label='Ngôn ngữ' disabled> 
                    <FormSelect 
                        field='language_id'
                        disabled={disabled}
                        list={LANGUAGE_OPTIONS} 
                        value={1}
                    />
   
                    </FormItem>
                    

                    <FormItem label='Thứ tự hiển thị' isRequired>
                    <FormInput
                        type='number'
                        field='order_index'
                        placeholder='Thứ tự hiển thị'
                        validation={{
                            required: 'Vui lòng nhập kiểu số',
                            pattern: {
                            value: /^\d+$/,
                            message: 'Vui lòng nhập kiểu số'
                            }
                        }}
                        disabled={disabled}
                        />
                    </FormItem>


                    <FormItem label='Nhóm dịch vụ'>
                        <FormSelect
                        field='group_service_code'
                        value={(optionsGroupService || []).find(item => item.code === methods.watch('group_service_code'))}
                        list={optionsGroupService}                           
                        disabled={disabled}
                        allowClear
                        />
                    </FormItem>




                    

                </div>


                {/* <div class="bw_col_12">
                    <div class="bw_load_image bw_mb_2 bw_text_center">
                        <label class="bw_choose_image">
                            
                            <input
                                type='file'
                                field='image_url'
                                name="image_url"
                                accept="image/*"
                                onChange={(_) => handleFileUpload(_, 'image_url')}
                                disabled={disabled}
                            />
                            {watch('image_url')?.length ? (
                                <img style={{ width: '100%' }} src={watch('image_url') ?? ''}></img>
                            ) : (
                                <span className='fi fi-rr-picture' />
                            )}
                        </label>
                        {methods.formState.errors['image_url'] && <ErrorMessage message={methods.formState.errors['image_url']?.message} />}
                        <p>Kích thước ảnh: 500px*500px.</p>
                        <p>Dung lượng tối đa: 500kb</p>
                    </div>
                </div> */}
            </div>
        </BWAccordion>
    )
}

export default NewsInformation