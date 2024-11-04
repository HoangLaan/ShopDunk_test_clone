import React, {useCallback, useEffect} from 'react';
import {useFormContext} from "react-hook-form";
import {getListProduct} from "services/lockshift-open.service";
import FormSection from "components/shared/FormSection";
import LockShiftProduct from "./section/LockShiftProduct";

const Products = ({disabled, lockShiftId, onSubmit}) => {
  const methods = useFormContext();
  const {setValue, watch} = methods

  const loadInfoProduct = useCallback(async () => {
    const dataProduct = await getListProduct({lockShiftId});
    setValue("list_shift_product", dataProduct)
  }, []);

  useEffect(() => {
    loadInfoProduct()
  }, [loadInfoProduct]);

  const detailForm = [
    {
      title: 'Danh sách sản phẩm',
      component: LockShiftProduct,
      onRefresh:loadInfoProduct,
      fieldActive: [],
      disabled: disabled,
    }
  ];


  return <FormSection detailForm={detailForm} onSubmit={onSubmit} noSideBar={true} disabled={disabled}/>
};

export default Products;
