import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getPositionOptions } from 'services/expend-type.service';
import { ALL_POSITION_VALUE } from 'pages/ExpendType/utils/constants';

const ReviewLevelModalAddPositionTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRemove,
  remove,
}) => {
  const methods = useFormContext();

  const position_list = useMemo(() => methods.watch('position_list'), [methods]);

  const getPositionList = useCallback(() => {
    position_list?.forEach((element, index) => {
      const row = methods.watch(`position_list.${index}`);
      if (!row?.department_id) {
        remove(index);
      } else if (!row?.is_loaded_position_options) {
        getPositionOptions({ department_id: element.department_id }).then((res) => {
          methods.setValue(`position_list.${index}.is_loaded_position_options`, true);

          res = [{ id: ALL_POSITION_VALUE, name: 'Tất cả' }, ...res];
          methods.setValue(`position_list.${index}.position_options`, res);
        });
      }
    });
  }, [position_list, methods, remove]);
  useEffect(getPositionList, [getPositionList]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên phòng ban',
        classNameHeader: 'bw_text_center',
        accessor: 'department_name',
      },
      {
        header: 'Vị trí',
        classNameHeader: 'bw_text_center',
        formatter: (_, index) => {
          return (
            <React.Fragment>
              <FormSelect
                mode={'multiple'}
                allowClear={true}
                style={{
                  maxWidth: '100%',
                  minWidth: '160px',
                }}
                bordered={true}
                type='text'
                disabled={methods.watch(`position_list.${index}.is_applly_all_position`)}
                field={`position_list.${index}.position_id`}
                placeholder='Chọn vị trí'
                validation={{
                  required: 'Vị trí là bắt buộc',
                }}
                list={methods.watch(`position_list.${index}.position_options`)?.map((p) => {
                  return {
                    label: p?.name,
                    value: p?.id,
                  };
                })}
                onChange={(value) => {
                  const field = `position_list.${index}.position_id`;
                  const selectedItem = value[value.length - 1];
                  methods.clearErrors(field);

                  if (selectedItem === ALL_POSITION_VALUE) {
                    methods.setValue(field, [{ id: ALL_POSITION_VALUE, value: ALL_POSITION_VALUE }]);
                  } else {
                    methods.setValue(
                      field,
                      value.filter((item) => item !== ALL_POSITION_VALUE)?.map((item) => ({ id: item, value: item })),
                    );
                  }
                }}
                defaultValue={0}
              />
            </React.Fragment>
          );
        },
      },
    ],
    [methods],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (_, d) => {
          onRemove(methods.watch(`position_list.${d}.department_id`));
          remove(d);
        },
      },
    ];
  }, [methods, remove, onRemove]);

  return (
    <DataTable
      noPaging
      noSelect
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
    />
  );
};

export default ReviewLevelModalAddPositionTable;
