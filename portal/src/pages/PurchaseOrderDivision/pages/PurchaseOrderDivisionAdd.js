import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

import FormSection from 'components/shared/FormSection/index';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';
import usePageInformation from 'hooks/usePageInformation';
import { STATUS_TYPES } from 'utils/constants';
import { triggerSidebar } from 'actions/global';
import { useDispatch } from 'react-redux';
import purchaseOrderDivisionService from 'services/purchaseOrderDivision.service';
import PageProvider from '../components/PageProvider/PageProvider';
import InformationForm from '../components/Forms/InformationForm';
import { useAuth } from 'context/AuthProvider';
import ProductDivisionForm from '../components/Forms/ProductDivisionForm';
import StoreApplyForm from '../components/Forms/StoreApplyForm';
import UserReviewListForm from '../components/Forms/UserReviewListForm';
import ICON_COMMON from 'utils/icons.common';
import useDetectHookFormChange from 'hooks/useDetectHookFormChange';
import { method } from 'lodash';
import useQueryString from 'hooks/use-query-string';
import AutomaticForm from '../components/Forms/AutomaticForm';

function PurchaseOrderDivisionAdd() {
  const { user } = useAuth();
  const defaultValues = {
    is_active: STATUS_TYPES.ACTIVE,
    division_type: 1,
    created_user: user?.isAdministrator ? 'Administrator' : `${user.user_name} - ${user.full_name}`,
    created_date: dayjs().format('DD/MM/YYYY'),
    area_list: [],
    product_list: []
  }
  const methods = useForm({
    defaultValues
  });
  const [loading, setLoading] = useState(false);
  const [stockOption, setStockOption] = useState(false);
  const { disabled, id: purchaseOrderDivisionId } = usePageInformation('id');
  const isReviewed = methods.watch('is_reviewed');
  const dispatch = useDispatch();
  const query = useQueryString();

  const {search, state, pathname} = useLocation();
  const searchParams = new URLSearchParams(search);
  const purchaseOrderId = searchParams.get('purchase_order_id');
  const isAdd = useMemo(() => pathname.includes('/add'), [pathname]);
  // console.log('>>> errors', methods.formState.errors);
  // useDetectHookFormChange(methods)
  const [isDivisionFromPreorder ,setIsDivisionFromPreorder] = useState(parseInt(query[0]?.division_type) === 2)

  const initDataFromOrders = useCallback(() => {
      const dataFromOrders = state;
      return {
        ...state,
        division_type: 2,
        area_list: [{id: dataFromOrders.area_id, value: dataFromOrders.area_id}],
        product_list: dataFromOrders.data,
      }
  }, [])

  const handleChangePurchaseOrder = async (value) => {
    methods.clearErrors('purchase_order_id');
    methods.setValue('purchase_order_id', value);

    const store_apply_list = methods.watch('store_apply_list') || [];
    const new_store_apply_list = store_apply_list.map((item) => ({
      ...item,
      product_id: null,
      unit_id: null,
      unit_name: null,
      quantity: null,
      division_quantity: null,
      note: null,
    }));
    methods.setValue('store_apply_list', new_store_apply_list);
    if (methods.watch('division_type') == 1) {
      const res = await purchaseOrderDivisionService.getListPurchaseOrderDetail({ list_purchase: value });
      methods.setValue('supplier_id', res?.purchaseOrder[0]?.supplier_id); // Đang lấy nhà cung cấp đầu tiên, phải lấy toàn bộ nhà cung cấp của đơn mua hàng đó mới đúng
      // Ko lấy những sản phẩm đã chia đủ
      methods.setValue('product_list', res.productList?.filter(p => p.divided_quantity < p.quantity) || []);
    } else {
      if(!isDivisionFromPreorder){
        const res = await purchaseOrderDivisionService.getPoAndDoDetailMulti(value);
        if(methods.watch('division_type') == 0){
          // Ko lấy những sản phẩm đã chia đủ
          res.product_list = res?.product_list?.filter(p => p.divided_quantity < p.quantity)
        }
        methods.setValue('product_list', res?.product_list || []);
        methods.setValue('business_id', res?.rpoData?.business_receive_id);
        methods.setValue('supplier_id', res?.supplier_id);
        if (res?.rpoData?.area_id) {
          methods.setValue('area_list', [{ id: res?.rpoData.area_id, value: res?.rpoData.area_id }]);
        }
      }
     
    } 
  };

  

  const handleChangeStocks = async (value) => {
    methods.clearErrors('stocks_id');
    methods.setValue('stocks_id', value);

    if(isDivisionFromPreorder){
      const product_list = methods.watch(`product_list`);
      const data = await purchaseOrderDivisionService.getInventoryByProduct({product_ids: product_list.map(item => item.product_id), stocks_id: value});
      // Chỉ lấy những sản phẩm có tồn kho trong kho tổng
      return methods.setValue(`product_list`, product_list.map(item => ({
        ...item,
        quantity_expected_division: item.quantity,
        // Số lượng chia = SL tồn kho tổng + (Tổng số lượng từ đơn mua hàng - số lượng đã nhập kho)
        quantity:  data.find(p => p.product_id == item.product_id)?.quantity ?? 0 + ((item.expected_quantity ?? 0) - (item.warehouse_quantity ?? 0)),
        expected_date: null
      })).filter(p => p.quantity > 0))
    }

    const store_apply_list = methods.watch('store_apply_list') || [];
    const new_store_apply_list = store_apply_list.map((item) => ({
      ...item,
      product_id: null,
      unit_id: null,
      unit_name: null,
      quantity: null,
      division_quantity: null,
      note: null,
    }));
    methods.setValue('store_apply_list', new_store_apply_list);

    if (methods.watch('division_type') == 1 && value) {
      const res = await purchaseOrderDivisionService.getListPurchaseOrderDetail({ list_purchase: methods.watch('purchase_order_id') ?? null, stocks_id: value });
      methods.setValue('product_list', res.productList || []);
    } 
  }

  useEffect(() => {
    if(methods.watch('division_type') === 1){
      if (purchaseOrderId) {
        handleChangePurchaseOrder([purchaseOrderId]);
      }
    }
  }, [methods.watch('division_type')])

  const initData = async () => {
    try {
      setLoading(true);
      if (purchaseOrderDivisionId) {
        let data = await purchaseOrderDivisionService.getById(purchaseOrderDivisionId);
        if (data?.division_type == 2) {         
          setIsDivisionFromPreorder(true)
          data = {...data, store_apply_list: data.store_apply_list.map(item => ({...item, stocks_expected_date: item.product_division[0].expected_date}))}
        }
        methods.reset(data);
      } else {
        if(isDivisionFromPreorder){
          methods.reset({
            ...defaultValues,
            ...initDataFromOrders()
          });
        } else {
          methods.reset(defaultValues)
        }
        if (purchaseOrderId) {
          handleChangePurchaseOrder([purchaseOrderId]);
        }
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const genCodeDivison = async () =>{
    try{
      let code = await purchaseOrderDivisionService.genCodeDivison();
      let {purchase_order_division_code = ''} = (code || {});
      methods.setValue('purchase_order_division_code', purchase_order_division_code)
    }catch(error){
      showToast.error(error.message);
    }
  }

  
  const getOptionStocks = async () =>{
    try{
      let result = await purchaseOrderDivisionService.getListStocksOrderDivison();
      setStockOption(result)
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() =>{
    getOptionStocks()
  }, [])

  useEffect(() => {
    initData();
  }, []);

  useEffect(() =>{
    genCodeDivison();
  },[])
  const onSubmit = async (payload) => {
    try {
      payload.created_user = payload.created_user?.split("-")?.[0]?.trim();
      let { product_list = [], division_type = 0, store_apply_list = [] } = (payload || {});
      if (division_type == 1) {
        (product_list || []).map(pro => {
          let division_quantity = 0;
          (store_apply_list || []).map(store => {
            let { product_division = [] } = (store || {});
            let product = (product_division || []).find(p => p?.product_id == pro?.product_id);
            division_quantity += (product?.division_quantity || 0)
          })
          //Lấy tồn kho nên comment dòng bên dưới lại
          // if (division_quantity > pro?.quantity) {
          //   throw new Error('Số lượng chia hàng không được lớn hơn số lượng đã mua')
          // }
        })
      }
      else {
        let divisionCheck = payload.product_division?.some((item) => item.division_quantity > item.quantity);
        if (divisionCheck) {
          throw new Error('Số lượng chia hàng không được lớn hơn số lượng đã mua')
        }
      }
      setLoading(true);
      if (purchaseOrderDivisionId) {
        if(division_type === 0){
          payload = {
            ...payload,
            store_apply_list: payload.store_apply_list.map(item => {
              const productDivision = payload.product_division.find(p => p.product_id === item.product_id)
              return {
                ...item,
                product_division: [
                  {
                    ...productDivision,
                    ...item,
                  }
                ]
              }
            })
          }
        }
        await purchaseOrderDivisionService.updateMultiStore(payload)
        showToast.success('Chỉnh sửa thành công');
      } else {
        if (division_type == 1) {
          // Nếu là phân loại theo kho tổng
              let array = (store_apply_list || []).map(item =>{
              // let product_division = (item?.product_division || []).filter(item => item?.purchase_order_detail_id)
              let product =  [...item?.product_division, ...product_list].filter((obj, index) => {
                if(obj?.purchase_order_detail_id){
                  return index ===  [...item?.product_division, ...product_list].findIndex(o => obj.purchase_order_detail_id == o.purchase_order_detail_id);
                }
              });

              return {
                ...item,
                product_division : product
              }
            })
          await purchaseOrderDivisionService.createMultiStore({...payload , store_apply_list:array})
        } else if ( division_type == 2 ) {
          // Nếu là phân loại theo pre-order
          let array = (store_apply_list || []).map(item =>{
            return {
              ...item,
              product_division: item.product_division.map(x => ({...x, expected_date: item.stocks_expected_date}))
            }
          })
        await purchaseOrderDivisionService.createMultiStore({...payload , store_apply_list:array})
        } else {
          // Nếu là phân loại không theo kho tổng
          // await purchaseOrderDivisionService.create({...payload , purchase_order_id : [payload?.purchase_order_id]});
          await purchaseOrderDivisionService.createMultiStore({...payload, purchase_order_id: payload.purchase_order_id?.flat(), store_apply_list: payload.store_apply_list.map(item => {
            const productInStore = payload.store_apply_list.find(s => s.store_id === item.store_id);
            const productDivision = payload.product_division.find(pd => pd.product_id === productInStore.product_id);
            return {
              ...item,
              product_division: [
                {
                  ...productDivision,
                  ...productInStore,
                },
              ]
            }
          })});
        }
        showToast.success('Thêm mới thành công');
      }
      await initData();
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  
  const detailForm = [
    {
      id: 'INFORMATION_FORM',
      title: 'Thông tin chia hàng',
      component: InformationForm,
      fieldActive: ['purchase_order_division_name', 'purchase_order_id'],
      handleChangePurchaseOrder,handleChangeStocks,
      stockOption : stockOption,
      setStockOption,
      isDivisionFromPreorder
    },
    { 
      id: 'STORE_APPLY_FORM',
      title: 'Cửa hàng áp dụng',
      fieldActive: ['store_apply_list'],
      component: StoreApplyForm,
      stockOption : stockOption
    },
    { 
      id: 'AUTOMATIC_FORM',
      title: 'Chia hàng tự động',
      hidden: methods.watch('division_type') !== 1,
      component: AutomaticForm
    },
    {
      id: 'PRODUCT_DIVISION_FORM',
      title: 'Sản phẩm chia hàng',
      fieldActive: ['product_list[0]'],
      component: ProductDivisionForm,
    },
    {
      id: 'USER_REVIEW_LIST',
      title: 'Thông tin duyệt',
      component: UserReviewListForm,
      fieldActive: ['review_list'],
    },
    {
      id: 'FORM_STATUS',
      title: 'Trạng thái',
      component: FormStatus,
      hiddenSystem: true,
      fieldActive: methods.watch('is_active') ? ['is_active'] : [],
    },
  ];

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      hidden: isReviewed,
      content: disabled ? 'Chỉnh sửa' : purchaseOrderDivisionId ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/purchase-order-division/edit/' + purchaseOrderDivisionId)
        else methods.handleSubmit(onSubmit)();
      },
    },
  ];

  return (
    <PageProvider>
      <FormProvider {...methods}>
        <FormSection actions={actions} loading={loading} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled}/>
      </FormProvider>
    </PageProvider>
  );
}

export default PurchaseOrderDivisionAdd;
