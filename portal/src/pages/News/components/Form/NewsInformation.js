import React from 'react'
import BWAccordion from 'components/shared/BWAccordion/index'
import { useFormContext } from 'react-hook-form';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { getBase64 } from 'utils/helpers';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const NewsInformation = ({ title, id, disabled }) => {
    const methods = useFormContext();
    const {
        watch,
        setError,
        setValue,
    } = methods;

    const handleFileUpload = async (_) => {
        const avatar = _.target.files[0]
        const { size } = avatar;
        if (size / 1000 > 500) {
            setError('image_url', { type: 'custom', message: "Dung lượng ảnh vượt quá 500kb." });
            return;
        }
        const getFile = await getBase64(avatar);
        methods.clearErrors('image_url');
        setValue('image_url', getFile);
    };
    return (
        <BWAccordion title={title} id={id} isRequired>
            <div className='bw_row'>
                <div class="bw_col_4">
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
                </div>
                <div class="bw_col_8">
                    <div class="bw_row">
                        <div class="bw_col_12">
                            <FormItem label='Tên bài viết' isRequired>
                                <FormInput
                                    type='text'
                                    field='news_title'
                                    placeholder='Nhập tên bài viết'
                                    validation={{
                                        //required: 'Tên bài viết là bắt buộc',
                                        validate: (value) => {
                                            if (!Boolean(value?.trim())) {
                                              return 'Tên bài viết là bắt buộc';
                                            }
                                            return true;
                                          },
                                    }}
                                    disabled={disabled}
                                />
                            </FormItem>
                        </div>
                    </div>

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

export default NewsInformation