import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useFormContext } from 'react-hook-form';

// Components
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormItem from 'components/shared/BWFormControl/FormItem';
// Services
import {
    getOptionsArea,
    getOptionsStore,
    getOptionsStock,
    getOptionsBusiness,
    getOptionsOuputType,
    getOptionsStockInRequest,
} from 'services/product.service';
// Utils
import { mapDataOptions4Select, mapDataOptions4SelectCustom } from 'utils/helpers';
import dayjs from 'dayjs';

export default function Info() {
    const methods = useFormContext();

    const [optionsStore, setOptionStore] = useState(null);
    const [optionsStock, setOptionsStock] = useState(null);
    const [optionsOutputType, setOptionsOutputType] = useState(null);
    const [optionsArea, setOptionsArea] = useState(null);
    const [optionsBusiness, setOptionsBusiness] = useState(null);
    const [optionsStockInRequest, setOptionsStockInRequest] = useState(null);

    const fetchOptionsStore = (search) => getOptionsStore({ search, limit: 100 });
    const storeId = methods.watch('store')?.value
    const areaId = methods.watch('area')
    const stockId = methods.watch('stock')

    useEffect(() => {
        getData();
    }, []);

    const defaultDateFrom = methods.watch('from_date')
    const defaultDateTo = methods.watch('to_date')

    useEffect(() => {
        if (!defaultDateFrom) {
            methods.setValue('from_date', dayjs().format('DD/MM/YYYY'));
        }
        if (!defaultDateTo) {
            methods.setValue('to_date', dayjs().format('DD/MM/YYYY'));
        }
    }, [defaultDateFrom, defaultDateTo, methods]);

    const getData = async () => {
        try {
            // Get options store
            const stores = await fetchOptionsStore();
            setOptionStore(stores);

            // Get options area
            const areas = await getOptionsArea();
            setOptionsArea(mapDataOptions4Select(areas));

            // Get options output type
            const outputTypes = await getOptionsOuputType();
            setOptionsOutputType(mapDataOptions4Select(outputTypes));
            if (!methods.watch('output_type')) {
                const optionDefault = outputTypes?.find((item)=> item?.order_index === 1)
                methods.setValue('output_type', optionDefault?.id)
            }
              
        } catch (error) {
            notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
        }
    };

    useEffect(() => {
        // Get options stock
        getOptionsStocks();
    }, [storeId]);

    const getOptionsStocks = async () => {
        try {
            let params = {}
            if (storeId) {
                params.store_id = storeId
            }
            const stocks = await getOptionsStock(params);
            setOptionsStock(stocks);
        } catch (error) {
            notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
        }
    };

    useEffect(() => {
        // Get options business
        getOptionBusiness();
    }, [areaId]);

    const getOptionBusiness = async () => {
        try {
            let params = {}
            if (areaId) {
                params.area_id = areaId
            }
            const business = await getOptionsBusiness(params);
            setOptionsBusiness(mapDataOptions4SelectCustom(business));
        } catch (error) {
            notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
        }
    };

    const handleChangeStore = async (store) => {
        try {
            methods.clearErrors(`store`);
            // const stocks = await getOptionsStock({ store_id: store.value });
            // setOptionsStock(mapDataOptions4Select(stocks));
            const storeSelected = optionsStore.find(s => s?.id === store?.value)
            methods.reset({
                ...methods.getValues(),
                store,
                stock: undefined,
                from_date: undefined,
                to_date: undefined,
                // output_type: undefined,
                area: undefined,
                business: undefined,
                products: [],
                area: storeSelected?.area_id,
                business: storeSelected?.business_id
            });
        } catch (error) {
            notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
        }
    };

    
    const handleChangeArea = async (value) => {
        try {
            methods.setValue('area', value)
            methods.setValue('business', undefined)
        } catch (error) {
            notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
        }
    };

    useEffect(() => {
        // Get options stock in request
        if (stockId) {
            getStockInRequest();
        }
    }, [stockId]);

    const getStockInRequest = async () => {
        try {
            const stockInRequest = await getOptionsStockInRequest({stockId});
            setOptionsStockInRequest(mapDataOptions4Select(stockInRequest));
        } catch (error) {
            notification.error({ message: error.message || 'Lỗi tải dữ liệu.' });
        }
    };

    return (
        <BWAccordion title='Thông tin' id='bw_info' isRequired={true}>
            <div className='bw_row'>
                <FormItem className='bw_col_4' label='Cửa hàng áp dụng'>
                    <FormDebouneSelect
                        field={`store`}
                        fetchOptions={fetchOptionsStore}
                        allowClear={true}
                        placeholder='--Chọn--'
                        list={mapDataOptions4Select(optionsStore)}
                        onChange={handleChangeStore}
                    />
                </FormItem>
                <FormItem className='bw_col_4' label='Kho hàng áp dụng' isRequired={true}>
                    <FormSelect field={`stock`} allowClear={true} placeholder='--Chọn--' list={mapDataOptions4Select(optionsStock)} />
                </FormItem>
                <FormItem className='bw_col_4' label='Thời gian áp dụng' isRequired={true}>
                    <FormRangePicker
                        fieldStart={'from_date'}
                        fieldEnd='to_date'
                        placeholder={['Từ ngày', 'Đến ngày']}
                        format={['DD/MM/YYYY', 'DD/MM/YYYY']}
                        allowClear={true}
                    />
                </FormItem>
                <FormItem className='bw_col_4' label='Hình thức xuất' isRequired={true}>
                    <FormSelect field={`output_type`} allowClear={true} placeholder='--Chọn--' list={optionsOutputType} />
                </FormItem>
                <FormItem className='bw_col_4' label='Khu vực' isRequired={true} disabled={storeId ? true : false}>
                    <FormSelect field={`area`} allowClear={true} placeholder='--Chọn--' list={optionsArea} onChange={handleChangeArea}/>
                </FormItem>
                <FormItem className='bw_col_4' label='Chi nhánh' isRequired={true} disabled={storeId ? true : false} >
                    <FormSelect field={`business`} allowClear={true} placeholder='--Chọn--' list={optionsBusiness} />
                </FormItem>
                <FormItem className='bw_col_4' label='Phiếu nhập kho'>
                    <FormSelect field={`stock_in_request`} allowClear={true} placeholder='--Chọn--' list={optionsStockInRequest} />
                </FormItem>
            </div>
        </BWAccordion>
    );
}
