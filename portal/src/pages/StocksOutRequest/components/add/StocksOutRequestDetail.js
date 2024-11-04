import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import BWAccordion from 'components/shared/BWAccordion/';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import BWImage from 'components/shared/BWImage/index';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
// import { removeCharactersVietnamese } from 'utils/helpers';
import {
  getBusinessOptions,
  getDataStocksManager,
  getListCustomerOptions,
  getListDepartmentOptions,
  getOptionsListStockOuttypeRequest,
  getOptionsStocks,
  getStoreWithDeboune,
  getUserBussinessDepartment,
} from 'services/stocks-out-request.service';
import { getOptionsManufacturer } from 'services/manufacturer.service';
import { useParams, useLocation } from 'react-router-dom';
import { KEY_DETAIL } from 'pages/StocksOutRequest/utils/constants';
import { useAuth } from 'context/AuthProvider';
import { getStocksTransferTypeByCode } from 'pages/StocksOutRequest/helper/call-api';
import { getBase64 } from 'utils/helpers';
import { TRANSFER_TYPE } from 'pages/StocksTransfer/helpers/const';
import { cdnPath } from 'utils';
import jsx_address from 'pages/ReturnPurchase/StockOutRequest/components/add/jsx_render/Address';
import jsx_purchase_user from 'pages/ReturnPurchase/StockOutRequest/components/add/jsx_render/PurchaseUser';
import jsx_receiver from 'pages/ReturnPurchase/StockOutRequest/components/add/jsx_render/Receiver';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import jsx_supplier from 'pages/ReturnPurchase/StockOutRequest/components/add/jsx_render/Supplier';
import jsx_export_user from 'pages/ReturnPurchase/StockOutRequest/components/add/jsx_render/ExportUser';

const RemoveImageSpan = styled.span`
  display: flex;
  .fi::before {
    display: flex;
  }
`;

