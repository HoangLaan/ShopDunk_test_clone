import React, {useCallback, useEffect, useState} from 'react';
import {useFormContext, useFieldArray} from 'react-hook-form';
import ItemReview from './ItemTransfer';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import {mapDataOptions4SelectCustom} from "utils/helpers";
import {getBudgetDetailPerMonth} from "services/budget-plan.service";

function DetailTransferTable({disabled, idPlan}) {
  const methods = useFormContext();
  const {
    watch,
    formState: {errors},
    control,
    clearErrors,
  } = methods;

  const [monthOptions, setMonthOptions] = useState([])
  const initRender = useCallback(() => {
    for (let i = 1; i <= 12; i++)
      monthOptions.push({id: i, label: `Tháng ${i}`})
    setMonthOptions(mapDataOptions4SelectCustom(monthOptions))
  }, [])
  useEffect(initRender, [initRender])

  const [remainPerMonth, setRemainPerMonth] = useState({})
  const getRemainPerMonth = useCallback(() => {
    if (watch("budget_id_from"))
      getBudgetDetailPerMonth({
        budget_plan_id: idPlan,
        department_id: watch('department'),
        budget_id: watch('budget_id_from')
      }).then((res) => {
        setRemainPerMonth(res)
      })
  }, [watch('budget_id_from')])

  useEffect(getRemainPerMonth, [getRemainPerMonth])


  const validateTransfer = (field) => {

    if (!field || field.length === 0) {
      return 'Vui lòng thêm thông tin chuyển';
    }

    const checkInfoTransfer = field.findIndex((item, index) => {
      return !item.from_month || !item.money_transfer || !item.to_month;
    });
    if (checkInfoTransfer !== -1) {
      return `Vui lòng nhập thông tin chuyển ở dòng thứ ${checkInfoTransfer + 1}`;
    }

    let checkDuplicate = -1
    for (let i = 0; i < field.length; i++)
      for (let j = i + 1; j < field.length; j++) {
        if (field[j].from_month == field[i].from_month) {
          checkDuplicate = field[i].from_month
        }
      }
    if (checkDuplicate !== -1) {
      return `Vui thể chuyển nhiều lần ngân sách tháng ${checkDuplicate}`;
    }
    return '';
  };

  const {fields, update, remove, insert} = useFieldArray({
    control,
    name: 'budget_transfer_list',
    rules: {
      required: false,
      validate: (field) => {
        let msg = validateTransfer(field);
        if (msg) return msg;
        else {
          if (errors['budget_transfer_list'])
            clearErrors('budget_transfer_list')
        }
      },
    },
  });

  const handleAddReview = () => {
    let _reviews = [...(watch('budget_transfer_list') || [])];
    let checkReview = (watch('budget_transfer_list') || []).find(
      (p) => !p?.from_month || !p?.to_month || !p?.money_transfer
    );
    if (!checkReview || !_reviews.length) {
      insert(_reviews.length + 1, {
        from_month: null,
        to_month: null,
        money_transfer: null
      });
    }

  };

  return (
    <React.Fragment>
      <table className='bw_table'>
        <thead>
        <tr>
          <th className='bw_text_center'>STT</th>
          <th className='bw_text_center'>Tháng chuyển</th>
          <th className='bw_text_center'>Số tiền chuyển</th>
          <th className='bw_text_center'>Tháng nhận</th>
          <th className='bw_text_center'>Thao tác</th>

        </tr>
        </thead>
        <tbody>
        {fields && fields.length ? (
          fields.map((p, i) => {
            return (
              <ItemReview
                key={p.id}
                index={i}
                disabled={disabled}
                remainPerMonth={remainPerMonth}
                item={p}
                optionsMonth={monthOptions}
                update={update}
                insert={insert}
                remove={remove}
              />
            );
          })
        ) : (
          <tr>
            <td colSpan={50} className='bw_text_center'>
              Không có dữ liệu
            </td>
          </tr>
        )}
        </tbody>
      </table>
      {errors['budget_transfer_list'] && <ErrorMessage message={errors?.budget_transfer_list?.root?.message}/>}
      {!disabled ? (
        <a data-href='' className='bw_btn_outline bw_btn_outline_success bw_add_us' onClick={handleAddReview}>
          <span className='fi fi-rr-plus'></span> Thêm
        </a>
      ) : null}
    </React.Fragment>
  );
}

export default DetailTransferTable;
