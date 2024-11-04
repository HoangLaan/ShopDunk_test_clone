import BWAccordion from 'components/shared/BWAccordion';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import BWButton from 'components/shared/BWButton';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import { getHistoryOrderList, getProStocksInventory } from 'pages/PurchaseOrderDivision/helpers/call-api';
import { calTotalOrderByProductAndStore, checkNullKey, findInventoryByProductAndStore, findMaxQuantityByProductAndStore, getDateBeforeDays, sumOfKeyInObject } from 'pages/PurchaseOrderDivision/helpers/helper';
import dayjs from 'dayjs';
function AutomaticForm({ title, disabled }) {
    const methods = useFormContext();
    const { watch, setValue } = methods;
    const stocksTypeOpts = useGetOptions(optionType.stocksType);

    const product_list = watch('product_list');
    const is_condition_history = watch('is_condition_history');
    const stocks_id = watch('stocks_id')

    useEffect(() => {
        if (!product_list || !is_condition_history) {
            return;
        }

        const findTypeMay = product_list?.filter((val) => val?.product_type === 1)
        const findTypePhuKien = product_list?.filter((val) => val?.product_type === 2)

        if (findTypeMay?.length > 0 && findTypePhuKien?.length === 0) {
            let result = getDateBeforeDays(15);
            setValue('history_plan_from', result)
            setValue('history_plan_to', dayjs().format('DD/MM/YYYY'))
        }else if (findTypePhuKien?.length > 0 && findTypeMay?.length === 0) {
            let result = getDateBeforeDays(43);
            setValue('history_plan_from', result)
            setValue('history_plan_to', dayjs().format('DD/MM/YYYY'))
        } else if (findTypePhuKien?.length > 0 && findTypeMay?.length > 0) {
            setValue('history_plan_from', null)
            setValue('history_plan_to', null)
        }

    }, [product_list, setValue, is_condition_history, stocks_id])

    const handleCalculate = async () => {
        const is_condition_inventory = watch('is_condition_inventory');
        const stocks_type_list = watch('stocks_type_list');
        const store_apply_list = methods.watch('store_apply_list') || [];
        //Reset field
        product_list.forEach((prod, idxPro) => {
            store_apply_list.forEach((store, idxStore) => {
                const FIELD_DK1 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk1_value`;
                const FIELD_DK2 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk2_value`;
                const FIELD_DK3 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk3_value`;
                setValue(FIELD_DK1, null);
                setValue(FIELD_DK2, null);
                setValue(FIELD_DK3, null);
            });
        });
        //Điều kiện 1
        if (is_condition_inventory && !stocks_type_list) {
            showToast.error('Chọn loại kho');
            return;
        }
        //Điều kiện 2
        const is_condition_plans = watch('is_condition_plans');
        if (is_condition_plans && checkNullKey(store_apply_list, 'condition_plan')) {
            showToast.error('Nhập kế hoạch bán hàng');
            return;
        }
        //Điều kiện 3
        // const is_condition_history = watch('is_condition_history');
        const history_plan_from = watch('history_plan_from');
        const history_plan_to = watch('history_plan_to');
        if (is_condition_history && !history_plan_from && !history_plan_to) {
            showToast.error('Chọn thời gian của lịch sử chia hàng');
            return;
        }
        // Lấy các conditions
        //Điều kiện 1
        let proStocksInventory = null;
        if (is_condition_inventory && stocks_type_list) {
            proStocksInventory = await getProStocksInventory({
                stocks_type_list: watch('stocks_type_list'),
                store_apply_list: store_apply_list,
                product_list: product_list,
            }) || [];
            // Lấy ra tồn kho tối thiếu (nếu tồn tại 2 tồn kho tối thiểu của sản phầm && cửa hàng: lấy tồn kho tối thiểu lớn hơn)
            product_list.forEach((prod, idxPro) => {
                store_apply_list.forEach((store, idxStore) => {
                    const FIELD_MINVALUE = `store_apply_list.${idxStore}.product_division.${idxPro}.min_value`;
                    const FIELD_INVENTORY = `store_apply_list.${idxStore}.product_division.${idxPro}.inventory`;
                    const FIELD_NEEDED = `store_apply_list.${idxStore}.product_division.${idxPro}.needed`;
                    const minValue = findMaxQuantityByProductAndStore(proStocksInventory, prod.product_id, store.store_id);
                    const inventory = findInventoryByProductAndStore(proStocksInventory, prod.product_id, store.store_id);
                    setValue(FIELD_MINVALUE, minValue);
                    setValue(FIELD_INVENTORY, inventory);
                    setValue(FIELD_NEEDED, minValue - inventory);
                });
            });
        }
        //Điều kiện 2
        //Điều kiện 3
        let historyOrderList = null;
        if (is_condition_history && history_plan_from && history_plan_to) {
            historyOrderList = await getHistoryOrderList({
                store_apply_list: store_apply_list,
                product_list: product_list,
                from_day: history_plan_from,
                to_day: history_plan_to,
            }) || [];

            product_list.forEach((prod, idxPro) => {
                store_apply_list.forEach((store, idxStore) => {
                    const FIELD = `store_apply_list.${idxStore}.product_division.${idxPro}.buy_number_value`;
                    let buy_value = calTotalOrderByProductAndStore(historyOrderList, prod.product_id, store.store_id) || 0;
                    setValue(FIELD, buy_value);
                });
            });
        }
        // ***** Tính để chia hàng *****
        product_list.forEach((prod, idxPro) => {
            const total_quantity_can_division = (prod?.total_in ?? 0) - (prod?.total_out ?? 0) || 0; // Số lượng sản phẩm nằm trong kho có thể chia
            let total_remaining = (prod?.total_in ?? 0) - (prod?.total_out ?? 0) || 0; // biến dùng để count số lượng còn lại có thể chia
            let expectedTotalDK1 = 0;
            let expectedTotalDK2 = 0;
            let expectedTotalDK3 = 0;
            store_apply_list.forEach((store, idxStore) => {
                if (is_condition_inventory) { // nếu checkbox chọn điều kiện 1
                    store.product_division[idxPro].needed = +store.product_division[idxPro].needed >= 0 ? +store.product_division[idxPro].needed : 0
                    expectedTotalDK1 += (+store.product_division[idxPro].needed);
                }
                if (is_condition_plans) {// nếu checkbox chọn điều kiện 2
                    store.product_division[idxPro].condition_plan = +store.product_division[idxPro].condition_plan >= 0 ? +store.product_division[idxPro].condition_plan : 0
                    expectedTotalDK2 += (+store.product_division[idxPro].condition_plan);
                }
                if (is_condition_history) {// nếu checkbox chọn điều kiện 3
                    store.product_division[idxPro].buy_number_value = +store.product_division[idxPro].buy_number_value >= 0 ? +store.product_division[idxPro].buy_number_value : 0
                    expectedTotalDK3 += (+store.product_division[idxPro].buy_number_value);
                }
            });
            if (expectedTotalDK1 && total_quantity_can_division >= expectedTotalDK1) { // Trường hợp đủ hàng để chia cho điều kiện 1
                store_apply_list.forEach((store, idxStore) => {
                    const FIELD_DK1 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk1_value`;
                    total_remaining = total_remaining - (+store.product_division[idxPro].needed);
                    setValue(FIELD_DK1, +store.product_division[idxPro].needed);
                });
            } else if (expectedTotalDK1 && total_quantity_can_division < expectedTotalDK1) { // Trường hợp không đủ hàng để chia cho điều kiện 1
                store_apply_list.forEach((store, idxStore) => {
                    const FIELD_DK1 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk1_value`;
                    //Tính tỉ lệ của từng cửa hàng
                    if (store_apply_list.indexOf(store) === store_apply_list.length - 1) { // nếu là cửa hàng cuối thì set giá trị còn lại
                        setValue(FIELD_DK1, total_remaining);
                        total_remaining = total_remaining - total_remaining;
                    } else {
                        let _division_quantity = Math.ceil(((+store.product_division[idxPro].needed) / expectedTotalDK1) * total_quantity_can_division); // làm tròn trên
                        _division_quantity = (total_remaining >= _division_quantity) ? _division_quantity : (_division_quantity - 1) // kiểm tra khi làm tròn có vượt quá ngưỡng có thể được chia chưa nếu vượt thì trừ đi 1
                        total_remaining = total_remaining - _division_quantity;
                        setValue(FIELD_DK1, _division_quantity);
                    }
                });
            }
            if (expectedTotalDK2 && total_remaining >= expectedTotalDK2) { // Trường hợp đủ hàng để chia cho điều kiện 2
                store_apply_list.forEach((store, idxStore) => {
                    const FIELD_DK2 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk2_value`;
                    total_remaining = total_remaining - (+store.product_division[idxPro].condition_plan);
                    setValue(FIELD_DK2, +store.product_division[idxPro].condition_plan);
                });
            } else if (expectedTotalDK2 && total_remaining < expectedTotalDK2) { // Trường hợp không đủ hàng để chia cho điều kiện 2
                //Copy 1 biến lưu số lượng còn lại có thể chia với điều kiện 2
                const total_quantity_can_division_dk2 = total_remaining;
                store_apply_list.forEach((store, idxStore) => {
                    const FIELD_DK2 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk2_value`;
                    //Tính tỉ lệ của từng cửa hàng
                    if (store_apply_list.indexOf(store) === store_apply_list.length - 1) { // nếu là cửa hàng cuối thì set giá trị còn lại
                        setValue(FIELD_DK2, total_remaining);
                        total_remaining = total_remaining - total_remaining;
                    } else {
                        let _division_quantity = Math.ceil(((+store.product_division[idxPro].condition_plan) / expectedTotalDK2) * total_quantity_can_division_dk2); // làm tròn trên
                        _division_quantity = (total_remaining >= _division_quantity) ? _division_quantity : (_division_quantity - 1)
                        total_remaining = total_remaining - _division_quantity;
                        setValue(FIELD_DK2, _division_quantity);
                    }
                });
            }
            // Chia hàng điều kiện 3 
            if (expectedTotalDK3 && total_remaining >= expectedTotalDK3) {// Trường hợp đủ hàng để chia cho điều kiện 3
                store_apply_list.forEach((store, idxStore) => {
                    const FIELD_DK3 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk3_value`;
                    total_remaining = total_remaining - (+store.product_division[idxPro].buy_number_value);
                    setValue(FIELD_DK3, +store.product_division[idxPro].buy_number_value);
                });
            } else if (expectedTotalDK3 && total_remaining < expectedTotalDK3) {
                //Copy 1 biến lưu số lượng còn lại có thể chia với điều kiện 3
                const total_quantity_can_division_dk3 = total_remaining;
                store_apply_list.forEach((store, idxStore) => {
                    const FIELD_DK3 = `store_apply_list.${idxStore}.product_division.${idxPro}.dk3_value`;
                    //Tính tỉ lệ của từng cửa hàng
                    if (store_apply_list.indexOf(store) === store_apply_list.length - 1) { // nếu là cửa hàng cuối thì set giá trị còn lại
                        setValue(FIELD_DK3, total_remaining);
                        total_remaining = total_remaining - total_remaining;
                    } else {
                        let _division_quantity = Math.ceil(((+store.product_division[idxPro].buy_number_value) / expectedTotalDK3) * total_quantity_can_division_dk3); // làm tròn trên
                        _division_quantity = (total_remaining >= _division_quantity) ? _division_quantity : (_division_quantity - 1)
                        total_remaining = total_remaining - _division_quantity;
                        setValue(FIELD_DK3, _division_quantity);
                    }
                });
            }
            //Số được chia cho cửa các cửa hàng
            store_apply_list.forEach((store, idxStore) => {
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.product_id`, prod.product_id);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.purchase_order_detail_id`, prod.purchase_order_detail_id);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.unit_id`, prod.unit_id);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.quantity`, prod.quantity);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.cost_price`, prod.cost_price);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.total_price`, prod.total_price);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.total_cost_basic_imei`, prod.total_cost_basic_imei);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.cost_basic_imei_code`, prod.cost_basic_imei_code);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.cost`, prod.cost);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.total_price_cost`, prod.total_price_cost);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.total_product_cost`, prod.total_product_cost);
                setValue(`store_apply_list.${idxStore}.product_division.${idxPro}.cost_per_quantity`, prod.cost_per_quantity);
                const FIELD_DIVISION = `store_apply_list.${idxStore}.product_division.${idxPro}.division_quantity`;
                const division_quatity = (+watch(`store_apply_list.${idxStore}.product_division.${idxPro}.dk1_value`) || 0) + (watch(`store_apply_list.${idxStore}.product_division.${idxPro}.dk2_value`) || 0) + (watch(`store_apply_list.${idxStore}.product_division.${idxPro}.dk3_value`) || 0)
                setValue(FIELD_DIVISION, division_quatity);
            });
        });
    }

    return (
        <BWAccordion title={title}>
            <div className='bw_row'>
                <div className='bw_col_6'>
                    <FormItem label='Điều Kiện 1' disabled={disabled}>
                        <div className='bw_frm_box'>
                            <label className='bw_checkbox'>
                                <FormInput
                                    disabled={disabled}
                                    type='checkbox'
                                    field='is_condition_inventory'
                                    onChange={(e) => {
                                        setValue('is_condition_inventory', e.target.checked);
                                        setValue('stocks_type_list', undefined);
                                    }}
                                />
                                <span />
                                Chia theo Tồn kho cơ bản tối thiểu
                            </label>
                        </div>
                    </FormItem>
                </div>
                {watch('is_condition_inventory') && (
                    <div className='bw_col_6'>
                        <FormItem label='Loại kho' isRequired={true} disabled={disabled}>
                            <FormSelect
                                allowClear={true}
                                placeholder='--Chọn--'
                                mode='multiple'
                                field='stocks_type_list'
                                list={stocksTypeOpts}
                                validation={{
                                    required: 'Loại kho là bắt buộc',
                                }}
                                disabled={disabled}
                            />
                        </FormItem>
                    </div>
                )}
            </div>
            <div className='bw_row'>
                <div className='bw_col_6'>
                    <FormItem label='Điều Kiện 2' disabled={disabled}>
                        <div className='bw_frm_box'>
                            <label className='bw_checkbox'>
                                <FormInput disabled={disabled}
                                    type='checkbox'
                                    field='is_condition_plans'
                                    onChange={(e) => {
                                        setValue('is_condition_plans', e.target.checked);
                                    }} />
                                <span />
                                Chia theo Kế hoạch bán hàng
                            </label>
                        </div>
                    </FormItem>
                </div>
            </div>
            <div className='bw_row'>
                <div className='bw_col_6'>
                    <FormItem label='Điều Kiện 3' disabled={disabled}>
                        <div className='bw_frm_box'>
                            <label className='bw_checkbox'>
                                <FormInput
                                    disabled={disabled}
                                    type='checkbox'
                                    field='is_condition_history'
                                    onChange={(e) => {
                                        setValue('is_condition_history', e.target.checked);
                                        setValue('history_plan_from', undefined);
                                        setValue('history_plan_to', undefined);
                                    }}
                                />
                                <span />
                                Chia theo Lịch sử bán hàng
                            </label>
                        </div>
                    </FormItem>
                </div>
                {watch('is_condition_history') && (
                    <div className='bw_col_6'>
                        <FormItem label='Thời gian' isRequired={true} disabled={disabled}>
                            <FormDateRange
                                allowClear={true}
                                fieldStart={'history_plan_from'}
                                fieldEnd={'history_plan_to'}
                                placeholder={['Từ ngày', 'Đến ngày']}
                                format={'DD/MM/YYYY'}
                            />
                        </FormItem>
                    </div>
                )}
            </div>
            <BWButton
                style={{
                    marginLeft: '3px',
                }}
                content={'Tiến hành chia hàng'}
                type={'success'}
                icon={ICON_COMMON.edit}
                hidden={disabled}
                onClick={() => handleCalculate()}
            />
        </BWAccordion>
    );
}

export default AutomaticForm;
