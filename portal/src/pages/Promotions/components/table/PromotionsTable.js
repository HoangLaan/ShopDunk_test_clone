import React, { useState, useMemo } from 'react';
import DataTable from 'components/shared/DataTable';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { reviewOptions } from 'pages/Promotions/utils/helpers';
import { TYPE_REVIEW } from 'pages/Promotions/utils/constants';
import ModalReview from '../modal/ModalReview';
import { showToast } from 'utils/helpers';

import { useAuth } from 'context/AuthProvider';
import { deletePromotion } from 'services/promotions.service';
import { checkEmptyArray, stringToArray } from 'utils';
import ModallShowList from 'pages/Prices/components/table-prices/modal/ModallShowList';

const PromotionsTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  title,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const { user } = useAuth();
  const [showModalReview, setShowModalReview] = useState(false);
  const [itemReviewLevel, setItemReviewLevel] = useState(null);
  const dispatch = useDispatch();

  const renderItemSplit = (datatList = '') => {
    let arrayToList = [];
    if (checkEmptyArray(datatList)) {
      arrayToList = datatList;
    } else {
      datatList = datatList.toString();
      arrayToList = (datatList || '').split('|');
    }
    return (
      <div className='text-left'>
        {arrayToList &&
          arrayToList.map((_name, i) => {
            return (
              <ul key={i}>
                <li>
                  <p>{_name}</p>
                </li>
              </ul>
            );
          })}
      </div>
    );
  };

  const showListBusiness = (value) => {
    setItemList(value);
    setOpenModal(true);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Tên chương trình khuyến mại',
        classNameHeader: 'bw_text_center',
        accessor: 'promotion_name',
        formatter: (p) => <b>{p?.promotion_name}</b>,
      },
      {
        header: 'Ngày áp dụng từ',
        accessor: 'begin_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày áp dụng đến',
        accessor: 'end_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (e) => {
          const value = reviewOptions.find((o) => o?.value === e?.is_review);
          return value?.label;
        },
      },
      {
        header: 'Công ty',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Miền',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
        formatter: (p) => {
          const arrayBusinessName = stringToArray(p?.business_name);
          return arrayBusinessName?.length > 3 ? (
            <span
              className='bw_label_outline bw_label_outline_success text-center'
              onClick={() => {
                showListBusiness(arrayBusinessName ?? []);
              }}>
              {arrayBusinessName?.length} Miền +
            </span>
          ) : (
            <span style={{ textWrap: 'nowrap', maxWidth: '320px' }}>{renderItemSplit(arrayBusinessName)}</span>
          );
        },
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'create_user',
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_text_center',
        accessor: 'user_review_name',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        accessor: 'is_active',
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

  const handleReview = (item) => {
    setItemReviewLevel(item);
    setShowModalReview(true);
  };

  const handleDelete = async (arr) => {
    try {
      await deletePromotion({ list_id: arr });
      showToast.success('Xóa chương trình khuyến mại thành công');
      onRefresh();
    } catch (error) {
      showToast.error(error.message);
    } finally {
    }
  };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.promotion_id);
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
          handleDelete(arrDel);
        }),
      );
    }
  };

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'PROMOTION_ADD',
        onClick: () => window._$g.rdr(`/promotions/add`),
      },
      {
        icon: 'fi fi-rr-check',
        hidden: (_) => {
          const indexUser = _.user_review_name.includes(user.user_name);
          return _.is_review * 1 === TYPE_REVIEW.PENDING && indexUser ? false : true;
        },
        color: 'ogrance',
        permission: 'PROMOTION_REVIEW',
        onClick: (p) => {
          const indexUser = p.user_review_name.includes(user.user_name);
          if (p.is_review * 1 === TYPE_REVIEW.PENDING && indexUser) {
            handleReview(p?.promotion_id);
          }
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'PROMOTION_EDIT',
        hidden: (_) => {
          return _.is_review * 1 === TYPE_REVIEW.PENDING ? false : true;
        },
        onClick: (p) => window._$g.rdr(`/promotions/edit/${p?.promotion_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'PROMOTION_VIEW',
        onClick: (p) => window._$g.rdr(`/promotions/detail/${p?.promotion_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'PROMOTION_EDIT',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([_.promotion_id]),
            ),
          ),
      },
    ],
    [],
  );

  return (
    <>
      <DataTable
        title={title}
        loading={loading}
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
      {showModalReview && (
        <ModalReview
          disabled={true}
          itemReviewLevel={itemReviewLevel}
          setShowModalReview={setShowModalReview}
          onRefresh={onRefresh}
        />
      )}
      <ModallShowList
        open={openModal}
        setOpen={setOpenModal}
        listValue={itemList}
        funcIn={renderItemSplit}
        title='Danh sách Miền'
      />
    </>
  );
};

export default PromotionsTable;
