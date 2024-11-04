import React from 'react'
import BWAccordion from 'components/shared/BWAccordion/index'
import FormEditor from 'components/shared/BWFormControl/FormEditor'

const DescriptionStocks = ({ disabled }) => {
    return (
        <BWAccordion title='Mô tả' id='bw_des' >
            <FormEditor
                field='description'
                disabled={disabled}
            />
        </BWAccordion>
    )
}

export default DescriptionStocks