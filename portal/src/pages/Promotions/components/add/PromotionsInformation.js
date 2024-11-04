import React, { useMemo, useState } from 'react';
import { getOptionsGlobal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getBase64 } from 'utils/helpers';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { weekOptions, mapArrayGetKey } from 'pages/Promotions/utils/helpers';
import { allBusiness } from 'pages/Promotions/utils/constants';
import PromotionStoreApply from './PromotionStoreApply';
import _ from 'lodash';

import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import ModallShowList from 'pages/Prices/components/table-prices/modal/ModallShowList';

const PromotionInformation = ({ disabled }) => {
  const { companyData, businessData, orderTypeData } = useSelector((state) => state.global);
  const [openModal, setOpenModal] = useState(false);
  const methods = useFormContext();
  const { watch, setValue } = methods;
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getOptionsGlobal('company'));
  }, []);

  React.useEffect(() => {
    dispatch(getOptionsGlobal('area'));
    dispatch(getOptionsGlobal('company'));
    dispatch(
      getOptionsGlobal('orderType', {
        is_active: 1,
      }),
    );
  }, []);

  React.useEffect(() => {
    dispatch(
      getOptionsGlobal('business', {
        company_id: methods.watch('company_id'),
      }),
    );
  }, [methods.watch('company_id')]);

  const checkedAllWeek = useMemo(() => {
    const valueArray = weekOptions.map((o) => Boolean(methods.watch(o?.field)));
    if (valueArray.includes(false)) {
      return false;
    } else {
      return true;
    }
  }, [
    watch('is_all_week'),
    watch('is_apply_mon'),
    watch('is_apply_tu'),
    watch('is_apply_we'),
    watch('is_apply_th'),
    watch('is_apply_fr'),
    watch('is_apply_sa'),
    watch('is_apply_sun'),
  ]);

  React.useEffect(() => {
    methods.clearErrors('check_week');
    if (
      watch('is_all_week') ||
      watch('is_apply_mon') ||
      watch('is_apply_tu') ||
      watch('is_apply_we') ||
      watch('is_apply_th') ||
      watch('is_apply_fr') ||
      watch('is_apply_sa') ||
      watch('is_apply_sun')
    ) {
      methods.unregister('check_week', {});
    } else {
      methods.register('check_week', { required: 'Áp dụng trong tuần là bắt buộc' });
    }
  }, [
    watch('is_all_week'),
    watch('is_apply_mon'),
    watch('is_apply_tu'),
    watch('is_apply_we'),
    watch('is_apply_th'),
    watch('is_apply_fr'),
    watch('is_apply_sa'),
    watch('is_apply_sun'),
  ]);

  const handleChangeCompanyBusiness = (value, check) => {
    if (check) {
      setValue('business_id', value);
    } else {
      setValue('company_id', value);
      setValue('business_id', []);
    }
  };

  const handleChangeHour = (value) => {
    setValue('is_apply_hours', value);
    if (!value) {
      methods.unregister('time_end', {});
      methods.unregister('time_start', {});
    } else {
      methods.register('time_end', {
        validate: (value) => {
          if (watch('is_apply_hours')) {
            if (!value) {
              return 'Thời gian bắt đầu là bắt buộc';
            }
          }
          return true;
        },
      });
      methods.register('time_start', {
        validate: (value) => {
          if (watch('is_apply_hours')) {
            if (!value) {
              return 'Thời gian kết thúcsf là bắt buộc';
            }
          }
          return true;
        },
      });
    }
  };

  const renderItemSplit = (dataList) => {
    if (Array.isArray(businessData) && businessData.length > 0) {
      const filteredObjects = businessData?.filter((item) => dataList.includes(item?.id));
      return (
        <div className='text-left'>
          {filteredObjects &&
            filteredObjects.map((_name, i) => {
              return (
                <ul key={i}>
                  <li>
                    <p>{_name?.name}</p>
                  </li>
                </ul>
              );
            })}
        </div>
      );
    }
  };

  return (
    <>
      <BWAccordion title='Thông tin ưu đãi khuyến mại'>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormItem className='bw_col_12' disabled={disabled} isRequired label='Tên chương trình khuyến mại'>
                <FormInput
                  disabled={disabled}
                  field='promotion_name'
                  placeholder='Nhập tên chương trình khuyến mại'
                  validation={{
                    required: 'Tên chương trình khuyến mại là bắt buộc',
                  }}
                />
              </FormItem>
              <FormItem classưName='bw_col_12' disabled={disabled} label='Mô tả'>
                <FormTextArea disabled={disabled} field='description' />
              </FormItem>
            </div>
            <div className='bw_col_6 bw_flex'>
              <div className='bw_load_image bw_mb_2 bw_text_center bw_col_6'>
                <label className='bw_choose_image'>
                  <input
                    type='file'
                    field='url_banner_promotion'
                    name='url_banner_promotion'
                    accept='image/*'
                    onChange={async (_) => {
                      const file = await getBase64(_.target.files[0]);
                      if (file) {
                        methods.setValue('url_banner_promotion', file);
                      }
                    }}
                  />
                  {methods.watch('url_banner_promotion')?.length ? (
                    <img style={{ width: '100%' }} src={methods.watch('url_banner_promotion') ?? ''}></img>
                  ) : (
                    <span className='fi fi-rr-picture' />
                  )}
                </label>
                <p>Chọn banner Chương trình khuyến mại</p>
              </div>
              <div className='bw_load_image bw_mb_2 bw_text_center bw_col_6'>
                <label className='bw_choose_image'>
                  <input
                    name='url_image_promotion'
                    accept='image/*'
                    onChange={async (_) => {
                      const file = await getBase64(_.target.files[0]);
                      if (file) {
                        methods.setValue('url_image_promotion', file);
                      }
                    }}
                    type='file'
                    field='url_image_promotion'
                  />
                  {methods.watch('url_image_promotion')?.length ? (
                    <img style={{ width: '100%' }} src={methods.watch('url_image_promotion') ?? ''}></img>
                  ) : (
                    <span className='fi fi-rr-picture' />
                  )}
                </label>
                <p>Chọn ảnh Chương trình khuyến mại</p>
              </div>
            </div>
          </div>
        </div>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormItem label='Công ty' isRequired={true}>
                <FormSelect
                  disabled={disabled}
                  field='company_id'
                  list={mapDataOptions4SelectCustom(companyData)}
                  onChange={(e, o) => {
                    handleChangeCompanyBusiness(o.value || null);
                  }}
                  validation={{
                    required: 'Công ty là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              {disabled ? (
                <div onClick={() => setOpenModal(true)}>
                  <FormItem disabled={disabled}>
                    {methods.watch('business_id')?.length > 0 && (
                      <div className='bw-text-center bw_label_outline bw_label_outline_success text-center'>
                        {methods.watch('business_id')?.length + ' Miền +'}
                      </div>
                    )}
                  </FormItem>
                </div>
              ) : (
                <FormItem disabled={disabled || !methods.watch('company_id')} label='Miền' isRequired={true}>
                  <FormSelect
                    mode='multiple'
                    disabled={disabled || !methods.watch('company_id')}
                    field='business_id'
                    list={
                      Array.isArray(businessData) && businessData.length > 0
                        ? [allBusiness, ...mapDataOptions4Select(businessData)]
                        : mapDataOptions4Select(businessData)
                    }
                    onChange={(e, o) => {
                      let valueSet = e;
                      if (e) {
                        if (e[e.length - 1] == allBusiness?.value) {
                          const clonebusinessData = structuredClone(mapDataOptions4Select(businessData));
                          valueSet = mapArrayGetKey(clonebusinessData, 'value', allBusiness?.value, []);
                        }
                      }
                      handleChangeCompanyBusiness(valueSet || null, true);
                    }}
                    validation={{
                      required: 'Miền công ty là bắt buộc',
                    }}
                  />
                </FormItem>
              )}
            </div>
          </div>
        </div>
        <div className='bw_col_12'>
          <div className='bw_collapse_title bw_ml_2 bw_mb_1'>
            <h3>
              Thời gian áp dụng khuyến mại <span className='bw_red'> *</span>
            </h3>
          </div>
          <div className='bw_col_12'>
            <div className='bw_row'>
              <div className='bw_col_6'>
                <FormItem label='Ngày áp dụng khuyến mại' isRequired>
                  <FormRangePicker
                    fieldStart='begin_date'
                    fieldEnd='end_date'
                    placeholder={['Từ ngày', 'Đến ngày']}
                    format={'DD/MM/YYYY'}
                    allowClear={true}
                    style={{ width: '100%' }}
                    validation={{
                      required: 'Ngày áp dụng khuyến mại là bắt buộc',
                    }}
                  />
                </FormItem>
              </div>
              <div className='bw_col_6'>
                <FormItem hiddenLabel={true}>
                  <div className='bw_col_12'>
                    <div className='bw_collapse_title bw_ml_2 bw_mb_1'>
                      <label className='bw_checkbox bw_col_12'>
                        <FormInput
                          disabled={disabled}
                          type='checkbox'
                          field='is_apply_hours'
                          onChange={(evt) => {
                            handleChangeHour(evt.target.checked);
                          }}
                        />
                        <span />
                        Áp dụng theo giờ
                      </label>
                    </div>
                  </div>
                  <div className='bw_row'>
                    <div className='bw_col_6'>
                      <div className='bw_row'>
                        <label className='bw_col_2'>Từ giờ</label>
                        <FormInput
                          className='bw_col_9'
                          field='time_start'
                          type='time'
                          disabled={!methods.watch('is_apply_hours')}
                          allowClear={true}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                    <div className='bw_col_6'>
                      <div className='bw_row'>
                        <label className='bw_col_2'>Đến giờ</label>
                        <FormInput
                          className='bw_col_9'
                          field='time_end'
                          type='time'
                          disabled={!methods.watch('is_apply_hours')}
                          allowClear={true}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div className='bw_col_12'>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Loại đơn hàng áp dụng'>
              <FormSelect
                list={mapDataOptions4Select(orderTypeData)}
                mode='multiple'
                disabled={disabled}
                type='text'
                field='order_type_list'
                validation={{
                  required: 'Loại đơn hàng là bắt buộc',
                }}
              />
            </FormItem>
          </div>
        </div>
        <PromotionStoreApply />
        <FormItem className='bw_col_12' disabled={disabled} isRequired label='Áp dụng trong tuần'>
          <div className='bw_flex mt-2'>
            <label className='bw_checkbox'>
              <input
                type='checkbox'
                checked={checkedAllWeek}
                onChange={(e) => {
                  for (let i of weekOptions) {
                    methods.setValue(i?.field, !checkedAllWeek);
                  }
                }}
              />
              <span></span> Tất cả ngày trong tuần
            </label>
            {!Boolean(methods.watch('is_all_week')) &&
              weekOptions.map((o) => {
                return (
                  <label className='bw_checkbox'>
                    <input
                      type='checkbox'
                      checked={methods.watch(o?.field)}
                      onChange={(e) => {
                        methods.clearErrors(o?.field);
                        methods.setValue(o?.field, e.target.checked);
                      }}
                    />
                    <span></span> {o?.label}
                  </label>
                );
              })}
            <FormInput type='hidden' field='check_week' />
          </div>
        </FormItem>
      </BWAccordion>
      {openModal && (
        <ModallShowList
          open={openModal}
          setOpen={setOpenModal}
          listValue={methods.watch('business_id')}
          funcIn={renderItemSplit}
          title='Danh sách Miền'
        />
      )}
    </>
  );
};

export default PromotionInformation;
