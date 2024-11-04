import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { showToast } from 'utils/helpers';
import { InputNumber } from 'antd';

import DataTable from 'components/shared/DataTable/index';
import { formatPrice } from 'utils/index';
import { showConfirmModal } from 'actions/global';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import { msgError } from 'pages/Prices/helpers/msgError';
import { changePriceMultiProduct } from 'pages/Prices/helpers/call-api';
import { checkProductType } from '../contain/contain';

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf('day');
};

const AdjustmentPricesModel = ({ open, onClose, onConfirm, dataSelect = [], productType, setCheckDelete }) => {
  const dispatch = useDispatch();

  const [priceData, setPriceData] = useState(dataSelect);

  useEffect(() => {
    setPriceData(dataSelect);
  }, []);

  const changeTypeOptions = [
    { id: 1, name: 'Theo tiền', label: 'Theo tiền', value: 1 },
    { id: 2, name: 'Theo %', label: 'Theo %', value: 2 },
  ];

  const methods = useForm({
    defaultValues: { change_type_id: 1, is_increase: 1 },
  });

  // set dữ liệu mới cho danh sách sản phẩm
  const handleDelete = (price_id) => {
    let _dataSelect = priceData.reduce((a, v) => ({ ...a, [v.price_id]: v }), {});
    // Lấy ra vị của sản phẩm
    if (price_id && _dataSelect[price_id]) {
      delete _dataSelect[price_id];
    }
    setPriceData(Object.values(_dataSelect));
  };

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p, idx) => <b style={{ left: '0px' }}>{idx + 1}</b>,
      },
      {
        header: 'Mã Imei',
        accessor: 'product_imei',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        hidden: productType * 1 !== checkProductType[1],
        disabled: true,
        formatter: (p) => {
          return p?.product_imei ? <b className='bw_sticky bw_name_sticky'>{p?.product_imei}</b> : null;
        },
      },
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        disabled: true,
        formatter: (p) => {
          return p?.product_imei ? (
            <b>{p?.product_code}</b>
          ) : (
            <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>
          );
        },
      },

      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        accessor: 'product_name',
      },
      {
        header: 'Ngành hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'category_name',
      },
      {
        header: 'Nhà sản xuất',
        classNameHeader: 'bw_text_center',
        accessor: 'manufacturer_name',
      },
      {
        header: 'Loại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'product_type',
        formatter: (p) => {
          if (p?.product_type === 2) {
            return <span className='bw_label bw_label_success'>Linh kiện</span>;
          } else {
            return <span className='bw_label bw_label_danger'>Sản phẩm</span>;
          }
        },
      },

      {
        header: 'Đơn vị tính',
        classNameHeader: 'bw_text_center',
        accessor: 'unit_name',
      },
      {
        header: 'Giá trước điều chỉnh',
        accessor: 'price_vat',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          return <span className='bw_label bw_label_success'>{formatPrice(p?.price_vat, true, ',')}</span>;
        },
      },
      {
        header: 'Giá sau điều chỉnh',
        classNameHeader: 'bw_text_center',
        accessor: 'change_price',
        formatter: (p) => {
          return (
            <InputNumber
              controls={false}
              style={{ width: '100%', padding: '0px 8px' }}
              value={p?.change_price}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              onChange={(value) => changePriceOnList(value, p?.price_id)}
              placeholder='Giá sau điều chỉnh'
              disabled={!methods.watch('is_edit_prices')}
            />
          );
        },
      },
    ],
    [dataSelect],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SL_PRICES_EDIT',
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p?.price_id);
            }),
          ),
      },
    ];
  }, [dataSelect]);

  const hangeChangePrices = (value) => {
    let _value = value;

    if (methods.watch('change_type_id') == 2 && _value > 100) {
      _value = 100;
    }

    methods.setValue('change_value', _value);

    let _priceData = priceData;
    // tăng giá và theo tiền
    if (1 * methods.watch('is_increase') == 1 && 1 * methods.watch('change_type_id') == 1) {
      Object.keys(_priceData).forEach((key) => {
        _priceData[key].change_price = _priceData[key].price_vat + 1 * _value;
        // lưu tổng giá trị thay đổi
        _priceData[key].new_change_value = _priceData[key].change_value + 1 * _value;
        _priceData[key].base_price = _priceData[key].base_price + 1 * _value;
      });
    }

    // tăng giá và theo %
    if (1 * methods.watch('is_increase') == 1 && 1 * methods.watch('change_type_id') == 2) {
      Object.keys(_priceData).forEach((key) => {
        _priceData[key].change_price = _priceData[key].price_vat + ((1 * _value) / 100) * _priceData[key].price_vat;
        // lưu tổng giá trị thay đổi
        _priceData[key].new_change_value = _priceData[key].change_value + 1 * _value * _priceData[key].price_vat;
        _priceData[key].base_price = _priceData[key].base_price + 1 * _value * _priceData[key].price_vat;
      });
    }

    // giảm giá và theo tiền
    if (1 * methods.watch('is_reduce') == 1 && 1 * methods.watch('change_type_id') == 1) {
      Object.keys(_priceData).forEach((key) => {
        _priceData[key].change_price = _priceData[key].price_vat - 1 * _value;
        // lưu tổng giá trị thay đổi
        _priceData[key].new_change_value = _priceData[key].change_value - 1 * _value;
        _priceData[key].base_price = _priceData[key].base_price - 1 * _value;
        if (_priceData[key].change_price <= 0) {
          _priceData[key].change_price = 0;
          _priceData[key].base_price = _priceData[key].price;
        }
      });
    }

    // giảm giá và theo %
    if (1 * methods.watch('is_reduce') == 1 && 1 * methods.watch('change_type_id') == 2) {
      Object.keys(_priceData).forEach((key) => {
        _priceData[key].change_price = _priceData[key].price_vat - ((1 * _value) / 100) * _priceData[key].price_vat;
        // lưu tổng giá trị thay đổi
        _priceData[key].new_change_value =
          _priceData[key].change_value - ((1 * _value) / 100) * _priceData[key].price_vat;
        _priceData[key].base_price = _priceData[key].base_price - 1 * _value * _priceData[key].price_vat;
        if (_priceData[key].change_price <= 0) {
          _priceData[key].change_price = 0;
          _priceData[key].base_price = _priceData[key].price;
        }
      });
    }

    setPriceData(_priceData);
  };

  const changePriceOnList = (value, price_id) => {
    let list_price = priceData.reduce((a, v) => ({ ...a, [v.price_id]: v }), {});

    list_price[price_id].change_value = value - list_price[price_id].price;
    list_price[price_id].change_price = value;

    setPriceData(Object.values(list_price));
  };

  const onSubmit = async (value) => {
    try {
      const params = {
        ...value,
        list_price: priceData,
      };

      await changePriceMultiProduct(params);
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

      setCheckDelete(false);
      onConfirm();
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
    }
  };

  useEffect(() => {
    if (methods.watch('is_edit_prices')) {
      methods.setValue('change_value', 0);
      hangeChangePrices(0);
    }
  }, [methods.watch('is_edit_prices')]);

  ///zone handle scroll effect for header position

  const styleModal = { marginLeft: '300px' };

  const headerStyles = {
    backgroundColor: 'white',
    borderBottom: '#ddd 1px solid',
    position: 'sticky',
    marginTop: '-20px',
    zIndex: '1',
    top: '-2rem',
    width: '55rem',
    marginLeft: '-20px',
    height: '4rem',
    zIndex: 2,
  };
  const titleModal = {
    marginLeft: '2rem',
    marginTop: '1rem',
  };
  const closeModal = {
    marginRight: '2rem',
    marginTop: '1rem',
  };
  ////end zone

  return (
    <React.Fragment>
      <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_notice_del'>
        <div className='bw_modal_container bw_w900' style={styleModal}>
          <div className='bw_title_modal' style={headerStyles}>
            <h3 style={titleModal}>Điều chỉnh giá</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose} style={closeModal}></span>
          </div>
          <div className='bw_main_modal bw_border_top'>
            <div className='bw_row'>
              <div className='bw_col_12 bw_mt_1' style={{ overflowX: 'auto', maxHeight: '60vh' }}>
                <FormProvider {...methods}>
                  <div className='bw_row'>
                    <FormItem
                      label='Nhập tăng/giảm giá'
                      className='bw_col_6 '
                      isRequired={true}
                      disabled={methods.watch('is_edit_prices')}>
                      <div className='bw_flex bw_align_items_center bw_lb_sex bw_sex_group'>
                        <label className='bw_radio'>
                          <input
                            type='radio'
                            name='is_increase'
                            checked={methods.watch('is_increase')}
                            onChange={({ target: { checked } }) => {
                              methods.setValue('is_reduce', checked ? false : true);
                              methods.setValue('is_increase', checked);
                            }}
                          />
                          <span></span>
                          Tăng giá
                        </label>
                        <label className='bw_radio'>
                          <input
                            type='radio'
                            name='is_reduce'
                            checked={methods.watch('is_reduce')}
                            onChange={({ target: { checked } }) => {
                              methods.setValue('is_reduce', checked);
                              methods.setValue('is_increase', checked ? false : true);
                            }}
                          />
                          <span></span>
                          Giảm giá
                        </label>
                      </div>
                    </FormItem>

                    <FormItem label='Thời gian áp dụng' className='bw_col_6' isRequired={true}>
                      <FormRangePicker
                        fieldStart={'start_date'}
                        fieldEnd={'end_date'}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        format={'DD/MM/YYYY'}
                        allowClear={true}
                        style={{ width: '100%' }}
                        validation={{
                          required: 'Thời gian áp dụng là bắt buộc',
                        }}
                        disabledDate={disabledDate}
                      />
                    </FormItem>
                    <FormItem
                      label='Giá trị tăng/giảm'
                      className='bw_col_12'
                      isRequired={true}
                      disabled={methods.watch('is_edit_prices')}>
                      <div className='bw_row'>
                        <div className='bw_col_3'>
                          <FormSelect
                            id='change_type_id'
                            field='change_type_id'
                            placeholder='-- Chọn --'
                            list={changeTypeOptions}
                          />
                        </div>
                        <div className='bw_col_9'>
                          <FormNumber
                            style={{ border: 'solid 0.1px', width: '100%', borderRadius: '5px' }}
                            field='change_value'
                            placeholder='Giá trị tăng/giảm là bắt buộc'
                            bordered={false}
                            validation={{
                              required: !methods.watch('is_edit_prices') && 'Thời gian áp dụng là bắt buộc',
                              validate: (p) => {
                                if (p <= 0 && !methods.watch('is_edit_prices')) {
                                  return 'Giá trị tăng/giảm phải lớn hơn 0';
                                }
                              },
                            }}
                            addonAfter={methods.watch('change_type_id') === 1 ? 'đ' : '%'}
                            onChange={(value) => hangeChangePrices(value)}
                          />
                        </div>
                      </div>
                    </FormItem>
                    <div className='bw_col_12'>
                      <div className='bw_frm_box'>
                        <div className='bw_flex bw_align_items_center bw_lb_sex'>
                          <label className='bw_checkbox'>
                            <FormInput type='checkbox' field='is_edit_prices' value={methods.watch('is_edit_prices')} />
                            <span />
                            Nhập trực tiếp
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormProvider>

                <h3 style={{ fontWeight: 700 }}>Thông tin sản phẩm</h3>
                <DataTable
                  columns={columns}
                  actions={actions}
                  data={priceData}
                  hiddenDeleteClick={true}
                  noSelect={true}
                  noPaging={true}
                />
              </div>
            </div>
          </div>
          <div className='bw_footer_modal'>
            <BWButton
              type='success'
              submit
              icon='fi fi-rr-check'
              content={'Lưu giá điều chỉnh'}
              onClick={methods.handleSubmit(onSubmit)}
            />

            <BWButton type='danger' outline content='Đóng' onClick={onClose} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

AdjustmentPricesModel.propTypes = {
  open: PropTypes.bool,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.node,
};

export default AdjustmentPricesModel;
