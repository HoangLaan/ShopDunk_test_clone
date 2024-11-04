import React, { useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';

import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';

const BusinessBankAccountListTable = ({ disabled, loading }) => {
  const methods = useFormContext();
  const { control } = methods;
  const { fields } = useFieldArray({
    control,
    name: 'department_list',
  });

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
        accessor: 'department_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [];
  }, []);

  return (
    <>
      <React.Fragment>
        <BWAccordion title='Danh sách phòng ban thuộc khối'>
          <DataTable
            style={{
              marginTop: '0px',
            }}
            hiddenActionRow
            noPaging
            noSelect
            data={fields}
            columns={columns}
            loading={loading}
            actions={actions}
          />
        </BWAccordion>
      </React.Fragment>
    </>
  );
};

BusinessBankAccountListTable.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default BusinessBankAccountListTable;
