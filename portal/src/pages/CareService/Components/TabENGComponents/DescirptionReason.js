import BWAccordion from 'components/shared/BWAccordion/index'
import FormEditor from 'components/shared/BWFormControl/FormEditor'
import React from 'react'

const DescirptionReason = ({ disabled, title, id }) => {
    return (
        <BWAccordion title={title} id={id}>
            <FormEditor
                field='content_en'
                disabled={disabled}
                // validation={{
                //     required: 'Nội dung là bắt buộc'
                // }}
            />
        </BWAccordion>
    )
}

export default DescirptionReason