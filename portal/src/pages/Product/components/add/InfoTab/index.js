import React from 'react';
import { useFormContext } from 'react-hook-form';

// Compnents
import FormSection from 'components/shared/FormSection/index';
import Info from './Info';
import Images from './Images';
import AttributesTable from './AttributesTable';
import Description from './Description';
import Status from './Status';
import Keypoints from './Keypoints';

export default function InfoTab({ loading, disabled }) {
  const methods = useFormContext();

  const autoGenName = () => {
    let product_name_base = [
      methods.watch('product_category_name'),
      methods.watch('manufacture_name'),
      methods.watch('product_model_name'),
    ]
      .concat(
        (methods.watch('attributes') || []).map(
          (item) => item.attribute_values.find((i) => i.id === item.values)?.label,
        ),
      )
      .concat(methods.watch('product_code'));

    product_name_base = product_name_base.filter((item) => item?.trim()).join(' ');
    methods.setValue('product_name', product_name_base);
  };

  const detailForm = [
    {
      title: 'Thông tin hàng hoá - vật tư',
      id: 'information',
      fieldActive: [
        'product_code',
        'product_name',
        'manufacture_id',
        'product_category_id',
        'product_display_name',
        'unit_id',
        'model_id',
        'origin_id',
      ],
      component: Info,
      autoGenName: autoGenName,
    },
    {
      title: 'Ảnh hàng hoá - vật tư',
      id: 'pictures',
      fieldActive: ['images'],
      component: Images,
    },
    {
      title: 'Thuộc tính hàng hoá - vật tư',
      id: 'attributes',
      fieldActive: ['attributes'],
      component: AttributesTable,
      autoGenName: autoGenName,
    },
    {
      title: 'Mô tả',
      id: 'description',
      component: Description,
    },
    {
      title: 'Keypoints',
      id: 'keypoints',
      component: Keypoints,
    },
    {
      title: 'Trạng thái',
      id: 'status',
      component: Status,
    },
  ];

  return <FormSection loading={loading} disabled={disabled} detailForm={detailForm} />;
}
