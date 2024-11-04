import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useParams, useLocation } from 'react-router';
//service
import { getDetail, create, update } from 'services/product-model.service';
//utils
//compnents
import AttributeAdd from './components/add/modals/AttributeAdd';
import Images from './components/add/Images';
import FormSection from 'components/shared/FormSection/index';
import Info from './components/add/Info';
import Description from './components/add/Description';
import ProductInfo from './components/add/ProductInfo';
import ProductList from './components/add/ProductList';
import Status from './components/add/Status';
import DefaultAccount from './components/add/DefaulAccount';
import { generateRandomString } from './hepler';

export default function ProductCategoryAdd() {
  const methods = useForm();
  const {
    register,
    reset,
    formState: { errors },
  } = methods;
  let { product_model_id } = useParams();
  const { pathname } = useLocation();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isCopy = useMemo(
    () => !pathname.includes('/edit') && Boolean(product_model_id) && !disabled,
    [pathname, product_model_id, disabled],
  );
  const [isOpenModalAttributeAdd, setOpenModalAttributeAdd] = useState(false);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    register('icon');
    register('picture_url', { required: true });
  }, [register]);

  const defaultAccountList = useMemo(
    () => [
      { type: 1, accounting_account_id: 48 },
      { type: 2, accounting_account_id: 238 },
      { type: 3, accounting_account_id: 199 },
      { type: 4, accounting_account_id: 215 },
      { type: 5, accounting_account_id: 48 },
    ],
    [],
  );

  const getData = useCallback(() => {
    try {
      setLoading(true);
      if (product_model_id) {
        getDetail(product_model_id).then((data) => {
          if (data) {
            if (data.default_account_list?.length === 0) {
              data.default_account_list = defaultAccountList;
            }
            reset({
              ...data,
            });
          }
        });
      } else {
        reset({
          is_active: 1,
          is_show_web: 1,
          default_account_list: defaultAccountList,
          model_code: generateRandomString(),
        });
      }
    } catch (error) {
      showToast.error(window._$g._(error.message));
    } finally {
      setLoading(false);
    }
  }, [product_model_id, reset]);

  useEffect(getData, [getData]);

  const onSubmit = async (values) => {
    try {
      delete values.default_account_names;
      setLoading(true);
      if (product_model_id && !isCopy) {
        await update(product_model_id, values);
        showToast.success('Cập nhật model thành công', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        await create(values);
        showToast.success(`${isCopy ? 'Sao chép' : 'Thêm mới'} model thành công`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        reset({ is_active: 1, product_list: [] });
        if (isCopy) window.location.href = '/product-model';
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`${statusText || message}`].concat(errors || []).join('.');
      showToast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errors) window.scrollTo(0, 0);
  }, [errors]);

  const handleAddAttribute = (attribute) => {
    let attributes = methods.getValues('attributes') ?? [];
    attributes.push({ ...attribute, is_new: true });
    methods.setValue('attributes', attributes);
    setCategoryAttributes([...categoryAttributes, attribute]);
    setOpenModalAttributeAdd(false);
  };

  const detailForm = [
    {
      title: 'Thông tin model',
      id: 'information',
      fieldActive: ['model_code', 'model_name', 'display_name', 'attributes', 'order_index', 'product_category_id'],
      component: Info,
      setOpenModalAttributeAdd: setOpenModalAttributeAdd,
      categoryAttributes: categoryAttributes,
      setCategoryAttributes: setCategoryAttributes,
    },
    {
      title: 'Hình ảnh',
      id: 'pictures',
      fieldActive: ['images'],
      component: Images,
    },
    {
      title: 'Mô tả',
      id: 'description',
      component: Description,
    },
    {
      title: 'Thông tin sản phẩm',
      id: 'pro_info',
      fieldActive: [
        'attribute_value_1.attibute_id',
        'attribute_value_1.values',
        'attribute_value_2.attibute_id',
        'attribute_value_2.values',
      ],
      component: ProductInfo,
      productModelId: product_model_id,
    },
    {
      title: 'Danh sách sản phẩm',
      id: 'pro_list',
      component: ProductList,
      productModelId: product_model_id,
    },
    {
      title: 'Tài khoản ngầm định',
      id: 'default_account',
      component: DefaultAccount,
      id: 'default_account_list',
      fieldActive: ['default_account_list'],
      disabled: disabled,
      data: [],
    },
    {
      title: 'Trạng thái',
      id: 'status',
      component: Status,
      hiddenSystem: true,
    },
  ];

  return (
    <React.Fragment>
      <div className='bw_main_wrapp' style={{ position: 'inherit' }}>
        <FormProvider {...methods}>
          <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
        </FormProvider>
      </div>
      {isOpenModalAttributeAdd && (
        <AttributeAdd
          onClose={() => setOpenModalAttributeAdd(false)}
          onConfirm={handleAddAttribute}
          productCategoryId={methods.watch('product_category_id')}
        />
      )}
    </React.Fragment>
  );
}
