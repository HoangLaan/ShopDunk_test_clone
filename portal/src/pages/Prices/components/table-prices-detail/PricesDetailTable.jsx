import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import queryString from 'query-string';

// import { showConfirmModal } from 'actions/global';
import { formatPrice } from 'utils/index';
// import { msgError } from 'pages/Prices/helpers/msgError';
import types from 'pages/Prices/actions/type';
import { reviewPrices } from 'pages/Prices/helpers/call-api';
import { checkEmptyArray, stringToArray } from 'utils/index';
import DataTable from 'components/shared/DataTable/index';
import ReviewModel from 'components/shared/BWReviewModel/ReviewModel';
import ModallShowList from '../table-prices/modal/ModallShowList';

import { checkProductType } from '../contain/contain';

dayjs.extend(customParseFormat);

const PricesTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  detailPricesProduct,
  productImeiParam,
}) => {
  const { productId, priceId, areaId } = useParams();
  const { product_type = 1 } = queryString.parse(window.location.search);
  const [isModelReview, setIsModelReview] = useState(false);
  const [pricesIdReview, setPricesIdReview] = useState(undefined);  
  const [openModal, setOpenModal] = useState(false);
  const [itemList, setItemList] = useState([]);

  const dispatch = useDispatch();

  const renderItemSplit = (datatList = '') => {
    let arrayToList = [];
    if(checkEmptyArray(datatList)) {
      arrayToList = datatList;
    } else {
      datatList = datatList.toString();
      arrayToList = (datatList || '').split('|');
    }
    return (
      <div className='text-left'>
        {arrayToList && arrayToList.map((_name, i) => {
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
    setOpenModal(true)
  }

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        disabled: true,
        formatter: (p, idx) => <b>{idx + 1}</b>,
      },
      {
        header: 'Hình thức xuất',
        accessor: 'output_type_name',
      },
      {
        header: 'Giá bán',
        accessor: 'price_vat',
        formatter: (p) => {
          return <span className='bw_label bw_label_success'>{formatPrice(p?.price_vat, true, ',')}</span>;
        },
      },
      {
        header: 'Khu vực',
        accessor: 'area_name',
        formatter: (p) => {
          return renderItemSplit(p?.area_name);
        },
      },
      {
        header: 'chi nhánh',
        accessor: 'business_name',
        formatter: (p) => {
          const arrayBusinessName = stringToArray(p?.business_name);
          return arrayBusinessName?.length > 3 ? <span className="bw_label_outline bw_label_outline_success text-center" onClick={() => {
            showListBusiness(arrayBusinessName ?? [])
          }}>{arrayBusinessName?.length} Chi nhánh +</span> : <span style={{textWrap: 'nowrap', maxWidth: '320px'}}>{renderItemSplit(arrayBusinessName)}</span>
        },
      },
      {
        header: 'Đơn vị tính',
        accessor: 'unit_name',
        classNameHeader: 'bw_text_center bw_w1',
        classNameBody: 'bw_text_center',
      },

      {
        header: 'Thời gian áp dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          return <span>{p?.start_date + ' - ' + p?.end_date}</span>;
        },
      },
      {
        header: 'Trạng thái duyệt',
        accessor: 'is_review',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_review === 1 ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã duyệt</span>
          ) : p?.is_review === 2 ? (
            <span className='bw_label_outline bw_label_outline text-center '>Chưa duyệt</span>
          ) : p?.is_review === 3 ? (
            <span className='bw_label_outline bw_label_outline_warning text-center'>Đang duyệt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không duyệt</span>
          ),
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center bw_w1',
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
        icon: 'fi fi-rr-time-fast',
        type: 'warning',
        content: 'Lịch sử làm giá',
        permission: 'SL_PRICES_VIEW',
        hidden: priceId ? false : true,
        onClick: () => {
          window._$g.rdr(`/prices/history/${productId}/${priceId}?product_type=${product_type}`);
        },
      },

      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm giá',
        permission: ['SL_PRICES_ADD', 'SL_PRICES_EDIT'],
        onClick: () => {
          dispatch({
            type: types.SET_VALUE_PRODUCT_LIST,
            payload: { ['key' + productId]: { ...detailPricesProduct } },
          });
          if (productImeiParam) {
            dispatch({ type: types.SET_VALUE_PRODUCT_TYPE, payload: checkProductType['1'] });
          }
          window._$g.rdr(`/prices-list/add`);
        },
      },
      {
        icon: 'fi fi-rr-check',
        color: 'red',
        hidden: true,
        permission: 'SL_PRICES_REVIEW',
        disabled: (p) => (p?.is_can_review === 1 ? false : true),
        onClick: (p) => {
          if (p?.is_can_review === 1) {
            setIsModelReview(true);
            setPricesIdReview(p?.price_id);
          }
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_PRICES_EDIT',
        hidden: true,
        disabled: (p) => (p?.is_review === 2 ? false : true),
        onClick: (p) => {
          if (p?.is_review === 2) {
            window._$g.rdr(`/prices/edit/${p?.product_type_deff}/${productId}/${p?.price_id}?product_type=${product_type}`);
          }
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SL_PRICES_VIEW',
        onClick: (p) => {
          dispatch({
            type: types.SET_VALUE_PRODUCT_LIST,
            payload: { ['key' + productId]: { ...detailPricesProduct } },
          });
          dispatch({ type: types.SET_VALUE_DETAIL_PRICES, payload: p });

          if (productImeiParam) {
            dispatch({ type: types.SET_VALUE_PRODUCT_TYPE, payload: checkProductType['1'] });
          }
          window._$g.rdr(`/prices/detail/${p?.product_type_deff}/${productId}/${p?.price_id}/${areaId}?product_type=${product_type}`);
        },
      },
      // {
      //   icon: 'fi fi-rr-trash',
      //   color: 'red',
      //   permission: 'SL_PRICES_DEL',
      //   disabled: (p) => (p?.is_review === 2 ? false : true),
      //   onClick: (p) =>
      //     p?.is_review === 2
      //       ? dispatch(
      //           showConfirmModal(msgError['model_error'], async () => {
      //             handleDelete(p?.price_id);
      //           }),
      //         )
      //       : null,
      // },
    ];
  }, [detailPricesProduct, dispatch, handleDelete, priceId, productId, product_type]);

  const handleReviewPrices = async (resReview = null) => {
    if (pricesIdReview) {
      try {
        await reviewPrices(pricesIdReview, resReview);

        onChangePage(page);

        showToast.success(`Cập nhật thành công.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } catch (error) {
        showToast.error(error ? error.message : 'Có lỗi xảy ra!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    }

    setIsModelReview(false);
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
        loading={loading}
        hiddenDeleteClick={true}
        noSelect={true}
      />

      {/* Model duyệt giá sản phẩm */}
      {isModelReview ? (
        <ReviewModel
          open={isModelReview}
          onClose={() => {
            setIsModelReview(false);
          }}
          onConfirm={handleReviewPrices}
          title='Duyệt giá sản phẩm'
        />
      ) : null}
      <ModallShowList 
        open={openModal} 
        setOpen={setOpenModal} 
        listValue={itemList} 
        funcIn={renderItemSplit}
        title="Danh sách Chi nhánh"/>
    </React.Fragment>
  );
};

export default PricesTable;
