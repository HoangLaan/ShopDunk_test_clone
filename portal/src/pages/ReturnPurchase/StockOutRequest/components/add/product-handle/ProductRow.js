import React, { Fragment, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import ProductImeiModal from 'pages/StocksOutRequest/components/add/modal/ProductImeiModal';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import _ from 'lodash';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import { useLocation } from 'react-router-dom';
import { getProductOptionsDeboune } from 'services/stocks-out-request.service';
import { useFormContext } from 'react-hook-form';
import { formatQuantity } from 'utils/number';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { useEffect } from 'react';

const ImeiCode = styled.span`
  width: 100%;
  display: block;
  cursor: pointer;
  pointer-events: ${(p) => (p.nonpoint ? 'none' : '')};
`;

const BarCode = styled.div`
  display: flex;
  justify-content: center;
`;

const ProductRow = ({ keyProduct, indexProduct, disabled, isAddPage, isTransferDiffBusiness }) => {
  const { pathname } = useLocation();
  const methods = useFormContext();
  const { watch } = methods;
  const [openModal, setOpenModal] = useState(false);
  const isView = useMemo(() => pathname.includes('/detail'), [pathname]);
  const field = useMemo(() => `product_list.${keyProduct}`, [keyProduct]);
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);
  const [debtAccountingAccountOpts, setDebtAccountingAccountOpts] = useState([]);

  useEffect(() => {
    getCreditAccountOpts().then((data) => {
      setCreditAccountingAccountOpts(mapDataOptions4SelectCustom(data));
    });
    getDeptAccountOpts().then((data) => {
      setDebtAccountingAccountOpts(mapDataOptions4SelectCustom(data));
    });
  }, []);

  useEffect(() => {
    if (isAddPage) {
      const acc1561 = creditAccountingAccountOpts?.find((_) => _.label === '1561');
      methods.setValue(`${field}.credit_account_id`, methods.watch(`${field}.credit_account_id`) || acc1561?.id);
      const acc331 = debtAccountingAccountOpts?.find((_) => _.label === '331');
      methods.setValue(`${field}.debt_account_id`, methods.watch(`${field}.debt_account_id`) || acc331?.id);
    }
  }, [creditAccountingAccountOpts, isAddPage]);

  const from_stocks_id = methods.watch('from_stocks_id');
  const loadProduct = useCallback(
    (value) => {
      const productIds = Object.values(watch('product_list') || {})
        ?.map((_) => _.product_id)
        ?.filter((_) => _);
      const materailIds = Object.values(watch('product_list') || {})
        ?.map((_) => _.material_id)
        ?.filter((_) => _);

      // value return tu input
      return getProductOptionsDeboune({
        key_word: value,
        stocks_id: from_stocks_id,
      }).then((body) => {
        return body
          ?.filter((item) =>
            item.product_id
              ? !productIds.includes(item.product_id)
              : item.material_id
              ? !materailIds.includes(item.material_id)
              : true,
          )
          ?.map((_) => {
            if (methods.watch) {
              return {
                label: _.product_name || _.material_name,
                value: _.product_id || _.material_id,

                material_id: _.material_id,
                product_id: _.product_id,

                product_code: _.product_code,
                material_code: _.material_code,
                total_product: _.total_product,
                unit_name: _?.unit_name,
                debt_account_id: _?.debt_account_id,
              };
            }
          });
      });
    },
    [from_stocks_id, watch('product_list')],
  );

  const lengthImei = methods.watch(`${field}.list_imei`)?.length;
  const quantity = methods.watch(`${field}.quantity`);

  const jsx_barcode = useMemo(() => {
    if (lengthImei) {
      return (
        <ImeiCode
          className='bw_text_center'
          onClick={() => {
            setOpenModal(true);
          }}>
          <span style={{ color: 'red' }}>{lengthImei}</span>/<span style={{ color: 'blue' }}>{quantity}</span>
        </ImeiCode>
      );
    } else {
      return (
        <BarCode>
          <a
            onClick={() => {
              if (methods.watch(`${field}.quantity`)) {
                setOpenModal(true);
              } else {
                showToast.warning('Vui lòng nhập số lượng trước khi chọn imei', {
                  position: 'top-right',
                  autoClose: 5000,
                  closeOnClick: true,
                  pauseOnHover: true,
                  theme: 'colored',
                });
              }
            }}
            className='bw_btn_outline bw_btn_add_imei'>
            <span className='fi fi-rr-barcode'></span>
          </a>
        </BarCode>
      );
    }
  }, [lengthImei, setOpenModal, quantity]);

  const jsx_imei = useMemo(() => {
    const _renderImei = () => {
      if (lengthImei > 0) {
        return methods.watch(`${field}.list_imei`).map((e, index) => (
          <Fragment key={index}>
            {e?.product_imei_code || e?.material_imei_code} <br></br>
          </Fragment>
        ));
      } else {
        return 'Imei trống';
      }
    };
    return <div className='bw_text_center'>{_renderImei()}</div>;
  }, [lengthImei]);

  const checkShowCode =
    methods.watch(`${field}.product_code`) ||
    methods.watch(`${field}.material_code`) ||
    methods.watch(`${field}.label`);

  return (
    <tr>
      <td className='bw_sticky bw_check_sticky'>{indexProduct + 1}</td>
      {checkShowCode ? (
        <Fragment>
          <td>
            <span>{methods.watch(`${field}.product_code`) || methods.watch(`${field}.material_code`)}</span>
          </td>
          <td>
            <span>{methods.watch(`${field}.label`)}</span>
          </td>
        </Fragment>
      ) : (
        <td colSpan={2}>
          <FormDebouneSelect
            bordered
            fetchOptions={loadProduct}
            onChange={(_, q) => {
              try {
                methods.setValue(field, Object.assign(methods.watch(field), q));
              } catch (error) {}
            }}
          />
        </td>
      )}

      <td>{isView ? jsx_imei : jsx_barcode}</td>
      <td>
        <FormSelect
          style={{ minWidth: '140px' }}
          bordered
          disabled={disabled}
          list={debtAccountingAccountOpts}
          field={`${field}.debt_account_id`}
        />
      </td>
      <td>
        <FormSelect
          style={{ minWidth: '140px' }}
          bordered
          disabled={disabled}
          list={creditAccountingAccountOpts}
          field={`${field}.credit_account_id`}
        />
      </td>
      <td className=''>{methods.watch(`${field}.unit_name`)}</td>
      <td className='bw_text_center'>
        <FormNumber
          min={1}
          disabled={disabled || !checkShowCode}
          max={parseInt(methods.watch(`${field}.total_product`))}
          field={`${field}.quantity`}
        />
      </td>
      <td className='bw_hiden'>
        <input type='number' className='bw_inp bw_mw_2' value='0' />
      </td>
      {isTransferDiffBusiness ? (
        <>
          <td className='bw_text_right'>{formatQuantity(methods.watch(`${field}.price`))}</td>
          <td className='bw_text_right'>{formatQuantity(methods.watch(`${field}.total_money`))}</td>
        </>
      ) : (
        <></>
      )}
      <td>
        <FormItem disabled={disabled}>
          <FormInput bordered style={{ minWidth: '200px' }} disabled={disabled} field={`${field}.note`} />
        </FormItem>
      </td>
      {!disabled && (
        <td className='bw_sticky bw_action_table bw_text_center'>
          <a className='bw_btn_table bw_delete bw_red'>
            <i
              onClick={() => {
                const value = { ...methods.watch('product_list') };
                delete value[keyProduct];
                methods.setValue('product_list', value);
              }}
              className='fi fi-rr-trash'></i>
          </a>
        </td>
      )}

      {openModal && (
        <ProductImeiModal
          maxSelect={parseInt(methods.watch(`${field}.quantity`))}
          field={field}
          productId={methods.watch(`${field}.product_id`)}
          materialId={methods.watch(`${field}.material_id`)}
          stocksId={methods.watch('from_stocks_id')}
          onClose={() => {
            setOpenModal(false);
          }}
        />
      )}
    </tr>
  );
};

export default ProductRow;
