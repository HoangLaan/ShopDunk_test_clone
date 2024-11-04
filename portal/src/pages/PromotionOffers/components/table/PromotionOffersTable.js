import React, { useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deletePromotionOffer } from 'services/promotion-offers.service';
import { MAX_ITEM_PER_PAGE, renderItemSplit } from 'utils/helpers';
import { checkEmptyArray, stringToArray } from 'utils';
import ModallShowList from 'pages/Prices/components/table-prices/modal/ModallShowList';

const PromotionOffersTable = ({
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
        header: 'STT',
        formatter: (_, index) => index + 1 + MAX_ITEM_PER_PAGE * (parseInt(page) - 1),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Tên ưu đãi khuyến mại',
        classNameHeader: 'bw_text_center',
        accessor: 'promotion_offer_name',
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

          // return renderItemSplit(p?.business_name, '|');
        },
      },
      {
        header: 'Ưu đãi khuyến mại',
        classNameHeader: 'bw_text_center',
        accessor: 'promotion_offer_name',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'create_date',
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

  const handleDelete = async (arr) => {
    await deletePromotionOffer({ list_id: arr });
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.promotion_offer_id);
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
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SM_PROMOTIONOFFER_ADD',
        onClick: () => window._$g.rdr(`/promotion-offers/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SM_PROMOTIONOFFER_EDIT',
        onClick: (p) => window._$g.rdr(`/promotion-offers/edit/${p?.promotion_offer_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SM_PROMOTIONOFFER_VIEW',
        onClick: (p) => window._$g.rdr(`/promotion-offers/detail/${p?.promotion_offer_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SM_PROMOTIONOFFER_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([_?.promotion_offer_id]),
            ),
          ),
      },
    ],
    [],
  );

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

export default PromotionOffersTable;
