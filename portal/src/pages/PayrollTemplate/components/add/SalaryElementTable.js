import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState } from 'react';
import SalaryElementModal from './modal/SalaryElementModal';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWAccordion from 'components/shared/BWAccordion/index';
import { useFormContext } from 'react-hook-form';
import FormItem from 'components/shared/BWFormControl/FormItem';

const SalaryElementTable = ({ disabled, title, companyOptions }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { watch, setValue } = useFormContext();

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },

      {
        header: 'Mã thành phần',
        accessor: 'element_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Tên thành phần',
        accessor: 'element_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Tên cột hiển thị',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          const display_name = watch(`salary_element.${index}.display_name`);
          if (display_name === undefined) {
            setValue(`salary_element.${index}.display_name`, d.element_name);
          }
          return (
            <FormItem disabled={disabled}>
              <FormInput field={`salary_element.${index}.display_name`} />
            </FormItem>
          );
        },
      },
      {
        header: 'Mô tả công thức/giá trị',
        accessor: 'element_value',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Hiển thị',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => (
          <FormInput
            disabled={disabled}
            field={`salary_element.${index}.is_show`}
            type='checkbox'
            checked={watch(`salary_element.${index}.is_show`) ?? d.is_show}
          />
        ),
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        hidden: disabled,
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm thành phần',
        onClick: () => setIsOpenModal(true),
      },
      {
        hidden: disabled,
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (d, index) => {
          setValue(
            `salary_element`,
            watch(`salary_element`).filter((_, i) => i !== index),
          );
        },
      },
    ];
  }, [disabled]);

  return (
    <>
      <BWAccordion title={title}>
        <DataTable noSelect={true} noPaging={true} columns={columns} data={watch(`salary_element`)} actions={actions} />

        {isOpenModal && (
          <SalaryElementModal
            open={isOpenModal}
            onClose={() => {
              setIsOpenModal(false);
            }}
            onApply={(d) => setValue(`salary_element`, d)}
            companyOptions={companyOptions}
            defaultDataSelect={watch(`salary_element`)}
          />
        )}
      </BWAccordion>
    </>
  );
};

export default SalaryElementTable;
