import BWAccordion from 'components/shared/BWAccordion/index'
import FormEditor from 'components/shared/BWFormControl/FormEditor'
import React from 'react'

const NewsContent = ({ disabled, title, id }) => {
    return (
        <BWAccordion title={title} id={id}>
            <FormEditor
                field='description_en'
                disabled={disabled}
            />
        </BWAccordion>
    )
}

export default NewsContent