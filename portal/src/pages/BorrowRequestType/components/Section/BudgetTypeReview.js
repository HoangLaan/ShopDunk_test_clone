import React from "react"
import {useFormContext} from 'react-hook-form'
import BWAccordion from 'components/shared/BWAccordion/index'
import FormInput from 'components/shared/BWFormControl/FormInput'
import BorrowReviewTable from "./BorrowRequestReviewTable";
const BorrowTypeReview = ({ disabled }) => {

  const methods = useFormContext();
  const {
    watch,
    formState: { errors }
  } = methods

  return (
    <React.Fragment>
      <BWAccordion title='Thông tin mức duyệt' id='bw_confirm' isRequired={true}>
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
          <BorrowReviewTable
            disabled={disabled}
          />
        ) : null}

      </BWAccordion>
    </React.Fragment>
  )
}

export default BorrowTypeReview
