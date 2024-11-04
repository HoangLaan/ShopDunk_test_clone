import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { INSTALLMENT_TYPE, InstallmentTypeOptions } from 'pages/websiteDirectory/helpers/constans';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { options as getInstallmentOption } from 'services/installment-form.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import lodash from 'lodash';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const InstallmentForm = ({ id, title, disabled }) => {
  const methods = useFormContext();
  const { watch } = methods;
  const [installmentFormOption, setInstallmentFormOption] = useState([]);

  useEffect(() => {
    if (
      Object.values(watch('products'))?.length > 0 &&
      watch('sub_total_apply_discount') &&
      watch('installment_type')
    ) {
      getInstallmentOption({
        total_money: watch('sub_total_apply_discount'),
        product_ids: lodash
          .uniqBy(
            Object.values(watch('products')).map((_) => _.product_id),
            (item) => item,
          )
          .join('_'),
        installment_type: watch('installment_type'),
      }).then((data) => {
        setInstallmentFormOption(
          mapDataOptions4SelectCustom(data, 'installment_form_id', 'installment_form_name').map((item) => ({
            ...item,
            img: `${BASE_URL ?? ''}${item.installment_form_logo}` ?? 'bw_image/default_avatar_v2.png',
          })),
        );
      });
    }
  }, [watch('sub_total_apply_discount'), watch('products'), watch('installment_type')]);

  useEffect(() => {
    const installmentFormSelected = installmentFormOption?.find(
      (_) => _.installment_form_id === watch('installment_form_id'),
    );
    methods.setValue('installment_form_selected', installmentFormSelected);
  }, [watch('installment_form_id'), installmentFormOption]);

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Loại trả góp' isRequired={true} disabled={disabled}>
            <FormRadioGroup
              field='installment_type'
              list={InstallmentTypeOptions}
              disabled={disabled}
              validation={{ required: 'Loại trả góp là bắt buộc !' }}
            />
          </FormItem>
        </div>
        {watch('installment_type') ? (
          <div className='bw_col_12'>
            <FormItem label='Hình thức trả góp' isRequired={true} disabled={disabled}>
              <FormRadioGroup
                validation={{
                  required: 'Phương thức thanh toán là bắt buộc',
                }}
                field='installment_form_id'
                custom={true}
                list={installmentFormOption}
                disabled={disabled}
                style={{ marginBottom: '8px' }}
              />
            </FormItem>
          </div>
        ) : null}
      </div>
    </BWAccordion>
  );
};

export default InstallmentForm;
