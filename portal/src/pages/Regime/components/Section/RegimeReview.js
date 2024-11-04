import React, {Fragment, useMemo} from 'react';

import DataTable from 'components/shared/DataTable/index';
import {useFormContext} from "react-hook-form";
import {mapDataOptions4SelectCustom} from "utils/helpers";
import FormSelect from "components/shared/BWFormControl/FormSelect";
import BWAccordion from "components/shared/BWAccordion";

const RegimeReview = ({disabled, title}) => {
    const methods = useFormContext()
    const {watch,setValue,getValues,formState:{errors}} = methods

    const columns = useMemo(
      () => [
        {
          header: 'STT',
          classNameBody: 'bw_text_center',
          classNameHeader: 'bw_text_center',
          formatter: (_, index) => {
            return index + 1
          }
        },
        {
          header: 'Tên mức duyệt',
          classNameBody: 'bw_text_center',
          classNameHeader: 'bw_text_center',
          accessor: 'regime_review_level_name'
        },
        {
          header: 'Người duyệt',
          formatter: (_, index) => {
            setValue(`regime_review.${index}.regime_review_level_id`,_?.regime_review_level_id)
            return (
              <FormSelect
                disabled={disabled}
                field={`regime_review.${index}.user_review`}
                list={mapDataOptions4SelectCustom(_.users, "username", "full_name")}
                validation={{
                  required: 'Vui lòng chọn người duyệt cho mức này',
                }}
              />
            )

          },
        },
        {
          header: 'Trạng thái',
          classNameBody: 'bw_text_center',
          classNameHeader: 'bw_text_center',

          formatter: (p) => {
            return p.is_review ?
              <span className='bw_label_outline bw_label_outline_danger text-center mt-10'>Đã duyệt</span>
              :
              <span className='bw_label_outline bw_label_outline_success bw_mw_2 text-center mt-10'>Chưa duyệt</span>
          }
        }
      ],
      [],
      )
    ;

    return (
      <Fragment>
        <BWAccordion title={title} disabled={disabled}>
            <div className='bw_col_12'>
              <DataTable
                columns={columns}
                data={watch("regime_review_list")}
                noPaging={true}
                noSelect={true}
              />
          </div>
        </BWAccordion>
      </Fragment>
    );
  }
;

export default RegimeReview;
