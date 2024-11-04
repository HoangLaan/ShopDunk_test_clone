import React, { useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DatabaseTwoTone } from '@ant-design/icons';

import usePagination from 'hooks/usePagination';
import DataTable from 'components/shared/DataTable/index';
import { PERMISSION } from 'pages/TaskType/utils/constants';
import FormTags from '../Shared/FormTags';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const fieldList = 'condition_list';

function TableCondition() {
  const methods = useFormContext();

  const { remove } = useFieldArray({
    control: methods.control,
    name: fieldList,
  });

  const { rows, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({
    data: methods.watch(fieldList),
    itemsPerPage: 25,
  });
  const conditionDbOptions = useGetOptions(optionType.conditionDb, {
    labelName: 'name',
    valueName: 'name',
    valueAsString: true,
  })

  const columns = useMemo(
    () => [
      {
        header: 'Tên điều kiện',
        formatter: (p, index) => {
          if (!p?.is_database) {
            return p?.condition_name;
          }
          return (
            <div className='bw_flex bw_justify_content_between bw_align_items_center'>
              <div>{p?.condition_name}</div>
              <div><DatabaseTwoTone />{' '}Theo dữ liệu</div>
            </div>
          );
        },
      },
      {
        header: 'Giá trị',
        formatter: (_, index) => {
          const field = `${fieldList}.${index}.condition_value_list`;
          if (_?.is_database) {
            return (
              <FormSelect
                field={field}
                bordered={true}
                mode='multiple'
                list={conditionDbOptions}
                validation={{
                  required: 'Giá trị là bắt buộc',
                }}
                onChange={(value) => {
                  methods.clearErrors(field);
                  methods.setValue(field, value);
                }}
              />
            );
          }
          return <FormTags field={field} />;
        },
      },
    ],
    [conditionDbOptions],
  );

  const actions = [
    {
      icon: 'fi fi-rr-arrow-alt-left',
      type: 'danger',
      permission: PERMISSION.DEL_CONDITION,
      onClick: (p, index) => remove(index),
    },
  ];

  return (
    <DataTable
      noSelect={true}
      columns={columns}
      data={rows}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      loading={false}
    />
  );
}

export default TableCondition;
