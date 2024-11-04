import { useFormContext, useFieldArray } from 'react-hook-form';
import { useEffect  , useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import ProductListTable from './ProductListTable';
// Services
import { getOptionsCategory } from 'services/stocks-detail.service';

const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
};

function ProductList({ title, disabled, productModelId }) {
  const methods = useFormContext();
  const { setValue, watch, control } = methods;
  const { fields, append } = useFieldArray({
    control,
    name: 'product_list',
  });
  const [category , setCategory] = useState({});
  const attribute_value_1 = methods.watch('attribute_value_1');
  const attribute_value_2 = methods.watch('attribute_value_2');
  const getListCategory = async () =>{
    try{
      let result = await getOptionsCategory();
      let objectCategory = (result || []).reduce((a, v) => ({ ...a, [v?.id]: v }), {});
      setCategory(objectCategory);
    }catch(error){
      console.error(error);
    }
  }
  
  useEffect(()=>{
    getListCategory();
  },[])

  useEffect(() => {
    if (!disabled && !productModelId) {
      if (attribute_value_1?.values?.length && attribute_value_2?.values?.length) {
        setValue('product_list', null);

        const model_code = watch('model_code')?.toUpperCase();
        const model_name = watch('model_name');
        const product_category_id = watch('product_category_id');

        let product_category = category[product_category_id];
        let counter = 0;
        attribute_value_1?.values.forEach((item, index) => {
          attribute_value_2?.values.forEach((item2, index2) => {
            counter++;

            append({
              value_name_1: item.label,
              value_name_2: item2.label,
              product_code: `${model_code || ''}${pad(counter, 3)}`,
              product_name: `${product_category?.name || ''} ${model_name || ''} ${item?.label || ''} ${item2?.label || ''} ${model_code || ''}${pad(counter, 3)}`,
              rowSpan: index2 === 0 ? attribute_value_2?.values.length : 0,
              is_default: index === 0 && index2 === 0,
              is_active: true,
              attributes: [
                { attribute_id: attribute_value_1?.attibute_id, values: [{ value: item.value }] },
                { attribute_id: attribute_value_2?.attibute_id, values: [{ value: item2.value }] },
              ],
            });
          });
        });
      }
    }
  }, [
    attribute_value_1?.attibute_id,
    attribute_value_1?.values,
    attribute_value_2?.attibute_id,
    attribute_value_2?.values,
    setValue,
    // watch(),
    watch('model_code'),
    watch('model_name'),
    append,
    disabled,
    productModelId,
  ]);

  return (
    <BWAccordion title={title} isRequired={true}>
      {Array.isArray(fields) && fields.length ? <ProductListTable disabled={disabled || productModelId} /> : null}
    </BWAccordion>
  );
}

export default ProductList;
