import React, { useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import PayByPartner from './FormDetail/PayByPartner';
import { getOptions as getInstallmentPartnerOptions } from 'services/installment-partner.service';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { INSTALLMENT_TYPE } from 'pages/InstallmentForm/utils/constant';
import { useFormContext } from 'react-hook-form';

const InstallmentFormInfo = ({ disabled, title, id }) => {
  const [payPartnerOptions, setPayPartnerOptions] = useState([]);
  const methods = useFormContext();
  const { watch, getValues, clearErrors, reset } = methods;

  useEffect(() => {
    getInstallmentPartnerOptions({ installmentType: watch('installment_type') }).then((data) => {
      setPayPartnerOptions(
        mapDataOptions4SelectCustom(data, 'installment_partner_id', 'installment_partner_name').map((item) => ({
          ...item,
          img: item.installment_partner_logo ?? 'bw_image/default_avatar_v2.png',
        })),
      );
    });
  }, [watch('installment_type')]);

  useEffect(() => {
    if (getValues('installment_type') === INSTALLMENT_TYPE.CARD) {
      reset({ ...getValues() });
    }
    clearErrors('installment_period');
  }, [watch('installment_type')]);

  useEffect(() => {
    const id = watch('installment_partner_id');
    if (id) {
      const selected = payPartnerOptions.find((_) => _.value === id);
      if (selected) {
        methods.setValue('installment_partner_period_options', selected?.period_list || []);
      }
    }
  }, [watch('installment_partner_id'), payPartnerOptions]);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <FormItem className='bw_col_6' disabled={disabled} isRequired label='Loại'>
              <FormRadioGroup
                field='installment_type'
                list={[
                  { key: 1, value: INSTALLMENT_TYPE.CARD, label: 'Trả góp qua thẻ' },
                  { key: 0, value: INSTALLMENT_TYPE.COMPANY, label: 'Qua công ty tài chính' },
                ]}
              />
            </FormItem>
          </div>
        </div>

        <div className='bw_col_12'>
          <FormItem disabled={disabled} isRequired label='Đối tác trả góp'>
            <FormRadioGroup
              custom
              field='installment_partner_id'
              validation={{ required: 'Đối tác trả góp là bắt buộc !' }}
              list={payPartnerOptions}
            />
          </FormItem>
        </div>

        {methods.watch('installment_type') === INSTALLMENT_TYPE.COMPANY ? <PayByPartner /> : null}
      </div>
    </BWAccordion>
  );
};

export default InstallmentFormInfo;
