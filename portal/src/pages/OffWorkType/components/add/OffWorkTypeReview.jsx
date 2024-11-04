import React, { useCallback, useEffect, useState } from "react"
import {  useFormContext } from 'react-hook-form'
import { Alert } from 'antd'


//compnents
import BWAccordion from 'components/shared/BWAccordion/index'
import FormInput from 'components/shared/BWFormControl/FormInput'
import OffWorkTypeReviewTable from "./OffWorkTypeReviewTable"
import { getOffworkRLOptions, getUserReview } from "pages/OffWorkType/helpers/call-api"

const OffWorkTypeReview = ({ disabled }) => {

    const methods = useFormContext();

    const [offworkRLOptions, setOffworkRLOptions] = useState([])
    
    const {
        watch,
        formState: { errors }
    } = methods

    const handlegetOffworkRLOptions = useCallback(async () => {

        if (watch('company_id')) {
            try {
                const _offworkRLOptions = await getOffworkRLOptions({ company_id: watch('company_id') })
                setOffworkRLOptions(_offworkRLOptions)
            } catch (error) {
                console.log(error)
            }
        }

    }, [watch('company_id')])

    useEffect(() => { handlegetOffworkRLOptions() }, [handlegetOffworkRLOptions])

    
    return (
        <React.Fragment>
            <BWAccordion title='Mức duyệt phép' id='bw_confirm' isRequired={true}>
                <div className="bw_row">
                    <div className="bw_col_12">
                        <div className='bw_frm_box'>
                            <label className="bw_checkbox bw_auto_confirm">
                                <FormInput type='checkbox'
                                    field='is_auto_review'
                                    value={watch('is_auto_review')}
                                    disabled={disabled} />
                                <span></span>
                                Tự động duyệt
                            </label>
                        </div>
                    </div>
                </div>
                
                {!watch('is_auto_review') ? (
                    <OffWorkTypeReviewTable
                        offworkRLOptions={offworkRLOptions} disabled={disabled}
                    />
                ) : null}

            </BWAccordion>
        </React.Fragment>
    )
}

export default OffWorkTypeReview