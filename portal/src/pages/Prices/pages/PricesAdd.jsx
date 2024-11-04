import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import queryString from 'query-string';
import { showToast } from 'utils/helpers';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { create, detailPrices, detailProduct, update, detailModelAttribute } from 'pages/Prices/helpers/call-api';
import FormSection from 'components/shared/FormSection';
import PricesInfor from 'pages/Prices/components/add/PricesInfor';
import ProductList from 'pages/Prices/components/add/ProductList';
import ModelList from 'pages/Prices/components/add/ModelList';
import PricesReview from 'pages/Prices/components/add/PricesReview';
import { checkProductType } from '../components/contain/contain';

const PricesAdd = ({ isEdit = true, location = {} }) => {
  const { productTypeDeff, productId, priceId, areaId } = useParams();
  const { product_type = 1 } = queryString.parse(window.location.search);

  let {
    productPrices = {},
    productType = checkProductType[2],
    detailPrices: _detailPrices = null,
  } = useSelector((p) => p?.prices);

  const { productType: productTypeState, productPrices: productPricesState, priceVat } = location?.state || {};

  if (productTypeState && productPricesState) {
    productPrices = productPricesState;
    productType = productTypeState;
  }

  const [productTypeCheck, setProductTypeCheck] = useState(undefined);
  const methods = useForm({
    defaultValues: { is_active: 1 },
  });
  const { register, setValue, reset } = methods;
  useEffect(() => {
    register('product_list', { required: 'Sản phẩm để làm giá là bắt buộc.' });
    setValue('product_type', productType);
    if (productPrices && Object.values(productPrices).length) {
      setValue('product_list', productPrices);
    }

    if (_detailPrices && productPrices && priceId) {
      reset({
        ..._detailPrices,
        product_list: productPrices,
      });
    }
    if (priceVat) {
      setValue('price_vat', priceVat);
    }
    getAttributeModel(productType, productPrices);
  }, []);

  const getAttributeModel = (type, listModel = {}) => {
    if (type * 1 === checkProductType['3']) {
      let ModelList = '';
      Object.values(listModel).map((value) => {
        if (value) {
          if (ModelList) {
            ModelList += `|${value.model_id}`;
          } else {
            ModelList += value.model_id;
          }
        }
      });

      detailModelAttribute({ model_list: ModelList })
        .then((res) => {
          setValue('model_attribute_list', res);
        })
        .catch(() => {
          setValue('model_attribute_list', {});
        });
    }
  };

  const onSubmit = async (values) => {
    let cloneValue = structuredClone(values);
    if (productType * 1 === checkProductType['3']) {
      cloneValue.product_list = values.model_attribute_list;
      delete cloneValue.model_attribute_list;
    }

    let formData = { ...cloneValue };

    try {
      if (priceId) {
        await update(priceId, formData);
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
      } else {
        await create(formData);
        showToast.success(`Thêm thành công.`, {
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
      methods.reset({});
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

      // Kiểm tra nếu xảy ra lỗi mà nếu key lỗi là product_error thì hiển thị lỗi trên sản phẩm
      let product_error = error?.errors?.product_error;

      let _product_list = methods.watch('product_list') || {};

      product_error.forEach((_error) => {
        if (
          _product_list[`key${_error.product_id}`] &&
          parseInt(_product_list[`key${_error.product_id}`].product_type) === parseInt(_error.product_type)
        ) {
          _product_list[`key${_error.product_id}`].error = error.message;
        }
      });

      methods.setValue('product_list', _product_list);
    }
  };

  const loadPricesDetail = useCallback(async () => {
    if (priceId && productId) {
      if (productId && priceId) {
        const _detailProduct = await detailProduct(productId, { product_type_deff: productTypeDeff, product_type: product_type, price_id: priceId });
        const _detailPrices = await detailPrices(productId, { product_type_deff: productTypeDeff, price_id: priceId, product_type: product_type, area_id: areaId });

        if (_detailProduct && _detailPrices) {
          let cloneData = structuredClone(_detailProduct);
          let productType = checkProductType[2];
          if (cloneData?.product_imei) {
            productType = checkProductType[1];
          }

          setProductTypeCheck(productType);
          reset({
            ..._detailPrices?.price_apply[0],
            product_list: {
              [`key${_detailProduct?.product_id}`]: _detailProduct,
            },
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    loadPricesDetail();
  }, [loadPricesDetail]);

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin chính',
      component: PricesInfor,
      fieldActive: ['output_type_id', 'start_date', 'end_date', 'areas', 'base_price'],
      priceId: priceId,
      paramHidden: productType,
    },
    {
      id: 'status',
      title: 'Danh Sách sản phẩm đã chọn',
      component: ProductList,
      hidden: productType === checkProductType['3'],
      paramHidden: productTypeCheck ?? productType,
      fieldActive: ['product_list'],
    },
    {
      id: 'status',
      title: 'Danh Sách model đã chọn',
      component: ModelList,
      hidden: productType !== checkProductType['3'],
      fieldActive: ['product_list'],
    },
    {
      id: 'permission',
      title: 'Thông tin duyệt',
      component: methods.watch('is_many_outputs')
        ? () => {
            return <></>;
          }
        : PricesReview,
      fieldActive: ['review_list'],
      priceId: priceId,
    },
  ];

  const actions = [
    {
      type: 'success',
      icon: 'fi fi-rr-check',
      content: 'Hoàn tất thêm mới',
      onClick: methods.handleSubmit(onSubmit),
      hidden: !isEdit,
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={!isEdit}
        noActions={!isEdit}
        actions={actions}
      />
    </FormProvider>
  );
};

export default PricesAdd;
