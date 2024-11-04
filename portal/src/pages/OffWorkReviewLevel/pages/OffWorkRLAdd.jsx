import React, { useCallback, useEffect, useState } from "react"
import { FormProvider, useForm } from 'react-hook-form'
import { notification } from 'antd'
import { update, create, read } from '../helpers/call-api'

//compnents

import { mapDataOptions4Select } from "utils/helpers"
import { defaultValues } from "../helpers/const"
import { getOptionsDepartment } from "services/department.service"
import OffWorkRLStatus from "../components/add/OffWorkRLStatus"
import FormSection from "components/shared/FormSection/index"
import OffWorkRLInfor from "../components/add/OffWorkRLInfor"
import { getOptionsCompany } from "services/company.service"


const OffWorkRLAdd = ({ offworkRLId = null, isEdit = true }) => {
    const methods = useForm({ defaultValues: defaultValues })

    const [companyOpts, setCompanyOpts] = useState([])
    const [departmentOpts, setDepartmentOpts] = useState([{ value: -1, label: "Tất cả phòng ban" }])

    const {
        register,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = methods

    const getInitData = useCallback(async () => {

        try {

            const _companyOpts = await getOptionsCompany()

            setCompanyOpts(mapDataOptions4Select(_companyOpts))

            // Kiểm xem nếu chỉ có 1 công ty mặc định chọn 1
            if (_companyOpts && _companyOpts.length == 1) {

                methods.setValue('company_id', _companyOpts[0].id)
            }

            if (offworkRLId) {
                const offworkRL = await read(offworkRLId)
                // dk is_apply_all_department =1
                const departments = offworkRL?.is_apply_all_department ? [{ value: -1 }] : offworkRL?.departments

                // dk is_apply_all_position =1
                const positions = offworkRL?.is_apply_all_position ? [{ value: -1 }] : offworkRL?.positions

                reset({ ...offworkRL, departments, positions })
            }
        } catch (error) {
            notification.error({
                message: 'Đã xảy ra lỗi vui lòng thử lại'
            })
        }

    }, [])

    useEffect(() => {
        getInitData()
    }, [getInitData])

    useEffect(() => {
        register('is_active')

    }, [register])


    const onSubmit = async (values) => {

        let formData = { ...values }

        try {
            if (offworkRLId) {
                await update(offworkRLId, formData);
                notification.success({
                    message: 'Cập nhật mức duyệt nghỉ phép thành công'
                })
            } else {
                await create(formData)
                notification.success({
                    message: 'Thêm mới mức duyệt nghỉ phép thành công'
                })
                reset(defaultValues)

            }
        } catch (error) {
            let { message } = error
            notification.error({
                message: message ? message : 'Lỗi thêm mới mức duyệt.'
            })
        }
    }

    const detailForm = [
        {
            id: 'information',
            title: 'Thông tin chính',
            component: OffWorkRLInfor,
            fieldActive: ['review_level_name', 'company_id'],
            companyOpts:companyOpts

        },

        {
            id: 'status', title: 'Trạng thái',
            component: OffWorkRLStatus,
            fieldActive: ['is_active'],
        }
    ];

    return (
        <FormProvider {...methods}>
            <FormSection
                detailForm={detailForm}
                onSubmit={onSubmit}
                disabled={!methods.watch('is_can_edit') ? true : !isEdit}
            />
        </FormProvider>
    )
}

export default OffWorkRLAdd