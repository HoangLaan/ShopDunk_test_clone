import React from 'react'
import BWAccordion from 'components/shared/BWAccordion/index'
import { useFormContext } from 'react-hook-form';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { getBase64 } from 'utils/helpers';

const InfoImage = ({ title, id, disabled }) => {
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
            setError('image_url_en', { type: 'custom', message: "Dung lượng ảnh vượt quá 500kb." });
            return;
        }
        const getFile = await getBase64(avatar);
        methods.clearErrors('image_url_en');
        setValue('image_url_en', getFile);
    };
    return (
        <BWAccordion title={title} id={id} >
            <div className='bw_row'>
                <div class="bw_col_12">
                    <div class="bw_load_image bw_mb_2 bw_text_center">
                        <label class="bw_choose_image">

                            <input
                                type='file'
                                field='image_url_en'
                                name="image_url_en"
                                accept="image/*"
                                onChange={(_) => handleFileUpload(_, 'image_url_en')}
                                disabled={disabled}
                            />
                            {watch('image_url_en')?.length ? (
                                <img style={{ width: '100%' }} src={watch('image_url_en') ?? ''}></img>
                            ) : (
                                <span className='fi fi-rr-picture' />
                            )}
                        </label>
                        {methods.formState.errors['image_url_en'] && <ErrorMessage message={methods.formState.errors['image_url_en']?.message} />}
                        <p>Kích thước ảnh: 500px*500px.</p>
                        <p>Dung lượng tối đa: 500kb</p>
                    </div>
                </div>
            </div>
        </BWAccordion>
    )
}

export default InfoImage