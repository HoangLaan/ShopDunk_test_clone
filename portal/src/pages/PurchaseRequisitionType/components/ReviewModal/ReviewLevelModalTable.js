import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';

import { showConfirmModal } from 'actions/global';

import DataTable from 'components/shared/DataTable/index';
import purchaseRequisitionService from 'services/purchase-requisition.service';
import BWAccordion from 'components/shared/BWAccordion';

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
        formatter: (item, index) => {
          if (item?.department_list?.length <= 0) {
            return 'Tất cả phòng ban';
          }

          return item.department_list.map((e) => (
            <>
              {e.department_name}
              {Array(e.position_list?.length).fill(<br />)}
            </>
          ));
        },
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Vị trí duyệt',
        formatter: (item, index) => {
          if (item?.department_list?.length <= 0) {
            return 'Tất cả vị trí';
          }

          return item.department_list.map((e) => {
            if (e?.position_list?.length <= 0 || !e?.position_list?.[0]) {
              return (
                <>
                  Tất cả vị trí
                  <br />
                </>
              );
            }

            return e.position_list.map((p) => (
              <>
                {p.position_name}
                <br />
              </>
            ));
          });
        },
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
                await purchaseRequisitionService.deleteReviewLevel([_?.review_level_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <BWAccordion title='Chọn mức duyệt'>
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
          const list = dataSelect?.map((e, idx) => ({
            review_level_user_id: undefined,
            review_level_name: e?.review_level_name,
            user_review_list: [],
            is_complete: idx === dataSelect.length - 1,
            is_auto_review: false,
            order_index: idx,
            review_level_id: e?.review_level_id,
          }));
          methods.setValue('review_level_user_list', list);
        }}
        fieldCheck='review_level_id'
        defaultDataSelect={methods.watch('review_level_user_list')}
        hiddenDeleteClick
      />
    </BWAccordion>
  );
}

export default ReviewLevelModalTable;
