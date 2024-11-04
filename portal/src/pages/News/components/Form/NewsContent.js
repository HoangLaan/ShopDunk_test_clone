import BWAccordion from 'components/shared/BWAccordion/index'
import FormEditor from 'components/shared/BWFormControl/FormEditor'
import React from 'react'

const NewsContent = ({ disabled, title, id }) => {
    return (
        <BWAccordion title={title} id={id} isRequired>
            <FormEditor
                field='content'
                disabled={disabled}
                validation={{
                    required: 'Nội dung là bắt buộc'
                }}
            />
        </BWAccordion>
    )
}

export default NewsContent