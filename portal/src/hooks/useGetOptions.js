import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { capitalizedString, mapDataOptions } from 'utils/helpers';
import isEqual from 'lodash/isEqual';

function useGetOptions(optionName, funcOptions = {}) {
  const dispatch = useDispatch();
  const {
    valueName = 'id',
    labelName = 'name',
    valueAsString = false,
    params = { is_active: 1 },
    checkParams = true,
    isHasOptionAll = false,
  } = funcOptions;

  const storedOptions = useSelector((state) => state.global[`${optionName}Data`]);
  const storedParams = useSelector((state) => state.global[`${optionName}Params`]);
  const isFetching = useSelector((state) => state.global[`get${capitalizedString(optionName)}Loading`]);

  useEffect(() => {
    if (isFetching || !checkParams) return;
    if (!storedOptions || !isEqual(storedParams, params)) {
      dispatch(getOptionsGlobal(optionName, params));
    }
  }, [params, checkParams, isFetching]);

  const options = useMemo(() => {
    if (storedOptions && isHasOptionAll) {
      storedOptions.unshift({ id: 0, name: 'Tất cả' });
    }
    return mapDataOptions(storedOptions, { valueName, labelName, valueAsString });
  }, [storedOptions, valueName, labelName, valueAsString]);

  return options?.length ? options : [];
}

/**
 * this list ref to: api-portal/app/modules/global/utils/constants.js
 */
export const optionType = {
  supplier: 'supplier',
  purchaseRequisition: 'purchaseRequisition',
  store: 'store',
  company: 'company',
  department: 'department',
  purchaseOrder: 'purchaseOrder',
  business: 'business',
  area: 'area',
  taskWorkFlow: 'taskWorkFlow',
  productModel: 'productModel',
  conditionDb: 'conditionDb',
  source: 'source',
  customerType: 'customerType',
  poReviewLevel: 'poReviewLevel',
  user: 'user',
  discountProgram: 'discountProgram',
  poDivisionReviewLevel: 'poDivisionReviewLevel',
  taskType: 'taskType',
  taskTypeAuto: 'taskTypeAuto',
  order: 'order',
  stocksInType: 'stocksInType',
  stocksCompany: 'stocksCompany',
  bank: 'bank',
  province: 'province',
  block: 'block',
  hobbiesForUser: 'hobbiesForUser',
  cluster: 'cluster',
  zaloTemplate: 'zaloTemplate',
  expendType: 'expendType',
  purchaseRequisitionType: 'purchaseRequisitionType',
  storeType: 'storeType',
  brand: 'brand',
  taskTypeWflow: 'taskTypeWflow',
  requestPurchaseOrder: 'requestPurchaseOrder',
  positionByDepartment: 'positionByDepartment',
  interestContent: 'interestContent',
  stocksType: 'stocksType',
  documentType: 'documentType',
  timeKeepingClaimType: 'timeKeepingClaimType',
  shift: 'shift',
  accounting_account: 'accounting_account',
  accountingAccount: 'accounting_account',
  internalTransferType: 'internalTransferType',
  storeByBusiness: 'storeByBusiness',
  stocks: 'stocks',
  stockTypeByStore: 'stockTypeByStore',
  paymentForm: 'paymentForm',
};

export default useGetOptions;
