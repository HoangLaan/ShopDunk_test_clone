import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { mapDataOptions4Select } from 'utils/helpers';
import { getPositionOptions } from 'services/expend-type.service';

import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const ReviewLevelModalAddPositionTable = ({ data, onRemove, remove }) => {
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

          res = [{ id: -1, name: 'Tất cả' }, ...res];
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
                className={'bw_inp bw_mw_2'}
                style={{
                  maxWidth: '100%',
                }}
                type='text'
                disabled={methods.watch(`is_apply_all_department`)}
                field={`position_list.${index}.position_ids`}
                placeholder='Chọn vị trí'
                validation={{
                  required: 'Vị trí là bắt buộc',
                }}
                onChange={(value) => {
                  methods.clearErrors(`position_list.${index}.position_ids`);

                  let position_options = methods.watch(`position_list.${index}.position_options`);

                  if (value?.includes(-1)) {
                    methods.setValue(`position_list.${index}.position_ids`, [{ id: -1, value: -1 }]);

                    position_options = position_options?.map((item) => ({ ...item, disabled: item.id !== -1 }));
                  } else {
                    methods.setValue(
                      `position_list.${index}.position_ids`,
                      value.map((item) => ({ id: item, value: item })),
                    );

                    position_options = position_options?.map((item) => ({ ...item, disabled: false }));
                  }

                  methods.setValue(`position_list.${index}.position_options`, position_options);
                }}
                list={mapDataOptions4Select(methods.watch(`position_list.${index}.position_options`))}
                mode='multiple'
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

  return <DataTable noPaging noSelect columns={columns} data={data} actions={actions} />;
};

export default ReviewLevelModalAddPositionTable;
