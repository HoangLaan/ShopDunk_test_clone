import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert } from 'antd';

//compnents
import { showConfirmModal } from 'actions/global';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { msgError } from 'pages/Prices/helpers/msgError';
import CheckAccess from 'navigation/CheckAccess';
import { useDispatch } from 'react-redux';

const ModelAttribute = ({ id, title, disabled }) => {
  const methods = useFormContext();

  const {
    formState: { errors },
  } = methods;

  const dispatch = useDispatch();

  const handleDelete = (key = '', keyValue = '') => {
    let _ojectValue = methods.watch(`${key}`);

    if (_ojectValue[`key${keyValue}`]) {
      delete _ojectValue[`key${keyValue}`];
    }
    // lưu giá trị thay đổi
    methods.setValue(`${key}`, _ojectValue);
  };

  const handleChangeBasePricesModel = async (_prices = 0, productId = '0') => {
    let cloneModelAttr = structuredClone(methods.watch('model_attribute_list'));
    const cloneOutputTypeDetail = structuredClone(methods.watch('outputTypeDetail'));
    const base_price = _prices;

    let price_vat = base_price;
    if (cloneOutputTypeDetail) {
      // Kiểm tra xem nếu như giá hình thức xuất có VAT
      const vatValue = cloneOutputTypeDetail?.vat_value * 1;

      if (vatValue) {
        let numberAbide = Number(base_price) * (100 + vatValue);
        price_vat = Math.round(numberAbide / 100);
      } else {
        price_vat = base_price;
      }
    }

    cloneModelAttr[productId].price = base_price;
    cloneModelAttr[productId].price_vat = price_vat;

    methods.setValue('model_attribute_list', cloneModelAttr);
  };


  const columns = useMemo(
    () => [
      {
        header: 'STT',
        styleHeader: { width: 100 },
        classNameHeader: ' bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => <b className='bw_sticky bw_name_sticky'>{idx + 1}</b>,
      },
      {
        header: 'Mã sản phẩm / Model',
        classNameHeader: 'bw_w2',
        formatter: (p) => <b>{p?.model_code}</b>,
      },
      {
        header: 'Tên Model',
        formatter: (p) => <span>{p?.model_name}</span>,
      },
      {
        header: 'Thuộc Tính',
        // formatter: (p) => <span>{p?.product_attribute}</span>,
        formatter: (p) => {
          return (
            <div className='text-center'>
              {
                !p?.product_attribute ? 'Chưa xác định' :
                ((p?.product_attribute || '').split('-') || []).map((stock , index)=>{
                  return(
                    <ul>
                      <li>
                        {stock}
                      </li>
                    </ul>
                  )
                })
              }
            </div>
          )
        }
      },
      {
        header: 'Nhập giá',
        accessor: 'prices',
        formatter: (p) => {
          return (
          <FormItem hiddenLabel={true}>
            <FormNumber
              placeholder='Giá bán'
              onChange={(value) => handleChangeBasePricesModel(value, p?.product_id)}
              value={p?.price ?? 0}
              bordered={false}
              validation={{
                required: 'Giá bán là bắt buộc',
                min: {
                  value: 0,
                },
              }}
            />
          </FormItem>)
        }
      },
      {
        header: 'Nhập giá',
        accessor: 'prices',
        formatter: (p) => {
          return (
          <FormItem hiddenLabel={true} disabled={true}>
            <FormNumber
              placeholder='Giá bán có VAT'
              value={p?.price_vat ?? 0}
              bordered={false}
              validation={{
                required: 'Giá bán có VAT là bắt buộc',
                min: {
                  value: 1,
                  message: 'Giá bán có VAT phải lớn hơn 0',
                },
              }}
            />
          </FormItem>)
        }
      },
    ],
    [],
  );

  const renderData = useCallback(
    (valueRender, keyRender) => (
      <tr>
        {columns?.map((column, key) => {
          if (!column.hidden) {
          if (column.formatter) {
            return (
              <td className={column?.classNameBody} style={column?.styleBody} key={`${keyRender}${key}`}>
                {column?.formatter(valueRender, keyRender)}
              </td>
            );
          } else if (column.accessor) {
            return (
              <td className={column?.classNameBody} style={column?.styleBody} key={`${keyRender}${key}`}>
                {valueRender[column.accessor]}
              </td>
            );
          } else {
            return <td className={column?.classNameBody} style={column?.styleBody} key={`${keyRender}${key}`}></td>;
          }
        }})}
        {methods.watch('model_attribute_list') && Object.values(methods.watch('model_attribute_list')).length > 1 ? (
          <td className='bw_sticky bw_action_table bw_text_center'>
            <CheckAccess permission={['SL_PRICES_ADD', 'SL_PRICES_EDIT']}>
              <a
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    dispatch(
                      showConfirmModal(msgError['model_error'], async () => {
                        handleDelete('model_attribute_list', valueRender?.product_id);
                      }),
                    );
                  }
                }}
                style={{
                  marginRight: '2px',
                }}
                className={`bw_btn_table bw_red`}>
                <i className={`fi fi-rr-trash`}></i>
              </a>
            </CheckAccess>
          </td>
        ) : null}
      </tr>
    ),
    [columns],
  );

  return (
    <React.Fragment>
        {errors['model_attribute_list'] && <Alert type={'error'} message={errors['model_attribute_list']?.message} showIcon />}

        <div className='bw_table_responsive bw_mt_1'>
          <table className='bw_table'>
            <thead>
              {columns?.map((p, idx) => (
                 !p?.hidden ?
                  <th key={idx} className={p?.classNameHeader} style={p?.styleHeader}>
                    {p?.header}
                  </th> : null
              ))}
              {methods.watch('model_attribute_list') && Object.values(methods.watch('model_attribute_list')).length > 1 ? (
                <th className='bw_sticky bw_action_table bw_text_center' style={{ width: '7%' }}>
                  Thao tác
                </th>
              ) : null}
            </thead>
            <tbody>
              {methods.watch('model_attribute_list') && Object.values(methods.watch('model_attribute_list')).length ? (
                Object.values(methods.watch('model_attribute_list'))?.map((value, key) => {
                  return renderData(value, key);
                })
              ) : (
                <tr>
                  <td colSpan={8} className='bw_text_center'>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </React.Fragment>
  );
};

export default ModelAttribute;
