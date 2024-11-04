import React, {useCallback, useEffect, useState} from 'react';
import {FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form";
import {getListCustomer} from "services/lockshift-open.service";
import {showToast} from "utils/helpers";
import FormSection from "components/shared/FormSection";
import LockShiftCustomer from "./section/LockShiftCustomer";
import SelectMemberModal from "./components/SelectMemberModal";
import {useDispatch} from "react-redux";

const Customer = ({disabled,onSubmit,lockShiftId}) => {
  const methods = useFormContext();
  const {setValue} =methods
  const loadInfoCustomer = useCallback(async () => {
      const dataCustomer = await getListCustomer({lockShiftId});
      setValue("list_shift_customer",dataCustomer)
  }, []);


  useEffect(() => {
    loadInfoCustomer()
  }, [loadInfoCustomer]);


  const detailForm = [
    {
      title: 'Danh sách khách hàng',
      component: LockShiftCustomer,
      onSubmit:onSubmit,
      fieldActive: [],
      disabled: disabled,
    }
  ];


  return  <FormSection detailForm={detailForm} onSubmit={onSubmit} noSideBar={true} disabled={disabled}/>

};

export default Customer;
