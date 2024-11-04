import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useAuth } from 'context/AuthProvider';
import { getOptionsDepartment } from 'services/department.service';
import { getOptionsBusiness } from 'services/business.service';
import { getStoreOptions, getUserOptions } from 'services/purchase-requisition.service';
import FormUpload from '../FormUpload/FormUpload';
import usePageInformation from 'hooks/usePageInformation';
import FormDebouneSelect from '../shared/FormDebouneSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import purchaseRequisitionTypeService from 'services/purchaseRequisitionType.service';
import { PR_STATUS_OPTIONS } from 'pages/PurchaseRequisition/utils/constants';
import { mapDataOptions4Select } from 'utils/helpers';

const PurchaseRequisitionInformation = () => {
  const methods = useFormContext();
  const { user } = useAuth();
  const { disabled } = usePageInformation();

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [businessOptions, setBusinessOptions] = useState([]);
  const [storeOptions, setStoreOptions] = useState([]);
  const prTypeOptions = useGetOptions(optionType.purchaseRequisitionType);

  const businessId = methods.watch('business_request_id')?.value;

  useEffect(() => {
    if (!methods.watch('purchase_requisition_date')) {
      methods.setValue('purchase_requisition_date', dayjs().format('DD/MM/YYYY'));
    }

    if (!methods.watch('requisition_user')) {
      methods.setValue('requisition_user', user.user_name + ' - ' + user.full_name);
    }
  }, [methods, user]);

  const [searchStore, setSearchStore]= useState('')

  const fetchDepartmentOptions = (search) => getOptionsDepartment({ search, limit: 100 })
  const fetchBusinessOptions = (search) => getOptionsBusiness({ search, limit: 100 })
  const fetchStoreOptions = (search) => {
    setSearchStore(search)
    return getStoreOptions({ business_id: businessId, search, limit: 100 })
  }

  const loadDepartmentOptions = useCallback(() => {
    fetchDepartmentOptions().then(setDepartmentOptions);
  }, []);
  useEffect(loadDepartmentOptions, [loadDepartmentOptions]);

  const loadBusinessOptions = useCallback(() => {
    fetchBusinessOptions().then(setBusinessOptions);
  }, []);
  useEffect(loadBusinessOptions, [loadBusinessOptions]);

  const loadStoreOptions = useCallback(() => {
    fetchStoreOptions(searchStore).then(setStoreOptions);
  }, [businessId, searchStore]);
  useEffect(loadStoreOptions, [loadStoreOptions]);

  const convertOptions = (options) => {
    return options?.map((p) => {
      return {
        label: p?.name,
        value: p?.id,
      };
    });
  };

  const onChangePRType = async (value) => {
    methods.clearErrors('purchase_requisition_type_id');
    methods.setValue('purchase_requisition_type_id', value);
    const res = await purchaseRequisitionTypeService.getById(value);
    if (res?.review_level_user_list) {
      methods.setValue('review_level_user_list',await Promise.all(res?.review_level_user_list.map(async (item) => ({
        ...item,
        list_review: await getUserOptions({ limit: 20, review_level_id: item.review_level_id }).then(res => mapDataOptions4Select(res))
      }))));
    }
  };

  return (
    <BWAccordion title='Thông tin phiếu' isRequired>
      <div className='bw_row'>
        <FormItem className='bw_col_4' disabled isRequired label='Mã phiếu yêu cầu nhập hàng'>
          <FormInput type='text' field='purchase_requisition_code' />
        </FormItem>
        <FormItem className='bw_col_4' disabled label='Ngày lập phiếu'>
          <FormDatePicker
            style={{ width: '100%' }}
            type='text'
            field='purchase_requisition_date'
            placeholder='dd/mm/yyyy'
            bordered={false}
            format={'DD/MM/YYYY'}
          />
        </FormItem>
        <FormItem className='bw_col_4' disabled isRequired label='Người lập phiếu'>
          <FormInput type='text' field='requisition_user' />
        </FormItem>
      </div>
      <div className='bw_row'>
        <FormItem className='bw_col_4' disabled={disabled} isRequired label='Phòng ban yêu cầu'>
          <FormDebouneSelect
            field='department_request_id'
            placeholder='--Chọn--'
            fetchOptions={fetchDepartmentOptions}
            list={convertOptions(departmentOptions)}
            validation={{
              required: 'Phòng ban là bắt buộc.',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' disabled={disabled} isRequired label='Chi nhánh yêu cầu'>
          <FormDebouneSelect
            field='business_request_id'
            placeholder='--Chọn--'
            fetchOptions={fetchBusinessOptions}
            list={convertOptions(businessOptions)}
            validation={{
              required: 'Chi nhánh là bắt buộc',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' disabled={disabled} label='Cửa hàng yêu cầu'>
          <FormDebouneSelect
            key={businessId}
            field='store_request_id'
            placeholder='--Chọn--'
            fetchOptions={fetchStoreOptions}
            options={convertOptions(storeOptions)}
            // validation={{
            //   required: 'Cửa hàng là bắt buộc',
            // }}
          />
        </FormItem>
      </div>
      <div className='bw_row'>
        <FormItem className='bw_col_4' disabled={disabled} label='Loại yêu cầu mua hàng' isRequired >
          <FormSelect field='purchase_requisition_type_id' list={prTypeOptions} onChange={onChangePRType}
            validation={{
              required: 'Loại yêu cầu mua hàng là bắt buộc',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' disabled={disabled} isRequired label='Trạng thái phiếu'>
          <FormSelect field={'pr_status_id'} list={PR_STATUS_OPTIONS} />
        </FormItem>
        <FormItem className='bw_col_4' disabled={disabled} label='Ngày cần mua'>
          <FormDatePicker
            style={{ width: '100%' }}
            type='text'
            field='to_buy_date'
            placeholder='dd/mm/yyyy'
            bordered={false}
            format={'DD/MM/YYYY'}
          />
        </FormItem>
      </div>
      <FormItem className='bw_col_12' label='Chứng từ'>
        <FormUpload field='document_url' />
      </FormItem>
    </BWAccordion>
  );
};

export default PurchaseRequisitionInformation;
