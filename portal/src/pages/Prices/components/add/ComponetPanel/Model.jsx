import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert } from 'antd';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import { showConfirmModal } from 'actions/global';

import { msgError } from 'pages/Prices/helpers/msgError';
import CheckAccess from 'navigation/CheckAccess';
import { useDispatch } from 'react-redux';
import { checkProductType } from '../../contain/contain';

const Model = ({ id, title, disabled, paramHidden }) => {
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
        formatter: (p) => <b>{p?.product_code}</b>,
      },
      {
        header: 'Tên sản phẩm / Model',
        formatter: (p) => <span>{p?.product_name}</span>,
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
        {methods.watch('product_list') && Object.values(methods.watch('product_list')).length > 1 ? (
          <td className='bw_sticky bw_action_table bw_text_center'>
            <CheckAccess permission={['SL_PRICES_ADD', 'SL_PRICES_EDIT']}>
              <a
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    dispatch(
                      showConfirmModal(msgError['model_error'], async () => {
                        handleDelete('product_list', valueRender?.product_id);
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
        {errors['product_list'] && <Alert type={'error'} message={errors['product_list']?.message} showIcon />}

        <div className='bw_table_responsive bw_mt_1'>
          <table className='bw_table'>
            <thead>
              {columns?.map((p, idx) => (
                 !p?.hidden ?
                  <th key={idx} className={p?.classNameHeader} style={p?.styleHeader}>
                    {p?.header}
                  </th> : null
              ))}
              {methods.watch('product_list') && Object.values(methods.watch('product_list')).length > 1 ? (
                <th className='bw_sticky bw_action_table bw_text_center' style={{ width: '7%' }}>
                  Thao tác
                </th>
              ) : null}
            </thead>
            <tbody>
              {methods.watch('product_list') && Object.values(methods.watch('product_list')).length ? (
                Object.values(methods.watch('product_list'))?.map((value, key) => {
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

export default Model;
