import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert } from 'antd';

//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import { PANEL_TYPES } from '../contain/contain';
import Panel from 'components/shared/Panel/index';
import ModelAttribute from './ComponetPanel/ModelAttribute';
import Model from './ComponetPanel/Model';

const ProductList = ({ id, title, disabled }) => {
  const methods = useFormContext();
  const {
    formState: { errors },
  } = methods;
    const panels = [
    {
      key: PANEL_TYPES.MODEL,
      label: 'Model',
      noActions: true,
      component: Model,
      disabled: disabled,
    },
    {
      key: PANEL_TYPES.MODEL_ATTRIBUTE,
      label: 'Kết hợp với thuộc tính',
      component: ModelAttribute,
      disabled: disabled,
    },
  ];

  return (
    <React.Fragment>
      <BWAccordion title={title} id={id}>
        {errors['product_list'] && <Alert type={'error'} message={errors['product_list']?.message} showIcon />}
        <Panel panes={panels}/>
      </BWAccordion>
    </React.Fragment>
  );
};

export default ProductList;
