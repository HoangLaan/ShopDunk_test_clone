import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { showToast } from 'utils/helpers';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';

import BWButton from 'components/shared/BWButton/index';
import DataTable from 'components/shared/DataTable/tableChange';
import BWImage from 'components/shared/BWImage/index';
import types from 'pages/Prices/actions/type';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import CheckAccess from 'navigation/CheckAccess';

import { selectProductType, checkProductType, objectParse, cloneArraySelectProductTypeObj } from '../contain/contain';

dayjs.extend(customParseFormat);

const FlexRowCustom = styled.div`
  margin-left: -5px;
  margin-right: -5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
`;

const PricesListTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  loading,
  onChangeListPage,
  setProductTypeId,
}) => {
  const [dataSelect, setDataSelect] = useState([]);
  const [checkDelete, setCheckDelete] = useState(true);
  const methods = useForm({ defaultValues: { product_type_id: 2 } });

  const dispatch = useDispatch();

  const handleValidateProduct = useCallback(() => {
    if (dataSelect && dataSelect.length) {
      const productType = methods.watch('product_type_id') * 1;
      let newValue = {};
      switch (productType) {
        case checkProductType['1']:
          newValue = dataSelect.reduce((pre, cur) => ({ ...pre, ['key' + cur.product_imei]: { ...cur } }), {});
          break;
        case checkProductType['3']:
          newValue = dataSelect.reduce((pre, cur) => ({ ...pre, ['key' + cur.model_id]: { ...cur } }), {});
          break;
        default:
          newValue = dataSelect.reduce((pre, cur) => ({ ...pre, ['key' + cur.product_id]: { ...cur } }), {});
      }

      dispatch({ type: types.SET_VALUE_PRODUCT_TYPE, payload: productType });
      dispatch({ type: types.SET_VALUE_PRODUCT_LIST, payload: newValue });
      window._$g.rdr(`/prices-list/add`);
    } else {
      showToast.error('Vui lòng chọn sản phẩm làm giá!', {
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
  }, [dataSelect, dispatch]);

  const product_type_id = methods.watch('product_type_id');

  const columns = useMemo(
    () => [
      {
        header: 'Mã Imei',
        accessor: 'product_imei',
        disabled: true,
        hidden: product_type_id * 1 !== checkProductType[1],
      },
      {
        header: cloneArraySelectProductTypeObj[`${product_type_id * 1}`]?.labelCode,
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
        disabled: true,
      },
      {
        header: cloneArraySelectProductTypeObj[`${product_type_id * 1}`]?.labelName,
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          const hiddenImg = product_type_id * 1 === checkProductType['3'];
          return (
            <div className='bw_inf_pro'>
              {!hiddenImg ? <BWImage src={p?.picture_url} /> : null}
              {p?.product_name}
            </div>
          );
        },
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
        classNameHeader: 'bw_text_center',
        hidden: product_type_id * 1 === checkProductType['3'],
      },
      {
        header: 'Model sản phẩm',
        accessor: 'model_name',
        classNameHeader: 'bw_text_center',
        hidden: product_type_id * 1 === checkProductType['3'],
      },
      {
        header: 'Nhà sản xuất',
        accessor: 'manufacture_name',
        classNameHeader: 'bw_text_center',
        hidden: product_type_id * 1 === checkProductType['3'],
      },
    ],
    [product_type_id],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-eye',
        color: 'blue',
        permission: 'SL_PRICES_VIEW',
        onClick: (p) => {
          let cloneP = structuredClone(p);
          cloneP.product_imei = '';
          if (product_type_id * 1 === checkProductType['1']) {
            cloneP.product_imei = p?.product_imei;
          }
          const linkResult = linkController(cloneP, product_type_id * 1);
          window._$g.rdr(linkResult);
        },
      },
    ];
  }, [product_type_id]);

  const objectToQueryString = (value = {}, valueDefault = '') => {
    let result = '';
    const objectKeyValue = Object.keys(value);
    if(objectKeyValue && Array.isArray(objectKeyValue) && objectKeyValue.length > 0) {
      for(let i = 0; i < objectKeyValue.length; i++) {
        const item = objectKeyValue[i];
        const valueItem = value[item];
        if(valueItem) {
          if(result) {
            result += `&${item}=${valueItem}`;
          } else {
            result += `${item}=${valueItem}`;
          }
        }
      }
    }
    result = valueDefault ? valueDefault + result: result;
    return result
  };

  const linkController = (valueFilter, product_type_id) => {

    let objectProductFilter = {
      product_type_pro_mat: 1,
      imei_identity: null,
      model_identity: null,
      product_identity: null,
      product_type_param: product_type_id
    };
    
    if(valueFilter?.product_type_deff == 2) {
      objectProductFilter.product_type_pro_mat = 2;
    }

    switch (product_type_id) {
      case checkProductType['1']:
        objectProductFilter.imei_identity = valueFilter?.product_imei
        break;
      case checkProductType['3']:
        objectProductFilter.model_identity = valueFilter?.model_id;
        break;
      default:
        objectProductFilter.product_identity = valueFilter?.product_id;
    }
    const DEFFLINK = '/prices?';
    const link = objectToQueryString(objectProductFilter, DEFFLINK)
    return link;
  };

  const RenderHeader = () => {
    return (
      <FlexRowCustom className='bw_mt_1'>
        <div className='bw_col_3'>
          <div className='bw_frm_box' style={{marginBottom: '0px'}}>
            <FormProvider {...methods}>
              <label>Hiển thị theo</label>
              <FormSelect
                field='product_type_id'
                id='product_type_id'
                list={selectProductType}
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
          <BWButton
            style={{
              marginLeft: '3px',
              marginRight: '50px',
              height: 'fit-Content',
              alignSelf: 'center',
            }}
            globalAction={true}
            icon='fi fi-rr-dollar'
            type='success'
            content='Làm giá'
            permission='SL_PRICES_ADD'
            onClick={(p) => {
              handleValidateProduct();
            }}
          />
        </CheckAccess>
      </FlexRowCustom>
    );
  };

  return (
    <React.Fragment>
      <RenderHeader></RenderHeader>
      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        spacing={true}
        totalItems={totalItems}
        onChangePage={onChangePage}
        loading={loading}
        defaultDataSelect={dataSelect}
        onChangeSelect={(valueSelect) => {
          setDataSelect(valueSelect);
        }}
        setCheckDelete={setCheckDelete}
        hiddenDeleteClick={true}
        deleteAllData={checkDelete}
      />
    </React.Fragment>
  );
};

export default PricesListTable;
