import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { getListExchangePointApplyOnOrder } from 'services/member-point.service';
import { formatPrice } from 'utils';
import { mapDataOptions4Select } from 'utils/helpers';

const ExchangePointApply = ({ disabled, updateTotalMoney }) => {
  const methods = useFormContext();
  const [exchangePoint, setExchangePoint] = useState([]);
  const discount_value = methods.watch('discount_value') || 0;
  const discount_coupon = methods.watch('discount_coupon') || 0;
  const products = methods.watch('products');
  const member_id = methods.watch('member_id');
  const store_id = methods.watch('store_id');
  const expoint_id = methods.watch('expoint_id');
  const expoint_value = methods.watch('expoint_value') || 0;
  const use_point = methods.watch('use_point') || 0;
  const current_point = methods.watch('current_point') || 0;

  const loadExchangePointApply = useCallback(() => {
    let productIds = [];
    const products_ = Object.values(products || {});
    if (products_.length > 0 && member_id) {
      products_.forEach((product) => {
        productIds.push(product.product_id);
      });

      getListExchangePointApplyOnOrder({ product_ids: productIds, member_id, store_id })
        .then(setExchangePoint)
        .catch((err) => {});
    }
  }, [products, member_id, store_id]);

  useEffect(() => {
    methods.register('expoint_value');
  }, [methods]);

  useEffect(loadExchangePointApply, [loadExchangePointApply]);

  const handleChangeUseExpoint = (value) => {
    methods.clearErrors('use_point');
    methods.setValue('use_point', value);
    let discount = 0;
    if (value) {
      const exchangePointApply = exchangePoint.find((item) => item.expoint_id === expoint_id);
      if (exchangePointApply) {
        discount = Math.round((parseInt(value) / exchangePointApply.point) * exchangePointApply.value);
      }
    }
    methods.setValue('expoint_value', discount);

    updateTotalMoney(discount_value, discount_coupon, discount);
  };

  const maxPoint = useMemo(() => {
    const exchangePointApply = exchangePoint.find((item) => item.expoint_id === expoint_id);
    if (exchangePointApply) {
      const max_expoint = exchangePointApply.max_expoint || 0;

      if (max_expoint <= 0) return current_point;

      return current_point < exchangePointApply.max_expoint ? current_point : exchangePointApply.max_expoint;
    }
    return 0;
  }, [expoint_id, exchangePoint, current_point]);

  return (
    <div className='bw_row'>
      <div className='bw_col_6 bw_collapse_title'>
        <h3>Áp dụng tiêu điểm</h3>
      </div>
      <div className='bw_col_6'>
        {exchangePoint?.length > 0 ? (
          <Fragment>
            <FormSelect
              bordered
              disabled={disabled}
              list={mapDataOptions4Select(exchangePoint, 'expoint_id', 'expoint_name')}
              field={'expoint_id'}
              showSearch
              allowClear
              validation={{
                required: false,
                validate: {
                  minPoint: (value) => {
                    if (value) {
                      if (!disabled) {
                        const exchangePointApply = exchangePoint.find((item) => item.expoint_id === value);
                        if (exchangePointApply && exchangePointApply?.point > current_point) {
                          return 'Điểm hiện tại của KH nhỏ hơn điểm tối thiểu của chương trình tiêu điểm';
                        }
                      }
                    }
                    return true;
                  },
                },
              }}
              onChange={(value) => {
                methods.clearErrors('expoint_id');
                methods.setValue('expoint_id', value);
                methods.setValue('expoint_value', 0);
                methods.setValue('use_point', 0);
                updateTotalMoney(discount_value, discount_coupon, 0);
              }}
            />
          </Fragment>
        ) : (
          <span>Không có chương trình tiêu điểm phù hợp</span>
        )}
      </div>
      {exchangePoint?.length > 0 && expoint_id && (
        <Fragment>
          <div className='bw_col_6 bw_collapse_title'>
            <h3>Số điểm sử dụng:</h3>
          </div>
          <div className='bw_col_6'>
            <FormNumber
              field={'use_point'}
              min={0}
              style={{ padding: '2px 16px' }}
              bordered
              disabled={disabled}
              className='bw_inp'
              max={disabled ? use_point : maxPoint}
              onChange={handleChangeUseExpoint}
              validation={{
                required: false,
                validate: {
                  maxPoint: (value) => {
                    if (value) {
                      if (!disabled) {
                        if (value > maxPoint) {
                          return 'Số điểm sử dụng không được lớn hơn số điểm hiện tại của khách hàng hoặc quy định của chương trình';
                        }
                      }
                    }
                    return true;
                  },
                },
              }}
            />
          </div>
          <div className='bw_col_6 bw_collapse_title'>
            <h3>Số tiền quy đổi:</h3>
          </div>
          <div className='bw_col_6 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
            <h3>{formatPrice(expoint_value, true, ',')}</h3>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ExchangePointApply;