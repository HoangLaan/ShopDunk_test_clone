import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import DataTable from 'components/shared/DataTable';

import { showConfirmModal } from 'actions/global';
import { deleteDiscountProgram } from 'services/discount-program.service';
import { ReviewStatus, ReviewStatusOptions } from 'pages/DiscountProgram/ultils/constant';
import { checkEmptyArray, stringToArray } from 'utils';
import ModallShowList from 'pages/Prices/components/table-prices/modal/ModallShowList';

const MAX_COLUMN_IN_PAGE = 25;

const DiscountProgramTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const dispatch = useDispatch();

  const showListBusiness = (value) => {
    setItemList(value);
    setOpenModal(true);
  };

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

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (_, index) => index + 1 + MAX_COLUMN_IN_PAGE * (parseInt(page) - 1),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên chương trình chiết khấu',
        classNameHeader: 'bw_text_center',
        accessor: 'discount_program_name',
      },
      {
        header: 'Miền áp dụng',
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
        header: 'Hãng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'manufacturer_name',
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (e) => {
          const value = ReviewStatusOptions.find((o) => o?.value === (parseInt(e?.is_review) || 0));
          return value?.label;
        },
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'is_active',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [page],
  );

  const handleDelete = useCallback(
    (arr) => {
      deleteDiscountProgram({ list_id: arr }).finally(() => {
        onRefresh();
      });
    },
    [onRefresh],
  );

  const isHiddenEdit = (p) => p.is_review !== ReviewStatus.PENDING;

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'PO_DISCOUNT_PROGRAM_ADD',
        onClick: () => window._$g.rdr(`/discount-program/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'PO_DISCOUNT_PROGRAM_EDIT',
        onClick: (p) => window._$g.rdr(`/discount-program/edit/${p?.discount_program_id}`),
        hidden: isHiddenEdit,
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'PO_DISCOUNT_PROGRAM_VIEW',
        onClick: (p) => window._$g.rdr(`/discount-program/detail/${p?.discount_program_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'PO_DISCOUNT_PROGRAM_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([_.discount_program_id]),
            ),
          ),
        hidden: isHiddenEdit,
      },
    ],
    [dispatch, handleDelete],
  );

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.discount_program_id);
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
          handleDelete(arrDel);
        }),
      );
    }
  };

  return (
    <>
      <DataTable
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
        hiddenRowSelect={isHiddenEdit}
      />
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

export default DiscountProgramTable;
