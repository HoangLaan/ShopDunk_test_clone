import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteSkill } from 'services/skill.service';
import { useFormContext } from 'react-hook-form';

const SkillTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  hiddenActionRow,
  onSelect,
  fieldCheck,
  defaultDataSelect,
}) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên kỹ năng',
        formatter: (item) => <b>{item.skill_name}</b>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Trạng thái',
        accessor: 'is_active',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-smartphone',
        color: 'success',
        content: 'Thêm mới',
        hidden: hiddenActionRow,
        onClick: () => window._$g.rdr(`/skill/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        hidden: hiddenActionRow,
        onClick: (p) => window._$g.rdr(`/skill/edit/${p?.skill_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        hidden: hiddenActionRow,
        onClick: (p) => window._$g.rdr(`/skill/view/${p?.skill_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: hiddenActionRow,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteSkill(_?.skill_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <DataTable
      fieldCheck={fieldCheck}
      defaultDataSelect={defaultDataSelect}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      onChangeSelect={onSelect}
      hiddenDeleteClick={hiddenActionRow}
    />
  );
};

export default SkillTable;
