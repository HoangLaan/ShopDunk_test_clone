import React, { useCallback, useMemo } from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext, useFieldArray } from 'react-hook-form';
import BWAccordion from 'components/shared/BWAccordion/index';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
// import DataTable from 'components/shared/DataTable';
import FormInput from 'components/shared/BWFormControl/FormInput';
import TrTable from 'components/shared/DataTable/element/TrTable';
import { formatter } from 'utils';

const ReviewList = ({ disabled, title }) => {
  const { control, watch } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: 'list_review',
  });

  

  
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: ' bw_name_sticky',
        classNameBody: ' bw_name_sticky',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Tên mức duyệt',
        accessor: 'review_level_name',
        classNameHeader: ' bw_name_sticky',
        classNameBody: ' bw_name_sticky',
      },
      {
        header: 'Tự động duyệt',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => (
          <label className='bw_checkbox'>
            <FormInput disabled type='checkbox' field={`list_review.[${index}].is_auto_review`} />
            <span />
          </label>
        ),
      },
      {
        header: 'Người duyệt',
        accessor: '',
        formatter: (item, index) =>
          item.is_auto_reivew ? (
            'Tự động duyệt'
          ) : (
            <FormSelect
              field={`list_review.[${index}].review_user`}
              validation={{
                required: 'Chọn người duyệt là bắt buộc',
              }}
              disabled={disabled}
              list={mapDataOptions4SelectCustom(item?.list_user, 'user_name', 'full_name')}></FormSelect>
          ),
      },
      {
        header: 'Mức duyệt cuối',
        classNameBody: ' bw_text_center',
        formatter: (item, index) => (
          <label className='bw_checkbox'>
            <FormInput disabled type='checkbox' field={`list_review.[${index}].is_complete_review`} />
            <span />
          </label>
        ),
      },
    ],
    [],
  );
  const renderData = useCallback(
    (valueRender, keyRender) => {
      return (
        <TrTable
          keyRender={keyRender}
          noSelect
          columns={columns}
          valueRender={valueRender}
        />
      );
    },
    [columns],
  );

  return (
    <BWAccordion title={title}>
      {/* <DataTable columns={columns} data={fields} noSelect noPaging /> */}
      <div className='bw_table_responsive'>
        <table className='bw_table'>
          <thead>
            <tr>
              {columns
                ?.filter((value) => !value.hidden)
                .map((p, o) => (
                  <th key={o} className={p?.classNameHeader ? p?.classNameHeader : ''}>
                    {p?.header}
                  </th>
                ))}
            </tr>
          </thead>

          {fields?.length > 0 ? (
            <tbody>{fields?.map((value, key) => renderData(value, key))}</tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={5} className='bw_text_center'>
                 {watch('transfer_shift_type_id') ? 'Phiếu chuyển ca không áp dụng mức duyệt' : 'Không có dữ liệu'} 
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </BWAccordion>
  );
};

export default ReviewList;
