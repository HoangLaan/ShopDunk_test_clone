import React, { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import { getStocksOpts, getUserOpts, getGeneralStocks, getSysUserOpts } from 'pages/StocksTransfer/helpers/call-api';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { msgError } from 'pages/StocksTransfer/helpers/msgError';
import { useParams } from 'react-router-dom';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { mapDataOptions4Select, mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { getOptionsBusiness } from 'services/business.service';
import { getList, getOptionsStore } from 'services/store.service';

import { getOptionsDepartment } from 'services/department.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { useAuth } from 'context/AuthProvider';
import { TRANSFER_TYPE } from 'pages/StocksTransfer/helpers/const';
import WrapUnregister from 'components/shared/FormZalo/WrapUnregister';
import { checkBusinessBelongsToStocks } from 'services/stocks.service';

dayjs.extend(customParseFormat);

const StocksTransferRequest = ({ disabled = false, stocksTransferId }) => {
  const methods = useFormContext();
  const { user } = useAuth();
  const { watch } = methods;
  const { id } = useParams();
  const [businessOpts, setBusinessOpts] = useState([]);
  const [departmentOpts, setDepartmentOpts] = useState([]);
  const [stocksExportOpts, setStocksExportOpts] = useState([]);
  const [stocksImportOpts, setStocksImportOpts] = useState([]);
  const [storeRequestOpts, setStoreRequestOpts] = useState([]);
  const [storeExportOpts, setStoreExportOpts] = useState([]);
  const [userExportOpts, setUserExportOpts] = useState([]);
  const [userRequestOpts, setUserRequestOpts] = useState([]);
  const [storeImportOpts, setStoreImportOpts] = useState([]);
  const [userImportOpts, setUserImportOpts] = useState([]);
  const [isOpenUserImport, setIsOpenUserImport] = useState(false);

  // Lấy danh sách cửa hàng yêu cầu
  const getStore = async (business_id) => {
    let _store = await getList({ business_id: business_id, is_active: 1 });
    _store = _store && _store?.items ? mapDataOptions4SelectCustom(_store?.items, 'store_id', 'store_name') : [];
    setStoreRequestOpts(_store);
  };

  useEffect(() => {
    if (watch('business_id')) {
      getStore(watch('business_id'));
    }
  }, [watch('business_id')]);

  const getInit = useCallback(async () => {
    try {
      // Lấy danh sách hình thức phiếu chuyển kho
      // lấy danh sách chi nhánh yêu cầu
      const _businessOpts = await getOptionsBusiness();
      // Lấy danh sách phòng ban
      const _departmentOpts = await getOptionsDepartment();
      setBusinessOpts(mapDataOptions4SelectCustom(_businessOpts));
      setDepartmentOpts(mapDataOptions4Select(_departmentOpts));
      await fetchStoreExportOpts();
      if (id) {
        // Lấy danh sách kho chuyển theo chi nhánh
        if (methods.watch('store_export_id')) {
          await getBusinessStoreExport(methods.watch('store_export_id'), {}, stocksTransferId);
        }
        // Lấy danh sách kho nhận theo chi nhánh
        if (methods.watch('store_import_id')) {
          await getStockImport(methods.watch('store_import_id'), {}, stocksTransferId);
        }
        // Lấy danh sách cửa hàng yêu cầu theo chi nhánh yêu cầu
        if (watch('business_id')) {
          await getOptionsStore({ business_id: watch('business_id') });
        }
        // lấy danh sách nhân viên chuyển
        if (methods.watch('stocks_export_id') && methods.watch('export_business_id')) {
          await fetchUserExportOpts('');
        }
        // lấy danh sách nhân viên nhận
        if (methods.watch('stocks_import_id') && methods.watch('import_business_id')) {
          fetchUserImportOpts('');
        }
      }
    } catch (error) {
      const { message } = error;
      showToast.error(message ? message : 'Lỗi vui lòng thử lại.');
    }
  }, []);

  useEffect(() => {
    getInit();
  }, [id]);

  const handleSetBusinessOption = async (business_id) => {
    methods.setValue('business_id', business_id);
    methods.clearErrors('business_id');
    // methods.setValue('store_request_id', null);
    // methods.setValue('store_import_id', null);

    // if (watch('transfer_type') === TRANSFER_TYPE.DIFF_BUSINESS) {
    //   methods.setValue('business_export_id', business_id);
    //   methods.clearErrors('business_export_id');
    // }
  };

  // danh sách cửa hàng yêu cầu
  const handleChangeStoreRequest = (store_request_id) => {
    methods.setValue('store_request_id', store_request_id);
    methods.setValue('request_user', null);
    setUserRequestOpts([]);
  };

  // lấy giá trị phòng ban
  const handleChangeDepartment = (department_id) => {
    methods.setValue('department_id', department_id);
    methods.clearErrors('department_id');
    methods.setValue('request_user', null);
  };

  // Lấy danh sách nhân viên yêu cầu
  const fetchUserRequest = async (value) => {
    return getSysUserOpts({
      department_id: methods.watch('department_id'),
      // business_id: methods.watch('business_id'),
      store_id: methods.watch('store_request_id')?.value,
      keyword: value,
    }).then((body) => {
      const _userRequestOpts = body.map((_user) => ({
        label: _user.name,
        value: _user.id,
      }));
      setUserRequestOpts(_userRequestOpts);
      return _userRequestOpts;
    });
  };

  useEffect(() => {
    if (userRequestOpts.length > 0 && userRequestOpts.find((item) => item.value === user.user_name)) {
      if (!methods.getValues('request_user')) {
        methods.setValue('request_user', user.user_name);
      }
    }
  }, [userRequestOpts]);

  useEffect(() => {
    if (methods.watch('business_id') && methods.watch('department_id')) {
      fetchUserRequest();
    }
  }, [methods.watch('business_id') && methods.watch('department_id'), methods.watch('store_request_id')]);

  // Lấy danh sách cửa hàng chuyển
  const fetchStoreExportOpts = async (value) => {
    return getList({
      search: value,
      business_id:
        watch('business_export_id') ||
        (watch('transfer_type') === TRANSFER_TYPE.SAME_BUSINESS ? watch('business_id') : null),
      is_active: 1,
    }).then((body) => {
      let _storeExportOpts = body.items.map((_store) => ({
        label: _store.store_name,
        value: _store.store_id,
        ..._store,
      }));

      const transferType = watch('transfer_type');
      if (transferType && transferType === TRANSFER_TYPE.SAME_BUSINESS) {
        const storeExportId = watch('store_import_id');
        if (storeExportId) {
          _storeExportOpts = _storeExportOpts?.filter((store) => store.store_id !== storeExportId?.value);
        }
      }

      setStoreExportOpts(_storeExportOpts);

      return _storeExportOpts;
    });
  };

  // Lấy chi nhánh cửa hàng nhập
  const getBusinessStoreExport = async (store_export = null, opts, stocksTransferId = null) => {
    methods.setValue('store_export_id', store_export);
    methods.clearErrors('store_export_id');
    // Lấy danh sách kho
    if (watch('transfer_type') !== TRANSFER_TYPE.ORIGIN_STOCKS) {
      const _stockOpts = await getStocksOpts({ store_id: store_export?.value, type_stocks: 1 });
      setStocksExportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));
    }
    if (store_export) {
      // conver array to oject
      let _storeExportOpts = [...storeExportOpts].reduce((a, v) => ({ ...a, [v.store_id]: v }), {});
      let exportBusinessId = null;
      let importBusinessId = null;
      if (_storeExportOpts[store_export?.value] && !methods.watch('is_other_business')) {
        exportBusinessId = _storeExportOpts[store_export.value]?.business_id;
        importBusinessId = _storeExportOpts[store_export.value]?.business_id;
      } else {
        exportBusinessId = _storeExportOpts[store_export.value]?.business_id;
      }
      // clear giá trị của người chuyển và kho chuyển
      if (!stocksTransferId) {
        methods.setValue('stocks_export_id', null);
        methods.setValue('export_user_id', null);
        methods.setValue('export_business_id', exportBusinessId);
        methods.setValue('import_business_id', importBusinessId);
      }
      fetchStoreImportOpts('', {}, importBusinessId);
      //lấy danh kho theo cửa hàng đã chọn
    }
  };

  useEffect(() => {
    const store_export_id = watch('store_export_id')?.value || watch('store_export_id');
    const store_import_id =
      watch('store_import_id')?.value ||
      Number(watch('store_import_id')) ||
      watch('store_id')?.value ||
      Number(watch('store_id'));
    const transfer_type = watch('transfer_type');

    const is_origin_from_stocks =
      transfer_type !== TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS && transfer_type !== TRANSFER_TYPE.ORIGIN_STOCKS;

    const is_origin_to_stocks =
      transfer_type !== TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS && transfer_type !== TRANSFER_TYPE.ORIGIN_STOCKS;

    if (store_export_id && is_origin_from_stocks) {
      getStocksOpts({ store_id: Number(store_export_id), type_stocks: 1 }).then((_stockOpts) => {
        setStocksExportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));
      });
    } else if (!is_origin_from_stocks) {
      getStocksOpts().then((_stockOpts) => {
        setStocksExportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));
      });
    }

    if (store_import_id && is_origin_to_stocks) {
      getStocksOpts({ store_id: Number(store_import_id), type_stocks: 1 }).then((_stockOpts) => {
        setStocksImportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));
      });
    } else if (!is_origin_to_stocks) {
      getStocksOpts().then((_stockOpts) => {
        setStocksImportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));
      });
    }
  }, [watch('store_export_id'), watch('store_import_id'), watch('transfer_type')]);

  const handleChangeStockExport = async (stocks_export_id) => {
    methods.setValue('stocks_export_id', stocks_export_id);
    methods.clearErrors('stocks_export_id');

    if ([TRANSFER_TYPE.ORIGIN_STOCKS, TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS].includes(watch('transfer_type'))) {
      const selectedStocks = stocksExportOpts.find((_) => _.id == stocks_export_id);

      if (selectedStocks && selectedStocks.managers?.length > 0) {
        setUserExportOpts(
          selectedStocks.managers?.map((item) => ({
            value: item.username,
            label: `${item.username} - ${item.fullname}`,
          })),
        );
        methods.setValue('export_user_id', {
          value: selectedStocks.managers[0]?.username,
          label: `${selectedStocks.managers[0]?.username} - ${selectedStocks.managers[0]?.fullname}`,
        });
      }
    }
    // lấy danh sách nhân viên thuộc cửa hàng đã chon
    await fetchUserExportOpts('', {}, stocks_export_id);
  };

  // Lấy danh sách người chuyển
  const fetchUserExportOpts = async (value, opts, stocks_export_id) => {
    return getUserOpts({
      keyword: value,
      // business_id: methods.watch('export_business_id'),
      store_id: methods.watch('store_export_id')?.value,
      stocks_id: stocks_export_id ? stocks_export_id : methods.watch('stocks_export_id'),
    }).then((body) => {
      const _userOpts = body.map((user) => ({
        label: user.name,
        value: user.id,
        // disabled: methods.watch('import_user_id')?.value == user.id ? true : false,
      }));
      setUserExportOpts(_userOpts);
      return _userOpts;
    });
  };

  // Lấy danh sách cửa hàng nhận
  const fetchStoreImportOpts = (value, opts, business_id = null) => {
    // if (watch('transfer_type') === TRANSFER_TYPE.DIFF_BUSINESS) {
    //   // nếu là Chuyển kho khác chi nhánh/tỉnh => Cửa hàng nhận ren theo chi nhánh nhận
    // }
    business_id = methods.watch('business_import_id');

    return getList({
      search: value,
      is_active: 1,
      business_id: business_id ? business_id : methods.watch('business_id'),
    }).then((body) => {
      let _storeImportOpts = body.items.map((_store) => ({
        label: _store.store_name,
        value: _store.store_id,
        ..._store,
      }));

      if (watch('transfer_type') && watch('transfer_type') === TRANSFER_TYPE.SAME_BUSINESS) {
        const storeImportId = watch('store_export_id');
        if (storeImportId) {
          _storeImportOpts = _storeImportOpts.filter((_) => _.store_id !== storeImportId?.value);
        }
      }

      setStoreImportOpts(_storeImportOpts);
      return _storeImportOpts;
    });
  };

  // Lấy danh sách cửa hàng yêu cầu
  const fetchStoreRequestOpts = (value, opts, business_id = null) => {
    return getList({
      search: value,
      is_active: 1,
      business_id: business_id ? business_id : methods.watch('business_id'),
    }).then((body) => {
      const _storeRequestOpts = body.items.map((_store) => ({
        label: _store.store_name,
        value: _store.store_id,
        ..._store,
      }));
      setStoreRequestOpts(_storeRequestOpts);
      return _storeRequestOpts;
    });
  };

  // Lấy danh sách kho nhận
  const getStockImport = async (store_import_id, opts, stocksTransferId) => {
    methods.clearErrors('store_import_id');
    methods.setValue('store_import_id', store_import_id);

    if (watch('transfer_type') === TRANSFER_TYPE.INTERNAL_STORE) {
      methods.clearErrors('store_id');
      methods.setValue('store_id', store_import_id);
      // chuyển kho cùng cửa hàng => cửa hàng chuyển trùng cửa hàng nhận
      methods.clearErrors('stre_export_id');
      methods.setValue('store_export_id', store_import_id);
    }

    // if (watch('transfer_type') === TRANSFER_TYPE.DIFF_BUSINESS) {
    //   // chuyển kho khác chi nhánh => cửa hàng yêu cầu gen từ cửa hàng nhận
    //   methods.clearErrors('store_request_id');
    //   methods.setValue('store_request_id', store_import_id);
    // }

    // conver array to oject
    if (store_import_id) {
      //lấy danh kho theo cửa hàng đã chọn
      // Lấy danh sách kho

      if (watch('transfer_type') !== TRANSFER_TYPE.ORIGIN_STOCKS) {
        const _stockOpts = await getStocksOpts({ store_id: store_import_id?.value, type_stocks: 1 });
        setStocksImportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));

        if (watch('transfer_type') === TRANSFER_TYPE.INTERNAL_STORE) {
          setStocksExportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));
        }
      }

      if (!stocksTransferId) {
        methods.setValue('import_user_id', null);
        methods.setValue('stocks_import_id', null);

        if (watch('transfer_type') === TRANSFER_TYPE.INTERNAL_STORE) {
          methods.setValue('export_user_id', null);
          methods.setValue('stocks_export_id', null);
        }
      }
      fetchUserImportOpts('');
    }
  };

  const onChangeStore = async (store_id) => {
    methods.clearErrors('store_import_id');
    methods.setValue('store_import_id', store_id);

    methods.clearErrors('store_id');
    methods.setValue('store_id', store_id);

    methods.clearErrors('stre_export_id');
    methods.setValue('store_export_id', store_id);

    if (store_id) {
      const _stockOpts = await getStocksOpts({ store_id: store_id?.value, type_stocks: 1 });
      setStocksImportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));
      setStocksExportOpts(mapDataOptions4SelectCustom(_stockOpts, 'stocks_id', 'stocks_name'));
    }

    methods.setValue('import_user_id', null);
    methods.setValue('stocks_import_id', null);
    methods.setValue('export_user_id', null);
    methods.setValue('stocks_export_id', null);

    fetchUserImportOpts('');
  };

  useEffect(() => {
    return watch('store_import_id') ||
      watch('transfer_type') === TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS ||
      watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS
      ? setIsOpenUserImport(true)
      : setIsOpenUserImport(false);
  }, [watch('store_import_id'), watch('transfer_type')]);

  // Lấy danh sách người nhận
  const fetchUserImportOpts = (value) => {
    // value return tu input
    return getUserOpts({
      keyword: value,
      // business_id: !methods.watch('is_other_business') ? methods.watch('import_business_id') : null,
      stocks_id: methods.watch('stocks_import_id')?.value,
      store_id: methods.watch('store_import_id')?.value,
    }).then((body) => {
      const _userOpts = body.map((user) => ({
        label: user.name,
        value: user.id,
        // disabled: methods.watch('export_user_id')?.value == user.id ? true : false,
      }));
      setUserImportOpts(_userOpts);
      return _userOpts;
    });
  };

  // handle transfer form
  useEffect(() => {
    if (watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS) {
      if (watch('business_import_id') && watch('stocks_export_id')) {
        checkBusinessBelongsToStocks({
          stocks_id: watch('stocks_export_id'),
          business_id: watch('business_import_id'),
        }).then((result) => {
          methods.setValue('hidden_price', result ? 1 : 0);
        });
      }
    } else if (watch('transfer_type') === TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS) {
      if (watch('business_export_id') && watch('stocks_import_id')) {
        checkBusinessBelongsToStocks({
          stocks_id: watch('stocks_import_id')?.value,
          business_id: watch('business_export_id'),
        }).then((result) => {
          methods.setValue('hidden_price', result ? 1 : 0);
        });
      }
    } else if (watch('transfer_type') === TRANSFER_TYPE.INTERNAL_STORE) {
      methods.setValue('hidden_price', 0);
    } else {
      methods.setValue('hidden_price', 1);
    }
  }, [
    watch('transfer_type'),
    watch('business_import_id'),
    watch('stocks_export_id'),
    watch('business_export_id'),
    watch('stocks_import_id'),
  ]);

  // render value of field by transfer type
  useEffect(() => {
    if (!watch('stocks_transfer_id')) {
      const transfer_type = watch('transfer_type');
      const label = `${user?.user_name} - ${user?.full_name}`;
      const value = user?.user_name;
      switch (transfer_type) {
        case TRANSFER_TYPE.INTERNAL_STORE:
          methods.setValue('request_user', {
            label,
            value,
          });
          methods.setValue('department_id', user?.department_id);
          break;
        case TRANSFER_TYPE.ORIGIN_STOCKS:
          getGeneralStocks().then((data) => {
            setStocksImportOpts(mapDataOptions4SelectCustom(data));
            setStocksExportOpts(mapDataOptions4SelectCustom(data));
          });
          methods.setValue('request_user', {
            label,
            value,
          });
          methods.setValue('department_id', user?.department_id);
          break;
        case TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS:
          getGeneralStocks().then((data) => {
            setStocksExportOpts(mapDataOptions4SelectCustom(data));
          });
          break;
        case TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS:
          getGeneralStocks().then((data) => {
            setStocksImportOpts(mapDataOptions4SelectCustom(data));
          });
          break;
        default:
      }
    }
  }, [watch('transfer_type'), watch('stocks_transfer_id')]);

  // render element by transfer type
  const RenderComponent = useCallback(
    (items) => {
      const transfer_type = watch('transfer_type');
      const matchItem = items.find((_) => _.type === transfer_type);
      return matchItem ? matchItem.component : items.find((_) => _.default)?.component;
    },
    [watch('transfer_type')],
  );

  return (
    <BWAccordion title='Yêu cầu chuyển kho' id='stocks_request' isRequired={true}>
      <div className='bw_row bw_mt_1'>
        <div className='bw_col_4'>
          <div className='bw_row'>
            {RenderComponent([
              {
                default: true,
                component: (
                  <FormItem label='Chi nhánh yêu cầu' className='bw_col_12' disabled={disabled} isRequired={true}>
                    <FormSelect
                      field='business_id'
                      id='business_id'
                      list={businessOpts}
                      allowClear={true}
                      onChange={handleSetBusinessOption}
                      validation={{
                        required: 'Chi nhánh yêu cầu là bắt buộc',
                      }}
                    />
                  </FormItem>
                ),
              },
            ])}
            {RenderComponent([
              {
                default: true,
                component: (
                  <WrapUnregister field='store_request_id'>
                    <FormItem label='Cửa hàng yêu cầu' className='bw_col_12' disabled={disabled} isRequired={true}>
                      <FormDebouneSelect
                        field='store_request_id'
                        id='store_request_id'
                        options={storeRequestOpts}
                        allowClear={true}
                        style={{ width: '100%' }}
                        validation={msgError['store_request_id']}
                        fetchOptions={fetchStoreRequestOpts}
                        debounceTimeout={500}
                        placeholder={'-- Chọn --'}
                        onChange={(value) => {
                          methods.clearErrors('store_request_id');
                          methods.setValue('store_request_id', value);
                        }}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.ORIGIN_STOCKS,
                compoennt: null,
              },
            ])}

            {RenderComponent([
              {
                default: true,
                component: (
                  <FormItem label='Phòng ban yêu cầu' className='bw_col_12' isRequired={true} disabled={disabled}>
                    <FormSelect
                      field='department_id'
                      id='department_id'
                      list={departmentOpts}
                      allowClear={true}
                      validation={msgError['department_id']}
                      onChange={handleChangeDepartment}
                    />
                  </FormItem>
                ),
              },
            ])}

            {RenderComponent([
              {
                default: true,
                component: (
                  <FormItem
                    label='Người yêu cầu'
                    className='bw_col_12'
                    isRequired={true}
                    disabled={
                      disabled ? disabled : !methods.watch('department_id') ? true : false
                      // disabled ? disabled : !methods.watch('business_id') || !methods.watch('department_id') ? true : false
                    }>
                    <FormDebouneSelect
                      field='request_user'
                      id='request_user'
                      options={userRequestOpts}
                      style={{ width: '100%' }}
                      validation={msgError['request_user']}
                      fetchOptions={fetchUserRequest}
                      debounceTimeout={500}
                      placeholder={'-- Chọn --'}
                    />
                  </FormItem>
                ),
              },
            ])}
          </div>
        </div>
        <div className='bw_col_4'>
          <div className='bw_row'>
            {RenderComponent([
              {
                type: TRANSFER_TYPE.DIFF_BUSINESS,
                component: (
                  <WrapUnregister field='business_export_id'>
                    <FormItem label='Chi nhánh chuyển' className='bw_col_12' disabled={disabled} isRequired={true}>
                      <FormSelect
                        field='business_export_id'
                        id='business_export_id'
                        list={businessOpts}
                        allowClear={true}
                        validation={{
                          required: 'Chi nhánh chuyển là bắt buộc',
                        }}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.OTHER,
                component: (
                  <WrapUnregister field='business_export_id'>
                    <FormItem label='Chi nhánh chuyển' className='bw_col_12' disabled={disabled} isRequired={true}>
                      <FormSelect
                        field='business_export_id'
                        id='business_export_id'
                        list={businessOpts}
                        allowClear={true}
                        validation={{
                          required: 'Chi nhánh chuyển là bắt buộc',
                        }}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS,
                component: (
                  <WrapUnregister field='business_export_id'>
                    <FormItem label='Chi nhánh chuyển' className='bw_col_12' disabled={disabled} isRequired={true}>
                      <FormSelect
                        field='business_export_id'
                        id='business_export_id'
                        list={businessOpts}
                        allowClear={true}
                        validation={{
                          required: 'Chi nhánh chuyển là bắt buộc',
                        }}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
            ])}

            {RenderComponent([
              {
                type: TRANSFER_TYPE.INTERNAL_STORE,
                component: (
                  <WrapUnregister field='store_id'>
                    <FormItem
                      label='Cửa hàng'
                      className='bw_col_12'
                      isRequired={true}
                      disabled={disabled || !methods.watch('business_id')}>
                      <FormDebouneSelect
                        field='store_id'
                        id='store_id'
                        options={storeImportOpts}
                        allowClear={true}
                        style={{ width: '100%' }}
                        validation={msgError['store_import_id']}
                        fetchOptions={fetchStoreImportOpts}
                        debounceTimeout={500}
                        placeholder={'-- Chọn --'}
                        onChange={onChangeStore}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
            ])}

            {RenderComponent([
              {
                default: true,
                component: (
                  <FormItem
                    label='Cửa hàng chuyển'
                    className='bw_col_12'
                    isRequired
                    disabled={disabled || !watch('business_id')}>
                    <FormDebouneSelect
                      field='store_export_id'
                      id='store_export_id'
                      options={storeExportOpts}
                      allowClear={true}
                      style={{ width: '100%' }}
                      validation={
                        watch('transfer_type') === TRANSFER_TYPE.SAME_BUSINESS ? msgError['store_export_id'] : {}
                      }
                      fetchOptions={fetchStoreExportOpts}
                      debounceTimeout={500}
                      placeholder={'-- Chọn --'}
                      onChange={getBusinessStoreExport}
                    />
                  </FormItem>
                ),
              },
              {
                type: TRANSFER_TYPE.DIFF_BUSINESS,
                component: (
                  <FormItem
                    label='Cửa hàng chuyển'
                    className='bw_col_12'
                    isRequired
                    disabled={disabled || !watch('business_export_id')}>
                    <FormDebouneSelect
                      field='store_export_id'
                      id='store_export_id'
                      options={storeExportOpts}
                      allowClear={true}
                      style={{ width: '100%' }}
                      validation={
                        watch('transfer_type') === TRANSFER_TYPE.SAME_BUSINESS ? msgError['store_export_id'] : {}
                      }
                      fetchOptions={fetchStoreExportOpts}
                      debounceTimeout={500}
                      placeholder={'-- Chọn --'}
                      onChange={getBusinessStoreExport}
                    />
                  </FormItem>
                ),
              },
              {
                type: TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS,
                component: (
                  <FormItem
                    label='Cửa hàng chuyển'
                    className='bw_col_12'
                    isRequired
                    disabled={disabled || !watch('business_export_id')}>
                    <FormDebouneSelect
                      field='store_export_id'
                      id='store_export_id'
                      options={storeExportOpts}
                      allowClear={true}
                      style={{ width: '100%' }}
                      validation={
                        watch('transfer_type') === TRANSFER_TYPE.SAME_BUSINESS ? msgError['store_export_id'] : {}
                      }
                      fetchOptions={fetchStoreExportOpts}
                      debounceTimeout={500}
                      placeholder={'-- Chọn --'}
                      onChange={getBusinessStoreExport}
                    />
                  </FormItem>
                ),
              },
              {
                type: TRANSFER_TYPE.OTHER,
                component: (
                  <FormItem
                    label='Cửa hàng chuyển'
                    className='bw_col_12'
                    isRequired
                    disabled={disabled || !watch('business_export_id')}>
                    <FormDebouneSelect
                      field='store_export_id'
                      id='store_export_id'
                      options={storeExportOpts}
                      allowClear={true}
                      style={{ width: '100%' }}
                      validation={
                        watch('transfer_type') === TRANSFER_TYPE.SAME_BUSINESS ? msgError['store_export_id'] : {}
                      }
                      fetchOptions={fetchStoreExportOpts}
                      debounceTimeout={500}
                      placeholder={'-- Chọn --'}
                      onChange={getBusinessStoreExport}
                    />
                  </FormItem>
                ),
              },
              {
                type: TRANSFER_TYPE.INTERNAL_STORE,
                component: null,
              },
              {
                type: TRANSFER_TYPE.ORIGIN_STOCKS,
                compoennt: null,
              },
              {
                type: TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS,
                compoennt: null,
              },
            ])}

            {RenderComponent([
              {
                default: true,
                component: (
                  <FormItem
                    label='Kho chuyển'
                    className='bw_col_12'
                    isRequired={true}
                    disabled={
                      disabled
                        ? disabled
                        : !(
                            methods.watch('store_export_id') ||
                            watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS ||
                            watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS
                          )
                    }>
                    <FormSelect
                      field='stocks_export_id'
                      id='stocks_export_id'
                      list={stocksExportOpts?.filter((_) => _.value !== watch('stocks_import_id')?.value) || []}
                      validation={msgError.stocks_export_id}
                      allowClear={true}
                      onChange={(value) => handleChangeStockExport(value)}
                    />
                  </FormItem>
                ),
              },
            ])}

            {RenderComponent([
              {
                default: true,
                component: (
                  <WrapUnregister field={'export_user_id'}>
                    <FormItem
                      label='Người chuyển'
                      className='bw_col_12'
                      isRequired
                      disabled={disabled ? disabled : !methods.watch('stocks_export_id')}>
                      <FormDebouneSelect
                        field='export_user_id'
                        id='export_user_id'
                        options={userExportOpts}
                        allowClear={true}
                        style={{ width: '100%' }}
                        validation={msgError['export_user_id']}
                        fetchOptions={fetchUserExportOpts}
                        debounceTimeout={500}
                        placeholder={'-- Chọn --'}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.INTERNAL_STORE,
                component: null,
              },
            ])}
          </div>
        </div>
        <div className='bw_col_4'>
          <div className='bw_row'>
            {RenderComponent([
              {
                type: TRANSFER_TYPE.DIFF_BUSINESS,
                component: (
                  <WrapUnregister field='business_import_id'>
                    <FormItem label='Chi nhánh nhận' className='bw_col_12' disabled={disabled} isRequired={true}>
                      <FormSelect
                        field='business_import_id'
                        id='business_import_id'
                        list={businessOpts}
                        onChange={(value) => {
                          methods.clearErrors('business_import_id');
                          methods.setValue('business_import_id', value);
                        }}
                        allowClear={true}
                        validation={{
                          required: 'Chi nhánh nhận là bắt buộc',
                        }}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.OTHER,
                component: (
                  <WrapUnregister field='business_import_id'>
                    <FormItem label='Chi nhánh nhận' className='bw_col_12' disabled={disabled} isRequired={true}>
                      <FormSelect
                        field='business_import_id'
                        id='business_import_id'
                        list={businessOpts}
                        onChange={(value) => {
                          methods.clearErrors('business_import_id');
                          methods.setValue('business_import_id', value);
                        }}
                        allowClear={true}
                        validation={{
                          required: 'Chi nhánh nhận là bắt buộc',
                        }}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS,
                component: (
                  <WrapUnregister field='business_import_id'>
                    <FormItem label='Chi nhánh nhận' className='bw_col_12' disabled={disabled} isRequired={true}>
                      <FormSelect
                        field='business_import_id'
                        id='business_import_id'
                        list={businessOpts}
                        onChange={(value) => {
                          methods.clearErrors('business_import_id');
                          methods.setValue('business_import_id', value);
                        }}
                        allowClear={true}
                        validation={{
                          required: 'Chi nhánh nhận là bắt buộc',
                        }}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
            ])}

            {RenderComponent([
              {
                default: true,
                component: (
                  <WrapUnregister field={'store_import_id'}>
                    <FormItem
                      label='Cửa hàng nhận'
                      className='bw_col_12'
                      isRequired={true}
                      disabled={disabled || !methods.watch('business_id')}>
                      <FormDebouneSelect
                        field='store_import_id'
                        id='store_import_id'
                        options={storeImportOpts}
                        allowClear={true}
                        style={{ width: '100%' }}
                        validation={msgError['store_import_id']}
                        fetchOptions={fetchStoreImportOpts}
                        debounceTimeout={500}
                        placeholder={'-- Chọn --'}
                        onChange={getStockImport}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.DIFF_BUSINESS,
                component: (
                  <WrapUnregister field={'store_import_id'}>
                    <FormItem
                      label='Cửa hàng nhận'
                      className='bw_col_12'
                      isRequired={true}
                      disabled={disabled || !methods.watch('business_import_id')}>
                      <FormDebouneSelect
                        field='store_import_id'
                        id='store_import_id'
                        options={storeImportOpts}
                        allowClear={true}
                        style={{ width: '100%' }}
                        validation={msgError['store_import_id']}
                        fetchOptions={fetchStoreImportOpts}
                        debounceTimeout={500}
                        placeholder={'-- Chọn --'}
                        onChange={getStockImport}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.ORIGIN_STOCKS_TO_BUSINESS,
                component: (
                  <WrapUnregister field={'store_import_id'}>
                    <FormItem
                      label='Cửa hàng nhận'
                      className='bw_col_12'
                      isRequired={true}
                      disabled={disabled || !methods.watch('business_import_id')}>
                      <FormDebouneSelect
                        field='store_import_id'
                        id='store_import_id'
                        options={storeImportOpts}
                        allowClear={true}
                        style={{ width: '100%' }}
                        validation={msgError['store_import_id']}
                        fetchOptions={fetchStoreImportOpts}
                        debounceTimeout={500}
                        placeholder={'-- Chọn --'}
                        onChange={getStockImport}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.OTHER,
                component: (
                  <WrapUnregister field={'store_import_id'}>
                    <FormItem
                      label='Cửa hàng nhận'
                      className='bw_col_12'
                      isRequired={true}
                      disabled={disabled || !methods.watch('business_import_id')}>
                      <FormDebouneSelect
                        field='store_import_id'
                        id='store_import_id'
                        options={storeImportOpts}
                        allowClear={true}
                        style={{ width: '100%' }}
                        validation={msgError['store_import_id']}
                        fetchOptions={fetchStoreImportOpts}
                        debounceTimeout={500}
                        placeholder={'-- Chọn --'}
                        onChange={getStockImport}
                      />
                    </FormItem>
                  </WrapUnregister>
                ),
              },
              {
                type: TRANSFER_TYPE.INTERNAL_STORE,
                component: null,
              },
              {
                type: TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS,
                component: null,
              },
              {
                type: TRANSFER_TYPE.ORIGIN_STOCKS,
                component: null,
              },
            ])}

            {RenderComponent([
              {
                default: true,
                component: (
                  <FormItem
                    label='Kho nhận'
                    className='bw_col_12'
                    isRequired={true}
                    disabled={
                      disabled
                        ? disabled
                        : !(
                            methods.watch('store_import_id') ||
                            watch('transfer_type') === TRANSFER_TYPE.BUSINESS_TO_ORIGIN_STOCKS ||
                            watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS
                          )
                    }>
                    <FormDebouneSelect
                      field='stocks_import_id'
                      id='stocks_import_id'
                      options={stocksImportOpts?.filter((_) => _.value !== watch('stocks_export_id')) || []}
                      allowClear={true}
                      style={{ width: '100%' }}
                      validation={msgError['stocks_import_id']}
                      fetchOptions={fetchStoreExportOpts}
                      debounceTimeout={500}
                      placeholder={'-- Chọn --'}
                      onChange={(stock) => {
                        methods.clearErrors('stocks_import_id');
                        methods.setValue('stocks_import_id', stock);
                        if (watch('transfer_type') === TRANSFER_TYPE.ORIGIN_STOCKS) {
                          const selectedStock = stocksImportOpts?.find((_) => _.id == stock?.value);

                          if (selectedStock && selectedStock.managers?.length > 0) {
                            setUserImportOpts(
                              selectedStock.managers?.map((item) => ({
                                value: item.username,
                                label: `${item.username} - ${item.fullname}`,
                              })),
                            );
                            methods.setValue('import_user_id', {
                              value: selectedStock.managers[0]?.username,
                              label: `${selectedStock.managers[0]?.username} - ${selectedStock.managers[0]?.fullname}`,
                            });
                          }
                        }
                      }}
                    />
                  </FormItem>
                ),
              },
            ])}

            {RenderComponent([
              {
                default: true,
                component: (
                  <FormItem
                    label='Người nhận'
                    className='bw_col_12'
                    isRequired={true}
                    disabled={disabled || !isOpenUserImport || !watch('stocks_import_id')}>
                    <FormDebouneSelect
                      field='import_user_id'
                      id='import_user_id'
                      options={userImportOpts}
                      allowClear={true}
                      style={{ width: '100%' }}
                      validation={msgError['import_user_id']}
                      fetchOptions={fetchUserImportOpts}
                      debounceTimeout={500}
                      placeholder={'-- Chọn --'}
                    />
                  </FormItem>
                ),
              },
            ])}
          </div>
        </div>

        <FormItem label='Ghi chú' className='bw_col_12' disabled={disabled}>
          <FormInput type='text' field='description' placeholder='Ghi chú phiếu chuyển kho' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default StocksTransferRequest;
