import React, { useState } from 'react';
import { getOptionsGlobal } from 'actions/global';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { mapDataOptions4Select } from 'utils/helpers';
import { mapArrayGetKey } from 'pages/Promotions/utils/helpers';
import { allBusiness } from 'pages/Promotions/utils/constants';
import ModallShowList from 'pages/Prices/components/table-prices/modal/ModallShowList';

const PromotionOffersInformation = ({ disabled }) => {
  const { companyData, businessData } = useSelector((state) => state.global);
  const [openModal, setOpenModal] = useState(false);
  const methods = useFormContext();
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getOptionsGlobal('company'));
  }, []);

  React.useEffect(() => {
    dispatch(
      getOptionsGlobal('business', {
        company_id: methods.watch('company_id'),
      }),
    );
  }, [methods.watch('company_id')]);

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
              <FormItem disabled={disabled} isRequired label='Công ty'>
                <FormSelect
                  list={mapDataOptions4Select(companyData)}
                  disabled={disabled}
                  field='company_id'
                  placeholder='Chọn công ty'
                  validation={{
                    required: 'Tên công ty cần nhập là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              {disabled ? (
                <div onClick={() => setOpenModal(true)}>
                  <FormItem disabled={disabled} isRequired label='Miền'>
                    {methods.watch('business_list')?.length > 0 && (
                      <span className='bw-text-center bw_label_outline bw_label_outline_success text-center'>
                        {methods.watch('business_list')?.length + ' Miền +'}
                      </span>
                    )}
                  </FormItem>
                </div>
              ) : (
                <FormItem disabled={disabled} isRequired label='Miền'>
                  <FormSelect
                    mode='multiple'
                    list={
                      Array.isArray(businessData) && businessData.length > 0
                        ? [allBusiness, ...mapDataOptions4Select(businessData)]
                        : mapDataOptions4Select(businessData)
                    }
                    disabled={disabled}
                    field='business_list'
                    placeholder='Chọn tên miền'
                    onChange={(e, o) => {
                      let valueSet = e;
                      if (e) {
                        if (e[e.length - 1] == allBusiness?.value) {
                          const clonebusinessData = structuredClone(mapDataOptions4Select(businessData));
                          valueSet = mapArrayGetKey(clonebusinessData, 'value', allBusiness?.value, []);
                        }
                      }
                      methods.setValue('business_list', valueSet || null);
                    }}
                    validation={{
                      required: 'Tên miền là bắt buộc',
                    }}
                  />
                </FormItem>
              )}
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Thứ tự hiển thị'>
                <FormInput
                  placeholder='Nhập thứ tự hiển thị'
                  disabled={disabled}
                  min={0}
                  type='number'
                  field='order_index'
                  validation={{
                    required: 'Thứ tự là bắt buộc.',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} isRequired label='Tên ưu đãi khuyến mại'>
                <FormInput
                  type='text'
                  field='promotion_offer_name'
                  placeholder='Nhập tên ưu đãi khuyến mại'
                  validation={{
                    required: 'Tên ưu đãi là bắt buộc.',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} label='Nội dung điều kiện'>
                <FormTextArea type='text' field='condition_content' placeholder='Nội dung điều kiện' />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem disabled={disabled} label='Nhập mô tả'>
                <FormTextArea type='text' field='description' placeholder='Mô tả' />
              </FormItem>
            </div>
          </div>
        </div>
      </BWAccordion>
      {openModal && (
        <ModallShowList
          open={openModal}
          setOpen={setOpenModal}
          listValue={methods.watch('business_list')}
          funcIn={renderItemSplit}
          title='Danh sách Miền'
        />
      )}
    </>
  );
};

export default PromotionOffersInformation;
