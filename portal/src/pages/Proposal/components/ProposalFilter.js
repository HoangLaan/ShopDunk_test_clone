import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { initSearch } from '../utils/constants';

const ProposalFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { proposalTypeData, departmentData } = useSelector((state) => state.global);
  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  useEffect(() => {
    if (!proposalTypeData) dispatch(getOptionsGlobal('proposalType'));
  }, [proposalTypeData]);

  useEffect(() => {
    if (!departmentData) dispatch(getOptionsGlobal('department'));
  }, [departmentData]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          methods.reset(initSearch);
          onChange(initSearch);
        }}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập mã nhân viên, tên nhân viên, sđt, email'} field='keyword' />,
          },
          {
            title: 'Loại đề xuất',
            component: (
              <FormSelect
                list={mapDataOptions4SelectCustom(proposalTypeData, 'id', 'name')}
                field={'proposal_type_id'}
              />
            ),
          },
          {
            title: 'Phòng ban',
            component: (
              <FormSelect list={mapDataOptions4SelectCustom(departmentData, 'id', 'name')} field={'department_id'} />
            ),
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'created_date_from'}
                fieldEnd={'created_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Ngày hiệu lực',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'effective_date_from'}
                fieldEnd={'effective_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default ProposalFilter;
