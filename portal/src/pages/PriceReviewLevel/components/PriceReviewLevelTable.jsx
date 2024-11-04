import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/PriceReviewLevel/helpers/msgError';
import DataTable from 'components/shared/DataTable/index';
import PriceReviewLevelAddModel from 'pages/PriceReviewLevel/components/PriceReviewLevelAddModel/PriceReviewLevelAddModel';

dayjs.extend(customParseFormat);

const PriceReviewLevelTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, handleDelete }) => {
  const dispatch = useDispatch();
  const [isModelAddPriceReviewLevel, setIsModelAddPriceReviewLevel] = useState(false);
  const [priceReviewLevelId, setPriceReviewLevelId] = useState(undefined);

  const columns = useMemo(
    () => [
      {
        header: 'Tên mức duyệt',
        accessor: 'price_review_level_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.price_review_level_name}</b>,
      },

      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
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
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SL_PRICEREVIEWLEVEL_ADD',
        onClick: (p) => {
          setPriceReviewLevelId(undefined);
          setIsModelAddPriceReviewLevel(true);
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_PRICEREVIEWLEVEL_EDIT',
        onClick: (p) => {
          setPriceReviewLevelId(p?.price_review_level_id);
          setIsModelAddPriceReviewLevel(true);
        },
      },

      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SL_PRICEREVIEWLEVEL_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p?.price_review_level_id);
            }),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

  const handleBulkAction = (items, action) => {
    let _mapOject = items.map((_key) => _key.price_review_level_id).join('|');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(_mapOject),
        ),
      );
    }
  };

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={handleBulkAction}
      />

      {isModelAddPriceReviewLevel ? (
        <PriceReviewLevelAddModel
          open={isModelAddPriceReviewLevel}
          onClose={() => setIsModelAddPriceReviewLevel(false)}
          priceReviewLevelId={priceReviewLevelId}
          onConfirm={() => {
            onChangePage(page);
            setIsModelAddPriceReviewLevel(false);
          }}
        />
      ) : null}
    </React.Fragment>
  );
};

export default PriceReviewLevelTable;
