import FormInput from 'components/shared/BWFormControl/FormInput';
import React, { useMemo, useState } from 'react'
import './style.scss'
import { showToast } from 'utils/helpers';
import { updateBudgetDistriBution } from '../helper/call-api';

const ItemBudgetPlan = ({ valueRender, keyValue, methods }) => {

    const { setValue } = methods
    const [isUpdate, setIsUpdate] = useState(false)
    const handleOnBlurBudgetPlanDistriBution = async (e, keyMonth) => {
        let value = Number(e.target.value)
        if (value < 0) {
            showToast.warning('Vui lòng nhập số lớn hơn 0')
            return
        }
        try {
            if (isUpdate) {
                await updateBudgetDistriBution(valueRender[keyMonth])
                showToast.success('Cập nhật kế hoạch thành công')
                setIsUpdate(false)
            }
            return;
        } catch (error) {
            showToast.error(error.message)

        }
    }

    const handleOnChange = (e, key) => {
        setIsUpdate(true)
        setValue(key, e.target.value)
    }

    const handleOnKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.target.blur()
        }
    }

    const column = useMemo(() => [
        {
            month: 'january',
            keyValueRender: `${keyValue}.january.budget_plan_distribution_plan`
        },
        {
            month: 'february',
            keyValueRender: `${keyValue}.february.budget_plan_distribution_plan`
        },
        {
            month: 'march',
            keyValueRender: `${keyValue}.march.budget_plan_distribution_plan`
        },
        {
            month: 'april',
            keyValueRender: `${keyValue}.april.budget_plan_distribution_plan`
        },
        {
            month: 'may',
            keyValueRender: `${keyValue}.may.budget_plan_distribution_plan`
        },
        {
            month: 'june',
            keyValueRender: `${keyValue}.june.budget_plan_distribution_plan`
        },
        {
            month: 'july',
            keyValueRender: `${keyValue}.july.budget_plan_distribution_plan`
        },
        {
            month: 'august',
            keyValueRender: `${keyValue}.august.budget_plan_distribution_plan`
        },
        {
            month: 'september',
            keyValueRender: `${keyValue}.september.budget_plan_distribution_plan`
        },
        {
            month: 'october',
            keyValueRender: `${keyValue}.october.budget_plan_distribution_plan`
        },
        {
            month: 'november',
            keyValueRender: `${keyValue}.november.budget_plan_distribution_plan`
        },
        {
            month: 'december',
            keyValueRender: `${keyValue}.december.budget_plan_distribution_plan`
        },
    ], [])

    const dataRender = column.map((item, index) => {
        const keyMonth = item.month
        return (
            <td key={index}>
                {valueRender[keyMonth] ? (
                    <div>
                        <span>
                            {valueRender[keyMonth]?.budget_plan_distribution_used}
                            {' '}
                            /
                        </span>
                        <FormInput
                            field={item.keyValueRender}
                            onBlur={(e) => handleOnBlurBudgetPlanDistriBution(e, keyMonth)}
                            type='number'
                            style={{
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                width: '50px',
                                textAlgin: 'center'
                            }}
                            onChange={(e) => handleOnChange(e, item.keyValueRender)}
                            onKeyDown={(e) => handleOnKeyDown(e)}
                        />
                    </div>
                ) : null}
            </td>
        )

    })



    return (
        <React.Fragment>
            {dataRender}
        </React.Fragment>
    )
}

export default ItemBudgetPlan