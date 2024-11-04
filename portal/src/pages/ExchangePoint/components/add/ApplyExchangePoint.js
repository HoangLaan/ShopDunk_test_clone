import { getOptionsGlobal, showConfirmModal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { useFormContext, useFieldArray } from 'react-hook-form';
import DataTable from 'components/shared/DataTable/index';
import ExchangPointProductCategory from './ExchangPointProductCategory';
import ExchangePointProduct from './ExchangePointProduct';
import ExchangePointCustomerType from './ExchangePointCustomerType';
import { getStoreExchangePoint } from 'services/exchange-point.service';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { useLocation } from 'react-router-dom';

const ApplyExchangePoint = ({ disabled, title }) => {
  const dispatch = useDispatch();
  const { watch, setValue, clearErrors, control } = useFormContext();
  const { companyData, areaData, businessData, clusterData } = useSelector((state) => state.global);
  const { pathname } = useLocation();
  const isAdd = useMemo(() => pathname.includes('/detail'), [pathname]);
  const ref = useRef(false);
  const { fields, remove } = useFieldArray({
    control,
    name: 'list_store',
  });

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Địa chỉ',
        accessor: 'address',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: disabled,
        onClick: (value, d) => {
          dispatch(
            showConfirmModal([`Xoá ${value?.store_name} ra khỏi danh sách cửa hàng áp dụng ?`], () => {
              remove(d);
              return;
            }),
          );
        },
      },
    ];
  }, [disabled, remove, watch('is_apply_condition')]);

  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
    else {
      if (isAdd) {
        setValue('company_id', +companyData?.[0]?.id);
      }
    }
  }, [companyData, dispatch, isAdd]);

  useEffect(() => {
    if (!areaData) dispatch(getOptionsGlobal('area'));
  }, [areaData, dispatch]);

  useEffect(() => {
    if (!businessData) dispatch(getOptionsGlobal('business', { parent_id: watch('company_id') }));
  }, [businessData, dispatch, watch('company_id')]);

  useEffect(() => {
    if (!clusterData) dispatch(getOptionsGlobal('cluster'));
  }, [clusterData, dispatch]);

  useEffect(() => {
    ref.current = true;
  }, []);

  useEffect(() => {
    if (ref.current && isAdd) {
      loadStore();
      ref.current = false;
    }
  }, [isAdd]);

  const handleChange = (field, value) => {
    clearErrors(field);
    setValue(field, value);
    loadStore();
  };

  const loadStore = useCallback(() => {
    getStoreExchangePoint({
      company_id: watch('company_id'),
      area_id: watch('area_id'),
      business_id: watch('business_id'),
      cluster_id: watch('cluster_id'),
    }).then((res) => setValue('list_store', res));
  }, [watch('company_id'), watch('area_id'), watch('business_id'), watch('cluster_id')]);

  useEffect(() => {
    if (watch('is_apply_all_category')) {
      setValue('list_product', []);
    }
  }, [watch('is_apply_all_category')]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12 bw_mb_2'>
            <label className='bw_checkbox '>
              <FormInput disabled={disabled} type='checkbox' field='is_apply_website' />
              <span />
              Áp dụng trên website
            </label>
          </div>
          <div className='bw_col_6 '>
            <FormItem disabled={disabled} isRequired label='Công ty'>
              <FormSelect
                field={'company_id'}
                list={mapDataOptions4SelectCustom(companyData, 'id', 'name')}
                onChange={(value) => handleChange('company_id', value)}
                validation={{
                  required: 'Chọn công ty là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Khu vực'>
              <FormSelect
                field={'area_id'}
                list={mapDataOptions4SelectCustom(areaData, 'id', 'name')}
                onChange={(value) => handleChange('area_id', value)}
                allowClear
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Miền'>
              <FormSelect
                field={'business_id'}
                list={mapDataOptions4SelectCustom(businessData, 'id', 'name')}
                onChange={(value) => handleChange('business_id', value)}
                allowClear
              />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <FormItem disabled={disabled} label='Cụm'>
              <FormSelect
                field={'cluster_id'}
                list={mapDataOptions4SelectCustom(clusterData, 'id', 'name')}
                onChange={(value) => handleChange('cluster_id', value)}
                allowClear
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <DataTable columns={columns} data={fields} actions={actions} noSelect noPaging />
          </div>
          <div className='bw_col_12'>
            <ExchangPointProductCategory disabled={disabled} />
          </div>
          {!watch('is_apply_all_category') && (
            <div className='bw_col_12'>
              <ExchangePointProduct disabled={disabled} />
            </div>
          )}
          <div className='bw_col_12'>
            <ExchangePointCustomerType disabled={disabled} />
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};
export default ApplyExchangePoint;
