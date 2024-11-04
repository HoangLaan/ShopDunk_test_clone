import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { FormProvider, useForm } from 'react-hook-form';
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { offerTypes } from 'pages/PromotionOffers/utils/helpers';
import { getOptionsGlobal } from 'actions/global';

const PromotionOffersFilter = ({ onChange, onClear }) => {
  const dispatch = useDispatch();
  const { companyData, businessData } = useSelector((state) => state.global);
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  useEffect(() => {
    dispatch(getOptionsGlobal('company'));
  }, []);

  useEffect(() => {
    dispatch(
      getOptionsGlobal('business', {
        company_id: methods.watch('company_id'),
      }),
    );
  }, [methods.watch('company_id')]);

  const onSubmit = () => {
    const q = {
      search: methods.watch('search'),
      offer_type: methods.watch('offer_type'),
      company_id: methods.watch('company_id'),
      bussiness_id: methods.watch('bussiness_id'),
      is_active: methods.watch('is_active') ?? 1,
      created_date_from: methods.watch('created_date_from'),
      created_date_to: methods.watch('created_date_to'),
    };
    onChange(q);
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.charCode === 13) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên ưu đãi khuyến mại' onKeyPress={handleKeyDownSearch}/>,
          },
          {
            title: 'Ưu đãi khuyến mại',
            component: <FormSelect field='offer_type' list={offerTypes} />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={mapDataOptions4Select(companyData ?? [])} />,
          },
          {
            title: 'Miền',
            component: <FormSelect field='bussiness_id' list={mapDataOptions4Select(businessData ?? [])} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                fieldStart={'create_date_from'}
                fieldEnd={'create_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default PromotionOffersFilter;
