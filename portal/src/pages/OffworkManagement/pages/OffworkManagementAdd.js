import FormSection from "components/shared/FormSection";
import { useCallback, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom/cjs/react-router-dom";
import { createOrUpdate,getDetail } from 'services/offwork-management.service';
import { showToast } from "utils/helpers";
const { default: BusinessApply } = require("../components/add/BusinessApply");
const { default: information } = require("../components/add/information");
const { default: Status } = require("../components/add/Status");

const defaultValues= {
    is_active: 1,
    monthly_time_can_off_unit: 1,
    monthly_time_can_off_cycle: 1,
    seniority_time_can_off_unit: 1,
    reset_time_can_off_cycle: 1
}

const OffworkManagementAdd = ()=> {
    const { id: time_can_off_policy_id } = useParams();
    const methods = useForm({
        ...defaultValues
    });
    const { pathname } = useLocation();
    const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

    const onSubmit = async (payload) => {
        try {
            const res = await createOrUpdate(payload);
            showToast.success('Thêm mới thành công.')
        } catch (error) {
            showToast.error('Có lỗi xảy ra.')
        }
    };

    const loadDetail = useCallback(() => {
       if(time_can_off_policy_id){
        getDetail(time_can_off_policy_id).then((value) => {
            methods.reset({
              ...value[0],
            });
          });
        } else {
          methods.reset({
            ...defaultValues
          });     
       }
    }, []);

    const detailForm = [
        {
            title: 'Miền áp dụng',
            id: 'businesapply',
            component: BusinessApply,
            fieldActive: ['store_list'],
        },
        {
            id: 'information',
            title: 'Thông tin chính sách quản lý phép tồn',
            component: information,
            fieldActive: ['reset_time_can_off_date'],
        },
        {
            id: 'status',
            title: 'Trạng thái',
            component: Status,
        },
    ];

    useEffect(loadDetail, [loadDetail]);


    return (
        <FormProvider {...methods}>
            <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
        </FormProvider>
    )
}

export default OffworkManagementAdd;