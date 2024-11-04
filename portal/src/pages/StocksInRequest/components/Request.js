import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { mapDataOptions4SelectCustom, mapDataOptions4Select } from 'utils/helpers';
import { REQUEST_CODE_TYPES, REVIEW_STATUS_TYPES } from './utils/constants';
// services
import { getOptionsBusiness } from 'services/business.service';
import {
  getOptionsSupplier,
  getListUserRequest,
  getOptionsStocksInType,
  getOptionsCustomer,
  getStoreByBusinessId,
} from 'services/stocks-in-request.service';
import { getOptionsDepartment } from 'services/department.service';
import { getOptionsStocksByStore, getOptionsStocksByStoreBusiness } from 'services/stocks.service';
import { getProfile } from 'services/auth.service';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { getStocksTransferTypeByCode } from 'pages/StocksOutRequest/helper/call-api';
import CustomerInformation from './CustomerInformation';

function Request({ disabled, isDisassembleComponent, locationPurchaseOrder }) {
  const methods = useFormContext();
  const { watch, setValue } = methods;

  const { search, state = {} } = useLocation();
  const { isInRepair } = queryString.parse(search);
  const { is_returned_goods, member_id, customer_type, department_id } = state;

  const [optionsBusiness, setOptionsBusiness] = useState([]);
  const [optionsStocksInType, setOptionsStocksInType] = useState([]);
  const [optionsSupplier, setOptionsSupplier] = useState([]);
  const [optionsDepartmentRequest, setOptionsDepartmentRequest] = useState([]);
  const [optionsUserRequest, setOptionsUserRequest] = useState([]);
  const [optionsStore, setOptionsStore] = useState([]);
  const [optionsStocks, setOptionsStocks] = useState([]);
  const [transferStocks, setTransferStocks] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const isReturnedGoods = watch('stocks_in_type')?.stocks_in_type === 8;

  const borrow_request_id = watch('borrow_request_id');

  // get type of transfer stocks
  useEffect(() => {
    const requestCode = methods.getValues('request_code');
    if (requestCode && requestCode.includes('PCK')) {
      getStocksTransferTypeByCode({ request_code: requestCode }).then(setTransferStocks);
    }
  }, [methods]);

  const optionsStocksCompany = useGetOptions(optionType.stocksCompany, {
    params: {
      is_active: 1,
      parent_id: locationPurchaseOrder?.purchase?.company_id,
    },
    checkParams: !!locationPurchaseOrder?.purchase?.purchase_order_id && !!locationPurchaseOrder?.purchase?.company_id,
  });

  useEffect(() => {
    setOptionsStocks(optionsStocksCompany);
    setValue('member_id', watch('member_id') ?? locationPurchaseOrder?.purchase?.member_id);
    setValue('customer_type', watch('customer_type') ?? locationPurchaseOrder?.purchase?.customer_type);
    getProfile().then((data) => {
      setValue('department_id', locationPurchaseOrder ? data?.department_id : watch('department_id'));
      setValue('request_user', locationPurchaseOrder ?? data);
    });
  }, [locationPurchaseOrder]);

  const getOptionsData = useCallback(() => {
    getOptionsBusiness().then((data = []) => {
      setOptionsBusiness(mapDataOptions4Select(data));
      setValue('business_request_id', data.find((item) => item.name === 'CÔNG TY CỔ PHẦN HESMAN VIỆT NAM')?.id);
    });
    getOptionsStocksInType().then((data) => {
      setOptionsStocksInType(
        data.map((p) => ({
          ...p,
          label: p.name,
          value: p.id,
          disabled: p.is_transfer || p.is_inventory_control ? true : false,
        })),
      );
    });
    getOptionsSupplier().then((data) => {
      setOptionsSupplier(mapDataOptions4Select(data));
    });
    getOptionsDepartment().then((data) => {
      setOptionsDepartmentRequest(mapDataOptions4SelectCustom(data));
    });
  }, [setValue]);
  useEffect(getOptionsData, [getOptionsData]);

  // người yêu cầu theo chi nhanh và phong ban
  const getUserRequest = useCallback(() => {
    if (watch('business_request_id') || watch('department_request_id') && !!locationPurchaseOrder) {
      getListUserRequest({
        business_id: watch('business_request_id'),
        department_id: watch('department_request_id'),
      }).then((data) => {
        setOptionsUserRequest(mapDataOptions4Select(data));
      });
    }
  }, [watch, locationPurchaseOrder]);
  useEffect(getUserRequest, [getUserRequest]);

  // Lấy danh sách cửa hàng yêu cầu
  const getStores = useCallback(() => {
    getStoreByBusinessId({ business_id: !transferStocks ? watch('business_request_id') : null }).then((res) =>
      setOptionsStore(mapDataOptions4SelectCustom(res, 'store_id', 'store_name')),
    );
  }, [transferStocks, watch]);

  useEffect(getStores, [getStores]);

  // lấy kho theo trung tam
  let storeId = watch('store_id');
  const getStocks = useCallback(() => {
    // if (watch('store_id')) {
    getOptionsStocksByStoreBusiness({
      store_id: storeId,
      business_request_id: !transferStocks ? watch('business_request_id') : null,
      stocks_type: isReturnedGoods ? 4 : null,
    }).then((data) => {
      setOptionsStocks(mapDataOptions4SelectCustom(data));
    });
    // }
  }, [isReturnedGoods, transferStocks, watch, storeId]);

  useEffect(getStocks, [getStocks]);

  const handleSetDefaultStocksInType = (defaultStocksInType) => {
    setValue('stocks_in_type_id', defaultStocksInType?.id);
    setValue('stocks_in_type', defaultStocksInType);
    if (defaultStocksInType?.is_auto_review) {
      setValue('is_auto_review', REVIEW_STATUS_TYPES.REVIEWED);
    }
  };

  useEffect(() => {
    // is_returned_goods = locationPurchaseOrder?.purchase?.is_returned_goods;
    // kiem tra neu la them moi thi auto set hinh thuc nhap kho la nhap mua hang va gen code
    if (!watch('stocks_in_type_id') && optionsStocksInType.length > 0 && !isInRepair) {
      // nếu là yêu cầu nhập rã linh kiện từ yêu cầu rã linh kiện
      if (isDisassembleComponent) {
        const defaultStocksInType = (optionsStocksInType || []).find((v) => v.is_disassemble_component);
        if (defaultStocksInType) {
          handleSetDefaultStocksInType(defaultStocksInType);
        }
      } else if (locationPurchaseOrder?.purchase?.is_returned_goods) {
        const defaultStocksInType = (optionsStocksInType || []).find((v) =>
          v.name === "Hàng bán bị trả lại"
        );
        if (defaultStocksInType) {
          handleSetDefaultStocksInType(defaultStocksInType);
        }
      } else {
        const defaultStocksInType = (optionsStocksInType || []).find((v) =>
          locationPurchaseOrder?.purchase?.is_returned_goods ? v.is_returned_goods : v.is_purchase,
        );
        if (defaultStocksInType) {
          handleSetDefaultStocksInType(defaultStocksInType);
        }
      }
    }
  }, [optionsStocksInType, locationPurchaseOrder]);

  const getOptsCustomer = useCallback((value) => {
    return getOptionsCustomer({
      keyword: value,
    }).then((body) =>
      body.map((user) => ({
        label: user?.name,
        value: String(user?.id),
      })),
    );
  }, []);

  // Lay ma code khi thay doi hinh thuc nhap kho ap dung cho them moi
  const getStocksInCodeReq = useCallback(() => {
    if (watch('stocks_in_type_id') && !isInRepair) {
      const stocksInType = (optionsStocksInType || []).find((_) => _.id === watch('stocks_in_type_id'));
      setValue('stocks_in_type', stocksInType);
    }
  }, [isInRepair, optionsStocksInType, setValue, watch]);
  useEffect(getStocksInCodeReq, [getStocksInCodeReq, optionsStocksInType]);
  const {
    is_purchase = true,
    is_exchange_goods = false,
    is_warranty = false,
    is_different = false,
  } = watch('stocks_in_type') ?? {};

  const getCurrentUser = useCallback(() => {
    getProfile().then((data) => {
      setCurrentUser(data)
      // setValue('department_request_id', data?.department_id ?? data?.department_id);

    });
  }, []);
  useEffect(getCurrentUser, [getCurrentUser]);

  useEffect(() => {
    if (locationPurchaseOrder?.purchase?.business_id) {
      setValue('business_request_id', locationPurchaseOrder?.purchase?.business_id);
    }
    setValue('member_id', locationPurchaseOrder?.purchase?.member_id ?? locationPurchaseOrder?.purchase?.member_id);
    setValue('customer_type', locationPurchaseOrder?.purchase?.customer_type ?? locationPurchaseOrder?.purchase?.customer_type);
    setValue('department_request_id', currentUser?.department_id);
    setValue('request_user', currentUser?.user_name + " - " + currentUser?.full_name);
    setValue('request_code', locationPurchaseOrder?.purchase?.purchase_order_code);
    setValue('store_id', locationPurchaseOrder?.purchase?.store_id);
  }, [locationPurchaseOrder, setValue, currentUser]);

  // Render Supplierfield when select stock type is purchase or transfer
  const renderSupplier = () => {
    return (
      <FormItem
        label='Nhà cung cấp'
      // isRequired
      >
        <FormSelect
          field='supplier_id'
          showSearch
          list={optionsSupplier}
          disabled={disabled}
        // validation={{
        //   validate: {
        //     required: (_, formValues) => {
        //       if (
        //         !_ &&
        //         (formValues?.stocks_in_type?.is_purchase === 1 ||
        //           formValues?.stocks_in_type?.is_disassemble_component === 1)
        //       ) {
        //         return 'Nhà cung cấp là bắt buộc';
        //       }
        //     },
        //   },
        // }}
        />
      </FormItem>
    );
  };

  // Render business/department/user request
  const renderRequester = () => {
    return (
      <>
        <FormItem
          label='Miền yêu cầu'
          className=''
        // isRequired
        >
          <FormSelect
            field='business_request_id'
            list={optionsBusiness}
            showSearch
            disabled={disabled}
            onChange={(e) => {
              methods.clearErrors('business_request_id');
              setValue('business_request_id', e);
              setValue('request_user', null);
              setValue('store_id', null);
              setValue('stocks_id', null);
            }}
            allowClear={true}
          // validation={{
          //   validate: {
          //     required: (_, formValues) => {
          //       if (
          //         !_ &&
          //         (formValues?.stocks_in_type?.is_purchase === 1 ||
          //           formValues?.stocks_in_type?.is_disassemble_component === 1)
          //       ) {
          //         return 'Chi nhánh yêu cầu là bắt buộc';
          //       }
          //     },
          //   },
          // }}
          />
        </FormItem>
        <FormItem
          label='Phòng ban yêu cầu'
          className=''
        // isRequired
        >
          <FormSelect
            field='department_request_id'
            list={optionsDepartmentRequest}
            showSearch
            disabled={disabled}
            onChange={(e) => {
              methods.clearErrors('department_request_id');
              setValue('department_request_id', e);
              setValue('request_user', null);
            }}
          // validation={{
          //   validate: {
          //     required: (_, formValues) => {
          //       if (
          //         !_ &&
          //         (formValues?.stocks_in_type?.is_purchase === 1 ||
          //           formValues?.stocks_in_type?.is_disassemble_component === 1)
          //       ) {
          //         return 'Phòng ban yêu cầu là bắt buộc';
          //       }
          //     },
          //   },
          // }}
          />
        </FormItem>
        <FormItem
          label='Người yêu cầu'
          // isRequired
          disabled={disabled || !(watch('business_request_id') && watch('department_request_id'))}>
          <FormSelect
            field='request_user'
            list={optionsUserRequest}
            showSearch
            disabled={disabled || !(watch('business_request_id') && watch('department_request_id'))}
          // validation={{
          //   validate: {
          //     required: (_, formValues) => {
          //       if (
          //         !_ &&
          //         (formValues?.stocks_in_type?.is_purchase === 1 ||
          //           formValues?.stocks_in_type?.is_disassemble_component === 1)
          //       ) {
          //         return 'Người yêu cầu là bắt buộc';
          //       }
          //     },
          //   },
          // }}
          />
        </FormItem>
      </>
    );
  };
  const renderLotNumber = () => {
    return (
      <FormItem label='Lô hàng'>
        <FormInput
          type='text'
          field='lot_number'
          placeholder='Nhập lô hàng'
          disabled={disabled}
          validation={{
            required: false,
            // pattern: {
            //   value:
            //     /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
            //   message: 'Số lô không hợp lệ',
            // },
          }}
        />
      </FormItem>
    );
  };
  const renderCustomer = () => {
    return (
      <FormItem label='Khách hàng' isRequired>
        <FormDebouneSelect
          field='member_name'
          placeholder='--Chọn--'
          fetchOptions={getOptsCustomer}
          style={{
            width: '100%',
          }}
          disabled={disabled}
          validation={{
            //required: 'Khách hàng là bắt buộc',
            validate: {
              required: (_, formValues) => {
                if (
                  !_ &&
                  (formValues?.stocks_in_type?.is_exchange_goods === 1 || formValues?.stocks_in_type?.is_warranty === 1)
                ) {
                  return 'Khách hàng là bắt buộc';
                }
              },
            },
          }}
          onChange={(e) => {
            setValue('member_name', e.label);
            setValue('member_id', e.value);
          }}
        />
      </FormItem>
    );
  };

  const renderRequestCode = (stocksInType) => {
    const requestCode = { label: 'Số mã yêu cầu', field: '' };
    switch (stocksInType) {
      case REQUEST_CODE_TYPES.ISPURCHASE:
        requestCode.label = 'Mã đơn mua hàng';
        break;
      case REQUEST_CODE_TYPES.ISINVENTORYCONTROL:
        requestCode.label = 'Số yêu cầu kiểm kê';
        break;
      case REQUEST_CODE_TYPES.ISEXCHANGEGOODS:
        requestCode.label = 'Số đơn hàng đổi trả';
        break;
      case REQUEST_CODE_TYPES.ISTRANSFER:
        requestCode.label = 'Số yêu cầu chuyển kho';
        break;
      case REQUEST_CODE_TYPES.ISWARRANTY:
        requestCode.label = 'Số yêu cầu bảo hành';
        break;
      case REQUEST_CODE_TYPES.ISCOMPONENT:
        requestCode.label = 'Số yêu cầu rã linh kiện';
        break;
      case REQUEST_CODE_TYPES.ISINTERNAL:
        requestCode.label = 'Số yêu cầu nhập nội bộ';
        break;
      default:
        requestCode.label = 'Số mã yêu cầu';
    }

    return (
      <FormItem label={requestCode.label} disabled={disabled || !!borrow_request_id}>
        <FormInput type='text' field='request_code' placeholder='Nhập mã yêu cầu' />
      </FormItem>
    );
  };

  return (
    <BWAccordion title='Yêu cầu nhập kho' id='bw_info_more' isRequired>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Hình thức phiếu nhập' isRequired>
            <FormSelect
              field='stocks_in_type_id'
              showSearch
              list={optionsStocksInType}
              disabled={disabled}
              validation={{
                required: 'Hình thức phiếu nhập là bắt buộc',
              }}
              onChange={(e, v) => {
                if (v?.is_auto_review) {
                  setValue('is_auto_review', REVIEW_STATUS_TYPES.REVIEWED);
                }
                setValue('stocks_in_type_id', e);
                setValue('stocks_id', null);
                setValue('receiver_name', null);
                setValue('supplier_id', null);
                setValue('business_request_id', null);
                setValue('department_request_id', null);
                setValue('request_user', null);
                setValue('lot_number', null);
                setValue('member_id', null);
                setValue('store_id', null);
              }}
            />
          </FormItem>
          {renderRequestCode(watch('stocks_in_type')?.stocks_in_type)}
          {(is_purchase || !is_different) && !borrow_request_id ? renderSupplier() : null}
          {(is_purchase || !is_different) && !borrow_request_id ? renderLotNumber() : null}
          {is_exchange_goods || is_warranty ? renderCustomer() : null}
        </div>
        <div className='bw_col_4'>{renderRequester()}</div>
        <div className='bw_col_4'>
          <FormItem label='Cửa hàng nhập'>
            <FormSelect
              field='store_id'
              showSearch
              list={optionsStore}
              disabled={disabled}
              onChange={(e) => {
                methods.setValue('store_id', e);
                methods.setValue('stocks_id', null);
              }}
              allowClear={true}
            />
          </FormItem>
          <FormItem label='Kho nhập' isRequired>
            <FormSelect
              field='stocks_id'
              showSearch
              list={optionsStocks}
              disabled={disabled}
              onChange={(e) => {
                methods.clearErrors('stocks_id');

                methods.setValue('stocks_id', e);
                methods.setValue('receiver_name', null);
              }}
              validation={{
                required: 'Kho nhập là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem label='Người nhập' disabled={true}>
            <FormInput field='receiver_name' disabled={true} />
          </FormItem>
        </div>
        {isReturnedGoods ? <CustomerInformation /> : null}
        <FormItem label='Ghi chú' className='bw_col_12'>
          <FormTextArea field='description' rows={3} disabled={disabled} placeholder='Ghi chú' />
        </FormItem>
      </div>
    </BWAccordion>
  );
}

export default Request;
