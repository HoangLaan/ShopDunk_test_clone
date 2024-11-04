import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { deleteReviewLevel } from 'services/expend-type.service';
import { ReviewLevelUserSchema } from 'pages/ExpendType/utils/contructors';

function ReviewLevelModalTable({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh, onClose }) {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên mức duyệt',
        accessor: 'review_level_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Công ty',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Phòng ban',
        accessor: 'department_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Vị trí duyệt',
        accessor: 'position_name',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'MD_EXPENDTYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteReviewLevel([_?.review_level_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(dataSelect) => {
        const list = [];
        dataSelect?.map(
          (e, idx) => {
            let is_complete_review  = 0;
            if(dataSelect && dataSelect?.length === idx + 1) {
              is_complete_review = 1;
            }
            list.push(new ReviewLevelUserSchema(e?.review_level_id, e?.review_level_name, idx, is_complete_review))
          }
        );
        methods.setValue('review_level_user_list', list);
      }}
      fieldCheck='review_level_id'
      defaultDataSelect={methods.watch('review_level_user_list')}
      hiddenDeleteClick
    />
  );
}

export default ReviewLevelModalTable;
