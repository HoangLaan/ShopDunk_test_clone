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
            setError('image_url', { type: 'custom', message: "Dung lượng ảnh vượt quá 500kb." });
            return;
        }
        const getFile = await getBase64(avatar);
        methods.clearErrors('image_url');
        setValue('image_url', getFile);
    };
    return (
        <BWAccordion title={title} id={id} >
            <div className='bw_row'>
                <div class="bw_col_12">
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
                        
                        <p>Dung lượng tối đa: 500kb</p>
                    </div>
                </div>
            </div>
        </BWAccordion>
    )
}

export default InfoImage