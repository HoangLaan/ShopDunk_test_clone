import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { formatPrice } from 'utils';
import { mapDataOptions4Select, showToast } from 'utils/helpers';
import { countOrderByCustomer, getListCustomer } from 'pages/Orders/helpers/call-api';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { calculateAccumulatedPoint, getOptionsCumlatePointType } from 'services/cumulate-point-type.service';
import { CUSTOMER_TYPE } from 'pages/CustomerType/utils/constants';

const AccumulatePointApply = ({ disabled }) => {
  const methods = useFormContext();
  const { watch, setValue, clearErrors } = methods;
  const [accumulatePoints, setAccumulatePoints] = useState([]);
  const [orderCount, setOrderCount] = useState(-1);
  const [point, setPoint] = useState({
    customer_point: 0,
    presenter_point: 0,
  });

  const fetchPresenter = useCallback(
    (value) => {
      return getListCustomer({
        search: value,
        itemsPerPage: 50,
        customer_type: CUSTOMER_TYPE.INDIVIDUAL,
      }).then((body) => {
        const _customerOpts = body.items.map((_res) => ({
          label: _res.customer_code + ' - ' + _res.full_name,
          value: _res.member_id ? `CN_${_res.member_id}` : `TN_${_res.dataleads_id}`,
          ..._res,
        }));
        if (_customerOpts?.length === 1) {
          clearErrors('presenter');
          setValue('presenter', mapDataOptions4Select(_customerOpts)[0]);
        }
        return _customerOpts;
      });
    },
    [setValue, clearErrors],
  );

  useEffect(() => {
    fetchPresenter();
  }, [fetchPresenter]);

  const member_id = methods.watch('member_id');
  const dataleads_id = methods.watch('dataleads_id');
  const acpoint_id = methods.watch('acpoint_id');
  const products = watch('products');
  const store_id = watch('store_id');
  const customer_type_id = watch('customer_type_id');
  const order_id = watch('order_id');
  const total_money = watch('sub_total_apply_discount');
  const presenter = watch('presenter');

  const loadAccumulatorPoints = useCallback(() => {
    const products_ = Object.values(products || {});

    if (products_.length > 0 && store_id && (customer_type_id || order_id)) {
      let productIds = products_.map((product) => product.product_id);
      getOptionsCumlatePointType({
        product_ids: productIds.join(','),
        store_id,
        customer_type_id,
      })
        .then((data) => {
          const options = mapDataOptions4Select(data);
          setAccumulatePoints(options);
          if (options?.length === 1) {
            clearErrors('acpoint_id');
            setValue('acpoint_id', options[0].value);
          }
        })
        .catch((err) => {
          showToast.error('Lấy chương trình tích điểm xảy ra lỗi !');
        });
    }
  }, [products, store_id, customer_type_id, order_id, setValue, clearErrors]);

  useEffect(loadAccumulatorPoints, [loadAccumulatorPoints]);

  useEffect(() => {
    countOrderByCustomer({ member_id, dataleads_id }).then((data) => {
      if (data) {
        methods.setValue('presenter_id', null);
      }
      setOrderCount(data);
    });
  }, [member_id, dataleads_id]);

  useEffect(() => {
    if (acpoint_id) {
      calculateAccumulatedPoint({ acpoint_id, total_money, presenter: presenter?.value }).then((data) => {
        if (data?.customer_point) {
          if (Number(data?.customer_point) > 0) {
            setValue('accumulate_point', Number(data?.customer_point));
          }
          if (Number(data?.presenter_point) > 0) {
            setValue('presenter_point', Number(data?.presenter_point));
          }
        } else {
          setValue('accumulate_point', 0);
        }
        setPoint(data);
      });
    }
  }, [acpoint_id, total_money, presenter?.value, setValue]);

  const presenterHref = useMemo(() => {
    const presenter = watch('presenter')?.value;
    if (presenter) {
      const [prefix, id] = presenter.split('_');
      return prefix === 'CN' ? '/customer/detail/' + id : '/customer-lead/detail/' + id;
    }
    return '/';
  }, [watch('presenter')]);

  return (
    <div className='bw_row'>
      <Fragment>
        <div className='bw_col_6 bw_collapse_title'>
          <h3>Thông tin người giới thiệu</h3>
        </div>
        <div className='bw_col_6'>
          {watch('payment_status') === 1 ? (
            watch('presenter') ? (
              <a
                target='_blank'
                style={{ textDecoration: 'underline', textAlign: 'center', width: '100%', display: 'inline-block' }}
                href={presenterHref}>
                {watch('presenter')?.label}
              </a>
            ) : (
              <div style={{ textAlign: 'center' }}>Không có người giới thiệu</div>
            )
          ) : (
            <Fragment>
              <FormDebouneSelect
                disabled={
                  disabled ||
                  (orderCount === 0 ? false : orderCount === 1 && watch('order_id') ? false : true) ||
                  watch('dataleads_id')
                }
                bordered
                field='presenter'
                style={{ width: '100%' }}
                fetchOptions={fetchPresenter}
                debounceTimeout={700}
                placeholder={'--Chọn--'}
              />
            </Fragment>
          )}
        </div>
      </Fragment>
      <div className='bw_col_6 bw_collapse_title'>
        <h3>Áp dụng tích điểm</h3>
      </div>
      <div className='bw_col_6'>
        {accumulatePoints?.length > 0 ? (
          <Fragment>
            <FormSelect
              bordered
              disabled={disabled}
              list={accumulatePoints}
              field={'acpoint_id'}
              showSearch
              allowClear
            />
          </Fragment>
        ) : (
          <span>Không có chương trình tích điểm phù hợp</span>
        )}
      </div>
      {acpoint_id && (
        <Fragment>
          <div className='bw_col_6 bw_collapse_title'>
            <h3>Điểm thưởng nhận được</h3>
          </div>
          <div className='bw_col_6 bw_collapse_title bw_flex bw_justify_content_right bw_align_items_center'>
            <h3>{formatPrice(point?.customer_point, false, ',')}</h3>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default AccumulatePointApply;
