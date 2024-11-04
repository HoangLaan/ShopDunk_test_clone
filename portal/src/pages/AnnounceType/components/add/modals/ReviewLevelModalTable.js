import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { deleteReviewLevel } from 'services/announce-type.service';
import { ReviewLevelUserSchema } from 'pages/AnnounceType/utils/contructors';

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
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_text_center',
        formatter: (value) =>
          value.description?.length > 50 ? value.description.slice(0, 50) + '...' : value.description,
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
        let oldDataSelect = methods.watch('review_level_user_list');
        if (oldDataSelect?.length > 0) {
          //get element from oldDataSelect in dataSelect
          oldDataSelect = dataSelect.filter(
            (e) => !oldDataSelect.find((x) => x?.review_level_id === e?.review_level_id),
          );

          //merge oldDataSelect and dataSelect by review_level_id
          dataSelect = dataSelect.map((e) => {
            const oldData = oldDataSelect.find((x) => x?.review_level_id === e?.review_level_id);
            return {
              ...e,
              ...oldData,
            };
          });
        }

        const length = dataSelect?.length;

        const list = dataSelect?.map(
          (e, idx) =>
            new ReviewLevelUserSchema(
              e?.review_level_id,
              e?.review_level_name,
              e?.order_index || idx,
              e?.review_level_user_id,
              e?.department_id,
              e?.user_review_list,
              idx === length - 1,
              e?.is_auto_review,
            ),
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
