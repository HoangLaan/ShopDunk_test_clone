import { useFormContext } from 'react-hook-form';
import React, { useEffect, useMemo } from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import DataTable from 'components/shared/DataTable';

const DepartmentPriorities = () => {
  const methods = useFormContext();

  useEffect(() => {
    methods.register('priorities');
  }, [methods]);

  const columns = useMemo(
    () => [
      {
        header: '',
        formatter: (_, key) => {
          const data = [...methods.watch('priorities')];
          return (
            <React.Fragment>
              <a
                style={{
                  marginRight: '5px',
                }}
                onClick={() => {
                  const dataNow = { ...data[key] };
                  const dataPre = { ...data[key - 1] };
                  data[key] = dataPre;
                  data[key - 1] = dataNow;
                  methods.setValue('priorities', data);
                }}
                disabled={key === 0}
                className='bw_btn_table bw_blue'>
                <i className='fi fi-rr-angle-small-up'></i>
              </a>
              <a
                onClick={() => {
                  const dataNow = { ...data[key] };
                  const dataNext = { ...data[key + 1] };

                  data[key] = dataNext;
                  data[key + 1] = dataNow;
                  methods.setValue('priorities', data);
                }}
                disabled={key + 1 === data.length}
                className='bw_btn_table bw_red'>
                <i className='fi fi-rr-angle-small-down'></i>
              </a>
            </React.Fragment>
          );
        },
      },
      {
        header: 'Thứ tự',
        formatter: (_, key) => key + 1,
      },
      {
        header: 'Tên phòng ban',
        accessor: 'department_name',
      },
    ],
    [],
  );

  return (
    <BWAccordion title='Thứ tự ưu tiên'>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <DataTable noSelect noPaging columns={columns} data={methods.watch('priorities') ?? []} />
        </div>
      </div>
    </BWAccordion>
  );
};
export default DepartmentPriorities;
