import React, { useState, useMemo } from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { showConfirmModal } from 'actions/global';
import { useDispatch } from 'react-redux';
import ICON_COMMON from 'utils/icons.common';
import PropTypes from 'prop-types';
import { renderItemSplit } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import PromotionPOOffersModal from '../modal/PromotionPOOffersModal';

import { DEFFEND_KEY_GET, DEFFEND_KEY_SET, getValueByField, checkArgumentsArr } from '../../utils/helpers';
import { ARRAY_DEFEND_OFFER_PROMOTION } from '../../utils/constants';
import { checkEmptyArray, stringToArray } from 'utils';
import ModallShowList from 'pages/Prices/components/table-prices/modal/ModallShowList';

const PromotionPOOffersApply = ({ title, loading, disabled }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(undefined);
  const [openModalDomain, setOpenModalDomain] = useState(false);
  const [itemList, setItemList] = useState([]);

  const handleAndCheckPOOffersApply = (field, value, valueDefault = false) => {
    const cloneDefffendArray = structuredClone(ARRAY_DEFEND_OFFER_PROMOTION);
    let arrValueDefffendArray = [];
    cloneDefffendArray.map((val, index) => {
      if (val) {
        let result = null;
        if (val === field) {
          result = getValueByField(methods, val, value, DEFFEND_KEY_SET);
        } else {
          result = getValueByField(methods, val, value, DEFFEND_KEY_GET);
        }
        arrValueDefffendArray.push(result);
      }
    });

    let checkCondditionOfffer = checkArgumentsArr(arrValueDefffendArray);
    if (checkCondditionOfffer) {
      methods.setValue('check_offer_apply', 1);
    } else {
      methods.setValue('check_offer_apply', null);
    }
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

  const showListBusiness = (value) => {
    setItemList(value);
    setOpenModalDomain(true);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Tên ưu đãi khuyến mại',
        accessor: 'promotion_offer_name',
      },
      {
        header: 'Miền',
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
        header: 'Ưu đãi khuyến mại',
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
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới ưu đãi KM',
        permission: 'PROMOTION_OFFERS_ADD',
        onClick: () => window._$g.rdr(`/promotion-offers/add`),
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Chọn ưu đãi khuyến mại',
        permission: 'PROMOTIONS_OFFERS_ADD',
        hidden: disabled,
        onClick: () => {
          setModalOpen(true);
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        hidden: disabled,
        permission: 'PROMOTIONS_OFFERS_DEL',
        onClick: (value) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.store_name} ra khỏi danh sách khách hàng áp dụng ?`], () => {
              let promotion_offer_apply_list = _.cloneDeep(methods.watch('promotion_offer_apply_list'));
              promotion_offer_apply_list = promotion_offer_apply_list.filter(
                (o) => parseInt(o?.promotion_offer_id) !== parseInt(value?.promotion_offer_id),
              );

              methods.setValue('promotion_offer_apply_list', promotion_offer_apply_list);
              handleAndCheckPOOffersApply('promotion_offer_apply_list', promotion_offer_apply_list);
              return;
            }),
          );
        },
      },
    ];
  }, []);

  const styleAction = { gap: '15px' };

  return (
    <BWAccordion title={title}>
      {/* <div className='bw_col_12'>
          <label className='bw_checkbox bw_col_12'>
            <FormInput disabled={disabled} type='checkbox' field='is_all_promotions_offer' />
            <span />
            Áp dụng ưu đãi trên đơn hàng
          </label>
        </div> */}
      {/* {!Boolean(methods.watch('is_all_promotions_offer')) && (
          <DataTable
            hiddenActionRow
            noPaging
            noSelect
            loading={loading}
            data={Array.isArray(methods.watch('promotion_offer_apply_list')) ? methods.watch('promotion_offer_apply_list') : []}
            columns={columns}
            actions={actions}
          />
        )} */}
      <div className='bw_col_12'>
        <label className='bw_checkbox bw_col_12'>
          <FormInput
            disabled={disabled}
            type='checkbox'
            field='is_apply_order'
            onChange={(e) => handleAndCheckPOOffersApply('is_apply_order', e.target.checked)}
          />
          <span />
          Áp dụng ưu đãi trên đơn hàng
        </label>
      </div>

      <DataTable
        hiddenActionRow
        noPaging
        noSelect
        loading={loading}
        data={
          Array.isArray(methods.watch('promotion_offer_apply_list')) ? methods.watch('promotion_offer_apply_list') : []
        }
        columns={columns}
        actions={actions}
        styleAction={styleAction}
      />
      {modalOpen && (
        <PromotionPOOffersModal
          open={modalOpen}
          columns={columns}
          onClose={() => {
            handleAndCheckPOOffersApply();
            methods.unregister('keyword');
            setModalOpen(false);
          }}
        />
      )}
      <ModallShowList
        open={openModalDomain}
        setOpen={setOpenModalDomain}
        listValue={itemList}
        funcIn={renderItemSplit}
        title='Danh sách Miền'
      />
      <FormInput
        type='hidden'
        field='check_offer_apply'
        validation={{
          required: 'Ưu đãi khuyến mãi là bắt buộc',
        }}
      />
    </BWAccordion>
  );
};

PromotionPOOffersApply.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default PromotionPOOffersApply;
