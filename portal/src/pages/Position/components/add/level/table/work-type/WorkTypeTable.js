import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import WorkTypeFilter from 'pages/Position/components/add/level/table/work-type/WorkTypeFilter';
import DataTable from 'components/shared/DataTable';
import { getListWorkType } from 'services/work-type.service.js';
import { useFormContext } from 'react-hook-form';
import { defaultPaging, defaultParams } from 'utils/helpers';

const WorkTypeTable = ({ onSelect, handleAddWorkType, field }) => {
  const methods = useFormContext();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ ...defaultParams, itemsPerPage: 10 });
  const [dataList, setDataList] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadWorkType = useCallback(() => {
    setLoading(true);
    getListWorkType(params)
      .then((p) => {
        setDataList({
          items: p.list,
          itemsPerPage: params?.itemsPerPage,
          page: params?.page,
          totalItems: p.total,
          totalPages: Math.ceil(p.total / params?.itemsPerPage),
        });
      })
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params, setDataList]);
  useEffect(loadWorkType, [loadWorkType]);

  const columns = useMemo(
    () => [
      {
        header: 'Loại công việc',
        accessor: 'work_type_name',
        formatter: (item) => <b>{item.work_type_name}</b>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới loại công việc',
        permission: 'WORK_TYPE_ADD',
        onClick: () => handleAddWorkType(),
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <div>
        <WorkTypeFilter
          onChange={(e) => {
            setParams((prev) => ({
              ...prev,
              ...e,
            }));
          }}
        />
        <DataTable
          hiddenActionRow
          fieldCheck='work_type_id'
          columns={columns}
          loading={loading}
          data={items}
          actions={actions}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadWorkType}
          onChangeSelect={onSelect}
          defaultDataSelect={Object.values(methods.watch(field) ?? {})}
          hiddenDeleteClick
        />
      </div>
    </React.Fragment>
  );
};

WorkTypeTable.propTypes = {
  onSelect: PropTypes.func,
  handleAddWorkType: PropTypes.func,
  field: PropTypes.string.isRequired,
};

WorkTypeTable.defaultProps = {
  onSelect: () => {},
  handleAddWorkType: () => {},
};

export default WorkTypeTable;
