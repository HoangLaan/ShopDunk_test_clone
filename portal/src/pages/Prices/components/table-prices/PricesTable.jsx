import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { showToast } from 'utils/helpers';
import styled from 'styled-components';

import { showConfirmModal } from 'actions/global';
import { formatMoney, checkValueNone, checkEmptyArray, stringToArray } from 'utils/index';
import DataTable from 'components/shared/DataTable/tableChange';
import AdjustmentPricesModel from 'pages/Prices/components/modal-adjustment-prices/AdjustmentPricesModal';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWButton from 'components/shared/BWButton/index';
import ModalReview from '../add/ModalReview/ModalReview';
import ModallShowList from './modal/ModallShowList';

import {
  selectProductTypeList,
  checkProductType,
  defineProductTypeList,
  objectParse,
  defendPriceDateUsing,
} from '../contain/contain';

import CheckAccess from 'navigation/CheckAccess';
import './style.custom.scss';

dayjs.extend(customParseFormat);

const FlexRowCustom = styled.div`
  margin-left: -5px;
  margin-right: -5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: end;
`;

const PricesTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  onChangeListPage,
  productTypeParam,
  setProductTypeId,
  onRefresh,
  setParams,
  params,
  importExcel,
}) => {
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: { product_type_id: productTypeParam ? parseInt(productTypeParam) : checkProductType['2'] },
  });

  const [isModelChangePrices, setIsModelChangePrices] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [checkDelete, setCheckDelete] = useState(true);
  const [showModalReview, setShowModalReview] = useState(false);
  const [itemReviewLevel, setItemReviewLevel] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [itemList, setItemList] = useState([]);

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

  const product_type_id = methods.watch('product_type_id');

  const showListBusiness = (value) => {
    setItemList(value);
    setOpenModal(true)
  }

  const columns = useMemo(
    () => [
      {
        header: 'Mã Imei',
        accessor: 'product_imei',

        disabled: true,
        hidden: product_type_id * 1 !== checkProductType[1],
      },
      {
        header: 'Mã sản phẩm ',
        classNameHeader: 'bw_text_center',
        accessor: 'product_code',
        disabled: true,
      },
      {
        header: 'Tên sản phẩm ',
        classNameHeader: 'bw_text_center',
        accessor: 'product_name',
      },
      {
        header: 'Hình thức xuất',
        classNameHeader: 'bw_text_center',
        accessor: 'output_type_name',
      },
      {
        header: 'Đơn vị tính',
        classNameHeader: 'bw_text_center',
        accessor: 'unit_name',
      },
      {
        header: 'Giá bán hiện tại',
        classNameHeader: 'bw_text_center',
        accessor: 'price_vat',
        formatter: (p) => {
          return <span className='bw_label bw_label_success'>{p?.price_vat ? formatMoney(p?.price_vat, true, ',') : 0} VND</span>;
        },
      },
      {
        header: 'Thời gian áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'apply_time',
        formatter: (p) => {
          return <span className={defendPriceDateUsing[`${p?.price_defend}`]?.classActive}>{p?.apply_time}</span>;
        },
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
        formatter: (p) => {
          return renderItemSplit(p?.company_name);
        },
      },
      {
        header: 'Khu vực',
        classNameHeader: 'bw_text_center',
        accessor: 'area_name',
      },
      {
        header: 'Chi nhánh',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
        formatter: (p) => {
          const arrayBusinessName = stringToArray(p?.business_name);
          return arrayBusinessName?.length > 3 ? <span className="bw_label_outline bw_label_outline_success text-center" onClick={() => {
            showListBusiness(arrayBusinessName ?? [])
          }}>{arrayBusinessName?.length} Chi nhánh +</span> : <span style={{textWrap: 'nowrap', maxWidth: '320px'}}>{renderItemSplit(arrayBusinessName)}</span>
        },
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
      {
        header: 'Trạng thái duyệt',
        accessor: 'is_review',
        classNameHeader: 'bw_sticky bw_name_sticky_right bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky_right bw_text_center',
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
    ],
    [product_type_id],
  );

  const handleReview = (item) => {
    setItemReviewLevel(item);
    setShowModalReview(true);
  };

  const handleCheckPricesChange = useCallback(() => {
    // kiểm tra xem có giá sản phẩm nào là chưa duyệt hoặc không duyệt hay không
    let index_review = dataSelect.findIndex((_price) => parseInt(_price?.is_review) !== 1);

    // Kiểm tra xem có bị trùng sản phẩm không
    let product_same = {};
    let label = '';
    let index_count = -1;
    if (product_type_id * 1 === checkProductType[1]) {
      label = defineProductTypeList['imei'];
      dataSelect.forEach((_item) => {
        if (product_same[_item.product_id + '-' + _item.product_type]) {
          product_same[_item.product_id + '-' + _item.product_type] += 1;
        } else {
          product_same[_item.product_id + '-' + _item.product_type] = 1;
        }
      });
      index_count = Object.values(product_same).findIndex((_price) => _price > 1);
    } else {
      label = defineProductTypeList['product'];
      dataSelect.forEach((_item) => {
        if (product_same[_item.product_id + '-' + _item.product_imei + '-' + _item.product_type]) {
          product_same[_item.product_id + '-' + _item.product_imei + '-' + _item.product_type] += 1;
        } else {
          product_same[_item.product_id + '-' + _item.product_imei + '-' + _item.product_type] = 1;
        }
      });
      index_count = Object.values(product_same).findIndex((_price) => _price > 1);
    }

    if (!dataSelect || dataSelect.length === 0) {
      showToast.error(`Vui lòng chọn giá ${label} cần chỉnh sửa.`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    // } else if (index_count > -1) {
    //   showToast.error(`Vui lòng không chọn trùng ${label} điều để chỉnh giá.`, {
    //     position: 'top-right',
    //     autoClose: 1000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: 'colored',
    //   });
    } else {
      if (index_review > -1) {
        showToast.error(`Vui lòng chọn giá ${label} đã duyệt.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        setIsModelChangePrices(true);
      }
    }
  }, [dataSelect]);

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-check',
        color: 'red',
        permission: 'SL_PRICES_REVIEW',
        hidden: (_) => {
          return _?.is_can_review * 1 === 1 && _?.is_review * 1 !== 1 ? false : true;
        },
        //disabled: (p) => (p?.is_can_review === 1 ? false : false),
        onClick: (p) => {
          if (p?.is_can_review * 1 === 1 && p?.is_review * 1 !== 1) {
            handleReview(p?.price_id);
          }
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'blue',
        permission: 'SL_PRICES_EDIT',
        onClick: (p) => {
          let priceId = p?.price_id;
          let productImei = p?.product_imei;
          let unitId = p?.unit_id;
          priceId = checkValueNone(p?.parent_price_id, p?.price_id);
          unitId = checkValueNone(unitId, 0);
          window._$g.rdr(
            `/prices/view/${p?.product_type_deff}/${p?.product_id}/${priceId}/${p?.area_id}/${p?.output_type_id}/${product_type_id}/${unitId}/${productImei}`,
          );
        },
      },      
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-in',
        type: 'success',
        outline: true,
        content: 'Import',
        onClick: () => importExcel(),
        permission: 'SL_PRICES_IMPORT',
      },
      {
        icon: 'fi fi-rr-add',
        color: 'blue',
        globalAction: true,
        content: 'Điều chỉnh giá',
        permission: 'SL_PRICES_ADJUSTMENT',
        onClick: (p) => {
          handleCheckPricesChange();
        },
      },
    ];
  }, [handleCheckPricesChange, importExcel]);

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

  const handleUpdateChangePrices = async () => {
    await onChangePage(page);
    setIsModelChangePrices(false);
    setDataSelect(null);
  };

  const RenderHeader = () => {
    return (
      <FlexRowCustom className='bw_mt_1'>
        <div className='bw_col_3'>
          <div className='bw_frm_box'>
            <FormProvider {...methods}>
              <label>Hiển thị theo</label>
              <FormSelect
                field='product_type_id'
                id='product_type_id'
                list={selectProductTypeList}
                onChange={(value) => {
                  value = Array.isArray(value) ? value.map(objectParse) : value;
                  setCheckDelete(false);
                  methods.setValue('product_type_id', value);
                  onChangeListPage(value, 1);
                  setProductTypeId(value);
                }}
              />
            </FormProvider>
          </div>
        </div>
        <CheckAccess permission='SL_PRICES_ADD'>
          <div>
            {/* <BWButton
              style={{
                height: 'fit-Content',
                alignSelf: 'flex-end',
              }}
              globalAction={true}
              icon='fi fi-rr-inbox-out'
              type='success'
              content='Nhập excel'
              outline={true}
              permission='SL_PRICES_IMPORT'
              onClick={(p) => {
                console.log('Nhập excel');
              }}
            />
            <BWButton
              style={{
                marginLeft: '5px',
                height: 'fit-Content',
                alignSelf: 'flex-end',
              }}
              globalAction={true}
              icon='fi fi-rr-inbox-out'
              type='success'
              content='Xuất excel'
              outline={true}
              permission='SL_PRICES_EXPORT'
              onClick={(p) => {
                console.log('Xuất excel');
              }}
            /> */}
            {/* <BWButton
              style={{
                marginLeft: '5px',
                marginRight: '20px',
                height: 'fit-Content',
                alignSelf: 'flex-end',
              }}
              globalAction={true}
              icon='fi fi-rr-add'
              type='success'
              content='Điều chỉnh giá'
              permission='SL_PRICES_ADJUSTMENT'
              onClick={(p) => {
                handleCheckPricesChange();
              }}
            /> */}
          </div>
        </CheckAccess>
      </FlexRowCustom>
    );
  };

  const handleChangeClick = (value) => {
      setParams((prev) => ({ ...prev, status_apply_id: value}))
  }

  const title = (
    <div>
      {defendPriceDateUsing &&
        Object.values(defendPriceDateUsing)?.map((value) => {
          return (
            <button className={params?.status_apply_id == value?.value ? value?.classActive :value?.classActiveBtn} style={{ marginRight: '10px' }} 
            onClick={() => handleChangeClick(value?.value)}>
              {value?.name}
            </button>
          );
        })}
    </div>
  );

  return (
    <React.Fragment>
      {productTypeParam ? null : <RenderHeader></RenderHeader>}
      <DataTable
        title={title}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={handleBulkAction}
        loading={loading}
        hiddenDeleteClick={true}
        defaultDataSelect={dataSelect}
        onChangeSelect={(valueSelect) => setDataSelect(valueSelect)}
        hiddenRowSelect={(p) => p?.is_review !== 1}
        setCheckDelete={setCheckDelete}
        deleteAllData={checkDelete}
      />

      {isModelChangePrices ? (
        <AdjustmentPricesModel
          open={isModelChangePrices}
          onClose={() => setIsModelChangePrices(false)}
          onConfirm={handleUpdateChangePrices}
          setCheckDelete={setCheckDelete}
          dataSelect={dataSelect || []}
          productType={product_type_id}
          setDataSelect={(valueSelect) => setDataSelect(valueSelect)}
        />
      ) : null}
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
      title="Danh sách Chi nhánh"/>
    </React.Fragment>
  );
};

export default PricesTable;
