import React from 'react';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFormContext } from 'react-hook-form';
import { getErrorMessage } from 'utils/index';
import { mapDataOptions4SelectCustom, showToast } from 'utils/helpers';

function ItemReview({ index, disabled, optionsMonth = [], remainPerMonth = [], item, update, remove }) {
  const methods = useFormContext();
  const { watch } = methods;

  const handleChangeFromMonth = async (value, opt) => {
    try {
      item.from_month = value;
      item.money_transfer = remainPerMonth[`Remain_Thang${value}`];
      update(index, item);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };
  const handleChangeMoneyTransfer = async (value, opt) => {
    try {
      const remain = remainPerMonth[`Remain_Thang${watch(`budget_transfer_list.${index}.from_month`)}`];
      if (value.target.value < remain) item.money_transfer = value.target.value;
      await update(index, item);
      document.getElementById(`budget_transfer${index}.money_transfer`).focus();
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };
  const handleChangeToMonth = async (value, opt) => {
    try {
      item.to_month = value;
      item.money_transfer = watch(`budget_transfer_list.${index}.money_transfer`);
      update(index, item);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <tr>
        <td className='bw_text_center'>{index + 1}</td>
        <td>
          <FormSelect
            id={`budget_transfer${index}.from_month`}
            className='bw_inp'
            field={`budget_transfer_list.${index}.from_month`}
            list={mapDataOptions4SelectCustom(optionsMonth)}
            onChange={handleChangeFromMonth}
            disabled={disabled}
            style={{ padding: '2px 8px' }}
          />
        </td>
        <td>
          <FormInput
            id={`budget_transfer${index}.money_transfer`}
            className='bw_inp'
            field={`budget_transfer_list.${index}.money_transfer`}
            type={'number'}
            onChange={handleChangeMoneyTransfer}
            disabled={disabled}
          />
        </td>
        <td>
          <FormSelect
            id={`budget_transfer${index}.to_month`}
            className='bw_inp'
            field={`budget_transfer_list.${index}.to_month`}
            list={mapDataOptions4SelectCustom(optionsMonth)}
            onChange={handleChangeToMonth}
            disabled={disabled}
            style={{ padding: '2px 8px' }}
          />
        </td>
        <td className='bw_text_center'>
          <a
            className='bw_btn_table bw_delete bw_red'
            title='Xoá'
            onClick={() => (disabled ? null : remove(index))}
            disabled={disabled}>
            <i className='fi fi-rr-trash'></i>
          </a>
        </td>
      </tr>
    </>
  );
}

export default ItemReview;
