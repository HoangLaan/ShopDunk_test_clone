import React, { useCallback, useEffect, useState } from "react"
import { useFormContext } from 'react-hook-form'
import { notification } from 'antd'
//compnents
import BWAccordion from 'components/shared/BWAccordion/index'
import FormItem from 'components/shared/BWFormControl/FormItem'
import FormInput from 'components/shared/BWFormControl/FormInput'
import FormSelect from "components/shared/BWFormControl/FormSelect"
import { getOptionsCompany } from "services/company.service"
import { mapDataOptions4Select } from "utils/helpers"
import { getOptionsPosition } from "services/position.service"
import { getOptionsDepartment } from "services/department.service"
import { isArray } from "lodash"
import { msgError } from "pages/OffWorkReviewLevel/helpers/msgError"


const OffWorkRLInfor = ({ disabled, companyOpts = [] }) => {
    const methods = useFormContext()

    const [positionOpts, setPositionOpts] = useState([{ value: -1, label: "Tất cả chức vụ" }])
    const [departmentOpts, setDepartmentOpts] = useState([{ value: -1, label: "Tất cả phòng ban" }])

    const {
        register,
        watch,
        setValue,
        formState: { errors }
    } = methods


    const getInitData = useCallback(async () => {

        try {
            // Lấy danh sách chức vụ
            const _positionOpts = await getOptionsPosition()
            setPositionOpts(positionOpts.concat(mapDataOptions4Select(_positionOpts)))

        } catch (error) {
            notification.error({
                message: 'Đã xảy ra lỗi vui lòng thử lại'
            })
        }


    }, [])

    useEffect(() => {
        getInitData()
    }, [getInitData])


    const handlegetOffworkRLOptions = useCallback(async () => {

        if (watch('company_id')) {
            try {

                const _departmentOpts = await getOptionsDepartment()
                setDepartmentOpts(departmentOpts.concat(mapDataOptions4Select(_departmentOpts)))

            } catch (error) {
                console.log(error)
            }
        }

    }, [watch('company_id')])

    useEffect(() => { handlegetOffworkRLOptions() }, [handlegetOffworkRLOptions])

    const onChangeDepartment = useCallback(() => {
        if (watch('departments')) {
            const departments = watch('departments')
            const is_apply_all_department = (departments || []).filter((x) => x.value * 1 == -1).length ? 1 : 0
            setValue('is_apply_all_department', is_apply_all_department)
        }

    }, [watch('departments')])

    useEffect(() => {
        onChangeDepartment()
    }, [onChangeDepartment])


    const onChangePosition = useCallback(() => {
        if (watch('positions')) {
            const positions = watch('positions')
            const is_apply_all_position = (positions || []).filter((x) => x.value * 1 == -1).length ? 1 : 0
            setValue('is_apply_all_position', is_apply_all_position)
        }

    }, [watch('positions')])

    useEffect(() => {
        onChangePosition()
    }, [onChangePosition])




    const optionRender = (options = [], key) => {
        let _option = [...options]
        // Kiểm tra xem nếu đã chọn tất cả phòng ban

        if (isArray(watch(key))) {
            const isCheckAll = (watch(key) || []).filter((k) => k.value * 1 === -1).length;
            _option = options.map((_item) => {
                return {
                    ..._item,
                    disabled: _item?.value > -1 && isCheckAll ? true : false
                }
            })

        }
        return _option
    }


    return (

        <BWAccordion title='Thông tin' id='bw_info_cus' isRequired={true}>
            <div className="bw_row">
                <FormItem label='Tên mức duyệt' className='bw_col_6' isRequired={true} disabled={disabled}>
                    <FormInput type="text" field='review_level_name'
                        placeholder="Tên mức duyệt"

                        validation={msgError['review_level_name']}
                    />
                </FormItem>

                <FormItem label='Công ty áp dụng' className='bw_col_6' isRequired={true} disabled={disabled}>
                    <FormSelect
                        field='company_id'
                        id='company_id'
                        list={companyOpts}
                        allowClear={true}
                        validation={msgError['company_id']}
                    />
                </FormItem>

                <FormItem label='Phòng ban duyệt' className='bw_col_6' isRequired={true} disabled={disabled}>
                    <FormSelect
                        field='departments'
                        id='departments'
                        list={optionRender(departmentOpts, 'departments')}
                        allowClear={true}
                        mode={'tags'}
                        validation={{
                            required:'Phòng ban duyệt là bắt buộc.'
                        }}
                    />
                </FormItem>

                <FormItem label='Vị trí duyệt' className='bw_col_6' isRequired={true} disabled={disabled}>
                    <FormSelect field='positions' id='positions'
                        list={optionRender(positionOpts, 'positions')}
                        allowClear={true}
                        mode={'tags'}
                        validation={{
                            required:'Chức vụ duyệt là bắt buộc.'
                        }}
                    />
                </FormItem>
            </div>
        </BWAccordion>



    )
}

export default OffWorkRLInfor