const StocksOutRequestDetail = ({ disabled }) => {
  const methods = useFormContext();
  const {
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = methods;
  
  const location = useLocation();
  const { stocks_out_request_id } = useParams();
  const { isOutRepair } = queryString.parse(location.search);
  const { user } = useAuth();
  const [listBussiness, setListBussiness] = useState([]);
  const [listDepartment, setListDepartment] = useState([]);
  const [listStocks, setListStocks] = useState([]);
  const [listStocksTo, setListStocksTo] = useState([]);
  const [listStocksManager, setListStocksManager] = useState([]);
  const [listStockOutType, setListStockOutType] = useState([]);
  const [listUserRequest, setListUserRequest] = useState([]);
  const [listManufacturer, setListManufacturer] = useState([]);
  const [transferStocks, setTransferStocks] = useState({});

  const stocsOutTypeSelected = useMemo(() =>
    listStockOutType.find((e) => e.stocks_out_type_id === methods.watch('stocks_out_type_id')),
  );

  // get type of transfer stocks
  useEffect(() => {
    if (stocsOutTypeSelected?.is_transfer && methods.getValues('request_code')) {
      getStocksTransferTypeByCode({ request_code: methods.getValues('request_code') }).then(setTransferStocks);
    }
  }, [stocsOutTypeSelected?.is_transfer]);

  const loadBussiness = useCallback(() => {
    getBusinessOptions().then((e) => {
      setListBussiness(
        e.map((o) => {
          return {
            value: o?.id,
            label: o?.name,
          };
        }),
      );
    });
  }, [getBusinessOptions, stocks_out_request_id]);
  useEffect(loadBussiness, [loadBussiness]);

  const loadDepartment = useCallback(() => {
    getListDepartmentOptions().then((e) => {
      setListDepartment(
        e.map((o) => {
          return {
            value: String(o?.id),
            label: o?.name,
          };
        }),
      );
    });
  }, [getListDepartmentOptions]);
  useEffect(loadDepartment, [loadDepartment]);

  const watchFromStore = methods.watch('from_store');

  const loadStocks = useCallback(() => {
    getOptionsStocks({
      store_id: watchFromStore?.value,
    }).then((e) => {
      setListStocks(
        e.map((o) => {
          return {
            value: o?.id,
            label: o?.name,
          };
        }),
      );
    });
  }, [watchFromStore, getBusinessOptions]);
  useEffect(loadStocks, [loadStocks]);

  const watchToStore = methods.watch('to_store');
  const loadStocksTo = useCallback(() => {
    getOptionsStocks({
      store_id: watchToStore?.value || methods.watch('to_store_id'),
    }).then((e) => {
      setListStocksTo(
        e.map((o) => {
          return {
            value: o?.id,
            label: o?.name,
          };
        }),
      );
    });
  }, [watchToStore]);
  useEffect(loadStocksTo, [loadStocksTo]);

  const from_stocks_id = methods.watch('from_stocks_id');
  const loadDataStocksManager = useCallback(() => {
    if (from_stocks_id)
      getDataStocksManager(from_stocks_id).then((e) => {
        setListStocksManager(
          (e?.items ?? [])?.map((o) => {
            return {
              value: o?.id,
              label: o?.name,
            };
          }),
        );
      });
  }, [getDataStocksManager, from_stocks_id]);
  useEffect(loadDataStocksManager, [loadDataStocksManager]);

  const loadListStockOutType = useCallback(() => {
    getOptionsListStockOuttypeRequest()
      .then((e) => {
        setListStockOutType(
          (e?.items ?? [])?.map((o) => {
            if (!stocks_out_request_id && ((o?.is_sell && !isOutRepair) || (o?.is_internal && isOutRepair))) {
              methods.setValue('stocks_out_type_id', o?.stocks_out_type_id);
              methods.setValue('is_auto_review', o?.is_auto_review);
              methods.setValue('stocks_out_type_name', o?.stocks_out_type_name);
              methods.setValue('is_transfer', o?.is_transfer);
            }
            return {
              value: o?.stocks_out_type_id,
              label: o?.stocks_out_type_name,
              ...o,
            };
          }),
        );
      })
      .catch((_) => { })
      .finally(() => { });
  }, []);
  useEffect(loadListStockOutType, [loadListStockOutType]);

  const business_id = methods.watch('business_id');
  const department_id = methods.watch('department_id');

  const loadUserBussinessDepartment = useCallback(() => {
    if (business_id && department_id)
      getUserBussinessDepartment(business_id, department_id)
        .then((e) => {
          setListUserRequest(
            (e ?? [])?.map((o) => {
              return {
                value: String(o?.id),
                label: o?.name,
              };
            }),
          );
        })
        .catch((_) => { })
        .finally(() => { });
  }, [business_id, department_id]);
  useEffect(loadUserBussinessDepartment, [loadUserBussinessDepartment]);

  const loadStore = (value) => {
    // value return tu input
    return getStoreWithDeboune({
      key_word: value,
    }).then((body) =>
      body.map((user) => ({
        label: user.store_name,
        value: user.store_id,
      })),
    );
  };

  const loadCustomer = (value) => {
    // value return tu input
    return getListCustomerOptions({
      keyword: value,
    }).then((body) =>
      body.map((user) => ({
        label: user?.phone_number + '-' + user?.full_name,
        value: user?.member_id,
        address_full: user?.address_full,
        phone_number: user?.phone_number,
      })),
    );
  };

  const loadManufacturer = useCallback(() => {
    getOptionsManufacturer().then((e) => {
      setListManufacturer(
        e.map((o) => {
          return {
            value: parseInt(o?.id),
            label: o?.name,
          };
        }),
      );
    });
  }, [getListDepartmentOptions, stocsOutTypeSelected]);
  useEffect(loadManufacturer, [loadManufacturer]);

  const handleChangeImages = async (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const { size, name } = files[i];

      if (size / 1000 > 500) {
        setError('images', { type: 'custom', message: `Dung lượng ảnh vượt quá 500kb ()${name}` });
        return;
      }

      clearErrors('images');
      const base64 = await getBase64(files[i]);
      const valueSetImage = [...(Array.isArray(watch('images')) ? watch('images') : []), base64];
      if (valueSetImage.length > 5) {
        setError('images', { type: 'custom', message: `Số lượng ảnh tối đa 5` });
        return;
      }
      setValue('images', valueSetImage);
    }
  };

  // #region jsx_business
  const jsx_business = (
    <div className='bw_col_4'>
      <FormItem disabled={disabled} isRequired label='Miền yêu cầu'>
        <FormSelect
          allowClear
          type='text'
          field='business_id'
          list={listBussiness ?? []}
          validation={{
            required: 'Chi nhánh là bắt buộc',
          }}
        />
      </FormItem>
    </div>
  );

  const jsx_department = (
    <div className='bw_col_4'>
      <FormItem disabled={!methods.watch('business_id') || disabled} isRequired label='Phòng ban yêu cầu'>
        <FormSelect
          allowClear
          list={listDepartment ?? []}
          type='text'
          field='department_id'
          validation={{
            required: 'Phòng ban yêu cầu là bắt buộc',
          }}
          placeholder='Phòng ban yêu cầu'
        />
      </FormItem>
    </div>
  );
  
  const jsx_from_stocks = (
    <div className='bw_col_4'>
      <FormItem
        disabled={(!Boolean(methods.watch('from_store')) && !stocsOutTypeSelected?.is_company) || disabled}
        isRequired
        label='Kho xuất'>
        <FormSelect
          allowClear
          field='from_stocks_id'
          list={listStocks ?? []}
          placeholder='Chọn kho chuyển'
          validation={{
            required: 'Kho xuất là bắt buộc',
          }}
        />
      </FormItem>
    </div>
  );
  const jsx_customer = (required) => (
    <div className='bw_col_4'>
      <FormItem disabled={disabled} isRequired label='Khách hàng'>
        <FormDebouneSelect
          placeholder='Chọn khách hàng'
          fetchOptions={loadCustomer}
          field='customer_selected'
        // validation={{
        //   required: required && 'Chọn khách hàng là bắt buộc',
        // }}
        />
        {methods.watch('customer_selected') && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <span>
              <p>
                <b>Số điện thoại</b>: {methods.watch('customer_selected')?.phone_number ?? 'Chưa xác định'}
              </p>
              <p>
                <b>Địa chỉ</b>: {methods.watch('customer_selected')?.address_full ?? 'Chưa xác định'}
              </p>
            </span>
            {/* <a target='_blank' href={`/customer/detail/${methods.watch('customer_selected')?.value}`} className="bw_btn_outline bw_btn_outline_success" type="button"><span className="fi fi-rr-search-alt"></span></a> */}
          </div>
        )}
      </FormItem>
    </div>
  );

  const jsx_stocks_out_type = (
    <div className='bw_col_4'>
      <FormItem disabled={disabled || stocks_out_request_id} isRequired label='Hình thức phiếu xuất'>
        <FormSelect
          allowClear
          field='stocks_out_type_id'
          list={listStockOutType ?? []}
          placeholder='Hình thức phiếu xuất'
          onChange={(value, options) => {
            const valueForm = methods.watch();
            methods.clearErrors('stocks_out_type_id');
            methods.reset({
              business_id: valueForm?.business_id,
              stocks_out_request_code: valueForm?.stocks_out_request_code,
              created_user: valueForm?.created_user,
              created_date: valueForm?.created_date,
              stocks_out_type_id: value,
              is_auto_review: options?.is_auto_review,
              type_stock_out: options?.type,
              stocks_out_type_name: options?.stocks_out_type_name,
              is_transfer: options?.is_transfer
            });
            if (options?.type != 6) {
              methods.setValue('images', []);
            }
          }}
          validation={{
            required: 'Hình thức phiếu xuất là bắt buộc',
          }}
        />
      </FormItem>
    </div>
  );

  const jsx_from_store = (
    <div className='bw_col_4'>
      <FormItem disabled={disabled} isRequired label='Cửa hàng xuất'>
        <FormDebouneSelect
          isLoadingFirst={true}
          fetchOptions={loadStore}
          field='from_store'
          placeholder='Chọn'
          validation={{
            required: 'Cửa hàng xuất là bắt buộc',
          }}
        />
      </FormItem>
    </div>
  );

  const jsx_to_store = () => (
    <div className='bw_col_4'>
      <FormItem disabled={disabled} label='Cửa hàng nhập'>
        <FormDebouneSelect allowClear={true} fetchOptions={loadStore} field='to_store' placeholder='Cửa hàng nhập' />
      </FormItem>
    </div>
  );

  const userOptions = useGetOptions(optionType.user, { valueAsString: true });
  const supplierOptions = useGetOptions(optionType.supplier);

  const jsx_stocks_out_request_code = (
    <div className='bw_col_4 stocks_out_request_code' style={{pointerEvents: 'auto'}}>
      <FormItem
        disabled={disabled}
        label={
          stocsOutTypeSelected?.is_transfer
            ? 'Phiếu Chuyển kho'
            : stocsOutTypeSelected?.is_warranty
              ? 'Mã phiếu yêu cầu bảo hành'
              : 'Mã phiếu yêu cầu'
        }>
        <FormInput
          type='text'
          field='request_code'
          placeholder={
            stocsOutTypeSelected?.is_transfer
              ? 'Phiếu Chuyển kho'
              : stocsOutTypeSelected?.is_warranty
                ? 'Mã phiếu yêu cầu bảo hành'
                : 'Mã phiếu yêu cầu'
          }
          style={{ margin: `3.8px 0` }}
        />
      </FormItem>
    </div>
  );

  // const jsx_stocks_out_request_code_transfer = (required) => (
  //   <div className='bw_col_4'>
  //     <FormItem disabled={disabled} label='Phiếu Chuyển kho'>
  //       <FormInput type='text' field='request_code' placeholder='Mã phiếu chuyển kho' style={{ margin: `3.8px 0` }} />
  //     </FormItem>
  //   </div>
  // );

  // const jsx_stocks_out_request_code_warranty = (required) => (
  //   <div className='bw_col_4'>
  //     <FormItem disabled={disabled} label='Phiếu yêu cầu bảo hành'>
  //       <FormInput type='text' field='request_code' placeholder='Mã phiếu yêu cầu bảo hành' style={{ margin: `3.8px 0` }} />
  //     </FormItem>
  //   </div>
  // );

  const jsx_request_user = (
    <div className='bw_col_4'>
      <FormItem isRequired disabled={!Boolean(methods.watch('department_id')) || disabled} label='Người yêu cầu'>
        <FormSelect
          allowClear
          defaultValue={{
            label: methods.watch('request_user_fullname'),
            value: methods.watch('request_user'),
          }}
          field='request_user'
          list={listUserRequest ?? []}
          placeholder='Chọn người yêu cầu'
          validation={{
            required: 'Tên người yêu cầu là bắt buộc',
          }}
        />
      </FormItem>
    </div>
  );

  const jsx_create_user = (required) => (
    <div className='bw_col_4'>
      <FormItem label='Người nhập' disabled={true}>
        <FormSelect
          allowClear
          defaultValue={
            stocks_out_request_id
              ? {
                label: methods.watch('create_user_fullname'),
                value: methods.watch('create_user'),
              }
              : {
                label: user?.full_name,
                value: user?.user,
              }
          }
          field='import_user_name'
          list={listUserRequest ?? []}
          placeholder='Chọn người nhập'
        // validation={{
        //   required: 'Tên người yêu cầu là bắt buộc',
        // }}
        />
      </FormItem>
    </div>
  );

  const jsx_receiver_user = (required) => (
    <div className='bw_col_4'>
      <FormItem disabled={disabled} label='Người nhận'>
        <FormSelect
          allowClear
          list={listStocksManager ?? []}
          field='receiver'
          placeholder='Người nhận'
        // validation={{
        //   required: required && 'Người nhận là bắt buộc',
        // }}
        />
      </FormItem>
    </div>
  );

  const jsx_note = (
    <div className='bw_col_12'>
      <FormItem disabled={disabled} label='Ghi chú'>
        <FormTextArea field='note' placeholder='Ghi chú' />
      </FormItem>
    </div>
  );

  const jsx_manufacturer = (required) => (
    <div className='bw_col_4'>
      <FormItem disabled={disabled} label='Hãng bảo hành'>
        <FormSelect
          field='manufacturer_id'
          list={listManufacturer ?? []}
          placeholder='Chọn tên hãng'
        // validation={{
        //   required: required && 'Tên hãng là bắt buộc',
        // }}
        />
      </FormItem>
    </div>
  );

  const jsx_to_stocks = (required) => (
    <div className='bw_col_4'>
      <FormItem disabled={disabled} isRequired label='Kho nhận nhập'>
        <FormSelect
          allowClear
          field='to_stocks_id'
          list={listStocksTo ?? []}
          placeholder='Chọn kho nhập'
        // validation={{
        //   required: required && 'Kho nhập là bắt buộc',
        // }}
        />
      </FormItem>
    </div>
  );

  // const jsx_phone_number = (
  //   <div className='bw_col_4'>
  //     <FormItem disabled isRequired label='Nhập số điện thoại'>
  //       <FormInput disabled field='customer_selected.phone_number' placeholder='Nhập số điện thoại' style={{ margin: `3.8px 0` }} />
  //     </FormItem>
  //   </div>
  // );

  // const jsx_adress = (
  //   <div className='bw_col_4'>
  //     <FormItem disabled isRequired label='Địa chỉ khách hàng'>
  //       <FormInput field='customer_selected.address_full' placeholder='Địa chỉ khách hàng' style={{ margin: `3.8px 0` }} />
  //     </FormItem>
  //   </div>
  // );

  const jsx_stocks_out_request_images = () =>
    watch('type_stock_out') == 6 && (
      <div className='bw_col_12'>
        <FormItem row disabled={disabled} isRequired label='Hỉnh ảnh kèm theo' className='row bw_col_12'>
          <div style={{ display: 'flex' }}>
            <label className='bw_choose_image_banner bw_flex' style={{ display: 'flex' }}>
              <input
                type='file'
                multiple={true}
                field='images'
                name='images'
                accept='image/*'
                onChange={(_) => handleChangeImages(_, 'images')}
              />
              <span className='fi fi-rr-add'></span>
            </label>
            {Boolean(watch('images')?.length) &&
              watch('images').map((item, index) => (
                <div className='bw_image_view_banner'>
                  <BWImage className={'bw_flex'} src={cdnPath(item.picture_url ? item.picture_url : item)} />

                  <RemoveImageSpan
                    className='bw_remove_image'
                    onClick={() => {
                      setValue(
                        'images',
                        watch('images').filter((_, i) => i !== index),
                      );
                    }}>
                    <i className='fi fi-rr-cross-small'></i>
                  </RemoveImageSpan>
                </div>
              ))}
          </div>
          {errors['images'] && <ErrorMessage message={errors['images']?.message} />}
        </FormItem>
      </div>
    );

  // #endregion
  const renderForm = [
    {
      key: KEY_DETAIL.AREA,
      component: jsx_business,
    },
    {
      key: KEY_DETAIL.STOCKS_OUT_TYPE,
      component: jsx_stocks_out_type,
    },
    {
      key: KEY_DETAIL.STOCKS_OUT_REQUEST_CODE,
      component: jsx_stocks_out_request_code,
    },
    // {
    //   key: KEY_DETAIL.STOCKS_OUT_REQUEST_CODE,
    //   hidden: Boolean(
    //     stocsOutTypeSelected?.is_sell ||
    //     stocsOutTypeSelected?.is_internal ||
    //     stocsOutTypeSelected?.is_destroy ||
    //     stocsOutTypeSelected?.is_warranty ||
    //     stocsOutTypeSelected?.is_exchange_goods
    //   ),
    //   component: jsx_stocks_out_request_code_transfer(
    //     !Boolean(stocsOutTypeSelected?.is_transfer)
    //   ),
    // },
    // {
    //   key: KEY_DETAIL.STOCKS_OUT_REQUEST_CODE,
    //   hidden: Boolean(
    //     stocsOutTypeSelected?.is_sell ||
    //     stocsOutTypeSelected?.is_internal ||
    //     stocsOutTypeSelected?.is_destroy ||
    //     stocsOutTypeSelected?.is_transfer ||
    //     stocsOutTypeSelected?.is_exchange_goods
    //   ),
    //   component: jsx_stocks_out_request_code_warranty(
    //     !Boolean(stocsOutTypeSelected?.is_warranty)
    //   ),
    // },
    // jsx_stocks_out_request_code_warranty

    {
      key: KEY_DETAIL.DEPARTMENT,
      component: jsx_department,
    },
    {
      key: KEY_DETAIL.STORE,
      component: jsx_from_store,
      hidden: Boolean(stocsOutTypeSelected?.is_company) || transferStocks?.TRANSFERTYPE === TRANSFER_TYPE.ORIGIN_STOCKS,
    },
    {
      key: KEY_DETAIL.MANUFACTURER,
      hidden: Boolean(
        stocsOutTypeSelected?.is_sell ||
        stocsOutTypeSelected?.is_transfer ||
        stocsOutTypeSelected?.is_internal ||
        stocsOutTypeSelected?.is_destroy ||
        stocsOutTypeSelected?.is_company,
      ),
      component: jsx_manufacturer(
        !Boolean(
          stocsOutTypeSelected?.is_sell ||
          stocsOutTypeSelected?.is_transfer ||
          stocsOutTypeSelected?.is_internal ||
          stocsOutTypeSelected?.is_destroy ||
          stocsOutTypeSelected?.is_company,
        ),
      ),
    },
    {
      key: KEY_DETAIL.TO_STORE,
      hidden: Boolean(
        stocsOutTypeSelected?.is_sell ||
        stocsOutTypeSelected?.is_warranty ||
        stocsOutTypeSelected?.is_internal ||
        stocsOutTypeSelected?.is_destroy ||
        stocsOutTypeSelected?.is_exchange_goods ||
        transferStocks?.TRANSFERTYPE === TRANSFER_TYPE.ORIGIN_STOCKS ||
        stocsOutTypeSelected?.is_return_supplier,
      ),
      component: jsx_to_store(
        !Boolean(
          stocsOutTypeSelected?.is_sell ||
          stocsOutTypeSelected?.is_warranty ||
          stocsOutTypeSelected?.is_internal ||
          stocsOutTypeSelected?.is_destroy ||
          stocsOutTypeSelected?.is_exchange_goods,
        ),
      ),
    },
    {
      key: KEY_DETAIL.REQUEST_USER,
      component: jsx_request_user,
    },
    {
      key: KEY_DETAIL.FROM_STOCKS,
      component: !methods.watch('order_id') && jsx_from_stocks, //hidden when order_id not null
    },
    {
      key: KEY_DETAIL.CUSTOMER,
      component: stocsOutTypeSelected?.is_return_supplier
        ? jsx_supplier({ supplierOptions })
        : jsx_customer(
          !Boolean(
            stocsOutTypeSelected?.is_transfer ||
            stocsOutTypeSelected?.is_warranty ||
            stocsOutTypeSelected?.is_internal ||
            stocsOutTypeSelected?.is_destroy ||
            stocsOutTypeSelected?.is_company,
          ),
        ),
      hidden: Boolean(
        stocsOutTypeSelected?.is_transfer ||
        stocsOutTypeSelected?.is_warranty ||
        stocsOutTypeSelected?.is_internal ||
        stocsOutTypeSelected?.is_destroy ||
        stocsOutTypeSelected?.is_company,
      ),
    },
    {
      key: KEY_DETAIL.TO_STOCKS,
      component: jsx_to_stocks(
        !Boolean(
          stocsOutTypeSelected?.is_warranty ||
          stocsOutTypeSelected?.is_internal ||
          stocsOutTypeSelected?.is_destroy ||
          stocsOutTypeSelected?.is_sell ||
          stocsOutTypeSelected?.is_exchange_goods,
        ),
      ),
      hidden: Boolean(
        stocsOutTypeSelected?.is_warranty ||
        stocsOutTypeSelected?.is_internal ||
        stocsOutTypeSelected?.is_destroy ||
        stocsOutTypeSelected?.is_sell ||
        stocsOutTypeSelected?.is_exchange_goods ||
        stocsOutTypeSelected?.is_return_supplier,
      ),
    },
    // {
    //   key: KEY_DETAIL.PHONE_NUMBER,
    //   hidden: Boolean(
    //     stocsOutTypeSelected?.is_transfer ||
    //     stocsOutTypeSelected?.is_warranty ||
    //     stocsOutTypeSelected?.is_internal ||
    //     stocsOutTypeSelected?.is_destroy,
    //   ),
    //   component: jsx_phone_number,
    // },
    {
      key: KEY_DETAIL.EXPORT_USER,
      component: jsx_export_user({ userOptions }),
    },
    // {
    //   key: KEY_DETAIL.ADRESSS,
    //   hidden: Boolean(
    //     stocsOutTypeSelected?.is_transfer ||
    //     stocsOutTypeSelected?.is_warranty ||
    //     stocsOutTypeSelected?.is_internal ||
    //     stocsOutTypeSelected?.is_destroy,
    //   ),
    //   component: jsx_adress,
    // },

    {
      key: KEY_DETAIL.RECEIVER_USER,
      hidden: Boolean(
        stocsOutTypeSelected?.is_sell ||
        stocsOutTypeSelected?.is_transfer ||
        stocsOutTypeSelected?.is_warranty ||
        stocsOutTypeSelected?.is_destroy ||
        stocsOutTypeSelected?.is_exchange_goods ||
        stocsOutTypeSelected?.is_company,
      ),
      component: stocsOutTypeSelected?.is_return_supplier
        ? jsx_receiver()
        : jsx_receiver_user(
          !Boolean(
            stocsOutTypeSelected?.is_sell ||
            stocsOutTypeSelected?.is_transfer ||
            stocsOutTypeSelected?.is_warranty ||
            stocsOutTypeSelected?.is_destroy ||
            stocsOutTypeSelected?.is_exchange_goods ||
            stocsOutTypeSelected?.is_company,
          ),
        ),
    },
    {
      key: KEY_DETAIL.CREATED_USER,
      hidden: Boolean(
        stocsOutTypeSelected?.is_sell ||
        stocsOutTypeSelected?.is_internal ||
        stocsOutTypeSelected?.is_destroy ||
        stocsOutTypeSelected?.is_warranty ||
        stocsOutTypeSelected?.is_exchange_goods ||
        stocsOutTypeSelected?.is_company,
      ),
      component: stocsOutTypeSelected?.is_return_supplier
        ? jsx_purchase_user({ userOptions })
        : jsx_create_user(!Boolean(stocsOutTypeSelected?.is_transfer)),
    },
    { key: KEY_DETAIL.STOCKSOUTREQUEST_IMAGES, component: jsx_stocks_out_request_images() },
    {
      key: KEY_DETAIL.STOCKSOUTREQUEST_IMAGES,
      hidden: Boolean(!stocsOutTypeSelected?.is_return_supplier),
      component: jsx_address(),
    },
    { key: KEY_DETAIL.NOTE, component: jsx_note },
  ];
  return (
    <BWAccordion isRequired title='Yêu cầu xuất kho'>
      <div className='bw_row'>{renderForm.filter((o) => !o.hidden).map((e) => e.component)}</div>
    </BWAccordion>
  );
};

StocksOutRequestDetail.propTypes = {
  disabled: PropTypes.bool,
};

export default StocksOutRequestDetail;
