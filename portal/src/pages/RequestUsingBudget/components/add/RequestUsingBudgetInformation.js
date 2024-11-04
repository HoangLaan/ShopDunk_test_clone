import React, { useEffect } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { VOTE_STATUS } from 'pages/RequestUsingBudget/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';
const RequestUsingBudgetInformation = ({ disabled, title, isReview }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { companyData, userData, departmentData, budgetTypeData } = useSelector((state) => state.global);
  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
  }, [companyData, dispatch]);

  useEffect(() => {
    if (!userData) dispatch(getOptionsGlobal('user'));
  }, [dispatch, userData]);

  useEffect(() => {
    if (!departmentData) dispatch(getOptionsGlobal('department'));
  }, [dispatch, departmentData]);

  useEffect(() => {
    if (!budgetTypeData) dispatch(getOptionsGlobal('budgetType'));
  }, [dispatch, budgetTypeData]);
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <FormItem disabled={true} isRequired label='Mã đề nghị'>
              <FormInput
                type='text'
                field='request_using_budget_code'
                placeholder='Nhập mã đề nghị'
                validation={{
                  required: 'Mã đề nghị cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={true} isRequired label='Ngày tạo'>
              <FormDatePicker
                format={'DD/MM/YYYY'}
                field='create_date'
                placeholder='Nhập ngày tạo'
                style={{ width: '100%' }}
                validation={{
                  required: 'Ngày tạo cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={true} label='Trạng thái phiếu'>
              <FormSelect field='is_review' list={VOTE_STATUS} />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={true} label='Người đề nghị' isRequired>
              <FormSelect
                field='user_request'
                validation={{
                  required: 'Người đề nghị cần chọn là bắt buộc',
                }}
                list={mapDataOptions4SelectCustom(userData, 'id', 'name')}></FormSelect>
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={true} label='Công ty' isRequired>
              <FormSelect
                field='company_id'
                list={mapDataOptions4SelectCustom(companyData, 'id', 'name')}
                validation={{
                  required: 'Chọn công ty là bắt buộc',
                }}></FormSelect>
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled || isReview} isRequired label='Loại ngân sách'>
              <FormSelect
                field={'budget_type_id'}
                list={mapDataOptions4SelectCustom(budgetTypeData, 'id', 'name')}
                validation={{
                  required: 'Chọn loại ngân sách là bắt buộc',
                }}></FormSelect>
            </FormItem>
            <span>
              {methods.watch('budget_type_id')
                ? `Thời gian hiệu lực PR ${
                    budgetTypeData.find((x) => x.id === methods.watch('budget_type_id'))?.parent_id
                  } ngày`
                : null}{' '}
            </span>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={true} label='Phòng ban đề nghị'>
              <FormSelect
                field={'department_id'}
                list={mapDataOptions4SelectCustom(departmentData, 'id', 'name')}></FormSelect>
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default RequestUsingBudgetInformation;
