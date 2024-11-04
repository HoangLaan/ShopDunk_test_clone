import React, { useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import DataTable from 'components/shared/DataTable';

import { useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4Select } from 'utils/helpers';

const ReviewUserList = ({ title, disabled, paymentId }) => {
  const methods = useFormContext();

  const columns = useMemo(() => {
    const columns = [
      {
        header: 'STT',
        formatter: (_, index) => index + 1,
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên mức duyệt',
        classNameHeader: 'bw_text_center',
        accessor: 'review_level_name',
        disabled: disabled,
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_text_center',
        disabled: disabled,
        formatter: (_, index) => (
          <FormSelect
            bordered
            disabled={disabled}
            field={`review_list.${index}.user_review`}
            list={mapDataOptions4Select(_?.users || [])}
          />
        ),
      },
      {
        header: 'Mức duyệt cuối',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        disabled: disabled,
        formatter: (_, index) => (
          <FormInput
            disabled={true}
            type='checkbox'
            field={`review_list.${index}.is_complete_review`}
            onChange={({ target: { checked } }) => {
              methods.setValue('is_complete_review', checked ? 1 : 0);
            }}
          />
        ),
      },
    ];

    if (paymentId) {
      columns.push({
        header: 'Trạng thái duyệt',
        formatter: (item) => (
          <div>
            {item.is_review === 1 ? (
              <span className='bw_label_outline bw_label_outline_success text-center'>{'Đã duyệt'}</span>
            ) : item.is_review === 0 ? (
              <span className='bw_label_outline bw_label_outline_danger text-center'>{'Không duyệt'}</span>
            ) : (
              <span className='bw_label_outline bw_label_outline_primary text-center'>{'Chưa duyệt'}</span>
            )}
          </div>
        ),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      });
    }

    return columns;
  }, [disabled, methods.watch('review_list')]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <DataTable noSelect noPaging columns={columns} data={methods.watch('review_list')} />
      </div>
    </BWAccordion>
  );
};

export default ReviewUserList;
