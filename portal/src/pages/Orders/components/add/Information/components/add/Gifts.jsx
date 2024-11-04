import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import _ from 'lodash';

import { mapDataOptions4Select } from 'utils/helpers';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import DataTable from 'components/shared/DataTable/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const Gifts = ({ disabled }) => {
  const methods = useFormContext({});
  const { watch, setValue, clearErrors } = methods;

  const gifts = watch('gifts');
  const gifts_length = gifts?.length;
  const materials = watch('materials');
  const products = watch('products');

  const onChangeGifts = useCallback(() => {
    if (gifts?.length > 0) {
      const selectedImeis = [
        // imei cua cac material
        ...materials.reduce((acc, material) => acc.concat(material?.imei_codes || []), []).map((imei) => imei?.value),
        // imei cua cac gift
        ...gifts.reduce((acc, gift) => acc.concat(gift?.imei_codes || []), []).map((imei) => imei?.value),
        // imei cua cac product
        ...Object.keys(products || {}),
      ];

      // disable cac imei da chon
      const newGifts = gifts.map((gift) => {
        const newImeiOptions = gift?.imei_code_options?.map((imei) => {
          const isDisabled =
            selectedImeis?.findIndex((item) => item === imei?.value) !== -1 &&
            !(gift?.imei_codes?.findIndex((item) => item?.value === imei?.value) > -1);

          return {
            ...imei,
            disabled: isDisabled,
          };
        });

        return {
          ...gift,
          imei_code_options: newImeiOptions,
        };
      });

      if (!_.isEqual(gifts, newGifts)) setValue('gifts', newGifts);
    }
  }, [gifts, materials, products, setValue]);

  useEffect(() => {
    if (gifts_length > 0) {
      onChangeGifts();
    }
  }, [gifts_length, onChangeGifts]);

  const columns = [
    {
      header: 'IMEI',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (p, idx) => (
        <FormSelect
          mode='multiple'
          list={mapDataOptions4Select(p?.imei_code_options || [])}
          field={`gifts[${idx}].imei_codes`}
          disabled={disabled}
          allowClear
          validation={{
            validate: (value, _) => {
              if (!value || value?.length === 0) {
                return 'IMEI không được để trống';
              }

              if (value?.length !== +p?.quantity) {
                return 'Số lượng IMEI không khớp';
              }

              return true;
            },
          }}
          onChange={(value) => {
            clearErrors(`gifts[${idx}].imei_codes`);
            setValue(
              `gifts[${idx}].imei_codes`,
              value.map((item) => ({
                id: item,
                value: item,
              })),
            );
            onChangeGifts();
          }}
          style={{ minWidth: '125px' }}
        />
      ),
    },
    {
      header: 'Mã sản phẩm',
      accessor: 'product_code',
      formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.product_code}</b>,
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Tên sản phẩm',
      formatter: (p) => (p?.product_name?.length > 50 ? p?.product_name.slice(0, 47) + '...' : p?.product_name),
      classNameHeader: 'bw_text_center',
    },
    {
      header: 'Số lượng',
      accessor: 'quantity',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
    },
    {
      header: 'Đơn giá',
      accessor: 'total_price',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (p) => <b className='bw_sticky bw_name_sticky'>{0}</b>,
    },
    {
      header: 'Thành tiền',
      accessor: 'total_price',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_right',
      formatter: (p) => <b className='bw_sticky bw_name_sticky'>{0}</b>,
    },
    {
      header: 'Ghi chú',
      accessor: 'note',
      formatter: (p, idx) => (
        <input
          type='text'
          disabled={disabled}
          value={p?.note}
          onChange={({ target: { value } }) => setValue(`gifts[${idx}].note`, value)}
          className='bw_inp bw_mw_2'
          placeholder='Ghi chú'
        />
      ),
      classNameHeader: 'bw_text_center',
    },
  ];

  return (
    <BWAccordion title='Thông tin quà tặng' id='bw_info_cus' isRequired>
      <DataTable columns={columns} data={gifts || []} noPaging={true} noSelect={true} />
    </BWAccordion>
  );
};

export default Gifts;
