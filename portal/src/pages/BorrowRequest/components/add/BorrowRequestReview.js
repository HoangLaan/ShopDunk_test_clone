import React, { Fragment, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { mapDataOptions4Select } from 'utils/helpers';

import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion';
import { reviewStatus } from 'pages/BorrowRequest/helper/constants';

const BorrowRequestReview = ({ disabled, title }) => {
  const methods = useFormContext();
  const {
    watch,
    // setValue,
    // getValues,
    // formState: { errors },
  } = methods;

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return index + 1;
        },
      },
      {
        header: 'Tên mức duyệt',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: 'borrow_review_level_name',
      },
      {
        header: 'Người duyệt',
        formatter: (_, index) => {
          return _.users.length ? (
            <FormSelect
              disabled={disabled}
              field={`borrow_request_review_list.${index}.user_review`}
              list={mapDataOptions4Select(_.users, 'username', 'full_name')}
              validation={{
                required: 'Vui lòng chọn người duyệt cho mức này',
              }}
            />
          ) : (
            <span>
              Tự động duyệt
            </span>
          );
        },
      },
      {
        header: 'Trạng thái',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',

        formatter: (p) => {
          return +p.is_review === reviewStatus.ACCEPT ? (
            <span className='bw_label_outline bw_label_outline_success text-center mt-10'>Đã duyệt</span>
          ) : +p.is_review === reviewStatus.PENDING ? (
            <span className='bw_label_outline bw_label_outline_warning bw_mw_2 text-center mt-10'>Chưa duyệt</span>
          ) : +p.is_review === reviewStatus.REJECT ? (
            <span className='bw_label_outline bw_label_outline_danger bw_mw_2 text-center mt-10'>Không duyệt</span>
          ) : null;
        },
      },
    ],
    [disabled],
  );

  return (
    <Fragment>
      <BWAccordion title={title} disabled={disabled}>
        <div className='bw_col_12'>
          <DataTable columns={columns} data={watch('borrow_request_review_list')} noPaging={true} noSelect={true} />
        </div>
      </BWAccordion>
    </Fragment>
  );
};
export default BorrowRequestReview;
