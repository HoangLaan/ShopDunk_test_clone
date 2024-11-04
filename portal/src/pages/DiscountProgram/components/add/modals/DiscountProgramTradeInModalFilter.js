import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { TradeInProgramApplyStatus, TradeInProgramApplyStatusOptions } from 'pages/DiscountProgram/ultils/constant';

const DiscountProgramTradeInModalFilter = ({ onChange }) => {
  const methods = useForm({
    defaultValues: {
      apply_status: TradeInProgramApplyStatus.APPLYING,
    },
  });

  const onSubmit = () => {
    const q = {
      search: methods.watch('search'),
      apply_status: methods.watch('apply_status'),
    };
    onChange(q);
  };

  const onClear = () => {
    methods.reset({
      search: '',
      apply_status: TradeInProgramApplyStatus.APPLYING,
    });
    onChange({
      search: '',
      apply_status: TradeInProgramApplyStatus.APPLYING,
    });
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
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                onKeyPress={handleKeyDownSearch}
                type='text'
                placeholder='Nhập tên chương trình thu cũ đổi mới'
                field='search'
              />
            ),
          },
          {
            title: 'Áp dụng',
            component: <FormSelect field='apply_status' list={TradeInProgramApplyStatusOptions} />,
          },
        ]}
        colSize={6}
      />
    </FormProvider>
  );
};

export default DiscountProgramTradeInModalFilter;
